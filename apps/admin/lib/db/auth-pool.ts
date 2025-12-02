/**
 * Direct PostgreSQL Connection Pool for Authentication
 *
 * CONSOLIDATED: Auth and content now use the same database (ozean-licht-db).
 * This simplifies operations and enables native JOINs between users and content.
 *
 * Database: ozean-licht-db (contains users, admin_users, courses, videos, etc.)
 * Connection: OZEAN_LICHT_DB_URL (same as lib/db/index.ts)
 *
 * Note: All application database access uses direct PostgreSQL connections.
 * MCP Gateway is for AI agent tool access, not application infrastructure.
 */

import { Pool, PoolConfig } from 'pg';

// Use OZEAN_LICHT_DB_URL - consolidated database for auth + content
const getDatabaseConfig = (): PoolConfig => {
  // Primary: OZEAN_LICHT_DB_URL (consolidated database)
  // Fallback: DATABASE_URL (legacy, points to same DB now)
  const databaseUrl = process.env.OZEAN_LICHT_DB_URL
    || process.env.OZEAN_LICHT_DATABASE_URL
    || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'Missing database configuration. Set OZEAN_LICHT_DB_URL environment variable.'
    );
  }

  return {
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

// Create a singleton connection pool
let authPool: Pool | null = null;

/**
 * Get or create the authentication database pool
 */
export function getAuthPool(): Pool {
  if (!authPool) {
    const config = getDatabaseConfig();
    authPool = new Pool(config);

    // Handle pool errors
    authPool.on('error', (err) => {
      console.error('[AuthPool] Unexpected database error:', err);
    });

    // Log pool creation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthPool] PostgreSQL connection pool created');
    }
  }

  return authPool;
}

/**
 * Close the authentication pool (for graceful shutdown)
 */
export async function closeAuthPool(): Promise<void> {
  if (authPool) {
    await authPool.end();
    authPool = null;
    console.log('[AuthPool] Connection pool closed');
  }
}

/**
 * Health check for auth database
 */
export async function checkAuthDbHealth(): Promise<boolean> {
  try {
    const pool = getAuthPool();
    const result = await pool.query('SELECT 1 as ok');
    return result.rows[0]?.ok === 1;
  } catch (error) {
    console.error('[AuthPool] Health check failed:', error);
    return false;
  }
}
