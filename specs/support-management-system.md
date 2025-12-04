# Plan: Support Management System

## Task Description

Build a conversational support management system for Ozean Licht Akademie and Kids Ascension platforms. The system integrates a self-hosted Chatwoot instance with the admin dashboard, providing a unified inbox for customer conversations across multiple channels (website chat, WhatsApp, email, Telegram) with AI-assisted triage, smart routing, and deep integration with existing user/course data.

## Objective

When complete, support agents will be able to:
1. View all customer conversations in a unified inbox within the admin dashboard
2. See rich customer context (course progress, payment history, previous tickets) alongside conversations
3. Leverage AI for first-response acknowledgment and knowledge base suggestions
4. Route conversations to appropriate teams based on content/sentiment
5. Collaborate with internal notes and warm handoffs
6. Track performance metrics (response times, CSAT, resolution rates)

## Problem Statement

Currently, Ozean Licht has no centralized support system. Customer inquiries arrive via scattered channels without:
- Unified view of conversations
- Customer context at support time
- Response time tracking
- Team collaboration tools
- Knowledge base for self-service

For a spiritual education platform, support is an extension of the teaching relationship. Users expect warm, personal interactions - not ticket numbers and form submissions.

## Solution Approach

**Strategy: Chatwoot Integration + Custom Admin Panel**

Rather than building from scratch (6+ months) or using expensive SaaS (no data control), we:
1. Deploy self-hosted Chatwoot for conversation management, real-time chat, and channel integrations
2. Build custom admin dashboard components for Ozean Licht-specific context enrichment
3. Create bidirectional sync between Chatwoot and our database
4. Add AI layer for intelligent routing and first-response assistance

```
+-------------------+      +-----------------+      +------------------+
|   Chat Widget     |      |    Chatwoot     |      |  Admin Dashboard |
|   (ozean-licht.at)|----->|  (self-hosted)  |<---->|  /dashboard/     |
+-------------------+      |                 |      |  support/        |
                           |  - Inbox        |      |                  |
+-------------------+      |  - Routing      |      |  - Context Panel |
|   WhatsApp        |----->|  - Teams        |      |  - Stats Widget  |
+-------------------+      |  - Automation   |      |  - KB Management |
                           +-----------------+      +------------------+
                                   |                        |
                                   v                        v
                           +----------------------------------+
                           |        PostgreSQL Database       |
                           |  - support_conversations         |
                           |  - support_messages              |
                           |  - knowledge_articles            |
                           +----------------------------------+
```

## Relevant Files

### Existing Files to Reference

- `apps/admin/lib/db/index.ts` - Database connection pattern (query, execute, transaction)
- `apps/admin/lib/db/projects.ts` - CRUD pattern reference for database modules
- `apps/admin/types/projects.ts` - Type definitions pattern reference
- `apps/admin/components/dashboard/Sidebar.tsx` - Add Support section to navigation
- `apps/admin/lib/rbac/constants.ts` - Add support permissions
- `apps/admin/app/api/projects/route.ts` - API route pattern reference
- `apps/admin/components/projects/CommentThread.tsx` - Thread UI pattern reference
- `apps/admin/components/projects/ActivityLog.tsx` - Activity feed pattern reference

### New Files to Create

**Database Layer (`lib/db/`):**
- `lib/db/support-conversations.ts` - Conversation sync & CRUD
- `lib/db/support-messages.ts` - Message history
- `lib/db/knowledge-articles.ts` - Knowledge base management
- `lib/db/support-analytics.ts` - Metrics queries

**Types (`types/`):**
- `types/support.ts` - All support-related type definitions

**API Routes (`app/api/support/`):**
- `app/api/support/conversations/route.ts` - List conversations
- `app/api/support/conversations/[id]/route.ts` - Single conversation
- `app/api/support/conversations/[id]/context/route.ts` - Customer context enrichment
- `app/api/support/webhooks/chatwoot/route.ts` - Chatwoot webhook receiver
- `app/api/support/knowledge/route.ts` - Knowledge base CRUD
- `app/api/support/knowledge/[id]/route.ts` - Single article
- `app/api/support/analytics/route.ts` - Support metrics

**Dashboard Pages (`app/dashboard/support/`):**
- `app/dashboard/support/page.tsx` - Support overview with stats
- `app/dashboard/support/inbox/page.tsx` - Unified inbox view
- `app/dashboard/support/conversations/[id]/page.tsx` - Conversation detail
- `app/dashboard/support/knowledge/page.tsx` - Knowledge base management
- `app/dashboard/support/analytics/page.tsx` - Performance dashboard
- `app/dashboard/support/settings/page.tsx` - Routing rules, team config
- `app/dashboard/support/layout.tsx` - Support section layout

**Components (`components/support/`):**
- `components/support/ConversationList.tsx` - Inbox list view
- `components/support/ConversationItem.tsx` - Single conversation row
- `components/support/CustomerContextPanel.tsx` - Rich customer info sidebar
- `components/support/MessageThread.tsx` - Message display
- `components/support/QuickResponses.tsx` - Canned response picker
- `components/support/RoutingBadge.tsx` - Team/priority indicators
- `components/support/SupportStatsCard.tsx` - Metrics widget
- `components/support/KnowledgeArticleEditor.tsx` - Article WYSIWYG
- `components/support/KnowledgeArticleList.tsx` - Article listing
- `components/support/index.ts` - Barrel export

**Migrations (`migrations/`):**
- `migrations/022_support_tables.sql` - Create support schema

**Infrastructure (`tools/`):**
- `tools/chatwoot/docker-compose.yml` - Chatwoot deployment config
- `tools/chatwoot/README.md` - Setup & configuration guide

## Implementation Phases

### Phase 1: Foundation (Infrastructure + Database) - COMPLETED
**Duration:** 2-3 days | **Status:** Completed 2025-12-04

Set up Chatwoot instance, create database schema, establish webhook communication.

- [x] Deploy Chatwoot via Docker on Hetzner server
- [x] Create database tables for local sync
- [x] Implement webhook receiver for Chatwoot events
- [x] Basic conversation sync mechanism

**Phase 1 Deliverables:**
- `tools/chatwoot/docker-compose.yml` - Production-ready Chatwoot deployment (Chatwoot, Redis, PostgreSQL, Sidekiq)
- `tools/chatwoot/README.md` - Comprehensive setup and configuration guide
- `tools/chatwoot/.env.example` - Environment variable template
- `tools/chatwoot/setup.sh` - Interactive setup script
- `apps/admin/migrations/022_support_tables.sql` - Database schema (4 tables, 19 indexes, triggers)
- `apps/admin/types/support.ts` - Complete TypeScript definitions (679 lines)
- `apps/admin/lib/db/support-conversations.ts` - Conversation CRUD and Chatwoot sync
- `apps/admin/lib/db/support-messages.ts` - Message sync and internal notes
- `apps/admin/lib/db/knowledge-articles.ts` - Knowledge base CRUD with search
- `apps/admin/lib/db/support-analytics.ts` - Analytics queries and daily snapshots
- `apps/admin/app/api/support/webhooks/chatwoot/route.ts` - Webhook handler (4 event types)

### Phase 2: Admin Dashboard Integration - COMPLETED
**Duration:** 3-4 days | **Status:** Completed 2025-12-04

Build the core admin UI for viewing and managing conversations.

- [x] Inbox page with conversation list
- [x] Conversation detail view with message thread
- [x] Customer context panel with user/course data
- [x] Navigation integration (Sidebar)
- [x] RBAC permissions for support access

**Phase 2 Deliverables:**
- `apps/admin/app/api/support/conversations/route.ts` - List conversations with filters
- `apps/admin/app/api/support/conversations/[id]/route.ts` - Single conversation (GET/PATCH)
- `apps/admin/app/api/support/conversations/[id]/context/route.ts` - Customer context enrichment
- `apps/admin/app/api/support/analytics/route.ts` - Support metrics endpoint
- `apps/admin/app/api/support/knowledge/route.ts` - Knowledge articles list/create
- `apps/admin/app/api/support/knowledge/[id]/route.ts` - Single article CRUD
- `apps/admin/app/api/support/knowledge/search/route.ts` - Article search
- `apps/admin/app/api/support/knowledge/categories/route.ts` - Article categories
- `apps/admin/components/support/ConversationList.tsx` - Conversation table view
- `apps/admin/components/support/ConversationItem.tsx` - Single conversation row
- `apps/admin/components/support/MessageThread.tsx` - Message display
- `apps/admin/components/support/CustomerContextPanel.tsx` - Customer info sidebar
- `apps/admin/components/support/SupportStatsCard.tsx` - Dashboard metrics widget
- `apps/admin/components/support/RoutingBadge.tsx` - Team/priority badges
- `apps/admin/components/support/index.ts` - Barrel export
- `apps/admin/app/dashboard/support/layout.tsx` - Support section layout with RBAC
- `apps/admin/app/dashboard/support/page.tsx` - Support overview dashboard
- `apps/admin/app/dashboard/support/inbox/page.tsx` - Unified inbox view
- `apps/admin/app/dashboard/support/inbox/[id]/page.tsx` - Conversation detail
- `apps/admin/app/dashboard/support/knowledge/page.tsx` - Knowledge base management
- Updated `components/dashboard/Sidebar.tsx` - Added Support navigation section
- Updated `lib/rbac/constants.ts` - Added support permissions and routes

### Phase 3: Knowledge Base & Self-Service - COMPLETED
**Duration:** 2-3 days | **Status:** Completed 2025-12-04

Create knowledge base management and self-service portal.

- [x] Knowledge article CRUD with rich text editor
- [x] Article categories management and filtering
- [x] Full-text search for articles
- [x] Article preview and publishing workflow
- [x] Chatwoot integration for article suggestions
- [ ] Public help center page (optional - deferred to future)

**Phase 3 Deliverables:**
- `apps/admin/components/support/KnowledgeArticleEditor.tsx` - Rich text article editor modal with TipTap
- `apps/admin/components/support/ArticlePreviewModal.tsx` - Full article preview with publishing actions
- `apps/admin/components/support/CategoryManager.tsx` - Sidebar category filter and management
- `apps/admin/components/support/ArticleSuggestions.tsx` - Keyword-based article suggestions for conversations
- Updated `apps/admin/components/support/index.ts` - Added Phase 3 component exports
- Updated `apps/admin/app/dashboard/support/knowledge/page.tsx` - Full-featured knowledge base UI
- Updated `apps/admin/app/dashboard/support/inbox/[id]/page.tsx` - Article suggestions integration

### Phase 4: Analytics & AI Enhancement
**Duration:** 2-3 days

Add performance metrics and AI-assisted features.

- Support analytics dashboard
- Response time tracking
- CSAT collection
- AI routing suggestions (keyword-based initially)
- Canned response management

### Phase 5: Channel Integration & Polish
**Duration:** 2-3 days

Connect additional channels and refine UX.

- WhatsApp Business API setup
- Website chat widget customization
- Telegram bot integration
- Mobile-responsive inbox
- Real-time updates (polling/websocket)

## Step by Step Tasks

### 1. Deploy Chatwoot Infrastructure

- Create `tools/chatwoot/docker-compose.yml` with Chatwoot, Redis, PostgreSQL services
- Configure environment variables for Chatwoot (SMTP, domain, secrets)
- Set up Nginx reverse proxy for chatwoot.ozean-licht.dev subdomain
- Create admin account and configure initial workspace
- Generate API key for admin dashboard integration
- Document setup in `tools/chatwoot/README.md`

### 2. Create Database Schema

- Write migration `migrations/024_support_tables.sql`:
  ```sql
  -- Sync conversations from Chatwoot
  CREATE TABLE support_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatwoot_id INTEGER UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    contact_email VARCHAR(255),
    contact_name VARCHAR(255),
    channel VARCHAR(50) NOT NULL, -- 'web_widget', 'whatsapp', 'email', 'telegram'
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open', 'resolved', 'pending', 'snoozed'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    team VARCHAR(50), -- 'tech', 'sales', 'spiritual', 'general'
    assigned_agent_id UUID REFERENCES admin_users(id),
    labels TEXT[],
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    csat_rating INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Sync messages for context (summary, not full history)
  CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES support_conversations(id) ON DELETE CASCADE,
    chatwoot_id INTEGER UNIQUE,
    sender_type VARCHAR(20) NOT NULL, -- 'contact', 'agent', 'bot'
    sender_name VARCHAR(255),
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'attachment', 'template'
    is_private BOOLEAN DEFAULT FALSE,
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
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admin_users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Support analytics snapshots
  CREATE TABLE support_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    new_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    avg_first_response_minutes DECIMAL(10,2),
    avg_resolution_minutes DECIMAL(10,2),
    csat_average DECIMAL(3,2),
    conversations_by_channel JSONB DEFAULT '{}',
    conversations_by_team JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
  );

  CREATE INDEX idx_support_conversations_status ON support_conversations(status);
  CREATE INDEX idx_support_conversations_user ON support_conversations(user_id);
  CREATE INDEX idx_support_conversations_agent ON support_conversations(assigned_agent_id);
  CREATE INDEX idx_support_messages_conversation ON support_messages(conversation_id);
  CREATE INDEX idx_knowledge_articles_status ON knowledge_articles(status);
  CREATE INDEX idx_knowledge_articles_category ON knowledge_articles(category);
  ```
- Apply migration to database

### 3. Create Type Definitions

- Create `types/support.ts` with interfaces:
  - `Conversation`, `Message`, `KnowledgeArticle`
  - `ConversationStatus`, `ConversationPriority`, `Channel`, `Team`
  - `CustomerContext` (user profile, courses, payments, previous tickets)
  - `SupportStats`, `AgentPerformance`
  - Input types for CRUD operations
  - List options and filter types

### 4. Implement Database Layer

- Create `lib/db/support-conversations.ts`:
  - `getAllConversations(filters)` - List with pagination, filtering
  - `getConversationById(id)` - Single conversation with messages
  - `syncConversationFromChatwoot(data)` - Upsert from webhook
  - `updateConversation(id, data)` - Update local fields
  - `getConversationsByUser(userId)` - User's support history

- Create `lib/db/support-messages.ts`:
  - `getMessagesByConversation(conversationId)`
  - `syncMessageFromChatwoot(data)`
  - `addInternalNote(conversationId, content)`

- Create `lib/db/knowledge-articles.ts`:
  - `getAllArticles(filters)` - List with category/status filter
  - `getArticleById(id)` / `getArticleBySlug(slug)`
  - `createArticle(data)` / `updateArticle(id, data)` / `deleteArticle(id)`
  - `incrementViewCount(id)` / `incrementHelpfulCount(id)`
  - `searchArticles(query)` - Full-text search

- Create `lib/db/support-analytics.ts`:
  - `getSupportStats(dateRange)` - Aggregate metrics
  - `getAgentPerformance(agentId, dateRange)`
  - `recordDailySnapshot()` - Called by cron/webhook
  - `getConversationsByChannel()` / `getConversationsByTeam()`

### 5. Implement Chatwoot Webhook Handler

- Create `app/api/support/webhooks/chatwoot/route.ts`:
  - Verify webhook signature
  - Handle event types:
    - `conversation_created` - Create local record
    - `conversation_status_changed` - Update status
    - `conversation_resolved` - Mark resolved, calculate metrics
    - `message_created` - Sync message content
    - `conversation_updated` - Sync labels, team, assignee
  - Call appropriate database functions
  - Return 200 OK quickly (async processing if needed)

### 6. Build Customer Context Enrichment API

- Create `app/api/support/conversations/[id]/context/route.ts`:
  - Look up user by email from conversation
  - Fetch user profile from users table
  - Fetch course enrollments and progress
  - Fetch payment/subscription history
  - Fetch previous support conversations
  - Return unified `CustomerContext` object

### 7. Build Conversation API Routes

- Create `app/api/support/conversations/route.ts`:
  - GET: List conversations with filters (status, team, agent, search)
  - Pagination support
  - Auth check for support access

- Create `app/api/support/conversations/[id]/route.ts`:
  - GET: Single conversation with messages
  - PATCH: Update local fields (team, priority, labels)
  - Include customer context in response

### 8. Build Knowledge Base API Routes

- Create `app/api/support/knowledge/route.ts`:
  - GET: List articles (public/admin filtered)
  - POST: Create new article (admin only)

- Create `app/api/support/knowledge/[id]/route.ts`:
  - GET: Single article
  - PATCH: Update article
  - DELETE: Soft delete (archive)

### 9. Create Support Components

- Create `components/support/ConversationList.tsx`:
  - Table/list view of conversations
  - Status badges, channel icons, priority indicators
  - Quick filters (open, pending, resolved)
  - Search functionality
  - Click to open conversation

- Create `components/support/ConversationItem.tsx`:
  - Contact name, email
  - Last message preview
  - Time since last activity
  - Assigned agent avatar
  - Team/label badges

- Create `components/support/MessageThread.tsx`:
  - Message bubbles (contact left, agent right)
  - Timestamps
  - Private notes highlighted differently
  - Attachment previews
  - Typing indicator placeholder

- Create `components/support/CustomerContextPanel.tsx`:
  - Customer avatar and name
  - Email, member since
  - Course enrollments with progress bars
  - Payment history summary
  - Previous tickets with status
  - Custom notes field
  - Quick actions (view full profile, grant access)

- Create `components/support/QuickResponses.tsx`:
  - Searchable list of canned responses
  - Category grouping
  - Click to insert
  - Personal vs team responses

- Create `components/support/SupportStatsCard.tsx`:
  - Open conversations count
  - Avg response time
  - CSAT score
  - Sparkline trends

- Create `components/support/RoutingBadge.tsx`:
  - Team icon + label
  - Priority color coding
  - Assignee avatar

### 10. Build Dashboard Pages

- Create `app/dashboard/support/layout.tsx`:
  - Support section header
  - Sub-navigation (Inbox, Knowledge, Analytics, Settings)

- Create `app/dashboard/support/page.tsx`:
  - Stats overview cards
  - Quick actions (open inbox, recent conversations)
  - Team availability status

- Create `app/dashboard/support/inbox/page.tsx`:
  - Full inbox with ConversationList
  - Filters sidebar
  - Bulk actions toolbar

- Create `app/dashboard/support/conversations/[id]/page.tsx`:
  - Split view: Messages left, Context panel right
  - Message composer at bottom
  - Quick response picker
  - Team assignment dropdown

- Create `app/dashboard/support/knowledge/page.tsx`:
  - Article list with status filter
  - Create new article button
  - Category management
  - Search

- Create `app/dashboard/support/analytics/page.tsx`:
  - Charts: Volume over time, response times, CSAT trend
  - Breakdown by channel, team, agent
  - Export functionality

### 11. Add Navigation & RBAC

- Update `components/dashboard/Sidebar.tsx`:
  - Add "Support" section with items:
    - Inbox (`/dashboard/support/inbox`)
    - Knowledge Base (`/dashboard/support/knowledge`)
    - Analytics (`/dashboard/support/analytics`)

- Update `lib/rbac/constants.ts`:
  - Add permissions: `support.view`, `support.respond`, `support.manage`, `support.analytics`
  - Add route permissions for `/dashboard/support/*`

### 12. Configure Chatwoot Widget

- Create Chatwoot inbox for web widget
- Customize widget appearance:
  - Primary color: #0ec2bc
  - Welcome message in German
  - Quick action buttons
- Generate widget embed code
- Document integration for ozean-licht.at frontend

### 13. Implement AI Routing (Basic)

- Create `lib/support/routing.ts`:
  - Keyword-based team detection:
    - Payment keywords → Sales team
    - Technical keywords → Tech team
    - Spiritual keywords → Spiritual team
  - Sentiment detection placeholder (future: actual NLP)
  - Priority escalation rules
- Call from webhook handler on `conversation_created`

### 14. Validate Implementation

- Test Chatwoot webhook integration
- Test customer context enrichment with real user
- Verify conversation sync accuracy
- Test knowledge base CRUD
- Verify RBAC permissions
- Test responsive layout on mobile
- Review analytics calculations

## Testing Strategy

### Unit Tests
- Database query functions (mock pg pool)
- Routing logic (keyword detection)
- Customer context assembly

### Integration Tests
- Webhook handler with mock Chatwoot events
- API routes with auth checks
- Database operations

### E2E Tests
- Create conversation via widget → appears in inbox
- Agent responds → customer sees response
- Knowledge article creation and publishing

### Manual Testing Checklist
- [ ] Send test message via widget
- [ ] Verify conversation appears in inbox
- [ ] Check customer context loads correctly
- [ ] Test quick response insertion
- [ ] Verify team assignment works
- [ ] Test knowledge base article creation
- [ ] Verify analytics dashboard shows data

## Acceptance Criteria

1. **Chatwoot Deployed**: Self-hosted instance accessible at chatwoot.ozean-licht.dev
2. **Inbox Functional**: Support agents can view all conversations from all channels
3. **Customer Context**: Rich context panel shows user profile, courses, payments, history
4. **Knowledge Base**: Agents can create/edit/publish help articles
5. **Analytics**: Dashboard shows key metrics (volume, response time, CSAT)
6. **RBAC**: Only authorized users can access support features
7. **Responsive**: Inbox usable on mobile devices
8. **Performance**: Inbox loads in < 2 seconds with 100+ conversations

## Validation Commands

Execute these commands to validate the implementation:

- `npm run typecheck` - Ensure no TypeScript errors
- `npm run lint` - Check for linting issues
- `npm run build` - Verify production build succeeds
- `curl http://localhost:3000/api/support/conversations` - Test API endpoint
- `curl http://localhost:8100/health` - Verify Chatwoot is running (if on same server)

## Notes

### Dependencies to Add
```bash
# For Chatwoot API client (if needed)
pnpm add --filter admin axios

# For knowledge base rich text
# Already have TipTap from course builder
```

### Environment Variables to Add
```env
# Chatwoot Integration
CHATWOOT_BASE_URL=https://chatwoot.ozean-licht.dev
CHATWOOT_API_KEY=your_api_key
CHATWOOT_WEBHOOK_SECRET=webhook_signing_secret
CHATWOOT_ACCOUNT_ID=1
```

### Chatwoot Configuration Notes
- Deploy version 3.x (latest stable)
- Enable API access for admin account
- Configure webhook to point to `/api/support/webhooks/chatwoot`
- Set up inboxes: Web Widget, WhatsApp (future), Email (future)
- Create teams: Tech Support, Sales, Spiritual, General
- Import existing users as contacts via API (migration task)

### Future Enhancements (Out of Scope)
- WhatsApp Business API integration
- Telegram bot connection
- AI-powered response suggestions (Claude API)
- Proactive support triggers (user struggling detection)
- Video/screen sharing support
- Voice calling integration
- Community forum integration

### Multi-Tenant Considerations
- Separate Chatwoot inboxes for Ozean Licht vs Kids Ascension
- Platform-specific widget branding
- Team routing per platform
- Analytics filtering by platform

---

*Created: 2025-12-04 | Complexity: Complex | Type: Feature | Estimated: 12-15 days*
