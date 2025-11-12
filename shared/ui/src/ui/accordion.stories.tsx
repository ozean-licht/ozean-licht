import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

/**
 * Accordion component for collapsible content sections.
 * Built on Radix UI Accordion primitive.
 *
 * ## Features
 * - Single or multiple items can be open
 * - Keyboard navigation (Arrow keys, Home, End, Space, Enter)
 * - Smooth expand/collapse animations
 * - Accessible ARIA attributes
 * - Chevron icon rotation on open/close
 */
const meta = {
  title: 'Shared UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A vertically stacked set of interactive headings that each reveal a section of content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Determines whether one or multiple items can be opened at a time',
    },
    collapsible: {
      control: 'boolean',
      description: 'When type is "single", whether an item can be collapsed after opening',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default accordion (single item open at a time)
 */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and supports keyboard navigation.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that can be customized with your own classes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It includes smooth expand and collapse animations using CSS transitions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Multiple items can be open simultaneously
 */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Ozean Licht?</AccordionTrigger>
        <AccordionContent>
          Ozean Licht is an Austrian association providing educational and content platforms
          for children and families.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What technologies do you use?</AccordionTrigger>
        <AccordionContent>
          We use Next.js, TypeScript, PostgreSQL, and deploy with Coolify on Hetzner infrastructure.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Clone the repository, run pnpm install, and follow the setup instructions in the README.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Accordion with default open item
 */
export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-2">
      <AccordionItem value="item-1">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          Download the application and create your account to begin.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Quick Tutorial</AccordionTrigger>
        <AccordionContent>
          Follow our 5-minute tutorial to learn the basics of the platform.
          This section is open by default.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Advanced Features</AccordionTrigger>
        <AccordionContent>
          Explore advanced features like automation, integrations, and custom workflows.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * FAQ example
 */
export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="faq-1">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards (Visa, MasterCard, American Express), PayPal,
          and bank transfers for annual subscriptions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel your subscription at any time from your account settings.
          You'll continue to have access until the end of your billing period.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
        <AccordionContent>
          We offer a 30-day money-back guarantee. If you're not satisfied within the first
          30 days, contact support for a full refund.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-4">
        <AccordionTrigger>Is my data secure?</AccordionTrigger>
        <AccordionContent>
          Yes, we use bank-level encryption (AES-256) and follow industry best practices.
          All data is encrypted at rest and in transit.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-5">
        <AccordionTrigger>What support options are available?</AccordionTrigger>
        <AccordionContent>
          We offer 24/7 email support, live chat during business hours, and phone support
          for enterprise customers.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Accordion with rich content
 */
export const RichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="features">
        <AccordionTrigger>Key Features</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Multi-tenant architecture with entity isolation</li>
            <li>Role-based access control (RBAC)</li>
            <li>Real-time health monitoring</li>
            <li>MCP Gateway for service integration</li>
            <li>Automated deployment with Coolify</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="specs">
        <AccordionTrigger>Technical Specifications</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <strong>Frontend:</strong> Next.js 14, React 18, TypeScript 5.3
            </div>
            <div>
              <strong>Backend:</strong> Node.js, PostgreSQL 15, Redis
            </div>
            <div>
              <strong>Infrastructure:</strong> Hetzner AX42 (64GB RAM, 2×512GB NVMe)
            </div>
            <div>
              <strong>Deployment:</strong> Coolify, Docker, Grafana monitoring
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Interactive test with play function
 * Tests expand/collapse functionality and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" data-testid="accordion-item-1">
        <AccordionTrigger data-testid="trigger-1">
          First Item
        </AccordionTrigger>
        <AccordionContent data-testid="content-1">
          Content of first item
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" data-testid="accordion-item-2">
        <AccordionTrigger data-testid="trigger-2">
          Second Item
        </AccordionTrigger>
        <AccordionContent data-testid="content-2">
          Content of second item
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" data-testid="accordion-item-3">
        <AccordionTrigger data-testid="trigger-3">
          Third Item
        </AccordionTrigger>
        <AccordionContent data-testid="content-3">
          Content of third item
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get triggers
    const trigger1 = canvas.getByTestId('trigger-1');
    const trigger2 = canvas.getByTestId('trigger-2');

    // Initially all items should be closed
    await expect(canvas.getByTestId('accordion-item-1')).toHaveAttribute('data-state', 'closed');

    // Click first trigger to expand
    await userEvent.click(trigger1);

    // Wait a moment for animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // First item should be open
    await expect(canvas.getByTestId('accordion-item-1')).toHaveAttribute('data-state', 'open');

    // Click second trigger
    await userEvent.click(trigger2);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second item should be open, first should be closed (type="single")
    await expect(canvas.getByTestId('accordion-item-2')).toHaveAttribute('data-state', 'open');
    await expect(canvas.getByTestId('accordion-item-1')).toHaveAttribute('data-state', 'closed');

    // Click second trigger again to collapse (collapsible=true)
    await userEvent.click(trigger2);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // All items should be closed
    await expect(canvas.getByTestId('accordion-item-2')).toHaveAttribute('data-state', 'closed');
  },
};
