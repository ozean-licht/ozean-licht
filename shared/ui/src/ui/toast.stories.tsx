import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X as XIcon } from 'lucide-react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { Toaster } from './toaster';
import { useToast } from '../hooks/use-toast';
import { Button } from './button';

/**
 * Toast notification component built on Radix UI Toast primitive.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * For Ozean Licht branded toasts with glass morphism and cosmic effects, see Tier 2 Branded/Toast.
 *
 * ## Toast Hook API Features
 * - **Programmatic Control**: Use `useToast()` hook to trigger toasts from anywhere
 * - **Queue Management**: Automatically manages toast queue (limit: 1 visible at a time)
 * - **Auto-dismiss**: Toasts auto-dismiss after timeout (default: very long for demo)
 * - **Swipe to Dismiss**: Gesture support for touch devices
 * - **Keyboard Accessible**: ESC to dismiss, focus management
 * - **Action Support**: Optional action button with custom callback
 * - **Variants**: Default and destructive variants built-in
 *
 * ## Hook API Usage
 * ```tsx
 * import { useToast } from '@/hooks/use-toast';
 * import { Toaster } from '@/ui/toaster';
 *
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   return (
 *     <>
 *       <Button onClick={() => {
 *         toast({
 *           title: "Success!",
 *           description: "Your changes have been saved.",
 *           variant: "default", // or "destructive"
 *           action: <ToastAction altText="Undo">Undo</ToastAction>,
 *         });
 *       }}>
 *         Show Toast
 *       </Button>
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 *
 * ## Component Structure
 * ```tsx
 * <ToastProvider> // Root provider (included in Toaster)
 *   <Toast variant="default|destructive"> // Individual toast
 *     <ToastTitle /> // Title text (optional)
 *     <ToastDescription /> // Description text (optional)
 *     <ToastAction /> // Action button (optional)
 *     <ToastClose /> // Close button (automatic in Toaster)
 *   </Toast>
 *   <ToastViewport /> // Container for positioning (included in Toaster)
 * </ToastProvider>
 * ```
 *
 * ## Important Notes
 * - Always include `<Toaster />` component in your app layout (only once!)
 * - Use the `toast()` function from `useToast()` hook to trigger toasts
 * - Toasts appear in top-right on desktop, bottom on mobile
 * - Only 1 toast visible at a time (configurable in use-toast.ts)
 * - Very long timeout for demo purposes (change TOAST_REMOVE_DELAY in use-toast.ts)
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A succinct message that is displayed temporarily. Built on Radix UI Toast primitive with programmatic control via useToast() hook.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative min-h-[400px] w-full flex items-center justify-center">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast with title and description.
 *
 * The most common toast pattern showing a simple notification.
 */
export const Default: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            toast({
              title: 'Notification',
              description: 'This is a default toast notification.',
            });
          }}
        >
          Show Default Toast
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Destructive variant for errors.
 *
 * Use for error messages, warnings, or destructive actions.
 */
export const Destructive: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Something went wrong. Please try again.',
            });
          }}
        >
          Show Error Toast
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Success toast with custom styling (Ozean Licht turquoise).
 *
 * Demonstrates using the Ozean Licht primary color (#0ec2bc) for success messages.
 */
export const Success: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          onClick={() => {
            toast({
              title: 'Success!',
              description: 'Your changes have been saved successfully.',
              className:
                'border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20',
            });
          }}
        >
          Show Success Toast
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Toast with action button.
 *
 * Shows how to add an actionable button (e.g., Undo, Retry, View).
 */
export const WithAction: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            toast({
              title: 'File deleted',
              description: 'Your file has been moved to trash.',
              action: (
                <ToastAction
                  altText="Undo deletion"
                  onClick={() => {
                    console.log('Undo clicked!');
                  }}
                >
                  Undo
                </ToastAction>
              ),
            });
          }}
        >
          Show Toast with Action
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Toast with title only.
 *
 * Simple, concise notifications without description.
 */
export const TitleOnly: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            toast({
              title: 'Message sent successfully',
            });
          }}
        >
          Show Title Only
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Toast with description only.
 *
 * For cases where you don't need a title.
 */
export const DescriptionOnly: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            toast({
              description: 'Your session will expire in 5 minutes.',
            });
          }}
        >
          Show Description Only
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Multiple toasts showcase.
 *
 * Demonstrates different toast variants and use cases.
 * Note: Only 1 toast shown at a time (configured in use-toast.ts).
 */
export const AllVariants: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      const showDefault = () => {
        toast({
          title: 'Default Toast',
          description: 'This is a default notification.',
        });
      };

      const showSuccess = () => {
        toast({
          title: 'Success!',
          description: 'Operation completed successfully.',
          className:
            'border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20',
        });
      };

      const showWarning = () => {
        toast({
          title: 'Warning',
          description: 'Please review your changes before proceeding.',
          className:
            'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
        });
      };

      const showError = () => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Unable to complete the operation.',
        });
      };

      const showInfo = () => {
        toast({
          title: 'Information',
          description: 'System maintenance scheduled for Sunday at 2:00 AM UTC.',
          className:
            'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
        });
      };

      return (
        <div className="flex flex-col gap-3">
          <Button onClick={showDefault} variant="outline">
            Default
          </Button>
          <Button
            onClick={showSuccess}
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Success (Ozean Licht)
          </Button>
          <Button
            onClick={showWarning}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Warning
          </Button>
          <Button onClick={showError} variant="destructive">
            Error
          </Button>
          <Button
            onClick={showInfo}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Info
          </Button>
        </div>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Toast with icons.
 *
 * Add visual indicators using lucide-react icons in title.
 */
export const WithIcons: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      const showSuccess = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Success!</span>
            </div>
          ),
          description: 'Your changes have been saved.',
          className: 'border-[#0ec2bc]/50',
        });
      };

      const showError = () => {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </div>
          ),
          description: 'Unable to save changes.',
        });
      };

      const showWarning = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Warning</span>
            </div>
          ),
          description: 'This action cannot be undone.',
          className:
            'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
        });
      };

      const showInfo = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>Information</span>
            </div>
          ),
          description: 'New version available.',
          className:
            'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
        });
      };

      return (
        <div className="flex flex-col gap-3">
          <Button
            onClick={showSuccess}
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Success with Icon
          </Button>
          <Button onClick={showError} variant="destructive">
            Error with Icon
          </Button>
          <Button
            onClick={showWarning}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Warning with Icon
          </Button>
          <Button
            onClick={showInfo}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Info with Icon
          </Button>
        </div>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Real-world usage examples.
 *
 * Common patterns for form submissions, API calls, and user actions.
 */
export const RealWorldExamples: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      const saveProfile = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Profile Updated</span>
            </div>
          ),
          description: 'Your profile changes have been saved successfully.',
          className: 'border-[#0ec2bc]/50',
        });
      };

      const deleteItem = () => {
        toast({
          title: 'Item deleted',
          description: 'The item has been moved to trash.',
          action: (
            <ToastAction
              altText="Undo deletion"
              onClick={() => {
                toast({
                  title: 'Deletion undone',
                  description: 'The item has been restored.',
                  className: 'border-[#0ec2bc]/50',
                });
              }}
            >
              Undo
            </ToastAction>
          ),
        });
      };

      const apiError = () => {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>API Error</span>
            </div>
          ),
          description: 'Failed to fetch data. Please check your connection and try again.',
          action: (
            <ToastAction altText="Retry request" onClick={() => console.log('Retry')}>
              Retry
            </ToastAction>
          ),
        });
      };

      const sessionWarning = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Session Expiring Soon</span>
            </div>
          ),
          description: 'Your session will expire in 5 minutes. Save your work.',
          className:
            'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
          action: (
            <ToastAction altText="Extend session" onClick={() => console.log('Extend')}>
              Extend
            </ToastAction>
          ),
        });
      };

      const fileUpload = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Upload Complete</span>
            </div>
          ),
          description: 'document.pdf has been uploaded successfully (2.4 MB).',
          className: 'border-[#0ec2bc]/50',
          action: (
            <ToastAction altText="View file" onClick={() => console.log('View')}>
              View
            </ToastAction>
          ),
        });
      };

      return (
        <div className="flex flex-col gap-3">
          <Button
            onClick={saveProfile}
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Save Profile
          </Button>
          <Button onClick={deleteItem} variant="outline">
            Delete Item (with Undo)
          </Button>
          <Button onClick={apiError} variant="destructive">
            API Error (with Retry)
          </Button>
          <Button
            onClick={sessionWarning}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Session Warning
          </Button>
          <Button
            onClick={fileUpload}
            style={{
              backgroundColor: '#0ec2bc',
              color: 'white',
            }}
          >
            File Upload Success
          </Button>
        </div>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Programmatic dismiss.
 *
 * Shows how to dismiss toasts programmatically using the dismiss() function.
 */
export const ProgrammaticDismiss: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast, dismiss } = useToast();

      const showPersistentToast = () => {
        const { id } = toast({
          title: 'Persistent Toast',
          description: 'This toast will stay until manually dismissed.',
        });

        // Store the ID for later dismissal
        (window as any).currentToastId = id;
      };

      const dismissAll = () => {
        dismiss(); // Dismiss all toasts
      };

      const dismissSpecific = () => {
        const id = (window as any).currentToastId;
        if (id) {
          dismiss(id); // Dismiss specific toast by ID
        }
      };

      return (
        <div className="flex flex-col gap-3">
          <Button onClick={showPersistentToast} variant="outline">
            Show Persistent Toast
          </Button>
          <Button onClick={dismissSpecific} variant="secondary">
            Dismiss Specific Toast
          </Button>
          <Button onClick={dismissAll} variant="destructive">
            Dismiss All Toasts
          </Button>
        </div>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Long content toast.
 *
 * Shows how toasts handle longer descriptions and complex content.
 */
export const LongContent: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            toast({
              title: 'System Update Available',
              description:
                'A new system update (v2.5.0) is available with bug fixes, performance improvements, and new features. The update includes enhanced security patches and improved user interface components. Please save your work before proceeding with the installation.',
              action: (
                <ToastAction altText="Update now" onClick={() => console.log('Update')}>
                  Update
                </ToastAction>
              ),
            });
          }}
        >
          Show Long Content Toast
        </Button>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Custom styled toast.
 *
 * Demonstrates full customization with className prop.
 */
export const CustomStyled: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast } = useToast();

      const showGradientToast = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">Premium Feature Unlocked!</span>
            </div>
          ),
          description: 'You now have access to all premium features.',
          className:
            'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none',
        });
      };

      const showOzeanLichtBranded = () => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Ozean Licht</span>
            </div>
          ),
          description: 'Experience the cosmic UI of Ozean Licht design system.',
          className:
            'bg-gradient-to-br from-[#0ec2bc]/20 to-blue-500/20 border-[#0ec2bc] backdrop-blur-sm',
        });
      };

      return (
        <div className="flex flex-col gap-3">
          <Button
            onClick={showGradientToast}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Gradient Toast
          </Button>
          <Button
            onClick={showOzeanLichtBranded}
            style={{
              backgroundColor: '#0ec2bc',
              color: 'white',
            }}
          >
            Ozean Licht Branded
          </Button>
        </div>
      );
    };

    return <ToastDemo />;
  },
};

/**
 * Primitive component structure (low-level usage).
 *
 * Shows how to use the Toast primitive components directly without the hook.
 * In most cases, you should use the useToast() hook instead.
 */
export const PrimitiveStructure: Story = {
  render: () => {
    return (
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Direct Primitive Usage</ToastTitle>
            <ToastDescription>
              This toast is rendered directly using primitive components.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};
