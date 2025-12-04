/**
 * Video Management System (VMS) Type Definitions
 *
 * Comprehensive types for the VMS including:
 * - Video entity with VMS extensions
 * - Platform distribution tracking
 * - Analytics aggregation
 * - Encoding job management
 * - Pipeline stages
 */

import { ContentEntityScope } from './content';

// ================================================================
// Core Enums & Constants
// ================================================================

/** Video visibility levels */
export type VideoVisibility = 'public' | 'unlisted' | 'private' | 'paid';

/** Video migration status (Vimeo to Hetzner) */
export type VideoMigrationStatus =
  | 'vimeo_only'      // Video only exists on Vimeo
  | 'migrating'       // Currently being migrated to Hetzner
  | 'hetzner_primary' // Hetzner is primary, Vimeo is fallback
  | 'hetzner_only';   // Fully migrated, Vimeo can be deleted

/** Video pipeline stages for production workflow */
export type VideoPipelineStage =
  | 'draft'       // Initial state
  | 'recording'   // Being recorded
  | 'editing'     // In post-production
  | 'review'      // Awaiting approval
  | 'approved'    // Approved for processing
  | 'processing'  // Being encoded
  | 'published'   // Live and accessible
  | 'archived';   // Removed from active use

/** Video status (legacy, keep for compatibility) */
export type VideoStatus = 'draft' | 'published' | 'archived';

/** Platform identifiers */
export type VideoPlatform = 'vimeo' | 'youtube' | 'hetzner';

/** Platform distribution status */
export type PlatformStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'archived';

/** Encoding job status */
export type EncodingJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

// ================================================================
// Video Entity (Extended)
// ================================================================

/**
 * Extended Video entity with VMS fields
 */
export interface Video {
  id: string;
  airtableId?: string;

  // Core metadata
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status: VideoStatus;
  entityScope?: ContentEntityScope;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;

  // VMS Extensions
  tags: string[];
  masterFileUrl?: string;
  visibility: VideoVisibility;
  courseId?: string;
  moduleId?: string;
  sortOrder: number;
  publishedAt?: string;
  migrationStatus: VideoMigrationStatus;
  pipelineStage: VideoPipelineStage;

  // Joined data (optional, populated on demand)
  platforms?: VideoPlatformRecord[];
  analytics?: VideoAnalyticsSummary;
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  module?: {
    id: string;
    title: string;
  };
}

/**
 * Video with all related data (for detail views)
 */
export interface VideoWithRelations extends Video {
  platforms: VideoPlatformRecord[];
  analytics?: VideoAnalyticsSummary;
  activeEncodingJob?: EncodingJob;
  pipelineLink?: VideoPipelineLink;
}

// ================================================================
// Platform Distribution
// ================================================================

/**
 * Video platform distribution record
 */
export interface VideoPlatformRecord {
  id: string;
  videoId: string;
  platform: VideoPlatform;
  externalId?: string;
  externalUrl?: string;
  embedUrl?: string;
  status: PlatformStatus;
  privacyLevel?: string;
  syncedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating/updating platform records
 */
export interface UpsertPlatformInput {
  platform: VideoPlatform;
  externalId?: string;
  externalUrl?: string;
  embedUrl?: string;
  status?: PlatformStatus;
  privacyLevel?: string;
  metadata?: Record<string, unknown>;
}

// ================================================================
// Analytics
// ================================================================

/**
 * Daily analytics record per platform
 */
export interface VideoAnalyticsRecord {
  id: string;
  videoId: string;
  platform: string;
  date: string;
  views: number;
  watchTimeMinutes: number;
  uniqueViewers: number;
  avgWatchPercentage?: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

/**
 * Aggregated analytics summary (for dashboard widgets)
 */
export interface VideoAnalyticsSummary {
  totalViews: number;
  totalWatchTimeMinutes: number;
  totalUniqueViewers: number;
  avgWatchPercentage: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  // Trends (compared to previous period)
  viewsTrend?: number;      // Percentage change
  watchTimeTrend?: number;
  engagementTrend?: number;
}

/**
 * Analytics filter options
 */
export interface VideoAnalyticsFilters {
  videoId?: string;
  videoIds?: string[];
  platform?: VideoPlatform;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Top performing video result
 */
export interface TopPerformingVideo {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  views: number;
  watchTimeMinutes: number;
  engagement: number;
  trend: number;
}

// ================================================================
// Pipeline Links
// ================================================================

/**
 * Link between video and PM system task
 */
export interface VideoPipelineLink {
  id: string;
  videoId: string;
  pmSystem: string;
  projectId?: string;
  taskId?: string;
  pipelineStage: VideoPipelineStage;
  stageChangedAt: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ================================================================
// Encoding Jobs
// ================================================================

/**
 * Video rendition (quality variant)
 */
export interface VideoRendition {
  quality: string;    // e.g., "360p", "720p", "1080p"
  width: number;
  height: number;
  bitrate: number;    // kbps
  url: string;
}

/**
 * Error record in error history
 */
export interface EncodingError {
  timestamp: string;
  attempt: number;
  code: string;
  message: string;
}

/**
 * Encoding job for video processing
 */
export interface EncodingJob {
  id: string;
  videoId: string;
  status: EncodingJobStatus;
  progress: number;   // 0-100
  inputFileUrl: string;
  outputManifestUrl?: string;
  outputBucket: string;
  outputKey?: string;
  webhookUrl?: string;
  renditions: VideoRendition[];
  thumbnailUrls: string[];

  // Retry tracking
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt?: string;
  lastError?: string;
  errorHistory: EncodingError[];

  // Alerting
  alertSent: boolean;

  // Worker info
  workerId?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Encoding job creation input
 */
export interface CreateEncodingJobInput {
  videoId: string;
  inputFileUrl: string;
  outputBucket?: string;
  webhookUrl?: string;
}

/**
 * Encoding webhook payload
 */
export interface EncodingWebhookPayload {
  jobId: string;
  videoId: string;
  status: 'progress' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  renditions?: VideoRendition[];
  thumbnailUrls?: string[];
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// ================================================================
// Input Types
// ================================================================

/**
 * Create video input
 */
export interface CreateVideoInput {
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: VideoStatus;
  entityScope?: ContentEntityScope;

  // VMS fields
  tags?: string[];
  masterFileUrl?: string;
  visibility?: VideoVisibility;
  courseId?: string;
  moduleId?: string;
  sortOrder?: number;
  pipelineStage?: VideoPipelineStage;
  metadata?: Record<string, unknown>;
}

/**
 * Update video input
 */
export interface UpdateVideoInput {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: VideoStatus;
  entityScope?: ContentEntityScope;

  // VMS fields
  tags?: string[];
  masterFileUrl?: string;
  visibility?: VideoVisibility;
  courseId?: string | null;  // null to unset
  moduleId?: string | null;  // null to unset
  sortOrder?: number;
  publishedAt?: string | null;
  migrationStatus?: VideoMigrationStatus;
  pipelineStage?: VideoPipelineStage;
  metadata?: Record<string, unknown>;
}

/**
 * Bulk update input
 */
export interface BulkUpdateVideosInput {
  ids: string[];
  updates: Partial<UpdateVideoInput>;
}

// ================================================================
// Filter & List Types
// ================================================================

/**
 * Video list filter options
 */
export interface VideoListFilters {
  status?: VideoStatus;
  visibility?: VideoVisibility;
  migrationStatus?: VideoMigrationStatus;
  pipelineStage?: VideoPipelineStage;
  platform?: VideoPlatform;  // Filter by platform presence
  entityScope?: ContentEntityScope;
  courseId?: string;
  moduleId?: string;
  tags?: string[];           // Filter by any matching tag
  search?: string;           // Search title/description
  hasEncodingJob?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: VideoOrderBy;
  orderDirection?: 'asc' | 'desc';
}

/** Valid order by fields */
export type VideoOrderBy =
  | 'created_at'
  | 'updated_at'
  | 'title'
  | 'duration_seconds'
  | 'published_at'
  | 'sort_order'
  | 'views';  // Requires analytics join

/**
 * Paginated video list result
 */
export interface VideoListResult {
  videos: Video[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ================================================================
// Stats & Dashboard Types
// ================================================================

/**
 * Video statistics for dashboard
 */
export interface VideoStats {
  total: number;
  byStatus: {
    draft: number;
    published: number;
    archived: number;
  };
  byVisibility: {
    public: number;
    unlisted: number;
    private: number;
    paid: number;
  };
  byMigrationStatus: {
    vimeo_only: number;
    migrating: number;
    hetzner_primary: number;
    hetzner_only: number;
  };
  byPipelineStage: Record<VideoPipelineStage, number>;
  totalDurationMinutes: number;
}

/**
 * Migration dashboard stats
 */
export interface MigrationDashboardStats {
  totalVideos: number;
  migratedCount: number;
  pendingCount: number;
  inProgressCount: number;
  failedCount: number;
  estimatedSavings: number;  // Monthly USD saved
  migrationProgress: number; // 0-100 percentage
}

// ================================================================
// Vimeo Integration Types
// ================================================================

/**
 * Vimeo video data from API
 */
export interface VimeoVideo {
  uri: string;
  name: string;
  description?: string;
  duration: number;
  pictures: {
    sizes: Array<{
      width: number;
      height: number;
      link: string;
    }>;
  };
  privacy: {
    view: string;
    embed: string;
    download: boolean;
  };
  embed: {
    html: string;
  };
  link: string;
  created_time: string;
  modified_time: string;
  stats: {
    plays: number;
  };
}

/**
 * Vimeo sync result
 */
export interface VimeoSyncResult {
  added: number;
  updated: number;
  errors: number;
  quotaRemaining: number;
  nextSyncAllowed: string;
}

// ================================================================
// Pipeline Stage Metadata
// ================================================================

/**
 * Pipeline stage configuration (for UI)
 */
export interface PipelineStageConfig {
  value: VideoPipelineStage;
  label: string;
  color: string;
  description: string;
  icon?: string;
}

/** Pipeline stages with metadata */
export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { value: 'draft', label: 'Draft', color: 'gray', description: 'Initial state, not started' },
  { value: 'recording', label: 'Recording', color: 'yellow', description: 'Video is being recorded' },
  { value: 'editing', label: 'Editing', color: 'orange', description: 'In post-production editing' },
  { value: 'review', label: 'Review', color: 'blue', description: 'Awaiting content review' },
  { value: 'approved', label: 'Approved', color: 'purple', description: 'Approved for processing' },
  { value: 'processing', label: 'Processing', color: 'cyan', description: 'Being encoded for delivery' },
  { value: 'published', label: 'Published', color: 'green', description: 'Live and accessible' },
  { value: 'archived', label: 'Archived', color: 'slate', description: 'Removed from active use' },
];

/**
 * Migration status configuration (for UI)
 */
export interface MigrationStatusConfig {
  value: VideoMigrationStatus;
  label: string;
  color: string;
  canMigrate: boolean;
  canRollback: boolean;
}

/** Migration statuses with metadata */
export const MIGRATION_STATUSES: MigrationStatusConfig[] = [
  { value: 'vimeo_only', label: 'Vimeo Only', color: 'blue', canMigrate: true, canRollback: false },
  { value: 'migrating', label: 'Migrating...', color: 'yellow', canMigrate: false, canRollback: false },
  { value: 'hetzner_primary', label: 'Hetzner (Vimeo Backup)', color: 'green', canMigrate: false, canRollback: true },
  { value: 'hetzner_only', label: 'Hetzner Only', color: 'emerald', canMigrate: false, canRollback: false },
];
