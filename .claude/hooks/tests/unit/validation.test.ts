/**
 * Unit tests for validation utility
 */

import {
  loadToolCatalog,
  getToolMetadata,
  validateToolExists,
  validateDestructiveOperation,
  validateSecretExposure,
  combineValidationResults,
} from '../../src/utils/validation';
import { HookInput, ValidationResult } from '../../src/types';

describe('Validation Utilities', () => {
  describe('loadToolCatalog', () => {
    it('should load tool catalog', () => {
      const catalog = loadToolCatalog();
      expect(catalog).toBeDefined();
      expect(catalog?.tools).toBeDefined();
    });

    it('should cache tool catalog', () => {
      const catalog1 = loadToolCatalog();
      const catalog2 = loadToolCatalog();
      expect(catalog1).toBe(catalog2); // Same reference due to caching
    });
  });

  describe('getToolMetadata', () => {
    it('should get metadata for existing tool', () => {
      const metadata = getToolMetadata('postgres');
      expect(metadata).toBeDefined();
      expect(metadata?.name).toContain('PostgreSQL');
    });

    it('should return null for non-existent tool', () => {
      const metadata = getToolMetadata('non-existent-tool');
      expect(metadata).toBeNull();
    });

    it('should handle case-insensitive lookup', () => {
      const metadata1 = getToolMetadata('postgres');
      const metadata2 = getToolMetadata('POSTGRES');
      expect(metadata1?.name).toBe(metadata2?.name);
    });
  });

  describe('validateToolExists', () => {
    it('should validate existing tool', () => {
      const result = validateToolExists('postgres');
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should fail validation for non-existent tool', () => {
      const result = validateToolExists('fake-tool-xyz');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.blockers.length).toBeGreaterThan(0);
    });

    it('should provide suggestions for similar tools', () => {
      const result = validateToolExists('postgre');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('validateDestructiveOperation', () => {
    it('should allow non-destructive operations', () => {
      const input: HookInput = {
        tool: 'Bash',
        args: { command: 'ls -la' },
      };
      const result = validateDestructiveOperation(input);
      expect(result.valid).toBe(true);
    });

    it('should detect force push', () => {
      const input: HookInput = {
        tool: 'Bash',
        args: { command: 'git push --force origin main' },
      };
      const result = validateDestructiveOperation(input);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should detect rm -rf', () => {
      const input: HookInput = {
        tool: 'Bash',
        args: { command: 'rm -rf /tmp/data' },
      };
      const result = validateDestructiveOperation(input);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateSecretExposure', () => {
    it('should detect potential secrets', () => {
      const input: HookInput = {
        tool: 'Bash',
        args: { command: 'export API_KEY=abc123' },
      };
      const result = validateSecretExposure(input);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should not flag normal content', () => {
      const input: HookInput = {
        tool: 'Bash',
        args: { command: 'echo "Hello World"' },
      };
      const result = validateSecretExposure(input);
      expect(result.warnings.length).toBe(0);
    });
  });

  describe('combineValidationResults', () => {
    it('should combine multiple results', () => {
      const result1: ValidationResult = {
        valid: true,
        errors: ['error1'],
        warnings: ['warning1'],
        suggestions: [],
        blockers: [],
      };
      const result2: ValidationResult = {
        valid: false,
        errors: ['error2'],
        warnings: ['warning2'],
        suggestions: ['suggestion1'],
        blockers: ['blocker1'],
      };

      const combined = combineValidationResults(result1, result2);
      expect(combined.valid).toBe(false); // One invalid makes all invalid
      expect(combined.errors).toContain('error1');
      expect(combined.errors).toContain('error2');
      expect(combined.warnings).toContain('warning1');
      expect(combined.warnings).toContain('warning2');
      expect(combined.suggestions).toContain('suggestion1');
      expect(combined.blockers).toContain('blocker1');
    });

    it('should deduplicate entries', () => {
      const result1: ValidationResult = {
        valid: true,
        errors: ['error1'],
        warnings: ['warning1'],
        suggestions: [],
        blockers: [],
      };
      const result2: ValidationResult = {
        valid: true,
        errors: ['error1'], // Duplicate
        warnings: ['warning1'], // Duplicate
        suggestions: [],
        blockers: [],
      };

      const combined = combineValidationResults(result1, result2);
      expect(combined.errors.length).toBe(1);
      expect(combined.warnings.length).toBe(1);
    });
  });
});
