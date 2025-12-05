# Support System Reference

> Comprehensive reference for building Ozean Licht's native conversational support system.
> Combines vision, Chatwoot learnings, and implementation patterns.

**Status:** Reference Document
**Last Updated:** 2025-12-05
**Related Files:**
- `docs/support-management-thoughts.md` - Original vision document
- `specs/support-management-system.md` - Implementation spec (Phases 1-5 complete)

---

## Table of Contents

1. [Vision & Philosophy](#1-vision--philosophy)
2. [Decision: Native Build vs Chatwoot](#2-decision-native-build-vs-chatwoot)
3. [Database Schema Reference](#3-database-schema-reference)
4. [Data Models](#4-data-models)
5. [Webhook Events](#5-webhook-events)
6. [Automation & Routing](#6-automation--routing)
7. [UI/UX Patterns](#7-uiux-patterns)
8. [Widget Customization](#8-widget-customization)
9. [Canned Responses](#9-canned-responses)
10. [Analytics & Metrics](#10-analytics--metrics)
11. [Channel Integration](#11-channel-integration)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. Vision & Philosophy

### The Shift: From Tickets to Conversations

Traditional support creates friction. Ozean Licht's support should feel like messaging a friend who happens to be an expert.

**Core Philosophy:**
```
"Support is not a cost center — it's where trust is built."
```

For a spiritual education platform, every support interaction is an extension of the teaching relationship.

### Guiding Principles

1. **Warmth over efficiency** - Resolve with care, not just speed
2. **Transparency over formality** - "We're looking into this" beats "Ticket #4521 received"
3. **Empowerment over dependency** - Help users help themselves
4. **Presence over automation** - AI assists, humans connect

### The "WhatsApp Standard"

| Traditional | Ozean Licht Target |
|-------------|-------------------|
| Fill form, get ticket number | Send message, get response |
| Check email for updates | See typing indicator, real-time reply |
| Formal "Dear Customer" tone | Warm, first-name conversation |
| Close ticket = relationship ends | Conversation stays, relationship grows |
| Hours for first response | Minutes (or instant AI assist) |

### Response Time Targets

| Priority | First Response | Resolution |
|----------|----------------|------------|
| Critical (access blocked) | < 15 min | < 2 hours |
| High (payment/billing) | < 1 hour | < 24 hours |
| Normal (questions) | < 4 hours | < 48 hours |
| Low (feedback/suggestions) | < 24 hours | Acknowledged |

---

## 2. Decision: Native Build vs Chatwoot

### Why Native Build (Not Chatwoot Integration)

**The Problem with Chatwoot:**
- Separate container/network (iframe or separate tab)
- Not the seamless, native experience desired
- Different tech stack (Ruby/Rails + Vue.js vs our Next.js + React)

**Our Vision: Facebook Messenger Style**
```
+-------------------------------------------------------------+
|  Trinity Studio Admin                                        |
+----------+--------------------------------------------------+
|          |   +---------------+------------------------+      |
| Sidebar  |   | Conversations | Chat Thread            |      |
|          |   |               |                        |      |
| Dashboard|   | Team General  | [Message bubbles]      |      |
| Projects |   | Dev Team      |                        |      |
| Team     |   | ------------- |                        |      |
| -------- |   | Max S.        |                        |      |
| Messages |   |   Payment..   |                        |      |
|   Team   |   | Anna K.       | +------------------+   |      |
|   Support|   |   Course..    | | Type message...  |   |      |
|   Dev    |   |               | +------------------+   |      |
|          |   +---------------+------------------------+      |
+----------+--------------------------------------------------+
```

**Three Conversation Types — One UI:**

| Type | Participants | Purpose |
|------|--------------|---------|
| Team Chat | Internal team members | General discussion (Slack-like) |
| Support Tickets | Customer ↔ Support agents | External customer inquiries |
| Dev Tickets | Team member → Dev team | Internal technical requests |

### What We Extract from Chatwoot

**Worth Copying:**
- Database schema concepts (battle-tested models)
- UX patterns (screenshot and rebuild in ShadCN)
- Business logic concepts (routing rules, SLA tracking, CSAT flow)

**NOT Worth Extracting:**
- Actual component code (Vue → React rewrite = more work than building)
- Backend logic (Ruby → TypeScript = more work)
- WebSocket implementation (ActionCable is Rails-specific)

---

## 3. Database Schema Reference

### Chatwoot's Core Tables (27 total)

Based on DrawSQL analysis and API documentation:

#### Primary Entities

```sql
-- Conversations: Core entity
conversations (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  inbox_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,          -- 'open', 'resolved', 'pending'
  assignee_id INTEGER,                   -- FK to users
  contact_id BIGINT,                     -- FK to contacts
  display_id INTEGER,                    -- Human-readable ID
  user_last_seen_at TIMESTAMP,
  agent_last_seen_at TIMESTAMP,
  locked BOOLEAN DEFAULT FALSE,
  contact_inbox_id INTEGER,
  additional_attributes JSONB DEFAULT '{}',
  custom_attributes JSONB DEFAULT '{}',
  labels TEXT[],
  priority VARCHAR(20),                  -- 'low', 'normal', 'high', 'urgent'
  sla_policy_id INTEGER,
  first_reply_created_at TIMESTAMP,
  waiting_since TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Messages: Conversation content
messages (
  id SERIAL PRIMARY KEY,
  content TEXT,
  account_id INTEGER NOT NULL,
  inbox_id INTEGER NOT NULL,
  conversation_id INTEGER NOT NULL,
  message_type INTEGER,                  -- 0=incoming, 1=outgoing, 2=activity
  private BOOLEAN DEFAULT FALSE,         -- Internal notes
  status VARCHAR(20),                    -- 'sent', 'delivered', 'read', 'failed'
  source_id VARCHAR(255),                -- External message ID
  content_type VARCHAR(50),              -- 'text', 'input_select', 'cards', 'form'
  content_attributes JSONB DEFAULT '{}',
  sender_type VARCHAR(20),               -- 'contact', 'agent', 'agent_bot'
  sender_id INTEGER,
  external_source_ids JSONB DEFAULT '{}',
  additional_attributes JSONB DEFAULT '{}',
  sentiment JSONB DEFAULT '{}',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Contacts: End users/customers
contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(255),
  account_id INTEGER NOT NULL,
  pubsub_token VARCHAR(255),
  additional_attributes JSONB DEFAULT '{}',
  custom_attributes JSONB DEFAULT '{}',
  source_id BIGINT,
  identifier VARCHAR(255),               -- External system ID
  blocked BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Inboxes: Channel sources
inboxes (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL,
  channel_type VARCHAR(255),             -- 'Channel::WebWidget', 'Channel::Api', etc.
  account_id INTEGER NOT NULL,
  name VARCHAR(255),
  enable_auto_assignment BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Supporting Entities

```sql
-- Teams: Agent groupings
teams (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  allow_auto_assign BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Canned Responses: Quick replies
canned_responses (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  short_code VARCHAR(255) NOT NULL,      -- Trigger shortcode (e.g., "/greeting")
  content TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Labels: Tagging system
labels (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7),                      -- Hex color
  show_on_sidebar BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Attachments: File uploads
attachments (
  id SERIAL PRIMARY KEY,
  file_type INTEGER,
  external_url VARCHAR(255),
  coordinates_lat FLOAT,
  coordinates_long FLOAT,
  message_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  fallback_title VARCHAR(255),
  extension VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Our Adapted Schema

Located at `apps/admin/migrations/022_support_tables.sql`:

```sql
-- Sync conversations from external sources
CREATE TABLE support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatwoot_id INTEGER UNIQUE,            -- For external sync
  user_id UUID REFERENCES users(id),     -- Link to our users
  contact_email VARCHAR(255),
  contact_name VARCHAR(255),
  channel VARCHAR(50) NOT NULL,          -- 'web_widget', 'whatsapp', 'email', 'telegram'
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'normal',
  team VARCHAR(50),
  assigned_agent_id UUID REFERENCES admin_users(id),
  labels TEXT[],
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  csat_rating INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages with private notes support
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES support_conversations(id) ON DELETE CASCADE,
  chatwoot_id INTEGER UNIQUE,
  sender_type VARCHAR(20) NOT NULL,      -- 'contact', 'agent', 'bot'
  sender_name VARCHAR(255),
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text',
  is_private BOOLEAN DEFAULT FALSE,      -- Yellow background for internal notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base articles
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100),
  tags TEXT[],
  language VARCHAR(10) DEFAULT 'de',
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick responses (canned responses)
CREATE TABLE quick_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private'
  created_by UUID REFERENCES admin_users(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Data Models

### Conversation Object (API Response)

```typescript
interface Conversation {
  id: number;
  uuid: string;
  account_id: number;
  inbox_id: number;
  status: 'open' | 'resolved' | 'pending';
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  labels: string[];

  // Timestamps
  created_at: number;           // Unix timestamp
  updated_at: number;
  timestamp: string;            // ISO string
  first_reply_created_at: number | null;
  last_activity_at: number;
  waiting_since: number | null;

  // Activity tracking
  agent_last_seen_at: number;
  assignee_last_seen_at: number;
  contact_last_seen_at: number;
  unread_count: number;

  // State
  muted: boolean;
  snoozed_until: number | null;
  can_reply: boolean;

  // SLA
  sla_policy_id: number | null;
  applied_sla: object;
  sla_events: object[];

  // Custom data
  additional_attributes: object;
  custom_attributes: object;

  // Related data
  messages: Message[];
  last_non_activity_message: Message;

  // Metadata
  meta: {
    sender: Contact;
    channel: string;
    assignee: Agent | null;
    hmac_verified: boolean;
  };
}
```

### Message Object

```typescript
interface Message {
  id: number;
  content: string;
  account_id: number;
  inbox_id: number;
  conversation_id: number;

  // Type: 0=incoming, 1=outgoing, 2=activity
  message_type: 0 | 1 | 2;

  // Content type for rich messages
  content_type: 'text' | 'input_select' | 'cards' | 'form';
  content_attributes: object;

  // Sender info
  sender_type: 'contact' | 'agent' | 'agent_bot';
  sender_id: number;
  sender: Contact | Agent | AgentBot;

  // Status
  status: 'sent' | 'delivered' | 'read' | 'failed';
  private: boolean;             // Internal note (yellow background)

  // External tracking
  source_id: string | null;
  external_source_ids: object;

  // Metadata
  additional_attributes: object;
  processed_message_content: string;
  sentiment: object;

  // Attachments
  attachment: Attachment | null;

  // Timestamps
  created_at: number;
  updated_at: number;
}
```

### Contact Object

```typescript
interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  identifier: string | null;
  thumbnail: string;

  // Status
  availability_status: string;
  blocked: boolean;

  // Activity
  last_activity_at: number;
  created_at: number;

  // Custom data
  additional_attributes: object;
  custom_attributes: object;
}
```

### Agent Object

```typescript
interface Agent {
  id: number;
  name: string;
  email: string;
  available_name: string;
  display_name: string | null;
  avatar_url: string;

  // Role
  role: 'agent' | 'administrator';

  // Status
  confirmed: boolean;
  availability_status: string;

  // Settings
  message_signature: string | null;
  ui_settings: object;
  custom_attributes: object;

  // Account access
  accounts: AccountAccess[];
}
```

---

## 5. Webhook Events

### Available Webhook Subscriptions

```typescript
type WebhookEvent =
  | 'conversation_created'
  | 'conversation_status_changed'
  | 'conversation_updated'
  | 'message_created'
  | 'message_updated'
  | 'contact_created'
  | 'contact_updated'
  | 'webwidget_triggered';
```

### Event Payloads

#### conversation_created
Triggered when a new conversation is initiated.

```typescript
{
  event: 'conversation_created',
  data: Conversation  // Full conversation object
}
```

#### conversation_status_changed
Triggered when status changes (open → resolved, etc.)

```typescript
{
  event: 'conversation_status_changed',
  data: Conversation
}
```

#### message_created
Triggered for every new message (contact, agent, or bot).

```typescript
{
  event: 'message_created',
  data: Message
}
```

#### conversation_updated
Triggered when conversation attributes change (labels, team, assignee).

```typescript
{
  event: 'conversation_updated',
  data: Conversation
}
```

### WebSocket Events (Real-time)

For native builds, implement these events:

```typescript
// Connection via WebSocket
const events = [
  'conversation.created',
  'conversation.read',
  'conversation.status_changed',
  'conversation.typing_on',
  'conversation.typing_off',
  'message.created',
  'message.updated',
  'assignee.changed',
  'team.changed',
  'contact.created',
  'contact.updated',
  'presence.update',
  'notification_created'
];
```

### Typing Indicators

```typescript
// Typing started
{
  event: 'conversation.typing_on',
  data: {
    conversation: Conversation,
    user: Contact | Agent,
    is_private: boolean,  // Agent typing private note
    account_id: number
  }
}

// Typing stopped
{
  event: 'conversation.typing_off',
  data: {
    conversation: Conversation,
    user: Contact | Agent,
    account_id: number
  }
}
```

---

## 6. Automation & Routing

### Automation Rules Structure

**Components:**
1. **Event** - Trigger
2. **Conditions** - Criteria to match
3. **Actions** - Tasks to execute

#### Events

| Event | Description |
|-------|-------------|
| `conversation_created` | New conversation initiated |
| `conversation_updated` | Conversation attributes changed |
| `message_created` | New message in conversation |
| `conversation_opened` | Snoozed/resolved conversation reopened |

#### Conditions

Available conditions depend on event type:

| Condition | Operators | Values |
|-----------|-----------|--------|
| Status | equals, not_equals | open, pending, resolved |
| Assignee | equals, not_equals, present, not_present | Agent list |
| Inbox | equals, not_equals | Inbox list |
| Team | equals, not_equals | Team list |
| Labels | present, not_present | Label list |
| Browser Language | equals, not_equals | Language codes |
| Country | equals, not_equals | Country list |
| Priority | equals, not_equals | low, normal, high, urgent |
| Message Content | contains, not_contains | Keywords |

#### Actions

| Action | Description |
|--------|-------------|
| `assign_agent` | Assign to specific agent |
| `assign_team` | Assign to team |
| `add_label` | Add label to conversation |
| `send_email_to_team` | Notify team via email |
| `send_email_transcript` | Send conversation transcript |
| `mute_conversation` | Mute notifications |
| `snooze_conversation` | Snooze until later |
| `resolve_conversation` | Mark as resolved |
| `send_webhook_event` | Trigger external webhook |
| `send_attachment` | Send file |
| `send_message` | Send automated reply |

### Routing Logic

#### Keyword-Based Routing

```typescript
const routingRules = {
  sales: {
    keywords: ['payment', 'invoice', 'refund', 'price', 'subscription', 'plan'],
    team: 'sales',
    priority: 'high'
  },
  tech: {
    keywords: ['error', 'not working', "can't access", 'bug', 'broken', 'crash'],
    team: 'tech-support',
    priority: 'high'
  },
  spiritual: {
    keywords: ['meditation', 'experience', 'guidance', 'vision', 'dream', 'energy'],
    team: 'spiritual',
    priority: 'normal'
  }
};
```

#### Round-Robin Assignment

- Distributes conversations evenly among available agents
- Only assigns to agents with "online" status
- Skips agents at capacity limit
- Falls back to "Unassigned" queue if all agents busy

#### Agent Capacity (Enterprise)

```typescript
interface AgentCapacity {
  agent_id: string;
  inbox_id: string;
  max_conversations: number;  // Channel-specific limit
  current_count: number;
}

// Example limits:
// - Live Chat: 2-3 active conversations
// - Email: 10-20 threads per day
```

### SLA Policies

```typescript
interface SLAPolicy {
  id: string;
  name: string;
  description: string;

  // Metrics (in seconds)
  first_response_time: number | null;  // FRT target
  next_response_time: number | null;   // NRT target
  resolution_time: number | null;      // RT target

  // Business hours consideration
  only_during_business_hours: boolean;
}
```

SLAs are applied via automation rules based on:
- Customer type (VIP, enterprise)
- Conversation priority
- Inbox/channel type

---

## 7. UI/UX Patterns

### Inbox Layout (Three-Column)

```
+------------------+--------------------+------------------+
| Conversation     | Message Thread     | Context Panel    |
| List (Left)      | (Center)           | (Right)          |
+------------------+--------------------+------------------+
| [Filters]        | [Header]           | [Customer Info]  |
| [Search]         |                    |                  |
|                  | [Messages]         | [Course Progress]|
| Conversation 1   |   - Contact msg    |                  |
|   Preview...     |   - Agent reply    | [Payment History]|
|                  |   - Private note   |                  |
| Conversation 2   |   (yellow bg)      | [Previous Tickets]|
|   Preview...     |                    |                  |
|                  | [Composer]         | [Quick Actions]  |
| Conversation 3   |   [/ for canned]   |                  |
|   Preview...     |   [Attach] [Send]  |                  |
+------------------+--------------------+------------------+
```

### Conversation List Item

```tsx
<ConversationItem>
  <Avatar contact={contact} />
  <div className="flex-1">
    <div className="flex justify-between">
      <span className="font-medium">{contact.name}</span>
      <span className="text-xs text-muted">{timeAgo}</span>
    </div>
    <p className="text-sm text-muted truncate">{lastMessage}</p>
  </div>
  <div className="flex items-center gap-1">
    <ChannelBadge channel={channel} />
    <PriorityDot priority={priority} />
    {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
  </div>
</ConversationItem>
```

### Message Bubbles

```tsx
// Contact message (left-aligned)
<div className="flex justify-start">
  <div className="max-w-[70%] bg-card rounded-lg p-3">
    <p>{message.content}</p>
    <span className="text-xs text-muted">{timestamp}</span>
  </div>
</div>

// Agent message (right-aligned)
<div className="flex justify-end">
  <div className="max-w-[70%] bg-primary/10 rounded-lg p-3">
    <p>{message.content}</p>
    <span className="text-xs text-muted">{timestamp}</span>
  </div>
</div>

// Private note (yellow background, full width)
<div className="bg-yellow-100/20 border-l-4 border-yellow-500 p-3">
  <div className="flex items-center gap-2 mb-1">
    <LockIcon className="w-3 h-3" />
    <span className="text-xs font-medium">Private Note</span>
  </div>
  <p>{message.content}</p>
</div>
```

### Customer Context Panel

```tsx
<ContextPanel>
  {/* Customer Header */}
  <div className="flex items-center gap-3 p-4 border-b">
    <Avatar size="lg" />
    <div>
      <h3>{customer.name}</h3>
      <p className="text-sm text-muted">{customer.email}</p>
    </div>
  </div>

  {/* Quick Stats */}
  <div className="grid grid-cols-2 gap-2 p-4 border-b">
    <Stat label="Member Since" value="2024-03-15" />
    <Stat label="Previous Tickets" value="2" />
  </div>

  {/* Course Progress */}
  <Section title="Courses">
    {courses.map(course => (
      <CourseProgress
        name={course.name}
        progress={course.progress}
        lastAccessed={course.lastAccessed}
      />
    ))}
  </Section>

  {/* Payment History */}
  <Section title="Payments">
    {payments.map(payment => (
      <PaymentItem {...payment} />
    ))}
  </Section>

  {/* Internal Notes */}
  <Section title="Notes">
    <Textarea placeholder="Add a note about this customer..." />
  </Section>
</ContextPanel>
```

### Quick Filters

```tsx
const filters = [
  { label: 'Mine', filter: { assignee: currentUser.id } },
  { label: 'Unassigned', filter: { assignee: null } },
  { label: 'Open', filter: { status: 'open' } },
  { label: 'Pending', filter: { status: 'pending' } },
  { label: 'Resolved', filter: { status: 'resolved' } }
];

// Advanced filters
const advancedFilters = [
  { type: 'status', options: ['open', 'pending', 'resolved'] },
  { type: 'assignee', options: agents },
  { type: 'team', options: teams },
  { type: 'inbox', options: inboxes },
  { type: 'label', options: labels },
  { type: 'priority', options: ['low', 'normal', 'high', 'urgent'] }
];
```

---

## 8. Widget Customization

### Widget Settings

```typescript
interface WidgetSettings {
  // Appearance
  widget_color: string;           // Primary color (e.g., '#0ec2bc')

  // Content
  welcome_heading: string;        // e.g., "Hello there"
  welcome_tagline: string;        // Subtitle text

  // Greeting
  enable_channel_greeting: boolean;
  greeting_message: string;       // First auto-message

  // Launcher
  launcher_title: string;         // Bubble text (expanded mode)

  // Behavior
  position: 'left' | 'right';
  type: 'standard' | 'expanded_bubble';

  // Pre-chat form
  pre_chat_form_enabled: boolean;
  pre_chat_form_options: {
    require_email: boolean;
    pre_chat_message: string;
    fields: PreChatField[];
  };

  // Business hours
  business_hours_enabled: boolean;
  out_of_office_message: string;
}

interface PreChatField {
  key: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'list' | 'date';
  label: string;
  placeholder: string;
  required: boolean;
}
```

### Widget Embed Code

```html
<script>
  (function(d,t) {
    var BASE_URL = "https://support.ozean-licht.at";
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
      window.chatwootSDK.run({
        websiteToken: 'YOUR_WEBSITE_TOKEN',
        baseUrl: BASE_URL
      })
    }
  })(document, "script");
</script>
```

### Widget SDK Methods

```javascript
// Set user identity
window.$chatwoot.setUser('user_unique_id', {
  email: 'user@example.com',
  name: 'John Doe',
  phone_number: '+49123456789',
  avatar_url: 'https://...',
  identifier_hash: 'hmac_hash'  // For identity verification
});

// Set custom attributes
window.$chatwoot.setCustomAttributes({
  plan: 'premium',
  courses_enrolled: 3,
  last_purchase: '2024-01-15'
});

// Control widget
window.$chatwoot.toggle();        // Open/close
window.$chatwoot.toggleBubbleVisibility(); // Show/hide bubble

// Set locale
window.$chatwoot.setLocale('de');

// Set labels
window.$chatwoot.setConversationLabels(['vip', 'returning']);
```

---

## 9. Canned Responses

### Structure

```typescript
interface CannedResponse {
  id: string;
  short_code: string;    // Trigger (e.g., "greeting")
  content: string;       // Message template
  category?: string;     // Optional grouping
  visibility: 'public' | 'private';  // Team-wide or personal
  created_by: string;
  usage_count: number;
}
```

### Usage Pattern

Agent types `/` in composer to open picker:
```
+---------------------------+
| / greeting               |
+---------------------------+
| /greeting                 |
|   Hallo! Wie kann ich...  |
| /password-reset           |
|   Ich schicke dir...      |
| /course-help              |
|   Ich sehe, dass du...    |
+---------------------------+
```

### Template Variables

Support dynamic content with variables:

```typescript
const variables = {
  'contact.name': 'Customer full name',
  'contact.first_name': 'Customer first name',
  'contact.last_name': 'Customer last name',
  'contact.phone_number': 'Customer phone',
  'contact.id': 'Contact ID',
  'conversation.id': 'Conversation ID',
  'agent.name': 'Assigned agent name',
  'agent.first_name': 'Agent first name',
  'agent.last_name': 'Agent last name'
};

// Usage in template:
// "Hallo {{contact.first_name}}, ich bin {{agent.first_name}}. Wie kann ich dir helfen?"
```

### Example Responses (German)

```typescript
const cannedResponses = [
  {
    short_code: 'greeting',
    content: 'Hallo {{contact.first_name || "dort"}}, schön von dir zu hören! Wie kann ich dir helfen?',
    category: 'General'
  },
  {
    short_code: 'password-reset',
    content: 'Ich habe dir gerade einen Link zum Zurücksetzen deines Passworts geschickt. Bitte überprüfe auch deinen Spam-Ordner. Melde dich, wenn es nicht klappt!',
    category: 'Technical'
  },
  {
    short_code: 'course-progress',
    content: 'Ich sehe, dass du bei {{module_name}} bist. Lass mich kurz nachschauen, was das Problem sein könnte...',
    category: 'Courses'
  },
  {
    short_code: 'escalate-spiritual',
    content: 'Das klingt nach einer tiefgreifenden Erfahrung. Ich verbinde dich mit einem unserer erfahrenen Begleiter, die sich besonders gut mit solchen Themen auskennen.',
    category: 'Escalation'
  },
  {
    short_code: 'closing',
    content: 'Gibt es sonst noch etwas, womit ich dir helfen kann? Wenn nicht, wünsche ich dir einen wundervollen Tag! 🌟',
    category: 'General'
  }
];
```

---

## 10. Analytics & Metrics

### Key Metrics

```typescript
interface SupportMetrics {
  // Volume
  total_conversations: number;
  new_conversations: number;
  resolved_conversations: number;

  // Response Times
  avg_first_response_time_seconds: number;
  median_first_response_time_seconds: number;
  avg_resolution_time_seconds: number;

  // Quality
  csat_average: number;          // 1-5 scale
  csat_response_rate: number;    // % of resolved with rating

  // AI
  ai_deflection_rate: number;    // % resolved without human

  // By Dimension
  conversations_by_channel: Record<string, number>;
  conversations_by_team: Record<string, number>;
  conversations_by_status: Record<string, number>;
}
```

### Agent Performance

```typescript
interface AgentMetrics {
  agent_id: string;
  agent_name: string;

  // Volume
  conversations_handled: number;
  messages_sent: number;

  // Speed
  avg_first_response_seconds: number;
  avg_response_time_seconds: number;

  // Quality
  csat_average: number;
  resolution_rate: number;

  // Activity
  online_hours: number;
  conversations_per_hour: number;
}
```

### Dashboard Components

```typescript
// Overview cards
const overviewCards = [
  { label: 'Open', value: openCount, trend: '+12%' },
  { label: 'Avg Response', value: '4m 32s', trend: '-8%' },
  { label: 'CSAT', value: '4.7/5', trend: '+0.2' },
  { label: 'Resolution Rate', value: '94%', trend: '+2%' }
];

// Charts
const charts = [
  { type: 'line', title: 'Volume Over Time', data: volumeByDay },
  { type: 'bar', title: 'By Channel', data: byChannel },
  { type: 'heatmap', title: 'Peak Hours', data: byHour }
];
```

### CSAT Collection

Trigger CSAT survey when conversation is resolved:

```typescript
interface CSATSurvey {
  conversation_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
  submitted_at: Date;
}

// Survey prompt
const csatPrompt = {
  question: 'Wie zufrieden warst du mit unserem Support?',
  options: ['😞', '😕', '😐', '🙂', '😄'],
  followUp: 'Möchtest du uns noch etwas mitteilen?'
};
```

---

## 11. Channel Integration

### Supported Channels

| Channel | Use Case | Integration Method |
|---------|----------|-------------------|
| Website Widget | Primary contact point | JavaScript SDK |
| WhatsApp Business | Mobile users, ongoing chats | WhatsApp Business API |
| Email | Formal requests, documents | SMTP/IMAP or API |
| Telegram | Tech-savvy users | Telegram Bot API |

### Channel Configuration

```typescript
interface ChannelConfig {
  channel: 'web_widget' | 'whatsapp' | 'email' | 'telegram';
  enabled: boolean;
  platform: 'ozean_licht' | 'kids_ascension';

  // Channel-specific settings
  settings: {
    // WhatsApp
    phone_number?: string;
    business_account_id?: string;

    // Email
    imap_host?: string;
    smtp_host?: string;

    // Telegram
    bot_token?: string;
  };

  // Routing
  default_team?: string;
  auto_assign: boolean;
}
```

### Multi-Platform Support

```typescript
// Separate inboxes for each platform
const inboxes = [
  {
    name: 'Ozean Licht - Website',
    channel: 'web_widget',
    platform: 'ozean_licht',
    widget_color: '#0ec2bc'
  },
  {
    name: 'Kids Ascension - Website',
    channel: 'web_widget',
    platform: 'kids_ascension',
    widget_color: '#FF6B6B'  // Different branding
  }
];

// Filter conversations by platform
const platformFilter = (platform: string) => ({
  inbox_id: inboxes.find(i => i.platform === platform)?.id
});
```

---

## 12. Implementation Checklist

### Phase 1: Foundation (Completed)
- [x] Database schema design
- [x] Type definitions
- [x] Basic CRUD operations
- [x] Webhook handler structure

### Phase 2: Admin Dashboard (Completed)
- [x] Inbox page with conversation list
- [x] Conversation detail view
- [x] Customer context panel
- [x] Navigation integration
- [x] RBAC permissions

### Phase 3: Knowledge Base (Completed)
- [x] Article CRUD with rich text
- [x] Category management
- [x] Full-text search
- [x] Article suggestions in conversations

### Phase 4: Analytics (Completed)
- [x] Support analytics dashboard
- [x] Response time tracking
- [x] CSAT collection
- [x] Routing suggestions
- [x] Canned responses

### Phase 5: Channels (Completed)
- [x] Channel configuration UI
- [x] Widget customization
- [x] Embed code generation
- [x] Real-time polling
- [x] Mobile-responsive inbox

### Future Phases
- [ ] WhatsApp Business API integration
- [ ] Telegram bot connection
- [ ] AI-powered response suggestions (Claude API)
- [ ] Proactive support triggers
- [ ] Public help center
- [ ] Native team chat (internal messaging)

---

## Quick Reference

### API Endpoints

```
GET    /api/support/conversations          - List conversations
GET    /api/support/conversations/:id      - Get conversation
PATCH  /api/support/conversations/:id      - Update conversation
GET    /api/support/conversations/:id/context - Customer context

GET    /api/support/knowledge              - List articles
POST   /api/support/knowledge              - Create article
GET    /api/support/knowledge/:id          - Get article
PATCH  /api/support/knowledge/:id          - Update article
DELETE /api/support/knowledge/:id          - Delete article
GET    /api/support/knowledge/search       - Search articles

GET    /api/support/analytics              - Support metrics

POST   /api/support/webhooks/chatwoot      - Webhook receiver
```

### Component Locations

```
apps/admin/
├── app/dashboard/support/
│   ├── page.tsx                 - Overview dashboard
│   ├── layout.tsx               - Support section layout
│   ├── inbox/
│   │   ├── page.tsx             - Unified inbox
│   │   └── [id]/page.tsx        - Conversation detail
│   ├── knowledge/page.tsx       - Knowledge base
│   ├── analytics/page.tsx       - Analytics dashboard
│   └── settings/page.tsx        - Channel settings
├── components/support/
│   ├── ConversationList.tsx
│   ├── ConversationItem.tsx
│   ├── MessageThread.tsx
│   ├── CustomerContextPanel.tsx
│   ├── QuickResponses.tsx
│   ├── RoutingSuggestions.tsx
│   ├── KnowledgeArticleEditor.tsx
│   ├── ArticleSuggestions.tsx
│   ├── WidgetCustomizer.tsx
│   └── index.ts
├── lib/db/
│   ├── support-conversations.ts
│   ├── support-messages.ts
│   ├── knowledge-articles.ts
│   ├── support-analytics.ts
│   ├── quick-responses.ts
│   └── support-channels.ts
└── types/support.ts
```

### Design Tokens (Ozean Licht)

```css
/* Widget colors */
--widget-primary: #0ec2bc;
--widget-background: #00111A;
--widget-text: #C4C8D4;

/* Message colors */
--message-contact-bg: rgba(0, 17, 26, 0.7);
--message-agent-bg: rgba(14, 194, 188, 0.1);
--message-private-bg: rgba(250, 204, 21, 0.1);
--message-private-border: #FACC15;
```

---

*Last Updated: 2025-12-05 | Synthesized from Chatwoot research + Ozean Licht vision*
