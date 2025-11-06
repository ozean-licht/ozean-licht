# Apps Directory

> **Applications** - Deployed software serving end users

This directory contains all applications in the Ozean Licht Ecosystem. Unlike "projects" which implies work-in-progress, "apps" clearly indicates production-ready or actively developed applications.

## Why "apps/" instead of "projects/"?

1. **Semantic Accuracy**: These are deployed applications, not development projects
2. **Industry Convention**: Modern monorepos (Nx, Turborepo, Rush) use `apps/` for applications
3. **Clear Distinction**: `apps/` indicates runnable applications vs shared `packages/`
4. **Reduces Confusion**: "Project" is overloaded (GitHub projects, project management, etc.)

## Applications Overview

### admin/
**Unified Admin Dashboard**

Multi-platform admin interface for both Kids Ascension and Ozean Licht.

- **Tech Stack**: Next.js 14, NextAuth v5, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with JWT sessions and audit logging
- **Storage**: MinIO S3 integration for file management
- **Monitoring**: System health dashboard for infrastructure
- **Database**: PostgreSQL with MCP Gateway client
- **Port**: 9200 (development)

**Documentation**: [apps/admin/README.md](./admin/README.md)

**Features**:
- Role-based access control (RBAC)
- Session management with refresh tokens
- Audit logging for all admin actions
- MinIO S3 storage operations
- System health monitoring (DB, MCP Gateway, Server)
- Entity switching (Kids Ascension ↔ Ozean Licht)

---

### kids-ascension/
**Educational Video Platform**

100% free educational platform liberating children through self-paced learning (ages 6-14).

- **Tech Stack**: React, TypeScript, Cloudflare Stream
- **Mission**: Education is a Human Right
- **Database**: `kids_ascension_db` (PostgreSQL)
- **Storage**: MinIO → Cloudflare R2 → Cloudflare Stream
- **Status**: Active development with monorepo migration phase

**Documentation**: [apps/kids-ascension/README.md](./kids-ascension/README.md)

**Core Values**:
- Education is a Human Right (100% free, lifetime)
- Creator Autonomy (full content rights)
- Parent Authority (final say)
- Open Governance (transparent review)

**Features**:
- Video courses for ages 6-14
- Self-paced learning paths
- Parent/child account management
- Progress tracking
- Teacher-quality content

---

### ozean-licht/
**Content & Community Platform**

Content platform for courses and community (currently in foundation phase).

- **Tech Stack**: React, TypeScript (planned)
- **Database**: `ozean_licht_db` (PostgreSQL)
- **Auth**: Shared via `shared_users_db`
- **Status**: Foundation phase

**Documentation**: [apps/ozean-licht/README.md](./ozean-licht/README.md)

**Planned Features**:
- Course management system
- Member portal
- Event calendar integration
- Community forums
- Content delivery

---

### event-calendar/
**Shared Event Management**

Event calendar service shared across platforms.

- **Status**: Foundation phase
- **Purpose**: Centralized event management for both associations

---

### video-translator/
**Video Translation Service**

Automated video translation and subtitle generation.

- **Status**: Foundation phase
- **Purpose**: Multi-language support for educational content

---

## Shared Infrastructure

All apps share:

- **Unified Authentication**: SSO via `shared_users_db`
- **MCP Gateway**: Tool access for autonomous agents
- **Multi-tenant Database**: Legal separation with shared infrastructure
- **Storage**: Three-tier system (MinIO → R2 → Stream)
- **Monitoring**: Grafana + Prometheus
- **Deployment**: Coolify self-hosted PaaS

## Development

### Start All Apps
```bash
pnpm --parallel dev
```

### Start Specific App
```bash
pnpm --filter admin dev           # Admin dashboard (port 9200)
pnpm --filter @ka/web dev          # Kids Ascension (port 3000)
pnpm --filter @ol/web dev          # Ozean Licht (port 3001)
```

### Build All Apps
```bash
pnpm --recursive build
```

### Test All Apps
```bash
pnpm --recursive test
```

## Architecture

```
apps/
├── admin/              # Next.js admin dashboard
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/            # Shared libraries (auth, MCP client)
│   ├── types/          # TypeScript types
│   └── tests/          # Unit & E2E tests
│
├── kids-ascension/     # Educational platform
│   ├── apps/           # Application code
│   ├── docs/           # Product requirements
│   └── app_docs/       # Feature documentation
│
├── ozean-licht/        # Content platform
│   ├── apps/           # Application code
│   └── app_docs/       # Documentation
│
├── event-calendar/     # Event management
└── video-translator/   # Translation service
```

## Multi-Tenant Database Strategy

```sql
-- Unified authentication
shared_users_db
  ├── users                 -- Core user accounts
  ├── user_entities         -- Entity access mapping
  └── sessions              -- Active sessions

-- Kids Ascension data
kids_ascension_db
  ├── videos                -- Educational videos
  ├── courses               -- Course structure
  ├── progress              -- User progress
  └── parents               -- Parent accounts

-- Ozean Licht data
ozean_licht_db
  ├── courses               -- Community courses
  ├── members               -- Member profiles
  └── content               -- Platform content
```

## Authentication Flow

1. User logs in → Verify in `shared_users_db`
2. Fetch entity permissions from `user_entities`
3. Generate JWT with entity context
4. Route to appropriate platform

## Port Allocations

### Production
- Admin: Cloudflare Pages
- Kids Ascension: Cloudflare Pages
- Ozean Licht: Cloudflare Pages

### Development
- Admin: 9200
- Kids Ascension: 3000
- Ozean Licht: 3001

### ADW Isolated Workflows
- Backend: 9100-9114 (15 ports)
- Frontend: 9200-9214 (15 ports)

## Adding a New App

1. **Create directory** in `apps/`
2. **Initialize package.json** with workspace name
3. **Add documentation** in `app_docs/`
4. **Update this README** with app description
5. **Configure database** if needed (new tenant)
6. **Setup authentication** integration
7. **Add to CI/CD** pipeline

## See Also

- **[CONTEXT_MAP.md](../CONTEXT_MAP.md)** - Line-based navigation for agents
- **[CLAUDE.md](../CLAUDE.md)** - AI agent instructions
- **[docs/architecture.md](../docs/architecture.md)** - System architecture
- **[infrastructure/](../infrastructure/)** - DevOps & services

---

**Last Updated**: 2025-11-06
**Apps Count**: 5 (3 active, 2 planned)
**Maintainer**: Ozean Licht Team + Autonomous Agents
