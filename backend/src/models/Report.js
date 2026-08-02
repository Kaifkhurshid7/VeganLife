import mongoose from 'mongoose';

// User-submitted content reports feeding the admin moderation queue. Snapshots of
// the target (title/snippet/author) are denormalized at creation so the queue can
// render without polymorphic populates and still works after the target is deleted.
const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['post', 'comment', 'user'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  details: { type: String, default: '', maxlength: 500 },
  status: { type: String, enum: ['open', 'dismissed', 'actioned'], default: 'open' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },

  // Denormalized snapshots captured at report time
  targetTitle: { type: String, default: '' },       // post.title / comment text snippet / user.name
  targetSnippet: { type: String, default: '' },     // post.content / comment.text, truncated
  targetAuthorName: { type: String, default: '' },
  targetAuthorUsername: { type: String, default: '' },
}, { timestamps: true });

// One report per user per target (idempotent reporting)
reportSchema.index({ targetType: 1, targetId: 1, reporter: 1 }, { unique: true });
// Admin queue ordering
reportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
