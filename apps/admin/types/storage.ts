/**
 * Storage Types
 * TypeScript types for MinIO S3 storage operations and metadata management
 */

/**
 * Entity scope for file storage
 */
export type EntityScope = 'kids_ascension' | 'ozean_licht' | 'shared';

/**
 * File lifecycle status
 */
export type FileStatus = 'active' | 'archived' | 'deleted' | 'processing';

/**
 * Database row type (snake_case as returned from PostgreSQL)
 */
export interface StorageMetadataRow {
  id: string;
  file_key: string;
  bucket_name: string;
  original_filename: string;
  content_type: string;
  file_size_bytes: number;
  checksum_md5: string | null;
  entity_scope: EntityScope;
  uploaded_by: string;
  uploaded_at: Date;
  status: FileStatus;
  archived_to_r2: boolean;
  archived_at: Date | null;
  deleted_at: Date | null;
  metadata: Record<string, any>;
  tags: string[];
}

/**
 * Domain type (camelCase for application use)
 */
export interface StorageMetadata {
  id: string;
  fileKey: string;
  bucketName: string;
  originalFilename: string;
  contentType: string;
  fileSizeBytes: number;
  checksumMd5: string | null;
  entityScope: EntityScope;
  uploadedBy: string;
  uploadedAt: Date;
  status: FileStatus;
  archivedToR2: boolean;
  archivedAt: Date | null;
  deletedAt: Date | null;
  metadata: Record<string, any>;
  tags: string[];
}

/**
 * File metadata from MinIO (for display)
 */
export interface FileInfo {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
  presignedUrl?: string;
}

/**
 * Upload file input parameters
 */
export interface UploadFileInput {
  bucket: string;
  fileKey: string;
  fileBuffer: Buffer;
  contentType: string;
  metadata: {
    uploadedBy: string;
    entityScope: EntityScope;
    originalFilename: string;
    tags?: string[];
    customMetadata?: Record<string, any>;
  };
}

/**
 * Upload file result
 */
export interface UploadFileResult {
  fileKey: string;
  bucket: string;
  url: string;
  size: number;
  etag: string;
  contentType: string;
  checksumMd5: string;
  metadata: {
    uploadedBy: string;
    entityScope: EntityScope;
    originalFilename: string;
  };
}

/**
 * List files input parameters
 */
export interface ListFilesInput {
  bucket: string;
  prefix?: string;
  limit?: number;
  marker?: string;
}

/**
 * List files result
 */
export interface ListFilesResult {
  files: FileInfo[];
  nextMarker: string | null;
  truncated: boolean;
  count: number;
}

/**
 * Get presigned URL input parameters
 */
export interface GetFileUrlInput {
  bucket: string;
  fileKey: string;
  expirySeconds?: number;
}

/**
 * Get presigned URL result
 */
export interface GetFileUrlResult {
  url: string;
  expiresIn: number;
  expiresAt: string;
}

/**
 * Delete file input parameters
 */
export interface DeleteFileInput {
  bucket: string;
  fileKey: string;
}

/**
 * Delete file result
 */
export interface DeleteFileResult {
  success: boolean;
  bucket: string;
  fileKey: string;
  deletedAt: string;
}

/**
 * Get file stat input parameters
 */
export interface StatFileInput {
  bucket: string;
  fileKey: string;
}

/**
 * Get file stat result
 */
export interface StatFileResult {
  size: number;
  lastModified: Date;
  etag: string;
  contentType: string;
  metadata: Record<string, any>;
}

/**
 * Storage metadata query filters
 */
export interface StorageMetadataFilters {
  bucketName?: string;
  entityScope?: EntityScope;
  uploadedBy?: string;
  status?: FileStatus;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

/**
 * Storage statistics
 */
export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  filesByBucket: Record<string, number>;
  sizeByBucket: Record<string, number>;
  filesByEntity: Record<EntityScope, number>;
  filesByStatus: Record<FileStatus, number>;
  recentUploads: StorageMetadata[];
}

/**
 * Bucket configuration
 */
export interface BucketConfig {
  name: string;
  displayName: string;
  description: string;
  entityScope: EntityScope;
  allowedContentTypes: string[];
  maxFileSize: number;
  defaultExpiry: number;
}

/**
 * File upload progress
 */
export interface UploadProgress {
  fileKey: string;
  filename: string;
  size: number;
  uploaded: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

/**
 * Presigned URL with metadata
 */
export interface PresignedUrlWithMetadata {
  url: string;
  expiresAt: string;
  fileKey: string;
  filename: string;
  contentType: string;
  size: number;
}

/**
 * Storage operation result (generic)
 */
export interface StorageOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    operation: string;
    duration: number;
    timestamp: string;
  };
}

/**
 * Storage health status
 */
export interface StorageHealthStatus {
  healthy: boolean;
  service: string;
  latency?: number;
  bucketsCount?: number;
  error?: string;
  timestamp: string;
}

/**
 * Multipart upload configuration
 */
export interface MultipartUploadConfig {
  partSize: number; // in bytes
  maxConcurrency: number;
  queueSize: number;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Bucket statistics
 */
export interface BucketStats {
  name: string;
  fileCount: number;
  totalSize: number;
  lastModified: Date;
  quota?: number;
  percentUsed?: number;
}

/**
 * Storage quota configuration
 */
export interface StorageQuota {
  entityScope: EntityScope;
  maxStorage: number; // in bytes
  currentUsage: number; // in bytes
  percentUsed: number;
  filesCount: number;
  warningThreshold: number; // percentage
  exceeded: boolean;
}

/**
 * File metadata for display in UI
 */
export interface FileMetadataDisplay {
  id: string;
  filename: string;
  bucket: string;
  size: string; // formatted (e.g., "10.5 MB")
  contentType: string;
  uploadedBy: string;
  uploadedAt: string; // formatted date
  status: FileStatus;
  tags: string[];
  canDownload: boolean;
  canDelete: boolean;
  thumbnailUrl?: string;
}

/**
 * Bulk operation input
 */
export interface BulkOperationInput {
  fileKeys: string[];
  bucket: string;
  operation: 'delete' | 'archive' | 'tag' | 'move';
  options?: Record<string, any>;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  successful: string[];
  failed: { fileKey: string; error: string }[];
  totalProcessed: number;
  duration: number;
}
