import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Navbar,
  NavbarDivider,
  NavbarSection,
  NavbarSpacer,
  NavbarItem,
  NavbarLabel,
} from './navbar';

/**
 * Catalyst Navbar - Horizontal navigation bar component
 *
 * **This is a Tier 1 Primitive** - Catalyst UI horizontal navigation built on Headless UI.
 * No Tier 2 branded version exists yet.
 *
 * ## Headless UI Features
 * - **Accessible**: Full keyboard navigation support
 * - **Responsive**: Built-in mobile-responsive patterns
 * - **Flexible Layout**: Composable sections with dividers and spacers
 * - **Active States**: Visual current page indicator with animated underline
 * - **Touch Optimized**: Expanded hit areas for mobile devices
 * - **Motion**: Framer Motion for smooth active state transitions
 *
 * ## Component Structure
 * ```tsx
 * // Root container - flex layout
 * <Navbar>
 *   // Group related items (uses LayoutGroup for animations)
 *   <NavbarSection>
 *     // Nav link or button
 *     <NavbarItem href="/">
 *       // Text label (truncates)
 *       <NavbarLabel>Home</NavbarLabel>
 *     </NavbarItem>
 *     // Visual separator
 *     <NavbarDivider />
 *   </NavbarSection>
 *   // Pushes content to opposite side
 *   <NavbarSpacer />
 *   <NavbarSection>
 *     // User menu, search, etc.
 *   </NavbarSection>
 * </Navbar>
 * ```
 *
 * ## Key Components
 * - **Navbar**: Main navigation container with flex layout
 * - **NavbarSection**: Groups related nav items (LayoutGroup for animations)
 * - **NavbarItem**: Navigation link or button (href prop for links)
 *   - Accepts `current` prop to show active state
 *   - Renders as Link (href) or Button (no href)
 *   - Includes TouchTarget for mobile accessibility
 * - **NavbarLabel**: Text label with truncation
 * - **NavbarSpacer**: Flex spacer to push content apart
 * - **NavbarDivider**: Vertical separator line
 *
 * ## Active State
 * NavbarItems with `current={true}` display an animated bottom border indicator
 * using Framer Motion's layoutId for smooth transitions between pages.
 *
 * ## Ozean Licht Branding
 * NavbarItem includes Ozean Licht theme by default:
 * - Primary color (#0ec2bc) for hover/active states
 * - White text on dark backgrounds
 * - Subtle glow effect on active indicator
 * - Glass morphism hover effects
 *
 * ## Use Cases
 * - Application header navigation
 * - Dashboard navigation bars
 * - Marketing website headers
 * - Admin panel navigation
 * - Multi-section navigation with user menus
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullwidth',
    docs: {
      description: {
        component: 'A flexible horizontal navigation bar built on Headless UI with Framer Motion animations. Supports links, buttons, sections, dividers, and active state indicators.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-zinc-900 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Icons for examples (simple SVG)
const HomeIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 0 .75.75H13a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
  </svg>
);

const UserIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
);

const SearchIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
    />
  </svg>
);

const BellIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 5a4 4 0 0 0-8 0v2.379a1.5 1.5 0 0 1-.44 1.06L2.294 9.707a1 1 0 0 0-.293.707V11a1 1 0 0 0 1 1h2a3 3 0 1 0 6 0h2a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707L12.44 8.44a1.5 1.5 0 0 1-.44-1.061V5Z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
    />
  </svg>
);

const CogIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.111.644l-1.426 1.155a5.037 5.037 0 0 1 0 1.694l1.426 1.155a.5.5 0 0 1 .111.644l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.45.333-.946.609-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .111-.644l1.426-1.155a5.037 5.037 0 0 1 0-1.694L1.525 5.094a.5.5 0 0 1-.111-.644l1.047-1.814a.5.5 0 0 1 .639-.206l1.703.768c.45-.333.946-.609 1.466-.847l.186-1.858ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </svg>
);

/**
 * Basic navbar with simple navigation links.
 *
 * Demonstrates the minimal navbar structure with a few links.
 */
export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/" current>
          <NavbarLabel>Home</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/about">
          <NavbarLabel>About</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/contact">
          <NavbarLabel>Contact</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Navbar with logo on the left.
 *
 * Common pattern: logo + navigation links.
 */
export const WithLogo: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">
          <div className="text-xl font-bold text-primary">Ozean Licht</div>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/dashboard" current>
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/team">
          <NavbarLabel>Team</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Navbar with user menu on the right.
 *
 * Uses NavbarSpacer to push user menu to the right side.
 */
export const WithUserMenu: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/" current>
          <HomeIcon />
          <NavbarLabel>Home</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/dashboard">
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/notifications">
          <BellIcon />
        </NavbarItem>
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/profile">
          <UserIcon />
          <NavbarLabel>Profile</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Navbar with search functionality.
 *
 * Demonstrates navbar with search button/input.
 */
export const WithSearch: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">
          <div className="text-lg font-bold text-primary">Ozean Licht</div>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem onClick={() => alert('Open search')}>
          <SearchIcon />
          <NavbarLabel>Search</NavbarLabel>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/notifications">
          <BellIcon />
        </NavbarItem>
        <NavbarItem href="/profile">
          <UserIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Mobile responsive navbar.
 *
 * Shows how navbar adapts for mobile with icon-only items.
 * Demonstrates common mobile pattern with hamburger menu.
 */
export const MobileResponsive: Story = {
  render: () => {
    const MobileNavbar = () => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      return (
        <>
          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
                </svg>
                <span className="sm:hidden">
                  <NavbarLabel>Menu</NavbarLabel>
                </span>
              </NavbarItem>
              <NavbarItem href="/">
                <div className="font-bold text-primary">OL</div>
              </NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem href="/search">
                <SearchIcon />
              </NavbarItem>
              <NavbarItem href="/profile">
                <UserIcon />
              </NavbarItem>
            </NavbarSection>
          </Navbar>
          {mobileMenuOpen && (
            <div className="mt-2 p-4 bg-zinc-800 rounded-lg">
              <nav className="flex flex-col gap-2">
                <a href="/" className="text-white hover:text-primary p-2">Home</a>
                <a href="/dashboard" className="text-white hover:text-primary p-2">Dashboard</a>
                <a href="/projects" className="text-white hover:text-primary p-2">Projects</a>
                <a href="/settings" className="text-white hover:text-primary p-2">Settings</a>
              </nav>
            </div>
          )}
        </>
      );
    };

    return <MobileNavbar />;
  },
};

/**
 * Dashboard navbar with multiple sections.
 *
 * Complex navbar for admin dashboards with grouped navigation.
 */
export const DashboardNavbar: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/dashboard">
          <div className="text-lg font-bold text-primary">Admin</div>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/dashboard" current>
          <HomeIcon />
          <NavbarLabel>Overview</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/analytics">
          <NavbarLabel>Analytics</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/users">
          <UserIcon />
          <NavbarLabel>Users</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/notifications">
          <BellIcon />
          <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            3
          </span>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarItem href="/profile">
          <UserIcon />
          <NavbarLabel>John Doe</NavbarLabel>
          <ChevronDownIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Marketing website navbar.
 *
 * Clean, minimal navbar for marketing sites with CTA.
 */
export const MarketingNavbar: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OL</span>
            </div>
            <span className="text-lg font-bold text-white">Ozean Licht</span>
          </div>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/features">
          <NavbarLabel>Features</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/pricing">
          <NavbarLabel>Pricing</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/docs">
          <NavbarLabel>Docs</NavbarLabel>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/login">
          <NavbarLabel>Login</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/signup">
          <div className="px-3 py-1.5 bg-primary text-white rounded-lg font-medium text-sm">
            Sign Up
          </div>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Navbar with dropdown menu (button variant).
 *
 * Shows NavbarItem as button for dropdown triggers.
 */
export const WithDropdown: Story = {
  render: () => {
    const DropdownNavbar = () => {
      const [productsOpen, setProductsOpen] = useState(false);

      return (
        <div className="relative">
          <Navbar>
            <NavbarSection>
              <NavbarItem href="/">
                <NavbarLabel>Home</NavbarLabel>
              </NavbarItem>
              <NavbarItem onClick={() => setProductsOpen(!productsOpen)}>
                <NavbarLabel>Products</NavbarLabel>
                <ChevronDownIcon />
              </NavbarItem>
              <NavbarItem href="/about">
                <NavbarLabel>About</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/contact">
                <NavbarLabel>Contact</NavbarLabel>
              </NavbarItem>
            </NavbarSection>
          </Navbar>
          {productsOpen && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-zinc-800 rounded-lg shadow-lg min-w-[200px]">
              <div className="flex flex-col gap-2">
                <a href="/products/software" className="text-white hover:text-primary p-2 rounded hover:bg-zinc-700">
                  Software
                </a>
                <a href="/products/hardware" className="text-white hover:text-primary p-2 rounded hover:bg-zinc-700">
                  Hardware
                </a>
                <a href="/products/services" className="text-white hover:text-primary p-2 rounded hover:bg-zinc-700">
                  Services
                </a>
              </div>
            </div>
          )}
        </div>
      );
    };

    return <DropdownNavbar />;
  },
};

/**
 * Navbar with dividers between items.
 *
 * Visual separation between navigation groups.
 */
export const WithDividers: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">
          <div className="text-lg font-bold text-primary">Brand</div>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/dashboard" current>
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/team">
          <NavbarLabel>Team</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/profile">
          <UserIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Icon-only navbar items.
 *
 * Compact navbar with only icons, no labels.
 */
export const IconOnly: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/" current>
          <HomeIcon />
        </NavbarItem>
        <NavbarItem href="/search">
          <SearchIcon />
        </NavbarItem>
        <NavbarItem href="/notifications">
          <BellIcon />
        </NavbarItem>
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarItem href="/profile">
          <UserIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Full-featured navbar with all elements.
 *
 * Comprehensive example showing all navbar capabilities.
 */
export const FullFeatured: Story = {
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OL</span>
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">Ozean Licht</span>
          </div>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/dashboard" current>
          <HomeIcon />
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/team">
          <UserIcon />
          <NavbarLabel>Team</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem onClick={() => alert('Search')}>
          <SearchIcon />
        </NavbarItem>
        <NavbarItem href="/notifications">
          <BellIcon />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            5
          </span>
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarItem href="/profile">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <NavbarLabel>John Doe</NavbarLabel>
          <ChevronDownIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Ozean Licht themed navbar.
 *
 * Demonstrates Ozean Licht branding with turquoise accent (#0ec2bc).
 * Shows the built-in styling that comes with NavbarItem.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-4">
      <Navbar>
        <NavbarSection>
          <NavbarItem href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-subtle">
                <span className="text-white font-bold">OL</span>
              </div>
              <span className="text-xl font-bold text-white">Ozean Licht</span>
            </div>
          </NavbarItem>
          <NavbarDivider />
          <NavbarItem href="/home" current>
            <HomeIcon />
            <NavbarLabel>Home</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/explore">
            <NavbarLabel>Explore</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/community">
            <UserIcon />
            <NavbarLabel>Community</NavbarLabel>
          </NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/search">
            <SearchIcon />
          </NavbarItem>
          <NavbarDivider />
          <NavbarItem href="/profile">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center glow-subtle">
              <span className="text-white text-sm font-bold">You</span>
            </div>
            <ChevronDownIcon />
          </NavbarItem>
        </NavbarSection>
      </Navbar>

      <div className="text-white/60 text-sm space-y-1 p-4 bg-zinc-800 rounded-lg">
        <p className="font-semibold text-white mb-2">Ozean Licht Theme Notes:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Primary color: #0ec2bc (turquoise)</li>
          <li>Hover state: primary/10 background with primary icon color</li>
          <li>Active state: primary/15 background with animated bottom border</li>
          <li>Active indicator has subtle glow effect (glow-subtle class)</li>
          <li>White text on dark backgrounds for high contrast</li>
          <li>Smooth transitions with Framer Motion layoutId</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Interactive state demo.
 *
 * Demonstrates programmatic active state control.
 */
export const InteractiveState: Story = {
  render: () => {
    const InteractiveNavbar = () => {
      const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'team' | 'settings'>('home');

      return (
        <div className="space-y-4">
          <Navbar>
            <NavbarSection>
              <NavbarItem href="/home" current={currentPage === 'home'} onClick={() => setCurrentPage('home')}>
                <HomeIcon />
                <NavbarLabel>Home</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/projects" current={currentPage === 'projects'} onClick={() => setCurrentPage('projects')}>
                <NavbarLabel>Projects</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/team" current={currentPage === 'team'} onClick={() => setCurrentPage('team')}>
                <UserIcon />
                <NavbarLabel>Team</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/settings" current={currentPage === 'settings'} onClick={() => setCurrentPage('settings')}>
                <CogIcon />
                <NavbarLabel>Settings</NavbarLabel>
              </NavbarItem>
            </NavbarSection>
          </Navbar>

          <div className="text-white text-sm p-4 bg-zinc-800 rounded-lg">
            <p>Current page: <span className="text-primary font-semibold">{currentPage}</span></p>
            <p className="text-white/60 mt-2">
              Click nav items to see the active state indicator animate smoothly between items.
            </p>
          </div>
        </div>
      );
    };

    return <InteractiveNavbar />;
  },
};

/**
 * Multi-level navigation.
 *
 * Shows how to create hierarchical navigation with nested sections.
 */
export const MultiLevel: Story = {
  render: () => (
    <div className="space-y-2">
      <Navbar>
        <NavbarSection>
          <NavbarItem href="/">
            <div className="text-lg font-bold text-primary">Ozean Licht</div>
          </NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/docs">
            <NavbarLabel>Docs</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/api">
            <NavbarLabel>API</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/community">
            <NavbarLabel>Community</NavbarLabel>
          </NavbarItem>
        </NavbarSection>
      </Navbar>

      {/* Secondary navigation bar */}
      <Navbar>
        <NavbarSection>
          <NavbarItem href="/docs/getting-started" current>
            <NavbarLabel>Getting Started</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/docs/components">
            <NavbarLabel>Components</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/docs/guides">
            <NavbarLabel>Guides</NavbarLabel>
          </NavbarItem>
          <NavbarItem href="/docs/api-reference">
            <NavbarLabel>API Reference</NavbarLabel>
          </NavbarItem>
        </NavbarSection>
      </Navbar>
    </div>
  ),
};

/**
 * Compact navbar variant.
 *
 * Smaller, more condensed navbar for dense interfaces.
 */
export const Compact: Story = {
  render: () => (
    <Navbar className="py-1">
      <NavbarSection className="gap-1">
        <NavbarItem href="/" current>
          <HomeIcon />
        </NavbarItem>
        <NavbarItem href="/dashboard">
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/projects">
          <NavbarLabel>Projects</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/team">
          <NavbarLabel>Team</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection className="gap-1">
        <NavbarItem href="/settings">
          <CogIcon />
        </NavbarItem>
        <NavbarItem href="/profile">
          <UserIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

/**
 * Custom styling example.
 *
 * Shows how to override default styles with custom classes.
 */
export const CustomStyling: Story = {
  render: () => (
    <Navbar className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg px-4">
      <NavbarSection>
        <NavbarItem href="/" current>
          <NavbarLabel>Home</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/features">
          <NavbarLabel>Features</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="/pricing">
          <NavbarLabel>Pricing</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/login">
          <div className="px-4 py-1.5 border border-primary/50 rounded-lg text-primary hover:bg-primary/10 transition-colors">
            Login
          </div>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};
