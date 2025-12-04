/**
 * Zod validation schemas for Video Management System (VMS)
 *
 * Provides client-side and server-side validation for:
 * - Video CRUD operations (create, update)
 * - Video filtering and search
 * - Platform distribution (upsert)
 * - Encoding job management
 * - Analytics queries
 *
 * Usage:
 * - Client-side: Use schemas in form components for instant validation
 * - Server-side: Use in API routes for request validation
 */

import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// ================================================================
// Sanitization Helpers
// ================================================================

/**
 * Sanitize plain text by removing all HTML tags
 *
 * Strips all HTML tags from the input while keeping the text content.
 * Use this for fields that should not contain any HTML formatting.
 *
 * @param text - Raw text that may contain HTML
 * @returns Plain text with all HTML tags removed
 *
 * @example
 * sanitizeText('Hello <b>world</b><script>alert("xss")</script>');
 * // Returns: 'Hello world'
 */
function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

// ================================================================
// Common Enum Schemas
// ================================================================

/**
 * Video visibility levels
 */
export const videoVisibilitySchema = z.enum(['public', 'unlisted', 'private', 'paid']);

/**
 * Video migration status (Vimeo to Hetzner)
 */
export const videoMigrationStatusSchema = z.enum([
  'vimeo_only',
  'migrating',
  'hetzner_primary',
  'hetzner_only',
]);

/**
 * Video pipeline stages for production workflow
 */
export const videoPipelineStageSchema = z.enum([
  'draft',
  'recording',
  'editing',
  'review',
  'approved',
  'processing',
  'published',
  'archived',
]);

/**
 * Video status (legacy, keep for compatibility)
 */
export const videoStatusSchema = z.enum(['draft', 'published', 'archived']);

/**
 * Platform identifiers
 */
export const videoPlatformSchema = z.enum(['vimeo', 'youtube', 'hetzner']);

/**
 * Platform distribution status
 */
export const platformStatusSchema = z.enum([
  'pending',
  'processing',
  'ready',
  'failed',
  'archived',
]);

/**
 * Encoding job status
 */
export const encodingJobStatusSchema = z.enum([
  'queued',
  'processing',
  'completed',
  'failed',
  'cancelled',
]);

/**
 * Content entity scope
 */
export const entityScopeSchema = z.enum(['ozean_licht', 'kids_ascension']);

/**
 * Valid order by fields for video listing
 */
export const videoOrderBySchema = z.enum([
  'created_at',
  'updated_at',
  'title',
  'duration_seconds',
  'published_at',
  'sort_order',
  'views',
]);

/**
 * Sort direction
 */
export const orderDirectionSchema = z.enum(['asc', 'desc']);

// ================================================================
// Video Schemas
// ================================================================

/**
 * Schema for creating a new video
 *
 * Required fields: title
 * Optional fields: All other fields with appropriate defaults
 */
export const createVideoSchema = z.object({
  // Core metadata (required)
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => sanitizeText(val.trim())),

  // Core metadata (optional)
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .transform((val) => (val ? sanitizeText(val.trim()) : undefined)),
  videoUrl: z
    .string()
    .url('Please enter a valid video URL')
    .optional(),
  thumbnailUrl: z
    .string()
    .url('Please enter a valid thumbnail URL')
    .optional(),
  durationSeconds: z
    .number()
    .int('Duration must be a whole number')
    .min(0, 'Duration cannot be negative')
    .optional(),
  status: videoStatusSchema.optional().default('draft'),
  entityScope: entityScopeSchema.optional(),

  // VMS fields
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .optional()
    .default([]),
  masterFileUrl: z
    .string()
    .url('Please enter a valid master file URL')
    .optional(),
  visibility: videoVisibilitySchema.optional().default('private'),
  courseId: z
    .string()
    .uuid('Invalid course ID')
    .optional(),
  moduleId: z
    .string()
    .uuid('Invalid module ID')
    .optional(),
  sortOrder: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .optional()
    .default(0),
  pipelineStage: videoPipelineStageSchema.optional().default('draft'),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Schema for updating an existing video
 *
 * All fields are optional since partial updates are supported
 * Use null to explicitly unset courseId or moduleId
 */
export const updateVideoSchema = z.object({
  // Core metadata
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => sanitizeText(val.trim()))
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeText(val.trim()) : val)),
  videoUrl: z
    .string()
    .url('Please enter a valid video URL')
    .optional()
    .nullable(),
  thumbnailUrl: z
    .string()
    .url('Please enter a valid thumbnail URL')
    .optional()
    .nullable(),
  durationSeconds: z
    .number()
    .int('Duration must be a whole number')
    .min(0, 'Duration cannot be negative')
    .optional()
    .nullable(),
  status: videoStatusSchema.optional(),
  entityScope: entityScopeSchema.optional(),

  // VMS fields
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .optional(),
  masterFileUrl: z
    .string()
    .url('Please enter a valid master file URL')
    .optional()
    .nullable(),
  visibility: videoVisibilitySchema.optional(),
  courseId: z
    .string()
    .uuid('Invalid course ID')
    .optional()
    .nullable(),
  moduleId: z
    .string()
    .uuid('Invalid module ID')
    .optional()
    .nullable(),
  sortOrder: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .optional(),
  publishedAt: z
    .string()
    .datetime('Invalid datetime format')
    .optional()
    .nullable(),
  migrationStatus: videoMigrationStatusSchema.optional(),
  pipelineStage: videoPipelineStageSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Schema for video list filtering and pagination
 *
 * Supports filtering by status, visibility, pipeline stage, platform,
 * search text, and pagination parameters
 */
export const videoFilterSchema = z.object({
  // Filter fields
  status: videoStatusSchema.optional(),
  visibility: videoVisibilitySchema.optional(),
  migrationStatus: videoMigrationStatusSchema.optional(),
  pipelineStage: videoPipelineStageSchema.optional(),
  platform: videoPlatformSchema.optional(),
  entityScope: entityScopeSchema.optional(),
  courseId: z.string().uuid('Invalid course ID').optional(),
  moduleId: z.string().uuid('Invalid module ID').optional(),
  tags: z
    .array(z.string().min(1))
    .optional(),
  search: z
    .string()
    .max(200, 'Search query too long')
    .optional()
    .transform((val) => val?.trim() || undefined),
  hasEncodingJob: z
    .boolean()
    .optional(),

  // Pagination
  limit: z
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  offset: z
    .number()
    .int('Offset must be a whole number')
    .min(0, 'Offset cannot be negative')
    .optional()
    .default(0),

  // Sorting
  orderBy: videoOrderBySchema.optional().default('created_at'),
  orderDirection: orderDirectionSchema.optional().default('desc'),
});

/**
 * Schema for bulk video updates
 */
export const bulkUpdateVideosSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid video ID'))
    .min(1, 'At least one video ID is required')
    .max(50, 'Cannot update more than 50 videos at once'),
  updates: updateVideoSchema,
});

// ================================================================
// Platform Distribution Schemas
// ================================================================

/**
 * Schema for creating/updating a platform record
 */
export const upsertPlatformSchema = z.object({
  platform: videoPlatformSchema,
  externalId: z.string().optional(),
  externalUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional(),
  embedUrl: z
    .string()
    .url('Please enter a valid embed URL')
    .optional(),
  status: platformStatusSchema.optional().default('pending'),
  privacyLevel: z.string().max(50).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ================================================================
// Encoding Job Schemas
// ================================================================

/**
 * Video rendition schema
 */
export const videoRenditionSchema = z.object({
  quality: z.string().min(1, 'Quality is required'),
  width: z
    .number()
    .int('Width must be a whole number')
    .min(1, 'Width must be positive'),
  height: z
    .number()
    .int('Height must be a whole number')
    .min(1, 'Height must be positive'),
  bitrate: z
    .number()
    .int('Bitrate must be a whole number')
    .min(1, 'Bitrate must be positive'),
  url: z.string().url('Please enter a valid URL'),
});

/**
 * Encoding error schema
 */
export const encodingErrorSchema = z.object({
  timestamp: z.string().datetime('Invalid datetime format'),
  attempt: z
    .number()
    .int('Attempt must be a whole number')
    .min(1, 'Attempt must be positive'),
  code: z.string().min(1, 'Error code is required'),
  message: z.string().min(1, 'Error message is required'),
});

/**
 * Schema for creating an encoding job
 */
export const encodingJobSchema = z.object({
  videoId: z.string().uuid('Invalid video ID'),
  inputFileUrl: z
    .string()
    .url('Please enter a valid input file URL')
    .min(1, 'Input file URL is required'),
  outputBucket: z
    .string()
    .min(1, 'Output bucket is required')
    .optional()
    .default(process.env.VIDEO_ENCODING_BUCKET || 'hetzner-videos'),
});

/**
 * Schema for triggering an encoding job via API
 */
export const triggerEncodingSchema = z.object({
  inputFileUrl: z
    .string()
    .url('Please enter a valid input file URL')
    .optional()
    .refine(
      (url) => {
        if (!url) return true; // Optional field

        // Only allow HTTPS URLs (not HTTP)
        if (!url.startsWith('https://')) {
          return false;
        }

        // Parse URL to check hostname
        try {
          const parsed = new URL(url);
          const hostname = parsed.hostname.toLowerCase();

          // Block localhost and loopback addresses
          if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            hostname === '0.0.0.0'
          ) {
            return false;
          }

          // Block private IP ranges (RFC 1918)
          // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
          if (
            hostname.startsWith('10.') ||
            hostname.startsWith('192.168.') ||
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
          ) {
            return false;
          }

          // Block link-local addresses (169.254.0.0/16)
          if (hostname.startsWith('169.254.')) {
            return false;
          }

          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          'Invalid URL: Only HTTPS URLs to public hosts are allowed (no localhost, private IPs, or link-local addresses)',
      }
    ),
  outputBucket: z
    .string()
    .min(1, 'Output bucket name is required')
    .optional()
    .default('video-hls'),
  resolutions: z
    .array(z.enum(['360p', '480p', '720p', '1080p']))
    .optional(),
  priority: z
    .enum(['low', 'normal', 'high'])
    .optional()
    .default('normal'),
});

/**
 * Schema for updating an encoding job
 */
export const updateEncodingJobSchema = z.object({
  status: encodingJobStatusSchema.optional(),
  progress: z
    .number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100')
    .optional(),
  outputManifestUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional(),
  outputKey: z.string().optional(),
  renditions: z.array(videoRenditionSchema).optional(),
  thumbnailUrls: z.array(z.string().url('Please enter a valid URL')).optional(),
  workerId: z.string().optional(),
  lastError: z.string().optional(),
});

/**
 * Schema for encoding webhook payload
 */
export const encodingWebhookSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  videoId: z.string().uuid('Invalid video ID'),
  status: z.enum(['progress', 'completed', 'failed']),
  progress: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  outputUrl: z.string().url().optional(),
  renditions: z.array(videoRenditionSchema).optional(),
  thumbnailUrls: z.array(z.string().url()).optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
  timestamp: z.string().datetime('Invalid datetime format'),
});

// ================================================================
// Analytics Schemas
// ================================================================

/**
 * Schema for analytics filter options
 */
export const analyticsFilterSchema = z.object({
  videoId: z.string().uuid('Invalid video ID').optional(),
  videoIds: z
    .array(z.string().uuid('Invalid video ID'))
    .optional(),
  platform: videoPlatformSchema.optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  limit: z
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
}).refine(
  (data) => {
    // If both dates are provided, ensure startDate <= endDate
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
);

/**
 * Schema for creating analytics records (for testing/seeding)
 */
export const createAnalyticsRecordSchema = z.object({
  videoId: z.string().uuid('Invalid video ID'),
  platform: z.string().min(1, 'Platform is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  views: z
    .number()
    .int('Views must be a whole number')
    .min(0, 'Views cannot be negative')
    .default(0),
  watchTimeMinutes: z
    .number()
    .int('Watch time must be a whole number')
    .min(0, 'Watch time cannot be negative')
    .default(0),
  uniqueViewers: z
    .number()
    .int('Unique viewers must be a whole number')
    .min(0, 'Unique viewers cannot be negative')
    .default(0),
  avgWatchPercentage: z
    .number()
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100')
    .optional(),
  likes: z
    .number()
    .int('Likes must be a whole number')
    .min(0, 'Likes cannot be negative')
    .default(0),
  comments: z
    .number()
    .int('Comments must be a whole number')
    .min(0, 'Comments cannot be negative')
    .default(0),
  shares: z
    .number()
    .int('Shares must be a whole number')
    .min(0, 'Shares cannot be negative')
    .default(0),
});

// ================================================================
// Pipeline Link Schemas
// ================================================================

/**
 * Schema for creating/updating a pipeline link
 */
export const pipelineLinkSchema = z.object({
  videoId: z.string().uuid('Invalid video ID'),
  pmSystem: z
    .string()
    .min(1, 'PM system is required')
    .max(50, 'PM system name too long'),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  pipelineStage: videoPipelineStageSchema,
  assignedTo: z.string().optional(),
  notes: z
    .string()
    .max(2000, 'Notes must be 2000 characters or less')
    .optional()
    .transform((val) => val?.trim() || undefined),
});

// ================================================================
// Type Exports
// ================================================================

export type VideoVisibility = z.infer<typeof videoVisibilitySchema>;
export type VideoMigrationStatus = z.infer<typeof videoMigrationStatusSchema>;
export type VideoPipelineStage = z.infer<typeof videoPipelineStageSchema>;
export type VideoStatus = z.infer<typeof videoStatusSchema>;
export type VideoPlatform = z.infer<typeof videoPlatformSchema>;
export type PlatformStatus = z.infer<typeof platformStatusSchema>;
export type EncodingJobStatus = z.infer<typeof encodingJobStatusSchema>;
export type VideoOrderBy = z.infer<typeof videoOrderBySchema>;
export type OrderDirection = z.infer<typeof orderDirectionSchema>;

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type VideoFilterInput = z.infer<typeof videoFilterSchema>;
export type BulkUpdateVideosInput = z.infer<typeof bulkUpdateVideosSchema>;

export type UpsertPlatformInput = z.infer<typeof upsertPlatformSchema>;

export type VideoRendition = z.infer<typeof videoRenditionSchema>;
export type EncodingError = z.infer<typeof encodingErrorSchema>;
export type CreateEncodingJobInput = z.infer<typeof encodingJobSchema>;
export type TriggerEncodingInput = z.infer<typeof triggerEncodingSchema>;
export type UpdateEncodingJobInput = z.infer<typeof updateEncodingJobSchema>;
export type EncodingWebhookPayload = z.infer<typeof encodingWebhookSchema>;

export type AnalyticsFilterInput = z.infer<typeof analyticsFilterSchema>;
export type CreateAnalyticsRecordInput = z.infer<typeof createAnalyticsRecordSchema>;

export type PipelineLinkInput = z.infer<typeof pipelineLinkSchema>;

// ================================================================
// Validation Helper Functions
// ================================================================

/**
 * Validate and parse video creation input
 * @returns Parsed data or throws ZodError
 */
export function validateCreateVideo(data: unknown) {
  return createVideoSchema.parse(data);
}

/**
 * Validate and parse video update input
 * @returns Parsed data or throws ZodError
 */
export function validateUpdateVideo(data: unknown) {
  return updateVideoSchema.parse(data);
}

/**
 * Validate and parse video filter input
 * @returns Parsed data or throws ZodError
 */
export function validateVideoFilter(data: unknown) {
  return videoFilterSchema.parse(data);
}

/**
 * Validate and parse encoding job creation input
 * @returns Parsed data or throws ZodError
 */
export function validateEncodingJob(data: unknown) {
  return encodingJobSchema.parse(data);
}

/**
 * Validate and parse trigger encoding input
 * @returns Parsed data or throws ZodError
 */
export function validateTriggerEncoding(data: unknown) {
  return triggerEncodingSchema.parse(data);
}

/**
 * Validate and parse platform upsert input
 * @returns Parsed data or throws ZodError
 */
export function validateUpsertPlatform(data: unknown) {
  return upsertPlatformSchema.parse(data);
}

/**
 * Validate and parse analytics filter input
 * @returns Parsed data or throws ZodError
 */
export function validateAnalyticsFilter(data: unknown) {
  return analyticsFilterSchema.parse(data);
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeValidateCreateVideo(data: unknown) {
  return createVideoSchema.safeParse(data);
}

export function safeValidateUpdateVideo(data: unknown) {
  return updateVideoSchema.safeParse(data);
}

export function safeValidateVideoFilter(data: unknown) {
  return videoFilterSchema.safeParse(data);
}

export function safeValidateEncodingJob(data: unknown) {
  return encodingJobSchema.safeParse(data);
}

export function safeValidateTriggerEncoding(data: unknown) {
  return triggerEncodingSchema.safeParse(data);
}

export function safeValidateUpsertPlatform(data: unknown) {
  return upsertPlatformSchema.safeParse(data);
}

export function safeValidateAnalyticsFilter(data: unknown) {
  return analyticsFilterSchema.safeParse(data);
}

/**
 * Extract error messages from ZodError for form display
 *
 * Converts Zod validation errors into a flat object mapping
 * field paths to error messages for easy form integration.
 *
 * @param error - The ZodError from validation
 * @returns Object mapping field paths to error messages
 *
 * @example
 * const result = safeValidateCreateVideo(data);
 * if (!result.success) {
 *   const errors = extractZodErrors(result.error);
 *   // errors = { title: "Title is required", videoUrl: "Please enter a valid video URL" }
 * }
 */
export function extractZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

/**
 * Format validation errors into user-friendly messages
 *
 * Converts technical Zod error paths into readable messages
 * that help users identify and fix validation issues.
 *
 * @param zodError - The Zod validation error
 * @returns A user-friendly error message string
 *
 * @example
 * const result = safeValidateCreateVideo(data);
 * if (!result.success) {
 *   const message = formatValidationError(result.error);
 *   // Returns: "Title is required. Video URL: Please enter a valid video URL"
 * }
 */
export function formatValidationError(zodError: z.ZodError): string {
  const messages: string[] = [];

  for (const issue of zodError.errors) {
    const path = issue.path.join('.');

    if (path) {
      // Format field name nicely (e.g., "videoUrl" -> "Video URL")
      const fieldName = path
        .split('.')
        .map((part) => {
          // Handle array indices
          if (/^\d+$/.test(part)) {
            return `#${parseInt(part, 10) + 1}`;
          }
          // Convert camelCase to Title Case
          return part
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
        })
        .join(' > ');

      messages.push(`${fieldName}: ${issue.message}`);
    } else {
      messages.push(issue.message);
    }
  }

  return messages.join('. ');
}
