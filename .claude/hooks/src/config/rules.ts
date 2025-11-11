/**
 * Validation rules configuration
 */

import { ValidationRule, HookInput, ValidationResult } from '../types';
import { validateDestructiveOperation, validateSecretExposure, validateSensitivePaths } from '../utils/validation';
import { isMainBranch } from '../utils/git';

/**
 * Security rules
 */
export const securityRules: ValidationRule[] = [
  {
    name: 'no-exposed-secrets',
    description: 'Prevent exposure of API keys, passwords, and secrets',
    severity: 'warning',
    matcher: /api[_-]?key|password|secret|token|credential/i,
    validator: validateSecretExposure,
  },
  {
    name: 'no-sensitive-paths',
    description: 'Warn about operations on sensitive system paths',
    severity: 'warning',
    matcher: (input: HookInput) => {
      const str = JSON.stringify(input);
      return /\/etc\/|\.ssh|\.env|credentials/i.test(str);
    },
    validator: validateSensitivePaths,
  },
];

/**
 * Safety rules
 */
export const safetyRules: ValidationRule[] = [
  {
    name: 'no-destructive-on-main',
    description: 'Block destructive operations on main/master branch',
    severity: 'error',
    matcher: (input: HookInput) => {
      if (input.tool !== 'Bash') return false;
      const cmd = input.args?.command || '';
      return /git\s+push\s+(-f|--force)|git\s+reset\s+--hard|rm\s+-rf/i.test(cmd);
    },
    validator: async (inputData: HookInput): Promise<ValidationResult> => {
      const result = validateDestructiveOperation(inputData);
      if (!result.valid) {
        result.blockers.push('Use /implement or /review slash commands for safer operations');
      }
      return result;
    },
  },
  {
    name: 'no-force-push-main',
    description: 'Prevent force push to main branch',
    severity: 'error',
    matcher: (input: HookInput) => {
      if (input.tool !== 'Bash') return false;
      const cmd = input.args?.command || '';
      return /git\s+push.*(-f|--force)/.test(cmd);
    },
    validator: async (_input: HookInput): Promise<ValidationResult> => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        blockers: [],
      };

      try {
        if (isMainBranch()) {
          result.valid = false;
          result.errors.push('Force push to main branch is not allowed');
          result.blockers.push('Create a feature branch for this operation');
          result.suggestions.push('Use: git checkout -b feature/your-feature-name');
        }
      } catch (error) {
        result.warnings.push('Could not verify git branch');
      }

      return result;
    },
  },
];

/**
 * Performance rules
 */
export const performanceRules: ValidationRule[] = [
  {
    name: 'large-file-warning',
    description: 'Warn about operations on large files',
    severity: 'warning',
    matcher: (input: HookInput) => {
      const str = JSON.stringify(input);
      return /\.(mp4|mov|avi|zip|tar\.gz|sql|dump)/.test(str);
    },
    validator: async (_input: HookInput): Promise<ValidationResult> => {
      return {
        valid: true,
        errors: [],
        warnings: ['Operation involves large files - consider using MinIO or Cloudflare Stream'],
        suggestions: ['Use MCP tools for large file operations'],
        blockers: [],
      };
    },
  },
];

/**
 * Best practice rules
 */
export const bestPracticeRules: ValidationRule[] = [
  {
    name: 'prefer-mcp-for-database',
    description: 'Suggest using MCP for database operations',
    severity: 'info',
    matcher: (input: HookInput) => {
      if (input.tool !== 'Bash') return false;
      const cmd = input.args?.command || '';
      return /psql|pg_dump|pg_restore/.test(cmd);
    },
    validator: async (_input: HookInput): Promise<ValidationResult> => {
      return {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: ['Consider using PostgreSQL MCP for better connection pooling and error handling'],
        blockers: [],
      };
    },
  },
  {
    name: 'prefer-script-tools',
    description: 'Suggest using progressive disclosure tools',
    severity: 'info',
    matcher: (input: HookInput) => {
      if (input.tool !== 'Bash') return false;
      const cmd = input.args?.command || '';
      return /docker\s+ps|docker\s+logs|git\s+status/.test(cmd);
    },
    validator: async (input: HookInput): Promise<ValidationResult> => {
      const cmd = input.args?.command || '';
      const suggestions: string[] = [];

      if (/docker\s+ps/.test(cmd)) {
        suggestions.push('Use: bash tools/containers/ps.sh');
      }
      if (/docker\s+logs/.test(cmd)) {
        suggestions.push('Use: bash tools/containers/logs.sh <container> <lines>');
      }
      if (/git\s+status/.test(cmd)) {
        suggestions.push('Use: bash tools/git/status.sh');
      }

      return {
        valid: true,
        errors: [],
        warnings: [],
        suggestions,
        blockers: [],
      };
    },
  },
];

/**
 * All validation rules
 */
export const allRules: ValidationRule[] = [
  ...securityRules,
  ...safetyRules,
  ...performanceRules,
  ...bestPracticeRules,
];

/**
 * Get applicable rules for input
 */
export function getApplicableRules(input: HookInput): ValidationRule[] {
  return allRules.filter(rule => {
    if (typeof rule.matcher === 'function') {
      return rule.matcher(input);
    }
    const str = JSON.stringify(input);
    return rule.matcher.test(str);
  });
}

export default {
  securityRules,
  safetyRules,
  performanceRules,
  bestPracticeRules,
  allRules,
  getApplicableRules,
};
