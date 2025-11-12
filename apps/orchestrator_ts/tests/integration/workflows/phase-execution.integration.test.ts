/**
 * Workflow Phase Execution Integration Tests
 *
 * Tests execution of individual workflow phases:
 * - Plan phase
 * - Build phase
 * - Test phase
 * - Review phase
 * - Document phase
 * - Ship phase
 *
 * @group integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testDb } from '../setup.js';
import { createTestWorkflowContext } from '../utils/test-helpers.js';
import * as WorkflowManager from '@/modules/adw/workflow-manager.js';
import * as StateManager from '@/modules/adw/state-manager.js';
import { executePlanPhase } from '@/modules/adw/workflows/plan-phase.js';
import { executeBuildPhase } from '@/modules/adw/workflows/build-phase.js';
import { executeTestPhase } from '@/modules/adw/workflows/test-phase.js';
import { executeReviewPhase } from '@/modules/adw/workflows/review-phase.js';
import { executeDocumentPhase } from '@/modules/adw/workflows/document-phase.js';
import { executeShipPhase } from '@/modules/adw/workflows/ship-phase.js';
import type { WorkflowContext } from '@/modules/adw/types.js';

describe('Workflow Phase Execution', () => {
  let testContext: WorkflowContext;

  beforeEach(async () => {
    // Create a fresh test context for each test
    testContext = createTestWorkflowContext({
      adwId: `test-${Date.now()}`,
      issueNumber: 1000,
    });

    // Create workflow in database
    await StateManager.createWorkflowState({
      adwId: testContext.adwId,
      issueNumber: testContext.issueNumber,
      workflowType: testContext.workflowType,
      phase: 'initialized',
      status: 'active',
      issueTitle: testContext.issueTitle || 'Test Issue',
      issueBody: testContext.issueBody || 'Test Body',
      modelSet: testContext.modelSet,
    });
  });

  // ============================================================================
  // Plan Phase Tests
  // ============================================================================
  describe('Plan Phase', () => {
    it('should execute plan phase successfully', async () => {
      // Mock successful agent execution
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'specs/test-plan.md',
          retryCode: 'NONE',
        }),
      }));

      const result = await executePlanPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Plan phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('planned');
      expect(workflow?.planFile).toBeDefined();
    });

    it('should handle plan phase failure gracefully', async () => {
      // Mock agent failure
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: false,
          output: 'Classification failed',
          retryCode: 'EXECUTION_ERROR',
        }),
      }));

      const result = await executePlanPhase(testContext);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Verify state shows failure
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.status).toBe('failed');
    });

    it('should create branch during plan phase', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'specs/test-plan.md',
          retryCode: 'NONE',
        }),
      }));

      const result = await executePlanPhase(testContext);

      expect(result.success).toBe(true);

      // Verify branch name was generated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.branchName).toBeDefined();
    });
  });

  // ============================================================================
  // Build Phase Tests
  // ============================================================================
  describe('Build Phase', () => {
    beforeEach(async () => {
      // Set plan file in context for build phase
      await StateManager.updateWorkflowState(testContext.adwId, {
        phase: 'planned',
        planFile: 'specs/test-plan.md',
        branchName: 'feature/test-branch',
      });
    });

    it('should execute build phase successfully', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'Implementation completed',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeBuildPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Build phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('built');
    });

    it('should require plan file for build phase', async () => {
      // Remove plan file
      await StateManager.updateWorkflowState(testContext.adwId, {
        planFile: null,
      });

      const result = await executeBuildPhase(testContext);

      expect(result.success).toBe(false);
      expect(result.error).toContain('plan file');
    });
  });

  // ============================================================================
  // Test Phase Tests
  // ============================================================================
  describe('Test Phase', () => {
    beforeEach(async () => {
      // Set built phase
      await StateManager.updateWorkflowState(testContext.adwId, {
        phase: 'built',
      });
    });

    it('should execute tests and pass', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'All tests passed',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeTestPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Test phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('tested');
    });

    it('should auto-resolve test failures when enabled', async () => {
      testContext.autoResolve = true;

      // Mock initial test failure, then success on retry
      let callCount = 0;
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({
              success: false,
              output: 'Tests failed',
              retryCode: 'EXECUTION_ERROR',
            });
          }
          return Promise.resolve({
            success: true,
            output: 'Tests passed after fix',
            retryCode: 'NONE',
          });
        }),
      }));

      const result = await executeTestPhase(testContext);

      // Should eventually succeed with auto-resolve
      expect(result.success).toBe(true);
    });

    it('should skip tests if requested', async () => {
      testContext.workflowType = 'plan-build' as any; // No test phase

      const result = await executeTestPhase(testContext);

      // Should skip gracefully
      expect(result.success).toBe(true);
      expect(result.message).toContain('skipped');
    });
  });

  // ============================================================================
  // Review Phase Tests
  // ============================================================================
  describe('Review Phase', () => {
    beforeEach(async () => {
      await StateManager.updateWorkflowState(testContext.adwId, {
        phase: 'tested',
      });
    });

    it('should execute review and capture screenshots', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'Review completed with screenshots',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeReviewPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Review phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('reviewed');
    });
  });

  // ============================================================================
  // Document Phase Tests
  // ============================================================================
  describe('Document Phase', () => {
    beforeEach(async () => {
      await StateManager.updateWorkflowState(testContext.adwId, {
        phase: 'reviewed',
      });
    });

    it('should generate documentation', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'Documentation generated',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeDocumentPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Document phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('documented');
    });
  });

  // ============================================================================
  // Ship Phase Tests
  // ============================================================================
  describe('Ship Phase', () => {
    beforeEach(async () => {
      await StateManager.updateWorkflowState(testContext.adwId, {
        phase: 'documented',
        branchName: 'feature/test-branch',
      });
    });

    it('should merge PR to main', async () => {
      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'PR merged successfully',
          retryCode: 'NONE',
        }),
      }));

      testContext.autoShip = true;

      const result = await executeShipPhase(testContext);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Ship phase completed');

      // Verify state updated
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.phase).toBe('shipped');
      expect(workflow?.status).toBe('completed');
    });

    it('should clean up worktree after merge', async () => {
      testContext.autoShip = true;
      testContext.worktreePath = '/tmp/test-worktree';

      await StateManager.updateWorkflowState(testContext.adwId, {
        worktreePath: testContext.worktreePath,
        worktreeExists: true,
      });

      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'PR merged successfully',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeShipPhase(testContext);

      expect(result.success).toBe(true);

      // Verify worktree marked as removed
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.worktreeExists).toBe(false);
    });

    it('should create PR but not auto-merge when autoShip is false', async () => {
      testContext.autoShip = false;

      vi.mock('@/modules/adw/agent-executor.js', () => ({
        executeAgent: vi.fn().mockResolvedValue({
          success: true,
          output: 'https://github.com/owner/repo/pull/123',
          retryCode: 'NONE',
        }),
      }));

      const result = await executeShipPhase(testContext);

      expect(result.success).toBe(true);

      // Verify PR created but not merged
      const workflow = await StateManager.getWorkflowState(testContext.adwId);
      expect(workflow?.prNumber).toBeDefined();
      expect(workflow?.status).toBe('completed'); // Workflow complete, PR awaiting review
    });
  });
});
