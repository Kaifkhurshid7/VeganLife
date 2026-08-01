import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// Badge definitions
const BADGE_DEFINITIONS = [
  {
    id: 'first_post',
    name: 'First Step',
    description: 'Published your first post',
    icon: '🌱',
    check: async (userId) => {
      const count = await Post.countDocuments({ author: userId, status: 'approved' });
      return count >= 1;
    }
  },
  {
    id: 'five_posts',
    name: 'Storyteller',
    description: 'Published 5 posts',
    icon: '📝',
    check: async (userId) => {
      const count = await Post.countDocuments({ author: userId, status: 'approved' });
      return count >= 5;
    }
  },
  {
    id: 'ten_upvotes',
    name: 'Crowd Favorite',
    description: 'Received 10 total upvotes',
    icon: '⭐',
    check: async (userId) => {
      const posts = await Post.find({ author: userId, upvoteCount: { $gt: 0 } }).select('upvoteCount').lean();
      const totalUpvotes = posts.reduce((sum, p) => sum + (p.upvoteCount || 0), 0);
      return totalUpvotes >= 10;
    }
  },
  {
    id: 'fifty_upvotes',
    name: 'Community Star',
    description: 'Received 50 total upvotes',
    icon: '🌟',
    check: async (userId) => {
      const posts = await Post.find({ author: userId, upvoteCount: { $gt: 0 } }).select('upvoteCount').lean();
      const totalUpvotes = posts.reduce((sum, p) => sum + (p.upvoteCount || 0), 0);
      return totalUpvotes >= 50;
    }
  },
  {
    id: 'first_comment',
    name: 'Engaged',
    description: 'Left your first comment',
    icon: '💬',
    check: async (userId) => {
      const comment = await Comment.findOne({ user: userId });
      return !!comment;
    }
  },
  {
    id: 'ten_followers',
    name: 'Influencer',
    description: 'Gained 10 followers',
    icon: '👥',
    check: async (userId) => {
      const user = await User.findById(userId).lean();
      return (user?.followers?.length || 0) >= 10;
    }
  },
  {
    id: 'streak_7',
    name: 'Consistent',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    check: async (userId) => {
      const user = await User.findById(userId).lean();
      return (user?.streak || 0) >= 7;
    }
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Reached 100 sustainability XP',
    icon: '🌍',
    check: async (userId) => {
      const user = await User.findById(userId).lean();
      return (user?.sustainabilityScore || 0) >= 100;
    }
  },
];

/**
 * Check and award badges for a user
 */
export async function checkAndAwardBadges(userId) {
  const user = await User.findById(userId);
  if (!user) return [];

  const existingBadgeNames = user.badges.map(b => b.name);
  const newBadges = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (existingBadgeNames.includes(badge.name)) continue;

    try {
      const earned = await badge.check(userId);
      if (earned) {
        user.badges.push({
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          achievedAt: new Date(),
        });
        newBadges.push(badge);
      }
    } catch (err) {
      // Skip badge check errors silently
    }
  }

  if (newBadges.length > 0) {
    await user.save();
  }

  return newBadges;
}

export { BADGE_DEFINITIONS };
