-- Migration: 023_create_course_lessons.sql
-- Description: Create course_lessons table for course builder
-- Created: 2025-11-28

-- Content type enum
DO $$ BEGIN
    CREATE TYPE lesson_content_type AS ENUM ('video', 'text', 'pdf', 'quiz');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type lesson_content_type NOT NULL DEFAULT 'video',
    -- Content fields (one used based on content_type)
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    content_text TEXT,  -- For text type (markdown)
    content_url TEXT,   -- For pdf type (URL to PDF)
    quiz_data JSONB,    -- For quiz type (future)
    -- Metadata
    duration_seconds INTEGER,
    is_required BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false,  -- Free preview lesson
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_video_id ON course_lessons(video_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort_order ON course_lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_content_type ON course_lessons(content_type);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_course_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS course_lessons_updated_at ON course_lessons;
CREATE TRIGGER course_lessons_updated_at
    BEFORE UPDATE ON course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_course_lessons_updated_at();

COMMENT ON TABLE course_lessons IS 'Individual content items within a course module';
COMMENT ON COLUMN course_lessons.content_type IS 'Type of content: video, text, pdf, or quiz';
COMMENT ON COLUMN course_lessons.is_preview IS 'Whether this lesson is available as free preview';
COMMENT ON COLUMN course_lessons.quiz_data IS 'JSON structure for quiz questions (future feature)';
