/**
 * Conversations API - List and create conversations
 * GET /api/messages/conversations - List conversations with filters and pagination
 * POST /api/messages/conversations - Create new conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getAllConversations,
  createConversation,
  getConversationsByParticipant,
} from '@/lib/db/conversations';
import type {
  ConversationType,
  ConversationStatus,
  Platform,
  Channel,
  AssignedTeam,
  Priority,
} from '@/lib/db/conversations';

/**
 * GET /api/messages/conversations
 * List all conversations with optional filtering and pagination
 *
 * Query parameters:
 * - type: Filter by conversation type (support, team_channel, direct_message, internal_ticket)
 * - status: Filter by conversation status
 * - platform: Filter by platform (ozean_licht, kids_ascension)
 * - channel: Filter by channel (web_widget, whatsapp, email, telegram)
 * - assignedTeam: Filter by team (support, dev, tech, admin, spiritual)
 * - assignedAgentId: Filter by assigned agent UUID
 * - participantId: Filter by participant user ID
 * - search: Search by title, contact name, email, or ticket number
 * - limit: Results per page (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - orderBy: Sort column (default: updated_at)
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
    const type = searchParams.get('type') as ConversationType | null;
    const status = searchParams.get('status') as ConversationStatus | null;
    const platform = searchParams.get('platform') as Platform | null;
    const channel = searchParams.get('channel') as Channel | null;
    const assignedTeam = searchParams.get('assignedTeam') as AssignedTeam | null;
    const assignedAgentId = searchParams.get('assignedAgentId');
    const participantId = searchParams.get('participantId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const orderBy = searchParams.get('orderBy') || 'updated_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';

    // Validate enum values
    const validTypes: ConversationType[] = ['support', 'team_channel', 'direct_message', 'internal_ticket'];
    const validStatuses: ConversationStatus[] = ['open', 'pending', 'resolved', 'closed', 'active', 'archived', 'in_progress'];
    const validPlatforms: Platform[] = ['ozean_licht', 'kids_ascension'];
    const validChannels: Channel[] = ['web_widget', 'whatsapp', 'email', 'telegram'];
    const validTeams: AssignedTeam[] = ['support', 'dev', 'tech', 'admin', 'spiritual'];

    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (platform && !validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    if (channel && !validChannels.includes(channel)) {
      return NextResponse.json(
        { error: `Invalid channel. Must be one of: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    if (assignedTeam && !validTeams.includes(assignedTeam)) {
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

    // Fetch conversations - use participantId filter if provided
    let result;
    if (participantId) {
      result = await getConversationsByParticipant(participantId, {
        type: type || undefined,
        status: status || undefined,
        limit,
        offset,
        orderBy,
        orderDirection,
      });
    } else {
      result = await getAllConversations({
        type: type || undefined,
        status: status || undefined,
        platform: platform || undefined,
        channel: channel || undefined,
        assignedTeam: assignedTeam || undefined,
        assignedAgentId: assignedAgentId || undefined,
        search: search || undefined,
        limit,
        offset,
        orderBy,
        orderDirection,
      });
    }

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

/**
 * POST /api/messages/conversations
 * Create a new conversation
 *
 * Body parameters:
 * - type: Conversation type (team_channel, direct_message, internal_ticket)
 * - platform: Platform (ozean_licht, kids_ascension) - optional, defaults to ozean_licht
 * - title: Conversation title (for team_channel, internal_ticket)
 * - slug: Channel slug (for team_channel) - optional, auto-generated from title
 * - description: Description (for team_channel, internal_ticket)
 * - isPrivate: Private flag (for team_channel) - optional, defaults to false
 * - assignedTeam: Assigned team (for internal_ticket)
 * - priority: Priority (for internal_ticket) - optional, defaults to normal
 * - requesterId: Requester user ID (for internal_ticket)
 * - linkedConversationId: Linked conversation ID (for internal_ticket) - optional
 * - metadata: Additional metadata - optional
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, platform, title, slug, description, isPrivate, assignedTeam, priority, requesterId, linkedConversationId, metadata } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes: ConversationType[] = ['support', 'team_channel', 'direct_message', 'internal_ticket'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate platform if provided
    if (platform) {
      const validPlatforms: Platform[] = ['ozean_licht', 'kids_ascension'];
      if (!validPlatforms.includes(platform)) {
        return NextResponse.json(
          { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate type-specific required fields
    if (type === 'team_channel' && !title) {
      return NextResponse.json(
        { error: 'Title is required for team channels' },
        { status: 400 }
      );
    }

    if (type === 'internal_ticket') {
      if (!title) {
        return NextResponse.json(
          { error: 'Title is required for internal tickets' },
          { status: 400 }
        );
      }
      if (!assignedTeam) {
        return NextResponse.json(
          { error: 'Assigned team is required for internal tickets' },
          { status: 400 }
        );
      }
      if (!requesterId) {
        return NextResponse.json(
          { error: 'Requester ID is required for internal tickets' },
          { status: 400 }
        );
      }
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities: Priority[] = ['low', 'normal', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validate assignedTeam if provided
    if (assignedTeam) {
      const validTeams: AssignedTeam[] = ['support', 'dev', 'tech', 'admin', 'spiritual'];
      if (!validTeams.includes(assignedTeam)) {
        return NextResponse.json(
          { error: `Invalid team. Must be one of: ${validTeams.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Create the conversation
    const conversation = await createConversation(
      {
        type,
        platform: platform || 'ozean_licht',
        title,
        slug,
        description,
        isPrivate,
        assignedTeam,
        priority,
        requesterId,
        linkedConversationId,
        metadata,
      },
      session.user.id
    );

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('[API] Failed to create conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
