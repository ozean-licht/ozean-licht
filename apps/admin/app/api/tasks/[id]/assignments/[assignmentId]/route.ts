/**
 * Task Assignment Detail API Route
 *
 * GET /api/tasks/[id]/assignments/[assignmentId] - Get a specific assignment
 * PATCH /api/tasks/[id]/assignments/[assignmentId] - Update an assignment
 * DELETE /api/tasks/[id]/assignments/[assignmentId] - Delete an assignment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTaskAssignmentById,
  updateTaskAssignment,
  deleteTaskAssignment,
  completeTaskAssignment,
} from '@/lib/db/task-assignments';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string; assignmentId: string }>;
}

// GET /api/tasks/[id]/assignments/[assignmentId]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, assignmentId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const assignmentValidation = validateUUID(assignmentId, 'Assignment ID');
    if (!assignmentValidation.valid) {
      return NextResponse.json({ error: assignmentValidation.error!.message }, { status: assignmentValidation.error!.status });
    }

    const assignment = await getTaskAssignmentById(assignmentId);

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error('Failed to fetch task assignment:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for updating assignment
const updateAssignmentSchema = z.object({
  is_primary: z.boolean().optional(),
  notes: z.string().max(5000, 'Notes must be 5000 characters or less').optional().nullable(),
  mark_complete: z.boolean().optional(),
});

// PATCH /api/tasks/[id]/assignments/[assignmentId]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, assignmentId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const assignmentValidation = validateUUID(assignmentId, 'Assignment ID');
    if (!assignmentValidation.valid) {
      return NextResponse.json({ error: assignmentValidation.error!.message }, { status: assignmentValidation.error!.status });
    }

    const body = await request.json();
    const validated = updateAssignmentSchema.parse(body);

    let assignment;

    // Handle mark_complete separately
    if (validated.mark_complete) {
      assignment = await completeTaskAssignment(assignmentId);
    } else {
      assignment = await updateTaskAssignment(assignmentId, {
        is_primary: validated.is_primary,
        notes: validated.notes ?? undefined,
      });
    }

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update task assignment:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/tasks/[id]/assignments/[assignmentId]
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, assignmentId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const assignmentValidation = validateUUID(assignmentId, 'Assignment ID');
    if (!assignmentValidation.valid) {
      return NextResponse.json({ error: assignmentValidation.error!.message }, { status: assignmentValidation.error!.status });
    }

    const deleted = await deleteTaskAssignment(assignmentId);

    if (!deleted) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task assignment:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
