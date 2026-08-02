import { Router } from 'express';
import mongoose from 'mongoose';
import Report from '../models/Report.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { REPORT_REASONS } from '../constants/report.js';

const router = Router();

// All report submissions require an authenticated user.
router.use(authenticate);

// Capture a report against a post, comment, or user. Snapshots the target so the
// admin queue renders fast and survives target deletion.
router.post('/', asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, details } = req.body;

  if (!['post', 'comment', 'user'].includes(targetType)) {
    throw ApiError.badRequest('targetType must be post, comment, or user');
  }
  if (!mongoose.isValidObjectId(targetId)) throw ApiError.badRequest('Invalid target id');
  if (!reason || !REPORT_REASONS.includes(reason)) throw ApiError.badRequest('Invalid report reason');
  if (details && details.length > 500) throw ApiError.badRequest('Details too long (max 500 chars)');

  // Resolve the target and build the snapshot
  let snapshot = { targetTitle: '', targetSnippet: '', targetAuthorName: '', targetAuthorUsername: '' };

  if (targetType === 'post') {
    const post = await Post.findById(targetId).populate('author', 'name username').lean();
    if (!post) throw ApiError.notFound('Post not found');
    if (String(post.author?._id) === String(req.user._id)) {
      throw ApiError.badRequest('You cannot report your own post');
    }
    snapshot = {
      targetTitle: post.title || '',
      targetSnippet: (post.content || '').slice(0, 200),
      targetAuthorName: post.author?.name || '',
      targetAuthorUsername: post.author?.username || '',
    };
  } else if (targetType === 'comment') {
    const comment = await Comment.findById(targetId)
      .populate('user', 'name username')
      .populate('post', 'title')
      .lean();
    if (!comment) throw ApiError.notFound('Comment not found');
    if (String(comment.user?._id) === String(req.user._id)) {
      throw ApiError.badRequest('You cannot report your own comment');
    }
    snapshot = {
      targetTitle: comment.post?.title || '',
      targetSnippet: (comment.text || '').slice(0, 200),
      targetAuthorName: comment.user?.name || '',
      targetAuthorUsername: comment.user?.username || '',
    };
  } else {
    const user = await User.findById(targetId).select('name username').lean();
    if (!user) throw ApiError.notFound('User not found');
    if (String(user._id) === String(req.user._id)) {
      throw ApiError.badRequest('You cannot report yourself');
    }
    snapshot = {
      targetTitle: user.name || '',
      targetSnippet: '',
      targetAuthorName: user.name || '',
      targetAuthorUsername: user.username || '',
    };
  }

  const existing = await Report.findOne({ targetType, targetId, reporter: req.user._id }).lean();
  if (existing) throw ApiError.conflict('You already reported this');

  let report;
  try {
    report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      details: details || '',
      ...snapshot,
    });
  } catch (err) {
    // Two tabs reported the same target at once — the other one won the race
    if (err.code === 11000) throw ApiError.conflict('You already reported this');
    throw err;
  }

  res.status(201).json({ success: true, data: report });
}));

export default router;
