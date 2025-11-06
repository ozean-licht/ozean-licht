import { MCPErrorCode } from '../mcp/protocol/types';

export class MCPError extends Error {
  public code: number;
  public data?: any;

  constructor(message: string, code: MCPErrorCode, data?: any) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.data = data;
    Error.captureStackTrace(this, MCPError);
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}

export class ValidationError extends MCPError {
  constructor(message: string, data?: any) {
    super(message, MCPErrorCode.VALIDATION_ERROR, data);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends MCPError {
  constructor(message: string = 'Authentication required', data?: any) {
    super(message, MCPErrorCode.AUTHENTICATION_REQUIRED, data);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends MCPError {
  constructor(message: string = 'Permission denied', data?: any) {
    super(message, MCPErrorCode.PERMISSION_DENIED, data);
    this.name = 'PermissionError';
  }
}

export class RateLimitError extends MCPError {
  constructor(message: string = 'Rate limit exceeded', data?: any) {
    super(message, MCPErrorCode.RATE_LIMIT_EXCEEDED, data);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends MCPError {
  constructor(message: string = 'Operation timed out', data?: any) {
    super(message, MCPErrorCode.TIMEOUT, data);
    this.name = 'TimeoutError';
  }
}

export class ServiceNotFoundError extends MCPError {
  constructor(service: string) {
    super(`Service '${service}' not found`, MCPErrorCode.SERVICE_NOT_FOUND, { service });
    this.name = 'ServiceNotFoundError';
  }
}

export class ServiceUnavailableError extends MCPError {
  constructor(service: string, reason?: string) {
    super(
      `Service '${service}' is unavailable${reason ? `: ${reason}` : ''}`,
      MCPErrorCode.SERVICE_UNAVAILABLE,
      { service, reason }
    );
    this.name = 'ServiceUnavailableError';
  }
}