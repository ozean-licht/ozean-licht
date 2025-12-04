/**
 * Vimeo API Integration
 *
 * Implements rate-limited access to Vimeo API for video sync and analytics.
 * Rate limits: 1 req/sec, 1000 daily quota
 *
 * Environment Variables:
 *   - VIMEO_ACCESS_TOKEN: Vimeo API access token (required)
 *
 * @example
 * ```typescript
 * import { getVideoList, getVideoDetails, getRateLimitStatus } from '@/lib/integrations/vimeo';
 *
 * // Get videos
 * const videos = await getVideoList(1, 25);
 *
 * // Check rate limit status
 * const status = getRateLimitStatus();
 * console.log(`Remaining quota: ${status.quotaRemaining}`);
 * ```
 */

import { logger } from '@/lib/logger';

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

const VIMEO_RATE_LIMIT = {
  requestsPerSecond: 1,
  dailyQuota: 1000,
  backoffMultiplier: 2,
  maxBackoffSeconds: 3600,
} as const;

// ============================================================================
// Rate Limiter State
// ============================================================================

/**
 * Rate limit state (in-memory for now, use Redis in production)
 */
interface RateLimitState {
  requestsToday: number;
  lastRequestAt: number;
  backoffUntil: number | null;
  lastResetDate: string;
}

const rateLimitState: RateLimitState = {
  requestsToday: 0,
  lastRequestAt: 0,
  backoffUntil: null,
  lastResetDate: new Date().toISOString().split('T')[0],
};

// ============================================================================
// Error Classes
// ============================================================================

/**
 * Base error class for Vimeo API operations
 */
export class VimeoError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'VimeoError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VimeoError);
    }
  }
}

/**
 * Rate limit exceeded error
 */
export class VimeoRateLimitError extends VimeoError {
  constructor(
    message: string,
    public readonly retryAfter: number
  ) {
    super(message, 'VIMEO_RATE_LIMITED', 429);
    this.name = 'VimeoRateLimitError';
  }
}

/**
 * Configuration error (missing API token)
 */
export class VimeoConfigError extends VimeoError {
  constructor(message: string) {
    super(message, 'VIMEO_CONFIG_ERROR', 0);
    this.name = 'VimeoConfigError';
  }
}

/**
 * Daily quota exceeded error
 */
export class VimeoQuotaError extends VimeoError {
  constructor() {
    super('Daily Vimeo API quota exceeded', 'VIMEO_DAILY_QUOTA_EXCEEDED', 429);
    this.name = 'VimeoQuotaError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Reset daily quota if new day
 */
function checkDailyReset(): void {
  const today = new Date().toISOString().split('T')[0];
  if (rateLimitState.lastResetDate !== today) {
    rateLimitState.requestsToday = 0;
    rateLimitState.lastResetDate = today;
    logger.debug('Vimeo rate limit reset for new day', { date: today });
  }
}

// ============================================================================
// Core API Request Function
// ============================================================================

/**
 * Main Vimeo API request function with rate limiting
 *
 * @param endpoint - API endpoint (e.g., '/me/videos')
 * @param options - Fetch options
 * @returns Parsed JSON response
 * @throws {VimeoConfigError} If VIMEO_ACCESS_TOKEN is not configured
 * @throws {VimeoQuotaError} If daily quota is exceeded
 * @throws {VimeoRateLimitError} If rate limited by Vimeo
 * @throws {VimeoError} If API request fails
 */
export async function vimeoRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  checkDailyReset();

  // Check daily quota
  if (rateLimitState.requestsToday >= VIMEO_RATE_LIMIT.dailyQuota) {
    logger.warn('Vimeo daily quota exceeded', {
      requestsToday: rateLimitState.requestsToday,
      quota: VIMEO_RATE_LIMIT.dailyQuota,
    });
    throw new VimeoQuotaError();
  }

  // Check backoff
  if (rateLimitState.backoffUntil && Date.now() < rateLimitState.backoffUntil) {
    const waitTime = Math.ceil((rateLimitState.backoffUntil - Date.now()) / 1000);
    logger.warn('Vimeo rate limited, in backoff period', { waitTime });
    throw new VimeoRateLimitError(
      `Try again in ${waitTime} seconds`,
      waitTime
    );
  }

  // Enforce requests per second
  const timeSinceLastRequest = Date.now() - rateLimitState.lastRequestAt;
  const minInterval = 1000 / VIMEO_RATE_LIMIT.requestsPerSecond;
  if (timeSinceLastRequest < minInterval) {
    const sleepTime = minInterval - timeSinceLastRequest;
    logger.debug('Rate limiting: sleeping', { sleepTime });
    await sleep(sleepTime);
  }

  // Get access token
  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new VimeoConfigError('VIMEO_ACCESS_TOKEN not configured');
  }

  // Make request
  const url = `https://api.vimeo.com${endpoint}`;
  logger.debug('Vimeo API request', { endpoint, method: options?.method || 'GET' });

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
        ...options?.headers,
      },
    });
  } catch (error) {
    logger.error('Vimeo API request failed', error, { endpoint });
    throw new VimeoError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Update state
  rateLimitState.lastRequestAt = Date.now();
  rateLimitState.requestsToday++;

  // Handle rate limiting (429)
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
    rateLimitState.backoffUntil = Date.now() + retryAfter * 1000;
    logger.warn('Vimeo API rate limited', { retryAfter, endpoint });
    throw new VimeoRateLimitError(`Retry after ${retryAfter} seconds`, retryAfter);
  }

  // Handle other errors
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    logger.error('Vimeo API error', null, {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      error: errorText,
    });
    throw new VimeoError(
      `Vimeo API error: ${response.status} ${response.statusText}`,
      'VIMEO_API_ERROR',
      response.status
    );
  }

  // Parse response
  try {
    const data = await response.json();
    logger.debug('Vimeo API response received', { endpoint });
    return data as T;
  } catch (error) {
    logger.error('Failed to parse Vimeo API response', error, { endpoint });
    throw new VimeoError('Failed to parse API response');
  }
}

// ============================================================================
// Rate Limit Status
// ============================================================================

/**
 * Rate limit status information
 */
export interface RateLimitStatus {
  requestsToday: number;
  quotaRemaining: number;
  isRateLimited: boolean;
  backoffUntil: number | null;
  nextResetDate: string;
  quotaResetAt: string; // Alias for nextResetDate for backward compatibility
}

/**
 * Get current rate limit status
 *
 * @returns Current rate limit status
 */
export function getRateLimitStatus(): RateLimitStatus {
  checkDailyReset();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const resetDate = tomorrow.toISOString();

  return {
    requestsToday: rateLimitState.requestsToday,
    quotaRemaining: VIMEO_RATE_LIMIT.dailyQuota - rateLimitState.requestsToday,
    isRateLimited:
      rateLimitState.backoffUntil !== null && Date.now() < rateLimitState.backoffUntil,
    backoffUntil: rateLimitState.backoffUntil,
    nextResetDate: resetDate,
    quotaResetAt: resetDate, // Alias for backward compatibility
  };
}

// ============================================================================
// Vimeo Types
// ============================================================================

/**
 * Vimeo video object
 */
export interface VimeoVideo {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures: {
    sizes: Array<{ width: number; height: number; link: string }>;
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
 * Vimeo list response with pagination
 */
export interface VimeoListResponse {
  total: number;
  page: number;
  per_page: number;
  paging: {
    next: string | null;
    previous: string | null;
  };
  data: VimeoVideo[];
}

/**
 * Vimeo video analytics
 */
export interface VimeoAnalytics {
  total_plays: number;
  total_finishes: number;
  average_percent_watched: number;
  // Add more fields as needed based on Vimeo API
}

/**
 * Video import result
 */
export interface ImportResult {
  imported: number;
  errors: number;
}

/**
 * Progress callback for import operations
 */
export type ProgressCallback = (current: number, total: number) => void;

// ============================================================================
// API Methods - Video List
// ============================================================================

/**
 * Get video list with pagination
 *
 * @param page - Page number (1-indexed)
 * @param perPage - Number of videos per page (max 100)
 * @returns Paginated list of videos
 *
 * @example
 * ```typescript
 * const videos = await getVideoList(1, 25);
 * console.log(`Found ${videos.total} total videos`);
 * ```
 */
export async function getVideoList(
  page: number = 1,
  perPage: number = 25
): Promise<VimeoListResponse> {
  if (page < 1) {
    throw new VimeoError('Page number must be >= 1', 'INVALID_PARAMETER');
  }
  if (perPage < 1 || perPage > 100) {
    throw new VimeoError('perPage must be between 1 and 100', 'INVALID_PARAMETER');
  }

  return vimeoRequest<VimeoListResponse>(
    `/me/videos?page=${page}&per_page=${perPage}&sort=date&direction=desc`
  );
}

// ============================================================================
// API Methods - Video Details
// ============================================================================

/**
 * Get single video details
 *
 * @param vimeoId - Vimeo video ID (numeric or full URI)
 * @returns Video details
 *
 * @example
 * ```typescript
 * const video = await getVideoDetails('123456789');
 * console.log(video.name);
 * ```
 */
export async function getVideoDetails(vimeoId: string): Promise<VimeoVideo> {
  const id = extractVimeoId(vimeoId);
  return vimeoRequest<VimeoVideo>(`/videos/${id}`);
}

// ============================================================================
// API Methods - Analytics
// ============================================================================

/**
 * Get video analytics (requires Vimeo Pro/Business)
 *
 * @param vimeoId - Vimeo video ID
 * @param startDate - Start date (ISO 8601 format)
 * @param endDate - End date (ISO 8601 format)
 * @returns Analytics data or null if unavailable
 *
 * @example
 * ```typescript
 * const analytics = await getVideoAnalytics('123456789', '2024-01-01', '2024-12-31');
 * if (analytics) {
 *   console.log(`Total plays: ${analytics.total_plays}`);
 * }
 * ```
 */
export async function getVideoAnalytics(
  vimeoId: string,
  startDate: string,
  endDate: string
): Promise<VimeoAnalytics | null> {
  try {
    const id = extractVimeoId(vimeoId);
    // Analytics endpoint may require higher tier Vimeo plan
    const response = await vimeoRequest<VimeoAnalytics>(
      `/videos/${id}/stats?start_date=${startDate}&end_date=${endDate}`
    );
    return response;
  } catch (error) {
    logger.warn(`Failed to fetch analytics for video ${vimeoId}`, { error });
    return null;
  }
}

// ============================================================================
// Import Operations
// ============================================================================

/**
 * Import all videos from Vimeo (with progress callback)
 *
 * This function fetches all videos from Vimeo and can optionally report progress.
 * Note: This only fetches video data; you need to implement database persistence separately.
 *
 * @param onProgress - Optional callback for progress updates
 * @returns Import statistics
 *
 * @example
 * ```typescript
 * const result = await importAllVideos((current, total) => {
 *   console.log(`Progress: ${current}/${total}`);
 * });
 * console.log(`Imported ${result.imported} videos, ${result.errors} errors`);
 * ```
 */
export async function importAllVideos(
  onProgress?: ProgressCallback
): Promise<ImportResult> {
  let imported = 0;
  let errors = 0;
  let page = 1;
  let hasMore = true;

  logger.info('Starting Vimeo video import');

  while (hasMore) {
    try {
      const response = await getVideoList(page, 25);

      for (const video of response.data) {
        try {
          // This would call a function to upsert the video to the database
          // For now, just count successful fetches
          imported++;
          logger.debug('Video fetched', { uri: video.uri, name: video.name });
        } catch (err) {
          logger.error(`Error processing video ${video.uri}`, err);
          errors++;
        }
      }

      if (onProgress) {
        onProgress(imported + errors, response.total);
      }

      hasMore = response.paging.next !== null;
      page++;

      logger.debug('Import page processed', {
        page: page - 1,
        imported,
        errors,
        hasMore,
      });
    } catch (err) {
      logger.error(`Error fetching page ${page}`, err);
      errors++;
      break;
    }
  }

  logger.info('Vimeo video import completed', { imported, errors });
  return { imported, errors };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract Vimeo ID from URI
 *
 * @param uri - Vimeo URI (e.g., '/videos/123456789') or just the ID
 * @returns Numeric video ID
 *
 * @example
 * ```typescript
 * extractVimeoId('/videos/123456789') // '123456789'
 * extractVimeoId('123456789')         // '123456789'
 * ```
 */
export function extractVimeoId(uri: string): string {
  // URI format: /videos/123456789
  const match = uri.match(/\/videos\/(\d+)/);
  return match ? match[1] : uri;
}

/**
 * Get best thumbnail URL from Vimeo pictures object
 *
 * @param pictures - Vimeo pictures object
 * @returns Best thumbnail URL or undefined if none available
 *
 * @example
 * ```typescript
 * const thumbnail = getBestThumbnail(video.pictures);
 * if (thumbnail) {
 *   console.log(`Thumbnail: ${thumbnail}`);
 * }
 * ```
 */
export function getBestThumbnail(
  pictures: VimeoVideo['pictures']
): string | undefined {
  if (!pictures?.sizes?.length) {
    return undefined;
  }

  // Sort by width descending and get the largest that's not too big
  const sorted = [...pictures.sizes].sort((a, b) => b.width - a.width);
  const best = sorted.find((s) => s.width <= 1920) || sorted[0];
  return best?.link;
}
