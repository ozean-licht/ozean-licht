-- Migration: 025b_migrate_support_data.sql
-- Description: Migrate existing support data from 022_support_tables to unified conversations
-- Created: 2025-12-05
-- NOTE: Run this AFTER 025_unified_conversations.sql

BEGIN;

-- =====================================================
-- MIGRATION: support_conversations → conversations + contacts
-- =====================================================

-- Step 1: Create contacts from existing support_conversations (with email)
-- Only insert contacts that don't already exist
INSERT INTO contacts (
  email,
  name,
  platform,
  created_at,
  updated_at
)
SELECT DISTINCT
  sc.contact_email,
  sc.contact_name,
  'ozean_licht'::VARCHAR(50),
  MIN(sc.created_at),
  MAX(sc.updated_at)
FROM support_conversations sc
WHERE sc.contact_email IS NOT NULL
  AND sc.contact_email != ''
GROUP BY sc.contact_email, sc.contact_name
ON CONFLICT (email, platform) DO NOTHING;

-- Step 2: Migrate support_conversations to unified conversations table
-- Map old support tables to new unified structure
INSERT INTO conversations (
  type,
  status,
  platform,
  contact_id,
  contact_email,
  contact_name,
  channel,
  priority,
  assigned_agent_id,
  assigned_team,
  first_response_at,
  resolved_at,
  csat_rating,
  labels,
  metadata,
  created_at,
  updated_at
)
SELECT
  'support'::VARCHAR(30) as type,
  -- Map status: snoozed → pending for unified model
  CASE sc.status
    WHEN 'snoozed' THEN 'pending'
    ELSE sc.status::VARCHAR(30)
  END as status,
  'ozean_licht'::VARCHAR(50) as platform,
  c.id as contact_id,
  sc.contact_email,
  sc.contact_name,
  sc.channel::VARCHAR(50),
  sc.priority::VARCHAR(20),
  sc.assigned_agent_id,
  -- Map team: 'general' → 'support' for unified model
  CASE sc.team
    WHEN 'general' THEN 'support'
    ELSE sc.team::VARCHAR(50)
  END as assigned_team,
  sc.first_response_at,
  sc.resolved_at,
  sc.csat_rating,
  sc.labels,
  -- Preserve original chatwoot_id in metadata for reference
  jsonb_build_object(
    'migrated_from', 'support_conversations',
    'chatwoot_id', sc.chatwoot_id,
    'original_metadata', sc.metadata
  ) as metadata,
  sc.created_at,
  sc.updated_at
FROM support_conversations sc
LEFT JOIN contacts c ON c.email = sc.contact_email AND c.platform = 'ozean_licht'
-- Only migrate if not already migrated (check metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM conversations conv
  WHERE conv.type = 'support'
    AND (conv.metadata->>'chatwoot_id')::INTEGER = sc.chatwoot_id
);

-- Step 3: Migrate support_messages to unified messages table
INSERT INTO messages (
  conversation_id,
  sender_type,
  sender_name,
  content,
  content_type,
  is_private,
  attachments,
  created_at
)
SELECT
  conv.id as conversation_id,
  -- Map sender_type: contact stays contact, agent stays agent
  CASE sm.sender_type
    WHEN 'contact' THEN 'contact'
    WHEN 'agent' THEN 'agent'
    WHEN 'bot' THEN 'bot'
    ELSE 'system'
  END::VARCHAR(20) as sender_type,
  sm.sender_name,
  sm.content,
  -- Map message_type to content_type
  CASE sm.message_type
    WHEN 'attachment' THEN 'file'
    WHEN 'template' THEN 'system'
    ELSE 'text'
  END::VARCHAR(30) as content_type,
  sm.is_private,
  '[]'::JSONB as attachments,
  sm.created_at
FROM support_messages sm
JOIN support_conversations sc ON sm.conversation_id = sc.id
JOIN conversations conv ON conv.type = 'support'
  AND (conv.metadata->>'chatwoot_id')::INTEGER = sc.chatwoot_id
-- Only migrate if messages don't already exist for this conversation
WHERE NOT EXISTS (
  SELECT 1 FROM messages m
  WHERE m.conversation_id = conv.id
    AND m.created_at = sm.created_at
    AND m.content = sm.content
);

-- Step 4: Add conversation participants for migrated support conversations
-- Add the assigned agent as a participant
INSERT INTO conversation_participants (
  conversation_id,
  user_id,
  role,
  joined_at
)
SELECT
  conv.id as conversation_id,
  conv.assigned_agent_id as user_id,
  'member'::VARCHAR(30) as role,
  conv.created_at as joined_at
FROM conversations conv
WHERE conv.type = 'support'
  AND conv.assigned_agent_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conv.id
      AND cp.user_id = conv.assigned_agent_id
  );

-- Step 5: Create default team channels if they don't exist
INSERT INTO conversations (
  type,
  status,
  platform,
  title,
  slug,
  description,
  is_private,
  created_at,
  updated_at
)
SELECT
  'team_channel'::VARCHAR(30),
  'active'::VARCHAR(30),
  'ozean_licht'::VARCHAR(50),
  c.title,
  c.slug,
  c.description,
  c.is_private,
  NOW(),
  NOW()
FROM (VALUES
  ('General', 'general', 'General team discussion', FALSE),
  ('Development', 'dev', 'Development team channel', FALSE),
  ('Support', 'support', 'Support team channel', FALSE),
  ('Announcements', 'announcements', 'Important announcements', FALSE)
) AS c(title, slug, description, is_private)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify migration success:

-- Check conversation counts by type
-- SELECT type, status, COUNT(*) FROM conversations GROUP BY type, status ORDER BY type;

-- Check message counts
-- SELECT COUNT(*) as message_count FROM messages;

-- Check contacts created
-- SELECT COUNT(*) as contact_count FROM contacts;

-- Verify no data loss (should match original counts)
-- SELECT
--   (SELECT COUNT(*) FROM support_conversations) as original_conversations,
--   (SELECT COUNT(*) FROM conversations WHERE type = 'support') as migrated_conversations,
--   (SELECT COUNT(*) FROM support_messages) as original_messages,
--   (SELECT COUNT(*) FROM messages m JOIN conversations c ON m.conversation_id = c.id WHERE c.type = 'support') as migrated_messages;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_next_ticket_number IS 'Migrated from 025_unified_conversations.sql - generates ticket numbers';

COMMIT;
