/**
 * Pusher Real-time Hooks
 *
 * React hooks for subscribing to Pusher/Soketi channels and handling
 * real-time events in the unified messaging system.
 *
 * Features:
 * - Automatic channel subscription/unsubscription
 * - Event binding with cleanup on unmount
 * - Type-safe event handlers
 * - Null-safe channel name handling
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useConversationMessages } from '@/hooks/usePusher';
 *
 * export function ChatView({ conversationId }: { conversationId: string }) {
 *   useConversationMessages(conversationId, (message) => {
 *     console.log('New message:', message);
 *     // Update UI with new message
 *   });
 *
 *   return <div>Chat interface...</div>;
 * }
 * ```
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { Channel, PresenceChannel } from 'pusher-js';
import { getPusherClient } from '@/lib/realtime/pusher-client';
import { CHANNELS, EVENTS } from '@/lib/realtime/channels';

// ============================================================================
// Type Definitions for Real-time Events
// ============================================================================

/**
 * Message data structure for MESSAGE_NEW events
 * Emitted when a new message is created in a conversation
 */
export interface MessageData {
  id: string;
  conversationId: string;
  senderType: 'agent' | 'contact' | 'bot' | 'system';
  senderId: string | null;
  senderName: string | null;
  content: string | null;
  contentType: 'text' | 'image' | 'file' | 'system';
  threadId: string | null;
  isPrivate: boolean;
  mentions: string[];
  attachments: Array<{
    id: string;
    type: 'image' | 'file' | 'video' | 'audio';
    name: string;
    size: number;
    mimeType: string;
    url: string;
    thumbnailUrl?: string;
  }>;
  createdAt: string;
}

/**
 * Notification data structure for NOTIFICATION_NEW events
 * Emitted when a new notification is created for a user
 */
export interface NotificationData {
  id: string;
  userId: string;
  type: 'mention' | 'assignment' | 'comment' | 'task_update' | 'project_update' | 'due_date' | 'system';
  title: string;
  message?: string;
  link?: string;
  entityType?: 'task' | 'project' | 'comment';
  entityId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Typing indicator data structure for TYPING_START/TYPING_STOP events
 */
export interface TypingData {
  userId: string;
  userName: string;
  conversationId: string;
}

/**
 * Conversation update data structure for CONVERSATION_UPDATE events
 */
export interface ConversationUpdateData {
  id: string;
  updatedFields: {
    status?: string;
    priority?: string;
    assignedAgentId?: string;
    assignedTeam?: string;
    labels?: string[];
  };
}

// ============================================================================
// Core Hooks
// ============================================================================

/**
 * Channel hook result with error state and connection status
 */
export interface ChannelHookResult {
  channel: Channel | null;
  error: Error | null;
  isConnected: boolean;
}

/**
 * Subscribe to a private channel and return the channel instance
 *
 * Automatically subscribes on mount and unsubscribes on unmount.
 * Handles null/undefined channel names gracefully by not subscribing.
 * Includes error state and connection status tracking.
 *
 * @param channelName - Pusher channel name (e.g., "private-conversation-123")
 * @returns Object with channel instance, error state, and connection status
 *
 * @example
 * ```tsx
 * const { channel, error, isConnected } = useChannel('private-conversation-abc123');
 *
 * if (error) {
 *   return <div>Failed to connect: {error.message}</div>;
 * }
 *
 * if (!isConnected) {
 *   return <div>Connecting...</div>;
 * }
 *
 * useEffect(() => {
 *   if (!channel) return;
 *
 *   channel.bind('custom-event', (data) => {
 *     console.log('Custom event:', data);
 *   });
 *
 *   return () => {
 *     channel.unbind('custom-event');
 *   };
 * }, [channel]);
 * ```
 */
export function useChannel(channelName: string | null): ChannelHookResult {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Don't subscribe if channel name is null/undefined
    if (!channelName) {
      setChannel(null);
      setError(null);
      setIsConnected(false);
      return;
    }

    try {
      // Get Pusher client and subscribe to channel
      const pusher = getPusherClient();
      const ch = pusher.subscribe(channelName);

      // Listen for subscription success
      ch.bind('pusher:subscription_succeeded', () => {
        setIsConnected(true);
        setError(null);
        if (process.env.NODE_ENV === 'development') {
          console.log('[Pusher] Successfully subscribed to:', channelName);
        }
      });

      // Listen for subscription errors
      ch.bind('pusher:subscription_error', (err: Error) => {
        console.error('[Pusher] Subscription error:', channelName, err);
        setError(err);
        setIsConnected(false);
      });

      setChannel(ch);

      // Cleanup: unbind all events and unsubscribe
      return () => {
        ch.unbind_all();
        pusher.unsubscribe(channelName);
        setIsConnected(false);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[Pusher] Failed to create channel:', channelName, error);
      setError(error);
      setIsConnected(false);
      return undefined; // Explicit return for error case
    }
  }, [channelName]);

  return { channel, error, isConnected };
}

/**
 * Subscribe to a channel and listen for a specific event
 *
 * Automatically manages subscription lifecycle and event binding.
 * The callback is kept fresh via ref to avoid unnecessary re-subscriptions.
 *
 * @param channelName - Pusher channel name or null to skip subscription
 * @param eventName - Event name to listen for
 * @param callback - Event handler function
 *
 * @example
 * ```tsx
 * useEvent('private-user-123', 'notification:new', (data) => {
 *   console.log('New notification:', data);
 * });
 * ```
 */
export function useEvent<T = unknown>(
  channelName: string | null,
  eventName: string,
  callback: (data: T) => void
): void {
  const { channel } = useChannel(channelName);
  const callbackRef = useRef(callback);

  // Keep callback reference fresh without re-triggering subscription
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!channel) return;

    // Create stable handler that calls the current callback
    const handler = (data: T) => callbackRef.current(data);

    // Bind event handler
    channel.bind(eventName, handler);

    // Cleanup: unbind event handler
    return () => {
      channel.unbind(eventName, handler);
    };
  }, [channel, eventName]);
}

// ============================================================================
// Specialized Hooks for Common Use Cases
// ============================================================================

/**
 * Subscribe to conversation messages in real-time
 *
 * Listens for MESSAGE_NEW events on the conversation's private channel.
 * Automatically handles null conversationId by not subscribing.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @param onMessage - Callback invoked when a new message is received
 *
 * @example
 * ```tsx
 * function ConversationView({ conversationId }: { conversationId: string | null }) {
 *   const [messages, setMessages] = useState<MessageData[]>([]);
 *
 *   useConversationMessages(conversationId, (message) => {
 *     setMessages((prev) => [...prev, message]);
 *   });
 *
 *   return (
 *     <div>
 *       {messages.map((msg) => (
 *         <div key={msg.id}>{msg.content}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConversationMessages(
  conversationId: string | null,
  onMessage: (message: MessageData) => void
): void {
  // Generate channel name: private-conversation-{id}
  const channelName = conversationId ? CHANNELS.conversation(conversationId) : null;

  // Listen for MESSAGE_NEW events
  useEvent<MessageData>(channelName, EVENTS.MESSAGE_NEW, onMessage);
}

/**
 * Subscribe to user notifications in real-time
 *
 * Listens for NOTIFICATION_NEW events on the user's private channel.
 *
 * @param userId - UUID of the admin user
 * @param onNotification - Callback invoked when a new notification is received
 *
 * @example
 * ```tsx
 * function NotificationBell({ userId }: { userId: string }) {
 *   const [count, setCount] = useState(0);
 *
 *   useUserNotifications(userId, (notification) => {
 *     setCount((prev) => prev + 1);
 *     toast.success(notification.title);
 *   });
 *
 *   return <Badge count={count}>🔔</Badge>;
 * }
 * ```
 */
export function useUserNotifications(
  userId: string,
  onNotification: (notification: NotificationData) => void
): void {
  // Generate channel name: private-user-{id}
  const channelName = CHANNELS.user(userId);

  // Listen for NOTIFICATION_NEW events
  useEvent<NotificationData>(channelName, EVENTS.NOTIFICATION_NEW, onNotification);
}

/**
 * Subscribe to typing indicators for a conversation
 *
 * Listens for TYPING_START and TYPING_STOP events on the conversation's
 * presence channel.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @param onTypingStart - Callback invoked when a user starts typing
 * @param onTypingStop - Callback invoked when a user stops typing
 *
 * @example
 * ```tsx
 * function ChatInput({ conversationId }: { conversationId: string }) {
 *   const [typingUsers, setTypingUsers] = useState<string[]>([]);
 *
 *   useTypingIndicator(
 *     conversationId,
 *     (data) => {
 *       setTypingUsers((prev) => [...prev, data.userName]);
 *     },
 *     (data) => {
 *       setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       {typingUsers.length > 0 && (
 *         <div>{typingUsers.join(', ')} typing...</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypingIndicator(
  conversationId: string | null,
  onTypingStart: (data: TypingData) => void,
  onTypingStop: (data: TypingData) => void
): void {
  // Generate channel name: presence-conversation-{id}
  const channelName = conversationId ? CHANNELS.conversationPresence(conversationId) : null;

  // Listen for TYPING_START events
  useEvent<TypingData>(channelName, EVENTS.TYPING_START, onTypingStart);

  // Listen for TYPING_STOP events
  useEvent<TypingData>(channelName, EVENTS.TYPING_STOP, onTypingStop);
}

/**
 * Subscribe to conversation updates (status, priority, assignment changes)
 *
 * Listens for CONVERSATION_UPDATE events on the conversation's private channel.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @param onUpdate - Callback invoked when conversation metadata changes
 *
 * @example
 * ```tsx
 * function ConversationHeader({ conversationId }: { conversationId: string }) {
 *   const [status, setStatus] = useState('open');
 *
 *   useConversationUpdate(conversationId, (data) => {
 *     if (data.updatedFields.status) {
 *       setStatus(data.updatedFields.status);
 *     }
 *   });
 *
 *   return <Badge>{status}</Badge>;
 * }
 * ```
 */
export function useConversationUpdate(
  conversationId: string | null,
  onUpdate: (data: ConversationUpdateData) => void
): void {
  // Generate channel name: private-conversation-{id}
  const channelName = conversationId ? CHANNELS.conversation(conversationId) : null;

  // Listen for CONVERSATION_UPDATE events
  useEvent<ConversationUpdateData>(channelName, EVENTS.CONVERSATION_UPDATE, onUpdate);
}

/**
 * Subscribe to message updates (edits, deletions)
 *
 * Listens for MESSAGE_UPDATE and MESSAGE_DELETE events.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @param onUpdate - Callback invoked when a message is edited
 * @param onDelete - Callback invoked when a message is deleted
 *
 * @example
 * ```tsx
 * function MessageList({ conversationId }: { conversationId: string }) {
 *   const [messages, setMessages] = useState<MessageData[]>([]);
 *
 *   useMessageUpdates(
 *     conversationId,
 *     (data) => {
 *       setMessages((prev) =>
 *         prev.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg))
 *       );
 *     },
 *     (data) => {
 *       setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
 *     }
 *   );
 *
 *   return <div>{/* render messages *\/}</div>;
 * }
 * ```
 */
export function useMessageUpdates(
  conversationId: string | null,
  onUpdate: (data: Partial<MessageData> & { id: string }) => void,
  onDelete: (data: { id: string; conversationId: string }) => void
): void {
  // Generate channel name: private-conversation-{id}
  const channelName = conversationId ? CHANNELS.conversation(conversationId) : null;

  // Listen for MESSAGE_UPDATE events
  useEvent<Partial<MessageData> & { id: string }>(
    channelName,
    EVENTS.MESSAGE_UPDATE,
    onUpdate
  );

  // Listen for MESSAGE_DELETE events
  useEvent<{ id: string; conversationId: string }>(
    channelName,
    EVENTS.MESSAGE_DELETE,
    onDelete
  );
}

/**
 * Presence channel hook result with error state and connection status
 */
export interface PresenceChannelHookResult {
  channel: PresenceChannel | null;
  error: Error | null;
  isConnected: boolean;
}

/**
 * Subscribe to presence channel and track online members
 *
 * Returns the presence channel instance which provides member tracking.
 * Use the channel's members property to access current online users.
 * Includes error state and connection status tracking.
 *
 * @param channelName - Presence channel name (must start with "presence-")
 * @returns Object with presence channel instance, error state, and connection status
 *
 * @example
 * ```tsx
 * function OnlineUsers({ conversationId }: { conversationId: string }) {
 *   const [members, setMembers] = useState<string[]>([]);
 *   const channelName = CHANNELS.conversationPresence(conversationId);
 *   const { channel, error, isConnected } = usePresenceChannel(channelName);
 *
 *   if (error) {
 *     return <div>Failed to connect: {error.message}</div>;
 *   }
 *
 *   useEffect(() => {
 *     if (!channel || !isConnected) return;
 *
 *     // Get initial members
 *     const initialMembers = Object.keys(channel.members.members);
 *     setMembers(initialMembers);
 *
 *     // Listen for member join/leave
 *     channel.bind('pusher:member_added', (member) => {
 *       setMembers((prev) => [...prev, member.id]);
 *     });
 *
 *     channel.bind('pusher:member_removed', (member) => {
 *       setMembers((prev) => prev.filter((id) => id !== member.id));
 *     });
 *   }, [channel, isConnected]);
 *
 *   return <div>{members.length} online</div>;
 * }
 * ```
 */
export function usePresenceChannel(channelName: string | null): PresenceChannelHookResult {
  const [channel, setChannel] = useState<PresenceChannel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!channelName) {
      setChannel(null);
      setError(null);
      setIsConnected(false);
      return;
    }

    try {
      const pusher = getPusherClient();
      const ch = pusher.subscribe(channelName) as PresenceChannel;

      // Listen for subscription success
      ch.bind('pusher:subscription_succeeded', () => {
        setIsConnected(true);
        setError(null);
        if (process.env.NODE_ENV === 'development') {
          console.log('[Pusher] Successfully subscribed to presence channel:', channelName);
        }
      });

      // Listen for subscription errors
      ch.bind('pusher:subscription_error', (err: Error) => {
        console.error('[Pusher] Presence subscription error:', channelName, err);
        setError(err);
        setIsConnected(false);
      });

      setChannel(ch);

      return () => {
        ch.unbind_all();
        pusher.unsubscribe(channelName);
        setIsConnected(false);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[Pusher] Failed to create presence channel:', channelName, error);
      setError(error);
      setIsConnected(false);
      return undefined; // Explicit return for error case
    }
  }, [channelName]);

  return { channel, error, isConnected };
}
