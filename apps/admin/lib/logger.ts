/**
 * Logging utility for the admin application
 *
 * Provides structured logging with appropriate levels and context.
 * In production, sensitive details are redacted.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sanitize error objects to remove sensitive information
 */
function sanitizeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: isProduction ? 'An error occurred' : error.message,
      // Only include stack traces in development
      ...(isProduction ? {} : { stack: error.stack }),
    };
  }
  return { error: isProduction ? 'Unknown error' : String(error) };
}

/**
 * Sanitize context to remove sensitive fields
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;

  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization'];
  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Log a message with the specified level
 */
function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const sanitizedContext = sanitizeContext(context);

  const logEntry = {
    timestamp,
    level,
    message,
    ...(sanitizedContext ? { context: sanitizedContext } : {}),
  };

  // In production, use structured JSON logging
  if (isProduction) {
    console.log(JSON.stringify(logEntry));
  } else {
    // In development, use more readable format
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(prefix, message, sanitizedContext || '');
  }
}

/**
 * Logger utility
 */
export const logger = {
  debug(message: string, context?: LogContext) {
    if (!isProduction) {
      log('debug', message, context);
    }
  },

  info(message: string, context?: LogContext) {
    log('info', message, context);
  },

  warn(message: string, context?: LogContext) {
    log('warn', message, context);
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorContext = {
      ...sanitizeError(error),
      ...context,
    };
    log('error', message, errorContext);
  },
};

export default logger;
