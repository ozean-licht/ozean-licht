/**
 * Plan-Build Orchestrator
 *
 * Executes a simple 2-phase workflow: Plan → Build
 *
 * Use Case: Create implementation plan and build the solution
 * Error Handling: Stop on phase failure
 *
 * @module modules/adw/workflows/orchestrators/plan-build
 */

import { logger } from '../../../../config/logger.js';
import { executePlanPhase } from '../plan-phase.js';
import { executeBuildPhase } from '../build-phase.js';
import { updateWorkflowState } from '../../state-manager.js';
import type { WorkflowContext, WorkflowPhaseResult } from '../../types.js';

/**
 * Execute Plan-Build workflow
 *
 * Phase sequence:
 * 1. Plan - Generate implementation plan
 * 2. Build - Implement the solution
 *
 * @param context - Complete workflow context
 * @returns Final workflow execution result
 */
export async function executePlanBuildWorkflow(
  context: WorkflowContext
): Promise<WorkflowPhaseResult> {
  const { adwId } = context;

  logger.info(
    { adwId, workflowType: 'plan-build' },
    'Starting plan-build workflow execution'
  );

  try {
    // Phase 1: Plan
    logger.info({ adwId }, 'Phase 1/2: Plan');
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
    logger.info({ adwId }, 'Phase 2/2: Build');
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

    // Mark workflow as completed
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'built',
      completedAt: new Date(),
    });

    logger.info(
      { adwId, workflowType: 'plan-build' },
      'Plan-build workflow completed successfully'
    );

    return {
      success: true,
      message: 'Plan-build workflow completed successfully',
      data: {
        planResult: planResult.data,
        buildResult: buildResult.data,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, workflowType: 'plan-build' },
      'Plan-build workflow orchestration error'
    );

    await updateWorkflowState(adwId, {
      status: 'failed',
    });

    return {
      success: false,
      error: errorMessage,
      message: `Plan-build workflow failed: ${errorMessage}`,
    };
  }
}
