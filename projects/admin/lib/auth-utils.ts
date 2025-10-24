/**
 * Authentication Helper Utilities
 *
 * Server-side helper functions for requiring authentication
 * in server components and layouts.
 */

import { auth } from './auth/config';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

/**
 * Require authentication for a server component or layout
 * Redirects to login if not authenticated
 *
 * @returns The session object
 * @throws Redirects to /login if not authenticated
 *
 * @example
 * ```typescript
 * // In a server component
 * export default async function DashboardPage() {
 *   const session = await requireAuth();
 *   return <div>Welcome {session.user.email}</div>;
 * }
 * ```
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return session;
}

/**
 * Check if user has a specific permission
 *
 * Supports wildcard permissions:
 * - `*` grants all permissions
 * - `users.*` grants all user-related permissions (users.read, users.write, etc.)
 * - `*.read` grants read permission for all resources (users.read, videos.read, etc.)
 *
 * @param session - The session object
 * @param permission - The permission key to check (e.g., 'users.read')
 * @returns True if user has permission
 *
 * @example
 * ```typescript
 * const session = await requireAuth();
 * if (hasPermission(session, 'users.write')) {
 *   // User can edit users
 * }
 * ```
 */
export function hasPermission(session: Session, permission: string): boolean {
  const permissions = session.user?.permissions || [];

  // Check for wildcard permission (full access)
  if (permissions.includes('*')) {
    return true;
  }

  // Check exact match
  if (permissions.includes(permission)) {
    return true;
  }

  // Check category wildcard (e.g., 'users.*' matches 'users.read')
  const parts = permission.split('.');
  if (parts.length >= 2) {
    const category = parts[0];
    if (permissions.includes(`${category}.*`)) {
      return true;
    }

    // Check action wildcard (e.g., '*.read' matches 'users.read')
    const action = parts[parts.length - 1];
    if (permissions.includes(`*.${action}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Require a specific permission
 * Redirects to /dashboard with error if permission denied
 *
 * @param permission - The permission key to require
 * @returns The session object if permission granted
 * @throws Redirects to /dashboard?error=permission_denied if denied
 *
 * @example
 * ```typescript
 * // In a server component
 * export default async function UsersPage() {
 *   const session = await requirePermission('users.read');
 *   // User has permission, render page
 * }
 * ```
 */
export async function requirePermission(permission: string): Promise<Session> {
  const session = await requireAuth();

  if (!hasPermission(session, permission)) {
    redirect('/dashboard?error=permission_denied');
  }

  return session;
}
