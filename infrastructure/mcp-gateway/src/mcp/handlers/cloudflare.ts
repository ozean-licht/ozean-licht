import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface CloudflareStreamVideo {
  uid: string;
  status: {
    state: string;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  meta: Record<string, any>;
  created: string;
  modified: string;
  size: number;
  preview?: string;
  thumbnail?: string;
  duration: number;
  input: {
    width: number;
    height: number;
  };
  playback: {
    hls: string;
    dash: string;
  };
}

interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
  created_on: string;
  modified_on: string;
}

export class CloudflareHandler implements MCPHandler {
  private client: AxiosInstance;
  private readonly apiToken: string;
  private readonly accountId: string;
  private readonly zoneId?: string;

  constructor() {
    this.apiToken = config.CLOUDFLARE_API_TOKEN;
    this.accountId = config.CLOUDFLARE_ACCOUNT_ID;
    this.zoneId = config.CLOUDFLARE_ZONE_ID;

    this.client = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      timeout: config.HTTP_TIMEOUT_MS,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Cloudflare API request', {
          method: config.method,
          url: config.url,
        });
        return config;
      },
      (error) => {
        logger.error('Cloudflare request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Cloudflare API response', {
          status: response.status,
          success: response.data?.success,
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('Cloudflare request timed out');
        }
        if (error.response) {
          logger.error('Cloudflare API error response', {
            status: error.response.status,
            errors: error.response.data?.errors,
          });
        } else {
          logger.error('Cloudflare connection error', { error: error.message });
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
        // Stream operations
        case 'stream-upload':
        case 'upload-video':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Video URL or path required for upload operation');
          }
          result = await this.uploadVideo(params.args[0], params.options);
          break;

        case 'stream-list':
        case 'list-videos':
          result = await this.listVideos(params.options);
          break;

        case 'stream-get':
        case 'get-video':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Video ID required for get-video operation');
          }
          result = await this.getVideo(params.args[0]);
          break;

        case 'stream-delete':
        case 'delete-video':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Video ID required for delete-video operation');
          }
          result = await this.deleteVideo(params.args[0]);
          break;

        // DNS operations
        case 'dns-list':
        case 'list-dns-records':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Zone ID required for list-dns-records operation');
          }
          result = await this.listDNSRecords(params.args[0], params.options);
          break;

        case 'dns-create':
        case 'create-dns-record':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Zone ID and record data required for create-dns-record operation');
          }
          result = await this.createDNSRecord(params.args[0], params.args[1]);
          break;

        case 'dns-update':
        case 'update-dns-record':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Zone ID, record ID, and update data required for update-dns-record operation');
          }
          result = await this.updateDNSRecord(params.args[0], params.args[1], params.args[2]);
          break;

        case 'dns-delete':
        case 'delete-dns-record':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Zone ID and record ID required for delete-dns-record operation');
          }
          result = await this.deleteDNSRecord(params.args[0], params.args[1]);
          break;

        // Zone operations
        case 'list-zones':
          result = await this.listZones(params.options);
          break;

        case 'get-zone':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Zone ID required for get-zone operation');
          }
          result = await this.getZone(params.args[0]);
          break;

        // Analytics
        case 'get-analytics':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Zone ID required for analytics operation');
          }
          result = await this.getAnalytics(params.args[0], params.options);
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
      recordMCPOperation('cloudflare', params.operation, duration, 'success');
      recordTokenUsage('cloudflare', params.operation, 300);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 300,
          cost: 0.0009,
          service: 'cloudflare',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('cloudflare', params.operation, duration, 'error');

      logger.error('Cloudflare operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new ValidationError('Resource not found');
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new ValidationError('Authentication failed - check API token');
        }
        if (error.response && error.response.status >= 500) {
          throw new ServiceUnavailableError('cloudflare', error.response?.data?.errors?.[0]?.message || error.message);
        }
        throw new ValidationError(error.response?.data?.errors?.[0]?.message || error.message);
      }

      throw error;
    }
  }

  // Stream Video Operations
  private async uploadVideo(videoUrl: string, options?: any): Promise<any> {
    const uploadData: any = {
      url: videoUrl,
    };

    if (options?.meta) {
      uploadData.meta = options.meta;
    }

    const response = await this.client.post(
      `/accounts/${this.accountId}/stream/copy`,
      uploadData
    );

    if (!response.data.success) {
      throw new ValidationError('Video upload failed', response.data.errors);
    }

    const video = response.data.result;

    return {
      operation: 'video_uploaded',
      video: {
        id: video.uid,
        status: video.status.state,
        preview: video.preview,
        thumbnail: video.thumbnail,
        playback: video.playback,
        created: video.created,
      },
      message: 'Video upload initiated successfully',
    };
  }

  private async listVideos(options?: any): Promise<any> {
    const params: any = {};

    if (options?.limit) params.limit = options.limit;
    if (options?.status) params.status = options.status;

    const response = await this.client.get(
      `/accounts/${this.accountId}/stream`,
      { params }
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to list videos', response.data.errors);
    }

    const videos = response.data.result || [];

    return {
      operation: 'list_videos',
      count: videos.length,
      videos: videos.map((v: CloudflareStreamVideo) => ({
        id: v.uid,
        status: v.status.state,
        duration: v.duration,
        created: v.created,
        thumbnail: v.thumbnail,
        playback: v.playback,
      })),
    };
  }

  private async getVideo(videoId: string): Promise<any> {
    const response = await this.client.get(
      `/accounts/${this.accountId}/stream/${videoId}`
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to get video', response.data.errors);
    }

    const video = response.data.result;

    return {
      operation: 'get_video',
      video: {
        id: video.uid,
        status: video.status,
        meta: video.meta,
        created: video.created,
        modified: video.modified,
        size: video.size,
        duration: video.duration,
        input: video.input,
        playback: video.playback,
        preview: video.preview,
        thumbnail: video.thumbnail,
      },
    };
  }

  private async deleteVideo(videoId: string): Promise<any> {
    const response = await this.client.delete(
      `/accounts/${this.accountId}/stream/${videoId}`
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to delete video', response.data.errors);
    }

    return {
      operation: 'video_deleted',
      video_id: videoId,
      message: 'Video deleted successfully',
    };
  }

  // DNS Operations
  private async listDNSRecords(zoneId: string, options?: any): Promise<any> {
    const params: any = {};

    if (options?.type) params.type = options.type;
    if (options?.name) params.name = options.name;
    if (options?.page) params.page = options.page;
    if (options?.per_page) params.per_page = options.per_page;

    const response = await this.client.get(
      `/zones/${zoneId}/dns_records`,
      { params }
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to list DNS records', response.data.errors);
    }

    const records = response.data.result || [];

    return {
      operation: 'list_dns_records',
      zone_id: zoneId,
      count: records.length,
      records: records.map((r: CloudflareDNSRecord) => ({
        id: r.id,
        type: r.type,
        name: r.name,
        content: r.content,
        proxied: r.proxied,
        ttl: r.ttl,
      })),
    };
  }

  private async createDNSRecord(zoneId: string, recordData: any): Promise<any> {
    const response = await this.client.post(
      `/zones/${zoneId}/dns_records`,
      recordData
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to create DNS record', response.data.errors);
    }

    const record = response.data.result;

    return {
      operation: 'dns_record_created',
      record: {
        id: record.id,
        type: record.type,
        name: record.name,
        content: record.content,
        proxied: record.proxied,
        ttl: record.ttl,
      },
      message: 'DNS record created successfully',
    };
  }

  private async updateDNSRecord(zoneId: string, recordId: string, updateData: any): Promise<any> {
    const response = await this.client.put(
      `/zones/${zoneId}/dns_records/${recordId}`,
      updateData
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to update DNS record', response.data.errors);
    }

    const record = response.data.result;

    return {
      operation: 'dns_record_updated',
      record: {
        id: record.id,
        type: record.type,
        name: record.name,
        content: record.content,
        proxied: record.proxied,
        ttl: record.ttl,
      },
      message: 'DNS record updated successfully',
    };
  }

  private async deleteDNSRecord(zoneId: string, recordId: string): Promise<any> {
    const response = await this.client.delete(
      `/zones/${zoneId}/dns_records/${recordId}`
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to delete DNS record', response.data.errors);
    }

    return {
      operation: 'dns_record_deleted',
      record_id: recordId,
      message: 'DNS record deleted successfully',
    };
  }

  // Zone Operations
  private async listZones(options?: any): Promise<any> {
    const params: any = {};

    if (options?.name) params.name = options.name;
    if (options?.status) params.status = options.status;
    if (options?.page) params.page = options.page;

    const response = await this.client.get('/zones', { params });

    if (!response.data.success) {
      throw new ValidationError('Failed to list zones', response.data.errors);
    }

    const zones = response.data.result || [];

    return {
      operation: 'list_zones',
      count: zones.length,
      zones: zones.map((z: any) => ({
        id: z.id,
        name: z.name,
        status: z.status,
        name_servers: z.name_servers,
      })),
    };
  }

  private async getZone(zoneId: string): Promise<any> {
    const response = await this.client.get(`/zones/${zoneId}`);

    if (!response.data.success) {
      throw new ValidationError('Failed to get zone', response.data.errors);
    }

    const zone = response.data.result;

    return {
      operation: 'get_zone',
      zone: {
        id: zone.id,
        name: zone.name,
        status: zone.status,
        name_servers: zone.name_servers,
        created_on: zone.created_on,
        modified_on: zone.modified_on,
      },
    };
  }

  // Analytics
  private async getAnalytics(zoneId: string, options?: any): Promise<any> {
    const params: any = {
      since: options?.since || '-1440', // Last 24 hours by default
      until: options?.until || '0',
    };

    const response = await this.client.get(
      `/zones/${zoneId}/analytics/dashboard`,
      { params }
    );

    if (!response.data.success) {
      throw new ValidationError('Failed to get analytics', response.data.errors);
    }

    return {
      operation: 'get_analytics',
      zone_id: zoneId,
      analytics: response.data.result,
    };
  }

  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();

      // Try to verify the token by getting account details
      // This works with both User and Account API tokens
      const response = await this.client.get(`/accounts/${this.accountId}`);
      const latency = Date.now() - startTime;

      return {
        status: response.data.success ? 'healthy' : 'unhealthy',
        service: 'cloudflare',
        latency: `${latency}ms`,
        account_id: this.accountId,
        account_name: response.data.result?.name || 'unknown',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'cloudflare',
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
      // Stream capabilities
      {
        name: 'stream-upload',
        description: 'Upload a video to Cloudflare Stream',
        parameters: [
          {
            name: 'videoUrl',
            type: 'string',
            description: 'URL of the video to upload',
            required: true,
          },
          {
            name: 'meta',
            type: 'object',
            description: 'Metadata for the video',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 400,
      },
      {
        name: 'stream-list',
        description: 'List all videos in Cloudflare Stream',
        parameters: [
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum number of videos to return',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'stream-get',
        description: 'Get details of a specific video',
        parameters: [
          {
            name: 'videoId',
            type: 'string',
            description: 'Video ID',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'stream-delete',
        description: 'Delete a video from Cloudflare Stream',
        parameters: [
          {
            name: 'videoId',
            type: 'string',
            description: 'Video ID to delete',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // DNS capabilities
      {
        name: 'dns-list',
        description: 'List DNS records for a zone',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
          {
            name: 'type',
            type: 'string',
            description: 'Filter by record type (A, AAAA, CNAME, etc.)',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'dns-create',
        description: 'Create a new DNS record',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
          {
            name: 'recordData',
            type: 'object',
            description: 'DNS record data (type, name, content, etc.)',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'dns-update',
        description: 'Update an existing DNS record',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
          {
            name: 'recordId',
            type: 'string',
            description: 'Record ID',
            required: true,
          },
          {
            name: 'updateData',
            type: 'object',
            description: 'Updated DNS record data',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'dns-delete',
        description: 'Delete a DNS record',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
          {
            name: 'recordId',
            type: 'string',
            description: 'Record ID to delete',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // Zone capabilities
      {
        name: 'list-zones',
        description: 'List all zones in the account',
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'get-zone',
        description: 'Get details of a specific zone',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // Analytics
      {
        name: 'get-analytics',
        description: 'Get analytics for a zone',
        parameters: [
          {
            name: 'zoneId',
            type: 'string',
            description: 'Zone ID',
            required: true,
          },
          {
            name: 'since',
            type: 'string',
            description: 'Start time (minutes ago, e.g., -1440 for 24h)',
            required: false,
            default: '-1440',
          },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'health',
        description: 'Check Cloudflare service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Cloudflare handler...');
    // No persistent connections to close for HTTP client
  }
}
