/**
 * Task Assignments API Route
 *
 * GET /api/tasks/[id]/assignments - Get all assignments for a task
 * POST /api/tasks/[id]/assignments - Create a new task assignment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTaskAssignmentsByTaskId,
  createTaskAssignment,
  assignUsersToTask,
} from '@/lib/db/task-assignments';
import { getTaskById } from '@/lib/db/tasks';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/tasks/[id]/assignments
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Task ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const assignments = await getTaskAssignmentsByTaskId(id);

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Failed to fetch task assignments:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for creating single assignment
const createAssignmentSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role_id: z.string().uuid('Invalid role ID'),
  is_primary: z.boolean().optional(),
  notes: z.string().max(5000, 'Notes must be 5000 characters or less').optional(),
});

// Validation schema for bulk assignment
const bulkAssignmentSchema = z.object({
  assignments: z.array(z.object({
    user_id: z.string().uuid('Invalid user ID'),
    role_id: z.string().uuid('Invalid role ID'),
    is_primary: z.boolean().optional(),
  })).min(1, 'At least one assignment is required'),
});

// POST /api/tasks/[id]/assignments
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Task ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const body = await request.json();

    // Check if this is a bulk assignment
    if (body.assignments && Array.isArray(body.assignments)) {
      const validated = bulkAssignmentSchema.parse(body);

      const assignments = await assignUsersToTask(
        id,
        validated.assignments,
        session.user.id
      );

      return NextResponse.json({ assignments }, { status: 201 });
    }

    // Single assignment
    const validated = createAssignmentSchema.parse(body);

    const assignment = await createTaskAssignment({
      task_id: id,
      user_id: validated.user_id,
      role_id: validated.role_id,
      is_primary: validated.is_primary,
      assigned_by: session.user.id,
      notes: validated.notes,
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create task assignment:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
