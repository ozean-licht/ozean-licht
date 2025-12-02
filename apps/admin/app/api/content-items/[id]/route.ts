/**
 * Content Item Detail API Route
 *
 * GET /api/content-items/[id] - Get a content item by ID
 * PATCH /api/content-items/[id] - Update a content item
 * DELETE /api/content-items/[id] - Delete a content item
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getContentItemById, updateContentItem, deleteContentItem } from '@/lib/db/content-items';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/content-items/[id]
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
    const validation = validateUUID(id, 'Content Item ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const contentItem = await getContentItemById(id);

    if (!contentItem) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ contentItem });
  } catch (error) {
    console.error('Failed to fetch content item:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for updating content item
const updateContentItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  description: z.string().max(50000, 'Description must be 50000 characters or less').optional().nullable(),
  script_content: z.string().max(100000, 'Script content must be 100000 characters or less').optional().nullable(),
  task_id: z.string().uuid('Invalid task ID').optional().nullable(),
  project_id: z.string().uuid('Invalid project ID').optional().nullable(),
  source_content_id: z.string().uuid('Invalid source content ID').optional().nullable(),
  language: z.string().max(10, 'Language code must be 10 characters or less').optional(),
  status: z.enum(['draft', 'in_production', 'ready_for_review', 'approved', 'scheduled', 'published']).optional(),
  workflow_status_id: z.string().uuid('Invalid workflow status ID').optional().nullable(),
  scheduled_publish_at: z.string().datetime().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
  platforms: z.array(z.string().max(50, 'Platform name must be 50 characters or less')).optional(),
  platform_urls: z.record(z.string().max(500, 'Platform URL must be 500 characters or less')).optional(),
  duration_seconds: z.number().int().min(0).optional().nullable(),
  word_count: z.number().int().min(0).optional().nullable(),
  thumbnail_url: z.string().url('Invalid thumbnail URL').max(500, 'Thumbnail URL must be 500 characters or less').optional().nullable(),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  tags: z.array(z.string().max(100, 'Tag must be 100 characters or less')).optional(),
});

// PATCH /api/content-items/[id]
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
    const validation = validateUUID(id, 'Content Item ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const body = await request.json();
    const validated = updateContentItemSchema.parse(body);

    const contentItem = await updateContentItem(id, validated);

    if (!contentItem) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ contentItem });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update content item:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/content-items/[id]
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
    const validation = validateUUID(id, 'Content Item ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const deleted = await deleteContentItem(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete content item:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
