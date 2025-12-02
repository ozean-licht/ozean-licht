-- Migration: Phase 5 & 6 Polish - Task IDs, Activity History, UX Improvements
-- Part of Project Management MVP v3.0
-- Created: 2025-12-02

-- ============================================
-- PHASE 5.1: TASK CODE SYSTEM
-- Short, human-readable task identifiers
-- ============================================

-- Add task_code column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_code VARCHAR(20);

-- Add completed_by tracking
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_by_id UUID REFERENCES admin_users(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_by_name VARCHAR(255);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_by_email VARCHAR(255);

-- Create sequence for task numbers per project
CREATE SEQUENCE IF NOT EXISTS task_code_seq START 1;

-- Function to generate task code
-- Format: PROJ-001, where PROJ is first 4 chars of project name (uppercase) or "TASK" if no project
CREATE OR REPLACE FUNCTION generate_task_code()
RETURNS TRIGGER AS $$
DECLARE
  project_prefix VARCHAR(10);
  task_number INT;
BEGIN
  -- Get project prefix or default to "TASK"
  IF NEW.project_id IS NOT NULL THEN
    SELECT UPPER(SUBSTRING(REGEXP_REPLACE(title, '[^A-Za-z0-9]', '', 'g'), 1, 4))
    INTO project_prefix
    FROM projects
    WHERE id = NEW.project_id;

    IF project_prefix IS NULL OR LENGTH(project_prefix) < 2 THEN
      project_prefix := 'PROJ';
    END IF;
  ELSE
    project_prefix := 'TASK';
  END IF;

  -- Get next number for this prefix
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(task_code FROM LENGTH(project_prefix) + 2) AS INT)
  ), 0) + 1
  INTO task_number
  FROM tasks
  WHERE task_code LIKE project_prefix || '-%';

  -- Generate code
  NEW.task_code := project_prefix || '-' || LPAD(task_number::TEXT, 3, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating task codes
DROP TRIGGER IF EXISTS trigger_generate_task_code ON tasks;
CREATE TRIGGER trigger_generate_task_code
  BEFORE INSERT ON tasks
  FOR EACH ROW
  WHEN (NEW.task_code IS NULL)
  EXECUTE FUNCTION generate_task_code();

-- Backfill existing tasks without codes
DO $$
DECLARE
  task_record RECORD;
  project_prefix VARCHAR(10);
  task_number INT;
  new_code VARCHAR(20);
BEGIN
  FOR task_record IN
    SELECT t.id, t.project_id, p.title as project_title
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.task_code IS NULL
    ORDER BY t.created_at ASC
  LOOP
    -- Get project prefix
    IF task_record.project_id IS NOT NULL AND task_record.project_title IS NOT NULL THEN
      project_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(task_record.project_title, '[^A-Za-z0-9]', '', 'g'), 1, 4));
      IF LENGTH(project_prefix) < 2 THEN
        project_prefix := 'PROJ';
      END IF;
    ELSE
      project_prefix := 'TASK';
    END IF;

    -- Get next number
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(task_code FROM LENGTH(project_prefix) + 2) AS INT)
    ), 0) + 1
    INTO task_number
    FROM tasks
    WHERE task_code LIKE project_prefix || '-%';

    -- Generate and update
    new_code := project_prefix || '-' || LPAD(task_number::TEXT, 3, '0');

    UPDATE tasks SET task_code = new_code WHERE id = task_record.id;
  END LOOP;
END $$;

-- Create index for fast task_code lookups
CREATE INDEX IF NOT EXISTS idx_tasks_task_code ON tasks(task_code);

-- ============================================
-- PHASE 5.2: ACTIVITY HISTORY
-- Track changes to projects and tasks
-- ============================================

-- Project activity log
CREATE TABLE IF NOT EXISTS project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL, -- created, updated, status_changed, task_added, task_completed, commented, archived
  field_changed VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Task activity log
CREATE TABLE IF NOT EXISTS task_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL, -- created, updated, status_changed, completed, reopened, assigned, unassigned, commented, due_date_changed
  field_changed VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for activity tables
CREATE INDEX IF NOT EXISTS idx_project_activities_project ON project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_created ON project_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_activities_task ON task_activities(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activities_project ON task_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_task_activities_created ON task_activities(created_at DESC);

-- ============================================
-- PHASE 5.3: HELPER FUNCTIONS
-- ============================================

-- Function to log project activity
CREATE OR REPLACE FUNCTION log_project_activity(
  p_project_id UUID,
  p_user_id UUID,
  p_user_name VARCHAR,
  p_user_email VARCHAR,
  p_activity_type VARCHAR,
  p_field_changed VARCHAR DEFAULT NULL,
  p_old_value TEXT DEFAULT NULL,
  p_new_value TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO project_activities (
    project_id, user_id, user_name, user_email,
    activity_type, field_changed, old_value, new_value, metadata
  ) VALUES (
    p_project_id, p_user_id, p_user_name, p_user_email,
    p_activity_type, p_field_changed, p_old_value, p_new_value, p_metadata
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log task activity
CREATE OR REPLACE FUNCTION log_task_activity(
  p_task_id UUID,
  p_project_id UUID,
  p_user_id UUID,
  p_user_name VARCHAR,
  p_user_email VARCHAR,
  p_activity_type VARCHAR,
  p_field_changed VARCHAR DEFAULT NULL,
  p_old_value TEXT DEFAULT NULL,
  p_new_value TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO task_activities (
    task_id, project_id, user_id, user_name, user_email,
    activity_type, field_changed, old_value, new_value, metadata
  ) VALUES (
    p_task_id, p_project_id, p_user_id, p_user_name, p_user_email,
    p_activity_type, p_field_changed, p_old_value, p_new_value, p_metadata
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-log task completions
CREATE OR REPLACE FUNCTION trigger_log_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when task is marked done
  IF NEW.is_done = true AND (OLD.is_done IS NULL OR OLD.is_done = false) THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      COALESCE(NEW.updated_by_name, 'System'),
      NEW.updated_by_email,
      'completed', 'false', 'true'
    );
  -- Log when task is reopened
  ELSIF NEW.is_done = false AND OLD.is_done = true THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      COALESCE(NEW.updated_by_name, 'System'),
      NEW.updated_by_email,
      'reopened', 'true', 'false'
    );
  -- Log status changes
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, field_changed, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      COALESCE(NEW.updated_by_name, 'System'),
      NEW.updated_by_email,
      'status_changed', 'status', OLD.status, NEW.status
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_task_activity_log ON tasks;
CREATE TRIGGER trigger_task_activity_log
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_task_completion();

-- ============================================
-- PHASE 5.4: PROJECT CODE SYSTEM (Optional)
-- ============================================

-- Add project_code column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_code VARCHAR(20);

-- Backfill project codes
DO $$
DECLARE
  proj_record RECORD;
  project_prefix VARCHAR(10);
  proj_number INT;
  new_code VARCHAR(20);
BEGIN
  FOR proj_record IN
    SELECT id, title
    FROM projects
    WHERE project_code IS NULL
    ORDER BY created_at ASC
  LOOP
    -- Get prefix from title
    project_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(proj_record.title, '[^A-Za-z0-9]', '', 'g'), 1, 4));
    IF LENGTH(project_prefix) < 2 THEN
      project_prefix := 'PROJ';
    END IF;

    -- Get next number
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(project_code FROM LENGTH(project_prefix) + 2) AS INT)
    ), 0) + 1
    INTO proj_number
    FROM projects
    WHERE project_code LIKE project_prefix || '-%';

    -- Generate and update
    new_code := project_prefix || '-' || LPAD(proj_number::TEXT, 3, '0');

    UPDATE projects SET project_code = new_code WHERE id = proj_record.id;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_project_code ON projects(project_code);

-- ============================================
-- CLEANUP / ROLLBACK (for development)
-- ============================================
/*
DROP TRIGGER IF EXISTS trigger_task_activity_log ON tasks;
DROP TRIGGER IF EXISTS trigger_generate_task_code ON tasks;
DROP FUNCTION IF EXISTS trigger_log_task_completion();
DROP FUNCTION IF EXISTS log_task_activity(UUID, UUID, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS log_project_activity(UUID, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS generate_task_code();
DROP TABLE IF EXISTS task_activities;
DROP TABLE IF EXISTS project_activities;
ALTER TABLE tasks DROP COLUMN IF EXISTS task_code;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_by_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_by_name;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_by_email;
ALTER TABLE projects DROP COLUMN IF EXISTS project_code;
DROP SEQUENCE IF EXISTS task_code_seq;
*/
