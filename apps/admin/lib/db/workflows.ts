/**
 * Workflows Database Queries
 *
 * Database queries for workflow definitions, statuses, and transitions.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface DBWorkflowDefinition {
  id: string;
  name: string;
  description: string | null;
  project_type: 'video' | 'course' | 'blog' | 'social' | 'general';
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  status_count?: number;
}

export interface DBWorkflowStatus {
  id: string;
  workflow_id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  order_index: number;
  is_start_state: boolean;
  is_done_state: boolean;
  is_cancelled_state: boolean;
  auto_progress_to: string | null;
  created_at: string;
}

export interface DBWorkflowTransition {
  id: string;
  workflow_id: string;
  from_status_id: string;
  to_status_id: string;
  requires_approval: boolean;
  required_role_id: string | null;
  // Joined fields
  from_status_name?: string;
  to_status_name?: string;
}

export interface WorkflowWithStatuses extends DBWorkflowDefinition {
  statuses: DBWorkflowStatus[];
}

// ============================================
// WORKFLOW DEFINITIONS
// ============================================

/**
 * Get all workflow definitions
 */
export async function getAllWorkflows(filters: {
  projectType?: string;
  isActive?: boolean;
} = {}): Promise<DBWorkflowDefinition[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.projectType) {
    conditions.push(`w.project_type = $${paramIndex++}`);
    params.push(filters.projectType);
  }

  if (filters.isActive !== undefined) {
    conditions.push(`w.is_active = $${paramIndex++}`);
    params.push(filters.isActive);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      w.id, w.name, w.description, w.project_type,
      w.is_default, w.is_active, w.created_at, w.updated_at,
      COUNT(ws.id)::int as status_count
    FROM workflow_definitions w
    LEFT JOIN workflow_statuses ws ON ws.workflow_id = w.id
    ${whereClause}
    GROUP BY w.id
    ORDER BY w.is_default DESC, w.name ASC
  `;

  return query<DBWorkflowDefinition>(sql, params);
}

/**
 * Get a workflow definition by ID with its statuses
 */
export async function getWorkflowById(id: string): Promise<WorkflowWithStatuses | null> {
  const workflowSql = `
    SELECT
      id, name, description, project_type,
      is_default, is_active, created_at, updated_at
    FROM workflow_definitions
    WHERE id = $1
  `;

  const workflows = await query<DBWorkflowDefinition>(workflowSql, [id]);
  if (workflows.length === 0) return null;

  const statusesSql = `
    SELECT
      id, workflow_id, name, slug, description, color, icon,
      order_index, is_start_state, is_done_state, is_cancelled_state,
      auto_progress_to, created_at
    FROM workflow_statuses
    WHERE workflow_id = $1
    ORDER BY order_index ASC
  `;

  const statuses = await query<DBWorkflowStatus>(statusesSql, [id]);

  return {
    ...workflows[0],
    statuses,
  };
}

/**
 * Get default workflow for a project type
 */
export async function getDefaultWorkflowForType(
  projectType: string
): Promise<WorkflowWithStatuses | null> {
  const sql = `
    SELECT id FROM workflow_definitions
    WHERE project_type = $1 AND is_default = true AND is_active = true
    LIMIT 1
  `;

  const rows = await query<{ id: string }>(sql, [projectType]);
  if (rows.length === 0) {
    // Fallback to general workflow
    const fallbackRows = await query<{ id: string }>(
      `SELECT id FROM workflow_definitions WHERE project_type = 'general' AND is_default = true LIMIT 1`
    );
    if (fallbackRows.length === 0) return null;
    return getWorkflowById(fallbackRows[0].id);
  }

  return getWorkflowById(rows[0].id);
}

/**
 * Create a new workflow definition
 */
export async function createWorkflow(data: {
  name: string;
  description?: string;
  project_type: string;
  is_default?: boolean;
}): Promise<DBWorkflowDefinition> {
  const sql = `
    INSERT INTO workflow_definitions (name, description, project_type, is_default)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, description, project_type, is_default, is_active, created_at, updated_at
  `;

  const rows = await query<DBWorkflowDefinition>(sql, [
    data.name,
    data.description || null,
    data.project_type,
    data.is_default ?? false,
  ]);

  return rows[0];
}

/**
 * Update a workflow definition
 */
export async function updateWorkflow(
  id: string,
  data: Partial<Pick<DBWorkflowDefinition, 'name' | 'description' | 'is_default' | 'is_active'>>
): Promise<DBWorkflowDefinition | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    params.push(data.name);
  }
  if (data.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    params.push(data.description);
  }
  if (data.is_default !== undefined) {
    setClauses.push(`is_default = $${paramIndex++}`);
    params.push(data.is_default);
  }
  if (data.is_active !== undefined) {
    setClauses.push(`is_active = $${paramIndex++}`);
    params.push(data.is_active);
  }

  if (setClauses.length === 0) return null;

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const sql = `
    UPDATE workflow_definitions
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, description, project_type, is_default, is_active, created_at, updated_at
  `;

  const rows = await query<DBWorkflowDefinition>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// ============================================
// WORKFLOW STATUSES
// ============================================

/**
 * Get all statuses for a workflow
 */
export async function getWorkflowStatuses(workflowId: string): Promise<DBWorkflowStatus[]> {
  const sql = `
    SELECT
      id, workflow_id, name, slug, description, color, icon,
      order_index, is_start_state, is_done_state, is_cancelled_state,
      auto_progress_to, created_at
    FROM workflow_statuses
    WHERE workflow_id = $1
    ORDER BY order_index ASC
  `;

  return query<DBWorkflowStatus>(sql, [workflowId]);
}

/**
 * Get a workflow status by ID
 */
export async function getWorkflowStatusById(id: string): Promise<DBWorkflowStatus | null> {
  const sql = `
    SELECT
      id, workflow_id, name, slug, description, color, icon,
      order_index, is_start_state, is_done_state, is_cancelled_state,
      auto_progress_to, created_at
    FROM workflow_statuses
    WHERE id = $1
  `;

  const rows = await query<DBWorkflowStatus>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get start status for a workflow
 */
export async function getWorkflowStartStatus(workflowId: string): Promise<DBWorkflowStatus | null> {
  const sql = `
    SELECT
      id, workflow_id, name, slug, description, color, icon,
      order_index, is_start_state, is_done_state, is_cancelled_state,
      auto_progress_to, created_at
    FROM workflow_statuses
    WHERE workflow_id = $1 AND is_start_state = true
    LIMIT 1
  `;

  const rows = await query<DBWorkflowStatus>(sql, [workflowId]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a workflow status
 */
export async function createWorkflowStatus(data: {
  workflow_id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  order_index: number;
  is_start_state?: boolean;
  is_done_state?: boolean;
  is_cancelled_state?: boolean;
}): Promise<DBWorkflowStatus> {
  const sql = `
    INSERT INTO workflow_statuses (
      workflow_id, name, slug, description, color, icon,
      order_index, is_start_state, is_done_state, is_cancelled_state
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, workflow_id, name, slug, description, color, icon,
              order_index, is_start_state, is_done_state, is_cancelled_state,
              auto_progress_to, created_at
  `;

  const rows = await query<DBWorkflowStatus>(sql, [
    data.workflow_id,
    data.name,
    data.slug,
    data.description || null,
    data.color || '#0ec2bc',
    data.icon || null,
    data.order_index,
    data.is_start_state ?? false,
    data.is_done_state ?? false,
    data.is_cancelled_state ?? false,
  ]);

  return rows[0];
}

/**
 * Update a workflow status
 */
export async function updateWorkflowStatus(
  id: string,
  data: Partial<Pick<DBWorkflowStatus, 'name' | 'description' | 'color' | 'icon' | 'order_index' | 'is_start_state' | 'is_done_state' | 'is_cancelled_state' | 'auto_progress_to'>>
): Promise<DBWorkflowStatus | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'color', column: 'color' },
    { key: 'icon', column: 'icon' },
    { key: 'order_index', column: 'order_index' },
    { key: 'is_start_state', column: 'is_start_state' },
    { key: 'is_done_state', column: 'is_done_state' },
    { key: 'is_cancelled_state', column: 'is_cancelled_state' },
    { key: 'auto_progress_to', column: 'auto_progress_to' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  params.push(id);

  const sql = `
    UPDATE workflow_statuses
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, workflow_id, name, slug, description, color, icon,
              order_index, is_start_state, is_done_state, is_cancelled_state,
              auto_progress_to, created_at
  `;

  const rows = await query<DBWorkflowStatus>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a workflow status
 */
export async function deleteWorkflowStatus(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM workflow_statuses WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

// ============================================
// WORKFLOW TRANSITIONS
// ============================================

/**
 * Get all transitions for a workflow
 */
export async function getWorkflowTransitions(workflowId: string): Promise<DBWorkflowTransition[]> {
  const sql = `
    SELECT
      t.id, t.workflow_id, t.from_status_id, t.to_status_id,
      t.requires_approval, t.required_role_id,
      fs.name as from_status_name,
      ts.name as to_status_name
    FROM workflow_transitions t
    JOIN workflow_statuses fs ON fs.id = t.from_status_id
    JOIN workflow_statuses ts ON ts.id = t.to_status_id
    WHERE t.workflow_id = $1
    ORDER BY fs.order_index, ts.order_index
  `;

  return query<DBWorkflowTransition>(sql, [workflowId]);
}

/**
 * Check if a transition is allowed
 */
export async function isTransitionAllowed(
  workflowId: string,
  fromStatusId: string,
  toStatusId: string
): Promise<{ allowed: boolean; requiresApproval: boolean; requiredRoleId: string | null }> {
  const sql = `
    SELECT requires_approval, required_role_id
    FROM workflow_transitions
    WHERE workflow_id = $1 AND from_status_id = $2 AND to_status_id = $3
  `;

  const rows = await query<{ requires_approval: boolean; required_role_id: string | null }>(sql, [
    workflowId,
    fromStatusId,
    toStatusId,
  ]);

  if (rows.length === 0) {
    return { allowed: false, requiresApproval: false, requiredRoleId: null };
  }

  return {
    allowed: true,
    requiresApproval: rows[0].requires_approval,
    requiredRoleId: rows[0].required_role_id,
  };
}

/**
 * Create a workflow transition
 */
export async function createWorkflowTransition(data: {
  workflow_id: string;
  from_status_id: string;
  to_status_id: string;
  requires_approval?: boolean;
  required_role_id?: string;
}): Promise<DBWorkflowTransition> {
  const sql = `
    INSERT INTO workflow_transitions (
      workflow_id, from_status_id, to_status_id, requires_approval, required_role_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, workflow_id, from_status_id, to_status_id, requires_approval, required_role_id
  `;

  const rows = await query<DBWorkflowTransition>(sql, [
    data.workflow_id,
    data.from_status_id,
    data.to_status_id,
    data.requires_approval ?? false,
    data.required_role_id || null,
  ]);

  return rows[0];
}

/**
 * Delete a workflow transition
 */
export async function deleteWorkflowTransition(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM workflow_transitions WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
