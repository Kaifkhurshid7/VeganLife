import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  content: { type: String, required: true, maxlength: 5000 },
  category: { type: String, required: true, enum: ['Sustainability', 'Fitness', 'Student Life', 'Climate', 'Nutrition', 'Recipes', 'General'] },
  image: { type: String, default: '' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

postSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

postSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', postSchema);
