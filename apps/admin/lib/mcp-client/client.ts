/**
 * MCP Gateway Client
 * Core client for communicating with the MCP Gateway
 */

import fetch from 'node-fetch';
import { randomUUID } from 'crypto';
import { MCPClientConfig, ResolvedMCPClientConfig, resolveConfig } from './config';
import { MCPRequest, MCPResponse } from '../../types/mcp';
import {
  MCPError,
  MCPTimeoutError,
  MCPConnectionError,
  MCPQueryError,
  parseError,
} from './errors';

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
   * Execute multiple operations in a transaction
   * @param callback Transaction callback
   * @returns Result of the callback
   */
  async transaction<T>(callback: (client: MCPGatewayClient) => Promise<T>): Promise<T> {
    // Start transaction
    await this.execute('BEGIN');

    try {
      // Execute callback
      const result = await callback(this);

      // Commit transaction
      await this.execute('COMMIT');

      return result;
    } catch (error) {
      // Rollback on error
      await this.execute('ROLLBACK');
      throw error;
    }
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
        throw new MCPConnectionError(
          `MCP Gateway returned ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as MCPResponse<T>;

      // Check for JSON-RPC error
      if (data.error) {
        throw new MCPQueryError(data.error.message, data.error.data);
      }

      // Check for result
      if (!data.result) {
        throw new MCPError(-32603, 'Invalid response: missing result');
      }

      // Check result status
      if (data.result.status === 'error') {
        throw new MCPQueryError('Query failed', data.result.data);
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
        throw new MCPTimeoutError(`Request timed out after ${this.config.timeout}ms`);
      }

      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        if (retryCount < this.config.retries) {
          // Retry on connection error
          await this._sleep(this.config.retryDelay);
          return this._request<T>(operation, params, retryCount + 1);
        }
        throw new MCPConnectionError('Failed to connect to MCP Gateway', {
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
