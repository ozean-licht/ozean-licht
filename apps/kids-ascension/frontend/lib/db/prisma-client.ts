/**
 * Prisma Client for Kids Ascension Database
 *
 * This module provides a singleton Prisma client instance for the Kids Ascension
 * database, ensuring optimal connection pooling and preventing connection leaks.
 */

import { PrismaClient } from '.prisma/client-ka'

// Extend globalThis to include our Prisma instance
const globalForPrisma = globalThis as unknown as {
  prismaKA: PrismaClient | undefined
}

// Create singleton instance
export const prismaKA =
  globalForPrisma.prismaKA ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL_KA
      }
    }
  })

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaKA = prismaKA
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prismaKA.$disconnect()
  })
}

export default prismaKA
