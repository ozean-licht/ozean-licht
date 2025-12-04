/**
 * Video Analytics Database Queries
 *
 * Direct PostgreSQL queries for video analytics aggregation and reporting.
 * Handles daily analytics upserts, trend analysis, and top performer queries.
 */

import { query } from './index';
import {
  VideoAnalyticsRecord,
  VideoAnalyticsSummary,
  VideoAnalyticsFilters,
  TopPerformingVideo,
} from '@/types/video';

// ================================================================
// Database Row Types (snake_case)
// ================================================================

interface VideoAnalyticsRow {
  id: string;
  video_id: string;
  platform: string;
  date: string;
  views: number;
  watch_time_minutes: number;
  unique_viewers: number;
  avg_watch_percentage: string | null;
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
}

interface AnalyticsSummaryRow {
  total_views: string;
  total_watch_time_minutes: string;
  total_unique_viewers: string;
  avg_watch_percentage: string | null;
  total_likes: string;
  total_comments: string;
  total_shares: string;
}

interface TopPerformingVideoRow {
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  views: string;
  watch_time_minutes: string;
  engagement: string;
}

interface TrendRow {
  date: string;
  views: string;
  watch_time: string;
}

// ================================================================
// Mapping Functions
// ================================================================

/**
 * Map database row to VideoAnalyticsRecord type
 */
function mapAnalyticsRecord(row: VideoAnalyticsRow): VideoAnalyticsRecord {
  return {
    id: row.id,
    videoId: row.video_id,
    platform: row.platform,
    date: row.date,
    views: row.views,
    watchTimeMinutes: row.watch_time_minutes,
    uniqueViewers: row.unique_viewers,
    avgWatchPercentage: row.avg_watch_percentage ? parseFloat(row.avg_watch_percentage) : undefined,
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
    createdAt: row.created_at,
  };
}

// ================================================================
// Query Functions
// ================================================================

/**
 * Upsert daily analytics for a video on a specific platform
 *
 * @param data - Analytics data without id and createdAt
 * @returns The upserted analytics record
 *
 * @example
 * const analytics = await upsertDailyAnalytics({
 *   videoId: 'uuid',
 *   platform: 'vimeo',
 *   date: '2025-12-04',
 *   views: 150,
 *   watchTimeMinutes: 300,
 *   uniqueViewers: 120,
 *   avgWatchPercentage: 65.5,
 *   likes: 10,
 *   comments: 5,
 *   shares: 2
 * });
 */
export async function upsertDailyAnalytics(
  data: Omit<VideoAnalyticsRecord, 'id' | 'createdAt'>
): Promise<VideoAnalyticsRecord> {
  const sql = `
    INSERT INTO video_analytics (
      video_id, platform, date,
      views, watch_time_minutes, unique_viewers, avg_watch_percentage,
      likes, comments, shares
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (video_id, platform, date)
    DO UPDATE SET
      views = EXCLUDED.views,
      watch_time_minutes = EXCLUDED.watch_time_minutes,
      unique_viewers = EXCLUDED.unique_viewers,
      avg_watch_percentage = EXCLUDED.avg_watch_percentage,
      likes = EXCLUDED.likes,
      comments = EXCLUDED.comments,
      shares = EXCLUDED.shares
    RETURNING
      id, video_id, platform, date,
      views, watch_time_minutes, unique_viewers, avg_watch_percentage,
      likes, comments, shares, created_at
  `;

  const params = [
    data.videoId,
    data.platform,
    data.date,
    data.views,
    data.watchTimeMinutes,
    data.uniqueViewers,
    data.avgWatchPercentage ?? null,
    data.likes,
    data.comments,
    data.shares,
  ];

  const rows = await query<VideoAnalyticsRow>(sql, params);
  return mapAnalyticsRecord(rows[0]);
}

/**
 * Get analytics records for a specific video with optional date range
 *
 * @param videoId - Video UUID
 * @param startDate - Optional start date (ISO format)
 * @param endDate - Optional end date (ISO format)
 * @returns Array of analytics records
 *
 * @example
 * const analytics = await getAnalyticsByVideo('video-uuid', '2025-11-01', '2025-12-01');
 */
export async function getAnalyticsByVideo(
  videoId: string,
  startDate?: string,
  endDate?: string
): Promise<VideoAnalyticsRecord[]> {
  const conditions: string[] = ['video_id = $1'];
  const params: unknown[] = [videoId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`date >= $${paramIndex++}`);
    params.push(startDate);
  }

  if (endDate) {
    conditions.push(`date <= $${paramIndex++}`);
    params.push(endDate);
  }

  const sql = `
    SELECT
      id, video_id, platform, date,
      views, watch_time_minutes, unique_viewers, avg_watch_percentage,
      likes, comments, shares, created_at
    FROM video_analytics
    WHERE ${conditions.join(' AND ')}
    ORDER BY date DESC, platform
  `;

  const rows = await query<VideoAnalyticsRow>(sql, params);
  return rows.map(mapAnalyticsRecord);
}

/**
 * Get aggregated analytics summary with optional filters
 *
 * @param filters - Filter options
 * @returns Aggregated analytics summary
 *
 * @example
 * const summary = await getAggregatedAnalytics({
 *   videoId: 'uuid',
 *   startDate: '2025-11-01',
 *   endDate: '2025-12-01'
 * });
 */
export async function getAggregatedAnalytics(
  filters: VideoAnalyticsFilters
): Promise<VideoAnalyticsSummary> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build WHERE conditions
  if (filters.videoId) {
    conditions.push(`video_id = $${paramIndex++}`);
    params.push(filters.videoId);
  }

  if (filters.videoIds && filters.videoIds.length > 0) {
    conditions.push(`video_id = ANY($${paramIndex++})`);
    params.push(filters.videoIds);
  }

  if (filters.platform) {
    conditions.push(`platform = $${paramIndex++}`);
    params.push(filters.platform);
  }

  if (filters.startDate) {
    conditions.push(`date >= $${paramIndex++}`);
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    conditions.push(`date <= $${paramIndex++}`);
    params.push(filters.endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Main aggregation query
  const sql = `
    SELECT
      COALESCE(SUM(views), 0) as total_views,
      COALESCE(SUM(watch_time_minutes), 0) as total_watch_time_minutes,
      COALESCE(SUM(unique_viewers), 0) as total_unique_viewers,
      COALESCE(AVG(avg_watch_percentage), 0) as avg_watch_percentage,
      COALESCE(SUM(likes), 0) as total_likes,
      COALESCE(SUM(comments), 0) as total_comments,
      COALESCE(SUM(shares), 0) as total_shares
    FROM video_analytics
    ${whereClause}
  `;

  const rows = await query<AnalyticsSummaryRow>(sql, params);
  const row = rows[0];

  if (!row) {
    return {
      totalViews: 0,
      totalWatchTimeMinutes: 0,
      totalUniqueViewers: 0,
      avgWatchPercentage: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
    };
  }

  // Calculate trends if date range is provided
  let viewsTrend: number | undefined;
  let watchTimeTrend: number | undefined;
  let engagementTrend: number | undefined;

  if (filters.startDate && filters.endDate) {
    const trends = await calculateTrends(filters);
    viewsTrend = trends.viewsTrend;
    watchTimeTrend = trends.watchTimeTrend;
    engagementTrend = trends.engagementTrend;
  }

  return {
    totalViews: parseInt(row.total_views, 10),
    totalWatchTimeMinutes: parseInt(row.total_watch_time_minutes, 10),
    totalUniqueViewers: parseInt(row.total_unique_viewers, 10),
    avgWatchPercentage: parseFloat(row.avg_watch_percentage || '0'),
    totalLikes: parseInt(row.total_likes, 10),
    totalComments: parseInt(row.total_comments, 10),
    totalShares: parseInt(row.total_shares, 10),
    viewsTrend,
    watchTimeTrend,
    engagementTrend,
  };
}

/**
 * Calculate trends by comparing current period with previous period
 * (Helper function for getAggregatedAnalytics)
 */
async function calculateTrends(
  filters: VideoAnalyticsFilters
): Promise<{
  viewsTrend: number;
  watchTimeTrend: number;
  engagementTrend: number;
}> {
  if (!filters.startDate || !filters.endDate) {
    return { viewsTrend: 0, watchTimeTrend: 0, engagementTrend: 0 };
  }

  // Calculate date range duration
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);
  const rangeDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate previous period dates
  const prevEndDate = new Date(startDate);
  prevEndDate.setDate(prevEndDate.getDate() - 1);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevStartDate.getDate() - rangeDays);

  // Get previous period analytics
  const prevFilters: VideoAnalyticsFilters = {
    ...filters,
    startDate: prevStartDate.toISOString().split('T')[0],
    endDate: prevEndDate.toISOString().split('T')[0],
  };

  const prevSummary = await getAggregatedAnalytics(prevFilters);

  // Get current period analytics (without recursion)
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.videoId) {
    conditions.push(`video_id = $${paramIndex++}`);
    params.push(filters.videoId);
  }

  if (filters.videoIds && filters.videoIds.length > 0) {
    conditions.push(`video_id = ANY($${paramIndex++})`);
    params.push(filters.videoIds);
  }

  if (filters.platform) {
    conditions.push(`platform = $${paramIndex++}`);
    params.push(filters.platform);
  }

  conditions.push(`date >= $${paramIndex++}`);
  params.push(filters.startDate);
  conditions.push(`date <= $${paramIndex++}`);
  params.push(filters.endDate);

  const sql = `
    SELECT
      COALESCE(SUM(views), 0) as total_views,
      COALESCE(SUM(watch_time_minutes), 0) as total_watch_time_minutes,
      COALESCE(SUM(likes + comments + shares), 0) as total_engagement
    FROM video_analytics
    WHERE ${conditions.join(' AND ')}
  `;

  const rows = await query<{
    total_views: string;
    total_watch_time_minutes: string;
    total_engagement: string;
  }>(sql, params);

  const currentViews = parseInt(rows[0]?.total_views || '0', 10);
  const currentWatchTime = parseInt(rows[0]?.total_watch_time_minutes || '0', 10);
  const currentEngagement = parseInt(rows[0]?.total_engagement || '0', 10);

  const prevEngagement = prevSummary.totalLikes + prevSummary.totalComments + prevSummary.totalShares;

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    viewsTrend: calculatePercentageChange(currentViews, prevSummary.totalViews),
    watchTimeTrend: calculatePercentageChange(currentWatchTime, prevSummary.totalWatchTimeMinutes),
    engagementTrend: calculatePercentageChange(currentEngagement, prevEngagement),
  };
}

/**
 * Get top performing videos by a specific metric
 *
 * @param metric - Metric to sort by ('views', 'watch_time', 'engagement')
 * @param limit - Number of results to return (default: 10)
 * @returns Array of top performing videos
 *
 * @example
 * const topVideos = await getTopPerformingVideos('views', 5);
 */
export async function getTopPerformingVideos(
  metric: 'views' | 'watch_time' | 'engagement',
  limit: number = 10
): Promise<TopPerformingVideo[]> {
  // Determine the ORDER BY clause based on metric
  let orderByClause: string;
  switch (metric) {
    case 'views':
      orderByClause = 'total_views DESC';
      break;
    case 'watch_time':
      orderByClause = 'total_watch_time_minutes DESC';
      break;
    case 'engagement':
      orderByClause = 'total_engagement DESC';
      break;
    default:
      orderByClause = 'total_views DESC';
  }

  const sql = `
    WITH video_stats AS (
      SELECT
        va.video_id,
        SUM(va.views) as total_views,
        SUM(va.watch_time_minutes) as total_watch_time_minutes,
        SUM(va.likes + va.comments + va.shares) as total_engagement
      FROM video_analytics va
      GROUP BY va.video_id
    ),
    video_trends AS (
      SELECT
        va.video_id,
        SUM(CASE WHEN va.date >= CURRENT_DATE - INTERVAL '7 days' THEN va.views ELSE 0 END) as recent_views,
        SUM(CASE WHEN va.date >= CURRENT_DATE - INTERVAL '14 days' AND va.date < CURRENT_DATE - INTERVAL '7 days' THEN va.views ELSE 0 END) as prev_views
      FROM video_analytics va
      GROUP BY va.video_id
    )
    SELECT
      v.id as video_id,
      v.title,
      v.thumbnail_url,
      COALESCE(vs.total_views, 0) as views,
      COALESCE(vs.total_watch_time_minutes, 0) as watch_time_minutes,
      COALESCE(vs.total_engagement, 0) as engagement,
      CASE
        WHEN vt.prev_views > 0 THEN
          ROUND(((vt.recent_views - vt.prev_views)::decimal / vt.prev_views * 100)::numeric, 2)
        WHEN vt.recent_views > 0 THEN 100
        ELSE 0
      END as trend
    FROM videos v
    LEFT JOIN video_stats vs ON v.id = vs.video_id
    LEFT JOIN video_trends vt ON v.id = vt.video_id
    WHERE v.status = 'published'
      AND vs.total_views > 0
    ORDER BY ${orderByClause}
    LIMIT $1
  `;

  const rows = await query<TopPerformingVideoRow & { trend: string }>(sql, [limit]);

  return rows.map(row => ({
    videoId: row.video_id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url || undefined,
    views: parseInt(row.views, 10),
    watchTimeMinutes: parseInt(row.watch_time_minutes, 10),
    engagement: parseInt(row.engagement, 10),
    trend: parseFloat(row.trend),
  }));
}

/**
 * Get analytics trends over time for a specific video
 *
 * @param videoId - Video UUID
 * @param days - Number of days to look back (default: 30)
 * @returns Array of daily trend data
 *
 * @example
 * const trends = await getAnalyticsTrends('video-uuid', 7);
 */
export async function getAnalyticsTrends(
  videoId: string,
  days: number = 30
): Promise<{ date: string; views: number; watchTime: number }[]> {
  const sql = `
    SELECT
      date::text,
      SUM(views) as views,
      SUM(watch_time_minutes) as watch_time
    FROM video_analytics
    WHERE video_id = $1
      AND date >= CURRENT_DATE - INTERVAL '1 day' * $2
    GROUP BY date
    ORDER BY date ASC
  `;

  const rows = await query<TrendRow>(sql, [videoId, days]);

  return rows.map(row => ({
    date: row.date,
    views: parseInt(row.views, 10),
    watchTime: parseInt(row.watch_time, 10),
  }));
}
