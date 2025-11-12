/**
 * Document Phase Workflow
 *
 * Executes the documentation phase of the ADW workflow.
 * This phase is responsible for:
 * - Git diff analysis to understand changes
 * - Documentation generation via /document slash command
 * - Technical guide generation in app_docs/ directory
 * - Screenshot embedding in documentation
 * - Commit documentation to worktree
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/document-phase
 */

import { logger } from '../../../config/logger.js';
import { executeAgent } from '../agent-executor.js';
import {
  getWorkflowState,
  updateWorkflowState,
} from '../state-manager.js';
import { validateWorktree } from '../worktree-manager.js';
import { stageAll, commit, pushBranch, isClean, getGit } from '../git-operations.js';
import { makeIssueComment } from '../github-integration.js';
import { retryWithBackoff } from '../utils.js';
import type { WorkflowPhaseResult, SlashCommand } from '../types.js';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Context required for document phase execution
 */
export interface DocumentPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
  /** Whether to include screenshots in documentation (optional, default: true) */
  includeScreenshots?: boolean;
}

/**
 * Execute the document phase workflow
 *
 * This phase performs the following operations:
 * 1. Load workflow state from database
 * 2. Validate worktree exists and is in valid state
 * 3. Generate git diff to analyze changes
 * 4. Execute documentation via /document slash command
 * 5. Verify documentation files were created in app_docs/
 * 6. Embed screenshots if available
 * 7. Commit documentation to branch
 * 8. Push changes to remote
 * 9. Post comment to issue with documentation summary
 * 10. Update workflow state with documentation completion
 *
 * @param context - Document phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executeDocumentPhase({
 *   adwId: 'abc12345',
 *   includeScreenshots: true
 * });
 *
 * if (result.success) {
 *   console.log('Document phase completed successfully');
 * } else {
 *   console.error('Document phase failed:', result.error);
 * }
 * ```
 */
export async function executeDocumentPhase(
  context: DocumentPhaseContext
): Promise<WorkflowPhaseResult> {
  const {
    adwId,
    includeScreenshots = true,
  } = context;

  logger.info(
    { adwId, includeScreenshots, phase: 'document' },
    'Starting document phase execution'
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

    if (workflow.phase !== 'reviewed') {
      logger.warn(
        { adwId, currentPhase: workflow.phase, expectedPhase: 'reviewed' },
        'Document phase executed out of order'
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

    // 4. Generate git diff to understand changes
    logger.info({ adwId }, 'Generating git diff');
    const git = getGit(workflow.worktreePath);
    let diffOutput = '';
    try {
      // Get diff against main branch
      diffOutput = await git.diff(['main...HEAD']);
      logger.info(
        { adwId, diffSize: diffOutput.length },
        'Git diff generated'
      );
    } catch (error) {
      logger.warn(
        { adwId, error },
        'Could not generate diff against main, will try against origin/main'
      );
      try {
        diffOutput = await git.diff(['origin/main...HEAD']);
      } catch (retryError) {
        logger.warn(
          { adwId, error: retryError },
          'Could not generate diff, proceeding without it'
        );
      }
    }

    // 5. Find screenshots if includeScreenshots is enabled
    const screenshotsDir = path.join(workflow.worktreePath, 'screenshots');
    let screenshots: string[] = [];
    if (includeScreenshots && fs.existsSync(screenshotsDir)) {
      screenshots = await glob('**/*.png', { cwd: screenshotsDir });
      logger.info(
        { adwId, screenshotCount: screenshots.length },
        'Screenshots found for documentation'
      );
    }

    // 6. Execute documentation via /document slash command
    logger.info({ adwId }, 'Generating documentation');
    const documentResult = await executeAgent({
      adwId,
      agentName: 'documenter',
      slashCommand: '/document' as SlashCommand,
      args: [],
      workingDir: workflow.worktreePath,
      dangerouslySkipPermissions: true,
    });

    if (!documentResult.success) {
      throw new Error(
        `Documentation generation failed: ${documentResult.error?.message || documentResult.output}`
      );
    }

    logger.info({ adwId }, 'Documentation generated successfully');

    // 7. Verify documentation files were created
    const appDocsDir = path.join(workflow.worktreePath, 'app_docs');
    let documentFiles: string[] = [];
    if (fs.existsSync(appDocsDir)) {
      documentFiles = await glob('**/*.md', { cwd: appDocsDir });
      logger.info(
        { adwId, documentCount: documentFiles.length },
        'Documentation files created'
      );
    } else {
      logger.warn(
        { adwId, appDocsDir },
        'app_docs directory not found, documentation may not have been created'
      );
    }

    // 8. Check if documentation was created (git status)
    const workingDirClean = await isClean(workflow.worktreePath);
    if (workingDirClean) {
      logger.warn(
        { adwId },
        'No changes detected after documentation phase - working directory is clean'
      );
    } else {
      logger.info({ adwId }, 'Documentation changes detected, committing');

      // Stage changes
      await stageAll(workflow.worktreePath);

      // Create commit
      const commitMessage = generateDocumentCommitMessage(
        workflow.issueNumber,
        documentFiles.length,
        screenshots.length
      );

      await commit(commitMessage, workflow.worktreePath);

      // Push to remote
      logger.info({ adwId, branchName: workflow.branchName }, 'Pushing documentation to remote');
      await retryWithBackoff(
        async () =>
          pushBranch(workflow.branchName!, 'origin', workflow.worktreePath || undefined),
        3,
        2000
      );

      logger.info({ adwId }, 'Documentation pushed successfully');
    }

    // 9. Post comment to issue
    if (workflow.issueNumber) {
      const commentLines = ['Documentation phase completed!', ''];
      if (documentFiles.length > 0) {
        commentLines.push(`📚 Generated ${documentFiles.length} documentation file(s):`);
        documentFiles.slice(0, 5).forEach((file) => {
          commentLines.push(`- \`app_docs/${file}\``);
        });
        if (documentFiles.length > 5) {
          commentLines.push(`... and ${documentFiles.length - 5} more`);
        }
      } else {
        commentLines.push('⚠️ No documentation files were created');
      }
      if (screenshots.length > 0 && includeScreenshots) {
        commentLines.push(`\n📸 Included ${screenshots.length} screenshot(s)`);
      }

      await makeIssueComment(workflow.issueNumber, commentLines.join('\n'));
    }

    // 10. Update workflow state
    await updateWorkflowState(adwId, {
      phase: 'documented',
      status: 'active',
    });

    logger.info(
      { adwId, phase: 'documented' },
      'Document phase completed successfully'
    );

    return {
      success: true,
      message: 'Document phase completed successfully',
      data: {
        documentCount: documentFiles.length,
        screenshotCount: screenshots.length,
        hasChanges: !workingDirClean,
        documentFiles,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'document' },
      'Document phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'documented', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Document phase failed: ${errorMessage}`,
    };
  }
}

/**
 * Generate commit message for documentation
 *
 * Creates a conventional commit message for documentation changes.
 *
 * @param issueNumber - GitHub issue number
 * @param documentCount - Number of documentation files created
 * @param screenshotCount - Number of screenshots included
 * @returns Formatted commit message
 */
function generateDocumentCommitMessage(
  issueNumber: number,
  documentCount: number,
  screenshotCount: number
): string {
  const parts: string[] = [];

  if (documentCount > 0) {
    parts.push(`${documentCount} document${documentCount === 1 ? '' : 's'}`);
  }
  if (screenshotCount > 0) {
    parts.push(`${screenshotCount} screenshot${screenshotCount === 1 ? '' : 's'}`);
  }

  const summary = parts.length > 0 ? parts.join(' and ') : 'technical documentation';

  return `docs: add ${summary} (#${issueNumber})

Comprehensive technical documentation generated for implemented changes.

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
}
