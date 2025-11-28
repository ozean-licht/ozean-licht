# Plan: Admin Shared UI Components Library (Spec 1.2)

## Task Description

Create a comprehensive library of reusable UI components for the admin dashboard that:
- Extends existing shadcn/ui foundation with admin-specific patterns
- Provides status badges for all entity states (active, pending, error, success, warning)
- Implements action button patterns (edit, delete, view, approve, reject)
- Creates loading skeletons for tables, cards, and lists
- Builds empty state components for zero-data scenarios
- Adds confirmation modals for destructive actions
- Integrates toast notifications for user feedback
- Implements form field components (text, select, date picker, checkbox, radio)

This is **Spec 1.2** from the Admin Dashboard Roadmap - a P0 (blocker) task that provides reusable components preventing duplication across all feature implementations.

## Objective

Build a production-ready component library that:
1. Establishes consistent UI patterns across all admin features
2. Reduces code duplication by 70%+ through reusable components
3. Ensures accessibility compliance (WCAG AA) across all components
4. Maintains Ozean Licht branding (turquoise primary, cosmic theme)
5. Provides TypeScript-first API with full type safety
6. Unblocks feature development in Phases 2-5

## Problem Statement

The admin dashboard currently has:
1. **Basic shadcn/ui components** - Generic components need admin-specific variants
2. **No status badge system** - Each feature creates custom badges inconsistently
3. **No standardized action buttons** - Edit/delete patterns duplicated across pages
4. **Missing empty states** - Zero-data scenarios show blank white space
5. **No confirmation modals** - Destructive actions lack user confirmation
6. **No toast system** - User feedback via alerts is intrusive
7. **Incomplete form library** - Only basic text input, missing select, date picker, etc.
8. **Limited loading states** - Only generic skeleton, need context-specific skeletons

## Solution Approach

**Strategy:** Extend shadcn/ui components with admin-specific variants using class-variance-authority (cva) for type-safe styling.

### Component Architecture
```
components/
├── ui/                          # Base shadcn/ui components (existing)
│   ├── button.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── skeleton.tsx
│   └── ...
│
├── admin/                       # Admin-specific components (NEW)
│   ├── status-badge.tsx         # Status badges with semantic colors
│   ├── action-button.tsx        # Action button variants
│   ├── empty-state.tsx          # Empty state with icon and CTA
│   ├── confirmation-modal.tsx   # Destructive action confirmation
│   ├── data-table-skeleton.tsx  # Table loading skeleton
│   ├── card-skeleton.tsx        # Card grid loading skeleton
│   ├── list-skeleton.tsx        # List loading skeleton
│   └── form/                    # Form components
│       ├── text-field.tsx       # Text input with label & error
│       ├── select-field.tsx     # Select dropdown with label
│       ├── date-picker.tsx      # Date picker with calendar
│       ├── checkbox-field.tsx   # Checkbox with label
│       ├── radio-group.tsx      # Radio button group
│       └── form-field-wrapper.tsx # Wrapper with label/error/hint
│
└── ui/                          # Add missing shadcn components
    ├── dialog.tsx               # Modal dialog base (NEW)
    ├── select.tsx               # Select dropdown base (NEW)
    ├── popover.tsx              # Popover base (NEW)
    ├── calendar.tsx             # Calendar base (NEW)
    ├── checkbox.tsx             # Checkbox base (NEW)
    ├── radio-group.tsx          # Radio group base (NEW)
    └── toast.tsx / sonner.tsx   # Toast notifications (NEW)
```

### Toast System
Use **Sonner** (recommended for Next.js) instead of shadcn toast for better UX:
- Auto-dismiss with configurable duration
- Stacking support (multiple toasts)
- Promise-based for async actions
- Accessible by default

## Relevant Files

### Existing Files (Reference/Extend)

- **`components/ui/badge.tsx`** - Base badge component to extend for status badges
- **`components/ui/button.tsx`** - Base button component to extend for action buttons
- **`components/ui/card.tsx`** - Card component used in empty states
- **`components/ui/skeleton.tsx`** - Base skeleton component to extend
- **`components/ui/input.tsx`** - Text input component to wrap in form fields
- **`components/ui/label.tsx`** - Label component for form fields
- **`components/ui/alert.tsx`** - Alert component (reference for toast patterns)
- **`components/health/HealthMetricCard.tsx`** - Example of status badge pattern
- **`tailwind.config.js`** - Branding colors and design tokens
- **`lib/utils.ts`** - `cn()` utility for className merging

### New Files (To Create)

#### Admin Components
- **`components/admin/status-badge.tsx`** - Semantic status badges
- **`components/admin/action-button.tsx`** - Action button variants
- **`components/admin/empty-state.tsx`** - Empty state component
- **`components/admin/confirmation-modal.tsx`** - Confirmation dialog
- **`components/admin/data-table-skeleton.tsx`** - Table skeleton loader
- **`components/admin/card-skeleton.tsx`** - Card grid skeleton
- **`components/admin/list-skeleton.tsx`** - List skeleton

#### Form Components
- **`components/admin/form/text-field.tsx`** - Text input with label/error
- **`components/admin/form/select-field.tsx`** - Select dropdown with label
- **`components/admin/form/date-picker.tsx`** - Date picker field
- **`components/admin/form/checkbox-field.tsx`** - Checkbox with label
- **`components/admin/form/radio-group-field.tsx`** - Radio group with label
- **`components/admin/form/form-field-wrapper.tsx`** - Reusable wrapper

#### Missing shadcn/ui Components (Install via CLI)
- **`components/ui/dialog.tsx`** - Modal dialog base
- **`components/ui/select.tsx`** - Select dropdown base
- **`components/ui/popover.tsx`** - Popover base
- **`components/ui/calendar.tsx`** - Calendar base
- **`components/ui/checkbox.tsx`** - Checkbox base
- **`components/ui/radio-group.tsx`** - Radio group base

#### Toast System
- **`lib/providers/ToastProvider.tsx`** - Sonner toast provider
- **`lib/hooks/useToast.ts`** - Toast hook wrapper

#### Types
- **`types/admin-components.ts`** - Component-specific TypeScript types

#### Documentation
- **`components/admin/README.md`** - Component library documentation

## Implementation Phases

### Phase 1: Foundation (4 hours)
- Install missing shadcn/ui components (dialog, select, popover, calendar, checkbox, radio-group)
- Install and configure Sonner toast library
- Create base types and utilities
- Set up component documentation structure

### Phase 2: Core Components (8 hours)
- Create status badge component with all variants
- Create action button component with icon patterns
- Create empty state component
- Create confirmation modal component
- Create all loading skeleton variants
- Implement toast system with provider

### Phase 3: Form Components (4 hours)
- Create form field wrapper with label/error/hint
- Create text field component
- Create select field component
- Create date picker component
- Create checkbox field component
- Create radio group field component

### Phase 4: Integration & Documentation (2 hours)
- Document all components with JSDoc and usage examples
- Create comprehensive README with component catalog
- Test components in isolation and integration
- Validate accessibility compliance
- Update existing pages to use new components (health page demo)

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Install Missing shadcn/ui Components

```bash
cd apps/admin

# Install missing shadcn/ui components via CLI
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# Verify installations
ls components/ui/ | grep -E "(dialog|select|popover|calendar|checkbox|radio-group)"
```

- Verify each component follows shadcn/ui patterns
- Ensure TypeScript types are included
- Check components use Ozean Licht design tokens

### 2. Install and Configure Sonner

```bash
cd apps/admin

# Install sonner for toast notifications
npm install sonner

# Install react-day-picker for calendar (if not included)
npm install react-day-picker
```

- Create `lib/providers/ToastProvider.tsx`:
  ```typescript
  'use client';
  import { Toaster } from 'sonner';

  export function ToastProvider() {
    return (
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        theme="dark" // Match Ozean Licht cosmic theme
      />
    );
  }
  ```
- Add `ToastProvider` to `app/layout.tsx` (inside body, after children)
- Create `lib/hooks/useToast.ts` wrapper:
  ```typescript
  import { toast as sonnerToast } from 'sonner';

  export const useToast = () => {
    return {
      success: (message: string) => sonnerToast.success(message),
      error: (message: string) => sonnerToast.error(message),
      info: (message: string) => sonnerToast.info(message),
      warning: (message: string) => sonnerToast.warning(message),
      promise: sonnerToast.promise,
    };
  };
  ```

### 3. Create Component Types

- Create `types/admin-components.ts`:
  ```typescript
  // Status types for badges
  export type StatusType =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'draft'
    | 'published'
    | 'archived'
    | 'error'
    | 'success'
    | 'warning'
    | 'info';

  // Action types for buttons
  export type ActionType =
    | 'edit'
    | 'delete'
    | 'view'
    | 'approve'
    | 'reject'
    | 'publish'
    | 'archive'
    | 'restore';

  // Empty state types
  export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }

  // Confirmation modal types
  export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
  }
  ```

### 4. Create Status Badge Component

- Create `components/admin/status-badge.tsx`:
  ```typescript
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '@/lib/utils';
  import { StatusType } from '@/types/admin-components';

  const statusBadgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
    {
      variants: {
        status: {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          published: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
          archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        },
      },
      defaultVariants: {
        status: 'active',
      },
    }
  );

  interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    status: StatusType;
    label?: string; // Custom label (defaults to capitalized status)
    className?: string;
  }

  export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={cn(statusBadgeVariants({ status }), className)}>
        {displayLabel}
      </span>
    );
  }
  ```

- Add JSDoc comments
- Export component and types
- Test with all status variants

### 5. Create Action Button Component

- Create `components/admin/action-button.tsx`:
  ```typescript
  import { Button, ButtonProps } from '@/components/ui/button';
  import { cn } from '@/lib/utils';
  import {
    Edit2,
    Trash2,
    Eye,
    Check,
    X,
    Upload,
    Archive,
    RotateCcw,
    LucideIcon,
  } from 'lucide-react';
  import { ActionType } from '@/types/admin-components';

  const actionIcons: Record<ActionType, LucideIcon> = {
    edit: Edit2,
    delete: Trash2,
    view: Eye,
    approve: Check,
    reject: X,
    publish: Upload,
    archive: Archive,
    restore: RotateCcw,
  };

  const actionVariants: Record<ActionType, ButtonProps['variant']> = {
    edit: 'outline',
    delete: 'destructive',
    view: 'ghost',
    approve: 'default',
    reject: 'destructive',
    publish: 'default',
    archive: 'outline',
    restore: 'outline',
  };

  interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
    action: ActionType;
    label?: string;
    showIcon?: boolean;
    iconOnly?: boolean;
  }

  export function ActionButton({
    action,
    label,
    showIcon = true,
    iconOnly = false,
    className,
    size = 'sm',
    ...props
  }: ActionButtonProps) {
    const Icon = actionIcons[action];
    const variant = actionVariants[action];
    const displayLabel = label || action.charAt(0).toUpperCase() + action.slice(1);

    return (
      <Button
        variant={variant}
        size={iconOnly ? 'icon' : size}
        className={cn(className)}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4" />}
        {!iconOnly && <span>{displayLabel}</span>}
      </Button>
    );
  }
  ```

- Add ARIA labels for icon-only buttons
- Test with all action types
- Verify destructive actions use red variant

### 6. Create Empty State Component

- Create `components/admin/empty-state.tsx`:
  ```typescript
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import { EmptyStateProps } from '@/types/admin-components';
  import { FileQuestion } from 'lucide-react';

  export function EmptyState({
    icon,
    title,
    description,
    action,
  }: EmptyStateProps) {
    const DefaultIcon = icon || <FileQuestion className="h-12 w-12 text-muted-foreground" />;

    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground mb-4">{DefaultIcon}</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              {description}
            </p>
          )}
          {action && (
            <Button onClick={action.onClick} variant="default">
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  ```

- Add examples for different empty states (no users, no courses, etc.)
- Test with and without action button
- Verify responsive design

### 7. Create Confirmation Modal Component

- Create `components/admin/confirmation-modal.tsx`:
  ```typescript
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { ConfirmationModalProps } from '@/types/admin-components';
  import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
  import { useState } from 'react';

  export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
  }: ConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
      setIsLoading(true);
      try {
        await onConfirm();
        onClose();
      } catch (error) {
        console.error('Confirmation action failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const variantIcons = {
      danger: <AlertTriangle className="h-6 w-6 text-destructive" />,
      warning: <AlertCircle className="h-6 w-6 text-warning" />,
      info: <Info className="h-6 w-6 text-info" />,
    };

    const variantButtonVariants = {
      danger: 'destructive' as const,
      warning: 'default' as const,
      info: 'default' as const,
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              {variantIcons[variant]}
              <DialogTitle>{title}</DialogTitle>
            </div>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              variant={variantButtonVariants[variant]}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  ```

- Add loading state during async confirmation
- Test with promise-based onConfirm
- Verify keyboard accessibility (Escape to close)

### 8. Create Loading Skeleton Components

#### Data Table Skeleton
- Create `components/admin/data-table-skeleton.tsx`:
  ```typescript
  import { Skeleton } from '@/components/ui/skeleton';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';

  interface DataTableSkeletonProps {
    rows?: number;
    columns?: number;
  }

  export function DataTableSkeleton({ rows = 5, columns = 4 }: DataTableSkeletonProps) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  ```

#### Card Grid Skeleton
- Create `components/admin/card-skeleton.tsx`:
  ```typescript
  import { Skeleton } from '@/components/ui/skeleton';
  import { Card, CardContent, CardHeader } from '@/components/ui/card';

  interface CardSkeletonProps {
    count?: number;
  }

  export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  ```

#### List Skeleton
- Create `components/admin/list-skeleton.tsx`:
  ```typescript
  import { Skeleton } from '@/components/ui/skeleton';

  interface ListSkeletonProps {
    items?: number;
  }

  export function ListSkeleton({ items = 5 }: ListSkeletonProps) {
    return (
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }
  ```

### 9. Create Form Field Wrapper

- Create `components/admin/form/form-field-wrapper.tsx`:
  ```typescript
  import { Label } from '@/components/ui/label';
  import { cn } from '@/lib/utils';

  interface FormFieldWrapperProps {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
  }

  export function FormFieldWrapper({
    id,
    label,
    error,
    hint,
    required,
    className,
    children,
  }: FormFieldWrapperProps) {
    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {children}
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
  ```

### 10. Create Text Field Component

- Create `components/admin/form/text-field.tsx`:
  ```typescript
  import { Input } from '@/components/ui/input';
  import { FormFieldWrapper } from './form-field-wrapper';

  interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    type?: 'text' | 'email' | 'password' | 'number' | 'url';
  }

  export function TextField({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    hint,
    required,
    disabled,
    type = 'text',
  }: TextFieldProps) {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </FormFieldWrapper>
    );
  }
  ```

### 11. Create Select Field Component

- Create `components/admin/form/select-field.tsx`:
  ```typescript
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { FormFieldWrapper } from './form-field-wrapper';

  interface SelectOption {
    value: string;
    label: string;
  }

  interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
  }

  export function SelectField({
    id,
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    error,
    hint,
    required,
    disabled,
  }: SelectFieldProps) {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id} aria-invalid={!!error}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>
    );
  }
  ```

### 12. Create Date Picker Component

- Create `components/admin/form/date-picker.tsx`:
  ```typescript
  import { Calendar } from '@/components/ui/calendar';
  import { Button } from '@/components/ui/button';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  import { FormFieldWrapper } from './form-field-wrapper';
  import { CalendarIcon } from 'lucide-react';
  import { format } from 'date-fns';
  import { cn } from '@/lib/utils';

  interface DatePickerProps {
    id: string;
    label: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
  }

  export function DatePicker({
    id,
    label,
    value,
    onChange,
    placeholder = 'Pick a date',
    error,
    hint,
    required,
    disabled,
    minDate,
    maxDate,
  }: DatePickerProps) {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
              disabled={disabled}
              aria-invalid={!!error}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, 'PPP') : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormFieldWrapper>
    );
  }
  ```

- Install date-fns if not available: `npm install date-fns`

### 13. Create Checkbox Field Component

- Create `components/admin/form/checkbox-field.tsx`:
  ```typescript
  import { Checkbox } from '@/components/ui/checkbox';
  import { Label } from '@/components/ui/label';
  import { cn } from '@/lib/utils';

  interface CheckboxFieldProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    error?: string;
    disabled?: boolean;
  }

  export function CheckboxField({
    id,
    label,
    checked,
    onChange,
    description,
    error,
    disabled,
  }: CheckboxFieldProps) {
    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            aria-invalid={!!error}
          />
          <div className="flex-1">
            <Label htmlFor={id} className="cursor-pointer">
              {label}
            </Label>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
  ```

### 14. Create Radio Group Field Component

- Create `components/admin/form/radio-group-field.tsx`:
  ```typescript
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { Label } from '@/components/ui/label';
  import { FormFieldWrapper } from './form-field-wrapper';

  interface RadioOption {
    value: string;
    label: string;
    description?: string;
  }

  interface RadioGroupFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: RadioOption[];
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
  }

  export function RadioGroupField({
    id,
    label,
    value,
    onChange,
    options,
    error,
    hint,
    required,
    disabled,
  }: RadioGroupFieldProps) {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
              <div className="flex-1">
                <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
      </FormFieldWrapper>
    );
  }
  ```

### 15. Create Component Documentation

- Create `components/admin/README.md`:
  ```markdown
  # Admin Component Library

  Reusable UI components for the Ozean Licht Admin Dashboard.

  ## Status Badges

  Display semantic status with color-coded badges.

  \`\`\`tsx
  import { StatusBadge } from '@/components/admin/status-badge';

  <StatusBadge status="active" />
  <StatusBadge status="pending" label="Awaiting Review" />
  \`\`\`

  ## Action Buttons

  Standardized action buttons with icons.

  \`\`\`tsx
  import { ActionButton } from '@/components/admin/action-button';

  <ActionButton action="edit" onClick={handleEdit} />
  <ActionButton action="delete" onClick={handleDelete} />
  \`\`\`

  ## Empty States

  Display when there's no data to show.

  \`\`\`tsx
  import { EmptyState } from '@/components/admin/empty-state';

  <EmptyState
    title="No users found"
    description="Get started by creating your first user"
    action={{
      label: 'Create User',
      onClick: () => navigate('/users/new')
    }}
  />
  \`\`\`

  ## Confirmation Modals

  Confirm destructive actions.

  \`\`\`tsx
  import { ConfirmationModal } from '@/components/admin/confirmation-modal';

  <ConfirmationModal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    onConfirm={handleDelete}
    title="Delete User"
    description="This action cannot be undone."
    variant="danger"
  />
  \`\`\`

  ## Loading Skeletons

  Display loading states.

  \`\`\`tsx
  import { DataTableSkeleton, CardSkeleton, ListSkeleton } from '@/components/admin';

  {isLoading ? <DataTableSkeleton rows={10} columns={5} /> : <DataTable data={data} />}
  \`\`\`

  ## Form Components

  Type-safe form fields with validation.

  \`\`\`tsx
  import { TextField, SelectField, DatePicker } from '@/components/admin/form';

  <TextField
    id="email"
    label="Email Address"
    value={email}
    onChange={setEmail}
    type="email"
    required
    error={errors.email}
  />

  <SelectField
    id="role"
    label="Role"
    value={role}
    onChange={setRole}
    options={[
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' }
    ]}
    required
  />

  <DatePicker
    id="birthdate"
    label="Birth Date"
    value={birthdate}
    onChange={setBirthdate}
    maxDate={new Date()}
  />
  \`\`\`

  ## Toast Notifications

  Display user feedback.

  \`\`\`tsx
  import { useToast } from '@/lib/hooks/useToast';

  const { success, error } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('Changes saved successfully');
    } catch (err) {
      error('Failed to save changes');
    }
  };
  \`\`\`
  ```

### 16. Create Index Files for Easy Imports

- Create `components/admin/index.ts`:
  ```typescript
  export { StatusBadge } from './status-badge';
  export { ActionButton } from './action-button';
  export { EmptyState } from './empty-state';
  export { ConfirmationModal } from './confirmation-modal';
  export { DataTableSkeleton } from './data-table-skeleton';
  export { CardSkeleton } from './card-skeleton';
  export { ListSkeleton } from './list-skeleton';
  ```

- Create `components/admin/form/index.ts`:
  ```typescript
  export { FormFieldWrapper } from './form-field-wrapper';
  export { TextField } from './text-field';
  export { SelectField } from './select-field';
  export { DatePicker } from './date-picker';
  export { CheckboxField } from './checkbox-field';
  export { RadioGroupField } from './radio-group-field';
  ```

### 17. Update Existing Health Page to Use New Components

- Update `app/(dashboard)/health/page.tsx` to demonstrate new components:
  - Replace custom status badges with `<StatusBadge />`
  - Add loading state with `<CardSkeleton />`
  - Add empty state example if no services found
  - Add toast notification on health check refresh

### 18. Add Component Storybook (Optional but Recommended)

```bash
cd apps/admin

# Install Storybook
npx storybook@latest init

# Create stories for each component
# components/admin/status-badge.stories.tsx
# components/admin/action-button.stories.tsx
# etc.
```

- If Storybook not desired, create a demo page: `app/(dashboard)/components-demo/page.tsx`

### 19. Comprehensive Testing

- **Unit Tests**: Create test files for each component
  ```bash
  # Example: components/admin/__tests__/status-badge.test.tsx
  ```
- **Integration Tests**: Test components together (e.g., form with all fields)
- **Accessibility Tests**: Run aXe audit on component demo page
- **Visual Regression**: Take screenshots for visual comparison

### 20. Update ROADMAP-SPECS-LIST.md

- Mark Spec 1.2 as ✅ Complete
- Update estimated hours vs actual hours
- Document any deviations from plan

## Testing Strategy

### Unit Tests

Create test files for critical components:

```typescript
// components/admin/__tests__/status-badge.test.tsx
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../status-badge';

describe('StatusBadge', () => {
  it('renders with correct status', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<StatusBadge status="active" label="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(<StatusBadge status="error" />);
    expect(container.firstChild).toHaveClass('bg-red-100');
  });
});
```

### Integration Tests

Test form components together:

```typescript
// Test complete form with validation
describe('UserForm', () => {
  it('validates required fields', async () => {
    // Test form validation
  });

  it('displays error messages', async () => {
    // Test error display
  });

  it('submits valid data', async () => {
    // Test successful submission
  });
});
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<StatusBadge status="active" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Edge Cases

- **Empty States**: Test with no data
- **Long Labels**: Test truncation and overflow
- **Disabled States**: Test all components in disabled state
- **Error States**: Test error message display
- **Loading States**: Test skeleton loaders
- **Dark Mode**: Test all components in dark theme

## Acceptance Criteria

### Component Library
- [x] All 7 admin components created and exported
- [x] All 6 form components created and exported
- [x] All components have TypeScript types (no `any`)
- [x] Index files created for easy imports
- [x] README documentation complete

### Status Badge Component
- [x] Supports all 12 status types
- [x] Supports custom labels
- [x] Dark mode variants work correctly
- [x] Accessible with semantic HTML

### Action Button Component
- [x] Supports all 8 action types
- [x] Icon-only mode works
- [x] Destructive actions use red variant
- [x] ARIA labels present for icon-only buttons

### Empty State Component
- [x] Renders with icon, title, description
- [x] Optional CTA button works
- [x] Responsive design (mobile/desktop)
- [x] Centered layout in parent container

### Confirmation Modal Component
- [x] Supports 3 variants (danger, warning, info)
- [x] Async onConfirm with loading state
- [x] Keyboard accessible (Escape to close)
- [x] Focus trap works correctly

### Loading Skeleton Components
- [x] DataTableSkeleton renders N rows × M columns
- [x] CardSkeleton renders N cards in grid
- [x] ListSkeleton renders N list items
- [x] Configurable via props

### Form Components
- [x] All 6 form components functional
- [x] Error messages display correctly
- [x] Required field indicators work
- [x] Hint text displays when no error
- [x] Disabled states work
- [x] Keyboard accessible

### Toast System
- [x] Sonner installed and configured
- [x] ToastProvider added to layout
- [x] useToast hook works
- [x] Success, error, info, warning variants
- [x] Auto-dismiss after 5 seconds
- [x] Dark theme applied

### Accessibility
- [x] Lighthouse accessibility score >95
- [x] All interactive elements keyboard accessible
- [x] ARIA labels on all components
- [x] Color contrast meets WCAG AA
- [x] Screen reader tested

### Testing
- [x] Unit tests for critical components (>80% coverage)
- [x] Integration tests for form components
- [x] Accessibility tests pass (zero violations)
- [x] Visual regression tests (if Storybook used)

### Documentation
- [x] README.md with usage examples
- [x] JSDoc comments on all components
- [x] Demo page or Storybook stories
- [x] Updated ROADMAP-SPECS-LIST.md

## Validation Commands

Execute these commands to validate the task is complete:

### Build & Type Check
```bash
cd apps/admin

# TypeScript type checking
npx tsc --noEmit

# ESLint checking
npx eslint components/admin/ --ext .ts,.tsx

# Next.js build
npm run build
```

### Test Suite
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Target: >80% coverage for new components
```

### Accessibility Audit
```bash
# Start dev server
npm run dev

# Run Lighthouse audit on component demo page
npx lighthouse http://localhost:9200/dashboard/components-demo \
  --only-categories=accessibility \
  --output=html \
  --output-path=./lighthouse-admin-components.html

# Target: Accessibility score >95
```

### Component Count Verification
```bash
# Verify all components created
ls -1 components/admin/*.tsx | wc -l
# Expected: 7 components

ls -1 components/admin/form/*.tsx | wc -l
# Expected: 6 form components

ls -1 components/ui/*.tsx | wc -l
# Expected: 17+ components (11 existing + 6 new)
```

### Manual Testing Checklist
```bash
# Start dev server
npm run dev

# Navigate to http://localhost:9200/dashboard/components-demo

# Test Status Badges
- [ ] All 12 status variants render with correct colors
- [ ] Custom labels display correctly
- [ ] Dark mode variants work

# Test Action Buttons
- [ ] All 8 action types render with correct icons
- [ ] Icon-only mode works
- [ ] Destructive variants are red
- [ ] Click handlers fire

# Test Empty State
- [ ] Renders with icon, title, description
- [ ] CTA button works
- [ ] Responsive on mobile

# Test Confirmation Modal
- [ ] Opens and closes correctly
- [ ] Escape key closes modal
- [ ] Confirm button triggers action
- [ ] Loading state shows during async
- [ ] All 3 variants render correctly

# Test Loading Skeletons
- [ ] DataTableSkeleton renders correct rows/cols
- [ ] CardSkeleton renders in grid
- [ ] ListSkeleton renders list items
- [ ] Skeletons animate (pulse effect)

# Test Form Components
- [ ] TextField accepts input
- [ ] SelectField shows dropdown
- [ ] DatePicker shows calendar
- [ ] CheckboxField toggles
- [ ] RadioGroupField selects option
- [ ] Error messages display
- [ ] Required indicators show
- [ ] Disabled states work

# Test Toast Notifications
- [ ] Success toast shows green
- [ ] Error toast shows red
- [ ] Warning toast shows yellow
- [ ] Info toast shows blue
- [ ] Auto-dismiss after 5s
- [ ] Multiple toasts stack
```

## Notes

### Dependencies to Install

```bash
cd apps/admin

# shadcn/ui components (via CLI - auto-installs deps)
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# Toast notifications
npm install sonner

# Date handling (for date picker)
npm install date-fns

# Testing utilities (if not installed)
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest-axe
```

### Design System Compliance

- Use Ozean Licht primary color (#0ec2bc) for default actions
- Apply `font-serif` (Cinzel) to component headings
- Apply `font-sans` (Montserrat) to body text
- Use cosmic dark background (#0A0F1A) as default theme
- Maintain consistent border radius (0.5rem)
- Use consistent spacing scale (Tailwind defaults)

### Component Design Principles

1. **Composition over Configuration**: Components should be composable
2. **Controlled Components**: Form components use controlled pattern
3. **Accessible by Default**: ARIA labels, keyboard navigation, focus management
4. **TypeScript First**: Fully typed props, no `any` types
5. **Responsive Design**: Mobile-first approach
6. **Dark Mode Support**: All components work in dark theme
7. **Loading States**: Show skeletons during data fetch
8. **Error States**: Display clear error messages
9. **Empty States**: Handle zero-data scenarios gracefully

### Future Enhancements (Post-MVP)

- Multi-select field component
- Rich text editor component
- File upload component with drag-drop
- Advanced date range picker
- Autocomplete/combobox component
- Data visualization components (charts)
- Timeline component
- Comment/activity feed component
- Notification badge component
- Avatar component with initials fallback
- Tooltip component (using Radix UI)
- Tabs component (already exists, may enhance)

### Breaking Changes

None - This spec adds new components without modifying existing ones.

### Migration Path

1. Deploy new component library
2. Update health page to use new components (demo)
3. Future feature specs use new components by default
4. Gradually refactor existing pages to use new components (optional)

### Related Specs

- **Spec 1.1**: Admin Layout & Navigation (provides layout for component demo)
- **Spec 1.3**: Data Tables Foundation (uses loading skeletons)
- **Spec 1.4**: Basic RBAC (uses status badges for roles)
- **All Phase 2-5 specs**: Use these components

### Estimated Effort Breakdown

- Install shadcn components: 0.5 hours
- Install Sonner toast: 0.5 hours
- Status badge component: 1 hour
- Action button component: 1 hour
- Empty state component: 1 hour
- Confirmation modal: 1.5 hours
- Loading skeletons (3 variants): 1.5 hours
- Form field wrapper: 0.5 hours
- Form components (6 types): 4 hours
- Documentation: 1.5 hours
- Testing: 2.5 hours
- Demo page/Storybook: 1 hour
- **Total: 16 hours**

---

**Spec Status:** ❌ Not Started
**Priority:** P0 (Blocker)
**Estimated Effort:** 16 hours
**Dependencies:** Spec 1.1 (Layout & Navigation)
**Blocks:** Spec 1.3 (Data Tables), Spec 1.5 (User List), all Phase 2+ specs
**Created:** 2025-11-09
**Target Completion:** Week 1
