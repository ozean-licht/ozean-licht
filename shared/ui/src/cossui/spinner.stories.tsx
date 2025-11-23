import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'
import { Button } from './button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from './card'

const meta: Meta<typeof Spinner> = {
  title: 'Tier 1: Primitives/CossUI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Spinner component from Coss UI with Ozean Licht styling. Displays a circular loading indicator with support for 5 size variants (xs, sm, default, lg, xl). Uses the primary color (#0ec2bc) for the loading animation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Size variant of the spinner',
    },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

/**
 * Default spinner with medium size
 */
export const Default: Story = {
  args: {
    size: 'default',
  },
}

/**
 * Extra small spinner - ideal for inline loading indicators
 */
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
}

/**
 * Small spinner - good for compact UI elements
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
}

/**
 * Large spinner - suitable for prominent loading states
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
}

/**
 * Extra large spinner - used for full-page or modal loading
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
}

/**
 * All spinner sizes displayed together
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-12 justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xs" />
        <p className="text-xs text-muted-foreground">xs</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <p className="text-xs text-muted-foreground">sm</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="default" />
        <p className="text-xs text-muted-foreground">default</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <p className="text-xs text-muted-foreground">lg</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <p className="text-xs text-muted-foreground">xl</p>
      </div>
    </div>
  ),
}

/**
 * Spinner inside a button to indicate loading state
 */
export const InButton: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center">
      <Button disabled className="flex items-center gap-2">
        <Spinner size="sm" />
        Loading...
      </Button>
      <Button variant="secondary" disabled className="flex items-center gap-2">
        <Spinner size="sm" />
        Submitting...
      </Button>
      <Button variant="outline" disabled className="flex items-center gap-2">
        <Spinner size="sm" />
        Processing...
      </Button>
    </div>
  ),
}

/**
 * Spinner with different button sizes
 */
export const InButtonVariousSizes: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap justify-center items-center">
      <Button size="sm" disabled className="flex items-center gap-2">
        <Spinner size="xs" />
        Small
      </Button>
      <Button size="default" disabled className="flex items-center gap-2">
        <Spinner size="sm" />
        Default
      </Button>
      <Button size="lg" disabled className="flex items-center gap-2">
        <Spinner size="default" />
        Large
      </Button>
      <Button size="xl" disabled className="flex items-center gap-2">
        <Spinner size="lg" />
        Extra Large
      </Button>
    </div>
  ),
}

/**
 * Spinner in a card showing loading content state
 */
export const InCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Loading Content</CardTitle>
        <CardDescription>Fetching your data...</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </CardPanel>
    </Card>
  ),
}

/**
 * Multiple cards with loading state
 */
export const MultipleCardsLoading: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>User Data</CardTitle>
          <CardDescription>Fetching user information</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="flex items-center justify-center gap-3 py-6">
            <Spinner size="default" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Computing statistics</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="flex items-center justify-center gap-3 py-6">
            <Spinner size="default" />
            <span className="text-sm text-muted-foreground">Analyzing...</span>
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Generating reports</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="flex items-center justify-center gap-3 py-6">
            <Spinner size="default" />
            <span className="text-sm text-muted-foreground">Generating...</span>
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Loading history</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="flex items-center justify-center gap-3 py-6">
            <Spinner size="default" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardPanel>
      </Card>
    </div>
  ),
}

/**
 * Full-page centered loading state
 */
export const FullPageLoading: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-background via-card to-background">
      <Spinner size="xl" />
      <p className="text-lg text-muted-foreground">Loading application...</p>
      <p className="text-xs text-muted-foreground/70">Please wait while we prepare everything</p>
    </div>
  ),
}

/**
 * Spinner with text label in various configurations
 */
export const WithText: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="default" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>

      <div className="flex items-center gap-3">
        <Spinner size="sm" />
        <p className="text-sm text-muted-foreground">Processing your request...</p>
      </div>

      <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner size="lg" />
        <p className="text-base text-muted-foreground font-medium">Synchronizing data</p>
        <p className="text-xs text-muted-foreground">This might take a few moments</p>
      </div>
    </div>
  ),
}

/**
 * Spinner in different contextual backgrounds
 */
export const InDifferentBackgrounds: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 p-8 bg-background rounded-lg border border-border">
        <Spinner size="default" />
        <span className="text-sm text-muted-foreground">On Background</span>
      </div>

      <div className="flex items-center justify-center gap-4 p-8 bg-card/50 rounded-lg border border-border backdrop-blur-8">
        <Spinner size="default" />
        <span className="text-sm text-muted-foreground">On Card</span>
      </div>

      <div className="flex items-center justify-center gap-4 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
        <Spinner size="default" />
        <span className="text-sm text-primary">On Primary Gradient</span>
      </div>

      <div className="flex items-center justify-center gap-4 p-8 bg-muted rounded-lg border border-muted-foreground/20">
        <Spinner size="default" />
        <span className="text-sm text-muted-foreground">On Muted</span>
      </div>
    </div>
  ),
}

/**
 * Spinner in table-like data loading scenarios
 */
export const InTableLoading: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Loading your recent transactions...</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex gap-4 pb-4 border-b border-border">
            <div className="flex-1 text-xs font-medium text-muted-foreground">Date</div>
            <div className="flex-1 text-xs font-medium text-muted-foreground">Description</div>
            <div className="flex-1 text-xs font-medium text-muted-foreground">Amount</div>
          </div>

          {/* Loading skeleton rows */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
              <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
              <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
            </div>
          ))}

          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-3 py-8">
            <Spinner size="default" />
            <span className="text-sm text-muted-foreground">Loading more...</span>
          </div>
        </div>
      </CardPanel>
    </Card>
  ),
}

/**
 * Multiple spinners for parallel loading operations
 */
export const ParallelLoading: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
      <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Fetching Data</p>
          <p className="text-xs text-muted-foreground mt-1">API request in progress</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Processing</p>
          <p className="text-xs text-muted-foreground mt-1">Computing results</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Saving</p>
          <p className="text-xs text-muted-foreground mt-1">Persisting changes</p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Spinner with status messages and steps
 */
export const WithStatusMessages: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8 rounded-lg bg-card/50 backdrop-blur-8 border border-border max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-medium text-primary mb-2">Installation in progress</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we set up your environment
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {[
          { step: 1, label: 'Downloading', active: false },
          { step: 2, label: 'Installing dependencies', active: true },
          { step: 3, label: 'Configuring', active: false },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
              {item.active ? (
                <Spinner size="xs" />
              ) : (
                <span className="text-xs text-muted-foreground">{item.step}</span>
              )}
            </div>
            <span
              className={
                item.active
                  ? 'text-sm font-medium text-primary'
                  : 'text-sm text-muted-foreground'
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
      </div>
      <p className="text-xs text-muted-foreground">67% complete</p>
    </div>
  ),
}

/**
 * Accessible spinner with proper ARIA attributes
 */
export const Accessible: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner size="default" aria-label="Page content loading" />
        <div>
          <p className="text-sm font-medium text-primary">Loading content</p>
          <p className="text-xs text-muted-foreground">
            The spinner has proper ARIA label for screen readers
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-8 border border-border">
        <Spinner
          size="default"
          role="status"
          aria-label="Form submission in progress"
        />
        <div>
          <p className="text-sm font-medium text-primary">Submitting form</p>
          <p className="text-xs text-muted-foreground">
            Proper semantic role status attribute for accessibility
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Interactive demo showing loading state toggle
 */
export const Interactive: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(false)

    return (
      <div className="flex flex-col items-center gap-6">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Data Fetch Demo</CardTitle>
            <CardDescription>Click the button to simulate loading</CardDescription>
          </CardHeader>
          <CardPanel>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Spinner size="lg" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Fetching data...</p>
                  <p className="text-xs text-muted-foreground">
                    This simulates a network request
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">Data loaded successfully!</p>
              </div>
            )}
          </CardPanel>
          <CardFooter>
            <Button
              variant="primary"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 2000)
              }}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Fetch Data'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  },
}
