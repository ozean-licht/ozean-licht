# Project Management MVP - Task Checklist

> **Version:** 2.0 - Content Production Focus
> **Timeline:** 5-6 weeks | **Total Tasks:** 42 | **Start Date:** TBD

---

## Phase 1: Database & Core APIs (7-8 days)

New database tables and API endpoints for content production workflow.

### 1.1 Database Migrations — Size: L (2 days)

Files to create:
- `/lib/db/migrations/001_workflows.sql`
- `/lib/db/migrations/002_content_items.sql`
- `/lib/db/migrations/003_roles_assignments.sql`
- `/lib/db/migrations/004_checklists.sql`

Requirements:
- [ ] Create `workflow_definitions` table
- [ ] Create `workflow_statuses` table with foreign key to workflows
- [ ] Create `workflow_transitions` table
- [ ] Create `content_types` table
- [ ] Create `content_items` table with foreign keys to tasks, projects
- [ ] Create `project_roles` table
- [ ] Create `task_assignments` table (multi-role)
- [ ] Create `checklist_templates` table
- [ ] Create `task_checklists` table
- [ ] Create `task_guides` table
- [ ] Add `workflow_status_id` column to tasks table
- [ ] Add `workflow_id` column to projects table
- [ ] Create all required indexes

Test Coverage:
- [ ] Migrations run without errors
- [ ] Foreign keys are properly enforced
- [ ] Indexes are created

---

### 1.2 Seed Reference Data — Size: M (1 day)

Files to create:
- `/lib/db/seeds/workflows.ts`
- `/lib/db/seeds/content-types.ts`
- `/lib/db/seeds/roles.ts`
- `/lib/db/seeds/categories.ts`

Requirements:
- [ ] Seed 3 default workflows: Video Production, Course Creation, Blog Publishing
- [ ] Seed workflow statuses for each workflow
- [ ] Seed 7 content types: Video, Blog, Course Module, Meditation, Social Post, Newsletter, Podcast
- [ ] Seed 9 project roles: Creator, Editor, Video Producer, Voice Artist, Translator, Reviewer, Publisher, Thumbnail Designer, Project Lead
- [ ] Seed spiritual categories: Meditation, Prayer, Healing, Spiritual Development, Kids Education

Test Coverage:
- [ ] Seed scripts are idempotent (can run multiple times)
- [ ] All reference data is accessible via API

---

### 1.3 Workflow API — Size: M (1.5 days)

Files to create:
- `/lib/db/workflows.ts`
- `/app/api/workflows/route.ts`
- `/app/api/workflows/[id]/route.ts`
- `/app/api/workflows/[id]/statuses/route.ts`

Requirements:
- [ ] `GET /api/workflows` — List all workflows
- [ ] `GET /api/workflows/{id}` — Get workflow with statuses
- [ ] `GET /api/workflows/{id}/statuses` — Get statuses for workflow
- [ ] `getWorkflowById()` function in lib/db
- [ ] `getWorkflowStatuses()` function
- [ ] `getDefaultWorkflowForProjectType()` function
- [ ] All endpoints require auth

Test Coverage:
- [ ] Can fetch workflows
- [ ] Statuses returned in order_index order
- [ ] 404 for non-existent workflow

---

### 1.4 Content Types API — Size: S (0.5 days)

Files to create:
- `/lib/db/content-types.ts`
- `/app/api/content-types/route.ts`

Requirements:
- [ ] `GET /api/content-types` — List all content types
- [ ] Return: id, name, slug, icon, platforms, default_workflow_id
- [ ] `getContentTypes()` function
- [ ] `getContentTypeBySlug()` function

Test Coverage:
- [ ] Can fetch content types
- [ ] Includes platform information

---

### 1.5 Content Items API — Size: L (2 days)

Files to create:
- `/lib/db/content-items.ts`
- `/app/api/content-items/route.ts`
- `/app/api/content-items/[id]/route.ts`
- `/app/api/tasks/[id]/content-item/route.ts`

Requirements:
- [ ] `POST /api/content-items` — Create content item
- [ ] `GET /api/content-items` — List with filters (project, task, status, type)
- [ ] `GET /api/content-items/{id}` — Get by ID with relations
- [ ] `PATCH /api/content-items/{id}` — Update content item
- [ ] `DELETE /api/content-items/{id}` — Delete
- [ ] `GET /api/tasks/{id}/content-item` — Get content item for task
- [ ] `POST /api/tasks/{id}/content-item` — Create/link content item to task
- [ ] Support translation linking (source_content_id)
- [ ] Support workflow status updates
- [ ] Zod validation for all inputs

Test Coverage:
- [ ] CRUD operations work
- [ ] Filters work correctly
- [ ] Translation linking works
- [ ] Workflow status updates correctly

---

### 1.6 Project Roles API — Size: S (0.5 days)

Files to create:
- `/lib/db/roles.ts`
- `/app/api/roles/route.ts`

Requirements:
- [ ] `GET /api/roles` — List all roles
- [ ] Return: id, name, slug, description, color, icon
- [ ] `getRoles()` function
- [ ] `getRoleBySlug()` function

Test Coverage:
- [ ] Can fetch roles
- [ ] Returns all seeded roles

---

### 1.7 Task Assignments API — Size: M (1 day)

Files to create:
- `/lib/db/task-assignments.ts`
- `/app/api/tasks/[id]/assignments/route.ts`
- `/app/api/tasks/[id]/assignments/[assignmentId]/route.ts`

Requirements:
- [ ] `GET /api/tasks/{id}/assignments` — Get all assignments for task
- [ ] `POST /api/tasks/{id}/assignments` — Add assignment (user + role)
- [ ] `DELETE /api/tasks/{id}/assignments/{assignmentId}` — Remove assignment
- [ ] `PATCH /api/tasks/{id}/assignments/{assignmentId}` — Update (mark complete)
- [ ] `getTaskAssignments()` function with user and role info
- [ ] `addTaskAssignment()` function
- [ ] `removeTaskAssignment()` function
- [ ] `markAssignmentComplete()` function
- [ ] Prevent duplicate user+role combinations
- [ ] Support is_primary flag

Test Coverage:
- [ ] Can add assignment
- [ ] Can remove assignment
- [ ] Duplicate prevention works
- [ ] Returns user and role details

---

### 1.8 Checklists API — Size: M (1.5 days)

Files to create:
- `/lib/db/checklists.ts`
- `/app/api/checklist-templates/route.ts`
- `/app/api/tasks/[id]/checklists/route.ts`
- `/app/api/tasks/[id]/checklists/[checklistId]/route.ts`
- `/app/api/tasks/[id]/checklists/[checklistId]/items/[itemId]/route.ts`

Requirements:
- [ ] `GET /api/checklist-templates` — List templates
- [ ] `GET /api/tasks/{id}/checklists` — Get checklists for task
- [ ] `POST /api/tasks/{id}/checklists` — Create checklist (from template or custom)
- [ ] `PATCH /api/tasks/{id}/checklists/{checklistId}` — Update checklist
- [ ] `DELETE /api/tasks/{id}/checklists/{checklistId}` — Delete checklist
- [ ] `PATCH /api/tasks/{id}/checklists/{checklistId}/items/{itemId}` — Toggle item
- [ ] `getChecklistTemplates()` function
- [ ] `getTaskChecklists()` function
- [ ] `createTaskChecklist()` function
- [ ] `toggleChecklistItem()` function
- [ ] Progress percent calculation

Test Coverage:
- [ ] Can create from template
- [ ] Can create custom checklist
- [ ] Toggle item updates progress
- [ ] Progress calculation correct

---

## Phase 2: Content & Workflow Components (6-7 days)

UI components for content production.

### 2.1 ContentTypeSelector Component — Size: M (1 day)

Files to create:
- `/components/projects/ContentTypeSelector.tsx`

Requirements:
- [ ] Dropdown/select for content types
- [ ] Fetch from `/api/content-types`
- [ ] Display icon + name
- [ ] Return selected content type ID
- [ ] Support default value
- [ ] Loading state

Props:
```typescript
{
  value?: string;
  onChange: (contentTypeId: string) => void;
  disabled?: boolean;
}
```

Test Coverage:
- [ ] Renders with content types
- [ ] Selection works
- [ ] Loading state shows

---

### 2.2 WorkflowStatusPicker Component — Size: M (1.5 days)

Files to create:
- `/components/projects/WorkflowStatusPicker.tsx`

Requirements:
- [ ] Dropdown for workflow statuses
- [ ] Fetch statuses based on workflow ID
- [ ] Display status color and icon
- [ ] Show current status highlighted
- [ ] Support status transitions (only show valid next statuses)
- [ ] Keyboard navigation

Props:
```typescript
{
  workflowId: string;
  value?: string;
  onChange: (statusId: string) => void;
  showOnlyValidTransitions?: boolean;
  currentStatusId?: string;
}
```

Test Coverage:
- [ ] Shows correct statuses for workflow
- [ ] Transition filtering works
- [ ] Keyboard navigation

---

### 2.3 ContentItemCard Component — Size: M (1 day)

Files to create:
- `/components/projects/ContentItemCard.tsx`

Requirements:
- [ ] Display content item details
- [ ] Show: title, content type icon, status badge, language
- [ ] Show thumbnail if available
- [ ] Show platform icons
- [ ] Link to content item detail (if exists)
- [ ] Compact mode for task list embedding
- [ ] Actions: Edit, Schedule, Publish

Props:
```typescript
{
  contentItem: ContentItem;
  compact?: boolean;
  onEdit?: () => void;
  onSchedule?: () => void;
}
```

Test Coverage:
- [ ] Renders with content item
- [ ] Actions trigger callbacks
- [ ] Compact mode works

---

### 2.4 RoleAssignmentPicker Component — Size: L (1.5 days)

Files to create:
- `/components/projects/RoleAssignmentPicker.tsx`

Requirements:
- [ ] Combined user + role selection
- [ ] Fetch users from `/api/users`
- [ ] Fetch roles from `/api/roles`
- [ ] Display existing assignments as badges
- [ ] Support adding multiple assignments
- [ ] Support removing assignments
- [ ] Show role color/icon with user avatar
- [ ] Primary assignee flag

Props:
```typescript
{
  taskId: string;
  assignments: TaskAssignment[];
  onAdd: (userId: string, roleId: string, isPrimary: boolean) => void;
  onRemove: (assignmentId: string) => void;
  onMarkComplete: (assignmentId: string) => void;
}
```

Test Coverage:
- [ ] Can add assignment
- [ ] Can remove assignment
- [ ] Shows existing assignments
- [ ] Role badges display correctly

---

### 2.5 ChecklistEditor Component — Size: L (1.5 days)

Files to create:
- `/components/projects/ChecklistEditor.tsx`

Requirements:
- [ ] Display checklist items with checkboxes
- [ ] Toggle item completion
- [ ] Add new item
- [ ] Remove item
- [ ] Reorder items (drag-drop)
- [ ] Progress bar
- [ ] Create from template option
- [ ] Shows who checked and when

Props:
```typescript
{
  taskId: string;
  checklists: TaskChecklist[];
  templates: ChecklistTemplate[];
  onToggleItem: (checklistId: string, itemId: string) => void;
  onAddItem: (checklistId: string, title: string) => void;
  onRemoveItem: (checklistId: string, itemId: string) => void;
  onCreateFromTemplate: (templateId: string) => void;
}
```

Test Coverage:
- [ ] Toggle works
- [ ] Add item works
- [ ] Remove item works
- [ ] Progress updates
- [ ] Template creation works

---

### 2.6 TaskGuidePanel Component — Size: M (1 day)

Files to create:
- `/components/projects/TaskGuidePanel.tsx`

Requirements:
- [ ] Display task guide/SOP content
- [ ] Markdown rendering
- [ ] Collapsible panel
- [ ] Link to video tutorial if available
- [ ] Estimated duration display
- [ ] Difficulty level badge

Props:
```typescript
{
  guide: TaskGuide;
  collapsed?: boolean;
  onCollapse?: () => void;
}
```

Test Coverage:
- [ ] Renders markdown
- [ ] Collapse toggle works
- [ ] Video link opens

---

### 2.7 Enhanced TaskForm Component — Size: L (1.5 days)

Files to modify:
- `/components/projects/TaskForm.tsx`

Requirements:
- [ ] Add content type selector (optional)
- [ ] Add workflow status picker (based on project workflow)
- [ ] Add content item fields (title, description, script)
- [ ] Add role assignment section
- [ ] Add checklist section
- [ ] Show task guide if applicable
- [ ] Form validation with Zod

Test Coverage:
- [ ] All new fields work
- [ ] Validation works
- [ ] Form submits correctly

---

### 2.8 Enhanced ProjectForm Component — Size: M (1 day)

Files to modify:
- `/components/projects/ProjectForm.tsx`

Requirements:
- [ ] Add workflow selector
- [ ] Add category selector
- [ ] Show workflow description
- [ ] Validate workflow assignment

Test Coverage:
- [ ] Workflow selection works
- [ ] Category selection works

---

## Phase 3: Kanban Integration (6-7 days)

Connect components to real data and update pages.

### 3.1 TasksKanban Real Data Integration — Size: L (2 days)

Files to modify:
- `/app/dashboard/tools/tasks/TasksKanban.tsx`

Requirements:
- [ ] Fetch tasks from `/api/tasks` (remove mock data)
- [ ] Group by workflow_status_id (not hardcoded status)
- [ ] Use workflow statuses as column headers
- [ ] Show column colors from workflow_status
- [ ] Filter by project, assignee, content type
- [ ] Show content item badge on cards
- [ ] Show role badges on cards
- [ ] Show checklist progress on cards
- [ ] Dynamic column count updates

Test Coverage:
- [ ] Real data loads
- [ ] Columns match workflow statuses
- [ ] Filters work
- [ ] Badges display correctly

---

### 3.2 Kanban Drag-and-Drop Integration — Size: L (2 days)

Files to modify:
- `/app/dashboard/tools/tasks/TasksKanban.tsx`

Files to create:
- `/components/projects/SortableTaskCard.tsx`
- `/components/projects/KanbanColumn.tsx`

Requirements:
- [ ] Integrate `@dnd-kit/core` with sensors
- [ ] Make task cards draggable
- [ ] Columns as drop targets
- [ ] On drop: update workflow_status_id via API
- [ ] Optimistic UI update
- [ ] Revert on API error
- [ ] Respect workflow transitions (only allow valid drops)
- [ ] Keyboard support

Test Coverage:
- [ ] Drag between columns works
- [ ] Invalid transitions blocked
- [ ] Optimistic update works
- [ ] Revert on error works

---

### 3.3 Project Detail Content Items — Size: M (1.5 days)

Files to modify:
- `/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`

Requirements:
- [ ] Show content items section
- [ ] List all content items for project
- [ ] Filter by status, type
- [ ] Show ContentItemCards
- [ ] Add content item button
- [ ] Link content to existing tasks

Test Coverage:
- [ ] Content items display
- [ ] Filters work
- [ ] Create flow works

---

### 3.4 Task Detail with Content & Assignments — Size: M (1.5 days)

Files to modify:
- `/components/projects/TaskListItem.tsx`
- `/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`

Requirements:
- [ ] Show content item inline on task card
- [ ] Show role assignments as avatars with role badges
- [ ] Show checklist progress bar
- [ ] Click to expand task detail
- [ ] Edit content item from task
- [ ] Manage assignments from task

Test Coverage:
- [ ] Content item shows
- [ ] Assignments show
- [ ] Checklist progress shows
- [ ] Expand/collapse works

---

### 3.5 CreateTaskModal with Content — Size: M (1 day)

Files to modify:
- `/components/projects/CreateTaskModal.tsx`

Requirements:
- [ ] Include content type selector
- [ ] Auto-create content item when creating task
- [ ] Pre-fill workflow status from project workflow
- [ ] Add role assignment step (optional)
- [ ] Add checklist from template (optional)

Test Coverage:
- [ ] Content item created with task
- [ ] Workflow status set correctly
- [ ] Optional steps work

---

## Phase 4: Approvals & Publishing (5-6 days)

Categories, labels, approvals, and publishing schedule.

### 4.1 Categories API — Size: M (1 day)

Files to create:
- `/lib/db/categories.ts`
- `/app/api/categories/route.ts`
- `/app/api/categories/[id]/route.ts`

Requirements:
- [ ] `GET /api/categories` — List with hierarchy
- [ ] `POST /api/categories` — Create category
- [ ] `PATCH /api/categories/{id}` — Update
- [ ] `DELETE /api/categories/{id}` — Delete
- [ ] Support parent_id for hierarchy
- [ ] Return nested structure option

Test Coverage:
- [ ] CRUD works
- [ ] Hierarchy works

---

### 4.2 CategoryPicker Component — Size: M (1 day)

Files to create:
- `/components/projects/CategoryPicker.tsx`

Requirements:
- [ ] Hierarchical tree/dropdown display
- [ ] Search/filter categories
- [ ] Show icons and colors
- [ ] Expandable parent categories
- [ ] Select leaf or parent

Test Coverage:
- [ ] Hierarchy displays
- [ ] Selection works
- [ ] Search works

---

### 4.3 Labels API — Size: M (1 day)

Files to create:
- `/lib/db/labels.ts`
- `/app/api/labels/route.ts`
- `/app/api/labels/[id]/route.ts`

Requirements:
- [ ] `GET /api/labels` — List all labels
- [ ] `POST /api/labels` — Create label
- [ ] `PATCH /api/labels/{id}` — Update label
- [ ] `DELETE /api/labels/{id}` — Delete label
- [ ] Group by label_group
- [ ] Assign labels to tasks, projects, content items

Test Coverage:
- [ ] CRUD works
- [ ] Assignment works

---

### 4.4 LabelManager Component — Size: M (1 day)

Files to create:
- `/components/projects/LabelManager.tsx`

Requirements:
- [ ] Display labels as colored badges
- [ ] Add label (search existing or create new)
- [ ] Remove label
- [ ] Edit label (name, color)
- [ ] Filter by label group

Test Coverage:
- [ ] Add/remove works
- [ ] Edit works
- [ ] Create new works

---

### 4.5 Approvals API — Size: M (1.5 days)

Files to create:
- `/lib/db/approvals.ts`
- `/app/api/approvals/route.ts`
- `/app/api/approvals/[id]/route.ts`
- `/app/api/approvals/[id]/approve/route.ts`
- `/app/api/approvals/[id]/reject/route.ts`

Requirements:
- [ ] `GET /api/approvals` — List pending approvals
- [ ] `POST /api/approvals` — Request approval
- [ ] `GET /api/approvals/{id}` — Get approval detail
- [ ] `POST /api/approvals/{id}/approve` — Approve
- [ ] `POST /api/approvals/{id}/reject` — Reject with reason
- [ ] Support multiple required approvers
- [ ] Track who approved/rejected

Test Coverage:
- [ ] Request approval works
- [ ] Approve works
- [ ] Reject works
- [ ] Multiple approvers tracked

---

### 4.6 ApprovalGate Component — Size: M (1 day)

Files to create:
- `/components/projects/ApprovalGate.tsx`

Requirements:
- [ ] Show approval status
- [ ] List required approvers
- [ ] Approve/Reject buttons (for approvers)
- [ ] Feedback/comment field
- [ ] Show approval history

Test Coverage:
- [ ] Status displays correctly
- [ ] Actions work
- [ ] History shows

---

### 4.7 Publishing Schedule API — Size: M (1 day)

Files to create:
- `/lib/db/publishing-schedule.ts`
- `/app/api/publishing-schedule/route.ts`
- `/app/api/publishing-schedule/[id]/route.ts`

Requirements:
- [ ] `GET /api/publishing-schedule` — List scheduled items
- [ ] `POST /api/publishing-schedule` — Schedule publish
- [ ] `PATCH /api/publishing-schedule/{id}` — Update schedule
- [ ] `DELETE /api/publishing-schedule/{id}` — Cancel schedule
- [ ] `POST /api/publishing-schedule/{id}/publish-now` — Publish immediately
- [ ] Support multiple platforms per content item
- [ ] Timezone handling

Test Coverage:
- [ ] Schedule works
- [ ] Update works
- [ ] Multiple platforms work

---

### 4.8 PublishingScheduler Component — Size: M (1 day)

Files to create:
- `/components/projects/PublishingScheduler.tsx`

Requirements:
- [ ] Calendar date/time picker
- [ ] Platform multi-select
- [ ] Timezone display
- [ ] Preview scheduled items
- [ ] Edit/cancel scheduled items
- [ ] Status indicators

Test Coverage:
- [ ] Date selection works
- [ ] Platform selection works
- [ ] Schedule displays correctly

---

## Phase 5: Polish & Testing (4-5 days)

Testing, optimization, and documentation.

### 5.1 Form Validation — Size: M (1 day)

Files to create:
- `/lib/validation/content.ts`
- `/lib/validation/workflows.ts`

Requirements:
- [ ] Zod schemas for all new entities
- [ ] Client-side validation
- [ ] Server-side validation
- [ ] Error messages in forms

---

### 5.2 Loading States — Size: M (1 day)

Requirements:
- [ ] Skeletons for all new components
- [ ] Loading states in modals
- [ ] Disabled states during submission
- [ ] No duplicate submissions

---

### 5.3 Activity Log Integration — Size: M (1 day)

Files to modify:
- `/lib/db/activities.ts`
- `/components/projects/ActivityLog.tsx`

Requirements:
- [ ] Log content item events
- [ ] Log assignment events
- [ ] Log approval events
- [ ] Log publishing events
- [ ] Display in activity log

---

### 5.4 Testing — Size: L (1.5 days)

Requirements:
- [ ] Unit tests for new components
- [ ] Unit tests for Zod schemas
- [ ] E2E tests for content item creation
- [ ] E2E tests for role assignment
- [ ] E2E tests for checklist completion
- [ ] E2E tests for approval flow

---

### 5.5 Documentation — Size: S (0.5 days)

Requirements:
- [ ] Update API reference
- [ ] Update component docs
- [ ] Update README
- [ ] Add workflow diagrams

---

## Phase Timing Summary

```
Week 1:
  Day 1-2: Phase 1.1-1.2 (Migrations + Seeds)
  Day 3-4: Phase 1.3-1.5 (Workflow, Content Types, Content Items APIs)
  Day 5: Phase 1.6-1.8 (Roles, Assignments, Checklists APIs)

Week 2:
  Day 1: Phase 2.1-2.2 (ContentTypeSelector, WorkflowStatusPicker)
  Day 2: Phase 2.3-2.4 (ContentItemCard, RoleAssignmentPicker)
  Day 3-4: Phase 2.5-2.6 (ChecklistEditor, TaskGuidePanel)
  Day 5: Phase 2.7-2.8 (Enhanced TaskForm, ProjectForm)

Week 3:
  Day 1-2: Phase 3.1 (Kanban Real Data)
  Day 3-4: Phase 3.2 (Kanban Drag-Drop)
  Day 5: Phase 3.3 (Project Detail Content)

Week 4:
  Day 1: Phase 3.4-3.5 (Task Detail, CreateTaskModal)
  Day 2: Phase 4.1-4.2 (Categories API + Picker)
  Day 3: Phase 4.3-4.4 (Labels API + Manager)
  Day 4-5: Phase 4.5-4.6 (Approvals API + Component)

Week 5:
  Day 1: Phase 4.7-4.8 (Publishing Schedule)
  Day 2: Phase 5.1 (Form Validation)
  Day 3: Phase 5.2-5.3 (Loading States, Activity Log)
  Day 4-5: Phase 5.4-5.5 (Testing, Documentation)

Week 6:
  Buffer / Final QA / Deployment prep
```

---

## Dependency Graph

```
Phase 1: Database migrations first
  └─ Seeds after migrations
     └─ APIs after seeds
        └─ Phase 2: Components can start after APIs ready
           └─ Phase 3: Integration after components
              └─ Phase 4: Advanced features after integration
                 └─ Phase 5: Polish throughout
```

**Critical Path:** 1.1 → 1.5 → 2.7 → 3.1 → 3.2

**Can Parallelize:**
- Phase 1 APIs (after migrations)
- Phase 2 components
- Phase 4 features (mostly independent)

---

## Definition of Done (Each Task)

- [ ] Code written and tested locally
- [ ] No console errors/warnings
- [ ] TypeScript compiles without errors
- [ ] Follows Ozean Licht design system
- [ ] Comments for complex logic
- [ ] Updated related documentation
- [ ] Git commit with conventional message

---

## Success Metrics

- [ ] Content items linked to tasks
- [ ] Workflow statuses dynamic per project
- [ ] Role-based assignments working
- [ ] Checklists with progress tracking
- [ ] Real data in kanban
- [ ] Drag-drop respects workflow transitions
- [ ] Approvals gate publishing
- [ ] Multi-platform scheduling works
- [ ] All tests passing
- [ ] No runtime errors

---

**Version:** 2.0
**Date:** 2025-12-02
**Status:** Ready to Begin
