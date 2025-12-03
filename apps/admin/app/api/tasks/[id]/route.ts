/**
 * Single Task API
 * GET /api/tasks/[id] - Get task by ID
 * PATCH /api/tasks/[id] - Update task
 * DELETE /api/tasks/[id] - Delete task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getTaskById, updateTask, deleteTask } from '@/lib/db/tasks';
import { recalculateProjectProgress, getProjectById } from '@/lib/db/projects';
import { createAssignmentNotification } from '@/lib/db/notifications';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const task = await getTaskById(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Failed to fetch task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // First get the task to check if it exists and to get project_id
    const existingTask = await getTaskById(id);
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate story_points if provided
    if (body.story_points !== undefined) {
      const points = Number(body.story_points);
      if (!Number.isFinite(points) || points < 0 || points > 100) {
        return NextResponse.json(
          { error: 'Story points must be between 0 and 100' },
          { status: 400 }
        );
      }
    }

    // Only allow specific fields
    const allowedFields = ['name', 'description', 'status', 'is_done', 'start_date', 'target_date', 'assignee_ids', 'story_points', 'sprint_id'];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const task = await updateTask(id, updates);

    // Recalculate project progress if task is linked to a project
    if (existingTask.project_id) {
      await recalculateProjectProgress(existingTask.project_id);
    }

    // Create assignment notifications for new assignees
    if (body.assignee_ids && session.user.id) {
      const oldAssignees = existingTask.assignee_ids || [];
      const newAssignees = body.assignee_ids as string[];

      // Find newly added assignees
      const addedAssignees = newAssignees.filter(
        (id: string) => !oldAssignees.includes(id)
      );

      // Get project name if available
      let projectName: string | undefined;
      if (existingTask.project_id) {
        const project = await getProjectById(existingTask.project_id);
        projectName = project?.title;
      }

      // Notify each new assignee
      for (const assigneeId of addedAssignees) {
        await createAssignmentNotification(
          assigneeId,
          session.user.id,
          id,
          existingTask.name || 'a task',
          projectName
        );
      }
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Get task first to recalculate project progress after deletion
    const task = await getTaskById(id);

    const deleted = await deleteTask(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Recalculate project progress if task was linked
    if (task?.project_id) {
      await recalculateProjectProgress(task.project_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
