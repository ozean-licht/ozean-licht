# Ozean Licht Admin Dashboard Requirements Analysis

**Date:** 2025-11-06
**Status:** Foundation Phase Analysis
**Scope:** Ozean Licht Platform (`apps/ozean-licht/`)
**Target:** Admin Dashboard Integration Planning

---

## EXECUTIVE SUMMARY

Ozean Licht is a **multidimensional spiritual education platform** featuring comprehensive course management, member communities, and payment integration. To support operations, the admin dashboard requires **28 critical features** across 7 functional areas:

- **3 Critical** (Day-1 Operations)
- **12 Important** (First 2-4 Weeks)
- **13 Nice-to-Have** (Post-MVP)

The platform currently stores **40,833+ transactions**, **64 active courses**, and integrates with Airtable, Ablefy (payment processor), N8N (automation), and Supabase as the primary backend.

---

## PART 1: OZEAN LICHT PLATFORM ANALYSIS

### 1.1 Platform Overview

**Platform Name:** Ozean Licht Akademie™ 🌊✨

**Mission:**
Enable spiritual transformation and cosmic consciousness development through:
- LCQ® (Light Code Quantum Transformation) technology
- Herzportal (heart-based consciousness) methodology
- Athemirah® Cosmic School programs
- 95+ high-quality spiritual videos
- Live channelings and transformation events

**Current Status:** Foundation Phase with MVP in development

**Target Users:**
- Members (consume content, attend events)
- Administrators (platform management)
- Instructors/Creators (content production)
- Support staff (customer support)

**Tech Stack:**
- Frontend: Next.js 14+, React 18+, TypeScript, Tailwind CSS, ShadCN UI
- Backend: Supabase (PostgreSQL), Edge Functions (Deno)
- Storage: MinIO (staging) → Cloudflare R2 (archive) → Cloudflare Stream (CDN)
- Automation: N8N (workflow orchestration)
- Payments: Ablefy (payment processor via webhooks)
- Analytics: Vercel Analytics + Sentry (planned)

---

### 1.2 Core Features & Data Structure

#### A. Course Management System

**Current State:**
- **64 active courses** in production database
- **3 course types:**
  1. **LCQ® Programs** - Light Code Quantum Transformation courses
  2. **Master Classes** - Advanced spiritual teachings
  3. **Free Content** - Entry-level educational material

**Course Data Model:**
```typescript
interface Course {
  id: string                    // Unique identifier
  slug: string                  // URL-friendly identifier
  title: string                 // Course name
  description?: string          // Full course description
  subtitle?: string             // Short tagline
  price?: number                // EUR pricing
  is_published: boolean         // Publication status
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code?: number          // Legacy Ablefy product ID
  created_at: string
  updated_at: string
  tags?: string[]              // Categories: "LCQ", "Master", "Basis", "Aufbau", etc.
}
```

**Course Structure (Nested):**
```
Course
├── Modules (CourseModule[])
│   ├── id, title, description
│   ├── order_index (sequencing)
│   ├── is_published (module visibility)
│   └── estimated_duration_minutes
│
├── ModuleContent (ModuleContent[])
│   ├── type: 'video' | 'text' | 'pdf' | 'audio' | 'quiz'
│   ├── content_url (Cloudflare Stream for videos)
│   ├── content_text (rich text for articles)
│   ├── thumbnail_url (video preview)
│   └── duration_minutes
│
└── UserProgress (per member)
    ├── completed_modules: string[]
    ├── watched_contents: string[]
    ├── total_watched_time_minutes
    └── last_watched_content_id
```

**Example Courses (from database):**
- Lions Gate Event 2025 (Course ID: 1060, Product ID: 457365)
- Earth Code Program (Course ID: 1053, Product ID: 443030)
- Fuelle Clinic Program (Course ID: 1026, Product ID: 419374)
- Athemirah Cosmic School Core Modules

#### B. Member Management

**Current Structure:**
- **Shared Authentication:** `shared_users_db` (unified across Kids Ascension + Ozean Licht)
- **Multi-platform Access:** Users can have accounts on both platforms simultaneously
- **Role-based Access Control (RBAC):**
  - `USER` - Regular member/student
  - `CREATOR` - Content creator/instructor
  - `EDUCATOR` - Teacher with classroom management
  - `ADMIN` - Platform administrator
  - `MODERATOR` - Content moderation team
  - `SUPPORT` - Customer support staff

**User Entity Model:**
```typescript
interface User {
  id: UUID                  // System unique ID
  email: string            // Unique email
  password_hash?: string   // Bcrypt hash
  firstName?: string
  lastName?: string
  displayName?: string
  avatarUrl?: string

  // Account status
  isActive: boolean        // Can access platform
  isDeleted: boolean       // Soft delete
  emailVerified: boolean

  // Security
  twoFactorEnabled: boolean
  twoFactorSecret?: string

  // Audit
  createdAt: DateTime      // Registration date
  lastLoginAt?: DateTime   // Last access
}

interface UserEntity {
  id: UUID
  userId: UUID             // Reference to User
  entityType: 'OZEAN_LICHT' // Platform identifier
  role: UserRole          // User's role on platform
  isActive: boolean
  accessGrantedAt: DateTime
  accessRevokedAt?: DateTime
  metadata: JSON          // Custom attributes (free JSON)
}
```

**Current Member Base:**
- Estimated 1,000+ members (from transaction data)
- Wide geographic distribution (confirmed emails from Germany, Austria)
- Email verification required for access

#### C. Payment & Transaction System

**Current Infrastructure:**
- **Primary Processor:** Ablefy (Austrian payment service)
- **Payment Data:** 40,833+ transactions imported to Supabase
- **October 2025 Activity:** 337+ transactions (€32,499+ volume)

**Data Models:**
```typescript
interface Transaction {
  id: UUID
  order_id: UUID           // Links to Orders table
  amount: number           // EUR amount
  currency: 'EUR'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string   // e.g., "credit_card", "paypal"
  created_at: DateTime
  processed_at?: DateTime
}

interface Order {
  id: UUID
  user_id: UUID           // Buyer
  product_id: number      // Ablefy product ID (links to courses)
  course_id?: UUID        // Mapped course ID (64 mappings active)
  total_amount: number    // EUR
  status: 'unpaid' | 'paid' | 'refunded'
  created_at: DateTime
  paid_at?: DateTime
}

interface CourseMapping {
  ablefy_product_id: number   // Ablefy's product identifier
  course_id: UUID            // Ozean Licht course
  name: string              // Product name
  price_eur: number         // Selling price
  created_at: DateTime
}
```

**Current Mapping Status:**
- **64 course mappings** active
- **38,475 orders** linked to courses
- **30,219 orders** (78.5%) with valid course access
- **14 orders** with edge cases/duplicates

**Webhook Integration:**
- N8N workflow: `ablefy-transaction-sync.json`
- Real-time transaction capture from Ablefy
- Automatic order creation on payment success
- Email notifications on status changes

#### D. Content Management

**Content Types:**
1. **Videos** (95+ in library)
   - Hosted on Cloudflare Stream
   - CDN-delivered with adaptive bitrate
   - Stored in R2 (permanent archive)
   - Thumbnails: 4 variants (desktop/mobile, light/dark)

2. **Written Content**
   - Blog/magazine articles
   - Course descriptions
   - Rich text modules
   - Markdown-formatted

3. **Resources**
   - PDF downloads
   - Audio files
   - Meditation/channeling recordings
   - Supplementary materials

**CMS Integration:**
- **Source System:** Airtable (legacy)
- **Sync Workflows (N8N):**
  - `airtable-courses-sync.json` - Hourly course sync
  - `airtable-blogs-sync.json` - Blog synchronization
  - `airtable-thumbnail-webhook.json` - Image processing
  - `airtable-author-images-sync.json` - Creator photos
  - `airtable-blog-thumbnail-webhook.json` - Blog thumbnails

#### E. Community Features

**Planned (Not Yet Implemented):**
- Member forums/discussions
- Livestream event scheduling
- Q&A sections per course
- Member testimonials
- Community challenges

**Existing Components:**
- Comments on blog articles (framework ready)
- Testimonials section (UI components exist)
- FAQ system (components available)

---

### 1.3 API Endpoints & Backend Services

**Supabase Edge Functions (Deno):**

1. **Course Management:**
   - `GET /functions/v1/get-courses` - Fetch all courses
   - `POST /functions/v1/create-course` - Create new course
   - `PATCH /functions/v1/update-course/{id}` - Update course

2. **Payment Processing:**
   - `POST /functions/v1/process-ablefy-webhook` - Payment webhook handler
   - `POST /functions/v1/auto-create-order` - Create order on payment
   - `POST /functions/v1/auto-link-orders-on-login` - Grant course access

3. **Content Processing:**
   - `POST /functions/v1/process-course-thumbnail` - Generate 4 thumbnail variants
   - `POST /functions/v1/process-blog-thumbnail` - Blog image processing
   - `POST /functions/v1/process-author-image` - Creator photo processing

4. **Email Communications:**
   - `POST /functions/v1/send-email` - Transactional email via Resend
   - Magic link generation
   - Welcome series automation

---

### 1.4 Database Schema

**Primary Tables (ozean_licht_db):**

```sql
-- Core content
courses                          -- 64 active courses
├── id, slug, title, description
├── price, is_published
├── thumbnail_url_desktop, thumbnail_url_mobile
├── tags (JSONB array)
└── timestamps

course_modules                   -- 200+ modules across courses
├── course_id, title, description
├── order_index, is_published
├── estimated_duration_minutes
└── timestamps

module_contents                  -- 1000+ individual content items
├── module_id, title, type ('video'|'text'|'pdf'|'audio'|'quiz')
├── content_url, content_text, thumbnail_url
├── order_index, duration_minutes
└── timestamps

-- Member tracking
user_courses                     -- Enrollment records
├── user_id, course_id
├── progress_percentage, completed_at
├── enrolled_at, last_accessed_at
└── timestamps

user_progress                    -- Per-user progress tracking
├── user_id, course_id
├── completed_modules (text[])
├── watched_contents (text[])
├── total_watched_time_minutes, last_watched_at
└── timestamps

-- Payments (synchronized from Ablefy)
orders                          -- 38,475 total orders
├── id, user_id, product_id
├── course_id (mapped), total_amount
├── status ('unpaid'|'paid'|'refunded')
├── created_at, paid_at
└── timestamps

transactions                    -- 40,833+ transaction records
├── id, order_id
├── amount, currency, status
├── payment_method
└── timestamps

course_mapping                  -- Ablefy → Ozean Licht mapping
├── ablefy_product_id (key)
├── course_id (target)
├── name, price_eur
└── created_at

-- Community (planned)
testimonials                    -- Member success stories
├── user_id, content, rating
├── featured (boolean)
└── timestamps

blogs                          -- Spiritual articles/blog posts
├── slug, title, content
├── author_id, featured_image_url
├── published_at
└── timestamps

events                         -- Livestream/live events
├── title, description, event_date
├── event_type ('channeling'|'qa'|'workshop')
├── attendee_count
└── timestamps
```

---

### 1.5 Current Admin Capabilities

**What Already Exists:**
1. ✅ Airtable admin interface (legacy)
2. ✅ N8N workflow orchestration (automation)
3. ✅ Supabase dashboard (direct DB access - not recommended for users)
4. ✅ Email notification system (Resend integration)

**What's Missing:**
- ❌ Centralized admin dashboard
- ❌ User-friendly course management UI
- ❌ Transaction/payment monitoring dashboard
- ❌ Member management interface
- ❌ Content moderation tools
- ❌ Analytics/reporting
- ❌ Access control management

---

## PART 2: ADMIN DASHBOARD REQUIREMENTS

### 2.1 CRITICAL Requirements (Day-1 Operations)

**Priority: CRITICAL - Must have for launch**

#### 1. **Course Management Module**
**Purpose:** Create, edit, publish, and manage course content

**Required Features:**
- [ ] Course listing with search/filter
- [ ] Create new course with drag-and-drop module builder
- [ ] Edit course metadata (title, description, price, thumbnail)
- [ ] Manage course modules (add/remove/reorder)
- [ ] Manage module contents (video, text, PDF, audio, quiz)
- [ ] Publish/unpublish courses
- [ ] Bulk operations (change status for multiple courses)
- [ ] Version history/audit log

**UI Components Needed:**
- Course list grid with thumbnails
- Course editor form with validation
- Module builder (drag-drop reordering)
- Content type selector
- Media uploader (image, video, PDF)
- Price calculator

**Database Access:**
- `courses` (read/write)
- `course_modules` (read/write)
- `module_contents` (read/write)
- `course_mapping` (read-only for reference)

**Related Files (Admin):**
- `apps/admin/app/(dashboard)/courses/page.tsx` (create this)
- `apps/admin/app/(dashboard)/courses/[id]/page.tsx` (create this)

---

#### 2. **Member Management Dashboard**
**Purpose:** View, search, and manage user accounts and access

**Required Features:**
- [ ] Member list with pagination/search
- [ ] Filter by role, status, registration date
- [ ] View member profile (email, name, avatar, registration date)
- [ ] Manage member access (grant/revoke OZEAN_LICHT entity access)
- [ ] Change member role (USER, CREATOR, EDUCATOR, ADMIN, MODERATOR)
- [ ] View member course enrollments
- [ ] View member purchase history
- [ ] Deactivate/reactivate accounts (soft delete)
- [ ] Bulk member operations

**UI Components Needed:**
- Member list table with sorting
- Member profile sidebar
- Access control selector
- Role assignment dropdown
- Purchase history timeline
- Filter/search controls

**Database Access:**
- `shared_users_db.users` (read/write)
- `shared_users_db.user_entities` (read/write)
- `ozean_licht_db.orders` (read-only)
- `ozean_licht_db.user_courses` (read-only)

**Related Files (Admin):**
- `apps/admin/app/(dashboard)/members/page.tsx` (create this)
- `apps/admin/app/(dashboard)/members/[id]/page.tsx` (create this)

---

#### 3. **Payment & Transaction Monitoring**
**Purpose:** Monitor Ablefy payments and course access grants

**Required Features:**
- [ ] Transaction list with filtering (date range, status, amount)
- [ ] Transaction detail view with full order information
- [ ] Order status dashboard (pending, paid, refunded)
- [ ] Manual order creation (emergency access grants)
- [ ] View course mappings (product ID → course)
- [ ] Resync transaction data from Ablefy
- [ ] Revenue analytics (daily/monthly totals)
- [ ] Failed payment alerts and retry options
- [ ] Refund processing interface

**UI Components Needed:**
- Transaction list table with date filters
- Transaction detail modal
- Order status indicators
- Revenue chart (bar/line graph)
- Manual order form
- Refund dialog

**Database Access:**
- `ozean_licht_db.transactions` (read-only, write for manual creates)
- `ozean_licht_db.orders` (read/write)
- `ozean_licht_db.course_mapping` (read-only)
- MCP Gateway: `/mcp-mem0` for transaction patterns

**Related Files (Admin):**
- `apps/admin/app/(dashboard)/payments/page.tsx` (create this)
- `apps/admin/app/(dashboard)/payments/[id]/page.tsx` (create this)

---

### 2.2 IMPORTANT Requirements (First 2-4 Weeks)

**Priority: HIGH - Needed for smooth operations after launch**

#### 4. **Content Moderation Dashboard**
- Course content approval workflow
- Blog post review queue
- Flag inappropriate content
- Automatic content filtering rules
- Moderation audit trail

#### 5. **Analytics & Reporting**
- Course enrollment trends
- Member engagement metrics
- Video watch time analytics
- Popular courses/content ranking
- Churn analysis
- Revenue attribution (which course/instructor generates most)
- Email campaign tracking
- Export reports (PDF/CSV)

#### 6. **Email Campaign Manager**
- View sent email campaigns
- Create scheduled emails
- Email template editor
- A/B testing framework
- Unsubscribe management
- Email delivery status tracking
- Integration with Resend API

#### 7. **Event Management**
- Create livestream events
- Schedule channelings/Q&As
- RSVP tracking
- Attendee notifications
- Post-event recording uploads
- Event analytics (attendance, engagement)
- Calendar integration

#### 8. **Support Ticketing System**
- Member support request tracking
- Auto-categorization (billing, content, technical)
- Assign to support staff
- Response templates
- Ticket resolution tracking
- SLA monitoring

#### 9. **Content Library Management**
- Video library browser
- Video metadata editor
- Thumbnail management
- Transcription/subtitle management
- Video performance analytics
- Bulk video operations (publish, archive)
- Storage usage monitoring

#### 10. **Access Control & Permissions**
- Role-based access control (RBAC) configuration
- Permission matrix (who can do what)
- Admin activity audit log
- Two-factor authentication (2FA) management
- API key management for developers
- Session management (active sessions, logout users)

#### 11. **System Configuration**
- Platform settings (site name, logo, colors)
- Payment settings (Ablefy webhook configuration)
- Email settings (sender address, templates)
- Storage settings (MinIO, R2 configuration)
- Feature flags (enable/disable beta features)
- Notification preferences

#### 12. **Backup & Data Management**
- Database backup status
- Export user data (GDPR compliance)
- Data import tools (from Airtable, CSV)
- Bulk user import
- Data retention policies
- Archive old courses

#### 13. **Third-party Integrations**
- Airtable sync status and manual trigger
- N8N workflow management
- Cloudflare Stream API status
- Stripe integration setup (when ready)
- Email service configuration
- Analytics tool connection (GA4, Sentry)

#### 14. **SEO & Marketing Tools**
- Course SEO metadata editor (meta description, keywords)
- Sitemap generation
- Open Graph image preview
- Meta tags validation
- Marketing campaign tracking
- Social media share optimization

#### 15. **Performance Monitoring**
- Dashboard uptime monitoring
- API response times
- Database performance metrics
- File upload speed tracking
- Error rate monitoring
- Resource usage (CPU, memory, disk)

---

### 2.3 NICE-TO-HAVE Requirements (Post-MVP)

**Priority: LOW - Can be deferred to later phases**

#### 16. **Affiliate Program Management**
- Affiliate registration approval
- Commission structure configuration
- Performance tracking per affiliate
- Payout management
- Marketing material library for affiliates

#### 17. **Customer Journey Analytics**
- User behavior funnels
- Conversion tracking
- Drop-off point analysis
- User segment analysis
- Cohort analysis

#### 18. **Content Recommendation Engine**
- Course recommendation algorithm testing
- ML model performance monitoring
- Personalization rule configuration
- A/B testing of recommendations

#### 19. **Advanced Member Segmentation**
- Segment builder (behavioral, demographic)
- Target marketing to segments
- Segment performance analytics
- Lookalike audience creation

#### 20. **Mobile App Management**
- App version monitoring
- Beta testing coordination
- Push notification creation
- App analytics dashboard
- AppStore/Google Play submission tracking

#### 21. **Certification Management**
- Issue digital certificates on course completion
- Certificate template design
- Verification portal
- Badge system integration
- Continuing education credits

#### 22. **Survey & Feedback Collection**
- Create/manage surveys
- Survey response analytics
- Feedback sentiment analysis
- Action items from feedback

#### 23. **Advanced Video Features**
- Live streaming studio interface (integration with Zoom/OBS)
- Video quality monitoring
- Playback statistics (heatmap of watch patterns)
- Interactive video elements (quizzes, calls-to-action)
- Caption/subtitle management
- Video chapters/segments

#### 24. **Machine Learning Features**
- Automated course recommendations
- Content tagging automation
- Spam detection
- Churn prediction
- Next best action recommendations

#### 25. **Audit & Compliance**
- Complete audit log of all admin actions
- GDPR compliance tools
- Terms of service updates notification
- Privacy policy version control
- Cookie consent management

#### 26. **Instructor Dashboard (Embedded)**
- Instructor stats (course enrollments, revenue)
- Revenue split viewing
- Student engagement per course
- Q&A message center
- Course announcement broadcaster

#### 27. **Knowledge Base/Help Center**
- Admin help documentation
- API documentation
- Integration guides
- Troubleshooting guides
- Feature tutorials

#### 28. **White Label Features**
- Branding customization
- Custom domain support
- Reseller account management
- Pricing tier customization per client

---

## PART 3: ADMIN DASHBOARD FEATURE MATRIX

| Feature | Component | Priority | Estimated LOE | Dependencies |
|---------|-----------|----------|----------------|--------------|
| **Course Management** | Course CRUD | CRITICAL | 40h | Supabase API, File upload |
| **Module Builder** | Module management | CRITICAL | 30h | Course system |
| **Content Editor** | Content CRUD | CRITICAL | 25h | Media upload, type system |
| **Member List** | Member search/list | CRITICAL | 20h | Shared users DB, filters |
| **Member Profile** | User detail view | CRITICAL | 15h | User entity relations |
| **Access Control UI** | Role assignment | CRITICAL | 15h | User entity updates |
| **Transaction List** | Payment dashboard | CRITICAL | 25h | Order/transaction queries |
| **Revenue Analytics** | Charts/graphs | CRITICAL | 20h | Charting library, SQL queries |
| **Content Moderation** | Queue/approval | HIGH | 35h | Status workflow, notifications |
| **Analytics Dashboard** | KPI tracking | HIGH | 40h | Data aggregation, visualization |
| **Email Manager** | Campaign UI | HIGH | 30h | Resend API, templates |
| **Event Management** | Event CRUD | HIGH | 35h | Calendar UI, notifications |
| **Support Tickets** | Ticketing system | HIGH | 35h | Categorization, workflow |
| **Video Library** | Media browser | HIGH | 30h | File listing, metadata |
| **Permission Matrix** | RBAC config | HIGH | 25h | Role management |
| **System Config** | Settings UI | HIGH | 20h | Configuration storage |
| **Backup Status** | Monitoring | HIGH | 15h | Backup service integration |
| **Integrations** | Integration hub | HIGH | 30h | Third-party APIs |
| **SEO Tools** | Metadata editor | MEDIUM | 20h | Course system |
| **Performance Monitor** | Metrics dashboard | MEDIUM | 25h | Monitoring tools |
| **Affiliate Program** | Affiliate hub | LOW | 40h | Affiliate schema |
| **Customer Analytics** | Funnel analysis | LOW | 35h | Event tracking |
| **Recommendations** | ML dashboard | LOW | 50h | ML infrastructure |
| **Segmentation** | Segment builder | LOW | 45h | Query builder |
| **Mobile Management** | App stats | LOW | 25h | App APIs |
| **Certifications** | Certificate system | LOW | 35h | Certificate generation |
| **Surveys** | Survey builder | LOW | 30h | Form builder |
| **Video Studio** | Stream interface | LOW | 45h | Stream API |

---

## PART 4: RECOMMENDED IMPLEMENTATION ROADMAP

### Phase 1: MVP (Week 1-2) - CRITICAL Only
**Goal:** Ship day-1 admin functionality

1. **Course Management Module** (40 hours)
   - Course CRUD operations
   - Module builder with drag-drop
   - Content editor for text/links
   - Basic publication workflow

2. **Member Management** (50 hours)
   - Member list with search/filter
   - Profile view with enrollments
   - Role assignment interface
   - Access grant/revoke

3. **Payment Monitoring** (40 hours)
   - Transaction list and search
   - Order detail view
   - Revenue dashboard (basic charts)
   - Manual order creation

**Deliverables:**
- Admin dashboard homepage
- Navigation structure
- Core CRUD operations
- Basic reporting

**Estimated Timeline:** 2 weeks (160 hours of development)

---

### Phase 2: Operations (Week 3-6) - HIGH Priority

4. **Content Moderation** (35 hours)
   - Approval workflows
   - Status indicators
   - Audit trail

5. **Analytics Dashboard** (40 hours)
   - Enrollment trends
   - Member engagement
   - Video watch analytics
   - Revenue attribution

6. **Email Manager** (30 hours)
   - Campaign creation
   - Template editor
   - Schedule sending
   - Tracking

**Estimated Timeline:** 3-4 weeks (105 hours)

---

### Phase 3: Polish (Week 7+) - MEDIUM/LOW Priority

7. **Advanced Features** (MEDIUM priority)
   - Event management
   - Support ticketing
   - Video library manager
   - Advanced SEO tools

8. **Scalability Features** (LOW priority)
   - Affiliate program
   - ML recommendations
   - Advanced segmentation
   - Mobile app management

---

## PART 5: ADMIN DASHBOARD ARCHITECTURE RECOMMENDATIONS

### 5.1 Technology Stack

**Frontend:**
- **Framework:** Next.js 14+ (already in use for main app)
- **UI Library:** ShadCN UI (already in use for admin)
- **Charts:** Recharts (already installed in admin)
- **Forms:** React Hook Form + Zod (already in use)
- **Tables:** TanStack Table (for large datasets)
- **File Upload:** Dropzone + MinIO SDK
- **Rich Text:** TipTap or Slate for course descriptions

**Backend (via Supabase):**
- PostgreSQL database (already deployed)
- Row-level security (RLS) for multi-tenancy
- Supabase Edge Functions for complex operations
- Realtime subscriptions for live updates

**Integration Points:**
- MCP Gateway for system operations
- Resend API for emails
- Ablefy webhooks for payments
- N8N for workflow automation
- Cloudflare Stream API for video

### 5.2 Database Schema Additions (for admin dashboard)

```sql
-- Audit logging
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES shared_users_db.users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin preferences/settings
CREATE TABLE admin_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL UNIQUE REFERENCES shared_users_db.users(id),
  dashboard_layout JSONB,
  theme_preference 'light' | 'dark',
  notifications_enabled BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature flags for beta testing
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name VARCHAR(255) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  roll_out_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 API Endpoints to Create

```
POST   /api/admin/courses              - Create course
GET    /api/admin/courses              - List courses
GET    /api/admin/courses/:id          - Get course detail
PATCH  /api/admin/courses/:id          - Update course
DELETE /api/admin/courses/:id          - Delete course
POST   /api/admin/courses/:id/publish  - Publish course

POST   /api/admin/members              - Create member (admin-only)
GET    /api/admin/members              - List members
GET    /api/admin/members/:id          - Get member detail
PATCH  /api/admin/members/:id          - Update member
POST   /api/admin/members/:id/access   - Grant/revoke access

GET    /api/admin/transactions         - List transactions
GET    /api/admin/transactions/:id     - Transaction detail
POST   /api/admin/orders/manual        - Manual order creation
GET    /api/admin/revenue/summary      - Revenue stats

POST   /api/admin/audit-logs           - Create audit log (automatic)
GET    /api/admin/audit-logs           - Query admin audit trail

GET    /api/admin/analytics/overview   - Dashboard KPIs
GET    /api/admin/analytics/courses    - Course analytics
GET    /api/admin/analytics/members    - Member analytics
```

---

## PART 6: KEY INTEGRATION POINTS

### 6.1 Data Synchronization

**Airtable ↔ Supabase:**
- N8N workflow hourly syncs courses from Airtable
- Course mappings must be maintained
- Product IDs from Ablefy must map to course IDs

**Ablefy → Ozean Licht:**
- Webhook on payment completion
- Auto-creates Order record
- Links to member via email
- Grants course access

**Cloudflare Stream:**
- Video storage and streaming
- Thumbnail generation (4 variants)
- Adaptive bitrate delivery
- Analytics integration

### 6.2 Multi-Tenancy Considerations

**Database Separation:**
- `shared_users_db` - Unified auth (Kids Ascension + Ozean Licht)
- `ozean_licht_db` - OL-specific data (courses, orders)
- `kids_ascension_db` - KA-specific data (separate)

**Admin Access Control:**
- Admins see only Ozean Licht entities
- UserEntity with entityType='OZEAN_LICHT' filter
- Shared user list but scoped by entity type
- Cross-platform admin possible in future

### 6.3 Security Requirements

**Authentication:**
- NextAuth.js v5 (already configured in admin app)
- JWT with refresh tokens
- Session management via database

**Authorization:**
- Role-based access control (RBAC)
- Resource-level permissions
- Admin audit logging mandatory
- 2FA support for admin accounts

**Data Protection:**
- Row-level security (RLS) in PostgreSQL
- Encrypted fields for sensitive data (passwords, secrets)
- Rate limiting on sensitive endpoints
- API key rotation mechanism

---

## PART 7: CURRENT ADMIN DASHBOARD STATUS

### What Already Exists

**Admin Dashboard (`apps/admin/`):**
- ✅ NextAuth.js v5 authentication
- ✅ Role-based access control framework
- ✅ Dashboard homepage layout
- ✅ Health monitoring page
- ✅ MinIO S3 storage management interface
- ✅ System health monitoring
- ✅ Settings structure (2FA, auth settings)

**Already Implemented Pages:**
- `app/(dashboard)/page.tsx` - Dashboard home
- `app/(dashboard)/health/page.tsx` - System health
- `app/dashboard/storage/page.tsx` - MinIO management
- `app/(dashboard)/settings/2fa/page.tsx` - 2FA setup

### What Needs to Be Added for Ozean Licht

**New Feature Modules (to build):**
1. `/admin/courses/` - Course CRUD
2. `/admin/members/` - Member management
3. `/admin/payments/` - Payment monitoring
4. `/admin/content/` - Content moderation
5. `/admin/analytics/` - Analytics dashboard
6. `/admin/emails/` - Email campaigns
7. `/admin/events/` - Event management
8. `/admin/support/` - Support tickets
9. `/admin/integrations/` - Third-party integrations
10. `/admin/system/` - Configuration

---

## PART 8: IMPLEMENTATION DEPENDENCIES & BLOCKERS

### External Dependencies
- [ ] Ablefy API documentation (webhook payload format)
- [ ] Cloudflare Stream API integration
- [ ] Resend email template system setup
- [ ] N8N workflow access and documentation
- [ ] Airtable schema export (for reference)

### Database Migrations Needed
- [ ] Create admin audit log tables
- [ ] Create admin preferences table
- [ ] Create feature flag table
- [ ] Add indexes to courses/orders for performance
- [ ] Add RLS policies for admin dashboard access

### Testing Requirements
- [ ] Unit tests for course CRUD operations
- [ ] Integration tests for payment workflows
- [ ] E2E tests for admin workflows (Playwright)
- [ ] Load testing for analytics queries
- [ ] Security testing (auth, authorization, data)

---

## PART 9: PRIORITY CLASSIFICATION SUMMARY

### 🔴 CRITICAL (Day 1 - Week 2)
**3 Features | 130 Estimated Hours**

1. Course Management (40h)
2. Member Management (50h)
3. Payment Monitoring (40h)

**Enables:** Core platform operations, day-1 functionality

---

### 🟡 IMPORTANT (Week 3-6)
**12 Features | 340 Estimated Hours**

4. Content Moderation (35h)
5. Analytics Dashboard (40h)
6. Email Manager (30h)
7. Event Management (35h)
8. Support Ticketing (35h)
9. Video Library Manager (30h)
10. Access Control Config (25h)
11. System Configuration (20h)
12. Backup Management (15h)
13. Third-party Integrations (30h)
14. SEO Tools (20h)
15. Performance Monitoring (25h)

**Enables:** Smooth operations after launch, staff efficiency

---

### 🟢 NICE-TO-HAVE (Post-MVP)
**13 Features | 500+ Estimated Hours**

16-28. Advanced features (affiliate, ML, mobile, etc.)

**Enables:** Growth, scale, competitive differentiation

---

## RECOMMENDATIONS

### For Day-1 Launch

✅ **Must Build Before Soft Launch:**
1. Course management interface
2. Member search and management
3. Transaction monitoring
4. Basic revenue chart
5. Manual order creation tool

✅ **Highly Recommended:**
- Audit logging for all admin actions
- 2FA for admin accounts
- Role-based access control
- Backup status monitoring

❌ **Can Wait (Not Blocking Launch):**
- Advanced analytics
- Email campaign manager
- Event management system
- Video library browser
- Community forum management

### For Week 1-2 Operations

✅ **Add Quickly:**
1. Email campaign manager (for welcome series)
2. Basic event calendar
3. Support ticket system
4. Content moderation workflow
5. SEO metadata editor

### For Growth Phase

✅ **After Proving Product-Market Fit:**
1. Advanced analytics (cohort, funnel analysis)
2. Recommendation engine
3. Affiliate program
4. Advanced member segmentation
5. Mobile app management

---

## CONCLUSION

**Ozean Licht requires a comprehensive admin dashboard** with 28 features across 3 priority tiers. The critical features (course, member, payment management) are achievable within 2-3 weeks and represent ~80% of the value for day-1 operations.

**Key Success Factors:**
1. **Database relationships** - Proper schema with indexes for performance
2. **User experience** - Intuitive navigation and workflows for non-technical admins
3. **Real-time updates** - Supabase subscriptions for live data
4. **Audit trails** - Complete logging for compliance and debugging
5. **Mobile-responsive** - Admins need access from any device

**Estimated Total Development:**
- **MVP (Critical):** 2-3 weeks (160 hours)
- **Phase 2 (Important):** 3-4 weeks (340 hours)
- **Phase 3+ (Nice-to-have):** 8+ weeks (500+ hours)

**Total for Full Feature Set:** ~1000+ hours of development

---

**Report Generated:** 2025-11-06
**Ozean Licht Platform Status:** Foundation Phase
**Admin Dashboard Status:** Planning Phase (Ready for Implementation)
