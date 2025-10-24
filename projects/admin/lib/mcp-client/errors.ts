/**
 * MCP Gateway error classes
 */

/**
 * Base error class for MCP Gateway operations
 */
export class MCPError extends Error {
  public readonly code: number;
  public readonly data?: any;

  constructor(code: number, message: string, data?: any) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.data = data;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MCPError);
    }
  }
}

/**
 * Error thrown when MCP Gateway request times out
 */
export class MCPTimeoutError extends MCPError {
  constructor(message: string = 'Request timed out', data?: any) {
    super(-32000, message, data);
    this.name = 'MCPTimeoutError';
  }
}

/**
 * Error thrown when MCP Gateway is unreachable
 */
export class MCPConnectionError extends MCPError {
  constructor(message: string = 'Connection failed', data?: any) {
    super(-32001, message, data);
    this.name = 'MCPConnectionError';
  }
}

/**
 * Error thrown when request validation fails
 */
export class MCPValidationError extends MCPError {
  constructor(message: string, data?: any) {
    super(-32602, message, data);
    this.name = 'MCPValidationError';
  }
}

/**
 * Error thrown when database query fails
 */
export class MCPQueryError extends MCPError {
  constructor(message: string, data?: any) {
    super(-32003, message, data);
    this.name = 'MCPQueryError';
  }
}

/**
 * Parse error from MCP Gateway response
 */
export function parseError(error: any): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (error?.code && error?.message) {
    return new MCPError(error.code, error.message, error.data);
  }

  if (error instanceof Error) {
    return new MCPError(-32603, error.message);
  }

  return new MCPError(-32603, 'Unknown error', error);
}
