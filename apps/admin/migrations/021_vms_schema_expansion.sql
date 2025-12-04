-- Migration: VMS (Video Management System) Schema Expansion
-- Part of Phase 1: Foundation
-- Created: 2025-12-04

-- ================================================================
-- 1. Expand videos table with VMS fields
-- ================================================================

ALTER TABLE videos
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS master_file_url TEXT,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private',
ADD COLUMN IF NOT EXISTS course_id UUID,
ADD COLUMN IF NOT EXISTS module_id UUID,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS migration_status TEXT DEFAULT 'vimeo_only',
ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'draft';

-- Add check constraints for new columns (using DO block to avoid errors if they exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_visibility_check') THEN
        ALTER TABLE videos
        ADD CONSTRAINT videos_visibility_check
        CHECK (visibility IN ('public', 'unlisted', 'private', 'paid'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_migration_status_check') THEN
        ALTER TABLE videos
        ADD CONSTRAINT videos_migration_status_check
        CHECK (migration_status IN ('vimeo_only', 'migrating', 'hetzner_primary', 'hetzner_only'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_pipeline_stage_check') THEN
        ALTER TABLE videos
        ADD CONSTRAINT videos_pipeline_stage_check
        CHECK (pipeline_stage IN (
            'draft', 'recording', 'editing', 'review',
            'approved', 'processing', 'published', 'archived'
        ));
    END IF;
END $$;

-- Add foreign key constraints for course/module
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'videos_course_id_fkey'
    ) THEN
        ALTER TABLE videos
        ADD CONSTRAINT videos_course_id_fkey
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'videos_module_id_fkey'
    ) THEN
        ALTER TABLE videos
        ADD CONSTRAINT videos_module_id_fkey
        FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ================================================================
-- 2. Video Platforms Table
-- Tracks video distribution across platforms (Vimeo, YouTube, Hetzner)
-- ================================================================

CREATE TABLE IF NOT EXISTS video_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    external_id TEXT,
    external_url TEXT,
    embed_url TEXT,
    status TEXT DEFAULT 'pending',
    privacy_level TEXT,
    synced_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT video_platforms_platform_check
        CHECK (platform IN ('vimeo', 'youtube', 'hetzner')),
    CONSTRAINT video_platforms_status_check
        CHECK (status IN ('pending', 'processing', 'ready', 'failed', 'archived')),
    CONSTRAINT video_platforms_unique_platform
        UNIQUE(video_id, platform)
);

-- ================================================================
-- 3. Video Analytics Table
-- Aggregated analytics from all platforms
-- ================================================================

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

    -- Constraints
    CONSTRAINT video_analytics_unique_daily
        UNIQUE(video_id, platform, date)
);

-- ================================================================
-- 4. Video Pipeline Links Table
-- Connects videos to PM system tasks
-- ================================================================

CREATE TABLE IF NOT EXISTS video_pipeline_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    pm_system TEXT DEFAULT 'internal',
    project_id TEXT,
    task_id TEXT,
    pipeline_stage TEXT DEFAULT 'draft',
    stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_to UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT video_pipeline_links_stage_check
        CHECK (pipeline_stage IN (
            'draft', 'recording', 'editing', 'review',
            'approved', 'processing', 'published', 'archived'
        ))
);

-- ================================================================
-- 5. Encoding Jobs Table
-- Tracks FFmpeg encoding jobs with retry logic
-- ================================================================

CREATE TABLE IF NOT EXISTS encoding_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'queued',
    progress INTEGER DEFAULT 0,
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
    error_history JSONB DEFAULT '[]',
    -- Alerting
    alert_sent BOOLEAN DEFAULT FALSE,
    -- Worker info
    worker_id TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT encoding_jobs_status_check
        CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    CONSTRAINT encoding_jobs_progress_check
        CHECK (progress >= 0 AND progress <= 100)
);

-- ================================================================
-- 6. Create Indexes
-- ================================================================

-- Video platform indexes
CREATE INDEX IF NOT EXISTS idx_video_platforms_video_id
    ON video_platforms(video_id);
CREATE INDEX IF NOT EXISTS idx_video_platforms_platform
    ON video_platforms(platform);
CREATE INDEX IF NOT EXISTS idx_video_platforms_status
    ON video_platforms(status);

-- Video analytics indexes
CREATE INDEX IF NOT EXISTS idx_video_analytics_video_date
    ON video_analytics(video_id, date);
CREATE INDEX IF NOT EXISTS idx_video_analytics_platform
    ON video_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_video_analytics_date
    ON video_analytics(date);

-- Video pipeline links indexes
CREATE INDEX IF NOT EXISTS idx_video_pipeline_stage
    ON video_pipeline_links(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_video_pipeline_video_id
    ON video_pipeline_links(video_id);

-- Encoding jobs indexes
CREATE INDEX IF NOT EXISTS idx_encoding_jobs_status
    ON encoding_jobs(status);
CREATE INDEX IF NOT EXISTS idx_encoding_jobs_video_id
    ON encoding_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_encoding_jobs_next_retry
    ON encoding_jobs(next_retry_at) WHERE status = 'failed' AND next_retry_at IS NOT NULL;

-- Videos table new indexes
CREATE INDEX IF NOT EXISTS idx_videos_tags
    ON videos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_videos_course_id
    ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_module_id
    ON videos(module_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility
    ON videos(visibility);
CREATE INDEX IF NOT EXISTS idx_videos_migration_status
    ON videos(migration_status);
CREATE INDEX IF NOT EXISTS idx_videos_pipeline_stage
    ON videos(pipeline_stage);

-- ================================================================
-- 7. Update Triggers
-- ================================================================

-- Use existing update_videos_updated_at function for new tables
DO $$
BEGIN
    -- Check if trigger already exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'video_platforms_updated_at'
    ) THEN
        CREATE TRIGGER video_platforms_updated_at
            BEFORE UPDATE ON video_platforms
            FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'video_pipeline_links_updated_at'
    ) THEN
        CREATE TRIGGER video_pipeline_links_updated_at
            BEFORE UPDATE ON video_pipeline_links
            FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'encoding_jobs_updated_at'
    ) THEN
        CREATE TRIGGER encoding_jobs_updated_at
            BEFORE UPDATE ON encoding_jobs
            FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();
    END IF;
END $$;

-- ================================================================
-- Migration Complete
-- ================================================================

COMMENT ON TABLE video_platforms IS 'VMS: Tracks video distribution across platforms (Vimeo, YouTube, Hetzner)';
COMMENT ON TABLE video_analytics IS 'VMS: Aggregated analytics from all platforms';
COMMENT ON TABLE video_pipeline_links IS 'VMS: Connects videos to PM system tasks';
COMMENT ON TABLE encoding_jobs IS 'VMS: Tracks FFmpeg encoding jobs with retry logic';
