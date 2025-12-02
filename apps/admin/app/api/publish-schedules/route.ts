/**
 * Publish Schedules API Route
 *
 * GET /api/publish-schedules - List all publish schedules with filters
 * POST /api/publish-schedules - Create a new publish schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getAllPublishSchedules,
  createPublishSchedule,
  type PublishScheduleFilters,
  type PublishPlatform,
  type PublishScheduleStatus,
} from '@/lib/db/publish-schedules';
import { z } from 'zod';

/**
 * GET /api/publish-schedules
 * List publish schedules with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Build filters from query params
    const filters: PublishScheduleFilters = {};

    // Single value filters
    if (searchParams.get('contentItemId')) {
      filters.contentItemId = searchParams.get('contentItemId')!;
    }
    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId')!;
    }
    if (searchParams.get('language')) {
      filters.language = searchParams.get('language')!;
    }

    // Platform filter (can be single or array)
    const platformParam = searchParams.get('platform');
    if (platformParam) {
      const platforms = platformParam.split(',').filter(Boolean) as PublishPlatform[];
      filters.platform = platforms.length === 1 ? platforms[0] : platforms;
    }

    // Status filter (can be single or array)
    const statusParam = searchParams.get('status');
    if (statusParam) {
      const statuses = statusParam.split(',').filter(Boolean) as PublishScheduleStatus[];
      filters.status = statuses.length === 1 ? statuses[0] : statuses;
    }

    // Date range filters
    if (searchParams.get('dateFrom')) {
      filters.scheduledAfter = searchParams.get('dateFrom')!;
    }
    if (searchParams.get('dateTo')) {
      filters.scheduledBefore = searchParams.get('dateTo')!;
    }

    // Pagination
    if (searchParams.get('limit')) {
      const limit = parseInt(searchParams.get('limit')!, 10);
      if (!isNaN(limit)) filters.limit = limit;
    }
    if (searchParams.get('offset')) {
      const offset = parseInt(searchParams.get('offset')!, 10);
      if (!isNaN(offset)) filters.offset = offset;
    }

    // Sorting
    if (searchParams.get('orderBy')) {
      filters.orderBy = searchParams.get('orderBy')!;
    }
    if (searchParams.get('orderDirection')) {
      const dir = searchParams.get('orderDirection');
      if (dir === 'asc' || dir === 'desc') {
        filters.orderDirection = dir;
      }
    }

    const result = await getAllPublishSchedules(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch publish schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publish schedules' },
      { status: 500 }
    );
  }
}

// Validation schema for creating publish schedule
const createPublishScheduleSchema = z.object({
  content_item_id: z.string().uuid('Invalid content item ID'),
  platform: z.enum(['youtube', 'website', 'newsletter', 'social', 'podcast']),
  scheduled_at: z.string().datetime('Invalid scheduled date'),
  timezone: z.string().optional(),
  status: z.enum(['scheduled', 'publishing', 'published', 'failed', 'cancelled']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * POST /api/publish-schedules
 * Create a new publish schedule
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createPublishScheduleSchema.parse(body);

    const schedule = await createPublishSchedule({
      content_item_id: validated.content_item_id,
      platform: validated.platform,
      scheduled_at: validated.scheduled_at,
      timezone: validated.timezone,
      status: validated.status,
      metadata: validated.metadata,
      created_by: session.user.id,
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create publish schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create publish schedule' },
      { status: 500 }
    );
  }
}
