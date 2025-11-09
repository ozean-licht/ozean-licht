/**
 * ADW HTTP Routes
 *
 * REST API endpoints for managing ADW workflows via HTTP.
 * These routes expose the workflow-manager functionality to HTTP clients.
 *
 * @module routes/adw
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { getWorkflowState, listWorkflowStates } from '../modules/adw/state-manager.js';
import { WorkflowType, SlashCommand } from '../modules/adw/types.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

/**
 * Schema for creating a new workflow
 */
const CreateWorkflowSchema = z.object({
  issueNumber: z.number().int().positive(),
  workflowType: WorkflowType,
  modelSet: z.enum(['base', 'heavy']).optional(),
});

type CreateWorkflowRequest = z.infer<typeof CreateWorkflowSchema>;

/**
 * Schema for executing a workflow phase
 */
const ExecutePhaseSchema = z.object({
  slashCommand: SlashCommand.optional(),
  customPrompt: z.string().optional(),
});

type ExecutePhaseRequest = z.infer<typeof ExecutePhaseSchema>;

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * Register all ADW routes with the Fastify server
 *
 * @param server - Fastify instance
 */
export async function registerAdwRoutes(server: FastifyInstance) {
  // Prefix all routes with /api/adw
  await server.register(
    async (adwRoutes) => {
      /**
       * POST /api/adw/workflows
       * Create a new ADW workflow
       */
      adwRoutes.post<{ Body: CreateWorkflowRequest }>(
        '/workflows',
        async (request: FastifyRequest<{ Body: CreateWorkflowRequest }>, reply: FastifyReply) => {
          try {
            // Validate request body
            const { issueNumber, workflowType, modelSet } = CreateWorkflowSchema.parse(request.body);

            logger.info({ issueNumber, workflowType }, 'Creating new ADW workflow');

            // Create workflow (this will initialize state in database)
            const result = await WorkflowManager.createWorkflow(issueNumber, workflowType, modelSet);

            if (!result.success) {
              return reply.code(500).send({
                error: 'Failed to create workflow',
                message: result.error,
              });
            }

            // Get workflow state
            const workflowState = await getWorkflowState(result.adwId!);

            return reply.code(201).send({
              success: true,
              adwId: result.adwId,
              workflow: workflowState,
            });
          } catch (error) {
            logger.error({ error }, 'Error creating workflow');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * GET /api/adw/workflows
       * List all active workflows
       */
      adwRoutes.get('/workflows', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const workflows = await listWorkflowStates();

          return reply.send({
            success: true,
            count: workflows.length,
            workflows,
          });
        } catch (error) {
          logger.error({ error }, 'Error listing workflows');
          return reply.code(500).send({
            error: 'Failed to list workflows',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * GET /api/adw/workflows/:adwId
       * Get workflow status and details
       */
      adwRoutes.get<{ Params: { adwId: string } }>(
        '/workflows/:adwId',
        async (request: FastifyRequest<{ Params: { adwId: string } }>, reply: FastifyReply) => {
          try {
            const { adwId } = request.params;

            const workflow = await getWorkflowState(adwId);

            if (!workflow) {
              return reply.code(404).send({
                error: 'Workflow not found',
                adwId,
              });
            }

            return reply.send({
              success: true,
              workflow,
            });
          } catch (error) {
            logger.error({ error }, 'Error fetching workflow');
            return reply.code(500).send({
              error: 'Failed to fetch workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * POST /api/adw/workflows/:adwId/execute
       * Execute a workflow phase
       */
      adwRoutes.post<{ Params: { adwId: string }; Body: ExecutePhaseRequest }>(
        '/workflows/:adwId/execute',
        async (
          request: FastifyRequest<{ Params: { adwId: string }; Body: ExecutePhaseRequest }>,
          reply: FastifyReply
        ) => {
          try {
            const { adwId } = request.params;
            const { slashCommand, customPrompt } = ExecutePhaseSchema.parse(request.body);

            logger.info({ adwId, slashCommand }, 'Executing workflow phase');

            // Get workflow state
            const workflow = await getWorkflowState(adwId);
            if (!workflow) {
              return reply.code(404).send({
                error: 'Workflow not found',
                adwId,
              });
            }

            // Execute based on slash command or custom prompt
            let result;
            if (slashCommand) {
              // Execute predefined workflow phase
              result = await WorkflowManager.executeWorkflowPhase(adwId, slashCommand);
            } else if (customPrompt) {
              // Execute custom agent prompt
              result = await WorkflowManager.executeCustomPrompt(adwId, customPrompt);
            } else {
              return reply.code(400).send({
                error: 'Either slashCommand or customPrompt is required',
              });
            }

            if (!result.success) {
              return reply.code(500).send({
                error: 'Workflow execution failed',
                message: result.error,
              });
            }

            return reply.send({
              success: true,
              output: result.output,
            });
          } catch (error) {
            logger.error({ error }, 'Error executing workflow');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Failed to execute workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * DELETE /api/adw/workflows/:adwId
       * Cancel/cleanup a workflow
       */
      adwRoutes.delete<{ Params: { adwId: string } }>(
        '/workflows/:adwId',
        async (request: FastifyRequest<{ Params: { adwId: string } }>, reply: FastifyReply) => {
          try {
            const { adwId } = request.params;

            logger.info({ adwId }, 'Cancelling workflow');

            const result = await WorkflowManager.cleanupWorkflow(adwId);

            if (!result.success) {
              return reply.code(500).send({
                error: 'Failed to cancel workflow',
                message: result.error,
              });
            }

            return reply.send({
              success: true,
              message: 'Workflow cancelled successfully',
            });
          } catch (error) {
            logger.error({ error }, 'Error cancelling workflow');
            return reply.code(500).send({
              error: 'Failed to cancel workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );
    },
    { prefix: '/api/adw' }
  );

  logger.info('ADW routes registered');
}
