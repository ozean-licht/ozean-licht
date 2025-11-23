import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Checkbox, CheckboxGroup, CheckboxIndicator } from './checkbox'
import { Label } from './label'

const meta: Meta<typeof Checkbox> = {
  title: 'Tier 1: Primitives/CossUI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, Ozean turquoise (#0ec2bc) accent color, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state of the checkbox',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate (mixed) state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

// ============================================================================
// BASIC STATE STORIES
// ============================================================================

/**
 * Default unchecked checkbox with no state applied
 */
export const Default: Story = {
  render: () => (
    <Checkbox>
      <CheckboxIndicator />
    </Checkbox>
  ),
}

/**
 * Checkbox in checked state
 */
export const Checked: Story = {
  render: () => (
    <Checkbox checked>
      <CheckboxIndicator />
    </Checkbox>
  ),
}

/**
 * Checkbox in indeterminate state (shows dash instead of checkmark)
 * Used when parent checkbox has some but not all children checked
 */
export const Indeterminate: Story = {
  render: () => (
    <Checkbox indeterminate>
      <CheckboxIndicator />
    </Checkbox>
  ),
}

/**
 * Disabled unchecked checkbox - no interaction possible
 */
export const DisabledUnchecked: Story = {
  render: () => (
    <Checkbox disabled>
      <CheckboxIndicator />
    </Checkbox>
  ),
}

/**
 * Disabled checked checkbox - shows checked state but cannot be changed
 */
export const DisabledChecked: Story = {
  render: () => (
    <Checkbox checked disabled>
      <CheckboxIndicator />
    </Checkbox>
  ),
}

/**
 * Disabled indeterminate checkbox
 */
export const DisabledIndeterminate: Story = {
  render: () => <Checkbox indeterminate disabled>
              <CheckboxIndicator />
            </Checkbox>,
}

// ============================================================================
// WITH LABEL STORIES
// ============================================================================

/**
 * Checkbox with associated label for better accessibility and UX
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-label-example">
              <CheckboxIndicator />
            </Checkbox>
      <Label htmlFor="checkbox-label-example">Remember me</Label>
    </div>
  ),
}

/**
 * Checked checkbox with label
 */
export const WithLabelChecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-label-checked" checked>
              <CheckboxIndicator />
            </Checkbox>
      <Label htmlFor="checkbox-label-checked">I agree to the terms</Label>
    </div>
  ),
}

/**
 * Disabled checkbox with label to show disabled styling
 */
export const WithLabelDisabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-label-disabled" disabled>
              <CheckboxIndicator />
            </Checkbox>
      <Label htmlFor="checkbox-label-disabled">Feature not available</Label>
    </div>
  ),
}

/**
 * Checkbox with label showing required field indicator
 */
export const WithLabelRequired: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-required">
              <CheckboxIndicator />
            </Checkbox>
      <Label htmlFor="checkbox-required">
        Accept terms <span className="text-red-500">*</span>
      </Label>
    </div>
  ),
}

// ============================================================================
// CHECKBOX GROUP STORIES
// ============================================================================

/**
 * Group of related checkboxes for selecting multiple options
 */
export const CheckboxGroupBasic: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Select your interests:
        </p>
      </div>
      <CheckboxGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="interest-1">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="interest-1">Web Development</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="interest-2">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="interest-2">Mobile Development</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="interest-3">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="interest-3">UI/UX Design</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="interest-4">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="interest-4">DevOps</Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

/**
 * Checkbox group with some items checked
 */
export const CheckboxGroupPartiallyChecked: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Choose your features:
        </p>
      </div>
      <CheckboxGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="feature-1" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="feature-1">Dark mode</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature-2">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="feature-2">Notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature-3" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="feature-3">Analytics</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature-4">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="feature-4">Advanced settings</Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

/**
 * Checkbox group with all items checked
 */
export const CheckboxGroupAllChecked: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Notification preferences:
        </p>
      </div>
      <CheckboxGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="notify-1" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="notify-1">Email notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="notify-2" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="notify-2">Push notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="notify-3" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="notify-3">SMS alerts</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="notify-4" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="notify-4">Weekly digest</Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

/**
 * Checkbox group with some disabled items
 */
export const CheckboxGroupDisabledItems: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Subscription options:
        </p>
      </div>
      <CheckboxGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="sub-1" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="sub-1">Free Plan</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sub-2" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="sub-2">Pro Plan</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sub-3" disabled>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="sub-3">Enterprise (Contact sales)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sub-4" disabled>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="sub-4">Custom Plan (Coming soon)</Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

// ============================================================================
// CONTROLLED vs UNCONTROLLED STORIES
// ============================================================================

/**
 * Uncontrolled checkbox using default state
 */
export const UncontrolledCheckbox: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm text-muted-foreground">
        This checkbox manages its own state without parent component control
      </p>
      <div className="flex items-center gap-2">
        <Checkbox id="uncontrolled">
              <CheckboxIndicator />
            </Checkbox>
        <Label htmlFor="uncontrolled">
          Click to toggle state independently
        </Label>
      </div>
    </div>
  ),
}

/**
 * Controlled checkbox component with React state management
 */
export const ControlledCheckbox: Story = {
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          Controlled by parent component via React state
        </p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="controlled"
            checked={isChecked}
            onChange={(e) => setIsChecked((e.target as HTMLInputElement).checked)}
          />
          <Label htmlFor="controlled">
            {isChecked ? 'Checked' : 'Unchecked'} - Click to toggle
          </Label>
        </div>
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Current state: <span className="text-primary font-semibold">{isChecked ? 'true' : 'false'}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// INDETERMINATE CHECKBOX STORIES (Parent-Child Relationship)
// ============================================================================

/**
 * Parent checkbox with indeterminate state when some children are checked
 */
export const IndeterminateParentCheckbox: Story = {
  render: () => {
    const [parentChecked, setParentChecked] = React.useState(false)
    const [children, setChildren] = React.useState({
      option1: true,
      option2: false,
      option3: true,
    })

    const checkedCount = Object.values(children).filter(Boolean).length
    const isIndeterminate = checkedCount > 0 && checkedCount < 3

    const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newState = e.target.checked
      setParentChecked(newState)
      setChildren({
        option1: newState,
        option2: newState,
        option3: newState,
      })
    }

    const handleChildChange = (key: keyof typeof children) => {
      const newChildren = {
        ...children,
        [key]: !children[key],
      }
      setChildren(newChildren)
      const newCheckedCount = Object.values(newChildren).filter(Boolean).length
      setParentChecked(newCheckedCount === 3)
    }

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Parent uses indeterminate state when some (but not all) children are checked
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
          <Checkbox
            id="parent-checkbox"
            checked={parentChecked}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
          <Label htmlFor="parent-checkbox" className="font-semibold">
            Select all options
          </Label>
        </div>

        <CheckboxGroup>
          <div className="flex items-center gap-2 ml-7">
            <Checkbox
              id="child-1"
              checked={children.option1}
              onChange={() => handleChildChange('option1')}
            />
            <Label htmlFor="child-1">Option 1</Label>
          </div>
          <div className="flex items-center gap-2 ml-7">
            <Checkbox
              id="child-2"
              checked={children.option2}
              onChange={() => handleChildChange('option2')}
            />
            <Label htmlFor="child-2">Option 2</Label>
          </div>
          <div className="flex items-center gap-2 ml-7">
            <Checkbox
              id="child-3"
              checked={children.option3}
              onChange={() => handleChildChange('option3')}
            />
            <Label htmlFor="child-3">Option 3</Label>
          </div>
        </CheckboxGroup>

        <div className="p-3 rounded-lg bg-card/50 border border-border text-xs">
          <p className="text-muted-foreground">
            Selected: {checkedCount} of 3 items
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// FORM EXAMPLES
// ============================================================================

/**
 * Checkbox in a sign-up form context
 */
export const SignUpForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Create Account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please review and accept our policies
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox id="terms">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="terms" className="cursor-pointer">
            <span className="font-medium">I agree to the Terms of Service</span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Required to create your account
            </span>
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="privacy">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="privacy" className="cursor-pointer">
            <span className="font-medium">I accept the Privacy Policy</span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Required to create your account
            </span>
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="newsletter" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="newsletter" className="cursor-pointer">
            <span className="font-medium">Subscribe to our newsletter</span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Optional - Get updates about new features
            </span>
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="marketing">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="marketing" className="cursor-pointer">
            <span className="font-medium">Send me promotional emails</span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Optional - Receive special offers and discounts
            </span>
          </Label>
        </div>
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background mt-4">
        Create Account
      </button>
    </div>
  ),
}

/**
 * Checkbox in preferences/settings form
 */
export const PreferencesForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          User Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Privacy Settings
          </h3>
          <CheckboxGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-private-profile" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-private-profile">
                Make profile private
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-hide-activity">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-hide-activity">
                Hide activity from others
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-no-search" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-no-search">
                Don't appear in search results
              </Label>
            </div>
          </CheckboxGroup>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Notifications
          </h3>
          <CheckboxGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-email-notif" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-email-notif">
                Email notifications
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-push-notif" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-push-notif">
                Push notifications
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="pref-sms-notif">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="pref-sms-notif">
                SMS notifications
              </Label>
            </div>
          </CheckboxGroup>
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

/**
 * Filtering form with checkboxes
 */
export const FilterForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Filter Results
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Category
          </h3>
          <CheckboxGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="cat-electronics" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="cat-electronics">Electronics (234)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cat-clothing" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="cat-clothing">Clothing (156)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cat-books">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="cat-books">Books (89)</Label>
            </div>
          </CheckboxGroup>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Price Range
          </h3>
          <CheckboxGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="price-under-50" checked>
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="price-under-50">Under $50</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="price-50-100">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="price-50-100">$50 - $100</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="price-100-250">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="price-100-250">$100 - $250</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="price-over-250">
              <CheckboxIndicator />
            </Checkbox>
              <Label htmlFor="price-over-250">Over $250</Label>
            </div>
          </CheckboxGroup>
        </div>
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 mt-4">
        Apply Filters
      </button>
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
          These checkboxes include proper ARIA attributes for screen readers
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2">
          <Checkbox
            id="a11y-1"
            aria-label="Accept terms of service"
            aria-required="true"
            aria-describedby="a11y-1-desc"
          />
          <div className="flex-1">
            <Label htmlFor="a11y-1" className="font-medium">
              Accept Terms <span className="text-red-500">*</span>
            </Label>
            <p id="a11y-1-desc" className="text-xs text-muted-foreground mt-1">
              You must accept our terms to continue
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="a11y-2"
            checked
            aria-label="Enable two-factor authentication"
            aria-describedby="a11y-2-desc"
          />
          <div className="flex-1">
            <Label htmlFor="a11y-2" className="font-medium">
              Two-Factor Authentication
            </Label>
            <p id="a11y-2-desc" className="text-xs text-muted-foreground mt-1">
              Recommended for account security
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="a11y-3"
            disabled
            aria-label="Beta features unavailable"
            aria-describedby="a11y-3-desc"
          />
          <div className="flex-1">
            <Label htmlFor="a11y-3" className="font-medium opacity-50">
              Beta Features (Unavailable)
            </Label>
            <p id="a11y-3-desc" className="text-xs text-muted-foreground mt-1">
              Join our beta program to access
            </p>
          </div>
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
          Try tabbing through the checkboxes to see focus states with Ozean
          turquoise ring
        </p>
      </div>

      <CheckboxGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="focus-1">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="focus-1">First checkbox (Tab to focus)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="focus-2">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="focus-2">Second checkbox</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="focus-3" autoFocus>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="focus-3">Third checkbox (auto-focused)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="focus-4">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="focus-4">Fourth checkbox</Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

// ============================================================================
// CUSTOM STYLING EXAMPLES
// ============================================================================

/**
 * Checkbox with custom styling applied
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex items-center gap-2">
        <Checkbox
          id="custom-1"
          className="h-6 w-6"
        />
        <Label htmlFor="custom-1">Larger checkbox (6x6)</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="custom-2"
          className="h-4 w-4"
        />
        <Label htmlFor="custom-2">Smaller checkbox (4x4)</Label>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <Checkbox id="custom-3">
              <CheckboxIndicator />
            </Checkbox>
        <Label htmlFor="custom-3" className="text-primary font-medium">
          Highlighted option with primary accent
        </Label>
      </div>
    </div>
  ),
}

/**
 * Checkboxes with glass morphism background
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-4">
      <CheckboxGroup>
        <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center gap-2 hover:bg-card/40 transition-colors">
          <Checkbox id="glass-1">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="glass-1" className="flex-1">
            Glass-morphism card option
          </Label>
        </div>
        <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center gap-2 hover:bg-card/40 transition-colors">
          <Checkbox id="glass-2" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="glass-2" className="flex-1">
            Selected glass option
          </Label>
        </div>
        <div className="p-3 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 flex items-center gap-2 hover:bg-card/40 transition-colors">
          <Checkbox id="glass-3">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="glass-3" className="flex-1">
            Another glass option
          </Label>
        </div>
      </CheckboxGroup>
    </div>
  ),
}

// ============================================================================
// STATE COMBINATIONS
// ============================================================================

/**
 * All checkbox states side by side for comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Normal States</h3>
        <div className="flex items-center gap-2">
          <Checkbox id="state-unchecked">
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="state-checked" checked>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-checked">Checked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="state-indeterminate" indeterminate>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-indeterminate">Indeterminate</Label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Disabled States</h3>
        <div className="flex items-center gap-2">
          <Checkbox id="state-disabled-unchecked" disabled>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-disabled-unchecked">Disabled (unchecked)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="state-disabled-checked" checked disabled>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-disabled-checked">Disabled (checked)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="state-disabled-indeterminate" indeterminate disabled>
              <CheckboxIndicator />
            </Checkbox>
          <Label htmlFor="state-disabled-indeterminate">
            Disabled (indeterminate)
          </Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

/**
 * Controlled checkbox group with count indicator
 */
export const ControlledCheckboxGroup: Story = {
  render: () => {
    const options = [
      { id: 'opt-1', label: 'React' },
      { id: 'opt-2', label: 'Vue' },
      { id: 'opt-3', label: 'Angular' },
      { id: 'opt-4', label: 'Svelte' },
    ]

    const [selected, setSelected] = React.useState<Set<string>>(
      new Set(['opt-1', 'opt-3'])
    )

    const handleToggle = (id: string) => {
      const newSelected = new Set(selected)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      setSelected(newSelected)
    }

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Select Technologies
          </h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {selected.size} of {options.length}
          </span>
        </div>

        <CheckboxGroup>
          {options.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={option.id}
                checked={selected.has(option.id)}
                onChange={() => handleToggle(option.id)}
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </CheckboxGroup>

        <div className="p-3 rounded-lg bg-card border border-border text-xs">
          <p className="text-muted-foreground">
            Selected:{' '}
            <span className="text-primary font-semibold">
              {Array.from(selected)
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
 * Toggle all with indeterminate state
 */
export const ToggleAll: Story = {
  render: () => {
    const items = ['Email', 'Phone', 'Chat', 'SMS']
    const [checked, setChecked] = React.useState<Record<string, boolean>>({
      Email: true,
      Phone: false,
      Chat: true,
      SMS: false,
    })

    const allChecked = Object.values(checked).every(Boolean)
    const someChecked = Object.values(checked).some(Boolean) && !allChecked

    const handleToggleAll = () => {
      const newState: Record<string, boolean> = {}
      items.forEach((item) => {
        newState[item] = !allChecked
      })
      setChecked(newState)
    }

    const handleToggleItem = (item: string) => {
      setChecked({
        ...checked,
        [item]: !checked[item],
      })
    }

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="toggle-all"
              checked={allChecked}
              indeterminate={someChecked}
              onChange={handleToggleAll}
            />
            <Label htmlFor="toggle-all" className="font-semibold cursor-pointer">
              Select All Communication Methods
            </Label>
          </div>
        </div>

        <CheckboxGroup>
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 ml-4">
              <Checkbox
                id={`item-${item}`}
                checked={checked[item]}
                onChange={() => handleToggleItem(item)}
              />
              <Label htmlFor={`item-${item}`}>{item}</Label>
            </div>
          ))}
        </CheckboxGroup>

        <div className="text-xs text-muted-foreground p-2">
          {Object.values(checked).filter(Boolean).length} of {items.length} selected
        </div>
      </div>
    )
  },
}
