import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'Tier 1: Primitives/CossUI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Alert component from Coss UI adapted for Ozean Licht design system. Provides semantic alerts with 5 variants (default, destructive, success, warning, info) and supports AlertTitle and AlertDescription sub-components for structured content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'Visual style variant of the alert',
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

/**
 * Default Alert
 * The standard alert variant with neutral styling for general information.
 */
export const Default: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <AlertTitle>Heads Up!</AlertTitle>
      <AlertDescription>
        This is a default alert with general information. It uses the neutral color palette
        from the Ozean Licht design system.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Destructive Alert
 * Used to communicate errors, warnings about destructive actions, or critical issues.
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[500px]">
      <AlertTitle>Error Occurred</AlertTitle>
      <AlertDescription>
        Something went wrong. Please check your input and try again. Contact support if the
        issue persists.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Success Alert
 * Indicates successful operations or positive confirmations.
 */
export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[500px]">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully. The update will be reflected across all
        connected services shortly.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Warning Alert
 * Communicates warnings and cautionary information.
 */
export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[500px]">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please make sure you have a backup before proceeding
        with this operation.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Info Alert
 * Provides additional information or helpful tips.
 */
export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-[500px]">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Did you know? You can use keyboard shortcuts to navigate faster. Press Ctrl+? to
        view all available shortcuts.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Alert Without Title
 * Alert using only AlertDescription for simpler content.
 */
export const WithoutTitle: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <AlertDescription>
        This alert has no title, only a description. It's useful for brief, simple messages
        that don't require a heading.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Alert Without Description
 * Alert using only AlertTitle for minimal content.
 */
export const WithoutDescription: Story = {
  render: () => (
    <Alert variant="success" className="w-[500px]">
      <AlertTitle>Operation Complete</AlertTitle>
    </Alert>
  ),
}

/**
 * Title Only Minimal Alert
 * A very compact alert with just the title text and no sub-component.
 */
export const MinimalAlert: Story = {
  render: () => (
    <Alert variant="warning" className="w-[500px]">
      This is a simple inline alert message without structured title and description.
    </Alert>
  ),
}

/**
 * All Variants Showcase
 * A comprehensive display of all five alert variants with consistent structure.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <Alert className="w-full">
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          Use this for general information that doesn't fit into other categories.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive" className="w-full">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          Use this for errors, critical issues, or irreversible actions.
        </AlertDescription>
      </Alert>

      <Alert variant="success" className="w-full">
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          Use this for positive confirmations and successful operations.
        </AlertDescription>
      </Alert>

      <Alert variant="warning" className="w-full">
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          Use this for cautionary information and preventive messages.
        </AlertDescription>
      </Alert>

      <Alert variant="info" className="w-full">
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>
          Use this for helpful tips, information, and additional context.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Compact Variants Showcase
 * All variants displayed in a compact format with only descriptions.
 */
export const CompactVariants: Story = {
  render: () => (
    <div className="space-y-3 w-[500px]">
      <Alert className="w-full">
        <AlertDescription>Default information message</AlertDescription>
      </Alert>

      <Alert variant="destructive" className="w-full">
        <AlertDescription>An error or problem occurred</AlertDescription>
      </Alert>

      <Alert variant="success" className="w-full">
        <AlertDescription>Operation completed successfully</AlertDescription>
      </Alert>

      <Alert variant="warning" className="w-full">
        <AlertDescription>Please be aware of this important note</AlertDescription>
      </Alert>

      <Alert variant="info" className="w-full">
        <AlertDescription>Here's a helpful tip for you</AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * With Glass Effect
 * Alerts displayed over a gradient background demonstrating the glass morphism effect.
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg space-y-4">
      <Alert className="glass-card">
        <AlertTitle>Glassmorphism Default</AlertTitle>
        <AlertDescription>
          This alert uses the standard glass morphism effect with subtle backdrop blur.
        </AlertDescription>
      </Alert>

      <Alert variant="success" className="glass-card">
        <AlertTitle>Glassmorphism Success</AlertTitle>
        <AlertDescription>
          Success alerts blend seamlessly with glass effects for a modern appearance.
        </AlertDescription>
      </Alert>

      <Alert variant="warning" className="glass-card-strong">
        <AlertTitle>Glassmorphism Strong Warning</AlertTitle>
        <AlertDescription>
          The strong glass variant provides higher visibility for important warnings.
        </AlertDescription>
      </Alert>

      <Alert variant="info" className="glass-card">
        <AlertTitle>Glassmorphism Info</AlertTitle>
        <AlertDescription>
          Information alerts look elegant with the glass effect applied.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Long Content Example
 * Demonstrates how alerts handle longer, multi-line descriptions.
 */
export const LongContent: Story = {
  render: () => (
    <Alert variant="info" className="w-[600px]">
      <AlertTitle>System Maintenance Scheduled</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          We will be performing scheduled system maintenance on Saturday, December 14th from 2:00 AM
          to 6:00 AM UTC. During this time, the service may be unavailable.
        </p>
        <p>
          We apologize for any inconvenience this may cause. Please plan accordingly and reach out to
          our support team if you have any questions or concerns about the maintenance window.
        </p>
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Multiple Alerts Stack
 * Shows how alerts look when displayed in sequence, common in dashboards and forms.
 */
export const MultipleAlerts: Story = {
  render: () => (
    <div className="space-y-3 w-[600px]">
      <Alert variant="warning">
        <AlertTitle>Pending Action Required</AlertTitle>
        <AlertDescription>
          Your profile is incomplete. Please add a profile picture to complete your setup.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertTitle>Email Verified</AlertTitle>
        <AlertDescription>
          Your email address has been successfully verified. You now have full access to your account.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          Check out the new collaboration tools in the Team section. Learn more about how they can
          help your team work together.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Subscription Expires Soon</AlertTitle>
        <AlertDescription>
          Your subscription will expire in 7 days. Renew now to avoid any interruption in service.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Form Validation States
 * Alerts used for form validation feedback in different scenarios.
 */
export const FormValidation: Story = {
  render: () => (
    <div className="space-y-6 w-[500px]">
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
        />
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>Please enter a valid email address.</AlertDescription>
        </Alert>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
        />
        <Alert variant="success" className="mt-2">
          <AlertDescription>Password meets security requirements.</AlertDescription>
        </Alert>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          placeholder="username"
          className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
        />
        <Alert variant="info" className="mt-2">
          <AlertDescription>Your username will be visible to other users.</AlertDescription>
        </Alert>
      </div>
    </div>
  ),
}

/**
 * Dark Theme Showcase
 * Demonstrates how alerts appear on the Ozean Licht dark background with the dark theme.
 */
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-background p-8 rounded-lg space-y-4">
      <h3 className="text-foreground text-lg font-semibold mb-4">Alerts on Dark Background</h3>

      <Alert className="w-full">
        <AlertTitle>Default on Dark</AlertTitle>
        <AlertDescription>
          Default alert variant optimized for dark backgrounds with the Ozean Licht theme.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive" className="w-full">
        <AlertTitle>Error Message</AlertTitle>
        <AlertDescription>
          Error alerts stand out clearly against the dark background for better visibility.
        </AlertDescription>
      </Alert>

      <Alert variant="success" className="w-full">
        <AlertTitle>Success Confirmation</AlertTitle>
        <AlertDescription>
          Success alerts use vibrant colors that pop against the dark theme.
        </AlertDescription>
      </Alert>

      <Alert variant="warning" className="w-full">
        <AlertTitle>Important Warning</AlertTitle>
        <AlertDescription>
          Warning alerts provide clear visual hierarchy with distinct color treatment.
        </AlertDescription>
      </Alert>

      <Alert variant="info" className="w-full">
        <AlertTitle>Helpful Information</AlertTitle>
        <AlertDescription>
          Info alerts use a calm color palette suitable for additional context.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
