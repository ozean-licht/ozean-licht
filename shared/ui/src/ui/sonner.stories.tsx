import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toast } from 'sonner';
import { Toaster } from './sonner';
import { Button } from '../components/Button';
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2, Sparkles } from 'lucide-react';

/**
 * Sonner toast notification component built on the Sonner library.
 *
 * **This is a Tier 1 Primitive** - toast notification system with customizable icons and styling.
 * No Tier 2 branded version exists.
 *
 * ## Sonner Features
 * - **Auto-dismiss**: Toasts automatically dismiss after a set duration
 * - **Action Buttons**: Add interactive action buttons to toasts
 * - **Promise Handling**: Automatically show loading, success, and error states for async operations
 * - **Positioning**: Configure toast position (top-left, top-right, bottom-left, bottom-right, etc.)
 * - **Custom Icons**: Override default icons with custom components
 * - **Rich Content**: Support for descriptions, actions, cancel buttons
 * - **Keyboard Accessible**: Dismiss with Escape key, keyboard navigation
 * - **Stacking**: Multiple toasts stack intelligently
 * - **Theming**: Supports light/dark themes via next-themes
 *
 * ## Toast Types
 * - **Success**: `toast.success()` - Positive confirmations (green checkmark)
 * - **Error**: `toast.error()` - Error notifications (red X)
 * - **Warning**: `toast.warning()` - Warning messages (yellow triangle)
 * - **Info**: `toast.info()` - Informational messages (blue info icon)
 * - **Loading**: `toast.loading()` - Loading indicators (spinning loader)
 * - **Default**: `toast()` - Neutral messages (no icon)
 * - **Promise**: `toast.promise()` - Async operation states
 * - **Custom**: `toast.custom()` - Fully custom JSX content
 *
 * ## Usage Pattern
 * ```tsx
 * import { toast } from 'sonner';
 * import { Toaster } from '@/ui/sonner';
 *
 * // Add Toaster once at root level
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // Trigger toasts from anywhere
 * toast.success('Profile updated!');
 * toast.error('Failed to save changes');
 * toast('Meeting starts in 5 minutes', {
 *   action: {
 *     label: 'Join',
 *     onClick: () => joinMeeting()
 *   }
 * });
 * ```
 *
 * ## Common Use Cases
 * - **Form Submissions**: Show success/error after form submission
 * - **Async Operations**: Display loading → success/error for API calls
 * - **User Feedback**: Confirm actions (saved, deleted, updated)
 * - **Notifications**: System notifications, reminders, alerts
 * - **Undo Actions**: Provide undo button for destructive actions
 *
 * ## Toaster Props
 * - `position`: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
 * - `expand`: Whether to expand toasts on hover (default: false)
 * - `richColors`: Enable rich colors for different toast types (default: false)
 * - `closeButton`: Show close button on all toasts (default: false)
 * - `duration`: Default duration in ms (default: 4000)
 *
 * ## Toast Options
 * - `description`: Secondary text below the title
 * - `duration`: Custom duration in ms
 * - `action`: { label: string, onClick: () => void }
 * - `cancel`: { label: string, onClick: () => void }
 * - `icon`: Custom icon component
 * - `important`: Keep toast visible until dismissed
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An opinionated toast component for React. Beautiful, customizable toast notifications with rich features.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast notification.
 *
 * The most basic toast with just a message. Auto-dismisses after 4 seconds.
 */
export const Default: Story = {
  render: () => (
    <Button onClick={() => toast('This is a default toast notification')}>
      Show Toast
    </Button>
  ),
};

/**
 * All toast types.
 *
 * Demonstrates success, error, warning, info, and loading toast variants.
 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => toast.success('Profile updated successfully!')}
        style={{ backgroundColor: '#10b981', color: 'white' }}
      >
        Success Toast
      </Button>
      <Button
        onClick={() => toast.error('Failed to save changes')}
        style={{ backgroundColor: '#ef4444', color: 'white' }}
      >
        Error Toast
      </Button>
      <Button
        onClick={() => toast.warning('Your session will expire soon')}
        style={{ backgroundColor: '#f59e0b', color: 'white' }}
      >
        Warning Toast
      </Button>
      <Button
        onClick={() => toast.info('New features are available')}
        style={{ backgroundColor: '#3b82f6', color: 'white' }}
      >
        Info Toast
      </Button>
      <Button
        onClick={() => toast.loading('Processing your request...')}
        variant="outline"
      >
        Loading Toast
      </Button>
    </div>
  ),
};

/**
 * Toast with description.
 *
 * Shows title and supporting description text.
 */
export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('New message received', {
          description: 'You have a new message from Sarah Chen. Tap to read it now.',
        })
      }
    >
      Show Toast with Description
    </Button>
  ),
};

/**
 * Toast with action button.
 *
 * Demonstrates interactive action button in toast.
 */
export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('Meeting starts in 5 minutes', {
          description: 'Daily standup with the engineering team',
          action: {
            label: 'Join Now',
            onClick: () => console.log('Joining meeting...'),
          },
        })
      }
      style={{ backgroundColor: '#0ec2bc', color: 'white' }}
    >
      Show Action Toast
    </Button>
  ),
};

/**
 * Toast with action and cancel buttons.
 *
 * Shows both action and cancel buttons for undo functionality.
 */
export const WithActionAndCancel: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('File deleted successfully', {
          description: 'document.pdf has been moved to trash',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo delete'),
          },
          cancel: {
            label: 'Dismiss',
            onClick: () => console.log('Dismissed'),
          },
        })
      }
      variant="outline"
    >
      Delete with Undo
    </Button>
  ),
};

/**
 * Promise toast for async operations.
 *
 * Automatically transitions from loading → success/error based on promise resolution.
 */
export const PromiseToast: Story = {
  render: () => {
    const handlePromise = () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve({ name: 'User' }) : reject('Failed');
        }, 2000);
      });

      toast.promise(promise, {
        loading: 'Saving changes...',
        success: (data) => `Changes saved successfully!`,
        error: 'Failed to save changes. Please try again.',
      });
    };

    return (
      <Button onClick={handlePromise} style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
        Save with Promise
      </Button>
    );
  },
};

/**
 * Custom duration toasts.
 *
 * Demonstrates different auto-dismiss durations.
 */
export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => toast('Quick toast (1s)', { duration: 1000 })}
        variant="outline"
      >
        1 Second
      </Button>
      <Button
        onClick={() => toast('Standard toast (4s)', { duration: 4000 })}
        variant="outline"
      >
        4 Seconds (Default)
      </Button>
      <Button
        onClick={() => toast('Long toast (10s)', { duration: 10000 })}
        variant="outline"
      >
        10 Seconds
      </Button>
      <Button
        onClick={() => toast('Persistent toast', { duration: Infinity })}
        variant="outline"
      >
        Never Dismiss
      </Button>
    </div>
  ),
};

/**
 * Toast with custom icons.
 *
 * Override default icons with custom icon components.
 */
export const WithCustomIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast('Achievement unlocked!', {
            icon: React.createElement(Sparkles, { className: 'h-4 w-4 text-yellow-500' }),
          })
        }
        style={{ backgroundColor: '#f59e0b', color: 'white' }}
      >
        Custom Icon
      </Button>
      <Button
        onClick={() =>
          toast.success('Payment received', {
            icon: React.createElement(CheckCircle, { className: 'h-4 w-4' }),
          })
        }
        variant="outline"
      >
        Override Success Icon
      </Button>
      <Button
        onClick={() =>
          toast('No icon toast', {
            icon: React.createElement('div', null),
          })
        }
        variant="outline"
      >
        No Icon
      </Button>
    </div>
  ),
};

/**
 * Different positioning options.
 *
 * Shows toasts at different screen positions.
 */
export const Positioning: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast('Top Left', {
            position: 'top-left',
          })
        }
        variant="outline"
      >
        Top Left
      </Button>
      <Button
        onClick={() =>
          toast('Top Center', {
            position: 'top-center',
          })
        }
        variant="outline"
      >
        Top Center
      </Button>
      <Button
        onClick={() =>
          toast('Top Right', {
            position: 'top-right',
          })
        }
        variant="outline"
      >
        Top Right
      </Button>
      <Button
        onClick={() =>
          toast('Bottom Left', {
            position: 'bottom-left',
          })
        }
        variant="outline"
      >
        Bottom Left
      </Button>
      <Button
        onClick={() =>
          toast('Bottom Center', {
            position: 'bottom-center',
          })
        }
        variant="outline"
      >
        Bottom Center
      </Button>
      <Button
        onClick={() =>
          toast('Bottom Right', {
            position: 'bottom-right',
          })
        }
        variant="outline"
      >
        Bottom Right
      </Button>
    </div>
  ),
};

/**
 * Rich colors variant.
 *
 * Enable rich colors for more vibrant toast styling.
 */
export const RichColors: Story = {
  render: () => (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          onClick={() => toast.success('Profile updated!')}
          style={{ backgroundColor: '#10b981', color: 'white' }}
        >
          Success
        </Button>
        <Button
          onClick={() => toast.error('Connection failed')}
          style={{ backgroundColor: '#ef4444', color: 'white' }}
        >
          Error
        </Button>
        <Button
          onClick={() => toast.warning('Low storage space')}
          style={{ backgroundColor: '#f59e0b', color: 'white' }}
        >
          Warning
        </Button>
        <Button
          onClick={() => toast.info('Update available')}
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >
          Info
        </Button>
      </div>
      <Toaster richColors />
    </div>
  ),
};

/**
 * Close button variant.
 *
 * Show close button on all toasts.
 */
export const WithCloseButton: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toast('This toast has a close button', {
            description: 'Click the X to dismiss manually',
          })
        }
      >
        Show Toast with Close Button
      </Button>
      <Toaster closeButton />
    </div>
  ),
};

/**
 * Ozean Licht themed toasts.
 *
 * Demonstrates toast notifications with Ozean Licht turquoise accent (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast.success('Welcome to Ozean Licht!', {
            description: 'Your cosmic journey begins now',
            style: {
              border: '1px solid #0ec2bc',
            },
          })
        }
        style={{ backgroundColor: '#0ec2bc', color: 'white' }}
      >
        Branded Success
      </Button>
      <Button
        onClick={() =>
          toast('New feature unlocked', {
            description: 'Check out the updated dashboard',
            icon: React.createElement(Sparkles, { className: 'h-4 w-4', style: { color: '#0ec2bc' } }),
            action: {
              label: 'Explore',
              onClick: () => console.log('Exploring...'),
            },
            style: {
              border: '1px solid #0ec2bc',
            },
          })
        }
        variant="outline"
        style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
      >
        Feature Toast
      </Button>
      <Button
        onClick={() => {
          const promise = new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 2000);
          });

          toast.promise(promise, {
            loading: 'Processing your request...',
            success: 'Request completed successfully!',
            error: 'Failed to process request',
          });
        }}
        style={{ backgroundColor: '#0ec2bc', color: 'white' }}
      >
        Async Operation
      </Button>
    </div>
  ),
};

/**
 * Form submission example.
 *
 * Common pattern for showing feedback after form submission.
 */
export const FormSubmission: Story = {
  render: () => {
    const handleSubmit = async () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.3 ? resolve({ id: 123 }) : reject('Network error');
        }, 2000);
      });

      toast.promise(promise, {
        loading: 'Submitting form...',
        success: 'Form submitted successfully!',
        error: (err) => `Submission failed: ${err}`,
      });
    };

    return (
      <Button onClick={handleSubmit} style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
        Submit Form
      </Button>
    );
  },
};

/**
 * Multiple toasts interaction.
 *
 * Interactive demo showing multiple toasts with different types and actions.
 */
export const InteractiveDemo: Story = {
  render: () => {
    let toastCount = 0;

    const showMultipleToasts = () => {
      toast.success('First action completed');

      setTimeout(() => {
        toast.info('Processing next step...', {
          description: 'This may take a few moments',
        });
      }, 500);

      setTimeout(() => {
        toast.success('All tasks completed!', {
          description: 'You can now proceed to the dashboard',
          action: {
            label: 'Go to Dashboard',
            onClick: () => console.log('Navigate to dashboard'),
          },
        });
      }, 1500);
    };

    const showUndoToast = () => {
      toastCount++;
      const count = toastCount;

      toast(`Item ${count} deleted`, {
        description: 'The item has been moved to trash',
        action: {
          label: 'Undo',
          onClick: () => {
            toast.success(`Item ${count} restored`);
          },
        },
        cancel: {
          label: 'Dismiss',
          onClick: () => console.log('Dismissed'),
        },
      });
    };

    const showLoadingToast = () => {
      const loadingId = toast.loading('Uploading file...');

      setTimeout(() => {
        toast.success('File uploaded successfully!', {
          id: loadingId,
        });
      }, 3000);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={showMultipleToasts}
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Multiple Toasts
          </Button>
          <Button onClick={showUndoToast} variant="outline">
            Delete with Undo
          </Button>
          <Button onClick={showLoadingToast} variant="outline">
            Upload File
          </Button>
          <Button
            onClick={() =>
              toast('Meeting reminder', {
                description: 'Team sync in 15 minutes',
                duration: 8000,
                action: {
                  label: 'Join',
                  onClick: () => toast.success('Joining meeting...'),
                },
              })
            }
            variant="outline"
          >
            Meeting Reminder
          </Button>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Click the buttons to see different toast patterns. The toasts will stack
          intelligently and can be dismissed by clicking the X or waiting for auto-dismiss.
        </p>
      </div>
    );
  },
};

/**
 * Important toast that requires dismissal.
 *
 * Demonstrates toasts that don't auto-dismiss and require user action.
 */
export const ImportantToast: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.error('Critical error occurred', {
          description: 'Please contact support immediately. Error code: ERR_500',
          duration: Infinity,
          action: {
            label: 'Contact Support',
            onClick: () => console.log('Opening support...'),
          },
        })
      }
      style={{ backgroundColor: '#ef4444', color: 'white' }}
    >
      Show Critical Error
    </Button>
  ),
};

/**
 * Custom JSX content.
 *
 * Shows how to render completely custom JSX in a toast.
 */
export const CustomContent: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.custom(
          (t) =>
            React.createElement(
              'div',
              {
                className: 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border',
                style: { borderColor: '#0ec2bc' },
              },
              React.createElement(
                'div',
                { className: 'flex items-start gap-3' },
                React.createElement(Sparkles, {
                  className: 'h-5 w-5 mt-0.5',
                  style: { color: '#0ec2bc' },
                }),
                React.createElement(
                  'div',
                  { className: 'flex-1' },
                  React.createElement(
                    'div',
                    { className: 'font-semibold', style: { color: '#0ec2bc' } },
                    'Custom Toast'
                  ),
                  React.createElement(
                    'div',
                    { className: 'text-sm text-gray-600 dark:text-gray-400 mt-1' },
                    'This is a completely custom toast with JSX content and styling.'
                  ),
                  React.createElement(
                    'button',
                    {
                      onClick: () => toast.dismiss(t),
                      className: 'mt-2 px-3 py-1 text-sm rounded',
                      style: { backgroundColor: '#0ec2bc', color: 'white' },
                    },
                    'Dismiss'
                  )
                )
              )
            ),
          { duration: 5000 }
        )
      }
      style={{ backgroundColor: '#0ec2bc', color: 'white' }}
    >
      Custom JSX Toast
    </Button>
  ),
};

/**
 * Expand on hover.
 *
 * Toasts expand to show full content when hovered.
 */
export const ExpandOnHover: Story = {
  render: () => (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          onClick={() =>
            toast('First notification', {
              description: 'This toast will expand on hover',
            })
          }
        >
          Show Toast 1
        </Button>
        <Button
          onClick={() =>
            toast('Second notification', {
              description: 'Hover over the toast stack to see expansion',
            })
          }
        >
          Show Toast 2
        </Button>
        <Button
          onClick={() =>
            toast('Third notification', {
              description: 'Multiple toasts stack and expand together',
            })
          }
        >
          Show Toast 3
        </Button>
      </div>
      <p className="text-sm text-muted-foreground max-w-md">
        When multiple toasts are visible, hover over them to see them expand
        and show full content.
      </p>
      <Toaster expand />
    </div>
  ),
};
