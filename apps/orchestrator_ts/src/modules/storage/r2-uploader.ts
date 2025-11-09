/**
 * R2 Storage Uploader Module
 *
 * Provides upload functionality for ADW workflow artifacts to Cloudflare R2
 * (S3-compatible object storage). Uploads are optional and gracefully disabled
 * if required environment variables are not present.
 *
 * Key features:
 * - Singleton S3 client for performance
 * - Conditional initialization (no errors if credentials missing)
 * - Custom object key patterns (adw/{adw_id}/review/{filename})
 * - Public URL generation for uploaded files
 * - Batch upload support for screenshots
 *
 * Migrated from Python: adws/adw_modules/r2_uploader.py
 *
 * @module modules/storage/r2-uploader
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Cached S3 client instance
 * Initialized on first upload if credentials are available
 */
let s3Client: S3Client | null = null;

/**
 * Flag indicating if R2 uploads are enabled
 * Set to false if required environment variables are missing
 */
let uploadsEnabled = false;

/**
 * Cached R2 configuration
 */
interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
}

let r2Config: R2Config | null = null;

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize R2 client if all required environment variables are present
 *
 * This function is called automatically on first upload attempt.
 * If any required environment variable is missing, uploads will be disabled
 * and all upload calls will return null gracefully.
 *
 * @returns True if initialization succeeded, false otherwise
 *
 * @example
 * ```typescript
 * // Automatic initialization on first upload
 * const url = await uploadFile('screenshot.png');
 * // Returns null if credentials not configured (graceful degradation)
 * ```
 */
function initializeR2Client(): boolean {
  if (s3Client !== null) {
    return uploadsEnabled;
  }

  // Check for required environment variables
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucketName = env.R2_BUCKET_NAME;
  const publicDomain = env.R2_PUBLIC_DOMAIN ?? 'tac-public-imgs.iddagents.com';

  // All are optional in env.ts, so check if they're actually set
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    logger.info('R2 uploads disabled - missing required environment variables');
    uploadsEnabled = false;
    return false;
  }

  try {
    // Create S3 client configured for Cloudflare R2
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    s3Client = new S3Client({
      region: 'us-east-1', // R2 uses this as a placeholder
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    r2Config = {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicDomain,
    };

    uploadsEnabled = true;
    logger.info({ bucket: bucketName, domain: publicDomain }, 'R2 uploads enabled');
    return true;
  } catch (error) {
    logger.warn({ error }, 'Failed to initialize R2 client');
    uploadsEnabled = false;
    return false;
  }
}

// ============================================================================
// Upload Functions
// ============================================================================

/**
 * Upload a file to R2 and return the public URL
 *
 * Uploads a file to Cloudflare R2 with a custom object key and returns
 * the public URL. If R2 is not configured (missing env vars), returns null
 * gracefully without throwing errors.
 *
 * @param filePath - Absolute path to the file to upload
 * @param objectKey - Optional S3 object key (defaults to adw/review/{filename})
 * @returns Public URL if successful, null if disabled or failed
 *
 * @example
 * ```typescript
 * // Upload with default key pattern
 * const url = await uploadFile('/path/to/screenshot.png');
 * // url: https://tac-public-imgs.iddagents.com/adw/review/screenshot.png
 *
 * // Upload with custom key
 * const url2 = await uploadFile('/path/to/log.txt', 'adw/abc12345/logs/build.log');
 * // url2: https://tac-public-imgs.iddagents.com/adw/abc12345/logs/build.log
 * ```
 */
export async function uploadFile(
  filePath: string,
  objectKey?: string
): Promise<string | null> {
  // Initialize client on first use
  if (s3Client === null) {
    const initialized = initializeR2Client();
    if (!initialized) {
      return null;
    }
  }

  if (!uploadsEnabled || !s3Client || !r2Config) {
    return null;
  }

  // Generate object key if not provided
  const key = objectKey ?? `adw/review/${basename(filePath)}`;

  try {
    // Read file contents
    const fileBuffer = await readFile(filePath);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: key,
      Body: fileBuffer,
    });

    await s3Client.send(command);

    // Generate public URL
    const publicUrl = `https://${r2Config.publicDomain}/${key}`;

    logger.info({ filePath, objectKey: key, publicUrl }, 'File uploaded to R2');
    return publicUrl;
  } catch (error) {
    logger.error({ error, filePath, objectKey: key }, 'Failed to upload file to R2');
    return null;
  }
}

/**
 * Upload multiple screenshots and return URL mapping
 *
 * Uploads a batch of screenshots to R2 and returns a mapping of local paths
 * to public URLs. If a screenshot fails to upload or R2 is disabled, the
 * original local path is used in the mapping.
 *
 * @param screenshots - Array of absolute file paths to upload
 * @param adwId - ADW workflow ID for organizing uploads
 * @returns Object mapping local paths to public URLs (or original paths if upload failed)
 *
 * @example
 * ```typescript
 * const screenshots = [
 *   '/tmp/screenshot1.png',
 *   '/tmp/screenshot2.png'
 * ];
 *
 * const urlMapping = await uploadScreenshots(screenshots, 'abc12345');
 * // {
 * //   '/tmp/screenshot1.png': 'https://tac-public-imgs.iddagents.com/adw/abc12345/review/screenshot1.png',
 * //   '/tmp/screenshot2.png': 'https://tac-public-imgs.iddagents.com/adw/abc12345/review/screenshot2.png'
 * // }
 * ```
 */
export async function uploadScreenshots(
  screenshots: string[],
  adwId: string
): Promise<Record<string, string>> {
  const urlMapping: Record<string, string> = {};

  for (const screenshot of screenshots) {
    if (!screenshot) {
      continue;
    }

    // Generate object key with ADW ID for organization
    const filename = basename(screenshot);
    const objectKey = `adw/${adwId}/review/${filename}`;

    // Upload and get public URL
    const publicUrl = await uploadFile(screenshot, objectKey);

    // Map to public URL if successful, otherwise keep original path
    urlMapping[screenshot] = publicUrl ?? screenshot;
  }

  logger.debug({ count: screenshots.length, adwId }, 'Uploaded screenshots to R2');
  return urlMapping;
}

/**
 * Check if R2 uploads are currently enabled
 *
 * @returns True if R2 client is initialized and ready
 *
 * @example
 * ```typescript
 * if (isR2Enabled()) {
 *   await uploadFile('screenshot.png');
 * } else {
 *   logger.info('R2 disabled, storing locally');
 * }
 * ```
 */
export function isR2Enabled(): boolean {
  if (s3Client === null) {
    initializeR2Client();
  }
  return uploadsEnabled;
}
