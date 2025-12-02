# Project Management MVP - Architecture Overview

> **Version:** 2.0 - Content Production Focus
> **Date:** 2025-12-02
> **Status:** Ready for Implementation

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND (Client)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              ProjectsDashboard (Page Component)                     │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • Stats cards (Total, Active, Content Items, Pending Approvals)    │    │
│  │ • MyTasksWidget (user's tasks with role badges)                    │    │
│  │ • Project tabs (All, Active, By Workflow Type)                     │    │
│  │ • ProjectCard grid/list (with workflow & category info)            │    │
│  │ • ActivityLog (real content production events)                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │               TasksKanban (Page Component)                          │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • Filters (Project, Assignee, Content Type, Workflow)              │    │
│  │ • Dynamic Columns: Based on Workflow Statuses                      │    │
│  │   (Script Draft → Review → Recording → Editing → Publish)          │    │
│  │ • SortableTaskCards with content item preview                      │    │
│  │ • Role badges & checklist progress on cards                        │    │
│  │ • Drag-drop respects workflow transitions                          │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │            ProjectDetailClient (Page Component)                     │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • Project header (title, workflow badge, category, progress)       │    │
│  │ • Content Items section (videos, articles, courses)                │    │
│  │ • TaskList with role assignments & checklists                      │    │
│  │ • Approval queue (pending approvals for this project)              │    │
│  │ • Publishing schedule (upcoming publishes)                         │    │
│  │ • CommentThread (existing)                                         │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │         Content Production Components (Reusable)                    │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • ContentTypeSelector (video, blog, course, meditation)            │    │
│  │ • WorkflowStatusPicker (dynamic per workflow type)                 │    │
│  │ • ContentItemCard (deliverable preview with platform icons)        │    │
│  │ • RoleAssignmentPicker (user + role selection)                     │    │
│  │ • ChecklistEditor (from template or custom)                        │    │
│  │ • TaskGuidePanel (SOP display with video tutorials)                │    │
│  │ • CategoryPicker (hierarchical spiritual categories)               │    │
│  │ • LabelManager (CRUD for tags)                                     │    │
│  │ • ApprovalGate (review & approve UI)                               │    │
│  │ • PublishingScheduler (multi-platform scheduling)                  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         ↓ HTTP Requests (JSON)          ↑ HTTP Responses (JSON)
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES (Server)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │   Core APIs             │   Content Production APIs               │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • GET/POST /projects    │ • GET/POST /content-items               │     │
│  │ • GET/PATCH/DEL         │ • GET/PATCH/DEL /content-items/{id}     │     │
│  │   /projects/{id}        │ • GET /content-types                    │     │
│  │ • GET/POST /tasks       │ • GET/POST /tasks/{id}/content-item     │     │
│  │ • GET/PATCH/DEL         │ • GET /workflows                        │     │
│  │   /tasks/{id}           │ • GET /workflows/{id}/statuses          │     │
│  │ • PUT /tasks/{id}/      │                                         │     │
│  │   reorder               │                                         │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │   Role & Assignment     │   Checklists & Guides                   │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • GET /roles            │ • GET /checklist-templates              │     │
│  │ • GET/POST /tasks/{id}/ │ • GET/POST /tasks/{id}/checklists       │     │
│  │   assignments           │ • PATCH /tasks/{id}/checklists/         │     │
│  │ • DELETE /tasks/{id}/   │   {checklistId}                         │     │
│  │   assignments/{id}      │ • PATCH /tasks/{id}/checklists/         │     │
│  │ • GET /users            │   {checklistId}/items/{itemId}          │     │
│  │                         │ • GET /task-guides                      │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │   Categories & Labels   │   Approvals & Publishing                │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • GET/POST /categories  │ • GET/POST /approvals                   │     │
│  │ • PATCH/DEL             │ • GET /approvals/{id}                   │     │
│  │   /categories/{id}      │ • POST /approvals/{id}/approve          │     │
│  │ • GET/POST /labels      │ • POST /approvals/{id}/reject           │     │
│  │ • PATCH/DEL             │ • GET/POST /publishing-schedule         │     │
│  │   /labels/{id}          │ • PATCH/DEL /publishing-schedule/{id}   │     │
│  │                         │ • POST /publishing-schedule/{id}/       │     │
│  │                         │   publish-now                           │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                 Middleware & Auth                                   │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • NextAuth session check (await auth())                            │    │
│  │ • RBAC validation (requireAnyRole)                                 │    │
│  │ • Input validation (Zod schemas)                                   │    │
│  │ • Error handling & logging                                         │    │
│  │ • Activity logging (auto-log on entity changes)                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         ↓ SQL Queries (Parameterized)    ↑ Result Sets (Typed)
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER (lib/db)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │ lib/db/projects.ts      │ lib/db/content-items.ts                 │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • getAllProjects()      │ • getAllContentItems()                  │     │
│  │ • getProjectById()      │ • getContentItemById()                  │     │
│  │ • createProject()       │ • createContentItem()                   │     │
│  │ • updateProject()       │ • updateContentItem()                   │     │
│  │ • deleteProject()       │ • deleteContentItem()                   │     │
│  │ • getProjectStats()     │ • getContentItemsForTask()              │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │ lib/db/workflows.ts     │ lib/db/roles.ts                         │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • getWorkflows()        │ • getRoles()                            │     │
│  │ • getWorkflowById()     │ • getRoleById()                         │     │
│  │ • getWorkflowStatuses() │ • getRoleBySlug()                       │     │
│  │ • getDefaultWorkflow()  │                                         │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │ lib/db/task-assignments │ lib/db/checklists.ts                    │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • getTaskAssignments()  │ • getChecklistTemplates()               │     │
│  │ • addTaskAssignment()   │ • getTaskChecklists()                   │     │
│  │ • removeAssignment()    │ • createTaskChecklist()                 │     │
│  │ • markComplete()        │ • toggleChecklistItem()                 │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────┬─────────────────────────────────────────┐     │
│  │ lib/db/approvals.ts     │ lib/db/publishing-schedule.ts           │     │
│  ├─────────────────────────┼─────────────────────────────────────────┤     │
│  │ • getApprovals()        │ • getScheduledPublishes()               │     │
│  │ • createApproval()      │ • schedulePublish()                     │     │
│  │ • approveItem()         │ • updateSchedule()                      │     │
│  │ • rejectItem()          │ • cancelSchedule()                      │     │
│  └─────────────────────────┴─────────────────────────────────────────┘     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │               lib/db/index.ts (Connection Pool)                     │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • query<T>(sql, params) → Promise<T[]>                             │    │
│  │ • execute(sql, params) → Promise<QueryResult>                      │    │
│  │ • transaction(fn) → Promise<T>                                     │    │
│  │ • PostgreSQL connection pooling via 'pg' package                   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         ↓ TCP Connection (SSL)            ↑ Result Set (Bytes)
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTGRESQL DATABASE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Core Tables:                                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ projects              │  │ tasks                 │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ title                 │  │ title                 │                      │
│  │ description           │  │ description           │                      │
│  │ workflow_id (FK) ←NEW │  │ workflow_status_id ←NEW                      │
│  │ category_id (FK) ←NEW │  │ project_id (FK)       │                      │
│  │ status                │  │ priority              │                      │
│  │ progress_percent      │  │ position              │                      │
│  │ start_date            │  │ target_date           │                      │
│  │ target_date           │  │ created_at            │                      │
│  │ created_at            │  │ updated_at            │                      │
│  └───────────────────────┘  └───────────────────────┘                      │
│                                                                             │
│  Workflow Tables (NEW):                                                     │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ workflow_definitions  │  │ workflow_statuses     │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ name                  │  │ workflow_id (FK)      │                      │
│  │ project_type          │  │ name                  │                      │
│  │ is_default            │  │ slug                  │                      │
│  │ created_at            │  │ color                 │                      │
│  └───────────────────────┘  │ order_index           │                      │
│                             │ is_start_state        │                      │
│                             │ is_done_state         │                      │
│                             └───────────────────────┘                      │
│                                                                             │
│  Content Tables (NEW):                                                      │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ content_types         │  │ content_items         │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ name                  │  │ task_id (FK)          │                      │
│  │ slug                  │  │ project_id (FK)       │                      │
│  │ icon                  │  │ content_type_id (FK)  │                      │
│  │ platforms[]           │  │ title                 │                      │
│  │ default_workflow_id   │  │ status                │                      │
│  └───────────────────────┘  │ language              │                      │
│                             │ source_content_id     │                      │
│                             │ scheduled_publish_at  │                      │
│                             │ platforms[]           │                      │
│                             └───────────────────────┘                      │
│                                                                             │
│  Role & Assignment Tables (NEW):                                            │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ project_roles         │  │ task_assignments      │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ name                  │  │ task_id (FK)          │                      │
│  │ slug                  │  │ user_id (FK)          │                      │
│  │ color                 │  │ role_id (FK)          │                      │
│  │ icon                  │  │ is_primary            │                      │
│  │ permissions           │  │ assigned_at           │                      │
│  └───────────────────────┘  │ completed_at          │                      │
│                             └───────────────────────┘                      │
│                                                                             │
│  Checklist Tables (NEW):                                                    │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ checklist_templates   │  │ task_checklists       │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ name                  │  │ task_id (FK)          │                      │
│  │ content_type_id       │  │ template_id (FK)      │                      │
│  │ items (JSONB)         │  │ items (JSONB)         │                      │
│  │ is_active             │  │ progress_percent      │                      │
│  └───────────────────────┘  └───────────────────────┘                      │
│                                                                             │
│  Organization Tables (NEW):                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ categories            │  │ labels                │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ parent_id (FK)        │  │ name                  │                      │
│  │ name                  │  │ slug                  │                      │
│  │ slug                  │  │ color                 │                      │
│  │ icon                  │  │ label_group           │                      │
│  └───────────────────────┘  └───────────────────────┘                      │
│                                                                             │
│  Approval & Publishing Tables (NEW):                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐                      │
│  │ approvals             │  │ publishing_schedule   │                      │
│  ├───────────────────────┤  ├───────────────────────┤                      │
│  │ id (UUID)             │  │ id (UUID)             │                      │
│  │ content_item_id (FK)  │  │ content_item_id (FK)  │                      │
│  │ task_id (FK)          │  │ platform              │                      │
│  │ approval_type         │  │ scheduled_at          │                      │
│  │ status                │  │ status                │                      │
│  │ required_approvers[]  │  │ published_at          │                      │
│  │ approved_by[]         │  │ platform_url          │                      │
│  └───────────────────────┘  └───────────────────────┘                      │
│                                                                             │
│  Activity Table (Enhanced):                                                 │
│  ┌───────────────────────┐                                                 │
│  │ activities            │  Indexes:                                       │
│  ├───────────────────────┤  • tasks(workflow_status_id)                    │
│  │ id (UUID)             │  • tasks(project_id)                            │
│  │ entity_type           │  • content_items(task_id)                       │
│  │ entity_id             │  • content_items(project_id)                    │
│  │ action                │  • task_assignments(task_id)                    │
│  │ actor_id              │  • task_assignments(user_id)                    │
│  │ changes (JSONB)       │  • workflow_statuses(workflow_id)               │
│  │ created_at            │  • approvals(status)                            │
│  └───────────────────────┘  • publishing_schedule(scheduled_at)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Content Production Pipeline Flow

```
                        CONTENT PRODUCTION WORKFLOW
                        ===========================

[Project Created]
      │
      ▼
┌─────────────────┐
│ Select Workflow │ ← Video Production, Course Creation, Blog Publishing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Task     │
│ + Content Item  │ ← Video, Article, Course Module, Meditation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Assign Roles    │ ← Creator, Editor, Voice Artist, Reviewer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add Checklists  │ ← From template or custom
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    WORKFLOW STAGES                           │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Script   │──▶│ Review   │──▶│Recording │──▶│ Editing  │ │
│  │ Draft    │   │          │   │          │   │          │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │        │
│       ▼              ▼              ▼              ▼        │
│   Creator        Reviewer       Voice         Editor        │
│                               Artist                        │
│       │              │              │              │        │
│       ▼              ▼              ▼              ▼        │
│   Checklist      Approval      Checklist     Checklist     │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │Thumbnail │──▶│ Final    │──▶│ Schedule │──▶│ Published│ │
│  │          │   │ Review   │   │          │   │          │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │        │
│       ▼              ▼              ▼              ▼        │
│   Designer       Reviewer       Publisher      Auto        │
│                  Approval                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Multi-Platform  │ ← YouTube, Website, Newsletter, Spotify
│ Publishing      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Track Activity  │ ← Log all events for audit trail
└─────────────────┘
```

---

## Component Hierarchy

```
ProjectsDashboard (Page)
├─ Stats Cards
│  ├─ Total Projects
│  ├─ Active Projects
│  ├─ Content Items
│  └─ Pending Approvals
├─ MyTasksWidget
│  └─ TaskListItem (with role badges, checklist progress)
│     └─ ContentItemCard (compact)
├─ Tabs (Projects / Workflows / Templates)
│  └─ ProjectCard (with workflow & category badges)
│     └─ onClick → ProjectDetailClient
├─ ActivityLog (real content production events)
└─ [Modals]
   ├─ CreateProjectModal (with workflow selector)
   └─ EditProjectModal

ProjectDetailClient (Page)
├─ Header
│  ├─ Title, Description
│  ├─ Workflow badge
│  ├─ Category badge
│  └─ Progress bar
├─ Content Items Section
│  ├─ ContentItemCard (full)
│  │  ├─ Content type icon
│  │  ├─ Status badge
│  │  ├─ Platform icons
│  │  └─ Actions (Edit, Schedule, Publish)
│  └─ Add Content Item button
├─ Tasks Section
│  ├─ TaskListItem (with role badges)
│  │  ├─ ContentItemCard (compact)
│  │  ├─ RoleAssignmentPicker (inline)
│  │  ├─ ChecklistEditor (inline progress)
│  │  └─ WorkflowStatusPicker
│  └─ Create Task button
├─ Approval Queue
│  └─ ApprovalGate
├─ Publishing Schedule
│  └─ PublishingScheduler (calendar view)
├─ CommentThread (existing)
└─ Details Panel
   └─ CategoryPicker, LabelManager

TasksKanban (Page)
├─ Filters
│  ├─ Project filter
│  ├─ Assignee filter (with role)
│  ├─ Content Type filter
│  └─ Workflow filter
├─ Column Layout (dynamic from workflow statuses)
│  └─ KanbanColumn
│     └─ SortableTaskCard
│        ├─ Title
│        ├─ ContentItemCard (mini)
│        ├─ Role assignment avatars
│        ├─ Checklist progress bar
│        └─ Due date
├─ Create Task button → CreateTaskModal
└─ Stats bar (by workflow status)

[Modals]
├─ CreateTaskModal
│  └─ TaskForm
│     ├─ Title input
│     ├─ ContentTypeSelector
│     ├─ WorkflowStatusPicker
│     ├─ RoleAssignmentPicker
│     ├─ ChecklistEditor (from template)
│     └─ DatePickerField
├─ EditTaskModal
│  └─ TaskForm (same as create)
├─ CreateProjectModal
│  └─ ProjectForm
│     ├─ Title input
│     ├─ Workflow selector
│     ├─ CategoryPicker
│     └─ DatePickerField (start, target)
└─ ContentItemDetailModal
   ├─ Full content item form
   ├─ Translation linking
   ├─ PublishingScheduler
   └─ ApprovalGate

[Shared Components]
├─ ContentTypeSelector
│  ├─ Dropdown with icons
│  └─ Content type list
├─ WorkflowStatusPicker
│  ├─ Dropdown with status colors
│  ├─ Valid transitions only
│  └─ Status badges
├─ ContentItemCard
│  ├─ Thumbnail
│  ├─ Content type icon
│  ├─ Status badge
│  ├─ Platform icons
│  └─ Actions
├─ RoleAssignmentPicker
│  ├─ User search
│  ├─ Role dropdown
│  ├─ Assignment badges
│  └─ Remove button
├─ ChecklistEditor
│  ├─ Checkbox items
│  ├─ Progress bar
│  ├─ Add item
│  └─ Create from template
├─ TaskGuidePanel
│  ├─ Markdown content
│  ├─ Video link
│  └─ Duration & difficulty
├─ CategoryPicker
│  ├─ Hierarchical tree
│  ├─ Search filter
│  └─ Icons
├─ LabelManager
│  ├─ Label badges
│  ├─ Add/remove
│  └─ Create new
├─ ApprovalGate
│  ├─ Status display
│  ├─ Approver list
│  ├─ Approve/Reject buttons
│  └─ Feedback field
└─ PublishingScheduler
   ├─ Calendar picker
   ├─ Platform multi-select
   ├─ Timezone display
   └─ Schedule list
```

---

## Data Flow Diagrams

### 1. Content Item Creation Flow

```
User (ProjectDetailClient or CreateTaskModal)
  │
  ▼
Select Content Type (ContentTypeSelector)
  │
  ├─ Fetch content types from GET /api/content-types
  │
  ▼
Fill Content Item Details
  ├─ Title, description
  ├─ Language (default: de)
  └─ Initial status (draft)
  │
  ▼
Create Task with Content (optional)
  │
  ▼
POST /api/content-items
  {
    task_id: "optional",
    project_id: "required",
    content_type_id: "required",
    title: "required",
    language: "de",
    status: "draft"
  }
  │
  ▼
API Route (/app/api/content-items/route.ts)
  ├─ Check auth
  ├─ Validate with Zod
  ├─ Get default workflow status (if task linked)
  └─ Call createContentItem() in lib/db
     │
     ▼
     Database INSERT + return content item
     │
     ▼
     Log activity: 'content_item.created'
     │
     ▼
     Return { content_item } + status 201
  │
  ▼
UI updates: ContentItemCard appears
  │
  ▼
Toast: "Content item created"
```

### 2. Role Assignment Flow

```
User (TaskListItem or CreateTaskModal)
  │
  ▼
Click "Add Assignment" (RoleAssignmentPicker)
  │
  ├─ Fetch users from GET /api/users
  ├─ Fetch roles from GET /api/roles
  │
  ▼
Select User
  │
  ▼
Select Role (Editor, Voice Artist, Reviewer, etc.)
  │
  ▼
Mark as Primary? (optional)
  │
  ▼
POST /api/tasks/{taskId}/assignments
  {
    user_id: "uuid",
    role_id: "uuid",
    is_primary: false
  }
  │
  ▼
API Route (/app/api/tasks/{id}/assignments/route.ts)
  ├─ Check auth
  ├─ Validate input
  ├─ Check for duplicate assignment
  └─ Call addTaskAssignment() in lib/db
     │
     ▼
     Database INSERT + return assignment with user & role
     │
     ▼
     Log activity: 'task.assigned'
     │
     ▼
     Return { assignment } + status 201
  │
  ▼
UI updates: Role badge appears on task
  │
  ▼
Toast: "Maria assigned as Voice Artist"
```

### 3. Workflow Transition Flow (Kanban Drag)

```
User (TasksKanban)
  │
  ▼
Drag task card from "Script Draft" to "Review"
  │
  ▼
@dnd-kit onDragEnd event
  │
  ▼
Check transition validity
  ├─ Get allowed transitions for current status
  ├─ Is target status allowed? (from workflow_transitions)
  │
  ├─ If NOT allowed:
  │  ├─ Show error toast
  │  └─ Revert drag (optimistic rollback)
  │
  └─ If allowed:
     │
     ▼
     Optimistic UI update (move card immediately)
     │
     ▼
     PUT /api/tasks/{id}/reorder
     {
       workflow_status_id: "new-status-uuid",
       position: 0
     }
     │
     ▼
     API Route
     ├─ Check auth
     ├─ Validate transition allowed
     ├─ Update task workflow_status_id
     ├─ Update position
     └─ Log activity: 'task.status_changed'
        │
        ▼
        Return { task } + status 200
     │
     ▼
     If success:
     ├─ Keep optimistic UI
     └─ Toast: "Task moved to Review"
     │
     If error:
     ├─ Revert optimistic UI
     └─ Toast error: "Cannot move task"
```

### 4. Approval Flow

```
Content reaches "Final Review" status
  │
  ▼
System auto-creates approval request (or user clicks "Request Approval")
  │
  ▼
POST /api/approvals
  {
    content_item_id: "uuid",
    approval_type: "final_approval",
    required_approvers: ["reviewer-1-uuid", "reviewer-2-uuid"]
  }
  │
  ▼
API creates approval with status: "pending"
  │
  ▼
Approvers see pending approval in:
  ├─ Notification inbox
  ├─ Project detail approval queue
  └─ Dashboard pending approvals widget
  │
  ▼
Approver clicks "Approve" (ApprovalGate component)
  │
  ▼
POST /api/approvals/{id}/approve
  {
    feedback: "Looks great! Ready for publishing."
  }
  │
  ▼
API Route
  ├─ Add user to approved_by[]
  ├─ Check if all required approvers approved
  │  ├─ If not all: status remains "pending"
  │  └─ If all approved: status = "approved"
  ├─ If approved:
  │  └─ Auto-progress content to "Ready to Publish" status
  └─ Log activity: 'content_item.approved'
  │
  ▼
UI updates: Approval status changes
  │
  ▼
Toast: "Content approved! Ready for publishing."
```

### 5. Publishing Schedule Flow

```
User (PublishingScheduler)
  │
  ▼
Content item is "Approved"
  │
  ▼
Click "Schedule Publish"
  │
  ▼
Select platforms (multi-select)
  ├─ YouTube
  ├─ Website
  ├─ Newsletter
  └─ Spotify
  │
  ▼
Select date/time (DateTimePicker)
  │
  ▼
Select timezone (default: Europe/Vienna)
  │
  ▼
POST /api/publishing-schedule
  {
    content_item_id: "uuid",
    platform: "youtube",
    scheduled_at: "2025-12-15T10:00:00Z",
    timezone: "Europe/Vienna"
  }
  (Repeat for each platform)
  │
  ▼
API creates schedule entries
  │
  ▼
UI shows scheduled items in calendar view
  │
  ▼
At scheduled time (or manual "Publish Now"):
  │
  ▼
POST /api/publishing-schedule/{id}/publish-now
  │
  ▼
API Route:
  ├─ Update content_item.published_at
  ├─ Update content_item.status = "published"
  ├─ Update schedule.status = "published"
  ├─ Store platform_url (manual entry for now)
  └─ Log activity: 'content_item.published'
  │
  ▼
Toast: "Video published to YouTube!"
```

---

## State Management

```
Server State (fetched from API):
├─ Projects, Tasks, Content Items
├─ Workflows, Statuses
├─ Roles, Assignments
├─ Checklists, Templates
├─ Categories, Labels
├─ Approvals, Publishing Schedule
└─ Activities

UI State (React hooks):
├─ Modal open/close
├─ Loading states
├─ Form dirty/validation
├─ Kanban drag state
└─ Filter selections

Form State (react-hook-form + Zod):
├─ Input values
├─ Validation errors
├─ Touched fields
└─ Submit state

Optimistic State:
├─ Task position during drag
├─ Checklist item toggle
├─ Assignment add/remove
└─ Approval status change
```

---

## Error Handling

```
Client Layer:
├─ Form validation → Inline field errors
├─ API errors → Toast notifications
├─ Network errors → Retry button
├─ Workflow transition errors → Revert drag + message
└─ Permission errors → Access denied message

API Layer:
├─ 401 Unauthorized → Missing/invalid session
├─ 403 Forbidden → Insufficient role/permissions
├─ 400 Bad Request → Zod validation errors
├─ 404 Not Found → Entity doesn't exist
├─ 409 Conflict → Duplicate assignment, invalid transition
└─ 500 Server Error → Log + generic message

Database Layer:
├─ Connection error → Retry with backoff
├─ Foreign key violation → Descriptive error
├─ Unique constraint → Already exists message
└─ Transaction failure → Rollback + error
```

---

## Performance Targets

| Operation | Target |
|-----------|--------|
| Page load | < 1s |
| Kanban load | < 300ms |
| API response | < 100ms |
| Drag-drop persist | < 500ms |
| Checklist toggle | < 200ms |
| Search response | < 200ms |

---

## Security Considerations

```
Authentication:
├─ NextAuth v5 with JWT
├─ Session check in all API routes
└─ User info from trusted session

Authorization:
├─ RBAC checks (super_admin, ol_admin, editor, etc.)
├─ Project role checks (is user assigned to task?)
├─ Approval role checks (is user a required approver?)
└─ Action-specific permissions

Input Validation:
├─ Client-side: Zod + react-hook-form
├─ Server-side: Zod in all API routes
├─ SQL: Parameterized queries only
└─ XSS: React auto-escape + sanitization
```

---

**Version:** 2.0
**Date:** 2025-12-02
**Status:** Ready for Implementation
