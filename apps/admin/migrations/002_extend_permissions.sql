-- ============================================================================
-- Migration 002: Extend Admin Permissions
-- ============================================================================
-- Purpose: Expand permission system from 14 to 57 permissions across 10 categories
-- Author: Admin Dashboard Team
-- Date: 2025-11-09
-- Dependencies: 001_create_admin_schema.sql
-- ============================================================================

-- Insert extended permission set (43 new permissions)
-- Note: Original 14 permissions from migration 001 are preserved via ON CONFLICT

INSERT INTO admin_permissions (permission_key, permission_label, description, category, entity_scope)
VALUES
    -- ========================================================================
    -- Content Management (7 permissions) - 4 new
    -- ========================================================================
    ('content.read', 'Read Content', 'View content items (videos, articles, media)', 'content', NULL),
    ('content.create', 'Create Content', 'Upload and create new content', 'content', NULL),
    ('content.update', 'Update Content', 'Edit and modify existing content', 'content', NULL),
    ('content.delete', 'Delete Content', 'Remove content from the platform', 'content', NULL),
    ('content.approve', 'Approve Content', 'Approve or reject submitted content', 'content', NULL),
    ('content.publish', 'Publish Content', 'Publish approved content to production', 'content', NULL),
    ('content.moderate', 'Moderate Content', 'Review flagged content and take moderation actions', 'content', NULL),

    -- ========================================================================
    -- Course Management (7 permissions) - Ozean Licht
    -- ========================================================================
    ('courses.read', 'Read Courses', 'View course information and structure', 'courses', 'ozean_licht'),
    ('courses.create', 'Create Courses', 'Create new courses and curriculum', 'courses', 'ozean_licht'),
    ('courses.update', 'Update Courses', 'Modify course content and settings', 'courses', 'ozean_licht'),
    ('courses.delete', 'Delete Courses', 'Remove courses from the platform', 'courses', 'ozean_licht'),
    ('courses.publish', 'Publish Courses', 'Publish courses to make them available to members', 'courses', 'ozean_licht'),
    ('courses.enroll', 'Enroll Members', 'Manually enroll members in courses', 'courses', 'ozean_licht'),
    ('courses.export', 'Export Course Data', 'Export course data and analytics', 'courses', 'ozean_licht'),

    -- ========================================================================
    -- Member Management (5 permissions) - Ozean Licht
    -- ========================================================================
    ('members.read', 'Read Members', 'View member profiles and information', 'members', 'ozean_licht'),
    ('members.create', 'Create Members', 'Add new members to the platform', 'members', 'ozean_licht'),
    ('members.update', 'Update Members', 'Modify member profiles and settings', 'members', 'ozean_licht'),
    ('members.delete', 'Delete Members', 'Remove members from the platform', 'members', 'ozean_licht'),
    ('members.export', 'Export Member Data', 'Export member data for reporting', 'members', 'ozean_licht'),

    -- ========================================================================
    -- Classroom Management (5 permissions) - Kids Ascension
    -- ========================================================================
    ('classrooms.read', 'Read Classrooms', 'View classroom information and students', 'classrooms', 'kids_ascension'),
    ('classrooms.create', 'Create Classrooms', 'Create new classrooms', 'classrooms', 'kids_ascension'),
    ('classrooms.update', 'Update Classrooms', 'Modify classroom settings and assignments', 'classrooms', 'kids_ascension'),
    ('classrooms.delete', 'Delete Classrooms', 'Remove classrooms from the platform', 'classrooms', 'kids_ascension'),
    ('classrooms.assign', 'Assign Students', 'Assign students to classrooms', 'classrooms', 'kids_ascension'),

    -- ========================================================================
    -- Payment Management (4 permissions) - Ozean Licht
    -- ========================================================================
    ('payments.read', 'Read Payments', 'View payment transactions and history', 'payments', 'ozean_licht'),
    ('payments.refund', 'Process Refunds', 'Issue refunds to members', 'payments', 'ozean_licht'),
    ('payments.export', 'Export Payment Data', 'Export payment data for accounting', 'payments', 'ozean_licht'),
    ('payments.manage', 'Manage Payments', 'Update payment settings and configurations', 'payments', 'ozean_licht'),

    -- ========================================================================
    -- Analytics (3 permissions)
    -- ========================================================================
    ('analytics.read', 'Read Analytics', 'View analytics dashboards and reports', 'analytics', NULL),
    ('analytics.export', 'Export Analytics', 'Export analytics data and reports', 'analytics', NULL),
    ('analytics.configure', 'Configure Analytics', 'Configure analytics tracking and reports', 'analytics', NULL),

    -- ========================================================================
    -- Settings (6 permissions)
    -- ========================================================================
    ('settings.read', 'Read Settings', 'View system and platform settings', 'settings', NULL),
    ('settings.update', 'Update Settings', 'Modify system and platform settings', 'settings', NULL),
    ('settings.email', 'Email Settings', 'Configure email templates and notifications', 'settings', NULL),
    ('settings.integrations', 'Integration Settings', 'Manage third-party integrations', 'settings', NULL),
    ('settings.storage', 'Storage Settings', 'Configure MinIO and storage settings', 'settings', NULL),
    ('settings.security', 'Security Settings', 'Manage security policies and authentication', 'settings', NULL),

    -- ========================================================================
    -- System Administration (5 permissions)
    -- ========================================================================
    ('system.health', 'System Health', 'View system health and monitoring', 'system', NULL),
    ('system.logs', 'System Logs', 'View and search system logs', 'system', NULL),
    ('system.audit', 'Audit Logs', 'View and export audit logs', 'system', NULL),
    ('system.backup', 'Backup Management', 'Trigger and restore backups', 'system', NULL),
    ('system.maintenance', 'Maintenance Mode', 'Enable/disable maintenance mode', 'system', NULL),

    -- ========================================================================
    -- Admin Management (11 permissions) - NEW CATEGORY
    -- ========================================================================
    ('admin.users.read', 'Read Admin Users', 'View admin user accounts', 'admin_management', NULL),
    ('admin.users.create', 'Create Admin Users', 'Create new admin accounts', 'admin_management', NULL),
    ('admin.users.update', 'Update Admin Users', 'Modify admin user information', 'admin_management', NULL),
    ('admin.users.delete', 'Delete Admin Users', 'Remove admin accounts', 'admin_management', NULL),
    ('admin.roles.manage', 'Manage Roles', 'Assign and modify admin roles', 'admin_management', NULL),
    ('admin.permissions.read', 'Read Permissions', 'View permission matrix and assignments', 'admin_management', NULL),
    ('admin.permissions.assign', 'Assign Permissions', 'Grant or revoke permissions for admin users', 'admin_management', NULL),
    ('admin.sessions.read', 'Read Admin Sessions', 'View active admin sessions', 'admin_management', NULL),
    ('admin.sessions.revoke', 'Revoke Admin Sessions', 'Terminate active admin sessions', 'admin_management', NULL),
    ('admin.audit.read', 'Read Admin Audit Logs', 'View admin action audit logs', 'admin_management', NULL),
    ('admin.audit.export', 'Export Admin Audit Logs', 'Export admin audit logs for compliance', 'admin_management', NULL)

ON CONFLICT (permission_key) DO UPDATE SET
    permission_label = EXCLUDED.permission_label,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    entity_scope = EXCLUDED.entity_scope;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify migration success:
--
-- SELECT category, COUNT(*) as count
-- FROM admin_permissions
-- GROUP BY category
-- ORDER BY category;
--
-- Expected output:
--   admin_management | 11
--   analytics        |  3
--   classrooms       |  5
--   content          |  7
--   courses          |  7
--   members          |  5
--   payments         |  4
--   settings         |  6
--   system           |  5
--   users            |  4
--   videos           |  3 (from migration 001 - KA specific)
--
-- Total: 60 permissions (57 from this spec + 3 legacy from migration 001)
-- ============================================================================
