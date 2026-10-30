import { query, one } from '../db/index.js';

// Badge definitions. Every rule reads from one stats row, so checking all badges
// costs a single query (the previous version issued one or more per badge).
const BADGE_DEFINITIONS = [
  { id: 'first_post', name: 'First Step', description: 'Published your first post', icon: 'seedling', check: (s) => s.posts >= 1 },
  { id: 'five_posts', name: 'Storyteller', description: 'Published 5 posts', icon: 'pencil', check: (s) => s.posts >= 5 },
  { id: 'ten_upvotes', name: 'Crowd Favorite', description: 'Received 10 total upvotes', icon: 'star', check: (s) => s.upvotes >= 10 },
  { id: 'fifty_upvotes', name: 'Community Star', description: 'Received 50 total upvotes', icon: 'sparkle', check: (s) => s.upvotes >= 50 },
  { id: 'first_comment', name: 'Engaged', description: 'Left your first comment', icon: 'comment', check: (s) => s.comments >= 1 },
  { id: 'ten_followers', name: 'Influencer', description: 'Gained 10 followers', icon: 'users', check: (s) => s.followers >= 10 },
  { id: 'streak_7', name: 'Consistent', description: 'Maintained a 7-day streak', icon: 'fire', check: (s) => s.streak >= 7 },
  { id: 'eco_warrior', name: 'Eco Warrior', description: 'Reached 100 sustainability XP', icon: 'globe', check: (s) => s.score >= 100 },
];

/** Check and award badges for a user. Returns the newly earned ones. */
export async function checkAndAwardBadges(userId) {
  const stats = await one(
    `select u.streak, u.sustainability_score as score,
            (select count(*)::int from posts where author_id = u.id and status = 'approved') as posts,
            (select coalesce(sum(upvote_count), 0)::int from posts where author_id = u.id) as upvotes,
            (select count(*)::int from comments where user_id = u.id) as comments,
            (select count(*)::int from follows where followee_id = u.id) as followers
       from users u where u.id = $1`,
    [userId],
  );
  if (!stats) return [];

  const { rows } = await query('select name from badges where user_id = $1', [userId]);
  const have = new Set(rows.map((r) => r.name));
  const earned = BADGE_DEFINITIONS.filter((b) => !have.has(b.name) && b.check(stats));

  for (const badge of earned) {
    // unique (user_id, name) makes this safe if two requests race
    await query(
      'insert into badges (user_id, name, description, icon) values ($1, $2, $3, $4) on conflict (user_id, name) do nothing',
      [userId, badge.name, badge.description, badge.icon],
    );
  }
  return earned;
}

export { BADGE_DEFINITIONS };
