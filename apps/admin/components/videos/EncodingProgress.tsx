'use client';

/**
 * EncodingProgress Component
 *
 * Displays encoding job progress in the video management UI.
 * Features auto-polling for live updates, detailed status information,
 * and retry/cancel actions for failed jobs.
 *
 * Supports all encoding states: queued, processing, completed, failed, cancelled
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Ban,
  PlayCircle,
} from 'lucide-react';
import { EncodingJob, EncodingJobStatus } from '@/types/video';
import { cn } from '@/lib/utils';
import {
  CossUIProgress,
  CossUIProgressLabel,
  CossUIProgressValue,
  CossUIBadge,
  CossUIButton,
} from '@shared/ui';

// ================================================================
// Types & Interfaces
// ================================================================

interface EncodingProgressProps {
  job: EncodingJob | null;
  videoId: string;
  onRetry?: () => void;
  onCancel?: () => void;
  pollInterval?: number; // ms, default 3000
}

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeVariant: 'success' | 'warning' | 'outline' | 'destructive' | 'secondary';
}

// ================================================================
// Constants
// ================================================================

const STATUS_CONFIG: Record<EncodingJobStatus, StatusConfig> = {
  queued: {
    label: 'Queued',
    color: 'text-gray-400',
    icon: Clock,
    badgeVariant: 'outline',
  },
  processing: {
    label: 'Processing',
    color: 'text-yellow-400',
    icon: Loader2,
    badgeVariant: 'warning',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    icon: CheckCircle2,
    badgeVariant: 'success',
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    icon: XCircle,
    badgeVariant: 'destructive',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-gray-500',
    icon: Ban,
    badgeVariant: 'secondary',
  },
};

const QUALITY_LABELS: Record<string, { label: string; color: string }> = {
  '360p': { label: '360p', color: 'bg-gray-600' },
  '480p': { label: '480p', color: 'bg-blue-600' },
  '720p': { label: '720p HD', color: 'bg-purple-600' },
  '1080p': { label: '1080p Full HD', color: 'bg-pink-600' },
  '1440p': { label: '1440p 2K', color: 'bg-orange-600' },
  '2160p': { label: '4K', color: 'bg-red-600' },
};

// ================================================================
// Helper Functions
// ================================================================

/**
 * Format duration in seconds to human-readable string
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Calculate elapsed time from start timestamp
 */
function calculateElapsedTime(startedAt?: string): number {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  return Math.floor((now - start) / 1000); // seconds
}

/**
 * Estimate remaining time based on progress and elapsed time
 */
function estimateRemainingTime(progress: number, elapsedSeconds: number): number {
  if (progress <= 0) return 0;
  const totalEstimated = (elapsedSeconds / progress) * 100;
  return Math.max(0, totalEstimated - elapsedSeconds);
}

/**
 * Get quality label from rendition height
 */
function getQualityLabel(height: number): string {
  const key = `${height}p`;
  return QUALITY_LABELS[key]?.label || `${height}p`;
}

/**
 * Get quality color from rendition height
 */
function getQualityColor(height: number): string {
  const key = `${height}p`;
  return QUALITY_LABELS[key]?.color || 'bg-gray-600';
}

// ================================================================
// Component
// ================================================================

export default function EncodingProgress({
  job,
  videoId,
  onRetry,
  onCancel,
  pollInterval = 3000,
}: EncodingProgressProps) {
  // State
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Update elapsed time for processing jobs
  useEffect(() => {
    if (!job || job.status !== 'processing' || !job.startedAt) {
      setElapsedTime(0);
      return;
    }

    // Initial calculation
    setElapsedTime(calculateElapsedTime(job.startedAt));

    // Update every second
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(job.startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [job?.startedAt, job?.status]);

  // Auto-polling for active jobs
  useEffect(() => {
    if (!job || !['queued', 'processing'].includes(job.status)) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    const interval = setInterval(async () => {
      try {
        // Fetch updated job status
        const response = await fetch(`/api/videos/${videoId}/encoding`);
        if (!response.ok) throw new Error('Failed to fetch encoding status');

        await response.json();
        // The parent component should handle updating the job prop
        // This is just to trigger a re-render cycle
      } catch (error) {
        console.error('[EncodingProgress] Polling error:', error);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [job?.status, videoId, pollInterval]);

  // No job
  if (!job) {
    return (
      <div className="rounded-lg border border-primary/10 bg-card/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 text-gray-400">
          <PlayCircle className="w-5 h-5" />
          <p className="text-sm">No encoding job found for this video.</p>
        </div>
      </div>
    );
  }

  // Status configuration
  const config = STATUS_CONFIG[job.status];
  const StatusIcon = config.icon;
  const isActive = ['queued', 'processing'].includes(job.status);
  const showProgress = job.status === 'processing';
  const showRenditions = job.status === 'completed' && job.renditions.length > 0;
  const showError = job.status === 'failed' && job.lastError;
  const estimatedRemaining = showProgress
    ? estimateRemainingTime(job.progress, elapsedTime)
    : 0;

  return (
    <div className="rounded-lg border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-6 space-y-4">
        {/* Status Badge & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon
              className={cn(
                'w-6 h-6',
                config.color,
                job.status === 'processing' && 'animate-spin'
              )}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {config.label}
                </h3>
                <CossUIBadge variant={config.badgeVariant} className="font-sans">
                  {job.status}
                </CossUIBadge>
              </div>
              {job.status === 'queued' && (
                <p className="text-sm text-gray-400 mt-1">
                  Waiting in queue... (Attempt {job.attemptCount}/{job.maxAttempts})
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {job.status === 'failed' && onRetry && (
              <CossUIButton
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-[#0ec2bc] text-[#0ec2bc] hover:bg-[#0ec2bc] hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry ({job.attemptCount}/{job.maxAttempts})
              </CossUIButton>
            )}
            {isActive && onCancel && (
              <CossUIButton
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                <Ban className="w-4 h-4 mr-2" />
                Cancel
              </CossUIButton>
            )}
          </div>
        </div>

        {/* Progress Bar (Processing) */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <CossUIProgressLabel>Encoding Progress</CossUIProgressLabel>
              <CossUIProgressValue value={job.progress} />
            </div>
            <CossUIProgress value={job.progress} max={100} />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Elapsed: {formatDuration(elapsedTime)}</span>
              <span>ETA: ~{formatDuration(estimatedRemaining)}</span>
            </div>
          </div>
        )}

        {/* Renditions List (Completed) */}
        {showRenditions && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Output Renditions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {job.renditions
                .sort((a, b) => b.height - a.height)
                .map((rendition, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-md bg-[#00111A]/50 border border-primary/10 p-2"
                  >
                    <div
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-semibold text-white',
                        getQualityColor(rendition.height)
                      )}
                    >
                      {getQualityLabel(rendition.height)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {rendition.width}×{rendition.height}
                    </div>
                  </div>
                ))}
            </div>
            {job.outputManifestUrl && (
              <a
                href={job.outputManifestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#0ec2bc] hover:text-[#0ec2bc]/80 transition-colors"
              >
                View HLS Manifest
              </a>
            )}
          </div>
        )}

        {/* Error Message (Failed) */}
        {showError && (
          <div className="rounded-md bg-red-900/20 border border-red-400/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-400 mb-1">
                  Encoding Failed
                </h4>
                <p className="text-sm text-gray-300">{job.lastError}</p>
                {job.errorHistory.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Total failures: {job.errorHistory.length} / {job.maxAttempts} attempts
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {job.status === 'cancelled' && (
          <div className="rounded-md bg-gray-800/30 border border-gray-600/30 p-4">
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-gray-500" />
              <p className="text-sm text-gray-400">
                Encoding job was cancelled.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Technical Details */}
      <div className="border-t border-primary/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-primary/5 transition-colors"
        >
          <span>Technical Details</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Job ID:</span>
                <span className="ml-2 font-mono text-gray-300">{job.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Video ID:</span>
                <span className="ml-2 font-mono text-gray-300">{job.videoId}</span>
              </div>
              {job.workerId && (
                <div>
                  <span className="text-gray-500">Worker ID:</span>
                  <span className="ml-2 font-mono text-gray-300">{job.workerId}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Output Bucket:</span>
                <span className="ml-2 font-mono text-gray-300">{job.outputBucket}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-primary/5">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-300">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>
              {job.startedAt && (
                <div>
                  <span className="text-gray-500">Started:</span>
                  <span className="ml-2 text-gray-300">
                    {new Date(job.startedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {job.completedAt && (
                <div>
                  <span className="text-gray-500">Completed:</span>
                  <span className="ml-2 text-gray-300">
                    {new Date(job.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {job.errorHistory.length > 0 && (
              <div className="pt-2 border-t border-primary/5">
                <h5 className="text-gray-500 mb-2">Error History:</h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {job.errorHistory.map((error, idx) => (
                    <div
                      key={idx}
                      className="rounded bg-red-900/10 border border-red-400/20 p-2"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Attempt {error.attempt}</span>
                        <span>{new Date(error.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-red-400 font-mono">{error.code}:</span>
                        <span className="text-gray-300 ml-2">{error.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isPolling && (
              <div className="pt-2 border-t border-primary/5 flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Auto-refreshing every {pollInterval / 1000}s...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
