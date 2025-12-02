-- Migration 010: Sprints
-- Phase 10 of Project Management MVP
-- Creates sprints table for time-boxed iterations

-- ============================================
-- SPRINTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  velocity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sprints_project_id ON sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON sprints(status);
CREATE INDEX IF NOT EXISTS idx_sprints_project_status ON sprints(project_id, status);
CREATE INDEX IF NOT EXISTS idx_sprints_dates ON sprints(start_date, end_date);

-- Add sprint_id column to tasks table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'sprint_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for sprint tasks queries
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_id ON tasks(sprint_id) WHERE sprint_id IS NOT NULL;

-- Add story_points column to tasks table if not exists (for velocity calculation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'story_points'
  ) THEN
    ALTER TABLE tasks ADD COLUMN story_points INTEGER;
  END IF;
END $$;

-- ============================================
-- TRIGGER: Update sprint updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_sprint_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sprint_updated_at ON sprints;
CREATE TRIGGER trigger_sprint_updated_at
BEFORE UPDATE ON sprints
FOR EACH ROW
EXECUTE FUNCTION update_sprint_timestamp();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE sprints IS 'Time-boxed iterations for project work (Phase 10)';
COMMENT ON COLUMN sprints.project_id IS 'Parent project for this sprint';
COMMENT ON COLUMN sprints.name IS 'Sprint name (e.g., "Sprint 1", "January Sprint")';
COMMENT ON COLUMN sprints.goal IS 'Sprint goal or objective';
COMMENT ON COLUMN sprints.status IS 'Sprint status: planning, active, completed, cancelled';
COMMENT ON COLUMN sprints.velocity IS 'Completed story points (calculated after sprint)';
COMMENT ON COLUMN tasks.sprint_id IS 'Sprint this task belongs to (optional)';
COMMENT ON COLUMN tasks.story_points IS 'Story points for velocity tracking';
