-- Migration: 021_create_videos_standalone.sql
-- Description: Create standalone videos table for Airtable migration
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28
-- Note: No foreign key to users table (will be linked later)

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID,  -- Will reference users table when available
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_entity_scope ON videos(entity_scope);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_airtable_id ON videos(airtable_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS videos_updated_at ON videos;
CREATE TRIGGER videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_videos_updated_at();

-- Add comments
COMMENT ON TABLE videos IS 'Video assets used in courses and content';
COMMENT ON COLUMN videos.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN videos.duration_seconds IS 'Video duration in seconds';
COMMENT ON COLUMN videos.metadata IS 'Additional fields from Airtable: type, slug, tags, transcription, etc.';
