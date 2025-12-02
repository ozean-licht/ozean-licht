-- Migration: 030_create_project_tables_standalone.sql
-- Description: Create standalone project management tables for Airtable migration
-- Target Database: ozean-licht-db
-- Created: 2025-12-01
--
-- NOTE: Standalone version - no FK references to users table
-- User references stored as TEXT (Airtable record IDs) in metadata

-- ============================================================================
-- Process Templates table (must be created before projects for FK reference)
-- ============================================================================
CREATE TABLE IF NOT EXISTS process_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT,  -- Kurs, Post, Blog, Love Letter, Video, Short, Kongress, Interview
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'draft')),
    task_order INTEGER DEFAULT 0,
    offset_days_to_anchor INTEGER DEFAULT 0,  -- Days relative to anchor point
    duration_days INTEGER DEFAULT 1,
    is_anchor_point BOOLEAN DEFAULT FALSE,
    assigned_to_ids JSONB DEFAULT '[]',  -- Airtable team record IDs
    linked_lightguides JSONB DEFAULT '[]',  -- Linked task guides
    linked_anchor JSONB DEFAULT '[]',
    linked_set JSONB DEFAULT '[]',
    usage_count INTEGER DEFAULT 0,
    created_by_name TEXT,
    created_by_email TEXT,
    updated_by_name TEXT,
    updated_by_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    airtable_created_at TIMESTAMPTZ,
    airtable_updated_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Projects table
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    project_type TEXT,  -- Einzigartig, Kurs, Post, Blog, Love Letter, Video, Short, Kongress, Interview
    interval_type TEXT,  -- Einmalig (one-time), Fortlaufend (recurring)
    status TEXT DEFAULT 'planning' CHECK (status IN (
        'planning', 'active', 'completed', 'paused', 'cancelled', 'todo', 'not_started'
    )),
    progress_percent DECIMAL(5,2) DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    tasks_done INTEGER DEFAULT 0,
    used_template BOOLEAN DEFAULT FALSE,

    -- Dates
    start_date DATE,
    target_date DATE,
    day_of_publish TIMESTAMPTZ,
    duration_days INTEGER,

    -- Calculated dates from tasks (stored for convenience)
    auto_start TIMESTAMPTZ,
    auto_target TIMESTAMPTZ,
    start_day_calculated TIMESTAMPTZ,
    target_day_calculated TIMESTAMPTZ,
    event_start TIMESTAMPTZ,
    event_finish TIMESTAMPTZ,

    -- Linked records (stored as Airtable IDs for reference)
    assignee_ids JSONB DEFAULT '[]',
    linked_task_ids JSONB DEFAULT '[]',
    linked_event_ids JSONB DEFAULT '[]',
    linked_course_ids JSONB DEFAULT '[]',
    linked_video_ids JSONB DEFAULT '[]',
    linked_short_ids JSONB DEFAULT '[]',

    -- Audit
    created_by_name TEXT,
    created_by_email TEXT,
    updated_by_name TEXT,
    updated_by_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    airtable_created_at TIMESTAMPTZ,
    airtable_updated_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Tasks table
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    airtable_auto_number INTEGER,  -- Original Airtable auto-increment ID

    -- Core fields
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN (
        'todo', 'in_progress', 'done', 'completed', 'overdue', 'planned', 'paused', 'blocked'
    )),
    is_done BOOLEAN DEFAULT FALSE,
    task_order INTEGER DEFAULT 0,

    -- Dates
    start_date DATE,
    target_date DATE,
    finished_at TIMESTAMPTZ,
    duration_days INTEGER,
    offset_days_to_anchor INTEGER,

    -- Calculated dates
    day_of_publish TIMESTAMPTZ,  -- From linked project
    auto_start TIMESTAMPTZ,
    auto_finished TIMESTAMPTZ,

    -- Linked records (stored as Airtable IDs)
    project_airtable_id TEXT,  -- Main link to project
    project_id UUID,  -- Will be populated after projects are migrated
    assignee_ids JSONB DEFAULT '[]',
    milestone_ids JSONB DEFAULT '[]',  -- Meilensteine
    department_ids JSONB DEFAULT '[]',  -- Abteilung

    -- Audit
    created_by_name TEXT,
    created_by_email TEXT,
    updated_by_name TEXT,
    updated_by_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    airtable_created_at TIMESTAMPTZ,
    airtable_updated_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Process templates indexes
CREATE INDEX IF NOT EXISTS idx_process_templates_airtable_id ON process_templates(airtable_id);
CREATE INDEX IF NOT EXISTS idx_process_templates_type ON process_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_process_templates_status ON process_templates(status);
CREATE INDEX IF NOT EXISTS idx_process_templates_task_order ON process_templates(task_order);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_airtable_id ON projects(airtable_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_interval_type ON projects(interval_type);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_target_date ON projects(target_date);
CREATE INDEX IF NOT EXISTS idx_projects_day_of_publish ON projects(day_of_publish);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_airtable_id ON tasks(airtable_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_airtable_id ON tasks(project_airtable_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_is_done ON tasks(is_done);
CREATE INDEX IF NOT EXISTS idx_tasks_task_order ON tasks(task_order);
CREATE INDEX IF NOT EXISTS idx_tasks_start_date ON tasks(start_date);
CREATE INDEX IF NOT EXISTS idx_tasks_target_date ON tasks(target_date);
CREATE INDEX IF NOT EXISTS idx_tasks_airtable_auto_number ON tasks(airtable_auto_number);
CREATE INDEX IF NOT EXISTS idx_tasks_name ON tasks(name);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_project_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS process_templates_updated_at ON process_templates;
CREATE TRIGGER process_templates_updated_at
    BEFORE UPDATE ON process_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_project_tables_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_project_tables_updated_at();

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_project_tables_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE process_templates IS 'Reusable task templates from Airtable process_templates table';
COMMENT ON TABLE projects IS 'Projects from Airtable projects table - content production workflow';
COMMENT ON TABLE tasks IS 'Tasks from Airtable tasks table - individual work items linked to projects';

COMMENT ON COLUMN tasks.airtable_auto_number IS 'Original auto-increment ID from Airtable for deduplication';
COMMENT ON COLUMN tasks.project_airtable_id IS 'Airtable record ID of linked project for migration linking';
COMMENT ON COLUMN tasks.project_id IS 'UUID FK to projects table (populated post-migration)';
