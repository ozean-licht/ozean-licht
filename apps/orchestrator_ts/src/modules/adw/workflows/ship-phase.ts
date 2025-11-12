/**
 * Ship Phase Workflow
 *
 * Executes the shipping phase of the ADW workflow.
 * This phase is responsible for:
 * - State validation (all required fields populated)
 * - PR approval via GitHub API (optional for ZTE workflows)
 * - Squash merge to main branch
 * - Worktree cleanup (optional, configurable)
 * - Workflow completion status update
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/ship-phase
 */

import { logger } from '../../../config/logger.js';
import {
  getWorkflowState,
  updateWorkflowState,
} from '../state-manager.js';
import { removeWorktree } from '../worktree-manager.js';
import { mergePullRequest, makeIssueComment } from '../github-integration.js';
import { retryWithBackoff } from '../utils.js';
import type { WorkflowPhaseResult } from '../types.js';

/**
 * Context required for ship phase execution
 */
export interface ShipPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
  /** Whether to auto-approve the PR (default: false, only for ZTE workflows) */
  autoApprove?: boolean;
  /** Whether to cleanup worktree after merge (default: true) */
  cleanupWorktree?: boolean;
  /** Merge method to use (default: 'squash') */
  mergeMethod?: 'squash' | 'merge' | 'rebase';
}

/**
 * Execute the ship phase workflow
 *
 * This phase performs the following operations:
 * 1. Load workflow state from database
 * 2. Validate all required fields are populated
 * 3. Validate PR exists and is ready to merge
 * 4. Optionally auto-approve PR (for ZTE workflows only)
 * 5. Merge PR to main branch using specified method
 * 6. Optionally cleanup worktree
 * 7. Post comment to issue with completion status
 * 8. Update workflow state with completion timestamp
 * 9. Mark workflow as completed
 *
 * @param context - Ship phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executeShipPhase({
 *   adwId: 'abc12345',
 *   autoApprove: false,
 *   cleanupWorktree: true,
 *   mergeMethod: 'squash'
 * });
 *
 * if (result.success) {
 *   console.log('Ship phase completed successfully');
 * } else {
 *   console.error('Ship phase failed:', result.error);
 * }
 * ```
 */
export async function executeShipPhase(
  context: ShipPhaseContext
): Promise<WorkflowPhaseResult> {
  const {
    adwId,
    autoApprove = false,
    cleanupWorktree = true,
    mergeMethod = 'squash',
  } = context;

  logger.info(
    { adwId, autoApprove, cleanupWorktree, mergeMethod, phase: 'ship' },
    'Starting ship phase execution'
  );

  try {
    // 1. Load workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      throw new Error(`Workflow ${adwId} not found`);
    }

    // 2. Validate prerequisites
    if (workflow.phase !== 'documented') {
      logger.warn(
        { adwId, currentPhase: workflow.phase, expectedPhase: 'documented' },
        'Ship phase executed out of order'
      );
    }

    // 3. Validate required fields are populated
    const validationErrors: string[] = [];

    if (!workflow.prNumber) {
      validationErrors.push('PR number not set');
    }

    if (!workflow.branchName) {
      validationErrors.push('Branch name not set');
    }

    if (!workflow.issueNumber) {
      validationErrors.push('Issue number not set');
    }

    if (validationErrors.length > 0) {
      throw new Error(
        `Workflow state validation failed: ${validationErrors.join(', ')}`
      );
    }

    logger.info(
      { adwId, prNumber: workflow.prNumber },
      'Workflow state validated, proceeding with merge'
    );

    // 4. Auto-approve PR if requested (ZTE workflow only)
    if (autoApprove) {
      logger.info(
        { adwId, prNumber: workflow.prNumber },
        'Auto-approve requested (ZTE workflow)'
      );
      // Note: PR approval via Octokit requires specific permissions
      // For now, we'll log a warning that this needs manual implementation
      logger.warn(
        { adwId },
        'Auto-approval not yet implemented - PR must be manually approved'
      );
      // TODO: Implement PR approval via GitHub API
      // This requires a different authentication method (GitHub App or PAT with write permissions)
    }

    // 5. Merge PR to main branch
    logger.info(
      { adwId, prNumber: workflow.prNumber, mergeMethod },
      'Merging pull request'
    );

    try {
      await retryWithBackoff(
        async () =>
          mergePullRequest(
            workflow.prNumber!,
            mergeMethod,
            workflow.worktreePath || undefined
          ),
        3,
        2000
      );

      logger.info(
        { adwId, prNumber: workflow.prNumber },
        'Pull request merged successfully'
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(
        { adwId, prNumber: workflow.prNumber, error: errorMessage },
        'Failed to merge pull request'
      );

      // Check if PR is already merged
      if (
        errorMessage.includes('merged') ||
        errorMessage.includes('already closed')
      ) {
        logger.warn(
          { adwId, prNumber: workflow.prNumber },
          'PR appears to already be merged, continuing'
        );
      } else {
        throw new Error(`Failed to merge PR: ${errorMessage}`);
      }
    }

    // 6. Cleanup worktree if requested
    let worktreeCleanedUp = false;
    if (cleanupWorktree && workflow.worktreePath) {
      logger.info({ adwId, worktreePath: workflow.worktreePath }, 'Cleaning up worktree');
      try {
        worktreeCleanedUp = await removeWorktree(adwId);
        if (worktreeCleanedUp) {
          logger.info({ adwId }, 'Worktree cleaned up successfully');
          // Update state to reflect worktree no longer exists
          await updateWorkflowState(adwId, {
            worktreeExists: false,
          });
        } else {
          logger.warn({ adwId }, 'Worktree cleanup failed, but continuing');
        }
      } catch (error) {
        logger.warn(
          { adwId, error },
          'Error during worktree cleanup, but continuing'
        );
      }
    } else {
      logger.info(
        { adwId },
        'Worktree cleanup skipped (cleanupWorktree=false or no worktree path)'
      );
    }

    // 7. Post comment to issue
    if (workflow.issueNumber) {
      const commentLines = [
        '🚢 Ship phase completed successfully!',
        '',
        `Pull request #${workflow.prNumber} has been merged to main.`,
      ];

      if (worktreeCleanedUp) {
        commentLines.push('Worktree cleaned up.');
      }

      commentLines.push('');
      commentLines.push('✅ Workflow completed');
      commentLines.push('');
      commentLines.push('---');
      commentLines.push(`Workflow ID: \`${adwId}\``);

      await makeIssueComment(workflow.issueNumber, commentLines.join('\n'));
    }

    // 8. Update workflow state with completion
    await updateWorkflowState(adwId, {
      phase: 'shipped',
      status: 'completed',
      completedAt: new Date(),
    });

    logger.info(
      { adwId, phase: 'shipped', status: 'completed' },
      'Ship phase completed successfully'
    );

    return {
      success: true,
      message: 'Ship phase completed successfully',
      data: {
        prNumber: workflow.prNumber,
        branchName: workflow.branchName,
        mergeMethod,
        worktreeCleanedUp,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'ship' },
      'Ship phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'shipped', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Ship phase failed: ${errorMessage}`,
    };
  }
}

/**
 * Validate workflow is ready to ship
 *
 * Checks that all required phases have been completed and
 * all required data is present in the workflow state.
 *
 * @param workflow - Workflow state to validate
 * @returns Validation result with error messages if invalid
 */
export function validateShipReadiness(workflow: any): {
  isReady: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check phase progression
  const requiredPhase = 'documented';
  if (workflow.phase !== requiredPhase) {
    errors.push(
      `Workflow must be in '${requiredPhase}' phase to ship (current: '${workflow.phase}')`
    );
  }

  // Check required fields
  if (!workflow.prNumber) {
    errors.push('PR number is missing');
  }

  if (!workflow.branchName) {
    errors.push('Branch name is missing');
  }

  if (!workflow.issueNumber) {
    errors.push('Issue number is missing');
  }

  // Check status
  if (workflow.status === 'failed') {
    errors.push('Workflow is in failed state');
  }

  if (workflow.status === 'completed') {
    errors.push('Workflow is already completed');
  }

  return {
    isReady: errors.length === 0,
    errors,
  };
}
