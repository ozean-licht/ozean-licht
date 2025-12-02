-- Migration: Approvals & Publishing
-- Part of Project Management MVP v3.0 - Phase 4
-- Created: 2025-12-02

-- ============================================
-- PHASE 4.1: HIERARCHICAL CATEGORIES
-- ============================================

-- Categories table (hierarchical spiritual categories for content)
CREATE TABLE IF NOT EXISTS content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES content_categories(id) ON DELETE SET NULL,
  color VARCHAR(20) DEFAULT '#0ec2bc',
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_content_categories_parent ON content_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);
CREATE INDEX IF NOT EXISTS idx_content_categories_active ON content_categories(is_active);

-- ============================================
-- PHASE 4.2: LABELS/TAGS
-- ============================================

-- Labels table (flexible tags for projects/tasks/content)
CREATE TABLE IF NOT EXISTS labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#0ec2bc',
  description TEXT,
  entity_type VARCHAR(20) DEFAULT 'all', -- 'project', 'task', 'content', 'all'
  is_active BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for entity-label relationships
CREATE TABLE IF NOT EXISTS entity_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(20) NOT NULL, -- 'project', 'task', 'content_item'
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(entity_id, entity_type, label_id)
);

-- Indexes for labels
CREATE INDEX IF NOT EXISTS idx_labels_slug ON labels(slug);
CREATE INDEX IF NOT EXISTS idx_labels_entity_type ON labels(entity_type);
CREATE INDEX IF NOT EXISTS idx_labels_active ON labels(is_active);
CREATE INDEX IF NOT EXISTS idx_entity_labels_entity ON entity_labels(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_entity_labels_label ON entity_labels(label_id);

-- ============================================
-- PHASE 4.3: APPROVAL WORKFLOWS
-- ============================================

-- Approval gates (defines approval stages in workflows)
CREATE TABLE IF NOT EXISTS approval_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  required_role_id UUID REFERENCES project_roles(id),
  order_index INT DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  from_status_id UUID REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  to_status_id UUID REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Approval records (tracks who approved what)
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gate_id UUID NOT NULL REFERENCES approval_gates(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL, -- task_id, content_item_id, etc.
  entity_type VARCHAR(20) NOT NULL, -- 'task', 'content_item'
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, skipped
  approved_by UUID, -- user who approved/rejected
  comments TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  decided_at TIMESTAMP,

  UNIQUE(gate_id, entity_id, entity_type)
);

-- Indexes for approvals
CREATE INDEX IF NOT EXISTS idx_approval_gates_workflow ON approval_gates(workflow_id);
CREATE INDEX IF NOT EXISTS idx_approval_gates_order ON approval_gates(workflow_id, order_index);
CREATE INDEX IF NOT EXISTS idx_approvals_gate ON approvals(gate_id);
CREATE INDEX IF NOT EXISTS idx_approvals_entity ON approvals(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_pending ON approvals(status) WHERE status = 'pending';

-- ============================================
-- PHASE 4.4: PUBLISHING SCHEDULE
-- ============================================

-- Publishing schedules (multi-platform scheduling)
CREATE TABLE IF NOT EXISTS publish_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- youtube, website, newsletter, social, podcast
  scheduled_at TIMESTAMP NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Europe/Vienna',
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, publishing, published, failed, cancelled
  published_at TIMESTAMP,
  published_url VARCHAR(500),
  error_message TEXT,
  metadata JSONB DEFAULT '{}', -- platform-specific data
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(content_item_id, platform)
);

-- Indexes for publish schedules
CREATE INDEX IF NOT EXISTS idx_publish_schedules_content ON publish_schedules(content_item_id);
CREATE INDEX IF NOT EXISTS idx_publish_schedules_platform ON publish_schedules(platform);
CREATE INDEX IF NOT EXISTS idx_publish_schedules_status ON publish_schedules(status);
CREATE INDEX IF NOT EXISTS idx_publish_schedules_scheduled ON publish_schedules(scheduled_at) WHERE status = 'scheduled';

-- ============================================
-- PHASE 4.5: UPDATE EXISTING TABLES
-- ============================================

-- Update content_items category_id to reference content_categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_content_items_category'
  ) THEN
    -- Only add if column doesn't already have a constraint
    ALTER TABLE content_items
    ADD CONSTRAINT fk_content_items_category
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add approval_required flag to tasks
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'approval_required') THEN
    ALTER TABLE tasks ADD COLUMN approval_required BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add current_approval_id to tasks (tracks pending approval)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'current_approval_id') THEN
    ALTER TABLE tasks ADD COLUMN current_approval_id UUID REFERENCES approvals(id);
  END IF;
END $$;

-- ============================================
-- SEED DATA: SPIRITUAL CATEGORIES
-- ============================================

INSERT INTO content_categories (name, slug, description, parent_id, color, icon, sort_order) VALUES
-- Root categories
('Spirituality', 'spirituality', 'Core spiritual teachings and concepts', NULL, '#9333EA', 'sparkles', 1),
('Healing', 'healing', 'Healing practices and techniques', NULL, '#10B981', 'heart', 2),
('Meditation', 'meditation', 'Meditation guides and practices', NULL, '#3B82F6', 'brain', 3),
('Community', 'community', 'Community and connection content', NULL, '#F59E0B', 'users', 4),
('Education', 'education', 'Educational and learning content', NULL, '#0ec2bc', 'book-open', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert child categories after root categories exist
WITH root AS (
  SELECT id, slug FROM content_categories WHERE parent_id IS NULL
)
INSERT INTO content_categories (name, slug, description, parent_id, color, icon, sort_order) VALUES
-- Spirituality subcategories
('Enlightenment', 'enlightenment', 'Path to enlightenment', (SELECT id FROM root WHERE slug = 'spirituality'), '#9333EA', 'sun', 1),
('Consciousness', 'consciousness', 'Expanding consciousness', (SELECT id FROM root WHERE slug = 'spirituality'), '#9333EA', 'eye', 2),
('Energy Work', 'energy-work', 'Working with energy', (SELECT id FROM root WHERE slug = 'spirituality'), '#9333EA', 'zap', 3),
-- Healing subcategories
('Sound Healing', 'sound-healing', 'Healing through sound', (SELECT id FROM root WHERE slug = 'healing'), '#10B981', 'music', 1),
('Crystal Healing', 'crystal-healing', 'Working with crystals', (SELECT id FROM root WHERE slug = 'healing'), '#10B981', 'gem', 2),
('Energy Healing', 'energy-healing', 'Energy-based healing', (SELECT id FROM root WHERE slug = 'healing'), '#10B981', 'activity', 3),
-- Meditation subcategories
('Guided Meditation', 'guided-meditation', 'Guided meditation sessions', (SELECT id FROM root WHERE slug = 'meditation'), '#3B82F6', 'compass', 1),
('Breathwork', 'breathwork', 'Breathing techniques', (SELECT id FROM root WHERE slug = 'meditation'), '#3B82F6', 'wind', 2),
('Visualization', 'visualization', 'Visualization practices', (SELECT id FROM root WHERE slug = 'meditation'), '#3B82F6', 'image', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: DEFAULT LABELS
-- ============================================

INSERT INTO labels (name, slug, color, description, entity_type) VALUES
('Featured', 'featured', '#F59E0B', 'Featured content', 'all'),
('Premium', 'premium', '#9333EA', 'Premium/paid content', 'all'),
('New', 'new', '#10B981', 'New content', 'all'),
('Beginner', 'beginner', '#3B82F6', 'Suitable for beginners', 'content'),
('Advanced', 'advanced', '#EF4444', 'Advanced level content', 'content'),
('Urgent', 'urgent', '#EF4444', 'High priority/urgent', 'task'),
('Blocked', 'blocked', '#6B7280', 'Currently blocked', 'task'),
('Quick Win', 'quick-win', '#10B981', 'Easy to complete', 'task'),
('Review Needed', 'review-needed', '#F59E0B', 'Needs review', 'all'),
('Draft', 'draft', '#6B7280', 'Work in progress', 'content')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE content_categories IS 'Hierarchical categories for spiritual content organization';
COMMENT ON TABLE labels IS 'Flexible labels/tags for projects, tasks, and content';
COMMENT ON TABLE entity_labels IS 'Junction table for entity-label relationships';
COMMENT ON TABLE approval_gates IS 'Approval stages within workflows (sign-off points)';
COMMENT ON TABLE approvals IS 'Individual approval records tracking who approved what';
COMMENT ON TABLE publish_schedules IS 'Multi-platform publishing schedule for content';
