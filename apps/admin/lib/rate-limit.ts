/**
 * Simple in-memory rate limiter for API endpoints
 *
 * Tracks requests per identifier (typically user ID) and enforces limits
 * Uses a sliding window approach with Map-based storage
 *
 * IMPORTANT: This is a basic in-memory rate limiter suitable for single-server deployments.
 * For production multi-server deployments, use Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private interval: number; // milliseconds
  private maxRequests: number;

  constructor(interval: number, maxRequests: number) {
    this.interval = interval;
    this.maxRequests = maxRequests;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if identifier has exceeded rate limit
   * @param identifier - Unique identifier (user ID, IP, etc.)
   * @returns true if rate limit exceeded, false if allowed
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.interval,
      });
      return false;
    }

    // Within window, check count
    if (entry.count >= this.maxRequests) {
      return true; // Rate limited
    }

    // Increment count
    entry.count++;
    return false;
  }

  /**
   * Get remaining requests for identifier
   * @param identifier - Unique identifier
   * @returns Number of requests remaining in current window
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetAt) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get time until rate limit reset
   * @param identifier - Unique identifier
   * @returns Milliseconds until reset, or 0 if not rate limited
   */
  getResetTime(identifier: string): number {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetAt) {
      return 0;
    }

    return entry.resetAt - now;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.requests.forEach((entry, identifier) => {
      if (now > entry.resetAt) {
        toDelete.push(identifier);
      }
    });

    toDelete.forEach((identifier) => {
      this.requests.delete(identifier);
    });
  }

  /**
   * Reset rate limit for identifier (for testing)
   * @param identifier - Unique identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Create rate limiter instances for different endpoints

/**
 * Message creation rate limiter: 30 messages per minute per user
 */
export const messageRateLimiter = new RateLimiter(60 * 1000, 30);

/**
 * Typing indicator rate limiter: 60 updates per minute per user
 */
export const typingRateLimiter = new RateLimiter(60 * 1000, 60);

/**
 * Helper function to check rate limit and return appropriate response info
 * @param limiter - RateLimiter instance
 * @param identifier - User ID or other identifier
 * @returns Object with isLimited flag and reset time
 */
export function checkRateLimit(
  limiter: RateLimiter,
  identifier: string
): {
  isLimited: boolean;
  remaining: number;
  resetInMs: number;
} {
  const isLimited = limiter.isRateLimited(identifier);
  const remaining = limiter.getRemaining(identifier);
  const resetInMs = limiter.getResetTime(identifier);

  return { isLimited, remaining, resetInMs };
}
