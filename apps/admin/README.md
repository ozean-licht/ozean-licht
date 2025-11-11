# Admin Dashboard

**Unified admin interface for Kids Ascension (educational platform) and Ozean Licht (spiritual content platform)**

Status: **Phase 1 - Foundation** | Port: **9200** | Stack: **Next.js 14 + NextAuth v5 + MCP Gateway + TypeScript**

---

## Overview

Centralized admin dashboard serving two legally separate Austrian associations (Vereine) with shared infrastructure:

- **Ecosystem Admin** (Central) - Cross-platform user management, system health, authentication, audit logs
- **Ozean Licht Admin** (OL) - Course management, member tracking, payment monitoring, content moderation
- **Kids Ascension Admin** (KA) - Video content, review workflow, classroom management, safety controls

Both platforms share authentication (`shared_users_db`) but maintain separate operational databases (`ozean_licht_db`, `kids_ascension_db`).

---

## Current Status

### ✅ What's Built (Foundation Complete)

**Authentication & Security**
- NextAuth v5 with database sessions
- Role-based access control (RBAC): `super_admin`, `ka_admin`, `ol_admin`, `support`
- Wildcard permission system (`*`, `users.*`, `*.read`)
- Route protection middleware for `/dashboard/*`
- Audit logging framework

**Infrastructure**
- MCP Gateway client library (type-safe database operations)
- System health monitoring (database, services, uptime)
- MinIO storage management interface
- Responsive UI with Tailwind CSS + shadcn/ui
- Dark/light theme support

**Developer Tools**
- TypeScript strict mode
- Test admin seeding script
- Integration test suite
- Breadcrumb navigation + keyboard shortcuts

### ❌ What's Missing (Phases 2-4)

**Ozean Licht (OL) Requirements - 28 Features**
- 🔴 **Critical (3)**: Course management, member management, payment monitoring
- 🟡 **Important (12)**: Content moderation, analytics, email campaigns, events, support tickets, video library, access control, system config, backups, integrations, SEO tools, performance monitoring
- 🟢 **Nice-to-Have (13)**: Affiliate program, customer analytics, ML recommendations, segmentation, mobile management, certifications, surveys, video studio, and more

**Kids Ascension (KA) Requirements - 40+ Features**
- 🔴 **Critical (4)**: Video management, content review workflow, user management, classroom operations
- 🟡 **Important (8)**: Creator management, parent-child controls, idea marketplace, activity monitoring, email communications, school partnerships, safety controls, reporting
- 🟢 **Nice-to-Have (10+)**: Advanced analytics, angel donor program, compliance tools, AI moderation, internationalization

---

## Technology Stack

**Frontend**
- Next.js 14 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod validation
- TanStack Table (data grids)
- Recharts (analytics)

**Backend**
- NextAuth v5 (authentication)
- MCP Gateway (database operations)
- PostgreSQL (multi-tenant: `shared_users_db`, `ozean_licht_db`, `kids_ascension_db`)
- Supabase Edge Functions (business logic)

**Infrastructure**
- Coolify (deployment)
- MinIO → Cloudflare R2 → Stream (video pipeline)
- N8N (automation workflows)
- Sentry + Vercel Analytics (monitoring)

---

## Quick Start

### Prerequisites
```bash
# Verify installations
node -v       # 18+
pnpm -v       # Latest
```

### Setup
```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with:
# - NEXTAUTH_URL=http://localhost:9200
# - NEXTAUTH_SECRET=$(openssl rand -base64 32)
# - MCP_GATEWAY_URL=http://localhost:8100

# Create test admin user
pnpm run seed:test-admin

# Start dev server
pnpm run dev
```

Visit `http://localhost:9200/login`

**Test Credentials:**
- Email: `admin@ozean-licht.dev`
- Password: `admin123`
- Role: `super_admin`

---

## Ozean Licht Admin Requirements

**Platform:** Content + course management for spiritual education (LCQ®, Herzportal, Athemirah®)

### 🔴 Critical Features (Day 1-2 Operations) - 130h

#### 1. Course Management (40h)
- [ ] Course CRUD with drag-drop module builder
- [ ] Manage modules (add/remove/reorder)
- [ ] Content types: video, text, PDF, audio, quiz
- [ ] Publish/unpublish workflow
- [ ] Version history + audit log
- **Files:** `app/(dashboard)/ozean-licht/courses/`
- **Database:** `ozean_licht_db.courses`, `course_modules`, `module_contents`

#### 2. Member Management (50h)
- [ ] Member list with search/filters (role, status, date)
- [ ] Profile view with course enrollments + purchase history
- [ ] Role assignment (USER, CREATOR, EDUCATOR, ADMIN, MODERATOR)
- [ ] Grant/revoke platform access
- [ ] Bulk operations (export, suspend, activate)
- **Files:** `app/(dashboard)/ozean-licht/members/`
- **Database:** `shared_users_db.users`, `user_entities`, `ozean_licht_db.orders`

#### 3. Payment & Transaction Monitoring (40h)
- [ ] Transaction list with date filters + status
- [ ] Order detail view (full payment info)
- [ ] Manual order creation (emergency access grants)
- [ ] Revenue analytics (daily/monthly charts)
- [ ] Refund processing interface
- [ ] Resync from Ablefy webhook
- **Files:** `app/(dashboard)/ozean-licht/payments/`
- **Database:** `ozean_licht_db.transactions`, `orders`, `course_mapping`
- **Integration:** Ablefy payment processor (40,833+ transactions)

### 🟡 Important Features (Week 3-6) - 340h

#### 4-15. Operations Features
- Content moderation (35h): Approval workflow, audit trail
- Analytics dashboard (40h): Enrollment trends, engagement metrics, revenue attribution
- Email campaigns (30h): Template editor, scheduling, A/B testing
- Event management (35h): Livestream scheduling, RSVP tracking, recordings
- Support tickets (35h): Auto-categorization, assignment, SLA monitoring
- Video library (30h): Metadata editor, transcription management, bulk operations
- Access control (25h): RBAC config, permission matrix, 2FA management
- System config (20h): Platform settings, feature flags, notifications
- Backup management (15h): Status monitoring, data export, GDPR compliance
- Integrations (30h): Airtable sync, N8N workflows, Cloudflare Stream
- SEO tools (20h): Metadata editor, sitemap, Open Graph
- Performance monitoring (25h): Response times, error rates, resource usage

### 🟢 Nice-to-Have (Post-MVP) - 500+h
- Affiliate program, customer journey analytics, ML recommendations, segmentation, mobile app management, certifications, surveys, video studio, and more

**Current Data:** 64 courses, 40,833+ transactions, 1,000+ members, €32,499+ monthly volume (Oct 2025)

---

## Kids Ascension Admin Requirements

**Platform:** 100% free educational videos for children (ages 6-14) with teacher-quality content

### 🔴 Critical Features (MVP Day 1) - 5-7 days

#### 1. Content Management (2 days)
- [ ] Video upload handler (Cloudflare Stream integration)
- [ ] Video CRUD with metadata (title, description, age range, subject)
- [ ] Course/lesson organization (drag-drop)
- [ ] Meditation content management
- [ ] Bulk operations (publish, categorize, tag)
- **Files:** `app/(dashboard)/kids-ascension/content/`
- **Database:** `kids_ascension_db.videos`, `courses`, `lessons`, `meditations`

#### 2. Content Review Workflow (2 days)
- [ ] Review queue with AI pre-screening (Whisper transcription)
- [ ] Harm ranking algorithm (harmless → harmful spectrum)
- [ ] Reviewer assignment by subject expertise
- [ ] Timestamp-specific creator feedback
- [ ] Multi-reviewer collaboration + voting
- [ ] Revision & resubmit tracking
- [ ] Judge Board escalation
- **Files:** `app/(dashboard)/kids-ascension/moderation/`
- **Database:** `kids_ascension_db.video_reviews`, `reviewer_feedback`

#### 3. User Management (1 day)
- [ ] Student accounts (view progress, watch history, achievements)
- [ ] Parent accounts (parent-child linking, controls)
- [ ] Educator accounts (classroom management)
- [ ] Creator accounts (content portfolio, badges)
- [ ] Status management (suspend/activate)
- **Files:** `app/(dashboard)/kids-ascension/users/`
- **Database:** `shared_users_db.users`, `kids_ascension_db.user_profiles`

#### 4. Classroom Management (1.5 days)
- [ ] Classroom CRUD + student rosters
- [ ] Homework assignment with tracking
- [ ] Student accountability (watch history)
- [ ] Performance metrics per class
- **Files:** `app/(dashboard)/kids-ascension/classrooms/`
- **Database:** `kids_ascension_db.classrooms`, `classroom_students`, `homework`

### 🟡 Important Features (Week 2+) - 3-4 weeks

#### 5-12. Operations Features
- Creator management (1 day): Profile verification, Trusted Creator Badge, performance metrics
- Parent/child controls (2 days): Content restrictions, usage monitoring, approval workflows
- Idea marketplace (1.5 days): User-submitted video ideas, voting/ranking, creator assignment
- Activity monitoring (1 day): Engagement heatmap, inactive user identification, DAU/MAU
- Email campaigns (1 day): Template manager, bulk sending, newsletters
- School partnerships (1 day): Registration, admin management, quotas
- Safety controls (2 days): Report management, investigation workflow, trust & safety
- Reporting (2 days): User demographics, content performance, creator stats, CSV export

### 🟢 Nice-to-Have (Post-MVP) - 3+ weeks
- Advanced analytics, angel donor program, compliance tools, AI content filtering, internationalization

**Key Features:** Guest mode, gamification (badges, streaks), learning portfolio export, parental preview controls

---

## Feature Prioritization Matrix

| Priority | OL Features | KA Features | Combined Est. |
|----------|-------------|-------------|---------------|
| **🔴 Critical** | 3 (130h) | 4 (5-7 days) | **2-3 weeks** |
| **🟡 Important** | 12 (340h) | 8 (3-4 weeks) | **6-8 weeks** |
| **🟢 Nice-to-Have** | 13 (500h+) | 10+ (3+ weeks) | **12+ weeks** |

**MVP Timeline:** 2-3 weeks (P1 features only)
**Full Solution:** 18-20 weeks (all priorities)

---

## Implementation Roadmap

### Phase 0: Foundation ✅ Complete
- Authentication + RBAC
- MCP Gateway client
- Health monitoring
- Admin dashboard layout

### Phase 1: Ozean Licht Critical (Week 1-2) - **CURRENT**
1. Course management interface
2. Member search + management
3. Payment monitoring + revenue charts
4. Manual order creation tool

**Deliverables:** Day-1 operational admin for OL platform

### Phase 2: Kids Ascension Critical (Week 3-4)
1. Video upload + management
2. Content review workflow
3. User management (students, parents, educators, creators)
4. Classroom operations

**Deliverables:** Day-1 operational admin for KA platform

### Phase 3: Operations (Week 5-8)
- Content moderation (OL + KA)
- Analytics dashboards (both platforms)
- Email campaign managers
- Activity monitoring
- Support systems

**Deliverables:** Smooth post-launch operations

### Phase 4: Intelligence (Week 9-12)
- Advanced analytics (cohort, funnel, churn)
- Creator ecosystem tools
- Angel donor program (KA)
- Business intelligence reporting

**Deliverables:** Growth and optimization features

### Phase 5: Scale (Week 13+)
- ML recommendations
- Advanced segmentation
- Compliance automation
- White-label features

**Deliverables:** Enterprise-grade capabilities

---

## Architecture Decisions

### Hybrid Admin Approach

**Ecosystem Admin** (`apps/admin/`) - Centralized
- Cross-platform user management
- System health + monitoring
- Authentication + authorization
- Audit logs + compliance
- Configuration management

**Platform-Specific Admin** - Decentralized
- **OL Admin:** Course, member, payment operations in `app/(dashboard)/ozean-licht/`
- **KA Admin:** Video, review, classroom operations in `app/(dashboard)/kids-ascension/`

**Rationale:** Separates concerns, reduces cognitive load, enables independent scaling, aligns with monorepo structure

### Database Access Pattern
1. **MCP Gateway** (preferred): All database operations via RPC
2. **Direct Prisma** (fallback): Complex queries requiring transactions
3. **Connection Pooling:** 2-10 connections per database via MCP Gateway

### Multi-Tenancy
- `shared_users_db` - Unified authentication (both platforms)
- `ozean_licht_db` - OL-specific data (courses, orders, transactions)
- `kids_ascension_db` - KA-specific data (videos, reviews, classrooms)
- JWT tokens contain entity access: `{ entityId: "kids_ascension", role: "admin" }`

---

## Development Workflow

### Adding New Admin Features

**1. Create Page Structure**
```bash
# For Ozean Licht feature
app/(dashboard)/ozean-licht/feature/page.tsx
components/ozean-licht/FeatureTable.tsx
lib/services/ozean-licht-service.ts

# For Kids Ascension feature
app/(dashboard)/kids-ascension/feature/page.tsx
components/kids-ascension/FeatureForm.tsx
lib/services/kids-ascension-service.ts
```

**2. Add Database Operations**
```typescript
// Via MCP Gateway
const client = new MCPGatewayClientWithQueries({ database: 'ozean_licht_db' });
const data = await client.query('SELECT * FROM courses WHERE is_published = $1', [true]);

// Or via Prisma (complex queries)
import { prisma } from '@/lib/prisma';
const data = await prisma.course.findMany({ include: { modules: true } });
```

**3. Add to Sidebar Navigation**
```typescript
// lib/navigation.ts
export const sidebarLinks = [
  { href: '/dashboard/ozean-licht/courses', label: 'Courses', icon: BookIcon },
  // ...
];
```

**4. Add Audit Logging**
```typescript
await client.createAuditLog({
  adminUserId: session.user.id,
  action: 'course.create',
  entityType: 'course',
  entityId: newCourse.id,
  entityScope: 'ozean_licht',
  metadata: { title: newCourse.title },
});
```

### Testing
```bash
pnpm test              # All tests
pnpm test:unit         # Unit tests only
pnpm test:integration  # MCP Gateway integration (requires MCP running)
pnpm typecheck         # TypeScript validation
```

---

## Documentation

**Core Documentation:**
- [Documentation Index](./docs/README.md) - Complete docs overview
- [OL Requirements](./docs/requirements/ozean_licht_admin_requirements.md) - 28 features, 1123 lines
- [KA Requirements](./docs/requirements/kids_ascension_admin_requirements.md) - 40+ features, 1515 lines
- [Deployment Guide](./docs/deployment/DEPLOYMENT.md) - Production deployment
- [Developer Guide](./CLAUDE.md) - Quick patterns + troubleshooting
- [Branding Guide](./BRANDING.md) - Ozean Licht design system

**Technical References:**
- [MCP Client API](./lib/mcp-client/README.md) - Database operations
- [Design System](./design-system.md) - UI component library
- [Test Credentials](./docs/development/credentials.md) - Local dev accounts

---

## Success Criteria

**MVP Success (Phase 1-2):**
- [ ] OL admins can manage courses, members, payments
- [ ] KA admins can upload videos, manage review workflow
- [ ] All P1 features tested and deployed
- [ ] Performance < 2s page load
- [ ] Zero critical security issues

**Post-MVP Success (Phase 3-4):**
- [ ] Analytics dashboards operational
- [ ] Email campaigns functional
- [ ] Creator programs launched
- [ ] User satisfaction > 4.5/5
- [ ] Support tickets < 5/day

---

## Contributing

**Before Starting:**
1. Review platform requirements (OL or KA)
2. Check Phase 1 roadmap for current priorities
3. Read [CLAUDE.md](./CLAUDE.md) for development patterns
4. Verify MCP Gateway is running

**Development Process:**
1. Create feature branch: `feature/ol-course-management` or `feature/ka-video-upload`
2. Implement with server components (default) + client components (interactive)
3. Add TypeScript types in `types/`
4. Write tests for business logic
5. Add audit logging for admin actions
6. Update navigation in `Sidebar.tsx`
7. Document in `docs/` if new major feature

---

## License

**UNLICENSED** - Private package for Ozean Licht Ecosystem

---

## Support

**Issues:** GitHub Issues
**Questions:** Development team
**Docs:** [./docs/README.md](./docs/README.md)

---

**Last Updated:** 2025-11-11
**Status:** Phase 1 - Ozean Licht Critical Features
**Maintainer:** Platform Team + Autonomous Agents
