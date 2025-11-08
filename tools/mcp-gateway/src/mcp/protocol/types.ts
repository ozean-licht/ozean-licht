/**
 * MCP Protocol Types - Based on JSON-RPC 2.0 specification
 */

export interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params?: MCPParams;
  id: string | number;
}

export interface MCPParams {
  service: string;
  operation: string;
  args?: Record<string, any>;
  database?: string;
  options?: MCPOptions;
}

export interface MCPOptions {
  timeout?: number;
  readOnly?: boolean;
  format?: 'json' | 'table' | 'csv';
  limit?: number;
  offset?: number;
  user_id?: string;
  agent_id?: string;
  metadata?: any;
  [key: string]: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  result?: MCPResult;
  error?: MCPError;
  id: string | number;
}

export interface MCPResult {
  status: 'success' | 'partial' | 'cached';
  data: any;
  metadata?: MCPMetadata;
}

export interface MCPMetadata {
  executionTime: number;
  tokensUsed: number;
  cost: number;
  cached?: boolean;
  truncated?: boolean;
  rowCount?: number;
  service: string;
  operation: string;
  timestamp: string;
  database?: string;
  [key: string]: any;
}

export interface MCPError {
  code: number;
  message: string;
  data?: {
    service: string;
    operation?: string;
    details?: string;
    stack?: string;
  };
}

// Standard MCP Error Codes
export enum MCPErrorCode {
  // JSON-RPC standard errors
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,

  // MCP-specific errors
  SERVICE_NOT_FOUND = -32000,
  SERVICE_UNAVAILABLE = -32001,
  OPERATION_NOT_SUPPORTED = -32002,
  AUTHENTICATION_REQUIRED = -32003,
  PERMISSION_DENIED = -32004,
  RATE_LIMIT_EXCEEDED = -32005,
  TIMEOUT = -32006,
  RESOURCE_NOT_FOUND = -32007,
  CONFLICT = -32008,
  VALIDATION_ERROR = -32009,
}

// Command parsing types
export interface ParsedCommand {
  service: string;
  database?: string;
  operation: string;
  args: string[];
  rawArgs?: string;
}

// Service capability definitions
export interface MCPCapability {
  name: string;
  description: string;
  parameters?: MCPParameter[];
  examples?: string[];
  requiresAuth?: boolean;
  tokenCost?: number;
}

export interface MCPParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  pattern?: string;
}

// Service handler types
export interface MCPHandler {
  execute(params: MCPParams): Promise<MCPResult>;
  validateParams?(params: MCPParams): void;
  getCapabilities(): MCPCapability[];
}

// Service registration
export interface MCPService {
  name: string;
  version: string;
  description: string;
  location: 'server' | 'local';
  handler?: MCPHandler;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
  errorMessage?: string;
}

// Token tracking
export interface TokenUsage {
  service: string;
  operation: string;
  tokens: number;
  cost: number;
  timestamp: Date;
  agentId?: string;
}

// Connection pool stats
export interface PoolStats {
  total: number;
  idle: number;
  waiting: number;
  maxConnections: number;
  connectionErrors: number;
}