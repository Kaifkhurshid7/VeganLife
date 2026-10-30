import { Router } from 'express';
import { query, one, tx, isUuid } from '../db/index.js';
import { POST_COLS, commentJson, pollJson, postJson, likePattern } from '../db/mappers.js';
import { intParam, decodeCursor, encodeCursor } from '../db/cursor.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import { postLimiter } from '../middleware/security.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { upload } from '../config/multer.js';
import { saveUpload } from '../utils/uploadService.js';
import { extractHashtags, extractMentions } from '../utils/textParser.js';
import { checkAndAwardBadges } from '../utils/badges.js';
import { cache } from '../utils/cache.js';
import { sendPushToUsers } from '../utils/pushNotifications.js';
import {
  CATEGORIES, selectPosts, withPolls, pageOf, latestCursor, popularCursor,
  parseLatestCursor, parsePopularCursor,
} from '../utils/postQueries.js';

const router = Router();

const TRENDING_TTL_MS = 30 * 1000;
const MAX_HASHTAGS = 10;
const MAX_MENTIONS = 10;

// The trending-tags snapshot is the only cached thing now (the feed itself is a
// single indexed query). Any post change bumps this version, invalidating it.
async function cacheVersion() {
  return (await cache.get('postsCacheVersion')) || 0;
}
async function bumpCacheVersion() {
  await cache.incr('postsCacheVersion');
}

function requireUuid(value, label = 'id') {
  if (!isUuid(value)) throw ApiError.badRequest(`Invalid ${label}`);
}

/* =========================================================================
   FEED  (keyset pagination: ?cursor=&limit=&sort=latest|popular&categories=)
   ========================================================================= */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const limit = intParam(req.query.limit, { max: 50, fallback: 20 });
  const sort = req.query.sort === 'popular' ? 'popular' : 'latest';
  const categories = req.query.categories
    ? String(req.query.categories).split(',').map((c) => c.trim()).filter((c) => CATEGORIES.includes(c))
    : [];

  const params = [];
  const where = ["p.status = 'approved'"];
  if (categories.length) {
    params.push(categories);
    where.push(`p.category = any($${params.length}::text[])`);
  }

  let order;
  if (sort === 'popular') {
    order = 'p.upvote_count desc, p.created_at desc, p.id desc';
    const c = parsePopularCursor(req.query.cursor);
    if (c) {
      params.push(c.u, c.t, c.i);
      const n = params.length;
      where.push(`(p.upvote_count, p.created_at, p.id) < ($${n - 2}::int, $${n - 1}::timestamptz, $${n}::uuid)`);
    }
  } else {
    order = 'p.created_at desc, p.id desc';
    const c = parseLatestCursor(req.query.cursor);
    if (c) {
      params.push(c.t, c.i);
      const n = params.length;
      where.push(`(p.created_at, p.id) < ($${n - 1}::timestamptz, $${n}::uuid)`);
    }
  }

  const rows = await selectPosts({ me: req.user?.id, where: where.join(' and '), params, order, limit: limit + 1 });
  const { page, hasMore, nextCursor } = pageOf(rows, limit, sort === 'popular' ? popularCursor : latestCursor);
  const data = await withPolls(page, req.user?.id);

  res.json({ success: true, data, pagination: { limit, hasMore, nextCursor } });
}));

/* =========================================================================
   SINGLE POST
   ========================================================================= */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  // The same hidden-author rule as the feed: a blocked/muted author's post "does not exist"
  const rows = await selectPosts({ me: req.user?.id, where: 'p.id = $1', params: [req.params.id], order: 'p.id', limit: 1 });
  if (rows.length === 0) throw ApiError.notFound('Post not found');
  const [data] = await withPolls(rows, req.user?.id);
  res.json({ success: true, data });
}));

/* =========================================================================
   COMMENTS  (keyset on seq: ?before=<cursor>&limit=)
   ========================================================================= */
router.get('/:id/comments', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  requireUuid(id, 'post id');

  const limit = intParam(req.query.limit, { max: 50, fallback: 20 });
  const before = parseInt(req.query.before, 10);
  const me = req.user?.id || null;

  const params = [id];
  let cond = 'c.post_id = $1 and c.parent_id is null';
  if (Number.isFinite(before)) {
    params.push(before);
    cond += ` and c.seq < $${params.length}`;
  }
  // Comments from people I blocked are hidden (along with their replies)
  let hidden = '';
  if (me) {
    params.push(me);
    hidden = ` and not exists (select 1 from blocks b where b.blocker_id = $${params.length} and b.blocked_id = c.user_id)`;
  }
  params.push(limit + 1);

  const commentCols = `c.id, c.seq, c.post_id, c.user_id, c.parent_id, c.text, c.is_pinned, c.created_at, c.updated_at,
    u.name as u_name, u.username as u_username, u.avatar as u_avatar`;

  const { rows: top } = await query(
    `select ${commentCols} from comments c join users u on u.id = c.user_id
      where ${cond}${hidden} order by c.seq desc limit $${params.length}`,
    params,
  );

  const hasMore = top.length > limit;
  const pageRows = hasMore ? top.slice(0, limit) : top;
  const nextCursor = pageRows.length > 0 ? pageRows[pageRows.length - 1].seq : null;

  // Replies for this page, and every reaction for page + replies: 2 queries total
  let replies = [];
  if (pageRows.length > 0) {
    const rp = [pageRows.map((r) => r.id)];
    let rhidden = '';
    if (me) {
      rp.push(me);
      rhidden = ' and not exists (select 1 from blocks b where b.blocker_id = $2 and b.blocked_id = c.user_id)';
    }
    ({ rows: replies } = await query(
      `select ${commentCols} from comments c join users u on u.id = c.user_id
        where c.parent_id = any($1::uuid[])${rhidden} order by c.seq asc`,
      rp,
    ));
  }

  const allIds = [...pageRows, ...replies].map((r) => r.id);
  const reactionsBy = new Map();
  if (allIds.length > 0) {
    const { rows: reactions } = await query(
      'select comment_id, user_id, emoji from comment_reactions where comment_id = any($1::uuid[])',
      [allIds],
    );
    for (const r of reactions) {
      if (!reactionsBy.has(r.comment_id)) reactionsBy.set(r.comment_id, []);
      reactionsBy.get(r.comment_id).push({ user: r.user_id, emoji: r.emoji });
    }
  }

  const repliesByParent = new Map();
  for (const r of replies) {
    if (!repliesByParent.has(r.parent_id)) repliesByParent.set(r.parent_id, []);
    repliesByParent.get(r.parent_id).push(commentJson(r, { reactions: reactionsBy.get(r.id) }));
  }

  const data = pageRows.map((c) => commentJson(c, {
    reactions: reactionsBy.get(c.id),
    replies: repliesByParent.get(c.id) || [],
  }));

  res.json({ success: true, data, hasMore, nextCursor });
}));

/* =========================================================================
   CREATE POST
   ========================================================================= */
router.post('/', authenticate, postLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  const title = String(req.body.title || '').trim();
  const content = String(req.body.content || '').trim();
  const { category } = req.body;

  if (!title || !content || !category) {
    throw ApiError.badRequest('Title, content, and category are required');
  }
  if (!CATEGORIES.includes(category)) throw ApiError.badRequest('Invalid category');
  if (title.length > 150) throw ApiError.badRequest('Title too long (max 150 characters)');
  if (content.length > 5000) throw ApiError.badRequest('Content too long (max 5000 characters)');

  // An uploaded file is validated, resized to 1600px, stripped of metadata and
  // stored (Supabase Storage). A plain URL is accepted too, but only http(s).
  let image = '';
  if (req.file) {
    image = await saveUpload(req.file, 'post', req.user.id);
  } else if (req.body.image) {
    const url = String(req.body.image).trim();
    if (url.length > 500 || !/^https?:\/\/\S+$/.test(url)) throw ApiError.badRequest('Image must be a valid http(s) URL');
    image = url;
  }

  const hashtags = extractHashtags(content).filter((t) => t.length <= 50).slice(0, MAX_HASHTAGS);
  const mentionNames = extractMentions(content).slice(0, MAX_MENTIONS);

  const postId = await tx(async (t) => {
    const { rows } = await t.query(
      `insert into posts (author_id, title, content, category, image, hashtags, status)
       values ($1, $2, $3, $4, $5, $6, 'approved') returning id`,
      [req.user.id, title, content, category, image, hashtags],
    );
    const id = rows[0].id;

    if (mentionNames.length > 0) {
      await t.query(
        `insert into post_mentions (post_id, user_id, mentioned_by)
         select $1, u.id, $2 from users u where u.username = any($3::text[]) and u.id <> $2
         on conflict do nothing`,
        [id, req.user.id, mentionNames],
      );
    }
    return id;
  });

  const [data] = await withPolls(
    await selectPosts({ me: req.user.id, where: 'p.id = $1', params: [postId], order: 'p.id', limit: 1 }),
    req.user.id,
  );

  // Fire-and-forget side effects: push to mentioned users, badges, cache
  if (mentionNames.length > 0) {
    query('select u.id from post_mentions pm join users u on u.id = pm.user_id where pm.post_id = $1', [postId])
      .then(({ rows }) => sendPushToUsers(rows.map((r) => r.id), {
        title: 'You were mentioned',
        body: `${req.user.name} mentioned you in "${title}"`,
        url: `/community#post-${postId}`,
      }))
      .catch(() => {});
  }
  checkAndAwardBadges(req.user.id).catch(() => {});
  await bumpCacheVersion();

  res.status(201).json({ success: true, data });
}));

/* =========================================================================
   UPVOTE  (toggle; the (post, user) primary key makes it race-safe, and a
   trigger keeps posts.upvote_count exact)
   ========================================================================= */
router.post('/:id/upvote', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const post = await one('select id, author_id from posts where id = $1', [req.params.id]);
  if (!post) throw ApiError.notFound('Post not found');

  const hasUpvoted = await tx(async (t) => {
    const removed = await t.query('delete from post_votes where post_id = $1 and user_id = $2', [post.id, req.user.id]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into post_votes (post_id, user_id) values ($1, $2) on conflict do nothing', [post.id, req.user.id]);
    return true;
  });

  const { upvote_count: upvoteCount } = await one('select upvote_count from posts where id = $1', [post.id]);
  if (hasUpvoted) checkAndAwardBadges(post.author_id).catch(() => {});
  res.json({ success: true, upvoteCount, hasUpvoted });
}));

/* =========================================================================
   COMMENTS: add / reply / edit / delete / react / pin
   ========================================================================= */
async function isBlockedBy(ownerId, userId) {
  if (!ownerId || String(ownerId) === String(userId)) return false;
  return Boolean(await one('select 1 as x from blocks where blocker_id = $1 and blocked_id = $2', [ownerId, userId]));
}

async function commentWithUser(id) {
  const row = await one(
    `select c.id, c.seq, c.post_id, c.user_id, c.parent_id, c.text, c.is_pinned, c.created_at, c.updated_at,
            u.name as u_name, u.username as u_username, u.avatar as u_avatar
       from comments c join users u on u.id = c.user_id where c.id = $1`,
    [id],
  );
  return row ? commentJson(row) : null;
}

router.post('/:id/comments', authenticate, postLimiter, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const text = String(req.body.text || '').trim();
  if (!text) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const post = await one('select id, author_id, title from posts where id = $1', [req.params.id]);
  if (!post) throw ApiError.notFound('Post not found');
  if (await isBlockedBy(post.author_id, req.user.id)) throw ApiError.forbidden('You cannot comment here');

  const { id } = await one('insert into comments (post_id, user_id, text) values ($1, $2, $3) returning id', [post.id, req.user.id, text]);
  checkAndAwardBadges(req.user.id).catch(() => {});

  if (String(post.author_id) !== String(req.user.id)) {
    sendPushToUsers([post.author_id], {
      title: 'New comment',
      body: `${req.user.name} commented on "${post.title || 'your post'}"`,
      url: `/community#post-${post.id}`,
    }).catch(() => {});
  }

  res.status(201).json({ success: true, data: await commentWithUser(id) });
}));

router.post('/:postId/comments/:commentId/reply', authenticate, postLimiter, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  requireUuid(postId, 'post id');
  requireUuid(commentId, 'comment id');
  const text = String(req.body.text || '').trim();
  if (!text) throw ApiError.badRequest('Reply text is required');
  if (text.length > 500) throw ApiError.badRequest('Reply too long (max 500 chars)');

  const parent = await one('select id, post_id, user_id from comments where id = $1', [commentId]);
  if (!parent || String(parent.post_id) !== String(postId)) throw ApiError.notFound('Comment not found');
  const post = await one('select author_id from posts where id = $1', [postId]);

  // Can't reply if blocked by the post author or the comment owner
  if (await isBlockedBy(post?.author_id, req.user.id) || await isBlockedBy(parent.user_id, req.user.id)) {
    throw ApiError.forbidden('You cannot reply here');
  }

  const { id } = await one(
    'insert into comments (post_id, user_id, parent_id, text) values ($1, $2, $3, $4) returning id',
    [postId, req.user.id, commentId, text],
  );

  const recipients = new Set();
  if (String(parent.user_id) !== String(req.user.id)) recipients.add(String(parent.user_id));
  if (post?.author_id && String(post.author_id) !== String(req.user.id)) recipients.add(String(post.author_id));
  if (recipients.size) {
    sendPushToUsers([...recipients], {
      title: 'New reply',
      body: `${req.user.name} replied to your comment`,
      url: `/community#post-${postId}`,
    }).catch(() => {});
  }

  res.status(201).json({ success: true, data: await commentWithUser(id) });
}));

router.patch('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  requireUuid(commentId, 'comment id');
  const text = String(req.body.text || '').trim();
  if (!text) throw ApiError.badRequest('Comment text is required');
  if (text.length > 500) throw ApiError.badRequest('Comment too long (max 500 chars)');

  const comment = await one('select id, user_id, post_id from comments where id = $1', [commentId]);
  if (!comment || String(comment.post_id) !== String(postId)) throw ApiError.notFound('Comment not found');
  if (String(comment.user_id) !== String(req.user.id) && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to edit this comment');
  }

  await query('update comments set text = $2 where id = $1', [commentId, text]);
  res.json({ success: true, data: await commentWithUser(commentId) });
}));

// Delete (owner or admin). Replies go with it (FK cascade); the post's comment
// counter is corrected by a trigger.
router.delete('/:postId/comments/:commentId', authenticate, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  requireUuid(commentId, 'comment id');
  const comment = await one('select id, user_id, post_id from comments where id = $1', [commentId]);
  if (!comment || String(comment.post_id) !== String(postId)) throw ApiError.notFound('Comment not found');
  if (String(comment.user_id) !== String(req.user.id) && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to delete this comment');
  }

  await query('delete from comments where id = $1', [commentId]);
  res.json({ success: true, message: 'Comment deleted' });
}));

router.post('/:postId/comments/:commentId/react', authenticate, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  requireUuid(commentId, 'comment id');
  const emoji = String(req.body.emoji || '').trim();
  if (!emoji) throw ApiError.badRequest('Emoji is required');
  if (emoji.length > 16) throw ApiError.badRequest('Invalid emoji');

  const comment = await one('select id, post_id from comments where id = $1', [commentId]);
  if (!comment || String(comment.post_id) !== String(postId)) throw ApiError.notFound('Comment not found');

  await tx(async (t) => {
    const removed = await t.query(
      'delete from comment_reactions where comment_id = $1 and user_id = $2 and emoji = $3',
      [commentId, req.user.id, emoji],
    );
    if (removed.rowCount === 0) {
      await t.query('insert into comment_reactions (comment_id, user_id, emoji) values ($1, $2, $3) on conflict do nothing', [commentId, req.user.id, emoji]);
    }
  });

  const { rows } = await query('select user_id, emoji from comment_reactions where comment_id = $1', [commentId]);
  res.json({ success: true, reactions: rows.map((r) => ({ user: r.user_id, emoji: r.emoji })) });
}));

// Pin/unpin comment (post author or admin)
router.post('/:postId/comments/:commentId/pin', authenticate, asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  requireUuid(postId, 'post id');
  requireUuid(commentId, 'comment id');
  const post = await one('select author_id from posts where id = $1', [postId]);
  if (!post) throw ApiError.notFound('Post not found');
  if (String(post.author_id) !== String(req.user.id) && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can pin comments');
  }

  const updated = await one(
    'update comments set is_pinned = not is_pinned where id = $1 and post_id = $2 returning is_pinned',
    [commentId, postId],
  );
  if (!updated) throw ApiError.notFound('Comment not found');
  res.json({ success: true, isPinned: updated.is_pinned });
}));

/* =========================================================================
   ADMIN: list / moderate posts  (offset pagination so admins can jump to a page)
   ========================================================================= */
router.get('/admin/all', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const page = intParam(req.query.page, { max: 100000, fallback: 1 });
  const limit = intParam(req.query.limit, { max: 100, fallback: 20 });
  const status = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : null;
  const q = String(req.query.q || '').trim();

  const params = [];
  const where = ['true'];
  if (status) {
    params.push(status);
    where.push(`p.status = $${params.length}`);
  }
  if (q) {
    params.push(likePattern(q));
    const n = params.length;
    where.push(`(p.title ilike $${n} or p.content ilike $${n} or u.name ilike $${n} or u.username ilike $${n})`);
  }
  const whereSql = where.join(' and ');

  const [{ rows }, totalRow] = await Promise.all([
    query(
      `select ${POST_COLS}, u.email as a_email
         from posts p join users u on u.id = p.author_id
        where ${whereSql}
        order by p.created_at desc, p.id desc
        limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, limit, (page - 1) * limit],
    ),
    one(`select count(*)::int as n from posts p join users u on u.id = p.author_id where ${whereSql}`, params),
  ]);

  const data = rows.map((r) => {
    const post = postJson(r);
    post.author.email = r.a_email;
    return post;
  });
  res.json({ success: true, data, pagination: { page, limit, total: totalRow.n, pages: Math.ceil(totalRow.n / limit) } });
}));

router.patch('/:id/status', authenticate, adminOnly, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw ApiError.badRequest('Status must be approved or rejected');
  }

  const updated = await one('update posts set status = $2 where id = $1 returning id', [req.params.id, status]);
  if (!updated) throw ApiError.notFound('Post not found');
  await bumpCacheVersion();

  const [data] = await withPolls(
    await selectPosts({ me: null, where: 'p.id = $1', params: [updated.id], order: 'p.id', limit: 1 }),
    null,
  );
  res.json({ success: true, data });
}));

// Delete post (admin). Comments, votes, polls, pins and bookmarks cascade in the database.
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const removed = await one('delete from posts where id = $1 returning id', [req.params.id]);
  if (!removed) throw ApiError.notFound('Post not found');
  await bumpCacheVersion();
  res.json({ success: true, message: 'Post deleted' });
}));

/* =========================================================================
   PIN, POLLS
   ========================================================================= */
router.post('/:id/pin', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const post = await one('select id from posts where id = $1', [req.params.id]);
  if (!post) throw ApiError.notFound('Post not found');

  const isPinned = await tx(async (t) => {
    const removed = await t.query('delete from post_pins where post_id = $1 and user_id = $2', [post.id, req.user.id]);
    if (removed.rowCount > 0) return false;
    await t.query('insert into post_pins (post_id, user_id) values ($1, $2) on conflict do nothing', [post.id, req.user.id]);
    return true;
  });

  const { pin_count: pinCount } = await one('select pin_count from posts where id = $1', [post.id]);
  res.json({ success: true, isPinned, pinCount });
}));

const MAX_POLL_OPTIONS = 10;

router.post('/:id/polls', authenticate, asyncHandler(async (req, res) => {
  requireUuid(req.params.id, 'post id');
  const question = String(req.body.question || '').trim();
  const { options } = req.body;

  if (!question) throw ApiError.badRequest('Poll question is required');
  if (question.length > 300) throw ApiError.badRequest('Poll question too long (max 300 characters)');
  if (!Array.isArray(options) || options.length < 2) {
    throw ApiError.badRequest('Poll must have at least 2 options');
  }
  if (options.length > MAX_POLL_OPTIONS) throw ApiError.badRequest(`A poll can have at most ${MAX_POLL_OPTIONS} options`);
  const texts = options.map((o) => String(o ?? '').trim());
  if (texts.some((t) => !t || t.length > 200)) throw ApiError.badRequest('Each option must be 1-200 characters');

  const post = await one('select author_id from posts where id = $1', [req.params.id]);
  if (!post) throw ApiError.notFound('Post not found');
  if (String(post.author_id) !== String(req.user.id) && req.user.role !== 'admin') {
    throw ApiError.forbidden('Only post author can create polls');
  }

  const pollId = await tx(async (t) => {
    const { rows } = await t.query('insert into polls (post_id, question) values ($1, $2) returning id', [req.params.id, question]);
    for (let i = 0; i < texts.length; i += 1) {
      await t.query('insert into poll_options (poll_id, position, text) values ($1, $2, $3)', [rows[0].id, i, texts[i]]);
    }
    return rows[0].id;
  });

  res.status(201).json({ success: true, data: await loadPoll(pollId, req.user.id) });
}));

async function loadPoll(pollId, me) {
  const row = await one(
    `select pl.id, pl.question, pl.created_at,
            (select json_agg(json_build_object('_id', o.id, 'text', o.text, 'voteCount', o.vote_count, 'position', o.position) order by o.position)
               from poll_options o where o.poll_id = pl.id) as options,
            (select o2.position from poll_votes pv join poll_options o2 on o2.id = pv.option_id
              where pv.poll_id = pl.id and pv.user_id = $2) as my_vote
       from polls pl where pl.id = $1`,
    [pollId, me],
  );
  return row ? pollJson(row) : null;
}

// Vote on a poll (revoting moves the user's existing vote)
router.post('/:id/polls/:pollId/vote', authenticate, asyncHandler(async (req, res) => {
  const { id, pollId } = req.params;
  requireUuid(id, 'post id');
  requireUuid(pollId, 'poll id');
  const { optionIndex } = req.body;
  if (!Number.isInteger(optionIndex) || optionIndex < 0) throw ApiError.badRequest('Invalid option index');

  const option = await one(
    `select o.id from poll_options o join polls pl on pl.id = o.poll_id
      where pl.id = $1 and pl.post_id = $2 and o.position = $3`,
    [pollId, id, optionIndex],
  );
  if (!option) {
    const poll = await one('select 1 as x from polls where id = $1 and post_id = $2', [pollId, id]);
    throw poll ? ApiError.badRequest('Invalid option index') : ApiError.notFound('Poll not found');
  }

  // Triggers keep poll_options.vote_count exact for both the delete and the insert
  await tx(async (t) => {
    await t.query('delete from poll_votes where poll_id = $1 and user_id = $2', [pollId, req.user.id]);
    await t.query('insert into poll_votes (poll_id, user_id, option_id) values ($1, $2, $3)', [pollId, req.user.id, option.id]);
  });

  res.json({ success: true, data: await loadPoll(pollId, req.user.id) });
}));

/* =========================================================================
   HASHTAGS
   ========================================================================= */
router.get('/hashtag/:tag', optionalAuth, asyncHandler(async (req, res) => {
  const tag = String(req.params.tag).toLowerCase().slice(0, 50);
  const page = intParam(req.query.page, { max: 100000, fallback: 1 });
  const limit = intParam(req.query.limit, { max: 50, fallback: 20 });

  // hashtags @> ARRAY[tag] is served by the GIN index on posts.hashtags
  const where = "p.status = 'approved' and p.hashtags @> array[$1]::text[]";
  const [rows, totalRow] = await Promise.all([
    selectPosts({ me: req.user?.id, where, params: [tag], order: 'p.created_at desc, p.id desc', limit, offset: (page - 1) * limit }),
    one("select count(*)::int as n from posts p where p.status = 'approved' and p.hashtags @> array[$1]::text[]", [tag]),
  ]);
  const data = await withPolls(rows, req.user?.id);

  res.json({ success: true, data, hashtag: tag, pagination: { page, limit, total: totalRow.n, pages: Math.ceil(totalRow.n / limit) } });
}));

// "Trending" means recent: only the last 30 days are counted, which keeps this an index
// range scan instead of a pass over every post ever written.
router.get('/trending/hashtags', asyncHandler(async (req, res) => {
  const limit = intParam(req.query.limit, { max: 30, fallback: 10 });
  const cacheKey = `trending:${await cacheVersion()}:${limit}`;

  let trending = await cache.get(cacheKey);
  if (!trending) {
    const { rows } = await query(
      `select tag, count(*)::int as count
         from posts p, unnest(p.hashtags) as tag
        where p.status = 'approved'
          and p.created_at > public.now_ms() - interval '30 days'
        group by tag
        order by count desc, tag
        limit $1`,
      [limit],
    );
    trending = rows;
    await cache.set(cacheKey, trending, TRENDING_TTL_MS);
  }

  res.json({ success: true, data: trending });
}));

export default router;
