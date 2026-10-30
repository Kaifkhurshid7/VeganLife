// Row -> JSON mappers. The API keeps the response shapes the frontend already uses
// (`_id`, nested `author`, camelCase), so moving from MongoDB to Postgres does not
// change a single field name on the wire.

export const USER_COLS = `u.id, u.name, u.username, u.email, u.avatar, u.bio, u.role,
  u.sustainability_score, u.streak, u.completed_challenges, u.is_verified, u.created_at,
  coalesce(array(select blocked_id from blocks where blocker_id = u.id), '{}') as blocked_users,
  coalesce(array(select muted_id from mutes where muter_id = u.id), '{}') as muted_users`;

/** The signed-in user's own account (what /auth/me and req.user expose). */
export function userJson(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    avatar: row.avatar,
    bio: row.bio,
    role: row.role,
    sustainabilityScore: row.sustainability_score,
    streak: row.streak,
    completedChallenges: row.completed_challenges || [],
    blockedUsers: row.blocked_users || [],
    mutedUsers: row.muted_users || [],
    isVerified: row.is_verified,
    createdAt: row.created_at,
  };
}

/** Small author card used inside posts, comments and messages. */
export function authorJson(row, prefix = 'a_', idKey = 'author_id') {
  const id = row[idKey];
  return {
    _id: id,
    id,
    name: row[`${prefix}name`],
    username: row[`${prefix}username`],
    avatar: row[`${prefix}avatar`],
  };
}

export const POST_COLS = `p.id, p.author_id, p.title, p.content, p.category, p.image, p.hashtags,
  p.status, p.is_pinned, p.upvote_count, p.comment_count, p.pin_count, p.created_at, p.updated_at,
  u.name as a_name, u.username as a_username, u.avatar as a_avatar`;

export function postJson(row, polls = []) {
  return {
    _id: row.id,
    id: row.id,
    author: authorJson(row),
    title: row.title,
    content: row.content,
    category: row.category,
    image: row.image,
    hashtags: row.hashtags || [],
    polls,
    status: row.status,
    isPinned: row.is_pinned,
    upvoteCount: row.upvote_count,
    commentCount: row.comment_count,
    pinCount: row.pin_count,
    hasUpvoted: Boolean(row.has_upvoted),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** poll row (+ options json + my_vote position) -> the shape the poll widget renders */
export function pollJson(row) {
  const options = (row.options || []).map((o) => ({
    _id: o._id,
    text: o.text,
    voteCount: o.voteCount,
    hasVoted: row.my_vote !== null && row.my_vote !== undefined && o.position === row.my_vote,
  }));
  return {
    _id: row.id,
    question: row.question,
    options,
    totalVotes: options.reduce((sum, o) => sum + (o.voteCount || 0), 0),
    hasVoted: row.my_vote ?? null,
    createdAt: row.created_at,
  };
}

export function commentJson(row, extras = {}) {
  return {
    _id: row.id,
    id: row.id,
    post: row.post_id,
    user: authorJson(row, 'u_', 'user_id'),
    parent: row.parent_id,
    text: row.text,
    isPinned: row.is_pinned,
    reactions: extras.reactions || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(extras.replies ? { replies: extras.replies } : {}),
  };
}

export function roomJson(row) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    createdBy: row.created_by,
    isDefault: row.is_default,
    isActive: row.is_active,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    ...(row.unread !== undefined ? { unreadCount: row.unread } : {}),
    ...(row.message_count !== undefined ? { messageCount: row.message_count } : {}),
  };
}

export function messageJson(row) {
  return {
    _id: row.id,
    id: row.id,
    seq: row.seq,
    room: row.room_id,
    sender: authorJson(row, 's_', 'sender_id'),
    content: row.content,
    type: row.type,
    createdAt: row.created_at,
  };
}

export function collectionJson(row, posts) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    ...(posts ? { posts } : {}),
  };
}

export function reportJson(row) {
  return {
    _id: row.id,
    id: row.id,
    reporter: row.reporter_id
      ? { _id: row.reporter_id, id: row.reporter_id, name: row.r_name, username: row.r_username, avatar: row.r_avatar }
      : null,
    targetType: row.target_type,
    targetId: row.target_id,
    reason: row.reason,
    details: row.details,
    status: row.status,
    resolvedBy: row.resolved_by
      ? { _id: row.resolved_by, id: row.resolved_by, name: row.v_name, username: row.v_username }
      : null,
    resolvedAt: row.resolved_at,
    targetTitle: row.target_title,
    targetSnippet: row.target_snippet,
    targetAuthorName: row.target_author_name,
    targetAuthorUsername: row.target_author_username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function badgeJson(row) {
  return {
    _id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    achievedAt: row.achieved_at,
  };
}

/** Escape LIKE wildcards so user input is matched literally. */
export const likePattern = (q) => `%${String(q).replace(/[\\%_]/g, '\\$&')}%`;
