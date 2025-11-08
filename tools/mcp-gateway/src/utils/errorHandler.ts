import { Request, Response, NextFunction } from 'express';
import { MCPError } from './errors';
import { logger } from './logger';
import { config } from '../../config/environment';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Request error', {
    error: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    ip: req.ip,
  });

  // Handle MCP errors
  if (err instanceof MCPError) {
    res.status(getHttpStatusFromMCPError(err.code)).json({
      jsonrpc: '2.0',
      error: err.toJSON(),
      id: req.body?.id || null,
    });
    return;
  }

  // Handle validation errors from other libraries
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid parameters',
        data: {
          details: err.message,
          ...(config.NODE_ENV === 'development' && { stack: err.stack }),
        },
      },
      id: req.body?.id || null,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      jsonrpc: '2.0',
      error: {
        code: -32003,
        message: 'Authentication failed',
        data: {
          details: err.message,
        },
      },
      id: req.body?.id || null,
    });
    return;
  }

  // Default error response
  res.status(500).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message: 'Internal server error',
      data: {
        ...(config.NODE_ENV === 'development' && {
          details: err.message,
          stack: err.stack,
        }),
      },
    },
    id: req.body?.id || null,
  });
}

function getHttpStatusFromMCPError(code: number): number {
  switch (code) {
    case -32700: // Parse error
    case -32600: // Invalid request
    case -32602: // Invalid params
    case -32009: // Validation error
      return 400;

    case -32601: // Method not found
    case -32007: // Resource not found
      return 404;

    case -32003: // Authentication required
      return 401;

    case -32004: // Permission denied
      return 403;

    case -32005: // Rate limit exceeded
      return 429;

    case -32006: // Timeout
      return 408;

    case -32008: // Conflict
      return 409;

    case -32001: // Service unavailable
      return 503;

    case -32603: // Internal error
    default:
      return 500;
  }
}