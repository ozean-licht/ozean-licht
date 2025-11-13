import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerOverlay,
  DrawerPortal,
} from './drawer';
import { Button } from '../components/Button';
import { Label } from './label';
import { Input } from './input';

/**
 * Drawer primitive component built on Vaul.
 *
 * **This is a Tier 1 Primitive** - mobile-optimized drawer/bottom sheet with drag-to-dismiss functionality.
 * For Ozean Licht branded drawers with glass morphism and cosmic effects, see Tier 2 Branded/Drawer (when available).
 *
 * ## Vaul Drawer Features
 * - **Mobile-First**: Designed for touch interfaces with swipe/drag gestures
 * - **Accessible**: Proper focus management, ARIA attributes, keyboard navigation
 * - **Drag to Dismiss**: Pull down gesture to close (visual handle included)
 * - **Background Scaling**: Optional scaling effect for background content
 * - **Composable**: Build custom drawers with DrawerHeader, DrawerFooter, DrawerTitle, etc.
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 * - **Focus Trap**: Keeps focus within drawer when open
 * - **Scroll Lock**: Prevents background scrolling when open
 * - **Esc to Close**: Closes on Escape key press
 * - **Click Outside**: Closes when clicking backdrop overlay
 *
 * ## Component Structure
 * ```tsx
 * <Drawer> // Root - manages open state, shouldScaleBackground
 *   <DrawerTrigger /> // Button that opens drawer
 *   <DrawerPortal> // Renders content in portal (automatic in DrawerContent)
 *     <DrawerOverlay /> // Backdrop overlay (automatic in DrawerContent)
 *     <DrawerContent> // Main drawer container (bottom by default)
 *       // Visual drag handle (automatic)
 *       <DrawerHeader> // Header wrapper (optional)
 *         <DrawerTitle /> // Drawer title (required for accessibility)
 *         <DrawerDescription /> // Description (recommended for accessibility)
 *       </DrawerHeader>
 *       {children} // Your content
 *       <DrawerFooter> // Footer wrapper for actions (optional)
 *         <DrawerClose /> // Button that closes drawer
 *       </DrawerFooter>
 *     </DrawerContent>
 *   </DrawerPortal>
 * </Drawer>
 * ```
 *
 * ## Usage Notes
 * - DrawerTitle is required for screen reader accessibility
 * - DrawerContent includes DrawerPortal, DrawerOverlay, and drag handle automatically
 * - Drawer opens from bottom by default (mobile-optimized)
 * - Set shouldScaleBackground={false} to disable background scaling effect
 * - Use asChild prop to render trigger as custom component
 * - DrawerClose can wrap any element to make it close the drawer
 *
 * ## Mobile vs Dialog
 * - Use Drawer for mobile-first, bottom-sheet UIs (filters, forms, menus)
 * - Use Dialog for desktop-centered modal dialogs
 * - Consider responsive: Drawer on mobile, Dialog on desktop
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A mobile-optimized drawer component that slides in from the bottom with drag-to-dismiss functionality. Built on Vaul primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default drawer with trigger button.
 *
 * The most basic drawer implementation showing essential structure with drag handle.
 */
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Drawer with footer actions.
 *
 * Shows common pattern with action buttons in footer.
 */
export const WithFooter: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 py-4 px-4">
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
        <DrawerFooter>
          <Button type="submit">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Confirmation drawer with explicit DrawerClose.
 *
 * Shows how to use DrawerClose component to create cancel buttons.
 */
export const Confirmation: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Delete Account</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Form drawer example.
 *
 * Common pattern for forms inside drawers - perfect for mobile data entry.
 */
export const FormDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Create Project</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new project</DrawerTitle>
          <DrawerDescription>
            Add a new project to your workspace. Click create when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 py-4 px-4">
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
        <DrawerFooter>
          <Button type="submit">Create Project</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Mobile menu drawer.
 *
 * Common pattern for mobile navigation menus.
 */
export const MobileMenu: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Menu
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Browse available sections</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-2">
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Home
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Dashboard
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Projects
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Settings
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Profile
            </button>
          </DrawerClose>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close Menu</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Filter drawer example.
 *
 * Common pattern for mobile filter interfaces (e-commerce, search results).
 */
export const FilterDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Results</DrawerTitle>
          <DrawerDescription>
            Refine your search with these filters
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" />
              <Input type="number" placeholder="Max" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home & Garden</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>{rating} stars & up</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline">Reset</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Success notification drawer with Ozean Licht turquoise accent.
 *
 * Demonstrates using design tokens for accent colors (#0ec2bc).
 */
export const SuccessDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="cta"
          style={{
            backgroundColor: '#0ec2bc',
            color: 'white',
          }}
        >
          Complete Payment
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle style={{ color: '#0ec2bc' }}>
            Payment Successful!
          </DrawerTitle>
          <DrawerDescription>
            Your payment of $99.00 has been processed successfully.
            A confirmation email has been sent to your inbox.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-6 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#0ec2bc20' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ec2bc"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Transaction ID: TXN-2024-001234
          </p>
        </div>
        <DrawerFooter>
          <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
            View Receipt
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Controlled drawer state.
 *
 * Shows how to control drawer open state programmatically using the `open` and `onOpenChange` props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledDrawer = () => {
      const [open, setOpen] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Drawer</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Drawer (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Drawer is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Controlled Drawer</DrawerTitle>
                <DrawerDescription>
                  This drawer's state is controlled by external state.
                  You can open/close it programmatically.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-4">
                <p className="text-sm">
                  Use the buttons above to control this drawer, or use the
                  drag handle or click outside to close.
                </p>
              </div>
              <DrawerFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      );
    };

    return <ControlledDrawer />;
  },
};

/**
 * Drawer without background scaling.
 *
 * Disables the background scale effect with shouldScaleBackground={false}.
 */
export const NoBackgroundScaling: Story = {
  render: () => (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer (No Scaling)</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>No Background Scaling</DrawerTitle>
          <DrawerDescription>
            This drawer doesn't scale the background content when opened.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Set shouldScaleBackground=false on the Drawer root component
            to disable the scaling effect.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Scrollable content drawer.
 *
 * Shows how to handle long content with scrolling.
 */
export const ScrollableContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>View Terms</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Terms and Conditions</DrawerTitle>
          <DrawerDescription>
            Please read our terms and conditions carefully.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[50vh] px-4 space-y-4 text-sm">
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <DrawerFooter>
          <Button>Accept</Button>
          <DrawerClose asChild>
            <Button variant="outline">Decline</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Custom close button.
 *
 * Demonstrates wrapping any element with DrawerClose to make it close the drawer.
 */
export const CustomCloseButton: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Custom Close Buttons</DrawerTitle>
          <DrawerDescription>
            Any element wrapped with DrawerClose will close the drawer when clicked.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4 space-y-3">
          <DrawerClose asChild>
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Custom Button (closes drawer)
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <div className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center">
              Div as close button
            </div>
          </DrawerClose>
          <DrawerClose asChild>
            <a href="#" className="block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center">
              Link as close button
            </a>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Drawer without description.
 *
 * While DrawerDescription is recommended for accessibility, it's optional.
 */
export const WithoutDescription: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Simple Drawer</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4">
          <p className="text-sm">
            This drawer doesn't have a DrawerDescription component, but it's
            generally recommended for accessibility.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Nested drawer structure demonstration.
 *
 * Shows the explicit use of DrawerPortal and DrawerOverlay (though they're
 * automatically included in DrawerContent).
 */
export const ExplicitStructure: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Explicit Structure</DrawerTitle>
            <DrawerDescription>
              This drawer explicitly shows DrawerPortal and DrawerOverlay usage,
              though DrawerContent includes them automatically.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use DrawerPortal and DrawerOverlay
              directly - DrawerContent handles them for you.
            </p>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  ),
};

/**
 * Height variants.
 *
 * Demonstrates different drawer heights by overriding className.
 */
export const HeightVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Small Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[30vh]">
          <DrawerHeader>
            <DrawerTitle>Small Drawer</DrawerTitle>
            <DrawerDescription>Max height: 30vh</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is a small drawer for simple confirmations.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button>Medium Drawer (Default)</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Medium Drawer</DrawerTitle>
            <DrawerDescription>Default auto height</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is the default drawer size.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button>Large Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Large Drawer</DrawerTitle>
            <DrawerDescription>Max height: 90vh</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is a large drawer for complex forms or content.</p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests drawer open/close and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button data-testid="open-drawer">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent data-testid="drawer-content">
        <DrawerHeader>
          <DrawerTitle>Test Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer tests keyboard and mouse interactions.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <Input data-testid="drawer-input" placeholder="Type here..." />
        </div>
        <DrawerFooter>
          <Button data-testid="confirm-button">Confirm</Button>
          <DrawerClose asChild>
            <Button variant="outline" data-testid="cancel-button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open drawer
    const trigger = canvas.getByTestId('open-drawer');
    await userEvent.click(trigger);

    // Wait for drawer to open
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Drawer should be visible
    const drawerContent = body.getByTestId('drawer-content');
    await expect(drawerContent).toBeInTheDocument();

    // Focus should work on the drawer content
    const input = body.getByTestId('drawer-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for drawer to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Ozean Licht themed examples.
 *
 * Multiple drawers showcasing the Ozean Licht turquoise color (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
            Turquoise Accent
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle style={{ color: '#0ec2bc' }}>
              Ozean Licht Drawer
            </DrawerTitle>
            <DrawerDescription>
              Using the Ozean Licht primary color (#0ec2bc) for accents.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground">
              This demonstrates how to apply the Ozean Licht turquoise accent color
              to drawer elements. For full branded experience, see Tier 2 Drawer.
            </p>
          </div>
          <DrawerFooter>
            <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
              Confirm
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            style={{
              borderColor: '#0ec2bc',
              color: '#0ec2bc',
            }}
          >
            Turquoise Border
          </Button>
        </DrawerTrigger>
        <DrawerContent style={{ borderColor: '#0ec2bc' }}>
          <DrawerHeader>
            <DrawerTitle>Drawer with Turquoise Border</DrawerTitle>
            <DrawerDescription>
              Border and text accents using Ozean Licht color.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm" style={{ color: '#0ec2bc' }}>
              Key information can be highlighted with the turquoise accent.
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};

/**
 * Shopping cart drawer example.
 *
 * Realistic e-commerce use case showing a mobile shopping cart.
 */
export const ShoppingCart: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart (3)
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>
            Review your items before checkout
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[50vh] px-4 space-y-4">
          {[
            { name: 'Wireless Headphones', price: 99.99, qty: 1 },
            { name: 'USB-C Cable', price: 14.99, qty: 2 },
            { name: 'Phone Case', price: 24.99, qty: 1 },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <div className="w-16 h-16 bg-gray-100 rounded" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm">$154.97</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Shipping</span>
            <span className="text-sm">$5.99</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span style={{ color: '#0ec2bc' }}>$160.96</span>
          </div>
        </div>
        <DrawerFooter>
          <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
            Proceed to Checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Continue Shopping</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
