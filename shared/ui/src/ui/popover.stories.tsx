import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from '../components/Button';
import { Label } from './label';
import { Input } from './input';
import { Calendar, Settings, HelpCircle, User, Mail, Phone } from 'lucide-react';

/**
 * Popover primitive component built on Radix UI Popover.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * For Ozean Licht branded popovers with glass morphism and cosmic effects, see Tier 2 Branded/Popover.
 *
 * ## Radix UI Popover Features
 * - **Accessible**: Proper focus management, ARIA attributes, keyboard navigation
 * - **Composable**: Build custom popovers with flexible trigger and content
 * - **Portal Rendering**: Renders outside DOM hierarchy to avoid z-index issues
 * - **Auto-positioning**: Automatically positions content with collision detection
 * - **Esc to Close**: Closes on Escape key press
 * - **Click Outside**: Closes when clicking outside the popover
 * - **No Focus Lock**: Unlike Dialog, allows focus outside (for non-modal interactions)
 * - **Controlled or Uncontrolled**: Can be fully controlled or manage its own state
 *
 * ## Component Structure
 * ```tsx
 * <Popover> // Root - manages open state
 *   <PopoverTrigger /> // Element that opens the popover (button, link, etc)
 *   <PopoverContent> // Popover content container with auto-positioning
 *     {children} // Your content (forms, menus, info cards, etc)
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * ## Positioning Props
 * - **side**: 'top' | 'right' | 'bottom' | 'left' (default: bottom)
 * - **align**: 'start' | 'center' | 'end' (default: center)
 * - **sideOffset**: Distance from trigger in pixels (default: 4)
 * - **alignOffset**: Distance along the alignment axis
 *
 * ## Usage Notes
 * - Use for lightweight, non-modal overlays (tooltips with interaction, dropdowns, form helpers)
 * - For modal dialogs that require user interaction, use Dialog instead
 * - PopoverContent automatically includes portal rendering
 * - Use asChild prop on trigger to render as custom component
 * - Popover remains open when clicking inside content (unlike Tooltip)
 *
 * ## When to Use Popover vs Other Components
 * - **Popover**: Rich, interactive content that doesn't block the page (forms, settings panels)
 * - **Tooltip**: Simple text-only hover information (brief labels, hints)
 * - **Dialog**: Modal content requiring full user attention (confirmations, complex forms)
 * - **DropdownMenu**: Menu of actions/options (navigation, context menus)
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A lightweight overlay that displays rich content triggered by a button. Built on Radix UI Popover primitive. Perfect for contextual information, forms, and interactive panels that don\'t require modal behavior.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default popover with basic content.
 *
 * The most basic popover implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">About Popovers</h4>
          <p className="text-sm text-muted-foreground">
            Popovers are perfect for displaying rich, interactive content without blocking the page.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover with form content.
 *
 * Common pattern for inline forms and settings that don't require a full dialog.
 */
export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover positioned on different sides.
 *
 * Demonstrates the side prop for controlling where the popover appears relative to the trigger.
 */
export const Positioning: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center justify-center p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Popover positioned on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Popover positioned on right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom (Default)</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Popover positioned on bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Popover positioned on left</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/**
 * Popover with different alignments.
 *
 * Shows how to align the popover relative to the trigger using the align prop.
 */
export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Side: bottom</p>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Start</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60">
              <p className="text-sm">Aligned to the start (left edge)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Center</Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-60">
              <p className="text-sm">Aligned to center (default)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align End</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <p className="text-sm">Aligned to the end (right edge)</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Side: right</p>
        <div className="flex flex-col gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Start (Top)</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-60">
              <p className="text-sm">Aligned to start (top edge)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Center</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className="w-60">
              <p className="text-sm">Aligned to center</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align End (Bottom)</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="end" className="w-60">
              <p className="text-sm">Aligned to end (bottom edge)</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  ),
};

/**
 * Popover with custom offset.
 *
 * Demonstrates sideOffset prop to control distance from trigger.
 */
export const WithOffset: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Default Offset (4px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={4}>
          <p className="text-sm">Default offset: 4px</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Large Offset (20px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={20}>
          <p className="text-sm">Large offset: 20px from trigger</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">No Offset (0px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={0}>
          <p className="text-sm">No offset: Directly touching trigger</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/**
 * Controlled popover state.
 *
 * Shows how to control popover open state programmatically using open and onOpenChange props.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledPopover = () => {
      const [open, setOpen] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Popover</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Popover (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Popover is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">Toggle Trigger</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Controlled Popover</h4>
                <p className="text-sm text-muted-foreground">
                  This popover's state is controlled by external state.
                  You can open/close it programmatically.
                </p>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Close from Inside
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    };

    return <ControlledPopover />;
  },
};

/**
 * User profile card popover.
 *
 * Real-world example showing a user profile card with interactive content.
 */
export const UserProfileCard: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0ec2bc] to-[#0ec2bc]/60 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-sm">Maria Schmidt</h4>
              <p className="text-xs text-muted-foreground">Product Designer</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">maria.schmidt@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">+43 123 456 789</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">Message</Button>
            <Button size="sm" variant="outline" className="flex-1">Follow</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Date picker popover example.
 *
 * Shows how popovers are commonly used for date/time pickers.
 */
export const DatePickerExample: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Pick a date
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="date-input">Select Date</Label>
            <Input
              id="date-input"
              type="date"
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline">Cancel</Button>
            <Button size="sm">Confirm</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Help tooltip with rich content.
 *
 * Shows how to use popover for contextual help that needs more than plain text.
 */
export const HelpTooltip: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Password Requirements</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-72">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Password Requirements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one uppercase letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one special character</span>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Input type="password" placeholder="Enter password" />
    </div>
  ),
};

/**
 * Settings panel popover.
 *
 * Complex example with multiple form controls in a popover.
 */
export const SettingsPanel: Story = {
  render: () => {
    const SettingsPopover = () => {
      const [notifications, setNotifications] = useState(true);
      const [autoSave, setAutoSave] = useState(false);

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm leading-none">Settings</h4>
                <p className="text-xs text-muted-foreground">
                  Configure your preferences
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">
                    Enable notifications
                  </Label>
                  <button
                    id="notifications"
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-[#0ec2bc]' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autosave" className="text-sm">
                    Auto-save changes
                  </Label>
                  <button
                    id="autosave"
                    onClick={() => setAutoSave(!autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSave ? 'bg-[#0ec2bc]' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm">Theme</Label>
                  <select
                    id="theme"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm">Save Changes</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    };

    return <SettingsPopover />;
  },
};

/**
 * Ozean Licht branded popover.
 *
 * Demonstrates using Ozean Licht turquoise accent color (#0ec2bc).
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="cta"
          style={{
            backgroundColor: '#0ec2bc',
            color: 'white',
          }}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn More
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" style={{ borderColor: '#0ec2bc' }}>
        <div className="space-y-3">
          <h4 className="font-semibold text-sm" style={{ color: '#0ec2bc' }}>
            Ozean Licht Platform
          </h4>
          <p className="text-sm text-muted-foreground">
            A content platform and educational ecosystem serving two Austrian associations
            with cosmic-inspired design and advanced content management.
          </p>
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Multi-tenant architecture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Advanced content streaming</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Real-time collaboration</span>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            style={{ backgroundColor: '#0ec2bc', color: 'white' }}
          >
            Get Started
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Custom width popovers.
 *
 * Shows how to control popover width with className.
 */
export const CustomWidth: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Narrow</Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <p className="text-sm">Narrow popover (w-48)</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Default</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Default width popover (w-72)</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Wide</Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <p className="text-sm">Wide popover (w-96) with more space for content</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Auto</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <p className="text-sm whitespace-nowrap">Auto width</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/**
 * Quick action menu in popover.
 *
 * Shows how popover can be used for action menus (alternative to DropdownMenu).
 */
export const QuickActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Quick Actions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Edit
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Duplicate
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Archive
          </button>
          <div className="h-px bg-border my-1" />
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors">
            Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests popover open/close and keyboard interactions using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" data-testid="popover-trigger">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent data-testid="popover-content">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Test Popover</h4>
          <Input
            data-testid="popover-input"
            placeholder="Type here..."
          />
          <Button size="sm" data-testid="popover-button">
            Submit
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open popover
    const trigger = canvas.getByTestId('popover-trigger');
    await userEvent.click(trigger);

    // Wait for popover to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Popover should be visible
    const popoverContent = body.getByTestId('popover-content');
    await expect(popoverContent).toBeInTheDocument();

    // Interact with input inside popover
    const input = body.getByTestId('popover-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click button inside popover
    const button = body.getByTestId('popover-button');
    await userEvent.click(button);

    // Popover should still be open (buttons don't close it by default)
    await expect(popoverContent).toBeInTheDocument();

    // Click outside to close
    await userEvent.click(canvasElement);

    // Wait for popover to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Multiple popovers example.
 *
 * Shows multiple independent popovers working together.
 */
export const MultiplePopovers: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 1</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">First Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the first independent popover.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 2</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Second Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the second independent popover.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 3</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Third Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the third independent popover. Opening one doesn't close the others.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/**
 * Complex form in popover.
 *
 * Demonstrates a complete form workflow inside a popover.
 */
export const ComplexForm: Story = {
  render: () => {
    const FormPopover = () => {
      const [email, setEmail] = useState('');
      const [name, setName] = useState('');

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <User className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Create New Account</h4>
                <p className="text-sm text-muted-foreground">
                  Fill in the information below to create your account.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" id="terms" className="rounded" />
                  <Label htmlFor="terms" className="font-normal">
                    I agree to the terms and conditions
                  </Label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  style={{ backgroundColor: '#0ec2bc', color: 'white' }}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    };

    return <FormPopover />;
  },
};
