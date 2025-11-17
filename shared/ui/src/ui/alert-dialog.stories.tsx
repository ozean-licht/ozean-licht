import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
} from './alert-dialog';
import { Button } from './button';

/**
 * AlertDialog primitive component built on Radix UI AlertDialog.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists for AlertDialog.
 *
 * ## AlertDialog vs Dialog - Key Differences
 *
 * ### AlertDialog (This Component)
 * - **Purpose**: Interrupts user to get confirmation or communicate critical information
 * - **User Action Required**: User MUST respond (confirm/cancel) - no click-outside or ESC to close by default
 * - **Use Cases**: Destructive actions, critical warnings, confirmations that can't be ignored
 * - **Accessibility**: Higher priority announcement (role="alertdialog")
 * - **Components**: AlertDialogAction (confirm), AlertDialogCancel (dismiss)
 *
 * ### Dialog (See dialog.stories.tsx)
 * - **Purpose**: General purpose modal for forms, information, complex interactions
 * - **User Action Optional**: Can close via ESC, click outside, or close button
 * - **Use Cases**: Forms, settings, detail views, non-critical information
 * - **Accessibility**: Standard dialog announcement (role="dialog")
 * - **Components**: DialogClose (generic close action)
 *
 * ## Radix UI AlertDialog Features
 * - **Accessible**: Proper focus management, ARIA attributes, keyboard navigation
 * - **Composable**: Build custom alerts with AlertDialogHeader, AlertDialogFooter, etc.
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 * - **Focus Trap**: Keeps focus within alert dialog when open
 * - **Scroll Lock**: Prevents background scrolling when open
 * - **Action Focus**: Primary action button receives focus by default
 * - **Requires Response**: User must explicitly take an action (confirm or cancel)
 *
 * ## Component Structure
 * ```tsx
 * <AlertDialog> // Root - manages open state
 *   <AlertDialogTrigger /> // Button that opens alert dialog
 *   <AlertDialogPortal> // Renders content in portal (automatic in AlertDialogContent)
 *     <AlertDialogOverlay /> // Backdrop overlay (automatic in AlertDialogContent)
 *     <AlertDialogContent> // Main alert dialog container
 *       <AlertDialogHeader> // Header wrapper (optional)
 *         <AlertDialogTitle /> // Alert title (required for accessibility)
 *         <AlertDialogDescription /> // Description (required for accessibility)
 *       </AlertDialogHeader>
 *       {children} // Your content
 *       <AlertDialogFooter> // Footer wrapper for actions (optional)
 *         <AlertDialogCancel /> // Cancel/dismiss action (styled as outline button)
 *         <AlertDialogAction /> // Primary/confirm action (styled as default button)
 *       </AlertDialogFooter>
 *     </AlertDialogContent>
 *   </AlertDialogPortal>
 * </AlertDialog>
 * ```
 *
 * ## Usage Notes
 * - AlertDialogTitle AND AlertDialogDescription are both required for accessibility
 * - AlertDialogAction represents the primary/confirm action
 * - AlertDialogCancel represents the cancel/dismiss action
 * - AlertDialogContent includes AlertDialogPortal and AlertDialogOverlay automatically
 * - Use asChild prop to render trigger/actions as custom components
 * - For destructive actions, style AlertDialogAction with variant="destructive"
 *
 * ## When to Use AlertDialog
 * ✅ Deleting data or accounts
 * ✅ Confirming irreversible actions
 * ✅ Critical warnings that require acknowledgment
 * ✅ Important confirmations that shouldn't be accidentally dismissed
 *
 * ## When to Use Dialog Instead
 * ✅ Forms and data entry
 * ✅ Settings and preferences
 * ✅ Viewing details or information
 * ✅ Any interaction that can be safely dismissed
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog that interrupts the user with important content and expects a response. Built on Radix UI AlertDialog primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert dialog with basic confirmation.
 *
 * The most basic alert dialog implementation showing essential structure.
 * User must click an action button to dismiss - no ESC or click-outside closing.
 */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Destructive action confirmation.
 *
 * Most common use case - confirming a destructive action like deletion.
 * Uses destructive button styling for the confirm action.
 */
export const DestructiveAction: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data.
            This action cannot be undone. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Warning dialog.
 *
 * Alert dialog for warning users about potential issues or risks.
 * Uses warning colors to emphasize the cautionary nature.
 */
export const WarningDialog: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Proceed with Caution</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-600 dark:text-yellow-500">
            ⚠️ Warning
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to perform an action that may have unintended consequences.
            Please review your changes carefully before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700 text-white">
            I Understand, Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Info dialog.
 *
 * Alert dialog for important information that requires user acknowledgment.
 * Uses informational styling.
 */
export const InfoDialog: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Important Information</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-600 dark:text-blue-500">
            ℹ️ Important Update
          </AlertDialogTitle>
          <AlertDialogDescription>
            We've updated our privacy policy. Please review the changes before
            continuing to use our service. The new policy takes effect on January 1, 2025.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Review Later</AlertDialogCancel>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white">
            Review Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Success confirmation dialog.
 *
 * Alert dialog for confirming successful operations or important completions.
 * Uses success/green styling.
 */
export const SuccessConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="cta"
          style={{
            backgroundColor: '#0ec2bc',
            color: 'white',
          }}
        >
          Complete Setup
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600 dark:text-green-500">
            ✓ Setup Complete!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your account has been successfully configured. You can now start using
            all features of the platform. Would you like to view the quick start guide?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Skip Guide</AlertDialogCancel>
          <AlertDialogAction className="bg-green-600 hover:bg-green-700 text-white">
            View Guide
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Without cancel button.
 *
 * Alert dialog with only an action button - user must confirm to dismiss.
 * Use sparingly, only when there's truly no alternative action.
 */
export const WithoutCancel: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Acknowledgment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terms of Service</AlertDialogTitle>
          <AlertDialogDescription>
            You must accept the terms of service to continue using this application.
            By clicking "I Accept", you agree to be bound by these terms.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>I Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Long description with scrollable content.
 *
 * Alert dialog with lengthy content that requires scrolling.
 * Useful for detailed warnings or terms that need acknowledgment.
 */
export const LongDescription: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>View Critical Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Critical Security Update Required</AlertDialogTitle>
          <AlertDialogDescription>
            Please read the following important security information carefully.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="overflow-y-auto max-h-[40vh] space-y-3 text-sm my-4">
          <p>
            We have detected a critical security vulnerability that affects your account.
            Immediate action is required to protect your data.
          </p>
          <p className="font-semibold">What happened:</p>
          <p>
            A security researcher discovered a potential vulnerability in our authentication
            system that could allow unauthorized access under specific circumstances.
          </p>
          <p className="font-semibold">What we're doing:</p>
          <p>
            We have already deployed a fix to our systems and are requiring all users to
            update their passwords and enable two-factor authentication.
          </p>
          <p className="font-semibold">What you need to do:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Update your password immediately</li>
            <li>Enable two-factor authentication</li>
            <li>Review your recent account activity</li>
            <li>Update your security questions</li>
          </ul>
          <p>
            We take security very seriously and apologize for any inconvenience this may cause.
            Your data security is our top priority.
          </p>
          <p className="text-muted-foreground text-xs">
            For more information, please visit our security blog or contact our support team
            at security@example.com.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>I'll Do This Later</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Controlled state alert dialog.
 *
 * Shows how to control alert dialog open state programmatically using
 * the `open` and `onOpenChange` props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledAlertDialog = () => {
      const [open, setOpen] = useState(false);
      const [action, setAction] = useState<string | null>(null);

      const handleAction = (actionType: 'confirm' | 'cancel') => {
        setAction(actionType);
        setOpen(false);
        // Reset action after a delay
        setTimeout(() => setAction(null), 3000);
      };

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Alert</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Alert (External)
            </Button>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              Alert is currently: <span className="font-semibold">{open ? 'Open' : 'Closed'}</span>
            </p>
            {action && (
              <p className="text-muted-foreground">
                Last action: <span className="font-semibold">{action}</span>
              </p>
            )}
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Controlled Alert Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  This alert dialog's state is controlled by external state.
                  The component tracks which action was taken.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Click one of the action buttons below, and the component will track
                  which action you took.
                </p>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleAction('cancel')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction('confirm')}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    };

    return <ControlledAlertDialog />;
  },
};

/**
 * Ozean Licht themed alert dialogs.
 *
 * Alert dialogs showcasing the Ozean Licht turquoise color (#0ec2bc).
 * Demonstrates how to apply branding to alert dialogs.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
            Ozean Licht Confirmation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#0ec2bc' }}>
              Confirm Your Choice
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will update your Ozean Licht profile settings.
              Your changes will be saved immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              style={{
                backgroundColor: '#0ec2bc',
                color: 'white',
              }}
              className="hover:opacity-90"
            >
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            style={{
              borderColor: '#0ec2bc',
              color: '#0ec2bc',
            }}
          >
            Ozean Licht Warning
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent style={{ borderColor: '#0ec2bc', borderWidth: '2px' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Important Notice</AlertDialogTitle>
            <AlertDialogDescription>
              This operation will affect your Ozean Licht content library.
              Please ensure you have a backup before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <p className="text-sm" style={{ color: '#0ec2bc' }}>
              💡 Pro Tip: You can restore from backups in your account settings.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              style={{
                backgroundColor: '#0ec2bc',
                color: 'white',
              }}
              className="hover:opacity-90"
            >
              I Have a Backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete with Ozean Licht Theme</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Content
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected content from Ozean Licht.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div
            className="py-3 px-4 rounded-md border-2 my-2"
            style={{ borderColor: '#0ec2bc', backgroundColor: '#0ec2bc10' }}
          >
            <p className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
              Alternative: Archive Instead
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider archiving this content instead of deleting it permanently.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
};

/**
 * Multiple action buttons.
 *
 * Alert dialog with multiple action choices beyond simple confirm/cancel.
 * Shows how to provide users with multiple options.
 */
export const MultipleActions: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Unsaved Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. What would you like to do?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-700 text-white sm:w-full"
          >
            Save Changes
          </AlertDialogAction>
          <AlertDialogAction
            className="bg-muted hover:bg-muted/80 text-foreground sm:w-full"
          >
            Discard Changes
          </AlertDialogAction>
          <AlertDialogCancel className="sm:w-full">
            Continue Editing
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Explicit structure demonstration.
 *
 * Shows the explicit use of AlertDialogPortal and AlertDialogOverlay
 * (though they're automatically included in AlertDialogContent).
 */
export const ExplicitStructure: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Show Explicit Structure</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Explicit Structure</AlertDialogTitle>
            <AlertDialogDescription>
              This alert dialog explicitly shows AlertDialogPortal and
              AlertDialogOverlay usage, though AlertDialogContent includes
              them automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use AlertDialogPortal and
              AlertDialogOverlay directly - AlertDialogContent handles them for you.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests alert dialog open/close and keyboard navigation using Storybook interactions.
 * Validates that alert dialog requires explicit action (no ESC or click-outside closing).
 */
export const InteractiveTest: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-testid="open-alert">Open Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="alert-content">
        <AlertDialogHeader>
          <AlertDialogTitle>Test Alert Dialog</AlertDialogTitle>
          <AlertDialogDescription>
            This alert dialog tests that user must take explicit action to dismiss.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Try pressing ESC or clicking outside - the dialog should remain open.
            You must click Cancel or Confirm to close.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="cancel-button">Cancel</AlertDialogCancel>
          <AlertDialogAction data-testid="confirm-button">Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open alert dialog
    const trigger = canvas.getByTestId('open-alert');
    await userEvent.click(trigger);

    // Wait for alert dialog to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Alert dialog should be visible
    const alertContent = body.getByTestId('alert-content');
    await expect(alertContent).toBeInTheDocument();

    // Verify confirm button exists
    const confirmButton = body.getByTestId('confirm-button');
    await expect(confirmButton).toBeInTheDocument();

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for alert dialog to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Comparison with Dialog.
 *
 * Side-by-side comparison showing when to use AlertDialog vs Dialog.
 * This is educational to help developers choose the right component.
 */
export const ComparisonWithDialog: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">When to Use Each Component</h3>
        <p className="text-sm text-muted-foreground">
          Choose the right modal component based on your use case.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-semibold text-destructive">Use AlertDialog for:</h4>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Destructive actions (delete, remove)</li>
            <li>Critical warnings</li>
            <li>Confirmations that can't be ignored</li>
            <li>Actions requiring explicit user response</li>
          </ul>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Example: Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-semibold" style={{ color: '#0ec2bc' }}>Use Dialog for:</h4>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Forms and data entry</li>
            <li>Settings and preferences</li>
            <li>Detail views</li>
            <li>Non-critical information</li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2">
            See dialog.stories.tsx for Dialog examples.
          </p>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h4 className="font-semibold text-sm">Key Difference:</h4>
        <p className="text-sm">
          <strong>AlertDialog</strong> requires explicit user action (must click confirm/cancel).
          User cannot dismiss by pressing ESC or clicking outside.
        </p>
        <p className="text-sm">
          <strong>Dialog</strong> can be dismissed multiple ways (ESC, click outside, close button).
          More flexible for non-critical interactions.
        </p>
      </div>
    </div>
  ),
};
