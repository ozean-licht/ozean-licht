/**
 * Configuration utilities for MCP Gateway Client
 */

import { MCPDatabase } from '../../types/mcp';
import { MCPValidationError } from './errors';

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
 */
const VALID_DATABASES: MCPDatabase[] = [
  'shared-users-db',
  'kids-ascension-db',
  'ozean-licht-db',
];

/**
 * Validate and resolve configuration
 */
export function resolveConfig(config: MCPClientConfig): ResolvedMCPClientConfig {
  // Validate database
  if (!VALID_DATABASES.includes(config.database)) {
    throw new MCPValidationError(
      `Invalid database name: ${config.database}. Must be one of: ${VALID_DATABASES.join(', ')}`
    );
  }

  // Validate baseUrl
  if (config.baseUrl) {
    try {
      new URL(config.baseUrl);
    } catch (error) {
      throw new MCPValidationError(`Invalid base URL: ${config.baseUrl}`);
    }
  }

  // Validate timeout
  if (config.timeout !== undefined && (config.timeout <= 0 || config.timeout > 60000)) {
    throw new MCPValidationError('Timeout must be between 1 and 60000 milliseconds');
  }

  // Validate retries
  if (config.retries !== undefined && (config.retries < 0 || config.retries > 10)) {
    throw new MCPValidationError('Retries must be between 0 and 10');
  }

  // Validate retryDelay
  if (config.retryDelay !== undefined && (config.retryDelay < 0 || config.retryDelay > 10000)) {
    throw new MCPValidationError('Retry delay must be between 0 and 10000 milliseconds');
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
