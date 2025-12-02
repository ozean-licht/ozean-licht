/**
 * Workflow Statuses API Route
 *
 * GET /api/workflows/[id]/statuses - Get all statuses for a workflow
 * POST /api/workflows/[id]/statuses - Create a new status for a workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getWorkflowStatuses, createWorkflowStatus, getWorkflowById } from '@/lib/db/workflows';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/workflows/[id]/statuses
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
    const validation = validateUUID(id, 'Workflow ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Verify workflow exists
    const workflow = await getWorkflowById(id);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const statuses = await getWorkflowStatuses(id);

    return NextResponse.json({ statuses });
  } catch (error) {
    console.error('Failed to fetch workflow statuses:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for creating workflow status
const createStatusSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be 50 characters or less').regex(/^[a-z0-9_]+$/, 'Slug must be lowercase alphanumeric with underscores'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  icon: z.string().max(50, 'Icon must be 50 characters or less').optional(),
  order_index: z.number().int().min(0),
  is_start_state: z.boolean().optional(),
  is_done_state: z.boolean().optional(),
  is_cancelled_state: z.boolean().optional(),
});

// POST /api/workflows/[id]/statuses
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
    const validation = validateUUID(id, 'Workflow ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Verify workflow exists
    const workflow = await getWorkflowById(id);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = createStatusSchema.parse(body);

    const status = await createWorkflowStatus({
      workflow_id: id,
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      color: validated.color,
      icon: validated.icon,
      order_index: validated.order_index,
      is_start_state: validated.is_start_state,
      is_done_state: validated.is_done_state,
      is_cancelled_state: validated.is_cancelled_state,
    });

    return NextResponse.json({ status }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create workflow status:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
