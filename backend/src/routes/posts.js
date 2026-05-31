import { Router } from 'express';
import Post from '../models/Post.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import { postLimiter } from '../middleware/security.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Get all approved posts (public, paginated)
router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;
  const sort = req.query.sort === 'popular' ? { 'upvotes.length': -1 } : { createdAt: -1 };

  const [posts, total] = await Promise.all([
    Post.find({ status: 'approved' })
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ status: 'approved' }),
  ]);

  res.json({ success: true, data: posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

// Get single post
router.get('/:id', asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name username avatar')
    .populate('comments.user', 'name username');
  if (!post) throw ApiError.notFound('Post not found');
  res.json({ success: true, data: post });
}));

// Create post
router.post('/', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { title, content, category, image } = req.body;

  if (!title?.trim() || !content?.trim() || !category) {
    throw ApiError.badRequest('Title, content, and category are required');
  }

  const post = await Post.create({
    author: req.user._id,
    title: title.trim(),
    content: content.trim(),
    category,
    image: image || '',
    status: 'approved',
  });

  await post.populate('author', 'name username avatar');
  res.status(201).json({ success: true, data: post });
}));

// Upvote toggle
router.post('/:id/upvote', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  const userId = req.user._id;
  const index = post.upvotes.indexOf(userId);

  if (index > -1) {
    post.upvotes.splice(index, 1);
  } else {
    post.upvotes.push(userId);
  }

  await post.save();
  res.json({ success: true, upvotes: post.upvotes.length, hasUpvoted: index === -1 });
}));

// Add comment
router.post('/:id/comments', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  post.comments.push({ user: req.user._id, text: text.trim() });
  await post.save();

  await post.populate('comments.user', 'name username');
  res.status(201).json({ success: true, data: post.comments[post.comments.length - 1] });
}));

// Delete comment
router.delete('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw ApiError.notFound('Post not found');

  const comment = post.comments.id(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to delete this comment');
  }

  comment.deleteOne();
  await post.save();
  res.json({ success: true, message: 'Comment deleted' });
}));

// ADMIN: Get all posts
router.get('/admin/all', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'name username email')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: posts });
}));

// ADMIN: Update post status
router.patch('/:id/status', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw ApiError.badRequest('Status must be approved or rejected');
  }

  const post = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('author', 'name email');
  if (!post) throw ApiError.notFound('Post not found');

  res.json({ success: true, data: post });
}));

// ADMIN: Delete post
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  res.json({ success: true, message: 'Post deleted' });
}));

export default router;
