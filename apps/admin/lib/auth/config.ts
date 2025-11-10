/**
 * NextAuth Configuration
 *
 * Complete authentication configuration with credentials provider,
 * custom adapter, and session management.
 *
 * Architecture Decision:
 * - Authentication uses DIRECT PostgreSQL connection for performance
 * - Dashboard data operations use MCP Gateway for flexibility
 * - Direct connection reduces latency from ~100ms to ~5-10ms
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { getAuthPool } from '../db/auth-pool';
import { verifyPassword } from './utils';
import { AUDIT_ACTIONS } from './constants';

/**
 * Lazy-load auth pool to avoid initialization during Edge runtime compilation
 */
let authPool: ReturnType<typeof getAuthPool> | null = null;
function getPool() {
  if (!authPool) {
    authPool = getAuthPool();
  }
  return authPool;
}

/**
 * NextAuth configuration
 */
const authConfig: NextAuthConfig = {
  // Don't pass adapter - it's only used for database sessions which we're not using (JWT strategy)
  // adapter: AdminPostgreSQLAdapter(getPool()) as any,

  // NextAuth v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET for compatibility
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // Trust host for production deployment behind proxy (Coolify/Traefik)
  trustHost: true,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const pool = getPool();

          // Get user by email (direct query - fast!)
          const userResult = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [credentials.email]
          );

          if (userResult.rows.length === 0) {
            return null; // User not found
          }

          const user = userResult.rows[0];

          // Verify password
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            return null; // Invalid password
          }

          // Get admin user record (direct query)
          const adminResult = await pool.query(
            `SELECT id, user_id, admin_role, permissions, entity_scope, is_active, last_login_at
             FROM admin_users
             WHERE user_id = $1`,
            [user.id]
          );

          if (adminResult.rows.length === 0 || !adminResult.rows[0].is_active) {
            return null; // Not an admin or deactivated
          }

          const adminUser = adminResult.rows[0];

          // Update last login timestamp (direct query)
          await pool.query(
            'UPDATE admin_users SET last_login_at = NOW() WHERE id = $1',
            [adminUser.id]
          );

          // Log successful login (direct query) - non-blocking
          try {
            await pool.query(
              `INSERT INTO audit_logs (admin_user_id, action, resource_type, metadata, created_at)
               VALUES ($1, $2, $3, $4, NOW())`,
              [
                adminUser.id,
                AUDIT_ACTIONS.LOGIN_SUCCESS,
                'auth',
                JSON.stringify({ email: user.email }),
              ]
            );
          } catch (auditError) {
            // Don't fail login if audit logging fails
            console.warn('[Auth] Audit log failed (non-critical):', auditError);
          }

          // Return user object with admin data
          return {
            id: user.id,
            email: user.email,
            adminUserId: adminUser.id,
            adminRole: adminUser.admin_role,
            permissions: adminUser.permissions,
            entityScope: adminUser.entity_scope,
          };
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    /**
     * JWT callback - enrich token with admin data
     */
    async jwt({ token, user }) {
      // Enrich JWT with admin data on sign-in
      if (user) {
        token.adminUserId = user.adminUserId;
        token.adminRole = user.adminRole;
        token.permissions = user.permissions;
        token.entityScope = user.entityScope;
      }
      return token;
    },

    /**
     * Session callback - enrich session with JWT token data
     */
    async session({ session, token }) {
      // Enrich session with JWT token data
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.adminUserId = token.adminUserId as string;
        session.user.adminRole = token.adminRole as string;
        session.user.permissions = token.permissions as any;
        session.user.entityScope = token.entityScope as string;
      }
      return session;
    },

    /**
     * Sign-in callback - already logged in authorize()
     */
    async signIn() {
      // Login already logged in authorize() function
      return true;
    },
  },

  // Note: signOut event does not provide user context in database strategy
  // Logout audit logging should be done in the logout action handler instead
};

/**
 * Export NextAuth handlers and utilities
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
