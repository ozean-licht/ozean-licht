/**
 * Tasks Database Queries
 *
 * Database queries for task management via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query, execute } from './index';

// Database row type (snake_case) - matches tasks table schema
export interface DBTask {
  id: string;
  airtable_id: string | null;
  airtable_auto_number: number | null;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done' | 'completed' | 'overdue' | 'planned' | 'paused' | 'blocked';
  is_done: boolean;
  task_order: number;
  start_date: string | null;
  target_date: string | null;
  finished_at: string | null;
  duration_days: number | null;
  offset_days_to_anchor: number | null;
  day_of_publish: string | null;
  auto_start: string | null;
  auto_finished: string | null;
  project_airtable_id: string | null;
  project_id: string | null;
  assignee_ids: string[];
  milestone_ids: string[];
  department_ids: string[];
  created_by_name: string | null;
  created_by_email: string | null;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
  airtable_created_at: string | null;
  airtable_updated_at: string | null;
  metadata: Record<string, unknown>;
  // Joined fields
  project_title?: string;
}

// Filter options for task queries
export interface TaskFilters {
  status?: string | string[];
  projectId?: string;
  assigneeId?: string;
  search?: string;
  isOverdue?: boolean;
  isDone?: boolean;
  tab?: 'active' | 'overdue' | 'planned' | 'done';
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Result type for paginated queries
export interface TaskListResult {
  tasks: DBTask[];
  total: number;
}

/**
 * Get all tasks with filtering and pagination
 */
export async function getAllTasks(filters: TaskFilters = {}): Promise<TaskListResult> {
  const {
    status,
    projectId,
    assigneeId,
    search,
    isOverdue,
    isDone,
    tab,
    limit: requestedLimit = 50,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = filters;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Handle tab-based filtering
  if (tab) {
    switch (tab) {
      case 'active':
        // Tasks that are active: in progress or todo, not done, not overdue
        conditions.push(`status IN ('todo', 'in_progress')`);
        conditions.push(`is_done = false`);
        conditions.push(`(target_date >= CURRENT_DATE OR target_date IS NULL)`);
        break;
      case 'overdue':
        // Tasks past their target date and not done
        conditions.push(`target_date < CURRENT_DATE`);
        conditions.push(`is_done = false`);
        break;
      case 'planned':
        // Tasks planned for future or with status 'planned'
        conditions.push(`(status = 'planned' OR start_date > CURRENT_DATE)`);
        break;
      case 'done':
        // Completed tasks
        conditions.push(`(is_done = true OR status IN ('done', 'completed'))`);
        break;
    }
  }

  // Status filter (can be single value or array)
  if (status) {
    if (Array.isArray(status)) {
      const placeholders = status.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`status IN (${placeholders})`);
      params.push(...status);
      paramIndex += status.length;
    } else {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }
  }

  // Project filter
  if (projectId) {
    conditions.push(`t.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  // Assignee filter (check if assignee ID is in the JSONB array)
  if (assigneeId) {
    conditions.push(`t.assignee_ids @> $${paramIndex++}::jsonb`);
    params.push(JSON.stringify([assigneeId]));
  }

  // Search filter (name or description)
  if (search) {
    conditions.push(`(t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Overdue filter
  if (isOverdue !== undefined) {
    if (isOverdue) {
      conditions.push(`t.target_date < CURRENT_DATE AND t.is_done = false`);
    } else {
      conditions.push(`(t.target_date >= CURRENT_DATE OR t.target_date IS NULL OR t.is_done = true)`);
    }
  }

  // Done filter
  if (isDone !== undefined) {
    conditions.push(`t.is_done = $${paramIndex++}`);
    params.push(isDone);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = ['created_at', 'updated_at', 'name', 'status', 'target_date', 'start_date', 'task_order'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? `t.${orderBy}` : 't.created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM tasks t
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with LEFT JOIN to projects for project_title
  const dataSql = `
    SELECT
      t.id, t.airtable_id, t.airtable_auto_number,
      t.name, t.description, t.status, t.is_done, t.task_order,
      t.start_date, t.target_date, t.finished_at,
      t.duration_days, t.offset_days_to_anchor,
      t.day_of_publish, t.auto_start, t.auto_finished,
      t.project_airtable_id, t.project_id,
      t.assignee_ids, t.milestone_ids, t.department_ids,
      t.created_by_name, t.created_by_email,
      t.updated_by_name, t.updated_by_email,
      t.created_at, t.updated_at,
      t.airtable_created_at, t.airtable_updated_at,
      t.metadata,
      p.title as project_title
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await query<DBTask>(dataSql, params);

  return {
    tasks: rows,
    total,
  };
}

/**
 * Get a single task by ID with project information
 */
export async function getTaskById(id: string): Promise<DBTask | null> {
  const sql = `
    SELECT
      t.id, t.airtable_id, t.airtable_auto_number,
      t.name, t.description, t.status, t.is_done, t.task_order,
      t.start_date, t.target_date, t.finished_at,
      t.duration_days, t.offset_days_to_anchor,
      t.day_of_publish, t.auto_start, t.auto_finished,
      t.project_airtable_id, t.project_id,
      t.assignee_ids, t.milestone_ids, t.department_ids,
      t.created_by_name, t.created_by_email,
      t.updated_by_name, t.updated_by_email,
      t.created_at, t.updated_at,
      t.airtable_created_at, t.airtable_updated_at,
      t.metadata,
      p.title as project_title
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1
  `;

  const rows = await query<DBTask>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get all tasks for a specific project
 */
export async function getTasksByProjectId(projectId: string): Promise<DBTask[]> {
  const sql = `
    SELECT
      t.id, t.airtable_id, t.airtable_auto_number,
      t.name, t.description, t.status, t.is_done, t.task_order,
      t.start_date, t.target_date, t.finished_at,
      t.duration_days, t.offset_days_to_anchor,
      t.day_of_publish, t.auto_start, t.auto_finished,
      t.project_airtable_id, t.project_id,
      t.assignee_ids, t.milestone_ids, t.department_ids,
      t.created_by_name, t.created_by_email,
      t.updated_by_name, t.updated_by_email,
      t.created_at, t.updated_at,
      t.airtable_created_at, t.airtable_updated_at,
      t.metadata,
      p.title as project_title
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.project_id = $1
    ORDER BY t.task_order ASC, t.created_at ASC
  `;

  return query<DBTask>(sql, [projectId]);
}

/**
 * Update task fields
 */
export async function updateTask(
  id: string,
  data: Partial<Pick<DBTask, 'name' | 'description' | 'status' | 'is_done' | 'target_date' | 'start_date' | 'assignee_ids'>>
): Promise<DBTask | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'status', column: 'status' },
    { key: 'is_done', column: 'is_done' },
    { key: 'target_date', column: 'target_date' },
    { key: 'start_date', column: 'start_date' },
    { key: 'assignee_ids', column: 'assignee_ids' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current task
    return getTaskById(id);
  }

  // Always update updated_at
  setClauses.push('updated_at = NOW()');

  // Auto-set finished_at when marking as done
  if (data.is_done === true) {
    setClauses.push('finished_at = COALESCE(finished_at, NOW())');
  }

  params.push(id);
  const sql = `
    UPDATE tasks
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, airtable_id, airtable_auto_number,
      name, description, status, is_done, task_order,
      start_date, target_date, finished_at,
      duration_days, offset_days_to_anchor,
      day_of_publish, auto_start, auto_finished,
      project_airtable_id, project_id,
      assignee_ids, milestone_ids, department_ids,
      created_by_name, created_by_email,
      updated_by_name, updated_by_email,
      created_at, updated_at,
      airtable_created_at, airtable_updated_at,
      metadata
  `;

  const rows = await query<DBTask>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new task
 */
export async function createTask(data: {
  name: string;
  description?: string;
  project_id?: string;
  status?: string;
  target_date?: string;
  start_date?: string;
  task_order?: number;
}): Promise<DBTask> {
  const sql = `
    INSERT INTO tasks (
      name, description, project_id, status,
      target_date, start_date, task_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING
      id, airtable_id, airtable_auto_number,
      name, description, status, is_done, task_order,
      start_date, target_date, finished_at,
      duration_days, offset_days_to_anchor,
      day_of_publish, auto_start, auto_finished,
      project_airtable_id, project_id,
      assignee_ids, milestone_ids, department_ids,
      created_by_name, created_by_email,
      updated_by_name, updated_by_email,
      created_at, updated_at,
      airtable_created_at, airtable_updated_at,
      metadata
  `;

  const params = [
    data.name,
    data.description || null,
    data.project_id || null,
    data.status || 'todo',
    data.target_date || null,
    data.start_date || null,
    data.task_order ?? 0,
  ];

  const rows = await query<DBTask>(sql, params);
  return rows[0];
}

/**
 * Delete a task by ID
 */
export async function deleteTask(id: string): Promise<boolean> {
  const sql = `DELETE FROM tasks WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get task statistics grouped by status
 */
export async function getTaskStats(): Promise<{
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  overdue: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'todo') as todo,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE is_done = true OR status IN ('done', 'completed')) as done,
      COUNT(*) FILTER (WHERE target_date < CURRENT_DATE AND is_done = false) as overdue
    FROM tasks
  `;

  const rows = await query<{
    total: string;
    todo: string;
    in_progress: string;
    done: string;
    overdue: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    todo: parseInt(rows[0]?.todo || '0', 10),
    in_progress: parseInt(rows[0]?.in_progress || '0', 10),
    done: parseInt(rows[0]?.done || '0', 10),
    overdue: parseInt(rows[0]?.overdue || '0', 10),
  };
}
