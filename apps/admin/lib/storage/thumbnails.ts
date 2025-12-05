/**
 * Thumbnail Generation Module
 *
 * Handles thumbnail generation for images using sharp.
 * Generates multiple thumbnail sizes and uploads them to MinIO.
 *
 * Phase 11 of Project Management MVP - Message Attachments
 */

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3StorageClient } from './s3-client';
import { ATTACHMENT_CONFIG } from './messaging-config';

/**
 * Check if a MIME type is an image
 *
 * @param mimeType - The MIME type to check
 * @returns True if the MIME type represents an image
 */
export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Retry wrapper for asynchronous operations
 *
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @param delay - Delay between retries in milliseconds (default: 1000)
 * @returns The result of the function
 */
async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't delay after the last attempt
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error('All retry attempts failed');
}

/**
 * Download a file from MinIO storage
 *
 * @param bucket - The bucket name
 * @param key - The file key/path
 * @returns The file content as a Buffer
 * @throws Error if the file cannot be downloaded
 */
export async function downloadFileFromMinIO(bucket: string, key: string): Promise<Buffer> {
  try {
    const client = getS3StorageClient();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    // Get the S3 client instance using proper method
    const s3Client = client.getClient();
    const response = await s3Client.send(command);

    // Convert the readable stream to a Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download file from MinIO: ${error.message}`);
    }
    throw new Error('Failed to download file from MinIO: Unknown error');
  }
}

/**
 * Generate thumbnails for an image and upload to MinIO
 *
 * Generates thumbnails at predefined sizes and uploads them to MinIO.
 * The thumbnails are stored in a parallel path structure replacing '/original/'
 * with '/thumbnails/{width}x{height}.jpg'.
 *
 * This function handles sharp not being available gracefully by catching
 * import errors and returning undefined.
 *
 * @param bucket - The bucket name where the original image is stored
 * @param originalPath - The path/key of the original image
 * @param originalBuffer - The original image buffer
 * @returns The presigned URL for the small (200x200) thumbnail, or undefined if generation fails
 */
export async function generateThumbnails(
  bucket: string,
  originalPath: string,
  originalBuffer: Buffer
): Promise<string | undefined> {
  try {
    // Dynamically import sharp (it's a native dependency that may not be available in all environments)
    // Sharp uses default export in ESM
    let sharpModule: any = null;
    try {
      const imported: any = await import('sharp');
      sharpModule = imported.default || imported;
    } catch {
      console.warn('Sharp is not available. Skipping thumbnail generation.');
      return undefined;
    }

    if (!sharpModule) {
      return undefined;
    }

    const client = getS3StorageClient();
    let smallThumbnailUrl: string | undefined;

    // Generate and upload each thumbnail size
    for (const size of ATTACHMENT_CONFIG.thumbnailSizes) {
      try {
        // Use retry logic for thumbnail generation and upload
        const uploadResult = await retryAsync(async () => {
          // Resize image with sharp
          const thumbnailBuffer = await sharpModule(originalBuffer)
            .resize(size.width, size.height, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({
              quality: 80,
              mozjpeg: true,
            })
            .toBuffer();

          // Generate thumbnail path: replace '/original/' with '/thumbnails/{width}x{height}.jpg'
          const thumbnailPath = originalPath.replace(
            '/original/',
            `/thumbnails/${size.width}x${size.height}.jpg`
          );

          // Upload thumbnail to MinIO
          return await client.uploadFile({
            bucket,
            fileKey: thumbnailPath,
            fileBuffer: thumbnailBuffer,
            contentType: 'image/jpeg',
            metadata: {
              uploadedBy: 'system',
              entityScope: 'shared',
              originalFilename: `${size.name}-thumbnail.jpg`,
            },
          });
        }, 2, 1000); // Retry up to 2 times with 1 second delay

        // Save the small thumbnail URL for return
        if (size.name === 'small') {
          smallThumbnailUrl = uploadResult.url;
        }
      } catch (sizeError) {
        // Log error but continue with other sizes
        console.error(`Failed to generate ${size.name} thumbnail after retries:`, sizeError);
      }
    }

    return smallThumbnailUrl;
  } catch (error) {
    // Handle any unexpected errors gracefully
    if (error instanceof Error) {
      console.error('Failed to generate thumbnails:', error.message);
    } else {
      console.error('Failed to generate thumbnails: Unknown error');
    }
    return undefined;
  }
}
