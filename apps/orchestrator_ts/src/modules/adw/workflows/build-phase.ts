/**
 * Build Phase Workflow
 *
 * Executes the build/implementation phase of the ADW workflow.
 * This phase is responsible for:
 * - Worktree validation (ensure it exists)
 * - Plan file loading from workflow state
 * - Implementation via /implement slash command
 * - Git commit creation
 * - PR update with build completion
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/build-phase
 */

import { logger } from '../../../config/logger.js';
import { executeAgent } from '../agent-executor.js';
import {
  getWorkflowState,
  updateWorkflowState,
} from '../state-manager.js';
import { validateWorktree } from '../worktree-manager.js';
import { isClean, stageAll, commit, pushBranch } from '../git-operations.js';
import { makeIssueComment } from '../github-integration.js';
import { retryWithBackoff } from '../utils.js';
import type { WorkflowPhaseResult, SlashCommand } from '../types.js';
import fs from 'fs';
import path from 'path';

/**
 * Context required for build phase execution
 */
export interface BuildPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
}

/**
 * Execute the build phase workflow
 *
 * This phase performs the following operations:
 * 1. Load workflow state from database
 * 2. Validate worktree exists and is in valid state
 * 3. Load plan file from worktree
 * 4. Execute implementation via /implement slash command
 * 5. Verify changes were made (git status)
 * 6. Stage and commit changes
 * 7. Push branch to remote
 * 8. Post comment to issue with completion status
 * 9. Update workflow state with build completion
 *
 * @param context - Build phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executeBuildPhase({
 *   adwId: 'abc12345'
 * });
 *
 * if (result.success) {
 *   console.log('Build phase completed successfully');
 * } else {
 *   console.error('Build phase failed:', result.error);
 * }
 * ```
 */
export async function executeBuildPhase(
  context: BuildPhaseContext
): Promise<WorkflowPhaseResult> {
  const { adwId } = context;

  logger.info(
    { adwId, phase: 'build' },
    'Starting build phase execution'
  );

  try {
    // 1. Load workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      throw new Error(`Workflow ${adwId} not found`);
    }

    // 2. Validate prerequisites
    if (!workflow.worktreePath) {
      throw new Error('Worktree path not set in workflow state');
    }

    if (!workflow.branchName) {
      throw new Error('Branch name not set in workflow state');
    }

    if (workflow.phase !== 'planned') {
      logger.warn(
        { adwId, currentPhase: workflow.phase, expectedPhase: 'planned' },
        'Build phase executed out of order'
      );
    }

    // 3. Validate worktree exists
    logger.info({ adwId, worktreePath: workflow.worktreePath }, 'Validating worktree');
    const validation = await validateWorktree(adwId, workflow.worktreePath);

    if (!validation.isValid) {
      throw new Error(
        `Worktree validation failed: ${validation.error || 'Unknown error'}`
      );
    }

    logger.info({ adwId }, 'Worktree validated successfully');

    // 4. Load plan file
    let planContent: string | null = null;
    if (workflow.planFile) {
      const planPath = path.join(workflow.worktreePath, workflow.planFile);
      if (fs.existsSync(planPath)) {
        planContent = fs.readFileSync(planPath, 'utf8');
        logger.info({ adwId, planFile: workflow.planFile }, 'Plan file loaded');
      } else {
        logger.warn(
          { adwId, planFile: workflow.planFile },
          'Plan file not found, proceeding without it'
        );
      }
    } else {
      logger.warn({ adwId }, 'No plan file specified in workflow state');
    }

    // 5. Execute implementation via /implement slash command
    logger.info({ adwId }, 'Executing implementation');
    const implementResult = await executeAgent({
      adwId,
      agentName: 'builder',
      slashCommand: '/implement' as SlashCommand,
      args: planContent ? [] : [workflow.issueNumber.toString()],
      workingDir: workflow.worktreePath,
      dangerouslySkipPermissions: true,
    });

    if (!implementResult.success) {
      throw new Error(
        `Implementation failed: ${implementResult.error?.message || implementResult.output}`
      );
    }

    logger.info({ adwId }, 'Implementation completed successfully');

    // 6. Verify changes were made
    const workingDirClean = await isClean(workflow.worktreePath);
    if (workingDirClean) {
      logger.warn(
        { adwId },
        'No changes detected after implementation - worktree is clean'
      );
      // This is not necessarily an error - the implementation might have
      // concluded no changes were needed
    } else {
      logger.info({ adwId }, 'Changes detected in worktree');

      // 7. Stage changes
      logger.info({ adwId }, 'Staging changes');
      await stageAll(workflow.worktreePath);

      // 8. Create commit
      const commitMessage = generateCommitMessage(
        workflow.issueClass || 'feat',
        workflow.issueNumber,
        'Implement solution'
      );
      logger.info({ adwId, commitMessage }, 'Creating commit');
      await commit(commitMessage, workflow.worktreePath);

      // 9. Push to remote
      logger.info({ adwId, branchName: workflow.branchName }, 'Pushing to remote');
      await retryWithBackoff(
        async () =>
          pushBranch(workflow.branchName!, 'origin', workflow.worktreePath || undefined),
        3,
        2000
      );

      logger.info({ adwId }, 'Changes pushed to remote');
    }

    // 10. Post comment to issue
    if (workflow.issueNumber) {
      await makeIssueComment(
        workflow.issueNumber,
        `Build phase completed successfully!\n\nImplementation has been committed and pushed to branch \`${workflow.branchName}\`.`
      );
    }

    // 11. Update workflow state
    await updateWorkflowState(adwId, {
      phase: 'built',
      status: 'active',
    });

    logger.info(
      { adwId, phase: 'built' },
      'Build phase completed successfully'
    );

    return {
      success: true,
      message: 'Build phase completed successfully',
      data: {
        branchName: workflow.branchName,
        worktreePath: workflow.worktreePath,
        hasChanges: !workingDirClean,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'build' },
      'Build phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'built', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Build phase failed: ${errorMessage}`,
    };
  }
}

/**
 * Generate commit message
 *
 * Creates a conventional commit message based on issue classification.
 *
 * @param issueClass - Issue classification (feature, bug, chore, etc.)
 * @param issueNumber - GitHub issue number
 * @param description - Commit description
 * @returns Formatted commit message
 */
function generateCommitMessage(
  issueClass: string,
  issueNumber: number,
  description: string
): string {
  // Map issue class to conventional commit type
  const typeMap: Record<string, string> = {
    feature: 'feat',
    enhancement: 'feat',
    bug: 'fix',
    chore: 'chore',
    refactor: 'refactor',
    docs: 'docs',
    test: 'test',
  };

  const type = typeMap[issueClass.toLowerCase()] || 'feat';

  return `${type}: ${description} (#${issueNumber})

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
}
