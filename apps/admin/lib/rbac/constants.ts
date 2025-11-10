/**
 * RBAC Constants
 *
 * Role definitions, permissions, and access rules for the admin dashboard.
 */

import { AdminRole } from '@/types/admin';

/**
 * Role display metadata
 */
export const ROLE_CONFIG: Record<AdminRole, {
  label: string;
  description: string;
  color: 'default' | 'destructive' | 'outline' | 'secondary';
  icon: string; // Lucide icon name
  defaultPermissions: string[];
  allowedRoutes: string[]; // Route prefixes this role can access
}> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access across all platforms',
    color: 'destructive',
    icon: 'Shield',
    defaultPermissions: ['*'], // Wildcard: all permissions
    allowedRoutes: ['/dashboard'], // All routes
  },
  ka_admin: {
    label: 'Kids Ascension Admin',
    description: 'Full access to Kids Ascension platform',
    color: 'default',
    icon: 'GraduationCap',
    defaultPermissions: [
      'users.read', 'users.write',
      'content.read', 'content.write', 'content.approve',
      'classrooms.read', 'classrooms.write',
      'analytics.read',
      'settings.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/kids-ascension',
      '/dashboard/health',
      '/dashboard/storage',
    ],
  },
  ol_admin: {
    label: 'Ozean Licht Admin',
    description: 'Full access to Ozean Licht platform',
    color: 'default',
    icon: 'Sparkles',
    defaultPermissions: [
      'users.read', 'users.write',
      'courses.read', 'courses.write', 'courses.publish',
      'members.read', 'members.write',
      'payments.read',
      'analytics.read',
      'settings.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/ozean-licht',
      '/dashboard/health',
      '/dashboard/storage',
    ],
  },
  support: {
    label: 'Support',
    description: 'Read-only access for customer support',
    color: 'secondary',
    icon: 'Headphones',
    defaultPermissions: [
      'users.read',
      'content.read',
      'courses.read',
      'members.read',
      'classrooms.read',
      'analytics.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/kids-ascension',
      '/dashboard/ozean-licht',
    ],
  },
};

/**
 * Entity scope display metadata
 */
export const ENTITY_CONFIG = {
  kids_ascension: {
    label: 'Kids Ascension',
    shortLabel: 'KA',
    color: 'default',
    icon: 'GraduationCap',
  },
  ozean_licht: {
    label: 'Ozean Licht',
    shortLabel: 'OL',
    color: 'outline',
    icon: 'Sparkles',
  },
} as const;

/**
 * Route access rules
 * Maps route prefixes to required roles
 */
export const ROUTE_ROLES: Record<string, AdminRole[]> = {
  '/dashboard/kids-ascension': ['super_admin', 'ka_admin', 'support'],
  '/dashboard/ozean-licht': ['super_admin', 'ol_admin', 'support'],
  '/dashboard/users': ['super_admin', 'ka_admin', 'ol_admin'],
  '/dashboard/settings': ['super_admin', 'ka_admin', 'ol_admin'],
  '/dashboard/audit': ['super_admin'],
  '/dashboard/permissions': ['super_admin'], // Permission management (super_admin only)
  // Health and storage accessible to all roles
  '/dashboard/health': ['super_admin', 'ka_admin', 'ol_admin', 'support'],
  '/dashboard/storage': ['super_admin', 'ka_admin', 'ol_admin', 'support'],
};

/**
 * Get role display name
 */
export function getRoleLabel(role: AdminRole): string {
  return ROLE_CONFIG[role]?.label || role;
}

/**
 * Get role color for badges
 */
export function getRoleColor(role: AdminRole): string {
  return ROLE_CONFIG[role]?.color || 'default';
}

/**
 * Check if role can access a route
 */
export function canAccessRoute(role: AdminRole, path: string): boolean {
  // Super admin can access everything
  if (role === 'super_admin') {
    return true;
  }

  // Check exact match first
  if (ROUTE_ROLES[path]?.includes(role)) {
    return true;
  }

  // Check prefix match (e.g., /dashboard/users/123 matches /dashboard/users)
  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ROLES)) {
    if (path.startsWith(routePrefix) && allowedRoles.includes(role)) {
      return true;
    }
  }

  // Default: allow access to base dashboard
  if (path === '/dashboard') {
    return true;
  }

  return false;
}
