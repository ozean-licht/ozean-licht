/**
 * Support Analytics API
 * GET /api/support/analytics - Get support metrics and statistics
 *
 * Provides comprehensive dashboard metrics including:
 * - Current conversation counts (open, pending)
 * - Average response and resolution times
 * - CSAT scores
 * - Today's activity
 * - Historical snapshots (optional)
 * - Time series trends for charts
 * - Breakdown by channel, team, status, priority
 * - Agent performance metrics
 *
 * Query Parameters:
 * - type: 'overview' | 'trends' | 'breakdown' | 'agents' (default: 'overview')
 * - startDate: ISO date string (YYYY-MM-DD)
 * - endDate: ISO date string (YYYY-MM-DD)
 * - agentId: For agent-specific metrics (optional)
 * - includeSnapshots: Include historical snapshots for overview (default: false)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requireAnyRole } from '@/lib/rbac/utils';
import {
  getSupportStats,
  getAnalyticsSnapshots,
  getConversationsByChannel,
  getConversationsByTeam,
  getAgentPerformance,
  getResponseTimeTrend,
  getCSATTrend,
} from '@/lib/db/support-analytics';
import { query } from '@/lib/db';

// ============================================================================
// Type Definitions
// ============================================================================

type AnalyticsType = 'overview' | 'trends' | 'breakdown' | 'agents';

interface OverviewResponse {
  stats: Awaited<ReturnType<typeof getSupportStats>>;
  snapshots?: Awaited<ReturnType<typeof getAnalyticsSnapshots>>;
}

interface TrendsResponse {
  responseTimeTrend: Array<{ period: string; avgMinutes: number }>;
  csatTrend: Array<{ date: string; score: number; count: number }>;
  volumeTrend: Array<{ date: string; new: number; resolved: number }>;
}

interface BreakdownResponse {
  byChannel: Record<string, number>;
  byTeam: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

interface AgentMetrics {
  agentId: string;
  agentName: string;
  totalConversations: number;
  resolvedConversations: number;
  avgResponseTimeMinutes: number;
  csatAverage: number;
}

interface AgentsResponse {
  agents: AgentMetrics[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate ISO date format (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

/**
 * Get default date range (last 30 days)
 */
function getDefaultDateRange(): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Get conversations breakdown by status
 */
async function getConversationsByStatus(
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
      status,
      COUNT(*)::INTEGER as count
    FROM support_conversations
    ${whereClause}
    GROUP BY status
    ORDER BY count DESC
  `;

  const rows = await query<{ status: string; count: number }>(sql, params);

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.status] = row.count;
  }

  return result;
}

/**
 * Get conversations breakdown by priority
 */
async function getConversationsByPriority(
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
      priority,
      COUNT(*)::INTEGER as count
    FROM support_conversations
    ${whereClause}
    GROUP BY priority
    ORDER BY count DESC
  `;

  const rows = await query<{ priority: string; count: number }>(sql, params);

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.priority] = row.count;
  }

  return result;
}

/**
 * Get volume trend (new and resolved conversations per day)
 */
async function getVolumeTrend(
  startDate: string,
  endDate: string
): Promise<Array<{ date: string; new: number; resolved: number }>> {
  const sql = `
    SELECT
      date_trunc('day', created_at)::DATE::TEXT as date,
      COUNT(*)::INTEGER as new_count,
      COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at >= created_at::DATE AND resolved_at < created_at::DATE + INTERVAL '1 day')::INTEGER as resolved_count
    FROM support_conversations
    WHERE created_at >= $1::DATE
      AND created_at <= $2::DATE + INTERVAL '1 day'
    GROUP BY date_trunc('day', created_at)
    ORDER BY date ASC
  `;

  const rows = await query<{ date: string; new_count: number; resolved_count: number }>(
    sql,
    [startDate, endDate]
  );

  return rows.map(row => ({
    date: row.date,
    new: row.new_count,
    resolved: row.resolved_count,
  }));
}

/**
 * Get all agents with conversation activity
 */
async function getAllAgentsPerformance(
  startDate?: string,
  endDate?: string
): Promise<AgentMetrics[]> {
  const conditions: string[] = ['assigned_agent_id IS NOT NULL'];
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

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const sql = `
    SELECT
      sc.assigned_agent_id as agent_id,
      au.name as agent_name,
      COUNT(*) as total_conversations,
      COUNT(*) FILTER (WHERE sc.status = 'resolved') as resolved_conversations,
      AVG(
        EXTRACT(EPOCH FROM (sc.first_response_at - sc.created_at)) / 60
      ) FILTER (WHERE sc.first_response_at IS NOT NULL) as avg_response_time_minutes,
      AVG(sc.csat_rating) FILTER (WHERE sc.csat_rating IS NOT NULL) as csat_average
    FROM support_conversations sc
    JOIN admin_users au ON sc.assigned_agent_id = au.id
    ${whereClause}
    GROUP BY sc.assigned_agent_id, au.name
    ORDER BY total_conversations DESC
  `;

  interface DBAgentRow {
    agent_id: string;
    agent_name: string;
    total_conversations: string;
    resolved_conversations: string;
    avg_response_time_minutes: string | null;
    csat_average: string | null;
  }

  const rows = await query<DBAgentRow>(sql, params);

  return rows.map(row => ({
    agentId: row.agent_id,
    agentName: row.agent_name,
    totalConversations: parseInt(row.total_conversations, 10),
    resolvedConversations: parseInt(row.resolved_conversations, 10),
    avgResponseTimeMinutes: row.avg_response_time_minutes
      ? parseFloat(row.avg_response_time_minutes)
      : 0,
    csatAverage: row.csat_average ? parseFloat(row.csat_average) : 0,
  }));
}

// ============================================================================
// Request Handlers by Type
// ============================================================================

/**
 * Handle 'overview' type request
 * Returns current stats and optional historical snapshots
 */
async function handleOverview(
  startDate?: string,
  endDate?: string,
  includeSnapshots?: boolean
): Promise<OverviewResponse> {
  // Fetch current support stats (always included)
  const stats = await getSupportStats();

  // Optionally fetch historical snapshots
  let snapshots = undefined;
  if (includeSnapshots && startDate && endDate) {
    snapshots = await getAnalyticsSnapshots(startDate, endDate);
  }

  return {
    stats,
    snapshots,
  };
}

/**
 * Handle 'trends' type request
 * Returns time series data for charts
 */
async function handleTrends(startDate: string, endDate: string): Promise<TrendsResponse> {
  // Fetch all trend data in parallel
  const [responseTimeTrend, csatTrend, volumeTrend] = await Promise.all([
    getResponseTimeTrend(startDate, endDate, 'day'),
    getCSATTrend(startDate, endDate),
    getVolumeTrend(startDate, endDate),
  ]);

  return {
    responseTimeTrend,
    csatTrend,
    volumeTrend,
  };
}

/**
 * Handle 'breakdown' type request
 * Returns conversation counts by various dimensions
 */
async function handleBreakdown(
  startDate?: string,
  endDate?: string
): Promise<BreakdownResponse> {
  // Fetch all breakdowns in parallel
  const [byChannel, byTeam, byStatus, byPriority] = await Promise.all([
    getConversationsByChannel(startDate, endDate),
    getConversationsByTeam(startDate, endDate),
    getConversationsByStatus(startDate, endDate),
    getConversationsByPriority(startDate, endDate),
  ]);

  return {
    byChannel,
    byTeam,
    byStatus,
    byPriority,
  };
}

/**
 * Handle 'agents' type request
 * Returns agent performance metrics
 */
async function handleAgents(
  agentId?: string,
  startDate?: string,
  endDate?: string
): Promise<AgentsResponse> {
  if (agentId) {
    // Single agent performance
    const performance = await getAgentPerformance(agentId, startDate, endDate);

    // Get agent name from admin_users
    const agentSql = `SELECT name FROM admin_users WHERE id = $1`;
    const agentRows = await query<{ name: string }>(agentSql, [agentId]);
    const agentName = agentRows.length > 0 ? agentRows[0].name : 'Unknown';

    return {
      agents: [
        {
          agentId,
          agentName,
          totalConversations: performance.totalConversations,
          resolvedConversations: performance.resolvedConversations,
          avgResponseTimeMinutes: performance.avgResponseTimeMinutes,
          csatAverage: performance.csatAverage,
        },
      ],
    };
  } else {
    // All agents performance
    const agents = await getAllAgentsPerformance(startDate, endDate);
    return { agents };
  }
}

// ============================================================================
// Main GET Handler
// ============================================================================

/**
 * GET /api/support/analytics
 * Fetch support statistics and metrics
 *
 * Query parameters:
 * - type: 'overview' | 'trends' | 'breakdown' | 'agents' (default: 'overview')
 * - startDate: Optional start date for historical data (ISO 8601: YYYY-MM-DD)
 * - endDate: Optional end date for historical data (ISO 8601: YYYY-MM-DD)
 * - includeSnapshots: Include historical analytics snapshots (default: false, overview only)
 * - agentId: Specific agent ID for agent metrics (optional, agents type only)
 *
 * Returns:
 * - For type=overview: Current stats + optional historical snapshots
 * - For type=trends: Time series data (response time, CSAT, volume)
 * - For type=breakdown: Conversation counts by channel, team, status, priority
 * - For type=agents: Agent performance metrics
 */
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify user has required role
  try {
    await requireAnyRole(['super_admin', 'ol_admin', 'support']);
  } catch (error) {
    return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = (searchParams.get('type') || 'overview') as AnalyticsType;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeSnapshots = searchParams.get('includeSnapshots') === 'true';
    const agentId = searchParams.get('agentId');

    // Validate analytics type
    const validTypes: AnalyticsType[] = ['overview', 'trends', 'breakdown', 'agents'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate date format if provided
    if (startDate && !isValidDate(startDate)) {
      return NextResponse.json(
        { error: 'Invalid startDate format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (endDate && !isValidDate(endDate)) {
      return NextResponse.json(
        { error: 'Invalid endDate format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate date range if both provided
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: 'startDate must be before or equal to endDate' },
        { status: 400 }
      );
    }

    // For trends type, dates are required
    if (type === 'trends' && (!startDate || !endDate)) {
      const defaultRange = getDefaultDateRange();
      const response = await handleTrends(
        startDate || defaultRange.startDate,
        endDate || defaultRange.endDate
      );
      return NextResponse.json(response);
    }

    // Route to appropriate handler based on type
    let response:
      | OverviewResponse
      | TrendsResponse
      | BreakdownResponse
      | AgentsResponse;

    switch (type) {
      case 'overview':
        response = await handleOverview(
          startDate || undefined,
          endDate || undefined,
          includeSnapshots
        );
        break;

      case 'trends':
        // Already handled above with default dates
        response = await handleTrends(startDate!, endDate!);
        break;

      case 'breakdown':
        response = await handleBreakdown(
          startDate || undefined,
          endDate || undefined
        );
        break;

      case 'agents':
        response = await handleAgents(
          agentId || undefined,
          startDate || undefined,
          endDate || undefined
        );
        break;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Failed to fetch support analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch support analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
