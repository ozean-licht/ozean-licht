/**
 * Database schema types
 * Generated from SQL schema in migrations/001_create_admin_schema.sql
 */

/**
 * Raw database row from admin_users table
 */
export interface AdminUserRow {
  id: string;
  user_id: string;
  admin_role: 'super_admin' | 'ka_admin' | 'ol_admin' | 'support';
  entity_scope: string | null;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  last_login_at: string | null;
}

/**
 * Raw database row from admin_roles table
 */
export interface AdminRoleRow {
  id: string;
  role_name: string;
  role_label: string;
  description: string | null;
  default_permissions: string[];
  entity_scope: string | null;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Raw database row from admin_permissions table
 */
export interface AdminPermissionRow {
  id: string;
  permission_key: string;
  permission_label: string;
  description: string | null;
  category: string | null;
  entity_scope: string | null;
  created_at: string;
}

/**
 * Raw database row from admin_audit_logs table
 */
export interface AdminAuditLogRow {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_scope: string | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  request_id: string | null;
  created_at: string;
}

/**
 * Raw database row from admin_sessions table
 */
export interface AdminSessionRow {
  id: string;
  admin_user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string | null;
  expires_at: string;
  created_at: string;
  last_activity_at: string;
}
