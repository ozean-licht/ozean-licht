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
| `components/projects/` | 12 components | ProjectCard, TaskList, Comments, Sprints, Time, Widgets |
| `lib/db/projects.ts` | CRUD | `getAllProjects()`, `createProject()`, `updateProject()` |
| `lib/db/tasks.ts` | CRUD | `getAllTasks()`, `updateTask()`, `getTasksByProject()` |
| `lib/db/sprints.ts` | CRUD | `getAllSprints()`, `createSprint()`, `startSprint()`, `completeSprint()` |
| `lib/db/comments.ts` | CRUD | `getComments()`, `createComment()` |
| `lib/db/templates.ts` | Templates | `getAllTemplates()`, `applyTemplate()` |
| `types/projects.ts` | Types | Project, Task, Template, Sprint, Comment types |
| `app/api/projects/` | API | CRUD endpoints for projects |
| `app/api/projects/[id]/sprints/` | API | Sprint CRUD for project |
| `app/api/sprints/` | API | Single sprint operations |
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
- Sprint sidebar: Active sprint stats, sprint manager (create/edit/delete)
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
| `/api/tasks/[id]/attachments` | GET, POST | List/upload task attachments |
| `/api/tasks/[id]/attachments/[attachmentId]` | GET, DELETE | Attachment details/delete |
| `/api/projects/[id]/sprints` | GET, POST | List/create sprints for project |
| `/api/sprints/[id]` | GET, PATCH, DELETE | Sprint CRUD |
| `/api/sprints/[id]/tasks` | GET, POST | Sprint tasks, move tasks to sprint |
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
- [ ] Labels/tags editing
- [x] File attachments (Phase 11)
- [ ] @mentions in comments
- [ ] Notifications on changes

## Completed MVP Phases

- [x] Phase 5-6: Polish (activity log, completion tracking)
- [x] Phase 7: Edit modals (project & task edit)
- [x] Phase 8: Subtasks support
- [x] Phase 9: Time tracking entries
- [x] Phase 10: Sprint management
- [x] Phase 11: File attachments
- [x] Phase 12: Collaboration (notifications, @mentions)
- [x] Phase 13: Advanced Views (saved filters, timeline, export)

### Phase 13 Components

| Component | Purpose |
|-----------|---------|
| `SavedFilters` | Save/load filter presets (localStorage) |
| `ColumnCustomizer` | Toggle visible columns in list views |
| `TimelineView` | Gantt-style timeline with task bars |
| `ExportButton` | Export tasks/projects to CSV/JSON |

---

*Mapped: 2025-12-03 | Files: 16 | API: 10 endpoints | Components: 16*
