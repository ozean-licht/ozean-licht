/**
 * Task Time Entries API
 * GET /api/tasks/[id]/time-entries - List time entries for task
 * POST /api/tasks/[id]/time-entries - Create time entry on task
 *
 * Phase 9 of Project Management MVP
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTimeEntriesByTaskId,
  createTimeEntry,
  getTaskTimeStats,
} from '@/lib/db/time-entries';
import { getTaskById } from '@/lib/db/tasks';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/[id]/time-entries
 * Fetch all time entries for a task
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
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [entries, stats] = await Promise.all([
      getTimeEntriesByTaskId(id, limit),
      getTaskTimeStats(id),
    ]);

    return NextResponse.json({
      entries,
      stats,
    });
  } catch (error) {
    console.error('Failed to fetch time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks/[id]/time-entries
 * Create a new time entry on a task
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
    const body = await request.json();

    // Validate required field
    if (!body.duration_minutes || typeof body.duration_minutes !== 'number' || body.duration_minutes <= 0) {
      return NextResponse.json(
        { error: 'duration_minutes is required and must be a positive number' },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // MVP: Any authenticated user can log time on any task
    // TODO: Implement proper task access control based on project membership/assignees

    const entry = await createTimeEntry({
      task_id: id,
      user_id: session.user.id || undefined,
      user_name: session.user.name || undefined,
      user_email: session.user.email || undefined,
      description: body.description,
      duration_minutes: body.duration_minutes,
      started_at: body.started_at,
      ended_at: body.ended_at,
      work_date: body.work_date,
      is_billable: body.is_billable ?? false,
    });

    // Get updated stats
    const stats = await getTaskTimeStats(id);

    return NextResponse.json({ entry, stats }, { status: 201 });
  } catch (error) {
    console.error('Failed to create time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}
