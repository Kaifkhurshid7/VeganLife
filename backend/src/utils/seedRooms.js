import { query } from '../db/index.js';

// Icons are stable keys resolved to react-icons by the frontend (utils/iconMap.js)
const DEFAULT_ROOMS = [
  ['General', 'general', 'Casual chat about vegan life, wins, and everything in between.', 'leaf'],
  ['Recipes', 'recipes', 'Share and swap plant-based recipes, tips, and meal pics.', 'bowl'],
  ['Sustainability', 'sustainability', 'Zero waste, carbon footprints, and eco-hacks.', 'globe'],
  ['Fitness', 'fitness', 'Plant-powered workouts, protein questions, and gym talk.', 'dumbbell'],
  ['Challenges', 'challenges', 'Coordinate community challenges and track your streaks.', 'fire'],
  ['Off-Topic', 'off-topic', 'Everything else — memes, music, life.', 'dove'],
];

// The migration seeds these already; this guarantees the chat is never empty even
// if someone cleared the table. Idempotent (unique slug).
export async function seedDefaultRooms() {
  const { rows: [{ n }] } = await query('select count(*)::int as n from rooms');
  if (n > 0) return;
  for (const [name, slug, description, icon] of DEFAULT_ROOMS) {
    await query(
      'insert into rooms (name, slug, description, icon, is_default) values ($1, $2, $3, $4, true) on conflict (slug) do nothing',
      [name, slug, description, icon],
    );
  }
  console.log('Seeded default chat rooms');
}
