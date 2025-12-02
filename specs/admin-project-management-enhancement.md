# Plan: Admin Project Management System Enhancement

## Task Description

Enhance the prototype project management system in the admin dashboard to use the migrated PostgreSQL data (projects: 658, tasks: 9,114, process_templates: 89) instead of mock data. The enhancement focuses on UX improvements including:

- Priority indicators using colored dots (red=high, orange=moderate, green=low)
- "My Tasks" section followed by "All Tasks" section
- Compact, expandable task list items with sub-tasks and descriptions
- Tab navigation: Active (default), Overdue, Planned, Done (History)
- Single Task detail page and Single Project detail page
- **New Project Form** with chooseable process templates to start from
- **Commenting feature** for tasks and projects
- **All Tasks page** with comprehensive filter, sort, and search functionality
- Consistent use of shared/ui components

**Task Type:** Enhancement
**Complexity:** Complex

## Objective

Transform the project management prototype from mock data to a fully functional system connected to PostgreSQL via direct database queries, with an improved UX featuring compact task displays, priority visualization, and dedicated detail pages for tasks and projects.

## Problem Statement

The current project management dashboard:
1. Uses hardcoded mock data (6 projects, 10 tasks)
2. Has no API integration with the migrated PostgreSQL data
3. Lacks priority visualization (dots/circles)
4. Task items are not compact or expandable
5. No dedicated detail pages for tasks/projects
6. No tab-based filtering for task states
7. No way to create new projects (especially from templates)
8. No commenting/discussion feature for collaboration
9. No comprehensive task search/filter/sort functionality
10. 89 process templates exist but aren't usable for project creation

## Solution Approach

1. **Data Layer:** Create database query functions and API routes to fetch projects/tasks from `ozean-licht-db`
2. **Priority System:** Add priority field handling (derive from metadata or add column) with visual dot indicators
3. **Compact Task List:** Build expandable task items using Collapsible/Accordion from shared/ui
4. **Tab Navigation:** Implement filtered views (Active, Overdue, Planned, Done) using Tabs component
5. **Detail Pages:** Create `/projects/[id]` and `/tasks/[id]` routes with full CRUD capability
6. **New Project Form:** Multi-step dialog with template selection (89 templates), auto-generate tasks from template
7. **Comments System:** Add comments table, API routes, and threaded comment UI for tasks and projects
8. **All Tasks Page:** Dedicated `/tasks` route with DataTable, filters (status, project, assignee, date range), sorting, and search
9. **UX Polish:** Apply glass-morphism design, smooth transitions, responsive layout

## Relevant Files

### Existing Files to Modify

- `apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx` - Replace mock data with API calls, add task tabs
- `apps/admin/app/dashboard/tools/projects/page.tsx` - Server-side data fetching
- `apps/admin/components/projects/MyTasksWidget.tsx` - Connect to real data, add priority dots
- `apps/admin/components/projects/ProjectCard.tsx` - Add click navigation to detail page
- `apps/admin/components/projects/index.ts` - Export new components
- `apps/admin/lib/db/index.ts` - Add project/task database functions
- `apps/admin/types/admin.ts` - Extend with Project/Task types

### New Files to Create

#### API Routes
- `apps/admin/app/api/projects/route.ts` - GET all projects, POST create project
- `apps/admin/app/api/projects/[id]/route.ts` - GET/PATCH/DELETE single project
- `apps/admin/app/api/projects/[id]/comments/route.ts` - GET/POST project comments
- `apps/admin/app/api/tasks/route.ts` - GET all tasks (with filters), POST create task
- `apps/admin/app/api/tasks/[id]/route.ts` - GET/PATCH/DELETE single task
- `apps/admin/app/api/tasks/[id]/comments/route.ts` - GET/POST task comments
- `apps/admin/app/api/templates/route.ts` - GET process templates for project creation
- `apps/admin/app/api/comments/[id]/route.ts` - PATCH/DELETE single comment

#### Database Functions
- `apps/admin/lib/db/projects.ts` - Project query functions (already exists, extend)
- `apps/admin/lib/db/tasks.ts` - Task query functions (new)
- `apps/admin/lib/db/comments.ts` - Comment query functions (new)
- `apps/admin/lib/db/templates.ts` - Process template query functions (new)

#### Database Migration
- `shared/database/migrations/031_create_comments_table.sql` - Comments table for tasks/projects

#### Detail Pages
- `apps/admin/app/dashboard/tools/projects/[id]/page.tsx` - Single project page
- `apps/admin/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx` - Project detail UI
- `apps/admin/app/dashboard/tools/projects/new/page.tsx` - New project page
- `apps/admin/app/dashboard/tools/projects/new/NewProjectClient.tsx` - New project form UI
- `apps/admin/app/dashboard/tools/tasks/page.tsx` - All tasks list page with filters
- `apps/admin/app/dashboard/tools/tasks/TasksPageClient.tsx` - Tasks page with DataTable
- `apps/admin/app/dashboard/tools/tasks/[id]/page.tsx` - Single task page
- `apps/admin/app/dashboard/tools/tasks/[id]/TaskDetailClient.tsx` - Task detail UI
- `apps/admin/app/dashboard/tools/tasks/layout.tsx` - Tasks section layout
- `apps/admin/app/dashboard/tools/tasks/columns.tsx` - DataTable column definitions

#### New Components
- `apps/admin/components/projects/TaskListItem.tsx` - Compact expandable task row
- `apps/admin/components/projects/TaskList.tsx` - Container for task list with tabs
- `apps/admin/components/projects/PriorityDot.tsx` - Priority indicator component
- `apps/admin/components/projects/ProjectDetailCard.tsx` - Project info card
- `apps/admin/components/projects/TaskDetailCard.tsx` - Task info card
- `apps/admin/components/projects/NewProjectDialog.tsx` - Multi-step project creation dialog
- `apps/admin/components/projects/TemplateSelector.tsx` - Template picker with preview
- `apps/admin/components/projects/CommentThread.tsx` - Threaded comments display
- `apps/admin/components/projects/CommentForm.tsx` - Add/edit comment form
- `apps/admin/components/projects/TasksDataTable.tsx` - DataTable for all tasks view
- `apps/admin/components/projects/TaskFilters.tsx` - Filter panel (status, project, date, assignee)

## Implementation Phases

### Phase 1: Foundation (Data Layer)
1. Create database query functions for projects and tasks
2. Add API routes with filtering support
3. Define TypeScript types matching database schema
4. Test API endpoints with curl
5. Create comments table migration

### Phase 2: Core UI Components
1. Create PriorityDot component with color mapping
2. Build compact TaskListItem with Collapsible expansion
3. Create TaskList container with tab filtering
4. Update existing components to use real data

### Phase 3: Detail Pages
1. Create single project page with task list
2. Create single task page with edit capability
3. Add navigation between pages

### Phase 4: New Project Form & Templates
1. Create TemplateSelector component with template preview
2. Build NewProjectDialog with multi-step flow (info → template → tasks)
3. Implement template-to-tasks generation logic
4. Add "New Project" button to dashboard

### Phase 5: Comments System
1. Create comments database table
2. Implement comments API routes
3. Build CommentThread and CommentForm components
4. Add comments section to project and task detail pages
5. Support threaded replies

### Phase 6: All Tasks Page
1. Create dedicated tasks page with DataTable
2. Implement TaskFilters component (status, project, assignee, date range)
3. Add search functionality
4. Implement column sorting
5. Add bulk actions (mark done, change status)

### Phase 7: Polish & Integration
1. Apply consistent styling and transitions
2. Handle loading/error states
3. Add empty states with helpful actions
4. Test all features end-to-end
5. Mobile responsiveness

## Step by Step Tasks

### 1. Define TypeScript Types

Create/extend type definitions matching the PostgreSQL schema:

- Edit `apps/admin/types/admin.ts`:
```typescript
// Priority derived from status urgency or explicit field
export type TaskPriority = 'high' | 'moderate' | 'low';

export interface DBProject {
  id: string;
  airtable_id: string | null;
  title: string;
  description: string | null;
  project_type: string | null;
  interval_type: string | null;
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled' | 'todo' | 'not_started';
  progress_percent: number;
  tasks_total: number;
  tasks_done: number;
  used_template: boolean;
  start_date: string | null;
  target_date: string | null;
  day_of_publish: string | null;
  assignee_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface DBTask {
  id: string;
  airtable_id: string | null;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done' | 'completed' | 'overdue' | 'planned' | 'paused' | 'blocked';
  is_done: boolean;
  task_order: number;
  start_date: string | null;
  target_date: string | null;
  finished_at: string | null;
  project_id: string | null;
  project_airtable_id: string | null;
  assignee_ids: string[];
  created_at: string;
  updated_at: string;
  // Joined field
  project_title?: string;
}
```

### 2. Create Database Query Functions

Create `apps/admin/lib/db/tasks.ts`:

- Implement `getAllTasks(filters)` - with status filtering
- Implement `getTaskById(id)` - single task with project info
- Implement `getTasksByProjectId(projectId)` - tasks for a project
- Implement `updateTask(id, data)` - update task status/fields
- Implement `getMyTasks(userId)` - tasks assigned to current user

Extend `apps/admin/lib/db/projects.ts`:

- Add `getProjectWithTasks(id)` - project with related tasks
- Update `getAllProjects(filters)` - add status filtering

### 3. Create API Routes

**`apps/admin/app/api/projects/route.ts`:**
```typescript
// GET: List projects with optional filters
// Query params: status, type, search, limit, offset
// Returns: { projects: DBProject[], total: number }
```

**`apps/admin/app/api/projects/[id]/route.ts`:**
```typescript
// GET: Single project with tasks
// PATCH: Update project
// DELETE: Soft delete project
```

**`apps/admin/app/api/tasks/route.ts`:**
```typescript
// GET: List tasks with filters
// Query params: status, projectId, assignee, priority, tab (active|overdue|planned|done)
// POST: Create new task
```

**`apps/admin/app/api/tasks/[id]/route.ts`:**
```typescript
// GET: Single task with project info
// PATCH: Update task (status, is_done, etc.)
// DELETE: Soft delete task
```

### 4. Create PriorityDot Component

Create `apps/admin/components/projects/PriorityDot.tsx`:

```typescript
// Props: priority: 'high' | 'moderate' | 'low', size?: 'sm' | 'md' | 'lg'
// Visual: Simple colored circle
// Colors: high=red-500, moderate=orange-500, low=green-500
// Use Tailwind: rounded-full, w-2/w-3, h-2/h-3, bg-{color}
```

- Add hover tooltip showing priority text
- Support inline and standalone display modes

### 5. Create Compact TaskListItem Component

Create `apps/admin/components/projects/TaskListItem.tsx`:

- Use Collapsible from shared/ui for expand/collapse
- Compact height when collapsed (~48px)
- Show: checkbox, priority dot, task name, due date, project badge
- Expanded shows: description, sub-tasks list, action buttons
- Smooth expand animation
- Click anywhere to expand (except checkbox)
- Overdue visual indicator (red border/background)

```typescript
interface TaskListItemProps {
  task: DBTask;
  onToggleDone: (id: string, isDone: boolean) => void;
  onNavigate: (id: string) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}
```

### 6. Create TaskList Container with Tabs

Create `apps/admin/components/projects/TaskList.tsx`:

- Use Tabs from shared/ui for filtering
- Tab options: Active (default), Overdue, Planned, Done
- Show task count badges on each tab
- Loading skeleton during fetch
- Empty state for no tasks
- "My Tasks" section header followed by "All Tasks"

```typescript
interface TaskListProps {
  tasks: DBTask[];
  myTasks: DBTask[];
  isLoading?: boolean;
  onTaskUpdate: (id: string, updates: Partial<DBTask>) => void;
}
```

Filter logic:
- **Active:** status in ('todo', 'in_progress') AND NOT is_done AND NOT overdue
- **Overdue:** target_date < today AND NOT is_done
- **Planned:** status = 'planned' OR start_date > today
- **Done:** is_done = true OR status in ('done', 'completed')

### 7. Update MyTasksWidget

Modify `apps/admin/components/projects/MyTasksWidget.tsx`:

- Replace mock data with API call
- Add PriorityDot component
- Add tab navigation for status filtering
- Make items clickable to navigate to task detail
- Add expand/collapse for task descriptions
- Derive priority from task data (overdue=high, near due=moderate, else=low)

### 8. Create Single Project Page

Create `apps/admin/app/dashboard/tools/projects/[id]/page.tsx`:

- Server component with requireAuth
- Fetch project with tasks using API
- Pass to client component

Create `apps/admin/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`:

- Project header with title, status badge, progress bar
- Project metadata: dates, team, type, template
- Description section
- Task list with add task button
- Quick actions: edit, archive, delete
- Breadcrumb navigation back to projects list

### 9. Create Single Task Page

Create `apps/admin/app/dashboard/tools/tasks/[id]/page.tsx`:

- Server component with requireAuth
- Fetch task with project info

Create `apps/admin/app/dashboard/tools/tasks/[id]/TaskDetailClient.tsx`:

- Task header with name, priority dot, status
- Project link/badge
- Description (editable)
- Due date with overdue indicator
- Status toggle (todo → in_progress → done)
- Assignees section
- Activity log (future enhancement)
- Quick actions: complete, edit, delete

### 10. Update ProjectsDashboard

Modify `apps/admin/app/dashboard/tools/projects/ProjectsDashboard.tsx`:

- Replace mock data with API calls (useEffect + fetch)
- Add loading states using existing skeleton components
- Replace MyTasksWidget mock data prop with API data
- Add navigation handlers for ProjectCard clicks
- Update stats cards to use real data

### 11. Add Navigation and Sidebar Entry

- Update `apps/admin/components/dashboard/Sidebar.tsx`:
  - Add "Tasks" link under Tools section (if not already)
- Add route for `/dashboard/tools/tasks`
- Ensure breadcrumbs work for nested routes

### 12. Apply UX Polish

- Add transitions for tab changes (fade)
- Add hover states for task items
- Ensure mobile responsiveness
- Add keyboard navigation for accessibility
- Loading skeletons match final layout
- Error boundaries with retry buttons
- Empty states with helpful actions

### 13. Create Comments System

Create `shared/database/migrations/031_create_comments_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'task')),
    entity_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name TEXT,
    author_email TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

Create `apps/admin/components/projects/CommentThread.tsx`:

- Display threaded comments with indentation for replies
- Show author avatar, name, timestamp
- Edit/delete buttons for own comments
- Reply button that opens inline form
- Markdown support for comment content

Create `apps/admin/components/projects/CommentForm.tsx`:

- Textarea with placeholder "Add a comment..."
- Submit button with loading state
- Cancel button for edit mode
- Support mentions (@user) in future

### 14. Create New Project Form with Templates

Create `apps/admin/components/projects/TemplateSelector.tsx`:

```typescript
interface TemplateSelectorProps {
  templates: ProcessTemplate[];
  selectedId: string | null;
  onSelect: (template: ProcessTemplate | null) => void;
}
```

- Grid of template cards showing name, description, task count
- Search/filter by template type (Kurs, Post, Blog, Video, etc.)
- Preview panel showing template tasks when selected
- "Start from scratch" option (no template)

Create `apps/admin/components/projects/NewProjectDialog.tsx`:

Multi-step dialog flow:
1. **Step 1 - Project Info:** Title, description, project type, dates
2. **Step 2 - Choose Template:** TemplateSelector with 89 available templates
3. **Step 3 - Review Tasks:** Show generated tasks, allow reordering/removing
4. **Step 4 - Confirm:** Summary and create button

```typescript
interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: DBProject) => void;
}
```

- Use Dialog from shared/ui
- Progress indicator showing current step
- Back/Next navigation
- Template tasks auto-populated based on selection
- Adjustable task dates relative to project start

### 15. Create All Tasks Page with DataTable

Create `apps/admin/app/dashboard/tools/tasks/page.tsx`:

- Server component with requireAuth
- Fetch initial tasks with default filters
- Render TasksPageClient

Create `apps/admin/app/dashboard/tools/tasks/TasksPageClient.tsx`:

- Page header with title "All Tasks" and stats
- TaskFilters component at top
- TasksDataTable with pagination
- Quick actions toolbar for bulk operations

Create `apps/admin/components/projects/TaskFilters.tsx`:

```typescript
interface TaskFilters {
  status: string[];
  projectId: string | null;
  assigneeId: string | null;
  priority: string[];
  dateRange: { from: Date | null; to: Date | null };
  search: string;
}
```

Filter controls:
- **Status:** Multi-select dropdown (Active, Overdue, Planned, Done, All)
- **Project:** Searchable select with project names
- **Assignee:** Select dropdown (currently mock, future: team members)
- **Priority:** Multi-select (High, Moderate, Low)
- **Due Date:** Date range picker (This week, This month, Overdue, Custom)
- **Search:** Text input with debounce

Create `apps/admin/components/projects/TasksDataTable.tsx`:

Using existing DataTable pattern from `apps/admin/components/data-table/`:

- Columns: Checkbox, Priority dot, Name, Project, Status, Due Date, Assignee, Actions
- Sortable columns: Name, Due Date, Status, Project
- Row click navigates to task detail
- Bulk selection with actions (Mark Done, Change Status, Delete)
- Pagination with page size selector (25, 50, 100)

Create `apps/admin/app/dashboard/tools/tasks/columns.tsx`:

```typescript
export const columns: ColumnDef<DBTask>[] = [
  { id: 'select', /* checkbox */ },
  { accessorKey: 'priority', /* PriorityDot */ },
  { accessorKey: 'name', header: 'Task', /* sortable */ },
  { accessorKey: 'project_title', header: 'Project' },
  { accessorKey: 'status', header: 'Status', /* badge */ },
  { accessorKey: 'target_date', header: 'Due Date', /* formatted, sortable */ },
  { id: 'actions', /* dropdown menu */ },
];
```

### 16. Add API Routes for Comments

Create `apps/admin/app/api/projects/[id]/comments/route.ts`:

```typescript
// GET: List comments for project
// POST: Create new comment on project
```

Create `apps/admin/app/api/tasks/[id]/comments/route.ts`:

```typescript
// GET: List comments for task
// POST: Create new comment on task
```

Create `apps/admin/app/api/comments/[id]/route.ts`:

```typescript
// PATCH: Edit comment (only author)
// DELETE: Delete comment (only author or admin)
```

### 17. Add API Route for Templates

Create `apps/admin/app/api/templates/route.ts`:

```typescript
// GET: List all active process templates
// Query params: type, search, limit
// Returns: { templates: ProcessTemplate[], total: number }
```

### 18. Integrate Comments into Detail Pages

Update `apps/admin/app/dashboard/tools/projects/[id]/ProjectDetailClient.tsx`:

- Add "Comments" section below task list
- Use CommentThread component
- Add comment button opens CommentForm

Update `apps/admin/app/dashboard/tools/tasks/[id]/TaskDetailClient.tsx`:

- Add "Comments" section below task info
- Use CommentThread component
- Real-time comment count in header

### 19. Testing and Validation

- Test all API endpoints with various filters
- Verify data loads correctly from PostgreSQL
- Test task status updates
- Test comment creation, editing, deletion
- Test project creation from templates
- Verify navigation between pages
- Test All Tasks page filters and sorting
- Check responsive design on mobile/tablet
- Verify loading and error states

## Testing Strategy

### Unit Tests
- PriorityDot renders correct colors
- TaskListItem expands/collapses correctly
- Tab filtering logic works as expected
- API routes return correct data shape
- TemplateSelector filters templates correctly
- CommentThread renders nested comments
- TaskFilters generates correct query params

### Integration Tests
- Full page load with real database data
- Task status update persists to database
- Navigation between project and task pages
- Filter tabs show correct task counts
- Create project from template generates correct tasks
- Add/edit/delete comments persists to database
- All Tasks page filters return correct results
- Search functionality finds matching tasks

### Manual Testing
- Visual check of priority dots across themes
- Expand/collapse animation smoothness
- Mobile layout and touch interactions
- Overdue task highlighting
- New Project dialog multi-step flow
- Comment threading and replies
- DataTable sorting and pagination
- Filter combinations work correctly

## Acceptance Criteria

1. **Data Integration:** Dashboard shows real data from PostgreSQL (658 projects, 9,114 tasks)
2. **Priority Dots:** All tasks display colored dots (red/orange/green) based on priority
3. **My Tasks Section:** Shows tasks assigned to current user at top of task list
4. **Compact Tasks:** Task items are ~48px height when collapsed, expandable to show description
5. **Tab Navigation:** Active, Overdue, Planned, Done tabs filter tasks correctly
6. **Project Detail Page:** `/dashboard/tools/projects/[id]` shows project with its tasks
7. **Task Detail Page:** `/dashboard/tools/tasks/[id]` shows task with edit capability
8. **Status Updates:** Clicking task checkbox updates status in database
9. **Loading States:** Skeleton loaders display while data fetches
10. **Error Handling:** Failed requests show error message with retry option
11. **Responsive:** Layout works on desktop, tablet, and mobile
12. **New Project Form:** Can create project from scratch or from template (89 templates available)
13. **Template Selection:** Templates show task count, can preview tasks before creating
14. **Comments on Projects:** Can add, edit, delete comments on project detail page
15. **Comments on Tasks:** Can add, edit, delete comments on task detail page
16. **Threaded Comments:** Replies display nested under parent comment
17. **All Tasks Page:** `/dashboard/tools/tasks` shows all 9,114 tasks with pagination
18. **Task Filters:** Can filter by status, project, assignee, priority, date range
19. **Task Search:** Can search tasks by name with debounced input
20. **Task Sorting:** Can sort by name, due date, status, project
21. **Bulk Actions:** Can select multiple tasks and mark done or change status

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Build check - ensure no TypeScript errors
cd apps/admin && npm run build

# Start dev server and test API endpoints
npm run dev &

# Test projects API
curl -s http://localhost:3000/api/projects | jq '.projects | length'
# Expected: 658

# Test tasks API with filter
curl -s "http://localhost:3000/api/tasks?status=todo&limit=5" | jq '.tasks | length'
# Expected: 5

# Test tasks API with search
curl -s "http://localhost:3000/api/tasks?search=Review&limit=10" | jq '.tasks | length'
# Expected: > 0

# Test single project
curl -s http://localhost:3000/api/projects/$(curl -s http://localhost:3000/api/projects | jq -r '.projects[0].id') | jq '.title'
# Expected: Project title string

# Test single task
curl -s http://localhost:3000/api/tasks/$(curl -s http://localhost:3000/api/tasks | jq -r '.tasks[0].id') | jq '.name'
# Expected: Task name string

# Test templates API
curl -s http://localhost:3000/api/templates | jq '.templates | length'
# Expected: 89

# Test comments API (after creating a comment)
PROJECT_ID=$(curl -s http://localhost:3000/api/projects | jq -r '.projects[0].id')
curl -s http://localhost:3000/api/projects/$PROJECT_ID/comments | jq '.comments | length'
# Expected: 0 or more

# Visual validation checklist:
# 1. Open http://localhost:3000/dashboard/tools/projects
# 2. Verify real project count displays (658)
# 3. Click "New Project" button → multi-step dialog opens
# 4. Select a template → preview shows tasks
# 5. Click project card → navigates to detail page
# 6. Verify comments section on project detail
# 7. Verify task tabs filter correctly (Active/Overdue/Planned/Done)
# 8. Expand a task item → description shows
# 9. Open http://localhost:3000/dashboard/tools/tasks
# 10. Verify All Tasks page shows DataTable
# 11. Test filters (status, project, search)
# 12. Test sorting by clicking column headers
# 13. Click task row → navigates to task detail
# 14. Verify comments section on task detail
# 15. Check mobile layout at 375px width
```

## Notes

### Priority Derivation Logic
Since the database doesn't have a priority column, derive from:
1. **High (red):** Overdue tasks (target_date < today AND NOT is_done)
2. **Moderate (orange):** Due within 3 days OR status = 'blocked'
3. **Low (green):** All other active tasks

### Performance Considerations
- Initial load fetches paginated data (limit 50)
- Use SWR or React Query for caching (optional)
- Lazy load task descriptions on expand
- Virtual scrolling for 9k+ tasks (if needed)

### Future Enhancements
- Real-time updates via WebSocket
- Drag-and-drop task reordering
- Calendar view for due dates
- Kanban board view
- Activity log/audit trail
- @mentions in comments
- File attachments on comments
- Email notifications for comments

### Shared UI Components to Use
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Tab navigation
- `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` - Expandable items
- `Badge` - Status and project badges
- `Checkbox` - Task completion toggle
- `Skeleton` - Loading states
- `Button` - Actions
- `Card` - Detail page sections
- `Separator` - Visual dividers
- `ScrollArea` - Long task lists
- `Dialog` - New project multi-step form
- `Select`, `Combobox` - Filter dropdowns
- `Input` - Search field
- `Textarea` - Comment form
- `Avatar` - Comment author display
- `DataTable` - All tasks list (from admin/data-table)

### Template-to-Tasks Logic

When creating a project from a template:
1. Fetch process template with its tasks (offset_days_to_anchor, duration_days)
2. Calculate task dates relative to project start_date
3. For each template task:
   - auto_start = project.start_date + offset_days_to_anchor
   - auto_finished = auto_start + duration_days
4. Create project record, then bulk insert tasks
5. Return created project with task count

### Comments Data Model

```
comments
├── entity_type: 'project' | 'task'
├── entity_id: UUID (project.id or task.id)
├── parent_comment_id: UUID (for replies, null for top-level)
├── content: TEXT
├── author_name: TEXT (from session)
├── author_email: TEXT (from session)
└── created_at, updated_at
```

### All Tasks Page URL Structure

```
/dashboard/tools/tasks
  ?status=todo,in_progress          # Multi-value filter
  &project=<uuid>                   # Single project filter
  &search=keyword                   # Text search
  &sort=target_date                 # Sort column
  &order=asc                        # Sort direction
  &page=1                           # Pagination
  &limit=50                         # Page size
```
