/**
 * Type exports
 */

export * from './admin';
export * from './database';
export * from './mcp';
export * from './health';
// Re-export storage types, but rename EntityScope to avoid conflict with admin.ts
export type {
  EntityScope as StorageEntityScope,
  FileStatus,
  StorageMetadataRow,
  StorageMetadata,
  FileInfo,
  UploadFileInput,
  UploadFileResult,
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  GetFileUrlResult,
  DeleteFileInput,
  DeleteFileResult,
  StatFileInput,
  StatFileResult,
  StorageMetadataFilters,
  StorageStats,
  BucketConfig,
  UploadProgress,
  PresignedUrlWithMetadata,
  StorageOperationResult,
  StorageHealthStatus,
  MultipartUploadConfig,
  FileValidationResult,
  BucketStats,
  StorageQuota,
  FileMetadataDisplay,
  BulkOperationInput,
  BulkOperationResult,
} from './storage';
