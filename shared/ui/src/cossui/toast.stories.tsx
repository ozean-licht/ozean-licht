'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './toast'
import {
  CheckCircle2,
  AlertCircle,
  Info as InfoIcon,
  AlertTriangle,
  MessageSquare,
  Upload,
  Zap,
  Lock,
  Bell,
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import { Button } from './button'

const meta: Meta<typeof Toast> = {
  title: 'CossUI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toast component from Coss UI with Ozean Licht design system. Features glass morphism effects, 5 semantic variants (default, success, warning, destructive, info), and comprehensive accessibility support. Built on Radix UI Toast primitives with fine-grained control over positioning, content, and interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive', 'info'],
      description: 'Visual style variant with Ozean Licht color system',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

/**
 * Default Toast Variant
 * The standard toast variant with primary Ozean Licht turquoise color (#0ec2bc).
 * Perfect for general notifications and status updates.
 */
export const Default: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="default" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>
              This is a default toast notification using the primary Ozean Licht color.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Success Variant
 * Emerald green (#10B981) for positive confirmations and successful operations.
 * Use for save confirmations, uploads, and successful actions.
 */
export const Success: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>
                Your changes have been saved successfully. The update will be reflected shortly.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Warning Variant
 * Amber/orange (#F59E0B) for cautionary messages and important alerts.
 * Use for pending actions, configuration warnings, and preventive messages.
 */
export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="warning" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Warning</ToastTitle>
              <ToastDescription>
                This action cannot be undone. Please review before proceeding.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Destructive Variant
 * Red (#EF4444) for errors, critical issues, and destructive actions.
 * Use for failed operations, validation errors, and critical alerts.
 */
export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Error Occurred</ToastTitle>
              <ToastDescription>
                Something went wrong. Please check your input and try again.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Info Variant
 * Blue (#3B82F6) for informational messages and helpful tips.
 * Use for system notifications, feature announcements, and contextual help.
 */
export const Info: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Information</ToastTitle>
              <ToastDescription>
                Did you know? You can use keyboard shortcuts to navigate faster.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Title Only
 * Toast with only a title, no description.
 * Perfect for brief, concise notifications.
 */
export const TitleOnly: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="default" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Operation Complete</ToastTitle>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Description Only
 * Toast with only a description, no title.
 * Useful for simple messages that don't require a heading.
 */
export const DescriptionOnly: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="info" open={true}>
          <div className="grid gap-1">
            <ToastDescription>
              Your session will expire in 5 minutes. Save your work.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * With Action Button
 * Toast with an action button for user interaction.
 * Commonly used for undo, retry, or view actions.
 */
export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="default" open={true}>
          <div className="grid gap-1 flex-1">
            <ToastTitle>File Deleted</ToastTitle>
            <ToastDescription>
              Your file has been moved to trash.
            </ToastDescription>
          </div>
          <ToastAction altText="Undo deletion" onClick={() => console.log('Undo')}>
            Undo
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Without Close Button
 * Toast without a manual close button.
 * Use when auto-dismiss is the primary interaction method.
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="success" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Saving...</ToastTitle>
            <ToastDescription>
              Your changes are being saved automatically.
            </ToastDescription>
          </div>
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Top Position
 * Toast positioned at the top of the viewport.
 * Good for critical alerts that need immediate attention.
 */
export const TopPosition: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-lg">
        <Toast variant="warning" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>System Update</ToastTitle>
              <ToastDescription>
                A new update is available. Please restart your application.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Top-Right Position
 * Toast positioned at the top-right corner.
 * The default and most common position for desktop applications.
 */
export const TopRightPosition: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-lg">
        <Toast variant="default" open={true}>
          <div className="grid gap-1">
            <ToastTitle>New Message</ToastTitle>
            <ToastDescription>
              You have a new message from Sarah Mitchell.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Bottom Position
 * Toast positioned at the bottom of the viewport.
 * Useful on mobile or when you want non-intrusive notifications.
 */
export const BottomPosition: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-lg">
        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Notification</ToastTitle>
              <ToastDescription>
                Check out our new features in the help menu.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="bottom" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Bottom-Right Position
 * Toast positioned at the bottom-right corner.
 * Good for mobile layouts and non-intrusive notifications.
 */
export const BottomRightPosition: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-lg">
        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Download Complete</ToastTitle>
              <ToastDescription>
                document.pdf is ready for use (2.4 MB).
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="bottom-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * With Icon in Title
 * Toast with icon integrated into the title for visual clarity.
 * Enhances quick visual recognition of notification type.
 */
export const WithIconInTitle: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="success" open={true}>
          <div className="grid gap-1">
            <ToastTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>Profile Updated</span>
            </ToastTitle>
            <ToastDescription>
              Your profile changes have been saved successfully.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * All Variants Showcase
 * Comprehensive display of all 5 toast variants with consistent structure.
 * Demonstrates the complete color palette and glass morphism effects.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Toast Variants - Ozean Licht Design System</h2>

      <ToastProvider>
        <Toast variant="default" open={true}>
          <div className="flex items-start gap-3 w-full">
            <MessageSquare className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Default Variant</ToastTitle>
              <ToastDescription>
                Uses primary Ozean Licht color (#0ec2bc) for general notifications.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Success Variant</ToastTitle>
              <ToastDescription>
                Emerald green (#10B981) for positive confirmations and successful operations.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Warning Variant</ToastTitle>
              <ToastDescription>
                Amber/orange (#F59E0B) for cautionary messages and important alerts.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Destructive Variant</ToastTitle>
              <ToastDescription>
                Red (#EF4444) for errors, critical issues, and destructive actions.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Info Variant</ToastTitle>
              <ToastDescription>
                Blue (#3B82F6) for informational messages and helpful tips.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </ToastProvider>
    </div>
  ),
}

/**
 * Success Notification
 * Real-world scenario: successful form submission or data save.
 * Demonstrates best practices for positive user feedback.
 */
export const SuccessNotification: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Account Created Successfully</ToastTitle>
              <ToastDescription>
                Welcome! Your account is ready to use. You can now log in with your credentials.
              </ToastDescription>
            </div>
          </div>
          <ToastAction altText="View account" onClick={() => console.log('View')}>
            View
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Error Message
 * Real-world scenario: API error or validation failure.
 * Demonstrates clear error communication with recovery options.
 */
export const ErrorMessage: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[300px] flex items-center justify-center">
        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Upload Failed</ToastTitle>
              <ToastDescription>
                The file could not be uploaded. Please check your connection and try again.
              </ToastDescription>
            </div>
          </div>
          <ToastAction altText="Retry upload" onClick={() => console.log('Retry')}>
            Retry
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Form Validation Feedback
 * Real-world scenario: providing validation feedback in multi-step forms.
 * Shows how to combine multiple validation states.
 */
export const FormValidationFeedback: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Form Validation Examples</h2>

        <Toast variant="destructive" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Validation Error</ToastTitle>
            <ToastDescription>
              Please enter a valid email address (e.g., user@example.com).
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Password Strength Warning</ToastTitle>
            <ToastDescription>
              Your password is weak. Consider using uppercase, numbers, and special characters.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Helpful Hint</ToastTitle>
            <ToastDescription>
              Your username will be publicly visible to other users on the platform.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="success" open={true}>
          <div className="grid gap-1">
            <ToastTitle>All Fields Valid</ToastTitle>
            <ToastDescription>
              Your form is complete and ready to submit.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Long Content
 * Toast with extended title and description.
 * Demonstrates how glass morphism maintains readability with longer text.
 */
export const LongContent: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[400px] flex items-center justify-center">
        <Toast variant="info" open={true}>
          <div className="grid gap-1 max-w-sm">
            <ToastTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 flex-shrink-0" />
              <span>System Maintenance Scheduled</span>
            </ToastTitle>
            <ToastDescription>
              We will be performing scheduled maintenance on Saturday, December 14th from 2:00 AM to 6:00 AM UTC. During this time, the service may be temporarily unavailable. We apologize for any inconvenience. Please save your work and reach out to our support team if you have concerns.
            </ToastDescription>
          </div>
          <ToastAction altText="Learn more" onClick={() => console.log('Learn more')}>
            Details
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Multiple Toasts Queue
 * Shows how multiple toasts stack and interact.
 * Demonstrates visual hierarchy with glass morphism effects.
 */
export const MultipleToasts: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-lg">
        <div className="space-y-3 w-full max-w-md mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6">Toast Queue Demonstration</h2>

          <Toast variant="default" open={true}>
            <div className="grid gap-1">
              <ToastTitle>First Notification</ToastTitle>
              <ToastDescription>
                This is the first toast in the queue.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="success" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Second Notification</ToastTitle>
              <ToastDescription>
                Stacked notifications maintain visual separation.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="warning" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Third Notification</ToastTitle>
              <ToastDescription>
                Each toast can have its own variant and styling.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        </div>
        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * With Icon from Lucide
 * Comprehensive example using different lucide-react icons for each variant.
 * Shows icon alignment and visual hierarchy best practices.
 */
export const WithIconFromLucide: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Toasts with Lucide Icons</h2>

        <Toast variant="default" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Default with Bell Icon</ToastTitle>
              <ToastDescription>
                Uses the bell icon for general notifications and announcements.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Success with Check Icon</ToastTitle>
              <ToastDescription>
                Checkmark icon immediately communicates positive outcome.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Warning with Triangle Icon</ToastTitle>
              <ToastDescription>
                Triangle icon signals caution and requires attention.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Error with Alert Icon</ToastTitle>
              <ToastDescription>
                Circle alert icon indicates critical errors and problems.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Info with Info Icon</ToastTitle>
              <ToastDescription>
                Info icon is perfect for helpful tips and informational content.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Action Button Variants
 * Multiple examples of toasts with different action buttons.
 * Shows various use cases: undo, retry, view, extend session, etc.
 */
export const ActionButtonVariants: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Action Button Examples</h2>

        <Toast variant="default" open={true}>
          <div className="grid gap-1 flex-1">
            <ToastTitle>File Moved</ToastTitle>
            <ToastDescription>
              document.pdf has been moved to Archive folder.
            </ToastDescription>
          </div>
          <ToastAction altText="Undo move" onClick={() => console.log('Undo')}>
            Undo
          </ToastAction>
          <ToastClose />
        </Toast>

        <Toast variant="destructive" open={true}>
          <div className="grid gap-1 flex-1">
            <ToastTitle>Connection Lost</ToastTitle>
            <ToastDescription>
              Unable to connect to the server. Check your internet connection.
            </ToastDescription>
          </div>
          <ToastAction altText="Retry connection" onClick={() => console.log('Retry')}>
            Retry
          </ToastAction>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="grid gap-1 flex-1">
            <ToastTitle>Session Expiring</ToastTitle>
            <ToastDescription>
              Your session will expire in 5 minutes due to inactivity.
            </ToastDescription>
          </div>
          <ToastAction altText="Extend session" onClick={() => console.log('Extend')}>
            Extend
          </ToastAction>
          <ToastClose />
        </Toast>

        <Toast variant="success" open={true}>
          <div className="grid gap-1 flex-1">
            <ToastTitle>Email Sent</ToastTitle>
            <ToastDescription>
              Your message has been sent to 5 recipients.
            </ToastDescription>
          </div>
          <ToastAction altText="View details" onClick={() => console.log('View')}>
            View
          </ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Security and Permissions
 * Real-world scenario: security alerts and permission-related notifications.
 * Demonstrates emphasis on security-critical information.
 */
export const SecurityAndPermissions: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Security Notifications</h2>

        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Unauthorized Access Attempt</ToastTitle>
              <ToastDescription>
                We detected an unusual login attempt from a new device. If this wasn't you, change your password immediately.
              </ToastDescription>
            </div>
          </div>
          <ToastAction altText="Review activity" onClick={() => console.log('Review')}>
            Review
          </ToastAction>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Permission Required</ToastTitle>
              <ToastDescription>
                You don't have permission to access this resource. Contact your administrator.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Two-Factor Authentication</ToastTitle>
              <ToastDescription>
                A verification code has been sent to your registered email address.
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * File Operations
 * Real-world scenario: notifications for upload, download, and file management.
 * Shows integration with file operation icons and detailed feedback.
 */
export const FileOperations: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">File Operation Notifications</h2>

        <Toast variant="success" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Upload className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Upload Complete</ToastTitle>
              <ToastDescription>
                presentation.pptx (4.2 MB) has been uploaded successfully.
              </ToastDescription>
            </div>
          </div>
          <ToastAction altText="Open file" onClick={() => console.log('Open')}>
            Open
          </ToastAction>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="flex items-start gap-3 w-full">
            <Upload className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Uploading Files</ToastTitle>
              <ToastDescription>
                3 files being uploaded (45% complete)...
              </ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="destructive" open={true}>
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1 flex-1">
              <ToastTitle>Upload Failed</ToastTitle>
              <ToastDescription>
                video.mp4 exceeds the maximum file size of 500 MB.
              </ToastDescription>
            </div>
          </div>
          <ToastAction altText="Try again" onClick={() => console.log('Retry')}>
            Retry
          </ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Accessibility Features
 * Demonstrates WCAG compliance, keyboard navigation, and screen reader support.
 * Shows proper ARIA attributes and focus management.
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Press Tab to focus the toast, Enter/Space to activate buttons, Escape to dismiss.
          </p>
          <Toast variant="info" open={true}>
            <div className="grid gap-1 flex-1">
              <ToastTitle>Keyboard Accessible</ToastTitle>
              <ToastDescription>
                This toast fully supports keyboard navigation with proper focus management.
              </ToastDescription>
            </div>
            <ToastAction altText="Got it" onClick={() => console.log('Understood')}>
              Understood
            </ToastAction>
            <ToastClose />
          </Toast>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Screen Reader Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Includes proper ARIA roles and labels for assistive technologies.
          </p>
          <Toast variant="success" open={true}>
            <div className="grid gap-1 flex-1">
              <ToastTitle>Screen Reader Friendly</ToastTitle>
              <ToastDescription>
                All content is properly labeled and semantically structured for accessibility.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Color Contrast</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All variants meet WCAG AA standards for color contrast ratio (4.5:1 minimum).
          </p>
          <Toast variant="warning" open={true}>
            <div className="grid gap-1 flex-1">
              <ToastTitle>High Contrast Colors</ToastTitle>
              <ToastDescription>
                Each variant uses colors with sufficient contrast for readability.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        </div>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Glass Morphism Effects
 * Showcases the glass morphism design with backdrop blur and transparency.
 * Demonstrates visual elegance over complex backgrounds.
 */
export const GlassMorphismEffects: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <ToastProvider>
        <div className="space-y-4 w-full max-w-2xl mx-auto p-4 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-6">Glass Morphism Effects</h2>

          <Toast variant="default" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Default Glass Effect</ToastTitle>
              <ToastDescription>
                Backdrop blur creates a frosted glass appearance over the colorful background.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="success" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Success Glass Effect</ToastTitle>
              <ToastDescription>
                Emerald green glass morphism with subtle transparency and blur.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="warning" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Warning Glass Effect</ToastTitle>
              <ToastDescription>
                Amber glass layer that blends elegantly with the gradient background.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="destructive" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Destructive Glass Effect</ToastTitle>
              <ToastDescription>
                Red glass appearance maintains readability while embracing the background.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <Toast variant="info" open={true}>
            <div className="grid gap-1">
              <ToastTitle>Info Glass Effect</ToastTitle>
              <ToastDescription>
                Blue glass morphism creates a cohesive visual experience.
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>

          <ToastViewport position="top-right" />
        </div>
      </ToastProvider>
    </div>
  ),
}

/**
 * Animation States
 * Demonstrates the slide and fade animations built into the component.
 * Shows entrance and exit animations with smooth transitions.
 */
export const AnimationStates: Story = {
  render: () => {
    const AnimationDemo = () => {
      const [showToast, setShowToast] = useState(true)

      return (
        <ToastProvider>
          <div className="min-h-[500px] flex flex-col items-center justify-center gap-8 p-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Animation States</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The toast slides in from top and fades out when dismissed.
              </p>
              <button
                onClick={() => setShowToast(!showToast)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showToast ? 'Hide Toast' : 'Show Toast'}
              </button>
            </div>

            {showToast && (
              <Toast variant="default" open={true}>
                <div className="grid gap-1">
                  <ToastTitle>Animated Toast</ToastTitle>
                  <ToastDescription>
                    This toast demonstrates the slide-in and fade-out animations.
                  </ToastDescription>
                </div>
                <ToastClose />
              </Toast>
            )}

            <ToastViewport position="top-right" />
          </div>
        </ToastProvider>
      )
    }

    return <AnimationDemo />
  },
}

/**
 * Dark Theme Display
 * Shows how all toast variants appear on dark backgrounds.
 * Demonstrates optimal contrast and readability in dark mode.
 */
export const DarkThemeDisplay: Story = {
  render: () => (
    <div className="bg-slate-950 p-8 rounded-lg space-y-4 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Toast Variants on Dark Theme</h2>

      <ToastProvider>
        <Toast variant="default" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Default on Dark</ToastTitle>
            <ToastDescription>
              Primary color maintains excellent contrast on dark backgrounds.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="success" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Success on Dark</ToastTitle>
            <ToastDescription>
              Emerald green is vibrant and clear against dark theme.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="warning" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Warning on Dark</ToastTitle>
            <ToastDescription>
              Amber/orange color stands out prominently on dark backgrounds.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="destructive" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Error on Dark</ToastTitle>
            <ToastDescription>
              Red variant is highly visible and emphasizes critical messages.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast variant="info" open={true}>
          <div className="grid gap-1">
            <ToastTitle>Info on Dark</ToastTitle>
            <ToastDescription>
              Blue maintains clarity and visual hierarchy on dark surfaces.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport position="top-right" />
      </ToastProvider>
    </div>
  ),
}

/**
 * Responsive Positioning
 * Demonstrates how toast positioning adapts to different viewport sizes.
 * Shows mobile-friendly bottom positioning vs desktop top-right.
 */
export const ResponsivePositioning: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Responsive Positioning</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Desktop (Top-Right)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              On desktop viewports, toasts appear in the top-right corner for optimal visibility without blocking content.
            </p>

            <Toast variant="default" open={true}>
              <div className="grid gap-1">
                <ToastTitle>Desktop Notification</ToastTitle>
                <ToastDescription>
                  Positioned top-right on desktop views.
                </ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mobile (Bottom-Right)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              On mobile viewports, toasts appear at the bottom to stay within thumb reach and avoid obscuring content.
            </p>

            <Toast variant="success" open={true}>
              <div className="grid gap-1">
                <ToastTitle>Mobile Notification</ToastTitle>
                <ToastDescription>
                  Positioned bottom-right on mobile views.
                </ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          </div>
        </div>

        <ToastViewport position="top-right" />
      </div>
    </ToastProvider>
  ),
}

/**
 * Interactive Toast with useToast Hook
 * Demonstrates the imperative API for triggering toasts programmatically.
 * Shows full integration with the useToast hook and state management.
 */
export const InteractiveWithHook: Story = {
  render: () => {
    function InteractiveToastDemo() {
      const { toast, toasts, dismiss } = useToast()

      const showSuccessToast = () => {
        toast({
          title: 'Success!',
          description: 'Your action has been completed successfully.',
          variant: 'success',
        })
      }

      const showErrorToast = () => {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }

      const showWarningToast = () => {
        toast({
          title: 'Warning',
          description: 'Please review this important information carefully.',
          variant: 'warning',
        })
      }

      const showInfoToast = () => {
        toast({
          title: 'Information',
          description: 'Here is some helpful information for you.',
          variant: 'info',
        })
      }

      const showWithAction = () => {
        toast({
          title: 'File Deleted',
          description: 'Your file has been moved to trash.',
          variant: 'default',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo clicked'),
          },
        })
      }

      return (
        <ToastProvider>
          <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold">Interactive Toast Control</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="primary" onClick={showSuccessToast} size="sm">
                Show Success
              </Button>
              <Button variant="primary" onClick={showErrorToast} size="sm">
                Show Error
              </Button>
              <Button variant="primary" onClick={showWarningToast} size="sm">
                Show Warning
              </Button>
              <Button variant="primary" onClick={showInfoToast} size="sm">
                Show Info
              </Button>
              <Button variant="secondary" onClick={showWithAction} size="sm">
                Show with Action
              </Button>
              <Button
                variant="outline"
                onClick={() => dismiss()}
                size="sm"
                disabled={toasts.length === 0}
              >
                Dismiss All
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-sm text-foreground/70">
                Active Toasts: <span className="font-semibold text-foreground">{toasts.length}</span>
              </p>
            </div>
          </div>

          <ToastViewport position="top-right" />
        </ToastProvider>
      )
    }

    return <InteractiveToastDemo />
  },
}

/**
 * Form Validation Scenario
 * Real-world example showing toast notifications for form validation feedback.
 * Demonstrates error, warning, and success states in sequence.
 */
export const FormValidationScenario: Story = {
  render: () => {
    function FormValidationDemo() {
      const { toast } = useToast()
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')

      const validateEmail = () => {
        if (!email.includes('@')) {
          toast({
            title: 'Invalid Email',
            description: 'Please enter a valid email address.',
            variant: 'destructive',
          })
          return false
        }
        toast({
          title: 'Email Valid',
          description: 'Your email address is valid.',
          variant: 'success',
        })
        return true
      }

      const validatePassword = () => {
        if (password.length < 8) {
          toast({
            title: 'Weak Password',
            description: 'Password must be at least 8 characters.',
            variant: 'warning',
          })
          return false
        }
        if (!/[A-Z]/.test(password)) {
          toast({
            title: 'Missing Uppercase',
            description: 'Password must contain at least one uppercase letter.',
            variant: 'warning',
          })
          return false
        }
        toast({
          title: 'Strong Password',
          description: 'Your password meets all requirements.',
          variant: 'success',
        })
        return true
      }

      return (
        <ToastProvider>
          <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold">Form Validation with Toasts</h2>

            <div className="space-y-4 p-6 rounded-lg bg-card/50 border border-border">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 h-9 px-3 rounded-md border border-border bg-background/50 backdrop-blur-8 text-sm text-foreground placeholder:text-foreground/50"
                  />
                  <Button variant="outline" size="sm" onClick={validateEmail}>
                    Validate
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="flex-1 h-9 px-3 rounded-md border border-border bg-background/50 backdrop-blur-8 text-sm text-foreground placeholder:text-foreground/50"
                  />
                  <Button variant="outline" size="sm" onClick={validatePassword}>
                    Validate
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ToastViewport position="top-right" />
        </ToastProvider>
      )
    }

    return <FormValidationDemo />
  },
}

/**
 * Multi-Step Process Scenario
 * Demonstrates toast notifications for a multi-step workflow.
 * Shows sequential toasts for different stages of a process.
 */
export const MultiStepProcessScenario: Story = {
  render: () => {
    function MultiStepDemo() {
      const { toast } = useToast()
      const [isProcessing, setIsProcessing] = useState(false)

      const startProcess = async () => {
        setIsProcessing(true)

        toast({
          title: 'Step 1: Validating',
          description: 'Checking your input...',
          variant: 'info',
        })

        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: 'Step 2: Processing',
          description: 'Processing your request...',
          variant: 'info',
        })

        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: 'Step 3: Saving',
          description: 'Saving your data...',
          variant: 'info',
        })

        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: 'Complete!',
          description: 'Your request has been processed successfully.',
          variant: 'success',
        })

        setIsProcessing(false)
      }

      return (
        <ToastProvider>
          <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold">Multi-Step Process</h2>

            <div className="p-6 rounded-lg bg-card/50 border border-border space-y-4">
              <p className="text-sm text-foreground/70">
                Click the button below to start a multi-step process with sequential toasts.
              </p>

              <Button
                variant="primary"
                onClick={startProcess}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Start Process'}
              </Button>
            </div>
          </div>

          <ToastViewport position="top-right" />
        </ToastProvider>
      )
    }

    return <MultiStepDemo />
  },
}

/**
 * Notification Center Scenario
 * Shows a notification control center with various toast types.
 * Demonstrates managing multiple notification types and priorities.
 */
export const NotificationCenterScenario: Story = {
  render: () => {
    function NotificationCenter() {
      const { toast } = useToast()

      const notifications = [
        {
          label: 'User Signup',
          action: () =>
            toast({
              title: 'New User',
              description: 'A new user has signed up for your service.',
              variant: 'info',
            }),
        },
        {
          label: 'Payment Success',
          action: () =>
            toast({
              title: 'Payment Received',
              description: '$99.99 has been successfully processed.',
              variant: 'success',
            }),
        },
        {
          label: 'Low Storage',
          action: () =>
            toast({
              title: 'Storage Warning',
              description: 'Your storage is 90% full. Consider upgrading.',
              variant: 'warning',
            }),
        },
        {
          label: 'API Error',
          action: () =>
            toast({
              title: 'API Error',
              description: 'Failed to connect to external service. Retrying...',
              variant: 'destructive',
              action: {
                label: 'Retry',
                onClick: () => console.log('Retrying...'),
              },
            }),
        },
        {
          label: 'File Uploaded',
          action: () =>
            toast({
              title: 'Upload Complete',
              description: 'Your file has been uploaded successfully.',
              variant: 'success',
              action: {
                label: 'View',
                onClick: () => console.log('Viewing file...'),
              },
            }),
        },
      ]

      return (
        <ToastProvider>
          <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold">Notification Center</h2>

            <div className="grid grid-cols-1 gap-3">
              {notifications.map((notif, idx) => (
                <Button key={idx} variant="outline" onClick={notif.action} size="sm" className="w-full">
                  {notif.label}
                </Button>
              ))}
            </div>
          </div>

          <ToastViewport position="top-right" />
        </ToastProvider>
      )
    }

    return <NotificationCenter />
  },
}
