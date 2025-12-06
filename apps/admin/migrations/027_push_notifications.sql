-- Migration: 027_push_notifications.sql
-- Description: Add push notification subscriptions and extended notification preferences
-- Created: 2025-12-06

-- =====================================================
-- PUSH SUBSCRIPTIONS
-- =====================================================
-- Store Web Push API subscription objects for each user's browser
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,

  -- Web Push subscription object components
  endpoint TEXT NOT NULL,
  p256dh VARCHAR(255) NOT NULL,   -- Browser's public key
  auth VARCHAR(255) NOT NULL,      -- Auth secret

  -- Device metadata
  user_agent TEXT,
  device_name VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,

  -- Unique constraint: one subscription per endpoint per user
  UNIQUE(user_id, endpoint)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Partial index for efficient cleanup queries
-- Only indexes rows where last_used_at IS NOT NULL (matches WHERE clause in deleteOldPushSubscriptions)
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_last_used
  ON push_subscriptions(last_used_at)
  WHERE last_used_at IS NOT NULL;

-- =====================================================
-- EXTENDED NOTIFICATION PREFERENCES
-- =====================================================
-- Add messaging-specific preference columns
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS quiet_hours_start TIME,
  ADD COLUMN IF NOT EXISTS quiet_hours_end TIME,
  ADD COLUMN IF NOT EXISTS quiet_hours_timezone VARCHAR(50) DEFAULT 'Europe/Vienna',
  ADD COLUMN IF NOT EXISTS new_message_notify BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS reply_notify BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS type_settings JSONB DEFAULT '{
    "new_message": { "push": true, "email": false, "inApp": true },
    "mention": { "push": true, "email": true, "inApp": true },
    "assignment": { "push": true, "email": true, "inApp": true },
    "ticket_update": { "push": false, "email": true, "inApp": true },
    "reply_to_thread": { "push": true, "email": false, "inApp": true }
  }';

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE push_subscriptions IS 'Web Push API subscriptions for browser push notifications';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Web Push endpoint URL (unique per browser/device)';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Browser public key for encryption (P-256 curve)';
COMMENT ON COLUMN push_subscriptions.auth IS 'Auth secret for AEAD encryption';
COMMENT ON COLUMN push_subscriptions.user_agent IS 'Browser user agent string for device identification';
COMMENT ON COLUMN push_subscriptions.device_name IS 'Human-readable device name if available';

COMMENT ON COLUMN notification_preferences.push_enabled IS 'Global toggle for Web Push notifications';
COMMENT ON COLUMN notification_preferences.sound_enabled IS 'Play sound for notifications';
COMMENT ON COLUMN notification_preferences.quiet_hours_enabled IS 'Enable quiet hours (no push notifications)';
COMMENT ON COLUMN notification_preferences.quiet_hours_start IS 'Quiet hours start time (local)';
COMMENT ON COLUMN notification_preferences.quiet_hours_end IS 'Quiet hours end time (local)';
COMMENT ON COLUMN notification_preferences.quiet_hours_timezone IS 'Timezone for quiet hours calculation';
COMMENT ON COLUMN notification_preferences.type_settings IS 'Per-notification-type delivery channel preferences';
