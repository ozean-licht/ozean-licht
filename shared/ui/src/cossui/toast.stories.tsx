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
  ToastIcon,
  ToastContent,
  ToastProgress,
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  DefaultIcon,
} from './toast'

const meta: Meta<typeof Toast> = {
  title: 'Tier 1: Primitives/CossUI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toast component from Radix UI adapted for Ozean Licht design system. Provides non-intrusive notifications with 5 semantic variants (default, success, warning, error, info), auto-dismiss, action buttons, and customizable positioning. Features glass morphism, SVG icons, and progress indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Visual style variant of the toast',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

// ============================================================================
// Helper Component for Demo
// ============================================================================

interface ToastDemoProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title: string
  description?: string
  withIcon?: boolean
  withAction?: boolean
  withProgress?: boolean
  duration?: number
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
}

const ToastDemo = ({
  variant = 'default',
  title,
  description,
  withIcon = false,
  withAction = false,
  withProgress = false,
  duration = 5000,
  position = 'top-right',
}: ToastDemoProps) => {
  const [open, setOpen] = useState(false)

  const iconMap = {
    default: <DefaultIcon />,
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
  }

  return (
    <ToastProvider swipeDirection="right">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 bg-primary text-white font-sans font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
      >
        Show Toast
      </button>

      <Toast open={open} onOpenChange={setOpen} variant={variant} duration={duration}>
        {withIcon && <ToastIcon>{iconMap[variant]}</ToastIcon>}

        <ToastContent>
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </ToastContent>

        {withAction && (
          <ToastAction altText="Try again" onClick={() => console.log('Action clicked')}>
            Retry
          </ToastAction>
        )}

        <ToastClose />

        {withProgress && <ToastProgress duration={duration} variant={variant} />}
      </Toast>

      <ToastViewport position={position} />
    </ToastProvider>
  )
}

// ============================================================================
// Basic Variants
// ============================================================================

/**
 * Default Toast
 * The standard toast variant with neutral styling for general information.
 */
export const Default: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Default Notification"
      description="This is a default toast notification with neutral colors."
    />
  ),
}

/**
 * Success Toast
 * Used to communicate successful operations and positive feedback.
 */
export const Success: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
      description="Your changes have been saved successfully."
    />
  ),
}

/**
 * Warning Toast
 * Used to communicate warnings and cautionary messages.
 */
export const Warning: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Warning"
      description="This action may have unintended consequences."
    />
  ),
}

/**
 * Error Toast
 * Used to communicate errors, failures, and critical issues.
 */
export const Error: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Error"
      description="Something went wrong. Please try again."
    />
  ),
}

/**
 * Info Toast
 * Used to communicate informational messages and updates.
 */
export const Info: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Information"
      description="New features are now available in your dashboard."
    />
  ),
}

// ============================================================================
// With Icons
// ============================================================================

/**
 * Default with Icon
 * Default toast with an SVG icon for better visual communication.
 */
export const DefaultWithIcon: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Notification"
      description="You have a new message in your inbox."
      withIcon
    />
  ),
}

/**
 * Success with Icon
 * Success toast with a checkmark icon.
 */
export const SuccessWithIcon: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Upload Complete"
      description="Your file has been uploaded successfully."
      withIcon
    />
  ),
}

/**
 * Warning with Icon
 * Warning toast with a warning triangle icon.
 */
export const WarningWithIcon: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Low Storage"
      description="You're running out of storage space."
      withIcon
    />
  ),
}

/**
 * Error with Icon
 * Error toast with an error icon.
 */
export const ErrorWithIcon: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Connection Failed"
      description="Unable to connect to the server."
      withIcon
    />
  ),
}

/**
 * Info with Icon
 * Info toast with an information icon.
 */
export const InfoWithIcon: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="System Update"
      description="A new system update is available."
      withIcon
    />
  ),
}

// ============================================================================
// Title Only
// ============================================================================

/**
 * Title Only - Default
 * Toast with only a title, no description.
 */
export const TitleOnlyDefault: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Notification received"
    />
  ),
}

/**
 * Title Only - Success
 * Success toast with only a title.
 */
export const TitleOnlySuccess: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Saved successfully"
      withIcon
    />
  ),
}

/**
 * Title Only - Error
 * Error toast with only a title.
 */
export const TitleOnlyError: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Failed to save"
      withIcon
    />
  ),
}

// ============================================================================
// With Actions
// ============================================================================

/**
 * With Action Button
 * Toast with an action button for user interaction.
 */
export const WithAction: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Update Available"
      description="A new version is available. Update now?"
      withAction
      withIcon
    />
  ),
}

/**
 * Error with Action
 * Error toast with a retry action button.
 */
export const ErrorWithAction: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Upload Failed"
      description="Failed to upload file. Would you like to try again?"
      withAction
      withIcon
    />
  ),
}

/**
 * Warning with Action
 * Warning toast with an action button.
 */
export const WarningWithAction: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Unsaved Changes"
      description="You have unsaved changes. Save before leaving?"
      withAction
      withIcon
    />
  ),
}

// ============================================================================
// With Progress Indicator
// ============================================================================

/**
 * With Progress Indicator
 * Toast with a progress bar showing auto-dismiss countdown.
 */
export const WithProgress: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Processing..."
      description="Your request is being processed."
      withProgress
      withIcon
      duration={5000}
    />
  ),
}

/**
 * Success with Progress
 * Success toast with progress indicator.
 */
export const SuccessWithProgress: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="File Uploaded"
      description="Your file will be processed shortly."
      withProgress
      withIcon
      duration={3000}
    />
  ),
}

/**
 * Error with Progress
 * Error toast with progress indicator.
 */
export const ErrorWithProgress: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Session Expired"
      description="Your session has expired. Please log in again."
      withProgress
      withIcon
      duration={8000}
    />
  ),
}

// ============================================================================
// Different Positions
// ============================================================================

/**
 * Top Right Position
 * Toast positioned at the top-right corner (default).
 */
export const PositionTopRight: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Top Right"
      description="This toast appears in the top-right corner."
      position="top-right"
      withIcon
    />
  ),
}

/**
 * Top Left Position
 * Toast positioned at the top-left corner.
 */
export const PositionTopLeft: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Top Left"
      description="This toast appears in the top-left corner."
      position="top-left"
      withIcon
    />
  ),
}

/**
 * Top Center Position
 * Toast positioned at the top-center.
 */
export const PositionTopCenter: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Top Center"
      description="This toast appears at the top-center."
      position="top-center"
      withIcon
    />
  ),
}

/**
 * Bottom Right Position
 * Toast positioned at the bottom-right corner.
 */
export const PositionBottomRight: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Bottom Right"
      description="This toast appears in the bottom-right corner."
      position="bottom-right"
      withIcon
    />
  ),
}

/**
 * Bottom Left Position
 * Toast positioned at the bottom-left corner.
 */
export const PositionBottomLeft: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Bottom Left"
      description="This toast appears in the bottom-left corner."
      position="bottom-left"
      withIcon
    />
  ),
}

/**
 * Bottom Center Position
 * Toast positioned at the bottom-center.
 */
export const PositionBottomCenter: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Bottom Center"
      description="This toast appears at the bottom-center."
      position="bottom-center"
      withIcon
    />
  ),
}

// ============================================================================
// Different Durations
// ============================================================================

/**
 * Short Duration (3 seconds)
 * Toast that auto-dismisses after 3 seconds.
 */
export const ShortDuration: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Quick Message"
      description="This toast disappears after 3 seconds."
      withProgress
      withIcon
      duration={3000}
    />
  ),
}

/**
 * Medium Duration (5 seconds)
 * Toast that auto-dismisses after 5 seconds (default).
 */
export const MediumDuration: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Standard Message"
      description="This toast disappears after 5 seconds."
      withProgress
      withIcon
      duration={5000}
    />
  ),
}

/**
 * Long Duration (10 seconds)
 * Toast that auto-dismisses after 10 seconds.
 */
export const LongDuration: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Important Message"
      description="This toast stays visible for 10 seconds."
      withProgress
      withIcon
      duration={10000}
    />
  ),
}

/**
 * Persistent Toast
 * Toast that requires manual dismissal (very long duration).
 */
export const Persistent: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Critical Error"
      description="This toast requires manual dismissal. Click the X button to close."
      withIcon
      duration={1000000}
    />
  ),
}

// ============================================================================
// Multiple Toasts
// ============================================================================

/**
 * Multiple Toasts Demo
 * Shows how multiple toasts stack together.
 */
export const MultipleToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; variant: 'default' | 'success' | 'warning' | 'error' | 'info'; title: string; description: string }>>([])

    const addToast = (variant: 'default' | 'success' | 'warning' | 'error' | 'info', title: string, description: string) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, variant, title, description }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }

    const iconMap = {
      default: <DefaultIcon />,
      success: <SuccessIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />,
      info: <InfoIcon />,
    }

    return (
      <ToastProvider swipeDirection="right">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => addToast('success', 'Success', 'Operation completed successfully.')}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 bg-[#10B981] text-white font-sans font-medium transition-all hover:bg-[#10B981]/90 active:scale-95"
          >
            Add Success Toast
          </button>
          <button
            onClick={() => addToast('error', 'Error', 'Something went wrong.')}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 bg-[#EF4444] text-white font-sans font-medium transition-all hover:bg-[#EF4444]/90 active:scale-95"
          >
            Add Error Toast
          </button>
          <button
            onClick={() => addToast('info', 'Info', 'New information available.')}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 bg-[#3B82F6] text-white font-sans font-medium transition-all hover:bg-[#3B82F6]/90 active:scale-95"
          >
            Add Info Toast
          </button>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            variant={toast.variant}
            duration={5000}
          >
            <ToastIcon>{iconMap[toast.variant]}</ToastIcon>
            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </ToastContent>
            <ToastClose />
            <ToastProgress duration={5000} variant={toast.variant} />
          </Toast>
        ))}

        <ToastViewport position="top-right" />
      </ToastProvider>
    )
  },
}

// ============================================================================
// Long Content
// ============================================================================

/**
 * Long Content
 * Toast with longer text to demonstrate content wrapping.
 */
export const LongContent: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Important System Notification"
      description="This is a longer toast message that demonstrates how the component handles multiple lines of text. The content will wrap properly within the fixed width container without causing layout collapse. This ensures consistent sizing regardless of content length."
      withIcon
      withProgress
      duration={8000}
    />
  ),
}

/**
 * Very Long Title
 * Toast with a very long title to test title wrapping.
 */
export const VeryLongTitle: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="This is a Very Long Title That Should Wrap to Multiple Lines if Necessary to Demonstrate Title Handling"
      description="The title wraps properly while maintaining readability."
      withIcon
    />
  ),
}

// ============================================================================
// Accessibility Demo
// ============================================================================

/**
 * Keyboard Accessible
 * Demonstrates keyboard navigation and accessibility features.
 * Try pressing Tab to focus the close button, then Enter to dismiss.
 */
export const KeyboardAccessible: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Keyboard Navigation"
      description="Press Tab to focus the close button, then Enter to dismiss. The toast is fully keyboard accessible with proper ARIA labels."
      withIcon
      duration={1000000}
    />
  ),
}

/**
 * With Action - Keyboard Focus
 * Demonstrates keyboard navigation with action buttons.
 * Try Tab to navigate between action and close buttons.
 */
export const KeyboardWithAction: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Keyboard Navigation with Action"
      description="Use Tab to navigate between the Retry button and close button. Press Enter to activate."
      withAction
      withIcon
      duration={1000000}
    />
  ),
}

// ============================================================================
// Real-world Examples
// ============================================================================

/**
 * Form Submission Success
 * Real-world example: successful form submission.
 */
export const FormSuccess: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Form Submitted"
      description="Your form has been submitted successfully. We'll get back to you within 24 hours."
      withIcon
      withProgress
      duration={5000}
    />
  ),
}

/**
 * File Upload Progress
 * Real-world example: file upload notification.
 */
export const FileUpload: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Uploading Files"
      description="3 files are being uploaded. You can continue working while the upload completes."
      withIcon
      withProgress
      duration={8000}
    />
  ),
}

/**
 * Network Error
 * Real-world example: network connectivity error.
 */
export const NetworkError: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Network Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      withAction
      withIcon
      duration={10000}
    />
  ),
}

/**
 * Permission Denied
 * Real-world example: permission error.
 */
export const PermissionDenied: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Permission Denied"
      description="You don't have permission to perform this action. Contact your administrator for access."
      withIcon
      duration={8000}
    />
  ),
}

/**
 * Session Timeout
 * Real-world example: session expiration warning.
 */
export const SessionTimeout: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Session Expiring Soon"
      description="Your session will expire in 2 minutes. Save your work to avoid losing changes."
      withAction
      withIcon
      withProgress
      duration={10000}
    />
  ),
}
