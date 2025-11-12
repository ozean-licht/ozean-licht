/**
 * Error Handler Module
 *
 * Provides error categorization, enrichment, and severity assessment for ADW workflows.
 * This module is the foundation of the error handling system, enabling intelligent
 * decisions about retry strategies, manual intervention, and error notifications.
 *
 * Key Features:
 * - Error type classification (transient vs permanent)
 * - Error context enrichment (add workflow ID, phase, timestamp)
 * - Error logging with structured data
 * - Manual intervention trigger detection
 * - Error notification preparation
 * - Severity level determination
 *
 * Error Philosophy:
 * - Conservative approach: default to permanent for unknown errors (fail safe)
 * - Transient errors: temporary issues that may resolve on retry (network, rate limit, timeout)
 * - Permanent errors: structural issues that won't resolve on retry (validation, auth, not found)
 * - Unknown errors: treated as permanent to prevent infinite retry loops
 *
 * @module modules/adw/error-handler
 */

import { logger } from '../../config/logger.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Error category classification
 *
 * Categories determine whether an error should trigger automatic retry:
 * - TRANSIENT: Temporary issues, safe to retry (network, timeout, rate limit)
 * - PERMANENT: Structural issues, retrying won't help (validation, auth, not found)
 * - UNKNOWN: Unclassified errors, treated as permanent for safety
 */
export enum ErrorCategory {
  TRANSIENT = 'transient',
  PERMANENT = 'permanent',
  UNKNOWN = 'unknown',
}

/**
 * Error severity level
 *
 * Severity levels determine urgency of response and notification strategy:
 * - LOW: Non-critical, workflow can continue with degraded functionality
 * - MEDIUM: Phase failure, workflow stops but system remains operational
 * - HIGH: System error, requires attention but not immediate
 * - CRITICAL: Data corruption or system instability, immediate action needed
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Context information for error enrichment
 *
 * Provides additional context to understand error scope and impact
 */
export interface ErrorContext {
  /** Workflow identifier */
  adwId: string;
  /** Current workflow phase */
  phase: string;
  /** Operation being performed when error occurred */
  operation?: string;
  /** Issue number if applicable */
  issueNumber?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Enriched error with context and classification
 *
 * Contains original error plus all context needed for handling decisions
 */
export interface EnrichedError extends Error {
  /** Original error that was enriched */
  originalError: Error | any;
  /** Error category (transient/permanent/unknown) */
  category: ErrorCategory;
  /** Error severity level */
  severity: ErrorSeverity;
  /** Workflow context */
  context: ErrorContext;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Whether this error requires manual intervention */
  requiresIntervention: boolean;
  /** Formatted message for logging/notification */
  formattedMessage: string;
}

// ============================================================================
// Error Pattern Detection
// ============================================================================

/**
 * Patterns that indicate transient errors (safe to retry)
 */
const TRANSIENT_ERROR_PATTERNS = [
  // Network errors
  /ECONNREFUSED/i,
  /ECONNRESET/i,
  /ETIMEDOUT/i,
  /ENOTFOUND/i,
  /ENETUNREACH/i,
  /socket hang up/i,
  /network error/i,
  /connection.*(?:refused|reset|timeout)/i,

  // Rate limiting
  /rate limit/i,
  /too many requests/i,
  /429/,
  /quota exceeded/i,

  // Timeouts
  /timeout/i,
  /timed out/i,
  /time.*out/i,
  /request.*timeout/i,

  // Temporary service issues
  /service unavailable/i,
  /503/,
  /502/,
  /temporarily unavailable/i,
  /please try again/i,

  // Database connection issues
  /connection pool exhausted/i,
  /database connection failed/i,
  /too many connections/i,
];

/**
 * Patterns that indicate permanent errors (should not retry)
 */
const PERMANENT_ERROR_PATTERNS = [
  // Authentication/Authorization
  /unauthorized/i,
  /401/,
  /403/,
  /forbidden/i,
  /authentication.*failed/i,
  /invalid.*token/i,
  /permission denied/i,

  // Not found
  /not found/i,
  /404/,
  /does not exist/i,
  /no such/i,

  // Validation errors
  /validation.*failed/i,
  /invalid.*(?:input|parameter|argument|request)/i,
  /400/,
  /bad request/i,
  /malformed/i,

  // Configuration errors
  /configuration.*(?:error|invalid|missing)/i,
  /environment variable.*(?:missing|not set)/i,

  // Agent SDK specific
  /agent.*(?:failed|error)/i,
  /slash command.*(?:invalid|not found)/i,
];

/**
 * Patterns that indicate critical errors requiring immediate attention
 */
const CRITICAL_ERROR_PATTERNS = [
  /data corruption/i,
  /database.*corrupt/i,
  /fatal error/i,
  /system.*failure/i,
  /out of memory/i,
  /disk.*full/i,
  /cannot recover/i,
];

// ============================================================================
// Core Error Categorization
// ============================================================================

/**
 * Categorize an error based on type, message, and status code
 *
 * Uses pattern matching to determine if error is transient (retryable)
 * or permanent (not retryable). Defaults to PERMANENT for safety.
 *
 * @param error - Error to categorize (Error object or any)
 * @returns Error category (TRANSIENT, PERMANENT, or UNKNOWN)
 *
 * @example
 * ```typescript
 * const error = new Error('ECONNREFUSED: connection refused');
 * const category = categorizeError(error);
 * // Returns: ErrorCategory.TRANSIENT
 * ```
 */
export function categorizeError(error: Error | any): ErrorCategory {
  // Extract error message and status code
  const message = error?.message || String(error);
  const statusCode = error?.statusCode || error?.status;

  // Check for transient patterns first
  for (const pattern of TRANSIENT_ERROR_PATTERNS) {
    if (pattern.test(message) || (statusCode && pattern.test(String(statusCode)))) {
      return ErrorCategory.TRANSIENT;
    }
  }

  // Check for permanent patterns
  for (const pattern of PERMANENT_ERROR_PATTERNS) {
    if (pattern.test(message) || (statusCode && pattern.test(String(statusCode)))) {
      return ErrorCategory.PERMANENT;
    }
  }

  // Default to PERMANENT for safety (prevent infinite retry loops)
  return ErrorCategory.PERMANENT;
}

/**
 * Determine if an error is retryable
 *
 * Convenience function that returns true only for transient errors.
 * All other error categories (PERMANENT, UNKNOWN) return false.
 *
 * @param error - Error to check
 * @returns True if error is retryable (transient), false otherwise
 *
 * @example
 * ```typescript
 * if (isRetryable(error)) {
 *   // Retry the operation
 * } else {
 *   // Fail permanently
 * }
 * ```
 */
export function isRetryable(error: Error | any): boolean {
  return categorizeError(error) === ErrorCategory.TRANSIENT;
}

// ============================================================================
// Error Severity Assessment
// ============================================================================

/**
 * Determine error severity level based on error type and phase
 *
 * Severity affects notification urgency and escalation path:
 * - LOW: Logged but not notified
 * - MEDIUM: Logged and notified to standard channels
 * - HIGH: Logged, notified, and escalated
 * - CRITICAL: Immediate alerts to on-call team
 *
 * @param error - Error to assess
 * @param phase - Workflow phase where error occurred
 * @returns Error severity level
 *
 * @example
 * ```typescript
 * const severity = getErrorSeverity(error, 'plan');
 * if (severity === ErrorSeverity.CRITICAL) {
 *   // Send immediate alert
 * }
 * ```
 */
export function getErrorSeverity(error: Error | any, phase: string): ErrorSeverity {
  const message = error?.message || String(error);

  // Check for critical patterns first
  for (const pattern of CRITICAL_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return ErrorSeverity.CRITICAL;
    }
  }

  // Database errors in any phase are HIGH severity
  if (/database/i.test(message)) {
    return ErrorSeverity.HIGH;
  }

  // Ship phase errors are HIGH severity (production impact)
  if (phase === 'ship' || phase === 'shipped') {
    return ErrorSeverity.HIGH;
  }

  // Authentication/authorization errors are HIGH severity
  if (/(?:unauthorized|forbidden|401|403)/i.test(message)) {
    return ErrorSeverity.HIGH;
  }

  // Agent SDK errors depend on phase
  if (/agent/i.test(message)) {
    // Early phases (plan, build) are MEDIUM
    if (phase === 'plan' || phase === 'planned' || phase === 'build' || phase === 'built') {
      return ErrorSeverity.MEDIUM;
    }
    // Later phases (test, review, document) are HIGH
    return ErrorSeverity.HIGH;
  }

  // Default phase failures are MEDIUM severity
  return ErrorSeverity.MEDIUM;
}

// ============================================================================
// Error Enrichment
// ============================================================================

/**
 * Enrich an error with context, classification, and metadata
 *
 * Transforms a basic Error into an EnrichedError with all information
 * needed for intelligent error handling decisions.
 *
 * @param error - Original error to enrich
 * @param context - Workflow context information
 * @returns Enriched error with full context and classification
 *
 * @example
 * ```typescript
 * try {
 *   await executeOperation();
 * } catch (error) {
 *   const enriched = enrichError(error, {
 *     adwId: 'abc12345',
 *     phase: 'build',
 *     operation: 'agent-execution'
 *   });
 *   logger.error('Operation failed:', enriched);
 * }
 * ```
 */
export function enrichError(error: Error | any, context: ErrorContext): EnrichedError {
  // Categorize error
  const category = categorizeError(error);

  // Determine severity
  const severity = getErrorSeverity(error, context.phase);

  // Check if manual intervention required
  const requiresIntervention = requiresManualIntervention({
    originalError: error,
    category,
    severity,
    context,
    timestamp: new Date(),
  } as EnrichedError);

  // Format message
  const formattedMessage = formatErrorMessage({
    originalError: error,
    category,
    severity,
    context,
    timestamp: new Date(),
    requiresIntervention,
  } as EnrichedError);

  // Create enriched error object
  const enriched = new Error(formattedMessage) as EnrichedError;
  enriched.name = 'EnrichedError';
  enriched.originalError = error;
  enriched.category = category;
  enriched.severity = severity;
  enriched.context = context;
  enriched.timestamp = new Date();
  enriched.requiresIntervention = requiresIntervention;
  enriched.formattedMessage = formattedMessage;

  // Preserve stack trace from original error
  if (error instanceof Error && error.stack) {
    enriched.stack = error.stack;
  }

  return enriched;
}

// ============================================================================
// Manual Intervention Detection
// ============================================================================

/**
 * Check if an error requires manual intervention
 *
 * Manual intervention is required when:
 * - Error is CRITICAL severity
 * - Error is HIGH severity and permanent
 * - Error is authentication/authorization related
 * - Error is a configuration issue
 *
 * @param error - Enriched error to check
 * @returns True if manual intervention needed, false otherwise
 *
 * @example
 * ```typescript
 * if (requiresManualIntervention(enrichedError)) {
 *   await notifyOnCall(enrichedError);
 *   await pauseWorkflow(enrichedError.context.adwId);
 * }
 * ```
 */
export function requiresManualIntervention(error: EnrichedError): boolean {
  // CRITICAL errors always require intervention
  if (error.severity === ErrorSeverity.CRITICAL) {
    return true;
  }

  // HIGH severity permanent errors require intervention
  if (error.severity === ErrorSeverity.HIGH && error.category === ErrorCategory.PERMANENT) {
    return true;
  }

  const message = error.originalError?.message || String(error.originalError);

  // Authentication/authorization errors require intervention
  if (/(?:unauthorized|forbidden|401|403|authentication|permission)/i.test(message)) {
    return true;
  }

  // Configuration errors require intervention
  if (/configuration.*(?:error|invalid|missing)/i.test(message)) {
    return true;
  }

  // Environment variable issues require intervention
  if (/environment variable.*(?:missing|not set)/i.test(message)) {
    return true;
  }

  return false;
}

// ============================================================================
// Error Formatting
// ============================================================================

/**
 * Format error message for logging and notifications
 *
 * Creates a structured, human-readable error message that includes:
 * - Error category and severity
 * - Workflow context (ADW ID, phase)
 * - Original error message
 * - Timestamp
 * - Intervention status
 *
 * @param error - Enriched error to format
 * @returns Formatted error message string
 *
 * @example
 * ```typescript
 * const message = formatErrorMessage(enrichedError);
 * // Returns: "[TRANSIENT/MEDIUM] ADW abc12345 (build): Connection timeout"
 * ```
 */
export function formatErrorMessage(error: EnrichedError): string {
  const { category, severity, context, originalError, requiresIntervention } = error;

  // Extract original message
  const originalMessage = originalError?.message || String(originalError);

  // Build formatted message parts
  const parts = [
    `[${category.toUpperCase()}/${severity.toUpperCase()}]`,
    `ADW ${context.adwId}`,
    `(${context.phase})`,
  ];

  // Add operation if present
  if (context.operation) {
    parts.push(`[${context.operation}]`);
  }

  // Add original message
  parts.push(`${originalMessage}`);

  // Add intervention flag if needed
  if (requiresIntervention) {
    parts.push('[INTERVENTION REQUIRED]');
  }

  return parts.join(' ');
}

// ============================================================================
// Structured Logging
// ============================================================================

/**
 * Log an enriched error with full structured data
 *
 * Uses structured logging to ensure all error context is searchable
 * and analyzable in log aggregation systems.
 *
 * @param error - Enriched error to log
 * @param additionalContext - Optional additional context to include
 *
 * @example
 * ```typescript
 * try {
 *   await operation();
 * } catch (error) {
 *   const enriched = enrichError(error, context);
 *   logEnrichedError(enriched, { attemptNumber: 3 });
 * }
 * ```
 */
export function logEnrichedError(
  error: EnrichedError,
  additionalContext?: Record<string, unknown>
): void {
  const logData = {
    errorCategory: error.category,
    errorSeverity: error.severity,
    adwId: error.context.adwId,
    phase: error.context.phase,
    operation: error.context.operation,
    issueNumber: error.context.issueNumber,
    requiresIntervention: error.requiresIntervention,
    timestamp: error.timestamp.toISOString(),
    originalError: error.originalError?.message || String(error.originalError),
    stack: error.stack,
    ...error.context.metadata,
    ...additionalContext,
  };

  // Log at appropriate level based on severity
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      logger.fatal(logData, error.formattedMessage);
      break;
    case ErrorSeverity.HIGH:
      logger.error(logData, error.formattedMessage);
      break;
    case ErrorSeverity.MEDIUM:
      logger.warn(logData, error.formattedMessage);
      break;
    case ErrorSeverity.LOW:
      logger.info(logData, error.formattedMessage);
      break;
    default:
      logger.error(logData, error.formattedMessage);
  }
}

// ============================================================================
// Error Analysis
// ============================================================================

/**
 * Extract error details for analysis and reporting
 *
 * Provides a plain object representation of an enriched error
 * suitable for database storage, API responses, or external systems.
 *
 * @param error - Enriched error to extract details from
 * @returns Plain object with error details
 *
 * @example
 * ```typescript
 * const details = extractErrorDetails(enrichedError);
 * await saveErrorToDatabase(details);
 * ```
 */
export function extractErrorDetails(error: EnrichedError): Record<string, unknown> {
  return {
    category: error.category,
    severity: error.severity,
    requiresIntervention: error.requiresIntervention,
    timestamp: error.timestamp.toISOString(),
    message: error.formattedMessage,
    originalMessage: error.originalError?.message || String(error.originalError),
    context: {
      adwId: error.context.adwId,
      phase: error.context.phase,
      operation: error.context.operation,
      issueNumber: error.context.issueNumber,
      metadata: error.context.metadata,
    },
    stack: error.stack,
  };
}

/**
 * Check if error should trigger alert/notification
 *
 * Determines whether an error warrants sending an alert to external
 * notification systems (Slack, email, PagerDuty, etc.).
 *
 * Alerts are triggered for:
 * - CRITICAL severity errors (always)
 * - HIGH severity errors (always)
 * - Errors requiring manual intervention (always)
 * - MEDIUM severity errors in production (if configured)
 *
 * @param error - Enriched error to check
 * @param env - Environment name (development/production)
 * @returns True if alert should be sent, false otherwise
 *
 * @example
 * ```typescript
 * if (shouldAlert(enrichedError, 'production')) {
 *   await sendAlert(enrichedError);
 * }
 * ```
 */
export function shouldAlert(error: EnrichedError, env: string = 'development'): boolean {
  // Always alert for critical errors
  if (error.severity === ErrorSeverity.CRITICAL) {
    return true;
  }

  // Always alert for high severity errors
  if (error.severity === ErrorSeverity.HIGH) {
    return true;
  }

  // Always alert if manual intervention required
  if (error.requiresIntervention) {
    return true;
  }

  // Alert for medium severity in production
  if (env === 'production' && error.severity === ErrorSeverity.MEDIUM) {
    return true;
  }

  return false;
}
