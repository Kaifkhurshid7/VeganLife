import { Router } from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import { postLimiter } from '../middleware/security.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { upload } from '../config/multer.js';
import { extractHashtags, extractMentions } from '../utils/textParser.js';
import { checkAndAwardBadges } from '../utils/badges.js';

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
router.post('/', authenticate, postLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title?.trim() || !content?.trim() || !category) {
    throw ApiError.badRequest('Title, content, and category are required');
  }

  // If file was uploaded, use the file path; otherwise check for base64 image
  let image = '';
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    image = req.body.image;
  }

  // Extract hashtags and mentions from content
  const hashtags = extractHashtags(content);
  const mentionedUsernames = extractMentions(content);

  // Find mentioned users
  let mentionedUsers = [];
  if (mentionedUsernames.length > 0) {
    const users = await User.find({ username: { $in: mentionedUsernames } }).select('_id');
    mentionedUsers = users.map(u => u._id);

    // Notify mentioned users
    for (const user of users) {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            mentions: {
              post: undefined, // Will set after post is created
              mentionedBy: req.user._id,
              createdAt: new Date()
            }
          }
        }
      );
    }
  }

  const post = await Post.create({
    author: req.user._id,
    title: title.trim(),
    content: content.trim(),
    category,
    image,
    hashtags,
    mentions: mentionedUsers,
    status: 'approved',
  });

  // Update mentions with post reference
  if (mentionedUsers.length > 0) {
    await User.updateMany(
      { _id: { $in: mentionedUsers } },
      {
        $set: { 'mentions.$[elem].post': post._id }
      },
      { arrayFilters: [{ 'elem.post': undefined }] }
    );
  }

  await post.populate('author', 'name username avatar');

  // Check for badge achievements
  checkAndAwardBadges(req.user._id).catch(() => {});

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

  // Check badges for the post author (they received an upvote)
  if (index === -1) {
    checkAndAwardBadges(post.author).catch(() => {});
  }

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

  // Check for badge achievements
  checkAndAwardBadges(req.user._id).catch(() => {});

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

// Pin/Unpin post
router.post('/:id/pin', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  const userId = req.user._id;
  const index = post.pinnedBy.findIndex(id => id.toString() === userId.toString());

  if (index > -1) {
    post.pinnedBy.splice(index, 1);
    post.isPinned = post.pinnedBy.length > 0;
  } else {
    post.pinnedBy.push(userId);
    post.isPinned = true;
  }

  await post.save();
  res.json({ success: true, isPinned: index === -1, pinCount: post.pinnedBy.length });
}));

// Create poll
router.post('/:id/polls', authenticate, asyncHandler(async (req, res) => {
  const { question, options } = req.body;

  if (!question?.trim()) throw ApiError.badRequest('Poll question is required');
  if (!Array.isArray(options) || options.length < 2) {
    throw ApiError.badRequest('Poll must have at least 2 options');
  }

  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can create polls');
  }

  const pollOptions = options.map(opt => ({
    text: opt.trim(),
    votes: []
  }));

  post.polls.push({ question: question.trim(), options: pollOptions });
  await post.save();

  res.status(201).json({ success: true, data: post.polls[post.polls.length - 1] });
}));

// Vote on poll
router.post('/:id/polls/:pollId/vote', authenticate, asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  const poll = post.polls.id(req.params.pollId);
  if (!poll) throw ApiError.notFound('Poll not found');

  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
    throw ApiError.badRequest('Invalid option index');
  }

  const userId = req.user._id;

  // Remove user from all options (only one vote per user per poll)
  poll.options.forEach(option => {
    const userIndex = option.votes.findIndex(id => id.toString() === userId.toString());
    if (userIndex > -1) option.votes.splice(userIndex, 1);
  });

  // Add vote to selected option
  poll.options[optionIndex].votes.push(userId);

  await post.save();
  res.json({ success: true, data: poll });
}));

// Add nested reply to comment
router.post('/:postId/comments/:commentId/reply', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Reply text is required');
  if (text.length > 500) throw ApiError.badRequest('Reply too long (max 500 chars)');

  const post = await Post.findById(req.params.postId);
  if (!post) throw ApiError.notFound('Post not found');

  const parentComment = post.comments.id(req.params.commentId);
  if (!parentComment) throw ApiError.notFound('Comment not found');

  // Create a new comment as a reply
  const replyComment = {
    user: req.user._id,
    text: text.trim(),
    replies: [],
    reactions: [],
    isPinned: false,
  };

  parentComment.replies.push(replyComment);
  await post.save();

  await post.populate('comments.user', 'name username');
  res.status(201).json({ success: true, data: replyComment });
}));

// Add reaction to comment
router.post('/:postId/comments/:commentId/react', authenticate, asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  if (!emoji?.trim()) throw ApiError.badRequest('Emoji is required');

  const post = await Post.findById(req.params.postId);
  if (!post) throw ApiError.notFound('Post not found');

  const comment = post.comments.id(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  const userId = req.user._id;
  const existingReaction = comment.reactions.findIndex(
    r => r.user.toString() === userId.toString() && r.emoji === emoji
  );

  if (existingReaction > -1) {
    comment.reactions.splice(existingReaction, 1);
  } else {
    comment.reactions.push({ user: userId, emoji });
  }

  await post.save();
  res.json({ success: true, reactions: comment.reactions });
}));

// Edit comment
router.patch('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const post = await Post.findById(req.params.postId);
  if (!post) throw ApiError.notFound('Post not found');

  const comment = post.comments.id(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to edit this comment');
  }

  comment.text = text.trim();
  await post.save();

  res.json({ success: true, data: comment });
}));

// Pin/Unpin comment
router.post('/:postId/comments/:commentId/pin', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw ApiError.notFound('Post not found');

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can pin comments');
  }

  const comment = post.comments.id(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  comment.isPinned = !comment.isPinned;
  await post.save();

  res.json({ success: true, isPinned: comment.isPinned });
}));

// Search posts by hashtag
router.get('/hashtag/:tag', asyncHandler(async (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ status: 'approved', hashtags: tag })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ status: 'approved', hashtags: tag }),
  ]);

  res.json({ success: true, data: posts, hashtag: tag, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

// Get trending hashtags
router.get('/trending/hashtags', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const trending = await Post.aggregate([
    { $match: { status: 'approved' } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { _id: 0, tag: '$_id', count: 1 } }
  ]);

  res.json({ success: true, data: trending });
}));

export default router;
