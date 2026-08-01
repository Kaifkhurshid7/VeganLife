import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { verifyAccessToken } from '../config/tokens.js';
import { ACCESS_TOKEN_COOKIE } from '../config/cookies.js';

const MESSAGE_RATE_LIMIT_MS = 1500;
const RATE_LIMIT_CLEANUP_MS = 60 * 1000;

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

// In-memory presence fallback — only used when Redis isn't configured
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

export function initRealtime(server, redisPubSub) {
  const io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
      credentials: true,
    },
  });

  // Multi-instance broadcast (messages, presence) via Redis when configured
  if (redisPubSub) {
    io.adapter(createAdapter(redisPubSub.pub, redisPubSub.sub));
  }

  // Reject connections without a valid access token (httpOnly cookie or handshake auth)
  io.use(async (socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies[ACCESS_TOKEN_COOKIE] || socket.handshake.auth?.token;
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

  const redis = redisPubSub?.pub || null;
  const presenceCountKey = (roomId) => `room:presence:count:${roomId}`;
  const presenceMetaKey = (roomId) => `room:presence:meta:${roomId}`;

  async function presenceSnapshot(roomId) {
    if (redis) {
      const [online, meta] = await Promise.all([
        redis.hlen(presenceCountKey(roomId)),
        redis.hgetall(presenceMetaKey(roomId)),
      ]);
      const users = Object.values(meta || {})
        .map((raw) => { try { return JSON.parse(raw); } catch { return null; } })
        .filter(Boolean);
      return { online, users };
    }
    const sockets = roomSockets.get(roomId);
    const byUser = new Map();
    for (const meta of sockets?.values() || []) {
      if (!byUser.has(meta.id)) byUser.set(meta.id, { id: meta.id, name: meta.name, avatar: meta.avatar });
    }
    const users = Array.from(byUser.values());
    return { online: users.length, users };
  }

  async function broadcastPresence(roomId) {
    const snapshot = await presenceSnapshot(roomId);
    io.to(roomId).emit('presence:update', { roomId, ...snapshot });
  }

  async function track(socket, roomId) {
    const meta = { id: socket.user.id, name: socket.user.name, avatar: socket.user.avatar };
    if (redis) {
      await redis.hincrby(presenceCountKey(roomId), socket.user.id, 1);
      await redis.hset(presenceMetaKey(roomId), socket.user.id, JSON.stringify(meta));
    } else {
      if (!roomSockets.has(roomId)) roomSockets.set(roomId, new Map());
      roomSockets.get(roomId).set(socket.id, meta);
    }
    await broadcastPresence(roomId);
  }

  async function untrack(socket, roomId) {
    if (redis) {
      const key = presenceCountKey(roomId);
      const remaining = await redis.hincrby(key, socket.user.id, -1);
      if (remaining <= 0) {
        await redis.hdel(key, socket.user.id);
        await redis.hdel(presenceMetaKey(roomId), socket.user.id);
      }
    } else {
      roomSockets.get(roomId)?.delete(socket.id);
    }
    await broadcastPresence(roomId);
  }

  io.on('connection', (socket) => {
    const user = socket.user;
    socket.presenceRooms = new Set();

    socket.on('room:join', async ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.join(roomId);
      socket.presenceRooms.add(roomId);
      await track(socket, roomId);
      markRoomRead(user.id, roomId).catch(() => {});
    });

    socket.on('room:leave', async ({ roomId }) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      socket.leave(roomId);
      socket.presenceRooms.delete(roomId);
      await untrack(socket, roomId);
    });

    // Single round-trip to move rooms — leaves the old one, joins the new, clears unread
    socket.on('room:switch', async ({ roomId, previousRoomId }) => {
      if (previousRoomId && mongoose.isValidObjectId(previousRoomId)) {
        socket.leave(previousRoomId);
        socket.presenceRooms.delete(previousRoomId);
        await untrack(socket, previousRoomId);
      }
      if (roomId && mongoose.isValidObjectId(roomId)) {
        socket.join(roomId);
        socket.presenceRooms.add(roomId);
        await track(socket, roomId);
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

    socket.on('presence:get', async ({ roomId }, ack) => {
      if (!mongoose.isValidObjectId(roomId)) return;
      const snapshot = await presenceSnapshot(roomId);
      ack?.(snapshot);
    });

    // Drop the socket from every presence room it had joined
    socket.on('disconnect', async () => {
      for (const roomId of socket.presenceRooms || []) {
        await untrack(socket, roomId);
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
