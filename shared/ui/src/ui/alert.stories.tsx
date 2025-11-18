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
      options: ['default', 'destructive', 'success', 'warning', 'info'],
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
 * Success alert with dark-optimized styling
 */
export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle variant="success">Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Warning alert with dark-optimized styling
 */
export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle variant="warning">Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Info alert with dark-optimized styling
 */
export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle variant="info">Information</AlertTitle>
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
        <AlertTitle variant="destructive">Destructive</AlertTitle>
        <AlertDescription>Error or danger alert variant.</AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle variant="success">Success</AlertTitle>
        <AlertDescription>Success alert with dark-optimized styling.</AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle variant="warning">Warning</AlertTitle>
        <AlertDescription>Warning alert with dark-optimized styling.</AlertDescription>
      </Alert>

      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle variant="info">Info</AlertTitle>
        <AlertDescription>Info alert with dark-optimized styling.</AlertDescription>
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
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle variant="success">Deployment successful</AlertTitle>
        <AlertDescription>
          Application v2.4.1 has been deployed to production at 14:23 UTC.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle variant="destructive">Database connection failed</AlertTitle>
        <AlertDescription>
          Unable to connect to PostgreSQL database. Check your connection settings and try again.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle variant="warning">Rate limit approaching</AlertTitle>
        <AlertDescription>
          You have used 850 of 1000 API requests this hour. Consider upgrading your plan.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
