/**
 * Task Checklists API Route
 *
 * GET /api/tasks/[id]/checklists - Get all checklists for a task
 * POST /api/tasks/[id]/checklists - Create a new checklist for a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTaskChecklists,
  createTaskChecklist,
  createTaskChecklistFromTemplate,
} from '@/lib/db/checklists';
import { getTaskById } from '@/lib/db/tasks';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/tasks/[id]/checklists
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

    const checklists = await getTaskChecklists(id);

    return NextResponse.json({ checklists });
  } catch (error) {
    console.error('Failed to fetch task checklists:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for creating checklist
const createChecklistSchema = z.object({
  template_id: z.string().uuid('Invalid template ID').optional(),
  title: z.string().max(255, 'Title must be 255 characters or less').optional(),
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Item title is required').max(500, 'Item title must be 500 characters or less'),
    required: z.boolean().optional(),
    order: z.number().int().min(0),
  })).optional(),
});

// POST /api/tasks/[id]/checklists
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
    const validated = createChecklistSchema.parse(body);

    let checklist;

    // If template_id provided, create from template
    if (validated.template_id) {
      checklist = await createTaskChecklistFromTemplate(id, validated.template_id);
    } else {
      // Create custom checklist
      checklist = await createTaskChecklist({
        task_id: id,
        title: validated.title,
        items: validated.items,
      });
    }

    return NextResponse.json({ checklist }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create task checklist:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
