# components/

> React components organized by domain - admin-specific, UI primitives, data tables, and feature components.

## Quick Nav

**Primitives:** `ui/` | **Admin:** `admin/` | **Layout:** `dashboard/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add shadcn component | `ui/` | Copy from shadcn → Customize with design tokens |
| Add admin component | `admin/` | Create file → Export from `admin/index.ts` |
| Add form field | `admin/form/` | Create field → Export from `admin/form/index.ts` |
| Add data table feature | `data-table/` | Extend component → Export from `data-table/index.ts` |
| Add nav item | `dashboard/Sidebar.tsx` | Add to `navigationSections` array |
| Add role badge variant | `rbac/RoleBadge.tsx` | Add color mapping for new role |
| Add permission UI | `permissions/` | Use existing patterns (PermissionBadge, PermissionCheckbox) |

## Structure

```
.
├── ui/                       # shadcn/ui primitives (22 files)
│   ├── button.tsx            # Button with variants
│   ├── card.tsx              # Card container
│   ├── dialog.tsx            # Modal dialogs
│   ├── select.tsx            # Select dropdowns
│   ├── table.tsx             # Table primitives
│   └── ...                   # input, label, badge, tabs, etc.
├── admin/                    # Admin-specific components
│   ├── index.ts              # Barrel export
│   ├── status-badge.tsx      # Status indicators
│   ├── action-button.tsx     # Action with loading state
│   ├── empty-state.tsx       # Empty data display
│   ├── confirmation-modal.tsx # Confirm dialogs
│   ├── *-skeleton.tsx        # Loading skeletons
│   └── form/                 # Form field wrappers
│       ├── index.ts          # Barrel export
│       └── *.tsx             # text-field, select-field, date-picker, etc.
├── dashboard/                # Layout components
│   ├── Sidebar.tsx           # Navigation sidebar (add routes here)
│   ├── Header.tsx            # Top header with user menu
│   ├── Breadcrumb.tsx        # Breadcrumb navigation
│   ├── ThemeToggle.tsx       # Dark/light mode switch
│   └── EntitySwitcher.tsx    # Multi-entity selector
├── data-table/               # TanStack Table components
│   ├── index.ts              # Barrel export
│   ├── data-table.tsx        # Main table component
│   ├── data-table-toolbar.tsx    # Search, filters
│   ├── data-table-pagination.tsx # Pagination controls
│   └── data-table-*.tsx      # Column header, filters, actions
├── rbac/                     # Role-based access UI
│   ├── RoleBadge.tsx         # Role display badge
│   ├── EntityBadge.tsx       # Entity display badge
│   └── RoleSelect.tsx        # Role selection dropdown
├── permissions/              # Permission management UI
│   ├── PermissionMatrix.tsx  # Full permissions grid
│   ├── PermissionEditor.tsx  # Edit user permissions
│   ├── PermissionBadge.tsx   # Permission display
│   ├── PermissionCheckbox.tsx # Toggle permission
│   └── CategoryFilter.tsx    # Filter by category
├── health/                   # Health monitoring cards
│   ├── ServerHealthCard.tsx
│   ├── DatabaseHealthCard.tsx
│   ├── MCPGatewayHealthCard.tsx
│   └── HealthMetricCard.tsx
└── auth/                     # Authentication UI
    ├── LoginForm.tsx         # Login form component
    └── LogoutButton.tsx      # Logout action button
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `dashboard/Sidebar.tsx` | Navigation sidebar, route definitions, entity switcher | ●●● |
| `data-table/data-table.tsx` | TanStack Table wrapper with sorting, filtering, pagination | ●●● |
| `admin/index.ts` | Barrel export for admin components | ●● |
| `rbac/RoleBadge.tsx` | Role display with color coding per role | ●● |
| `permissions/PermissionMatrix.tsx` | Full permission grid with checkboxes | ●● |
| `ui/button.tsx` | Base button with variants (shadcn) | ●● |

## Import Patterns

```typescript
// Admin components (barrel import)
import { StatusBadge, ActionButton, EmptyState } from '@/components/admin'

// Form fields (barrel import)
import { TextField, SelectField, DatePicker } from '@/components/admin/form'

// Data table (barrel import)
import { DataTable, DataTableToolbar } from '@/components/data-table'

// UI primitives (individual import)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// RBAC components
import { RoleBadge } from '@/components/rbac/RoleBadge'
```

---

*Mapped: 2025-11-26 | Priority: high | Files: 70*
