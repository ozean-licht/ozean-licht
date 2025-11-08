/**
 * Health Dashboard Server Actions
 *
 * Server-side actions for fetching system health metrics.
 * Requires authentication and aggregates data from all health sources.
 */

'use server';

import { requireAuth } from '@/lib/auth-utils';
import {
  checkPostgresHealth,
  checkMCPGatewayHealth,
  getServerHealth,
} from '@/lib/mcp-client/health';
import { SystemHealth, SystemStatus } from '@/types/health';

/**
 * Get complete system health metrics
 *
 * Fetches health data from all sources in parallel:
 * - PostgreSQL databases (kids_ascension_db, ozean_licht_db, shared_users_db)
 * - MCP Gateway service
 * - Server resources (CPU, memory, disk)
 *
 * Overall system status determination:
 * - down: Any database is down OR MCP Gateway is down
 * - degraded: All services up, but resources exceed thresholds (CPU > 80%, Memory > 85%, Disk > 85%)
 * - healthy: All services up and resources within normal range
 *
 * @returns SystemHealth object with complete metrics
 * @throws Error if authentication fails
 *
 * @example
 * ```typescript
 * const health = await getSystemHealth();
 * console.log(health.status); // 'healthy' | 'degraded' | 'down'
 * ```
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  // Require authentication before proceeding
  await requireAuth();

  const baseUrl = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';

  try {
    // Fetch all health metrics in parallel for performance
    const [postgres, mcpGateway, server] = await Promise.all([
      checkPostgresHealth(baseUrl),
      checkMCPGatewayHealth(baseUrl),
      getServerHealth(),
    ]);

    // Determine overall system status
    let status: SystemStatus = 'healthy';

    // System is down if any database or gateway is down
    if (postgres.overallStatus === 'down' || mcpGateway.status === 'down') {
      status = 'down';
    }
    // System is degraded if server resources exceed thresholds
    else if (server.status === 'degraded' || server.status === 'down') {
      status = 'degraded';
    }

    return {
      status,
      postgres,
      mcpGateway,
      server,
      timestamp: new Date(),
    };
  } catch (error) {
    // On error, return partial data with 'down' status
    console.error('Error fetching system health:', error);

    // Return degraded state with empty/placeholder data
    const [postgres, mcpGateway, server] = await Promise.allSettled([
      checkPostgresHealth(baseUrl),
      checkMCPGatewayHealth(baseUrl),
      getServerHealth(),
    ]);

    return {
      status: 'down',
      postgres:
        postgres.status === 'fulfilled'
          ? postgres.value
          : {
              overallStatus: 'down',
              kidsAscension: {
                name: 'kids_ascension_db',
                displayName: 'Kids Ascension',
                status: 'down',
                activeConnections: 0,
                maxConnections: 100,
                avgQueryTime: 0,
                lastChecked: new Date(),
              },
              ozeanLicht: {
                name: 'ozean_licht_db',
                displayName: 'Ozean Licht',
                status: 'down',
                activeConnections: 0,
                maxConnections: 100,
                avgQueryTime: 0,
                lastChecked: new Date(),
              },
              sharedUsers: {
                name: 'shared_users_db',
                displayName: 'Shared Users',
                status: 'down',
                activeConnections: 0,
                maxConnections: 100,
                avgQueryTime: 0,
                lastChecked: new Date(),
              },
            },
      mcpGateway:
        mcpGateway.status === 'fulfilled'
          ? mcpGateway.value
          : {
              status: 'down',
              p50: 0,
              p95: 0,
              p99: 0,
              uptime: 0,
              requestCount24h: 0,
              lastChecked: new Date(),
            },
      server:
        server.status === 'fulfilled'
          ? server.value
          : {
              status: 'down',
              cpuUsage: 0,
              cpuCores: 12,
              memoryUsed: 0,
              memoryTotal: 64,
              diskUsed: 0,
              diskTotal: 1.0,
              lastChecked: new Date(),
            },
      timestamp: new Date(),
    };
  }
}
