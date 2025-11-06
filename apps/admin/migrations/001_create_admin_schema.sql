-- Migration: 001_create_admin_schema.sql
-- Description: Create admin-specific tables in shared_users_db
-- Created: 2025-10-24
-- ADW ID: 61c79c41

-- Admin Users Table
-- Links to shared users table for authentication, adds admin-specific fields
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_role VARCHAR(50) NOT NULL, -- 'super_admin', 'ka_admin', 'ol_admin', 'support'
    entity_scope VARCHAR(50), -- NULL for super_admin, 'kids_ascension' or 'ozean_licht' for entity admins
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '[]'::jsonb, -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    last_login_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id), -- Each user can only have one admin account
    CONSTRAINT valid_role CHECK (admin_role IN ('super_admin', 'ka_admin', 'ol_admin', 'support')),
    CONSTRAINT entity_scope_required CHECK (
        (admin_role = 'super_admin' AND entity_scope IS NULL) OR
        (admin_role != 'super_admin' AND entity_scope IS NOT NULL)
    )
);

-- Admin Roles Table
-- Defines available roles and their default permissions
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_label VARCHAR(100) NOT NULL, -- Human-readable name
    description TEXT,
    default_permissions JSONB DEFAULT '[]'::jsonb,
    entity_scope VARCHAR(50), -- NULL for cross-platform roles
    is_system_role BOOLEAN DEFAULT false, -- System roles can't be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Permissions Table
-- Defines granular permissions available in the system
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'users.read', 'videos.approve'
    permission_label VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- e.g., 'users', 'videos', 'system'
    entity_scope VARCHAR(50), -- NULL for cross-platform, or 'kids_ascension'/'ozean_licht'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Audit Logs Table
-- Comprehensive audit trail for all admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- e.g., 'user.create', 'video.approve', 'settings.update'
    entity_type VARCHAR(50), -- e.g., 'user', 'video', 'course'
    entity_id UUID, -- ID of the affected entity
    entity_scope VARCHAR(50), -- 'kids_ascension', 'ozean_licht', or NULL
    metadata JSONB, -- Action-specific data (before/after values, etc.)
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100), -- Correlation ID for distributed tracing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table
-- Track active admin sessions for security monitoring
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET NOT NULL,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(admin_role);
CREATE INDEX IF NOT EXISTS idx_admin_users_entity_scope ON admin_users(entity_scope);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

CREATE INDEX IF NOT EXISTS idx_admin_roles_role_name ON admin_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_admin_roles_entity_scope ON admin_roles(entity_scope);

CREATE INDEX IF NOT EXISTS idx_admin_permissions_key ON admin_permissions(permission_key);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_category ON admin_permissions(category);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_entity_scope ON admin_permissions(entity_scope);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity_type ON admin_audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity_id ON admin_audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Seed data: Insert system roles
INSERT INTO admin_roles (role_name, role_label, description, default_permissions, entity_scope, is_system_role)
VALUES
    ('super_admin', 'Super Administrator', 'Full access to all platforms and settings', '["*"]'::jsonb, NULL, true),
    ('ka_admin', 'Kids Ascension Admin', 'Full access to Kids Ascension platform', '["ka.*"]'::jsonb, 'kids_ascension', true),
    ('ol_admin', 'Ozean Licht Admin', 'Full access to Ozean Licht platform', '["ol.*"]'::jsonb, 'ozean_licht', true),
    ('support', 'Support Staff', 'Read-only access for support purposes', '["*.read"]'::jsonb, NULL, true)
ON CONFLICT (role_name) DO NOTHING;

-- Seed data: Insert base permissions
INSERT INTO admin_permissions (permission_key, permission_label, description, category, entity_scope)
VALUES
    -- User management permissions
    ('users.read', 'Read Users', 'View user information', 'users', NULL),
    ('users.create', 'Create Users', 'Create new user accounts', 'users', NULL),
    ('users.update', 'Update Users', 'Modify user information', 'users', NULL),
    ('users.delete', 'Delete Users', 'Remove user accounts', 'users', NULL),

    -- Kids Ascension specific permissions
    ('ka.videos.read', 'Read KA Videos', 'View videos in Kids Ascension', 'videos', 'kids_ascension'),
    ('ka.videos.approve', 'Approve KA Videos', 'Approve/reject video uploads', 'videos', 'kids_ascension'),
    ('ka.videos.delete', 'Delete KA Videos', 'Remove videos from platform', 'videos', 'kids_ascension'),

    -- Ozean Licht specific permissions
    ('ol.courses.read', 'Read OL Courses', 'View courses in Ozean Licht', 'courses', 'ozean_licht'),
    ('ol.courses.create', 'Create OL Courses', 'Create new courses', 'courses', 'ozean_licht'),
    ('ol.courses.update', 'Update OL Courses', 'Modify course content', 'courses', 'ozean_licht'),
    ('ol.courses.delete', 'Delete OL Courses', 'Remove courses from platform', 'courses', 'ozean_licht'),

    -- System permissions
    ('system.settings.read', 'Read System Settings', 'View system configuration', 'system', NULL),
    ('system.settings.update', 'Update System Settings', 'Modify system configuration', 'system', NULL),
    ('system.logs.read', 'Read System Logs', 'View audit logs and system logs', 'system', NULL)
ON CONFLICT (permission_key) DO NOTHING;

/*
-- ROLLBACK SQL (for development only - uncomment to rollback)
-- WARNING: This will delete all admin data!

DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
*/
