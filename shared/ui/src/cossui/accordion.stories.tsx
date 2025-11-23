import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from './accordion'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from './card'
import { Button } from './button'

const meta: Meta<typeof Accordion> = {
  title: 'Tier 1: Primitives/CossUI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accordion component from Coss UI (Base UI) adapted for Ozean Licht design system. Features glass morphism effects, keyboard navigation, and comprehensive accessibility support. Supports both collapsible and single-open modes.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

/**
 * Default Accordion Story
 * Single item accordion demonstrating basic structure with smooth animations
 */
export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>What is the Ozean Licht design system?</AccordionTrigger>
          <AccordionPanel>
            The Ozean Licht design system is a modern, ocean-themed design framework featuring
            oceanic cyan colors (#0ec2bc) and deep ocean dark backgrounds (#00070F). It includes
            glass morphism effects, smooth animations, and comprehensive accessibility support.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

/**
 * Multiple Items Accordion Story
 * Standard accordion with three items, demonstrating typical usage
 */
export const MultipleItems: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
      <AccordionItem>
        <AccordionTrigger>What is glass morphism?</AccordionTrigger>
        <AccordionPanel>
          Glass morphism is a modern UI design trend that uses semi-transparent, frosted glass
          effect backgrounds combined with backdrop blur. It creates depth and visual hierarchy
          while maintaining a clean, contemporary aesthetic inspired by modern OS interfaces.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>How does the dark theme work?</AccordionTrigger>
        <AccordionPanel>
          The Ozean Licht dark theme uses a deep ocean dark background (#00070F) paired with
          oceanic cyan accents (#0ec2bc). This creates a soothing yet professional appearance
          perfect for extended viewing and reduces eye strain in low-light environments.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>What components are available?</AccordionTrigger>
        <AccordionPanel>
          The Ozean Licht design system includes Button, Card, Accordion, Tabs, Dialog, Input,
          Label, Badge, Alert, Spinner, Progress, Checkbox, and more. All components follow
          the same design language and accessibility standards.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  ),
}

/**
 * All Items Expanded Story
 * Accordion where all items start in expanded state
 */
export const AllItemsExpanded: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
      <AccordionItem>
        <AccordionTrigger>Component A - Initially Expanded</AccordionTrigger>
        <AccordionPanel>
          This item is expanded by default. You can click the trigger to collapse it. All items
          in this accordion start in the expanded state to show all content at once.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Component B - Initially Expanded</AccordionTrigger>
        <AccordionPanel>
          Similarly, this item is also expanded by default. This pattern is useful when you want
          to present all information upfront and let users collapse sections they don't need.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Component C - Initially Expanded</AccordionTrigger>
        <AccordionPanel>
          All items remain expanded until the user clicks to collapse them individually. This
          approach works well for reference material or onboarding content.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  ),
}

/**
 * Collapsible Mode Story
 * Accordion allowing multiple items open simultaneously
 */
export const CollapsibleMode: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion type="multiple">
      <AccordionItem>
        <AccordionTrigger>Feature One</AccordionTrigger>
        <AccordionPanel>
          In collapsible mode, you can have multiple accordion items open at the same time.
          This is useful when users need to compare information across different sections.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Feature Two</AccordionTrigger>
        <AccordionPanel>
          Open this section while keeping others open. You'll notice that clicking doesn't close
          other expanded items - each item operates independently.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Feature Three</AccordionTrigger>
        <AccordionPanel>
          This mode provides maximum flexibility. Users can view multiple sections simultaneously,
          making it ideal for detailed comparisons or related information.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Feature Four</AccordionTrigger>
        <AccordionPanel>
          All items can remain open at once, allowing comprehensive information review without
          losing context by closing previously opened sections.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  ),
}

/**
 * Single Mode Story
 * Accordion allowing only one item open at a time (default behavior)
 */
export const SingleMode: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion type="single" collapsible>
      <AccordionItem>
        <AccordionTrigger>Requirement 1</AccordionTrigger>
        <AccordionPanel>
          In single mode with collapsible enabled, only one item can be open at a time. Opening
          a new item automatically closes the previously opened one.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Requirement 2</AccordionTrigger>
        <AccordionPanel>
          This is the standard accordion behavior for sequential content exploration. It's
          perfect for step-by-step processes or sequential information flow.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Requirement 3</AccordionTrigger>
        <AccordionPanel>
          You can click the trigger again to collapse the currently open item, leaving no items
          expanded when collapsible is true.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Requirement 4</AccordionTrigger>
        <AccordionPanel>
          This mode ensures clean, focused presentation of information while reducing visual
          clutter on the screen.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  ),
}

/**
 * Disabled Items Story
 * Accordion demonstrating disabled accordion items
 */
export const DisabledItems: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion type="single" collapsible>
      <AccordionItem>
        <AccordionTrigger>Available Item</AccordionTrigger>
        <AccordionPanel>
          This item is fully interactive. You can click to expand and collapse it normally.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem disabled>
        <AccordionTrigger>Disabled Item - Premium Feature</AccordionTrigger>
        <AccordionPanel>
          This item is disabled and cannot be expanded. It might be unavailable due to user
          permissions, subscription level, or feature status.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionTrigger>Available Item</AccordionTrigger>
        <AccordionPanel>
          Another fully functional item. Disabled items are visually distinct with reduced
          opacity and no hover effects to indicate their unavailability.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem disabled>
        <AccordionTrigger>Disabled Item - Coming Soon</AccordionTrigger>
        <AccordionPanel>
          This item is also disabled. Disabled items provide useful context while preventing
          user interaction until they become available.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </div>
  ),
}

/**
 * FAQ Example Story
 * Realistic FAQ section using accordion for common questions
 */
export const FAQExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-decorative text-foreground mb-2">Frequently Asked Questions</h2>
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          Find answers to common questions about our service
        </p>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem>
          <AccordionTrigger>How do I get started with the Ozean Licht design system?</AccordionTrigger>
          <AccordionPanel>
            Visit the documentation page and follow the installation guide. You can install the
            design system package via npm or yarn, import the components you need, and start using
            them in your project. All components come with full TypeScript support and comprehensive
            examples.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Is the design system accessible?</AccordionTrigger>
          <AccordionPanel>
            Yes! The Ozean Licht design system is built with accessibility as a core principle.
            All components follow WCAG 2.1 AA standards and include proper ARIA attributes, keyboard
            navigation support, and semantic HTML structure.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Can I customize the colors and styling?</AccordionTrigger>
          <AccordionPanel>
            Absolutely. The design system uses CSS variables and Tailwind CSS classes for easy
            customization. You can override colors, spacing, typography, and other design tokens
            to match your specific brand requirements.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Is there TypeScript support?</AccordionTrigger>
          <AccordionPanel>
            Yes, all components are built with TypeScript and include comprehensive type definitions.
            You'll get full type safety and intellisense support in your IDE for all component props
            and events.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>How often is the design system updated?</AccordionTrigger>
          <AccordionPanel>
            We release updates regularly with new components, improvements, and bug fixes. Subscribe
            to our release notes or follow our documentation to stay informed about new features and
            changes.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>What if I need help or have feedback?</AccordionTrigger>
          <AccordionPanel>
            We appreciate your feedback! Please reach out to our support team via email, Discord,
            or GitHub discussions. You can also submit bug reports and feature requests through our
            GitHub repository.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

/**
 * Settings Sections Story
 * Accordion used for organizing application settings into collapsible sections
 */
export const SettingsSections: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Configure your preferences and account settings</CardDescription>
      </CardHeader>
      <CardPanel>
        <Accordion type="single" collapsible>
          <AccordionItem>
            <AccordionTrigger>General Settings</AccordionTrigger>
            <AccordionPanel className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Application Name</label>
                <input
                  type="text"
                  placeholder="My Awesome App"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder-[#C4C8D4]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <select className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Security Settings</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Two-Factor Authentication</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Session Timeout Protection</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Login Alerts</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Notification Preferences</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Email Notifications</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Push Notifications</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">SMS Notifications</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Privacy Settings</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Profile Visibility</label>
                <select className="w-24 h-7 px-2 rounded-md border border-border bg-card/50 text-xs">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Analytics Tracking</label>
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardPanel>
    </Card>
  ),
}

/**
 * Nested Accordions Story
 * Accordion containing sub-accordions for hierarchical content
 */
export const NestedAccordions: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem>
          <AccordionTrigger>Core Concepts</AccordionTrigger>
          <AccordionPanel>
            <div className="space-y-2">
              <p className="text-sm text-[#C4C8D4] mb-3">
                Master the fundamental concepts of the design system:
              </p>
              <Accordion type="single" collapsible className="pl-4 border-l border-primary/20">
                <AccordionItem>
                  <AccordionTrigger className="text-sm">Glass Morphism</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-xs text-[#C4C8D4]">
                      Glass morphism combines semi-transparent backgrounds with backdrop blur to create
                      a frosted glass effect. It's widely used in modern UI design.
                    </p>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionTrigger className="text-sm">Dark Theme Architecture</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-xs text-[#C4C8D4]">
                      The dark theme uses a deep ocean background with oceanic cyan accents for contrast
                      and visual hierarchy. This reduces eye strain and creates visual appeal.
                    </p>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionTrigger className="text-sm">Accessibility Standards</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-xs text-[#C4C8D4]">
                      All components follow WCAG 2.1 AA standards with keyboard navigation, screen reader
                      support, and proper color contrast ratios.
                    </p>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Advanced Topics</AccordionTrigger>
          <AccordionPanel>
            <div className="space-y-2">
              <p className="text-sm text-[#C4C8D4] mb-3">
                Explore advanced usage patterns and customization:
              </p>
              <Accordion type="single" collapsible className="pl-4 border-l border-primary/20">
                <AccordionItem>
                  <AccordionTrigger className="text-sm">Custom Theming</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-xs text-[#C4C8D4]">
                      Override CSS variables and Tailwind classes to create custom themes matching your
                      brand guidelines.
                    </p>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionTrigger className="text-sm">Component Composition</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-xs text-[#C4C8D4]">
                      Combine multiple components to create complex, feature-rich interfaces while
                      maintaining consistency with the design system.
                    </p>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

/**
 * With Icons Story
 * Accordion items with emoji icons for visual distinction
 */
export const WithIcons: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem>
          <AccordionTrigger>🎨 Design Principles</AccordionTrigger>
          <AccordionPanel>
            The Ozean Licht design system follows key principles: clarity, consistency, accessibility,
            and beauty. Every component is designed with these values in mind to create a cohesive,
            professional user experience.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>⚙️ Technical Implementation</AccordionTrigger>
          <AccordionPanel>
            Built with React, TypeScript, Tailwind CSS, and Base UI. Components are fully typed,
            composable, and follow modern web standards. All source code is available on GitHub.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>📚 Documentation</AccordionTrigger>
          <AccordionPanel>
            Comprehensive documentation with usage examples, API references, and design guidelines.
            Storybook stories showcase each component's capabilities with interactive examples.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>🌊 Ocean Theme</AccordionTrigger>
          <AccordionPanel>
            Inspired by the beauty and tranquility of the ocean, the design system features oceanic
            cyan colors, deep water backgrounds, and flowing animations that evoke a sense of calm
            and sophistication.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>♿ Accessibility</AccordionTrigger>
          <AccordionPanel>
            Full WCAG 2.1 AA compliance with keyboard navigation, screen reader support, proper color
            contrast, and semantic HTML. Everyone can use these components effectively.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

/**
 * Long Content Story
 * Accordion with longer text content and multiple paragraphs
 */
export const LongContent: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem>
          <AccordionTrigger>Extended Content Example</AccordionTrigger>
          <AccordionPanel className="space-y-3">
            <p className="text-sm text-[#C4C8D4]">
              The Ozean Licht design system represents a comprehensive approach to modern UI design,
              combining aesthetic excellence with functional accessibility. This system was created
              with the vision of providing developers and designers with a solid foundation for building
              beautiful, accessible applications.
            </p>
            <p className="text-sm text-[#C4C8D4]">
              Each component in the system has been carefully crafted to work seamlessly with others.
              The design tokens, typography scales, and color palettes are all aligned to create visual
              harmony. Whether you're building a simple landing page or a complex enterprise application,
              these components provide the building blocks you need.
            </p>
            <p className="text-sm text-[#C4C8D4]">
              The glass morphism effects, inspired by modern operating systems, create a sense of depth
              and sophistication. Combined with the oceanic color palette, the result is a design system
              that feels both contemporary and timeless.
            </p>
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-primary font-medium">Key Features:</p>
              <ul className="text-xs text-[#C4C8D4] mt-2 space-y-1 list-disc list-inside">
                <li>Fully accessible components with WCAG 2.1 AA compliance</li>
                <li>Complete TypeScript support with comprehensive type definitions</li>
                <li>Glass morphism effects for modern aesthetic appeal</li>
                <li>Responsive design that works across all device sizes</li>
                <li>Easy customization through CSS variables and Tailwind classes</li>
              </ul>
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Installation and Setup</AccordionTrigger>
          <AccordionPanel className="space-y-3">
            <p className="text-sm text-[#C4C8D4]">
              Getting started with the Ozean Licht design system is simple and straightforward. Follow
              these steps to integrate it into your project:
            </p>
            <div className="bg-card/50 backdrop-blur-8 border border-border rounded-md p-3 space-y-2">
              <p className="text-xs font-mono text-primary">npm install @ozean-licht/ui</p>
              <p className="text-xs font-mono text-primary">yarn add @ozean-licht/ui</p>
            </div>
            <p className="text-sm text-[#C4C8D4]">
              Once installed, you can import components directly into your application. The design system
              works best with Tailwind CSS and modern TypeScript configurations. Refer to the detailed
              setup guide in the documentation for framework-specific instructions.
            </p>
            <p className="text-xs text-[#C4C8D4] italic">
              For troubleshooting and additional help, visit our documentation or reach out to our support team.
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

/**
 * Glass Effect Variations Story
 * Accordion demonstrating different glass morphism intensity levels
 */
export const GlassEffectVariations: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-decorative text-foreground mb-3">Standard Glass Effect</h3>
        <Accordion type="single" collapsible>
          <AccordionItem>
            <AccordionTrigger>Standard Item</AccordionTrigger>
            <AccordionPanel>
              This accordion uses the standard glass morphism effect with backdrop blur and
              semi-transparent background. Perfect for most use cases.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Another Standard Item</AccordionTrigger>
            <AccordionPanel>
              The default glass effect provides a balanced appearance of depth and readability.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h3 className="text-lg font-decorative text-foreground mb-3">Subtle Glass Effect</h3>
        <Accordion type="single" collapsible>
          <AccordionItem className="glass-subtle">
            <AccordionTrigger>Subtle Glass Item</AccordionTrigger>
            <AccordionPanel>
              This accordion item uses a subtle glass effect with minimal blur and reduced opacity.
              Ideal for integrating into complex layouts without overwhelming other elements.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className="glass-subtle">
            <AccordionTrigger>Subtle Glass Item</AccordionTrigger>
            <AccordionPanel>
              The subtle effect maintains visual coherence while still benefiting from glass morphism styling.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h3 className="text-lg font-decorative text-foreground mb-3">Strong Glass Effect</h3>
        <Accordion type="single" collapsible>
          <AccordionItem className="glass-card-strong">
            <AccordionTrigger>Strong Glass Item</AccordionTrigger>
            <AccordionPanel>
              This accordion uses a stronger glass effect with increased blur and opacity. Perfect for
              highlighting important content or creating emphasis in the interface.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className="glass-card-strong">
            <AccordionTrigger>Strong Glass Item</AccordionTrigger>
            <AccordionPanel>
              The strong effect creates a more pronounced visual separation and presence on the page.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
}

/**
 * Controlled Component Story
 * Accordion with external state management
 */
export const ControlledComponent: Story = {
  render: () => {
    const [openValue, setOpenValue] = useState('item-1')

    return (
      <div className="space-y-4 w-full max-w-2xl">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-foreground">Current Open Item: {openValue}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant={openValue === 'item-1' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setOpenValue('item-1')}
            >
              Open Item 1
            </Button>
            <Button
              variant={openValue === 'item-2' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setOpenValue('item-2')}
            >
              Open Item 2
            </Button>
            <Button
              variant={openValue === 'item-3' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setOpenValue('item-3')}
            >
              Open Item 3
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpenValue('')}>
              Close All
            </Button>
          </div>
        </div>

        <Accordion type="single" value={openValue} onValueChange={setOpenValue}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Controlled Item 1</AccordionTrigger>
            <AccordionPanel>
              This accordion is controlled by external React state. You can programmatically open
              or close items using the buttons above.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Controlled Item 2</AccordionTrigger>
            <AccordionPanel>
              Perfect for syncing accordion state with URL routes, analytics tracking, or other
              application state management.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Controlled Item 3</AccordionTrigger>
            <AccordionPanel>
              External control enables advanced features like keyboard shortcuts, programmatic
              navigation, and state persistence.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    )
  },
}

/**
 * Product Documentation Story
 * Realistic example using accordion for product documentation sections
 */
export const ProductDocumentation: Story = {
  render: () => (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Component Documentation</CardTitle>
        <CardDescription>
          Complete API reference and usage examples for Ozean Licht design system components
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <Accordion type="single" collapsible>
          <AccordionItem>
            <AccordionTrigger>Button Component API</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Props:</p>
                <div className="text-xs text-[#C4C8D4] space-y-1 bg-card/50 p-2 rounded border border-border">
                  <p>variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'</p>
                  <p>size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon'</p>
                  <p>disabled?: boolean</p>
                  <p>className?: string</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Example Usage:</p>
                <div className="text-xs text-primary bg-card/50 p-2 rounded border border-border font-mono">
                  {'<Button variant="primary" size="lg">Click Me</Button>'}
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Accordion Component API</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Props:</p>
                <div className="text-xs text-[#C4C8D4] space-y-1 bg-card/50 p-2 rounded border border-border">
                  <p>type?: 'single' | 'multiple'</p>
                  <p>collapsible?: boolean</p>
                  <p>value?: string</p>
                  <p>defaultValue?: string</p>
                  <p>onValueChange?: (value: string) =&gt; void</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Sub-components:</p>
                <div className="text-xs text-[#C4C8D4] space-y-1 bg-card/50 p-2 rounded border border-border">
                  <p>AccordionItem, AccordionTrigger, AccordionPanel</p>
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Card Component API</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Sub-components:</p>
                <div className="text-xs text-[#C4C8D4] space-y-1 bg-card/50 p-2 rounded border border-border">
                  <p>Card, CardHeader, CardTitle, CardDescription, CardPanel, CardFooter</p>
                </div>
              </div>
              <p className="text-xs text-[#C4C8D4]">
                Cards provide a container for grouping related content. They support glass morphism
                effects and work well with other components.
              </p>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger>Accessibility Guidelines</AccordionTrigger>
            <AccordionPanel className="space-y-2">
              <p className="text-xs text-[#C4C8D4]">
                All components follow WCAG 2.1 AA standards. Key accessibility features include:
              </p>
              <ul className="text-xs text-[#C4C8D4] space-y-1 list-disc list-inside bg-card/50 p-2 rounded border border-border">
                <li>Keyboard navigation support (Tab, Enter, Space, Arrow keys)</li>
                <li>Proper ARIA attributes and roles</li>
                <li>Color contrast ratios ≥ 4.5:1 for normal text</li>
                <li>Screen reader friendly semantic HTML</li>
              </ul>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardPanel>
    </Card>
  ),
}

/**
 * Pricing Plans Story
 * Creative example using accordion for pricing tier details
 */
export const PricingPlans: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-decorative text-foreground mb-2">Simple, Transparent Pricing</h2>
        <p className="text-sm text-[#C4C8D4]">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Starter', 'Professional', 'Enterprise'].map((plan, idx) => (
          <div
            key={idx}
            className="p-4 bg-card/70 backdrop-blur-12 border border-border rounded-lg space-y-3"
          >
            <div>
              <p className="font-medium text-foreground text-lg">{plan}</p>
              <p className="text-sm text-primary font-decorative">
                {idx === 0 ? '$29' : idx === 1 ? '$99' : 'Custom'}/month
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-1">
              <AccordionItem>
                <AccordionTrigger className="text-sm py-2 px-2">Features</AccordionTrigger>
                <AccordionPanel className="text-xs text-[#C4C8D4] space-y-1">
                  <p>✓ {idx === 0 ? '5' : idx === 1 ? '20' : 'Unlimited'} Projects</p>
                  <p>✓ {idx === 0 ? '1GB' : idx === 1 ? '100GB' : 'Unlimited'} Storage</p>
                  <p>✓ {idx >= 1 && ''}Support {idx === 0 ? 'Email' : idx === 1 ? '24/7' : '24/7 Priority'}</p>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionTrigger className="text-sm py-2 px-2">Terms</AccordionTrigger>
                <AccordionPanel className="text-xs text-[#C4C8D4]">
                  {idx === 0
                    ? 'Billed annually. Cancel anytime.'
                    : idx === 1
                      ? 'Month-to-month billing. Free trial available.'
                      : 'Custom contracts. Dedicated support.'}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Form Sections Story
 * Accordion used to organize form steps or sections
 */
export const FormSections: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Registration Wizard</CardTitle>
        <CardDescription>Complete all sections to create your account</CardDescription>
      </CardHeader>
      <CardPanel>
        <Accordion type="single" collapsible defaultValue="personal">
          <AccordionItem value="personal">
            <AccordionTrigger>Personal Information</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <input
                  type="date"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="contact">
            <AccordionTrigger>Contact Information</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="address">
            <AccordionTrigger>Address</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Main St"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <input
                    type="text"
                    placeholder="New York"
                    className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                  />
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="password">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionPanel className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-2 mt-6">
          <Button variant="ghost" className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" className="flex-1">
            Create Account
          </Button>
        </div>
      </CardPanel>
    </Card>
  ),
}

/**
 * Different Content Types Story
 * Accordion containing various types of content (text, lists, code, etc.)
 */
export const DifferentContentTypes: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem>
          <AccordionTrigger>Text Content</AccordionTrigger>
          <AccordionPanel>
            This section contains simple text content. Accordion panels handle text content elegantly,
            with proper spacing and typography. Use accordions to organize lengthy text into digestible
            sections that users can expand when needed.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Bullet List</AccordionTrigger>
          <AccordionPanel className="space-y-2">
            <ul className="text-sm text-[#C4C8D4] space-y-1 list-disc list-inside">
              <li>First feature or benefit</li>
              <li>Second feature with expanded description</li>
              <li>Third feature highlighting key capability</li>
              <li>Fourth feature demonstrating versatility</li>
              <li>Fifth feature showing comprehensive coverage</li>
            </ul>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Numbered List</AccordionTrigger>
          <AccordionPanel className="space-y-2">
            <ol className="text-sm text-[#C4C8D4] space-y-1 list-decimal list-inside">
              <li>Start by reading the documentation</li>
              <li>Install the package using npm or yarn</li>
              <li>Import components into your project</li>
              <li>Configure any required settings</li>
              <li>Begin using components in your application</li>
            </ol>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Code Example</AccordionTrigger>
          <AccordionPanel className="space-y-2">
            <p className="text-xs text-[#C4C8D4] mb-2">TypeScript Example:</p>
            <div className="bg-card/50 border border-border rounded-md p-3 overflow-x-auto">
              <code className="text-xs text-primary font-mono leading-relaxed">
                {`import { Accordion, AccordionItem } from '@ozean-licht/ui'

export default function App() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem>
        <AccordionTrigger>Item</AccordionTrigger>
        <AccordionPanel>Content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}`}
              </code>
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Table Data</AccordionTrigger>
          <AccordionPanel className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-primary text-xs">Feature</th>
                  <th className="text-left p-2 text-primary text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="text-[#C4C8D4]">
                <tr className="border-b border-border/50">
                  <td className="p-2">Component Library</td>
                  <td className="p-2">✓ Available</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2">TypeScript Support</td>
                  <td className="p-2">✓ Available</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2">Accessibility</td>
                  <td className="p-2">✓ WCAG 2.1 AA</td>
                </tr>
                <tr>
                  <td className="p-2">Documentation</td>
                  <td className="p-2">✓ Comprehensive</td>
                </tr>
              </tbody>
            </table>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionTrigger>Mixed Content</AccordionTrigger>
          <AccordionPanel className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Key Points:</p>
              <ul className="text-sm text-[#C4C8D4] space-y-1 list-disc list-inside">
                <li>Accordions are versatile components</li>
                <li>They work with various content types</li>
                <li>Mix text, lists, and elements freely</li>
              </ul>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
              <p className="text-xs text-foreground font-medium">Tip:</p>
              <p className="text-xs text-[#C4C8D4] mt-1">
                Design accordion content for clarity and scanability. Users should quickly
                understand what each section contains.
              </p>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
