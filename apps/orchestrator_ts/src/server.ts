import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { registerAdwRoutes } from './routes/adw.js';
import { registerWebhookRoutes } from './routes/webhooks.js';
import { registerOrchestratorRoutes } from './routes/orchestrator.js';
import { registerClient } from './modules/websocket/adw-websocket-manager.js';

export async function buildServer() {
  const server = Fastify({
    logger: true,
    bodyLimit: 1048576, // 1MB for webhook payloads
  });

  // Register plugins
  await server.register(cors, {
    origin: true, // Allow all origins in development
  });

  await server.register(websocket);

  // Register webhook routes BEFORE other routes (needs raw body)
  await registerWebhookRoutes(server);

  // Register ADW HTTP routes
  await registerAdwRoutes(server);

  // Register Orchestrator HTTP routes
  await registerOrchestratorRoutes(server);

  // Health check route
  server.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'orchestrator-ts',
    };
  });

  // WebSocket endpoint with ADW manager
  server.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (socket, req) => {
      const clientId = registerClient(socket);
      logger.info({ clientId }, 'WebSocket client registered');
    });
  });

  return server;
}
