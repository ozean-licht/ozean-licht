# Components

> React components organized by domain — 87 components across 11 directories: UI primitives, admin widgets, data tables, and feature-specific components.

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
| Add course component | `courses/` | Create file → Export from `courses/index.ts` |
| Add project component | `projects/` | Create file → Export from `projects/index.ts` |
| Add role badge variant | `rbac/RoleBadge.tsx` | Add color mapping for new role |

## Structure

```
.
├── ui/                       # shadcn/ui primitives (27 files)
│   ├── button.tsx            # Button with variants
│   ├── card.tsx              # Card container
│   ├── dialog.tsx            # Modal dialogs
│   ├── select.tsx            # Select dropdowns
│   ├── table.tsx             # Table primitives
│   └── ...                   # input, label, badge, tabs, toast, etc.
├── admin/                    # Admin-specific (13 files)
│   ├── index.ts              # Barrel export
│   ├── status-badge.tsx      # Status indicators
│   ├── action-button.tsx     # Action with loading state
│   ├── empty-state.tsx       # Empty data display
│   ├── confirmation-modal.tsx # Confirm dialogs
│   ├── *-skeleton.tsx        # Loading skeletons
│   └── form/                 # Form field wrappers
│       └── *.tsx             # text-field, select-field, date-picker
├── dashboard/                # Layout (7 files)
│   ├── Sidebar.tsx           # Navigation sidebar (add routes here)
│   ├── Header.tsx            # Top header with user menu
│   ├── Breadcrumb.tsx        # Breadcrumb navigation
│   ├── ThemeToggle.tsx       # Dark/light mode switch
│   ├── UserMenu.tsx          # User dropdown menu
│   └── EntitySwitcher.tsx    # Multi-entity selector
├── data-table/               # TanStack Table (7 files)
│   ├── index.ts              # Barrel export
│   ├── data-table.tsx        # Main table component
│   ├── data-table-toolbar.tsx    # Search, filters
│   ├── data-table-pagination.tsx # Pagination controls
│   └── data-table-*.tsx      # Column header, filters, actions
├── courses/                  # Course builder (8 files)
│   ├── index.ts              # Barrel export
│   ├── CourseDetailHeader.tsx # Course header with actions
│   ├── CourseEditorModal.tsx # Create/edit course dialog
│   ├── ModuleList.tsx        # Draggable module list
│   ├── ModuleEditorModal.tsx # Create/edit module
│   ├── LessonList.tsx        # Lesson list within module
│   ├── LessonEditorModal.tsx # Create/edit lesson
│   ├── VideoPicker.tsx       # Video selection dialog
│   └── ImageUploader.tsx     # Image upload component
├── projects/                 # Project management (8 files)
│   ├── index.ts              # Barrel export
│   ├── ProjectCard.tsx       # Project card display
│   ├── TaskList.tsx          # Task list view
│   ├── TaskListItem.tsx      # Single task row
│   ├── CommentThread.tsx     # Comment display
│   ├── CommentForm.tsx       # Add comment form
│   ├── MyTasksWidget.tsx     # User's tasks widget
│   ├── ProcessTemplatesWidget.tsx # Template selection
│   └── PriorityDot.tsx       # Priority indicator
├── permissions/              # Permission UI (5 files)
│   ├── PermissionMatrix.tsx  # Full permissions grid
│   ├── PermissionEditor.tsx  # Edit user permissions
│   ├── PermissionBadge.tsx   # Permission display
│   ├── PermissionCheckbox.tsx # Toggle permission
│   └── CategoryFilter.tsx    # Filter by category
├── health/                   # Health monitoring (5 files)
│   ├── ServerHealthCard.tsx
│   ├── DatabaseHealthCard.tsx
│   ├── MCPGatewayHealthCard.tsx
│   ├── HealthMetricCard.tsx
│   └── MetricRow.tsx
├── rbac/                     # Role-based UI (3 files)
│   ├── RoleBadge.tsx         # Role display badge
│   ├── EntityBadge.tsx       # Entity display badge
│   └── RoleSelect.tsx        # Role selection dropdown
├── storage/                  # Storage UI (2 files)
│   ├── StoragePageHeader.tsx # Storage page header
│   └── StorageToolbar.tsx    # Storage toolbar actions
└── auth/                     # Auth UI (2 files)
    ├── LoginForm.tsx         # Login form component
    └── LogoutButton.tsx      # Logout action button
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `dashboard/Sidebar.tsx` | Navigation sidebar, route definitions, menu structure | ●●● |
| `data-table/data-table.tsx` | TanStack Table wrapper with sorting, filtering, pagination | ●●● |
| `ui/button.tsx` | Base button with variants (shadcn) | ●●● |
| `ui/dialog.tsx` | Modal dialog primitive | ●●● |
| `admin/index.ts` | Barrel export for admin components | ●● |
| `courses/index.ts` | Barrel export for course components | ●● |
| `projects/ProjectCard.tsx` | Project card with status, dates, progress | ●● |
| `rbac/RoleBadge.tsx` | Role display with color coding per role | ●● |
| `permissions/PermissionMatrix.tsx` | Full permission grid with checkboxes | ●● |

## Import Patterns

```typescript
// Admin components (barrel import)
import { StatusBadge, ActionButton, EmptyState } from '@/components/admin'

// Form fields (barrel import)
import { TextField, SelectField, DatePicker } from '@/components/admin/form'

// Data table (barrel import)
import { DataTable, DataTableToolbar } from '@/components/data-table'

// Course components (barrel import)
import { ModuleList, LessonList, CourseEditorModal } from '@/components/courses'

// Project components (barrel import)
import { ProjectCard, TaskList, CommentThread } from '@/components/projects'

// UI primitives (individual import)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// RBAC components
import { RoleBadge } from '@/components/rbac/RoleBadge'

// Shared UI (prefer this over local ui/)
import { Button, Card } from '@ozean-licht/shared-ui'
```

## Component Counts by Directory

| Directory | Count | Purpose |
|-----------|-------|---------|
| `ui/` | 27 | shadcn primitives |
| `admin/` | 13 | Admin widgets, skeletons, forms |
| `courses/` | 8 | Course builder components |
| `projects/` | 8 | Project management components |
| `dashboard/` | 7 | Layout (Sidebar, Header, etc.) |
| `data-table/` | 7 | TanStack Table wrappers |
| `permissions/` | 5 | Permission matrix UI |
| `health/` | 5 | Health monitoring cards |
| `rbac/` | 3 | Role/entity badges |
| `storage/` | 2 | Storage toolbar |
| `auth/` | 2 | Login/logout |

---

*Mapped: 2025-12-02 | Priority: high | Files: 87*
