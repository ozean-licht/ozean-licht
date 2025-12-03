/**
 * Notifications Database Module
 *
 * CRUD operations for notifications and notification preferences.
 * Part of Phase 12: Collaboration features.
 */

import { query, execute } from './index';

// Types
export type NotificationType =
  | 'mention'
  | 'assignment'
  | 'comment'
  | 'task_update'
  | 'project_update'
  | 'due_date'
  | 'system';

export type EmailDigestFrequency = 'none' | 'instant' | 'daily' | 'weekly';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  isRead: boolean;
  entityType?: 'task' | 'project' | 'comment';
  entityId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  // Joined fields
  actor?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface NotificationPreferences {
  userId: string;
  inApp: boolean;
  emailDigest: EmailDigestFrequency;
  mentionNotify: boolean;
  assignmentNotify: boolean;
  commentNotify: boolean;
  taskUpdateNotify: boolean;
  projectUpdateNotify: boolean;
  dueDateNotify: boolean;
  systemNotify: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  entityType?: 'task' | 'project' | 'comment';
  entityId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationListOptions {
  userId: string;
  unreadOnly?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

// DB row types (snake_case from PostgreSQL)
interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  actor_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor_name?: string;
  actor_email?: string;
}

interface PreferencesRow {
  user_id: string;
  in_app: boolean;
  email_digest: EmailDigestFrequency;
  mention_notify: boolean;
  assignment_notify: boolean;
  comment_notify: boolean;
  task_update_notify: boolean;
  project_update_notify: boolean;
  due_date_notify: boolean;
  system_notify: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Transform DB row to Notification type
 */
function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message || undefined,
    link: row.link || undefined,
    isRead: row.is_read,
    entityType: row.entity_type as 'task' | 'project' | 'comment' | undefined,
    entityId: row.entity_id || undefined,
    actorId: row.actor_id || undefined,
    metadata: row.metadata || undefined,
    createdAt: row.created_at,
    actor: row.actor_name ? {
      id: row.actor_id!,
      name: row.actor_name,
      email: row.actor_email!,
    } : undefined,
  };
}

/**
 * Transform DB row to NotificationPreferences type
 */
function toPreferences(row: PreferencesRow): NotificationPreferences {
  return {
    userId: row.user_id,
    inApp: row.in_app,
    emailDigest: row.email_digest,
    mentionNotify: row.mention_notify,
    assignmentNotify: row.assignment_notify,
    commentNotify: row.comment_notify,
    taskUpdateNotify: row.task_update_notify,
    projectUpdateNotify: row.project_update_notify,
    dueDateNotify: row.due_date_notify,
    systemNotify: row.system_notify,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// Notification CRUD
// =============================================================================

/**
 * Get notifications for a user
 */
export async function getNotifications(
  options: NotificationListOptions
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
  const { userId, unreadOnly, type, limit = 50, offset = 0 } = options;

  const conditions = ['n.user_id = $1'];
  const params: unknown[] = [userId];
  let paramIndex = 2;

  if (unreadOnly) {
    conditions.push('n.is_read = false');
  }

  if (type) {
    conditions.push(`n.type = $${paramIndex}`);
    params.push(type);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  // Get notifications with actor info
  const rows = await query<NotificationRow>(
    `SELECT
      n.*,
      au.name as actor_name,
      au.email as actor_email
    FROM notifications n
    LEFT JOIN admin_users au ON n.actor_id = au.id
    WHERE ${whereClause}
    ORDER BY n.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  // Get total count
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM notifications n WHERE ${whereClause}`,
    params
  );
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Get unread count
  const unreadResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  const unreadCount = parseInt(unreadResult[0]?.count || '0', 10);

  return {
    notifications: rows.map(toNotification),
    total,
    unreadCount,
  };
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result[0]?.count || '0', 10);
}

/**
 * Create a notification
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  const {
    userId,
    type,
    title,
    message,
    link,
    entityType,
    entityId,
    actorId,
    metadata,
  } = input;

  const rows = await query<NotificationRow>(
    `INSERT INTO notifications (
      user_id, type, title, message, link,
      entity_type, entity_id, actor_id, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      userId,
      type,
      title,
      message || null,
      link || null,
      entityType || null,
      entityId || null,
      actorId || null,
      metadata ? JSON.stringify(metadata) : '{}',
    ]
  );

  return toNotification(rows[0]);
}

/**
 * Create multiple notifications (for @mentions)
 * Uses bulk insert to avoid N+1 query problem
 */
export async function createNotifications(
  inputs: CreateNotificationInput[]
): Promise<Notification[]> {
  if (inputs.length === 0) return [];

  // Build VALUES clause for bulk insert
  const values: unknown[] = [];
  const valueClauses: string[] = [];
  let paramIndex = 1;

  for (const input of inputs) {
    const {
      userId,
      type,
      title,
      message,
      link,
      entityType,
      entityId,
      actorId,
      metadata,
    } = input;

    valueClauses.push(
      `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6}, $${paramIndex + 7}, $${paramIndex + 8})`
    );

    values.push(
      userId,
      type,
      title,
      message || null,
      link || null,
      entityType || null,
      entityId || null,
      actorId || null,
      metadata ? JSON.stringify(metadata) : '{}'
    );

    paramIndex += 9;
  }

  // Single bulk insert query
  const rows = await query<NotificationRow>(
    `INSERT INTO notifications (
      user_id, type, title, message, link,
      entity_type, entity_id, actor_id, metadata
    ) VALUES ${valueClauses.join(', ')}
    RETURNING *`,
    values
  );

  return rows.map(toNotification);
}

/**
 * Mark notification as read
 * Returns true if notification was found and updated, false otherwise
 */
export async function markAsRead(notificationId: string, userId: string): Promise<boolean> {
  const result = await execute(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<number> {
  const result = await execute(
    `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return result.rowCount || 0;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string): Promise<void> {
  await execute(
    `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
}

/**
 * Delete old read notifications (cleanup job)
 */
export async function deleteOldNotifications(daysOld: number = 30): Promise<number> {
  // Validate and sanitize input to prevent SQL injection
  const safeDays = Math.max(1, Math.floor(Math.abs(daysOld)));

  const result = await execute(
    `DELETE FROM notifications
     WHERE is_read = true
     AND created_at < NOW() - ($1 || ' days')::INTERVAL`,
    [safeDays]
  );
  return result.rowCount || 0;
}

// =============================================================================
// Notification Preferences
// =============================================================================

/**
 * Get user's notification preferences
 */
export async function getPreferences(userId: string): Promise<NotificationPreferences | null> {
  const rows = await query<PreferencesRow>(
    `SELECT * FROM notification_preferences WHERE user_id = $1`,
    [userId]
  );

  if (rows.length === 0) return null;
  return toPreferences(rows[0]);
}

/**
 * Get or create default preferences
 */
export async function getOrCreatePreferences(userId: string): Promise<NotificationPreferences> {
  const existing = await getPreferences(userId);
  if (existing) return existing;

  // Create default preferences
  const rows = await query<PreferencesRow>(
    `INSERT INTO notification_preferences (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
     RETURNING *`,
    [userId]
  );

  return toPreferences(rows[0]);
}

/**
 * Update notification preferences
 */
export async function updatePreferences(
  userId: string,
  updates: Partial<Omit<NotificationPreferences, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<NotificationPreferences> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMap: Record<string, string> = {
    inApp: 'in_app',
    emailDigest: 'email_digest',
    mentionNotify: 'mention_notify',
    assignmentNotify: 'assignment_notify',
    commentNotify: 'comment_notify',
    taskUpdateNotify: 'task_update_notify',
    projectUpdateNotify: 'project_update_notify',
    dueDateNotify: 'due_date_notify',
    systemNotify: 'system_notify',
  };

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && fieldMap[key]) {
      setClauses.push(`${fieldMap[key]} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    const existing = await getOrCreatePreferences(userId);
    return existing;
  }

  setClauses.push('updated_at = NOW()');
  params.push(userId);

  const rows = await query<PreferencesRow>(
    `INSERT INTO notification_preferences (user_id)
     VALUES ($${paramIndex})
     ON CONFLICT (user_id) DO UPDATE SET ${setClauses.join(', ')}
     RETURNING *`,
    params
  );

  return toPreferences(rows[0]);
}

// =============================================================================
// Helper Functions for Creating Notifications
// =============================================================================

/**
 * Create mention notifications
 * Uses bulk insert for better performance
 */
export async function createMentionNotifications(
  mentionedUserIds: string[],
  actorId: string,
  entityType: 'task' | 'project' | 'comment',
  entityId: string,
  entityTitle: string,
  link: string
): Promise<void> {
  // Filter out actor (don't notify themselves) and build inputs array
  const inputs: CreateNotificationInput[] = mentionedUserIds
    .filter((userId) => userId !== actorId)
    .map((userId) => ({
      userId,
      type: 'mention' as NotificationType,
      title: 'You were mentioned',
      message: `You were mentioned in "${entityTitle}"`,
      link,
      entityType,
      entityId,
      actorId,
    }));

  // Use bulk insert (single query instead of N queries)
  if (inputs.length > 0) {
    await createNotifications(inputs);
  }
}

/**
 * Create assignment notification
 */
export async function createAssignmentNotification(
  assigneeId: string,
  actorId: string,
  taskId: string,
  taskTitle: string,
  projectName?: string
): Promise<void> {
  // Don't notify self-assignment
  if (assigneeId === actorId) return;

  await createNotification({
    userId: assigneeId,
    type: 'assignment',
    title: 'Task assigned to you',
    message: projectName
      ? `"${taskTitle}" in ${projectName}`
      : `"${taskTitle}"`,
    link: `/dashboard/tools/tasks/${taskId}`,
    entityType: 'task',
    entityId: taskId,
    actorId,
  });
}

/**
 * Create comment notification
 */
export async function createCommentNotification(
  recipientId: string,
  actorId: string,
  entityType: 'task' | 'project',
  entityId: string,
  entityTitle: string,
  isReply: boolean = false
): Promise<void> {
  // Don't notify the commenter themselves
  if (recipientId === actorId) return;

  await createNotification({
    userId: recipientId,
    type: 'comment',
    title: isReply ? 'New reply to your comment' : 'New comment',
    message: `On "${entityTitle}"`,
    link: `/dashboard/tools/${entityType}s/${entityId}`,
    entityType,
    entityId,
    actorId,
  });
}

/**
 * Create due date reminder notification
 */
export async function createDueDateNotification(
  userId: string,
  taskId: string,
  taskTitle: string,
  daysUntilDue: number
): Promise<void> {
  let title: string;
  if (daysUntilDue === 0) {
    title = 'Task due today';
  } else if (daysUntilDue === 1) {
    title = 'Task due tomorrow';
  } else if (daysUntilDue < 0) {
    title = 'Task overdue';
  } else {
    title = `Task due in ${daysUntilDue} days`;
  }

  await createNotification({
    userId,
    type: 'due_date',
    title,
    message: taskTitle,
    link: `/dashboard/tools/tasks/${taskId}`,
    entityType: 'task',
    entityId: taskId,
  });
}
