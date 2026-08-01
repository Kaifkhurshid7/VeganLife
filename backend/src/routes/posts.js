import { Router } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import PostVote from '../models/PostVote.js';
import PollVote from '../models/PollVote.js';
import User from '../models/User.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import { postLimiter } from '../middleware/security.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { upload } from '../config/multer.js';
import { uploadImage } from '../utils/uploadService.js';
import { extractHashtags, extractMentions } from '../utils/textParser.js';
import { checkAndAwardBadges } from '../utils/badges.js';
import { cache } from '../utils/cache.js';

const router = Router();

const POSTS_CACHE_VERSION_KEY = 'postsCacheVersion';
const POSTS_CACHE_TTL_MS = 30 * 1000;

// Version-bumped cache keys: any post mutation bumps the version, instantly
// invalidating every cached feed/hashtag/trending snapshot.
async function cacheVersion() {
  return (await cache.get(POSTS_CACHE_VERSION_KEY)) || 0;
}

async function bumpCacheVersion() {
  await cache.incr(POSTS_CACHE_VERSION_KEY);
}

// Enrich lean posts with the requesting user's vote state (hasUpvoted, poll hasVoted).
// Two indexed lookups cover the whole page — no per-post queries.
async function decorateForUser(posts, userId) {
  if (!userId || posts.length === 0) return posts;
  const ids = posts.map((p) => p._id);
  const [votes, pollVotes] = await Promise.all([
    PostVote.find({ post: { $in: ids }, user: userId }).select('post').lean(),
    PollVote.find({ post: { $in: ids }, user: userId }).select('poll optionIndex').lean(),
  ]);
  const votedPosts = new Set(votes.map((v) => String(v.post)));
  const pollVoteMap = new Map(pollVotes.map((v) => [String(v.poll), v.optionIndex]));

  return posts.map((post) => {
    const polls = (post.polls || []).map((poll) => {
      const votedIdx = pollVoteMap.has(String(poll._id)) ? pollVoteMap.get(String(poll._id)) : null;
      const options = (poll.options || []).map((opt, i) => ({ ...opt, hasVoted: i === votedIdx }));
      const totalVotes = options.reduce((sum, opt) => sum + (opt.voteCount || 0), 0);
      return { ...poll, options, totalVotes, hasVoted: votedIdx };
    });
    return { ...post, polls, hasUpvoted: votedPosts.has(String(post._id)) };
  });
}

// Get approved posts (public, paginated, cached)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const sort = req.query.sort === 'popular' ? 'popular' : 'latest';
  const categories = req.query.categories
    ? String(req.query.categories).split(',').map((c) => c.trim()).filter(Boolean)
    : null;

  const filter = { status: 'approved' };
  if (categories && categories.length) filter.category = { $in: categories };

  const cacheKey = `feed:${await cacheVersion()}:${page}:${limit}:${sort}:${(categories || []).join(',')}`;

  let posts;
  let total;
  const cached = await cache.get(cacheKey);
  if (cached) {
    ({ posts, total } = cached);
  } else {
    const skip = (page - 1) * limit;
    const mongoSort = sort === 'popular' ? { upvoteCount: -1 } : { createdAt: -1 };
    [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name username avatar')
        .sort(mongoSort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);
    await cache.set(cacheKey, { posts, total }, POSTS_CACHE_TTL_MS);
  }

  const data = await decorateForUser(posts, req.user?._id);
  res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

// Get single post
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name username avatar').lean();
  if (!post) throw ApiError.notFound('Post not found');
  const [data] = await decorateForUser([post], req.user?._id);
  res.json({ success: true, data });
}));

// Get paginated top-level comments for a post (replies bundled per comment)
router.get('/:id/comments', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid post id');

  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const filter = { post: id, parent: null };
  if (req.query.before && mongoose.isValidObjectId(req.query.before)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(req.query.before) };
  }

  const comments = await Comment.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate('user', 'name username avatar')
    .lean();

  const hasMore = comments.length > limit;
  const page = hasMore ? comments.slice(0, limit) : comments;
  const nextCursor = page.length > 0 ? page[page.length - 1]._id : null;

  // Fetch replies for this page in a single query
  const topIds = page.map((c) => c._id);
  const replies = await Comment.find({ parent: { $in: topIds } })
    .sort({ _id: 1 })
    .populate('user', 'name username avatar')
    .lean();
  const repliesByParent = {};
  for (const reply of replies) {
    (repliesByParent[reply.parent] = repliesByParent[reply.parent] || []).push(reply);
  }

  const data = page.map((c) => ({ ...c, replies: repliesByParent[c._id] || [] }));
  res.json({ success: true, data, hasMore, nextCursor });
}));

// Create post
router.post('/', authenticate, postLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title?.trim() || !content?.trim() || !category) {
    throw ApiError.badRequest('Title, content, and category are required');
  }

  // If file was uploaded, store it (Cloudinary when configured, else local disk)
  let image = '';
  if (req.file) {
    image = await uploadImage(req.file);
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
    mentionedUsers = users.map((u) => u._id);

    // Notify mentioned users
    for (const user of users) {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            mentions: {
              post: undefined, // Will set after post is created
              mentionedBy: req.user._id,
              createdAt: new Date(),
            },
          },
        },
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
      { $set: { 'mentions.$[elem].post': post._id } },
      { arrayFilters: [{ 'elem.post': undefined }] },
    );
  }

  await post.populate('author', 'name username avatar');

  // Check for badge achievements
  checkAndAwardBadges(req.user._id).catch(() => {});
  await bumpCacheVersion();

  res.status(201).json({ success: true, data: post });
}));

// Upvote toggle (idempotent — the unique {post, user} index guards double votes)
router.post('/:id/upvote', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).select('_id author');
  if (!post) throw ApiError.notFound('Post not found');

  const removed = await PostVote.findOneAndDelete({ post: post._id, user: req.user._id });
  if (removed) {
    const updated = await Post.findByIdAndUpdate(post._id, { $inc: { upvoteCount: -1 } }, { new: true }).select('upvoteCount');
    return res.json({ success: true, upvoteCount: updated.upvoteCount, hasUpvoted: false });
  }

  try {
    await PostVote.create({ post: post._id, user: req.user._id });
  } catch (err) {
    // Two tabs voted simultaneously — the other one won the race
    if (err.code === 11000) {
      const updated = await Post.findById(post._id).select('upvoteCount');
      return res.json({ success: true, upvoteCount: updated.upvoteCount, hasUpvoted: true });
    }
    throw err;
  }

  const updated = await Post.findByIdAndUpdate(post._id, { $inc: { upvoteCount: 1 } }, { new: true }).select('upvoteCount');
  checkAndAwardBadges(post.author).catch(() => {});
  res.json({ success: true, upvoteCount: updated.upvoteCount, hasUpvoted: true });
}));

// Add top-level comment
router.post('/:id/comments', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const post = await Post.findById(req.params.id).select('_id');
  if (!post) throw ApiError.notFound('Post not found');

  const comment = await Comment.create({ post: post._id, user: req.user._id, text: text.trim() });
  await Post.updateOne({ _id: post._id }, { $inc: { commentCount: 1 } });
  checkAndAwardBadges(req.user._id).catch(() => {});

  await comment.populate('user', 'name username avatar');
  res.status(201).json({ success: true, data: comment });
}));

// Add nested reply
router.post('/:postId/comments/:commentId/reply', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Reply text is required');
  if (text.length > 500) throw ApiError.badRequest('Reply too long (max 500 chars)');

  const parent = await Comment.findById(commentId).select('post');
  if (!parent || String(parent.post) !== postId) throw ApiError.notFound('Comment not found');

  const reply = await Comment.create({ post: postId, user: req.user._id, parent: commentId, text: text.trim() });
  await reply.populate('user', 'name username avatar');
  res.status(201).json({ success: true, data: reply });
}));

// Edit comment (owner or admin)
router.patch('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to edit this comment');
  }

  comment.text = text.trim();
  await comment.save();
  await comment.populate('user', 'name username avatar');
  res.json({ success: true, data: comment });
}));

// Delete comment (owner or admin) — cascades to its replies
router.delete('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to delete this comment');
  }

  const isTopLevel = !comment.parent;
  const replies = await Comment.find({ parent: comment._id }).select('_id');
  await Comment.deleteMany({ _id: { $in: [comment._id, ...replies.map((r) => r._id)] } });

  // commentCount tracks top-level comments only (matches the old `comments.length` semantics)
  if (isTopLevel) {
    await Post.updateOne({ _id: comment.post }, { $inc: { commentCount: -1 } });
  }
  res.json({ success: true, message: 'Comment deleted' });
}));

// React to a comment
router.post('/:postId/comments/:commentId/react', authenticate, asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  if (!emoji?.trim()) throw ApiError.badRequest('Emoji is required');

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  const userId = req.user._id;
  const existingIdx = comment.reactions.findIndex(
    (r) => r.user.toString() === userId.toString() && r.emoji === emoji,
  );
  if (existingIdx > -1) comment.reactions.splice(existingIdx, 1);
  else comment.reactions.push({ user: userId, emoji });

  await comment.save();
  res.json({ success: true, reactions: comment.reactions });
}));

// Pin/unpin comment (post author or admin)
router.post('/:postId/comments/:commentId/pin', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).select('author');
  if (!post) throw ApiError.notFound('Post not found');
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can pin comments');
  }

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  comment.isPinned = !comment.isPinned;
  await comment.save();
  res.json({ success: true, isPinned: comment.isPinned });
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

// ADMIN: Delete post (cascades to comments and votes)
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  await Promise.all([
    Comment.deleteMany({ post: post._id }),
    PostVote.deleteMany({ post: post._id }),
    PollVote.deleteMany({ post: post._id }),
  ]);
  await bumpCacheVersion();
  res.json({ success: true, message: 'Post deleted' });
}));

// Pin/Unpin post
router.post('/:id/pin', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).select('pinnedBy isPinned pinCount');
  if (!post) throw ApiError.notFound('Post not found');

  const userId = req.user._id;
  const index = post.pinnedBy.findIndex((id) => id.toString() === userId.toString());

  if (index > -1) {
    post.pinnedBy.splice(index, 1);
  } else {
    post.pinnedBy.push(userId);
  }
  post.pinCount = post.pinnedBy.length;
  post.isPinned = post.pinCount > 0;
  await post.save();

  res.json({ success: true, isPinned: index === -1, pinCount: post.pinCount });
}));

// Create poll (post author or admin)
router.post('/:id/polls', authenticate, asyncHandler(async (req, res) => {
  const { question, options } = req.body;

  if (!question?.trim()) throw ApiError.badRequest('Poll question is required');
  if (!Array.isArray(options) || options.length < 2) {
    throw ApiError.badRequest('Poll must have at least 2 options');
  }

  const post = await Post.findById(req.params.id).select('author polls');
  if (!post) throw ApiError.notFound('Post not found');
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can create polls');
  }

  post.polls.push({ question: question.trim(), options: options.map((opt) => ({ text: opt.trim(), voteCount: 0 })) });
  await post.save();

  res.status(201).json({ success: true, data: post.polls[post.polls.length - 1] });
}));

// Vote on poll (revoting moves the user's existing vote)
router.post('/:id/polls/:pollId/vote', authenticate, asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;
  if (typeof optionIndex !== 'number' || optionIndex < 0) {
    throw ApiError.badRequest('Invalid option index');
  }

  const post = await Post.findById(req.params.id).select('polls');
  if (!post) throw ApiError.notFound('Post not found');
  const poll = post.polls.id(req.params.pollId);
  if (!poll) throw ApiError.notFound('Poll not found');
  if (optionIndex >= poll.options.length) throw ApiError.badRequest('Invalid option index');

  // Move an existing vote to the new option (positional $ resolves against the filter's poll match)
  const existing = await PollVote.findOneAndDelete({ poll: poll._id, user: req.user._id });
  if (existing && existing.optionIndex !== optionIndex) {
    await Post.updateOne(
      { _id: post._id, 'polls._id': poll._id },
      { $inc: { [`polls.$.options.${existing.optionIndex}.voteCount`]: -1 } },
    );
  }

  await PollVote.create({ post: post._id, poll: poll._id, optionIndex, user: req.user._id });
  await Post.updateOne(
    { _id: post._id, 'polls._id': poll._id },
    { $inc: { [`polls.$.options.${optionIndex}.voteCount`]: 1 } },
  );

  // Return the refreshed poll with the user's vote flagged
  const fresh = await Post.findById(post._id, { polls: 1 }).lean();
  const freshPoll = fresh.polls.find((p) => String(p._id) === String(poll._id));
  const options = freshPoll.options.map((opt, i) => ({ ...opt, hasVoted: i === optionIndex }));
  const totalVotes = options.reduce((sum, opt) => sum + (opt.voteCount || 0), 0);

  res.json({ success: true, data: { ...freshPoll, options, totalVotes, hasVoted: optionIndex } });
}));

// Search posts by hashtag (cached)
router.get('/hashtag/:tag', optionalAuth, asyncHandler(async (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const cacheKey = `hashtag:${await cacheVersion()}:${tag}:${page}:${limit}`;

  let posts;
  let total;
  const cached = await cache.get(cacheKey);
  if (cached) {
    ({ posts, total } = cached);
  } else {
    const skip = (page - 1) * limit;
    [posts, total] = await Promise.all([
      Post.find({ status: 'approved', hashtags: tag })
        .populate('author', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ status: 'approved', hashtags: tag }),
    ]);
    await cache.set(cacheKey, { posts, total }, POSTS_CACHE_TTL_MS);
  }

  const data = await decorateForUser(posts, req.user?._id);
  res.json({ success: true, data, hashtag: tag, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

// Get trending hashtags (cached)
router.get('/trending/hashtags', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cacheKey = `trending:${await cacheVersion()}:${limit}`;

  let trending = await cache.get(cacheKey);
  if (!trending) {
    trending = await Post.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);
    await cache.set(cacheKey, trending, POSTS_CACHE_TTL_MS);
  }

  res.json({ success: true, data: trending });
}));

export default router;
