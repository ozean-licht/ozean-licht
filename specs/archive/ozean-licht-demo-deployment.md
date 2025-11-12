# Plan: Ozean Licht Demo Deployment

## Task Description

Deploy the Ozean Licht Next.js application as a **demonstration-only showcase** to present the design and UX to the team. This deployment will not include functional features like authentication, database connectivity, or backend services. The goal is to create a navigable static/semi-static demo that showcases:
- Homepage with mystical cosmic design
- Course catalog with course cards
- Individual course detail pages
- Contact/About pages
- Clean, professional navigation

The deployment will involve cleaning up the 344MB `ozean-licht_OLD` directory, migrating essential presentational components, stubbing out authentication, creating mock data, and deploying to Coolify.

## Objective

**Primary Goal:** Deploy a visually impressive, navigable Ozean Licht web application to Coolify that demonstrates the platform's design language, UX patterns, and content structure without requiring backend infrastructure (no auth, no database).

**Success Criteria:**
- Application builds successfully with no errors
- All pages are navigable without authentication
- Design system (cosmic theme, glass effects, Ozean branding) is fully intact
- Mock course data displays properly in catalog and detail views
- Deployed and accessible via Coolify at a public URL
- Repository size reduced by ~340MB through OLD directory removal

## Problem Statement

The current Ozean Licht application is in a migration phase:
- **NEW** directory has minimal implementation (placeholder homepage only)
- **OLD** directory contains full Supabase-based app (344MB) with 50+ components
- Only 32 of 73 components have been migrated (44% complete)
- Dependencies are defined but not installed
- Current state is not deployable or demonstrable

**Challenge:** Extract maximum demonstration value from existing components while eliminating technical debt and preparing for future production implementation.

## Solution Approach

**Strategy:** Selective component migration + stubbing + mock data

1. **Preserve Before Cleanup**: Copy 8-10 essential presentational components from OLD directory before deletion
2. **Remove Technical Debt**: Delete 344MB OLD directory to reduce repo size
3. **Stub Dependencies**: Remove Supabase auth logic from header/footer, replace with static "demo mode"
4. **Create Mock Data**: Generate realistic course, testimonial, and blog data for demonstration
5. **Build Demo Pages**: Construct homepage, courses catalog, course detail, about, and contact pages
6. **Configure for Deployment**: Set up environment variables, build configuration, and Coolify deployment

**Key Insight:** Supabase asset URLs (images, videos) remain functional as public CDN links, so we can continue using them without backend access.

## Relevant Files

### Existing Files to Modify

- **`apps/ozean-licht/components/layout/header.tsx`** - Remove Supabase auth (lines 28-29, 42-47, 63-64), stub user state
- **`apps/ozean-licht/components/layout/footer.tsx`** - Verify no dynamic dependencies
- **`apps/ozean-licht/app/page.tsx`** - Replace placeholder with full homepage
- **`apps/ozean-licht/app/layout.tsx`** - Already configured with fonts and dark mode ✓
- **`apps/ozean-licht/package.json`** - Dependencies defined, need installation
- **`apps/ozean-licht/.env.example`** - Template for demo environment variables
- **`apps/ozean-licht/tailwind.config.js`** - Ozean branding already configured ✓
- **`apps/ozean-licht/next.config.js`** - Standalone build mode configured ✓

### New Files to Create

- **`apps/ozean-licht/lib/mock-data/courses.ts`** - 15-20 mock courses with realistic data
- **`apps/ozean-licht/lib/mock-data/testimonials.ts`** - 8-10 testimonials
- **`apps/ozean-licht/lib/mock-data/blog.ts`** - 5-8 blog posts
- **`apps/ozean-licht/lib/mock-data/index.ts`** - Export barrel file
- **`apps/ozean-licht/app/courses/page.tsx`** - Course catalog page
- **`apps/ozean-licht/app/courses/[slug]/page.tsx`** - Dynamic course detail page
- **`apps/ozean-licht/app/about-lia/page.tsx`** - About page
- **`apps/ozean-licht/app/contact/page.tsx`** - Contact form page (mock submission)
- **`apps/ozean-licht/.env.local`** - Demo environment variables (copy from .env.example)
- **`apps/ozean-licht/public/logo.png`** - Copy logo from OLD assets or use Supabase URL
- **`apps/ozean-licht/public/favicon.ico`** - Favicon

### Files to Copy from OLD (Before Deletion)

- **`ozean-licht_OLD/components/primary-button.tsx`** → `components/layout/primary-button.tsx`
- **`ozean-licht_OLD/components/nav-button.tsx`** → `components/layout/nav-button.tsx`
- **`ozean-licht_OLD/components/language-picker.tsx`** → `components/layout/language-picker.tsx`
- **`ozean-licht_OLD/components/footer-nav.tsx`** → `components/layout/footer-nav.tsx`
- **`ozean-licht_OLD/components/legal-nav.tsx`** → `components/layout/legal-nav.tsx`
- **`ozean-licht_OLD/components/hero.tsx`** → `components/layout/hero.tsx`
- **`ozean-licht_OLD/components/course-preview.tsx`** → `components/layout/course-preview.tsx`
- **`ozean-licht_OLD/components/testimonials-preview.tsx`** → `components/layout/testimonials-preview.tsx`
- **`ozean-licht_OLD/components/quick-faq.tsx`** → `components/layout/quick-faq.tsx`
- **`ozean-licht_OLD/components/our-promise.tsx`** → `components/layout/our-promise.tsx`

### Files to Delete

- **`apps/ozean-licht/ozean-licht_OLD/`** - Entire directory (344MB) after component extraction

## Implementation Phases

### Phase 1: Pre-Cleanup Preparation (1-2 hours)

**Goal:** Extract essential components before deleting OLD directory

1. Install dependencies in NEW directory
2. Copy 10 essential presentational components from OLD
3. Verify copied components compile without errors
4. Create backup of OLD directory structure documentation

**Rationale:** Once OLD is deleted, we cannot recover components. Extract what we need first.

### Phase 2: Cleanup & Stubbing (30 minutes)

**Goal:** Reduce repository size and remove non-demo code

1. Delete ozean-licht_OLD directory (344MB → 0MB)
2. Stub out Supabase auth in header.tsx
3. Remove any other backend/API dependencies
4. Verify build still works after cleanup

**Expected Impact:** Repository size reduction, clearer codebase, faster clone/build times.

### Phase 3: Demo Content Creation (2-3 hours)

**Goal:** Build navigable demo with mock data

1. Create comprehensive mock data (courses, testimonials, blogs)
2. Build homepage with hero, course preview, testimonials, FAQ sections
3. Build courses catalog page with filtering UI
4. Build dynamic course detail page
5. Build about and contact pages
6. Ensure all navigation links work correctly

**Visual Goal:** Professional, impressive demo that showcases design without revealing "under construction" state.

### Phase 4: Deployment to Coolify (1 hour)

**Goal:** Deploy to production Coolify instance

1. Configure environment variables for demo
2. Create Coolify application configuration
3. Deploy via Coolify dashboard or CLI
4. Verify deployment works and is accessible
5. Test all pages and navigation in production

**Target URL:** `https://ozean-licht.ozean-licht.dev` or similar

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Install Dependencies

```bash
cd apps/ozean-licht
pnpm install
```

**Verify:**
```bash
pnpm typecheck  # Should pass with no errors
```

### 2. Copy Essential Components from OLD

Copy 10 critical components before deleting OLD directory:

```bash
# Navigate to ozean-licht directory
cd apps/ozean-licht

# Copy navigation/layout essentials (5 components)
cp ozean-licht_OLD/components/primary-button.tsx components/layout/
cp ozean-licht_OLD/components/nav-button.tsx components/layout/
cp ozean-licht_OLD/components/language-picker.tsx components/layout/
cp ozean-licht_OLD/components/footer-nav.tsx components/layout/
cp ozean-licht_OLD/components/legal-nav.tsx components/layout/

# Copy homepage sections (5 components)
cp ozean-licht_OLD/components/hero.tsx components/layout/
cp ozean-licht_OLD/components/our-promise.tsx components/layout/
cp ozean-licht_OLD/components/course-preview.tsx components/layout/
cp ozean-licht_OLD/components/testimonials-preview.tsx components/layout/
cp ozean-licht_OLD/components/quick-faq.tsx components/layout/
```

**Verify:**
- Run `pnpm typecheck` to check for import errors
- Fix any missing dependencies (likely none, all components are self-contained or use UI primitives)

### 3. Stub Out Supabase Auth in Header

**Edit:** `apps/ozean-licht/components/layout/header.tsx`

**Changes:**
1. Remove Supabase imports (lines 28-29, 42-47, 63-64)
2. Hardcode `user = null` (demo mode - no logged in user)
3. Remove auth state listener
4. Comment out sign-out handler
5. Keep "Registrieren" and "Anmelden" buttons as UI elements (link to `#` or `/register`, `/login` placeholder pages)

**Example stub:**
```typescript
// OLD (remove):
const { supabase } = await import('@/lib/supabase')
const { data: { user } } = await supabase.auth.getUser()

// NEW (demo mode):
const user = null; // Demo mode - no authentication
const loading = false; // Always loaded in demo
```

**Verify:**
- Header renders without errors
- No Supabase import errors
- Navigation buttons are visible but non-functional

### 4. Create Mock Data Library

**Create directory:** `apps/ozean-licht/lib/mock-data/`

**File 1:** `apps/ozean-licht/lib/mock-data/courses.ts`

Create 15-20 courses with realistic data:
```typescript
import { Course } from '@/types/course';

export const mockCourses: Course[] = [
  {
    id: '1',
    slug: 'lcq-basis',
    title: 'LCQ® Basis Kurs',
    subtitle: 'Grundlagen der Light Code Quantum Transformation',
    description: 'Entdecke die Grundlagen der LCQ® Methode und beginne deine Reise zur spirituellen Transformation...',
    price: 497,
    is_public: true,
    thumbnail_url_desktop: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_images/lcq-basis.jpg',
    course_code: 101,
    tags: ['LCQ', 'Basis'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  // ... add 14-19 more courses
  // Include variety: LCQ (yellow tags), Master (rose tags), Basis (blue tags)
  // Price range: 297-997 EUR
];
```

**File 2:** `apps/ozean-licht/lib/mock-data/testimonials.ts`

```typescript
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria K.',
    role: 'LCQ® Absolventin',
    content: 'Die Ozean Licht Akademie hat mein Leben verändert. Die Kurse sind tiefgründig und transformativ.',
    rating: 5,
  },
  // ... add 7-9 more
];
```

**File 3:** `apps/ozean-licht/lib/mock-data/blog.ts`

```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  published_at: string;
  author: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'einfuehrung-lcq',
    title: 'Einführung in die LCQ® Methode',
    excerpt: 'Was ist Light Code Quantum und wie kann es dein Leben transformieren?',
    published_at: '2025-01-15T00:00:00Z',
    author: 'Lia Oberhauser',
  },
  // ... add 4-7 more
];
```

**File 4:** `apps/ozean-licht/lib/mock-data/index.ts`

```typescript
export * from './courses';
export * from './testimonials';
export * from './blog';
```

### 5. Build Enhanced Homepage

**Edit:** `apps/ozean-licht/app/page.tsx`

Replace placeholder with full homepage:

```typescript
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/layout/hero';
import { OurPromise } from '@/components/layout/our-promise';
import { CoursePreview } from '@/components/layout/course-preview';
import { TestimonialsPreview } from '@/components/layout/testimonials-preview';
import { QuickFaq } from '@/components/layout/quick-faq';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <OurPromise />
        <CoursePreview />
        <TestimonialsPreview />
        <QuickFaq />
      </main>
      <Footer />
    </div>
  );
}
```

**Note:** Adjust section components if they require data props - pass mock data from `lib/mock-data`.

### 6. Build Courses Catalog Page

**Create:** `apps/ozean-licht/app/courses/page.tsx`

```typescript
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseCard } from '@/components/course/course-card';
import { mockCourses } from '@/lib/mock-data';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-decorative text-center mb-4 text-primary">
            Unsere Kurse
          </h1>
          <p className="text-center text-muted-foreground mb-12 font-montserrat max-w-2xl mx-auto">
            Entdecke unsere transformativen Kurse für spirituelles Wachstum und kosmisches Bewusstsein
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

### 7. Build Dynamic Course Detail Page

**Create:** `apps/ozean-licht/app/courses/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { mockCourses } from '@/lib/mock-data';
import { Badge } from '@/components/layout/badge';
import { PrimaryButton } from '@/components/layout/primary-button';

export function generateStaticParams() {
  return mockCourses.map((course) => ({
    slug: course.slug,
  }));
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = mockCourses.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Course header */}
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex gap-2 mb-4">
              {course.tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <h1 className="text-4xl font-decorative text-primary mb-2">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="text-xl text-muted-foreground mb-6 font-montserrat-alt">
                {course.subtitle}
              </p>
            )}
            <p className="text-foreground/80 mb-6 font-montserrat">
              {course.description}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary">
                €{course.price}
              </p>
              <PrimaryButton onClick={() => alert('Demo-Modus: Kaufen nicht verfügbar')}>
                Jetzt kaufen
              </PrimaryButton>
            </div>
          </div>

          {/* Course modules placeholder */}
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-decorative mb-4">Kursinhalt</h2>
            <p className="text-muted-foreground font-montserrat">
              Detaillierter Kursinhalt wird nach dem Kauf verfügbar sein.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

### 8. Build About Page

**Create:** `apps/ozean-licht/app/about-lia/page.tsx`

```typescript
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-decorative text-center mb-8 text-primary">
            Über Lia Oberhauser
          </h1>
          <div className="glass-card p-8 rounded-2xl">
            <p className="text-foreground/80 font-montserrat leading-relaxed mb-4">
              Lia Oberhauser ist die Gründerin der Ozean Licht Akademie und Pionierin der LCQ® (Light Code Quantum) Methode.
            </p>
            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Mit über 15 Jahren Erfahrung in spiritueller Transformation begleitet sie Menschen auf ihrem Weg zu kosmischem Bewusstsein und innerem Frieden.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

### 9. Build Contact Page

**Create:** `apps/ozean-licht/app/contact/page.tsx`

```typescript
'use client'

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrimaryButton } from '@/components/layout/primary-button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo-Modus: Nachricht würde gesendet werden.\n\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-decorative text-center mb-8 text-primary">
            Kontakt
          </h1>
          <div className="glass-card p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dein Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">E-Mail</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="deine@email.de"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nachricht</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Deine Nachricht..."
                  rows={6}
                  required
                />
              </div>
              <PrimaryButton type="submit">
                Nachricht senden
              </PrimaryButton>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

### 10. Configure Environment Variables

**Create:** `apps/ozean-licht/.env.local`

```bash
# Copy from .env.example and adjust for demo
NEXT_PUBLIC_APP_URL=http://localhost:3001
FRONTEND_PORT=3001

# NextAuth (not used in demo, but required for build)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=demo-secret-not-used-in-production

# MCP Gateway (not used in demo)
MCP_GATEWAY_URL=http://localhost:8100
DATABASE_NAME=ozean_licht_db

# Cloudflare (not needed for demo - using Supabase asset URLs)
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

### 11. Test Local Build

**Build the application:**
```bash
cd apps/ozean-licht
pnpm build
```

**Expected output:** Successful build with static page generation for all routes

**Start production server:**
```bash
pnpm start
```

**Test in browser:**
- Navigate to `http://localhost:3001`
- Test all pages: Homepage, Courses, Course detail, About, Contact
- Verify navigation works
- Check design (cosmic theme, glass effects, fonts)
- Test form submission alert on contact page

### 12. Delete OLD Directory

**IMPORTANT:** Only after verifying build works!

```bash
cd apps/ozean-licht
rm -rf ozean-licht_OLD
```

**Verify deletion:**
```bash
du -sh .  # Should be ~50MB instead of ~350MB
```

**Commit cleanup:**
```bash
git add -A
git commit -m "chore(ozean-licht): remove 344MB OLD directory after component migration"
```

### 13. Configure Coolify Deployment

**Option A: Via Coolify Dashboard**

1. Navigate to http://coolify.ozean-licht.dev:8000
2. Create new application → "Next.js"
3. Repository: ozean-licht-ecosystem (monorepo)
4. Build directory: `apps/ozean-licht`
5. Build command: `cd ../.. && pnpm install && pnpm --filter @ol/web build`
6. Start command: `cd apps/ozean-licht && pnpm start`
7. Port: 3001
8. Environment variables: Copy from `.env.local`
9. Domain: `ozean-licht.ozean-licht.dev` (or subdomain)
10. Deploy

**Option B: Via MCP Gateway (Coolify MCP Tool)**

```bash
# From repository root
/mcp-coolify deploy-application ozean-licht \
  --build-dir apps/ozean-licht \
  --build-cmd "pnpm install && pnpm --filter @ol/web build" \
  --start-cmd "pnpm --filter @ol/web start" \
  --port 3001 \
  --domain ozean-licht.ozean-licht.dev
```

### 14. Verify Production Deployment

**Post-deployment checks:**

1. Access deployed URL (e.g., `https://ozean-licht.ozean-licht.dev`)
2. Test all pages:
   - Homepage (hero, sections, navigation)
   - Courses catalog (15-20 courses displayed)
   - Individual course detail pages (click 3-5 courses)
   - About page (content displays)
   - Contact page (form renders, alert on submit)
3. Test navigation:
   - Header nav links work
   - Footer nav links work
   - Logo links back to homepage
4. Verify design:
   - Cosmic gradient background
   - Glass card effects
   - Font loading (Cinzel Decorative, Montserrat)
   - Primary color (#0ec2bc) is correct
   - Animations (glow, float) work
5. Mobile responsiveness:
   - Test on mobile viewport
   - Check header collapses properly
   - Cards stack vertically

### 15. Final Documentation

**Create deployment summary:**

```markdown
# Ozean Licht Demo Deployment

**Deployed:** 2025-11-10
**URL:** https://ozean-licht.ozean-licht.dev
**Status:** Demo/Showcase only - No functionality

## Available Pages
- Homepage - Full sections (hero, promise, courses, testimonials, FAQ)
- /courses - Course catalog with 15-20 courses
- /courses/[slug] - Individual course detail pages
- /about-lia - About page
- /contact - Contact form (mock submission)

## Known Limitations (Demo Mode)
- No authentication (login/register buttons non-functional)
- No database (all data is mocked)
- No payment processing
- Contact form displays alert instead of sending email
- Course purchase displays alert

## Design Features Showcased
✅ Cosmic gradient backgrounds
✅ Glass morphism card effects
✅ Ozean Licht branding (primary teal #0ec2bc)
✅ Custom fonts (Cinzel Decorative, Montserrat)
✅ Animations (glow, float, shine)
✅ Tag system with color coding
✅ Responsive layout (desktop/tablet/mobile)
✅ German language content

## Next Steps for Production
1. Implement NextAuth v5 authentication
2. Connect to PostgreSQL via MCP Gateway
3. Implement real course data fetching
4. Add payment integration (Ablefy/Stripe)
5. Build user dashboard
6. Implement course learning interface
```

## Testing Strategy

### Unit Testing
- Not required for demo deployment (no complex logic)
- Future: Test mock data structure matches TypeScript types

### Integration Testing
- Verify all copied components render without errors
- Test navigation links route correctly
- Confirm mock data displays in components

### Visual Testing
- Manual QA of all pages in dev and production
- Compare OLD design screenshots with NEW demo pages
- Verify cosmic theme, glass effects, and branding

### Edge Cases
- **Missing course slug:** Test `/courses/nonexistent` → should show 404
- **Empty mock data:** Ensure components handle empty arrays gracefully
- **Form validation:** Contact form should require all fields
- **Mobile viewport:** Test header, cards, and forms on small screens

## Acceptance Criteria

✅ **Build Success:** Application builds with `pnpm build` with zero errors
✅ **Dependency Removal:** ozean-licht_OLD directory deleted (repo size reduced by ~340MB)
✅ **Component Migration:** 10 essential components copied and functional
✅ **Auth Stubbed:** No Supabase auth errors, header renders in demo mode
✅ **Mock Data:** 15-20 courses, 8-10 testimonials, 5-8 blog posts created
✅ **Pages Functional:** Homepage, courses catalog, course detail, about, contact all work
✅ **Navigation:** All nav links route correctly, no broken links
✅ **Design Intact:** Cosmic theme, glass effects, Ozean branding fully preserved
✅ **Deployed to Coolify:** Application accessible at public URL
✅ **Mobile Responsive:** All pages work on mobile viewport

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# 1. Verify dependencies installed
cd apps/ozean-licht && pnpm list --depth=0

# 2. Typecheck (should pass with no errors)
pnpm typecheck

# 3. Build (should succeed)
pnpm build

# 4. Verify OLD directory deleted
ls ozean-licht_OLD 2>&1 | grep "No such file or directory"

# 5. Check repository size reduction
du -sh . | awk '{print $1}'  # Should be ~50MB, not ~350MB

# 6. Verify mock data files exist
ls -la lib/mock-data/

# 7. Verify all pages exist
ls -la app/courses/
ls -la app/about-lia/
ls -la app/contact/

# 8. Start dev server and test
pnpm dev
# Open http://localhost:3001 and manually test all pages

# 9. Verify production build runs
pnpm start
# Access http://localhost:3001 and test

# 10. Check deployment status (via Coolify dashboard)
# Navigate to http://coolify.ozean-licht.dev:8000
# Verify "ozean-licht" application shows "Running" status
```

## Notes

### Key Decisions

1. **Keep Supabase Asset URLs:** Public CDN links remain functional without backend, saves migration time
2. **Static Generation:** Use Next.js `generateStaticParams` for course detail pages (fast, SEO-friendly)
3. **Mock Data Structure:** Matches TypeScript `Course` interface exactly for future database compatibility
4. **Component Strategy:** Copy only essential 10 components, avoid over-migration before full implementation
5. **No Auth Migration:** Stub completely rather than partial NextAuth implementation (cleaner demo)

### Future Considerations

**When transitioning to production:**
- Replace mock data imports with MCP Gateway queries
- Implement NextAuth v5 with magic link auth
- Add course enrollment and progress tracking
- Build course learning interface with video player
- Implement payment integration
- Add admin dashboard for content management

### Dependencies

**Required for build:**
- Node.js >=18.0.0
- pnpm (workspace support)
- No external services needed for demo

**Required for deployment:**
- Coolify instance (http://coolify.ozean-licht.dev:8000)
- Domain/subdomain configured
- SSL certificate (Coolify auto-provisions via Let's Encrypt)

### Estimated Time

| Phase | Duration |
|-------|----------|
| Install deps + copy components | 1 hour |
| Stub auth + create mock data | 1.5 hours |
| Build pages (5 pages) | 2 hours |
| Test + fix issues | 1 hour |
| Delete OLD + cleanup | 30 min |
| Deploy to Coolify | 1 hour |
| **Total** | **7 hours** |

**Complexity:** Medium
**Risk:** Low (demo only, no production impact)
**Value:** High (team can see design, gather feedback, validate approach)
