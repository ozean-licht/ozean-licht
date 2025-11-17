import { handlers } from '@/lib/auth/config';

/**
 * NextAuth API route handler for Storybook
 *
 * Handles all authentication requests:
 * - GET/POST /api/auth/signin - Sign in
 * - POST /api/auth/signout - Sign out
 * - GET /api/auth/session - Get session
 * - GET /api/auth/csrf - Get CSRF token
 * - GET /api/auth/providers - Get providers
 */
export const { GET, POST } = handlers;
