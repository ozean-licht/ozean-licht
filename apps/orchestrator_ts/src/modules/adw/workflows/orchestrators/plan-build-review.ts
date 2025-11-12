/**
 * Plan-Build-Review Orchestrator
 *
 * Executes a 3-phase workflow: Plan → Build → Review
 *
 * Use Case: Plan, build, and review implementation
 * Error Handling: Stop on failure, optionally auto-resolve review blockers
 *
 * @module modules/adw/workflows/orchestrators/plan-build-review
 */

import { logger } from '../../../../config/logger.js';
import { executePlanPhase } from '../plan-phase.js';
import { executeBuildPhase } from '../build-phase.js';
import { executeReviewPhase } from '../review-phase.js';
import { updateWorkflowState } from '../../state-manager.js';
import type { WorkflowContext, WorkflowPhaseResult } from '../../types.js';

/**
 * Execute Plan-Build-Review workflow
 *
 * Phase sequence:
 * 1. Plan - Generate implementation plan
 * 2. Build - Implement the solution
 * 3. Review - Review implementation and auto-resolve blockers if enabled
 *
 * @param context - Complete workflow context
 * @returns Final workflow execution result
 */
export async function executePlanBuildReviewWorkflow(
  context: WorkflowContext
): Promise<WorkflowPhaseResult> {
  const { adwId, autoResolve } = context;

  logger.info(
    { adwId, workflowType: 'plan-build-review', autoResolve },
    'Starting plan-build-review workflow execution'
  );

  try {
    // Phase 1: Plan
    logger.info({ adwId }, 'Phase 1/3: Plan');
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
    logger.info({ adwId }, 'Phase 2/3: Build');
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

    // Phase 3: Review
    logger.info({ adwId }, 'Phase 3/3: Review');
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
      { adwId, workflowType: 'plan-build-review' },
      'Plan-build-review workflow completed successfully'
    );

    return {
      success: true,
      message: 'Plan-build-review workflow completed successfully',
      data: {
        planResult: planResult.data,
        buildResult: buildResult.data,
        reviewResult: reviewResult.data,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, workflowType: 'plan-build-review' },
      'Plan-build-review workflow orchestration error'
    );

    await updateWorkflowState(adwId, {
      status: 'failed',
    });

    return {
      success: false,
      error: errorMessage,
      message: `Plan-build-review workflow failed: ${errorMessage}`,
    };
  }
}
