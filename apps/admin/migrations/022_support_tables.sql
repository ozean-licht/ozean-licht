-- Migration: 022_support_tables.sql
-- Description: Create Support Management System tables for Chatwoot integration
-- Created: 2025-12-04

-- =====================================================
-- 1. SUPPORT CONVERSATIONS TABLE
-- =====================================================
-- Synced from Chatwoot - stores conversation metadata and status

CREATE TABLE IF NOT EXISTS support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Chatwoot integration
  chatwoot_id INTEGER UNIQUE NOT NULL,
  -- User association
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  contact_name VARCHAR(255),
  -- Conversation properties
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('web_widget', 'whatsapp', 'email', 'telegram')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'pending', 'snoozed')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  -- Team assignment
  team VARCHAR(50) CHECK (team IN ('tech', 'sales', 'spiritual', 'general')),
  assigned_agent_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  -- Labels for categorization
  labels TEXT[] DEFAULT '{}',
  -- Metrics
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  -- Customer satisfaction
  csat_rating INTEGER CHECK (csat_rating >= 1 AND csat_rating <= 5),
  -- Additional data from Chatwoot
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for support_conversations
CREATE INDEX IF NOT EXISTS idx_support_conversations_status ON support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_conversations_user_id ON support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_assigned_agent ON support_conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_channel ON support_conversations(channel);
CREATE INDEX IF NOT EXISTS idx_support_conversations_team ON support_conversations(team);
CREATE INDEX IF NOT EXISTS idx_support_conversations_created_at ON support_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_conversations_chatwoot_id ON support_conversations(chatwoot_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_priority ON support_conversations(priority);
-- GIN indexes for JSONB and array columns (for search and filtering)
CREATE INDEX IF NOT EXISTS idx_support_conversations_metadata_gin ON support_conversations USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_support_conversations_labels_gin ON support_conversations USING GIN (labels);

-- =====================================================
-- 2. SUPPORT MESSAGES TABLE
-- =====================================================
-- Message history for conversations - provides context for AI agents

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  chatwoot_id INTEGER UNIQUE,
  -- Message metadata
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('contact', 'agent', 'bot')),
  sender_name VARCHAR(255),
  -- Message content
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'attachment', 'template')),
  is_private BOOLEAN DEFAULT FALSE,
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for support_messages
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation_id ON support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender_type ON support_messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_support_messages_chatwoot_id ON support_messages(chatwoot_id);

-- =====================================================
-- 3. KNOWLEDGE ARTICLES TABLE
-- =====================================================
-- Self-service help articles for users and support agents

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Article metadata
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  -- Content
  content TEXT NOT NULL,
  summary TEXT,
  -- Organization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  language VARCHAR(10) DEFAULT 'de',
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  -- Analytics
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  -- Authorship
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for knowledge_articles
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_status ON knowledge_articles(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug ON knowledge_articles(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_language ON knowledge_articles(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_created_by ON knowledge_articles(created_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_published_at ON knowledge_articles(published_at DESC);
-- GIN index for tags array (for tag-based filtering and search)
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_tags_gin ON knowledge_articles USING GIN (tags);

-- =====================================================
-- 4. SUPPORT ANALYTICS TABLE
-- =====================================================
-- Daily metrics snapshots for performance monitoring

CREATE TABLE IF NOT EXISTS support_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Date for metrics (one row per day)
  date DATE NOT NULL UNIQUE,
  -- Conversation metrics
  total_conversations INTEGER DEFAULT 0,
  new_conversations INTEGER DEFAULT 0,
  resolved_conversations INTEGER DEFAULT 0,
  -- Response time metrics (in minutes)
  avg_first_response_minutes DECIMAL(10,2),
  avg_resolution_minutes DECIMAL(10,2),
  -- Customer satisfaction
  csat_average DECIMAL(3,2),
  -- Channel distribution
  conversations_by_channel JSONB DEFAULT '{}',
  -- Team distribution
  conversations_by_team JSONB DEFAULT '{}',
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for support_analytics
CREATE INDEX IF NOT EXISTS idx_support_analytics_date ON support_analytics(date DESC);

-- =====================================================
-- 5. UPDATE TRIGGERS
-- =====================================================

-- Update timestamp trigger for support_conversations
CREATE OR REPLACE FUNCTION update_support_conversations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_support_conversations_timestamp ON support_conversations;
CREATE TRIGGER trigger_update_support_conversations_timestamp
  BEFORE UPDATE ON support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_support_conversations_timestamp();

-- Update timestamp trigger for knowledge_articles
CREATE OR REPLACE FUNCTION update_knowledge_articles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_knowledge_articles_timestamp ON knowledge_articles;
CREATE TRIGGER trigger_update_knowledge_articles_timestamp
  BEFORE UPDATE ON knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_articles_timestamp();

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Calculate average first response time for a date range
CREATE OR REPLACE FUNCTION calculate_avg_first_response_time(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
) RETURNS DECIMAL AS $$
DECLARE
  avg_minutes DECIMAL(10,2);
BEGIN
  SELECT AVG(EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60)
  INTO avg_minutes
  FROM support_conversations
  WHERE first_response_at IS NOT NULL
    AND created_at >= start_date
    AND created_at < end_date;

  RETURN COALESCE(avg_minutes, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate average resolution time for a date range
CREATE OR REPLACE FUNCTION calculate_avg_resolution_time(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
) RETURNS DECIMAL AS $$
DECLARE
  avg_minutes DECIMAL(10,2);
BEGIN
  SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60)
  INTO avg_minutes
  FROM support_conversations
  WHERE resolved_at IS NOT NULL
    AND created_at >= start_date
    AND created_at < end_date;

  RETURN COALESCE(avg_minutes, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate CSAT average for a date range
CREATE OR REPLACE FUNCTION calculate_csat_average(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
) RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT AVG(csat_rating)
  INTO avg_rating
  FROM support_conversations
  WHERE csat_rating IS NOT NULL
    AND created_at >= start_date
    AND created_at < end_date;

  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE support_conversations IS 'Support conversations synced from Chatwoot - stores metadata and status';
COMMENT ON TABLE support_messages IS 'Message history for support conversations - provides context for AI agents';
COMMENT ON TABLE knowledge_articles IS 'Self-service help articles for users and support agents';
COMMENT ON TABLE support_analytics IS 'Daily metrics snapshots for support performance monitoring';

COMMENT ON COLUMN support_conversations.chatwoot_id IS 'Unique ID from Chatwoot for sync tracking';
COMMENT ON COLUMN support_conversations.user_id IS 'Link to registered user (if applicable)';
COMMENT ON COLUMN support_conversations.channel IS 'Communication channel: web_widget, whatsapp, email, telegram';
COMMENT ON COLUMN support_conversations.status IS 'Current conversation status: open, resolved, pending, snoozed';
COMMENT ON COLUMN support_conversations.priority IS 'Priority level: low, normal, high, urgent';
COMMENT ON COLUMN support_conversations.team IS 'Assigned team: tech, sales, spiritual, general';
COMMENT ON COLUMN support_conversations.labels IS 'Array of labels for categorization';
COMMENT ON COLUMN support_conversations.first_response_at IS 'Timestamp of first agent response';
COMMENT ON COLUMN support_conversations.resolved_at IS 'Timestamp when conversation was resolved';
COMMENT ON COLUMN support_conversations.csat_rating IS 'Customer satisfaction rating (1-5)';
COMMENT ON COLUMN support_conversations.metadata IS 'Additional data from Chatwoot (custom attributes, etc.)';

COMMENT ON COLUMN support_messages.sender_type IS 'Type of sender: contact (customer), agent, or bot';
COMMENT ON COLUMN support_messages.message_type IS 'Type of message: text, attachment, or template';
COMMENT ON COLUMN support_messages.is_private IS 'Whether message is internal (not visible to customer)';

COMMENT ON COLUMN knowledge_articles.slug IS 'URL-friendly unique identifier for the article';
COMMENT ON COLUMN knowledge_articles.category IS 'Article category for organization';
COMMENT ON COLUMN knowledge_articles.tags IS 'Array of tags for filtering and search';
COMMENT ON COLUMN knowledge_articles.status IS 'Publication status: draft, published, archived';
COMMENT ON COLUMN knowledge_articles.view_count IS 'Number of times article has been viewed';
COMMENT ON COLUMN knowledge_articles.helpful_count IS 'Number of positive helpfulness votes';

COMMENT ON COLUMN support_analytics.date IS 'Date for which metrics are calculated (one row per day)';
COMMENT ON COLUMN support_analytics.avg_first_response_minutes IS 'Average time to first response in minutes';
COMMENT ON COLUMN support_analytics.avg_resolution_minutes IS 'Average time to resolution in minutes';
COMMENT ON COLUMN support_analytics.csat_average IS 'Average customer satisfaction score (1-5)';
COMMENT ON COLUMN support_analytics.conversations_by_channel IS 'Distribution of conversations across channels';
COMMENT ON COLUMN support_analytics.conversations_by_team IS 'Distribution of conversations across teams';
