/**
 * FFmpeg Video Encoder
 *
 * Handles video encoding to HLS format with multiple quality renditions,
 * thumbnail generation, and progress tracking.
 */

import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { promisify } from 'util';
import { ffmpegConfig, workerConfig } from './config.js';
import { logger } from './queue.js';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// ================================================================
// Error Classification
// ================================================================

/**
 * Error types that can be retried (temporary failures)
 */
export const RETRYABLE_ERRORS = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EHOSTUNREACH',
  'ECONNREFUSED',
  'FFMPEG_DOWNLOAD_FAILED',
  'S3_UPLOAD_FAILED',
  'NETWORK_ERROR',
];

/**
 * Error types that should not be retried (permanent failures)
 */
export const NON_RETRYABLE_ERRORS = [
  'FFMPEG_INVALID_INPUT',
  'FFMPEG_UNSUPPORTED_CODEC',
  'FFMPEG_INVALID_FORMAT',
  'FILE_NOT_FOUND',
  'INVALID_VIDEO_FILE',
  'UNSUPPORTED_RESOLUTION',
];

/**
 * Custom error class for encoding errors
 */
export class EncodingError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;

  constructor(message: string, code: string, retryable: boolean = false) {
    super(message);
    this.name = 'EncodingError';
    this.code = code;
    this.retryable = retryable;
  }
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: Error | EncodingError): boolean {
  if (error instanceof EncodingError) {
    return error.retryable;
  }

  const errorCode = (error as any).code;
  return RETRYABLE_ERRORS.includes(errorCode);
}

// ================================================================
// Types
// ================================================================

/**
 * Supported video resolutions
 */
export type VideoResolution = '360p' | '480p' | '720p' | '1080p';

/**
 * Quality rendition configuration
 */
export interface QualityRendition {
  quality: VideoResolution;
  width: number;
  height: number;
  bitrate: number;
}

/**
 * Default quality profiles
 */
export const DEFAULT_RENDITIONS: QualityRendition[] = [
  { quality: '360p', width: 640, height: 360, bitrate: 800 },
  { quality: '480p', width: 854, height: 480, bitrate: 1400 },
  { quality: '720p', width: 1280, height: 720, bitrate: 2800 },
  { quality: '1080p', width: 1920, height: 1080, bitrate: 5000 },
];

/**
 * Encoding options
 */
export interface EncodingOptions {
  jobId: string;
  videoId: string;
  onProgress?: (percent: number) => void;
  resolutions?: VideoResolution[];
}

/**
 * Encoding result
 */
export interface EncodingResult {
  masterPlaylistPath: string;
  renditions: Array<{
    quality: string;
    width: number;
    height: number;
    bitrate: number;
    playlistPath: string;
  }>;
  thumbnails: string[];
  duration: number;
}

/**
 * Video metadata
 */
interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  bitrate: number;
}

// ================================================================
// FFmpeg Configuration
// ================================================================

// Set FFmpeg and FFprobe paths from config
if (ffmpegConfig.ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegConfig.ffmpegPath);
}
if (ffmpegConfig.ffprobePath) {
  ffmpeg.setFfprobePath(ffmpegConfig.ffprobePath);
}

// ================================================================
// File Download
// ================================================================

/**
 * Download source file from URL to local path
 */
export async function downloadSourceFile(
  url: string,
  destPath: string
): Promise<void> {
  logger.info({ url, destPath }, 'Downloading source file');

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          logger.info({ redirectUrl }, 'Following redirect');
          downloadSourceFile(redirectUrl, destPath)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      // Handle error status codes
      if (response.statusCode !== 200) {
        reject(
          new EncodingError(
            `Failed to download file: HTTP ${response.statusCode}`,
            'FFMPEG_DOWNLOAD_FAILED',
            true
          )
        );
        return;
      }

      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      // Stream file to disk
      const fileStream = fs.createWriteStream(destPath);
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const percent = Math.round((downloadedBytes / totalBytes) * 100);
          logger.debug({ percent, downloadedBytes, totalBytes }, 'Download progress');
        }
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        logger.info({ destPath, size: downloadedBytes }, 'Download complete');
        resolve();
      });

      fileStream.on('error', (error) => {
        fs.unlink(destPath, () => {
          reject(
            new EncodingError(
              `Failed to write file: ${error.message}`,
              'FFMPEG_DOWNLOAD_FAILED',
              true
            )
          );
        });
      });
    });

    request.on('error', (error) => {
      reject(
        new EncodingError(
          `Network error: ${error.message}`,
          'NETWORK_ERROR',
          true
        )
      );
    });

    request.setTimeout(300000, () => {
      // 5 minute timeout
      request.destroy();
      reject(
        new EncodingError(
          'Download timeout',
          'ETIMEDOUT',
          true
        )
      );
    });
  });
}

// ================================================================
// Video Metadata
// ================================================================

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(inputPath: string): Promise<number> {
  logger.debug({ inputPath }, 'Getting video duration');

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, metadata) => {
      if (error) {
        reject(
          new EncodingError(
            `Failed to probe video: ${error.message}`,
            'FFMPEG_INVALID_INPUT',
            false
          )
        );
        return;
      }

      const duration = metadata.format.duration;
      if (!duration) {
        reject(
          new EncodingError(
            'Could not determine video duration',
            'FFMPEG_INVALID_INPUT',
            false
          )
        );
        return;
      }

      logger.info({ inputPath, duration }, 'Video duration retrieved');
      resolve(duration);
    });
  });
}

/**
 * Get comprehensive video metadata
 */
export async function getVideoMetadata(inputPath: string): Promise<VideoMetadata> {
  logger.debug({ inputPath }, 'Getting video metadata');

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, metadata) => {
      if (error) {
        reject(
          new EncodingError(
            `Failed to probe video: ${error.message}`,
            'FFMPEG_INVALID_INPUT',
            false
          )
        );
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      if (!videoStream) {
        reject(
          new EncodingError(
            'No video stream found in file',
            'FFMPEG_INVALID_INPUT',
            false
          )
        );
        return;
      }

      const result: VideoMetadata = {
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        codec: videoStream.codec_name || 'unknown',
        bitrate: metadata.format.bit_rate ? parseInt(metadata.format.bit_rate.toString(), 10) : 0,
      };

      logger.info({ inputPath, metadata: result }, 'Video metadata retrieved');
      resolve(result);
    });
  });
}

// ================================================================
// HLS Encoding
// ================================================================

/**
 * Filter renditions based on source video resolution
 */
function filterRenditions(
  sourceWidth: number,
  sourceHeight: number,
  requestedResolutions?: VideoResolution[]
): QualityRendition[] {
  let renditions = DEFAULT_RENDITIONS;

  // Filter by requested resolutions
  if (requestedResolutions && requestedResolutions.length > 0) {
    renditions = renditions.filter((r) =>
      requestedResolutions.includes(r.quality)
    );
  }

  // Filter out renditions larger than source
  renditions = renditions.filter((r) => {
    const fits = r.width <= sourceWidth && r.height <= sourceHeight;
    if (!fits) {
      logger.debug(
        { quality: r.quality, sourceWidth, sourceHeight },
        'Skipping rendition larger than source'
      );
    }
    return fits;
  });

  // Ensure at least one rendition
  if (renditions.length === 0) {
    logger.warn('No suitable renditions found, using lowest quality');
    renditions = [DEFAULT_RENDITIONS[0]];
  }

  return renditions;
}

/**
 * Generate HLS master playlist
 */
function generateMasterPlaylist(
  renditions: QualityRendition[],
  outputDir: string
): string {
  const masterPlaylistPath = path.join(outputDir, 'master.m3u8');

  const lines = ['#EXTM3U', '#EXT-X-VERSION:3'];

  for (const rendition of renditions) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${rendition.bitrate * 1000},RESOLUTION=${rendition.width}x${rendition.height}`
    );
    lines.push(`${rendition.quality}/playlist.m3u8`);
  }

  fs.writeFileSync(masterPlaylistPath, lines.join('\n'));

  logger.info({ masterPlaylistPath, renditions: renditions.length }, 'Master playlist generated');
  return masterPlaylistPath;
}

/**
 * Encode video to single HLS rendition
 */
async function encodeRendition(
  inputPath: string,
  outputDir: string,
  rendition: QualityRendition,
  duration: number,
  onProgress?: (percent: number) => void
): Promise<string> {
  const renditionDir = path.join(outputDir, rendition.quality);
  await mkdir(renditionDir, { recursive: true });

  const playlistPath = path.join(renditionDir, 'playlist.m3u8');
  const segmentPattern = path.join(renditionDir, 'segment_%03d.ts');

  logger.info(
    { rendition: rendition.quality, outputDir: renditionDir },
    'Starting rendition encoding'
  );

  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .outputOptions([
        // Video codec
        `-c:v ${ffmpegConfig.defaultVideoCodec}`,
        '-preset medium',
        '-profile:v main',
        '-level 4.0',

        // Video quality
        `-b:v ${rendition.bitrate}k`,
        `-maxrate ${Math.round(rendition.bitrate * 1.2)}k`,
        `-bufsize ${Math.round(rendition.bitrate * 2)}k`,

        // Resolution
        `-vf scale=${rendition.width}:${rendition.height}:force_original_aspect_ratio=decrease,pad=${rendition.width}:${rendition.height}:(ow-iw)/2:(oh-ih)/2`,

        // Audio codec
        `-c:a ${ffmpegConfig.defaultAudioCodec}`,
        '-b:a 128k',
        '-ac 2',

        // HLS settings
        '-f hls',
        `-hls_time ${ffmpegConfig.hlsSegmentDuration}`,
        `-hls_playlist_type ${ffmpegConfig.hlsPlaylistType}`,
        '-hls_segment_type mpegts',
        `-hls_segment_filename ${segmentPattern}`,

        // Force keyframe interval for segment boundaries
        `-g ${ffmpegConfig.hlsSegmentDuration * 30}`, // Assuming 30fps
        '-sc_threshold 0',
      ])
      .output(playlistPath);

    // Progress tracking
    command.on('progress', (progress) => {
      if (progress.timemark && duration > 0) {
        const timeParts = progress.timemark.split(':');
        const currentSeconds =
          parseInt(timeParts[0], 10) * 3600 +
          parseInt(timeParts[1], 10) * 60 +
          parseFloat(timeParts[2]);

        const percent = Math.min(Math.round((currentSeconds / duration) * 100), 100);

        logger.debug(
          {
            rendition: rendition.quality,
            percent,
            timemark: progress.timemark,
          },
          'Encoding progress'
        );

        if (onProgress) {
          onProgress(percent);
        }
      }
    });

    // Error handling
    command.on('error', (error, _stdout, stderr) => {
      logger.error(
        {
          rendition: rendition.quality,
          error: error.message,
          stderr: stderr?.slice(-500), // Last 500 chars of stderr
        },
        'Encoding error'
      );

      // Categorize error
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('invalid') ||
        errorMessage.includes('unsupported codec')
      ) {
        reject(
          new EncodingError(
            `FFmpeg encoding failed: ${error.message}`,
            'FFMPEG_UNSUPPORTED_CODEC',
            false
          )
        );
      } else if (errorMessage.includes('no such file')) {
        reject(
          new EncodingError(
            `Input file not found: ${error.message}`,
            'FILE_NOT_FOUND',
            false
          )
        );
      } else {
        reject(
          new EncodingError(
            `FFmpeg encoding failed: ${error.message}`,
            'FFMPEG_ERROR',
            true
          )
        );
      }
    });

    // Success
    command.on('end', () => {
      logger.info(
        { rendition: rendition.quality, playlistPath },
        'Rendition encoding complete'
      );
      resolve(playlistPath);
    });

    // Start encoding
    command.run();
  });
}

/**
 * Encode video to HLS with multiple quality renditions
 */
export async function encodeToHLS(
  inputPath: string,
  outputDir: string,
  options: EncodingOptions
): Promise<EncodingResult> {
  logger.info({ inputPath, outputDir, options }, 'Starting HLS encoding');

  try {
    // Verify input file exists
    if (!fs.existsSync(inputPath)) {
      throw new EncodingError(
        `Input file not found: ${inputPath}`,
        'FILE_NOT_FOUND',
        false
      );
    }

    // Get video metadata
    const metadata = await getVideoMetadata(inputPath);

    // Filter renditions based on source resolution
    const renditions = filterRenditions(
      metadata.width,
      metadata.height,
      options.resolutions
    );

    logger.info(
      {
        sourceResolution: `${metadata.width}x${metadata.height}`,
        targetRenditions: renditions.map((r) => r.quality),
      },
      'Renditions selected'
    );

    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    // Encode each rendition
    const encodedRenditions: EncodingResult['renditions'] = [];
    const totalRenditions = renditions.length;

    for (let i = 0; i < renditions.length; i++) {
      const rendition = renditions[i];

      // Progress callback for this specific rendition
      const renditionProgress = (percent: number) => {
        // Calculate overall progress across all renditions
        const overallPercent = Math.round(
          ((i + percent / 100) / totalRenditions) * 100
        );

        if (options.onProgress) {
          options.onProgress(overallPercent);
        }
      };

      const playlistPath = await encodeRendition(
        inputPath,
        outputDir,
        rendition,
        metadata.duration,
        renditionProgress
      );

      encodedRenditions.push({
        quality: rendition.quality,
        width: rendition.width,
        height: rendition.height,
        bitrate: rendition.bitrate,
        playlistPath,
      });
    }

    // Generate master playlist
    const masterPlaylistPath = generateMasterPlaylist(renditions, outputDir);

    logger.info(
      {
        masterPlaylistPath,
        renditions: encodedRenditions.length,
        duration: metadata.duration,
      },
      'HLS encoding complete'
    );

    return {
      masterPlaylistPath,
      renditions: encodedRenditions,
      thumbnails: [], // Will be populated by separate thumbnail generation
      duration: metadata.duration,
    };
  } catch (error) {
    logger.error({ error, inputPath, outputDir }, 'HLS encoding failed');
    throw error;
  }
}

// ================================================================
// Thumbnail Generation
// ================================================================

/**
 * Generate thumbnails at regular intervals
 */
export async function generateThumbnails(
  inputPath: string,
  outputDir: string,
  intervalSeconds: number = 10
): Promise<string[]> {
  logger.info({ inputPath, outputDir, intervalSeconds }, 'Starting thumbnail generation');

  try {
    // Verify input file exists
    if (!fs.existsSync(inputPath)) {
      throw new EncodingError(
        `Input file not found: ${inputPath}`,
        'FILE_NOT_FOUND',
        false
      );
    }

    // Get video duration
    const duration = await getVideoDuration(inputPath);

    // Calculate number of thumbnails
    const thumbnailCount = Math.ceil(duration / intervalSeconds);

    logger.info({ duration, thumbnailCount, intervalSeconds }, 'Thumbnail parameters');

    // Create thumbnails directory
    const thumbnailsDir = path.join(outputDir, 'thumbnails');
    await mkdir(thumbnailsDir, { recursive: true });

    // Generate thumbnails using FFmpeg
    const outputPattern = path.join(thumbnailsDir, 'thumb_%04d.jpg');

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          // Extract frame every N seconds
          `-vf fps=1/${intervalSeconds}`,

          // Scale to reasonable thumbnail size
          '-vf scale=320:-1',

          // JPEG quality
          '-q:v 2',
        ])
        .output(outputPattern)
        .on('error', (error) => {
          logger.error({ error: error.message }, 'Thumbnail generation error');
          reject(
            new EncodingError(
              `Thumbnail generation failed: ${error.message}`,
              'FFMPEG_ERROR',
              true
            )
          );
        })
        .on('end', async () => {
          try {
            // List generated thumbnail files
            const files = await readdir(thumbnailsDir);
            const thumbnails = files
              .filter((f) => f.startsWith('thumb_') && f.endsWith('.jpg'))
              .map((f) => path.join(thumbnailsDir, f))
              .sort();

            logger.info(
              { count: thumbnails.length, thumbnailsDir },
              'Thumbnail generation complete'
            );

            resolve(thumbnails);
          } catch (error) {
            reject(error);
          }
        })
        .run();
    });
  } catch (error) {
    logger.error({ error, inputPath, outputDir }, 'Thumbnail generation failed');
    throw error;
  }
}

// ================================================================
// Cleanup
// ================================================================

/**
 * Clean up temporary files and directories
 */
export async function cleanupTempFiles(paths: string[]): Promise<void> {
  if (!workerConfig.cleanupTempFiles) {
    logger.info('Cleanup disabled by configuration');
    return;
  }

  logger.info({ paths, count: paths.length }, 'Cleaning up temporary files');

  for (const filePath of paths) {
    try {
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        // Recursively delete directory
        await deleteDirectory(filePath);
      } else {
        // Delete file
        await unlink(filePath);
      }

      logger.debug({ path: filePath }, 'Deleted temporary file/directory');
    } catch (error) {
      // Ignore errors if file/directory doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        logger.warn({ error, path: filePath }, 'Failed to delete temporary file');
      }
    }
  }

  logger.info({ count: paths.length }, 'Cleanup complete');
}

/**
 * Recursively delete directory
 */
async function deleteDirectory(dirPath: string): Promise<void> {
  const files = await readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStats = await stat(filePath);

    if (fileStats.isDirectory()) {
      await deleteDirectory(filePath);
    } else {
      await unlink(filePath);
    }
  }

  await promisify(fs.rmdir)(dirPath);
}

// ================================================================
// Utility Functions
// ================================================================

/**
 * Get temporary file path for job
 */
export function getTempFilePath(jobId: string, filename: string): string {
  return path.join(workerConfig.tempDir, jobId, filename);
}

/**
 * Get output directory for job
 */
export function getOutputDir(jobId: string): string {
  return path.join(workerConfig.tempDir, jobId, 'output');
}

/**
 * Ensure temp directory exists for job
 */
export async function ensureTempDir(jobId: string): Promise<string> {
  const tempDir = path.join(workerConfig.tempDir, jobId);
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Get disk usage for a directory
 */
export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;

  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        totalSize += await getDirectorySize(filePath);
      } else {
        totalSize += fileStats.size;
      }
    }
  } catch (error) {
    logger.warn({ error, dirPath }, 'Failed to calculate directory size');
  }

  return totalSize;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
