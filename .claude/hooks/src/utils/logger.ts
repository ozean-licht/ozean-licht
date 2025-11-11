/**
 * Logger utility for hooks - writes structured logs to stderr only
 * to avoid polluting stdout (which is used for hook JSON output)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private logLevel: LogLevel;
  private logFormat: 'json' | 'pretty';

  constructor() {
    // Default to 'error' to minimize context pollution
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'error';
    this.logFormat = (process.env.LOG_FORMAT as 'json' | 'pretty') || 'pretty';
  }

  private shouldLog(level: LogLevel): boolean {
    // Silent mode - no logging at all
    if (this.logLevel === 'silent') {
      return false;
    }

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(entry: LogEntry): string {
    if (this.logFormat === 'json') {
      return JSON.stringify(entry);
    }

    // Pretty format for development
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const contextStr = entry.context
      ? `\n  ${JSON.stringify(entry.context, null, 2).split('\n').join('\n  ')}`
      : '';
    const errorStr = entry.error
      ? `\n  Error: ${entry.error.message}${entry.error.stack ? `\n  ${entry.error.stack}` : ''}`
      : '';

    return `${timestamp} [${level}] ${entry.message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        message: error.message,
        // Only include stack trace in debug mode to reduce noise
        stack: this.logLevel === 'debug' ? error.stack : undefined,
        code: (error as any).code,
      };
    }

    // Write to stderr only (never stdout)
    process.stderr.write(this.formatMessage(entry) + '\n');
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  public error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }

  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public setFormat(format: 'json' | 'pretty'): void {
    this.logFormat = format;
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
