# Kids Ascension Admin Dashboard Requirements Report

**Report Date:** November 8, 2025
**Status:** Foundation Phase - Monorepo Migration
**Report Type:** Comprehensive Admin Requirements Analysis

---

## EXECUTIVE SUMMARY

Kids Ascension is a non-profit educational platform for children (ages 6-14) providing 100% free, lifetime access to teacher-quality learning content. The app requires a comprehensive admin dashboard to manage:

1. **Content Management** - Videos, courses, lessons, and meditations
2. **User Management** - Students, parents, educators, creators, and moderators
3. **Moderation & Review** - Content review workflow, harm ranking, reviewer management
4. **Operations** - Classrooms, school partnerships, user activity monitoring
5. **Business Model** - Angel donor tracking, creator attribution, financial reporting
6. **Safety & Governance** - Parental controls, access revocation, audit logging

A **hybrid admin approach** is needed: Ecosystem-level admin dashboard (central) handles cross-platform operations, while Kids Ascension-specific admin handles KA content and user management.

---

## PART 1: KIDS ASCENSION APP STRUCTURE ANALYSIS

### 1.1 Current Architecture

#### Frontend Application (`/apps/kids-ascension/frontend/`)
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Not yet implemented (planned)
- **Status**: Active development phase, components/auth structure initialized

#### Current Directory Structure
```
kids-ascension/
├── frontend/
│   ├── app/
│   │   ├── api/auth/           # Authentication API routes
│   │   └── (other layouts)     # To be built
│   ├── components/
│   │   ├── auth/               # Auth-related components
│   │   ├── marketing/          # Landing page components
│   │   ├── shared/             # Shared UI components
│   │   ├── video/              # Video player components
│   │   └── ui/                 # Base UI components (shadcn)
│   ├── lib/
│   │   ├── api/                # API client utilities
│   │   ├── auth/               # Authentication logic
│   │   ├── hooks/              # Custom React hooks
│   │   ├── constants/          # App constants
│   │   ├── validation/         # Form validation schemas
│   │   └── utils/              # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── contexts/               # React contexts (auth context)
│   └── prisma/                 # Database client config
├── backend/                    # (Planned) Node.js backend
├── shared/                     # (Planned) Shared code
├── docs/                       # Product & feature documentation
├── app_docs/                   # Feature documentation
├── specs/                      # Implementation specifications
└── kids-ascension_OLD/         # Migrated from monorepo (contains reference admin)
```

#### Legacy Admin Application (Reference)
The old Kids Ascension admin (`kids-ascension_OLD/kids-ascension-admin/`) provides valuable reference:
- **Pages**: Users, Courses, Lessons, Classrooms, Meditations, Activity, Marketplace, Schools, Media, Video Upload, Review
- **Status**: Being consolidated into ecosystem admin

### 1.2 Core Features & User Roles

#### User Personas & Roles
1. **Students (6-14 years old)**
   - Guest Mode (unaccompanied) or Parent-created accounts
   - Watch videos, earn achievements, submit ideas
   - View activity heatmap, streaks, learning portfolio

2. **Parents/Guardians**
   - Create child accounts and parent-only account
   - Preview content before child access
   - Monitor learning dashboard (stats, engagement, topics)
   - Export learning portfolio as PDF
   - Set content category restrictions
   - Approve/deny teacher homework
   - Control usage thresholds

3. **Educators (Classroom Teachers)**
   - Manage class rosters and assign students
   - Upload private classroom content
   - Assign homework with completion tracking
   - View student accountability (who watched what)
   - Recommend content from creator library
   - Monitor inactive students

4. **Content Creators (Public Teachers)**
   - Upload videos and organize into playlists/courses
   - Access creator portfolio and credentials
   - Receive review feedback with timestamps
   - Retain full content rights (delete capability with 2FA)
   - Collaborate on content with other creators
   - Earn Trusted Creator Badge
   - Monitor impact via angel donations

5. **Content Reviewers (Pädagogen)**
   - Subject-matter expert review (Biology prof reviews biology only)
   - AI pre-screening with Whisper transcription
   - Harm ranking (harmless → harmful spectrum)
   - Choose full video or transcription review mode
   - Collaborate via discussion boards
   - Collective approval threshold voting
   - Provide direct creator feedback (timestamp-specific)
   - Revision & resubmit workflow
   - Judge Board escalation

6. **Platform Admins & Moderators**
   - Full platform control
   - User management (create, suspend, delete)
   - Content moderation and rejection
   - Reviewer management
   - Audit logging access
   - System health monitoring

7. **Angels (Donors)**
   - Track impact on children
   - Recurring donation management
   - Named or anonymous recognition
   - Donation history and impact reporting

### 1.3 Core Data Models & Entities

#### Authentication Models (Shared DB - `shared_users_db`)
```typescript
User {
  id: UUID
  email: string (unique)
  passwordHash?: string
  firstName?, lastName?, displayName?
  avatarUrl?: string
  isActive: boolean
  isDeleted: boolean (soft delete)
  emailVerified: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  createdAt: DateTime
  updatedAt: DateTime
  lastLoginAt?: DateTime

  // Relations
  userEntities: UserEntity[]  // Multi-tenant access
  sessions: Session[]
  oauthAccounts: OAuthAccount[]
}

UserEntity {
  id: UUID
  userId: UUID
  entityType: KIDS_ASCENSION | OZEAN_LICHT
  role: USER | CREATOR | EDUCATOR | ADMIN | MODERATOR | SUPPORT
  isActive: boolean
  accessGrantedAt: DateTime
  accessRevokedAt?: DateTime
  metadata: JSON  // Store additional role-specific info
}

Session {
  id: UUID
  userId: UUID
  sessionToken: string (unique)
  ipAddress?: string (Inet)
  userAgent?: string
  deviceInfo?: JSON
  expiresAt: DateTime
  lastActivityAt: DateTime
}
```

#### Kids Ascension-Specific Models (Expected in `kids_ascension_db`)
Based on PRD and old admin reference:
- **VideoIdea** - User-submitted video requests from marketplace
- **UserProfile** - Child, parent, educator, creator profiles
- **Video** - Video content with metadata
- **Course** - Course container for videos
- **Lesson** - Individual lesson content
- **Meditation** - Meditation content
- **UserAchievement** - Gamification progress (badges, streaks)
- **Classroom** - Teacher classroom management
- **ClassroomStudent** - Student enrollment
- **Homework** - Teacher-assigned homework
- **VideoReview** - Content review workflow
- **CreatorProfile** - Creator credentials and portfolio
- **AngelDonation** - Donor tracking and recognition
- **AuditLog** - Admin action tracking
- **UserActivity** - Watch history, engagement tracking

### 1.4 Feature Set

#### Content Management
- ✅ Video upload and management (via MinIO → Cloudflare Stream)
- ✅ Course and lesson organization
- ✅ Meditation content management
- ⚠️ Idea marketplace for user-submitted video ideas
- ⚠️ Creator collaboration on content

#### User Management
- ✅ Multi-role user accounts (Student, Parent, Educator, Creator, Admin)
- ✅ Account creation and activation
- ✅ Email verification
- ✅ Two-factor authentication support
- ✅ Session management
- ⚠️ Parent-child account linking
- ⚠️ Educator-student classroom management

#### Classroom Features
- ✅ Class roster management
- ✅ Homework assignment with tracking
- �� Student accountability (watch history)
- ⚬ Content recommendation system

#### Moderation & Review
- ✅ Content review workflow
- ⚠️ Harm ranking algorithm (AI pre-screening)
- ⚠️ Multi-reviewer collaboration
- ⚠️ Judge Board escalation

#### Gamification & Engagement
- ✅ Achievement tracking
- ⚬ Streak system
- ⚬ Activity heatmap
- ⚬ Progress dashboard

#### Reporting & Analytics
- ⚬ User engagement analytics
- ⚬ Content performance metrics
- ⚬ Creator impact tracking
- ⚬ Angel donation reporting

**Legend:** ✅ = Likely Implemented | ⚠️ = Partial/Planned | ⚬ = Not Yet Implemented

### 1.5 API Endpoints (Reference from Old Structure)

```
POST   /api/auth/*                   # Authentication endpoints
POST   /api/demo-register            # Demo account creation
POST   /api/creators/submit-topic    # Creator topic submission
POST   /api/schools/register         # School partnership registration
POST   /api/newsletter               # Newsletter subscription
POST   /api/legal                    # Legal/compliance
POST   /api/cron/usage-threshold-check  # Parent usage monitoring
POST   /api/cron/send-daily-digest   # Daily digest emails
```

---

## PART 2: ADMIN DASHBOARD REQUIREMENTS

### 2.1 Ecosystem Admin Dashboard (Central - `apps/admin/`)

**Location:** `/opt/ozean-licht-ecosystem/apps/admin/`

#### Current Status
- ✅ Authentication (NextAuth v5)
- ✅ Role-based access control
- ✅ Audit logging framework
- ✅ Health monitoring
- ✅ Storage management (MinIO)
- ⚠️ Basic dashboard structure

#### Current Pages
```
/dashboard/
├── page.tsx                 # Home dashboard
├── health/
│   ├── page.tsx            # System health monitoring
│   └── actions.ts          # Health check actions
├── storage/
│   └── page.tsx            # MinIO storage management
└── settings/
    └── 2fa/
        └── page.tsx        # 2FA setup (placeholder)
```

#### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth v5 with database sessions
- **Database Access**: MCP Gateway client (PostgreSQL via RPC)
- **UI**: Tailwind CSS + shadcn/ui
- **Session Storage**: PostgreSQL (admin_sessions table)

### 2.2 Required Admin Functionality for Kids Ascension

#### A. SUPER ADMIN OPERATIONS (Central Dashboard)

**User Management Across Platforms**
- [ ] List all users with filters (email, role, status, platform, created date)
- [ ] Create/edit/delete user accounts
- [ ] Bulk user operations (export, suspend, delete)
- [ ] User status management (active/inactive/deleted)
- [ ] Two-factor authentication (force reset, view status)
- [ ] Session management (view active sessions, force logout)
- [ ] Audit log viewer (who did what, when, from where)
- [ ] Access grant/revoke for specific platforms
- [ ] Role assignment and permission management

**Platform Configuration**
- [ ] Feature flags and toggles
- [ ] Email configuration (SMTP settings, templates)
- [ ] Authentication settings (session duration, password policy)
- [ ] Rate limiting configuration
- [ ] API key management
- [ ] OAuth provider setup (Google, GitHub, etc.)

**System Health & Monitoring**
- [ ] ✅ Database connection status
- [ ] ✅ Service health check (MCP Gateway, MinIO, Cloudflare)
- [ ] Uptime tracking
- [ ] Performance metrics (response times, error rates)
- [ ] Log viewing and search
- [ ] Alert configuration

#### B. KIDS ASCENSION ADMIN OPERATIONS (KA-Specific Dashboard)

**Content Management**
- [ ] Video CRUD operations
  - [ ] Upload new videos with metadata (title, description, age range, subject)
  - [ ] Edit video metadata and thumbnail
  - [ ] Delete videos (soft delete)
  - [ ] Bulk operations (tag, categorize, publish)
  - [ ] Search and filter (title, creator, status, subject)
  - [ ] View video analytics (views, engagement, completion rate)

- [ ] Course Management
  - [ ] Create/edit/delete courses
  - [ ] Organize videos into courses
  - [ ] Set course prerequisites
  - [ ] View course enrollment statistics
  - [ ] Manage course access (public/private)

- [ ] Lesson Management
  - [ ] Create/edit/delete lessons
  - [ ] Organize videos into lessons
  - [ ] Set learning objectives
  - [ ] View lesson completion rates

- [ ] Meditation Content
  - [ ] Manage meditation recordings
  - [ ] Categorize by type (breathing, mindfulness, etc.)
  - [ ] Set age appropriateness
  - [ ] Track usage statistics

**Content Review & Moderation**
- [ ] Content Review Queue
  - [ ] View pending content submissions
  - [ ] Assign to reviewers (subject-matter experts)
  - [ ] Track review status
  - [ ] View AI pre-screening results (Whisper transcription)
  - [ ] Display harm ranking scores

- [ ] Review Workflow
  - [ ] Reviewer collaboration tools
  - [ ] Multi-reviewer approval voting
  - [ ] Timestamp-specific feedback to creators
  - [ ] Revision & resubmit tracking
  - [ ] Judge Board escalation for disputes
  - [ ] Reviewer reputation system

- [ ] Creator Feedback
  - [ ] Send timestamped feedback to creators
  - [ ] Track creator response/revisions
  - [ ] Approved content publication
  - [ ] Rejection with clear reasoning

**User Management (KA-Specific)**
- [ ] Student Accounts
  - [ ] View active students
  - [ ] Monitor student progress and engagement
  - [ ] View watch history
  - [ ] Manage achievements and badges
  - [ ] Flag inactive students for intervention
  - [ ] Access restrictions and moderation

- [ ] Parent Accounts
  - [ ] View parent-child relationships
  - [ ] Monitor parental controls usage
  - [ ] Parent dashboard analytics (aggregated)
  - [ ] Parent communication (email campaigns)
  - [ ] Content restriction settings per child

- [ ] Educator Accounts
  - [ ] Manage classroom creation
  - [ ] Monitor class rosters
  - [ ] Track homework assignments
  - [ ] View student accountability (per educator)
  - [ ] Performance metrics for educators

- [ ] Creator Accounts
  - [ ] Creator profile management
  - [ ] Content portfolio tracking
  - [ ] Creator statistics (videos, reach, impact)
  - [ ] Trusted Creator Badge management
  - [ ] Creator verification process
  - [ ] Creator support and communication

- [ ] Reviewer/Moderator Accounts
  - [ ] Reviewer assignment by subject
  - [ ] Workload balancing
  - [ ] Reviewer performance metrics
  - [ ] Quality scoring and reputation
  - [ ] Reviewer payment/compensation tracking (if applicable)

**Classroom Management**
- [ ] Classroom CRUD
  - [ ] Create/edit/delete classrooms
  - [ ] Assign educators to classrooms
  - [ ] View class rosters
  - [ ] Export class data

- [ ] Classroom Analytics
  - [ ] Student enrollment tracking
  - [ ] Attendance patterns
  - [ ] Content completion rates by class
  - [ ] Homework submission tracking
  - [ ] Performance trends

**Idea Marketplace Administration**
- [ ] View submitted video ideas
- [ ] Vote/rank ideas for content creation
- [ ] Status tracking (proposed, approved, in progress, completed)
- [ ] Creator assignment to ideas
- [ ] User engagement with ideas

**School Partnerships**
- [ ] School registration and verification
- [ ] School administrator management
- [ ] School account quotas and limits
- [ ] Partnership analytics
- [ ] Educational institution tracking

**Activity Monitoring**
- [ ] User activity logs
  - [ ] Last login tracking
  - [ ] Content consumption patterns
  - [ ] Engagement heatmap
  - [ ] Inactive user identification

- [ ] Platform Analytics Dashboard
  - [ ] Daily active users (DAU)
  - [ ] Monthly active users (MAU)
  - [ ] Content consumption trends
  - [ ] Creator activity levels
  - [ ] Geographic distribution

**Safety & Governance**
- [ ] Parental Controls Management
  - [ ] Content category restrictions per child
  - [ ] Usage time thresholds per child
  - [ ] Parent approval workflows
  - [ ] Content preview queue

- [ ] Trust & Safety
  - [ ] Report management (user, content reports)
  - [ ] Investigation workflow
  - [ ] Action enforcement (suspend, delete, warn)
  - [ ] Appeal process

- [ ] Compliance & Audit
  - [ ] GDPR compliance tools (user data export, deletion)
  - [ ] Privacy policy updates
  - [ ] Terms of service management
  - [ ] Legal holds and data retention

**Angel Donor Program**
- [ ] Donor account management
- [ ] Donation tracking and reporting
- [ ] Impact reporting (children reached, content created)
- [ ] Recognition and visibility (named/anonymous)
- [ ] Recurring donation setup
- [ ] Tax reporting documents (if applicable)

**Communications**
- [ ] Email campaign management
  - [ ] Email template creation
  - [ ] Bulk email sending (to segments: parents, creators, etc.)
  - [ ] Email scheduling
  - [ ] Delivery tracking
  - [ ] Unsubscribe management

- [ ] In-app notifications
  - [ ] Notification template creation
  - [ ] Targeting and segmentation
  - [ ] Delivery tracking

- [ ] Announcement board
  - [ ] Post announcements to specific user segments
  - [ ] Schedule publications
  - [ ] Pin important notices

**Reporting & Export**
- [ ] Report Generation
  - [ ] User demographics report
  - [ ] Content performance report
  - [ ] Creator performance report
  - [ ] Financial report (if applicable)
  - [ ] Engagement metrics report

- [ ] Data Export
  - [ ] CSV/Excel export of users, content, analytics
  - [ ] Batch operations on exported data
  - [ ] Historical data archive

---

## PART 3: CURRENT ADMIN CAPABILITIES ANALYSIS

### 3.1 Ecosystem Admin Dashboard (Existing)

**Location:** `/opt/ozean-licht-ecosystem/apps/admin/`

#### What's Already Built
1. ✅ **Authentication Framework**
   - NextAuth v5 configuration
   - Credentials provider with email/password
   - Database session storage in admin_sessions table
   - Session middleware protection

2. ✅ **Route Protection**
   - Middleware for dashboard routes
   - Login/logout functionality
   - Redirect for unauthenticated users

3. ✅ **Role-Based Access Control**
   - UserRole enum: SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT
   - Role assignment per user
   - Permission system with granular control
   - Wildcard permission support

4. ✅ **Audit Logging Framework**
   - audit_logs table structure (likely)
   - Action logging capability
   - Timestamp and user tracking

5. ✅ **Health Monitoring**
   - System health check page
   - Database connection monitoring
   - Service status verification

6. ✅ **Storage Management**
   - MinIO S3 storage interface
   - File listing and operations
   - Upload/download management

7. ✅ **UI Framework**
   - Tailwind CSS styling
   - shadcn/ui component library
   - Responsive design foundation
   - Dark/light theme capability

#### What's Missing for KA
- ❌ Content management (videos, courses, lessons)
- ❌ Content review workflow
- ❌ User management dashboard for KA
- ❌ Student progress tracking
- ❌ Classroom management
- ❌ Idea marketplace administration
- ❌ Creator management
- ❌ Analytics and reporting
- ❌ Angel donor program
- ❌ Email campaigns
- ❌ Compliance tools

### 3.2 Legacy Kids Ascension Admin (Reference)

**Location:** `/opt/ozean-licht-ecosystem/apps/kids-ascension/kids-ascension_OLD/kids-ascension-admin/`

#### Pages That Already Exist (Reference Implementation)
1. **Users Page** (`/admin/users`)
   - User list with filtering
   - User detail view and edit
   - Shows existing user management pattern

2. **Courses Page** (`/admin/courses`)
   - Course listing
   - Create/edit/delete functionality
   - Organize videos into courses

3. **Lessons Page** (`/admin/lessons`)
   - Lesson management
   - Video organization
   - Status tracking

4. **Classrooms Page** (`/admin/classrooms`)
   - Classroom listing and details
   - Invite link generation
   - Class management

5. **Meditations Page** (`/admin/meditations`)
   - Meditation content management
   - Categorization

6. **Activity Page** (`/admin/activity`)
   - User activity tracking
   - Engagement monitoring

7. **Video Upload** (`/admin/videos/upload`)
   - Video upload interface
   - Metadata entry

8. **Review Page** (`/admin/review`)
   - Content review workflow
   - Review queue management

9. **Marketplace Page** (`/admin/marketplace`)
   - Idea marketplace administration
   - Idea voting and tracking

10. **Schools Page** (`/admin/schools`)
    - School partnership management
    - School registration

#### UI Components Available
- Admin sidebar navigation
- Admin header with user menu
- Unauthorized access page
- Form components (input, select, textarea)
- Table components for data display
- Dialog/modal components
- Badge and card components

---

## PART 4: GAP ANALYSIS

### 4.1 Critical Gaps (Day-1 Blockers)

**Content Management**
- ❌ No video CRUD in ecosystem admin (only legacy reference)
- ❌ No course/lesson management UI
- ❌ No video upload handler
- ❌ No metadata management for content

**User Management**
- ❌ No KA user list/search interface
- ❌ No parent-child linking management
- ❌ No educator classroom assignment UI
- ❌ No creator profile management

**Content Review**
- ❌ No review queue display
- ❌ No reviewer assignment interface
- ❌ No feedback/collaboration tools
- ❌ No approval/rejection workflow

**Moderation & Safety**
- ❌ No content moderation queue
- ❌ No user report handling
- ❌ No content restriction controls
- ❌ No parental control management

### 4.2 Important Gaps (Post-MVP, Week 2+)

**Analytics & Reporting**
- ❌ No engagement analytics dashboard
- ❌ No content performance metrics
- ❌ No user demographics reporting
- ❌ No export functionality

**Creator Management**
- ❌ No creator verification workflow
- ❌ No Trusted Creator Badge system
- ❌ No creator performance tracking
- ❌ No creator support tools

**Business Operations**
- ❌ No Angel donor program interface
- ❌ No donation tracking
- ❌ No impact reporting
- ❌ No payment processing integration

**Communications**
- ❌ No email campaign management
- ❌ No bulk email sending
- ❌ No notification system
- ❌ No announcement board

### 4.3 Data Model Gaps

**Need to Define/Implement**
- [ ] VideoIdea model (for marketplace)
- [ ] UserProfile model (for student/parent/educator specific data)
- [ ] Video model (with metadata, transcoding status)
- [ ] Course, Lesson, Meditation models
- [ ] Classroom and ClassroomStudent models
- [ ] Homework and submission tracking
- [ ] UserAchievement model (gamification)
- [ ] VideoReview and ReviewerFeedback models
- [ ] CreatorProfile model
- [ ] AngelDonation model
- [ ] ParentalControl model
- [ ] UserActivity/WatchHistory model
- [ ] AuditLog model
- [ ] AbuseReport model

---

## PART 5: ADMIN DASHBOARD FEATURE PRIORITIZATION

### Priority Matrix

```
PRIORITY TIER 1 - CRITICAL (MVP Day 1)
├─ Authentication & Authorization ✅ DONE
├─ Basic User Management
│  ├─ List/search users by role
│  ├─ Suspend/activate accounts
│  └─ View user details and activity
├─ Content Publishing
│  ├─ Video upload and metadata
│  ├─ Course/lesson organization
│  └─ Content status tracking
├─ Content Review Workflow
│  ├─ Review queue display
│  ├─ Reviewer assignment
│  ├─ Approval/rejection
│  └─ Creator feedback
└─ System Health
   ├─ ✅ Database health
   ├─ ✅ Service monitoring
   └─ ✅ Error logging

PRIORITY TIER 2 - IMPORTANT (Week 2)
├─ Classroom Management
│  ├─ Classroom CRUD
│  ├─ Student rosters
│  ├─ Homework tracking
│  └─ Educator analytics
├─ Creator Management
│  ├─ Creator profiles
│  ├─ Content portfolio tracking
│  ├─ Creator badges
│  └─ Creator communication
├─ Parent & Child Management
│  ├─ Parent-child linking
│  ├─ Parental controls
│  ├─ Content restrictions
│  └─ Usage monitoring
├─ Idea Marketplace
│  ├─ Idea submission queue
│  ├─ Voting/ranking system
│  ├─ Status tracking
│  └─ Creator assignment
├─ Activity Monitoring
│  ├─ User engagement heatmap
│  ├─ Content consumption analytics
│  ├─ Inactive user identification
│  └─ Platform metrics dashboard
└─ Email Communications
   ├─ Email template management
   ├─ Bulk email sending
   └─ Newsletter management

PRIORITY TIER 3 - NICE-TO-HAVE (Post-MVP)
├─ Advanced Analytics
│  ├─ Demographic reports
│  ├─ Content performance deep-dive
│  ├─ Geographic distribution
│  └─ Predictive analytics
├─ Angel Donor Program
│  ├─ Donor management
│  ├─ Donation tracking
│  ├─ Impact reporting
│  └─ Tax reporting
├─ Compliance & Governance
│  ├─ GDPR data export
│  ├─ Data deletion workflows
│  ├─ Compliance audits
│  └─ Legal holds
├─ Advanced Moderation
│  ├─ AI content filtering
│  ├─ Hate speech detection
│  ├─ Automated flagging
│  └─ Bulk moderation actions
├─ Advanced Reporting
│  ├─ Custom report builder
│  ├─ Scheduled reports
│  ├─ Report distribution
│  └─ Historical trend analysis
└─ Internationalization
   ├─ Multi-language support
   ├─ Regional content approval
   └─ Currency/timezone handling
```

### Feature Scoring Matrix

| Feature | Impact | Effort | Priority | Est. Days |
|---------|--------|--------|----------|-----------|
| **User Search/Filter** | 9/10 | 3/10 | P1 | 1 |
| **Video Upload Handler** | 10/10 | 7/10 | P1 | 2 |
| **Content Review Queue** | 10/10 | 8/10 | P1 | 2 |
| **Classroom Dashboard** | 8/10 | 6/10 | P2 | 1.5 |
| **Creator Profiles** | 7/10 | 5/10 | P2 | 1 |
| **Parent-Child Manager** | 8/10 | 7/10 | P2 | 2 |
| **Analytics Dashboard** | 7/10 | 8/10 | P2 | 2.5 |
| **Email Campaigns** | 5/10 | 4/10 | P2 | 1 |
| **Idea Marketplace Admin** | 6/10 | 5/10 | P2 | 1.5 |
| **Angel Donor Program** | 4/10 | 6/10 | P3 | 2 |
| **Compliance Tools** | 5/10 | 9/10 | P3 | 3 |
| **Advanced Moderation** | 6/10 | 10/10 | P3 | 4 |

---

## PART 6: RECOMMENDED IMPLEMENTATION STRATEGY

### 6.1 Architectural Decisions

#### Centralized vs. Decentralized Admin
**Decision: Hybrid Approach**

**Ecosystem Admin** (`apps/admin/`) handles:
- Multi-platform user management
- System health and monitoring
- Authentication and authorization
- Audit logging and compliance
- Configuration management

**Kids Ascension Admin** (to be built) handles:
- Content management (videos, courses, lessons)
- Content review and moderation
- Classroom management
- Creator management
- KA-specific analytics

**Rationale:**
- Separates concerns (platform-wide vs. app-specific)
- Allows independent scaling
- Reduces cognitive load
- Enables role-based dashboard access
- Aligns with monorepo structure

#### Technology Stack

**Framework**: Continue Next.js 14 + TypeScript (consistency)
```typescript
// Shared admin components
apps/admin/
├── components/          # Shared admin UI components
├── lib/
│   ├── mcp-client/     # MCP Gateway integration
│   ├── auth/           # Auth utilities
│   └── hooks/          # Admin-specific hooks
└── types/              # Admin types

// KA-specific admin
apps/kids-ascension/frontend/
├── app/
│   └── admin/
│       ├── content/     # Content management
│       ├── moderation/  # Review workflow
│       ├── users/       # KA user management
│       └── analytics/   # KA analytics
```

#### Database Access Pattern
- **MCP Gateway**: Preferred method (like ecosystem admin)
- **Direct Prisma**: Fallback for KA-specific complex queries
- **Connection**: Via `kids_ascension_db` Prisma client

### 6.2 Implementation Phases

#### Phase 1: Foundation (Days 1-3)
**Goal: Functional MVP with core content + review management**

1. **Data Model Definition** (Day 1)
   - [ ] Define KA-specific Prisma schema
   - [ ] Create database migrations
   - [ ] Generate Prisma client

2. **Content Management** (Days 1-2)
   - [ ] Create Video CRUD pages
   - [ ] Implement video upload handler
   - [ ] Add metadata forms
   - [ ] Build course/lesson organization

3. **Review Workflow** (Days 2-3)
   - [ ] Create review queue page
   - [ ] Build reviewer assignment UI
   - [ ] Implement approval/rejection
   - [ ] Add creator feedback form

4. **Basic User Management** (Day 3)
   - [ ] User list with filters
   - [ ] User detail view
   - [ ] Status change (suspend/activate)

#### Phase 2: Operations (Days 4-7)
**Goal: Full classroom + creator management**

1. **Classroom Management** (Days 4-5)
   - [ ] Classroom CRUD
   - [ ] Student roster management
   - [ ] Homework tracking
   - [ ] Class analytics

2. **Creator Management** (Days 5-6)
   - [ ] Creator profile pages
   - [ ] Content portfolio tracking
   - [ ] Trusted Creator Badge system
   - [ ] Performance metrics

3. **Parent & Child** (Days 6-7)
   - [ ] Parent-child linking
   - [ ] Parental control panel
   - [ ] Content restrictions per child
   - [ ] Usage monitoring

4. **Idea Marketplace** (Day 7)
   - [ ] Idea submission queue
   - [ ] Voting/ranking interface
   - [ ] Creator assignment

#### Phase 3: Intelligence (Days 8-14)
**Goal: Analytics, communications, and reporting**

1. **Analytics Dashboard** (Days 8-10)
   - [ ] KPI cards (DAU, MAU, content consumption)
   - [ ] Engagement heatmap
   - [ ] Content performance charts
   - [ ] User demographics

2. **Communications** (Days 11-12)
   - [ ] Email template manager
   - [ ] Bulk email sender
   - [ ] In-app notification system
   - [ ] Announcement board

3. **Reporting** (Days 13-14)
   - [ ] Report generator (users, content, creators)
   - [ ] CSV/Excel export
   - [ ] Scheduled reports
   - [ ] Historical data archive

#### Phase 4: Business Intelligence (Week 3+)
**Goal: Creator ecosystem + donor program + compliance**

1. **Angel Donor Program**
   - [ ] Donor account management
   - [ ] Donation tracking
   - [ ] Impact reporting
   - [ ] Recognition system

2. **Compliance & Safety**
   - [ ] GDPR data export/deletion
   - [ ] Content moderation queue
   - [ ] User report handling
   - [ ] Appeal workflow

3. **Advanced Features**
   - [ ] AI content pre-screening
   - [ ] Automated harm ranking
   - [ ] Multi-reviewer collaboration
   - [ ] Judge Board escalation

### 6.3 Development Workflow

#### Code Organization
```
kids-ascension/frontend/
├── app/
│   ├── admin/                       # Admin section
│   │   ├── layout.tsx               # Admin layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Admin home
│   │   ├── content/
│   │   │   ├── layout.tsx
│   │   │   ├── videos/
│   │   │   │   ├── page.tsx         # Video list
│   │   │   │   ├── [id]/page.tsx    # Video detail/edit
│   │   │   │   └── new/page.tsx     # Upload video
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   └── meditations/
│   │   ├── moderation/
│   │   │   ├── queue/page.tsx       # Review queue
│   │   │   ├── [id]/page.tsx        # Review detail
│   │   │   └── feedback/            # Reviewer feedback
│   │   ├── users/
│   │   │   ├── students/page.tsx
│   │   │   ├── parents/page.tsx
│   │   │   ├── educators/page.tsx
│   │   │   ├── creators/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── classrooms/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── [id]/roster.tsx
│   │   ├── marketplace/
│   │   │   └── ideas/page.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx             # Main dashboard
│   │   │   ├── engagement/page.tsx
│   │   │   ├── content/page.tsx
│   │   │   └── creators/page.tsx
│   │   ├── communications/
│   │   │   ├── emails/page.tsx
│   │   │   └── notifications/page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── (auth)/                       # Auth routes unchanged
├── components/
│   ├── admin/                        # Admin-specific components
│   │   ├── sidebar/AdminSidebar.tsx
│   │   ├── content/VideoForm.tsx
│   │   ├── content/CourseSelect.tsx
│   │   ├── review/ReviewQueue.tsx
│   │   ├── review/ReviewForm.tsx
│   │   ├── users/UserTable.tsx
│   │   ├── users/UserFilter.tsx
│   │   ├── classrooms/ClassroomForm.tsx
│   │   ├── analytics/EngagementChart.tsx
│   │   ├── analytics/KPICard.tsx
│   │   └── ...
│   ├── shared/                       # Shared components (unchanged)
│   └── ui/                           # Base UI (unchanged)
├── lib/
│   ├── admin/                        # Admin-specific services
│   │   ├── content-service.ts
│   │   ├── review-service.ts
│   │   ├── user-service.ts
│   │   ├── classroom-service.ts
│   │   ├── analytics-service.ts
│   │   └── ...
│   ├── api/                          # API clients (updated)
│   │   ├── admin-client.ts           # New
│   │   └── ...
│   └── ...
└── ...
```

#### Component Patterns
- **Server Components**: Default for pages and data fetching
- **Client Components**: Interactive forms, filters, real-time updates
- **Form Libraries**: React Hook Form + Zod validation (consistent with app)
- **Data Tables**: React Table or custom for admin data
- **Charts**: Recharts for analytics
- **Notifications**: Toast notifications with Sonner library

#### Testing Strategy
- **Unit Tests**: Service layer business logic
- **Component Tests**: Admin UI components
- **Integration Tests**: End-to-end workflows (review → approval)
- **E2E Tests**: Critical admin flows (upload → publish)

### 6.4 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Data Model Changes** | Medium | High | Define complete schema early; use migrations |
| **Performance with Large Datasets** | Medium | Medium | Implement pagination, filtering, caching |
| **Security Issues (Data Exposure)** | Low | Critical | Implement RLS; audit logs; code review |
| **Reviewer Bottleneck** | Medium | High | Parallelizable workflow; clear assignment |
| **Video Upload Failures** | Low | Medium | Error handling; retry logic; upload resumption |
| **Scope Creep** | High | High | Strict MVP definition; defer P3 features |

---

## PART 7: SPECIFIC RECOMMENDATIONS FOR IMPLEMENTATION

### 7.1 Quick Wins (1-2 day features)

1. **Video Upload Page** (1 day)
   - Uses existing file upload patterns from old admin
   - Basic metadata form (title, description, age range, subject)
   - Cloudflare Stream integration via backend
   - Progress tracking during upload

2. **Review Queue** (1 day)
   - Simple list of pending content
   - Filter by status, reviewer, date
   - Quick approval/rejection buttons
   - Link to reviewer feedback form

3. **Creator List** (0.5 day)
   - Similar to user list pattern
   - Filter by activity, content count
   - Badge assignment interface
   - Performance metrics cards

4. **Activity Heatmap** (1 day)
   - Use existing chart library (Recharts)
   - Heat map of engagement by day/hour
   - Similar to GitHub contribution graph
   - User segment filtering

### 7.2 Database Migrations

**Required Migrations (Week 1)**

```sql
-- Kids Ascension specific tables

-- 1. Video content
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL,
  title VARCHAR(255),
  description TEXT,
  duration_seconds INT,
  age_range_min INT,
  age_range_max INT,
  subjects TEXT[],
  thumbnail_url TEXT,
  cloudflare_stream_id VARCHAR(255),
  status VARCHAR(50), -- 'draft', 'review_pending', 'approved', 'rejected', 'published'
  upload_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 2. Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  created_by UUID,
  is_public BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 3. Content Review
CREATE TABLE video_reviews (
  id UUID PRIMARY KEY,
  video_id UUID NOT NULL,
  reviewer_id UUID,
  status VARCHAR(50), -- 'pending', 'in_progress', 'approved', 'rejected', 'revision_requested'
  harm_score FLOAT,
  feedback TEXT,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP
);

-- 4. User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL,
  watch_date TIMESTAMP,
  watch_duration_seconds INT,
  completed BOOLEAN,
  created_at TIMESTAMP
);

-- 5. Classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY,
  educator_id UUID NOT NULL,
  name VARCHAR(255),
  description TEXT,
  invite_code VARCHAR(50),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 6. Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type VARCHAR(50), -- 'video_completed', 'course_completed', 'streak_7_days', etc
  awarded_date TIMESTAMP,
  created_at TIMESTAMP
);

-- 7. Audit Log
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY,
  admin_id UUID NOT NULL,
  action VARCHAR(100),
  resource_type VARCHAR(50), -- 'video', 'user', 'review', etc
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP
);
```

### 7.3 API Endpoints Needed (New Routes)

```typescript
// Content Management
POST   /api/admin/videos              # Upload video
GET    /api/admin/videos              # List videos
GET    /api/admin/videos/:id          # Get video details
PUT    /api/admin/videos/:id          # Update video metadata
DELETE /api/admin/videos/:id          # Delete video (soft)

// Content Review
GET    /api/admin/reviews/queue       # Get pending reviews
POST   /api/admin/reviews/:id/approve # Approve content
POST   /api/admin/reviews/:id/reject  # Reject content
POST   /api/admin/reviews/:id/feedback # Send creator feedback

// Users
GET    /api/admin/users               # List users (with filters)
GET    /api/admin/users/:id           # User details
PUT    /api/admin/users/:id           # Update user
POST   /api/admin/users/:id/suspend   # Suspend user
POST   /api/admin/users/:id/activate  # Reactivate user

// Classrooms
GET    /api/admin/classrooms          # List classrooms
POST   /api/admin/classrooms          # Create classroom
GET    /api/admin/classrooms/:id      # Classroom details
PUT    /api/admin/classrooms/:id      # Update classroom

// Analytics
GET    /api/admin/analytics/overview  # Dashboard KPIs
GET    /api/admin/analytics/engagement # Engagement metrics
GET    /api/admin/analytics/content   # Content performance
```

### 7.4 UI Pattern Library

**Standard Data Table**
- Sortable columns
- Pagination
- Search/filter sidebar
- Bulk actions checkbox
- Row detail expansion

**Standard Form**
- Field validation with Zod
- Error messages inline
- Required field indicators
- Save/Cancel buttons
- Loading state

**Standard Detail Page**
- Breadcrumb navigation
- Header with title + actions
- Tabbed sections
- Edit/View mode toggle
- Audit trail section

**Standard Dashboard**
- KPI cards (4-6 metrics)
- Primary chart (line or bar)
- Data table (top items)
- Filter date range
- Export button

---

## PART 8: TECHNOLOGY RECOMMENDATIONS

### 8.1 Libraries & Tools

**UI Components & Styling**
- ✅ Tailwind CSS (already in use)
- ✅ shadcn/ui (already in use)
- Consider: Shadcn Admin template for faster building

**Data Tables & Grids**
- **TanStack Table (React Table)** - Headless table library
  - Powerful sorting, filtering, pagination
  - Easy integration with shadcn/ui
  - No lock-in to component library

**Forms & Validation**
- ✅ React Hook Form (likely already in use)
- ✅ Zod (TypeScript-first schema validation)

**Charts & Analytics**
- **Recharts** - Simple, declarative charting
- Alternative: **Chart.js** or **Apache ECharts**

**File Upload**
- **React Dropzone** - Drag-and-drop upload
- Backend: Multer (Node.js middleware)
- Cloud: Cloudflare Stream API for video

**Rich Text Editor** (for descriptions, feedback)
- **TipTap** - Lightweight, extensible
- Alternative: **Slate.js**

**Date Handling**
- ✅ date-fns (already likely in use)
- Inputs: Shadcn/ui date picker

**Notifications**
- ✅ Sonner (toast notifications, already in ecosystem admin)

**State Management**
- **Zustand** (if needed) - Lightweight, simple
- Alternative: **React Context** (for local state)
- **React Query** (for server state)

**Authentication Testing**
- **Playwright** (E2E testing for auth flows)

### 8.2 Performance Considerations

**Backend Optimization**
- Database indexes on frequently queried columns (user_id, status, created_at)
- Connection pooling (already in MCP Gateway)
- Caching layer for analytics (Redis optional)
- Pagination for large datasets (25-100 items per page)

**Frontend Optimization**
- Code splitting by admin section
- Lazy loading for admin pages
- Image optimization for thumbnails
- Virtual scrolling for large data tables

**Search Optimization**
- Full-text search on titles, descriptions
- Elasticsearch integration (future, if needed)
- Client-side filtering for small datasets

### 8.3 Deployment Considerations

**Development**
- Same setup as main app (npm run dev)
- Hot reload for admin pages
- Local MCP Gateway for testing

**Staging**
- Docker container in Coolify
- Test database snapshot
- Admin test accounts

**Production**
- Cloudflare Pages deployment (static assets)
- Next.js backend via Coolify
- Auto-scaling based on load
- CDN caching for static assets

---

## PART 9: CONCLUSION & NEXT STEPS

### 9.1 Summary

Kids Ascension requires a comprehensive admin dashboard to manage:

| Capability | Status | Priority | Est. Effort |
|-----------|--------|----------|-------------|
| **Content Management** | ❌ Missing | P1 | 2 days |
| **Content Review** | ❌ Missing | P1 | 2 days |
| **User Management** | ⚠️ Partial | P1 | 1 day |
| **Classroom Mgmt** | ❌ Missing | P2 | 1.5 days |
| **Creator Mgmt** | ❌ Missing | P2 | 1 day |
| **Analytics** | ❌ Missing | P2 | 2.5 days |
| **Email Communications** | ❌ Missing | P2 | 1 day |
| **Idea Marketplace** | ❌ Missing | P2 | 1.5 days |
| **Angel Donor Program** | ❌ Missing | P3 | 2 days |
| **Compliance Tools** | ❌ Missing | P3 | 3 days |

**MVP Timeline:** 5-7 days (P1 + critical P2)
**Full Solution:** 4-6 weeks (including P3)

### 9.2 Recommended Approach

**Phase 0: Setup (1 day)**
1. Define KA-specific Prisma schema
2. Create database migrations
3. Set up `/admin/` directory structure
4. Implement admin layout with sidebar

**Phase 1: Core (3-4 days)**
1. Video management (upload, edit, delete)
2. Content review workflow
3. Creator management
4. Basic user management

**Phase 2: Operations (3-4 days)**
1. Classroom management
2. Parent/child management
3. Idea marketplace
4. Activity monitoring

**Phase 3: Intelligence (5-7 days)**
1. Analytics dashboard
2. Email campaigns
3. Creator tools
4. Compliance features

### 9.3 Immediate Action Items

**For Product Team:**
1. ✅ Review this requirements document
2. [ ] Confirm priorities and MVP scope
3. [ ] Define exact data models with team
4. [ ] Design UX mockups for key flows

**For Engineering Team:**
1. [ ] Create KA database schema migration
2. [ ] Set up admin directory structure
3. [ ] Implement admin authentication
4. [ ] Build video upload handler (foundation)
5. [ ] Create data service layer
6. [ ] Write initial E2E tests for review workflow

**For Orchestration:**
1. [ ] Create ADW task for admin development
2. [ ] Schedule 2-week sprint with clear milestones
3. [ ] Plan code review process
4. [ ] Set up staging environment

### 9.4 Success Criteria

**MVP Success:**
- [ ] Admins can upload/manage videos
- [ ] Content review workflow functional
- [ ] User moderation working
- [ ] All P1 features tested and deployed
- [ ] Performance meets benchmarks (<2s page load)
- [ ] Zero critical security issues

**Post-MVP Success:**
- [ ] Classroom management fully operational
- [ ] Analytics dashboard tracking KPIs
- [ ] Creator program launched
- [ ] User satisfaction > 4.5/5
- [ ] Support tickets < 5/day

---

## APPENDICES

### A. Database Schema Diagram

```
shared_users_db
├── users
├── user_entities
├── sessions
├── oauth_accounts
├── password_reset_tokens
└── email_verification_tokens

kids_ascension_db (To be created)
├── videos
├── courses
├── lessons
├── video_reviews
├── user_progress
├── classrooms
├── classroom_students
├── homework
├── user_achievements
├── creator_profiles
├── admin_actions
└── abuse_reports
```

### B. Key Stakeholders & Roles

| Role | Responsibilities | Dashboard Access |
|------|------------------|------------------|
| **Platform Admin** | User management, system health | All sections |
| **KA Admin** | Content, reviews, users | Content, Users, Analytics |
| **Content Moderator** | Review queue, approval | Moderation, Analytics |
| **Creator Support** | Creator issues, assistance | Users (Creators), Support |
| **Analytics Lead** | Reporting, insights | Analytics, Reports |
| **Super Admin** | System-wide configuration | Settings, Audit Logs |

### C. Regulatory Compliance Checklist

- [ ] **GDPR**: Data export, deletion, retention
- [ ] **COPPA** (US): Parental consent for children <13
- [ ] **DSGVO** (Austria/EU): Data protection compliance
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Content Filtering**: Age-appropriate categorization

### D. Integration Points

```
Admin Dashboard
├── MCP Gateway (database, health checks)
├── Cloudflare Stream (video delivery)
├── MinIO (staging storage)
├── NextAuth (authentication)
├── Email Service (transactional emails)
└── Analytics Service (metrics collection)
```

---

**Report Prepared By:** Scout Agent
**Report Date:** November 8, 2025
**Codebase Version:** Foundation Phase - Monorepo Migration (Nov 2025)
**Confidence Level:** High (based on code analysis + PRD review)

---

## REFERENCES

### Key Files Analyzed
- `/opt/ozean-licht-ecosystem/apps/kids-ascension/docs/prd-ka.md` - Product specification
- `/opt/ozean-licht-ecosystem/apps/kids-ascension/README.md` - App overview
- `/opt/ozean-licht-ecosystem/shared/database/prisma/schema.prisma` - Shared auth schema
- `/opt/ozean-licht-ecosystem/apps/admin/README.md` - Ecosystem admin docs
- `/opt/ozean-licht-ecosystem/apps/kids-ascension/kids-ascension_OLD/CLAUDE.md` - Development guide
- `/opt/ozean-licht-ecosystem/CONTEXT_MAP.md` - Repository navigation

### Documentation URLs (Internal)
- CLAUDE.md - AI agent workflow instructions
- CONTEXT_MAP.md - Repository structure reference
- Architecture.md - System architecture (2900+ lines)

---

**END OF REPORT**
