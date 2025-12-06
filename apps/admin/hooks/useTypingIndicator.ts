/**
 * Typing Indicator Hooks
 *
 * React hooks for managing typing indicators in the unified messaging system.
 * Provides functionality for:
 * 1. Tracking other users' typing status
 * 2. Sending own typing events with debouncing
 * 3. Auto-expiration of stale typing indicators
 *
 * Features:
 * - Debounced typing events to reduce network traffic
 * - Auto-stop after 5 seconds of inactivity
 * - Real-time updates via Pusher/Soketi
 * - Null-safe conversation ID handling
 * - Automatic cleanup on unmount
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useTypingIndicator } from '@/hooks/useTypingIndicator';
 *
 * export function ChatInput({ conversationId, currentUserId }: Props) {
 *   const { typingUsers, onKeyPress, sendTypingStop } = useTypingIndicator(
 *     conversationId,
 *     currentUserId
 *   );
 *
 *   return (
 *     <div>
 *       {typingUsers.length > 0 && (
 *         <div>{typingUsers.map(u => u.userName).join(', ')} typing...</div>
 *       )}
 *       <input
 *         onKeyDown={onKeyPress}
 *         onBlur={sendTypingStop}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getPusherClient } from '@/lib/realtime/pusher-client';
import { CHANNELS, EVENTS } from '@/lib/realtime/channels';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Typing user information
 * Represents a user who is currently typing in a conversation
 */
export interface TypingUser {
  /**
   * User's unique identifier
   */
  userId: string;

  /**
   * User's display name
   */
  userName: string;

  /**
   * ISO timestamp when user started typing
   */
  startedAt: string;
}

// ============================================================================
// Hook: useTypingUsers
// ============================================================================

/**
 * Track typing users in a conversation
 *
 * Subscribes to TYPING_START and TYPING_STOP events on the conversation's
 * private channel. Automatically expires typing indicators after 5 seconds.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @returns Array of users currently typing
 *
 * @example
 * ```tsx
 * function TypingIndicator({ conversationId }: { conversationId: string | null }) {
 *   const typingUsers = useTypingUsers(conversationId);
 *
 *   if (typingUsers.length === 0) return null;
 *
 *   return (
 *     <div className="text-sm text-muted-foreground">
 *       {typingUsers.map(u => u.userName).join(', ')} typing...
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypingUsers(conversationId: string | null): TypingUser[] {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    // Don't subscribe if no conversation selected
    if (!conversationId) {
      setTypingUsers([]);
      return;
    }

    const pusher = getPusherClient();
    const channel = pusher.subscribe(CHANNELS.conversation(conversationId));

    // Handle TYPING_START event
    const handleTypingStart = (data: TypingUser) => {
      setTypingUsers((prev) => {
        // Update existing user or add new one
        const existingIndex = prev.findIndex((u) => u.userId === data.userId);
        if (existingIndex !== -1) {
          // Update existing user's timestamp
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        // Add new typing user
        return [...prev, data];
      });
    };

    // Handle TYPING_STOP event
    const handleTypingStop = (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    // Bind event handlers
    channel.bind(EVENTS.TYPING_START, handleTypingStart);
    channel.bind(EVENTS.TYPING_STOP, handleTypingStop);

    // Cleanup on unmount or conversation change
    return () => {
      channel.unbind(EVENTS.TYPING_START, handleTypingStart);
      channel.unbind(EVENTS.TYPING_STOP, handleTypingStop);
      pusher.unsubscribe(CHANNELS.conversation(conversationId));
    };
  }, [conversationId]);

  // Auto-expire typing indicators after 5 seconds
  // Re-create interval when conversation changes to prevent memory leaks
  useEffect(() => {
    // Don't run interval if no conversation selected
    if (!conversationId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) =>
        prev.filter((u) => {
          const startedTime = new Date(u.startedAt).getTime();
          const elapsed = now - startedTime;
          return elapsed < 5000; // 5 seconds
        })
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [conversationId]); // Re-create interval when conversation changes

  return typingUsers;
}

// ============================================================================
// Hook: useSendTyping
// ============================================================================

/**
 * Send typing events with debouncing
 *
 * Provides functions to send TYPING_START and TYPING_STOP events to the server.
 * Automatically debounces typing events to reduce network traffic and auto-stops
 * after 5 seconds of inactivity.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @returns Object with onKeyPress and sendTypingStop functions
 *
 * @example
 * ```tsx
 * function ChatInput({ conversationId }: { conversationId: string | null }) {
 *   const { onKeyPress, sendTypingStop } = useSendTyping(conversationId);
 *
 *   return (
 *     <textarea
 *       onKeyDown={onKeyPress}
 *       onBlur={sendTypingStop}
 *       placeholder="Type a message..."
 *     />
 *   );
 * }
 * ```
 */
// Minimum interval between API calls (throttle)
const MIN_TYPING_INTERVAL_MS = 500;

export function useSendTyping(conversationId: string | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const lastSentRef = useRef<number>(0);

  /**
   * Send TYPING_START event to the server
   * Only sends if not already typing to reduce network calls
   * Throttled to prevent abuse (max 1 request per 500ms)
   */
  const sendTypingStart = useCallback(async () => {
    if (!conversationId || isTypingRef.current) return;

    // Throttle: prevent sending more than once per MIN_TYPING_INTERVAL_MS
    const now = Date.now();
    if (now - lastSentRef.current < MIN_TYPING_INTERVAL_MS) {
      return;
    }
    lastSentRef.current = now;

    isTypingRef.current = true;

    try {
      await fetch(`/api/messages/conversations/${conversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping: true }),
      });

      // Auto-stop after 5 seconds if no key press
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        sendTypingStop();
      }, 5000);
    } catch (error) {
      console.error('[Typing] Failed to send typing start:', error);
      isTypingRef.current = false;
    }
  }, [conversationId]);

  /**
   * Send TYPING_STOP event to the server
   * Only sends if currently typing to reduce network calls
   */
  const sendTypingStop = useCallback(async () => {
    if (!conversationId || !isTypingRef.current) return;

    isTypingRef.current = false;

    // Clear auto-stop timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      await fetch(`/api/messages/conversations/${conversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping: false }),
      });
    } catch (error) {
      console.error('[Typing] Failed to send typing stop:', error);
    }
  }, [conversationId]);

  /**
   * Debounced handler for keypress events
   * Triggers TYPING_START and resets the auto-stop timer
   */
  const onKeyPress = useCallback(() => {
    sendTypingStart();

    // Reset auto-stop timer on every keypress
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      sendTypingStop();
    }, 5000);
  }, [sendTypingStart, sendTypingStop]);

  // Cleanup on unmount - send TYPING_STOP if currently typing
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (isTypingRef.current) {
        // Use refs to access latest values in cleanup
        const stopTyping = async () => {
          if (!conversationId) return;
          try {
            await fetch(`/api/messages/conversations/${conversationId}/typing`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isTyping: false }),
            });
          } catch (error) {
            console.error('[Typing] Failed to send typing stop on unmount:', error);
          }
        };
        stopTyping();
      }
    };
  }, [conversationId]);

  return { onKeyPress, sendTypingStop };
}

// ============================================================================
// Hook: useTypingIndicator (Combined)
// ============================================================================

/**
 * Combined hook for both listening and sending typing indicators
 *
 * Combines useTypingUsers and useSendTyping into a single convenient hook.
 * Automatically filters out the current user from the typing list.
 *
 * @param conversationId - UUID of the conversation or null to skip
 * @param currentUserId - UUID of the current user (to filter from typing list)
 * @returns Object with typingUsers, onKeyPress, and sendTypingStop
 *
 * @example
 * ```tsx
 * function ConversationView({ conversationId, currentUserId }: Props) {
 *   const { typingUsers, onKeyPress, sendTypingStop } = useTypingIndicator(
 *     conversationId,
 *     currentUserId
 *   );
 *
 *   return (
 *     <div>
 *       {typingUsers.length > 0 && (
 *         <div className="text-sm text-muted-foreground italic">
 *           {typingUsers.map(u => u.userName).join(', ')} typing...
 *         </div>
 *       )}
 *       <input
 *         onKeyDown={onKeyPress}
 *         onBlur={sendTypingStop}
 *         placeholder="Type a message..."
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypingIndicator(
  conversationId: string | null,
  currentUserId: string
) {
  const typingUsers = useTypingUsers(conversationId);
  const { onKeyPress, sendTypingStop } = useSendTyping(conversationId);

  // Filter out current user from typing list
  const otherTyping = typingUsers.filter((u) => u.userId !== currentUserId);

  return {
    typingUsers: otherTyping,
    onKeyPress,
    sendTypingStop,
  };
}
