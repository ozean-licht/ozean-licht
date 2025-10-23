/**
 * MCP Gateway Client Library
 * Unified client for admin dashboard database operations via MCP Gateway
 */

// Main client
export { MCPGatewayClient } from './client';
export { MCPGatewayClientWithQueries } from './queries';

// Configuration
export { MCPClientConfig, ResolvedMCPClientConfig } from './config';

// Health utilities
export {
  healthCheck,
  checkGatewayReachable,
  getGatewayInfo,
  checkDatabaseConnection,
} from './health';

// Error classes
export {
  MCPError,
  MCPTimeoutError,
  MCPConnectionError,
  MCPValidationError,
  MCPQueryError,
} from './errors';

// Types
export * from '../../types';
