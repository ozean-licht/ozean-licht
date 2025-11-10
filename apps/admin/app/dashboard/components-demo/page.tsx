'use client';

import { useState } from 'react';
import {
  StatusBadge,
  ActionButton,
  EmptyState,
  ConfirmationModal,
  DataTableSkeleton,
  CardSkeleton,
  ListSkeleton,
} from '@/components/admin';
import {
  TextField,
  SelectField,
  DatePicker,
  CheckboxField,
  RadioGroupField,
} from '@/components/admin/form';
import { useToast } from '@/lib/hooks/useToast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { StatusType, ActionType } from '@/types/admin-components';

/**
 * Component Demo Page
 *
 * Demonstrates all admin components with interactive examples.
 * Used for testing, documentation, and visual regression testing.
 */
export default function ComponentsDemoPage() {
  const { success, error, warning, info } = useToast();

  // Status Badge Demo State
  const allStatuses: StatusType[] = [
    'active', 'inactive', 'pending', 'approved', 'rejected',
    'draft', 'published', 'archived', 'error', 'success', 'warning', 'info'
  ];

  // Action Button Demo State
  const allActions: ActionType[] = [
    'edit', 'delete', 'view', 'approve', 'reject', 'publish', 'archive', 'restore'
  ];

  // Confirmation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Demo State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    birthdate: undefined as Date | undefined,
    acceptTerms: false,
    notificationPreference: '',
  });

  const [showSkeletons, setShowSkeletons] = useState(false);

  // Form Validation Errors (for demo)
  const [errors, setErrors] = useState({
    email: '',
  });

  const handleFormSubmit = () => {
    // Demo validation
    if (!formData.email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      error('Form validation failed');
      return;
    }
    setErrors({ email: '' });
    success('Form submitted successfully!');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Component Library Demo
        </h1>
        <p className="text-muted-foreground">
          Interactive showcase of all admin components with examples
        </p>
      </div>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
          <CardDescription>12 semantic status indicators with dark mode support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allStatuses.map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Custom Labels:</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="pending" label="Awaiting Review" />
              <StatusBadge status="published" label="Live" />
              <StatusBadge status="error" label="Failed" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Action Buttons</CardTitle>
          <CardDescription>8 standardized action buttons with semantic icons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">With Labels:</p>
              <div className="flex flex-wrap gap-2">
                {allActions.map((action) => (
                  <ActionButton
                    key={action}
                    action={action}
                    onClick={() => info(`${action} clicked`)}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Icon Only:</p>
              <div className="flex flex-wrap gap-2">
                {allActions.map((action) => (
                  <ActionButton
                    key={action}
                    action={action}
                    iconOnly
                    onClick={() => info(`${action} clicked`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Empty States</CardTitle>
          <CardDescription>Friendly messages for zero-data scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <EmptyState
              title="No users found"
              description="Get started by creating your first user account"
              action={{
                label: 'Create User',
                onClick: () => success('Navigating to create user page...')
              }}
            />
            <EmptyState
              icon={<Users className="h-12 w-12 text-muted-foreground" />}
              title="No members yet"
              description="Invite team members to collaborate on this project"
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Modal</CardTitle>
          <CardDescription>Confirm destructive actions before executing</CardDescription>
        </CardHeader>
        <CardContent>
          <ActionButton
            action="delete"
            label="Open Deletion Confirmation"
            onClick={() => setIsModalOpen(true)}
          />
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={async () => {
              // Simulate async operation
              await new Promise(resolve => setTimeout(resolve, 1000));
              success('Item deleted successfully');
            }}
            title="Delete Item"
            description="This action cannot be undone. Are you sure you want to delete this item?"
            variant="danger"
          />
        </CardContent>
      </Card>

      {/* Loading Skeletons */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Skeletons</CardTitle>
          <CardDescription>Context-specific loading states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">Data Table Skeleton</p>
                <ActionButton
                  action={showSkeletons ? 'restore' : 'view'}
                  label={showSkeletons ? 'Hide' : 'Show'}
                  onClick={() => setShowSkeletons(!showSkeletons)}
                />
              </div>
              {showSkeletons && <DataTableSkeleton rows={5} columns={4} />}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-4">Card Grid Skeleton</p>
              {showSkeletons && <CardSkeleton count={3} />}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-4">List Skeleton</p>
              {showSkeletons && <ListSkeleton items={3} />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Type-safe form fields with validation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-w-xl">
            <TextField
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Enter your full name"
              required
              hint="First and last name"
            />

            <TextField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="you@example.com"
              required
              error={errors.email}
            />

            <SelectField
              id="role"
              label="User Role"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' }
              ]}
              placeholder="Select a role"
              required
            />

            <DatePicker
              id="birthdate"
              label="Birth Date"
              value={formData.birthdate}
              onChange={(date) => setFormData({ ...formData, birthdate: date })}
              maxDate={new Date()}
              placeholder="Select your birth date"
            />

            <CheckboxField
              id="terms"
              label="Accept Terms and Conditions"
              description="You must accept the terms and conditions to continue"
              checked={formData.acceptTerms}
              onChange={(checked) => setFormData({ ...formData, acceptTerms: checked })}
            />

            <RadioGroupField
              id="notifications"
              label="Notification Preference"
              value={formData.notificationPreference}
              onChange={(value) => setFormData({ ...formData, notificationPreference: value })}
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
                },
                {
                  value: 'none',
                  label: 'None',
                  description: 'Do not send me notifications'
                }
              ]}
            />

            <div className="flex gap-2 pt-4 border-t">
              <ActionButton action="edit" label="Submit Form" onClick={handleFormSubmit} />
              <ActionButton
                action="restore"
                label="Reset"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    role: '',
                    birthdate: undefined,
                    acceptTerms: false,
                    notificationPreference: '',
                  });
                  info('Form reset');
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>User feedback messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <ActionButton action="approve" label="Success Toast" onClick={() => success('Operation completed successfully')} />
            <ActionButton action="reject" label="Error Toast" onClick={() => error('Operation failed')} />
            <ActionButton action="archive" label="Warning Toast" onClick={() => warning('This action may have consequences')} />
            <ActionButton action="view" label="Info Toast" onClick={() => info('Here is some information')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
