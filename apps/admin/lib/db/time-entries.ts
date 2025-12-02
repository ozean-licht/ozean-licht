/**
 * Time Entries Database Queries
 *
 * Database queries for task time tracking via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 *
 * Phase 9 of Project Management MVP
 */

import { query, execute } from './index';

// Database row type (snake_case) - matches task_time_entries table schema
export interface DBTimeEntry {
  id: string;
  task_id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  description: string | null;
  duration_minutes: number;
  started_at: string | null;
  ended_at: string | null;
  work_date: string;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields from task
  task_name?: string;
  task_code?: string;
  project_id?: string;
  project_title?: string;
}

// Filter options for time entry queries
export interface TimeEntryFilters {
  taskId?: string;
  userId?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
  isBillable?: boolean;
  limit?: number;
  offset?: number;
}

// Result type for paginated queries
export interface TimeEntryListResult {
  entries: DBTimeEntry[];
  total: number;
  totalMinutes: number;
}

/**
 * Get all time entries for a task
 */
export async function getTimeEntriesByTaskId(
  taskId: string,
  limit: number = 50
): Promise<DBTimeEntry[]> {
  const sql = `
    SELECT
      tte.id, tte.task_id, tte.user_id,
      tte.user_name, tte.user_email,
      tte.description, tte.duration_minutes,
      tte.started_at, tte.ended_at, tte.work_date,
      tte.is_billable, tte.created_at, tte.updated_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_time_entries tte
    LEFT JOIN tasks t ON tte.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE tte.task_id = $1
    ORDER BY tte.work_date DESC, tte.created_at DESC
    LIMIT $2
  `;

  return query<DBTimeEntry>(sql, [taskId, limit]);
}

/**
 * Get time entries with filtering
 */
export async function getTimeEntries(
  filters: TimeEntryFilters = {}
): Promise<TimeEntryListResult> {
  const {
    taskId,
    userId,
    projectId,
    startDate,
    endDate,
    isBillable,
    limit: requestedLimit = 50,
    offset = 0,
  } = filters;

  // Cap limit at 100 to prevent DoS
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (taskId) {
    conditions.push(`tte.task_id = $${paramIndex++}`);
    params.push(taskId);
  }

  if (userId) {
    conditions.push(`tte.user_id = $${paramIndex++}`);
    params.push(userId);
  }

  if (projectId) {
    conditions.push(`t.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  if (startDate) {
    conditions.push(`tte.work_date >= $${paramIndex++}`);
    params.push(startDate);
  }

  if (endDate) {
    conditions.push(`tte.work_date <= $${paramIndex++}`);
    params.push(endDate);
  }

  if (isBillable !== undefined) {
    conditions.push(`tte.is_billable = $${paramIndex++}`);
    params.push(isBillable);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Count and sum query
  const countSql = `
    SELECT
      COUNT(*) as count,
      COALESCE(SUM(tte.duration_minutes), 0) as total_minutes
    FROM task_time_entries tte
    LEFT JOIN tasks t ON tte.task_id = t.id
    ${whereClause}
  `;
  const countResult = await query<{ count: string; total_minutes: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);
  const totalMinutes = parseInt(countResult[0]?.total_minutes || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      tte.id, tte.task_id, tte.user_id,
      tte.user_name, tte.user_email,
      tte.description, tte.duration_minutes,
      tte.started_at, tte.ended_at, tte.work_date,
      tte.is_billable, tte.created_at, tte.updated_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_time_entries tte
    LEFT JOIN tasks t ON tte.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    ${whereClause}
    ORDER BY tte.work_date DESC, tte.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const entries = await query<DBTimeEntry>(dataSql, params);

  return { entries, total, totalMinutes };
}

/**
 * Get a single time entry by ID
 */
export async function getTimeEntryById(id: string): Promise<DBTimeEntry | null> {
  const sql = `
    SELECT
      tte.id, tte.task_id, tte.user_id,
      tte.user_name, tte.user_email,
      tte.description, tte.duration_minutes,
      tte.started_at, tte.ended_at, tte.work_date,
      tte.is_billable, tte.created_at, tte.updated_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_time_entries tte
    LEFT JOIN tasks t ON tte.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE tte.id = $1
  `;

  const rows = await query<DBTimeEntry>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new time entry
 */
export async function createTimeEntry(data: {
  task_id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  description?: string;
  duration_minutes: number;
  started_at?: string;
  ended_at?: string;
  work_date?: string;
  is_billable?: boolean;
}): Promise<DBTimeEntry> {
  const sql = `
    INSERT INTO task_time_entries (
      task_id, user_id, user_name, user_email,
      description, duration_minutes,
      started_at, ended_at, work_date, is_billable
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING
      id, task_id, user_id, user_name, user_email,
      description, duration_minutes,
      started_at, ended_at, work_date, is_billable,
      created_at, updated_at
  `;

  const params = [
    data.task_id,
    data.user_id || null,
    data.user_name || null,
    data.user_email || null,
    data.description || null,
    data.duration_minutes,
    data.started_at || null,
    data.ended_at || null,
    data.work_date || new Date().toISOString().split('T')[0],
    data.is_billable ?? false,
  ];

  const rows = await query<DBTimeEntry>(sql, params);
  return rows[0];
}

/**
 * Update a time entry
 */
export async function updateTimeEntry(
  id: string,
  data: Partial<{
    description: string;
    duration_minutes: number;
    started_at: string;
    ended_at: string;
    work_date: string;
    is_billable: boolean;
  }>
): Promise<DBTimeEntry | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'description', column: 'description' },
    { key: 'duration_minutes', column: 'duration_minutes' },
    { key: 'started_at', column: 'started_at' },
    { key: 'ended_at', column: 'ended_at' },
    { key: 'work_date', column: 'work_date' },
    { key: 'is_billable', column: 'is_billable' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    return getTimeEntryById(id);
  }

  // Always update updated_at
  setClauses.push('updated_at = NOW()');

  params.push(id);
  const sql = `
    UPDATE task_time_entries
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, task_id, user_id, user_name, user_email,
      description, duration_minutes,
      started_at, ended_at, work_date, is_billable,
      created_at, updated_at
  `;

  const rows = await query<DBTimeEntry>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(id: string): Promise<boolean> {
  const sql = `DELETE FROM task_time_entries WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get time statistics for a task
 */
export async function getTaskTimeStats(taskId: string): Promise<{
  totalMinutes: number;
  billableMinutes: number;
  entryCount: number;
  estimatedHours: number | null;
  actualHours: number;
}> {
  const sql = `
    SELECT
      COALESCE(SUM(tte.duration_minutes), 0) as total_minutes,
      COALESCE(SUM(CASE WHEN tte.is_billable THEN tte.duration_minutes ELSE 0 END), 0) as billable_minutes,
      COUNT(tte.id) as entry_count,
      t.estimated_hours,
      COALESCE(t.actual_hours, 0) as actual_hours
    FROM tasks t
    LEFT JOIN task_time_entries tte ON t.id = tte.task_id
    WHERE t.id = $1
    GROUP BY t.id, t.estimated_hours, t.actual_hours
  `;

  const rows = await query<{
    total_minutes: string;
    billable_minutes: string;
    entry_count: string;
    estimated_hours: string | null;
    actual_hours: string;
  }>(sql, [taskId]);

  if (rows.length === 0) {
    return {
      totalMinutes: 0,
      billableMinutes: 0,
      entryCount: 0,
      estimatedHours: null,
      actualHours: 0,
    };
  }

  return {
    totalMinutes: parseInt(rows[0].total_minutes || '0', 10),
    billableMinutes: parseInt(rows[0].billable_minutes || '0', 10),
    entryCount: parseInt(rows[0].entry_count || '0', 10),
    estimatedHours: rows[0].estimated_hours ? parseFloat(rows[0].estimated_hours) : null,
    actualHours: parseFloat(rows[0].actual_hours || '0'),
  };
}

/**
 * Get time statistics for a project
 */
export async function getProjectTimeStats(projectId: string): Promise<{
  totalMinutes: number;
  billableMinutes: number;
  entryCount: number;
  taskCount: number;
}> {
  const sql = `
    SELECT
      COALESCE(SUM(tte.duration_minutes), 0) as total_minutes,
      COALESCE(SUM(CASE WHEN tte.is_billable THEN tte.duration_minutes ELSE 0 END), 0) as billable_minutes,
      COUNT(DISTINCT tte.id) as entry_count,
      COUNT(DISTINCT t.id) as task_count
    FROM tasks t
    LEFT JOIN task_time_entries tte ON t.id = tte.task_id
    WHERE t.project_id = $1
  `;

  const rows = await query<{
    total_minutes: string;
    billable_minutes: string;
    entry_count: string;
    task_count: string;
  }>(sql, [projectId]);

  return {
    totalMinutes: parseInt(rows[0]?.total_minutes || '0', 10),
    billableMinutes: parseInt(rows[0]?.billable_minutes || '0', 10),
    entryCount: parseInt(rows[0]?.entry_count || '0', 10),
    taskCount: parseInt(rows[0]?.task_count || '0', 10),
  };
}
