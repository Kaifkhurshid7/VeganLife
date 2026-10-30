import { query } from '../db/index.js';
import { POST_COLS, postJson, pollJson } from '../db/mappers.js';
import { encodeCursor, decodeCursor } from '../db/cursor.js';
import { isUuid } from '../db/index.js';

export const CATEGORIES = ['Sustainability', 'Fitness', 'Student Life', 'Climate', 'Nutrition', 'Recipes', 'General'];

/**
 * The one query behind every post list (feed, hashtag, profile, bookmarks, ...).
 *
 *  - author card and "did I upvote this" arrive in the same round trip (join + EXISTS),
 *    so a page of 20 posts is 1 query, plus 1 for polls, never 1 + N
 *  - posts by people I blocked or muted are excluded in SQL (NOT EXISTS on two small
 *    primary-key indexes), instead of shipping an exclusion list from the app
 *
 * `where` is a SQL fragment that may reference `p` (posts) and `u` (author) and the
 * positional params in `params`.
 */
export async function selectPosts({ me, where, params = [], order, limit, offset = 0 }) {
  const p = [...params];
  let upvoted = 'false';
  let hidden = '';
  if (me) {
    p.push(me);
    const i = p.length;
    upvoted = `exists (select 1 from post_votes v where v.post_id = p.id and v.user_id = $${i})`;
    hidden = ` and not exists (select 1 from blocks b where b.blocker_id = $${i} and b.blocked_id = p.author_id)
               and not exists (select 1 from mutes m where m.muter_id = $${i} and m.muted_id = p.author_id)`;
  }
  p.push(limit);
  const li = p.length;
  p.push(offset);
  const oi = p.length;

  const { rows } = await query(
    `select ${POST_COLS}, ${upvoted} as has_upvoted
       from posts p
       join users u on u.id = p.author_id
      where ${where}${hidden}
      order by ${order}
      limit $${li} offset $${oi}`,
    p,
  );
  return rows;
}

/** Turn post rows into API JSON, attaching their polls (one extra query for the whole page). */
export async function withPolls(rows, me) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const params = me ? [ids, me] : [ids];
  const { rows: pollRows } = await query(
    `select pl.id, pl.post_id, pl.question, pl.created_at,
            (select json_agg(json_build_object('_id', o.id, 'text', o.text, 'voteCount', o.vote_count, 'position', o.position)
                             order by o.position)
               from poll_options o where o.poll_id = pl.id) as options,
            ${me
    ? '(select o2.position from poll_votes pv join poll_options o2 on o2.id = pv.option_id where pv.poll_id = pl.id and pv.user_id = $2)'
    : 'null'} as my_vote
       from polls pl
      where pl.post_id = any($1::uuid[])
      order by pl.created_at`,
    params,
  );

  const byPost = new Map();
  for (const pr of pollRows) {
    if (!byPost.has(pr.post_id)) byPost.set(pr.post_id, []);
    byPost.get(pr.post_id).push(pollJson(pr));
  }
  return rows.map((r) => postJson(r, byPost.get(r.id) || []));
}

/** Rows -> { data, hasMore, nextCursor } for a keyset-paginated list. */
export function pageOf(rows, limit, cursorOf) {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  return { page, hasMore, nextCursor: hasMore && last ? encodeCursor(cursorOf(last)) : null };
}

/** Keyset cursor for "newest first" lists: (created_at, id). */
export const latestCursor = (row) => ({ t: new Date(row.created_at).toISOString(), i: row.id });
/** Keyset cursor for "most upvoted" lists: (upvote_count, created_at, id). */
export const popularCursor = (row) => ({ u: row.upvote_count, t: new Date(row.created_at).toISOString(), i: row.id });

/** Validate a decoded cursor so a tampered one can only ever yield a 400-free empty result. */
export function parseLatestCursor(raw) {
  const c = decodeCursor(raw);
  if (!c || !isUuid(c.i) || Number.isNaN(Date.parse(c.t))) return null;
  return c;
}

export function parsePopularCursor(raw) {
  const c = decodeCursor(raw);
  if (!c || !isUuid(c.i) || Number.isNaN(Date.parse(c.t)) || !Number.isInteger(c.u)) return null;
  return c;
}
