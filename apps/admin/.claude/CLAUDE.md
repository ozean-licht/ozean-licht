# Admin Dashboard - Agent Guide

**Stack**: Next.js 14 | NextAuth v5 | TypeScript | PostgreSQL | Tailwind
**Scope**: Ozean Licht platform admin (Kids Ascension has separate admin)

---

## Invariants (Always True)

1. **Database**: Direct PostgreSQL via `lib/db/` — NOT MCP Gateway
2. **Auth**: NextAuth v5 with JWT, credentials provider
3. **Components**: `@shared/ui` first, `components/ui/` second
4. **RBAC**: All dashboard routes protected by `middleware.ts`

## Hot Paths

| Task | Location | Pattern |
|------|----------|---------|
| Add page | `app/dashboard/[area]/` | Server component + `requireAnyRole()` |
| Add API | `app/api/[resource]/route.ts` | `auth()` check → `lib/db/` call |
| Add query | `lib/db/[entity].ts` | Use `query<T>()` or `execute()` |
| Add component | `components/` | Check shared-ui first |
| Protect route | Page top | `await requireAnyRole(['super_admin'])` |

## Dashboard Areas

```
/dashboard
├── /access      # Users, permissions, RBAC
├── /tools       # Cloud storage, projects, tasks, templates
├── /courses     # Course builder, modules, lessons
├── /content     # Blog, videos
├── /commerce    # Orders, products, transactions
├── /system      # Health monitoring
└── /account     # Profile, settings, inbox
```

## Core Patterns

### Server Component Page
```typescript
import { requireAnyRole } from '@/lib/auth-utils'
import { getAllProjects } from '@/lib/db/projects'

export default async function Page() {
  await requireAnyRole(['super_admin', 'ol_admin'])
  const { projects } = await getAllProjects({ status: 'active' })
  return <div>{/* UI */}</div>
}
```

### API Route
```typescript
import { auth } from '@/lib/auth/config'
import { getProjectById, updateProject } from '@/lib/db/projects'

export async function PATCH(req: Request, { params }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const project = await updateProject(params.id, data)
  return Response.json({ project })
}
```

### Database Query
```typescript
// lib/db/myentity.ts
import { query, execute } from './index'

export async function getById(id: string) {
  const rows = await query<MyEntity>('SELECT * FROM my_entity WHERE id = $1', [id])
  return rows[0] || null
}

export async function updateById(id: string, data: Partial<MyEntity>) {
  const result = await execute(
    'UPDATE my_entity SET name = $1 WHERE id = $2 RETURNING *',
    [data.name, id]
  )
  return result.rows[0]
}
```

### RBAC Check
```typescript
// Page-level
await requireAnyRole(['super_admin', 'ol_admin'])

// Component-level
if (!['super_admin', 'ol_admin'].includes(session?.user?.adminRole)) return null

// Permission-level
import { hasPermission } from '@/lib/auth-utils'
const canEdit = hasPermission(session.user.permissions, 'users.update')
```

## Key Files (High Gravity)

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection, RBAC enforcement |
| `lib/auth/config.ts` | NextAuth config, JWT callbacks |
| `lib/db/index.ts` | PostgreSQL pool, `query()`, `execute()`, `transaction()` |
| `lib/auth-utils.ts` | `requireAuth()`, `requireAnyRole()`, `hasPermission()` |
| `lib/rbac/constants.ts` | Role definitions, `canAccessRoute()` |
| `components/dashboard/Sidebar.tsx` | Navigation, add menu items here |

## Database Modules

| Module | Entity | Key Functions |
|--------|--------|---------------|
| `lib/db/courses.ts` | Courses | `getCourses()`, `getCourseBySlug()`, `createCourse()` |
| `lib/db/modules.ts` | Modules | `getModulesByCourse()`, `createModule()`, `reorderModules()` |
| `lib/db/lessons.ts` | Lessons | `getLessonsByModule()`, `createLesson()`, `updateLesson()` |
| `lib/db/prerequisites.ts` | Prerequisites | `getPrerequisites()`, `setPrerequisites()` |
| `lib/db/schedules.ts` | Drip Schedules | `getDripSchedule()`, `setDripSchedule()` |
| `lib/db/videos.ts` | Videos | Video metadata for courses |
| `lib/db/projects.ts` | Projects | `getAllProjects()`, `createProject()`, `updateProject()` |
| `lib/db/tasks.ts` | Tasks | `getAllTasks()`, `updateTask()`, kanban operations |
| `lib/db/sprints.ts` | Sprints | `getAllSprints()`, `createSprint()`, `completeSprint()` |
| `lib/db/comments.ts` | Comments | `getComments()`, `createComment()` |
| `lib/db/templates.ts` | Templates | Process templates for projects |
| `lib/db/notifications.ts` | Notifications | `getNotifications()`, `markAsRead()` |

## Security Checklist

- [ ] All pages use `requireAuth()` or `requireAnyRole()`
- [ ] All API routes check `await auth()`
- [ ] Sensitive ops restricted to `super_admin`/`ol_admin`
- [ ] Inputs validated with Zod
- [ ] SQL uses parameterized queries (`$1`, `$2`)
- [ ] No secrets in code

## Current Focus: Course Builder

**Location:** `app/dashboard/courses/`
**Spec:** `specs/course-builder-architecture.md`

### Completed Phases
| Phase | Feature | Key Files |
|-------|---------|-----------|
| 6 | Rich Content Editing | `RichTextEditor.tsx`, `ImageUploader.tsx`, `PdfUploader.tsx` |
| 8 | Audio & Multi-format | `AudioUploader.tsx`, `AudioPlayer.tsx`, `TranscriptEditor.tsx` |
| 9 | Learning Sequences | `PrerequisiteSelector.tsx`, `DripScheduler.tsx`, `CompletionRulesEditor.tsx` |

### In Progress: Phase 7 Quiz Builder (BLOCKED)

**Status:** Code complete, review failed with 3 blockers

**Blockers to fix:**
1. XSS vulnerability - Add sanitization in `lib/db/lessons.ts`
2. Missing API validation - Add Zod validation in lesson routes
3. No data migration - Add `migrateQuizData()` function

**Quiz Builder Files (uncommitted):**
| File | Purpose |
|------|---------|
| `components/courses/quiz/QuizBuilder.tsx` | Main quiz editor |
| `components/courses/quiz/QuestionEditor.tsx` | Question type editor |
| `components/courses/quiz/QuizPreview.tsx` | Live preview with scoring |
| `types/quiz.ts` | Quiz types and validation |
| `lib/utils/sanitize-quiz.ts` | XSS sanitization (to implement) |

### Key Course Builder Files
| File | Purpose |
|------|---------|
| `app/dashboard/courses/[slug]/CourseDetailClient.tsx` | Course detail page |
| `components/courses/LessonEditorModal.tsx` | Lesson create/edit modal |
| `components/courses/ModuleList.tsx` | Module drag-drop list |
| `lib/db/courses.ts` | Course CRUD |
| `lib/db/lessons.ts` | Lesson CRUD with content types |
| `lib/db/prerequisites.ts` | Prerequisite CRUD |
| `lib/db/schedules.ts` | Drip schedule CRUD |
| `lib/validations/course-builder.ts` | Zod schemas |

### Database Tables (Course Builder)
```
courses, course_modules, course_lessons
lesson_prerequisites, drip_schedules, user_drip_status
course_completion_rules, module_unlock_rules, course_drip_settings
```

## Completed: Project Management MVP

**Context Map:** `app/dashboard/tools/projects/README.md`

All 13 phases complete: Projects, Tasks, Kanban, Subtasks, Time Tracking, Sprints, Attachments, Notifications, Timeline, Export

## Database Migrations

**Container**: `iccc0wo0wkgsws4cowk4440c` (postgres:17-alpine)
**Database**: `ozean-licht-db`
**Migrations**: `apps/admin/migrations/`

```bash
# Apply a migration
docker exec -i iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" < migrations/00X_migration.sql

# List databases
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -c "\l"

# Query tasks table structure
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" -c "\d tasks"
```

## Troubleshooting

```bash
# Database connection (via Docker)
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" -c "SELECT 1"

# Auth issues
cat .env.local | grep NEXTAUTH

# Type errors
npm run typecheck
```

---

*Last Updated: 2025-12-03 | Focus: Course Builder | 273 files*
