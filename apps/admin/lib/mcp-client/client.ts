/**
 * MCP Gateway Client
 * Core client for communicating with the MCP Gateway
 */

import fetch from 'node-fetch';
import { randomUUID } from 'crypto';
import { MCPDatabase, MCPRequest, MCPResponse } from '../../types/mcp';
import {
  MCPError,
  MCPClientError,
  MCPServerError,
  parseError,
} from './errors';

/**
 * MCP Gateway Client configuration
 */
export interface MCPClientConfig {
  /** Base URL of the MCP Gateway (default: http://localhost:8100) */
  baseUrl?: string;
  /** Target database name */
  database: MCPDatabase;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Number of retry attempts for transient failures (default: 3) */
  retries?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
}

/**
 * Resolved configuration with defaults applied
 */
export interface ResolvedMCPClientConfig {
  baseUrl: string;
  database: MCPDatabase;
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Omit<ResolvedMCPClientConfig, 'database'> = {
  baseUrl: 'http://localhost:8100',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

/**
 * Valid database names
 * Note: shared-users-db has been consolidated into ozean-licht-db
 */
const VALID_DATABASES: MCPDatabase[] = [
  'kids-ascension-db',
  'ozean-licht-db',
];

/**
 * Validate and resolve configuration
 */
function resolveConfig(config: MCPClientConfig): ResolvedMCPClientConfig {
  // Validate database
  if (!VALID_DATABASES.includes(config.database)) {
    throw new MCPClientError(
      `Invalid database name: ${config.database}. Must be one of: ${VALID_DATABASES.join(', ')}`
    );
  }

  // Validate baseUrl
  if (config.baseUrl) {
    try {
      new URL(config.baseUrl);
    } catch (error) {
      throw new MCPClientError(`Invalid base URL: ${config.baseUrl}`);
    }
  }

  // Validate timeout
  if (config.timeout !== undefined && (config.timeout <= 0 || config.timeout > 60000)) {
    throw new MCPClientError('Timeout must be between 1 and 60000 milliseconds');
  }

  // Validate retries
  if (config.retries !== undefined && (config.retries < 0 || config.retries > 10)) {
    throw new MCPClientError('Retries must be between 0 and 10');
  }

  // Validate retryDelay
  if (config.retryDelay !== undefined && (config.retryDelay < 0 || config.retryDelay > 10000)) {
    throw new MCPClientError('Retry delay must be between 0 and 10000 milliseconds');
  }

  // Return resolved config with defaults
  return {
    baseUrl: config.baseUrl || DEFAULT_CONFIG.baseUrl,
    database: config.database,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
    retries: config.retries ?? DEFAULT_CONFIG.retries,
    retryDelay: config.retryDelay ?? DEFAULT_CONFIG.retryDelay,
  };
}

/**
 * MCP Gateway Client
 * Provides type-safe database operations via MCP Gateway
 */
export class MCPGatewayClient {
  private readonly config: ResolvedMCPClientConfig;

  constructor(config: MCPClientConfig) {
    this.config = resolveConfig(config);
  }

  /**
   * Execute a raw SQL query
   * @param sql SQL query string
   * @param params Query parameters (for parameterized queries)
   * @returns Query results as array of rows
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this._request<any>('query', {
      args: [sql, ...(params || [])],
    });

    // MCP Gateway returns {rowCount, rows, fields}, extract just rows
    return result.rows || result;
  }

  /**
   * Execute a SQL statement (INSERT, UPDATE, DELETE)
   * @param sql SQL statement
   * @param params Statement parameters
   * @returns Number of affected rows
   */
  async execute(sql: string, params?: any[]): Promise<number> {
    const result = await this._request<{ affectedRows: number }>('execute', {
      query: sql,
      params: params || [],
    });

    return result.affectedRows || 0;
  }

  /**
   * Low-level request method
   * Handles JSON-RPC communication with MCP Gateway
   */
  private async _request<T>(operation: string, params: any, retryCount = 0): Promise<T> {
    const requestId = randomUUID();

    const body: MCPRequest = {
      jsonrpc: '2.0',
      method: 'mcp.execute',
      params: {
        service: 'postgres',
        database: this.config.database,
        operation,
        ...params,
      },
      id: requestId,
    };

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      // Make request
      const response = await fetch(`${this.config.baseUrl}/mcp/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      if (!response.ok) {
        throw new MCPServerError(
          `MCP Gateway returned ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as MCPResponse<T>;

      // Check for JSON-RPC error
      if (data.error) {
        throw new MCPServerError(data.error.message, data.error.data);
      }

      // Check for result
      if (!data.result) {
        throw new MCPServerError('Invalid response: missing result');
      }

      // Check result status
      if (data.result.status === 'error') {
        throw new MCPServerError('Query failed', data.result.data);
      }

      return data.result.data;
    } catch (error: any) {
      // Handle abort (timeout)
      if (error.name === 'AbortError') {
        if (retryCount < this.config.retries) {
          // Retry on timeout
          await this._sleep(this.config.retryDelay);
          return this._request<T>(operation, params, retryCount + 1);
        }
        throw new MCPServerError(`Request timed out after ${this.config.timeout}ms`);
      }

      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        if (retryCount < this.config.retries) {
          // Retry on connection error
          await this._sleep(this.config.retryDelay);
          return this._request<T>(operation, params, retryCount + 1);
        }
        throw new MCPServerError('Failed to connect to MCP Gateway', {
          baseUrl: this.config.baseUrl,
          error: error.message,
        });
      }

      // Re-throw MCP errors
      if (error instanceof MCPError) {
        throw error;
      }

      // Wrap unknown errors
      throw parseError(error);
    }
  }

  /**
   * Sleep for a given duration
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current configuration
   */
  getConfig(): ResolvedMCPClientConfig {
    return { ...this.config };
  }
}
