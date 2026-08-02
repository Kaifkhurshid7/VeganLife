import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Search users
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || q.length < 2) {
    throw ApiError.badRequest('Search query must be at least 2 characters');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } }
    ]
  })
    .select('_id name username avatar bio sustainabilityScore followers')
    .limit(parseInt(limit))
    .lean();

  res.json({ success: true, data: users });
}));

// Get user profile by username
router.get('/profile/:username', asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() })
    .select('_id name username email avatar bio sustainabilityScore streak followers following completedChallenges createdAt')
    .lean();

  if (!user) throw ApiError.notFound('User not found');

  // Get user's posts
  const posts = await Post.find({ author: user._id, status: 'approved' })
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .lean();

  // Get follower count details
  const followerCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;
  const postCount = posts.length;

  res.json({
    success: true,
    data: {
      ...user,
      stats: {
        posts: postCount,
        followers: followerCount,
        following: followingCount,
        score: user.sustainabilityScore,
        streak: user.streak
      },
      posts
    }
  });
}));

// Get user profile by ID (including private data if authenticated)
router.get('/:userId', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('_id name username avatar bio sustainabilityScore streak followers following createdAt')
    .lean();

  if (!user) throw ApiError.notFound('User not found');

  const posts = await Post.find({ author: user._id, status: 'approved' })
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .lean();

  const followerCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;
  const postCount = posts.length;

  res.json({
    success: true,
    data: {
      ...user,
      stats: {
        posts: postCount,
        followers: followerCount,
        following: followingCount,
        score: user.sustainabilityScore,
        streak: user.streak
      },
      posts
    }
  });
}));

// Follow user
router.post('/:targetUserId/follow', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  const currentUserId = req.user._id.toString();

  if (targetUserId === currentUserId) {
    throw ApiError.badRequest('Cannot follow yourself');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw ApiError.notFound('User not found');

  const currentUser = await User.findById(currentUserId);

  // Can't follow someone who blocked you, or someone you blocked
  const blockedByIds = (arr = []) => arr.some((id) => String(id) === targetUserId);
  if (blockedByIds(currentUser.blockedUsers) || blockedByIds(targetUser.blockedUsers)) {
    throw ApiError.forbidden('You cannot follow this user');
  }

  // Check if already following
  const isFollowing = currentUser.following?.includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
  } else {
    // Follow
    if (!currentUser.following) currentUser.following = [];
    if (!targetUser.followers) targetUser.followers = [];

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await Promise.all([currentUser.save(), targetUser.save()]);

  res.json({
    success: true,
    message: isFollowing ? 'Unfollowed' : 'Followed',
    isFollowing: !isFollowing,
    followerCount: targetUser.followers?.length || 0
  });
}));

// Block/unblock a user (toggle). Blocking severs the follow relationship in both
// directions and removes any mute, so a blocked user can't follow you, comment on
// your content, or have their posts/comments/chat messages visible to you.
router.post('/:targetUserId/block', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  if (!mongoose.isValidObjectId(targetUserId)) throw ApiError.badRequest('Invalid user id');

  const me = req.user._id;
  const targetId = new mongoose.Types.ObjectId(targetUserId);
  if (String(targetId) === String(me)) throw ApiError.badRequest('You cannot block yourself');

  const target = await User.findById(targetId);
  if (!target) throw ApiError.notFound('User not found');

  const alreadyBlocked = await User.exists({ _id: me, blockedUsers: targetId });
  if (alreadyBlocked) {
    await User.updateOne({ _id: me }, { $pull: { blockedUsers: targetId } });
    return res.json({ success: true, isBlocked: false });
  }

  await User.updateOne(
    { _id: me },
    {
      $addToSet: { blockedUsers: targetId },
      $pull: { following: targetId, followers: targetId, mutedUsers: targetId },
    },
  );
  await User.updateOne({ _id: targetId }, { $pull: { followers: me, following: me } });

  res.json({ success: true, isBlocked: true });
}));

// Mute/unmute a user (toggle). Muting only hides their posts from your feed — the
// follow relationship is left intact.
router.post('/:targetUserId/mute', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  if (!mongoose.isValidObjectId(targetUserId)) throw ApiError.badRequest('Invalid user id');

  const me = req.user._id;
  const targetId = new mongoose.Types.ObjectId(targetUserId);
  if (String(targetId) === String(me)) throw ApiError.badRequest('You cannot mute yourself');

  const target = await User.findById(targetId);
  if (!target) throw ApiError.notFound('User not found');

  const alreadyMuted = await User.exists({ _id: me, mutedUsers: targetId });
  if (alreadyMuted) {
    await User.updateOne({ _id: me }, { $pull: { mutedUsers: targetId } });
    return res.json({ success: true, isMuted: false });
  }

  await User.updateOne({ _id: me }, { $addToSet: { mutedUsers: targetId } });
  res.json({ success: true, isMuted: true });
}));

// Get user's followers
router.get('/:userId/followers', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate('followers', '_id name username avatar sustainabilityScore')
    .lean();

  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, data: user.followers || [] });
}));

// Get user's following
router.get('/:userId/following', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate('following', '_id name username avatar sustainabilityScore')
    .lean();

  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, data: user.following || [] });
}));

// Get user's posts with pagination
router.get('/:userId/posts', asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ author: req.params.userId, status: 'approved' })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ author: req.params.userId, status: 'approved' })
  ]);

  res.json({ success: true, data: posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

// Get user's mentions
router.get('/:userId/mentions', authenticate, asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const user = await User.findById(req.params.userId)
    .populate({
      path: 'mentions',
      populate: [
        { path: 'post' },
        { path: 'mentionedBy', select: '_id name username avatar' }
      ]
    })
    .lean();

  if (!user) throw ApiError.notFound('User not found');

  const mentions = user.mentions || [];
  const paginatedMentions = mentions.slice(skip, skip + limit);

  res.json({
    success: true,
    data: paginatedMentions,
    pagination: { page, limit, total: mentions.length, pages: Math.ceil(mentions.length / limit) }
  });
}));

// Toggle bookmark
router.post('/bookmarks/:postId', authenticate, asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const user = await User.findById(req.user._id);

  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  const index = user.bookmarks.findIndex(id => id.toString() === postId);

  if (index > -1) {
    user.bookmarks.splice(index, 1);
  } else {
    user.bookmarks.push(postId);
  }

  await user.save();
  res.json({ success: true, isBookmarked: index === -1, bookmarkCount: user.bookmarks.length });
}));

// Get user bookmarks
router.get('/bookmarks/all', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'name username avatar' }
    })
    .lean();

  res.json({ success: true, data: user.bookmarks || [] });
}));

// Create collection
router.post('/collections', authenticate, asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) throw ApiError.badRequest('Collection name is required');

  const user = await User.findById(req.user._id);
  user.collections.push({ name: name.trim(), description: description || '', posts: [] });
  await user.save();

  res.status(201).json({ success: true, data: user.collections[user.collections.length - 1] });
}));

// Get user collections
router.get('/collections/all', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'collections.posts',
      populate: { path: 'author', select: 'name username avatar' }
    })
    .lean();

  res.json({ success: true, data: user.collections || [] });
}));

// Add/remove post to collection
router.post('/collections/:collectionId/posts/:postId', authenticate, asyncHandler(async (req, res) => {
  const { collectionId, postId } = req.params;
  const user = await User.findById(req.user._id);

  const collection = user.collections.id(collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  const index = collection.posts.findIndex(id => id.toString() === postId);

  if (index > -1) {
    collection.posts.splice(index, 1);
  } else {
    collection.posts.push(postId);
  }

  await user.save();
  res.json({ success: true, isInCollection: index === -1 });
}));

// Delete collection
router.delete('/collections/:collectionId', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  collection.deleteOne();
  await user.save();
  res.json({ success: true, message: 'Collection deleted' });
}));

// Get user badges
router.get('/:userId/badges', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('badges name username').lean();
  if (!user) throw ApiError.notFound('User not found');
  res.json({ success: true, data: user.badges || [] });
}));

export default router;
