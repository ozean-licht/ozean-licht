/**
 * Retry Strategy Module
 *
 * Implements exponential backoff retry logic with jitter for resilient error handling.
 * This module provides configurable retry strategies for different operation types,
 * helping the system gracefully handle transient failures.
 *
 * Key Features:
 * - Exponential backoff calculation with configurable multiplier
 * - Jitter to prevent thundering herd problem
 * - Per-operation timeout configuration
 * - Retry budget tracking (circuit breaker integration)
 * - Preset configurations for common operations
 * - Custom retry condition support
 *
 * Retry Philosophy:
 * - Fast initial retry for quick recovery
 * - Exponential backoff to reduce load on failing systems
 * - Jitter to distribute retry attempts across time
 * - Retry budget to prevent cascade failures
 * - Maximum delay cap to prevent indefinite waits
 *
 * @module modules/adw/retry-strategy
 */

import { logger } from '../../config/logger.js';
import { categorizeError, ErrorCategory, enrichError, logEnrichedError } from './error-handler.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Retry configuration
 *
 * Defines retry behavior for an operation including attempt limits,
 * backoff parameters, and timeout settings.
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts: number;

  /** Initial delay in milliseconds before first retry (default: 1000) */
  initialDelayMs: number;

  /** Maximum delay in milliseconds between retries (default: 30000) */
  maxDelayMs: number;

  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier: number;

  /** Random jitter in milliseconds to add/subtract (default: 500) */
  jitterMs: number;

  /** Per-attempt timeout in milliseconds (optional) */
  timeout?: number;

  /** Which error categories should trigger retry (default: [TRANSIENT]) */
  retryableErrors?: ErrorCategory[];
}

/**
 * Retry attempt result
 *
 * Contains information about a single retry attempt
 */
export interface RetryAttempt {
  /** Attempt number (1-indexed) */
  attemptNumber: number;

  /** Delay before this attempt in milliseconds */
  delayMs: number;

  /** Whether this attempt succeeded */
  success: boolean;

  /** Error if attempt failed */
  error?: Error;

  /** Timestamp of attempt */
  timestamp: Date;
}

/**
 * Retry execution result
 *
 * Contains the final result after all retry attempts
 */
export interface RetryResult<T> {
  /** Whether operation ultimately succeeded */
  success: boolean;

  /** Result value if successful */
  value?: T;

  /** Final error if all attempts failed */
  error?: Error;

  /** Total number of attempts made */
  totalAttempts: number;

  /** History of all retry attempts */
  attempts: RetryAttempt[];

  /** Total time spent including delays (milliseconds) */
  totalTimeMs: number;
}

// ============================================================================
// Preset Retry Configurations
// ============================================================================

/**
 * Preset retry configurations for common operation types
 *
 * These presets are tuned for specific services and their characteristics:
 * - Agent SDK: Longer delays due to compute-intensive operations
 * - GitHub API: More attempts with shorter delays for network resilience
 * - Database: Quick retries for connection pool recovery
 * - Worktree: Minimal retries for filesystem operations
 */
export const RETRY_CONFIGS: Record<string, RetryConfig> = {
  /**
   * Agent SDK operations (Claude Code execution)
   * - Longer delays due to compute time
   * - Fewer attempts (3) as operations are expensive
   */
  agent: {
    maxAttempts: 3,
    initialDelayMs: 2000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    jitterMs: 1000,
    timeout: 600000, // 10 minutes per attempt
    retryableErrors: [ErrorCategory.TRANSIENT],
  },

  /**
   * GitHub API operations
   * - More attempts (5) for network resilience
   * - Shorter delays for faster recovery
   */
  github: {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 15000,
    backoffMultiplier: 2,
    jitterMs: 500,
    timeout: 30000, // 30 seconds per attempt
    retryableErrors: [ErrorCategory.TRANSIENT],
  },

  /**
   * Database operations
   * - Quick retries (3) for connection pool recovery
   * - Short delays for fast recovery
   */
  database: {
    maxAttempts: 3,
    initialDelayMs: 500,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
    jitterMs: 250,
    timeout: 10000, // 10 seconds per attempt
    retryableErrors: [ErrorCategory.TRANSIENT],
  },

  /**
   * Worktree operations (git filesystem)
   * - Minimal retries (2) as issues are usually permanent
   * - Short delays
   */
  worktree: {
    maxAttempts: 2,
    initialDelayMs: 1000,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
    jitterMs: 500,
    timeout: 30000, // 30 seconds per attempt
    retryableErrors: [ErrorCategory.TRANSIENT],
  },

  /**
   * Default configuration for unspecified operations
   * - Balanced settings suitable for most cases
   */
  default: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    jitterMs: 500,
    retryableErrors: [ErrorCategory.TRANSIENT],
  },
};

// ============================================================================
// Retry Budget Management
// ============================================================================

/**
 * Retry budget tracking
 *
 * Prevents excessive retries by tracking retry budget per operation type.
 * When retry budget is exhausted, no more retries are allowed until reset.
 * This integrates with circuit breaker pattern to prevent cascade failures.
 */
class RetryBudgetManager {
  private budgets: Map<string, number> = new Map();
  private readonly initialBudget = 100; // Initial budget per operation type
  private readonly resetInterval = 60000; // Reset budget every 60 seconds

  constructor() {
    // Reset budgets periodically
    setInterval(() => {
      this.resetAllBudgets();
    }, this.resetInterval);
  }

  /**
   * Get current retry budget for operation type
   */
  getBudget(operationType: string): number {
    return this.budgets.get(operationType) ?? this.initialBudget;
  }

  /**
   * Decrement retry budget
   */
  decrementBudget(operationType: string): void {
    const current = this.getBudget(operationType);
    this.budgets.set(operationType, Math.max(0, current - 1));

    if (current <= 10) {
      logger.warn(
        { operationType, remainingBudget: current - 1 },
        'Retry budget running low'
      );
    }
  }

  /**
   * Reset budget for specific operation type
   */
  resetBudget(operationType: string): void {
    this.budgets.set(operationType, this.initialBudget);
    logger.debug({ operationType }, 'Retry budget reset');
  }

  /**
   * Reset all budgets
   */
  private resetAllBudgets(): void {
    for (const operationType of this.budgets.keys()) {
      this.budgets.set(operationType, this.initialBudget);
    }
    logger.debug('All retry budgets reset');
  }

  /**
   * Check if retry budget is available
   */
  hasBudget(operationType: string): boolean {
    return this.getBudget(operationType) > 0;
  }
}

// Singleton instance
const retryBudgetManager = new RetryBudgetManager();

/**
 * Get current retry budget for operation type
 *
 * @param operationType - Type of operation (e.g., 'agent', 'github', 'database')
 * @returns Current retry budget (number of retries allowed)
 */
export function getRetryBudget(operationType: string): number {
  return retryBudgetManager.getBudget(operationType);
}

/**
 * Decrement retry budget for operation type
 *
 * @param operationType - Type of operation
 */
export function decrementRetryBudget(operationType: string): void {
  retryBudgetManager.decrementBudget(operationType);
}

/**
 * Reset retry budget for operation type
 *
 * @param operationType - Type of operation
 */
export function resetRetryBudget(operationType: string): void {
  retryBudgetManager.resetBudget(operationType);
}

// ============================================================================
// Backoff Calculation
// ============================================================================

/**
 * Calculate delay with exponential backoff and jitter
 *
 * Formula: min(maxDelay, initialDelay * (multiplier ^ (attempt - 1))) ± jitter
 *
 * Jitter is randomized to prevent thundering herd problem where many
 * clients retry at exactly the same time, overwhelming the recovering service.
 *
 * @param attempt - Current attempt number (1-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds before next retry
 *
 * @example
 * ```typescript
 * const config = RETRY_CONFIGS.github;
 * const delay1 = calculateDelay(1, config); // ~1000ms ± 500ms
 * const delay2 = calculateDelay(2, config); // ~2000ms ± 500ms
 * const delay3 = calculateDelay(3, config); // ~4000ms ± 500ms
 * ```
 */
export function calculateDelay(attempt: number, config: RetryConfig): number {
  // Calculate exponential backoff
  const exponentialDelay =
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);

  // Cap at maximum delay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);

  // Add random jitter (± jitterMs)
  const jitter = (Math.random() * 2 - 1) * config.jitterMs;
  const finalDelay = Math.max(0, cappedDelay + jitter);

  return Math.floor(finalDelay);
}

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Core Retry Logic
// ============================================================================

/**
 * Execute a function with automatic retry logic
 *
 * Retries the function on failure using exponential backoff with jitter.
 * Only retries errors that match the configured retryable error categories.
 * Respects retry budget to prevent excessive retries during outages.
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @param context - Context string for logging (e.g., 'agent-plan-abc123')
 * @returns Promise resolving to function result
 * @throws Last error if all retries exhausted
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   async () => await executeAgent(command),
 *   RETRY_CONFIGS.agent,
 *   'agent-plan-abc123'
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  context: string
): Promise<T> {
  const attempts: RetryAttempt[] = [];
  const startTime = Date.now();
  let lastError: Error | undefined;

  // Extract operation type from context for retry budget
  const operationType = context.split('-')[0] || 'default';

  logger.debug(
    {
      context,
      maxAttempts: config.maxAttempts,
      initialDelayMs: config.initialDelayMs,
      retryBudget: getRetryBudget(operationType),
    },
    'Starting operation with retry'
  );

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    // Check retry budget before attempting
    if (attempt > 1 && !retryBudgetManager.hasBudget(operationType)) {
      logger.warn(
        { context, attempt, operationType },
        'Retry budget exhausted, skipping retry'
      );
      break;
    }

    // Calculate delay for this attempt (0 for first attempt)
    const delayMs = attempt === 1 ? 0 : calculateDelay(attempt - 1, config);

    // Wait before retry (skip for first attempt)
    if (delayMs > 0) {
      logger.debug(
        { context, attempt, delayMs },
        `Waiting ${delayMs}ms before retry attempt ${attempt}`
      );
      await sleep(delayMs);
    }

    try {
      logger.debug({ context, attempt }, `Executing attempt ${attempt}`);

      // Execute with timeout if configured
      const result = config.timeout
        ? await executeWithTimeout(fn, config.timeout, context)
        : await fn();

      // Success! Record attempt and return
      attempts.push({
        attemptNumber: attempt,
        delayMs,
        success: true,
        timestamp: new Date(),
      });

      const totalTimeMs = Date.now() - startTime;

      logger.info(
        {
          context,
          attempt,
          totalAttempts: attempt,
          totalTimeMs,
          retriesNeeded: attempt - 1,
        },
        'Operation succeeded'
      );

      // Reset retry budget on success
      if (attempt > 1) {
        resetRetryBudget(operationType);
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Record failed attempt
      attempts.push({
        attemptNumber: attempt,
        delayMs,
        success: false,
        error: lastError,
        timestamp: new Date(),
      });

      // Categorize error to determine if retryable
      const category = categorizeError(lastError);
      const retryableCategories = config.retryableErrors ?? [ErrorCategory.TRANSIENT];
      const isRetryable = retryableCategories.includes(category);

      logger.warn(
        {
          context,
          attempt,
          maxAttempts: config.maxAttempts,
          errorCategory: category,
          isRetryable,
          errorMessage: lastError.message,
        },
        `Attempt ${attempt} failed`
      );

      // Check if we should retry
      const shouldRetry = isRetryable && attempt < config.maxAttempts;

      if (!shouldRetry) {
        if (!isRetryable) {
          logger.error(
            { context, attempt, errorCategory: category },
            'Error is not retryable, failing immediately'
          );
        } else {
          logger.error(
            { context, attempt, maxAttempts: config.maxAttempts },
            'Max retry attempts reached'
          );
        }
        break;
      }

      // Decrement retry budget before next attempt
      decrementRetryBudget(operationType);
    }
  }

  // All retries exhausted
  const totalTimeMs = Date.now() - startTime;

  logger.error(
    {
      context,
      totalAttempts: attempts.length,
      totalTimeMs,
      finalError: lastError?.message,
    },
    'Operation failed after all retry attempts'
  );

  throw lastError || new Error('Operation failed with unknown error');
}

/**
 * Execute function with custom retry condition
 *
 * Provides more control over retry logic by allowing custom retry decision.
 * Useful when retry decision depends on more than just error category.
 *
 * @param fn - Async function to execute
 * @param shouldRetry - Custom function to determine if retry should occur
 * @param config - Retry configuration
 * @returns Promise resolving to function result
 * @throws Last error if all retries exhausted
 *
 * @example
 * ```typescript
 * const result = await retryWithCondition(
 *   async () => await fetchData(),
 *   (error, attempt) => {
 *     // Custom retry logic
 *     return attempt < 5 && error.statusCode === 503;
 *   },
 *   RETRY_CONFIGS.default
 * );
 * ```
 */
export async function retryWithCondition<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error, attempt: number) => boolean,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt < config.maxAttempts) {
    attempt++;

    // Calculate delay (0 for first attempt)
    const delayMs = attempt === 1 ? 0 : calculateDelay(attempt - 1, config);

    if (delayMs > 0) {
      await sleep(delayMs);
    }

    try {
      return config.timeout
        ? await executeWithTimeout(fn, config.timeout, `retry-attempt-${attempt}`)
        : await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check custom retry condition
      if (!shouldRetry(lastError, attempt) || attempt >= config.maxAttempts) {
        throw lastError;
      }

      logger.debug(
        { attempt, maxAttempts: config.maxAttempts, error: lastError.message },
        'Retrying based on custom condition'
      );
    }
  }

  throw lastError || new Error('Operation failed with unknown error');
}

// ============================================================================
// Timeout Handling
// ============================================================================

/**
 * Execute function with timeout
 *
 * Wraps a function execution with a timeout. If the function doesn't
 * complete within the timeout, it throws a timeout error.
 *
 * @param fn - Async function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @param context - Context for logging
 * @returns Promise resolving to function result
 * @throws TimeoutError if execution exceeds timeout
 */
async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  context: string
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms: ${context}`)),
        timeoutMs
      )
    ),
  ]);
}

// ============================================================================
// Retry Result Utilities
// ============================================================================

/**
 * Create a detailed retry result
 *
 * Useful for operations that need to return detailed retry information
 * rather than throwing on failure.
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @param context - Context for logging
 * @returns Promise resolving to detailed retry result
 */
export async function withRetryResult<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  context: string
): Promise<RetryResult<T>> {
  const attempts: RetryAttempt[] = [];
  const startTime = Date.now();

  try {
    const value = await withRetry(fn, config, context);
    const totalTimeMs = Date.now() - startTime;

    return {
      success: true,
      value,
      totalAttempts: attempts.length,
      attempts,
      totalTimeMs,
    };
  } catch (error) {
    const totalTimeMs = Date.now() - startTime;

    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      totalAttempts: attempts.length,
      attempts,
      totalTimeMs,
    };
  }
}
