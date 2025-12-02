/**
 * Direct PostgreSQL Database Client
 *
 * Provides database access via direct PostgreSQL connection for the admin dashboard.
 * Uses the `pg` package with connection pooling for efficient query execution.
 *
 * IMPORTANT: This is the correct pattern for application database access.
 * MCP Gateway is meant for AI agent tool access, NOT for application infrastructure.
 *
 * Environment Variables:
 *   - DATABASE_URL: Full connection string (preferred)
 *   - Or individual vars: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD
 */

import { Pool, PoolConfig, QueryResult as PgQueryResult } from 'pg';

/**
 * Result type for query operations
 */
export interface QueryResult {
  rowCount: number | null;
  rows: any[];
}

// Parse DATABASE_URL or construct from individual env vars
const getDatabaseConfig = (): PoolConfig => {
  // Check for ozean-licht content database URL (multiple possible env var names)
  const databaseUrl = process.env.OZEAN_LICHT_DB_URL
    || process.env.OZEAN_LICHT_DATABASE_URL
    || process.env.DATABASE_URL_OL;

  if (!databaseUrl) {
    throw new Error(
      'Missing database configuration. Set OZEAN_LICHT_DB_URL environment variable. ' +
      'Note: DATABASE_URL is for auth (shared-users-db), not content.'
    );
  }

  return {
    connectionString: databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

// Create a singleton connection pool
let pool: Pool | null = null;

/**
 * Get or create the database connection pool
 */
function getPool(): Pool {
  if (!pool) {
    const config = getDatabaseConfig();
    pool = new Pool(config);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('[DB Pool] Unexpected database error:', err);
    });

    // Log pool creation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB Pool] PostgreSQL connection pool created for ozean-licht-db');
    }
  }

  return pool;
}

/**
 * Execute a query and return rows
 *
 * @param sql - SQL query string with $1, $2, etc. placeholders
 * @param params - Query parameters
 * @returns Array of rows matching the query
 *
 * @example
 * const users = await query<User>('SELECT * FROM users WHERE status = $1', ['active']);
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const dbPool = getPool();

  try {
    const result: PgQueryResult = await dbPool.query(sql, params);
    return result.rows as T[];
  } catch (error: any) {
    // Log error with context
    console.error('[DB Query] Error executing query:', {
      sql: sql.substring(0, 200),
      error: error.message,
    });
    throw error;
  }
}

/**
 * Execute a query and return full result (includes rowCount)
 *
 * @param sql - SQL query string with $1, $2, etc. placeholders
 * @param params - Query parameters
 * @returns QueryResult with rowCount and rows
 *
 * @example
 * const result = await execute('DELETE FROM tasks WHERE id = $1', [taskId]);
 * console.log(`Deleted ${result.rowCount} rows`);
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<QueryResult> {
  const dbPool = getPool();

  try {
    const result: PgQueryResult = await dbPool.query(sql, params);
    return {
      rowCount: result.rowCount,
      rows: result.rows,
    };
  } catch (error: any) {
    // Log error with context
    console.error('[DB Execute] Error executing query:', {
      sql: sql.substring(0, 200),
      error: error.message,
    });
    throw error;
  }
}

/**
 * Check database connectivity
 *
 * @returns true if database is reachable, false otherwise
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const rows = await query<{ ok: number }>('SELECT 1 as ok');
    return rows[0]?.ok === 1;
  } catch {
    return false;
  }
}

/**
 * Close the connection pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[DB Pool] Connection pool closed');
  }
}
