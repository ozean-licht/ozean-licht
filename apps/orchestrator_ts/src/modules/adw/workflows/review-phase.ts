/**
 * Review Phase Workflow
 *
 * Executes the review phase of the ADW workflow.
 * This phase is responsible for:
 * - Review execution via /review slash command
 * - Screenshot capture using Playwright (port-aware)
 * - R2 upload integration for screenshots
 * - Blocker auto-resolution (optional)
 * - Review report generation
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/review-phase
 */

import { logger } from '../../../config/logger.js';
import { executeAgent } from '../agent-executor.js';
import {
  getWorkflowState,
  updateWorkflowState,
} from '../state-manager.js';
import { validateWorktree } from '../worktree-manager.js';
import { stageAll, commit, pushBranch, isClean } from '../git-operations.js';
import { makeIssueComment } from '../github-integration.js';
import { retryWithBackoff } from '../utils.js';
import type { WorkflowPhaseResult, SlashCommand } from '../types.js';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Context required for review phase execution
 */
export interface ReviewPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
  /** Whether to enable auto-resolution of blockers (optional, default: true) */
  autoResolve?: boolean;
  /** Maximum number of auto-resolution attempts (optional, default: 2) */
  maxResolveAttempts?: number;
}

/**
 * Execute the review phase workflow
 *
 * This phase performs the following operations:
 * 1. Load workflow state from database
 * 2. Validate worktree exists and is in valid state
 * 3. Execute review via /review slash command
 * 4. Capture screenshots using Playwright (port-aware)
 * 5. Upload screenshots to R2 storage
 * 6. If blockers found and auto-resolve enabled, attempt resolution
 * 7. Generate review report
 * 8. Commit review artifacts to branch
 * 9. Push changes to remote
 * 10. Post comment to issue with review summary
 * 11. Update workflow state with review completion
 *
 * @param context - Review phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executeReviewPhase({
 *   adwId: 'abc12345',
 *   autoResolve: true,
 *   maxResolveAttempts: 2
 * });
 *
 * if (result.success) {
 *   console.log('Review phase completed successfully');
 * } else {
 *   console.error('Review phase failed:', result.error);
 * }
 * ```
 */
export async function executeReviewPhase(
  context: ReviewPhaseContext
): Promise<WorkflowPhaseResult> {
  const {
    adwId,
    autoResolve = true,
    maxResolveAttempts = 2,
  } = context;

  logger.info(
    { adwId, autoResolve, maxResolveAttempts, phase: 'review' },
    'Starting review phase execution'
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

    if (!workflow.backendPort || !workflow.frontendPort) {
      logger.warn(
        { adwId },
        'Port configuration missing, review may not be able to test running application'
      );
    }

    if (workflow.phase !== 'tested') {
      logger.warn(
        { adwId, currentPhase: workflow.phase, expectedPhase: 'tested' },
        'Review phase executed out of order'
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

    // 4. Execute review via /review slash command
    logger.info(
      { adwId, backendPort: workflow.backendPort, frontendPort: workflow.frontendPort },
      'Executing review'
    );
    let reviewResult = await executeAgent({
      adwId,
      agentName: 'reviewer',
      slashCommand: '/review' as SlashCommand,
      args: [],
      workingDir: workflow.worktreePath,
      dangerouslySkipPermissions: true,
    });

    // 5. Parse review output for blockers
    const hasBlockers = detectBlockersInOutput(reviewResult.output);
    logger.info({ adwId, hasBlockers }, 'Review completed, analyzing results');

    // 6. Handle blockers with auto-resolution
    let resolveAttempts = 0;
    if (hasBlockers && autoResolve) {
      while (resolveAttempts < maxResolveAttempts) {
        resolveAttempts++;
        logger.warn(
          { adwId, attempt: resolveAttempts, maxAttempts: maxResolveAttempts },
          'Blockers found, attempting auto-resolution'
        );

        // Note: The /review command should handle resolution internally
        // For now, we'll just retry the review
        await retryWithBackoff(async () => {
          reviewResult = await executeAgent({
            adwId,
            agentName: 'reviewer',
            slashCommand: '/review' as SlashCommand,
            args: [],
            workingDir: workflow.worktreePath || undefined,
            dangerouslySkipPermissions: true,
          });
        }, 1, 2000);

        const stillHasBlockers = detectBlockersInOutput(reviewResult.output);
        if (!stillHasBlockers) {
          logger.info(
            { adwId, attempt: resolveAttempts },
            'Blockers resolved after retry'
          );
          break;
        }

        if (resolveAttempts >= maxResolveAttempts) {
          logger.warn(
            { adwId, attempts: resolveAttempts },
            'Max resolution attempts reached, blockers remain'
          );
        }
      }
    }

    // 7. Look for generated screenshots
    const screenshotsDir = path.join(workflow.worktreePath, 'screenshots');
    let screenshots: string[] = [];
    if (fs.existsSync(screenshotsDir)) {
      screenshots = await glob('**/*.png', { cwd: screenshotsDir });
      logger.info(
        { adwId, screenshotCount: screenshots.length },
        'Screenshots found'
      );
    }

    // 8. Upload screenshots to R2 (if available)
    // Note: This would require R2 integration via MCP tools
    // For now, we'll just log the screenshot paths
    if (screenshots.length > 0) {
      logger.info(
        { adwId, screenshots },
        'Screenshots captured (R2 upload integration pending)'
      );
      // TODO: Integrate with R2 upload via MCP tools
      // screenshotUrls = await uploadScreenshotsToR2(screenshots, screenshotsDir);
    }

    // 9. Look for review report
    const reviewReportPath = path.join(workflow.worktreePath, 'app_review');
    let reviewReports: string[] = [];
    if (fs.existsSync(reviewReportPath)) {
      reviewReports = await glob('review_*.md', { cwd: reviewReportPath });
      logger.info(
        { adwId, reportCount: reviewReports.length },
        'Review reports found'
      );
    }

    // 10. Check if review artifacts were created (git status)
    const workingDirClean = await isClean(workflow.worktreePath);
    if (!workingDirClean) {
      logger.info({ adwId }, 'Review artifacts detected, committing changes');

      // Stage changes
      await stageAll(workflow.worktreePath);

      // Create commit
      const commitMessage = `docs: add review report and screenshots (#${workflow.issueNumber})

Review completed with ${screenshots.length} screenshots.

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      await commit(commitMessage, workflow.worktreePath);

      // Push to remote
      logger.info({ adwId, branchName: workflow.branchName }, 'Pushing review artifacts to remote');
      await retryWithBackoff(
        async () =>
          pushBranch(workflow.branchName!, 'origin', workflow.worktreePath || undefined),
        3,
        2000
      );
    }

    // 11. Determine review success
    const reviewPassed = reviewResult.success && !hasBlockers;

    // 12. Post comment to issue
    if (workflow.issueNumber) {
      const commentLines = ['Review phase completed!', ''];
      commentLines.push(`Status: ${reviewPassed ? '✅ Passed' : '⚠️ Has Issues'}`);
      if (screenshots.length > 0) {
        commentLines.push(`Screenshots: ${screenshots.length} captured`);
      }
      if (reviewReports.length > 0) {
        commentLines.push(`Review reports: ${reviewReports.length} generated`);
      }
      if (hasBlockers) {
        commentLines.push('\n⚠️ Blockers detected during review.');
        if (resolveAttempts > 0) {
          commentLines.push(`Auto-resolution attempts: ${resolveAttempts}`);
        }
      }

      await makeIssueComment(workflow.issueNumber, commentLines.join('\n'));
    }

    // 13. Update workflow state
    await updateWorkflowState(adwId, {
      phase: 'reviewed',
      status: reviewPassed ? 'active' : 'failed',
    });

    // 14. Return result
    if (reviewPassed) {
      logger.info(
        { adwId, phase: 'reviewed' },
        'Review phase completed successfully'
      );

      return {
        success: true,
        message: 'Review phase completed successfully',
        data: {
          screenshotCount: screenshots.length,
          reportCount: reviewReports.length,
          hasBlockers: false,
          resolveAttempts,
        },
      };
    } else {
      logger.warn(
        { adwId, hasBlockers },
        'Review phase completed with blockers'
      );

      return {
        success: false,
        error: 'Review found blockers',
        message: 'Review phase completed but blockers were found',
        data: {
          screenshotCount: screenshots.length,
          reportCount: reviewReports.length,
          hasBlockers: true,
          resolveAttempts,
        },
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'review' },
      'Review phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'reviewed', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Review phase failed: ${errorMessage}`,
    };
  }
}

/**
 * Detect blockers in review output
 *
 * Analyzes the review agent output to detect if any blockers were found.
 * Looks for keywords like "blocker", "critical", "must fix", etc.
 *
 * @param output - Review agent output text
 * @returns True if blockers detected, false otherwise
 */
function detectBlockersInOutput(output: string): boolean {
  const lowerOutput = output.toLowerCase();

  // Check for explicit blocker indicators
  const blockerPatterns = [
    /blocker/i,
    /critical\s+issue/i,
    /must\s+fix/i,
    /\[blocker\]/i,
    /blocking\s+issue/i,
    /❌.*critical/i,
  ];

  for (const pattern of blockerPatterns) {
    if (pattern.test(output)) {
      return true;
    }
  }

  // Check for severity markers
  if (lowerOutput.includes('severity: critical') ||
      lowerOutput.includes('severity: blocker')) {
    return true;
  }

  return false;
}
