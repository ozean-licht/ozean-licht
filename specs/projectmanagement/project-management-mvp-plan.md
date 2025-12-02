# Project Management MVP Implementation Plan

## Executive Summary

**Objective**: Build a functional project management system in the Ozean Licht Admin Dashboard with core task and project management capabilities.

**Scope**: Task creation, project editing, real kanban data integration, assignee management, and date picking — excluding subtasks, time tracking, and advanced sprint management.

**Timeline**: 4-5 weeks (assuming 3-4 dev days/week, some parallelization possible)

**Complexity**: Medium (M) — Well-scoped MVP with clear UI patterns and existing database layer

**Key Outcome**: Users can create/edit projects and tasks, drag tasks between kanban columns, assign work, and track progress in real-time.

---

## Requirements Analysis

### Functional Requirements

1. **Task Creation & Management**
   - Create new tasks from project detail page or kanban view
   - Edit task details (name, description, status, priority)
   - Delete tasks with confirmation
   - Assign tasks to team members
   - Set task due dates
   - Mark tasks complete/incomplete
   - Reorder tasks within and across kanban columns (drag-and-drop)

2. **Project Management**
   - Edit existing projects (title, description, status, dates)
   - Manage project assignees (add/remove team members)
   - View real-time progress calculation
   - Bulk actions (change status, reassign)

3. **Real-Time Kanban Integration**
   - Replace mock data with real database tasks
   - Persist drag-and-drop reordering to database
   - Filter by project and assignee from real data
   - Update counts dynamically

4. **User Assignment & Selection**
   - Assignee picker component for tasks and projects
   - User search/filter capability
   - Avatar display with initials
   - Quick assign from task cards

5. **Date Management**
   - Date picker for due dates and start dates
   - Calendar view integration (optional for MVP)
   - Display relative dates (Today, Overdue, etc.)
   - Deadline indicators on cards

6. **Activity Visibility**
   - Real activity log (replaces placeholder)
   - Show task creation, status changes, assignment changes
   - Display by timestamp (relative and absolute)
   - Filterable by entity type

### Technical Requirements

**Infrastructure**:
- PostgreSQL: Direct connection via `lib/db/projects.ts`, `lib/db/tasks.ts`
- No MCP Gateway involvement (app-level operations use direct DB)
- NextAuth v5 for authentication (already configured)

**Performance Targets**:
- List projects: < 200ms (with 100+ projects)
- Create task: < 100ms
- Drag-and-drop reorder: instant optimistic UI, persist < 500ms
- Kanban load: < 300ms (first paint)

**Security Requirements**:
- All pages/APIs require authentication
- RBAC enforcement at route level (`requireAnyRole()`)
- Input validation (Zod schemas recommended)
- Audit logging for sensitive operations (assign, delete)
- SQL injection prevention (parameterized queries already used)

**Browser Support**:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Drag-and-drop via `react-dnd` or `@dnd-kit/core`
- Touch support for mobile (future phase)

### Constraints

- **Tech Debt**: TasksKanban uses mock data today — must integrate real DB
- **Backward Compatibility**: Existing project/task structures must remain stable
- **UI Consistency**: Must match Ozean Licht design system (turquoise primary, ocean background, glass morphism)
- **Database Schema**: No migrations needed — tables exist, only need new columns if required
- **Time Budget**: 4-5 weeks to MVP, focused scope to ensure delivery

---

## Architecture Design

### Component Structure

```
apps/admin/
├── app/
│   ├── dashboard/
│   │   └── tools/
│   │       └── projects/
│   │           ├── ProjectsDashboard.tsx (exists - stats, tabs, cards)
│   │           ├── [id]/
│   │           │   └── ProjectDetailClient.tsx (exists - detail view)
│   │           ├── new/
│   │           │   └── NewProjectClient.tsx (exists - form)
│   │           └── (NEW) modals/
│   │               ├── CreateTaskModal.tsx (modal for task creation)
│   │               ├── EditProjectModal.tsx (modal for project editing)
│   │               └── EditTaskModal.tsx (inline or modal for task editing)
│   ├── api/
│   │   ├── projects/ (exists)
│   │   │   ├── route.ts (GET/POST)
│   │   │   └── [id]/route.ts (GET/PATCH/DELETE)
│   │   ├── tasks/ (exists)
│   │   │   ├── route.ts (GET/POST) — add task creation
│   │   │   ├── [id]/route.ts (GET/PATCH/DELETE) — add full CRUD
│   │   │   └── (NEW) [id]/reorder/route.ts — handle drag-drop position
│   │   ├── (NEW) users/route.ts — list users for assignee picker
│   │   └── (NEW) activities/route.ts — list activities
│   │
│   └── tools/
│       └── tasks/
│           └── TasksKanban.tsx (exists - needs real data integration)
│
├── components/
│   └── projects/
│       ├── ProjectCard.tsx (exists)
│       ├── TaskList.tsx (exists)
│       ├── TaskListItem.tsx (exists)
│       ├── CommentThread.tsx (exists)
│       ├── (NEW) AssigneePicker.tsx — user selection dropdown
│       ├── (NEW) DatePickerField.tsx — date selection input
│       ├── (NEW) TaskForm.tsx — reusable task form (modal/inline)
│       ├── (NEW) ProjectForm.tsx — reusable project form
│       ├── (NEW) ActivityLog.tsx — real activity display
│       └── (NEW) DraggableTaskCard.tsx — enhanced task card with drag
│
├── lib/
│   └── db/
│       ├── projects.ts (exists - add updateProjectAssignees)
│       ├── tasks.ts (exists - add create/update/delete full CRUD, reorder)
│       ├── (NEW) activities.ts — log and fetch activity
│       ├── (NEW) users.ts — list users for assignment
│       └── (NEW) task-ordering.ts — handle kanban column reordering
│
└── types/
    └── (extend existing) projects.ts
        ├── Add TaskActivityLog type
        ├── Add CreateTaskInput, UpdateTaskInput
        └── Add ActivityFilter type
```

### Data Models

**Task Ordering (Kanban State)**
```typescript
// Added to tasks table (or new kanban_state table)
interface TaskKanbanState {
  id: string;
  task_id: string;
  project_id: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  position: number; // Order within column
  column_updated_at: timestamp;
}
```

**Activity Log**
```typescript
interface TaskActivity {
  id: string;
  task_id?: string;
  project_id?: string;
  entity_type: 'task' | 'project';
  entity_id: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'assigned' | 'commented';
  actor_id: string;
  actor_name: string;
  actor_email: string;
  details: {
    field_changed?: string;
    old_value?: string | number;
    new_value?: string | number;
    assigned_to?: string;
  };
  created_at: timestamp;
}
```

**User Assignment**
```typescript
// Existing but need to formalize assignee picker
interface TaskAssignment {
  task_id: string;
  user_id: string;
  assigned_by: string;
  assigned_at: timestamp;
  primary_assignee: boolean;
}
```

### API Design

#### Existing APIs (Enhance)

**Tasks CRUD**
```
GET /api/tasks
  ?project={projectId}
  ?assignee={userId}
  &status={status}
  &orderBy=position
  → Real kanban data (not mock)

POST /api/tasks
  { title, description, projectId, assigneeId, dueDate, priority, status }
  → Create new task

GET /api/tasks/{id}
  → Task detail

PATCH /api/tasks/{id}
  { title, description, status, assigneeId, dueDate, priority }
  → Update task

DELETE /api/tasks/{id}
  → Delete task
```

**Projects Enhancement**
```
PATCH /api/projects/{id}
  { title, description, status, startDate, targetDate, assigneeIds }
  → Update project with assignees

POST /api/projects/{id}/assignees
  { userId, role? }
  → Add assignee to project

DELETE /api/projects/{id}/assignees/{userId}
  → Remove assignee from project
```

#### New APIs

**Task Reordering (Kanban)**
```
PUT /api/tasks/{id}/reorder
  { status, position, projectId }
  → Update task position in kanban

Example: Moving task from "todo" col to "in_progress" col at position 3
```

**Users (For Assignee Picker)**
```
GET /api/users
  ?search={query}
  ?role={role}
  → List users with pagination
  ← { users: [{id, name, email, avatar}], total }
```

**Activity Log**
```
GET /api/activities
  ?entityType={task|project}
  ?entityId={id}
  ?limit=50
  → List activities chronologically

POST /api/activities (internal only)
  Logged automatically on task/project changes
```

### Authentication & Authorization

- All endpoints require `await auth()` session check
- RBAC via `requireAnyRole(['super_admin', 'ol_admin'])`
- Permission checks: `hasPermission(session.user.permissions, 'tasks.create')`
- Assignee picker shows only authorized users (same role or lower)

### UI Component Patterns

**Assignee Picker Pattern** (reuse from storage components)
```typescript
<AssigneePicker
  value={assigneeId}
  onChange={setAssigneeId}
  projectId={projectId}
  placeholder="Select assignee..."
  allowMultiple={false}
/>
```

**Date Picker Pattern**
```typescript
<DatePickerField
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
  minDate={startDate}
  helpText="When should this be completed?"
/>
```

**Task Form Pattern** (modal or inline)
```typescript
<TaskForm
  task={taskToEdit}
  projectId={projectId}
  onSubmit={handleTaskSave}
  onCancel={handleCancel}
  isLoading={false}
/>
```

---

## Implementation Tasks

### Phase 1: Foundation & Data Layer (5-6 days)

Core database enhancements and API endpoints.

- [ ] **1.1: Task CRUD API Enhancement** (Size: M)
  - Enhance `POST /api/tasks` to create tasks (not just list)
  - Add `PATCH /api/tasks/{id}` for updates
  - Add `DELETE /api/tasks/{id}` for deletion
  - Add proper input validation with Zod
  - Files: `/app/api/tasks/route.ts`, `/app/api/tasks/[id]/route.ts`
  - Acceptance: Can create, read, update, delete tasks via API

- [ ] **1.2: Task Database Functions** (Size: M)
  - Implement `createTask()`, `updateTask()`, `deleteTask()` in `lib/db/tasks.ts`
  - Add `getTasksByProjectId()` enhancement (filter by assignee)
  - Add query validation, null checks, error handling
  - Files: `/lib/db/tasks.ts`
  - Acceptance: All task DB functions work, return proper types

- [ ] **1.3: Activity Logging Infrastructure** (Size: M)
  - Create `lib/db/activities.ts` with `logActivity()`, `getActivities()`
  - Auto-log on task/project changes via API hooks
  - Add activity types enum: created, updated, deleted, assigned, status_changed
  - Files: `/lib/db/activities.ts`, `/app/api/activities/route.ts`
  - Acceptance: Activities logged on task create/update, retrievable via API

- [ ] **1.4: User Assignment Functions** (Size: S)
  - Implement `updateProjectAssignees()` in `lib/db/projects.ts`
  - Add `getProjectAssignees()`, `removeProjectAssignee()`
  - Validate user IDs, prevent duplicate assignments
  - Files: `/lib/db/projects.ts`, `/app/api/projects/[id]/assignees/route.ts`
  - Acceptance: Can add/remove assignees from projects

- [ ] **1.5: Kanban Reorder API** (Size: M)
  - Create `PUT /api/tasks/{id}/reorder` endpoint
  - Implement position-based ordering logic
  - Handle status transitions with position reset
  - Add transaction safety (atomic updates)
  - Files: `/app/api/tasks/[id]/reorder/route.ts`, `/lib/db/task-ordering.ts`
  - Acceptance: Drag-drop position persists, no race conditions

- [ ] **1.6: Users List API** (Size: S)
  - Create `GET /api/users` with search and pagination
  - Return: { id, name, email, avatar_url }
  - Add role filtering (optional)
  - Files: `/app/api/users/route.ts`, `/lib/db/users.ts`
  - Acceptance: Can fetch user list, searchable

---

### Phase 2: UI Components (6-7 days)

Reusable components for forms, selectors, and displays.

- [ ] **2.1: Assignee Picker Component** (Size: M)
  - Create `components/projects/AssigneePicker.tsx`
  - Dropdown with user search, avatar display
  - Support single and multi-select
  - Keyboard navigation (arrow keys, enter)
  - Reusable in tasks and projects
  - Files: `/components/projects/AssigneePicker.tsx`, shared styling
  - Acceptance: Works in task forms, shows users with avatars, searchable

- [ ] **2.2: Date Picker Field Component** (Size: M)
  - Create `components/projects/DatePickerField.tsx`
  - Integration with CossUI calendar or shadcn
  - Show calendar on input click
  - Validate dates (min/max), relative date display
  - Files: `/components/projects/DatePickerField.tsx`
  - Acceptance: Can pick dates, shows calendar, validates ranges

- [ ] **2.3: Task Form Component** (Size: L)
  - Create `components/projects/TaskForm.tsx` (reusable for create/edit)
  - Fields: title, description, assignee, due date, priority, status, project
  - Form validation, required field checking
  - Handle submit/cancel callbacks
  - Files: `/components/projects/TaskForm.tsx`
  - Acceptance: Form validates, submits with all fields, works in modal

- [ ] **2.4: Project Form Component** (Size: M)
  - Create `components/projects/ProjectForm.tsx` (reusable for edit)
  - Fields: title, description, status, start date, target date, assignees
  - Reuse AssigneePicker for multi-select
  - Files: `/components/projects/ProjectForm.tsx`
  - Acceptance: Edit project dialog works, saves changes

- [ ] **2.5: Create Task Modal** (Size: M)
  - Create `components/projects/CreateTaskModal.tsx`
  - Wraps TaskForm in Dialog from CossUI
  - Integrates with project/kanban context
  - Files: `/components/projects/CreateTaskModal.tsx`
  - Acceptance: Modal opens, creates task, closes on success

- [ ] **2.6: Edit Project Modal** (Size: M)
  - Create `components/projects/EditProjectModal.tsx`
  - Wraps ProjectForm in Dialog
  - Pre-populate with current project data
  - Files: `/components/projects/EditProjectModal.tsx`
  - Acceptance: Modal opens, loads project, saves edits

- [ ] **2.7: Activity Log Component** (Size: M)
  - Create `components/projects/ActivityLog.tsx` (replaces placeholder)
  - Display activities with actor, action, timestamp
  - Group by day
  - Filter by entity type (task/project)
  - Files: `/components/projects/ActivityLog.tsx`
  - Acceptance: Shows real activities, filters work

- [ ] **2.8: Draggable Task Card Enhancement** (Size: M)
  - Enhance `TaskListItem.tsx` or create `DraggableTaskCard.tsx`
  - Integrate with `@dnd-kit/core` or `react-dnd`
  - Drag handle icon (6 dots)
  - Visual feedback during drag (opacity, shadow)
  - Drop target highlighting
  - Files: `/components/projects/TaskListItem.tsx` (modify) or new `DraggableTaskCard.tsx`
  - Acceptance: Tasks draggable between kanban columns, visual feedback works

---

### Phase 3: Kanban Integration & Page Updates (6-7 days)

Connect UI to real data, replace mock data in kanban.

- [ ] **3.1: TasksKanban Real Data Integration** (Size: L)
  - Modify `app/dashboard/tools/tasks/TasksKanban.tsx`
  - Replace mock data with API calls: `GET /api/tasks?projectId=...&status=...`
  - Fetch on mount and after actions
  - Filter by project and assignee from real data
  - Update column counts dynamically
  - Files: `/app/dashboard/tools/tasks/TasksKanban.tsx`
  - Acceptance: Kanban shows real tasks, filters work, counts update

- [ ] **3.2: Kanban Drag-and-Drop Integration** (Size: L)
  - Integrate `@dnd-kit/core` into TasksKanban
  - Implement drop handlers for column transitions
  - Call `PUT /api/tasks/{id}/reorder` on drop
  - Optimistic UI updates (revert on error)
  - Handle concurrent updates gracefully
  - Files: `/app/dashboard/tools/tasks/TasksKanban.tsx`, `/lib/dnd-utils.ts`
  - Acceptance: Drag tasks between columns, persists to DB, reverts on error

- [ ] **3.3: Project Detail Task Creation** (Size: M)
  - Add "Create Task" button to ProjectDetailClient.tsx
  - Opens CreateTaskModal
  - Pre-fills project context
  - Refresh task list on success
  - Files: `/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`
  - Acceptance: Can create task from project detail, appears in list

- [ ] **3.4: Project Detail Task Editing** (Size: M)
  - Add edit buttons/actions to TaskList items
  - Open modal with task data populated
  - Call PATCH endpoint on save
  - Refresh task list
  - Files: `/components/projects/TaskListItem.tsx`, `/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`
  - Acceptance: Can edit task from detail view, changes persist

- [ ] **3.5: Project Edit Dialog** (Size: M)
  - Add "Edit Project" button to ProjectDetailClient header
  - Opens EditProjectModal with project data
  - Update project on save, refresh dashboard
  - Files: `/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`
  - Acceptance: Can edit project from detail, changes reflected on dashboard

- [ ] **3.6: Real Activity Log Integration** (Size: M)
  - Replace activity placeholder in ProjectsDashboard
  - Fetch from `GET /api/activities?entityType=project&limit=20`
  - Display in ActivityLog component
  - Add project/task filtering controls
  - Files: `/app/dashboard/tools/projects/ProjectsDashboard.tsx`, update ActivityLog
  - Acceptance: Shows real activities, filters by entity type

- [ ] **3.7: Task Deletion with Confirmation** (Size: S)
  - Add delete button to task cards/rows
  - Confirm dialog before deletion
  - Call DELETE endpoint
  - Refresh list
  - Files: `/components/projects/TaskListItem.tsx`
  - Acceptance: Can delete task with confirmation, removed from list

- [ ] **3.8: Project Status Transitions** (Size: S)
  - Add status dropdown to project edit form
  - Validate transitions (planning -> active -> completed)
  - Show warning for status changes
  - Files: `/components/projects/ProjectForm.tsx`
  - Acceptance: Can change project status, transitions respected

---

### Phase 4: Refinement & Polish (4-5 days)

Testing, optimization, edge cases, and documentation.

- [ ] **4.1: Form Validation & Error Handling** (Size: M)
  - Add Zod schemas for all form inputs
  - Client-side validation with error messages
  - Server-side validation in API routes
  - Display user-friendly error notifications
  - Files: `lib/validation/forms.ts`, all form components
  - Acceptance: Invalid inputs rejected with clear messages

- [ ] **4.2: Loading States & Skeletons** (Size: M)
  - Add loading skeletons to kanban while fetching
  - Loading state in modals (submit button disabled)
  - Skeleton in activity log while loading
  - Prevent double-submission
  - Files: All components with async operations
  - Acceptance: Loading states visible, no duplicate submissions

- [ ] **4.3: Optimistic Updates & Rollback** (Size: M)
  - Implement optimistic UI for drag-drop
  - Implement optimistic UI for form submissions
  - Rollback on API errors with toast notification
  - Files: `/lib/utils/optimistic.ts`, all async handlers
  - Acceptance: Smooth UX, errors handled gracefully

- [ ] **4.4: Performance Optimization** (Size: M)
  - Implement query pagination for activity log
  - Lazy load comments in project detail
  - Debounce search in assignee picker
  - Memoize expensive components
  - Files: All list/table components
  - Acceptance: Kanban loads < 300ms, search responsive

- [ ] **4.5: E2E & Unit Testing** (Size: L)
  - Write unit tests for form components (Vitest + React Testing Library)
  - Write E2E tests for task creation, editing, deletion
  - Write E2E tests for kanban drag-drop
  - Test error scenarios and edge cases
  - Files: `__tests__/` directories, `.test.tsx` files
  - Acceptance: >80% component coverage, critical flows tested

- [ ] **4.6: Documentation & Code Comments** (Size: S)
  - Add JSDoc comments to API endpoints
  - Document component props and patterns
  - Update `/app/dashboard/tools/projects/README.md` with new features
  - Create `/specs/project-management-api-reference.md`
  - Files: Markdown docs, code comments
  - Acceptance: New developers can understand features quickly

- [ ] **4.7: Accessibility & Keyboard Navigation** (Size: S)
  - Ensure all modals have focus traps
  - Add ARIA labels to form inputs
  - Test keyboard navigation (Tab, Enter, Escape)
  - Test with screen readers
  - Files: All form and modal components
  - Acceptance: Keyboard navigable, ARIA compliant

- [ ] **4.8: Visual Polish & Design System Compliance** (Size: S)
  - Ensure components use consistent spacing (tailwind scale)
  - Check color consistency (primary turquoise, ocean background)
  - Verify glass morphism effects
  - Test dark mode compatibility
  - Files: All component styling
  - Acceptance: Visual consistency, design system compliant

---

## Dependencies

### Technical Dependencies

**New Packages** (add to `package.json`)
```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/utilities": "^3.2.0",
  "@dnd-kit/sortable": "^7.0.0",
  "zod": "^3.22.0",
  "react-hook-form": "^7.48.0"
}
```

**Existing Packages** (already available)
- `@/components/ui/*` — Dialog, Form, Input, Select, Tabs (CossUI)
- `lucide-react` — Icons
- `next` — Framework
- `postgres` — DB connection (already in use)
- `@nextauth/next` — Authentication

### Database Schema

**No migrations needed** — tables exist:
- `projects` (title, description, status, start_date, target_date, assignee_ids[])
- `tasks` (title, description, status, priority, project_id, assignee_id, target_date)
- `comments` (content, author, entity_type, entity_id)

**Possible new columns** (if not present):
```sql
-- If tasks table needs kanban position tracking:
ALTER TABLE tasks ADD COLUMN position INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN task_status VARCHAR(20) DEFAULT 'todo';

-- If activity tracking not present:
CREATE TABLE task_activities (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  project_id UUID REFERENCES projects(id),
  action VARCHAR(50),
  actor_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### External Services

**No external APIs needed** — all internal:
- PostgreSQL (direct connection)
- NextAuth (internal auth)
- Storage component patterns (already in shared/ui)

### Team Dependencies

- **Backend**: Need to ensure API routes in place (covered in Phase 1)
- **Design**: Verify Ozean Licht design system (colors, spacing, typography)
- **QA**: Needed for Phase 4 testing (E2E, accessibility)

### Build & Deploy

- No additional deployment configuration needed
- Coolify deployment uses existing setup
- Database migrations (if any) run via PostgreSQL tools

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Drag-drop library incompatibility | Low | Medium | Use `@dnd-kit` (React 18 compatible), test early (Week 1) |
| Race conditions in kanban reorder | Medium | High | Implement optimistic updates, server-side position conflicts, use transactions |
| Performance degradation with large task lists | Low | Medium | Implement pagination, virtualization if needed, test with 1000+ tasks |
| Form validation complexity | Low | Medium | Use Zod schema validation, test all edge cases in Phase 4 |
| Activity log spam/growth | Medium | Low | Implement retention policy (30-day cleanup), pagination |
| Assignee picker user list size | Low | Medium | Implement search/pagination, lazy load users, cache user list |
| Modal/form accessibility issues | Low | Low | Test with keyboard navigation, use focus traps, ARIA labels |
| Concurrent task updates | Medium | Medium | Lock optimization (version field), last-write-wins or merge strategy |
| Date timezone handling | Low | Medium | Use ISO-8601 format, store as UTC, display in user timezone |

**Mitigation Strategies**:
1. **Test early**: Proof-of-concept drag-drop in Week 1
2. **Incremental release**: Enable feature flags for kanban integration
3. **Monitoring**: Log API errors, track performance metrics
4. **Rollback plan**: Keep mock data option if real data has issues
5. **Database optimization**: Add indexes on task.project_id, task.status, task.position

---

## Success Criteria

- [ ] Users can create tasks from project detail and kanban views
- [ ] Users can edit task properties (name, assignee, due date, status, priority)
- [ ] Users can drag tasks between kanban columns and persist position
- [ ] Users can assign/unassign team members to projects and tasks
- [ ] Kanban board shows real data from database (no mock data)
- [ ] Activity log displays real events (create, update, assign) with timestamps
- [ ] All forms have client-side and server-side validation
- [ ] Performance meets targets: < 300ms kanban load, < 100ms task create
- [ ] No console errors or warnings in production build
- [ ] Accessibility audit passes (WCAG 2.1 AA standard)
- [ ] Unit tests cover form components (>80% coverage)
- [ ] E2E tests cover critical user flows (create, edit, delete, drag-drop)
- [ ] Documentation updated with new features and API reference

---

## Implementation Phases Summary

| Phase | Duration | Deliverable | Blockers |
|-------|----------|------------|----------|
| 1: Foundation | 5-6 days | API endpoints, DB functions | None |
| 2: Components | 6-7 days | Reusable UI components | Phase 1 complete |
| 3: Integration | 6-7 days | Real data in kanban, modals working | Phase 1 & 2 complete |
| 4: Polish | 4-5 days | Tests, docs, optimizations | Phase 3 complete |
| **Total** | **21-25 days** | **Full MVP** | - |

**Parallelization Opportunities**:
- Phase 2 components can start after 1.3 (activities.ts) completes
- Phase 3 can start after all Phase 2 components done
- Testing in Phase 4 can start as components complete

---

## Code Examples

### Example 1: Task Creation API Route

```typescript
// app/api/tasks/route.ts (enhanced)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { createTask } from '@/lib/db/tasks';
import { logActivity } from '@/lib/db/activities';
import { CreateTaskInput } from '@/types/projects';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  projectId: z.string().uuid('Invalid project ID'),
  assigneeId: z.string().uuid('Invalid assignee ID').optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']).default('todo'),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createTaskSchema.parse(body);

    // Create task
    const task = await createTask({
      title: validated.title,
      description: validated.description,
      project_id: validated.projectId,
      assignee_id: validated.assigneeId,
      target_date: validated.dueDate,
      priority: validated.priority || 'medium',
      status: validated.status,
      created_by: session.user.id,
    });

    // Log activity
    await logActivity({
      entity_type: 'task',
      entity_id: task.id,
      action: 'created',
      actor_id: session.user.id,
      actor_name: session.user.name,
      actor_email: session.user.email,
      details: { title: validated.title },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
```

### Example 2: Assignee Picker Component

```typescript
// components/projects/AssigneePicker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AssigneePickerProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  projectId?: string;
  placeholder?: string;
}

export default function AssigneePicker({
  value,
  onChange,
  multiple = false,
  projectId,
  placeholder = 'Select assignee...',
}: AssigneePickerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users on mount and search change
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (projectId) params.append('projectId', projectId);

        const res = await fetch(`/api/users?${params.toString()}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300); // Debounce
    return () => clearTimeout(timer);
  }, [search, projectId]);

  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const selectedUsers = users.filter(u => selectedIds.includes(u.id));

  const handleSelect = (userId: string) => {
    if (multiple) {
      const newValue = selectedIds.includes(userId)
        ? selectedIds.filter(id => id !== userId)
        : [...selectedIds, userId];
      onChange(newValue);
    } else {
      onChange(userId);
      setIsOpen(false);
    }
  };

  const handleRemove = (userId: string) => {
    if (multiple) {
      onChange(selectedIds.filter(id => id !== userId));
    } else {
      onChange('');
    }
  };

  return (
    <div className="relative">
      <div className="border border-primary/20 rounded-lg p-2 bg-[#00111A]/50 flex flex-wrap gap-2">
        {selectedUsers.map(user => (
          <Badge key={user.id} variant="secondary" className="gap-2">
            <span className="text-xs">{user.name}</span>
            <button
              onClick={() => handleRemove(user.id)}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="border-0 bg-transparent p-0 focus:outline-none min-w-48"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/20 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-3 text-center text-[#C4C8D4]">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-3 text-center text-[#C4C8D4]">No users found</div>
          ) : (
            users.map(user => (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className="w-full px-4 py-2 text-left hover:bg-primary/10 border-b border-primary/10 last:border-0 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">{user.name}</div>
                  <div className="text-xs text-[#C4C8D4]">{user.email}</div>
                </div>
                {selectedIds.includes(user.id) && (
                  <span className="text-primary">✓</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

### Example 3: Task Form Component

```typescript
// components/projects/TaskForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import AssigneePicker from './AssigneePicker';
import DatePickerField from './DatePickerField';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']).default('todo'),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  projectId: string;
  task?: any;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({ projectId, task, onSubmit, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      assigneeId: task?.assignee_id || '',
      dueDate: task?.target_date || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'todo',
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Task title..." />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Task details..." />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <AssigneePicker
                  value={field.value}
                  onChange={field.onChange}
                  projectId={projectId}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePickerField value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
```

---

## References

### Existing Documentation
- `/opt/ozean-licht-ecosystem/apps/admin/.claude/CLAUDE.md` — Admin dashboard patterns
- `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/projects/README.md` — Project structure
- `/opt/ozean-licht-ecosystem/shared/ui/README.md` — Component library

### Key Files
- `/opt/ozean-licht-ecosystem/apps/admin/lib/db/projects.ts` — Project DB functions
- `/opt/ozean-licht-ecosystem/apps/admin/app/api/projects/[id]/route.ts` — Project API pattern
- `/opt/ozean-licht-ecosystem/apps/admin/components/projects/ProjectCard.tsx` — UI component pattern
- `/opt/ozean-licht-ecosystem/shared/ui/src/storage/create-folder-dialog.tsx` — Dialog pattern
- `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/tools/tasks/TasksKanban.tsx` — Kanban view (mock data)

### Libraries & Standards
- `@dnd-kit/core` — Drag-and-drop (React 18 compatible)
- `zod` — Schema validation
- `react-hook-form` — Form state management
- CossUI & shadcn — Component library
- WCAG 2.1 AA — Accessibility standard

### Design System
- Primary Color: `#0ec2bc` (turquoise)
- Background: `#00070F` (deep ocean)
- Glass Morphism: `backdrop-blur-12`, `bg-card/70`
- Typography: Cinzel Decorative (headers), Montserrat 300-500 (body)
- Spacing: Tailwind scale (2, 3, 4, 6, 8 units)

---

## Appendix: Kanban Reordering Algorithm

```typescript
// lib/db/task-ordering.ts
/**
 * Reorder task in kanban board
 * Handles position updates when task moves within or between columns
 */
export async function reorderTaskInKanban(
  taskId: string,
  newStatus: string,
  newPosition: number
): Promise<Task> {
  return await transaction(async (client) => {
    // 1. Get current task
    const currentTask = await client.query<Task>(
      'SELECT * FROM tasks WHERE id = $1 FOR UPDATE',
      [taskId]
    );

    if (!currentTask.rows[0]) throw new Error('Task not found');

    const currentStatus = currentTask.rows[0].status;

    // 2. If status changed, reset positions in old column and insert at position in new
    if (currentStatus !== newStatus) {
      // Remove from old column
      await client.query(
        'UPDATE tasks SET position = position - 1 WHERE project_id = $1 AND status = $2 AND position > $3',
        [currentTask.rows[0].project_id, currentStatus, currentTask.rows[0].position]
      );

      // Shift positions in new column
      await client.query(
        'UPDATE tasks SET position = position + 1 WHERE project_id = $1 AND status = $2 AND position >= $3',
        [currentTask.rows[0].project_id, newStatus, newPosition]
      );

      // Update task
      await client.query(
        'UPDATE tasks SET status = $1, position = $2 WHERE id = $3',
        [newStatus, newPosition, taskId]
      );
    } else {
      // Same column reorder
      const oldPosition = currentTask.rows[0].position;
      if (newPosition > oldPosition) {
        // Moving down
        await client.query(
          'UPDATE tasks SET position = position - 1 WHERE project_id = $1 AND status = $2 AND position > $3 AND position <= $4',
          [currentTask.rows[0].project_id, newStatus, oldPosition, newPosition]
        );
      } else if (newPosition < oldPosition) {
        // Moving up
        await client.query(
          'UPDATE tasks SET position = position + 1 WHERE project_id = $1 AND status = $2 AND position >= $3 AND position < $4',
          [currentTask.rows[0].project_id, newStatus, newPosition, oldPosition]
        );
      }
      await client.query('UPDATE tasks SET position = $1 WHERE id = $2', [newPosition, taskId]);
    }

    // 3. Return updated task
    const result = await client.query<Task>('SELECT * FROM tasks WHERE id = $1', [taskId]);
    return result.rows[0];
  });
}
```

---

## Version History

| Date | Version | Author | Status |
|------|---------|--------|--------|
| 2025-12-02 | 1.0 | Planning Agent | Complete |

---

**Last Updated:** 2025-12-02
**Status:** Ready for Implementation
**Next Step:** Begin Phase 1 (Foundation & Data Layer)
