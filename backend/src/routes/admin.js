import { Router } from 'express';
import { query, one, tx, isUuid } from '../db/index.js';
import { USER_COLS, userJson, commentJson, reportJson, roomJson, likePattern } from '../db/mappers.js';
import { intParam } from '../db/cursor.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { cache } from '../utils/cache.js';
import { deleteStoredImage } from '../utils/uploadService.js';

const router = Router();

// All admin routes require an authenticated admin.
router.use(authenticate, adminOnly);

const requireUuid = (v, label) => {
  if (!isUuid(v)) throw ApiError.badRequest(`Invalid ${label}`);
};

const bumpPostsCache = () => cache.incr('postsCacheVersion');

const paging = (req, defLimit = 20) => {
  const page = intParam(req.query.page, { max: 100000, fallback: 1 });
  const limit = intParam(req.query.limit, { max: 50, fallback: defLimit });
  return { page, limit, offset: (page - 1) * limit };
};

const pagination = (page, limit, total) => ({ page, limit, total, pages: Math.ceil(total / limit) });

/* ------------------------------------------------------------------ stats */
// One round trip for the whole dashboard
router.get('/stats', asyncHandler(async (req, res) => {
  const s = await one(
    `select
       (select count(*) from users)::int                                  as users,
       (select count(*) from posts)::int                                  as posts,
       (select count(*) from posts where status = 'pending')::int         as pending,
       (select count(*) from posts where status = 'approved')::int        as approved,
       (select count(*) from posts where status = 'rejected')::int        as rejected,
       (select count(*) from comments)::int                               as comments,
       (select count(*) from rooms)::int                                  as rooms,
       (select count(*) from messages)::int                               as messages,
       (select count(*) from reports where status = 'open')::int          as "openReports"`,
  );
  res.json({ success: true, data: s });
}));

/* ------------------------------------------------------------------ users */
router.get('/users', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const { page, limit, offset } = paging(req);

  const params = [];
  let where = 'true';
  if (q) {
    params.push(likePattern(q));
    where = `(u.name ilike $1 or u.username ilike $1 or lower(u.email) ilike $1)`;
  }

  const [{ rows }, total] = await Promise.all([
    query(
      `select ${USER_COLS},
              (select count(*)::int from posts p where p.author_id = u.id) as post_count
         from users u
        where ${where}
        order by u.created_at desc, u.id desc
        limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, limit, offset],
    ),
    one(`select count(*)::int as n from users u where ${where}`, params),
  ]);

  res.json({
    success: true,
    data: rows.map((r) => ({ ...userJson(r), postCount: r.post_count })),
    pagination: pagination(page, limit, total.n),
  });
}));

// Promote / demote. Guards: you can't change your own role, and you can't demote
// the last remaining admin (which would lock everyone out).
router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  const { id } = req.params;
  requireUuid(id, 'user id');
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw ApiError.badRequest('Role must be user or admin');
  if (id === String(req.user.id)) throw ApiError.badRequest('You cannot change your own role');

  await tx(async (t) => {
    const { rows } = await t.query('select id, role from users where id = $1 for update', [id]);
    if (!rows[0]) throw ApiError.notFound('User not found');
    if (rows[0].role === 'admin' && role === 'user') {
      const { rows: [{ n }] } = await t.query("select count(*)::int as n from users where role = 'admin'");
      if (n <= 1) throw ApiError.badRequest('Cannot demote the last admin');
    }
    await t.query('update users set role = $2 where id = $1', [id, role]);
  });

  const row = await one(`select ${USER_COLS} from users u where u.id = $1`, [id]);
  res.json({ success: true, data: userJson(row) });
}));

// Delete a user. Foreign keys cascade through everything they own (posts, comments,
// votes, poll votes, messages, follows...) and triggers correct the counters on
// other people's posts, so there is no hand-written clean-up to get wrong.
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  requireUuid(id, 'user id');
  if (id === String(req.user.id)) throw ApiError.badRequest('You cannot delete your own account from the admin panel');

  const target = await one('select id, role, avatar from users where id = $1', [id]);
  if (!target) throw ApiError.notFound('User not found');
  if (target.role === 'admin') {
    const { n } = await one("select count(*)::int as n from users where role = 'admin'");
    if (n <= 1) throw ApiError.badRequest('Cannot delete the last admin');
  }

  await query('delete from users where id = $1', [id]);
  if (target.avatar) deleteStoredImage(target.avatar);
  await bumpPostsCache();
  res.json({ success: true, message: 'User deleted' });
}));

/* --------------------------------------------------------------- comments */
// Searchable by comment text, author, or post title; paginated. Each condition uses
// its own trigram index, so the search stays fast as the community grows.
router.get('/comments', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const { page, limit, offset } = paging(req);

  const params = [];
  let where = 'true';
  if (q) {
    params.push(likePattern(q));
    where = `(c.text ilike $1
              or c.user_id in (select id from users where name ilike $1 or username ilike $1)
              or c.post_id in (select id from posts where title ilike $1))`;
  }

  const [{ rows }, total] = await Promise.all([
    query(
      `select c.id, c.seq, c.post_id, c.user_id, c.parent_id, c.text, c.is_pinned, c.created_at, c.updated_at,
              u.name as u_name, u.username as u_username, u.avatar as u_avatar, p.title as post_title
         from comments c
         join users u on u.id = c.user_id
         join posts p on p.id = c.post_id
        where ${where}
        order by c.created_at desc, c.id desc
        limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, limit, offset],
    ),
    one(`select count(*)::int as n from comments c where ${where}`, params),
  ]);

  res.json({
    success: true,
    data: rows.map((r) => ({ ...commentJson(r), post: { _id: r.post_id, title: r.post_title } })),
    pagination: pagination(page, limit, total.n),
  });
}));

// Delete any comment (admin): replies cascade and a trigger fixes the post's counter
router.delete('/comments/:id', asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'comment id');
  const removed = await one('delete from comments where id = $1 returning id', [req.params.id]);
  if (!removed) throw ApiError.notFound('Comment not found');
  await bumpPostsCache();
  res.json({ success: true, message: 'Comment deleted' });
}));

/* ---------------------------------------------------------------- reports */
router.get('/reports', asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'open');
  const { page, limit, offset } = paging(req);
  const filtered = ['open', 'dismissed', 'actioned'].includes(status);
  const where = filtered ? 'r.status = $1' : 'true';
  const params = filtered ? [status] : [];

  const [{ rows }, total] = await Promise.all([
    query(
      `select r.*, rep.name as r_name, rep.username as r_username, rep.avatar as r_avatar,
              rv.name as v_name, rv.username as v_username
         from reports r
         left join users rep on rep.id = r.reporter_id
         left join users rv on rv.id = r.resolved_by
        where ${where}
        order by r.created_at desc, r.id desc
        limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, limit, offset],
    ),
    one(`select count(*)::int as n from reports r where ${where}`, params),
  ]);

  res.json({ success: true, data: rows.map(reportJson), pagination: pagination(page, limit, total.n) });
}));

router.patch('/reports/:id', asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'report id');
  const { status } = req.body;
  if (!['open', 'dismissed', 'actioned'].includes(status)) {
    throw ApiError.badRequest('Status must be open, dismissed, or actioned');
  }

  const updated = await one(
    `update reports
        set status = $2,
            resolved_by = case when $2 = 'open' then null else $3::uuid end,
            resolved_at = case when $2 = 'open' then null else public.now_ms() end
      where id = $1
      returning id`,
    [req.params.id, status, req.user.id],
  );
  if (!updated) throw ApiError.notFound('Report not found');

  // Re-read with the reporter and resolver names joined, same shape as the list
  const row = await one(
    `select r.*, rep.name as r_name, rep.username as r_username, rep.avatar as r_avatar,
            rv.name as v_name, rv.username as v_username
       from reports r
       left join users rep on rep.id = r.reporter_id
       left join users rv on rv.id = r.resolved_by
      where r.id = $1`,
    [updated.id],
  );
  res.json({ success: true, data: reportJson(row) });
}));

/* ------------------------------------------------------------------ rooms */
router.get('/rooms', asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select r.*, (select count(*)::int from messages m where m.room_id = r.id) as message_count
       from rooms r
      order by r.is_default desc, r.created_at desc`,
  );
  res.json({ success: true, data: rows.map(roomJson) });
}));

router.delete('/rooms/:id', asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'room id');
  const room = await one('delete from rooms where id = $1 returning id', [req.params.id]);
  if (!room) throw ApiError.notFound('Room not found');
  res.json({ success: true, message: 'Room deleted' });
}));

export default router;
