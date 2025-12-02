/**
 * Task Assignments Database Queries
 *
 * Database queries for task assignments with multi-role support.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute, transaction, PoolClient } from './index';

// ============================================
// TYPES
// ============================================

export interface DBTaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  role_id: string;
  is_primary: boolean;
  assigned_by: string | null;
  assigned_at: string;
  completed_at: string | null;
  notes: string | null;
  // Joined fields
  user_name?: string;
  user_email?: string;
  role_name?: string;
  role_color?: string;
  role_icon?: string;
  task_name?: string;
}

export interface TaskAssignmentFilters {
  taskId?: string;
  userId?: string;
  roleId?: string;
  isPrimary?: boolean;
  isCompleted?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all task assignments with filtering
 */
export async function getTaskAssignments(
  filters: TaskAssignmentFilters = {}
): Promise<DBTaskAssignment[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.taskId) {
    conditions.push(`ta.task_id = $${paramIndex++}`);
    params.push(filters.taskId);
  }

  if (filters.userId) {
    conditions.push(`ta.user_id = $${paramIndex++}`);
    params.push(filters.userId);
  }

  if (filters.roleId) {
    conditions.push(`ta.role_id = $${paramIndex++}`);
    params.push(filters.roleId);
  }

  if (filters.isPrimary !== undefined) {
    conditions.push(`ta.is_primary = $${paramIndex++}`);
    params.push(filters.isPrimary);
  }

  if (filters.isCompleted !== undefined) {
    if (filters.isCompleted) {
      conditions.push(`ta.completed_at IS NOT NULL`);
    } else {
      conditions.push(`ta.completed_at IS NULL`);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Add LIMIT and OFFSET as parameterized values
  let limitClause = '';
  let offsetClause = '';

  if (filters.limit) {
    params.push(filters.limit);
    limitClause = `LIMIT $${paramIndex++}`;
  }

  if (filters.offset) {
    params.push(filters.offset);
    offsetClause = `OFFSET $${paramIndex++}`;
  }

  const sql = `
    SELECT
      ta.id, ta.task_id, ta.user_id, ta.role_id,
      ta.is_primary, ta.assigned_by, ta.assigned_at, ta.completed_at, ta.notes,
      u.email as user_name,
      u.email as user_email,
      pr.name as role_name,
      pr.color as role_color,
      pr.icon as role_icon,
      t.name as task_name
    FROM task_assignments ta
    LEFT JOIN admin_users au ON au.id = ta.user_id
    LEFT JOIN users u ON u.id = au.user_id
    LEFT JOIN project_roles pr ON pr.id = ta.role_id
    LEFT JOIN tasks t ON t.id = ta.task_id
    ${whereClause}
    ORDER BY ta.is_primary DESC, ta.assigned_at ASC
    ${limitClause} ${offsetClause}
  `;

  return query<DBTaskAssignment>(sql, params);
}

/**
 * Get assignments for a specific task
 */
export async function getTaskAssignmentsByTaskId(taskId: string): Promise<DBTaskAssignment[]> {
  return getTaskAssignments({ taskId });
}

/**
 * Get assignments for a specific user
 */
export async function getTaskAssignmentsByUserId(userId: string): Promise<DBTaskAssignment[]> {
  return getTaskAssignments({ userId });
}

/**
 * Get a task assignment by ID
 */
export async function getTaskAssignmentById(id: string): Promise<DBTaskAssignment | null> {
  const sql = `
    SELECT
      ta.id, ta.task_id, ta.user_id, ta.role_id,
      ta.is_primary, ta.assigned_by, ta.assigned_at, ta.completed_at, ta.notes,
      u.email as user_name,
      u.email as user_email,
      pr.name as role_name,
      pr.color as role_color,
      pr.icon as role_icon,
      t.name as task_name
    FROM task_assignments ta
    LEFT JOIN admin_users au ON au.id = ta.user_id
    LEFT JOIN users u ON u.id = au.user_id
    LEFT JOIN project_roles pr ON pr.id = ta.role_id
    LEFT JOIN tasks t ON t.id = ta.task_id
    WHERE ta.id = $1
  `;

  const rows = await query<DBTaskAssignment>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new task assignment
 */
export async function createTaskAssignment(data: {
  task_id: string;
  user_id: string;
  role_id: string;
  is_primary?: boolean;
  assigned_by?: string;
  notes?: string;
}): Promise<DBTaskAssignment> {
  const sql = `
    INSERT INTO task_assignments (task_id, user_id, role_id, is_primary, assigned_by, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (task_id, user_id, role_id) DO UPDATE SET
      is_primary = EXCLUDED.is_primary,
      assigned_by = EXCLUDED.assigned_by,
      notes = EXCLUDED.notes,
      assigned_at = NOW()
    RETURNING id, task_id, user_id, role_id, is_primary, assigned_by, assigned_at, completed_at, notes
  `;

  const rows = await query<DBTaskAssignment>(sql, [
    data.task_id,
    data.user_id,
    data.role_id,
    data.is_primary ?? false,
    data.assigned_by || null,
    data.notes || null,
  ]);

  return rows[0];
}

/**
 * Assign multiple users to a task with different roles
 */
export async function assignUsersToTask(
  taskId: string,
  assignments: Array<{
    user_id: string;
    role_id: string;
    is_primary?: boolean;
  }>,
  assignedBy?: string
): Promise<DBTaskAssignment[]> {
  return transaction(async (client: PoolClient) => {
    const results: DBTaskAssignment[] = [];

    for (const assignment of assignments) {
      const sql = `
        INSERT INTO task_assignments (task_id, user_id, role_id, is_primary, assigned_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (task_id, user_id, role_id) DO UPDATE SET
          is_primary = EXCLUDED.is_primary,
          assigned_by = EXCLUDED.assigned_by,
          assigned_at = NOW()
        RETURNING id, task_id, user_id, role_id, is_primary, assigned_by, assigned_at, completed_at, notes
      `;

      const result = await client.query(sql, [
        taskId,
        assignment.user_id,
        assignment.role_id,
        assignment.is_primary ?? false,
        assignedBy || null,
      ]);

      if (result.rows[0]) {
        results.push(result.rows[0]);
      }
    }

    return results;
  });
}

/**
 * Update a task assignment
 */
export async function updateTaskAssignment(
  id: string,
  data: Partial<Pick<DBTaskAssignment, 'is_primary' | 'completed_at' | 'notes'>>
): Promise<DBTaskAssignment | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (data.is_primary !== undefined) {
    setClauses.push(`is_primary = $${paramIndex++}`);
    params.push(data.is_primary);
  }

  if (data.completed_at !== undefined) {
    setClauses.push(`completed_at = $${paramIndex++}`);
    params.push(data.completed_at);
  }

  if (data.notes !== undefined) {
    setClauses.push(`notes = $${paramIndex++}`);
    params.push(data.notes);
  }

  if (setClauses.length === 0) return null;

  params.push(id);

  const sql = `
    UPDATE task_assignments
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, task_id, user_id, role_id, is_primary, assigned_by, assigned_at, completed_at, notes
  `;

  const rows = await query<DBTaskAssignment>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Mark a task assignment as completed
 */
export async function completeTaskAssignment(id: string): Promise<DBTaskAssignment | null> {
  const sql = `
    UPDATE task_assignments
    SET completed_at = NOW()
    WHERE id = $1
    RETURNING id, task_id, user_id, role_id, is_primary, assigned_by, assigned_at, completed_at, notes
  `;

  const rows = await query<DBTaskAssignment>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a task assignment
 */
export async function deleteTaskAssignment(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM task_assignments WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Remove all assignments for a specific user from a task
 */
export async function removeUserFromTask(taskId: string, userId: string): Promise<number> {
  const result = await execute(
    'DELETE FROM task_assignments WHERE task_id = $1 AND user_id = $2',
    [taskId, userId]
  );
  return result.rowCount ?? 0;
}

/**
 * Remove all assignments for a task
 */
export async function clearTaskAssignments(taskId: string): Promise<number> {
  const result = await execute('DELETE FROM task_assignments WHERE task_id = $1', [taskId]);
  return result.rowCount ?? 0;
}

/**
 * Get primary assignee for a task
 */
export async function getPrimaryAssignee(taskId: string): Promise<DBTaskAssignment | null> {
  const assignments = await getTaskAssignments({ taskId, isPrimary: true, limit: 1 });
  return assignments.length > 0 ? assignments[0] : null;
}

/**
 * Set primary assignee for a task (removes primary from others)
 */
export async function setPrimaryAssignee(
  taskId: string,
  assignmentId: string
): Promise<boolean> {
  return transaction(async (client: PoolClient) => {
    // Lock the rows to prevent race conditions
    await client.query(
      'SELECT id FROM task_assignments WHERE task_id = $1 FOR UPDATE',
      [taskId]
    );

    // Remove primary from all assignments
    await client.query(
      'UPDATE task_assignments SET is_primary = false WHERE task_id = $1',
      [taskId]
    );

    // Set the specified assignment as primary
    const result = await client.query(
      'UPDATE task_assignments SET is_primary = true WHERE id = $1 AND task_id = $2',
      [assignmentId, taskId]
    );

    return (result.rowCount ?? 0) > 0;
  });
}

/**
 * Get task count by assignee
 */
export async function getTaskCountByAssignee(userId: string): Promise<{
  total: number;
  pending: number;
  completed: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE ta.completed_at IS NULL) as pending,
      COUNT(*) FILTER (WHERE ta.completed_at IS NOT NULL) as completed
    FROM task_assignments ta
    WHERE ta.user_id = $1
  `;

  const rows = await query<{ total: string; pending: string; completed: string }>(sql, [userId]);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    pending: parseInt(rows[0]?.pending || '0', 10),
    completed: parseInt(rows[0]?.completed || '0', 10),
  };
}
