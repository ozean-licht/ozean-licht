/**
 * Direct PostgreSQL Database Client
 *
 * Provides direct database access for the admin dashboard.
 * Connects directly to ozean-licht-db on Coolify.
 * No dependency on MCP Gateway for reads.
 *
 * Environment Variables (in order of preference):
 *   - OZEAN_LICHT_DB_URL: Full connection string
 *   - Individual vars: POSTGRES_OL_HOST, POSTGRES_OL_PORT, etc.
 */

import { Pool, PoolClient, QueryResult } from 'pg';

// Global pool instance (singleton pattern for Next.js)
let pool: Pool | null = null;

/**
 * Build connection config from environment
 */
function getConnectionConfig() {
  // Option 1: Full connection string
  const connectionString = process.env.OZEAN_LICHT_DB_URL;
  if (connectionString) {
    return { connectionString };
  }

  // Option 2: Individual environment variables
  const host = process.env.POSTGRES_OL_HOST;
  const port = process.env.POSTGRES_OL_PORT;
  const database = process.env.POSTGRES_OL_DATABASE || 'ozean-licht-db';
  const user = process.env.POSTGRES_OL_USER || 'postgres';
  const password = process.env.POSTGRES_OL_PASSWORD;

  if (host && password) {
    return {
      host,
      port: parseInt(port || '5432', 10),
      database,
      user,
      password,
    };
  }

  // Option 3: Fallback to DATABASE_URL (legacy)
  if (process.env.DATABASE_URL) {
    console.warn('Using DATABASE_URL fallback. Set OZEAN_LICHT_DB_URL for ozean-licht-db.');
    return { connectionString: process.env.DATABASE_URL };
  }

  throw new Error(
    'Database connection not configured. Set OZEAN_LICHT_DB_URL or POSTGRES_OL_* variables.'
  );
}

/**
 * Get or create the database pool
 */
function getPool(): Pool {
  if (!pool) {
    const config = getConnectionConfig();

    pool = new Pool({
      ...config,
      max: 10, // Maximum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Fail fast if can't connect in 10s
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }

  return pool;
}

/**
 * Execute a query and return rows
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

/**
 * Execute a query and return full result (includes rowCount, etc.)
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<QueryResult> {
  const pool = getPool();
  return pool.query(sql, params);
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return pool.connect();
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check database connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT 1');
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Close the pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Export types for convenience
export type { PoolClient, QueryResult };
