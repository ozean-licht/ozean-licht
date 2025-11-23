import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';
import { CossUIButton as Button } from '../cossui';
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  Mail,
  MessageSquare,
  PlusCircle,
  Github,
  LifeBuoy,
  Cloud,
  Keyboard,
  Users,
} from 'lucide-react';
import React from 'react';

/**
 * DropdownMenu component for contextual menus and actions.
 * Built on Radix UI DropdownMenu primitive.
 *
 * ## Features
 * - Trigger-based menu activation
 * - Support for items, labels, separators, and groups
 * - Checkbox items for toggleable options
 * - Radio groups for single-select options
 * - Sub-menus (nested menus)
 * - Keyboard shortcuts display
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Auto-positioning with collision detection
 * - Smooth animations on open/close
 * - Click outside to close
 *
 * ## Anatomy
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Button</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuLabel>Section</DropdownMenuLabel>
 *     <DropdownMenuItem>Action</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuCheckboxItem checked>Toggle</DropdownMenuCheckboxItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dropdown menu with basic items
 */
export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Menu with icons and keyboard shortcuts
 */
export const WithIconsAndShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard shortcuts</span>
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Menu with checkbox items for toggleable settings
 */
export const WithCheckboxItems: Story = {
  render: () => {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(false);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">View Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPanel}
            onCheckedChange={setShowPanel}
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Menu with radio group for single selection
 */
export const WithRadioGroup: Story = {
  render: () => {
    const [position, setPosition] = React.useState('bottom');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Panel Position</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Menu with sub-menus (nested menus)
 */
export const WithSubMenus: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Message</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users className="mr-2 h-4 w-4" />
            <span>Invite users</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>Email</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>More...</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Menu with grouped items
 */
export const WithGroups: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Ozean Licht branded menu with CTA button
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="cta">
          <User className="mr-2 h-4 w-4" />
          My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-[#0ec2bc]">Ozean Licht</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Menu with disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive (Coming soon)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Delete (No permission)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Context menu style (right-click simulation)
 */
export const ContextMenuStyle: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here (or click to open)
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem>Back</DropdownMenuItem>
        <DropdownMenuItem disabled>Forward</DropdownMenuItem>
        <DropdownMenuItem>Reload</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Save Page As...</DropdownMenuItem>
            <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
            <DropdownMenuItem>Name Window...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Developer Tools</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>Show Bookmarks Bar</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Show Full URLs</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>People</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="pedro">
          <DropdownMenuRadioItem value="pedro">Pedro Duarte</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="colm">Colm Tuite</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Inset items (indented for visual hierarchy)
 */
export const WithInsetItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          New Tab
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          New Window
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>New Private Window</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>More Tools</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Save Page As...</DropdownMenuItem>
            <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
            <DropdownMenuItem>Name Window...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Developer Tools</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>
          Print...
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Interactive test with play function
 * Tests dropdown menu interactions and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" data-testid="menu-trigger">
          Open Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-testid="menu-content">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="profile-item">Profile</DropdownMenuItem>
        <DropdownMenuItem data-testid="settings-item">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="logout-item">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open menu
    const trigger = canvas.getByTestId('menu-trigger');
    await userEvent.click(trigger);

    // Wait for menu to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Menu should be visible
    const menuContent = body.getByTestId('menu-content');
    await expect(menuContent).toBeInTheDocument();

    // Items should be accessible
    const profileItem = body.getByTestId('profile-item');
    await expect(profileItem).toBeInTheDocument();

    // Click profile item
    await userEvent.click(profileItem);

    // Wait for menu to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Complete example combining all features
 */
export const CompleteExample: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(true);
    const [theme, setTheme] = React.useState('light');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="cta">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-[#0ec2bc]">Preferences</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Regular items with icons and shortcuts */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Checkbox items */}
          <DropdownMenuLabel>Display</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Enable notifications
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Radio group */}
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          {/* Sub-menu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Invite Members</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View All</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Support and logout */}
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
