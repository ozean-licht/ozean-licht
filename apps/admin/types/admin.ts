/**
 * Admin domain types
 * These are the application-level types used by the MCP client
 */

/**
 * Admin user role types
 * Note: This admin dashboard is exclusively for Ozean Licht platform
 */
export type AdminRole = 'super_admin' | 'ol_admin' | 'ol_editor' | 'support';

/**
 * Entity scope types
 * Note: Only Ozean Licht platform is supported
 */
export type EntityScope = 'ozean_licht' | null;

/**
 * Admin user entity
 */
export interface AdminUser {
  id: string;
  userId: string;
  adminRole: AdminRole;
  entityScope: string | null;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  lastLoginAt: Date | null;
}

/**
 * Input for creating an admin user
 */
export interface CreateAdminUserInput {
  userId: string;
  adminRole: AdminRole;
  entityScope?: string | null;
  permissions?: string[];
  createdBy?: string;
}

/**
 * Input for updating an admin user
 */
export interface UpdateAdminUserInput {
  adminRole?: AdminRole;
  entityScope?: string | null;
  permissions?: string[];
  isActive?: boolean;
  updatedBy?: string;
  lastLoginAt?: Date;
}

/**
 * Filters for listing admin users
 */
export interface AdminUserFilters {
  adminRole?: AdminRole;
  entityScope?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Admin role definition
 */
export interface AdminRoleDefinition {
  id: string;
  roleName: string;
  roleLabel: string;
  description: string | null;
  defaultPermissions: string[];
  entityScope: string | null;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin permission definition
 */
export interface AdminPermission {
  id: string;
  permissionKey: string;
  permissionLabel: string;
  description: string | null;
  category: string | null;
  entityScope: string | null;
  createdAt: Date;
}

/**
 * Admin audit log entry
 */
export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  entityScope: string | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: Date;
}

/**
 * Input for creating an audit log entry
 */
export interface CreateAuditLogInput {
  adminUserId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  entityScope?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/**
 * Filters for listing audit logs
 */
export interface AuditLogFilters {
  adminUserId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  entityScope?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Admin session
 */
export interface AdminSession {
  id: string;
  adminUserId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
}

/**
 * Input for creating an admin session
 */
export interface CreateSessionInput {
  adminUserId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent?: string;
  ttlSeconds?: number; // Time to live in seconds (default: 86400 = 24 hours)
}
