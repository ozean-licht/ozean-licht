# Admin Dashboard Roadmap - Single Source of Truth

**Epic:** Ozean Licht Ecosystem Admin Dashboard
**Status:** Planning Phase
**Last Updated:** 2025-11-09
**Owner:** Platform Team

---

## Executive Summary

This roadmap defines the comprehensive implementation plan for the Ozean Licht Ecosystem Admin Dashboard, serving both **Ozean Licht** (spiritual education platform) and **Kids Ascension** (children's educational platform). The dashboard follows a **hybrid architecture**: centralized ecosystem admin for shared operations + platform-specific admin sections for domain-specific features.

**Scope:**
- **Ozean Licht:** 28 features across 7 functional areas (3 Critical, 12 Important, 13 Nice-to-Have)
- **Kids Ascension:** 10 core features across 6 functional areas (4 Critical, 4 Important, 2 Nice-to-Have)
- **Shared Infrastructure:** Authentication, audit logging, health monitoring, storage management

**Timeline:** 8-12 weeks for full MVP (Phases 1-3)
**Estimated Effort:** 600-800 hours total development

---

## Architecture Overview

### Hybrid Admin Architecture

```
apps/admin/                           # Ecosystem Admin (Central)
├── app/(dashboard)/
│   ├── page.tsx                     # ✅ Home dashboard
│   ├── health/                      # ✅ System health monitoring
│   ├── storage/                     # ✅ MinIO management
│   ├── users/                       # 🔄 Multi-platform user management
│   ├── settings/                    # 🔄 Platform configuration
│   └── audit/                       # 🔄 Audit logs
│
├── app/(dashboard)/ozean-licht/     # Ozean Licht Specific
│   ├── courses/                     # ❌ Course CRUD
│   ├── members/                     # ❌ OL member management
│   ├── payments/                    # ❌ Payment monitoring
│   ├── content/                     # ❌ Content moderation
│   ├── analytics/                   # ❌ OL analytics
│   └── emails/                      # ❌ Email campaigns
│
└── app/(dashboard)/kids-ascension/  # Kids Ascension Specific
    ├── content/                     # ❌ Video/course management
    ├── moderation/                  # ❌ Content review
    ├── classrooms/                  # ❌ Classroom management
    ├── creators/                    # ❌ Creator management
    ├── analytics/                   # ❌ KA analytics
    └── marketplace/                 # ❌ Idea marketplace

Legend: ✅ Done | 🔄 In Progress | ❌ Not Started
```

### Technology Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Authentication:** NextAuth v5 (✅ implemented)
- **Database:** PostgreSQL via MCP Gateway
- **UI:** Tailwind CSS + shadcn/ui
- **State:** React Query + Zustand (where needed)
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

---

## Phased Roadmap

### Phase 1: Foundation & Shared Infrastructure (Week 1-2)
**Objective:** Build core admin infrastructure shared across both platforms

**Status:** 🔄 In Progress (Specs 1.1-1.7 Implemented, Testing Pending)

#### Specs Status:
1. ✅ **`admin-layout-navigation.md`** (Spec 1.1) - IMPLEMENTED (not tested)
2. ✅ **`admin-shared-ui-components.md`** (Spec 1.2) - IMPLEMENTED (not tested)
3. ✅ **`admin-data-tables-foundation.md`** (Spec 1.3) - IMPLEMENTED (not tested)
4. ✅ **`admin-basic-rbac.md`** (Spec 1.4) - IMPLEMENTED (not tested)
5. ✅ **`admin-user-management-list.md`** (Spec 1.5) - IMPLEMENTED (not tested)
6. ✅ **`admin-user-management-actions.md`** (Spec 1.6) - IMPLEMENTED (not tested)
7. ✅ **`admin-audit-logging-foundation.md`** (Spec 1.7) - IMPLEMENTED (not tested)
8. ❌ **`admin-permissions-matrix-ui.md`** (Spec 1.8) - Not started

#### Key Features:
- [x] Authentication framework (NextAuth v5)
- [x] Session management
- [x] Health monitoring
- [x] Storage management (MinIO)
- [ ] Unified user list/search across platforms
- [ ] Role assignment UI (SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT)
- [ ] Permission matrix configuration
- [ ] Audit logging framework
- [ ] Admin activity tracking
- [ ] Two-factor authentication management

#### Success Criteria:
- [ ] Admins can authenticate and access dashboard
- [ ] Role-based navigation (different views per role)
- [ ] All admin actions logged to audit trail
- [ ] User search/filter working across both platforms
- [ ] Health monitoring shows all services

**Estimated Effort:** 80 hours
**Dependencies:** None (foundation layer)

---

### Phase 2: Ozean Licht MVP (Week 3-4)
**Objective:** Deploy critical Ozean Licht admin features (Day-1 Operations)

**Status:** ❌ Not Started

#### Specs to Create:
1. **`ol-course-management.md`** - Course CRUD, module builder, content editor
2. **`ol-member-management.md`** - OL-specific member dashboard, access control
3. **`ol-payment-monitoring.md`** - Ablefy integration, transaction tracking, revenue analytics

#### Key Features (Critical Priority):

**Course Management (40h)**
- [ ] Course listing with search/filter
- [ ] Create/edit course with drag-drop module builder
- [ ] Manage course modules and content
- [ ] Publish/unpublish courses
- [ ] Bulk operations
- [ ] Version history

**Member Management (50h)**
- [ ] Member list with pagination/search
- [ ] Filter by role, status, date
- [ ] View member profile + enrollments
- [ ] Grant/revoke OZEAN_LICHT entity access
- [ ] Change member roles
- [ ] View purchase history
- [ ] Deactivate/reactivate accounts
- [ ] Bulk member operations

**Payment Monitoring (40h)**
- [ ] Transaction list with filtering
- [ ] Transaction detail view
- [ ] Order status dashboard
- [ ] Manual order creation (emergency access)
- [ ] Course mappings (Ablefy product ID → course)
- [ ] Revenue analytics (daily/monthly charts)
- [ ] Failed payment alerts
- [ ] Refund processing interface

#### Success Criteria:
- [ ] Admins can create and publish courses
- [ ] Member management fully functional
- [ ] Payment transactions visible and trackable
- [ ] Manual course access grants working
- [ ] Revenue dashboard showing accurate data

**Estimated Effort:** 130 hours
**Dependencies:** Phase 1 (user management, audit logging)

---

### Phase 3: Kids Ascension MVP (Week 5-6)
**Objective:** Deploy critical Kids Ascension admin features

**Status:** ❌ Not Started

#### Specs to Create:
1. **`ka-content-management.md`** - Video upload, course/lesson organization, metadata
2. **`ka-content-review.md`** - Review queue, harm ranking, multi-reviewer workflow
3. **`ka-user-management.md`** - Student, parent, educator, creator profiles
4. **`ka-classroom-management.md`** - Classroom CRUD, rosters, homework tracking

#### Key Features (Critical Priority):

**Content Management (2 days)**
- [ ] Video upload with metadata (title, description, age range, subject)
- [ ] Course and lesson organization
- [ ] Meditation content management
- [ ] Video status tracking (draft, review, approved, published)
- [ ] Bulk operations (tag, categorize)
- [ ] Video analytics (views, engagement)

**Content Review & Moderation (2 days)**
- [ ] Review queue display
- [ ] Reviewer assignment (by subject matter)
- [ ] AI pre-screening results (Whisper transcription)
- [ ] Harm ranking scores
- [ ] Multi-reviewer collaboration
- [ ] Timestamp-specific feedback to creators
- [ ] Approval/rejection workflow
- [ ] Revision & resubmit tracking

**User Management (1 day)**
- [ ] Student account list
- [ ] Parent-child relationship viewer
- [ ] Educator account management
- [ ] Creator profile management
- [ ] User activity monitoring
- [ ] Access restrictions and moderation

**Classroom Management (1.5 days)**
- [ ] Classroom CRUD operations
- [ ] Assign educators to classrooms
- [ ] View class rosters
- [ ] Student enrollment tracking
- [ ] Homework assignment tracking
- [ ] Class analytics

#### Success Criteria:
- [ ] Videos can be uploaded and published
- [ ] Content review workflow operational
- [ ] Users can be managed by role
- [ ] Classrooms can be created and managed
- [ ] All P1 features tested and working

**Estimated Effort:** 100 hours
**Dependencies:** Phase 1 (user management, audit logging)

---

### Phase 4: Operations & Enhancement (Week 7-9)
**Objective:** Add important operational features for both platforms

**Status:** ❌ Not Started

#### Specs to Create:
1. **`admin-analytics-dashboard.md`** - KPI tracking, engagement metrics, reporting (shared)
2. **`admin-email-campaigns.md`** - Email template manager, bulk sending, tracking (shared)
3. **`ol-content-moderation.md`** - OL content approval workflow
4. **`ka-creator-management.md`** - Creator profiles, badges, performance tracking
5. **`ka-idea-marketplace.md`** - User-submitted ideas, voting, creator assignment

#### Key Features (Important Priority):

**Analytics Dashboard (Shared - 40h)**
- [ ] Platform-wide KPIs (DAU, MAU)
- [ ] Engagement heatmaps
- [ ] Content consumption trends
- [ ] User demographics
- [ ] Revenue attribution (OL)
- [ ] Export reports (CSV/PDF)

**Email Campaign Manager (Shared - 30h)**
- [ ] Email template creation
- [ ] Bulk email sending (segmented)
- [ ] Scheduled campaigns
- [ ] Delivery tracking
- [ ] Unsubscribe management
- [ ] A/B testing framework

**Ozean Licht Specific:**
- [ ] Content moderation queue (35h)
- [ ] Event management (35h)
- [ ] Support ticketing system (35h)
- [ ] Video library manager (30h)

**Kids Ascension Specific:**
- [ ] Creator verification & badges (1 day)
- [ ] Parent-child control panel (2 days)
- [ ] Idea marketplace admin (1.5 days)
- [ ] Activity monitoring dashboard (1 day)

#### Success Criteria:
- [ ] Analytics showing accurate platform metrics
- [ ] Email campaigns can be sent successfully
- [ ] Content moderation workflows in place
- [ ] Creator program operational
- [ ] All P2 features tested

**Estimated Effort:** 200 hours
**Dependencies:** Phases 2-3 (platform-specific data)

---

### Phase 5: Advanced Features & Polish (Week 10-12)
**Objective:** Nice-to-have features, optimizations, and scalability improvements

**Status:** ❌ Not Started

#### Specs to Create:
1. **`admin-advanced-rbac.md`** - Permission matrix, API key management
2. **`admin-system-configuration.md`** - Platform settings, feature flags
3. **`admin-backup-management.md`** - Backup status, data import/export
4. **`ol-seo-tools.md`** - Metadata editor, sitemap, Open Graph
5. **`ka-angel-donor-program.md`** - Donor tracking, impact reporting
6. **`ka-compliance-tools.md`** - GDPR export, data deletion, legal holds

#### Key Features (Nice-to-Have):

**Ozean Licht:**
- [ ] Affiliate program management (40h)
- [ ] Advanced segmentation (45h)
- [ ] ML recommendation dashboard (50h)
- [ ] SEO tools (20h)
- [ ] Performance monitoring (25h)

**Kids Ascension:**
- [ ] Angel donor program (2 days)
- [ ] Compliance tools (3 days)
- [ ] Advanced moderation (4 days)
- [ ] Survey & feedback system (30h)
- [ ] Certification management (35h)

**Shared:**
- [ ] Advanced permission matrix
- [ ] System configuration UI
- [ ] Backup & data management
- [ ] Third-party integrations hub
- [ ] Mobile app management (future)

#### Success Criteria:
- [ ] All P3 features implemented
- [ ] Performance optimized (<2s page load)
- [ ] Full test coverage (>80%)
- [ ] Documentation complete
- [ ] Production-ready deployment

**Estimated Effort:** 250+ hours
**Dependencies:** Phases 1-4 complete

---

## Spec Breakdown & Creation Order

### Must Create First (Phase 1):
1. `admin-foundation-shared-components.md` - UI foundation
2. `admin-rbac-permissions.md` - Security model
3. `admin-audit-logging.md` - Compliance foundation
4. `admin-user-management-unified.md` - User operations

### Ozean Licht Specs (Phase 2):
5. `ol-course-management.md`
6. `ol-member-management.md`
7. `ol-payment-monitoring.md`

### Kids Ascension Specs (Phase 3):
8. `ka-content-management.md`
9. `ka-content-review.md`
10. `ka-user-management.md`
11. `ka-classroom-management.md`

### Enhancement Specs (Phase 4):
12. `admin-analytics-dashboard.md`
13. `admin-email-campaigns.md`
14. `ol-content-moderation.md`
15. `ka-creator-management.md`
16. `ka-idea-marketplace.md`

### Advanced Specs (Phase 5):
17. `admin-advanced-rbac.md`
18. `admin-system-configuration.md`
19. `admin-backup-management.md`
20. `ol-seo-tools.md`
21. `ka-angel-donor-program.md`
22. `ka-compliance-tools.md`

**Total Specs:** 22 implementation specifications

---

## Dependencies & Integration Points

### External Dependencies:
- **Ablefy API** (Ozean Licht payments)
- **Cloudflare Stream** (video CDN for both platforms)
- **Resend API** (email sending)
- **N8N** (workflow automation)
- **Airtable** (OL content sync)
- **MCP Gateway** (unified service access)

### Internal Dependencies:
```
Phase 1 (Foundation)
    ↓
    ├── Phase 2 (OL MVP)
    └── Phase 3 (KA MVP)
         ↓
         Phase 4 (Operations)
              ↓
              Phase 5 (Advanced)
```

### Database Dependencies:
- `shared_users_db` - Unified auth (required for all phases)
- `ozean_licht_db` - OL-specific data (Phase 2+)
- `kids_ascension_db` - KA-specific data (Phase 3+)
- `orchestrator_db` - ADW state (future)

---

## State-Managed Task Tracking

### Phase 1: Foundation (🔄 In Progress)
- [x] Authentication framework
- [x] Session management
- [x] Basic dashboard layout
- [x] Health monitoring page
- [x] Storage management (MinIO)
- [x] Layout & Navigation (Spec 1.1 - implemented, not tested)
- [x] Shared UI Components (Spec 1.2 - implemented, not tested)
- [x] Data Tables Foundation (Spec 1.3 - implemented, not tested)
- [ ] Basic RBAC (Spec 1.4)
- [ ] Unified user management (Spec 1.5-1.6)
- [ ] Audit logging system (Spec 1.7)
- [ ] Permission matrix UI (Spec 1.8)
- [ ] 2FA management

### Phase 2: Ozean Licht MVP (❌ Not Started)
- [ ] Course management module
- [ ] Member management dashboard
- [ ] Payment monitoring dashboard
- [ ] Transaction detail views
- [ ] Revenue analytics charts
- [ ] Manual order creation
- [ ] Course access grants
- [ ] Member role assignment

### Phase 3: Kids Ascension MVP (❌ Not Started)
- [ ] Video upload handler
- [ ] Content review queue
- [ ] Reviewer assignment
- [ ] Harm ranking display
- [ ] User management by role
- [ ] Classroom CRUD
- [ ] Student roster management
- [ ] Homework tracking

### Phase 4: Operations (❌ Not Started)
- [ ] Analytics dashboard
- [ ] Email campaign manager
- [ ] Content moderation queue
- [ ] Creator management
- [ ] Idea marketplace admin
- [ ] Event management (OL)
- [ ] Support ticketing
- [ ] Video library manager

### Phase 5: Advanced (❌ Not Started)
- [ ] Advanced RBAC
- [ ] System configuration UI
- [ ] Backup management
- [ ] SEO tools (OL)
- [ ] Angel donor program (KA)
- [ ] Compliance tools (KA)
- [ ] Performance monitoring
- [ ] Third-party integrations hub

---

## Success Metrics

### Phase 1 Success:
- ✅ 100% admin actions logged
- ✅ Role-based dashboard access working
- ✅ User search across platforms functional
- ✅ Health monitoring showing all services
- ✅ Zero authentication failures

### Phase 2 Success (Ozean Licht):
- ✅ 64+ courses manageable via dashboard
- ✅ 1000+ members visible and manageable
- ✅ 40,833+ transactions queryable
- ✅ Revenue charts showing accurate data
- ✅ Manual course access grants working

### Phase 3 Success (Kids Ascension):
- ✅ Video upload → review → publish workflow complete
- ✅ Content review queue functional
- ✅ User roles (student, parent, educator, creator) manageable
- ✅ Classrooms operational
- ✅ Homework tracking working

### Phase 4 Success:
- ✅ Analytics showing platform KPIs
- ✅ Email campaigns sent successfully
- ✅ Creator badges assignable
- ✅ Idea marketplace tracking ideas
- ✅ Support tickets being resolved

### Phase 5 Success:
- ✅ All features production-ready
- ✅ Performance <2s page load
- ✅ Test coverage >80%
- ✅ Full documentation
- ✅ Scalability tested

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Database schema changes** | Medium | High | Define complete schema early; use migrations |
| **Performance with large datasets** | Medium | Medium | Implement pagination, caching, indexes |
| **Security vulnerabilities** | Low | Critical | RLS policies, audit logs, code review |
| **Scope creep** | High | High | Strict MVP definition, defer P3 features |
| **Integration failures** (Ablefy, etc) | Low | Medium | Mock APIs for testing, error handling |
| **Video upload failures** | Low | Medium | Retry logic, resumable uploads |

---

## Next Steps

### Immediate Actions (This Week):
1. ✅ Create this roadmap document
2. ✅ Implement Spec 1.1: Layout & Navigation
3. ✅ Implement Spec 1.2: Shared UI Components
4. ✅ Implement Spec 1.3: Data Tables Foundation
5. ✅ Implement Spec 1.4: Basic RBAC
6. ✅ Implement Spec 1.5: User Management List
7. ✅ Implement Spec 1.6: User Management Actions
8. ✅ Implement Spec 1.7: Audit Logging Foundation
9. [ ] **CURRENT:** Test Specs 1.1-1.7 (all Phase 1 core specs)
10. [ ] Create/Implement Spec 1.8: Permissions Matrix UI (optional)

### Week 2:
1. [ ] Implement Phase 1 specs
2. [ ] Create Phase 2 specs (Ozean Licht)
3. [ ] Set up staging environment
4. [ ] Define testing strategy

### Week 3-4:
1. [ ] Implement Phase 2 (Ozean Licht MVP)
2. [ ] Create Phase 3 specs (Kids Ascension)
3. [ ] Begin E2E testing

### Week 5-6:
1. [ ] Implement Phase 3 (Kids Ascension MVP)
2. [ ] Create Phase 4 specs
3. [ ] Production deployment preparation

---

## Appendix: Quick Reference

### Platform Feature Matrix

| Feature | OL | KA | Priority | Effort |
|---------|----|----|----------|--------|
| **User Management** | ✅ | ✅ | P1 | 20h |
| **Course Management** | ✅ | ✅ | P1 | 40h |
| **Payment Monitoring** | ✅ | ❌ | P1 | 40h |
| **Content Review** | ⚠️ | ✅ | P1 | 35h |
| **Classroom Management** | ❌ | ✅ | P2 | 25h |
| **Analytics** | ✅ | ✅ | P2 | 40h |
| **Email Campaigns** | ✅ | ✅ | P2 | 30h |
| **Creator Program** | ❌ | ✅ | P2 | 20h |
| **Donor Program** | ❌ | ✅ | P3 | 30h |
| **Compliance Tools** | ✅ | ✅ | P3 | 50h |

Legend: ✅ Required | ⚠️ Limited | ❌ Not Applicable

### Technology Decisions

- **Frontend:** Next.js 14 (App Router) - Server components by default
- **Authentication:** NextAuth v5 - Already implemented
- **Database Access:** MCP Gateway (preferred) or direct Prisma
- **UI Components:** shadcn/ui - Consistent with app
- **Charts:** Recharts - Lightweight and declarative
- **Forms:** React Hook Form + Zod - Type-safe validation
- **Tables:** TanStack Table - Flexible data grids
- **Notifications:** Sonner - Toast notifications

---

**Document Version:** 1.0
**Created:** 2025-11-09
**Status:** Active Planning Document
**Next Review:** After Phase 1 completion
