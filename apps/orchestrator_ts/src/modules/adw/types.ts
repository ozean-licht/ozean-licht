/**
 * ADW Type Definitions
 *
 * TypeScript equivalents of Python Pydantic models from data_types.py
 * Provides type safety and runtime validation using Zod for the ADW system.
 */

import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

/**
 * Model set indicating computational complexity required for a task
 * - base: Standard operations using Sonnet model
 * - heavy: Complex operations requiring Opus model
 */
export const ModelSet = z.enum(['base', 'heavy']);
export type ModelSet = z.infer<typeof ModelSet>;

/**
 * Slash commands available in the ADW system
 * Maps to custom slash commands defined in .claude/commands
 */
export const SlashCommand = z.enum([
  '/classify_issue',
  '/classify_adw',
  '/generate_branch_name',
  '/implement',
  '/test',
  '/resolve_failed_test',
  '/test_e2e',
  '/resolve_failed_e2e_test',
  '/review',
  '/document',
  '/commit',
  '/pull_request',
  '/chore',
  '/bug',
  '/feature',
  '/patch',
  '/install_worktree',
  '/track_agentic_kpis',
]);
export type SlashCommand = z.infer<typeof SlashCommand>;

/**
 * Retry codes for Claude Code execution errors
 * Indicates different types of errors that may be retryable
 */
export const RetryCode = z.enum([
  'NONE',
  'CLAUDE_CODE_ERROR',
  'TIMEOUT_ERROR',
  'EXECUTION_ERROR',
  'ERROR_DURING_EXECUTION',
]);
export type RetryCode = z.infer<typeof RetryCode>;

/**
 * Workflow types supported by the ADW system
 * Defines different phases and combinations of SDLC operations
 */
export const WorkflowType = z.enum([
  'plan',
  'patch',
  'build',
  'test',
  'review',
  'document',
  'ship',
  'plan_build',
  'plan_build_test',
  'plan_build_review',
  'plan_build_document',
  'sdlc',
  'sdlc_zte',
]);
export type WorkflowType = z.infer<typeof WorkflowType>;

/**
 * Workflow phase states
 * Tracks progression through the SDLC workflow
 */
export const WorkflowPhase = z.enum([
  'initialized',
  'planned',
  'built',
  'tested',
  'reviewed',
  'documented',
  'shipped',
]);
export type WorkflowPhase = z.infer<typeof WorkflowPhase>;

/**
 * Workflow execution status
 */
export const WorkflowStatus = z.enum([
  'active',
  'completed',
  'failed',
  'cancelled',
]);
export type WorkflowStatus = z.infer<typeof WorkflowStatus>;

/**
 * Workflow event types for real-time monitoring
 */
export const WorkflowEventType = z.enum([
  'phase_started',
  'phase_completed',
  'phase_failed',
  'tool_use',
  'thinking',
  'error',
  'info',
  'warning',
]);
export type WorkflowEventType = z.infer<typeof WorkflowEventType>;

// ============================================================================
// Agent Execution Types
// ============================================================================

/**
 * Configuration for agent execution
 * Specifies how to run a Claude Code agent for a specific slash command
 */
export interface AgentExecutionConfig {
  /** Unique identifier for the ADW workflow */
  adwId: string;
  /** Name of the agent to execute */
  agentName: string;
  /** Slash command to run */
  slashCommand: SlashCommand;
  /** Arguments to pass to the slash command */
  args: string[];
  /** Claude model to use (sonnet or opus) */
  model?: string;
  /** Working directory for agent execution */
  workingDir?: string;
  /** Skip permission checks (dangerous, use with caution) */
  dangerouslySkipPermissions?: boolean;
}

/**
 * Result of agent execution
 * Contains output, success status, and any errors encountered
 */
export interface AgentExecutionResult {
  /** Whether the agent execution succeeded */
  success: boolean;
  /** Output from the agent execution */
  output: string;
  /** Claude Code session ID for tracking */
  sessionId?: string;
  /** Retry code indicating error type */
  retryCode: RetryCode;
  /** Error object if execution failed */
  error?: Error;
}

/**
 * Model mapping for slash commands
 * Determines which Claude model to use based on command and model set
 */
export const SLASH_COMMAND_MODEL_MAP: Record<SlashCommand, Record<ModelSet, string>> = {
  '/classify_issue': { base: 'sonnet', heavy: 'sonnet' },
  '/classify_adw': { base: 'sonnet', heavy: 'sonnet' },
  '/generate_branch_name': { base: 'sonnet', heavy: 'sonnet' },
  '/implement': { base: 'sonnet', heavy: 'opus' },
  '/test': { base: 'sonnet', heavy: 'sonnet' },
  '/resolve_failed_test': { base: 'sonnet', heavy: 'opus' },
  '/test_e2e': { base: 'sonnet', heavy: 'sonnet' },
  '/resolve_failed_e2e_test': { base: 'sonnet', heavy: 'opus' },
  '/review': { base: 'sonnet', heavy: 'sonnet' },
  '/document': { base: 'sonnet', heavy: 'opus' },
  '/commit': { base: 'sonnet', heavy: 'sonnet' },
  '/pull_request': { base: 'sonnet', heavy: 'sonnet' },
  '/chore': { base: 'sonnet', heavy: 'opus' },
  '/bug': { base: 'sonnet', heavy: 'opus' },
  '/feature': { base: 'sonnet', heavy: 'opus' },
  '/patch': { base: 'sonnet', heavy: 'opus' },
  '/install_worktree': { base: 'sonnet', heavy: 'sonnet' },
  '/track_agentic_kpis': { base: 'sonnet', heavy: 'sonnet' },
};

// ============================================================================
// Worktree Types
// ============================================================================

/**
 * Port allocation configuration
 * Assigns unique ports for backend and frontend services in isolated worktrees
 */
export interface PortAllocation {
  /** Port number for backend server */
  backendPort: number;
  /** Port number for frontend development server */
  frontendPort: number;
}

/**
 * Worktree configuration
 * Defines git worktree setup for isolated development environment
 */
export interface WorktreeConfig {
  /** ADW ID associated with this worktree */
  adwId: string;
  /** Git branch name for the worktree */
  branchName: string;
  /** Filesystem path to the worktree */
  worktreePath: string;
  /** Port allocation for services */
  ports: PortAllocation;
}

/**
 * Worktree validation result
 * Indicates whether a worktree exists and is in valid state
 */
export interface WorktreeValidation {
  /** Whether the worktree exists on filesystem */
  exists: boolean;
  /** Whether the worktree is in a valid state */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

// ============================================================================
// GitHub Types
// ============================================================================

/**
 * GitHub issue data
 * Simplified representation for ADW system integration
 */
export interface GitHubIssue {
  /** Issue number */
  number: number;
  /** Issue title */
  title: string;
  /** Issue body content */
  body: string;
  /** Issue state */
  state: 'open' | 'closed';
  /** Labels applied to the issue */
  labels: string[];
  /** Issue creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * GitHub pull request data
 * Simplified representation for ADW system integration
 */
export interface GitHubPullRequest {
  /** PR number */
  number: number;
  /** PR title */
  title: string;
  /** PR body content */
  body: string;
  /** PR state */
  state: 'open' | 'closed' | 'merged';
  /** Head branch name */
  head: string;
  /** Base branch name */
  base: string;
  /** PR creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

// ============================================================================
// Workflow Event Types
// ============================================================================

/**
 * Workflow event data
 * Real-time event emitted during workflow execution for monitoring and logging
 */
export interface WorkflowEvent {
  /** ADW ID that generated this event */
  adwId: string;
  /** Type of event */
  eventType: WorkflowEventType;
  /** Optional subtype for additional categorization */
  eventSubtype?: string;
  /** Workflow phase when event occurred */
  phase?: string;
  /** Human-readable message describing the event */
  message?: string;
  /** Additional structured data associated with the event */
  data?: Record<string, unknown>;
}
