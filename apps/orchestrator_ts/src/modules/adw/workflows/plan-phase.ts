/**
 * Plan Phase Workflow
 *
 * Executes the plan generation phase of the ADW workflow.
 * This phase is responsible for:
 * - Issue classification via /classify_issue slash command
 * - Worktree creation and initialization
 * - Port allocation (deterministic based on ADW ID)
 * - Plan generation via /plan slash command
 * - Plan file persistence to specs/ directory
 * - PR creation/update via GitHub API
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/plan-phase
 */

import { logger } from '../../../config/logger.js';
import { executeAgent } from '../agent-executor.js';
import {
  getWorkflowState,
  updateWorkflowState,
  getWorkingDirectory,
} from '../state-manager.js';
import {
  createWorktree,
  setupWorktreeEnvironment,
  getWorktreePath,
} from '../worktree-manager.js';
import { pushBranch } from '../git-operations.js';
import {
  createPullRequest,
  fetchIssue,
  makeIssueComment,
} from '../github-integration.js';
import { generateBranchName, retryWithBackoff } from '../utils.js';
import type { WorkflowPhaseResult, SlashCommand } from '../types.js';
import fs from 'fs';
import path from 'path';

/**
 * Context required for plan phase execution
 */
export interface PlanPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
  /** GitHub issue number */
  issueNumber: number;
  /** Model set to use (base/heavy) */
  modelSet?: 'base' | 'heavy';
}

/**
 * Execute the plan phase workflow
 *
 * This phase performs the following operations:
 * 1. Fetch issue details from GitHub
 * 2. Classify issue via /classify_issue slash command
 * 3. Generate branch name based on classification
 * 4. Create git worktree for isolated execution
 * 5. Setup port configuration in worktree
 * 6. Generate plan via /plan slash command
 * 7. Extract plan file path from agent output
 * 8. Push branch to remote
 * 9. Create pull request on GitHub
 * 10. Update workflow state with plan details
 *
 * @param context - Plan phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executePlanPhase({
 *   adwId: 'abc12345',
 *   issueNumber: 123,
 *   modelSet: 'base'
 * });
 *
 * if (result.success) {
 *   console.log('Plan phase completed successfully');
 * } else {
 *   console.error('Plan phase failed:', result.error);
 * }
 * ```
 */
export async function executePlanPhase(
  context: PlanPhaseContext
): Promise<WorkflowPhaseResult> {
  const { adwId, issueNumber, modelSet } = context;

  logger.info(
    { adwId, issueNumber, modelSet, phase: 'plan' },
    'Starting plan phase execution'
  );

  try {
    // 1. Load workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      throw new Error(`Workflow ${adwId} not found`);
    }

    // 2. Fetch issue details from GitHub
    logger.info({ adwId, issueNumber }, 'Fetching issue details');
    const issue = await retryWithBackoff(
      async () => fetchIssue(issueNumber),
      3,
      1000
    );

    // Update state with issue details
    await updateWorkflowState(adwId, {
      issueClass: undefined, // Will be set after classification
    });

    logger.info(
      { adwId, issueTitle: issue.title, issueState: issue.state },
      'Issue details fetched'
    );

    // 3. Classify issue via /classify_issue slash command
    logger.info({ adwId }, 'Classifying issue');
    const classifyResult = await executeAgent({
      adwId,
      agentName: 'classifier',
      slashCommand: '/classify_issue' as SlashCommand,
      args: [issueNumber.toString()],
      workingDir: await getWorkingDirectory(adwId),
      dangerouslySkipPermissions: true,
    });

    if (!classifyResult.success) {
      throw new Error(
        `Issue classification failed: ${classifyResult.error?.message || classifyResult.output}`
      );
    }

    // Extract issue class from agent output
    const issueClass = extractIssueClass(classifyResult.output);
    logger.info({ adwId, issueClass }, 'Issue classified');

    // Update state with issue classification
    await updateWorkflowState(adwId, {
      issueClass: issueClass || 'feature',
    });

    // 4. Generate branch name
    const branchName = generateBranchName(
      issueNumber,
      adwId,
      issue.title,
      (issueClass || 'feature') as 'feature' | 'bug' | 'chore'
    );
    logger.info({ adwId, branchName }, 'Generated branch name');

    // 5. Create worktree for isolated execution
    logger.info({ adwId, branchName }, 'Creating worktree');
    const worktreeConfig = await retryWithBackoff(
      async () => createWorktree(adwId, branchName),
      2,
      2000
    );

    logger.info(
      {
        adwId,
        worktreePath: worktreeConfig.worktreePath,
        backendPort: worktreeConfig.ports.backendPort,
        frontendPort: worktreeConfig.ports.frontendPort,
      },
      'Worktree created successfully'
    );

    // 6. Setup port configuration in worktree
    setupWorktreeEnvironment(
      worktreeConfig.worktreePath,
      worktreeConfig.ports.backendPort,
      worktreeConfig.ports.frontendPort
    );

    // Update state with worktree and branch details
    await updateWorkflowState(adwId, {
      branchName,
      worktreePath: worktreeConfig.worktreePath,
      worktreeExists: true,
      backendPort: worktreeConfig.ports.backendPort,
      frontendPort: worktreeConfig.ports.frontendPort,
    });

    // 7. Generate plan via /plan slash command
    logger.info({ adwId }, 'Generating implementation plan');
    const planResult = await executeAgent({
      adwId,
      agentName: 'planner',
      slashCommand: '/plan' as SlashCommand,
      args: [issueNumber.toString(), adwId],
      workingDir: worktreeConfig.worktreePath,
      dangerouslySkipPermissions: true,
    });

    if (!planResult.success) {
      throw new Error(
        `Plan generation failed: ${planResult.error?.message || planResult.output}`
      );
    }

    logger.info({ adwId }, 'Plan generated successfully');

    // 8. Extract plan file path from agent output
    const planFile = extractPlanFilePath(planResult.output, worktreeConfig.worktreePath);
    if (planFile) {
      logger.info({ adwId, planFile }, 'Plan file extracted');
      await updateWorkflowState(adwId, { planFile });
    } else {
      logger.warn({ adwId }, 'Could not extract plan file path from agent output');
    }

    // 9. Push branch to remote
    logger.info({ adwId, branchName }, 'Pushing branch to remote');
    await retryWithBackoff(
      async () => pushBranch(branchName, 'origin', worktreeConfig.worktreePath),
      3,
      2000
    );

    // 10. Create pull request
    logger.info({ adwId, branchName }, 'Creating pull request');
    const prTitle = `${issueClass || 'feat'}: ${issue.title}`;
    const prBody = generatePRBody(issue.number, adwId, planFile);

    const prNumber = await retryWithBackoff(
      async () =>
        createPullRequest(
          prTitle,
          prBody,
          branchName,
          'main',
          worktreeConfig.worktreePath
        ),
      3,
      2000
    );

    logger.info({ adwId, prNumber }, 'Pull request created');

    // 11. Post comment to issue
    await makeIssueComment(
      issueNumber,
      `Plan phase completed successfully!\n\nPull Request: #${prNumber}\nBranch: \`${branchName}\`\nWorktree: \`${worktreeConfig.worktreePath}\``
    );

    // 12. Update workflow state with PR and phase completion
    await updateWorkflowState(adwId, {
      prNumber,
      phase: 'planned',
      status: 'active',
    });

    logger.info(
      { adwId, prNumber, phase: 'planned' },
      'Plan phase completed successfully'
    );

    return {
      success: true,
      message: 'Plan phase completed successfully',
      data: {
        branchName,
        prNumber,
        planFile,
        worktreePath: worktreeConfig.worktreePath,
        backendPort: worktreeConfig.ports.backendPort,
        frontendPort: worktreeConfig.ports.frontendPort,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'plan' },
      'Plan phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'planned', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Plan phase failed: ${errorMessage}`,
    };
  }
}

/**
 * Extract issue classification from agent output
 *
 * Parses the agent output to find the issue classification.
 * Looks for patterns like "feature", "bug", "chore", etc.
 *
 * @param output - Agent output text
 * @returns Issue classification or null if not found
 */
function extractIssueClass(output: string): string | null {
  const lowerOutput = output.toLowerCase();

  // Look for explicit classification patterns
  const patterns = [
    /class(?:ification)?:\s*(feature|bug|chore|enhancement|refactor)/i,
    /issue\s+(?:is\s+)?(?:a\s+)?(feature|bug|chore|enhancement|refactor)/i,
    /type:\s*(feature|bug|chore|enhancement|refactor)/i,
  ];

  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  // Fallback: check for keyword presence
  if (lowerOutput.includes('feature')) return 'feature';
  if (lowerOutput.includes('bug') || lowerOutput.includes('fix')) return 'bug';
  if (lowerOutput.includes('chore')) return 'chore';
  if (lowerOutput.includes('enhancement')) return 'enhancement';
  if (lowerOutput.includes('refactor')) return 'refactor';

  return null;
}

/**
 * Extract plan file path from agent output
 *
 * Parses the agent output to find the path to the generated plan file.
 * Looks for patterns like "specs/plan-*.md" or similar.
 *
 * @param output - Agent output text
 * @param worktreePath - Base worktree path for validation
 * @returns Plan file path (relative to worktree) or null if not found
 */
function extractPlanFilePath(output: string, worktreePath: string): string | null {
  // Look for file path patterns
  const patterns = [
    /(?:plan|spec)(?:\s+file)?:\s*([^\s\n]+\.md)/i,
    /(?:saved|written|created)\s+(?:to|at|in):\s*([^\s\n]+\.md)/i,
    /(specs\/[^\s\n]+\.md)/i,
  ];

  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match && match[1]) {
      const planPath = match[1];

      // Verify the file exists in the worktree
      const absolutePath = path.join(worktreePath, planPath);
      if (fs.existsSync(absolutePath)) {
        return planPath;
      }
    }
  }

  // Fallback: search for any .md file in specs/ directory
  const specsDir = path.join(worktreePath, 'specs');
  if (fs.existsSync(specsDir)) {
    const files = fs.readdirSync(specsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    if (mdFiles.length > 0) {
      // Return the most recently modified file
      const sortedFiles = mdFiles
        .map((f) => ({
          name: f,
          path: `specs/${f}`,
          mtime: fs.statSync(path.join(specsDir, f)).mtime,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      return sortedFiles[0].path;
    }
  }

  return null;
}

/**
 * Generate pull request body
 *
 * Creates a formatted PR description with links to issue, plan file,
 * and workflow information.
 *
 * @param issueNumber - GitHub issue number
 * @param adwId - Workflow identifier
 * @param planFile - Path to plan file (optional)
 * @returns Formatted PR body text
 */
function generatePRBody(
  issueNumber: number,
  adwId: string,
  planFile?: string | null
): string {
  let body = `Closes #${issueNumber}\n\n`;
  body += `## ADW Workflow\n\n`;
  body += `**Workflow ID:** \`${adwId}\`\n`;
  body += `**Phase:** Plan\n\n`;

  if (planFile) {
    body += `## Implementation Plan\n\n`;
    body += `See [\`${planFile}\`](${planFile}) for detailed implementation plan.\n\n`;
  }

  body += `---\n\n`;
  body += `This pull request was automatically generated by the ADW system.\n`;
  body += `Generated with [Claude Code](https://claude.com/claude-code)\n`;

  return body;
}
