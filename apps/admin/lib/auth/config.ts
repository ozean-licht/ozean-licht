/**
 * NextAuth Configuration
 *
 * Complete authentication configuration with credentials provider,
 * custom adapter, and session management.
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { MCPGatewayClientWithQueries } from '../mcp-client';
import { AdminPostgreSQLAdapter } from './adapter';
import { verifyPassword, logAuthEvent } from './utils';
import { AUDIT_ACTIONS } from './constants';

// Initialize MCP client
const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'kids-ascension-db',
});

/**
 * NextAuth configuration
 */
const authConfig: NextAuthConfig = {
  adapter: AdminPostgreSQLAdapter(mcpClient) as any,

  secret: process.env.NEXTAUTH_SECRET,

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
          // Get user by email
          const sql = 'SELECT id, email, password_hash FROM users WHERE email = $1';
          const rows = await mcpClient.query<{
            id: string;
            email: string;
            password_hash: string;
          }>(sql, [credentials.email]);

          if (rows.length === 0) {
            return null; // User not found
          }

          const user = rows[0];

          // Verify password
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            return null; // Invalid password
          }

          // Get admin user record
          const adminUser = await mcpClient.getAdminUserByUserId(user.id);

          if (!adminUser || !adminUser.isActive) {
            return null; // Not an admin or deactivated
          }

          // Update last login timestamp
          await mcpClient.updateAdminUser(adminUser.id, {
            lastLoginAt: new Date(),
          });

          // Return user object with admin data
          return {
            id: user.id,
            email: user.email,
            adminUserId: adminUser.id,
            adminRole: adminUser.adminRole,
            permissions: adminUser.permissions,
            entityScope: adminUser.entityScope,
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
     * Sign-in callback - log successful authentication
     */
    async signIn({ user }) {
      // Log successful sign-in
      if (user && user.adminUserId) {
        await logAuthEvent(mcpClient, {
          adminUserId: user.adminUserId,
          action: AUDIT_ACTIONS.LOGIN_SUCCESS,
          metadata: {
            email: user.email,
          },
        });
      }
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
