/**
 * Authentication Constants
 *
 * Centralized configuration for Storybook authentication system.
 * Simplified from admin dashboard - focuses on basic login/logout.
 */

// Session configuration
export const SESSION_TTL_SECONDS = 604800; // 7 days (longer for documentation access)
export const SESSION_TOKEN_BYTES = 32;     // 32 bytes = 256 bits

// Password configuration
export const PASSWORD_MIN_LENGTH = 8;
export const BCRYPT_ROUNDS = 12;           // Recommended for 2025

// Audit log action types for Storybook
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'storybook.login.success',
  LOGIN_FAILURE: 'storybook.login.failure',
  LOGOUT: 'storybook.logout',
} as const;
