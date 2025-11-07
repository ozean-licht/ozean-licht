import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    content?: string;
    markdown?: string;
    html?: string;
    metadata?: {
      title?: string;
      description?: string;
      language?: string;
      sourceURL?: string;
      [key: string]: any;
    };
  };
  error?: string;
}

export class FirecrawlHandler implements MCPHandler {
  private client: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.firecrawl.dev/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FIRECRAWL_API_KEY || '';

    if (!this.apiKey) {
      logger.warn('Firecrawl API key not provided - service may not work correctly');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.HTTP_TIMEOUT_MS || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'MCP-Gateway/1.0.0',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Firecrawl API request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Firecrawl request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Firecrawl API response', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('Firecrawl request timed out');
        }
        if (error.response) {
          logger.error('Firecrawl API error response', {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          logger.error('Firecrawl connection error', { error: error.message });
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
        case 'scrape':
          if (!params.args || !params.args.url) {
            throw new ValidationError('URL required for scrape operation');
          }
          result = await this.scrapeUrl(params.args.url, params.options);
          break;

        case 'health':
        case 'status':
          result = await this.checkHealth();
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const executionTime = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('firecrawl', params.operation, executionTime, 'success');

      // Estimate token usage (rough estimate for content)
      const tokenEstimate = this.estimateTokenUsage(result);
      recordTokenUsage('firecrawl', params.operation, tokenEstimate);

      // Calculate cost (rough estimate: $0.003 per 1K tokens)
      const estimatedCost = (tokenEstimate / 1000) * 0.003;

      return {
        status: 'success',
        data: result,
        metadata: {
          service: 'firecrawl',
          operation: params.operation,
          executionTime,
          tokensUsed: tokenEstimate,
          cost: estimatedCost,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      recordMCPOperation('firecrawl', params.operation, executionTime, 'error');

      logger.error('Firecrawl operation failed', {
        operation: params.operation,
        error: error instanceof Error ? error.message : String(error),
        executionTime,
      });

      return {
        status: 'success', // Keep as success but with error in data
        data: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        metadata: {
          service: 'firecrawl',
          operation: params.operation,
          executionTime,
          tokensUsed: 0,
          cost: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  private async scrapeUrl(url: string, options?: any): Promise<any> {
    try {
      const scrapeOptions = {
        formats: ['markdown', 'html'],
        includeTags: options?.includeTags || [],
        excludeTags: options?.excludeTags || ['script', 'style'],
        onlyMainContent: options?.onlyMainContent !== false, // Default to true
        timeout: options?.timeout || 30000,
        waitFor: options?.waitFor || 0,
        headers: options?.headers || {},
        ...options
      };

      const response = await this.client.post('/scrape', {
        url,
        ...scrapeOptions
      });

      if (response.data?.success) {
        return {
          url,
          content: response.data.data?.content || '',
          markdown: response.data.data?.markdown || '',
          html: response.data.data?.html || '',
          metadata: response.data.data?.metadata || {},
          success: true
        };
      } else {
        throw new ServiceUnavailableError(`Failed to scrape URL: ${response.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ServiceUnavailableError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new ValidationError('Invalid Firecrawl API key');
        }
        if (error.response?.status === 429) {
          throw new ServiceUnavailableError('Firecrawl rate limit exceeded');
        }
        throw new ServiceUnavailableError(`Firecrawl API error: ${error.response?.data?.error || error.message}`);
      }

      throw new ServiceUnavailableError(`Failed to scrape URL: ${error}`);
    }
  }

  private async checkHealth(): Promise<any> {
    try {
      // Try a simple request to check if the service is available
      const response = await this.client.get('/');

      return {
        healthy: true,
        status: 'operational',
        apiKey: this.apiKey ? 'configured' : 'missing',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Firecrawl health check failed', { error });

      return {
        healthy: false,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        apiKey: this.apiKey ? 'configured' : 'missing',
        timestamp: new Date().toISOString()
      };
    }
  }

  private estimateTokenUsage(result: any): number {
    if (!result || typeof result !== 'object') return 0;

    let totalChars = 0;

    if (result.content) totalChars += result.content.length;
    if (result.markdown) totalChars += result.markdown.length;
    if (result.html) totalChars += Math.floor(result.html.length * 0.3); // HTML typically has more overhead

    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(totalChars / 4);
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'web-scraping',
        description: 'Scrape web pages and convert to markdown',
        parameters: [
          {
            name: 'url',
            type: 'string',
            description: 'URL to scrape',
            required: true
          }
        ],
        examples: ['/mcp-firecrawl scrape "https://example.com"'],
        tokenCost: 10, // Base cost in tokens
      },
      {
        name: 'health-check',
        description: 'Check Firecrawl service health',
        examples: ['/mcp-firecrawl health'],
        tokenCost: 1,
      },
    ];
  }

  public getServiceInfo() {
    return {
      name: 'firecrawl',
      version: '1.0.0',
      location: 'server',
      description: 'Web scraping service powered by Firecrawl API',
      capabilities: this.getCapabilities(),
      healthStatus: 'unknown', // Will be updated by health checks
    };
  }
}

// Export singleton instance
export const firecrawlHandler = new FirecrawlHandler();