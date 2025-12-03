# Project Management System Spec

> **Version:** 4.0 (Post-MVP Roadmap)
> **Updated:** 2025-12-02
> **Focus:** Content Production System + Advanced Features

---

## Status Overview

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | DONE | Database & APIs (10 tables, 12 endpoints) |
| **Phase 2** | DONE | Content & Workflow Components (8 components) |
| **Phase 3** | DONE | Kanban Integration (real data, drag-drop) |
| **Phase 4** | DONE | Approvals & Publishing (categories, labels, gates) |
| **Phase 5-6** | DONE | Polish & Testing (validation, loading, activity) |
| **Phase 7** | NEXT | Edit & Quick Fixes |
| Phase 8 | Planned | Subtasks |
| Phase 9 | Planned | Time Tracking |
| Phase 10 | Planned | Sprints |
| Phase 11 | Planned | File Attachments |
| Phase 12 | Planned | Collaboration |
| Phase 13 | Planned | Advanced Views |

---

## MVP Completed (Phases 1-6)

### Phase 1: Database & APIs
**Commit:** `2d73a55` | **Files:** 24 | **Lines:** ~4,985

- 10 database tables (workflows, content types, roles, assignments, checklists)
- 12 API endpoints
- 4 workflows, 7 content types, 9 roles seeded

### Phase 2: Content & Workflow Components
**Components:** 8 | **Location:** `components/projects/`

- ContentTypeSelector, WorkflowStatusPicker, ContentItemCard
- RoleAssignmentPicker, ChecklistEditor, TaskGuidePanel
- TaskForm, ProjectForm

### Phase 3: Kanban Integration
**Commit:** `42b20eb`

- Real data in kanban (replaced mock data)
- Drag-drop with @dnd-kit
- Task cards with priority, assignee avatars

### Phase 4: Approvals & Publishing
**Commit:** `7a1a945`

- CategoryPicker (hierarchical tree)
- LabelManager (tag CRUD)
- ApprovalGate (sign-off UI)
- PublishScheduler (multi-platform)

### Phase 5-6: Polish & Testing
**Commit:** `4273a77`

- Form validation with Zod
- Loading states and skeletons
- ActivityLog component
- Error handling with toasts

---

## Phase 7: Edit & Quick Fixes

**Goal:** Fix UX gaps and enable inline editing
**Effort:** ~7 hours | **Lines:** ~330

### Known Issues

| Issue | Location | Fix |
|-------|----------|-----|
| Missing "Assigned To" field | `TaskDetailClient.tsx` | Add assignee display section |
| Duplicate "Activity" heading | `ActivityLog.tsx` | Remove redundant heading |
| No task edit | Task detail page | Add TaskEditModal |
| No project edit | Project detail page | Add ProjectEditModal |
| Comments not working | `TaskDetailClient.tsx`, `ProjectDetailClient.tsx` | Wire up CommentThread component |
| task_code too short | `lib/db/tasks.ts`, migration | Expand from 3 to 5 digits |

### 7.1 TaskEditModal (~60 lines)

Wrap TaskForm in Dialog for editing existing tasks.

```tsx
interface TaskEditModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
```

**Requirements:**
- Reuse existing TaskForm component
- Pre-populate with task data
- PATCH to `/api/tasks/[id]`
- Close and refresh on success
- Edit button on TaskDetailClient header

---

### 7.2 ProjectEditModal (~60 lines)

Wrap ProjectForm in Dialog for editing existing projects.

```tsx
interface ProjectEditModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
```

**Requirements:**
- Reuse existing ProjectForm component
- Pre-populate with project data
- PATCH to `/api/projects/[id]`
- Edit button on ProjectDetailClient header

---

### 7.3 Fix: Assigned To Display (~20 lines)

Add assignee section to TaskDetailClient.

```tsx
// In task detail info section
<div className="flex items-center gap-2">
  <UserIcon className="w-4 h-4 text-primary" />
  <span className="text-[#C4C8D4]">Assigned to:</span>
  {task.assignee ? (
    <span className="text-white">{task.assignee.name}</span>
  ) : (
    <span className="text-[#C4C8D4] italic">Unassigned</span>
  )}
</div>
```

---

### 7.4 Fix: Activity Panel Duplicate (~5 lines)

Remove redundant "Activity" heading from ActivityLog component or parent wrapper.

**Check:** `ActivityLog.tsx` and `TaskDetailClient.tsx` / `ProjectDetailClient.tsx`

---

### 7.5 Fix: Comments Integration (~80 lines)

Wire up existing CommentThread/CommentForm components to detail pages.

**Current State:**
- `CommentThread.tsx` and `CommentForm.tsx` exist with full functionality
- API routes exist: `/api/projects/[id]/comments`, `/api/tasks/[id]/comments`
- `lib/db/comments.ts` has full CRUD
- Detail pages render comments read-only with broken "Add Comment" button

**Fix Required:**

```tsx
// In TaskDetailClient.tsx - Replace manual comment rendering with:
import CommentThread from '@/components/projects/CommentThread';

// In the comments section:
<CommentThread
  comments={comments}
  entityType="task"
  entityId={task.id}
  currentUserEmail={user.email}
  isAdmin={user.adminRole === 'super_admin'}
  onCommentAdded={(comment) => setComments([...comments, comment])}
  onCommentUpdated={(updated) => setComments(comments.map(c =>
    c.id === updated.id ? updated : c
  ))}
  onCommentDeleted={(id) => setComments(comments.filter(c => c.id !== id))}
/>
```

**Requirements:**
- Replace inline comment display with CommentThread component
- Add state management for comments (currently static from server)
- Pass user info for author identification
- Handle add/update/delete callbacks to refresh UI
- Apply to both TaskDetailClient and ProjectDetailClient

---

### 7.6 Fix: Expand task_code to 5 Digits (~30 lines)

Increase task_code from 3 digits (1,000 max) to 5 digits (100,000 max).

**Current State:**
- task_code format: `TASK-001`, `TASK-002`, etc.
- 3 digits = 1,000 combinations before overflow
- Will hit limit quickly with active project management

**Migration:**

```sql
-- Migration: 008_expand_task_code.sql

-- Step 1: Alter column to accommodate longer codes
ALTER TABLE tasks
ALTER COLUMN task_code TYPE VARCHAR(15);

-- Step 2: Update existing codes to 5-digit format
UPDATE tasks
SET task_code = 'TASK-' || LPAD(
  SUBSTRING(task_code FROM 'TASK-([0-9]+)')::text,
  5,
  '0'
)
WHERE task_code IS NOT NULL
  AND task_code ~ '^TASK-[0-9]{1,4}$';

-- Step 3: Update sequence/counter if stored separately
-- (Check if there's a counter table or if it's derived from MAX)
```

**Code Changes:**

```typescript
// In lib/db/tasks.ts - Update generateTaskCode function
async function generateTaskCode(): Promise<string> {
  const result = await query<{ max_num: string }>(
    `SELECT COALESCE(
      MAX(CAST(SUBSTRING(task_code FROM 'TASK-([0-9]+)') AS INTEGER)),
      0
    ) as max_num FROM tasks`
  );
  const nextNum = parseInt(result[0]?.max_num || '0', 10) + 1;
  return `TASK-${nextNum.toString().padStart(5, '0')}`; // Changed from 3 to 5
}
```

**Result:**
- Old: `TASK-001` → New: `TASK-00001`
- Existing codes migrated: `TASK-042` → `TASK-00042`
- Capacity: 100,000 tasks before overflow

---

## Phase 8: Subtasks

**Goal:** Hierarchical task breakdown
**Effort:** ~6 hours | **Lines:** ~250

### Database

```sql
-- parent_task_id already exists in tasks table
-- Just need to utilize it
```

### API Updates

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET | Add `parentTaskId` filter |
| `/api/tasks` | POST | Support `parentTaskId` in body |
| `/api/tasks/[id]/subtasks` | GET | Get subtasks of a task |

### 8.1 SubtaskList (~80 lines)

Display subtasks with progress.

```tsx
interface SubtaskListProps {
  parentTaskId: string;
  subtasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onAddSubtask: (title: string) => void;
}
```

**Requirements:**
- Checkbox list of subtasks
- Progress bar (X of Y complete)
- Inline "Add subtask" input
- Click to expand/view subtask

---

### 8.2 SubtaskProgress (~30 lines)

Show subtask completion on parent task cards.

```tsx
interface SubtaskProgressProps {
  completed: number;
  total: number;
}
```

**Display:** "3/5 subtasks" with mini progress bar

---

### 8.3 Parent Task Reference (~20 lines)

Show parent task link on subtask detail.

```tsx
// In TaskDetailClient
{task.parentTaskId && (
  <Link href={`/dashboard/tools/tasks/${task.parentTaskId}`}>
    Parent: {parentTask.title}
  </Link>
)}
```

---

## Phase 9: Time Tracking

**Goal:** Log time spent on tasks
**Effort:** ~6 hours | **Lines:** ~280

### Database

```sql
-- task_time_entries table
CREATE TABLE IF NOT EXISTS task_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id),
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  is_billable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Routes

| Endpoint | Methods |
|----------|---------|
| `/api/tasks/[id]/time-entries` | GET, POST |
| `/api/tasks/[id]/time-entries/[entryId]` | PATCH, DELETE |

### 9.1 TimeEntryForm (~70 lines)

Log time on a task.

```tsx
interface TimeEntryFormProps {
  taskId: string;
  onSubmit: (entry: CreateTimeEntryInput) => void;
}
```

**Fields:**
- Duration (hours:minutes input)
- Description (optional)
- Date (defaults to today)
- Billable toggle

---

### 9.2 TimeEntryList (~60 lines)

Display logged time entries.

```tsx
interface TimeEntryListProps {
  entries: TaskTimeEntry[];
  onDelete?: (entryId: string) => void;
}
```

**Display:** Date, duration, user, description

---

### 9.3 TaskTimeDisplay (~30 lines)

Show total time on task cards/detail.

```tsx
interface TaskTimeDisplayProps {
  estimatedHours?: number;
  actualHours: number;
}
```

**Display:** "4.5h / 8h estimated" with visual indicator

---

## Phase 10: Sprints

**Goal:** Time-boxed iterations for projects
**Effort:** ~8 hours | **Lines:** ~350

### Database

```sql
-- sprints table (if not exists)
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  velocity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sprint_id to tasks if not exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES sprints(id);
```

### API Routes

| Endpoint | Methods |
|----------|---------|
| `/api/projects/[id]/sprints` | GET, POST |
| `/api/sprints/[id]` | GET, PATCH, DELETE |
| `/api/sprints/[id]/tasks` | GET |

### 10.1 SprintSelector (~50 lines)

Dropdown to assign task to sprint.

```tsx
interface SprintSelectorProps {
  projectId: string;
  value?: string;
  onChange: (sprintId: string | null) => void;
}
```

---

### 10.2 SprintBoard (~120 lines)

Sprint-specific kanban view.

```tsx
interface SprintBoardProps {
  sprintId: string;
}
```

**Requirements:**
- Filter kanban to sprint tasks only
- Sprint header with dates, goal
- Sprint progress/burndown

---

### 10.3 SprintManager (~80 lines)

Create/edit sprints for a project.

```tsx
interface SprintManagerProps {
  projectId: string;
  sprints: Sprint[];
  onCreateSprint: (data: CreateSprintInput) => void;
  onUpdateSprint: (id: string, data: UpdateSprintInput) => void;
}
```

---

### 10.4 SprintStatsWidget (~50 lines)

Sprint burndown and velocity.

```tsx
interface SprintStatsWidgetProps {
  sprint: Sprint;
  tasks: Task[];
}
```

**Display:** Tasks remaining, story points, days left, burndown chart

---

## Phase 11: File Attachments

**Goal:** Attach files to tasks
**Effort:** ~6 hours | **Lines:** ~250

### Database

```sql
CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size_bytes BIGINT,
  uploaded_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Routes

| Endpoint | Methods |
|----------|---------|
| `/api/tasks/[id]/attachments` | GET, POST |
| `/api/tasks/[id]/attachments/[attachmentId]` | DELETE |

### 11.1 AttachmentUploader (~80 lines)

Upload files to task (reuse storage components).

```tsx
interface AttachmentUploaderProps {
  taskId: string;
  onUpload: (attachment: TaskAttachment) => void;
}
```

**Requirements:**
- Reuse FileDropzone from `@ozean-licht/shared-ui`
- Upload to S3 via `/api/storage/upload`
- Create attachment record
- Show upload progress

---

### 11.2 AttachmentList (~60 lines)

Display attached files.

```tsx
interface AttachmentListProps {
  attachments: TaskAttachment[];
  onDelete?: (attachmentId: string) => void;
}
```

**Display:** File icon, name, size, download link, delete button

---

### 11.3 AttachmentPreview (~50 lines)

Preview images/PDFs inline.

```tsx
interface AttachmentPreviewProps {
  attachment: TaskAttachment;
}
```

**Requirements:**
- Image: Show thumbnail, click to enlarge
- PDF: Show first page preview
- Other: Show file type icon

---

## Phase 12: Collaboration

**Goal:** @mentions and notifications
**Effort:** ~8 hours | **Lines:** ~350

### Database

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES admin_users(id) ON DELETE CASCADE,
  in_app BOOLEAN DEFAULT true,
  email_digest VARCHAR(20) DEFAULT 'daily',
  mention_notify BOOLEAN DEFAULT true,
  assignment_notify BOOLEAN DEFAULT true,
  comment_notify BOOLEAN DEFAULT true
);
```

### API Routes

| Endpoint | Methods |
|----------|---------|
| `/api/notifications` | GET |
| `/api/notifications/[id]/read` | POST |
| `/api/notifications/read-all` | POST |
| `/api/notifications/preferences` | GET, PATCH |

### 12.1 MentionParser (~40 lines)

Parse @mentions in comment content.

```tsx
function parseMentions(content: string): {
  html: string;
  mentionedUserIds: string[]
}
```

**Requirements:**
- Detect @username patterns
- Convert to user links
- Return list of mentioned user IDs

---

### 12.2 NotificationCenter (~100 lines)

In-app notification dropdown.

```tsx
interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}
```

**Requirements:**
- Bell icon with unread count badge
- Dropdown list of notifications
- Click to navigate and mark read
- "Mark all read" action

---

### 12.3 NotificationPreferences (~60 lines)

User notification settings.

```tsx
interface NotificationPreferencesProps {
  preferences: NotificationPrefs;
  onSave: (prefs: NotificationPrefs) => void;
}
```

**Settings:**
- In-app notifications (toggle)
- Email digest (none/daily/weekly)
- Notify on mentions/assignments/comments

---

## Phase 13: Advanced Views

**Goal:** Power user productivity features
**Effort:** ~8 hours | **Lines:** ~400

### 13.1 SavedFilters (~80 lines)

Save and load filter presets.

```tsx
interface SavedFiltersProps {
  filters: FilterPreset[];
  currentFilter: FilterState;
  onSave: (name: string, filter: FilterState) => void;
  onLoad: (filter: FilterPreset) => void;
  onDelete: (id: string) => void;
}
```

**Storage:** localStorage or user preferences table

---

### 13.2 ColumnCustomizer (~60 lines)

Toggle visible columns in list views.

```tsx
interface ColumnCustomizerProps {
  availableColumns: Column[];
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}
```

---

### 13.3 TimelineView (~150 lines)

Gantt-style timeline for project tasks.

```tsx
interface TimelineViewProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
}
```

**Requirements:**
- Horizontal scrolling timeline
- Task bars showing start/due dates
- Drag to adjust dates
- Dependencies visualization (optional)

---

### 13.4 ExportButton (~40 lines)

Export tasks/projects to CSV.

```tsx
interface ExportButtonProps {
  data: Task[] | Project[];
  filename: string;
}
```

---

## Future Considerations (Post-Phase 13)

These are documented for later consideration:

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Cmd+K Command Palette** | Quick actions, navigation | Medium |
| **Keyboard Shortcuts** | Task actions, navigation | Low |
| **Bulk Operations** | Multi-select, bulk status change | Medium |
| **Dependencies Graph** | Visual task dependencies | High |
| **Resource Planning** | Team workload view | High |
| **Templates from Projects** | Save project as template | Medium |
| **Recurring Tasks** | Auto-create on schedule | Medium |
| **Webhooks** | External integrations | Medium |
| **API Keys** | Third-party access | Medium |

---

## Type Definitions Reference

Types already exist in `types/projects.ts`:

```typescript
// Core entities
interface Project { ... }
interface Task { ... }
interface Sprint { ... }
interface ProcessTemplate { ... }

// Activity & collaboration
interface TaskComment { ... }
interface TaskAttachment { ... }
interface TaskTimeEntry { ... }
interface TaskActivity { ... }

// Workflow & content
interface ContentType { ... }
interface ContentItem { ... }
interface WorkflowStatus { ... }
interface ProjectRole { ... }
interface TaskAssignment { ... }
interface TaskChecklist { ... }
interface TaskGuide { ... }
```

---

## Design System Reminder

| Token | Value |
|-------|-------|
| Primary | `#0ec2bc` |
| Background | `#00070F` |
| Card | `#00111A` |
| Border | `#0E282E` |
| Text | `#C4C8D4` |
| Heading | `#FFFFFF` |

**Fonts:** Montserrat (main), Cinzel Decorative (H1/H2 only), max weight Medium (600)

**Glass morphism:**
```css
background: rgba(0, 17, 26, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(14, 166, 193, 0.25);
```

---

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Database modules | `apps/admin/lib/db/` |
| API routes | `apps/admin/app/api/` |
| Components | `apps/admin/components/projects/` |
| Types | `apps/admin/types/projects.ts` |
| Project pages | `apps/admin/app/dashboard/tools/projects/` |
| Task pages | `apps/admin/app/dashboard/tools/tasks/` |

---

## Changelog

### v4.0 (2025-12-02)
- Marked Phases 1-6 as DONE
- Added Phase 7: Edit & Quick Fixes (known issues)
- Added Phase 8-13: Post-MVP feature phases
- Documented future considerations
- Updated type references

### v3.0 (2025-12-02)
- Consolidated spec to lean MVP focus
- 8 components, ~720 lines total

---

**Next Step:** Phase 7.1 - Fix known issues and add edit modals
