/**
 * ADW Database Operations
 *
 * Type-safe database operations for ADW workflows using Prisma.
 * Provides CRUD operations for workflows, events, and agent outputs.
 *
 * @module database/queries/adw
 */

import { prisma } from '../client.js';
import { logger } from '../../config/logger.js';
import type { Prisma } from '@prisma/client';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Data required to create a new ADW workflow
 */
export interface CreateWorkflowData {
  adwId: string;
  issueNumber: number;
  workflowType: string;
  phase?: string;
  status?: string;
  branchName?: string;
  prNumber?: number;
  issueTitle?: string;
  issueBody?: string;
  issueClass?: string;
  worktreePath?: string;
  worktreeExists?: boolean;
  backendPort?: number;
  frontendPort?: number;
  modelSet?: string;
  planFile?: string;
}

/**
 * Data for updating an existing ADW workflow
 */
export interface UpdateWorkflowData {
  workflowType?: string;
  phase?: string;
  status?: string;
  branchName?: string;
  prNumber?: number;
  issueTitle?: string;
  issueBody?: string;
  issueClass?: string;
  worktreePath?: string;
  worktreeExists?: boolean;
  backendPort?: number;
  frontendPort?: number;
  modelSet?: string;
  planFile?: string;
  completedAt?: Date | null;
}

/**
 * Data required to create a workflow event
 */
export interface CreateWorkflowEventData {
  adwId: string;
  eventType: string;
  eventSubtype?: string;
  phase?: string;
  message?: string;
  data?: Prisma.InputJsonValue;
}

/**
 * Data required to create an agent output record
 */
export interface CreateAgentOutputData {
  adwId: string;
  agentName: string;
  phase: string;
  sessionId?: string;
  model?: string;
  outputText?: string;
  outputJsonl?: Prisma.InputJsonValue;
  success?: boolean;
  errorMessage?: string;
  retryCount?: number;
}

// ============================================================================
// Workflow Operations
// ============================================================================

/**
 * Create a new ADW workflow
 *
 * @param data - Workflow creation data
 * @returns The created workflow record
 * @throws Error if workflow creation fails
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflow({
 *   adwId: 'abc12345',
 *   issueNumber: 123,
 *   workflowType: 'sdlc',
 *   issueTitle: 'Implement new feature',
 *   issueClass: 'feature'
 * });
 * ```
 */
export async function createWorkflow(data: CreateWorkflowData) {
  try {
    logger.debug({ adwId: data.adwId, workflowType: data.workflowType }, 'Creating ADW workflow');

    const workflow = await prisma.adwWorkflow.create({
      data: {
        adwId: data.adwId,
        issueNumber: data.issueNumber,
        workflowType: data.workflowType,
        phase: data.phase ?? 'initialized',
        status: data.status ?? 'active',
        branchName: data.branchName,
        prNumber: data.prNumber,
        issueTitle: data.issueTitle,
        issueBody: data.issueBody,
        issueClass: data.issueClass,
        worktreePath: data.worktreePath,
        worktreeExists: data.worktreeExists ?? true,
        backendPort: data.backendPort,
        frontendPort: data.frontendPort,
        modelSet: data.modelSet ?? 'base',
        planFile: data.planFile,
      },
    });

    logger.info({ adwId: workflow.adwId, issueNumber: workflow.issueNumber }, 'ADW workflow created successfully');
    return workflow;
  } catch (error) {
    logger.error({ error, adwId: data.adwId }, 'Failed to create ADW workflow');
    throw new Error(`Failed to create workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieve a workflow by its ADW ID
 *
 * @param adwId - The unique workflow identifier
 * @returns The workflow record or null if not found
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const workflow = await getWorkflow('abc12345');
 * if (workflow) {
 *   console.log(`Workflow status: ${workflow.status}`);
 * }
 * ```
 */
export async function getWorkflow(adwId: string) {
  try {
    logger.debug({ adwId }, 'Fetching ADW workflow');

    const workflow = await prisma.adwWorkflow.findUnique({
      where: { adwId },
    });

    if (!workflow) {
      logger.debug({ adwId }, 'ADW workflow not found');
    }

    return workflow;
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to fetch ADW workflow');
    throw new Error(`Failed to get workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update an existing workflow
 *
 * @param adwId - The unique workflow identifier
 * @param data - Fields to update
 * @returns The updated workflow record
 * @throws Error if workflow not found or update fails
 *
 * @example
 * ```typescript
 * const updated = await updateWorkflow('abc12345', {
 *   phase: 'built',
 *   status: 'active',
 *   branchName: 'feat/new-feature'
 * });
 * ```
 */
export async function updateWorkflow(adwId: string, data: UpdateWorkflowData) {
  try {
    logger.debug({ adwId, updates: Object.keys(data) }, 'Updating ADW workflow');

    const workflow = await prisma.adwWorkflow.update({
      where: { adwId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    logger.info({ adwId, phase: workflow.phase, status: workflow.status }, 'ADW workflow updated successfully');
    return workflow;
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to update ADW workflow');
    throw new Error(`Failed to update workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all active workflows
 *
 * @returns Array of active workflow records
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const activeWorkflows = await listActiveWorkflows();
 * console.log(`Found ${activeWorkflows.length} active workflows`);
 * ```
 */
export async function listActiveWorkflows() {
  try {
    logger.debug('Fetching active ADW workflows');

    const workflows = await prisma.adwWorkflow.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info({ count: workflows.length }, 'Active ADW workflows fetched successfully');
    return workflows;
  } catch (error) {
    logger.error({ error }, 'Failed to fetch active ADW workflows');
    throw new Error(`Failed to list active workflows: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Workflow Event Operations
// ============================================================================

/**
 * Create a workflow event
 *
 * @param data - Event creation data
 * @returns The created event record
 * @throws Error if event creation fails
 *
 * @example
 * ```typescript
 * const event = await createWorkflowEvent({
 *   adwId: 'abc12345',
 *   eventType: 'phase_started',
 *   phase: 'build',
 *   message: 'Starting build phase',
 *   data: { toolsUsed: ['npm', 'tsc'] }
 * });
 * ```
 */
export async function createWorkflowEvent(data: CreateWorkflowEventData) {
  try {
    logger.debug({ adwId: data.adwId, eventType: data.eventType }, 'Creating workflow event');

    const event = await prisma.adwWorkflowEvent.create({
      data: {
        adwId: data.adwId,
        eventType: data.eventType,
        eventSubtype: data.eventSubtype,
        phase: data.phase,
        message: data.message,
        data: data.data,
      },
    });

    logger.debug({ eventId: event.id, adwId: event.adwId, eventType: event.eventType }, 'Workflow event created');
    return event;
  } catch (error) {
    logger.error({ error, adwId: data.adwId, eventType: data.eventType }, 'Failed to create workflow event');
    throw new Error(`Failed to create workflow event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all events for a workflow
 *
 * @param adwId - The unique workflow identifier
 * @returns Array of event records, ordered by creation time (oldest first)
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const events = await getWorkflowEvents('abc12345');
 * events.forEach(event => {
 *   console.log(`${event.createdAt}: ${event.eventType}`);
 * });
 * ```
 */
export async function getWorkflowEvents(adwId: string) {
  try {
    logger.debug({ adwId }, 'Fetching workflow events');

    const events = await prisma.adwWorkflowEvent.findMany({
      where: { adwId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    logger.debug({ adwId, count: events.length }, 'Workflow events fetched');
    return events;
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to fetch workflow events');
    throw new Error(`Failed to get workflow events: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Agent Output Operations
// ============================================================================

/**
 * Create an agent output record
 *
 * @param data - Agent output creation data
 * @returns The created agent output record
 * @throws Error if creation fails
 *
 * @example
 * ```typescript
 * const output = await createAgentOutput({
 *   adwId: 'abc12345',
 *   agentName: 'planner',
 *   phase: 'plan',
 *   sessionId: 'session_abc',
 *   model: 'claude-sonnet-4',
 *   outputText: 'Plan completed successfully',
 *   success: true
 * });
 * ```
 */
export async function createAgentOutput(data: CreateAgentOutputData) {
  try {
    logger.debug({ adwId: data.adwId, agentName: data.agentName, phase: data.phase }, 'Creating agent output');

    const output = await prisma.adwAgentOutput.create({
      data: {
        adwId: data.adwId,
        agentName: data.agentName,
        phase: data.phase,
        sessionId: data.sessionId,
        model: data.model,
        outputText: data.outputText,
        outputJsonl: data.outputJsonl,
        success: data.success ?? true,
        errorMessage: data.errorMessage,
        retryCount: data.retryCount ?? 0,
      },
    });

    logger.info({ outputId: output.id, adwId: output.adwId, agentName: output.agentName }, 'Agent output created');
    return output;
  } catch (error) {
    logger.error({ error, adwId: data.adwId, agentName: data.agentName }, 'Failed to create agent output');
    throw new Error(`Failed to create agent output: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all agent outputs for a workflow
 *
 * @param adwId - The unique workflow identifier
 * @returns Array of agent output records, ordered by creation time (oldest first)
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const outputs = await getAgentOutputs('abc12345');
 * outputs.forEach(output => {
 *   console.log(`${output.agentName} (${output.phase}): ${output.success ? 'Success' : 'Failed'}`);
 * });
 * ```
 */
export async function getAgentOutputs(adwId: string) {
  try {
    logger.debug({ adwId }, 'Fetching agent outputs');

    const outputs = await prisma.adwAgentOutput.findMany({
      where: { adwId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    logger.debug({ adwId, count: outputs.length }, 'Agent outputs fetched');
    return outputs;
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to fetch agent outputs');
    throw new Error(`Failed to get agent outputs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
