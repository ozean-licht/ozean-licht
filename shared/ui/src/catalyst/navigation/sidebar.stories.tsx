import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarDivider,
  SidebarSpacer,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
} from './sidebar';
import {
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Folder,
  MessageSquare,
  Bell,
  Search,
  Calendar,
  Mail,
  Star,
  Heart,
  Archive,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Package,
  ShoppingCart,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Code,
  Database,
  Server,
  Cloud,
} from 'lucide-react';

/**
 * Catalyst Sidebar component built on Headless UI.
 *
 * **This is a Tier 1 Primitive** - Headless UI navigation sidebar with Catalyst styling.
 * No Tier 2 branded version exists. This component showcases Catalyst's glass morphism design system.
 *
 * ## Headless UI Sidebar Features
 * - **Flexible Layout**: Header, body, footer sections for organized navigation
 * - **Glass Morphism**: Beautiful backdrop blur and transparency effects
 * - **Active State**: Motion layout animations for current route indicator
 * - **Accessible**: Proper ARIA attributes and keyboard navigation
 * - **Composable**: Build complex navigation with sections, dividers, and headings
 * - **Responsive**: Adapts to different screen sizes with sm: breakpoints
 * - **Icon Support**: First-class support for leading and trailing icons
 * - **Badge Support**: Notification badges and counters
 *
 * ## Component Structure
 * ```tsx
 * <Sidebar> // Root navigation container
 *   <SidebarHeader> // Top section (logo, search, etc.)
 *     <SidebarSection>
 *       <SidebarItem /> // Navigation items
 *     </SidebarSection>
 *   </SidebarHeader>
 *
 *   <SidebarBody> // Main scrollable content
 *     <SidebarSection>
 *       <SidebarHeading /> // Section label
 *       <SidebarItem current> // Active item
 *         <Icon data-slot="icon" /> // Leading icon
 *         <SidebarLabel /> // Item text
 *         <Badge /> // Trailing badge
 *       </SidebarItem>
 *     </SidebarSection>
 *     <SidebarDivider /> // Visual separator
 *     <SidebarSpacer /> // Flexible spacer
 *   </SidebarBody>
 *
 *   <SidebarFooter> // Bottom section (user menu, etc.)
 *     <SidebarSection>
 *       <SidebarItem />
 *     </SidebarSection>
 *   </SidebarFooter>
 * </Sidebar>
 * ```
 *
 * ## Usage Notes
 * - SidebarItem accepts `current` prop to show active state with animated indicator
 * - Use `data-slot="icon"` on icon components for proper styling
 * - SidebarSection uses LayoutGroup from Motion for smooth animations
 * - Glass morphism effects use `glass-card-strong` utility class
 * - Borders use `border-primary/20` for subtle, theme-aware dividers
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible sidebar navigation component with glass morphism effects and smooth animations. Built on Headless UI with Catalyst design system.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper for consistent story display
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
    <div className="w-64">{children}</div>
    <div className="flex-1 p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          Main Content Area
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This demonstrates how the sidebar appears in a full application layout.
          The sidebar has glass morphism effects with backdrop blur and subtle borders.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Default sidebar with basic navigation items.
 *
 * The most basic sidebar implementation showing essential structure with header, body, and footer.
 */
export const Default: Story = {
  render: () => (
    <SidebarWrapper>
      <Sidebar>
        <SidebarHeader>
          <SidebarSection>
            <SidebarItem href="/">
              <Home data-slot="icon" />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarItem href="/dashboard" current>
              <LayoutDashboard data-slot="icon" />
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/documents">
              <FileText data-slot="icon" />
              <SidebarLabel>Documents</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/settings">
              <Settings data-slot="icon" />
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter>
          <SidebarSection>
            <SidebarItem href="/profile">
              <User data-slot="icon" />
              <SidebarLabel>Profile</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    </SidebarWrapper>
  ),
};

/**
 * Sidebar with icon for every navigation item.
 *
 * Shows best practices for using lucide-react icons with the data-slot="icon" attribute.
 */
export const WithIcons: Story = {
  render: () => (
    <SidebarWrapper>
      <Sidebar>
        <SidebarHeader>
          <SidebarSection>
            <SidebarItem href="/">
              <Home data-slot="icon" />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/search">
              <Search data-slot="icon" />
              <SidebarLabel>Search</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarItem href="/dashboard" current>
              <LayoutDashboard data-slot="icon" />
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/analytics">
              <BarChart3 data-slot="icon" />
              <SidebarLabel>Analytics</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/projects">
              <Folder data-slot="icon" />
              <SidebarLabel>Projects</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/messages">
              <MessageSquare data-slot="icon" />
              <SidebarLabel>Messages</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/calendar">
              <Calendar data-slot="icon" />
              <SidebarLabel>Calendar</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter>
          <SidebarSection>
            <SidebarItem href="/help">
              <HelpCircle data-slot="icon" />
              <SidebarLabel>Help</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/logout">
              <LogOut data-slot="icon" />
              <SidebarLabel>Logout</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    </SidebarWrapper>
  ),
};

/**
 * Sidebar with notification badges.
 *
 * Common pattern showing unread counts and status indicators using badge elements.
 */
export const WithBadges: Story = {
  render: () => {
    const Badge = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: string }) => (
      <span
        className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${
          color === 'red'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : color === 'turquoise'
            ? 'bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--primary)]/20'
            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
        }`}
      >
        {children}
      </span>
    );

    return (
      <SidebarWrapper>
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <SidebarItem href="/">
                <Home data-slot="icon" />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/inbox" current>
                <Mail data-slot="icon" />
                <SidebarLabel>Inbox</SidebarLabel>
                <Badge color="red">12</Badge>
              </SidebarItem>
              <SidebarItem href="/notifications">
                <Bell data-slot="icon" />
                <SidebarLabel>Notifications</SidebarLabel>
                <Badge color="turquoise">3</Badge>
              </SidebarItem>
              <SidebarItem href="/starred">
                <Star data-slot="icon" />
                <SidebarLabel>Starred</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/drafts">
                <FileText data-slot="icon" />
                <SidebarLabel>Drafts</SidebarLabel>
                <Badge>5</Badge>
              </SidebarItem>
              <SidebarItem href="/archive">
                <Archive data-slot="icon" />
                <SidebarLabel>Archive</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/trash">
                <Trash2 data-slot="icon" />
                <SidebarLabel>Trash</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </SidebarWrapper>
    );
  },
};

/**
 * Sidebar with nested navigation and sub-items.
 *
 * Demonstrates multi-level navigation with chevron icons for expandable sections.
 */
export const NestedNavigation: Story = {
  render: () => {
    const NestedSidebar = () => {
      const [expandedSections, setExpandedSections] = useState<string[]>(['products']);

      const toggleSection = (section: string) => {
        setExpandedSections((prev) =>
          prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
        );
      };

      return (
        <SidebarWrapper>
          <Sidebar>
            <SidebarHeader>
              <SidebarSection>
                <SidebarItem href="/">
                  <Home data-slot="icon" />
                  <SidebarLabel>Home</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/dashboard" current>
                  <LayoutDashboard data-slot="icon" />
                  <SidebarLabel>Dashboard</SidebarLabel>
                </SidebarItem>

                <SidebarItem onClick={() => toggleSection('products')}>
                  <Package data-slot="icon" />
                  <SidebarLabel>Products</SidebarLabel>
                  {expandedSections.includes('products') ? (
                    <ChevronDown data-slot="icon" className="size-4" />
                  ) : (
                    <ChevronRight data-slot="icon" className="size-4" />
                  )}
                </SidebarItem>

                {expandedSections.includes('products') && (
                  <div className="ml-6 space-y-0.5">
                    <SidebarItem href="/products/all">
                      <SidebarLabel>All Products</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/products/inventory">
                      <SidebarLabel>Inventory</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/products/categories">
                      <SidebarLabel>Categories</SidebarLabel>
                    </SidebarItem>
                  </div>
                )}

                <SidebarItem onClick={() => toggleSection('sales')}>
                  <ShoppingCart data-slot="icon" />
                  <SidebarLabel>Sales</SidebarLabel>
                  {expandedSections.includes('sales') ? (
                    <ChevronDown data-slot="icon" className="size-4" />
                  ) : (
                    <ChevronRight data-slot="icon" className="size-4" />
                  )}
                </SidebarItem>

                {expandedSections.includes('sales') && (
                  <div className="ml-6 space-y-0.5">
                    <SidebarItem href="/sales/orders">
                      <SidebarLabel>Orders</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/sales/customers">
                      <SidebarLabel>Customers</SidebarLabel>
                    </SidebarItem>
                  </div>
                )}

                <SidebarItem href="/analytics">
                  <BarChart3 data-slot="icon" />
                  <SidebarLabel>Analytics</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>
            <SidebarFooter>
              <SidebarSection>
                <SidebarItem href="/settings">
                  <Settings data-slot="icon" />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarFooter>
          </Sidebar>
        </SidebarWrapper>
      );
    };

    return <NestedSidebar />;
  },
};

/**
 * Collapsible sidebar with expand/collapse toggle.
 *
 * Shows how to implement a sidebar that can be collapsed to save screen space.
 */
export const Collapsible: Story = {
  render: () => {
    const CollapsibleSidebar = () => {
      const [collapsed, setCollapsed] = useState(false);

      return (
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
          <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            <Sidebar>
              <SidebarHeader>
                <SidebarSection>
                  <SidebarItem onClick={() => setCollapsed(!collapsed)}>
                    <LayoutDashboard data-slot="icon" />
                    {!collapsed && <SidebarLabel>Collapse</SidebarLabel>}
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/dashboard" current>
                    <Home data-slot="icon" />
                    {!collapsed && <SidebarLabel>Dashboard</SidebarLabel>}
                  </SidebarItem>
                  <SidebarItem href="/analytics">
                    <BarChart3 data-slot="icon" />
                    {!collapsed && <SidebarLabel>Analytics</SidebarLabel>}
                  </SidebarItem>
                  <SidebarItem href="/projects">
                    <Folder data-slot="icon" />
                    {!collapsed && <SidebarLabel>Projects</SidebarLabel>}
                  </SidebarItem>
                  <SidebarItem href="/users">
                    <Users data-slot="icon" />
                    {!collapsed && <SidebarLabel>Users</SidebarLabel>}
                  </SidebarItem>
                  <SidebarItem href="/settings">
                    <Settings data-slot="icon" />
                    {!collapsed && <SidebarLabel>Settings</SidebarLabel>}
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Collapsible Sidebar
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Click the first menu item to toggle the sidebar width.
            </p>
          </div>
        </div>
      );
    };

    return <CollapsibleSidebar />;
  },
};

/**
 * Sidebar with active state highlighting.
 *
 * Demonstrates the animated current indicator that smoothly transitions between active items.
 */
export const WithActiveState: Story = {
  render: () => {
    const ActiveStateSidebar = () => {
      const [currentPath, setCurrentPath] = useState('/dashboard');

      return (
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
          <div className="w-64">
            <Sidebar>
              <SidebarHeader>
                <SidebarSection>
                  <SidebarItem onClick={() => setCurrentPath('/')}>
                    <Home data-slot="icon" />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem
                    onClick={() => setCurrentPath('/dashboard')}
                    current={currentPath === '/dashboard'}
                  >
                    <LayoutDashboard data-slot="icon" />
                    <SidebarLabel>Dashboard</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    onClick={() => setCurrentPath('/analytics')}
                    current={currentPath === '/analytics'}
                  >
                    <BarChart3 data-slot="icon" />
                    <SidebarLabel>Analytics</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    onClick={() => setCurrentPath('/projects')}
                    current={currentPath === '/projects'}
                  >
                    <Folder data-slot="icon" />
                    <SidebarLabel>Projects</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    onClick={() => setCurrentPath('/users')}
                    current={currentPath === '/users'}
                  >
                    <Users data-slot="icon" />
                    <SidebarLabel>Users</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    onClick={() => setCurrentPath('/messages')}
                    current={currentPath === '/messages'}
                  >
                    <MessageSquare data-slot="icon" />
                    <SidebarLabel>Messages</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Active State: {currentPath}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Click different sidebar items to see the animated indicator smoothly transition.
              The indicator uses Motion's layoutId for shared element transitions.
            </p>
          </div>
        </div>
      );
    };

    return <ActiveStateSidebar />;
  },
};

/**
 * Realistic dashboard sidebar.
 *
 * A complete example showing a real-world dashboard navigation with sections, dividers, and spacer.
 */
export const DashboardSidebar: Story = {
  render: () => (
    <SidebarWrapper>
      <Sidebar>
        <SidebarHeader>
          <SidebarSection>
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="size-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Zap className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Acme Corp</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Dashboard</p>
              </div>
            </div>
          </SidebarSection>
          <SidebarDivider />
        </SidebarHeader>

        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Overview</SidebarHeading>
            <SidebarItem href="/dashboard" current>
              <LayoutDashboard data-slot="icon" />
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/analytics">
              <BarChart3 data-slot="icon" />
              <SidebarLabel>Analytics</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/reports">
              <TrendingUp data-slot="icon" />
              <SidebarLabel>Reports</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Management</SidebarHeading>
            <SidebarItem href="/projects">
              <Folder data-slot="icon" />
              <SidebarLabel>Projects</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/users">
              <Users data-slot="icon" />
              <SidebarLabel>Team Members</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/tasks">
              <Target data-slot="icon" />
              <SidebarLabel>Tasks</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Communication</SidebarHeading>
            <SidebarItem href="/messages">
              <MessageSquare data-slot="icon" />
              <SidebarLabel>Messages</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/calendar">
              <Calendar data-slot="icon" />
              <SidebarLabel>Calendar</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSpacer />

          <SidebarSection>
            <SidebarItem href="/settings">
              <Settings data-slot="icon" />
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>

        <SidebarFooter>
          <SidebarSection>
            <SidebarItem href="/profile">
              <div className="flex items-center gap-3 w-full">
                <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <User className="size-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    sarah@acme.com
                  </p>
                </div>
              </div>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    </SidebarWrapper>
  ),
};

/**
 * Documentation sidebar with categorized content.
 *
 * Example of a documentation site navigation with multiple content categories.
 */
export const DocumentationSidebar: Story = {
  render: () => (
    <SidebarWrapper>
      <Sidebar>
        <SidebarHeader>
          <SidebarSection>
            <div className="px-2 py-3">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Documentation
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">v2.0.0</p>
            </div>
          </SidebarSection>
        </SidebarHeader>

        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Getting Started</SidebarHeading>
            <SidebarItem href="/docs/introduction" current>
              <BookOpen data-slot="icon" />
              <SidebarLabel>Introduction</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/installation">
              <Package data-slot="icon" />
              <SidebarLabel>Installation</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/quickstart">
              <Zap data-slot="icon" />
              <SidebarLabel>Quick Start</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Core Concepts</SidebarHeading>
            <SidebarItem href="/docs/components">
              <Code data-slot="icon" />
              <SidebarLabel>Components</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/styling">
              <Heart data-slot="icon" />
              <SidebarLabel>Styling</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/routing">
              <Target data-slot="icon" />
              <SidebarLabel>Routing</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Advanced</SidebarHeading>
            <SidebarItem href="/docs/api">
              <Server data-slot="icon" />
              <SidebarLabel>API Reference</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/database">
              <Database data-slot="icon" />
              <SidebarLabel>Database</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/docs/deployment">
              <Cloud data-slot="icon" />
              <SidebarLabel>Deployment</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection>
            <SidebarItem href="/docs/help">
              <HelpCircle data-slot="icon" />
              <SidebarLabel>Help & Support</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
      </Sidebar>
    </SidebarWrapper>
  ),
};

/**
 * Ozean Licht themed sidebar.
 *
 * Showcases the Ozean Licht turquoise color (var(--primary)) as accent throughout the sidebar.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const TurquoiseBadge = ({ children }: { children: React.ReactNode }) => (
      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--primary)]/20">
        {children}
      </span>
    );

    return (
      <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
        <div className="w-64">
          <Sidebar>
            <SidebarHeader>
              <SidebarSection>
                <div className="flex items-center gap-3 px-2 py-3">
                  <div
                    className="size-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <svg
                      className="size-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--primary)' }}
                    >
                      Ozean Licht
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Content Platform
                    </p>
                  </div>
                </div>
              </SidebarSection>
              <SidebarDivider />
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarHeading style={{ color: 'var(--primary)' }}>
                  Main Navigation
                </SidebarHeading>
                <SidebarItem href="/dashboard" current>
                  <LayoutDashboard data-slot="icon" />
                  <SidebarLabel>Dashboard</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/content">
                  <FileText data-slot="icon" />
                  <SidebarLabel>Content</SidebarLabel>
                  <TurquoiseBadge>8 new</TurquoiseBadge>
                </SidebarItem>
                <SidebarItem href="/media">
                  <Folder data-slot="icon" />
                  <SidebarLabel>Media Library</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/analytics">
                  <BarChart3 data-slot="icon" />
                  <SidebarLabel>Analytics</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSection>
                <SidebarHeading style={{ color: 'var(--primary)' }}>
                  Community
                </SidebarHeading>
                <SidebarItem href="/members">
                  <Users data-slot="icon" />
                  <SidebarLabel>Members</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/messages">
                  <MessageSquare data-slot="icon" />
                  <SidebarLabel>Messages</SidebarLabel>
                  <TurquoiseBadge>3</TurquoiseBadge>
                </SidebarItem>
                <SidebarItem href="/events">
                  <Calendar data-slot="icon" />
                  <SidebarLabel>Events</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <SidebarItem href="/settings">
                  <Settings data-slot="icon" />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/help">
                  <HelpCircle data-slot="icon" />
                  <SidebarLabel>Help Center</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SidebarFooter>
              <SidebarSection>
                <SidebarItem href="/profile">
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="size-9 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      OL
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                        Admin User
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: 'var(--primary)' }}
                      >
                        View Profile
                      </p>
                    </div>
                  </div>
                </SidebarItem>
              </SidebarSection>
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Ozean Licht Themed Sidebar
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              This sidebar showcases the Ozean Licht turquoise brand color (var(--primary))
              applied throughout the navigation. The color is used for:
            </p>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span>Brand logo background and text accents</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span>Section headings for visual hierarchy</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span>Notification badges with transparency</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span>User profile avatar and interaction hints</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Complete sidebar showing all components.
 *
 * Comprehensive example demonstrating every sidebar component and pattern.
 */
export const CompleteExample: Story = {
  render: () => {
    const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'turquoise' | 'red' }) => (
      <span
        className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${
          variant === 'red'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : variant === 'turquoise'
            ? 'bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--primary)]/20'
            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
        }`}
      >
        {children}
      </span>
    );

    return (
      <SidebarWrapper>
        <Sidebar>
          {/* Header with branding and search */}
          <SidebarHeader>
            <SidebarSection>
              <div className="flex items-center gap-3 px-2 py-3">
                <div className="size-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[#087E78] flex items-center justify-center">
                  <Zap className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Complete UI
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    All Components
                  </p>
                </div>
              </div>
            </SidebarSection>
            <SidebarDivider />
          </SidebarHeader>

          {/* Main scrollable content */}
          <SidebarBody>
            {/* Primary navigation */}
            <SidebarSection>
              <SidebarHeading>Main</SidebarHeading>
              <SidebarItem href="/dashboard" current>
                <LayoutDashboard data-slot="icon" />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/inbox">
                <Mail data-slot="icon" />
                <SidebarLabel>Inbox</SidebarLabel>
                <Badge variant="red">12</Badge>
              </SidebarItem>
              <SidebarItem href="/notifications">
                <Bell data-slot="icon" />
                <SidebarLabel>Notifications</SidebarLabel>
                <Badge variant="turquoise">3</Badge>
              </SidebarItem>
            </SidebarSection>

            {/* Secondary navigation with icons */}
            <SidebarSection>
              <SidebarHeading>Workspace</SidebarHeading>
              <SidebarItem href="/projects">
                <Folder data-slot="icon" />
                <SidebarLabel>Projects</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/team">
                <Users data-slot="icon" />
                <SidebarLabel>Team</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <BarChart3 data-slot="icon" />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {/* Divider between sections */}
            <SidebarDivider />

            {/* Another section */}
            <SidebarSection>
              <SidebarHeading>Favorites</SidebarHeading>
              <SidebarItem href="/starred">
                <Star data-slot="icon" />
                <SidebarLabel>Starred Items</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/archive">
                <Archive data-slot="icon" />
                <SidebarLabel>Archive</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {/* Spacer pushes content below to bottom */}
            <SidebarSpacer />

            {/* Bottom section before footer */}
            <SidebarSection>
              <SidebarItem href="/settings">
                <Settings data-slot="icon" />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/help">
                <HelpCircle data-slot="icon" />
                <SidebarLabel>Help & Support</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          {/* Footer with user profile */}
          <SidebarFooter>
            <SidebarSection>
              <SidebarItem href="/profile">
                <div className="flex items-center gap-3 w-full">
                  <div className="size-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#087E78] flex items-center justify-center text-white text-sm font-semibold">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      john@example.com
                    </p>
                  </div>
                </div>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      </SidebarWrapper>
    );
  },
};
