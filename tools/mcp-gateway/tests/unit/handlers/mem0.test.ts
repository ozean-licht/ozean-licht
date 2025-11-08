/**
 * Unit Tests for Mem0 MCP Handler
 */

import { Mem0Handler } from '../../../src/mcp/handlers/mem0';
import { MCPParams } from '../../../src/mcp/protocol/types';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../../src/utils/errors';
import {
  mockAxios,
  mockMem0Response,
  resetHttpMocks,
  mockSuccessfulHttp,
  mockFailedHttp,
  mockNetworkTimeout,
} from '../../mocks/http-client';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxios),
  isAxiosError: jest.fn((error) => error.isAxiosError === true),
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
  recordMCPOperation: jest.fn(),
  recordTokenUsage: jest.fn(),
}));

// Mock environment config
jest.mock('../../../config/environment', () => ({
  config: {
    HTTP_TIMEOUT_MS: 30000,
  },
  serviceUrls: {
    mem0: 'http://localhost:8090',
  },
}));

describe('Mem0Handler', () => {
  let handler: Mem0Handler;

  beforeEach(() => {
    resetHttpMocks();
    handler = new Mem0Handler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default base URL', () => {
      expect(handler).toBeDefined();
      expect(mockAxios.create).toHaveBeenCalled();
    });

    it('should accept custom base URL', () => {
      const customHandler = new Mem0Handler('http://custom-mem0.example.com');
      expect(customHandler).toBeDefined();
    });

    it('should set up request and response interceptors', () => {
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('remember/add/store Operations', () => {
    it('should add memory with content', async () => {
      mockAxios.post.mockResolvedValue({
        data: mockMem0Response.data,
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory content'],
        options: {
          user_id: 'test-user',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/memory/add',
        expect.objectContaining({
          user_id: 'test-user',
          content: 'Test memory content',
        })
      );
    });

    it('should use default user_id if not provided', async () => {
      mockAxios.post.mockResolvedValue({
        data: mockMem0Response.data,
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'add',
        args: ['Test memory'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/memory/add',
        expect.objectContaining({
          user_id: 'default',
          content: 'Test memory',
        })
      );
    });

    it('should throw ValidationError when content is missing', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Content required for remember operation'
      );
    });

    it('should handle alias operations (add, store)', async () => {
      mockAxios.post.mockResolvedValue({
        data: mockMem0Response.data,
      });

      const operations = ['remember', 'add', 'store'];

      for (const operation of operations) {
        const params: MCPParams = {
          service: 'mem0',
          operation,
          args: ['Test content'],
        };

        await expect(handler.execute(params)).resolves.not.toThrow();
      }
    });

    it('should include metadata in memory', async () => {
      mockAxios.post.mockResolvedValue({
        data: mockMem0Response.data,
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
        options: {
          user_id: 'test-user',
          metadata: {
            category: 'test',
            priority: 'high',
          },
        },
      };

      await handler.execute(params);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/memory/add',
        expect.objectContaining({
          metadata: expect.objectContaining({
            category: 'test',
            priority: 'high',
            source: 'mcp-gateway',
          }),
        })
      );
    });
  });

  describe('search/query Operations', () => {
    it('should search memories by query', async () => {
      const searchResults = {
        data: {
          results: [
            {
              id: 'mem-1',
              content: 'Matching memory',
              score: 0.95,
            },
          ],
          total: 1,
        },
      };

      mockAxios.post.mockResolvedValue(searchResults);

      const params: MCPParams = {
        service: 'mem0',
        operation: 'search',
        args: ['test query'],
        options: {
          user_id: 'test-user',
          limit: 10,
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/memory/search',
        expect.objectContaining({
          query: 'test query',
          user_id: 'test-user',
          limit: 10,
        })
      );
    });

    it('should throw ValidationError when query is missing', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'search',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Query required for search operation'
      );
    });

    it('should handle alias operations (query)', async () => {
      mockAxios.post.mockResolvedValue({ data: { results: [] } });

      const operations = ['search', 'query'];

      for (const operation of operations) {
        const params: MCPParams = {
          service: 'mem0',
          operation,
          args: ['test query'],
        };

        await expect(handler.execute(params)).resolves.not.toThrow();
      }
    });
  });

  describe('get-context/get-memories Operations', () => {
    it('should get memories for a user', async () => {
      const memories = {
        data: {
          memories: [
            { id: 'mem-1', content: 'Memory 1' },
            { id: 'mem-2', content: 'Memory 2' },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(memories);

      const params: MCPParams = {
        service: 'mem0',
        operation: 'get-context',
        args: ['test-user'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/memory/user/test-user',
        expect.any(Object)
      );
    });

    it('should accept user_id from options', async () => {
      mockAxios.get.mockResolvedValue({ data: { memories: [] } });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'get-memories',
        options: {
          user_id: 'option-user',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/memory/user/option-user',
        expect.any(Object)
      );
    });

    it('should throw ValidationError when user_id is missing', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'get-context',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'User ID required for get-context operation'
      );
    });
  });

  describe('delete/remove Operations', () => {
    it('should delete a memory by ID', async () => {
      mockAxios.delete.mockResolvedValue({
        data: { success: true, message: 'Memory deleted' },
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'delete',
        args: ['mem-123'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.delete).toHaveBeenCalledWith('/memory/mem-123');
    });

    it('should throw ValidationError when memory ID is missing', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'delete',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Memory ID required for delete operation'
      );
    });

    it('should handle alias operations (remove)', async () => {
      mockAxios.delete.mockResolvedValue({ data: { success: true } });

      const operations = ['delete', 'remove'];

      for (const operation of operations) {
        const params: MCPParams = {
          service: 'mem0',
          operation,
          args: ['mem-123'],
        };

        await expect(handler.execute(params)).resolves.not.toThrow();
      }
    });
  });

  describe('update Operation', () => {
    it('should update a memory', async () => {
      mockAxios.put.mockResolvedValue({
        data: { success: true, memory: { id: 'mem-123', content: 'Updated content' } },
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'update',
        args: ['mem-123', 'Updated content'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.put).toHaveBeenCalledWith(
        '/memory/mem-123',
        expect.objectContaining({
          content: 'Updated content',
        })
      );
    });

    it('should throw ValidationError when ID or content is missing', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'update',
        args: ['mem-123'], // Missing new content
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow(
        'Memory ID and new content required for update operation'
      );
    });
  });

  describe('list/list-all Operations', () => {
    it('should list all memories', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          memories: [
            { id: 'mem-1', content: 'Memory 1' },
            { id: 'mem-2', content: 'Memory 2' },
          ],
          total: 2,
        },
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'list',
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/memory/list',
        expect.any(Object)
      );
    });

    it('should pass options for pagination', async () => {
      mockAxios.get.mockResolvedValue({ data: { memories: [], total: 0 } });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'list-all',
        options: {
          limit: 50,
          offset: 10,
        },
      };

      await handler.execute(params);

      expect(mockAxios.get).toHaveBeenCalledWith(
        '/memory/list',
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 50,
            offset: 10,
          }),
        })
      );
    });
  });

  describe('health/test Operations', () => {
    it('should check health status', async () => {
      mockAxios.get.mockResolvedValue({
        data: { status: 'healthy', version: '1.0.0' },
      });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'health',
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(mockAxios.get).toHaveBeenCalledWith('/health');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 not found errors', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Memory not found' },
        },
      };

      mockAxios.get.mockRejectedValue(axiosError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'mem0',
        operation: 'get-context',
        args: ['nonexistent-user'],
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow('Memory not found');
    });

    it('should handle 500 server errors', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      mockAxios.post.mockRejectedValue(axiosError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      await expect(handler.execute(params)).rejects.toThrow(ServiceUnavailableError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'Timeout error',
      };

      mockAxios.post.mockRejectedValue(timeoutError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      // Timeout should be caught in interceptor
      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should throw ValidationError for unknown operations', async () => {
      const params: MCPParams = {
        service: 'mem0',
        operation: 'invalid-operation',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      await expect(handler.execute(params)).rejects.toThrow('Unknown operation');
    });
  });

  describe('Metrics and Metadata', () => {
    it('should include execution time in metadata', async () => {
      mockAxios.post.mockResolvedValue({ data: mockMem0Response.data });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('executionTime');
      expect(typeof result.metadata.executionTime).toBe('number');
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should include token usage and cost in metadata', async () => {
      mockAxios.post.mockResolvedValue({ data: mockMem0Response.data });

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('tokensUsed', 200);
      expect(result.metadata).toHaveProperty('cost', 0.0006);
      expect(result.metadata).toHaveProperty('service', 'mem0');
    });

    it('should record successful operations to metrics', async () => {
      mockAxios.post.mockResolvedValue({ data: mockMem0Response.data });

      const { recordMCPOperation, recordTokenUsage } = require('../../../src/monitoring/metrics');

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      await handler.execute(params);

      expect(recordMCPOperation).toHaveBeenCalledWith(
        'mem0',
        'remember',
        expect.any(Number),
        'success'
      );
      expect(recordTokenUsage).toHaveBeenCalledWith('mem0', 'remember', 200);
    });

    it('should record failed operations to metrics', async () => {
      mockAxios.post.mockRejectedValue(new Error('Test error'));

      const { recordMCPOperation } = require('../../../src/monitoring/metrics');

      const params: MCPParams = {
        service: 'mem0',
        operation: 'remember',
        args: ['Test memory'],
      };

      try {
        await handler.execute(params);
      } catch (error) {
        // Expected error
      }

      expect(recordMCPOperation).toHaveBeenCalledWith(
        'mem0',
        'remember',
        expect.any(Number),
        'error'
      );
    });
  });
});
