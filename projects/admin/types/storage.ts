/**
 * Storage Types
 * TypeScript interfaces and types for MinIO S3 storage operations
 */

/**
 * Storage bucket information
 */
export interface StorageBucket {
  name: string;
  creationDate: Date;
  region?: string;
}

/**
 * Storage object (file) information
 */
export interface StorageObject {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

/**
 * Options for file upload operations
 */
export interface UploadOptions {
  bucket: string;
  key: string;
  contentType?: string;
  metadata?: Record<string, string>;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Upload progress information
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Storage statistics for dashboard metrics
 */
export interface StorageStats {
  totalBuckets: number;
  totalObjects: number;
  totalSize: number;
  bucketStats: BucketStats[];
}

/**
 * Individual bucket statistics
 */
export interface BucketStats {
  name: string;
  objectCount: number;
  size: number;
  lastModified?: Date;
}

/**
 * Bucket creation options
 */
export interface CreateBucketOptions {
  name: string;
  region?: string;
  objectLocking?: boolean;
}

/**
 * Object listing options
 */
export interface ListObjectsOptions {
  bucket: string;
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
}

/**
 * Object listing response
 */
export interface ListObjectsResponse {
  objects: StorageObject[];
  isTruncated: boolean;
  nextContinuationToken?: string;
  prefix?: string;
}

/**
 * Download options
 */
export interface DownloadOptions {
  bucket: string;
  key: string;
}

/**
 * Delete options
 */
export interface DeleteOptions {
  bucket: string;
  key: string;
}

/**
 * Storage operation error
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Storage error codes
 */
export enum StorageErrorCode {
  BUCKET_NOT_FOUND = 'BUCKET_NOT_FOUND',
  OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
  BUCKET_ALREADY_EXISTS = 'BUCKET_ALREADY_EXISTS',
  INVALID_BUCKET_NAME = 'INVALID_BUCKET_NAME',
  ACCESS_DENIED = 'ACCESS_DENIED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Supported file types for preview
 */
export type PreviewableFileType = 'image' | 'pdf' | 'text' | 'video' | 'none';

/**
 * File metadata for UI display
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  previewType: PreviewableFileType;
}
