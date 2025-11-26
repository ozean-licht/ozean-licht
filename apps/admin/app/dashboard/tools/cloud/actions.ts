/**
 * Storage Server Actions
 *
 * Server-side actions for Ozean Cloud storage operations.
 * All actions require authentication and communicate via MCP Gateway.
 */

'use server';

import { requireAuth } from '@/lib/auth-utils';
import { getStorageClient, MCPUploadFileResult } from '@/lib/mcp-client/storage';
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

/**
 * Bucket configuration for Ozean Cloud
 */
export interface BucketInfo {
  name: string;
  displayName: string;
  description: string;
  entityScope: EntityScope;
}

/**
 * Available buckets in the system
 */
export const BUCKETS: BucketInfo[] = [
  {
    name: 'kids-ascension-staging',
    displayName: 'Kids Ascension',
    description: 'Content for Kids Ascension platform',
    entityScope: 'kids_ascension',
  },
  {
    name: 'ozean-licht-assets',
    displayName: 'Ozean Licht',
    description: 'Assets for Ozean Licht Akademie',
    entityScope: 'ozean_licht',
  },
  {
    name: 'shared-assets',
    displayName: 'Shared Assets',
    description: 'Shared files across platforms',
    entityScope: 'shared',
  },
];

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

  const client = getStorageClient();
  const result = await client.listFiles({
    bucket,
    prefix: prefix || '',
    limit: limit || 100,
  });

  // Transform to UI-friendly format
  const files: StorageFileUI[] = result.files.map((file: { key: string; size: number; lastModified: Date; etag: string }) => {
    // Extract filename from key
    const pathParts = file.key.split('/');
    const name = pathParts[pathParts.length - 1] || file.key;

    // Detect if it's a folder (ends with / or has no extension and size is 0)
    const isFolder = file.key.endsWith('/') || (file.size === 0 && !name.includes('.'));

    // Guess MIME type from extension
    const mimeType = getMimeType(name);

    return {
      id: file.key, // Use key as ID
      name: isFolder ? name.replace(/\/$/, '') : name,
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
): Promise<MCPUploadFileResult> {
  const session = await requireAuth();

  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;
  const path = formData.get('path') as string | null;
  const entityScope = (formData.get('entityScope') as EntityScope) || 'shared';

  if (!file || !bucket) {
    throw new Error('File and bucket are required');
  }

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');

  // Build file key with optional path prefix (sanitize path to prevent traversal)
  let fileKey: string;
  if (path) {
    const sanitizedPath = sanitizePath(path);
    const sanitizedFileName = sanitizePath(file.name);
    fileKey = `${sanitizedPath}/${sanitizedFileName}`;
  } else {
    fileKey = sanitizePath(file.name);
  }

  const client = getStorageClient();
  return client.uploadFile({
    bucket,
    fileKey,
    fileBuffer: base64,
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

  const client = getStorageClient();
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

  const client = getStorageClient();
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

  const client = getStorageClient();
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
): Promise<MCPUploadFileResult> {
  const session = await requireAuth();

  // Sanitize and normalize path: prevent traversal, then add trailing slash
  const sanitizedPath = sanitizePath(folderPath);
  const normalizedPath = sanitizedPath + '/';

  const client = getStorageClient();
  return client.uploadFile({
    bucket,
    fileKey: normalizedPath,
    fileBuffer: '', // Empty content for folder marker
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

  const client = getStorageClient();
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

  const client = getStorageClient();

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
