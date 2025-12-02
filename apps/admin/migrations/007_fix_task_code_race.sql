-- Migration: Fix Race Conditions and Missing Constraints
-- Part of Project Management MVP v3.0 - Bug Fixes
-- Created: 2025-12-02
-- Fixes: Race condition in task code generation, missing ON DELETE, trigger improvements, composite indexes

-- ============================================
-- BLOCKER 1: Fix Race Condition in Task Code Generation
-- ============================================

-- Replace generate_task_code function with advisory lock for atomic task code generation
CREATE OR REPLACE FUNCTION generate_task_code()
RETURNS TRIGGER AS $$
DECLARE
  project_prefix VARCHAR(10);
  task_number INT;
  lock_key BIGINT;
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

  -- Create a lock key from the prefix (convert to bigint for pg_advisory_xact_lock)
  -- Use hashtext to create a consistent integer from the prefix
  lock_key := hashtext(project_prefix);

  -- Acquire advisory lock for this prefix (released at transaction end)
  -- This ensures only one transaction can generate a code for this prefix at a time
  PERFORM pg_advisory_xact_lock(lock_key);

  -- Get next number for this prefix (now safe from race conditions)
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

-- ============================================
-- BLOCKER 2: Add ON DELETE SET NULL to completed_by_id
-- ============================================

-- Drop existing constraint if it exists (without CASCADE rule)
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_completed_by_id_fkey;

-- Add constraint with proper ON DELETE SET NULL
ALTER TABLE tasks ADD CONSTRAINT tasks_completed_by_id_fkey
  FOREIGN KEY (completed_by_id)
  REFERENCES admin_users(id)
  ON DELETE SET NULL;

-- ============================================
-- BLOCKER 3: Fix Trigger to Use completed_by_name for Completions
-- ============================================

CREATE OR REPLACE FUNCTION trigger_log_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  log_user_name VARCHAR(255);
  log_user_email VARCHAR(255);
BEGIN
  -- Determine which user fields to use for logging
  -- For completion events, prefer completed_by_* fields
  IF NEW.is_done = true AND (OLD.is_done IS NULL OR OLD.is_done = false) THEN
    log_user_name := COALESCE(NEW.completed_by_name, NEW.updated_by_name, 'System');
    log_user_email := COALESCE(NEW.completed_by_email, NEW.updated_by_email);
  ELSE
    log_user_name := COALESCE(NEW.updated_by_name, 'System');
    log_user_email := NEW.updated_by_email;
  END IF;

  -- Log when task is marked done
  IF NEW.is_done = true AND (OLD.is_done IS NULL OR OLD.is_done = false) THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      log_user_name, log_user_email,
      'completed', 'false', 'true'
    );
  -- Log when task is reopened
  ELSIF NEW.is_done = false AND OLD.is_done = true THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      log_user_name, log_user_email,
      'reopened', 'true', 'false'
    );
  -- Log status changes
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO task_activities (
      task_id, project_id, user_name, user_email,
      activity_type, field_changed, old_value, new_value
    ) VALUES (
      NEW.id, NEW.project_id,
      log_user_name, log_user_email,
      'status_changed', 'status', OLD.status, NEW.status
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger (function replacement is not enough)
DROP TRIGGER IF EXISTS trigger_task_activity_log ON tasks;
CREATE TRIGGER trigger_task_activity_log
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_task_completion();

-- ============================================
-- HIGH RISK 4: Add Composite Indexes for Activity Queries
-- ============================================

-- Composite index for project activity queries ordered by time
CREATE INDEX IF NOT EXISTS idx_project_activities_project_created
  ON project_activities(project_id, created_at DESC);

-- Composite index for task activity queries by project ordered by time
CREATE INDEX IF NOT EXISTS idx_task_activities_project_created
  ON task_activities(project_id, created_at DESC);

-- Composite index for task activity queries by task ordered by time
CREATE INDEX IF NOT EXISTS idx_task_activities_task_created
  ON task_activities(task_id, created_at DESC);

-- ============================================
-- VERIFICATION QUERIES (for manual testing)
-- ============================================

/*
-- Test 1: Verify advisory lock prevents race conditions
-- Run these in two separate psql sessions simultaneously:
BEGIN;
INSERT INTO tasks (project_id, title) VALUES ('<project-uuid>', 'Test Task 1');
-- Check task_code
SELECT task_code FROM tasks WHERE title = 'Test Task 1';
COMMIT;

-- Test 2: Verify ON DELETE SET NULL works
-- Delete a user who completed tasks:
DELETE FROM admin_users WHERE id = '<user-uuid>';
-- Check that completed_by_id is now NULL:
SELECT id, task_code, completed_by_id, completed_by_name FROM tasks WHERE completed_by_name = '<deleted-user-name>';

-- Test 3: Verify trigger uses completed_by_name
UPDATE tasks SET is_done = true, completed_by_name = 'Test User', completed_by_email = 'test@example.com' WHERE id = '<task-uuid>';
SELECT user_name, user_email, activity_type FROM task_activities WHERE task_id = '<task-uuid>' ORDER BY created_at DESC LIMIT 1;

-- Test 4: Verify composite indexes exist
SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('project_activities', 'task_activities') ORDER BY indexname;
*/
