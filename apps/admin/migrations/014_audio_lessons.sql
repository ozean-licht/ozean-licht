-- Migration: Add audio lesson support
-- Phase 8: Audio & Multi-format content
-- Created: 2025-12-03

-- Add audio-related columns to course_lessons table
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS audio_mime_type TEXT,
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS transcript_segments JSONB;

-- Add index on content_type for filtering by lesson type
CREATE INDEX IF NOT EXISTS idx_course_lessons_content_type
ON course_lessons(content_type);

-- Add comment for documentation
COMMENT ON COLUMN course_lessons.audio_url IS 'URL to audio file in MinIO (for audio content type)';
COMMENT ON COLUMN course_lessons.audio_mime_type IS 'MIME type of audio file (audio/mpeg, audio/wav, etc.)';
COMMENT ON COLUMN course_lessons.transcript IS 'Plain text transcript for accessibility';
COMMENT ON COLUMN course_lessons.transcript_segments IS 'Timestamped transcript segments as JSON array [{start, end, text}]';
