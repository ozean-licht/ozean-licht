/**
 * Real-time Presence Tracking Hooks
 *
 * Provides React hooks for tracking user presence in the Support Management System:
 * 1. useInboxPresence - Track who's online in the admin panel
 * 2. useConversationPresence - Track who's viewing a specific conversation
 * 3. useUpdatePresence - Update own presence status
 *
 * Uses Pusher/Soketi presence channels for real-time member tracking.
 *
 * @example
 * ```tsx
 * // Track online users in inbox
 * const { members, myId, isOnline } = useInboxPresence();
 *
 * // Track viewers in a conversation
 * const { viewers } = useConversationPresence(conversationId);
 *
 * // Update own status
 * const { updatePresence } = useUpdatePresence();
 * await updatePresence('away', 'In a meeting');
 * ```
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { PresenceChannel, Members } from 'pusher-js';
import { getPusherClient } from '@/lib/realtime/pusher-client';
import { CHANNELS } from '@/lib/realtime/channels';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Member information in a presence channel
 *
 * Represents a user who is currently online/viewing a conversation or inbox.
 * This data is shared with all members of the presence channel via Pusher/Soketi.
 *
 * @property {string} id - User's unique identifier (admin_users.id)
 * @property {string} name - User's display name (publicly visible to all channel members)
 * @property {string} [email] - User's email address (optional, may be omitted for privacy)
 * @property {string} [role] - User's role (super_admin, ol_admin, support, etc.)
 * @property {string} [avatar] - Optional avatar URL
 *
 * @example
 * ```tsx
 * const member: PresenceMember = {
 *   id: 'uuid-123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'support',
 * };
 * ```
 */
export interface PresenceMember {
  /**
   * User's unique identifier (admin_users.id)
   */
  id: string;

  /**
   * User's display name (publicly visible to all channel members)
   */
  name: string;

  /**
   * User's email address (optional, may be omitted for privacy)
   */
  email?: string;

  /**
   * User's role (super_admin, ol_admin, support, etc.)
   */
  role?: string;

  /**
   * Optional avatar URL
   */
  avatar?: string;
}

/**
 * Presence status enum
 * Maps to database PresenceStatus type
 */
export type PresenceStatus = 'online' | 'away' | 'offline' | 'dnd';

// ============================================================================
// Hook: useInboxPresence
// ============================================================================

/**
 * Subscribe to inbox presence channel
 * Track who's online in the admin panel
 *
 * Automatically subscribes to the presence-inbox channel and tracks
 * all admin users who are currently viewing the inbox.
 *
 * @returns {Object} Presence data
 * @returns {PresenceMember[]} members - List of online members
 * @returns {string | null} myId - Current user's ID
 * @returns {Function} isOnline - Check if a specific user is online
 *
 * @example
 * ```tsx
 * function InboxSidebar() {
 *   const { members, myId, isOnline } = useInboxPresence();
 *
 *   return (
 *     <div>
 *       <h3>Online Now ({members.length})</h3>
 *       {members.map(member => (
 *         <div key={member.id}>
 *           {member.name} {member.id === myId && '(You)'}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInboxPresence() {
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    let channel: PresenceChannel | null = null;

    try {
      const pusher = getPusherClient();
      channel = pusher.subscribe(CHANNELS.inbox) as PresenceChannel;

      // Handle successful subscription - get initial member list
      channel.bind('pusher:subscription_succeeded', (membersData: Members) => {
        const memberList: PresenceMember[] = [];

        // Iterate through all current members
        membersData.each((member: { id: string; info: PresenceMember }) => {
          memberList.push({
            ...member.info,
            id: member.id, // Ensure ID from member takes precedence
          });
        });

        setMembers(memberList);
        setMyId(membersData.myID);

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Inbox subscription succeeded:', memberList.length, 'members');
        }
      });

      // Handle new member joining
      channel.bind('pusher:member_added', (member: { id: string; info: PresenceMember }) => {
        setMembers((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === member.id)) {
            return prev;
          }
          return [...prev, { ...member.info, id: member.id }];
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Member joined inbox:', member.info.name);
        }
      });

      // Handle member leaving
      channel.bind('pusher:member_removed', (member: { id: string }) => {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Member left inbox:', member.id);
        }
      });

      // Handle subscription errors
      channel.bind('pusher:subscription_error', (error: Error) => {
        console.error('[Presence] Inbox subscription error:', error);
      });
    } catch (error) {
      console.error('[Presence] Failed to initialize inbox presence:', error);
    }

    // Cleanup on unmount
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, []);

  /**
   * Check if a specific user is currently online
   * @param userId - User ID to check
   * @returns True if user is in the members list
   */
  const isOnline = useCallback(
    (userId: string): boolean => {
      return members.some((m) => m.id === userId);
    },
    [members]
  );

  return { members, myId, isOnline };
}

// ============================================================================
// Hook: useConversationPresence
// ============================================================================

/**
 * Subscribe to conversation presence channel
 * Track who's viewing a specific conversation
 *
 * Automatically subscribes to presence-conversation-{id} channel for the
 * given conversation. Handles null conversationId gracefully.
 *
 * @param conversationId - UUID of the conversation (null to disable)
 * @returns {Object} Presence data
 * @returns {PresenceMember[]} viewers - List of users viewing this conversation
 *
 * @example
 * ```tsx
 * function ConversationHeader({ conversationId }: { conversationId: string | null }) {
 *   const { viewers } = useConversationPresence(conversationId);
 *
 *   return (
 *     <div>
 *       {viewers.length > 1 && (
 *         <div className="text-sm text-muted-foreground">
 *           {viewers.map(v => v.name).join(', ')} are viewing
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConversationPresence(conversationId: string | null) {
  const [viewers, setViewers] = useState<PresenceMember[]>([]);

  useEffect(() => {
    // Don't subscribe if no conversation selected
    if (!conversationId) {
      setViewers([]);
      return;
    }

    let channel: PresenceChannel | null = null;

    try {
      const pusher = getPusherClient();
      const channelName = CHANNELS.conversationPresence(conversationId);
      channel = pusher.subscribe(channelName) as PresenceChannel;

      // Handle successful subscription - get initial viewer list
      channel.bind('pusher:subscription_succeeded', (membersData: Members) => {
        const viewerList: PresenceMember[] = [];

        // Iterate through all current viewers
        membersData.each((member: { id: string; info: PresenceMember }) => {
          viewerList.push({
            ...member.info,
            id: member.id, // Ensure ID from member takes precedence
          });
        });

        setViewers(viewerList);

        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[Presence] Conversation ${conversationId} subscription succeeded:`,
            viewerList.length,
            'viewers'
          );
        }
      });

      // Handle new viewer joining
      channel.bind('pusher:member_added', (member: { id: string; info: PresenceMember }) => {
        setViewers((prev) => {
          // Prevent duplicates
          if (prev.some((v) => v.id === member.id)) {
            return prev;
          }
          return [...prev, { ...member.info, id: member.id }];
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Viewer joined conversation:', member.info.name);
        }
      });

      // Handle viewer leaving
      channel.bind('pusher:member_removed', (member: { id: string }) => {
        setViewers((prev) => prev.filter((v) => v.id !== member.id));

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Viewer left conversation:', member.id);
        }
      });

      // Handle subscription errors
      channel.bind('pusher:subscription_error', (error: Error) => {
        console.error('[Presence] Conversation subscription error:', error);
      });
    } catch (error) {
      console.error('[Presence] Failed to initialize conversation presence:', error);
    }

    // Cleanup on unmount or conversation change
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [conversationId]);

  return { viewers };
}

// ============================================================================
// Hook: useUpdatePresence
// ============================================================================

/**
 * Update own presence status
 *
 * Provides a function to update the current user's presence status.
 * This updates the database and notifies other users via presence channels.
 *
 * @returns {Object} Update functions
 * @returns {Function} updatePresence - Update presence status
 *
 * @example
 * ```tsx
 * function StatusSelector() {
 *   const { updatePresence } = useUpdatePresence();
 *
 *   const handleStatusChange = async (status: PresenceStatus) => {
 *     await updatePresence(status, 'Custom status message');
 *   };
 *
 *   return (
 *     <select onChange={(e) => handleStatusChange(e.target.value as PresenceStatus)}>
 *       <option value="online">Online</option>
 *       <option value="away">Away</option>
 *       <option value="dnd">Do Not Disturb</option>
 *       <option value="offline">Offline</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useUpdatePresence() {
  /**
   * Update the current user's presence status
   *
   * @param status - New presence status (online, away, offline, dnd)
   * @param statusText - Optional custom status message
   * @throws {Error} If update fails (network error, unauthorized, etc.)
   */
  const updatePresence = useCallback(
    async (status: PresenceStatus, statusText?: string): Promise<void> => {
      try {
        const response = await fetch('/api/messages/presence', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            statusText,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update presence');
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Status updated:', status, statusText);
        }
      } catch (error) {
        console.error('[Presence] Failed to update status:', error);
        throw error;
      }
    },
    []
  );

  return { updatePresence };
}
