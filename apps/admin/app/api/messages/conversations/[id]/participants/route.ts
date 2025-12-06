/**
 * Conversation Participants API
 * GET /api/messages/conversations/[id]/participants - List participants
 * POST /api/messages/conversations/[id]/participants - Add participant
 * DELETE /api/messages/conversations/[id]/participants - Remove participant (with userId in body)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getParticipants,
  addParticipant,
  removeParticipant,
  isUserParticipant,
} from '@/lib/db/conversations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/messages/conversations/[id]/participants
 * List all participants in the conversation
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before showing participant list
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const participants = await getParticipants(id);

    return NextResponse.json({ participants });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to fetch participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/conversations/[id]/participants
 * Add a participant to the conversation
 *
 * Body parameters:
 * - userId: User UUID to add (required)
 * - role: Participant role (owner, admin, member, observer) - optional, defaults to member
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

    // SECURITY: Verify user is a participant before allowing to add others
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { userId, role } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['owner', 'admin', 'member', 'observer'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Add the participant
    const participant = await addParticipant(id, userId, role || 'member');

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to add participant:', error);
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/conversations/[id]/participants
 * Remove a participant from the conversation
 *
 * Body parameters:
 * - userId: User UUID to remove (required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before allowing to remove others
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Remove the participant
    await removeParticipant(id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to remove participant:', error);
    return NextResponse.json(
      { error: 'Failed to remove participant' },
      { status: 500 }
    );
  }
}
