/**
 * Unified Messages Database Queries
 *
 * Database queries for unified messaging system via direct PostgreSQL connection.
 * Supports all conversation types: support tickets, team channels, direct messages, internal tickets.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query, execute, transaction, PoolClient } from './index';
import type {
  Message,
  MessageListOptions,
  MessageListResult,
  CreateMessageInput,
  MessageSenderType,
  MessageContentType,
  Attachment,
  SentimentScore,
  TypingIndicator,
} from '../../types/messaging';

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for Attachment array from JSONB field
 */
function isAttachmentArray(value: unknown): value is Attachment[] {
  if (!Array.isArray(value)) return false;
  return value.every(item =>
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'type' in item &&
    'name' in item &&
    'size' in item &&
    'mimeType' in item &&
    'url' in item &&
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.name === 'string' &&
    typeof item.size === 'number' &&
    typeof item.mimeType === 'string' &&
    typeof item.url === 'string'
  );
}

/**
 * Type guard for SentimentScore from JSONB field
 */
function isSentimentScore(value: unknown): value is SentimentScore {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    'score' in obj &&
    'label' in obj &&
    'confidence' in obj &&
    typeof obj.score === 'number' &&
    (obj.label === 'positive' || obj.label === 'neutral' || obj.label === 'negative') &&
    typeof obj.confidence === 'number'
  );
}

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

/**
 * Database row type for messages table
 */
interface DBMessage {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_id: string | null;
  sender_name: string | null;
  content: string | null;
  content_type: string;
  thread_id: string | null;
  reply_count: number;
  is_private: boolean;
  mentions: string[] | null;
  attachments: unknown;
  external_id: string | null;
  external_status: string | null;
  sentiment: unknown;
  intent: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

/**
 * Database row type for typing_indicators table
 */
interface DBTypingIndicator {
  conversation_id: string;
  user_id: string;
  user_name: string | null;
  started_at: string;
  expires_at: string;
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform database row to Message object (camelCase)
 */
function transformMessage(row: DBMessage): Message {
  // Safely parse attachments with type guard
  let attachments: Attachment[] = [];
  if (row.attachments) {
    if (isAttachmentArray(row.attachments)) {
      attachments = row.attachments;
    } else {
      console.warn(`Invalid attachments format for message ${row.id}:`, row.attachments);
    }
  }

  // Safely parse sentiment with type guard
  let sentiment: SentimentScore | undefined;
  if (row.sentiment) {
    if (isSentimentScore(row.sentiment)) {
      sentiment = row.sentiment;
    } else {
      console.warn(`Invalid sentiment format for message ${row.id}:`, row.sentiment);
    }
  }

  const message: Message = {
    id: row.id,
    conversationId: row.conversation_id,
    senderType: row.sender_type as MessageSenderType,
    senderId: row.sender_id || null,
    senderName: row.sender_name || null,
    content: row.content || null,
    contentType: row.content_type as MessageContentType,
    threadId: row.thread_id || null,
    replyCount: row.reply_count,
    isPrivate: row.is_private,
    mentions: row.mentions || [],
    attachments,
    externalId: row.external_id || null,
    externalStatus: row.external_status as 'sent' | 'delivered' | 'read' | 'failed' | null,
    sentiment,
    intent: row.intent || undefined,
    editedAt: row.edited_at ? new Date(row.edited_at) : null,
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    createdAt: new Date(row.created_at),
  };

  return message;
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get messages for a conversation with pagination and filtering
 *
 * @param options - Filter and pagination options
 * @returns Paginated list of messages with total count and hasMore flag
 *
 * @example
 * const result = await getMessagesByConversation({
 *   conversationId: 'uuid-here',
 *   limit: 50,
 *   includePrivate: true,
 * });
 */
export async function getMessagesByConversation(
  options: MessageListOptions
): Promise<MessageListResult> {
  const {
    conversationId,
    threadId,
    senderType,
    includePrivate = false,
    limit: requestedLimit = 50,
    offset = 0,
    before,
    after,
  } = options;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE conditions
  const conditions: string[] = ['conversation_id = $1', 'deleted_at IS NULL'];
  const params: unknown[] = [conversationId];
  let paramIndex = 2;

  // Filter by thread
  // threadId === '' means get top-level messages only (exclude threads)
  // threadId === 'some-uuid' means get replies to that thread
  // threadId === undefined means get all messages
  if (threadId !== undefined) {
    if (threadId === '') {
      // Only top-level messages (not replies)
      conditions.push('thread_id IS NULL');
    } else {
      // Only replies to specific thread
      conditions.push(`thread_id = $${paramIndex++}`);
      params.push(threadId);
    }
  }

  // Filter by sender type
  if (senderType) {
    conditions.push(`sender_type = $${paramIndex++}`);
    params.push(senderType);
  }

  // Filter private messages (unless explicitly included)
  if (!includePrivate) {
    conditions.push('is_private = FALSE');
  }

  // Date range filters
  if (before) {
    conditions.push(`created_at < $${paramIndex++}`);
    params.push(before.toISOString());
  }

  if (after) {
    conditions.push(`created_at > $${paramIndex++}`);
    params.push(after.toISOString());
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM messages ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    ${whereClause}
    ORDER BY created_at ASC
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBMessage>(dataSql, params);
  const messages = rows.map(transformMessage);

  return {
    messages,
    total,
    hasMore: offset + messages.length < total,
  };
}

/**
 * Get a single message by ID
 *
 * @param id - Message UUID
 * @returns Message or null if not found
 *
 * @example
 * const message = await getMessageById('uuid-here');
 * if (message) {
 *   console.log(`Message from ${message.senderName}`);
 * }
 */
export async function getMessageById(id: string): Promise<Message | null> {
  const sql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    WHERE id = $1 AND deleted_at IS NULL
  `;

  const rows = await query<DBMessage>(sql, [id]);
  return rows.length > 0 ? transformMessage(rows[0]) : null;
}

/**
 * Get all replies to a message (thread messages)
 *
 * @param threadId - Parent message UUID
 * @returns List of reply messages ordered by creation time
 *
 * @example
 * const replies = await getThreadMessages('parent-message-uuid');
 * console.log(`Found ${replies.length} replies`);
 */
export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const sql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    WHERE thread_id = $1 AND deleted_at IS NULL
    ORDER BY created_at ASC
  `;

  const rows = await query<DBMessage>(sql, [threadId]);
  return rows.map(transformMessage);
}

/**
 * Create a new message
 *
 * If threadId is provided, also increments the parent message's reply_count.
 * Uses a transaction to ensure atomic operation.
 *
 * @param input - Message data
 * @returns Created message
 *
 * @example Text message
 * const message = await createMessage({
 *   conversationId: 'uuid-here',
 *   senderType: 'agent',
 *   senderId: 'agent-uuid',
 *   senderName: 'John Doe',
 *   content: 'Hello, how can I help you?',
 * });
 *
 * @example Threaded reply
 * const reply = await createMessage({
 *   conversationId: 'uuid-here',
 *   senderType: 'contact',
 *   senderId: 'contact-uuid',
 *   senderName: 'Jane Smith',
 *   content: 'Thanks for your help!',
 *   threadId: 'parent-message-uuid',
 * });
 */
export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const {
    conversationId,
    senderType,
    senderId,
    senderName,
    content,
    contentType = 'text',
    threadId,
    isPrivate = false,
    mentions = [],
    attachments = [],
    externalId,
  } = input;

  // Use transaction if this is a threaded reply
  if (threadId) {
    return transaction(async (client: PoolClient) => {
      // Insert the new message
      const insertSql = `
        INSERT INTO messages (
          conversation_id, sender_type, sender_id, sender_name,
          content, content_type, thread_id, is_private,
          mentions, attachments, external_id
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11
        )
        RETURNING
          id, conversation_id, sender_type, sender_id, sender_name,
          content, content_type, thread_id, reply_count, is_private,
          mentions, attachments, external_id, external_status,
          sentiment, intent, edited_at, deleted_at, created_at
      `;

      const insertParams = [
        conversationId,
        senderType,
        senderId || null,
        senderName || null,
        content || null,
        contentType,
        threadId,
        isPrivate,
        mentions,
        JSON.stringify(attachments),
        externalId || null,
      ];

      const insertResult = await client.query<DBMessage>(insertSql, insertParams);
      const message = insertResult.rows[0];

      // Increment reply_count on parent message
      const updateSql = `
        UPDATE messages
        SET reply_count = reply_count + 1
        WHERE id = $1
      `;

      await client.query(updateSql, [threadId]);

      return transformMessage(message);
    });
  }

  // Non-threaded message - simple insert
  const sql = `
    INSERT INTO messages (
      conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, is_private,
      mentions, attachments, external_id
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11
    )
    RETURNING
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
  `;

  const params = [
    conversationId,
    senderType,
    senderId || null,
    senderName || null,
    content || null,
    contentType,
    threadId || null,
    isPrivate,
    mentions,
    JSON.stringify(attachments),
    externalId || null,
  ];

  const rows = await query<DBMessage>(sql, params);
  return transformMessage(rows[0]);
}

/**
 * Update message content (sets edited_at timestamp)
 *
 * @param id - Message UUID
 * @param content - New message content
 * @returns Updated message or null if not found
 *
 * @example
 * const updated = await updateMessage('uuid-here', 'Updated message content');
 */
export async function updateMessage(
  id: string,
  content: string
): Promise<Message | null> {
  const sql = `
    UPDATE messages
    SET
      content = $1,
      edited_at = NOW()
    WHERE id = $2 AND deleted_at IS NULL
    RETURNING
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
  `;

  const rows = await query<DBMessage>(sql, [content, id]);
  return rows.length > 0 ? transformMessage(rows[0]) : null;
}

/**
 * Soft delete a message (sets deleted_at timestamp)
 *
 * @param id - Message UUID
 * @returns True if deleted, false if not found
 *
 * @example
 * const deleted = await deleteMessage('uuid-here');
 * if (deleted) {
 *   console.log('Message deleted successfully');
 * }
 */
export async function deleteMessage(id: string): Promise<boolean> {
  const sql = `
    UPDATE messages
    SET deleted_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id
  `;

  const result = await execute(sql, [id]);
  return (result.rowCount || 0) > 0;
}

/**
 * Get count of messages in a conversation
 *
 * @param conversationId - Conversation UUID
 * @returns Number of non-deleted messages
 *
 * @example
 * const count = await getMessageCount('uuid-here');
 * console.log(`Conversation has ${count} messages`);
 */
export async function getMessageCount(conversationId: string): Promise<number> {
  const sql = `
    SELECT COUNT(*) as count
    FROM messages
    WHERE conversation_id = $1 AND deleted_at IS NULL
  `;

  const rows = await query<{ count: string }>(sql, [conversationId]);
  return parseInt(rows[0]?.count || '0', 10);
}

// ============================================================================
// Additional Message Functions (Unified API)
// ============================================================================

/**
 * Get messages with pagination (simplified wrapper for getMessagesByConversation)
 *
 * @param conversationId - Conversation UUID
 * @param options - Query options
 * @returns Array of messages
 *
 * @example
 * const messages = await getMessages('conv-uuid', { limit: 50, offset: 0 });
 */
export async function getMessages(
  conversationId: string,
  options: {
    limit?: number;
    offset?: number;
    excludeThreads?: boolean;
    includePrivate?: boolean;
  } = {}
): Promise<Message[]> {
  // Note: to exclude threads, we pass threadId undefined and filter in the query
  // The underlying query checks for thread_id IS NULL when threadId === ''
  const result = await getMessagesByConversation({
    conversationId,
    threadId: options.excludeThreads ? '' : undefined,
    includePrivate: options.includePrivate,
    limit: options.limit,
    offset: options.offset,
  });

  return result.messages;
}

/**
 * Get thread replies (alias for getThreadMessages)
 *
 * @param messageId - Parent message UUID
 * @returns Array of reply messages
 *
 * @example
 * const replies = await getThreadReplies('msg-uuid');
 */
export async function getThreadReplies(messageId: string): Promise<Message[]> {
  return getThreadMessages(messageId);
}

/**
 * Create a thread reply (wrapper for createMessage with threadId)
 *
 * @param parentId - Parent message UUID
 * @param data - Message data
 * @returns Created reply message
 *
 * @example
 * const reply = await createThreadReply('parent-uuid', {
 *   conversationId: 'conv-uuid',
 *   senderType: 'agent',
 *   senderId: 'user-uuid',
 *   senderName: 'John',
 *   content: 'This is a reply',
 * });
 */
export async function createThreadReply(
  parentId: string,
  data: Omit<CreateMessageInput, 'threadId'>
): Promise<Message> {
  return createMessage({
    ...data,
    threadId: parentId,
  });
}

/**
 * Search messages with full-text search
 *
 * @param searchQuery - Search query string
 * @param conversationId - Optional conversation UUID to scope search
 * @param options - Additional options
 * @returns Array of matching messages
 *
 * @example
 * const results = await searchMessages('invoice payment');
 *
 * @example
 * const results = await searchMessages('bug', 'conv-uuid', { limit: 20 });
 */
export async function searchMessages(
  searchQuery: string,
  conversationId?: string,
  options: {
    limit?: number;
    includePrivate?: boolean;
  } = {}
): Promise<Message[]> {
  const { limit = 50, includePrivate = true } = options;
  const safeLimit = Math.min(limit, 200);

  const conditions: string[] = [
    'deleted_at IS NULL',
    '(content ILIKE $1 OR sender_name ILIKE $1)',
  ];
  const params: any[] = [`%${searchQuery}%`];

  if (conversationId) {
    conditions.push(`conversation_id = $${params.length + 1}`);
    params.push(conversationId);
  }

  if (!includePrivate) {
    conditions.push('is_private = FALSE');
  }

  const sql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1}::INTEGER
  `;

  params.push(safeLimit);

  const rows = await query<DBMessage>(sql, params);
  return rows.map(transformMessage);
}

// ============================================================================
// Typing Indicators (Ephemeral)
// ============================================================================

/**
 * Transform database row to TypingIndicator object
 */
function transformTypingIndicator(row: DBTypingIndicator): TypingIndicator {
  return {
    conversationId: row.conversation_id,
    userId: row.user_id,
    userName: row.user_name,
    startedAt: new Date(row.started_at),
    expiresAt: new Date(row.expires_at),
  };
}

/**
 * Set typing indicator for a user in a conversation
 * Auto-expires after 5 seconds (handled by database)
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @param userName - User display name
 *
 * @example
 * await setTypingIndicator('conv-uuid', 'user-uuid', 'John Doe');
 */
export async function setTypingIndicator(
  conversationId: string,
  userId: string,
  userName: string
): Promise<void> {
  const sql = `
    INSERT INTO typing_indicators (conversation_id, user_id, user_name, started_at, expires_at)
    VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '5 seconds')
    ON CONFLICT (conversation_id, user_id)
    DO UPDATE SET
      started_at = NOW(),
      expires_at = NOW() + INTERVAL '5 seconds',
      user_name = EXCLUDED.user_name
  `;

  await execute(sql, [conversationId, userId, userName]);
}

/**
 * Clear typing indicator for a user
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 *
 * @example
 * await clearTypingIndicator('conv-uuid', 'user-uuid');
 */
export async function clearTypingIndicator(
  conversationId: string,
  userId: string
): Promise<void> {
  const sql = `
    DELETE FROM typing_indicators
    WHERE conversation_id = $1 AND user_id = $2
  `;

  await execute(sql, [conversationId, userId]);
}

/**
 * Get active typing users in a conversation
 * Automatically cleans up expired indicators
 *
 * @param conversationId - Conversation UUID
 * @returns Array of active typing indicators
 *
 * @example
 * const typing = await getTypingUsers('conv-uuid');
 * console.log(`${typing.length} users are typing`);
 */
export async function getTypingUsers(conversationId: string): Promise<TypingIndicator[]> {
  // Clean up expired indicators first
  await execute('DELETE FROM typing_indicators WHERE expires_at < NOW()');

  const sql = `
    SELECT conversation_id, user_id, user_name, started_at, expires_at
    FROM typing_indicators
    WHERE conversation_id = $1
      AND expires_at > NOW()
    ORDER BY started_at ASC
  `;

  const rows = await query<DBTypingIndicator>(sql, [conversationId]);
  return rows.map(transformTypingIndicator);
}

// ============================================================================
// Read Tracking
// ============================================================================

/**
 * Get total unread message count for a user across all conversations
 * Uses database function for optimal performance
 *
 * @param userId - User UUID
 * @returns Total unread count
 *
 * @example
 * const unread = await getUnreadCount('user-uuid');
 * console.log(`You have ${unread} unread messages`);
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const sql = `SELECT get_user_total_unread($1) as count`;
  const rows = await query<{ count: number }>(sql, [userId]);
  return rows[0]?.count || 0;
}

/**
 * Get unread messages for a user in a conversation
 * Returns messages created after user's last_read_at timestamp
 *
 * @param userId - User UUID
 * @param conversationId - Conversation UUID
 * @returns Array of unread messages
 *
 * @example
 * const unread = await getUnreadMessages('user-uuid', 'conv-uuid');
 */
export async function getUnreadMessages(
  userId: string,
  conversationId: string
): Promise<Message[]> {
  const sql = `
    SELECT
      m.id, m.conversation_id, m.sender_type, m.sender_id, m.sender_name,
      m.content, m.content_type, m.thread_id, m.reply_count, m.is_private,
      m.mentions, m.attachments, m.external_id, m.external_status,
      m.sentiment, m.intent, m.edited_at, m.deleted_at, m.created_at
    FROM messages m
    INNER JOIN conversation_participants cp
      ON cp.conversation_id = m.conversation_id
    WHERE cp.user_id = $1
      AND cp.conversation_id = $2
      AND m.deleted_at IS NULL
      AND (
        cp.last_read_at IS NULL
        OR m.created_at > cp.last_read_at
      )
    ORDER BY m.created_at ASC
  `;

  const rows = await query<DBMessage>(sql, [userId, conversationId]);
  return rows.map(transformMessage);
}

/**
 * Mark conversation as read for a user
 * Resets unread count and updates last_read_at timestamp
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @param messageId - Optional: specific message to mark as read up to
 *
 * @example
 * await markConversationRead('conv-uuid', 'user-uuid');
 */
export async function markConversationRead(
  conversationId: string,
  userId: string,
  messageId?: string
): Promise<void> {
  const sql = `SELECT mark_conversation_read($1, $2, $3)`;
  await execute(sql, [conversationId, userId, messageId || null]);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get latest message for a conversation (for preview)
 *
 * @param conversationId - Conversation UUID
 * @returns Latest message or null
 *
 * @example
 * const latest = await getLatestMessage('conv-uuid');
 */
export async function getLatestMessage(conversationId: string): Promise<Message | null> {
  const sql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const rows = await query<DBMessage>(sql, [conversationId]);
  return rows.length > 0 ? transformMessage(rows[0]) : null;
}

/**
 * Get messages with mentions for a specific user
 *
 * @param userId - User UUID
 * @param options - Query options
 * @returns Array of messages mentioning the user
 *
 * @example
 * const mentions = await getMessagesMentioningUser('user-uuid', { limit: 10 });
 */
export async function getMessagesMentioningUser(
  userId: string,
  options: {
    conversationId?: string;
    unreadOnly?: boolean;
    limit?: number;
  } = {}
): Promise<Message[]> {
  const { conversationId, unreadOnly = false, limit = 50 } = options;
  const safeLimit = Math.min(limit, 200);

  const conditions: string[] = [
    'deleted_at IS NULL',
    '$1 = ANY(mentions)',
  ];
  const params: any[] = [userId];

  if (conversationId) {
    conditions.push(`conversation_id = $${params.length + 1}`);
    params.push(conversationId);
  }

  if (unreadOnly) {
    conditions.push(`
      created_at > COALESCE(
        (SELECT last_read_at FROM conversation_participants
         WHERE user_id = $1 AND conversation_id = messages.conversation_id),
        '1970-01-01'::timestamptz
      )
    `);
  }

  const sql = `
    SELECT
      id, conversation_id, sender_type, sender_id, sender_name,
      content, content_type, thread_id, reply_count, is_private,
      mentions, attachments, external_id, external_status,
      sentiment, intent, edited_at, deleted_at, created_at
    FROM messages
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1}::INTEGER
  `;

  params.push(safeLimit);

  const rows = await query<DBMessage>(sql, params);
  return rows.map(transformMessage);
}
