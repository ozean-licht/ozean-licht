/**
 * Cron Trigger Service
 *
 * Manages scheduled execution of ADW workflows using cron expressions.
 * Supports creating, listing, and cancelling cron jobs for periodic workflow execution.
 *
 * @module services/cron-service
 */

import cron from 'node-cron';
import { logger } from '../config/logger.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { WorkflowType, ModelSet } from '../modules/adw/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Cron job configuration
 */
export interface CronJob {
  /** Unique job identifier */
  id: string;
  /** Cron expression (e.g., "0 9 * * MON" for every Monday at 9 AM) */
  schedule: string;
  /** Workflow type to execute */
  workflowType: WorkflowType;
  /** GitHub issue number to process */
  issueNumber: number;
  /** Model set to use */
  modelSet: ModelSet;
  /** Whether the job is enabled */
  enabled: boolean;
  /** Last execution timestamp */
  lastRun?: Date;
  /** Next scheduled execution */
  nextRun?: Date;
  /** Optional job description */
  description?: string;
}

/**
 * Internal cron job state
 */
interface CronJobState extends CronJob {
  /** node-cron task instance */
  task?: any; // cron.ScheduledTask type not exposed correctly
}

// ============================================================================
// State Management
// ============================================================================

/**
 * In-memory storage for cron jobs
 * In production, this should be replaced with database storage
 */
const cronJobs = new Map<string, CronJobState>();

/**
 * Generate unique ID for a cron job
 */
function generateJobId(): string {
  return `cron_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Calculate next run time from cron expression
 */
function getNextRunTime(schedule: string): Date | null {
  try {
    // Parse cron expression and calculate next run
    // This is a simplified implementation
    // In production, use a library like cron-parser
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Next minute as placeholder
    return now;
  } catch (error) {
    logger.error({ error, schedule }, 'Failed to calculate next run time');
    return null;
  }
}

// ============================================================================
// Cron Job Management
// ============================================================================

/**
 * Schedule a new cron job
 *
 * Creates a scheduled task that will execute the specified workflow
 * at the given cron schedule.
 *
 * @param job - Cron job configuration
 * @returns Job ID
 *
 * @example
 * ```typescript
 * const jobId = await scheduleCronJob({
 *   schedule: '0 9 * * MON',  // Every Monday at 9 AM
 *   workflowType: 'sdlc',
 *   issueNumber: 123,
 *   modelSet: 'base',
 *   enabled: true,
 *   description: 'Weekly SDLC workflow for issue #123'
 * });
 * ```
 */
export async function scheduleCronJob(
  job: Omit<CronJob, 'id' | 'lastRun' | 'nextRun'>
): Promise<string> {
  try {
    // Validate cron expression
    if (!cron.validate(job.schedule)) {
      throw new Error(`Invalid cron expression: ${job.schedule}`);
    }

    // Generate job ID
    const jobId = generateJobId();

    // Calculate next run time
    const nextRun = getNextRunTime(job.schedule);

    // Create job state
    const jobState: CronJobState = {
      id: jobId,
      ...job,
      nextRun: nextRun || undefined,
    };

    // Create cron task
    if (job.enabled) {
      const task = cron.schedule(job.schedule, async () => {
        await executeCronJob(jobId);
      });

      task.start();
      jobState.task = task;
    }

    // Store job
    cronJobs.set(jobId, jobState);

    logger.info(
      {
        jobId,
        schedule: job.schedule,
        workflowType: job.workflowType,
        issueNumber: job.issueNumber,
      },
      'Cron job scheduled'
    );

    return jobId;
  } catch (error) {
    logger.error({ error, job }, 'Failed to schedule cron job');
    throw error;
  }
}

/**
 * Execute a specific cron job
 *
 * @param jobId - Job identifier
 */
async function executeCronJob(jobId: string): Promise<void> {
  const job = cronJobs.get(jobId);

  if (!job) {
    logger.warn({ jobId }, 'Cron job not found');
    return;
  }

  if (!job.enabled) {
    logger.debug({ jobId }, 'Cron job is disabled, skipping execution');
    return;
  }

  logger.info(
    {
      jobId,
      workflowType: job.workflowType,
      issueNumber: job.issueNumber,
    },
    'Executing cron job'
  );

  try {
    // Create workflow
    const result = await WorkflowManager.createWorkflow(
      job.issueNumber,
      job.workflowType,
      job.modelSet
    );

    if (!result.success || !result.adwId) {
      logger.error({ error: result.error, jobId }, 'Failed to create workflow for cron job');
      return;
    }

    // Execute workflow in background
    WorkflowManager.executeWorkflow(result.adwId, job.workflowType).catch((error) => {
      logger.error({ error, jobId, adwId: result.adwId }, 'Cron job workflow execution failed');
    });

    // Update last run time
    job.lastRun = new Date();
    job.nextRun = getNextRunTime(job.schedule) || undefined;

    logger.info({ jobId, adwId: result.adwId }, 'Cron job executed successfully');
  } catch (error) {
    logger.error({ error, jobId }, 'Error executing cron job');
  }
}

/**
 * List all scheduled cron jobs
 *
 * @returns Array of cron jobs
 */
export async function listCronJobs(): Promise<CronJob[]> {
  const jobs: CronJob[] = [];

  for (const [, job] of cronJobs) {
    // Exclude internal task property
    const { task, ...jobData } = job;
    jobs.push(jobData);
  }

  return jobs;
}

/**
 * Get a specific cron job by ID
 *
 * @param jobId - Job identifier
 * @returns Cron job if found, null otherwise
 */
export async function getCronJob(jobId: string): Promise<CronJob | null> {
  const job = cronJobs.get(jobId);

  if (!job) {
    return null;
  }

  // Exclude internal task property
  const { task, ...jobData } = job;
  return jobData;
}

/**
 * Cancel a scheduled cron job
 *
 * Stops the scheduled task and removes the job from storage.
 *
 * @param jobId - Job identifier
 * @returns True if job was cancelled, false if not found
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCronJob('cron_12345');
 * if (cancelled) {
 *   console.log('Job cancelled successfully');
 * }
 * ```
 */
export async function cancelCronJob(jobId: string): Promise<boolean> {
  const job = cronJobs.get(jobId);

  if (!job) {
    logger.warn({ jobId }, 'Cron job not found');
    return false;
  }

  // Stop the cron task
  if (job.task) {
    job.task.stop();
  }

  // Remove from storage
  cronJobs.delete(jobId);

  logger.info({ jobId }, 'Cron job cancelled');
  return true;
}

/**
 * Manually trigger a cron job execution
 *
 * Executes the job immediately, outside of the scheduled time.
 *
 * @param jobId - Job identifier
 * @returns True if job was triggered, false if not found
 */
export async function triggerCronJob(jobId: string): Promise<boolean> {
  const job = cronJobs.get(jobId);

  if (!job) {
    logger.warn({ jobId }, 'Cron job not found');
    return false;
  }

  logger.info({ jobId }, 'Manually triggering cron job');

  // Execute job asynchronously
  executeCronJob(jobId).catch((error) => {
    logger.error({ error, jobId }, 'Manual cron job trigger failed');
  });

  return true;
}

/**
 * Update a cron job configuration
 *
 * @param jobId - Job identifier
 * @param updates - Partial job configuration to update
 * @returns True if updated, false if not found
 */
export async function updateCronJob(
  jobId: string,
  updates: Partial<Omit<CronJob, 'id' | 'lastRun' | 'nextRun'>>
): Promise<boolean> {
  const job = cronJobs.get(jobId);

  if (!job) {
    logger.warn({ jobId }, 'Cron job not found');
    return false;
  }

  // Stop existing task if schedule changes
  if (updates.schedule && updates.schedule !== job.schedule) {
    if (job.task) {
      job.task.stop();
    }

    // Validate new schedule
    if (!cron.validate(updates.schedule)) {
      throw new Error(`Invalid cron expression: ${updates.schedule}`);
    }

    // Create new task
    const task = cron.schedule(updates.schedule, async () => {
      await executeCronJob(jobId);
    });

    task.start();
    job.task = task;
    job.schedule = updates.schedule;
    job.nextRun = getNextRunTime(updates.schedule) || undefined;
  }

  // Update other fields
  if (updates.workflowType !== undefined) {
    job.workflowType = updates.workflowType;
  }
  if (updates.issueNumber !== undefined) {
    job.issueNumber = updates.issueNumber;
  }
  if (updates.modelSet !== undefined) {
    job.modelSet = updates.modelSet;
  }
  if (updates.enabled !== undefined) {
    job.enabled = updates.enabled;

    // Start/stop task based on enabled status
    if (job.task) {
      if (updates.enabled) {
        job.task.start();
      } else {
        job.task.stop();
      }
    }
  }
  if (updates.description !== undefined) {
    job.description = updates.description;
  }

  logger.info({ jobId, updates }, 'Cron job updated');
  return true;
}

/**
 * Execute all due cron jobs
 *
 * This function should be called periodically by a scheduler
 * to ensure jobs are executed even if the cron task fails.
 *
 * In practice, node-cron handles this automatically, so this
 * function is mainly for manual triggering or debugging.
 */
export async function executeDueJobs(): Promise<void> {
  const now = new Date();

  for (const [jobId, job] of cronJobs) {
    if (!job.enabled) {
      continue;
    }

    if (job.nextRun && job.nextRun <= now) {
      logger.debug({ jobId }, 'Executing due cron job');
      await executeCronJob(jobId);
    }
  }
}

// ============================================================================
// Service Initialization
// ============================================================================

/**
 * Initialize the cron service
 *
 * Should be called during application startup.
 */
export function initializeCronService(): void {
  logger.info('Cron service initialized');

  // In production, load jobs from database here
  // For now, starting with empty in-memory storage
}

/**
 * Shutdown the cron service
 *
 * Stops all running cron tasks.
 * Should be called during application shutdown.
 */
export function shutdownCronService(): void {
  logger.info('Shutting down cron service');

  for (const [jobId, job] of cronJobs) {
    if (job.task) {
      job.task.stop();
    }
  }

  cronJobs.clear();

  logger.info('Cron service shut down');
}
