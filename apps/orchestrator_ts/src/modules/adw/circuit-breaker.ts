/**
 * Circuit Breaker Module
 *
 * Implements the circuit breaker pattern to prevent cascade failures and protect
 * services from being overwhelmed during outages. The circuit breaker monitors
 * failures and automatically stops making requests when a service is unhealthy,
 * allowing it to recover.
 *
 * Key Features:
 * - Three-state circuit breaker (CLOSED, OPEN, HALF_OPEN)
 * - Configurable failure and success thresholds
 * - Automatic state transitions based on health
 * - Per-service circuit breakers with independent state
 * - Recovery testing with half-open state
 * - Metrics and statistics tracking
 *
 * Circuit Breaker States:
 * - CLOSED: Normal operation, all requests pass through
 * - OPEN: Failing fast, no requests attempted (circuit "tripped")
 * - HALF_OPEN: Testing recovery, limited requests allowed
 *
 * State Transitions:
 * - CLOSED → OPEN: After N consecutive failures (failure threshold)
 * - OPEN → HALF_OPEN: After timeout period expires
 * - HALF_OPEN → CLOSED: After N consecutive successes (success threshold)
 * - HALF_OPEN → OPEN: On any failure during testing
 *
 * @module modules/adw/circuit-breaker
 */

import { logger } from '../../config/logger.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Circuit breaker state
 *
 * The three states of a circuit breaker following the classic pattern.
 */
export enum CircuitState {
  /**
   * CLOSED: Normal operation
   * - All requests pass through
   * - Failures are counted
   * - Opens if failure threshold exceeded
   */
  CLOSED = 'closed',

  /**
   * OPEN: Failing fast
   * - No requests attempted
   * - All requests fail immediately with CircuitOpenError
   * - After timeout, transitions to HALF_OPEN
   */
  OPEN = 'open',

  /**
   * HALF_OPEN: Testing recovery
   * - Limited requests allowed (halfOpenMaxAttempts)
   * - Success counts toward closing
   * - Any failure immediately opens circuit again
   */
  HALF_OPEN = 'half_open',
}

/**
 * Circuit breaker configuration
 *
 * Defines thresholds and timeouts for circuit breaker behavior.
 */
export interface CircuitBreakerConfig {
  /** Unique name for this circuit breaker (e.g., 'agent-sdk', 'github-api') */
  name: string;

  /** Number of consecutive failures before opening circuit (default: 5) */
  failureThreshold: number;

  /** Number of consecutive successes to close from half-open (default: 2) */
  successThreshold: number;

  /** Milliseconds to wait before attempting half-open (default: 60000) */
  timeout: number;

  /** Maximum requests to attempt in half-open state (default: 3) */
  halfOpenMaxAttempts: number;
}

/**
 * Circuit breaker statistics
 *
 * Provides insights into circuit breaker health and behavior.
 */
export interface CircuitBreakerStats {
  /** Current state */
  state: CircuitState;

  /** Total successful requests */
  totalSuccesses: number;

  /** Total failed requests */
  totalFailures: number;

  /** Current consecutive failures */
  consecutiveFailures: number;

  /** Current consecutive successes */
  consecutiveSuccesses: number;

  /** Timestamp when circuit was last opened */
  lastOpenedAt: Date | null;

  /** Timestamp when circuit was last closed */
  lastClosedAt: Date | null;

  /** Total times circuit has opened */
  timesOpened: number;

  /** Timestamp when state last changed */
  lastStateChange: Date;
}

/**
 * Circuit breaker error
 *
 * Thrown when circuit is OPEN and request is rejected.
 */
export class CircuitOpenError extends Error {
  constructor(
    public readonly circuitName: string,
    public readonly reopenAt: Date
  ) {
    super(`Circuit breaker '${circuitName}' is OPEN. Will attempt recovery at ${reopenAt.toISOString()}`);
    this.name = 'CircuitOpenError';
  }
}

// ============================================================================
// Circuit Breaker Implementation
// ============================================================================

/**
 * Circuit Breaker class
 *
 * Implements the circuit breaker pattern with three states and automatic
 * state transitions based on failure/success patterns.
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private consecutiveFailures = 0;
  private consecutiveSuccesses = 0;
  private totalSuccesses = 0;
  private totalFailures = 0;
  private lastOpenedAt: Date | null = null;
  private lastClosedAt: Date | null = null;
  private timesOpened = 0;
  private lastStateChange: Date = new Date();
  private halfOpenAttempts = 0;
  private openTimeout: NodeJS.Timeout | null = null;

  constructor(private readonly config: CircuitBreakerConfig) {
    logger.info(
      {
        name: config.name,
        failureThreshold: config.failureThreshold,
        successThreshold: config.successThreshold,
        timeout: config.timeout,
      },
      'Circuit breaker initialized'
    );
  }

  /**
   * Execute an operation with circuit breaker protection
   *
   * Wraps an async operation with circuit breaker logic:
   * - CLOSED: Execute operation, track failures
   * - OPEN: Reject immediately with CircuitOpenError
   * - HALF_OPEN: Execute with limited attempts, test recovery
   *
   * @param fn - Async function to execute
   * @returns Promise resolving to function result
   * @throws CircuitOpenError if circuit is OPEN
   * @throws Original error if operation fails
   *
   * @example
   * ```typescript
   * const breaker = new CircuitBreaker({ name: 'api', failureThreshold: 3 });
   *
   * try {
   *   const result = await breaker.execute(async () => {
   *     return await fetch('https://api.example.com');
   *   });
   * } catch (error) {
   *   if (error instanceof CircuitOpenError) {
   *     // Circuit is open, service is down
   *   } else {
   *     // Operation failed
   *   }
   * }
   * ```
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check current state
    switch (this.state) {
      case CircuitState.CLOSED:
        return this.executeInClosedState(fn);

      case CircuitState.OPEN:
        return this.executeInOpenState();

      case CircuitState.HALF_OPEN:
        return this.executeInHalfOpenState(fn);

      default:
        throw new Error(`Unknown circuit state: ${this.state}`);
    }
  }

  /**
   * Execute in CLOSED state
   *
   * Normal operation - execute function and track failures.
   */
  private async executeInClosedState<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Execute in OPEN state
   *
   * Fail fast - reject immediately without executing function.
   */
  private async executeInOpenState<T>(): Promise<T> {
    // Calculate when circuit will attempt recovery
    const reopenAt = this.lastOpenedAt
      ? new Date(this.lastOpenedAt.getTime() + this.config.timeout)
      : new Date();

    logger.debug(
      {
        circuit: this.config.name,
        state: this.state,
        reopenAt: reopenAt.toISOString(),
      },
      'Circuit breaker is OPEN, rejecting request'
    );

    throw new CircuitOpenError(this.config.name, reopenAt);
  }

  /**
   * Execute in HALF_OPEN state
   *
   * Testing recovery - allow limited requests to test if service recovered.
   */
  private async executeInHalfOpenState<T>(fn: () => Promise<T>): Promise<T> {
    // Check if we've exceeded half-open attempts
    if (this.halfOpenAttempts >= this.config.halfOpenMaxAttempts) {
      logger.debug(
        {
          circuit: this.config.name,
          halfOpenAttempts: this.halfOpenAttempts,
          maxAttempts: this.config.halfOpenMaxAttempts,
        },
        'Half-open attempts exhausted, opening circuit'
      );
      this.transitionToOpen();
      return this.executeInOpenState();
    }

    this.halfOpenAttempts++;

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Record successful operation
   *
   * Increments success counters and may transition circuit to CLOSED.
   */
  private recordSuccess(): void {
    this.consecutiveSuccesses++;
    this.consecutiveFailures = 0;
    this.totalSuccesses++;

    logger.debug(
      {
        circuit: this.config.name,
        state: this.state,
        consecutiveSuccesses: this.consecutiveSuccesses,
      },
      'Operation succeeded'
    );

    // In HALF_OPEN state, check if we should close
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        this.transitionToClosed();
      }
    }
  }

  /**
   * Record failed operation
   *
   * Increments failure counters and may transition circuit to OPEN.
   */
  private recordFailure(): void {
    this.consecutiveFailures++;
    this.consecutiveSuccesses = 0;
    this.totalFailures++;

    logger.warn(
      {
        circuit: this.config.name,
        state: this.state,
        consecutiveFailures: this.consecutiveFailures,
        failureThreshold: this.config.failureThreshold,
      },
      'Operation failed'
    );

    // In CLOSED state, check if we should open
    if (this.state === CircuitState.CLOSED) {
      if (this.consecutiveFailures >= this.config.failureThreshold) {
        this.transitionToOpen();
      }
    }

    // In HALF_OPEN state, any failure opens circuit immediately
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToOpen();
    }
  }

  /**
   * Transition to OPEN state
   *
   * Circuit trips open after too many failures. Schedule transition to
   * HALF_OPEN after timeout.
   */
  private transitionToOpen(): void {
    const previousState = this.state;
    this.state = CircuitState.OPEN;
    this.lastOpenedAt = new Date();
    this.lastStateChange = new Date();
    this.timesOpened++;
    this.halfOpenAttempts = 0;

    logger.warn(
      {
        circuit: this.config.name,
        previousState,
        newState: this.state,
        consecutiveFailures: this.consecutiveFailures,
        timeout: this.config.timeout,
      },
      'Circuit breaker transitioned to OPEN'
    );

    // Clear any existing timeout
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
    }

    // Schedule transition to HALF_OPEN
    this.openTimeout = setTimeout(() => {
      this.transitionToHalfOpen();
    }, this.config.timeout);
  }

  /**
   * Transition to HALF_OPEN state
   *
   * After timeout expires, attempt recovery by allowing limited requests.
   */
  private transitionToHalfOpen(): void {
    const previousState = this.state;
    this.state = CircuitState.HALF_OPEN;
    this.lastStateChange = new Date();
    this.halfOpenAttempts = 0;
    this.consecutiveSuccesses = 0;
    this.consecutiveFailures = 0;

    logger.info(
      {
        circuit: this.config.name,
        previousState,
        newState: this.state,
        maxAttempts: this.config.halfOpenMaxAttempts,
      },
      'Circuit breaker transitioned to HALF_OPEN, testing recovery'
    );
  }

  /**
   * Transition to CLOSED state
   *
   * Service has recovered, resume normal operation.
   */
  private transitionToClosed(): void {
    const previousState = this.state;
    this.state = CircuitState.CLOSED;
    this.lastClosedAt = new Date();
    this.lastStateChange = new Date();
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.halfOpenAttempts = 0;

    logger.info(
      {
        circuit: this.config.name,
        previousState,
        newState: this.state,
        successesNeeded: this.config.successThreshold,
      },
      'Circuit breaker transitioned to CLOSED, service recovered'
    );

    // Clear timeout if exists
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  }

  /**
   * Get current circuit state
   *
   * @returns Current state (CLOSED, OPEN, or HALF_OPEN)
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get circuit breaker statistics
   *
   * @returns Statistics object with counts and timestamps
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      totalSuccesses: this.totalSuccesses,
      totalFailures: this.totalFailures,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses,
      lastOpenedAt: this.lastOpenedAt,
      lastClosedAt: this.lastClosedAt,
      timesOpened: this.timesOpened,
      lastStateChange: this.lastStateChange,
    };
  }

  /**
   * Reset circuit breaker to initial state
   *
   * Useful for testing or manual recovery.
   */
  reset(): void {
    logger.info({ circuit: this.config.name }, 'Resetting circuit breaker');

    this.state = CircuitState.CLOSED;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.halfOpenAttempts = 0;
    this.lastStateChange = new Date();

    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  }

  /**
   * Force circuit to OPEN state
   *
   * Useful for manual intervention or testing.
   */
  forceOpen(): void {
    logger.warn({ circuit: this.config.name }, 'Manually forcing circuit OPEN');
    this.transitionToOpen();
  }

  /**
   * Force circuit to CLOSED state
   *
   * Useful for manual recovery or testing.
   */
  forceClose(): void {
    logger.warn({ circuit: this.config.name }, 'Manually forcing circuit CLOSED');
    this.transitionToClosed();
  }
}

// ============================================================================
// Circuit Breaker Registry
// ============================================================================

/**
 * Global registry of circuit breakers
 *
 * Maintains singleton instances for each service to ensure consistent
 * state across the application.
 */
class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Get or create circuit breaker by name
   *
   * @param name - Circuit breaker name
   * @param config - Optional configuration (used only if creating new breaker)
   * @returns Circuit breaker instance
   */
  getOrCreate(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(name)) {
      const fullConfig: CircuitBreakerConfig = {
        name,
        failureThreshold: config?.failureThreshold ?? 5,
        successThreshold: config?.successThreshold ?? 2,
        timeout: config?.timeout ?? 60000,
        halfOpenMaxAttempts: config?.halfOpenMaxAttempts ?? 3,
      };

      this.breakers.set(name, new CircuitBreaker(fullConfig));
    }

    return this.breakers.get(name)!;
  }

  /**
   * Get circuit breaker by name (if exists)
   *
   * @param name - Circuit breaker name
   * @returns Circuit breaker instance or undefined
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get all circuit breaker names
   *
   * @returns Array of circuit breaker names
   */
  getNames(): string[] {
    return Array.from(this.breakers.keys());
  }

  /**
   * Get statistics for all circuit breakers
   *
   * @returns Map of circuit breaker names to statistics
   */
  getAllStats(): Map<string, CircuitBreakerStats> {
    const stats = new Map<string, CircuitBreakerStats>();
    for (const [name, breaker] of this.breakers.entries()) {
      stats.set(name, breaker.getStats());
    }
    return stats;
  }
}

// Singleton registry instance
const registry = new CircuitBreakerRegistry();

// ============================================================================
// Predefined Circuit Breakers
// ============================================================================

/**
 * Predefined circuit breakers for common services
 *
 * These are created on first access and maintain state throughout
 * the application lifecycle.
 */
export const CIRCUIT_BREAKERS = {
  /**
   * Agent SDK circuit breaker
   * - Lower threshold (3) as agent operations are expensive
   * - Longer timeout (120s) to allow recovery time
   */
  get agentSdk(): CircuitBreaker {
    return registry.getOrCreate('agent-sdk', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 120000,
      halfOpenMaxAttempts: 2,
    });
  },

  /**
   * GitHub API circuit breaker
   * - Higher threshold (5) for network resilience
   * - Standard timeout (60s)
   */
  get github(): CircuitBreaker {
    return registry.getOrCreate('github-api', {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000,
      halfOpenMaxAttempts: 3,
    });
  },

  /**
   * Database circuit breaker
   * - Lower threshold (3) as database is critical
   * - Shorter timeout (30s) for faster recovery
   */
  get database(): CircuitBreaker {
    return registry.getOrCreate('postgresql', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30000,
      halfOpenMaxAttempts: 2,
    });
  },

  /**
   * MCP Gateway circuit breaker
   * - Standard threshold (5)
   * - Standard timeout (60s)
   */
  get mcpGateway(): CircuitBreaker {
    return registry.getOrCreate('mcp-gateway', {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000,
      halfOpenMaxAttempts: 3,
    });
  },

  /**
   * R2 Storage circuit breaker
   * - Higher threshold (5) for storage operations
   * - Longer timeout (90s) for large uploads
   */
  get r2Storage(): CircuitBreaker {
    return registry.getOrCreate('r2-storage', {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 90000,
      halfOpenMaxAttempts: 3,
    });
  },
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Get circuit breaker by name
 *
 * Returns existing circuit breaker or creates new one with default config.
 *
 * @param name - Circuit breaker name
 * @param config - Optional configuration for new circuit breaker
 * @returns Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = getCircuitBreaker('my-api');
 * const result = await breaker.execute(async () => {
 *   return await fetch('https://my-api.com');
 * });
 * ```
 */
export function getCircuitBreaker(
  name: string,
  config?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  return registry.getOrCreate(name, config);
}

/**
 * Execute operation with circuit breaker protection
 *
 * Convenience function that gets/creates circuit breaker and executes operation.
 *
 * @param operation - Async function to execute
 * @param breakerName - Circuit breaker name
 * @param config - Optional circuit breaker configuration
 * @returns Promise resolving to operation result
 * @throws CircuitOpenError if circuit is OPEN
 * @throws Original error if operation fails
 *
 * @example
 * ```typescript
 * const result = await withCircuitBreaker(
 *   async () => await callApi(),
 *   'my-api'
 * );
 * ```
 */
export async function withCircuitBreaker<T>(
  operation: () => Promise<T>,
  breakerName: string,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  const breaker = getCircuitBreaker(breakerName, config);
  return breaker.execute(operation);
}

/**
 * Get all circuit breaker statistics
 *
 * Returns statistics for all registered circuit breakers.
 * Useful for monitoring dashboards and health checks.
 *
 * @returns Map of circuit breaker names to statistics
 *
 * @example
 * ```typescript
 * const stats = getAllCircuitBreakerStats();
 * for (const [name, stat] of stats.entries()) {
 *   console.log(`${name}: ${stat.state} (${stat.totalFailures} failures)`);
 * }
 * ```
 */
export function getAllCircuitBreakerStats(): Map<string, CircuitBreakerStats> {
  return registry.getAllStats();
}
