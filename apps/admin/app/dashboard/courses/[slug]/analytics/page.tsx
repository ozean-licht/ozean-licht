/**
 * Course Analytics Page
 *
 * Server component that loads course analytics data and renders dashboard.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { requireAnyRole } from '@/lib/rbac/utils';
import { getCourseBySlug } from '@/lib/db/courses';
import { getCourseProgressSummary, getCourseLessonStats } from '@/lib/db/progress';
import { getCourseAnalytics, getLessonFunnel, getDailyUniqueUsers, getDailyCompletions, getDailyEventCounts } from '@/lib/db/analytics';
import { AnalyticsDashboardClient } from './AnalyticsDashboardClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseAnalyticsPage({ params }: PageProps) {
  // Auth check - super_admin, ol_admin or ol_content can view analytics
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  const { slug } = await params;

  // Get course
  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  // Fetch all analytics data in parallel
  const [
    analytics,
    progressSummary,
    lessonStats,
    funnel,
    uniqueUsers,
    completions,
    pageViews,
    lessonStarts,
  ] = await Promise.all([
    getCourseAnalytics(course.id),
    getCourseProgressSummary(course.id),
    getCourseLessonStats(course.id),
    getLessonFunnel(course.id),
    getDailyUniqueUsers(course.id, 30),
    getDailyCompletions(course.id, 30),
    getDailyEventCounts(course.id, 'page_view', 30),
    getDailyEventCounts(course.id, 'lesson_start', 30),
  ]);

  return (
    <Suspense fallback={<AnalyticsDashboardLoading />}>
      <AnalyticsDashboardClient
        course={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          status: course.status,
        }}
        analytics={analytics}
        progressSummary={progressSummary}
        lessonStats={lessonStats}
        funnel={funnel}
        engagement={{
          uniqueUsers,
          completions,
          pageViews,
          lessonStarts,
        }}
      />
    </Suspense>
  );
}

function AnalyticsDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#0E282E] rounded w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#0E282E] rounded" />
          ))}
        </div>
        <div className="h-64 bg-[#0E282E] rounded" />
      </div>
    </div>
  );
}
