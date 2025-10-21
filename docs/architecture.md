# Ozean Licht Ecosystem - Architecture Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-10-19  
**Status:** Foundation Phase  
**Maintainer:** Lia Lohmann (via Ozean Licht)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Ecosystem Overview](#ecosystem-overview)
3. [Project Entities](#project-entities)
4. [Technology Stack](#technology-stack)
5. [Infrastructure Architecture](#infrastructure-architecture)
6. [Database Architecture](#database-architecture)
7. [Storage Strategy](#storage-strategy)
8. [Authentication & Authorization](#authentication--authorization)
9. [Development Workflow](#development-workflow)
10. [Autonomous Development Lifecycle](#autonomous-development-lifecycle)
11. [LiteRAG Knowledge System](#literag-knowledge-system)
12. [Deployment Strategy](#deployment-strategy)
13. [Kubernetes Migration Path](#kubernetes-migration-path)
14. [Cost Structure](#cost-structure)
15. [Security & Compliance](#security--compliance)
16. [Monitoring & Observability](#monitoring--observability)
17. [Disaster Recovery](#disaster-recovery)
18. [Scaling Strategy](#scaling-strategy)
19. [Development Roadmap](#development-roadmap)
20. [Architectural Decision Records](#architectural-decision-records)

---

## Executive Summary

### Vision
Build a **Zero Touch Engineering ecosystem** where autonomous agents collaborate to develop, deploy, and maintain two interconnected platforms: **Kids Ascension** (video platform) and **Ozean Licht** (main content platform), powered by institutional memory (LiteRAG) and intelligent orchestration (Taskmaster).

### Key Principles
- **Single Source of Truth**: LiteRAG as institutional memory
- **Autonomous Development**: ADW agents with Taskmaster orchestration
- **Shared Infrastructure**: Cost-efficient multi-tenant architecture
- **Legal Separation**: Two independent entities sharing technical foundation
- **Future-Proof**: Clear path to Kubernetes, multi-region, scale

### Current State
- **Phase**: Foundation & MVP Development
- **Infrastructure**: Hetzner AX42 dedicated server
- **Development**: Solo developer + autonomous agents
- **Timeline**: 2-4 weeks to first MVP (Kids Ascension)

---

## Ecosystem Overview

```
Ozean Licht Ecosystem
│
├── Kids Ascension (Video Platform)
│   ├── Entity: Verein Kids Ascension (Austrian Association)
│   ├── Funding: 100% Ozean Licht
│   ├── Purpose: Video sharing for parents + kids
│   └── Domain: kids-ascension.at
│
├── Ozean Licht (Main Platform)
│   ├── Entity: Verein Ozean Licht (Austrian Association)
│   ├── Purpose: Content hub, courses, community
│   └── Domain: ozean-licht.at
│
└── Shared Infrastructure
    ├── Server: Hetzner AX42
    ├── Storage: MinIO + Cloudflare R2/Stream
    ├── Database: PostgreSQL (multi-database)
    ├── Orchestration: Coolify (→ Kubernetes)
    ├── Knowledge: LiteRAG
    └── Development: Taskmaster + ADW Agents
```

### Relationship Model
- **Legal**: Two separate Austrian associations (Vereine)
- **Financial**: Ozean Licht funds Kids Ascension
- **Technical**: Shared infrastructure, separate databases/frontends
- **Branding**: Independent identities, cross-promotion allowed
- **Users**: Can have accounts on both platforms (unified SSO)

---

## Project Entities

### Kids Ascension

**Purpose**: 

**Core Features**:
- Video upload
- Moderation queue
- Video library
- Admin dashboard
- Mobile apps (iOS/Android)

**Tech Stack**:
- Frontend: React (TypeScript) + Tailwind CSS
- Backend: Node.js (TypeScript) + Express
- Database: `kids_ascension_db` (PostgreSQL)
- Storage: MinIO (staging) → Cloudflare R2 (archive) + Stream (delivery)
- Mobile: React Native

**Domain**: `kids-ascension.at`

**Target Users**:
- Parents
- Reviewers (moderate content)
- Kids (view videos - later phase)
- Angels (donors)
- Teachers
- Creators

**Future**: Kubernetes deployment for scale

---

### Ozean Licht

**Purpose**: Main content platform for courses, articles, community

**Core Features** (Planned):
- Course platform
- Content management
- Member area
- Events calendar
- Payment integration (Stripe)

**Tech Stack**:
- Frontend: React (TypeScript) + Tailwind CSS
- Backend: Node.js (TypeScript) + Express
- Database: `ozean_licht_db` (PostgreSQL)
- Storage: MinIO + R2

**Domain**: `ozean-licht.at`

**Target Users**:
- Members (consume content)
- Admins (manage platform)
- Instructors (create courses)

---

## Technology Stack

### Frontend
```yaml
Framework: React 18+
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui (headless, themeable)
State Management: Zustand / React Query
Routing: React Router v6
Build Tool: Vite
Package Manager: pnpm (workspace support)
Deployment: Cloudflare Pages
```

### Backend
```yaml
Runtime: Node.js 20+
Framework: Express.js
Language: TypeScript
API Style: RESTful (GraphQL consideration for future)
Validation: Zod
ORM: Prisma (type-safe database access)
Authentication: JWT + Refresh Tokens
File Upload: Multer + MinIO SDK
Testing: Vitest + Supertest
```

### Database
```yaml
RDBMS: PostgreSQL 15+
Databases:
  - shared_users_db (unified user accounts)
  - kids_ascension_db (KA-specific data)
  - ozean_licht_db (OL-specific data)
  - literag_knowledge_db (LiteRAG storage)
Migrations: Prisma Migrate
Backups: Automated daily (pg_dump)
```

### Storage
```yaml
On-Premise: MinIO (S3-compatible)
  - Purpose: Staging, brand assets, temporary files
  - Location: Hetzner server
  - Buckets: ka-staging, ol-staging, shared-assets

Cloud: Cloudflare R2 (S3-compatible)
  - Purpose: Permanent archive, video masters
  - Cost: $0.015/GB storage, egress-free
  - Buckets: ka-archive, ol-archive

CDN: Cloudflare Stream
  - Purpose: Video delivery (adaptive streaming)
  - Cost: $1/1000 minutes watched
  - Features: Transcoding, thumbnails, player
```

### Development Tools
```yaml
Version Control: Git + GitHub
Monorepo: pnpm workspaces
Code Quality: ESLint + Prettier
Type Checking: TypeScript strict mode
Testing: Vitest (unit) + Playwright (e2e)
CI/CD: GitHub Actions
Containerization: Docker + Docker Compose
Orchestration: Coolify (current) → Kubernetes (future)
```

### Autonomous Development
```yaml
Orchestrator: Taskmaster (TypeScript)
Knowledge Base: LiteRAG (namespaced)
Agents: Parallel development via git worktrees
Context Protocol: MCP (Model Context Protocol)
Development Environment: Claude Code + Cursor
```

---

## Infrastructure Architecture

### Current: Single Server (Hetzner AX42)

```
┌─────────────────────────────────────────────────────────────┐
│                    Hetzner AX42 Server                       │
│                  AMD Ryzen 5 3600 (6c/12t)                   │
│                     64GB RAM, 2x512GB NVMe                   │
│                         Ubuntu 22.04                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Coolify (Orchestration)                 │   │
│  │  - Container management                              │   │
│  │  - Service discovery                                 │   │
│  │  │  - Automatic SSL (Let's Encrypt)                  │   │
│  │  - Git-based deployments                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐ │
│  │                    Docker Engine                       │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │ │
│  │  │ PostgreSQL  │  │   MinIO     │  │   LiteRAG    │ │ │
│  │  │ (Port 5432) │  │ (Port 9000) │  │ (Port 8080)  │ │ │
│  │  │             │  │             │  │              │ │ │
│  │  │ • shared_   │  │ Buckets:    │  │ Namespaces:  │ │ │
│  │  │   users_db  │  │ - ka-stage  │  │ - ka/*       │ │ │
│  │  │ • kids_asc  │  │ - ol-stage  │  │ - ol/*       │ │ │
│  │  │   ension_db │  │ - shared    │  │ - shared/*   │ │ │
│  │  │ • ozean_    │  │             │  │ - support/*  │ │ │
│  │  │   licht_db  │  │             │  │              │ │ │
│  │  │ • literag_  │  │             │  │              │ │ │
│  │  │   know_db   │  │             │  │              │ │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘ │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Application Containers                    │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌─────────────────┐  ┌─────────────────┐       │ │ │
│  │  │  │  KA API         │  │  OL API         │       │ │ │
│  │  │  │  (Node.js)      │  │  (Node.js)      │       │ │ │
│  │  │  │  Port: 3000     │  │  Port: 3001     │       │ │ │
│  │  │  └─────────────────┘  └─────────────────┘       │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌─────────────────────────────────────────────┐ │ │ │
│  │  │  │            MCP Gateway                       │ │ │ │
│  │  │  │  (Universal Context Protocol Server)        │ │ │ │
│  │  │  │  Port: 3100                                  │ │ │ │
│  │  │  │  Exposes: Postgres, MinIO, LiteRAG, Git    │ │ │ │
│  │  │  └─────────────────────────────────────────────┘ │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌─────────────────────────────────────────────┐ │ │ │
│  │  │  │            N8N Workflows                     │ │ │ │
│  │  │  │  (Automation & Webhooks)                    │ │ │ │
│  │  │  │  Port: 5678                                  │ │ │ │
│  │  │  └─────────────────────────────────────────────┘ │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌─────────────────────────────────────────────┐ │ │ │
│  │  │  │         Taskmaster Service                   │ │ │ │
│  │  │  │  (Autonomous Development Orchestrator)      │ │ │ │
│  │  │  │  Port: 4000                                  │ │ │ │
│  │  │  └─────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Nginx (Reverse Proxy)                   │   │
│  │  - SSL Termination                                   │   │
│  │  - Load Balancing (for future)                       │   │
│  │  - Rate Limiting                                     │   │
│  │  Routes:                                             │   │
│  │    api.kids-ascension.at → KA API:3000              │   │
│  │    api.ozean-licht.at → OL API:3001                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS (443)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare (CDN + Security)               │
│  - DDoS Protection                                           │
│  - SSL/TLS                                                   │
│  - WAF (Web Application Firewall)                            │
│  - Bot Management                                            │
│  - R2 Storage (archive)                                      │
│  - Stream (video delivery)                                   │
│  - Pages (frontend hosting)                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Users    │
                    └─────────────┘
```

### External Services

```yaml
Cloudflare:
  Pages: 
    - kids-ascension.at (KA frontend)
    - ozean-licht.at (OL frontend)
  R2: 
    - ka-archive bucket (video masters)
    - ol-archive bucket (future)
  Stream:
    - Video transcoding + delivery
  DNS:
    - Domain management
  CDN:
    - Global edge caching

GitHub:
  Repository: ozean-licht-ecosystem (private monorepo)
  Actions: CI/CD pipelines
  
Stripe (Future):
  - Payment processing (Ozean Licht subscriptions)
  - Webhook handling

Monitoring (Future):
  - Sentry (error tracking)
  - Grafana + Prometheus (metrics)
```

---

## Database Architecture

### Multi-Database Strategy

**Rationale**: Logical separation by entity while sharing physical infrastructure

#### 1. `shared_users_db`
**Purpose**: Unified user authentication across platforms

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User entities (multi-tenancy)
CREATE TABLE user_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  entity_id VARCHAR(50) NOT NULL, -- 'kids_ascension' | 'ozean_licht'
  role VARCHAR(50) NOT NULL, -- 'user' | 'admin' | 'moderator'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, entity_id)
);

-- OAuth providers
CREATE TABLE oauth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider VARCHAR(50) NOT NULL, -- 'google' | 'facebook'
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `kids_ascension_db`
**Purpose**: Kids Ascension specific data

```sql
-- Parents (extends users)
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References shared_users_db.users.id
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kids profiles
CREATE TABLE kids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES parents(id),
  name VARCHAR(100) NOT NULL,
  birth_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES parents(id),
  kid_id UUID REFERENCES kids(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER, -- seconds
  file_size BIGINT, -- bytes
  mime_type VARCHAR(100),
  
  -- Storage
  minio_key VARCHAR(500), -- Staging
  r2_key VARCHAR(500), -- Archive
  cloudflare_stream_id VARCHAR(255), -- Delivery
  thumbnail_url TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  moderation_notes TEXT,
  moderated_by UUID, -- References shared_users_db.users.id
  moderated_at TIMESTAMP,
  
  -- Metadata
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Video visibility
CREATE TABLE video_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id),
  visibility VARCHAR(50) DEFAULT 'private', -- 'private' | 'family' | 'public'
  password VARCHAR(255), -- Optional password protection
  created_at TIMESTAMP DEFAULT NOW()
);

-- Video shares (for family/friends)
CREATE TABLE video_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id),
  shared_with_email VARCHAR(255),
  share_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments (future feature)
CREATE TABLE video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id),
  user_id UUID NOT NULL, -- References shared_users_db.users.id
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id),
  viewer_id UUID, -- Optional, can be anonymous
  watch_duration INTEGER, -- seconds
  completed BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `ozean_licht_db`
**Purpose**: Ozean Licht platform data (future)

```sql
-- Members (extends users)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References shared_users_db.users.id
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  subscription_tier VARCHAR(50), -- 'free' | 'basic' | 'premium'
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES members(id),
  thumbnail_url TEXT,
  price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Course modules
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Course lessons
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  duration INTEGER, -- seconds
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  member_id UUID REFERENCES members(id),
  progress DECIMAL(5,2) DEFAULT 0.00, -- percentage
  completed BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Blog posts / Content
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES members(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `literag_knowledge_db`
**Purpose**: LiteRAG knowledge base storage

```sql
-- Knowledge chunks
CREATE TABLE literag_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace VARCHAR(255) NOT NULL, -- 'kids-ascension/architecture'
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  content_vector VECTOR(1536), -- For semantic search (OpenAI embeddings)
  tags TEXT[], -- Array of tags
  metadata JSONB, -- Flexible metadata
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100) -- 'reporter-agent' | 'taskmaster' | 'human'
);

-- Indexes
CREATE INDEX idx_namespace ON literag_knowledge(namespace);
CREATE INDEX idx_tags ON literag_knowledge USING GIN(tags);
CREATE INDEX idx_content_vector ON literag_knowledge USING ivfflat(content_vector);

-- Knowledge relationships (for graph queries)
CREATE TABLE knowledge_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_chunk_id UUID REFERENCES literag_knowledge(id),
  to_chunk_id UUID REFERENCES literag_knowledge(id),
  relationship_type VARCHAR(50), -- 'related' | 'supersedes' | 'implements'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Connections

```typescript
// Shared database client
import { PrismaClient } from '@prisma/client';

const sharedUsersDB = new PrismaClient({
  datasources: {
    db: { url: process.env.SHARED_USERS_DB_URL }
  }
});

const kidsAscensionDB = new PrismaClient({
  datasources: {
    db: { url: process.env.KIDS_ASCENSION_DB_URL }
  }
});

const ozeanLichtDB = new PrismaClient({
  datasources: {
    db: { url: process.env.OZEAN_LICHT_DB_URL }
  }
});

const literagDB = new PrismaClient({
  datasources: {
    db: { url: process.env.LITERAG_DB_URL }
  }
});
```

### Migration Strategy

```bash
# Each database has its own migration folder
projects/kids-ascension/api/prisma/
├── schema.prisma
└── migrations/

projects/ozean-licht/api/prisma/
├── schema.prisma
└── migrations/

shared/database/prisma/
├── schema.prisma  # shared_users_db
└── migrations/

tools/.knowledge/literag/prisma/
├── schema.prisma
└── migrations/
```

---

## Storage Strategy

### Three-Tier Storage System

#### Tier 1: MinIO (Hot Storage - On-Premise)
**Purpose**: Staging area, brand assets, temporary files

```yaml
Location: Hetzner server (Docker container)
Cost: $0 (included in server cost)
Performance: Local SSD (~3000 MB/s)
Use Cases:
  - Video upload staging
  - Image processing queue
  - Brand assets (logos, fonts)
  - Temporary file generation
  - Development/testing assets

Buckets:
  ka-staging:
    - Uploaded videos awaiting moderation
    - Retention: 30 days (auto-cleanup)
  
  ol-staging:
    - Uploaded content awaiting processing
    - Retention: 30 days
  
  shared-assets:
    - Brand logos, fonts
    - Email templates
    - Retention: Permanent

Configuration:
  - S3-compatible API
  - Access keys per project
  - Lifecycle policies for auto-deletion
  - Versioning enabled
  - Encryption at rest
```

#### Tier 2: Cloudflare R2 (Cold Storage - Archive)
**Purpose**: Permanent storage for video masters

```yaml
Location: Cloudflare global network
Cost: $0.015/GB/month storage, $0 egress
Performance: ~100-200ms first byte
Use Cases:
  - Approved video masters (original quality)
  - Backup archive
  - Long-term asset storage

Buckets:
  ka-archive:
    - Original video files (post-moderation)
    - Retention: Permanent
    - Access: Infrequent
  
  ol-archive:
    - Course videos, content assets
    - Retention: Permanent

Configuration:
  - S3-compatible API
  - Lifecycle policies
  - Object versioning
  - Immutable backups
  - Cross-region replication (future)
```

#### Tier 3: Cloudflare Stream (Delivery - CDN)
**Purpose**: Video streaming to end users

```yaml
Location: Cloudflare edge (300+ locations)
Cost: $1 per 1000 minutes watched + $5/1000 minutes stored
Performance: <50ms to user (edge delivery)
Use Cases:
  - Adaptive video streaming
  - Automatic transcoding
  - Thumbnail generation
  - Player embedding

Features:
  - Multiple quality levels (360p, 720p, 1080p)
  - Automatic bitrate adjustment
  - Signed URLs (secure access)
  - Analytics (views, watch time)
  - Mobile optimization

Upload Flow:
  1. Parent uploads to MinIO staging
  2. Admin approves in moderation queue
  3. Video copied to R2 archive (original)
  4. Video sent to Cloudflare Stream (processing)
  5. Stream transcodes to multiple qualities
  6. Stream ID stored in database
  7. Frontend embeds Stream player
```

### Storage Flow Diagram

```
User Upload
    ↓
┌─────────────────┐
│ MinIO Staging   │ ← Immediate upload
│ (Hot Storage)   │   Fast local SSD
└────────┬────────┘
         │
         │ Admin Approval
         ↓
┌─────────────────┐       ┌──────────────────┐
│ Cloudflare R2   │←──────│ Cloudflare Stream│
│ (Archive)       │       │ (CDN Delivery)   │
│ Original Master │       │ Transcoded       │
└─────────────────┘       └────────┬─────────┘
                                   │
                                   │ HLS/DASH
                                   ↓
                              ┌─────────┐
                              │  Users  │
                              │ (Watch) │
                              └─────────┘
```

### Cost Projections

```yaml
Early Stage (< 1000 videos, < 10k views/month):
  MinIO: $0 (included)
  R2 Storage: ~100GB × $0.015 = $1.50/mo
  Stream Storage: 1000 min × $5/1000 = $5/mo
  Stream Delivery: 10k min × $1/1000 = $10/mo
  Total: ~$16.50/mo

Growth (10k videos, 100k views/month):
  MinIO: $0
  R2 Storage: 1TB × $0.015 = $15/mo
  Stream Storage: 10k min × $5/1000 = $50/mo
  Stream Delivery: 100k min × $1/1000 = $100/mo
  Total: ~$165/mo

Scale (100k videos, 1M views/month):
  MinIO: $0
  R2 Storage: 10TB × $0.015 = $150/mo
  Stream Storage: 100k min × $5/1000 = $500/mo
  Stream Delivery: 1M min × $1/1000 = $1000/mo
  Total: ~$1,650/mo
```

---

## Authentication & Authorization

### Unified SSO with Entity Context

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  entities: {
    entityId: 'kids_ascension' | 'ozean_licht';
    role: 'user' | 'admin' | 'moderator';
  }[];
  iat: number;
  exp: number;
}

// Example token for Lia Lohmann (super admin)
{
  "userId": "uuid-123",
  "email": "lia@ozean-licht.at",
  "entities": [
    { "entityId": "kids_ascension", "role": "admin" },
    { "entityId": "ozean_licht", "role": "admin" }
  ],
  "iat": 1697712000,
  "exp": 1697715600 // 1 hour
}
```

### Authentication Flow

```
1. User Login
   ↓
2. POST /api/auth/login
   Body: { email, password }
   ↓
3. Verify credentials (shared_users_db)
   ↓
4. Fetch user entities
   Query: user_entities WHERE user_id = ?
   ↓
5. Generate JWT (access token) + Refresh token
   ↓
6. Return tokens
   { accessToken, refreshToken }
   ↓
7. Client stores tokens
   - accessToken: Memory (React state)
   - refreshToken: httpOnly cookie
```

### Authorization Middleware

```typescript
// Express middleware
function requireAuth(requiredEntity?: string, requiredRole?: string) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      // Check entity access
      if (requiredEntity) {
        const hasAccess = decoded.entities.some(
          e => e.entityId === requiredEntity
        );
        
        if (!hasAccess) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
      
      // Check role
      if (requiredRole) {
        const hasRole = decoded.entities.some(
          e => e.entityId === requiredEntity && e.role === requiredRole
        );
        
        if (!hasRole) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// Usage
app.get('/api/videos', 
  requireAuth('kids_ascension'),
  async (req, res) => {
    // Only users with kids_ascension entity can access
  }
);

app.post('/api/videos/:id/approve',
  requireAuth('kids_ascension', 'admin'),
  async (req, res) => {
    // Only admins of kids_ascension can approve
  }
);
```

### OAuth Integration

```yaml
Providers:
  - Google OAuth 2.0
  - Facebook (future consideration)

Flow:
  1. User clicks "Sign in with Google"
  2. Redirect to Google OAuth consent
  3. Google redirects back with auth code
  4. Exchange code for Google tokens
  5. Fetch user info from Google
  6. Check if user exists (via email)
  7. If new: Create user in shared_users_db
  8. If existing: Link OAuth provider
  9. Generate JWT + refresh token
  10. Return to client
```

### Role-Based Access Control (RBAC)

```yaml
Roles:
  user:
    kids_ascension:
      - Upload videos
      - View own videos
      - Comment on videos
    ozean_licht:
      - Access free content
      - Enroll in courses
  
  moderator:
    kids_ascension:
      - Review uploaded videos
      - Approve/reject videos
      - View moderation queue
  
  admin:
    kids_ascension:
      - All moderator permissions
      - User management
      - Platform settings
      - Analytics access
    ozean_licht:
      - Content management
      - Course creation
      - User management
      - Platform settings
  
  super_admin:
    - Access to both platforms
    - Infrastructure management
    - Database access
    - System configuration
```

---

## Development Workflow

### Monorepo Structure

```
ozean-licht-ecosystem/
├── .claude/                      # Root commands (ecosystem-wide)
├── .taskmaster/                  # Autonomous development
├── worktrees/                    # Parallel agent work
├── projects/
│   ├── kids-ascension/
│   │   ├── .claude/              # KA-specific commands
│   │   ├── apps/
│   │   │   ├── web/              # React frontend
│   │   │   ├── mobile/           # React Native
│   │   │   └── admin/            # Admin dashboard
│   │   ├── api/                  # Node.js backend
│   │   │   ├── src/
│   │   │   ├── prisma/
│   │   │   └── tests/
│   │   ├── docs/
│   │   └── package.json
│   │
│   └── ozean-licht/
│       └── [similar structure]
│
├── shared/                       # Shared code
│   ├── ui-components/            # React components
│   ├── utils/                    # Helper functions
│   ├── auth/                     # Auth logic
│   ├── database/                 # Prisma client
│   └── types/                    # TypeScript types
│
├── infrastructure/               # DevOps
│   ├── docker/
│   ├── kubernetes/               # Future K8s configs
│   ├── coolify/
│   └── scripts/
│
├── tools/                        # Development tools
│   ├── .knowledge/               # LiteRAG
│   ├── .mcp/                     # MCP Gateway
│   └── .support-rag/             # Support agent
│
├── docs/                         # Documentation
│   ├── architecture.md           # This file
│   ├── adrs/                     # Decision records
│   └── guides/
│
├── package.json                  # Root package.json
├── pnpm-workspace.yaml           # Workspace config
└── turbo.json                    # Turborepo config (optional)
```

### Git Workflow

```yaml
Branches:
  main:
    - Production-ready code
    - Protected branch
    - Requires PR approval
  
  develop:
    - Integration branch
    - All feature branches merge here first
  
  feature/*:
    - NOT used directly
    - Instead: git worktrees for parallel development
  
Worktrees:
  - Each task gets its own worktree
  - Agents work in parallel
  - Taskmaster manages lifecycle
  - Auto-cleanup after merge

Example:
  # Taskmaster creates worktrees
  worktrees/
  ├── ka-video-upload/      # Agent 1
  ├── ka-auth-system/       # Agent 2
  └── ol-course-platform/   # Agent 3
```

### Package Management

```yaml
Tool: pnpm (workspace support)

Workspace Structure:
  - projects/kids-ascension/apps/web
  - projects/kids-ascension/api
  - projects/ozean-licht/apps/web
  - projects/ozean-licht/api
  - shared/*

Commands:
  # Install all dependencies
  pnpm install
  
  # Run specific project
  pnpm --filter @ka/web dev
  pnpm --filter @ka/api dev
  
  # Run all projects
  pnpm --parallel dev
  
  # Build all
  pnpm --recursive build
  
  # Test all
  pnpm --recursive test
```

### Development Commands (Claude)

```bash
# Root .claude/commands/
/plan                # Taskmaster: Plan MVP
/execute             # Taskmaster: Execute tasks
/integrate           # Taskmaster: Integration validation
/deploy-all          # Deploy both projects
/backup-db           # Backup all databases
/query-literag       # Query knowledge base

# Project .claude/commands/
/dev                 # Start dev server (project-specific)
/build               # Build for production
/test                # Run tests
/test-video-upload   # Test video flow (KA only)
/test-auth           # Test auth flow
```

---

## Autonomous Development Lifecycle

### Taskmaster Orchestration

```typescript
// .taskmaster/typescript/src/index.ts

class Taskmaster {
  private literag: LiteRAGClient;
  private reporter: ReporterAgent;
  private worktreeManager: WorktreeManager;
  
  /**
   * Phase 1: Planning
   * Input: MVP requirements (natural language)
   * Output: task_manifest.json
   */
  async plan(mvpRequirements: string, project: string) {
    // 1. Query LiteRAG for context
    const context = await this.literag.query({
      namespace: `${project}/*`,
      query: mvpRequirements,
      limit: 10
    });
    
    // 2. Decompose into tasks
    const tasks = await this.decompose(mvpRequirements, context);
    
    // 3. Create dependency graph
    const graph = this.buildDependencyGraph(tasks);
    
    // 4. Allocate worktrees
    const manifest = {
      project,
      mvp: mvpRequirements,
      tasks: tasks.map(t => ({
        ...t,
        worktree: `worktrees/${project}-${t.id}`
      })),
      execution_plan: this.createExecutionWaves(graph)
    };
    
    // 5. Save manifest
    await this.saveManifest(manifest);
    
    // 6. Reporter logs the plan
    await this.reporter.upload({
      namespace: `${project}/tasks`,
      title: `MVP Plan: ${mvpRequirements}`,
      content: JSON.stringify(manifest, null, 2),
      tags: ['planning', 'mvp']
    });
    
    return manifest;
  }
  
  /**
   * Phase 2: Execution
   * Input: task_manifest.json
   * Output: Parallel agent work
   */
  async execute(manifestPath: string) {
    const manifest = await this.loadManifest(manifestPath);
    
    // Execute in waves (respecting dependencies)
    for (const wave of manifest.execution_plan) {
      await Promise.all(
        wave.map(taskId => this.executeTask(manifest.tasks[taskId]))
      );
    }
  }
  
  /**
   * Phase 3: Integration
   * Input: Completed worktrees
   * Output: Merged code or fix tasks
   */
  async integrate(manifestPath: string) {
    const manifest = await this.loadManifest(manifestPath);
    
    // 1. Run integration tests
    const testResults = await this.runIntegrationTests(manifest);
    
    // 2. Check for conflicts
    const conflicts = await this.checkConflicts(manifest);
    
    // 3. Validate against requirements
    const validation = await this.validateRequirements(manifest);
    
    if (testResults.passed && conflicts.length === 0 && validation.passed) {
      // Merge all worktrees
      await this.mergeWorktrees(manifest);
      
      // Log success
      await this.reporter.upload({
        namespace: `${manifest.project}/learnings`,
        title: `MVP Success: ${manifest.mvp}`,
        content: 'All tasks completed and integrated',
        tags: ['success', 'integration']
      });
    } else {
      // Create fix tasks
      await this.createFixTasks(testResults, conflicts, validation);
    }
  }
}
```

### Agent Types

```yaml
Feature Developer:
  role: "Frontend feature implementation"
  worktree: "worktrees/features/*"
  responsibilities:
    - React components
    - User interactions
    - Styling (Tailwind)
    - Component tests
  queries_literag:
    - "{project}/patterns" (code patterns)
    - "shared/ui-components" (reusable components)

Backend Developer:
  role: "API endpoints & business logic"
  worktree: "worktrees/api/*"
  responsibilities:
    - Express routes
    - Database queries (Prisma)
    - Integration tests
    - API documentation
  queries_literag:
    - "{project}/architecture" (data flows)
    - "shared/database" (query patterns)

DevOps Engineer:
  role: "Infrastructure & deployment"
  worktree: "worktrees/infra/*"
  responsibilities:
    - Docker configs
    - CI/CD pipelines
    - Monitoring setup
    - Database migrations
  queries_literag:
    - "shared/infrastructure" (deployment patterns)

Technical Writer:
  role: "Documentation generation"
  worktree: "worktrees/docs/*"
  responsibilities:
    - API documentation
    - User guides
    - Architecture diagrams
    - README updates
  queries_literag:
    - "{project}/features" (feature specs)
    - "{project}/api" (API docs)

Reporter Agent:
  role: "Knowledge engineering"
  no_worktree: true
  responsibilities:
    - Parse brainstorming sessions
    - Chunk knowledge
    - Upload to LiteRAG
    - Cross-reference content
  queries_literag:
    - All namespaces (for context)
```

### Worktree Lifecycle

```bash
# 1. Taskmaster creates worktree
git worktree add worktrees/ka-video-upload -b feature/ka-video-upload

# 2. Agent works in worktree
cd worktrees/ka-video-upload
# Implement feature
# Run tests
# Commit changes

# 3. Agent logs progress to LiteRAG
curl -X POST http://localhost:8080/upload \
  -d '{
    "namespace": "kids-ascension/learnings",
    "title": "Video Upload Implementation",
    "content": "Implemented using react-dropzone...",
    "tags": ["video", "upload", "react"]
  }'

# 4. Taskmaster validates
cd ../..
pnpm --filter @ka/web test
pnpm --filter @ka/api test

# 5. Merge to main
git checkout main
git merge feature/ka-video-upload

# 6. Cleanup worktree
git worktree remove worktrees/ka-video-upload
```

---

## LiteRAG Knowledge System

### Architecture

```yaml
Instance: Single LiteRAG server
Port: 8080
Database: literag_knowledge_db (PostgreSQL)
Vector Search: pgvector extension
Embeddings: OpenAI text-embedding-ada-002
```

### Namespace Strategy

```
literag_knowledge/
├── kids-ascension/
│   ├── architecture/          # System design docs
│   ├── decisions/             # ADRs
│   ├── patterns/              # Code patterns
│   ├── features/              # Feature specs
│   ├── learnings/             # What worked/didn't
│   ├── api/                   # API documentation
│   └── tasks/                 # Task history
│
├── ozean-licht/
│   └── [same structure]
│
├── shared/
│   ├── infrastructure/        # DevOps knowledge
│   ├── auth/                  # Auth patterns
│   ├── storage/               # Storage patterns
│   ├── database/              # DB patterns
│   └── deployment/            # Deployment strategies
│
└── support/
    ├── faqs/                  # Common questions
    ├── troubleshooting/       # Known issues
    ├── workflows/             # Support processes
    └── tickets/               # Sanitized ticket history
```

### Upload Metaprompts

```markdown
# /upload-architecture
Upload architectural knowledge to LiteRAG.

Usage: /upload-architecture <project> <title> <content>

Example:
/upload-architecture kids-ascension "Video Upload Flow" "
Parents upload videos via web interface (max 500MB).
Files staged in MinIO. Admin moderation queue.
Approved videos → R2 archive + Cloudflare Stream.
"

# /upload-decision
Upload architectural decision record (ADR).

Usage: /upload-decision <project> <title> <decision>

Example:
/upload-decision kids-ascension "ADR-003: MinIO for Staging" "
Decision: Use MinIO on Hetzner for video staging.
Context: Need cost-effective local storage.
Alternatives: Direct to R2 (more expensive).
Consequences: Must manage MinIO, but saves $50/mo.
"

# /upload-pattern
Upload code pattern to LiteRAG.

Usage: /upload-pattern <project> <title> <pattern>

Example:
/upload-pattern kids-ascension "React Video Upload Component" "
Use react-dropzone for file selection.
Axios for multipart upload with progress tracking.
Display progress bar and error handling.
"

# /upload-learning
Upload project learning to LiteRAG.

Usage: /upload-learning <project> <title> <learning>

Example:
/upload-learning kids-ascension "Large File Upload Challenge" "
Challenge: Large videos (>100MB) timeout.
Solution: Chunked upload with resumable capability.
Implementation: MinIO multipart upload API.
"
```

### Query API

```typescript
// LiteRAG Client
class LiteRAGClient {
  async query(params: {
    namespace: string;       // 'kids-ascension/*'
    query: string;           // Natural language query
    limit?: number;          // Max results (default: 5)
    tags?: string[];         // Filter by tags
  }) {
    const response = await fetch('http://localhost:8080/query', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    return response.json();
  }
  
  async upload(params: {
    namespace: string;
    title: string;
    content: string;
    tags: string[];
    metadata?: Record<string, any>;
  }) {
    const response = await fetch('http://localhost:8080/upload', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    return response.json();
  }
}

// Usage in Taskmaster
const literag = new LiteRAGClient();

// Query for video upload patterns
const patterns = await literag.query({
  namespace: 'kids-ascension/patterns',
  query: 'video upload react component',
  limit: 3,
  tags: ['video', 'upload', 'react']
});

// Upload new learning
await literag.upload({
  namespace: 'kids-ascension/learnings',
  title: 'Video Thumbnail Generation',
  content: 'Use ffmpeg to extract frame at 2 seconds...',
  tags: ['video', 'thumbnail', 'ffmpeg']
});
```

---

## Deployment Strategy

### Current: Coolify

```yaml
Platform: Coolify (self-hosted PaaS)
Server: Hetzner AX42
Deployment Method: Git-based

Projects:
  kids-ascension-api:
    repo: ozean-licht-ecosystem
    path: projects/kids-ascension/api
    build: pnpm --filter @ka/api build
    start: pnpm --filter @ka/api start
    port: 3000
    env:
      - DATABASE_URL
      - JWT_SECRET
      - MINIO_ENDPOINT
    domain: api.kids-ascension.at
    ssl: Let's Encrypt (auto)
  
  ozean-licht-api:
    repo: ozean-licht-ecosystem
    path: projects/ozean-licht/api
    port: 3001
    domain: api.ozean-licht.at

Frontends:
  - Deployed to Cloudflare Pages
  - Build: pnpm --filter @ka/web build
  - Output: dist/
  - Domain: kids-ascension.at

Services:
  postgres:
    image: postgres:15-alpine
    volumes: [/data/postgres]
    ports: [5432]
  
  minio:
    image: minio/minio:latest
    volumes: [/data/minio]
    ports: [9000, 9001]
    command: server /data --console-address :9001
  
  literag:
    build: tools/.knowledge/literag
    ports: [8080]
    env:
      - POSTGRES_URL
      - OPENAI_API_KEY
  
  mcp-gateway:
    build: tools/.mcp
    ports: [3100]
    env:
      - POSTGRES_URL
      - MINIO_ENDPOINT
      - LITERAG_URL
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm --recursive test
  
  deploy-ka-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Coolify
        run: |
          curl -X POST https://coolify.ozean-licht.at/api/deploy \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}" \
            -d '{"project": "kids-ascension-api"}'
  
  deploy-ka-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm --filter @ka/web build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          command: pages deploy projects/kids-ascension/apps/web/dist --project-name=kids-ascension
```

---

## Kubernetes Migration Path

### When to Migrate

```yaml
Triggers:
  - Traffic: >100k DAU (daily active users)
  - Scale: Need auto-scaling
  - Availability: Require 99.9% SLA
  - Multi-region: Global user base
  - Team: Multiple developers/DevOps

Current Status: NOT needed yet
Timeline: 6-12 months (post-MVP validation)
```

### Migration Strategy

```yaml
Phase 1: Preparation (Weeks 1-2)
  - Dockerize all services (already done)
  - Create Kubernetes manifests
  - Test locally with minikube/k3s
  - Document dependencies

Phase 2: Infrastructure (Weeks 3-4)
  - Provision Kubernetes cluster (Hetzner K8s or managed)
  - Setup ingress controller (Nginx/Traefik)
  - Configure persistent volumes
  - Setup monitoring (Prometheus/Grafana)

Phase 3: Migration (Weeks 5-6)
  - Deploy PostgreSQL via operator (CloudNativePG)
  - Deploy MinIO via operator
  - Deploy APIs as deployments
  - Deploy LiteRAG + MCP Gateway
  - Setup horizontal pod autoscaling (HPA)

Phase 4: Validation (Week 7)
  - Load testing
  - Failover testing
  - Rollback procedures
  - Performance benchmarking

Phase 5: Cutover (Week 8)
  - Blue/green deployment
  - DNS cutover
  - Monitor metrics
  - Decommission old Coolify setup
```

### Kubernetes Architecture (Future)

```yaml
Cluster: Hetzner Kubernetes or managed (DigitalOcean, AWS EKS)

Namespaces:
  - kids-ascension-prod
  - ozean-licht-prod
  - shared-services
  - monitoring

Deployments:
  kids-ascension-api:
    replicas: 3
    resources:
      requests: { cpu: 500m, memory: 512Mi }
      limits: { cpu: 1000m, memory: 1Gi }
    hpa:
      min: 3
      max: 10
      cpu: 70%
  
  postgres:
    operator: CloudNativePG
    replicas: 3 (HA cluster)
    storage: 100Gi (expandable)
  
  minio:
    operator: MinIO Operator
    replicas: 4 (distributed)
    storage: 1Ti per node

Ingress:
  controller: Nginx Ingress
  ssl: cert-manager (Let's Encrypt)
  routes:
    - api.kids-ascension.at → kids-ascension-api
    - api.ozean-licht.at → ozean-licht-api

Monitoring:
  - Prometheus (metrics)
  - Grafana (dashboards)
  - Loki (logs)
  - Jaeger (tracing)
```

### Seamless Transition

```yaml
Why Current Setup Enables Easy Migration:
  ✅ Already containerized (Docker)
  ✅ Environment variables for config
  ✅ Health check endpoints
  ✅ Stateless APIs (horizontal scaling ready)
  ✅ Persistent storage separated (MinIO, Postgres)
  ✅ Load balancer ready (Nginx)

Migration Complexity: LOW
Downtime: <5 minutes (DNS propagation)
```

---

## Cost Structure

### Current (MVP Phase)

```yaml
Fixed Costs:
  Hetzner AX42: $50/mo
  Domains (2x): $2/mo
  Subtotal: $52/mo

Variable Costs:
  Cloudflare R2: $1.50/mo (100GB)
  Cloudflare Stream Storage: $5/mo (1000 min)
  Cloudflare Stream Delivery: $10/mo (10k min watched)
  Subtotal: $16.50/mo

Total: ~$68.50/mo

Per-User Cost: $0.007 (assuming 10k users)
```

### Growth Phase (1 year)

```yaml
Fixed Costs:
  Hetzner AX42 (or upgrade to AX101): $50-150/mo
  Domains: $2/mo
  Monitoring (Sentry): $26/mo
  Subtotal: $78-178/mo

Variable Costs:
  Cloudflare R2: $15/mo (1TB)
  Cloudflare Stream Storage: $50/mo (10k min)
  Cloudflare Stream Delivery: $100/mo (100k min watched)
  Subtotal: $165/mo

Total: ~$243-343/mo

Per-User Cost: $0.0024 (assuming 100k users)
```

### Scale Phase (2-3 years)

```yaml
Infrastructure:
  Kubernetes Cluster: $300/mo (managed)
  Load Balancer: $10/mo
  Monitoring: $100/mo
  Subtotal: $410/mo

Storage:
  Cloudflare R2: $150/mo (10TB)
  Stream Storage: $500/mo (100k min)
  Stream Delivery: $1000/mo (1M min watched)
  Subtotal: $1,650/mo

Total: ~$2,060/mo

Per-User Cost: $0.002 (assuming 1M users)

Break-Even: ~$10k MRR (with 10% margin)
```

---

## Security & Compliance

### Data Protection

```yaml
At Rest:
  - Database: PostgreSQL encryption
  - Storage: MinIO encryption (AES-256)
  - Backups: Encrypted with GPG

In Transit:
  - TLS 1.3 everywhere
  - HTTPS enforced (301 redirects)
  - Cloudflare SSL/TLS (Full Strict)

Secrets Management:
  - Environment variables (not committed)
  - Coolify secrets (encrypted)
  - Kubernetes secrets (future)
```

### Authentication Security

```yaml
Passwords:
  - Bcrypt hashing (cost factor: 12)
  - Minimum length: 8 characters
  - Complexity requirements
  - Rate limiting on login (5 attempts/15min)

JWT Tokens:
  - Short-lived (1 hour)
  - RS256 signing (asymmetric)
  - Refresh tokens (30 days)
  - Token rotation on refresh

OAuth:
  - State parameter (CSRF protection)
  - Secure redirect URIs (whitelist)
  - Token expiry enforcement
```

### Video Content Security

```yaml
Upload Validation:
  - File size limits (500MB)
  - MIME type validation
  - Virus scanning (ClamAV - future)
  - Metadata stripping (ExifTool)

Moderation:
  - Manual admin review (Phase 1)
  - AI moderation (Phase 2)
  - Automated NSFW detection (future)

Access Control:
  - Signed URLs (Cloudflare Stream)
  - Time-limited access
  - IP-based restrictions (optional)
  - Watermarking (future)
```

### GDPR Compliance

```yaml
User Rights:
  - Right to access (data export)
  - Right to deletion (account deletion)
  - Right to portability (JSON export)
  - Right to rectification (profile updates)

Data Minimization:
  - Only collect necessary data
  - Clear purpose for each field
  - Retention policies (videos: 5 years, logs: 90 days)

Consent:
  - Cookie consent banner
  - Clear privacy policy
  - Opt-in for marketing

Data Processing:
  - DPA with third parties (Cloudflare, Stripe)
  - Data processing records
  - GDPR-compliant hosting (EU servers)
```

---

## Monitoring & Observability

### Metrics (Future: Prometheus + Grafana)

```yaml
Application Metrics:
  - Request rate (req/sec)
  - Error rate (errors/sec)
  - Response time (p50, p95, p99)
  - Active users (concurrent)

Business Metrics:
  - Videos uploaded (daily, weekly)
  - Videos moderated (approved/rejected)
  - User signups (daily)
  - Video views (total, unique)

Infrastructure Metrics:
  - CPU usage (per service)
  - Memory usage
  - Disk I/O
  - Network traffic

Alerting:
  - Error rate >1%
  - Response time >2s (p95)
  - CPU >80%
  - Disk >90%
```

### Logging

```yaml
Current:
  - stdout/stderr (Docker logs)
  - Coolify log aggregation

Future (Loki + Grafana):
  - Structured logging (JSON)
  - Log levels (debug, info, warn, error)
  - Request IDs (tracing)
  - User IDs (audit trail)

Log Retention:
  - Application logs: 90 days
  - Error logs: 1 year
  - Audit logs: 7 years (compliance)
```

### Error Tracking (Future: Sentry)

```yaml
Configuration:
  - Source maps for stack traces
  - User context (ID, email)
  - Breadcrumbs (user actions)
  - Performance monitoring

Alerts:
  - New error types
  - Error rate spikes
  - Performance regressions
```

---

## Disaster Recovery

### Backup Strategy

```yaml
Databases:
  Frequency: Daily (automated)
  Retention: 30 days
  Tool: pg_dump
  Storage: Cloudflare R2 (encrypted)
  Recovery Time Objective (RTO): 1 hour
  Recovery Point Objective (RPO): 24 hours

Videos:
  Primary: Cloudflare R2 (archive)
  Backup: MinIO staging (30 days)
  Retention: Permanent (R2)
  RTO: 1 hour (restore from R2)
  RPO: 0 (videos in R2 immediately after approval)

Configuration:
  Frequency: On change (Git commits)
  Storage: GitHub (private repo)
  Recovery: Git checkout
  RTO: 15 minutes

LiteRAG Knowledge:
  Frequency: Daily (database backup)
  Retention: 90 days
  Recovery: Database restore + rebuild indexes
  RTO: 2 hours
```

### Disaster Scenarios

```yaml
Server Failure:
  Impact: Complete outage
  Recovery:
    1. Provision new Hetzner server (15 min)
    2. Restore PostgreSQL backups (30 min)
    3. Restore MinIO data (15 min)
    4. Deploy containers via Coolify (15 min)
    5. Update DNS (5 min propagation)
  Total RTO: ~2 hours

Database Corruption:
  Impact: Data loss (last 24h)
  Recovery:
    1. Restore from latest backup (30 min)
    2. Replay transaction logs (if available)
    3. Verify data integrity (30 min)
  Total RTO: 1 hour

Video Loss:
  Impact: Specific videos unavailable
  Recovery:
    1. Restore from R2 archive (15 min)
    2. Re-upload to Cloudflare Stream (30 min)
    3. Update database references (5 min)
  Total RTO: 50 minutes

Code Repository Loss (GitHub):
  Impact: Cannot deploy new versions
  Recovery:
    1. Restore from local Git clones (immediate)
    2. Push to new GitHub repo (5 min)
    3. Update Coolify webhooks (5 min)
  Total RTO: 10 minutes

DDoS Attack:
  Impact: Service degradation
  Mitigation:
    - Cloudflare DDoS protection (automatic)
    - Rate limiting (Nginx)
    - IP blocking (Cloudflare WAF)
  Recovery: Automatic (Cloudflare handles)
```

### Backup Testing

```yaml
Monthly:
  - Restore database to test environment
  - Verify data integrity
  - Test application with restored data

Quarterly:
  - Full disaster recovery drill
  - Document recovery time
  - Update procedures based on learnings
```

---

## Scaling Strategy

### Vertical Scaling (Current)

```yaml
Phase: MVP to 10k DAU
Approach: Upgrade server resources

Hetzner AX42 → AX101:
  CPU: 6c/12t → 8c/16t
  RAM: 64GB → 128GB
  Storage: 2x512GB → 2x1TB
  Cost: $50/mo → $150/mo

When to Scale:
  - CPU >80% sustained
  - RAM >80%
  - Response time >1s (p95)
```

### Horizontal Scaling (Future)

```yaml
Phase: 10k → 100k DAU
Approach: Add more servers + load balancer

Architecture:
  Load Balancer: Hetzner Cloud Load Balancer ($5/mo)
  App Servers: 3x Hetzner CX31 (4 vCPU, 8GB RAM) @ $15/mo each
  Database: Managed PostgreSQL or separate dedicated server
  Storage: MinIO distributed mode (4 nodes)

Cost: ~$100-150/mo (app servers) + $50/mo (DB) + $5/mo (LB) = $155-205/mo

When to Scale:
  - Single server at capacity
  - Need high availability (99.9%)
  - Traffic from multiple regions
```

### Auto-Scaling (Kubernetes Phase)

```yaml
Phase: 100k+ DAU
Approach: Kubernetes Horizontal Pod Autoscaler (HPA)

Configuration:
  kids-ascension-api:
    min_replicas: 3
    max_replicas: 10
    target_cpu: 70%
    scale_up: +1 pod when >70% for 2 min
    scale_down: -1 pod when <30% for 5 min

Benefits:
  - Automatic capacity adjustment
  - Cost optimization (scale down at night)
  - Handle traffic spikes
  - Improved availability
```

### Database Scaling

```yaml
Phase 1: Single Instance (Current)
  - PostgreSQL on Hetzner AX42
  - Capacity: ~10k DAU

Phase 2: Read Replicas (10k-50k DAU)
  - Primary (writes)
  - 2x Replicas (reads)
  - Connection pooling (PgBouncer)

Phase 3: Sharding (50k-100k DAU)
  - Shard by entity (kids_ascension_db, ozean_licht_db)
  - Separate servers per shard
  - Multi-primary replication

Phase 4: Managed Database (100k+ DAU)
  - CloudNativePG (Kubernetes operator)
  - Automated failover
  - Backup/restore
  - Monitoring integrated
```

### Storage Scaling

```yaml
MinIO Scaling:
  Single Node → Distributed (4+ nodes)
  - Erasure coding (fault tolerance)
  - Horizontal throughput scaling
  - Automatic data distribution

Cloudflare R2:
  - No scaling needed (managed)
  - Unlimited storage
  - Automatic global distribution

Cloudflare Stream:
  - No scaling needed (managed)
  - Auto-transcoding
  - Global CDN delivery
```

### CDN Strategy

```yaml
Current: Cloudflare (global)
  - 300+ edge locations
  - Automatic caching
  - DDoS protection

Future Considerations:
  - Multi-CDN (Cloudflare + Fastly)
  - Regional optimization
  - Video-specific CDN (Mux, JW Player)
```

---

## Development Roadmap

### Phase 0: Foundation (Current - Week 1-2)

```yaml
Goals:
  ✅ Finalize monorepo structure
  ✅ Document architecture
  🔄 Setup Hetzner server
  🔄 Install base infrastructure (Coolify, Postgres, MinIO)
  🔄 Setup LiteRAG
  🔄 Build Taskmaster (TypeScript)
  🔄 Build Reporter Agent
  🔄 Create development commands (.claude/)

Deliverables:
  - architecture.md (this document)
  - Hetzner server provisioned
  - LiteRAG operational
  - Taskmaster core functionality
  - Reporter Agent integrated

Success Criteria:
  - Can brainstorm → Reporter → LiteRAG → Taskmaster → Task manifest
  - Infrastructure ready for development
```

### Phase 1: Kids Ascension MVP (Week 3-6)

```yaml
Core Features:
  1. User Authentication
     - Email/password signup/login
     - JWT tokens
     - Password reset
     - Admin: 4 days

  2. Video Upload
     - File picker (drag-drop)
     - Upload to MinIO
     - Progress tracking
     - Basic metadata (title, description)
     - Admin: 5 days

  3. Moderation Queue
     - Admin dashboard
     - Pending videos list
     - Approve/reject actions
     - Moderation notes
     - Admin: 3 days

  4. Video Library
     - Grid view of approved videos
     - Cloudflare Stream player
     - Basic filtering (by uploader)
     - Admin: 3 days

  5. Video Processing Pipeline
     - MinIO → R2 archive
     - R2 → Cloudflare Stream
     - Thumbnail generation
     - Status updates
     - Admin: 4 days

Deliverables:
  - Kids Ascension web app (React)
  - Kids Ascension API (Node.js)
  - Database migrations
  - Docker deployment
  - Basic documentation

Success Criteria:
  - Parent can upload video
  - Admin can moderate
  - Approved videos play in browser
  - <10 users (alpha testing)
```

### Phase 2: Kids Ascension Beta (Week 7-10)

```yaml
Enhanced Features:
  1. User Profiles
     - Parent profile (name, bio, avatar)
     - Kids profiles (name, birth date, avatar)
     - Profile editing
     - Admin: 3 days

  2. Video Management
     - Edit video metadata
     - Delete videos
     - Privacy settings (private/family/public)
     - Video sharing (email links)
     - Admin: 4 days

  3. Advanced Moderation
     - Bulk actions
     - Moderation filters
     - Email notifications (approval/rejection)
     - Admin: 3 days

  4. Analytics (Basic)
     - Video views tracking
     - Uploader dashboard (my videos, views)
     - Admin dashboard (total videos, users)
     - Admin: 3 days

  5. Mobile App (React Native)
     - Video upload (iOS/Android)
     - Video playback
     - Push notifications
     - Admin: 7 days

Deliverables:
  - Enhanced web app
  - Mobile apps (iOS, Android)
  - Email notifications (SendGrid)
  - Analytics dashboard
  - Beta testing with 50-100 users

Success Criteria:
  - 50+ active users
  - <5% error rate
  - <2s response time (p95)
  - App store approval (iOS, Android)
```

### Phase 3: Kids Ascension Production (Week 11-14)

```yaml
Production Readiness:
  1. Performance Optimization
     - Image optimization (next/image)
     - Code splitting
     - Lazy loading
     - Caching strategies
     - Admin: 3 days

  2. Security Hardening
     - Rate limiting
     - CSRF protection
     - Content Security Policy (CSP)
     - Security headers
     - Admin: 2 days

  3. Monitoring & Observability
     - Sentry error tracking
     - Custom metrics (Prometheus)
     - Logging (structured)
     - Alerting (email, Slack)
     - Admin: 3 days

  4. Testing & QA
     - E2E tests (Playwright)
     - Load testing (k6)
     - Security testing (OWASP)
     - Bug fixes
     - Admin: 4 days

  5. Documentation
     - User guide
     - Admin guide
     - API documentation
     - Deployment guide
     - Admin: 2 days

Deliverables:
  - Production-ready application
  - Monitoring dashboards
  - Comprehensive tests
  - Complete documentation
  - Launch plan

Success Criteria:
  - 99.5% uptime
  - <1s response time (p95)
  - <0.1% error rate
  - Ready for public launch
```

### Phase 4: Kids Ascension Growth (Month 4-6)

```yaml
Growth Features:
  1. Social Features
     - Comments on videos
     - Likes/reactions
     - Follow other parents
     - Activity feed
     - Admin: 7 days

  2. Advanced Privacy
     - Private family groups
     - Invite-only viewing
     - Granular privacy controls
     - Admin: 5 days

  3. AI Features
     - Automatic video tagging
     - Face recognition (blur option)
     - Speech-to-text (subtitles)
     - Smart search
     - Admin: 10 days

  4. Monetization (Optional)
     - Storage tiers (free, premium)
     - Stripe integration
     - Subscription management
     - Admin: 7 days

Deliverables:
  - Social features
  - AI enhancements
  - Payment system (if applicable)
  - Growth experiments

Success Criteria:
  - 1000+ active users
  - <5% churn rate
  - Positive unit economics
```

### Phase 5: Ozean Licht Platform (Month 7-12)

```yaml
Parallel Development:
  - Start while Kids Ascension is in production
  - Leverage shared infrastructure
  - Reuse components from Kids Ascension
  - Taskmaster orchestrates both projects

Core Features:
  1. Course Platform
     - Course creation (admin)
     - Module/lesson structure
     - Video lessons (reuse KA video pipeline)
     - Student enrollment
     - Progress tracking
     - Admin: 10 days

  2. Content Management
     - Blog/articles
     - Rich text editor
     - Media library
     - SEO optimization
     - Admin: 7 days

  3. Member Area
     - Member profiles
     - Community features
     - Discussion forums
     - Event calendar
     - Admin: 10 days

  4. Payment Integration
     - Stripe subscriptions
     - Course purchases
     - Invoicing
     - Webhook handling
     - Admin: 7 days

Deliverables:
  - Ozean Licht web app
  - Ozean Licht API
  - Course platform
  - Payment system
  - Member area

Success Criteria:
  - 100+ courses created
  - 500+ members
  - Payment processing functional
  - Positive revenue
```

### Phase 6: Kubernetes Migration (Month 12-18)

```yaml
When: After both platforms are stable and growing

Migration Tasks:
  1. Kubernetes Setup
     - Cluster provisioning
     - Namespace design
     - RBAC configuration
     - Ingress setup
     - Admin: 10 days

  2. Service Migration
     - Containerize all services (already done)
     - Create Kubernetes manifests
     - Deploy to staging cluster
     - Test failover scenarios
     - Admin: 10 days

  3. Database Migration
     - Deploy CloudNativePG operator
     - Migrate data (pg_dump/restore)
     - Setup replication
     - Test backup/restore
     - Admin: 7 days

  4. Storage Migration
     - Deploy MinIO operator
     - Distributed MinIO setup
     - Data migration
     - Test performance
     - Admin: 5 days

  5. Cutover
     - Blue/green deployment
     - DNS update
     - Monitor metrics
     - Rollback plan ready
     - Admin: 3 days

Deliverables:
  - Kubernetes cluster operational
  - All services migrated
  - Auto-scaling configured
  - Monitoring integrated

Success Criteria:
  - 99.9% uptime
  - <1s response time (p95)
  - Automatic scaling works
  - Zero data loss during migration
```

---

## Architectural Decision Records

### ADR-001: Monorepo vs Multi-Repo

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need to decide repository structure for Kids Ascension and Ozean Licht

**Decision:** Use monorepo with projects/ structure

**Rationale:**
- Shared infrastructure and code
- Unified development workflow
- Single source of truth (LiteRAG)
- Easier cross-project refactoring
- Solo developer + ADW agents benefit from unified context

**Consequences:**
- Positive: Faster development, code reuse, unified tooling
- Negative: Repo size grows, need discipline in separation
- Mitigation: Clear project boundaries, separate deployments

**Alternatives Considered:**
- Multi-repo: Too much overhead for solo developer
- Microservices from day 1: Premature optimization

---

### ADR-002: Hetzner Dedicated vs Managed Services

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need to choose infrastructure hosting

**Decision:** Hetzner AX42 dedicated server with Coolify orchestration

**Rationale:**
- Cost: $50/mo vs $130-300/mo (managed)
- Control: Full server access
- Performance: Dedicated resources
- Flexibility: Can run any service
- Future: Easy path to Kubernetes

**Consequences:**
- Positive: 45-60% cost savings, full control
- Negative: Manual infrastructure management
- Mitigation: Coolify handles orchestration, automated backups

**Alternatives Considered:**
- Vercel + Supabase: Too expensive at scale
- AWS/GCP: Complex, expensive for early stage
- DigitalOcean: Good but more expensive

---

### ADR-003: MinIO for Video Staging

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need storage for uploaded videos before moderation

**Decision:** Use MinIO on Hetzner server for staging storage

**Rationale:**
- Cost: $0 (included in server)
- Performance: Local SSD (fast uploads)
- S3-compatible API (easy to migrate)
- Control: On-premise moderation workflow

**Consequences:**
- Positive: Cost savings (~$50/mo), fast uploads
- Negative: Must manage MinIO, single point of failure
- Mitigation: Automated backups, lifecycle policies

**Alternatives Considered:**
- Direct to Cloudflare R2: More expensive per upload
- AWS S3: Egress costs prohibitive

---

### ADR-004: Cloudflare Stream for Video Delivery

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need CDN for video streaming to users

**Decision:** Use Cloudflare Stream for transcoding and delivery

**Rationale:**
- Automatic transcoding (multiple qualities)
- Global CDN (300+ locations)
- Adaptive bitrate streaming
- Cost-effective ($1/1000 minutes watched)
- Integrated with Cloudflare ecosystem

**Consequences:**
- Positive: Professional video delivery, minimal setup
- Negative: Vendor lock-in, costs scale with usage
- Mitigation: Keep original videos in R2 (can migrate)

**Alternatives Considered:**
- Self-hosted video server: Complex, expensive bandwidth
- Mux: More expensive
- YouTube embedding: Not suitable (privacy, control)

---

### ADR-005: TypeScript for ADW/Taskmaster

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need to choose language for autonomous development workflow

**Decision:** Migrate from Python to TypeScript

**Rationale:**
- Unified stack (React, Node.js, Taskmaster all TypeScript)
- Type safety (fewer bugs in orchestration)
- Better Claude Code integration
- Native to Node.js (already on server)
- Easier for agents to generate/maintain

**Consequences:**
- Positive: Type safety, unified tooling, better IDE support
- Negative: Migration effort from Python prototypes
- Mitigation: Keep Python ADW for reference, port gradually

**Alternatives Considered:**
- Keep Python: Works but not native to stack
- Go: Fast but overkill for orchestration

---

### ADR-006: LiteRAG Single Instance with Namespaces

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need knowledge base architecture for multiple projects

**Decision:** Single LiteRAG instance with namespaced knowledge

**Rationale:**
- Unified knowledge base (cross-project learnings)
- Simpler to maintain (one instance)
- Can query across namespaces
- Cost-effective (shared infrastructure)

**Consequences:**
- Positive: Single source of truth, cross-project queries
- Negative: Need namespace discipline
- Mitigation: Clear namespace conventions, validation

**Alternatives Considered:**
- Multiple separate RAGs: Complex, no cross-knowledge
- No RAG: Lose institutional memory

---

### ADR-007: Coolify Now, Kubernetes Later

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need deployment orchestration strategy

**Decision:** Start with Coolify, migrate to Kubernetes when needed

**Rationale:**
- Coolify: Simple, Git-based, sufficient for MVP
- Kubernetes: Overkill for <10k DAU
- Clear migration path (Docker → K8s)
- Focus on product, not infrastructure

**Consequences:**
- Positive: Faster time to market, lower complexity
- Negative: Manual scaling, limited HA features
- Mitigation: Designed for K8s migration from day 1

**Alternatives Considered:**
- Kubernetes from day 1: Premature optimization
- Heroku/Render: Expensive, less control

---

### ADR-008: PostgreSQL Multi-Database Strategy

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need database architecture for two legal entities

**Decision:** Single PostgreSQL instance with separate databases per entity

**Rationale:**
- Legal separation (different databases)
- Shared users table (unified auth)
- Cost-effective (one Postgres instance)
- Easy to split if needed (pg_dump per database)

**Consequences:**
- Positive: Legal compliance, cost savings, unified auth
- Negative: Must manage cross-database queries
- Mitigation: Application-level joins, clear boundaries

**Alternatives Considered:**
- Separate Postgres instances: More expensive, complex
- Single database with entity_id: Harder legal separation

---

### ADR-009: Git Worktrees for Parallel Development

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need mechanism for autonomous agents to work in parallel

**Decision:** Use git worktrees for each agent/task

**Rationale:**
- Multiple agents can work simultaneously
- Isolated environments (no conflicts)
- Native Git feature (no additional tools)
- Easy cleanup (remove worktree)
- Taskmaster can orchestrate lifecycle

**Consequences:**
- Positive: True parallel development, clean separation
- Negative: Disk space usage, must manage worktrees
- Mitigation: Automated cleanup, `.gitignore` worktrees/

**Alternatives Considered:**
- Branches only: Conflicts, agents can't work in parallel
- Separate repos: Too much overhead

---

### ADR-010: Cloudflare Pages for Frontend Hosting

**Status:** Accepted  
**Date:** 2024-10-19  
**Context:** Need hosting for React frontend applications

**Decision:** Deploy frontends to Cloudflare Pages

**Rationale:**
- Free tier generous (unlimited bandwidth)
- Global CDN (300+ locations)
- Git-based deployment (automatic)
- Integrated with Cloudflare ecosystem (R2, Stream)
- HTTPS + custom domains included

**Consequences:**
- Positive: Zero hosting cost, excellent performance
- Negative: Vendor lock-in (mitigated by static build)
- Mitigation: Can deploy anywhere (Vercel, Netlify, S3)

**Alternatives Considered:**
- Self-hosted (Nginx): More complex, costs bandwidth
- Vercel: Expensive at scale
- AWS S3 + CloudFront: More expensive, complex setup

---

## Appendix A: Technology Versions

```yaml
Core:
  Node.js: 20.x LTS
  TypeScript: 5.3+
  React: 18.2+
  PostgreSQL: 15.x
  Docker: 24.x

Frameworks:
  Express: 4.x
  Prisma: 5.x
  React Router: 6.x
  Vite: 5.x

Deployment:
  Ubuntu: 22.04 LTS
  Coolify: Latest stable
  Cloudflare: Latest

Tools:
  pnpm: 8.x
  ESLint: 8.x
  Prettier: 3.x
  Vitest: 1.x
```

---

## Appendix B: Environment Variables

```bash
# Shared
NODE_ENV=production
LOG_LEVEL=info

# Database
SHARED_USERS_DB_URL=postgresql://user:pass@localhost:5432/shared_users_db
KIDS_ASCENSION_DB_URL=postgresql://user:pass@localhost:5432/kids_ascension_db
OZEAN_LICHT_DB_URL=postgresql://user:pass@localhost:5432/ozean_licht_db
LITERAG_DB_URL=postgresql://user:pass@localhost:5432/literag_knowledge_db

# Auth
JWT_SECRET=<random-256-bit-key>
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=<random-256-bit-key>
REFRESH_TOKEN_EXPIRES_IN=30d

# Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=<access-key>
MINIO_SECRET_KEY=<secret-key>
MINIO_USE_SSL=false

CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_R2_ACCESS_KEY=<access-key>
CLOUDFLARE_R2_SECRET_KEY=<secret-key>
CLOUDFLARE_STREAM_API_TOKEN=<api-token>

# LiteRAG
LITERAG_URL=http://localhost:8080
OPENAI_API_KEY=<api-key>

# MCP Gateway
MCP_GATEWAY_URL=http://localhost:3100
MCP_GATEWAY_TOKEN=<token>

# External Services
SENDGRID_API_KEY=<api-key>
STRIPE_SECRET_KEY=<secret-key>
SENTRY_DSN=<dsn>

# OAuth
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
```

---

## Appendix C: Useful Commands

```bash
# Development
pnpm install                          # Install all dependencies
pnpm --filter @ka/web dev             # Start KA frontend
pnpm --filter @ka/api dev             # Start KA backend
pnpm --parallel dev                   # Start all projects

# Database
pnpm --filter @ka/api prisma migrate dev    # Run migrations
pnpm --filter @ka/api prisma studio         # Open Prisma Studio
pg_dump kids_ascension_db > backup.sql      # Backup database

# Testing
pnpm --recursive test                 # Run all tests
pnpm --filter @ka/web test:e2e        # E2E tests

# Deployment
pnpm --recursive build                # Build all projects
docker-compose up -d                  # Start services

# Git Worktrees
git worktree add worktrees/feature-x -b feature-x  # Create worktree
git worktree list                                   # List worktrees
git worktree remove worktrees/feature-x            # Remove worktree

# LiteRAG
curl http://localhost:8080/query -d '{"namespace":"kids-ascension/*","query":"video upload"}'

# Monitoring
docker stats                          # Container resource usage
tail -f /var/log/coolify/app.log     # Application logs
```

---

## Appendix D: Contact & Resources

```yaml
Project Lead:
  Name: Lia Lohmann
  Organization: Verein Ozean Licht
  
Documentation:
  Architecture: /docs/architecture.md
  ADRs: /docs/adrs/
  API Docs: /docs/api/
  
Repositories:
  Main: https://github.com/ozean-licht/ecosystem (private)
  
Domains:
  Kids Ascension: https://kids-ascension.at
  Ozean Licht: https://ozean-licht.at
  
Infrastructure:
  Server: Hetzner AX42 (IP: TBD)
  DNS: Cloudflare
  Monitoring: TBD
```

---

## Document Changelog

```yaml
v1.0.0 (2024-10-19):
  - Initial architecture documentation
  - Monorepo structure defined
  - Technology stack selected
  - Infrastructure architecture designed
  - Development roadmap created
  - 10 ADRs documented
```

---

**End of Architecture Documentation**

This is a living document. As the ecosystem evolves, this documentation will be updated to reflect architectural changes, new decisions, and learnings from production operations.