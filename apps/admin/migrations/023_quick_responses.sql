-- Migration: 023_quick_responses.sql
-- Description: Create quick_responses table for canned responses in Support Management System
-- Created: 2025-12-04

-- =====================================================
-- 1. QUICK RESPONSES TABLE
-- =====================================================
-- Canned responses for support agents to quickly reply to common inquiries
-- Supports both team-wide responses and personal agent responses

CREATE TABLE IF NOT EXISTS quick_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Response content
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  -- Organization
  category VARCHAR(100) DEFAULT 'general',
  language VARCHAR(10) DEFAULT 'de',
  -- Ownership
  is_personal BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  -- Analytics
  usage_count INTEGER DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. INDEXES
-- =====================================================

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_quick_responses_category ON quick_responses(category);

-- Index for personal responses lookup
CREATE INDEX IF NOT EXISTS idx_quick_responses_created_by ON quick_responses(created_by);

-- Index for team vs personal filtering
CREATE INDEX IF NOT EXISTS idx_quick_responses_is_personal ON quick_responses(is_personal);

-- Index for language filtering
CREATE INDEX IF NOT EXISTS idx_quick_responses_language ON quick_responses(language);

-- Index for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_quick_responses_usage_count ON quick_responses(usage_count DESC);

-- =====================================================
-- 3. UPDATE TRIGGER
-- =====================================================

-- Update timestamp trigger for quick_responses
CREATE OR REPLACE FUNCTION update_quick_responses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_quick_responses_timestamp ON quick_responses;
CREATE TRIGGER trigger_update_quick_responses_timestamp
  BEFORE UPDATE ON quick_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_quick_responses_timestamp();

-- =====================================================
-- 4. SEED DATA
-- =====================================================

-- Insert default team-wide quick responses
INSERT INTO quick_responses (title, content, category, language, is_personal) VALUES
-- Greetings
('Greeting - German', 'Hallo und herzlich willkommen! Wie kann ich Ihnen heute helfen?', 'greeting', 'de', false),
('Greeting - English', 'Hello and welcome! How can I help you today?', 'greeting', 'en', false),
-- Technical Support
('Course Access Issue', 'Ich verstehe, dass Sie Probleme mit dem Kurszugang haben. Lassen Sie mich das für Sie überprüfen. Können Sie mir bitte Ihre E-Mail-Adresse mitteilen?', 'technical', 'de', false),
-- Billing
('Payment Confirmation', 'Ihre Zahlung wurde erfolgreich verarbeitet. Sie sollten in Kürze eine Bestätigungs-E-Mail erhalten.', 'billing', 'de', false),
('Refund Request', 'Ich verstehe Ihre Anfrage nach einer Erstattung. Lassen Sie mich Ihre Situation prüfen und Ihnen die verfügbaren Optionen mitteilen.', 'billing', 'de', false),
-- Spiritual Guidance
('Meditation Guidance', 'Für Ihre Meditationspraxis empfehle ich, mit kürzeren Sitzungen von 5-10 Minuten zu beginnen und die Dauer schrittweise zu erhöhen.', 'spiritual', 'de', false),
-- Closing Messages
('Closing - Resolved', 'Es freut mich, dass ich Ihnen helfen konnte! Haben Sie noch weitere Fragen?', 'closing', 'de', false),
('Closing - Follow Up', 'Ich werde diese Angelegenheit weiter verfolgen und melde mich bei Ihnen, sobald ich mehr Informationen habe.', 'closing', 'de', false);

-- =====================================================
-- 5. COMMENTS
-- =====================================================

COMMENT ON TABLE quick_responses IS 'Canned responses for support agents to quickly reply to common inquiries. Supports both team-wide and personal agent responses.';

COMMENT ON COLUMN quick_responses.title IS 'Short descriptive title for the quick response';
COMMENT ON COLUMN quick_responses.content IS 'The actual response text that will be inserted';
COMMENT ON COLUMN quick_responses.category IS 'Category for organizing responses: greeting, technical, billing, spiritual, closing, general';
COMMENT ON COLUMN quick_responses.language IS 'Language code (de, en, etc.) for multilingual support';
COMMENT ON COLUMN quick_responses.is_personal IS 'Whether this is a personal response (true) or team-wide (false)';
COMMENT ON COLUMN quick_responses.created_by IS 'Admin user who created this response. Required for personal responses, optional for team responses.';
COMMENT ON COLUMN quick_responses.usage_count IS 'Number of times this response has been used. Increments on each use for analytics.';
COMMENT ON COLUMN quick_responses.created_at IS 'Timestamp when the response was created';
COMMENT ON COLUMN quick_responses.updated_at IS 'Timestamp when the response was last updated (auto-updated by trigger)';
