import { Server } from 'socket.io';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { verifyAccessToken } from '../config/tokens.js';

const MESSAGE_RATE_LIMIT_MS = 1500;
const RATE_LIMIT_CLEANUP_MS = 60 * 1000;

// Per-process presence registry. Swap for a Redis adapter before scaling beyond one instance.
const roomSockets = new Map(); // roomId -> Map(socketId -> { id, name, avatar })
const lastSendAt = new Map();  // userId -> timestamp (message spam guard)

// Upsert a user's per-room read cursor. Shared with the REST routes.
export async function markRoomRead(userId, roomId) {
  if (!mongoose.isValidObjectId(roomId)) return;
  await User.updateOne(
    { _id: userId, 'chatReads.room': { $ne: roomId } },
    { $push: { chatReads: { room: roomId, at: new Date() } } },
  );
  await User.updateOne(
    { _id: userId, 'chatReads.room': roomId },
    { $set: { 'chatReads.$.at': new Date() } },
  );
}

export function initRealtime(server) {
  const io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
      credentials: true,
    },
  });

  // Reject connections without a valid access token
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('unauthorized'));
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('name username avatar role');
      if (!user) return next(new Error('unauthorized'));
      socket.user = {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      };
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  function broadcastPresence(roomId) {
    const sockets = roomSockets.get(roomId);
    const byUser = new Map();
    for (const meta of sockets?.values() || []) {
      if (!byUser.has(meta.id)) byUser.set(meta.id, { id: meta.id, name: meta.name, avatar: meta.avatar });
    }
    const users = Array.from(byUser.values());
    io.to(roomId).emit('presence:update', { roomId, online: users.length, users });
  }

  function track(socket, roomId) {
    if (!roomSockets.has(roomId)) roomSockets.set(roomId, new Map());
    roomSockets.get(roomId).set(socket.id, socket.user);
    broadcastPresence(roomId);
  }

  function untrack(socket, roomId) {
    roomSockets.get(roomId)?.delete(socket.id);
    broadcastPresence(roomId);
  }

  io.on('connection', (socket) => {
    const user = socket.user;

    socket.on('room:join', ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.join(roomId);
      track(socket, roomId);
      markRoomRead(user.id, roomId).catch(() => {});
    });

    socket.on('room:leave', ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.leave(roomId);
      untrack(socket, roomId);
    });

    // Single round-trip to move rooms — leaves the old one, joins the new, clears unread
    socket.on('room:switch', ({ roomId, previousRoomId }) => {
      if (previousRoomId && mongoose.isValidObjectId(previousRoomId)) {
        socket.leave(previousRoomId);
        untrack(socket, previousRoomId);
      }
      if (roomId && mongoose.isValidObjectId(roomId)) {
        socket.join(roomId);
        track(socket, roomId);
        markRoomRead(user.id, roomId).catch(() => {});
      }
    });

    socket.on('message:send', async ({ roomId, content }, ack) => {
      const reply = ack || (() => {});
      try {
        const now = Date.now();
        if (now - (lastSendAt.get(user.id) || 0) < MESSAGE_RATE_LIMIT_MS) {
          return reply({ ok: false, error: 'Slow down — you are sending too fast.' });
        }
        lastSendAt.set(user.id, now);

        const text = typeof content === 'string' ? content.trim() : '';
        if (!text) return reply({ ok: false, error: 'Message cannot be empty.' });
        if (text.length > 1000) return reply({ ok: false, error: 'Message too long (max 1000 characters).' });
        if (!mongoose.isValidObjectId(roomId)) return reply({ ok: false, error: 'Invalid room.' });

        const room = await Room.findById(roomId);
        if (!room?.isActive) return reply({ ok: false, error: 'Room not found.' });

        const message = await Message.create({ room: roomId, sender: user.id, content: text });
        await message.populate('sender', 'name username avatar');

        await Room.updateOne({ _id: roomId }, { lastMessage: text, lastMessageAt: new Date() });

        io.to(roomId).emit('message:new', { message });
        reply({ ok: true, message });
      } catch {
        reply({ ok: false, error: 'Failed to send message.' });
      }
    });

    socket.on('typing:start', ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.to(roomId).emit('typing', { roomId, user: { id: user.id, name: user.name }, isTyping: true });
    });

    socket.on('typing:stop', ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.to(roomId).emit('typing', { roomId, user: { id: user.id, name: user.name }, isTyping: false });
    });

    socket.on('read:mark', ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      markRoomRead(user.id, roomId).catch(() => {});
    });

    socket.on('presence:get', ({ roomId }, ack) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      const sockets = roomSockets.get(roomId);
      const byUser = new Map();
      for (const meta of sockets?.values() || []) {
        if (!byUser.has(meta.id)) byUser.set(meta.id, { id: meta.id, name: meta.name, avatar: meta.avatar });
      }
      ack?.({ online: byUser.size, users: Array.from(byUser.values()) });
    });

    // Remove the socket from every presence room it had joined
    socket.on('disconnect', () => {
      for (const [roomId, sockets] of roomSockets.entries()) {
        if (sockets.delete(socket.id)) {
          broadcastPresence(roomId);
        }
      }
    });
  });

  // Keep the rate-limit map bounded
  setInterval(() => {
    const cutoff = Date.now() - MESSAGE_RATE_LIMIT_MS;
    for (const [id, ts] of lastSendAt.entries()) {
      if (ts < cutoff) lastSendAt.delete(id);
    }
  }, RATE_LIMIT_CLEANUP_MS).unref?.();

  return io;
}
