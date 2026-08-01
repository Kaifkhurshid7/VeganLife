import mongoose from 'mongoose';

// Comments live in their own collection so a post document never grows unbounded
// and every comment/reaction doesn't rewrite the whole post.
const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // null = top-level
  text: { type: String, required: true, maxlength: 500 },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String },
  }],
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

// Cursor pagination per post + reply lookups
commentSchema.index({ post: 1, _id: -1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ post: 1, isPinned: -1, _id: -1 });

export default mongoose.model('Comment', commentSchema);
