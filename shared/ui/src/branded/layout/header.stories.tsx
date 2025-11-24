'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './header'

/**
 * # Header Component
 *
 * The public header component for the Ozean Licht platform featuring:
 * - Logo and branding display
 * - Responsive navigation menu
 * - User authentication state management
 * - Profile dropdown with user actions
 * - Registration and login CTAs
 * - Rounded pill design with glassmorphism
 * - Fixed positioning at top of viewport
 *
 * ## Design Features
 *
 * - **Layout**: Fixed position at top with 30px margin, max-width 1200px
 * - **Style**: Rounded pill design with backdrop blur and dark glassmorphism
 * - **Navigation**: Contextual styling based on current route
 * - **Auth States**: Shows different UI for authenticated vs unauthenticated users
 * - **Dropdown**: User profile menu with dashboard, account, orders, and logout options
 *
 * ## Responsive Behavior
 *
 * The header maintains a horizontal layout across all screen sizes with:
 * - Logo and branding on the left
 * - Navigation menu in center
 * - User actions (profile/login) on the right
 */
const meta = {
  title: 'Tier 2: Branded/Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Public header component for Ozean Licht platform with authentication support, navigation menu, and glassmorphic design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description: 'Authenticated user object containing id, email, and created_at',
    },
    onSignOut: {
      control: false,
      description: 'Callback handler for sign-out action',
    },
    logoUrl: {
      control: 'text',
      description: 'URL for the logo image',
    },
    appName: {
      control: 'text',
      description: 'Application/branding name to display',
    },
    navigationItems: {
      control: 'object',
      description: 'Array of navigation menu items with label and href',
    },
    showLanguagePicker: {
      control: 'boolean',
      description: 'Toggle language picker visibility',
    },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Header - Public/Unauthenticated State
 *
 * Shows the header as it appears to users who are not yet logged in.
 * Features the full navigation menu with prominent "Anmelden" (Login) and
 * "Registrieren" (Register) call-to-action buttons in the header.
 *
 * Use this state for:
 * - Landing pages
 * - Marketing pages
 * - Public content
 * - Anonymous user experiences
 */
export const Default: Story = {
  args: {
    user: null,
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Über Lia', href: '/about-lia' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
}

/**
 * With User - Authenticated State
 *
 * Shows the header when a user is logged in. The login/register buttons
 * are replaced with a user profile avatar and dropdown menu.
 *
 * Features:
 * - Avatar with user's initial (first letter of email)
 * - Hover-activated dropdown menu
 * - Quick access to Dashboard, Profile, Orders
 * - Sign-out button (red/destructive styling)
 *
 * Use this state for:
 * - Authenticated user pages
 * - Dashboard and account pages
 * - Protected content areas
 */
export const WithUser: Story = {
  args: {
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'anna.mueller@example.com',
      created_at: '2024-01-15T10:30:00Z',
    },
    onSignOut: async () => {
      console.log('User signed out')
    },
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Über Lia', href: '/about-lia' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
}

/**
 * Custom Navigation
 *
 * Demonstrates the header with a custom navigation menu structure.
 * Useful for different sections of the platform with context-specific navigation.
 *
 * This example shows a course platform specific navigation:
 * - Dashboard link
 * - Course catalog
 * - Community forum
 * - Resources
 */
export const CustomNavigation: Story = {
  args: {
    user: null,
    navigationItems: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Community', href: '/community' },
      { label: 'Ressourcen', href: '/resources' },
      { label: 'Blog', href: '/blog' },
    ],
  },
}

/**
 * Custom Branding
 *
 * Demonstrates the header with custom logo and application name.
 * Allows for white-label or alternative branding scenarios.
 *
 * This example uses:
 * - Custom logo URL
 * - Alternative brand name (Kids Ascension)
 * - Relevant navigation for educational platform
 */
export const CustomBranding: Story = {
  args: {
    user: null,
    logoUrl: 'https://via.placeholder.com/40x40?text=KA',
    appName: 'Kids Ascension',
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Programme', href: '/programs' },
      { label: 'Eltern', href: '/parents' },
      { label: 'Über uns', href: '/about' },
    ],
  },
}

/**
 * Minimal Navigation
 *
 * Shows a simplified header with minimal navigation items.
 * Useful for focused pages or mobile-optimized experiences.
 *
 * Features:
 * - Only essential navigation items
 * - Cleaner visual hierarchy
 * - Reduced cognitive load
 */
export const MinimalNav: Story = {
  args: {
    user: null,
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Kurse', href: '/courses' },
    ],
  },
}

/**
 * Authenticated with Custom Branding
 *
 * Combines authentication state with custom branding.
 * Shows how the profile menu works with alternative branding.
 */
export const AuthenticatedWithCustomBranding: Story = {
  args: {
    user: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      email: 'sebastian.weber@example.de',
      created_at: '2023-06-20T14:45:00Z',
    },
    onSignOut: async () => {
      console.log('User signed out from custom branded site')
    },
    logoUrl: 'https://via.placeholder.com/40x40?text=OL',
    appName: 'Ozean Licht Akademie',
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' },
    ],
  },
}

/**
 * Multiple User Examples
 *
 * Visual comparison of the profile avatar and dropdown for different users.
 * Demonstrates how the component handles various email addresses and initials.
 */
export const MultipleUserExamples: Story = {
  render: () => (
    <div className="space-y-16 bg-[#00070F] min-h-screen p-8">
      {/* User 1: Anna */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          User: Anna Mueller (A)
        </div>
        <Header
          user={{
            id: '1',
            email: 'anna.mueller@ozean-licht.de',
            created_at: '2024-01-15T10:30:00Z',
          }}
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>

      {/* User 2: Sarah */}
      <div className="space-y-4 pt-20">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          User: Sarah Johnson (S)
        </div>
        <Header
          user={{
            id: '2',
            email: 'sarah.johnson@example.com',
            created_at: '2024-03-22T09:15:00Z',
          }}
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>

      {/* User 3: Michael */}
      <div className="space-y-4 pt-20">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          User: Michael Schmetzer (M)
        </div>
        <Header
          user={{
            id: '3',
            email: 'michael.schmetzer@example.de',
            created_at: '2024-02-10T16:45:00Z',
          }}
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>
    </div>
  ),
}

/**
 * Navigation States Comparison
 *
 * Shows how the active navigation item styling changes based on the current route.
 * Demonstrates the visual feedback for the currently active page.
 *
 * Note: In Storybook, we can't actually change the pathname, but this shows
 * the intended styling behavior when different routes are active.
 */
export const NavigationStatesComparison: Story = {
  render: () => (
    <div className="space-y-16 bg-[#00070F] min-h-screen p-8">
      {/* Header with Home Active */}
      <div className="space-y-4">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Home Route Active
        </div>
        <Header
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Über Lia', href: '/about-lia' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>

      {/* Header with Courses Active */}
      <div className="space-y-4 pt-20">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Courses Route Active
        </div>
        <Header
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Über Lia', href: '/about-lia' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>

      {/* Header with Contact Active */}
      <div className="space-y-4 pt-20">
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider">
          Contact Route Active
        </div>
        <Header
          navigationItems={[
            { label: 'Home', href: '/' },
            { label: 'Über Lia', href: '/about-lia' },
            { label: 'Kurse', href: '/courses' },
            { label: 'Kontakt', href: '/contact' },
          ]}
        />
      </div>
    </div>
  ),
}

/**
 * Design System Showcase
 *
 * Comprehensive display of the header component showing its design features:
 * - Fixed positioning with 30px top margin
 * - Rounded pill design
 * - Glassmorphism with backdrop blur
 * - Color scheme (dark background with primary accents)
 * - Responsive spacing and sizing
 */
export const DesignSystemShowcase: Story = {
  render: () => (
    <div className="bg-[#00070F] min-h-screen relative">
      {/* Hero Section Below Header */}
      <div className="pt-32 px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="font-decorative text-5xl text-white">
            Ozean Licht Header Design System
          </h2>
          <p className="text-white/70 text-lg max-w-2xl">
            The header demonstrates key design principles: rounded pill shape,
            glassmorphic effects, and clean navigation patterns.
          </p>
        </div>

        {/* Design Features */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Rounded Pill Design
            </div>
            <p className="text-white/70 text-sm">
              Smooth, organic border-radius (rounded-full) creates a friendly,
              modern appearance.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Glassmorphism
            </div>
            <p className="text-white/70 text-sm">
              Backdrop blur effect creates depth and visual hierarchy in the UI.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Fixed Positioning
            </div>
            <p className="text-white/70 text-sm">
              30px top margin, max-width 1200px, centered layout for
              accessibility and readability.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Auth Integration
            </div>
            <p className="text-white/70 text-sm">
              Seamless authentication state handling with profile dropdown and
              quick actions.
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="glass-card rounded-lg p-8 mt-12 space-y-4">
          <div className="font-decorative text-2xl text-white mb-6">
            Key Features
          </div>
          <ul className="space-y-3 text-white/70">
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Logo and branding display with custom URL support
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Responsive navigation menu with active route styling
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              User profile dropdown with Dashboard, Profile, Orders, Logout
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Register and Login CTAs for unauthenticated users
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Automatic user detection from Supabase auth state
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Customizable navigation items and branding
            </li>
          </ul>
        </div>
      </div>

      {/* Header is fixed, so it will appear at the top */}
      <Header
        navigationItems={[
          { label: 'Home', href: '/' },
          { label: 'Über Lia', href: '/about-lia' },
          { label: 'Kurse', href: '/courses' },
          { label: 'Kontakt', href: '/contact' },
        ]}
      />
    </div>
  ),
}

/**
 * Interactive Playground
 *
 * Full control over all header props to experiment with different
 * configurations and combinations.
 */
export const Playground: Story = {
  args: {
    user: null,
    logoUrl:
      'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png',
    appName: 'Ozean Licht',
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Über Lia', href: '/about-lia' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Kontakt', href: '/contact' },
    ],
    showLanguagePicker: false,
  },
}
