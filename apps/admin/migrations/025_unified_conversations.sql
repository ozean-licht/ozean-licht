-- Migration: 025_unified_conversations.sql
-- Description: Unified conversations schema for support tickets, team channels, DMs, and internal tickets
-- Created: 2025-12-05
-- Replaces: 022_support_tables.sql (support_conversations, support_messages)

-- =====================================================
-- CONTACTS (External customers)
-- =====================================================
-- Stores external customer/contact information for messaging system
-- Supports multiple platforms and communication channels
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact information
  email VARCHAR(255),
  phone VARCHAR(50),
  name VARCHAR(255),
  avatar_url TEXT,
  -- Link to registered user (if applicable)
  user_id UUID,
  -- External platform identifiers
  whatsapp_id VARCHAR(255),
  telegram_id VARCHAR(255),
  -- Additional metadata
  custom_attributes JSONB DEFAULT '{}',
  blocked BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMPTZ,
  -- Platform scope
  platform VARCHAR(50) DEFAULT 'ozean_licht',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Constraints
  UNIQUE(email, platform),
  UNIQUE(phone, platform)
);

-- Indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_platform ON contacts(platform);
CREATE INDEX IF NOT EXISTS idx_contacts_whatsapp ON contacts(whatsapp_id);
CREATE INDEX IF NOT EXISTS idx_contacts_telegram ON contacts(telegram_id);
CREATE INDEX IF NOT EXISTS idx_contacts_last_activity ON contacts(last_activity_at DESC);

-- =====================================================
-- UNIFIED CONVERSATIONS TABLE
-- =====================================================
-- Single table for all conversation types:
-- - 'support': Customer support tickets
-- - 'team_channel': Team channels (like Slack channels)
-- - 'direct_message': 1:1 or group DMs between team members
-- - 'internal_ticket': Internal work items (bugs, features, tasks)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Core conversation properties
  type VARCHAR(30) NOT NULL CHECK (type IN ('support', 'team_channel', 'direct_message', 'internal_ticket')),
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'open', 'pending', 'resolved', 'archived', 'snoozed')),
  platform VARCHAR(50) DEFAULT 'ozean_licht',
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- ==========================================
  -- SUPPORT TICKET FIELDS
  -- ==========================================
  -- External contact information
  contact_id UUID REFERENCES contacts(id),
  contact_email VARCHAR(255),
  contact_name VARCHAR(255),
  -- Communication channel
  channel VARCHAR(50) CHECK (channel IN ('web_widget', 'whatsapp', 'telegram', 'email', 'phone')),
  -- Ticket management
  priority VARCHAR(20) CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_agent_id UUID REFERENCES admin_users(id),
  assigned_team VARCHAR(50) CHECK (assigned_team IN ('support', 'dev', 'tech', 'admin', 'spiritual', 'sales')),
  -- Metrics
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  -- Customer satisfaction
  csat_rating INTEGER CHECK (csat_rating >= 1 AND csat_rating <= 5),
  -- Categorization
  labels TEXT[] DEFAULT '{}',

  -- ==========================================
  -- TEAM CHANNEL FIELDS
  -- ==========================================
  title VARCHAR(255),
  slug VARCHAR(255),
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,

  -- ==========================================
  -- INTERNAL TICKET FIELDS
  -- ==========================================
  ticket_number VARCHAR(20),
  requester_id UUID REFERENCES admin_users(id),
  linked_conversation_id UUID REFERENCES conversations(id),

  -- ==========================================
  -- METADATA
  -- ==========================================
  -- Additional flexible data
  metadata JSONB DEFAULT '{}'
);

-- Unique constraint for slug (team channels only)
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_slug_unique
  ON conversations(slug) WHERE slug IS NOT NULL;

-- Unique constraint for ticket_number (internal tickets only)
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_ticket_number_unique
  ON conversations(ticket_number) WHERE ticket_number IS NOT NULL;

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_platform ON conversations(platform);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned ON conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_requester ON conversations(requester_id);
CREATE INDEX IF NOT EXISTS idx_conversations_ticket_number ON conversations(ticket_number);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);
CREATE INDEX IF NOT EXISTS idx_conversations_team ON conversations(assigned_team);
CREATE INDEX IF NOT EXISTS idx_conversations_linked ON conversations(linked_conversation_id);
-- GIN indexes for array and JSONB columns
CREATE INDEX IF NOT EXISTS idx_conversations_labels_gin ON conversations USING GIN (labels);
CREATE INDEX IF NOT EXISTS idx_conversations_metadata_gin ON conversations USING GIN (metadata);

-- =====================================================
-- CONVERSATION PARTICIPANTS
-- =====================================================
-- Many-to-many relationship between conversations and users/contacts
-- Tracks membership, read status, and notification preferences
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  -- Either user_id OR contact_id must be set (not both)
  user_id UUID REFERENCES admin_users(id),
  contact_id UUID REFERENCES contacts(id),
  -- Participant role
  role VARCHAR(30) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'observer')),
  -- Participation tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  -- Read tracking
  last_read_at TIMESTAMPTZ,
  last_read_message_id UUID,
  unread_count INTEGER DEFAULT 0,
  -- Notification preferences
  notifications_enabled BOOLEAN DEFAULT TRUE,
  notify_all_messages BOOLEAN DEFAULT TRUE,
  notify_sound_enabled BOOLEAN DEFAULT TRUE,
  -- Constraints: one participant per user/contact per conversation
  UNIQUE(conversation_id, user_id),
  UNIQUE(conversation_id, contact_id),
  -- Ensure either user_id or contact_id is set (but not both)
  CONSTRAINT participant_identity_check CHECK (
    (user_id IS NOT NULL AND contact_id IS NULL) OR
    (user_id IS NULL AND contact_id IS NOT NULL)
  )
);

-- Indexes for conversation_participants
CREATE INDEX IF NOT EXISTS idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_contact ON conversation_participants(contact_id);
CREATE INDEX IF NOT EXISTS idx_participants_unread ON conversation_participants(unread_count) WHERE unread_count > 0;
CREATE INDEX IF NOT EXISTS idx_participants_active ON conversation_participants(conversation_id, user_id) WHERE left_at IS NULL;

-- =====================================================
-- UNIFIED MESSAGES TABLE
-- =====================================================
-- All messages across all conversation types
-- Supports threading, mentions, attachments, and rich content
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  -- Sender information
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('agent', 'contact', 'bot', 'system')),
  sender_id UUID, -- References either admin_users.id or contacts.id depending on sender_type
  sender_name VARCHAR(255),
  -- Message content
  content TEXT,
  content_type VARCHAR(30) DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'audio', 'video', 'system')),
  -- Threading support
  thread_id UUID REFERENCES messages(id),
  reply_count INTEGER DEFAULT 0,
  -- Visibility and privacy
  is_private BOOLEAN DEFAULT FALSE, -- Internal notes not visible to contacts
  -- Social features
  mentions UUID[], -- Array of user_ids mentioned in the message
  -- Attachments
  attachments JSONB DEFAULT '[]', -- Array of {url, name, type, size}
  -- External integration
  external_id VARCHAR(255), -- ID from external system (Chatwoot, WhatsApp, etc.)
  external_status VARCHAR(30), -- Status from external system (sent, delivered, read, failed)
  -- AI analysis
  sentiment JSONB, -- {score: 0.8, label: 'positive'}
  intent VARCHAR(50), -- Detected customer intent
  -- Editing and deletion
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_external_id ON messages(external_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
-- GIN indexes for array and JSONB columns
CREATE INDEX IF NOT EXISTS idx_messages_mentions_gin ON messages USING GIN (mentions);
CREATE INDEX IF NOT EXISTS idx_messages_attachments_gin ON messages USING GIN (attachments);

-- =====================================================
-- INTERNAL TICKET SEQUENCES
-- =====================================================
-- Auto-generate ticket numbers like DEV-001, TECH-002, ADMIN-003
CREATE TABLE IF NOT EXISTS ticket_sequences (
  prefix VARCHAR(10) PRIMARY KEY,
  next_number INTEGER DEFAULT 1
);

-- Seed ticket sequences for different teams
INSERT INTO ticket_sequences (prefix, next_number) VALUES
  ('DEV', 1),
  ('TECH', 1),
  ('ADMIN', 1),
  ('SUP', 1),
  ('SPIRIT', 1),
  ('SALES', 1)
ON CONFLICT (prefix) DO NOTHING;

-- Function to get next ticket number for a given prefix
CREATE OR REPLACE FUNCTION get_next_ticket_number(p_prefix VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  v_number INTEGER;
BEGIN
  -- Atomically increment and return the next number
  UPDATE ticket_sequences
  SET next_number = next_number + 1
  WHERE prefix = p_prefix
  RETURNING next_number - 1 INTO v_number;

  -- Return formatted ticket number (e.g., "DEV-001")
  RETURN p_prefix || '-' || LPAD(v_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate ticket numbers for internal tickets
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate for internal tickets without an existing number
  IF NEW.type = 'internal_ticket' AND NEW.ticket_number IS NULL THEN
    NEW.ticket_number := get_next_ticket_number(
      CASE NEW.assigned_team
        WHEN 'dev' THEN 'DEV'
        WHEN 'tech' THEN 'TECH'
        WHEN 'spiritual' THEN 'SPIRIT'
        WHEN 'sales' THEN 'SALES'
        WHEN 'support' THEN 'SUP'
        ELSE 'ADMIN'
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply ticket number trigger
DROP TRIGGER IF EXISTS auto_ticket_number ON conversations;
CREATE TRIGGER auto_ticket_number
  BEFORE INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_number();

-- =====================================================
-- PRESENCE & TYPING INDICATORS
-- =====================================================

-- User presence tracking (online/away/offline status)
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES admin_users(id),
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline', 'dnd')),
  status_text VARCHAR(255), -- Custom status message
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  current_conversation_id UUID REFERENCES conversations(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for presence queries
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_conversation ON user_presence(current_conversation_id);

-- Ephemeral typing indicators (auto-expire after 5 seconds)
CREATE TABLE IF NOT EXISTS typing_indicators (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name VARCHAR(255),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 seconds',
  PRIMARY KEY (conversation_id, user_id)
);

-- Index for cleaning up expired typing indicators
CREATE INDEX IF NOT EXISTS idx_typing_expires ON typing_indicators(expires_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update conversation timestamp when new message arrives
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS message_updates_conversation ON messages;
CREATE TRIGGER message_updates_conversation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Increment unread counts for participants when new message arrives
CREATE OR REPLACE FUNCTION increment_unread_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment unread count for all participants except:
  -- 1. The sender (if sender_type is 'agent' and sender_id matches user_id)
  -- 2. Users who have already read past this message timestamp
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
    AND left_at IS NULL -- Only active participants
    AND (
      -- Not the sender
      (NEW.sender_type = 'agent' AND user_id IS DISTINCT FROM NEW.sender_id) OR
      (NEW.sender_type != 'agent')
    )
    AND (
      -- Haven't read this far yet
      last_read_at IS NULL OR
      last_read_at < NEW.created_at
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_unread_on_message ON messages;
CREATE TRIGGER update_unread_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_unread_counts();

-- Update thread reply count when threaded message is added
CREATE OR REPLACE FUNCTION update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a reply to a thread, increment parent's reply count
  IF NEW.thread_id IS NOT NULL THEN
    UPDATE messages
    SET reply_count = reply_count + 1
    WHERE id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_thread_count ON messages;
CREATE TRIGGER update_thread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_reply_count();

-- Reset unread count when user marks conversation as read
CREATE OR REPLACE FUNCTION reset_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only reset if last_read_at was actually updated
  IF NEW.last_read_at IS DISTINCT FROM OLD.last_read_at THEN
    NEW.unread_count := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reset_unread_on_read ON conversation_participants;
CREATE TRIGGER reset_unread_on_read
  BEFORE UPDATE ON conversation_participants
  FOR EACH ROW
  EXECUTE FUNCTION reset_unread_count();

-- Update contacts timestamp on modification
CREATE OR REPLACE FUNCTION update_contacts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contacts_timestamp ON contacts;
CREATE TRIGGER trigger_update_contacts_timestamp
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_timestamp();

-- Update conversations timestamp on modification
CREATE OR REPLACE FUNCTION update_conversations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversations_timestamp ON conversations;
CREATE TRIGGER trigger_update_conversations_timestamp
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_timestamp();

-- Update user presence timestamp on modification
CREATE OR REPLACE FUNCTION update_user_presence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_presence_timestamp ON user_presence;
CREATE TRIGGER trigger_update_user_presence_timestamp
  BEFORE UPDATE ON user_presence
  FOR EACH ROW
  EXECUTE FUNCTION update_user_presence_timestamp();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get unread message count for a user across all conversations
CREATE OR REPLACE FUNCTION get_user_total_unread(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER;
BEGIN
  SELECT COALESCE(SUM(unread_count), 0)
  INTO v_total
  FROM conversation_participants
  WHERE user_id = p_user_id
    AND left_at IS NULL;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Mark conversation as read for a user
CREATE OR REPLACE FUNCTION mark_conversation_read(
  p_conversation_id UUID,
  p_user_id UUID,
  p_message_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE conversation_participants
  SET
    last_read_at = NOW(),
    last_read_message_id = COALESCE(p_message_id, last_read_message_id),
    unread_count = 0
  WHERE conversation_id = p_conversation_id
    AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Get active typing users in a conversation
CREATE OR REPLACE FUNCTION get_typing_users(p_conversation_id UUID)
RETURNS TABLE(user_id UUID, user_name VARCHAR, started_at TIMESTAMPTZ) AS $$
BEGIN
  -- Clean up expired indicators first
  DELETE FROM typing_indicators WHERE expires_at < NOW();

  -- Return active typing users
  RETURN QUERY
  SELECT ti.user_id, ti.user_name, ti.started_at
  FROM typing_indicators ti
  WHERE ti.conversation_id = p_conversation_id
    AND ti.expires_at > NOW()
  ORDER BY ti.started_at;
END;
$$ LANGUAGE plpgsql;

-- Set typing indicator for a user
CREATE OR REPLACE FUNCTION set_typing_indicator(
  p_conversation_id UUID,
  p_user_id UUID,
  p_user_name VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO typing_indicators (conversation_id, user_id, user_name, started_at, expires_at)
  VALUES (p_conversation_id, p_user_id, p_user_name, NOW(), NOW() + INTERVAL '5 seconds')
  ON CONFLICT (conversation_id, user_id)
  DO UPDATE SET
    started_at = NOW(),
    expires_at = NOW() + INTERVAL '5 seconds',
    user_name = p_user_name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE contacts IS 'External customers/contacts for messaging system across all platforms';
COMMENT ON TABLE conversations IS 'Unified conversations: support tickets, team channels, direct messages, and internal tickets';
COMMENT ON TABLE conversation_participants IS 'Conversation membership with read tracking and notification preferences';
COMMENT ON TABLE messages IS 'Unified messages with threading, mentions, attachments, and AI analysis';
COMMENT ON TABLE ticket_sequences IS 'Auto-increment sequences for internal ticket numbers (DEV-001, TECH-002, etc.)';
COMMENT ON TABLE user_presence IS 'Real-time online/away/offline status for team members';
COMMENT ON TABLE typing_indicators IS 'Ephemeral typing status indicators (auto-expire after 5 seconds)';

-- Contacts comments
COMMENT ON COLUMN contacts.user_id IS 'Link to registered user account (if contact has registered)';
COMMENT ON COLUMN contacts.whatsapp_id IS 'WhatsApp unique identifier for integration';
COMMENT ON COLUMN contacts.telegram_id IS 'Telegram user ID for integration';
COMMENT ON COLUMN contacts.custom_attributes IS 'Flexible storage for additional contact metadata';
COMMENT ON COLUMN contacts.blocked IS 'Whether this contact is blocked from communication';
COMMENT ON COLUMN contacts.platform IS 'Platform scope: ozean_licht, kids_ascension, etc.';

-- Conversations comments
COMMENT ON COLUMN conversations.type IS 'Conversation type: support, team_channel, direct_message, internal_ticket';
COMMENT ON COLUMN conversations.status IS 'Current status: active, open, pending, resolved, archived, snoozed';
COMMENT ON COLUMN conversations.contact_id IS '[Support] External contact for customer support tickets';
COMMENT ON COLUMN conversations.channel IS '[Support] Communication channel: web_widget, whatsapp, telegram, email, phone';
COMMENT ON COLUMN conversations.priority IS '[Support] Priority level: low, normal, high, urgent';
COMMENT ON COLUMN conversations.assigned_agent_id IS '[Support] Admin user assigned to handle this ticket';
COMMENT ON COLUMN conversations.assigned_team IS '[Support] Team responsible: support, dev, tech, admin, spiritual, sales';
COMMENT ON COLUMN conversations.first_response_at IS '[Support] Timestamp of first agent response (for SLA tracking)';
COMMENT ON COLUMN conversations.resolved_at IS '[Support] Timestamp when ticket was resolved';
COMMENT ON COLUMN conversations.csat_rating IS '[Support] Customer satisfaction rating 1-5';
COMMENT ON COLUMN conversations.labels IS '[Support] Array of labels for categorization and filtering';
COMMENT ON COLUMN conversations.title IS '[Channel/Ticket] Human-readable conversation title';
COMMENT ON COLUMN conversations.slug IS '[Channel] URL-friendly unique identifier for team channels';
COMMENT ON COLUMN conversations.description IS '[Channel] Channel description or purpose';
COMMENT ON COLUMN conversations.is_private IS '[Channel] Whether channel is private (invite-only)';
COMMENT ON COLUMN conversations.is_archived IS '[Channel] Whether channel is archived';
COMMENT ON COLUMN conversations.ticket_number IS '[Internal Ticket] Auto-generated ticket number (DEV-001, etc.)';
COMMENT ON COLUMN conversations.requester_id IS '[Internal Ticket] Admin user who created the ticket';
COMMENT ON COLUMN conversations.linked_conversation_id IS '[Internal Ticket] Link to related support conversation';
COMMENT ON COLUMN conversations.metadata IS 'Flexible storage for additional conversation data';

-- Participants comments
COMMENT ON COLUMN conversation_participants.role IS 'Participant role: owner, admin, member, observer';
COMMENT ON COLUMN conversation_participants.joined_at IS 'When participant joined the conversation';
COMMENT ON COLUMN conversation_participants.left_at IS 'When participant left (NULL if still active)';
COMMENT ON COLUMN conversation_participants.last_read_at IS 'Timestamp of last read message for unread tracking';
COMMENT ON COLUMN conversation_participants.last_read_message_id IS 'ID of last message read by this participant';
COMMENT ON COLUMN conversation_participants.unread_count IS 'Number of unread messages (auto-updated by triggers)';
COMMENT ON COLUMN conversation_participants.notifications_enabled IS 'Whether user receives notifications for this conversation';
COMMENT ON COLUMN conversation_participants.notify_all_messages IS 'Notify on every message vs. only mentions';
COMMENT ON COLUMN conversation_participants.notify_sound_enabled IS 'Whether to play sound for notifications';

-- Messages comments
COMMENT ON COLUMN messages.sender_type IS 'Type of sender: agent (team member), contact (customer), bot, system';
COMMENT ON COLUMN messages.sender_id IS 'ID of sender (admin_users.id for agents, contacts.id for contacts)';
COMMENT ON COLUMN messages.content IS 'Message text content (supports markdown)';
COMMENT ON COLUMN messages.content_type IS 'Content type: text, image, file, audio, video, system';
COMMENT ON COLUMN messages.thread_id IS 'Parent message ID for threaded conversations';
COMMENT ON COLUMN messages.reply_count IS 'Number of replies in this thread (auto-updated)';
COMMENT ON COLUMN messages.is_private IS 'Internal note not visible to contacts';
COMMENT ON COLUMN messages.mentions IS 'Array of user IDs mentioned in message (@mentions)';
COMMENT ON COLUMN messages.attachments IS 'Array of attachment objects: [{url, name, type, size}]';
COMMENT ON COLUMN messages.external_id IS 'ID from external system (Chatwoot, WhatsApp, Telegram)';
COMMENT ON COLUMN messages.external_status IS 'Delivery status from external system: sent, delivered, read, failed';
COMMENT ON COLUMN messages.sentiment IS 'AI sentiment analysis: {score: 0.8, label: "positive"}';
COMMENT ON COLUMN messages.intent IS 'AI-detected customer intent: question, complaint, request, etc.';
COMMENT ON COLUMN messages.edited_at IS 'Timestamp of last edit (NULL if never edited)';
COMMENT ON COLUMN messages.deleted_at IS 'Soft delete timestamp (NULL if not deleted)';

-- Presence comments
COMMENT ON COLUMN user_presence.status IS 'Current status: online, away, offline, dnd (do not disturb)';
COMMENT ON COLUMN user_presence.status_text IS 'Custom status message set by user';
COMMENT ON COLUMN user_presence.last_seen_at IS 'Last activity timestamp for offline users';
COMMENT ON COLUMN user_presence.current_conversation_id IS 'Conversation user is currently viewing';

-- Typing indicators comments
COMMENT ON COLUMN typing_indicators.expires_at IS 'Auto-expire after 5 seconds of inactivity';

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- This migration creates a unified conversation system that supports:
-- 1. Customer support tickets (replaces support_conversations from migration 022)
-- 2. Team channels (Slack-like channels for team communication)
-- 3. Direct messages (1:1 and group chat between team members)
-- 4. Internal tickets (bug tracking, feature requests, tasks)
--
-- All conversation types share the same core structure but use different
-- field subsets based on their type. This enables:
-- - Unified search across all conversations
-- - Easy conversion between types (e.g., support ticket -> internal ticket)
-- - Consistent read tracking and notifications
-- - Single message table with threading support
--
-- Key features:
-- - Real-time presence and typing indicators
-- - Thread support with automatic reply counting
-- - Automatic unread count tracking
-- - Mention notifications
-- - Rich attachments (images, files, audio, video)
-- - AI sentiment and intent analysis
-- - Auto-generated ticket numbers for internal tickets
-- - Flexible metadata storage for future extensions
