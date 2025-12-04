/**
 * Support Messages Database Queries
 *
 * Database queries for support message management via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query } from './index';
import type { Message, MessageSenderType, MessageType } from '../../types/support';

// Database row type (snake_case)
export interface DBMessage {
  id: string;
  conversation_id: string;
  chatwoot_id: number | null;
  sender_type: MessageSenderType;
  sender_name: string | null;
  content: string | null;
  message_type: MessageType;
  is_private: boolean;
  created_at: string;
}

/**
 * Transform database row to camelCase Message object
 */
function transformDBMessageToMessage(row: DBMessage): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    chatwootId: row.chatwoot_id ?? undefined,
    senderType: row.sender_type,
    senderName: row.sender_name ?? undefined,
    content: row.content ?? undefined,
    messageType: row.message_type,
    isPrivate: row.is_private,
    createdAt: row.created_at,
  };
}

/**
 * Get messages for a conversation with pagination
 *
 * @param conversationId - UUID of the conversation
 * @param options - Pagination options
 * @returns Array of messages ordered by creation time (oldest first)
 *
 * @example
 * const messages = await getMessagesByConversation('conv-uuid', { limit: 50, offset: 0 });
 */
export async function getMessagesByConversation(
  conversationId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<Message[]> {
  const { limit = 100, offset = 0 } = options;

  // Cap limit at 500 to prevent DoS attacks
  const safeLimit = Math.min(limit, 500);

  const sql = `
    SELECT
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
    FROM support_messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
    LIMIT $2::INTEGER OFFSET $3::INTEGER
  `;

  const rows = await query<DBMessage>(sql, [conversationId, safeLimit, offset]);
  return rows.map(transformDBMessageToMessage);
}

/**
 * Sync message from Chatwoot webhook
 * Uses UPSERT logic to handle duplicate webhooks (idempotent operation)
 *
 * @param data - Message data from Chatwoot webhook
 * @returns Synced message object
 *
 * @example
 * const message = await syncMessageFromChatwoot({
 *   conversationId: 'conv-uuid',
 *   chatwootId: 12345,
 *   senderType: 'agent',
 *   senderName: 'John Doe',
 *   content: 'Hello, how can I help?',
 *   messageType: 'text',
 *   isPrivate: false,
 *   createdAt: '2025-12-04T10:00:00Z'
 * });
 */
export async function syncMessageFromChatwoot(data: {
  conversationId: string;
  chatwootId: number;
  senderType: MessageSenderType;
  senderName?: string;
  content?: string;
  messageType?: MessageType;
  isPrivate?: boolean;
  createdAt?: string;
}): Promise<Message> {
  const sql = `
    INSERT INTO support_messages (
      conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    ON CONFLICT (chatwoot_id)
    DO UPDATE SET
      sender_type = EXCLUDED.sender_type,
      sender_name = EXCLUDED.sender_name,
      content = EXCLUDED.content,
      message_type = EXCLUDED.message_type,
      is_private = EXCLUDED.is_private
    RETURNING
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
  `;

  const params = [
    data.conversationId,
    data.chatwootId,
    data.senderType,
    data.senderName || null,
    data.content || null,
    data.messageType || 'text',
    data.isPrivate ?? false,
    data.createdAt || new Date().toISOString(),
  ];

  const rows = await query<DBMessage>(sql, params);
  return transformDBMessageToMessage(rows[0]);
}

/**
 * Get message by Chatwoot ID (for deduplication)
 *
 * @param chatwootId - Chatwoot message ID
 * @returns Message if found, null otherwise
 *
 * @example
 * const message = await getMessageByChatwootId(12345);
 * if (!message) {
 *   // Message doesn't exist yet, safe to create
 * }
 */
export async function getMessageByChatwootId(chatwootId: number): Promise<Message | null> {
  const sql = `
    SELECT
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
    FROM support_messages
    WHERE chatwoot_id = $1
  `;

  const rows = await query<DBMessage>(sql, [chatwootId]);
  return rows.length > 0 ? transformDBMessageToMessage(rows[0]) : null;
}

/**
 * Add internal note (private message from agent)
 * Internal notes are not synced to external systems and only visible to agents
 *
 * @param conversationId - UUID of the conversation
 * @param content - Note content
 * @param senderName - Name of the agent creating the note
 * @returns Created message object
 *
 * @example
 * const note = await addInternalNote(
 *   'conv-uuid',
 *   'Customer mentioned they are a premium member',
 *   'Agent John'
 * );
 */
export async function addInternalNote(
  conversationId: string,
  content: string,
  senderName: string
): Promise<Message> {
  const sql = `
    INSERT INTO support_messages (
      conversation_id, sender_type, sender_name,
      content, message_type, is_private
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
  `;

  const params = [
    conversationId,
    'agent' as MessageSenderType,
    senderName,
    content,
    'text' as MessageType,
    true, // Always private for internal notes
  ];

  const rows = await query<DBMessage>(sql, params);
  return transformDBMessageToMessage(rows[0]);
}

/**
 * Get latest message for conversation (for preview)
 * Used to display the most recent message in conversation lists
 *
 * @param conversationId - UUID of the conversation
 * @returns Latest message if exists, null otherwise
 *
 * @example
 * const latestMessage = await getLatestMessage('conv-uuid');
 * console.log(`Last message: ${latestMessage?.content}`);
 */
export async function getLatestMessage(conversationId: string): Promise<Message | null> {
  const sql = `
    SELECT
      id, conversation_id, chatwoot_id, sender_type, sender_name,
      content, message_type, is_private, created_at
    FROM support_messages
    WHERE conversation_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const rows = await query<DBMessage>(sql, [conversationId]);
  return rows.length > 0 ? transformDBMessageToMessage(rows[0]) : null;
}

/**
 * Get message count for conversation
 * Used for pagination and conversation metadata
 *
 * @param conversationId - UUID of the conversation
 * @returns Total number of messages in the conversation
 *
 * @example
 * const count = await getMessageCount('conv-uuid');
 * console.log(`Total messages: ${count}`);
 */
export async function getMessageCount(conversationId: string): Promise<number> {
  const sql = `
    SELECT COUNT(*) as count
    FROM support_messages
    WHERE conversation_id = $1
  `;

  const rows = await query<{ count: string }>(sql, [conversationId]);
  return parseInt(rows[0]?.count || '0', 10);
}
