# Patch: Implement Sidebar Navigation for Admin Dashboard

## Metadata
adw_id: `5e37338e`
review_change_request: `Implement navigation structure for Admin Dashboard with sidebar component, entity-aware sections, admin header with user menu, protected route layout, navigation menu for dashboard pages, mobile-responsive collapsible sidebar, and entity switcher integration`

## Issue Summary
**Original Spec:** GitHub Issue #5 - Implement navigation structure for Admin Dashboard
**Issue:** The admin dashboard currently has only a top header with basic navigation. Need to implement a full sidebar navigation system with entity-aware sections, mobile responsiveness, and entity switcher functionality.
**Solution:** Create a Sidebar component with collapsible mobile support, integrate it into the dashboard layout, add entity-aware navigation items based on user permissions, and implement an entity switcher for multi-platform admins.

## Files to Modify
Use these files to implement the patch:

1. `projects/admin/components/dashboard/Sidebar.tsx` - Create new sidebar component
2. `projects/admin/components/dashboard/Header.tsx` - Update header to work with sidebar and add mobile menu toggle
3. `projects/admin/components/dashboard/EntitySwitcher.tsx` - Create new entity switcher component
4. `projects/admin/app/(dashboard)/layout.tsx` - Update layout to include sidebar
5. `projects/admin/types/navigation.ts` - Create navigation types

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create navigation types
- Define TypeScript interfaces for navigation items and entity-aware sections
- Include types for sidebar state (collapsed/expanded)
- Define entity scope types (kids_ascension, ozean_licht, all)

### Step 2: Create EntitySwitcher component
- Build dropdown component showing available entities based on user's entityScope
- Include entity icons/logos for visual identification
- Handle entity switching logic (future: will trigger data refresh)
- Style with Tailwind CSS for consistency

### Step 3: Create Sidebar component
- Build responsive sidebar with collapsible mobile support
- Implement entity-aware navigation sections:
  - Dashboard (always visible)
  - Kids Ascension section (if entityScope allows)
  - Ozean Licht section (if entityScope allows)
  - Settings (always visible)
- Add active route highlighting
- Include EntitySwitcher at the bottom of sidebar
- Use Tailwind CSS for responsive design (hidden on mobile by default)
- Add transition animations for collapse/expand

### Step 4: Update Header component
- Add mobile menu toggle button (hamburger icon)
- Keep existing user menu and logout functionality
- Update styling to work alongside sidebar
- Add prop for controlling mobile sidebar visibility

### Step 5: Update dashboard layout
- Integrate Sidebar component with Header
- Implement mobile sidebar state management (client component wrapper)
- Adjust main content area to accommodate sidebar
- Add overlay for mobile when sidebar is open
- Ensure responsive breakpoints match Tailwind defaults (md: 768px)

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. **TypeScript type check:**
   ```bash
   cd projects/admin && npm run typecheck
   ```

2. **Frontend build:**
   ```bash
   cd projects/admin && npm run build
   ```

3. **Unit tests:**
   ```bash
   cd projects/admin && npm run test
   ```

4. **Manual verification (if dev server is available):**
   - Verify sidebar renders on desktop (>=768px)
   - Verify sidebar is hidden on mobile by default (<768px)
   - Verify mobile menu toggle works
   - Verify entity-aware sections show/hide based on permissions
   - Verify active route highlighting works
   - Verify entity switcher appears for super admins

## Patch Scope
**Lines of code to change:** ~400-500 (3 new components + 2 modified files + types)
**Risk level:** Medium - affects core navigation UX but no backend changes
**Testing required:** TypeScript checks, build verification, unit tests for navigation logic
