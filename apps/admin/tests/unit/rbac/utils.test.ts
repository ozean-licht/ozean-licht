import { hasRole, hasAnyRole, canManageRoles } from '@/lib/rbac/utils';
import { canAccessRoute } from '@/lib/rbac/constants';
import type { Session } from 'next-auth';

describe('RBAC Utilities', () => {
  const mockSession = (role: string): Session => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      adminUserId: 'test-admin-id',
      adminRole: role,
      permissions: [],
      entityScope: null,
    },
    expires: '2025-12-31',
  });

  describe('hasRole', () => {
    it('should return true for exact role match', () => {
      const session = mockSession('super_admin');
      expect(hasRole(session, 'super_admin')).toBe(true);
    });

    it('should return false for different role', () => {
      const session = mockSession('ol_admin');
      expect(hasRole(session, 'super_admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has one of the specified roles', () => {
      const session = mockSession('ol_admin');
      expect(hasAnyRole(session, ['super_admin', 'ol_admin'])).toBe(true);
    });

    it('should return false if user has none of the specified roles', () => {
      const session = mockSession('support');
      expect(hasAnyRole(session, ['super_admin', 'ol_admin'])).toBe(false);
    });
  });

  describe('canManageRoles', () => {
    it('should return true for super_admin', () => {
      const session = mockSession('super_admin');
      expect(canManageRoles(session)).toBe(true);
    });

    it('should return false for non-super_admin', () => {
      const session = mockSession('ol_admin');
      expect(canManageRoles(session)).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow super_admin to access all routes', () => {
      expect(canAccessRoute('super_admin', '/dashboard/access/users')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/content')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/members')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/system')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/audit')).toBe(true);
    });

    it('should allow ol_admin to access admin routes', () => {
      expect(canAccessRoute('ol_admin', '/dashboard/access/users')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/access/permissions')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/content')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/members')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/system')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/settings')).toBe(true);
    });

    it('should restrict ol_editor to content and member routes', () => {
      expect(canAccessRoute('ol_editor', '/dashboard/access/users')).toBe(false);
      expect(canAccessRoute('ol_editor', '/dashboard/access/permissions')).toBe(false);
      expect(canAccessRoute('ol_editor', '/dashboard/content')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard/members')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard/analytics')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard/settings')).toBe(false);
    });

    it('should allow support read-only access to system routes', () => {
      expect(canAccessRoute('support', '/dashboard/access/users')).toBe(false);
      expect(canAccessRoute('support', '/dashboard/system')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/content')).toBe(false);
      expect(canAccessRoute('support', '/dashboard/audit')).toBe(false);
    });

    it('should handle nested routes correctly', () => {
      expect(canAccessRoute('ol_admin', '/dashboard/access/users/123')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard/content/courses/456')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard/access/users/123')).toBe(false);
    });

    it('should allow all roles to access base dashboard', () => {
      expect(canAccessRoute('super_admin', '/dashboard')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard')).toBe(true);
      expect(canAccessRoute('ol_editor', '/dashboard')).toBe(true);
      expect(canAccessRoute('support', '/dashboard')).toBe(true);
    });

    it('should restrict audit access to super_admin only', () => {
      expect(canAccessRoute('super_admin', '/dashboard/audit')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/audit')).toBe(false);
      expect(canAccessRoute('ol_editor', '/dashboard/audit')).toBe(false);
      expect(canAccessRoute('support', '/dashboard/audit')).toBe(false);
    });
  });
});
