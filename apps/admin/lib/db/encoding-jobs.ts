/**
 * Encoding Jobs Database Queries
 *
 * Direct PostgreSQL queries for video encoding job management.
 * Handles job lifecycle: creation, progress updates, completion, failure, and retry logic.
 */

import { query } from './index';
import {
  EncodingJob,
  EncodingJobStatus,
  VideoRendition,
  EncodingError,
  CreateEncodingJobInput,
} from '@/types/video';

// Database row type (snake_case)
interface EncodingJobRow {
  id: string;
  video_id: string;
  status: string;
  progress: number;
  input_file_url: string;
  output_manifest_url: string | null;
  output_bucket: string;
  output_key: string | null;
  webhook_url: string | null;
  renditions: VideoRendition[];
  thumbnail_urls: string[];
  attempt_count: number;
  max_attempts: number;
  next_retry_at: string | null;
  last_error: string | null;
  error_history: EncodingError[];
  alert_sent: boolean;
  worker_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Map database row to EncodingJob type
 */
function mapEncodingJob(row: EncodingJobRow): EncodingJob {
  return {
    id: row.id,
    videoId: row.video_id,
    status: row.status as EncodingJobStatus,
    progress: row.progress,
    inputFileUrl: row.input_file_url,
    outputManifestUrl: row.output_manifest_url || undefined,
    outputBucket: row.output_bucket,
    outputKey: row.output_key || undefined,
    webhookUrl: row.webhook_url || undefined,
    renditions: row.renditions || [],
    thumbnailUrls: row.thumbnail_urls || [],
    attemptCount: row.attempt_count,
    maxAttempts: row.max_attempts,
    nextRetryAt: row.next_retry_at || undefined,
    lastError: row.last_error || undefined,
    errorHistory: row.error_history || [],
    alertSent: row.alert_sent,
    workerId: row.worker_id || undefined,
    startedAt: row.started_at || undefined,
    completedAt: row.completed_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Calculate next retry timestamp with exponential backoff
 * Backoff pattern: [5, 15, 60] minutes based on attempt count
 */
function calculateNextRetry(attemptCount: number): Date {
  const backoffMinutes = [5, 15, 60];
  const delayMinutes = backoffMinutes[Math.min(attemptCount, backoffMinutes.length - 1)];
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
  return nextRetry;
}

/**
 * Create a new encoding job
 */
export async function createEncodingJob(
  input: CreateEncodingJobInput
): Promise<EncodingJob> {
  const sql = `
    INSERT INTO encoding_jobs (
      video_id,
      input_file_url,
      output_bucket,
      webhook_url,
      status,
      progress
    ) VALUES ($1, $2, $3, $4, 'queued', 0)
    RETURNING
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
  `;

  const params = [
    input.videoId,
    input.inputFileUrl,
    input.outputBucket || process.env.VIDEO_ENCODING_BUCKET || 'video-hls',
    input.webhookUrl || null,
  ];

  const rows = await query<EncodingJobRow>(sql, params);
  if (rows.length === 0) {
    throw new Error('Failed to create encoding job');
  }

  return mapEncodingJob(rows[0]);
}

/**
 * Get an encoding job by ID
 */
export async function getEncodingJobById(id: string): Promise<EncodingJob | null> {
  const sql = `
    SELECT
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
    FROM encoding_jobs
    WHERE id = $1
  `;

  const rows = await query<EncodingJobRow>(sql, [id]);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}

/**
 * Update job progress
 */
export async function updateJobProgress(
  id: string,
  progress: number,
  workerId?: string
): Promise<EncodingJob | null> {
  // Validate progress range
  const validProgress = Math.max(0, Math.min(100, progress));

  const sql = `
    UPDATE encoding_jobs
    SET
      progress = $2,
      status = CASE
        WHEN status = 'queued' THEN 'processing'
        ELSE status
      END,
      worker_id = COALESCE($3, worker_id),
      started_at = COALESCE(started_at, NOW()),
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
  `;

  const params = [id, validProgress, workerId || null];
  const rows = await query<EncodingJobRow>(sql, params);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}

/**
 * Complete a job successfully
 */
export async function completeJob(
  id: string,
  outputUrl: string,
  renditions: VideoRendition[],
  thumbnailUrls?: string[]
): Promise<EncodingJob | null> {
  const sql = `
    UPDATE encoding_jobs
    SET
      status = 'completed',
      progress = 100,
      output_manifest_url = $2,
      renditions = $3,
      thumbnail_urls = $4,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
  `;

  const params = [
    id,
    outputUrl,
    JSON.stringify(renditions),
    JSON.stringify(thumbnailUrls || []),
  ];

  const rows = await query<EncodingJobRow>(sql, params);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}

/**
 * Fail a job and set up retry logic
 */
export async function failJob(
  id: string,
  errorMessage: string,
  errorCode?: string
): Promise<EncodingJob | null> {
  // First, get current attempt count to calculate retry
  const currentJob = await getEncodingJobById(id);
  if (!currentJob) {
    return null;
  }

  const newAttemptCount = currentJob.attemptCount + 1;
  const nextRetry = newAttemptCount < currentJob.maxAttempts
    ? calculateNextRetry(newAttemptCount)
    : null;

  // Create error record
  const errorRecord: EncodingError = {
    timestamp: new Date().toISOString(),
    attempt: newAttemptCount,
    code: errorCode || 'UNKNOWN_ERROR',
    message: errorMessage,
  };

  // Add to error history
  const updatedErrorHistory = [...currentJob.errorHistory, errorRecord];

  const sql = `
    UPDATE encoding_jobs
    SET
      status = 'failed',
      attempt_count = $2,
      next_retry_at = $3,
      last_error = $4,
      error_history = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
  `;

  const params = [
    id,
    newAttemptCount,
    nextRetry ? nextRetry.toISOString() : null,
    errorMessage,
    JSON.stringify(updatedErrorHistory),
  ];

  const rows = await query<EncodingJobRow>(sql, params);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}

/**
 * Get jobs by status
 */
export async function getJobsByStatus(
  status: EncodingJobStatus
): Promise<EncodingJob[]> {
  const sql = `
    SELECT
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
    FROM encoding_jobs
    WHERE status = $1
    ORDER BY created_at DESC
  `;

  const rows = await query<EncodingJobRow>(sql, [status]);
  return rows.map(mapEncodingJob);
}

/**
 * Get active (non-completed) job for a video
 * Returns the most recent non-completed job
 */
export async function getActiveJobForVideo(
  videoId: string
): Promise<EncodingJob | null> {
  const sql = `
    SELECT
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
    FROM encoding_jobs
    WHERE video_id = $1
      AND status NOT IN ('completed', 'cancelled')
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const rows = await query<EncodingJobRow>(sql, [videoId]);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}

/**
 * Get failed jobs that are ready for retry
 * Returns jobs where next_retry_at <= NOW() and attempt_count < max_attempts
 */
export async function getJobsReadyForRetry(): Promise<EncodingJob[]> {
  const sql = `
    SELECT
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
    FROM encoding_jobs
    WHERE status = 'failed'
      AND next_retry_at IS NOT NULL
      AND next_retry_at <= NOW()
      AND attempt_count < max_attempts
    ORDER BY next_retry_at ASC
  `;

  const rows = await query<EncodingJobRow>(sql);
  return rows.map(mapEncodingJob);
}

/**
 * Mark that an alert has been sent for a job
 */
export async function markAlertSent(id: string): Promise<void> {
  const sql = `
    UPDATE encoding_jobs
    SET
      alert_sent = TRUE,
      updated_at = NOW()
    WHERE id = $1
  `;

  await query(sql, [id]);
}

/**
 * Cancel a job
 */
export async function cancelJob(id: string): Promise<EncodingJob | null> {
  const sql = `
    UPDATE encoding_jobs
    SET
      status = 'cancelled',
      updated_at = NOW()
    WHERE id = $1
      AND status NOT IN ('completed', 'cancelled')
    RETURNING
      id, video_id, status, progress,
      input_file_url, output_manifest_url, output_bucket, output_key,
      webhook_url, renditions, thumbnail_urls,
      attempt_count, max_attempts, next_retry_at,
      last_error, error_history, alert_sent,
      worker_id, started_at, completed_at,
      created_at, updated_at
  `;

  const rows = await query<EncodingJobRow>(sql, [id]);
  return rows.length > 0 ? mapEncodingJob(rows[0]) : null;
}
