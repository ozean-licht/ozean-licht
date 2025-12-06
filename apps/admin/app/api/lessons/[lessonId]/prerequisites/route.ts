/**
 * API Route: /api/lessons/[lessonId]/prerequisites
 *
 * Manages prerequisites for a lesson.
 *
 * GET: Get all prerequisites for a lesson
 * PUT: Set all prerequisites for a lesson (replaces existing)
 * POST: Add a single prerequisite
 *
 * Part of Phase 9: Learning Sequences
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getPrerequisitesByLesson,
  setLessonPrerequisites,
  createPrerequisite,
  PrerequisiteType,
} from '@/lib/db/prerequisites';
import { getLessonById } from '@/lib/db/lessons';
import { query } from '@/lib/db';
import { z } from 'zod';

// Validation schema for single prerequisite
const createPrerequisiteSchema = z.object({
  requiredLessonId: z.string().uuid(),
  type: z.enum(['completion', 'passing_score', 'viewed']).default('completion'),
  minScore: z.number().min(0).max(100).optional(),
});

// Validation schema for bulk set
const bulkPrerequisitesSchema = z.array(
  z.object({
    requiredLessonId: z.string().uuid(),
    type: z.enum(['completion', 'passing_score', 'viewed']).default('completion'),
    minScore: z.number().min(0).max(100).optional(),
  })
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const prerequisites = await getPrerequisitesByLesson(lessonId);

    return NextResponse.json(prerequisites);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get prerequisites:', error);
    return NextResponse.json(
      { error: 'Failed to get prerequisites' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await request.json();

    // Authorization: Verify the lesson exists and user has access
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get course ID to verify ownership
    const courseCheck = await query<{ course_id: string }>(
      'SELECT course_id FROM course_modules WHERE id = $1',
      [lesson.moduleId]
    );

    if (courseCheck.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Validate input
    const parseResult = bulkPrerequisitesSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const prerequisites = parseResult.data.map((p) => ({
      requiredLessonId: p.requiredLessonId,
      type: p.type as PrerequisiteType,
      minScore: p.minScore,
    }));

    // Set prerequisites (replaces existing)
    const result = await setLessonPrerequisites(lessonId, prerequisites);

    return NextResponse.json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to set prerequisites:', error);

    // Handle circular dependency error
    if (error instanceof Error && error.message.includes('circular')) {
      return NextResponse.json(
        { error: 'Adding this prerequisite would create a circular dependency' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to set prerequisites' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await request.json();

    // Authorization: Verify the lesson exists and user has access
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get course ID to verify ownership
    const courseCheck = await query<{ course_id: string }>(
      'SELECT course_id FROM course_modules WHERE id = $1',
      [lesson.moduleId]
    );

    if (courseCheck.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Validate input
    const parseResult = createPrerequisiteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { requiredLessonId, type, minScore } = parseResult.data;

    // Create prerequisite
    const prerequisite = await createPrerequisite({
      lessonId,
      requiredLessonId,
      type: type as PrerequisiteType,
      minScore,
    });

    return NextResponse.json(prerequisite, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create prerequisite:', error);

    // Handle circular dependency error
    if (error instanceof Error && error.message.includes('circular')) {
      return NextResponse.json(
        { error: 'Adding this prerequisite would create a circular dependency' },
        { status: 400 }
      );
    }

    // Handle duplicate error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'This prerequisite already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create prerequisite' },
      { status: 500 }
    );
  }
}
