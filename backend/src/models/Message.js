import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  type: { type: String, enum: ['text', 'system'], default: 'text' },
}, { timestamps: true });

// Cursor-based pagination (ObjectId is time-sortable) + unread counts
messageSchema.index({ room: 1, _id: -1 });
messageSchema.index({ room: 1, sender: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
