/**
 * Extract hashtags from text
 * Matches #word where word contains letters, numbers, underscores
 */
export function extractHashtags(text) {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex) || [];
  return [...new Set(matches.map(tag => tag.substring(1).toLowerCase()))]; // Remove # and deduplicate
}

/**
 * Extract mentions from text
 * Matches @username where username is 3-20 characters
 */
export function extractMentions(text) {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex) || [];
  return [...new Set(matches.map(mention => mention.substring(1).toLowerCase()))]; // Remove @ and deduplicate
}

/**
 * Format content by replacing hashtags with HTML links
 */
export function formatHashtagsInContent(content) {
  return content.replace(/#(\w+)/g, '<a href="/hashtag/$1" class="hashtag">#$1</a>');
}

/**
 * Format content by replacing mentions with HTML links
 */
export function formatMentionsInContent(content) {
  return content.replace(/@(\w+)/g, '<a href="/user/$1" class="mention">@$1</a>');
}
