import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Toggle, ToggleGroup } from './toggle'
import { Label } from './label'

const meta: Meta<typeof Toggle> = {
  title: 'CossUI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toggle component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, Ozean turquoise (#0ec2bc) accent color, and full accessibility support. Ideal for on/off toggles, single selection from a group, or multi-selection scenarios.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style variant of the toggle button',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'Size variant of the toggle button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

// ============================================================================
// SINGLE TOGGLE - BASIC VARIANTS
// ============================================================================

/**
 * Single toggle with default styling - glass morphism background with border
 */
export const Default: Story = {
  render: () => <Toggle>Toggle me</Toggle>,
}

/**
 * Outline variant - transparent background with border
 */
export const Outline: Story = {
  render: () => <Toggle variant="outline">Toggle me</Toggle>,
}

/**
 * Ghost variant - minimal styling, no background or border
 */
export const Ghost: Story = {
  render: () => <Toggle variant="ghost">Toggle me</Toggle>,
}

/**
 * All single toggle variants displayed together for comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center flex-wrap">
        <Toggle variant="default">Default</Toggle>
        <Toggle variant="outline">Outline</Toggle>
        <Toggle variant="ghost">Ghost</Toggle>
      </div>
    </div>
  ),
}

// ============================================================================
// SINGLE TOGGLE - SIZES
// ============================================================================

/**
 * Small toggle button - compact for dense UIs
 */
export const SizeSmall: Story = {
  render: () => <Toggle size="sm">Small</Toggle>,
}

/**
 * Default size toggle button - standard size
 */
export const SizeDefault: Story = {
  render: () => <Toggle size="default">Default</Toggle>,
}

/**
 * Large toggle button - prominent and easy to click
 */
export const SizeLarge: Story = {
  render: () => <Toggle size="lg">Large</Toggle>,
}

/**
 * Icon size toggle - square button for icons only
 */
export const SizeIcon: Story = {
  render: () => <Toggle size="icon" aria-label="Toggle icon">★</Toggle>,
}

/**
 * All toggle sizes displayed together
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="default">Default</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle size="icon" aria-label="Icon toggle">★</Toggle>
    </div>
  ),
}

// ============================================================================
// SINGLE TOGGLE - DISABLED STATE
// ============================================================================

/**
 * Disabled toggle in off state - no interaction possible
 */
export const Disabled: Story = {
  render: () => <Toggle disabled>Disabled</Toggle>,
}

/**
 * All disabled variants shown for comparison
 */
export const AllDisabledVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Toggle variant="default" disabled>Default</Toggle>
      <Toggle variant="outline" disabled>Outline</Toggle>
      <Toggle variant="ghost" disabled>Ghost</Toggle>
    </div>
  ),
}

// ============================================================================
// TOGGLE GROUP - SINGLE SELECTION
// ============================================================================

/**
 * Toggle group for single selection from multiple options
 */
export const ToggleGroupSingleSelection: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <Toggle value="left">Left</Toggle>
      <Toggle value="center">Center</Toggle>
      <Toggle value="right">Right</Toggle>
    </ToggleGroup>
  ),
}

/**
 * Toggle group with outline variant for subtle styling
 */
export const ToggleGroupOutlineVariant: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="list">
      <Toggle value="list" variant="outline">List</Toggle>
      <Toggle value="grid" variant="outline">Grid</Toggle>
      <Toggle value="table" variant="outline">Table</Toggle>
    </ToggleGroup>
  ),
}

/**
 * Toggle group with icon buttons for compact UI
 */
export const ToggleGroupIconButtons: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="bold" className="gap-0">
      <Toggle value="bold" size="icon" aria-label="Bold" title="Bold (Ctrl+B)">
        B
      </Toggle>
      <Toggle value="italic" size="icon" aria-label="Italic" title="Italic (Ctrl+I)">
        I
      </Toggle>
      <Toggle value="underline" size="icon" aria-label="Underline" title="Underline (Ctrl+U)">
        U
      </Toggle>
    </ToggleGroup>
  ),
}

// ============================================================================
// TOGGLE GROUP - MULTIPLE SELECTION
// ============================================================================

/**
 * Toggle group for multiple selection - user can select multiple options
 */
export const ToggleGroupMultipleSelection: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold', 'underline']}>
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline">Underline</Toggle>
    </ToggleGroup>
  ),
}

/**
 * Text formatting toolbar - real-world use case with multiple formatting options
 */
export const TextFormattingToolbar: Story = {
  render: () => {
    const [format, setFormat] = React.useState<string[]>(['bold'])

    return (
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Text Formatting</Label>
          <ToggleGroup
            type="multiple"
            value={format}
            className="justify-start"
          >
            <Toggle
              value="bold"
              size="icon"
              aria-label="Bold"
              onClick={() =>
                setFormat((prev) =>
                  prev.includes('bold')
                    ? prev.filter((f) => f !== 'bold')
                    : [...prev, 'bold']
                )
              }
            >
              B
            </Toggle>
            <Toggle
              value="italic"
              size="icon"
              aria-label="Italic"
              onClick={() =>
                setFormat((prev) =>
                  prev.includes('italic')
                    ? prev.filter((f) => f !== 'italic')
                    : [...prev, 'italic']
                )
              }
            >
              I
            </Toggle>
            <Toggle
              value="underline"
              size="icon"
              aria-label="Underline"
              onClick={() =>
                setFormat((prev) =>
                  prev.includes('underline')
                    ? prev.filter((f) => f !== 'underline')
                    : [...prev, 'underline']
                )
              }
            >
              U
            </Toggle>
            <div className="border-l border-border mx-1" />
            <Toggle
              value="strikethrough"
              size="icon"
              aria-label="Strikethrough"
              onClick={() =>
                setFormat((prev) =>
                  prev.includes('strikethrough')
                    ? prev.filter((f) => f !== 'strikethrough')
                    : [...prev, 'strikethrough']
                )
              }
            >
              S
            </Toggle>
          </ToggleGroup>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Active formats: <span className="text-primary font-semibold">{format.join(', ') || 'None'}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// USE CASE: VIEW MODE SWITCHER
// ============================================================================

/**
 * View mode switcher - toggle between different view layouts
 */
export const ViewModeSwitcher: Story = {
  render: () => {
    const [viewMode, setViewMode] = React.useState<string>('grid')

    const viewModes = [
      { value: 'grid', label: '⊞', title: 'Grid view' },
      { value: 'list', label: '☰', title: 'List view' },
      { value: 'table', label: '⊟', title: 'Table view' },
    ]

    return (
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">View Mode</Label>
          <ToggleGroup
            type="single"
            value={viewMode}
            className="gap-0"
          >
            {viewModes.map((mode) => (
              <Toggle
                key={mode.value}
                value={mode.value}
                size="icon"
                aria-label={mode.title}
                title={mode.title}
                onClick={() => setViewMode(mode.value)}
              >
                {mode.label}
              </Toggle>
            ))}
          </ToggleGroup>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-sm text-foreground">
            Current view: <span className="text-primary font-semibold capitalize">{viewMode}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {viewMode === 'grid' && 'Displaying items in a grid layout'}
            {viewMode === 'list' && 'Displaying items in a list layout'}
            {viewMode === 'table' && 'Displaying items in a table layout'}
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// USE CASE: TEXT ALIGNMENT TOOLBAR
// ============================================================================

/**
 * Text alignment toggle group - for document/editor applications
 */
export const TextAlignmentToolbar: Story = {
  render: () => {
    const [alignment, setAlignment] = React.useState<string>('left')

    const alignments = [
      { value: 'left', label: '⬅', title: 'Align left' },
      { value: 'center', label: '⬄', title: 'Align center' },
      { value: 'right', label: '➡', title: 'Align right' },
      { value: 'justify', label: '⬌', title: 'Justify' },
    ]

    return (
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <Label className="text-sm font-medium">Text Alignment</Label>
        <ToggleGroup
          type="single"
          value={alignment}
          className="gap-0"
        >
          {alignments.map((align) => (
            <Toggle
              key={align.value}
              value={align.value}
              size="default"
              aria-label={align.title}
              title={align.title}
              onClick={() => setAlignment(align.value)}
            >
              {align.label}
            </Toggle>
          ))}
        </ToggleGroup>

        <div className={`p-4 rounded-lg bg-card/50 border border-border text-${alignment}`}>
          <p className={`text-sm text-foreground text-${alignment}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sample text aligned to the {alignment}.
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// USE CASE: SORT/FILTER OPTIONS
// ============================================================================

/**
 * Sort direction toggle - ascending/descending
 */
export const SortDirectionToggle: Story = {
  render: () => {
    const [sortDir, setSortDir] = React.useState<string>('asc')

    return (
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Sort Order</Label>
          <ToggleGroup
            type="single"
            value={sortDir}
            className="gap-0"
          >
            <Toggle
              value="asc"
              aria-label="Ascending"
              onClick={() => setSortDir('asc')}
            >
              Ascending ↑
            </Toggle>
            <Toggle
              value="desc"
              aria-label="Descending"
              onClick={() => setSortDir('desc')}
            >
              Descending ↓
            </Toggle>
          </ToggleGroup>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-sm text-foreground">
            Sort: <span className="text-primary font-semibold">{sortDir === 'asc' ? 'A → Z' : 'Z → A'}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// USE CASE: ALIGNMENT CONTROLS
// ============================================================================

/**
 * Alignment control buttons - left, center, right align
 */
export const AlignmentControls: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <Label className="text-sm font-medium">Alignment</Label>
      <ToggleGroup type="single" defaultValue="center" className="gap-0">
        <Toggle value="left" aria-label="Align left">
          ◄
        </Toggle>
        <Toggle value="center" aria-label="Align center">
          ◆
        </Toggle>
        <Toggle value="right" aria-label="Align right">
          ►
        </Toggle>
      </ToggleGroup>
    </div>
  ),
}

// ============================================================================
// USE CASE: TIME PERIOD SELECTOR
// ============================================================================

/**
 * Time period selector - common in analytics dashboards
 */
export const TimePeriodSelector: Story = {
  render: () => {
    const [period, setPeriod] = React.useState<string>('7d')

    const periods = [
      { value: '24h', label: '24h' },
      { value: '7d', label: '7 Days' },
      { value: '30d', label: '30 Days' },
      { value: '90d', label: '90 Days' },
      { value: 'all', label: 'All Time' },
    ]

    return (
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <Label className="text-sm font-medium">Date Range</Label>
        <ToggleGroup
          type="single"
          value={period}
        >
          {periods.map((p) => (
            <Toggle
              key={p.value}
              value={p.value}
              variant="outline"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Toggle>
          ))}
        </ToggleGroup>

        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-sm text-foreground">
            Showing data for: <span className="text-primary font-semibold">{period}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// CONTROLLED COMPONENT
// ============================================================================

/**
 * Controlled toggle component with React state management
 */
export const ControlledToggle: Story = {
  render: () => {
    const [isActive, setIsActive] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          This toggle is controlled by parent component state
        </p>
        <Toggle
          pressed={isActive}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Toggle>
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Current state: <span className="text-primary font-semibold">{isActive ? 'true' : 'false'}</span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// ICON TOGGLES
// ============================================================================

/**
 * Icon-only toggles for compact UI - ideal for toolbars
 */
export const IconToggles: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <Label className="text-sm font-medium">Icon Toggles</Label>
      <ToggleGroup type="multiple" className="gap-0">
        <Toggle size="icon" value="heart" aria-label="Favorite" title="Add to favorites">
          ♥
        </Toggle>
        <Toggle size="icon" value="star" aria-label="Star" title="Star">
          ★
        </Toggle>
        <Toggle size="icon" value="eye" aria-label="Watch" title="Watch">
          👁
        </Toggle>
        <Toggle size="icon" value="bell" aria-label="Notify" title="Get notifications">
          🔔
        </Toggle>
      </ToggleGroup>
    </div>
  ),
}

/**
 * Icon toggles with different sizes
 */
export const IconTogglesSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <Toggle size="sm" value="sm-icon" aria-label="Small icon">
          ★
        </Toggle>
        <Toggle size="default" value="default-icon" aria-label="Default icon">
          ★
        </Toggle>
        <Toggle size="lg" value="lg-icon" aria-label="Large icon">
          ★
        </Toggle>
        <Toggle size="icon" value="icon" aria-label="Icon size" className="h-12 w-12 text-lg">
          ★
        </Toggle>
      </div>
    </div>
  ),
}

// ============================================================================
// WITH LABELS AND DESCRIPTIONS
// ============================================================================

/**
 * Toggle with associated label for better accessibility
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle id="toggle-label" />
      <Label htmlFor="toggle-label">Enable feature</Label>
    </div>
  ),
}

/**
 * Toggle with label and description text
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Toggle id="toggle-desc" defaultValue="enabled" />
        <div>
          <Label htmlFor="toggle-desc" className="block font-medium">
            Dark mode
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Enable dark theme for reduced eye strain
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Multiple toggles with labels and descriptions
 */
export const MultipleTogglesWithDescriptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex items-start gap-3">
        <Toggle id="toggle-1" defaultValue="notifications" />
        <div className="flex-1">
          <Label htmlFor="toggle-1" className="block font-medium">
            Notifications
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Receive alerts about important updates
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-start gap-3">
        <Toggle id="toggle-2" />
        <div className="flex-1">
          <Label htmlFor="toggle-2" className="block font-medium">
            Email digest
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Get a summary of activities weekly
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-start gap-3">
        <Toggle id="toggle-3" defaultValue="analytics" />
        <div className="flex-1">
          <Label htmlFor="toggle-3" className="block font-medium">
            Analytics tracking
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Help us improve by sharing usage data
          </p>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// FORM INTEGRATION
// ============================================================================

/**
 * Toggle in a form context with submit button
 */
export const FormIntegration: Story = {
  render: () => {
    const [preferences, setPreferences] = React.useState({
      notifications: true,
      newsletter: false,
      analytics: true,
    })

    const handleChange = (key: keyof typeof preferences) => {
      setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
      <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-medium text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your account settings
          </p>
        </div>

        <form className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="form-notif">Notifications</Label>
            <Toggle
              id="form-notif"
              pressed={preferences.notifications}
              onClick={() => handleChange('notifications')}
            />
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <Label htmlFor="form-news">Subscribe to newsletter</Label>
            <Toggle
              id="form-news"
              pressed={preferences.newsletter}
              onClick={() => handleChange('newsletter')}
            />
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <Label htmlFor="form-analytics">Analytics sharing</Label>
            <Toggle
              id="form-analytics"
              pressed={preferences.analytics}
              onClick={() => handleChange('analytics')}
            />
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
    )
  },
}

// ============================================================================
// GLASS EFFECT VARIATIONS
// ============================================================================

/**
 * Toggles with glass morphism effects on background
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-3">
      <ToggleGroup type="multiple" className="gap-0">
        <Toggle variant="default" value="glass-1">
          Glass 1
        </Toggle>
        <Toggle variant="default" value="glass-2">
          Glass 2
        </Toggle>
        <Toggle variant="default" value="glass-3">
          Glass 3
        </Toggle>
      </ToggleGroup>

      <div className="pt-4 space-y-2">
        <Toggle variant="outline" value="outline-1">
          Outline glass
        </Toggle>
      </div>

      <div className="pt-4 space-y-2">
        <Toggle variant="ghost" value="ghost-1">
          Ghost glass
        </Toggle>
      </div>
    </div>
  ),
}

/**
 * Toggles with gradient card backgrounds
 */
export const WithGradientCards: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-md">
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-between">
        <Label className="font-medium">Feature A</Label>
        <Toggle defaultValue="feature-a" />
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-between">
        <Label className="font-medium">Feature B</Label>
        <Toggle />
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border border-yellow-500/20 flex items-center justify-between opacity-50">
        <Label className="font-medium">Feature C (Coming soon)</Label>
        <Toggle disabled />
      </div>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Accessibility example with ARIA attributes and semantic HTML
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          These toggles include proper ARIA attributes and semantic HTML for screen readers and keyboard navigation
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-terms" className="block font-medium">
              Accept Terms <span className="text-red-500">*</span>
            </Label>
            <p id="a11y-terms-desc" className="text-xs text-muted-foreground mt-1">
              You must accept our terms to continue
            </p>
          </div>
          <Toggle
            id="a11y-terms"
            aria-label="Accept terms of service"
            aria-required="true"
            aria-describedby="a11y-terms-desc"
          />
        </div>

        <div className="border-t border-border pt-4 flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-privacy" className="block font-medium">
              Privacy settings
            </Label>
            <p id="a11y-privacy-desc" className="text-xs text-muted-foreground mt-1">
              Control how we handle your data
            </p>
          </div>
          <Toggle
            id="a11y-privacy"
            aria-label="Configure privacy settings"
            aria-describedby="a11y-privacy-desc"
          />
        </div>

        <div className="border-t border-border pt-4 flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="a11y-beta" className="block font-medium opacity-50">
              Beta Features (Unavailable)
            </Label>
            <p id="a11y-beta-desc" className="text-xs text-muted-foreground mt-1">
              Join our beta program to access
            </p>
          </div>
          <Toggle
            id="a11y-beta"
            disabled
            aria-label="Beta features unavailable"
            aria-describedby="a11y-beta-desc"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Focus states demonstration for keyboard navigation
 */
export const FocusStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Try tabbing through the toggles to see focus states with Ozean turquoise ring
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Toggle id="focus-1" />
          <Label htmlFor="focus-1">First toggle (Tab to focus)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Toggle id="focus-2" />
          <Label htmlFor="focus-2">Second toggle</Label>
        </div>
        <div className="flex items-center gap-3">
          <Toggle id="focus-3" autoFocus />
          <Label htmlFor="focus-3">Third toggle (auto-focused)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Toggle id="focus-4" />
          <Label htmlFor="focus-4">Fourth toggle</Label>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// ALL STATES COMPARISON
// ============================================================================

/**
 * All toggle states side by side for comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Normal States</h3>
        <div className="space-y-2">
          <Toggle>Off</Toggle>
          <Toggle defaultValue="on">On</Toggle>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Disabled States</h3>
        <div className="space-y-2">
          <Toggle disabled>Disabled (Off)</Toggle>
          <Toggle disabled defaultValue="on">Disabled (On)</Toggle>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Variants</h3>
        <div className="space-y-2">
          <Toggle variant="outline">Outline</Toggle>
          <Toggle variant="ghost">Ghost</Toggle>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Sizes</h3>
        <div className="space-y-2">
          <Toggle size="sm">Small</Toggle>
          <Toggle size="lg">Large</Toggle>
        </div>
      </div>
    </div>
  ),
}

// ============================================================================
// ADVANCED PATTERNS - DYNAMIC TOGGLE GROUP
// ============================================================================

/**
 * Dynamic toggle group with controlled state and visibility feedback
 */
export const DynamicToggleGroup: Story = {
  render: () => {
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['active'])

    const filters = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'archived', label: 'Archived' },
      { value: 'pending', label: 'Pending' },
    ]

    const toggleFilter = (value: string) => {
      setSelectedFilters((prev) =>
        prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
      )
    }

    return (
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Status Filters <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2">{selectedFilters.length} selected</span>
          </h3>
          <ToggleGroup type="multiple" className="justify-start">
            {filters.map((filter) => (
              <Toggle
                key={filter.value}
                value={filter.value}
                pressed={selectedFilters.includes(filter.value)}
                onClick={() => toggleFilter(filter.value)}
                variant="outline"
              >
                {filter.label}
              </Toggle>
            ))}
          </ToggleGroup>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border text-sm">
          <p className="text-muted-foreground">
            Applied filters:{' '}
            <span className="text-primary font-semibold">
              {selectedFilters.join(', ') || 'None'}
            </span>
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// REAL-WORLD USE CASES
// ============================================================================

/**
 * Admin dashboard feature toggles with status indicators
 */
export const AdminFeatureToggles: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-medium text-foreground">Feature Flags</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enable/disable experimental features
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-primary/5 border border-primary/10">
          <div>
            <Label className="text-sm font-medium text-primary">New Dashboard</Label>
            <p className="text-xs text-muted-foreground mt-1">Stable version</p>
          </div>
          <Toggle defaultValue="dashboard" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-primary/5 border border-primary/10">
          <div>
            <Label className="text-sm font-medium text-primary">Advanced Search</Label>
            <p className="text-xs text-muted-foreground mt-1">Beta version</p>
          </div>
          <Toggle defaultValue="search" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-yellow-500/5 border border-yellow-500/10">
          <div>
            <Label className="text-sm font-medium">AI Suggestions</Label>
            <p className="text-xs text-muted-foreground mt-1">Experimental</p>
          </div>
          <Toggle />
        </div>

        <div className="flex items-center justify-between p-3 rounded-md opacity-50">
          <div>
            <Label className="text-sm font-medium">Offline Mode</Label>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </div>
          <Toggle disabled />
        </div>
      </div>
    </div>
  ),
}

/**
 * Rich text editor toolbar with grouped controls
 */
export const RichTextEditorToolbar: Story = {
  render: () => {
    const [textFormat, setTextFormat] = React.useState<string[]>(['bold'])
    const [alignment, setAlignment] = React.useState<string>('left')

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="flex gap-4 items-start">
          {/* Text formatting group */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Format</Label>
            <ToggleGroup type="multiple" className="gap-0">
              <Toggle
                size="sm"
                value="bold"
                pressed={textFormat.includes('bold')}
                onClick={() =>
                  setTextFormat((prev) =>
                    prev.includes('bold')
                      ? prev.filter((f) => f !== 'bold')
                      : [...prev, 'bold']
                  )
                }
              >
                B
              </Toggle>
              <Toggle
                size="sm"
                value="italic"
                pressed={textFormat.includes('italic')}
                onClick={() =>
                  setTextFormat((prev) =>
                    prev.includes('italic')
                      ? prev.filter((f) => f !== 'italic')
                      : [...prev, 'italic']
                  )
                }
              >
                I
              </Toggle>
              <Toggle
                size="sm"
                value="underline"
                pressed={textFormat.includes('underline')}
                onClick={() =>
                  setTextFormat((prev) =>
                    prev.includes('underline')
                      ? prev.filter((f) => f !== 'underline')
                      : [...prev, 'underline']
                  )
                }
              >
                U
              </Toggle>
            </ToggleGroup>
          </div>

          {/* Alignment group */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Align</Label>
            <ToggleGroup type="single" value={alignment} className="gap-0">
              <Toggle
                size="sm"
                value="left"
                onClick={() => setAlignment('left')}
              >
                L
              </Toggle>
              <Toggle
                size="sm"
                value="center"
                onClick={() => setAlignment('center')}
              >
                C
              </Toggle>
              <Toggle
                size="sm"
                value="right"
                onClick={() => setAlignment('right')}
              >
                R
              </Toggle>
            </ToggleGroup>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Format: <span className="text-primary font-semibold">{textFormat.join(', ') || 'none'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Alignment: <span className="text-primary font-semibold">{alignment}</span>
          </p>
        </div>
      </div>
    )
  },
}
