/**
 * Middleware-Safe Authentication
 *
 * This module provides auth utilities that work in Edge runtime (middleware).
 * Cannot import database connections or Node.js-specific modules.
 */

import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import type { AdminRole } from '@/types/admin';

/**
 * Get session from JWT token (middleware-safe)
 * Works in Edge runtime without database access
 */
export async function getMiddlewareSession(request: NextRequest) {
  // CRITICAL: Must match cookie name from config.ts
  const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName,  // Explicitly specify cookie name to match production config
  });

  // Debug logging (remove after fix confirmed)
  if (!token) {
    console.log('[Middleware] No token found. Cookie name:', cookieName);
    console.log('[Middleware] Available cookies:', request.cookies.getAll().map(c => c.name));
  }

  if (!token) return null;

  return {
    user: {
      id: token.sub as string,
      email: token.email as string,
      adminUserId: token.adminUserId as string,
      adminRole: token.adminRole as AdminRole,
      permissions: token.permissions,
      entityScope: token.entityScope as string,
    },
  };
}
