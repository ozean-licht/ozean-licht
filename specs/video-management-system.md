# Plan: Video Management System (VMS)

## Task Description

Build a comprehensive Video Management System for Ozean Licht, a spiritual transformation platform. The system will consolidate video content currently fragmented across Google Drive (master files), YouTube (free content), and Vimeo (paid courses) into a unified system. The primary goal is to migrate from expensive Vimeo hosting to self-hosted Hetzner Object Storage with a custom FFmpeg encoding pipeline.

**Task Type:** Feature
**Complexity:** Complex
**Timeline:** 8 weeks (4 phases)

## Objective

When this plan is complete, Ozean Licht will have:
1. A centralized PostgreSQL database as the single source of truth for all video metadata
2. A unified admin dashboard for managing videos with full CRUD operations
3. A self-hosted FFmpeg encoding pipeline outputting HLS via Bunny.net CDN
4. Vimeo library imported with safe migration and rollback capability
5. Analytics from Vimeo aggregated in a single dashboard
6. Complete migration from Vimeo to self-hosted infrastructure (cost savings)

**Deferred to v2:**
- YouTube sync (free content, lower priority)
- Google Drive scanner (manual master file linking sufficient for ~100 videos)
- Pipeline Kanban view (ship status dropdown first)

## Problem Statement

**Current State:**
- Video assets fragmented across 3 platforms with no unified view
- Vimeo subscription cost is prohibitively expensive for a startup
- Master files buried in nested Google Drive folder structures
- No connection between video assets and production pipeline/PM system
- Analytics scattered across platforms with no unified insights

**Impact:**
- Operational inefficiency managing content across platforms
- High ongoing costs for Vimeo Pro subscription (~$200/month)
- No visibility into content performance across distribution channels
- Lia (content creator) cannot manage videos without technical assistance

## Solution Approach

**Architecture Principle:** The database is the single source of truth. External services (Vimeo, Hetzner/Bunny) are treated as storage/delivery endpoints.

```
┌─────────────────────────────────────────────────────────────┐
│                  Video Management System                     │
│                   (PostgreSQL Database)                      │
├─────────────────────────────────────────────────────────────┤
│  Video Record                                                │
│  ├── Metadata (title, description, tags, visibility)        │
│  ├── Master File URL (Ozean Cloud / manual link)            │
│  ├── Migration Status (vimeo_only | migrating | hetzner)    │
│  ├── Distribution Endpoints                                  │
│  │   ├── Vimeo ID + Embed URL (fallback)                    │
│  │   └── Bunny.net CDN URL (primary after migration)        │
│  ├── Encoding Job Status                                     │
│  └── Pipeline Stage (status dropdown)                        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Encoding Pipeline                         │
│  ┌──────────┐    ┌──────────┐    ┌─────────┐    ┌────────┐  │
│  │ BullMQ   │───▶│  FFmpeg  │───▶│ Hetzner │───▶│ Bunny  │  │
│  │ Queue    │    │  Worker  │    │ Storage │    │  CDN   │  │
│  └──────────┘    └──────────┘    └─────────┘    └────────┘  │
│                       │                                      │
│                       ▼                                      │
│              Retry Policy: 3 attempts                        │
│              Backoff: 5min, 15min, 60min                     │
│              Alert on: 3rd failure                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Relevant Files

### Existing Files to Modify

| File | Purpose |
|------|---------|
| `apps/admin/lib/db/videos.ts` | Expand with CRUD operations, platform queries |
| `apps/admin/app/api/videos/route.ts` | Add POST handler for creating videos |
| `apps/admin/types/content.ts` | Extend Video interface with new fields |
| `apps/admin/app/dashboard/content/videos/page.tsx` | Enhance with action buttons |
| `apps/admin/app/dashboard/content/videos/VideosDataTable.tsx` | Add platform badges, actions |
| `apps/admin/app/dashboard/content/videos/columns.tsx` | Add platform columns |
| `apps/admin/components/dashboard/Sidebar.tsx` | Add VMS menu items |

### New Files to Create

#### Database Layer
| File | Purpose |
|------|---------|
| `apps/admin/migrations/030_vms_schema_expansion.sql` | Expand videos table, add new tables |
| `apps/admin/lib/db/video-platforms.ts` | Platform distribution CRUD |
| `apps/admin/lib/db/video-analytics.ts` | Analytics aggregation queries |
| `apps/admin/lib/db/video-pipeline.ts` | Pipeline links CRUD |
| `apps/admin/lib/db/encoding-jobs.ts` | Encoding job management |

#### API Routes
| File | Purpose |
|------|---------|
| `apps/admin/app/api/videos/[id]/route.ts` | GET, PUT, DELETE single video |
| `apps/admin/app/api/videos/[id]/platforms/route.ts` | Platform distribution management |
| `apps/admin/app/api/videos/[id]/encode/route.ts` | Trigger encoding job |
| `apps/admin/app/api/videos/[id]/rollback/route.ts` | Rollback to Vimeo if HLS fails |
| `apps/admin/app/api/videos/sync/vimeo/route.ts` | Vimeo sync endpoint |
| `apps/admin/app/api/videos/analytics/route.ts` | Aggregated analytics |
| `apps/admin/app/api/upload/video/route.ts` | Video file upload (chunked) |
| `apps/admin/app/api/encoding/webhook/route.ts` | Encoding progress webhook (HMAC signed) |

#### Components
| File | Purpose |
|------|---------|
| `apps/admin/components/videos/VideoForm.tsx` | Create/edit video form |
| `apps/admin/components/videos/VideoCard.tsx` | Video card for gallery view |
| `apps/admin/components/videos/PlatformBadges.tsx` | Platform status indicators |
| `apps/admin/components/videos/MigrationStatus.tsx` | Migration status + rollback button |
| `apps/admin/components/videos/DistributionPanel.tsx` | Platform distribution controls |
| `apps/admin/components/videos/EncodingProgress.tsx` | Encoding job progress with retry |
| `apps/admin/components/videos/VideoPlayer.tsx` | HLS video player (hls.js) with Vimeo fallback |
| `apps/admin/components/videos/ThumbnailPicker.tsx` | Thumbnail selection/upload |
| `apps/admin/components/videos/TagEditor.tsx` | Tag management with autocomplete |
| `apps/admin/components/videos/AnalyticsSummary.tsx` | Video analytics widget |
| `apps/admin/components/videos/BulkActions.tsx` | Bulk operations toolbar |
| `apps/admin/components/videos/PipelineStageSelect.tsx` | Status dropdown (replaces Kanban) |

#### Pages
| File | Purpose |
|------|---------|
| `apps/admin/app/dashboard/content/videos/new/page.tsx` | Create video page |
| `apps/admin/app/dashboard/content/videos/[id]/page.tsx` | Video detail page |
| `apps/admin/app/dashboard/content/videos/[id]/edit/page.tsx` | Edit video page |
| `apps/admin/app/dashboard/content/videos/analytics/page.tsx` | Analytics dashboard |
| `apps/admin/app/dashboard/content/videos/migration/page.tsx` | Batch migration dashboard |

#### Types
| File | Purpose |
|------|---------|
| `apps/admin/types/video.ts` | Comprehensive VMS type definitions |
| `apps/admin/lib/validations/video.ts` | Zod schemas for video validation |

#### Encoding Worker (New Service)
| File | Purpose |
|------|---------|
| `tools/encoding-worker/package.json` | Worker dependencies |
| `tools/encoding-worker/src/index.ts` | BullMQ worker entry point |
| `tools/encoding-worker/src/encoder.ts` | FFmpeg encoding logic |
| `tools/encoding-worker/src/uploader.ts` | HLS upload to Hetzner |
| `tools/encoding-worker/Dockerfile` | Container for encoding worker |
| `tools/encoding-worker/docker-compose.yml` | Worker + Redis setup |

#### Platform Integrations
| File | Purpose |
|------|---------|
| `apps/admin/lib/integrations/vimeo.ts` | Vimeo API client with rate limiting |
| `apps/admin/lib/integrations/bunny.ts` | Bunny.net CDN configuration |

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Database schema, basic CRUD, Vimeo import

1. Expand database schema with VMS tables (including migration_status field)
2. Implement full CRUD operations for videos
3. Build video create/edit forms and pages
4. Integrate Vimeo API for library import (with rate limiting)
5. Add video detail view with metadata editing

**Deliverables:**
- 5 new database tables migrated
- Full video CRUD via admin dashboard
- Vimeo library imported to database
- Migration status tracking per video

### Phase 2: Encoding Pipeline (Week 3-4)

**Goal:** Self-hosted video processing with Bunny.net CDN

1. Set up Redis for BullMQ job queue
2. Build FFmpeg encoding worker (Docker container)
3. Implement HLS output to Hetzner Object Storage
4. Configure Bunny.net CDN pull zone for HLS delivery
5. Add encoding progress tracking with retry policy (3 attempts)
6. Integrate hls.js video player with Vimeo embed fallback

**Deliverables:**
- Encoding worker processing jobs with error handling
- HLS videos served via Bunny.net CDN
- Progress tracking visible in UI
- Automatic retry on failure with alerting

### Phase 3: Migration & Rollback (Week 5-6)

**Goal:** Safe batch migration with rollback capability

1. Build migration dashboard with status overview
2. Implement batch migration tool (Vimeo → Hetzner)
3. Add rollback mechanism (revert to Vimeo embed if HLS fails)
4. Set up Vimeo analytics aggregation
5. Build analytics dashboard for Vimeo metrics

**Deliverables:**
- Batch migration operational with progress tracking
- Per-video rollback capability
- Vimeo analytics visible in dashboard
- Migration status: vimeo_only → migrating → hetzner_primary

### Phase 4: Polish & Course Integration (Week 7-8)

**Goal:** Course integration, UX polish, Vimeo sunset

1. Build course/module video assignment interface
2. Implement pipeline stage dropdown (draft → published)
3. Add bulk actions (migrate, archive, tag)
4. Complete Vimeo migration and verify all videos playable
5. Final UX polish and documentation

**Deliverables:**
- Videos linked to courses/lessons
- Pipeline stage visible and editable
- All Vimeo content migrated to Hetzner
- Vimeo subscription can be cancelled

### Phase 5: Future (v2)

**Deferred scope:**
- YouTube API sync (lower priority - free content)
- Google Drive scanner automation
- Pipeline Kanban view (drag-drop)
- Automatic transcript generation
- DRM/content protection

---

## Step by Step Tasks

### 1. Database Schema Expansion

Create migration `030_vms_schema_expansion.sql`:

```sql
-- Expand videos table with VMS fields
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS master_file_url TEXT,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private'
    CHECK (visibility IN ('public', 'unlisted', 'private', 'paid')),
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id),
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES course_modules(id),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS migration_status TEXT DEFAULT 'vimeo_only'
    CHECK (migration_status IN ('vimeo_only', 'migrating', 'hetzner_primary', 'hetzner_only')),
ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'draft'
    CHECK (pipeline_stage IN ('draft', 'recording', 'editing', 'review', 'approved', 'processing', 'published', 'archived'));

-- Video platforms table
CREATE TABLE IF NOT EXISTS video_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('vimeo', 'youtube', 'hetzner')),
    external_id TEXT,
    external_url TEXT,
    embed_url TEXT,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'ready', 'failed', 'archived')),
    privacy_level TEXT,
    synced_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(video_id, platform)
);

-- Video analytics table
CREATE TABLE IF NOT EXISTS video_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    watch_time_minutes INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    avg_watch_percentage DECIMAL(5,2),
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(video_id, platform, date)
);

-- Video pipeline links table
CREATE TABLE IF NOT EXISTS video_pipeline_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    pm_system TEXT DEFAULT 'internal',
    project_id TEXT,
    task_id TEXT,
    pipeline_stage TEXT DEFAULT 'draft'
        CHECK (pipeline_stage IN (
            'draft', 'recording', 'editing', 'review',
            'approved', 'processing', 'published', 'archived'
        )),
    stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_to UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encoding jobs table with retry tracking
CREATE TABLE IF NOT EXISTS encoding_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'queued'
        CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    input_file_url TEXT NOT NULL,
    output_manifest_url TEXT,
    output_bucket TEXT DEFAULT 'video-hls',
    output_key TEXT,
    renditions JSONB DEFAULT '[]',
    thumbnail_urls JSONB DEFAULT '[]',
    -- Retry tracking
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    last_error TEXT,
    error_history JSONB DEFAULT '[]',  -- Array of {timestamp, error, attempt}
    -- Alerting
    alert_sent BOOLEAN DEFAULT FALSE,
    -- Worker info
    worker_id TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_video_platforms_video_id ON video_platforms(video_id);
CREATE INDEX IF NOT EXISTS idx_video_platforms_platform ON video_platforms(platform);
CREATE INDEX IF NOT EXISTS idx_video_analytics_video_date ON video_analytics(video_id, date);
CREATE INDEX IF NOT EXISTS idx_video_pipeline_stage ON video_pipeline_links(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_encoding_jobs_status ON encoding_jobs(status);
CREATE INDEX IF NOT EXISTS idx_encoding_jobs_video_id ON encoding_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_videos_course_id ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility ON videos(visibility);

-- Update trigger for new tables
CREATE TRIGGER video_platforms_updated_at
    BEFORE UPDATE ON video_platforms
    FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();

CREATE TRIGGER video_pipeline_links_updated_at
    BEFORE UPDATE ON video_pipeline_links
    FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();

CREATE TRIGGER encoding_jobs_updated_at
    BEFORE UPDATE ON encoding_jobs
    FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();
```

- Apply migration to ozean-licht-db
- Verify all tables and indexes created
- Test foreign key constraints

### 2. Type Definitions

Create `apps/admin/types/video.ts`:

- Define `Video` interface with all new fields
- Define `VideoPlatform` interface
- Define `VideoAnalytics` interface
- Define `VideoPipelineLink` interface
- Define `EncodingJob` interface
- Define input types: `CreateVideoInput`, `UpdateVideoInput`
- Define list options and filter types
- Export all types

### 3. Validation Schemas

Create `apps/admin/lib/validations/video.ts`:

- Define `createVideoSchema` with Zod
- Define `updateVideoSchema` with Zod
- Define `videoFilterSchema` for query params
- Define `encodingJobSchema` for job creation
- Add XSS sanitization for text fields
- Export validation functions

### 4. Database Queries - Videos

Expand `apps/admin/lib/db/videos.ts`:

- Add `createVideo(input: CreateVideoInput)` function
- Add `updateVideo(id: string, input: UpdateVideoInput)` function
- Add `deleteVideo(id: string)` function (soft delete via status='archived')
- Add `getVideoWithPlatforms(id: string)` function
- Add `bulkUpdateVideos(ids: string[], updates: Partial<Video>)` function
- Add `searchVideos(query: string, filters: VideoFilters)` function
- Ensure all queries use parameterized SQL

### 5. Database Queries - Platforms

Create `apps/admin/lib/db/video-platforms.ts`:

- Add `getPlatformsByVideoId(videoId: string)` function
- Add `upsertPlatform(videoId: string, platform: string, data: object)` function
- Add `deletePlatform(videoId: string, platform: string)` function
- Add `updatePlatformStatus(id: string, status: string)` function
- Add `getVideosWithoutPlatform(platform: string)` function

### 6. Database Queries - Analytics

Create `apps/admin/lib/db/video-analytics.ts`:

- Add `upsertDailyAnalytics(data: VideoAnalytics)` function
- Add `getAnalyticsByVideo(videoId: string, dateRange: object)` function
- Add `getAggregatedAnalytics(filters: object)` function
- Add `getTopPerformingVideos(metric: string, limit: number)` function
- Add `getAnalyticsTrends(videoId: string, days: number)` function

### 7. Database Queries - Encoding

Create `apps/admin/lib/db/encoding-jobs.ts`:

- Add `createEncodingJob(videoId: string, inputUrl: string)` function
- Add `updateJobProgress(id: string, progress: number)` function
- Add `completeJob(id: string, outputUrl: string, renditions: object)` function
- Add `failJob(id: string, errorMessage: string)` function
- Add `getJobsByStatus(status: string)` function
- Add `getActiveJobForVideo(videoId: string)` function

### 8. API Routes - Video CRUD

Create `apps/admin/app/api/videos/[id]/route.ts`:

- Implement `GET` handler - fetch video with platforms
- Implement `PUT` handler - update video with validation
- Implement `DELETE` handler - soft delete (archive)
- Add auth check at start of each handler
- Add Zod validation for PUT body
- Return appropriate HTTP status codes

Expand `apps/admin/app/api/videos/route.ts`:

- Add `POST` handler - create new video
- Add Zod validation for request body
- Return created video with 201 status

### 9. API Routes - Platform Management

Create `apps/admin/app/api/videos/[id]/platforms/route.ts`:

- Implement `GET` - list platforms for video
- Implement `POST` - add/update platform
- Implement `DELETE` - remove platform
- Add platform-specific validation

### 10. API Routes - Encoding

Create `apps/admin/app/api/videos/[id]/encode/route.ts`:

- Implement `POST` - trigger encoding job
- Validate input file URL exists
- Create job in database
- Add job to BullMQ queue
- Return job ID and status

Create `apps/admin/app/api/encoding/webhook/route.ts`:

```typescript
// HMAC-SHA256 Webhook Signature Verification
import crypto from 'crypto';

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.ENCODING_WEBHOOK_SECRET;
  if (!secret) throw new Error('Webhook secret not configured');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}

// Webhook payload structure
interface EncodingWebhookPayload {
  jobId: string;
  videoId: string;
  status: 'progress' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  renditions?: Array<{ quality: string; url: string }>;
  error?: { code: string; message: string };
  timestamp: string;
}
```

- Implement `POST` - receive progress updates
- Verify `X-Webhook-Signature` header using HMAC-SHA256
- Reject requests with invalid/missing signature (401)
- Update job progress in database
- Handle completion: update video migration_status, store CDN URLs
- Handle failure: log error, trigger retry or alert

### 11. Video Upload Endpoint

Create `apps/admin/app/api/upload/video/route.ts`:

- Follow existing audio upload pattern
- Support large files (up to 5GB)
- Implement chunked upload or tus.io protocol
- Validate video MIME types (mp4, webm, mov, avi)
- Upload to `video-masters` bucket
- Return file URL and metadata

### 12. Video Form Component

Create `apps/admin/components/videos/VideoForm.tsx`:

- Title input (required)
- Description textarea (rich text optional)
- Tags input with autocomplete
- Visibility select (public/unlisted/private/paid)
- Thumbnail upload/URL input
- Master file URL input
- Course/Module assignment dropdowns
- Duration input (auto-detect if possible)
- Save and Cancel buttons
- Form validation with react-hook-form + Zod

### 13. Video Detail Page

Create `apps/admin/app/dashboard/content/videos/[id]/page.tsx`:

- Fetch video with platforms and analytics
- Display video player (if HLS available)
- Show metadata in editable form
- Show platform distribution panel
- Show encoding status if applicable
- Show analytics summary widget
- Add action buttons (Edit, Archive, Encode)

### 14. Create Video Page

Create `apps/admin/app/dashboard/content/videos/new/page.tsx`:

- Render VideoForm in create mode
- Handle form submission to POST /api/videos
- Redirect to video detail on success
- Show validation errors inline

### 15. Edit Video Page

Create `apps/admin/app/dashboard/content/videos/[id]/edit/page.tsx`:

- Fetch existing video data
- Render VideoForm in edit mode
- Handle form submission to PUT /api/videos/[id]
- Redirect to video detail on success

### 16. Platform Distribution Panel

Create `apps/admin/components/videos/DistributionPanel.tsx`:

- Show card for each platform (Vimeo, YouTube, Hetzner)
- Display status badge for each platform
- Show external URL if available
- Add "Sync" button per platform
- Add "Remove" button per platform
- Add "Migrate to Hetzner" action

### 17. Encoding Progress Component

Create `apps/admin/components/videos/EncodingProgress.tsx`:

- Show progress bar (0-100%)
- Display current status text
- Show elapsed/estimated time
- List output renditions when complete
- Show error message if failed
- Add retry button for failed jobs

### 18. Video Player Component

Create `apps/admin/components/videos/VideoPlayer.tsx`:

- Integrate hls.js for HLS playback
- Fallback to native video for mp4
- Support quality selection
- Show thumbnail/poster before play
- Handle loading and error states
- Responsive sizing

### 19. Enhance Videos Data Table

Update `apps/admin/app/dashboard/content/videos/VideosDataTable.tsx`:

- Add "New Video" button linking to create page
- Add platform badges column
- Add pipeline stage column
- Add bulk selection checkboxes
- Add bulk actions toolbar (archive, tag, assign)
- Add row actions (view, edit, archive, encode)
- Improve empty state with CTA

### 20. Vimeo Integration with Rate Limiting

Create `apps/admin/lib/integrations/vimeo.ts`:

```typescript
// Rate limiting configuration for Vimeo API
const VIMEO_RATE_LIMIT = {
  requestsPerSecond: 1,        // Conservative: 1 req/sec
  dailyQuota: 1000,            // Track daily usage
  backoffMultiplier: 2,        // Exponential backoff on 429
  maxBackoffSeconds: 3600,     // Max 1 hour backoff
};

// Rate limiter state (use Redis in production)
interface RateLimitState {
  requestsToday: number;
  lastRequestAt: number;
  backoffUntil: number | null;
}

async function vimeoRequest<T>(endpoint: string): Promise<T> {
  // Check daily quota
  if (state.requestsToday >= VIMEO_RATE_LIMIT.dailyQuota) {
    throw new Error('VIMEO_DAILY_QUOTA_EXCEEDED');
  }

  // Check backoff
  if (state.backoffUntil && Date.now() < state.backoffUntil) {
    throw new Error('VIMEO_RATE_LIMITED');
  }

  // Enforce requests per second
  const timeSinceLastRequest = Date.now() - state.lastRequestAt;
  if (timeSinceLastRequest < 1000 / VIMEO_RATE_LIMIT.requestsPerSecond) {
    await sleep(1000 / VIMEO_RATE_LIMIT.requestsPerSecond - timeSinceLastRequest);
  }

  // Make request, handle 429
  const response = await fetch(...);
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
    state.backoffUntil = Date.now() + retryAfter * 1000;
    throw new Error('VIMEO_RATE_LIMITED');
  }

  state.requestsToday++;
  state.lastRequestAt = Date.now();
  return response.json();
}
```

- Initialize Vimeo API client with credentials
- Add `getVideoList()` - paginated video fetch with rate limiting
- Add `getVideoDetails(vimeoId: string)` - single video
- Add `getVideoAnalytics(vimeoId: string, dateRange: object)` - stats
- Add `importAllVideos()` - batch import with progress tracking
- Store daily quota usage in database for monitoring

Create `apps/admin/app/api/videos/sync/vimeo/route.ts`:

- Implement `POST` - trigger Vimeo sync
- Check rate limit status before starting
- Call Vimeo API to fetch library (paginated)
- Upsert videos to database
- Update video_platforms entries
- Return sync summary (added/updated/errors/quota_remaining)

### 21. Bunny.net CDN Configuration

Create `apps/admin/lib/integrations/bunny.ts`:

```typescript
// Bunny.net Pull Zone Configuration
export const BUNNY_CONFIG = {
  pullZoneName: 'ozean-videos',
  originUrl: 'https://hetzner-storage.ozean-licht.dev',
  cdnHostname: 'videos.ozean-licht.dev',
  // Cache settings
  cacheControl: 'public, max-age=31536000',  // 1 year for HLS segments
  // Security
  tokenAuthEnabled: true,
  tokenAuthKey: process.env.BUNNY_TOKEN_KEY,
};

export function getCdnUrl(hlsPath: string): string {
  return `https://${BUNNY_CONFIG.cdnHostname}/${hlsPath}`;
}
```

- Configure pull zone in Bunny.net dashboard
- Set up origin to Hetzner Object Storage
- Enable token authentication for paid content
- Configure cache headers for HLS segments

### 22. BullMQ Encoding Worker

Create `tools/encoding-worker/` directory structure:

```
tools/encoding-worker/
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── src/
    ├── index.ts        # Worker entry point
    ├── encoder.ts      # FFmpeg encoding logic
    ├── uploader.ts     # Upload to Hetzner
    ├── queue.ts        # BullMQ queue setup
    └── config.ts       # Environment config
```

Implement encoding logic with retry policy:

```typescript
// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  backoffDelays: [5 * 60, 15 * 60, 60 * 60], // 5min, 15min, 60min
  alertOnFinalFailure: true,
};

// Error categories for retry decisions
const RETRYABLE_ERRORS = [
  'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND',  // Network errors
  'FFMPEG_DOWNLOAD_FAILED',                 // Download issues
  'S3_UPLOAD_FAILED',                       // Upload issues
];

const NON_RETRYABLE_ERRORS = [
  'FFMPEG_INVALID_INPUT',      // Corrupt source file
  'FFMPEG_UNSUPPORTED_CODEC',  // Can't transcode
  'FILE_NOT_FOUND',            // Source doesn't exist
];
```

- Accept job with input URL
- Download source file to temp storage
- Run FFmpeg transcoding:
  - 360p @ 800kbps
  - 480p @ 1400kbps
  - 720p @ 2800kbps
  - 1080p @ 5000kbps
- Generate HLS master playlist
- Generate thumbnail sprites (every 10 seconds)
- Upload all outputs to Hetzner → Bunny.net CDN
- Report progress via HMAC-signed webhook
- **Error Handling:**
  - On retryable error: increment attempt, schedule retry with backoff
  - On non-retryable error: mark failed, alert immediately
  - On 3rd failure: mark failed, send Telegram alert, keep Vimeo as fallback

### 23. Analytics Dashboard

Create `apps/admin/app/dashboard/content/videos/analytics/page.tsx`:

- Show total views, watch time, engagement
- Display top performing videos list
- Show views over time chart
- Show platform breakdown
- Add date range filter
- Add export button (CSV)

Create `apps/admin/components/videos/AnalyticsSummary.tsx`:

- Compact analytics card for video detail
- Show views, watch time, engagement rate
- Show trend indicators (up/down)
- Link to full analytics page

### 24. Pipeline Stage Dropdown (Simplified)

Create `apps/admin/components/videos/PipelineStageSelect.tsx`:

```typescript
// Simple dropdown instead of Kanban (v1)
const PIPELINE_STAGES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'recording', label: 'Recording', color: 'yellow' },
  { value: 'editing', label: 'Editing', color: 'orange' },
  { value: 'review', label: 'Review', color: 'blue' },
  { value: 'approved', label: 'Approved', color: 'purple' },
  { value: 'processing', label: 'Processing', color: 'cyan' },
  { value: 'published', label: 'Published', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'slate' },
];
```

- Render as Select dropdown in video form and detail page
- Color-coded status badge display
- Update `pipeline_stage` on change via API
- Show stage in videos data table column
- **Deferred to v2:** Kanban view with drag-drop

### 25. Migration Dashboard & Rollback

Create `apps/admin/app/dashboard/content/videos/migration/page.tsx`:

- Overview cards: total videos, migrated, pending, failed
- List of videos with migration_status filter
- Batch actions: "Migrate Selected", "Rollback Selected"
- Progress indicator for active migrations

Create `apps/admin/components/videos/MigrationStatus.tsx`:

```typescript
// Migration status badge with rollback action
interface MigrationStatusProps {
  video: Video;
  onRollback: () => void;
}

const MIGRATION_STATES = {
  vimeo_only: { label: 'Vimeo Only', color: 'blue', canMigrate: true },
  migrating: { label: 'Migrating...', color: 'yellow', canRollback: false },
  hetzner_primary: { label: 'Hetzner (Vimeo Backup)', color: 'green', canRollback: true },
  hetzner_only: { label: 'Hetzner Only', color: 'emerald', canRollback: false },
};
```

- Display current migration status
- "Migrate to Hetzner" button for vimeo_only
- "Rollback to Vimeo" button for hetzner_primary
- Confirmation dialog before rollback

Create `apps/admin/app/api/videos/[id]/rollback/route.ts`:

- Implement `POST` - rollback video to Vimeo
- Verify video has valid Vimeo platform entry
- Update migration_status to 'vimeo_only'
- Keep Hetzner files for potential re-migration
- Log rollback action for audit

### 26. Navigation Updates

Update `apps/admin/components/dashboard/Sidebar.tsx`:

- Add "Videos" submenu under Content:
  - Library (main list)
  - New Video
  - Migration (batch migration dashboard)
  - Analytics

### 27. Final Integration & Testing

- Run full test suite
- Test video upload → encode → play flow
- Test Vimeo sync imports correctly
- Test migration and rollback flows
- Test analytics aggregation
- Verify RBAC permissions work
- Performance test with 100+ videos
- Document API endpoints

---

## Testing Strategy

### Unit Tests

- Database query functions (mocked pg)
- Validation schemas (Zod)
- Utility functions (duration formatting, etc.)

### Integration Tests

- API routes with test database
- Vimeo/YouTube API mocking
- S3 upload mocking

### E2E Tests

- Video creation flow
- Video editing flow
- Encoding trigger and completion
- Platform sync operations

### Performance Tests

- List 500+ videos with pagination
- Concurrent encoding jobs (5+)
- Analytics aggregation for 30 days

---

## Acceptance Criteria

### Phase 1 Completion (2025-12-04)
- [x] All 5 database tables created with indexes (migration 021)
- [x] Video CRUD working via API (GET/POST/PUT/DELETE /api/videos)
- [x] Create/edit video forms functional (VideoForm component)
- [ ] Vimeo library imported to database (with rate limiting) - **Deferred to Phase 2**
- [x] Video detail page showing metadata (/dashboard/content/videos/[id])
- [x] Migration status field tracking per video (migrationStatus column)

### Phase 2 Completion (2025-12-04)
- [x] Encoding worker processing jobs (tools/encoding-worker/ with BullMQ)
- [x] HLS output served via Bunny.net CDN (uploader.ts with S3-compatible upload)
- [x] Progress tracking visible in UI (EncodingProgress.tsx component)
- [x] Thumbnails generated automatically (encoder.ts generateThumbnails)
- [x] Failed jobs retry 3x with backoff (5min, 15min, 60min) (encoding-jobs.ts)
- [x] Telegram alert on final failure (index.ts sendTelegramAlert)
- [x] hls.js player with Vimeo embed fallback (VideoPlayer.tsx)

**Phase 2 Files Created:**
- `tools/encoding-worker/package.json` - Worker dependencies
- `tools/encoding-worker/tsconfig.json` - TypeScript config
- `tools/encoding-worker/Dockerfile` - Multi-stage Docker build with FFmpeg
- `tools/encoding-worker/docker-compose.yml` - Redis + Worker services
- `tools/encoding-worker/src/config.ts` - Environment config with Zod
- `tools/encoding-worker/src/queue.ts` - BullMQ queue setup
- `tools/encoding-worker/src/encoder.ts` - FFmpeg HLS encoding
- `tools/encoding-worker/src/uploader.ts` - S3 upload to Hetzner
- `tools/encoding-worker/src/index.ts` - Worker entry point
- `apps/admin/app/api/encoding/webhook/route.ts` - HMAC webhook endpoint
- `apps/admin/app/api/videos/[id]/encode/route.ts` - Trigger encoding API
- `apps/admin/components/videos/VideoPlayer.tsx` - HLS player with fallback
- `apps/admin/components/videos/EncodingProgress.tsx` - Progress UI

### Phase 3 Completion (2025-12-04)
- [x] Migration dashboard operational
- [x] Batch migration tool working (Vimeo → Hetzner)
- [x] Rollback mechanism functional (revert to Vimeo embed)
- [x] Vimeo analytics aggregated in dashboard
- [x] Migration status visible: vimeo_only → migrating → hetzner_primary

**Phase 3 Files Created:**
- `apps/admin/app/dashboard/content/videos/migration/page.tsx` - Migration Dashboard server component
- `apps/admin/app/dashboard/content/videos/migration/MigrationDashboardClient.tsx` - Interactive migration UI
- `apps/admin/app/api/videos/[id]/rollback/route.ts` - Rollback API endpoint
- `apps/admin/lib/integrations/vimeo.ts` - Vimeo API integration with rate limiting
- `apps/admin/lib/integrations/index.ts` - Integration exports
- `apps/admin/app/api/videos/sync/vimeo/route.ts` - Vimeo sync endpoint (GET/POST)
- `apps/admin/app/dashboard/content/videos/analytics/page.tsx` - Analytics Dashboard server component
- `apps/admin/app/dashboard/content/videos/analytics/AnalyticsDashboardClient.tsx` - Interactive analytics UI
- `apps/admin/components/videos/AnalyticsSummary.tsx` - Compact analytics widget
- `apps/admin/lib/utils/format.ts` - Number/duration formatting utilities

**Phase 3 Features:**
- Migration Dashboard with stats cards (Total, Migrated, Pending, In Progress)
- Migration progress bar with percentage visualization
- Estimated cost savings display ($5/video/month)
- Batch migration trigger with video selection
- Individual video migrate/rollback actions
- Vimeo API integration with rate limiting (1 req/sec, 1000/day quota)
- Vimeo library sync with intelligent upsert (create or update)
- Analytics Dashboard with views, watch time, engagement metrics
- Views over time chart (Recharts AreaChart)
- Platform breakdown pie chart (Vimeo vs Hetzner)
- Top 10 performing videos list
- CSV export functionality
- Sidebar navigation updated with Videos submenu

### Phase 4 Completion
- [ ] Videos assignable to courses/modules
- [ ] Pipeline stage dropdown functional
- [ ] All Vimeo content migrated to Hetzner
- [ ] Vimeo subscription can be cancelled
- [ ] Lia can manage videos independently

---

## Validation Commands

Execute these commands to validate the implementation:

```bash
# Verify database tables exist
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" -c "\dt video*"

# Verify API health
curl -s http://localhost:3001/api/videos | jq '.total'

# Run TypeScript type check
cd apps/admin && npm run typecheck

# Run tests (when implemented)
cd apps/admin && npm run test

# Check encoding worker logs
docker logs ozean-encoding-worker --tail 100

# Verify HLS output exists in storage
curl -I "https://storage.ozean-licht.dev/video-hls/test-video/master.m3u8"
```

---

## Notes

### Dependencies to Add

```bash
# Admin app
cd apps/admin
pnpm add hls.js @tanstack/react-query-devtools

# Encoding worker
cd tools/encoding-worker
pnpm add bullmq ioredis fluent-ffmpeg @aws-sdk/client-s3
```

### Environment Variables Required

```env
# Vimeo API
VIMEO_ACCESS_TOKEN=
VIMEO_CLIENT_ID=
VIMEO_CLIENT_SECRET=

# Bunny.net CDN
BUNNY_API_KEY=
BUNNY_PULL_ZONE_ID=
BUNNY_STORAGE_ZONE=
BUNNY_CDN_HOSTNAME=videos.ozean-licht.dev
BUNNY_TOKEN_KEY=  # For token authentication on paid content

# Redis for BullMQ
REDIS_URL=redis://localhost:6379

# Encoding webhook (HMAC-SHA256)
ENCODING_WEBHOOK_SECRET=  # 32+ character random string
ENCODING_WEBHOOK_URL=https://admin.ozean-licht.dev/api/encoding/webhook

# Alerting
TELEGRAM_BOT_TOKEN=  # For encoding failure alerts
TELEGRAM_ALERT_CHAT_ID=
```

### Security Considerations

- All API routes require authentication via NextAuth
- File uploads validated for type and size (video: 5GB max)
- SQL queries use parameterized statements (no string interpolation)
- External API keys stored in environment variables
- Webhook signatures verified using HMAC-SHA256 with timing-safe comparison
- CORS configured for encoding worker callbacks
- Bunny.net token authentication for paid video content
- Rate limiting on Vimeo API calls (1 req/sec, 1000/day quota)

### Performance Considerations

- Video list pagination (max 100 per page)
- Analytics aggregated daily (not real-time)
- Encoding jobs queued (max 3 concurrent)
- HLS served via Bunny.net CDN (global edge caching)
- Thumbnail sprites for seek preview (every 10 seconds)
- Vimeo embed as fallback during migration (no downtime)

---

*Plan Created: 2025-12-04*
*Estimated Effort: 8 weeks*
*Priority: HIGH - Cost reduction initiative*
