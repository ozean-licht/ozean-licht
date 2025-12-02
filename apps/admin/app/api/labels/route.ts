/**
 * Labels API Route
 *
 * GET /api/labels - List all labels (with optional filters)
 * POST /api/labels - Create a new label
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllLabels, createLabel } from '@/lib/db/labels';
import { z } from 'zod';
import { parsePostgresError } from '@/lib/utils/validation';

// GET /api/labels
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entity_type') as 'all' | 'project' | 'task' | 'content' | null;
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search') || undefined;

    const { labels, total } = await getAllLabels({
      entityType: entityType || undefined,
      isActive: isActive !== null ? isActive === 'true' : undefined,
      search,
    });

    return NextResponse.json({ labels, total });
  } catch (error) {
    console.error('Failed to fetch labels:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for creating label
const createLabelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  slug: z.string().max(100, 'Slug must be 100 characters or less').optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Color must be a valid hex color').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  entity_type: z.enum(['all', 'project', 'task', 'content']).optional(),
  is_active: z.boolean().optional(),
});

// POST /api/labels
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createLabelSchema.parse(body);

    const label = await createLabel({
      name: validated.name,
      slug: validated.slug,
      color: validated.color,
      description: validated.description,
      entity_type: validated.entity_type,
      is_active: validated.is_active,
    });

    return NextResponse.json({ label }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create label:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
