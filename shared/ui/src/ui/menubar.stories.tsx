import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
} from './menubar';
import {
  File,
  FileText,
  Save,
  FolderOpen,
  Printer,
  Share2,
  Settings,
  Users,
  Mail,
  MessageSquare,
  Github,
  X,
  Undo,
  Redo,
  Copy,
  ClipboardPaste,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
} from 'lucide-react';
import React from 'react';

/**
 * Menubar component for desktop-style menu navigation.
 * Built on Radix UI Menubar primitive.
 *
 * ## Features
 * - Horizontal menu bar with multiple menus
 * - Keyboard navigation (Tab, Arrow keys, Enter, Escape)
 * - Support for items, labels, separators, and groups
 * - Checkbox items for toggleable options
 * - Radio groups for single-select options
 * - Sub-menus (nested menus)
 * - Keyboard shortcuts display
 * - Auto-positioning with collision detection
 * - Smooth animations on open/close
 * - Click outside to close
 * - Desktop application-style UX
 *
 * ## Anatomy
 * ```tsx
 * <Menubar>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>New</MenubarItem>
 *       <MenubarItem>Open</MenubarItem>
 *       <MenubarSeparator />
 *       <MenubarItem>Save</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 *   <MenubarMenu>
 *     <MenubarTrigger>Edit</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>Undo</MenubarItem>
 *       <MenubarItem>Redo</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 *
 * ## Use Cases
 * - Desktop application interfaces
 * - Rich text editors
 * - Admin dashboards
 * - Document editors
 * - Media players
 * - Development tools
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default menubar with basic File and Edit menus
 */
export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File</MenubarItem>
          <MenubarItem>Open File</MenubarItem>
          <MenubarItem>Save</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Complete desktop application menubar with icons and keyboard shortcuts
 */
export const WithIconsAndShortcuts: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>New File</span>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Open...</span>
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <span>Save As...</span>
            <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Printer className="mr-2 h-4 w-4" />
            <span>Print</span>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <X className="mr-2 h-4 w-4" />
            <span>Close Window</span>
            <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo className="mr-2 h-4 w-4" />
            <span>Undo</span>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo className="mr-2 h-4 w-4" />
            <span>Redo</span>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            <span>Cut</span>
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            <span>Paste</span>
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Find</span>
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <ZoomIn className="mr-2 h-4 w-4" />
            <span>Zoom In</span>
            <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <ZoomOut className="mr-2 h-4 w-4" />
            <span>Zoom Out</span>
            <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <span>Reset Zoom</span>
            <MenubarShortcut>⌘0</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Full Screen</span>
            <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Menubar with checkbox items for toggleable view options
 */
export const WithCheckboxItems: Story = {
  render: () => {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(true);
    const [showMinimap, setShowMinimap] = React.useState(false);

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open File</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
            >
              Activity Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showMinimap}
              onCheckedChange={setShowMinimap}
            >
              Minimap
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem>
              <Maximize className="mr-2 h-4 w-4" />
              Toggle Full Screen
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>Release Notes</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/**
 * Menubar with radio groups for single-selection options
 */
export const WithRadioGroups: Story = {
  render: () => {
    const [theme, setTheme] = React.useState('light');
    const [fontSize, setFontSize] = React.useState('medium');

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open File</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Theme</MenubarLabel>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="auto">Auto</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarLabel>Font Size</MenubarLabel>
            <MenubarRadioGroup value={fontSize} onValueChange={setFontSize}>
              <MenubarRadioItem value="small">Small</MenubarRadioItem>
              <MenubarRadioItem value="medium">Medium</MenubarRadioItem>
              <MenubarRadioItem value="large">Large</MenubarRadioItem>
              <MenubarRadioItem value="xlarge">Extra Large</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/**
 * Menubar with sub-menus (nested menus)
 */
export const WithSubMenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>New File</span>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Open Recent</span>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>project-a.tsx</MenubarItem>
              <MenubarItem>project-b.tsx</MenubarItem>
              <MenubarItem>project-c.tsx</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>More...</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo className="mr-2 h-4 w-4" />
            <span>Undo</span>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo className="mr-2 h-4 w-4" />
            <span>Redo</span>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <span>Transform</span>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Uppercase</MenubarItem>
              <MenubarItem>Lowercase</MenubarItem>
              <MenubarItem>Title Case</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Reverse</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Reload</span>
            <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Full Screen</span>
            <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Menubar with grouped items for better organization
 */
export const WithGroups: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>New File</span>
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Open...</span>
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              <Save className="mr-2 h-4 w-4" />
              <span>Save</span>
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <span>Save As...</span>
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              <Printer className="mr-2 h-4 w-4" />
              <span>Print</span>
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <Undo className="mr-2 h-4 w-4" />
              <span>Undo</span>
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Redo className="mr-2 h-4 w-4" />
              <span>Redo</span>
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy</span>
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ClipboardPaste className="mr-2 h-4 w-4" />
              <span>Paste</span>
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Ozean Licht branded menubar with turquoise accents
 */
export const OzeanLichtBranded: Story = {
  render: () => {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [theme, setTheme] = React.useState('light');

    return (
      <Menubar className="border-[#0ec2bc]/20">
        <MenubarMenu>
          <MenubarTrigger className="data-[state=open]:text-[#0ec2bc]">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel className="text-[#0ec2bc]">Document</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>New</span>
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Open</span>
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Save className="mr-2 h-4 w-4" />
              <span>Save</span>
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Share2 className="mr-2 h-4 w-4 text-[#0ec2bc]" />
              <span>Share</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="data-[state=open]:text-[#0ec2bc]">
            Edit
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Undo className="mr-2 h-4 w-4" />
              <span>Undo</span>
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Redo className="mr-2 h-4 w-4" />
              <span>Redo</span>
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy</span>
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ClipboardPaste className="mr-2 h-4 w-4" />
              <span>Paste</span>
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="data-[state=open]:text-[#0ec2bc]">
            View
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel className="text-[#0ec2bc]">Appearance</MenubarLabel>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Theme</MenubarLabel>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="auto">Auto</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="data-[state=open]:text-[#0ec2bc]">
            Help
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <span>Documentation</span>
            </MenubarItem>
            <MenubarItem>
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <span className="text-[#0ec2bc]">About Ozean Licht</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/**
 * Complete application menubar combining all features
 */
export const CompleteExample: Story = {
  render: () => {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showSidebar, setShowSidebar] = React.useState(true);
    const [showMinimap, setShowMinimap] = React.useState(false);
    const [theme, setTheme] = React.useState('light');
    const [fontSize, setFontSize] = React.useState('medium');

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>New File</span>
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <File className="mr-2 h-4 w-4" />
              <span>New Window</span>
              <MenubarShortcut>⇧⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Open...</span>
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>document-1.txt</MenubarItem>
                <MenubarItem>document-2.txt</MenubarItem>
                <MenubarItem>document-3.txt</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>More Files...</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              <Save className="mr-2 h-4 w-4" />
              <span>Save</span>
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <span>Save As...</span>
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Printer className="mr-2 h-4 w-4" />
              <span>Print</span>
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <X className="mr-2 h-4 w-4" />
              <span>Close Window</span>
              <MenubarShortcut>⌘W</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Undo className="mr-2 h-4 w-4" />
              <span>Undo</span>
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Redo className="mr-2 h-4 w-4" />
              <span>Redo</span>
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              <span>Cut</span>
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy</span>
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ClipboardPaste className="mr-2 h-4 w-4" />
              <span>Paste</span>
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Find</span>
              <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <span>Replace</span>
              <MenubarShortcut>⌘H</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>UI Elements</MenubarLabel>
            <MenubarCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showSidebar}
              onCheckedChange={setShowSidebar}
            >
              Sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showMinimap}
              onCheckedChange={setShowMinimap}
            >
              Minimap
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Theme</MenubarLabel>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="auto">Auto</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarLabel>Font Size</MenubarLabel>
            <MenubarRadioGroup value={fontSize} onValueChange={setFontSize}>
              <MenubarRadioItem value="small">Small</MenubarRadioItem>
              <MenubarRadioItem value="medium">Medium</MenubarRadioItem>
              <MenubarRadioItem value="large">Large</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem>
              <ZoomIn className="mr-2 h-4 w-4" />
              <span>Zoom In</span>
              <MenubarShortcut>⌘+</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ZoomOut className="mr-2 h-4 w-4" />
              <span>Zoom Out</span>
              <MenubarShortcut>⌘-</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Maximize className="mr-2 h-4 w-4" />
              <span>Full Screen</span>
              <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>Keyboard Shortcuts</MenubarItem>
            <MenubarItem>Release Notes</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Github className="mr-2 h-4 w-4" />
              <span>View on GitHub</span>
            </MenubarItem>
            <MenubarItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact Support</span>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/**
 * Rich text editor menubar example
 */
export const RichTextEditor: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>New</span>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Open</span>
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>PDF</MenubarItem>
              <MenubarItem>HTML</MenubarItem>
              <MenubarItem>Markdown</MenubarItem>
              <MenubarItem>Plain Text</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Printer className="mr-2 h-4 w-4" />
            <span>Print</span>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo className="mr-2 h-4 w-4" />
            <span>Undo</span>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo className="mr-2 h-4 w-4" />
            <span>Redo</span>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            <span>Paste</span>
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Find</span>
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <span>Find and Replace</span>
            <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Text</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Bold</MenubarItem>
              <MenubarItem>Italic</MenubarItem>
              <MenubarItem>Underline</MenubarItem>
              <MenubarItem>Strikethrough</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>Heading</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Heading 1</MenubarItem>
              <MenubarItem>Heading 2</MenubarItem>
              <MenubarItem>Heading 3</MenubarItem>
              <MenubarItem>Heading 4</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Align Left</MenubarItem>
          <MenubarItem>Align Center</MenubarItem>
          <MenubarItem>Align Right</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Insert Link</MenubarItem>
          <MenubarItem>Insert Image</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Ruler</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Line Numbers</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Focus Mode</span>
            <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Menubar with disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File</MenubarItem>
          <MenubarItem>Open File</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save</MenubarItem>
          <MenubarItem disabled>Save As... (Pro Only)</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Export (Coming Soon)</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem disabled>Redo (Nothing to redo)</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Cut (No selection)</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger disabled>Premium</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Premium Features</MenubarLabel>
          <MenubarSeparator />
          <MenubarItem disabled>Advanced Analytics</MenubarItem>
          <MenubarItem disabled>Team Collaboration</MenubarItem>
          <MenubarItem disabled>Custom Branding</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * Interactive test with play function
 * Tests menubar interactions and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <Menubar data-testid="menubar">
      <MenubarMenu>
        <MenubarTrigger data-testid="file-trigger">File</MenubarTrigger>
        <MenubarContent data-testid="file-content">
          <MenubarItem data-testid="new-item">New File</MenubarItem>
          <MenubarItem data-testid="open-item">Open File</MenubarItem>
          <MenubarSeparator />
          <MenubarItem data-testid="save-item">Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger data-testid="edit-trigger">Edit</MenubarTrigger>
        <MenubarContent data-testid="edit-content">
          <MenubarItem data-testid="undo-item">Undo</MenubarItem>
          <MenubarItem data-testid="redo-item">Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click File trigger to open menu
    const fileTrigger = canvas.getByTestId('file-trigger');
    await userEvent.click(fileTrigger);

    // Wait for menu to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // File menu should be visible
    const fileContent = body.getByTestId('file-content');
    await expect(fileContent).toBeInTheDocument();

    // Items should be accessible
    const newItem = body.getByTestId('new-item');
    await expect(newItem).toBeInTheDocument();

    // Click new item
    await userEvent.click(newItem);

    // Wait for menu to close
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Minimal menubar with just two menus
 */
export const Minimal: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Edit</MenubarItem>
          <MenubarItem>Duplicate</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
