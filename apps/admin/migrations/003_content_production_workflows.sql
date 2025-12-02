-- Migration: Content Production Workflows
-- Part of Project Management MVP v2.0 - Content Production Focus
-- Created: 2025-12-02

-- ============================================
-- PHASE 1.1: WORKFLOW DEFINITIONS & STATUSES
-- ============================================

-- Workflow definitions (e.g., "Video Production", "Course Creation")
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  project_type VARCHAR(50) NOT NULL,  -- video, course, blog, social, general
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflow statuses (flexible statuses per workflow)
CREATE TABLE IF NOT EXISTS workflow_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#0ec2bc',  -- hex color
  icon VARCHAR(50),  -- lucide icon name
  order_index INT NOT NULL DEFAULT 0,
  is_start_state BOOLEAN DEFAULT false,
  is_done_state BOOLEAN DEFAULT false,
  is_cancelled_state BOOLEAN DEFAULT false,
  auto_progress_to UUID REFERENCES workflow_statuses(id),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(workflow_id, slug)
);

-- Workflow transitions (defines allowed status transitions)
CREATE TABLE IF NOT EXISTS workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  from_status_id UUID NOT NULL REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  to_status_id UUID NOT NULL REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  requires_approval BOOLEAN DEFAULT false,
  required_role_id UUID,  -- role required to make this transition

  UNIQUE(workflow_id, from_status_id, to_status_id)
);

-- Indexes for workflow tables
CREATE INDEX IF NOT EXISTS idx_workflow_statuses_workflow ON workflow_statuses(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_statuses_order ON workflow_statuses(workflow_id, order_index);
CREATE INDEX IF NOT EXISTS idx_workflow_transitions_workflow ON workflow_transitions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_definitions_type ON workflow_definitions(project_type);

-- ============================================
-- PHASE 1.1: CONTENT TYPES
-- ============================================

-- Content types (Video, Blog, Course, Meditation, etc.)
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  default_workflow_id UUID REFERENCES workflow_definitions(id),
  default_checklist_template_id UUID,  -- will reference checklist_templates
  platforms VARCHAR[] DEFAULT '{}',  -- ['youtube', 'website', 'newsletter']
  estimated_duration_days INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for content types
CREATE INDEX IF NOT EXISTS idx_content_types_slug ON content_types(slug);

-- ============================================
-- PHASE 1.1: PROJECT ROLES
-- ============================================

-- Project roles (Editor, Voice Artist, Translator, Reviewer, etc.)
CREATE TABLE IF NOT EXISTS project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT '#0ec2bc',
  icon VARCHAR(50),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for project roles
CREATE INDEX IF NOT EXISTS idx_project_roles_slug ON project_roles(slug);
CREATE INDEX IF NOT EXISTS idx_project_roles_active ON project_roles(is_active);

-- ============================================
-- PHASE 1.1: CONTENT ITEMS
-- ============================================

-- Content items (the actual deliverables linked to tasks)
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_type_id UUID NOT NULL REFERENCES content_types(id),

  -- Content details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  script_content TEXT,  -- for videos/podcasts

  -- Translation linking
  source_content_id UUID REFERENCES content_items(id),  -- NULL if original
  language VARCHAR(10) DEFAULT 'de',  -- ISO 639-1

  -- Status & scheduling
  status VARCHAR(50) DEFAULT 'draft',  -- draft, in_production, ready_for_review, approved, scheduled, published
  workflow_status_id UUID REFERENCES workflow_statuses(id),
  scheduled_publish_at TIMESTAMP,
  published_at TIMESTAMP,

  -- Publishing targets
  platforms VARCHAR[] DEFAULT '{}',
  platform_urls JSONB DEFAULT '{}',  -- { "youtube": "https://...", "website": "/blog/..." }

  -- Metadata
  duration_seconds INT,  -- for video/audio
  word_count INT,  -- for articles
  thumbnail_url VARCHAR(500),

  -- Categorization (will be enhanced in Phase 2)
  category_id UUID,
  tags VARCHAR[] DEFAULT '{}',

  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for content items
CREATE INDEX IF NOT EXISTS idx_content_items_project ON content_items(project_id);
CREATE INDEX IF NOT EXISTS idx_content_items_task ON content_items(task_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_language ON content_items(language);
CREATE INDEX IF NOT EXISTS idx_content_items_source ON content_items(source_content_id);
CREATE INDEX IF NOT EXISTS idx_content_items_content_type ON content_items(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_items_workflow_status ON content_items(workflow_status_id);

-- ============================================
-- PHASE 1.1: TASK ASSIGNMENTS (Multi-Role)
-- ============================================

-- Task assignments (allows multiple people with different roles on a task)
-- NOTE: user_id does not have a foreign key constraint to admin_users because:
-- 1. admin_users table may be in a different schema/database
-- 2. User validation is handled at the application level
-- 3. This allows for more flexible user management across the system
CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,  -- No FK to admin_users - validated at application level
  role_id UUID NOT NULL REFERENCES project_roles(id),
  is_primary BOOLEAN DEFAULT false,  -- primary assignee
  assigned_by UUID,  -- No FK to admin_users - validated at application level
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,  -- when they finished their part
  notes TEXT,

  UNIQUE(task_id, user_id, role_id)
);

-- Indexes for task assignments
CREATE INDEX IF NOT EXISTS idx_task_assignments_task ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user ON task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_role ON task_assignments(role_id);

-- ============================================
-- PHASE 1.1: CHECKLIST TEMPLATES
-- ============================================

-- Checklist templates (reusable checklists for different task types)
CREATE TABLE IF NOT EXISTS checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50),  -- optional: auto-attach to task type
  content_type_id UUID REFERENCES content_types(id),
  items JSONB NOT NULL DEFAULT '[]',
  -- items format: [{ "id": "uuid", "title": "string", "required": bool, "order": int }]
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for checklist templates
CREATE INDEX IF NOT EXISTS idx_checklist_templates_content_type ON checklist_templates(content_type_id);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_task_type ON checklist_templates(task_type);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_active ON checklist_templates(is_active);

-- ============================================
-- PHASE 1.1: TASK CHECKLISTS
-- ============================================

-- Task checklists (checklists attached to specific tasks)
CREATE TABLE IF NOT EXISTS task_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  template_id UUID REFERENCES checklist_templates(id),
  title VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]',
  -- items format: [{ "id": "uuid", "title": "string", "checked": bool, "checked_by": uuid, "checked_at": timestamp, "order": int }]
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for task checklists
CREATE INDEX IF NOT EXISTS idx_task_checklists_task ON task_checklists(task_id);
CREATE INDEX IF NOT EXISTS idx_task_checklists_template ON task_checklists(template_id);

-- ============================================
-- PHASE 1.1: TASK GUIDES (SOPs)
-- ============================================

-- Task guides (instructions and SOPs for different task types)
CREATE TABLE IF NOT EXISTS task_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50),
  content_type_id UUID REFERENCES content_types(id),
  role_id UUID REFERENCES project_roles(id),  -- specific to a role
  content_markdown TEXT NOT NULL,
  estimated_duration_minutes INT,
  difficulty_level VARCHAR(20) DEFAULT 'medium',  -- easy, medium, hard
  video_url VARCHAR(500),  -- tutorial video
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for task guides
CREATE INDEX IF NOT EXISTS idx_task_guides_content_type ON task_guides(content_type_id);
CREATE INDEX IF NOT EXISTS idx_task_guides_role ON task_guides(role_id);
CREATE INDEX IF NOT EXISTS idx_task_guides_task_type ON task_guides(task_type);

-- ============================================
-- PHASE 1.1: ALTER EXISTING TABLES
-- ============================================

-- Add workflow_status_id to tasks table (for dynamic workflow statuses)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'workflow_status_id') THEN
    ALTER TABLE tasks ADD COLUMN workflow_status_id UUID REFERENCES workflow_statuses(id);
  END IF;
END $$;

-- Add priority column to tasks if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'priority') THEN
    ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
  END IF;
END $$;

-- Add task_type column to tasks if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'task_type') THEN
    ALTER TABLE tasks ADD COLUMN task_type VARCHAR(50) DEFAULT 'task';
  END IF;
END $$;

-- Add workflow_id to projects table (for project workflow assignment)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'workflow_id') THEN
    ALTER TABLE projects ADD COLUMN workflow_id UUID REFERENCES workflow_definitions(id);
  END IF;
END $$;

-- Add category_id to projects table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'category_id') THEN
    ALTER TABLE projects ADD COLUMN category_id UUID;
  END IF;
END $$;

-- Create indexes on new columns
CREATE INDEX IF NOT EXISTS idx_tasks_workflow_status ON tasks(workflow_status_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type ON tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_projects_workflow ON projects(workflow_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE workflow_definitions IS 'Defines different workflows for project types (Video Production, Course Creation, etc.)';
COMMENT ON TABLE workflow_statuses IS 'Flexible statuses that belong to specific workflows';
COMMENT ON TABLE workflow_transitions IS 'Defines allowed transitions between workflow statuses';
COMMENT ON TABLE content_types IS 'Types of content produced (Video, Blog, Course, Meditation, etc.)';
COMMENT ON TABLE content_items IS 'Actual content deliverables linked to tasks';
COMMENT ON TABLE project_roles IS 'Roles for content production teams (Editor, Voice Artist, etc.)';
COMMENT ON TABLE task_assignments IS 'Multi-role assignments - multiple people with different roles per task';
COMMENT ON TABLE checklist_templates IS 'Reusable checklist templates for task types';
COMMENT ON TABLE task_checklists IS 'Checklists attached to specific tasks';
COMMENT ON TABLE task_guides IS 'SOPs and instructions for different task types';
