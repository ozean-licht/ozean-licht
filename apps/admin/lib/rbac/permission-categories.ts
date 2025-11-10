/**
 * Comprehensive Permission Definitions
 *
 * Defines all available permissions across the admin dashboard,
 * organized by category with metadata for UI rendering.
 */

import { AdminPermission } from '@/types/admin';

export interface PermissionDefinition {
  key: string;
  label: string;
  description: string;
  category: string;
  entityScope: string | null;
  actions: string[];
}

/**
 * Permission categories with comprehensive CRUD operations
 *
 * Total: 57 permissions across 9 categories
 * - users: 4
 * - content: 7
 * - courses: 7
 * - members: 5
 * - classrooms: 5
 * - payments: 4
 * - analytics: 3
 * - settings: 6
 * - system: 5
 * - admin_management: 11 (NEW)
 */
export const PERMISSION_DEFINITIONS: Record<string, PermissionDefinition[]> = {
  // ============================================================================
  // User Management (4 permissions)
  // ============================================================================
  users: [
    {
      key: 'users.read',
      label: 'Read Users',
      description: 'View user information and profiles',
      category: 'users',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'users.create',
      label: 'Create Users',
      description: 'Create new user accounts',
      category: 'users',
      entityScope: null,
      actions: ['create'],
    },
    {
      key: 'users.update',
      label: 'Update Users',
      description: 'Modify user information and profiles',
      category: 'users',
      entityScope: null,
      actions: ['update'],
    },
    {
      key: 'users.delete',
      label: 'Delete Users',
      description: 'Remove user accounts from the system',
      category: 'users',
      entityScope: null,
      actions: ['delete'],
    },
  ],

  // ============================================================================
  // Content Management (7 permissions)
  // ============================================================================
  content: [
    {
      key: 'content.read',
      label: 'Read Content',
      description: 'View content items (videos, articles, media)',
      category: 'content',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'content.create',
      label: 'Create Content',
      description: 'Upload and create new content',
      category: 'content',
      entityScope: null,
      actions: ['create'],
    },
    {
      key: 'content.update',
      label: 'Update Content',
      description: 'Edit and modify existing content',
      category: 'content',
      entityScope: null,
      actions: ['update'],
    },
    {
      key: 'content.delete',
      label: 'Delete Content',
      description: 'Remove content from the platform',
      category: 'content',
      entityScope: null,
      actions: ['delete'],
    },
    {
      key: 'content.approve',
      label: 'Approve Content',
      description: 'Approve or reject submitted content',
      category: 'content',
      entityScope: null,
      actions: ['approve'],
    },
    {
      key: 'content.publish',
      label: 'Publish Content',
      description: 'Publish approved content to production',
      category: 'content',
      entityScope: null,
      actions: ['publish'],
    },
    {
      key: 'content.moderate',
      label: 'Moderate Content',
      description: 'Review flagged content and take moderation actions',
      category: 'content',
      entityScope: null,
      actions: ['moderate'],
    },
  ],

  // ============================================================================
  // Course Management (7 permissions) - Ozean Licht
  // ============================================================================
  courses: [
    {
      key: 'courses.read',
      label: 'Read Courses',
      description: 'View course information and structure',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['read'],
    },
    {
      key: 'courses.create',
      label: 'Create Courses',
      description: 'Create new courses and curriculum',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['create'],
    },
    {
      key: 'courses.update',
      label: 'Update Courses',
      description: 'Modify course content and settings',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['update'],
    },
    {
      key: 'courses.delete',
      label: 'Delete Courses',
      description: 'Remove courses from the platform',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['delete'],
    },
    {
      key: 'courses.publish',
      label: 'Publish Courses',
      description: 'Publish courses to make them available to members',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['publish'],
    },
    {
      key: 'courses.enroll',
      label: 'Enroll Members',
      description: 'Manually enroll members in courses',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['enroll'],
    },
    {
      key: 'courses.export',
      label: 'Export Course Data',
      description: 'Export course data and analytics',
      category: 'courses',
      entityScope: 'ozean_licht',
      actions: ['export'],
    },
  ],

  // ============================================================================
  // Member Management (5 permissions) - Ozean Licht
  // ============================================================================
  members: [
    {
      key: 'members.read',
      label: 'Read Members',
      description: 'View member profiles and information',
      category: 'members',
      entityScope: 'ozean_licht',
      actions: ['read'],
    },
    {
      key: 'members.create',
      label: 'Create Members',
      description: 'Add new members to the platform',
      category: 'members',
      entityScope: 'ozean_licht',
      actions: ['create'],
    },
    {
      key: 'members.update',
      label: 'Update Members',
      description: 'Modify member profiles and settings',
      category: 'members',
      entityScope: 'ozean_licht',
      actions: ['update'],
    },
    {
      key: 'members.delete',
      label: 'Delete Members',
      description: 'Remove members from the platform',
      category: 'members',
      entityScope: 'ozean_licht',
      actions: ['delete'],
    },
    {
      key: 'members.export',
      label: 'Export Member Data',
      description: 'Export member data for reporting',
      category: 'members',
      entityScope: 'ozean_licht',
      actions: ['export'],
    },
  ],

  // ============================================================================
  // Classroom Management (5 permissions) - Kids Ascension
  // ============================================================================
  classrooms: [
    {
      key: 'classrooms.read',
      label: 'Read Classrooms',
      description: 'View classroom information and students',
      category: 'classrooms',
      entityScope: 'kids_ascension',
      actions: ['read'],
    },
    {
      key: 'classrooms.create',
      label: 'Create Classrooms',
      description: 'Create new classrooms',
      category: 'classrooms',
      entityScope: 'kids_ascension',
      actions: ['create'],
    },
    {
      key: 'classrooms.update',
      label: 'Update Classrooms',
      description: 'Modify classroom settings and assignments',
      category: 'classrooms',
      entityScope: 'kids_ascension',
      actions: ['update'],
    },
    {
      key: 'classrooms.delete',
      label: 'Delete Classrooms',
      description: 'Remove classrooms from the platform',
      category: 'classrooms',
      entityScope: 'kids_ascension',
      actions: ['delete'],
    },
    {
      key: 'classrooms.assign',
      label: 'Assign Students',
      description: 'Assign students to classrooms',
      category: 'classrooms',
      entityScope: 'kids_ascension',
      actions: ['assign'],
    },
  ],

  // ============================================================================
  // Payment Management (4 permissions) - Ozean Licht
  // ============================================================================
  payments: [
    {
      key: 'payments.read',
      label: 'Read Payments',
      description: 'View payment transactions and history',
      category: 'payments',
      entityScope: 'ozean_licht',
      actions: ['read'],
    },
    {
      key: 'payments.refund',
      label: 'Process Refunds',
      description: 'Issue refunds to members',
      category: 'payments',
      entityScope: 'ozean_licht',
      actions: ['refund'],
    },
    {
      key: 'payments.export',
      label: 'Export Payment Data',
      description: 'Export payment data for accounting',
      category: 'payments',
      entityScope: 'ozean_licht',
      actions: ['export'],
    },
    {
      key: 'payments.manage',
      label: 'Manage Payments',
      description: 'Update payment settings and configurations',
      category: 'payments',
      entityScope: 'ozean_licht',
      actions: ['manage'],
    },
  ],

  // ============================================================================
  // Analytics (3 permissions)
  // ============================================================================
  analytics: [
    {
      key: 'analytics.read',
      label: 'Read Analytics',
      description: 'View analytics dashboards and reports',
      category: 'analytics',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'analytics.export',
      label: 'Export Analytics',
      description: 'Export analytics data and reports',
      category: 'analytics',
      entityScope: null,
      actions: ['export'],
    },
    {
      key: 'analytics.configure',
      label: 'Configure Analytics',
      description: 'Configure analytics tracking and reports',
      category: 'analytics',
      entityScope: null,
      actions: ['configure'],
    },
  ],

  // ============================================================================
  // Settings (6 permissions)
  // ============================================================================
  settings: [
    {
      key: 'settings.read',
      label: 'Read Settings',
      description: 'View system and platform settings',
      category: 'settings',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'settings.update',
      label: 'Update Settings',
      description: 'Modify system and platform settings',
      category: 'settings',
      entityScope: null,
      actions: ['update'],
    },
    {
      key: 'settings.email',
      label: 'Email Settings',
      description: 'Configure email templates and notifications',
      category: 'settings',
      entityScope: null,
      actions: ['email'],
    },
    {
      key: 'settings.integrations',
      label: 'Integration Settings',
      description: 'Manage third-party integrations',
      category: 'settings',
      entityScope: null,
      actions: ['integrations'],
    },
    {
      key: 'settings.storage',
      label: 'Storage Settings',
      description: 'Configure MinIO and storage settings',
      category: 'settings',
      entityScope: null,
      actions: ['storage'],
    },
    {
      key: 'settings.security',
      label: 'Security Settings',
      description: 'Manage security policies and authentication',
      category: 'settings',
      entityScope: null,
      actions: ['security'],
    },
  ],

  // ============================================================================
  // System Administration (5 permissions)
  // ============================================================================
  system: [
    {
      key: 'system.health',
      label: 'System Health',
      description: 'View system health and monitoring',
      category: 'system',
      entityScope: null,
      actions: ['health'],
    },
    {
      key: 'system.logs',
      label: 'System Logs',
      description: 'View and search system logs',
      category: 'system',
      entityScope: null,
      actions: ['logs'],
    },
    {
      key: 'system.audit',
      label: 'Audit Logs',
      description: 'View and export audit logs',
      category: 'system',
      entityScope: null,
      actions: ['audit'],
    },
    {
      key: 'system.backup',
      label: 'Backup Management',
      description: 'Trigger and restore backups',
      category: 'system',
      entityScope: null,
      actions: ['backup'],
    },
    {
      key: 'system.maintenance',
      label: 'Maintenance Mode',
      description: 'Enable/disable maintenance mode',
      category: 'system',
      entityScope: null,
      actions: ['maintenance'],
    },
  ],

  // ============================================================================
  // Admin Management (11 permissions) - NEW
  // ============================================================================
  admin_management: [
    {
      key: 'admin.users.read',
      label: 'Read Admin Users',
      description: 'View admin user accounts',
      category: 'admin_management',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'admin.users.create',
      label: 'Create Admin Users',
      description: 'Create new admin accounts',
      category: 'admin_management',
      entityScope: null,
      actions: ['create'],
    },
    {
      key: 'admin.users.update',
      label: 'Update Admin Users',
      description: 'Modify admin user information',
      category: 'admin_management',
      entityScope: null,
      actions: ['update'],
    },
    {
      key: 'admin.users.delete',
      label: 'Delete Admin Users',
      description: 'Remove admin accounts',
      category: 'admin_management',
      entityScope: null,
      actions: ['delete'],
    },
    {
      key: 'admin.roles.manage',
      label: 'Manage Roles',
      description: 'Assign and modify admin roles',
      category: 'admin_management',
      entityScope: null,
      actions: ['manage'],
    },
    {
      key: 'admin.permissions.read',
      label: 'Read Permissions',
      description: 'View permission matrix and assignments',
      category: 'admin_management',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'admin.permissions.assign',
      label: 'Assign Permissions',
      description: 'Grant or revoke permissions for admin users',
      category: 'admin_management',
      entityScope: null,
      actions: ['assign'],
    },
    {
      key: 'admin.sessions.read',
      label: 'Read Admin Sessions',
      description: 'View active admin sessions',
      category: 'admin_management',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'admin.sessions.revoke',
      label: 'Revoke Admin Sessions',
      description: 'Terminate active admin sessions',
      category: 'admin_management',
      entityScope: null,
      actions: ['revoke'],
    },
    {
      key: 'admin.audit.read',
      label: 'Read Admin Audit Logs',
      description: 'View admin action audit logs',
      category: 'admin_management',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'admin.audit.export',
      label: 'Export Admin Audit Logs',
      description: 'Export admin audit logs for compliance',
      category: 'admin_management',
      entityScope: null,
      actions: ['export'],
    },
  ],
};

/**
 * Get all permissions as flat array
 */
export function getAllPermissions(): PermissionDefinition[] {
  return Object.values(PERMISSION_DEFINITIONS).flat();
}

/**
 * Get permissions by category
 */
export function getPermissionsByCategory(category: string): PermissionDefinition[] {
  return PERMISSION_DEFINITIONS[category] || [];
}

/**
 * Get all permission keys
 */
export function getAllPermissionKeys(): string[] {
  return getAllPermissions().map((p) => p.key);
}

/**
 * Get permission definition by key
 */
export function getPermissionByKey(key: string): PermissionDefinition | undefined {
  return getAllPermissions().find((p) => p.key === key);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return Object.keys(PERMISSION_DEFINITIONS);
}

/**
 * Permission group interface for UI
 */
export interface PermissionGroup {
  category: string;
  permissions: AdminPermission[];
}

/**
 * Group permissions by category
 */
export function groupPermissionsByCategory(
  permissions: AdminPermission[]
): PermissionGroup[] {
  const groups = new Map<string, AdminPermission[]>();

  for (const permission of permissions) {
    const category = permission.category || 'uncategorized';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(permission);
  }

  return Array.from(groups.entries())
    .map(([category, perms]) => ({
      category,
      permissions: perms.sort((a, b) =>
        a.permissionKey.localeCompare(b.permissionKey)
      ),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Get category display metadata
 */
export const CATEGORY_METADATA: Record<string, {
  label: string;
  description: string;
  icon: string;
  color: string;
}> = {
  users: {
    label: 'User Management',
    description: 'Manage platform users and accounts',
    icon: 'Users',
    color: 'blue',
  },
  content: {
    label: 'Content Management',
    description: 'Manage videos, articles, and media',
    icon: 'FileText',
    color: 'purple',
  },
  courses: {
    label: 'Course Management',
    description: 'Manage courses and curriculum (Ozean Licht)',
    icon: 'BookOpen',
    color: 'green',
  },
  members: {
    label: 'Member Management',
    description: 'Manage platform members (Ozean Licht)',
    icon: 'UserCheck',
    color: 'teal',
  },
  classrooms: {
    label: 'Classroom Management',
    description: 'Manage classrooms and students (Kids Ascension)',
    icon: 'School',
    color: 'orange',
  },
  payments: {
    label: 'Payment Management',
    description: 'Manage payments and transactions (Ozean Licht)',
    icon: 'CreditCard',
    color: 'yellow',
  },
  analytics: {
    label: 'Analytics',
    description: 'View and export analytics data',
    icon: 'BarChart',
    color: 'indigo',
  },
  settings: {
    label: 'Settings',
    description: 'Configure system and platform settings',
    icon: 'Settings',
    color: 'gray',
  },
  system: {
    label: 'System Administration',
    description: 'System health, logs, and maintenance',
    icon: 'Server',
    color: 'red',
  },
  admin_management: {
    label: 'Admin Management',
    description: 'Manage admin users, roles, and permissions',
    icon: 'Shield',
    color: 'pink',
  },
};
