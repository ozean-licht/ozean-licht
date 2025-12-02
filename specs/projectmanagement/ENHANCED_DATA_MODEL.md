# Enhanced Data Model for Ozean Licht Project Management

> **Version:** 2.0
> **Date:** 2025-12-02
> **Status:** Approved for Implementation
> **Focus:** Content Production Organization (Non-Dev Team)

---

## Executive Summary

This document defines the enhanced database schema for Ozean Licht's project management system. Unlike dev-focused tools like Linear, this model is designed for **content production teams**: spiritual educators, translators, video producers, and editors.

### Key Differences from Linear

| Linear (Dev-Focused) | Ozean Licht (Content-Focused) |
|---------------------|------------------------------|
| GitHub integration | Publishing schedule |
| Bug/feature tickets | Video/Article/Course content |
| Sprint velocity | Content pipeline progress |
| Code review gates | Editorial approval gates |
| Single assignee | Multi-role assignments |
| Fixed statuses | Workflow-specific statuses |

---

## Database Schema

### Phase 1: Core Tables (MVP Must-Have)

#### 1. Workflow Definitions

Allows different project types to have different status workflows.

```sql
-- Workflow definitions (e.g., "Video Production", "Course Creation")
CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  project_type VARCHAR(50) NOT NULL,  -- video, course, blog, social
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example workflows:
-- "Video Production" for video projects
-- "Course Creation" for course modules
-- "Blog Publishing" for articles
-- "Translation Pipeline" for multi-language content
```

#### 2. Workflow Statuses

Flexible statuses that belong to a specific workflow.

```sql
CREATE TABLE workflow_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#0ec2bc',  -- hex color
  icon VARCHAR(50),  -- lucide icon name
  order_index INT NOT NULL DEFAULT 0,
  is_start_state BOOLEAN DEFAULT false,
  is_done_state BOOLEAN DEFAULT false,
  is_cancelled_state BOOLEAN DEFAULT false,
  auto_progress_to UUID,  -- next status for auto-progression
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(workflow_id, slug)
);

-- Example statuses for "Video Production":
-- 1. Script Draft (start)
-- 2. Script Review
-- 3. Voice Recording
-- 4. Video Editing
-- 5. Thumbnail Creation
-- 6. Final Review
-- 7. Ready to Publish
-- 8. Published (done)
```

#### 3. Workflow Transitions

Defines allowed status transitions (optional for strict workflows).

```sql
CREATE TABLE workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  from_status_id UUID NOT NULL REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  to_status_id UUID NOT NULL REFERENCES workflow_statuses(id) ON DELETE CASCADE,
  requires_approval BOOLEAN DEFAULT false,
  required_role_id UUID,  -- role required to make this transition

  UNIQUE(workflow_id, from_status_id, to_status_id)
);
```

#### 4. Content Types

Defines the types of content Ozean Licht produces.

```sql
CREATE TABLE content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  default_workflow_id UUID REFERENCES workflow_definitions(id),
  default_checklist_template_id UUID,
  platforms VARCHAR[] DEFAULT '{}',  -- ['youtube', 'website', 'newsletter']
  estimated_duration_days INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed content types:
INSERT INTO content_types (name, slug, icon, platforms) VALUES
  ('Video', 'video', 'video', ARRAY['youtube', 'website']),
  ('Blog Article', 'blog', 'file-text', ARRAY['website', 'newsletter']),
  ('Course Module', 'course_module', 'graduation-cap', ARRAY['website']),
  ('Guided Meditation', 'meditation', 'heart', ARRAY['youtube', 'website', 'spotify']),
  ('Social Post', 'social', 'share-2', ARRAY['instagram', 'facebook', 'youtube_shorts']),
  ('Newsletter', 'newsletter', 'mail', ARRAY['email']),
  ('Podcast Episode', 'podcast', 'mic', ARRAY['spotify', 'apple_podcasts', 'website']);
```

#### 5. Content Items

The actual deliverables linked to tasks.

```sql
CREATE TABLE content_items (
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

  -- Categorization
  category_id UUID,
  tags VARCHAR[] DEFAULT '{}',

  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_items_project ON content_items(project_id);
CREATE INDEX idx_content_items_task ON content_items(task_id);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_language ON content_items(language);
CREATE INDEX idx_content_items_source ON content_items(source_content_id);
```

#### 6. Project Roles

Roles for content production teams.

```sql
CREATE TABLE project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT '#0ec2bc',
  icon VARCHAR(50),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed roles for Ozean Licht:
INSERT INTO project_roles (name, slug, description, icon) VALUES
  ('Content Creator', 'creator', 'Creates scripts, outlines, and drafts', 'pen-tool'),
  ('Editor', 'editor', 'Edits and refines content', 'edit-3'),
  ('Video Producer', 'video_producer', 'Produces and edits video content', 'video'),
  ('Voice Artist', 'voice_artist', 'Records voiceovers and narration', 'mic'),
  ('Translator', 'translator', 'Translates content to other languages', 'languages'),
  ('Reviewer', 'reviewer', 'Reviews and approves content', 'check-circle'),
  ('Publisher', 'publisher', 'Publishes content to platforms', 'upload'),
  ('Thumbnail Designer', 'thumbnail_designer', 'Creates thumbnails and graphics', 'image'),
  ('Project Lead', 'project_lead', 'Manages project timeline and team', 'crown');
```

#### 7. Task Assignments (Multi-Role)

Junction table allowing multiple people with different roles on a task.

```sql
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES project_roles(id),
  is_primary BOOLEAN DEFAULT false,  -- primary assignee
  assigned_by UUID,
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,  -- when they finished their part

  UNIQUE(task_id, user_id, role_id)
);

CREATE INDEX idx_task_assignments_task ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user ON task_assignments(user_id);
```

#### 8. Checklist Templates

Reusable checklists for different task types.

```sql
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50),  -- optional: auto-attach to task type
  content_type_id UUID REFERENCES content_types(id),
  items JSONB NOT NULL DEFAULT '[]',
  -- items format: [{ "id": "uuid", "title": "string", "required": bool, "order": int }]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example checklist for "Video Production":
-- [
--   { "id": "1", "title": "Script approved", "required": true, "order": 1 },
--   { "id": "2", "title": "Voice recording complete", "required": true, "order": 2 },
--   { "id": "3", "title": "Video edited", "required": true, "order": 3 },
--   { "id": "4", "title": "Thumbnail created", "required": true, "order": 4 },
--   { "id": "5", "title": "SEO title and description", "required": true, "order": 5 },
--   { "id": "6", "title": "Final review passed", "required": true, "order": 6 }
-- ]
```

#### 9. Task Checklists

Checklists attached to specific tasks.

```sql
CREATE TABLE task_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  template_id UUID REFERENCES checklist_templates(id),
  title VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]',
  -- items format: [{ "id": "uuid", "title": "string", "checked": bool, "checked_by": uuid, "checked_at": timestamp, "order": int }]
  progress_percent INT GENERATED ALWAYS AS (
    CASE
      WHEN jsonb_array_length(items) = 0 THEN 0
      ELSE (
        SELECT COUNT(*) FILTER (WHERE (item->>'checked')::boolean = true) * 100 / jsonb_array_length(items)
        FROM jsonb_array_elements(items) AS item
      )
    END
  ) STORED,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_task_checklists_task ON task_checklists(task_id);
```

#### 10. Task Guides (SOPs)

Instructions and SOPs for different task types.

```sql
CREATE TABLE task_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
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
```

---

### Phase 2: Categories & Publishing (MVP Should-Have)

#### 11. Categories (Hierarchical)

Spiritual content categorization.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20) DEFAULT '#0ec2bc',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Seed spiritual categories:
INSERT INTO categories (name, slug, icon, parent_id) VALUES
  ('Meditation', 'meditation', 'heart', NULL),
  ('Guided Meditation', 'guided-meditation', 'headphones', (SELECT id FROM categories WHERE slug = 'meditation')),
  ('Breathing Exercises', 'breathing', 'wind', (SELECT id FROM categories WHERE slug = 'meditation')),
  ('Visualization', 'visualization', 'eye', (SELECT id FROM categories WHERE slug = 'meditation')),

  ('Prayer', 'prayer', 'hands', NULL),
  ('Morning Prayer', 'morning-prayer', 'sunrise', (SELECT id FROM categories WHERE slug = 'prayer')),
  ('Evening Prayer', 'evening-prayer', 'moon', (SELECT id FROM categories WHERE slug = 'prayer')),

  ('Healing', 'healing', 'sparkles', NULL),
  ('Energy Healing', 'energy-healing', 'zap', (SELECT id FROM categories WHERE slug = 'healing')),
  ('Sound Healing', 'sound-healing', 'music', (SELECT id FROM categories WHERE slug = 'healing')),

  ('Spiritual Development', 'spiritual-development', 'star', NULL),
  ('Consciousness', 'consciousness', 'brain', (SELECT id FROM categories WHERE slug = 'spiritual-development')),
  ('Light Work', 'light-work', 'sun', (SELECT id FROM categories WHERE slug = 'spiritual-development')),

  ('Kids Education', 'kids', 'baby', NULL),
  ('Kids Meditation', 'kids-meditation', 'heart', (SELECT id FROM categories WHERE slug = 'kids')),
  ('Kids Stories', 'kids-stories', 'book-open', (SELECT id FROM categories WHERE slug = 'kids'));
```

#### 12. Labels/Tags

Flexible tagging system with CRUD.

```sql
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(20) NOT NULL DEFAULT '#0ec2bc',
  description TEXT,
  label_group VARCHAR(50),  -- priority, type, component, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Junction tables for labels
CREATE TABLE task_labels (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

CREATE TABLE project_labels (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, label_id)
);

CREATE TABLE content_item_labels (
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (content_item_id, label_id)
);

-- Seed labels:
INSERT INTO labels (name, slug, color, label_group) VALUES
  -- Priority labels
  ('Urgent', 'urgent', '#ef4444', 'priority'),
  ('High Priority', 'high', '#f97316', 'priority'),
  ('Medium Priority', 'medium', '#eab308', 'priority'),
  ('Low Priority', 'low', '#22c55e', 'priority'),

  -- Type labels
  ('Bug', 'bug', '#ef4444', 'type'),
  ('Feature', 'feature', '#3b82f6', 'type'),
  ('Improvement', 'improvement', '#8b5cf6', 'type'),
  ('Content', 'content', '#0ec2bc', 'type'),

  -- Status labels
  ('Blocked', 'blocked', '#ef4444', 'status'),
  ('Needs Review', 'needs-review', '#f97316', 'status'),
  ('Ready to Publish', 'ready-to-publish', '#22c55e', 'status');
```

#### 13. Approvals

Sign-off gates before publishing.

```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Can be attached to content item or task
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,

  approval_type VARCHAR(50) NOT NULL,  -- content_review, final_approval, publish_approval

  -- Approval chain
  required_approvers UUID[] DEFAULT '{}',  -- user IDs required
  approved_by UUID[] DEFAULT '{}',  -- user IDs who approved
  rejected_by UUID,

  status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected, cancelled

  -- Feedback
  feedback TEXT,
  rejection_reason TEXT,

  -- Timestamps
  requested_at TIMESTAMP DEFAULT NOW(),
  decided_at TIMESTAMP,

  CHECK (content_item_id IS NOT NULL OR task_id IS NOT NULL)
);

CREATE INDEX idx_approvals_content ON approvals(content_item_id);
CREATE INDEX idx_approvals_task ON approvals(task_id);
CREATE INDEX idx_approvals_status ON approvals(status);
```

#### 14. Publishing Schedule

When and where content goes live.

```sql
CREATE TABLE publishing_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,

  platform VARCHAR(50) NOT NULL,  -- youtube, website, instagram, newsletter

  -- Scheduling
  scheduled_at TIMESTAMP NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Europe/Vienna',

  -- Status
  status VARCHAR(20) DEFAULT 'scheduled',  -- scheduled, publishing, published, failed, cancelled
  published_at TIMESTAMP,

  -- Platform-specific data
  platform_post_id VARCHAR(255),  -- ID on the platform (YouTube video ID, etc.)
  platform_url VARCHAR(500),
  platform_metadata JSONB DEFAULT '{}',  -- platform-specific data

  -- Error handling
  error_message TEXT,
  retry_count INT DEFAULT 0,

  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_publishing_schedule_content ON publishing_schedule(content_item_id);
CREATE INDEX idx_publishing_schedule_status ON publishing_schedule(status);
CREATE INDEX idx_publishing_schedule_scheduled ON publishing_schedule(scheduled_at);
```

---

### Phase 3: Advanced Features (Nice-to-Have)

#### 15. Translations

Track translation progress per language.

```sql
CREATE TABLE translation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  target_language VARCHAR(10) NOT NULL,  -- ISO 639-1

  -- Resulting content
  translated_content_id UUID REFERENCES content_items(id),

  status VARCHAR(20) DEFAULT 'requested',  -- requested, in_progress, review, completed
  priority VARCHAR(20) DEFAULT 'medium',

  -- Assignment
  translator_id UUID,
  reviewer_id UUID,

  -- Deadlines
  requested_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,

  notes TEXT
);

CREATE INDEX idx_translations_source ON translation_requests(source_content_id);
CREATE INDEX idx_translations_status ON translation_requests(status);
```

#### 16. Cycles (Sprints)

Time-boxed work periods.

```sql
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Team scope
  team_id UUID,  -- optional, for team-specific cycles

  -- Timing
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status
  status VARCHAR(20) DEFAULT 'upcoming',  -- upcoming, active, completed

  -- Metrics (calculated)
  planned_tasks INT DEFAULT 0,
  completed_tasks INT DEFAULT 0,
  carryover_tasks INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link tasks to cycles
ALTER TABLE tasks ADD COLUMN cycle_id UUID REFERENCES cycles(id);
CREATE INDEX idx_tasks_cycle ON tasks(cycle_id);
```

#### 17. Custom Views

Saved filter configurations.

```sql
CREATE TABLE custom_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Ownership
  user_id UUID,  -- NULL = shared with team
  team_id UUID,

  -- View configuration
  entity_type VARCHAR(20) NOT NULL,  -- tasks, projects, content_items
  filters JSONB DEFAULT '{}',  -- { "status": ["active"], "assignee": ["uuid"], ... }
  sort_by VARCHAR(50) DEFAULT 'created_at',
  sort_order VARCHAR(4) DEFAULT 'desc',
  view_mode VARCHAR(20) DEFAULT 'list',  -- list, board, calendar
  columns VARCHAR[] DEFAULT '{}',  -- visible columns

  -- UI
  icon VARCHAR(50),
  color VARCHAR(20),
  is_pinned BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_custom_views_user ON custom_views(user_id);
```

#### 18. Activity Log (Real)

Real activity tracking.

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entity reference
  entity_type VARCHAR(20) NOT NULL,  -- task, project, content_item, approval
  entity_id UUID NOT NULL,

  -- Action
  action VARCHAR(50) NOT NULL,  -- created, updated, deleted, status_changed, assigned, commented, approved, published

  -- Actor
  actor_id UUID NOT NULL,
  actor_name VARCHAR(255),
  actor_email VARCHAR(255),

  -- Change details
  changes JSONB DEFAULT '{}',  -- { "field": { "old": "x", "new": "y" } }
  metadata JSONB DEFAULT '{}',  -- additional context

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_actor ON activities(actor_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
```

---

## TypeScript Types

```typescript
// types/projects-enhanced.ts

// ============ Workflows ============

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  project_type: 'video' | 'course' | 'blog' | 'social' | 'general';
  is_default: boolean;
  statuses?: WorkflowStatus[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowStatus {
  id: string;
  workflow_id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  order_index: number;
  is_start_state: boolean;
  is_done_state: boolean;
  is_cancelled_state: boolean;
  auto_progress_to?: string;
}

// ============ Content ============

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  default_workflow_id?: string;
  platforms: string[];
  estimated_duration_days?: number;
}

export interface ContentItem {
  id: string;
  task_id?: string;
  project_id: string;
  content_type_id: string;
  content_type?: ContentType;

  title: string;
  description?: string;
  script_content?: string;

  source_content_id?: string;  // for translations
  language: string;

  status: 'draft' | 'in_production' | 'ready_for_review' | 'approved' | 'scheduled' | 'published';
  workflow_status_id?: string;
  workflow_status?: WorkflowStatus;

  scheduled_publish_at?: string;
  published_at?: string;

  platforms: string[];
  platform_urls: Record<string, string>;

  duration_seconds?: number;
  word_count?: number;
  thumbnail_url?: string;

  category_id?: string;
  category?: Category;
  tags: string[];
  labels?: Label[];

  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============ Roles & Assignments ============

export interface ProjectRole {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  role_id: string;
  role?: ProjectRole;
  is_primary: boolean;
  assigned_by?: string;
  assigned_at: string;
  completed_at?: string;
}

// ============ Checklists ============

export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  checked_by?: string;
  checked_at?: string;
  required?: boolean;
  order: number;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  task_type?: string;
  content_type_id?: string;
  items: ChecklistItem[];
  is_active: boolean;
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  template_id?: string;
  title?: string;
  items: ChecklistItem[];
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

// ============ Categories & Labels ============

export interface Category {
  id: string;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

export interface Label {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  label_group?: 'priority' | 'type' | 'status' | 'custom';
  is_active: boolean;
}

// ============ Approvals ============

export interface Approval {
  id: string;
  content_item_id?: string;
  task_id?: string;
  approval_type: 'content_review' | 'final_approval' | 'publish_approval';
  required_approvers: string[];
  approved_by: string[];
  rejected_by?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  feedback?: string;
  rejection_reason?: string;
  requested_at: string;
  decided_at?: string;
}

// ============ Publishing ============

export interface PublishingScheduleItem {
  id: string;
  content_item_id: string;
  content_item?: ContentItem;
  platform: string;
  scheduled_at: string;
  timezone: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  published_at?: string;
  platform_post_id?: string;
  platform_url?: string;
  platform_metadata: Record<string, any>;
  error_message?: string;
  retry_count: number;
}

// ============ Task Guides ============

export interface TaskGuide {
  id: string;
  name: string;
  task_type?: string;
  content_type_id?: string;
  role_id?: string;
  content_markdown: string;
  estimated_duration_minutes?: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  video_url?: string;
  is_active: boolean;
}

// ============ Cycles ============

export interface Cycle {
  id: string;
  name: string;
  description?: string;
  team_id?: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  planned_tasks: number;
  completed_tasks: number;
  carryover_tasks: number;
}

// ============ Activities ============

export interface Activity {
  id: string;
  entity_type: 'task' | 'project' | 'content_item' | 'approval';
  entity_id: string;
  action: string;
  actor_id: string;
  actor_name?: string;
  actor_email?: string;
  changes: Record<string, { old: any; new: any }>;
  metadata: Record<string, any>;
  created_at: string;
}
```

---

## API Endpoints to Add

### Content Items
```
GET    /api/content-items
POST   /api/content-items
GET    /api/content-items/{id}
PATCH  /api/content-items/{id}
DELETE /api/content-items/{id}
POST   /api/content-items/{id}/publish
```

### Workflows
```
GET    /api/workflows
POST   /api/workflows
GET    /api/workflows/{id}
PATCH  /api/workflows/{id}
DELETE /api/workflows/{id}
GET    /api/workflows/{id}/statuses
```

### Checklists
```
GET    /api/checklist-templates
POST   /api/checklist-templates
GET    /api/tasks/{id}/checklists
POST   /api/tasks/{id}/checklists
PATCH  /api/tasks/{id}/checklists/{checklistId}
PATCH  /api/tasks/{id}/checklists/{checklistId}/items/{itemId}
```

### Roles & Assignments
```
GET    /api/roles
POST   /api/roles
GET    /api/tasks/{id}/assignments
POST   /api/tasks/{id}/assignments
DELETE /api/tasks/{id}/assignments/{assignmentId}
```

### Categories
```
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/{id}
DELETE /api/categories/{id}
```

### Labels
```
GET    /api/labels
POST   /api/labels
PATCH  /api/labels/{id}
DELETE /api/labels/{id}
```

### Approvals
```
GET    /api/approvals
POST   /api/approvals
PATCH  /api/approvals/{id}
POST   /api/approvals/{id}/approve
POST   /api/approvals/{id}/reject
```

### Publishing
```
GET    /api/publishing-schedule
POST   /api/publishing-schedule
PATCH  /api/publishing-schedule/{id}
DELETE /api/publishing-schedule/{id}
POST   /api/publishing-schedule/{id}/publish-now
```

---

## Migration Strategy

### Step 1: Add New Tables (Non-Breaking)
Run migrations to add all new tables without modifying existing ones.

### Step 2: Seed Reference Data
Populate content_types, project_roles, categories, labels, workflow_definitions.

### Step 3: Add Foreign Keys to Existing Tables
```sql
ALTER TABLE tasks ADD COLUMN workflow_status_id UUID REFERENCES workflow_statuses(id);
ALTER TABLE tasks ADD COLUMN cycle_id UUID REFERENCES cycles(id);
ALTER TABLE projects ADD COLUMN workflow_id UUID REFERENCES workflow_definitions(id);
ALTER TABLE projects ADD COLUMN category_id UUID REFERENCES categories(id);
```

### Step 4: Migrate Existing Data
Map existing task statuses to workflow_statuses.

### Step 5: Update Application Code
Gradually update components to use new data structures.

---

## Component Requirements

### New Components (Phase 1)
1. `ContentItemCard.tsx` - Display content deliverable
2. `ContentTypeSelector.tsx` - Select content type
3. `WorkflowStatusPicker.tsx` - Dynamic status picker
4. `ChecklistEditor.tsx` - Manage checklist items
5. `RoleAssignmentPicker.tsx` - Assign user + role
6. `TaskGuidePanel.tsx` - Display SOP for task

### New Components (Phase 2)
7. `CategoryPicker.tsx` - Select spiritual category
8. `LabelManager.tsx` - CRUD for labels
9. `ApprovalGate.tsx` - Review & approve UI
10. `PublishingScheduler.tsx` - Schedule publish

### New Components (Phase 3)
11. `TranslationStatus.tsx` - Translation progress
12. `CycleProgress.tsx` - Sprint tracking
13. `CustomViewBuilder.tsx` - Create saved views
14. `CommandMenu.tsx` - Cmd+K navigation

---

**Version:** 2.0
**Status:** Approved for Implementation
**Last Updated:** 2025-12-02
