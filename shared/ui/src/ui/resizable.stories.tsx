import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './resizable';
import { Button } from './button';

/**
 * Resizable panel component built on react-resizable-panels.
 *
 * **This is a Tier 1 Primitive** - unstyled react-resizable-panels component with minimal default styling.
 * No Tier 2 branded version exists.
 *
 * ## react-resizable-panels Features
 * - **Flexible Layouts**: Create split views with resizable panels
 * - **Horizontal/Vertical**: Support for both layout directions
 * - **Nested Panels**: Panels can be nested for complex layouts
 * - **Drag Handles**: Visual handles for resizing with mouse or touch
 * - **Keyboard Navigation**: Resize panels using keyboard (Arrow keys)
 * - **Collapse/Expand**: Panels can collapse to minimum size
 * - **Min/Max Sizes**: Set size constraints on panels
 * - **Persistent Layouts**: Save and restore panel sizes
 * - **Imperative API**: Control panel sizes programmatically
 * - **Accessibility**: ARIA attributes and keyboard support
 *
 * ## Component Structure
 * ```tsx
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={50} minSize={20}>
 *     Left content
 *   </ResizablePanel>
 *   <ResizableHandle withHandle /> // Optional visible handle
 *   <ResizablePanel defaultSize={50} minSize={20}>
 *     Right content
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * ## Common Use Cases
 * - **Code Editors**: Monaco-like layout with file tree, editor, and terminal
 * - **File Explorers**: Sidebar with content view
 * - **Dashboards**: Split metrics and charts into resizable sections
 * - **Email Clients**: Message list and preview panes
 * - **Admin Panels**: Navigation, content, and properties panels
 * - **Documentation**: Table of contents with content view
 *
 * ## Usage Notes
 * - All panels in a group must sum to 100 (via defaultSize prop)
 * - Use `minSize` and `maxSize` to constrain panel dimensions (0-100)
 * - Set `collapsible` to allow panels to collapse to minSize
 * - Use `withHandle` prop on ResizableHandle for visible grip indicator
 * - Direction prop on PanelGroup: "horizontal" or "vertical"
 * - Panels use flex-box layout and fill available space
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Accessible and composable resizable panel groups built on react-resizable-panels. Create split views and complex layouts with drag-to-resize functionality.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal split with two equal panels.
 *
 * The most basic resizable implementation showing horizontal split.
 */
export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Left Panel</h3>
              <p className="text-sm text-muted-foreground">
                Drag the handle to resize
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Right Panel</h3>
              <p className="text-sm text-muted-foreground">
                Minimum size: 30%
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Vertical split layout.
 *
 * Shows vertical orientation with top and bottom panels.
 */
export const VerticalSplit: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="vertical" className="rounded-lg border">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Top Panel</h3>
              <p className="text-sm text-muted-foreground">
                Main content area (60% default)
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Bottom Panel</h3>
              <p className="text-sm text-muted-foreground">
                Secondary content (40% default, 20% minimum)
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Three panel layout with sidebars.
 *
 * Left sidebar, main content, and right sidebar layout.
 */
export const ThreePanels: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="flex h-full flex-col gap-2 p-4">
            <h3 className="font-semibold">Left Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Navigation</div>
              <div className="rounded-md bg-muted p-2 text-sm">Files</div>
              <div className="rounded-md bg-muted p-2 text-sm">Search</div>
              <div className="rounded-md bg-muted p-2 text-sm">Settings</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Main Content</h3>
              <p className="text-sm text-muted-foreground">
                Primary workspace area with 60% default width
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Min: 40%, Max: unlimited
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="flex h-full flex-col gap-2 p-4">
            <h3 className="font-semibold">Right Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Properties</div>
              <div className="rounded-md bg-muted p-2 text-sm">Inspector</div>
              <div className="rounded-md bg-muted p-2 text-sm">History</div>
              <div className="rounded-md bg-muted p-2 text-sm">Debug</div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Nested panels (vertical within horizontal).
 *
 * Complex layout with vertical split inside horizontal panels.
 */
export const NestedPanels: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full flex-col p-4">
            <h3 className="font-semibold mb-2">Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Explorer</div>
              <div className="rounded-md bg-muted p-2 text-sm">Search</div>
              <div className="rounded-md bg-muted p-2 text-sm">Git</div>
              <div className="rounded-md bg-muted p-2 text-sm">Extensions</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Main code editing area
                  </p>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Terminal</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrated terminal output
                  </p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Code editor layout (Monaco/VS Code style).
 *
 * Professional code editor layout with file tree, editor, and terminal.
 */
export const CodeEditor: Story = {
  render: () => (
    <div className="h-[700px] w-full bg-[#1e1e1e]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
          <div className="h-full bg-[#252526] text-white p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">EXPLORER</h3>
            <div className="space-y-1 text-sm">
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📁 src/
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 index.ts
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 app.tsx
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 styles.css
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📁 components/
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 Button.tsx
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📄 package.json
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📄 tsconfig.json
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={40}>
              <div className="h-full bg-[#1e1e1e] text-white">
                <div className="bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]">
                  <span className="text-gray-300">src/app.tsx</span>
                  <span className="ml-2 text-gray-500">●</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  <div><span className="text-[#569cd6]">import</span> <span className="text-[#ce9178]">React</span> <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'react'</span>;</div>
                  <div><span className="text-[#569cd6]">import</span> {'{'} <span className="text-[#9cdcfe]">Button</span> {'}'} <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'./components'</span>;</div>
                  <div className="mt-2"></div>
                  <div><span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">App</span> = () =&gt; {'{'}</div>
                  <div className="pl-4"><span className="text-[#c586c0]">return</span> (</div>
                  <div className="pl-8">&lt;<span className="text-[#4ec9b0]">div</span>&gt;</div>
                  <div className="pl-12">&lt;<span className="text-[#4ec9b0]">Button</span>&gt;Click me&lt;/<span className="text-[#4ec9b0]">Button</span>&gt;</div>
                  <div className="pl-8">&lt;/<span className="text-[#4ec9b0]">div</span>&gt;</div>
                  <div className="pl-4">);</div>
                  <div>{'}'};</div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="h-full bg-[#1e1e1e] text-white">
                <div className="bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]">
                  <span className="text-gray-300">TERMINAL</span>
                </div>
                <div className="p-4 font-mono text-xs space-y-1">
                  <div className="text-gray-400">$ npm run dev</div>
                  <div className="text-green-400">✓ Development server started</div>
                  <div className="text-gray-400">Local: http://localhost:3000</div>
                  <div className="text-gray-400">Ready in 1.2s</div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Dashboard layout with multiple data panels.
 *
 * Complex dashboard with header, sidebar, main content, and metrics.
 */
export const DashboardLayout: Story = {
  render: () => (
    <div className="h-[700px] w-full">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0ec2bc]/90 to-[#0ec2bc]/70 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        </div>

        {/* Main Layout */}
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full border-r p-4 space-y-2">
                <h3 className="font-semibold mb-4">Navigation</h3>
                <button className="w-full text-left px-3 py-2 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium">
                  Overview
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Analytics
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Reports
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Users
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Settings
                </button>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <div className="h-full p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="text-sm text-gray-600">Total Users</div>
                        <div className="text-2xl font-bold text-blue-600">24,563</div>
                        <div className="text-xs text-green-600 mt-1">↑ 12.5%</div>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-2xl font-bold text-green-600">$128,430</div>
                        <div className="text-xs text-green-600 mt-1">↑ 8.2%</div>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                        <div className="text-sm text-gray-600">Conversions</div>
                        <div className="text-2xl font-bold text-purple-600">1,247</div>
                        <div className="text-xs text-red-600 mt-1">↓ 3.1%</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 h-48 flex items-center justify-center bg-muted/30">
                      <span className="text-muted-foreground">Chart Visualization Area</span>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20}>
                  <div className="h-full p-6 border-t bg-muted/20">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>New user registration</span>
                        <span className="text-muted-foreground">2 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment received</span>
                        <span className="text-muted-foreground">5 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Report generated</span>
                        <span className="text-muted-foreground">12 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Settings updated</span>
                        <span className="text-muted-foreground">28 min ago</span>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  ),
};

/**
 * Panels with minimum and maximum size constraints.
 *
 * Demonstrates size constraints to prevent panels from becoming too small or large.
 */
export const WithMinMaxSizes: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Constrained Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 20% | Max: 40%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Cannot be resized beyond these limits
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Middle Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 30% | Max: 60%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Flexible but with limits
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Constrained Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 20% | Max: 40%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Same constraints as left panel
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Collapsible panel that can be fully collapsed.
 *
 * Shows how panels can collapse to their minimum size or be hidden.
 */
export const CollapsiblePanel: Story = {
  render: () => {
    const CollapsibleExample = () => {
      const [isCollapsed, setIsCollapsed] = useState(false);

      return (
        <div className="h-[600px] w-full">
          <div className="mb-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              Sidebar is {isCollapsed ? 'collapsed' : 'expanded'}
            </span>
          </div>
          <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
            <ResizablePanel
              defaultSize={25}
              minSize={isCollapsed ? 0 : 15}
              maxSize={40}
              collapsible={true}
            >
              <div className="flex h-full flex-col p-4">
                <h3 className="font-semibold mb-2">Collapsible Sidebar</h3>
                <div className="space-y-1">
                  <div className="rounded-md bg-muted p-2 text-sm">Item 1</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 2</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 3</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 4</div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Main Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Content area expands when sidebar collapses
                  </p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      );
    };

    return <CollapsibleExample />;
  },
};

/**
 * Email client layout.
 *
 * Classic email client with folder tree, message list, and preview pane.
 */
export const EmailClient: Story = {
  render: () => (
    <div className="h-[700px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full p-4 border-r">
            <h3 className="font-semibold mb-4">Folders</h3>
            <div className="space-y-1 text-sm">
              <div className="px-2 py-1.5 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium cursor-pointer">
                📥 Inbox (12)
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📤 Sent
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📝 Drafts (3)
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                ⭐ Starred
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                🗑️ Trash
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📁 Archive
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full border-r flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Inbox</h3>
              <p className="text-sm text-muted-foreground">12 messages</p>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="divide-y">
                <div className="p-4 hover:bg-muted cursor-pointer bg-[#0ec2bc]/5 border-l-2 border-[#0ec2bc]">
                  <div className="font-semibold text-sm">John Doe</div>
                  <div className="text-sm">Meeting Tomorrow</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Let's schedule our weekly sync...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer">
                  <div className="font-semibold text-sm">Jane Smith</div>
                  <div className="text-sm">Project Update</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Here's the latest on the dashboard...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer">
                  <div className="font-semibold text-sm">Team Notifications</div>
                  <div className="text-sm">Weekly Summary</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Your team completed 23 tasks...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={35}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Meeting Tomorrow</h3>
                  <p className="text-sm text-muted-foreground">From: John Doe</p>
                </div>
                <span className="text-xs text-muted-foreground">10:30 AM</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="text-sm">
                <p>Hi there,</p>
                <p className="mt-4">
                  I wanted to reach out about scheduling our weekly sync meeting for
                  tomorrow. Would 2 PM work for you?
                </p>
                <p className="mt-4">
                  We can discuss the Q4 roadmap and review the progress on the current
                  sprint. I'll prepare the agenda and send it over before the meeting.
                </p>
                <p className="mt-4">
                  Let me know if this time works or if you'd prefer a different slot.
                </p>
                <p className="mt-4">Best regards,<br />John</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Reply</Button>
                <Button variant="outline" size="sm">Reply All</Button>
                <Button variant="outline" size="sm">Forward</Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Without visible handles.
 *
 * Minimal design without visible grip handles on resize bars.
 */
export const WithoutHandles: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Left Panel</h3>
              <p className="text-sm text-muted-foreground">
                No visible handles, but still resizable
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Right Panel</h3>
              <p className="text-sm text-muted-foreground">
                Hover over the edge to see cursor change
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Ozean Licht themed resizable panels.
 *
 * Demonstrates using Ozean Licht turquoise branding with resizable layouts.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border border-[#0ec2bc]/30">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div
            className="h-full p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 194, 188, 0.05) 0%, rgba(14, 194, 188, 0.1) 100%)',
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#0ec2bc' }}>
              Navigation
            </h3>
            <div className="space-y-2">
              <div
                className="p-3 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: '#0ec2bc',
                  color: 'white',
                }}
              >
                Dashboard
              </div>
              <div
                className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10"
                style={{ border: '1px solid rgba(14, 194, 188, 0.2)' }}
              >
                Projects
              </div>
              <div
                className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10"
                style={{ border: '1px solid rgba(14, 194, 188, 0.2)' }}
              >
                Analytics
              </div>
              <div
                className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10"
                style={{ border: '1px solid rgba(14, 194, 188, 0.2)' }}
              >
                Settings
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="bg-[#0ec2bc]/20 hover:bg-[#0ec2bc]/40"
        />
        <ResizablePanel defaultSize={70}>
          <div className="h-full p-6">
            <div
              className="h-full rounded-lg p-6 flex items-center justify-center"
              style={{
                border: '2px solid rgba(14, 194, 188, 0.2)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(14, 194, 188, 0.05) 100%)',
              }}
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold" style={{ color: '#0ec2bc' }}>
                  Ozean Licht Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Resizable panels with turquoise branding (#0ec2bc)
                </p>
                <div className="flex gap-2 justify-center mt-6">
                  <Button
                    variant="cta"
                    style={{
                      backgroundColor: '#0ec2bc',
                      color: 'white',
                    }}
                  >
                    Primary Action
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderColor: '#0ec2bc',
                      color: '#0ec2bc',
                    }}
                  >
                    Secondary
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
