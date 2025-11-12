import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Terminal, AlertCircle, CheckCircle2, Info } from 'lucide-react';

/**
 * Alert component for displaying important messages.
 * Used throughout the admin dashboard for notifications and feedback.
 *
 * ## Features
 * - Default and destructive variants
 * - Icon support
 * - Title and description sections
 * - Accessible role="alert"
 */
const meta = {
  title: 'Admin/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Alert component for displaying important messages and notifications in the admin dashboard.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Alert variant',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert
 */
export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert for errors
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Success alert
 */
export const Success: Story = {
  render: () => (
    <Alert className="border-green-500/50 text-green-700 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Info alert
 */
export const Information: Story = {
  render: () => (
    <Alert className="border-blue-500/50 text-blue-700 dark:text-blue-400">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        The system will undergo maintenance on Sunday at 2:00 AM UTC.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only title
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Database connection established</AlertTitle>
    </Alert>
  ),
};

/**
 * Alert with only description
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <AlertDescription>
        This is a simple alert message without a title.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert without icon
 */
export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>No Icon</AlertTitle>
      <AlertDescription>
        This alert doesn't have an icon.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * All alert variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is the default alert variant.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          This is the destructive alert variant.
        </AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          This is a custom success alert.
        </AlertDescription>
      </Alert>

      <Alert className="border-blue-500/50 text-blue-700">
        <Info className="h-4 w-4" />
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>
          This is a custom info alert.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * Real-world examples
 */
export const Examples: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>User created successfully</AlertTitle>
        <AlertDescription>
          New admin user "john@example.com" has been added to the system.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Permission denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this resource. Contact your administrator.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 text-yellow-700">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pending approval</AlertTitle>
        <AlertDescription>
          This action requires approval from a super admin before it takes effect.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
