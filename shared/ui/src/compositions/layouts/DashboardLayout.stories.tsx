import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from './DashboardLayout';
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarHeading,
  SidebarDivider,
  SidebarSpacer,
} from '../../catalyst/navigation/sidebar';
import {
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarLabel,
  NavbarSpacer,
  NavbarDivider,
} from '../../catalyst/navigation/navbar';

/**
 * DashboardLayout is a complete admin dashboard layout composition featuring:
 * - Catalyst SidebarLayout for responsive sidebar behavior
 * - Desktop: Fixed sidebar with main content area
 * - Mobile: Collapsible drawer sidebar with hamburger menu
 * - Navbar integration for mobile header
 * - Glass morphism styling with Ozean Licht branding
 *
 * ## Features
 * - Responsive sidebar (fixed on desktop, drawer on mobile)
 * - Configurable navbar for mobile header
 * - Glass card styling with backdrop blur
 * - Primary color accents (#0ec2bc turquoise)
 * - Full-height layout with overflow handling
 * - Flexible content area with max-width container
 * - Seamless integration with Catalyst UI components
 *
 * ## Usage
 * ```tsx
 * <DashboardLayout
 *   sidebar={
 *     <Sidebar>
 *       <SidebarHeader>
 *         <SidebarSection>
 *           <SidebarItem href="/dashboard">
 *             <HomeIcon />
 *             <SidebarLabel>Dashboard</SidebarLabel>
 *           </SidebarItem>
 *         </SidebarSection>
 *       </SidebarHeader>
 *     </Sidebar>
 *   }
 *   navbar={
 *     <Navbar>
 *       <NavbarSection>
 *         <NavbarItem href="/notifications">
 *           <BellIcon />
 *         </NavbarItem>
 *       </NavbarSection>
 *     </Navbar>
 *   }
 * >
 *   <YourPageContent />
 * </DashboardLayout>
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Layouts/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete dashboard layout with responsive sidebar navigation, navbar, and main content area. Built with Catalyst SidebarLayout and optimized for admin interfaces.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Main content area (page content)',
    },
    sidebar: {
      control: false,
      description: 'Sidebar navigation component (ReactNode)',
    },
    navbar: {
      control: false,
      description: 'Navbar component for mobile header (ReactNode)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the layout wrapper',
    },
  },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample Icons (SVG components)
const HomeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const UsersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
  </svg>
);

const ChartIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
  </svg>
);

const CogIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
  </svg>
);

const BellIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon">
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
  </svg>
);

// Reusable Demo Components
function DemoSidebar({ withFooter = true, currentPath = '/dashboard' }: { withFooter?: boolean; currentPath?: string }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSection>
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-lg font-bold text-primary">OL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Ozean Licht</span>
              <span className="text-xs text-zinc-400">Admin Dashboard</span>
            </div>
          </div>
        </SidebarSection>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/dashboard" current={currentPath === '/dashboard'}>
            {HomeIcon}
            <SidebarLabel>Dashboard</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/users" current={currentPath === '/users'}>
            {UsersIcon}
            <SidebarLabel>Users</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/analytics" current={currentPath === '/analytics'}>
            {ChartIcon}
            <SidebarLabel>Analytics</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/content" current={currentPath === '/content'}>
            {DocumentIcon}
            <SidebarLabel>Content</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarDivider />

        <SidebarSection>
          <SidebarHeading>Administration</SidebarHeading>
          <SidebarItem href="/settings">
            {CogIcon}
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSpacer />
      </SidebarBody>

      {withFooter && (
        <SidebarFooter>
          <SidebarSection>
            <div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                AU
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-medium text-white">Admin User</span>
                <span className="text-xs text-zinc-400">admin@ozean-licht.dev</span>
              </div>
            </div>
          </SidebarSection>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

function DemoNavbar() {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/search" aria-label="Search">
          {SearchIcon}
        </NavbarItem>
        <NavbarItem href="/notifications" aria-label="Notifications">
          {BellIcon}
        </NavbarItem>
        <NavbarDivider />
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
          <span className="text-xs font-semibold text-primary">AU</span>
        </div>
      </NavbarSection>
    </Navbar>
  );
}

function DemoContent({ title = 'Dashboard', description = 'Welcome to your admin dashboard' }: { title?: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">1,234</p>
          <p className="mt-2 text-sm text-primary">+12% from last month</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Sessions</h3>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">567</p>
          <p className="mt-2 text-sm text-primary">+8% from last month</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">€45,231</p>
          <p className="mt-2 text-sm text-primary">+23% from last month</p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {[
            { user: 'Anna Schmidt', action: 'Registered for course', time: '2 minutes ago' },
            { user: 'Max Weber', action: 'Completed meditation session', time: '15 minutes ago' },
            { user: 'Lisa Müller', action: 'Updated profile', time: '1 hour ago' },
            { user: 'Peter Klein', action: 'Shared content', time: '2 hours ago' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-zinc-200 pb-3 last:border-0 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{item.user}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.action}</p>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Complete dashboard with sidebar, navbar, and content
 */
export const Default: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <DemoContent />
    </DashboardLayout>
  ),
};

/**
 * Dashboard with only sidebar (no navbar)
 */
export const SidebarOnly: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />}>
      <DemoContent title="Sidebar Only Layout" description="Dashboard layout with sidebar but without navbar component" />
    </DashboardLayout>
  ),
};

/**
 * Dashboard without footer in sidebar
 */
export const NoSidebarFooter: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar withFooter={false} />} navbar={<DemoNavbar />}>
      <DemoContent title="No Footer" description="Sidebar without footer section for simpler layouts" />
    </DashboardLayout>
  ),
};

/**
 * Users page with active navigation
 */
export const UsersPage: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar currentPath="/users" />} navbar={<DemoNavbar />}>
      <DemoContent
        title="User Management"
        description="Manage all users, permissions, and access controls from this dashboard"
      />
    </DashboardLayout>
  ),
};

/**
 * Analytics page with active navigation
 */
export const AnalyticsPage: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar currentPath="/analytics" />} navbar={<DemoNavbar />}>
      <DemoContent
        title="Analytics Dashboard"
        description="Track key metrics, user behavior, and platform performance"
      />
    </DashboardLayout>
  ),
};

/**
 * Content management page
 */
export const ContentPage: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar currentPath="/content" />} navbar={<DemoNavbar />}>
      <DemoContent
        title="Content Management"
        description="Create, edit, and publish content across all platforms"
      />
    </DashboardLayout>
  ),
};

/**
 * Dashboard with minimal content
 */
export const MinimalContent: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Minimal Page</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This demonstrates the layout with minimal content.
        </p>
      </div>
    </DashboardLayout>
  ),
};

/**
 * Dashboard with long scrollable content
 */
export const LongContent: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Long Scrollable Content</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This demonstrates how the layout handles long content with scrolling.
          </p>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Section {i + 1}</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Metric 1</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{Math.floor(Math.random() * 1000)}</p>
              </div>
              <div className="rounded border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Metric 2</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{Math.floor(Math.random() * 1000)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  ),
};

/**
 * Dashboard with custom styling
 */
export const CustomStyled: Story = {
  render: () => (
    <DashboardLayout
      sidebar={<DemoSidebar />}
      navbar={<DemoNavbar />}
      className="bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]"
    >
      <DemoContent
        title="Custom Styled Layout"
        description="Dashboard with custom cosmic gradient background"
      />
    </DashboardLayout>
  ),
};

/**
 * Empty dashboard (no content)
 */
export const EmptyState: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">No Content Yet</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Start by adding your content here</p>
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
            Get Started
          </button>
        </div>
      </div>
    </DashboardLayout>
  ),
};

/**
 * Dashboard with simple sidebar (no sections)
 */
export const SimpleSidebar: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <div className="px-2 py-4">
                <h1 className="text-lg font-bold text-white">Simple Layout</h1>
              </div>
              <SidebarDivider />
              <SidebarItem href="/dashboard" current>
                {HomeIcon}
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                {CogIcon}
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
      navbar={<DemoNavbar />}
    >
      <DemoContent title="Simple Sidebar" description="Minimal sidebar with just a few navigation items" />
    </DashboardLayout>
  ),
};

/**
 * Mobile viewport demonstration
 */
export const MobileView: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <DemoContent title="Mobile Layout" description="Resize to mobile viewport to see drawer sidebar behavior" />
    </DashboardLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'On mobile viewports (< 1024px), the sidebar becomes a drawer that opens via hamburger menu. The navbar appears in the mobile header.',
      },
    },
  },
};

/**
 * Tablet viewport demonstration
 */
export const TabletView: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <DemoContent title="Tablet Layout" description="Tablet viewport still uses drawer sidebar" />
    </DashboardLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Kids Ascension branded dashboard
 */
export const KidsAscension: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="flex items-center gap-3 px-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <span className="text-lg font-bold text-blue-500">KA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Kids Ascension</span>
                  <span className="text-xs text-zinc-400">Learning Platform</span>
                </div>
              </div>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard" current>
                {HomeIcon}
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/students">
                {UsersIcon}
                <SidebarLabel>Students</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/courses">
                {DocumentIcon}
                <SidebarLabel>Courses</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
      navbar={<DemoNavbar />}
    >
      <DemoContent
        title="Kids Ascension Dashboard"
        description="Educational platform administration for young learners"
      />
    </DashboardLayout>
  ),
};

/**
 * Ozean Licht branded dashboard with cosmic theme
 */
export const OzeanLichtCosmic: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
      <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
        <DemoContent
          title="Ozean Licht Dashboard"
          description="Spiritual content platform with cosmic design"
        />
      </DashboardLayout>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
};

/**
 * Dashboard with all navigation states
 */
export const AllNavigationStates: Story = {
  render: () => (
    <div className="space-y-8 bg-zinc-100 p-8 dark:bg-zinc-950">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Dashboard Page (Current)</h2>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <DashboardLayout sidebar={<DemoSidebar currentPath="/dashboard" />} navbar={<DemoNavbar />}>
            <div className="py-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Active</h1>
            </div>
          </DashboardLayout>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Users Page (Current)</h2>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <DashboardLayout sidebar={<DemoSidebar currentPath="/users" />} navbar={<DemoNavbar />}>
            <div className="py-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Users Active</h1>
            </div>
          </DashboardLayout>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Analytics Page (Current)</h2>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <DashboardLayout sidebar={<DemoSidebar currentPath="/analytics" />} navbar={<DemoNavbar />}>
            <div className="py-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics Active</h1>
            </div>
          </DashboardLayout>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Comparison of different sidebar configurations
 */
export const SidebarVariants: Story = {
  render: () => (
    <div className="space-y-8 bg-zinc-100 p-8 dark:bg-zinc-950">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">With Footer</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <DashboardLayout sidebar={<DemoSidebar withFooter={true} />} navbar={<DemoNavbar />}>
            <div className="py-8">
              <p className="text-zinc-600 dark:text-zinc-400">Sidebar with user dropdown in footer</p>
            </div>
          </DashboardLayout>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Without Footer</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <DashboardLayout sidebar={<DemoSidebar withFooter={false} />} navbar={<DemoNavbar />}>
            <div className="py-8">
              <p className="text-zinc-600 dark:text-zinc-400">Sidebar without footer section</p>
            </div>
          </DashboardLayout>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Responsive preview across all breakpoints
 */
export const ResponsiveBreakpoints: Story = {
  render: () => (
    <DashboardLayout sidebar={<DemoSidebar />} navbar={<DemoNavbar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Responsive Layout</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Resize your browser to see how the layout adapts across breakpoints:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Mobile (&lt; 1024px):</strong> Drawer sidebar with hamburger menu</li>
            <li><strong>Desktop (≥ 1024px):</strong> Fixed sidebar always visible</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Breakpoint</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="lg:hidden">Mobile/Tablet</span>
              <span className="hidden lg:inline">Desktop</span>
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sidebar Mode</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="lg:hidden">Drawer</span>
              <span className="hidden lg:inline">Fixed</span>
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Navigation</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              <span className="lg:hidden">Mobile Header</span>
              <span className="hidden lg:inline">Desktop Navbar</span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  ),
};
