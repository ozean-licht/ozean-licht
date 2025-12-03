-- Phase 10: User Lesson Progress Tracking
-- Tracks individual user progress through course lessons
-- Part of Advanced Course Builder feature

-- User lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- References users from auth system
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Progress state
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),

  -- Time tracking
  time_spent_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,  -- For video/audio resume

  -- Quiz/assessment results
  quiz_score INTEGER CHECK (quiz_score IS NULL OR (quiz_score BETWEEN 0 AND 100)),
  quiz_attempts INTEGER DEFAULT 0,
  quiz_passed BOOLEAN DEFAULT false,

  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One progress record per user per lesson
  UNIQUE(user_id, lesson_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON user_lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON user_lesson_progress(completed_at) WHERE completed_at IS NOT NULL;

-- Course enrollment tracking (user enrolled in course)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- References users from auth system
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Enrollment state
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'expired')),

  -- Progress summary (cached from lesson progress)
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  lessons_completed INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,

  -- Completion data
  certificate_issued BOOLEAN DEFAULT false,
  certificate_id UUID,  -- Future: link to issued_certificates table

  -- Timestamps
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,  -- For time-limited access
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One enrollment per user per course
  UNIQUE(user_id, course_id)
);

-- Indexes for enrollment queries
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_completed ON course_enrollments(completed_at) WHERE completed_at IS NOT NULL;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_user_lesson_progress_updated_at ON user_lesson_progress;
CREATE TRIGGER update_user_lesson_progress_updated_at
  BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_progress_updated_at();

DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_progress_updated_at();

-- View for course completion stats
CREATE OR REPLACE VIEW course_completion_stats AS
SELECT
  c.id as course_id,
  c.title as course_title,
  c.status as course_status,
  COUNT(DISTINCT ce.user_id) as total_enrollments,
  COUNT(DISTINCT ce.user_id) FILTER (WHERE ce.status = 'active') as active_enrollments,
  COUNT(DISTINCT ce.user_id) FILTER (WHERE ce.status = 'completed') as completed_enrollments,
  AVG(ce.progress_percent) FILTER (WHERE ce.status IN ('active', 'completed')) as avg_progress,
  AVG(ce.total_time_seconds) FILTER (WHERE ce.total_time_seconds > 0) as avg_time_seconds
FROM courses c
LEFT JOIN course_enrollments ce ON ce.course_id = c.id
GROUP BY c.id, c.title, c.status;

-- View for lesson engagement
CREATE OR REPLACE VIEW lesson_engagement_stats AS
SELECT
  l.id as lesson_id,
  l.title as lesson_title,
  l.content_type,
  m.course_id,
  COUNT(DISTINCT ulp.user_id) as total_views,
  COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed') as completions,
  AVG(ulp.time_spent_seconds) FILTER (WHERE ulp.time_spent_seconds > 0) as avg_time_seconds,
  AVG(ulp.quiz_score) FILTER (WHERE ulp.quiz_score IS NOT NULL) as avg_quiz_score,
  CASE
    WHEN COUNT(DISTINCT ulp.user_id) > 0
    THEN ROUND(100.0 * COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed') / COUNT(DISTINCT ulp.user_id), 2)
    ELSE 0
  END as completion_rate
FROM course_lessons l
JOIN course_modules m ON m.id = l.module_id
LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id
GROUP BY l.id, l.title, l.content_type, m.course_id;

COMMENT ON TABLE user_lesson_progress IS 'Tracks individual user progress through course lessons';
COMMENT ON TABLE course_enrollments IS 'Tracks user enrollments in courses with aggregated progress';
COMMENT ON VIEW course_completion_stats IS 'Aggregated course completion statistics';
COMMENT ON VIEW lesson_engagement_stats IS 'Per-lesson engagement metrics';
