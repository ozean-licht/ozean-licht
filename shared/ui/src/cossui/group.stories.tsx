import type { Meta, StoryObj } from '@storybook/react'
import { GroupRoot, GroupLabel, GroupContent, GroupItem } from './group'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof GroupRoot> = {
  title: 'Tier 1: Primitives/CossUI/Group',
  component: GroupRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile grouping component for organizing related elements. Supports multiple orientations, spacing options, and visual variants. Perfect for button groups, form controls, navigation, and more.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GroupRoot>

/**
 * Default Group Story
 * Basic horizontal group with default spacing
 */
export const Default: Story = {
  render: () => (
    <GroupRoot>
      <GroupItem>
        <Button variant="primary" size="default">First</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="primary" size="default">Second</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="primary" size="default">Third</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * With Label Story
 * Group with a descriptive label using proper ARIA relationships
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <GroupRoot orientation="vertical" labelId="actions-label">
        <GroupLabel id="actions-label">Quick Actions</GroupLabel>
        <GroupContent orientation="vertical" spacing="normal">
          <GroupItem>
            <Button variant="outline" size="default" className="w-full justify-start">
              Create New Document
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="default" className="w-full justify-start">
              Upload Files
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="default" className="w-full justify-start">
              Share Workspace
            </Button>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Horizontal Orientation Story
 * Classic button group toolbar layout
 */
export const HorizontalOrientation: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="normal">
      <GroupItem>
        <Button variant="outline" size="default">Bold</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="default">Italic</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="default">Underline</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="default">Strike</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Vertical Orientation Story
 * Stacked menu-style layout
 */
export const VerticalOrientation: Story = {
  render: () => (
    <div className="w-64">
      <GroupRoot orientation="vertical" spacing="normal">
        <GroupItem>
          <Button variant="ghost" size="default" className="w-full justify-start">
            Dashboard
          </Button>
        </GroupItem>
        <GroupItem>
          <Button variant="ghost" size="default" className="w-full justify-start">
            Projects
          </Button>
        </GroupItem>
        <GroupItem>
          <Button variant="ghost" size="default" className="w-full justify-start">
            Team
          </Button>
        </GroupItem>
        <GroupItem>
          <Button variant="ghost" size="default" className="w-full justify-start">
            Settings
          </Button>
        </GroupItem>
      </GroupRoot>
    </div>
  ),
}

/**
 * Tight Spacing Story
 * Minimal spacing between items
 */
export const TightSpacing: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="tight">
      <GroupItem>
        <Button variant="outline" size="sm">1</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="sm">2</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="sm">3</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="sm">4</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="sm">5</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Normal Spacing Story
 * Default comfortable spacing
 */
export const NormalSpacing: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="normal">
      <GroupItem>
        <Button variant="primary" size="default">Save</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="default">Cancel</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="ghost" size="default">Reset</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Loose Spacing Story
 * Generous spacing for breathing room
 */
export const LooseSpacing: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="loose">
      <GroupItem>
        <Button variant="primary" size="lg">Create</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="secondary" size="lg">Edit</Button>
      </GroupItem>
      <GroupItem>
        <Button variant="destructive" size="lg">Delete</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Bordered Variant Story
 * Group with visible border and glass effect
 */
export const BorderedVariant: Story = {
  render: () => (
    <GroupRoot orientation="vertical" spacing="normal" variant="bordered" labelId="settings-label">
      <GroupLabel id="settings-label">Account Settings</GroupLabel>
      <GroupContent orientation="vertical" spacing="normal">
        <GroupItem>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-[#C4C8D4]">Email Notifications</span>
            <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
          </div>
        </GroupItem>
        <GroupItem>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-[#C4C8D4]">Two-Factor Auth</span>
            <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
          </div>
        </GroupItem>
        <GroupItem>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-[#C4C8D4]">Marketing Emails</span>
            <input type="checkbox" className="w-4 h-4 accent-primary rounded" defaultChecked />
          </div>
        </GroupItem>
      </GroupContent>
    </GroupRoot>
  ),
}

/**
 * Separated Items Story
 * Items with visual dividers between them
 */
export const SeparatedItems: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="normal">
      <GroupItem separated orientation="horizontal">
        <Button variant="ghost" size="default">File</Button>
      </GroupItem>
      <GroupItem separated orientation="horizontal">
        <Button variant="ghost" size="default">Edit</Button>
      </GroupItem>
      <GroupItem separated orientation="horizontal">
        <Button variant="ghost" size="default">View</Button>
      </GroupItem>
      <GroupItem separated orientation="horizontal">
        <Button variant="ghost" size="default">Help</Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Button Group Toolbar Story
 * Complete text formatting toolbar
 */
export const ButtonGroupToolbar: Story = {
  render: () => (
    <div className="space-y-4">
      <GroupRoot orientation="horizontal" spacing="normal" variant="bordered" labelId="toolbar-label">
        <GroupLabel id="toolbar-label" className="sr-only">Text Formatting Toolbar</GroupLabel>
        <GroupContent orientation="horizontal" spacing="tight">
          <GroupItem>
            <Button variant="ghost" size="icon-sm" aria-label="Bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
              </svg>
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="ghost" size="icon-sm" aria-label="Italic">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m2 4h4M4 16h4" />
              </svg>
            </Button>
          </GroupItem>
          <GroupItem separated orientation="horizontal">
            <Button variant="ghost" size="icon-sm" aria-label="Align Left">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="ghost" size="icon-sm" aria-label="Align Center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </Button>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Icon Group Story
 * Group of icon buttons for quick actions
 */
export const IconGroup: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="tight">
      <GroupItem>
        <Button variant="outline" size="icon" aria-label="Like">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="icon" aria-label="Share">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </Button>
      </GroupItem>
      <GroupItem>
        <Button variant="outline" size="icon" aria-label="Bookmark">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </Button>
      </GroupItem>
    </GroupRoot>
  ),
}

/**
 * Action Group Story
 * Primary actions with consistent styling
 */
export const ActionGroup: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <GroupRoot orientation="vertical" spacing="normal" variant="bordered" labelId="actions-label">
        <GroupLabel id="actions-label">Document Actions</GroupLabel>
        <GroupContent orientation="vertical" spacing="normal">
          <GroupItem>
            <Button variant="primary" size="default" className="w-full">
              Save Changes
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="default" className="w-full">
              Preview
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="destructive-outline" size="default" className="w-full">
              Delete Document
            </Button>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Form Control Group Story
 * Multiple related form inputs
 */
export const FormControlGroup: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <GroupRoot orientation="vertical" spacing="normal" variant="bordered" labelId="address-label">
        <GroupLabel id="address-label">Shipping Address</GroupLabel>
        <GroupContent orientation="vertical" spacing="normal">
          <GroupItem>
            <div className="space-y-2 w-full">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" type="text" placeholder="123 Main St" size="default" />
            </div>
          </GroupItem>
          <GroupItem>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" type="text" placeholder="New York" size="default" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP</Label>
                <Input id="zip" type="text" placeholder="10001" size="default" />
              </div>
            </div>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Navigation Group Story
 * Vertical navigation menu with grouped items
 */
export const NavigationGroup: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      <div>
        <GroupRoot orientation="vertical" spacing="tight" labelId="main-nav">
          <GroupLabel id="main-nav" className="px-3 mb-2">Main Menu</GroupLabel>
          <GroupContent orientation="vertical" spacing="tight">
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Home
              </Button>
            </GroupItem>
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Projects
              </Button>
            </GroupItem>
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Team
              </Button>
            </GroupItem>
          </GroupContent>
        </GroupRoot>
      </div>
      <div>
        <GroupRoot orientation="vertical" spacing="tight" labelId="settings-nav">
          <GroupLabel id="settings-nav" className="px-3 mb-2">Settings</GroupLabel>
          <GroupContent orientation="vertical" spacing="tight">
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Profile
              </Button>
            </GroupItem>
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Preferences
              </Button>
            </GroupItem>
            <GroupItem>
              <Button variant="ghost" size="default" className="w-full justify-start">
                Billing
              </Button>
            </GroupItem>
          </GroupContent>
        </GroupRoot>
      </div>
    </div>
  ),
}

/**
 * Status Group Story
 * Group of status indicators with badges
 */
export const StatusGroup: Story = {
  render: () => (
    <GroupRoot orientation="horizontal" spacing="normal" variant="bordered" labelId="status-label">
      <GroupLabel id="status-label" className="sr-only">Project Status</GroupLabel>
      <GroupContent orientation="horizontal" spacing="normal">
        <GroupItem>
          <div className="flex flex-col items-center gap-1">
            <Badge variant="success">Active</Badge>
            <span className="text-xs text-[#C4C8D4]">12 Projects</span>
          </div>
        </GroupItem>
        <GroupItem separated orientation="horizontal">
          <div className="flex flex-col items-center gap-1">
            <Badge variant="warning">Pending</Badge>
            <span className="text-xs text-[#C4C8D4]">5 Projects</span>
          </div>
        </GroupItem>
        <GroupItem separated orientation="horizontal">
          <div className="flex flex-col items-center gap-1">
            <Badge variant="destructive">Blocked</Badge>
            <span className="text-xs text-[#C4C8D4]">2 Projects</span>
          </div>
        </GroupItem>
      </GroupContent>
    </GroupRoot>
  ),
}

/**
 * Filter Group Story
 * Horizontal filter buttons
 */
export const FilterGroup: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <GroupRoot orientation="horizontal" spacing="normal" labelId="filter-label">
        <GroupLabel id="filter-label">Filter by Status</GroupLabel>
        <GroupContent orientation="horizontal" spacing="tight">
          <GroupItem>
            <Button variant="primary" size="sm">All</Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="sm">Active</Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="sm">Pending</Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="sm">Completed</Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="sm">Archived</Button>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Glass Effect Variants Story
 * Demonstrates enhanced glass morphism
 */
export const GlassEffectVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#0ec2bc]/10 rounded-lg space-y-6">
      <GroupRoot orientation="vertical" spacing="normal" variant="bordered" labelId="glass-label">
        <GroupLabel id="glass-label">Premium Glass Effect</GroupLabel>
        <GroupContent orientation="vertical" spacing="normal">
          <GroupItem>
            <div className="w-full p-4 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50">
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Enhanced glass morphism with backdrop blur creates depth and visual hierarchy
              </p>
            </div>
          </GroupItem>
          <GroupItem>
            <div className="w-full p-4 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50">
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Semi-transparent backgrounds layer beautifully over gradient backgrounds
              </p>
            </div>
          </GroupItem>
          <GroupItem>
            <div className="w-full p-4 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50">
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Perfect for the Ozean Licht design system with oceanic color palette
              </p>
            </div>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Accessibility Example Story
 * Demonstrates proper ARIA relationships and keyboard navigation
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-sm font-medium text-foreground">Accessibility Features:</p>
        <ul className="text-xs text-[#C4C8D4] list-disc list-inside mt-2 space-y-1">
          <li>role="group" attribute on GroupRoot</li>
          <li>aria-labelledby connecting labels to groups</li>
          <li>Screen reader friendly structure</li>
          <li>Keyboard navigable buttons</li>
          <li>Proper semantic HTML</li>
        </ul>
      </div>
      <GroupRoot orientation="vertical" spacing="normal" variant="bordered" labelId="a11y-label">
        <GroupLabel id="a11y-label">Accessible Action Group</GroupLabel>
        <GroupContent orientation="vertical" spacing="normal">
          <GroupItem>
            <Button variant="primary" size="default" className="w-full">
              Primary Action
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="outline" size="default" className="w-full">
              Secondary Action
            </Button>
          </GroupItem>
          <GroupItem>
            <Button variant="ghost" size="default" className="w-full">
              Tertiary Action
            </Button>
          </GroupItem>
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}

/**
 * Responsive Layout Story
 * Group that adapts to different screen sizes
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <GroupRoot
        orientation="horizontal"
        spacing="normal"
        className="flex-wrap"
        labelId="responsive-label"
      >
        <GroupLabel id="responsive-label" className="w-full mb-4">
          Responsive Button Group
        </GroupLabel>
        <GroupContent orientation="horizontal" spacing="normal" className="flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <GroupItem key={i}>
              <Button variant="outline" size="default">
                Option {i + 1}
              </Button>
            </GroupItem>
          ))}
        </GroupContent>
      </GroupRoot>
    </div>
  ),
}
