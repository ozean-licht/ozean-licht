# Admin → Shared-UI Migration List

**Generated:** 2025-11-26
**Status:** In Progress

## Migration Summary

| Category | Files | Components Used |
|----------|-------|-----------------|
| Dashboard Pages | 6 | Card, Badge, Button, Input, Select |
| Data Table | 7 | Button, Badge, Table, Checkbox, Input, Select, Popover, Command, Separator, Dropdown |
| Permissions | 5 | Button, Card, Badge, Checkbox, Label, Tooltip, Select, Alert |
| RBAC | 3 | Badge, Select |
| Admin Components | 8 | Button, Card, Input, Label, Checkbox, RadioGroup, Calendar, Popover, Dialog, Skeleton |
| UI Internal | 4 | Skeleton, Table, Button, Dialog, Toast |

---

## File-by-File Migration List

### Phase 1: Simple Imports (Badge, Button, Card)

| File | Current Import | Migration |
|------|---------------|-----------|
| `app/dashboard/page.tsx` | SpanBadge | Use `SpanBadge` from `@ozean-licht/shared-ui` |
| `app/dashboard/access/users/[id]/page.tsx` | Button | CossUIButton as Button |
| `app/dashboard/access/users/[id]/not-found.tsx` | Button | CossUIButton as Button |
| `app/dashboard/access/users/[id]/UserDetailCard.tsx` | Badge, Card, Label | CossUIBadge, CossUICard, CossUILabel |
| `app/dashboard/access/users/[id]/permissions/page.tsx` | Card, Badge | CossUICard, CossUIBadge |
| `app/dashboard/access/permissions/page.tsx` | Card | CossUICard |
| `components/permissions/PermissionBadge.tsx` | Badge | CossUIBadge |
| `components/permissions/PermissionMatrix.tsx` | Badge, Button | CossUIBadge, CossUIButton |
| `components/rbac/EntityBadge.tsx` | Badge | CossUIBadge |
| `components/rbac/RoleBadge.tsx` | Badge | CossUIBadge |

### Phase 2: Form Components (Input, Label, Select, Checkbox)

| File | Current Import | Migration |
|------|---------------|-----------|
| `app/dashboard/access/users/UsersDataTable.tsx` | Input, Button, Select | CossUIInput, CossUIButton, CossUISelect |
| `app/dashboard/access/users/[id]/AdminUserForm.tsx` | Button, Label, Select | CossUIButton, CossUILabel, CossUISelect |
| `app/dashboard/access/users/columns.tsx` | Button, Badge, DropdownMenu | CossUIButton, CossUIBadge, DropdownMenu (keep) |
| `components/permissions/CategoryFilter.tsx` | Select | CossUISelect |
| `components/permissions/PermissionCheckbox.tsx` | Checkbox, Label, Tooltip | CossUICheckbox, CossUILabel, CossUITooltip |
| `components/permissions/PermissionEditor.tsx` | Button, Card, Alert | CossUIButton, CossUICard, CossUIAlert |
| `components/rbac/RoleSelect.tsx` | Select | CossUISelect |
| `components/admin/form/text-field.tsx` | Input | CossUIInput |
| `components/admin/form/form-field-wrapper.tsx` | Label | CossUILabel |
| `components/admin/form/select-field.tsx` | Select | CossUISelect |
| `components/admin/form/checkbox-field.tsx` | Checkbox, Label | CossUICheckbox, CossUILabel |
| `components/admin/form/radio-group-field.tsx` | RadioGroup, Label | CossUIRadioGroup, CossUILabel |

### Phase 3: Overlay & Complex Components

| File | Current Import | Migration |
|------|---------------|-----------|
| `components/admin/confirmation-modal.tsx` | Dialog, Button | CossUIDialog, CossUIButton |
| `components/admin/form/date-picker.tsx` | Calendar, Button, Popover | Calendar (keep), CossUIButton, CossUIPopover |
| `components/data-table/data-table.tsx` | Table, Checkbox | CossUITable, CossUICheckbox |
| `components/data-table/data-table-faceted-filter.tsx` | Badge, Button, Command, Popover, Separator | Mixed |
| `components/data-table/data-table-pagination.tsx` | Button, Select | CossUIButton, CossUISelect |
| `components/data-table/data-table-toolbar.tsx` | Button, Input | CossUIButton, CossUIInput |
| `components/data-table/data-table-view-options.tsx` | Button, DropdownMenu | CossUIButton, DropdownMenu (keep) |
| `components/data-table/data-table-row-actions.tsx` | Button, DropdownMenu | CossUIButton, DropdownMenu (keep) |
| `components/data-table/data-table-column-header.tsx` | Button | CossUIButton |

### Phase 4: Skeleton & Internal UI

| File | Current Import | Migration |
|------|---------------|-----------|
| `components/admin/card-skeleton.tsx` | Skeleton, Card | CossUISkeleton, CossUICard |
| `components/admin/list-skeleton.tsx` | Skeleton | CossUISkeleton |
| `components/admin/data-table-skeleton.tsx` | Skeleton, Table | CossUISkeleton, CossUITable |
| `components/ui/data-table-skeleton.tsx` | Skeleton, Table | DELETE (duplicate) |

### Keep Local (No Migration Needed)

| File | Reason |
|------|--------|
| `components/ui/calendar.tsx` | Specialized date picker, uses local Button |
| `components/ui/command.tsx` | cmdk integration, keep local |
| `components/ui/toaster.tsx` | Radix Toast integration |
| `hooks/use-toast.ts` | Toast state management |

---

## Component Mapping

| Admin Local | Shared-UI Import | Notes |
|-------------|------------------|-------|
| Button | CossUIButton as Button | Different variants available |
| Badge | CossUIBadge as Badge | Extended variants (success, warning, info) |
| Card, CardHeader, CardContent, CardFooter | CossUICard, CossUICardHeader, CossUICardPanel, CossUICardFooter | Note: CardPanel replaces CardContent |
| Input | CossUIInput as Input | Compatible |
| Label | CossUILabel as Label | Compatible |
| Select, SelectTrigger, SelectContent, SelectItem, SelectValue | CossUISelect* | Different component structure |
| Checkbox | CossUICheckbox as Checkbox | Compatible |
| RadioGroup, RadioGroupItem | CossUIRadioGroup, CossUIRadio | Compatible |
| Dialog, DialogContent, etc. | CossUIDialog* | Different structure (DialogPopup vs DialogContent) |
| Tooltip | CossUITooltip* | Different structure |
| Popover | CossUIPopover* | Different structure |
| Alert, AlertTitle, AlertDescription | CossUIAlert* | Compatible |
| Skeleton | CossUISkeleton as Skeleton | Compatible |
| Table, TableHeader, etc. | CossUITable* | Compatible |
| Separator | CossUISeparator as Separator | Compatible |
| Progress | CossUIProgress as Progress | Compatible |
| DropdownMenu | Keep from ./ui | Not in CossUI |
| Calendar | Keep from ./ui | Not in CossUI |
| Command | Keep from ./ui | Not in CossUI |

---

## Migration Strategy

### Step 1: Create Compatibility Layer

Create `apps/admin/lib/ui.ts` that re-exports shared-ui components with admin-friendly names:

```typescript
// Re-export CossUI components with convenient aliases
export { CossUIButton as Button, cossUIButtonVariants as buttonVariants } from '@ozean-licht/shared-ui'
export { CossUIBadge as Badge } from '@ozean-licht/shared-ui'
// ... etc
```

### Step 2: Update Imports

Change imports from:
```typescript
import { Button } from '@/components/ui/button'
```

To:
```typescript
import { Button } from '@/lib/ui'
```

### Step 3: Delete Local Components

After all files migrated, delete:
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- etc.

---

## Post-Migration Checklist

- [ ] All Phase 1 files migrated
- [ ] All Phase 2 files migrated
- [ ] All Phase 3 files migrated
- [ ] All Phase 4 files migrated
- [ ] Local UI components deleted
- [ ] Build passes
- [ ] Visual regression test passed
- [ ] ESLint rule added to prevent regression
