import { buildServer } from './server.js';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { prisma } from './database/client.js';

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Build and start server
    const server = await buildServer();

    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`Server listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`WebSocket available at ws://${env.HOST}:${env.PORT}/ws`);

  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await prisma.$disconnect();
    process.exit(0);
  });
});

main();
