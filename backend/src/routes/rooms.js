import { Router } from 'express';
import { query, one, isUuid } from '../db/index.js';
import { roomJson, messageJson } from '../db/mappers.js';
import { intParam } from '../db/cursor.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { markRoomRead } from '../utils/chat.js';

const router = Router();

const MAX_ROOMS_PER_MEMBER = 10;

// List active rooms with the caller's unread count for each: one query. The
// unread count is a subselect that hits messages_room_sender_idx, and rooms are few.
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select r.*,
            (select count(*)::int from messages m
              where m.room_id = r.id
                and m.sender_id <> $1
                and (cr.read_at is null or m.created_at > cr.read_at)) as unread
       from rooms r
       left join chat_reads cr on cr.room_id = r.id and cr.user_id = $1
      where r.is_active
      order by r.is_default desc, r.last_message_at desc nulls last, r.created_at`,
    [req.user.id],
  );
  res.json({ success: true, data: rows.map(roomJson) });
}));

// Message history, newest page first, keyset on the identity column
// (?before=<nextCursor>&limit=). Returned oldest -> newest for display.
router.get('/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) throw ApiError.badRequest('Invalid room id');

  const limit = intParam(req.query.limit, { max: 50, fallback: 30 });
  const before = parseInt(req.query.before, 10);

  const params = [id, req.user.id];
  let cond = 'm.room_id = $1';
  if (Number.isFinite(before)) {
    params.push(before);
    cond += ` and m.seq < $${params.length}`;
  }
  params.push(limit + 1);

  const { rows } = await query(
    `select m.id, m.seq, m.room_id, m.sender_id, m.content, m.type, m.created_at,
            u.name as s_name, u.username as s_username, u.avatar as s_avatar
       from messages m
       join users u on u.id = m.sender_id
      where ${cond}
        and not exists (select 1 from blocks b where b.blocker_id = $2 and b.blocked_id = m.sender_id)
      order by m.seq desc
      limit $${params.length}`,
    params,
  );

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = pageRows.length > 0 ? pageRows[pageRows.length - 1].seq : null;

  // Opening a room counts as reading it
  await markRoomRead(req.user.id, id);

  res.json({ success: true, data: pageRows.reverse().map(messageJson), hasMore, nextCursor });
}));

// Create a room — any authenticated member can start a channel
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  const icon = String(req.body.icon || '🌱').slice(0, 20);

  if (!name) throw ApiError.badRequest('Room name is required');
  if (name.length > 60) throw ApiError.badRequest('Room name too long (max 60 characters)');
  if (description.length > 200) throw ApiError.badRequest('Description too long (max 200 characters)');

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw ApiError.badRequest('Invalid room name');

  if (req.user.role !== 'admin') {
    const { n } = await one('select count(*)::int as n from rooms where created_by = $1', [req.user.id]);
    if (n >= MAX_ROOMS_PER_MEMBER) throw ApiError.badRequest(`You can create up to ${MAX_ROOMS_PER_MEMBER} rooms`);
  }

  const existing = await one('select 1 as x from rooms where slug = $1', [slug]);
  if (existing) throw ApiError.badRequest('A room with that name already exists');

  // 23505 from a concurrent create is mapped to the same message by the error handler
  const room = await one(
    'insert into rooms (name, slug, description, icon, created_by) values ($1, $2, $3, $4, $5) returning *',
    [name, slug, description, icon, req.user.id],
  );
  res.status(201).json({ success: true, data: roomJson(room) });
}));

// Admin-only room deletion (messages cascade)
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) throw ApiError.badRequest('Invalid room id');
  const room = await one('delete from rooms where id = $1 returning id', [id]);
  if (!room) throw ApiError.notFound('Room not found');
  res.json({ success: true, message: 'Room deleted' });
}));

export default router;
