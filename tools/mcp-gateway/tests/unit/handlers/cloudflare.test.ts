/**
 * Unit Tests for Cloudflare MCP Handler
 */

import { CloudflareHandler } from '../../../src/mcp/handlers/cloudflare';
import { MCPParams } from '../../../src/mcp/protocol/types';
import { ValidationError, ServiceUnavailableError } from '../../../src/utils/errors';
import {
  mockAxios,
  mockCloudflareZonesResponse,
  resetHttpMocks,
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
    CLOUDFLARE_API_TOKEN: 'test-token',
    CLOUDFLARE_ACCOUNT_ID: 'test-account-id',
    CLOUDFLARE_ZONE_ID: 'test-zone-id',
    HTTP_TIMEOUT_MS: 30000,
  },
}));

describe('CloudflareHandler', () => {
  let handler: CloudflareHandler;

  beforeEach(() => {
    resetHttpMocks();
    handler = new CloudflareHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with API credentials', () => {
      expect(handler).toBeDefined();
      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.cloudflare.com/client/v4',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should set up request and response interceptors', () => {
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Stream Operations', () => {
    describe('upload-video/stream-upload', () => {
      it('should upload video via URL', async () => {
        mockAxios.post.mockResolvedValue({
          data: {
            success: true,
            result: {
              uid: 'video-123',
              status: { state: 'queued' },
            },
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'upload-video',
          args: ['https://example.com/video.mp4'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result.uid).toBe('video-123');
        expect(mockAxios.post).toHaveBeenCalled();
      });

      it('should throw ValidationError when URL is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'stream-upload',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('list-videos/stream-list', () => {
      it('should list all videos', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            success: true,
            result: [
              { uid: 'video-1', status: { state: 'ready' } },
              { uid: 'video-2', status: { state: 'queued' } },
            ],
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'list-videos',
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result).toHaveLength(2);
      });
    });

    describe('get-video/stream-get', () => {
      it('should get video by ID', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            success: true,
            result: {
              uid: 'video-123',
              status: { state: 'ready' },
              duration: 120,
            },
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'get-video',
          args: ['video-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result.uid).toBe('video-123');
      });

      it('should throw ValidationError when video ID is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'stream-get',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('delete-video/stream-delete', () => {
      it('should delete video by ID', async () => {
        mockAxios.delete.mockResolvedValue({
          data: {
            success: true,
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'delete-video',
          args: ['video-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.delete).toHaveBeenCalled();
      });
    });
  });

  describe('DNS Operations', () => {
    describe('list-dns-records/dns-list', () => {
      it('should list DNS records for a zone', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            success: true,
            result: [
              {
                id: 'record-1',
                type: 'A',
                name: 'example.com',
                content: '192.0.2.1',
                proxied: true,
              },
              {
                id: 'record-2',
                type: 'CNAME',
                name: 'www.example.com',
                content: 'example.com',
                proxied: true,
              },
            ],
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'list-dns-records',
          args: ['zone-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result).toHaveLength(2);
      });

      it('should throw ValidationError when zone ID is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'dns-list',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('create-dns-record/dns-create', () => {
      it('should create DNS record', async () => {
        mockAxios.post.mockResolvedValue({
          data: {
            success: true,
            result: {
              id: 'record-new',
              type: 'A',
              name: 'new.example.com',
              content: '192.0.2.2',
            },
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'create-dns-record',
          args: ['zone-123'],
          options: {
            type: 'A',
            name: 'new.example.com',
            content: '192.0.2.2',
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result.id).toBe('record-new');
      });

      it('should throw ValidationError when zone ID is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'dns-create',
          options: { type: 'A', name: 'test', content: '1.2.3.4' },
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('update-dns-record/dns-update', () => {
      it('should update DNS record', async () => {
        mockAxios.put.mockResolvedValue({
          data: {
            success: true,
            result: {
              id: 'record-123',
              type: 'A',
              content: '192.0.2.3',
            },
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'update-dns-record',
          args: ['zone-123', 'record-123'],
          options: {
            content: '192.0.2.3',
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.put).toHaveBeenCalled();
      });

      it('should throw ValidationError when zone or record ID is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'dns-update',
          args: ['zone-123'], // Missing record ID
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('delete-dns-record/dns-delete', () => {
      it('should delete DNS record', async () => {
        mockAxios.delete.mockResolvedValue({
          data: {
            success: true,
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'delete-dns-record',
          args: ['zone-123', 'record-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockAxios.delete).toHaveBeenCalled();
      });
    });
  });

  describe('Zone Operations', () => {
    describe('list-zones', () => {
      it('should list all zones', async () => {
        mockAxios.get.mockResolvedValue(mockCloudflareZonesResponse);

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'list-zones',
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result).toBeDefined();
        expect(Array.isArray(result.data.result)).toBe(true);
      });
    });

    describe('get-zone', () => {
      it('should get zone details by ID', async () => {
        mockAxios.get.mockResolvedValue({
          data: {
            success: true,
            result: {
              id: 'zone-123',
              name: 'example.com',
              status: 'active',
            },
          },
        });

        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'get-zone',
          args: ['zone-123'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.result.id).toBe('zone-123');
      });

      it('should throw ValidationError when zone ID is missing', async () => {
        const params: MCPParams = {
          service: 'cloudflare',
          operation: 'get-zone',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });
  });

  describe('Analytics Operations', () => {
    it('should get analytics data', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          success: true,
          result: {
            totals: {
              requests: { all: 10000 },
              bandwidth: { all: 5000000 },
            },
          },
        },
      });

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'get-analytics',
        args: ['zone-123'],
        options: {
          since: '2025-10-01',
          until: '2025-10-23',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.result.totals).toBeDefined();
    });

    it('should throw ValidationError when zone ID is missing', async () => {
      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'get-analytics',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('Health Check', () => {
    it('should perform health check', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          success: true,
          result: { status: 'operational' },
        },
      });

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'health',
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
    });
  });

  describe('Error Handling', () => {
    it('should handle Cloudflare API errors', async () => {
      const apiError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            success: false,
            errors: [{ message: 'Invalid zone ID' }],
          },
        },
      };

      mockAxios.get.mockRejectedValue(apiError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'get-zone',
        args: ['invalid-zone'],
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should handle 500 server errors', async () => {
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { errors: [{ message: 'Internal server error' }] },
        },
      };

      mockAxios.get.mockRejectedValue(serverError);
      require('axios').isAxiosError.mockReturnValue(true);

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'list-zones',
      };

      await expect(handler.execute(params)).rejects.toThrow(ServiceUnavailableError);
    });

    it('should throw ValidationError for unknown operations', async () => {
      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'invalid-operation',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('Metrics and Metadata', () => {
    it('should include execution time in metadata', async () => {
      mockAxios.get.mockResolvedValue(mockCloudflareZonesResponse);

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'list-zones',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('executionTime');
      expect(typeof result.metadata.executionTime).toBe('number');
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should include token usage and cost in metadata', async () => {
      mockAxios.get.mockResolvedValue(mockCloudflareZonesResponse);

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'list-zones',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('tokensUsed', 300);
      expect(result.metadata).toHaveProperty('cost', 0.0009);
      expect(result.metadata).toHaveProperty('service', 'cloudflare');
    });

    it('should record operations to metrics', async () => {
      mockAxios.get.mockResolvedValue(mockCloudflareZonesResponse);

      const { recordMCPOperation, recordTokenUsage } = require('../../../src/monitoring/metrics');

      const params: MCPParams = {
        service: 'cloudflare',
        operation: 'list-zones',
      };

      await handler.execute(params);

      expect(recordMCPOperation).toHaveBeenCalledWith(
        'cloudflare',
        'list-zones',
        expect.any(Number),
        'success'
      );
      expect(recordTokenUsage).toHaveBeenCalledWith('cloudflare', 'list-zones', 300);
    });
  });

  describe('Operation Aliases', () => {
    it('should handle stream operation aliases', async () => {
      mockAxios.get.mockResolvedValue({ data: { success: true, result: [] } });

      const aliases = [
        ['stream-list', 'list-videos'],
        ['stream-get', 'get-video'],
        ['stream-delete', 'delete-video'],
        ['stream-upload', 'upload-video'],
      ];

      for (const [alias1, alias2] of aliases) {
        const params1: MCPParams = {
          service: 'cloudflare',
          operation: alias1,
          args: ['test-id'],
        };

        const params2: MCPParams = {
          service: 'cloudflare',
          operation: alias2,
          args: ['test-id'],
        };

        // Both aliases should work
        if (alias1.includes('upload')) {
          mockAxios.post.mockResolvedValue({ data: { success: true, result: {} } });
        }
        await expect(handler.execute(params1)).resolves.toBeDefined();
        await expect(handler.execute(params2)).resolves.toBeDefined();
      }
    });

    it('should handle DNS operation aliases', async () => {
      mockAxios.get.mockResolvedValue({ data: { success: true, result: [] } });

      const aliases = [
        ['dns-list', 'list-dns-records'],
        ['dns-create', 'create-dns-record'],
        ['dns-update', 'update-dns-record'],
        ['dns-delete', 'delete-dns-record'],
      ];

      for (const [alias1, alias2] of aliases) {
        const params1: MCPParams = {
          service: 'cloudflare',
          operation: alias1,
          args: ['zone-id', 'record-id'],
          options: { type: 'A', name: 'test', content: '1.2.3.4' },
        };

        const params2: MCPParams = {
          service: 'cloudflare',
          operation: alias2,
          args: ['zone-id', 'record-id'],
          options: { type: 'A', name: 'test', content: '1.2.3.4' },
        };

        // Set up mocks for create/update/delete operations
        if (alias1.includes('create')) {
          mockAxios.post.mockResolvedValue({ data: { success: true, result: {} } });
        } else if (alias1.includes('update')) {
          mockAxios.put.mockResolvedValue({ data: { success: true, result: {} } });
        } else if (alias1.includes('delete')) {
          mockAxios.delete.mockResolvedValue({ data: { success: true } });
        }

        await expect(handler.execute(params1)).resolves.toBeDefined();
        await expect(handler.execute(params2)).resolves.toBeDefined();
      }
    });
  });
});
