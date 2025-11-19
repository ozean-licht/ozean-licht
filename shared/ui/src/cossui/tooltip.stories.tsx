import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipPopup, TooltipProvider, TooltipContent } from './tooltip'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta<typeof Tooltip> = {
  title: 'CossUI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects. Displays brief, helpful information on hover. Use `TooltipPopup` instead of `TooltipContent` (Coss UI convention), though `TooltipContent` is aliased for compatibility.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

/**
 * Default Tooltip
 * A basic tooltip that appears on hover with a simple text message.
 * Demonstrates the minimal tooltip setup with default styling.
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipPopup>This is a tooltip</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip on Button
 * A tooltip applied to a primary button trigger.
 * Shows how tooltips enhance button interactions with contextual help.
 */
export const OnButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="primary">Save Changes</Button>} />
      <TooltipPopup>Click to save your modifications</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip on Icon Button
 * A tooltip applied to an icon button for accessibility and clarity.
 * Perfect for icon-only buttons that need text explanation.
 */
export const OnIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Delete item">
        🗑️
      </Button>} />
      <TooltipPopup>Delete this item permanently</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip on Text Element
 * A tooltip applied directly to text content.
 * Useful for explaining terms or providing additional context on text.
 */
export const OnTextElement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="font-medium text-primary underline decoration-dashed">
        Learn more about encryption
      </TooltipTrigger>
      <TooltipPopup>End-to-end encryption ensures only you can read your messages</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip with Long Content
 * A tooltip displaying longer, more detailed information.
 * Content wraps naturally while maintaining readability.
 */
export const WithLongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>API Key</TooltipTrigger>
      <TooltipPopup className="max-w-xs">
        Your API key is a secret credential used to authenticate requests to our API. Keep it secure and never share it with untrusted sources.
      </TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip Placement - Top
 * A tooltip positioned above the trigger element.
 * Default positioning for most use cases.
 */
export const PlacementTop: Story = {
  render: () => (
    <div className="flex justify-center pt-16">
      <Tooltip>
        <TooltipTrigger>Hover for top tooltip</TooltipTrigger>
        <TooltipPopup>This tooltip appears above</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Tooltip Placement - Bottom
 * A tooltip positioned below the trigger element.
 * Useful when space above is limited.
 */
export const PlacementBottom: Story = {
  render: () => (
    <div className="flex justify-center pb-16">
      <Tooltip>
        <TooltipTrigger>Hover for bottom tooltip</TooltipTrigger>
        <TooltipPopup>This tooltip appears below</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Tooltip Placement - Left
 * A tooltip positioned to the left of the trigger element.
 * Helpful for right-aligned content that needs explanation.
 */
export const PlacementLeft: Story = {
  render: () => (
    <div className="flex justify-end pr-32">
      <Tooltip>
        <TooltipTrigger>Hover for left tooltip</TooltipTrigger>
        <TooltipPopup>This tooltip appears to the left</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Tooltip Placement - Right
 * A tooltip positioned to the right of the trigger element.
 * Perfect for left-aligned content requiring additional context.
 */
export const PlacementRight: Story = {
  render: () => (
    <div className="flex justify-start pl-32">
      <Tooltip>
        <TooltipTrigger>Hover for right tooltip</TooltipTrigger>
        <TooltipPopup>This tooltip appears to the right</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Help Icon Tooltip
 * A common pattern using a help icon (?) as the trigger.
 * Demonstrates how tooltips provide contextual help in forms and interfaces.
 */
export const HelpIconTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Password</label>
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-primary/50 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-help">
          ?
        </TooltipTrigger>
        <TooltipPopup>
          Password must be at least 8 characters with uppercase, lowercase, and numbers
        </TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Form Field Hint Tooltip
 * A tooltip providing input validation hints and form field guidance.
 * Enhances user experience by explaining requirements.
 */
export const FormFieldHint: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Tooltip>
            <TooltipTrigger className="text-xs text-primary/70">info</TooltipTrigger>
            <TooltipPopup>We'll use this to send you account updates and notifications</TooltipPopup>
          </Tooltip>
        </div>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
    </div>
  ),
}

/**
 * Action Tooltip
 * A tooltip on an action button providing context about what the action does.
 * Common for toolbar buttons and primary actions.
 */
export const ActionTooltip: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Download">
          ⬇️
        </Button>} />
        <TooltipPopup>Download as PDF</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Share">
          📤
        </Button>} />
        <TooltipPopup>Share with others</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Settings">
          ⚙️
        </Button>} />
        <TooltipPopup>Configure options</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Status Indicator with Tooltip
 * A status badge or indicator with explanatory tooltip.
 * Useful for showing status with additional context on hover.
 */
export const StatusIndicatorTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger render={<Badge variant="success">Active</Badge>} />
        <TooltipPopup>System is operational and ready to use</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Badge variant="warning">Maintenance</Badge>} />
        <TooltipPopup>Scheduled maintenance in progress. Service will resume in 30 minutes.</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Badge variant="destructive">Offline</Badge>} />
        <TooltipPopup>Service is currently unavailable. Our team is investigating.</TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Tooltip on Disabled Element
 * Demonstrates tooltip behavior with disabled elements.
 * Particularly useful for explaining why an element is disabled.
 */
export const OnDisabledElement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button disabled>Submit Form</Button>} />
      <TooltipPopup>Please fill in all required fields to continue</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Keyboard Accessible Tooltip
 * A tooltip that works with keyboard focus.
 * Demonstrates accessibility support for keyboard navigation.
 */
export const KeyboardAccessible: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#C4C8D4] font-sans font-light">
        Use Tab key to focus elements. Tooltips appear on hover and focus.
      </p>
      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline">Focusable Button</Button>} />
          <TooltipPopup>Press Escape to close this tooltip</TooltipPopup>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary">Another Button</Button>} />
          <TooltipPopup>You can tab through interactive elements</TooltipPopup>
        </Tooltip>
      </div>
    </div>
  ),
}

/**
 * Interactive Tooltip with Action
 * A tooltip that contains interactive content like links or buttons.
 * Demonstrates richer tooltip experiences.
 */
export const InteractiveTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Learn more</TooltipTrigger>
      <TooltipPopup className="space-y-2">
        <p className="text-xs">Need assistance?</p>
        <Button variant="outline" size="sm" className="w-full text-xs h-7">
          View Documentation
        </Button>
      </TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Multiple Tooltips - TooltipProvider
 * Multiple tooltips wrapped in TooltipProvider for instant display.
 * Demonstrates how TooltipProvider enables fast sequential tooltip opening.
 */
export const MultipleTooltipsWithProvider: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Step 1</Button>} />
          <TooltipPopup>Start here</TooltipPopup>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Step 2</Button>} />
          <TooltipPopup>Continue here</TooltipPopup>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Step 3</Button>} />
          <TooltipPopup>Complete the process</TooltipPopup>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Step 4</Button>} />
          <TooltipPopup>Review and confirm</TooltipPopup>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

/**
 * Glass Effect Tooltip
 * Tooltip with enhanced glass morphism styling.
 * Showcases the Ozean Licht design system with backdrop blur.
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
      <Tooltip>
        <TooltipTrigger className="font-medium text-white underline decoration-dashed">
          Glass Effect Tooltip
        </TooltipTrigger>
        <TooltipPopup className="glass-card-strong">
          This tooltip features enhanced glass morphism effects with increased blur and transparency
        </TooltipPopup>
      </Tooltip>
    </div>
  ),
}

/**
 * Tooltip with Custom Styling
 * Demonstrates custom CSS classes applied to tooltip content.
 * Shows flexibility of component for different visual presentations.
 */
export const WithCustomStyling: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Custom Styled</TooltipTrigger>
      <TooltipPopup className="bg-primary/20 border-primary text-primary font-medium px-3 py-2">
        This tooltip has custom styling
      </TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip on Badge
 * A tooltip applied to a Badge component.
 * Demonstrates tooltip integration with other CossUI components.
 */
export const OnBadge: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Badge variant="primary">v2.1.0</Badge>} />
      <TooltipPopup>Latest stable release with new features and bug fixes</TooltipPopup>
    </Tooltip>
  ),
}

/**
 * Tooltip Content Alignment
 * Demonstrates how tooltip content handles different content lengths.
 * Shows wrapping behavior and alignment.
 */
export const ContentAlignment: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <Tooltip>
          <TooltipTrigger>Short</TooltipTrigger>
          <TooltipPopup>Brief</TooltipPopup>
        </Tooltip>
      </div>

      <div className="text-center">
        <Tooltip>
          <TooltipTrigger>Medium Content</TooltipTrigger>
          <TooltipPopup>This is a tooltip with medium length content</TooltipPopup>
        </Tooltip>
      </div>

      <div className="text-center">
        <Tooltip>
          <TooltipTrigger>Long Content Trigger</TooltipTrigger>
          <TooltipPopup className="max-w-xs">
            This is a longer tooltip that demonstrates how content wraps and maintains readability when the message spans multiple lines
          </TooltipPopup>
        </Tooltip>
      </div>
    </div>
  ),
}

/**
 * Tooltip with Different Trigger Types
 * Demonstrates various ways to trigger tooltips.
 * Shows flexibility with render prop, text, and element triggers.
 */
export const DifferentTriggerTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3 font-sans font-light">Trigger as Text</p>
        <Tooltip>
          <TooltipTrigger>Hover this text</TooltipTrigger>
          <TooltipPopup>Text trigger tooltip</TooltipPopup>
        </Tooltip>
      </div>

      <div>
        <p className="text-xs text-[#C4C8D4] mb-3 font-sans font-light">Trigger as Button (render prop)</p>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Click-able Button</Button>} />
          <TooltipPopup>Button trigger tooltip</TooltipPopup>
        </Tooltip>
      </div>

      <div>
        <p className="text-xs text-[#C4C8D4] mb-3 font-sans font-light">Trigger with Icon</p>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon">ℹ️</Button>} />
          <TooltipPopup>Icon trigger tooltip for information</TooltipPopup>
        </Tooltip>
      </div>
    </div>
  ),
}

/**
 * Tooltip in Complex Interface
 * Tooltips integrated into a more complex UI layout.
 * Demonstrates real-world usage patterns in data tables or dashboards.
 */
export const InComplexInterface: Story = {
  render: () => (
    <div className="w-full max-w-md p-6 rounded-lg border border-border bg-card/50 backdrop-blur-8 space-y-4">
      <h3 className="text-sm font-medium text-white">User Settings</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#C4C8D4]">2FA Enabled</span>
            <Tooltip>
              <TooltipTrigger className="text-xs text-primary/70">?</TooltipTrigger>
              <TooltipPopup>Two-factor authentication adds an extra layer of security</TooltipPopup>
            </Tooltip>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#C4C8D4]">Email Notifications</span>
            <Tooltip>
              <TooltipTrigger className="text-xs text-primary/70">?</TooltipTrigger>
              <TooltipPopup>Receive important account and security updates via email</TooltipPopup>
            </Tooltip>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#C4C8D4]">API Access</span>
            <Tooltip>
              <TooltipTrigger className="text-xs text-primary/70">?</TooltipTrigger>
              <TooltipPopup>Allow third-party applications to access your account</TooltipPopup>
            </Tooltip>
          </div>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Save Changes</Button>
      </div>
    </div>
  ),
}

/**
 * Tooltip Showcase - All Variants
 * A comprehensive showcase of tooltip variants and patterns.
 * Demonstrates the full range of tooltip capabilities.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Basic Tooltips</h3>
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="primary" size="sm">Primary</Button>} />
            <TooltipPopup>Primary button tooltip</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" size="sm">Secondary</Button>} />
            <TooltipPopup>Secondary button tooltip</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm">Outline</Button>} />
            <TooltipPopup>Outline button tooltip</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="sm">Ghost</Button>} />
            <TooltipPopup>Ghost button tooltip</TooltipPopup>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Icon Tooltips</h3>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon">✏️</Button>} />
            <TooltipPopup>Edit item</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon">👁️</Button>} />
            <TooltipPopup>View details</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon">🔗</Button>} />
            <TooltipPopup>Copy link</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon">🗑️</Button>} />
            <TooltipPopup>Delete permanently</TooltipPopup>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Status Indicators</h3>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger render={<Badge variant="success">Online</Badge>} />
            <TooltipPopup>User is currently active</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Badge variant="warning">Busy</Badge>} />
            <TooltipPopup>User is in a meeting</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Badge variant="destructive">Offline</Badge>} />
            <TooltipPopup>User is not available</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Badge variant="info">Away</Badge>} />
            <TooltipPopup>User stepped away temporarily</TooltipPopup>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Help and Information</h3>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-primary/50 text-xs font-bold text-primary hover:bg-primary/10 transition-colors">
              ?
            </TooltipTrigger>
            <TooltipPopup>Click here for help</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-primary/50 text-xs font-bold text-primary hover:bg-primary/10 transition-colors">
              ℹ️
            </TooltipTrigger>
            <TooltipPopup>Important information</TooltipPopup>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-primary/50 text-xs font-bold text-primary hover:bg-primary/10 transition-colors">
              ⚠️
            </TooltipTrigger>
            <TooltipPopup>Warning: Action cannot be undone</TooltipPopup>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
}

/**
 * Tooltip with TooltipContent Alias
 * Demonstrates compatibility with TooltipContent (shadcn/ui compatible alias).
 * Shows that both TooltipPopup and TooltipContent work identically.
 */
export const WithTooltipContentAlias: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm">Using TooltipPopup</Button>} />
        <TooltipPopup>This uses the Coss UI convention</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm">Using TooltipContent</Button>} />
        <TooltipContent>This uses the shadcn/ui compatible alias</TooltipContent>
      </Tooltip>
    </div>
  ),
}
