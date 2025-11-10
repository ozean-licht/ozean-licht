/**
 * Custom PostgreSQL Adapter for NextAuth
 *
 * Implements the NextAuth Adapter interface using direct PostgreSQL connection.
 * Note: With JWT strategy, session methods are not called.
 */

import type { Adapter, AdapterUser, AdapterSession } from '@auth/core/adapters';
import type { Pool } from 'pg';

/**
 * Custom NextAuth adapter for PostgreSQL (direct connection)
 * Implements database-backed session management
 *
 * @param pool - PostgreSQL connection pool
 * @returns NextAuth Adapter
 */
export function AdminPostgreSQLAdapter(pool: Pool): Adapter {
  return {
    // ============================================================================
    // User Operations
    // ============================================================================

    /**
     * Get user by ID
     */
    async getUser(id: string): Promise<AdapterUser | null> {
      const result = await pool.query(
        'SELECT id, email, email_verified_at FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) return null;

      const user = result.rows[0];
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
      const result = await pool.query(
        'SELECT id, email, email_verified_at FROM users WHERE id = $1',
        [email]
      );

      if (result.rows.length === 0) return null;

      const user = result.rows[0];
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
     * Create a new session (not used with JWT strategy)
     */
    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      // Note: Not called when using JWT strategy
      // If switching to database sessions, implement direct queries here
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      };
    },

    /**
     * Get session and user by session token (not used with JWT strategy)
     */
    async getSessionAndUser(
      _sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      // Note: Not called when using JWT strategy
      return null;
    },

    /**
     * Update session (not used with JWT strategy)
     */
    async updateSession(
      _session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession | null | undefined> {
      // Note: Not called when using JWT strategy
      return null;
    },

    /**
     * Delete session (not used with JWT strategy)
     */
    async deleteSession(_sessionToken: string): Promise<void> {
      // Note: Not called when using JWT strategy
      // JWT sessions are stateless and don't need database cleanup
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
