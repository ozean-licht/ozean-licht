import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config, serviceUrls } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface Context7LibraryInfo {
  id: string;
  name: string;
  version?: string;
  supported: boolean;
  description?: string;
}

interface Context7Documentation {
  libraryId: string;
  version?: string;
  topic?: string;
  content: string;
  metadata?: {
    tokens: number;
    timestamp: string;
    [key: string]: any;
  };
}

export class Context7Handler implements MCPHandler {
  private client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || serviceUrls.context7 || 'https://mcp.context7.com/mcp';
    this.apiKey = apiKey || config.CONTEXT7_API_KEY;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'MCP-Gateway/1.0.0',
    };

    // Add API key if available (provides higher rate limits)
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      logger.info('Context7 initialized with API key for higher rate limits');
    } else {
      logger.info('Context7 initialized in free tier mode (public access)');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.HTTP_TIMEOUT_MS,
      headers,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Context7 API request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Context7 request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Context7 API response', {
          status: response.status,
          dataSize: JSON.stringify(response.data).length,
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('Context7 request timed out');
        }
        if (error.response) {
          logger.error('Context7 API error response', {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          logger.error('Context7 connection error', { error: error.message });
        }
        return Promise.reject(error);
      }
    );
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;
      let tokensUsed = 100; // Default token estimate

      switch (params.operation) {
        case 'resolve-library-id':
        case 'resolve':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Library name required for resolve-library-id operation');
          }
          result = await this.resolveLibraryId(params.args[0]);
          tokensUsed = 100;
          break;

        case 'get-library-docs':
        case 'get-docs':
        case 'docs':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Library ID required for get-library-docs operation');
          }
          result = await this.getLibraryDocs(
            params.args[0],
            params.options?.topic,
            params.options?.tokens
          );
          // Estimate tokens based on response size (roughly 4 chars per token)
          tokensUsed = Math.ceil(JSON.stringify(result).length / 4);
          break;

        case 'health':
        case 'test':
          result = await this.checkHealth();
          tokensUsed = 50;
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('context7', params.operation, duration, 'success');
      recordTokenUsage('context7', params.operation, tokensUsed);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed,
          cost: tokensUsed * 0.000003, // Estimated cost (roughly $0.003 per 1000 tokens)
          service: 'context7',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('context7', params.operation, duration, 'error');

      logger.error('Context7 operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new ValidationError('Library or documentation not found');
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new ValidationError('Authentication failed - check API key');
        }
        if (error.response?.status === 429) {
          throw new ValidationError('Rate limit exceeded - consider adding an API key for higher limits');
        }
        if (error.response && error.response.status >= 500) {
          throw new ServiceUnavailableError(
            'context7',
            error.response?.data?.error || error.message
          );
        }
        throw new ValidationError(error.response?.data?.error || error.message);
      }

      throw error;
    }
  }

  /**
   * Resolve a library name to a Context7-compatible library ID
   */
  private async resolveLibraryId(libraryName: string): Promise<any> {
    // Context7 MCP uses /mcp endpoint with JSON-RPC 2.0 format
    const response = await this.client.post('/mcp', {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'resolve-library-id',
        arguments: {
          libraryName: libraryName.trim(),
        },
      },
      id: Date.now(),
    });

    const libraryInfo: Context7LibraryInfo = response.data.content?.[0]?.text
      ? JSON.parse(response.data.content[0].text)
      : response.data;

    if (!libraryInfo.supported) {
      return {
        operation: 'resolve_library_id',
        libraryName,
        supported: false,
        message: `Library "${libraryName}" is not supported by Context7`,
        suggestion: 'Check https://context7.com/libraries for supported libraries',
      };
    }

    return {
      operation: 'resolve_library_id',
      libraryName,
      libraryId: libraryInfo.id,
      version: libraryInfo.version,
      supported: true,
      description: libraryInfo.description,
      message: `Successfully resolved library "${libraryName}" to ID: ${libraryInfo.id}`,
    };
  }

  /**
   * Fetch version-specific documentation for a library
   */
  private async getLibraryDocs(
    libraryId: string,
    topic?: string,
    tokenLimit?: number
  ): Promise<any> {
    const args: Record<string, any> = {
      libraryId: libraryId.trim(),
    };

    // Add optional parameters
    if (topic) {
      args.topic = topic.trim();
    }
    if (tokenLimit) {
      args.tokens = Math.min(Math.max(tokenLimit, 1000), 10000); // Clamp between 1k-10k
    } else {
      args.tokens = 5000; // Default token limit
    }

    // Context7 MCP uses /mcp endpoint with JSON-RPC 2.0 format
    const response = await this.client.post('/mcp', {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get-library-docs',
        arguments: args,
      },
      id: Date.now(),
    });

    const docsData: Context7Documentation = response.data.content?.[0]?.text
      ? JSON.parse(response.data.content[0].text)
      : response.data;

    return {
      operation: 'get_library_docs',
      libraryId,
      topic: topic || 'all',
      tokenLimit: args.tokens,
      documentation: docsData.content,
      metadata: {
        version: docsData.version,
        retrievedAt: new Date().toISOString(),
        contentLength: docsData.content.length,
        estimatedTokens: Math.ceil(docsData.content.length / 4),
        ...docsData.metadata,
      },
      message: topic
        ? `Retrieved documentation for ${libraryId} on topic: ${topic}`
        : `Retrieved full documentation for ${libraryId}`,
    };
  }

  /**
   * Check Context7 service health
   */
  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();

      // Test the service by resolving a common library
      const testResponse = await this.client.post('/mcp', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'resolve-library-id',
          arguments: {
            libraryName: 'react',
          },
        },
        id: Date.now(),
      });

      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'context7',
        endpoint: this.baseUrl,
        latency: `${latency}ms`,
        authenticated: !!this.apiKey,
        testResolution: testResponse.status === 200 ? 'passed' : 'failed',
        rateLimit: this.apiKey
          ? 'higher limits (API key active)'
          : 'free tier (~30 req/min)',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'context7',
        endpoint: this.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        authenticated: !!this.apiKey,
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
        name: 'resolve-library-id',
        description: 'Resolve a library name to a Context7-compatible identifier',
        parameters: [
          {
            name: 'libraryName',
            type: 'string',
            description: 'Name of the library (e.g., "react", "nextjs", "fastapi")',
            required: true,
          },
        ],
        requiresAuth: false,
        tokenCost: 100,
      },
      {
        name: 'get-library-docs',
        description: 'Fetch version-specific documentation for a library',
        parameters: [
          {
            name: 'libraryId',
            type: 'string',
            description: 'Context7-compatible library ID (use resolve-library-id first)',
            required: true,
          },
          {
            name: 'topic',
            type: 'string',
            description: 'Specific topic to retrieve (e.g., "hooks", "routing", "authentication")',
            required: false,
          },
          {
            name: 'tokens',
            type: 'number',
            description: 'Maximum tokens for response (default: 5000, min: 1000, max: 10000)',
            required: false,
            default: 5000,
          },
        ],
        requiresAuth: false,
        tokenCost: 800,
      },
      {
        name: 'health',
        description: 'Check Context7 service health and availability',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Context7 handler...');
    // No persistent connections to close for HTTP client
  }
}
