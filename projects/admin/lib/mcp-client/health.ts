/**
 * Health check utilities
 */

import { MCPGatewayClient } from './client';
import { MCPHealthResponse } from '../../types/mcp';
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

    const data = await response.json() as any;
    return {
      version: data.version || 'unknown',
      services: data.services?.map((s: any) => s.service) || [],
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
  } catch (error: any) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      error: error.message || 'Unknown error',
    };
  }
}
