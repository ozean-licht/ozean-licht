import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel } from './collapsible'
import { Card, CardHeader, CardTitle, CardPanel } from './card'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta<typeof CollapsibleRoot> = {
  title: 'Tier 1: Primitives/CossUI/Collapsible',
  component: CollapsibleRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Collapsible component from Base UI adapted for Ozean Licht design system. A simpler alternative to Accordion for creating expandable/collapsible sections. Features smooth height animations, controlled/uncontrolled modes, and comprehensive accessibility support with ARIA attributes.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CollapsibleRoot>

/**
 * Basic Collapsible Story
 * Simple expandable section with default styling
 */
export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <CollapsibleRoot>
        <CollapsibleTrigger>
          Click to expand
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="text-sm text-[#C4C8D4] font-sans font-light">
            This is the collapsible content. It smoothly animates when you click the trigger above.
            The content can be any React elements, including text, images, or other components.
          </div>
        </CollapsiblePanel>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * FAQ Item Story
 * Common use case for frequently asked questions
 */
export const FAQItem: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            What is the Ozean Licht design system?
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              The Ozean Licht design system is a modern, ocean-themed design framework featuring
              oceanic cyan colors (#0ec2bc) and deep ocean dark backgrounds (#00070F). It includes
              glass morphism effects, smooth animations, and comprehensive accessibility support.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            How does it differ from other UI libraries?
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              Unlike most UI libraries that use Radix UI, Ozean Licht is built on Base UI primitives
              using the render prop pattern instead of asChild. This provides better TypeScript
              support and more predictable component composition.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            What components are available?
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              The library includes Button, Card, Accordion, Tabs, Dialog, Collapsible, Input,
              Label, Badge, Alert, Spinner, Progress, Checkbox, Radio, Switch, and many more.
              All components follow the same design language and accessibility standards.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Code Snippet Toggle Story
 * Show/hide code examples
 */
export const CodeSnippet: Story = {
  render: () => (
    <div className="w-[700px]">
      <Card>
        <CardHeader>
          <CardTitle>Installation Example</CardTitle>
        </CardHeader>
        <CardPanel>
          <p className="text-sm text-[#C4C8D4] mb-4">
            Install the Ozean Licht UI library using your preferred package manager:
          </p>

          <CollapsibleRoot>
            <CollapsibleTrigger className="px-4 py-2 rounded-lg bg-card/70 border border-border hover:border-primary/30">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View installation code
              </span>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="mt-4 rounded-lg bg-[#00070F] p-4 font-mono text-sm text-[#0ec2bc] border border-primary/20">
                <div>npm install @ozean-licht/ui</div>
                <div className="mt-2">pnpm add @ozean-licht/ui</div>
                <div className="mt-2">yarn add @ozean-licht/ui</div>
              </div>
            </CollapsiblePanel>
          </CollapsibleRoot>
        </CardPanel>
      </Card>
    </div>
  ),
}

/**
 * Settings Section Story
 * Advanced settings toggle
 */
export const SettingsSection: Story = {
  render: () => (
    <div className="w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardPanel>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Notifications</div>
                <div className="text-xs text-[#C4C8D4]">Receive email notifications</div>
              </div>
              <div className="text-xs text-primary">Enabled</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Theme</div>
                <div className="text-xs text-[#C4C8D4]">Dark mode</div>
              </div>
              <div className="text-xs text-primary">Active</div>
            </div>

            <CollapsibleRoot>
              <div className="border-t border-border pt-4">
                <CollapsibleTrigger>
                  <span className="text-sm font-medium text-white">Advanced Options</span>
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white">Debug Mode</div>
                        <div className="text-xs text-[#C4C8D4]">Show developer tools</div>
                      </div>
                      <div className="text-xs text-[#C4C8D4]">Disabled</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white">Analytics</div>
                        <div className="text-xs text-[#C4C8D4]">Share usage data</div>
                      </div>
                      <div className="text-xs text-primary">Enabled</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white">Experimental Features</div>
                        <div className="text-xs text-[#C4C8D4]">Try new features early</div>
                      </div>
                      <div className="text-xs text-[#C4C8D4]">Disabled</div>
                    </div>
                  </div>
                </CollapsiblePanel>
              </div>
            </CollapsibleRoot>
          </div>
        </CardPanel>
      </Card>
    </div>
  ),
}

/**
 * Initially Open Story
 * Collapsible that starts expanded
 */
export const InitiallyOpen: Story = {
  render: () => (
    <div className="w-[600px]">
      <CollapsibleRoot defaultOpen>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Important Notice (Expanded by default)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible section starts in the open state. Users can still collapse it
              by clicking the trigger. This is useful for content that should be visible by
              default but can be hidden to save space.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Controlled State Story
 * Externally controlled collapsible with custom trigger
 */
export const ControlledState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="w-[600px] space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setIsOpen(true)} size="sm">
            Expand
          </Button>
          <Button onClick={() => setIsOpen(false)} size="sm" variant="secondary">
            Collapse
          </Button>
          <Button onClick={() => setIsOpen(!isOpen)} size="sm" variant="outline">
            Toggle
          </Button>
        </div>

        <CollapsibleRoot open={isOpen} onOpenChange={setIsOpen}>
          <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
            <CollapsibleTrigger>
              Controlled Collapsible (State: {isOpen ? 'Open' : 'Closed'})
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="text-sm text-[#C4C8D4] font-sans font-light">
                This collapsible is controlled by external state. The buttons above control
                whether it's expanded or collapsed. The state is: <strong className="text-primary">{isOpen ? 'OPEN' : 'CLOSED'}</strong>
              </div>
            </CollapsiblePanel>
          </div>
        </CollapsibleRoot>
      </div>
    )
  },
}

/**
 * Disabled State Story
 * Non-interactive collapsible
 */
export const DisabledState: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <CollapsibleRoot disabled>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm opacity-50">
          <CollapsibleTrigger>
            Disabled Collapsible (Cannot interact)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This content is not accessible because the collapsible is disabled.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Enabled Collapsible (Can interact)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible is enabled and fully interactive. Compare with the disabled one above.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Custom Icon Story
 * Using custom SVG icons
 */
export const CustomIcon: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger
            icon={
              <svg className="w-5 h-5 text-[#0ec2bc] transition-transform duration-200 group-data-[state=open]:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Custom Arrow Icon (Right)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible uses a custom right arrow icon that rotates 90 degrees when opened.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger
            icon={
              <svg className="w-5 h-5 text-[#0ec2bc] transition-transform duration-200 group-data-[state=open]:scale-0 group-data-[state=closed]:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Custom Plus Icon
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible uses a plus icon that scales to 0 when opened, creating a fade effect.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger showIcon={false}>
            No Icon
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible has no icon at all, showing just the text trigger.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Image Gallery Expand Story
 * Collapsible image grid
 */
export const ImageGallery: Story = {
  render: () => (
    <div className="w-[700px]">
      <Card>
        <CardHeader>
          <CardTitle>Ocean Photography</CardTitle>
        </CardHeader>
        <CardPanel>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-primary/10 border border-primary/20" />
            ))}
          </div>

          <CollapsibleRoot>
            <CollapsibleTrigger className="w-full text-center py-2 rounded-lg bg-card/70 border border-border hover:border-primary/30">
              Show More Images
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-primary/10 border border-primary/20" />
                ))}
              </div>
            </CollapsiblePanel>
          </CollapsibleRoot>
        </CardPanel>
      </Card>
    </div>
  ),
}

/**
 * Description Expand Story
 * Read more/less pattern
 */
export const DescriptionExpand: Story = {
  render: () => (
    <div className="w-[600px]">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Marine Biology Course</CardTitle>
              <Badge className="mt-2" variant="secondary">Featured</Badge>
            </div>
          </div>
        </CardHeader>
        <CardPanel>
          <p className="text-sm text-[#C4C8D4] mb-3">
            Explore the fascinating world of marine life in this comprehensive course covering
            ocean ecosystems, marine species, and conservation efforts.
          </p>

          <CollapsibleRoot>
            <CollapsibleTrigger className="text-primary text-sm font-medium hover:underline">
              Read more
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="text-sm text-[#C4C8D4] space-y-2 mt-2">
                <p>
                  This 12-week course takes you on a deep dive into marine biology, covering topics
                  from microscopic plankton to massive whales. You'll learn about ocean currents,
                  food chains, symbiotic relationships, and the impact of climate change on marine
                  ecosystems.
                </p>
                <p>
                  The course includes interactive labs, virtual dives, and guest lectures from
                  leading marine biologists. Perfect for students, educators, or anyone passionate
                  about ocean conservation.
                </p>
              </div>
            </CollapsiblePanel>
          </CollapsibleRoot>
        </CardPanel>
      </Card>
    </div>
  ),
}

/**
 * Multiple Collapsibles Story
 * Multiple independent collapsible sections
 */
export const MultipleCollapsibles: Story = {
  render: () => (
    <div className="w-[600px] space-y-2">
      {[
        { title: 'Section 1: Introduction', content: 'This is the first collapsible section. Each section operates independently.' },
        { title: 'Section 2: Getting Started', content: 'The second section can be opened while the first is still open or closed.' },
        { title: 'Section 3: Advanced Topics', content: 'All sections maintain their own state and don\'t affect each other.' },
        { title: 'Section 4: Examples', content: 'You can open as many sections as you want at the same time.' },
      ].map((section, i) => (
        <CollapsibleRoot key={i}>
          <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm hover:border-primary/20 transition-colors">
            <CollapsibleTrigger>
              {section.title}
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="text-sm text-[#C4C8D4] font-sans font-light">
                {section.content}
              </div>
            </CollapsiblePanel>
          </div>
        </CollapsibleRoot>
      ))}
    </div>
  ),
}

/**
 * Nested Collapsibles Story
 * Collapsibles inside collapsibles
 */
export const NestedCollapsibles: Story = {
  render: () => (
    <div className="w-[650px]">
      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Parent Section
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              This is the parent collapsible content. It contains nested collapsible sections below.
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              <CollapsibleRoot>
                <div className="rounded-lg border border-border bg-card/50 backdrop-blur-12 p-3 shadow-sm">
                  <CollapsibleTrigger className="text-sm">
                    Child Section 1
                  </CollapsibleTrigger>
                  <CollapsiblePanel>
                    <div className="text-sm text-[#C4C8D4] font-sans font-light">
                      This is the first nested collapsible section.
                    </div>
                  </CollapsiblePanel>
                </div>
              </CollapsibleRoot>

              <CollapsibleRoot>
                <div className="rounded-lg border border-border bg-card/50 backdrop-blur-12 p-3 shadow-sm">
                  <CollapsibleTrigger className="text-sm">
                    Child Section 2
                  </CollapsibleTrigger>
                  <CollapsiblePanel>
                    <div className="text-sm text-[#C4C8D4] font-sans font-light">
                      This is the second nested collapsible section.
                    </div>
                  </CollapsiblePanel>
                </div>
              </CollapsibleRoot>
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Glass Effect Card Story
 * Collapsible with enhanced glass morphism
 */
export const GlassEffectCard: Story = {
  render: () => (
    <div className="w-[600px]">
      <div className="rounded-lg border border-primary/30 bg-card/70 backdrop-blur-16 p-6 shadow-lg shadow-primary/10">
        <CollapsibleRoot>
          <CollapsibleTrigger className="mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-decorative text-lg text-white">Glass Morphism Effect</div>
                <div className="text-xs text-[#C4C8D4]">Enhanced visual design</div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light space-y-2 mt-2">
              <p>
                This collapsible features enhanced glass morphism with semi-transparent backgrounds,
                backdrop blur, and subtle primary color accents.
              </p>
              <p>
                The design creates depth and visual hierarchy while maintaining the clean,
                modern aesthetic of the Ozean Licht design system.
              </p>
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>
      </div>
    </div>
  ),
}

/**
 * Sidebar Section Story
 * Collapsible navigation sections
 */
export const SidebarSection: Story = {
  render: () => (
    <div className="w-[280px]">
      <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-3 space-y-2">
        <CollapsibleRoot defaultOpen>
          <CollapsibleTrigger className="px-3 py-2 rounded-md hover:bg-primary/5">
            <span className="text-sm font-medium">Dashboard</span>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="pl-3 space-y-1">
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Overview</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Analytics</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Reports</div>
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>

        <CollapsibleRoot>
          <CollapsibleTrigger className="px-3 py-2 rounded-md hover:bg-primary/5">
            <span className="text-sm font-medium">Settings</span>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="pl-3 space-y-1">
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Profile</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Security</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Notifications</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Appearance</div>
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>

        <CollapsibleRoot>
          <CollapsibleTrigger className="px-3 py-2 rounded-md hover:bg-primary/5">
            <span className="text-sm font-medium">Help</span>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="pl-3 space-y-1">
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Documentation</div>
              <div className="px-3 py-2 text-sm text-[#C4C8D4] hover:text-primary cursor-pointer rounded-md hover:bg-primary/5">Support</div>
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>
      </div>
    </div>
  ),
}

/**
 * Animation Variants Story
 * Different animation durations
 */
export const AnimationVariants: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Fast Animation (150ms)
          </CollapsibleTrigger>
          <CollapsiblePanel className="duration-150">
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible animates quickly with a 150ms duration.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Normal Animation (300ms - Default)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible uses the default 300ms animation duration.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Slow Animation (500ms)
          </CollapsibleTrigger>
          <CollapsiblePanel className="duration-500">
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This collapsible animates slowly with a 500ms duration.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Keep Mounted Story
 * Content stays in DOM when collapsed
 */
export const KeepMounted: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Default (Unmounted when closed)
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This content is removed from the DOM when collapsed. Check the DevTools Elements panel.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>

      <CollapsibleRoot>
        <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
          <CollapsibleTrigger>
            Keep Mounted (Stays in DOM)
          </CollapsibleTrigger>
          <CollapsiblePanel keepMounted>
            <div className="text-sm text-[#C4C8D4] font-sans font-light">
              This content stays in the DOM even when collapsed. Useful for preserving state or
              improving accessibility. Check the DevTools Elements panel.
            </div>
          </CollapsiblePanel>
        </div>
      </CollapsibleRoot>
    </div>
  ),
}

/**
 * Accessibility Story
 * Demonstrates ARIA attributes and keyboard navigation
 */
export const Accessibility: Story = {
  render: () => (
    <div className="w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
        </CardHeader>
        <CardPanel>
          <div className="space-y-4">
            <p className="text-sm text-[#C4C8D4]">
              The Collapsible component includes comprehensive ARIA attributes:
            </p>

            <CollapsibleRoot>
              <div className="rounded-lg border border-border bg-card/70 backdrop-blur-12 p-4 shadow-sm">
                <CollapsibleTrigger>
                  Click or press Enter/Space to toggle
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <div className="text-sm text-[#C4C8D4] font-sans font-light space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                      <li><code className="text-primary">aria-expanded</code>: Indicates open/closed state</li>
                      <li><code className="text-primary">aria-controls</code>: Links trigger to content</li>
                      <li><code className="text-primary">role="button"</code>: Identifies trigger as interactive</li>
                      <li><code className="text-primary">data-state</code>: Provides visual state hooks</li>
                    </ul>
                    <p className="mt-2">
                      Keyboard navigation works with <kbd className="px-1 py-0.5 text-xs bg-primary/20 rounded">Enter</kbd> and{' '}
                      <kbd className="px-1 py-0.5 text-xs bg-primary/20 rounded">Space</kbd> keys.
                    </p>
                  </div>
                </CollapsiblePanel>
              </div>
            </CollapsibleRoot>
          </div>
        </CardPanel>
      </Card>
    </div>
  ),
}
