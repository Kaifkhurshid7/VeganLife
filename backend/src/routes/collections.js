import { Router } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Get user's collections
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('collections.posts', 'title image author')
    .select('collections');

  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, data: user.collections });
}));

// Get single collection with posts
router.get('/:collectionId/posts', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  const populatedUser = await User.findById(req.user._id)
    .populate({
      path: 'collections.posts',
      match: { _id: { $in: collection.posts } },
      populate: { path: 'author', select: 'name username avatar' }
    });

  const populatedCollection = populatedUser.collections.id(req.params.collectionId);

  res.json({ 
    success: true, 
    data: {
      collection: {
        _id: collection._id,
        name: collection.name,
        description: collection.description,
        createdAt: collection.createdAt
      },
      posts: populatedCollection.posts
    }
  });
}));

// Create new collection
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) throw ApiError.badRequest('Collection name is required');
  if (name.length > 100) throw ApiError.badRequest('Collection name too long (max 100 chars)');

  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const newCollection = {
    name: name.trim(),
    description: description?.trim() || '',
    posts: [],
    createdAt: new Date()
  };

  user.collections.push(newCollection);
  await user.save();

  res.status(201).json({ success: true, data: user.collections[user.collections.length - 1] });
}));

// Add post to collection
router.post('/:collectionId/add', authenticate, asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) throw ApiError.badRequest('Post ID is required');

  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  // Check if post is already in collection
  if (collection.posts.includes(postId)) {
    throw ApiError.badRequest('Post already in collection');
  }

  collection.posts.push(postId);
  await user.save();

  res.json({ success: true, message: 'Post added to collection', data: collection });
}));

// Remove post from collection
router.post('/:collectionId/remove', authenticate, asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) throw ApiError.badRequest('Post ID is required');

  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  const postIndex = collection.posts.indexOf(postId);
  if (postIndex === -1) throw ApiError.notFound('Post not in collection');

  collection.posts.splice(postIndex, 1);
  await user.save();

  res.json({ success: true, message: 'Post removed from collection' });
}));

// Update collection
router.patch('/:collectionId', authenticate, asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  if (name) {
    if (name.trim().length === 0) throw ApiError.badRequest('Collection name cannot be empty');
    if (name.length > 100) throw ApiError.badRequest('Collection name too long (max 100 chars)');
    collection.name = name.trim();
  }

  if (description !== undefined) {
    if (description.length > 300) throw ApiError.badRequest('Description too long (max 300 chars)');
    collection.description = description.trim();
  }

  await user.save();

  res.json({ success: true, data: collection });
}));

// Delete collection
router.delete('/:collectionId', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  const collection = user.collections.id(req.params.collectionId);
  if (!collection) throw ApiError.notFound('Collection not found');

  collection.deleteOne();
  await user.save();

  res.json({ success: true, message: 'Collection deleted' });
}));

export default router;
