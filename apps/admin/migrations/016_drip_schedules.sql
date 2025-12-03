-- Migration: 016_drip_schedules.sql
-- Description: Add drip scheduling for timed content release
-- Part of Phase 9: Learning Sequences

-- =====================================================
-- 1. DRIP SCHEDULES TABLE
-- =====================================================
-- Defines when content becomes available to learners

CREATE TABLE IF NOT EXISTS drip_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  -- Target content (either lesson OR module, not both)
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  -- Type of release schedule
  release_type TEXT NOT NULL CHECK (release_type IN (
    'immediate',          -- Available on enrollment
    'fixed_date',         -- Specific calendar date
    'relative_days',      -- N days after enrollment
    'relative_hours',     -- N hours after enrollment
    'after_lesson',       -- After completing another lesson
    'after_module',       -- After completing another module
    'after_enrollment'    -- N days/hours after enrollment date
  )),
  -- For fixed_date type: the exact release date
  release_date TIMESTAMPTZ,
  -- For relative_days type: number of days after enrollment
  relative_days INTEGER CHECK (relative_days IS NULL OR relative_days >= 0),
  -- For relative_hours type: number of hours after enrollment
  relative_hours INTEGER CHECK (relative_hours IS NULL OR relative_hours >= 0),
  -- For after_lesson type: which lesson must be completed
  after_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  -- For after_module type: which module must be completed
  after_module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  -- Optional: time of day to release (for relative schedules)
  release_time TIME,
  -- Optional: timezone for release calculations
  timezone TEXT DEFAULT 'UTC',
  -- Whether this schedule is active
  is_active BOOLEAN DEFAULT true,
  -- Admin notes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure exactly one of lesson_id or module_id is set
  CHECK (
    (lesson_id IS NOT NULL AND module_id IS NULL) OR
    (lesson_id IS NULL AND module_id IS NOT NULL)
  ),
  -- Unique constraint per content item
  UNIQUE(lesson_id),
  UNIQUE(module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drip_course ON drip_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_drip_lesson ON drip_schedules(lesson_id) WHERE lesson_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drip_module ON drip_schedules(module_id) WHERE module_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drip_type ON drip_schedules(release_type);
CREATE INDEX IF NOT EXISTS idx_drip_date ON drip_schedules(release_date) WHERE release_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drip_active ON drip_schedules(is_active) WHERE is_active = true;

-- =====================================================
-- 2. USER DRIP STATUS TABLE (for tracking user-specific release dates)
-- =====================================================
-- Caches calculated release dates per user for performance

CREATE TABLE IF NOT EXISTS user_drip_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- References users table
  drip_schedule_id UUID NOT NULL REFERENCES drip_schedules(id) ON DELETE CASCADE,
  -- Calculated release date for this user
  calculated_release_date TIMESTAMPTZ NOT NULL,
  -- Whether content is currently unlocked
  is_unlocked BOOLEAN DEFAULT false,
  -- When the content was unlocked
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One status per user per schedule
  UNIQUE(user_id, drip_schedule_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_drip_user ON user_drip_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_drip_schedule ON user_drip_status(drip_schedule_id);
CREATE INDEX IF NOT EXISTS idx_user_drip_release ON user_drip_status(calculated_release_date);
CREATE INDEX IF NOT EXISTS idx_user_drip_unlocked ON user_drip_status(is_unlocked);

-- =====================================================
-- 3. COURSE DRIP SETTINGS TABLE
-- =====================================================
-- Course-level drip configuration

CREATE TABLE IF NOT EXISTS course_drip_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  -- Global drip mode for the course
  drip_mode TEXT NOT NULL DEFAULT 'disabled' CHECK (drip_mode IN (
    'disabled',           -- No drip, all content available
    'sequential',         -- Content unlocks in order after completion
    'scheduled',          -- Content follows drip_schedules
    'hybrid'              -- Mix of sequential and scheduled
  )),
  -- Default interval for sequential mode (days between content)
  default_interval_days INTEGER DEFAULT 7 CHECK (default_interval_days >= 0),
  -- Whether to send notifications when content unlocks
  send_unlock_notifications BOOLEAN DEFAULT true,
  -- Email template for unlock notifications
  unlock_email_template TEXT,
  -- Start date for the drip (null = enrollment date)
  drip_start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One settings record per course
  UNIQUE(course_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_course_drip_course ON course_drip_settings(course_id);

-- =====================================================
-- 4. UPDATE TRIGGERS
-- =====================================================

-- Update timestamp trigger for drip_schedules
CREATE OR REPLACE FUNCTION update_drip_schedules_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_drip_schedules_timestamp ON drip_schedules;
CREATE TRIGGER trigger_update_drip_schedules_timestamp
  BEFORE UPDATE ON drip_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_drip_schedules_timestamp();

-- Update timestamp trigger for user_drip_status
CREATE OR REPLACE FUNCTION update_user_drip_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_drip_status_timestamp ON user_drip_status;
CREATE TRIGGER trigger_update_user_drip_status_timestamp
  BEFORE UPDATE ON user_drip_status
  FOR EACH ROW
  EXECUTE FUNCTION update_user_drip_status_timestamp();

-- Update timestamp trigger for course_drip_settings
CREATE OR REPLACE FUNCTION update_course_drip_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_course_drip_settings_timestamp ON course_drip_settings;
CREATE TRIGGER trigger_update_course_drip_settings_timestamp
  BEFORE UPDATE ON course_drip_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_drip_settings_timestamp();

-- =====================================================
-- 5. HELPER FUNCTION: Calculate release date for a user
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_drip_release_date(
  p_drip_schedule_id UUID,
  p_user_id UUID,
  p_enrollment_date TIMESTAMPTZ
) RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_schedule drip_schedules%ROWTYPE;
  v_release_date TIMESTAMPTZ;
  v_completion_date TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_schedule FROM drip_schedules WHERE id = p_drip_schedule_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  CASE v_schedule.release_type
    WHEN 'immediate' THEN
      v_release_date := p_enrollment_date;

    WHEN 'fixed_date' THEN
      v_release_date := v_schedule.release_date;

    WHEN 'relative_days' THEN
      v_release_date := p_enrollment_date + (v_schedule.relative_days || ' days')::INTERVAL;

    WHEN 'relative_hours' THEN
      v_release_date := p_enrollment_date + (v_schedule.relative_hours || ' hours')::INTERVAL;

    WHEN 'after_enrollment' THEN
      IF v_schedule.relative_days IS NOT NULL THEN
        v_release_date := p_enrollment_date + (v_schedule.relative_days || ' days')::INTERVAL;
      ELSIF v_schedule.relative_hours IS NOT NULL THEN
        v_release_date := p_enrollment_date + (v_schedule.relative_hours || ' hours')::INTERVAL;
      ELSE
        v_release_date := p_enrollment_date;
      END IF;

    WHEN 'after_lesson' THEN
      -- Get completion date of the required lesson
      -- Defensive: Check if user_lesson_progress table exists (Phase 10 feature)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_lesson_progress') THEN
        SELECT completed_at INTO v_completion_date
        FROM user_lesson_progress
        WHERE user_id = p_user_id
          AND lesson_id = v_schedule.after_lesson_id
          AND status = 'completed';

        IF v_completion_date IS NOT NULL THEN
          v_release_date := v_completion_date;
        ELSE
          -- Not yet completed, return far future date
          v_release_date := '9999-12-31'::TIMESTAMPTZ;
        END IF;
      ELSE
        -- Progress tracking not yet implemented, return far future date
        v_release_date := '9999-12-31'::TIMESTAMPTZ;
      END IF;

    WHEN 'after_module' THEN
      -- Get when all lessons in the required module were completed
      -- Defensive: Check if user_lesson_progress table exists (Phase 10 feature)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_lesson_progress') THEN
        SELECT MAX(completed_at) INTO v_completion_date
        FROM user_lesson_progress ulp
        JOIN course_lessons cl ON cl.id = ulp.lesson_id
        WHERE ulp.user_id = p_user_id
          AND cl.module_id = v_schedule.after_module_id
          AND ulp.status = 'completed';

        IF v_completion_date IS NOT NULL THEN
          v_release_date := v_completion_date;
        ELSE
          v_release_date := '9999-12-31'::TIMESTAMPTZ;
        END IF;
      ELSE
        -- Progress tracking not yet implemented, return far future date
        v_release_date := '9999-12-31'::TIMESTAMPTZ;
      END IF;

    ELSE
      v_release_date := p_enrollment_date;
  END CASE;

  -- Apply release time if specified
  IF v_schedule.release_time IS NOT NULL AND v_release_date < '9999-01-01'::TIMESTAMPTZ THEN
    v_release_date := DATE(v_release_date) + v_schedule.release_time;
  END IF;

  RETURN v_release_date;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. HELPER FUNCTION: Check if content is available for user
-- =====================================================

CREATE OR REPLACE FUNCTION is_content_available(
  p_lesson_id UUID,
  p_module_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_schedule drip_schedules%ROWTYPE;
  v_is_unlocked BOOLEAN;
BEGIN
  -- Get the drip schedule for this content
  SELECT * INTO v_schedule
  FROM drip_schedules
  WHERE (lesson_id = p_lesson_id OR module_id = p_module_id)
    AND is_active = true;

  -- If no schedule exists, content is available
  IF NOT FOUND THEN
    RETURN true;
  END IF;

  -- Check cached status first (defensive check for table existence)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_drip_status') THEN
    SELECT is_unlocked INTO v_is_unlocked
    FROM user_drip_status
    WHERE user_id = p_user_id
      AND drip_schedule_id = v_schedule.id
      AND is_unlocked = true;

    IF FOUND AND v_is_unlocked THEN
      RETURN true;
    END IF;
  END IF;

  -- If enrollment/progress tracking tables don't exist yet (Phase 10),
  -- allow access for now to prevent blocking content during development
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_lesson_progress') THEN
    RETURN true;
  END IF;

  -- Default: content not yet available (more sophisticated checks would go here)
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE drip_schedules IS 'Defines when content becomes available to learners';
COMMENT ON TABLE user_drip_status IS 'Tracks calculated release dates per user for drip content';
COMMENT ON TABLE course_drip_settings IS 'Course-level drip configuration';

COMMENT ON COLUMN drip_schedules.release_type IS 'Type of release schedule (immediate, fixed_date, relative_days, etc.)';
COMMENT ON COLUMN drip_schedules.timezone IS 'Timezone for release calculations (default UTC)';
COMMENT ON COLUMN course_drip_settings.drip_mode IS 'Global drip mode (disabled, sequential, scheduled, hybrid)';
