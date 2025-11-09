/**
 * Orchestrator HTTP Routes
 *
 * REST API endpoints for orchestrator chat interface.
 *
 * @module routes/orchestrator
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import {
  initializeOrchestrator,
  executeOrchestratorQuery,
  getChatHistory,
  clearChatHistory,
  getSessionMetrics,
  getCurrentSession,
} from '../services/orchestrator-service.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

const ChatMessageSchema = z.object({
  message: z.string().min(1),
  stream: z.boolean().optional(),
});

type ChatMessageRequest = z.infer<typeof ChatMessageSchema>;

// ============================================================================
// Route Handlers
// ============================================================================

export async function registerOrchestratorRoutes(server: FastifyInstance) {
  // Prefix all routes with /api/orchestrator
  await server.register(
    async (orchRoutes) => {
      /**
       * POST /api/orchestrator/chat
       * Send a message to the orchestrator
       */
      orchRoutes.post<{ Body: ChatMessageRequest }>(
        '/chat',
        async (request: FastifyRequest<{ Body: ChatMessageRequest }>, reply: FastifyReply) => {
          try {
            const { message, stream } = ChatMessageSchema.parse(request.body);

            // Initialize orchestrator if not already
            if (!getCurrentSession()) {
              await initializeOrchestrator();
            }

            logger.info({ messageLength: message.length }, 'Orchestrator chat message received');

            // Execute query
            const response = await executeOrchestratorQuery(message);

            return reply.send({
              success: true,
              response,
              metrics: getSessionMetrics(),
            });
          } catch (error) {
            logger.error({ error }, 'Orchestrator chat failed');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Orchestrator execution failed',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * GET /api/orchestrator/history
       * Get chat history for current session
       */
      orchRoutes.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const history = getChatHistory();

          return reply.send({
            success: true,
            history,
            count: history.length,
          });
        } catch (error) {
          logger.error({ error }, 'Failed to get chat history');
          return reply.code(500).send({
            error: 'Failed to retrieve history',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * DELETE /api/orchestrator/history
       * Clear chat history and start fresh session
       */
      orchRoutes.delete('/history', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await clearChatHistory();

          return reply.send({
            success: true,
            message: 'Chat history cleared successfully',
          });
        } catch (error) {
          logger.error({ error }, 'Failed to clear chat history');
          return reply.code(500).send({
            error: 'Failed to clear history',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * GET /api/orchestrator/metrics
       * Get current session metrics
       */
      orchRoutes.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const metrics = getSessionMetrics();

          if (!metrics) {
            return reply.code(404).send({
              error: 'No active session',
              message: 'Orchestrator not initialized',
            });
          }

          return reply.send({
            success: true,
            metrics,
          });
        } catch (error) {
          logger.error({ error }, 'Failed to get metrics');
          return reply.code(500).send({
            error: 'Failed to retrieve metrics',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    },
    { prefix: '/api/orchestrator' }
  );

  logger.info('Orchestrator routes registered');
}
