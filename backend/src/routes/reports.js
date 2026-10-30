import { Router } from 'express';
import { query, one, isUuid } from '../db/index.js';
import { reportJson } from '../db/mappers.js';
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
  const { targetType, targetId, reason } = req.body;
  const details = String(req.body.details || '');

  if (!['post', 'comment', 'user'].includes(targetType)) {
    throw ApiError.badRequest('targetType must be post, comment, or user');
  }
  if (!isUuid(targetId)) throw ApiError.badRequest('Invalid target id');
  if (!reason || !REPORT_REASONS.includes(reason)) throw ApiError.badRequest('Invalid report reason');
  if (details.length > 500) throw ApiError.badRequest('Details too long (max 500 chars)');

  // Resolve the target and build the snapshot
  let snapshot;
  if (targetType === 'post') {
    const post = await one(
      `select p.title, p.content, p.author_id, u.name, u.username
         from posts p join users u on u.id = p.author_id where p.id = $1`,
      [targetId],
    );
    if (!post) throw ApiError.notFound('Post not found');
    if (String(post.author_id) === String(req.user.id)) throw ApiError.badRequest('You cannot report your own post');
    snapshot = [post.title || '', (post.content || '').slice(0, 200), post.name || '', post.username || ''];
  } else if (targetType === 'comment') {
    const comment = await one(
      `select c.text, c.user_id, u.name, u.username, p.title as post_title
         from comments c join users u on u.id = c.user_id join posts p on p.id = c.post_id where c.id = $1`,
      [targetId],
    );
    if (!comment) throw ApiError.notFound('Comment not found');
    if (String(comment.user_id) === String(req.user.id)) throw ApiError.badRequest('You cannot report your own comment');
    snapshot = [comment.post_title || '', (comment.text || '').slice(0, 200), comment.name || '', comment.username || ''];
  } else {
    const user = await one('select id, name, username from users where id = $1', [targetId]);
    if (!user) throw ApiError.notFound('User not found');
    if (String(user.id) === String(req.user.id)) throw ApiError.badRequest('You cannot report yourself');
    snapshot = [user.name || '', '', user.name || '', user.username || ''];
  }

  // The unique index (target_type, target_id, reporter_id) makes this idempotent; a
  // duplicate comes back as 23505, which the error handler turns into a 409.
  const row = await one(
    `insert into reports (reporter_id, target_type, target_id, reason, details,
                          target_title, target_snippet, target_author_name, target_author_username)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning *`,
    [req.user.id, targetType, targetId, reason, details, ...snapshot],
  );
  res.status(201).json({ success: true, data: reportJson(row) });
}));

export default router;
