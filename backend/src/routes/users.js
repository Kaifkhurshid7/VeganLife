import { Router } from 'express';
import { query, one, tx, isUuid } from '../db/index.js';
import { POST_COLS, postJson, collectionJson, badgeJson, likePattern } from '../db/mappers.js';
import { intParam } from '../db/cursor.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { selectPosts, withPolls, pageOf, latestCursor, parseLatestCursor } from '../utils/postQueries.js';

const router = Router();

const requireUuid = (v, label = 'user id') => {
  if (!isUuid(v)) throw ApiError.badRequest(`Invalid ${label}`);
};

/** A user as other people see them. Never includes the email address. */
const PUBLIC_USER_COLS = `u.id, u.name, u.username, u.avatar, u.bio, u.sustainability_score, u.streak,
  u.completed_challenges, u.created_at,
  (select count(*) from posts p where p.author_id = u.id and p.status = 'approved') as post_count,
  (select count(*) from follows f where f.followee_id = u.id) as follower_count,
  (select count(*) from follows f where f.follower_id = u.id) as following_count`;

function publicProfile(row, posts, pagination) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    bio: row.bio,
    sustainabilityScore: row.sustainability_score,
    streak: row.streak,
    completedChallenges: row.completed_challenges || [],
    createdAt: row.created_at,
    isFollowing: Boolean(row.is_following),
    stats: {
      posts: row.post_count,
      followers: row.follower_count,
      following: row.following_count,
      score: row.sustainability_score,
      streak: row.streak,
    },
    posts,
    postsPagination: pagination,
  };
}

async function profileFor(whereSql, param, me) {
  const params = [param];
  let following = 'false';
  if (me) {
    params.push(me);
    following = 'exists (select 1 from follows f where f.follower_id = $2 and f.followee_id = u.id)';
  }
  const row = await one(`select ${PUBLIC_USER_COLS}, ${following} as is_following from users u where ${whereSql}`, params);
  if (!row) throw ApiError.notFound('User not found');

  // First page of their posts (newest first); the rest load via /:userId/posts?cursor=
  const limit = 20;
  const rows = await selectPosts({
    me,
    where: "p.author_id = $1 and p.status = 'approved'",
    params: [row.id],
    order: 'p.created_at desc, p.id desc',
    limit: limit + 1,
  });
  const { page, hasMore, nextCursor } = pageOf(rows, limit, latestCursor);
  return publicProfile(row, await withPolls(page, me), { limit, hasMore, nextCursor });
}

/* ------------------------------------------------------------------ search */
// Substring search served by the trigram GIN indexes on name and username
router.get('/search', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) throw ApiError.badRequest('Search query must be at least 2 characters');
  const limit = intParam(req.query.limit, { max: 20, fallback: 10 });

  const { rows } = await query(
    `select u.id, u.name, u.username, u.avatar, u.bio, u.sustainability_score,
            (select count(*) from follows f where f.followee_id = u.id) as follower_count
       from users u
      where u.name ilike $1 or u.username ilike $1
      order by (u.username = lower($2)) desc, u.sustainability_score desc, u.id
      limit $3`,
    [likePattern(q), q, limit],
  );

  res.json({
    success: true,
    data: rows.map((r) => ({
      _id: r.id,
      id: r.id,
      name: r.name,
      username: r.username,
      avatar: r.avatar,
      bio: r.bio,
      sustainabilityScore: r.sustainability_score,
      followerCount: r.follower_count,
    })),
  });
}));

/* ----------------------------------------------------------------- profiles */
router.get('/profile/:username', optionalAuth, asyncHandler(async (req, res) => {
  const data = await profileFor('u.username = $1', req.params.username.toLowerCase(), req.user?.id);
  res.json({ success: true, data });
}));

/* ------------------------------------------------ bookmarks & collections
   (declared before /:userId so these fixed paths are never read as an id) */
router.post('/bookmarks/:postId', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.postId, 'post id');
  const post = await one('select id from posts where id = $1', [req.params.postId]);
  if (!post) throw ApiError.notFound('Post not found');

  const isBookmarked = await tx(async (t) => {
    const removed = await t.query('delete from bookmarks where user_id = $1 and post_id = $2', [req.user.id, post.id]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into bookmarks (user_id, post_id) values ($1, $2) on conflict do nothing', [req.user.id, post.id]);
    return true;
  });
  const { n } = await one('select count(*)::int as n from bookmarks where user_id = $1', [req.user.id]);
  res.json({ success: true, isBookmarked, bookmarkCount: n });
}));

router.get('/bookmarks/all', authenticate, asyncHandler(async (req, res) => {
  const limit = intParam(req.query.limit, { max: 100, fallback: 50 });
  const page = intParam(req.query.page, { max: 100000, fallback: 1 });
  const { rows } = await query(
    `select ${POST_COLS}, exists (select 1 from post_votes v where v.post_id = p.id and v.user_id = $1) as has_upvoted
       from bookmarks b
       join posts p on p.id = b.post_id
       join users u on u.id = p.author_id
      where b.user_id = $1 and p.status = 'approved'
      order by b.created_at desc, p.id desc
      limit $2 offset $3`,
    [req.user.id, limit, (page - 1) * limit],
  );
  res.json({ success: true, data: rows.map((r) => postJson(r)) });
}));

router.post('/collections', authenticate, asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  if (!name) throw ApiError.badRequest('Collection name is required');
  if (name.length > 100) throw ApiError.badRequest('Collection name too long (max 100 chars)');
  if (description.length > 300) throw ApiError.badRequest('Description too long (max 300 chars)');

  const row = await one(
    'insert into collections (user_id, name, description) values ($1, $2, $3) returning id, name, description, created_at',
    [req.user.id, name, description],
  );
  res.status(201).json({ success: true, data: collectionJson(row, []) });
}));

router.get('/collections/all', authenticate, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select c.id, c.name, c.description, c.created_at,
            coalesce((select json_agg(json_build_object('_id', p.id, 'title', p.title, 'image', p.image) order by cp.added_at desc)
                        from collection_posts cp join posts p on p.id = cp.post_id
                       where cp.collection_id = c.id), '[]'::json) as posts
       from collections c where c.user_id = $1 order by c.created_at`,
    [req.user.id],
  );
  res.json({ success: true, data: rows.map((r) => collectionJson(r, r.posts)) });
}));

router.post('/collections/:collectionId/posts/:postId', authenticate, asyncHandler(async (req, res) => {
  const { collectionId, postId } = req.params;
  requireUuid(collectionId, 'collection id');
  requireUuid(postId, 'post id');
  const col = await one('select id from collections where id = $1 and user_id = $2', [collectionId, req.user.id]);
  if (!col) throw ApiError.notFound('Collection not found');

  const isInCollection = await tx(async (t) => {
    const removed = await t.query('delete from collection_posts where collection_id = $1 and post_id = $2', [collectionId, postId]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into collection_posts (collection_id, post_id) values ($1, $2) on conflict do nothing', [collectionId, postId]);
    return true;
  });
  res.json({ success: true, isInCollection });
}));

router.delete('/collections/:collectionId', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.collectionId, 'collection id');
  const removed = await one('delete from collections where id = $1 and user_id = $2 returning id', [req.params.collectionId, req.user.id]);
  if (!removed) throw ApiError.notFound('Collection not found');
  res.json({ success: true, message: 'Collection deleted' });
}));

/* ------------------------------------------------------------- user by id */
router.get('/:userId', optionalAuth, asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const data = await profileFor('u.id = $1', req.params.userId, req.user?.id);
  res.json({ success: true, data });
}));

/* ---------------------------------------------------------------- follow */
router.post('/:targetUserId/follow', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  requireUuid(targetUserId);
  if (targetUserId === String(req.user.id)) throw ApiError.badRequest('Cannot follow yourself');

  const target = await one('select id from users where id = $1', [targetUserId]);
  if (!target) throw ApiError.notFound('User not found');

  // Can't follow someone who blocked you, or someone you blocked
  const blocked = await one(
    `select 1 as x from blocks
      where (blocker_id = $1 and blocked_id = $2) or (blocker_id = $2 and blocked_id = $1) limit 1`,
    [req.user.id, targetUserId],
  );
  if (blocked) throw ApiError.forbidden('You cannot follow this user');

  const isFollowing = await tx(async (t) => {
    const removed = await t.query('delete from follows where follower_id = $1 and followee_id = $2', [req.user.id, targetUserId]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into follows (follower_id, followee_id) values ($1, $2) on conflict do nothing', [req.user.id, targetUserId]);
    return true;
  });

  const { n } = await one('select count(*)::int as n from follows where followee_id = $1', [targetUserId]);
  res.json({ success: true, message: isFollowing ? 'Followed' : 'Unfollowed', isFollowing, followerCount: n });
}));

// Block/unblock (toggle). Blocking severs follows in both directions and removes
// any mute, so a blocked user can't follow you, comment on your content, or have
// their posts/comments/chat messages visible to you.
router.post('/:targetUserId/block', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  requireUuid(targetUserId);
  if (targetUserId === String(req.user.id)) throw ApiError.badRequest('You cannot block yourself');
  const target = await one('select id from users where id = $1', [targetUserId]);
  if (!target) throw ApiError.notFound('User not found');

  const isBlocked = await tx(async (t) => {
    const removed = await t.query('delete from blocks where blocker_id = $1 and blocked_id = $2', [req.user.id, targetUserId]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into blocks (blocker_id, blocked_id) values ($1, $2) on conflict do nothing', [req.user.id, targetUserId]);
    await t.query(
      `delete from follows where (follower_id = $1 and followee_id = $2) or (follower_id = $2 and followee_id = $1)`,
      [req.user.id, targetUserId],
    );
    await t.query('delete from mutes where muter_id = $1 and muted_id = $2', [req.user.id, targetUserId]);
    return true;
  });
  res.json({ success: true, isBlocked });
}));

// Mute/unmute (toggle). Muting only hides their posts from your feed.
router.post('/:targetUserId/mute', authenticate, asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  requireUuid(targetUserId);
  if (targetUserId === String(req.user.id)) throw ApiError.badRequest('You cannot mute yourself');
  const target = await one('select id from users where id = $1', [targetUserId]);
  if (!target) throw ApiError.notFound('User not found');

  const isMuted = await tx(async (t) => {
    const removed = await t.query('delete from mutes where muter_id = $1 and muted_id = $2', [req.user.id, targetUserId]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into mutes (muter_id, muted_id) values ($1, $2) on conflict do nothing', [req.user.id, targetUserId]);
    return true;
  });
  res.json({ success: true, isMuted });
}));

/* ---------------------------------------------------------- follower lists */
const listCols = 'u.id, u.name, u.username, u.avatar, u.sustainability_score';
const personJson = (r) => ({ _id: r.id, id: r.id, name: r.name, username: r.username, avatar: r.avatar, sustainabilityScore: r.sustainability_score });

router.get('/:userId/followers', asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const limit = intParam(req.query.limit, { max: 100, fallback: 50 });
  const offset = (intParam(req.query.page, { max: 100000, fallback: 1 }) - 1) * limit;
  const { rows } = await query(
    `select ${listCols} from follows f join users u on u.id = f.follower_id
      where f.followee_id = $1 order by f.created_at desc, u.id limit $2 offset $3`,
    [req.params.userId, limit, offset],
  );
  res.json({ success: true, data: rows.map(personJson) });
}));

router.get('/:userId/following', asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const limit = intParam(req.query.limit, { max: 100, fallback: 50 });
  const offset = (intParam(req.query.page, { max: 100000, fallback: 1 }) - 1) * limit;
  const { rows } = await query(
    `select ${listCols} from follows f join users u on u.id = f.followee_id
      where f.follower_id = $1 order by f.created_at desc, u.id limit $2 offset $3`,
    [req.params.userId, limit, offset],
  );
  res.json({ success: true, data: rows.map(personJson) });
}));

/* ------------------------------------------------------------- user's posts */
// Keyset pagination: ?cursor=<from the previous response>&limit=20
router.get('/:userId/posts', optionalAuth, asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const limit = intParam(req.query.limit, { max: 50, fallback: 20 });
  const params = [req.params.userId];
  const where = ["p.author_id = $1 and p.status = 'approved'"];
  const c = parseLatestCursor(req.query.cursor);
  if (c) {
    params.push(c.t, c.i);
    where.push(`(p.created_at, p.id) < ($${params.length - 1}::timestamptz, $${params.length}::uuid)`);
  }

  const rows = await selectPosts({
    me: req.user?.id, where: where.join(' and '), params, order: 'p.created_at desc, p.id desc', limit: limit + 1,
  });
  const { page, hasMore, nextCursor } = pageOf(rows, limit, latestCursor);
  res.json({ success: true, data: await withPolls(page, req.user?.id), pagination: { limit, hasMore, nextCursor } });
}));

/* ----------------------------------------------------------------- mentions */
router.get('/:userId/mentions', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const page = intParam(req.query.page, { max: 100000, fallback: 1 });
  const limit = intParam(req.query.limit, { max: 50, fallback: 20 });

  const [{ rows }, total] = await Promise.all([
    query(
      `select pm.id, pm.created_at, pm.mentioned_by, mb.name as m_name, mb.username as m_username, mb.avatar as m_avatar,
              p.id as post_id, p.title, p.content, p.category, p.created_at as post_created_at
         from post_mentions pm
         join posts p on p.id = pm.post_id
         join users mb on mb.id = pm.mentioned_by
        where pm.user_id = $1
        order by pm.created_at desc
        limit $2 offset $3`,
      [req.params.userId, limit, (page - 1) * limit],
    ),
    one('select count(*)::int as n from post_mentions where user_id = $1', [req.params.userId]),
  ]);

  res.json({
    success: true,
    data: rows.map((r) => ({
      _id: r.id,
      post: { _id: r.post_id, title: r.title, content: r.content, category: r.category, createdAt: r.post_created_at },
      mentionedBy: { _id: r.mentioned_by, name: r.m_name, username: r.m_username, avatar: r.m_avatar },
      createdAt: r.created_at,
    })),
    pagination: { page, limit, total: total.n, pages: Math.ceil(total.n / limit) },
  });
}));

/* ------------------------------------------------------------------- badges */
router.get('/:userId/badges', asyncHandler(async (req, res) => {
  requireUuid(req.params.userId);
  const user = await one('select id from users where id = $1', [req.params.userId]);
  if (!user) throw ApiError.notFound('User not found');
  const { rows } = await query('select id, name, description, icon, achieved_at from badges where user_id = $1 order by achieved_at', [user.id]);
  res.json({ success: true, data: rows.map(badgeJson) });
}));

export default router;
