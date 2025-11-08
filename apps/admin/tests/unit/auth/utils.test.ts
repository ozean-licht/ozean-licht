/**
 * Unit Tests for Authentication Utilities
 *
 * Tests password hashing, token generation, and related utilities.
 */

import { hashPassword, verifyPassword, generateSessionToken } from '@/lib/auth/utils';
import { SESSION_TOKEN_BYTES } from '@/lib/auth/constants';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'testPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // bcrypt uses random salt
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123!';
      const wrongPassword = 'wrongPassword456!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should handle invalid hash gracefully', async () => {
      const password = 'testPassword123!';
      const invalidHash = 'not-a-valid-bcrypt-hash';
      const isValid = await verifyPassword(password, invalidHash);

      expect(isValid).toBe(false);
    });

    it('should handle empty password verification', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateSessionToken', () => {
    it('should generate a token', () => {
      const token = generateSessionToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(SESSION_TOKEN_BYTES * 2); // hex encoding
    });

    it('should generate unique tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).not.toBe(token2);
    });

    it('should generate tokens with only hex characters', () => {
      const token = generateSessionToken();
      const hexRegex = /^[0-9a-f]+$/;

      expect(hexRegex.test(token)).toBe(true);
    });

    it('should generate multiple unique tokens', () => {
      const tokens = new Set<string>();
      const count = 100;

      for (let i = 0; i < count; i++) {
        tokens.add(generateSessionToken());
      }

      // All tokens should be unique
      expect(tokens.size).toBe(count);
    });
  });
});
