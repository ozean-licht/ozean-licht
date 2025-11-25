# ENGINEERING BLUEPRINT
## Ozean Licht Akademie™ - Agentic Development Specification

**Version:** 1.0.0  
**Last Updated:** 2025-11-25  
**Status:** Active Development  
**Source PRD:** v1.0 (2025-10-06)

---

## 1. SYSTEM OVERVIEW

### 1.1 Product Identity
**Name:** Ozean Licht Akademie™  
**Type:** Spiritual E-Learning & Community Platform  
**Domain:** ozean-licht.com  
**Primary Language:** German (DE)  
**Secondary:** English (EN) - Phase 3  

### 1.2 Tech Stack (Locked)
```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript (strict)
Styling: Tailwind CSS + Design System
Animation: Framer Motion
State: Zustand
Database: PostgreSQL
Auth: Custom (email/password, magic link, OAuth)
Payments: Stripe
Video: Vimeo
Email: Resend + Listmonk
Hosting: Coolify (Hetzner)
CI/CD: GitHub Actions
Component Dev: Storybook
```

### 1.3 Design Language
- **Primary Palette:** Read design-system.md
- **Aesthetic:** Flowing water, energy vortex, crystalline structures
- **Typography:** Clean, spiritual but modern (not "woo-woo")
- **Motion:** Subtle, flowing animations (never jarring)
- **Mood:** Safe space, transformative, professional mysticism

---

## 2. USER ROLES & PERSONAS

### 2.1 Role Definitions

| Role | Auth Level | Access | Key Actions |
|------|------------|--------|-------------|
| `visitor` | Anonymous | Public pages, free content previews | Browse, signup, purchase |
| `free_member` | Authenticated | Free videos, community Q&As | Watch free content, comment, profile |
| `seeker` | Subscriber (€18/mo) | Base courses, group channelings | Full video library, basic courses |
| `angel` | Subscriber (€38/mo) | Seeker + Kids Ascension benefits | Monthly gifts, supporter badge |
| `athemirah_student` | Enrolled | Cosmic School Year 1 or 2 | School modules, assignments, forum |
| `admin` | Staff | Full CMS access | Content management, user admin |
| `super_admin` | Owner (Lia) | Everything + financials | Full system control |

### 2.2 Persona Deep Dives

#### Persona A: "Der Erwachende" (Primary)
- **Age:** 28-45
- **Tech Comfort:** Medium (uses smartphone daily, some desktop)
- **Journey Stage:** 1-3 years into spiritual awakening
- **Pain Points:** Overwhelmed by contradictory info, seeks authentic guidance
- **Goals:** Clear transformation path, community connection
- **Behavior:** Watches free content first, needs trust before purchase
- **Conversion Trigger:** Testimonials + free valuable content

#### Persona B: "Die Skeptikerin" (Secondary)
- **Age:** 35-55
- **Tech Comfort:** Medium-High
- **Journey Stage:** Experienced but disillusioned with mainstream spirituality
- **Pain Points:** Too much "love and light" without substance
- **Goals:** Direct experience, no dogma, practical tools
- **Behavior:** Reads thoroughly, checks credentials, slow conversion
- **Conversion Trigger:** Lia's authenticity + LCQ methodology

#### Persona C: "Der Supporter" (Angel Tier)
- **Age:** 40-60
- **Tech Comfort:** Low-Medium
- **Journey Stage:** Established spiritual practice
- **Pain Points:** Wants to give back, support children's spiritual education
- **Goals:** Contribute to Kids Ascension mission
- **Behavior:** Emotional connection to cause, less price-sensitive
- **Conversion Trigger:** Kids Ascension story + community impact

---

## 3. SITEMAP ARCHITECTURE

### 3.1 Public Routes (No Auth)

```
/                           # Homepage
├── /kurse                  # Course Catalog
│   ├── /kurse/[slug]       # Course Detail Page
│   └── /kurse/kategorie/[cat]  # Category Filter
├── /videos                 # Video Library (Free Previews)
│   ├── /videos/[slug]      # Video Player Page
│   └── /videos/kategorie/[cat] # Video Category
├── /athemirah-school       # Cosmic School Landing
├── /magazin                # Blog/Magazine
│   └── /magazin/[slug]     # Article Page
├── /ueber-lia              # About Lia
├── /kontakt                # Contact Form
├── /partner-deal           # 2-for-1 Special Offers
├── /feedback               # Testimonials Page
├── /kooperationen          # Partnerships
├── /berufung               # Career/Calling
├── /bewerben               # Application Form
├── /events                 # Event Calendar (Public View)
│   └── /events/[slug]      # Event Detail
│
├── /auth                   # Auth Routes
│   ├── /auth/login
│   ├── /auth/signup
│   ├── /auth/forgot-password
│   ├── /auth/reset-password
│   └── /auth/verify-email
│
└── /legal                  # Legal Pages
    ├── /datenschutz
    ├── /impressum
    ├── /teilnahmebedingungen
    ├── /vereinsstatuten
    └── /registerauszug
```

### 3.2 Protected Routes (Authenticated)

```
/dashboard                  # User Dashboard Home
├── /dashboard/kurse        # My Courses
│   └── /dashboard/kurse/[slug]  # Course Player (Enrolled)
├── /dashboard/videos       # My Video Library
├── /dashboard/events       # My Events & Bookings
├── /dashboard/community    # Community Hub
│   ├── /dashboard/community/forum
│   └── /dashboard/community/messages
├── /dashboard/notizen      # Personal Notes
├── /dashboard/profil       # Profile Settings
├── /dashboard/billing      # Subscription & Payments
└── /dashboard/zertifikate  # Certificates
```

### 3.3 Athemirah School Routes (Enrolled Students)

```
/athemirah                  # School Dashboard
├── /athemirah/jahr-1       # Year 1 Overview
│   └── /athemirah/jahr-1/modul-[n]  # Module 1-12
├── /athemirah/jahr-2       # Year 2 Overview
│   └── /athemirah/jahr-2/modul-[n]  # Module 1-12
├── /athemirah/archiv       # Crystal Archive
├── /athemirah/aufgaben     # Assignments
└── /athemirah/forum        # School-only Forum
```

### 3.4 Admin Routes

```
/admin                      # Admin Dashboard
├── /admin/kurse            # Course Management
│   ├── /admin/kurse/neu
│   └── /admin/kurse/[id]/edit
├── /admin/videos           # Video Management
├── /admin/events           # Event Management
├── /admin/users            # User Management
├── /admin/magazin          # Blog CMS
├── /admin/analytics        # Analytics Dashboard
├── /admin/finanzen         # Financial Reports
└── /admin/settings         # System Settings
```

---

## 4. USER FLOWS (BMAD Analysis)

### 4.1 Flow: Visitor → Free Member → Paying Customer

```
┌─────────────────────────────────────────────────────────────────┐
│ DISCOVERY PHASE                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Search/Social/Referral]                                       │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                │
│  │  Homepage   │ ──────────────────────────────────┐            │
│  └─────────────┘                                   │            │
│         │                                          │            │
│         ▼                                          ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐     │
│  │ Free Videos │    │ Course List │    │ Athemirah Info  │     │
│  └─────────────┘    └─────────────┘    └─────────────────┘     │
│         │                  │                    │               │
│         └──────────────────┼────────────────────┘               │
│                            ▼                                    │
│                   ┌─────────────────┐                           │
│                   │ VALUE REALIZED  │                           │
│                   │ (Free Content)  │                           │
│                   └─────────────────┘                           │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│ CONVERSION PHASE           │                                    │
├────────────────────────────┼────────────────────────────────────┤
│                            ▼                                    │
│                   ┌─────────────────┐                           │
│                   │  SIGNUP WALL    │                           │
│                   │ (To continue)   │                           │
│                   └─────────────────┘                           │
│                            │                                    │
│              ┌─────────────┴─────────────┐                      │
│              ▼                           ▼                      │
│     ┌─────────────┐             ┌─────────────┐                │
│     │ Email/Pass  │             │ Social Auth │                │
│     └─────────────┘             └─────────────┘                │
│              │                           │                      │
│              └─────────────┬─────────────┘                      │
│                            ▼                                    │
│                   ┌─────────────────┐                           │
│                   │ FREE MEMBER     │                           │
│                   │ (Dashboard)     │                           │
│                   └─────────────────┘                           │
│                            │                                    │
│              ┌─────────────┼─────────────┐                      │
│              ▼             ▼             ▼                      │
│     ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│     │ Watch Free │  │ Buy Course │  │ Subscribe  │             │
│     │ Content    │  │ (One-time) │  │ (Monthly)  │             │
│     └────────────┘  └────────────┘  └────────────┘             │
│                            │             │                      │
│                            └──────┬──────┘                      │
│                                   ▼                             │
│                          ┌─────────────────┐                    │
│                          │    CHECKOUT     │                    │
│                          │    (Stripe)     │                    │
│                          └─────────────────┘                    │
│                                   │                             │
│                                   ▼                             │
│                          ┌─────────────────┐                    │
│                          │ PAYING CUSTOMER │                    │
│                          └─────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Flow: Course Consumption

```
┌─────────────────────────────────────────────────────────────────┐
│ COURSE PLAYER FLOW                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                            │
│  │ My Courses List │                                            │
│  └─────────────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ COURSE DETAIL PAGE                                       │    │
│  │ ┌─────────────┐ ┌───────────────────────────────────┐   │    │
│  │ │ Course Hero │ │ Module List (Accordion)           │   │    │
│  │ │ + Progress  │ │ ├── Module 1: Einführung ✓        │   │    │
│  │ │ + Instructor│ │ ├── Module 2: Grundlagen ◐        │   │    │
│  │ └─────────────┘ │ ├── Module 3: Vertiefung ○        │   │    │
│  │                 │ └── Module 4: Integration ○        │   │    │
│  │                 └───────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼ (Click Module)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ VIDEO PLAYER VIEW                                        │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │                                                      │ │    │
│  │ │              [VIDEO PLAYER]                         │ │    │
│  │ │              Vimeo Embed                            │ │    │
│  │ │                                                      │ │    │
│  │ ├──────────────────────────────────────────────────────┤ │    │
│  │ │ [▶] ═══●═══════════════════════════════ 12:34/45:00 │ │    │
│  │ │       ▲ Lightcode Markers                           │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │                                                          │    │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │    │
│  │ │ Transcript   │ │ Notes        │ │ Resources        │  │    │
│  │ │ (Toggle)     │ │ (Personal)   │ │ (Downloads)      │  │    │
│  │ └──────────────┘ └──────────────┘ └──────────────────┘  │    │
│  │                                                          │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ Comments / Energieaustausch                         │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼ (Video Complete)                  │
│                     ┌─────────────────┐                         │
│                     │ NEXT VIDEO      │                         │
│                     │ Auto-progress   │                         │
│                     └─────────────────┘                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Flow: Live Event Registration

```
Event Discovery → Event Detail → Registration → Payment → Confirmation
      │                │              │            │           │
      ▼                ▼              ▼            ▼           ▼
 [Calendar]    [Event Hero]    [Select Tier]  [Stripe]  [Email + Cal]
 [List View]   [Description]   [Add to Cart]  [Checkout] [Add to Dashboard]
               [Schedule]
               [Capacity]
```

### 4.4 Flow: Admin Content Publishing

```
┌─────────────────────────────────────────────────────────────────┐
│ CONTENT CREATION FLOW                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────┐                                              │
│  │ Admin Dashboard│                                              │
│  └───────────────┘                                              │
│          │                                                       │
│          ├─────────────────┬─────────────────┬─────────────────┐ │
│          ▼                 ▼                 ▼                 ▼ │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────┐ │
│  │ Create Course │ │ Upload Video  │ │ Create Event  │ │ Blog │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └──────┘ │
│          │                 │                 │                   │
│          ▼                 ▼                 ▼                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ CONTENT EDITOR                                           │    │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │    │
│  │ │ Metadata    │ │ Media       │ │ Pricing             │ │    │
│  │ │ - Title     │ │ - Thumbnail │ │ - Free / Paid       │ │    │
│  │ │ - Slug      │ │ - Video URL │ │ - Price             │ │    │
│  │ │ - Category  │ │ - Resources │ │ - Discount Codes    │ │    │
│  │ │ - Tags      │ │             │ │                     │ │    │
│  │ └─────────────┘ └─────────────┘ └─────────────────────┘ │    │
│  │                                                          │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ Rich Text Editor (Description / Content)            │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │                                                          │    │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │    │
│  │ │ Save Draft  │ │ Preview     │ │ Publish             │ │    │
│  │ └─────────────┘ └─────────────┘ └─────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ REVIEW QUEUE    │ (Optional)               │
│                    └─────────────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ PUBLISHED       │                          │
│                    │ + Notifications │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. COMPONENT ARCHITECTURE

### 5.1 Design System Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: PAGE TEMPLATES                                         │
│ Complete page layouts with slots for compositions               │
│ e.g., HomePageTemplate, CoursePageTemplate, DashboardTemplate   │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 3: COMPOSITIONS                                           │
│ Section-level components combining multiple primitives          │
│ e.g., HeroSection, CourseCard, VideoPlayer, PricingTable        │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 2: PRIMITIVES                                             │
│ Atomic UI components from design system                         │
│ e.g., Button, Input, Card, Badge, Avatar, Modal                 │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 1: TOKENS                                                 │
│ Design tokens (colors, spacing, typography)                     │
│ Tailwind config, CSS variables                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Composition Inventory (To Build)

#### Public Page Compositions

| Composition | Description | Primitives Used | Priority |
|-------------|-------------|-----------------|----------|
| `HeroHome` | Homepage hero with animated water BG | Button, Text, AnimatedBg | P0 |
| `HeroGeneric` | Reusable hero for inner pages | Text, Breadcrumb | P0 |
| `FeatureGrid` | 3-4 feature cards grid | Card, Icon, Text | P0 |
| `TestimonialCarousel` | Social proof slider | Card, Avatar, Rating | P0 |
| `CourseCardGrid` | Course catalog display | CourseCard, Filter, Pagination | P0 |
| `CourseCard` | Single course preview | Card, Badge, Image, Button | P0 |
| `VideoCard` | Single video preview | Card, Thumbnail, Duration, Badge | P0 |
| `VideoPlayer` | Full video player | VimeoEmbed, Controls, Transcript | P0 |
| `PricingTable` | Subscription tiers | Card, Price, FeatureList, Button | P1 |
| `EventCalendar` | Calendar + list view | Calendar, EventCard | P1 |
| `EventCard` | Single event preview | Card, DateTime, Badge, Button | P1 |
| `FAQAccordion` | Collapsible FAQ | Accordion, Text | P1 |
| `NewsletterSignup` | Email capture form | Input, Button, Text | P0 |
| `Footer` | Site footer | Links, Social, Legal | P0 |
| `Navbar` | Site navigation | Logo, NavLinks, AuthButtons | P0 |
| `MobileNav` | Mobile hamburger menu | Drawer, NavLinks | P0 |

#### Dashboard Compositions

| Composition | Description | Primitives Used | Priority |
|-------------|-------------|-----------------|----------|
| `DashboardSidebar` | Navigation sidebar | NavLinks, Avatar, Badge | P1 |
| `ProgressCard` | Course progress display | Card, ProgressBar, Text | P1 |
| `MyCoursesGrid` | Enrolled courses | CourseCard, Progress | P1 |
| `ProfileForm` | User profile editor | Form, Input, Avatar, Button | P1 |
| `BillingOverview` | Subscription status | Card, Price, Button | P1 |
| `NotificationList` | User notifications | List, Badge, DateTime | P2 |
| `NotesEditor` | Personal notes | RichText, SaveIndicator | P2 |

#### Admin Compositions

| Composition | Description | Primitives Used | Priority |
|-------------|-------------|-----------------|----------|
| `AdminSidebar` | Admin navigation | NavLinks, Badge | P1 |
| `DataTable` | Generic data table | Table, Pagination, Search | P1 |
| `ContentEditor` | Rich content editor | RichText, MediaUpload, Tags | P1 |
| `CourseBuilder` | Course module builder | DragDrop, List, Form | P2 |
| `AnalyticsCard` | Metric display | Card, Chart, Number | P2 |
| `UserManagement` | User list + actions | DataTable, Modal, Form | P2 |

### 5.3 Storybook Organization

```
stories/
├── 0-tokens/
│   ├── Colors.stories.tsx
│   ├── Typography.stories.tsx
│   └── Spacing.stories.tsx
├── 1-primitives/
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   ├── Card.stories.tsx
│   └── ...
├── 2-compositions/
│   ├── public/
│   │   ├── HeroHome.stories.tsx
│   │   ├── CourseCard.stories.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── ProgressCard.stories.tsx
│   │   └── ...
│   └── admin/
│       ├── DataTable.stories.tsx
│       └── ...
└── 3-templates/
    ├── HomePageTemplate.stories.tsx
    ├── CoursePageTemplate.stories.tsx
    └── ...
```

---

## 6. DATA MODEL

### 6.1 Core Entities

```typescript
// User & Auth
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'visitor' | 'free_member' | 'seeker' | 'angel' | 'athemirah_student' | 'admin' | 'super_admin';
  subscription_tier?: 'free' | 'seeker' | 'angel';
  subscription_status?: 'active' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Course System
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  price_cents: number; // 0 = free
  is_subscription_only: boolean;
  instructor_id: string;
  modules: Module[];
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
  updated_at: Date;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  videos: Video[];
}

interface Video {
  id: string;
  module_id?: string;
  slug: string;
  title: string;
  description: string;
  vimeo_id: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: VideoCategory;
  is_free: boolean;
  transcript?: string;
  lightcode_markers?: LightcodeMarker[];
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
}

interface LightcodeMarker {
  timestamp_seconds: number;
  label: string;
  description?: string;
}

// Enrollment & Progress
interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: Date;
  completed_at?: Date;
  progress_percent: number;
}

interface VideoProgress {
  user_id: string;
  video_id: string;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: Date;
}

// Events
interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_type: 'live_channeling' | 'qa_session' | 'lcq_transformation' | 'grid_work' | 'athemirah_session';
  start_time: Date;
  end_time: Date;
  timezone: string;
  zoom_link?: string;
  max_capacity?: number;
  price_cents: number;
  recording_video_id?: string;
  status: 'upcoming' | 'live' | 'completed' | 'canceled';
}

interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  registered_at: Date;
  attended: boolean;
  payment_id?: string;
}

// Blog/Magazine
interface Article {
  id: string;
  slug: string;
  title: string;
  content: string; // Rich text / MDX
  excerpt: string;
  featured_image_url?: string;
  author_id: string;
  category: ArticleCategory;
  tags: string[];
  status: 'draft' | 'published';
  published_at?: Date;
  created_at: Date;
}

// Payments
interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string;
  amount_cents: number;
  currency: 'EUR';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  type: 'one_time' | 'subscription';
  item_type: 'course' | 'event' | 'subscription';
  item_id: string;
  created_at: Date;
}

// Enums
type CourseCategory = 
  | 'aktuelle_events'
  | 'aufzeichnungen_basis'
  | 'community_qa'
  | 'lcq_channelings'
  | 'aufbaukurse'
  | 'masterkurse'
  | 'athemirah_school';

type VideoCategory =
  | 'grundlagen'
  | 'transformation'
  | 'kosmisches_wissen'
  | 'channelings'
  | 'interviews'
  | 'meditationen';

type ArticleCategory =
  | 'updates'
  | 'love_letters'
  | 'educational'
  | 'energie_updates'
  | 'interviews';
```

### 6.2 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'free_member',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) DEFAULT 'beginner',
  price_cents INTEGER DEFAULT 0,
  is_subscription_only BOOLEAN DEFAULT FALSE,
  instructor_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  vimeo_id VARCHAR(100) NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category VARCHAR(100),
  is_free BOOLEAN DEFAULT FALSE,
  transcript TEXT,
  lightcode_markers JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- More tables: enrollments, video_progress, events, event_registrations, 
-- articles, payments, user_notes, comments...
```

---

## 7. API ROUTES SPECIFICATION

### 7.1 Public API

```typescript
// Courses
GET    /api/courses                    // List courses (paginated, filterable)
GET    /api/courses/[slug]             // Get course detail
GET    /api/courses/categories         // Get all categories

// Videos
GET    /api/videos                     // List videos (paginated, filterable)
GET    /api/videos/[slug]              // Get video detail
GET    /api/videos/categories          // Get video categories

// Events
GET    /api/events                     // List upcoming events
GET    /api/events/[slug]              // Get event detail

// Blog
GET    /api/articles                   // List articles
GET    /api/articles/[slug]            // Get article

// Auth
POST   /api/auth/signup                // Create account
POST   /api/auth/login                 // Login
POST   /api/auth/logout                // Logout
POST   /api/auth/forgot-password       // Request reset
POST   /api/auth/reset-password        // Reset password
POST   /api/auth/verify-email          // Verify email
```

### 7.2 Protected API (Authenticated)

```typescript
// User
GET    /api/user/me                    // Get current user
PATCH  /api/user/me                    // Update profile
GET    /api/user/enrollments           // Get my enrollments
GET    /api/user/progress              // Get all progress
POST   /api/user/notes                 // Save note
GET    /api/user/notes                 // Get my notes

// Progress Tracking
POST   /api/progress/video             // Update video progress
POST   /api/progress/course            // Mark course complete

// Events
POST   /api/events/[slug]/register     // Register for event

// Payments
POST   /api/payments/checkout          // Create checkout session
POST   /api/payments/webhook           // Stripe webhook
GET    /api/payments/history           // Payment history

// Subscriptions
POST   /api/subscriptions/create       // Start subscription
POST   /api/subscriptions/cancel       // Cancel subscription
GET    /api/subscriptions/status       // Get current status
```

### 7.3 Admin API

```typescript
// Courses
POST   /api/admin/courses              // Create course
PATCH  /api/admin/courses/[id]         // Update course
DELETE /api/admin/courses/[id]         // Delete course

// Videos
POST   /api/admin/videos               // Create video
PATCH  /api/admin/videos/[id]          // Update video
DELETE /api/admin/videos/[id]          // Delete video

// Events
POST   /api/admin/events               // Create event
PATCH  /api/admin/events/[id]          // Update event
DELETE /api/admin/events/[id]          // Delete event

// Users
GET    /api/admin/users                // List users
PATCH  /api/admin/users/[id]           // Update user
POST   /api/admin/users/[id]/enroll    // Manual enrollment

// Analytics
GET    /api/admin/analytics/overview   // Dashboard stats
GET    /api/admin/analytics/revenue    // Revenue metrics
GET    /api/admin/analytics/engagement // Engagement metrics
```

---

## 8. AGENTIC TASK BREAKDOWN

### 8.1 Task Categorization

Tasks are categorized by complexity and autonomy level:

| Level | Description | Human Review | Examples |
|-------|-------------|--------------|----------|
| L1 | Fully Autonomous | None | Create component, write test |
| L2 | Review Recommended | Post-completion | Build feature, API endpoint |
| L3 | Checkpoint Required | Mid-task | Multi-file refactor, new flow |
| L4 | Supervised | Multiple checkpoints | Architecture changes |

### 8.2 Phase 1 Task Queue (MVP)

#### Week 1-2: Foundation

```yaml
TASK-001:
  name: "Setup Next.js Project Structure"
  level: L1
  agent_prompt: |
    Create Next.js 14 project with App Router.
    Setup: TypeScript strict, Tailwind, ESLint, Prettier.
    Folder structure per BLUEPRINT.md section 3.
    Configure path aliases (@/components, @/lib, etc).
  acceptance:
    - Project runs with `npm run dev`
    - TypeScript has no errors
    - Folder structure matches spec
  dependencies: []

TASK-002:
  name: "Import Design System Tokens"
  level: L1
  agent_prompt: |
    Configure Tailwind with Ozean Licht design tokens.
    Colors: ocean blues, turquoise gradients, dark mode.
    Typography: Heading and body scales.
    Spacing: Consistent 4px grid.
    Create tokens documentation in Storybook.
  acceptance:
    - tailwind.config.ts has all custom tokens
    - Storybook shows token documentation
  dependencies: [TASK-001]

TASK-003:
  name: "Import Primitive Components"
  level: L1
  agent_prompt: |
    Move existing primitive components into project.
    Ensure all have Storybook stories.
    Add TypeScript types for all props.
    Components: Button, Input, Card, Badge, Avatar, Modal, etc.
  acceptance:
    - All primitives in /components/ui
    - Each has .stories.tsx file
    - All TypeScript errors resolved
  dependencies: [TASK-002]

TASK-004:
  name: "Setup Database Schema"
  level: L2
  agent_prompt: |
    Create PostgreSQL schema per BLUEPRINT.md section 6.2.
    Use Drizzle ORM for type-safe queries.
    Create migration files.
    Setup seed data for development.
  acceptance:
    - All tables created
    - Drizzle schema matches spec
    - Seed script works
  dependencies: [TASK-001]

TASK-005:
  name: "Setup Authentication System"
  level: L2
  agent_prompt: |
    Implement auth with NextAuth.js or custom JWT.
    Flows: signup, login, logout, password reset.
    Email verification with Resend.
    Protect routes per BLUEPRINT.md section 3.2.
  acceptance:
    - All auth flows work
    - Protected routes redirect to login
    - Email verification sends
  dependencies: [TASK-004]
```

#### Week 3-4: Core Pages

```yaml
TASK-006:
  name: "Build HeroHome Composition"
  level: L1
  agent_prompt: |
    Create homepage hero section.
    Animated water/ocean background (Framer Motion).
    Headline: "Erwecke dein kosmisches Selbst"
    CTA buttons: "Kurse entdecken", "Kostenlos starten"
    Responsive: mobile-first.
  acceptance:
    - Matches design spec
    - Animation performs at 60fps
    - Mobile layout works
    - Storybook story exists
  dependencies: [TASK-003]

TASK-007:
  name: "Build Navbar & Footer"
  level: L1
  agent_prompt: |
    Create responsive Navbar with:
    - Logo, nav links, auth buttons
    - Mobile hamburger menu
    - Sticky on scroll
    Create Footer with:
    - Link columns, social icons, legal links
  acceptance:
    - Desktop and mobile layouts
    - All links work
    - Storybook stories exist
  dependencies: [TASK-003]

TASK-008:
  name: "Build Homepage"
  level: L2
  agent_prompt: |
    Assemble homepage using compositions:
    - HeroHome
    - FeatureGrid (3-4 features)
    - TestimonialCarousel
    - FAQAccordion
    - NewsletterSignup
    - Footer
    SEO: meta tags, Open Graph.
  acceptance:
    - Page renders all sections
    - Lighthouse score >90
    - SEO tags present
  dependencies: [TASK-006, TASK-007]

TASK-009:
  name: "Build CourseCard Composition"
  level: L1
  agent_prompt: |
    Create CourseCard component:
    - Thumbnail image
    - Title, description (truncated)
    - Category badge, level badge
    - Price or "Kostenlos"
    - Instructor avatar + name
    Variants: grid, list
  acceptance:
    - Both variants work
    - Hover states
    - Storybook with all variants
  dependencies: [TASK-003]

TASK-010:
  name: "Build Course Catalog Page"
  level: L2
  agent_prompt: |
    Create /kurse page:
    - HeroGeneric (page title)
    - Filter sidebar (category, level, price)
    - CourseCardGrid with pagination
    - Search input
    Fetch courses from API.
  acceptance:
    - Filters work
    - Pagination works
    - URL params for filters
    - Mobile responsive
  dependencies: [TASK-009, TASK-004]

TASK-011:
  name: "Build Course Detail Page"
  level: L2
  agent_prompt: |
    Create /kurse/[slug] page:
    - Course hero (title, description, instructor)
    - Module accordion (collapsible)
    - Pricing card (sticky on desktop)
    - Testimonials section
    - Related courses
    Handle: enrolled vs not enrolled states.
  acceptance:
    - Dynamic routing works
    - Both states render correctly
    - Mobile layout works
  dependencies: [TASK-009, TASK-004]
```

#### Week 5-6: Video Platform

```yaml
TASK-012:
  name: "Build VideoCard Composition"
  level: L1
  agent_prompt: |
    Create VideoCard component:
    - Thumbnail with play icon overlay
    - Duration badge
    - Title, category
    - Free/Premium badge
    Hover: thumbnail zoom effect
  acceptance:
    - Hover states work
    - Storybook story exists
  dependencies: [TASK-003]

TASK-013:
  name: "Build VideoPlayer Composition"
  level: L2
  agent_prompt: |
    Create custom video player:
    - Vimeo embed integration
    - Custom controls overlay
    - Lightcode markers on timeline
    - Playback speed control
    - Fullscreen support
    Track progress, save to API.
  acceptance:
    - Vimeo plays correctly
    - Markers clickable
    - Progress saves
    - Mobile controls work
  dependencies: [TASK-003, TASK-004]

TASK-014:
  name: "Build Video Library Page"
  level: L2
  agent_prompt: |
    Create /videos page:
    - Category tabs
    - VideoCardGrid
    - Search
    - Filter by category, free/premium
    Free users: show previews, blur premium.
  acceptance:
    - Categories filter
    - Free/premium distinction
    - Search works
  dependencies: [TASK-012, TASK-004]

TASK-015:
  name: "Build Video Player Page"
  level: L2
  agent_prompt: |
    Create /videos/[slug] page:
    - VideoPlayer (main)
    - Transcript toggle panel
    - Notes section (user notes)
    - Comments/Energieaustausch
    - Related videos sidebar
    Auth check for premium content.
  acceptance:
    - Video plays
    - Auth gate works
    - Notes save
    - Comments post
  dependencies: [TASK-013, TASK-005]
```

#### Week 7-8: Payments

```yaml
TASK-016:
  name: "Setup Stripe Integration"
  level: L2
  agent_prompt: |
    Integrate Stripe:
    - Customer creation on signup
    - Checkout sessions (one-time + subscription)
    - Webhook handler for events
    - Payment intent handling
    Store payment records in DB.
  acceptance:
    - Test payments work
    - Webhooks process correctly
    - DB records created
  dependencies: [TASK-004, TASK-005]

TASK-017:
  name: "Build Checkout Flow"
  level: L2
  agent_prompt: |
    Create checkout page:
    - Order summary
    - Stripe Elements integration
    - Success/failure states
    - Email confirmation via Resend
    Handle: courses, events, subscriptions.
  acceptance:
    - All purchase types work
    - Confirmation emails send
    - Redirect to content after success
  dependencies: [TASK-016]

TASK-018:
  name: "Build PricingTable Composition"
  level: L1
  agent_prompt: |
    Create subscription pricing display:
    - Free, Seeker (€18), Angel (€38) tiers
    - Feature comparison
    - CTA buttons per tier
    - Highlight recommended tier
  acceptance:
    - All tiers display
    - CTAs link to checkout
    - Mobile responsive
  dependencies: [TASK-003]
```

#### Week 9-10: User Dashboard

```yaml
TASK-019:
  name: "Build Dashboard Layout"
  level: L2
  agent_prompt: |
    Create dashboard shell:
    - Sidebar navigation
    - Main content area
    - Top bar with user menu
    - Mobile: bottom nav or drawer
    Protected route wrapper.
  acceptance:
    - Layout renders
    - Nav items work
    - Mobile layout
    - Auth protection
  dependencies: [TASK-005, TASK-003]

TASK-020:
  name: "Build Dashboard Home"
  level: L2
  agent_prompt: |
    Create /dashboard page:
    - Welcome message
    - Continue watching (recent videos)
    - My courses progress cards
    - Upcoming events
    - Quick actions
  acceptance:
    - Shows user's data
    - Progress accurate
    - Events display
  dependencies: [TASK-019, TASK-004]

TASK-021:
  name: "Build My Courses Page"
  level: L2
  agent_prompt: |
    Create /dashboard/kurse:
    - Grid of enrolled courses
    - Progress indicators
    - Filter: in progress, completed
    - Empty state for no courses
  acceptance:
    - Shows enrolled courses
    - Progress displays
    - Empty state works
  dependencies: [TASK-019, TASK-009]

TASK-022:
  name: "Build Profile Settings"
  level: L2
  agent_prompt: |
    Create /dashboard/profil:
    - Personal info form
    - Avatar upload
    - Password change
    - Email preferences
    - Delete account
  acceptance:
    - Forms submit
    - Avatar uploads
    - Validation works
  dependencies: [TASK-019, TASK-005]

TASK-023:
  name: "Build Billing Page"
  level: L2
  agent_prompt: |
    Create /dashboard/billing:
    - Current subscription status
    - Payment method management
    - Invoice history
    - Upgrade/downgrade options
    - Cancel subscription
  acceptance:
    - Shows Stripe data
    - Can update payment
    - Can cancel
  dependencies: [TASK-019, TASK-016]
```

#### Week 11-12: Polish & Launch

```yaml
TASK-024:
  name: "SEO Optimization"
  level: L1
  agent_prompt: |
    Add SEO across all pages:
    - Meta titles and descriptions
    - Open Graph images
    - Twitter cards
    - Schema.org markup (Course, Event, Person)
    - Sitemap.xml generation
    - Robots.txt
  acceptance:
    - All pages have meta
    - Social previews work
    - Sitemap generates
  dependencies: [TASK-008, TASK-010, TASK-014]

TASK-025:
  name: "Performance Audit"
  level: L2
  agent_prompt: |
    Optimize for Core Web Vitals:
    - Image optimization (next/image)
    - Code splitting
    - Font optimization
    - Lazy loading
    - Caching headers
    Target: Lighthouse >90 all categories.
  acceptance:
    - Lighthouse >90
    - LCP <2.5s
    - CLS <0.1
  dependencies: [All page tasks]

TASK-026:
  name: "Content Migration"
  level: L3
  agent_prompt: |
    Migrate existing content:
    - Import 95 videos with metadata
    - Import 3 magazine articles
    - Setup course structures
    - Import testimonials
    Create migration script.
  acceptance:
    - All videos in DB
    - All content accessible
    - No broken links
  dependencies: [TASK-004, TASK-013]

TASK-027:
  name: "Testing Suite"
  level: L2
  agent_prompt: |
    Setup testing:
    - Vitest for unit tests
    - Playwright for E2E
    - Test auth flows
    - Test checkout flows
    - Test video playback
  acceptance:
    - CI runs tests
    - Critical paths covered
    - No flaky tests
  dependencies: [All feature tasks]

TASK-028:
  name: "Deployment Setup"
  level: L2
  agent_prompt: |
    Configure Coolify deployment:
    - Docker containerization
    - Environment variables
    - Database connection
    - SSL certificates
    - Health checks
    - Rollback capability
  acceptance:
    - Deploys successfully
    - HTTPS works
    - Env vars secure
  dependencies: [TASK-001]
```

### 8.3 Agent Context Template

When assigning tasks to agents, use this context template:

```markdown
# TASK CONTEXT

## Blueprint Reference
- Section: [Relevant BLUEPRINT.md sections]
- User Flows: [Relevant flows from section 4]
- Components: [Required components from section 5]

## Task Details
- ID: TASK-XXX
- Name: [Task name]
- Level: [L1-L4]
- Dependencies: [List of completed tasks]

## Acceptance Criteria
1. [Criterion 1]
2. [Criterion 2]
3. [Criterion 3]

## Technical Constraints
- Follow existing patterns in codebase
- Use primitives from /components/ui
- Maintain TypeScript strict mode
- Write Storybook story if UI component
- Update relevant documentation

## Resources
- Design: [Figma link if available]
- API Spec: [Relevant API routes]
- Similar implementations: [Existing code references]

## Output Requirements
- Files to create/modify: [List]
- Tests required: [Yes/No, type]
- Documentation updates: [List]
```

---

## 9. QUALITY GATES

### 9.1 Code Quality

```yaml
Linting:
  - ESLint with Next.js config
  - Prettier for formatting
  - TypeScript strict mode (no any)
  
Testing:
  - Unit tests for utilities
  - Component tests for UI
  - E2E for critical flows
  - Minimum 70% coverage

Performance:
  - Lighthouse >90 all categories
  - Bundle size budget: <200KB initial JS
  - No layout shift (CLS <0.1)
  
Accessibility:
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader tested
```

### 9.2 Review Checklist

Before merging any feature:

```markdown
## PR Review Checklist

### Code
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] No console.logs in production code
- [ ] Error handling for async operations
- [ ] Loading states implemented

### UI/UX
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Matches design spec
- [ ] Hover/focus states
- [ ] Dark mode compatible (if applicable)
- [ ] Accessibility (labels, ARIA)

### Testing
- [ ] Unit tests for logic
- [ ] Storybook story (if UI)
- [ ] E2E test (if critical path)

### Documentation
- [ ] Component props documented
- [ ] README updated (if needed)
- [ ] CHANGELOG entry (if user-facing)

### Security
- [ ] No secrets in code
- [ ] Input validation
- [ ] Auth checks where needed
```

---

## 10. APPENDIX

### 10.1 Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://ozean-licht.com
NEXT_PUBLIC_APP_NAME="Ozean Licht Akademie"

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vimeo
VIMEO_ACCESS_TOKEN=...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=academy@ozean-licht.com

# Analytics
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ozean-licht.com

# External
ZOOM_API_KEY=...
ZOOM_API_SECRET=...
```

### 10.2 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run storybook        # Start Storybook
npm run db:studio        # Open Drizzle Studio
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Coverage report

# Build & Deploy
npm run build            # Production build
npm run lint             # Lint check
npm run typecheck        # TypeScript check
```

### 10.3 Glossary

| Term | Definition |
|------|------------|
| LCQ® | Light Code Quantum Transformation - proprietary methodology |
| Herzportal | Heart-based consciousness tool |
| Athemirah School | Flagship 2-year education program |
| Lightcode Markers | Timeline markers for energetic moments in videos |
| Safe Space | Protected environment for transformation |
| Grid Work | Collective energetic practice |
| Ascension | Spiritual awakening/evolution process |

---

## DOCUMENT HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-25 | Claude | Initial blueprint from PRD v1.0 |

---

*This document serves as the single source of truth for agentic development of Ozean Licht Akademie. All agents should reference this blueprint before executing tasks.*