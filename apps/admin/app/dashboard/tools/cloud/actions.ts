/**
 * Storage Server Actions
 *
 * Server-side actions for Ozean Cloud storage operations.
 * All actions require authentication and use direct S3/MinIO connection.
 */

'use server';

import { requireAuth } from '@/lib/auth-utils';
import { getS3StorageClient, S3UploadFileResult } from '@/lib/storage/s3-client';
import { BUCKETS, BucketInfo } from './constants';
import type {
  EntityScope,
  GetFileUrlResult,
  DeleteFileResult,
  StorageHealthStatus,
} from '@/types/storage';

/**
 * Sanitize file path to prevent path traversal attacks
 *
 * Security measures:
 * - Removes path traversal sequences (..)
 * - Removes null bytes
 * - Removes leading slashes
 * - Rejects invalid characters
 * - Normalizes path separators
 *
 * @param path User-provided path
 * @returns Sanitized path
 * @throws Error if path contains malicious patterns
 */
function sanitizePath(path: string): string {
  // Check for path traversal attempts
  if (path.includes('..')) {
    throw new Error('Invalid file path: path traversal detected');
  }

  // Check for null bytes
  if (path.includes('\0')) {
    throw new Error('Invalid file path: null byte detected');
  }

  // Check for invalid characters (Windows/Unix reserved chars)
  if (path.match(/[<>:"|?*]/)) {
    throw new Error('Invalid file path: contains reserved characters');
  }

  // Remove leading slashes
  let sanitized = path.replace(/^\/+/, '');

  // Normalize path separators (convert backslashes to forward slashes)
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove duplicate slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  // Remove trailing slashes (unless it's explicitly a folder marker)
  if (!path.endsWith('/')) {
    sanitized = sanitized.replace(/\/+$/, '');
  }

  return sanitized;
}

// Note: BucketInfo and BUCKETS are in constants.ts
// 'use server' files can only export async functions

/**
 * Storage file with UI-friendly fields
 */
export interface StorageFileUI {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  bucket: string;
  isFolder: boolean;
  etag?: string;
}

/**
 * List files in a bucket
 *
 * @param bucket Bucket name
 * @param prefix Optional path prefix for folder navigation
 * @param limit Maximum files to return (default: 100)
 * @returns List of files and pagination info
 */
export async function getStorageFiles(
  bucket: string,
  prefix?: string,
  limit?: number
): Promise<{
  files: StorageFileUI[];
  nextMarker: string | null;
  truncated: boolean;
  count: number;
}> {
  await requireAuth();

  const client = getS3StorageClient();
  const result = await client.listFiles({
    bucket,
    prefix: prefix || '',
    limit: limit || 1000,
  });

  // Transform to UI-friendly format
  const files: StorageFileUI[] = result.files.map((file: { key: string; size: number; lastModified: Date; etag: string; isFolder?: boolean }) => {
    // Extract filename from key (handle folder paths ending with /)
    const cleanKey = file.key.replace(/\/$/, '');
    const pathParts = cleanKey.split('/');
    const name = pathParts[pathParts.length - 1] || cleanKey;

    // Use isFolder from API response, or detect from key pattern
    const isFolder = file.isFolder ?? (file.key.endsWith('/') || (file.size === 0 && !name.includes('.')));

    // Guess MIME type from extension
    const mimeType = isFolder ? 'application/x-directory' : getMimeType(name);

    return {
      id: file.key, // Use key as ID
      name,
      path: file.key,
      size: file.size,
      mimeType,
      uploadedAt: file.lastModified,
      bucket,
      isFolder,
      etag: file.etag,
    };
  });

  // Sort: folders first, then by name
  files.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return {
    files,
    nextMarker: result.nextMarker,
    truncated: result.truncated,
    count: result.count,
  };
}

/**
 * Upload a file to storage
 *
 * @param formData Form data containing file and metadata
 * @returns Upload result
 */
export async function uploadStorageFile(
  formData: FormData
): Promise<S3UploadFileResult> {
  const session = await requireAuth();

  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;
  const path = formData.get('path') as string | null;
  const entityScope = (formData.get('entityScope') as EntityScope) || 'shared';

  if (!file || !bucket) {
    throw new Error('File and bucket are required');
  }

  // Convert file to Buffer (no base64 overhead with direct S3)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Build file key with optional path prefix (sanitize path to prevent traversal)
  let fileKey: string;
  if (path) {
    const sanitizedPath = sanitizePath(path);
    const sanitizedFileName = sanitizePath(file.name);
    fileKey = `${sanitizedPath}/${sanitizedFileName}`;
  } else {
    fileKey = sanitizePath(file.name);
  }

  const client = getS3StorageClient();
  return client.uploadFile({
    bucket,
    fileKey,
    fileBuffer: buffer,
    contentType: file.type || 'application/octet-stream',
    metadata: {
      uploadedBy: session.user?.email || 'unknown',
      entityScope,
      originalFilename: file.name,
    },
  });
}

/**
 * Get a presigned download URL for a file
 *
 * @param bucket Bucket name
 * @param fileKey File path/key
 * @param expirySeconds URL expiry time (default: 3600 = 1 hour)
 * @returns Presigned URL with expiry info
 */
export async function getStorageUrl(
  bucket: string,
  fileKey: string,
  expirySeconds?: number
): Promise<GetFileUrlResult> {
  await requireAuth();

  const client = getS3StorageClient();
  return client.getFileUrl({
    bucket,
    fileKey,
    expirySeconds: expirySeconds || 3600, // 1 hour default
  });
}

/**
 * Delete a file from storage
 *
 * @param bucket Bucket name
 * @param fileKey File path/key
 * @returns Deletion confirmation
 */
export async function deleteStorageFile(
  bucket: string,
  fileKey: string
): Promise<DeleteFileResult> {
  await requireAuth();

  const client = getS3StorageClient();
  return client.deleteFile({ bucket, fileKey });
}

/**
 * Delete multiple files from storage
 *
 * @param bucket Bucket name
 * @param fileKeys Array of file paths/keys
 * @returns Array of deletion results
 */
export async function deleteStorageFilesBulk(
  bucket: string,
  fileKeys: string[]
): Promise<{ successful: string[]; failed: { fileKey: string; error: string }[] }> {
  await requireAuth();

  const client = getS3StorageClient();
  const successful: string[] = [];
  const failed: { fileKey: string; error: string }[] = [];

  // Delete files in parallel with error handling
  await Promise.all(
    fileKeys.map(async (fileKey) => {
      try {
        await client.deleteFile({ bucket, fileKey });
        successful.push(fileKey);
      } catch (error) {
        failed.push({
          fileKey,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    })
  );

  return { successful, failed };
}

/**
 * Create a folder (empty object with trailing slash)
 *
 * @param bucket Bucket name
 * @param folderPath Folder path (without trailing slash)
 * @returns Upload result for the folder marker
 */
export async function createFolder(
  bucket: string,
  folderPath: string
): Promise<S3UploadFileResult> {
  const session = await requireAuth();

  // Sanitize and normalize path: prevent traversal, then add trailing slash
  const sanitizedPath = sanitizePath(folderPath);
  const normalizedPath = sanitizedPath + '/';

  const client = getS3StorageClient();
  return client.uploadFile({
    bucket,
    fileKey: normalizedPath,
    fileBuffer: Buffer.from(''), // Empty content for folder marker
    contentType: 'application/x-directory',
    metadata: {
      uploadedBy: session.user?.email || 'unknown',
      entityScope: 'shared',
      originalFilename: normalizedPath,
    },
  });
}

/**
 * Get storage health status
 *
 * @returns Storage health metrics
 */
export async function getStorageHealth(): Promise<StorageHealthStatus> {
  await requireAuth();

  const client = getS3StorageClient();
  return client.checkHealth();
}

/**
 * Get storage statistics for a bucket
 *
 * @param bucket Bucket name
 * @returns Basic statistics
 */
export async function getStorageStats(bucket: string): Promise<{
  totalFiles: number;
  totalSize: number;
}> {
  await requireAuth();

  const client = getS3StorageClient();

  // List all files to calculate stats
  let totalFiles = 0;
  let totalSize = 0;
  let marker: string | undefined;

  do {
    const result = await client.listFiles({
      bucket,
      limit: 1000,
      marker,
    });

    totalFiles += result.count;
    totalSize += result.files.reduce((sum: number, f: { size: number }) => sum + f.size, 0);

    marker = result.nextMarker ?? undefined;
  } while (marker);

  return { totalFiles, totalSize };
}

/**
 * Get available buckets for the current user
 *
 * @returns Array of bucket info
 */
export async function getAvailableBuckets(): Promise<BucketInfo[]> {
  await requireAuth();

  // In the future, filter by user's entity access
  // For now, return all buckets
  return BUCKETS;
}

/**
 * Rename a file or folder in storage
 *
 * S3 doesn't support rename, so we copy to new key and delete old.
 * For folders, this recursively copies all contents.
 *
 * SAFETY: Only deletes after ALL copies complete successfully.
 *
 * @param bucket Bucket name
 * @param oldKey Current file path/key
 * @param newKey New file path/key
 * @returns Rename result
 */
export async function renameStorageFile(
  bucket: string,
  oldKey: string,
  newKey: string
): Promise<{ success: boolean; oldKey: string; newKey: string }> {
  await requireAuth();

  const client = getS3StorageClient();
  const isFolder = oldKey.endsWith('/');

  if (isFolder) {
    // For folders, get ALL files recursively first
    const allFiles = await listAllFilesRecursive(client, bucket, oldKey);

    if (allFiles.length === 0) {
      // Empty folder - just create new folder marker
      await client.uploadFile({
        bucket,
        fileKey: newKey,
        fileBuffer: Buffer.from(''),
        contentType: 'application/x-directory',
      });
    } else {
      // Copy all files first
      const copiedFiles: string[] = [];

      for (const file of allFiles) {
        const relativePath = file.key.slice(oldKey.length);
        const newFileKey = newKey + relativePath;

        try {
          await copyFileDirect(client, bucket, file.key, newFileKey);
          copiedFiles.push(file.key);
        } catch (err) {
          // Rollback: delete any files we already copied
          console.error(`Copy failed for ${file.key}:`, err);
          for (const copied of copiedFiles) {
            const copiedNewKey = newKey + copied.slice(oldKey.length);
            try {
              await client.deleteFile({ bucket, fileKey: copiedNewKey });
            } catch {
              // Ignore rollback errors
            }
          }
          throw new Error(`Rename failed: could not copy ${file.key}`);
        }
      }

      // All copies succeeded - now delete old files
      for (const file of allFiles) {
        await client.deleteFile({ bucket, fileKey: file.key });
      }
    }

    // Delete old folder marker if it exists
    try {
      await client.deleteFile({ bucket, fileKey: oldKey });
    } catch {
      // Folder marker might not exist, that's OK
    }
  } else {
    // For single files - copy then delete
    await copyFileDirect(client, bucket, oldKey, newKey);
    await client.deleteFile({ bucket, fileKey: oldKey });
  }

  return { success: true, oldKey, newKey };
}

/**
 * List ALL files under a prefix recursively (no delimiter)
 */
async function listAllFilesRecursive(
  _client: ReturnType<typeof getS3StorageClient>,
  bucket: string,
  prefix: string
): Promise<Array<{ key: string; size: number }>> {
  const allFiles: Array<{ key: string; size: number }> = [];

  // Use the S3 client directly to list without delimiter
  const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');

  const s3Config = {
    endpoint: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
    region: process.env.MINIO_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || '',
      secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    },
    forcePathStyle: true,
  };

  const s3 = new S3Client(s3Config);
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      // NO Delimiter - this gets ALL files recursively
    });

    const response = await s3.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        // Skip the folder marker itself and any sub-folder markers
        if (obj.Key && obj.Key !== prefix && !obj.Key.endsWith('/')) {
          allFiles.push({
            key: obj.Key,
            size: obj.Size || 0,
          });
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return allFiles;
}

/**
 * Copy a single file using S3 CopyObject (much faster than download/upload)
 */
async function copyFileDirect(
  _client: ReturnType<typeof getS3StorageClient>,
  bucket: string,
  sourceKey: string,
  destKey: string
): Promise<void> {
  const { S3Client, CopyObjectCommand } = await import('@aws-sdk/client-s3');

  const s3Config = {
    endpoint: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
    region: process.env.MINIO_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || '',
      secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    },
    forcePathStyle: true,
  };

  const s3 = new S3Client(s3Config);

  const command = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${sourceKey}`,
    Key: destKey,
  });

  await s3.send(command);
}

/**
 * Helper: Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',

    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',

    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // Code
    js: 'text/javascript',
    ts: 'text/typescript',
    jsx: 'text/javascript',
    tsx: 'text/typescript',
    html: 'text/html',
    css: 'text/css',
    json: 'application/json',
    xml: 'application/xml',
    md: 'text/markdown',

    // Other
    txt: 'text/plain',
    csv: 'text/csv',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}
