/**
 * MCP Gateway error classes
 * Simplified to 3 error types for better clarity
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
 * Client-side error (4xx equivalent)
 * Thrown when request validation fails or bad parameters provided
 */
export class MCPClientError extends MCPError {
  constructor(message: string, data?: any) {
    super(-32602, message, data);
    this.name = 'MCPClientError';
  }
}

/**
 * Server-side error (5xx equivalent)
 * Thrown when MCP Gateway or database operations fail
 * Includes: connection errors, timeouts, query failures
 */
export class MCPServerError extends MCPError {
  constructor(message: string, data?: any) {
    super(-32000, message, data);
    this.name = 'MCPServerError';
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
    return new MCPServerError(error.message);
  }

  return new MCPServerError('Unknown error', error);
}
