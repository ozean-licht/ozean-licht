'use client'

import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  Home,
  BookOpen,
  User,
  Settings,
  Bell,
  Heart,
  Star,
  Sparkles,
  Moon,
  Sun,
  Compass,
  type LucideIcon
} from 'lucide-react'
import { AppSidebar, type NavigationItem, type AppSidebarProps } from './app-sidebar'

/**
 * # AppSidebar Component - Navigation Hub
 *
 * The AppSidebar is a collapsible navigation component for the Ozean Licht platform.
 * It provides users with quick access to main application features and modes.
 *
 * ## Features
 * - **Collapsible Design**: Expands to full width (w-64) or collapses to icons (w-16)
 * - **Active Route Highlighting**: Visual indication of current page with primary color glow
 * - **Glass Morphism**: Translucent background with backdrop blur effect
 * - **Custom Navigation**: Flexible navigation items with icons and descriptions
 * - **Background Mode Switch**: Built-in neumorphic toggle for video/image/none backgrounds
 * - **Responsive**: Fixed positioning with proper spacing from top header
 *
 * ## Layout
 * The sidebar is positioned fixed to the left side, starting below the top header (57px).
 * Navigation items include icon, label, and description in expanded mode.
 * Active items display a pulsing indicator and primary color styling.
 *
 * ## Design System
 * - Glass background: `#0A1A1A/80` with `backdrop-blur-md`
 * - Border color: `#0E282E`
 * - Active state: Primary color (#0ec2bc) with gradient and shadow glow
 * - Hover: Gradient from darker to lighter with primary text color
 * - Font: Decorative alternative font (`font-alt`) for navigation labels
 */
const meta = {
  title: 'Branded/Layout/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'darker', value: '#000a0f' }
      ]
    },
    docs: {
      description: {
        component: 'A collapsible navigation sidebar for the Ozean Licht application with active route highlighting and background mode switching.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the sidebar is expanded (true) or collapsed to icons (false)',
      table: {
        defaultValue: { summary: 'true' }
      }
    },
    navigationItems: {
      description: 'Custom navigation items array with label, href, icon, and description',
      table: {
        disable: true
      }
    },
    showBackgroundSwitch: {
      control: 'boolean',
      description: 'Whether to show the background mode switch at the bottom of the sidebar',
      table: {
        defaultValue: { summary: 'true' }
      }
    }
  }
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

// Default navigation items for examples
const defaultNavItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Übersicht & Fortschritt'
  },
  {
    label: 'Bibliothek',
    href: '/bibliothek',
    icon: BookOpen,
    description: 'Meine Kurse'
  },
  {
    label: 'Kurse',
    href: '/courses',
    icon: Sparkles,
    description: 'Alle Kurse'
  },
  {
    label: 'Transmissions',
    href: '/dashboard?tab=transmissions',
    icon: Moon,
    description: 'Galaktische Weisheiten'
  },
  {
    label: 'Portal',
    href: '/dashboard?tab=portal',
    icon: Compass,
    description: 'Spirituelle Angebote'
  },
  {
    label: 'Chronik',
    href: '/dashboard?tab=chronik',
    icon: Sun,
    description: 'Meine Erleuchtung'
  }
]

const customNavItems: NavigationItem[] = [
  {
    label: 'Profil',
    href: '/profile',
    icon: User,
    description: 'Mein Profil'
  },
  {
    label: 'Favoriten',
    href: '/favorites',
    icon: Heart,
    description: 'Meine Lieblinge'
  },
  {
    label: 'Benachrichtigungen',
    href: '/notifications',
    icon: Bell,
    description: 'Nachrichten'
  },
  {
    label: 'Einstellungen',
    href: '/settings',
    icon: Settings,
    description: 'Konfiguration'
  },
  {
    label: 'Bewertungen',
    href: '/ratings',
    icon: Star,
    description: 'Meine Bewertungen'
  }
]

/**
 * Open Sidebar - Expanded State
 *
 * Shows the sidebar in its expanded state with full navigation labels,
 * descriptions, and the background mode switch at the bottom.
 * This is the default user-friendly state for displaying all navigation options.
 */
export const Open: Story = {
  args: {
    isOpen: true,
    navigationItems: defaultNavItems,
    showBackgroundSwitch: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Expanded sidebar showing full navigation with labels, descriptions, and background mode switch'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        <Story />
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Open Sidebar</h2>
              <p className="text-white/60 text-sm">Expanded navigation panel with full labels and descriptions</p>
            </div>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">State</div>
                <div className="text-white">Expanded (w-64)</div>
              </div>
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Features</div>
                <ul className="text-white text-sm space-y-1">
                  <li>- Full navigation labels visible</li>
                  <li>- Item descriptions displayed</li>
                  <li>- Background mode switch visible</li>
                  <li>- Active item highlight with glow</li>
                  <li>- Hover gradient effect on items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ]
}

/**
 * Closed Sidebar - Icon-Only State
 *
 * Shows the sidebar in its collapsed state displaying only icons.
 * This is the compact view for saving screen space while maintaining
 * navigation access. Icons retain full functionality and hover states.
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    navigationItems: defaultNavItems,
    showBackgroundSwitch: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed sidebar showing only icons for space-efficient navigation'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        <Story />
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Closed Sidebar</h2>
              <p className="text-white/60 text-sm">Compact icon-only navigation panel</p>
            </div>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">State</div>
                <div className="text-white">Collapsed (w-16)</div>
              </div>
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Features</div>
                <ul className="text-white text-sm space-y-1">
                  <li>- Icon-only display</li>
                  <li>- Minimal width (64px)</li>
                  <li>- Active state preserved</li>
                  <li>- Hover effects on icons</li>
                  <li>- Space-efficient layout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ]
}

/**
 * Custom Navigation - Different Menu Items
 *
 * Demonstrates the sidebar with custom navigation items.
 * Shows how the component adapts to different menu structures
 * with various icons and content.
 */
export const CustomNavigation: Story = {
  args: {
    isOpen: true,
    navigationItems: customNavItems,
    showBackgroundSwitch: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with custom navigation items showing profile, favorites, notifications, settings, and ratings'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        <Story />
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Custom Navigation</h2>
              <p className="text-white/60 text-sm">Sidebar with different navigation structure</p>
            </div>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Navigation Items</div>
                <ul className="text-white text-sm space-y-2">
                  {customNavItems.map((item) => (
                    <li key={item.href} className="flex items-center gap-2">
                      <span className="text-primary">●</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Use Case</div>
                <div className="text-white text-sm">User account and preference management navigation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ]
}

/**
 * Without Background Switch - Clean Navigation
 *
 * Shows the sidebar without the background mode switch at the bottom.
 * Useful when background switching is handled elsewhere or not needed.
 * Provides a cleaner, more streamlined navigation experience.
 */
export const WithoutBackgroundSwitch: Story = {
  args: {
    isOpen: true,
    navigationItems: defaultNavItems,
    showBackgroundSwitch: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar without the background mode switch component at bottom'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        <Story />
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Without Background Switch</h2>
              <p className="text-white/60 text-sm">Navigation-focused sidebar layout</p>
            </div>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Configuration</div>
                <div className="text-white">showBackgroundSwitch: false</div>
              </div>
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Use Case</div>
                <ul className="text-white text-sm space-y-1">
                  <li>- Clean, focused navigation</li>
                  <li>- Background control elsewhere</li>
                  <li>- Maximized nav item space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ]
}

/**
 * Active Route - Highlighted Navigation
 *
 * Demonstrates the sidebar with an active navigation item highlighted.
 * Shows the visual styling applied to the current active route including
 * the gradient background, primary color text, border styling, and pulsing indicator.
 */
export const ActiveRoute: Story = {
  render: function ActiveRouteExample() {
    const [currentPath, setCurrentPath] = useState('/courses')

    const itemsWithActive = defaultNavItems.map(item => ({
      ...item,
      isActive: item.href === currentPath
    }))

    return (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        {/* Mock sidebar - we're showing the visual effect */}
        <div className="fixed left-0 top-[57px] bottom-0 w-64 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col font-alt z-40">
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {defaultNavItems.map((item) => {
                const Icon = item.icon
                const isActive = item.href === currentPath
                return (
                  <button
                    key={item.href}
                    onClick={() => setCurrentPath(item.href)}
                    className={`w-full justify-start gap-3 h-auto py-3 px-4 text-left transition-all duration-300 font-alt rounded-xl flex items-start
                      ${isActive
                        ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30 hover:border-primary/50 hover:shadow-primary/30'
                        : 'border border-transparent hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary hover:shadow-lg hover:shadow-primary/5'
                      }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${isActive ? 'bg-primary/20 shadow-lg shadow-primary/20' : 'bg-[#0E282E]/50'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className={`text-sm truncate transition-all duration-300 ${isActive ? 'font-normal text-primary' : 'font-light'}`}>
                        {item.label}
                      </span>
                      <span className={`text-xs font-light truncate transition-all duration-300 ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        <div className="flex-1 ml-64 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Active Route Highlighting</h2>
              <p className="text-white/60 text-sm">Click navigation items to see active state styling</p>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Current Active Route</div>
                <div className="text-white text-lg font-medium">{currentPath}</div>
              </div>

              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Active Item Styling</div>
                <ul className="text-white text-sm space-y-2">
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50"></div>
                    <span>Gradient background (primary/20 → primary/10)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full text-primary">◆</div>
                    <span>Primary color text</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span>Pulsing indicator dot</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 shadow-lg shadow-primary/20"></div>
                    <span>Icon container glow</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="border-l-2 border-primary/30 pl-2">Border highlight</div>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="text-white/70 text-sm font-alt">Instructions</div>
                <div className="text-white text-sm">Click any navigation item in the sidebar to activate it and see the styling changes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive sidebar showing active route highlighting with gradient background, primary color styling, and pulsing indicator'
      }
    }
  }
}

/**
 * Side-by-Side Comparison - Open vs Closed
 *
 * Visual comparison of the sidebar in both expanded and collapsed states.
 * Demonstrates how the component adapts to different screen space constraints
 * while maintaining full functionality.
 */
export const Comparison: Story = {
  render: () => (
    <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex flex-col">
      <div className="p-8">
        <h1 className="text-white text-3xl font-decorative mb-2">Sidebar States Comparison</h1>
        <p className="text-white/60">Side-by-side view of expanded and collapsed sidebar states</p>
      </div>

      <div className="flex-1 flex gap-8 p-8 overflow-auto">
        {/* Expanded State */}
        <div className="flex-1">
          <div className="space-y-4 mb-4">
            <h3 className="text-white text-lg font-alt">Expanded State (w-64)</h3>
            <p className="text-white/50 text-sm">Full labels and descriptions visible</p>
          </div>
          <div className="relative bg-gradient-to-b from-[#001a1a] to-[#00070F] rounded-xl overflow-hidden border border-[#0E282E]">
            <div className="h-96 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col font-alt">
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {defaultNavItems.slice(0, 4).map((item, idx) => {
                    const Icon = item.icon
                    const isActive = idx === 1
                    return (
                      <button
                        key={item.href}
                        className={`w-full justify-start gap-3 h-auto py-3 px-4 text-left transition-all duration-300 font-alt rounded-xl flex items-start ${isActive
                          ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30'
                          : 'border border-transparent hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary'
                          }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-primary/20' : 'bg-[#0E282E]/50'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className={`text-sm truncate ${isActive ? 'font-normal text-primary' : 'font-light'}`}>
                            {item.label}
                          </span>
                          <span className={`text-xs font-light truncate ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
                            {item.description}
                          </span>
                        </div>
                        {isActive && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Collapsed State */}
        <div className="flex-1">
          <div className="space-y-4 mb-4">
            <h3 className="text-white text-lg font-alt">Collapsed State (w-16)</h3>
            <p className="text-white/50 text-sm">Icons only, minimal width</p>
          </div>
          <div className="relative bg-gradient-to-b from-[#001a1a] to-[#00070F] rounded-xl overflow-hidden border border-[#0E282E]">
            <div className="h-96 w-20 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col items-center py-4">
              <div className="flex flex-col gap-2">
                {defaultNavItems.slice(0, 4).map((item, idx) => {
                  const Icon = item.icon
                  const isActive = idx === 1
                  return (
                    <button
                      key={item.href}
                      className={`w-12 h-12 p-0 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-[#0E282E] text-muted-foreground'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="p-8 border-t border-[#0E282E]">
        <div className="glass-card rounded-xl p-6">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-[#0E282E]">
                <th className="text-left py-3 px-4 text-white/70 font-alt">Feature</th>
                <th className="text-left py-3 px-4 text-white/70 font-alt">Expanded</th>
                <th className="text-left py-3 px-4 text-white/70 font-alt">Collapsed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#0E282E]/50">
                <td className="py-3 px-4">Width</td>
                <td className="py-3 px-4">256px (w-64)</td>
                <td className="py-3 px-4">64px (w-16)</td>
              </tr>
              <tr className="border-b border-[#0E282E]/50">
                <td className="py-3 px-4">Labels Visible</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">No</td>
              </tr>
              <tr className="border-b border-[#0E282E]/50">
                <td className="py-3 px-4">Descriptions</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">No (icon tooltip only)</td>
              </tr>
              <tr className="border-b border-[#0E282E]/50">
                <td className="py-3 px-4">Screen Space</td>
                <td className="py-3 px-4">More</td>
                <td className="py-3 px-4">Minimal</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Best For</td>
                <td className="py-3 px-4">Full-size displays</td>
                <td className="py-3 px-4">Compact layouts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of expanded and collapsed sidebar states with feature comparison table'
      }
    }
  }
}

/**
 * Interactive Toggle - State Switching
 *
 * Interactive example demonstrating the toggle between expanded and collapsed states.
 * Users can click the toggle button to switch sidebar states and see the visual transition.
 */
export const InteractiveToggle: Story = {
  render: function InteractiveToggleExample() {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} fixed left-0 top-[57px] bottom-0 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col z-40`}>
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className={isOpen ? 'space-y-2' : 'space-y-2 flex flex-col items-center'}>
              {defaultNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    className={`transition-all duration-300 ${isOpen
                      ? 'w-full justify-start gap-3 h-auto py-3 px-4 rounded-xl flex items-start border border-transparent hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary'
                      : 'w-12 h-12 p-0 flex items-center justify-center rounded-lg hover:bg-[#0E282E]'
                      }`}
                  >
                    <div className={isOpen ? 'p-2 rounded-lg bg-[#0E282E]/50 flex-shrink-0' : ''}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {isOpen && (
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <span className="text-sm truncate font-light">{item.label}</span>
                        <span className="text-xs font-light truncate text-muted-foreground">{item.description}</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex-1 p-8 overflow-auto`}>
          <div className="space-y-8">
            <div>
              <h2 className="text-white text-3xl font-decorative mb-4">Interactive Sidebar Toggle</h2>
              <p className="text-white/60 mb-6">Click the toggle button below to switch between expanded and collapsed states</p>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-6 py-3 bg-primary/20 border border-primary/50 text-primary rounded-lg font-alt hover:bg-primary/30 transition-all duration-300"
              >
                {isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">Current State</div>
                <div className="text-white text-xl font-medium">{isOpen ? 'Expanded (w-64)' : 'Collapsed (w-16)'}</div>
              </div>

              <div className="space-y-2">
                <div className="text-white/70 text-sm font-alt">What You Can Do</div>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>- Click the toggle button to switch states</li>
                  <li>- Watch the smooth transition animation</li>
                  <li>- Notice how content margins adjust automatically</li>
                  <li>- See labels appear/disappear on toggle</li>
                  <li>- Observe the sidebar width transition</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-white font-alt mb-3">Expanded Benefits</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Full labels visible</li>
                  <li>• Item descriptions shown</li>
                  <li>• Better for discovery</li>
                  <li>• Clear navigation intent</li>
                </ul>
              </div>
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-white font-alt mb-3">Collapsed Benefits</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Minimizes screen space</li>
                  <li>• Focus on content</li>
                  <li>• Icon recognition</li>
                  <li>• Faster access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive sidebar toggle between expanded and collapsed states with smooth transitions'
      }
    }
  }
}

/**
 * Minimal Navigation - Few Items
 *
 * Shows the sidebar with a minimal set of navigation items.
 * Useful for applications with fewer main sections or simplified navigation hierarchies.
 */
export const MinimalNavigation: Story = {
  args: {
    isOpen: true,
    navigationItems: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        description: 'Übersicht'
      },
      {
        label: 'Kurse',
        href: '/courses',
        icon: BookOpen,
        description: 'Alle Kurse'
      },
      {
        label: 'Profil',
        href: '/profile',
        icon: User,
        description: 'Mein Profil'
      }
    ],
    showBackgroundSwitch: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with minimal navigation items for streamlined application interfaces'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] flex">
        <Story />
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-decorative mb-2">Minimal Navigation</h2>
              <p className="text-white/60 text-sm">Simplified sidebar for core features only</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="text-white/70 text-sm font-alt mb-4">Use Cases</div>
              <ul className="text-white text-sm space-y-2">
                <li>- Simple applications with few main sections</li>
                <li>- Onboarding flows with limited options</li>
                <li>- Mobile-optimized layouts</li>
                <li>- Progressive disclosure of features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  ]
}
