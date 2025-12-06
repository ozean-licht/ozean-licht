/**
 * Content Types API Route
 *
 * GET /api/content-types - List all content types
 * POST /api/content-types - Create a new content type
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllContentTypes, createContentType } from '@/lib/db/content-types';
import { z } from 'zod';

// GET /api/content-types
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const platform = searchParams.get('platform') || undefined;

    const contentTypes = await getAllContentTypes({
      isActive: isActive !== null ? isActive === 'true' : undefined,
      platform,
    });

    return NextResponse.json({ contentTypes });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch content types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content types' },
      { status: 500 }
    );
  }
}

// Validation schema for creating content type
const createContentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9_]+$/, 'Slug must be lowercase alphanumeric with underscores'),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  default_workflow_id: z.string().uuid().optional(),
  platforms: z.array(z.string()).optional(),
  estimated_duration_days: z.number().int().min(1).max(365).optional(),
});

// POST /api/content-types
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createContentTypeSchema.parse(body);

    const contentType = await createContentType({
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      icon: validated.icon,
      default_workflow_id: validated.default_workflow_id,
      platforms: validated.platforms,
      estimated_duration_days: validated.estimated_duration_days,
    });

    return NextResponse.json({ contentType }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to create content type:', error);
    return NextResponse.json(
      { error: 'Failed to create content type' },
      { status: 500 }
    );
  }
}
