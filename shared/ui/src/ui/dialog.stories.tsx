import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from './dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';

/**
 * Dialog primitive component built on Radix UI Dialog.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * For Ozean Licht branded dialogs with glass morphism and cosmic effects, see Tier 2 Branded/Dialog.
 *
 * ## Radix UI Dialog Features
 * - **Accessible**: Proper focus management, ARIA attributes, keyboard navigation
 * - **Composable**: Build custom dialogs with DialogHeader, DialogFooter, DialogTitle, etc.
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 * - **Focus Trap**: Keeps focus within dialog when open
 * - **Scroll Lock**: Prevents background scrolling when open
 * - **Esc to Close**: Closes on Escape key press
 * - **Click Outside**: Closes when clicking backdrop overlay
 *
 * ## Component Structure
 * ```tsx
 * <Dialog> // Root - manages open state
 *   <DialogTrigger /> // Button that opens dialog
 *   <DialogPortal> // Renders content in portal (automatic in DialogContent)
 *     <DialogOverlay /> // Backdrop overlay (automatic in DialogContent)
 *     <DialogContent> // Main dialog container
 *       <DialogHeader> // Header wrapper (optional)
 *         <DialogTitle /> // Dialog title (required for accessibility)
 *         <DialogDescription /> // Description (recommended for accessibility)
 *       </DialogHeader>
 *       {children} // Your content
 *       <DialogFooter> // Footer wrapper for actions (optional)
 *         <DialogClose /> // Button that closes dialog
 *       </DialogFooter>
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * ```
 *
 * ## Usage Notes
 * - DialogTitle is required for screen reader accessibility
 * - DialogContent includes DialogPortal and DialogOverlay automatically
 * - Use asChild prop to render trigger as custom component
 * - DialogClose can wrap any element to make it close the dialog
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Built on Radix UI Dialog primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dialog with trigger button.
 *
 * The most basic dialog implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with footer actions.
 *
 * Shows common pattern with action buttons in footer.
 */
export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Confirmation dialog with explicit DialogClose.
 *
 * Shows how to use DialogClose component to create cancel buttons.
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Form dialog example.
 *
 * Common pattern for forms inside dialogs.
 */
export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="My Awesome Project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input
              id="project-description"
              placeholder="A brief description of your project"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Repository URL</Label>
            <Input
              id="project-url"
              type="url"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Success notification dialog with Ozean Licht turquoise accent.
 *
 * Demonstrates using design tokens for accent colors (#0ec2bc).
 */
export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
          }}
        >
          Complete Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--primary)' }}>
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your payment of $99.00 has been processed successfully.
            A confirmation email has been sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            View Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Controlled dialog state.
 *
 * Shows how to control dialog open state programmatically using the `open` and `onOpenChange` props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledDialog = () => {
      const [open, setOpen] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Dialog</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Dialog (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Dialog is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled Dialog</DialogTitle>
                <DialogDescription>
                  This dialog's state is controlled by external state.
                  You can open/close it programmatically.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm">
                  Use the buttons above to control this dialog, or use the
                  built-in close button (X) or click outside to close.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    };

    return <ControlledDialog />;
  },
};

/**
 * Custom close button.
 *
 * Demonstrates wrapping any element with DialogClose to make it close the dialog.
 */
export const CustomCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Close Buttons</DialogTitle>
          <DialogDescription>
            Any element wrapped with DialogClose will close the dialog when clicked.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <DialogClose asChild>
            <button className="w-full px-4 py-2 bg-muted/30 hover:bg-muted/40 rounded-md text-sm">
              Custom Button (closes dialog)
            </button>
          </DialogClose>
          <DialogClose asChild>
            <div className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center">
              Div as close button
            </div>
          </DialogClose>
          <DialogClose asChild>
            <a href="#" className="block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center">
              Link as close button
            </a>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scrollable content dialog.
 *
 * Shows how to handle long content with scrolling.
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[50vh] space-y-4 text-sm">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog without description.
 *
 * While DialogDescription is recommended for accessibility, it's optional.
 */
export const WithoutDescription: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            This dialog doesn't have a DialogDescription component, but it's
            generally recommended for accessibility.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Nested dialog structure demonstration.
 *
 * Shows the explicit use of DialogPortal and DialogOverlay (though they're
 * automatically included in DialogContent).
 */
export const ExplicitStructure: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explicit Structure</DialogTitle>
            <DialogDescription>
              This dialog explicitly shows DialogPortal and DialogOverlay usage,
              though DialogContent includes them automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use DialogPortal and DialogOverlay
              directly - DialogContent handles them for you.
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ),
};

/**
 * Size variants.
 *
 * Demonstrates different dialog sizes by overriding className.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Small Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>Max width: 425px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a small dialog for simple confirmations.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Medium Dialog (Default)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogDescription>Default max width: 512px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is the default dialog size.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Large Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>Max width: 725px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a large dialog for complex forms or content.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests dialog open/close and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-testid="open-dialog">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-content">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>
            This dialog tests keyboard and mouse interactions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input data-testid="dialog-input" placeholder="Type here..." />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" data-testid="cancel-button">
              Cancel
            </Button>
          </DialogClose>
          <Button data-testid="confirm-button">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open dialog
    const trigger = canvas.getByTestId('open-dialog');
    await userEvent.click(trigger);

    // Wait for dialog to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Dialog should be visible
    const dialogContent = body.getByTestId('dialog-content');
    await expect(dialogContent).toBeInTheDocument();

    // Focus should be on the dialog content
    const input = body.getByTestId('dialog-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for dialog to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Ozean Licht themed examples.
 *
 * Multiple dialogs showcasing the Ozean Licht turquoise color (var(--primary)).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            Turquoise Accent
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--primary)' }}>
              Ozean Licht Dialog
            </DialogTitle>
            <DialogDescription>
              Using the Ozean Licht primary color (var(--primary)) for accents.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This demonstrates how to apply the Ozean Licht turquoise accent color
              to dialog elements. For full branded experience, see Tier 2 Dialog.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
            }}
          >
            Turquoise Border
          </Button>
        </DialogTrigger>
        <DialogContent style={{ borderColor: 'var(--primary)' }}>
          <DialogHeader>
            <DialogTitle>Dialog with Turquoise Border</DialogTitle>
            <DialogDescription>
              Border and text accents using Ozean Licht color.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm" style={{ color: 'var(--primary)' }}>
              Key information can be highlighted with the turquoise accent.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
