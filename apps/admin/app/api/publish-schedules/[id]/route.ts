/**
 * Single Publish Schedule API
 * GET /api/publish-schedules/[id] - Get schedule by ID
 * PATCH /api/publish-schedules/[id] - Update schedule
 * DELETE /api/publish-schedules/[id] - Delete schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getPublishScheduleById,
  updatePublishSchedule,
  deletePublishSchedule,
} from '@/lib/db/publish-schedules';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/publish-schedules/[id]
 * Fetch a single publish schedule by ID
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
    const schedule = await getPublishScheduleById(id);

    if (!schedule) {
      return NextResponse.json(
        { error: 'Publish schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch publish schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publish schedule' },
      { status: 500 }
    );
  }
}

// Validation schema for updating publish schedule
const updatePublishScheduleSchema = z.object({
  scheduled_at: z.string().datetime('Invalid scheduled date').optional(),
  timezone: z.string().optional(),
  status: z.enum(['scheduled', 'publishing', 'published', 'failed', 'cancelled']).optional(),
  published_at: z.string().datetime('Invalid published date').optional(),
  published_url: z.string().url('Invalid URL').optional(),
  error_message: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * PATCH /api/publish-schedules/[id]
 * Update a publish schedule by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the request body
    const validated = updatePublishScheduleSchema.parse(body);

    if (Object.keys(validated).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the schedule
    const schedule = await updatePublishSchedule(id, validated);

    if (!schedule) {
      return NextResponse.json(
        { error: 'Publish schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to update publish schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update publish schedule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/publish-schedules/[id]
 * Delete a publish schedule by ID
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
    const deleted = await deletePublishSchedule(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Publish schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete publish schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete publish schedule' },
      { status: 500 }
    );
  }
}
