/**
 * Custom PostgreSQL Adapter for NextAuth
 *
 * Implements the NextAuth Adapter interface for database-backed sessions
 * using the MCP Gateway client.
 */

import type { Adapter, AdapterUser, AdapterSession } from '@auth/core/adapters';
import { MCPGatewayClientWithQueries } from '../mcp-client';
import { SESSION_TTL_SECONDS } from './constants';

/**
 * Custom NextAuth adapter for PostgreSQL via MCP Gateway
 * Implements database-backed session management
 *
 * @param mcpClient - MCP Gateway client instance
 * @returns NextAuth Adapter
 */
export function AdminPostgreSQLAdapter(mcpClient: MCPGatewayClientWithQueries): Adapter {
  return {
    // ============================================================================
    // User Operations
    // ============================================================================

    /**
     * Get user by ID
     */
    async getUser(id: string): Promise<AdapterUser | null> {
      const sql = 'SELECT id, email, email_verified_at FROM users WHERE id = $1';
      const rows = await mcpClient.query<{
        id: string;
        email: string;
        email_verified_at: string | null;
      }>(sql, [id]);

      if (rows.length === 0) return null;

      const user = rows[0];
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.email_verified_at ? new Date(user.email_verified_at) : null,
      };
    },

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const sql = 'SELECT id, email, email_verified_at FROM users WHERE email = $1';
      const rows = await mcpClient.query<{
        id: string;
        email: string;
        email_verified_at: string | null;
      }>(sql, [email]);

      if (rows.length === 0) return null;

      const user = rows[0];
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.email_verified_at ? new Date(user.email_verified_at) : null,
      };
    },

    // ============================================================================
    // Session Operations
    // ============================================================================

    /**
     * Create a new session
     */
    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      // Get admin user by user_id
      const adminUser = await mcpClient.getAdminUserByUserId(session.userId);

      if (!adminUser) {
        throw new Error('Admin user not found');
      }

      // Create session in admin_sessions table
      const adminSession = await mcpClient.createSession({
        adminUserId: adminUser.id,
        sessionToken: session.sessionToken,
        ipAddress: '0.0.0.0', // Will be updated by credentials provider with real IP
        ttlSeconds: SESSION_TTL_SECONDS,
      });

      return {
        sessionToken: adminSession.sessionToken,
        userId: session.userId,
        expires: adminSession.expiresAt,
      };
    },

    /**
     * Get session and user by session token
     */
    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const adminSession = await mcpClient.getSessionByToken(sessionToken);

      if (!adminSession) return null;

      const adminUser = await mcpClient.getAdminUserById(adminSession.adminUserId);

      if (!adminUser) return null;

      const sql = 'SELECT id, email, email_verified_at FROM users WHERE id = $1';
      const rows = await mcpClient.query<{
        id: string;
        email: string;
        email_verified_at: string | null;
      }>(sql, [adminUser.userId]);

      if (rows.length === 0) return null;

      const user = rows[0];

      // Update last activity timestamp
      await mcpClient.updateSessionActivity(sessionToken);

      return {
        session: {
          sessionToken: adminSession.sessionToken,
          userId: adminUser.userId,
          expires: adminSession.expiresAt,
        },
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.email_verified_at ? new Date(user.email_verified_at) : null,
        },
      };
    },

    /**
     * Update session (refresh activity)
     */
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession | null | undefined> {
      const adminSession = await mcpClient.getSessionByToken(session.sessionToken);

      if (!adminSession) return null;

      // Update activity timestamp
      await mcpClient.updateSessionActivity(session.sessionToken);

      const adminUser = await mcpClient.getAdminUserById(adminSession.adminUserId);

      if (!adminUser) return null;

      return {
        sessionToken: adminSession.sessionToken,
        userId: adminUser.userId,
        expires: adminSession.expiresAt,
      };
    },

    /**
     * Delete session (logout)
     */
    async deleteSession(sessionToken: string): Promise<void> {
      await mcpClient.deleteSession(sessionToken);
    },

    // ============================================================================
    // Account Operations (Not implemented - credentials provider only)
    // ============================================================================

    async linkAccount(): Promise<any> {
      throw new Error('linkAccount not implemented - use credentials provider only');
    },

    async unlinkAccount(): Promise<void> {
      throw new Error('unlinkAccount not implemented - use credentials provider only');
    },

    // ============================================================================
    // Verification Token Operations (Not implemented)
    // ============================================================================

    async createVerificationToken(): Promise<any> {
      throw new Error('createVerificationToken not implemented');
    },

    async useVerificationToken(): Promise<any> {
      throw new Error('useVerificationToken not implemented');
    },
  };
}
