/**
 * MCP Gateway request/response types
 * Based on JSON-RPC 2.0 protocol
 */

/**
 * Supported database names in MCP Gateway
 * Note: shared-users-db has been consolidated into ozean-licht-db
 */
export type MCPDatabase = 'kids-ascension-db' | 'ozean-licht-db';

/**
 * MCP Gateway JSON-RPC request
 */
export interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params: {
    service: string;
    database?: MCPDatabase;
    operation: string;
    query?: string;
    params?: any[];
    [key: string]: any;
  };
  id: string;
}

/**
 * MCP Gateway JSON-RPC response
 */
export interface MCPResponse<T = any> {
  jsonrpc: '2.0';
  result?: {
    status: 'success' | 'error';
    data: T;
    metadata?: {
      executionTime: number;
      tokensUsed?: number;
      rowCount?: number;
    };
  };
  error?: MCPErrorObject;
  id: string;
}

/**
 * MCP Gateway error object
 */
export interface MCPErrorObject {
  code: number;
  message: string;
  data?: any;
}

/**
 * MCP Gateway health response
 */
export interface MCPHealthResponse {
  healthy: boolean;
  latency: number;
  gatewayVersion?: string;
}

/**
 * MCP Gateway catalog entry
 */
export interface MCPCatalogEntry {
  service: string;
  description: string;
  operations: string[];
  status: 'available' | 'unavailable';
}

/**
 * MCP Gateway catalog response
 */
export interface MCPCatalogResponse {
  services: MCPCatalogEntry[];
  version: string;
}
