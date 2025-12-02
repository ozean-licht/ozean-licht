/**
 * Label Detail API Route
 *
 * GET /api/labels/[id] - Get a single label by ID
 * PATCH /api/labels/[id] - Update a label
 * DELETE /api/labels/[id] - Delete a label
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getLabelById, updateLabel, deleteLabel } from '@/lib/db/labels';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/labels/[id]
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
    const validation = validateUUID(id, 'Label ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const label = await getLabelById(id);

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    return NextResponse.json({ label });
  } catch (error) {
    console.error('Failed to fetch label:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for updating label
const updateLabelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  slug: z.string().max(100, 'Slug must be 100 characters or less').optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Color must be a valid hex color').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  entity_type: z.enum(['all', 'project', 'task', 'content']).optional(),
  is_active: z.boolean().optional(),
});

// PATCH /api/labels/[id]
export async function PATCH(
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
    const validation = validateUUID(id, 'Label ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const body = await request.json();
    const validated = updateLabelSchema.parse(body);

    const label = await updateLabel(id, validated);

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    return NextResponse.json({ label });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update label:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/labels/[id]
export async function DELETE(
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
    const validation = validateUUID(id, 'Label ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const success = await deleteLabel(id);

    if (!success) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete label:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
