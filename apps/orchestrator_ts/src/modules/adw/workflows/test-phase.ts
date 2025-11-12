/**
 * Test Phase Workflow
 *
 * Executes the testing phase of the ADW workflow.
 * This phase is responsible for:
 * - Port configuration validation (.ports.env)
 * - Test execution via /test slash command
 * - Failure auto-resolution (optional retry with /resolve_failed_test)
 * - E2E test support (optional via /test_e2e)
 * - Results persistence to state
 * - State updates to PostgreSQL
 *
 * @module modules/adw/workflows/test-phase
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

/**
 * Context required for test phase execution
 */
export interface TestPhaseContext {
  /** Unique workflow identifier */
  adwId: string;
  /** Whether to run E2E tests (optional, default: false) */
  runE2E?: boolean;
  /** Whether to enable auto-resolution of test failures (optional, default: true) */
  autoResolve?: boolean;
  /** Maximum number of auto-resolution attempts (optional, default: 2) */
  maxResolveAttempts?: number;
}

/**
 * Execute the test phase workflow
 *
 * This phase performs the following operations:
 * 1. Load workflow state from database
 * 2. Validate worktree exists and is in valid state
 * 3. Verify port configuration (.ports.env) exists
 * 4. Execute tests via /test slash command
 * 5. If tests fail and auto-resolve enabled, attempt resolution
 * 6. Optionally run E2E tests via /test_e2e slash command
 * 7. Commit any test fixes to branch
 * 8. Push changes to remote
 * 9. Post comment to issue with test results
 * 10. Update workflow state with test completion
 *
 * @param context - Test phase execution context
 * @returns Promise resolving to phase execution result
 *
 * @example
 * ```typescript
 * const result = await executeTestPhase({
 *   adwId: 'abc12345',
 *   runE2E: false,
 *   autoResolve: true,
 *   maxResolveAttempts: 2
 * });
 *
 * if (result.success) {
 *   console.log('Test phase completed successfully');
 * } else {
 *   console.error('Test phase failed:', result.error);
 * }
 * ```
 */
export async function executeTestPhase(
  context: TestPhaseContext
): Promise<WorkflowPhaseResult> {
  const {
    adwId,
    runE2E = false,
    autoResolve = true,
    maxResolveAttempts = 2,
  } = context;

  logger.info(
    { adwId, runE2E, autoResolve, maxResolveAttempts, phase: 'test' },
    'Starting test phase execution'
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

    if (workflow.phase !== 'built') {
      logger.warn(
        { adwId, currentPhase: workflow.phase, expectedPhase: 'built' },
        'Test phase executed out of order'
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

    // 4. Verify port configuration exists
    const portsEnvPath = path.join(workflow.worktreePath, '.ports.env');
    if (!fs.existsSync(portsEnvPath)) {
      logger.warn(
        { adwId, portsEnvPath },
        'Port configuration file not found, tests may fail if they require specific ports'
      );
    } else {
      logger.info({ adwId, portsEnvPath }, 'Port configuration validated');
    }

    // 5. Execute unit tests via /test slash command
    logger.info({ adwId }, 'Executing unit tests');
    let testResult = await executeAgent({
      adwId,
      agentName: 'tester',
      slashCommand: '/test' as SlashCommand,
      args: [],
      workingDir: workflow.worktreePath,
      dangerouslySkipPermissions: true,
    });

    // 6. Handle test failures with auto-resolution
    let resolveAttempts = 0;
    while (!testResult.success && autoResolve && resolveAttempts < maxResolveAttempts) {
      resolveAttempts++;
      logger.warn(
        { adwId, attempt: resolveAttempts, maxAttempts: maxResolveAttempts },
        'Tests failed, attempting auto-resolution'
      );

      const resolveResult = await executeAgent({
        adwId,
        agentName: 'test-resolver',
        slashCommand: '/resolve_failed_test' as SlashCommand,
        args: [],
        workingDir: workflow.worktreePath,
        dangerouslySkipPermissions: true,
      });

      if (!resolveResult.success) {
        logger.error(
          { adwId, attempt: resolveAttempts },
          'Test resolution attempt failed'
        );
        break;
      }

      // Retry tests after resolution
      logger.info({ adwId, attempt: resolveAttempts }, 'Retrying tests after resolution');
      testResult = await executeAgent({
        adwId,
        agentName: 'tester',
        slashCommand: '/test' as SlashCommand,
        args: [],
        workingDir: workflow.worktreePath,
        dangerouslySkipPermissions: true,
      });

      if (testResult.success) {
        logger.info(
          { adwId, attempt: resolveAttempts },
          'Tests passed after auto-resolution'
        );
        break;
      }
    }

    // 7. Optionally run E2E tests
    let e2eTestResult: typeof testResult | null = null;
    if (runE2E) {
      logger.info({ adwId }, 'Executing E2E tests');
      e2eTestResult = await executeAgent({
        adwId,
        agentName: 'e2e-tester',
        slashCommand: '/test_e2e' as SlashCommand,
        args: [],
        workingDir: workflow.worktreePath,
        dangerouslySkipPermissions: true,
      });

      // Auto-resolve E2E test failures if enabled
      let e2eResolveAttempts = 0;
      while (!e2eTestResult.success && autoResolve && e2eResolveAttempts < maxResolveAttempts) {
        e2eResolveAttempts++;
        logger.warn(
          { adwId, attempt: e2eResolveAttempts, maxAttempts: maxResolveAttempts },
          'E2E tests failed, attempting auto-resolution'
        );

        const resolveResult = await executeAgent({
          adwId,
          agentName: 'e2e-test-resolver',
          slashCommand: '/resolve_failed_e2e_test' as SlashCommand,
          args: [],
          workingDir: workflow.worktreePath,
          dangerouslySkipPermissions: true,
        });

        if (!resolveResult.success) {
          logger.error(
            { adwId, attempt: e2eResolveAttempts },
            'E2E test resolution attempt failed'
          );
          break;
        }

        // Retry E2E tests after resolution
        logger.info({ adwId, attempt: e2eResolveAttempts }, 'Retrying E2E tests after resolution');
        e2eTestResult = await executeAgent({
          adwId,
          agentName: 'e2e-tester',
          slashCommand: '/test_e2e' as SlashCommand,
          args: [],
          workingDir: workflow.worktreePath,
          dangerouslySkipPermissions: true,
        });

        if (e2eTestResult.success) {
          logger.info(
            { adwId, attempt: e2eResolveAttempts },
            'E2E tests passed after auto-resolution'
          );
          break;
        }
      }
    }

    // 8. Check if test fixes were made (git status)
    const workingDirClean = await isClean(workflow.worktreePath);
    if (!workingDirClean) {
      logger.info({ adwId }, 'Test fixes detected, committing changes');

      // Stage changes
      await stageAll(workflow.worktreePath);

      // Create commit
      const commitMessage = `test: fix test failures (#${workflow.issueNumber})

Auto-resolved test failures during test phase.

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      await commit(commitMessage, workflow.worktreePath);

      // Push to remote
      logger.info({ adwId, branchName: workflow.branchName }, 'Pushing test fixes to remote');
      await retryWithBackoff(
        async () =>
          pushBranch(workflow.branchName!, 'origin', workflow.worktreePath || undefined),
        3,
        2000
      );
    }

    // 9. Determine overall test success
    const unitTestsPassed = testResult.success;
    const e2eTestsPassed = runE2E ? e2eTestResult?.success || false : true;
    const allTestsPassed = unitTestsPassed && e2eTestsPassed;

    // 10. Post comment to issue
    if (workflow.issueNumber) {
      const commentLines = ['Test phase completed!', ''];
      commentLines.push(`Unit Tests: ${unitTestsPassed ? '✅ Passed' : '❌ Failed'}`);
      if (runE2E) {
        commentLines.push(`E2E Tests: ${e2eTestsPassed ? '✅ Passed' : '❌ Failed'}`);
      }
      if (resolveAttempts > 0) {
        commentLines.push(`\nAuto-resolution attempts: ${resolveAttempts}`);
      }
      if (!allTestsPassed) {
        commentLines.push('\n⚠️ Some tests failed. Manual intervention may be required.');
      }

      await makeIssueComment(workflow.issueNumber, commentLines.join('\n'));
    }

    // 11. Update workflow state
    await updateWorkflowState(adwId, {
      phase: 'tested',
      status: allTestsPassed ? 'active' : 'failed',
    });

    // 12. Return result
    if (allTestsPassed) {
      logger.info(
        { adwId, phase: 'tested' },
        'Test phase completed successfully'
      );

      return {
        success: true,
        message: 'Test phase completed successfully',
        data: {
          unitTestsPassed,
          e2eTestsPassed: runE2E ? e2eTestsPassed : null,
          resolveAttempts,
          hasChanges: !workingDirClean,
        },
      };
    } else {
      logger.error(
        { adwId, unitTestsPassed, e2eTestsPassed },
        'Test phase completed with failures'
      );

      return {
        success: false,
        error: 'Some tests failed',
        message: 'Test phase completed but some tests failed',
        data: {
          unitTestsPassed,
          e2eTestsPassed: runE2E ? e2eTestsPassed : null,
          resolveAttempts,
        },
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, phase: 'test' },
      'Test phase failed'
    );

    // Update workflow state to reflect failure
    await updateWorkflowState(adwId, {
      status: 'failed',
      phase: 'tested', // Still mark as attempted
    });

    return {
      success: false,
      error: errorMessage,
      message: `Test phase failed: ${errorMessage}`,
    };
  }
}
