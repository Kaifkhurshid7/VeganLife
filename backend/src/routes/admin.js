import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import PostVote from '../models/PostVote.js';
import PollVote from '../models/PollVote.js';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import Report from '../models/Report.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { cache } from '../utils/cache.js';

const router = Router();

// All admin routes require an authenticated admin.
router.use(authenticate, adminOnly);

// Invalidate every cached feed/hashtag/trending snapshot after a mutation.
async function bumpPostsCache() {
  await cache.incr('postsCacheVersion');
}

// Dashboard stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [users, posts, pending, approved, rejected, comments, rooms, messages, openReports] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Post.countDocuments({ status: 'pending' }),
    Post.countDocuments({ status: 'approved' }),
    Post.countDocuments({ status: 'rejected' }),
    Comment.countDocuments(),
    Room.countDocuments(),
    Message.countDocuments(),
    Report.countDocuments({ status: 'open' }),
  ]);

  res.json({
    success: true,
    data: { users, posts, pending, approved, rejected, comments, rooms, messages, openReports },
  });
}));

// List users with optional search + pagination. Includes per-user post counts.
router.get('/users', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { username: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const postCounts = await Post.aggregate([
    { $match: { author: { $in: users.map((u) => u._id) } } },
    { $group: { _id: '$author', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(postCounts.map((p) => [String(p._id), p.count]));

  res.json({
    success: true,
    data: users.map((u) => ({ ...u, postCount: countMap.get(String(u._id)) || 0 })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}));

// Promote / demote a user. Guards: you can't change your own role, and you can't
// demote the last remaining admin (which would lock everyone out).
router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid user id');

  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw ApiError.badRequest('Role must be user or admin');

  if (String(id) === String(req.user._id)) {
    throw ApiError.badRequest('You cannot change your own role');
  }

  const target = await User.findById(id);
  if (!target) throw ApiError.notFound('User not found');

  if (target.role === 'admin' && role === 'user') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) throw ApiError.badRequest('Cannot demote the last admin');
  }

  target.role = role;
  await target.save();
  res.json({ success: true, data: target.toPublicJSON() });
}));

// Delete a user and every piece of data they own (posts, comments, votes, poll
// votes, messages, social references). Guards: you can't delete yourself, and you
// can't delete the last remaining admin.
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid user id');

  if (String(id) === String(req.user._id)) {
    throw ApiError.badRequest('You cannot delete your own account from the admin panel');
  }

  const target = await User.findById(id);
  if (!target) throw ApiError.notFound('User not found');

  if (target.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) throw ApiError.badRequest('Cannot delete the last admin');
  }

  await cascadeDeleteUser(id);
  res.json({ success: true, message: 'User deleted' });
}));

// List all comments (admin moderation). Searchable by comment text, author, or
// post title; paginated so the list stays fast as the community grows.
router.get('/comments', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);

  let filter = {};
  if (q) {
    const [matchingUsers, matchingPosts] = await Promise.all([
      User.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { username: { $regex: q, $options: 'i' } },
        ],
      }).select('_id').lean(),
      Post.find({ title: { $regex: q, $options: 'i' } }).select('_id').lean(),
    ]);
    filter.$or = [
      { text: { $regex: q, $options: 'i' } },
      { user: { $in: matchingUsers.map((u) => u._id) } },
      { post: { $in: matchingPosts.map((p) => p._id) } },
    ];
  }

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name username avatar')
      .populate('post', 'title')
      .lean(),
    Comment.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: comments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}));

// Delete any comment (admin) — cascades to its replies and keeps the post's
// commentCount (which counts top-level comments only) in sync.
router.delete('/comments/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid comment id');

  const comment = await Comment.findById(id);
  if (!comment) throw ApiError.notFound('Comment not found');

  const isTopLevel = !comment.parent;
  const replies = await Comment.find({ parent: comment._id }).select('_id');
  await Comment.deleteMany({ _id: { $in: [comment._id, ...replies.map((r) => r._id)] } });

  // commentCount tracks top-level comments only (matches the posts route)
  if (isTopLevel) {
    await Post.updateOne({ _id: comment.post }, { $inc: { commentCount: -1 } });
  }
  await bumpPostsCache();
  res.json({ success: true, message: 'Comment deleted' });
}));

// List the moderation queue. Filter by status (default: open), paginated. Renders
// from the denormalized snapshots captured at report time, so rows survive even
// after the reported content is deleted.
router.get('/reports', asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'open');
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);

  const filter = status === 'all' ? {} : { status };

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reporter', 'name username avatar')
      .populate('resolvedBy', 'name username')
      .lean(),
    Report.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: reports,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}));

// Transition a report between open / dismissed / actioned.
router.patch('/reports/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid report id');

  const { status } = req.body;
  if (!['open', 'dismissed', 'actioned'].includes(status)) {
    throw ApiError.badRequest('Status must be open, dismissed, or actioned');
  }

  const report = await Report.findById(id);
  if (!report) throw ApiError.notFound('Report not found');

  report.status = status;
  if (status === 'open') {
    report.resolvedBy = undefined;
    report.resolvedAt = undefined;
  } else {
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
  }
  await report.save();

  res.json({ success: true, data: report });
}));

// List all chat rooms with per-room message counts
router.get('/rooms', asyncHandler(async (req, res) => {
  const [rooms, messageCounts] = await Promise.all([
    Room.find().sort({ isDefault: -1, createdAt: -1 }).lean(),
    Message.aggregate([{ $group: { _id: '$room', count: { $sum: 1 } } }]),
  ]);
  const countMap = new Map(messageCounts.map((m) => [String(m._id), m.count]));
  res.json({ success: true, data: rooms.map((r) => ({ ...r, messageCount: countMap.get(String(r._id)) || 0 })) });
}));

// Delete a chat room and its messages (admin). Reuses the rooms route behaviour.
router.delete('/rooms/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid room id');

  const room = await Room.findByIdAndDelete(id);
  if (!room) throw ApiError.notFound('Room not found');

  await Message.deleteMany({ room: id });
  res.json({ success: true, message: 'Room deleted' });
}));

// Remove a user's posts. Deletes the posts and everything attached to them, then
// fixes the denormalized counters on any posts the user voted on / commented on.
async function cascadeDeleteUser(userId) {
  // 1. Their posts — cascade comments, votes, and poll votes attached to them
  const theirPosts = await Post.find({ author: userId }).select('_id').lean();
  const postIds = theirPosts.map((p) => p._id);
  if (postIds.length > 0) {
    await Promise.all([
      Comment.deleteMany({ post: { $in: postIds } }),
      PostVote.deleteMany({ post: { $in: postIds } }),
      PollVote.deleteMany({ post: { $in: postIds } }),
    ]);
    await Post.deleteMany({ _id: { $in: postIds } });
  }

  // 2. Their comments (and replies to those comments), fixing post commentCount
  const theirComments = await Comment.find({ user: userId }).select('_id parent post').lean();
  const theirCommentIds = theirComments.map((c) => c._id);
  if (theirCommentIds.length > 0) {
    const topLevelByPost = {};
    for (const c of theirComments) {
      if (!c.parent) topLevelByPost[String(c.post)] = (topLevelByPost[String(c.post)] || 0) + 1;
    }
    await Comment.deleteMany({ $or: [{ user: userId }, { parent: { $in: theirCommentIds } }] });
    await Promise.all(
      Object.entries(topLevelByPost).map(([postId, n]) =>
        Post.updateOne({ _id: postId }, { $inc: { commentCount: -n } }),
      ),
    );
  }

  // 3. Their upvotes — decrement the upvote count on every post they voted on
  const theirVotes = await PostVote.find({ user: userId }).select('post').lean();
  if (theirVotes.length > 0) {
    const byPost = {};
    for (const v of theirVotes) byPost[String(v.post)] = (byPost[String(v.post)] || 0) + 1;
    await Promise.all(
      Object.entries(byPost).map(([postId, n]) =>
        Post.updateOne({ _id: postId }, { $inc: { upvoteCount: -n } }),
      ),
    );
    await PostVote.deleteMany({ user: userId });
  }

  // 4. Their poll votes — decrement the option counts they voted for
  const theirPollVotes = await PollVote.find({ user: userId }).lean();
  if (theirPollVotes.length > 0) {
    for (const pv of theirPollVotes) {
      await Post.updateOne(
        { _id: pv.post, 'polls._id': pv.poll },
        { $inc: { [`polls.$.options.${pv.optionIndex}.voteCount`]: -1 } },
      );
    }
    await PollVote.deleteMany({ user: userId });
  }

  // 5. Their chat messages
  await Message.deleteMany({ sender: userId });

  // 6. Remove them from other users' social graphs and mentions
  await User.updateMany(
    { _id: { $ne: userId } },
    { $pull: { followers: userId, following: userId, 'mentions': { mentionedBy: userId } } },
  );

  // 7. Remove their pins from posts and recompute pin state
  const pinnedPosts = await Post.find({ pinnedBy: userId }).select('pinnedBy').lean();
  for (const post of pinnedPosts) {
    const pinnedBy = post.pinnedBy.filter((id) => String(id) !== String(userId));
    await Post.updateOne(
      { _id: post._id },
      { pinnedBy, pinCount: pinnedBy.length, isPinned: pinnedBy.length > 0 },
    );
  }

  // 8. Detach rooms they created (leave the room itself alive)
  await Room.updateMany({ createdBy: userId }, { $unset: { createdBy: 1 } });

  // 9. Finally, the user themselves
  await User.deleteOne({ _id: userId });
  await bumpPostsCache();
}

export default router;
