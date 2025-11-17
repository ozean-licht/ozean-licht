/**
 * Direct PostgreSQL Connection Pool for Storybook Authentication
 *
 * This module provides a direct database connection specifically for
 * authentication operations with the shared_users_db.
 *
 * Architecture Decision:
 * - Auth operations use direct DB connection (fast, critical path)
 * - Bypasses MCP Gateway for authentication performance
 * - Connects to shared_users_db for unified authentication
 */

import { Pool, PoolConfig } from 'pg';

/**
 * Get database configuration from environment
 */
const getDatabaseConfig = (): PoolConfig => {
  const databaseUrl = process.env.SHARED_USERS_DB_URL;

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
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE || 'shared_users_db',
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
      console.error('[StorybookAuth] Unexpected database error:', err);
    });

    // Log pool creation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[StorybookAuth] PostgreSQL connection pool created');
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
    console.log('[StorybookAuth] Connection pool closed');
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
    console.error('[StorybookAuth] Health check failed:', error);
    return false;
  }
}
