# Project Management

> Internal project management system — dashboard with project cards, task kanban, process templates, and real-time progress tracking.

## Quick Nav

**Entry:** `page.tsx` | **Dashboard:** `ProjectsDashboard.tsx` | **Detail:** `[id]/ProjectDetailClient.tsx`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add project feature | `ProjectsDashboard.tsx` | Add to stats → Add to UI → Connect API |
| Add task feature | `../tasks/TasksKanban.tsx` | Add column/card → Update types → Connect API |
| Edit project form | `new/NewProjectClient.tsx` | Add form field → Update API → Update types |
| Add detail section | `[id]/ProjectDetailClient.tsx` | Add Card section → Fetch data → Render |
| Update project card | `components/projects/ProjectCard.tsx` | Modify layout → Update props → Update mapper |
| Add comment feature | `components/projects/CommentThread.tsx` | Add UI → Connect `/api/projects/[id]/comments` |

## Structure

```
.
├── page.tsx                  # Server component, auth check, data fetch
├── layout.tsx                # Project area layout wrapper
├── loading.tsx               # Loading skeleton
├── ProjectsDashboard.tsx     # Main client dashboard (stats, tabs, cards)
├── new/
│   ├── page.tsx              # New project page (server)
│   └── NewProjectClient.tsx  # New project form (client)
└── [id]/
    ├── page.tsx              # Project detail page (server)
    └── ProjectDetailClient.tsx # Project detail view (client)
```

## Related Files

| Location | Files | Purpose |
|----------|-------|---------|
| `components/projects/` | 8 components | ProjectCard, TaskList, Comments, Widgets |
| `lib/db/projects.ts` | CRUD | `getAllProjects()`, `createProject()`, `updateProject()` |
| `lib/db/tasks.ts` | CRUD | `getAllTasks()`, `updateTask()`, `getTasksByProject()` |
| `lib/db/comments.ts` | CRUD | `getComments()`, `createComment()` |
| `lib/db/templates.ts` | Templates | `getAllTemplates()`, `applyTemplate()` |
| `types/projects.ts` | Types | Project, Task, Template, Sprint, Comment types |
| `app/api/projects/` | API | CRUD endpoints for projects |
| `app/api/tasks/` | API | CRUD endpoints for tasks |
| `../tasks/` | Kanban | Task kanban board with filters |
| `../templates/` | Templates | Process template management |

## Current Features

### ProjectsDashboard.tsx
- Stats cards: Total projects, Active, Recurring, Completion rate
- MyTasksWidget: User's assigned tasks with quick complete toggle
- Project tabs: All, Active, Recurring filters
- View modes: Grid and List views
- ProcessTemplatesWidget: Template selection for new projects
- Recent Activity: Collapsible activity log (placeholder)

### ProjectDetailClient.tsx
- Header: Title, status badge, progress bar
- Stats cards: Progress, Tasks completed, Start/Target dates
- TaskList: Project tasks with update/navigate
- Comments sidebar: Comment thread with add form
- Details panel: Type, template, timestamps

### TasksKanban.tsx (../tasks/)
- Kanban columns: Backlog, Todo, In Progress, Review, Done
- Filters: Project, Assignee, Search
- Task cards: Priority badge, title, assignee avatar
- Stats: Total, In Progress, Completed, Urgent

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `ProjectsDashboard.tsx` | Main dashboard with stats, tabs, project cards, widgets | ●●● |
| `[id]/ProjectDetailClient.tsx` | Project detail with tasks, comments, progress | ●●● |
| `components/projects/ProjectCard.tsx` | Project card with status, progress, metadata | ●● |
| `lib/db/projects.ts` | Project CRUD with filters, stats, progress recalc | ●● |
| `types/projects.ts` | All project/task/template type definitions | ●● |

## API Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/[id]` | GET, PATCH, DELETE | Project CRUD |
| `/api/projects/[id]/comments` | GET, POST | Project comments |
| `/api/tasks` | GET, POST | List/create tasks |
| `/api/tasks/[id]` | GET, PATCH, DELETE | Task CRUD |
| `/api/tasks/[id]/comments` | GET, POST | Task comments |
| `/api/templates` | GET | List process templates |

## Data Flow

```
page.tsx (server)
  ↓ requireAnyRole()
  ↓ fetch projects/tasks
  ↓
ProjectsDashboard.tsx (client)
  ↓ state: projects, tasks, stats
  ↓ fetch: /api/projects, /api/tasks
  ↓
ProjectCard / MyTasksWidget / ProcessTemplatesWidget
  ↓ onClick → router.push
  ↓
[id]/page.tsx (server)
  ↓ fetch project, tasks, comments
  ↓
ProjectDetailClient.tsx (client)
  ↓ PATCH /api/tasks/[id]
  ↓ POST /api/projects/[id]/comments
```

## Missing for MVP

- [ ] Drag-and-drop task reordering
- [ ] Task creation modal
- [ ] Project edit modal
- [ ] Assignee management (user picker)
- [ ] Due date calendar picker
- [ ] Activity log with real events
- [ ] Subtasks support
- [ ] Time tracking entries
- [ ] Sprint management
- [ ] Labels/tags editing
- [ ] File attachments
- [ ] Notifications on changes

---

*Mapped: 2025-12-02 | Files: 8 | API: 7 endpoints | Components: 8*
