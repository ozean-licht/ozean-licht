import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Switch } from './switch'
import { Label } from './label'

const meta: Meta<typeof Switch> = {
  title: 'CossUI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Switch component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, Ozean turquoise (#0ec2bc) accent color, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state of the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

// ============================================================================
// BASIC STATE STORIES
// ============================================================================

/**
 * Default unchecked switch with no state applied
 */
export const Default: Story = {
  render: () => <Switch />,
}

/**
 * Switch in checked/on state (uncontrolled)
 */
export const Checked: Story = {
  render: () => <Switch defaultChecked />,
}

/**
 * Disabled unchecked switch - no interaction possible
 */
export const DisabledUnchecked: Story = {
  render: () => <Switch disabled />,
}

/**
 * Disabled checked switch - shows on state but cannot be changed
 */
export const DisabledChecked: Story = {
  render: () => <Switch defaultChecked disabled />,
}

// ============================================================================
// WITH LABEL STORIES
// ============================================================================

/**
 * Switch with associated label for better accessibility and UX
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="switch-label-example" />
      <Label htmlFor="switch-label-example">Enable notifications</Label>
    </div>
  ),
}

/**
 * Checked switch with label (uncontrolled)
 */
export const WithLabelChecked: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="switch-label-checked" defaultChecked />
      <Label htmlFor="switch-label-checked">Dark mode enabled</Label>
    </div>
  ),
}

/**
 * Disabled switch with label to show disabled styling
 */
export const WithLabelDisabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="switch-label-disabled" disabled />
      <Label htmlFor="switch-label-disabled">Feature unavailable</Label>
    </div>
  ),
}

// ============================================================================
// SWITCH WITH DESCRIPTIONS
// ============================================================================

/**
 * Switch with descriptive text below label
 */
export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Switch id="switch-desc" />
        <div>
          <Label htmlFor="switch-desc" className="block">
            Email notifications
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Receive email updates about your account activity
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Checked switch with description (uncontrolled)
 */
export const WithDescriptionChecked: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Switch id="switch-desc-checked" defaultChecked />
        <div>
          <Label htmlFor="switch-desc-checked" className="block">
            Two-factor authentication
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Secure your account with an extra layer of protection
          </p>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// CONTROLLED COMPONENT STORIES
// ============================================================================

/**
 * Uncontrolled switch using default state
 */
export const UncontrolledSwitch: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm text-muted-foreground">
        This switch manages its own state without parent component control
      </p>
      <div className="flex items-center gap-3">
        <Switch id="uncontrolled" />
        <Label htmlFor="uncontrolled">Click to toggle independently</Label>
      </div>
    </div>
  ),
}

/**
 * Controlled switch component with React state management
 */
export const ControlledSwitch: Story = {
  render: () => {
    const [isEnabled, setIsEnabled] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          Controlled by parent component via React state
        </p>
        <div className="flex items-center gap-3">
          <Switch
            id="controlled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
          <Label htmlFor="controlled">
            {isEnabled ? 'Enabled' : 'Disabled'} - Click to toggle
          </Label>
        </div>
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Current state: <span className="text-primary font-semibold">{isEnabled ? 'true' : 'false'}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// USE CASE: NOTIFICATION PREFERENCES
// ============================================================================

/**
 * Notification preferences panel with multiple switches
 */
export const NotificationPreferences: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Notification Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how you want to receive updates
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Email notifications</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Receive updates via email
            </p>
          </div>
          <Switch id="notif-email" checked />
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Push notifications</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Browser push alerts
              </p>
            </div>
            <Switch id="notif-push" checked />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">SMS alerts</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Text message notifications
              </p>
            </div>
            <Switch id="notif-sms" />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Weekly digest</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Summary of your activity
              </p>
            </div>
            <Switch id="notif-digest" checked />
          </div>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// USE CASE: PRIVACY SETTINGS
// ============================================================================

/**
 * Privacy settings panel with control switches
 */
export const PrivacySettings: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Privacy Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control your privacy preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Public profile</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Anyone can view your profile
            </p>
          </div>
          <Switch id="priv-public" />
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show online status</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Let others know when you're online
              </p>
            </div>
            <Switch id="priv-online" checked />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow messages</Label>
              <p className="text-xs text-muted-foreground mt-1">
                People can send you direct messages
              </p>
            </div>
            <Switch id="priv-messages" checked />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Analytics sharing</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Help us improve by sharing usage data
              </p>
            </div>
            <Switch id="priv-analytics" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button className="flex-1 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
          Save Changes
        </button>
        <button className="flex-1 h-8 px-3 rounded-md border border-border text-foreground text-sm font-medium transition-all hover:bg-card">
          Cancel
        </button>
      </div>
    </div>
  ),
}

// ============================================================================
// USE CASE: FEATURE FLAGS
// ============================================================================

/**
 * Feature flags panel - commonly used in admin settings
 */
export const FeatureFlags: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Feature Flags
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enable/disable experimental features
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-primary/5 border border-primary/10">
          <div>
            <Label className="text-sm font-medium text-primary">
              Dark mode
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              New dark interface (Stable)
            </p>
          </div>
          <Switch id="feat-dark" checked />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-primary/5 border border-primary/10">
          <div>
            <Label className="text-sm font-medium text-primary">
              Advanced filters
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Enhanced filtering options (Beta)
            </p>
          </div>
          <Switch id="feat-filters" checked />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-yellow-500/5 border border-yellow-500/10">
          <div>
            <Label className="text-sm font-medium">AI suggestions</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Smart recommendations (Experimental)
            </p>
          </div>
          <Switch id="feat-ai" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md opacity-50">
          <div>
            <Label className="text-sm font-medium">Offline mode</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Work without internet (Coming soon)
            </p>
          </div>
          <Switch id="feat-offline" disabled />
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// USE CASE: FORM INTEGRATION
// ============================================================================

/**
 * Settings form with switches
 */
export const SettingsForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your account settings
        </p>
      </div>

      <form className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="form-notifications">Notifications</Label>
          <Switch id="form-notifications" checked />
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <Label htmlFor="form-newsletter">Subscribe to newsletter</Label>
          <Switch id="form-newsletter" />
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <Label htmlFor="form-analytics">Share analytics</Label>
          <Switch id="form-analytics" checked />
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <Label htmlFor="form-marketing">Marketing emails</Label>
          <Switch id="form-marketing" />
        </div>

        <div className="border-t border-border pt-4 flex gap-2">
          <button className="flex-1 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
            Save
          </button>
          <button className="flex-1 h-8 px-3 rounded-md border border-border text-foreground text-sm font-medium transition-all hover:bg-card">
            Reset
          </button>
        </div>
      </form>
    </div>
  ),
}

// ============================================================================
// LAYOUT VARIATIONS
// ============================================================================

/**
 * Vertical layout with switches stacked
 */
export const VerticalLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Switch id="v-1" checked />
        <Label htmlFor="v-1">First option</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="v-2" />
        <Label htmlFor="v-2">Second option</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="v-3" checked />
        <Label htmlFor="v-3">Third option</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="v-4" disabled />
        <Label htmlFor="v-4">Disabled option</Label>
      </div>
    </div>
  ),
}

/**
 * Horizontal layout with switches in a row
 */
export const HorizontalLayout: Story = {
  render: () => (
    <div className="flex items-center gap-8 w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <Switch id="h-1" checked />
        <Label htmlFor="h-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="h-2" />
        <Label htmlFor="h-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="h-3" checked />
        <Label htmlFor="h-3">Option 3</Label>
      </div>
    </div>
  ),
}

/**
 * Grid layout with switches in columns
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
      <div className="flex items-center gap-3">
        <Switch id="g-1" checked />
        <Label htmlFor="g-1">Enable feature A</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="g-2" />
        <Label htmlFor="g-2">Enable feature B</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="g-3" checked />
        <Label htmlFor="g-3">Enable feature C</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="g-4" />
        <Label htmlFor="g-4">Enable feature D</Label>
      </div>
    </div>
  ),
}

// ============================================================================
// ALL STATES COMPARISON
// ============================================================================

/**
 * All switch states side by side for comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Normal States</h3>
        <div className="flex items-center gap-3">
          <Switch id="state-off" />
          <Label htmlFor="state-off">Off</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="state-on" checked />
          <Label htmlFor="state-on">On</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Disabled States</h3>
        <div className="flex items-center gap-3">
          <Switch id="state-disabled-off" disabled />
          <Label htmlFor="state-disabled-off">Disabled (Off)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="state-disabled-on" checked disabled />
          <Label htmlFor="state-disabled-on">Disabled (On)</Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// GLASS EFFECT VARIATIONS
// ============================================================================

/**
 * Switches with glass morphism background effects
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-3">
      <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center justify-between hover:bg-card/40 transition-colors">
        <Label>Glass-morphism option 1</Label>
        <Switch id="glass-1" />
      </div>
      <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center justify-between hover:bg-card/40 transition-colors">
        <Label>Glass-morphism option 2</Label>
        <Switch id="glass-2" checked />
      </div>
      <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center justify-between hover:bg-card/40 transition-colors">
        <Label>Glass-morphism option 3</Label>
        <Switch id="glass-3" />
      </div>
    </div>
  ),
}

/**
 * Switches with gradient background cards
 */
export const WithGradientCards: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-md">
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-between">
        <div>
          <Label className="block font-medium">Premium feature</Label>
          <p className="text-xs text-muted-foreground">Unlock advanced features</p>
        </div>
        <Switch id="grad-1" checked />
      </div>
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-between">
        <div>
          <Label className="block font-medium">Beta feature</Label>
          <p className="text-xs text-muted-foreground">Early access feature</p>
        </div>
        <Switch id="grad-2" />
      </div>
      <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border border-yellow-500/20 flex items-center justify-between opacity-50">
        <div>
          <Label className="block font-medium">Coming soon</Label>
          <p className="text-xs text-muted-foreground">Feature in development</p>
        </div>
        <Switch id="grad-3" disabled />
      </div>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY EXAMPLES
// ============================================================================

/**
 * Accessibility example with ARIA attributes and descriptions
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          These switches include proper ARIA attributes for screen readers
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-1" className="block font-medium">
              Accept Terms <span className="text-red-500">*</span>
            </Label>
            <p id="a11y-1-desc" className="text-xs text-muted-foreground mt-1">
              You must accept our terms to continue
            </p>
          </div>
          <Switch
            id="a11y-1"
            aria-label="Accept terms of service"
            aria-required="true"
            aria-describedby="a11y-1-desc"
          />
        </div>

        <div className="border-t border-border pt-4 flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-2" className="block font-medium">
              Two-Factor Authentication
            </Label>
            <p id="a11y-2-desc" className="text-xs text-muted-foreground mt-1">
              Recommended for account security
            </p>
          </div>
          <Switch
            id="a11y-2"
            checked
            aria-label="Enable two-factor authentication"
            aria-describedby="a11y-2-desc"
          />
        </div>

        <div className="border-t border-border pt-4 flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-3" className="block font-medium opacity-50">
              Beta Features (Unavailable)
            </Label>
            <p id="a11y-3-desc" className="text-xs text-muted-foreground mt-1">
              Join our beta program to access
            </p>
          </div>
          <Switch
            id="a11y-3"
            disabled
            aria-label="Beta features unavailable"
            aria-describedby="a11y-3-desc"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Focus state demonstration for keyboard navigation
 */
export const FocusStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Try tabbing through the switches to see focus states with Ozean turquoise ring
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Switch id="focus-1" />
          <Label htmlFor="focus-1">First switch (Tab to focus)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="focus-2" />
          <Label htmlFor="focus-2">Second switch</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="focus-3" autoFocus />
          <Label htmlFor="focus-3">Third switch (auto-focused)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="focus-4" />
          <Label htmlFor="focus-4">Fourth switch</Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

/**
 * Controlled switch group with state display
 */
export const ControlledSwitchGroup: Story = {
  render: () => {
    const options = [
      { id: 'opt-1', label: 'Email' },
      { id: 'opt-2', label: 'Push' },
      { id: 'opt-3', label: 'SMS' },
      { id: 'opt-4', label: 'In-app' },
    ]

    const [enabled, setEnabled] = React.useState<Set<string>>(
      new Set(['opt-1', 'opt-3'])
    )

    const handleToggle = (id: string) => {
      const newEnabled = new Set(enabled)
      if (newEnabled.has(id)) {
        newEnabled.delete(id)
      } else {
        newEnabled.add(id)
      }
      setEnabled(newEnabled)
    }

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Notification Channels
          </h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {enabled.size} of {options.length}
          </span>
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <Label htmlFor={option.id}>{option.label}</Label>
              <Switch
                id={option.id}
                checked={enabled.has(option.id)}
                onChange={() => handleToggle(option.id)}
              />
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-card border border-border text-xs">
          <p className="text-muted-foreground">
            Enabled:{' '}
            <span className="text-primary font-semibold">
              {Array.from(enabled)
                .map(
                  (id) => options.find((opt) => opt.id === id)?.label
                )
                .join(', ') || 'None'}
            </span>
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Master/slave switch pattern - controlling dependent features
 */
export const MasterSlavePattern: Story = {
  render: () => {
    const [masterEnabled, setMasterEnabled] = React.useState(true)
    const [slaveOptions, setSlaveOptions] = React.useState({
      detail1: true,
      detail2: true,
      detail3: false,
    })

    return (
      <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">
            Feature Control
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enable master to unlock sub-options
          </p>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="master" className="block font-medium">
                Enable all features
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Master toggle for all sub-features
              </p>
            </div>
            <Switch
              id="master"
              checked={masterEnabled}
              onChange={(e) => setMasterEnabled((e.target as HTMLInputElement).checked)}
            />
          </div>
        </div>

        <div className="space-y-3 ml-4">
          <div className="flex items-center justify-between opacity-70">
            <Label htmlFor="slave1" className="text-sm">
              Sub-feature 1
            </Label>
            <Switch
              id="slave1"
              checked={slaveOptions.detail1 && masterEnabled}
              disabled={!masterEnabled}
              onChange={() => setSlaveOptions({
                ...slaveOptions,
                detail1: !slaveOptions.detail1,
              })}
            />
          </div>
          <div className="flex items-center justify-between opacity-70">
            <Label htmlFor="slave2" className="text-sm">
              Sub-feature 2
            </Label>
            <Switch
              id="slave2"
              checked={slaveOptions.detail2 && masterEnabled}
              disabled={!masterEnabled}
              onChange={() => setSlaveOptions({
                ...slaveOptions,
                detail2: !slaveOptions.detail2,
              })}
            />
          </div>
          <div className="flex items-center justify-between opacity-70">
            <Label htmlFor="slave3" className="text-sm">
              Sub-feature 3
            </Label>
            <Switch
              id="slave3"
              checked={slaveOptions.detail3 && masterEnabled}
              disabled={!masterEnabled}
              onChange={() => setSlaveOptions({
                ...slaveOptions,
                detail3: !slaveOptions.detail3,
              })}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-card border border-border text-xs">
          <p className="text-muted-foreground">
            Master: <span className="text-primary font-semibold">{masterEnabled ? 'ON' : 'OFF'}</span>
          </p>
          <p className="text-muted-foreground mt-2">
            Sub-features:{' '}
            <span className="text-primary font-semibold">
              {masterEnabled ? Object.values(slaveOptions).filter(Boolean).length : 0}/3 enabled
            </span>
          </p>
        </div>
      </div>
    )
  },
}
