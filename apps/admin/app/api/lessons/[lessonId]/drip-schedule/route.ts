/**
 * API Route: /api/lessons/[lessonId]/drip-schedule
 *
 * Manages drip schedule for a lesson.
 *
 * GET: Get drip schedule for a lesson
 * PUT: Set drip schedule for a lesson (upsert)
 * DELETE: Remove drip schedule for a lesson
 *
 * Part of Phase 9: Learning Sequences
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getLessonById } from '@/lib/db/lessons';
import {
  getDripScheduleByLesson,
  setLessonDripSchedule,
  deleteDripScheduleByLesson,
  DripReleaseType,
} from '@/lib/db/schedules';
import { query } from '@/lib/db';
import { z } from 'zod';

// Validation schema for drip schedule
const dripScheduleSchema = z.object({
  releaseType: z.enum([
    'immediate',
    'fixed_date',
    'relative_days',
    'relative_hours',
    'after_lesson',
    'after_module',
    'after_enrollment',
  ]),
  releaseDate: z.string().optional(),
  relativeDays: z.number().min(0).optional(),
  relativeHours: z.number().min(0).optional(),
  afterLessonId: z.string().uuid().optional().nullable(),
  afterModuleId: z.string().uuid().optional().nullable(),
  releaseTime: z.string().optional(),
  timezone: z.string().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

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
    const schedule = await getDripScheduleByLesson(lessonId);

    // Return null if no schedule exists
    if (!schedule) {
      return NextResponse.json(null);
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Failed to get drip schedule:', error);
    return NextResponse.json(
      { error: 'Failed to get drip schedule' },
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

    const courseId = courseCheck[0].course_id;

    // If body is null or empty, delete the schedule
    if (!body || body === null) {
      await deleteDripScheduleByLesson(lessonId);
      return NextResponse.json(null);
    }

    // Validate input
    const parseResult = dripScheduleSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Set the drip schedule
    const schedule = await setLessonDripSchedule({
      courseId,
      lessonId,
      releaseType: data.releaseType as DripReleaseType,
      releaseDate: data.releaseDate,
      relativeDays: data.relativeDays,
      relativeHours: data.relativeHours,
      afterLessonId: data.afterLessonId || undefined,
      afterModuleId: data.afterModuleId || undefined,
      releaseTime: data.releaseTime,
      timezone: data.timezone,
      isActive: data.isActive,
      notes: data.notes,
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Failed to set drip schedule:', error);
    return NextResponse.json(
      { error: 'Failed to set drip schedule' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await deleteDripScheduleByLesson(lessonId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete drip schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete drip schedule' },
      { status: 500 }
    );
  }
}
