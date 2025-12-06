/**
 * Mention extraction and notification routing
 *
 * Handles @mentions in messages, resolving user identifiers to database IDs
 * and dispatching notifications to mentioned users.
 *
 * Supported formats:
 * - @username - Matches word characters only
 * - @[Full Name] - Name in square brackets for names with spaces
 *
 * Features:
 * - Duplicate mention deduplication
 * - Self-mention filtering (users don't get notified if they mention themselves)
 * - Database lookup by name or email
 * - Integration with notification dispatcher
 *
 * Uses direct PostgreSQL connection via lib/db/index.ts
 */

import { query } from '@/lib/db/index';

// ============================================================================
// Types
// ============================================================================

/**
 * Extracted mention information with optional resolved user ID
 */
export interface MentionInfo {
  /** The original mention text (@bob or @[Bob Smith]) */
  raw: string;
  /** The extracted name (bob or Bob Smith) */
  identifier: string;
  /** Resolved user ID (after database lookup) */
  userId?: string;
  /** Position in the original text */
  position: number;
}

/**
 * Message data for notification routing
 */
export interface MessageForNotification {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
}

/**
 * Database row type for admin users lookup
 */
interface AdminUserRow {
  id: string;
  name: string;
  email: string;
}

// ============================================================================
// Extraction Functions
// ============================================================================

/**
 * Extract mentions from message content
 *
 * Supports two formats:
 * - @username - Word characters only (letters, numbers, underscore)
 * - @[Full Name] - Name in square brackets (can contain spaces)
 *
 * @param content - Message content to parse
 * @returns Array of MentionInfo objects with raw text, identifier, and position
 *
 * @example
 * extractMentions("Hey @bob, can you help @[Anna Smith] with this?")
 * // Returns:
 * // [
 * //   { raw: "@bob", identifier: "bob", position: 4 },
 * //   { raw: "@[Anna Smith]", identifier: "Anna Smith", position: 24 }
 * // ]
 *
 * @example Empty content
 * extractMentions("")
 * // Returns: []
 */
export function extractMentions(content: string): MentionInfo[] {
  // Handle edge case: empty or null content
  if (!content || content.trim().length === 0) {
    return [];
  }

  const mentions: MentionInfo[] = [];

  // Regex pattern:
  // @(\w+)        - Matches @username (word characters: a-z, A-Z, 0-9, _)
  // |             - OR
  // @\[([^\]]+)\] - Matches @[anything in brackets except closing bracket]
  const regex = /@(\w+)|@\[([^\]]+)\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const identifier = match[1] || match[2]; // Group 1 for @username, Group 2 for @[name]

    mentions.push({
      raw: match[0],
      identifier: identifier.trim(), // Trim whitespace from bracketed names
      position: match.index,
    });
  }

  return mentions;
}

// ============================================================================
// Resolution Functions
// ============================================================================

/**
 * Resolve mention identifiers to user IDs via database lookup
 *
 * Looks up users by:
 * 1. Exact name match (case-insensitive)
 * 2. Email match (case-insensitive)
 *
 * Returns mentions with userId populated where found.
 *
 * @param mentions - Array of MentionInfo objects from extractMentions
 * @returns Array of MentionInfo objects with userId populated where found
 *
 * @example
 * const mentions = extractMentions("@bob @[Anna Smith] @unknown");
 * const resolved = await resolveMentions(mentions);
 * // resolved will have userId for @bob and @[Anna Smith] if they exist in DB
 *
 * @example Empty input
 * await resolveMentions([])
 * // Returns: []
 */
export async function resolveMentions(mentions: MentionInfo[]): Promise<MentionInfo[]> {
  if (mentions.length === 0) return [];

  // Get unique identifiers (deduplicate)
  const uniqueIdentifiers = Array.from(
    new Set(mentions.map((m) => m.identifier.toLowerCase()))
  );

  if (uniqueIdentifiers.length === 0) return mentions;

  // Query database for matching users
  // Look up by name OR email (case-insensitive)
  const sql = `
    SELECT id, name, email
    FROM admin_users
    WHERE LOWER(name) = ANY($1::text[])
       OR LOWER(email) = ANY($1::text[])
  `;

  const rows = await query<AdminUserRow>(sql, [uniqueIdentifiers]);

  // Create lookup map: identifier (lowercase) -> user ID
  const userIdMap = new Map<string, string>();

  for (const row of rows) {
    // Map by name
    userIdMap.set(row.name.toLowerCase(), row.id);
    // Also map by email (without @domain part for @username style mentions)
    const emailUsername = row.email.split('@')[0].toLowerCase();
    userIdMap.set(emailUsername, row.id);
    // And by full email
    userIdMap.set(row.email.toLowerCase(), row.id);
  }

  // Populate userId for each mention
  const resolvedMentions = mentions.map((mention) => {
    const identifierLower = mention.identifier.toLowerCase();
    const userId = userIdMap.get(identifierLower);

    return {
      ...mention,
      userId,
    };
  });

  return resolvedMentions;
}

/**
 * Extract and resolve mentions in one step
 *
 * Convenience function that combines extractMentions and resolveMentions.
 * Also returns deduplicated list of user IDs for notification routing.
 *
 * @param content - Message content to parse
 * @returns Object with resolved mentions and unique user IDs
 *
 * @example
 * const { mentions, userIds } = await extractAndResolveMentions(
 *   "Hey @bob and @[Anna Smith], can you help? @bob please review."
 * );
 * // mentions: Array of MentionInfo with userId populated
 * // userIds: ["uuid-bob", "uuid-anna"] (deduplicated, @bob appears once)
 */
export async function extractAndResolveMentions(content: string): Promise<{
  mentions: MentionInfo[];
  userIds: string[];
}> {
  const mentions = extractMentions(content);
  const resolved = await resolveMentions(mentions);

  // Get unique user IDs (filter out unresolved mentions and duplicates)
  const userIds = Array.from(
    new Set(
      resolved
        .filter((m) => m.userId !== undefined)
        .map((m) => m.userId!)
    )
  );

  return { mentions: resolved, userIds };
}

// ============================================================================
// Notification Functions
// ============================================================================

/**
 * Create notifications for all mentioned users
 *
 * Sends notifications to users who were @mentioned in a message.
 * Automatically filters out:
 * - The sender (users don't get notified if they mention themselves)
 * - Duplicate mentions
 *
 * NOTE: This function will be implemented when the notification dispatcher exists.
 * For now, it's a placeholder that logs the notification intent.
 *
 * @param message - Message information (id, conversationId, senderId, senderName, content)
 * @param mentionedUserIds - Array of user IDs to notify
 *
 * @example
 * await notifyMentionedUsers(
 *   {
 *     id: 'msg-uuid',
 *     conversationId: 'conv-uuid',
 *     senderId: 'sender-uuid',
 *     senderName: 'Bob Smith',
 *     content: '@anna can you help?'
 *   },
 *   ['anna-uuid']
 * );
 */
export async function notifyMentionedUsers(
  message: MessageForNotification,
  mentionedUserIds: string[]
): Promise<void> {
  // Filter out the sender (don't notify yourself)
  const usersToNotify = mentionedUserIds.filter(
    (userId) => userId !== message.senderId
  );

  if (usersToNotify.length === 0) {
    return;
  }

  // TODO: Import and use dispatchNotification when dispatcher is implemented
  // For now, log the notification intent for debugging
  console.log('[Mentions] Would notify users:', {
    messageId: message.id,
    conversationId: message.conversationId,
    sender: message.senderName,
    recipients: usersToNotify,
    preview: message.content.substring(0, 100),
  });

  // FUTURE IMPLEMENTATION:
  // import { dispatchNotification } from '@/lib/notifications/dispatcher';
  //
  // for (const userId of usersToNotify) {
  //   await dispatchNotification({
  //     userId,
  //     type: 'mention',
  //     conversationId: message.conversationId,
  //     messageId: message.id,
  //     title: `${message.senderName} mentioned you`,
  //     body: truncate(message.content, 100),
  //     actionUrl: `/dashboard/messages/${message.conversationId}#${message.id}`,
  //   });
  // }
}
