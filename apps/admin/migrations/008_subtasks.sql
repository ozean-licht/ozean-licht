-- Migration 008: Subtasks Support
-- Phase 8: Add parent_task_id for hierarchical task breakdown

-- ==============================================================================
-- UP MIGRATION
-- ==============================================================================

-- Add parent_task_id column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;

-- Create index for efficient subtask queries
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;

-- ==============================================================================
-- DOWN MIGRATION (commented out, run manually if needed)
-- ==============================================================================

-- DROP INDEX IF EXISTS idx_tasks_parent_task_id;
-- ALTER TABLE tasks DROP COLUMN IF EXISTS parent_task_id;
