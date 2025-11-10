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
      const session = mockSession('ka_admin');
      expect(hasRole(session, 'super_admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has one of the specified roles', () => {
      const session = mockSession('ka_admin');
      expect(hasAnyRole(session, ['super_admin', 'ka_admin'])).toBe(true);
    });

    it('should return false if user has none of the specified roles', () => {
      const session = mockSession('support');
      expect(hasAnyRole(session, ['super_admin', 'ka_admin'])).toBe(false);
    });
  });

  describe('canManageRoles', () => {
    it('should return true for super_admin', () => {
      const session = mockSession('super_admin');
      expect(canManageRoles(session)).toBe(true);
    });

    it('should return false for non-super_admin', () => {
      const session = mockSession('ka_admin');
      expect(canManageRoles(session)).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow super_admin to access all routes', () => {
      expect(canAccessRoute('super_admin', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/users')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/audit')).toBe(true);
    });

    it('should restrict ka_admin to Kids Ascension routes', () => {
      expect(canAccessRoute('ka_admin', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/ozean-licht')).toBe(false);
      expect(canAccessRoute('ka_admin', '/dashboard/users')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/audit')).toBe(false);
    });

    it('should restrict ol_admin to Ozean Licht routes', () => {
      expect(canAccessRoute('ol_admin', '/dashboard/kids-ascension')).toBe(false);
      expect(canAccessRoute('ol_admin', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/users')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/audit')).toBe(false);
    });

    it('should allow support read-only access', () => {
      expect(canAccessRoute('support', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/users')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/audit')).toBe(false);
    });

    it('should handle nested routes correctly', () => {
      expect(canAccessRoute('ka_admin', '/dashboard/kids-ascension/videos')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/ozean-licht/courses')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/ozean-licht/courses')).toBe(false);
    });

    it('should allow all roles to access base dashboard', () => {
      expect(canAccessRoute('super_admin', '/dashboard')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard')).toBe(true);
      expect(canAccessRoute('support', '/dashboard')).toBe(true);
    });

    it('should allow all roles to access health and storage', () => {
      expect(canAccessRoute('super_admin', '/dashboard/health')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/health')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/health')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/health')).toBe(true);

      expect(canAccessRoute('super_admin', '/dashboard/storage')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/storage')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/storage')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/storage')).toBe(true);
    });
  });
});
