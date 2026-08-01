import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 200 },
  voteCount: { type: Number, default: 0 }, // denormalized from PollVote collection
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true, maxlength: 300 },
  options: [pollOptionSchema],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  content: { type: String, required: true, maxlength: 5000 },
  category: { type: String, required: true, enum: ['Sustainability', 'Fitness', 'Student Life', 'Climate', 'Nutrition', 'Recipes', 'General'] },
  image: { type: String, default: '' },
  hashtags: [{ type: String, lowercase: true }],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  polls: [pollSchema],
  // Small, bounded to post author + moderators, so it stays embedded
  pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  // Denormalized counters — the source of truth lives in the
  // Comment / PostVote / PollVote collections
  upvoteCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  pinCount: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes for query performance
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ mentions: 1 });

export default mongoose.model('Post', postSchema);
