# Component Patterns & Design System Analysis
## Ozean Licht Ecosystem - Complete Component Inventory

**Date:** 2025-11-11  
**Scope:** Admin Dashboard (`apps/admin/`), Shared UI Library (`shared/ui-components/`), Design System  
**Total Components Identified:** 60+ components across 6 categories

---

## 1. COMPONENT ORGANIZATION PATTERNS

### Directory Structure (Admin Dashboard)
```
apps/admin/components/
├── ui/                    # Radix UI & shadcn primitives (15 components)
├── admin/                 # App-specific admin components (13 components)
│   ├── form/             # Form field wrappers (6 components)
│   ├── README.md         # Component documentation
│   └── index.ts          # Export barrel file
├── data-table/           # TanStack Table integration (8 components)
├── dashboard/            # Layout & navigation (4 components)
├── auth/                 # Authentication (2 components)
├── health/               # Server monitoring (5 components)
├── rbac/                 # Role-based access (3 components)
└── permissions/          # Permission management (5 components)
```

### Shared UI Library Structure
```
shared/ui-components/
├── src/
│   ├── components/       # Core components (5 components)
│   ├── tokens/          # Design tokens (4 files)
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions (cn utility)
│   └── index.ts         # Main export
├── COMPONENT-GUIDELINES.md  # Usage patterns
└── README.md            # Library documentation
```

---

## 2. COMPLETE COMPONENT INVENTORY

### A. UI PRIMITIVES (from `apps/admin/components/ui/`)

**15 Base Components** using shadcn/ui patterns:

| Component | Purpose | Variants | Status |
|-----------|---------|----------|--------|
| `button.tsx` | Interactive button | 5 variants (default, destructive, outline, secondary, ghost, link) | CVA-based |
| `card.tsx` | Content container | CardHeader, CardTitle, CardDescription, CardContent, CardFooter | Compound |
| `badge.tsx` | Status/tag indicator | Semantic colors (success, warning, destructive, info) | Exported |
| `input.tsx` | Text input field | text, email, password, number | Base primitive |
| `select.tsx` | Dropdown selector | Native + custom | Radix-based |
| `dialog.tsx` | Modal dialog | Customizable overlay | Radix portal |
| `popover.tsx` | Floating container | Auto-positioning | Radix |
| `calendar.tsx` | Date picker | Month/year navigation | Radix |
| `checkbox.tsx` | Checkbox input | Checked/unchecked states | Radix |
| `radio-group.tsx` | Radio buttons | Single selection | Radix |
| `tabs.tsx` | Tab navigation | Vertical/horizontal | Radix |
| `dropdown-menu.tsx` | Context menu | Configurable items | Radix |
| `label.tsx` | Form label | Association support | Simple |
| `command.tsx` | Command palette | Search + navigation | cmdk |
| `separator.tsx` | Visual divider | Vertical/horizontal | Simple |
| `progress.tsx` | Progress indicator | Percentage display | Radix |
| `alert.tsx` | Alert message | 3 variants (default, success, destructive) | Simple |
| `skeleton.tsx` | Loading placeholder | Animated pulse | Tailwind |
| `tooltip.tsx` | Hover tooltip | Auto positioning | Radix |
| `toast.tsx` + `toaster.tsx` | Toast notification | sonner integration | Custom |

**Implementation Pattern:**
```typescript
// Uses CVA (class-variance-authority) for variant management
const buttonVariants = cva(baseClasses, {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: 'default', size: 'default' }
})

// Compound patterns for complex components
export { Card, CardHeader, CardTitle, CardContent, CardFooter }

// Radix UI for accessibility
// All components: forwardRef, fully typed, accessible
```

---

### B. ADMIN-SPECIFIC COMPONENTS (from `apps/admin/components/admin/`)

**13 Dashboard Components** with business logic:

#### Status & Feedback Components
| Component | Usage | Variants |
|-----------|-------|----------|
| `status-badge.tsx` | Visual status indication | 12 variants (active, inactive, pending, approved, rejected, draft, published, archived, error, success, warning, info) |
| `action-button.tsx` | Semantic action buttons | 8 actions (edit, delete, view, approve, reject, publish, archive, restore) |
| `empty-state.tsx` | No data display | Title, description, action button |
| `confirmation-modal.tsx` | Destructive action confirm | 3 variants (danger, warning, info) |

#### Loading States
| Component | Type | Count |
|-----------|------|-------|
| `data-table-skeleton.tsx` | Table loading | Configurable rows/columns |
| `card-skeleton.tsx` | Card placeholder | Configurable card count |
| `list-skeleton.tsx` | List loading | Configurable items |

#### Form Components (in `admin/form/`)
| Component | Input Type | Features |
|-----------|-----------|----------|
| `form-field-wrapper.tsx` | Wrapper | Error display, help text, required indicator |
| `text-field.tsx` | Text input | Validation, error state, hints |
| `select-field.tsx` | Dropdown | Options array, onChange handler |
| `date-picker.tsx` | Date selection | Calendar popup, min/max dates |
| `checkbox-field.tsx` | Checkbox | Description text, error state |
| `radio-group-field.tsx` | Radio buttons | Option descriptions, error state |

**Key Patterns:**
- All form fields wrapped with `FormFieldWrapper` for consistency
- Error handling with `role="alert"` for accessibility
- Label association via `htmlFor`
- Help text and hints support

---

### C. DATA TABLE COMPONENTS (from `apps/admin/components/data-table/`)

**8 Specialized Table Components** using TanStack Table v8:

| Component | Purpose | Features |
|-----------|---------|----------|
| `data-table.tsx` | Main table | Sorting, filtering, pagination, row selection |
| `data-table-column-header.tsx` | Column with sort | Sortable indicator, direction display |
| `data-table-toolbar.tsx` | Search + filters | Global search, faceted filters |
| `data-table-pagination.tsx` | Page controls | Page size selector, navigation |
| `data-table-faceted-filter.tsx` | Column filter | Multi-select options with badges |
| `data-table-view-options.tsx` | Column visibility | Toggle columns on/off |
| `data-table-row-actions.tsx` | Row context menu | Edit, delete, custom actions |

**Advanced Features:**
- Server-side or client-side pagination
- CSV export functionality
- Bulk actions on selected rows
- Column reordering (via props)
- Responsive mobile view

---

### D. DASHBOARD LAYOUT (from `apps/admin/components/dashboard/`)

| Component | Role | Integration |
|-----------|------|-------------|
| `Header.tsx` | Top nav bar | Entity switcher, theme toggle |
| `Sidebar.tsx` | Left navigation | Logo, menu items, collapse |
| `Breadcrumb.tsx` | Path navigation | Dynamic route breadcrumbs |
| `EntitySwitcher.tsx` | Multi-tenant switch | Organization/entity selection |
| `ThemeToggle.tsx` | Dark mode toggle | next-themes integration |

---

### E. SPECIALIZED COMPONENTS

#### Authentication (`auth/`)
- `LoginForm.tsx` - Form with email/password
- `LogoutButton.tsx` - Sign out action

#### Health Monitoring (`health/`)
- `ServerHealthCard.tsx` - Server status display
- `DatabaseHealthCard.tsx` - DB connection check
- `MCPGatewayHealthCard.tsx` - MCP service status
- `HealthMetricCard.tsx` - Generic metric card
- `MetricRow.tsx` - Single metric display

#### RBAC (`rbac/`)
- `RoleBadge.tsx` - Role visual indicator
- `EntityBadge.tsx` - Entity identifier
- `RoleSelect.tsx` - Role selection dropdown

#### Permissions (`permissions/`)
- `PermissionBadge.tsx` - Permission indicator
- `PermissionCheckbox.tsx` - Permission toggle
- `PermissionMatrix.tsx` - Grid of permissions
- `PermissionEditor.tsx` - Batch permission editor
- `CategoryFilter.tsx` - Permission category filter

---

### F. SHARED UI COMPONENTS (from `shared/ui-components/src/components/`)

**5 Core Sharable Components** designed for ecosystem-wide use:

| Component | Purpose | Usage |
|-----------|---------|-------|
| `Button.tsx` | Brand button | 4 variants: primary, secondary, ghost, destructive |
| `Card.tsx` | Glass-effect card | Branded Ozean Licht styling |
| `Badge.tsx` | Status badge | Semantic colors with dot indicator |
| `Input.tsx` | Text input | Branded styling, icon support |
| `Select.tsx` | Dropdown | Custom styling, option support |

**Design Features:**
- All use Ozean Licht color tokens
- Glass morphism effects (backdrop blur)
- Turquoise (#0ec2bc) primary color
- Cosmic dark background (#0A0F1A)
- Full TypeScript support

---

## 3. DESIGN TOKEN SYSTEM

### A. Color Tokens
**Location:** `shared/ui-components/src/tokens/colors.ts`

```typescript
// PRIMARY - Turquoise Palette (9 shades)
primary: {
  DEFAULT: '#0ec2bc',    // Main brand
  50-900: gradient scale
  foreground: '#FFFFFF'
}

// SEMANTIC COLORS
destructive: '#EF4444'   // Red
success: '#10B981'       // Green
warning: '#F59E0B'       // Amber
info: '#3B82F6'          // Blue

// BACKGROUND SYSTEM
background: '#0A0F1A'    // Cosmic dark (main)
card: '#1A1F2E'          // Elevated surface
border: '#2A2F3E'        // Subtle border
input: '#2A2F3E'         // Form background

// MUTED COLORS
muted.DEFAULT: '#64748B'
muted.foreground: '#94A3B8'

// GLASS EFFECT COLORS (with alpha)
glassColors: {
  cardGlass: 'rgba(26, 31, 46, 0.7)',
  borderGlass: 'rgba(14, 194, 188, 0.25)',
  glowMedium: 'rgba(14, 194, 188, 0.3)'
}
```

**Tailwind Integration:** Direct color extends in `apps/admin/tailwind.config.js`

---

### B. Typography Tokens
**Location:** `shared/ui-components/src/tokens/typography.ts`

```typescript
fontFamily: {
  sans: 'Montserrat'                    // Body text
  serif: 'Cinzel'                       // Card titles (h4)
  decorative: 'Cinzel Decorative'       // Page titles (h1-h3)
  alt: 'Montserrat Alternates'          // Component titles (h5-h6)
  mono: 'Fira Code'                     // Code blocks
}

// HIERARCHY
h1: 3-4rem, Cinzel Decorative, 700 weight  (Page titles)
h2: 2.25-3rem, Cinzel Decorative, 700      (Section headings)
h3: 1.875-2.25rem, Cinzel Decorative, 400  (Subsections)
h4: 1.5-1.875rem, Cinzel, 600              (Card titles)
h5: 1.25-1.5rem, Montserrat Alternates, 600 (Component titles)

body-l: 1.125rem, Montserrat, 400   (Large body)
body-m: 1rem, Montserrat, 400       (Standard)
body-s: 0.875rem, Montserrat, 400   (Small/caption)
```

**Text Shadows:** Applied to headings (0 0 8px rgba(255,255,255, 0.6))

---

### C. Spacing Tokens
**Base Unit:** 8px

```typescript
spacing: {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px   ← BASE UNIT
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px  ← Most common padding
  6: '1.5rem',    // 24px  ← Section spacing
  8: '2rem',      // 32px  ← Large gaps
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}

// USAGE PATTERNS
component: px-4 py-2        // 16px horizontal, 8px vertical
card: p-6                   // 24px all sides
section: space-y-6          // 24px vertical spacing
```

---

### D. Animation Tokens
**Location:** `apps/admin/tailwind.config.js`

```typescript
animations: {
  glow: 'glow 2s ease-in-out infinite alternate'  // Pulsing turquoise
  float: 'float 6s ease-in-out infinite'           // Gentle floating
  shine: 'shine 2s linear infinite'                // Shimmer effect
  'accordion-down': '0.2s ease-out'                // Collapse animation
}

// KEYFRAMES DEFINED
glow: boxShadow 0-0-30px turquoise (animate emphasis)
float: translateY(0) → translateY(-10px) → translateY(0)
shine: horizontal shimmer effect
```

---

### E. Border Radius Tokens
```typescript
borderRadius: {
  sm: '0.25rem',  // 4px   (Small elements)
  md: '0.375rem', // 6px   (Standard)
  lg: '0.5rem',   // 8px   (Cards - default)
  xl: '0.75rem',  // 12px  (Large cards)
}
```

---

## 4. COMPONENT PATTERNS & CONVENTIONS

### A. Component Implementation Pattern

**Standard Component Structure:**
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  /** Variant selection */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size selection */
  size?: 'sm' | 'md' | 'lg'
  /** Custom class names */
  className?: string
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <Element
      ref={ref}
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  )
)
Component.displayName = 'Component'

export { Component }
```

**Key Patterns:**
- ✅ forwardRef for ref forwarding
- ✅ TypeScript for full type safety
- ✅ CVA (class-variance-authority) for variants
- ✅ cn() utility for class merging
- ✅ displayName for debugging
- ✅ Compound components (Card + CardHeader + CardContent)

---

### B. Form Component Pattern

**Standardized Form Field Pattern:**
```typescript
// All form fields use FormFieldWrapper for consistency
<FormFieldWrapper
  label="Field Label"
  error={errors.field}
  hint="Help text here"
  required
>
  <TextInput
    type="text"
    placeholder="Enter value..."
    value={value}
    onChange={handleChange}
  />
</FormFieldWrapper>
```

**Features:**
- Label association via htmlFor
- Error display with role="alert"
- Help text support
- Required indicator
- Accessible validation feedback

---

### C. Data Table Pattern

**TanStack Table v8 Integration:**
```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]

const table = useReactTable({
  data: users,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // Additional: sorting, filtering, pagination, selection
})
```

**Built-in Features:**
- Multi-column sorting
- Global and column-level filtering
- Row selection with checkboxes
- CSV export
- Column visibility toggles
- Server-side pagination support
- Bulk actions
- Responsive design

---

### D. Shared vs App-Specific Components

**Shared Components** (`shared/ui-components/`):
- ✅ Core UI primitives (Button, Card, Badge, Input, Select)
- ✅ Design tokens (colors, typography, spacing, animations)
- ✅ Utility functions (cn, glass effects)
- ✅ Used by ALL apps (admin, kids-ascension, ozean-licht)
- ✅ Ozean Licht branding by default

**App-Specific Components** (`apps/admin/components/`):
- ✅ UI primitives from shadcn/ui (for admin customization)
- ✅ Admin domain components (StatusBadge, ActionButton, etc.)
- ✅ Form field wrappers with validation
- ✅ Data table with TanStack Table
- ✅ Dashboard layout components
- ✅ Admin-specific patterns (RBAC, Permissions, Health)

---

## 5. ACCESSIBILITY & WCAG COMPLIANCE

### A. Color Contrast
- Turquoise (#0ec2bc) on dark background (#0A0F1A): **WCAG AA Pass**
- White foreground on dark background: **WCAG AAA Pass**
- All semantic colors meet AA standard

### B. Keyboard Navigation
- All interactive elements are keyboard accessible
- Visible focus states: `focus:outline-none focus:ring-2 focus:ring-primary`
- Tab order is logical
- Modals have focus trapping

### C. ARIA Attributes
- Form fields have `<label>` associations
- Error states use `role="alert"`
- Icon-only buttons have `aria-label`
- Headings use proper hierarchy (h1→h2→h3)

### D. Screen Reader Support
- Semantic HTML (header, main, nav, article)
- Proper ARIA roles for complex components
- Alt text on images
- Form validation announced to screen readers

---

## 6. DESIGN SYSTEM DOCUMENTATION

### A. Primary Documentation Files
1. **`/design-system.md`** (714 lines)
   - Complete design tokens
   - Color system with palettes
   - Typography hierarchy
   - Spacing and border radius
   - Glass morphism effects
   - Animation definitions
   - Component patterns
   - AI agent instructions

2. **`/BRANDING.md`** (Exists - not reviewed)
   - Brand guidelines
   - Logo usage
   - Color applications
   - Typography applications

3. **`/shared/ui-components/COMPONENT-GUIDELINES.md`** (920 lines)
   - Glass effects usage
   - Button variants and usage
   - Card patterns
   - Badge guidelines
   - Form patterns
   - Typography hierarchy
   - Layout patterns
   - Responsive design
   - Accessibility checklist
   - Performance considerations

4. **`/apps/admin/components/admin/README.md`** (334 lines)
   - 13 admin components documented
   - Type-safe form fields
   - Toast notifications
   - Complete example code
   - Dark mode support

5. **`/shared/ui-components/README.md`** (463 lines)
   - Installation instructions
   - Available components
   - Usage examples
   - Design tokens reference
   - Glass effect utilities
   - Typography classes
   - Theming instructions

---

### B. Component-Specific Documentation
- **Data Table:** `/apps/admin/components/data-table/README.md` (316 lines)
  - Features list
  - Basic usage
  - Advanced examples (sorting, selection, export)
  - Props documentation
  - Utilities and hooks
  - Performance notes (1000+ rows)
  - Accessibility features
  - Migration guide

---

## 7. BUILD & CONFIGURATION

### A. Tailwind CSS Configuration
**File:** `apps/admin/tailwind.config.js`

- Extends with Ozean Licht colors
- Custom font families
- Cosmic gradient background
- Animation keyframes
- Border radius scales
- Tailwindcss-animate plugin

### B. TypeScript Configuration
- Full strict mode
- Path aliases for components
- React 18 support
- Next.js app directory

### C. Package Structure
- **Root workspace:** pnpm monorepo
- **Shared UI package:** publishable to npm
- **Admin app:** Full Next.js application
- **Kids Ascension:** Separate branding (future)
- **Ozean Licht platform:** Uses shared components

---

## 8. COMPONENT COUNT SUMMARY

| Category | Count | Location |
|----------|-------|----------|
| UI Primitives | 20 | `apps/admin/components/ui/` |
| Admin Specific | 13 | `apps/admin/components/admin/` |
| Data Table | 8 | `apps/admin/components/data-table/` |
| Dashboard Layout | 5 | `apps/admin/components/dashboard/` |
| Authentication | 2 | `apps/admin/components/auth/` |
| Health Monitoring | 5 | `apps/admin/components/health/` |
| RBAC Components | 3 | `apps/admin/components/rbac/` |
| Permissions | 5 | `apps/admin/components/permissions/` |
| Shared/Core | 5 | `shared/ui-components/src/components/` |
| **TOTAL** | **66** | Across 8 directories |

---

## 9. STORYBOOK READINESS ASSESSMENT

### Current State
- ✅ Components well-organized in directories
- ✅ Good documentation in README files
- ✅ TypeScript fully typed
- ✅ Clear design system defined
- ✅ Accessibility standards met
- ✅ Design tokens centralized
- ❌ NO Storybook instance currently set up
- ❌ NO story files (.stories.tsx)
- ❌ NO visual component showcase

### Storybook Integration Opportunities
1. **For Shared Components** - 5 core components + design tokens
2. **For Admin Components** - 58 app-specific components
3. **For Design System** - Color/typography/spacing documentation
4. **For Data Table** - Interactive examples with mock data
5. **For Form Fields** - Validation states showcase
6. **For Accessibility** - a11y addon integration

### Recommended Story Organization
```
stories/
├── Introduction.mdx           # Ecosystem overview
├── DesignTokens/
│   ├── Colors.stories.tsx     # Color palette showcase
│   ├── Typography.stories.tsx # Font hierarchy
│   └── Spacing.stories.tsx    # Spacing scale
├── Shared/
│   ├── Button.stories.tsx     # 4 variants
│   ├── Card.stories.tsx       # Glass effects
│   ├── Badge.stories.tsx      # Semantic colors
│   ├── Input.stories.tsx      # Form input
│   └── Select.stories.tsx     # Dropdown
├── Admin/
│   ├── Status/
│   │   ├── StatusBadge.stories.tsx       # 12 variants
│   │   ├── ActionButton.stories.tsx      # 8 actions
│   │   ├── ConfirmationModal.stories.tsx # 3 types
│   │   └── EmptyState.stories.tsx        # Variations
│   ├── Forms/
│   │   ├── FormField.stories.tsx         # Field wrapper
│   │   ├── TextField.stories.tsx         # Text input
│   │   ├── SelectField.stories.tsx       # Select field
│   │   ├── DatePicker.stories.tsx        # Date input
│   │   ├── CheckboxField.stories.tsx     # Checkbox
│   │   └── RadioGroupField.stories.tsx   # Radio group
│   ├── DataTable/
│   │   ├── DataTable.stories.tsx         # Main table
│   │   ├── DataTableFeatures.stories.tsx # Sorting, filtering, etc.
│   │   └── DataTableExamples.stories.tsx # Real-world examples
│   ├── Layout/
│   │   ├── Header.stories.tsx            # Top navigation
│   │   ├── Sidebar.stories.tsx           # Left nav
│   │   └── Breadcrumb.stories.tsx        # Path nav
│   ├── Specialized/
│   │   ├── HealthCards.stories.tsx       # Server monitoring
│   │   ├── RBACComponents.stories.tsx    # Role-based
│   │   └── Permissions.stories.tsx       # Permission UI
│   └── Skeletons/
│       ├── DataTableSkeleton.stories.tsx # Loading states
│       ├── CardSkeleton.stories.tsx      # Card placeholders
│       └── ListSkeleton.stories.tsx      # List loading
├── KidsAscension/
│   └── (Separate branding stories - future)
└── Patterns/
    ├── FormPatterns.stories.mdx          # Form examples
    ├── DataTablePatterns.stories.mdx     # Table examples
    └── LayoutPatterns.stories.mdx        # Layout examples
```

---

## 10. KEY INSIGHTS FOR STORYBOOK IMPLEMENTATION

### 1. Component Completeness
- **Strengths:**
  - Well-documented with comprehensive README files
  - Type-safe with TypeScript throughout
  - Accessibility built-in (WCAG AA)
  - Design tokens already defined and exported
  - Both primitive and composed components exist
  
- **For Storybook:**
  - Each component can have 1-5 story variations
  - Form fields need validation state stories
  - Data table needs mock data for examples
  - Design tokens have dedicated documentation pages

### 2. Design System Maturity
- **Strong areas:**
  - Ozean Licht branding clearly defined
  - Glass morphism effects documented
  - Typography hierarchy established
  - Color system with semantic meanings
  - Spacing and animation tokens defined
  
- **For Storybook:**
  - Can showcase tokens visually (color palette, font sizes)
  - Glass effects can be demoed with different card states
  - Animations can be shown with interactive controls

### 3. Documentation Gaps for Storybook
- No visual component showcase currently exists
- No interactive prop controls for exploration
- No accessibility testing integration (a11y addon)
- No responsive behavior documentation
- No design token variables documentation

### 4. Implementation Priorities for Storybook
1. **Phase 1 (MVP):** Core shared components + design tokens (1-2 weeks)
2. **Phase 2:** Admin components with validation states (2-3 weeks)
3. **Phase 3:** Data table with real examples, accessibility addon (1 week)
4. **Phase 4:** Polish, deployment, CI/CD integration (1 week)

---

## RECOMMENDATIONS FOR IMPROVING STORYBOOK SPEC

1. **Component Stories:**
   - Create story for each unique variant/state combination
   - Include "Playground" story for interactive prop control
   - Add "All Variants" story showing all options at once
   - Include error states, loading states, disabled states

2. **Design Token Documentation:**
   - Color palette grid showing all 9 shades of turquoise
   - Typography scale showing all heading and body sizes
   - Spacing visualization with actual pixel measurements
   - Animation demos with play/pause controls

3. **Pattern Documentation:**
   - Form submission flow with validation
   - Data table with real-world examples (users, roles, permissions)
   - Multi-step forms with navigation
   - Empty states with different messaging

4. **Accessibility:**
   - Enable a11y addon on all stories
   - Document keyboard navigation patterns
   - Show color contrast values
   - Include screen reader testing examples

5. **Brand Separation:**
   - Use Storybook decorators to apply different themes
   - Document how to override tokens for Kids Ascension
   - Show both brand variations side-by-side

6. **Developer Experience:**
   - Create story templates for new component creation
   - Document story writing conventions
   - Add code snippets for common patterns
   - Include links to implementation files

---

## FILE PATHS FOR REFERENCE

### Component Files
- Admin UI Primitives: `/opt/ozean-licht-ecosystem/apps/admin/components/ui/*.tsx`
- Admin Components: `/opt/ozean-licht-ecosystem/apps/admin/components/admin/*.tsx`
- Data Table: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/*.tsx`
- Shared Components: `/opt/ozean-licht-ecosystem/shared/ui-components/src/components/*.tsx`

### Documentation
- Design System: `/opt/ozean-licht-ecosystem/design-system.md`
- Admin README: `/opt/ozean-licht-ecosystem/apps/admin/components/admin/README.md`
- Shared README: `/opt/ozean-licht-ecosystem/shared/ui-components/README.md`
- Component Guidelines: `/opt/ozean-licht-ecosystem/shared/ui-components/COMPONENT-GUIDELINES.md`
- Data Table Docs: `/opt/ozean-licht-ecosystem/apps/admin/components/data-table/README.md`

### Configuration
- Tailwind Config: `/opt/ozean-licht-ecosystem/apps/admin/tailwind.config.js`
- Color Tokens: `/opt/ozean-licht-ecosystem/shared/ui-components/src/tokens/colors.ts`
- Typography Tokens: `/opt/ozean-licht-ecosystem/shared/ui-components/src/tokens/typography.ts`

### Existing Storybook Spec
- Storybook Plan: `/opt/ozean-licht-ecosystem/specs/storybook-component-showcase-system.md`

