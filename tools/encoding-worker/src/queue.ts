/**
 * BullMQ Queue and Worker Setup
 *
 * Configures the video encoding queue with Redis connection,
 * job types, retry policies, and worker settings.
 */

import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from './config.js';
import { pino as createLogger } from 'pino';

// Setup logger
const logger = createLogger({
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
// Queue Name
// ================================================================

export const QUEUE_NAME = 'video-encoding';

// ================================================================
// Job Data Types
// ================================================================

/**
 * Base job data interface
 */
interface BaseJobData {
  jobId: string; // Database encoding_jobs.id
  videoId: string;
  inputFileUrl: string;
  outputBucket: string;
  outputKey: string;
  webhookUrl?: string;
  attempt: number;
}

/**
 * Full video encoding job
 */
export interface EncodeJobData extends BaseJobData {
  type: 'encode';
  renditions?: Array<{
    quality: string;
    width: number;
    height: number;
    bitrate: number;
  }>;
}

/**
 * Thumbnail generation only
 */
export interface ThumbnailJobData extends BaseJobData {
  type: 'thumbnail';
  intervalSeconds?: number; // Extract thumbnail every N seconds
}

/**
 * Retry a failed job
 */
export interface RetryJobData extends BaseJobData {
  type: 'retry';
  previousError?: string;
}

/**
 * Union type for all job data
 */
export type VideoEncodingJobData =
  | EncodeJobData
  | ThumbnailJobData
  | RetryJobData;

// ================================================================
// Redis Connection
// ================================================================

/**
 * Create Redis connection for BullMQ
 */
function createRedisConnection(): Redis {
  const connection = new Redis({
    host: config.REDIS_HOST || 'localhost',
    port: config.REDIS_PORT || 6379,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB || 0,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis connection retry attempt ${times}, delay: ${delay}ms`);
      return delay;
    },
  });

  // Connection event handlers
  connection.on('connect', () => {
    logger.info('Redis connection established');
  });

  connection.on('ready', () => {
    logger.info('Redis connection ready');
  });

  connection.on('error', (error: Error) => {
    logger.error({ error }, 'Redis connection error');
  });

  connection.on('close', () => {
    logger.warn('Redis connection closed');
  });

  connection.on('reconnecting', () => {
    logger.info('Redis reconnecting...');
  });

  return connection;
}

// ================================================================
// Queue Setup
// ================================================================

/**
 * Create BullMQ Queue instance
 */
export const videoEncodingQueue = new Queue<VideoEncodingJobData>(QUEUE_NAME, {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: config.JOB_ATTEMPTS || 3,
    backoff: {
      type: 'exponential',
      delay: config.JOB_BACKOFF_DELAY_MS || (5 * 60 * 1000), // 5 minutes default
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 7 * 24 * 60 * 60, // Keep for 7 days
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
      age: 30 * 24 * 60 * 60, // Keep for 30 days
    },
  },
});

// Queue event handlers
videoEncodingQueue.on('error', (error: Error) => {
  logger.error({ error }, 'Queue error');
});

videoEncodingQueue.on('cleaned', (jobs: string[], type: string) => {
  logger.info({ count: jobs.length, type }, 'Queue cleaned');
});

// ================================================================
// Worker Setup
// ================================================================

/**
 * Worker processor placeholder (to be implemented by index.ts)
 */
export type JobProcessor = (
  job: Job<VideoEncodingJobData>
) => Promise<void | any>;

/**
 * Create BullMQ Worker instance
 */
export function createWorker(processor: JobProcessor): Worker<VideoEncodingJobData> {
  const concurrency = config.WORKER_CONCURRENCY || 3;
  const limiterMax = config.MAX_CONCURRENT_JOBS || 3;
  const limiterDuration = 60000; // 60 seconds

  const worker = new Worker<VideoEncodingJobData>(QUEUE_NAME, processor, {
    connection: createRedisConnection(),
    concurrency,
    limiter: {
      max: limiterMax,
      duration: limiterDuration,
    },
    settings: {
      backoffStrategy: (attemptsMade: number) => {
        // Custom backoff: 5min, 15min, 60min
        const delays = [5 * 60 * 1000, 15 * 60 * 1000, 60 * 60 * 1000];
        const delayIndex = Math.min(attemptsMade - 1, delays.length - 1);
        return delays[delayIndex];
      },
    },
  });

  // Worker event handlers
  worker.on('ready', () => {
    logger.info(
      {
        concurrency,
        limiterMax,
        limiterDuration,
      },
      'Worker ready'
    );
  });

  worker.on('active', (job: Job<VideoEncodingJobData>) => {
    logger.info(
      {
        jobId: job.id,
        type: job.data.type,
        videoId: job.data.videoId,
        attempt: job.attemptsMade,
      },
      'Job started'
    );
  });

  worker.on('completed', (job: Job<VideoEncodingJobData>) => {
    logger.info(
      {
        jobId: job.id,
        type: job.data.type,
        videoId: job.data.videoId,
        duration: Date.now() - job.processedOn!,
      },
      'Job completed'
    );
  });

  worker.on('failed', (job: Job<VideoEncodingJobData> | undefined, error: Error) => {
    if (!job) {
      logger.error({ error }, 'Job failed (no job data)');
      return;
    }

    logger.error(
      {
        jobId: job.id,
        type: job.data.type,
        videoId: job.data.videoId,
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts,
        error: error.message,
      },
      'Job failed'
    );
  });

  worker.on('stalled', (jobId: string) => {
    logger.warn({ jobId }, 'Job stalled');
  });

  worker.on('error', (error: Error) => {
    logger.error({ error }, 'Worker error');
  });

  worker.on('closing', () => {
    logger.info('Worker closing');
  });

  worker.on('closed', () => {
    logger.info('Worker closed');
  });

  return worker;
}

// ================================================================
// Queue Events
// ================================================================

/**
 * QueueEvents for monitoring job lifecycle
 */
export const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: createRedisConnection(),
});

queueEvents.on('waiting', ({ jobId }: { jobId: string }) => {
  logger.debug({ jobId }, 'Job waiting');
});

queueEvents.on('progress', ({ jobId, data }: { jobId: string; data: any }) => {
  logger.debug({ jobId, progress: data }, 'Job progress');
});

queueEvents.on('completed', ({ jobId }: { jobId: string; returnvalue?: any }) => {
  logger.debug({ jobId }, 'Job completed event');
});

queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  logger.debug({ jobId, failedReason }, 'Job failed event');
});

// ================================================================
// Helper Functions
// ================================================================

/**
 * Add an encoding job to the queue
 */
export async function addEncodingJob(
  data: Omit<EncodeJobData, 'type' | 'attempt'>
): Promise<Job<VideoEncodingJobData>> {
  const jobData: EncodeJobData = {
    ...data,
    type: 'encode',
    attempt: 0,
  };

  return videoEncodingQueue.add('encode', jobData, {
    jobId: data.jobId, // Use database ID as BullMQ job ID
    priority: 1,
  });
}

/**
 * Add a thumbnail generation job to the queue
 */
export async function addThumbnailJob(
  data: Omit<ThumbnailJobData, 'type' | 'attempt'>
): Promise<Job<VideoEncodingJobData>> {
  const jobData: ThumbnailJobData = {
    ...data,
    type: 'thumbnail',
    attempt: 0,
  };

  return videoEncodingQueue.add('thumbnail', jobData, {
    jobId: data.jobId,
    priority: 2, // Lower priority than encoding
  });
}

/**
 * Add a retry job to the queue
 */
export async function addRetryJob(
  data: Omit<RetryJobData, 'type'>
): Promise<Job<VideoEncodingJobData>> {
  const jobData: RetryJobData = {
    ...data,
    type: 'retry',
  };

  return videoEncodingQueue.add('retry', jobData, {
    jobId: `${data.jobId}-retry-${data.attempt}`,
    priority: 3, // Higher priority for retries
  });
}

/**
 * Get job by ID
 */
export async function getJob(jobId: string): Promise<Job<VideoEncodingJobData> | undefined> {
  return videoEncodingQueue.getJob(jobId);
}

/**
 * Get job counts by status
 */
export async function getJobCounts() {
  return videoEncodingQueue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
    'paused'
  );
}

/**
 * Pause the queue
 */
export async function pauseQueue(): Promise<void> {
  await videoEncodingQueue.pause();
  logger.info('Queue paused');
}

/**
 * Resume the queue
 */
export async function resumeQueue(): Promise<void> {
  await videoEncodingQueue.resume();
  logger.info('Queue resumed');
}

/**
 * Gracefully close all connections
 */
export async function closeConnections(): Promise<void> {
  logger.info('Closing queue connections...');
  await videoEncodingQueue.close();
  await queueEvents.close();
  logger.info('Queue connections closed');
}

// ================================================================
// Graceful Shutdown
// ================================================================

/**
 * Setup graceful shutdown handlers
 */
export function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, starting graceful shutdown...`);

    try {
      await pauseQueue();
      await closeConnections();
      logger.info('Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// ================================================================
// Exports
// ================================================================

export {
  logger,
  Queue,
  Worker,
  Job,
  QueueEvents,
};
