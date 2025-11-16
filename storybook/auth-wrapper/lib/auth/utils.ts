/**
 * Authentication Utility Functions
 *
 * Core utilities for password verification.
 * Simplified from admin dashboard - only includes essentials for Storybook auth.
 */

import bcrypt from 'bcryptjs';

/**
 * Verify a password against a hash
 *
 * @param password - Plain text password to verify
 * @param hash - Bcrypt hash to verify against
 * @returns True if password matches hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('[Storybook Auth] Password verification error:', error);
    return false;
  }
}
