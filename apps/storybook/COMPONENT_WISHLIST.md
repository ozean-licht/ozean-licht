# Storybook Component Wishlist

**Goal:** Curated, working component library for Admin Dashboard UI

## Phase 1: Essential Admin Components (Priority)

### Data Display
- [ ] **Table** - User lists, permissions matrix, logs
- [ ] **Card** - Dashboard cards, stat cards
- [ ] **Badge** - Status indicators, entity tags
- [ ] **Avatar** - User profiles

### Forms & Input
- [ ] **Button** - Primary, secondary, destructive actions
- [ ] **Input** - Text fields, search
- [ ] **Select** - Dropdowns (entity, role selection)
- [ ] **Checkbox** - Permission toggles, multi-select
- [ ] **Switch** - Feature toggles
- [ ] **Label** - Form labels
- [ ] **Form** - Form wrapper with validation

### Navigation
- [ ] **Breadcrumb** - Page navigation
- [ ] **Tabs** - Content organization
- [ ] **Dropdown Menu** - Action menus, user menu

### Feedback
- [ ] **Alert** - Success/error messages
- [ ] **Toast** - Notifications
- [ ] **Dialog** - Confirmations, modals
- [ ] **Progress** - Loading states

### Layout
- [ ] **Separator** - Visual dividers
- [ ] **Skeleton** - Loading placeholders

## Phase 2: Enhanced Components (Later)

### Data Visualization
- [ ] **Chart** (recharts) - Metrics, analytics
- [ ] **Calendar** - Event scheduling

### Advanced Input
- [ ] **Combobox** - Searchable selects
- [ ] **Date Picker** - Date selection
- [ ] **Textarea** - Multi-line input

### Advanced UI
- [ ] **Tooltip** - Help text
- [ ] **Popover** - Context menus
- [ ] **Sheet** - Side panels
- [ ] **Command** - Command palette

## Installation Strategy

1. **Remove current broken components**
   - Clean `/shared/ui/src/components/`
   - Clean `/shared/ui/src/catalyst/`
   - Keep only: `/shared/ui/src/lib/utils.ts`

2. **Install shadcn components via CLI**
   ```bash
   cd /opt/ozean-licht-ecosystem/shared/ui
   npx shadcn@latest add button card badge table input select
   # etc., one by one
   ```

3. **Customize for Ozean Licht**
   - Apply design-system.md colors
   - Glass morphism variants
   - Glow effects on hover
   - Cosmic dark theme

4. **Create stories for each**
   - Show all variants
   - Dark theme only
   - Ozean Licht branding

5. **Verify in Storybook**
   - Each component renders correctly
   - Styling is perfect
   - No console errors

## Success Criteria

- ✅ All components render with correct Ozean Licht styling
- ✅ No console errors in Storybook
- ✅ Responsive design works
- ✅ Dark theme applies correctly
- ✅ Glass morphism effects visible
- ✅ Ready for admin dashboard implementation
