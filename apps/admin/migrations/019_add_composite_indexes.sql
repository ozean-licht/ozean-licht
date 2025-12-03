-- Phase 10: Additional Composite Indexes for Performance
-- Adds composite indexes for common query patterns identified in Phase 10 review

-- User lesson progress: Common queries by user + course
CREATE INDEX IF NOT EXISTS idx_progress_user_course
  ON user_lesson_progress(user_id, course_id);

-- User lesson progress: Time-based queries with course filter
CREATE INDEX IF NOT EXISTS idx_progress_course_created
  ON user_lesson_progress(course_id, created_at DESC);

-- User lesson progress: Status + course for filtering completed lessons
CREATE INDEX IF NOT EXISTS idx_progress_course_status
  ON user_lesson_progress(course_id, status)
  WHERE status = 'completed';

-- Course enrollments: User + status for filtering active enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_status
  ON course_enrollments(user_id, status);

-- Course enrollments: Course + status for admin views
CREATE INDEX IF NOT EXISTS idx_enrollments_course_status
  ON course_enrollments(course_id, status);

-- Course enrollments: Time-based queries for recently accessed
CREATE INDEX IF NOT EXISTS idx_enrollments_last_accessed
  ON course_enrollments(last_accessed_at DESC NULLS LAST)
  WHERE last_accessed_at IS NOT NULL;

-- Analytics events: User + time for user activity reports
CREATE INDEX IF NOT EXISTS idx_events_user_time
  ON analytics_events(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Analytics events: Type + course for event-specific course reports
CREATE INDEX IF NOT EXISTS idx_events_type_course
  ON analytics_events(event_type, course_id)
  WHERE course_id IS NOT NULL;

-- Analytics daily stats: Date range queries by course
CREATE INDEX IF NOT EXISTS idx_daily_stats_course_date
  ON analytics_daily_stats(course_id, date DESC);

COMMENT ON INDEX idx_progress_user_course IS 'Optimize queries for user progress in a specific course';
COMMENT ON INDEX idx_progress_course_created IS 'Optimize time-series queries for course progress';
COMMENT ON INDEX idx_progress_course_status IS 'Optimize queries for completed lessons by course';
COMMENT ON INDEX idx_enrollments_user_status IS 'Optimize user enrollment status queries';
COMMENT ON INDEX idx_enrollments_course_status IS 'Optimize course enrollment admin queries';
COMMENT ON INDEX idx_enrollments_last_accessed IS 'Optimize recently accessed course queries';
COMMENT ON INDEX idx_events_user_time IS 'Optimize user activity timeline queries';
COMMENT ON INDEX idx_events_type_course IS 'Optimize event-type specific course analytics';
COMMENT ON INDEX idx_daily_stats_course_date IS 'Optimize date-range queries for daily stats';
