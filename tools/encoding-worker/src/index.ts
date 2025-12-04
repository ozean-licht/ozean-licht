/**
 * Encoding Worker Entry Point
 *
 * Main worker process that:
 * - Processes video encoding jobs from BullMQ queue
 * - Downloads source files and encodes to HLS
 * - Uploads results to Hetzner S3 via Bunny.net CDN
 * - Sends progress updates and completion webhooks
 * - Handles retry logic and failure alerts
 */

import { Job } from 'bullmq';
import { pino } from 'pino';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  createWorker,
  VideoEncodingJobData,
  EncodeJobData,
  ThumbnailJobData,
  RetryJobData,
} from './queue.js';
import {
  config,
  workerConfig,
  webhookConfig,
  alertingConfig,
  validateConfig,
  getConfigSummary,
} from './config.js';
import {
  encodeToHLS,
  downloadSourceFile as encoderDownloadFile,
  generateThumbnails,
  EncodingError,
  isRetryableError,
  cleanupTempFiles as encoderCleanup,
  getOutputDir,
  ensureTempDir,
} from './encoder.js';
import {
  uploadHLSOutput,
  uploadThumbnails,
  getCdnUrl,
  testS3Connection,
} from './uploader.js';

// ================================================================
// Logger Setup
// ================================================================

const logger = pino({
  level: config.LOG_LEVEL || 'info',
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// Get __filename for ES modules (for entry point detection)
const __filename = fileURLToPath(import.meta.url);

// ================================================================
// Type Definitions
// ================================================================

/**
 * Encoding webhook payload (matches apps/admin/types/video.ts)
 */
interface EncodingWebhookPayload {
  jobId: string;
  videoId: string;
  status: 'progress' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  renditions?: Array<{
    quality: string;
    width: number;
    height: number;
    bitrate: number;
    url: string;
  }>;
  thumbnailUrls?: string[];
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * Error classification for retry logic
 */
type ErrorCategory = 'retryable' | 'non-retryable';

interface CategorizedError {
  category: ErrorCategory;
  code: string;
  message: string;
}

// ================================================================
// Webhook Helper Functions
// ================================================================

/**
 * Send HMAC-signed webhook to the admin API
 */
async function sendWebhook(
  url: string,
  payload: EncodingWebhookPayload,
  secret: string
): Promise<void> {
  try {
    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    logger.debug(
      {
        url,
        jobId: payload.jobId,
        status: payload.status,
      },
      'Sending webhook'
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': `sha256=${signature}`,
        'User-Agent': 'encoding-worker/1.0',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(webhookConfig.timeout || 10000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read response');
      throw new Error(
        `Webhook failed with status ${response.status}: ${errorText}`
      );
    }

    logger.info(
      {
        jobId: payload.jobId,
        status: payload.status,
        statusCode: response.status,
      },
      'Webhook sent successfully'
    );
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        jobId: payload.jobId,
        url,
      },
      'Failed to send webhook'
    );
    // Don't throw - webhook failures shouldn't fail the job
  }
}

/**
 * Send progress webhook
 */
async function sendProgressWebhook(
  jobData: VideoEncodingJobData,
  progress: number
): Promise<void> {
  if (!webhookConfig.enabled || !jobData.webhookUrl) {
    return;
  }

  const payload: EncodingWebhookPayload = {
    jobId: jobData.jobId,
    videoId: jobData.videoId,
    status: 'progress',
    progress,
    timestamp: new Date().toISOString(),
  };

  await sendWebhook(
    jobData.webhookUrl,
    payload,
    webhookConfig.secret || ''
  );
}

/**
 * Send completion webhook
 */
async function sendCompletionWebhook(
  jobData: VideoEncodingJobData,
  outputUrl: string,
  renditions: Array<{
    quality: string;
    width: number;
    height: number;
    bitrate: number;
    url: string;
  }>,
  thumbnailUrls?: string[]
): Promise<void> {
  if (!webhookConfig.enabled || !jobData.webhookUrl) {
    return;
  }

  const payload: EncodingWebhookPayload = {
    jobId: jobData.jobId,
    videoId: jobData.videoId,
    status: 'completed',
    progress: 100,
    outputUrl,
    renditions,
    thumbnailUrls,
    timestamp: new Date().toISOString(),
  };

  await sendWebhook(
    jobData.webhookUrl,
    payload,
    webhookConfig.secret || ''
  );
}

/**
 * Send failure webhook
 */
async function sendFailureWebhook(
  jobData: VideoEncodingJobData,
  error: CategorizedError
): Promise<void> {
  if (!webhookConfig.enabled || !jobData.webhookUrl) {
    return;
  }

  const payload: EncodingWebhookPayload = {
    jobId: jobData.jobId,
    videoId: jobData.videoId,
    status: 'failed',
    error: {
      code: error.code,
      message: error.message,
    },
    timestamp: new Date().toISOString(),
  };

  await sendWebhook(
    jobData.webhookUrl,
    payload,
    webhookConfig.secret || ''
  );
}

// ================================================================
// Telegram Alert Helper
// ================================================================

/**
 * Send Telegram alert for final encoding failures
 */
async function sendTelegramAlert(
  jobId: string,
  videoId: string,
  error: string,
  attempt: number
): Promise<void> {
  if (!alertingConfig.enabled) {
    logger.debug('Telegram alerting disabled, skipping alert');
    return;
  }

  if (!alertingConfig.telegramBotToken || !alertingConfig.telegramChatId) {
    logger.warn('Telegram credentials not configured, cannot send alert');
    return;
  }

  try {
    const message = `
🚨 *Encoding Job Failed (Final Attempt)*

*Job ID:* \`${jobId}\`
*Video ID:* \`${videoId}\`
*Attempt:* ${attempt}
*Error:* ${error}

The encoding job has exhausted all retry attempts and requires manual intervention.
`.trim();

    const telegramUrl = `https://api.telegram.org/bot${alertingConfig.telegramBotToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: alertingConfig.telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read response');
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    logger.info({ jobId, videoId }, 'Telegram alert sent successfully');
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        jobId,
        videoId,
      },
      'Failed to send Telegram alert'
    );
  }
}

// ================================================================
// Error Categorization
// ================================================================

/**
 * Categorize error for retry logic
 */
function categorizeError(error: Error): CategorizedError {
  // Use encoder's error classification if available
  if (error instanceof EncodingError) {
    return {
      category: error.retryable ? 'retryable' : 'non-retryable',
      code: error.code,
      message: error.message,
    };
  }

  // Use encoder's retry logic
  if (isRetryableError(error)) {
    return {
      category: 'retryable',
      code: (error as any).code || 'TEMPORARY_ERROR',
      message: error.message,
    };
  }

  const message = error.message.toLowerCase();

  // Non-retryable errors (fail immediately)
  const nonRetryablePatterns = [
    'invalid codec',
    'unsupported format',
    'corrupt',
    'malformed',
    'invalid input',
    'no such file',
    'permission denied',
    '404',
    '403',
    '401',
  ];

  for (const pattern of nonRetryablePatterns) {
    if (message.includes(pattern)) {
      return {
        category: 'non-retryable',
        code: 'INVALID_INPUT',
        message: error.message,
      };
    }
  }

  // Retryable errors (network, temporary issues)
  const retryablePatterns = [
    'timeout',
    'econnrefused',
    'enotfound',
    'network',
    'socket',
    'connection',
    '429', // Rate limit
    '500', // Server error
    '502', // Bad gateway
    '503', // Service unavailable
    '504', // Gateway timeout
  ];

  for (const pattern of retryablePatterns) {
    if (message.includes(pattern)) {
      return {
        category: 'retryable',
        code: 'TEMPORARY_ERROR',
        message: error.message,
      };
    }
  }

  // Default to retryable for unknown errors
  return {
    category: 'retryable',
    code: 'UNKNOWN_ERROR',
    message: error.message,
  };
}

// Note: Download and cleanup helpers are now imported from encoder.ts
// File download: encoderDownloadFile()
// Cleanup: encoderCleanup()
// Encoding: encodeToHLS() from encoder.ts
// Upload: uploadHLSOutput() from uploader.ts

// ================================================================
// Job Processor
// ================================================================

/**
 * Process encoding job
 */
async function processEncodingJob(job: Job<VideoEncodingJobData>): Promise<void> {
  const startTime = Date.now();
  const { jobId, videoId, inputFileUrl, outputKey, attempt } =
    job.data;

  logger.info(
    {
      jobId,
      videoId,
      type: job.data.type,
      attempt,
      attemptsMade: job.attemptsMade,
    },
    'Processing encoding job'
  );

  // Setup paths using encoder helpers
  const workDir = await ensureTempDir(jobId);
  const inputPath = path.join(workDir, 'input.mp4');
  const outputDir = getOutputDir(jobId);

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Step 1: Download source file
    logger.info({ inputFileUrl }, 'Step 1: Downloading source file');
    await encoderDownloadFile(inputFileUrl, inputPath);
    await sendProgressWebhook(job.data, 10);

    // Step 2: Encode to HLS with progress tracking
    logger.info('Step 2: Encoding to HLS');
    const encodingResult = await encodeToHLS(inputPath, outputDir, {
      jobId,
      videoId,
      onProgress: async (progress) => {
        // Map encoding progress to 10-80% of overall progress
        const overallProgress = 10 + Math.floor(progress * 0.7);
        await job.updateProgress(overallProgress);
        await sendProgressWebhook(job.data, overallProgress);
      },
    });

    await sendProgressWebhook(job.data, 80);

    // Step 3: Upload HLS output to S3
    logger.info('Step 3: Uploading HLS output to S3');
    const uploadResult = await uploadHLSOutput(
      outputDir,
      outputKey
    );

    await sendProgressWebhook(job.data, 90);

    // Step 4: Upload thumbnails (if generated)
    logger.info('Step 4: Uploading thumbnails');
    const thumbnailUrls: string[] = [];
    if (encodingResult.thumbnails && encodingResult.thumbnails.length > 0) {
      const uploadedThumbnails = await uploadThumbnails(
        encodingResult.thumbnails,
        outputKey
      );
      thumbnailUrls.push(...uploadedThumbnails);
    }

    await sendProgressWebhook(job.data, 95);

    // Step 5: Build rendition URLs for webhook
    const renditions = encodingResult.renditions.map((r) => ({
      quality: r.quality,
      width: r.width,
      height: r.height,
      bitrate: r.bitrate,
      url: getCdnUrl(`${outputKey}/${path.basename(r.playlistPath)}`),
    }));

    // Step 6: Send completion webhook
    logger.info('Step 6: Sending completion webhook');
    await sendCompletionWebhook(
      job.data,
      uploadResult.manifestUrl,
      renditions,
      thumbnailUrls
    );
    await job.updateProgress(100);

    const duration = Date.now() - startTime;
    logger.info(
      {
        jobId,
        videoId,
        outputUrl: uploadResult.manifestUrl,
        renditionCount: renditions.length,
        thumbnailCount: thumbnailUrls.length,
        totalBytes: uploadResult.totalBytes,
        durationMs: duration,
        durationMin: (duration / 60000).toFixed(2),
      },
      'Encoding job completed successfully'
    );
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const categorized = categorizeError(errorObj);

    logger.error(
      {
        jobId,
        videoId,
        error: errorObj.message,
        category: categorized.category,
        code: categorized.code,
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts,
      },
      'Encoding job failed'
    );

    // Send failure webhook
    await sendFailureWebhook(job.data, categorized);

    // If this is the final attempt, send Telegram alert
    const isFinalAttempt = job.attemptsMade >= (job.opts.attempts || 3);
    if (isFinalAttempt) {
      await sendTelegramAlert(
        jobId,
        videoId,
        `${categorized.code}: ${categorized.message}`,
        job.attemptsMade
      );
    }

    // Re-throw to let BullMQ handle retry
    throw errorObj;
  } finally {
    // Clean up temp files
    if (workerConfig.cleanupTempFiles) {
      const filesToCleanup = [inputPath, outputDir];
      await encoderCleanup(filesToCleanup);
    }
  }
}

/**
 * Process thumbnail job
 */
async function processThumbnailJob(job: Job<ThumbnailJobData>): Promise<void> {
  const { jobId, videoId, inputFileUrl, outputKey, intervalSeconds } =
    job.data;

  logger.info({ jobId, videoId }, 'Processing thumbnail job');

  // Setup paths using encoder helpers
  const workDir = await ensureTempDir(jobId);
  const inputPath = path.join(workDir, 'input.mp4');
  const outputDir = getOutputDir(jobId);

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Step 1: Download source file
    logger.info({ inputFileUrl }, 'Step 1: Downloading source file');
    await encoderDownloadFile(inputFileUrl, inputPath);
    await job.updateProgress(30);

    // Step 2: Generate thumbnails
    logger.info('Step 2: Generating thumbnails');
    const thumbnailPaths = await generateThumbnails(
      inputPath,
      outputDir,
      intervalSeconds || 10
    );
    await job.updateProgress(60);

    // Step 3: Upload thumbnails
    logger.info('Step 3: Uploading thumbnails');
    const uploadedThumbnails = await uploadThumbnails(
      thumbnailPaths,
      outputKey
    );
    await job.updateProgress(90);

    // Step 4: Send completion webhook
    logger.info('Step 4: Sending completion webhook');
    if (job.data.webhookUrl) {
      await sendCompletionWebhook(
        job.data,
        '',
        [],
        uploadedThumbnails
      );
    }
    await job.updateProgress(100);

    logger.info(
      {
        jobId,
        videoId,
        thumbnailCount: uploadedThumbnails.length,
      },
      'Thumbnail job completed successfully'
    );
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const categorized = categorizeError(errorObj);

    logger.error(
      {
        jobId,
        videoId,
        error: errorObj.message,
      },
      'Thumbnail job failed'
    );

    // Send failure webhook
    if (job.data.webhookUrl) {
      await sendFailureWebhook(job.data, categorized);
    }

    // Re-throw to let BullMQ handle retry
    throw errorObj;
  } finally {
    // Clean up temp files
    if (workerConfig.cleanupTempFiles) {
      const filesToCleanup = [inputPath, outputDir];
      await encoderCleanup(filesToCleanup);
    }
  }
}

/**
 * Process retry job
 */
async function processRetryJob(job: Job<RetryJobData>): Promise<void> {
  const { jobId, videoId } = job.data;

  logger.info({ jobId, videoId }, 'Processing retry job');

  // Convert retry job to encode job and process it
  const encodeData: EncodeJobData = {
    ...job.data,
    type: 'encode',
  };

  // Create a temporary job wrapper
  const encodeJob = {
    ...job,
    data: encodeData,
  } as Job<VideoEncodingJobData>;

  await processEncodingJob(encodeJob);
}

/**
 * Main job processor router
 */
async function processJob(job: Job<VideoEncodingJobData>): Promise<void> {
  const { type } = job.data;

  switch (type) {
    case 'encode':
      await processEncodingJob(job);
      break;
    case 'thumbnail':
      await processThumbnailJob(job as Job<ThumbnailJobData>);
      break;
    case 'retry':
      await processRetryJob(job as Job<RetryJobData>);
      break;
    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

// ================================================================
// Worker Startup
// ================================================================

/**
 * Start the encoding worker
 */
async function startWorker(): Promise<void> {
  logger.info('Starting encoding worker...');

  // Validate configuration
  try {
    await validateConfig();
  } catch (error) {
    logger.error({ error }, 'Configuration validation failed');
    process.exit(1);
  }

  // Test S3 connection
  try {
    const s3Available = await testS3Connection();
    if (!s3Available) {
      logger.error('S3 connection test failed');
      process.exit(1);
    }
  } catch (error) {
    logger.error({ error }, 'S3 connection test failed');
    process.exit(1);
  }

  // Log configuration summary
  logger.info(getConfigSummary(), 'Worker configuration loaded');

  // Create worker
  const worker = createWorker(processJob);

  // Setup graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, starting graceful shutdown...`);

    try {
      await worker.close();
      logger.info('Worker closed successfully');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', async (error: Error) => {
    logger.fatal({ error }, 'Uncaught exception');
    try {
      // Attempt cleanup before exit
      await worker.close();
      logger.info('Worker closed after uncaught exception');
    } catch (cleanupError) {
      logger.error({ error: cleanupError }, 'Error during crash cleanup');
    }
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason: unknown) => {
    logger.fatal({ reason }, 'Unhandled promise rejection');
    try {
      // Attempt cleanup before exit
      await worker.close();
      logger.info('Worker closed after unhandled rejection');
    } catch (cleanupError) {
      logger.error({ error: cleanupError }, 'Error during crash cleanup');
    }
    process.exit(1);
  });

  logger.info('Encoding worker started successfully');
  logger.info(
    {
      concurrency: workerConfig.concurrency,
      maxJobs: workerConfig.maxConcurrentJobs,
      tempDir: workerConfig.tempDir,
    },
    'Worker is ready to process jobs'
  );
}

// ================================================================
// Entry Point
// ================================================================

// Start the worker if this file is executed directly
// Compare the file URL to the main module path
const isMainModule = __filename === process.argv[1] ||
                     import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  startWorker().catch((error) => {
    logger.fatal({ error }, 'Failed to start worker');
    process.exit(1);
  });
}

// Export for testing
export {
  processJob,
  processEncodingJob,
  processThumbnailJob,
  processRetryJob,
  sendWebhook,
  sendProgressWebhook,
  sendCompletionWebhook,
  sendFailureWebhook,
  sendTelegramAlert,
  categorizeError,
  startWorker,
};
