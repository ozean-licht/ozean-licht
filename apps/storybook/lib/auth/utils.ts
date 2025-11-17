/**
 * Authentication Utility Functions
 *
 * Core utilities for password verification and user lookup for Storybook authentication.
 */

import bcrypt from 'bcryptjs';
import { getAuthPool } from '../db/auth-pool';

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
    console.error('[StorybookAuth] Password verification error:', error);
    return false;
  }
}

/**
 * Get user by email from shared_users_db
 *
 * @param email - User email address
 * @returns User object or null if not found
 */
export async function getUserByEmail(email: string): Promise<{
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  is_active: boolean;
} | null> {
  try {
    const pool = getAuthPool();
    const result = await pool.query(
      'SELECT id, email, password_hash, name, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('[StorybookAuth] Error fetching user by email:', error);
    return null;
  }
}

/**
 * Check if user has access to Storybook (OZEAN_LICHT or ADMIN entity)
 *
 * @param userId - User ID from users table
 * @returns True if user has Ozean Licht or admin access
 */
export async function hasStorybookAccess(userId: string): Promise<{
  hasAccess: boolean;
  role?: string;
  entityType?: string;
}> {
  try {
    const pool = getAuthPool();
    const result = await pool.query(
      `SELECT entity_type, role, is_active
       FROM user_entities
       WHERE user_id = $1
         AND entity_type IN ('OZEAN_LICHT', 'ADMIN')
         AND is_active = true
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return { hasAccess: false };
    }

    const entity = result.rows[0];
    return {
      hasAccess: true,
      role: entity.role,
      entityType: entity.entity_type,
    };
  } catch (error) {
    console.error('[StorybookAuth] Error checking Storybook access:', error);
    return { hasAccess: false };
  }
}
