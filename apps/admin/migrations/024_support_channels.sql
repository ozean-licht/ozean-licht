-- Migration: 024_support_channels.sql
-- Description: Add channel configuration tables for Support Management System Phase 5
-- Created: 2025-12-04

-- =====================================================
-- 1. SUPPORT CHANNEL CONFIGS TABLE
-- =====================================================
-- Stores configuration for each communication channel

CREATE TABLE IF NOT EXISTS support_channel_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Channel type
  channel VARCHAR(50) NOT NULL UNIQUE CHECK (channel IN ('web_widget', 'whatsapp', 'email', 'telegram')),
  -- Display name for admin UI
  display_name VARCHAR(100) NOT NULL,
  -- Whether this channel is enabled
  is_enabled BOOLEAN DEFAULT FALSE,
  -- Chatwoot inbox ID for this channel
  chatwoot_inbox_id INTEGER,
  -- Channel-specific configuration (API keys, tokens, etc.)
  config JSONB DEFAULT '{}',
  -- Default team assignment for this channel
  default_team VARCHAR(50) CHECK (default_team IN ('tech', 'sales', 'spiritual', 'general')),
  -- Auto-response settings
  auto_response_enabled BOOLEAN DEFAULT FALSE,
  auto_response_message TEXT,
  -- Business hours (JSON with days and hours)
  business_hours JSONB DEFAULT '{}',
  -- Platform association (ozean_licht or kids_ascension)
  platform VARCHAR(50) DEFAULT 'ozean_licht',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config JSON structure for each channel:
-- WhatsApp: { "phone_number": "", "business_id": "", "access_token": "", "waba_id": "" }
-- Telegram: { "bot_token": "", "bot_username": "", "webhook_url": "" }
-- Email: { "imap_address": "", "smtp_address": "", "email": "", "password": "" }
-- Web Widget: { "website_token": "", "allowed_domains": [] }

-- =====================================================
-- 2. SUPPORT WIDGET SETTINGS TABLE
-- =====================================================
-- Stores customization for web chat widget appearance

CREATE TABLE IF NOT EXISTS support_widget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Platform this widget is for
  platform VARCHAR(50) NOT NULL UNIQUE CHECK (platform IN ('ozean_licht', 'kids_ascension')),
  -- Widget appearance
  primary_color VARCHAR(20) DEFAULT '#0ec2bc',
  position VARCHAR(20) DEFAULT 'right' CHECK (position IN ('left', 'right')),
  -- Welcome messages
  welcome_title VARCHAR(255) DEFAULT 'Willkommen! 👋',
  welcome_subtitle TEXT DEFAULT 'Wie können wir Ihnen helfen?',
  -- Reply time indicator
  reply_time VARCHAR(50) DEFAULT 'in_a_few_minutes',
  -- Branding
  show_branding BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  -- Pre-chat form
  pre_chat_form_enabled BOOLEAN DEFAULT FALSE,
  pre_chat_form_fields JSONB DEFAULT '[]',
  -- Widget behavior
  hide_message_bubble BOOLEAN DEFAULT FALSE,
  show_popup_onload BOOLEAN DEFAULT FALSE,
  popup_delay_seconds INTEGER DEFAULT 0,
  -- Language
  language VARCHAR(10) DEFAULT 'de',
  -- Custom CSS (optional)
  custom_css TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_channel_configs_channel ON support_channel_configs(channel);
CREATE INDEX IF NOT EXISTS idx_channel_configs_enabled ON support_channel_configs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_channel_configs_platform ON support_channel_configs(platform);
CREATE INDEX IF NOT EXISTS idx_widget_settings_platform ON support_widget_settings(platform);

-- =====================================================
-- 4. UPDATE TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_channel_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_channel_config_timestamp ON support_channel_configs;
CREATE TRIGGER trigger_update_channel_config_timestamp
  BEFORE UPDATE ON support_channel_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_channel_config_timestamp();

DROP TRIGGER IF EXISTS trigger_update_widget_settings_timestamp ON support_widget_settings;
CREATE TRIGGER trigger_update_widget_settings_timestamp
  BEFORE UPDATE ON support_widget_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_channel_config_timestamp();

-- =====================================================
-- 5. SEED DEFAULT DATA
-- =====================================================

-- Insert default channel configurations (disabled by default)
INSERT INTO support_channel_configs (channel, display_name, is_enabled, config, platform) VALUES
  ('web_widget', 'Website Chat', FALSE, '{"website_token": "", "allowed_domains": []}', 'ozean_licht'),
  ('whatsapp', 'WhatsApp Business', FALSE, '{"phone_number": "", "business_id": "", "access_token": "", "waba_id": ""}', 'ozean_licht'),
  ('email', 'Email', FALSE, '{"imap_address": "", "smtp_address": "", "email": "", "password": ""}', 'ozean_licht'),
  ('telegram', 'Telegram Bot', FALSE, '{"bot_token": "", "bot_username": "", "webhook_url": ""}', 'ozean_licht')
ON CONFLICT (channel) DO NOTHING;

-- Insert default widget settings
INSERT INTO support_widget_settings (platform, primary_color, welcome_title, welcome_subtitle) VALUES
  ('ozean_licht', '#0ec2bc', 'Willkommen! 👋', 'Wie können wir Ihnen helfen?'),
  ('kids_ascension', '#6366f1', 'Hi there! 👋', 'How can we help you today?')
ON CONFLICT (platform) DO NOTHING;

-- =====================================================
-- 6. COMMENTS
-- =====================================================

COMMENT ON TABLE support_channel_configs IS 'Configuration for each support communication channel (WhatsApp, Telegram, Email, Web Widget)';
COMMENT ON TABLE support_widget_settings IS 'Customization settings for the web chat widget appearance';

COMMENT ON COLUMN support_channel_configs.chatwoot_inbox_id IS 'ID of the corresponding inbox in Chatwoot';
COMMENT ON COLUMN support_channel_configs.config IS 'Channel-specific configuration (API keys, tokens stored encrypted)';
COMMENT ON COLUMN support_channel_configs.business_hours IS 'Business hours configuration as JSON';
COMMENT ON COLUMN support_channel_configs.auto_response_message IS 'Message sent automatically when channel is enabled';

COMMENT ON COLUMN support_widget_settings.pre_chat_form_fields IS 'Array of form fields to collect before chat starts';
COMMENT ON COLUMN support_widget_settings.reply_time IS 'Estimated reply time shown to users';
COMMENT ON COLUMN support_widget_settings.custom_css IS 'Custom CSS to override widget styles';
