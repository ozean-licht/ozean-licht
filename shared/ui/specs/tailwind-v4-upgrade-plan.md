# Tailwind v4 Upgrade Plan - Ozean Licht Ecosystem

**Version:** 1.0.0
**Date:** 2025-11-19
**Status:** ✅ Core Upgrade Complete (Visual Verification Pending)
**Priority:** Critical

---

## Executive Summary

This document outlines the complete plan for upgrading the Ozean Licht ecosystem from Tailwind CSS v3.4 to v4.0. The upgrade was partially completed but has uncovered breaking changes that require immediate attention to restore full functionality.

**Current Status:**
- ✅ Core infrastructure upgraded (packages, PostCSS, globals.css)
- ✅ CSS variable syntax fixed in all 9 files
- ✅ Build configuration fixed (tsup.config.ts, exports)
- ✅ Package builds successfully (CJS + ESM)
- ⚠️ Storybook 404 errors persist (cache issue)
- ⏳ Visual regression testing pending

---

## Current Status Assessment

### ✅ Already Completed

1. **Package Upgrades:**
   - Workspace root: `tailwindcss@4.0.0`
   - `shared/ui`: `tailwindcss@4.0.0` + `@tailwindcss/postcss@4.0.0`
   - `apps/storybook`: `tailwindcss@4.0.0` + `@tailwindcss/postcss@4.0.0`

2. **Configuration Updates:**
   - PostCSS configs updated to v4 plugin syntax: `@tailwindcss/postcss`
   - `shared/ui/src/styles/globals.css` updated with `@import "tailwindcss"` (v4 syntax)
   - Old `@apply` directives removed from globals.css
   - Tailwind v3 config backed up as `tailwind.config.js.v3-backup`

3. **Module Type:**
   - `apps/storybook/package.json` has `"type": "module"` ✅

4. **Build System:**
   - Storybook builds successfully on port 6007
   - Build times: Manager 1.55s, Preview 842ms

### ❌ Critical Issues Found

1. **CSS Variable Syntax (BREAKING):** 9 files using v3 syntax
2. **Storybook Preview 404:** Port mismatch causing console errors
3. **Module Type Missing:** `shared/ui/package.json` lacks `"type": "module"`
4. **Border/Ring Colors:** Potential visual regressions (unverified)

---

## Phase 1: CSS Variable Syntax Migration 🔴 CRITICAL

### Problem

Tailwind v4 changed CSS variable syntax in arbitrary values:
- **v3:** `className="w-[--variable]"` (square brackets)
- **v4:** `className="w-(--variable)"` (parentheses)

### Files Affected (9 total)

All located in `/opt/ozean-licht-ecosystem/shared/ui/src/ui/`:

1. **calendar.tsx** - 8 instances of `[--cell-size]`
   - Lines: 30, 54, 59, 63, 67, 93, 160, 202
2. **select.tsx** - Unknown count
3. **context-menu.tsx** - Unknown count
4. **dropdown-menu.tsx** - Unknown count
5. **chart.tsx** - Unknown count
6. **popover.tsx** - Unknown count
7. **hover-card.tsx** - Unknown count
8. **menubar.tsx** - Unknown count
9. **tooltip.tsx** - Unknown count

### Fix Pattern

```tsx
// BEFORE (v3 - BROKEN in v4)
<div className="w-[--cell-size]" />
<div className="h-[--cell-size]" />
<div className="size-[--cell-size]" />
<div className="bg-[--my-color]" />

// AFTER (v4 - CORRECT)
<div className="w-(--cell-size)" />
<div className="h-(--cell-size)" />
<div className="size-(--cell-size)" />
<div className="bg-(--my-color)" />
```

### Implementation Steps

1. **Search & Replace:**
   ```bash
   # Find all instances
   grep -r '\[--' shared/ui/src/ui/*.tsx -n

   # Replace pattern: [-- → (--
   # Must preserve the closing bracket/paren context
   ```

2. **Manual Review Required:**
   - Not all `[--` can be blindly replaced
   - Must verify each instance is a CSS variable in arbitrary value
   - Check for nested contexts

3. **File-by-File Updates:**
   - Update calendar.tsx first (most occurrences)
   - Test in Storybook after each file
   - Document any visual changes

4. **Testing After Each File:**
   ```bash
   pnpm --filter @shared/ui build
   pnpm --filter storybook dev
   # Navigate to component stories
   # Verify rendering + glass effects
   ```

### Success Criteria

- [x] All 9 files updated with correct v4 syntax ✅
- [x] No console errors about CSS variables ✅
- [ ] Calendar component renders with correct cell sizes (pending Storybook)
- [ ] Dropdown menus position correctly (pending Storybook)
- [ ] Tooltips and popovers display properly (pending Storybook)
- [ ] Chart components render without layout breaks (pending Storybook)

---

## Phase 2: Fix Storybook Preview 404 Error 🔴 CRITICAL

### Problem

Console showing:
```
preview.tsx:1  Failed to load resource: the server responded with a status of 404 (Not Found)
Error reading preview.js:
TypeError: Failed to fetch dynamically imported module: http://localhost:6006/.storybook/preview.tsx
```

Storybook is running on port 6007 but trying to fetch from 6006.

### Root Causes (Hypothesis)

1. **Hardcoded Port Reference:**
   - Check `.storybook/main.ts` for `6006` references
   - Check `package.json` dev script
   - Check Vite config

2. **Cache Corruption:**
   - Old build artifacts pointing to wrong port
   - Storybook cache not fully cleared

3. **Preview Import Path:**
   - Dynamic import failing to resolve correct path
   - Module resolution issue after v4 upgrade

### Investigation Steps

1. **Audit Configuration:**
   ```bash
   grep -r "6006" apps/storybook/.storybook/
   grep -r "6006" apps/storybook/package.json
   grep -r "6006" apps/storybook/*.config.*
   ```

2. **Clear All Caches:**
   ```bash
   cd apps/storybook
   rm -rf node_modules/.cache
   rm -rf node_modules/.vite
   rm -rf .storybook-cache
   rm -rf dist
   ```

3. **Rebuild from Scratch:**
   ```bash
   pnpm install --filter storybook
   pnpm --filter storybook build
   pnpm --filter storybook dev -p 6007
   ```

### Fix Options

**Option A: Fix Port Reference**
- Update any hardcoded 6006 → 6007
- Or update port back to 6006 consistently

**Option B: Clear & Rebuild**
- Full cache purge
- Fresh dependency install
- New Storybook build

**Option C: Vite Config Override**
- Add explicit port in `.storybook/main.ts`
- Configure Vite final to use correct base URL

### Success Criteria

- [ ] No 404 errors in browser console
- [ ] Preview.tsx loads successfully
- [ ] All stories render without import errors
- [ ] Dynamic module imports work correctly

---

## Phase 3: Package.json Module Type 🟡 MEDIUM

### Problem

`shared/ui/package.json` missing `"type": "module"` while Tailwind v4 requires it.

### Current State

```json
{
  "name": "@shared/ui",
  "version": "0.1.0",
  // Missing: "type": "module"
}
```

### Required State

```json
{
  "name": "@shared/ui",
  "version": "0.1.0",
  "type": "module",
  "description": "Shared UI components..."
}
```

### Implementation

1. **Add Module Type:**
   - Edit `/opt/ozean-licht-ecosystem/shared/ui/package.json`
   - Add `"type": "module"` at top level

2. **Verify Compatibility:**
   - Check if tsup supports ESM build
   - Verify no CJS-only dependencies break
   - Test imports in consuming apps (admin, storybook)

3. **Test Build:**
   ```bash
   pnpm --filter @shared/ui build
   pnpm --filter @shared/ui typecheck
   ```

### Potential Issues

- **tsup Configuration:** May need ESM-specific config
- **Dual Output:** Already outputting both CJS and ESM, should be compatible
- **Import Maps:** Consuming apps may need import adjustments

### Success Criteria

- [ ] Package.json has `"type": "module"`
- [ ] Build succeeds without errors
- [ ] Type checking passes
- [ ] Storybook still imports components correctly
- [ ] Admin app can import @shared/ui components

---

## Phase 4: Transition-Transform Audit 🟢 LOW

### Status

**20+ instances found, but NONE in breaking context**

### Current Usage (All Safe)

```tsx
// These work perfectly in v4 ✅
className="transition-transform duration-300"
className="transition-transform hover:scale-110"
className="transition-transform group-data-[state=open]:rotate-180"
```

### Would Be Broken (Not found in codebase)

```tsx
// v3 syntax (BROKEN in v4)
className="transition-[transform,opacity]"

// v4 syntax (CORRECT)
className="transition-[transform,translate,scale,rotate,opacity]"
```

### Files Using transition-transform (20 files)

- `shared/ui/src/branded/blog-item.tsx`
- `shared/ui/src/branded/faq-item.tsx`
- `shared/ui/src/branded/course-card.tsx`
- `shared/ui/src/compositions/youtube-ticker.tsx`
- `shared/ui/src/cossui/badge.stories.tsx`
- `shared/ui/src/cossui/popover.stories.tsx`
- `shared/ui/src/cossui/accordion.tsx`
- `shared/ui/src/cossui/slider.tsx`
- `shared/ui/src/cossui/switch.tsx`
- `shared/ui/src/cossui/select.tsx`
- `shared/ui/src/ui/popover.stories.tsx`
- `shared/ui/src/ui/accordion.tsx`
- `shared/ui/src/ui/switch.tsx`
- `shared/ui/src/ui/collapsible.stories.tsx`
- And more...

### Action Required

**Visual Testing Only:**
- Monitor for animation glitches
- Verify transforms still smooth
- Check hover effects work
- No code changes needed

### Success Criteria

- [ ] All hover animations work
- [ ] Accordion expand/collapse smooth
- [ ] Scale effects on cards work
- [ ] Rotate effects on icons work
- [ ] No janky transitions

---

## Phase 5: Grid/Object Utilities 🟢 LOW

### Status

✅ **No Issues Found**

No instances of comma-based arbitrary grid values:
```tsx
// v3 syntax (NOT FOUND)
className="grid-cols-[1fr,auto,1fr]"

// v4 syntax (would need)
className="grid-cols-[1fr_auto_1fr]"
```

### Action Required

None - codebase does not use this pattern.

---

## Phase 6: Stacked Variants 🟢 LOW

### Status

✅ **No Issues Found**

No instances of v3-style stacked variants:
```tsx
// v3 syntax (NOT FOUND)
className="first:*:pt-0 last:*:pb-0"

// v4 syntax (would need)
className="*:first:pt-0 *:last:pb-0"
```

### Action Required

None - codebase does not use this pattern.

---

## Phase 7: Custom Utilities 🟢 LOW

### Status

✅ **No Issues Found**

No instances of `@layer utilities` in codebase.

### Would Be Breaking

```css
/* v3 syntax (NOT FOUND) */
@layer utilities {
  .tab-4 { tab-size: 4; }
}

/* v4 syntax (would need) */
@utility tab-4 {
  tab-size: 4;
}
```

### Action Required

None - no custom utilities defined.

---

## Phase 8: Border & Ring Color Verification 🟡 MEDIUM

### Breaking Changes in v4

**Default Border Color:**
- v3: `border-gray-200`
- v4: `border-currentColor`

**Default Ring:**
- v3: Width 3px, Color `blue-500`
- v4: Width 1px, Color `currentColor`

### Potential Impact

Components relying on default border colors may:
- Lose visible borders
- Have borders that change color with text
- Need explicit border color classes

### Visual Audit Required

**Components to Check:**
1. **All Cards** - Border visibility
2. **All Buttons** - Focus rings
3. **All Inputs** - Border and focus states
4. **All Dropdowns** - Border rendering
5. **All Popovers** - Border visibility
6. **All Dialogs** - Border rendering

### Testing Strategy

1. **Systematic Review:**
   - Open each component in Storybook
   - Check default state borders
   - Check hover state borders
   - Check focus state rings

2. **Comparison:**
   - Take screenshots of v3 components (if available)
   - Compare with v4 rendering
   - Document differences

3. **Fix Pattern:**
   ```tsx
   // If borders disappeared
   <Card className="border border-[#0E282E]">

   // If focus rings too thin
   <Input className="focus:ring-2 focus:ring-primary">
   ```

### Success Criteria

- [ ] All component borders visible
- [ ] Focus rings clearly visible on all focusable elements
- [ ] Border colors match design system (#0E282E)
- [ ] Ring colors use primary (#0ec2bc)
- [ ] No visual regressions in glass morphism effects

---

## Phase 9: Typography Plugin Configuration 🟢 LOW

### Investigation Needed

Check if `@tailwindcss/typography` is being used:

```bash
grep -r "@tailwindcss/typography" shared/ui/package.json
grep -r "prose" shared/ui/src
```

### If Found

- Verify plugin configuration migrated correctly
- Test prose styles in components
- Check if custom prose variants work

### If Not Found

No action needed.

---

## Phase 10: Documentation Updates 📝

### Files to Update

1. **COSSUI_IMPLEMENTATION.md:**
   - Update status from "⚠️ Tailwind v4 Upgrade In Progress"
   - Change to "✅ Tailwind v4 Upgrade Complete"
   - Document any component changes
   - Add migration notes section

2. **MIGRATION_SUMMARY.md:**
   - Create new file documenting v3 → v4 migration
   - List all breaking changes encountered
   - Document all fixes applied
   - Include before/after examples

3. **README.md:**
   - Update version to reflect v4
   - Add note about Tailwind v4 requirement
   - Update installation instructions if needed

4. **This File:**
   - Mark all phases as completed
   - Add final test results
   - Document any unexpected issues
   - Include performance metrics

---

## Testing Strategy

### For Each Phase

1. **Make Changes**
2. **Rebuild:**
   ```bash
   pnpm --filter @shared/ui build
   ```
3. **Start Storybook:**
   ```bash
   pnpm --filter storybook dev -p 6007
   ```
4. **Visual Inspection:**
   - Check affected components
   - Verify glass morphism
   - Test dark mode
   - Check responsive breakpoints
5. **Browser Console:**
   - No errors
   - No warnings
   - No 404s
6. **Document Results**

### Critical Components to Test

**CossUI Components (24 total):**
- Alert, Badge, Button, Card
- Checkbox, Dialog, Input, Label
- Menu, Popover, Progress, RadioGroup
- Select, Separator, Skeleton, Slider
- Spinner, Switch, Tabs, Textarea
- Toggle, ToggleGroup, Tooltip, Accordion

**ShadCN Components (50+ total):**
- All primitive components
- All layout components
- All form components
- All overlay components

**Branded Components:**
- Blog Item, Course Card, FAQ Item
- CTA Button, Testimonial Card
- Footer, Header

**Compositions:**
- YouTube Ticker
- Hero sections
- Feature grids

### Test Checklist

#### Visual Rendering
- [ ] All components render without errors
- [ ] Glass morphism effects visible
- [ ] Glow effects on hover work
- [ ] Border colors correct (#0E282E)
- [ ] Primary color correct (#0ec2bc)
- [ ] Background colors correct (#00070F, #00111A)
- [ ] Text colors correct (#fff headings, #C4C8D4 paragraphs)

#### Typography
- [ ] Cinzel Decorative renders in H1/H2
- [ ] Montserrat renders in body text
- [ ] Font weights correct (300, 400, 500-600)
- [ ] No bold fonts (700+) used
- [ ] Text shadows on H1/H2 visible

#### Interactions
- [ ] All hover states work
- [ ] All focus states visible
- [ ] All active states work
- [ ] Transitions smooth
- [ ] Animations run correctly

#### Dark Mode
- [ ] Dark mode enabled by default
- [ ] CSS variables resolve correctly
- [ ] All components visible in dark mode
- [ ] Contrast ratios meet WCAG AA

#### Responsive
- [ ] Mobile breakpoints work
- [ ] Tablet breakpoints work
- [ ] Desktop breakpoints work
- [ ] No layout shifts

---

## Success Criteria

### Phase Completion

- [ ] **Phase 1:** All CSS variables use v4 syntax `(--var)`
- [ ] **Phase 2:** Storybook loads without 404 errors
- [ ] **Phase 3:** shared/ui has `"type": "module"`
- [ ] **Phase 4:** All transitions work smoothly
- [ ] **Phase 5:** N/A - No grid utilities with commas
- [ ] **Phase 6:** N/A - No stacked variants
- [ ] **Phase 7:** N/A - No custom utilities
- [ ] **Phase 8:** All borders/rings visible and correct
- [ ] **Phase 9:** Typography plugin works (if used)
- [ ] **Phase 10:** All documentation updated

### Overall Success

- [ ] Zero console errors in Storybook
- [ ] All 476 stories render correctly
- [ ] No visual regressions vs v3
- [ ] Build times acceptable (<3s)
- [ ] All animations smooth
- [ ] Design system colors perfect
- [ ] WCAG AA compliance maintained
- [ ] All consuming apps work (admin, etc.)

---

## Execution Priority

### 🔴 CRITICAL - Do Immediately

1. **Phase 1:** CSS Variable Syntax (9 files)
2. **Phase 2:** Storybook 404 Fix

### 🟡 MEDIUM - Do Next

3. **Phase 3:** Module Type
4. **Phase 8:** Border/Ring Verification

### 🟢 LOW - Monitor Only

5. **Phase 4:** Transition Animations
6. **Phase 5:** Grid Utilities (N/A)
7. **Phase 6:** Stacked Variants (N/A)
8. **Phase 7:** Custom Utilities (N/A)
9. **Phase 9:** Typography Plugin

### 📝 FINAL - Documentation

10. **Phase 10:** Update all docs

---

## Timeline Estimate

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 1: CSS Variables | 1-2 hours | 🔴 Critical |
| Phase 2: Storybook Fix | 30-60 min | 🔴 Critical |
| Phase 3: Module Type | 15 min | 🟡 Medium |
| Phase 8: Border Verify | 1-2 hours | 🟡 Medium |
| Phase 4: Transitions | 30 min | 🟢 Low |
| Phase 10: Documentation | 30 min | 📝 Final |
| **Total** | **4-6 hours** | - |

---

## Risk Assessment

### High Risk
- **CSS Variable Syntax:** Could break layout of 9 components
- **Storybook 404:** Blocks all testing and validation

### Medium Risk
- **Border Colors:** Visual regressions possible
- **Module Type:** Could break build or imports

### Low Risk
- **Transitions:** Already working, just monitoring
- **Documentation:** No code impact

---

## Rollback Plan

### If Critical Issues Arise

1. **Revert Package Versions:**
   ```bash
   # In shared/ui/package.json and apps/storybook/package.json
   "tailwindcss": "^3.4.17"
   # Remove @tailwindcss/postcss

   pnpm install
   ```

2. **Restore v3 Config:**
   ```bash
   mv shared/ui/tailwind.config.js.v3-backup shared/ui/tailwind.config.js
   ```

3. **Revert globals.css:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Revert PostCSS:**
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

### Backup Locations
- `shared/ui/tailwind.config.js.v3-backup` - Original v3 config
- Git history - All files tracked
- Storybook cache - Can regenerate

---

## Questions & Decisions

### Open Questions

1. **Port 6007 vs 6006:** Which should be standard?
2. **Typography Plugin:** Is it being used? Need verification
3. **Performance:** Any measurable impact from v4?

### Decisions Made

1. ✅ Use Tailwind v4.0.0 (latest stable)
2. ✅ Use PostCSS plugin architecture (v4 requirement)
3. ✅ Add `"type": "module"` to all packages
4. ✅ Keep v3 config backed up for rollback
5. ✅ Test thoroughly before marking complete

---

## Next Steps

**Immediate Actions:**

1. Execute Phase 1 (CSS Variable Syntax)
2. Execute Phase 2 (Storybook 404 Fix)
3. Visual regression testing
4. Execute Phase 3 (Module Type)
5. Execute Phase 8 (Border Verification)
6. Final documentation updates

**Awaiting Approval to Proceed**

Ready to execute on command.

---

**Document Metadata:**
- **Author:** AI Agent (Claude Code)
- **Created:** 2025-11-19
- **Last Updated:** 2025-11-19
- **Status:** Draft - Awaiting Execution
- **Version:** 1.0.0
