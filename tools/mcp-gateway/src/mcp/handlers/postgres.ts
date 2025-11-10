import { Pool, PoolConfig } from 'pg';
import { MCPHandler, MCPParams, MCPResult, MCPCapability, PoolStats } from '../protocol/types';
import { dbConfig, config } from '../../../config/environment';
import { ValidationError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { updateConnectionPoolMetrics, recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface PostgreSQLHandlerOptions {
  readOnly?: boolean;
  maxQuerySize?: number;
}

export class PostgreSQLHandler implements MCPHandler {
  private pools: Map<string, Pool>;
  private readonly options: PostgreSQLHandlerOptions;
  private readonly allowedDatabases = ['kids-ascension', 'ozean-licht', 'shared-users', 'shared-users-db'];

  constructor(options: PostgreSQLHandlerOptions = {}) {
    this.pools = new Map();
    this.options = {
      readOnly: options.readOnly ?? true,
      maxQuerySize: options.maxQuerySize ?? 10000,
    };
    this.initializePools();
  }

  private initializePools(): void {
    // Initialize Kids Ascension database pool
    const kaConfig: PoolConfig = {
      ...dbConfig.kidsAscension,
      application_name: 'mcp-gateway-ka',
    };
    this.pools.set('kids-ascension', new Pool(kaConfig));

    // Initialize Ozean Licht database pool
    const olConfig: PoolConfig = {
      ...dbConfig.ozeanLicht,
      application_name: 'mcp-gateway-ol',
    };
    this.pools.set('ozean-licht', new Pool(olConfig));

    // Initialize Shared Users database pool (register as both names for compatibility)
    const sharedConfig: PoolConfig = {
      ...dbConfig.sharedUsers,
      application_name: 'mcp-gateway-shared',
    };
    const sharedPool = new Pool(sharedConfig);
    this.pools.set('shared-users', sharedPool);
    this.pools.set('shared-users-db', sharedPool); // Same pool, both names

    // Set up error handlers for pools
    this.pools.forEach((pool, name) => {
      pool.on('error', (err) => {
        logger.error(`PostgreSQL pool error for ${name}`, { error: err });
      });

      pool.on('connect', () => {
        logger.debug(`PostgreSQL client connected to ${name}`);
      });

      pool.on('remove', () => {
        logger.debug(`PostgreSQL client removed from ${name}`);
      });
    });

    logger.info('PostgreSQL connection pools initialized');
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      // Validate database parameter
      if (!params.database) {
        throw new ValidationError('Database parameter is required for PostgreSQL operations');
      }

      if (!this.allowedDatabases.includes(params.database)) {
        throw new ValidationError(
          `Invalid database. Allowed: ${this.allowedDatabases.join(', ')}`,
          { database: params.database }
        );
      }

      const pool = this.pools.get(params.database);
      if (!pool) {
        throw new ValidationError(`Database pool not found for ${params.database}`);
      }

      // Update pool metrics
      await this.updatePoolMetrics(params.database, pool);

      // Execute the operation
      let result: any;
      switch (params.operation) {
        case 'list-tables':
          result = await this.listTables(pool, params.database);
          break;

        case 'describe-table':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Table name required for describe-table operation');
          }
          result = await this.describeTable(pool, params.args[0]);
          break;

        case 'query':
          if (!params.args || (Array.isArray(params.args) && params.args.length === 0)) {
            throw new ValidationError('SQL query required for query operation');
          }
          // Support both array format and object format
          if (Array.isArray(params.args)) {
            // params.args[0] is the SQL query, rest are parameters
            const [sql, ...queryParams] = params.args;
            result = await this.executeQuery(pool, sql, queryParams, params.options);
          } else {
            // Legacy object format support
            throw new ValidationError('SQL query must be in args array format');
          }
          break;

        case 'schema-info':
          result = await this.getSchemaInfo(pool, params.database);
          break;

        case 'connection-stats':
          result = await this.getConnectionStats(params.database, pool);
          break;

        case 'test':
          result = await this.testConnection(pool, params.database);
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('postgres', params.operation, duration, 'success');
      recordTokenUsage('postgres', params.operation, 500); // Estimated tokens

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 500,
          cost: 0.0015,
          service: 'postgres',
          operation: params.operation,
          database: params.database,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('postgres', params.operation, duration, 'error');

      logger.error('PostgreSQL operation failed', {
        operation: params.operation,
        database: params.database,
        error,
      });

      throw error;
    }
  }

  private async listTables(pool: Pool, database: string): Promise<any> {
    const query = `
      SELECT
        schemaname AS schema,
        tablename AS name,
        tableowner AS owner,
        hasindexes AS has_indexes,
        hasrules AS has_rules,
        hastriggers AS has_triggers
      FROM pg_tables
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schemaname, tablename;
    `;

    const result = await this.executeWithTimeout(pool, query);

    return {
      database,
      tableCount: result.rows.length,
      tables: result.rows.map(row => ({
        schema: row.schema,
        name: row.name,
        fullName: `${row.schema}.${row.name}`,
        owner: row.owner,
        features: {
          indexes: row.has_indexes,
          rules: row.has_rules,
          triggers: row.has_triggers,
        },
      })),
    };
  }

  private async describeTable(pool: Pool, tableName: string): Promise<any> {
    // Handle schema.table format
    const [schema, table] = tableName.includes('.')
      ? tableName.split('.')
      : ['public', tableName];

    const columnsQuery = `
      SELECT
        c.column_name,
        c.data_type,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale,
        c.is_nullable,
        c.column_default,
        c.ordinal_position,
        tc.constraint_type
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage kcu
        ON c.table_schema = kcu.table_schema
        AND c.table_name = kcu.table_name
        AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints tc
        ON kcu.constraint_schema = tc.constraint_schema
        AND kcu.constraint_name = tc.constraint_name
      WHERE c.table_schema = $1 AND c.table_name = $2
      ORDER BY c.ordinal_position;
    `;

    const indexesQuery = `
      SELECT
        i.indexname AS name,
        i.indexdef AS definition,
        idx.indisunique AS is_unique,
        idx.indisprimary AS is_primary
      FROM pg_indexes i
      JOIN pg_class c ON c.relname = i.indexname
      JOIN pg_index idx ON idx.indexrelid = c.oid
      WHERE i.schemaname = $1 AND i.tablename = $2;
    `;

    const statsQuery = `
      SELECT
        n_live_tup AS row_count,
        pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
        pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
        pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid)) AS indexes_size
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = $1 AND c.relname = $2;
    `;

    const [columns, indexes, stats] = await Promise.all([
      this.executeWithTimeout(pool, columnsQuery, [schema, table]),
      this.executeWithTimeout(pool, indexesQuery, [schema, table]),
      this.executeWithTimeout(pool, statsQuery, [schema, table]),
    ]);

    if (columns.rows.length === 0) {
      throw new ValidationError(`Table ${schema}.${table} not found`);
    }

    // Group columns with their constraints
    const columnMap = new Map();
    columns.rows.forEach(row => {
      if (!columnMap.has(row.column_name)) {
        columnMap.set(row.column_name, {
          name: row.column_name,
          type: this.formatDataType(row),
          nullable: row.is_nullable === 'YES',
          default: row.column_default,
          position: row.ordinal_position,
          constraints: [],
        });
      }
      if (row.constraint_type) {
        columnMap.get(row.column_name).constraints.push(row.constraint_type);
      }
    });

    return {
      table: {
        schema,
        name: table,
        fullName: `${schema}.${table}`,
      },
      columns: Array.from(columnMap.values()),
      indexes: indexes.rows.map(idx => ({
        name: idx.name,
        definition: idx.definition,
        unique: idx.is_unique,
        primary: idx.is_primary,
      })),
      statistics: stats.rows[0] || {
        row_count: 0,
        total_size: '0 bytes',
        table_size: '0 bytes',
        indexes_size: '0 bytes',
      },
    };
  }

  private async executeQuery(pool: Pool, sql: string, params: any[], options?: any): Promise<any> {
    // Validate query size
    if (sql.length > this.options.maxQuerySize!) {
      throw new ValidationError(
        `Query exceeds maximum size limit of ${this.options.maxQuerySize} characters`
      );
    }

    // Check for dangerous operations in read-only mode
    if (this.options.readOnly) {
      const dangerousKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE'];
      const upperSQL = sql.toUpperCase();

      for (const keyword of dangerousKeywords) {
        if (upperSQL.includes(keyword)) {
          throw new ValidationError(
            `Operation ${keyword} not allowed in read-only mode`,
            { query: sql.substring(0, 100) }
          );
        }
      }
    }

    // Apply limit if specified
    let finalQuery = sql;
    if (options?.limit && !sql.toUpperCase().includes('LIMIT')) {
      finalQuery = `${sql} LIMIT ${parseInt(options.limit)}`;
    }

    const result = await this.executeWithTimeout(pool, finalQuery, params);

    return {
      rowCount: result.rowCount,
      rows: result.rows,
      fields: result.fields?.map(f => ({
        name: f.name,
        dataType: f.dataTypeID,
      })),
      truncated: options?.limit && result.rowCount >= parseInt(options.limit),
    };
  }

  private async getSchemaInfo(pool: Pool, database: string): Promise<any> {
    const schemasQuery = `
      SELECT
        schema_name,
        schema_owner,
        (SELECT COUNT(*) FROM pg_tables WHERE schemaname = schema_name) AS table_count,
        (SELECT COUNT(*) FROM pg_views WHERE schemaname = schema_name) AS view_count
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name;
    `;

    const databaseQuery = `
      SELECT
        current_database() AS name,
        pg_database_size(current_database()) AS size_bytes,
        pg_size_pretty(pg_database_size(current_database())) AS size_pretty,
        version() AS version
    `;

    const [schemas, dbInfo] = await Promise.all([
      this.executeWithTimeout(pool, schemasQuery),
      this.executeWithTimeout(pool, databaseQuery),
    ]);

    return {
      database: dbInfo.rows[0],
      schemas: schemas.rows,
      summary: {
        totalSchemas: schemas.rows.length,
        totalTables: schemas.rows.reduce((sum, s) => sum + parseInt(s.table_count), 0),
        totalViews: schemas.rows.reduce((sum, s) => sum + parseInt(s.view_count), 0),
      },
    };
  }

  private async getConnectionStats(database: string, pool: Pool): Promise<any> {
    const dbKey = database === 'kids-ascension' ? 'kidsAscension'
                : (database === 'shared-users' || database === 'shared-users-db') ? 'sharedUsers'
                : 'ozeanLicht';

    const poolStats: PoolStats = {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
      maxConnections: dbConfig[dbKey].max,
      connectionErrors: 0, // Would need to track this separately
    };

    // Query active connections from database
    const activeQuery = `
      SELECT
        pid,
        usename,
        application_name,
        client_addr,
        state,
        query_start,
        state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
      ORDER BY query_start DESC;
    `;

    const activeConnections = await this.executeWithTimeout(pool, activeQuery);

    return {
      database,
      pool: poolStats,
      activeConnections: activeConnections.rows,
    };
  }

  private async testConnection(pool: Pool, database: string): Promise<any> {
    const testQuery = 'SELECT NOW() AS current_time, current_database() AS database, version() AS version';

    const startTime = Date.now();
    const result = await this.executeWithTimeout(pool, testQuery);
    const latency = Date.now() - startTime;

    return {
      status: 'connected',
      database,
      latency: `${latency}ms`,
      serverTime: result.rows[0].current_time,
      version: result.rows[0].version.split(',')[0], // Just the PostgreSQL version
    };
  }

  private async executeWithTimeout(pool: Pool, query: string, params?: any[]): Promise<any> {
    const client = await pool.connect();

    try {
      // Set statement timeout
      await client.query(`SET statement_timeout = ${config.DB_QUERY_TIMEOUT_MS}`);

      // Execute query
      const result = await client.query(query, params);

      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new TimeoutError(`Query execution timeout after ${config.DB_QUERY_TIMEOUT_MS}ms`);
      }
      throw error;
    } finally {
      client.release();
    }
  }

  private async updatePoolMetrics(database: string, pool: Pool): Promise<void> {
    updateConnectionPoolMetrics(database, {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    });
  }

  private formatDataType(column: any): string {
    let type = column.data_type;

    if (column.character_maximum_length) {
      type += `(${column.character_maximum_length})`;
    } else if (column.numeric_precision) {
      type += `(${column.numeric_precision}`;
      if (column.numeric_scale) {
        type += `,${column.numeric_scale}`;
      }
      type += ')';
    }

    return type;
  }

  public validateParams(params: MCPParams): void {
    if (!params.database) {
      throw new ValidationError('Database parameter is required');
    }

    if (!this.allowedDatabases.includes(params.database)) {
      throw new ValidationError(
        `Invalid database. Allowed: ${this.allowedDatabases.join(', ')}`
      );
    }

    if (!params.operation) {
      throw new ValidationError('Operation parameter is required');
    }

    const validOperations = this.getCapabilities().map(c => c.name);
    if (!validOperations.includes(params.operation)) {
      throw new ValidationError(
        `Invalid operation. Allowed: ${validOperations.join(', ')}`
      );
    }
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'list-tables',
        description: 'List all tables in the database',
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'describe-table',
        description: 'Get detailed information about a table',
        parameters: [
          {
            name: 'tableName',
            type: 'string',
            description: 'Name of the table (can include schema)',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 500,
      },
      {
        name: 'query',
        description: 'Execute a SQL query',
        parameters: [
          {
            name: 'sql',
            type: 'string',
            description: 'SQL query to execute',
            required: true,
          },
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum number of rows to return',
            required: false,
            default: 100,
          },
        ],
        requiresAuth: true,
        tokenCost: 800,
      },
      {
        name: 'schema-info',
        description: 'Get database schema information',
        requiresAuth: true,
        tokenCost: 400,
      },
      {
        name: 'connection-stats',
        description: 'Get connection pool statistics',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'test',
        description: 'Test database connection',
        requiresAuth: true,
        tokenCost: 100,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down PostgreSQL handler...');

    for (const [name, pool] of this.pools) {
      try {
        await pool.end();
        logger.info(`Closed PostgreSQL pool for ${name}`);
      } catch (error) {
        logger.error(`Error closing pool for ${name}`, { error });
      }
    }

    this.pools.clear();
  }
}