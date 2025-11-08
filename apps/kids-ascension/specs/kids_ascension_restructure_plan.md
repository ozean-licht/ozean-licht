# Kids Ascension Restructuring Plan

**Agent:** Planning Agent (Planner Specialist)
**Date:** 2025-01-08
**Mission:** Design comprehensive restructuring plan for Kids Ascension import into megarepo architecture
**Source:** `/opt/ozean-licht-ecosystem/apps/kids-ascension/kids-ascension_OLD/` (2.1 GB)
**Target:** `/opt/ozean-licht-ecosystem/apps/kids-ascension/` (megarepo structure)
**Goal:** Coolify deployment-ready, megarepo-compliant structure

---

## 📊 Executive Summary

### Current State
- **Import Size:** 2.1 GB total (messy import with build artifacts)
- **Actual Source Code:** ~50 MB (2.4% of total)
- **Build Artifacts:** ~512 MB (node_modules: 116M, .next builds: 396M)
- **Git Repository:** 9 MB (nested .git)
- **Structure:** Monorepo-within-monorepo (needs flattening)

### Key Findings
✅ **Two active Next.js applications:**
- `kids-ascension-web/` - Main educational platform (45 .tsx pages, 112 components)
- `kids-ascension-admin/` - Admin dashboard (smaller footprint)

✅ **Valuable assets to preserve:**
- Frontend UI/UX code (React/Next.js 15.5.4)
- Design assets (thumbnails, icons)
- Database migrations (Supabase → PostgreSQL conversion needed)
- Documentation (PRD, guides)

❌ **Items to delete (95%+ of import):**
- 512 MB of build artifacts (.next, node_modules)
- 9 MB nested .git repository
- Duplicate workspace structure
- Old configuration files
- Archive directory with obsolete backup

### Target Architecture
Following megarepo patterns from Admin Dashboard and CONTEXT_MAP.md:
```
apps/kids-ascension/
├── frontend/          # Web application (Next.js)
├── backend/           # API server (Node.js/Express - future)
├── shared/            # Shared types and utilities
├── docs/              # Documentation
├── specs/             # Implementation specs
├── app_docs/          # Feature documentation
├── migrations/        # Database migrations
└── .env.example       # Environment template
```

---

## 🎯 Part 1: Current State Analysis

### 1.1 Directory Structure Analysis

#### kids-ascension_OLD/ (Root - 2.1 GB)
```
kids-ascension_OLD/
├── .git/                          [9 MB]    ❌ DELETE - nested git repo
├── .github/                       [16 KB]   ❌ DELETE - old CI/CD
├── node_modules/                  [116 MB]  ❌ DELETE - root deps
├── kids-ascension-web/            [~700 MB] ⚠️ EXTRACT - main app
│   ├── .next/                     [262 MB]  ❌ DELETE - build artifacts
│   ├── node_modules/              [~350 MB] ❌ DELETE - web deps
│   ├── app/                       [~5 MB]   ✅ KEEP - Next.js pages (45 files)
│   ├── components/                [~8 MB]   ✅ KEEP - React components (112 files)
│   ├── lib/                       [~2 MB]   ✅ KEEP - Utilities & Supabase client
│   ├── public/                    [~15 MB]  ✅ KEEP - Static assets & thumbnails
│   ├── contexts/                  [~500 KB] ✅ KEEP - React contexts
│   ├── hooks/                     [~300 KB] ✅ KEEP - Custom hooks
│   ├── supabase/                  [~3 MB]   ✅ MIGRATE - DB migrations to PostgreSQL
│   └── package.json               [3 KB]    ✅ ADAPT - Merge into frontend/
├── kids-ascension-admin/          [~250 MB] 🔄 EVALUATE - possible redundancy
│   ├── .next/                     [134 MB]  ❌ DELETE - build artifacts
│   ├── node_modules/              [~100 MB] ❌ DELETE - admin deps
│   ├── app/                       [~1 MB]   ⚠️ COMPARE with megarepo admin
│   ├── components/                [~500 KB] ⚠️ COMPARE with megarepo admin
│   └── lib/                       [~300 KB] ⚠️ COMPARE with megarepo admin
├── packages/                      [~2 MB]   🔄 EVALUATE - shared code
│   ├── database/                  ✅ KEEP - Prisma schemas (adapt to Prisma)
│   ├── ui/                        ✅ KEEP - Shared UI components
│   └── utils/                     ✅ KEEP - Shared utilities
├── apps/                          [~5 MB]   ⚠️ OBSOLETE - old monorepo structure
├── archive/                       [400 KB]  ❌ DELETE - old backup
├── config/                        [~100 KB] 🔄 PARTIAL - some configs useful
├── docs/                          [~500 KB] ✅ KEEP - Documentation
├── scripts/                       [~50 KB]  🔄 EVALUATE - migration scripts
├── tests/                         [~200 KB] ✅ KEEP - Test suites
└── webbundles/                    [~1 MB]   ⚠️ UNKNOWN - investigate BMAD

Total to DELETE: ~1.95 GB (93%)
Total to KEEP: ~50 MB (2.4%)
Total to EVALUATE: ~100 MB (4.6%)
```

### 1.2 File Categorization

#### ✅ MUST KEEP - Core Application Code (Priority 1)

**Frontend Application (kids-ascension-web/)**
```
app/                                 # Next.js 15 App Router pages
├── (marketing)/                     # Marketing pages
│   ├── page.tsx                     # Homepage
│   ├── about/page.tsx               # About page
│   ├── curriculum/page.tsx          # Curriculum overview
│   ├── schools/page.tsx             # Schools partnership
│   ├── for-creators/page.tsx        # Creator onboarding
│   └── legal/[type]/page.tsx        # Legal pages
├── (auth)/                          # Authentication flow
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Registration
│   ├── onboarding/page.tsx          # User onboarding
│   └── join/[inviteCode]/page.tsx   # Invite system
├── (creator)/                       # Creator portal
│   └── creator/
│       ├── dashboard/page.tsx       # Creator dashboard
│       └── marketplace/page.tsx     # Idea marketplace
├── (guest)/                         # Public browsing
│   └── explore/page.tsx             # Video exploration
├── watch/[videoId]/page.tsx         # Video player
└── layout.tsx                       # Root layout

components/                          # 112 React components
├── ui/                              # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   └── [80+ more UI primitives]
├── marketing/                       # Marketing components
├── auth/                            # Auth components
├── video/                           # Video player components
└── creator/                         # Creator-specific components

lib/                                 # Utilities and services
├── supabase/                        # Database client (migrate to Prisma)
│   ├── client.ts                    # Browser client
│   ├── server.ts                    # Server client
│   ├── auth.ts                      # Auth helpers
│   ├── middleware.ts                # Middleware
│   └── types.ts                     # Database types (55KB)
├── actions/                         # Server actions
├── services/                        # Business logic
├── hooks/                           # React hooks
├── constants/                       # App constants
├── utils/                           # Utility functions
└── templates/                       # Email/notification templates

public/                              # Static assets (~15 MB)
├── thumbnails/                      # Video thumbnails (20+ images)
├── icons/                           # App icons
├── images/                          # Marketing images
└── favicon.ico

contexts/                            # React Context providers
hooks/                               # Custom React hooks
middleware.ts                        # Next.js middleware
next.config.ts                       # Next.js configuration
tailwind.config.ts                   # Tailwind CSS config
```

**Database Migrations**
```
supabase/migrations/                 # Convert to Prisma migrations
├── 20251008205822_create_learning_progress.sql
├── 20251010_add_missing_core_tables.sql
├── 20251011_idea_marketplace_schema.sql
├── 20251011_trusted_creator_badge.sql
├── 20251011_parent_dashboard_rls.sql
└── [15+ more migrations]

Key tables to migrate:
- users (merge with shared_users_db)
- videos (Cloudflare Stream integration)
- courses (learning paths)
- learning_progress (user progress tracking)
- creator_profiles (creator management)
- idea_marketplace (content requests)
- donations (financial tracking)
```

**Documentation**
```
docs/                                # Product documentation
├── PRD-v3.md                        # Product Requirements Document (SSoT)
├── guides/                          # User guides
└── architecture/                    # Technical architecture

README.md                            # Main project README
CLAUDE.md                            # AI development guide
```

#### 🔄 EVALUATE - Potential Duplicates/Redundancy (Priority 2)

**kids-ascension-admin/** (250 MB total, ~2 MB source)
```
⚠️ DECISION NEEDED: Merge with /apps/admin or keep separate?

Current megarepo has unified Admin Dashboard at /apps/admin/
- Supports both Kids Ascension AND Ozean Licht
- NextAuth authentication
- Role-based access control
- MCP Gateway integration

Options:
A) MERGE: Integrate KA-specific admin features into /apps/admin/
   ✅ Unified admin experience
   ✅ Shared auth and infrastructure
   ✅ Less code duplication
   ❌ More complex initial migration

B) SEPARATE: Keep kids-ascension-admin/ as KA-specific admin
   ✅ Simpler migration
   ✅ Independent development
   ❌ Code duplication
   ❌ Multiple admin panels to maintain

RECOMMENDATION: Option A (MERGE)
- Admin dashboard should be entity-aware (KA vs OL)
- Extract KA-specific features as components
- Integrate into existing /apps/admin/ structure
```

**packages/** (2 MB)
```
packages/database/                   # Prisma schemas
├── schema.prisma                    # Database schema
└── migrations/                      # Old migrations

packages/ui/                         # Shared UI components
├── components/                      # Reusable components
└── styles/                          # Shared styles

packages/utils/                      # Shared utilities
└── src/                             # Utility functions

RECOMMENDATION: Extract to /shared/ in megarepo
- Align with shared/ directory pattern
- Make available to both KA and OL apps
```

**webbundles/** (1 MB)
```
webbundles/                          # BMAD expansion packs
└── README.md                        # "BMAD Framework" references

⚠️ UNKNOWN: What is BMAD?
- Referenced in current README as "CRITICAL - BMAD Framework"
- Contains expansion pack configurations
- May be template/scaffolding system

RECOMMENDATION: PRESERVE but investigate
- Keep in kids-ascension/ root for now
- Document what BMAD is and if still needed
- Consider removing if obsolete
```

#### ❌ DELETE - Build Artifacts & Redundant Files (Priority 3)

**Build Artifacts (512 MB)**
```
node_modules/                        [116 MB]  # Root dependencies
kids-ascension-web/.next/            [262 MB]  # Next.js build
kids-ascension-web/node_modules/     [~350 MB] # Web dependencies
kids-ascension-admin/.next/          [134 MB]  # Admin build
kids-ascension-admin/node_modules/   [~100 MB] # Admin dependencies
```

**Version Control**
```
.git/                                [9 MB]    # Nested git repo
.github/                             [16 KB]   # Old CI/CD workflows
```

**Obsolete Directories**
```
archive/                             [400 KB]  # Old backup DB
apps/                                [5 MB]    # Duplicate monorepo structure
config/mcp/                          [~50 KB]  # Old MCP configs
generated-images/                    [varies]  # AI-generated placeholders
.taskmaster/                         [~10 KB]  # Old task tracking
```

**Configuration Files to Remove**
```
.DS_Store                            # macOS metadata
package-lock.json                    # NPM lock files (use pnpm)
.env.local                           # Local env (should be .env)
.mcp.json                            # Old MCP config
```

---

## 🏗️ Part 2: Target Architecture Design

### 2.1 New Directory Structure

Following megarepo patterns from `/apps/admin/` and CONTEXT_MAP.md:

```
/opt/ozean-licht-ecosystem/apps/kids-ascension/
├── frontend/                        # Main web application (Next.js)
│   ├── app/                         # Next.js App Router
│   │   ├── (marketing)/             # Public pages
│   │   ├── (auth)/                  # Authentication
│   │   ├── (guest)/                 # Unauthenticated browsing
│   │   ├── (student)/               # Student portal (new group)
│   │   ├── (parent)/                # Parent dashboard (new group)
│   │   ├── (creator)/               # Creator portal
│   │   ├── watch/[videoId]/         # Video player
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui primitives
│   │   ├── marketing/               # Marketing components
│   │   ├── auth/                    # Auth components
│   │   ├── video/                   # Video player
│   │   ├── creator/                 # Creator components
│   │   └── shared/                  # Shared components
│   ├── lib/                         # Frontend utilities
│   │   ├── api/                     # API client functions
│   │   ├── auth/                    # Auth helpers
│   │   ├── hooks/                   # React hooks
│   │   ├── services/                # Business logic
│   │   ├── constants/               # Constants
│   │   ├── utils/                   # Utility functions
│   │   └── validation/              # Form validation
│   ├── public/                      # Static assets
│   │   ├── thumbnails/              # Video thumbnails
│   │   ├── icons/                   # Icons
│   │   ├── images/                  # Images
│   │   └── favicon.ico
│   ├── contexts/                    # React Context providers
│   ├── middleware.ts                # Next.js middleware
│   ├── next.config.ts               # Next.js config
│   ├── tailwind.config.ts           # Tailwind config
│   ├── tsconfig.json                # TypeScript config
│   ├── postcss.config.js            # PostCSS config
│   ├── components.json              # shadcn/ui config
│   ├── package.json                 # Frontend dependencies
│   ├── Dockerfile                   # Docker build
│   └── .env.example                 # Environment template
│
├── backend/                         # API server (future)
│   ├── src/
│   │   ├── routes/                  # Express routes
│   │   ├── controllers/             # Route controllers
│   │   ├── services/                # Business logic
│   │   ├── middleware/              # Middleware
│   │   ├── utils/                   # Utilities
│   │   └── server.ts                # Server entry point
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── Dockerfile                   # Docker build
│   └── .env.example                 # Environment template
│
├── shared/                          # Shared code (frontend + backend)
│   ├── types/                       # TypeScript types
│   │   ├── database.types.ts        # Database types (from Prisma)
│   │   ├── api.types.ts             # API request/response types
│   │   ├── user.types.ts            # User-related types
│   │   ├── video.types.ts           # Video-related types
│   │   └── index.ts                 # Type exports
│   ├── constants/                   # Shared constants
│   ├── utils/                       # Shared utilities
│   └── validation/                  # Shared validation schemas
│
├── migrations/                      # Database migrations (Prisma)
│   ├── 001_initial_schema.sql       # Converted from Supabase
│   ├── 002_learning_progress.sql
│   ├── 003_creator_profiles.sql
│   └── [more migrations]
│
├── docs/                            # Documentation
│   ├── PRD-v3.md                    # Product Requirements (SSoT)
│   ├── architecture.md              # Technical architecture
│   ├── api/                         # API documentation
│   ├── guides/                      # User guides
│   │   ├── development.md           # Dev setup
│   │   ├── deployment.md            # Deployment guide
│   │   └── database.md              # Database guide
│   └── decisions/                   # Architecture Decision Records
│
├── specs/                           # Implementation specifications
│   ├── kids_ascension_restructure_plan.md  # This document
│   └── [future specs]
│
├── app_docs/                        # Feature documentation
│   ├── features/                    # Feature docs
│   ├── api/                         # API endpoint docs
│   └── database/                    # Database schema docs
│
├── tests/                           # Cross-app tests
│   ├── e2e/                         # End-to-end tests
│   ├── integration/                 # Integration tests
│   └── playwright.config.ts         # Playwright config
│
├── scripts/                         # Build/deployment scripts
│   ├── seed-mock-data.ts            # Mock data seeding
│   ├── migrate-supabase-to-prisma.ts  # Migration script
│   └── deploy.sh                    # Deployment script
│
├── .env.example                     # Root environment template
├── .gitignore                       # Git ignore
├── .dockerignore                    # Docker ignore
├── package.json                     # Root package.json (workspace)
├── README.md                        # Project README
├── CLAUDE.md                        # AI development guide
└── DEPLOYMENT.md                    # Deployment guide
```

### 2.2 Megarepo Integration Points

#### Shared Infrastructure (from ecosystem root)
```
/opt/ozean-licht-ecosystem/
├── shared/                          # Ecosystem-wide shared code
│   ├── ui-components/               # Shared React components
│   ├── auth/                        # Shared auth logic
│   ├── database/                    # Prisma client configs
│   └── types/                       # Shared TypeScript types
│
├── tools/mcp-gateway/               # MCP Gateway for tool access
│   ├── PostgreSQL                   # kids_ascension_db access
│   ├── Cloudflare Stream            # Video CDN
│   ├── MinIO                        # Video upload staging
│   └── Mem0                         # Agent memory
│
└── apps/admin/                      # Unified admin dashboard
    └── app/(dashboard)/kids-ascension/  # KA-specific admin routes
```

#### Database Strategy
```
PostgreSQL (Multi-tenant)
├── shared_users_db                  # Unified authentication
│   ├── users                        # Core user accounts
│   ├── user_entities                # Entity access (KA/OL)
│   └── sessions                     # Active sessions
│
└── kids_ascension_db                # KA-specific data
    ├── videos                       # Video metadata
    ├── courses                      # Course structure
    ├── learning_progress            # User progress
    ├── creator_profiles             # Creator data
    ├── idea_marketplace             # Content requests
    └── donations                    # Financial tracking
```

#### Storage Strategy (3-Tier)
```
1. MinIO (Hot Storage)
   - Upload staging before moderation
   - Local SSD (~3000 MB/s)
   - Auto-cleanup after 30 days

2. Cloudflare R2 (Cold Storage)
   - Permanent archive of approved videos
   - $0.015/GB/month, zero egress
   - Original quality preservation

3. Cloudflare Stream (CDN)
   - Transcoded video delivery
   - Adaptive bitrate streaming
   - Global edge distribution
```

### 2.3 Technology Stack Alignment

#### Current (kids-ascension-web)
```javascript
{
  "framework": "Next.js 15.5.4",
  "react": "19.2.0",
  "styling": "Tailwind CSS 4.1.14",
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "ui": "shadcn/ui + Radix UI",
  "analytics": "@vercel/analytics"
}
```

#### Target (Megarepo Aligned)
```javascript
{
  "framework": "Next.js 15.5.4",           // ✅ Keep - latest
  "react": "19.2.0",                       // ✅ Keep - latest
  "styling": "Tailwind CSS 4.1.14",        // ✅ Keep - latest
  "database": "PostgreSQL + Prisma",       // 🔄 MIGRATE from Supabase
  "auth": "NextAuth.js v5",                // 🔄 MIGRATE from Supabase Auth
  "ui": "shadcn/ui + Radix UI",            // ✅ Keep - consistent
  "orm": "Prisma",                         // ➕ ADD - megarepo standard
  "mcp": "MCP Gateway",                    // ➕ ADD - tool access
  "monitoring": "Admin Dashboard"          // 🔄 MIGRATE from Vercel Analytics
}
```

#### Migration Requirements
```typescript
// 1. Supabase → Prisma ORM
- Convert database.types.ts to Prisma schema
- Migrate connection patterns (client/server)
- Update all database queries to Prisma syntax

// 2. Supabase Auth → NextAuth.js
- Migrate user authentication flow
- Convert session management
- Update middleware patterns
- Integrate with shared_users_db

// 3. Direct PostgreSQL → MCP Gateway
- Route database calls through /mcp-postgres
- Leverage connection pooling
- Enable agent access to data

// 4. Storage Integration
- Configure MinIO upload client
- Implement Cloudflare Stream API
- Setup R2 archival workflow
```

---

## 🗺️ Part 3: File Migration Mapping

### 3.1 Frontend Application Migration

#### Next.js App Router (app/)
```
SOURCE: kids-ascension_OLD/kids-ascension-web/app/
TARGET: kids-ascension/frontend/app/

OPERATIONS:
✅ COPY ALL - Preserve directory structure
  (marketing)/ → frontend/app/(marketing)/
  (auth)/      → frontend/app/(auth)/
  (creator)/   → frontend/app/(creator)/
  (guest)/     → frontend/app/(guest)/
  watch/       → frontend/app/watch/
  layout.tsx   → frontend/app/layout.tsx

📝 UPDATES NEEDED:
- Update import paths for lib/ utilities
- Update database imports (Supabase → Prisma)
- Update auth imports (Supabase Auth → NextAuth)
- Add new route groups: (student)/, (parent)/
```

#### React Components (components/)
```
SOURCE: kids-ascension_OLD/kids-ascension-web/components/
TARGET: kids-ascension/frontend/components/

OPERATIONS:
✅ COPY ALL - 112 component files
  ui/         → frontend/components/ui/         (shadcn/ui primitives)
  marketing/  → frontend/components/marketing/  (landing page components)
  auth/       → frontend/components/auth/       (login/register forms)
  video/      → frontend/components/video/      (player, playlist)
  creator/    → frontend/components/creator/    (dashboard, upload)

📝 UPDATES NEEDED:
- Update import paths (@/lib → @/frontend/lib)
- Update database type imports
- Update auth context imports
- Ensure Tailwind classes compatible
```

#### Library Code (lib/)
```
SOURCE: kids-ascension_OLD/kids-ascension-web/lib/
TARGET: Multiple targets (lib/ vs shared/)

OPERATIONS:
🔄 SPLIT AND MIGRATE:

Frontend-specific:
  lib/supabase/client.ts    → frontend/lib/api/client.ts         (convert to fetch/Prisma)
  lib/supabase/auth.ts      → frontend/lib/auth/client.ts        (convert to NextAuth)
  lib/hooks/                → frontend/lib/hooks/                (React hooks)
  lib/actions/              → frontend/lib/api/actions.ts        (server actions)
  lib/services/             → frontend/lib/services/             (frontend services)

Shared (frontend + backend):
  lib/supabase/types.ts     → shared/types/database.types.ts     (generate from Prisma)
  lib/constants/            → shared/constants/                  (app constants)
  lib/utils/                → shared/utils/                      (utility functions)
  lib/templates/            → shared/templates/                  (email templates)

📝 MAJOR REFACTOR:
lib/supabase/ → Complete rewrite required
- client.ts: Replace @supabase/ssr with fetch or Prisma Client
- server.ts: Replace with MCP Gateway calls or Prisma
- auth.ts: Replace with NextAuth helpers
- middleware.ts: Convert to NextAuth middleware
- types.ts: Generate from Prisma schema (prisma generate)
```

#### Static Assets (public/)
```
SOURCE: kids-ascension_OLD/kids-ascension-web/public/
TARGET: kids-ascension/frontend/public/

OPERATIONS:
✅ COPY ALL - Static assets
  thumbnails/    → frontend/public/thumbnails/    (20+ video thumbnails)
  icons/         → frontend/public/icons/         (app icons)
  images/        → frontend/public/images/        (marketing images)
  favicon.ico    → frontend/public/favicon.ico

📝 OPTIMIZATION:
- Compress images (optimize for web)
- Convert to WebP where possible
- Verify Cloudflare Stream integration (may not need thumbnails)
```

#### Configuration Files
```
SOURCE: kids-ascension_OLD/kids-ascension-web/
TARGET: kids-ascension/frontend/

OPERATIONS:
✅ COPY with modifications:
  next.config.ts        → frontend/next.config.ts      (update paths)
  tailwind.config.ts    → frontend/tailwind.config.ts  (update content paths)
  tsconfig.json         → frontend/tsconfig.json       (update paths)
  postcss.config.js     → frontend/postcss.config.js   (copy as-is)
  components.json       → frontend/components.json     (update paths)
  middleware.ts         → frontend/middleware.ts       (convert to NextAuth)

📝 UPDATES NEEDED:
next.config.ts:
  - Update output: 'standalone' for Docker
  - Add environment variable validation
  - Configure Cloudflare Stream domains

tsconfig.json:
  - Update paths: { "@/*": ["./frontend/*"], "@shared/*": ["../shared/*"] }
  - Extend from root tsconfig.base.json

middleware.ts:
  - Convert from Supabase middleware to NextAuth
  - Update matcher patterns
  - Add MCP Gateway authentication
```

#### Package Configuration
```
SOURCE: kids-ascension_OLD/kids-ascension-web/package.json
TARGET: kids-ascension/frontend/package.json

OPERATIONS:
🔄 MERGE and UPDATE:

Keep dependencies:
  ✅ next: 15.5.4
  ✅ react: 19.2.0
  ✅ react-dom: 19.2.0
  ✅ tailwindcss: 4.1.14
  ✅ All @radix-ui packages
  ✅ shadcn/ui dependencies
  ✅ lucide-react (icons)
  ✅ framer-motion (animations)
  ✅ @tanstack/react-query
  ✅ class-variance-authority
  ✅ tailwind-merge
  ✅ zod (validation)

Remove dependencies:
  ❌ @supabase/ssr
  ❌ @supabase/supabase-js
  ❌ @vercel/analytics

Add dependencies:
  ➕ next-auth: ^5.0.0-beta.4
  ➕ @prisma/client: ^latest
  ➕ prisma: ^latest (devDependency)
  ➕ bcryptjs (password hashing)
  ➕ zod (NextAuth integration)

Update scripts:
  "dev": "next dev -p 3000"                          (KA uses port 3000)
  "build": "prisma generate && next build"           (generate Prisma client)
  "start": "next start -p 3000"
  "db:push": "prisma db push"
  "db:studio": "prisma studio"
  "db:seed": "tsx scripts/seed-mock-data.ts"
```

### 3.2 Database Migration

#### Schema Migration (Supabase → Prisma)
```
SOURCE: kids-ascension_OLD/kids-ascension-web/supabase/migrations/*.sql
TARGET: kids-ascension/migrations/*.sql + prisma/schema.prisma

OPERATIONS:
🔄 CONVERT SQL migrations to Prisma schema:

Key tables to define:
1. users (integrate with shared_users_db)
   - id, email, role, created_at, updated_at
   - Link to shared_users_db.users via user_id

2. videos
   - id, title, description, creator_id, cloudflare_stream_id
   - duration, thumbnail_url, status (pending/approved/rejected)
   - category, tags, age_range (6-8, 9-11, 12-14)
   - created_at, updated_at

3. courses
   - id, title, description, creator_id
   - lessons (array of video_ids or separate table)
   - difficulty_level, estimated_hours
   - status, created_at, updated_at

4. learning_progress
   - id, user_id, video_id, progress_seconds
   - completed, last_watched_at
   - notes, bookmarks

5. creator_profiles
   - id, user_id, display_name, bio
   - trusted_creator_badge, total_videos
   - total_views, joined_at

6. idea_marketplace
   - id, title, description, requested_by_user_id
   - category, age_range, upvotes
   - status (open/claimed/completed)
   - created_at, claimed_by_creator_id

7. donations
   - id, from_user_id, to_creator_id, amount_cents
   - currency, message, created_at

PRISMA SCHEMA EXAMPLE:
```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("KIDS_ASCENSION_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Video {
  id                  String   @id @default(cuid())
  title               String
  description         String?
  creatorId           String   @map("creator_id")
  cloudflareStreamId  String   @map("cloudflare_stream_id")
  duration            Int      // in seconds
  thumbnailUrl        String?  @map("thumbnail_url")
  status              VideoStatus @default(PENDING)
  category            String
  tags                String[]
  ageRange            AgeRange @map("age_range")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  creator             User     @relation("CreatedVideos", fields: [creatorId], references: [id])
  progress            LearningProgress[]

  @@map("videos")
}

enum VideoStatus {
  PENDING
  APPROVED
  REJECTED
}

enum AgeRange {
  AGE_6_8   @map("6-8")
  AGE_9_11  @map("9-11")
  AGE_12_14 @map("12-14")
}

model LearningProgress {
  id              String   @id @default(cuid())
  userId          String   @map("user_id")
  videoId         String   @map("video_id")
  progressSeconds Int      @default(0) @map("progress_seconds")
  completed       Boolean  @default(false)
  lastWatchedAt   DateTime @default(now()) @map("last_watched_at")
  notes           String?
  bookmarks       Json?

  video           Video    @relation(fields: [videoId], references: [id])

  @@unique([userId, videoId])
  @@map("learning_progress")
}
```

📝 MIGRATION STRATEGY:
1. Create Prisma schema from existing SQL migrations
2. Generate initial migration: `prisma migrate dev --name init`
3. Run migration on kids_ascension_db
4. Seed with mock data for testing
5. Update all database queries in code to use Prisma
```

#### Type Generation
```
BEFORE (Supabase):
  lib/database.types.ts (55 KB) - Manually maintained

AFTER (Prisma):
  node_modules/@prisma/client/index.d.ts - Auto-generated
  shared/types/database.types.ts - Re-export Prisma types

COMMAND:
  npx prisma generate  →  Generates TypeScript types from schema
```

### 3.3 Authentication Migration

#### Supabase Auth → NextAuth.js
```
SOURCE FILES:
  kids-ascension_OLD/kids-ascension-web/lib/supabase/auth.ts
  kids-ascension_OLD/kids-ascension-web/app/(auth)/login/page.tsx
  kids-ascension_OLD/kids-ascension-web/app/(auth)/register/page.tsx
  kids-ascension_OLD/kids-ascension-web/middleware.ts

TARGET FILES:
  frontend/lib/auth/config.ts         # NextAuth configuration
  frontend/lib/auth/client.ts         # Client-side auth helpers
  frontend/app/api/auth/[...nextauth]/route.ts  # NextAuth API route
  frontend/middleware.ts              # NextAuth middleware

MIGRATION STEPS:
1. Install NextAuth: npm install next-auth@beta
2. Create auth configuration at lib/auth/config.ts:

```typescript
// frontend/lib/auth/config.ts
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user) return null

        const valid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    newUser: "/onboarding"
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  }
}
```

3. Update login/register pages to use NextAuth
4. Convert middleware to NextAuth patterns
5. Update all session checks across app

📝 BREAKING CHANGES:
- supabase.auth.getSession() → getServerSession(authConfig)
- supabase.auth.signIn() → signIn('credentials', {...})
- supabase.auth.signOut() → signOut()
```

### 3.4 Shared Code Extraction

#### packages/ → shared/
```
SOURCE: kids-ascension_OLD/packages/
TARGET: kids-ascension/shared/ + /shared/ (ecosystem-wide)

OPERATIONS:
🔄 EXTRACT and CATEGORIZE:

App-specific shared code (kids-ascension/shared/):
  packages/utils/src/        → shared/utils/
    - KA-specific utilities
    - Video formatting helpers
    - Age range validators

  packages/database/schema.prisma → migrations/ + prisma/schema.prisma
    - Convert to Prisma schema
    - Integrate with megarepo database

Ecosystem-wide shared code (/shared/):
  packages/ui/components/    → /shared/ui-components/
    - Reusable UI components
    - Make available to OL and Admin

  packages/ui/styles/        → /shared/ui-components/styles/
    - Shared Tailwind configs
    - Design tokens

📝 DECISION CRITERIA:
Use /apps/kids-ascension/shared/ if:
  - Only used by Kids Ascension
  - Contains KA-specific business logic
  - Tightly coupled to KA data models

Use /shared/ (ecosystem root) if:
  - Used by multiple apps (KA, OL, Admin)
  - Generic UI components
  - Common utilities (date formatting, validation, etc.)
```

### 3.5 Documentation Migration

#### docs/ → docs/
```
SOURCE: kids-ascension_OLD/docs/
TARGET: kids-ascension/docs/

OPERATIONS:
✅ COPY ALL documentation:
  PRD-v3.md             → docs/PRD-v3.md                (SSoT - Product Requirements)
  architecture/         → docs/architecture.md          (Consolidate architecture docs)
  guides/               → docs/guides/                  (User and dev guides)

➕ ADD NEW DOCUMENTATION:
  docs/api/             → API endpoint documentation
  docs/database.md      → Database schema documentation
  docs/deployment.md    → Coolify deployment guide
  docs/decisions/       → Architecture Decision Records (ADRs)

📝 UPDATE EXISTING DOCS:
- Update all path references to new structure
- Add deployment instructions for Coolify
- Document Prisma migration process
- Add database ERD diagram
```

### 3.6 Admin Dashboard Integration

#### Merge kids-ascension-admin/ into /apps/admin/
```
SOURCE: kids-ascension_OLD/kids-ascension-admin/
TARGET: /apps/admin/app/(dashboard)/kids-ascension/

STRATEGY: Extract KA-specific admin features as routes

OPERATIONS:
🔄 SELECTIVE MERGE:

Create new route groups in /apps/admin/:
  /apps/admin/app/(dashboard)/kids-ascension/
    ├── videos/page.tsx           # Video moderation (approve/reject)
    ├── creators/page.tsx         # Creator management
    ├── courses/page.tsx          # Course moderation
    ├── marketplace/page.tsx      # Idea marketplace admin
    ├── reports/page.tsx          # Content reports
    └── analytics/page.tsx        # KA-specific analytics

Extract components:
  kids-ascension-admin/components/  → /apps/admin/components/kids-ascension/
    - VideoModerationCard
    - CreatorStatsPanel
    - CourseApprovalForm
    - ContentReportsList

Update navigation:
  /apps/admin/components/nav/sidebar.tsx
    - Add "Kids Ascension" section
    - Add sub-navigation for KA-specific routes

📝 AUTH INTEGRATION:
- Use existing NextAuth setup from /apps/admin/
- Add KA-specific role checks (ka_admin, ka_moderator)
- Integrate with shared_users_db.user_entities for access control

EXAMPLE ADMIN ROUTE:
```typescript
// /apps/admin/app/(dashboard)/kids-ascension/videos/page.tsx
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { VideoModerationCard } from "@/components/kids-ascension/VideoModerationCard"

export default async function KidsAscensionVideosPage() {
  const session = await getServerSession(authConfig)

  // Check KA admin access
  const hasAccess = await prisma.userEntity.findFirst({
    where: {
      userId: session.user.id,
      entityId: "kids-ascension",
      role: { in: ["admin", "moderator"] }
    }
  })

  if (!hasAccess) {
    return <div>Access Denied</div>
  }

  const pendingVideos = await prisma.video.findMany({
    where: { status: "PENDING" },
    include: { creator: true }
  })

  return (
    <div>
      <h1>Video Moderation</h1>
      {pendingVideos.map(video => (
        <VideoModerationCard key={video.id} video={video} />
      ))}
    </div>
  )
}
```
```

---

## 🚀 Part 4: Implementation Plan

### 4.1 Phase 1: Preparation & Setup (Week 1)

#### Step 1.1: Create New Directory Structure
```bash
cd /opt/ozean-licht-ecosystem/apps/kids-ascension/

# Create frontend structure
mkdir -p frontend/{app,components,lib,public,contexts}
mkdir -p frontend/lib/{api,auth,hooks,services,constants,utils,validation}
mkdir -p frontend/components/{ui,marketing,auth,video,creator,shared}
mkdir -p frontend/public/{thumbnails,icons,images}

# Create backend structure (future)
mkdir -p backend/src/{routes,controllers,services,middleware,utils}

# Create shared structure
mkdir -p shared/{types,constants,utils,validation,templates}

# Create other directories
mkdir -p {migrations,scripts,tests/{e2e,integration}}

echo "✅ Directory structure created"
```

#### Step 1.2: Initialize Package Configuration
```bash
# Root workspace package.json
cat > package.json <<'EOF'
{
  "name": "@ka/monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "pnpm --filter @ka/web dev",
    "dev:admin": "pnpm --filter @admin/dashboard dev",
    "build": "pnpm --parallel build",
    "test": "pnpm --parallel test",
    "db:push": "pnpm --filter @ka/web db:push",
    "db:studio": "pnpm --filter @ka/web db:studio"
  }
}
EOF

# Frontend package.json
cat > frontend/package.json <<'EOF'
{
  "name": "@ka/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "prisma generate && next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx ../scripts/seed-mock-data.ts"
  },
  "dependencies": {
    "next": "15.5.4",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next-auth": "^5.0.0-beta.4",
    "@prisma/client": "^latest",
    "tailwindcss": "4.1.14",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "24.7.0",
    "@types/react": "19.2.2",
    "prisma": "^latest",
    "typescript": "5.9.3"
  }
}
EOF

echo "✅ Package configuration initialized"
```

#### Step 1.3: Setup Prisma
```bash
cd frontend/

# Initialize Prisma
npx prisma init

# Update .env with database URL
cat >> .env <<'EOF'
KIDS_ASCENSION_DATABASE_URL="postgresql://user:password@localhost:5432/kids_ascension_db"
DATABASE_URL="${KIDS_ASCENSION_DATABASE_URL}"
EOF

echo "✅ Prisma initialized"
```

### 4.2 Phase 2: Database Migration (Week 1-2)

#### Step 2.1: Convert Supabase Schema to Prisma
```bash
# Analyze existing Supabase migrations
ls -la ../kids-ascension_OLD/kids-ascension-web/supabase/migrations/

# Create Prisma schema
cat > prisma/schema.prisma <<'EOF'
// See full schema example in Section 3.2
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Models defined here...
EOF

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

echo "✅ Database schema migrated"
```

#### Step 2.2: Setup Shared Users Integration
```bash
# Update schema to reference shared_users_db
cat >> prisma/schema.prisma <<'EOF'
// Reference to shared_users_db (cross-database query)
// Note: Prisma doesn't support cross-db queries natively
// Use raw queries or separate Prisma instances
EOF

# Document the relationship
cat > docs/database.md <<'EOF'
# Database Architecture

## Multi-Tenant Strategy

### shared_users_db (Ecosystem-wide)
- users: Core user accounts
- user_entities: Access mapping (user_id → entity → role)
- sessions: Active sessions

### kids_ascension_db (KA-specific)
- videos, courses, learning_progress
- References shared_users_db.users via user_id (foreign key)

## Querying Across Databases
Use MCP Gateway for cross-database joins:
```typescript
// Get user with KA profile
const user = await mcpPostgres.query(`
  SELECT u.*, kp.display_name, kp.trusted_creator_badge
  FROM shared_users_db.users u
  LEFT JOIN kids_ascension_db.creator_profiles kp ON u.id = kp.user_id
  WHERE u.id = $1
`, [userId])
```
EOF

echo "✅ Shared users integration documented"
```

#### Step 2.3: Seed Mock Data
```bash
# Copy seed script
cp ../kids-ascension_OLD/kids-ascension-web/scripts/seed-mock-data.ts ../scripts/

# Update seed script for Prisma
# (Manual update required - convert Supabase API calls to Prisma)

# Run seed
npm run db:seed

echo "✅ Mock data seeded"
```

### 4.3 Phase 3: Frontend Migration (Week 2-3)

#### Step 3.1: Copy Frontend Code
```bash
# Copy Next.js app directory
cp -r ../../kids-ascension_OLD/kids-ascension-web/app/* app/

# Copy components
cp -r ../../kids-ascension_OLD/kids-ascension-web/components/* components/

# Copy public assets
cp -r ../../kids-ascension_OLD/kids-ascension-web/public/* public/

# Copy contexts and hooks
cp -r ../../kids-ascension_OLD/kids-ascension-web/contexts/* contexts/
cp -r ../../kids-ascension_OLD/kids-ascension-web/hooks/* lib/hooks/

# Copy configuration files
cp ../../kids-ascension_OLD/kids-ascension-web/next.config.ts .
cp ../../kids-ascension_OLD/kids-ascension-web/tailwind.config.ts .
cp ../../kids-ascension_OLD/kids-ascension-web/tsconfig.json .
cp ../../kids-ascension_OLD/kids-ascension-web/postcss.config.js .
cp ../../kids-ascension_OLD/kids-ascension-web/components.json .

echo "✅ Frontend code copied"
```

#### Step 3.2: Update Import Paths
```bash
# Update all import paths (automated with sed/find)
find app components lib contexts -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/supabase|@/lib/api|g' {} +
find app components lib contexts -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/|@/frontend/lib/|g' {} +

# Update shared imports
find app components lib contexts -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils|@shared/utils|g' {} +

echo "✅ Import paths updated"
```

#### Step 3.3: Refactor Database Access
```bash
# Create Prisma client wrapper
cat > lib/api/client.ts <<'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

# Update all Supabase queries to Prisma
# (Manual refactoring required - complex task)
# Example:
# BEFORE: const { data } = await supabase.from('videos').select('*')
# AFTER:  const data = await prisma.video.findMany()

echo "⚠️ Manual refactoring required for database queries"
```

#### Step 3.4: Setup NextAuth
```bash
# Create auth configuration
cat > lib/auth/config.ts <<'EOF'
// See full auth config in Section 3.3
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// ... (full configuration from earlier section)
EOF

# Create NextAuth API route
mkdir -p app/api/auth/[...nextauth]
cat > app/api/auth/[...nextauth]/route.ts <<'EOF'
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
EOF

# Update middleware
cat > middleware.ts <<'EOF'
import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (isAuthPage) {
    if (token) return Response.redirect(new URL('/explore', request.url))
    return null
  }

  if (!token && !request.nextUrl.pathname.startsWith('/explore')) {
    return Response.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/creator/:path*', '/watch/:path*', '/login', '/register']
}
EOF

echo "✅ NextAuth configured"
```

#### Step 3.5: Update Configuration Files
```bash
# Update next.config.ts
cat > next.config.ts <<'EOF'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // For Docker deployment
  images: {
    domains: ['customer-xxxxxx.cloudflarestream.com'], // Cloudflare Stream
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflarestream.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Video metadata uploads
    },
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default nextConfig
EOF

# Update tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

echo "✅ Configuration files updated"
```

### 4.4 Phase 4: Admin Integration (Week 3)

#### Step 4.1: Extract Admin Components
```bash
# Copy KA-specific admin components
mkdir -p /opt/ozean-licht-ecosystem/apps/admin/components/kids-ascension/
cp -r ../../kids-ascension_OLD/kids-ascension-admin/components/* \
     /opt/ozean-licht-ecosystem/apps/admin/components/kids-ascension/

echo "✅ Admin components extracted"
```

#### Step 4.2: Create Admin Routes
```bash
cd /opt/ozean-licht-ecosystem/apps/admin/

# Create KA admin routes
mkdir -p app/\(dashboard\)/kids-ascension/{videos,creators,courses,marketplace,reports,analytics}

# Create video moderation page
cat > app/\(dashboard\)/kids-ascension/videos/page.tsx <<'EOF'
// See full admin route example in Section 3.6
import { getServerSession } from "next-auth"
// ... (full implementation from earlier section)
EOF

echo "✅ Admin routes created"
```

#### Step 4.3: Update Admin Navigation
```bash
# Update sidebar navigation
cat >> app/components/nav/sidebar.tsx <<'EOF'
// Add Kids Ascension section
{
  title: "Kids Ascension",
  items: [
    { title: "Videos", href: "/kids-ascension/videos" },
    { title: "Creators", href: "/kids-ascension/creators" },
    { title: "Courses", href: "/kids-ascension/courses" },
    { title: "Marketplace", href: "/kids-ascension/marketplace" },
    { title: "Reports", href: "/kids-ascension/reports" },
    { title: "Analytics", href: "/kids-ascension/analytics" },
  ]
}
EOF

echo "✅ Admin navigation updated"
```

### 4.5 Phase 5: Deployment Preparation (Week 4)

#### Step 5.1: Create Dockerfile
```bash
cd /opt/ozean-licht-ecosystem/apps/kids-ascension/frontend/

cat > Dockerfile <<'EOF'
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Add non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["node", "server.js"]
EOF

cat > .dockerignore <<'EOF'
node_modules
.next
.git
.env
.env.local
README.md
EOF

echo "✅ Dockerfile created"
```

#### Step 5.2: Create Coolify Configuration
```bash
cat > DEPLOYMENT.md <<'EOF'
# Kids Ascension - Coolify Deployment

## Build Configuration

**Framework:** Next.js 15
**Build Command:** `npm run build`
**Start Command:** `npm start`
**Port:** 3000

## Environment Variables

Required:
```
DATABASE_URL=postgresql://user:pass@postgres:5432/kids_ascension_db
NEXTAUTH_URL=https://kids-ascension.dev
NEXTAUTH_SECRET=<generate-secret>
CLOUDFLARE_ACCOUNT_ID=<cloudflare-account-id>
CLOUDFLARE_API_TOKEN=<cloudflare-api-token>
CLOUDFLARE_STREAM_CUSTOMER_CODE=<customer-code>
MCP_GATEWAY_URL=http://mcp-gateway:8100
```

## Docker Compose (Local)

```yaml
version: '3.8'
services:
  kids-ascension-web:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/kids_ascension_db
    depends_on:
      - postgres
```

## Coolify Deployment Steps

1. Create new service in Coolify
2. Select "Docker Compose" as deployment type
3. Link GitHub repository: ozean-licht-ecosystem
4. Set working directory: `apps/kids-ascension/frontend`
5. Configure environment variables
6. Set domain: `kids-ascension.dev`
7. Enable automatic deployments on `main` branch
8. Deploy!

EOF

echo "✅ Deployment guide created"
```

#### Step 5.3: Create Environment Template
```bash
cat > .env.example <<'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kids_ascension_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_STREAM_CUSTOMER_CODE="customer-xxxxx"

# MCP Gateway
MCP_GATEWAY_URL="http://localhost:8100"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF

echo "✅ Environment template created"
```

### 4.6 Phase 6: Testing & Validation (Week 4)

#### Step 6.1: Setup E2E Tests
```bash
cd /opt/ozean-licht-ecosystem/apps/kids-ascension/

# Copy existing tests
cp -r ../kids-ascension_OLD/kids-ascension-web/__tests__/* tests/

# Update Playwright config
cat > tests/playwright.config.ts <<'EOF'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
EOF

echo "✅ E2E tests configured"
```

#### Step 6.2: Validation Checklist
```bash
cat > VALIDATION_CHECKLIST.md <<'EOF'
# Kids Ascension Restructuring Validation

## Phase 1: Directory Structure ✅
- [ ] All directories created
- [ ] Frontend structure matches design
- [ ] Shared code extracted
- [ ] Migrations directory ready

## Phase 2: Database ✅
- [ ] Prisma schema created
- [ ] Initial migration run
- [ ] Mock data seeded
- [ ] Shared users integration verified

## Phase 3: Frontend ✅
- [ ] All code copied
- [ ] Import paths updated
- [ ] Database queries refactored to Prisma
- [ ] NextAuth configured and tested
- [ ] All pages load without errors

## Phase 4: Admin Integration ✅
- [ ] Admin components extracted
- [ ] Admin routes created
- [ ] Navigation updated
- [ ] Access control verified

## Phase 5: Deployment ✅
- [ ] Dockerfile created and tested
- [ ] Docker build succeeds
- [ ] Environment variables documented
- [ ] Coolify configuration ready

## Phase 6: Testing ✅
- [ ] E2E tests pass
- [ ] Manual testing complete
- [ ] Performance acceptable
- [ ] No console errors

## Final Checks ✅
- [ ] All dead code removed
- [ ] Documentation updated
- [ ] README accurate
- [ ] Git history clean
EOF

echo "✅ Validation checklist created"
```

### 4.7 Phase 7: Cleanup (Week 5)

#### Step 7.1: Remove Old Import
```bash
# Final verification
cd /opt/ozean-licht-ecosystem/apps/kids-ascension/
grep -r "kids-ascension_OLD" . --exclude-dir=kids-ascension_OLD

# If no references found:
sudo rm -rf kids-ascension_OLD/

# Verify space savings
du -sh .
# Expected: ~100 MB (down from 2.1 GB)

echo "✅ Old import removed, 2 GB saved"
```

#### Step 7.2: Update Documentation
```bash
# Update main README
cat > README.md <<'EOF'
# 🚀 Kids Ascension Platform

> Educational platform liberating children through self-paced, teacher-quality learning

**Status:** ✅ Production Ready | Megarepo Architecture

## 🏗️ Structure

```
kids-ascension/
├── frontend/          # Next.js web application
├── backend/           # API server (future)
├── shared/            # Shared code
├── docs/              # Documentation
└── specs/             # Implementation specs
```

## 🚀 Quick Start

```bash
cd frontend/
npm install
npm run db:push    # Run Prisma migrations
npm run db:seed    # Seed mock data
npm run dev        # Start on port 3000
```

## 📖 Documentation

- [Product Requirements](docs/PRD-v3.md)
- [Database Architecture](docs/database.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](docs/api/)

## 🌐 Deployment

Deployed via Coolify at `kids-ascension.dev`

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.
EOF

echo "✅ Documentation updated"
```

---

## 📋 Part 5: Risk Assessment & Mitigation

### 5.1 High-Risk Areas

#### 🔴 Critical Risk: Database Migration
**Risk:** Data loss or corruption during Supabase → PostgreSQL migration
**Impact:** HIGH - Loss of user data, progress tracking, creator content
**Likelihood:** MEDIUM - Complex schema with many relationships

**Mitigation:**
1. ✅ Create full database backup before migration
2. ✅ Test migration on staging database first
3. ✅ Use Prisma migrations (transactional, rollback-able)
4. ✅ Validate data integrity with checksums
5. ✅ Keep Supabase read-only during migration for comparison
6. ✅ Implement data validation tests

**Rollback Plan:**
```bash
# If migration fails, revert to Supabase
1. Stop new app deployment
2. Restore Supabase database from backup
3. Redeploy old Supabase-based application
4. Investigate migration issues
5. Fix and retry migration
```

#### 🔴 Critical Risk: Authentication Migration
**Risk:** Users locked out during Supabase Auth → NextAuth migration
**Impact:** HIGH - Users cannot login, creators cannot upload
**Likelihood:** MEDIUM - Different auth systems, session management

**Mitigation:**
1. ✅ Migrate password hashes correctly (bcrypt compatible)
2. ✅ Test login flow extensively before deployment
3. ✅ Implement session migration script
4. ✅ Maintain user_id consistency across systems
5. ✅ Provide "reset password" fallback for all users
6. ✅ Gradual rollout with feature flag

**Rollback Plan:**
```bash
# If auth breaks, enable dual-auth temporarily
1. Keep Supabase Auth as fallback
2. Implement NextAuth with graceful fallback
3. Log all auth failures for debugging
4. Fix issues incrementally
```

### 5.2 Medium-Risk Areas

#### 🟡 Medium Risk: API Refactoring
**Risk:** Breaking changes in API calls (Supabase → Prisma)
**Impact:** MEDIUM - Features broken, errors in production
**Likelihood:** HIGH - 100+ API calls to refactor

**Mitigation:**
1. ✅ Create API compatibility layer during migration
2. ✅ Write integration tests for all major flows
3. ✅ Use TypeScript to catch type errors
4. ✅ Test incrementally, page by page
5. ✅ Monitor error rates in production

#### 🟡 Medium Risk: Import Path Confusion
**Risk:** Broken imports after restructuring
**Impact:** MEDIUM - Build failures, runtime errors
**Likelihood:** HIGH - Large codebase with many imports

**Mitigation:**
1. ✅ Use automated find/replace for bulk updates
2. ✅ Leverage TypeScript compiler for error detection
3. ✅ Test build process frequently
4. ✅ Use absolute imports with path aliases
5. ✅ ESLint rules to enforce import conventions

#### 🟡 Medium Risk: Performance Regression
**Risk:** New architecture slower than Supabase
**Impact:** MEDIUM - Poor user experience
**Likelihood:** LOW - Prisma is performant

**Mitigation:**
1. ✅ Benchmark before and after migration
2. ✅ Use Prisma query optimization
3. ✅ Implement caching strategy (React Query)
4. ✅ Monitor with APM tools (Sentry, DataDog)
5. ✅ Optimize database indexes

### 5.3 Low-Risk Areas

#### 🟢 Low Risk: Static Asset Migration
**Risk:** Missing images/icons
**Impact:** LOW - Visual issues only
**Likelihood:** LOW - Simple file copy

**Mitigation:**
1. ✅ Verify all assets copied
2. ✅ Check for broken image links
3. ✅ Use Next.js Image component for validation

#### 🟢 Low Risk: Documentation Outdated
**Risk:** Docs don't reflect new structure
**Impact:** LOW - Developer confusion
**Likelihood:** MEDIUM

**Mitigation:**
1. ✅ Update docs incrementally during migration
2. ✅ Use automated doc generation where possible
3. ✅ Code review includes doc updates

### 5.4 Unknown Risks

#### ⚠️ Unknown: BMAD Framework
**Risk:** Breaking critical functionality by removing BMAD
**Impact:** UNKNOWN - Referenced as "CRITICAL" in README
**Likelihood:** UNKNOWN - Need investigation

**Mitigation:**
1. ⚠️ INVESTIGATE: What is BMAD? How is it used?
2. ⚠️ PRESERVE: Keep webbundles/ directory initially
3. ⚠️ TEST: Verify app works without BMAD
4. ⚠️ DOCUMENT: Understand BMAD before removal

**Action Required:**
```bash
# Before cleanup, investigate BMAD
grep -r "BMAD" ../kids-ascension_OLD/ --exclude-dir=node_modules
cat ../kids-ascension_OLD/webbundles/README.md
# Document findings in docs/decisions/ADR-BMAD.md
```

---

## ✅ Part 6: Acceptance Criteria

### 6.1 Functional Requirements

✅ **All core features working:**
- [ ] User authentication (login, register, logout)
- [ ] Video browsing and search
- [ ] Video playback (Cloudflare Stream integration)
- [ ] Learning progress tracking
- [ ] Creator portal (upload, dashboard)
- [ ] Parent dashboard
- [ ] Idea marketplace
- [ ] Course management
- [ ] Admin moderation panel

✅ **Database fully migrated:**
- [ ] All tables created in kids_ascension_db
- [ ] Data migrated from Supabase (if applicable)
- [ ] Relationships and constraints verified
- [ ] Indexes created for performance
- [ ] Prisma Client generated successfully

✅ **Authentication functional:**
- [ ] Users can login with existing credentials
- [ ] New registrations work
- [ ] Session management works
- [ ] Protected routes enforced
- [ ] Role-based access control (student, parent, creator, admin)

✅ **Admin dashboard integrated:**
- [ ] KA-specific routes accessible
- [ ] Video moderation works
- [ ] Creator management works
- [ ] Analytics display correctly
- [ ] Access control enforced

### 6.2 Non-Functional Requirements

✅ **Performance:**
- [ ] Page load time < 2s (95th percentile)
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] No performance regression vs. old app

✅ **Reliability:**
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%
- [ ] Database connection stable
- [ ] No memory leaks

✅ **Maintainability:**
- [ ] Code follows megarepo conventions
- [ ] Documentation comprehensive
- [ ] Tests cover critical paths (>80% coverage)
- [ ] Build process < 5 minutes
- [ ] Clear separation of concerns

✅ **Deployability:**
- [ ] Docker build succeeds
- [ ] Coolify configuration validated
- [ ] Environment variables documented
- [ ] CI/CD pipeline functional
- [ ] Rollback procedure tested

### 6.3 Migration Success Criteria

✅ **Code quality:**
- [ ] No TypeScript errors
- [ ] ESLint passes with 0 errors
- [ ] No console.error() in production
- [ ] All TODOs resolved or documented

✅ **File cleanup:**
- [ ] All build artifacts removed
- [ ] node_modules deleted
- [ ] .git repository removed
- [ ] Obsolete files deleted
- [ ] Space reduced from 2.1 GB to <100 MB

✅ **Documentation:**
- [ ] README.md accurate
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] Deployment guide validated
- [ ] Architecture Decision Records (ADRs) written

✅ **Testing:**
- [ ] All E2E tests pass
- [ ] Integration tests pass
- [ ] Manual QA complete
- [ ] Performance tests pass
- [ ] Security audit complete

### 6.4 Sign-Off Checklist

Before closing this restructuring:

- [ ] **Product Owner:** All features working as expected
- [ ] **Tech Lead:** Code quality meets standards
- [ ] **DevOps:** Deployment successful, monitoring in place
- [ ] **QA:** All tests pass, no critical bugs
- [ ] **Security:** No vulnerabilities, auth secure
- [ ] **Documentation:** All docs updated and accurate

---

## 📝 Part 7: Dependencies & Prerequisites

### 7.1 Required Before Starting

✅ **Infrastructure:**
- [ ] PostgreSQL database `kids_ascension_db` created
- [ ] Database user with full permissions
- [ ] MCP Gateway deployed and accessible
- [ ] Cloudflare Stream account setup
- [ ] MinIO bucket configured

✅ **Access & Credentials:**
- [ ] Database connection string
- [ ] Cloudflare API token
- [ ] MinIO access keys
- [ ] GitHub repository access
- [ ] Coolify admin access

✅ **Tools Installed:**
- [ ] Node.js 20+
- [ ] pnpm (workspace manager)
- [ ] Prisma CLI
- [ ] Docker + Docker Compose
- [ ] Git

### 7.2 Parallel Workstreams

Can be worked on simultaneously:

**Stream A: Database Migration**
- Convert Supabase schema to Prisma
- Create migrations
- Seed data
- Test queries

**Stream B: Frontend Migration**
- Copy code structure
- Update imports
- Refactor Supabase calls
- Setup NextAuth

**Stream C: Admin Integration**
- Extract admin components
- Create admin routes
- Update navigation
- Test access control

**Stream D: Documentation & Deployment**
- Update documentation
- Create Dockerfile
- Setup Coolify config
- Write deployment guide

### 7.3 Blocking Dependencies

❌ **Cannot proceed with Phase 3 until:**
- Phase 2 complete (Prisma schema ready)
- Database migrations run successfully
- Prisma Client generated

❌ **Cannot deploy until:**
- All phases complete
- Tests passing
- Documentation updated
- Environment variables configured

---

## 🎯 Part 8: Next Steps

### Immediate Actions (This Week)

1. **Review & Approval**
   - Product Owner reviews this plan
   - Tech Lead approves architecture decisions
   - Security reviews auth migration strategy

2. **Environment Setup**
   - Provision kids_ascension_db database
   - Configure MCP Gateway access
   - Setup Cloudflare Stream test account

3. **Kick Off Phase 1**
   - Create directory structure
   - Initialize package.json files
   - Setup Prisma

### Implementation Timeline

**Week 1: Setup & Database**
- Phase 1: Directory structure
- Phase 2: Database migration
- Deliverable: Working Prisma schema with seeded data

**Week 2-3: Frontend Migration**
- Phase 3: Frontend code migration
- Deliverable: Functional frontend with NextAuth

**Week 3: Admin Integration**
- Phase 4: Admin dashboard integration
- Deliverable: KA admin features in unified dashboard

**Week 4: Deployment & Testing**
- Phase 5: Deployment preparation
- Phase 6: Testing & validation
- Deliverable: Production-ready application

**Week 5: Cleanup & Launch**
- Phase 7: Remove old import
- Final QA and performance testing
- Production deployment

### Success Metrics

Track progress with:
- [ ] Phases completed: 0/7
- [ ] Tests passing: 0/100
- [ ] Pages migrated: 0/45
- [ ] Components migrated: 0/112
- [ ] Space saved: 0/2 GB

---

## 📚 Appendices

### Appendix A: Key Files Reference

**Configuration Files:**
```
frontend/package.json           # Frontend dependencies
frontend/next.config.ts         # Next.js configuration
frontend/tsconfig.json          # TypeScript config
frontend/tailwind.config.ts     # Tailwind CSS config
frontend/prisma/schema.prisma   # Database schema
frontend/.env.example           # Environment template
frontend/Dockerfile             # Docker build
```

**Core Application Files:**
```
frontend/app/layout.tsx                     # Root layout
frontend/app/(marketing)/page.tsx           # Homepage
frontend/app/watch/[videoId]/page.tsx       # Video player
frontend/lib/auth/config.ts                 # NextAuth config
frontend/lib/api/client.ts                  # Prisma client
```

**Admin Dashboard Files:**
```
/apps/admin/app/(dashboard)/kids-ascension/videos/page.tsx
/apps/admin/components/kids-ascension/VideoModerationCard.tsx
```

### Appendix B: Command Reference

```bash
# Development
pnpm --filter @ka/web dev                  # Start frontend
pnpm --filter @ka/web db:push              # Push schema changes
pnpm --filter @ka/web db:studio            # Open Prisma Studio
pnpm --filter @ka/web db:seed              # Seed mock data

# Build
pnpm --filter @ka/web build                # Build frontend
docker build -t kids-ascension-web ./frontend

# Testing
pnpm --filter @ka/web test                 # Unit tests
pnpm --filter @ka/web test:e2e             # E2E tests

# Database
npx prisma migrate dev                     # Create migration
npx prisma migrate deploy                  # Deploy migration
npx prisma generate                        # Generate Prisma Client
npx prisma studio                          # Open database GUI

# Deployment
docker-compose up                          # Local deployment
# Coolify handles production deployment
```

### Appendix C: Troubleshooting

**Issue: Prisma Client not found**
```bash
Solution: npm install @prisma/client && npx prisma generate
```

**Issue: NextAuth session not persisting**
```bash
Solution: Check NEXTAUTH_SECRET is set and NEXTAUTH_URL matches domain
```

**Issue: Database connection fails**
```bash
Solution: Verify DATABASE_URL format:
postgresql://user:password@host:5432/database
```

**Issue: Import paths broken**
```bash
Solution: Check tsconfig.json paths and run TypeScript compiler
```

### Appendix D: Architecture Decision Records (ADRs)

**ADR-001: Choose Prisma over Supabase Client**
- **Decision:** Use Prisma ORM instead of Supabase client
- **Rationale:** Align with megarepo standard, better TypeScript support
- **Consequences:** Need to migrate all queries, but better long-term maintainability

**ADR-002: Merge Admin Dashboard**
- **Decision:** Integrate KA admin into /apps/admin/ instead of separate app
- **Rationale:** Unified admin experience, shared auth, less duplication
- **Consequences:** More complex initial migration, but better UX

**ADR-003: Use NextAuth v5**
- **Decision:** Migrate from Supabase Auth to NextAuth.js v5
- **Rationale:** Ecosystem standard, more flexible, better documented
- **Consequences:** Auth migration required, but consistent with Admin dashboard

---

## 🏁 Conclusion

This restructuring plan transforms the messy 2.1 GB Kids Ascension import into a clean, megarepo-compliant structure ready for Coolify deployment.

**Key Achievements:**
- ✅ 95% space reduction (2.1 GB → 100 MB)
- ✅ Megarepo architecture alignment
- ✅ Modern tech stack (Next.js 15, Prisma, NextAuth)
- ✅ Unified admin dashboard
- ✅ Production-ready deployment configuration

**Next Steps:**
1. Review and approve this plan
2. Setup infrastructure prerequisites
3. Execute Phase 1 (Directory Structure)
4. Follow 5-week implementation timeline

**Questions or Issues:**
- File issues in GitHub: `ozean-licht-ecosystem/issues`
- Tag: `kids-ascension`, `restructuring`, `migration`

---

**Plan Status:** 🟢 READY FOR IMPLEMENTATION
**Estimated Effort:** 5 weeks (1 developer full-time)
**Risk Level:** 🟡 MEDIUM (mitigated with careful testing)
**Confidence:** 🟢 HIGH (90% - based on Admin dashboard success)

**Agent:** Planning Agent (Planner Specialist)
**Approval Required From:** Product Owner, Tech Lead, DevOps
**Last Updated:** 2025-01-08
