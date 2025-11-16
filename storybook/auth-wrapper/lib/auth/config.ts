/**
 * NextAuth Configuration for Storybook Auth Wrapper
 *
 * Simplified authentication configuration for Storybook access.
 * Based on apps/admin/lib/auth/config.ts but streamlined for read-only
 * documentation access.
 *
 * Key differences from admin dashboard:
 * - No RBAC complexity (just check if user is an active admin)
 * - Simplified session data (only essential fields)
 * - Audit logging for Storybook-specific events
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
  // NextAuth v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET for compatibility
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // Trust host for production deployment behind proxy (Coolify/Traefik)
  trustHost: true,

  // Cookie configuration for HTTPS behind reverse proxy
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}storybook.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // Explicitly set domain to prevent container hostname from being used
        domain: process.env.NODE_ENV === 'production'
          ? '.ozean-licht.dev'  // Wildcard allows subdomains
          : undefined,
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials): Promise<{ id: string; email: string; adminUserId: string; adminRole: string } | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const pool = getPool();

          // Get user by email
          const userResult = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [credentials.email]
          );

          if (userResult.rows.length === 0) {
            // Log failed attempt (wrong email)
            console.log('[Storybook Auth] Login attempt for non-existent user:', credentials.email);
            return null;
          }

          const user = userResult.rows[0];

          // Verify password
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            // Log failed attempt (wrong password)
            console.log('[Storybook Auth] Invalid password for user:', credentials.email);
            return null;
          }

          // Get admin user record - MUST be an active admin to access Storybook
          const adminResult = await pool.query(
            `SELECT id, user_id, admin_role, is_active, last_login_at
             FROM admin_users
             WHERE user_id = $1`,
            [user.id]
          );

          if (adminResult.rows.length === 0 || !adminResult.rows[0].is_active) {
            console.log('[Storybook Auth] Access denied - not an active admin:', credentials.email);
            return null;
          }

          const adminUser = adminResult.rows[0];

          // Update last login timestamp
          await pool.query(
            'UPDATE admin_users SET last_login_at = NOW() WHERE id = $1',
            [adminUser.id]
          );

          // Log successful login - non-blocking
          try {
            await pool.query(
              `INSERT INTO audit_logs (admin_user_id, action, resource_type, metadata, created_at)
               VALUES ($1, $2, $3, $4, NOW())`,
              [
                adminUser.id,
                AUDIT_ACTIONS.LOGIN_SUCCESS,
                'storybook',
                JSON.stringify({
                  email: user.email,
                  service: 'storybook-auth-wrapper'
                }),
              ]
            );
          } catch (auditError) {
            console.warn('[Storybook Auth] Audit log failed (non-critical):', auditError);
          }

          // Return simplified user object
          return {
            id: user.id,
            email: user.email,
            adminUserId: adminUser.id,
            adminRole: adminUser.admin_role,
          };
        } catch (error) {
          console.error('[Storybook Auth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
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
      if (user) {
        token.adminUserId = user.adminUserId;
        token.adminRole = user.adminRole;
      }
      return token;
    },

    /**
     * Session callback - enrich session with JWT token data
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.adminUserId = token.adminUserId as string;
        session.user.adminRole = token.adminRole as string;
      }
      return session;
    },

    /**
     * Sign-in callback
     */
    async signIn() {
      return true;
    },
  },
};

/**
 * Export NextAuth handlers and utilities
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
