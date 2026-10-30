import { query, isUuid } from '../db/index.js';

// Upsert a user's per-room read cursor (drives unread counts). One statement, atomic.
// Shared by the REST routes and the realtime layer.
export async function markRoomRead(userId, roomId) {
  if (!isUuid(roomId)) return;
  await query(
    `insert into chat_reads (user_id, room_id, read_at) values ($1, $2, public.now_ms())
     on conflict (user_id, room_id) do update set read_at = excluded.read_at`,
    [userId, roomId],
  );
}
