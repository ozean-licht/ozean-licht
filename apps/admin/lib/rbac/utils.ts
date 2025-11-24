/**
 * RBAC Utility Functions
 */

import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { AdminRole } from '@/types/admin';
import { canAccessRoute, ROLE_CONFIG } from './constants';
import type { Session } from 'next-auth';

/**
 * Check if user has a specific role
 */
export function hasRole(session: Session, role: AdminRole): boolean {
  return session.user?.adminRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(session: Session, roles: AdminRole[]): boolean {
  return roles.includes(session.user?.adminRole as AdminRole);
}

/**
 * Require a specific role for a server component
 * Redirects to dashboard if role not permitted
 */
export async function requireRole(role: AdminRole): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (!hasRole(session, role)) {
    redirect('/dashboard?error=insufficient_role');
  }

  return session;
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(roles: AdminRole[]): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (!hasAnyRole(session, roles)) {
    redirect('/dashboard?error=insufficient_role');
  }

  return session;
}

/**
 * Require route access based on role
 */
export async function requireRouteAccess(path: string): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user?.adminRole as AdminRole;

  if (!canAccessRoute(userRole, path)) {
    redirect('/dashboard?error=route_not_allowed');
  }

  return session;
}

/**
 * Get allowed routes for a role
 */
export function getAllowedRoutes(role: AdminRole): string[] {
  return ROLE_CONFIG[role]?.allowedRoutes || ['/dashboard'];
}

/**
 * Check if user can manage roles (assign/change roles)
 * Only super_admin can manage roles
 */
export function canManageRoles(session: Session): boolean {
  return hasRole(session, 'super_admin');
}

/**
 * Check if user can view entity data
 * Note: This admin dashboard is exclusively for Ozean Licht platform
 */
export function canViewEntity(session: Session, entity: 'ozean_licht'): boolean {
  const role = session.user?.adminRole as AdminRole;
  const entityScope = session.user?.entityScope;

  // Super admin can view all entities
  if (role === 'super_admin') {
    return true;
  }

  // Check entity scope match
  if (entityScope === entity) {
    return true;
  }

  // Check role-based access for Ozean Licht
  if (entity === 'ozean_licht' && (role === 'ol_admin' || role === 'ol_editor')) {
    return true;
  }

  // Support can view all entities (read-only)
  if (role === 'support') {
    return true;
  }

  return false;
}
