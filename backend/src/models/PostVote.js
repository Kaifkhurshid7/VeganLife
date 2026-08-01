import mongoose from 'mongoose';

// One row per (post, user) upvote. The unique index makes toggles race-safe and
// keeps the post document small.
const postVoteSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

postVoteSchema.index({ post: 1, user: 1 }, { unique: true });
postVoteSchema.index({ user: 1 });

export default mongoose.model('PostVote', postVoteSchema);
