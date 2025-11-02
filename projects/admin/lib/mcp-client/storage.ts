/**
 * MinIO Storage Client
 * MCP client for MinIO S3 storage operations via MCP Gateway
 */

import fetch from 'node-fetch';
import { randomUUID } from 'crypto';
import FormData from 'form-data';
import { Readable } from 'stream';
import {
  StorageBucket,
  StorageObject,
  UploadOptions,
  // UploadProgress is defined for type exports but not used directly in this file
  StorageStats,
  BucketStats,
  CreateBucketOptions,
  ListObjectsOptions,
  ListObjectsResponse,
  DownloadOptions,
  DeleteOptions,
  StorageError,
  StorageErrorCode,
} from '../../types/storage';
import { MCPRequest, MCPResponse } from '../../types/mcp';

/**
 * Storage client configuration
 */
export interface StorageClientConfig {
  /** Base URL of the MCP Gateway (default: http://localhost:8100) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Number of retry attempts for transient failures (default: 3) */
  retries?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
}

/**
 * Resolved configuration with defaults
 */
interface ResolvedStorageClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ResolvedStorageClientConfig = {
  baseUrl: 'http://localhost:8100',
  timeout: 30000, // 30 seconds for file operations
  retries: 3,
  retryDelay: 1000,
};

/**
 * MinIO Storage Client
 * Provides type-safe MinIO operations via MCP Gateway
 */
export class StorageClient {
  private readonly config: ResolvedStorageClientConfig;

  constructor(config: StorageClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || DEFAULT_CONFIG.baseUrl,
      timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
      retries: config.retries ?? DEFAULT_CONFIG.retries,
      retryDelay: config.retryDelay ?? DEFAULT_CONFIG.retryDelay,
    };
  }

  /**
   * List all buckets
   */
  async listBuckets(): Promise<StorageBucket[]> {
    try {
      const result = await this._request<{ buckets: any[] }>('minio.listBuckets', {});

      return result.buckets.map((bucket: any) => ({
        name: bucket.name,
        creationDate: new Date(bucket.creationDate),
        region: bucket.region,
      }));
    } catch (error) {
      throw this._wrapError(error, 'Failed to list buckets');
    }
  }

  /**
   * Create a new bucket
   */
  async createBucket(options: CreateBucketOptions): Promise<void> {
    try {
      await this._request('minio.createBucket', {
        name: options.name,
        region: options.region || 'us-east-1',
        objectLocking: options.objectLocking || false,
      });
    } catch (error: any) {
      if (error.message?.includes('BucketAlreadyExists')) {
        throw new StorageError(
          `Bucket "${options.name}" already exists`,
          StorageErrorCode.BUCKET_ALREADY_EXISTS,
          409
        );
      }
      throw this._wrapError(error, `Failed to create bucket "${options.name}"`);
    }
  }

  /**
   * Delete a bucket
   */
  async deleteBucket(name: string): Promise<void> {
    try {
      await this._request('minio.deleteBucket', { name });
    } catch (error: any) {
      if (error.message?.includes('NoSuchBucket')) {
        throw new StorageError(
          `Bucket "${name}" not found`,
          StorageErrorCode.BUCKET_NOT_FOUND,
          404
        );
      }
      throw this._wrapError(error, `Failed to delete bucket "${name}"`);
    }
  }

  /**
   * List objects in a bucket
   */
  async listObjects(options: ListObjectsOptions): Promise<ListObjectsResponse> {
    try {
      const result = await this._request<{
        objects: any[];
        isTruncated: boolean;
        nextContinuationToken?: string;
      }>('minio.listObjects', {
        bucket: options.bucket,
        prefix: options.prefix || '',
        maxKeys: options.maxKeys || 1000,
        continuationToken: options.continuationToken,
      });

      return {
        objects: result.objects.map((obj: any) => ({
          key: obj.key,
          size: obj.size,
          lastModified: new Date(obj.lastModified),
          etag: obj.etag,
          contentType: obj.contentType,
          metadata: obj.metadata,
        })),
        isTruncated: result.isTruncated,
        nextContinuationToken: result.nextContinuationToken,
        prefix: options.prefix,
      };
    } catch (error: any) {
      if (error.message?.includes('NoSuchBucket')) {
        throw new StorageError(
          `Bucket "${options.bucket}" not found`,
          StorageErrorCode.BUCKET_NOT_FOUND,
          404
        );
      }
      throw this._wrapError(error, `Failed to list objects in bucket "${options.bucket}"`);
    }
  }

  /**
   * Upload a file to a bucket
   */
  async uploadFile(
    file: Buffer | Readable | File,
    options: UploadOptions
  ): Promise<StorageObject> {
    try {
      const formData = new FormData();

      // Handle different file types
      if (Buffer.isBuffer(file)) {
        formData.append('file', file, {
          filename: options.key,
          contentType: options.contentType,
        });
      } else if (file instanceof Readable) {
        formData.append('file', file, {
          filename: options.key,
          contentType: options.contentType,
        });
      } else if (typeof File !== 'undefined' && file instanceof File) {
        // Browser File object
        formData.append('file', file as any, options.key);
      }

      // Add metadata
      formData.append('bucket', options.bucket);
      formData.append('key', options.key);
      if (options.contentType) {
        formData.append('contentType', options.contentType);
      }
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }

      // Upload with progress tracking
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/mcp/storage/upload`, {
        method: 'POST',
        body: formData as any,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json() as any;

      return {
        key: result.key,
        size: result.size,
        lastModified: new Date(result.lastModified),
        etag: result.etag,
        contentType: result.contentType,
        metadata: result.metadata,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new StorageError(
          'Upload timeout',
          StorageErrorCode.UPLOAD_FAILED,
          408
        );
      }
      throw this._wrapError(error, `Failed to upload file "${options.key}"`);
    }
  }

  /**
   * Download a file from a bucket
   */
  async downloadFile(options: DownloadOptions): Promise<Buffer> {
    try {
      const result = await this._request<{ data: string; contentType: string }>(
        'minio.getObject',
        {
          bucket: options.bucket,
          key: options.key,
        }
      );

      // Convert base64 to Buffer
      return Buffer.from(result.data, 'base64');
    } catch (error: any) {
      if (error.message?.includes('NoSuchKey')) {
        throw new StorageError(
          `Object "${options.key}" not found in bucket "${options.bucket}"`,
          StorageErrorCode.OBJECT_NOT_FOUND,
          404
        );
      }
      throw this._wrapError(error, `Failed to download file "${options.key}"`);
    }
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(bucket: string, key: string): Promise<StorageObject> {
    try {
      const result = await this._request<any>('minio.statObject', {
        bucket,
        key,
      });

      return {
        key,
        size: result.size,
        lastModified: new Date(result.lastModified),
        etag: result.etag,
        contentType: result.contentType,
        metadata: result.metadata,
      };
    } catch (error: any) {
      if (error.message?.includes('NoSuchKey')) {
        throw new StorageError(
          `Object "${key}" not found in bucket "${bucket}"`,
          StorageErrorCode.OBJECT_NOT_FOUND,
          404
        );
      }
      throw this._wrapError(error, `Failed to get metadata for "${key}"`);
    }
  }

  /**
   * Delete a file from a bucket
   */
  async deleteFile(options: DeleteOptions): Promise<void> {
    try {
      await this._request('minio.deleteObject', {
        bucket: options.bucket,
        key: options.key,
      });
    } catch (error: any) {
      if (error.message?.includes('NoSuchKey')) {
        throw new StorageError(
          `Object "${options.key}" not found in bucket "${options.bucket}"`,
          StorageErrorCode.OBJECT_NOT_FOUND,
          404
        );
      }
      throw this._wrapError(error, `Failed to delete file "${options.key}"`);
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    try {
      const buckets = await this.listBuckets();
      const bucketStats: BucketStats[] = [];
      let totalObjects = 0;
      let totalSize = 0;

      for (const bucket of buckets) {
        const { objects } = await this.listObjects({ bucket: bucket.name });
        const bucketSize = objects.reduce((sum, obj) => sum + obj.size, 0);
        const lastModified = objects.length > 0
          ? new Date(Math.max(...objects.map(obj => obj.lastModified.getTime())))
          : undefined;

        bucketStats.push({
          name: bucket.name,
          objectCount: objects.length,
          size: bucketSize,
          lastModified,
        });

        totalObjects += objects.length;
        totalSize += bucketSize;
      }

      return {
        totalBuckets: buckets.length,
        totalObjects,
        totalSize,
        bucketStats,
      };
    } catch (error) {
      throw this._wrapError(error, 'Failed to get storage statistics');
    }
  }

  /**
   * Low-level request method
   */
  private async _request<T>(operation: string, params: any, retryCount = 0): Promise<T> {
    const requestId = randomUUID();

    const body: MCPRequest = {
      jsonrpc: '2.0',
      method: 'mcp.execute',
      params: {
        service: 'minio',
        operation,
        ...params,
      },
      id: requestId,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/mcp/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`MCP Gateway returned ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as MCPResponse<T>;

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.result) {
        throw new Error('Invalid response: missing result');
      }

      if (data.result.status === 'error') {
        throw new Error(JSON.stringify(data.result.data));
      }

      return data.result.data;
    } catch (error: any) {
      // Handle timeout
      if (error.name === 'AbortError') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._request<T>(operation, params, retryCount + 1);
        }
        throw new Error(`Request timed out after ${this.config.timeout}ms`);
      }

      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._request<T>(operation, params, retryCount + 1);
        }
        throw new Error('Failed to connect to MCP Gateway');
      }

      throw error;
    }
  }

  /**
   * Sleep helper
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wrap errors in StorageError
   */
  private _wrapError(error: any, message: string): StorageError {
    if (error instanceof StorageError) {
      return error;
    }

    return new StorageError(
      `${message}: ${error.message || 'Unknown error'}`,
      StorageErrorCode.UNKNOWN_ERROR,
      500,
      error
    );
  }

  /**
   * Get current configuration
   */
  getConfig(): ResolvedStorageClientConfig {
    return { ...this.config };
  }
}

/**
 * Create a storage client instance
 */
export function createStorageClient(config?: StorageClientConfig): StorageClient {
  return new StorageClient(config);
}
