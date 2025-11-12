/**
 * Plan-Build-Test-Review Orchestrator
 *
 * Executes a 4-phase workflow: Plan → Build → Test → Review
 *
 * Use Case: Full validation workflow without documentation
 * Error Handling: Stop on failure, optional auto-resolution
 *
 * @module modules/adw/workflows/orchestrators/plan-build-test-review
 */

import { logger } from '../../../../config/logger.js';
import { executePlanPhase } from '../plan-phase.js';
import { executeBuildPhase } from '../build-phase.js';
import { executeTestPhase } from '../test-phase.js';
import { executeReviewPhase } from '../review-phase.js';
import { updateWorkflowState } from '../../state-manager.js';
import type { WorkflowContext, WorkflowPhaseResult } from '../../types.js';

/**
 * Execute Plan-Build-Test-Review workflow
 *
 * Phase sequence:
 * 1. Plan - Generate implementation plan
 * 2. Build - Implement the solution
 * 3. Test - Run tests and auto-resolve failures if enabled
 * 4. Review - Review implementation and auto-resolve blockers if enabled
 *
 * @param context - Complete workflow context
 * @returns Final workflow execution result
 */
export async function executePlanBuildTestReviewWorkflow(
  context: WorkflowContext
): Promise<WorkflowPhaseResult> {
  const { adwId, autoResolve } = context;

  logger.info(
    { adwId, workflowType: 'plan-build-test-review', autoResolve },
    'Starting plan-build-test-review workflow execution'
  );

  try {
    // Phase 1: Plan
    logger.info({ adwId }, 'Phase 1/4: Plan');
    await updateWorkflowState(adwId, {
      phase: 'planning',
      status: 'active',
    });

    const planResult = await executePlanPhase({
      adwId,
      issueNumber: context.issueNumber,
      modelSet: context.modelSet,
    });

    if (!planResult.success) {
      logger.error(
        { adwId, error: planResult.error },
        'Plan phase failed, stopping workflow'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'planned',
      });
      return planResult;
    }

    logger.info({ adwId }, 'Plan phase completed successfully');

    // Phase 2: Build
    logger.info({ adwId }, 'Phase 2/4: Build');
    await updateWorkflowState(adwId, {
      phase: 'building',
    });

    const buildResult = await executeBuildPhase({
      adwId,
    });

    if (!buildResult.success) {
      logger.error(
        { adwId, error: buildResult.error },
        'Build phase failed, stopping workflow'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'built',
      });
      return buildResult;
    }

    logger.info({ adwId }, 'Build phase completed successfully');

    // Phase 3: Test
    logger.info({ adwId }, 'Phase 3/4: Test');
    await updateWorkflowState(adwId, {
      phase: 'testing',
    });

    const testResult = await executeTestPhase({
      adwId,
      runE2E: false,
      autoResolve: autoResolve,
      maxResolveAttempts: 2,
    });

    if (!testResult.success) {
      logger.error(
        { adwId, error: testResult.error },
        'Test phase failed, stopping workflow'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'tested',
      });
      return testResult;
    }

    logger.info({ adwId }, 'Test phase completed successfully');

    // Phase 4: Review
    logger.info({ adwId }, 'Phase 4/4: Review');
    await updateWorkflowState(adwId, {
      phase: 'reviewing',
    });

    const reviewResult = await executeReviewPhase({
      adwId,
      autoResolve: autoResolve,
      maxResolveAttempts: 2,
    });

    if (!reviewResult.success) {
      logger.error(
        { adwId, error: reviewResult.error },
        'Review phase failed, stopping workflow'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'reviewed',
      });
      return reviewResult;
    }

    logger.info({ adwId }, 'Review phase completed successfully');

    // Mark workflow as completed
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'reviewed',
      completedAt: new Date(),
    });

    logger.info(
      { adwId, workflowType: 'plan-build-test-review' },
      'Plan-build-test-review workflow completed successfully'
    );

    return {
      success: true,
      message: 'Plan-build-test-review workflow completed successfully',
      data: {
        planResult: planResult.data,
        buildResult: buildResult.data,
        testResult: testResult.data,
        reviewResult: reviewResult.data,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, workflowType: 'plan-build-test-review' },
      'Plan-build-test-review workflow orchestration error'
    );

    await updateWorkflowState(adwId, {
      status: 'failed',
    });

    return {
      success: false,
      error: errorMessage,
      message: `Plan-build-test-review workflow failed: ${errorMessage}`,
    };
  }
}
