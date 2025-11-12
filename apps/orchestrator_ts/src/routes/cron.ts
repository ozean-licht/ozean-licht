/**
 * Cron Job HTTP Routes
 *
 * REST API endpoints for managing scheduled ADW workflows via cron expressions.
 *
 * @module routes/cron
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import * as CronService from '../services/cron-service.js';
import { WorkflowType, ModelSet } from '../modules/adw/types.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

/**
 * Schema for creating a new cron job
 */
const CreateCronJobSchema = z.object({
  schedule: z.string().min(1, 'Schedule is required'),
  workflowType: WorkflowType,
  issueNumber: z.number().int().positive(),
  modelSet: ModelSet.optional().default('base'),
  enabled: z.boolean().optional().default(true),
  description: z.string().optional(),
});

type CreateCronJobRequest = z.infer<typeof CreateCronJobSchema>;

/**
 * Schema for updating a cron job
 */
const UpdateCronJobSchema = z.object({
  schedule: z.string().min(1).optional(),
  workflowType: WorkflowType.optional(),
  issueNumber: z.number().int().positive().optional(),
  modelSet: ModelSet.optional(),
  enabled: z.boolean().optional(),
  description: z.string().optional(),
});

type UpdateCronJobRequest = z.infer<typeof UpdateCronJobSchema>;

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * Register all cron routes with the Fastify server
 *
 * @param server - Fastify instance
 */
export async function registerCronRoutes(server: FastifyInstance) {
  // Prefix all routes with /api/cron
  await server.register(
    async (cronRoutes) => {
      /**
       * POST /api/cron/jobs
       * Create a new cron job
       */
      cronRoutes.post<{ Body: CreateCronJobRequest }>(
        '/jobs',
        async (request: FastifyRequest<{ Body: CreateCronJobRequest }>, reply: FastifyReply) => {
          try {
            const jobData = CreateCronJobSchema.parse(request.body);

            logger.info({ jobData }, 'Creating new cron job');

            const jobId = await CronService.scheduleCronJob(jobData);

            const job = await CronService.getCronJob(jobId);

            return reply.code(201).send({
              success: true,
              jobId,
              job,
            });
          } catch (error) {
            logger.error({ error }, 'Error creating cron job');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Failed to create cron job',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * GET /api/cron/jobs
       * List all cron jobs
       */
      cronRoutes.get('/jobs', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const jobs = await CronService.listCronJobs();

          return reply.send({
            success: true,
            count: jobs.length,
            jobs,
          });
        } catch (error) {
          logger.error({ error }, 'Error listing cron jobs');
          return reply.code(500).send({
            error: 'Failed to list cron jobs',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * GET /api/cron/jobs/:jobId
       * Get a specific cron job
       */
      cronRoutes.get<{ Params: { jobId: string } }>(
        '/jobs/:jobId',
        async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
          try {
            const { jobId } = request.params;

            const job = await CronService.getCronJob(jobId);

            if (!job) {
              return reply.code(404).send({
                error: 'Cron job not found',
                jobId,
              });
            }

            return reply.send({
              success: true,
              job,
            });
          } catch (error) {
            logger.error({ error }, 'Error fetching cron job');
            return reply.code(500).send({
              error: 'Failed to fetch cron job',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * PUT /api/cron/jobs/:jobId
       * Update a cron job
       */
      cronRoutes.put<{ Params: { jobId: string }; Body: UpdateCronJobRequest }>(
        '/jobs/:jobId',
        async (
          request: FastifyRequest<{ Params: { jobId: string }; Body: UpdateCronJobRequest }>,
          reply: FastifyReply
        ) => {
          try {
            const { jobId } = request.params;
            const updates = UpdateCronJobSchema.parse(request.body);

            logger.info({ jobId, updates }, 'Updating cron job');

            const success = await CronService.updateCronJob(jobId, updates);

            if (!success) {
              return reply.code(404).send({
                error: 'Cron job not found',
                jobId,
              });
            }

            const job = await CronService.getCronJob(jobId);

            return reply.send({
              success: true,
              job,
            });
          } catch (error) {
            logger.error({ error }, 'Error updating cron job');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Failed to update cron job',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * DELETE /api/cron/jobs/:jobId
       * Cancel/delete a cron job
       */
      cronRoutes.delete<{ Params: { jobId: string } }>(
        '/jobs/:jobId',
        async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
          try {
            const { jobId } = request.params;

            logger.info({ jobId }, 'Cancelling cron job');

            const success = await CronService.cancelCronJob(jobId);

            if (!success) {
              return reply.code(404).send({
                error: 'Cron job not found',
                jobId,
              });
            }

            return reply.send({
              success: true,
              message: 'Cron job cancelled successfully',
            });
          } catch (error) {
            logger.error({ error }, 'Error cancelling cron job');
            return reply.code(500).send({
              error: 'Failed to cancel cron job',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * POST /api/cron/jobs/:jobId/trigger
       * Manually trigger a cron job execution
       */
      cronRoutes.post<{ Params: { jobId: string } }>(
        '/jobs/:jobId/trigger',
        async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
          try {
            const { jobId } = request.params;

            logger.info({ jobId }, 'Manually triggering cron job');

            const success = await CronService.triggerCronJob(jobId);

            if (!success) {
              return reply.code(404).send({
                error: 'Cron job not found',
                jobId,
              });
            }

            return reply.send({
              success: true,
              message: 'Cron job triggered successfully',
            });
          } catch (error) {
            logger.error({ error }, 'Error triggering cron job');
            return reply.code(500).send({
              error: 'Failed to trigger cron job',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );
    },
    { prefix: '/api/cron' }
  );

  logger.info('Cron routes registered');
}
