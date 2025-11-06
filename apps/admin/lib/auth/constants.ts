/**
 * Authentication Constants
 *
 * Centralized configuration for authentication system.
 * All time values, security parameters, and action types defined here.
 */

// Session configuration
export const SESSION_TTL_SECONDS = 86400; // 24 hours
export const SESSION_TOKEN_BYTES = 32;    // 32 bytes = 256 bits

// Password configuration
export const PASSWORD_MIN_LENGTH = 8;
export const BCRYPT_ROUNDS = 12;          // Recommended for 2025

// Audit log action types
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'login.success',
  LOGIN_FAILURE: 'login.failure',
  LOGOUT: 'logout',
  SESSION_REFRESH: 'session.refresh',
  SESSION_EXPIRED: 'session.expired',
} as const;
