/**
 * NextAuth Configuration for Ozean Licht Platform
 *
 * User authentication using credentials provider with PostgreSQL backend.
 * Uses MCP Gateway for database operations.
 *
 * SECURITY NOTES:
 * - Password hashing: bcrypt with 12 rounds
 * - Session: JWT with 30-day expiry, refreshed daily
 * - Demo mode: Only available in development environment
 *
 * TODO: Add rate limiting to prevent brute force attacks
 * - Recommendation: Use @upstash/ratelimit or similar
 * - Limit: 5 login attempts per IP per 15 minutes
 * - Implementation: Add middleware to /api/auth/* routes
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

// MCP Gateway URL for database operations
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';

/**
 * Query the database via MCP Gateway
 */
async function queryDatabase(sql: string, params: unknown[] = []): Promise<any> {
  try {
    const response = await fetch(`${MCP_GATEWAY_URL}/mcp/postgres/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: process.env.DATABASE_NAME || 'ozean_licht_db',
        query: sql,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP Gateway error: ${response.status}`);
    }

    const result = await response.json();
    return result.rows || [];
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Auth] Database query failed:', error);
    }
    throw error;
  }
}

/**
 * Verify password using bcrypt
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Demo mode only allowed in development environment
  if (process.env.NODE_ENV === 'development' && hash === 'demo') {
    return true;
  }

  // Use bcrypt comparison
  try {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  } catch (error) {
    // In production, bcryptjs must be available
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Password verification unavailable');
    }
    return false;
  }
}

/**
 * NextAuth configuration
 */
const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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
          // Query user from database via MCP Gateway
          const users = await queryDatabase(
            'SELECT id, email, password_hash, full_name, avatar_url, created_at FROM users WHERE email = $1',
            [credentials.email]
          );

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // Verify password
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            return null;
          }

          // Update last login
          await queryDatabase(
            'UPDATE users SET last_login_at = NOW() WHERE id = $1',
            [user.id]
          ).catch(() => {}); // Non-blocking

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            image: user.avatar_url,
          };
        } catch (error) {
          // Only log in development
          if (process.env.NODE_ENV !== 'production') {
            console.error('[Auth] Authorization error:', error);
          }
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours (refresh session daily)
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
