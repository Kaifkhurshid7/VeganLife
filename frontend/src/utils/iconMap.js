import {
  FaLeaf,
  FaSeedling,
  FaBowlFood,
  FaEarthAmericas,
  FaDumbbell,
  FaFire,
  FaDove,
  FaHeart,
  FaThumbsUp,
  FaFaceLaughSquint,
  FaHandsClapping,
} from 'react-icons/fa6';

/**
 * Central emoji → react-icon resolution.
 *
 * Chat room icons and comment reactions used to be stored as emoji strings in
 * MongoDB. New data stores stable keys (see ROOM_ICONS / COMMENT_REACTIONS) but
 * legacy rows still hold emoji, so both maps are consulted at display time.
 */

// Legacy emoji strings already persisted in the database → icon component.
const emojiToIconMap = {
  // Chat room icons (seeded + user-created rooms before the icon picker)
  '🌱': FaLeaf,
  '🥗': FaBowlFood,
  '🌍': FaEarthAmericas,
  '💪': FaDumbbell,
  '🔥': FaFire,
  '🦜': FaDove,
  '💚': FaLeaf,
  '🌿': FaSeedling,
  '🍃': FaLeaf,
  '🌻': FaSeedling,
  '🌞': FaEarthAmericas,
  '💧': FaEarthAmericas,
  // Comment reactions
  '👍': FaThumbsUp,
  '❤️': FaHeart,
  '❤': FaHeart,
  '😂': FaFaceLaughSquint,
  '👏': FaHandsClapping,
};

// New stable keys written going forward → icon component.
const iconKeyMap = {
  leaf: FaLeaf,
  seedling: FaSeedling,
  bowl: FaBowlFood,
  globe: FaEarthAmericas,
  dumbbell: FaDumbbell,
  fire: FaFire,
  dove: FaDove,
  heart: FaHeart,
  thumbsUp: FaThumbsUp,
  laugh: FaFaceLaughSquint,
  clap: FaHandsClapping,
};

/** Resolve either a stable key or a legacy emoji string to an icon component. */
export function resolveIcon(keyOrEmoji) {
  return iconKeyMap[keyOrEmoji] || emojiToIconMap[keyOrEmoji] || FaSeedling;
}

/** Available chat-room icons for the create-room picker. */
export const ROOM_ICONS = [
  { key: 'leaf', label: 'Leaf', Icon: FaLeaf },
  { key: 'bowl', label: 'Food', Icon: FaBowlFood },
  { key: 'globe', label: 'Planet', Icon: FaEarthAmericas },
  { key: 'dumbbell', label: 'Fitness', Icon: FaDumbbell },
  { key: 'fire', label: 'Fire', Icon: FaFire },
  { key: 'dove', label: 'Bird', Icon: FaDove },
];

/** Comment reactions — the stable `key` is sent to the API and stored in the DB. */
export const COMMENT_REACTIONS = [
  { key: 'thumbsUp', label: 'Nice', Icon: FaThumbsUp },
  { key: 'love', label: 'Love', Icon: FaHeart },
  { key: 'leaf', label: 'Inspired', Icon: FaLeaf },
  { key: 'fire', label: 'Fire', Icon: FaFire },
  { key: 'laugh', label: 'Funny', Icon: FaFaceLaughSquint },
  { key: 'clap', label: 'Clap', Icon: FaHandsClapping },
];
