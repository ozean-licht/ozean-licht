/**
 * MCP Gateway error classes
 * Simplified to 3 error types for better clarity
 */

/**
 * Additional error data that can be attached to MCP errors
 */
export interface MCPErrorData {
  [key: string]: unknown;
}

/**
 * Base error class for MCP Gateway operations
 */
export class MCPError extends Error {
  public readonly code: number;
  public readonly data?: MCPErrorData;

  constructor(code: number, message: string, data?: MCPErrorData) {
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
  constructor(message: string, data?: MCPErrorData) {
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
  constructor(message: string, data?: MCPErrorData) {
    super(-32000, message, data);
    this.name = 'MCPServerError';
  }
}

/**
 * Type guard to check if error has code and message properties
 */
function isErrorLike(error: unknown): error is { code: number; message: string; data?: MCPErrorData } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as { code: unknown }).code === 'number' &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Parse error from MCP Gateway response
 */
export function parseError(error: unknown): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (isErrorLike(error)) {
    return new MCPError(error.code, error.message, error.data);
  }

  if (error instanceof Error) {
    return new MCPServerError(error.message);
  }

  return new MCPServerError('Unknown error', { originalError: error });
}
