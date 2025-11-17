import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextLink, Strong, Code } from './text';

/**
 * Catalyst Text component from Headless UI/Catalyst.
 *
 * **This is a Tier 1 Primitive** - semantic text component for body content, paragraphs, and inline text elements.
 * No Tier 2 branded version exists - this is the official typography component for the design system.
 *
 * ## Catalyst Text Features
 * - **Body Text**: Primary paragraph and text content component
 * - **Responsive Typography**: Different sizes for mobile (text-base/6) and desktop (text-sm/6)
 * - **Dark Mode Support**: Built-in dark mode text colors (text-zinc-500 / dark:text-zinc-400)
 * - **Semantic HTML**: Renders proper `<p>` elements
 * - **Companion Components**: TextLink, Strong, and Code for inline formatting
 * - **Accessible**: Proper contrast ratios and semantic markup
 * - **Lightweight**: Minimal styling - easy to extend
 *
 * ## Component Structure
 * ```tsx
 * <Text>Body paragraph text goes here.</Text>
 * <Text>Text with <Strong>bold emphasis</Strong> and <TextLink href="#">links</TextLink>.</Text>
 * <Text>Inline code: <Code>npm install</Code></Text>
 * ```
 *
 * ## Included Components
 *
 * ### Text
 * Main body text component for paragraphs and descriptions.
 * - Base styling: `text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400`
 * - Renders as `<p>` element
 * - Use for: Body paragraphs, descriptions, captions, labels
 *
 * ### TextLink
 * Text links with underline decoration and hover effects.
 * - Styling: Underline with hover states
 * - Accessible: Uses Link component from Catalyst navigation
 * - Use for: Inline links within body text
 *
 * ### Strong
 * Bold emphasis for important text.
 * - Styling: `font-medium text-zinc-950 dark:text-white`
 * - Renders as `<strong>` element
 * - Use for: Emphasis, important keywords
 *
 * ### Code
 * Inline code snippets with monospace font.
 * - Styling: Rounded border, subtle background, monospace font
 * - Renders as `<code>` element
 * - Use for: Variable names, commands, file names
 *
 * ## Common Use Cases
 * - **Body Content**: Paragraphs in articles, blog posts, documentation
 * - **Descriptions**: Product descriptions, card content, feature explanations
 * - **Captions**: Image captions, metadata labels
 * - **Labels**: Form labels, data field labels
 * - **Secondary Text**: Muted text for less important information
 * - **Inline Formatting**: Bold emphasis, links, and code within text
 *
 * ## Ozean Licht Design System Integration
 *
 * According to the design system typography guidelines:
 *
 * **Font Family Usage:**
 * - **Body Text**: Montserrat - `font-sans`
 * - **Alt Body**: Montserrat Alternates - `font-alt` (for variation)
 * - **Decorative**: Cinzel Decorative - `font-decorative` (RARE in body text)
 *
 * **Typography Scale:**
 * - Base: 1rem (16px), Montserrat, Regular (400)
 * - Small: 0.875rem (14px), for captions and metadata
 * - Large: 1.125rem (18px), for prominent body text
 *
 * **Text Colors:**
 * - Primary Body: `text-zinc-700 dark:text-zinc-300`
 * - Secondary/Muted: `text-zinc-500 dark:text-zinc-400` (default)
 * - Emphasis: `text-zinc-950 dark:text-white`
 * - Brand Turquoise: `text-[#0ec2bc]`
 *
 * **Line Height:**
 * - Base: `leading-relaxed` (1.625) for readability
 * - Tight: `leading-normal` (1.5) for compact layouts
 *
 * ## Extending with Design System
 *
 * Override the base Catalyst styling with Ozean Licht typography:
 *
 * ```tsx
 * // Standard body text with Montserrat
 * <Text className="font-sans text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
 *   Your body text content here with optimal readability.
 * </Text>
 *
 * // Muted secondary text
 * <Text className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
 *   Secondary information or captions.
 * </Text>
 *
 * // Small caption text
 * <Text className="font-sans text-xs text-zinc-400 dark:text-zinc-500">
 *   Metadata, timestamps, or small details.
 * </Text>
 *
 * // Brand-colored text
 * <Text className="font-sans text-base text-[#0ec2bc]">
 *   Text with Ozean Licht turquoise accent.
 * </Text>
 * ```
 *
 * ## Inline Formatting Examples
 *
 * ```tsx
 * <Text>
 *   This paragraph has <Strong>bold emphasis</Strong>, an inline{' '}
 *   <TextLink href="/docs">link to documentation</TextLink>, and a{' '}
 *   <Code>code snippet</Code> for technical content.
 * </Text>
 * ```
 *
 * ## Styling Notes
 * - Base Text styling: `text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400`
 * - TextLink styling: Underline with hover state transitions
 * - Strong styling: `font-medium text-zinc-950 dark:text-white`
 * - Code styling: Border, background, monospace font
 * - Dark mode handled automatically via `dark:` variants
 * - Override with `className` prop to apply design system fonts and colors
 * - Use Montserrat (`font-sans`) for primary body text
 * - Use Montserrat Alternates (`font-alt`) for stylistic variation
 *
 * ## Accessibility
 * - Uses semantic HTML (`<p>`, `<strong>`, `<code>`, `<a>`)
 * - Color contrast meets WCAG AA standards
 * - Links have visible focus states
 * - Strong uses semantic `<strong>` for screen readers
 * - Code uses semantic `<code>` for proper announcement
 * - Line height optimized for readability
 *
 * ## Typography Best Practices
 * - Keep line length between 45-75 characters for readability
 * - Use `leading-relaxed` (1.625) for body text
 * - Use Text for paragraphs, not just for inline text
 * - Combine with Heading components for proper hierarchy
 * - Use Strong sparingly for true emphasis
 * - Use Code only for technical content, not for styling
 * - Ensure sufficient contrast between text and background
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A semantic text component for body paragraphs and descriptions with responsive typography, dark mode support, and inline formatting options. Part of the Headless UI Catalyst component library.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Text content',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text component.
 *
 * Basic body text with Catalyst's default responsive typography.
 */
export const Default: Story = {
  args: {
    children: 'This is a standard paragraph of body text using the Catalyst Text component.',
  },
};

/**
 * All text sizes showcase.
 *
 * Demonstrates different text sizes for various use cases.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <div>
        <Text className="text-xl">
          Extra Large Text - For prominent body content or introductory paragraphs (20px)
        </Text>
      </div>
      <div>
        <Text className="text-lg">
          Large Text - For emphasized body content or feature descriptions (18px)
        </Text>
      </div>
      <div>
        <Text className="text-base">
          Base Text - Standard body text for paragraphs and general content (16px)
        </Text>
      </div>
      <div>
        <Text className="text-sm">
          Small Text - For secondary information, captions, and metadata (14px)
        </Text>
      </div>
      <div>
        <Text className="text-xs">
          Extra Small Text - For fine print, timestamps, and minor details (12px)
        </Text>
      </div>
    </div>
  ),
};

/**
 * Paragraph text with multiple paragraphs.
 *
 * Shows how Text components work for multi-paragraph content.
 */
export const Paragraph: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text>
        The Text component is designed for body content and paragraphs. It provides
        consistent styling across your application with built-in responsive behavior
        and dark mode support.
      </Text>
      <Text>
        Each Text component renders as a paragraph element, making it semantic and
        accessible. The default styling uses a muted color (zinc-500) that works well
        for body content without competing with headings.
      </Text>
      <Text>
        You can easily customize the appearance using the className prop to apply
        design system fonts, colors, and spacing to match your brand guidelines.
      </Text>
    </div>
  ),
};

/**
 * Muted secondary text.
 *
 * Text with reduced prominence for secondary information.
 */
export const MutedText: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Product Name</h3>
        <Text>This is the main product description with standard text color.</Text>
        <Text className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
          This is secondary information with muted color - perfect for metadata.
        </Text>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Article Title</h3>
        <Text className="text-zinc-400 dark:text-zinc-500 text-sm mb-4">
          Published on November 13, 2025 • 5 min read
        </Text>
        <Text>
          The main article content starts here with standard body text styling for
          optimal readability and visual hierarchy.
        </Text>
      </div>
    </div>
  ),
};

/**
 * Small text for captions and metadata.
 *
 * Demonstrates small text sizing for supporting information.
 */
export const SmallText: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600" />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">Beautiful Landscape</h3>
          <Text className="text-xs text-zinc-400 dark:text-zinc-500">
            Photo by John Doe • Unsplash • Creative Commons
          </Text>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Username</span>
          <Text className="text-xs text-zinc-400">@johndoe</Text>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Last Login</span>
          <Text className="text-xs text-zinc-400">2 hours ago</Text>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Member Since</span>
          <Text className="text-xs text-zinc-400">January 2023</Text>
        </div>
      </div>
    </div>
  ),
};

/**
 * Text with custom colors.
 *
 * Demonstrates overriding text color with className.
 */
export const WithColor: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Text className="text-blue-600 dark:text-blue-400">
        Blue text for informational messages or links.
      </Text>
      <Text className="text-green-600 dark:text-green-400">
        Green text for success messages or positive feedback.
      </Text>
      <Text className="text-red-600 dark:text-red-400">
        Red text for error messages or warnings.
      </Text>
      <Text className="text-yellow-600 dark:text-yellow-400">
        Yellow text for caution or important notices.
      </Text>
      <Text className="text-[#0ec2bc]">
        Ozean Licht turquoise for brand-colored text and accents.
      </Text>
      <Text className="text-zinc-950 dark:text-white">
        High contrast text for maximum emphasis and readability.
      </Text>
    </div>
  ),
};

/**
 * Text with inline formatting.
 *
 * Shows how to use Strong, TextLink, and Code within body text.
 */
export const WithInlineFormatting: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text>
        This paragraph demonstrates <Strong>bold emphasis</Strong> using the Strong
        component for important keywords and concepts.
      </Text>
      <Text>
        You can include inline <TextLink href="#">links to documentation</TextLink> or
        other pages using the TextLink component with proper hover states.
      </Text>
      <Text>
        For technical content, use the <Code>Code</Code> component to display inline
        code like <Code>npm install</Code> or <Code>className="text-lg"</Code>.
      </Text>
      <Text>
        Combine all formatting options: <Strong>Bold text</Strong>, inline{' '}
        <TextLink href="#">links</TextLink>, and <Code>code snippets</Code> work
        together seamlessly within body paragraphs.
      </Text>
    </div>
  ),
};

/**
 * Strong emphasis variations.
 *
 * Demonstrates the Strong component for bold text emphasis.
 */
export const StrongVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text>
        Use <Strong>Strong</Strong> for emphasis on important words or phrases.
      </Text>
      <Text>
        <Strong>Warning:</Strong> This action cannot be undone. Make sure you have
        backed up your data before proceeding.
      </Text>
      <Text>
        Product features: <Strong>Lightning fast</Strong>,{' '}
        <Strong>highly secure</Strong>, and <Strong>easy to use</Strong>.
      </Text>
      <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900">
        <Text className="text-sm">
          <Strong>Pro Tip:</Strong> You can combine Strong with color classes for
          additional emphasis.
        </Text>
      </div>
    </div>
  ),
};

/**
 * TextLink variations.
 *
 * Demonstrates the TextLink component for inline links.
 */
export const TextLinkVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text>
        Visit our <TextLink href="#">documentation</TextLink> to learn more about the
        available features.
      </Text>
      <Text>
        Read the <TextLink href="#">Getting Started Guide</TextLink> or check out the{' '}
        <TextLink href="#">API Reference</TextLink> for detailed information.
      </Text>
      <Text className="text-sm text-zinc-400">
        Need help? <TextLink href="#">Contact Support</TextLink> or browse our{' '}
        <TextLink href="#">FAQ</TextLink>.
      </Text>
      <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20">
        <Text className="text-sm">
          <Strong>Note:</Strong> TextLink includes hover and focus states for
          accessibility. Try hovering over <TextLink href="#">this link</TextLink> to
          see the effect.
        </Text>
      </div>
    </div>
  ),
};

/**
 * Code component variations.
 *
 * Demonstrates the Code component for inline code snippets.
 */
export const CodeVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text>
        Install the package using <Code>npm install @example/package</Code> or{' '}
        <Code>yarn add @example/package</Code>.
      </Text>
      <Text>
        Set the <Code>className</Code> prop to <Code>"text-lg font-bold"</Code> to
        customize the styling.
      </Text>
      <Text>
        Common Git commands: <Code>git status</Code>, <Code>git add .</Code>,{' '}
        <Code>git commit -m "message"</Code>.
      </Text>
      <Text className="text-sm">
        File path: <Code>/opt/ozean-licht-ecosystem/shared/ui/src/catalyst/text.tsx</Code>
      </Text>
      <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900">
        <Text className="text-sm">
          <Strong>Keyboard Shortcut:</Strong> Press <Code>Ctrl</Code> +{' '}
          <Code>Shift</Code> + <Code>P</Code> to open the command palette.
        </Text>
      </div>
    </div>
  ),
};

/**
 * Responsive typography example.
 *
 * Shows how text adapts to different screen sizes. Resize viewport to see changes.
 */
export const Responsive: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Responsive Text Sizing</h2>
        <Text className="mb-2">
          The default Text component uses responsive sizing: <Code>text-base/6</Code> on
          mobile and <Code>text-sm/6</Code> on desktop screens.
        </Text>
        <Text className="text-xs text-zinc-400">
          Resize your browser window to see the text size change at the sm breakpoint
          (640px).
        </Text>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Custom Responsive Sizing</h3>
        <Text className="text-lg sm:text-xl md:text-2xl mb-2">
          This text grows larger on bigger screens using responsive utilities.
        </Text>
        <Text className="text-sm text-zinc-500">
          Using classes: <Code>text-lg sm:text-xl md:text-2xl</Code>
        </Text>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Responsive Line Height</h3>
        <Text className="leading-relaxed sm:leading-loose text-base">
          This paragraph adjusts its line height based on screen size for optimal
          readability. On mobile, it uses <Code>leading-relaxed</Code> (1.625), and on
          larger screens, it switches to <Code>leading-loose</Code> (2.0) for a more
          spacious reading experience.
        </Text>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed text.
 *
 * Demonstrates Ozean Licht design system typography with Montserrat fonts.
 *
 * **Design System Rules:**
 * - Body Text: Montserrat (font-sans)
 * - Alt Body: Montserrat Alternates (font-alt)
 * - Primary Color: #0ec2bc (turquoise)
 * - Base Size: 16px (1rem)
 * - Line Height: 1.625 (leading-relaxed)
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8 p-8 bg-[#0A0F1A] rounded-lg">
      {/* Standard body text with Montserrat */}
      <div>
        <h3 className="font-decorative text-2xl text-white mb-4">Standard Body Text</h3>
        <Text className="font-sans text-base text-zinc-300 leading-relaxed">
          This is standard body text using Montserrat font. It provides excellent
          readability for longer content blocks and maintains a professional appearance
          throughout the application. The line height is set to 1.625 for comfortable
          reading.
        </Text>
        <Text className="text-xs text-zinc-500 mt-2">
          Font: Montserrat, Size: 1rem (16px), Line Height: 1.625
        </Text>
      </div>

      {/* Montserrat Alternates variation */}
      <div className="border-t border-zinc-800 pt-6">
        <h3 className="font-decorative text-2xl text-white mb-4">
          Alternative Body Style
        </h3>
        <Text className="font-alt text-base text-zinc-300 leading-relaxed">
          This uses Montserrat Alternates for stylistic variation. Use this sparingly
          to create visual distinction in specific sections or to highlight certain
          content areas without using bold or color changes.
        </Text>
        <Text className="text-xs text-zinc-500 mt-2">
          Font: Montserrat Alternates, Size: 1rem (16px)
        </Text>
      </div>

      {/* Turquoise accent text */}
      <div className="border-t border-zinc-800 pt-6">
        <h3 className="font-decorative text-2xl text-white mb-4">Brand Accent Color</h3>
        <Text className="font-sans text-base text-[#0ec2bc] leading-relaxed">
          Use the Ozean Licht turquoise color (#0ec2bc) for brand-specific text,
          calls-to-action, or to highlight important information that deserves special
          attention from readers.
        </Text>
        <Text className="text-xs text-zinc-500 mt-2">Color: #0ec2bc (Turquoise)</Text>
      </div>

      {/* Muted secondary text */}
      <div className="border-t border-zinc-800 pt-6">
        <h3 className="font-decorative text-2xl text-white mb-4">Secondary Text</h3>
        <Text className="font-sans text-sm text-zinc-400 leading-relaxed">
          Secondary text uses a smaller size (14px) and muted color (zinc-400) for
          metadata, timestamps, captions, and other supporting information that should
          be visible but not dominate the content hierarchy.
        </Text>
        <Text className="text-xs text-zinc-500 mt-2">
          Size: 0.875rem (14px), Color: zinc-400
        </Text>
      </div>

      {/* Inline formatting on dark background */}
      <div className="border-t border-zinc-800 pt-6">
        <h3 className="font-decorative text-2xl text-white mb-4">Inline Formatting</h3>
        <Text className="font-sans text-base text-zinc-300 leading-relaxed">
          Combine <Strong className="text-white">bold emphasis</Strong> with inline{' '}
          <TextLink href="#" className="text-[#0ec2bc] underline decoration-[#0ec2bc]/50 hover:decoration-[#0ec2bc]">
            turquoise links
          </TextLink>{' '}
          and <Code className="bg-zinc-800 border-zinc-700 text-[#0ec2bc]">code snippets</Code>{' '}
          for rich text formatting within the Ozean Licht design system.
        </Text>
      </div>

      {/* Text sizes comparison */}
      <div className="border-t border-zinc-800 pt-6">
        <h3 className="font-decorative text-2xl text-white mb-4">Size Variations</h3>
        <div className="space-y-3">
          <Text className="font-sans text-lg text-zinc-300">
            Large body text (18px) - For prominent content
          </Text>
          <Text className="font-sans text-base text-zinc-300">
            Base body text (16px) - Standard paragraph text
          </Text>
          <Text className="font-sans text-sm text-zinc-400">
            Small text (14px) - Captions and metadata
          </Text>
          <Text className="font-sans text-xs text-zinc-500">
            Extra small (12px) - Fine print and timestamps
          </Text>
        </div>
      </div>
    </div>
  ),
};

/**
 * Article layout example.
 *
 * Shows a realistic article layout using Text components with headings.
 */
export const ArticleLayout: Story = {
  render: () => (
    <article className="max-w-3xl space-y-6">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold mb-3">
          The Complete Guide to Typography in Web Design
        </h1>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>By Sarah Johnson</span>
          <span>•</span>
          <time>November 13, 2025</time>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </header>

      <Text className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Typography is one of the most important aspects of web design, yet it's often
        overlooked. Good typography can make or break your website's user experience,
        affecting readability, accessibility, and overall aesthetic appeal.
      </Text>

      <section>
        <h2 className="text-2xl font-bold mb-4">Why Typography Matters</h2>
        <Text className="mb-4">
          The fonts you choose and how you use them directly impact how users consume
          your content. Studies show that <Strong>proper typography increases reading
          comprehension by up to 20%</Strong> and significantly reduces eye strain
          during extended reading sessions.
        </Text>
        <Text>
          Modern web typography involves more than just picking a pretty font. You need
          to consider font pairing, hierarchy, spacing, responsive behavior, and
          performance optimization to create an optimal reading experience across all
          devices.
        </Text>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <Text className="mb-4">
          Here are some essential guidelines for implementing typography in your web
          projects:
        </Text>
        <ul className="space-y-2 list-disc list-inside">
          <Text as="li">
            <Strong>Limit font families:</Strong> Use 2-3 fonts maximum to maintain
            visual consistency.
          </Text>
          <Text as="li">
            <Strong>Optimize line length:</Strong> Aim for 45-75 characters per line for
            optimal readability.
          </Text>
          <Text as="li">
            <Strong>Use appropriate line height:</Strong> Set line-height to 1.5-1.625
            for body text.
          </Text>
          <Text as="li">
            <Strong>Ensure sufficient contrast:</Strong> Meet WCAG AA standards for
            accessibility.
          </Text>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
        <Text className="mb-4">
          When implementing typography in React, use semantic components like the
          Catalyst Text component. Install it using:
        </Text>
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 mb-4">
          <Code>npm install @headlessui/react</Code>
        </div>
        <Text>
          For more information, visit the{' '}
          <TextLink href="#">official documentation</TextLink> or check out the{' '}
          <TextLink href="#">typography guide</TextLink>.
        </Text>
      </section>

      <footer className="border-t pt-6 mt-8">
        <Text className="text-sm text-zinc-500">
          Last updated: November 13, 2025. Found an error?{' '}
          <TextLink href="#">Submit a correction</TextLink>.
        </Text>
      </footer>
    </article>
  ),
};

/**
 * Card content example.
 *
 * Shows Text components used in card-based layouts.
 */
export const CardContent: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div className="border rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold">Feature Card</h3>
        <Text className="text-sm">
          This card demonstrates how Text components work in constrained layouts with
          limited space and specific design requirements.
        </Text>
        <div className="pt-3 border-t">
          <Text className="text-xs text-zinc-400">Updated 2 hours ago</Text>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-3 bg-[#0ec2bc]/5 border-[#0ec2bc]/25">
        <h3 className="text-lg font-semibold text-[#0ec2bc]">Highlighted Card</h3>
        <Text className="text-sm text-zinc-700 dark:text-zinc-300">
          Use brand colors and backgrounds to draw attention to important cards or
          featured content within your layouts.
        </Text>
        <div className="pt-3 border-t border-[#0ec2bc]/25">
          <Text className="text-xs text-zinc-500">Featured</Text>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Product Name</h3>
          <span className="text-sm font-bold text-green-600">$29.99</span>
        </div>
        <Text className="text-sm">
          High-quality product with <Strong>premium features</Strong> and excellent
          customer reviews.
        </Text>
        <div className="flex items-center gap-2 pt-3 border-t">
          <span className="text-xs text-zinc-400">⭐ 4.8</span>
          <span className="text-xs text-zinc-300">•</span>
          <Text className="text-xs text-zinc-400">1,234 reviews</Text>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-3 bg-zinc-900 text-white">
        <h3 className="text-lg font-semibold">Dark Mode Card</h3>
        <Text className="text-sm text-zinc-300">
          The Text component automatically adapts to dark backgrounds using the{' '}
          <Code className="bg-zinc-800 border-zinc-700 text-zinc-300">
            dark:
          </Code>{' '}
          variant classes.
        </Text>
        <div className="pt-3 border-t border-zinc-700">
          <Text className="text-xs text-zinc-400">Automatic adaptation</Text>
        </div>
      </div>
    </div>
  ),
};

/**
 * Form labels and descriptions.
 *
 * Shows Text used for form field labels and help text.
 */
export const FormText: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="you@example.com"
        />
        <Text className="text-xs text-zinc-500 mt-1">
          We'll never share your email with anyone else.
        </Text>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="••••••••"
        />
        <Text className="text-xs text-zinc-500 mt-1">
          Must be at least <Strong>8 characters</Strong> with{' '}
          <Strong>1 uppercase letter</Strong> and <Strong>1 number</Strong>.
        </Text>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md resize-none"
          rows={4}
          placeholder="Tell us about yourself..."
        />
        <div className="flex justify-between items-center mt-1">
          <Text className="text-xs text-zinc-500">
            Brief description for your profile.
          </Text>
          <Text className="text-xs text-zinc-400">0 / 500</Text>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <div className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</div>
        <div className="flex-1">
          <Text className="text-sm text-blue-900 dark:text-blue-100">
            <Strong>Tip:</Strong> Complete your profile to unlock additional features.
            Visit your <TextLink href="#">account settings</TextLink> to learn more.
          </Text>
        </div>
      </div>
    </div>
  ),
};
