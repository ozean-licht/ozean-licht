/**
 * Sprints Database Queries
 *
 * Database queries for sprint management via direct PostgreSQL connection.
 * Part of Project Management MVP Phase 10
 */

import { query, execute } from './index';

// Sprint status type
export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

// Database row type (snake_case)
export interface DBSprint {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  start_date: string | null;
  end_date: string | null;
  velocity: number | null;
  created_at: string;
  updated_at: string;
  // Computed fields (from queries)
  task_count?: number;
  completed_task_count?: number;
  total_story_points?: number;
  completed_story_points?: number;
  project_name?: string;
}

// Filter options for sprint queries
export interface SprintFilters {
  projectId?: string;
  status?: SprintStatus | SprintStatus[];
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Result type for paginated queries
export interface SprintListResult {
  sprints: DBSprint[];
  total: number;
}

// Input for creating a sprint
export interface CreateSprintInput {
  project_id: string;
  name: string;
  goal?: string;
  status?: SprintStatus;
  start_date?: string;
  end_date?: string;
}

// Input for updating a sprint
export interface UpdateSprintInput {
  name?: string;
  goal?: string;
  status?: SprintStatus;
  start_date?: string;
  end_date?: string;
  velocity?: number;
}

/**
 * Get all sprints with filtering and pagination
 */
export async function getAllSprints(filters: SprintFilters = {}): Promise<SprintListResult> {
  const {
    projectId,
    status,
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

  // Project filter
  if (projectId) {
    conditions.push(`s.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  // Status filter
  if (status) {
    if (Array.isArray(status)) {
      const placeholders = status.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`s.status IN (${placeholders})`);
      params.push(...status);
      paramIndex += status.length;
    } else {
      conditions.push(`s.status = $${paramIndex++}`);
      params.push(status);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = ['created_at', 'updated_at', 'name', 'status', 'start_date', 'end_date'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? `s.${orderBy}` : 's.created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM sprints s
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with task statistics
  const dataSql = `
    SELECT
      s.id, s.project_id, s.name, s.goal, s.status,
      s.start_date, s.end_date, s.velocity,
      s.created_at, s.updated_at,
      p.title as project_name,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id) as task_count,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_task_count,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id) as total_story_points,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_story_points
    FROM sprints s
    LEFT JOIN projects p ON s.project_id = p.id
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

  // Add limit and offset to params array
  const dataParams = [...params, limit, offset];
  const rows = await query<DBSprint>(dataSql, dataParams);

  return {
    sprints: rows,
    total,
  };
}

/**
 * Get sprints for a specific project
 */
export async function getSprintsByProjectId(projectId: string): Promise<DBSprint[]> {
  const sql = `
    SELECT
      s.id, s.project_id, s.name, s.goal, s.status,
      s.start_date, s.end_date, s.velocity,
      s.created_at, s.updated_at,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id) as task_count,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_task_count,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id) as total_story_points,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_story_points
    FROM sprints s
    WHERE s.project_id = $1
    ORDER BY
      CASE s.status
        WHEN 'active' THEN 1
        WHEN 'planning' THEN 2
        WHEN 'completed' THEN 3
        ELSE 4
      END,
      s.start_date DESC NULLS LAST,
      s.created_at DESC
  `;

  return query<DBSprint>(sql, [projectId]);
}

/**
 * Get a single sprint by ID with task statistics
 */
export async function getSprintById(id: string): Promise<DBSprint | null> {
  const sql = `
    SELECT
      s.id, s.project_id, s.name, s.goal, s.status,
      s.start_date, s.end_date, s.velocity,
      s.created_at, s.updated_at,
      p.title as project_name,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id) as task_count,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_task_count,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id) as total_story_points,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_story_points
    FROM sprints s
    LEFT JOIN projects p ON s.project_id = p.id
    WHERE s.id = $1
  `;

  const rows = await query<DBSprint>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get the active sprint for a project
 */
export async function getActiveSprintForProject(projectId: string): Promise<DBSprint | null> {
  const sql = `
    SELECT
      s.id, s.project_id, s.name, s.goal, s.status,
      s.start_date, s.end_date, s.velocity,
      s.created_at, s.updated_at,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id) as task_count,
      (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_task_count,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id) as total_story_points,
      (SELECT COALESCE(SUM(t.story_points), 0) FROM tasks t WHERE t.sprint_id = s.id AND t.is_done = true) as completed_story_points
    FROM sprints s
    WHERE s.project_id = $1 AND s.status = 'active'
    ORDER BY s.start_date DESC
    LIMIT 1
  `;

  const rows = await query<DBSprint>(sql, [projectId]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new sprint
 */
export async function createSprint(data: CreateSprintInput): Promise<DBSprint> {
  const sql = `
    INSERT INTO sprints (
      project_id, name, goal, status, start_date, end_date
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING
      id, project_id, name, goal, status,
      start_date, end_date, velocity,
      created_at, updated_at
  `;

  const params = [
    data.project_id,
    data.name,
    data.goal || null,
    data.status || 'planning',
    data.start_date || null,
    data.end_date || null,
  ];

  const rows = await query<DBSprint>(sql, params);
  return rows[0];
}

/**
 * Update a sprint
 */
export async function updateSprint(id: string, data: UpdateSprintInput): Promise<DBSprint | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateSprintInput; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'goal', column: 'goal' },
    { key: 'status', column: 'status' },
    { key: 'start_date', column: 'start_date' },
    { key: 'end_date', column: 'end_date' },
    { key: 'velocity', column: 'velocity' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    return getSprintById(id);
  }

  params.push(id);
  const sql = `
    UPDATE sprints
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, project_id, name, goal, status,
      start_date, end_date, velocity,
      created_at, updated_at
  `;

  const rows = await query<DBSprint>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a sprint by ID
 */
export async function deleteSprint(id: string): Promise<boolean> {
  const sql = `DELETE FROM sprints WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Start a sprint (set status to active)
 */
export async function startSprint(id: string): Promise<DBSprint | null> {
  // First check if there's already an active sprint for this project
  const sprint = await getSprintById(id);
  if (!sprint) return null;

  const activeCheck = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM sprints WHERE project_id = $1 AND status = 'active' AND id != $2`,
    [sprint.project_id, id]
  );

  if (parseInt(activeCheck[0]?.count || '0', 10) > 0) {
    throw new Error('Cannot start sprint: project already has an active sprint');
  }

  return updateSprint(id, {
    status: 'active',
    start_date: sprint.start_date || new Date().toISOString().split('T')[0],
  });
}

/**
 * Complete a sprint (set status to completed and calculate velocity)
 */
export async function completeSprint(id: string): Promise<DBSprint | null> {
  // Calculate velocity from completed story points
  const velocityResult = await query<{ completed_points: string }>(
    `SELECT COALESCE(SUM(story_points), 0) as completed_points FROM tasks WHERE sprint_id = $1 AND is_done = true`,
    [id]
  );
  const velocity = parseInt(velocityResult[0]?.completed_points || '0', 10);

  return updateSprint(id, {
    status: 'completed',
    velocity,
    end_date: new Date().toISOString().split('T')[0],
  });
}

/**
 * Get sprint statistics
 */
export async function getSprintStats(projectId?: string): Promise<{
  totalSprints: number;
  activeSprints: number;
  planningSprints: number;
  completedSprints: number;
  averageVelocity: number;
}> {
  const whereClause = projectId ? 'WHERE project_id = $1' : '';
  const params = projectId ? [projectId] : [];

  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'planning') as planning,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COALESCE(AVG(velocity) FILTER (WHERE status = 'completed' AND velocity IS NOT NULL), 0) as avg_velocity
    FROM sprints
    ${whereClause}
  `;

  const rows = await query<{
    total: string;
    active: string;
    planning: string;
    completed: string;
    avg_velocity: string;
  }>(sql, params);

  return {
    totalSprints: parseInt(rows[0]?.total || '0', 10),
    activeSprints: parseInt(rows[0]?.active || '0', 10),
    planningSprints: parseInt(rows[0]?.planning || '0', 10),
    completedSprints: parseInt(rows[0]?.completed || '0', 10),
    averageVelocity: parseFloat(rows[0]?.avg_velocity || '0'),
  };
}

/**
 * Get tasks for a sprint
 */
export async function getSprintTasks(sprintId: string): Promise<{
  id: string;
  name: string;
  status: string;
  is_done: boolean;
  story_points: number | null;
  assignee_ids: string[];
}[]> {
  const sql = `
    SELECT
      id, name, status, is_done, story_points, assignee_ids
    FROM tasks
    WHERE sprint_id = $1
    ORDER BY is_done ASC, task_order ASC, created_at ASC
  `;

  return query(sql, [sprintId]);
}

/**
 * Move tasks to a sprint
 */
export async function moveTasksToSprint(
  taskIds: string[],
  sprintId: string | null
): Promise<number> {
  if (taskIds.length === 0) return 0;

  const placeholders = taskIds.map((_, i) => `$${i + 2}`).join(', ');
  const sql = `
    UPDATE tasks
    SET sprint_id = $1, updated_at = NOW()
    WHERE id IN (${placeholders})
  `;

  const result = await execute(sql, [sprintId, ...taskIds]);
  return result.rowCount ?? 0;
}
