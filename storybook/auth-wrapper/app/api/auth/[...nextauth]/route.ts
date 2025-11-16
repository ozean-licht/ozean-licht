/**
 * NextAuth API Routes
 *
 * Exports GET and POST handlers for NextAuth authentication.
 * Handles all auth-related endpoints like /api/auth/signin, /api/auth/signout, etc.
 */

import { handlers } from '@/lib/auth/config'

export const { GET, POST } = handlers
