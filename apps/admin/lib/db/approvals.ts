/**
 * Approvals Database Queries
 *
 * Database queries for approval gates and approvals.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

/**
 * Approval status type
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'skipped';

/**
 * Entity type that can have approvals
 */
export type ApprovalEntityType = 'task' | 'content_item';

/**
 * Approval Gate database row
 */
export interface DBApprovalGate {
  id: string;
  workflow_id: string;
  name: string;
  description: string | null;
  required_role_id: string | null;
  order_index: number;
  is_required: boolean;
  from_status_id: string | null;
  to_status_id: string | null;
  created_at: string;
  // Joined fields
  workflow_name?: string;
  required_role_name?: string;
  required_role_color?: string;
  from_status_name?: string;
  from_status_color?: string;
  to_status_name?: string;
  to_status_color?: string;
}

/**
 * Approval database row
 */
export interface DBApproval {
  id: string;
  gate_id: string;
  entity_id: string;
  entity_type: ApprovalEntityType;
  status: ApprovalStatus;
  approved_by: string | null;
  comments: string | null;
  requested_at: string;
  decided_at: string | null;
  // Joined fields
  gate_name?: string;
  gate_description?: string;
  gate_is_required?: boolean;
  required_role_id?: string;
  required_role_name?: string;
  approved_by_name?: string;
  approved_by_email?: string;
}

/**
 * Filters for getting pending approvals
 */
export interface PendingApprovalFilters {
  gateId?: string;
  userId?: string;
  entityType?: ApprovalEntityType;
  entityId?: string;
  workflowId?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// APPROVAL GATES
// ============================================

/**
 * Get all approval gates for a workflow
 */
export async function getApprovalGatesByWorkflow(
  workflowId: string
): Promise<DBApprovalGate[]> {
  const sql = `
    SELECT
      ag.id, ag.workflow_id, ag.name, ag.description,
      ag.required_role_id, ag.order_index, ag.is_required,
      ag.from_status_id, ag.to_status_id, ag.created_at,
      w.name as workflow_name,
      pr.name as required_role_name,
      pr.color as required_role_color,
      fs.name as from_status_name,
      fs.color as from_status_color,
      ts.name as to_status_name,
      ts.color as to_status_color
    FROM approval_gates ag
    JOIN workflow_definitions w ON w.id = ag.workflow_id
    LEFT JOIN project_roles pr ON pr.id = ag.required_role_id
    LEFT JOIN workflow_statuses fs ON fs.id = ag.from_status_id
    LEFT JOIN workflow_statuses ts ON ts.id = ag.to_status_id
    WHERE ag.workflow_id = $1
    ORDER BY ag.order_index ASC, ag.created_at ASC
  `;

  return query<DBApprovalGate>(sql, [workflowId]);
}

/**
 * Get a single approval gate by ID
 */
export async function getApprovalGateById(id: string): Promise<DBApprovalGate | null> {
  const sql = `
    SELECT
      ag.id, ag.workflow_id, ag.name, ag.description,
      ag.required_role_id, ag.order_index, ag.is_required,
      ag.from_status_id, ag.to_status_id, ag.created_at,
      w.name as workflow_name,
      pr.name as required_role_name,
      pr.color as required_role_color,
      fs.name as from_status_name,
      fs.color as from_status_color,
      ts.name as to_status_name,
      ts.color as to_status_color
    FROM approval_gates ag
    JOIN workflow_definitions w ON w.id = ag.workflow_id
    LEFT JOIN project_roles pr ON pr.id = ag.required_role_id
    LEFT JOIN workflow_statuses fs ON fs.id = ag.from_status_id
    LEFT JOIN workflow_statuses ts ON ts.id = ag.to_status_id
    WHERE ag.id = $1
  `;

  const rows = await query<DBApprovalGate>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new approval gate
 */
export async function createApprovalGate(data: {
  workflow_id: string;
  name: string;
  description?: string;
  required_role_id?: string;
  order_index?: number;
  is_required?: boolean;
  from_status_id?: string;
  to_status_id?: string;
}): Promise<DBApprovalGate> {
  const sql = `
    INSERT INTO approval_gates (
      workflow_id, name, description, required_role_id,
      order_index, is_required, from_status_id, to_status_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, workflow_id, name, description, required_role_id,
              order_index, is_required, from_status_id, to_status_id, created_at
  `;

  const rows = await query<DBApprovalGate>(sql, [
    data.workflow_id,
    data.name,
    data.description || null,
    data.required_role_id || null,
    data.order_index ?? 0,
    data.is_required ?? true,
    data.from_status_id || null,
    data.to_status_id || null,
  ]);

  return rows[0];
}

/**
 * Update an approval gate
 */
export async function updateApprovalGate(
  id: string,
  data: Partial<Pick<DBApprovalGate, 'name' | 'description' | 'required_role_id' | 'order_index' | 'is_required' | 'from_status_id' | 'to_status_id'>>
): Promise<DBApprovalGate | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'required_role_id', column: 'required_role_id' },
    { key: 'order_index', column: 'order_index' },
    { key: 'is_required', column: 'is_required' },
    { key: 'from_status_id', column: 'from_status_id' },
    { key: 'to_status_id', column: 'to_status_id' },
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
    UPDATE approval_gates
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, workflow_id, name, description, required_role_id,
              order_index, is_required, from_status_id, to_status_id, created_at
  `;

  const rows = await query<DBApprovalGate>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete an approval gate (cascades to approvals)
 */
export async function deleteApprovalGate(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM approval_gates WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

// ============================================
// APPROVALS
// ============================================

/**
 * Get all approvals for an entity with gate information
 */
export async function getApprovalsForEntity(
  entityId: string,
  entityType: ApprovalEntityType
): Promise<DBApproval[]> {
  const sql = `
    SELECT
      a.id, a.gate_id, a.entity_id, a.entity_type,
      a.status, a.approved_by, a.comments,
      a.requested_at, a.decided_at,
      ag.name as gate_name,
      ag.description as gate_description,
      ag.is_required as gate_is_required,
      ag.required_role_id,
      pr.name as required_role_name,
      u.email as approved_by_name,
      u.email as approved_by_email
    FROM approvals a
    JOIN approval_gates ag ON ag.id = a.gate_id
    LEFT JOIN project_roles pr ON pr.id = ag.required_role_id
    LEFT JOIN admin_users au ON au.id = a.approved_by
    LEFT JOIN users u ON u.id = au.user_id
    WHERE a.entity_id = $1 AND a.entity_type = $2
    ORDER BY ag.order_index ASC, a.requested_at ASC
  `;

  return query<DBApproval>(sql, [entityId, entityType]);
}

/**
 * Get pending approvals with optional filters
 */
export async function getPendingApprovals(
  filters: PendingApprovalFilters = {}
): Promise<DBApproval[]> {
  const conditions: string[] = ['a.status = $1'];
  const params: unknown[] = ['pending'];
  let paramIndex = 2;

  if (filters.gateId) {
    conditions.push(`a.gate_id = $${paramIndex++}`);
    params.push(filters.gateId);
  }

  if (filters.entityType) {
    conditions.push(`a.entity_type = $${paramIndex++}`);
    params.push(filters.entityType);
  }

  if (filters.entityId) {
    conditions.push(`a.entity_id = $${paramIndex++}`);
    params.push(filters.entityId);
  }

  if (filters.workflowId) {
    conditions.push(`ag.workflow_id = $${paramIndex++}`);
    params.push(filters.workflowId);
  }

  // For filtering by user's role - check if user has required role
  if (filters.userId) {
    conditions.push(`EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.user_id = $${paramIndex}
      AND ta.role_id = ag.required_role_id
      AND (
        (a.entity_type = 'task' AND ta.task_id = a.entity_id)
        OR
        (a.entity_type = 'content_item' AND ta.task_id IN (
          SELECT task_id FROM content_items WHERE id = a.entity_id
        ))
      )
    )`);
    params.push(filters.userId);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

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
      a.id, a.gate_id, a.entity_id, a.entity_type,
      a.status, a.approved_by, a.comments,
      a.requested_at, a.decided_at,
      ag.name as gate_name,
      ag.description as gate_description,
      ag.is_required as gate_is_required,
      ag.required_role_id,
      pr.name as required_role_name
    FROM approvals a
    JOIN approval_gates ag ON ag.id = a.gate_id
    LEFT JOIN project_roles pr ON pr.id = ag.required_role_id
    WHERE ${whereClause}
    ORDER BY a.requested_at ASC
    ${limitClause} ${offsetClause}
  `;

  return query<DBApproval>(sql, params);
}

/**
 * Get a single approval by ID
 */
export async function getApprovalById(id: string): Promise<DBApproval | null> {
  const sql = `
    SELECT
      a.id, a.gate_id, a.entity_id, a.entity_type,
      a.status, a.approved_by, a.comments,
      a.requested_at, a.decided_at,
      ag.name as gate_name,
      ag.description as gate_description,
      ag.is_required as gate_is_required,
      ag.required_role_id,
      pr.name as required_role_name,
      u.email as approved_by_name,
      u.email as approved_by_email
    FROM approvals a
    JOIN approval_gates ag ON ag.id = a.gate_id
    LEFT JOIN project_roles pr ON pr.id = ag.required_role_id
    LEFT JOIN admin_users au ON au.id = a.approved_by
    LEFT JOIN users u ON u.id = au.user_id
    WHERE a.id = $1
  `;

  const rows = await query<DBApproval>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new approval request (pending status)
 */
export async function createApproval(data: {
  gate_id: string;
  entity_id: string;
  entity_type: ApprovalEntityType;
}): Promise<DBApproval> {
  const sql = `
    INSERT INTO approvals (gate_id, entity_id, entity_type, status)
    VALUES ($1, $2, $3, 'pending')
    ON CONFLICT (gate_id, entity_id, entity_type) DO UPDATE SET
      status = 'pending',
      requested_at = NOW(),
      decided_at = NULL,
      approved_by = NULL,
      comments = NULL
    RETURNING id, gate_id, entity_id, entity_type, status,
              approved_by, comments, requested_at, decided_at
  `;

  const rows = await query<DBApproval>(sql, [
    data.gate_id,
    data.entity_id,
    data.entity_type,
  ]);

  return rows[0];
}

/**
 * Approve or reject an approval
 */
export async function approveOrReject(
  id: string,
  status: 'approved' | 'rejected',
  userId: string,
  comments?: string
): Promise<DBApproval | null> {
  const sql = `
    UPDATE approvals
    SET
      status = $1,
      approved_by = $2,
      comments = $3,
      decided_at = NOW()
    WHERE id = $4 AND status = 'pending'
    RETURNING id, gate_id, entity_id, entity_type, status,
              approved_by, comments, requested_at, decided_at
  `;

  const rows = await query<DBApproval>(sql, [
    status,
    userId,
    comments || null,
    id,
  ]);

  return rows.length > 0 ? rows[0] : null;
}

/**
 * Skip a non-required approval
 */
export async function skipApproval(
  id: string,
  userId: string,
  reason?: string
): Promise<DBApproval | null> {
  // First check if the approval gate is required
  const checkSql = `
    SELECT ag.is_required
    FROM approvals a
    JOIN approval_gates ag ON ag.id = a.gate_id
    WHERE a.id = $1
  `;

  const checkRows = await query<{ is_required: boolean }>(checkSql, [id]);

  if (checkRows.length === 0) {
    throw new Error('Approval not found');
  }

  if (checkRows[0].is_required) {
    throw new Error('Cannot skip required approval');
  }

  const sql = `
    UPDATE approvals
    SET
      status = 'skipped',
      approved_by = $1,
      comments = $2,
      decided_at = NOW()
    WHERE id = $3 AND status = 'pending'
    RETURNING id, gate_id, entity_id, entity_type, status,
              approved_by, comments, requested_at, decided_at
  `;

  const rows = await query<DBApproval>(sql, [
    userId,
    reason || null,
    id,
  ]);

  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get approval status for a specific entity and gate
 */
export async function getApprovalStatus(
  entityId: string,
  entityType: ApprovalEntityType,
  gateId: string
): Promise<{ exists: boolean; status: ApprovalStatus | null; approval: DBApproval | null }> {
  const sql = `
    SELECT
      a.id, a.gate_id, a.entity_id, a.entity_type,
      a.status, a.approved_by, a.comments,
      a.requested_at, a.decided_at
    FROM approvals a
    WHERE a.entity_id = $1 AND a.entity_type = $2 AND a.gate_id = $3
  `;

  const rows = await query<DBApproval>(sql, [entityId, entityType, gateId]);

  if (rows.length === 0) {
    return { exists: false, status: null, approval: null };
  }

  return {
    exists: true,
    status: rows[0].status,
    approval: rows[0],
  };
}

/**
 * Check if a user can approve a specific gate
 * Returns true if the user has the required role for the gate on the related entity
 */
export async function canUserApprove(
  userId: string,
  gateId: string
): Promise<boolean> {
  const sql = `
    SELECT ag.required_role_id
    FROM approval_gates ag
    WHERE ag.id = $1
  `;

  const rows = await query<{ required_role_id: string | null }>(sql, [gateId]);

  if (rows.length === 0) {
    return false;
  }

  const requiredRoleId = rows[0].required_role_id;

  // If no role is required, anyone can approve
  if (!requiredRoleId) {
    return true;
  }

  // Check if user has any task assignment with the required role
  const assignmentSql = `
    SELECT EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.user_id = $1 AND ta.role_id = $2
    ) as has_role
  `;

  const assignmentRows = await query<{ has_role: boolean }>(assignmentSql, [
    userId,
    requiredRoleId,
  ]);

  return assignmentRows.length > 0 && assignmentRows[0].has_role;
}

/**
 * Check if a user can approve a specific approval
 * More specific than canUserApprove - checks the actual entity context
 */
export async function canUserApproveSpecific(
  userId: string,
  approvalId: string
): Promise<boolean> {
  const sql = `
    SELECT
      a.entity_id,
      a.entity_type,
      ag.required_role_id
    FROM approvals a
    JOIN approval_gates ag ON ag.id = a.gate_id
    WHERE a.id = $1
  `;

  const rows = await query<{
    entity_id: string;
    entity_type: ApprovalEntityType;
    required_role_id: string | null;
  }>(sql, [approvalId]);

  if (rows.length === 0) {
    return false;
  }

  const { entity_id, entity_type, required_role_id } = rows[0];

  // If no role is required, anyone can approve
  if (!required_role_id) {
    return true;
  }

  // Check if user has the required role on the specific entity
  let entityCheckSql = '';

  if (entity_type === 'task') {
    entityCheckSql = `
      SELECT EXISTS (
        SELECT 1 FROM task_assignments ta
        WHERE ta.user_id = $1
        AND ta.role_id = $2
        AND ta.task_id = $3
      ) as has_permission
    `;
  } else if (entity_type === 'content_item') {
    entityCheckSql = `
      SELECT EXISTS (
        SELECT 1 FROM task_assignments ta
        JOIN content_items ci ON ci.task_id = ta.task_id
        WHERE ta.user_id = $1
        AND ta.role_id = $2
        AND ci.id = $3
      ) as has_permission
    `;
  } else {
    return false;
  }

  const checkRows = await query<{ has_permission: boolean }>(entityCheckSql, [
    userId,
    required_role_id,
    entity_id,
  ]);

  return checkRows.length > 0 && checkRows[0].has_permission;
}
