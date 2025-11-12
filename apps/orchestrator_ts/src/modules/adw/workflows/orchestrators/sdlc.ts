/**
 * SDLC (Software Development Lifecycle) Orchestrator
 *
 * Executes complete 6-phase workflow: Plan → Build → Test → Review → Document → Ship
 *
 * Use Case: Complete software development lifecycle
 * Error Handling: Stop on failure, do NOT auto-ship
 * Important: Ship phase only creates PR and approves, does NOT merge
 *
 * @module modules/adw/workflows/orchestrators/sdlc
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
 * Execute SDLC (Software Development Lifecycle) workflow
 *
 * Phase sequence:
 * 1. Plan - Generate implementation plan
 * 2. Build - Implement the solution
 * 3. Test - Run tests and auto-resolve failures if enabled
 * 4. Review - Review implementation and auto-resolve blockers if enabled
 * 5. Document - Generate technical documentation
 * 6. Ship - Create/approve PR but DO NOT merge (manual merge required)
 *
 * @param context - Complete workflow context
 * @returns Final workflow execution result
 */
export async function executeSdlcWorkflow(
  context: WorkflowContext
): Promise<WorkflowPhaseResult> {
  const { adwId, autoResolve } = context;

  logger.info(
    { adwId, workflowType: 'sdlc', autoResolve, autoShip: false },
    'Starting SDLC workflow execution'
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

    // Phase 6: Ship (NO AUTO-MERGE for SDLC workflow)
    logger.info({ adwId }, 'Phase 6/6: Ship (manual merge required)');
    await updateWorkflowState(adwId, {
      phase: 'shipping',
    });

    const shipResult = await executeShipPhase({
      adwId,
      autoApprove: false, // SDLC workflow requires manual approval
      cleanupWorktree: false, // Keep worktree until manual merge
      mergeMethod: 'squash',
    });

    if (!shipResult.success) {
      logger.error(
        { adwId, error: shipResult.error },
        'Ship phase failed'
      );
      await updateWorkflowState(adwId, {
        status: 'failed',
        phase: 'shipped',
      });
      return shipResult;
    }

    logger.info({ adwId }, 'Ship phase completed - PR ready for manual review and merge');

    // Mark workflow as completed
    // Note: Workflow is "completed" from the automation perspective,
    // but PR still needs manual merge
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'shipped',
      completedAt: new Date(),
    });

    logger.info(
      { adwId, workflowType: 'sdlc' },
      'SDLC workflow completed successfully - awaiting manual PR merge'
    );

    return {
      success: true,
      message: 'SDLC workflow completed successfully - PR ready for manual merge',
      data: {
        planResult: planResult.data,
        buildResult: buildResult.data,
        testResult: testResult.data,
        reviewResult: reviewResult.data,
        documentResult: documentResult.data,
        shipResult: shipResult.data,
        requiresManualMerge: true,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      { adwId, error: errorMessage, workflowType: 'sdlc' },
      'SDLC workflow orchestration error'
    );

    await updateWorkflowState(adwId, {
      status: 'failed',
    });

    return {
      success: false,
      error: errorMessage,
      message: `SDLC workflow failed: ${errorMessage}`,
    };
  }
}
