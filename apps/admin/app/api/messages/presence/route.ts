/**
 * User Presence API
 * GET /api/messages/presence - Get online users
 * PATCH /api/messages/presence - Update current user's presence
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getOnlineUsers,
  updatePresence,
  PresenceStatus,
} from '@/lib/db/conversations';

/**
 * GET /api/messages/presence
 * Get list of online/away users with their presence info
 */
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const onlineUsers = await getOnlineUsers();

    return NextResponse.json({ users: onlineUsers });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to fetch online users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch online users' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/messages/presence
 * Update current user's presence status
 *
 * Body parameters:
 * - status: Presence status (online, away, busy, offline) - required
 * - conversationId: Current conversation ID - optional
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, conversationId } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: PresenceStatus[] = ['online', 'away', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update presence
    await updatePresence(session.user.id, status, conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to update presence:', error);
    return NextResponse.json(
      { error: 'Failed to update presence' },
      { status: 500 }
    );
  }
}
