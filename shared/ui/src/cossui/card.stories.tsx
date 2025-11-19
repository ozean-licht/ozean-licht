import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'CossUI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card component from Coss UI with glass morphism effects for Ozean Licht. Uses `CardPanel` instead of `CardContent` (Coss UI convention).',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a card component with glass morphism effects adapted for
          Ozean Licht design system.
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          CardPanel is the main content area. Note that Coss UI uses CardPanel
          instead of CardContent.
        </p>
      </CardPanel>
      <CardFooter>
        <Button variant="primary" size="sm">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>A card without a footer section</CardDescription>
      </CardHeader>
      <CardPanel>
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This card demonstrates the minimal structure with just header and
          content panel.
        </p>
      </CardPanel>
    </Card>
  ),
}

export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
      <div className="grid gap-6">
        <Card className="w-[400px] glass-card">
          <CardHeader>
            <CardTitle>Glass Card</CardTitle>
            <CardDescription>
              Standard glass morphism effect with backdrop blur
            </CardDescription>
          </CardHeader>
          <CardPanel>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              The glass effect creates depth and visual hierarchy.
            </p>
          </CardPanel>
        </Card>

        <Card className="w-[400px] glass-card-strong">
          <CardHeader>
            <CardTitle>Strong Glass Card</CardTitle>
            <CardDescription>
              Stronger glass effect for more emphasis
            </CardDescription>
          </CardHeader>
          <CardPanel>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This variant has increased opacity and blur for stronger presence.
            </p>
          </CardPanel>
        </Card>
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card className="w-[400px] cursor-pointer transition-all hover:scale-[1.02]">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>
          This card scales on hover for interactive feedback
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          Hover over this card to see the scale effect. The card also has a
          subtle glow on hover built into the component.
        </p>
      </CardPanel>
      <CardFooter className="gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-background rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardDescription>Active users this month</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="text-4xl font-decorative text-primary">2,543</div>
          <p className="text-xs text-green-500 mt-2">↑ 12% from last month</p>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Total revenue this month</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="text-4xl font-decorative text-primary">$45,231</div>
          <p className="text-xs text-green-500 mt-2">↑ 8% from last month</p>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Currently running projects</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="text-4xl font-decorative text-primary">17</div>
          <p className="text-xs text-yellow-500 mt-2">→ Same as last month</p>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Average task completion</CardDescription>
        </CardHeader>
        <CardPanel>
          <div className="text-4xl font-decorative text-primary">94%</div>
          <p className="text-xs text-green-500 mt-2">↑ 3% from last month</p>
        </CardPanel>
      </Card>
    </div>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardPanel className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-alt font-medium">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-alt font-medium">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full h-8 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm"
          />
        </div>
      </CardPanel>
      <CardFooter className="gap-2">
        <Button variant="ghost" size="default" className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="default" className="flex-1">
          Create Account
        </Button>
      </CardFooter>
    </Card>
  ),
}
