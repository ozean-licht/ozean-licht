'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { AppHeader, type AppHeaderProps } from './app-header'
import { useState } from 'react'

/**
 * # AppHeader Component Stories
 *
 * The AppHeader is the main navigation component for the Ozean Licht platform.
 * It provides branding, navigation breadcrumbs, search, notifications, and user
 * profile management in a modern, ocean-themed interface.
 *
 * ## Key Features
 * - Logo and app branding with customizable logo URL and app name
 * - Breadcrumb navigation with optional links
 * - Sidebar toggle button for responsive layouts
 * - Search and notification buttons with icon integration
 * - User profile dropdown menu with authentication actions
 * - Dark theme with turquoise primary color (#0ec2bc)
 * - Responsive design with glass-morphism effects
 *
 * ## Design System
 * - **Primary Color**: #0ec2bc (Oceanic Cyan/Turquoise)
 * - **Background**: #00070F (Deep Ocean Dark)
 * - **Secondary Colors**: #0A1A1A, #0E282E (Ocean depths)
 * - **Font**: Cinzel Decorative for branding, Sans-serif for content
 * - **Effects**: Glass-morphism, backdrop blur, smooth transitions
 */
const meta = {
  title: 'Tier 2: Branded/Layout/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'ocean-dark', value: '#0A1A1A' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Application header component with branding, navigation, search, notifications, and user profile management. Designed for Ozean Licht platform with oceanic cyan theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    breadcrumbs: {
      control: 'object',
      description: 'Array of breadcrumb items with labels and optional hrefs',
    },
    onMenuClick: {
      action: 'Menu clicked',
      description: 'Callback when sidebar toggle button is clicked',
    },
    showSidebarToggle: {
      control: 'boolean',
      description: 'Show/hide the sidebar toggle button',
    },
    user: {
      control: 'object',
      description: 'User object with id, email, and created_at fields',
    },
    onSignOut: {
      action: 'Sign out triggered',
      description: 'Callback when user clicks sign out button',
    },
    logoUrl: {
      control: 'text',
      description: 'URL to the logo image',
    },
    appName: {
      control: 'text',
      description: 'Application name displayed next to logo',
    },
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default AppHeader with no breadcrumbs, sidebar toggle visible, and mock user data.
 *
 * This is the most common configuration showing the basic header layout.
 * Perfect for dashboard and main application pages.
 */
export const Default: Story = {
  args: {
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-123',
      email: 'user@ozean-licht.com',
      created_at: new Date().toISOString(),
    },
  },
}

/**
 * AppHeader with Breadcrumbs
 *
 * Shows navigation context with breadcrumb trail. The final breadcrumb
 * (without href) appears highlighted in the primary turquoise color.
 *
 * Use when users need to understand their location in the information hierarchy.
 */
export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Courses', href: '/courses' },
      { label: 'Advanced Consciousness Training' },
    ],
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-456',
      email: 'learner@ozean-licht.com',
      created_at: new Date().toISOString(),
    },
  },
}

/**
 * AppHeader with User Data
 *
 * Demonstrates the user profile avatar and dropdown menu.
 * The avatar displays the first letter of the user's email in the primary color.
 * Hover to reveal the dropdown menu with navigation and sign-out options.
 */
export const WithUser: Story = {
  args: {
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-789',
      email: 'spiritualmaster@ozean-licht.com',
      created_at: '2024-01-15T10:30:00Z',
    },
    onSignOut: () => console.log('User signed out'),
  },
}

/**
 * AppHeader without Sidebar Toggle
 *
 * Use this variant when your application layout doesn't require a sidebar,
 * or when the sidebar is always visible. Removes the menu toggle button
 * from the left side of the header.
 */
export const NoSidebarToggle: Story = {
  args: {
    breadcrumbs: [
      { label: 'Library', href: '/bibliothek' },
      { label: 'Sacred Texts' },
    ],
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: false,
    user: {
      id: 'user-101',
      email: 'researcher@ozean-licht.com',
      created_at: '2023-06-20T14:45:00Z',
    },
  },
}

/**
 * AppHeader with Custom Branding
 *
 * Demonstrates customization of logo and app name.
 * You can change the logo URL and app name to match different brands
 * or applications within the Ozean Licht ecosystem.
 */
export const CustomBranding: Story = {
  args: {
    logoUrl:
      'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png',
    appName: 'Kids Ascension Academy',
    breadcrumbs: [
      { label: 'Courses', href: '/courses' },
      { label: 'Educational Modules' },
    ],
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-202',
      email: 'educator@kids-ascension.dev',
      created_at: '2024-03-01T08:15:00Z',
    },
  },
}

/**
 * AppHeader with Long Breadcrumbs
 *
 * Shows how the header handles longer breadcrumb trails.
 * The breadcrumbs maintain readability and are separated by chevron icons.
 * Links are styled in muted gray, while the current page is highlighted in turquoise.
 */
export const WithLongBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Learning Paths', href: '/learning-paths' },
      { label: 'Soul Mastery Track', href: '/learning-paths/soul-mastery' },
      { label: 'Module 5: Energetic Frequencies' },
    ],
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-303',
      email: 'advanced.student@ozean-licht.com',
      created_at: '2023-11-10T16:20:00Z',
    },
  },
}

/**
 * AppHeader with Multiple User Types
 *
 * Shows how the header adapts to different user email formats.
 * The avatar initial is always the first letter of the email,
 * displayed in a circular background with the primary turquoise color.
 */
export const DifferentUsers: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider mb-4">
          Standard User
        </h3>
        <AppHeader
          user={{
            id: 'user-1',
            email: 'anna@ozean-licht.com',
            created_at: new Date().toISOString(),
          }}
          onMenuClick={() => console.log('Menu clicked')}
        />
      </div>

      <div>
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider mb-4">
          Admin User
        </h3>
        <AppHeader
          user={{
            id: 'user-2',
            email: 'admin@ozean-licht.com',
            created_at: '2022-01-01T00:00:00Z',
          }}
          onMenuClick={() => console.log('Menu clicked')}
        />
      </div>

      <div>
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider mb-4">
          Instructor User
        </h3>
        <AppHeader
          user={{
            id: 'user-3',
            email: 'instructor@ozean-licht.com',
            created_at: '2023-05-15T12:00:00Z',
          }}
          onMenuClick={() => console.log('Menu clicked')}
        />
      </div>
    </div>
  ),
}

/**
 * AppHeader with Interactive Sidebar Toggle
 *
 * Interactive example showing the sidebar toggle functionality.
 * Click the menu icon to trigger the onMenuClick callback.
 * This demonstrates how the header integrates with a responsive layout system.
 */
export const InteractiveSidebarToggle: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
      <div className="space-y-8">
        <AppHeader
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Settings' },
          ]}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showSidebarToggle={true}
          user={{
            id: 'user-interactive',
            email: 'interactive@ozean-licht.com',
            created_at: new Date().toISOString(),
          }}
        />

        <div className="px-6 pt-20 text-white/70">
          <p className="text-sm">
            Sidebar is currently:{' '}
            <span className="text-primary font-medium">
              {sidebarOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </p>
          <p className="text-xs mt-2 text-white/50">
            Click the menu icon in the header to toggle the sidebar state
          </p>
        </div>
      </div>
    )
  },
}

/**
 * AppHeader Layout Showcase
 *
 * Complete visual demonstration of the AppHeader in different configurations.
 * Shows the component's key areas: logo, breadcrumbs, search, notifications,
 * and user menu. Illustrates responsive behavior and element spacing.
 */
export const LayoutShowcase: Story = {
  render: () => (
    <div className="space-y-16 p-8">
      <div className="space-y-4">
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Minimal Configuration
        </h3>
        <div className="bg-[#0A1A1A] rounded-lg border border-[#0E282E]">
          <AppHeader
            showSidebarToggle={false}
            user={{
              id: 'user-minimal',
              email: 'minimal@ozean-licht.com',
              created_at: new Date().toISOString(),
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Full Configuration
        </h3>
        <div className="bg-[#0A1A1A] rounded-lg border border-[#0E282E]">
          <AppHeader
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Courses', href: '/courses' },
              { label: 'Consciousness Mastery' },
            ]}
            showSidebarToggle={true}
            appName="Ozean Licht Academy"
            user={{
              id: 'user-full',
              email: 'full.config@ozean-licht.com',
              created_at: '2024-01-01T00:00:00Z',
            }}
            onMenuClick={() => console.log('Menu toggled')}
            onSignOut={() => console.log('Signed out')}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Custom Branding Example
        </h3>
        <div className="bg-[#0A1A1A] rounded-lg border border-[#0E282E]">
          <AppHeader
            appName="Kids Ascension Platform"
            breadcrumbs={[
              { label: 'Learning Paths', href: '/paths' },
              { label: 'Spiritual Growth' },
            ]}
            user={{
              id: 'user-kids-asc',
              email: 'student@kids-ascension.dev',
              created_at: new Date().toISOString(),
            }}
            onMenuClick={() => console.log('Menu toggled')}
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * AppHeader Color Theme Demonstration
 *
 * Shows the color palette used in the AppHeader:
 * - Primary: #0ec2bc (Turquoise) - Highlights, links, badges
 * - Background: #0A1A1A - Header background
 * - Border: #0E282E - Dividers and subtle borders
 * - Text: White for primary, muted-foreground for secondary
 *
 * The design follows the Ozean Licht oceanic theme with deep ocean colors
 * and turquoise accents representing the awakening consciousness.
 */
export const ColorTheme: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <AppHeader
        breadcrumbs={[
          { label: 'Color Theme', href: '#' },
          { label: 'Palette Showcase' },
        ]}
        user={{
          id: 'user-theme',
          email: 'designer@ozean-licht.com',
          created_at: new Date().toISOString(),
        }}
      />

      <div className="pt-20 space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
            Primary Color
          </h3>
          <div className="flex gap-4">
            <div className="w-32 h-24 bg-primary rounded-lg flex items-center justify-center text-white font-medium text-sm">
              #0ec2bc
            </div>
            <div className="text-white/70 space-y-2 flex-1">
              <p className="text-sm">
                <span className="text-primary">Turquoise</span> - Primary CTA, links, highlights
              </p>
              <p className="text-xs text-white/50">
                Represents awakening consciousness and spiritual transformation
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
            Background Colors
          </h3>
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <div className="w-32 h-16 bg-[#00070F] border border-[#0E282E] rounded-lg" />
              <div className="text-white/70 text-sm">
                Deep Ocean: #00070F
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-32 h-16 bg-[#0A1A1A] border border-[#0E282E] rounded-lg" />
              <div className="text-white/70 text-sm">
                Ocean Surface: #0A1A1A
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-32 h-16 bg-[#0E282E] border border-[#0E282E] rounded-lg" />
              <div className="text-white/70 text-sm">
                Ocean Accent: #0E282E
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider">
            Typography
          </h3>
          <div className="space-y-3">
            <div>
              <p className="font-decorative text-2xl text-white mb-1">
                Cinzel Decorative (Branding)
              </p>
              <p className="text-xs text-white/50">
                Used for app name and logo text
              </p>
            </div>
            <div>
              <p className="font-sans text-sm text-white mb-1">
                Sans Serif (Content)
              </p>
              <p className="text-xs text-white/50">
                Used for breadcrumbs, labels, and menu items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * AppHeader Responsive Behavior
 *
 * Demonstrates how the AppHeader adapts to different viewport sizes.
 * The component uses Tailwind's responsive classes to adjust padding
 * and sizing while maintaining the core functionality.
 */
export const ResponsiveBehavior: Story = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Advanced Settings' },
    ],
    showSidebarToggle: true,
    user: {
      id: 'user-responsive',
      email: 'responsive@ozean-licht.com',
      created_at: new Date().toISOString(),
    },
    onMenuClick: () => console.log('Menu clicked'),
  },
}

/**
 * AppHeader Interaction States
 *
 * Interactive demonstration showing all interactive elements:
 * - Menu button with hover state
 * - Search button with hover state
 * - Notification button with hover state
 * - User avatar with dropdown menu on hover
 *
 * All buttons use the turquoise primary color on hover for consistency.
 */
export const InteractionStates: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider mb-4">
          Default State
        </h3>
        <AppHeader
          user={{
            id: 'user-interact',
            email: 'interact@ozean-licht.com',
            created_at: new Date().toISOString(),
          }}
        />
      </div>

      <div className="pt-8">
        <p className="text-white/60 text-sm px-6">
          Hover over the menu icon, search button, notification bell, and user
          avatar to see the interactive states. The turquoise primary color
          indicates interactive elements.
        </p>
      </div>

      <div className="pt-8">
        <h3 className="text-white/70 text-sm font-alt uppercase tracking-wider mb-4">
          User Menu Features (Hover on Avatar)
        </h3>
        <div className="text-white/60 text-sm px-6 space-y-2">
          <p>The dropdown menu includes:</p>
          <ul className="list-disc list-inside space-y-1 text-white/50">
            <li>User profile information (initial and email)</li>
            <li>Dashboard link (Home icon)</li>
            <li>Bibliothek (Library) link (Book icon)</li>
            <li>Belege (Receipts) link (File icon)</li>
            <li>Mitgliedschaft (Membership) link (Crown icon)</li>
            <li>Sign out option (Logout icon in red)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

/**
 * Playground
 *
 * Interactive playground for experimenting with different AppHeader configurations.
 * Use the controls panel to adjust all props and see the results in real-time.
 */
export const Playground: Story = {
  args: {
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Content Library' },
    ],
    onMenuClick: () => console.log('Menu clicked'),
    showSidebarToggle: true,
    user: {
      id: 'user-playground',
      email: 'playground@ozean-licht.com',
      created_at: new Date().toISOString(),
    },
    onSignOut: () => console.log('Signed out'),
    logoUrl:
      'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png',
    appName: 'Ozean Licht Academy',
  },
}
