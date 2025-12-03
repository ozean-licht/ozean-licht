/**
 * Course Analytics API Routes
 *
 * Endpoints for retrieving course analytics data (admin only).
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getCourseAnalytics,
  getLessonFunnel,
  getDailyUniqueUsers,
  getDailyCompletions,
  getDailyEventCounts,
  exportCourseEvents,
} from '@/lib/db/analytics';
import {
  getCourseProgressSummary,
  getCourseLessonStats,
  getCourseEnrollments,
} from '@/lib/db/progress';
import { getCourseById } from '@/lib/db/courses';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const uuidSchema = z.string().uuid('Invalid UUID format');

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/analytics/courses/[id]
 *
 * Get analytics for a specific course.
 * Query params:
 *   - view: "overview" | "funnel" | "engagement" | "users" | "export"
 *   - startDate: ISO date string
 *   - endDate: ISO date string
 *   - days: Number of days for time series (default 30)
 *   - format: "json" | "csv" (for export)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  let session: Awaited<ReturnType<typeof auth>> | undefined;
  let courseId: string | undefined;
  let view: string | undefined;

  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role - super_admin, ol_admin, or ol_content can view analytics
    const adminRoles = ['super_admin', 'ol_admin', 'ol_content'];
    if (!adminRoles.includes(session.user.adminRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resolvedParams = await params;
    courseId = resolvedParams.id;

    // Validate courseId UUID
    const courseIdResult = uuidSchema.safeParse(courseId);
    if (!courseIdResult.success) {
      return NextResponse.json({ error: 'Invalid course ID format' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    view = searchParams.get('view') || 'overview';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Verify course exists
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    switch (view) {
      case 'overview': {
        // Get comprehensive overview
        const [analytics, progressSummary, lessonStats] = await Promise.all([
          getCourseAnalytics(courseId, { startDate, endDate }),
          getCourseProgressSummary(courseId),
          getCourseLessonStats(courseId),
        ]);

        return NextResponse.json({
          course: {
            id: course.id,
            title: course.title,
            status: course.status,
          },
          analytics,
          progressSummary,
          lessonStats,
        });
      }

      case 'funnel': {
        // Get lesson completion funnel
        const funnel = await getLessonFunnel(courseId);
        return NextResponse.json({
          course: { id: course.id, title: course.title },
          funnel,
        });
      }

      case 'engagement': {
        // Get time series engagement data
        const [uniqueUsers, completions, pageViews, lessonStarts] = await Promise.all([
          getDailyUniqueUsers(courseId, days),
          getDailyCompletions(courseId, days),
          getDailyEventCounts(courseId, 'page_view', days),
          getDailyEventCounts(courseId, 'lesson_start', days),
        ]);

        return NextResponse.json({
          course: { id: course.id, title: course.title },
          timeSeries: {
            uniqueUsers,
            completions,
            pageViews,
            lessonStarts,
          },
        });
      }

      case 'users': {
        // Get enrolled users with progress
        const status = searchParams.get('status') as 'active' | 'paused' | 'completed' | 'cancelled' | 'expired' | null;
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);
        const search = searchParams.get('search') || undefined;

        const { enrollments, total } = await getCourseEnrollments(courseId, {
          status: status || undefined,
          limit,
          offset,
          search,
        });

        return NextResponse.json({
          course: { id: course.id, title: course.title },
          enrollments,
          total,
          limit,
          offset,
        });
      }

      case 'export': {
        // Export events for download
        const eventTypes = searchParams.get('eventTypes')?.split(',') || undefined;
        const format = searchParams.get('format') || 'json';

        const events = await exportCourseEvents(courseId, {
          startDate,
          endDate,
          eventTypes,
        });

        if (format === 'csv') {
          // Convert to CSV with formula injection protection
          const escapeCSV = (str: string): string => {
            // Prevent CSV formula injection
            const dangerousStarters = ['=', '+', '-', '@', '\t', '\r'];
            let escapedStr = str;

            if (dangerousStarters.some(char => str.startsWith(char))) {
              escapedStr = "'" + str;
            }

            // Always quote and escape for CSV
            return `"${escapedStr.replace(/"/g, '""')}"`;
          };

          const headers = [
            'id', 'userId', 'eventType', 'eventCategory',
            'lessonId', 'createdAt',
          ];
          const rows = events.map(e => [
            e.id,
            e.userId || '',
            e.eventType,
            e.eventCategory,
            e.lessonId || '',
            e.createdAt,
          ]);

          const csv = [
            headers.map(h => escapeCSV(h)).join(','),
            ...rows.map(row => row.map(v => escapeCSV(String(v))).join(',')),
          ].join('\n');

          return new NextResponse(csv, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="analytics-${courseId}-${new Date().toISOString().split('T')[0]}.csv"`,
            },
          });
        }

        return NextResponse.json({
          course: { id: course.id, title: course.title },
          events,
          total: events.length,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view parameter' },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    logger.error('Analytics API GET failed', error, {
      courseId,
      view,
      userId: session?.user?.id
    });
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
