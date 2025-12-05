/**
 * Conversation Read Status API
 * POST /api/messages/conversations/[id]/read - Mark conversation as read for current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { markConversationRead, isUserParticipant } from '@/lib/db/conversations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/messages/conversations/[id]/read
 * Mark conversation as read for the current user
 *
 * Body parameters:
 * - messageId: Optional last read message ID
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before allowing read status update
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { messageId } = body;

    // Mark as read for current user
    await markConversationRead(id, session.user.id, messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Failed to mark conversation as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark conversation as read' },
      { status: 500 }
    );
  }
}
