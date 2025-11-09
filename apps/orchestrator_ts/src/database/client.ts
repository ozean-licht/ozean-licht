import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Database query');
  });
}

prisma.$on('error', (e) => {
  logger.error({ target: e.target, message: e.message }, 'Database error');
});

prisma.$on('warn', (e) => {
  logger.warn({ target: e.target, message: e.message }, 'Database warning');
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
