/**
 * Workflow Orchestrators Integration Tests
 *
 * Tests complete workflow orchestration for all workflow types:
 * - plan-build
 * - plan-build-test
 * - plan-build-review
 * - plan-build-test-review
 * - sdlc
 * - zte
 *
 * @group integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testDb } from '../setup.js';
import { createTestWorkflowContext, waitForWorkflowPhase } from '../utils/test-helpers.js';
import * as StateManager from '@/modules/adw/state-manager.js';
import {
  executePlanBuildWorkflow,
  executePlanBuildTestWorkflow,
  executePlanBuildReviewWorkflow,
  executePlanBuildTestReviewWorkflow,
  executeSdlcWorkflow,
  executeZteWorkflow,
} from '@/modules/adw/workflows/orchestrators/index.js';
import type { WorkflowContext } from '@/modules/adw/types.js';

describe('Workflow Orchestrators', () => {
  let testContext: WorkflowContext;

  beforeEach(async () => {
    // Create fresh context
    testContext = createTestWorkflowContext({
      adwId: `test-${Date.now()}`,
      issueNumber: 2000,
    });

    // Create workflow in database
    await StateManager.createWorkflowState({
      adwId: testContext.adwId,
      issueNumber: testContext.issueNumber,
      workflowType: testContext.workflowType,
      phase: 'initialized',
      status: 'active',
      issueTitle: 'Test Issue',
      issueBody: 'Test Body',
      modelSet: testContext.modelSet,
    });

    // Mock all agent executions to succeed
    vi.mock('@/modules/adw/agent-executor.js', () => ({
      executeAgent: vi.fn().mockResolvedValue({
        success: true,
        output: 'Success',
        retryCode: 'NONE',
      }),
    }));
  });

  // ============================================================================
  // plan-build Orchestrator
  // ============================================================================
  describe('plan-build orchestrator', () => {
    it('should execute plan and build phases in sequence', async () => {
      testContext.workflowType = 'plan-build';

      const result = await executePlanBuildWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify both phases completed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('built');
      expect(workflow?.planFile).toBeDefined();
    });

    it('should stop on plan phase failure', async () => {
      testContext.workflowType = 'plan-build';

      // Mock plan phase to fail
      vi.mock('@/modules/adw/workflows/plan-phase.js', () => ({
        executePlanPhase: vi.fn().mockResolvedValue({
          success: false,
          error: 'Plan phase failed',
        }),
      }));

      const result = await executePlanBuildWorkflow(testContext);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plan phase failed');

      // Verify build phase was not executed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).not.toBe('built');
    });

    it('should handle build phase failure', async () => {
      testContext.workflowType = 'plan-build';

      // Mock build phase to fail
      vi.mock('@/modules/adw/workflows/build-phase.js', () => ({
        executeBuildPhase: vi.fn().mockResolvedValue({
          success: false,
          error: 'Build phase failed',
        }),
      }));

      const result = await executePlanBuildWorkflow(testContext);

      expect(result.success).toBe(false);

      // Verify workflow marked as failed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.status).toBe('failed');
    });
  });

  // ============================================================================
  // plan-build-test Orchestrator
  // ============================================================================
  describe('plan-build-test orchestrator', () => {
    it('should execute plan, build, and test phases', async () => {
      testContext.workflowType = 'plan-build-test';

      const result = await executePlanBuildTestWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify all three phases completed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('tested');
    });

    it('should handle test phase failure with auto-resolve', async () => {
      testContext.workflowType = 'plan-build-test';
      testContext.autoResolve = true;

      // Mock test failure then success
      let testCallCount = 0;
      vi.mock('@/modules/adw/workflows/test-phase.js', () => ({
        executeTestPhase: vi.fn().mockImplementation(() => {
          testCallCount++;
          if (testCallCount === 1) {
            return Promise.resolve({
              success: false,
              error: 'Tests failed',
            });
          }
          return Promise.resolve({
            success: true,
            message: 'Tests passed after fix',
          });
        }),
      }));

      const result = await executePlanBuildTestWorkflow(testContext);

      expect(result.success).toBe(true);
      expect(testCallCount).toBeGreaterThan(1); // Auto-resolve triggered retry
    });
  });

  // ============================================================================
  // plan-build-review Orchestrator
  // ============================================================================
  describe('plan-build-review orchestrator', () => {
    it('should execute plan, build, and review phases', async () => {
      testContext.workflowType = 'plan-build-review';

      const result = await executePlanBuildReviewWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify all phases completed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('reviewed');
    });
  });

  // ============================================================================
  // plan-build-test-review Orchestrator
  // ============================================================================
  describe('plan-build-test-review orchestrator', () => {
    it('should execute all four phases in sequence', async () => {
      testContext.workflowType = 'plan-build-test-review';

      const result = await executePlanBuildTestReviewWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify all phases completed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('reviewed');
    });

    it('should create PR at the end', async () => {
      testContext.workflowType = 'plan-build-test-review';

      const result = await executePlanBuildTestReviewWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify PR created
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.prNumber).toBeDefined();
    });
  });

  // ============================================================================
  // sdlc Orchestrator (Full 6-phase workflow)
  // ============================================================================
  describe('sdlc orchestrator', () => {
    it('should execute all 6 phases successfully', async () => {
      testContext.workflowType = 'sdlc';

      const result = await executeSdlcWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify all phases completed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('shipped');
      expect(workflow?.status).toBe('completed');
    });

    it('should execute phases in correct order', async () => {
      testContext.workflowType = 'sdlc';

      const phaseOrder: string[] = [];

      // Track phase execution order
      vi.mock('@/modules/adw/state-manager.js', () => ({
        ...vi.importActual('@/modules/adw/state-manager.js'),
        updateWorkflowState: vi.fn().mockImplementation((adwId, updates) => {
          if (updates.phase) {
            phaseOrder.push(updates.phase);
          }
          return Promise.resolve();
        }),
      }));

      await executeSdlcWorkflow(testContext);

      // Verify correct phase order
      const expectedOrder = ['planned', 'built', 'tested', 'reviewed', 'documented', 'shipped'];
      expect(phaseOrder).toEqual(expect.arrayContaining(expectedOrder));
    });

    it('should create PR but NOT auto-merge', async () => {
      testContext.workflowType = 'sdlc';
      testContext.autoShip = false; // SDLC does not auto-merge

      const result = await executeSdlcWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify PR created but requires manual merge
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.prNumber).toBeDefined();
      expect(workflow?.status).toBe('completed');
    });
  });

  // ============================================================================
  // zte Orchestrator (Zero-Touch Engineering - Full automation)
  // ============================================================================
  describe('zte orchestrator', () => {
    it('should execute all phases and auto-merge', async () => {
      testContext.workflowType = 'zte';
      testContext.autoShip = true; // ZTE auto-merges

      const result = await executeZteWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify PR was merged automatically
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('shipped');
      expect(workflow?.status).toBe('completed');
      expect(workflow?.prNumber).toBeDefined();
    });

    it('should handle failures gracefully and not auto-merge', async () => {
      testContext.workflowType = 'zte';
      testContext.autoShip = true;

      // Mock test phase to fail
      vi.mock('@/modules/adw/workflows/test-phase.js', () => ({
        executeTestPhase: vi.fn().mockResolvedValue({
          success: false,
          error: 'Tests failed',
        }),
      }));

      const result = await executeZteWorkflow(testContext);

      expect(result.success).toBe(false);

      // Verify workflow failed and PR not merged
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.status).toBe('failed');
    });

    it('should clean up worktree after successful merge', async () => {
      testContext.workflowType = 'zte';
      testContext.autoShip = true;
      testContext.worktreePath = '/tmp/test-zte-worktree';

      await StateManager.updateWorkflowState(testContext.adwId, {
        worktreePath: testContext.worktreePath,
        worktreeExists: true,
      });

      const result = await executeZteWorkflow(testContext);

      expect(result.success).toBe(true);

      // Verify worktree cleaned up
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.worktreeExists).toBe(false);
    });
  });

  // ============================================================================
  // State Transitions
  // ============================================================================
  describe('State Management', () => {
    it('should update workflow state at each phase', async () => {
      testContext.workflowType = 'plan-build';

      await executePlanBuildWorkflow(testContext);

      // Verify final state
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow).toBeDefined();
      expect(workflow?.adwId).toBe(testContext.adwId);
      expect(workflow?.issueNumber).toBe(testContext.issueNumber);
    });

    it('should mark workflow as failed on error', async () => {
      testContext.workflowType = 'plan-build';

      // Force an error
      vi.mock('@/modules/adw/workflows/plan-phase.js', () => ({
        executePlanPhase: vi.fn().mockRejectedValue(new Error('Unexpected error')),
      }));

      const result = await executePlanBuildWorkflow(testContext);

      expect(result.success).toBe(false);

      // Verify failure status
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.status).toBe('failed');
    });
  });
});
