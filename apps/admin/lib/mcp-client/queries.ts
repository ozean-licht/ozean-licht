/**
 * Query operations for admin entities
 */

import { randomUUID } from 'crypto';
import { MCPGatewayClient } from './client';
import {
  AdminUser,
  AdminRole,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  AdminUserFilters,
  AdminRoleDefinition,
  AdminPermission,
  AdminAuditLog,
  CreateAuditLogInput,
  AuditLogFilters,
  AdminSession,
  CreateSessionInput,
} from '../../types/admin';
import {
  AdminUserRow,
  AdminRoleRow,
  AdminPermissionRow,
  AdminAuditLogRow,
  AdminSessionRow,
} from '../../types/database';
import {
  User,
  UserEntity,
  UserFilters,
  UserListResponse,
  UserDetail,
  EntityType,
} from '../../types/user';
import {
  OAuthProviderRow,
  UserWithEntitiesRow,
} from '../../types/database-users';

/**
 * Extended MCP Gateway Client with query operations
 */
export class MCPGatewayClientWithQueries extends MCPGatewayClient {
  // ============================================================================
  // Admin User Operations
  // ============================================================================

  /**
   * Get admin user by ID
   */
  async getAdminUserById(id: string): Promise<AdminUser | null> {
    const sql = `
      SELECT id, user_id, admin_role, entity_scope, is_active,
             permissions, created_at, created_by, updated_at, updated_by, last_login_at
      FROM admin_users
      WHERE id = $1
    `;

    const rows = await this.query<AdminUserRow>(sql, [id]);
    return rows.length > 0 ? this._mapAdminUser(rows[0]) : null;
  }

  /**
   * Get admin user by user ID
   */
  async getAdminUserByUserId(userId: string): Promise<AdminUser | null> {
    const sql = `
      SELECT id, user_id, admin_role, entity_scope, is_active,
             permissions, created_at, created_by, updated_at, updated_by, last_login_at
      FROM admin_users
      WHERE user_id = $1
    `;

    const rows = await this.query<AdminUserRow>(sql, [userId]);
    return rows.length > 0 ? this._mapAdminUser(rows[0]) : null;
  }

  /**
   * Create a new admin user
   */
  async createAdminUser(data: CreateAdminUserInput): Promise<AdminUser> {
    const sql = `
      INSERT INTO admin_users (
        user_id, admin_role, entity_scope, permissions, created_by
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, admin_role, entity_scope, is_active,
                permissions, created_at, created_by, updated_at, updated_by, last_login_at
    `;

    const rows = await this.query<AdminUserRow>(sql, [
      data.userId,
      data.adminRole,
      data.entityScope || null,
      JSON.stringify(data.permissions || []),
      data.createdBy || null,
    ]);

    return this._mapAdminUser(rows[0]);
  }

  /**
   * Update an admin user
   */
  async updateAdminUser(id: string, data: UpdateAdminUserInput): Promise<AdminUser> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.adminRole !== undefined) {
      updates.push(`admin_role = $${paramIndex++}`);
      params.push(data.adminRole);
    }

    if (data.entityScope !== undefined) {
      updates.push(`entity_scope = $${paramIndex++}`);
      params.push(data.entityScope);
    }

    if (data.permissions !== undefined) {
      updates.push(`permissions = $${paramIndex++}`);
      params.push(JSON.stringify(data.permissions));
    }

    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      params.push(data.isActive);
    }

    if (data.lastLoginAt !== undefined) {
      updates.push(`last_login_at = $${paramIndex++}`);
      params.push(data.lastLoginAt);
    }

    if (data.updatedBy !== undefined) {
      updates.push(`updated_by = $${paramIndex++}`);
      params.push(data.updatedBy);
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `
      UPDATE admin_users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, user_id, admin_role, entity_scope, is_active,
                permissions, created_at, created_by, updated_at, updated_by, last_login_at
    `;

    const rows = await this.query<AdminUserRow>(sql, params);
    return this._mapAdminUser(rows[0]);
  }

  /**
   * List admin users with filters
   */
  async listAdminUsers(filters?: AdminUserFilters): Promise<AdminUser[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.adminRole) {
      conditions.push(`admin_role = $${paramIndex++}`);
      params.push(filters.adminRole);
    }

    if (filters?.entityScope !== undefined) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(filters.entityScope);
    }

    if (filters?.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(filters.isActive);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    const sql = `
      SELECT id, user_id, admin_role, entity_scope, is_active,
             permissions, created_at, created_by, updated_at, updated_by, last_login_at
      FROM admin_users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.query<AdminUserRow>(sql, params);
    return rows.map((row) => this._mapAdminUser(row));
  }

  /**
   * Deactivate an admin user (soft delete)
   */
  async deactivateAdminUser(id: string): Promise<void> {
    const sql = `
      UPDATE admin_users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `;

    await this.execute(sql, [id]);
  }

  /**
   * Map database row to AdminUser
   */
  private _mapAdminUser(row: AdminUserRow): AdminUser {
    // Filter out unsupported roles (like ka_admin which is for Kids Ascension)
    const adminRole = row.admin_role as AdminRole;
    const validRoles: AdminRole[] = ['super_admin', 'ol_admin', 'ol_editor', 'ol_content', 'ol_commerce', 'support'];

    return {
      id: row.id,
      userId: row.user_id,
      adminRole: validRoles.includes(adminRole) ? adminRole : 'support',
      entityScope: row.entity_scope,
      isActive: row.is_active,
      permissions: row.permissions,
      createdAt: new Date(row.created_at),
      createdBy: row.created_by,
      updatedAt: new Date(row.updated_at),
      updatedBy: row.updated_by,
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : null,
    };
  }

  // ============================================================================
  // Admin Role Operations
  // ============================================================================

  /**
   * Get admin role by ID
   */
  async getAdminRoleById(id: string): Promise<AdminRoleDefinition | null> {
    const sql = `
      SELECT id, role_name, role_label, description,
             default_permissions, entity_scope, is_system_role,
             created_at, updated_at
      FROM admin_roles
      WHERE id = $1
    `;

    const rows = await this.query<AdminRoleRow>(sql, [id]);
    return rows.length > 0 ? this._mapAdminRole(rows[0]) : null;
  }

  /**
   * Get admin role by name
   */
  async getAdminRoleByName(name: string): Promise<AdminRoleDefinition | null> {
    const sql = `
      SELECT id, role_name, role_label, description,
             default_permissions, entity_scope, is_system_role,
             created_at, updated_at
      FROM admin_roles
      WHERE role_name = $1
    `;

    const rows = await this.query<AdminRoleRow>(sql, [name]);
    return rows.length > 0 ? this._mapAdminRole(rows[0]) : null;
  }

  /**
   * List all admin roles
   */
  async listAdminRoles(): Promise<AdminRoleDefinition[]> {
    const sql = `
      SELECT id, role_name, role_label, description,
             default_permissions, entity_scope, is_system_role,
             created_at, updated_at
      FROM admin_roles
      ORDER BY role_name
    `;

    const rows = await this.query<AdminRoleRow>(sql);
    return rows.map((row) => this._mapAdminRole(row));
  }

  /**
   * Map database row to AdminRoleDefinition
   */
  private _mapAdminRole(row: AdminRoleRow): AdminRoleDefinition {
    return {
      id: row.id,
      roleName: row.role_name,
      roleLabel: row.role_label,
      description: row.description,
      defaultPermissions: row.default_permissions,
      entityScope: row.entity_scope,
      isSystemRole: row.is_system_role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // ============================================================================
  // Admin Permission Operations
  // ============================================================================

  /**
   * List admin permissions
   */
  async listAdminPermissions(category?: string): Promise<AdminPermission[]> {
    let sql = `
      SELECT id, permission_key, permission_label, description,
             category, entity_scope, created_at
      FROM admin_permissions
    `;

    const params: any[] = [];

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY category, permission_key';

    const rows = await this.query<AdminPermissionRow>(sql, params);
    return rows.map((row) => this._mapAdminPermission(row));
  }

  /**
   * Check if admin user has a specific permission
   */
  async checkPermission(adminUserId: string, permissionKey: string): Promise<boolean> {
    // Get admin user
    const adminUser = await this.getAdminUserById(adminUserId);
    if (!adminUser || !adminUser.isActive) {
      return false;
    }

    // Check wildcard permission (*)
    if (adminUser.permissions.includes('*')) {
      return true;
    }

    // Check exact permission match
    if (adminUser.permissions.includes(permissionKey)) {
      return true;
    }

    // Check wildcard category match (e.g., 'users.*' matches 'users.read')
    const parts = permissionKey.split('.');
    if (parts.length >= 2) {
      const category = parts[0];
      if (adminUser.permissions.includes(`${category}.*`)) {
        return true;
      }

      // Check wildcard action match (e.g., '*.read' matches 'users.read')
      const action = parts[parts.length - 1];
      if (adminUser.permissions.includes(`*.${action}`)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Map database row to AdminPermission
   */
  private _mapAdminPermission(row: AdminPermissionRow): AdminPermission {
    return {
      id: row.id,
      permissionKey: row.permission_key,
      permissionLabel: row.permission_label,
      description: row.description,
      category: row.category,
      entityScope: row.entity_scope,
      createdAt: new Date(row.created_at),
    };
  }

  // ============================================================================
  // Audit Log Operations
  // ============================================================================

  /**
   * Create an audit log entry
   */
  async createAuditLog(data: CreateAuditLogInput): Promise<AdminAuditLog> {
    const sql = `
      INSERT INTO admin_audit_logs (
        admin_user_id, action, entity_type, entity_id,
        entity_scope, metadata, ip_address, user_agent, request_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, admin_user_id, action, entity_type, entity_id,
                entity_scope, metadata, ip_address, user_agent, request_id, created_at
    `;

    const rows = await this.query<AdminAuditLogRow>(sql, [
      data.adminUserId,
      data.action,
      data.entityType || null,
      data.entityId || null,
      data.entityScope || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.ipAddress || null,
      data.userAgent || null,
      data.requestId || randomUUID(),
    ]);

    return this._mapAuditLog(rows[0]);
  }

  /**
   * List audit logs with filters
   */
  async listAuditLogs(filters: AuditLogFilters): Promise<AdminAuditLog[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.adminUserId) {
      conditions.push(`admin_user_id = $${paramIndex++}`);
      params.push(filters.adminUserId);
    }

    if (filters.action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(filters.action);
    }

    if (filters.entityType) {
      conditions.push(`entity_type = $${paramIndex++}`);
      params.push(filters.entityType);
    }

    if (filters.entityId) {
      conditions.push(`entity_id = $${paramIndex++}`);
      params.push(filters.entityId);
    }

    if (filters.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(filters.entityScope);
    }

    if (filters.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(filters.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;

    const sql = `
      SELECT id, admin_user_id, action, entity_type, entity_id,
             entity_scope, metadata, ip_address, user_agent, request_id, created_at
      FROM admin_audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.query<AdminAuditLogRow>(sql, params);
    return rows.map((row) => this._mapAuditLog(row));
  }

  /**
   * Map database row to AdminAuditLog
   */
  private _mapAuditLog(row: AdminAuditLogRow): AdminAuditLog {
    return {
      id: row.id,
      adminUserId: row.admin_user_id,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      entityScope: row.entity_scope,
      metadata: row.metadata,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      requestId: row.request_id,
      createdAt: new Date(row.created_at),
    };
  }

  // ============================================================================
  // Session Operations
  // ============================================================================

  /**
   * Create a new admin session
   */
  async createSession(data: CreateSessionInput): Promise<AdminSession> {
    const ttl = data.ttlSeconds || 86400; // Default: 24 hours
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const sql = `
      INSERT INTO admin_sessions (
        admin_user_id, session_token, ip_address, user_agent, expires_at
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, admin_user_id, session_token, ip_address, user_agent,
                expires_at, created_at, last_activity_at
    `;

    const rows = await this.query<AdminSessionRow>(sql, [
      data.adminUserId,
      data.sessionToken,
      data.ipAddress,
      data.userAgent || null,
      expiresAt,
    ]);

    return this._mapSession(rows[0]);
  }

  /**
   * Get session by token
   */
  async getSessionByToken(token: string): Promise<AdminSession | null> {
    const sql = `
      SELECT id, admin_user_id, session_token, ip_address, user_agent,
             expires_at, created_at, last_activity_at
      FROM admin_sessions
      WHERE session_token = $1 AND expires_at > NOW()
    `;

    const rows = await this.query<AdminSessionRow>(sql, [token]);
    return rows.length > 0 ? this._mapSession(rows[0]) : null;
  }

  /**
   * Update session activity timestamp
   */
  async updateSessionActivity(token: string): Promise<void> {
    const sql = `
      UPDATE admin_sessions
      SET last_activity_at = NOW()
      WHERE session_token = $1
    `;

    await this.execute(sql, [token]);
  }

  /**
   * Delete a session (logout)
   */
  async deleteSession(token: string): Promise<void> {
    const sql = `
      DELETE FROM admin_sessions
      WHERE session_token = $1
    `;

    await this.execute(sql, [token]);
  }

  /**
   * Delete expired sessions (cleanup job)
   */
  async deleteExpiredSessions(): Promise<number> {
    const sql = `
      DELETE FROM admin_sessions
      WHERE expires_at < NOW()
    `;

    return await this.execute(sql);
  }

  /**
   * Map database row to AdminSession
   */
  private _mapSession(row: AdminSessionRow): AdminSession {
    return {
      id: row.id,
      adminUserId: row.admin_user_id,
      sessionToken: row.session_token,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      expiresAt: new Date(row.expires_at),
      createdAt: new Date(row.created_at),
      lastActivityAt: new Date(row.last_activity_at),
    };
  }

  // ============================================================================
  // User Operations
  // ============================================================================

  /**
   * List users with filters and pagination
   */
  async listUsers(filters?: UserFilters): Promise<UserListResponse> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters?.search) {
      conditions.push(`(u.email ILIKE $${paramIndex} OR u.id::text ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.emailVerified !== undefined) {
      conditions.push(`u.email_verified = $${paramIndex}`);
      params.push(filters.emailVerified);
      paramIndex++;
    }

    if (filters?.createdAfter) {
      conditions.push(`u.created_at >= $${paramIndex}`);
      params.push(filters.createdAfter.toISOString());
      paramIndex++;
    }

    if (filters?.createdBefore) {
      conditions.push(`u.created_at <= $${paramIndex}`);
      params.push(filters.createdBefore.toISOString());
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Handle entity filter (special case: needs subquery or join)
    let entityFilter = '';
    if (filters?.entityId && filters.entityId !== 'both') {
      entityFilter = `
        AND EXISTS (
          SELECT 1 FROM user_entities ue
          WHERE ue.user_id = u.id AND ue.entity_id = $${paramIndex}
        )
      `;
      params.push(filters.entityId);
      paramIndex++;
    } else if (filters?.entityId === 'both') {
      // User must have both entities
      entityFilter = `
        AND (
          SELECT COUNT(DISTINCT ue.entity_id)
          FROM user_entities ue
          WHERE ue.user_id = u.id
        ) = 2
      `;
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    // Get total count
    const countSql = `
      SELECT COUNT(*) as count
      FROM users u
      ${whereClause}
      ${entityFilter}
    `;

    const countRows = await this.query<{ count: string }>(countSql, params.slice(0, paramIndex - 1));
    const total = parseInt(countRows[0].count, 10);

    // Get users with entities (aggregated)
    const sql = `
      SELECT
        u.id,
        u.email,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ue.id,
              'entity_id', ue.entity_id,
              'role', ue.role,
              'created_at', ue.created_at
            )
          ) FILTER (WHERE ue.id IS NOT NULL),
          '[]'
        ) as entities
      FROM users u
      LEFT JOIN user_entities ue ON u.id = ue.user_id
      ${whereClause}
      ${entityFilter}
      GROUP BY u.id, u.email, u.email_verified, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.query<UserWithEntitiesRow>(sql, params);

    const users = rows.map((row) => this._mapUserWithEntities(row));

    return {
      users,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get user by ID with entities
   */
  async getUserById(id: string): Promise<User | null> {
    const sql = `
      SELECT
        u.id,
        u.email,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ue.id,
              'entity_id', ue.entity_id,
              'role', ue.role,
              'created_at', ue.created_at
            )
          ) FILTER (WHERE ue.id IS NOT NULL),
          '[]'
        ) as entities
      FROM users u
      LEFT JOIN user_entities ue ON u.id = ue.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.email, u.email_verified, u.created_at, u.updated_at
    `;

    const rows = await this.query<UserWithEntitiesRow>(sql, [id]);
    return rows.length > 0 ? this._mapUserWithEntities(rows[0]) : null;
  }

  /**
   * Get user detail with OAuth providers
   */
  async getUserDetail(id: string): Promise<UserDetail | null> {
    const user = await this.getUserById(id);

    if (!user) {
      return null;
    }

    // Get OAuth providers
    const oauthSql = `
      SELECT id, provider, provider_user_id, created_at
      FROM oauth_providers
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const oauthRows = await this.query<OAuthProviderRow>(oauthSql, [id]);

    const oauthProviders = oauthRows.map((row) => ({
      id: row.id,
      provider: row.provider,
      providerUserId: row.provider_user_id,
      createdAt: new Date(row.created_at),
    }));

    // TODO: Get activity metrics (last_login_at, login_count)
    // This requires session tracking or audit log integration
    // For now, return placeholder values

    return {
      ...user,
      oauthProviders,
      lastLoginAt: null, // TODO: Implement session tracking
      loginCount: 0, // TODO: Implement login count
    };
  }

  /**
   * Map database row to User
   */
  private _mapUserWithEntities(row: UserWithEntitiesRow): User {
    // Parse aggregated entities JSON
    const entitiesArray = typeof row.entities === 'string'
      ? JSON.parse(row.entities)
      : row.entities;

    const entities: UserEntity[] = entitiesArray.map((e: any) => ({
      id: e.id,
      userId: row.id,
      entityId: e.entity_id as EntityType,
      role: e.role,
      createdAt: new Date(e.created_at),
    }));

    return {
      id: row.id,
      email: row.email,
      emailVerified: row.email_verified && typeof row.email_verified !== 'boolean' ? new Date(row.email_verified) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      entities,
    };
  }
}
