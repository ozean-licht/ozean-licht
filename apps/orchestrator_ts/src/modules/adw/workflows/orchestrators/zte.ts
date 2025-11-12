/**
 * ZTE (Zero Touch Execution) Orchestrator
 *
 * Executes complete 6-phase workflow with auto-merge:
 * Plan → Build → Test → Review → Document → Ship (with auto-merge)
 *
 * Use Case: Fully autonomous development with automatic merge
 * Error Handling: Stop on failure, auto-ship enabled
 * Important: Ship phase includes automatic PR merge to main
 *
 * WARNING: This workflow is fully autonomous and will merge to main
 * without human intervention. Use with caution!
 *
 * @module modules/adw/workflows/orchestrators/zte
 */

import { logger } from '../../../../config/logger.js';
import { executePlanPhase } from '../plan-phase.js';
import { executeBuildPhase } from '../build-phase.js';
import { executeTestPhase } from '../test-phase.js';
import { executeReviewPhase } from '../review-phase.js';
import { executeDocumentPhase } from '../document-phase.js';
import { executeShipPhase } from '../ship-phase.js';
import { updateWorkflowState } from '../../state-manager.js';
import type { WorkflowContext, WorkflowPhaseResult } from '../../types.js';

/**
 * Execute ZTE (Zero Touch Execution) workflow
 *
 * Phase sequence:
 * 1. Plan - Generate implementation plan
 * 2. Build - Implement the solution
 * 3. Test - Run tests and auto-resolve failures if enabled
 * 4. Review - Review implementation and auto-resolve blockers if enabled
 * 5. Document - Generate technical documentation
 * 6. Ship - Auto-approve and AUTOMATICALLY MERGE PR to main
 *
 * @param context - Complete workflow context
 * @returns Final workflow execution result
 */
export async function executeZteWorkflow(
  context: WorkflowContext
): Promise<WorkflowPhaseResult> {
  const { adwId, autoResolve, autoShip } = context;

  // Safety check: ZTE workflow should always have autoShip enabled
  if (!autoShip) {
    logger.warn(
      { adwId, workflowType: 'zte' },
      'ZTE workflow invoked without autoShip flag - this is a configuration error'
    );
  }

  logger.warn(
    { adwId, workflowType: 'zte', autoResolve, autoShip },
    'Starting ZTE workflow - FULLY AUTONOMOUS with auto-merge enabled'
  );

  try {
    // Phase 1: Plan
    logger.info({ adwId }, 'Phase 1/6: Plan');
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
    logger.info({ adwId }, 'Phase 2/6: Build');
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
    logger.info({ adwId }, 'Phase 3/6: Test');
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
    logger.info({ adwId }, 'Phase 4/6: Review');
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

    // Phase 5: Document
    logger.info({ adwId }, 'Phase 5/6: Document');
    await updateWorkflowState(adwId, {
      phase: 'documenting',
    });

    const documentResult = await executeDocumentPhase({
      adwId,
      includeScreenshots: true,
    });

    if (!documentResult.success) {
      logger.error(
        { adwId, error: documentResult.error },
        'Document phase failed, stopping workflow'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'documented',
      });
      return documentResult;
    }

    logger.info({ adwId }, 'Document phase completed successfully');

    // Phase 6: Ship (WITH AUTO-MERGE for ZTE workflow)
    logger.warn(
      { adwId },
      'Phase 6/6: Ship - AUTO-MERGE ENABLED - PR will be merged automatically'
    );
    await updateWorkflowState(adwId, {
      phase: 'shipping',
    });

    const shipResult = await executeShipPhase({
      adwId,
      autoApprove: autoShip, // Auto-approve for ZTE workflow
      cleanupWorktree: true, // Clean up after merge
      mergeMethod: 'squash',
    });

    if (!shipResult.success) {
      logger.error(
        { adwId, error: shipResult.error },
        'Ship phase failed - PR was not merged'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'shipped',
      });
      return shipResult;
    }

    logger.info({ adwId }, 'Ship phase completed - PR automatically merged to main');

    // Mark workflow as completed
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'shipped',
      completedAt: new Date(),
    });

    logger.info(
      { adwId, workflowType: 'zte' },
      'ZTE workflow completed successfully - PR merged to main automatically'
    );

    return {
      success: true,
      message: 'ZTE workflow completed successfully - PR merged to main',
      data: {
        planResult: planResult.data,
        buildResult: buildResult.data,
        testResult: testResult.data,
        reviewResult: reviewResult.data,
        documentResult: documentResult.data,
        shipResult: shipResult.data,
        autoMerged: true,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, workflowType: 'zte' },
      'ZTE workflow orchestration error'
    );

    await updateWorkflowState(adwId, {
      status: 'failed',
    });

    return {
      success: false,
      error: errorMessage,
      message: `ZTE workflow failed: ${errorMessage}`,
    };
  }
}
