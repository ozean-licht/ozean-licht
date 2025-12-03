/**
 * Analytics Database Queries
 *
 * Direct PostgreSQL queries for course analytics and event tracking.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import { query, execute } from './index';

// ============================================
// Types
// ============================================

export type EventCategory = 'navigation' | 'progress' | 'engagement' | 'assessment' | 'media' | 'system' | 'general';

export type EventType =
  | 'page_view'
  | 'lesson_start'
  | 'lesson_complete'
  | 'lesson_progress'
  | 'quiz_start'
  | 'quiz_submit'
  | 'quiz_pass'
  | 'quiz_fail'
  | 'course_enroll'
  | 'course_complete'
  | 'video_play'
  | 'video_pause'
  | 'video_seek'
  | 'download'
  | 'search'
  | 'error';

/**
 * Analytics event record
 */
export interface AnalyticsEvent {
  id: string;
  userId: string | null;
  sessionId: string | null;
  eventType: string;
  eventCategory: EventCategory;
  courseId: string | null;
  lessonId: string | null;
  moduleId: string | null;
  eventData: Record<string, unknown>;
  userAgent: string | null;
  ipAddress: string | null;
  referrer: string | null;
  pageUrl: string | null;
  createdAt: string;
}

/**
 * Daily stats record
 */
export interface DailyStats {
  id: string;
  date: string;
  courseId: string | null;
  uniqueUsers: number;
  pageViews: number;
  lessonStarts: number;
  lessonCompletions: number;
  quizAttempts: number;
  quizPasses: number;
  totalTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Course analytics summary
 */
export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  uniqueUsers: number;
  pageViews: number;
  lessonStarts: number;
  lessonCompletions: number;
  quizAttempts: number;
  quizPasses: number;
  completionRate: number;
}

/**
 * Lesson funnel data point
 */
export interface LessonFunnelPoint {
  lessonId: string;
  title: string;
  moduleOrder: number;
  sortOrder: number;
  started: number;
  completed: number;
  completionRate: number;
  retentionRate: number;
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

// ============================================
// Event Tracking
// ============================================

/**
 * Create event input
 */
export interface CreateEventInput {
  userId?: string;
  sessionId?: string;
  eventType: string;
  eventCategory?: EventCategory;
  courseId?: string;
  lessonId?: string;
  moduleId?: string;
  eventData?: Record<string, unknown>;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  pageUrl?: string;
}

/**
 * Track an analytics event
 */
export async function trackEvent(input: CreateEventInput): Promise<AnalyticsEvent> {
  const sql = `
    INSERT INTO analytics_events (
      user_id, session_id, event_type, event_category,
      course_id, lesson_id, module_id, event_data,
      user_agent, ip_address, referrer, page_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;

  const rows = await query<{
    id: string;
    user_id: string | null;
    session_id: string | null;
    event_type: string;
    event_category: string;
    course_id: string | null;
    lesson_id: string | null;
    module_id: string | null;
    event_data: Record<string, unknown>;
    user_agent: string | null;
    ip_address: string | null;
    referrer: string | null;
    page_url: string | null;
    created_at: string;
  }>(sql, [
    input.userId || null,
    input.sessionId || null,
    input.eventType,
    input.eventCategory || 'general',
    input.courseId || null,
    input.lessonId || null,
    input.moduleId || null,
    input.eventData || {},
    input.userAgent || null,
    input.ipAddress || null,
    input.referrer || null,
    input.pageUrl || null,
  ]);

  const row = rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    sessionId: row.session_id,
    eventType: row.event_type,
    eventCategory: row.event_category as EventCategory,
    courseId: row.course_id,
    lessonId: row.lesson_id,
    moduleId: row.module_id,
    eventData: row.event_data,
    userAgent: row.user_agent,
    ipAddress: row.ip_address,
    referrer: row.referrer,
    pageUrl: row.page_url,
    createdAt: row.created_at,
  };
}

/**
 * Batch track multiple events
 */
export async function trackEvents(events: CreateEventInput[]): Promise<number> {
  if (events.length === 0) return 0;

  // Build VALUES clause for batch insert
  const values: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (const event of events) {
    values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
    params.push(
      event.userId || null,
      event.sessionId || null,
      event.eventType,
      event.eventCategory || 'general',
      event.courseId || null,
      event.lessonId || null,
      event.moduleId || null,
      event.eventData || {},
      event.userAgent || null,
      event.ipAddress || null,
      event.referrer || null,
      event.pageUrl || null
    );
  }

  const sql = `
    INSERT INTO analytics_events (
      user_id, session_id, event_type, event_category,
      course_id, lesson_id, module_id, event_data,
      user_agent, ip_address, referrer, page_url
    )
    VALUES ${values.join(', ')}
  `;

  const result = await execute(sql, params);
  return result.rowCount || 0;
}

// ============================================
// Course Analytics
// ============================================

/**
 * Get course analytics for a time period
 */
export async function getCourseAnalytics(
  courseId: string,
  options: {
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<CourseAnalytics | null> {
  const { startDate, endDate } = options;

  // Build date filter for JOIN condition
  let dateFilter = '';
  const params: unknown[] = [courseId];
  let paramIndex = 2;

  if (startDate) {
    dateFilter += ` AND ae.created_at >= $${paramIndex++}`;
    params.push(startDate);
  }

  if (endDate) {
    dateFilter += ` AND ae.created_at <= $${paramIndex++}`;
    params.push(endDate);
  }

  const sql = `
    SELECT
      c.id as course_id,
      c.title as course_title,
      COUNT(DISTINCT ae.user_id) as unique_users,
      COUNT(*) FILTER (WHERE ae.event_type = 'page_view') as page_views,
      COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') as lesson_starts,
      COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete') as lesson_completions,
      COUNT(*) FILTER (WHERE ae.event_type = 'quiz_submit') as quiz_attempts,
      COUNT(*) FILTER (WHERE ae.event_type = 'quiz_pass') as quiz_passes,
      CASE
        WHEN COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') > 0
        THEN ROUND(100.0 * COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete')
             / COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start'), 2)
        ELSE 0
      END as completion_rate
    FROM courses c
    LEFT JOIN analytics_events ae ON ae.course_id = c.id${dateFilter}
    WHERE c.id = $1
    GROUP BY c.id, c.title
  `;

  const rows = await query<{
    course_id: string;
    course_title: string;
    unique_users: string;
    page_views: string;
    lesson_starts: string;
    lesson_completions: string;
    quiz_attempts: string;
    quiz_passes: string;
    completion_rate: string;
  }>(sql, params);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    courseId: row.course_id,
    courseTitle: row.course_title,
    uniqueUsers: parseInt(row.unique_users, 10),
    pageViews: parseInt(row.page_views, 10),
    lessonStarts: parseInt(row.lesson_starts, 10),
    lessonCompletions: parseInt(row.lesson_completions, 10),
    quizAttempts: parseInt(row.quiz_attempts, 10),
    quizPasses: parseInt(row.quiz_passes, 10),
    completionRate: parseFloat(row.completion_rate),
  };
}

/**
 * Get analytics for all courses
 */
export async function getAllCourseAnalytics(
  options: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ analytics: CourseAnalytics[]; total: number }> {
  const { startDate, endDate } = options;

  // Validate and bound pagination parameters
  const limit = Math.min(Math.max(1, options.limit || 50), 100);
  const offset = Math.max(0, options.offset || 0);

  let dateFilter = '';
  const params: unknown[] = [];
  let paramIndex = 1;

  if (startDate) {
    dateFilter += ` AND ae.created_at >= $${paramIndex++}`;
    params.push(startDate);
  }

  if (endDate) {
    dateFilter += ` AND ae.created_at <= $${paramIndex++}`;
    params.push(endDate);
  }

  // Count total courses
  const countResult = await query<{ count: string }>('SELECT COUNT(*) as count FROM courses');
  const total = parseInt(countResult[0]?.count || '0', 10);

  const sql = `
    SELECT
      c.id as course_id,
      c.title as course_title,
      COUNT(DISTINCT ae.user_id) as unique_users,
      COUNT(*) FILTER (WHERE ae.event_type = 'page_view') as page_views,
      COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') as lesson_starts,
      COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete') as lesson_completions,
      COUNT(*) FILTER (WHERE ae.event_type = 'quiz_submit') as quiz_attempts,
      COUNT(*) FILTER (WHERE ae.event_type = 'quiz_pass') as quiz_passes,
      CASE
        WHEN COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') > 0
        THEN ROUND(100.0 * COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete')
             / COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start'), 2)
        ELSE 0
      END as completion_rate
    FROM courses c
    LEFT JOIN analytics_events ae ON ae.course_id = c.id ${dateFilter}
    GROUP BY c.id, c.title
    ORDER BY unique_users DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  params.push(limit, offset);

  const rows = await query<{
    course_id: string;
    course_title: string;
    unique_users: string;
    page_views: string;
    lesson_starts: string;
    lesson_completions: string;
    quiz_attempts: string;
    quiz_passes: string;
    completion_rate: string;
  }>(sql, params);

  return {
    analytics: rows.map(row => ({
      courseId: row.course_id,
      courseTitle: row.course_title,
      uniqueUsers: parseInt(row.unique_users, 10),
      pageViews: parseInt(row.page_views, 10),
      lessonStarts: parseInt(row.lesson_starts, 10),
      lessonCompletions: parseInt(row.lesson_completions, 10),
      quizAttempts: parseInt(row.quiz_attempts, 10),
      quizPasses: parseInt(row.quiz_passes, 10),
      completionRate: parseFloat(row.completion_rate),
    })),
    total,
  };
}

// ============================================
// Lesson Funnel Analysis
// ============================================

/**
 * Get lesson completion funnel for a course
 */
export async function getLessonFunnel(courseId: string): Promise<LessonFunnelPoint[]> {
  const sql = `
    WITH lesson_order AS (
      SELECT
        l.id as lesson_id,
        l.title,
        l.sort_order,
        m.sort_order as module_order
      FROM course_lessons l
      JOIN course_modules m ON m.id = l.module_id
      WHERE m.course_id = $1
    ),
    lesson_progress AS (
      SELECT
        lo.lesson_id,
        lo.title,
        lo.module_order,
        lo.sort_order,
        COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status IN ('in_progress', 'completed')) as started,
        COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed') as completed
      FROM lesson_order lo
      LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = lo.lesson_id
      GROUP BY lo.lesson_id, lo.title, lo.module_order, lo.sort_order
    )
    SELECT
      lesson_id,
      title,
      module_order,
      sort_order,
      started,
      completed,
      CASE
        WHEN started > 0 THEN ROUND(100.0 * completed / started, 2)
        ELSE 0
      END as completion_rate,
      LAG(started) OVER (ORDER BY module_order, sort_order) as prev_started,
      CASE
        WHEN LAG(started) OVER (ORDER BY module_order, sort_order) > 0
        THEN ROUND(100.0 * started / LAG(started) OVER (ORDER BY module_order, sort_order), 2)
        ELSE 100
      END as retention_rate
    FROM lesson_progress
    ORDER BY module_order, sort_order
  `;

  const rows = await query<{
    lesson_id: string;
    title: string;
    module_order: number;
    sort_order: number;
    started: string;
    completed: string;
    completion_rate: string;
    retention_rate: string;
  }>(sql, [courseId]);

  return rows.map(row => ({
    lessonId: row.lesson_id,
    title: row.title,
    moduleOrder: row.module_order,
    sortOrder: row.sort_order,
    started: parseInt(row.started, 10),
    completed: parseInt(row.completed, 10),
    completionRate: parseFloat(row.completion_rate),
    retentionRate: parseFloat(row.retention_rate),
  }));
}

// ============================================
// Time Series Analytics
// ============================================

/**
 * Get daily event counts for a course
 */
export async function getDailyEventCounts(
  courseId: string,
  eventType: string,
  days: number = 30
): Promise<TimeSeriesPoint[]> {
  const sql = `
    WITH date_series AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '1 day' * $3,
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date as date
    )
    SELECT
      ds.date::text,
      COALESCE(COUNT(ae.id), 0) as value
    FROM date_series ds
    LEFT JOIN analytics_events ae ON
      DATE(ae.created_at) = ds.date
      AND ae.course_id = $1
      AND ae.event_type = $2
    GROUP BY ds.date
    ORDER BY ds.date
  `;

  const rows = await query<{ date: string; value: string }>(sql, [courseId, eventType, days]);

  return rows.map(row => ({
    date: row.date,
    value: parseInt(row.value, 10),
  }));
}

/**
 * Get daily unique users for a course
 */
export async function getDailyUniqueUsers(
  courseId: string,
  days: number = 30
): Promise<TimeSeriesPoint[]> {
  const sql = `
    WITH date_series AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '1 day' * $2,
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date as date
    )
    SELECT
      ds.date::text,
      COALESCE(COUNT(DISTINCT ae.user_id), 0) as value
    FROM date_series ds
    LEFT JOIN analytics_events ae ON
      DATE(ae.created_at) = ds.date
      AND ae.course_id = $1
    GROUP BY ds.date
    ORDER BY ds.date
  `;

  const rows = await query<{ date: string; value: string }>(sql, [courseId, days]);

  return rows.map(row => ({
    date: row.date,
    value: parseInt(row.value, 10),
  }));
}

/**
 * Get daily completions for a course
 */
export async function getDailyCompletions(
  courseId: string,
  days: number = 30
): Promise<TimeSeriesPoint[]> {
  const sql = `
    WITH date_series AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '1 day' * $2,
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date as date
    )
    SELECT
      ds.date::text,
      COALESCE(COUNT(ulp.id), 0) as value
    FROM date_series ds
    LEFT JOIN user_lesson_progress ulp ON
      DATE(ulp.completed_at) = ds.date
      AND ulp.course_id = $1
      AND ulp.status = 'completed'
    GROUP BY ds.date
    ORDER BY ds.date
  `;

  const rows = await query<{ date: string; value: string }>(sql, [courseId, days]);

  return rows.map(row => ({
    date: row.date,
    value: parseInt(row.value, 10),
  }));
}

// ============================================
// Aggregation & Cleanup
// ============================================

/**
 * Trigger daily aggregation (usually called by cron)
 */
export async function aggregateDailyStats(targetDate?: string): Promise<number> {
  const sql = `SELECT aggregate_daily_analytics($1::date) as rows_affected`;
  const rows = await query<{ rows_affected: string }>(sql, [targetDate || null]);
  return parseInt(rows[0]?.rows_affected || '0', 10);
}

/**
 * Delete old events (retention policy)
 */
export async function deleteOldEvents(olderThanDays: number = 90): Promise<number> {
  const sql = `
    DELETE FROM analytics_events
    WHERE created_at < NOW() - INTERVAL '1 day' * $1
  `;
  const result = await execute(sql, [olderThanDays]);
  return result.rowCount || 0;
}

// ============================================
// Export Utilities
// ============================================

/**
 * Export event data for a course (for CSV generation)
 */
export async function exportCourseEvents(
  courseId: string,
  options: {
    startDate?: string;
    endDate?: string;
    eventTypes?: string[];
  } = {}
): Promise<AnalyticsEvent[]> {
  const { startDate, endDate, eventTypes } = options;

  let whereClause = `WHERE course_id = $1`;
  const params: unknown[] = [courseId];
  let paramIndex = 2;

  if (startDate) {
    whereClause += ` AND created_at >= $${paramIndex++}`;
    params.push(startDate);
  }

  if (endDate) {
    whereClause += ` AND created_at <= $${paramIndex++}`;
    params.push(endDate);
  }

  if (eventTypes && eventTypes.length > 0) {
    whereClause += ` AND event_type = ANY($${paramIndex++})`;
    params.push(eventTypes);
  }

  const sql = `
    SELECT *
    FROM analytics_events
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT 10000
  `;

  const rows = await query<{
    id: string;
    user_id: string | null;
    session_id: string | null;
    event_type: string;
    event_category: string;
    course_id: string | null;
    lesson_id: string | null;
    module_id: string | null;
    event_data: Record<string, unknown>;
    user_agent: string | null;
    ip_address: string | null;
    referrer: string | null;
    page_url: string | null;
    created_at: string;
  }>(sql, params);

  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    sessionId: row.session_id,
    eventType: row.event_type,
    eventCategory: row.event_category as EventCategory,
    courseId: row.course_id,
    lessonId: row.lesson_id,
    moduleId: row.module_id,
    eventData: row.event_data,
    userAgent: row.user_agent,
    ipAddress: row.ip_address,
    referrer: row.referrer,
    pageUrl: row.page_url,
    createdAt: row.created_at,
  }));
}
