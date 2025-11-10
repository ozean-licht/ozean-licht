# Admin Component Library

Reusable UI components for the Ozean Licht Admin Dashboard.

## Overview

This library provides production-ready components with:
- **Type Safety**: Full TypeScript support with strict typing
- **Accessibility**: WCAG AA compliant with ARIA labels and keyboard navigation
- **Dark Mode**: All components support dark theme
- **Consistency**: Standardized patterns across the admin dashboard
- **Validation**: Built-in error handling and validation display

## Components

### Status Badges

Display semantic status with color-coded badges.

**12 Variants**: active, inactive, pending, approved, rejected, draft, published, archived, error, success, warning, info

```tsx
import { StatusBadge } from '@/components/admin';

<StatusBadge status="active" />
<StatusBadge status="pending" label="Awaiting Review" />
<StatusBadge status="error" />
```

### Action Buttons

Standardized action buttons with icons and semantic variants.

**8 Action Types**: edit, delete, view, approve, reject, publish, archive, restore

```tsx
import { ActionButton } from '@/components/admin';

<ActionButton action="edit" onClick={handleEdit} />
<ActionButton action="delete" onClick={handleDelete} />
<ActionButton action="view" iconOnly onClick={handleView} />
```

### Empty States

Display when there's no data to show.

```tsx
import { EmptyState } from '@/components/admin';

<EmptyState
  title="No users found"
  description="Get started by creating your first user"
  action={{
    label: 'Create User',
    onClick: () => router.push('/users/new')
  }}
/>
```

### Confirmation Modals

Confirm destructive actions before executing.

**3 Variants**: danger, warning, info

```tsx
import { ConfirmationModal } from '@/components/admin';

const [isOpen, setIsOpen] = useState(false);

<ConfirmationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={async () => {
    await deleteUser(userId);
  }}
  title="Delete User"
  description="This action cannot be undone."
  variant="danger"
/>
```

### Loading Skeletons

Display loading states for different layouts.

**3 Skeleton Types**: DataTable, Card, List

```tsx
import { DataTableSkeleton, CardSkeleton, ListSkeleton } from '@/components/admin';

{isLoading ? <DataTableSkeleton rows={10} columns={5} /> : <DataTable data={data} />}
{isLoading ? <CardSkeleton count={6} /> : <CardGrid items={items} />}
{isLoading ? <ListSkeleton items={8} /> : <UserList users={users} />}
```

## Form Components

Type-safe form fields with validation and accessibility.

### Text Field

```tsx
import { TextField } from '@/components/admin/form';

<TextField
  id="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  type="email"
  placeholder="you@example.com"
  required
  error={errors.email}
  hint="We'll never share your email"
/>
```

### Select Field

```tsx
import { SelectField } from '@/components/admin/form';

<SelectField
  id="role"
  label="User Role"
  value={role}
  onChange={setRole}
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' }
  ]}
  required
  error={errors.role}
/>
```

### Date Picker

```tsx
import { DatePicker } from '@/components/admin/form';

<DatePicker
  id="birthdate"
  label="Birth Date"
  value={birthdate}
  onChange={setBirthdate}
  maxDate={new Date()}
  placeholder="Select date of birth"
  required
/>
```

### Checkbox Field

```tsx
import { CheckboxField } from '@/components/admin/form';

<CheckboxField
  id="terms"
  label="Accept Terms and Conditions"
  description="You must accept the terms to continue"
  checked={acceptedTerms}
  onChange={setAcceptedTerms}
  error={errors.terms}
/>
```

### Radio Group Field

```tsx
import { RadioGroupField } from '@/components/admin/form';

<RadioGroupField
  id="notification"
  label="Notification Preference"
  value={preference}
  onChange={setPreference}
  options={[
    {
      value: 'email',
      label: 'Email',
      description: 'Receive notifications via email'
    },
    {
      value: 'sms',
      label: 'SMS',
      description: 'Receive notifications via text message'
    }
  ]}
  required
/>
```

## Toast Notifications

Display user feedback messages.

```tsx
import { useToast } from '@/lib/hooks/useToast';

const { success, error, warning, info } = useToast();

const handleSave = async () => {
  try {
    await saveData();
    success('Changes saved successfully');
  } catch (err) {
    error('Failed to save changes');
  }
};
```

## Accessibility

All components follow WCAG AA standards:

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Visible focus indicators and focus trapping in modals
- **Color Contrast**: Meets WCAG AA contrast requirements
- **Error Announcement**: Errors announced to screen readers via `role="alert"`

## Dark Mode

All components automatically support dark mode via `next-themes`:

- Status badges have dark variants with ring borders
- Form fields use dark background colors
- Modals and popovers inherit theme
- Toast notifications styled for dark theme

## TypeScript Support

Full type safety with exported types:

```tsx
import type { StatusType, ActionType, EmptyStateProps } from '@/types/admin-components';
```

## Design Tokens

Components use Ozean Licht design tokens from `tailwind.config.js`:

- **Primary Color**: #0ec2bc (turquoise)
- **Background**: #0A0F1A (cosmic dark)
- **Card Background**: #1A1F2E
- **Border**: #2A2F3E
- **Typography**: Cinzel (headings), Montserrat (body)

## Complete Example

```tsx
'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge, ConfirmationModal } from '@/components/admin';
import { TextField, SelectField } from '@/components/admin/form';
import { useToast } from '@/lib/hooks/useToast';

export function UserEditForm({ user }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { success, error } = useToast();

  const handleSave = async () => {
    try {
      await updateUser({ name, role });
      success('User updated successfully');
    } catch (err) {
      error('Failed to update user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif">Edit User</h2>
          <StatusBadge status={user.status} />
        </div>
        <div className="flex gap-2">
          <ActionButton action="delete" onClick={() => setIsDeleteModalOpen(true)} />
          <ActionButton action="edit" onClick={handleSave} />
        </div>
      </div>

      <TextField
        id="name"
        label="Full Name"
        value={name}
        onChange={setName}
        required
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => await deleteUser(user.id)}
        title="Delete User"
        description="This will permanently delete this user. This action cannot be undone."
        variant="danger"
      />
    </div>
  );
}
```

## Component Count

- **Admin Components**: 7 (StatusBadge, ActionButton, EmptyState, ConfirmationModal, DataTableSkeleton, CardSkeleton, ListSkeleton)
- **Form Components**: 6 (FormFieldWrapper, TextField, SelectField, DatePicker, CheckboxField, RadioGroupField)
- **Total**: 13 new components

---

**Last Updated**: 2025-11-09
**Version**: 1.0.0
**Maintainer**: Platform Team
