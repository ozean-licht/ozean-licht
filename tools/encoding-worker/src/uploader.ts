/**
 * HLS Output Uploader for Hetzner Object Storage
 *
 * Handles uploading HLS segments, playlists, and thumbnails to S3-compatible
 * object storage with proper content types and CDN URL generation.
 */

import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Config, storageConfig, config } from './config.js';
import { pino } from 'pino';
import * as fs from 'fs';
import * as path from 'path';

// Setup logger
const logger = pino({
  level: config.LOG_LEVEL || 'info',
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// ================================================================
// Types
// ================================================================

/**
 * Result of uploading HLS output
 */
export interface UploadResult {
  manifestUrl: string;      // CDN URL to master.m3u8
  renditionUrls: Array<{
    quality: string;
    url: string;
  }>;
  thumbnailUrls: string[];
  totalBytes: number;
}

/**
 * Progress callback for upload monitoring
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// ================================================================
// S3 Client Singleton
// ================================================================

let s3ClientInstance: S3Client | null = null;

/**
 * Get or create S3 client singleton
 */
export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client(s3Config);
    logger.info(
      {
        endpoint: storageConfig.endpoint,
        bucket: storageConfig.bucket,
        region: storageConfig.region,
      },
      'S3 client initialized'
    );
  }
  return s3ClientInstance;
}

/**
 * Test S3 connection by checking bucket access
 */
export async function testS3Connection(): Promise<boolean> {
  try {
    const client = getS3Client();
    const command = new HeadBucketCommand({
      Bucket: storageConfig.bucket,
    });
    await client.send(command);
    logger.info({ bucket: storageConfig.bucket }, 'S3 bucket accessible');
    return true;
  } catch (error) {
    logger.error(
      {
        error,
        bucket: storageConfig.bucket,
        endpoint: storageConfig.endpoint,
      },
      'Failed to access S3 bucket'
    );
    return false;
  }
}

// ================================================================
// Content Type Detection
// ================================================================

/**
 * Get content type for file based on extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  const contentTypeMap: Record<string, string> = {
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.ts': 'video/MP2T',
    '.mp4': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.json': 'application/json',
    '.vtt': 'text/vtt',
  };

  return contentTypeMap[ext] || 'application/octet-stream';
}

// ================================================================
// Path Sanitization
// ================================================================

/**
 * Sanitize S3 key to prevent path traversal attacks
 *
 * Removes:
 * - Leading slashes
 * - Path traversal sequences (.., ./)
 * - Consecutive slashes
 * - Normalizes path separators
 *
 * @param key - Raw S3 key that may contain unsafe characters
 * @returns Sanitized S3 key safe for use
 */
export function sanitizeS3Key(key: string): string {
  // Remove leading slashes
  let sanitized = key.replace(/^\/+/, '');

  // Remove path traversal sequences
  sanitized = sanitized.replace(/\.\.\//g, '');
  sanitized = sanitized.replace(/\.\./g, '');
  sanitized = sanitized.replace(/\.\//g, '');

  // Normalize path separators (replace backslashes with forward slashes)
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove consecutive slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  // Remove trailing slashes
  sanitized = sanitized.replace(/\/+$/, '');

  return sanitized;
}

// ================================================================
// CDN URL Generation
// ================================================================

/**
 * Convert S3 key to CDN URL
 */
export function getCdnUrl(s3Key: string): string {
  // Sanitize the key first
  const cleanKey = sanitizeS3Key(s3Key);

  // Use CDN base URL from config
  const baseUrl = storageConfig.cdnBaseUrl.endsWith('/')
    ? storageConfig.cdnBaseUrl.slice(0, -1)
    : storageConfig.cdnBaseUrl;

  return `${baseUrl}/${cleanKey}`;
}

// ================================================================
// File Upload Functions
// ================================================================

/**
 * Upload a single file to S3
 */
export async function uploadFile(
  localPath: string,
  s3Key: string,
  contentType?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const client = getS3Client();

  // Sanitize S3 key to prevent path traversal
  const sanitizedKey = sanitizeS3Key(s3Key);

  // Validate file exists
  if (!fs.existsSync(localPath)) {
    throw new Error(`File not found: ${localPath}`);
  }

  const fileStats = fs.statSync(localPath);
  const fileSize = fileStats.size;
  const actualContentType = contentType || getContentType(localPath);

  logger.debug(
    {
      localPath,
      s3Key: sanitizedKey,
      contentType: actualContentType,
      fileSize,
    },
    'Uploading file'
  );

  try {
    const fileStream = fs.createReadStream(localPath);

    // Use multipart upload for files larger than 5MB
    const useMultipart = fileSize > 5 * 1024 * 1024;

    if (useMultipart) {
      // Multipart upload with progress tracking
      const upload = new Upload({
        client,
        params: {
          Bucket: storageConfig.bucket,
          Key: sanitizedKey,
          Body: fileStream,
          ContentType: actualContentType,
        },
        queueSize: 4, // Number of concurrent parts
        partSize: 5 * 1024 * 1024, // 5MB parts
      });

      // Track progress
      if (onProgress) {
        upload.on('httpUploadProgress', (progress) => {
          const loaded = progress.loaded || 0;
          const total = progress.total || fileSize;
          const percent = total > 0 ? (loaded / total) * 100 : 0;

          onProgress({
            loaded,
            total,
            percent,
          });
        });
      }

      await upload.done();
    } else {
      // Simple PutObject for smaller files
      const command = new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: sanitizedKey,
        Body: fileStream,
        ContentType: actualContentType,
      });

      await client.send(command);

      // Call progress callback with 100% completion
      if (onProgress) {
        onProgress({
          loaded: fileSize,
          total: fileSize,
          percent: 100,
        });
      }
    }

    const cdnUrl = getCdnUrl(sanitizedKey);

    logger.info(
      {
        localPath,
        s3Key: sanitizedKey,
        cdnUrl,
        fileSize,
        contentType: actualContentType,
      },
      'File uploaded successfully'
    );

    return cdnUrl;
  } catch (error) {
    logger.error(
      {
        error,
        localPath,
        s3Key: sanitizedKey,
        fileSize,
      },
      'Failed to upload file'
    );
    throw new Error(`Failed to upload file ${localPath}: ${error}`);
  }
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath: string, baseDir: string = dirPath): string[] {
  const files: string[] = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      // Store relative path from base directory
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Upload entire HLS directory structure
 */
export async function uploadHLSOutput(
  localDir: string,
  s3KeyPrefix: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Sanitize the key prefix to prevent path traversal
  const sanitizedPrefix = sanitizeS3Key(s3KeyPrefix);

  logger.info(
    {
      localDir,
      s3KeyPrefix: sanitizedPrefix,
    },
    'Starting HLS output upload'
  );

  // Validate directory exists
  if (!fs.existsSync(localDir)) {
    throw new Error(`Directory not found: ${localDir}`);
  }

  const dirStats = fs.statSync(localDir);
  if (!dirStats.isDirectory()) {
    throw new Error(`Path is not a directory: ${localDir}`);
  }

  // Get all files in directory
  const files = getAllFiles(localDir);

  if (files.length === 0) {
    throw new Error(`No files found in directory: ${localDir}`);
  }

  logger.info({ fileCount: files.length }, 'Found files to upload');

  // Calculate total size
  let totalBytes = 0;
  for (const file of files) {
    const fullPath = path.join(localDir, file);
    const stats = fs.statSync(fullPath);
    totalBytes += stats.size;
  }

  let uploadedBytes = 0;
  const renditionUrls: Array<{ quality: string; url: string }> = [];
  let manifestUrl = '';

  // Upload all files
  for (const file of files) {
    const localPath = path.join(localDir, file);
    const s3Key = path.join(sanitizedPrefix, file).replace(/\\/g, '/'); // Normalize path separators

    // Track file-level progress
    const fileStats = fs.statSync(localPath);
    const fileSize = fileStats.size;

    const fileProgressCallback = onProgress
      ? (fileProgress: UploadProgress) => {
          // Calculate overall progress
          const currentBytes = uploadedBytes + fileProgress.loaded;
          const overallPercent =
            totalBytes > 0 ? (currentBytes / totalBytes) * 100 : 0;

          onProgress({
            loaded: currentBytes,
            total: totalBytes,
            percent: overallPercent,
          });
        }
      : undefined;

    const cdnUrl = await uploadFile(
      localPath,
      s3Key,
      getContentType(localPath),
      fileProgressCallback
    );

    // Track master manifest
    if (file === 'master.m3u8' || file === 'index.m3u8') {
      manifestUrl = cdnUrl;
    }

    // Track rendition playlists
    if (file.endsWith('.m3u8') && file !== 'master.m3u8' && file !== 'index.m3u8') {
      // Extract quality from filename (e.g., "720p.m3u8" -> "720p")
      const quality = path.basename(file, '.m3u8');
      renditionUrls.push({
        quality,
        url: cdnUrl,
      });
    }

    uploadedBytes += fileSize;
  }

  // Final progress update
  if (onProgress) {
    onProgress({
      loaded: totalBytes,
      total: totalBytes,
      percent: 100,
    });
  }

  logger.info(
    {
      localDir,
      s3KeyPrefix: sanitizedPrefix,
      fileCount: files.length,
      totalBytes,
      manifestUrl,
      renditionCount: renditionUrls.length,
    },
    'HLS output upload complete'
  );

  return {
    manifestUrl,
    renditionUrls,
    thumbnailUrls: [], // Thumbnails uploaded separately
    totalBytes,
  };
}

/**
 * Upload thumbnail files
 */
export async function uploadThumbnails(
  thumbnailPaths: string[],
  s3KeyPrefix: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string[]> {
  // Sanitize the key prefix to prevent path traversal
  const sanitizedPrefix = sanitizeS3Key(s3KeyPrefix);

  logger.info(
    {
      thumbnailCount: thumbnailPaths.length,
      s3KeyPrefix: sanitizedPrefix,
    },
    'Starting thumbnail upload'
  );

  if (thumbnailPaths.length === 0) {
    logger.warn('No thumbnails to upload');
    return [];
  }

  // Calculate total size
  let totalBytes = 0;
  for (const thumbnailPath of thumbnailPaths) {
    if (fs.existsSync(thumbnailPath)) {
      const stats = fs.statSync(thumbnailPath);
      totalBytes += stats.size;
    }
  }

  let uploadedBytes = 0;
  const thumbnailUrls: string[] = [];

  // Upload each thumbnail
  for (const thumbnailPath of thumbnailPaths) {
    if (!fs.existsSync(thumbnailPath)) {
      logger.warn({ thumbnailPath }, 'Thumbnail file not found, skipping');
      continue;
    }

    const fileName = path.basename(thumbnailPath);
    const s3Key = path.join(sanitizedPrefix, fileName).replace(/\\/g, '/');

    const fileStats = fs.statSync(thumbnailPath);
    const fileSize = fileStats.size;

    const fileProgressCallback = onProgress
      ? (fileProgress: UploadProgress) => {
          const currentBytes = uploadedBytes + fileProgress.loaded;
          const overallPercent =
            totalBytes > 0 ? (currentBytes / totalBytes) * 100 : 0;

          onProgress({
            loaded: currentBytes,
            total: totalBytes,
            percent: overallPercent,
          });
        }
      : undefined;

    const cdnUrl = await uploadFile(
      thumbnailPath,
      s3Key,
      getContentType(thumbnailPath),
      fileProgressCallback
    );

    thumbnailUrls.push(cdnUrl);
    uploadedBytes += fileSize;
  }

  // Final progress update
  if (onProgress) {
    onProgress({
      loaded: totalBytes,
      total: totalBytes,
      percent: 100,
    });
  }

  logger.info(
    {
      uploadedCount: thumbnailUrls.length,
      totalBytes,
    },
    'Thumbnail upload complete'
  );

  return thumbnailUrls;
}

// ================================================================
// Cleanup
// ================================================================

/**
 * Close S3 client and cleanup resources
 */
export async function closeS3Client(): Promise<void> {
  if (s3ClientInstance) {
    s3ClientInstance.destroy();
    s3ClientInstance = null;
    logger.info('S3 client closed');
  }
}

// ================================================================
// Exports
// ================================================================

export default {
  getS3Client,
  testS3Connection,
  uploadFile,
  uploadHLSOutput,
  uploadThumbnails,
  getCdnUrl,
  sanitizeS3Key,
  closeS3Client,
};
