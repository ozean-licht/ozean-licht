/**
 * Unit Tests for N8N MCP Handler
 */

import { N8NHandler } from '../../../src/mcp/handlers/n8n';
import { MCPParams } from '../../../src/mcp/protocol/types';
import { ValidationError, ServiceUnavailableError } from '../../../src/utils/errors';
import { mockAxios, mockN8NWorkflowsResponse, resetHttpMocks } from '../../mocks/http-client';

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

// Mock environment
jest.mock('../../../config/environment', () => ({
  config: {
    N8N_API_KEY: 'test-n8n-api-key',
    HTTP_TIMEOUT_MS: 30000,
  },
  serviceUrls: {
    n8n: 'http://localhost:5678',
  },
}));

describe('N8NHandler', () => {
  let handler: N8NHandler;

  beforeEach(() => {
    resetHttpMocks();
    handler = new N8NHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with API key', () => {
      expect(handler).toBeDefined();
      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:5678',
          headers: expect.objectContaining({
            'X-N8N-API-KEY': 'test-n8n-api-key',
          }),
        })
      );
    });

    it('should set up request and response interceptors', () => {
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Workflow Operations', () => {
    describe('execute-workflow/execute/run', () => {
      it('should execute a workflow', async () => {
        mockAxios.post.mockResolvedValue({
          data: {
            data: {
              executionId: 'exec-123',
              finished: false,
              mode: 'manual',
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'execute-workflow',
          args: ['workflow-123'],
          options: {
            data: { input: 'test data' },
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.data.executionId).toBe('exec-123');
      });

      it('should throw ValidationError when workflow ID is missing', async () => {
        const params: MCPParams = {
          service: 'n8n',
          operation: 'execute',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });

      it('should handle alias operations (run)', async () => {
        mockAxios.post.mockResolvedValue({
          data: { data: { executionId: 'exec-123' } },
        });

        const operations = ['execute', 'execute-workflow', 'run'];

        for (const operation of operations) {
          const params: MCPParams = {
            service: 'n8n',
            operation,
            args: ['workflow-123'],
          };

          await expect(handler.execute(params)).resolves.not.toThrow();
        }
      });
    });

    describe('list-workflows/list', () => {
      it('should list all workflows', async () => {
        mockAxios.get.mockResolvedValue(mockN8NWorkflowsResponse);

        const params: MCPParams = {
          service: 'n8n',
          operation: 'list-workflows',
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.data).toBeDefined();
      });

      it('should accept filter options', async () => {
        mockAxios.get.mockResolvedValue({ data: { data: [] } });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'list',
          options: {
            active: true,
            limit: 50,
          },
        };

        await handler.execute(params);

        expect(mockAxios.get).toHaveBeenCalledWith(
          '/workflows',
          expect.objectContaining({
            params: expect.objectContaining({
              active: true,
              limit: 50,
            }),
          })
        );
      });
    });

    describe('get-workflow/get', () => {
      it('should get workflow details', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            data: {
              id: 'workflow-123',
              name: 'Test Workflow',
              active: true,
              nodes: [],
              connections: {},
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'get-workflow',
          args: ['workflow-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.data.id).toBe('workflow-123');
      });

      it('should throw ValidationError when workflow ID is missing', async () => {
        const params: MCPParams = {
          service: 'n8n',
          operation: 'get',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('activate', () => {
      it('should activate a workflow', async () => {
        mockAxios.patch.mockResolvedValue({
          data: {
            data: {
              id: 'workflow-123',
              active: true,
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'activate',
          args: ['workflow-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.patch).toHaveBeenCalledWith(
          '/workflows/workflow-123',
          expect.objectContaining({
            active: true,
          })
        );
      });

      it('should throw ValidationError when workflow ID is missing', async () => {
        const params: MCPParams = {
          service: 'n8n',
          operation: 'activate',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('deactivate', () => {
      it('should deactivate a workflow', async () => {
        mockAxios.patch.mockResolvedValue({
          data: {
            data: {
              id: 'workflow-123',
              active: false,
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'deactivate',
          args: ['workflow-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.patch).toHaveBeenCalledWith(
          '/workflows/workflow-123',
          expect.objectContaining({
            active: false,
          })
        );
      });
    });
  });

  describe('Execution Operations', () => {
    describe('get-execution', () => {
      it('should get execution details', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            data: {
              id: 'exec-123',
              finished: true,
              mode: 'manual',
              startedAt: '2025-10-23T10:00:00.000Z',
              stoppedAt: '2025-10-23T10:00:05.000Z',
              data: {
                resultData: {
                  runData: {},
                },
              },
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'get-execution',
          args: ['exec-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.data.id).toBe('exec-123');
      });

      it('should throw ValidationError when execution ID is missing', async () => {
        const params: MCPParams = {
          service: 'n8n',
          operation: 'get-execution',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('list-executions', () => {
      it('should list executions for a workflow', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            data: [
              { id: 'exec-1', finished: true },
              { id: 'exec-2', finished: false },
            ],
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'list-executions',
          options: {
            workflowId: 'workflow-123',
            limit: 10,
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.data).toHaveLength(2);
      });

      it('should accept pagination options', async () => {
        mockAxios.get.mockResolvedValue({ data: { data: [] } });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'list-executions',
          options: {
            limit: 50,
            offset: 10,
          },
        };

        await handler.execute(params);

        expect(mockAxios.get).toHaveBeenCalledWith(
          '/executions',
          expect.objectContaining({
            params: expect.objectContaining({
              limit: 50,
              offset: 10,
            }),
          })
        );
      });
    });

    describe('retry-execution', () => {
      it('should retry a failed execution', async () => {
        mockAxios.post.mockResolvedValue({
          data: {
            data: {
              executionId: 'exec-new',
              finished: false,
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'retry-execution',
          args: ['exec-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.post).toHaveBeenCalledWith('/executions/exec-123/retry');
      });

      it('should throw ValidationError when execution ID is missing', async () => {
        const params: MCPParams = {
          service: 'n8n',
          operation: 'retry-execution',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('delete-execution', () => {
      it('should delete an execution', async () => {
        mockAxios.delete.mockResolvedValue({
          data: {
            data: {
              success: true,
            },
          },
        });

        const params: MCPParams = {
          service: 'n8n',
          operation: 'delete-execution',
          args: ['exec-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.delete).toHaveBeenCalledWith('/executions/exec-123');
      });
    });
  });

  describe('Webhook Operations', () => {
    it('should list webhooks', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          data: [
            {
              workflowId: 'workflow-123',
              path: 'webhook-path',
              method: 'POST',
            },
          ],
        },
      });

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-webhooks',
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.data).toBeDefined();
    });

    it('should handle alias operation (webhooks)', async () => {
      mockAxios.get.mockResolvedValue({ data: { data: [] } });

      const operations = ['webhooks', 'list-webhooks'];

      for (const operation of operations) {
        const params: MCPParams = {
          service: 'n8n',
          operation,
        };

        await expect(handler.execute(params)).resolves.not.toThrow();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle N8N API errors', async () => {
      const apiError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'Workflow not found',
          },
        },
      };

      mockAxios.get.mockRejectedValue(apiError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'n8n',
        operation: 'get-workflow',
        args: ['nonexistent'],
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should handle 500 server errors', async () => {
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      mockAxios.get.mockRejectedValue(serverError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-workflows',
      };

      await expect(handler.execute(params)).rejects.toThrow(ServiceUnavailableError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'Timeout',
      };

      mockAxios.post.mockRejectedValue(timeoutError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'n8n',
        operation: 'execute-workflow',
        args: ['workflow-123'],
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should throw ValidationError for unknown operations', async () => {
      const params: MCPParams = {
        service: 'n8n',
        operation: 'invalid-operation',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('Metrics and Metadata', () => {
    it('should include execution time in metadata', async () => {
      mockAxios.get.mockResolvedValue(mockN8NWorkflowsResponse);

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-workflows',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('executionTime');
      expect(typeof result.metadata.executionTime).toBe('number');
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should include token usage and cost in metadata', async () => {
      mockAxios.get.mockResolvedValue(mockN8NWorkflowsResponse);

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-workflows',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('tokensUsed', 250);
      expect(result.metadata).toHaveProperty('cost', 0.0008);
      expect(result.metadata).toHaveProperty('service', 'n8n');
    });

    it('should record operations to metrics', async () => {
      mockAxios.get.mockResolvedValue(mockN8NWorkflowsResponse);

      const { recordMCPOperation, recordTokenUsage } = require('../../../src/monitoring/metrics');

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-workflows',
      };

      await handler.execute(params);

      expect(recordMCPOperation).toHaveBeenCalledWith(
        'n8n',
        'list-workflows',
        expect.any(Number),
        'success'
      );
      expect(recordTokenUsage).toHaveBeenCalledWith('n8n', 'list-workflows', 250);
    });

    it('should record failed operations to metrics', async () => {
      mockAxios.get.mockRejectedValue(new Error('Test error'));

      const { recordMCPOperation } = require('../../../src/monitoring/metrics');

      const params: MCPParams = {
        service: 'n8n',
        operation: 'list-workflows',
      };

      try {
        await handler.execute(params);
      } catch (error) {
        // Expected error
      }

      expect(recordMCPOperation).toHaveBeenCalledWith(
        'n8n',
        'list-workflows',
        expect.any(Number),
        'error'
      );
    });
  });

  describe('Data Handling', () => {
    it('should pass execution data to workflow', async () => {
      mockAxios.post.mockResolvedValue({
        data: { data: { executionId: 'exec-123' } },
      });

      const executionData = {
        email: 'test@example.com',
        payload: { key: 'value' },
      };

      const params: MCPParams = {
        service: 'n8n',
        operation: 'execute-workflow',
        args: ['workflow-123'],
        options: {
          data: executionData,
        },
      };

      await handler.execute(params);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/workflows/workflow-123/execute',
        expect.objectContaining({
          data: executionData,
        })
      );
    });

    it('should handle empty execution data', async () => {
      mockAxios.post.mockResolvedValue({
        data: { data: { executionId: 'exec-123' } },
      });

      const params: MCPParams = {
        service: 'n8n',
        operation: 'execute-workflow',
        args: ['workflow-123'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
    });
  });
});
