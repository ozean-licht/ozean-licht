/**
 * Subtasks API - Phase 8
 * GET /api/tasks/[id]/subtasks - Get subtasks of a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getSubtasks, getTaskById } from '@/lib/db/tasks';

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
    // First verify the parent task exists
    const parentTask = await getTaskById(id);
    if (!parentTask) {
      return NextResponse.json(
        { error: 'Parent task not found' },
        { status: 404 }
      );
    }

    const subtasks = await getSubtasks(id);

    // Calculate completion stats
    const total = subtasks.length;
    const completed = subtasks.filter(t => t.is_done).length;

    return NextResponse.json({
      subtasks,
      total,
      completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (error) {
    console.error('Failed to fetch subtasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    );
  }
}
