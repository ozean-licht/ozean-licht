/**
 * Conversation Participants Database Module
 *
 * Manages conversation membership, read tracking, and notification preferences
 * via the conversation_participants table.
 *
 * Features:
 * - Participant management (add/remove/update)
 * - Read tracking with automatic unread count reset
 * - Per-conversation notification preferences
 * - Support for both user and contact participants
 *
 * Uses direct PostgreSQL connection via lib/db/index.ts
 */

import { query, execute } from './index';
import type {
  Participant,
  AddParticipantInput,
  UpdateParticipantInput,
  ParticipantRole,
  ParticipantListResult,
} from '../../types/messaging';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

/**
 * Database row type for conversation_participants table
 */
interface DBParticipant {
  id: string;
  conversation_id: string;
  user_id: string | null;
  contact_id: string | null;
  role: string;
  joined_at: string;
  left_at: string | null;
  last_read_at: string | null;
  last_read_message_id: string | null;
  unread_count: number;
  notifications_enabled: boolean;
  notify_all_messages: boolean;
  notify_sound_enabled: boolean;
}

/**
 * Extended database row with joined user/contact data
 */
interface DBParticipantWithUser extends DBParticipant {
  user_name?: string;
  user_email?: string;
  user_avatar_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_avatar_url?: string;
}

/**
 * Unread count result row
 */
interface UnreadCountRow {
  conversation_id: string;
  unread_count: number;
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform database row to Participant API object (camelCase)
 */
function transformParticipant(row: DBParticipantWithUser): Participant {
  const participant: Participant = {
    id: row.id,
    conversationId: row.conversation_id,
    userId: row.user_id || null,
    contactId: row.contact_id || null,
    role: row.role as ParticipantRole,
    joinedAt: new Date(row.joined_at),
    leftAt: row.left_at ? new Date(row.left_at) : null,
    lastReadAt: row.last_read_at ? new Date(row.last_read_at) : null,
    lastReadMessageId: row.last_read_message_id || null,
    unreadCount: row.unread_count,
    notificationsEnabled: row.notifications_enabled,
    notifyAllMessages: row.notify_all_messages,
    notifySoundEnabled: row.notify_sound_enabled,
  };

  // Add user info if present
  if (row.user_id && row.user_name) {
    participant.user = {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email || '',
      avatarUrl: row.user_avatar_url,
    };
  }

  // Add contact info if present
  if (row.contact_id && row.contact_name) {
    participant.contact = {
      id: row.contact_id,
      email: row.contact_email || null,
      phone: null,
      name: row.contact_name,
      avatarUrl: row.contact_avatar_url || null,
      userId: null,
      whatsappId: null,
      telegramId: null,
      customAttributes: {},
      blocked: false,
      lastActivityAt: null,
      platform: 'ozean_licht',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return participant;
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all participants for a conversation with user/contact info
 *
 * @param conversationId - Conversation UUID
 * @param includeLeft - Include participants who have left (default: false)
 * @returns List of participants with user/contact information
 *
 * @example
 * const participants = await getParticipants('conversation-uuid');
 * participants.forEach(p => {
 *   console.log(`${p.user?.name || p.contact?.name} - ${p.role}`);
 * });
 */
export async function getParticipants(
  conversationId: string,
  includeLeft: boolean = false
): Promise<ParticipantListResult> {
  const leftCondition = includeLeft ? '' : 'AND cp.left_at IS NULL';

  const sql = `
    SELECT
      cp.id,
      cp.conversation_id,
      cp.user_id,
      cp.contact_id,
      cp.role,
      cp.joined_at,
      cp.left_at,
      cp.last_read_at,
      cp.last_read_message_id,
      cp.unread_count,
      cp.notifications_enabled,
      cp.notify_all_messages,
      cp.notify_sound_enabled,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url as user_avatar_url,
      c.name as contact_name,
      c.email as contact_email,
      c.avatar_url as contact_avatar_url
    FROM conversation_participants cp
    LEFT JOIN admin_users u ON cp.user_id = u.id
    LEFT JOIN contacts c ON cp.contact_id = c.id
    WHERE cp.conversation_id = $1
    ${leftCondition}
    ORDER BY cp.joined_at ASC
  `;

  const rows = await query<DBParticipantWithUser>(sql, [conversationId]);
  const participants = rows.map(transformParticipant);

  return {
    participants,
    total: participants.length,
  };
}

/**
 * Add a participant to a conversation (UPSERT - restores if previously left)
 *
 * @param input - Participant data (conversationId + userId OR contactId + optional role)
 * @returns Created or restored participant
 *
 * @example Add user to conversation
 * const participant = await addParticipant({
 *   conversationId: 'conv-uuid',
 *   userId: 'user-uuid',
 *   role: 'member'
 * });
 *
 * @example Add contact to conversation
 * const participant = await addParticipant({
 *   conversationId: 'conv-uuid',
 *   contactId: 'contact-uuid',
 *   role: 'member'
 * });
 */
export async function addParticipant(
  input: AddParticipantInput
): Promise<Participant> {
  const { conversationId, userId, contactId, role = 'member' } = input;

  // Validate that either userId or contactId is provided (but not both)
  if ((!userId && !contactId) || (userId && contactId)) {
    throw new Error('Must provide either userId or contactId (but not both)');
  }

  // Determine which unique constraint to use for UPSERT
  const conflictColumn = userId ? 'user_id' : 'contact_id';
  const _participantId = userId || contactId;

  const sql = `
    INSERT INTO conversation_participants (
      conversation_id,
      user_id,
      contact_id,
      role
    ) VALUES ($1, $2, $3, $4)
    ON CONFLICT (conversation_id, ${conflictColumn})
    DO UPDATE SET
      left_at = NULL,
      role = EXCLUDED.role,
      joined_at = CASE
        WHEN conversation_participants.left_at IS NOT NULL THEN NOW()
        ELSE conversation_participants.joined_at
      END
    RETURNING
      id, conversation_id, user_id, contact_id, role,
      joined_at, left_at, last_read_at, last_read_message_id,
      unread_count, notifications_enabled, notify_all_messages,
      notify_sound_enabled
  `;

  const rows = await query<DBParticipant>(sql, [
    conversationId,
    userId || null,
    contactId || null,
    role,
  ]);

  const participant = rows[0];

  // Fetch with joined user/contact data
  const detailSql = `
    SELECT
      cp.id,
      cp.conversation_id,
      cp.user_id,
      cp.contact_id,
      cp.role,
      cp.joined_at,
      cp.left_at,
      cp.last_read_at,
      cp.last_read_message_id,
      cp.unread_count,
      cp.notifications_enabled,
      cp.notify_all_messages,
      cp.notify_sound_enabled,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url as user_avatar_url,
      c.name as contact_name,
      c.email as contact_email,
      c.avatar_url as contact_avatar_url
    FROM conversation_participants cp
    LEFT JOIN admin_users u ON cp.user_id = u.id
    LEFT JOIN contacts c ON cp.contact_id = c.id
    WHERE cp.id = $1
  `;

  const detailRows = await query<DBParticipantWithUser>(detailSql, [participant.id]);
  return transformParticipant(detailRows[0]);
}

/**
 * Remove a participant from a conversation (soft delete - sets left_at)
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @returns true if participant was removed, false if not found
 *
 * @example
 * const removed = await removeParticipant('conv-uuid', 'user-uuid');
 * if (removed) {
 *   console.log('User removed from conversation');
 * }
 */
export async function removeParticipant(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const sql = `
    UPDATE conversation_participants
    SET left_at = NOW()
    WHERE conversation_id = $1
      AND user_id = $2
      AND left_at IS NULL
  `;

  const result = await execute(sql, [conversationId, userId]);
  return (result.rowCount || 0) > 0;
}

/**
 * Update participant settings (role and/or notification preferences)
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @param input - Fields to update
 * @returns Updated participant or null if not found
 *
 * @example Update role
 * const updated = await updateParticipant('conv-uuid', 'user-uuid', {
 *   role: 'admin'
 * });
 *
 * @example Update notification preferences
 * const updated = await updateParticipant('conv-uuid', 'user-uuid', {
 *   notificationsEnabled: true,
 *   notifyAllMessages: false,
 *   notifySoundEnabled: true
 * });
 */
export async function updateParticipant(
  conversationId: string,
  userId: string,
  input: UpdateParticipantInput
): Promise<Participant | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  if (input.role !== undefined) {
    setClauses.push(`role = $${paramIndex++}`);
    params.push(input.role);
  }

  if (input.notificationsEnabled !== undefined) {
    setClauses.push(`notifications_enabled = $${paramIndex++}`);
    params.push(input.notificationsEnabled);
  }

  if (input.notifyAllMessages !== undefined) {
    setClauses.push(`notify_all_messages = $${paramIndex++}`);
    params.push(input.notifyAllMessages);
  }

  if (input.notifySoundEnabled !== undefined) {
    setClauses.push(`notify_sound_enabled = $${paramIndex++}`);
    params.push(input.notifySoundEnabled);
  }

  if (setClauses.length === 0) {
    // No fields to update, return current participant
    const current = await query<DBParticipantWithUser>(
      `
      SELECT
        cp.id,
        cp.conversation_id,
        cp.user_id,
        cp.contact_id,
        cp.role,
        cp.joined_at,
        cp.left_at,
        cp.last_read_at,
        cp.last_read_message_id,
        cp.unread_count,
        cp.notifications_enabled,
        cp.notify_all_messages,
        cp.notify_sound_enabled,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar_url,
        c.name as contact_name,
        c.email as contact_email,
        c.avatar_url as contact_avatar_url
      FROM conversation_participants cp
      LEFT JOIN admin_users u ON cp.user_id = u.id
      LEFT JOIN contacts c ON cp.contact_id = c.id
      WHERE cp.conversation_id = $1 AND cp.user_id = $2 AND cp.left_at IS NULL
      `,
      [conversationId, userId]
    );
    return current.length > 0 ? transformParticipant(current[0]) : null;
  }

  // Add conversation_id and user_id params
  params.push(conversationId);
  const conversationIdParam = paramIndex++;
  params.push(userId);
  const userIdParam = paramIndex++;

  const sql = `
    UPDATE conversation_participants
    SET ${setClauses.join(', ')}
    WHERE conversation_id = $${conversationIdParam}
      AND user_id = $${userIdParam}
      AND left_at IS NULL
    RETURNING id
  `;

  const rows = await query<{ id: string }>(sql, params);
  if (rows.length === 0) return null;

  // Fetch updated participant with joined data
  const detailSql = `
    SELECT
      cp.id,
      cp.conversation_id,
      cp.user_id,
      cp.contact_id,
      cp.role,
      cp.joined_at,
      cp.left_at,
      cp.last_read_at,
      cp.last_read_message_id,
      cp.unread_count,
      cp.notifications_enabled,
      cp.notify_all_messages,
      cp.notify_sound_enabled,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url as user_avatar_url,
      c.name as contact_name,
      c.email as contact_email,
      c.avatar_url as contact_avatar_url
    FROM conversation_participants cp
    LEFT JOIN admin_users u ON cp.user_id = u.id
    LEFT JOIN contacts c ON cp.contact_id = c.id
    WHERE cp.id = $1
  `;

  const detailRows = await query<DBParticipantWithUser>(detailSql, [rows[0].id]);
  return transformParticipant(detailRows[0]);
}

/**
 * Mark a conversation as read for a user (resets unread_count via trigger)
 *
 * The reset_unread_count trigger automatically resets unread_count to 0
 * when last_read_at is updated.
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @param lastMessageId - Optional message ID to mark as last read
 * @returns true if updated, false if participant not found
 *
 * @example
 * await markConversationRead('conv-uuid', 'user-uuid', 'message-uuid');
 */
export async function markConversationRead(
  conversationId: string,
  userId: string,
  lastMessageId?: string
): Promise<boolean> {
  const sql = `
    UPDATE conversation_participants
    SET
      last_read_at = NOW(),
      last_read_message_id = COALESCE($3, last_read_message_id)
    WHERE conversation_id = $1
      AND user_id = $2
      AND left_at IS NULL
  `;

  const result = await execute(sql, [conversationId, userId, lastMessageId || null]);
  return (result.rowCount || 0) > 0;
}

/**
 * Get total unread count across all conversations for a user
 *
 * @param userId - User UUID
 * @returns Total unread message count
 *
 * @example
 * const unreadCount = await getUnreadCount('user-uuid');
 * console.log(`You have ${unreadCount} unread messages`);
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const sql = `
    SELECT COALESCE(SUM(unread_count), 0) as total
    FROM conversation_participants
    WHERE user_id = $1
      AND left_at IS NULL
      AND unread_count > 0
  `;

  const rows = await query<{ total: string }>(sql, [userId]);
  return parseInt(rows[0]?.total || '0', 10);
}

/**
 * Get unread counts per conversation for a user
 *
 * @param userId - User UUID
 * @returns Array of conversation IDs with unread counts
 *
 * @example
 * const unreads = await getUnreadByConversation('user-uuid');
 * unreads.forEach(({ conversationId, unreadCount }) => {
 *   console.log(`Conversation ${conversationId}: ${unreadCount} unread`);
 * });
 */
export async function getUnreadByConversation(
  userId: string
): Promise<Array<{ conversationId: string; unreadCount: number }>> {
  const sql = `
    SELECT
      conversation_id,
      unread_count
    FROM conversation_participants
    WHERE user_id = $1
      AND left_at IS NULL
      AND unread_count > 0
    ORDER BY unread_count DESC
  `;

  const rows = await query<UnreadCountRow>(sql, [userId]);
  return rows.map(row => ({
    conversationId: row.conversation_id,
    unreadCount: row.unread_count,
  }));
}

/**
 * Check if a user is an active participant in a conversation
 *
 * @param conversationId - Conversation UUID
 * @param userId - User UUID
 * @returns true if user is an active participant, false otherwise
 *
 * @example
 * const canAccess = await isParticipant('conv-uuid', 'user-uuid');
 * if (!canAccess) {
 *   throw new Error('Not authorized to view this conversation');
 * }
 */
export async function isParticipant(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const sql = `
    SELECT 1
    FROM conversation_participants
    WHERE conversation_id = $1
      AND user_id = $2
      AND left_at IS NULL
    LIMIT 1
  `;

  const rows = await query<{ '?column?': number }>(sql, [conversationId, userId]);
  return rows.length > 0;
}
