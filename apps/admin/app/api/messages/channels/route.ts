/**
 * Team Channels API
 * GET /api/messages/channels - List team channels only
 * POST /api/messages/channels - Create team channel
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTeamChannels,
  createTeamChannel,
} from '@/lib/db/conversations';
import type {
  ConversationStatus,
  Platform,
} from '@/lib/db/conversations';

/**
 * GET /api/messages/channels
 * List all team channels with optional filtering and pagination
 *
 * Query parameters:
 * - status: Filter by status (active, archived)
 * - platform: Filter by platform (ozean_licht, kids_ascension)
 * - search: Search by title or slug
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
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as ConversationStatus | null;
    const platform = searchParams.get('platform') as Platform | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const orderBy = searchParams.get('orderBy') || 'updated_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';

    // Validate enum values
    const validStatuses: ConversationStatus[] = ['active', 'archived'];
    const validPlatforms: Platform[] = ['ozean_licht', 'kids_ascension'];

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

    // Validate search query length
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

    // Fetch team channels
    const result = await getTeamChannels({
      status: status || undefined,
      platform: platform || undefined,
      search: search || undefined,
      limit,
      offset,
      orderBy,
      orderDirection,
    });

    return NextResponse.json({
      channels: result.conversations,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Failed to fetch team channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team channels' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/channels
 * Create a new team channel
 *
 * Body parameters:
 * - title: Channel title (required)
 * - slug: Channel slug - optional, auto-generated from title if not provided
 * - description: Channel description - optional
 * - isPrivate: Private flag - optional, defaults to false
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, isPrivate } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Validate slug if provided
    if (slug) {
      // Slug should be lowercase alphanumeric with hyphens
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }

      if (slug.length > 50) {
        return NextResponse.json(
          { error: 'Slug is too long (max 50 characters)' },
          { status: 400 }
        );
      }
    }

    // Validate description length if provided
    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description is too long (max 500 characters)' },
        { status: 400 }
      );
    }

    // Validate isPrivate is boolean if provided
    if (isPrivate !== undefined && typeof isPrivate !== 'boolean') {
      return NextResponse.json(
        { error: 'isPrivate must be a boolean' },
        { status: 400 }
      );
    }

    // Create the channel
    const channel = await createTeamChannel(
      {
        title,
        slug,
        description,
        isPrivate,
      },
      session.user.id
    );

    return NextResponse.json({ channel }, { status: 201 });
  } catch (error) {
    console.error('[API] Failed to create team channel:', error);

    // Check for unique constraint violation on slug
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A channel with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create team channel' },
      { status: 500 }
    );
  }
}
