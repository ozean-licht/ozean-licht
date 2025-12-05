/**
 * Typing Indicators API
 * POST /api/messages/conversations/[id]/typing - Set typing indicator
 * DELETE /api/messages/conversations/[id]/typing - Clear typing indicator
 * GET /api/messages/conversations/[id]/typing - Get typing users
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  setTypingIndicator,
  clearTypingIndicator,
  getTypingUsers,
} from '@/lib/db/messages';
import { isUserParticipant } from '@/lib/db/conversations';
import { typingRateLimiter, checkRateLimit } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/messages/conversations/[id]/typing
 * Get list of users currently typing in the conversation
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

    // SECURITY: Verify user is a participant before showing typing indicators
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const typingUsers = await getTypingUsers(id);

    return NextResponse.json({ typingUsers });
  } catch (error) {
    console.error('[API] Failed to fetch typing users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch typing users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/conversations/[id]/typing
 * Set typing indicator for current user
 *
 * Body parameters:
 * - userName: User display name (optional, uses session user email if not provided)
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

    // SECURITY: Verify user is a participant before setting typing indicator
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // SECURITY: Apply rate limiting (60 typing updates per minute per user)
    const rateLimit = checkRateLimit(typingRateLimiter, session.user.id);
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userName } = body;

    // Use provided userName or fall back to session user email
    const displayName = userName || session.user.email || 'Anonymous';

    // Set typing indicator (auto-expires in 5 seconds)
    await setTypingIndicator(id, session.user.id, displayName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Failed to set typing indicator:', error);
    return NextResponse.json(
      { error: 'Failed to set typing indicator' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/conversations/[id]/typing
 * Clear typing indicator for current user
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // SECURITY: Verify user is a participant before clearing typing indicator
    const isParticipant = await isUserParticipant(id, session.user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden - you are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Clear typing indicator
    await clearTypingIndicator(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Failed to clear typing indicator:', error);
    return NextResponse.json(
      { error: 'Failed to clear typing indicator' },
      { status: 500 }
    );
  }
}
