# Plan: Admin Layout & Navigation System (Spec 1.1)

## Task Description

Create the foundational admin dashboard layout and navigation system that supports:
- App shell layout with sidebar and header
- Role-based navigation menu structure with entity awareness
- Breadcrumb navigation system for route tracking
- Mobile responsive navigation with hamburger menu
- Theme switching support (dark/light modes)
- Accessibility features (keyboard navigation, ARIA labels, focus management)

This is **Spec 1.1** from the Admin Dashboard Roadmap - a P0 (blocker) task that provides the foundation for all subsequent admin features.

## Objective

Build a production-ready, accessible, and responsive layout system that:
1. Provides consistent navigation across all admin pages
2. Supports multi-entity navigation (Kids Ascension, Ozean Licht, shared sections)
3. Adapts to user roles and permissions (SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT)
4. Works seamlessly on desktop, tablet, and mobile devices
5. Enables theme switching for user preference
6. Unblocks all Phase 1+ feature development

## Problem Statement

The admin dashboard currently has a basic layout structure, but lacks several critical features needed for production deployment:

1. **No breadcrumb system** - Users can't easily track their location in deep navigation hierarchies
2. **Limited theme support** - No theme switcher component, only dark mode by default
3. **Basic mobile navigation** - Needs enhanced mobile menu patterns and touch interactions
4. **Accessibility gaps** - Missing ARIA labels, focus management, and keyboard navigation
5. **No sidebar collapse** - Desktop users can't maximize content space by collapsing sidebar
6. **Incomplete role filtering** - Navigation doesn't fully adapt to user permissions

## Solution Approach

**Strategy:** Enhance existing layout components incrementally while maintaining backward compatibility.

### Phase 1: Breadcrumb System
- Create `Breadcrumb` component with automatic route parsing
- Add breadcrumb context provider for custom labels
- Integrate into header layout

### Phase 2: Theme Switching
- Implement `ThemeToggle` component using `next-themes`
- Configure theme provider in root layout
- Test dark/light mode transitions

### Phase 3: Enhanced Mobile Navigation
- Improve sidebar mobile overlay interactions
- Add touch gestures (swipe to close)
- Optimize mobile header layout

### Phase 4: Accessibility & Polish
- Add ARIA labels to all navigation elements
- Implement keyboard shortcuts (/, Esc, arrow keys)
- Add focus trap for mobile sidebar
- Test with screen readers

### Phase 5: Advanced Features
- Sidebar collapse/expand on desktop
- Navigation search (quick jump)
- Recent pages tracking

## Relevant Files

### Existing Files (To Modify)

- **`app/(dashboard)/layout.tsx`** - Server component wrapper, handles auth and entity scope mapping
- **`app/(dashboard)/layout-client.tsx`** - Client component orchestrator, manages mobile state
- **`components/dashboard/Header.tsx`** - Top navigation bar with user info and logout
- **`components/dashboard/Sidebar.tsx`** - Main navigation sidebar with entity sections
- **`components/dashboard/EntitySwitcher.tsx`** - Entity context switching dropdown
- **`types/navigation.ts`** - TypeScript types for navigation structure
- **`app/layout.tsx`** - Root layout for theme provider integration
- **`tailwind.config.js`** - Tailwind configuration with Ozean Licht branding

### New Files (To Create)

#### Components
- **`components/dashboard/Breadcrumb.tsx`** - Breadcrumb navigation component
- **`components/dashboard/ThemeToggle.tsx`** - Dark/light mode toggle button
- **`components/dashboard/NavigationSearch.tsx`** - Quick navigation search (Phase 5)
- **`components/dashboard/SidebarCollapse.tsx`** - Sidebar collapse toggle (Phase 5)

#### Context & Providers
- **`lib/providers/ThemeProvider.tsx`** - Next-themes provider wrapper
- **`lib/contexts/BreadcrumbContext.tsx`** - Breadcrumb label customization context

#### Utilities
- **`lib/navigation/breadcrumb-utils.ts`** - Route parsing and breadcrumb generation
- **`lib/navigation/keyboard-shortcuts.ts`** - Keyboard navigation handlers

#### Types
- **`types/breadcrumb.ts`** - Breadcrumb-specific TypeScript types
- **`types/theme.ts`** - Theme configuration types

## Implementation Phases

### Phase 1: Foundation Enhancements (4 hours)
- Set up theme provider infrastructure
- Create breadcrumb component and utilities
- Add accessibility attributes to existing components

### Phase 2: Core Implementation (6 hours)
- Implement breadcrumb system with route parsing
- Build theme toggle component
- Enhance mobile navigation patterns
- Add keyboard shortcuts

### Phase 3: Integration & Polish (2 hours)
- Test all navigation flows
- Validate accessibility with screen readers
- Optimize mobile performance
- Document component usage patterns

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Set Up Theme Provider Infrastructure

- Install required dependencies: `next-themes` package
- Create `lib/providers/ThemeProvider.tsx` with next-themes wrapper
- Update `app/layout.tsx` to wrap children with ThemeProvider
- Configure theme provider with `defaultTheme: 'dark'` and `enableSystem: true`
- Add `suppressHydrationWarning` to `<html>` tag to prevent hydration warnings
- Test theme persistence in localStorage

### 2. Create Theme Toggle Component

- Create `components/dashboard/ThemeToggle.tsx` using `useTheme` hook
- Implement toggle button with sun/moon icons (lucide-react)
- Add smooth transition animations for theme changes
- Style with Ozean Licht branding (primary colors, glow effect)
- Add ARIA labels: `aria-label="Toggle theme"`, `role="button"`
- Test keyboard accessibility (Enter, Space to toggle)

### 3. Integrate Theme Toggle into Header

- Import `ThemeToggle` in `components/dashboard/Header.tsx`
- Position toggle button between user email and logout button
- Ensure responsive layout (hide on mobile <sm, show on sm+)
- Test theme toggle across all dashboard pages
- Verify theme persists after page refresh

### 4. Create Breadcrumb Utilities

- Create `types/breadcrumb.ts` with interfaces:
  ```typescript
  interface BreadcrumbSegment {
    label: string;
    href: string;
    isCurrentPage: boolean;
  }

  interface BreadcrumbConfig {
    customLabels?: Record<string, string>;
    maxSegments?: number;
  }
  ```
- Create `lib/navigation/breadcrumb-utils.ts` with functions:
  - `parsePathToBreadcrumbs(pathname: string): BreadcrumbSegment[]` - Convert route to segments
  - `formatSegmentLabel(segment: string): string` - Convert `kids-ascension` to `Kids Ascension`
  - `getBreadcrumbHref(segments: string[], index: number): string` - Build href for segment
- Add route label mappings for entity-specific routes:
  ```typescript
  const ROUTE_LABELS: Record<string, string> = {
    'dashboard': 'Dashboard',
    'kids-ascension': 'Kids Ascension',
    'ozean-licht': 'Ozean Licht',
    'health': 'System Health',
    'storage': 'Storage',
    'users': 'Users',
    'videos': 'Videos',
    'courses': 'Courses',
    'members': 'Members',
    // Add more as routes are created
  };
  ```

### 5. Create Breadcrumb Context Provider

- Create `lib/contexts/BreadcrumbContext.tsx` with context:
  ```typescript
  interface BreadcrumbContextValue {
    customLabels: Record<string, string>;
    setCustomLabel: (path: string, label: string) => void;
    clearCustomLabels: () => void;
  }
  ```
- Implement provider with state management for custom labels
- Export `useBreadcrumb()` hook for consuming components
- Add context to `layout-client.tsx` wrapping children

### 6. Create Breadcrumb Component

- Create `components/dashboard/Breadcrumb.tsx` using `usePathname()` hook
- Render breadcrumb trail with segments from `parsePathToBreadcrumbs()`
- Style with Tailwind:
  - Container: `flex items-center space-x-2 text-sm text-muted-foreground`
  - Separator: `/` or chevron icon between segments
  - Active segment: `text-foreground font-medium`
  - Links: `hover:text-primary-500 transition-colors`
- Add ARIA attributes:
  - `<nav aria-label="Breadcrumb">`
  - `<ol>` for ordered list
  - `<li>` for each segment
  - `aria-current="page"` on current segment
- Implement responsive design:
  - Mobile (<md): Show only last 2 segments
  - Desktop: Show full breadcrumb trail
- Add truncation for long labels (max 30 characters, ellipsis)

### 7. Integrate Breadcrumb into Layout

- Import `Breadcrumb` in `components/dashboard/Header.tsx`
- Position breadcrumb below main header bar in new row (or within header)
- Alternative: Add breadcrumb to `layout-client.tsx` above main content
- Ensure breadcrumb updates on route changes (automatic via `usePathname`)
- Test breadcrumb on nested routes: `/dashboard/kids-ascension/videos/[id]`

### 8. Enhance Sidebar Accessibility

- Add ARIA attributes to `components/dashboard/Sidebar.tsx`:
  - `<aside role="navigation" aria-label="Main navigation">`
  - `<nav aria-label="Primary navigation">`
  - Active link: `aria-current="page"`
- Implement keyboard navigation:
  - Tab through nav items
  - Enter/Space to activate link
  - Escape to close mobile sidebar
- Add focus trap for mobile sidebar (when open, focus stays within sidebar)
- Install `focus-trap-react` package if needed
- Test with keyboard-only navigation (no mouse)

### 9. Add Keyboard Shortcuts Handler

- Create `lib/navigation/keyboard-shortcuts.ts` with handler:
  ```typescript
  export function useKeyboardShortcuts(handlers: {
    onToggleSidebar?: () => void;
    onSearch?: () => void;
  }) {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Escape: Close sidebar/modal
        if (e.key === 'Escape') { /* ... */ }
        // /: Focus search
        if (e.key === '/') { /* ... */ }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
  }
  ```
- Integrate in `layout-client.tsx` to handle global shortcuts
- Add visual hints for keyboard shortcuts (tooltips on hover)

### 10. Enhance Mobile Navigation UX

- Update `components/dashboard/Sidebar.tsx` mobile overlay:
  - Add backdrop blur: `backdrop-blur-sm`
  - Smooth slide-in animation: `transition-transform duration-300`
  - Close on outside click (already implemented)
- Add swipe gesture support (optional, using `react-use-gesture`):
  - Swipe right to open sidebar
  - Swipe left to close sidebar
- Optimize mobile header in `Header.tsx`:
  - Reduce padding on mobile: `px-2 sm:px-4 lg:px-8`
  - Stack breadcrumb below title on mobile
- Test on iOS Safari and Android Chrome

### 11. Add Entity Badge to Breadcrumb

- Show current entity badge in breadcrumb (e.g., `[KA]`, `[OL]`)
- Render badge before entity-specific route segments
- Style badge with entity colors:
  - Kids Ascension: `bg-blue-500 text-white`
  - Ozean Licht: `bg-primary-500 text-white`
- Make badge clickable to switch entities (optional, Phase 5)

### 12. Implement Sidebar Collapse (Desktop)

- Add collapse state to `layout-client.tsx`:
  ```typescript
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  ```
- Create `components/dashboard/SidebarCollapse.tsx` toggle button
- Update `Sidebar.tsx` to support collapsed state:
  - Collapsed: Width `w-16`, hide labels, show only icons
  - Expanded: Width `w-64`, show full labels
- Add tooltip on hover for collapsed items (using `@radix-ui/react-tooltip`)
- Persist collapse state in localStorage
- Add smooth width transition: `transition-all duration-300`

### 13. Add Navigation Search Component (Optional - Phase 5)

- Create `components/dashboard/NavigationSearch.tsx` command palette
- Implement using `cmdk` package (shadcn/ui Command component)
- Trigger with `/` keyboard shortcut
- Search through all navigation items (fuse.js for fuzzy search)
- Show recent pages at top of results
- Navigate to selected page on Enter

### 14. Update Navigation Types

- Extend `types/navigation.ts` with new interfaces:
  ```typescript
  export interface NavigationConfig {
    breadcrumbEnabled: boolean;
    themeToggleEnabled: boolean;
    searchEnabled: boolean;
    sidebarCollapsible: boolean;
  }

  export interface NavigationState {
    isMobileMenuOpen: boolean;
    isSidebarCollapsed: boolean;
    currentEntity: UserEntity;
  }
  ```
- Add type exports for breadcrumb and theme types
- Ensure strict TypeScript compliance (no `any` types)

### 15. Add Loading States

- Add skeleton loaders for navigation during initial render
- Show loading spinner in EntitySwitcher during entity switch
- Add suspense boundaries for client components
- Optimize hydration to prevent layout shift

### 16. Document Component Usage

- Add JSDoc comments to all new components:
  ```typescript
  /**
   * Breadcrumb navigation component that automatically generates
   * breadcrumb trail based on current route.
   *
   * @example
   * <Breadcrumb />
   *
   * @example With custom labels
   * const { setCustomLabel } = useBreadcrumb();
   * setCustomLabel('/dashboard/users/123', 'John Doe');
   */
  ```
- Create usage examples in component files
- Document keyboard shortcuts in README

### 17. Comprehensive Testing

- Test breadcrumb on all route depths:
  - `/dashboard` - No breadcrumb or just "Dashboard"
  - `/dashboard/health` - Dashboard / System Health
  - `/dashboard/kids-ascension/videos` - Dashboard / Kids Ascension / Videos
  - `/dashboard/ozean-licht/courses/123` - Dashboard / Ozean Licht / Courses / [Course Name]
- Test theme toggle:
  - Switch between dark/light modes
  - Verify persistence after refresh
  - Test system preference sync
- Test mobile navigation:
  - Open/close sidebar via hamburger menu
  - Close sidebar via backdrop click
  - Test on iOS Safari, Android Chrome
  - Verify touch interactions
- Test role-based navigation:
  - Login as SUPER_ADMIN - See all sections
  - Login as KA_ADMIN - See only KA sections + shared
  - Login as OL_ADMIN - See only OL sections + shared
  - Login as SUPPORT - See limited sections
- Test keyboard navigation:
  - Tab through all nav items
  - Escape to close mobile sidebar
  - `/` to open search (if implemented)
  - Enter/Space to activate links
- Test accessibility:
  - Run Lighthouse accessibility audit (target >95 score)
  - Test with screen reader (VoiceOver, NVDA)
  - Verify ARIA labels present
  - Check color contrast ratios (WCAG AA)

### 18. Performance Optimization

- Ensure no layout shift during hydration (CLS < 0.1)
- Optimize breadcrumb re-renders (memoize parsing function)
- Lazy load theme toggle icons
- Minimize bundle size (check with `next build --profile`)
- Add performance budgets:
  - Layout component < 5KB gzipped
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s

### 19. Update Documentation

- Update `apps/admin/CLAUDE.md` with navigation patterns:
  ```typescript
  // Add breadcrumb custom label
  const { setCustomLabel } = useBreadcrumb();
  setCustomLabel('/dashboard/users/123', userName);

  // Toggle theme programmatically
  const { setTheme } = useTheme();
  setTheme('dark');
  ```
- Document keyboard shortcuts in admin README
- Add component screenshots to design system docs
- Update ROADMAP-SPECS-LIST.md status to ✅ for Spec 1.1

## Testing Strategy

### Unit Tests
- **Breadcrumb utilities**: Test `parsePathToBreadcrumbs()` with various route patterns
- **Theme toggle**: Test theme switching and persistence
- **Navigation filtering**: Test role-based section visibility

### Integration Tests
- **Layout rendering**: Verify sidebar, header, breadcrumb render correctly
- **Theme provider**: Test theme changes propagate to all components
- **Mobile navigation**: Test sidebar open/close interactions
- **Entity switching**: Verify entity switch updates navigation

### Accessibility Tests
- **Keyboard navigation**: Test tab order, focus management, shortcuts
- **Screen reader**: Test with VoiceOver (macOS) or NVDA (Windows)
- **ARIA compliance**: Validate ARIA attributes with aXe DevTools
- **Color contrast**: Verify WCAG AA compliance (4.5:1 for text)

### End-to-End Tests (Playwright)
- **Navigation flow**: Dashboard → Health → Back to Dashboard (breadcrumb)
- **Role-based access**: Login as different roles, verify nav sections
- **Theme persistence**: Toggle theme, refresh page, verify persistence
- **Mobile flow**: Open sidebar → Navigate → Close sidebar

### Edge Cases
- **Long breadcrumb trails**: Test with deeply nested routes (5+ levels)
- **Long route labels**: Test label truncation and ellipsis
- **Rapid entity switching**: Verify no race conditions
- **Slow network**: Test loading states and skeleton loaders
- **No JavaScript**: Verify graceful degradation (SSR content visible)

## Acceptance Criteria

### Functional Requirements
- [x] Breadcrumb displays on all dashboard pages with correct route trail
- [x] Breadcrumb updates automatically on route changes
- [x] Theme toggle switches between dark/light modes smoothly
- [x] Theme preference persists after page refresh (localStorage)
- [x] Mobile sidebar opens/closes via hamburger menu
- [x] Mobile sidebar closes when clicking outside (backdrop)
- [x] Navigation sections filter based on user role and entity scope
- [x] Entity switcher updates current entity context
- [x] All navigation links navigate correctly

### Accessibility Requirements
- [x] Lighthouse accessibility score >95
- [x] All interactive elements keyboard accessible
- [x] Focus trap works on mobile sidebar
- [x] ARIA labels present on all navigation elements
- [x] `aria-current="page"` on active nav item and breadcrumb segment
- [x] Color contrast meets WCAG AA standards (4.5:1)
- [x] Screen reader announces navigation changes

### Performance Requirements
- [x] Cumulative Layout Shift (CLS) < 0.1
- [x] First Contentful Paint (FCP) < 1.5s
- [x] Time to Interactive (TTI) < 3s
- [x] Layout components < 5KB gzipped total
- [x] No hydration warnings in console
- [x] Smooth animations (60fps) on mobile

### Responsive Design Requirements
- [x] Sidebar collapses to hamburger menu on mobile (<768px)
- [x] Breadcrumb shows last 2 segments on mobile, full on desktop
- [x] Theme toggle visible on sm+ screens, hidden on mobile
- [x] Touch interactions work on iOS and Android
- [x] Layout adapts to tablet (768px-1024px) screens

### Code Quality Requirements
- [x] TypeScript strict mode enabled, no `any` types
- [x] All components have JSDoc comments
- [x] ESLint passes with no warnings
- [x] Prettier formatting applied
- [x] No console errors or warnings in browser
- [x] Component props fully typed

## Validation Commands

Execute these commands to validate the task is complete:

### Build & Type Check
```bash
# Change to admin directory
cd apps/admin

# TypeScript type checking
npx tsc --noEmit

# ESLint checking
npx eslint app/ components/ lib/ types/ --ext .ts,.tsx

# Prettier check
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"

# Next.js build (validates entire app)
npm run build
```

### Test Suite
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Lighthouse Audit
```bash
# Start dev server
npm run dev

# In another terminal, run Lighthouse CLI
npx lighthouse http://localhost:9200/dashboard \
  --only-categories=accessibility,performance \
  --output=html \
  --output-path=./lighthouse-report.html

# Target scores:
# Accessibility: >95
# Performance: >90
```

### Accessibility Testing
```bash
# Install aXe CLI
npm install -g @axe-core/cli

# Run aXe audit
axe http://localhost:9200/dashboard --save axe-results.json

# Should have 0 violations
```

### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build

# Check output for layout components
# Should see:
# ├ ○ /dashboard/layout < 5KB (gzipped)
```

### Manual Testing Checklist
```bash
# Start dev server
npm run dev

# Open browser to http://localhost:9200/dashboard
# Complete manual testing checklist:

# ✅ Breadcrumb Navigation
- [ ] Breadcrumb shows on /dashboard
- [ ] Breadcrumb shows on /dashboard/health
- [ ] Breadcrumb shows on /dashboard/kids-ascension/videos
- [ ] Breadcrumb links navigate correctly
- [ ] Breadcrumb updates on route change

# ✅ Theme Toggle
- [ ] Toggle switches from dark to light mode
- [ ] Toggle switches from light to dark mode
- [ ] Theme persists after page refresh
- [ ] Theme transitions smoothly

# ✅ Mobile Navigation
- [ ] Hamburger menu opens sidebar on mobile
- [ ] Sidebar closes when clicking backdrop
- [ ] Sidebar closes when clicking nav link
- [ ] Touch gestures work (if implemented)

# ✅ Keyboard Navigation
- [ ] Tab moves through all nav items
- [ ] Enter activates nav links
- [ ] Escape closes mobile sidebar
- [ ] / opens search (if implemented)

# ✅ Role-Based Navigation
- [ ] SUPER_ADMIN sees all sections
- [ ] KA_ADMIN sees only KA + shared sections
- [ ] OL_ADMIN sees only OL + shared sections
- [ ] SUPPORT sees limited sections

# ✅ Accessibility
- [ ] Screen reader reads navigation correctly
- [ ] Color contrast is sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present
```

## Notes

### Dependencies to Install
```bash
# Core dependencies
npm install next-themes

# UI components (if not already installed)
npm install lucide-react class-variance-authority clsx tailwind-merge

# Optional (for advanced features)
npm install focus-trap-react        # Focus management
npm install @radix-ui/react-tooltip # Tooltips for collapsed sidebar
npm install cmdk                    # Command palette for navigation search
npm install fuse.js                 # Fuzzy search for navigation
```

### Design System Compliance
- Use Ozean Licht primary color (#0ec2bc) for active states
- Apply `font-serif` (Cinzel) to page titles in breadcrumb
- Apply `font-sans` (Montserrat) to navigation labels
- Use `glow` animation sparingly (only on primary actions)
- Maintain cosmic dark theme as default

### Future Enhancements (Post-MVP)
- Sidebar collapse with persistent state (desktop)
- Navigation search / command palette
- Recent pages tracking
- Customizable navigation (drag-drop reorder)
- Navigation analytics (track most-used sections)
- Multi-level nested navigation (dropdowns)
- Navigation favorites/bookmarks

### Breaking Changes
None - This spec enhances existing layout without breaking changes.

### Migration Path
1. Deploy enhanced layout components
2. Existing pages automatically inherit new breadcrumb and theme toggle
3. No migration needed for downstream features
4. Future specs can use breadcrumb context for custom labels

### Related Specs
- **Spec 1.2**: Admin Shared UI Components (depends on this layout)
- **Spec 1.3**: Data Tables Foundation (depends on this layout)
- **Spec 1.4**: Basic RBAC (uses role-based navigation filtering)

### Estimated Effort Breakdown
- Breadcrumb system: 3 hours
- Theme toggle: 1.5 hours
- Mobile navigation enhancements: 2 hours
- Accessibility improvements: 2.5 hours
- Testing and validation: 2 hours
- Documentation: 1 hour
- **Total: 12 hours**

---

**Spec Status:** ❌ Not Started
**Priority:** P0 (Blocker)
**Estimated Effort:** 12 hours
**Dependencies:** None
**Blocks:** Spec 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 (All Phase 1 specs)
**Created:** 2025-11-09
**Target Completion:** Week 1
