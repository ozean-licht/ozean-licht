/**
 * Support Analytics Database Queries
 *
 * Database queries for support analytics via direct PostgreSQL connection.
 * Provides metrics, trends, and performance data for the support dashboard.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query } from './index';
import type {
  SupportStats,
  SupportAnalyticsSnapshot,
  Channel,
  Team,
} from '../../types/support';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

/**
 * Database row type for support_analytics table
 */
interface DBAnalyticsSnapshot {
  id: string;
  date: string;
  total_conversations: number;
  new_conversations: number;
  resolved_conversations: number;
  avg_first_response_minutes: string | null;
  avg_resolution_minutes: string | null;
  csat_average: string | null;
  conversations_by_channel: Record<string, number>;
  conversations_by_team: Record<string, number>;
  created_at: string;
}

/**
 * Database row type for conversation stats
 */
interface DBConversationStats {
  open_conversations: string;
  pending_conversations: string;
  avg_response_time_minutes: string | null;
  avg_resolution_time_minutes: string | null;
  csat_score: string | null;
  conversations_today: string;
  resolved_today: string;
}

/**
 * Database row type for agent performance
 */
interface DBAgentPerformance {
  total_conversations: string;
  resolved_conversations: string;
  avg_response_time_minutes: string | null;
  avg_resolution_time_minutes: string | null;
  csat_average: string | null;
}

/**
 * Database row type for trend data
 */
interface DBTrendPoint {
  period: string;
  avg_minutes: string | null;
}

/**
 * Database row type for CSAT trend
 */
interface DBCSATTrendPoint {
  date: string;
  score: string | null;
  count: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert snake_case DB row to camelCase SupportAnalyticsSnapshot
 */
function transformAnalyticsSnapshot(row: DBAnalyticsSnapshot): SupportAnalyticsSnapshot {
  return {
    id: row.id,
    date: row.date,
    totalConversations: row.total_conversations,
    newConversations: row.new_conversations,
    resolvedConversations: row.resolved_conversations,
    avgFirstResponseMinutes: row.avg_first_response_minutes
      ? parseFloat(row.avg_first_response_minutes)
      : undefined,
    avgResolutionMinutes: row.avg_resolution_minutes
      ? parseFloat(row.avg_resolution_minutes)
      : undefined,
    csatAverage: row.csat_average ? parseFloat(row.csat_average) : undefined,
    conversationsByChannel: row.conversations_by_channel as Record<Channel, number>,
    conversationsByTeam: row.conversations_by_team as Record<Team, number>,
    createdAt: row.created_at,
  };
}

/**
 * Parse a numeric string to number with fallback
 */
function parseNumeric(value: string | null, fallback: number = 0): number {
  if (value === null) return fallback;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parse integer string with fallback
 */
function parseInteger(value: string | null, fallback: number = 0): number {
  if (value === null) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// ============================================================================
// Support Stats (Live Calculation)
// ============================================================================

/**
 * Get support stats for dashboard
 * Calculates live stats from support_conversations table
 *
 * @returns Current support statistics
 *
 * @example
 * const stats = await getSupportStats();
 * console.log(`Open conversations: ${stats.openConversations}`);
 */
export async function getSupportStats(): Promise<SupportStats> {
  const sql = `
    SELECT
      -- Current status counts
      COUNT(*) FILTER (WHERE status = 'open') as open_conversations,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_conversations,

      -- Average response time (in minutes)
      AVG(
        EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60
      ) FILTER (WHERE first_response_at IS NOT NULL) as avg_response_time_minutes,

      -- Average resolution time (in minutes)
      AVG(
        EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60
      ) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_time_minutes,

      -- CSAT score
      AVG(csat_rating) FILTER (WHERE csat_rating IS NOT NULL) as csat_score,

      -- Today's metrics
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as conversations_today,
      COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at >= CURRENT_DATE) as resolved_today

    FROM support_conversations
  `;

  const rows = await query<DBConversationStats>(sql);
  const row = rows[0];

  return {
    openConversations: parseInteger(row?.open_conversations),
    pendingConversations: parseInteger(row?.pending_conversations),
    avgResponseTimeMinutes: parseNumeric(row?.avg_response_time_minutes),
    avgResolutionTimeMinutes: parseNumeric(row?.avg_resolution_time_minutes),
    csatScore: parseNumeric(row?.csat_score),
    conversationsToday: parseInteger(row?.conversations_today),
    resolvedToday: parseInteger(row?.resolved_today),
  };
}

// ============================================================================
// Analytics Snapshots
// ============================================================================

/**
 * Get analytics snapshots for a date range
 *
 * @param startDate - Start date (ISO 8601 format: YYYY-MM-DD)
 * @param endDate - End date (ISO 8601 format: YYYY-MM-DD)
 * @returns Array of analytics snapshots, ordered by date
 *
 * @example
 * const snapshots = await getAnalyticsSnapshots('2024-01-01', '2024-01-31');
 */
export async function getAnalyticsSnapshots(
  startDate: string,
  endDate: string
): Promise<SupportAnalyticsSnapshot[]> {
  const sql = `
    SELECT
      id,
      date::TEXT,
      total_conversations,
      new_conversations,
      resolved_conversations,
      avg_first_response_minutes,
      avg_resolution_minutes,
      csat_average,
      conversations_by_channel,
      conversations_by_team,
      created_at
    FROM support_analytics
    WHERE date >= $1::DATE AND date <= $2::DATE
    ORDER BY date ASC
  `;

  const rows = await query<DBAnalyticsSnapshot>(sql, [startDate, endDate]);
  return rows.map(transformAnalyticsSnapshot);
}

/**
 * Record daily analytics snapshot
 * Calculates and stores metrics for a specific date
 * Called by cron job or webhook to create historical records
 *
 * @param date - Date to record (defaults to yesterday)
 * @returns The created analytics snapshot
 *
 * @example
 * // Record yesterday's analytics
 * const snapshot = await recordDailySnapshot();
 *
 * // Record specific date
 * const snapshot = await recordDailySnapshot('2024-01-15');
 */
export async function recordDailySnapshot(
  date?: string
): Promise<SupportAnalyticsSnapshot> {
  // Default to yesterday if no date provided
  const targetDate = date || new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const sql = `
    WITH date_range AS (
      SELECT
        $1::DATE as target_date,
        $1::DATE as start_date,
        ($1::DATE + INTERVAL '1 day') as end_date
    ),
    conversation_stats AS (
      SELECT
        COUNT(*) as total_conversations,
        COUNT(*) FILTER (WHERE created_at >= dr.start_date AND created_at < dr.end_date) as new_conversations,
        COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at >= dr.start_date AND resolved_at < dr.end_date) as resolved_conversations,
        AVG(
          EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60
        ) FILTER (
          WHERE first_response_at IS NOT NULL
          AND created_at >= dr.start_date
          AND created_at < dr.end_date
        ) as avg_first_response_minutes,
        AVG(
          EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60
        ) FILTER (
          WHERE resolved_at IS NOT NULL
          AND created_at >= dr.start_date
          AND created_at < dr.end_date
        ) as avg_resolution_minutes,
        AVG(csat_rating) FILTER (
          WHERE csat_rating IS NOT NULL
          AND created_at >= dr.start_date
          AND created_at < dr.end_date
        ) as csat_average
      FROM support_conversations, date_range dr
      WHERE created_at < dr.end_date
    ),
    channel_stats AS (
      SELECT
        jsonb_object_agg(channel, count) as conversations_by_channel
      FROM (
        SELECT
          channel,
          COUNT(*)::INTEGER as count
        FROM support_conversations, date_range dr
        WHERE created_at >= dr.start_date AND created_at < dr.end_date
        GROUP BY channel
      ) channel_counts
    ),
    team_stats AS (
      SELECT
        jsonb_object_agg(team, count) as conversations_by_team
      FROM (
        SELECT
          COALESCE(team, 'general') as team,
          COUNT(*)::INTEGER as count
        FROM support_conversations, date_range dr
        WHERE created_at >= dr.start_date AND created_at < dr.end_date
        GROUP BY team
      ) team_counts
    )
    INSERT INTO support_analytics (
      date,
      total_conversations,
      new_conversations,
      resolved_conversations,
      avg_first_response_minutes,
      avg_resolution_minutes,
      csat_average,
      conversations_by_channel,
      conversations_by_team
    )
    SELECT
      dr.target_date,
      COALESCE(cs.total_conversations, 0),
      COALESCE(cs.new_conversations, 0),
      COALESCE(cs.resolved_conversations, 0),
      cs.avg_first_response_minutes,
      cs.avg_resolution_minutes,
      cs.csat_average,
      COALESCE(ch.conversations_by_channel, '{}'::jsonb),
      COALESCE(ts.conversations_by_team, '{}'::jsonb)
    FROM date_range dr
    CROSS JOIN conversation_stats cs
    LEFT JOIN channel_stats ch ON true
    LEFT JOIN team_stats ts ON true
    ON CONFLICT (date)
    DO UPDATE SET
      total_conversations = EXCLUDED.total_conversations,
      new_conversations = EXCLUDED.new_conversations,
      resolved_conversations = EXCLUDED.resolved_conversations,
      avg_first_response_minutes = EXCLUDED.avg_first_response_minutes,
      avg_resolution_minutes = EXCLUDED.avg_resolution_minutes,
      csat_average = EXCLUDED.csat_average,
      conversations_by_channel = EXCLUDED.conversations_by_channel,
      conversations_by_team = EXCLUDED.conversations_by_team
    RETURNING
      id,
      date::TEXT,
      total_conversations,
      new_conversations,
      resolved_conversations,
      avg_first_response_minutes,
      avg_resolution_minutes,
      csat_average,
      conversations_by_channel,
      conversations_by_team,
      created_at
  `;

  const rows = await query<DBAnalyticsSnapshot>(sql, [targetDate]);
  return transformAnalyticsSnapshot(rows[0]);
}

// ============================================================================
// Conversation Breakdowns
// ============================================================================

/**
 * Get conversations breakdown by channel
 *
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Record mapping channel to conversation count
 *
 * @example
 * const byChannel = await getConversationsByChannel('2024-01-01', '2024-01-31');
 * console.log(`WhatsApp: ${byChannel.whatsapp}`);
 */
export async function getConversationsByChannel(
  startDate?: string,
  endDate?: string
): Promise<Record<string, number>> {
  const conditions: string[] = [];
  const params: string[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex}::DATE`);
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`created_at <= $${paramIndex}::DATE + INTERVAL '1 day'`);
    params.push(endDate);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      channel,
      COUNT(*)::INTEGER as count
    FROM support_conversations
    ${whereClause}
    GROUP BY channel
    ORDER BY count DESC
  `;

  const rows = await query<{ channel: string; count: number }>(sql, params);

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.channel] = row.count;
  }

  return result;
}

/**
 * Get conversations breakdown by team
 *
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Record mapping team to conversation count
 *
 * @example
 * const byTeam = await getConversationsByTeam('2024-01-01', '2024-01-31');
 * console.log(`Tech team: ${byTeam.tech}`);
 */
export async function getConversationsByTeam(
  startDate?: string,
  endDate?: string
): Promise<Record<string, number>> {
  const conditions: string[] = [];
  const params: string[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex}::DATE`);
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`created_at <= $${paramIndex}::DATE + INTERVAL '1 day'`);
    params.push(endDate);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      COALESCE(team, 'general') as team,
      COUNT(*)::INTEGER as count
    FROM support_conversations
    ${whereClause}
    GROUP BY team
    ORDER BY count DESC
  `;

  const rows = await query<{ team: string; count: number }>(sql, params);

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.team] = row.count;
  }

  return result;
}

// ============================================================================
// Agent Performance
// ============================================================================

/**
 * Get agent performance metrics
 *
 * @param agentId - Agent UUID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Agent performance metrics
 *
 * @example
 * const performance = await getAgentPerformance('agent-uuid', '2024-01-01', '2024-01-31');
 * console.log(`Agent handled ${performance.totalConversations} conversations`);
 */
export async function getAgentPerformance(
  agentId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  totalConversations: number;
  resolvedConversations: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
  csatAverage: number;
}> {
  const conditions: string[] = ['assigned_agent_id = $1'];
  const params: (string | undefined)[] = [agentId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex}::DATE`);
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`created_at <= $${paramIndex}::DATE + INTERVAL '1 day'`);
    params.push(endDate);
    paramIndex++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const sql = `
    SELECT
      COUNT(*) as total_conversations,
      COUNT(*) FILTER (WHERE status = 'resolved') as resolved_conversations,
      AVG(
        EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60
      ) FILTER (WHERE first_response_at IS NOT NULL) as avg_response_time_minutes,
      AVG(
        EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60
      ) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_time_minutes,
      AVG(csat_rating) FILTER (WHERE csat_rating IS NOT NULL) as csat_average
    FROM support_conversations
    ${whereClause}
  `;

  const rows = await query<DBAgentPerformance>(sql, params);
  const row = rows[0];

  return {
    totalConversations: parseInteger(row?.total_conversations),
    resolvedConversations: parseInteger(row?.resolved_conversations),
    avgResponseTimeMinutes: parseNumeric(row?.avg_response_time_minutes),
    avgResolutionTimeMinutes: parseNumeric(row?.avg_resolution_time_minutes),
    csatAverage: parseNumeric(row?.csat_average),
  };
}

// ============================================================================
// Trend Analysis
// ============================================================================

/**
 * Get response time trends over a date range
 * Groups data by day or hour to show trends
 *
 * @param startDate - Start date (ISO 8601 format)
 * @param endDate - End date (ISO 8601 format)
 * @param groupBy - Group by 'day' or 'hour'
 * @returns Array of trend points with period and average minutes
 *
 * @example
 * const trend = await getResponseTimeTrend('2024-01-01', '2024-01-31', 'day');
 * trend.forEach(point => console.log(`${point.period}: ${point.avgMinutes}m`));
 */
export async function getResponseTimeTrend(
  startDate: string,
  endDate: string,
  groupBy: 'day' | 'hour' = 'day'
): Promise<Array<{ period: string; avgMinutes: number }>> {
  // Validate groupBy parameter to prevent SQL injection
  const truncPeriod = groupBy === 'hour' ? 'hour' : 'day';

  const sql = `
    SELECT
      date_trunc($3, created_at)::TEXT as period,
      AVG(
        EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60
      ) as avg_minutes
    FROM support_conversations
    WHERE created_at >= $1::DATE
      AND created_at <= $2::DATE + INTERVAL '1 day'
      AND first_response_at IS NOT NULL
    GROUP BY date_trunc($3, created_at)
    ORDER BY period ASC
  `;

  const rows = await query<DBTrendPoint>(sql, [startDate, endDate, truncPeriod]);

  return rows.map(row => ({
    period: row.period,
    avgMinutes: parseNumeric(row.avg_minutes),
  }));
}

/**
 * Get CSAT trend over time
 * Shows average CSAT score and rating count per day
 *
 * @param startDate - Start date (ISO 8601 format)
 * @param endDate - End date (ISO 8601 format)
 * @returns Array of CSAT trend points with date, score, and count
 *
 * @example
 * const trend = await getCSATTrend('2024-01-01', '2024-01-31');
 * trend.forEach(point => console.log(`${point.date}: ${point.score} (${point.count} ratings)`));
 */
export async function getCSATTrend(
  startDate: string,
  endDate: string
): Promise<Array<{ date: string; score: number; count: number }>> {
  const sql = `
    SELECT
      date_trunc('day', created_at)::DATE::TEXT as date,
      AVG(csat_rating) as score,
      COUNT(*)::INTEGER as count
    FROM support_conversations
    WHERE created_at >= $1::DATE
      AND created_at <= $2::DATE + INTERVAL '1 day'
      AND csat_rating IS NOT NULL
    GROUP BY date_trunc('day', created_at)
    ORDER BY date ASC
  `;

  const rows = await query<DBCSATTrendPoint>(sql, [startDate, endDate]);

  return rows.map(row => ({
    date: row.date,
    score: parseNumeric(row.score),
    count: parseInteger(row.count),
  }));
}
