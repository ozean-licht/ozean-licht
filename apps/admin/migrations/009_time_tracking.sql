-- Migration 009: Time Tracking
-- Phase 9 of Project Management MVP
-- Creates task_time_entries table for logging time spent on tasks

-- ============================================
-- TASK TIME ENTRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS task_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  work_date DATE DEFAULT CURRENT_DATE,
  is_billable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON task_time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON task_time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_work_date ON task_time_entries(work_date);
CREATE INDEX IF NOT EXISTS idx_time_entries_created_at ON task_time_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_work_date ON task_time_entries(task_id, work_date DESC);

-- Add estimated_hours and actual_hours columns to tasks table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'estimated_hours'
  ) THEN
    ALTER TABLE tasks ADD COLUMN estimated_hours DECIMAL(6,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'actual_hours'
  ) THEN
    ALTER TABLE tasks ADD COLUMN actual_hours DECIMAL(6,2) DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- TRIGGER: Update task actual_hours on time entry changes
-- ============================================

CREATE OR REPLACE FUNCTION update_task_actual_hours()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the task's actual_hours based on sum of time entries
  IF TG_OP = 'DELETE' THEN
    UPDATE tasks
    SET actual_hours = COALESCE((
      SELECT SUM(duration_minutes) / 60.0
      FROM task_time_entries
      WHERE task_id = OLD.task_id
    ), 0),
    updated_at = NOW()
    WHERE id = OLD.task_id;
    RETURN OLD;
  ELSE
    UPDATE tasks
    SET actual_hours = COALESCE((
      SELECT SUM(duration_minutes) / 60.0
      FROM task_time_entries
      WHERE task_id = NEW.task_id
    ), 0),
    updated_at = NOW()
    WHERE id = NEW.task_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS trigger_update_task_actual_hours ON task_time_entries;
CREATE TRIGGER trigger_update_task_actual_hours
AFTER INSERT OR UPDATE OR DELETE ON task_time_entries
FOR EACH ROW
EXECUTE FUNCTION update_task_actual_hours();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE task_time_entries IS 'Time tracking entries for tasks';
COMMENT ON COLUMN task_time_entries.duration_minutes IS 'Duration in minutes (required, must be > 0)';
COMMENT ON COLUMN task_time_entries.work_date IS 'Date the work was performed (defaults to current date)';
COMMENT ON COLUMN task_time_entries.is_billable IS 'Whether this time is billable to client';
COMMENT ON COLUMN tasks.estimated_hours IS 'Estimated hours to complete the task';
COMMENT ON COLUMN tasks.actual_hours IS 'Actual hours logged (auto-calculated from time entries)';
