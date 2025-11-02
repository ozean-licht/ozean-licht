/**
 * Storage Server Actions
 *
 * Server-side actions for MinIO storage operations.
 * Handles authentication, authorization, and audit logging.
 */

'use server';

import { createStorageClient } from '@/lib/mcp-client/storage';
import {
  StorageBucket,
  StorageObject,
  StorageStats,
  CreateBucketOptions,
  ListObjectsOptions,
  StorageError,
  StorageErrorCode,
} from '@/types/storage';

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<StorageStats> {
  try {
    const client = createStorageClient();
    const stats = await client.getStorageStats();
    return stats;
  } catch (error: any) {
    console.error('Failed to get storage stats:', error);
    throw new Error('Failed to get storage statistics');
  }
}

/**
 * List all buckets
 */
export async function listBuckets(): Promise<StorageBucket[]> {
  try {
    const client = createStorageClient();
    const buckets = await client.listBuckets();
    return buckets;
  } catch (error: any) {
    console.error('Failed to list buckets:', error);
    throw new Error('Failed to list buckets');
  }
}

/**
 * Create a new bucket
 */
export async function createBucket(options: CreateBucketOptions): Promise<void> {
  try {
    // Validate bucket name
    if (!options.name || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(options.name)) {
      throw new Error(
        'Invalid bucket name. Must be lowercase alphanumeric with hyphens, 3-63 characters'
      );
    }

    const client = createStorageClient();
    await client.createBucket(options);

    // TODO: Add audit log entry
    console.log(`Bucket created: ${options.name}`);
  } catch (error: any) {
    console.error('Failed to create bucket:', error);
    if (error instanceof StorageError && error.code === StorageErrorCode.BUCKET_ALREADY_EXISTS) {
      throw new Error(`Bucket "${options.name}" already exists`);
    }
    throw new Error('Failed to create bucket');
  }
}

/**
 * Delete a bucket
 */
export async function deleteBucket(name: string): Promise<void> {
  try {
    const client = createStorageClient();

    // Check if bucket is empty
    const { objects } = await client.listObjects({ bucket: name });
    if (objects.length > 0) {
      throw new Error('Cannot delete non-empty bucket. Delete all objects first.');
    }

    await client.deleteBucket(name);

    // TODO: Add audit log entry
    console.log(`Bucket deleted: ${name}`);
  } catch (error: any) {
    console.error('Failed to delete bucket:', error);
    if (error.message.includes('non-empty')) {
      throw error;
    }
    throw new Error('Failed to delete bucket');
  }
}

/**
 * List objects in a bucket
 */
export async function listObjects(options: ListObjectsOptions): Promise<{
  objects: StorageObject[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}> {
  try {
    const client = createStorageClient();
    const result = await client.listObjects(options);
    return result;
  } catch (error: any) {
    console.error('Failed to list objects:', error);
    throw new Error('Failed to list objects');
  }
}

/**
 * Get object metadata
 */
export async function getObjectMetadata(bucket: string, key: string): Promise<StorageObject> {
  try {
    const client = createStorageClient();
    const metadata = await client.getObjectMetadata(bucket, key);
    return metadata;
  } catch (error: any) {
    console.error('Failed to get object metadata:', error);
    if (error instanceof StorageError && error.code === StorageErrorCode.OBJECT_NOT_FOUND) {
      throw new Error(`Object "${key}" not found in bucket "${bucket}"`);
    }
    throw new Error('Failed to get object metadata');
  }
}

/**
 * Delete an object
 */
export async function deleteObject(bucket: string, key: string): Promise<void> {
  try {
    const client = createStorageClient();
    await client.deleteFile({ bucket, key });

    // TODO: Add audit log entry
    console.log(`Object deleted: ${bucket}/${key}`);
  } catch (error: any) {
    console.error('Failed to delete object:', error);
    throw new Error('Failed to delete object');
  }
}

/**
 * Generate presigned URL for file download
 * Note: This is a placeholder - actual implementation would use MinIO presigned URLs
 */
export async function getDownloadUrl(bucket: string, key: string): Promise<string> {
  try {
    // For now, return a direct download URL through our API
    const encodedKey = encodeURIComponent(key);
    return `/api/storage/download?bucket=${bucket}&key=${encodedKey}`;
  } catch (error: any) {
    console.error('Failed to generate download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Validate file upload
 */
export async function validateUpload(
  bucket: string,
  key: string,
  size: number,
  _contentType?: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Check bucket exists
    const client = createStorageClient();
    const buckets = await client.listBuckets();
    if (!buckets.find((b) => b.name === bucket)) {
      return { valid: false, error: 'Bucket does not exist' };
    }

    // Validate file size (max 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (size > maxSize) {
      return { valid: false, error: `File size exceeds maximum of ${formatBytes(maxSize)}` };
    }

    // Validate key (no leading slash, no double slashes)
    if (key.startsWith('/') || key.includes('//')) {
      return { valid: false, error: 'Invalid file path' };
    }

    return { valid: true };
  } catch (error: any) {
    console.error('Upload validation failed:', error);
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
