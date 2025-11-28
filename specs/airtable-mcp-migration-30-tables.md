# Plan: Airtable MCP Migration (30+ Tables)

## Task Description

Migrate 30+ Airtable tables containing critical business data for Ozean Licht Ecosystem to PostgreSQL via MCP Gateway. This includes videos, courses, transactions, orders, projects, tasks, process templates, event-calendar, and more. The migration involves:

1. Creating an Airtable MCP service handler for data access
2. Designing PostgreSQL schemas for all migrated tables
3. Building data migration scripts
4. Creating admin interfaces for all migrated entities

N8N integration follows in a later phase for advanced automations.

## Objective

When complete, all Airtable data will be:
- Accessible via MCP Gateway (`/mcp/airtable/*` and `/mcp/postgres/*`)
- Stored in PostgreSQL with proper schemas, indexes, and relationships
- Manageable through admin dashboard interfaces with full CRUD capabilities
- Ready for N8N automation integration

## Problem Statement

Airtable has been the primary data store for Ozean Licht Ecosystem, containing 30+ tables of business-critical data. This creates several challenges:
- Data is siloed in a third-party service
- No integration with the MCP Gateway architecture
- Limited querying capabilities compared to PostgreSQL
- No admin interface for team management
- Dependency on external service availability

## Solution Approach

A phased migration strategy:
1. **Phase 1**: Create Airtable MCP handler for read access during transition
2. **Phase 2**: Design and create PostgreSQL schemas matching Airtable structure
3. **Phase 3**: Build migration scripts to transfer data
4. **Phase 4**: Create admin interfaces for each entity group
5. **Phase 5**: Deprecate Airtable access, switch to PostgreSQL-only

## Relevant Files

### MCP Gateway (Service Integration)
- `tools/mcp-gateway/src/mcp/handlers/` - Existing service handlers (reference patterns)
- `tools/mcp-gateway/src/mcp/registry.ts` - Service registration
- `tools/mcp-gateway/src/mcp/initialize.ts` - Service initialization
- `tools/mcp-gateway/config/mcp-catalog.json` - Service catalog
- `tools/mcp-gateway/config/environment.ts` - Environment validation

### Database & Migrations
- `shared/database/migrations/` - Shared database migrations
- `apps/admin/migrations/` - Admin-specific migrations
- `shared/database/prisma/schema.prisma` - Prisma schema reference

### Admin App (Interface Patterns)
- `apps/admin/app/dashboard/` - Dashboard pages
- `apps/admin/components/data-table/` - DataTable components
- `apps/admin/lib/mcp-client/queries.ts` - MCP query patterns
- `apps/admin/types/` - TypeScript type definitions

### New Files

#### MCP Gateway
- `tools/mcp-gateway/src/mcp/handlers/airtable.ts` - Airtable MCP handler

#### Database Migrations
- `shared/database/migrations/010_create_content_tables.sql` - Videos, courses, lessons
- `shared/database/migrations/011_create_commerce_tables.sql` - Transactions, orders, products
- `shared/database/migrations/012_create_project_tables.sql` - Projects, tasks, templates
- `shared/database/migrations/013_create_calendar_tables.sql` - Events, schedules
- `shared/database/migrations/014_create_crm_tables.sql` - Contacts, communications
- `shared/database/migrations/015_create_marketing_tables.sql` - Campaigns, analytics

#### Admin MCP Client
- `apps/admin/lib/mcp-client/content.ts` - Content queries
- `apps/admin/lib/mcp-client/commerce.ts` - Commerce queries
- `apps/admin/lib/mcp-client/projects.ts` - Project queries
- `apps/admin/lib/mcp-client/calendar.ts` - Calendar queries

#### Admin Types
- `apps/admin/types/content.ts` - Content types
- `apps/admin/types/commerce.ts` - Commerce types
- `apps/admin/types/projects.ts` - Project types
- `apps/admin/types/calendar.ts` - Calendar types

#### Admin Pages (per entity group)
- `apps/admin/app/dashboard/content/videos/` - Videos management
- `apps/admin/app/dashboard/content/courses/` - Courses management
- `apps/admin/app/dashboard/commerce/orders/` - Orders management
- `apps/admin/app/dashboard/commerce/transactions/` - Transactions management
- `apps/admin/app/dashboard/tools/projects/` - Projects (exists, extend)
- `apps/admin/app/dashboard/tools/tasks/` - Tasks management
- `apps/admin/app/dashboard/tools/templates/` - Process templates
- `apps/admin/app/dashboard/calendar/events/` - Event calendar

## Implementation Phases

### Phase 1: Airtable MCP Service (Week 1)

Create the Airtable MCP handler to enable read/write access to Airtable data through the MCP Gateway. This provides immediate integration while migration proceeds.

**Deliverables:**
- Airtable handler with full CRUD operations
- Service registration and catalog entry
- Health check endpoint
- Documentation

### Phase 2: Schema Design & Migration Scripts (Week 2-3)

Design PostgreSQL schemas that map Airtable structure while optimizing for relational queries. Create migration scripts for one-time data transfer.

**Deliverables:**
- 6 migration files covering all 30+ tables
- Data migration scripts (Airtable → PostgreSQL)
- Rollback scripts
- Schema documentation

### Phase 3: Core Admin Interfaces (Week 4-6)

Build admin dashboard pages for the most critical entities: courses, videos, orders, and projects.

**Deliverables:**
- Content management (videos, courses, lessons)
- Commerce management (orders, transactions)
- Project management (projects, tasks)
- Shared components (entity cards, status badges)

### Phase 4: Extended Admin Interfaces (Week 7-8)

Complete remaining admin interfaces for calendar, templates, CRM, and marketing.

**Deliverables:**
- Calendar management (events, schedules)
- Template management (process templates)
- CRM interfaces (contacts, communications)
- Marketing interfaces (campaigns)

### Phase 5: Data Migration & Cutover (Week 9)

Execute the actual data migration and switch from Airtable to PostgreSQL.

**Deliverables:**
- Data validation reports
- Migration execution
- Airtable handler deprecation
- Production cutover

## Step by Step Tasks

### 1. Create Airtable MCP Handler

- Create `tools/mcp-gateway/src/mcp/handlers/airtable.ts` with:
  - `AirtableHandler` class implementing `MCPHandler` interface
  - Operations: `list-bases`, `list-tables`, `read-records`, `create-record`, `update-record`, `delete-record`, `health`
  - Axios client for Airtable REST API
  - Pagination support for large record sets
  - Formula filtering support
- Add environment variables to `config/environment.ts`:
  ```typescript
  AIRTABLE_API_KEY: z.string().optional(),
  AIRTABLE_BASE_ID: z.string().optional(),
  ```
- Update `config/mcp-catalog.json` with Airtable service definition
- Add initializer function in `src/mcp/initialize.ts`
- Register service in services array
- Test with `/mcp/test/airtable` endpoint

### 2. Document Airtable Schema

- Connect to Airtable via MCP handler
- List all tables and fields using `list-tables` operation
- Document each table's structure:
  - Table name and ID
  - Field names, types, and constraints
  - Linked record relationships
  - Formula fields and their logic
- Create schema mapping document: `specs/airtable-schema-mapping.md`
- Identify table groupings (content, commerce, projects, calendar, crm, marketing)

### 3. Design PostgreSQL Schemas

- Create migration file `010_create_content_tables.sql`:
  ```sql
  -- Videos table
  CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE, -- For migration tracking
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Courses table
  CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    instructor_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Lessons table (belongs to course)
  CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_id UUID REFERENCES videos(id),
    order_index INTEGER NOT NULL,
    duration_seconds INTEGER,
    is_free_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Modules table (optional grouping within courses)
  CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create migration file `011_create_commerce_tables.sql`:
  ```sql
  -- Products table
  CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    product_type TEXT CHECK (product_type IN ('course', 'membership', 'digital', 'physical')),
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Orders table
  CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded')),
    total_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    billing_address JSONB,
    shipping_address JSONB,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Order items table
  CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    unit_price_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Transactions table
  CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    transaction_type TEXT CHECK (transaction_type IN ('payment', 'refund', 'chargeback', 'payout')),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_provider TEXT,
    provider_transaction_id TEXT,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );
  ```

- Create migration file `012_create_project_tables.sql`:
  ```sql
  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    owner_id UUID REFERENCES users(id),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Tasks table
  CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_id UUID REFERENCES users(id),
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    order_index INTEGER,
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  );

  -- Process templates table
  CREATE TABLE IF NOT EXISTS process_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    steps JSONB NOT NULL DEFAULT '[]', -- Array of step definitions
    estimated_duration_hours DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Task comments table
  CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create migration file `013_create_calendar_tables.sql`:
  ```sql
  -- Events table
  CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('workshop', 'webinar', 'course_session', 'meeting', 'deadline', 'other')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'Europe/Vienna',
    location TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    max_attendees INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'live', 'completed', 'cancelled')),
    host_id UUID REFERENCES users(id),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Event registrations table
  CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    notes TEXT
  );

  -- Recurring event patterns
  CREATE TABLE IF NOT EXISTS event_recurrence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    recurrence_rule TEXT NOT NULL, -- RRULE format
    exceptions JSONB DEFAULT '[]', -- Dates to skip
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create migration file `014_create_crm_tables.sql`:
  ```sql
  -- Contacts table (non-user contacts)
  CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    contact_type TEXT CHECK (contact_type IN ('lead', 'prospect', 'customer', 'partner', 'vendor', 'other')),
    source TEXT,
    user_id UUID REFERENCES users(id), -- Link if they become a user
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Communications log
  CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    contact_id UUID REFERENCES contacts(id),
    user_id UUID REFERENCES users(id),
    communication_type TEXT CHECK (communication_type IN ('email', 'phone', 'meeting', 'note', 'other')),
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    subject TEXT,
    content TEXT,
    sent_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Tags table (for flexible categorization)
  CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT,
    entity_type TEXT NOT NULL, -- 'contact', 'video', 'course', etc.
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, entity_type, entity_scope)
  );

  -- Entity tags junction table
  CREATE TABLE IF NOT EXISTS entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tag_id, entity_type, entity_id)
  );
  ```

- Create migration file `015_create_marketing_tables.sql`:
  ```sql
  -- Campaigns table
  CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    campaign_type TEXT CHECK (campaign_type IN ('email', 'social', 'ads', 'event', 'referral', 'other')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
    start_date DATE,
    end_date DATE,
    budget_cents INTEGER,
    currency TEXT DEFAULT 'EUR',
    target_audience JSONB DEFAULT '{}',
    goals JSONB DEFAULT '{}',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );

  -- Email templates
  CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT,
    body_text TEXT,
    template_type TEXT CHECK (template_type IN ('transactional', 'marketing', 'notification')),
    variables JSONB DEFAULT '[]', -- Available merge variables
    is_active BOOLEAN DEFAULT TRUE,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Analytics events
  CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    properties JSONB DEFAULT '{}',
    context JSONB DEFAULT '{}', -- Device, browser, etc.
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes for analytics performance
  CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING gin(properties);
  ```

### 4. Create Data Migration Scripts

- Create `tools/mcp-gateway/scripts/migrate-airtable.ts`:
  ```typescript
  // Script to migrate data from Airtable to PostgreSQL
  // Usage: npx ts-node scripts/migrate-airtable.ts [table-name]

  import { AirtableHandler } from '../src/mcp/handlers/airtable';
  import { PostgreSQLHandler } from '../src/mcp/handlers/postgres';

  const TABLE_MAPPINGS = {
    'Videos': { pg_table: 'videos', transform: transformVideo },
    'Courses': { pg_table: 'courses', transform: transformCourse },
    'Orders': { pg_table: 'orders', transform: transformOrder },
    // ... more mappings
  };

  async function migrateTable(tableName: string) {
    // 1. Fetch all records from Airtable
    // 2. Transform each record
    // 3. Insert into PostgreSQL
    // 4. Log migration results
  }
  ```

- Create transformation functions for each table type
- Add validation to ensure data integrity
- Create rollback capability
- Add progress logging and error handling

### 5. Create Admin TypeScript Types

- Create `apps/admin/types/content.ts`:
  ```typescript
  export interface Video {
    id: string;
    airtableId?: string;
    title: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    status: 'draft' | 'published' | 'archived';
    entityScope?: 'ozean_licht' | 'kids_ascension';
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown>;
  }

  export interface Course {
    id: string;
    airtableId?: string;
    title: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
    priceCents: number;
    currency: string;
    status: 'draft' | 'published' | 'archived';
    entityScope?: 'ozean_licht' | 'kids_ascension';
    instructorId?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown>;
  }

  export interface Lesson {
    id: string;
    airtableId?: string;
    courseId: string;
    title: string;
    description?: string;
    videoId?: string;
    orderIndex: number;
    durationSeconds?: number;
    isFreePreview: boolean;
    createdAt: string;
    updatedAt: string;
  }
  ```

- Create `apps/admin/types/commerce.ts` with Order, Transaction, Product types
- Create `apps/admin/types/projects.ts` with Project, Task, ProcessTemplate types
- Create `apps/admin/types/calendar.ts` with Event, EventRegistration types

### 6. Create Admin MCP Client Methods

- Add to `apps/admin/lib/mcp-client/content.ts`:
  ```typescript
  export class ContentQueries {
    constructor(private client: MCPGatewayClientWithQueries) {}

    async listVideos(options: ListOptions): Promise<PaginatedResult<Video>> {
      return this.client.query({
        database: 'shared-users-db',
        query: `
          SELECT * FROM videos
          WHERE ($1::text IS NULL OR entity_scope = $1)
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `,
        params: [options.entityScope, options.limit, options.offset]
      });
    }

    async getVideo(id: string): Promise<Video | null> { /* ... */ }
    async createVideo(data: CreateVideoInput): Promise<Video> { /* ... */ }
    async updateVideo(id: string, data: UpdateVideoInput): Promise<Video> { /* ... */ }
    async deleteVideo(id: string): Promise<void> { /* ... */ }

    // Similar methods for courses, lessons, modules
  }
  ```

- Create similar query classes for commerce, projects, calendar, crm, marketing

### 7. Create Videos Admin Interface

- Create `apps/admin/app/dashboard/content/videos/page.tsx`:
  ```typescript
  import { Suspense } from 'react';
  import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
  import { VideosDataTable } from './VideosDataTable';
  import { contentQueries } from '@/lib/mcp-client/content';

  export default async function VideosPage() {
    const videos = await contentQueries.listVideos({ limit: 50 });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Videos</h1>
          <AddVideoButton />
        </div>
        <Suspense fallback={<DataTableSkeleton />}>
          <VideosDataTable data={videos.data} />
        </Suspense>
      </div>
    );
  }
  ```

- Create `VideosDataTable.tsx` with columns for title, status, duration, entity, actions
- Create video detail/edit page at `videos/[id]/page.tsx`
- Add API routes at `app/api/content/videos/route.ts`

### 8. Create Courses Admin Interface

- Create `apps/admin/app/dashboard/content/courses/page.tsx`
- Create `CoursesDataTable.tsx` with columns for title, status, price, lessons count, actions
- Create course detail page with lesson management
- Create lesson editor with video selection
- Add API routes for courses and lessons

### 9. Create Orders Admin Interface

- Create `apps/admin/app/dashboard/commerce/orders/page.tsx`
- Create `OrdersDataTable.tsx` with columns for order number, customer, status, total, date
- Create order detail page with items and transaction history
- Add order status management (shipped, completed, refunded)
- Add API routes for orders

### 10. Create Transactions Admin Interface

- Create `apps/admin/app/dashboard/commerce/transactions/page.tsx`
- Create `TransactionsDataTable.tsx` with columns for type, amount, status, provider, date
- Add filtering by transaction type, status, date range
- Add export to CSV functionality

### 11. Extend Projects Admin Interface

- Update existing `apps/admin/app/dashboard/tools/projects/` with:
  - Full CRUD operations for projects
  - Task management within projects
  - Process template selection
  - Time tracking integration
- Add task assignment and status workflows
- Add project analytics dashboard

### 12. Create Tasks Admin Interface

- Create `apps/admin/app/dashboard/tools/tasks/page.tsx`
- Create kanban board view for task management
- Create task detail with comments and activity log
- Add bulk task operations (assign, change status, move)

### 13. Create Process Templates Admin Interface

- Create `apps/admin/app/dashboard/tools/templates/page.tsx`
- Create template editor with step builder
- Add template preview and testing
- Add "Create Project from Template" functionality

### 14. Create Events Calendar Admin Interface

- Create `apps/admin/app/dashboard/calendar/events/page.tsx`
- Create calendar view with month/week/day modes
- Create event detail page with registration management
- Add recurring event support
- Add event notifications and reminders UI

### 15. Run Migration and Validate

- Execute all migration SQL files in order
- Run Airtable migration script for each table
- Validate record counts match
- Validate data integrity with sample queries
- Update admin navigation to include new sections
- Test all CRUD operations through admin UI

## Testing Strategy

### Unit Tests
- MCP handler operations (mock Airtable API)
- Data transformation functions
- Type validation

### Integration Tests
- Airtable MCP handler with real API (staging base)
- PostgreSQL schema integrity
- Admin API routes with test database

### E2E Tests
- Full CRUD flows through admin UI
- Data migration script validation
- Bulk operations

### Data Validation
- Record count comparison (Airtable vs PostgreSQL)
- Field mapping accuracy
- Relationship integrity (foreign keys)
- JSONB field structure validation

## Implementation Status

**Last Updated:** 2025-11-28 (Session 2)

### Phase 1: Airtable MCP Service - COMPLETE
- [x] Handler created at `tools/mcp-gateway/src/mcp/handlers/airtable.ts`
- [x] Full CRUD operations implemented (list-bases, list-tables, get-table-schema, read-records, create-record, update-record, delete-record)
- [x] Batch operations supported (create-records, update-records, delete-records)
- [x] Pagination with offset support
- [x] Health check endpoint
- [x] Service registered in `config/mcp-catalog.json`
- [x] Environment variables added to `config/environment.ts`

### Phase 2: PostgreSQL Schemas - COMPLETE
All 6 migration files created in `shared/database/migrations/`:
- [x] `010_create_content_tables.sql` - videos, courses, lessons, modules, enrollments, progress
- [x] `011_create_commerce_tables.sql` - products, orders, order_items, transactions, coupons
- [x] `012_create_project_tables.sql` - projects, tasks, task_comments, attachments, time_entries, sprints
- [x] `013_create_calendar_tables.sql` - events, registrations, recurrence, instances, reminders, feedback
- [x] `014_create_crm_tables.sql` - contacts, communications, tags, entity_tags
- [x] `015_create_marketing_tables.sql` - campaigns, email_templates, analytics_events

### Phase 3: TypeScript Types - COMPLETE
All types created in `apps/admin/types/`:
- [x] `content.ts` - Video, Course, Lesson, Module, Enrollment types + inputs + helpers
- [x] `commerce.ts` - Product, Order, Transaction, Coupon types + inputs + helpers
- [x] `projects.ts` - Project, Task, ProcessTemplate, Sprint types + inputs + helpers
- [x] `calendar.ts` - CalendarEvent, Registration, Recurrence types + inputs + helpers

### Phase 4: MCP Client Queries - COMPLETE
- [x] `apps/admin/lib/mcp-client/content.ts` - Full CRUD for videos, courses, lessons, modules
- [x] `apps/admin/lib/mcp-client/commerce.ts` - Full CRUD for products, orders, transactions, coupons
- [x] `apps/admin/lib/mcp-client/projects.ts` - Full CRUD for projects, tasks, templates, sprints
- [x] `apps/admin/lib/mcp-client/calendar.ts` - Full CRUD for events, registrations, recurrence

### Phase 5: Admin Dashboard Pages - IN PROGRESS
Content management pages:
- [x] `/dashboard/content/videos/` - Videos list with DataTable (page.tsx, columns.tsx, VideosDataTable.tsx)
- [ ] `/dashboard/content/courses/` - Courses list and CRUD (existing page needs extension)

Commerce pages:
- [x] `/dashboard/commerce/orders/` - Orders list with DataTable (page.tsx, columns.tsx, OrdersDataTable.tsx)
- [ ] `/dashboard/commerce/transactions/` - Transactions view
- [ ] `/dashboard/commerce/products/` - Products management

Calendar pages:
- [x] `/dashboard/calendar/events/` - Events list with DataTable (page.tsx, columns.tsx, EventsDataTable.tsx)

Project pages:
- [ ] `/dashboard/tools/tasks/` - Tasks kanban board
- [ ] `/dashboard/tools/templates/` - Process templates

Sidebar Navigation:
- [x] Updated `components/dashboard/Sidebar.tsx` with Content, Commerce, and Calendar sections

### Phase 6: Data Migration - NOT STARTED
- [ ] Migration scripts
- [ ] Data validation
- [ ] Production cutover

---

## Acceptance Criteria

1. **Airtable MCP Service**
   - [x] Handler successfully connects to Airtable API
   - [x] All CRUD operations work correctly
   - [x] Pagination works for large record sets
   - [x] Health check returns accurate status
   - [x] Service appears in `/mcp/catalog`

2. **PostgreSQL Schemas**
   - [x] All 6 migration files execute without errors
   - [x] Tables have proper indexes for query performance
   - [x] Foreign key relationships are correct
   - [x] CHECK constraints enforce valid values
   - [x] JSONB fields have proper GIN indexes

3. **Data Migration**
   - [ ] All 30+ Airtable tables mapped to PostgreSQL
   - [ ] Migration script runs successfully
   - [ ] Record counts match between systems
   - [ ] No data loss during migration
   - [ ] Rollback script tested and working

4. **Admin Interfaces**
   - [x] Videos: List with DataTable, filtering, pagination (CRUD forms pending)
   - [ ] Courses: List, view, create, edit, delete, lesson management
   - [x] Orders: List with DataTable, status/payment filtering (detail view pending)
   - [ ] Transactions: List, view, filtering, export
   - [ ] Projects: Full CRUD, task management, templates
   - [ ] Tasks: Kanban view, assignment, comments
   - [x] Events: List with DataTable, type/status filtering (detail view pending)
   - [x] All interfaces follow existing admin patterns (using shared/ui CossUI components)

5. **Integration**
   - [x] All interfaces accessible from admin sidebar
   - [ ] Breadcrumb navigation works correctly
   - [x] RBAC permissions enforced
   - [ ] Audit logging captures all changes

## Validation Commands

Execute these commands to validate the implementation:

```bash
# 1. Test Airtable MCP service health
curl -X POST http://localhost:8100/mcp/test/airtable

# 2. Verify service registration
curl http://localhost:8100/mcp/catalog | jq '.services.airtable'

# 3. Run database migrations
cd shared/database && psql $DATABASE_URL -f migrations/010_create_content_tables.sql

# 4. Verify tables created
curl -X POST http://localhost:8100/mcp/rpc -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"postgres","database":"shared-users-db","operation":"list-tables"},"id":"1"}'

# 5. Run migration script
cd tools/mcp-gateway && npx ts-node scripts/migrate-airtable.ts

# 6. Build admin app
cd apps/admin && npm run build

# 7. Run admin tests
cd apps/admin && npm test

# 8. Check TypeScript types
cd apps/admin && npx tsc --noEmit
```

## Notes

### Dependencies
- `axios` - Already in MCP Gateway for HTTP clients
- No new dependencies required for admin app (uses existing patterns)

### Environment Variables Required
```bash
# Add to .env
AIRTABLE_API_KEY=pat_xxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Airtable API Rate Limits
- 5 requests per second per base
- 100 records per page maximum
- Consider implementing request queuing for large migrations

### Future N8N Integration Points
- Order status change webhooks → N8N
- New user registration → N8N onboarding flow
- Event registration → N8N confirmation emails
- Task completion → N8N notifications

### Rollback Strategy
1. Keep `airtable_id` column populated during migration
2. Maintain Airtable handler for read-only fallback
3. Create reverse migration script if needed
4. Document any manual data corrections

### Table Groupings Reference

| Group | Tables | Admin Section |
|-------|--------|---------------|
| Content | videos, courses, lessons, modules | `/dashboard/content/` |
| Commerce | products, orders, order_items, transactions | `/dashboard/commerce/` |
| Projects | projects, tasks, task_comments, process_templates | `/dashboard/tools/` |
| Calendar | events, event_registrations, event_recurrence | `/dashboard/calendar/` |
| CRM | contacts, communications, tags, entity_tags | `/dashboard/crm/` |
| Marketing | campaigns, email_templates, analytics_events | `/dashboard/marketing/` |
