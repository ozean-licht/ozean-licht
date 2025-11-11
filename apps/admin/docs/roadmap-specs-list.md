# Admin Dashboard Specs - Implementation Order

**Purpose:** Define the optimal sequence for creating and implementing admin specs to minimize confusion and maximize incremental value.

**Last Updated:** 2025-11-09
**Status:** Active Planning Document
**Source:** Derived from `admin-dashboard-roadmap.md`

---

## Implementation Philosophy

1. **Start Small, Build Up** - Begin with minimal viable features, add complexity incrementally
2. **Validate Early** - Each spec should produce testable, deployable functionality
3. **Clear Dependencies** - Only create specs when their dependencies are complete
4. **Incremental Value** - Prioritize specs that unlock the most downstream work
5. **Parallel Tracks** - Identify specs that can be developed simultaneously

---

## Phase 1: Foundation (Week 1-2) - 8 Specs

**Status:** ✅ Complete (8/8 implemented, testing pending)

### Track 1A: Core Infrastructure (Sequential)

#### **Spec 1.1: `admin-layout-navigation.md`**
**Time:** 12 hours | **Priority:** P0 (Blocker)
**Dependencies:** None (uses existing NextAuth)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- App shell layout with sidebar/header
- Role-based navigation menu structure
- Breadcrumb system
- Mobile responsive navigation
- Theme switching (if needed)

**Why First:** Every other page needs the layout. This unblocks all UI development.

**Success Criteria:**
- [ ] Layout renders with proper spacing
- [ ] Navigation shows/hides based on user role
- [ ] Mobile hamburger menu works
- [ ] Breadcrumbs update on route change

---

#### **Spec 1.2: `admin-shared-ui-components.md`**
**Time:** 16 hours | **Priority:** P0 (Blocker)
**Dependencies:** 1.1 (Layout)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Status badges (active, pending, error states)
- Action buttons (edit, delete, view)
- Loading skeletons for tables/cards
- Empty state components
- Confirmation modals
- Toast notification patterns
- Form field components (text, select, date picker)

**Why Second:** Reusable components prevent duplication in all feature specs.

**Success Criteria:**
- [ ] Component library documented in Storybook/docs
- [ ] All components have TypeScript types
- [ ] Consistent styling with design system
- [ ] Accessibility (ARIA labels, keyboard nav)

---

#### **Spec 1.3: `admin-data-tables-foundation.md`**
**Time:** 20 hours | **Priority:** P0 (Blocker)
**Dependencies:** 1.2 (Shared Components)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Base DataTable component (TanStack Table)
- Pagination controls (client + server-side)
- Column sorting (single + multi)
- Search/filter UI patterns
- Bulk action checkbox selection
- Export to CSV functionality
- Column visibility toggles
- Responsive table design (mobile stacking)

**Why Third:** Every feature list (users, courses, members, videos) needs tables.

**Success Criteria:**
- [ ] Table handles 1000+ rows with server-side pagination
- [ ] Sort works on all column types
- [ ] Search debounced (300ms)
- [ ] Bulk actions confirmed before execution
- [ ] CSV export includes filtered/sorted data

---

### Track 1B: Security & Permissions (Sequential)

#### **Spec 1.4: `admin-basic-rbac.md`**
**Time:** 16 hours | **Priority:** P1 (Critical)
**Dependencies:** 1.1 (Layout for role display)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Define 4 core roles: SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT
- Role assignment UI (select dropdown)
- Role-based route protection (middleware)
- Role badge display in user profiles
- Entity access mapping (KIDS_ASCENSION, OZEAN_LICHT)
- Session role validation

**Why Fourth:** Needed before building feature access controls.

**Implementation:**
- `lib/rbac/constants.ts` - Role definitions, permissions, route access
- `lib/rbac/utils.ts` - Role validation functions
- `components/rbac/RoleBadge.tsx`, `RoleSelect.tsx`, `EntityBadge.tsx`

**Success Criteria:**
- [ ] Admins can assign roles to users
- [ ] Routes redirect unauthorized roles
- [ ] Entity access enforced in database queries
- [ ] Role changes reflected immediately (no cache issues)

---

#### **Spec 1.5: `admin-user-management-list.md`**
**Time:** 18 hours | **Priority:** P1 (Critical)
**Dependencies:** 1.3 (Data Tables), 1.4 (Basic RBAC)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Unified user list (shared_users_db.users)
- Search by email, name, user_id
- Filter by role, entity, status, registration date
- User detail view (read-only for now)
- Entity access badges (KA, OL, both)
- Last login timestamp display

**Why Fifth:** First real feature using tables + RBAC. Validates foundation.

**Implementation:**
- `app/(dashboard)/users/page.tsx` - Server component with filters
- `app/(dashboard)/users/UsersDataTable.tsx` - Client data table
- `app/(dashboard)/users/columns.tsx` - Table column definitions
- `app/(dashboard)/users/[id]/page.tsx` - User detail page

**Success Criteria:**
- [ ] Search returns results in <500ms
- [ ] Filters work independently and combined
- [ ] User detail shows all entity access
- [ ] Pagination handles 10,000+ users

---

#### **Spec 1.6: `admin-user-management-actions.md`**
**Time:** 20 hours | **Priority:** P1 (Critical)
**Dependencies:** 1.5 (User List)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Grant/revoke entity access (KIDS_ASCENSION, OZEAN_LICHT)
- Assign/change roles (RBAC enforcement)
- Deactivate/reactivate user accounts
- Reset password trigger (email)
- Manual email verification
- View user activity log (last 30 days)
- Bulk operations (assign role, grant entity access)

**Why Sixth:** Completes basic user management before audit logging.

**Implementation:**
- `app/api/admin-users/[id]/route.ts` - PATCH endpoint for role updates
- `app/(dashboard)/users/[id]/AdminUserForm.tsx` - Client form
- Role validation via `canManageRoles()` utility
- Prevents self-role changes

**Success Criteria:**
- [ ] Entity access changes reflected in JWT on next login
- [ ] Role changes validated (can't assign SUPER_ADMIN without permission)
- [ ] Bulk actions show progress indicator
- [ ] All actions logged (for audit spec)

---

### Track 1C: Compliance & Monitoring (Sequential)

#### **Spec 1.7: `admin-audit-logging-foundation.md`**
**Time:** 24 hours | **Priority:** P1 (Critical)
**Dependencies:** 1.6 (User Actions to audit)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Audit log schema (admin_actions table)
- Capture: actor, action, resource, timestamp, changes (JSON diff)
- Log all user management actions (create, update, delete, role change)
- Log all entity access grants/revokes
- Audit log viewer (filterable table)
- Export audit logs (CSV, date range)
- Retention policy (90 days default)

**Why Seventh:** Now we have actions to audit. Build the logging system.

**Implementation:**
- `lib/mcp-client/queries.ts` - `createAuditLog()` and `listAuditLogs()`
- Integrated in `app/api/admin-users/[id]/route.ts` (line 55)
- AdminAuditLog types in `types/admin.ts`
- Logs actor, action, entity type/ID, metadata

**Success Criteria:**
- [ ] All admin actions logged with full context
- [ ] Audit log search works by actor, resource, date
- [ ] JSON diff shows before/after state
- [ ] Export includes all metadata

---

#### **Spec 1.8: `admin-permissions-matrix-ui.md`**
**Time:** 16 hours | **Priority:** P2 (Important)
**Dependencies:** 1.4 (Basic RBAC), 1.7 (Audit for permission changes)
**Status:** ✅ **IMPLEMENTED** (not tested)

**Scope:**
- Permission matrix editor (role × resource grid)
- Define permissions: CREATE, READ, UPDATE, DELETE, PUBLISH, APPROVE
- Resource types: users, courses, members, content, analytics, settings
- Permission assignment UI (checkboxes)
- Permission validation middleware
- Permission change audit logging

**Why Eighth:** Advanced RBAC - nice to have but not blocking OL/KA features.

**Success Criteria:**
- [ ] Permission matrix loads in <1s
- [ ] Permission changes saved and enforced immediately
- [ ] All permission changes audited
- [ ] Default permissions for each role defined

---

## Phase 2: Ozean Licht MVP (Week 3-4) - 5 Specs

### Track 2A: Course Management (Sequential)

#### **Spec 2.1: `ol-course-list-search.md`**
**Time:** 12 hours | **Priority:** P1 (Critical)
**Dependencies:** Phase 1 complete (tables, RBAC)

**Scope:**
- Course listing (ozean_licht_db.courses)
- Search by title, description, instructor
- Filter by status (draft, published, archived)
- Filter by category, difficulty
- Sort by created_at, updated_at, enrollment count
- Course card view (thumbnail, title, stats)
- Quick actions (edit, preview, publish/unpublish)

**Why First:** Foundation for all course operations. Validates OL database access.

**Success Criteria:**
- [ ] Course list loads in <1s
- [ ] Search returns relevant results
- [ ] Filters work independently
- [ ] Quick publish toggle works

---

#### **Spec 2.2: `ol-course-crud-editor.md`**
**Time:** 28 hours | **Priority:** P1 (Critical)
**Dependencies:** 2.1 (Course List)

**Scope:**
- Create course form (title, description, thumbnail, category, price)
- Edit course metadata
- Drag-drop module builder (nestable modules/lessons)
- Module CRUD operations
- Content editor (rich text for lessons)
- Image upload (thumbnails, lesson images)
- Save as draft / Publish workflow
- Version history (basic - last 5 versions)
- Duplicate course feature

**Why Second:** Core course authoring capability. Large scope justifies time estimate.

**Success Criteria:**
- [ ] Course creation saves all fields
- [ ] Module builder supports drag-drop reordering
- [ ] Content editor supports rich text + images
- [ ] Publish workflow prevents incomplete courses

---

### Track 2B: Member Management (Sequential)

#### **Spec 2.3: `ol-member-list-profiles.md`**
**Time:** 16 hours | **Priority:** P1 (Critical)
**Dependencies:** Phase 1 complete, 2.1 (Course List for enrollments)

**Scope:**
- Member listing (ozean_licht_db.members)
- Search by name, email, member_id
- Filter by role (student, instructor, admin), status, join date
- Member profile view (basic info, enrollments, purchase history)
- Enrollment list per member (course, status, progress %)
- Last activity timestamp

**Why Third:** Validates multi-database joins (shared_users + ozean_licht).

**Success Criteria:**
- [ ] Member list loads in <1s
- [ ] Profile view shows accurate enrollment data
- [ ] Search works across name and email
- [ ] Purchase history linked to transactions

---

#### **Spec 2.4: `ol-member-access-control.md`**
**Time:** 20 hours | **Priority:** P1 (Critical)
**Dependencies:** 2.3 (Member List), 2.2 (Course CRUD for grants)

**Scope:**
- Grant manual course access (bypass payment)
- Revoke course access (deactivate enrollment)
- Change member roles (student → instructor)
- Bulk access grants (CSV upload: member_id, course_id)
- Access grant audit logging
- Email notification on access grant
- Expiration dates for manual grants (optional)

**Why Fourth:** Critical for emergency support and promotions.

**Success Criteria:**
- [ ] Manual access grant creates valid enrollment
- [ ] Bulk upload validates member_id and course_id
- [ ] All grants logged in audit trail
- [ ] Revoked access prevents course viewing immediately

---

### Track 2C: Payment Monitoring (Can Start Parallel to 2.3/2.4)

#### **Spec 2.5: `ol-payment-transaction-dashboard.md`**
**Time:** 32 hours | **Priority:** P1 (Critical)
**Dependencies:** Phase 1 complete

**Scope:**
- Transaction list (ozean_licht_db.transactions)
- Filter by status (success, pending, failed), date range, amount range
- Transaction detail view (order ID, Ablefy product ID, amount, fees, net revenue)
- Order status dashboard (total revenue, success rate, failed count)
- Manual order creation (emergency course access via fake transaction)
- Product mapping UI (Ablefy product ID → course_id)
- Revenue analytics: daily/monthly charts (Recharts)
- Failed payment alert system (email to admin)
- Refund processing interface (mark as refunded, adjust revenue)

**Why Fifth:** Independent of course/member specs. Can be built in parallel.

**Success Criteria:**
- [ ] Transaction list paginated (1000+ transactions)
- [ ] Revenue charts accurate to the cent
- [ ] Product mapping auto-links transactions to courses
- [ ] Refund processing updates revenue correctly
- [ ] Manual order creates valid enrollment + transaction record

---

## Phase 3: Kids Ascension MVP (Week 5-6) - 5 Specs

### Track 3A: Content Management (Sequential)

#### **Spec 3.1: `ka-content-upload-infrastructure.md`**
**Time:** 16 hours | **Priority:** P1 (Critical)
**Dependencies:** Phase 1 complete

**Scope:**
- Video upload UI (drag-drop, progress bar)
- Upload to MinIO (hot storage) via MCP Gateway
- Metadata form (title, description, age range, subject, tags)
- Video status tracking (draft, uploaded, review, approved, published)
- Thumbnail generation (extract first frame or upload custom)
- Upload resumable (handle network interruptions)
- File validation (size limits, formats: mp4, mov, webm)

**Why First:** Foundation for all video operations. Tests MCP Gateway integration.

**Success Criteria:**
- [ ] Upload handles files up to 2GB
- [ ] Progress bar updates in real-time
- [ ] Failed uploads retry automatically
- [ ] Metadata saved with video record

---

#### **Spec 3.2: `ka-content-library-management.md`**
**Time:** 20 hours | **Priority:** P1 (Critical)
**Dependencies:** 3.1 (Upload Infrastructure)

**Scope:**
- Video library listing (kids_ascension_db.videos)
- Search by title, tags, creator
- Filter by status, age range, subject, upload date
- Video preview modal (thumbnail, metadata, playback if approved)
- Bulk operations (tag, categorize, delete)
- Course/lesson organization (link videos to courses)
- Meditation content management (special category)
- Video analytics (views, watch time, engagement rate)

**Why Second:** Completes basic content CRUD before review workflow.

**Success Criteria:**
- [ ] Library loads 1000+ videos with pagination
- [ ] Search returns relevant results in <500ms
- [ ] Bulk tagging updates multiple records
- [ ] Video preview plays approved content

---

### Track 3B: Content Review (Sequential after 3.2)

#### **Spec 3.3: `ka-content-review-workflow.md`**
**Time:** 24 hours | **Priority:** P1 (Critical)
**Dependencies:** 3.2 (Content Library)

**Scope:**
- Review queue display (status=review)
- Reviewer assignment (manual or by subject matter)
- AI pre-screening results (Whisper transcription, if available)
- Harm ranking scores (1-10 scale)
- Multi-reviewer collaboration (2+ reviewers per video)
- Timestamp-specific feedback to creators (e.g., "0:45 - inappropriate language")
- Approval/rejection workflow (with reason codes)
- Revision & resubmit tracking (version history)
- Approved videos trigger Cloudflare Stream upload

**Why Third:** Depends on having content to review. Critical for quality control.

**Success Criteria:**
- [ ] Review queue shows pending videos
- [ ] Reviewers can add timestamp comments
- [ ] Approval triggers Stream upload via MCP Gateway
- [ ] Rejection sends notification to creator
- [ ] Revision tracking shows edit history

---

### Track 3C: User & Classroom Management (Can Start Parallel to 3.2/3.3)

#### **Spec 3.4: `ka-user-management-by-role.md`**
**Time:** 14 hours | **Priority:** P1 (Critical)
**Dependencies:** Phase 1 (User Management foundation)

**Scope:**
- Student account list (entity=KIDS_ASCENSION)
- Parent-child relationship viewer (link parents to students)
- Educator account management (assign to classrooms)
- Creator profile management (badges, verification status)
- User activity monitoring (last login, content viewed, hours watched)
- Access restrictions (ban user, restrict upload, mute comments)

**Why Fourth:** Extends Phase 1 user management for KA-specific roles.

**Success Criteria:**
- [ ] Student list shows parent links
- [ ] Educator assignment updates classroom rosters
- [ ] Creator badges visible in profile
- [ ] Access restrictions enforced immediately

---

#### **Spec 3.5: `ka-classroom-management.md`**
**Time:** 18 hours | **Priority:** P1 (Critical)
**Dependencies:** 3.4 (User Management for educators/students)

**Scope:**
- Classroom CRUD operations (create, edit, archive)
- Assign educators to classrooms (one-to-many)
- View class rosters (student list per classroom)
- Student enrollment tracking (add/remove students)
- Homework assignment tracking (link videos/courses as homework)
- Class analytics (average watch time, completion rate)
- Classroom invite codes (students self-enroll)

**Why Fifth:** Completes KA operational requirements. Independent of content review.

**Success Criteria:**
- [ ] Classrooms created with educator assigned
- [ ] Rosters updated when students added/removed
- [ ] Homework assignments visible to students
- [ ] Analytics show class-wide metrics

---

## Phase 4: Operations & Enhancement (Week 7-9) - 5 Specs

### Track 4A: Shared Analytics (Start Early)

#### **Spec 4.1: `admin-analytics-foundation.md`**
**Time:** 24 hours | **Priority:** P2 (Important)
**Dependencies:** Phase 2 & 3 (data from OL + KA)

**Scope:**
- Platform-wide KPIs (DAU, MAU, total users, total revenue)
- Engagement heatmaps (usage by day/hour)
- Content consumption trends (top courses, top videos)
- User demographics (age range, location if available)
- Revenue attribution (OL only - by course, by member tier)
- Export reports (CSV, PDF with charts)
- Date range filters (last 7/30/90 days, custom)

**Why First (Phase 4):** High value for decision-making. Can start once data exists.

**Success Criteria:**
- [ ] KPIs accurate to database state
- [ ] Charts load in <2s
- [ ] Export includes all filtered data
- [ ] Date range filters work correctly

---

### Track 4B: Email Campaigns (Parallel to Analytics)

#### **Spec 4.2: `admin-email-campaign-manager.md`**
**Time:** 28 hours | **Priority:** P2 (Important)
**Dependencies:** Phase 1 (user management for segmentation)

**Scope:**
- Email template creation (rich text editor)
- Variable substitution ({{name}}, {{course_title}}, etc.)
- Bulk email sending (segmented by role, entity, activity)
- Scheduled campaigns (send at specific time)
- Delivery tracking (sent, opened, clicked, bounced)
- Unsubscribe management (honor user preferences)
- A/B testing framework (subject line variants)
- Email preview (test send)

**Why Second (Phase 4):** Marketing/engagement tool. Not critical for operations.

**Success Criteria:**
- [ ] Templates saved with variables
- [ ] Segmentation filters users correctly
- [ ] Scheduled sends trigger at exact time
- [ ] Tracking shows open/click rates

---

### Track 4C: Ozean Licht Enhancements (Sequential)

#### **Spec 4.3: `ol-content-moderation-queue.md`**
**Time:** 22 hours | **Priority:** P2 (Important)
**Dependencies:** Phase 2 complete (course management)

**Scope:**
- Content moderation queue (user-submitted content, course updates)
- Review workflow (approve, reject, request changes)
- Reviewer assignment (moderators)
- Moderation history (who approved, when)
- Flagged content alerts (user reports)
- Auto-moderation rules (keyword filters)

**Why Third (Phase 4):** OL may have user-generated content to moderate.

**Success Criteria:**
- [ ] Queue shows pending content
- [ ] Approval publishes content
- [ ] Rejection notifies creator
- [ ] Flagged content escalated to admin

---

### Track 4D: Kids Ascension Enhancements (Parallel to 4.3)

#### **Spec 4.4: `ka-creator-verification-badges.md`**
**Time:** 14 hours | **Priority:** P2 (Important)
**Dependencies:** Phase 3 (content management, user management)

**Scope:**
- Creator profile management (bio, social links, verification status)
- Badge system (verified, expert, top contributor)
- Badge assignment UI (manual or automatic based on metrics)
- Performance tracking (total views, avg rating, content count)
- Creator analytics dashboard (per-creator metrics)

**Why Fourth (Phase 4):** Enhances creator program. Nice-to-have for launch.

**Success Criteria:**
- [ ] Badges visible on creator profiles
- [ ] Badge assignment audited
- [ ] Performance metrics accurate
- [ ] Creator analytics show individual stats

---

#### **Spec 4.5: `ka-idea-marketplace-admin.md`**
**Time:** 18 hours | **Priority:** P2 (Important)
**Dependencies:** Phase 3 (user management for creators)

**Scope:**
- User-submitted idea listing (kids_ascension_db.ideas)
- Idea detail view (description, votes, comments)
- Voting system management (vote counts, fraud detection)
- Assign idea to creator (for video creation)
- Idea status tracking (submitted, in_progress, completed)
- Idea analytics (top voted, trending)

**Why Fifth (Phase 4):** Community feature. Can wait until core features stable.

**Success Criteria:**
- [ ] Idea list shows vote counts
- [ ] Assignment notifies creator
- [ ] Status updates tracked
- [ ] Fraud detection flags suspicious voting patterns

---

## Phase 5: Advanced Features (Week 10-12) - 6 Specs

**Note:** Phase 5 specs are nice-to-have. Prioritize based on user feedback after Phases 1-4 deployed.

#### **Spec 5.1: `admin-advanced-permissions.md`** (P3)
- Advanced permission matrix (granular resource-level permissions)
- API key management (for third-party integrations)
- Time:** 24 hours

#### **Spec 5.2: `admin-system-configuration.md`** (P3)
- Platform settings UI (feature flags, maintenance mode)
- Environment variable management (safe editing)
- **Time:** 20 hours

#### **Spec 5.3: `admin-backup-data-management.md`** (P3)
- Backup status dashboard (last backup, next scheduled)
- Data import/export (CSV, JSON)
- **Time:** 28 hours

#### **Spec 5.4: `ol-seo-metadata-tools.md`** (P3)
- Course metadata editor (Open Graph, Twitter Cards)
- Sitemap generator
- **Time:** 16 hours

#### **Spec 5.5: `ka-angel-donor-program.md`** (P3)
- Donor profile management
- Impact reporting (students sponsored, hours funded)
- **Time:** 22 hours

#### **Spec 5.6: `ka-compliance-gdpr-tools.md`** (P3)
- GDPR data export (user requests)
- Data deletion workflow (right to be forgotten)
- Legal hold management (preserve data for investigations)
- **Time:** 30 hours

---

## Dependency Graph

```
Phase 1 (Foundation)
├── 1.1 Layout ────────────────┐
│   ├── 1.2 Shared Components  │
│   │   └── 1.3 Data Tables    │ (All features depend on these)
│   └── 1.4 Basic RBAC ────────┤
│       ├── 1.5 User List      │
│       │   └── 1.6 User Actions
│       │       └── 1.7 Audit Logging
│       └── 1.8 Permissions Matrix (optional)
│
Phase 2 (OL MVP) ──────────────┤
├── 2.1 Course List           │
│   └── 2.2 Course Editor     │ (depends on Phase 1)
├── 2.3 Member List           │
│   └── 2.4 Member Access     │
└── 2.5 Payment Dashboard (parallel)
│
Phase 3 (KA MVP) ──────────────┤
├── 3.1 Upload Infra          │
│   ├── 3.2 Content Library   │ (depends on Phase 1)
│   │   └── 3.3 Review Workflow
│   ├── 3.4 User by Role (parallel to 3.2)
│   └── 3.5 Classroom Mgmt
│
Phase 4 (Operations) ──────────┤
├── 4.1 Analytics (depends on Phases 2+3)
├── 4.2 Email Campaigns (depends on Phase 1)
├── 4.3 OL Moderation (depends on Phase 2)
├── 4.4 KA Creator Badges (depends on Phase 3)
└── 4.5 KA Idea Marketplace (depends on Phase 3)
│
Phase 5 (Advanced) ────────────┘
└── All Phase 5 specs depend on Phases 1-4 complete
```

---

## Parallel Work Streams

To maximize velocity, these specs can be worked on in parallel once dependencies are met:

**Week 1:**
- Stream A: 1.1 → 1.2 → 1.3 (UI Foundation)
- Stream B: 1.4 (RBAC - can start with 1.1 done)

**Week 2:**
- Stream A: 1.5 → 1.6 (User Management)
- Stream B: 1.7 (Audit - can start once 1.6 logging patterns defined)
- Stream C: 1.8 (Permissions Matrix - optional, can start with 1.4 done)

**Week 3-4:**
- Stream A: 2.1 → 2.2 (Courses)
- Stream B: 2.3 → 2.4 (Members)
- Stream C: 2.5 (Payments - fully parallel)

**Week 5-6:**
- Stream A: 3.1 → 3.2 → 3.3 (Content + Review)
- Stream B: 3.4 → 3.5 (Users + Classrooms)

**Week 7-9:**
- Stream A: 4.1 (Analytics)
- Stream B: 4.2 (Email)
- Stream C: 4.3 (OL Moderation)
- Stream D: 4.4 → 4.5 (KA Creator + Marketplace)

---

## Quick Reference: Spec Status

| Phase | Spec | Priority | Hours | Status | Dependencies |
|-------|------|----------|-------|--------|--------------|
| **1** | 1.1 Layout & Navigation | P0 | 12 | ✅ Implemented (not tested) | None |
| **1** | 1.2 Shared UI Components | P0 | 16 | ✅ Implemented (not tested) | 1.1 |
| **1** | 1.3 Data Tables Foundation | P0 | 20 | ✅ Implemented (not tested) | 1.2 |
| **1** | 1.4 Basic RBAC | P1 | 16 | ✅ Implemented (not tested) | 1.1 |
| **1** | 1.5 User List | P1 | 18 | ✅ Implemented (not tested) | 1.3, 1.4 |
| **1** | 1.6 User Actions | P1 | 20 | ✅ Implemented (not tested) | 1.5 |
| **1** | 1.7 Audit Logging | P1 | 24 | ✅ Implemented (not tested) | 1.6 |
| **1** | 1.8 Permissions Matrix | P2 | 16 | ✅ Implemented (not tested) | 1.4, 1.7 |
| **2** | 2.1 OL Course List | P1 | 12 | ❌ Not Started | Phase 1 |
| **2** | 2.2 OL Course CRUD | P1 | 28 | ❌ Not Started | 2.1 |
| **2** | 2.3 OL Member List | P1 | 16 | ❌ Not Started | Phase 1, 2.1 |
| **2** | 2.4 OL Member Access | P1 | 20 | ❌ Not Started | 2.3, 2.2 |
| **2** | 2.5 OL Payment Dashboard | P1 | 32 | ❌ Not Started | Phase 1 |
| **3** | 3.1 KA Upload Infra | P1 | 16 | ❌ Not Started | Phase 1 |
| **3** | 3.2 KA Content Library | P1 | 20 | ❌ Not Started | 3.1 |
| **3** | 3.3 KA Content Review | P1 | 24 | ❌ Not Started | 3.2 |
| **3** | 3.4 KA User by Role | P1 | 14 | ❌ Not Started | Phase 1 |
| **3** | 3.5 KA Classroom Mgmt | P1 | 18 | ❌ Not Started | 3.4 |
| **4** | 4.1 Analytics Foundation | P2 | 24 | ❌ Not Started | Phases 2+3 |
| **4** | 4.2 Email Campaigns | P2 | 28 | ❌ Not Started | Phase 1 |
| **4** | 4.3 OL Content Moderation | P2 | 22 | ❌ Not Started | Phase 2 |
| **4** | 4.4 KA Creator Badges | P2 | 14 | ❌ Not Started | Phase 3 |
| **4** | 4.5 KA Idea Marketplace | P2 | 18 | ❌ Not Started | Phase 3 |
| **5** | 5.1 Advanced Permissions | P3 | 24 | ❌ Not Started | Phase 4 |
| **5** | 5.2 System Configuration | P3 | 20 | ❌ Not Started | Phase 4 |
| **5** | 5.3 Backup Management | P3 | 28 | ❌ Not Started | Phase 4 |
| **5** | 5.4 OL SEO Tools | P3 | 16 | ❌ Not Started | Phase 2 |
| **5** | 5.5 KA Angel Donor | P3 | 22 | ❌ Not Started | Phase 3 |
| **5** | 5.6 KA Compliance Tools | P3 | 30 | ❌ Not Started | Phase 3 |

**Total Specs:** 29 (optimized from original 22)
**Total Estimated Hours:** 590 hours (vs. original 600-800)

---

## Implementation Notes

1. ✅ **Phase 1 Complete (Specs 1.1-1.8)** - All foundation specs implemented, testing pending
2. **CURRENT PRIORITY:** Test all Phase 1 specs (layout, components, tables, RBAC, users, audit, permissions)
3. **Next steps:** Phase 2 (Ozean Licht MVP) - Course and member management features
4. **Validate foundation early** - 1.5 (User List) is first real feature to test tables + RBAC
5. **Parallel Phase 2/3 if team size allows** - OL and KA tracks are independent
6. **Defer Phase 5 until user feedback** - Nice-to-have features should respond to real usage
7. **Each spec = 1 PR** - Keep changes atomic and reviewable
8. **Update this doc** - Mark specs complete as they ship

---

**Document Version:** 1.0
**Created:** 2025-11-09
**Status:** Active Spec Tracker
**Next Review:** After each phase completion
