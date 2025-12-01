/**
 * Comments Database Queries
 *
 * Database queries for comment management on projects and tasks.
 * Supports threaded discussions with parent-child relationships.
 * Uses the query/execute functions from index.ts for direct PostgreSQL access.
 */

import { query, execute } from './index';

/**
 * Database row type (snake_case)
 */
export interface DBComment {
  id: string;
  entity_type: 'project' | 'task';
  entity_id: string;
  parent_comment_id: string | null;
  content: string;
  author_name: string | null;
  author_email: string | null;
  is_edited: boolean;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
  // For threaded display (populated in code)
  replies?: DBComment[];
}

/**
 * Get all comments for a project or task
 * Returns comments ordered by created_at, with replies nested under parents
 *
 * @param entityType - 'project' or 'task'
 * @param entityId - UUID of the entity
 * @returns Array of top-level comments with nested replies
 */
export async function getCommentsByEntity(
  entityType: 'project' | 'task',
  entityId: string
): Promise<DBComment[]> {
  const sql = `
    SELECT
      id, entity_type, entity_id, parent_comment_id, content,
      author_name, author_email, is_edited, edited_at,
      created_at, updated_at
    FROM comments
    WHERE entity_type = $1 AND entity_id = $2
    ORDER BY created_at ASC
  `;

  const rows = await query<DBComment>(sql, [entityType, entityId]);

  // Build threaded structure
  const commentMap = new Map<string, DBComment>();
  const topLevelComments: DBComment[] = [];

  // First pass: create map of all comments
  for (const row of rows) {
    commentMap.set(row.id, { ...row, replies: [] });
  }

  // Second pass: build tree structure
  Array.from(commentMap.values()).forEach(comment => {
    if (comment.parent_comment_id === null) {
      // Top-level comment
      topLevelComments.push(comment);
    } else {
      // Reply to another comment
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies!.push(comment);
      } else {
        // Orphaned reply (parent deleted) - treat as top-level
        topLevelComments.push(comment);
      }
    }
  });

  return topLevelComments;
}

/**
 * Create a new comment
 *
 * @param data - Comment data
 * @returns The created comment
 */
export async function createComment(data: {
  entity_type: 'project' | 'task';
  entity_id: string;
  content: string;
  author_name?: string;
  author_email?: string;
  parent_comment_id?: string;
}): Promise<DBComment> {
  const sql = `
    INSERT INTO comments (
      entity_type, entity_id, content, author_name, author_email, parent_comment_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING
      id, entity_type, entity_id, parent_comment_id, content,
      author_name, author_email, is_edited, edited_at,
      created_at, updated_at
  `;

  const params = [
    data.entity_type,
    data.entity_id,
    data.content,
    data.author_name || null,
    data.author_email || null,
    data.parent_comment_id || null,
  ];

  const rows = await query<DBComment>(sql, params);
  return rows[0];
}

/**
 * Update comment content (only by author)
 * Sets is_edited = true and edited_at = NOW()
 *
 * @param id - Comment ID
 * @param content - New content
 * @param authorEmail - Email of the user attempting the update
 * @returns Updated comment or null if not found or unauthorized
 */
export async function updateComment(
  id: string,
  content: string,
  authorEmail: string
): Promise<DBComment | null> {
  const sql = `
    UPDATE comments
    SET
      content = $1,
      is_edited = TRUE,
      edited_at = NOW()
    WHERE id = $2 AND author_email = $3
    RETURNING
      id, entity_type, entity_id, parent_comment_id, content,
      author_name, author_email, is_edited, edited_at,
      created_at, updated_at
  `;

  const rows = await query<DBComment>(sql, [content, id, authorEmail]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a comment (by author or admin)
 * Cascade deletes replies due to FK constraint
 *
 * @param id - Comment ID
 * @param authorEmail - Email of the user attempting the delete
 * @param isAdmin - Whether the user is an admin
 * @returns True if deleted, false if not found or unauthorized
 */
export async function deleteComment(
  id: string,
  authorEmail: string,
  isAdmin: boolean = false
): Promise<boolean> {
  let sql: string;
  let params: unknown[];

  if (isAdmin) {
    // Admin can delete any comment
    sql = 'DELETE FROM comments WHERE id = $1';
    params = [id];
  } else {
    // Non-admin can only delete their own comments
    sql = 'DELETE FROM comments WHERE id = $1 AND author_email = $2';
    params = [id, authorEmail];
  }

  const result = await execute(sql, params);
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Get count of comments for an entity
 *
 * @param entityType - 'project' or 'task'
 * @param entityId - UUID of the entity
 * @returns Number of comments (including replies)
 */
export async function getCommentCount(
  entityType: 'project' | 'task',
  entityId: string
): Promise<number> {
  const sql = `
    SELECT COUNT(*) as count
    FROM comments
    WHERE entity_type = $1 AND entity_id = $2
  `;

  const rows = await query<{ count: string }>(sql, [entityType, entityId]);
  return parseInt(rows[0]?.count || '0', 10);
}
