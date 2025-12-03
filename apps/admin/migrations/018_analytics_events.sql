-- Phase 10: Analytics Events Tracking
-- Records detailed user events for analytics and reporting
-- Part of Advanced Course Builder feature

-- Analytics events table (append-only event log)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,  -- NULL for anonymous events
  session_id TEXT,  -- Browser session identifier

  -- Event classification
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL DEFAULT 'general',

  -- Event context
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,

  -- Event data (flexible JSON storage)
  event_data JSONB DEFAULT '{}',

  -- Client information
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  page_url TEXT,

  -- Timestamp (partitioning candidate for large datasets)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_events_course ON analytics_events(course_id) WHERE course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_lesson ON analytics_events(lesson_id) WHERE lesson_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id) WHERE session_id IS NOT NULL;

-- Composite index for time-range queries by course
CREATE INDEX IF NOT EXISTS idx_events_course_time ON analytics_events(course_id, created_at DESC)
  WHERE course_id IS NOT NULL;

-- Event types reference (not enforced, for documentation)
COMMENT ON TABLE analytics_events IS 'Detailed user activity events for analytics.

Common event_types:
  - page_view: User viewed a page
  - lesson_start: User started a lesson
  - lesson_complete: User completed a lesson
  - lesson_progress: Progress update (video position, scroll depth)
  - quiz_start: User started a quiz
  - quiz_submit: User submitted quiz answers
  - quiz_pass: User passed a quiz
  - quiz_fail: User failed a quiz
  - course_enroll: User enrolled in course
  - course_complete: User completed course
  - video_play: Video playback started
  - video_pause: Video paused
  - video_seek: Video position changed
  - download: File downloaded (PDF, etc.)
  - search: User searched for content
  - error: Client-side error occurred

event_category values:
  - navigation: Page/route changes
  - progress: Learning progress events
  - engagement: User interactions
  - assessment: Quiz/test events
  - media: Video/audio events
  - system: Technical events
  - general: Uncategorized
';

-- Daily aggregates for performance (materialized view pattern)
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

  -- Aggregate metrics
  unique_users INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  lesson_starts INTEGER DEFAULT 0,
  lesson_completions INTEGER DEFAULT 0,
  quiz_attempts INTEGER DEFAULT 0,
  quiz_passes INTEGER DEFAULT 0,
  total_time_seconds BIGINT DEFAULT 0,

  -- Calculated at insert time
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One record per day per course
  UNIQUE(date, course_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON analytics_daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_course ON analytics_daily_stats(course_id);

-- Function to aggregate daily stats (call via cron or trigger)
CREATE OR REPLACE FUNCTION aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS INTEGER AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  INSERT INTO analytics_daily_stats (
    date,
    course_id,
    unique_users,
    page_views,
    lesson_starts,
    lesson_completions,
    quiz_attempts,
    quiz_passes,
    total_time_seconds
  )
  SELECT
    target_date,
    course_id,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_type = 'lesson_start') as lesson_starts,
    COUNT(*) FILTER (WHERE event_type = 'lesson_complete') as lesson_completions,
    COUNT(*) FILTER (WHERE event_type = 'quiz_submit') as quiz_attempts,
    COUNT(*) FILTER (WHERE event_type = 'quiz_pass') as quiz_passes,
    COALESCE(SUM((event_data->>'duration_seconds')::integer), 0) as total_time_seconds
  FROM analytics_events
  WHERE created_at >= target_date
    AND created_at < target_date + INTERVAL '1 day'
    AND course_id IS NOT NULL
  GROUP BY course_id
  ON CONFLICT (date, course_id) DO UPDATE SET
    unique_users = EXCLUDED.unique_users,
    page_views = EXCLUDED.page_views,
    lesson_starts = EXCLUDED.lesson_starts,
    lesson_completions = EXCLUDED.lesson_completions,
    quiz_attempts = EXCLUDED.quiz_attempts,
    quiz_passes = EXCLUDED.quiz_passes,
    total_time_seconds = EXCLUDED.total_time_seconds,
    updated_at = NOW();

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected;
END;
$$ LANGUAGE plpgsql;

-- View for real-time course analytics (last 7 days)
CREATE OR REPLACE VIEW course_analytics_7d AS
SELECT
  c.id as course_id,
  c.title as course_title,
  COUNT(DISTINCT ae.user_id) as unique_users,
  COUNT(*) FILTER (WHERE ae.event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') as lesson_starts,
  COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete') as lesson_completions,
  COUNT(*) FILTER (WHERE ae.event_type = 'quiz_submit') as quiz_attempts,
  CASE
    WHEN COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start') > 0
    THEN ROUND(100.0 * COUNT(*) FILTER (WHERE ae.event_type = 'lesson_complete')
         / COUNT(*) FILTER (WHERE ae.event_type = 'lesson_start'), 2)
    ELSE 0
  END as completion_rate
FROM courses c
LEFT JOIN analytics_events ae ON ae.course_id = c.id
  AND ae.created_at >= NOW() - INTERVAL '7 days'
GROUP BY c.id, c.title;

-- View for lesson drop-off analysis (funnel)
CREATE OR REPLACE VIEW lesson_funnel AS
WITH lesson_order AS (
  SELECT
    l.id as lesson_id,
    l.title,
    l.sort_order,
    m.course_id,
    m.sort_order as module_order
  FROM course_lessons l
  JOIN course_modules m ON m.id = l.module_id
),
lesson_progress AS (
  SELECT
    lo.course_id,
    lo.lesson_id,
    lo.title,
    lo.module_order,
    lo.sort_order,
    COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status IN ('in_progress', 'completed')) as started,
    COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed') as completed
  FROM lesson_order lo
  LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = lo.lesson_id
  GROUP BY lo.course_id, lo.lesson_id, lo.title, lo.module_order, lo.sort_order
)
SELECT
  course_id,
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
  LAG(started) OVER (PARTITION BY course_id ORDER BY module_order, sort_order) as prev_started,
  CASE
    WHEN LAG(started) OVER (PARTITION BY course_id ORDER BY module_order, sort_order) > 0
    THEN ROUND(100.0 * started / LAG(started) OVER (PARTITION BY course_id ORDER BY module_order, sort_order), 2)
    ELSE 100
  END as retention_rate
FROM lesson_progress
ORDER BY course_id, module_order, sort_order;

COMMENT ON TABLE analytics_daily_stats IS 'Pre-aggregated daily statistics for performance';
COMMENT ON FUNCTION aggregate_daily_analytics IS 'Aggregates events into daily stats. Run via cron for previous day.';
COMMENT ON VIEW course_analytics_7d IS 'Real-time course analytics for past 7 days';
COMMENT ON VIEW lesson_funnel IS 'Lesson-by-lesson drop-off analysis for courses';
