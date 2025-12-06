/**
 * Health check utilities
 */

import { MCPGatewayClient } from './client';
import { MCPHealthResponse, MCPDatabase } from '../../types/mcp';
import {
  PostgresHealthData,
  MCPGatewayHealth,
  ServerHealth,
  DatabaseMetrics,
} from '../../types/health';
import fetch from 'node-fetch';

/**
 * Check health of MCP Gateway and database connection
 * @param client MCP Gateway client instance
 * @returns Health check result
 */
export async function healthCheck(client: MCPGatewayClient): Promise<MCPHealthResponse> {
  const startTime = Date.now();

  try {
    // Try simple query: SELECT 1
    await client.query('SELECT 1');

    return {
      healthy: true,
      latency: Date.now() - startTime,
    };
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - startTime,
    };
  }
}

/**
 * Check if MCP Gateway is reachable
 * @param baseUrl MCP Gateway base URL
 * @returns True if gateway is reachable
 */
export async function checkGatewayReachable(baseUrl: string = 'http://localhost:8100'): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Catalog service entry from MCP Gateway
 */
interface CatalogService {
  service: string;
  description?: string;
  operations?: string[];
  status?: string;
}

/**
 * Catalog response from MCP Gateway
 */
interface CatalogResponse {
  version?: string;
  services?: CatalogService[];
}

/**
 * Get MCP Gateway version and info
 * @param baseUrl MCP Gateway base URL
 * @returns Gateway version info
 */
export async function getGatewayInfo(
  baseUrl: string = 'http://localhost:8100'
): Promise<{ version: string; services: string[] } | null> {
  try {
    const response = await fetch(`${baseUrl}/mcp/catalog`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as CatalogResponse;
    return {
      version: data.version || 'unknown',
      services: data.services?.map((s) => s.service) || [],
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify database connection with detailed diagnostics
 * @param client MCP Gateway client instance
 * @returns Diagnostic information
 */
export async function checkDatabaseConnection(client: MCPGatewayClient): Promise<{
  connected: boolean;
  latency: number;
  error?: string;
  databaseVersion?: string;
}> {
  const startTime = Date.now();

  try {
    // Get PostgreSQL version
    const result = await client.query<{ version: string }>('SELECT version()');
    const version = result[0]?.version || 'unknown';

    return {
      connected: true,
      latency: Date.now() - startTime,
      databaseVersion: version,
    };
  } catch (error) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check health of a single database
 * @param databaseName Database identifier (kids-ascension-db, ozean-licht-db)
 * @param displayName Human-readable name for display
 * @param baseUrl MCP Gateway base URL
 * @returns Database health metrics
 */
async function checkSingleDatabase(
  databaseName: MCPDatabase,
  displayName: string,
  baseUrl: string
): Promise<DatabaseMetrics> {
  try {
    // Create client for specific database
    const client = new MCPGatewayClient({ baseUrl, database: databaseName });

    // Health check query
    await client.query('SELECT 1 as health_check');

    // Get connection statistics
    const connStats = await client.query<{ active_connections: number; max_connections: number }>(
      `SELECT
        count(*) as active_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
      FROM pg_stat_activity
      WHERE datname = current_database()`
    );

    const activeConnections = connStats[0]?.active_connections || 0;
    const maxConnections = connStats[0]?.max_connections || 100;

    // Try to get average query time (requires pg_stat_statements extension)
    let avgQueryTime = 0;
    try {
      const queryStats = await client.query<{ avg_time: number }>(
        'SELECT COALESCE(AVG(mean_exec_time), 0) as avg_time FROM pg_stat_statements WHERE queryid IS NOT NULL'
      );
      avgQueryTime = queryStats[0]?.avg_time || 0;
    } catch {
      // pg_stat_statements not available, use 0 as fallback
      avgQueryTime = 0;
    }

    return {
      name: databaseName,
      displayName,
      status: 'up',
      activeConnections,
      maxConnections,
      avgQueryTime,
      lastChecked: new Date(),
    };
  } catch (error) {
    return {
      name: databaseName,
      displayName,
      status: 'down',
      activeConnections: 0,
      maxConnections: 100,
      avgQueryTime: 0,
      lastChecked: new Date(),
    };
  }
}

/**
 * Check health of all PostgreSQL databases
 * @param baseUrl MCP Gateway base URL
 * @returns Complete PostgreSQL health data
 */
export async function checkPostgresHealth(
  baseUrl: string = 'http://localhost:8100'
): Promise<PostgresHealthData> {
  // Check active databases in parallel (shared-users-db consolidated into ozean-licht-db)
  const [kidsAscension, ozeanLicht] = await Promise.all([
    checkSingleDatabase('kids-ascension-db', 'Kids Ascension', baseUrl),
    checkSingleDatabase('ozean-licht-db', 'Ozean Licht', baseUrl),
  ]);

  // Overall status is up only if all active databases are up
  const overallStatus =
    kidsAscension.status === 'up' && ozeanLicht.status === 'up'
      ? 'up'
      : 'down';

  return {
    overallStatus,
    kidsAscension,
    ozeanLicht,
    // sharedUsers removed - consolidated into ozean-licht-db
  };
}

/**
 * Health response from MCP Gateway
 */
interface HealthResponse {
  uptime?: number;
  requestCount24h?: number;
  status?: string;
}

/**
 * Check health of MCP Gateway with detailed metrics
 * @param baseUrl MCP Gateway base URL
 * @returns MCP Gateway health metrics
 */
export async function checkMCPGatewayHealth(
  baseUrl: string = 'http://localhost:8100'
): Promise<MCPGatewayHealth> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error('Gateway not healthy');
    }

    const data = await response.json() as HealthResponse;
    const responseTime = Date.now() - startTime;

    // For now, use simple calculations for percentiles
    // TODO: Implement proper percentile tracking in MCP Gateway
    return {
      status: 'up',
      p50: responseTime,
      p95: responseTime * 1.5,
      p99: responseTime * 2,
      uptime: data.uptime || 0,
      requestCount24h: data.requestCount24h || 0,
      lastChecked: new Date(),
    };
  } catch (error) {
    return {
      status: 'down',
      p50: 0,
      p95: 0,
      p99: 0,
      uptime: 0,
      requestCount24h: 0,
      lastChecked: new Date(),
    };
  }
}

/**
 * Get server health metrics
 * Note: This currently returns placeholder data. Future implementation
 * should integrate with Prometheus or system monitoring agent.
 * @returns Server health metrics
 */
export async function getServerHealth(): Promise<ServerHealth> {
  // TODO: Integrate with actual server monitoring (Prometheus)
  // For now, return placeholder data based on Hetzner AX42 specs
  const cpuUsage = 45; // Placeholder: 45%
  const memoryUsed = 28; // Placeholder: 28GB used
  const memoryTotal = 64; // AMD Ryzen 5 3600 with 64GB RAM
  const diskUsed = 0.3; // Placeholder: 300GB used
  const diskTotal = 1.0; // 2x512GB NVMe = ~1TB

  // Determine status based on thresholds
  let status: 'healthy' | 'degraded' | 'down' = 'healthy';
  if (
    cpuUsage > 90 ||
    (memoryUsed / memoryTotal) * 100 > 90 ||
    (diskUsed / diskTotal) * 100 > 90
  ) {
    status = 'down';
  } else if (
    cpuUsage > 80 ||
    (memoryUsed / memoryTotal) * 100 > 85 ||
    (diskUsed / diskTotal) * 100 > 85
  ) {
    status = 'degraded';
  }

  return {
    status,
    cpuUsage,
    cpuCores: 12, // 6 cores, 12 threads
    memoryUsed,
    memoryTotal,
    diskUsed,
    diskTotal,
    lastChecked: new Date(),
  };
}
