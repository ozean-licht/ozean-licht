/**
 * Tasks API - List and Create
 * GET /api/tasks - List tasks with filters
 * POST /api/tasks - Create new task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllTasks, createTask, getTaskStats } from '@/lib/db/tasks';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  // Parse filters
  const status = searchParams.get('status') || undefined;
  const projectId = searchParams.get('projectId') || undefined;
  const assigneeId = searchParams.get('assigneeId') || undefined;
  const search = searchParams.get('search') || undefined;
  const tab = searchParams.get('tab') as 'active' | 'overdue' | 'planned' | 'done' | undefined;
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const orderBy = searchParams.get('orderBy') || 'created_at';
  const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';
  const includeStats = searchParams.get('includeStats') === 'true';
  // Phase 8: Subtask filters
  const parentTaskId = searchParams.get('parentTaskId') || undefined;
  const hasParentParam = searchParams.get('hasParent');
  const hasParent = hasParentParam !== null ? hasParentParam === 'true' : undefined;

  try {
    const result = await getAllTasks({
      status,
      projectId,
      assigneeId,
      search,
      tab,
      limit,
      offset,
      orderBy,
      orderDirection,
      parentTaskId,
      hasParent,
    });

    let stats = undefined;
    if (includeStats) {
      stats = await getTaskStats();
    }

    return NextResponse.json({
      tasks: result.tasks,
      total: result.total,
      limit,
      offset,
      stats,
    });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Task name is required' },
        { status: 400 }
      );
    }

    const task = await createTask({
      name: body.name,
      description: body.description,
      project_id: body.project_id,
      status: body.status || 'todo',
      start_date: body.start_date,
      target_date: body.target_date,
      task_order: body.task_order,
      parent_task_id: body.parent_task_id,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
