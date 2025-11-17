import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from './context-menu';
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
  Copy,
  Scissors,
  ClipboardPaste,
  FileEdit,
  Trash2,
  Share2,
  Download,
  Eye,
  EyeOff,
  BookOpen,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import React from 'react';

/**
 * ContextMenu component for right-click contextual menus.
 * Built on Radix UI ContextMenu primitive.
 *
 * ## Features
 * - Right-click activation (context menu pattern)
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
 * <ContextMenu>
 *   <ContextMenuTrigger>
 *     <div>Right-click me</div>
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuLabel>Section</ContextMenuLabel>
 *     <ContextMenuItem>Action</ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuCheckboxItem checked>Toggle</ContextMenuCheckboxItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 *
 * ## Usage Notes
 * - ContextMenu is triggered by right-clicking (or long-press on mobile)
 * - Use for contextual actions related to a specific element
 * - Different from DropdownMenu which is triggered by a button click
 * - Ideal for file managers, text editors, canvas elements
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a menu to the user when right-clicking on an element — such as a set of actions or functions — triggered by right-click.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default context menu with basic items
 */
export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Source</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * File explorer context menu with icons and shortcuts
 */
export const FileExplorer: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[180px] w-[320px] items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm">
          <FileText className="mr-2 h-6 w-6 text-muted-foreground" />
          <span>Document.pdf</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Open</span>
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>Preview</span>
          <ContextMenuShortcut>Space</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy</span>
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Cut</span>
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          <span>Paste</span>
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Menu with checkbox items for toggleable settings
 */
export const WithCheckboxItems: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(false);
    const [showFullUrls, setShowFullUrls] = React.useState(true);
    const [showDevTools, setShowDevTools] = React.useState(false);

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
            Right-click for view options
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>View Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showBookmarks}
            onCheckedChange={setShowBookmarks}
          >
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showFullUrls}
            onCheckedChange={setShowFullUrls}
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showDevTools}
            onCheckedChange={setShowDevTools}
          >
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

/**
 * Menu with radio group for single selection
 */
export const WithRadioGroup: Story = {
  render: () => {
    const [view, setView] = React.useState('grid');

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
            Right-click to change view
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>View Mode</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={view} onValueChange={setView}>
            <ContextMenuRadioItem value="grid">Grid View</ContextMenuRadioItem>
            <ContextMenuRadioItem value="list">List View</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact View</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

/**
 * Menu with sub-menus (nested menus)
 */
export const WithSubMenus: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for nested options
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>Email</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Message</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Document</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Image</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Folder</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>Upload to Cloud</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Menu with grouped items
 */
export const WithGroups: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for grouped actions
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>File Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            <FileEdit className="mr-2 h-4 w-4" />
            <span>Edit</span>
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Text editor context menu
 */
export const TextEditor: Story = {
  render: () => {
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [fontSize, setFontSize] = React.useState('medium');

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-[200px] w-[400px] rounded-md border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Right-click this text to see editor options. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Text Formatting</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={isBold}
            onCheckedChange={setIsBold}
          >
            Bold
            <ContextMenuShortcut>⌘B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={isItalic}
            onCheckedChange={setIsItalic}
          >
            Italic
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Font Size</ContextMenuLabel>
          <ContextMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
            <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
            <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
            <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Cut</span>
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            <span>Paste</span>
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

/**
 * Ozean Licht branded context menu
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[180px] w-[320px] items-center justify-center rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 to-transparent text-sm font-medium">
          Right-click for Ozean Licht menu
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="text-[#0ec2bc]">Ozean Licht</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>My Courses</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </ContextMenuItem>
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Menu with disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click to see disabled items
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share (Coming soon)</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete (No permission)</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Image viewer context menu
 */
export const ImageViewer: Story = {
  render: () => {
    const [showMetadata, setShowMetadata] = React.useState(true);
    const [zoom, setZoom] = React.useState('fit');

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[200px] w-[350px] items-center justify-center rounded-lg border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Image Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Full Size</span>
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Zoom</ContextMenuLabel>
          <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
            <ContextMenuRadioItem value="fit">Fit to Window</ContextMenuRadioItem>
            <ContextMenuRadioItem value="actual">Actual Size</ContextMenuRadioItem>
            <ContextMenuRadioItem value="fill">Fill Window</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showMetadata}
            onCheckedChange={setShowMetadata}
          >
            Show Metadata
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Image</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

/**
 * Inset items (indented for visual hierarchy)
 */
export const WithInsetItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for inset menu
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Open
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Save
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>Save As...</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Export</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>PDF</ContextMenuItem>
            <ContextMenuItem>PNG</ContextMenuItem>
            <ContextMenuItem>SVG</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Print
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Interactive test with play function
 * Tests context menu interactions and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
          data-testid="context-trigger"
        >
          Right-click to test
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="context-content">
        <ContextMenuLabel>Test Menu</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="edit-item">Edit</ContextMenuItem>
        <ContextMenuItem data-testid="copy-item">Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="delete-item">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Right-click trigger to open context menu
    const trigger = canvas.getByTestId('context-trigger');
    await userEvent.pointer([
      { keys: '[MouseRight>]', target: trigger },
      { keys: '[/MouseRight]' },
    ]);

    // Wait for menu to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Menu should be visible
    const menuContent = body.getByTestId('context-content');
    await expect(menuContent).toBeInTheDocument();

    // Items should be accessible
    const editItem = body.getByTestId('edit-item');
    await expect(editItem).toBeInTheDocument();

    // Click edit item
    await userEvent.click(editItem);

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
    const [autoSave, setAutoSave] = React.useState(false);
    const [theme, setTheme] = React.useState('light');

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[220px] w-[400px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/5 p-6 text-center">
            <Settings className="h-8 w-8 text-[#0ec2bc]" />
            <p className="text-sm font-medium">Right-click for full menu</p>
            <p className="text-xs text-muted-foreground">
              Demonstrates all context menu features
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel className="text-[#0ec2bc]">Complete Menu</ContextMenuLabel>
          <ContextMenuSeparator />

          {/* Regular items with icons and shortcuts */}
          <ContextMenuGroup>
            <ContextMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <ContextMenuShortcut>⌘B</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>

          <ContextMenuSeparator />

          {/* Checkbox items */}
          <ContextMenuLabel>Preferences</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Enable notifications
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={autoSave}
            onCheckedChange={setAutoSave}
          >
            Auto-save
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          {/* Radio group */}
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>

          <ContextMenuSeparator />

          {/* Sub-menu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email</span>
              </ContextMenuItem>
              <ContextMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Message</span>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          {/* Support and logout */}
          <ContextMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API (Coming soon)</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
            <ContextMenuShortcut>⇧⌘Q</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
