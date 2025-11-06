/**
 * Health monitoring type definitions
 *
 * This module defines all TypeScript interfaces for the system health monitoring dashboard.
 * It covers database metrics, MCP Gateway performance, and server resource utilization.
 */

/**
 * Status for individual services
 */
export type ServiceStatus = 'up' | 'down';

/**
 * Overall system health status
 */
export type SystemStatus = 'healthy' | 'degraded' | 'down';

/**
 * Health metrics for an individual PostgreSQL database
 */
export interface DatabaseMetrics {
  /** Database identifier (kids_ascension_db, ozean_licht_db, shared_users_db) */
  name: string;
  /** Human-readable display name */
  displayName: string;
  /** Current service status */
  status: ServiceStatus;
  /** Number of active connections to this database */
  activeConnections: number;
  /** Maximum allowed connections */
  maxConnections: number;
  /** Average query execution time in milliseconds */
  avgQueryTime: number;
  /** Timestamp of last health check */
  lastChecked: Date;
}

/**
 * Container for all PostgreSQL database health data
 */
export interface PostgresHealthData {
  /** Overall status (up only if all databases are up) */
  overallStatus: ServiceStatus;
  /** Health metrics for Kids Ascension database */
  kidsAscension: DatabaseMetrics;
  /** Health metrics for Ozean Licht database */
  ozeanLicht: DatabaseMetrics;
  /** Health metrics for shared users database */
  sharedUsers: DatabaseMetrics;
}

/**
 * Health metrics for MCP Gateway service
 */
export interface MCPGatewayHealth {
  /** Current service status */
  status: ServiceStatus;
  /** 50th percentile response time in milliseconds */
  p50: number;
  /** 95th percentile response time in milliseconds */
  p95: number;
  /** 99th percentile response time in milliseconds */
  p99: number;
  /** Service uptime in seconds */
  uptime: number;
  /** Total request count in last 24 hours */
  requestCount24h: number;
  /** Timestamp of last health check */
  lastChecked: Date;
}

/**
 * Server resource utilization metrics
 */
export interface ServerHealth {
  /** Overall server health status */
  status: SystemStatus;
  /** CPU usage percentage (0-100) */
  cpuUsage: number;
  /** Total number of CPU cores */
  cpuCores: number;
  /** Memory usage in GB */
  memoryUsed: number;
  /** Total memory in GB */
  memoryTotal: number;
  /** Disk usage in TB */
  diskUsed: number;
  /** Total disk space in TB */
  diskTotal: number;
  /** Timestamp of last check */
  lastChecked: Date;
}

/**
 * Complete system health data
 */
export interface SystemHealth {
  /** Overall system health status */
  status: SystemStatus;
  /** PostgreSQL database health metrics */
  postgres: PostgresHealthData;
  /** MCP Gateway health metrics */
  mcpGateway: MCPGatewayHealth;
  /** Server resource metrics */
  server: ServerHealth;
  /** Timestamp when this health snapshot was taken */
  timestamp: Date;
}
