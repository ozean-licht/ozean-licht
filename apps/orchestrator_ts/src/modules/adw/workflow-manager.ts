/**
 * Workflow Manager Module
 *
 * Orchestrates complete ADW workflows by coordinating all other ADW modules.
 * This is the highest-level module that combines agent execution, state management,
 * GitHub integration, and git operations to implement complete SDLC workflows.
 *
 * Key responsibilities:
 * - Issue classification and branch name generation
 * - Plan building and implementation orchestration
 * - Commit creation and pull request management
 * - Workflow state coordination across multiple modules
 *
 * Migrated from Python: adws/adw_modules/workflow_ops.py
 *
 * @module modules/adw/workflow-manager
 */

import { logger } from '../../config/logger.js';
import { executeAgent } from './agent-executor.js';
import { getWorkflowState, updateWorkflowState } from './state-manager.js';
import { fetchIssue, ADW_BOT_IDENTIFIER } from './github-integration.js';
import {
  getGit,
  getCurrentBranch,
  createBranch,
  stageAll,
  commit as gitCommit,
  checkoutBranch,
} from './git-operations.js';
import {
  AgentExecutionResult,
  GitHubIssue,
  SlashCommand,
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

/**
 * Agent name constants for workflow operations
 * These correspond to specific agent roles in the SDLC workflow
 */
export const AGENT_PLANNER = 'sdlc_planner';
export const AGENT_IMPLEMENTOR = 'sdlc_implementor';
export const AGENT_CLASSIFIER = 'issue_classifier';
export const AGENT_BRANCH_GENERATOR = 'branch_generator';
export const AGENT_PR_CREATOR = 'pr_creator';

/**
 * Available workflow types for validation
 * Defines all supported workflow types in the ADW system
 */
export const AVAILABLE_WORKFLOWS = [
  'plan',
  'patch',
  'build',
  'test',
  'review',
  'document',
  'ship',
  'plan_build',
  'plan_build_test',
  'sdlc',
  'sdlc_zte',
] as const;

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Issue classification result
 * Slash commands that can be used to build implementation plans
 */
export type IssueClassification = '/chore' | '/bug' | '/feature' | '0';

/**
 * Generic workflow operation result
 */
export interface WorkflowResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Branch creation/lookup result
 */
export interface BranchResult {
  branchName: string;
  error?: string;
}

/**
 * Plan file location result
 */
export interface PlanResult {
  planFile: string;
  error?: string;
}

// ============================================================================
// Core Workflow Operations
// ============================================================================

/**
 * Classify a GitHub issue to determine the appropriate workflow command
 *
 * Uses the /classify_issue agent to analyze the issue and return one of:
 * - /chore: Maintenance tasks, refactoring, tooling
 * - /bug: Bug fixes
 * - /feature: New features
 * - 0: No valid classification (skip)
 *
 * @param issue - GitHub issue to classify
 * @param adwId - Workflow identifier
 * @returns Tuple of [classification, error]. Error is null on success.
 *
 * @example
 * ```typescript
 * const [classification, error] = await classifyIssue(issue, 'abc123');
 * if (error) {
 *   console.error('Classification failed:', error);
 * } else {
 *   console.log('Issue classified as:', classification);
 * }
 * ```
 */
export async function classifyIssue(
  issue: GitHubIssue,
  adwId: string
): Promise<[IssueClassification | null, string | null]> {
  try {
    logger.debug({ issueNumber: issue.number, adwId }, 'Classifying issue');

    // Extract minimal issue data to reduce token usage
    const minimalIssueJson = extractMinimalIssue(issue);

    // Execute classification agent
    const result = await executeAgent({
      adwId,
      agentName: AGENT_CLASSIFIER,
      slashCommand: '/classify_issue' as SlashCommand,
      args: [minimalIssueJson],
    });

    if (!result.success) {
      return [null, result.output];
    }

    // Parse classification from response
    const output = result.output.trim();
    const match = output.match(/\/chore|\/bug|\/feature|0/);
    const classification = match ? match[0] : output;

    // Validate classification
    if (classification === '0') {
      return [null, `No command selected: ${result.output}`];
    }

    if (!['/chore', '/bug', '/feature'].includes(classification)) {
      return [null, `Invalid command selected: ${result.output}`];
    }

    logger.info(
      { issueNumber: issue.number, classification },
      'Issue classified successfully'
    );

    return [classification as IssueClassification, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber: issue.number }, 'Issue classification failed');
    return [null, errorMessage];
  }
}

/**
 * Build an implementation plan for a GitHub issue
 *
 * Uses one of the plan-building commands (/chore, /bug, /feature) to create
 * a detailed implementation specification in the specs/ directory.
 *
 * @param issue - GitHub issue to plan for
 * @param command - Slash command to use (/chore, /bug, or /feature)
 * @param adwId - Workflow identifier
 * @param workingDir - Optional working directory (defaults to main repo)
 * @returns Agent execution result containing plan file path
 *
 * @example
 * ```typescript
 * const result = await buildPlan(issue, '/feature', 'abc123');
 * if (result.success) {
 *   console.log('Plan created at:', result.output);
 * }
 * ```
 */
export async function buildPlan(
  issue: GitHubIssue,
  command: string,
  adwId: string,
  workingDir?: string
): Promise<AgentExecutionResult> {
  logger.info(
    { issueNumber: issue.number, command, adwId },
    'Building implementation plan'
  );

  try {
    // Extract minimal issue data
    const minimalIssueJson = extractMinimalIssue(issue);

    // Execute plan-building agent
    const result = await executeAgent({
      adwId,
      agentName: AGENT_PLANNER,
      slashCommand: command as SlashCommand,
      args: [String(issue.number), adwId, minimalIssueJson],
      workingDir,
    });

    if (result.success) {
      logger.info(
        { issueNumber: issue.number, planFile: result.output.substring(0, 100) },
        'Plan built successfully'
      );
    } else {
      logger.error(
        { issueNumber: issue.number, error: result.output },
        'Plan building failed'
      );
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber: issue.number }, 'Plan building error');

    return {
      success: false,
      output: errorMessage,
      retryCode: 'EXECUTION_ERROR',
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

/**
 * Implement a plan using the /implement command
 *
 * Takes a plan file path and executes the implementation steps defined in it.
 * The implementation agent reads the plan and makes all necessary code changes.
 *
 * @param planFile - Path to the plan markdown file
 * @param adwId - Workflow identifier
 * @param workingDir - Optional working directory (defaults to main repo)
 * @returns Agent execution result
 *
 * @example
 * ```typescript
 * const result = await implementPlan('specs/feature-123.md', 'abc123');
 * if (result.success) {
 *   console.log('Implementation complete');
 * }
 * ```
 */
export async function implementPlan(
  planFile: string,
  adwId: string,
  workingDir?: string
): Promise<AgentExecutionResult> {
  logger.info({ planFile, adwId }, 'Implementing plan');

  try {
    const result = await executeAgent({
      adwId,
      agentName: AGENT_IMPLEMENTOR,
      slashCommand: '/implement' as SlashCommand,
      args: [planFile],
      workingDir,
    });

    if (result.success) {
      logger.info({ planFile }, 'Plan implemented successfully');
    } else {
      logger.error({ planFile, error: result.output }, 'Plan implementation failed');
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, planFile }, 'Plan implementation error');

    return {
      success: false,
      output: errorMessage,
      retryCode: 'EXECUTION_ERROR',
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

/**
 * Generate a git branch name for an issue
 *
 * Uses the /generate_branch_name agent to create a descriptive branch name
 * following the pattern: {type}/issue-{number}-adw-{adwId}-{description}
 *
 * @param issue - GitHub issue to generate branch name for
 * @param issueClass - Issue classification (/chore, /bug, or /feature)
 * @param adwId - Workflow identifier
 * @returns Tuple of [branchName, error]. Error is null on success.
 *
 * @example
 * ```typescript
 * const [branchName, error] = await generateBranchName(issue, '/feature', 'abc123');
 * if (error) {
 *   console.error('Branch name generation failed:', error);
 * } else {
 *   console.log('Generated branch:', branchName);
 * }
 * ```
 */
export async function generateBranchName(
  issue: GitHubIssue,
  issueClass: IssueClassification,
  adwId: string
): Promise<[string | null, string | null]> {
  try {
    logger.debug({ issueNumber: issue.number, issueClass }, 'Generating branch name');

    // Remove leading slash from issue class
    const issueType = issueClass.replace('/', '');

    // Extract minimal issue data
    const minimalIssueJson = extractMinimalIssue(issue);

    // Execute branch name generator
    const result = await executeAgent({
      adwId,
      agentName: AGENT_BRANCH_GENERATOR,
      slashCommand: '/generate_branch_name' as SlashCommand,
      args: [issueType, adwId, minimalIssueJson],
    });

    if (!result.success) {
      return [null, result.output];
    }

    const branchName = result.output.trim();
    logger.info({ branchName, issueNumber: issue.number }, 'Branch name generated');

    return [branchName, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber: issue.number }, 'Branch name generation failed');
    return [null, errorMessage];
  }
}

/**
 * Create a git commit with an AI-generated commit message
 *
 * Uses the /commit agent to analyze changes and generate a conventional
 * commit message. Stages all changes and creates the commit.
 *
 * @param issue - GitHub issue being worked on
 * @param issueClass - Issue classification (/chore, /bug, or /feature)
 * @param adwId - Workflow identifier
 * @param workingDir - Working directory path
 * @returns Tuple of [commitMessage, error]. Error is null on success.
 *
 * @example
 * ```typescript
 * const [message, error] = await createCommit(issue, '/feature', 'abc123', '/path/to/worktree');
 * if (error) {
 *   console.error('Commit creation failed:', error);
 * } else {
 *   console.log('Commit created:', message);
 * }
 * ```
 */
export async function createCommit(
  issue: GitHubIssue,
  issueClass: IssueClassification,
  adwId: string,
  workingDir: string
): Promise<[string | null, string | null]> {
  try {
    logger.debug({ issueNumber: issue.number, issueClass }, 'Creating commit');

    // Remove leading slash from issue class
    const issueType = issueClass.replace('/', '');

    // Create unique committer agent name
    const agentName = `${AGENT_IMPLEMENTOR}_committer`;

    // Extract minimal issue data
    const minimalIssueJson = extractMinimalIssue(issue);

    // Execute commit message generator
    const result = await executeAgent({
      adwId,
      agentName,
      slashCommand: '/commit' as SlashCommand,
      args: [AGENT_IMPLEMENTOR, issueType, minimalIssueJson],
      workingDir,
    });

    if (!result.success) {
      return [null, result.output];
    }

    const commitMessage = result.output.trim();

    // Stage all changes
    await stageAll(workingDir);

    // Create commit
    await gitCommit(commitMessage, workingDir);

    logger.info(
      { commitMessage: commitMessage.substring(0, 50), issueNumber: issue.number },
      'Commit created successfully'
    );

    return [commitMessage, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber: issue.number }, 'Commit creation failed');
    return [null, errorMessage];
  }
}

/**
 * Create a pull request for implemented changes
 *
 * Uses the /pull_request agent to generate PR title and body, then creates
 * the pull request on GitHub.
 *
 * @param branchName - Branch containing the changes
 * @param issue - GitHub issue being implemented
 * @param adwId - Workflow identifier
 * @param planFile - Path to the implementation plan
 * @param workingDir - Working directory path
 * @returns Tuple of [prUrl, error]. Error is null on success.
 *
 * @example
 * ```typescript
 * const [prUrl, error] = await createPullRequest(
 *   'feat/new-feature',
 *   issue,
 *   'abc123',
 *   'specs/feature-123.md',
 *   '/path/to/worktree'
 * );
 * if (error) {
 *   console.error('PR creation failed:', error);
 * } else {
 *   console.log('PR created:', prUrl);
 * }
 * ```
 */
export async function createPullRequest(
  branchName: string,
  issue: GitHubIssue,
  adwId: string,
  planFile: string,
  workingDir: string
): Promise<[string | null, string | null]> {
  try {
    logger.debug({ branchName, issueNumber: issue.number }, 'Creating pull request');

    // Extract minimal issue data
    const minimalIssueJson = extractMinimalIssue(issue);

    // Execute PR creator agent
    const result = await executeAgent({
      adwId,
      agentName: AGENT_PR_CREATOR,
      slashCommand: '/pull_request' as SlashCommand,
      args: [branchName, minimalIssueJson, planFile, adwId],
      workingDir,
    });

    if (!result.success) {
      return [null, result.output];
    }

    const prUrl = result.output.trim();
    logger.info({ prUrl, issueNumber: issue.number }, 'Pull request created');

    return [prUrl, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber: issue.number }, 'PR creation failed');
    return [null, errorMessage];
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format a message for GitHub issue comments with ADW bot identifier
 *
 * Prepends the ADW_BOT_IDENTIFIER and workflow tracking information to enable:
 * - Loop prevention (webhook ignores messages with this identifier)
 * - Workflow tracking and debugging
 *
 * @param adwId - Workflow identifier
 * @param agentName - Name of the agent posting the message
 * @param message - Message content
 * @param sessionId - Optional Claude session ID for tracking
 * @returns Formatted message string
 *
 * @example
 * ```typescript
 * const comment = formatIssueMessage('abc123', 'planner', 'Starting plan...', 'session_xyz');
 * // Returns: "[ADW-AGENTS] abc123_planner_session_xyz: Starting plan..."
 * ```
 */
export function formatIssueMessage(
  adwId: string,
  agentName: string,
  message: string,
  sessionId?: string
): string {
  if (sessionId) {
    return `${ADW_BOT_IDENTIFIER} ${adwId}_${agentName}_${sessionId}: ${message}`;
  }
  return `${ADW_BOT_IDENTIFIER} ${adwId}_${agentName}: ${message}`;
}

/**
 * Extract minimal issue data for token efficiency
 *
 * Reduces issue payload to only the essential fields needed by agents:
 * - number: For reference and branch naming
 * - title: For context and planning
 * - body: For detailed requirements
 *
 * This significantly reduces token usage when passing issues to agents.
 *
 * @param issue - Full GitHub issue object
 * @returns JSON string containing only number, title, and body
 *
 * @example
 * ```typescript
 * const minimal = extractMinimalIssue(issue);
 * // Returns: '{"number":123,"title":"Add feature","body":"Description..."}'
 * ```
 */
export function extractMinimalIssue(issue: GitHubIssue): string {
  return JSON.stringify({
    number: issue.number,
    title: issue.title,
    body: issue.body,
  });
}

/**
 * Find an existing branch for a GitHub issue
 *
 * Searches all local and remote branches for one matching the issue number.
 * Optionally filters by ADW ID if provided.
 *
 * Branch naming pattern: {type}/issue-{number}-adw-{adwId}-{description}
 *
 * @param issueNumber - Issue number to search for
 * @param adwId - Optional ADW ID to filter by
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Branch name if found, null otherwise
 *
 * @example
 * ```typescript
 * const branch = await findExistingBranchForIssue(123, 'abc123');
 * if (branch) {
 *   console.log('Found existing branch:', branch);
 * }
 * ```
 */
export async function findExistingBranchForIssue(
  issueNumber: number,
  adwId?: string,
  cwd?: string
): Promise<string | null> {
  try {
    const git = getGit(cwd);

    // Get all branches (local and remote)
    const branchSummary = await git.branch(['-a']);
    const allBranches = Object.keys(branchSummary.branches);

    // Search for branch matching the issue number pattern
    for (const branch of allBranches) {
      // Clean branch name (remove remote prefix, asterisk, etc.)
      const cleanBranch = branch
        .trim()
        .replace('* ', '')
        .replace('remotes/origin/', '');

      // Check for issue number pattern
      if (cleanBranch.includes(`-issue-${issueNumber}-`)) {
        // If adwId provided, also check for ADW ID match
        if (adwId && cleanBranch.includes(`-adw-${adwId}-`)) {
          logger.debug({ branch: cleanBranch, issueNumber, adwId }, 'Found matching branch');
          return cleanBranch;
        } else if (!adwId) {
          // Return first match if no adwId specified
          logger.debug({ branch: cleanBranch, issueNumber }, 'Found matching branch');
          return cleanBranch;
        }
      }
    }

    logger.debug({ issueNumber, adwId }, 'No existing branch found');
    return null;
  } catch (error) {
    logger.error({ error, issueNumber, adwId }, 'Failed to search for existing branch');
    return null;
  }
}

/**
 * Create a new branch or find an existing one for an issue
 *
 * This is a high-level orchestration function that:
 * 1. Checks workflow state for existing branch name
 * 2. Searches for existing branches matching the issue
 * 3. If none found, classifies the issue and generates a new branch
 * 4. Creates and checks out the branch
 * 5. Updates workflow state with branch name
 *
 * @param issueNumber - Issue number to create branch for
 * @param issue - Full GitHub issue object
 * @param adwId - Workflow identifier
 * @param cwd - Working directory path
 * @returns Tuple of [branchName, error]. Error is null on success.
 *
 * @example
 * ```typescript
 * const [branchName, error] = await createOrFindBranch(123, issue, 'abc123', '/path/to/worktree');
 * if (error) {
 *   console.error('Branch setup failed:', error);
 * } else {
 *   console.log('Working on branch:', branchName);
 * }
 * ```
 */
export async function createOrFindBranch(
  issueNumber: number,
  issue: GitHubIssue,
  adwId: string,
  cwd?: string
): Promise<[string | null, string | null]> {
  try {
    // 1. Check state for branch name
    const state = await getWorkflowState(adwId);
    if (state?.branchName) {
      logger.info({ branchName: state.branchName }, 'Found branch in state');

      // Verify we're on the correct branch
      const currentBranch = await getCurrentBranch(cwd);
      if (currentBranch !== state.branchName) {
        // Try to checkout the branch
        try {
          await checkoutBranch(state.branchName, cwd);
        } catch (error) {
          logger.warn(
            { branch: state.branchName, error },
            'Failed to checkout branch from state'
          );
          // Branch might not exist locally - continue to search/create
        }
      }

      return [state.branchName, null];
    }

    // 2. Look for existing branch
    const existingBranch = await findExistingBranchForIssue(issueNumber, adwId, cwd);
    if (existingBranch) {
      logger.info({ branch: existingBranch }, 'Found existing branch');

      // Checkout the branch
      await checkoutBranch(existingBranch, cwd);

      // Update state
      await updateWorkflowState(adwId, { branchName: existingBranch });

      return [existingBranch, null];
    }

    // 3. Create new branch - classify issue first
    logger.info({ issueNumber }, 'No existing branch found, creating new one');

    // Classify the issue
    const [issueClass, classifyError] = await classifyIssue(issue, adwId);
    if (classifyError || !issueClass) {
      return [null, `Failed to classify issue: ${classifyError}`];
    }

    // Update state with classification
    await updateWorkflowState(adwId, { issueClass: issueClass.replace('/', '') });

    // Generate branch name
    const [branchName, nameError] = await generateBranchName(issue, issueClass, adwId);
    if (nameError || !branchName) {
      return [null, `Failed to generate branch name: ${nameError}`];
    }

    // Create the branch
    await createBranch(branchName, cwd);

    // Update state with branch name
    await updateWorkflowState(adwId, { branchName });

    logger.info({ branchName }, 'Created and checked out new branch');

    return [branchName, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, issueNumber }, 'Failed to create or find branch');
    return [null, errorMessage];
  }
}

/**
 * Find the spec/plan file for a workflow
 *
 * Searches for the implementation plan file using multiple strategies:
 * 1. Check workflow state for planFile field
 * 2. Examine git diff for specs/*.md files
 * 3. Derive from branch name pattern
 *
 * @param adwId - Workflow identifier
 * @param workingDir - Optional working directory (for worktree workflows)
 * @returns Path to spec file if found, null otherwise
 *
 * @example
 * ```typescript
 * const specFile = await findSpecFile('abc123', '/path/to/worktree');
 * if (specFile) {
 *   console.log('Found spec file:', specFile);
 * }
 * ```
 */
export async function findSpecFile(
  adwId: string,
  workingDir?: string
): Promise<string | null> {
  try {
    // 1. Check state for plan file
    const state = await getWorkflowState(adwId);
    if (state?.planFile) {
      logger.info({ planFile: state.planFile }, 'Found spec file in state');
      return state.planFile;
    }

    // 2. Check git diff for specs/*.md files
    logger.debug({ adwId }, 'Searching git diff for spec files');

    const git = getGit(workingDir);

    // Get diff from origin/main
    const diff = await git.diff(['origin/main', '--name-only']);
    const files = diff.split('\n').filter(Boolean);

    // Look for spec files
    const specFiles = files.filter(
      (f) => f.startsWith('specs/') && f.endsWith('.md')
    );

    if (specFiles.length > 0) {
      const specFile = specFiles[0];
      logger.info({ specFile }, 'Found spec file in git diff');
      return specFile;
    }

    // 3. No spec file found
    logger.warn({ adwId }, 'No spec file found');
    return null;
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to find spec file');
    return null;
  }
}

// ============================================================================
// Module 5 Extensions: HTTP API & WebSocket Integration
// ============================================================================

import { createWorkflowState } from './state-manager.js';
import { generateAdwId } from './utils.js';
import { removeWorktree } from './worktree-manager.js';
import {
  broadcastPhaseStarted,
  broadcastPhaseCompleted,
  broadcastWorkflowCompleted,
  broadcastWorkflowFailed,
  broadcastWorkflowUpdate,
} from '../websocket/adw-websocket-manager.js';
import { WorkflowType, ModelSet } from './types.js';

/**
 * Create a new workflow from an issue number
 *
 * Initializes a new ADW workflow by fetching the issue from GitHub,
 * creating the workflow state in the database, and preparing the
 * git worktree.
 *
 * @param issueNumber - GitHub issue number
 * @param workflowType - Type of workflow to execute
 * @param modelSet - Model set to use (base or heavy)
 * @returns Result with adwId if successful
 */
export async function createWorkflow(
  issueNumber: number,
  workflowType: WorkflowType,
  modelSet: ModelSet = 'base'
): Promise<WorkflowResult & { adwId?: string }> {
  try {
    logger.info({ issueNumber, workflowType, modelSet }, 'Creating new workflow');

    // Fetch issue from GitHub
    const issue = await fetchIssue(issueNumber);
    if (!issue) {
      return {
        success: false,
        output: '',
        error: `Issue #${issueNumber} not found`,
      };
    }

    // Generate ADW ID
    const adwId = generateAdwId();

    // Create workflow in database
    await createWorkflowState({
      adwId,
      issueNumber,
      workflowType,
      phase: 'initialized',
      status: 'active',
      issueTitle: issue.title,
      issueBody: issue.body,
      modelSet,
    });

    logger.info({ adwId, issueNumber }, 'Workflow created successfully');

    return {
      success: true,
      output: `Workflow ${adwId} created for issue #${issueNumber}`,
      adwId,
    };
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to create workflow');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a specific workflow phase
 *
 * @param adwId - Workflow ID
 * @param slashCommand - Slash command to execute
 * @returns Execution result
 */
export async function executeWorkflowPhase(
  adwId: string,
  slashCommand: SlashCommand
): Promise<WorkflowResult> {
  try {
    logger.info({ adwId, slashCommand }, 'Executing workflow phase');

    // Get workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Broadcast phase started
    broadcastPhaseStarted(adwId, slashCommand, slashCommand);

    // Execute agent
    const result = await executeAgent({
      adwId,
      agentName: `adw_${slashCommand.replace('/', '')}`,
      slashCommand,
      args: [],
      workingDir: workflow.worktreePath || undefined,
    });

    if (!result.success) {
      broadcastPhaseCompleted(adwId, slashCommand, false, result.output);
      return {
        success: false,
        output: '',
        error: result.output,
      };
    }

    broadcastPhaseCompleted(adwId, slashCommand, true, result.output);

    return {
      success: true,
      output: result.output,
    };
  } catch (error) {
    logger.error({ error, adwId, slashCommand }, 'Phase execution failed');
    broadcastPhaseCompleted(adwId, slashCommand, false, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a custom agent prompt
 *
 * @param adwId - Workflow ID
 * @param prompt - Custom prompt text (not yet implemented - placeholder for future use)
 * @returns Execution result
 */
export async function executeCustomPrompt(
  adwId: string,
  prompt: string
): Promise<WorkflowResult> {
  try {
    logger.info({ adwId, promptLength: prompt.length }, 'Executing custom prompt');

    // Get workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Note: Custom prompts not yet fully implemented
    // For now, this is a placeholder that returns an error
    broadcastPhaseStarted(adwId, 'custom', undefined);

    logger.warn({ adwId }, 'Custom prompts not yet implemented');
    broadcastPhaseCompleted(adwId, 'custom', false, 'Custom prompts not yet implemented');

    return {
      success: false,
      output: '',
      error: 'Custom prompts not yet implemented',
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Custom prompt execution failed');
    broadcastPhaseCompleted(adwId, 'custom', false, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute complete workflow from start to finish
 *
 * This orchestrates the full SDLC workflow:
 * 1. Classify issue
 * 2. Generate branch name
 * 3. Create worktree
 * 4. Plan
 * 5. Implement
 * 6. Test (if applicable)
 * 7. Review (if applicable)
 * 8. Commit
 * 9. Create PR
 *
 * @param adwId - Workflow ID
 * @returns Final result
 */
export async function executeFullWorkflow(adwId: string): Promise<WorkflowResult> {
  try {
    logger.info({ adwId }, 'Starting full workflow execution');

    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    broadcastPhaseStarted(adwId, 'full_workflow');

    // Determine workflow steps based on workflow type
    const steps: SlashCommand[] = [];

    switch (workflow.workflowType) {
      case 'sdlc':
        steps.push(
          '/classify_issue',
          '/generate_branch_name',
          '/implement',
          '/test',
          '/review',
          '/commit',
          '/pull_request'
        );
        break;
      case 'plan':
        steps.push('/classify_issue', '/classify_adw');
        break;
      case 'build':
        steps.push('/implement', '/commit');
        break;
      // Add more workflow types as needed
    }

    // Execute each step sequentially
    let lastOutput = '';
    for (const step of steps) {
      const result = await executeWorkflowPhase(adwId, step);
      if (!result.success) {
        broadcastWorkflowFailed(adwId, result.error || 'Unknown error', step);
        return result;
      }
      lastOutput = result.output;
    }

    // Mark workflow as completed
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'shipped',
    });

    broadcastWorkflowCompleted(adwId, workflow.prNumber || undefined);

    return {
      success: true,
      output: lastOutput,
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Full workflow execution failed');
    broadcastWorkflowFailed(adwId, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cleanup a workflow (cancel and remove worktree)
 *
 * @param adwId - Workflow ID
 * @returns Result
 */
export async function cleanupWorkflow(adwId: string): Promise<WorkflowResult> {
  try {
    logger.info({ adwId }, 'Cleaning up workflow');

    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Remove worktree if it exists
    if (workflow.worktreePath && workflow.worktreeExists) {
      await removeWorktree(adwId);
    }

    // Mark as cancelled in database
    await updateWorkflowState(adwId, {
      status: 'cancelled',
      worktreeExists: false,
    });

    broadcastWorkflowUpdate({
      type: 'workflow_updated',
      timestamp: new Date().toISOString(),
      adwId,
      data: { status: 'cancelled' },
    });

    return {
      success: true,
      output: `Workflow ${adwId} cancelled and cleaned up`,
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to cleanup workflow');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Phase 2.2: Workflow Orchestration
// ============================================================================

import { executePlanBuildWorkflow } from './workflows/orchestrators/plan-build.js';
import { executePlanBuildTestWorkflow } from './workflows/orchestrators/plan-build-test.js';
import { executePlanBuildReviewWorkflow } from './workflows/orchestrators/plan-build-review.js';
import { executePlanBuildTestReviewWorkflow } from './workflows/orchestrators/plan-build-test-review.js';
import { executeSdlcWorkflow } from './workflows/orchestrators/sdlc.js';
import { executeZteWorkflow } from './workflows/orchestrators/zte.js';
import type { WorkflowContext, WorkflowPhaseResult } from './types.js';

/**
 * Build workflow context from database state
 *
 * Loads complete workflow state and constructs WorkflowContext
 * for orchestrator execution.
 *
 * @param adwId - Workflow identifier
 * @returns Complete workflow context
 * @throws Error if workflow not found
 */
export async function buildWorkflowContext(adwId: string): Promise<WorkflowContext> {
  const workflow = await getWorkflowState(adwId);

  if (!workflow) {
    throw new Error(`Workflow ${adwId} not found`);
  }

  // Parse workflow type
  const workflowType = workflow.workflowType as WorkflowType;

  // Parse model set with default
  const modelSet = (workflow.modelSet as ModelSet) || 'base';

  // Determine auto-ship based on workflow type
  const autoShip = workflowType === 'zte' || workflowType === 'sdlc_zte';

  return {
    adwId: workflow.adwId,
    issueNumber: workflow.issueNumber,
    workflowType,
    worktreePath: workflow.worktreePath,
    branchName: workflow.branchName,
    backendPort: workflow.backendPort,
    frontendPort: workflow.frontendPort,
    modelSet,
    autoResolve: true, // Can be overridden by workflow configuration
    autoShip,
    prNumber: workflow.prNumber,
    planFile: workflow.planFile,
    issueClass: workflow.issueClass,
    issueTitle: workflow.issueTitle,
    issueBody: workflow.issueBody,
    phase: workflow.phase,
    status: workflow.status,
  };
}

/**
 * Validate workflow type is recognized
 *
 * @param type - Workflow type string to validate
 * @returns True if valid, false otherwise
 */
export function validateWorkflowType(type: string): boolean {
  const validTypes = [
    'plan-build',
    'plan-build-test',
    'plan-build-review',
    'plan-build-test-review',
    'sdlc',
    'zte',
    'sdlc_zte', // Alias for zte
  ];

  return validTypes.includes(type);
}

/**
 * Execute workflow orchestrator based on workflow type
 *
 * Routes to appropriate orchestrator based on workflow type
 * and executes the complete workflow.
 *
 * @param adwId - Workflow identifier
 * @param workflowType - Type of workflow to execute
 * @returns Workflow execution result
 *
 * @example
 * ```typescript
 * const result = await executeWorkflow('abc123', 'plan-build');
 * if (result.success) {
 *   console.log('Workflow completed successfully');
 * }
 * ```
 */
export async function executeWorkflow(
  adwId: string,
  workflowType?: string
): Promise<WorkflowPhaseResult> {
  try {
    // Build context from database state
    const context = await buildWorkflowContext(adwId);

    // Use provided workflow type or context workflow type
    const type = workflowType || context.workflowType;

    // Validate workflow type
    if (!validateWorkflowType(type)) {
      return {
        success: false,
        error: `Unknown workflow type: ${type}`,
        message: `Workflow type '${type}' is not recognized. Valid types: plan-build, plan-build-test, plan-build-review, plan-build-test-review, sdlc, zte`,
      };
    }

    logger.info(
      { adwId, workflowType: type },
      'Executing workflow via orchestrator'
    );

    // Route to appropriate orchestrator
    switch (type) {
      case 'plan-build':
        return executePlanBuildWorkflow(context);

      case 'plan-build-test':
        return executePlanBuildTestWorkflow(context);

      case 'plan-build-review':
        return executePlanBuildReviewWorkflow(context);

      case 'plan-build-test-review':
        return executePlanBuildTestReviewWorkflow(context);

      case 'sdlc':
        return executeSdlcWorkflow(context);

      case 'zte':
      case 'sdlc_zte':
        return executeZteWorkflow(context);

      default:
        return {
          success: false,
          error: `Workflow type not implemented: ${type}`,
          message: `Workflow type '${type}' routing not implemented`,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error, adwId, workflowType }, 'Failed to execute workflow');

    return {
      success: false,
      error: errorMessage,
      message: `Workflow execution failed: ${errorMessage}`,
    };
  }
}
