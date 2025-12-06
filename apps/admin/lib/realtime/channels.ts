/**
 * Pusher/Soketi Channel Name Constants
 *
 * Channel name patterns and event types for the unified messaging system.
 * This file centralizes all real-time channel configurations for conversations,
 * presence tracking, and notifications.
 *
 * Channel Types:
 * - Private channels (private-*) - Require authentication, used for messages
 * - Presence channels (presence-*) - Require auth, track who's online/viewing
 *
 * @see https://pusher.com/docs/channels/using_channels/channels
 */

// ============================================================================
// Channel Name Generators
// ============================================================================

/**
 * Channel name patterns for real-time messaging
 *
 * Private channels (require auth):
 * - private-conversation-{id} - Messages in a specific conversation
 * - private-user-{userId} - Personal notifications for a user
 *
 * Presence channels (require auth, track members):
 * - presence-inbox - Who's online in the inbox
 * - presence-conversation-{id} - Who's viewing a conversation
 */
export const CHANNELS = {
  /**
   * Conversation-specific messaging channel
   * Used for: New messages, message updates, message deletions
   *
   * @param conversationId - UUID of the conversation
   * @returns Channel name (e.g., "private-conversation-abc123")
   *
   * @example
   * ```ts
   * const channel = CHANNELS.conversation('abc-123-def');
   * pusher.subscribe(channel); // "private-conversation-abc-123-def"
   * ```
   */
  conversation: (conversationId: string): string => `private-conversation-${conversationId}`,

  /**
   * Personal notifications channel for a specific user
   * Used for: Notification delivery, inbox updates, @mentions
   *
   * @param userId - UUID of the admin user
   * @returns Channel name (e.g., "private-user-user123")
   *
   * @example
   * ```ts
   * const channel = CHANNELS.user('user-123');
   * pusher.subscribe(channel); // "private-user-user-123"
   * ```
   */
  user: (userId: string): string => `private-user-${userId}`,

  /**
   * Global inbox presence channel
   * Used for: Tracking which users are currently viewing the inbox
   *
   * @returns Channel name ("presence-inbox")
   *
   * @example
   * ```ts
   * const channel = CHANNELS.inbox;
   * pusher.subscribe(channel); // "presence-inbox"
   * ```
   */
  inbox: 'presence-inbox',

  /**
   * Conversation-specific presence channel
   * Used for: Tracking who's viewing a conversation, typing indicators
   *
   * @param conversationId - UUID of the conversation
   * @returns Channel name (e.g., "presence-conversation-abc123")
   *
   * @example
   * ```ts
   * const channel = CHANNELS.conversationPresence('abc-123');
   * pusher.subscribe(channel); // "presence-conversation-abc-123"
   * ```
   */
  conversationPresence: (conversationId: string): string => `presence-conversation-${conversationId}`,
} as const;

// ============================================================================
// Event Types
// ============================================================================

/**
 * Event types for real-time messaging
 *
 * These events are triggered across various channels:
 * - Message events → private-conversation-{id}
 * - Typing events → presence-conversation-{id}
 * - Notification events → private-user-{userId}
 * - Presence events → presence-* channels
 */
export const EVENTS = {
  // ========================================
  // Message Events
  // ========================================

  /**
   * New message created
   * Payload: { id, conversationId, senderId, content, createdAt, ... }
   */
  MESSAGE_NEW: 'message:new',

  /**
   * Message content updated (edited)
   * Payload: { id, conversationId, content, updatedAt, editedAt }
   */
  MESSAGE_UPDATE: 'message:update',

  /**
   * Message deleted (soft delete)
   * Payload: { id, conversationId, deletedAt, deletedBy }
   */
  MESSAGE_DELETE: 'message:delete',

  // ========================================
  // Typing Indicators
  // ========================================

  /**
   * User started typing
   * Payload: { userId, userName, conversationId }
   */
  TYPING_START: 'typing:start',

  /**
   * User stopped typing (sent message or idle timeout)
   * Payload: { userId, conversationId }
   */
  TYPING_STOP: 'typing:stop',

  // ========================================
  // Notification Events
  // ========================================

  /**
   * New notification for user
   * Payload: { id, type, title, message, conversationId?, createdAt }
   */
  NOTIFICATION_NEW: 'notification:new',

  /**
   * Notification marked as read
   * Payload: { id, readAt }
   */
  NOTIFICATION_READ: 'notification:read',

  // ========================================
  // Pusher Built-in Presence Events
  // ========================================

  /**
   * New member joined presence channel (Pusher built-in)
   * Payload: { id, info: { name, email, ... } }
   */
  MEMBER_ADDED: 'pusher:member_added',

  /**
   * Member left presence channel (Pusher built-in)
   * Payload: { id }
   */
  MEMBER_REMOVED: 'pusher:member_removed',

  // ========================================
  // Conversation Events
  // ========================================

  /**
   * Conversation metadata updated (title, status, priority, etc.)
   * Payload: { id, updatedFields: { status?, priority?, assignedAgentId?, ... } }
   */
  CONVERSATION_UPDATE: 'conversation:update',

  /**
   * Conversation marked as read by user
   * Payload: { conversationId, userId, lastReadAt, unreadCount: 0 }
   */
  CONVERSATION_READ: 'conversation:read',
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Channel name type (string literal union of all possible channel patterns)
 */
export type ChannelName = string;

/**
 * Event name type (string literal union of all event constants)
 */
export type EventName = typeof EVENTS[keyof typeof EVENTS];

/**
 * Parsed channel information
 */
export interface ParsedChannel {
  /**
   * Channel type: 'conversation', 'user', 'inbox', 'conversationPresence', or 'unknown'
   */
  type: 'conversation' | 'user' | 'inbox' | 'conversationPresence' | 'unknown';

  /**
   * Extracted ID (conversation ID or user ID), if applicable
   */
  id?: string;

  /**
   * Whether this is a presence channel
   */
  isPresence: boolean;

  /**
   * Whether this is a private channel
   */
  isPrivate: boolean;

  /**
   * Original channel name
   */
  raw: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse a channel name to extract type and ID
 *
 * @param channel - Full channel name (e.g., "private-conversation-abc123")
 * @returns Parsed channel information
 *
 * @example
 * ```ts
 * const parsed = parseChannelName('private-conversation-abc-123');
 * // {
 * //   type: 'conversation',
 * //   id: 'abc-123',
 * //   isPresence: false,
 * //   isPrivate: true,
 * //   raw: 'private-conversation-abc-123'
 * // }
 * ```
 *
 * @example
 * ```ts
 * const parsed = parseChannelName('presence-inbox');
 * // {
 * //   type: 'inbox',
 * //   id: undefined,
 * //   isPresence: true,
 * //   isPrivate: false,
 * //   raw: 'presence-inbox'
 * // }
 * ```
 */
export function parseChannelName(channel: string): ParsedChannel {
  const result: ParsedChannel = {
    type: 'unknown',
    id: undefined,
    isPresence: channel.startsWith('presence-'),
    isPrivate: channel.startsWith('private-'),
    raw: channel,
  };

  // Handle presence channels
  if (channel === 'presence-inbox') {
    result.type = 'inbox';
    return result;
  }

  if (channel.startsWith('presence-conversation-')) {
    result.type = 'conversationPresence';
    result.id = channel.replace('presence-conversation-', '');
    return result;
  }

  // Handle private channels
  if (channel.startsWith('private-conversation-')) {
    result.type = 'conversation';
    result.id = channel.replace('private-conversation-', '');
    return result;
  }

  if (channel.startsWith('private-user-')) {
    result.type = 'user';
    result.id = channel.replace('private-user-', '');
    return result;
  }

  return result;
}

/**
 * Validate if a channel name is properly formatted
 *
 * @param channel - Channel name to validate
 * @returns True if channel name is valid, false otherwise
 *
 * @example
 * ```ts
 * isValidChannelName('private-conversation-abc123'); // true
 * isValidChannelName('invalid-channel'); // false
 * ```
 */
export function isValidChannelName(channel: string): boolean {
  const parsed = parseChannelName(channel);
  return parsed.type !== 'unknown';
}

/**
 * Get all channel names for a specific conversation
 * Useful for subscribing to all relevant channels at once
 *
 * @param conversationId - UUID of the conversation
 * @returns Array of channel names [messages channel, presence channel]
 *
 * @example
 * ```ts
 * const channels = getConversationChannels('abc-123');
 * // ['private-conversation-abc-123', 'presence-conversation-abc-123']
 *
 * channels.forEach(channel => pusher.subscribe(channel));
 * ```
 */
export function getConversationChannels(conversationId: string): ChannelName[] {
  return [
    CHANNELS.conversation(conversationId),
    CHANNELS.conversationPresence(conversationId),
  ];
}

/**
 * Get all channel names for a specific user
 * Useful for subscribing to all user-related channels
 *
 * @param userId - UUID of the admin user
 * @returns Array of channel names [user notifications, inbox presence]
 *
 * @example
 * ```ts
 * const channels = getUserChannels('user-123');
 * // ['private-user-user-123', 'presence-inbox']
 *
 * channels.forEach(channel => pusher.subscribe(channel));
 * ```
 */
export function getUserChannels(userId: string): ChannelName[] {
  return [
    CHANNELS.user(userId),
    CHANNELS.inbox,
  ];
}

// ============================================================================
// Channel Authorization Types
// ============================================================================

/**
 * Channel authorization request payload
 * Sent to /api/pusher/auth endpoint for private/presence channel authorization
 */
export interface ChannelAuthRequest {
  /**
   * Socket ID from Pusher client
   */
  socket_id: string;

  /**
   * Channel name being subscribed to
   */
  channel_name: string;
}

/**
 * Presence channel member data
 * Information about a user in a presence channel
 */
export interface PresenceMemberInfo {
  /**
   * User's unique identifier (admin_users.id)
   */
  id: string;

  /**
   * User's display name
   */
  name: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's role (super_admin, ol_admin, support, etc.)
   */
  role: string;

  /**
   * Optional avatar URL
   */
  avatar?: string;
}

/**
 * Channel authorization response for presence channels
 */
export interface PresenceAuthResponse {
  /**
   * Pusher authentication signature
   */
  auth: string;

  /**
   * Channel data (presence channels only)
   */
  channel_data: {
    user_id: string;
    user_info: PresenceMemberInfo;
  };
}

/**
 * Channel authorization response for private channels
 */
export interface PrivateAuthResponse {
  /**
   * Pusher authentication signature
   */
  auth: string;
}
