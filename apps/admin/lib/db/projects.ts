/**
 * Projects Database Queries
 *
 * Database queries for project management via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query, execute } from './index';

// Database row type (snake_case)
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
  metadata: Record<string, unknown>;
}

// Filter options
export interface ProjectFilters {
  status?: string | string[];
  projectType?: string;
  intervalType?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Result type
export interface ProjectListResult {
  projects: DBProject[];
  total: number;
}

/**
 * List all projects with filtering and pagination
 */
export async function getAllProjects(filters: ProjectFilters = {}): Promise<ProjectListResult> {
  const {
    status,
    projectType,
    intervalType,
    search,
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

  // Status filter - handle both single status and array of statuses
  if (status) {
    if (Array.isArray(status)) {
      const placeholders = status.map(() => `$${paramIndex++}`).join(', ');
      conditions.push(`status IN (${placeholders})`);
      params.push(...status);
    } else {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }
  }

  if (projectType) {
    conditions.push(`project_type = $${paramIndex++}`);
    params.push(projectType);
  }

  if (intervalType) {
    conditions.push(`interval_type = $${paramIndex++}`);
    params.push(intervalType);
  }

  if (search) {
    conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = [
    'created_at',
    'updated_at',
    'title',
    'status',
    'start_date',
    'target_date',
    'progress_percent',
    'project_type'
  ];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM projects ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      id, airtable_id, title, description, project_type, interval_type,
      status, progress_percent, tasks_total, tasks_done, used_template,
      start_date, target_date, day_of_publish, assignee_ids,
      created_at, updated_at, metadata
    FROM projects
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await query<DBProject>(dataSql, params);

  return {
    projects: rows,
    total,
  };
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<DBProject | null> {
  const sql = `
    SELECT
      id, airtable_id, title, description, project_type, interval_type,
      status, progress_percent, tasks_total, tasks_done, used_template,
      start_date, target_date, day_of_publish, assignee_ids,
      created_at, updated_at, metadata
    FROM projects
    WHERE id = $1
  `;

  const rows = await query<DBProject>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Update project input type
 */
export interface UpdateProjectInput {
  title?: string;
  description?: string | null;
  status?: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled' | 'todo' | 'not_started';
  start_date?: string | null;
  target_date?: string | null;
  project_type?: string | null;
  interval_type?: string | null;
  progress_percent?: number;
  tasks_total?: number;
  tasks_done?: number;
}

/**
 * Update a project by ID
 * Only updates fields that are provided in the input
 */
export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<DBProject | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateProjectInput; column: string }> = [
    { key: 'title', column: 'title' },
    { key: 'description', column: 'description' },
    { key: 'status', column: 'status' },
    { key: 'start_date', column: 'start_date' },
    { key: 'target_date', column: 'target_date' },
    { key: 'project_type', column: 'project_type' },
    { key: 'interval_type', column: 'interval_type' },
    { key: 'progress_percent', column: 'progress_percent' },
    { key: 'tasks_total', column: 'tasks_total' },
    { key: 'tasks_done', column: 'tasks_done' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current project
    return getProjectById(id);
  }

  // The updated_at trigger will automatically update the timestamp

  params.push(id);
  const sql = `
    UPDATE projects
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, airtable_id, title, description, project_type, interval_type,
      status, progress_percent, tasks_total, tasks_done, used_template,
      start_date, target_date, day_of_publish, assignee_ids,
      created_at, updated_at, metadata
  `;

  const rows = await query<DBProject>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create project input type
 */
export interface CreateProjectInput {
  title: string;
  description?: string;
  project_type?: string;
  interval_type?: string;
  status?: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled' | 'todo' | 'not_started';
  start_date?: string;
  target_date?: string;
  used_template?: boolean;
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectInput): Promise<DBProject> {
  const sql = `
    INSERT INTO projects (
      title, description, project_type, interval_type,
      status, start_date, target_date, used_template
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING
      id, airtable_id, title, description, project_type, interval_type,
      status, progress_percent, tasks_total, tasks_done, used_template,
      start_date, target_date, day_of_publish, assignee_ids,
      created_at, updated_at, metadata
  `;

  const params = [
    data.title,
    data.description || null,
    data.project_type || null,
    data.interval_type || null,
    data.status || 'planning',
    data.start_date || null,
    data.target_date || null,
    data.used_template ?? false,
  ];

  const rows = await query<DBProject>(sql, params);
  return rows[0];
}

/**
 * Delete a project by ID
 * Returns true if the project was deleted, false if it was not found
 */
export async function deleteProject(id: string): Promise<boolean> {
  const sql = `DELETE FROM projects WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get project statistics by status
 */
export async function getProjectStats(): Promise<{
  total: number;
  active: number;
  completed: number;
  planning: number;
  paused: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'planning') as planning,
      COUNT(*) FILTER (WHERE status = 'paused') as paused
    FROM projects
  `;

  const rows = await query<{
    total: string;
    active: string;
    completed: string;
    planning: string;
    paused: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    active: parseInt(rows[0]?.active || '0', 10),
    completed: parseInt(rows[0]?.completed || '0', 10),
    planning: parseInt(rows[0]?.planning || '0', 10),
    paused: parseInt(rows[0]?.paused || '0', 10),
  };
}

/**
 * Recalculate project progress based on actual task counts
 * Updates progress_percent, tasks_total, and tasks_done from tasks table
 */
export async function recalculateProjectProgress(id: string): Promise<void> {
  const sql = `
    UPDATE projects
    SET
      tasks_total = (
        SELECT COUNT(*)
        FROM tasks
        WHERE project_id = $1
      ),
      tasks_done = (
        SELECT COUNT(*)
        FROM tasks
        WHERE project_id = $1 AND is_done = true
      ),
      progress_percent = (
        CASE
          WHEN (SELECT COUNT(*) FROM tasks WHERE project_id = $1) = 0 THEN 0
          ELSE (
            SELECT (COUNT(*) FILTER (WHERE is_done = true) * 100.0 / COUNT(*))::DECIMAL(5,2)
            FROM tasks
            WHERE project_id = $1
          )
        END
      )
    WHERE id = $1
  `;

  await execute(sql, [id]);
}
