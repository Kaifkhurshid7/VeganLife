import mongoose from 'mongoose';

// One row per (poll, user) vote. optionIndex references the poll's options array.
const pollVoteSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  poll: { type: mongoose.Schema.Types.ObjectId, required: true },
  optionIndex: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

pollVoteSchema.index({ poll: 1, user: 1 }, { unique: true });
pollVoteSchema.index({ poll: 1, optionIndex: 1 });

export default mongoose.model('PollVote', pollVoteSchema);
