/**
 * Direct MinIO/S3 Client
 *
 * Uses AWS S3 SDK to connect directly to MinIO server,
 * bypassing the MCP Gateway for better performance and reliability.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import crypto from 'crypto';
import type {
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  GetFileUrlResult,
  DeleteFileInput,
  DeleteFileResult,
  StatFileInput,
  StatFileResult,
  StorageHealthStatus,
  EntityScope,
  FileInfo,
} from '@/types/storage';

/**
 * Upload file input parameters
 */
export interface S3UploadFileInput {
  bucket: string;
  fileKey: string;
  fileBuffer: Buffer;
  contentType: string;
  metadata?: {
    uploadedBy?: string;
    entityScope?: EntityScope;
    originalFilename?: string;
    [key: string]: unknown;
  };
}

/**
 * Upload file result
 */
export interface S3UploadFileResult {
  fileKey: string;
  bucket: string;
  url: string;
  size: number;
  etag: string;
  contentType: string;
  checksumMd5: string;
  metadata: {
    uploadedBy?: string;
    entityScope?: EntityScope;
    originalFilename?: string;
  };
}

/**
 * S3 Client Configuration
 */
export interface S3StorageClientConfig {
  endpoint?: string;
  port?: number;
  useSSL?: boolean;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  presignedUrlExpiry?: number;
}

/**
 * Get configuration from environment
 */
function getConfig(): S3StorageClientConfig {
  return {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    region: process.env.MINIO_REGION || 'us-east-1',
    presignedUrlExpiry: parseInt(process.env.MINIO_PRESIGNED_EXPIRY || '3600', 10),
  };
}

/**
 * Create S3 client configured for MinIO
 */
function createS3Client(config?: S3StorageClientConfig): S3Client {
  const cfg = config || getConfig();
  const protocol = cfg.useSSL ? 'https' : 'http';
  const endpoint = `${protocol}://${cfg.endpoint}:${cfg.port}`;

  return new S3Client({
    endpoint,
    region: cfg.region || 'us-east-1',
    credentials: {
      accessKeyId: cfg.accessKeyId || '',
      secretAccessKey: cfg.secretAccessKey || '',
    },
    forcePathStyle: true, // Required for MinIO
  });
}

/**
 * Direct S3/MinIO Storage Client
 *
 * Provides storage operations using AWS S3 SDK directly,
 * without going through MCP Gateway.
 */
export class S3StorageClient {
  private readonly client: S3Client;
  private readonly config: S3StorageClientConfig;

  constructor(config?: S3StorageClientConfig) {
    this.config = config || getConfig();
    this.client = createS3Client(this.config);
  }

  /**
   * Upload a file to MinIO bucket
   * Uses multipart upload for large files
   */
  async uploadFile(params: S3UploadFileInput): Promise<S3UploadFileResult> {
    const { bucket, fileKey, fileBuffer, contentType, metadata = {} } = params;

    // Validate file key
    if (!this.isValidFileKey(fileKey)) {
      throw new Error('Invalid file key. Only alphanumeric, hyphens, underscores, slashes, and dots allowed');
    }

    // Ensure bucket exists
    await this.ensureBucketExists(bucket);

    // Calculate MD5 checksum
    const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

    // Prepare metadata for S3 (keys must be lowercase)
    const s3Metadata: Record<string, string> = {
      'uploaded-by': metadata.uploadedBy || 'unknown',
      'entity-scope': metadata.entityScope || 'shared',
      'original-filename': metadata.originalFilename || fileKey,
      'md5-checksum': md5Hash,
    };

    // Use multipart upload for large files (> 5MB)
    const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // 5MB

    if (fileBuffer.length > MULTIPART_THRESHOLD) {
      // Use @aws-sdk/lib-storage for multipart upload
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: bucket,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: contentType,
          Metadata: s3Metadata,
        },
        queueSize: 4,
        partSize: MULTIPART_THRESHOLD,
        leavePartsOnError: false,
      });

      const result = await upload.done();

      // Generate presigned URL for verification
      const url = await this.getPresignedDownloadUrl(bucket, fileKey);

      return {
        fileKey,
        bucket,
        url,
        size: fileBuffer.length,
        etag: result.ETag?.replace(/"/g, '') || '',
        contentType,
        checksumMd5: md5Hash,
        metadata: {
          uploadedBy: metadata.uploadedBy,
          entityScope: metadata.entityScope,
          originalFilename: metadata.originalFilename,
        },
      };
    }

    // Simple upload for smaller files
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: s3Metadata,
    });

    const result = await this.client.send(command);

    // Generate presigned URL for verification
    const url = await this.getPresignedDownloadUrl(bucket, fileKey);

    return {
      fileKey,
      bucket,
      url,
      size: fileBuffer.length,
      etag: result.ETag?.replace(/"/g, '') || '',
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
   * List files in a bucket with optional prefix filtering
   */
  async listFiles(params: ListFilesInput): Promise<ListFilesResult> {
    const { bucket, prefix = '', limit = 100, marker } = params;

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: limit,
      ContinuationToken: marker || undefined,
    });

    const response = await this.client.send(command);

    const files: FileInfo[] = (response.Contents || []).map((obj) => ({
      key: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
      etag: obj.ETag?.replace(/"/g, '') || '',
    }));

    return {
      files,
      nextMarker: response.NextContinuationToken || null,
      truncated: response.IsTruncated || false,
      count: files.length,
    };
  }

  /**
   * Get a presigned URL for file download
   */
  async getFileUrl(params: GetFileUrlInput): Promise<GetFileUrlResult> {
    const { bucket, fileKey, expirySeconds } = params;
    const expiry = expirySeconds || this.config.presignedUrlExpiry || 3600;

    const url = await this.getPresignedDownloadUrl(bucket, fileKey, expiry);

    return {
      url,
      expiresIn: expiry,
      expiresAt: new Date(Date.now() + expiry * 1000).toISOString(),
    };
  }

  /**
   * Delete a file from bucket
   */
  async deleteFile(params: DeleteFileInput): Promise<DeleteFileResult> {
    const { bucket, fileKey } = params;

    // Verify file exists first
    await this.statFile({ bucket, fileKey });

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    await this.client.send(command);

    return {
      success: true,
      bucket,
      fileKey,
      deletedAt: new Date().toISOString(),
    };
  }

  /**
   * Get file metadata (stat)
   */
  async statFile(params: StatFileInput): Promise<StatFileResult> {
    const { bucket, fileKey } = params;

    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    try {
      const response = await this.client.send(command);

      return {
        size: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        etag: response.ETag?.replace(/"/g, '') || '',
        contentType: response.ContentType || 'application/octet-stream',
        metadata: response.Metadata || {},
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'NotFound') {
        throw new Error(`File ${fileKey} not found in bucket ${bucket}`);
      }
      throw error;
    }
  }

  /**
   * Check MinIO service health
   */
  async checkHealth(): Promise<StorageHealthStatus> {
    const startTime = Date.now();

    try {
      // Test connection by listing buckets (HeadBucket on a known bucket)
      // We'll try to head any bucket to verify connectivity
      const command = new ListObjectsV2Command({
        Bucket: 'shared-assets', // Use a known bucket
        MaxKeys: 1,
      });

      await this.client.send(command);
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        service: 'minio-direct',
        latency,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      // Even if bucket doesn't exist, connection might be fine
      // Check if it's a bucket error vs connection error
      if (error instanceof Error) {
        const isConnectionError =
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('NetworkingError');

        if (!isConnectionError) {
          // Bucket doesn't exist but connection is fine
          const latency = Date.now() - startTime;
          return {
            healthy: true,
            service: 'minio-direct',
            latency,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          healthy: false,
          service: 'minio-direct',
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        healthy: false,
        service: 'minio-direct',
        error: 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate presigned download URL
   */
  private async getPresignedDownloadUrl(
    bucket: string,
    fileKey: string,
    expirySeconds?: number
  ): Promise<string> {
    const expiry = expirySeconds || this.config.presignedUrlExpiry || 3600;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    return getSignedUrl(this.client, command, { expiresIn: expiry });
  }

  /**
   * Ensure bucket exists, create if not
   */
  private async ensureBucketExists(bucket: string): Promise<void> {
    try {
      const command = new HeadBucketCommand({ Bucket: bucket });
      await this.client.send(command);
    } catch (error: unknown) {
      if (error instanceof Error && (error.name === 'NotFound' || error.name === 'NoSuchBucket')) {
        // Create bucket
        const createCommand = new CreateBucketCommand({ Bucket: bucket });
        await this.client.send(createCommand);
      } else {
        throw error;
      }
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
}

/**
 * Create a new S3 Storage Client instance
 */
export function createStorageClient(config?: S3StorageClientConfig): S3StorageClient {
  return new S3StorageClient(config);
}

/**
 * Default storage client instance (singleton)
 */
let defaultClient: S3StorageClient | null = null;

/**
 * Get the default storage client (singleton)
 */
export function getS3StorageClient(): S3StorageClient {
  if (!defaultClient) {
    defaultClient = new S3StorageClient();
  }
  return defaultClient;
}

/**
 * Reset the default client (useful for testing)
 */
export function resetS3StorageClient(): void {
  defaultClient = null;
}
