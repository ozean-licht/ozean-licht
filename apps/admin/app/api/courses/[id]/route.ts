import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCourseById, updateCourse } from '@/lib/db/courses';
import { courseUpdateSchema } from '@/lib/validations/course-builder';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/courses/[id]
 * Fetch a single course by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/courses/[id]
 * Update a course by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input with Zod
    const result = courseUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    // Check course exists
    const existing = await getCourseById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Update course
    const updated = await updateCourse(id, result.data);
    if (!updated) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
