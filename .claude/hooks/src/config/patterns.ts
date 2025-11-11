/**
 * Memory pattern templates and detection configuration
 */

import { PatternSignature, MemoryPattern, HookInput } from '../types';
import { createPattern } from '../utils/memory';

/**
 * Deployment pattern detector
 */
export const deploymentPattern: PatternSignature = {
  name: 'deployment',
  category: 'workflow',
  priority: 10,
  autoSave: true,
  matcher: (input: HookInput) => {
    const tool = input.tool?.toLowerCase() || '';
    const result = JSON.stringify(input.result || '').toLowerCase();
    return (
      (tool.includes('deploy') || tool.includes('coolify')) &&
      (result.includes('success') || result.includes('deployed'))
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Deployment workflow: Used ${input.tool} with args: ${JSON.stringify(input.args, null, 2)}. Result: ${JSON.stringify(input.result)}`;
    return createPattern(content, 'workflow', {
      tool: input.tool,
      operation: 'deployment',
      success: true,
    });
  },
};

/**
 * Error resolution pattern detector
 */
export const errorResolutionPattern: PatternSignature = {
  name: 'error-resolution',
  category: 'solution',
  priority: 9,
  autoSave: true,
  matcher: (input: HookInput) => {
    return input.error !== undefined && input.result !== undefined;
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Error Resolution: ${input.tool} encountered error: ${JSON.stringify(input.error)}. Fixed by: ${JSON.stringify(input.result)}`;
    return createPattern(content, 'solution', {
      tool: input.tool,
      errorType: typeof input.error === 'object' ? (input.error as any).type : 'unknown',
      operation: 'error-resolution',
    });
  },
};

/**
 * Architecture decision pattern detector
 */
export const architectureDecisionPattern: PatternSignature = {
  name: 'architecture-decision',
  category: 'decision',
  priority: 8,
  autoSave: true,
  matcher: (input: HookInput) => {
    const str = JSON.stringify(input).toLowerCase();
    return (
      str.includes('architecture') ||
      str.includes('design decision') ||
      str.includes('chose') ||
      str.includes('decided')
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Architecture Decision: ${JSON.stringify(input.context || input)}`;
    return createPattern(content, 'decision', {
      tool: input.tool,
      operation: 'architecture-decision',
    });
  },
};

/**
 * Database operation pattern detector
 */
export const databasePattern: PatternSignature = {
  name: 'database-operation',
  category: 'pattern',
  priority: 7,
  autoSave: false, // Only save significant database operations
  matcher: (input: HookInput) => {
    const tool = input.tool?.toLowerCase() || '';
    const str = JSON.stringify(input).toLowerCase();
    return (
      tool.includes('postgres') ||
      tool.includes('database') ||
      str.includes('migration') ||
      str.includes('schema')
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Database Pattern: ${input.tool} operation: ${JSON.stringify(input.args)}`;
    return createPattern(content, 'pattern', {
      tool: input.tool,
      operation: 'database',
    });
  },
};

/**
 * Git workflow pattern detector
 */
export const gitWorkflowPattern: PatternSignature = {
  name: 'git-workflow',
  category: 'workflow',
  priority: 6,
  autoSave: false,
  matcher: (input: HookInput) => {
    const tool = input.tool?.toLowerCase() || '';
    const cmd = JSON.stringify(input.args || '').toLowerCase();
    return (
      tool.includes('git') &&
      (cmd.includes('commit') || cmd.includes('push') || cmd.includes('merge') || cmd.includes('pull request'))
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Git Workflow: ${input.tool} - ${JSON.stringify(input.args)}`;
    return createPattern(content, 'workflow', {
      tool: input.tool,
      operation: 'git',
    });
  },
};

/**
 * Performance optimization pattern detector
 */
export const performanceOptimizationPattern: PatternSignature = {
  name: 'performance-optimization',
  category: 'pattern',
  priority: 8,
  autoSave: true,
  matcher: (input: HookInput) => {
    const str = JSON.stringify(input).toLowerCase();
    return (
      str.includes('optimiz') ||
      str.includes('performance') ||
      str.includes('speed') ||
      str.includes('cache') ||
      str.includes('faster')
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Performance Optimization: ${JSON.stringify(input.context || input)}`;
    return createPattern(content, 'pattern', {
      tool: input.tool,
      operation: 'optimization',
    });
  },
};

/**
 * Security fix pattern detector
 */
export const securityFixPattern: PatternSignature = {
  name: 'security-fix',
  category: 'solution',
  priority: 10,
  autoSave: true,
  matcher: (input: HookInput) => {
    const str = JSON.stringify(input).toLowerCase();
    return (
      str.includes('security') ||
      str.includes('vulnerability') ||
      str.includes('exploit') ||
      str.includes('cve')
    );
  },
  extractor: (input: HookInput): MemoryPattern | null => {
    const content = `Security Fix: ${JSON.stringify(input)}`;
    return createPattern(content, 'solution', {
      tool: input.tool,
      operation: 'security-fix',
      priority: 'high',
    });
  },
};

/**
 * All pattern signatures
 */
export const allPatterns: PatternSignature[] = [
  securityFixPattern,
  deploymentPattern,
  errorResolutionPattern,
  architectureDecisionPattern,
  performanceOptimizationPattern,
  databasePattern,
  gitWorkflowPattern,
];

/**
 * Get matching patterns for input
 */
export function getMatchingPatterns(input: HookInput, history?: HookInput[]): PatternSignature[] {
  return allPatterns
    .filter(pattern => pattern.matcher(input, history))
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Extract patterns from input
 */
export function extractPatterns(input: HookInput, history?: HookInput[]): MemoryPattern[] {
  const matchingPatterns = getMatchingPatterns(input, history);
  const extracted: MemoryPattern[] = [];

  for (const patternSig of matchingPatterns) {
    const pattern = patternSig.extractor(input, history);
    if (pattern) {
      extracted.push(pattern);
    }
  }

  return extracted;
}

export default {
  deploymentPattern,
  errorResolutionPattern,
  architectureDecisionPattern,
  databasePattern,
  gitWorkflowPattern,
  performanceOptimizationPattern,
  securityFixPattern,
  allPatterns,
  getMatchingPatterns,
  extractPatterns,
};
