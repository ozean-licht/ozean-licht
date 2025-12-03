/**
 * Mention Parser Utility
 *
 * Parses @mentions in comment content and converts them to user links.
 * Part of Phase 12: Collaboration features.
 */

export interface ParsedMention {
  username: string;
  userId?: string;
  startIndex: number;
  endIndex: number;
}

export interface MentionParseResult {
  html: string;
  plainText: string;
  mentions: ParsedMention[];
  mentionedUsernames: string[];
}

// Regex pattern to match @username (alphanumeric, underscore, dot, hyphen)
// Must start with @ and end at word boundary
const MENTION_REGEX = /@([a-zA-Z0-9._-]+)/g;

/**
 * Parse @mentions from content
 * Returns the list of usernames mentioned
 */
export function extractMentions(content: string): string[] {
  const mentions: string[] = [];
  let match;

  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const username = match[1];
    if (!mentions.includes(username)) {
      mentions.push(username);
    }
  }

  // Reset regex lastIndex
  MENTION_REGEX.lastIndex = 0;

  return mentions;
}

/**
 * Parse @mentions and return detailed parse result
 */
export function parseMentions(content: string): MentionParseResult {
  const mentions: ParsedMention[] = [];
  const mentionedUsernames: string[] = [];
  let match;

  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const username = match[1];
    mentions.push({
      username,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });

    if (!mentionedUsernames.includes(username)) {
      mentionedUsernames.push(username);
    }
  }

  // Reset regex lastIndex
  MENTION_REGEX.lastIndex = 0;

  // Convert mentions to HTML links
  const html = content.replace(
    MENTION_REGEX,
    '<span class="text-primary font-medium cursor-pointer hover:underline">@$1</span>'
  );

  return {
    html,
    plainText: content,
    mentions,
    mentionedUsernames,
  };
}

/**
 * Convert mentions to clickable links with user IDs
 */
export function renderMentionsAsLinks(
  content: string,
  userMap: Map<string, string> // username -> userId
): string {
  return content.replace(MENTION_REGEX, (_match, username) => {
    const userId = userMap.get(username);
    if (userId) {
      return `<a href="/dashboard/access/users/${userId}" class="text-primary font-medium hover:underline">@${username}</a>`;
    }
    return `<span class="text-primary font-medium">@${username}</span>`;
  });
}

/**
 * Check if content contains any mentions
 */
export function hasMentions(content: string): boolean {
  MENTION_REGEX.lastIndex = 0;
  return MENTION_REGEX.test(content);
}

/**
 * Escape HTML in content while preserving mentions
 */
export function escapeHtmlPreserveMentions(content: string): string {
  // First escape HTML
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Then highlight mentions
  return escaped.replace(
    MENTION_REGEX,
    '<span class="text-primary font-medium">@$1</span>'
  );
}

/**
 * Get suggested users for autocomplete based on partial input
 */
export function filterUsersForMention(
  users: Array<{ id: string; name: string; email: string }>,
  query: string
): Array<{ id: string; name: string; email: string }> {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get the mention being typed at cursor position
 * Returns null if no mention is being typed
 */
export function getMentionAtCursor(
  content: string,
  cursorPosition: number
): { query: string; startIndex: number } | null {
  // Look backwards from cursor to find @
  let startIndex = cursorPosition - 1;

  while (startIndex >= 0) {
    const char = content[startIndex];

    // If we hit a space or newline before finding @, no mention
    if (char === ' ' || char === '\n') {
      return null;
    }

    // Found @, extract the query
    if (char === '@') {
      const query = content.substring(startIndex + 1, cursorPosition);
      return { query, startIndex };
    }

    startIndex--;
  }

  return null;
}

/**
 * Replace mention in content with selected user
 */
export function insertMention(
  content: string,
  mentionStart: number,
  cursorPosition: number,
  username: string
): string {
  const before = content.substring(0, mentionStart);
  const after = content.substring(cursorPosition);
  return `${before}@${username} ${after}`;
}
