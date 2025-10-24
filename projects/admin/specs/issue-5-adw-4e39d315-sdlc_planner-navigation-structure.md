# Feature Implementation Plan: Admin Dashboard Navigation Structure

**Issue:** #5
**ADW ID:** 4e39d315
**Type:** Feature
**Created:** 2025-10-24

---

## Overview

Implement a comprehensive navigation structure for the Admin Dashboard including a sidebar with entity-aware sections, admin header with user menu, protected route layout, navigation menu for dashboard pages, mobile-responsive collapsible sidebar, and entity switcher integration. This will provide users with intuitive navigation across all admin dashboard features while maintaining proper access control based on roles and entity scopes.

## Context

The Admin Dashboard currently has basic authentication (NextAuth v5), a simple Header component with logout functionality, and protected routes via middleware. However, it lacks proper navigation structure for accessing different sections of the admin panel. Users currently only have access to the dashboard home and settings pages through simple header links.

This feature builds upon:
- **Issue #1** - Database schema and MCP client library (completed)
- **Issue #6** - NextAuth authentication with role-based access control (completed)

The navigation structure is critical for:
- Organizing admin features into logical sections (Users, Content Management, Analytics, Settings)
- Providing entity-aware navigation for multi-tenant admins (Kids Ascension vs Ozean Licht)
- Enabling role-based menu visibility based on user permissions
- Supporting mobile-first responsive design
- Allowing entity switching for super admins who manage both platforms

## Requirements

### Functional Requirements
- **FR1:** Sidebar navigation component displays relevant sections based on user role and entity scope
- **FR2:** Sidebar navigation items are permission-aware (only show items user has access to)
- **FR3:** Admin header includes user profile dropdown menu with logout and settings options
- **FR4:** Protected route layout wraps all dashboard pages with sidebar and header
- **FR5:** Mobile-responsive collapsible sidebar with hamburger menu toggle
- **FR6:** Entity switcher component for super admins to switch between Kids Ascension and Ozean Licht contexts
- **FR7:** Active route highlighting in sidebar navigation
- **FR8:** Sidebar supports nested navigation items with expandable sections
- **FR9:** Smooth animations for sidebar collapse/expand and mobile menu
- **FR10:** Persistent sidebar state (collapsed/expanded) in localStorage

### Technical Requirements
- **TR1:** Use Next.js 14 App Router with React Server Components
- **TR2:** Implement as reusable React components following existing patterns
- **TR3:** Use Tailwind CSS for styling with responsive breakpoints
- **TR4:** Leverage existing authentication utilities (`requireAuth`, `hasPermission`)
- **TR5:** Support all admin roles: super_admin, ka_admin, ol_admin, support
- **TR6:** Client-side interactivity with 'use client' directive where needed
- **TR7:** Accessible navigation with ARIA labels and keyboard navigation
- **TR8:** TypeScript strict mode with full type safety

### Non-Functional Requirements
- **NFR1:** Navigation renders in < 100ms on initial page load
- **NFR2:** Sidebar collapse/expand animation completes in < 300ms
- **NFR3:** Mobile menu opens/closes smoothly without janky animations
- **NFR4:** Navigation is fully keyboard accessible (Tab, Enter, Escape)
- **NFR5:** Works on mobile (320px), tablet (768px), and desktop (1024px+) viewports

## Architecture & Design

### High-Level Design

The navigation system consists of four main components working together:

1. **Sidebar Component** - Vertical navigation with collapsible sections
2. **Header Component** - Top bar with user menu and entity switcher
3. **DashboardLayout** - Layout wrapper that composes Sidebar + Header
4. **Navigation Config** - Centralized navigation structure with permission mapping

**Component Hierarchy:**
```
DashboardLayout (server component)
├── Sidebar (client component)
│   ├── SidebarToggle
│   ├── SidebarHeader
│   ├── SidebarNav
│   │   └── SidebarNavItem[]
│   └── SidebarFooter
└── Header (server component)
    ├── EntitySwitcher (client component)
    └── UserMenu (client component)
        ├── ProfileInfo
        ├── SettingsLink
        └── LogoutButton
```

**Data Flow:**
```
1. User accesses /dashboard/* route
2. Middleware validates session
3. DashboardLayout calls requireAuth() to get session
4. Session passed to Header and Sidebar components
5. Navigation config filtered by user permissions
6. Render permission-aware navigation items
7. Client components handle interactive state (collapse, dropdowns)
```

### Component Structure

```
projects/admin/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                    # Main sidebar component
│   │   ├── SidebarNav.tsx                 # Navigation items renderer
│   │   ├── SidebarToggle.tsx              # Collapse/expand toggle
│   │   └── EntitySwitcher.tsx             # Entity context switcher
│   ├── dashboard/
│   │   ├── Header.tsx                     # Update existing header
│   │   └── UserMenu.tsx                   # User dropdown menu
│   └── ui/
│       ├── Icon.tsx                       # Icon component wrapper
│       └── Dropdown.tsx                   # Reusable dropdown
├── lib/
│   ├── navigation/
│   │   ├── config.ts                      # Navigation structure definition
│   │   ├── utils.ts                       # Navigation helper functions
│   │   └── types.ts                       # Navigation type definitions
│   └── hooks/
│       ├── useSidebarState.ts             # Sidebar state management
│       └── useActiveRoute.ts              # Active route detection
├── app/
│   └── (dashboard)/
│       └── layout.tsx                     # Update to include sidebar
└── types/
    └── navigation.ts                      # Navigation-related types
```

### Navigation Config Structure

```typescript
// lib/navigation/config.ts
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  permission?: string;
  entityScope?: EntityScope[];
  children?: NavItem[];
  badge?: string | number;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'home', permission: '*' },
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: 'chart', permission: '*.read' },
    ]
  },
  {
    id: 'content',
    title: 'Content Management',
    items: [
      {
        id: 'ka-videos',
        label: 'Videos',
        href: '/dashboard/ka/videos',
        icon: 'video',
        permission: 'ka.videos.read',
        entityScope: ['kids_ascension']
      },
      {
        id: 'ol-courses',
        label: 'Courses',
        href: '/dashboard/ol/courses',
        icon: 'book',
        permission: 'ol.courses.read',
        entityScope: ['ozean_licht']
      },
    ]
  },
  {
    id: 'admin',
    title: 'Administration',
    items: [
      {
        id: 'users',
        label: 'Users',
        icon: 'users',
        permission: 'users.read',
        children: [
          { id: 'admin-users', label: 'Admin Users', href: '/dashboard/users/admins', permission: 'users.read' },
          { id: 'members', label: 'Members', href: '/dashboard/users/members', permission: 'users.read' },
        ]
      },
      { id: 'audit-logs', label: 'Audit Logs', href: '/dashboard/audit-logs', icon: 'list', permission: 'audit.read' },
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'account', label: 'Account', href: '/dashboard/settings/account', icon: 'user', permission: '*' },
      { id: '2fa', label: 'Two-Factor Auth', href: '/dashboard/settings/2fa', icon: 'shield', permission: '*' },
    ]
  },
];
```

### API Changes

No backend API changes required. This feature is entirely frontend-focused.

## Implementation Steps

### Step 1: Create Navigation Types and Configuration

**Goal:** Define TypeScript types for navigation structure and create centralized navigation config with permission mapping.

**Files to Create:**
- `lib/navigation/types.ts` - Navigation type definitions
- `lib/navigation/config.ts` - Navigation structure configuration
- `lib/navigation/utils.ts` - Helper functions for filtering navigation

**Implementation Details:**

1. Create navigation types including `NavItem`, `NavSection`, `EntityScope`
2. Define `navigationConfig` array with all menu sections and items
3. Map each navigation item to required permission(s)
4. Specify entity scope constraints for entity-specific items
5. Implement `filterNavigationByPermissions()` utility function
6. Implement `filterNavigationByEntity()` utility function
7. Add JSDoc documentation for all types and functions

**Acceptance Criteria:**
- [ ] All navigation types defined with TypeScript interfaces
- [ ] Navigation config includes at least 4 sections: Main, Content, Admin, Settings
- [ ] Each navigation item has appropriate permission and entity scope
- [ ] Filter utilities correctly hide items user doesn't have access to
- [ ] TypeScript compiles without errors

---

### Step 2: Create Icon Component

**Goal:** Create a reusable Icon component to display icons in navigation items.

**Files to Create:**
- `components/ui/Icon.tsx` - Icon component wrapper

**Implementation Details:**

1. Create Icon component accepting `name` and `className` props
2. Use Heroicons or similar icon library (or inline SVG for simplicity)
3. Support common icons: home, chart, video, book, users, list, user, shield, menu, x, chevron
4. Make component tree-shakeable and performant
5. Add TypeScript types for valid icon names

**Acceptance Criteria:**
- [ ] Icon component renders SVG icons correctly
- [ ] Supports all icons needed for navigation
- [ ] Accepts custom className for styling
- [ ] TypeScript enforces valid icon names
- [ ] Component is performant (< 10ms render time)

---

### Step 3: Create Sidebar State Management Hook

**Goal:** Implement custom React hook to manage sidebar collapse/expand state with localStorage persistence.

**Files to Create:**
- `lib/hooks/useSidebarState.ts` - Sidebar state management hook
- `lib/hooks/useActiveRoute.ts` - Active route detection hook

**Implementation Details:**

1. Create `useSidebarState` hook with `isCollapsed` state
2. Persist state to localStorage with key `admin-sidebar-collapsed`
3. Provide `toggle()`, `collapse()`, `expand()` methods
4. Handle hydration for SSR (avoid mismatch errors)
5. Create `useActiveRoute` hook using Next.js `usePathname()`
6. Implement route matching logic (exact and partial matches)

**Acceptance Criteria:**
- [ ] useSidebarState persists state across page reloads
- [ ] No hydration errors on initial render
- [ ] useActiveRoute correctly identifies active navigation item
- [ ] Hooks have proper TypeScript types
- [ ] Works in both development and production builds

---

### Step 4: Create Sidebar Component

**Goal:** Build the main Sidebar component with collapsible sections, navigation items, and responsive behavior.

**Files to Create:**
- `components/layout/Sidebar.tsx` - Main sidebar container
- `components/layout/SidebarNav.tsx` - Navigation items renderer
- `components/layout/SidebarToggle.tsx` - Collapse/expand toggle button

**Files to Modify:**
- None (new components)

**Implementation Details:**

1. Create Sidebar component as client component ('use client')
2. Accept `session` prop containing user permissions and entity scope
3. Use `useSidebarState` hook for collapse/expand state
4. Filter navigation config based on user permissions
5. Render navigation sections with titles
6. Implement nested navigation items with expand/collapse
7. Add active route highlighting
8. Style with Tailwind CSS for responsive design
9. Add smooth transitions for collapse/expand (300ms)
10. Implement mobile overlay backdrop
11. Add SidebarToggle button for desktop collapse
12. Make keyboard accessible with proper ARIA attributes

**Acceptance Criteria:**
- [ ] Sidebar renders all permitted navigation items
- [ ] Collapse/expand works smoothly with animation
- [ ] Active route is highlighted visually
- [ ] Nested items expand/collapse independently
- [ ] Mobile overlay works correctly
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors

---

### Step 5: Create Entity Switcher Component

**Goal:** Implement entity context switcher for super admins to toggle between Kids Ascension and Ozean Licht views.

**Files to Create:**
- `components/layout/EntitySwitcher.tsx` - Entity context switcher

**Implementation Details:**

1. Create EntitySwitcher as client component
2. Only render for super_admin role (check session.user.adminRole)
3. Display current entity context (Kids Ascension / Ozean Licht / All Entities)
4. Implement dropdown to switch between entities
5. Store selected entity in React state
6. Update URL or query param to reflect entity context (optional)
7. Show entity-specific branding colors (KA: blue, OL: purple)
8. Add smooth transition when switching entities

**Acceptance Criteria:**
- [ ] Only visible for super_admin users
- [ ] Displays current entity context
- [ ] Dropdown allows switching between KA, OL, and All
- [ ] Visual feedback when entity changes
- [ ] Entity state persists during session
- [ ] TypeScript types enforce valid entity values

---

### Step 6: Update Header Component with User Menu

**Goal:** Enhance existing Header component to include user profile dropdown menu with settings and logout options.

**Files to Create:**
- `components/dashboard/UserMenu.tsx` - User dropdown menu component
- `components/ui/Dropdown.tsx` - Reusable dropdown wrapper

**Files to Modify:**
- `components/dashboard/Header.tsx` - Update to include EntitySwitcher and UserMenu

**Implementation Details:**

1. Create reusable Dropdown component with trigger and content
2. Implement click-outside detection to close dropdown
3. Create UserMenu component with profile info at top
4. Add menu items: Account Settings, Two-Factor Auth, Audit Logs (if permitted), Logout
5. Update Header component to replace simple logout button with UserMenu
6. Add EntitySwitcher to Header (conditionally for super admins)
7. Improve Header responsive layout for mobile
8. Add proper z-index management for dropdowns
9. Implement keyboard navigation in dropdown (Arrow keys, Escape)

**Acceptance Criteria:**
- [ ] User menu dropdown opens on click
- [ ] Closes when clicking outside
- [ ] All menu items link to correct routes
- [ ] Logout button works as before
- [ ] EntitySwitcher appears for super admins only
- [ ] Header is responsive on mobile
- [ ] Keyboard navigation works correctly
- [ ] No z-index layering issues

---

### Step 7: Update Dashboard Layout

**Goal:** Integrate Sidebar and updated Header into DashboardLayout to create cohesive protected route wrapper.

**Files to Modify:**
- `app/(dashboard)/layout.tsx` - Update to include Sidebar

**Implementation Details:**

1. Import Sidebar component
2. Update layout structure to include sidebar on left
3. Adjust main content area to account for sidebar width
4. Handle sidebar collapse state (use CSS variables or Tailwind)
5. Ensure layout is responsive:
   - Mobile: Sidebar as overlay
   - Tablet: Collapsible sidebar
   - Desktop: Full sidebar by default
6. Pass session data to both Sidebar and Header
7. Add proper HTML semantics (nav, main, header)
8. Ensure smooth transitions between pages
9. Add max-width constraints for content area

**Acceptance Criteria:**
- [ ] Sidebar and Header render correctly in layout
- [ ] Main content area adjusts based on sidebar state
- [ ] Responsive behavior works across all breakpoints
- [ ] Session data flows correctly to all components
- [ ] Page transitions are smooth
- [ ] Layout follows accessibility best practices
- [ ] No layout shift or jank during render

---

### Step 8: Add Mobile Navigation Support

**Goal:** Implement mobile-specific navigation behavior with hamburger menu and overlay.

**Files to Modify:**
- `components/layout/Sidebar.tsx` - Add mobile-specific behavior
- `components/dashboard/Header.tsx` - Add mobile hamburger button

**Implementation Details:**

1. Add hamburger menu button to Header (visible on mobile only)
2. Implement mobile menu state (open/closed)
3. Sidebar becomes full-screen overlay on mobile
4. Add backdrop overlay with blur effect
5. Close sidebar when clicking backdrop
6. Close sidebar when navigating to new route
7. Prevent body scroll when mobile menu is open
8. Add slide-in animation for mobile sidebar
9. Make hamburger icon animated (hamburger ↔ X)

**Acceptance Criteria:**
- [ ] Hamburger button appears on mobile (< 768px)
- [ ] Mobile menu opens as full-screen overlay
- [ ] Backdrop closes menu when clicked
- [ ] Body scroll is locked when menu is open
- [ ] Slide-in animation is smooth
- [ ] Menu closes on route navigation
- [ ] Works on all mobile devices and orientations

---

### Step 9: Add Navigation Tests

**Goal:** Create unit tests for navigation components and utilities.

**Files to Create:**
- `tests/unit/lib/navigation/utils.test.ts` - Navigation utilities tests
- `tests/unit/components/layout/Sidebar.test.tsx` - Sidebar component tests
- `tests/unit/lib/hooks/useSidebarState.test.ts` - Hook tests

**Implementation Details:**

1. Test `filterNavigationByPermissions()` with various permission sets
2. Test `filterNavigationByEntity()` with different entity scopes
3. Test Sidebar renders correct items for different roles
4. Test sidebar collapse/expand state management
5. Test active route highlighting logic
6. Mock Next.js navigation hooks (usePathname)
7. Test EntitySwitcher visibility based on role
8. Test mobile menu open/close behavior
9. Achieve > 80% code coverage for navigation code

**Acceptance Criteria:**
- [ ] All navigation utilities have unit tests
- [ ] Sidebar component has rendering tests
- [ ] Hook tests verify state management
- [ ] Tests cover permission filtering logic
- [ ] Tests cover entity scope filtering
- [ ] All tests pass without errors
- [ ] Code coverage > 80% for navigation code

---

### Step 10: Add Documentation and Polish

**Goal:** Document the navigation system and add final polish touches.

**Files to Create:**
- `projects/admin/app_docs/features/navigation-structure.md` - Feature documentation

**Files to Modify:**
- `projects/admin/README.md` - Update with navigation usage info
- `projects/admin/CHANGELOG.md` - Add entry for navigation feature

**Implementation Details:**

1. Write comprehensive feature documentation:
   - Overview of navigation architecture
   - How to add new navigation items
   - Permission mapping guide
   - Entity scope configuration
   - Mobile navigation behavior
   - Customization examples
2. Add screenshots of desktop and mobile navigation
3. Document accessibility features
4. Update README with navigation section
5. Add CHANGELOG entry for v0.3.0
6. Review all components for code quality
7. Ensure consistent naming conventions
8. Add inline code comments where needed
9. Verify all TypeScript types are exported properly

**Acceptance Criteria:**
- [ ] Feature documentation is complete and clear
- [ ] README includes navigation usage guide
- [ ] CHANGELOG entry added
- [ ] Screenshots included in documentation
- [ ] All components have JSDoc comments
- [ ] Code follows repository conventions
- [ ] No console errors or warnings in production build

## Testing Strategy

### Unit Tests

**Test Files:**
- `tests/unit/lib/navigation/utils.test.ts` - Navigation utility functions
- `tests/unit/lib/navigation/config.test.ts` - Navigation config validation
- `tests/unit/lib/hooks/useSidebarState.test.ts` - Sidebar state hook
- `tests/unit/lib/hooks/useActiveRoute.test.ts` - Active route hook
- `tests/unit/components/layout/Sidebar.test.tsx` - Sidebar component
- `tests/unit/components/layout/EntitySwitcher.test.tsx` - Entity switcher
- `tests/unit/components/dashboard/UserMenu.test.tsx` - User menu

**Key Test Cases:**
- [ ] filterNavigationByPermissions filters correctly for each role
- [ ] filterNavigationByEntity shows only relevant entity items
- [ ] useSidebarState persists to localStorage
- [ ] useActiveRoute matches routes correctly (exact and partial)
- [ ] Sidebar renders correct items for super_admin
- [ ] Sidebar renders correct items for ka_admin
- [ ] Sidebar renders correct items for ol_admin
- [ ] Sidebar renders correct items for support role
- [ ] EntitySwitcher only shows for super_admin
- [ ] UserMenu dropdown opens and closes
- [ ] Mobile menu overlay works correctly
- [ ] Nested navigation items expand/collapse

### Integration Tests

**Test Files:**
- `tests/integration/navigation-flow.test.ts` - End-to-end navigation flows

**Key Test Cases:**
- [ ] User can navigate through all permitted pages
- [ ] Active route highlighting updates on navigation
- [ ] Permission-denied pages are not accessible
- [ ] Entity switcher changes visible navigation items
- [ ] Sidebar state persists across page reloads
- [ ] Mobile menu works on touch devices

### E2E Tests (Playwright)

**Test Files:**
- `tests/e2e/navigation.spec.ts` - Browser-based navigation tests

**Key Test Cases:**
- [ ] Login and verify sidebar renders
- [ ] Click through all main navigation items
- [ ] Verify nested menus expand/collapse
- [ ] Test mobile menu on small viewport
- [ ] Test entity switcher functionality
- [ ] Test user menu dropdown
- [ ] Verify logout from user menu
- [ ] Test keyboard navigation (Tab through menu items)

## Security Considerations

- **S1:** All navigation items must respect permission checks - never rely on hiding UI alone
- **S2:** Backend routes must independently verify permissions (middleware/server components)
- **S3:** Entity scope is enforced at route level, not just in navigation visibility
- **S4:** User menu must not expose sensitive information (email is okay, internal IDs are not)
- **S5:** LocalStorage usage for sidebar state does not store sensitive data
- **S6:** Entity switcher only functional for authenticated super_admin users
- **S7:** Navigation config does not leak information about features user cannot access

## Performance Considerations

- **P1:** Navigation config filtering happens once per render, not per item
- **P2:** Sidebar uses CSS transforms for animations (GPU-accelerated)
- **P3:** Mobile menu uses React state, not force re-rendering entire layout
- **P4:** Icons are inlined SVG to avoid additional HTTP requests
- **P5:** localStorage operations are debounced to avoid excessive writes
- **P6:** Active route detection uses memoization to prevent recalculation
- **P7:** Navigation components use React.memo() where appropriate

## Rollout Plan

1. **Development:** Implement in isolated worktree (ADW ID: 4e39d315)
2. **Testing:** Run unit tests, integration tests, and E2E tests with Playwright
3. **Review:** Code review + screenshot validation in isolated environment
4. **Documentation:** Generate feature documentation and update README
5. **Deployment:** Merge to main → auto-deploy to admin dashboard

## Success Criteria

- [ ] All functional requirements met (FR1-FR10)
- [ ] All technical requirements met (TR1-TR8)
- [ ] All non-functional requirements met (NFR1-NFR5)
- [ ] All tests passing (unit + integration + E2E)
- [ ] Code follows repository conventions (TypeScript strict, Tailwind CSS)
- [ ] Documentation complete and clear
- [ ] No console errors or warnings in production build
- [ ] Navigation is fully keyboard accessible
- [ ] Mobile navigation works on all viewport sizes (320px+)
- [ ] Performance meets requirements (< 100ms render, < 300ms animations)

## Potential Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Navigation config becomes complex and hard to maintain | Medium | Medium | Use TypeScript types strictly, add comprehensive JSDoc comments, keep config in single file |
| Permission filtering logic has edge cases | High | Medium | Write extensive unit tests covering all permission patterns (*, users.*, *.read) |
| Mobile menu causes layout shift or jank | Medium | High | Use CSS transforms, test on real devices, add smooth transitions |
| LocalStorage not available (private mode) | Low | Low | Gracefully fallback to default expanded state, no errors |
| Entity switcher confuses users | Medium | Low | Add clear visual feedback, tooltip explaining purpose, limit to super_admin only |
| Nested navigation items cause UI clutter | Medium | Medium | Limit nesting to 2 levels, use clear visual hierarchy, test with real content |
| Accessibility issues with keyboard navigation | High | Medium | Follow ARIA best practices, test with screen readers, add keyboard shortcuts documentation |

## Notes

- **Styling:** Follow existing Tailwind CSS patterns from Header and LoginForm components
- **Icons:** Consider using Heroicons (already used in login page) for consistency
- **State Management:** Avoid complex state management libraries - React state + localStorage is sufficient
- **Future Enhancement:** Consider adding search functionality in sidebar for large navigation trees
- **Future Enhancement:** Add customizable navigation for users to pin favorite pages
- **Future Enhancement:** Add notification badges to navigation items (e.g., pending approvals count)
- **Mobile Performance:** Test on real devices (iOS Safari, Chrome Android) to ensure smooth animations
- **Dark Mode:** Consider dark mode support in future iteration (not required now)

---

**End of Plan**
