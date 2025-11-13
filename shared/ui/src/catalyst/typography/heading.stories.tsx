import type { Meta, StoryObj } from '@storybook/react';
import { Heading, Subheading } from './heading';

/**
 * Catalyst Heading component from Headless UI/Catalyst.
 *
 * **This is a Tier 1 Primitive** - semantic heading component with minimal default styling.
 * No Tier 2 branded version exists - this is the official typography component for the design system.
 *
 * ## Catalyst Heading Features
 * - **Semantic HTML**: Renders h1-h6 elements based on level prop
 * - **Responsive Typography**: Different sizes for mobile (text-2xl/8) and desktop (text-xl/8)
 * - **Dark Mode Support**: Built-in dark mode text colors
 * - **Accessible**: Uses proper heading hierarchy
 * - **Lightweight**: Minimal styling - easy to extend
 *
 * ## Component Structure
 * ```tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2}>Section Heading</Heading>
 * <Subheading level={2}>Subsection Title</Subheading>
 * ```
 *
 * ## Common Use Cases
 * - **Page Titles**: H1 for hero sections and page titles
 * - **Section Headings**: H2 for major sections
 * - **Card Titles**: H3 for card headers
 * - **Subsections**: H4-H6 for nested content hierarchy
 * - **Subheadings**: Use Subheading component for smaller, secondary headings
 *
 * ## Ozean Licht Design System Integration
 *
 * According to the design system typography guidelines:
 *
 * **Font Family Usage:**
 * - **H1 & H2**: Cinzel Decorative (use SPARINGLY) - `font-decorative`
 * - **H3 & H4**: Montserrat - `font-sans`
 * - **H5 & H6**: Montserrat Alternates - `font-alt`
 *
 * **Typography Scale:**
 * - H1: 3rem-4rem (48-64px), Cinzel Decorative, Regular (400)
 * - H2: 2.25rem-3rem (36-48px), Cinzel Decorative, Regular (400)
 * - H3: 1.875rem-2.25rem (30-36px), Montserrat, Regular (400)
 * - H4: 1.5rem-1.875rem (24-30px), Montserrat, Regular (400)
 * - H5: 1.25rem-1.5rem (20-24px), Montserrat Alternates, Regular (400)
 * - H6: 1rem-1.25rem (16-20px), Montserrat Alternates, Regular (400)
 *
 * **Text Shadows (H1, H2 only):**
 * ```css
 * h1 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.6); }
 * h2 { text-shadow: 0 0 8px rgba(255, 255, 255, 0.42); }
 * ```
 *
 * ## Extending with Design System
 *
 * Override the base Catalyst styling with Ozean Licht typography:
 *
 * ```tsx
 * // H1 with Cinzel Decorative
 * <Heading level={1} className="font-decorative text-4xl md:text-6xl"
 *   style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}>
 *   Ozean Licht
 * </Heading>
 *
 * // H2 with Cinzel Decorative
 * <Heading level={2} className="font-decorative text-3xl md:text-4xl"
 *   style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.42)' }}>
 *   Section Title
 * </Heading>
 *
 * // H3 with Montserrat
 * <Heading level={3} className="font-sans text-2xl md:text-3xl">
 *   Subsection
 * </Heading>
 * ```
 *
 * ## Styling Notes
 * - Base Catalyst styling: `text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white`
 * - Subheading styling: `text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white`
 * - Dark mode handled automatically via `dark:text-white`
 * - Override with `className` prop to apply design system fonts
 * - Use `style` prop for text shadows on H1/H2
 *
 * ## Accessibility
 * - Uses semantic HTML heading elements (h1-h6)
 * - Maintains proper heading hierarchy
 * - Ensure heading levels are sequential (don't skip levels)
 * - One H1 per page for best accessibility
 * - Color contrast meets WCAG AA standards
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A semantic heading component that renders h1-h6 elements with responsive typography and dark mode support. Part of the Headless UI Catalyst component library.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level (h1-h6)',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Heading text content',
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default heading (H1).
 *
 * Basic H1 heading with Catalyst's default responsive typography.
 */
export const Default: Story = {
  args: {
    children: 'Heading Text',
    level: 1,
  },
};

/**
 * All heading levels showcase.
 *
 * Demonstrates H1 through H6 with Catalyst's base styling.
 */
export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Heading level={1}>Heading 1 - Main Page Title</Heading>
      <Heading level={2}>Heading 2 - Section Title</Heading>
      <Heading level={3}>Heading 3 - Subsection Title</Heading>
      <Heading level={4}>Heading 4 - Card Title</Heading>
      <Heading level={5}>Heading 5 - Small Heading</Heading>
      <Heading level={6}>Heading 6 - Smallest Heading</Heading>
      <div className="pt-4 border-t mt-6">
        <Subheading level={2}>Subheading - Secondary Text</Subheading>
      </div>
    </div>
  ),
};

/**
 * Page title (H1).
 *
 * H1 heading for page heroes and main titles.
 */
export const PageTitle: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Heading level={1}>Welcome to Our Platform</Heading>
      <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
        Discover amazing features and start your journey today.
      </p>
    </div>
  ),
};

/**
 * Section heading (H2).
 *
 * H2 heading for major page sections.
 */
export const SectionHeading: Story = {
  render: () => (
    <div className="max-w-4xl space-y-4">
      <Heading level={2}>Features Overview</Heading>
      <p className="text-base text-zinc-600 dark:text-zinc-400">
        Explore the powerful capabilities of our platform and how they can benefit your workflow.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Feature 1</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Description here</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Feature 2</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Description here</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Card title (H3).
 *
 * H3 heading for card headers and subsections.
 */
export const CardTitle: Story = {
  render: () => (
    <div className="max-w-md border rounded-lg p-6">
      <Heading level={3}>Project Dashboard</Heading>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-4">
        Track your project progress and team activities.
      </p>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Tasks Completed</span>
          <span className="font-semibold">24/30</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Team Members</span>
          <span className="font-semibold">8</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Heading with custom color.
 *
 * Demonstrates overriding text color with className.
 */
export const WithColor: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <Heading level={1} className="text-blue-600 dark:text-blue-400">
        Blue Heading
      </Heading>
      <Heading level={2} className="text-green-600 dark:text-green-400">
        Green Heading
      </Heading>
      <Heading level={3} className="text-purple-600 dark:text-purple-400">
        Purple Heading
      </Heading>
      <Heading level={2} className="text-[#0ec2bc]">
        Ozean Licht Turquoise
      </Heading>
    </div>
  ),
};

/**
 * Responsive typography example.
 *
 * Shows how headings adapt to different screen sizes. Resize viewport to see changes.
 */
export const Responsive: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8">
      <div>
        <Heading level={1} className="mb-2">
          Responsive H1 Title
        </Heading>
        <p className="text-sm text-zinc-500">
          This heading changes size based on viewport (text-2xl on mobile, text-xl on desktop)
        </p>
      </div>
      <div>
        <Heading level={2} className="mb-2">
          Responsive H2 Section
        </Heading>
        <p className="text-sm text-zinc-500">
          Catalyst headings include responsive utilities by default
        </p>
      </div>
      <div>
        <Subheading level={2} className="mb-2">
          Responsive Subheading
        </Subheading>
        <p className="text-sm text-zinc-500">
          Subheadings use smaller, secondary typography (text-base/7 to text-sm/6)
        </p>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed headings.
 *
 * Demonstrates Ozean Licht design system typography with Cinzel Decorative,
 * Montserrat, and Montserrat Alternates fonts.
 *
 * **Design System Rules:**
 * - H1/H2: Cinzel Decorative with text shadow (use sparingly)
 * - H3/H4: Montserrat
 * - H5/H6: Montserrat Alternates
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8 p-8 bg-[#0A0F1A] rounded-lg">
      {/* H1 - Cinzel Decorative with glow */}
      <div>
        <Heading
          level={1}
          className="font-decorative text-4xl md:text-6xl text-white"
          style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}
        >
          Ozean Licht
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H1: Cinzel Decorative, 4rem (64px), with text shadow glow
        </p>
      </div>

      {/* H2 - Cinzel Decorative with subtle glow */}
      <div className="border-t border-zinc-800 pt-6">
        <Heading
          level={2}
          className="font-decorative text-3xl md:text-4xl text-white"
          style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.42)' }}
        >
          Spiritual Awakening Courses
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H2: Cinzel Decorative, 3rem (48px), with subtle text shadow
        </p>
      </div>

      {/* H3 - Montserrat */}
      <div className="border-t border-zinc-800 pt-6">
        <Heading level={3} className="font-sans text-2xl md:text-3xl text-white">
          Course Overview
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H3: Montserrat, 2.25rem (36px), no text shadow
        </p>
      </div>

      {/* H4 - Montserrat */}
      <div className="border-t border-zinc-800 pt-6">
        <Heading level={4} className="font-sans text-xl md:text-2xl text-white">
          Module Details
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H4: Montserrat, 1.875rem (30px)
        </p>
      </div>

      {/* H5 - Montserrat Alternates */}
      <div className="border-t border-zinc-800 pt-6">
        <Heading level={5} className="font-alt text-lg md:text-xl text-white">
          Lesson Information
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H5: Montserrat Alternates, 1.25rem (20px)
        </p>
      </div>

      {/* H6 - Montserrat Alternates */}
      <div className="border-t border-zinc-800 pt-6">
        <Heading level={6} className="font-alt text-base md:text-lg text-white">
          Section Label
        </Heading>
        <p className="text-sm text-zinc-400 mt-2">
          H6: Montserrat Alternates, 1rem (16px)
        </p>
      </div>

      {/* Subheading */}
      <div className="border-t border-zinc-800 pt-6">
        <Subheading level={2} className="font-sans text-sm text-zinc-300">
          Secondary Information
        </Subheading>
        <p className="text-sm text-zinc-400 mt-2">
          Subheading: Smaller, secondary text for labels and metadata
        </p>
      </div>
    </div>
  ),
};

/**
 * Heading with turquoise accent.
 *
 * Shows how to apply Ozean Licht's primary turquoise color (#0ec2bc).
 */
export const WithTurquoiseAccent: Story = {
  render: () => (
    <div className="max-w-4xl space-y-6 p-8 bg-[#0A0F1A] rounded-lg">
      <Heading
        level={1}
        className="font-decorative text-4xl md:text-6xl"
        style={{
          color: '#0ec2bc',
          textShadow: '0 0 8px rgba(14, 194, 188, 0.6)',
        }}
      >
        Turquoise Hero Title
      </Heading>

      <Heading
        level={2}
        className="font-decorative text-3xl md:text-4xl text-[#0ec2bc]"
        style={{ textShadow: '0 0 8px rgba(14, 194, 188, 0.42)' }}
      >
        Section with Turquoise Glow
      </Heading>

      <Heading level={3} className="font-sans text-2xl text-[#0ec2bc]">
        Subsection in Turquoise
      </Heading>

      <div className="mt-4 p-4 border border-[#0ec2bc]/25 rounded-lg">
        <p className="text-sm text-zinc-300">
          Ozean Licht primary color (#0ec2bc) with glow effects for emphasis.
        </p>
      </div>
    </div>
  ),
};

/**
 * Heading hierarchy in context.
 *
 * Shows proper heading hierarchy in a realistic page layout.
 */
export const HeadingHierarchy: Story = {
  render: () => (
    <div className="max-w-4xl space-y-6">
      <Heading level={1}>User Guide</Heading>

      <p className="text-base text-zinc-600 dark:text-zinc-400">
        Complete guide to getting started with our platform.
      </p>

      <div className="mt-8">
        <Heading level={2}>Getting Started</Heading>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Follow these steps to set up your account.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Heading level={3}>Step 1: Create an Account</Heading>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Visit the signup page and enter your details.
            </p>
          </div>

          <div>
            <Heading level={3}>Step 2: Verify Email</Heading>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Check your inbox for a verification link.
            </p>

            <div className="mt-3 ml-4">
              <Heading level={4}>Important Notes</Heading>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                <li>Check spam folder if email doesn't arrive</li>
                <li>Link expires after 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <Heading level={2}>Advanced Features</Heading>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Explore advanced capabilities once you're familiar with the basics.
        </p>
      </div>
    </div>
  ),
};

/**
 * Subheading component variations.
 *
 * Demonstrates the Subheading component for secondary, smaller headings.
 */
export const SubheadingVariations: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8">
      <div>
        <Subheading level={2}>Default Subheading</Subheading>
        <p className="text-sm text-zinc-500 mt-1">
          Smaller text for secondary information
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <Heading level={3}>Dashboard Stats</Heading>
        <Subheading level={2} className="mt-2 text-zinc-500">
          Last updated 5 minutes ago
        </Subheading>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">1,234</div>
            <Subheading level={3} className="text-zinc-400">Total Users</Subheading>
          </div>
          <div>
            <div className="text-2xl font-bold">567</div>
            <Subheading level={3} className="text-zinc-400">Active Now</Subheading>
          </div>
          <div>
            <div className="text-2xl font-bold">89%</div>
            <Subheading level={3} className="text-zinc-400">Engagement</Subheading>
          </div>
        </div>
      </div>

      <div>
        <Heading level={2}>Product Details</Heading>
        <Subheading level={2} className="text-[#0ec2bc] mt-1">
          Premium Edition
        </Subheading>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Subheadings can be colored to match brand identity.
        </p>
      </div>
    </div>
  ),
};

/**
 * With background variants.
 *
 * Shows headings on different background colors for contrast testing.
 */
export const BackgroundVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Light background */}
      <div className="p-6 bg-white rounded-lg">
        <Heading level={2} className="text-zinc-900">
          Heading on Light Background
        </Heading>
        <p className="text-sm text-zinc-600 mt-2">
          Default Catalyst styling works well on light backgrounds.
        </p>
      </div>

      {/* Dark background */}
      <div className="p-6 bg-zinc-900 rounded-lg">
        <Heading level={2} className="text-white">
          Heading on Dark Background
        </Heading>
        <p className="text-sm text-zinc-300 mt-2">
          Dark mode colors provide good contrast.
        </p>
      </div>

      {/* Cosmic background (Ozean Licht) */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundImage: 'linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)',
        }}
      >
        <Heading
          level={2}
          className="font-decorative text-white text-3xl"
          style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.42)' }}
        >
          Cosmic Background
        </Heading>
        <p className="text-sm text-zinc-300 mt-2">
          Ozean Licht cosmic gradient with Cinzel Decorative font.
        </p>
      </div>

      {/* Turquoise accent background */}
      <div className="p-6 bg-[#0ec2bc]/10 border border-[#0ec2bc]/25 rounded-lg">
        <Heading level={2} className="text-[#0ec2bc]">
          Turquoise Accent Box
        </Heading>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
          Using Ozean Licht's primary color with subtle background.
        </p>
      </div>
    </div>
  ),
};

/**
 * Typography combinations.
 *
 * Shows headings combined with body text for real-world layouts.
 */
export const TypographyCombinations: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8">
      {/* Article layout */}
      <article>
        <Heading level={1} className="mb-4">
          The Future of Web Development
        </Heading>
        <div className="flex items-center gap-4 mb-6">
          <Subheading level={2} className="text-zinc-500">
            By John Doe
          </Subheading>
          <span className="text-sm text-zinc-400">•</span>
          <Subheading level={2} className="text-zinc-500">
            November 13, 2025
          </Subheading>
        </div>
        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
          Web development is evolving rapidly with new frameworks, tools, and paradigms
          emerging constantly. In this article, we explore the latest trends shaping
          the industry.
        </p>
        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          From server components to edge computing, developers have more options than
          ever before to build fast, scalable applications.
        </p>
      </article>

      {/* Feature section */}
      <div className="border-t pt-8">
        <Heading level={2} className="mb-6">
          Key Features
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Heading level={4} className="mb-2">
              Lightning Fast
            </Heading>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Optimized performance with modern build tools and edge delivery.
            </p>
          </div>
          <div>
            <Heading level={4} className="mb-2">
              Developer Friendly
            </Heading>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Intuitive APIs and excellent documentation for rapid development.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
