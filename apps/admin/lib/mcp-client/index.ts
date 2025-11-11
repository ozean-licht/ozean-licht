/**
 * MCP Gateway Client Library
 * Unified client for admin dashboard database operations via MCP Gateway
 */

// Main client
export { MCPGatewayClient } from './client';
export { MCPGatewayClientWithQueries } from './queries';

// Configuration (now in client.ts)
export type { MCPClientConfig, ResolvedMCPClientConfig } from './client';

// Health utilities
export {
  healthCheck,
  checkGatewayReachable,
  getGatewayInfo,
  checkDatabaseConnection,
} from './health';

// Error classes (simplified to 3 types)
export {
  MCPError,
  MCPClientError,
  MCPServerError,
} from './errors';

// Types
export * from '../../types';
