import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Link } from './link';
import { ExternalLink, ChevronRight, Home, FileText } from 'lucide-react';

/**
 * Link primitive component built on Headless UI DataInteractive.
 *
 * **This is a Tier 1 Primitive** - Catalyst enhanced anchor component with interactive data attributes.
 * No Tier 2 branded version exists for this component.
 *
 * ## Headless UI Link Features
 * - **DataInteractive Wrapper**: Automatically adds data-interactive attribute for styling hooks
 * - **Framework Agnostic**: Can be adapted for Next.js Link, Remix Link, or Inertia.js Link
 * - **Accessible**: Semantic HTML anchor element with proper attributes
 * - **Forward Ref**: Supports ref forwarding for DOM access
 * - **Type Safe**: Full TypeScript support with HTMLAnchorElement attributes
 *
 * ## Component Integration
 * This component is designed to be replaced with your framework's routing solution:
 * - **Next.js**: Replace with `next/link` component
 * - **Remix**: Replace with `@remix-run/react` Link
 * - **Inertia.js**: Replace with `@inertiajs/react` Link
 * - **React Router**: Replace with `react-router-dom` Link
 *
 * See Catalyst documentation: https://catalyst.tailwindui.com/docs#client-side-router-integration
 *
 * ## Component Structure
 * ```tsx
 * <Link href="/path"> // Enhanced anchor with data-interactive
 *   Link text
 * </Link>
 * ```
 *
 * ## Usage in Catalyst Components
 * This Link component is used internally by:
 * - **NavbarItem**: Navigation menu items
 * - **SidebarItem**: Sidebar navigation links
 * - **Dropdown items**: Dropdown menu navigation
 *
 * ## Usage Notes
 * - Use `href` prop for navigation destinations
 * - Supports all standard anchor attributes (target, rel, etc.)
 * - data-interactive attribute enables Catalyst styling patterns
 * - Can be styled with data-hover, data-focus, etc. using Headless UI data attributes
 * - Forward ref allows parent components to access the underlying anchor element
 *
 * ## Styling Integration
 * The DataInteractive wrapper enables data attribute selectors:
 * - `[data-interactive]` - Always present on link
 * - `data-hover` - Applied on hover state
 * - `data-focus` - Applied on focus state
 * - `data-active` - Can be applied programmatically for active routes
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An enhanced anchor component that wraps links with Headless UI DataInteractive for advanced styling hooks. Designed to be replaced with framework-specific routing solutions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'Navigation destination URL',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: 'text',
      description: 'Link content (text or elements)',
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
      description: 'Link target attribute',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '_self' },
      },
    },
    rel: {
      control: 'text',
      description: 'Link relationship (e.g., "noopener noreferrer" for external links)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default link with simple text.
 *
 * The most basic link implementation showing a standard anchor element.
 */
export const Default: Story = {
  args: {
    href: '#',
    children: 'Default Link',
  },
};

/**
 * All link variants and use cases.
 *
 * Comprehensive display of different link styles and purposes.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Basic Links</h3>
        <div className="flex flex-col gap-2">
          <Link href="#" className="text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Simple text link
          </Link>
          <Link href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Styled text link (blue)
          </Link>
          <Link href="#" className="text-sm text-primary hover:underline">
            Primary color link
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Links with Icons</h3>
        <div className="flex flex-col gap-2">
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            <Home className="size-4" />
            Home
          </Link>
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            <FileText className="size-4" />
            Documentation
          </Link>
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Visit External Site
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Navigation Links</h3>
        <div className="flex flex-col gap-2">
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Products
            <ChevronRight className="size-4" />
          </Link>
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Services
            <ChevronRight className="size-4" />
          </Link>
          <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            About
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Styled Variants</h3>
        <div className="flex flex-col gap-2">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Button-style link
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Outline link
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold text-zinc-900 underline decoration-2 underline-offset-4 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
          >
            Underlined link
          </Link>
        </div>
      </div>
    </div>
  ),
};

/**
 * Links with icons in different positions.
 *
 * Shows how to position icons before or after link text using flexbox.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Leading Icons</h3>
        <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
          <Home className="size-4" />
          Go to Home
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Trailing Icons</h3>
        <Link href="#" className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
          Continue
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">External Link Icon</h3>
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Visit External Site
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Icon Only</h3>
        <Link
          href="#"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
        >
          <Home className="size-5" />
        </Link>
      </div>
    </div>
  ),
};

/**
 * Active state indication.
 *
 * Shows how to style links to indicate the current page or active navigation item.
 */
export const ActiveState: Story = {
  render: () => (
    <nav className="space-y-2 p-8">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Navigation Menu</h3>
      <div className="flex flex-col gap-1">
        <Link
          href="#"
          className="rounded-lg px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
          aria-current="page"
        >
          Projects (Active)
        </Link>
        <Link
          href="#"
          className="rounded-lg px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
        >
          Settings
        </Link>
      </div>
    </nav>
  ),
};

/**
 * External link with proper attributes.
 *
 * Demonstrates best practices for external links with target and rel attributes.
 */
export const External: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">External Links (New Tab)</h3>
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          External Website
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">External Documentation</h3>
        <Link
          href="https://catalyst.tailwindui.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Catalyst Documentation
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Email Link</h3>
        <Link
          href="mailto:contact@example.com"
          className="inline-flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
        >
          contact@example.com
        </Link>
      </div>
    </div>
  ),
};

/**
 * Disabled link state.
 *
 * Shows how to visually indicate disabled links (note: use buttons for truly disabled interactive elements).
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Disabled Links</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Note: For truly disabled interactive elements, consider using a button instead.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="#"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
            className="pointer-events-none text-sm text-zinc-400 dark:text-zinc-600"
          >
            Disabled link (pointer-events-none)
          </Link>
          <Link
            href="#"
            aria-disabled="true"
            className="cursor-not-allowed text-sm text-zinc-400 opacity-50 dark:text-zinc-600"
          >
            Disabled link (cursor-not-allowed)
          </Link>
          <span className="text-sm text-zinc-400 dark:text-zinc-600">
            Disabled link (as span)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Comparison: Normal vs Disabled</h3>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Normal link
          </Link>
          <Link
            href="#"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
            className="pointer-events-none text-sm text-zinc-400 dark:text-zinc-600"
          >
            Disabled link
          </Link>
        </div>
      </div>
    </div>
  ),
};

/**
 * Links in navigation context.
 *
 * Demonstrates how Link component is used within navigation menus, matching the NavbarItem pattern.
 */
export const InNavigation: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Horizontal Navigation</h3>
        <nav className="flex items-center gap-6">
          <Link href="#" className="text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium text-primary">
            Projects
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Team
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
            Settings
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Vertical Sidebar Navigation</h3>
        <nav className="w-64 space-y-1 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
          >
            <Home className="size-5" />
            Home
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
          >
            <FileText className="size-5" />
            Documents
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Footer Links</h3>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Cookie Policy
          </Link>
          <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Contact Us
          </Link>
        </nav>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed links.
 *
 * Demonstrates links styled with Ozean Licht turquoise accent color (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-6 p-8 dark:bg-zinc-950">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Ozean Licht Primary Links</h3>
        <div className="flex flex-col gap-3">
          <Link
            href="#"
            style={{ color: '#0ec2bc' }}
            className="text-sm font-medium hover:underline"
          >
            Primary turquoise link (#0ec2bc)
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:opacity-80"
          >
            <span
              className="flex size-6 items-center justify-center rounded-full"
              style={{ backgroundColor: '#0ec2bc' }}
            >
              <Home className="size-4 text-white" />
            </span>
            Link with turquoise icon background
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ borderColor: '#0ec2bc' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0ec2bc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Outlined link with turquoise border
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Ozean Licht Navigation</h3>
        <nav className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-2">
          <Link
            href="#"
            className="rounded-lg px-3 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: 'rgba(14, 194, 188, 0.1)',
              color: '#0ec2bc'
            }}
          >
            Projects (Active)
          </Link>
          <Link
            href="#"
            className="rounded-lg px-3 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Settings
          </Link>
        </nav>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Ozean Licht External Links</h3>
        <div className="flex flex-col gap-2">
          <Link
            href="https://ozean-licht.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: '#0ec2bc' }}
          >
            Visit Ozean Licht
            <ExternalLink className="size-4" />
          </Link>
          <Link
            href="https://kids-ascension.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: '#0ec2bc' }}
          >
            Visit Kids Ascension
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Ozean Licht Glow Effect</h3>
        <Link
          href="#"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
          style={{
            backgroundColor: '#0ec2bc',
            boxShadow: '0 0 20px rgba(14, 194, 188, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(14, 194, 188, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(14, 194, 188, 0.5)';
          }}
        >
          Glowing CTA Link
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  ),
};

/**
 * Interactive link test with keyboard navigation.
 *
 * Tests link interaction and keyboard accessibility using Storybook play function.
 */
export const InteractiveTest: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <Link
        href="#test"
        data-testid="test-link"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        Test Link
      </Link>
      <Link
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="external-link"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        External Link
        <ExternalLink className="size-4" />
      </Link>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test internal link
    const testLink = canvas.getByTestId('test-link');
    await expect(testLink).toBeInTheDocument();
    await expect(testLink).toHaveAttribute('href', '#test');

    // Test external link attributes
    const externalLink = canvas.getByTestId('external-link');
    await expect(externalLink).toBeInTheDocument();
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Test keyboard focus
    await userEvent.tab();
    await expect(testLink).toHaveFocus();

    // Tab to next link
    await userEvent.tab();
    await expect(externalLink).toHaveFocus();
  },
};

/**
 * Framework integration examples.
 *
 * Shows how to replace the basic Link with framework-specific routing solutions.
 */
export const FrameworkIntegration: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Current Implementation (Basic)</h3>
        <pre className="rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800">
{`import { Link } from '@/catalyst/navigation/link'

<Link href="/page">Navigate</Link>`}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Next.js Integration Example</h3>
        <pre className="rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800">
{`// Update link.tsx to use Next.js Link
import NextLink from 'next/link'
import * as Headless from '@headlessui/react'

export const Link = forwardRef(function Link(props, ref) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})`}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Remix Integration Example</h3>
        <pre className="rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800">
{`// Update link.tsx to use Remix Link
import { Link as RemixLink } from '@remix-run/react'
import * as Headless from '@headlessui/react'

export const Link = forwardRef(function Link(props, ref) {
  return (
    <Headless.DataInteractive>
      <RemixLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})`}
        </pre>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> Replace the Link component implementation in{' '}
          <code className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">
            src/catalyst/navigation/link.tsx
          </code>{' '}
          to use your framework's routing solution. This ensures client-side navigation
          without full page reloads.
        </p>
      </div>
    </div>
  ),
};
