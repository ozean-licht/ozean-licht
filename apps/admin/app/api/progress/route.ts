/**
 * Progress API Routes
 *
 * Endpoints for tracking and retrieving user lesson progress.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getOrCreateProgress,
  updateProgress,
  getUserCourseProgress,
  startLesson,
  completeLesson,
  enrollInCourse,
  getEnrollment,
  getUserEnrollments,
  recalculateEnrollmentProgress,
} from '@/lib/db/progress';
import { trackEvent } from '@/lib/db/analytics';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Validation schemas
const uuidSchema = z.string().uuid('Invalid UUID format');

const updateProgressSchema = z.object({
  lessonId: uuidSchema,
  courseId: uuidSchema,
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  progressPercent: z.number().min(0).max(100).optional(),
  timeSpentSeconds: z.number().min(0).optional(),
  lastPositionSeconds: z.number().min(0).optional(),
  quizScore: z.number().min(0).max(100).optional(),
  quizPassed: z.boolean().optional(),
});

const enrollmentSchema = z.object({
  courseId: uuidSchema,
  expiresAt: z.string().datetime().optional(),
});

const trackEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  eventCategory: z.enum(['navigation', 'progress', 'engagement', 'assessment', 'media', 'system', 'general']).optional(),
  courseId: uuidSchema.optional(),
  lessonId: uuidSchema.optional(),
  moduleId: uuidSchema.optional(),
  eventData: z.record(z.unknown()).optional(),
  pageUrl: z.string().url().optional(),
});

/**
 * GET /api/progress
 *
 * Get progress for current user.
 * Query params:
 *   - courseId: Get progress for a specific course
 *   - lessonId: Get progress for a specific lesson (requires courseId)
 *   - enrollments: If "true", return enrollments instead of lesson progress
 *   - userId: (Admin only) Get progress for a specific user
 */
export async function GET(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth>> | undefined;

  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    const enrollments = searchParams.get('enrollments');
    const requestedUserId = searchParams.get('userId');

    // Validate UUIDs in query params
    if (courseId) {
      const courseIdResult = uuidSchema.safeParse(courseId);
      if (!courseIdResult.success) {
        return NextResponse.json({ error: 'Invalid courseId format' }, { status: 400 });
      }
    }
    if (lessonId) {
      const lessonIdResult = uuidSchema.safeParse(lessonId);
      if (!lessonIdResult.success) {
        return NextResponse.json({ error: 'Invalid lessonId format' }, { status: 400 });
      }
    }
    if (requestedUserId) {
      const userIdResult = uuidSchema.safeParse(requestedUserId);
      if (!userIdResult.success) {
        return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
      }
    }

    // Check if requesting data for another user (admin only)
    const targetUserId = requestedUserId || session.user.id;
    if (requestedUserId && requestedUserId !== session.user.id) {
      // Only admins can view other users' progress
      const adminRoles = ['super_admin', 'ol_admin', 'ol_content'];
      if (!adminRoles.includes(session.user.adminRole || '')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Return enrollments
    if (enrollments === 'true') {
      const status = searchParams.get('status') as 'active' | 'paused' | 'completed' | 'cancelled' | 'expired' | null;
      const userEnrollments = await getUserEnrollments(targetUserId, status || undefined);
      return NextResponse.json({ enrollments: userEnrollments });
    }

    // Require courseId for lesson progress
    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required for progress queries' },
        { status: 400 }
      );
    }

    // Get specific lesson progress
    if (lessonId) {
      const progress = await getOrCreateProgress(targetUserId, lessonId, courseId);
      return NextResponse.json({ progress });
    }

    // Get all progress for a course
    const progress = await getUserCourseProgress(targetUserId, courseId);
    const enrollment = await getEnrollment(targetUserId, courseId);

    return NextResponse.json({
      progress,
      enrollment,
    });
  } catch (error: unknown) {
    logger.error('Progress API GET failed', error, { userId: session?.user?.id });
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 *
 * Update lesson progress for current user.
 * Body: { lessonId, courseId, status?, progressPercent?, timeSpentSeconds?, userId? (admin only), ... }
 *
 * Also accepts:
 *   - action: "start" | "complete" | "enroll" | "track" for specific operations
 */
export async function POST(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth>> | undefined;
  let body: Record<string, unknown>;

  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
    const action = body.action as string | undefined;
    const requestedUserId = body.userId as string | undefined;

    // Check if updating data for another user (admin only)
    const targetUserId = requestedUserId || session.user.id;
    if (requestedUserId && requestedUserId !== session.user.id) {
      // Only admins can update other users' progress
      const adminRoles = ['super_admin', 'ol_admin'];
      if (!adminRoles.includes(session.user.adminRole || '')) {
        return NextResponse.json({ error: 'Forbidden - Cannot modify other users\' progress' }, { status: 403 });
      }
    }

    // Verify user is enrolled in the course before allowing progress updates
    if (body.courseId && action !== 'enroll') {
      const enrollment = await getEnrollment(targetUserId, body.courseId);
      if (!enrollment) {
        return NextResponse.json({
          error: 'User is not enrolled in this course'
        }, { status: 403 });
      }
    }

    // Handle different actions
    switch (action) {
      case 'start': {
        const { lessonId, courseId } = updateProgressSchema.pick({ lessonId: true, courseId: true }).parse(body);
        const progress = await startLesson(targetUserId, lessonId, courseId);

        // Track event
        await trackEvent({
          userId: targetUserId,
          eventType: 'lesson_start',
          eventCategory: 'progress',
          courseId,
          lessonId,
        });

        return NextResponse.json({ progress });
      }

      case 'complete': {
        const { lessonId, courseId, quizScore, quizPassed } = z.object({
          lessonId: z.string().uuid(),
          courseId: z.string().uuid(),
          quizScore: z.number().min(0).max(100).optional(),
          quizPassed: z.boolean().optional(),
        }).parse(body);

        const progress = await completeLesson(targetUserId, lessonId, courseId, quizScore, quizPassed);

        // Recalculate enrollment progress
        await recalculateEnrollmentProgress(targetUserId, courseId);

        // Track event
        await trackEvent({
          userId: targetUserId,
          eventType: 'lesson_complete',
          eventCategory: 'progress',
          courseId,
          lessonId,
          eventData: { quizScore, quizPassed },
        });

        return NextResponse.json({ progress });
      }

      case 'enroll': {
        const { courseId, expiresAt } = enrollmentSchema.parse(body);
        const enrollment = await enrollInCourse(targetUserId, courseId, expiresAt);

        // Track event
        await trackEvent({
          userId: targetUserId,
          eventType: 'course_enroll',
          eventCategory: 'progress',
          courseId,
        });

        return NextResponse.json({ enrollment });
      }

      case 'track': {
        const eventInput = trackEventSchema.parse(body);
        const event = await trackEvent({
          userId: targetUserId,
          sessionId: body.sessionId,
          ...eventInput,
          userAgent: request.headers.get('user-agent') || undefined,
          referrer: request.headers.get('referer') || undefined,
        });

        return NextResponse.json({ event: { id: event.id } });
      }

      default: {
        // Default: update progress
        const validated = updateProgressSchema.parse(body);
        const { lessonId, courseId, ...updateInput } = validated;

        const progress = await updateProgress(
          targetUserId,
          lessonId,
          courseId,
          updateInput as import('@/lib/db/progress').UpdateProgressInput
        );

        // If completing, recalculate enrollment
        if (updateInput.status === 'completed') {
          await recalculateEnrollmentProgress(targetUserId, courseId);

          await trackEvent({
            userId: targetUserId,
            eventType: 'lesson_complete',
            eventCategory: 'progress',
            courseId,
            lessonId,
          });
        } else if (updateInput.status === 'in_progress') {
          await trackEvent({
            userId: targetUserId,
            eventType: 'lesson_progress',
            eventCategory: 'progress',
            courseId,
            lessonId,
            eventData: {
              progressPercent: updateInput.progressPercent,
              timeSpentSeconds: updateInput.timeSpentSeconds,
            },
          });
        }

        return NextResponse.json({ progress });
      }
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.warn('Progress API validation failed', { errors: error.errors });
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('Progress API POST failed', error, {
      userId: session?.user?.id,
      action: body?.action
    });
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
