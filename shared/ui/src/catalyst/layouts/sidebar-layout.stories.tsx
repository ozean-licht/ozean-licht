import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SidebarLayout } from './sidebar-layout';
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
} from '../navigation/sidebar';
import {
  Navbar,
  NavbarDivider,
  NavbarSection,
  NavbarSpacer,
  NavbarItem,
  NavbarLabel,
} from '../navigation/navbar';
import { Button } from '../navigation/button';

/**
 * SidebarLayout component from Catalyst UI.
 *
 * **This is a Tier 1 Primitive** - Headless UI application layout with sidebar navigation.
 * No Tier 2 branded version exists yet.
 *
 * ## Catalyst SidebarLayout Features
 * - **Responsive Design**: Desktop sidebar + mobile drawer with hamburger menu
 * - **Fixed Sidebar**: Sidebar remains fixed on desktop while content scrolls
 * - **Mobile Drawer**: Full-screen sliding drawer on mobile devices
 * - **Backdrop**: Overlay backdrop when mobile drawer is open
 * - **Focus Management**: Proper focus trap in mobile drawer
 * - **Smooth Transitions**: Animated sidebar slide and backdrop fade
 * - **Accessible**: ARIA labels and keyboard navigation support
 *
 * ## Component Structure
 * ```tsx
 * <SidebarLayout
 *   navbar={<Navbar>...</Navbar>} // Mobile navbar with hamburger menu
 *   sidebar={<Sidebar>...</Sidebar>} // Sidebar content (desktop + mobile)
 * >
 *   {children} // Main content area
 * </SidebarLayout>
 * ```
 *
 * ## Sidebar Component Composition
 * ```tsx
 * <Sidebar>
 *   <SidebarHeader> // Logo, branding
 *     <SidebarSection>
 *       <SidebarItem>Logo</SidebarItem>
 *     </SidebarSection>
 *   </SidebarHeader>
 *
 *   <SidebarBody> // Main navigation (scrollable)
 *     <SidebarSection>
 *       <SidebarHeading>Section Title</SidebarHeading>
 *       <SidebarItem href="/path" current>
 *         <Icon />
 *         <SidebarLabel>Label</SidebarLabel>
 *       </SidebarItem>
 *     </SidebarSection>
 *     <SidebarDivider />
 *     <SidebarSpacer /> // Pushes footer to bottom
 *   </SidebarBody>
 *
 *   <SidebarFooter> // User profile, settings
 *     <SidebarSection>
 *       <SidebarItem>...</SidebarItem>
 *     </SidebarSection>
 *   </SidebarFooter>
 * </Sidebar>
 * ```
 *
 * ## Use Cases
 * - Admin dashboards with navigation
 * - Application interfaces with multiple sections
 * - Documentation sites with table of contents
 * - Content management systems
 * - SaaS application layouts
 *
 * ## Responsive Behavior
 * - **Desktop (lg+)**: Fixed sidebar on left (256px), content area with padding
 * - **Mobile (<lg)**: Hidden sidebar, hamburger menu in navbar, drawer overlay
 * - **Tablet**: Same as mobile (drawer pattern)
 *
 * ## Styling Notes
 * - Desktop: Gray background (zinc-100), white content card with shadow
 * - Dark Mode: Dark backgrounds with subtle borders
 * - Mobile: Full-width content, no gray background
 * - Sidebar: Glass morphism effect, borders, and backdrop blur
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/SidebarLayout',
  component: SidebarLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application layout with fixed sidebar navigation. Built on Headless UI Dialog for mobile drawer functionality. Provides responsive desktop sidebar and mobile hamburger menu.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper Icons
function HomeIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function ChartBarIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserCircleIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Default sidebar layout with basic navigation.
 *
 * Shows the essential structure with sidebar navigation and main content area.
 */
export const Default: Story = {
  render: () => (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarLabel className="text-lg font-semibold">My App</NavbarLabel>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="flex items-center gap-3 px-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  <span className="text-lg font-bold">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">My Application</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Version 1.0</span>
                </div>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/users">
                <UsersIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <ChartBarIcon />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <CogIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <SidebarItem href="/profile">
                <UserCircleIcon />
                <SidebarLabel>Profile</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome to your application dashboard. This is the main content area.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-white">Card {i}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                This is a sample card in the main content area.
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Content Section</h2>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            The sidebar remains fixed while this content area scrolls. On mobile devices (&lt; lg breakpoint),
            the sidebar becomes a drawer accessible via the hamburger menu in the navbar.
          </p>
        </div>
      </div>
    </SidebarLayout>
  ),
};

/**
 * Dashboard layout with organized navigation sections.
 *
 * Demonstrates multiple navigation sections with headings and dividers.
 */
export const DashboardLayout: Story = {
  render: () => (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarLabel className="text-lg font-semibold">Admin Dashboard</NavbarLabel>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem>
              <SearchIcon />
            </NavbarItem>
            <NavbarItem>
              <BellIcon />
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="flex items-center gap-3 px-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <span className="text-lg font-bold">AD</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">Admin Portal</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">admin@example.com</span>
                </div>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Main</SidebarHeading>
              <SidebarItem href="/" current>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <ChartBarIcon />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarDivider />

            <SidebarSection>
              <SidebarHeading>Management</SidebarHeading>
              <SidebarItem href="/users">
                <UsersIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/documents">
                <DocumentIcon />
                <SidebarLabel>Documents</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/settings">
                <CogIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <SidebarItem href="/profile">
                <UserCircleIcon />
                <SidebarLabel>John Doe</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-white">Dashboard Overview</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Monitor your key metrics and recent activity
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: '2,847', change: '+12.3%' },
            { label: 'Revenue', value: '$45,231', change: '+8.1%' },
            { label: 'Active Sessions', value: '1,234', change: '+5.2%' },
            { label: 'Conversion Rate', value: '3.24%', change: '-0.4%' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.label}</div>
              <div className="mt-2 text-3xl font-bold text-zinc-950 dark:text-white">{metric.value}</div>
              <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4 border-b border-zinc-100 pb-4 last:border-0 dark:border-zinc-800">
                <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <UserCircleIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-950 dark:text-white">
                    New user registration
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    user{i}@example.com · {i} hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  ),
};

/**
 * Collapsible sidebar sections with nested navigation.
 *
 * Shows how to build expandable navigation groups using button items.
 */
export const CollapsibleSidebar: Story = {
  render: () => {
    const CollapsibleExample = () => {
      const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        management: true,
        reports: false,
      });

      const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
      };

      function ChevronDownIcon() {
        return (
          <svg data-slot="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        );
      }

      return (
        <SidebarLayout
          navbar={
            <Navbar>
              <NavbarSection>
                <NavbarLabel className="text-lg font-semibold">App</NavbarLabel>
              </NavbarSection>
            </Navbar>
          }
          sidebar={
            <Sidebar>
              <SidebarHeader>
                <SidebarSection>
                  <div className="px-2 py-2">
                    <span className="text-lg font-bold text-zinc-950 dark:text-white">Company</span>
                  </div>
                </SidebarSection>
              </SidebarHeader>

              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/" current>
                    <HomeIcon />
                    <SidebarLabel>Dashboard</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/analytics">
                    <ChartBarIcon />
                    <SidebarLabel>Analytics</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>

                <SidebarDivider />

                <SidebarSection>
                  <SidebarItem onClick={() => toggleSection('management')}>
                    <UsersIcon />
                    <SidebarLabel>Management</SidebarLabel>
                    <div
                      className="transition-transform duration-200"
                      style={{ transform: openSections.management ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <ChevronDownIcon />
                    </div>
                  </SidebarItem>
                  {openSections.management && (
                    <div className="ml-4 space-y-0.5 border-l border-zinc-200 pl-4 dark:border-zinc-700">
                      <SidebarItem href="/users">
                        <SidebarLabel>Users</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem href="/teams">
                        <SidebarLabel>Teams</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem href="/roles">
                        <SidebarLabel>Roles</SidebarLabel>
                      </SidebarItem>
                    </div>
                  )}
                </SidebarSection>

                <SidebarSection>
                  <SidebarItem onClick={() => toggleSection('reports')}>
                    <DocumentIcon />
                    <SidebarLabel>Reports</SidebarLabel>
                    <div
                      className="transition-transform duration-200"
                      style={{ transform: openSections.reports ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <ChevronDownIcon />
                    </div>
                  </SidebarItem>
                  {openSections.reports && (
                    <div className="ml-4 space-y-0.5 border-l border-zinc-200 pl-4 dark:border-zinc-700">
                      <SidebarItem href="/reports/sales">
                        <SidebarLabel>Sales</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem href="/reports/traffic">
                        <SidebarLabel>Traffic</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem href="/reports/revenue">
                        <SidebarLabel>Revenue</SidebarLabel>
                      </SidebarItem>
                    </div>
                  )}
                </SidebarSection>

                <SidebarSpacer />

                <SidebarSection>
                  <SidebarItem href="/settings">
                    <CogIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>

              <SidebarFooter>
                <SidebarSection>
                  <SidebarItem href="/profile">
                    <UserCircleIcon />
                    <SidebarLabel>Account</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarFooter>
            </Sidebar>
          }
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
                Collapsible Navigation Example
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Click on "Management" or "Reports" in the sidebar to expand/collapse sections.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                This demonstrates how to implement collapsible sections in the sidebar using button items
                with onClick handlers and conditional rendering.
              </p>
            </div>
          </div>
        </SidebarLayout>
      );
    };

    return <CollapsibleExample />;
  },
};

/**
 * Mobile responsive demonstration.
 *
 * Best viewed by resizing browser window to see mobile drawer behavior.
 */
export const MobileResponsive: Story = {
  render: () => (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarLabel className="text-lg font-semibold">Mobile Demo</NavbarLabel>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Resize to see mobile drawer
            </span>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="px-2 py-2">
                <span className="text-lg font-bold text-zinc-950 dark:text-white">
                  Responsive App
                </span>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/users">
                <UsersIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <ChartBarIcon />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/documents">
                <DocumentIcon />
                <SidebarLabel>Documents</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <CogIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <SidebarItem href="/profile">
                <UserCircleIcon />
                <SidebarLabel>Profile</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Responsive Behavior Guide
          </h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              <strong>Desktop (≥1024px):</strong> Fixed sidebar visible on the left, content area has gray
              background with white card container.
            </p>
            <p>
              <strong>Mobile (&lt;1024px):</strong> Sidebar hidden, hamburger menu icon appears in navbar.
              Click hamburger to open sliding drawer from left with backdrop overlay.
            </p>
            <p>
              <strong>Interactions:</strong> On mobile, click outside drawer or press Escape to close. Click
              any sidebar link to close drawer automatically.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-white">Content Card {i}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Example content to demonstrate scrolling behavior.
              </p>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  ),
};

/**
 * Layout with rich navbar components.
 *
 * Shows how to compose navbar with search, notifications, and user menu.
 */
export const WithNavbar: Story = {
  render: () => (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem>
              <SearchIcon />
            </NavbarItem>
            <NavbarDivider />
            <NavbarLabel>Dashboard</NavbarLabel>
          </NavbarSection>

          <NavbarSpacer />

          <NavbarSection>
            <NavbarItem>
              <BellIcon />
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem>
              <UserCircleIcon />
              <NavbarLabel className="max-lg:hidden">John Doe</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="flex items-center gap-3 px-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <span className="text-lg font-bold">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">Business App</span>
                </div>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/users">
                <UsersIcon />
                <SidebarLabel>Team</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <ChartBarIcon />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <CogIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Rich Navbar Example</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Navbar with multiple sections, icons, dividers, and labels
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Navbar Components Used</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>
              <strong>NavbarSection:</strong> Groups related items
            </li>
            <li>
              <strong>NavbarItem:</strong> Interactive buttons/links with icons
            </li>
            <li>
              <strong>NavbarLabel:</strong> Text labels (hidden on mobile with max-lg:hidden)
            </li>
            <li>
              <strong>NavbarDivider:</strong> Visual separators between sections
            </li>
            <li>
              <strong>NavbarSpacer:</strong> Pushes items to opposite ends
            </li>
          </ul>
        </div>
      </div>
    </SidebarLayout>
  ),
};

/**
 * Layout with breadcrumbs and page header.
 *
 * Shows common dashboard pattern with navigation breadcrumbs.
 */
export const WithBreadcrumbs: Story = {
  render: () => (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarLabel className="text-lg font-semibold">App</NavbarLabel>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="px-2 py-2">
                <span className="text-lg font-bold text-zinc-950 dark:text-white">App Name</span>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/users" current>
                <UsersIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <ChartBarIcon />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <CogIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <SidebarItem href="/profile">
                <UserCircleIcon />
                <SidebarLabel>Profile</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="/" className="hover:text-zinc-950 dark:hover:text-white">
            Home
          </a>
          <span>/</span>
          <a href="/users" className="hover:text-zinc-950 dark:hover:text-white">
            Users
          </a>
          <span>/</span>
          <span className="font-medium text-zinc-950 dark:text-white">John Doe</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950 dark:text-white">John Doe</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              john.doe@example.com · Joined Jan 2024
            </p>
          </div>
          <div className="flex gap-2">
            <Button outline>Edit</Button>
            <Button color="red">Delete</Button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="-mb-px flex space-x-8">
            {['Overview', 'Activity', 'Settings', 'Permissions'].map((tab, i) => (
              <a
                key={tab}
                href="#"
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                  i === 0
                    ? 'border-zinc-950 text-zinc-950 dark:border-white dark:text-white'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {tab}
              </a>
            ))}
          </nav>
        </div>

        {/* User Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">User Information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { label: 'Full Name', value: 'John Doe' },
                { label: 'Email', value: 'john.doe@example.com' },
                { label: 'Role', value: 'Administrator' },
                { label: 'Status', value: 'Active' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">{item.label}</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Recent Activity</h2>
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <DocumentIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-950 dark:text-white">Updated profile settings</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  ),
};

/**
 * Ozean Licht themed sidebar layout.
 *
 * Demonstrates Ozean Licht branding with turquoise accents (var(--primary)).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="dark">
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSection>
              <NavbarLabel className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                Ozean Licht
              </NavbarLabel>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem>
                <SearchIcon />
              </NavbarItem>
              <NavbarItem>
                <BellIcon />
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <SidebarSection>
                <div className="flex items-center gap-3 px-2">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <span className="text-lg font-bold">OL</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Ozean Licht</span>
                    <span className="text-xs text-zinc-400">Admin Portal</span>
                  </div>
                </div>
              </SidebarSection>
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarHeading>Navigation</SidebarHeading>
                <SidebarItem href="/" current>
                  <HomeIcon />
                  <SidebarLabel>Dashboard</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/content">
                  <DocumentIcon />
                  <SidebarLabel>Content</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/community">
                  <UsersIcon />
                  <SidebarLabel>Community</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/analytics">
                  <ChartBarIcon />
                  <SidebarLabel>Analytics</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarDivider />

              <SidebarSection>
                <SidebarHeading>Kids Ascension</SidebarHeading>
                <SidebarItem href="/kids/courses">
                  <DocumentIcon />
                  <SidebarLabel>Courses</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/kids/students">
                  <UsersIcon />
                  <SidebarLabel>Students</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <SidebarItem href="/settings">
                  <CogIcon />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SidebarFooter>
              <SidebarSection>
                <SidebarItem href="/profile">
                  <UserCircleIcon />
                  <SidebarLabel>Admin User</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarFooter>
          </Sidebar>
        }
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div
            className="relative overflow-hidden rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #087E78 100%)',
            }}
          >
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white">Welcome to Ozean Licht</h1>
              <p className="mt-2 text-white/90">
                Multi-tenant platform for Austrian associations
              </p>
              <div className="mt-6">
                <Button color="white">Get Started</Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Total Content', value: '1,247', icon: DocumentIcon },
              { label: 'Active Users', value: '3,892', icon: UsersIcon },
              { label: 'Page Views', value: '52,847', icon: ChartBarIcon },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'rgba(14, 194, 188, 0.1)' }}
                  >
                    <stat.icon />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Content</h2>
              <button
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                View all
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="group rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-[var(--primary)]/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Article Title {i}</h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Brief description of the content item goes here...
                      </p>
                    </div>
                    <button
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: 'var(--primary)' }}
                    >
                      →
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                    <span>Published {i} days ago</span>
                    <span>·</span>
                    <span>42 views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  ),
};
