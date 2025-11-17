/**
 * NextAuth Configuration for Storybook
 *
 * Authentication configuration with credentials provider and shared_users_db integration.
 * Provides optional authentication for enhanced Storybook features (commenting, AI chat).
 *
 * Architecture Decision:
 * - Direct PostgreSQL connection for performance (5-10ms like admin)
 * - JWT session strategy for Storybook compatibility
 * - Public access by default (no auth required)
 * - Enhanced features when authenticated
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { getAuthPool } from '../db/auth-pool';
import { verifyPassword, hasStorybookAccess } from './utils';
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
 * NextAuth configuration for Storybook
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
          ? '.ozean-licht.dev'  // Wildcard allows subdomains (storybook.ozean-licht.dev)
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

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const pool = getPool();

          // Get user by email (direct query - fast!)
          const userResult = await pool.query(
            'SELECT id, email, password_hash, name, is_active FROM users WHERE email = $1',
            [credentials.email]
          );

          if (userResult.rows.length === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorybookAuth] User not found:', credentials.email);
            } else {
              console.log('[StorybookAuth] Authentication failed: User not found');
            }
            return null; // User not found
          }

          const user = userResult.rows[0];

          // Check if user is active
          if (!user.is_active) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorybookAuth] User inactive:', credentials.email);
            } else {
              console.log('[StorybookAuth] Authentication failed: User inactive');
            }
            return null;
          }

          // Verify password
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorybookAuth] Invalid password for:', credentials.email);
            } else {
              console.log('[StorybookAuth] Authentication failed: Invalid credentials');
            }
            return null; // Invalid password
          }

          // Check if user has Storybook access (OZEAN_LICHT or ADMIN entity)
          const accessCheck = await hasStorybookAccess(user.id);

          if (!accessCheck.hasAccess) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorybookAuth] User lacks Storybook access:', credentials.email);
            } else {
              console.log('[StorybookAuth] Authentication failed: Insufficient access');
            }
            return null; // No Storybook access
          }

          // Log successful login (non-blocking)
          try {
            await pool.query(
              `INSERT INTO audit_logs (user_id, action, resource_type, metadata, created_at)
               VALUES ($1, $2, $3, $4, NOW())`,
              [
                user.id,
                AUDIT_ACTIONS.LOGIN_SUCCESS,
                'storybook_auth',
                JSON.stringify({
                  email: user.email,
                  entity: accessCheck.entityType,
                  role: accessCheck.role,
                }),
              ]
            );
          } catch (auditError) {
            // Don't fail login if audit logging fails
            console.warn('[StorybookAuth] Audit log failed (non-critical):', auditError);
          }

          // Return user object with entity data
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: accessCheck.role || 'USER',
            entityType: accessCheck.entityType || 'OZEAN_LICHT',
          };
        } catch (error) {
          console.error('[StorybookAuth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin', // Custom sign-in page (optional)
    error: '/auth/error',   // Custom error page (optional)
  },

  callbacks: {
    /**
     * JWT callback - enrich token with user data
     */
    async jwt({ token, user }) {
      // Enrich JWT with user data on sign-in
      if (user) {
        token.role = user.role;
        token.entityType = user.entityType;
        token.name = user.name;
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
        session.user.role = token.role as string;
        session.user.entityType = token.entityType as string;
        session.user.name = token.name as string;
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
};

/**
 * Export NextAuth handlers and utilities
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
