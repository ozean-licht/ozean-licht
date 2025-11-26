/**
 * Storage Module
 *
 * Exports direct S3/MinIO storage client and utilities.
 */

export {
  S3StorageClient,
  createStorageClient,
  getS3StorageClient,
  resetS3StorageClient,
  type S3UploadFileInput,
  type S3UploadFileResult,
  type S3StorageClientConfig,
} from './s3-client';
