# TypeScript Migration - Phase 2 Implementation Plan

> **Phase**: 2 - Core ADW Modules
> **Duration**: 2-3 weeks
> **Status**: Ready to begin
> **Prerequisites**: ✅ Phase 1 Complete

---

## Executive Summary

### What We're Building

Phase 2 implements the core ADW system in TypeScript, converting Python modules to native TypeScript with direct Agent SDK integration. This phase focuses on the critical infrastructure needed for autonomous workflow execution.

**Core Modules:**
1. **agent-executor.ts** - Direct Agent SDK execution (replaces subprocess calls)
2. **state-manager.ts** - Database-backed state operations (replaces JSON files)
3. **worktree-manager.ts** - Git worktree management with port allocation
4. **git-operations.ts** - Git commands using simple-git
5. **github-integration.ts** - GitHub API using @octokit/rest
6. **workflow-manager.ts** - Orchestrate complete workflows
7. **types.ts** - TypeScript type definitions
8. **utils.ts** - Utility functions

---

## Phase 2 Architecture

### Module Dependency Graph

```
┌─────────────────────────────────────────────┐
│          workflow-manager.ts                │
│  (Orchestrates complete workflows)          │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐ ┌──────────────────┐
│agent-executor│ │ worktree-manager │
│  (runs agents)│ │ (git worktrees)  │
└──────┬──────┘ └────────┬─────────┘
       │                 │
       │         ┌───────┴────────┐
       │         │                │
       ▼         ▼                ▼
┌──────────┐ ┌────────┐   ┌──────────────┐
│state-mgr │ │git-ops │   │github-integ  │
│(database)│ │(simple)│   │(@octokit)    │
└──────────┘ └────────┘   └──────────────┘
       │
       ▼
┌──────────────────┐
│   types.ts       │
│   utils.ts       │
└──────────────────┘
```

---

## Module 1: Types & Utilities

### File: `src/modules/adw/types.ts`

**Purpose**: TypeScript type definitions for ADW system

**Python Source**: `adws/adw_modules/data_types.py`

**Implementation:**

```typescript
/**
 * ADW Type Definitions
 *
 * TypeScript equivalents of Python Pydantic models from data_types.py
 */

import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

export const ModelSet = z.enum(['base', 'heavy']);
export type ModelSet = z.infer<typeof ModelSet>;

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

export const RetryCode = z.enum([
  'NONE',
  'CLAUDE_CODE_ERROR',
  'TIMEOUT_ERROR',
  'EXECUTION_ERROR',
  'ERROR_DURING_EXECUTION',
]);
export type RetryCode = z.infer<typeof RetryCode>;

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

export const WorkflowStatus = z.enum([
  'active',
  'completed',
  'failed',
  'cancelled',
]);
export type WorkflowStatus = z.infer<typeof WorkflowStatus>;

// ============================================================================
// Agent Execution Types
// ============================================================================

/**
 * Configuration for agent execution
 */
export interface AgentExecutionConfig {
  adwId: string;
  agentName: string;
  slashCommand: SlashCommand;
  args: string[];
  model?: string;
  workingDir?: string;
  dangerouslySkipPermissions?: boolean;
}

/**
 * Result of agent execution
 */
export interface AgentExecutionResult {
  success: boolean;
  output: string;
  sessionId?: string;
  retryCode: RetryCode;
  error?: Error;
}

/**
 * Model mapping for slash commands
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
 */
export interface PortAllocation {
  backendPort: number;
  frontendPort: number;
}

/**
 * Worktree configuration
 */
export interface WorktreeConfig {
  adwId: string;
  branchName: string;
  worktreePath: string;
  ports: PortAllocation;
}

/**
 * Worktree validation result
 */
export interface WorktreeValidation {
  exists: boolean;
  isValid: boolean;
  error?: string;
}

// ============================================================================
// GitHub Types
// ============================================================================

/**
 * GitHub issue data
 */
export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GitHub pull request data
 */
export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  head: string;
  base: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Workflow Event Types
// ============================================================================

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

/**
 * Workflow event data
 */
export interface WorkflowEvent {
  adwId: string;
  eventType: WorkflowEventType;
  eventSubtype?: string;
  phase?: string;
  message?: string;
  data?: Record<string, unknown>;
}
```

---

### File: `src/modules/adw/utils.ts`

**Purpose**: Utility functions for ADW system

**Python Source**: `adws/adw_modules/utils.py`

**Implementation:**

```typescript
/**
 * ADW Utility Functions
 */

import crypto from 'crypto';
import { logger } from '../../config/logger.js';

/**
 * Generate a unique 8-character ADW ID
 *
 * Uses base36 encoding of random bytes for short, URL-safe IDs
 *
 * @returns 8-character lowercase alphanumeric string
 *
 * @example
 * generateAdwId() // => 'a1b2c3d4'
 */
export function generateAdwId(): string {
  const randomBytes = crypto.randomBytes(4);
  const num = randomBytes.readUInt32BE(0);
  const id = num.toString(36).padStart(8, '0').substring(0, 8);
  logger.debug({ adwId: id }, 'Generated ADW ID');
  return id;
}

/**
 * Calculate deterministic port allocation based on ADW ID
 *
 * Hashes the ADW ID to consistently assign the same ports
 * for the same workflow across restarts
 *
 * @param adwId - The workflow identifier
 * @param backendStart - Starting port for backend (default: 9100)
 * @param frontendStart - Starting port for frontend (default: 9200)
 * @param maxSlots - Maximum concurrent workflows (default: 15)
 * @returns Object with backendPort and frontendPort
 *
 * @example
 * getPortsForAdw('abc12345') // => { backendPort: 9107, frontendPort: 9207 }
 */
export function getPortsForAdw(
  adwId: string,
  backendStart = 9100,
  frontendStart = 9200,
  maxSlots = 15
): { backendPort: number; frontendPort: number } {
  // Convert first 8 chars of adwId to a number
  const hash = parseInt(adwId.substring(0, 8), 36);
  const index = hash % maxSlots;

  const backendPort = backendStart + index;
  const frontendPort = frontendStart + index;

  logger.debug({ adwId, index, backendPort, frontendPort }, 'Allocated ports for ADW');

  return { backendPort, frontendPort };
}

/**
 * Check if a port is available
 *
 * @param port - Port number to check
 * @returns Promise resolving to true if available
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  const net = await import('net');

  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

/**
 * Find next available port starting from a base port
 *
 * @param startPort - Port to start searching from
 * @param maxAttempts - Maximum ports to try (default: 15)
 * @returns Promise resolving to available port number
 * @throws Error if no ports available
 */
export async function findAvailablePort(
  startPort: number,
  maxAttempts = 15
): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const available = await isPortAvailable(port);

    if (available) {
      logger.debug({ port, attempts: i + 1 }, 'Found available port');
      return port;
    }
  }

  throw new Error(`No available ports found starting from ${startPort}`);
}

/**
 * Sanitize branch name for git
 *
 * Removes invalid characters and formats for git branch names
 *
 * @param name - Raw branch name
 * @returns Sanitized branch name
 *
 * @example
 * sanitizeBranchName('feat/Add New Feature!') // => 'feat-add-new-feature'
 */
export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_/]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate branch name from issue
 *
 * @param issueNumber - GitHub issue number
 * @param adwId - ADW identifier
 * @param title - Issue title
 * @param issueClass - Issue classification (feature, bug, chore)
 * @returns Formatted branch name
 *
 * @example
 * generateBranchName(123, 'abc12345', 'Add user auth', 'feature')
 * // => 'feat-123-abc12345-add-user-auth'
 */
export function generateBranchName(
  issueNumber: number,
  adwId: string,
  title: string,
  issueClass: 'feature' | 'bug' | 'chore'
): string {
  const prefix = issueClass === 'feature' ? 'feat' :
                 issueClass === 'bug' ? 'fix' : 'chore';

  const slug = sanitizeBranchName(title).substring(0, 50);

  return `${prefix}-${issueNumber}-${adwId}-${slug}`;
}

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param maxRetries - Maximum retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise resolving to function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(
          { attempt: attempt + 1, maxRetries, delay, error: lastError.message },
          'Retrying after error'
        );
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}
```

---

## Module 2: Agent Executor

### File: `src/modules/adw/agent-executor.ts`

**Purpose**: Execute agents using native Agent SDK (no subprocess calls)

**Python Source**: `adws/adw_modules/agent.py` (558 lines)

**Key Differences from Python:**
- Direct Agent SDK integration (not subprocess)
- Native TypeScript async/await
- Streaming via callbacks
- No JSONL file parsing needed

**Implementation:**

```typescript
/**
 * Agent Executor
 *
 * Executes agents using @anthropic-ai/sdk directly.
 * Replaces Python subprocess calls with native SDK integration.
 *
 * Key features:
 * - Direct Agent SDK usage
 * - Model selection based on slash command + model set
 * - Retry logic with exponential backoff
 * - Database-backed output storage
 * - Streaming support via callbacks
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import { createAgentOutput } from '../../database/queries/adw.js';
import { getWorkflow } from '../../database/queries/adw.js';
import {
  AgentExecutionConfig,
  AgentExecutionResult,
  SLASH_COMMAND_MODEL_MAP,
  RetryCode,
  ModelSet,
  SlashCommand,
} from './types.js';
import { retryWithBackoff } from './utils.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

/**
 * Get model for a slash command based on workflow's model set
 *
 * @param adwId - Workflow identifier
 * @param slashCommand - The slash command being executed
 * @param defaultModel - Fallback model if not mapped
 * @returns Model name to use
 */
async function getModelForCommand(
  adwId: string,
  slashCommand: SlashCommand,
  defaultModel = 'claude-sonnet-4-20250514'
): Promise<string> {
  try {
    // Get workflow to determine model set
    const workflow = await getWorkflow(adwId);
    const modelSet: ModelSet = (workflow?.modelSet as ModelSet) ?? 'base';

    // Look up model mapping
    const commandModels = SLASH_COMMAND_MODEL_MAP[slashCommand];

    if (commandModels) {
      const modelName = commandModels[modelSet];

      // Map short names to full model IDs
      const modelMap: Record<string, string> = {
        'sonnet': 'claude-sonnet-4-20250514',
        'opus': 'claude-opus-4-20250514',
        'haiku': 'claude-haiku-4-20250514',
      };

      return modelMap[modelName] ?? modelName;
    }

    return defaultModel;
  } catch (error) {
    logger.warn({ error, adwId }, 'Failed to determine model, using default');
    return defaultModel;
  }
}

/**
 * Execute an agent with retry logic
 *
 * @param config - Agent execution configuration
 * @returns Execution result with output and status
 *
 * @example
 * ```typescript
 * const result = await executeAgent({
 *   adwId: 'abc12345',
 *   agentName: 'planner',
 *   slashCommand: '/plan',
 *   args: ['issue-123.md'],
 *   workingDir: '/path/to/worktree'
 * });
 *
 * if (result.success) {
 *   console.log('Agent output:', result.output);
 * }
 * ```
 */
export async function executeAgent(
  config: AgentExecutionConfig
): Promise<AgentExecutionResult> {
  const {
    adwId,
    agentName,
    slashCommand,
    args,
    workingDir,
    dangerouslySkipPermissions = true,
  } = config;

  logger.info(
    { adwId, agentName, slashCommand, argsCount: args.length },
    'Executing agent'
  );

  try {
    // Determine model to use
    const model = config.model ?? await getModelForCommand(adwId, slashCommand);

    // Construct prompt
    const prompt = `${slashCommand} ${args.join(' ')}`;

    // Execute with retry
    const result = await retryWithBackoff(
      async () => executeAgentOnce(adwId, agentName, prompt, model, workingDir),
      3, // max retries
      1000 // base delay
    );

    // Store output in database
    await createAgentOutput({
      adwId,
      agentName,
      phase: agentName, // e.g., 'planner', 'implementor'
      sessionId: result.sessionId,
      model,
      outputText: result.output,
      success: result.success,
      errorMessage: result.error?.message,
    });

    logger.info(
      { adwId, agentName, success: result.success },
      'Agent execution completed'
    );

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(
      { error, adwId, agentName, slashCommand },
      'Agent execution failed after retries'
    );

    // Store failed output
    await createAgentOutput({
      adwId,
      agentName,
      phase: agentName,
      success: false,
      errorMessage,
    });

    return {
      success: false,
      output: errorMessage,
      retryCode: RetryCode.enum.EXECUTION_ERROR,
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

/**
 * Execute agent once (internal, called by executeAgent with retry)
 */
async function executeAgentOnce(
  adwId: string,
  agentName: string,
  prompt: string,
  model: string,
  workingDir?: string
): Promise<AgentExecutionResult> {

  logger.debug({ adwId, agentName, model, prompt: prompt.substring(0, 100) }, 'Starting agent execution');

  try {
    // Create agent message
    const response = await anthropic.messages.create({
      model,
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      // Add system prompt if needed
      // system: getSystemPromptForAgent(agentName),
    });

    // Extract text from response
    const output = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as Anthropic.TextBlock).text)
      .join('\n\n');

    // Get session ID from response metadata (if available)
    const sessionId = (response as any).session_id as string | undefined;

    return {
      success: true,
      output,
      sessionId,
      retryCode: RetryCode.enum.NONE,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error({ error, adwId, agentName }, 'Agent execution error');

    // Determine retry code based on error type
    let retryCode: RetryCode = RetryCode.enum.EXECUTION_ERROR;

    if (errorMessage.includes('timeout')) {
      retryCode = RetryCode.enum.TIMEOUT_ERROR;
    } else if (errorMessage.includes('rate limit')) {
      retryCode = RetryCode.enum.CLAUDE_CODE_ERROR;
    }

    return {
      success: false,
      output: errorMessage,
      retryCode,
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

/**
 * Execute template-based agent (convenience wrapper)
 *
 * @param config - Execution configuration
 * @returns Execution result
 */
export async function executeTemplate(
  config: AgentExecutionConfig
): Promise<AgentExecutionResult> {
  return executeAgent(config);
}
```

**Implementation Notes:**
- ⚠️ **TODO**: Need to integrate with actual Agent SDK tool system
- ⚠️ **TODO**: Add system prompts for different agent types
- ⚠️ **TODO**: Implement proper session management
- ⚠️ **TODO**: Add tool execution callbacks

---

## Module 3: Git Operations

### File: `src/modules/adw/git-operations.ts`

**Purpose**: Git commands using simple-git library

**Python Source**: `adws/adw_modules/git_ops.py`

**Implementation:**

```typescript
/**
 * Git Operations
 *
 * Git commands using simple-git library.
 * Supports working directory context for worktree operations.
 */

import simpleGit, { SimpleGit } from 'simple-git';
import { logger } from '../../config/logger.js';

/**
 * Get git instance for a working directory
 *
 * @param cwd - Working directory (defaults to current)
 * @returns SimpleGit instance
 */
export function getGit(cwd?: string): SimpleGit {
  return simpleGit({
    baseDir: cwd ?? process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
  });
}

/**
 * Get current branch name
 *
 * @param cwd - Working directory
 * @returns Branch name
 */
export async function getCurrentBranch(cwd?: string): Promise<string> {
  const git = getGit(cwd);
  const status = await git.status();

  logger.debug({ branch: status.current, cwd }, 'Got current branch');
  return status.current;
}

/**
 * Create and checkout a new branch
 *
 * @param branchName - Name of branch to create
 * @param cwd - Working directory
 */
export async function createBranch(branchName: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, cwd }, 'Creating branch');
  await git.checkoutLocalBranch(branchName);
}

/**
 * Checkout existing branch
 *
 * @param branchName - Branch to checkout
 * @param cwd - Working directory
 */
export async function checkoutBranch(branchName: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, cwd }, 'Checking out branch');
  await git.checkout(branchName);
}

/**
 * Stage all changes
 *
 * @param cwd - Working directory
 */
export async function stageAll(cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.debug({ cwd }, 'Staging all changes');
  await git.add('.');
}

/**
 * Create a commit
 *
 * @param message - Commit message
 * @param cwd - Working directory
 */
export async function commit(message: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ message: message.substring(0, 50), cwd }, 'Creating commit');
  await git.commit(message);
}

/**
 * Push branch to remote
 *
 * @param branchName - Branch to push
 * @param remote - Remote name (default: 'origin')
 * @param cwd - Working directory
 */
export async function pushBranch(
  branchName: string,
  remote = 'origin',
  cwd?: string
): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, remote, cwd }, 'Pushing branch');
  await git.push(remote, branchName, ['--set-upstream']);
}

/**
 * Get commit count for current branch
 *
 * @param cwd - Working directory
 * @returns Number of commits
 */
export async function getCommitCount(cwd?: string): Promise<number> {
  const git = getGit(cwd);

  const log = await git.log();
  return log.total;
}

/**
 * Check if working directory is clean
 *
 * @param cwd - Working directory
 * @returns True if no uncommitted changes
 */
export async function isClean(cwd?: string): Promise<boolean> {
  const git = getGit(cwd);

  const status = await git.status();
  return status.isClean();
}
```

---

## Module 4: Worktree Manager

### File: `src/modules/adw/worktree-manager.ts`

**Purpose**: Manage git worktrees with port allocation

**Python Source**: `adws/adw_modules/worktree_ops.py`

**Implementation:** (Continued in next message due to length)

---

## Implementation Checklist

### Week 1: Foundation Modules

- [ ] Create `src/modules/adw/` directory
- [ ] Implement `types.ts` with all type definitions
- [ ] Implement `utils.ts` with utility functions
- [ ] Write unit tests for utils
- [ ] Implement `git-operations.ts` with simple-git
- [ ] Write unit tests for git operations

### Week 2: Core Execution

- [ ] Implement `agent-executor.ts` with Agent SDK
- [ ] Implement `worktree-manager.ts` with port allocation
- [ ] Implement `state-manager.ts` with database operations
- [ ] Write integration tests

### Week 3: Integration

- [ ] Implement `github-integration.ts` with @octokit
- [ ] Implement `workflow-manager.ts` orchestration
- [ ] End-to-end testing
- [ ] Documentation updates

---

**Next**: Detailed implementation for remaining modules
