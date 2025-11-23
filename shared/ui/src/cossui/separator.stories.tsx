import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta<typeof Separator> = {
  title: 'Tier 1: Primitives/CossUI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Separator component from Coss UI adapted for Ozean Licht design system. A flexible divider element that can be used horizontally or vertically to visually separate content. Uses the Ozean Licht border color (#0E282E).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the separator line',
    },
    decorative: {
      control: 'boolean',
      description: 'If true, separator is purely decorative (role="none"). If false, acts as semantic separator.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

/**
 * Default horizontal separator - the standard usage
 */
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  render: () => (
    <div className="w-80">
      <p className="text-sm text-[#C4C8D4] mb-4">Content above separator</p>
      <Separator />
      <p className="text-sm text-[#C4C8D4] mt-4">Content below separator</p>
    </div>
  ),
}

/**
 * Horizontal separator - most common usage
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-96">
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Section One</h3>
        <p className="text-xs text-[#C4C8D4]">
          This section contains important information that requires visual separation.
        </p>
      </div>
      <Separator orientation="horizontal" />
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Section Two</h3>
        <p className="text-xs text-[#C4C8D4]">
          The separator clearly divides these distinct content sections.
        </p>
      </div>
    </div>
  ),
}

/**
 * Vertical separator - for layouts with side-by-side content
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-24">
      <div className="flex-1">
        <h4 className="text-sm font-alt font-medium text-foreground mb-2">Left Column</h4>
        <p className="text-xs text-[#C4C8D4]">Sidebar or left aligned content area</p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1">
        <h4 className="text-sm font-alt font-medium text-foreground mb-2">Right Column</h4>
        <p className="text-xs text-[#C4C8D4]">Main content or right aligned area</p>
      </div>
    </div>
  ),
}

/**
 * Separator in navigation menu context
 */
export const InNavigationMenu: Story = {
  render: () => (
    <div className="w-64 bg-card/50 backdrop-blur-8 rounded-lg border border-border p-2">
      <nav className="flex flex-col gap-1">
        <button className="w-full px-3 py-2 text-sm text-left text-[#C4C8D4] hover:bg-primary/10 rounded transition-colors">
          Dashboard
        </button>
        <button className="w-full px-3 py-2 text-sm text-left text-[#C4C8D4] hover:bg-primary/10 rounded transition-colors">
          Projects
        </button>
        <button className="w-full px-3 py-2 text-sm text-left text-[#C4C8D4] hover:bg-primary/10 rounded transition-colors">
          Settings
        </button>
        <Separator className="my-2" />
        <button className="w-full px-3 py-2 text-sm text-left text-[#C4C8D4] hover:bg-primary/10 rounded transition-colors">
          Sign Out
        </button>
      </nav>
    </div>
  ),
}

/**
 * Multiple separators in card layout
 */
export const InCardLayout: Story = {
  render: () => (
    <div className="w-96 bg-card/50 backdrop-blur-8 rounded-lg border border-border overflow-hidden">
      <div className="p-6">
        <h2 className="text-base font-alt font-semibold text-foreground mb-2">Card Title</h2>
        <p className="text-xs text-[#C4C8D4]">This card demonstrates multiple separator usage</p>
      </div>
      <Separator />
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#C4C8D4]">Feature One</span>
            <Badge variant="success">Active</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#C4C8D4]">Feature Two</span>
            <Badge variant="warning">Pending</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#C4C8D4]">Feature Three</span>
            <Badge variant="info">Updated</Badge>
          </div>
        </div>
      </div>
      <Separator />
      <div className="p-6 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Confirm
        </Button>
      </div>
    </div>
  ),
}

/**
 * Form sections separated by dividers
 */
export const InFormSections: Story = {
  render: () => (
    <div className="w-full max-w-md bg-card/50 backdrop-blur-8 rounded-lg border border-border p-6 space-y-6">
      <div>
        <h3 className="text-sm font-alt font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#C4C8D4]">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="w-full h-8 px-3 rounded-md border border-border bg-card/50 text-sm text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#C4C8D4]">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full h-8 px-3 rounded-md border border-border bg-card/50 text-sm text-foreground"
            />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-alt font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#C4C8D4]">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full h-8 px-3 rounded-md border border-border bg-card/50 text-sm text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#C4C8D4]">Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full h-8 px-3 rounded-md border border-border bg-card/50 text-sm text-foreground"
            />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-alt font-semibold text-foreground mb-4">Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
            <input type="checkbox" className="w-4 h-4" />
            Receive email notifications
          </label>
          <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
            <input type="checkbox" className="w-4 h-4" />
            Subscribe to newsletter
          </label>
        </div>
      </div>
    </div>
  ),
}

/**
 * Separator between content blocks
 */
export const BetweenContentBlocks: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8">
        <h3 className="text-base font-alt font-semibold text-foreground mb-2">Featured Article</h3>
        <p className="text-sm text-[#C4C8D4]">
          This is a featured article with important content that needs to stand out from the rest.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-base font-alt font-semibold text-foreground">Recent Updates</h3>
        <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
          <h4 className="text-sm font-medium text-foreground mb-1">Update 1: New Features Released</h4>
          <p className="text-xs text-[#C4C8D4]">Latest improvements to the platform are now live</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-base font-alt font-semibold text-foreground">Related Content</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
            <p className="text-xs text-[#C4C8D4]">Related item 1</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-8">
            <p className="text-xs text-[#C4C8D4]">Related item 2</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Separator with text label - "OR" usage
 */
export const WithOrLabel: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <Button variant="primary" className="w-full">
        Sign in with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[#C4C8D4] px-2">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full">
        Sign in with Email
      </Button>
    </div>
  ),
}

/**
 * Separator with "AND" label - for combining multiple options
 */
export const WithAndLabel: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4 p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
          <input type="checkbox" className="w-4 h-4" />
          Accept Terms and Conditions
        </label>
        <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
          <input type="checkbox" className="w-4 h-4" />
          I have read the Privacy Policy
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[#C4C8D4] px-2">AND</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
          <input type="checkbox" className="w-4 h-4" />
          Receive marketing emails
        </label>
        <label className="flex items-center gap-2 text-sm text-[#C4C8D4]">
          <input type="checkbox" className="w-4 h-4" />
          Join our community
        </label>
      </div>
    </div>
  ),
}

/**
 * Thick separator variant with custom styling
 */
export const ThickVariant: Story = {
  render: () => (
    <div className="w-96">
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Premium Section</h3>
        <p className="text-xs text-[#C4C8D4]">This thick separator emphasizes section importance</p>
      </div>
      <Separator className="h-[2px]" />
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Standard Section</h3>
        <p className="text-xs text-[#C4C8D4]">Regular content below the emphasizing separator</p>
      </div>
    </div>
  ),
}

/**
 * Colored separator - using primary color
 */
export const ColoredVariant: Story = {
  render: () => (
    <div className="w-96">
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Highlighted Section</h3>
        <p className="text-xs text-[#C4C8D4]">Section with colored separator for emphasis</p>
      </div>
      <Separator className="bg-primary/50" />
      <div className="p-4">
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Regular Section</h3>
        <p className="text-xs text-[#C4C8D4]">The primary color adds visual weight to the divider</p>
      </div>
    </div>
  ),
}

/**
 * Separator with custom spacing
 */
export const WithCustomSpacing: Story = {
  render: () => (
    <div className="w-96 space-y-8">
      <div>
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">First Content Block</h3>
        <p className="text-xs text-[#C4C8D4]">Content with generous spacing around separator</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-alt font-medium text-foreground mb-3">Second Content Block</h3>
        <p className="text-xs text-[#C4C8D4]">Extra whitespace creates breathing room</p>
      </div>
    </div>
  ),
}

/**
 * Timeline with vertical separators
 */
export const TimelineLayout: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        {[
          { title: 'Project Started', date: 'Jan 2024' },
          { title: 'Design Phase', date: 'Feb 2024' },
          { title: 'Development', date: 'Mar 2024' },
          { title: 'Testing', date: 'Apr 2024' },
          { title: 'Launch', date: 'May 2024' },
        ].map((item, index) => (
          <div key={index}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30" />
                {index < 4 && <Separator orientation="vertical" className="w-[1px] h-12 mt-2" />}
              </div>
              <div className="pt-0.5">
                <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                <p className="text-xs text-[#C4C8D4]">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * Two-column layout with vertical separator
 */
export const TwoColumnLayout: Story = {
  render: () => (
    <div className="w-full max-w-2xl bg-card/50 backdrop-blur-8 rounded-lg border border-border overflow-hidden">
      <div className="flex gap-0">
        <div className="flex-1 p-6 border-r border-border">
          <h3 className="text-base font-alt font-semibold text-foreground mb-4">Column One</h3>
          <ul className="space-y-2 text-sm text-[#C4C8D4]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Feature item
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Feature item
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Feature item
            </li>
          </ul>
        </div>
        <div className="flex-1 p-6">
          <h3 className="text-base font-alt font-semibold text-foreground mb-4">Column Two</h3>
          <ul className="space-y-2 text-sm text-[#C4C8D4]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Related item
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Related item
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Related item
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

/**
 * Separator with background gradient context
 */
export const WithGlassBackground: Story = {
  render: () => (
    <div className="w-full max-w-2xl p-8 rounded-lg bg-gradient-to-br from-background via-card to-[#055D75]/20 space-y-6">
      <div>
        <h3 className="text-base font-alt font-semibold text-foreground mb-2">Gradient Background Example</h3>
        <p className="text-sm text-[#C4C8D4]">Separator over glass morphism background</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-base font-alt font-semibold text-foreground mb-2">Secondary Content</h3>
        <p className="text-sm text-[#C4C8D4]">The separator remains visible even with gradient backgrounds</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-base font-alt font-semibold text-foreground mb-2">Tertiary Content</h3>
        <p className="text-sm text-[#C4C8D4]">Maintains visual hierarchy and clear separation</p>
      </div>
    </div>
  ),
}

/**
 * Data table with row separators
 */
export const TableRows: Story = {
  render: () => (
    <div className="w-full max-w-2xl bg-card/50 backdrop-blur-8 rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 text-left font-medium text-[#C4C8D4]">Feature</th>
            <th className="p-3 text-left font-medium text-[#C4C8D4]">Status</th>
            <th className="p-3 text-right font-medium text-[#C4C8D4]">Progress</th>
          </tr>
        </thead>
        <tbody>
          {[
            { feature: 'Authentication', status: 'Complete', progress: '100%' },
            { feature: 'Database', status: 'In Progress', progress: '75%' },
            { feature: 'API Integration', status: 'Pending', progress: '30%' },
          ].map((row, index) => (
            <tr key={index} className={index < 2 ? 'border-b border-border' : ''}>
              <td className="p-3 text-foreground">{row.feature}</td>
              <td className="p-3">
                <Badge
                  variant={
                    row.status === 'Complete'
                      ? 'success'
                      : row.status === 'In Progress'
                        ? 'warning'
                        : 'info'
                  }
                >
                  {row.status}
                </Badge>
              </td>
              <td className="p-3 text-right text-[#C4C8D4]">{row.progress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}

/**
 * All separator variations at a glance
 */
export const AllVariations: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Horizontal Separator
        </p>
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border space-y-3">
          <p className="text-sm text-foreground">Content above</p>
          <Separator />
          <p className="text-sm text-foreground">Content below</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Custom Spacing
        </p>
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border space-y-6">
          <p className="text-sm text-foreground">Content with generous spacing</p>
          <Separator />
          <p className="text-sm text-foreground">Breath room increases readability</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Thick Variant
        </p>
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border space-y-3">
          <p className="text-sm text-foreground">Emphasized section</p>
          <Separator className="h-[2px]" />
          <p className="text-sm text-foreground">Extra thickness adds weight</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          Colored Variant
        </p>
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border space-y-3">
          <p className="text-sm text-foreground">Highlighted section</p>
          <Separator className="bg-primary/50" />
          <p className="text-sm text-foreground">Primary color emphasis</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-alt font-semibold text-[#C4C8D4] uppercase tracking-wider">
          With Label - OR
        </p>
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs font-medium text-[#C4C8D4]">OR</span>
            <Separator className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Semantic separator - not decorative
 */
export const SemanticSeparator: Story = {
  render: () => (
    <div className="w-96">
      <p className="text-sm text-[#C4C8D4] mb-4">
        This separator has semantic meaning (decorative: false)
      </p>
      <Separator decorative={false} aria-label="Section divider" />
      <p className="text-sm text-[#C4C8D4] mt-4">
        Useful for accessibility when separator is meaningful to content structure
      </p>
    </div>
  ),
}

/**
 * Responsive separator behavior
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex-1 p-4">
          <h3 className="text-sm font-alt font-medium text-foreground mb-3">Responsive Section</h3>
          <p className="text-xs text-[#C4C8D4]">
            On mobile, separators stack vertically. On larger screens, they display horizontally.
          </p>
        </div>
        <Separator orientation="horizontal" className="block md:hidden" />
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="flex-1 p-4">
          <h3 className="text-sm font-alt font-medium text-foreground mb-3">Another Section</h3>
          <p className="text-xs text-[#C4C8D4]">
            This demonstrates how separators adapt to different screen sizes.
          </p>
        </div>
      </div>
    </div>
  ),
}
