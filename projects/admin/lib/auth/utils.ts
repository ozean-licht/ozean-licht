/**
 * Authentication Utility Functions
 *
 * Core utilities for password hashing, token generation, and audit logging.
 */

import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { MCPGatewayClientWithQueries } from '../mcp-client';
import { BCRYPT_ROUNDS, SESSION_TOKEN_BYTES } from './constants';

/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

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
    console.error('[Auth] Password verification error:', error);
    return false;
  }
}

/**
 * Generate a cryptographically secure session token
 *
 * @returns Hex-encoded session token
 */
export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString('hex');
}

/**
 * Log an authentication event to audit logs
 *
 * @param mcpClient - MCP Gateway client instance
 * @param data - Audit log data
 */
export async function logAuthEvent(
  mcpClient: MCPGatewayClientWithQueries,
  data: {
    adminUserId: string;
    action: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    await mcpClient.createAuditLog({
      adminUserId: data.adminUserId,
      action: data.action,
      entityType: 'auth',
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
  } catch (error) {
    console.error('[Auth] Failed to create audit log:', error);
    // Don't throw - audit logging should not break auth flow
  }
}
