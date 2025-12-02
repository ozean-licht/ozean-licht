/**
 * Task Checklist Detail API Route
 *
 * GET /api/tasks/[id]/checklists/[checklistId] - Get a specific checklist
 * PATCH /api/tasks/[id]/checklists/[checklistId] - Update a checklist
 * DELETE /api/tasks/[id]/checklists/[checklistId] - Delete a checklist
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTaskChecklistById,
  updateTaskChecklist,
  deleteTaskChecklist,
  toggleChecklistItem,
  setChecklistItemChecked,
} from '@/lib/db/checklists';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string; checklistId: string }>;
}

// GET /api/tasks/[id]/checklists/[checklistId]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, checklistId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const checklistValidation = validateUUID(checklistId, 'Checklist ID');
    if (!checklistValidation.valid) {
      return NextResponse.json({ error: checklistValidation.error!.message }, { status: checklistValidation.error!.status });
    }

    const checklist = await getTaskChecklistById(checklistId);

    if (!checklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }

    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Failed to fetch task checklist:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for updating checklist
const updateChecklistSchema = z.object({
  title: z.string().max(255, 'Title must be 255 characters or less').optional(),
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Item title is required').max(500, 'Item title must be 500 characters or less'),
    required: z.boolean().optional(),
    order: z.number().int().min(0),
    checked: z.boolean().optional(),
    checked_by: z.string().optional(),
    checked_at: z.string().optional(),
  })).optional(),
  // For toggling a single item
  toggle_item_id: z.string().optional(),
  // For setting a specific item's checked state
  set_item: z.object({
    item_id: z.string(),
    checked: z.boolean(),
  }).optional(),
});

// PATCH /api/tasks/[id]/checklists/[checklistId]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, checklistId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const checklistValidation = validateUUID(checklistId, 'Checklist ID');
    if (!checklistValidation.valid) {
      return NextResponse.json({ error: checklistValidation.error!.message }, { status: checklistValidation.error!.status });
    }

    const body = await request.json();
    const validated = updateChecklistSchema.parse(body);

    let checklist;

    // Handle toggle_item_id
    if (validated.toggle_item_id) {
      checklist = await toggleChecklistItem(
        checklistId,
        validated.toggle_item_id,
        session.user.id!
      );
    }
    // Handle set_item
    else if (validated.set_item) {
      checklist = await setChecklistItemChecked(
        checklistId,
        validated.set_item.item_id,
        validated.set_item.checked,
        session.user.id
      );
    }
    // Regular update
    else {
      checklist = await updateTaskChecklist(checklistId, {
        title: validated.title,
        items: validated.items,
      });
    }

    if (!checklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }

    return NextResponse.json({ checklist });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update task checklist:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/tasks/[id]/checklists/[checklistId]
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, checklistId } = await context.params;

    // Validate UUIDs
    const taskValidation = validateUUID(id, 'Task ID');
    if (!taskValidation.valid) {
      return NextResponse.json({ error: taskValidation.error!.message }, { status: taskValidation.error!.status });
    }

    const checklistValidation = validateUUID(checklistId, 'Checklist ID');
    if (!checklistValidation.valid) {
      return NextResponse.json({ error: checklistValidation.error!.message }, { status: checklistValidation.error!.status });
    }

    const deleted = await deleteTaskChecklist(checklistId);

    if (!deleted) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task checklist:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
