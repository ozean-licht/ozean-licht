import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Terminal, AlertCircle, CheckCircle2, Info as InfoIcon, AlertTriangle } from 'lucide-react';

/**
 * Alert component for displaying important messages and notifications.
 *
 * ## Features
 * - Default and destructive variants
 * - Icon support
 * - Semantic HTML with role="alert"
 * - Customizable with className
 * - Title and description sections
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a callout for user attention with optional icon, title, and description.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Visual style variant',
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
 * Default alert with info styling
 */
export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert for error messages
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
 * Success alert (custom styling)
 */
export const Success: Story = {
  render: () => (
    <Alert className="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Warning alert (custom styling)
 */
export const Warning: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Info alert (custom styling)
 */
export const Info: Story = {
  render: () => (
    <Alert className="border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        The system will undergo maintenance on Sunday at 2:00 AM UTC.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only title (no description)
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Operation completed successfully</AlertTitle>
    </Alert>
  ),
};

/**
 * Alert with only description (no title)
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        This is a simple notification without a title.
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
      <AlertTitle>No Icon Alert</AlertTitle>
      <AlertDescription>
        This alert doesn't include an icon.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * All alert variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Standard alert variant.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Error or danger alert variant.</AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 bg-green-50 text-green-900">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Custom success styling.</AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Custom warning styling.</AlertDescription>
      </Alert>

      <Alert className="border-blue-500/50 bg-blue-50 text-blue-900">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Custom info styling.</AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * Real-world usage examples
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Deployment successful</AlertTitle>
        <AlertDescription>
          Application v2.4.1 has been deployed to production at 14:23 UTC.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database connection failed</AlertTitle>
        <AlertDescription>
          Unable to connect to PostgreSQL database. Check your connection settings and try again.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Rate limit approaching</AlertTitle>
        <AlertDescription>
          You have used 850 of 1000 API requests this hour. Consider upgrading your plan.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
