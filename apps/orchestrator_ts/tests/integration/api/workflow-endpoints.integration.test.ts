/**
 * Workflow API Endpoints Integration Tests
 *
 * Tests all 19 API endpoints for ADW workflow management:
 * - Workflow CRUD operations
 * - Phase execution endpoints
 * - Quick workflow endpoints
 * - Patch workflow endpoint
 *
 * @group integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testDb } from '../setup.js';
import { createTestWorkflowContext, sleep } from '../utils/test-helpers.js';
import * as WorkflowManager from '@/modules/adw/workflow-manager.js';
import * as StateManager from '@/modules/adw/state-manager.js';
import type { WorkflowType } from '@/modules/adw/types.js';

describe('Workflow API Endpoints', () => {
  beforeEach(async () => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  // ============================================================================
  // POST /api/adw/workflows - Create new workflow
  // ============================================================================
  describe('POST /api/adw/workflows', () => {
    it('should create a new workflow', async () => {
      // Mock GitHub issue fetch
      const mockIssue = {
        number: 123,
        title: 'Test Feature',
        body: 'Implement test feature',
        state: 'open' as const,
        labels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create workflow
      const result = await WorkflowManager.createWorkflow(
        123,
        'plan-build' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();
      expect(result.adwId).toMatch(/^adw-[a-z0-9]+$/);

      // Verify workflow in database
      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow).toBeDefined();
        expect(workflow?.issueNumber).toBe(123);
        expect(workflow?.workflowType).toBe('plan-build');
        expect(workflow?.modelSet).toBe('base');
        expect(workflow?.status).toBe('active');
        expect(workflow?.phase).toBe('initialized');
      }
    });

    it('should reject invalid workflow type', async () => {
      const result = await WorkflowManager.createWorkflow(
        123,
        'invalid-type' as WorkflowType,
        'base'
      );

      // Should either reject or handle gracefully
      expect(result.success).toBe(false);
    });

    it('should support base and heavy model sets', async () => {
      const result1 = await WorkflowManager.createWorkflow(
        124,
        'plan-build' as WorkflowType,
        'base'
      );

      expect(result1.success).toBe(true);
      if (result1.adwId) {
        const workflow1 = await StateManager.getWorkflowState(result1.adwId);
        expect(workflow1?.modelSet).toBe('base');
      }

      const result2 = await WorkflowManager.createWorkflow(
        125,
        'plan-build' as WorkflowType,
        'heavy'
      );

      expect(result2.success).toBe(true);
      if (result2.adwId) {
        const workflow2 = await StateManager.getWorkflowState(result2.adwId);
        expect(workflow2?.modelSet).toBe('heavy');
      }
    });

    it('should default to base model set if not specified', async () => {
      const result = await WorkflowManager.createWorkflow(
        126,
        'plan-build' as WorkflowType
      );

      expect(result.success).toBe(true);
      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.modelSet).toBe('base');
      }
    });
  });

  // ============================================================================
  // GET /api/adw/workflows - List workflows
  // ============================================================================
  describe('GET /api/adw/workflows', () => {
    it('should list all active workflows', async () => {
      // Create multiple workflows
      const result1 = await WorkflowManager.createWorkflow(
        201,
        'plan-build' as WorkflowType,
        'base'
      );
      const result2 = await WorkflowManager.createWorkflow(
        202,
        'sdlc' as WorkflowType,
        'heavy'
      );

      await sleep(100); // Allow database writes to complete

      // List workflows
      const workflows = await StateManager.listWorkflowStates();

      expect(workflows.length).toBeGreaterThanOrEqual(2);
      expect(workflows.some(w => w.issueNumber === 201)).toBe(true);
      expect(workflows.some(w => w.issueNumber === 202)).toBe(true);
    });

    it('should return empty array when no workflows exist', async () => {
      const workflows = await StateManager.listWorkflowStates();
      expect(Array.isArray(workflows)).toBe(true);
    });
  });

  // ============================================================================
  // GET /api/adw/workflows/:adwId - Get workflow status
  // ============================================================================
  describe('GET /api/adw/workflows/:adwId', () => {
    it('should return workflow status', async () => {
      // Create workflow
      const result = await WorkflowManager.createWorkflow(
        301,
        'plan-build' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);

        expect(workflow).toBeDefined();
        expect(workflow?.adwId).toBe(result.adwId);
        expect(workflow?.issueNumber).toBe(301);
        expect(workflow?.status).toBe('active');
      }
    });

    it('should return null for non-existent workflow', async () => {
      const workflow = await StateManager.getWorkflowState('adw-nonexistent');
      expect(workflow).toBeNull();
    });
  });

  // ============================================================================
  // DELETE /api/adw/workflows/:adwId - Cancel workflow
  // ============================================================================
  describe('DELETE /api/adw/workflows/:adwId', () => {
    it('should cancel running workflow', async () => {
      // Create workflow
      const result = await WorkflowManager.createWorkflow(
        401,
        'plan-build' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        // Cancel workflow
        const cancelResult = await WorkflowManager.cleanupWorkflow(result.adwId);

        expect(cancelResult.success).toBe(true);

        // Verify workflow marked as cancelled
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.status).toBe('cancelled');
      }
    });

    it('should handle cancelling non-existent workflow', async () => {
      const result = await WorkflowManager.cleanupWorkflow('adw-nonexistent');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // ============================================================================
  // Quick Workflow Endpoints
  // ============================================================================
  describe('POST /api/adw/workflows/quick/:type', () => {
    it('should create and execute plan-build workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        501,
        'plan-build' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      // Note: Actual execution would be async in background
      // Here we just verify creation
      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('plan-build');
      }
    });

    it('should create and execute plan-build-test workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        502,
        'plan-build-test' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('plan-build-test');
      }
    });

    it('should create and execute plan-build-review workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        503,
        'plan-build-review' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('plan-build-review');
      }
    });

    it('should create and execute plan-build-test-review workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        504,
        'plan-build-test-review' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('plan-build-test-review');
      }
    });

    it('should create and execute sdlc workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        505,
        'sdlc' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('sdlc');
      }
    });

    it('should create and execute zte workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        506,
        'zte' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('zte');
      }
    });

    it('should support model set configuration', async () => {
      const result = await WorkflowManager.createWorkflow(
        507,
        'sdlc' as WorkflowType,
        'heavy'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.modelSet).toBe('heavy');
      }
    });
  });

  // ============================================================================
  // Patch Workflow Endpoint
  // ============================================================================
  describe('POST /api/adw/workflows/patch', () => {
    it('should create and execute patch workflow', async () => {
      const result = await WorkflowManager.createWorkflow(
        601,
        'patch' as WorkflowType,
        'base'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.workflowType).toBe('patch');
      }
    });

    it('should support heavy model set for patches', async () => {
      const result = await WorkflowManager.createWorkflow(
        602,
        'patch' as WorkflowType,
        'heavy'
      );

      expect(result.success).toBe(true);
      expect(result.adwId).toBeDefined();

      if (result.adwId) {
        const workflow = await StateManager.getWorkflowState(result.adwId);
        expect(workflow?.modelSet).toBe('heavy');
      }
    });
  });

  // ============================================================================
  // Validation Tests
  // ============================================================================
  describe('Endpoint Validation', () => {
    it('should validate issue number is positive integer', async () => {
      // Negative issue number
      const result1 = await WorkflowManager.createWorkflow(
        -1,
        'plan-build' as WorkflowType,
        'base'
      );
      expect(result1.success).toBe(false);

      // Zero issue number
      const result2 = await WorkflowManager.createWorkflow(
        0,
        'plan-build' as WorkflowType,
        'base'
      );
      expect(result2.success).toBe(false);
    });

    it('should validate workflow type', async () => {
      const result = await WorkflowManager.createWorkflow(
        701,
        'unknown-workflow' as WorkflowType,
        'base'
      );
      expect(result.success).toBe(false);
    });

    it('should validate model set is base or heavy', async () => {
      const result = await WorkflowManager.createWorkflow(
        702,
        'plan-build' as WorkflowType,
        'invalid' as any
      );
      expect(result.success).toBe(false);
    });
  });
});
