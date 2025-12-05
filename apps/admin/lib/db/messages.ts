/**
 * Unified Messages Database Module
 *
 * Handles all message types in the unified messaging system:
 * - text: Plain text messages
 * - image: Image attachments
 * - file: File attachments
 * - system: System-generated messages
 *
 * Supports message threading via threadId field.
 * Uses direct PostgreSQL connection via lib/db/index.ts
 */

import { query, execute, transaction, PoolClient } from './index';
import {
  Message,
  MessageListOptions,
  MessageListResult,
  CreateMessageInput,
  MessageSenderType,
  MessageContentType,
  Attachment,
  SentimentScore,
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
  if (threadId !== undefined) {
    if (threadId === null) {
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
