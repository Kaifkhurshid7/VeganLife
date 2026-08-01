import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '', maxlength: 200 },
  icon: { type: String, default: 'leaf' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date },
}, { timestamps: true });

// Common queries: active rooms sorted by recency
roomSchema.index({ isActive: 1, lastMessageAt: -1 });

export default mongoose.model('Room', roomSchema);
