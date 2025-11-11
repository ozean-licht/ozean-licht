import { z } from 'zod';

// ============================================================================
// Hook Input/Output Types (matching Claude Code hook JSON schema)
// ============================================================================

/**
 * Base hook input structure - all hooks receive this via stdin
 */
export const HookInputSchema = z.object({
  tool: z.string().optional(), // Tool name for PreToolUse/PostToolUse
  args: z.record(z.any()).optional(), // Tool arguments
  result: z.any().optional(), // Tool result for PostToolUse
  error: z.any().optional(), // Tool error for PostToolUse
  prompt: z.string().optional(), // User prompt for UserPromptSubmit
  context: z.any().optional(), // Context data for various hooks
  conversationId: z.string().optional(),
  sessionId: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type HookInput = z.infer<typeof HookInputSchema>;

/**
 * Hook output structure - all hooks must return this via stdout
 */
export const HookOutputSchema = z.object({
  continue: z.boolean().default(true), // false = block execution
  stopReason: z.string().optional(), // Reason for blocking (if continue = false)
  suppressOutput: z.boolean().optional(), // Suppress tool output display
  contextMessage: z.string().optional(), // Message to inject into context
  metadata: z.record(z.any()).optional(), // Additional metadata
});

export type HookOutput = z.infer<typeof HookOutputSchema>;

// ============================================================================
// Tool Catalog Types (matching tools/inventory/tool-catalog.json)
// ============================================================================

export interface ToolCommand {
  command: string;
  description: string;
  example: string;
  parameters?: Record<string, {
    type: string;
    required: boolean;
    values?: string[];
    default?: any;
  }>;
  exitCodes?: Record<string, string>;
}

export interface ToolHealthCheck {
  method: 'http' | 'cli';
  endpoint?: string;
  command?: string;
  interval: number;
}

export interface ToolMetadata {
  name: string;
  type: 'mcp' | 'script-api' | 'script-native';
  tier: 'tier1-native' | 'tier2-api' | 'tier3-mcp';
  description: string;
  location: 'local' | 'server';
  version: string;
  status: 'active' | 'deprecated' | 'experimental';
  scriptPath?: string;
  dependencies: string[];
  capabilities: string[];
  commands: ToolCommand[];
  healthCheck: ToolHealthCheck;
  performance?: {
    avgExecutionTime: string;
    speedup?: string;
  };
  tokenCost?: {
    avgTokensPerCall: number;
    costPerCall: number;
    complexity: 'low' | 'medium' | 'high';
  };
  rateLimit?: {
    requestsPerMinute: number;
    burstLimit: number;
  };
  rationale: string;
  alwaysActive?: boolean;
  useCases?: string[];
  whenToUse?: string;
}

export interface ToolCatalog {
  version: string;
  updated: string;
  schema: {
    description: string;
    includes: string;
  };
  tools: Record<string, ToolMetadata>;
  aggregates?: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// Memory Pattern Types (matching Mem0 structure)
// ============================================================================

export type MemoryCategory = 'pattern' | 'decision' | 'solution' | 'error' | 'workflow';

export interface MemoryPattern {
  content: string;
  category: MemoryCategory;
  user_id: string;
  metadata: {
    source: string;
    timestamp: string;
    complexity?: 'low' | 'medium' | 'high';
    tags?: string[];
    relatedFiles?: string[];
    relatedTools?: string[];
    [key: string]: any;
  };
}

export interface MemorySearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  blockers: string[];
}

export interface ValidationRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  matcher: RegExp | ((input: HookInput) => boolean);
  validator: (input: HookInput) => ValidationResult | Promise<ValidationResult>;
}

// ============================================================================
// Git Types
// ============================================================================

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: string[];
  unstaged: string[];
  untracked: string[];
  conflicted: string[];
}

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
}

// ============================================================================
// Session Types
// ============================================================================

export interface SessionInfo {
  sessionId: string;
  startTime: string;
  endTime?: string;
  toolsUsed: string[];
  errorsEncountered: number;
  patternsDetected: number;
  memoriesSaved: number;
}

// ============================================================================
// Service Health Types
// ============================================================================

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  endpoint: string;
  latency?: string;
  error?: string;
  timestamp: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface HookConfig {
  timeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logFormat: 'json' | 'pretty';
  memoryAutoSave: boolean;
  memoryMinComplexity: 'low' | 'medium' | 'high';
  validationEnabled: boolean;
  validationStrictMode: boolean;
  mcpGatewayUrl: string;
  mcpGatewayTimeout: number;
  toolCatalogPath: string;
  gitRepoPath: string;
}

// ============================================================================
// MCP Gateway Types
// ============================================================================

export interface MCPRequest {
  operation: string;
  args?: any[];
  options?: Record<string, any>;
}

export interface MCPResponse {
  status: 'success' | 'error';
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    tokensUsed?: number;
    cost?: number;
    service: string;
    operation: string;
    timestamp: string;
  };
}

// ============================================================================
// Pattern Detection Types
// ============================================================================

export interface PatternSignature {
  name: string;
  category: MemoryCategory;
  matcher: (input: HookInput, history?: HookInput[]) => boolean;
  extractor: (input: HookInput, history?: HookInput[]) => MemoryPattern | null;
  autoSave: boolean;
  priority: number;
}

// ============================================================================
// Error Types
// ============================================================================

export class HookError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HookError';
  }
}

export class ValidationError extends HookError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ServiceUnavailableError extends HookError {
  constructor(service: string, details?: any) {
    super(`Service unavailable: ${service}`, 'SERVICE_UNAVAILABLE', details);
    this.name = 'ServiceUnavailableError';
  }
}

export class TimeoutError extends HookError {
  constructor(operation: string, details?: any) {
    super(`Operation timed out: ${operation}`, 'TIMEOUT_ERROR', details);
    this.name = 'TimeoutError';
  }
}
