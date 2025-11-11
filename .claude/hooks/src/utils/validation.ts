/**
 * Validation utilities for tool usage and hook inputs
 */

import * as fs from 'fs';
import { logger } from './logger';
import { mcpClient } from './mcp-client';
import { ToolCatalog, ToolMetadata, ValidationResult, HookInput } from '../types';

// Cache for tool catalog
let catalogCache: ToolCatalog | null = null;
let catalogLoadTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load tool catalog with caching
 */
export function loadToolCatalog(): ToolCatalog | null {
  try {
    const now = Date.now();

    // Return cached catalog if still valid
    if (catalogCache && (now - catalogLoadTime) < CACHE_TTL) {
      return catalogCache;
    }

    const catalogPath = process.env.TOOL_CATALOG_PATH ||
      '/opt/ozean-licht-ecosystem/tools/inventory/tool-catalog.json';

    if (!fs.existsSync(catalogPath)) {
      logger.warn('Tool catalog not found', { catalogPath });
      return null;
    }

    const catalogData = fs.readFileSync(catalogPath, 'utf-8');
    catalogCache = JSON.parse(catalogData) as ToolCatalog;
    catalogLoadTime = now;

    logger.debug('Tool catalog loaded', {
      version: catalogCache.version,
      toolCount: Object.keys(catalogCache.tools).length,
    });

    return catalogCache;
  } catch (error) {
    logger.error('Failed to load tool catalog', error as Error);
    return null;
  }
}

/**
 * Get tool metadata by name
 */
export function getToolMetadata(toolName: string): ToolMetadata | null {
  const catalog = loadToolCatalog();
  if (!catalog) {
    return null;
  }

  // Direct lookup
  if (catalog.tools[toolName]) {
    return catalog.tools[toolName];
  }

  // Case-insensitive lookup
  const lowerName = toolName.toLowerCase();
  const matchingKey = Object.keys(catalog.tools).find(
    key => key.toLowerCase() === lowerName
  );

  if (matchingKey) {
    return catalog.tools[matchingKey];
  }

  return null;
}

// Built-in Claude Code tools that don't need catalog validation
const BUILTIN_TOOLS = [
  'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep',
  'Task', 'WebFetch', 'WebSearch', 'SlashCommand',
  'AskUserQuestion', 'TodoWrite', 'ExitPlanMode',
  'NotebookEdit', 'BashOutput', 'KillShell', 'Skill'
];

/**
 * Validate tool exists and is active
 */
export function validateToolExists(toolName: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  // Allow built-in Claude Code tools without validation
  if (BUILTIN_TOOLS.includes(toolName)) {
    logger.debug('Built-in tool - skipping catalog validation', { toolName });
    return result;
  }

  const catalog = loadToolCatalog();
  if (!catalog) {
    result.warnings.push('Tool catalog unavailable - skipping validation');
    return result;
  }

  const tool = getToolMetadata(toolName);

  if (!tool) {
    // Don't block - just warn for unknown tools
    result.warnings.push(`Tool '${toolName}' not found in catalog`);

    // Suggest similar tools
    const similarTools = findSimilarTools(toolName, catalog);
    if (similarTools.length > 0) {
      result.suggestions.push(
        `Did you mean: ${similarTools.slice(0, 3).join(', ')}?`
      );
    }

    return result;
  }

  // Check tool status
  if (tool.status === 'deprecated') {
    result.warnings.push(`Tool '${toolName}' is deprecated`);
    result.suggestions.push(`Consider using an alternative tool`);
  }

  if (tool.status === 'experimental') {
    result.warnings.push(`Tool '${toolName}' is experimental - use with caution`);
  }

  return result;
}

/**
 * Find tools with similar names
 */
function findSimilarTools(toolName: string, catalog: ToolCatalog): string[] {
  const allTools = Object.keys(catalog.tools);
  const lowerName = toolName.toLowerCase();

  // Calculate simple similarity score
  const scores = allTools.map(tool => {
    const lowerTool = tool.toLowerCase();
    let score = 0;

    // Exact substring match
    if (lowerTool.includes(lowerName) || lowerName.includes(lowerTool)) {
      score += 10;
    }

    // Common prefix
    let i = 0;
    while (i < Math.min(lowerName.length, lowerTool.length) &&
           lowerName[i] === lowerTool[i]) {
      score += 1;
      i++;
    }

    return { tool, score };
  });

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.tool);
}

/**
 * Validate MCP Gateway availability for MCP tools
 */
export async function validateMCPGateway(toolName: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  const tool = getToolMetadata(toolName);
  if (!tool || tool.tier !== 'tier3-mcp') {
    return result; // Not an MCP tool
  }

  try {
    const health = await mcpClient.checkHealth();

    if (health.status !== 'healthy') {
      result.valid = false;
      result.errors.push('MCP Gateway is unavailable');
      result.blockers.push(
        `Cannot execute MCP tool '${toolName}' - gateway is ${health.status}`
      );
      result.suggestions.push('Check MCP Gateway logs and restart if necessary');
    }
  } catch (error) {
    result.valid = false;
    result.errors.push('Failed to check MCP Gateway health');
    result.blockers.push(`Cannot verify MCP Gateway availability`);
  }

  return result;
}

/**
 * Validate tool dependencies
 */
export function validateDependencies(toolName: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  const tool = getToolMetadata(toolName);
  if (!tool) {
    return result;
  }

  // Check if dependencies are available
  tool.dependencies.forEach(dep => {
    // Skip mcp-gateway check as it's validated separately
    if (dep === 'mcp-gateway') {
      return;
    }

    // For other tools, check if they exist in catalog
    const depTool = getToolMetadata(dep);
    if (!depTool) {
      result.warnings.push(`Dependency '${dep}' not found in catalog`);
    } else if (depTool.status !== 'active') {
      result.warnings.push(`Dependency '${dep}' is ${depTool.status}`);
    }
  });

  return result;
}

/**
 * Validate destructive operations on main branch
 */
export function validateDestructiveOperation(input: HookInput): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  if (input.tool !== 'Bash') {
    return result;
  }

  const command = input.args?.command || '';
  const destructivePatterns = [
    /git\s+push\s+(-f|--force)/,
    /git\s+reset\s+--hard/,
    /rm\s+-rf/,
    /git\s+branch\s+-D/,
    /docker\s+system\s+prune/,
    /DROP\s+DATABASE/i,
  ];

  const isDestructive = destructivePatterns.some(pattern => pattern.test(command));

  if (isDestructive) {
    // Check if on main branch
    try {
      const git = require('./git');
      if (git.isMainBranch()) {
        result.valid = false;
        result.errors.push('Destructive operation blocked on main branch');
        result.blockers.push(
          'Cannot execute destructive git/system operations on main/master branch'
        );
        result.suggestions.push('Switch to a feature branch for this operation');
      } else {
        result.warnings.push('Executing destructive operation - proceed with caution');
      }
    } catch (error) {
      result.warnings.push('Could not verify git branch - proceed with caution');
    }
  }

  return result;
}

/**
 * Validate secret exposure in commands
 */
export function validateSecretExposure(input: HookInput): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  const commandStr = JSON.stringify(input);
  const secretPatterns = [
    /api[_-]?key/i,
    /password/i,
    /secret/i,
    /token/i,
    /credential/i,
    /private[_-]?key/i,
  ];

  secretPatterns.forEach(pattern => {
    if (pattern.test(commandStr)) {
      result.warnings.push(`Potential secret detected in command: ${pattern.source}`);
      result.suggestions.push('Use environment variables for sensitive data');
    }
  });

  return result;
}

/**
 * Validate file operations on sensitive paths
 */
export function validateSensitivePaths(input: HookInput): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  const commandStr = JSON.stringify(input);
  const sensitivePaths = [
    '/etc/passwd',
    '/etc/shadow',
    '/.env',
    '/credentials',
    '/.ssh',
    '/etc/ssh',
  ];

  sensitivePaths.forEach(sensPath => {
    if (commandStr.includes(sensPath)) {
      result.warnings.push(`Operation on sensitive path: ${sensPath}`);
    }
  });

  return result;
}

/**
 * Combine validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const combined: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    blockers: [],
  };

  results.forEach(result => {
    if (!result.valid) {
      combined.valid = false;
    }
    combined.errors.push(...result.errors);
    combined.warnings.push(...result.warnings);
    combined.suggestions.push(...result.suggestions);
    combined.blockers.push(...result.blockers);
  });

  // Deduplicate arrays
  combined.errors = [...new Set(combined.errors)];
  combined.warnings = [...new Set(combined.warnings)];
  combined.suggestions = [...new Set(combined.suggestions)];
  combined.blockers = [...new Set(combined.blockers)];

  return combined;
}

export default {
  loadToolCatalog,
  getToolMetadata,
  validateToolExists,
  validateMCPGateway,
  validateDependencies,
  validateDestructiveOperation,
  validateSecretExposure,
  validateSensitivePaths,
  combineValidationResults,
};
