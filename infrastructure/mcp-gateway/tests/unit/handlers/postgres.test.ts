/**
 * Unit Tests for PostgreSQL MCP Handler
 */

import { PostgreSQLHandler } from '../../../src/mcp/handlers/postgres';
import { MCPParams } from '../../../src/mcp/protocol/types';
import { ValidationError } from '../../../src/utils/errors';
import {
  mockPool,
  mockClient,
  mockTableListResult,
  mockTableDescriptionResult,
  mockQueryResult,
  resetDatabaseMocks,
  mockSuccessfulConnection,
  mockFailedConnection,
} from '../../mocks/database';

// Mock the pg module
jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock metrics
jest.mock('../../../src/monitoring/metrics', () => ({
  updateConnectionPoolMetrics: jest.fn(),
  recordMCPOperation: jest.fn(),
  recordTokenUsage: jest.fn(),
}));

// Mock environment config
jest.mock('../../../config/environment', () => ({
  dbConfig: {
    kidsAscension: {
      host: 'localhost',
      port: 5432,
      database: 'kids_ascension_test',
      user: 'test_user',
      password: 'test_password',
      min: 2,
      max: 10,
    },
    ozeanLicht: {
      host: 'localhost',
      port: 5431,
      database: 'ozean_licht_test',
      user: 'test_user',
      password: 'test_password',
      min: 2,
      max: 10,
    },
  },
  config: {
    db: {
      queryTimeout: 10000,
      idleTimeout: 10000,
    },
  },
}));

describe('PostgreSQLHandler', () => {
  let handler: PostgreSQLHandler;

  beforeEach(() => {
    resetDatabaseMocks();
    handler = new PostgreSQLHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize connection pools for both databases', () => {
      expect(handler).toBeDefined();
      // Pool constructor should be called twice (kids-ascension and ozean-licht)
      expect(require('pg').Pool).toHaveBeenCalledTimes(2);
    });

    it('should set up error handlers for pools', () => {
      expect(mockPool.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockPool.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockPool.on).toHaveBeenCalledWith('remove', expect.any(Function));
    });
  });

  describe('Parameter Validation', () => {
    it('should throw ValidationError when database parameter is missing', async () => {
      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Database parameter is required for PostgreSQL operations'
      );
    });

    it('should throw ValidationError for invalid database name', async () => {
      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'invalid-database',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(/Invalid database/);
    });

    it('should accept valid database names', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const validDatabases = ['kids-ascension', 'ozean-licht'];

      for (const database of validDatabases) {
        const params: MCPParams = {
          service: 'postgres',
          operation: 'list-tables',
          database,
        };

        await expect(handler.execute(params)).resolves.not.toThrow();
      }
    });
  });

  describe('list-tables Operation', () => {
    it('should list all tables in the database', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.tableCount).toBe(3);
      expect(result.data.tables).toHaveLength(3);
      expect(result.data.tables[0].name).toBe('users');
      expect(result.metadata.service).toBe('postgres');
      expect(result.metadata.operation).toBe('list-tables');
    });

    it('should include schema information in table list', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      const result = await handler.execute(params);

      expect(result.data.tables[0]).toHaveProperty('schema', 'public');
      expect(result.data.tables[0]).toHaveProperty('fullName', 'public.users');
      expect(result.data.tables[0]).toHaveProperty('owner', 'postgres');
    });
  });

  describe('describe-table Operation', () => {
    it('should describe table schema', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableDescriptionResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'describe-table',
        database: 'kids-ascension',
        args: ['users'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.columns).toHaveLength(3);
      expect(result.data.columns[0].name).toBe('id');
      expect(result.data.columns[0].type).toBe('integer');
    });

    it('should throw ValidationError when table name is missing', async () => {
      const params: MCPParams = {
        service: 'postgres',
        operation: 'describe-table',
        database: 'kids-ascension',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Table name required for describe-table operation'
      );
    });
  });

  describe('query Operation', () => {
    it('should execute SELECT query successfully', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockQueryResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'query',
        database: 'kids-ascension',
        args: ['SELECT * FROM users LIMIT 10'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.rows).toHaveLength(2);
      expect(result.data.rowCount).toBe(2);
    });

    it('should throw ValidationError when query is missing', async () => {
      const params: MCPParams = {
        service: 'postgres',
        operation: 'query',
        database: 'kids-ascension',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'SQL query required for query operation'
      );
    });

    it('should reject non-SELECT queries when in read-only mode', async () => {
      const readOnlyHandler = new PostgreSQLHandler({ readOnly: true });

      const params: MCPParams = {
        service: 'postgres',
        operation: 'query',
        database: 'kids-ascension',
        args: ['DELETE FROM users WHERE id = 1'],
      };

      await expect(readOnlyHandler.execute(params)).rejects.toThrow(ValidationError);
      await expect(readOnlyHandler.execute(params)).rejects.toThrow(/read-only mode/);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockFailedConnection();

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      await expect(handler.execute(params)).rejects.toThrow('Connection failed');
    });

    it('should include error details in response', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockRejectedValue(new Error('Query syntax error'));

      const params: MCPParams = {
        service: 'postgres',
        operation: 'query',
        database: 'kids-ascension',
        args: ['SELECT * FROM nonexistent_table'],
      };

      try {
        await handler.execute(params);
      } catch (error: any) {
        expect(error.message).toContain('Query syntax error');
      }
    });
  });

  describe('Metrics and Metadata', () => {
    it('should include execution time in metadata', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('executionTime');
      expect(typeof result.metadata.executionTime).toBe('number');
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should include token usage and cost in metadata', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('tokensUsed');
      expect(result.metadata).toHaveProperty('cost');
      expect(typeof result.metadata.tokensUsed).toBe('number');
      expect(typeof result.metadata.cost).toBe('number');
    });
  });

  describe('Connection Pool Management', () => {
    it('should return connection to pool after operation', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockResolvedValue(mockTableListResult);

      const params: MCPParams = {
        service: 'postgres',
        operation: 'list-tables',
        database: 'kids-ascension',
      };

      await handler.execute(params);

      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should release connection even on error', async () => {
      mockSuccessfulConnection();
      mockClient.query.mockRejectedValue(new Error('Query error'));

      const params: MCPParams = {
        service: 'postgres',
        operation: 'query',
        database: 'kids-ascension',
        args: ['SELECT * FROM users'],
      };

      try {
        await handler.execute(params);
      } catch (error) {
        // Expected error
      }

      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
