import Room from '../models/Room.js';

// Icons are stable keys resolved to react-icons by the frontend (utils/iconMap.js)
const DEFAULT_ROOMS = [
  { name: 'General', slug: 'general', description: 'Casual chat about vegan life, wins, and everything in between.', icon: 'leaf', isDefault: true },
  { name: 'Recipes', slug: 'recipes', description: 'Share and swap plant-based recipes, tips, and meal pics.', icon: 'bowl', isDefault: true },
  { name: 'Sustainability', slug: 'sustainability', description: 'Zero waste, carbon footprints, and eco-hacks.', icon: 'globe', isDefault: true },
  { name: 'Fitness', slug: 'fitness', description: 'Plant-powered workouts, protein questions, and gym talk.', icon: 'dumbbell', isDefault: true },
  { name: 'Challenges', slug: 'challenges', description: 'Coordinate community challenges and track your streaks.', icon: 'fire', isDefault: true },
  { name: 'Off-Topic', slug: 'off-topic', description: 'Everything else — memes, music, life.', icon: 'dove', isDefault: true },
];

// Run once on boot so the chat is never empty on a fresh database
export async function seedDefaultRooms() {
  const exists = await Room.countDocuments();
  if (exists > 0) return;
  await Room.insertMany(DEFAULT_ROOMS);
  console.log('Seeded default chat rooms');
}
