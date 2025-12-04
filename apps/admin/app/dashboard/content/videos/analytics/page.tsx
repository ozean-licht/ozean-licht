/**
 * Video Analytics Dashboard - Server Component
 *
 * Displays aggregated video analytics from Vimeo and Hetzner platforms.
 * Part of Phase 3: Video Analytics Dashboard for the VMS.
 */

import { Suspense } from 'react';
import { requireAnyRole } from '@/lib/rbac/utils';
import {
  getAggregatedAnalytics,
  getTopPerformingVideos,
} from '@/lib/db/video-analytics';
import { query } from '@/lib/db';
import { AnalyticsDashboardClient } from './AnalyticsDashboardClient';

/**
 * Get platform breakdown analytics
 */
async function getPlatformBreakdown(startDate?: string, endDate?: string) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`date >= $${paramIndex++}`);
    params.push(startDate);
  }

  if (endDate) {
    conditions.push(`date <= $${paramIndex++}`);
    params.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      platform,
      COALESCE(SUM(views), 0) as total_views,
      COALESCE(SUM(watch_time_minutes), 0) as total_watch_time_minutes,
      COALESCE(SUM(likes + comments + shares), 0) as total_engagement
    FROM video_analytics
    ${whereClause}
    GROUP BY platform
    ORDER BY total_views DESC
  `;

  const rows = await query<{
    platform: string;
    total_views: string;
    total_watch_time_minutes: string;
    total_engagement: string;
  }>(sql, params);

  return rows.map(row => ({
    platform: row.platform,
    views: parseInt(row.total_views, 10),
    watchTimeMinutes: parseInt(row.total_watch_time_minutes, 10),
    engagement: parseInt(row.total_engagement, 10),
  }));
}

/**
 * Get views over time (daily aggregates)
 */
async function getViewsOverTime(days: number = 30) {
  // Validate days parameter to prevent SQL injection
  const safeDays = Math.floor(Math.abs(days));
  if (safeDays < 1 || safeDays > 365) {
    throw new Error('Days parameter must be between 1 and 365');
  }

  // Calculate cutoff date in application code to avoid INTERVAL arithmetic with user input
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - safeDays);
  const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

  const sql = `
    SELECT
      date::text,
      SUM(views) as views,
      SUM(watch_time_minutes) as watch_time_minutes
    FROM video_analytics
    WHERE date >= $1
    GROUP BY date
    ORDER BY date ASC
  `;

  const rows = await query<{
    date: string;
    views: string;
    watch_time_minutes: string;
  }>(sql, [cutoffDateStr]);

  return rows.map(row => ({
    date: row.date,
    views: parseInt(row.views, 10),
    watchTimeMinutes: parseInt(row.watch_time_minutes, 10),
  }));
}

/**
 * Loading skeleton for the analytics dashboard
 */
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-96 bg-[#0E282E] rounded" />
          <div className="h-96 bg-[#0E282E] rounded" />
        </div>
      </div>
    </div>
  );
}

export default async function VideoAnalyticsPage() {
  // Auth check - super_admin, ol_admin, or ol_content can view analytics
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  // Calculate default date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  // Fetch all analytics data in parallel
  const [
    aggregatedAnalytics,
    topVideos,
    platformBreakdown,
    viewsOverTime,
  ] = await Promise.all([
    getAggregatedAnalytics({
      startDate: startDateStr,
      endDate: endDateStr,
    }),
    getTopPerformingVideos('views', 10),
    getPlatformBreakdown(startDateStr, endDateStr),
    getViewsOverTime(30),
  ]);

  return (
    <Suspense fallback={<AnalyticsDashboardLoading />}>
      <AnalyticsDashboardClient
        initialData={{
          aggregatedAnalytics,
          topVideos,
          platformBreakdown,
          viewsOverTime,
          startDate: startDateStr,
          endDate: endDateStr,
        }}
      />
    </Suspense>
  );
}
