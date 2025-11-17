/**
 * Authentication Constants
 *
 * Centralized constants for authentication configuration
 */

/**
 * Bcrypt rounds for password hashing
 */
export const BCRYPT_ROUNDS = 10;

/**
 * Session token byte length
 */
export const SESSION_TOKEN_BYTES = 32;

/**
 * Audit log actions for authentication events
 */
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILURE: 'auth.login.failure',
  LOGOUT: 'auth.logout',
  SESSION_REFRESH: 'auth.session.refresh',
} as const;
