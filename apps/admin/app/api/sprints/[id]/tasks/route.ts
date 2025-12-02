/**
 * Sprint Tasks API
 * GET /api/sprints/[id]/tasks - Get tasks for a sprint
 * POST /api/sprints/[id]/tasks - Move tasks to a sprint
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getSprintById, getSprintTasks, moveTasksToSprint } from '@/lib/db/sprints';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/sprints/[id]/tasks
 * Get all tasks in a sprint
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

    // Verify sprint exists
    const sprint = await getSprintById(id);
    if (!sprint) {
      return NextResponse.json(
        { error: 'Sprint not found' },
        { status: 404 }
      );
    }

    // Get tasks for the sprint
    const tasks = await getSprintTasks(id);

    return NextResponse.json({ tasks, sprint });
  } catch (error) {
    console.error('Failed to fetch sprint tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sprints/[id]/tasks
 * Move tasks to this sprint
 *
 * Body: { taskIds: string[] }
 * Use sprintId = null in body to remove tasks from sprint
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
    const { id: sprintId } = await params;
    const body = await request.json();

    // Validate taskIds
    if (!Array.isArray(body.taskIds) || body.taskIds.length === 0) {
      return NextResponse.json(
        { error: 'taskIds array is required' },
        { status: 400 }
      );
    }

    // Verify sprint exists (unless removing from sprint)
    if (sprintId !== 'remove') {
      const sprint = await getSprintById(sprintId);
      if (!sprint) {
        return NextResponse.json(
          { error: 'Sprint not found' },
          { status: 404 }
        );
      }
    }

    // Move tasks to sprint
    const targetSprintId = sprintId === 'remove' ? null : sprintId;
    const updatedCount = await moveTasksToSprint(body.taskIds, targetSprintId);

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `${updatedCount} task(s) ${targetSprintId ? 'moved to sprint' : 'removed from sprint'}`,
    });
  } catch (error) {
    console.error('Failed to move tasks to sprint:', error);
    return NextResponse.json(
      { error: 'Failed to move tasks to sprint' },
      { status: 500 }
    );
  }
}
