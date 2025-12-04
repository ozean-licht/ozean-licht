/**
 * Encoding Worker Configuration
 *
 * Loads and validates environment variables using Zod.
 * Provides typed configuration for Redis, S3 storage, FFmpeg, and webhook callbacks.
 */

import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import type { S3ClientConfig } from '@aws-sdk/client-s3';

// Load environment variables from .env file if available (dev/local mode)
// In production/Docker, environment variables are passed directly
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note: __dirname will be 'dist' when compiled, so we need to go up to encoding-worker root
const isCompiled = __dirname.includes('/dist');
const workerRoot = isCompiled
  ? path.resolve(__dirname, '../')    // dist/ -> encoding-worker/
  : path.resolve(__dirname, '../');    // src/ -> encoding-worker/

const localEnvPath = path.join(workerRoot, '.env');
const rootEnvPath = path.resolve(workerRoot, '../../.env');

// Try local .env first, fallback to root .env, or use environment variables
if (fs.existsSync(localEnvPath)) {
  dotenvConfig({ path: localEnvPath });
  console.log(`✅ Loading environment from local: ${localEnvPath}`);
} else if (fs.existsSync(rootEnvPath)) {
  dotenvConfig({ path: rootEnvPath });
  console.log(`⚠️  Local .env not found, using root: ${rootEnvPath}`);
} else {
  // No .env file found - use environment variables directly (Docker/production mode)
  console.log(`ℹ️  No .env file found, using environment variables`);
}

// Environment schema definition
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Redis Configuration (for BullMQ job queue)
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379').transform(Number),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0').transform(Number),

  // S3/Object Storage Configuration (Hetzner)
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY: z.string().min(1, 'S3_ACCESS_KEY is required'),
  S3_SECRET_KEY: z.string().min(1, 'S3_SECRET_KEY is required'),
  S3_BUCKET: z.string().default('video-hls'),
  S3_REGION: z.string().default('eu-central-1'),
  S3_PORT: z.string().optional().transform(v => v ? Number(v) : undefined),
  S3_USE_SSL: z.string().default('true').transform(v => v === 'true'),
  S3_FORCE_PATH_STYLE: z.string().default('true').transform(v => v === 'true'),

  // CDN Configuration (Bunny.net)
  CDN_BASE_URL: z.string().url(),
  CDN_STORAGE_ZONE: z.string().optional(),

  // FFmpeg Configuration
  FFMPEG_PATH: z.string().optional(),
  FFPROBE_PATH: z.string().optional(),

  // Worker Configuration
  MAX_CONCURRENT_JOBS: z.string().default('3').transform(Number),
  WORKER_CONCURRENCY: z.string().default('3').transform(Number),
  JOB_TIMEOUT_MS: z.string().default('3600000').transform(Number), // 1 hour default
  JOB_ATTEMPTS: z.string().default('3').transform(Number),
  JOB_BACKOFF_DELAY_MS: z.string().default('5000').transform(Number),

  // Webhook Configuration (for progress callbacks)
  WEBHOOK_URL: z.string().url().optional(),
  WEBHOOK_SECRET: z.string().optional(),
  WEBHOOK_TIMEOUT_MS: z.string().default('10000').transform(Number),

  // Storage Configuration
  TEMP_DIR: z.string().default('/tmp/encoding'),
  CLEANUP_TEMP_FILES: z.string().default('true').transform(v => v === 'true'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),

  // Encoding Presets
  DEFAULT_VIDEO_CODEC: z.string().default('libx264'),
  DEFAULT_AUDIO_CODEC: z.string().default('aac'),
  HLS_SEGMENT_DURATION: z.string().default('6').transform(Number),
  HLS_PLAYLIST_TYPE: z.enum(['vod', 'event']).default('vod'),

  // Quality Profiles
  ENABLE_ADAPTIVE_BITRATE: z.string().default('true').transform(v => v === 'true'),
  VIDEO_RESOLUTIONS: z.string().default('1080p,720p,480p,360p'),

  // Alerting Configuration (backward compatibility)
  ALERTING_ENABLED: z.string().optional().transform(v => v !== 'false'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ALERT_CHAT_ID: z.string().optional(),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues
        .filter(issue => issue.code === 'invalid_type' && issue.received === 'undefined')
        .map(issue => issue.path.join('.'));

      const invalid = error.issues
        .filter(issue => issue.code !== 'invalid_type' || issue.received !== 'undefined')
        .map(issue => `${issue.path.join('.')}: ${issue.message}`);

      console.error('❌ Environment configuration error:');
      if (missing.length > 0) {
        console.error('Missing required variables:', missing.join(', '));
      }
      if (invalid.length > 0) {
        console.error('Invalid variables:', invalid.join(', '));
      }
      console.error('\nFull error details:', JSON.stringify(error.issues, null, 2));
      process.exit(1);
    }
    throw error;
  }
};

// Export validated configuration
export const config = parseEnv();

/**
 * Redis connection configuration for BullMQ
 */
export const redisConfig = {
  connection: config.REDIS_URL
    ? {
        url: config.REDIS_URL,
      }
    : {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
      },
};

/**
 * S3 client configuration for AWS SDK
 * Compatible with Hetzner Object Storage
 */
export const s3Config: S3ClientConfig = {
  endpoint: config.S3_ENDPOINT,
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
  forcePathStyle: config.S3_FORCE_PATH_STYLE, // Required for non-AWS S3 providers
};

/**
 * S3 storage configuration (additional metadata)
 */
export const storageConfig = {
  bucket: config.S3_BUCKET,
  region: config.S3_REGION,
  endpoint: config.S3_ENDPOINT,
  useSSL: config.S3_USE_SSL,
  cdnBaseUrl: config.CDN_BASE_URL,
  cdnStorageZone: config.CDN_STORAGE_ZONE,
};

/**
 * FFmpeg configuration
 */
export const ffmpegConfig = {
  ffmpegPath: config.FFMPEG_PATH || 'ffmpeg',
  ffprobePath: config.FFPROBE_PATH || 'ffprobe',
  defaultVideoCodec: config.DEFAULT_VIDEO_CODEC,
  defaultAudioCodec: config.DEFAULT_AUDIO_CODEC,
  hlsSegmentDuration: config.HLS_SEGMENT_DURATION,
  hlsPlaylistType: config.HLS_PLAYLIST_TYPE,
};

/**
 * Worker configuration
 */
export const workerConfig = {
  maxConcurrentJobs: config.MAX_CONCURRENT_JOBS,
  concurrency: config.WORKER_CONCURRENCY,
  jobTimeout: config.JOB_TIMEOUT_MS,
  jobAttempts: config.JOB_ATTEMPTS,
  backoffDelay: config.JOB_BACKOFF_DELAY_MS,
  tempDir: config.TEMP_DIR,
  cleanupTempFiles: config.CLEANUP_TEMP_FILES,
};

/**
 * Webhook configuration for progress callbacks
 */
export const webhookConfig = {
  url: config.WEBHOOK_URL,
  secret: config.WEBHOOK_SECRET,
  timeout: config.WEBHOOK_TIMEOUT_MS,
  enabled: Boolean(config.WEBHOOK_URL && config.WEBHOOK_SECRET),
};

/**
 * Logging configuration
 */
export const loggingConfig = {
  level: config.LOG_LEVEL,
  format: config.LOG_FORMAT,
};

/**
 * Encoding configuration
 */
export const encodingConfig = {
  enableAdaptiveBitrate: config.ENABLE_ADAPTIVE_BITRATE,
  videoResolutions: config.VIDEO_RESOLUTIONS.split(',').map(r => r.trim()),
};

/**
 * Alerting configuration (backward compatibility)
 */
export const alertingConfig = {
  enabled: config.ALERTING_ENABLED || false,
  telegramBotToken: config.TELEGRAM_BOT_TOKEN,
  telegramChatId: config.TELEGRAM_ALERT_CHAT_ID,
};

/**
 * Helper function to get S3 client configuration
 * Can be passed directly to S3Client constructor
 */
export function getS3ClientConfig(): S3ClientConfig {
  return s3Config;
}

/**
 * Helper function to get Redis connection URL or config
 * Can be passed directly to BullMQ Queue/Worker constructor
 */
export function getRedisConnection() {
  return redisConfig.connection;
}

/**
 * Helper function to validate all required paths and directories exist
 * Should be called during worker startup
 */
export async function validateConfig(): Promise<void> {
  const errors: string[] = [];

  // Validate temp directory is writable
  try {
    if (!fs.existsSync(config.TEMP_DIR)) {
      fs.mkdirSync(config.TEMP_DIR, { recursive: true });
    }
    // Test write access
    const testFile = path.join(config.TEMP_DIR, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
  } catch (error) {
    errors.push(`TEMP_DIR ${config.TEMP_DIR} is not writable: ${error}`);
  }

  // Validate FFmpeg is available
  if (config.FFMPEG_PATH) {
    if (!fs.existsSync(config.FFMPEG_PATH)) {
      errors.push(`FFMPEG_PATH ${config.FFMPEG_PATH} does not exist`);
    }
  }

  // Validate FFprobe is available
  if (config.FFPROBE_PATH) {
    if (!fs.existsSync(config.FFPROBE_PATH)) {
      errors.push(`FFPROBE_PATH ${config.FFPROBE_PATH} does not exist`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Configuration validation failed');
  }

  console.log('✅ Configuration validated successfully');
}

/**
 * Export type for use in other files
 */
export type Config = z.infer<typeof envSchema>;

/**
 * Configuration summary for logging
 */
export function getConfigSummary(): Record<string, unknown> {
  return {
    nodeEnv: config.NODE_ENV,
    redis: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      db: config.REDIS_DB,
    },
    s3: {
      endpoint: config.S3_ENDPOINT,
      bucket: config.S3_BUCKET,
      region: config.S3_REGION,
    },
    cdn: {
      baseUrl: config.CDN_BASE_URL,
    },
    worker: {
      maxConcurrentJobs: config.MAX_CONCURRENT_JOBS,
      tempDir: config.TEMP_DIR,
    },
    webhook: {
      enabled: webhookConfig.enabled,
      url: config.WEBHOOK_URL ? '[configured]' : '[not configured]',
    },
    ffmpeg: {
      path: config.FFMPEG_PATH || 'system ffmpeg',
      defaultVideoCodec: config.DEFAULT_VIDEO_CODEC,
      defaultAudioCodec: config.DEFAULT_AUDIO_CODEC,
    },
    logging: {
      level: config.LOG_LEVEL,
      format: config.LOG_FORMAT,
    },
  };
}
