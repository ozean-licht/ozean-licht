# Database Module

> Direct PostgreSQL access via connection pooling — 16 entity modules for projects, tasks, courses, content production, and workflow management. No MCP Gateway dependency.

## Quick Nav

**Core:** `index.ts` | **Auth:** `auth-pool.ts` | **Entities:** `projects.ts`, `tasks.ts`, etc.

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add entity module | Create `[entity].ts` | Import `query`/`execute` → Define types → Export functions |
| Add query function | Entity module | Use `query<T>()` for SELECTs → Use `execute()` for mutations |
| Run transaction | `index.ts` | Use `transaction(async (client) => { ... })` |
| Add filter | Entity module | Build WHERE clause → Use parameterized queries ($1, $2) |
| Check DB health | `index.ts` | Call `healthCheck()` |
| Auth queries | `auth-pool.ts` | Use `getAuthPool()` for admin_users table |

## Structure

```
.
├── index.ts          # Core: Pool, query(), execute(), transaction(), healthCheck()
├── auth-pool.ts      # Separate pool for auth operations (same DB, different config)
├── projects.ts       # Project CRUD with filtering, stats
├── tasks.ts          # Task CRUD with kanban support, tabs, project joins
├── courses.ts        # Course CRUD with modules/lessons counts
├── modules.ts        # Course modules with ordering, drag-drop reorder
├── lessons.ts        # Lessons within modules
├── comments.ts       # Comments for projects and tasks
├── templates.ts      # Process templates for project creation
├── videos.ts         # Video metadata for course content
│
│   # Content Production (PM MVP Phase 1)
├── workflows.ts      # Workflow definitions, statuses, transitions
├── content-types.ts  # Video, Blog, Course, Meditation types
├── content-items.ts  # Content deliverables linked to tasks
├── project-roles.ts  # Editor, Voice Artist, Translator roles
├── task-assignments.ts # Multi-role task assignments
└── checklists.ts     # Checklist templates and task checklists
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `index.ts` | Pool singleton, `query<T>()`, `execute()`, `transaction()`, `healthCheck()` | ●●● |
| `projects.ts` | `getAllProjects()`, `createProject()`, `updateProject()`, `getProjectStats()` | ●●● |
| `tasks.ts` | `getAllTasks()`, `updateTask()`, tab filtering (active/overdue/done) | ●●● |
| `courses.ts` | `listCourses()`, `getCourseBySlug()`, `createCourse()`, `updateCourse()` | ●● |
| `modules.ts` | `getModulesByCourse()`, `createModule()`, `reorderModules()` | ●● |
| `lessons.ts` | `getLessonsByModule()`, `createLesson()`, `reorderLessons()` | ●● |
| `auth-pool.ts` | `getAuthPool()`, `checkAuthDbHealth()` for admin_users | ●● |

## Patterns

### Basic Query
```typescript
import { query } from './index';

export async function getById(id: string): Promise<Entity | null> {
  const rows = await query<DBEntity>(
    'SELECT * FROM entities WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}
```

### List with Filters
```typescript
import { query } from './index';

export async function getAll(filters: Filters): Promise<{ items: Entity[], total: number }> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Count query
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM entities ${whereClause}`,
    params
  );

  // Data query
  const rows = await query<DBEntity>(
    `SELECT * FROM entities ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, filters.limit, filters.offset]
  );

  return {
    items: rows,
    total: parseInt(countResult[0]?.count || '0', 10),
  };
}
```

### Create/Update
```typescript
import { query, execute } from './index';

export async function create(data: CreateInput): Promise<Entity> {
  const rows = await query<DBEntity>(
    `INSERT INTO entities (name, description) VALUES ($1, $2)
     RETURNING *`,
    [data.name, data.description]
  );
  return rows[0];
}

export async function update(id: string, data: UpdateInput): Promise<Entity | null> {
  const rows = await query<DBEntity>(
    `UPDATE entities SET name = $1 WHERE id = $2 RETURNING *`,
    [data.name, id]
  );
  return rows[0] || null;
}

export async function remove(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM entities WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
```

### Transaction
```typescript
import { transaction } from './index';

export async function transferTask(taskId: string, newProjectId: string) {
  await transaction(async (client) => {
    // Update task
    await client.query(
      'UPDATE tasks SET project_id = $1 WHERE id = $2',
      [newProjectId, taskId]
    );
    // Recalculate old project progress
    await client.query('SELECT recalculate_project_progress($1)', [oldProjectId]);
    // Recalculate new project progress
    await client.query('SELECT recalculate_project_progress($1)', [newProjectId]);
  });
}
```

## Entity Module Reference

| Module | Table | Key Functions |
|--------|-------|---------------|
| `projects.ts` | `projects` | `getAllProjects()`, `getProjectById()`, `createProject()`, `updateProject()`, `deleteProject()`, `getProjectStats()`, `recalculateProjectProgress()` |
| `tasks.ts` | `tasks` | `getAllTasks()`, `getTaskById()`, `createTask()`, `updateTask()`, `deleteTask()`, `getTasksByProject()`, `getTaskCounts()` |
| `courses.ts` | `courses` | `listCourses()`, `getCourseBySlug()`, `getCourseById()`, `createCourse()`, `updateCourse()`, `deleteCourse()` |
| `modules.ts` | `course_modules` | `getModulesByCourse()`, `createModule()`, `updateModule()`, `deleteModule()`, `reorderModules()` |
| `lessons.ts` | `lessons` | `getLessonsByModule()`, `createLesson()`, `updateLesson()`, `deleteLesson()`, `reorderLessons()` |
| `comments.ts` | `comments` | `getComments()`, `createComment()`, `updateComment()`, `deleteComment()` |
| `templates.ts` | `process_templates` | `getAllTemplates()`, `getTemplateById()`, `applyTemplate()` |
| `videos.ts` | `videos` | `listVideos()`, `getVideoById()`, `createVideo()` |
| `workflows.ts` | `workflow_definitions`, `workflow_statuses`, `workflow_transitions` | `getAllWorkflows()`, `getWorkflowById()`, `getWorkflowStatuses()`, `isTransitionAllowed()` |
| `content-types.ts` | `content_types` | `getAllContentTypes()`, `getContentTypeById()`, `getContentTypesByPlatform()` |
| `content-items.ts` | `content_items` | `getAllContentItems()`, `createContentItem()`, `updateContentItemStatus()`, `getContentItemTranslations()` |
| `project-roles.ts` | `project_roles` | `getAllProjectRoles()`, `roleHasPermission()`, `getRolesWithPermission()` |
| `task-assignments.ts` | `task_assignments` | `getTaskAssignments()`, `assignUsersToTask()`, `setPrimaryAssignee()`, `completeTaskAssignment()` |
| `checklists.ts` | `checklist_templates`, `task_checklists` | `getAllChecklistTemplates()`, `createTaskChecklistFromTemplate()`, `toggleChecklistItem()` |

## Environment Variables

```bash
# Primary database URL (required)
OZEAN_LICHT_DB_URL=postgresql://user:pass@host:port/ozean-licht-db

# Fallback names (also work)
OZEAN_LICHT_DATABASE_URL=...
DATABASE_URL_OL=...
```

## Security Notes

- All queries use parameterized placeholders (`$1`, `$2`) to prevent SQL injection
- Limit caps at 100 to prevent DoS attacks
- OrderBy columns are validated against allowlists
- Connection pool handles connection limits (max: 20)

---

*Mapped: 2025-12-02 | Files: 16 | Tables: 18+*

## Migration Files (PM MVP Phase 1)

To enable content production features, run:
```bash
psql $OZEAN_LICHT_DB_URL -f migrations/003_content_production_workflows.sql
psql $OZEAN_LICHT_DB_URL -f migrations/004_seed_content_production_data.sql
```
