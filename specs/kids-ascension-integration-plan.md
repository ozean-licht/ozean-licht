# Kids Ascension Integration Plan
# Migrating Prototype into Ozean Licht Ecosystem

**Version:** 1.0.0
**Date:** 2025-01-08
**Status:** Planning Phase
**Author:** Kids Ascension Integration Planner Agent

---

## Executive Summary

This document outlines the comprehensive plan to integrate the Kids Ascension prototype (`kids-ascension_OLD`) into the Ozean Licht ecosystem structure, transforming it from a standalone monorepo into a properly integrated application within the ecosystem's multi-tenant architecture.

### Key Objectives

1. **Preserve Design Excellence**: Extract and preserve the unique design system, branding, and UI components that make Kids Ascension special
2. **Clean Architecture**: Implement proper frontend/backend separation following ecosystem patterns
3. **Eliminate Redundancy**: Remove duplicate infrastructure (Supabase) and consolidate with ecosystem services
4. **Enable Deployment**: Prepare for production deployment at kids-ascension.dev via Coolify
5. **Maintain Identity**: Keep Kids Ascension's educational mission and spiritual aesthetic intact

### Integration Approach

- **Non-Destructive**: Preserve `kids-ascension_OLD` as reference
- **Iterative**: Phase-based migration with validation at each step
- **Pattern-Following**: Adopt ecosystem conventions (shared auth, MCP Gateway, PostgreSQL)
- **Design-First**: Design system and branding preservation as highest priority

---

## 1. Prototype Analysis

### 1.1 Current Structure Overview

The `kids-ascension_OLD` prototype is a standalone monorepo located at:
```
/opt/ozean-licht-ecosystem/apps/kids-ascension/kids-ascension_OLD/
```

#### Key Components Identified

**A. Active Applications**

1. **kids-ascension-web/** - Main user-facing platform
   - Next.js 15 with App Router
   - React 19.2.0
   - Tailwind CSS v4 with custom design system
   - Supabase authentication and database
   - Port: 3000

2. **kids-ascension-admin/** - Admin dashboard
   - Next.js 15 with App Router
   - Admin-specific UI components
   - Content management features
   - Port: 3001

**B. Infrastructure Discovered**

```
kids-ascension_OLD/
├── apps/                        # Prepared monorepo structure
│   ├── admin/                   # Alternative admin (duplicate?)
│   ├── api/                     # API service (unused?)
│   ├── mobile/                  # Mobile app (future?)
│   └── web/                     # Alternative web (duplicate?)
├── packages/                    # Shared packages
│   ├── database/                # Database package
│   ├── ui/                      # UI component library
│   └── utils/                   # Utilities
├── kids-ascension-web/          # ✅ ACTIVE - Main app
├── kids-ascension-admin/        # ✅ ACTIVE - Admin app
├── config/                      # Configuration files
│   ├── mcp/                     # MCP configurations (12 files)
│   ├── test/                    # Test configs
│   └── build/                   # Build configs
├── .claude/                     # Claude Code commands (extensive)
├── .bmad-core/                  # BMAD framework (referenced)
├── docs/                        # Documentation
├── scripts/                     # Build/deploy scripts
├── supabase/                    # Supabase migrations
└── tests/                       # Test suite
```

### 1.2 Design System Analysis

#### Core Design Elements (MUST PRESERVE)

**Custom Color Palette**
```css
/* Kids Ascension Custom Colors from globals.css */
--spiritual: oklch(0.68 0.13 280);      /* Soft purple for meditation */
--nature: oklch(0.60 0.15 145);          /* Rich green for nature connection */
--calm: oklch(0.70 0.08 220);            /* Peaceful blue */
```

**Background Gradient** (Defining characteristic)
```css
background: linear-gradient(135deg,
  #f0f9ff 0%,   /* Sky blue */
  #e0f2fe 25%,  /* Light cyan */
  #f0fdf4 50%,  /* Mint green */
  #fef3e2 75%,  /* Warm beige */
  #fef0f5 100%  /* Soft pink */
);
background-size: 400% 400%;
background-attachment: fixed;
```

**Custom Animations**
- `animate-breathe` - Meditation breathing effect
- `animate-float` - Gentle floating elements
- `animate-glow` - Spiritual glow effect
- `animate-aurora` - Dynamic background animation

**Typography**
- Font: Plus Jakarta Sans (via `--font-plus-jakarta`)
- Optimized letter spacing and line heights for readability
- Special spiritual/mindfulness aesthetic

**Category Colors** (Educational content organization)
- Blue (500), Purple (500), Green (500), Yellow (500)
- Pink (500), Red (500), Amber (700), Teal (500)
- Slate (600), Orange (500), Cyan (600), Indigo (400)
- Rose (500), Emerald (500), Gray (500)

### 1.3 Dependencies Analysis

#### Frontend Dependencies (kids-ascension-web/package.json)

**Key UI Libraries**
- `@radix-ui/*` - Extensive Radix UI component suite
- `@remixicon/react` - Icon library
- `lucide-react` - Additional icons
- `framer-motion` - Animation library
- `motion` - Advanced motion library
- `next-themes` - Dark mode support

**Data Fetching & State**
- `@tanstack/react-query` - Server state management

**Current Backend** (TO BE REPLACED)
- `@supabase/ssr` - Supabase SSR support
- `@supabase/supabase-js` - Supabase client
- `pg` - PostgreSQL direct connection

**Styling**
- `tailwindcss` - v4.1.14
- `tailwindcss-animate` - Animation utilities
- `tw-animate-css` - Additional animations
- `class-variance-authority` - Component variants
- `clsx` - Class name utilities
- `tailwind-merge` - Merge Tailwind classes

**Specialized Components**
- `react-activity-calendar` - Activity heatmap
- `react-day-picker` - Date picker
- `react-to-print` - PDF export functionality
- `svg-dotted-map` - World map visualization
- `sonner` - Toast notifications

#### Admin Dependencies (kids-ascension-admin/package.json)

**Admin-Specific**
- `react-dropzone` - File upload
- `recharts` - Analytics charts
- Same Supabase dependencies (to be replaced)

### 1.4 Application Structure Analysis

#### Web App Routes (kids-ascension-web/app/)

```
app/
├── (auth)/              # Authentication flow
│   ├── login/
│   ├── register/
│   └── onboarding/
├── (dashboard)/         # Protected user dashboard
│   ├── courses/
│   ├── progress/
│   └── profile/
├── (marketing)/         # Public marketing pages
│   ├── about/
│   ├── features/
│   └── (landing)/
├── (creator)/           # Creator tools
├── (educator)/          # Educator features
├── (guest)/             # Guest/preview mode
├── api/                 # API routes
└── watch/               # Video player
```

#### Admin App Routes (kids-ascension-admin/app/)

```
app/
├── admin/
│   ├── activity/        # Activity monitoring
│   ├── classrooms/      # Classroom management
│   ├── courses/         # Course management
│   ├── lessons/         # Lesson management
│   ├── marketplace/     # Content marketplace
│   ├── media/           # Media library
│   ├── meditations/     # Meditation content
│   ├── review/          # Content review
│   ├── schools/         # School management
│   ├── users/           # User management
│   └── videos/          # Video management
├── login/
└── unauthorized/
```

### 1.5 Database Schema (Supabase)

Current database structure discovered from migrations:

**Core Tables**
- `users` - User accounts (to migrate to `shared_users_db`)
- `videos` - Video content
- `courses` - Course structure
- `lessons` - Individual lessons
- `progress` - User progress tracking
- `classrooms` - Classroom/group management
- `schools` - School partnerships
- `meditations` - Mindfulness content

**Features**
- Row-level security (RLS) policies
- Real-time subscriptions
- Storage buckets for media

### 1.6 Infrastructure to Eliminate

#### Redundant with Ecosystem

1. **Supabase** → Replace with PostgreSQL (`kids_ascension_db`)
2. **Supabase Auth** → Replace with shared authentication (`shared_users_db`)
3. **Supabase Storage** → Replace with MinIO → Cloudflare R2 → Stream
4. **Direct database connections** → Route through MCP Gateway (optional)

#### Duplicate Structures

1. **Multiple app directories**
   - `kids-ascension-web/` (ACTIVE)
   - `kids-ascension-admin/` (ACTIVE)
   - `apps/web/` (empty/duplicate)
   - `apps/admin/` (empty/duplicate)
   - `apps/api/` (unused)
   - `apps/mobile/` (future)

2. **Configuration files**
   - 12 MCP configuration files (obsolete for ecosystem)
   - Local `.claude/` commands (merge with root or orchestrator)

3. **Build configurations**
   - Local turbo.json (use ecosystem root)
   - Duplicate TypeScript configs

---

## 2. Target Ecosystem Architecture

### 2.1 Ecosystem Structure

```
ozean-licht-ecosystem/
├── apps/
│   ├── admin/                    # Unified admin (Ozean + KA)
│   ├── kids-ascension/           # ⭐ TARGET LOCATION
│   │   ├── web/                  # Frontend (Next.js)
│   │   ├── api/                  # Backend (Express/Fastify)
│   │   ├── app_docs/             # Feature documentation
│   │   ├── specs/                # Implementation specs
│   │   └── kids-ascension_OLD/   # Reference (preserved)
│   ├── ozean-licht/              # OL platform
│   └── video-translator/         # Shared service
├── shared/
│   ├── ui-components/            # ⭐ KA design system here
│   ├── auth/                     # Shared authentication
│   ├── database/                 # Prisma clients
│   └── types/                    # TypeScript types
├── tools/
│   ├── mcp-gateway/              # Unified tool access
│   ├── coolify/                  # Deployment configs
│   └── docker/                   # Local development
└── specs/                        # ⭐ This document
```

### 2.2 Multi-Tenant Database Strategy

```
PostgreSQL Instances
├── shared_users_db               # Unified authentication
│   ├── users                     # Core user accounts
│   ├── user_entities             # Entity access mapping
│   └── sessions                  # Active sessions
│
├── kids_ascension_db             # ⭐ KA-specific data
│   ├── videos                    # Educational videos
│   ├── courses                   # Course structure
│   ├── lessons                   # Lesson content
│   ├── progress                  # User progress
│   ├── classrooms                # Classroom management
│   ├── schools                   # School partnerships
│   ├── meditations               # Mindfulness content
│   └── content_metadata          # Content organization
│
└── ozean_licht_db                # OL-specific data
```

**Key Principles**
- Legal separation maintained via database boundaries
- Shared authentication via `shared_users_db.users`
- Users can access both platforms with single account
- Application-level joins for cross-database queries

### 2.3 Three-Tier Storage System

```
Upload Flow:
User Upload
    ↓
1. MinIO (Hot Storage)
    - Staging before moderation
    - Local SSD (~3000 MB/s)
    - Auto-cleanup after 30 days
    ↓
Content Approved
    ↓
2. Cloudflare R2 (Cold Storage)
    - Permanent archive
    - $0.015/GB/month
    - Zero egress fees
    - Original quality
    ↓
3. Cloudflare Stream (CDN)
    - Transcoded for delivery
    - Adaptive bitrate streaming
    - Global edge network
    - Analytics included
```

### 2.4 Authentication Flow

```
User Login
    ↓
shared_users_db.users
    ↓
Check user_entities for platform access
    ↓
Kids Ascension Access?
    ├─ Yes → Query kids_ascension_db
    └─ No  → Redirect to Ozean Licht or error
```

**Implementation**
- NextAuth.js v5 (already in ecosystem admin)
- Session management with JWT
- Role-based access control (RBAC)
- Middleware for route protection

---

## 3. Implementation Strategy

### 3.1 Phase-Based Migration

#### Phase 1: Foundation Setup (Week 1)
**Goal:** Create directory structure and preserve design system

**Tasks:**
1. Create new app structure
   ```bash
   apps/kids-ascension/
   ├── web/                 # Frontend
   │   ├── app/            # Next.js App Router
   │   ├── components/     # KA-specific components
   │   ├── lib/            # Client utilities
   │   └── public/         # Static assets
   ├── api/                 # Backend (if needed)
   │   ├── src/
   │   ├── prisma/
   │   └── package.json
   ├── app_docs/            # Documentation
   ├── specs/               # Specifications
   └── README.md
   ```

2. Extract and document design system
   - Copy `globals.css` with KA theme variables
   - Document color palette in `shared/ui-components/kids-ascension-theme.css`
   - Preserve custom animations and utilities
   - Create design system documentation

3. Set up database schema
   - Create `kids_ascension_db` on PostgreSQL
   - Migrate Supabase schema to PostgreSQL
   - Set up Prisma client for `kids_ascension_db`
   - Configure shared authentication queries

**Deliverables:**
- [ ] Directory structure created
- [ ] Design system extracted and documented
- [ ] Database schema migrated
- [ ] Prisma client configured

#### Phase 2: UI Component Migration (Week 2)
**Goal:** Extract and migrate reusable UI components

**Components to Migrate:**

**From kids-ascension-web/src/components/ui/**
- All Radix UI wrappers (button, card, dialog, etc.)
- Custom components with KA styling

**From kids-ascension-admin/components/**
- Admin-specific layouts (header, sidebar)
- Admin UI components
- Data visualization components

**Target Locations:**
```
shared/ui-components/
├── kids-ascension/          # KA-specific components
│   ├── spiritual/           # Meditation, mindfulness
│   ├── educational/         # Course, lesson cards
│   ├── progress/            # Progress tracking
│   └── video/               # Video player components
├── admin/                   # Admin components (existing)
└── common/                  # Shared across platforms
```

**Tasks:**
1. Audit all components in prototype
2. Classify: KA-specific vs. reusable
3. Migrate to appropriate locations
4. Update imports to use shared library
5. Test components in isolation (Storybook?)

**Deliverables:**
- [ ] Component inventory completed
- [ ] Components migrated to shared library
- [ ] Documentation for each component
- [ ] Import paths updated

#### Phase 3: Frontend Application (Week 3)
**Goal:** Rebuild frontend with ecosystem patterns

**Core Routes to Implement:**

1. **Marketing Routes** (Public)
   ```
   /                        # Landing page
   /about                   # About mission
   /features                # Platform features
   /educators               # For teachers
   /parents                 # For parents
   ```

2. **Authentication Routes**
   ```
   /login                   # Login (shared auth)
   /register                # Registration
   /onboarding              # First-time setup
   ```

3. **Dashboard Routes** (Protected)
   ```
   /dashboard               # User dashboard
   /courses                 # Browse courses
   /courses/[id]            # Course detail
   /lessons/[id]            # Lesson player
   /progress                # Learning progress
   /profile                 # User profile
   ```

4. **Creator Routes** (Role-based)
   ```
   /creator/dashboard       # Creator dashboard
   /creator/content         # Content management
   /creator/analytics       # Content analytics
   ```

5. **Educator Routes** (Role-based)
   ```
   /educator/classrooms     # Classroom management
   /educator/students       # Student progress
   ```

**Integration Points:**
- Replace Supabase client with PostgreSQL via Prisma
- Implement shared authentication middleware
- Connect to MCP Gateway for tool access (optional)
- Configure Cloudflare Stream for video playback

**Tasks:**
1. Set up Next.js 15 with App Router
2. Configure authentication with NextAuth.js
3. Implement route structure
4. Migrate page components
5. Update database queries to Prisma
6. Configure environment variables
7. Test all routes and flows

**Deliverables:**
- [ ] Next.js app configured
- [ ] All routes implemented
- [ ] Authentication working
- [ ] Database queries functional
- [ ] Video playback integrated

#### Phase 4: Backend API (Week 4)
**Goal:** Create clean backend service

**Decision Point:** Do we need a separate backend service?

**Option A: Next.js API Routes** (Recommended for simplicity)
- Use Next.js Server Actions
- API routes for external integrations
- Simpler deployment

**Option B: Separate Backend Service**
- Express or Fastify
- GraphQL or REST API
- Better for complex logic
- Easier to scale independently

**Recommendation:** Start with Option A (Next.js API routes), migrate to Option B if needed.

**Core API Endpoints:**
```
/api/courses              # Course CRUD
/api/lessons              # Lesson CRUD
/api/progress             # Progress tracking
/api/videos               # Video management
/api/classrooms           # Classroom management
/api/analytics            # Analytics data
```

**Tasks:**
1. Decide on architecture (Option A or B)
2. Implement API endpoints
3. Set up business logic
4. Configure database access via Prisma
5. Implement authorization logic
6. Add rate limiting and security
7. Write API documentation

**Deliverables:**
- [ ] Backend architecture decided
- [ ] API endpoints implemented
- [ ] Business logic functional
- [ ] Security measures in place
- [ ] API documentation complete

#### Phase 5: Admin Dashboard Integration (Week 5)
**Goal:** Integrate admin features into ecosystem admin

**Approach:** Two options

**Option A: Merge into Unified Admin** (Recommended)
- Add Kids Ascension features to `apps/admin/`
- Platform switcher in UI
- Shared admin components
- Single deployment

**Option B: Separate Admin App**
- Keep `apps/kids-ascension/admin/`
- Independent deployment
- More isolation

**Recommendation:** Option A for consistency with ecosystem patterns.

**Features to Integrate:**
1. Content Management
   - Video upload and moderation
   - Course and lesson management
   - Media library

2. User Management
   - User accounts and roles
   - Classroom assignments
   - School partnerships

3. Analytics
   - Platform usage statistics
   - Content performance
   - User engagement metrics

4. Review System
   - Content moderation queue
   - Community reporting
   - Quality assurance

**Tasks:**
1. Audit admin features in prototype
2. Design integration into unified admin
3. Migrate admin routes
4. Update navigation to include KA sections
5. Implement role-based access for KA admins
6. Test admin workflows

**Deliverables:**
- [ ] Admin integration designed
- [ ] Features migrated
- [ ] Navigation updated
- [ ] Permissions configured
- [ ] Admin workflows tested

#### Phase 6: Data Migration (Week 6)
**Goal:** Migrate any existing data from prototype

**Note:** If prototype has test data worth preserving

**Migration Scripts:**
1. User accounts → `shared_users_db`
2. Content data → `kids_ascension_db`
3. Media files → MinIO → R2

**Tasks:**
1. Export data from Supabase (if applicable)
2. Transform data to new schema
3. Import to PostgreSQL
4. Migrate media files
5. Verify data integrity
6. Create rollback plan

**Deliverables:**
- [ ] Migration scripts created
- [ ] Data migrated successfully
- [ ] Verification completed
- [ ] Rollback plan documented

#### Phase 7: Testing & Quality Assurance (Week 7)
**Goal:** Comprehensive testing of integrated platform

**Test Categories:**

1. **Unit Tests**
   - Component tests
   - Utility function tests
   - API endpoint tests

2. **Integration Tests**
   - Authentication flows
   - Database operations
   - File uploads

3. **End-to-End Tests**
   - User registration and login
   - Course enrollment
   - Video watching
   - Progress tracking
   - Admin operations

4. **Performance Tests**
   - Page load times
   - Video streaming performance
   - Database query optimization

5. **Security Tests**
   - Authentication bypass attempts
   - Authorization checks
   - SQL injection prevention
   - XSS protection

**Tasks:**
1. Write test suites
2. Run automated tests
3. Conduct manual QA testing
4. Performance profiling
5. Security audit
6. Fix identified issues
7. Regression testing

**Deliverables:**
- [ ] Test suites implemented
- [ ] All tests passing
- [ ] QA report completed
- [ ] Performance benchmarks met
- [ ] Security audit passed

#### Phase 8: Deployment Preparation (Week 8)
**Goal:** Prepare for production deployment at kids-ascension.dev

**Infrastructure Setup:**

1. **Coolify Configuration**
   ```
   apps/kids-ascension/
   ├── coolify-config.md    # Deployment instructions
   └── .env.production      # Production env vars
   ```

2. **Environment Variables**
   ```env
   # Database
   DATABASE_URL=postgresql://...
   SHARED_USERS_DB_URL=postgresql://...

   # Authentication
   NEXTAUTH_URL=https://kids-ascension.dev
   NEXTAUTH_SECRET=...

   # Storage
   MINIO_ENDPOINT=...
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...

   # Cloudflare Stream
   CLOUDFLARE_STREAM_API_TOKEN=...
   CLOUDFLARE_ACCOUNT_ID=...
   ```

3. **Domain Configuration**
   - DNS: kids-ascension.dev → Coolify
   - SSL: Auto-provision via Let's Encrypt
   - CDN: Cloudflare proxy

4. **Monitoring**
   - Health check endpoints
   - Error tracking (Sentry?)
   - Analytics (Plausible?)
   - Uptime monitoring

**Tasks:**
1. Write Coolify deployment config
2. Configure production environment variables
3. Set up domain and SSL
4. Configure monitoring services
5. Create deployment runbook
6. Test deployment on staging
7. Plan production deployment

**Deliverables:**
- [ ] Coolify config complete
- [ ] Environment configured
- [ ] Domain and SSL ready
- [ ] Monitoring operational
- [ ] Deployment runbook written
- [ ] Staging deployment successful

#### Phase 9: Documentation (Week 9)
**Goal:** Comprehensive documentation for maintainers

**Documentation to Create:**

1. **Architecture Documentation**
   - System overview
   - Database schema
   - API documentation
   - Integration points

2. **Developer Guide**
   - Setup instructions
   - Development workflow
   - Testing procedures
   - Contribution guidelines

3. **Admin Guide**
   - Admin dashboard usage
   - Content moderation
   - User management
   - Analytics interpretation

4. **Operations Guide**
   - Deployment procedures
   - Monitoring and alerts
   - Backup and recovery
   - Troubleshooting

5. **Design System Documentation**
   - Color palette
   - Typography
   - Components library
   - Animation guidelines

**Tasks:**
1. Write architecture docs
2. Create developer guide
3. Document admin workflows
4. Write operations runbook
5. Document design system
6. Create visual diagrams
7. Review and publish docs

**Deliverables:**
- [ ] Architecture docs complete
- [ ] Developer guide published
- [ ] Admin guide available
- [ ] Operations runbook ready
- [ ] Design system documented

#### Phase 10: Launch (Week 10)
**Goal:** Production deployment and monitoring

**Launch Checklist:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Monitoring configured
- [ ] Backup systems ready
- [ ] Rollback plan prepared
- [ ] Team trained on operations

**Launch Steps:**
1. Final staging deployment test
2. Database backup
3. Production deployment
4. DNS cutover
5. Smoke tests
6. Monitoring verification
7. Announcement

**Post-Launch:**
- 24/7 monitoring for first week
- Daily team check-ins
- User feedback collection
- Performance tuning
- Bug fixes as needed

**Deliverables:**
- [ ] Production deployment successful
- [ ] Platform operational
- [ ] Monitoring active
- [ ] Team briefed
- [ ] Launch announcement made

---

## 4. Detailed Technical Specifications

### 4.1 Directory Structure

```
apps/kids-ascension/
├── web/                           # Frontend Application
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── onboarding/
│   │   ├── (dashboard)/           # Protected dashboard
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   ├── progress/
│   │   │   └── profile/
│   │   ├── (marketing)/           # Public marketing
│   │   │   ├── page.tsx           # Landing
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   ├── educators/
│   │   │   └── parents/
│   │   ├── (creator)/             # Creator dashboard
│   │   ├── (educator)/            # Educator features
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   ├── progress/
│   │   │   └── videos/
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # KA theme
│   │   └── favicon.ico
│   ├── components/                # KA-specific components
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── progress/
│   │   ├── spiritual/             # Meditation components
│   │   └── video/                 # Video player
│   ├── lib/                       # Client utilities
│   │   ├── auth/                  # Auth helpers
│   │   ├── db/                    # Database client
│   │   ├── storage/               # File upload
│   │   └── utils/                 # Utilities
│   ├── public/                    # Static assets
│   │   ├── images/
│   │   └── videos/
│   ├── middleware.ts              # Route protection
│   ├── next.config.ts             # Next.js config
│   ├── tailwind.config.ts         # Tailwind config
│   ├── tsconfig.json              # TypeScript config
│   ├── package.json
│   └── README.md
│
├── api/                           # Backend Service (Optional)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   ├── progress/
│   │   │   └── videos/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   ├── package.json
│   └── README.md
│
├── app_docs/                      # Feature documentation
│   ├── features/
│   └── architecture/
│
├── specs/                         # Implementation specs
│   └── *.md
│
├── docs/                          # Product documentation
│   ├── PRD.md                     # Product requirements
│   └── guides/
│
├── tests/                         # E2E tests
│   └── e2e/
│
├── kids-ascension_OLD/            # Preserved prototype
│
└── README.md                      # Overview
```

### 4.2 Database Schema (Prisma)

**File:** `apps/kids-ascension/api/prisma/schema.prisma` (or shared location)

```prisma
// ============================================
// Kids Ascension Database Schema
// Database: kids_ascension_db
// ============================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client-kids-ascension"
}

// ============================================
// Content Models
// ============================================

model Video {
  id               String    @id @default(cuid())
  title            String
  description      String?   @db.Text
  thumbnailUrl     String?
  streamId         String?   // Cloudflare Stream ID
  r2Key            String?   // Cloudflare R2 key
  duration         Int?      // Duration in seconds
  status           VideoStatus @default(PENDING)
  visibility       Visibility @default(DRAFT)

  // Metadata
  language         String    @default("en")
  targetAgeMin     Int?
  targetAgeMax     Int?
  tags             String[]

  // Spiritual/Educational
  category         String?   // Math, Science, Mindfulness, etc.
  spiritualContent Boolean   @default(false)

  // Relationships
  creatorId        String
  lessons          Lesson[]
  progress         VideoProgress[]

  // Timestamps
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  publishedAt      DateTime?

  @@index([creatorId])
  @@index([status])
  @@index([category])
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  thumbnailUrl String?

  // Organization
  order       Int      @default(0)
  category    String?
  difficulty  String?  // Beginner, Intermediate, Advanced

  // Metadata
  estimatedHours Int?
  targetAgeMin   Int?
  targetAgeMax   Int?

  // Relationships
  creatorId   String
  lessons     Lesson[]
  enrollments CourseEnrollment[]

  // Visibility
  visibility  Visibility @default(DRAFT)
  featured    Boolean    @default(false)

  // Timestamps
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  publishedAt DateTime?

  @@index([creatorId])
  @@index([category])
  @@index([featured])
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  content     String?  @db.Text // Markdown content

  // Organization
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  order       Int      @default(0)

  // Content
  videoId     String?
  video       Video?   @relation(fields: [videoId], references: [id])

  // Metadata
  estimatedMinutes Int?
  requiredForCompletion Boolean @default(true)

  // Relationships
  progress    LessonProgress[]

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([courseId])
  @@index([videoId])
}

model Meditation {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  audioUrl    String?
  duration    Int?     // Duration in seconds

  // Metadata
  category    String?  // Breathing, Visualization, Body Scan
  difficulty  String?  // Beginner, Intermediate, Advanced
  guided      Boolean  @default(true)

  // Relationships
  creatorId   String
  sessions    MeditationSession[]

  // Visibility
  visibility  Visibility @default(DRAFT)
  featured    Boolean    @default(false)

  // Timestamps
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([category])
  @@index([featured])
}

// ============================================
// User Progress Models
// ============================================

model CourseEnrollment {
  id          String   @id @default(cuid())
  userId      String   // Reference to shared_users_db.users
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  // Progress
  status      EnrollmentStatus @default(ENROLLED)
  progress    Int              @default(0) // Percentage 0-100

  // Timestamps
  enrolledAt  DateTime @default(now())
  completedAt DateTime?
  lastAccessedAt DateTime?

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}

model LessonProgress {
  id          String   @id @default(cuid())
  userId      String   // Reference to shared_users_db.users
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  // Progress
  completed   Boolean  @default(false)
  watchTime   Int      @default(0) // Seconds watched

  // Timestamps
  startedAt   DateTime @default(now())
  completedAt DateTime?
  updatedAt   DateTime @updatedAt

  @@unique([userId, lessonId])
  @@index([userId])
  @@index([lessonId])
}

model VideoProgress {
  id          String   @id @default(cuid())
  userId      String   // Reference to shared_users_db.users
  videoId     String
  video       Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)

  // Progress
  watchTime   Int      @default(0) // Seconds watched
  completed   Boolean  @default(false)

  // Timestamps
  lastWatched DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, videoId])
  @@index([userId])
  @@index([videoId])
}

model MeditationSession {
  id            String     @id @default(cuid())
  userId        String     // Reference to shared_users_db.users
  meditationId  String
  meditation    Meditation @relation(fields: [meditationId], references: [id], onDelete: Cascade)

  // Session data
  duration      Int        // Actual duration in seconds
  completed     Boolean    @default(false)

  // Timestamps
  startedAt     DateTime   @default(now())

  @@index([userId])
  @@index([meditationId])
}

// ============================================
// Classroom Models
// ============================================

model Classroom {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text

  // Access
  inviteCode  String   @unique @default(cuid())

  // Relationships
  teacherId   String   // Reference to shared_users_db.users
  schoolId    String?
  school      School?  @relation(fields: [schoolId], references: [id])
  memberships ClassroomMembership[]

  // Settings
  maxStudents Int?
  active      Boolean  @default(true)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([teacherId])
  @@index([schoolId])
  @@index([inviteCode])
}

model ClassroomMembership {
  id          String    @id @default(cuid())
  classroomId String
  classroom   Classroom @relation(fields: [classroomId], references: [id], onDelete: Cascade)
  userId      String    // Reference to shared_users_db.users (student)

  // Status
  role        ClassroomRole @default(STUDENT)
  active      Boolean       @default(true)

  // Timestamps
  joinedAt    DateTime  @default(now())
  leftAt      DateTime?

  @@unique([classroomId, userId])
  @@index([classroomId])
  @@index([userId])
}

model School {
  id          String      @id @default(cuid())
  name        String
  location    String?
  country     String?

  // Contact
  contactName  String?
  contactEmail String?

  // Relationships
  classrooms   Classroom[]

  // Status
  verified     Boolean     @default(false)
  active       Boolean     @default(true)

  // Timestamps
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([country])
}

// ============================================
// Enums
// ============================================

enum VideoStatus {
  PENDING       // Uploaded, not processed
  PROCESSING    // Being transcoded
  READY         // Available for viewing
  FAILED        // Processing failed
  ARCHIVED      // Soft deleted
}

enum Visibility {
  DRAFT         // Not published
  PRIVATE       // Only creator can see
  UNLISTED      // Anyone with link
  PUBLIC        // Visible to all
}

enum EnrollmentStatus {
  ENROLLED      // Active enrollment
  IN_PROGRESS   // Started lessons
  COMPLETED     // Finished course
  DROPPED       // User withdrew
}

enum ClassroomRole {
  STUDENT       // Regular student
  ASSISTANT     // Teaching assistant
  TEACHER       // Primary teacher
}
```

### 4.3 Authentication Integration

**Shared Authentication via `shared_users_db`**

**File:** `apps/kids-ascension/web/lib/auth/config.ts`

```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/shared-users" // Prisma client for shared_users_db

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Query shared_users_db
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            userEntities: true // Check platform access
          }
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          return null
        }

        // Check if user has Kids Ascension access
        const hasKAAccess = user.userEntities.some(
          entity => entity.entityType === "KIDS_ASCENSION"
        )

        if (!hasKAAccess) {
          throw new Error("NO_KA_ACCESS")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
```

**Middleware for Route Protection**

**File:** `apps/kids-ascension/web/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function middleware(request: NextRequest) {
  const session = await auth()

  const isPublic = request.nextUrl.pathname.startsWith('/(marketing)') ||
                   request.nextUrl.pathname === '/login' ||
                   request.nextUrl.pathname === '/register'

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/creator')) {
    if (!['CREATOR', 'ADMIN'].includes(session?.user?.role || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/educator')) {
    if (!['EDUCATOR', 'ADMIN'].includes(session?.user?.role || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 4.4 Video Management Integration

**Cloudflare Stream Integration**

**File:** `apps/kids-ascension/web/lib/storage/video.ts`

```typescript
import { R2Client } from "@/lib/storage/r2"
import { StreamClient } from "@/lib/storage/stream"

export class VideoManager {
  private r2: R2Client
  private stream: StreamClient

  constructor() {
    this.r2 = new R2Client()
    this.stream = new StreamClient()
  }

  async uploadVideo(file: File, metadata: VideoMetadata) {
    // 1. Upload to MinIO (hot storage) for moderation
    const minioKey = await this.uploadToMinio(file)

    // Return immediately, process async
    return {
      uploadId: minioKey,
      status: 'PENDING_REVIEW'
    }
  }

  async approveVideo(uploadId: string) {
    // 1. Move from MinIO to R2 (permanent storage)
    const r2Key = await this.r2.upload(uploadId)

    // 2. Send to Cloudflare Stream for transcoding
    const streamId = await this.stream.import(r2Key)

    // 3. Update database
    await prisma.video.update({
      where: { id: uploadId },
      data: {
        r2Key,
        streamId,
        status: 'PROCESSING'
      }
    })

    // 4. Schedule MinIO cleanup (30 days)
    await this.scheduleMinioCleanup(uploadId)

    return { r2Key, streamId }
  }

  async getVideoUrl(videoId: string) {
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    })

    if (!video?.streamId) {
      throw new Error('Video not ready')
    }

    // Return Cloudflare Stream URL
    return `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${video.streamId}/manifest/video.m3u8`
  }
}
```

### 4.5 Design System Preservation

**Shared Theme File**

**File:** `shared/ui-components/themes/kids-ascension-theme.css`

```css
/**
 * Kids Ascension Design System
 * The fundamental design-key for the platform
 */

/** Custom Color Palette **/
:root {
  /* Spiritual & Mindfulness */
  --ka-spiritual: oklch(0.68 0.13 280);       /* Soft purple for meditation */
  --ka-spiritual-fg: var(--color-white);

  /* Nature Connection */
  --ka-nature: oklch(0.60 0.15 145);          /* Rich green for nature */
  --ka-nature-fg: var(--color-white);

  /* Calm & Peace */
  --ka-calm: oklch(0.70 0.08 220);            /* Peaceful blue */
  --ka-calm-fg: var(--color-white);

  /* Background Gradient (DEFINING CHARACTERISTIC) */
  --ka-bg-gradient: linear-gradient(135deg,
    #f0f9ff 0%,   /* Sky blue */
    #e0f2fe 25%,  /* Light cyan */
    #f0fdf4 50%,  /* Mint green */
    #fef3e2 75%,  /* Warm beige */
    #fef0f5 100%  /* Soft pink */
  );
}

.dark {
  --ka-spiritual: oklch(0.58 0.13 280);
  --ka-spiritual-fg: var(--color-zinc-50);

  --ka-nature: oklch(0.55 0.15 145);
  --ka-nature-fg: var(--color-zinc-50);

  --ka-calm: oklch(0.60 0.08 220);
  --ka-calm-fg: var(--color-zinc-50);
}

/** Custom Animations **/
@keyframes breathe {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(82, 171, 152, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(82, 171, 152, 0.6);
  }
}

/** Utility Classes **/
.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

.backdrop-blur-spiritual {
  backdrop-filter: blur(12px) saturate(1.2);
}

/** Apply KA Background **/
body.kids-ascension {
  background: var(--ka-bg-gradient);
  background-size: 400% 400%;
  background-attachment: fixed;
}
```

### 4.6 Deployment Configuration

**Coolify Configuration**

**File:** `tools/coolify/kids-ascension-config.md`

```markdown
# Kids Ascension Coolify Deployment

## Service Configuration

**Service Name:** kids-ascension-web
**Domain:** kids-ascension.dev
**Port:** 3000
**Build Command:** `pnpm --filter @ka/web build`
**Start Command:** `pnpm --filter @ka/web start`

## Environment Variables

### Database
- `DATABASE_URL`: Connection to `kids_ascension_db`
- `SHARED_USERS_DB_URL`: Connection to `shared_users_db`

### Authentication
- `NEXTAUTH_URL`: https://kids-ascension.dev
- `NEXTAUTH_SECRET`: [Generate with openssl rand -base64 32]

### Storage
- `MINIO_ENDPOINT`: http://minio:9000
- `MINIO_ACCESS_KEY`: [From environment]
- `MINIO_SECRET_KEY`: [From environment]
- `R2_ACCOUNT_ID`: [Cloudflare R2]
- `R2_ACCESS_KEY_ID`: [Cloudflare R2]
- `R2_SECRET_ACCESS_KEY`: [Cloudflare R2]

### Cloudflare Stream
- `CLOUDFLARE_STREAM_API_TOKEN`: [From Cloudflare]
- `CLOUDFLARE_ACCOUNT_ID`: [From Cloudflare]

### MCP Gateway (Optional)
- `MCP_GATEWAY_URL`: http://mcp-gateway:8100

## Health Check

**Endpoint:** `/api/health`
**Expected Status:** 200
**Interval:** 30s
**Timeout:** 10s
**Retries:** 3

## Resource Limits

- **Memory:** 2GB
- **CPU:** 2 cores
- **Disk:** 10GB

## Backup Configuration

- **Database:** Daily backup at 02:00 UTC
- **Media:** Stored in R2 (inherently backed up)

## Monitoring

- **Uptime:** Coolify built-in
- **Errors:** Sentry integration (optional)
- **Analytics:** Plausible (optional)
```

---

## 5. File Migration Matrix

### 5.1 Components Migration

| Source | Destination | Priority | Notes |
|--------|-------------|----------|-------|
| `kids-ascension-web/src/components/ui/` | `shared/ui-components/common/` | HIGH | Radix UI wrappers |
| `kids-ascension-web/app/globals.css` | `shared/ui-components/themes/kids-ascension-theme.css` | CRITICAL | Design system core |
| `kids-ascension-web/components/spiritual/` | `shared/ui-components/kids-ascension/spiritual/` | HIGH | Meditation components |
| `kids-ascension-admin/components/layout/` | `apps/admin/components/kids-ascension/` | MEDIUM | Admin layouts |
| `kids-ascension-admin/components/ui/` | `shared/ui-components/admin/` | MEDIUM | Admin-specific UI |

### 5.2 Route Migration

| Source | Destination | Priority | Notes |
|--------|-------------|----------|-------|
| `kids-ascension-web/app/(marketing)/` | `apps/kids-ascension/web/app/(marketing)/` | HIGH | Public pages |
| `kids-ascension-web/app/(auth)/` | `apps/kids-ascension/web/app/(auth)/` | HIGH | Auth flows (update to NextAuth) |
| `kids-ascension-web/app/(dashboard)/` | `apps/kids-ascension/web/app/(dashboard)/` | HIGH | User dashboard |
| `kids-ascension-web/app/api/` | `apps/kids-ascension/web/app/api/` | MEDIUM | API routes (update to Prisma) |
| `kids-ascension-admin/app/admin/` | `apps/admin/app/kids-ascension/` | MEDIUM | Admin features |

### 5.3 Logic Migration

| Source | Destination | Priority | Notes |
|--------|-------------|----------|-------|
| `kids-ascension-web/lib/supabase/` | `apps/kids-ascension/web/lib/db/` | CRITICAL | Replace with Prisma |
| `kids-ascension-admin/lib/services/` | `apps/kids-ascension/api/src/modules/` | HIGH | Business logic |
| `kids-ascension-web/hooks/` | `apps/kids-ascension/web/hooks/` | MEDIUM | Custom React hooks |

### 5.4 Assets Migration

| Source | Destination | Priority | Notes |
|--------|-------------|----------|-------|
| `kids-ascension-web/public/` | `apps/kids-ascension/web/public/` | HIGH | Static assets |
| `kids-ascension-admin/public/` | `apps/admin/public/kids-ascension/` | LOW | Admin assets |

### 5.5 Configuration Migration

| Source | Destination | Priority | Notes |
|--------|-------------|----------|-------|
| `kids-ascension-web/tailwind.config.ts` | `apps/kids-ascension/web/tailwind.config.ts` | HIGH | Preserve KA theme |
| `kids-ascension-web/next.config.ts` | `apps/kids-ascension/web/next.config.ts` | HIGH | Next.js config |
| `package.json` scripts | Root `package.json` | MEDIUM | Add to ecosystem scripts |

---

## 6. Acceptance Criteria

### 6.1 Functional Requirements

- [ ] **Authentication**
  - Users can register via shared authentication
  - Users can log in with email/password
  - Session management works across page refreshes
  - Role-based access control enforced

- [ ] **Course Browsing**
  - Public users can browse available courses
  - Course catalog displays correctly
  - Course detail pages render properly
  - Search and filtering work

- [ ] **Video Playback**
  - Videos play via Cloudflare Stream
  - Adaptive bitrate streaming works
  - Progress tracking functions
  - Video controls (play, pause, seek) work

- [ ] **Learning Progress**
  - Lesson completion tracked correctly
  - Course progress calculated accurately
  - Progress dashboard displays correctly
  - Heatmap/calendar visualization works

- [ ] **Classroom Features**
  - Teachers can create classrooms
  - Students can join via invite code
  - Teacher can view student progress
  - Classroom management features work

- [ ] **Content Creation**
  - Creators can upload videos
  - Video upload to MinIO succeeds
  - Admin can approve videos
  - Approved videos move to R2 and Stream

- [ ] **Admin Dashboard**
  - Admins can access KA admin features
  - Content moderation queue works
  - User management functions
  - Analytics display correctly

### 6.2 Non-Functional Requirements

- [ ] **Performance**
  - Page load time < 2 seconds
  - Video start time < 3 seconds
  - API response time < 500ms (p95)
  - Database query time < 100ms (p95)

- [ ] **Security**
  - Authentication requires valid credentials
  - Authorization checks prevent unauthorized access
  - SQL injection protection verified
  - XSS protection verified
  - CSRF protection enabled

- [ ] **Accessibility**
  - WCAG 2.1 AA compliance
  - Keyboard navigation works
  - Screen reader compatible
  - Color contrast ratios meet standards

- [ ] **Browser Compatibility**
  - Works in Chrome, Firefox, Safari, Edge
  - Responsive design works on mobile
  - Touch gestures work on tablets

- [ ] **Scalability**
  - Can handle 1000 concurrent users
  - Database supports expected load
  - Video streaming scales with CDN

### 6.3 Design Requirements

- [ ] **Visual Identity**
  - KA color palette preserved
  - Custom animations work correctly
  - Background gradient displays properly
  - Typography follows design system

- [ ] **Component Library**
  - All UI components accessible
  - Components match design mockups
  - Dark mode works correctly
  - Responsive breakpoints respected

- [ ] **User Experience**
  - Navigation is intuitive
  - Loading states are clear
  - Error messages are helpful
  - Success feedback is visible

### 6.4 Integration Requirements

- [ ] **Ecosystem Integration**
  - Shared authentication works
  - Database connections established
  - MCP Gateway accessible (if used)
  - Monitoring configured

- [ ] **External Services**
  - Cloudflare Stream configured
  - Cloudflare R2 configured
  - MinIO configured
  - Email service configured (if applicable)

### 6.5 Deployment Requirements

- [ ] **Production Ready**
  - Environment variables configured
  - SSL certificate active
  - Domain resolves correctly
  - Health checks pass

- [ ] **Operational**
  - Monitoring active
  - Logging configured
  - Backup system running
  - Rollback plan documented

- [ ] **Documentation**
  - Architecture documented
  - API documented
  - Deployment runbook complete
  - Operations guide complete

---

## 7. Risk Assessment & Mitigation

### 7.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Database migration issues** | HIGH | MEDIUM | Extensive testing, rollback plan, staged migration |
| **Authentication compatibility** | HIGH | LOW | Use proven NextAuth.js, test thoroughly |
| **Video streaming performance** | MEDIUM | LOW | Cloudflare Stream is battle-tested, monitor performance |
| **Data loss during migration** | HIGH | LOW | Comprehensive backups, dry runs, validation checks |
| **Design system inconsistencies** | MEDIUM | MEDIUM | Create design system documentation, visual regression tests |

### 7.2 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Downtime during deployment** | MEDIUM | MEDIUM | Blue-green deployment, maintenance window |
| **Performance degradation** | MEDIUM | MEDIUM | Load testing, monitoring, scaling plan |
| **Security vulnerabilities** | HIGH | LOW | Security audit, penetration testing, code review |
| **Data privacy issues** | HIGH | LOW | GDPR compliance review, data encryption, access controls |

### 7.3 Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Scope creep** | MEDIUM | HIGH | Clear phase definitions, change control process |
| **Timeline delays** | MEDIUM | MEDIUM | Buffer time, prioritization, parallel work streams |
| **Resource availability** | MEDIUM | LOW | Document everything, knowledge sharing |
| **Dependency delays** | LOW | LOW | Identify dependencies early, have alternatives |

---

## 8. Success Metrics

### 8.1 Technical Metrics

- **Uptime:** 99.9% availability
- **Performance:** < 2s page load, < 3s video start
- **Error Rate:** < 0.1% of requests
- **Database Performance:** < 100ms query time (p95)

### 8.2 User Metrics

- **Authentication Success Rate:** > 98%
- **Video Playback Success Rate:** > 99%
- **Course Completion Rate:** Track baseline
- **User Engagement:** Daily active users, session duration

### 8.3 Operational Metrics

- **Deployment Frequency:** Weekly releases possible
- **Mean Time to Recovery (MTTR):** < 1 hour
- **Change Failure Rate:** < 5%
- **Monitoring Coverage:** 100% of critical paths

---

## 9. Timeline & Milestones

### Overview (10 Weeks)

```
Week 1:  Foundation Setup
Week 2:  UI Component Migration
Week 3:  Frontend Application
Week 4:  Backend API
Week 5:  Admin Dashboard Integration
Week 6:  Data Migration
Week 7:  Testing & QA
Week 8:  Deployment Preparation
Week 9:  Documentation
Week 10: Launch
```

### Key Milestones

- **M1 (Week 2):** Design system extracted and documented
- **M2 (Week 4):** Frontend application functional
- **M3 (Week 6):** Full platform integrated
- **M4 (Week 8):** Production-ready deployment
- **M5 (Week 10):** Live at kids-ascension.dev

---

## 10. Conclusion

This integration plan provides a comprehensive roadmap for migrating the Kids Ascension prototype into the Ozean Licht ecosystem. The phased approach ensures careful preservation of the platform's unique design identity while adopting ecosystem patterns for scalability and maintainability.

### Key Success Factors

1. **Design Preservation:** The custom color palette, animations, and spiritual aesthetic are the core identity of Kids Ascension and must be preserved with highest priority.

2. **Clean Architecture:** Proper separation of concerns, shared authentication, and ecosystem integration ensure long-term maintainability.

3. **Iterative Validation:** Testing at each phase prevents accumulation of issues and ensures quality.

4. **Documentation:** Comprehensive documentation enables future development and operational support.

### Next Steps

1. **Review and Approval:** Stakeholder review of this plan
2. **Resource Allocation:** Assign development team
3. **Phase 1 Kickoff:** Begin foundation setup
4. **Regular Check-ins:** Weekly progress reviews
5. **Adaptation:** Adjust plan based on discoveries

---

**Document Control**

- **Version:** 1.0.0
- **Last Updated:** 2025-01-08
- **Next Review:** Start of each phase
- **Owner:** Kids Ascension Integration Planner Agent
- **Approvers:** Ozean Licht Ecosystem Team

---

**Related Documents**

- `CONTEXT_MAP.md` - Repository navigation
- `CLAUDE.md` - Engineering rules
- `docs/architecture.md` - System architecture
- `apps/kids-ascension/README.md` - Platform overview
- `tools/coolify/kids-ascension-config.md` - Deployment config (to be created)
