-- Phase 12: Notifications
-- Creates tables for in-app notifications and user notification preferences

-- Notification types enum-like check
-- Types: mention, assignment, comment, task_update, project_update, due_date, system

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  entity_type VARCHAR(50), -- 'task', 'project', 'comment'
  entity_id UUID,
  actor_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_entity ON notifications(entity_type, entity_id);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES admin_users(id) ON DELETE CASCADE,
  in_app BOOLEAN DEFAULT true,
  email_digest VARCHAR(20) DEFAULT 'daily', -- 'none', 'instant', 'daily', 'weekly'
  mention_notify BOOLEAN DEFAULT true,
  assignment_notify BOOLEAN DEFAULT true,
  comment_notify BOOLEAN DEFAULT true,
  task_update_notify BOOLEAN DEFAULT true,
  project_update_notify BOOLEAN DEFAULT true,
  due_date_notify BOOLEAN DEFAULT true,
  system_notify BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create notification with duplicate prevention
CREATE OR REPLACE FUNCTION create_notification_if_not_exists(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_link TEXT,
  p_entity_type VARCHAR(50),
  p_entity_id UUID,
  p_actor_id UUID
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_pref_enabled BOOLEAN;
BEGIN
  -- Check if user has this notification type enabled
  SELECT CASE p_type
    WHEN 'mention' THEN COALESCE(mention_notify, true)
    WHEN 'assignment' THEN COALESCE(assignment_notify, true)
    WHEN 'comment' THEN COALESCE(comment_notify, true)
    WHEN 'task_update' THEN COALESCE(task_update_notify, true)
    WHEN 'project_update' THEN COALESCE(project_update_notify, true)
    WHEN 'due_date' THEN COALESCE(due_date_notify, true)
    WHEN 'system' THEN COALESCE(system_notify, true)
    ELSE true
  END INTO v_pref_enabled
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- Default to true if no preferences set
  IF v_pref_enabled IS NULL THEN
    v_pref_enabled := true;
  END IF;

  -- Only create notification if enabled
  IF v_pref_enabled THEN
    INSERT INTO notifications (user_id, type, title, message, link, entity_type, entity_id, actor_id)
    VALUES (p_user_id, p_type, p_title, p_message, p_link, p_entity_type, p_entity_id, p_actor_id)
    RETURNING id INTO v_notification_id;
  END IF;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery';
COMMENT ON COLUMN notifications.type IS 'Type: mention, assignment, comment, task_update, project_update, due_date, system';
COMMENT ON COLUMN notification_preferences.email_digest IS 'Email frequency: none, instant, daily, weekly';
