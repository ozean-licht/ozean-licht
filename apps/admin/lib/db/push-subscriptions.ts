/**
 * Push Subscription Database Module
 *
 * Manages Web Push API subscriptions for browser notifications.
 * Part of Phase 12: Support Management System - Notification System.
 */

import { query, execute } from './index';

// Types
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  deviceName?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreatePushSubscriptionInput {
  userId: string;
  endpoint: string;
  p256dh: string;    // Browser's public key
  auth: string;       // Auth secret
  userAgent?: string;
  deviceName?: string;
}

// DB row interface (snake_case from PostgreSQL)
interface PushSubscriptionRow {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  device_name: string | null;
  created_at: string;
  last_used_at: string | null;
}

/**
 * Transform DB row to PushSubscription type
 */
function toPushSubscription(row: PushSubscriptionRow): PushSubscription {
  return {
    id: row.id,
    userId: row.user_id,
    endpoint: row.endpoint,
    p256dh: row.p256dh,
    auth: row.auth,
    userAgent: row.user_agent || undefined,
    deviceName: row.device_name || undefined,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at || undefined,
  };
}

// =============================================================================
// Push Subscription CRUD
// =============================================================================

/**
 * Get all push subscriptions for a user
 */
export async function getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
  const rows = await query<PushSubscriptionRow>(
    `SELECT * FROM push_subscriptions WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map(toPushSubscription);
}

/**
 * Get a specific push subscription by ID
 */
export async function getPushSubscription(subscriptionId: string): Promise<PushSubscription | null> {
  const rows = await query<PushSubscriptionRow>(
    `SELECT * FROM push_subscriptions WHERE id = $1`,
    [subscriptionId]
  );

  if (rows.length === 0) return null;
  return toPushSubscription(rows[0]);
}

/**
 * Create or update a push subscription
 * Uses UPSERT to handle re-registration of the same endpoint
 */
export async function upsertPushSubscription(input: CreatePushSubscriptionInput): Promise<PushSubscription> {
  const { userId, endpoint, p256dh, auth, userAgent, deviceName } = input;

  const rows = await query<PushSubscriptionRow>(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, device_name)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, endpoint) DO UPDATE SET
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       user_agent = EXCLUDED.user_agent,
       device_name = EXCLUDED.device_name,
       last_used_at = NOW()
     RETURNING *`,
    [userId, endpoint, p256dh, auth, userAgent || null, deviceName || null]
  );

  return toPushSubscription(rows[0]);
}

/**
 * Delete a push subscription by endpoint
 */
export async function deletePushSubscription(userId: string, endpoint: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2`,
    [userId, endpoint]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Delete a push subscription by ID
 */
export async function deletePushSubscriptionById(subscriptionId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM push_subscriptions WHERE id = $1`,
    [subscriptionId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Update last used timestamp
 */
export async function updatePushSubscriptionLastUsed(subscriptionId: string): Promise<void> {
  await execute(
    `UPDATE push_subscriptions SET last_used_at = NOW() WHERE id = $1`,
    [subscriptionId]
  );
}

/**
 * Delete old/invalid subscriptions by endpoint
 * Useful when a push notification fails (HTTP 410 Gone)
 */
export async function deleteInvalidPushSubscription(endpoint: string): Promise<number> {
  const result = await execute(
    `DELETE FROM push_subscriptions WHERE endpoint = $1`,
    [endpoint]
  );
  return result.rowCount || 0;
}

/**
 * Delete old unused subscriptions (cleanup job)
 * Removes subscriptions that haven't been used in the specified number of days
 */
export async function deleteOldPushSubscriptions(daysOld: number = 90): Promise<number> {
  // Validate and sanitize input to prevent SQL injection
  const safeDays = Math.max(1, Math.floor(Math.abs(daysOld)));

  const result = await execute(
    `DELETE FROM push_subscriptions
     WHERE last_used_at IS NOT NULL
     AND last_used_at < NOW() - INTERVAL '1 day' * $1`,
    [safeDays]
  );
  return result.rowCount || 0;
}

/**
 * Get count of active subscriptions for a user
 */
export async function getUserPushSubscriptionCount(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM push_subscriptions WHERE user_id = $1`,
    [userId]
  );
  return parseInt(result[0]?.count || '0', 10);
}
