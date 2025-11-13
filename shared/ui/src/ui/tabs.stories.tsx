import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

/**
 * Tabs component for organizing content into multiple panels.
 * Built on Radix UI Tabs primitive.
 *
 * ## Features
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Automatic activation on focus
 * - Accessible ARIA attributes
 * - Controlled and uncontrolled modes
 * - Multiple tabs support
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of layered sections of content, known as tab panels, that display one panel at a time.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Default active tab',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Tab list orientation',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tabs with three panels
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with card content
 */
export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              View your account overview and recent activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Total Users:</span> 12,543
            </div>
            <div className="text-sm">
              <span className="font-medium">Active Sessions:</span> 89
            </div>
            <div className="text-sm">
              <span className="font-medium">Revenue:</span> $42,150
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Detailed analytics and insights for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analytics dashboard coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with disabled tab
 */
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="available" className="w-full">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="coming-soon" disabled>
          Coming Soon
        </TabsTrigger>
        <TabsTrigger value="deprecated" disabled>
          Deprecated
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <p className="text-sm text-muted-foreground">
          This feature is currently available.
        </p>
      </TabsContent>
      <TabsContent value="coming-soon">
        <p className="text-sm text-muted-foreground">
          This feature is coming soon.
        </p>
      </TabsContent>
      <TabsContent value="deprecated">
        <p className="text-sm text-muted-foreground">
          This feature has been deprecated.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Interactive form example with tabs
 */
export const FormExample: Story = {
  render: () => (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="company">Company</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="john@example.com"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Manage your company profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Acme Corp"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Update your billing details and payment method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No billing information on file.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Many tabs example
 */
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList>
        {Array.from({ length: 8 }, (_, i) => (
          <TabsTrigger key={i} value={`tab${i + 1}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: 8 }, (_, i) => (
        <TabsContent key={i} value={`tab${i + 1}`}>
          <p className="text-sm text-muted-foreground">
            Content for tab {i + 1}
          </p>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

/**
 * Interactive test with play function
 * Tests keyboard navigation and tab switching
 */
export const InteractiveTest: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-full">
      <TabsList data-testid="tabs-list">
        <TabsTrigger value="home" data-testid="tab-home">
          Home
        </TabsTrigger>
        <TabsTrigger value="profile" data-testid="tab-profile">
          Profile
        </TabsTrigger>
        <TabsTrigger value="messages" data-testid="tab-messages">
          Messages
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" data-testid="content-home">
        <p>Home content</p>
      </TabsContent>
      <TabsContent value="profile" data-testid="content-profile">
        <p>Profile content</p>
      </TabsContent>
      <TabsContent value="messages" data-testid="content-messages">
        <p>Messages content</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial state
    const homeTab = canvas.getByTestId('tab-home');
    const profileTab = canvas.getByTestId('tab-profile');

    await expect(homeTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-home')).toBeInTheDocument();

    // Click on Profile tab
    await userEvent.click(profileTab);

    // Verify Profile tab is now active
    await expect(profileTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-profile')).toBeInTheDocument();

    // Test keyboard navigation - Arrow Right to Messages
    await userEvent.keyboard('{ArrowRight}');
    const messagesTab = canvas.getByTestId('tab-messages');
    await expect(messagesTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-messages')).toBeInTheDocument();

    // Arrow Left back to Profile
    await userEvent.keyboard('{ArrowLeft}');
    await expect(profileTab).toHaveAttribute('data-state', 'active');
  },
};
