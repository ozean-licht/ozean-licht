/**
 * API: Courses
 * POST /api/courses - Create a new course
 * GET /api/courses - List courses with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { createCourse, listCourses } from '@/lib/db/courses';
import { courseCreateSchema } from '@/lib/validations/course-builder';

/**
 * Helper to generate URL-safe slug from title
 * Handles German umlauts (ä, ö, ü, ß)
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[char] || char))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * POST /api/courses
 * Create a new course
 */
export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Role check - only admins and content managers
  const allowedRoles = ['super_admin', 'ol_admin', 'ol_content'];
  if (!allowedRoles.includes(session.user.adminRole || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate input
    const parsed = courseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Auto-generate slug if not provided
    const slug = data.slug || generateSlug(data.title);

    // Create course
    const course = await createCourse({
      title: data.title,
      slug,
      description: data.description,
      shortDescription: data.shortDescription,
      status: data.status,
      level: data.level,
      category: data.category,
      entityScope: data.entityScope,
      priceCents: data.priceCents,
      currency: data.currency,
      thumbnailUrl: data.thumbnailUrl,
      coverImageUrl: data.coverImageUrl,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create course:', error);

    // Handle unique constraint violation (duplicate slug)
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A course with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/courses
 * List courses with optional filtering
 * Query params: limit, offset, status, level, category, entityScope, search, orderBy, orderDirection
 */
export async function GET(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const result = await listCourses({
      limit: Math.min(parseInt(searchParams.get('limit') || '100', 10), 1000),
      offset: parseInt(searchParams.get('offset') || '0', 10),
      status: searchParams.get('status') || undefined,
      level: searchParams.get('level') || undefined,
      category: searchParams.get('category') || undefined,
      entityScope: searchParams.get('entityScope') || undefined,
      search: searchParams.get('search') || undefined,
      orderBy: searchParams.get('orderBy') || 'created_at',
      orderDirection: (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc',
    });

    return NextResponse.json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to list courses:', error);
    return NextResponse.json(
      { error: 'Failed to list courses' },
      { status: 500 }
    );
  }
}
