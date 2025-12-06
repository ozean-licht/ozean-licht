-- Migration: 028_article_feedback.sql
-- Description: Create article feedback table for help center
-- Created: 2025-12-06

-- =====================================================
-- ARTICLE FEEDBACK TABLE
-- =====================================================
-- Stores user feedback on knowledge articles (helpful/not helpful)

CREATE TABLE IF NOT EXISTS article_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  feedback TEXT,
  -- IP/Session tracking to prevent spam (optional)
  session_hash VARCHAR(64),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for article_feedback
CREATE INDEX IF NOT EXISTS idx_article_feedback_article_id ON article_feedback(article_id);
CREATE INDEX IF NOT EXISTS idx_article_feedback_helpful ON article_feedback(helpful);
CREATE INDEX IF NOT EXISTS idx_article_feedback_created_at ON article_feedback(created_at DESC);

-- Prevent duplicate feedback from same session (optional, can be removed if not needed)
CREATE UNIQUE INDEX IF NOT EXISTS idx_article_feedback_session
  ON article_feedback(article_id, session_hash)
  WHERE session_hash IS NOT NULL;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE article_feedback IS 'User feedback on knowledge articles for help center';
COMMENT ON COLUMN article_feedback.article_id IS 'Reference to the knowledge article';
COMMENT ON COLUMN article_feedback.helpful IS 'Whether the user found the article helpful';
COMMENT ON COLUMN article_feedback.feedback IS 'Optional detailed feedback text (max 1000 chars recommended)';
COMMENT ON COLUMN article_feedback.session_hash IS 'Hashed session/IP to prevent duplicate submissions';
