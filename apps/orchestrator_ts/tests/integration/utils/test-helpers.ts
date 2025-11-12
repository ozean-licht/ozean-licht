/**
 * Test Helper Functions
 *
 * Reusable utilities for integration tests including context creation,
 * signature generation, and workflow state helpers.
 */

import { createHmac } from 'crypto';
import type { WorkflowContext, ModelSet, WorkflowType } from '@/modules/adw/types.js';
import { getWorkflowState } from '@/modules/adw/state-manager.js';

/**
 * Create a test workflow context with sensible defaults
 *
 * @param overrides - Partial context to override defaults
 * @returns Complete workflow context for testing
 */
export function createTestWorkflowContext(
  overrides?: Partial<WorkflowContext>
): WorkflowContext {
  return {
    adwId: `test-${Date.now()}`,
    issueNumber: 999,
    workflowType: 'plan-build' as WorkflowType,
    worktreePath: null,
    branchName: null,
    backendPort: null,
    frontendPort: null,
    modelSet: 'base' as ModelSet,
    autoResolve: true,
    autoShip: false,
    prNumber: null,
    planFile: null,
    issueClass: null,
    issueTitle: 'Test Issue',
    issueBody: 'Test issue body for integration testing',
    phase: null,
    status: null,
    ...overrides,
  };
}

/**
 * Generate GitHub webhook signature for testing
 *
 * @param payload - Webhook payload object
 * @param secret - Webhook secret (defaults to test secret)
 * @returns Signature header value (sha256=...)
 */
export function generateSignature(
  payload: any,
  secret: string = 'test-secret'
): string {
  const hmac = createHmac('sha256', secret);
  const signature = hmac.update(JSON.stringify(payload)).digest('hex');
  return `sha256=${signature}`;
}

/**
 * Wait for a workflow to complete or fail
 *
 * @param adwId - Workflow ID to monitor
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Final workflow state
 * @throws Error if workflow doesn't complete within timeout
 */
export async function waitForWorkflowCompletion(
  adwId: string,
  timeout: number = 30000
): Promise<any> {
  const startTime = Date.now();
  const checkInterval = 500; // Check every 500ms

  while (Date.now() - startTime < timeout) {
    const workflow = await getWorkflowState(adwId);

    if (!workflow) {
      throw new Error(`Workflow ${adwId} not found`);
    }

    if (workflow.status === 'completed' || workflow.status === 'failed') {
      return workflow;
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  throw new Error(`Workflow ${adwId} did not complete within ${timeout}ms`);
}

/**
 * Wait for a workflow to reach a specific phase
 *
 * @param adwId - Workflow ID to monitor
 * @param targetPhase - Phase to wait for
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Workflow state when phase is reached
 * @throws Error if phase not reached within timeout
 */
export async function waitForWorkflowPhase(
  adwId: string,
  targetPhase: string,
  timeout: number = 30000
): Promise<any> {
  const startTime = Date.now();
  const checkInterval = 500;

  while (Date.now() - startTime < timeout) {
    const workflow = await getWorkflowState(adwId);

    if (!workflow) {
      throw new Error(`Workflow ${adwId} not found`);
    }

    if (workflow.phase === targetPhase) {
      return workflow;
    }

    // Also check if workflow failed
    if (workflow.status === 'failed') {
      throw new Error(`Workflow ${adwId} failed before reaching phase ${targetPhase}`);
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  throw new Error(
    `Workflow ${adwId} did not reach phase ${targetPhase} within ${timeout}ms`
  );
}

/**
 * Create a mock GitHub issue payload
 *
 * @param overrides - Partial issue data to override defaults
 * @returns Complete GitHub issue payload
 */
export function createMockIssue(overrides?: Partial<any>): any {
  return {
    number: 999,
    title: 'Test Issue',
    body: 'Test issue body for integration testing',
    state: 'open',
    labels: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock GitHub issue comment webhook payload
 *
 * @param issueNumber - Issue number
 * @param commentBody - Comment text
 * @param action - Webhook action (default: 'created')
 * @returns Complete webhook payload
 */
export function createIssueCommentPayload(
  issueNumber: number,
  commentBody: string,
  action: string = 'created'
): any {
  return {
    action,
    issue: {
      number: issueNumber,
      title: `Test Issue #${issueNumber}`,
      body: 'Test issue body',
      labels: [],
    },
    comment: {
      body: commentBody,
      user: {
        login: 'test-user',
      },
    },
  };
}

/**
 * Create a mock GitHub issues webhook payload
 *
 * @param issueNumber - Issue number
 * @param action - Webhook action
 * @param labels - Issue labels
 * @returns Complete webhook payload
 */
export function createIssuesPayload(
  issueNumber: number,
  action: string = 'opened',
  labels: string[] = []
): any {
  return {
    action,
    issue: {
      number: issueNumber,
      title: `Test Issue #${issueNumber}`,
      body: 'workflow: sdlc\nmodel_set: base',
      labels: labels.map(name => ({ name })),
    },
  };
}

/**
 * Extract error message from various error types
 *
 * @param error - Error object of any type
 * @returns Human-readable error message
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return JSON.stringify(error);
}

/**
 * Sleep for a specified duration
 *
 * @param ms - Milliseconds to sleep
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param initialDelay - Initial delay in milliseconds
 * @returns Result of function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        await sleep(delay);
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Retry failed with unknown error');
}
