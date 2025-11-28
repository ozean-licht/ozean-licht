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
  ol_admin: {
    label: 'Ozean Licht Admin',
    description: 'Full platform access, can manage users and settings',
    color: 'default',
    icon: 'Sparkles',
    defaultPermissions: [
      'users.read', 'users.write',
      'courses.read', 'courses.write', 'courses.publish',
      'members.read', 'members.write',
      'payments.read',
      'analytics.read',
      'settings.read', 'settings.write',
    ],
    allowedRoutes: ['/dashboard'], // All routes
  },
  ol_editor: {
    label: 'Content Editor',
    description: 'Can manage courses and content',
    color: 'outline',
    icon: 'FileEdit',
    defaultPermissions: [
      'users.read',
      'courses.read', 'courses.write', 'courses.publish',
      'content.read', 'content.write',
      'members.read',
      'analytics.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/content',
      '/dashboard/platforms',
      '/dashboard/platforms/courses',
      '/dashboard/members',
      '/dashboard/health',
    ],
  },
  support: {
    label: 'Support',
    description: 'Read-only access for customer support',
    color: 'secondary',
    icon: 'Headphones',
    defaultPermissions: [
      'users.read',
      'courses.read',
      'members.read',
      'content.read',
      'analytics.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/content',
      '/dashboard/members',
    ],
  },
};

/**
 * Entity scope display metadata
 * Note: This admin dashboard is exclusively for Ozean Licht platform
 */
export const ENTITY_CONFIG = {
  ozean_licht: {
    label: 'Ozean Licht',
    shortLabel: 'OL',
    color: 'default',
    icon: 'Sparkles',
  },
} as const;

/**
 * Route access rules
 * Maps route prefixes to required roles
 */
export const ROUTE_ROLES: Record<string, AdminRole[]> = {
  '/dashboard/access/users': ['super_admin', 'ol_admin'],
  '/dashboard/access/permissions': ['super_admin', 'ol_admin'],
  '/dashboard/system': ['super_admin', 'ol_admin', 'support'],
  '/dashboard/content': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/content/blog': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/members': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/analytics': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/settings': ['super_admin', 'ol_admin'],
  '/dashboard/audit': ['super_admin'],
  // Tools section - accessible to all roles
  '/dashboard/tools': ['super_admin', 'ol_admin', 'ol_editor', 'support'],
  '/dashboard/tools/projects': ['super_admin', 'ol_admin', 'ol_editor', 'support'],
  '/dashboard/tools/cloud': ['super_admin', 'ol_admin'],
  '/dashboard/tools/components': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/tools/docs': ['super_admin', 'ol_admin', 'ol_editor', 'support'],
  // Platforms section - course management
  '/dashboard/platforms': ['super_admin', 'ol_admin', 'ol_editor'],
  '/dashboard/platforms/courses': ['super_admin', 'ol_admin', 'ol_editor'],
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
