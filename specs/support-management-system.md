# Plan: Unified Messaging System - Native Evolution

## Task Description

Build a unified conversational messaging system for Ozean Licht that handles ALL communication types in one interface: customer support, team channels, direct messages, and internal tickets. This follows the "Facebook Messenger" vision where one inbox shows everything, differentiated by conversation type rather than separate systems.

## Objective

When complete, the messaging system will provide:
1. **One Unified Inbox** - All conversation types in a single interface
2. **Four Conversation Types:**
   - Support Tickets (Customer → Support Agent)
   - Team Channels (Internal broadcast like Slack #general)
   - Direct Messages (1:1 team member chat)
   - Internal Tickets (Team → Dev/Tech escalation)
3. **Real-Time Messaging** - Instant delivery via Soketi WebSocket
4. **Multi-Channel Notifications** - Push, email, in-app with preferences
5. **File Sharing** - MinIO-backed attachments with previews
6. **Embeddable Widget** - Customer-facing chat with offline support
7. **AI-Powered Assistance** - Claude-powered suggestions and routing

---

## The Vision: One UI, Multiple Conversation Types

```
+-------------------------------------------------------------+
|  Trinity Studio Admin                                        |
+----------+--------------------------------------------------+
|          |   +---------------+------------------------+      |
| Sidebar  |   | All Messages  | Conversation Thread    |      |
|          |   |               |                        |      |
| Dashboard|   | TEAM CHANNELS | [Message bubbles]      |      |
| Projects |   |   # general   |                        |      |
| -------- |   |   # dev       |                        |      |
| Messages |   |               |                        |      |
|  ► All   |   | SUPPORT       |                        |      |
|  ► Team  |   |   Max S.      |                        |      |
|  ► Support|  |   Anna K.     | +------------------+   |      |
|  ► Internal| |               | | Type message...  |   |      |
|          |   | INTERNAL      | +------------------+   |      |
|          |   |   DEV-042     |                        |      |
|          |   |   TECH-018    |                        |      |
|          |   +---------------+------------------------+      |
+----------+--------------------------------------------------+
```

**Key Insight:** This is NOT "support system + team chat bolted on later." It's ONE messaging system with different conversation types from the start.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Admin Inbox    │  Chat Widget    │  Mobile (Future)            │
│  (React)        │  (Embeddable)   │                             │
└────────┬────────┴────────┬────────┴─────────────────────────────┘
         │                 │
         ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REAL-TIME LAYER                            │
│                        (Soketi)                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Messages    │  │ Presence    │  │ Typing      │              │
│  │ Channel     │  │ Channel     │  │ Events      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER                                 │
│                    (Next.js API Routes)                         │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  /api/messaging │  /api/upload    │  /api/notifications         │
│  - conversations│  - files        │  - push                     │
│  - messages     │  - images       │  - preferences              │
│  - participants │  - attachments  │  - subscriptions            │
└────────┬────────┴────────┬────────┴────────┬────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│   PostgreSQL    │ │     MinIO       │ │   Notification Workers  │
│   (Database)    │ │ (File Storage)  │ │   (Push/Email/Webhook)  │
└─────────────────┘ └─────────────────┘ └─────────────────────────┘
```

---

## Conversation Types

### 1. Support Tickets (`type: 'support'`)
**Flow:** Customer → Support Agent → (Optional: Escalate to Internal Ticket)

| Field | Value |
|-------|-------|
| Participants | Contact + Assigned Agent(s) |
| Source | Web widget, WhatsApp, Telegram, Email |
| Visibility | Assigned agents only |
| Features | Customer context, AI suggestions, CSAT |

### 2. Team Channels (`type: 'team_channel'`)
**Flow:** Team Member ↔ Team Members (broadcast)

| Field | Value |
|-------|-------|
| Participants | All channel members |
| Examples | #general, #dev, #support, #announcements |
| Visibility | Channel members |
| Features | @mentions, threads, pins |

### 3. Direct Messages (`type: 'direct_message'`)
**Flow:** Team Member ↔ Team Member (1:1)

| Field | Value |
|-------|-------|
| Participants | Exactly 2 team members |
| Visibility | Only the 2 participants |
| Features | Private, no external visibility |

### 4. Internal Tickets (`type: 'internal_ticket'`)
**Flow:** Requester → Team (Dev, Tech, Admin)

| Field | Value |
|-------|-------|
| Participants | Requester + Assigned team/person |
| Examples | Support → Dev (bug report), Team → Tech (access request) |
| Visibility | Requester + assigned team |
| Features | Priority, status tracking, linked support ticket |

**Internal Ticket Use Cases:**
```
┌─────────────────────────────────────────────────────────────┐
│ Support Agent handling customer ticket discovers a bug      │
│                          ↓                                  │
│ Creates Internal Ticket: "DEV-042: Login fails for users   │
│ with special characters in email"                          │
│                          ↓                                  │
│ Links to original support conversation for context         │
│                          ↓                                  │
│ Dev team sees ticket, investigates, resolves               │
│                          ↓                                  │
│ Agent notified, updates customer                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phases 1-5: Foundation (COMPLETED)

**Status:** Complete as of 2025-12-04

Built Chatwoot-based support system with:
- Database schema for support conversations and messages
- Admin inbox UI with customer context panel
- Knowledge base with rich text editor
- Analytics dashboard
- Channel configuration UI

**Note:** Phase 4 has uncommitted work (QuickResponses, RoutingSuggestions) that needs to be committed.

---

### Phase 6: Unified Data Model (COMPLETED)

**Status:** Complete as of 2025-12-05

Migrated from fragmented support tables to unified conversation model:
- Single `conversations` table handles all types (support, team_channel, direct_message, internal_ticket)
- Auto-generated ticket numbers (DEV-001, TECH-002, etc.)
- Full type definitions in `types/messaging.ts`
- Database modules: `conversations.ts`, `messages.ts`, `participants.ts`, `internal-tickets.ts`
- Data migration script ready for existing support data

---

### Phase 6 Schema Reference (Implementation Details)

#### Schema Design Decision

**Approach: Single Table with Nullable Type-Specific Fields**

We use one `conversations` table with ~25 columns where some fields only apply to certain types. This is pragmatic because:

| Approach | Pros | Cons |
|----------|------|------|
| **Single table (chosen)** | No JOINs, simple queries, easy migrations | Nullable fields, some waste |
| Extension tables | Cleaner normalization | JOIN complexity, harder queries |

The tradeoff is acceptable given:
- 4 conversation types isn't extreme
- Most queries filter by type anyway
- Simpler application code

#### Database Schema

```sql
-- Migration 025: Unified conversations

-- =====================================================
-- UNIFIED CONVERSATIONS TABLE
-- =====================================================
-- Design: Single table with type-specific nullable fields
-- Rationale: Avoids JOIN complexity, simpler queries
-- Tradeoff: ~8 nullable columns per type, acceptable for 4 types
-- =====================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- === SHARED FIELDS (all types) ===
  type VARCHAR(30) NOT NULL,  -- 'support', 'team_channel', 'direct_message', 'internal_ticket'
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  platform VARCHAR(50) DEFAULT 'ozean_licht',
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- === SUPPORT TICKET FIELDS ===
  -- Used when: type = 'support'
  contact_id UUID REFERENCES contacts(id),
  contact_email VARCHAR(255),
  contact_name VARCHAR(255),
  channel VARCHAR(50),           -- 'web_widget', 'whatsapp', 'telegram', 'email'
  priority VARCHAR(20),          -- 'low', 'normal', 'high', 'urgent'
  assigned_agent_id UUID REFERENCES admin_users(id),
  assigned_team VARCHAR(50),     -- 'support', 'dev', 'tech', 'admin', 'spiritual'
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  csat_rating INTEGER,
  labels TEXT[],

  -- === TEAM CHANNEL FIELDS ===
  -- Used when: type = 'team_channel'
  title VARCHAR(255),            -- Channel name: "general", "dev"
  slug VARCHAR(255) UNIQUE,      -- URL-safe: "general", "dev"
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,

  -- === INTERNAL TICKET FIELDS ===
  -- Used when: type = 'internal_ticket'
  ticket_number VARCHAR(20),     -- Auto-generated: 'DEV-042', 'TECH-018'
  requester_id UUID REFERENCES admin_users(id),
  linked_conversation_id UUID REFERENCES conversations(id),
  -- Also uses: priority, assigned_agent_id, assigned_team, status, labels

  -- === DIRECT MESSAGE FIELDS ===
  -- Used when: type = 'direct_message'
  -- Uses: participants table only, minimal fields needed

  -- === METADATA ===
  metadata JSONB DEFAULT '{}'    -- Extensible for future needs
);

-- Type-specific status constraints
-- support: 'open', 'pending', 'resolved', 'closed'
-- team_channel: 'active', 'archived'
-- direct_message: 'active'
-- internal_ticket: 'open', 'in_progress', 'resolved', 'closed'

-- =====================================================
-- CONVERSATION PARTICIPANTS
-- =====================================================
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Participant identity (one of these)
  user_id UUID REFERENCES admin_users(id),  -- Team members
  contact_id UUID REFERENCES contacts(id),   -- External customers

  -- Membership
  role VARCHAR(30) DEFAULT 'member',  -- 'owner', 'admin', 'member', 'observer'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,

  -- Read tracking
  last_read_at TIMESTAMPTZ,
  last_read_message_id UUID,
  unread_count INTEGER DEFAULT 0,

  -- Notification preferences (per-conversation override)
  notifications_enabled BOOLEAN DEFAULT TRUE,
  notify_all_messages BOOLEAN DEFAULT TRUE,      -- vs mentions only
  notify_sound_enabled BOOLEAN DEFAULT TRUE,

  UNIQUE(conversation_id, user_id),
  UNIQUE(conversation_id, contact_id)
);

-- =====================================================
-- UNIFIED MESSAGES TABLE
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Sender
  sender_type VARCHAR(20) NOT NULL,  -- 'agent', 'contact', 'bot', 'system'
  sender_id UUID,
  sender_name VARCHAR(255),

  -- Content
  content TEXT,
  content_type VARCHAR(30) DEFAULT 'text',  -- 'text', 'image', 'file', 'system'

  -- Threading
  thread_id UUID REFERENCES messages(id),
  reply_count INTEGER DEFAULT 0,

  -- Visibility
  is_private BOOLEAN DEFAULT FALSE,  -- Internal notes (yellow background)

  -- Mentions (user IDs mentioned with @)
  mentions UUID[],

  -- Attachments (stored in MinIO)
  attachments JSONB DEFAULT '[]',
  -- Schema: [{ id, type, name, size, mimeType, url, thumbnailUrl }]

  -- External channel tracking
  external_id VARCHAR(255),
  external_status VARCHAR(30),  -- 'sent', 'delivered', 'read', 'failed'

  -- AI metadata
  sentiment JSONB,
  intent VARCHAR(50),

  -- Edit/Delete
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTACTS (External customers)
-- =====================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  email VARCHAR(255),
  phone VARCHAR(50),
  name VARCHAR(255),
  avatar_url TEXT,

  -- Platform user link (if they have an account)
  user_id UUID,

  -- Channel identifiers
  whatsapp_id VARCHAR(255),
  telegram_id VARCHAR(255),

  -- Custom data
  custom_attributes JSONB DEFAULT '{}',

  -- Status
  blocked BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMPTZ,

  platform VARCHAR(50) DEFAULT 'ozean_licht',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(email, platform),
  UNIQUE(phone, platform)
);

-- =====================================================
-- INTERNAL TICKET SEQUENCES
-- =====================================================
CREATE TABLE ticket_sequences (
  prefix VARCHAR(10) PRIMARY KEY,
  next_number INTEGER DEFAULT 1
);

INSERT INTO ticket_sequences (prefix, next_number) VALUES
  ('DEV', 1), ('TECH', 1), ('ADMIN', 1), ('SUP', 1);

CREATE OR REPLACE FUNCTION get_next_ticket_number(p_prefix VARCHAR)
RETURNS VARCHAR AS $$
DECLARE v_number INTEGER;
BEGIN
  UPDATE ticket_sequences SET next_number = next_number + 1
  WHERE prefix = p_prefix RETURNING next_number - 1 INTO v_number;
  RETURN p_prefix || '-' || LPAD(v_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'internal_ticket' AND NEW.ticket_number IS NULL THEN
    NEW.ticket_number := get_next_ticket_number(
      CASE NEW.assigned_team
        WHEN 'dev' THEN 'DEV'
        WHEN 'tech' THEN 'TECH'
        ELSE 'ADMIN'
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_ticket_number BEFORE INSERT ON conversations
FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- =====================================================
-- PRESENCE & TYPING
-- =====================================================
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES admin_users(id),
  status VARCHAR(20) DEFAULT 'offline',  -- 'online', 'away', 'busy', 'offline'
  status_text VARCHAR(255),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  current_conversation_id UUID REFERENCES conversations(id)
);

CREATE TABLE typing_indicators (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name VARCHAR(255),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 seconds',
  PRIMARY KEY (conversation_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_platform ON conversations(platform);
CREATE INDEX idx_conversations_assigned ON conversations(assigned_agent_id);
CREATE INDEX idx_conversations_contact ON conversations(contact_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE INDEX idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_participants_contact ON conversation_participants(contact_id);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_user ON contacts(user_id);

-- Auto-update conversation timestamp on new message
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_updates_conversation
AFTER INSERT ON messages FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Auto-increment unread counts for participants
CREATE OR REPLACE FUNCTION increment_unread_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
    -- Don't increment for the sender
    AND (user_id IS DISTINCT FROM NEW.sender_id OR NEW.sender_type != 'agent')
    -- Don't increment if they've read past this message
    AND (last_read_at IS NULL OR last_read_at < NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_unread_on_message
AFTER INSERT ON messages FOR EACH ROW
EXECUTE FUNCTION increment_unread_counts();

-- Reset unread count when user reads conversation
CREATE OR REPLACE FUNCTION reset_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_read_at IS DISTINCT FROM OLD.last_read_at THEN
    NEW.unread_count := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reset_unread_on_read
BEFORE UPDATE ON conversation_participants FOR EACH ROW
EXECUTE FUNCTION reset_unread_count();
```

#### Type Definitions

```typescript
// types/messaging.ts

export type ConversationType =
  | 'support'
  | 'team_channel'
  | 'direct_message'
  | 'internal_ticket';

export type ConversationStatus =
  | 'active' | 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed' | 'archived';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type AssignedTeam = 'support' | 'dev' | 'tech' | 'admin' | 'spiritual';

export interface Conversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  platform: 'ozean_licht' | 'kids_ascension';

  // Support fields
  contactId: string | null;
  contactEmail: string | null;
  contactName: string | null;
  contact?: Contact;
  channel: string | null;
  priority: Priority | null;
  assignedAgentId: string | null;
  assignedAgent?: AdminUser;
  assignedTeam: AssignedTeam | null;
  firstResponseAt: Date | null;
  resolvedAt: Date | null;
  csatRating: number | null;
  labels: string[];

  // Channel fields
  title: string | null;
  slug: string | null;
  description: string | null;
  isPrivate: boolean;
  isArchived: boolean;

  // Internal ticket fields
  ticketNumber: string | null;
  requesterId: string | null;
  requester?: AdminUser;
  linkedConversationId: string | null;
  linkedConversation?: Conversation;

  // Computed
  unreadCount?: number;
  messageCount?: number;
  participantCount?: number;
  lastMessage?: Message;

  // Timestamps
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  messages?: Message[];
  participants?: Participant[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'agent' | 'contact' | 'bot' | 'system';
  senderId: string | null;
  senderName: string | null;
  content: string | null;
  contentType: 'text' | 'image' | 'file' | 'system';
  threadId: string | null;
  replyCount: number;
  isPrivate: boolean;
  mentions: string[];
  attachments: Attachment[];
  externalId: string | null;
  externalStatus: 'sent' | 'delivered' | 'read' | 'failed' | null;
  sentiment?: SentimentScore;
  intent?: string;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  name: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;  // For images/videos
}
```

**Deliverables:**
- Migration 025 with unified schema
- `lib/db/conversations.ts` - CRUD for all types
- `lib/db/messages.ts` - Unified message operations
- `lib/db/participants.ts` - Membership management
- `lib/db/internal-tickets.ts` - Ticket-specific operations
- `types/messaging.ts` - Complete type definitions
- Data migration from existing support tables

---

### Phase 7: Real-Time Infrastructure & Notifications
**Duration:** 4-5 days | **Priority:** Critical

Real-time message delivery AND notification system (combined for efficiency).

#### WebSocket Architecture: Soketi

**Decision: Deploy dedicated Soketi via Coolify + Cloudflare**

Deploy a separate Soketi instance through Coolify's service catalog with Cloudflare handling SSL termination.

| Option | Pros | Cons |
|--------|------|------|
| **Dedicated Soketi + Cloudflare (chosen)** | Isolated, SSL via Cloudflare, DDoS protection | One more container |
| Coolify's internal Soketi | Already running | May conflict with updates, unsupported |
| Polling + SSE | No WebSocket needed | Higher latency |

**Production Setup (Completed):**

```
Client (wss://realtime.ozean-licht.dev)
    ↓
Cloudflare (SSL termination, port 443)
    ↓
Coolify Proxy (Traefik)
    ↓
Soketi Container (port 6005)
```

**Soketi Compose Configuration:**
```yaml
services:
  soketi:
    image: 'quay.io/soketi/soketi:1.6-16-debian'
    ports:
      - '6005:6005'
    environment:
      - 'SOKETI_PORT=6005'
      - 'SOKETI_DEBUG=0'
      - 'SOKETI_DEFAULT_APP_ID=${SERVICE_USER_SOKETI}'
      - 'SOKETI_DEFAULT_APP_KEY=${SERVICE_REALBASE64_64_SOKETIKEY}'
      - 'SOKETI_DEFAULT_APP_SECRET=${SERVICE_REALBASE64_64_SOKETISECRET}'
      - 'SOKETI_DEFAULT_APP_ENABLE_CLIENT_MESSAGES=true'
```

**Domain:** `realtime.ozean-licht.dev` (Cloudflare proxied, orange cloud)

#### Channel Patterns

```
private-conversation-{id}     // Message events for a conversation
private-user-{userId}         // Personal notifications
presence-inbox                // Who's online in inbox
presence-conversation-{id}    // Who's viewing a conversation
```

#### Notification System

**Three Notification Channels:**

| Channel | Use Case | Implementation |
|---------|----------|----------------|
| **In-App** | Real-time while app open | Soketi → React state |
| **Push** | Browser/mobile when away | Web Push API |
| **Email** | Offline fallback | Resend/SMTP |

**Notification Database Schema:**

```sql
-- Add to Migration 025

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id),

  -- What triggered it
  type VARCHAR(50) NOT NULL,
  -- 'new_message', 'mention', 'assignment', 'ticket_update', 'reply_to_thread'

  -- Reference
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),

  -- Content
  title VARCHAR(255) NOT NULL,
  body TEXT,
  action_url VARCHAR(500),

  -- Delivery status
  read_at TIMESTAMPTZ,
  push_sent_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- =====================================================
-- NOTIFICATION PREFERENCES
-- =====================================================
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES admin_users(id),

  -- Global toggles
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,

  -- Per-type settings (JSONB for flexibility)
  type_settings JSONB DEFAULT '{
    "new_message": { "push": true, "email": false },
    "mention": { "push": true, "email": true },
    "assignment": { "push": true, "email": true },
    "ticket_update": { "push": false, "email": true }
  }',

  -- Quiet hours
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME,  -- e.g., '22:00'
  quiet_hours_end TIME,    -- e.g., '08:00'
  quiet_hours_timezone VARCHAR(50) DEFAULT 'Europe/Vienna',

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PUSH SUBSCRIPTIONS
-- =====================================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id),

  -- Web Push subscription object
  endpoint TEXT NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,

  -- Metadata
  user_agent TEXT,
  device_name VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,

  UNIQUE(user_id, endpoint)
);
```

**Notification Flow:**

```typescript
// lib/notifications/dispatcher.ts

export async function dispatchNotification(notification: CreateNotificationInput) {
  const { userId, type, conversationId, messageId, title, body } = notification;

  // 1. Check user preferences
  const prefs = await getNotificationPreferences(userId);
  const typeSettings = prefs.typeSettings[type];

  // 2. Check quiet hours
  if (isQuietHours(prefs)) {
    // Queue for later or skip based on priority
    return;
  }

  // 3. Store notification
  const notif = await createNotification(notification);

  // 4. Real-time (always if online)
  await publishToSoketi(`private-user-${userId}`, 'notification', notif);

  // 5. Push notification (if enabled and user offline)
  if (typeSettings.push && prefs.pushEnabled) {
    const presence = await getUserPresence(userId);
    if (presence.status === 'offline') {
      await sendPushNotification(userId, { title, body, url: notif.actionUrl });
    }
  }

  // 6. Email (if enabled, with delay to allow reading in-app)
  if (typeSettings.email && prefs.emailEnabled) {
    // Queue email to send in 5 minutes if still unread
    await queueDelayedEmail(notif.id, 5 * 60 * 1000);
  }
}

// lib/notifications/queue.ts
import { Queue, Worker } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

// Queue for delayed email notifications
export const emailQueue = new Queue('email-notifications', { connection });

// Queue delayed email (sends after delay if notification still unread)
export async function queueDelayedEmail(notificationId: string, delayMs: number) {
  await emailQueue.add(
    'send-if-unread',
    { notificationId },
    {
      delay: delayMs,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    }
  );
}

// lib/notifications/worker.ts
import { Worker } from 'bullmq';

const emailWorker = new Worker(
  'email-notifications',
  async (job) => {
    const { notificationId } = job.data;

    // Check if still unread
    const notification = await getNotificationById(notificationId);
    if (!notification || notification.readAt) {
      return { skipped: true, reason: 'already read' };
    }

    // Send email
    await sendEmailNotification(notification);
    await markEmailSent(notificationId);

    return { sent: true };
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on('completed', (job, result) => {
  console.log(`Email job ${job.id} completed:`, result);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

// Start worker: Run as separate process or in Next.js instrumentation.ts
// Option 1: `node dist/worker.js` as separate Coolify service
// Option 2: Import in instrumentation.ts for single-process deployment
```

**@Mention Notification Routing:**

```typescript
// lib/messaging/mentions.ts

export function extractMentions(content: string): string[] {
  // Match @username or @[User Name]
  const mentionRegex = /@(\w+)|@\[([^\]]+)\]/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1] || match[2]);
  }

  return mentions;
}

export async function notifyMentions(message: Message, mentionedUserIds: string[]) {
  for (const userId of mentionedUserIds) {
    await dispatchNotification({
      userId,
      type: 'mention',
      conversationId: message.conversationId,
      messageId: message.id,
      title: `${message.senderName} mentioned you`,
      body: truncate(message.content, 100),
      actionUrl: `/dashboard/messages/${message.conversationId}#${message.id}`,
    });
  }
}
```

**Deliverables:**
- ~~Deploy dedicated Soketi via Coolify~~ ✅ DONE (`realtime.ozean-licht.dev`)
- Pusher client/server integration
- Notification database tables
- Notification preferences UI
- Push subscription management
- BullMQ queue for delayed emails
- Email worker process (separate service or instrumentation.ts)
- @mention extraction and routing
- Quiet hours support

---

### Phase 8: File Handling & Attachments
**Duration:** 2-3 days | **Priority:** High

MinIO-backed file uploads with previews and size limits.

#### Storage Architecture

```
MinIO Bucket: messaging-attachments
├── conversations/
│   ├── {conversationId}/
│   │   ├── {messageId}/
│   │   │   ├── original/
│   │   │   │   └── document.pdf
│   │   │   └── thumbnails/
│   │   │       ├── 200x200.jpg
│   │   │       └── 800x800.jpg
```

#### Configuration

```typescript
// lib/storage/messaging-config.ts

export const ATTACHMENT_CONFIG = {
  // Size limits
  maxFileSize: 25 * 1024 * 1024,        // 25 MB
  maxImageSize: 10 * 1024 * 1024,       // 10 MB
  maxTotalPerMessage: 50 * 1024 * 1024, // 50 MB total

  // Allowed types
  allowedMimeTypes: [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Archives
    'application/zip',
    // Audio/Video
    'audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm',
  ],

  // Thumbnail settings
  thumbnailSizes: [
    { name: 'small', width: 200, height: 200 },
    { name: 'medium', width: 800, height: 800 },
  ],

  // Presigned URL expiry
  uploadUrlExpiry: 60 * 5,      // 5 minutes
  downloadUrlExpiry: 60 * 60,   // 1 hour
};
```

#### Upload Flow

```typescript
// app/api/messaging/attachments/upload/route.ts

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return unauthorized();

  const { conversationId, fileName, fileSize, mimeType } = await req.json();

  // 1. Validate
  if (fileSize > ATTACHMENT_CONFIG.maxFileSize) {
    return Response.json({ error: 'File too large' }, { status: 400 });
  }
  if (!ATTACHMENT_CONFIG.allowedMimeTypes.includes(mimeType)) {
    return Response.json({ error: 'File type not allowed' }, { status: 400 });
  }

  // 2. Check user has access to conversation
  const hasAccess = await checkConversationAccess(conversationId, session.user.id);
  if (!hasAccess) return forbidden();

  // 3. Generate file path and presigned URL
  const fileId = generateUUID();
  const filePath = `conversations/${conversationId}/${fileId}/original/${fileName}`;

  const uploadUrl = await getPresignedUploadUrl({
    bucket: 'messaging-attachments',
    key: filePath,
    expiresIn: ATTACHMENT_CONFIG.uploadUrlExpiry,
    contentType: mimeType,
    maxSize: ATTACHMENT_CONFIG.maxFileSize,
  });

  // 4. Return upload instructions
  return Response.json({
    fileId,
    uploadUrl,
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
    },
    // Client will call /confirm after upload
    confirmUrl: `/api/messaging/attachments/${fileId}/confirm`,
  });
}
```

```typescript
// app/api/messaging/attachments/[fileId]/confirm/route.ts

export async function POST(req: Request, { params }: { params: { fileId: string } }) {
  const { conversationId, fileName, fileSize, mimeType } = await req.json();

  // 1. Verify file exists in MinIO
  const exists = await checkFileExists('messaging-attachments', filePath);
  if (!exists) {
    return Response.json({ error: 'File not uploaded' }, { status: 400 });
  }

  // 2. Generate thumbnails for images
  let thumbnailUrl: string | undefined;
  if (mimeType.startsWith('image/')) {
    thumbnailUrl = await generateThumbnails(params.fileId, filePath);
  }

  // 3. Return attachment object for message
  const downloadUrl = await getPresignedDownloadUrl({
    bucket: 'messaging-attachments',
    key: filePath,
    expiresIn: ATTACHMENT_CONFIG.downloadUrlExpiry,
  });

  return Response.json({
    attachment: {
      id: params.fileId,
      type: mimeType.startsWith('image/') ? 'image' : 'file',
      name: fileName,
      size: fileSize,
      mimeType,
      url: downloadUrl,
      thumbnailUrl,
    },
  });
}
```

#### Thumbnail Generation

```typescript
// lib/storage/thumbnails.ts
import sharp from 'sharp';

export async function generateThumbnails(fileId: string, originalPath: string): Promise<string> {
  const originalBuffer = await downloadFromMinIO('messaging-attachments', originalPath);

  for (const size of ATTACHMENT_CONFIG.thumbnailSizes) {
    const thumbnail = await sharp(originalBuffer)
      .resize(size.width, size.height, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailPath = originalPath.replace(
      '/original/',
      `/thumbnails/${size.width}x${size.height}.jpg`
    );

    await uploadToMinIO('messaging-attachments', thumbnailPath, thumbnail);
  }

  // Return small thumbnail URL
  const smallThumbPath = originalPath.replace('/original/', '/thumbnails/200x200.jpg');
  return await getPresignedDownloadUrl({
    bucket: 'messaging-attachments',
    key: smallThumbPath,
    expiresIn: ATTACHMENT_CONFIG.downloadUrlExpiry,
  });
}
```

#### Message Composer UI

```tsx
// components/messaging/MessageComposer.tsx

export function MessageComposer({ conversationId, onSend }: Props) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (files: FileList) => {
    setUploading(true);

    for (const file of Array.from(files)) {
      // 1. Get presigned URL
      const { uploadUrl, fileId, confirmUrl } = await fetch('/api/messaging/attachments/upload', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      }).then(r => r.json());

      // 2. Upload directly to MinIO
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // 3. Confirm and get attachment object
      const { attachment } = await fetch(confirmUrl, {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      }).then(r => r.json());

      setAttachments(prev => [...prev, attachment]);
    }

    setUploading(false);
  };

  return (
    <div className="border-t p-4">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-3">
          {attachments.map(att => (
            <AttachmentPreview
              key={att.id}
              attachment={att}
              onRemove={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="w-5 h-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => e.target.files && handleFileSelect(e.target.files)}
        />

        <Input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />

        <Button onClick={handleSend} disabled={uploading || (!content && !attachments.length)}>
          {uploading ? <Spinner /> : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
```

**Deliverables:**
- MinIO bucket configuration
- Presigned upload/download URLs
- Thumbnail generation for images
- File type and size validation
- Attachment preview component
- Drag-and-drop upload support

---

### Phase 9: Unified Inbox UI (COMPLETED)
**Duration:** 4-5 days | **Priority:** High | **Status:** Complete as of 2025-12-05

Build the single inbox that shows all conversation types.

#### Layout

```
+------------------------------------------------------------------+
|  Messages                                        [+ New] [⚙]    |
+------------------------------------------------------------------+
|                                                                   |
|  +-----------+  +-------------------------------------------+    |
|  | Filters   |  | Conversation                               |    |
|  |           |  |                                           |    |
|  | [All]     |  | ┌─────────────────────────────────────┐   |    |
|  | [Team]    |  | │ #dev · 3 members            [···]  │   |    |
|  | [Support] |  | └─────────────────────────────────────┘   |    |
|  | [Internal]|  |                                           |    |
|  |           |  | ┌─────────────────────────────────────┐   |    |
|  +-----------+  | │ 👤 Max: Has anyone seen the new... │   |    |
|                 | │ 10:42 AM                            │   |    |
|  +-----------+  | └─────────────────────────────────────┘   |    |
|  | Convos    |  |                                           |    |
|  |           |  | ┌─────────────────────────────────────┐   |    |
|  | # general |  | │ 👤 Anna: @Max yes, checking now    │   |    |
|  | # dev     |  | │ 10:45 AM                       [📎] │   |    |
|  | ───────── |  | └─────────────────────────────────────┘   |    |
|  | 💬 Max S. |  |                                           |    |
|  |   Login.. |  | ┌─────────────────────────────────────┐   |    |
|  | 💬 Anna K.|  | │ 🔒 [Private Note]                   │   |    |
|  |   Course..|  | │ Need to escalate to dev team        │   |    |
|  | ───────── |  | └─────────────────────────────────────┘   |    |
|  | 🎫 DEV-042|  |                                           |    |
|  |   Bug in..|  | ┌─────────────────────────────────────┐   |    |
|  +-----------+  | │ Type a message...     [/] [📎] [➤] │   |    |
|                 | └─────────────────────────────────────┘   |    |
|                 +-------------------------------------------+    |
+------------------------------------------------------------------+
```

**Deliverables:**
- Unified inbox page with type filters
- Conversation detail view
- Message composer with slash commands
- Context panel (adapts to conversation type)
- Create internal ticket from support
- Create new channel / DM / ticket modals
- Responsive mobile layout

---

### Phase 10: Chat Widget (Customer-Facing)
**Duration:** 4-5 days | **Priority:** High

Embeddable widget for customer support on public sites.

#### Widget Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER WEBSITE                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                      Page Content                         │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                              ┌──────────────┐   │
│                                              │   Widget     │   │
│                                              │   Launcher   │   │
│                                              │     💬       │   │
│                                              └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘

Widget Expanded:
┌─────────────────────────────────────────────────────────────────┐
│                                              ┌──────────────────┐│
│                                              │ Ozean Licht     ││
│                                              │ Support         ││
│                                              │─────────────────││
│                                              │ 👋 Hallo! Wie   ││
│                                              │ können wir      ││
│                                              │ helfen?         ││
│                                              │                 ││
│                                              │ ┌─────────────┐ ││
│                                              │ │ Agent typing│ ││
│                                              │ └─────────────┘ ││
│                                              │                 ││
│                                              │ [Type message]  ││
│                                              │ [📎] [Send]     ││
│                                              └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### Authentication Strategy

```typescript
// Widget supports 3 modes:

// 1. Anonymous (new visitor)
// - Generate session_id stored in localStorage
// - Create contact with session_id
// - Conversations linked to session

// 2. Identified (known user, not logged in)
// - Website calls SDK with user info
// - HMAC signature prevents spoofing
// - Merges with existing contact if email matches

// 3. Authenticated (logged in user)
// - Website passes JWT or session token
// - Widget validates with backend
// - Full user context available
```

```typescript
// Widget SDK - ozean-licht-support.js

interface WidgetConfig {
  platformKey: string;       // Public key for this platform
  platform: 'ozean_licht' | 'kids_ascension';

  // Optional: Identify user
  user?: {
    id?: string;           // Your internal user ID
    email?: string;
    name?: string;
    hmac?: string;         // HMAC(user.email, secret) for verification
  };

  // Optional: Custom attributes
  customAttributes?: Record<string, unknown>;

  // Appearance
  position?: 'left' | 'right';
  primaryColor?: string;
  greeting?: string;
}

// Usage on customer website:
window.OzeanLichtSupport.init({
  platformKey: 'pk_live_xxxxx',
  platform: 'ozean_licht',
  user: {
    email: 'customer@example.com',
    name: 'Max Mustermann',
    hmac: 'computed_hmac_signature',
  },
  customAttributes: {
    plan: 'premium',
    enrolledCourses: ['course-1', 'course-2'],
  },
});
```

#### Conversation Creation Flow

```typescript
// Widget → Backend flow

// 1. Widget initialized
// - Check localStorage for existing session/conversation
// - If found, load existing conversation

// 2. User clicks launcher (no existing conversation)
async function createConversation(config: WidgetConfig) {
  // Find or create contact
  let contact = await findContactBySession(sessionId);

  if (!contact && config.user?.email) {
    // Verify HMAC if provided
    if (config.user.hmac) {
      const expected = hmac(config.user.email, WIDGET_SECRET);
      if (config.user.hmac !== expected) {
        throw new Error('Invalid user signature');
      }
    }

    contact = await findOrCreateContact({
      email: config.user.email,
      name: config.user.name,
      customAttributes: config.customAttributes,
    });
  }

  if (!contact) {
    contact = await createAnonymousContact(sessionId);
  }

  // Create support conversation
  const conversation = await createConversation({
    type: 'support',
    channel: 'web_widget',
    contactId: contact.id,
    platform: config.platform,
    metadata: {
      widgetVersion: SDK_VERSION,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    },
  });

  // Store in localStorage
  localStorage.setItem('ozean_support_conversation', conversation.id);

  return conversation;
}

// 3. User sends first message
// - Conversation already exists
// - Message triggers agent notification
// - AI routing suggests team assignment
```

#### Offline Message Queue

```typescript
// lib/widget/offline-queue.ts

interface QueuedMessage {
  id: string;
  conversationId: string;
  content: string;
  attachments: Attachment[];
  queuedAt: number;
  retryCount: number;
}

class OfflineQueue {
  private queue: QueuedMessage[] = [];
  private db: IDBDatabase | null = null;

  async init() {
    // Use IndexedDB for persistence
    this.db = await openDB('ozean-support', 1, {
      upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id' });
      },
    });

    // Load pending messages
    this.queue = await this.db.getAll('messages');

    // Process queue when online
    window.addEventListener('online', () => this.processQueue());
  }

  async add(message: Omit<QueuedMessage, 'id' | 'queuedAt' | 'retryCount'>) {
    const queuedMessage: QueuedMessage = {
      ...message,
      id: generateUUID(),
      queuedAt: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedMessage);
    await this.db?.put('messages', queuedMessage);

    // Try to send immediately if online
    if (navigator.onLine) {
      await this.processQueue();
    }

    return queuedMessage;
  }

  async processQueue() {
    for (const message of this.queue) {
      try {
        await sendMessage(message.conversationId, {
          content: message.content,
          attachments: message.attachments,
        });

        // Remove from queue on success
        this.queue = this.queue.filter(m => m.id !== message.id);
        await this.db?.delete('messages', message.id);
      } catch (error) {
        message.retryCount++;
        if (message.retryCount > 5) {
          // Give up after 5 retries
          this.queue = this.queue.filter(m => m.id !== message.id);
          await this.db?.delete('messages', message.id);
          console.error('Message failed after 5 retries:', message);
        }
      }
    }
  }
}
```

#### Widget Embed Code

```html
<!-- Embed code for customer websites -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['OzeanLichtSupport']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id='ozean-support-widget';js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','ozeanSupport','https://support.ozean-licht.at/widget.js');

  ozeanSupport('init', {
    platformKey: 'pk_live_xxxxx',
    platform: 'ozean_licht'
  });

  // Optional: Identify logged-in user
  ozeanSupport('identify', {
    email: 'user@example.com',
    name: 'Max Mustermann',
    hmac: 'your_computed_hmac'
  });
</script>
```

#### Widget Bundle Strategy

The widget must be a **separate build artifact** (not part of Next.js bundle) to be embeddable on external sites.

**Directory Structure:**
```
shared/widget/
├── src/
│   ├── Widget.tsx          # Main widget component
│   ├── WidgetLauncher.tsx  # Floating button
│   ├── WidgetFrame.tsx     # Chat window
│   ├── sdk.ts              # Public SDK interface
│   ├── offline-queue.ts    # IndexedDB queue
│   ├── realtime.ts         # Soketi client (widget version)
│   └── index.ts            # Entry point
├── vite.config.ts          # Separate Vite build config
├── package.json            # Widget-specific deps
├── tsconfig.json
└── dist/
    ├── widget.js           # Single IIFE bundle (~50KB gzipped)
    └── widget.css          # Extracted styles
```

**Vite Configuration:**
```typescript
// shared/widget/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OzeanLichtSupport',
      fileName: 'widget',
      formats: ['iife'],  // Single file, no imports
    },
    rollupOptions: {
      // Bundle everything (no external deps)
      external: [],
      output: {
        // Inline all CSS
        assetFileNames: 'widget.[ext]',
      },
    },
    minify: 'terser',
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
```

**Build & Deploy:**
```bash
# Build widget bundle
cd shared/widget && pnpm build

# Deploy to CDN/static hosting
# Widget available at: https://support.ozean-licht.at/widget.js
```

**Deliverables:**
- Widget React component (built separately, bundled for embed)
- Widget SDK (JavaScript IIFE bundle)
- Anonymous/identified/authenticated modes
- HMAC verification for user identity
- Offline message queue with IndexedDB
- Widget customization (colors, position, greeting)
- Pre-chat form (optional email collection)
- Embed code generator in admin settings
- Vite build configuration for standalone bundle

---

### Phase 11: External Channels
**Duration:** 5-6 days | **Priority:** Medium

Native WhatsApp Business and Telegram integration.

**Deliverables:**
- WhatsApp Business API integration
- Telegram Bot integration
- Unified webhook handling
- Delivery status tracking
- Template message support

---

### Phase 12: Public Help Center
**Duration:** 3-4 days | **Priority:** Low

Self-service knowledge base for customers.

**Deliverables:**
- Public /hilfe pages
- Search with autocomplete
- Article feedback
- Contact widget escalation
- SEO optimization

---

## Step by Step Tasks

### 1. Commit Phase 4 Work
- Review QuickResponses and RoutingSuggestions
- Apply migration 023_quick_responses.sql
- Test and commit

### 2. Phase 6: Unified Schema
- Write migration 025
- Create conversations.ts, messages.ts, participants.ts
- Create types/messaging.ts
- Migrate existing support data

### 3. Phase 7: Real-Time + Notifications
- ~~Deploy dedicated Soketi via Coolify~~ ✅ DONE (`wss://realtime.ozean-licht.dev`)
- Add notification tables to migration
- Implement Pusher client/server integration
- Implement notification dispatcher
- Build push subscription management
- Create notification preferences UI
- Set up BullMQ queue with Redis
- Deploy email worker as Coolify service or via instrumentation.ts

### 4. Phase 8: File Handling
- Configure MinIO bucket
- Implement presigned upload flow
- Build thumbnail generation
- Create attachment components

### 5. Phase 9: Unified Inbox UI
- Create /dashboard/messages route
- Build conversation list and thread
- Build message composer
- Implement type filters
- Add escalation flows

### 6. Phase 10: Chat Widget
- Set up shared/widget package with Vite
- Build widget React component
- Create widget SDK (IIFE bundle)
- Implement authentication modes (anonymous, identified, authenticated)
- Build offline queue with IndexedDB
- Create embed code generator
- Deploy widget.js to CDN

### 7. Phases 11-12: Channels + Help Center
- WhatsApp/Telegram adapters
- Public help center pages

### Future: Phase 13 (AI Integration) - DEFERRED
- Add Anthropic SDK (when ready)
- Build suggestion generation
- Implement classification
- Cost tracking

---

## Acceptance Criteria

### Phase 6: Unified Data Model ✅ COMPLETED (2025-12-05)
- [x] Single conversations table handles all types
- [x] Internal tickets auto-generate numbers
- [x] Existing data migrated (migration script ready)
- [x] Type filtering works

**Files Created:**
- `migrations/025_unified_conversations.sql` - Full unified schema
- `migrations/025b_migrate_support_data.sql` - Data migration script
- `types/messaging.ts` - Complete TypeScript types
- `lib/db/conversations.ts` - CRUD for all conversation types
- `lib/db/messages.ts` - Message operations with threading
- `lib/db/participants.ts` - Membership management
- `lib/db/internal-tickets.ts` - Ticket-specific operations

### Phase 7: Real-Time + Notifications (NOT IMPLEMENTED)
**Status:** Pending - Using polling fallback (30s interval) until implemented

- [ ] Messages appear instantly (<200ms)
- [ ] Typing indicators work
- [ ] Push notifications delivered
- [ ] Email sent for offline users
- [ ] @mentions route correctly
- [ ] Quiet hours respected

**Note:** Soketi server deployed at `realtime.ozean-licht.dev` but client integration not yet done. Currently using `useConversationPolling.ts` as temporary solution.

### Phase 8: File Handling & Attachments ✅ COMPLETED (2025-12-05)
- [x] Files upload to MinIO via presigned URLs
- [x] Thumbnails generated for images (200x200, 400x400, 800x800)
- [x] Size limits enforced (25MB files, 10MB images, 50MB total per message)
- [x] Presigned URLs work (5 min upload, 1 hour download)
- [x] Drag-and-drop file upload support
- [x] Attachment preview components

**Files Created:**
- `lib/storage/messaging-config.ts` - Attachment configuration (size limits, MIME types, helpers)
- `lib/storage/thumbnails.ts` - Thumbnail generation with sharp
- `app/api/messaging/attachments/upload/route.ts` - Presigned URL generation endpoint
- `app/api/messaging/attachments/[fileId]/confirm/route.ts` - Upload confirmation with thumbnails
- `components/messaging/AttachmentPreview.tsx` - File attachment preview component
- `components/messaging/MessageComposer.tsx` - Message composition with attachments
- `components/messaging/FileDropzone.tsx` - Drag-and-drop file upload wrapper
- `components/messaging/index.ts` - Component exports

### Phase 9: Unified Inbox UI ✅ COMPLETED (2025-12-05)
- [x] All types in one view (support, channels, DMs, internal tickets)
- [x] Escalation flow works (support → internal ticket)
- [x] Mobile responsive layout
- [x] Type filter tabs (All, Team, Support, DMs, Tickets)
- [x] Context panel adapts to conversation type

**Files Created/Modified:**
- `components/messages/TypeFilterTabs.tsx` - Filter tabs for unified inbox
- `components/messages/ContextPanel.tsx` - Adaptive context panel by type
- `components/messages/NewTicketModal.tsx` - Create internal tickets modal
- `components/messages/EscalateToTicketButton.tsx` - Escalation from support to ticket
- `components/messages/ConversationSidebar.tsx` - Added support ticket section
- `app/dashboard/messages/inbox/page.tsx` - Unified inbox page
- `app/dashboard/messages/MessagesPageClient.tsx` - Full unified inbox features
- `app/api/messages/tickets/route.ts` - Internal tickets API

### Phase 10: Chat Widget (Customer-Facing) ✅ COMPLETED (2025-12-05)
- [x] Widget SDK with embeddable IIFE bundle
- [x] Anonymous session management with localStorage
- [x] Identified user verification with optional HMAC
- [x] Offline message queue with IndexedDB persistence
- [x] Real-time messaging via Soketi/Pusher
- [x] Widget API endpoints for public conversations
- [x] Embed code generator in admin settings

**Files Created:**

Widget Package (`shared/widget/`):
- `package.json` - Vite-based IIFE bundle configuration
- `vite.config.ts` - Build config for standalone widget.js
- `src/types.ts` - Widget types (WidgetConfig, Message, Attachment, etc.)
- `src/api.ts` - WidgetAPIClient for backend communication
- `src/realtime.ts` - RealtimeClient for Soketi WebSocket
- `src/offline-queue.ts` - OfflineQueue with IndexedDB persistence
- `src/index.ts` - Main entry point with global SDK API
- `src/components/Widget.tsx` - Main orchestrating component
- `src/components/WidgetLauncher.tsx` - Floating action button
- `src/components/WidgetFrame.tsx` - Chat window container
- `src/components/MessageList.tsx` - Message display with auto-scroll
- `src/components/MessageComposer.tsx` - Input with attachments

Widget API Endpoints (`apps/admin/app/api/widget/`):
- `conversations/route.ts` - Create/get widget conversations
- `conversations/[id]/messages/route.ts` - Send/receive messages
- `attachments/upload/route.ts` - Presigned upload URLs
- `attachments/[fileId]/confirm/route.ts` - Confirm uploads
- `identify/route.ts` - User identification with HMAC

Admin Components:
- `components/support/WidgetEmbedGenerator.tsx` - Embed code generator UI

---

## Future Phases (Deferred)

### Phase 11: AI Integration (DEFERRED)
**Duration:** 4-5 days | **Priority:** Low | **Status:** Moved to future backlog

Integrate Claude for intelligent support assistance. Deferred until core real-time messaging (Phase 7) is complete and stable.

**Capabilities:**
- Response suggestions
- Intent classification
- Sentiment analysis
- Smart routing
- Knowledge article semantic search

**Deliverables:**
- Claude API integration
- Suggestion panel in conversation view
- Intent/sentiment badges
- AI routing recommendations
- Cost tracking and budgets

---

## Validation Commands

```bash
# TypeScript
npm run typecheck --filter admin

# Build
npm run build --filter admin

# Test Soketi
wscat -c ws://soketi.ozean-licht.dev:6001/app/your-key

# Test Widget
curl https://support.ozean-licht.at/widget.js

# Test Upload
curl -X POST http://localhost:3000/api/messaging/attachments/upload \
  -H "Authorization: Bearer token" \
  -d '{"conversationId":"uuid","fileName":"test.pdf","fileSize":1000,"mimeType":"application/pdf"}'
```

---

## Environment Variables

```env
# Soketi (dedicated instance via Coolify + Cloudflare SSL)
# WebSocket URL: wss://realtime.ozean-licht.dev/app/<APP_KEY>
NEXT_PUBLIC_SOKETI_HOST=realtime.ozean-licht.dev
NEXT_PUBLIC_SOKETI_PORT=443
NEXT_PUBLIC_SOKETI_USE_TLS=true
NEXT_PUBLIC_SOKETI_APP_KEY=ZWxsR3hPMU1jNnoxTGdNVHo2Zm1veDFVOW15dVJGS3FVSlREWUVhSnBvdmVYcW5BRTU5bWxSa1BhWktkaXpLaA==

# Soketi - Server-side only
SOKETI_HOST=realtime.ozean-licht.dev
SOKETI_PORT=443
SOKETI_USE_TLS=true
SOKETI_APP_ID=Aw0mUSRkqlY8p4ym
SOKETI_APP_KEY=ZWxsR3hPMU1jNnoxTGdNVHo2Zm1veDFVOW15dVJGS3FVSlREWUVhSnBvdmVYcW5BRTU5bWxSa1BhWktkaXpLaA==
SOKETI_APP_SECRET=MTV5bTJaTlF2WXBlUHVYNXZ6emFHOEtmZ2Z3RE1jWHZuSkRWd0dWZk9VMGZDVVJpc1FFVXkyOUNGSTNobGFQWA==

# Redis (for BullMQ - using existing exposed Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
# Container: lw0ws0kwsw4ko4kg4o8o40os (Redis 7, exposed on 0.0.0.0:6379)

# MinIO (existing)
MINIO_ENDPOINT=minio.ozean-licht.dev
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET_ATTACHMENTS=messaging-attachments

# Push Notifications
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:support@ozean-licht.at

# Email
RESEND_API_KEY=...

# Widget
WIDGET_HMAC_SECRET=...

# Claude AI
CLAUDE_API_KEY=...
```

---

## Dependencies

```bash
# Real-time
pnpm add --filter admin pusher-js pusher

# Job queue (uses Soketi's Redis)
pnpm add --filter admin bullmq

# Push notifications
pnpm add --filter admin web-push
pnpm add -D --filter admin @types/web-push

# Image processing
pnpm add --filter admin sharp
pnpm add -D --filter admin @types/sharp

# AI
pnpm add --filter admin @anthropic-ai/sdk

# Widget build
pnpm add --filter shared-ui idb  # IndexedDB wrapper
```

---

## References

- **Original Vision:** `docs/support-management-thoughts.md`
- **Reference Document:** `docs/support-system-reference.md`
- **Prototype Spec:** `specs/support-management-system-prototype.md`
- **MinIO Setup:** `tools/mcp-gateway/README.md`

---

*Created: 2025-12-05 | Complexity: Complex | Type: Feature | Phases: 6-12 (AI deferred) | Estimated: 25-32 days*
