import { Router } from 'express';
import { query, one, tx, isUuid } from '../db/index.js';
import { POST_COLS, postJson, collectionJson } from '../db/mappers.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

const requireUuid = (v, label) => {
  if (!isUuid(v)) throw ApiError.badRequest(`Invalid ${label}`);
};

async function ownedCollection(collectionId, userId) {
  requireUuid(collectionId, 'collection id');
  const col = await one('select id, name, description, created_at from collections where id = $1 and user_id = $2', [collectionId, userId]);
  if (!col) throw ApiError.notFound('Collection not found');
  return col;
}

// Get user's collections (with a small preview of each one's posts)
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select c.id, c.name, c.description, c.created_at,
            coalesce((select json_agg(json_build_object('_id', p.id, 'title', p.title, 'image', p.image, 'author', p.author_id)
                                      order by cp.added_at desc)
                        from collection_posts cp join posts p on p.id = cp.post_id
                       where cp.collection_id = c.id), '[]'::json) as posts
       from collections c where c.user_id = $1 order by c.created_at`,
    [req.user.id],
  );
  res.json({ success: true, data: rows.map((r) => collectionJson(r, r.posts)) });
}));

// One collection with its posts (newest added first)
router.get('/:collectionId/posts', authenticate, asyncHandler(async (req, res) => {
  const col = await ownedCollection(req.params.collectionId, req.user.id);
  const { rows } = await query(
    `select ${POST_COLS}, exists (select 1 from post_votes v where v.post_id = p.id and v.user_id = $2) as has_upvoted
       from collection_posts cp
       join posts p on p.id = cp.post_id
       join users u on u.id = p.author_id
      where cp.collection_id = $1
      order by cp.added_at desc, p.id desc
      limit 200`,
    [col.id, req.user.id],
  );
  res.json({ success: true, data: { collection: collectionJson(col), posts: rows.map((r) => postJson(r)) } });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  if (!name) throw ApiError.badRequest('Collection name is required');
  if (name.length > 100) throw ApiError.badRequest('Collection name too long (max 100 chars)');
  if (description.length > 300) throw ApiError.badRequest('Description too long (max 300 chars)');

  // Keep one account from creating an unbounded number of collections
  const { n } = await one('select count(*)::int as n from collections where user_id = $1', [req.user.id]);
  if (n >= 100) throw ApiError.badRequest('You have reached the limit of 100 collections');

  const row = await one(
    'insert into collections (user_id, name, description) values ($1, $2, $3) returning id, name, description, created_at',
    [req.user.id, name, description],
  );
  res.status(201).json({ success: true, data: collectionJson(row, []) });
}));

router.post('/:collectionId/add', authenticate, asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) throw ApiError.badRequest('Post ID is required');
  requireUuid(postId, 'post id');

  const col = await ownedCollection(req.params.collectionId, req.user.id);
  const post = await one('select id from posts where id = $1', [postId]);
  if (!post) throw ApiError.notFound('Post not found');

  const inserted = await query(
    'insert into collection_posts (collection_id, post_id) values ($1, $2) on conflict do nothing',
    [col.id, post.id],
  );
  if (inserted.rowCount === 0) throw ApiError.badRequest('Post already in collection');

  const { rows } = await query('select post_id from collection_posts where collection_id = $1', [col.id]);
  res.json({ success: true, message: 'Post added to collection', data: collectionJson(col, rows.map((r) => r.post_id)) });
}));

router.post('/:collectionId/remove', authenticate, asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) throw ApiError.badRequest('Post ID is required');
  requireUuid(postId, 'post id');

  const col = await ownedCollection(req.params.collectionId, req.user.id);
  const removed = await query('delete from collection_posts where collection_id = $1 and post_id = $2', [col.id, postId]);
  if (removed.rowCount === 0) throw ApiError.notFound('Post not in collection');
  res.json({ success: true, message: 'Post removed from collection' });
}));

router.patch('/:collectionId', authenticate, asyncHandler(async (req, res) => {
  const col = await ownedCollection(req.params.collectionId, req.user.id);
  const { name, description } = req.body;
  const next = { name: col.name, description: col.description };

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (!trimmed) throw ApiError.badRequest('Collection name cannot be empty');
    if (trimmed.length > 100) throw ApiError.badRequest('Collection name too long (max 100 chars)');
    next.name = trimmed;
  }
  if (description !== undefined) {
    const trimmed = String(description).trim();
    if (trimmed.length > 300) throw ApiError.badRequest('Description too long (max 300 chars)');
    next.description = trimmed;
  }

  const row = await one(
    'update collections set name = $2, description = $3 where id = $1 returning id, name, description, created_at',
    [col.id, next.name, next.description],
  );
  res.json({ success: true, data: collectionJson(row) });
}));

router.delete('/:collectionId', authenticate, asyncHandler(async (req, res) => {
  const col = await ownedCollection(req.params.collectionId, req.user.id);
  await tx(async (t) => {
    await t.query('delete from collections where id = $1', [col.id]);
  });
  res.json({ success: true, message: 'Collection deleted' });
}));

export default router;
