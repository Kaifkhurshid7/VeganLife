import { Router } from 'express';
import mongoose from 'mongoose';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { markRoomRead } from '../realtime/index.js';

const router = Router();

// List active rooms with the caller's unread count for each
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const rooms = await Room.find({ isActive: true }).sort({ isDefault: -1, lastMessageAt: -1 }).lean();

  const lastRead = new Map();
  for (const cursor of req.user.chatReads || []) {
    lastRead.set(String(cursor.room), cursor.at);
  }

  // Rooms are few (6–12), so per-room counts stay cheap and indexed
  const unreadCounts = await Promise.all(rooms.map(async (room) => {
    const filter = { room: room._id, sender: { $ne: req.user._id } };
    const since = lastRead.get(String(room._id));
    if (since) filter.createdAt = { $gt: since };
    return Message.countDocuments(filter);
  }));

  res.json({
    success: true,
    data: rooms.map((room, i) => ({ ...room, unreadCount: unreadCounts[i] })),
  });
}));

// Cursor-paginated message history (oldest → newest in the response)
router.get('/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid room id');

  const limit = Math.min(50, parseInt(req.query.limit) || 30);
  const filter = { room: id };
  if (req.query.before && mongoose.isValidObjectId(req.query.before)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(req.query.before) };
  }

  const messages = await Message.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate('sender', 'name username avatar')
    .lean();

  const hasMore = messages.length > limit;
  const page = hasMore ? messages.slice(0, limit) : messages;
  const nextCursor = page.length > 0 ? page[page.length - 1]._id : null;

  // Opening a room counts as reading it
  await markRoomRead(req.user._id, id);

  res.json({ success: true, data: page.reverse(), hasMore, nextCursor });
}));

// Create a room — any authenticated member can start a channel
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name?.trim()) throw ApiError.badRequest('Room name is required');

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw ApiError.badRequest('Invalid room name');

  const existing = await Room.findOne({ slug });
  if (existing) throw ApiError.badRequest('A room with that name already exists');

  const room = await Room.create({
    name: name.trim(),
    slug,
    description: (description || '').trim(),
    icon: icon || '🌱',
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: room });
}));

// Admin-only room deletion (cascades to its messages)
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest('Invalid room id');

  const room = await Room.findByIdAndDelete(id);
  if (!room) throw ApiError.notFound('Room not found');

  await Message.deleteMany({ room: id });
  res.json({ success: true, message: 'Room deleted' });
}));

export default router;
