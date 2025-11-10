/**
 * Permission Computation and Validation Utilities
 *
 * Core functions for computing effective permissions, expanding wildcards,
 * validating permission changes, and formatting permission data for UI.
 */

import { AdminRole, AdminPermission, AdminUser } from '@/types/admin';
import { ROLE_CONFIG } from './constants';

// ============================================================================
// Permission Computation
// ============================================================================

/**
 * Compute effective permissions for a user
 * Combines role defaults with user-specific custom permissions
 *
 * @param role - User's assigned role
 * @param userPermissions - Custom permissions assigned to user
 * @returns Array of effective permission keys (deduplicated)
 */
export function computeEffectivePermissions(
  role: AdminRole,
  userPermissions: string[] = []
): string[] {
  const roleDefaults = ROLE_CONFIG[role]?.defaultPermissions || [];
  const combined = [...roleDefaults, ...userPermissions];

  // Deduplicate permissions
  return [...new Set(combined)];
}

/**
 * Expand wildcard permissions to concrete permission keys
 *
 * Supports three wildcard patterns:
 * - `*` - All permissions
 * - `category.*` - All permissions in category (e.g., `users.*`)
 * - `*.action` - All permissions with action (e.g., `*.read`)
 *
 * @param permissions - Array of permission keys (may include wildcards)
 * @param allPermissions - All available permissions in the system
 * @returns Expanded array of concrete permission keys
 */
export function expandWildcards(
  permissions: string[],
  allPermissions: AdminPermission[]
): string[] {
  const expanded = new Set<string>();

  for (const permission of permissions) {
    // Exact match - no wildcard
    if (!permission.includes('*')) {
      expanded.add(permission);
      continue;
    }

    // Global wildcard: `*` - All permissions
    if (permission === '*') {
      allPermissions.forEach((p) => expanded.add(p.permissionKey));
      continue;
    }

    // Category wildcard: `category.*` - All permissions in category
    if (permission.endsWith('.*')) {
      const category = permission.slice(0, -2);
      allPermissions
        .filter((p) => p.permissionKey.startsWith(`${category}.`))
        .forEach((p) => expanded.add(p.permissionKey));
      continue;
    }

    // Action wildcard: `*.action` - All permissions with action
    if (permission.startsWith('*.')) {
      const action = permission.slice(2);
      allPermissions
        .filter((p) => p.permissionKey.endsWith(`.${action}`))
        .forEach((p) => expanded.add(p.permissionKey));
      continue;
    }

    // Nested wildcard (not currently supported, treat as exact match)
    expanded.add(permission);
  }

  return Array.from(expanded).sort();
}

/**
 * Check if user has a specific permission (with wildcard support)
 *
 * @param userPermissions - User's permission array (may include wildcards)
 * @param permissionKey - Specific permission to check
 * @returns true if user has permission (via exact match or wildcard)
 */
export function hasPermission(
  userPermissions: string[],
  permissionKey: string
): boolean {
  // Exact match
  if (userPermissions.includes(permissionKey)) {
    return true;
  }

  // Global wildcard
  if (userPermissions.includes('*')) {
    return true;
  }

  // Category wildcard
  const parts = permissionKey.split('.');
  if (parts.length >= 2) {
    const category = parts[0];
    if (userPermissions.includes(`${category}.*`)) {
      return true;
    }

    // Action wildcard
    const action = parts[parts.length - 1];
    if (userPermissions.includes(`*.${action}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Determine permission source (how user got this permission)
 *
 * @param permission - Permission key to check
 * @param role - User's role
 * @param userPermissions - User's custom permissions
 * @returns 'wildcard' | 'role' | 'custom' | null
 */
export function getPermissionSource(
  permission: string,
  role: AdminRole,
  userPermissions: string[]
): 'wildcard' | 'role' | 'custom' | null {
  const roleDefaults = ROLE_CONFIG[role]?.defaultPermissions || [];

  // Check if permission comes from wildcard
  if (roleDefaults.includes('*') || userPermissions.includes('*')) {
    return 'wildcard';
  }

  const parts = permission.split('.');
  if (parts.length >= 2) {
    const category = parts[0];
    const action = parts[parts.length - 1];

    if (
      roleDefaults.includes(`${category}.*`) ||
      roleDefaults.includes(`*.${action}`) ||
      userPermissions.includes(`${category}.*`) ||
      userPermissions.includes(`*.${action}`)
    ) {
      return 'wildcard';
    }
  }

  // Check if permission comes from role defaults
  if (roleDefaults.includes(permission)) {
    return 'role';
  }

  // Check if permission comes from custom user permissions
  if (userPermissions.includes(permission)) {
    return 'custom';
  }

  return null;
}

// ============================================================================
// Permission Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validate permission change before applying
 *
 * Security rules:
 * 1. Only super_admin can edit permissions
 * 2. Cannot self-grant permissions (prevent privilege escalation)
 * 3. Cannot grant permissions outside entity scope
 * 4. Wildcard permissions show warning
 *
 * @param currentUser - User making the change
 * @param targetUser - User being edited
 * @param newPermissions - New permissions to assign
 * @returns Validation result with error/warning messages
 */
export function validatePermissionChange(
  currentUser: AdminUser,
  targetUser: AdminUser,
  newPermissions: string[]
): ValidationResult {
  const warnings: string[] = [];

  // Rule 1: Only super_admin can edit permissions
  if (currentUser.adminRole !== 'super_admin') {
    return {
      valid: false,
      error: 'Only super administrators can edit permissions',
    };
  }

  // Rule 2: Cannot self-grant permissions (prevent privilege escalation)
  if (currentUser.id === targetUser.id) {
    return {
      valid: false,
      error: 'Cannot modify your own permissions (privilege escalation prevention)',
    };
  }

  // Rule 3: Cannot grant permissions outside entity scope
  if (targetUser.entityScope) {
    const entityPrefix = targetUser.entityScope === 'kids_ascension' ? 'ka' : 'ol';
    const invalidPermissions = newPermissions.filter((p) => {
      // Allow cross-platform permissions (no entity prefix)
      if (!p.includes('.') || p === '*') return false;

      // Allow wildcards that match entity
      if (p.startsWith(`${entityPrefix}.`)) return false;
      if (p.startsWith('*.')) return false;

      // Check if it's an entity-specific permission for wrong entity
      const otherPrefix = entityPrefix === 'ka' ? 'ol' : 'ka';
      return p.startsWith(`${otherPrefix}.`);
    });

    if (invalidPermissions.length > 0) {
      return {
        valid: false,
        error: `Cannot grant permissions outside entity scope: ${invalidPermissions.join(', ')}`,
      };
    }
  }

  // Rule 4: Wildcard permissions show warning
  const wildcardPermissions = newPermissions.filter((p) => p.includes('*'));
  if (wildcardPermissions.length > 0) {
    warnings.push(
      `Wildcard permissions grant broad access: ${wildcardPermissions.join(', ')}`
    );
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// Permission Matrix Formatting
// ============================================================================

export interface PermissionMatrixRow {
  permissionKey: string;
  permissionLabel: string;
  description: string | null;
  category: string | null;
  entityScope: string | null;
  rolePermissions: Record<AdminRole, boolean | 'wildcard'>;
}

/**
 * Format permission matrix for UI grid
 *
 * @param roles - Array of roles to include in matrix
 * @param permissions - All available permissions
 * @returns Array of permission matrix rows
 */
export function formatPermissionMatrix(
  roles: AdminRole[],
  permissions: AdminPermission[]
): PermissionMatrixRow[] {
  return permissions.map((permission) => {
    const rolePermissions: Record<AdminRole, boolean | 'wildcard'> = {} as any;

    for (const role of roles) {
      const source = getPermissionSource(permission.permissionKey, role, []);

      if (source === 'wildcard') {
        rolePermissions[role] = 'wildcard';
      } else if (source === 'role') {
        rolePermissions[role] = true;
      } else {
        rolePermissions[role] = false;
      }
    }

    return {
      permissionKey: permission.permissionKey,
      permissionLabel: permission.permissionLabel,
      description: permission.description,
      category: permission.category,
      entityScope: permission.entityScope,
      rolePermissions,
    };
  });
}

// ============================================================================
// Permission Diff (for audit logging)
// ============================================================================

export interface PermissionDiff {
  added: string[];
  removed: string[];
  unchanged: string[];
}

/**
 * Compute diff between two permission sets
 *
 * @param before - Old permission array
 * @param after - New permission array
 * @returns Diff object with added, removed, unchanged permissions
 */
export function computePermissionDiff(
  before: string[],
  after: string[]
): PermissionDiff {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);

  const added = after.filter((p) => !beforeSet.has(p));
  const removed = before.filter((p) => !afterSet.has(p));
  const unchanged = before.filter((p) => afterSet.has(p));

  return {
    added: added.sort(),
    removed: removed.sort(),
    unchanged: unchanged.sort(),
  };
}

// ============================================================================
// Permission Grouping (for UI)
// ============================================================================

