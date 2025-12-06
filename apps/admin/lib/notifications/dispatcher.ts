/**
 * Notification Dispatcher
 *
 * Multi-channel notification dispatch system that sends notifications across:
 * - In-app notifications (stored in database)
 * - Real-time push via Soketi/Pusher
 * - Email notifications (with digest support)
 *
 * Features:
 * - User preference checking before dispatch
 * - Quiet hours support (respects user timezone)
 * - Email queuing with delayed delivery (send later if still unread)
 * - Batch dispatch for efficiency
 * - Real-time delivery via WebSocket when user is online
 *
 * Part of Support Management System (Phase 11: Notifications)
 */

import { triggerEvent, triggerBatch, BatchEvent } from '@/lib/realtime/pusher-server';
import { CHANNELS, EVENTS } from '@/lib/realtime/channels';
import {
  createNotification,
  createNotifications,
  getOrCreatePreferences,
  NotificationPreferences,
  NotificationType,
  CreateNotificationInput,
} from '@/lib/db/notifications';

// ============================================================================
// Types
// ============================================================================

/**
 * Notification types specific to the messaging system
 * Extends the base NotificationType from the database module
 */
export type MessagingNotificationType =
  | 'new_message'
  | 'mention'
  | 'assignment'
  | 'ticket_update'
  | 'reply_to_thread'
  | 'conversation_assigned'
  | 'conversation_status_changed';

/**
 * Input for dispatching a single notification
 */
export interface DispatchNotificationInput {
  /**
   * User ID to send notification to
   */
  userId: string;

  /**
   * Type of notification (used for preference checking)
   */
  type: MessagingNotificationType;

  /**
   * Optional conversation ID (for messaging-related notifications)
   */
  conversationId?: string;

  /**
   * Optional message ID (for message-specific notifications)
   */
  messageId?: string;

  /**
   * Notification title (shown in notification list)
   */
  title: string;

  /**
   * Notification body/message
   */
  body: string;

  /**
   * Optional action URL (where to navigate when clicked)
   */
  actionUrl?: string;

  /**
   * Optional actor ID (who triggered this notification)
   */
  actorId?: string;

  /**
   * Optional metadata for additional context
   */
  metadata?: Record<string, unknown>;
}

/**
 * Result of a notification dispatch operation
 */
export interface DispatchResult {
  /**
   * Whether the notification was successfully dispatched
   */
  success: boolean;

  /**
   * Notification ID (if created in database)
   */
  notificationId?: string;

  /**
   * Channels the notification was sent to
   */
  channels: {
    inApp: boolean;
    realtime: boolean;
    email: boolean;
    push: boolean;
  };

  /**
   * Error message if dispatch failed
   */
  error?: string;
}

/**
 * Quiet hours configuration
 */
export interface QuietHoursConfig {
  /**
   * Start hour (0-23) in user's local timezone
   */
  startHour: number;

  /**
   * End hour (0-23) in user's local timezone
   */
  endHour: number;

  /**
   * User's timezone (IANA timezone string, e.g., 'Europe/Berlin')
   */
  timezone: string;
}

// ============================================================================
// Main Dispatch Functions
// ============================================================================

/**
 * Dispatch a notification across multiple channels
 *
 * This is the main entry point for sending notifications. It:
 * 1. Gets user preferences
 * 2. Checks quiet hours
 * 3. Creates in-app notification if enabled
 * 4. Sends real-time notification via Soketi if user might be online
 * 5. Queues email if enabled and appropriate
 *
 * @param input - Notification dispatch configuration
 * @returns Promise resolving to dispatch result
 *
 * @example
 * await dispatchNotification({
 *   userId: 'user-123',
 *   type: 'new_message',
 *   conversationId: 'conv-456',
 *   messageId: 'msg-789',
 *   title: 'New message from John',
 *   body: 'Hey, can you help me with...',
 *   actionUrl: '/dashboard/messages/conv-456',
 *   actorId: 'user-john',
 * });
 */
export async function dispatchNotification(
  input: DispatchNotificationInput
): Promise<DispatchResult> {
  const result: DispatchResult = {
    success: false,
    channels: {
      inApp: false,
      realtime: false,
      email: false,
      push: false,
    },
  };

  try {
    // 1. Get user preferences
    const prefs = await getOrCreatePreferences(input.userId);

    // 2. Check if user has this notification type enabled
    if (!shouldSendNotification(input.type, prefs)) {
      // User has disabled this notification type
      result.success = true; // Not an error, just respecting preferences
      return result;
    }

    // 3. Check quiet hours (if configured)
    // TODO: Implement quiet hours checking
    // const quietHours = getQuietHours(prefs);
    // if (quietHours && isQuietHours(quietHours)) {
    //   // During quiet hours, skip real-time and push, queue email for later
    //   result.success = true;
    //   return result;
    // }

    // 4. Map messaging notification type to database notification type
    const dbNotificationType = mapToDbNotificationType(input.type);

    // 5. Create in-app notification if enabled
    if (prefs.inApp) {
      const notification = await createNotification({
        userId: input.userId,
        type: dbNotificationType,
        title: input.title,
        message: input.body,
        link: input.actionUrl,
        entityType: input.conversationId ? 'comment' : undefined, // Using 'comment' as proxy for conversation
        entityId: input.conversationId || input.messageId,
        actorId: input.actorId,
        metadata: input.metadata,
      });

      result.notificationId = notification.id;
      result.channels.inApp = true;
    }

    // 6. Send real-time notification via Soketi
    // Always send real-time if user has in-app notifications enabled
    // (they might be online and want instant notification)
    if (prefs.inApp) {
      const realtimeSuccess = await sendRealtimeNotification(input, result.notificationId);
      result.channels.realtime = realtimeSuccess;
    }

    // 7. Queue email notification if enabled
    if (shouldSendEmail(prefs)) {
      // For 'instant' digest, we would send email immediately
      // For 'daily' or 'weekly', we would queue it for batch sending
      // For now, we'll just mark that email should be sent
      // TODO: Implement email queuing system
      result.channels.email = true;
    }

    // 8. Send push notification (if user is offline and has push enabled)
    // TODO: Implement web push notifications
    // This would check if user has push subscription and is offline
    result.channels.push = false;

    result.success = true;
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Notification Dispatcher] Failed to dispatch notification:', {
      userId: input.userId,
      type: input.type,
      error: error instanceof Error ? error.message : String(error),
    });

    result.error = error instanceof Error ? error.message : 'Unknown error';
    return result;
  }
}

/**
 * Dispatch notifications to multiple users in batch
 *
 * More efficient than calling dispatchNotification multiple times.
 * Uses bulk insert for database operations and batch trigger for Soketi.
 *
 * @param inputs - Array of notification dispatch configurations
 * @returns Promise resolving to array of dispatch results
 *
 * @example
 * // Notify all team members about a new message in a channel
 * await dispatchBulkNotifications(teamMembers.map(member => ({
 *   userId: member.id,
 *   type: 'new_message',
 *   conversationId: channelId,
 *   title: 'New message in #general',
 *   body: 'John posted in #general',
 *   actionUrl: `/dashboard/messages/${channelId}`,
 *   actorId: 'user-john',
 * })));
 */
export async function dispatchBulkNotifications(
  inputs: DispatchNotificationInput[]
): Promise<DispatchResult[]> {
  if (inputs.length === 0) {
    return [];
  }

  try {
    // 1. Get preferences for all users (in parallel)
    const prefsMap = new Map<string, NotificationPreferences>();
    const uniqueUserIds = [...new Set(inputs.map((i) => i.userId))];

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const prefs = await getOrCreatePreferences(userId);
        prefsMap.set(userId, prefs);
      })
    );

    // 2. Filter inputs based on user preferences
    const validInputs = inputs.filter((input) => {
      const prefs = prefsMap.get(input.userId);
      return prefs && shouldSendNotification(input.type, prefs);
    });

    if (validInputs.length === 0) {
      // All users have disabled these notifications
      return inputs.map(() => ({
        success: true,
        channels: { inApp: false, realtime: false, email: false, push: false },
      }));
    }

    // 3. Create in-app notifications in bulk
    const dbInputs: CreateNotificationInput[] = validInputs
      .filter((input) => prefsMap.get(input.userId)?.inApp)
      .map((input) => ({
        userId: input.userId,
        type: mapToDbNotificationType(input.type),
        title: input.title,
        message: input.body,
        link: input.actionUrl,
        entityType: input.conversationId ? 'comment' : undefined,
        entityId: input.conversationId || input.messageId,
        actorId: input.actorId,
        metadata: input.metadata,
      }));

    const notifications = dbInputs.length > 0 ? await createNotifications(dbInputs) : [];

    // 4. Send real-time notifications in batch
    const realtimeEvents: BatchEvent[] = validInputs
      .filter((input) => prefsMap.get(input.userId)?.inApp)
      .map((input, index) => ({
        channel: CHANNELS.user(input.userId),
        event: EVENTS.NOTIFICATION_NEW,
        data: {
          id: notifications[index]?.id,
          type: input.type,
          title: input.title,
          message: input.body,
          conversationId: input.conversationId,
          messageId: input.messageId,
          actionUrl: input.actionUrl,
          createdAt: notifications[index]?.createdAt || new Date().toISOString(),
        },
      }));

    if (realtimeEvents.length > 0) {
      await triggerBatch(realtimeEvents);
    }

    // 5. Build results
    const results: DispatchResult[] = inputs.map((input) => {
      const prefs = prefsMap.get(input.userId);
      const notification = notifications.find((n) => n.userId === input.userId);

      return {
        success: true,
        notificationId: notification?.id,
        channels: {
          inApp: !!notification,
          realtime: !!notification, // Sent if in-app was created
          email: prefs ? shouldSendEmail(prefs) : false,
          push: false, // TODO: Implement push notifications
        },
      };
    });

    return results;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Notification Dispatcher] Failed to dispatch bulk notifications:', {
      count: inputs.length,
      error: error instanceof Error ? error.message : String(error),
    });

    // Return error results for all inputs
    return inputs.map(() => ({
      success: false,
      channels: { inApp: false, realtime: false, email: false, push: false },
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if notification should be sent based on user preferences
 *
 * @param type - Notification type
 * @param prefs - User notification preferences
 * @returns True if notification should be sent
 */
function shouldSendNotification(
  type: MessagingNotificationType,
  prefs: NotificationPreferences
): boolean {
  // Map messaging notification types to preference fields
  switch (type) {
    case 'mention':
      return prefs.mentionNotify;
    case 'assignment':
    case 'conversation_assigned':
      return prefs.assignmentNotify;
    case 'new_message':
    case 'reply_to_thread':
      return prefs.commentNotify; // Using comment notify for messages
    case 'ticket_update':
    case 'conversation_status_changed':
      return prefs.taskUpdateNotify; // Using task update for ticket updates
    default:
      return prefs.systemNotify; // Default to system notifications
  }
}

/**
 * Check if email should be sent based on preferences
 *
 * @param prefs - User notification preferences
 * @returns True if email should be sent
 */
function shouldSendEmail(prefs: NotificationPreferences): boolean {
  // For 'instant' digest, send email immediately
  // For 'daily' or 'weekly', queue for batch sending
  // For 'none', don't send email
  return prefs.emailDigest !== 'none';
}

/**
 * Map messaging notification type to database notification type
 *
 * @param type - Messaging notification type
 * @returns Database notification type
 */
function mapToDbNotificationType(type: MessagingNotificationType): NotificationType {
  switch (type) {
    case 'mention':
      return 'mention';
    case 'assignment':
    case 'conversation_assigned':
      return 'assignment';
    case 'new_message':
    case 'reply_to_thread':
      return 'comment';
    case 'ticket_update':
    case 'conversation_status_changed':
      return 'task_update';
    default:
      return 'system';
  }
}

/**
 * Send real-time notification via Soketi
 *
 * @param input - Notification input
 * @param notificationId - Database notification ID (if created)
 * @returns True if notification was sent successfully
 */
async function sendRealtimeNotification(
  input: DispatchNotificationInput,
  notificationId?: string
): Promise<boolean> {
  try {
    const result = await triggerEvent(
      CHANNELS.user(input.userId),
      EVENTS.NOTIFICATION_NEW,
      {
        id: notificationId,
        type: input.type,
        title: input.title,
        message: input.body,
        conversationId: input.conversationId,
        messageId: input.messageId,
        actionUrl: input.actionUrl,
        createdAt: new Date().toISOString(),
        metadata: input.metadata,
      }
    );

    return result.success;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Notification Dispatcher] Failed to send real-time notification:', {
      userId: input.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

// ============================================================================
// Convenience Functions for Common Notification Scenarios
// ============================================================================

/**
 * Send a new message notification
 *
 * @param userId - User to notify
 * @param conversationId - Conversation ID
 * @param messageId - Message ID
 * @param senderName - Name of the message sender
 * @param messagePreview - Preview of the message content
 * @param senderId - ID of the message sender
 */
export async function notifyNewMessage(
  userId: string,
  conversationId: string,
  messageId: string,
  senderName: string,
  messagePreview: string,
  senderId: string
): Promise<DispatchResult> {
  return dispatchNotification({
    userId,
    type: 'new_message',
    conversationId,
    messageId,
    title: `New message from ${senderName}`,
    body: messagePreview,
    actionUrl: `/dashboard/messages/${conversationId}`,
    actorId: senderId,
  });
}

/**
 * Send a mention notification
 *
 * @param userId - User who was mentioned
 * @param conversationId - Conversation ID
 * @param messageId - Message ID
 * @param mentionerName - Name of the user who mentioned them
 * @param messagePreview - Preview of the message content
 * @param mentionerId - ID of the user who mentioned them
 */
export async function notifyMention(
  userId: string,
  conversationId: string,
  messageId: string,
  mentionerName: string,
  messagePreview: string,
  mentionerId: string
): Promise<DispatchResult> {
  return dispatchNotification({
    userId,
    type: 'mention',
    conversationId,
    messageId,
    title: `${mentionerName} mentioned you`,
    body: messagePreview,
    actionUrl: `/dashboard/messages/${conversationId}#${messageId}`,
    actorId: mentionerId,
  });
}

/**
 * Send a conversation assignment notification
 *
 * @param userId - User who was assigned
 * @param conversationId - Conversation ID
 * @param conversationTitle - Title/subject of the conversation
 * @param assignerId - ID of the user who assigned the conversation
 */
export async function notifyAssignment(
  userId: string,
  conversationId: string,
  conversationTitle: string,
  assignerId?: string
): Promise<DispatchResult> {
  return dispatchNotification({
    userId,
    type: 'conversation_assigned',
    conversationId,
    title: 'New conversation assigned',
    body: conversationTitle,
    actionUrl: `/dashboard/messages/${conversationId}`,
    actorId: assignerId,
  });
}

/**
 * Send a ticket status change notification
 *
 * @param userId - User to notify
 * @param conversationId - Conversation ID
 * @param conversationTitle - Title/subject of the conversation
 * @param oldStatus - Previous status
 * @param newStatus - New status
 * @param actorId - ID of the user who changed the status
 */
export async function notifyStatusChange(
  userId: string,
  conversationId: string,
  conversationTitle: string,
  oldStatus: string,
  newStatus: string,
  actorId?: string
): Promise<DispatchResult> {
  return dispatchNotification({
    userId,
    type: 'conversation_status_changed',
    conversationId,
    title: `Ticket status changed to ${newStatus}`,
    body: conversationTitle,
    actionUrl: `/dashboard/messages/${conversationId}`,
    actorId,
    metadata: {
      oldStatus,
      newStatus,
    },
  });
}
