-- Migration: 012_create_project_tables.sql
-- Description: Create project management tables (projects, tasks, templates)
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    project_code TEXT UNIQUE,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
    project_type TEXT,
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    budget_cents INTEGER,
    currency TEXT DEFAULT 'EUR',
    actual_cost_cents INTEGER DEFAULT 0,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    owner_id UUID REFERENCES users(id),
    team_members JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    template_id UUID,
    parent_project_id UUID REFERENCES projects(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done', 'blocked', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
    task_type TEXT DEFAULT 'task' CHECK (task_type IN ('task', 'bug', 'feature', 'improvement', 'documentation', 'research')),
    assignee_id UUID REFERENCES users(id),
    reporter_id UUID REFERENCES users(id),
    due_date DATE,
    start_date DATE,
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2) DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    parent_task_id UUID REFERENCES tasks(id),
    depends_on JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    labels JSONB DEFAULT '[]',
    story_points INTEGER,
    sprint_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Process templates table
CREATE TABLE IF NOT EXISTS process_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    template_type TEXT DEFAULT 'project' CHECK (template_type IN ('project', 'workflow', 'checklist', 'sprint')),
    steps JSONB NOT NULL DEFAULT '[]',
    default_assignees JSONB DEFAULT '{}',
    estimated_duration_hours DECIMAL(6,2),
    estimated_duration_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Task comments table
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES task_comments(id),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size_bytes INTEGER,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task time entries table
CREATE TABLE IF NOT EXISTS task_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    is_billable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task activity log
CREATE TABLE IF NOT EXISTS task_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'created', 'updated', 'status_changed', 'assigned', 'unassigned',
        'commented', 'attachment_added', 'attachment_removed',
        'due_date_changed', 'priority_changed', 'time_logged'
    )),
    old_value TEXT,
    new_value TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sprints table (for agile workflows)
CREATE TABLE IF NOT EXISTS sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    velocity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for project tables
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_entity_scope ON projects(entity_scope);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON projects(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_airtable_id ON projects(airtable_id);
CREATE INDEX IF NOT EXISTS idx_projects_parent ON projects(parent_project_id);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_airtable_id ON tasks(airtable_id);
CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(project_id, order_index);

CREATE INDEX IF NOT EXISTS idx_templates_category ON process_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_type ON process_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_active ON process_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_entity_scope ON process_templates(entity_scope);
CREATE INDEX IF NOT EXISTS idx_templates_airtable_id ON process_templates(airtable_id);

CREATE INDEX IF NOT EXISTS idx_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON task_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attachments_task ON task_attachments(task_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_task ON task_time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON task_time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON task_time_entries(started_at);

CREATE INDEX IF NOT EXISTS idx_task_activity_task ON task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_user ON task_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_type ON task_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_task_activity_created ON task_activity(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sprints_project ON sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON sprints(status);

-- Add foreign key for tasks.sprint_id after sprints table exists
ALTER TABLE tasks
    DROP CONSTRAINT IF EXISTS tasks_sprint_id_fkey;
ALTER TABLE tasks
    ADD CONSTRAINT tasks_sprint_id_fkey
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL;

-- Add foreign key for projects.template_id after process_templates exists
ALTER TABLE projects
    DROP CONSTRAINT IF EXISTS projects_template_id_fkey;
ALTER TABLE projects
    ADD CONSTRAINT projects_template_id_fkey
    FOREIGN KEY (template_id) REFERENCES process_templates(id) ON DELETE SET NULL;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS templates_updated_at ON process_templates;
CREATE TRIGGER templates_updated_at
    BEFORE UPDATE ON process_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS comments_updated_at ON task_comments;
CREATE TRIGGER comments_updated_at
    BEFORE UPDATE ON task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS sprints_updated_at ON sprints;
CREATE TRIGGER sprints_updated_at
    BEFORE UPDATE ON sprints
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- Function to generate project code
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS TEXT AS $$
DECLARE
    seq_num INTEGER;
    project_code TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(project_code FROM 5) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM projects
    WHERE project_code LIKE 'PRJ-%';

    project_code := 'PRJ-' || LPAD(seq_num::TEXT, 4, '0');

    RETURN project_code;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Project management - top level containers for work';
COMMENT ON TABLE tasks IS 'Individual tasks within projects';
COMMENT ON TABLE process_templates IS 'Reusable templates for creating projects or workflows';
COMMENT ON TABLE task_comments IS 'Discussion threads on tasks';
COMMENT ON TABLE task_attachments IS 'Files attached to tasks';
COMMENT ON TABLE task_time_entries IS 'Time tracking for tasks';
COMMENT ON TABLE task_activity IS 'Activity log for task changes';
COMMENT ON TABLE sprints IS 'Agile sprint management';
COMMENT ON COLUMN projects.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN tasks.airtable_id IS 'Original Airtable record ID for migration tracking';
