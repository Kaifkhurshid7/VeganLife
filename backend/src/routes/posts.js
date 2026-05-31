import { Router } from 'express';
import Post from '../models/Post.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// Get all approved posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post (authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      category,
      image: image || '',
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upvote/remove upvote
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.includes(userId);

    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.upvotes.push(userId);
    }

    await post.save();
    res.json({ upvotes: post.upvotes.length, hasUpvoted: !hasUpvoted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    await post.populate('comments.user', 'name');
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comment (admin or comment author)
router.delete('/:postId/comments/:commentId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN: Get all posts (including pending)
router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN: Approve/reject post
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const post = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN: Delete post
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
