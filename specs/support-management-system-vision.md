# Plan: Support Management System - Vision & Concept

## Task Description
Design and prototype a comprehensive Support Management System for the Ozean Licht ecosystem that serves both Kids Ascension (educational platform) and Ozean Licht (course platform) communities. The system will provide unified ticket management, knowledge base, live chat support, and self-service tools while maintaining multi-tenant separation and integrating with the existing admin dashboard infrastructure.

## Objective
Create a modern, scalable support platform that:
- Reduces response time to user inquiries by 60% through automation and intelligent routing
- Enables self-service resolution for 40% of common issues via knowledge base
- Provides unified support interface for both KA and OL platforms
- Maintains audit trail and SLA compliance for all support interactions
- Integrates seamlessly with existing authentication, RBAC, and MCP Gateway architecture

## Problem Statement

### Current State
The Ozean Licht ecosystem currently lacks a centralized support management system, leading to:
- **Fragmented Communication**: Support requests scattered across email, social media, and direct messages
- **No SLA Tracking**: Unable to measure or enforce response time commitments
- **Limited Visibility**: No unified view of support queue, priority issues, or resolution metrics
- **Manual Triage**: Support agents manually categorize and route requests without automation
- **Knowledge Gaps**: No centralized knowledge base, leading to repeated answers for common questions
- **Multi-Tenant Challenges**: Difficulty tracking which platform (KA vs OL) each request belongs to
- **Compliance Risk**: No audit trail for support interactions (important for educational platform)

### User Pain Points

**For End Users (Students, Parents, Members):**
- Long wait times for responses (no SLA visibility)
- No way to track ticket status
- Repetitive questions require human intervention
- Unclear how to find answers to common problems

**For Support Staff:**
- Manual ticket creation from various channels
- No prioritization system
- Context switching between platforms
- Duplicate work answering same questions
- No visibility into team workload

**For Administrators:**
- No metrics on support performance
- Cannot identify recurring issues
- Difficulty scaling support operations
- No integration with existing admin dashboard

## Solution Approach

### Architecture Overview

The Support Management System will be built as an **integrated module within the existing admin dashboard**, leveraging the established infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│                    Ozean Licht Ecosystem                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │  Admin Dashboard│  │  Support Management System        │ │
│  │  (Port 9200)    │◄─┤  (New Module)                    │ │
│  │                 │  │                                    │ │
│  │  - NextAuth v5  │  │  - Ticket Management              │ │
│  │  - RBAC System  │  │  - Knowledge Base                 │ │
│  │  - MCP Client   │  │  - Live Chat                      │ │
│  └────────┬────────┘  │  - SLA Monitoring                 │ │
│           │           │  - Multi-Channel Integration      │ │
│           │           └──────────────┬────────────────────┘ │
│           │                          │                       │
│           ▼                          ▼                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            MCP Gateway (Port 8100)                   │   │
│  │  - PostgreSQL Connection Pooling                     │   │
│  │  - Query Execution & Error Handling                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        PostgreSQL Multi-Tenant Databases             │   │
│  │                                                       │   │
│  │  ┌──────────────────┐  ┌───────────────────────┐    │   │
│  │  │ shared_users_db  │  │ support_db (NEW)      │    │   │
│  │  │ - users          │  │ - tickets             │    │   │
│  │  │ - admin_users    │  │ - messages            │    │   │
│  │  │ - sessions       │  │ - knowledge_articles  │    │   │
│  │  └──────────────────┘  │ - sla_policies        │    │   │
│  │                        │ - ticket_categories   │    │   │
│  │  ┌──────────────────┐  │ - canned_responses    │    │   │
│  │  │ kids_ascension_db│  │ - chat_sessions       │    │   │
│  │  │ - (KA entities)  │  │ - feedback_ratings    │    │   │
│  │  └──────────────────┘  └───────────────────────┘    │   │
│  │                                                       │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ ozean_licht_db   │                                │   │
│  │  │ - (OL entities)  │                                │   │
│  │  └──────────────────┘                                │   │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         External Integrations                        │   │
│  │  - Email (SMTP/SendGrid)                             │   │
│  │  - Webhook API (for third-party ticketing)           │   │
│  │  - N8N Automation (escalation workflows)             │   │
│  │  - Mem0 (institutional memory/KB search)             │   │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Multi-Tenant First**: Every ticket, article, and interaction must be scoped to an entity (kids_ascension or ozean_licht)
2. **RBAC Integration**: Leverage existing role system - 'support' role gets new permissions
3. **Audit Everything**: All support interactions logged for compliance (especially important for KA as educational platform)
4. **API-First Design**: RESTful API for future mobile app or third-party integrations
5. **Progressive Enhancement**: Start with MVP (tickets + knowledge base), add advanced features incrementally
6. **Zero Learning Curve**: Follow existing admin dashboard patterns (shadcn/ui, TanStack Table, Server Components)

### Key Features

#### Phase 1: Foundation (MVP)
- **Ticket Management**
  - Create, view, update, close tickets
  - Priority system (low, medium, high, urgent)
  - Status workflow (new → assigned → in_progress → resolved → closed)
  - Assignment to support agents
  - Multi-channel ticket creation (manual, email, API webhook)
  - Rich text responses with file attachments

- **Knowledge Base**
  - Article CRUD operations
  - Category organization
  - Search functionality (full-text + semantic via Mem0)
  - Public/private articles (private = internal use only)
  - View tracking and analytics

- **Basic Reporting**
  - Ticket volume by day/week/month
  - Average response time
  - Average resolution time
  - Agent performance metrics

#### Phase 2: Automation & Intelligence
- **Smart Routing**
  - Auto-assign tickets based on category, keywords, or agent workload
  - Escalation rules (if ticket open > X hours, escalate)
  - Business hours enforcement

- **AI-Powered Features**
  - Suggested KB articles based on ticket content
  - Canned response recommendations
  - Sentiment analysis (detect frustrated users)
  - Auto-categorization

- **SLA Management**
  - Define SLA policies per entity and priority
  - Track compliance
  - Automatic escalation on SLA breach
  - SLA dashboard

#### Phase 3: Enhanced Communication
- **Live Chat**
  - Real-time chat widget for KA and OL websites
  - Chat → Ticket conversion
  - Agent availability status
  - Typing indicators

- **Multi-Channel Integration**
  - Email integration (parse incoming emails → tickets)
  - WhatsApp/Telegram webhook support
  - Social media monitoring (optional)

- **Internal Collaboration**
  - Internal notes on tickets (not visible to users)
  - @mention support team members
  - Ticket transfer between agents

#### Phase 4: Advanced & Analytics
- **Customer Portal**
  - Users can submit tickets
  - View ticket history
  - Browse knowledge base
  - Rate support interactions

- **Advanced Analytics**
  - Trend analysis (recurring issues)
  - Agent productivity reports
  - Customer satisfaction scores (CSAT)
  - First-contact resolution rate
  - Support cost per ticket

- **Workflow Automation**
  - N8N integration for complex workflows
  - Webhook triggers (ticket created, resolved, etc.)
  - Custom automation rules

### Technology Stack

**Frontend (Admin Dashboard Integration):**
- Next.js 14 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui components
- TanStack Table (for ticket list)
- TanStack Query (for real-time updates)
- Lexical or Tiptap (rich text editor)
- Socket.io (for live chat)

**Backend (API Layer):**
- Next.js API Routes (`/api/support/*`)
- NextAuth v5 (authentication)
- MCP Gateway (database operations)
- PostgreSQL (support_db)

**External Services:**
- Mem0 (semantic search for KB articles)
- N8N (workflow automation)
- SendGrid (email notifications)
- MinIO/R2 (file attachment storage)

## Relevant Files

### Existing Files to Reference
- `apps/admin/lib/auth/config.ts` - Authentication patterns
- `apps/admin/lib/rbac/constants.ts` - RBAC role definitions (need to add support permissions)
- `apps/admin/lib/rbac/permissions.ts` - Permission logic
- `apps/admin/lib/mcp-client/queries.ts` - Database query patterns
- `apps/admin/lib/mcp-client/client.ts` - MCP Gateway client
- `apps/admin/types/admin.ts` - Type definitions to extend
- `apps/admin/components/dashboard/Sidebar.tsx` - Navigation (add Support section)
- `apps/admin/components/data-table/*.tsx` - Table components to reuse
- `apps/admin/components/admin/form/*.tsx` - Form patterns
- `tools/mcp-gateway/src/index.ts` - MCP Gateway entry point

### New Files to Create

#### Database Schema
- `apps/support-management/database/schema.sql` - PostgreSQL schema for support_db
- `apps/support-management/database/migrations/001_initial_setup.sql` - Initial migration

#### Types
- `apps/support-management/types/ticket.ts` - Ticket entity types
- `apps/support-management/types/knowledge-base.ts` - KB article types
- `apps/support-management/types/sla.ts` - SLA policy types
- `apps/support-management/types/chat.ts` - Live chat types

#### MCP Client Extensions
- `apps/admin/lib/mcp-client/support-queries.ts` - Support-specific queries
- `apps/admin/lib/mcp-client/kb-queries.ts` - Knowledge base queries

#### API Routes
- `apps/admin/app/api/support/tickets/route.ts` - List/create tickets
- `apps/admin/app/api/support/tickets/[id]/route.ts` - Ticket CRUD
- `apps/admin/app/api/support/tickets/[id]/messages/route.ts` - Ticket messages
- `apps/admin/app/api/support/kb/route.ts` - List/create KB articles
- `apps/admin/app/api/support/kb/[id]/route.ts` - Article CRUD
- `apps/admin/app/api/support/kb/search/route.ts` - Search articles
- `apps/admin/app/api/support/sla/route.ts` - SLA policies

#### UI Components (Admin Dashboard)
- `apps/admin/app/dashboard/support/page.tsx` - Support dashboard home
- `apps/admin/app/dashboard/support/tickets/page.tsx` - Ticket list
- `apps/admin/app/dashboard/support/tickets/[id]/page.tsx` - Ticket detail
- `apps/admin/app/dashboard/support/tickets/columns.tsx` - Table columns
- `apps/admin/app/dashboard/support/tickets/TicketsDataTable.tsx` - Data table
- `apps/admin/app/dashboard/support/kb/page.tsx` - KB article list
- `apps/admin/app/dashboard/support/kb/[id]/page.tsx` - Article editor
- `apps/admin/app/dashboard/support/analytics/page.tsx` - Support analytics
- `apps/admin/components/support/TicketCard.tsx` - Ticket card component
- `apps/admin/components/support/MessageThread.tsx` - Message thread component
- `apps/admin/components/support/CategorySelect.tsx` - Category dropdown
- `apps/admin/components/support/PriorityBadge.tsx` - Priority indicator
- `apps/admin/components/support/StatusBadge.tsx` - Status indicator
- `apps/admin/components/support/SLATimer.tsx` - SLA countdown timer

#### Configuration
- `apps/support-management/specs/support-management-system-vision.md` - This document
- `apps/support-management/specs/support-api-spec.md` - API specification (to create)
- `apps/support-management/specs/support-database-schema.md` - Database design (to create)

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3) - MVP
**Goal:** Launch basic ticket management and knowledge base

#### 1.1 Database Setup (3 days)
- Design `support_db` schema (tickets, messages, kb_articles, categories)
- Create migration scripts
- Add support tables to existing MCP Gateway configuration
- Set up proper indexes for performance

#### 1.2 RBAC Integration (2 days)
- Extend `lib/rbac/permissions.ts` with support permissions:
  - `support.tickets.create`
  - `support.tickets.read`
  - `support.tickets.update`
  - `support.tickets.assign`
  - `support.tickets.close`
  - `support.kb.create`
  - `support.kb.read`
  - `support.kb.update`
  - `support.kb.publish`
- Update `lib/rbac/constants.ts` role definitions
- Add support section to admin dashboard sidebar

#### 1.3 MCP Client Queries (4 days)
- Implement `support-queries.ts` with methods:
  - `listTickets()` with filters
  - `getTicketById()`
  - `createTicket()`
  - `updateTicket()`
  - `addTicketMessage()`
  - `getTicketMessages()`
  - `assignTicket()`
  - `closeTicket()`
- Implement `kb-queries.ts` with methods:
  - `listArticles()`
  - `getArticleById()`
  - `createArticle()`
  - `updateArticle()`
  - `searchArticles()`
- Add audit logging for all support operations

#### 1.4 Ticket Management UI (7 days)
- Create ticket list page with data table (filters: status, priority, entity, assignee)
- Build ticket detail page with message thread
- Add rich text editor for responses
- Implement file attachment handling (MinIO/R2)
- Create ticket creation form
- Add assignment dropdown
- Build status transition workflow UI

#### 1.5 Knowledge Base UI (4 days)
- Create article list page
- Build article editor (markdown or rich text)
- Add category management
- Implement search interface
- Create article preview/view mode
- Add publish/unpublish toggle

### Phase 2: Automation & Intelligence (Weeks 4-5)
**Goal:** Reduce manual work through smart routing and AI features

#### 2.1 Smart Routing Engine (5 days)
- Build rule engine for auto-assignment
- Implement category-based routing
- Add workload balancing algorithm
- Create escalation rules
- Build admin UI for routing configuration

#### 2.2 AI Integration (5 days)
- Integrate Mem0 for semantic KB search
- Implement suggested articles feature (show relevant KB articles when viewing ticket)
- Add auto-categorization (ML model or keyword matching)
- Build canned response system with suggestions

#### 2.3 SLA Management (5 days)
- Define SLA policy schema
- Implement SLA tracking service
- Add SLA timer UI component
- Create escalation automation
- Build SLA compliance dashboard

### Phase 3: Enhanced Communication (Weeks 6-7)
**Goal:** Add real-time support capabilities

#### 3.1 Live Chat Foundation (5 days)
- Set up Socket.io server
- Create chat_sessions table
- Build chat API endpoints
- Implement agent presence system
- Add chat message storage

#### 3.2 Chat Widget (5 days)
- Build embeddable chat widget for KA/OL websites
- Create chat UI in admin dashboard
- Implement typing indicators
- Add chat → ticket conversion
- Build chat history viewer

#### 3.3 Email Integration (5 days)
- Set up email parser (incoming emails → tickets)
- Implement reply-by-email functionality
- Add email template system
- Build email notification system
- Create email preference management

### Phase 4: Advanced Features (Weeks 8-10)
**Goal:** Complete the ecosystem with analytics and customer portal

#### 4.1 Customer Portal (7 days)
- Build public-facing ticket submission form
- Create customer ticket history page
- Add ticket status tracking
- Implement customer authentication (existing users)
- Build feedback/rating system

#### 4.2 Advanced Analytics (7 days)
- Create comprehensive analytics dashboard
- Build trend analysis (recurring issues detection)
- Add agent productivity reports
- Implement CSAT tracking
- Create exportable reports (PDF/CSV)

#### 4.3 Workflow Automation (6 days)
- Design webhook system
- Integrate with N8N for complex workflows
- Build custom automation rule builder
- Add trigger system (on ticket creation, status change, etc.)
- Create automation testing interface

## Step by Step Tasks

### 1. Environment Setup & Planning
- Create `apps/support-management/` directory structure
- Set up `support_db` PostgreSQL database
- Document API endpoints in `support-api-spec.md`
- Create database schema documentation in `support-database-schema.md`
- Define ticket lifecycle states and transitions

### 2. Database Schema Design
- Design `tickets` table (id, title, description, status, priority, entity_scope, created_by, assigned_to, created_at, updated_at, resolved_at, closed_at)
- Design `ticket_messages` table (id, ticket_id, user_id, message, is_internal, created_at)
- Design `ticket_categories` table (id, name, description, entity_scope, default_assignee)
- Design `knowledge_articles` table (id, title, content, category_id, entity_scope, is_published, views, created_by, created_at, updated_at)
- Design `article_categories` table (id, name, description, entity_scope, parent_id for nesting)
- Design `sla_policies` table (id, name, entity_scope, priority, response_time_hours, resolution_time_hours)
- Design `canned_responses` table (id, title, content, category_id, usage_count)
- Design `ticket_attachments` table (id, ticket_id, filename, file_path, uploaded_by, created_at)
- Design `chat_sessions` table (id, user_id, agent_id, entity_scope, status, started_at, ended_at)
- Design `chat_messages` table (id, session_id, sender_id, message, created_at)
- Design `feedback_ratings` table (id, ticket_id, rating, comment, created_at)
- Create indexes for performance (entity_scope, status, assigned_to, created_at)
- Write migration scripts

### 3. RBAC Extension
- Add support permissions to `lib/rbac/permission-categories.ts`:
  ```typescript
  SUPPORT: {
    'support.tickets.create': { description: 'Create support tickets', category: 'SUPPORT' },
    'support.tickets.read': { description: 'View support tickets', category: 'SUPPORT' },
    'support.tickets.update': { description: 'Update ticket details', category: 'SUPPORT' },
    'support.tickets.assign': { description: 'Assign tickets to agents', category: 'SUPPORT' },
    'support.tickets.close': { description: 'Close/resolve tickets', category: 'SUPPORT' },
    'support.kb.create': { description: 'Create KB articles', category: 'SUPPORT' },
    'support.kb.read': { description: 'View KB articles', category: 'SUPPORT' },
    'support.kb.update': { description: 'Edit KB articles', category: 'SUPPORT' },
    'support.kb.publish': { description: 'Publish KB articles', category: 'SUPPORT' },
  }
  ```
- Update `lib/rbac/constants.ts` to grant permissions to 'support' role
- Update sidebar navigation to add Support section

### 4. Type Definitions
- Create `apps/support-management/types/ticket.ts` with:
  - `TicketStatus`, `TicketPriority`, `Ticket`, `TicketMessage`, `TicketFilters`, `CreateTicketInput`, `UpdateTicketInput`
- Create `apps/support-management/types/knowledge-base.ts` with:
  - `KBArticle`, `ArticleCategory`, `CreateArticleInput`, `UpdateArticleInput`, `ArticleFilters`
- Create `apps/support-management/types/sla.ts` with:
  - `SLAPolicy`, `SLATracking`, `SLAStatus`
- Update `apps/admin/types/admin.ts` to import support types if needed

### 5. MCP Client Query Extensions
- Create `apps/admin/lib/mcp-client/support-queries.ts` extending `MCPGatewayClientWithQueries`:
  - `listTickets(filters: TicketFilters): Promise<Ticket[]>`
  - `getTicketById(id: string): Promise<Ticket | null>`
  - `createTicket(input: CreateTicketInput): Promise<Ticket>`
  - `updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket>`
  - `assignTicket(id: string, agentId: string): Promise<void>`
  - `addTicketMessage(ticketId: string, message: string, isInternal: boolean): Promise<TicketMessage>`
  - `getTicketMessages(ticketId: string): Promise<TicketMessage[]>`
  - `closeTicket(id: string, resolution: string): Promise<void>`
  - `getTicketStats(): Promise<TicketStats>` (for dashboard)
- Create `apps/admin/lib/mcp-client/kb-queries.ts`:
  - `listArticles(filters: ArticleFilters): Promise<KBArticle[]>`
  - `getArticleById(id: string): Promise<KBArticle | null>`
  - `createArticle(input: CreateArticleInput): Promise<KBArticle>`
  - `updateArticle(id: string, input: UpdateArticleInput): Promise<KBArticle>`
  - `searchArticles(query: string): Promise<KBArticle[]>`
  - `incrementArticleViews(id: string): Promise<void>`
- Add audit logging calls for all mutations

### 6. API Route Implementation
- Create `apps/admin/app/api/support/tickets/route.ts`:
  - `GET /api/support/tickets` - List tickets with filters
  - `POST /api/support/tickets` - Create new ticket
- Create `apps/admin/app/api/support/tickets/[id]/route.ts`:
  - `GET /api/support/tickets/:id` - Get ticket details
  - `PATCH /api/support/tickets/:id` - Update ticket
  - `DELETE /api/support/tickets/:id` - Soft delete ticket
- Create `apps/admin/app/api/support/tickets/[id]/messages/route.ts`:
  - `GET /api/support/tickets/:id/messages` - Get ticket messages
  - `POST /api/support/tickets/:id/messages` - Add message
- Create `apps/admin/app/api/support/kb/route.ts`:
  - `GET /api/support/kb` - List articles
  - `POST /api/support/kb` - Create article
- Create `apps/admin/app/api/support/kb/[id]/route.ts`:
  - `GET /api/support/kb/:id` - Get article
  - `PATCH /api/support/kb/:id` - Update article
  - `DELETE /api/support/kb/:id` - Delete article
- Create `apps/admin/app/api/support/kb/search/route.ts`:
  - `GET /api/support/kb/search?q=query` - Search articles
- Add proper authentication and RBAC checks to all routes

### 7. UI Components - Shared
- Create `apps/admin/components/support/PriorityBadge.tsx` - Priority indicator (low=gray, medium=blue, high=orange, urgent=red)
- Create `apps/admin/components/support/StatusBadge.tsx` - Status indicator
- Create `apps/admin/components/support/CategorySelect.tsx` - Category dropdown
- Create `apps/admin/components/support/EntityBadge.tsx` - KA/OL indicator (reuse from existing)
- Create `apps/admin/components/support/SLATimer.tsx` - Countdown timer showing time until SLA breach
- Create `apps/admin/components/support/AssigneeSelect.tsx` - Agent assignment dropdown
- Create `apps/admin/components/support/RichTextEditor.tsx` - Rich text editor for messages (using Lexical or Tiptap)
- Create `apps/admin/components/support/FileUpload.tsx` - File attachment component

### 8. Ticket Management Pages
- Create `apps/admin/app/dashboard/support/page.tsx`:
  - Support dashboard overview (open tickets, response time, SLA compliance)
  - Quick stats cards
  - Recent activity feed
- Create `apps/admin/app/dashboard/support/tickets/page.tsx`:
  - Ticket list with TanStack Table
  - Filters: status, priority, entity, assigned to, date range
  - Search by ticket ID or keywords
  - Bulk actions (assign, close)
- Create `apps/admin/app/dashboard/support/tickets/columns.tsx`:
  - Column definitions for ticket table
  - Sortable columns: priority, status, created_at, updated_at
- Create `apps/admin/app/dashboard/support/tickets/TicketsDataTable.tsx`:
  - Client data table component
  - Pagination, sorting, filtering
- Create `apps/admin/app/dashboard/support/tickets/[id]/page.tsx`:
  - Ticket detail view
  - Message thread
  - Rich text editor for replies
  - Sidebar: priority, status, assignee, category, timestamps
  - Internal notes toggle
  - Attachment list
- Create `apps/admin/components/support/TicketCard.tsx`:
  - Ticket summary card component
- Create `apps/admin/components/support/MessageThread.tsx`:
  - Message thread component with timeline view

### 9. Knowledge Base Pages
- Create `apps/admin/app/dashboard/support/kb/page.tsx`:
  - Article list with categories
  - Search functionality
  - Filter by entity, published status, category
- Create `apps/admin/app/dashboard/support/kb/[id]/page.tsx`:
  - Article editor (create/edit)
  - Markdown or rich text content
  - Category selection
  - Publish/unpublish toggle
  - Preview mode
  - View count display
- Create `apps/admin/app/dashboard/support/kb/categories/page.tsx`:
  - Category management (CRUD)
  - Nested categories support
- Create `apps/admin/components/support/ArticleCard.tsx`:
  - Article summary card
- Create `apps/admin/components/support/ArticleSearch.tsx`:
  - KB search widget

### 10. Analytics Dashboard
- Create `apps/admin/app/dashboard/support/analytics/page.tsx`:
  - Ticket volume charts (line chart by day/week/month)
  - Response time metrics
  - Resolution time metrics
  - Agent performance table
  - Top categories by volume
  - Entity breakdown (KA vs OL)
  - SLA compliance percentage
  - Customer satisfaction scores
- Use Recharts for visualizations

### 11. Integration & Testing
- Test ticket creation flow end-to-end
- Test message thread real-time updates
- Test file attachment upload/download
- Test KB article search (full-text and semantic)
- Test RBAC enforcement (support role can access, others cannot)
- Test entity scoping (KA admin only sees KA tickets)
- Test audit logging (all actions logged)
- Load test with 1000+ tickets
- Test email notifications (ticket created, assigned, resolved)

### 12. Documentation & Deployment
- Write user guide for support agents
- Document API endpoints with examples
- Create video tutorial for ticket management
- Update admin dashboard README
- Deploy to staging environment
- User acceptance testing with support team
- Deploy to production
- Monitor performance and error rates

## Testing Strategy

### Unit Tests
- Test ticket status transitions (new → assigned → in_progress → resolved → closed)
- Test SLA calculation logic
- Test permission checks (support.tickets.read, etc.)
- Test search functionality (keyword matching, filters)
- Test entity scoping (users only see tickets for their entity)

### Integration Tests
- Test ticket creation → assignment → message → resolution flow
- Test KB article creation → search → view tracking
- Test email notification triggers
- Test file upload → storage → retrieval
- Test audit log creation for all actions

### E2E Tests (Playwright)
- Test full ticket workflow from admin perspective
- Test knowledge base search from user perspective
- Test live chat (if implemented)
- Test analytics dashboard data accuracy

### Performance Tests
- Load test: 10,000 tickets with pagination
- Concurrent users: 50 agents accessing system simultaneously
- Search performance: <500ms for KB search
- Real-time updates: <100ms latency for chat

### Security Tests
- Test RBAC enforcement (unauthorized access attempts)
- Test SQL injection prevention (all queries parameterized)
- Test XSS prevention (rich text sanitization)
- Test CSRF protection (NextAuth handles this)
- Test file upload validation (allowed types, size limits)

## Acceptance Criteria

### Phase 1: Foundation MVP
- [ ] Support agents can create tickets with title, description, priority, category
- [ ] Support agents can view list of tickets filtered by status, priority, entity, assignee
- [ ] Support agents can view ticket detail with full message thread
- [ ] Support agents can add messages (public and internal notes) to tickets
- [ ] Support agents can assign tickets to themselves or other agents
- [ ] Support agents can change ticket status (new → assigned → in_progress → resolved → closed)
- [ ] Support agents can close tickets with resolution notes
- [ ] KB editors can create articles with title, content, category
- [ ] KB editors can publish/unpublish articles
- [ ] KB editors can search articles by keyword
- [ ] Users can view published KB articles
- [ ] System tracks article views
- [ ] All support actions are audit logged
- [ ] Entity scoping enforced (KA admins only see KA tickets, OL admins see OL tickets)
- [ ] RBAC permissions work correctly (support role has access, others don't)
- [ ] Dashboard shows key metrics (open tickets, avg response time, avg resolution time)

### Phase 2: Automation & Intelligence
- [ ] Tickets are auto-assigned based on category or workload
- [ ] Escalation rules trigger after defined time periods
- [ ] KB search shows relevant articles based on ticket content
- [ ] Canned responses available for common questions
- [ ] SLA policies defined per entity and priority
- [ ] SLA timer visible on ticket detail page
- [ ] SLA breaches trigger notifications

### Phase 3: Enhanced Communication
- [ ] Live chat widget embeds on KA and OL websites
- [ ] Agents can accept chat sessions
- [ ] Chat messages appear in real-time
- [ ] Chat sessions can be converted to tickets
- [ ] Email integration parses incoming emails into tickets
- [ ] Users receive email notifications for ticket updates

### Phase 4: Advanced Features
- [ ] Customers can submit tickets from public portal
- [ ] Customers can view their ticket history
- [ ] Customers can rate support interactions
- [ ] Analytics dashboard shows trends and insights
- [ ] Agent productivity reports available
- [ ] Webhook system triggers N8N workflows

## Validation Commands

### Database Setup
```bash
# Connect to PostgreSQL
psql -h localhost -U postgres

# Verify support_db created
\l support_db

# Verify tables created
\c support_db
\dt

# Check indexes
\di

# Verify MCP Gateway can connect
curl http://localhost:8100/health
```

### MCP Client Tests
```bash
# Run unit tests
cd apps/admin
pnpm test lib/mcp-client/support-queries.test.ts
pnpm test lib/mcp-client/kb-queries.test.ts
```

### API Routes
```bash
# Test ticket creation
curl -X POST http://localhost:9200/api/support/tickets \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"title":"Test ticket","description":"Test","priority":"medium","entityScope":"kids_ascension"}'

# Test ticket list
curl http://localhost:9200/api/support/tickets?status=open

# Test KB search
curl http://localhost:9200/api/support/kb/search?q=password
```

### UI Tests
```bash
# Type checking
cd apps/admin
pnpm typecheck

# Linting
pnpm lint

# Run E2E tests
pnpm test:e2e
```

### Performance Validation
```bash
# Load test ticket list (requires Apache Bench or similar)
ab -n 1000 -c 50 http://localhost:9200/api/support/tickets

# Check query performance (PostgreSQL)
psql -h localhost -U postgres -d support_db
EXPLAIN ANALYZE SELECT * FROM tickets WHERE status = 'open' LIMIT 50;
```

### Deployment
```bash
# Build admin dashboard
cd apps/admin
pnpm build

# Start production server
pnpm start

# Verify support routes accessible
curl https://admin.ozean-licht.dev/dashboard/support
```

## Notes

### Technology Choices

**Rich Text Editor:**
- **Option 1: Lexical** (Facebook's editor, modern, extensible)
- **Option 2: Tiptap** (ProseMirror-based, popular in React ecosystem)
- **Recommendation:** Tiptap for faster implementation (better docs, more examples)

**Real-Time Communication:**
- **Option 1: Socket.io** (simple, widely used)
- **Option 2: Pusher** (managed service, easier to scale)
- **Recommendation:** Socket.io for MVP (self-hosted, no vendor lock-in)

**Search:**
- **Phase 1:** PostgreSQL full-text search (built-in, fast enough for MVP)
- **Phase 2:** Mem0 integration for semantic search (better relevance)

### Database Considerations

**Entity Scoping:**
- Every support table must have `entity_scope` column (kids_ascension | ozean_licht | null)
- `null` scope = applies to both platforms (e.g., billing issues)

**Soft Deletes:**
- Use `deleted_at` timestamp instead of hard deletes
- Maintains audit trail
- Allows ticket restoration

**Indexing Strategy:**
- Composite index on `(entity_scope, status, created_at)` for ticket list queries
- Full-text index on `tickets.description` and `ticket_messages.message` for search
- Index on `assigned_to` for agent workload queries

### Security & Privacy

**Data Retention:**
- Tickets: Retain indefinitely (compliance requirement for educational platform)
- Chat sessions: Retain 90 days, then archive to cold storage
- Attachments: Retain with ticket, but add size quotas per entity

**PII Handling:**
- User email/name pulled from `shared_users_db` at query time (not duplicated)
- Support agents see only necessary user information
- Sensitive fields (e.g., payment info) redacted in ticket view

**Access Control:**
- Support agents can only view tickets for their entity (unless super_admin)
- Internal notes visible only to support role
- Public KB articles visible to all, private articles only to support role

### Scaling Considerations

**Database Sharding (Future):**
- If ticket volume exceeds 1M+ per entity, consider sharding by entity_scope
- Separate `support_db_ka` and `support_db_ol`

**Caching:**
- Redis cache for KB articles (high read, low write)
- Cache ticket stats (refresh every 5 minutes)

**File Storage:**
- Start with MinIO (hot storage)
- Archive to Cloudflare R2 after 90 days
- Max attachment size: 10MB per file, 50MB per ticket

### Dependencies to Add

```bash
# Rich text editor
pnpm add tiptap @tiptap/react @tiptap/starter-kit

# Real-time communication
pnpm add socket.io socket.io-client

# Charts
pnpm add recharts

# Date utilities
pnpm add date-fns

# File upload
pnpm add react-dropzone
```

### Future Enhancements (Post-MVP)

**AI-Powered Automation:**
- GPT-4 integration for auto-response generation
- Sentiment analysis for frustrated user detection
- Ticket summarization for long threads

**Mobile App:**
- React Native app for support agents
- Push notifications for new ticket assignments
- Offline mode for viewing ticket history

**Multi-Language Support:**
- i18n for UI (German + English)
- Auto-translate ticket content for international support

**Advanced Reporting:**
- Cohort analysis (support metrics by user cohort)
- Predictive analytics (forecast ticket volume)
- Cost per ticket analysis

**Third-Party Integrations:**
- Slack notifications for urgent tickets
- Zapier integration for custom workflows
- CRM integration (HubSpot, Salesforce)

### Success Metrics (6 Months Post-Launch)

- **Response Time:** Average < 2 hours (down from current unknown baseline)
- **Resolution Time:** Average < 24 hours for non-urgent tickets
- **Self-Service Rate:** 40% of users find answers in KB without ticket
- **First-Contact Resolution:** 60% of tickets resolved in first response
- **CSAT Score:** >4.0/5.0 average rating
- **SLA Compliance:** >95% of tickets meet SLA
- **Agent Productivity:** Each agent handles 30+ tickets/day

---

## Appendix: Database Schema (Detailed)

### Core Tables

#### tickets
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "KA-2024-00123"
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, assigned, in_progress, resolved, closed
  priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  category_id UUID REFERENCES ticket_categories(id),
  entity_scope VARCHAR(50) NOT NULL, -- kids_ascension, ozean_licht, null
  created_by UUID NOT NULL REFERENCES users(id), -- from shared_users_db
  assigned_to UUID REFERENCES users(id), -- agent
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES users(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Indexes
  INDEX idx_tickets_entity_status (entity_scope, status, created_at),
  INDEX idx_tickets_assigned_to (assigned_to, status),
  INDEX idx_tickets_created_by (created_by)
);
```

#### ticket_messages
```sql
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false, -- internal notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  INDEX idx_messages_ticket_id (ticket_id, created_at)
);
```

#### ticket_categories
```sql
CREATE TABLE ticket_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  entity_scope VARCHAR(50), -- kids_ascension, ozean_licht, null (both)
  default_assignee UUID REFERENCES users(id), -- auto-assign to this agent
  parent_id UUID REFERENCES ticket_categories(id), -- for nested categories
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(name, entity_scope)
);
```

### Knowledge Base Tables

#### knowledge_articles
```sql
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES article_categories(id),
  entity_scope VARCHAR(50) NOT NULL, -- kids_ascension, ozean_licht, null
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_internal BOOLEAN NOT NULL DEFAULT false, -- internal-only articles
  views INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  INDEX idx_articles_entity_published (entity_scope, is_published),
  INDEX idx_articles_search gin(to_tsvector('english', title || ' ' || content))
);
```

#### article_categories
```sql
CREATE TABLE article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  entity_scope VARCHAR(50),
  parent_id UUID REFERENCES article_categories(id),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(name, entity_scope)
);
```

### SLA Tables

#### sla_policies
```sql
CREATE TABLE sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  entity_scope VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL, -- low, medium, high, urgent
  response_time_hours INT NOT NULL, -- hours until first response
  resolution_time_hours INT NOT NULL, -- hours until resolution
  business_hours_only BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(entity_scope, priority)
);
```

#### sla_tracking
```sql
CREATE TABLE sla_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES sla_policies(id),
  response_due_at TIMESTAMPTZ NOT NULL,
  resolution_due_at TIMESTAMPTZ NOT NULL,
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  response_sla_met BOOLEAN,
  resolution_sla_met BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  INDEX idx_sla_tracking_ticket_id (ticket_id),
  INDEX idx_sla_tracking_due_dates (response_due_at, resolution_due_at)
);
```

### Additional Tables

#### canned_responses
```sql
CREATE TABLE canned_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES ticket_categories(id),
  shortcut VARCHAR(50), -- e.g., "/password-reset"
  usage_count INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### ticket_attachments
```sql
CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES ticket_messages(id), -- optional: link to specific message
  filename VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL, -- MinIO/R2 path
  file_size INT NOT NULL, -- bytes
  mime_type VARCHAR(100),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  INDEX idx_attachments_ticket_id (ticket_id)
);
```

#### feedback_ratings
```sql
CREATE TABLE feedback_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(ticket_id, created_by)
);
```

---

**Document Version:** 1.0
**Created:** 2025-11-12
**Last Updated:** 2025-11-12
**Status:** Vision & Concept - Awaiting Approval
**Next Steps:** Review with stakeholders, refine scope, begin Phase 1 implementation
