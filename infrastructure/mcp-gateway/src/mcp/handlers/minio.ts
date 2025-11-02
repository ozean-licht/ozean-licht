import * as Minio from 'minio';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { ValidationError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';
import crypto from 'crypto';

interface MinIOHandlerOptions {
  endpoint?: string;
  port?: number;
  useSSL?: boolean;
  accessKey: string;
  secretKey: string;
  maxFileSize?: number; // in bytes
  allowedContentTypes?: string[];
  presignedUrlExpiry?: number; // in seconds
}

interface UploadParams {
  bucket: string;
  fileKey: string;
  fileBuffer: string; // base64 encoded
  contentType: string;
  metadata?: {
    uploadedBy?: string;
    entityScope?: string;
    originalFilename?: string;
    [key: string]: any;
  };
}

interface ListParams {
  bucket: string;
  prefix?: string;
  limit?: number;
  marker?: string;
}

interface GetUrlParams {
  bucket: string;
  fileKey: string;
  expirySeconds?: number;
}

interface DeleteParams {
  bucket: string;
  fileKey: string;
}

interface StatParams {
  bucket: string;
  fileKey: string;
}

export class MinIOHandler implements MCPHandler {
  private client: Minio.Client;
  private readonly options: MinIOHandlerOptions;
  private readonly defaultExpiry = 300; // 5 minutes
  private readonly maxFileSize: number;
  private readonly allowedContentTypes: Set<string>;

  constructor(options: MinIOHandlerOptions) {
    this.options = options;
    this.maxFileSize = options.maxFileSize || 500 * 1024 * 1024; // 500MB default
    this.allowedContentTypes = new Set(options.allowedContentTypes || [
      'video/*',
      'image/*',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
    ]);

    this.client = new Minio.Client({
      endPoint: options.endpoint || 'localhost',
      port: options.port || 9000,
      useSSL: options.useSSL || false,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
    });

    logger.info('MinIO client initialized', {
      endpoint: options.endpoint,
      port: options.port,
      useSSL: options.useSSL,
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Test connection by listing buckets
      const buckets = await this.client.listBuckets();
      logger.info('MinIO connection successful', { bucketCount: buckets.length });
    } catch (error) {
      logger.error('MinIO connection failed', { error });
      throw new Error(`Failed to connect to MinIO: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;
      let tokensUsed = 0; // MinIO operations don't use tokens, but we track for consistency

      switch (params.operation) {
        case 'upload':
          result = await this.uploadFile(params as unknown as UploadParams);
          tokensUsed = Math.ceil(result.size / 1024); // Estimate: 1 token per KB
          break;

        case 'list':
          result = await this.listFiles(params as unknown as ListParams);
          tokensUsed = result.files.length * 10; // Estimate: 10 tokens per file
          break;

        case 'getUrl':
          result = await this.getPresignedUrl(params as unknown as GetUrlParams);
          tokensUsed = 5; // Minimal operation
          break;

        case 'delete':
          result = await this.deleteFile(params as unknown as DeleteParams);
          tokensUsed = 5; // Minimal operation
          break;

        case 'stat':
          result = await this.statFile(params as unknown as StatParams);
          tokensUsed = 10; // Minimal operation
          break;

        case 'health':
          result = await this.healthCheck();
          tokensUsed = 5; // Minimal operation
          break;

        default:
          throw new ValidationError(`Unsupported MinIO operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('minio', params.operation, 'success', duration);
      recordTokenUsage('minio', tokensUsed);

      logger.info('MinIO operation completed', {
        operation: params.operation,
        duration,
        tokensUsed,
      });

      return {
        success: true,
        data: result,
        metadata: {
          service: 'minio',
          operation: params.operation,
          duration,
          tokensUsed,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('minio', params.operation, 'error', duration);

      logger.error('MinIO operation failed', {
        operation: params.operation,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      throw error;
    }
  }

  /**
   * Upload file to MinIO bucket
   */
  private async uploadFile(params: UploadParams): Promise<any> {
    const { bucket, fileKey, fileBuffer, contentType, metadata = {} } = params;

    // Validate file key
    if (!this.isValidFileKey(fileKey)) {
      throw new ValidationError('Invalid file key. Only alphanumeric, hyphens, underscores, slashes, and dots allowed');
    }

    // Decode base64 buffer
    let buffer: Buffer;
    try {
      buffer = Buffer.from(fileBuffer, 'base64');
    } catch (error) {
      throw new ValidationError('Invalid file buffer. Must be base64 encoded');
    }

    // Validate file size
    if (buffer.length > this.maxFileSize) {
      throw new ValidationError(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
        { fileSize: buffer.length, maxSize: this.maxFileSize }
      );
    }

    // Validate content type
    if (!this.isAllowedContentType(contentType)) {
      throw new ValidationError(
        `Content type ${contentType} is not allowed`,
        { contentType, allowedTypes: Array.from(this.allowedContentTypes) }
      );
    }

    // Ensure bucket exists
    await this.ensureBucketExists(bucket);

    // Calculate MD5 checksum
    const md5Hash = crypto.createHash('md5').update(buffer).digest('hex');

    // Prepare metadata for MinIO
    const minioMetadata: Record<string, string> = {
      'Content-Type': contentType,
      'X-Uploaded-By': metadata.uploadedBy || 'unknown',
      'X-Entity-Scope': metadata.entityScope || 'shared',
      'X-Original-Filename': metadata.originalFilename || fileKey,
      'X-MD5-Checksum': md5Hash,
    };

    // Upload to MinIO
    const uploadResult = await this.client.putObject(
      bucket,
      fileKey,
      buffer,
      buffer.length,
      minioMetadata
    );

    // Generate presigned URL for verification
    const url = await this.client.presignedGetObject(
      bucket,
      fileKey,
      this.options.presignedUrlExpiry || this.defaultExpiry
    );

    return {
      fileKey,
      bucket,
      url,
      size: buffer.length,
      etag: uploadResult.etag,
      contentType,
      checksumMd5: md5Hash,
      metadata: {
        uploadedBy: metadata.uploadedBy,
        entityScope: metadata.entityScope,
        originalFilename: metadata.originalFilename,
      },
    };
  }

  /**
   * List files in bucket
   */
  private async listFiles(params: ListParams): Promise<any> {
    const { bucket, prefix = '', limit = 100, marker = '' } = params;

    // Check if bucket exists
    const bucketExists = await this.client.bucketExists(bucket);
    if (!bucketExists) {
      throw new ValidationError(`Bucket ${bucket} does not exist`);
    }

    const files: any[] = [];
    let nextMarker: string | null = null;
    let truncated = false;

    try {
      const stream = this.client.listObjectsV2(bucket, prefix, false, marker);

      for await (const obj of stream) {
        if (files.length >= limit) {
          truncated = true;
          nextMarker = obj.name;
          break;
        }

        files.push({
          key: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          etag: obj.etag,
        });
      }
    } catch (error) {
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      files,
      nextMarker,
      truncated,
      count: files.length,
    };
  }

  /**
   * Get presigned URL for file
   */
  private async getPresignedUrl(params: GetUrlParams): Promise<any> {
    const { bucket, fileKey, expirySeconds } = params;

    // Check if object exists
    try {
      await this.client.statObject(bucket, fileKey);
    } catch (error) {
      throw new ValidationError(`File ${fileKey} not found in bucket ${bucket}`);
    }

    const expiry = expirySeconds || this.options.presignedUrlExpiry || this.defaultExpiry;
    const url = await this.client.presignedGetObject(bucket, fileKey, expiry);

    return {
      url,
      expiresIn: expiry,
      expiresAt: new Date(Date.now() + expiry * 1000).toISOString(),
    };
  }

  /**
   * Delete file from bucket
   */
  private async deleteFile(params: DeleteParams): Promise<any> {
    const { bucket, fileKey } = params;

    // Check if object exists
    try {
      await this.client.statObject(bucket, fileKey);
    } catch (error) {
      throw new ValidationError(`File ${fileKey} not found in bucket ${bucket}`);
    }

    await this.client.removeObject(bucket, fileKey);

    return {
      success: true,
      bucket,
      fileKey,
      deletedAt: new Date().toISOString(),
    };
  }

  /**
   * Get file metadata
   */
  private async statFile(params: StatParams): Promise<any> {
    const { bucket, fileKey } = params;

    try {
      const stat = await this.client.statObject(bucket, fileKey);

      return {
        size: stat.size,
        lastModified: stat.lastModified,
        etag: stat.etag,
        contentType: stat.metaData?.['content-type'] || 'application/octet-stream',
        metadata: stat.metaData || {},
      };
    } catch (error) {
      throw new ValidationError(`File ${fileKey} not found in bucket ${bucket}`);
    }
  }

  /**
   * Health check for MinIO service
   */
  private async healthCheck(): Promise<any> {
    const startTime = Date.now();

    try {
      // Test connection by listing buckets
      const buckets = await this.client.listBuckets();
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        service: 'minio',
        latency,
        bucketsCount: buckets.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        healthy: false,
        service: 'minio',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Ensure bucket exists, create if not
   */
  private async ensureBucketExists(bucket: string): Promise<void> {
    try {
      const exists = await this.client.bucketExists(bucket);

      if (!exists) {
        logger.info(`Creating bucket: ${bucket}`);
        await this.client.makeBucket(bucket, 'us-east-1'); // Default region
        logger.info(`Bucket created: ${bucket}`);
      }
    } catch (error) {
      throw new Error(`Failed to ensure bucket exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate file key format
   */
  private isValidFileKey(fileKey: string): boolean {
    // Allow alphanumeric, hyphens, underscores, slashes, and dots
    const regex = /^[a-zA-Z0-9\-_/\.]+$/;
    return regex.test(fileKey);
  }

  /**
   * Check if content type is allowed
   */
  private isAllowedContentType(contentType: string): boolean {
    // Check exact match
    if (this.allowedContentTypes.has(contentType)) {
      return true;
    }

    // Check wildcard patterns (e.g., video/*, image/*)
    for (const allowed of this.allowedContentTypes) {
      if (allowed.endsWith('/*')) {
        const prefix = allowed.slice(0, -2);
        if (contentType.startsWith(prefix + '/')) {
          return true;
        }
      }
    }

    return false;
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'upload',
        description: 'Upload file to MinIO bucket',
        parameters: {
          bucket: 'string (required)',
          fileKey: 'string (required)',
          fileBuffer: 'string (required, base64 encoded)',
          contentType: 'string (required)',
          metadata: 'object (optional)',
        },
      },
      {
        name: 'list',
        description: 'List files in bucket',
        parameters: {
          bucket: 'string (required)',
          prefix: 'string (optional)',
          limit: 'number (optional, default 100)',
          marker: 'string (optional)',
        },
      },
      {
        name: 'getUrl',
        description: 'Get presigned URL for file',
        parameters: {
          bucket: 'string (required)',
          fileKey: 'string (required)',
          expirySeconds: 'number (optional, default 300)',
        },
      },
      {
        name: 'delete',
        description: 'Delete file from bucket',
        parameters: {
          bucket: 'string (required)',
          fileKey: 'string (required)',
        },
      },
      {
        name: 'stat',
        description: 'Get file metadata',
        parameters: {
          bucket: 'string (required)',
          fileKey: 'string (required)',
        },
      },
      {
        name: 'health',
        description: 'Check MinIO service health',
        parameters: {},
      },
    ];
  }

  public async close(): Promise<void> {
    // MinIO client doesn't have explicit close, connections are managed automatically
    logger.info('MinIO handler closed');
  }
}

// Export factory function
export function createMinIOHandler(options: MinIOHandlerOptions): MinIOHandler {
  return new MinIOHandler(options);
}
