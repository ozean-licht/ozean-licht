# Plan: Phase 4 - Tier 3 Composition Components

## Task Description

Build Tier 3 composition components for the shared UI component library. These are complex, pre-composed patterns that combine Tier 1 (shadcn + Catalyst primitives) and Tier 2 (branded components) into ready-to-use application-specific components and layouts.

This phase creates 15+ composition components including course cards, testimonial cards, pricing cards, CTAs, authentication forms, and layout templates that can be shared across Ozean Licht and Admin applications.

## Objective

Create a complete Tier 3 composition layer with:
- 8+ card compositions (CourseCard, TestimonialCard, PricingCard, BlogCard, etc.)
- 3+ section compositions (CTASection, FeatureSection, HeroSection)
- 3+ authentication forms (LoginForm, PasswordResetForm, MagicLinkForm)
- 3+ layout templates (DashboardLayout, MarketingLayout, AuthLayout)
- Full TypeScript type safety and proper exports
- Migration path for existing components in ozean-licht app

## Problem Statement

Currently, complex components like CourseCard, TestimonialCard, and authentication forms are scattered across individual applications (`apps/ozean-licht/`, `apps/admin/`). This creates:

1. **Code Duplication:** Same patterns implemented multiple times
2. **Inconsistent Branding:** Slight variations in styling across apps
3. **Maintenance Overhead:** Changes require updates in multiple places
4. **Slow Feature Development:** Building new features requires reimplementing common patterns

A shared composition layer will provide pre-built, battle-tested components that maintain consistency while accelerating development.

## Solution Approach

Create a `src/compositions/` directory with organized subdirectories:

```
src/compositions/
├── cards/          # Card-based compositions
├── sections/       # Full-width section compositions
├── forms/          # Authentication & data entry forms
├── layouts/        # Page layout templates
└── index.ts        # Barrel exports
```

**Strategy:**
1. Extract proven components from ozean-licht app
2. Refactor to use Tier 2 branded components
3. Add TypeScript interfaces for all props
4. Create comprehensive examples and documentation
5. Export from `@ozean-licht/shared-ui/compositions`

## Relevant Files

### Existing Files to Reference

- `apps/ozean-licht/components/course-card-modern.tsx` - Source for CourseCard composition
- `apps/ozean-licht/components/testimonial-card.tsx` - Source for TestimonialCard
- `apps/ozean-licht/components/cta-1.tsx` - Source for CTASection
- `apps/ozean-licht/components/cta-2.tsx` - Source for alternate CTA pattern
- `apps/ozean-licht/components/login-form.tsx` - Source for LoginForm
- `apps/ozean-licht/components/password-reset-form.tsx` - Source for PasswordResetForm
- `apps/ozean-licht/components/magic-link-form.tsx` - Source for MagicLinkForm
- `apps/ozean-licht/components/blog-item.tsx` - Source for BlogCard
- `apps/ozean-licht/components/info-card.tsx` - Source for FeatureCard
- `apps/ozean-licht/components/hero.tsx` - Source for HeroSection

### Tier 2 Components to Use

- `shared/ui-components/src/components/Button.tsx` - Branded button with CTA variant
- `shared/ui-components/src/components/Card.tsx` - Glass card with variants
- `shared/ui-components/src/components/Input.tsx` - Themed input with glow
- `shared/ui-components/src/components/Dialog.tsx` - Modal with glass background
- `shared/ui-components/src/components/Badge.tsx` - Badge with glow effect

### Catalyst Components to Use

- `shared/ui-components/src/catalyst/layouts/sidebar-layout.tsx` - For DashboardLayout
- `shared/ui-components/src/catalyst/layouts/auth-layout.tsx` - For AuthLayout
- `shared/ui-components/src/catalyst/navigation/navbar.tsx` - For layout headers
- `shared/ui-components/src/catalyst/navigation/sidebar.tsx` - For layout sidebars

### shadcn Components to Use

- `shared/ui-components/src/ui/form.tsx` - Form handling with react-hook-form
- `shared/ui-components/src/ui/avatar.tsx` - For user avatars in testimonials
- `shared/ui-components/src/ui/separator.tsx` - Visual separators
- `shared/ui-components/src/ui/skeleton.tsx` - Loading states

### New Files

All files will be created in `/opt/ozean-licht-ecosystem/shared/ui-components/src/compositions/`

#### Cards Directory (`cards/`)
- `CourseCard.tsx` - Course display card with image, title, description, price
- `TestimonialCard.tsx` - Testimonial with name, location, quote
- `PricingCard.tsx` - Pricing tier with features, price, CTA
- `BlogCard.tsx` - Blog post preview with image, title, excerpt
- `FeatureCard.tsx` - Feature highlight with icon, title, description
- `StatsCard.tsx` - Statistic display with number, label, trend
- `index.ts` - Barrel exports for cards

#### Sections Directory (`sections/`)
- `CTASection.tsx` - Call-to-action section with video background
- `HeroSection.tsx` - Hero section with title, subtitle, CTA
- `FeatureSection.tsx` - Grid of feature cards
- `TestimonialsSection.tsx` - Grid or carousel of testimonials
- `PricingSection.tsx` - Pricing tiers comparison
- `index.ts` - Barrel exports for sections

#### Forms Directory (`forms/`)
- `LoginForm.tsx` - Email/password login form
- `RegisterForm.tsx` - User registration form
- `PasswordResetForm.tsx` - Password reset request form
- `MagicLinkForm.tsx` - Magic link authentication form
- `ContactForm.tsx` - General contact/feedback form
- `index.ts` - Barrel exports for forms

#### Layouts Directory (`layouts/`)
- `DashboardLayout.tsx` - Admin dashboard layout with sidebar
- `MarketingLayout.tsx` - Marketing site layout with header/footer
- `AuthLayout.tsx` - Authentication pages layout
- `index.ts` - Barrel exports for layouts

#### Root Files
- `index.ts` - Main barrel export for all compositions
- `types.ts` - Shared TypeScript interfaces and types

### Package Configuration

- `package.json` - Already configured with `./compositions` export path
- `shared/ui-components/src/index.ts` - Update main index if needed

## Implementation Phases

### Phase 1: Foundation (30 minutes)

**Goal:** Set up directory structure and type definitions

1. Create composition directory structure
2. Define shared TypeScript interfaces
3. Create barrel export files
4. Set up example patterns

### Phase 2: Core Card Compositions (1.5 hours)

**Goal:** Build essential card components

1. Migrate CourseCard from ozean-licht
2. Create TestimonialCard with avatar support
3. Build PricingCard with feature lists
4. Create BlogCard with image handling
5. Build FeatureCard for info displays
6. Add StatsCard for metrics

### Phase 3: Section Compositions (1 hour)

**Goal:** Build full-width section components

1. Create CTASection with video background support
2. Build HeroSection with multiple variants
3. Create FeatureSection as grid layout
4. Build TestimonialsSection with carousel option
5. Create PricingSection with comparison table

### Phase 4: Form Compositions (45 minutes)

**Goal:** Build authentication and data entry forms

1. Create LoginForm with validation
2. Build RegisterForm with terms acceptance
3. Create PasswordResetForm with success states
4. Build MagicLinkForm for passwordless auth
5. Create ContactForm with field validation

### Phase 5: Layout Templates (45 minutes)

**Goal:** Build page layout templates

1. Create DashboardLayout using Catalyst SidebarLayout
2. Build MarketingLayout with responsive header/footer
3. Create AuthLayout using Catalyst AuthLayout
4. Add responsive breakpoint handling
5. Test layout compositions

### Phase 6: Documentation & Exports (30 minutes)

**Goal:** Complete exports and add usage documentation

1. Verify all barrel exports work correctly
2. Add JSDoc comments to all components
3. Create usage examples in comments
4. Test imports from consumer applications
5. Update UPGRADE_PLAN.md with completion status

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Create Directory Structure and Type Definitions

- Create `/opt/ozean-licht-ecosystem/shared/ui-components/src/compositions/cards/` directory
- Create `/opt/ozean-licht-ecosystem/shared/ui-components/src/compositions/sections/` directory
- Create `/opt/ozean-licht-ecosystem/shared/ui-components/src/compositions/forms/` directory
- Create `/opt/ozean-licht-ecosystem/shared/ui-components/src/compositions/layouts/` directory
- Create `types.ts` with shared interfaces (Course, Testimonial, PricingTier, etc.)
- Create placeholder `index.ts` files in each subdirectory

### 2. Build Card Compositions

- Extract CourseCard from `apps/ozean-licht/components/course-card-modern.tsx`
- Refactor to use Button and Card from Tier 2
- Add proper TypeScript interface for CourseCardProps
- Create TestimonialCard with Avatar component
- Add TestimonialCardProps interface
- Build PricingCard with feature list and CTA
- Create PricingCardProps interface
- Build BlogCard with image, title, excerpt, date
- Create BlogCardProps interface
- Build FeatureCard with icon, title, description
- Create StatsCard for metrics display
- Add barrel export in `cards/index.ts`

### 3. Build Section Compositions

- Create CTASection with video background support
- Extract logic from `apps/ozean-licht/components/cta-1.tsx`
- Add responsive video sources (desktop/tablet/mobile)
- Build HeroSection with title, subtitle, CTA
- Create FeatureSection as responsive grid
- Build TestimonialsSection with grid layout
- Create PricingSection with comparison table
- Add barrel export in `sections/index.ts`

### 4. Build Form Compositions

- Extract LoginForm from `apps/ozean-licht/components/login-form.tsx`
- Integrate with react-hook-form and zod validation
- Use Tier 2 Input and Button components
- Create RegisterForm with terms checkbox
- Build PasswordResetForm with success/error states
- Extract MagicLinkForm from ozean-licht app
- Create ContactForm with validation
- Add barrel export in `forms/index.ts`

### 5. Build Layout Templates

- Create DashboardLayout using Catalyst SidebarLayout
- Add sidebar navigation items prop
- Build MarketingLayout with header/footer slots
- Create AuthLayout using Catalyst AuthLayout
- Add responsive breakpoint handling for all layouts
- Support children composition pattern
- Add barrel export in `layouts/index.ts`

### 6. Update Main Exports and Documentation

- Update `compositions/index.ts` with all component exports
- Remove placeholder code from compositions index
- Add JSDoc comments to all exported components
- Include usage examples in component files
- Test imports: `import { CourseCard } from '@ozean-licht/shared-ui/compositions'`
- Build the package: `pnpm --filter @ozean-licht/shared-ui build`
- Verify TypeScript types are generated correctly
- Update UPGRADE_PLAN.md status to Phase 4 Complete

### 7. Validate Implementation

- Import compositions in admin app to test
- Check that all TypeScript types resolve correctly
- Verify glass morphism styling is consistent
- Test responsive behavior on mobile/tablet/desktop
- Ensure all animations work (glow, hover, float)
- Run typecheck: `pnpm --filter @ozean-licht/shared-ui typecheck`

## Testing Strategy

### Unit Testing Approach

While comprehensive unit tests are planned for Phase 7, basic validation should be done:

1. **Type Safety:** Ensure all props interfaces are correctly defined
2. **Import Testing:** Verify barrel exports work from consumer apps
3. **Visual Testing:** Manually test components in Storybook (Phase 7) or dev app
4. **Responsive Testing:** Check mobile, tablet, desktop breakpoints

### Integration Testing

1. Import CourseCard in ozean-licht app and verify it renders
2. Test form submissions with validation
3. Verify layouts compose correctly with children
4. Check that Catalyst and shadcn components integrate smoothly

### Edge Cases to Consider

1. **Missing Data:** Components should handle undefined/null props gracefully
2. **Long Text:** Test with very long titles, descriptions
3. **Image Loading:** Handle failed image loads (already in CourseCard)
4. **Empty States:** Display appropriate messages for empty arrays
5. **Accessibility:** Ensure proper ARIA labels and keyboard navigation

## Acceptance Criteria

- ✅ 6+ card compositions created and exported
- ✅ 3+ section compositions with responsive layouts
- ✅ 5+ form compositions with validation
- ✅ 3+ layout templates using Catalyst
- ✅ All components use Tier 2 branded components
- ✅ Full TypeScript type safety with proper interfaces
- ✅ Barrel exports work: `@ozean-licht/shared-ui/compositions`
- ✅ Zero TypeScript compilation errors
- ✅ Package builds successfully
- ✅ JSDoc comments on all exported components
- ✅ Usage examples in component documentation
- ✅ Consistent Ozean Licht branding throughout
- ✅ Responsive design on all screen sizes
- ✅ Glass morphism effects applied correctly

## Validation Commands

Execute these commands to validate the task is complete:

- `cd /opt/ozean-licht-ecosystem/shared/ui-components` - Navigate to package
- `pnpm typecheck` - Verify TypeScript types are correct (should show 0 errors)
- `pnpm build` - Build the package (should succeed without errors)
- `ls -la src/compositions/` - Verify directory structure exists
- `ls -la src/compositions/cards/` - Verify card components exist
- `ls -la src/compositions/sections/` - Verify section components exist
- `ls -la src/compositions/forms/` - Verify form components exist
- `ls -la src/compositions/layouts/` - Verify layout components exist
- `cat src/compositions/index.ts` - Verify main exports are configured
- `cat dist/compositions/index.d.ts` - Verify TypeScript declarations generated
- Test import in admin app: Add `import { CourseCard } from '@ozean-licht/shared-ui/compositions'` to a file and check for errors

## Notes

### Dependencies

All required dependencies are already installed:
- `react-hook-form@^7.66.0` - For form handling
- `zod@^4.1.12` - For form validation schemas
- `@radix-ui/react-avatar@^1.1.11` - For testimonial avatars
- `lucide-react@^0.553.0` - For icons in cards and sections
- `clsx@^2.1.0` - For conditional class names
- `tailwind-merge@^2.2.0` - For merging Tailwind classes

No new dependencies needed.

### Migration Strategy

When Phase 4 is complete, applications can migrate gradually:

```typescript
// Before (in apps/ozean-licht/):
import { CourseCardModern } from "@/components/layout/course-card-modern"

// After (using shared compositions):
import { CourseCard } from "@ozean-licht/shared-ui/compositions"
```

This allows incremental adoption without breaking existing code.

### Branding Consistency

All compositions must:
1. Use Tier 2 components (Button, Card, Input, etc.)
2. Apply glass morphism effects (`glass-card`, `glass-card-strong`)
3. Use turquoise primary color (`var(--primary)` or `#0ec2bc`)
4. Include glow effects on hover where appropriate
5. Follow Ozean Licht typography (Cinzel Decorative + Montserrat)

### Responsive Design

Follow these breakpoints (Tailwind defaults):
- `sm:` 640px (mobile landscape)
- `md:` 768px (tablet)
- `lg:` 1024px (desktop)
- `xl:` 1280px (large desktop)
- `2xl:` 1536px (extra large)

### Video Backgrounds

For sections with video backgrounds (CTASection), support three video sources:
- Desktop: 1920x1080 (lg: and up)
- Tablet: 1024x576 (md: to lg:)
- Mobile: 640x360 (below md:)

Use the pattern from `apps/ozean-licht/components/cta-1.tsx`.

### Form Validation

Use Zod schemas for form validation:

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
```

Integrate with react-hook-form resolver:

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const form = useForm({
  resolver: zodResolver(loginSchema),
})
```

### Layout Composition Pattern

Layouts should accept children and optional props:

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  navbar?: React.ReactNode
}

export function DashboardLayout({ children, sidebar, navbar }: DashboardLayoutProps) {
  return (
    <SidebarLayout navbar={navbar} sidebar={sidebar}>
      {children}
    </SidebarLayout>
  )
}
```

### Performance Considerations

1. **Image Optimization:** Use Next.js Image component where possible
2. **Lazy Loading:** Consider React.lazy() for heavy compositions
3. **Bundle Size:** Keep compositions tree-shakeable
4. **CSS-in-JS:** Avoid runtime CSS-in-JS; use Tailwind classes

### Accessibility Requirements

All compositions must meet WCAG AA standards:
1. Proper heading hierarchy (h1, h2, h3)
2. Alt text for all images
3. ARIA labels for interactive elements
4. Keyboard navigation support
5. Focus indicators visible
6. Color contrast ratios 4.5:1 minimum

### Related Documentation

- `/opt/ozean-licht-ecosystem/shared/ui-components/UPGRADE_PLAN.md` - Master roadmap
- `/opt/ozean-licht-ecosystem/BRANDING.md` - Brand guidelines
- `/opt/ozean-licht-ecosystem/design-system.md` - Design system documentation
- `/opt/ozean-licht-ecosystem/shared/ui-components/README.md` - Package documentation

### Next Steps After Phase 4

Once Phase 4 is complete:
1. **Phase 5:** Integrate Tailwind Plus components (optional)
2. **Phase 6:** Create Kids Ascension theme variant
3. **Phase 7:** Add Storybook documentation and comprehensive tests

---

**Estimated Duration:** 4-5 hours
**Complexity:** Complex
**Task Type:** Feature
**Priority:** High (blocks admin dashboard component usage)
**Status:** Ready to implement

**Version:** 1.0.0
**Created:** 2025-11-11
**Author:** AI Planning Agent
