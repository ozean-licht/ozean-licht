/**
 * Task Attachments Database Queries
 *
 * Database queries for task file attachments via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 *
 * Phase 11 of Project Management MVP
 */

import { query, execute } from './index';

// Database row type (snake_case) - matches task_attachments table schema
export interface DBAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_key: string | null;
  bucket: string;
  file_type: string | null;
  file_size_bytes: number | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  uploaded_by_email: string | null;
  created_at: string;
  // Joined fields from task
  task_name?: string;
  task_code?: string;
  project_id?: string;
  project_title?: string;
}

// Filter options for attachment queries
export interface AttachmentFilters {
  taskId?: string;
  uploadedBy?: string;
  projectId?: string;
  fileType?: string;
  limit?: number;
  offset?: number;
}

// Result type for paginated queries
export interface AttachmentListResult {
  attachments: DBAttachment[];
  total: number;
}

/**
 * Get all attachments for a task
 */
export async function getAttachmentsByTaskId(
  taskId: string,
  limit: number = 50
): Promise<DBAttachment[]> {
  const sql = `
    SELECT
      ta.id, ta.task_id, ta.file_name, ta.file_url,
      ta.file_key, ta.bucket, ta.file_type, ta.file_size_bytes,
      ta.uploaded_by, ta.uploaded_by_name, ta.uploaded_by_email,
      ta.created_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_attachments ta
    LEFT JOIN tasks t ON ta.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE ta.task_id = $1
    ORDER BY ta.created_at DESC
    LIMIT $2
  `;

  return query<DBAttachment>(sql, [taskId, limit]);
}

/**
 * Get attachments with filtering
 */
export async function getAttachments(
  filters: AttachmentFilters = {}
): Promise<AttachmentListResult> {
  const {
    taskId,
    uploadedBy,
    projectId,
    fileType,
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
    conditions.push(`ta.task_id = $${paramIndex++}`);
    params.push(taskId);
  }

  if (uploadedBy) {
    conditions.push(`ta.uploaded_by = $${paramIndex++}`);
    params.push(uploadedBy);
  }

  if (projectId) {
    conditions.push(`t.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  if (fileType) {
    conditions.push(`ta.file_type LIKE $${paramIndex++}`);
    params.push(`${fileType}%`);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM task_attachments ta
    LEFT JOIN tasks t ON ta.task_id = t.id
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query - parameterize LIMIT and OFFSET for security
  const limitParamIndex = paramIndex++;
  const offsetParamIndex = paramIndex;
  const dataSql = `
    SELECT
      ta.id, ta.task_id, ta.file_name, ta.file_url,
      ta.file_key, ta.bucket, ta.file_type, ta.file_size_bytes,
      ta.uploaded_by, ta.uploaded_by_name, ta.uploaded_by_email,
      ta.created_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_attachments ta
    LEFT JOIN tasks t ON ta.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    ${whereClause}
    ORDER BY ta.created_at DESC
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const attachments = await query<DBAttachment>(dataSql, [...params, limit, offset]);

  return { attachments, total };
}

/**
 * Get a single attachment by ID
 */
export async function getAttachmentById(id: string): Promise<DBAttachment | null> {
  const sql = `
    SELECT
      ta.id, ta.task_id, ta.file_name, ta.file_url,
      ta.file_key, ta.bucket, ta.file_type, ta.file_size_bytes,
      ta.uploaded_by, ta.uploaded_by_name, ta.uploaded_by_email,
      ta.created_at,
      t.name as task_name, t.task_code,
      t.project_id, p.title as project_title
    FROM task_attachments ta
    LEFT JOIN tasks t ON ta.task_id = t.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE ta.id = $1
  `;

  const rows = await query<DBAttachment>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new attachment record
 */
export async function createAttachment(data: {
  task_id: string;
  file_name: string;
  file_url: string;
  file_key?: string;
  bucket?: string;
  file_type?: string;
  file_size_bytes?: number;
  uploaded_by?: string;
  uploaded_by_name?: string;
  uploaded_by_email?: string;
}): Promise<DBAttachment> {
  const sql = `
    INSERT INTO task_attachments (
      task_id, file_name, file_url, file_key, bucket,
      file_type, file_size_bytes,
      uploaded_by, uploaded_by_name, uploaded_by_email
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING
      id, task_id, file_name, file_url, file_key, bucket,
      file_type, file_size_bytes,
      uploaded_by, uploaded_by_name, uploaded_by_email,
      created_at
  `;

  const params = [
    data.task_id,
    data.file_name,
    data.file_url,
    data.file_key || null,
    data.bucket || 'task-attachments',
    data.file_type || null,
    data.file_size_bytes || null,
    data.uploaded_by || null,
    data.uploaded_by_name || null,
    data.uploaded_by_email || null,
  ];

  const rows = await query<DBAttachment>(sql, params);
  return rows[0];
}

/**
 * Delete an attachment record
 */
export async function deleteAttachment(id: string): Promise<boolean> {
  const sql = `DELETE FROM task_attachments WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get attachment count for a task
 */
export async function getTaskAttachmentCount(taskId: string): Promise<number> {
  const sql = `SELECT COUNT(*) as count FROM task_attachments WHERE task_id = $1`;
  const rows = await query<{ count: string }>(sql, [taskId]);
  return parseInt(rows[0]?.count || '0', 10);
}

/**
 * Get attachment statistics for a project
 */
export async function getProjectAttachmentStats(projectId: string): Promise<{
  totalAttachments: number;
  totalSizeBytes: number;
  taskCount: number;
}> {
  const sql = `
    SELECT
      COUNT(ta.id) as total_attachments,
      COALESCE(SUM(ta.file_size_bytes), 0) as total_size_bytes,
      COUNT(DISTINCT t.id) as task_count
    FROM task_attachments ta
    INNER JOIN tasks t ON ta.task_id = t.id
    WHERE t.project_id = $1
  `;

  const rows = await query<{
    total_attachments: string;
    total_size_bytes: string;
    task_count: string;
  }>(sql, [projectId]);

  return {
    totalAttachments: parseInt(rows[0]?.total_attachments || '0', 10),
    totalSizeBytes: parseInt(rows[0]?.total_size_bytes || '0', 10),
    taskCount: parseInt(rows[0]?.task_count || '0', 10),
  };
}

/**
 * Check if file type is an image
 */
export function isImageType(fileType: string | null): boolean {
  if (!fileType) return false;
  return fileType.startsWith('image/');
}

/**
 * Check if file type is a PDF
 */
export function isPdfType(fileType: string | null): boolean {
  if (!fileType) return false;
  return fileType === 'application/pdf';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
