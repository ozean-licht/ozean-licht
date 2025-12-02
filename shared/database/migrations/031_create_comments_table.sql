-- Migration: 031_create_comments_table.sql
-- Description: Create comments table for projects and tasks
-- Target Database: ozean-licht-db
-- Created: 2025-12-01

-- ============================================================================
-- Comments table
-- ============================================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'task')),
    entity_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name TEXT,
    author_email TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_author_email ON comments(author_email);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_updated_at ON comments;
CREATE TRIGGER comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE comments IS 'Comments for projects and tasks with threading support';
COMMENT ON COLUMN comments.entity_type IS 'Type of entity: project or task';
COMMENT ON COLUMN comments.entity_id IS 'UUID of the project or task';
COMMENT ON COLUMN comments.parent_comment_id IS 'Parent comment for threaded discussions';
COMMENT ON COLUMN comments.is_edited IS 'Whether the comment has been edited';
COMMENT ON COLUMN comments.edited_at IS 'When the comment was last edited';
