/**
 * Pusher/Soketi Channel Authentication Endpoint
 *
 * This API route authenticates users for private and presence channels in Pusher/Soketi.
 * It verifies the user's session and checks their permissions before authorizing channel access.
 *
 * Channel Types:
 * - private-user-{userId}: Personal user channels for notifications
 * - private-conversation-{conversationId}: Conversation channels for messaging
 * - presence-team-{channelSlug}: Team presence channels for online status
 * - presence-conversation-{conversationId}: Conversation presence for typing indicators
 *
 * Security:
 * - Requires valid NextAuth session
 * - Validates conversation participant membership
 * - Enforces user-specific channel access
 *
 * Reference: specs/support-management-system.md (Phase 7)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { authenticateChannel } from '@/lib/realtime/pusher-server';
import { isParticipant } from '@/lib/db/participants';

/**
 * POST /api/realtime/auth
 *
 * Authenticate a user for a Pusher channel subscription.
 * Called automatically by Pusher client when subscribing to private/presence channels.
 *
 * Request Body (form-data):
 * - socket_id: String - Socket ID from Pusher client
 * - channel_name: String - Channel name to authenticate
 *
 * Response:
 * - 200: { auth: string, channel_data?: string } - Authentication signature
 * - 401: Unauthorized - User not authenticated
 * - 403: Forbidden - User not authorized for this channel
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name || userEmail;

    // 2. Parse request body (Pusher sends form data)
    const body = await request.formData();
    const socketId = body.get('socket_id') as string;
    const channel = body.get('channel_name') as string;

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // 3. Validate channel access based on channel type
    const isAuthorized = await validateChannelAccess(channel, userId);
    if (!isAuthorized) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 4. Generate authentication signature
    let authResponse;

    if (channel.startsWith('presence-')) {
      // Presence channel: Include user data
      const presenceData = {
        user_id: userId,
        user_info: {
          name: userName,
          email: userEmail,
        },
      };
      authResponse = authenticateChannel(socketId, channel, presenceData);
    } else {
      // Private channel: Simple authentication
      authResponse = authenticateChannel(socketId, channel);
    }

    // 5. Return authentication signature
    return NextResponse.json(authResponse);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Pusher Auth] Error authenticating channel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate if a user has access to a specific channel
 *
 * Channel access rules:
 * - private-user-{userId}: User can only access their own channel
 * - private-conversation-{conversationId}: User must be a participant
 * - presence-team-{channelSlug}: All authenticated users (team members)
 * - presence-conversation-{conversationId}: User must be a participant
 *
 * @param channel - Channel name to validate
 * @param userId - User ID requesting access
 * @returns True if user has access, false otherwise
 */
async function validateChannelAccess(
  channel: string,
  userId: string
): Promise<boolean> {
  try {
    // Private user channels: user-{userId}
    if (channel.startsWith('private-user-')) {
      const channelUserId = channel.replace('private-user-', '');
      return channelUserId === userId;
    }

    // Private conversation channels: conversation-{conversationId}
    if (channel.startsWith('private-conversation-')) {
      const conversationId = channel.replace('private-conversation-', '');
      // Validate UUID format to prevent injection
      if (!isValidUUID(conversationId)) {
        // eslint-disable-next-line no-console
        console.warn('[Pusher Auth] Invalid conversation ID format:', conversationId);
        return false;
      }
      return await isParticipant(conversationId, userId);
    }

    // Presence team channels: team-{channelSlug}
    // All authenticated users (team members) can access team channels
    if (channel.startsWith('presence-team-')) {
      return true;
    }

    // Presence conversation channels: conversation-{conversationId}
    if (channel.startsWith('presence-conversation-')) {
      const conversationId = channel.replace('presence-conversation-', '');
      // Validate UUID format to prevent injection
      if (!isValidUUID(conversationId)) {
        // eslint-disable-next-line no-console
        console.warn('[Pusher Auth] Invalid conversation ID format:', conversationId);
        return false;
      }
      return await isParticipant(conversationId, userId);
    }

    // Unknown channel type - deny access
    // eslint-disable-next-line no-console
    console.warn('[Pusher Auth] Unknown channel type:', channel);
    return false;
  } catch (error) {
    // Fail-closed: deny access on any error (database failure, etc.)
    // eslint-disable-next-line no-console
    console.error('[Pusher Auth] Error validating channel access:', {
      channel,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Validate UUID format
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
