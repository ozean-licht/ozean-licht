/**
 * Conversations API - List conversations
 * GET /api/support/conversations - List conversations with filters and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllConversations } from '@/lib/db/support-conversations';
import type { ConversationStatus, Channel, Team } from '@/types/support';

/**
 * GET /api/support/conversations
 * List all conversations with optional filtering and pagination
 *
 * Query parameters:
 * - status: Filter by conversation status (open, resolved, pending, snoozed)
 * - channel: Filter by channel (web_widget, whatsapp, email, telegram)
 * - team: Filter by team (tech, sales, spiritual, general)
 * - assignedAgentId: Filter by assigned agent UUID
 * - search: Search by contact name or email
 * - limit: Results per page (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - orderBy: Sort column (default: created_at)
 * - orderDirection: Sort direction (asc, desc, default: desc)
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as ConversationStatus | null;
    const channel = searchParams.get('channel') as Channel | null;
    const team = searchParams.get('team') as Team | null;
    const assignedAgentId = searchParams.get('assignedAgentId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';

    // Validate enum values
    const validStatuses: ConversationStatus[] = ['open', 'resolved', 'pending', 'snoozed'];
    const validChannels: Channel[] = ['web_widget', 'whatsapp', 'email', 'telegram'];
    const validTeams: Team[] = ['tech', 'sales', 'spiritual', 'general'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (channel && !validChannels.includes(channel)) {
      return NextResponse.json(
        { error: `Invalid channel. Must be one of: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    if (team && !validTeams.includes(team)) {
      return NextResponse.json(
        { error: `Invalid team. Must be one of: ${validTeams.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate search query length to prevent abuse
    if (search && search.length > 200) {
      return NextResponse.json(
        { error: 'Search query is too long (max 200 characters)' },
        { status: 400 }
      );
    }

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

    // Add maximum offset limit to prevent pagination abuse
    const MAX_OFFSET = 10000;
    if (offset > MAX_OFFSET) {
      return NextResponse.json(
        { error: `Offset too large (max ${MAX_OFFSET}). Please use search filters to narrow results.` },
        { status: 400 }
      );
    }

    // Fetch conversations with filters
    const result = await getAllConversations({
      status: status || undefined,
      channel: channel || undefined,
      team: team || undefined,
      assignedAgentId: assignedAgentId || undefined,
      search: search || undefined,
      limit,
      offset,
      orderBy,
      orderDirection,
    });

    return NextResponse.json({
      conversations: result.conversations,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
