/**
 * Single Sprint API
 * GET /api/sprints/[id] - Get sprint by ID
 * PATCH /api/sprints/[id] - Update sprint
 * DELETE /api/sprints/[id] - Delete sprint
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getSprintById,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
  getSprintTasks,
} from '@/lib/db/sprints';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/sprints/[id]
 * Fetch a single sprint by ID with optional tasks
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const includeTasks = request.nextUrl.searchParams.get('includeTasks') === 'true';

    // Fetch the sprint
    const sprint = await getSprintById(id);

    if (!sprint) {
      return NextResponse.json(
        { error: 'Sprint not found' },
        { status: 404 }
      );
    }

    // Optionally include tasks
    let tasks = undefined;
    if (includeTasks) {
      tasks = await getSprintTasks(id);
    }

    return NextResponse.json({ sprint, tasks });
  } catch (error) {
    console.error('Failed to fetch sprint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/sprints/[id]
 * Update a sprint by ID
 *
 * Special actions:
 * - { action: 'start' } - Start the sprint
 * - { action: 'complete' } - Complete the sprint
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

    // Handle special actions
    if (body.action === 'start') {
      try {
        const sprint = await startSprint(id);
        if (!sprint) {
          return NextResponse.json(
            { error: 'Sprint not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ sprint });
      } catch (error) {
        if (error instanceof Error && error.message.includes('already has an active sprint')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    if (body.action === 'complete') {
      const sprint = await completeSprint(id);
      if (!sprint) {
        return NextResponse.json(
          { error: 'Sprint not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ sprint });
    }

    // Regular update - only allow specific fields
    const allowedFields = ['name', 'goal', 'status', 'start_date', 'end_date', 'velocity'];
    const updates: Record<string, unknown> = {};

    // Handle both camelCase and snake_case
    const fieldMappings: Record<string, string> = {
      name: 'name',
      goal: 'goal',
      status: 'status',
      start_date: 'start_date',
      startDate: 'start_date',
      end_date: 'end_date',
      endDate: 'end_date',
      velocity: 'velocity',
    };

    for (const [key, dbField] of Object.entries(fieldMappings)) {
      if (body[key] !== undefined && allowedFields.includes(dbField)) {
        updates[dbField] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the sprint
    const sprint = await updateSprint(id, updates);

    if (!sprint) {
      return NextResponse.json(
        { error: 'Sprint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ sprint });
  } catch (error) {
    console.error('Failed to update sprint:', error);
    return NextResponse.json(
      { error: 'Failed to update sprint' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sprints/[id]
 * Delete a sprint by ID
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

    // Delete the sprint
    const deleted = await deleteSprint(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Sprint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sprint:', error);
    return NextResponse.json(
      { error: 'Failed to delete sprint' },
      { status: 500 }
    );
  }
}
