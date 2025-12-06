/**
 * Direct Messages API
 * GET /api/messages/dm - List current user's DMs
 * POST /api/messages/dm - Find or create DM between users
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getDirectMessages,
  findOrCreateDM,
} from '@/lib/db/conversations';

/**
 * GET /api/messages/dm
 * List all direct message conversations for the current user
 *
 * Query parameters:
 * - limit: Results per page (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - orderBy: Sort column (default: updated_at)
 * - orderDirection: Sort direction (asc, desc, default: desc)
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters (not used by getDirectMessages but included for consistency)
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be zero or a positive number' },
        { status: 400 }
      );
    }

    // Fetch DMs for current user
    const result = await getDirectMessages(session.user.id);

    return NextResponse.json({
      conversations: result.conversations,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to fetch direct messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch direct messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/dm
 * Find or create a direct message conversation between users
 *
 * Body parameters:
 * - userIds: Array of user UUIDs (must include 2+ users)
 *
 * Returns existing DM if one exists with exact same participants,
 * otherwise creates a new DM conversation.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userIds } = body;

    // Validate required fields
    if (!userIds) {
      return NextResponse.json(
        { error: 'userIds is required' },
        { status: 400 }
      );
    }

    // Validate userIds is an array
    if (!Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'userIds must be an array' },
        { status: 400 }
      );
    }

    // Validate minimum participants
    if (userIds.length < 2) {
      return NextResponse.json(
        { error: 'DM requires at least 2 participants' },
        { status: 400 }
      );
    }

    // Validate maximum participants (enforce 1:1 DM or small group)
    if (userIds.length > 10) {
      return NextResponse.json(
        { error: 'DM supports maximum 10 participants' },
        { status: 400 }
      );
    }

    // Validate all userIds are strings
    if (!userIds.every((id: unknown) => typeof id === 'string' && id.length > 0)) {
      return NextResponse.json(
        { error: 'All user IDs must be non-empty strings' },
        { status: 400 }
      );
    }

    // Find or create the DM
    const conversation = await findOrCreateDM(userIds, session.user.id);

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Failed to create DM:', error);

    // Handle specific error for insufficient participants
    if (error instanceof Error && error.message.includes('at least 2 participants')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create direct message' },
      { status: 500 }
    );
  }
}
