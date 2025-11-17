import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
} from './sheet';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';

/**
 * Sheet primitive component built on Radix UI Dialog.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * A Sheet is a side drawer that slides in from the edge of the screen, built on top of Dialog primitive.
 * For Ozean Licht branded sheets with glass morphism and cosmic effects, see Tier 2 Branded/Sheet.
 *
 * ## Radix UI Dialog/Sheet Features
 * - **Accessible**: Proper focus management, ARIA attributes, keyboard navigation
 * - **Composable**: Build custom sheets with SheetHeader, SheetFooter, SheetTitle, etc.
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 * - **Focus Trap**: Keeps focus within sheet when open
 * - **Scroll Lock**: Prevents background scrolling when open
 * - **Esc to Close**: Closes on Escape key press
 * - **Click Outside**: Closes when clicking backdrop overlay
 * - **Four Sides**: Slides in from top, right, bottom, or left
 * - **Animated**: Smooth slide-in/out animations
 *
 * ## Component Structure
 * ```tsx
 * <Sheet> // Root - manages open state
 *   <SheetTrigger /> // Button that opens sheet
 *   <SheetPortal> // Renders content in portal (automatic in SheetContent)
 *     <SheetOverlay /> // Backdrop overlay (automatic in SheetContent)
 *     <SheetContent side="right"> // Main sheet container with side variant
 *       <SheetHeader> // Header wrapper (optional)
 *         <SheetTitle /> // Sheet title (required for accessibility)
 *         <SheetDescription /> // Description (recommended for accessibility)
 *       </SheetHeader>
 *       {children} // Your content
 *       <SheetFooter> // Footer wrapper for actions (optional)
 *         <SheetClose /> // Button that closes sheet
 *       </SheetFooter>
 *     </SheetContent>
 *   </SheetPortal>
 * </Sheet>
 * ```
 *
 * ## Side Variants
 * - `top`: Slides in from top edge (full width)
 * - `right`: Slides in from right edge (default, max-w-sm on desktop)
 * - `bottom`: Slides in from bottom edge (full width)
 * - `left`: Slides in from left edge (max-w-sm on desktop)
 *
 * ## Usage Notes
 * - SheetTitle is required for screen reader accessibility
 * - SheetContent includes SheetPortal and SheetOverlay automatically
 * - Use asChild prop to render trigger as custom component
 * - SheetClose can wrap any element to make it close the sheet
 * - Default side is "right" - perfect for navigation menus and forms
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A side drawer that slides in from the edge of the screen. Built on Radix UI Dialog primitive with side variants.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sheet sliding from the right.
 *
 * The most basic sheet implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
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
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding from the right side (default behavior).
 *
 * Perfect for navigation menus, filters, and forms.
 */
export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Right</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Quick access to main navigation items.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <nav className="flex flex-col space-y-2">
            <a href="#" className="px-4 py-2 hover:bg-accent rounded-md text-sm">
              Dashboard
            </a>
            <a href="#" className="px-4 py-2 hover:bg-accent rounded-md text-sm">
              Projects
            </a>
            <a href="#" className="px-4 py-2 hover:bg-accent rounded-md text-sm">
              Settings
            </a>
            <a href="#" className="px-4 py-2 hover:bg-accent rounded-md text-sm">
              Help
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding from the left side.
 *
 * Common pattern for sidebars and filters.
 */
export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
          <SheetDescription>
            Refine your search results using the filters below.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">Development</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">Design</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">Marketing</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center space-x-2">
                <input type="radio" name="price" />
                <span className="text-sm">Free</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="price" />
                <span className="text-sm">$0 - $50</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="price" />
                <span className="text-sm">$50+</span>
              </label>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Clear Filters</Button>
          </SheetClose>
          <Button>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding from the top.
 *
 * Full width sheet, useful for announcements or search bars.
 */
export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>
            Search across all projects and documents.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full"
          />
        </div>
        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-2">Recent Searches:</p>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80">
              React hooks
            </button>
            <button className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80">
              TypeScript
            </button>
            <button className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80">
              Tailwind CSS
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding from the bottom.
 *
 * Full width sheet, great for mobile actions or cookie consent.
 */
export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Cookie Settings</SheetTitle>
          <SheetDescription>
            Manage your cookie preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Essential Cookies</Label>
              <p className="text-sm text-muted-foreground">Required for the site to function</p>
            </div>
            <input type="checkbox" checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Cookies</Label>
              <p className="text-sm text-muted-foreground">Help us improve our service</p>
            </div>
            <input type="checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Cookies</Label>
              <p className="text-sm text-muted-foreground">Used for personalized ads</p>
            </div>
            <input type="checkbox" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Reject All</Button>
          </SheetClose>
          <Button>Accept All</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * All four sides demonstration.
 *
 * Shows all available side variants in one view.
 */
export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>Slides in from the top edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>Slides in from the right edge (default).</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>Slides in from the bottom edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>Slides in from the left edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

/**
 * Form sheet with validation.
 *
 * Common pattern for data entry forms in a sheet.
 */
export const FormSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create New Project</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new project</SheetTitle>
          <SheetDescription>
            Add a new project to your workspace. Fill in the details below.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name *</Label>
            <Input
              id="project-name"
              placeholder="My Awesome Project"
              required
            />
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
          <div className="grid gap-2">
            <Label htmlFor="project-team">Team</Label>
            <select
              id="project-team"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
            </select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">Create Project</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Confirmation sheet.
 *
 * Shows how to use sheets for confirmation dialogs.
 */
export const Confirmation: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete the item
            and remove it from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive font-medium">Warning</p>
            <p className="text-sm text-muted-foreground mt-1">
              All associated data will be lost. This includes comments, attachments,
              and history.
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button variant="destructive">Delete Permanently</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Controlled sheet state.
 *
 * Shows how to control sheet open state programmatically using the `open` and `onOpenChange` props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledSheet = () => {
      const [open, setOpen] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Sheet</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Sheet (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Sheet is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Controlled Sheet</SheetTitle>
                <SheetDescription>
                  This sheet's state is controlled by external state.
                  You can open/close it programmatically.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-sm">
                  Use the buttons above to control this sheet, or use the
                  built-in close button (X) or click outside to close.
                </p>
              </div>
              <SheetFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      );
    };

    return <ControlledSheet />;
  },
};

/**
 * Scrollable content sheet.
 *
 * Shows how to handle long content with scrolling.
 */
export const ScrollableContent: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View Privacy Policy</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Privacy Policy</SheetTitle>
          <SheetDescription>
            Please read our privacy policy carefully.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[60vh] space-y-4 text-sm py-4">
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
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Decline</Button>
          </SheetClose>
          <Button>Accept</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet without description.
 *
 * While SheetDescription is recommended for accessibility, it's optional.
 */
export const WithoutDescription: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Quick Actions</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-2">
          <Button variant="outline" className="w-full justify-start">
            New Document
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Upload File
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Share Link
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Export Data
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Custom close button.
 *
 * Demonstrates wrapping any element with SheetClose to make it close the sheet.
 */
export const CustomCloseButton: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Custom Close Buttons</SheetTitle>
          <SheetDescription>
            Any element wrapped with SheetClose will close the sheet when clicked.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <SheetClose asChild>
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Custom Button (closes sheet)
            </button>
          </SheetClose>
          <SheetClose asChild>
            <div className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center">
              Div as close button
            </div>
          </SheetClose>
          <SheetClose asChild>
            <a href="#" className="block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center">
              Link as close button
            </a>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Nested sheet structure demonstration.
 *
 * Shows the explicit use of SheetPortal and SheetOverlay (though they're
 * automatically included in SheetContent).
 */
export const ExplicitStructure: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Explicit Structure</SheetTitle>
            <SheetDescription>
              This sheet explicitly shows SheetPortal and SheetOverlay usage,
              though SheetContent includes them automatically.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use SheetPortal and SheetOverlay
              directly - SheetContent handles them for you.
            </p>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  ),
};

/**
 * Success notification sheet with Ozean Licht turquoise accent.
 *
 * Demonstrates using design tokens for accent colors (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          style={{
            backgroundColor: '#0ec2bc',
            color: 'white',
          }}
        >
          Complete Checkout
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle style={{ color: '#0ec2bc' }}>
            Order Confirmed!
          </SheetTitle>
          <SheetDescription>
            Your order has been successfully placed.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="rounded-lg border p-4" style={{ borderColor: '#0ec2bc' }}>
            <p className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
              Order #12345
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Expected delivery: 3-5 business days
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$99.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t">
              <span>Total</span>
              <span style={{ color: '#0ec2bc' }}>$104.00</span>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button style={{ backgroundColor: '#0ec2bc', color: 'white' }}>
            View Order Details
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests sheet open/close and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button data-testid="open-sheet">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent data-testid="sheet-content">
        <SheetHeader>
          <SheetTitle>Test Sheet</SheetTitle>
          <SheetDescription>
            This sheet tests keyboard and mouse interactions.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Input data-testid="sheet-input" placeholder="Type here..." />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" data-testid="cancel-button">
              Cancel
            </Button>
          </SheetClose>
          <Button data-testid="confirm-button">Confirm</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open sheet
    const trigger = canvas.getByTestId('open-sheet');
    await userEvent.click(trigger);

    // Wait for sheet to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Sheet should be visible
    const sheetContent = body.getByTestId('sheet-content');
    await expect(sheetContent).toBeInTheDocument();

    // Focus should be on the sheet content
    const input = body.getByTestId('sheet-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for sheet to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Navigation menu sheet.
 *
 * Real-world example of a mobile navigation menu.
 */
export const NavigationMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Menu</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Ozean Licht</SheetTitle>
          <SheetDescription>
            Navigate through the application
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="flex flex-col space-y-1">
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-md hover:bg-accent text-sm"
              style={{ color: '#0ec2bc' }}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-md hover:bg-accent text-sm"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              Projects
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-md hover:bg-accent text-sm"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Team
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-md hover:bg-accent text-sm"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </a>
          </nav>
        </div>
        <SheetFooter className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full"
            style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
          >
            Sign Out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
