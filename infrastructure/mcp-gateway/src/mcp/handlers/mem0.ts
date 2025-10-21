import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config, serviceUrls } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface Mem0Memory {
  id?: string;
  user_id: string;
  content: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface Mem0SearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export class Mem0Handler implements MCPHandler {
  private client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || serviceUrls.mem0;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.HTTP_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MCP-Gateway/1.0.0',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Mem0 API request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Mem0 request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Mem0 API response', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('Mem0 request timed out');
        }
        if (error.response) {
          logger.error('Mem0 API error response', {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          logger.error('Mem0 connection error', { error: error.message });
        }
        return Promise.reject(error);
      }
    );
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (params.operation) {
        case 'remember':
        case 'add':
        case 'store':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Content required for remember operation');
          }
          result = await this.addMemory(params.args[0], params.options);
          break;

        case 'search':
        case 'query':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Query required for search operation');
          }
          result = await this.searchMemories(params.args[0], params.options);
          break;

        case 'get-context':
        case 'get-memories':
          const userId = params.args?.[0] || params.options?.user_id;
          if (!userId) {
            throw new ValidationError('User ID required for get-context operation');
          }
          result = await this.getMemories(userId, params.options);
          break;

        case 'delete':
        case 'remove':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Memory ID required for delete operation');
          }
          result = await this.deleteMemory(params.args[0]);
          break;

        case 'update':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Memory ID and new content required for update operation');
          }
          result = await this.updateMemory(params.args[0], params.args[1], params.options);
          break;

        case 'list':
        case 'list-all':
          result = await this.listMemories(params.options);
          break;

        case 'health':
        case 'test':
          result = await this.checkHealth();
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('mem0', params.operation, duration, 'success');
      recordTokenUsage('mem0', params.operation, 200); // Estimated tokens

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 200,
          cost: 0.0006,
          service: 'mem0',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('mem0', params.operation, duration, 'error');

      logger.error('Mem0 operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new ValidationError('Memory not found');
        }
        if (error.response?.status >= 500) {
          throw new ServiceUnavailableError('mem0', error.response?.data?.message || error.message);
        }
        throw new ValidationError(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  private async addMemory(content: string, options?: any): Promise<any> {
    const userId = options?.user_id || options?.agent_id || 'default';

    const memory: Mem0Memory = {
      user_id: userId,
      content,
      metadata: {
        ...options?.metadata,
        source: 'mcp-gateway',
        timestamp: new Date().toISOString(),
      },
    };

    const response = await this.client.post('/memory/add', memory);

    return {
      operation: 'memory_added',
      memory: {
        id: response.data.id,
        user_id: userId,
        content: content,
        metadata: memory.metadata,
      },
      message: 'Memory successfully stored',
    };
  }

  private async searchMemories(query: string, options?: any): Promise<any> {
    const params = {
      query,
      user_id: options?.user_id || options?.agent_id,
      limit: options?.limit || 10,
      threshold: options?.threshold || 0.7,
    };

    const response = await this.client.post('/memory/search', params);

    const results: Mem0SearchResult[] = response.data.results || response.data || [];

    return {
      operation: 'memory_search',
      query,
      resultCount: results.length,
      results: results.map((r: Mem0SearchResult) => ({
        id: r.id,
        content: r.content,
        relevance: r.score,
        metadata: r.metadata,
      })),
    };
  }

  private async getMemories(userId: string, options?: any): Promise<any> {
    const params = {
      user_id: userId,
      limit: options?.limit || 50,
    };

    const response = await this.client.post('/memory/get', params);

    const memories = response.data.memories || response.data || [];

    return {
      operation: 'get_memories',
      user_id: userId,
      memoryCount: memories.length,
      memories: memories.map((m: Mem0Memory) => ({
        id: m.id,
        content: m.content,
        metadata: m.metadata,
        created_at: m.created_at,
        updated_at: m.updated_at,
      })),
    };
  }

  private async deleteMemory(memoryId: string): Promise<any> {
    const response = await this.client.delete(`/memory/${memoryId}`);

    return {
      operation: 'memory_deleted',
      memory_id: memoryId,
      message: 'Memory successfully deleted',
      status: response.data.status || 'success',
    };
  }

  private async updateMemory(memoryId: string, newContent: string, options?: any): Promise<any> {
    const updateData = {
      content: newContent,
      metadata: {
        ...options?.metadata,
        updated_by: 'mcp-gateway',
        updated_at: new Date().toISOString(),
      },
    };

    const response = await this.client.put(`/memory/${memoryId}`, updateData);

    return {
      operation: 'memory_updated',
      memory_id: memoryId,
      content: newContent,
      message: 'Memory successfully updated',
      metadata: updateData.metadata,
    };
  }

  private async listMemories(options?: any): Promise<any> {
    const params = {
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      user_id: options?.user_id,
    };

    const response = await this.client.post('/memory/list', params);

    const memories = response.data.memories || response.data || [];

    return {
      operation: 'list_memories',
      total: memories.length,
      limit: params.limit,
      offset: params.offset,
      memories: memories.map((m: Mem0Memory) => ({
        id: m.id,
        user_id: m.user_id,
        content: m.content.substring(0, 100) + (m.content.length > 100 ? '...' : ''),
        metadata: m.metadata,
        created_at: m.created_at,
      })),
    };
  }

  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();
      const response = await this.client.get('/health');
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'mem0',
        endpoint: this.baseUrl,
        latency: `${latency}ms`,
        qdrant: response.data.qdrant || 'connected',
        version: response.data.version || 'unknown',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'mem0',
        endpoint: this.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  public validateParams(params: MCPParams): void {
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
        name: 'remember',
        description: 'Store a new memory',
        parameters: [
          {
            name: 'content',
            type: 'string',
            description: 'Content to remember',
            required: true,
          },
          {
            name: 'user_id',
            type: 'string',
            description: 'User or agent ID',
            required: false,
            default: 'default',
          },
          {
            name: 'metadata',
            type: 'object',
            description: 'Additional metadata',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'search',
        description: 'Search memories using semantic search',
        parameters: [
          {
            name: 'query',
            type: 'string',
            description: 'Search query',
            required: true,
          },
          {
            name: 'user_id',
            type: 'string',
            description: 'Filter by user ID',
            required: false,
          },
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum results',
            required: false,
            default: 10,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'get-context',
        description: 'Get all memories for a specific user',
        parameters: [
          {
            name: 'user_id',
            type: 'string',
            description: 'User or agent ID',
            required: true,
          },
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum memories to retrieve',
            required: false,
            default: 50,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'delete',
        description: 'Delete a memory by ID',
        parameters: [
          {
            name: 'memory_id',
            type: 'string',
            description: 'Memory ID to delete',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 100,
      },
      {
        name: 'update',
        description: 'Update an existing memory',
        parameters: [
          {
            name: 'memory_id',
            type: 'string',
            description: 'Memory ID to update',
            required: true,
          },
          {
            name: 'content',
            type: 'string',
            description: 'New content',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'list',
        description: 'List all memories with pagination',
        parameters: [
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum memories per page',
            required: false,
            default: 100,
          },
          {
            name: 'offset',
            type: 'number',
            description: 'Pagination offset',
            required: false,
            default: 0,
          },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'health',
        description: 'Check Mem0 service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Mem0 handler...');
    // No persistent connections to close for HTTP client
  }
}