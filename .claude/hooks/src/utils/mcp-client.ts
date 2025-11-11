/**
 * MCP Gateway client wrapper for hooks
 * Provides typed interface to MCP services via HTTP gateway
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';
import { MCPResponse, ServiceHealth, ServiceUnavailableError, TimeoutError } from '../types';

export class MCPClient {
  private client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl || process.env.MCP_GATEWAY_URL || 'http://localhost:8100';
    this.timeout = timeout || parseInt(process.env.MCP_GATEWAY_TIMEOUT || '5000', 10);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Claude-Hooks/1.0.0',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('MCP Gateway request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('MCP Gateway request error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('MCP Gateway response', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          logger.error('MCP Gateway timeout', error);
          throw new TimeoutError('MCP Gateway request');
        }
        if (error.response) {
          logger.error('MCP Gateway error response', undefined, {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          logger.error('MCP Gateway no response', error);
          throw new ServiceUnavailableError('MCP Gateway', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Execute MCP operation with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }

      // Only retry on network errors or 5xx errors
      if (
        axios.isAxiosError(error) &&
        (error.code === 'ECONNREFUSED' ||
          error.code === 'ENOTFOUND' ||
          (error.response && error.response.status >= 500))
      ) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        logger.warn(`MCP operation failed, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Check MCP Gateway health
   */
  public async checkHealth(): Promise<ServiceHealth> {
    try {
      const startTime = Date.now();
      const response = await this.client.get('/health');
      const latency = Date.now() - startTime;

      return {
        service: 'mcp-gateway',
        status: response.data.status === 'ok' ? 'healthy' : 'degraded',
        endpoint: this.baseUrl,
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: 'mcp-gateway',
        status: 'unhealthy',
        endpoint: this.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Execute Mem0 operation via /execute endpoint
   */
  public async mem0(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeWithRetry(async () => {
      // Build command in format: "/mcp-mem0 operation arg1 arg2"
      const argsStr = args && args.length > 0
        ? ' ' + args.map(arg => {
            // Properly quote string arguments
            if (typeof arg === 'string') {
              return arg.includes(' ') ? `"${arg}"` : arg;
            }
            return JSON.stringify(arg);
          }).join(' ')
        : '';
      const command = `/mcp-mem0 ${operation}${argsStr}`;

      const request = {
        command,
        options,
      };

      const response = await this.client.post('/execute', request);
      return response.data;
    });
  }

  /**
   * Save memory to Mem0
   */
  public async saveMemory(
    content: string,
    userId: string = 'agent_claude_code',
    metadata?: Record<string, any>
  ): Promise<MCPResponse> {
    return this.mem0('remember', [content], {
      user_id: userId,
      metadata: {
        source: 'claude-hooks',
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }

  /**
   * Search memories in Mem0
   */
  public async searchMemory(
    query: string,
    userId?: string,
    limit: number = 10
  ): Promise<MCPResponse> {
    return this.mem0('search', [query], {
      user_id: userId,
      limit,
    });
  }

  /**
   * Get all memories for a user
   */
  public async getMemories(
    userId: string = 'agent_claude_code',
    limit: number = 50
  ): Promise<MCPResponse> {
    return this.mem0('get-context', [userId], { limit });
  }

  /**
   * Execute PostgreSQL operation via /execute endpoint
   */
  public async postgres(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeWithRetry(async () => {
      const argsStr = args && args.length > 0
        ? ' ' + args.map(arg => {
            if (typeof arg === 'string') {
              return arg.includes(' ') ? `"${arg}"` : arg;
            }
            return JSON.stringify(arg);
          }).join(' ')
        : '';
      const command = `/mcp-postgres ${operation}${argsStr}`;

      const request = {
        command,
        options,
      };

      const response = await this.client.post('/execute', request);
      return response.data;
    });
  }

  /**
   * Generic MCP service executor via /execute endpoint
   */
  private async executeMCPService(
    service: string,
    operation: string,
    args?: any[],
    options?: Record<string, any>
  ): Promise<MCPResponse> {
    return this.executeWithRetry(async () => {
      const argsStr = args && args.length > 0
        ? ' ' + args.map(arg => {
            if (typeof arg === 'string') {
              return arg.includes(' ') ? `"${arg}"` : arg;
            }
            return JSON.stringify(arg);
          }).join(' ')
        : '';
      const command = `/mcp-${service} ${operation}${argsStr}`;

      const request = {
        command,
        options,
      };

      const response = await this.client.post('/execute', request);
      return response.data;
    });
  }

  /**
   * Execute Coolify operation
   */
  public async coolify(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('coolify', operation, args, options);
  }

  /**
   * Execute GitHub operation
   */
  public async github(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('github', operation, args, options);
  }

  /**
   * Execute N8N operation
   */
  public async n8n(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('n8n', operation, args, options);
  }

  /**
   * Execute MinIO operation
   */
  public async minio(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('minio', operation, args, options);
  }

  /**
   * Execute Cloudflare operation
   */
  public async cloudflare(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('cloudflare', operation, args, options);
  }

  /**
   * Execute Firecrawl operation
   */
  public async firecrawl(operation: string, args?: any[], options?: Record<string, any>): Promise<MCPResponse> {
    return this.executeMCPService('firecrawl', operation, args, options);
  }
}

// Export singleton instance
export const mcpClient = new MCPClient();
export default mcpClient;
