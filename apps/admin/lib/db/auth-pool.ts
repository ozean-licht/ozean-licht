/**
 * Direct PostgreSQL Connection Pool for Authentication
 *
 * This module provides a direct database connection specifically for
 * authentication operations, bypassing the MCP Gateway for performance.
 *
 * Architecture Decision:
 * - Auth operations use direct DB connection (fast, critical path)
 * - Dashboard operations use MCP Gateway (flexibility, AI agent support)
 */

import { Pool, PoolConfig } from 'pg';

// Parse DATABASE_URL or construct from individual env vars
const getDatabaseConfig = (): PoolConfig => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }

  // Fallback to individual env vars
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '32771'),
    database: process.env.POSTGRES_DATABASE || 'shared-users-db',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
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
