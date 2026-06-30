import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 200 },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 500 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  reactions: [reactionSchema],
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  content: { type: String, required: true, maxlength: 5000 },
  category: { type: String, required: true, enum: ['Sustainability', 'Fitness', 'Student Life', 'Climate', 'Nutrition', 'Recipes', 'General'] },
  image: { type: String, default: '' },
  hashtags: [{ type: String, lowercase: true }],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  polls: [{
    question: { type: String, required: true, maxlength: 300 },
    options: [pollOptionSchema],
  }],
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

postSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

postSchema.virtual('pinCount').get(function () {
  return this.pinnedBy.length;
});

postSchema.set('toJSON', { virtuals: true });

// Indexes for query performance
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ mentions: 1 });

export default mongoose.model('Post', postSchema);
