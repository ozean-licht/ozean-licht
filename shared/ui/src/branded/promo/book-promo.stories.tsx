'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { BookPromo } from './book-promo'

/**
 * BookPromo - Premium book promotion section with image, badge, and CTA.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan gradient theme.
 *
 * ## Features
 * - **Book Image Display**: Rotated book cover with hover animation (rotate-3 → rotate-0)
 * - **Glassmorphic Background**: Gradient backdrop with blur effect and border glow
 * - **Badge System**: SpanBadge with customizable icon (sparkle default)
 * - **Typography**: Cinzel Decorative for title, Montserrat Alternates for body
 * - **CTA Button**: Prominent CtaButton with gradient effect
 * - **Secondary Link**: Optional secondary link text for alternative actions
 * - **Responsive Layout**: 2-column grid on large screens, stacked on mobile
 *
 * ## Design System
 * - **Colors**: Primary cyan (#0ec2bc), dark backgrounds (#00070F)
 * - **Border**: primary/20 opacity with gradient glow
 * - **Spacing**: py-20 px-4 section padding, 12 gap between columns
 * - **Font Family**: Cinzel Decorative (title), Montserrat Alternates (body)
 *
 * ## Usage
 * Use for promoting premium books, courses, or digital products with rich visual presentation.
 * The component handles both German and English content with flexible text props.
 */
const meta = {
  title: 'Tier 2: Branded/BookPromo',
  component: BookPromo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Premium book promotion section component with glassmorphic design, rotating book image, and customizable CTA. Perfect for marketing premium digital products and books.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bookImageUrl: {
      control: 'text',
      description: 'URL of the book cover image',
      table: {
        defaultValue: { summary: '/images/book-promo-cover.webp' },
      },
    },
    title: {
      control: 'text',
      description: 'Book title text (supports German and English)',
      table: {
        defaultValue: { summary: 'Kosmische Codes' },
      },
    },
    description: {
      control: 'text',
      description: 'Book description or tagline',
      table: {
        defaultValue: {
          summary:
            'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden.',
        },
      },
    },
    buttonText: {
      control: 'text',
      description: 'Primary CTA button text',
      table: {
        defaultValue: { summary: 'Auf Amazon Bestellen' },
      },
    },
    buttonHref: {
      control: 'text',
      description: 'URL for primary CTA button',
      table: {
        defaultValue: { summary: 'https://www.amazon.de/dp/B0DCJJCGY6' },
      },
    },
    secondaryLinkText: {
      control: 'text',
      description: 'Optional secondary link text (e.g., "English version")',
      table: {
        defaultValue: { summary: 'Englische Version bestellen' },
      },
    },
    secondaryLinkHref: {
      control: 'text',
      description: 'URL for secondary link',
      table: {
        defaultValue: {
          summary: 'https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6',
        },
      },
    },
    badgeText: {
      control: 'text',
      description: 'Badge text displayed above title',
      table: {
        defaultValue: { summary: 'Alles, was du nie wissen solltest' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes for the section',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
} satisfies Meta<typeof BookPromo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default - Kosmische Codes Book
 *
 * The default promotion for the "Kosmische Codes" book with all standard props.
 * Shows the complete feature set including badge, title, description, CTA button,
 * and secondary English version link.
 *
 * This is the primary promotion variant used on the Ozean Licht platform.
 */
export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#00070F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    bookImageUrl: '/images/book-promo-cover.webp',
    title: 'Kosmische Codes',
    description:
      'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt.',
    buttonText: 'Auf Amazon Bestellen',
    buttonHref: 'https://www.amazon.de/dp/B0DCJJCGY6',
    secondaryLinkText: 'Englische Version bestellen',
    secondaryLinkHref:
      'https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6',
    badgeText: 'Alles, was du nie wissen solltest',
  },
}

/**
 * Custom Book - Alternative Title & Description
 *
 * Demonstrates the component with different book content.
 * Shows flexibility for promoting different titles with custom descriptions.
 * Uses alternative book image and updated CTA.
 *
 * Use case: Multiple book promotions on different landing pages.
 */
export const CustomBook: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#00070F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    bookImageUrl: 'https://via.placeholder.com/400x600?text=Interstellar+Insights',
    title: 'Interstellar Insights',
    description:
      'Unlock the secrets of the cosmos and discover your true cosmic potential. This revolutionary guide reveals ancient wisdom that has been hidden from humanity for millennia. Experience a profound awakening that will forever change your perspective on existence.',
    buttonText: 'Get Book Now',
    buttonHref: 'https://www.amazon.com/Interstellar-Insights-Understanding-Universe/dp/B0DCJJCGY6',
    secondaryLinkText: 'Deutsche Version ansehen',
    secondaryLinkHref: 'https://www.amazon.de/dp/B0DCJJCGY6',
    badgeText: 'Hidden Universal Knowledge',
  },
}

/**
 * No Secondary Link
 *
 * Simplified variant without the secondary language/version link.
 * Perfect for single-version book promotions or when only one
 * purchase option should be highlighted.
 *
 * The secondary link section is completely hidden when both
 * secondaryLinkText and secondaryLinkHref are not provided.
 */
export const NoSecondaryLink: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#00070F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    bookImageUrl: '/images/book-promo-cover.webp',
    title: 'Kosmische Codes',
    description:
      'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren.',
    buttonText: 'Auf Amazon Bestellen',
    buttonHref: 'https://www.amazon.de/dp/B0DCJJCGY6',
    badgeText: 'Alles, was du nie wissen solltest',
    secondaryLinkText: undefined,
    secondaryLinkHref: undefined,
  },
}

/**
 * Custom Button Text
 *
 * Shows the component with alternative primary button text.
 * Useful for different marketing campaigns or CTAs like
 * "Download Free Sample", "Pre-Order Now", "Learn More", etc.
 */
export const CustomButtonText: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#00070F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    bookImageUrl: '/images/book-promo-cover.webp',
    title: 'Kosmische Codes',
    description:
      'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt.',
    buttonText: 'Kostenlose Leseprobe Herunterladen',
    buttonHref: 'https://www.amazon.de/dp/B0DCJJCGY6',
    secondaryLinkText: 'Englische Version bestellen',
    secondaryLinkHref:
      'https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6',
    badgeText: 'Alles, was du nie wissen solltest',
  },
}

/**
 * Interactive Playground
 *
 * Full control over all BookPromo props to experiment with different
 * configurations, text lengths, and styling combinations.
 *
 * Try modifying:
 * - Title length and content
 * - Description length and tone
 * - Button text and href
 * - Badge text
 * - Secondary link visibility
 */
export const Playground: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#00070F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    bookImageUrl: '/images/book-promo-cover.webp',
    title: 'Kosmische Codes',
    description:
      'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt.',
    buttonText: 'Auf Amazon Bestellen',
    buttonHref: 'https://www.amazon.de/dp/B0DCJJCGY6',
    secondaryLinkText: 'Englische Version bestellen',
    secondaryLinkHref:
      'https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6',
    badgeText: 'Alles, was du nie wissen solltest',
    className: '',
  },
}

/**
 * Multiple Book Promos Comparison
 *
 * Visual comparison of different book promotion variants displayed together.
 * Shows how the component scales and adapts to different content lengths
 * and styling variations.
 *
 * Demonstrates:
 * - German vs English content
 * - With and without secondary links
 * - Different button text variations
 * - Consistent design system application
 */
export const MultipleBookPromos: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="bg-[#00070F] min-h-screen space-y-12">
      {/* Kosmische Codes - Full Featured */}
      <div>
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider px-4 pt-12 pb-4">
          Variant 1: Full Featured German
        </div>
        <BookPromo
          bookImageUrl="/images/book-promo-cover.webp"
          title="Kosmische Codes"
          description="Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt."
          buttonText="Auf Amazon Bestellen"
          buttonHref="https://www.amazon.de/dp/B0DCJJCGY6"
          secondaryLinkText="Englische Version bestellen"
          secondaryLinkHref="https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6"
          badgeText="Alles, was du nie wissen solltest"
        />
      </div>

      {/* English Book - Single CTA */}
      <div>
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider px-4 pt-12 pb-4">
          Variant 2: English Single CTA
        </div>
        <BookPromo
          bookImageUrl="https://via.placeholder.com/400x600?text=Interstellar+Insights"
          title="Interstellar Insights"
          description="Unlock the secrets of the cosmos and discover your true cosmic potential. This revolutionary guide reveals ancient wisdom that has been hidden from humanity for millennia."
          buttonText="Get Book on Amazon"
          buttonHref="https://www.amazon.com/dp/B0DCJJCGY6"
          badgeText="Hidden Universal Knowledge"
        />
      </div>

      {/* Minimal Variant - Simplified */}
      <div>
        <div className="text-white/70 text-sm font-alt uppercase tracking-wider px-4 pt-12 pb-4">
          Variant 3: Simplified Single Link
        </div>
        <BookPromo
          bookImageUrl="https://via.placeholder.com/400x600?text=Sacred+Geometry"
          title="Sacred Geometry Unveiled"
          description="Discover the mathematical patterns that govern creation itself. A journey through the sacred blueprints of the universe."
          buttonText="Kostenlose Leseprobe"
          buttonHref="https://www.example.com/sample"
          badgeText="Divine Mathematical Patterns"
        />
      </div>
    </div>
  ),
}

/**
 * Design System Showcase
 *
 * Comprehensive display of the BookPromo component showing its design features:
 * - Glassmorphic card background with gradient and border glow
 * - Rotating book image with hover animation
 * - Badge with sparkle icon
 * - Cinzel Decorative typography for title
 * - Montserrat Alternates for body text
 * - CTA button with gradient and hover effects
 * - Responsive two-column layout
 *
 * This showcase demonstrates the Ozean Licht design system principles
 * applied to the book promotion component.
 */
export const DesignSystemShowcase: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="bg-[#00070F] min-h-screen">
      {/* Header Section */}
      <div className="pt-20 px-8 max-w-4xl mx-auto space-y-8 mb-12">
        <div className="space-y-4">
          <h2 className="font-decorative text-5xl text-white">
            BookPromo Design System
          </h2>
          <p className="text-white/70 text-lg max-w-2xl">
            Premium book promotion component showcasing Ozean Licht's design
            principles: glassmorphism, responsive layout, and premium typography.
          </p>
        </div>

        {/* Design Features Grid */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Glassmorphic Design
            </div>
            <p className="text-white/70 text-sm">
              Gradient backdrop with blur effect and primary-colored border glow
              creates depth and visual hierarchy.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Animated Image
            </div>
            <p className="text-white/70 text-sm">
              Book cover rotates on hover (rotate-3 to rotate-0) with smooth
              transitions for interactive feedback.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Typography Hierarchy
            </div>
            <p className="text-white/70 text-sm">
              Cinzel Decorative for elegant titles, Montserrat Alternates for
              body text with premium brand feel.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Responsive Layout
            </div>
            <p className="text-white/70 text-sm">
              Two-column grid on large screens adapts to single column on mobile
              with optimized spacing.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Badge System
            </div>
            <p className="text-white/70 text-sm">
              SpanBadge with sparkle icon provides visual emphasis and draws
              attention to key messaging.
            </p>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-3">
            <div className="font-decorative text-xl text-primary">
              Call-to-Action
            </div>
            <p className="text-white/70 text-sm">
              CtaButton with gradient and animated hover effect for premium
              purchase CTAs and secondary links.
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="glass-card rounded-lg p-8 mt-12 space-y-4">
          <div className="font-decorative text-2xl text-white mb-6">
            Key Features
          </div>
          <ul className="space-y-3 text-white/70">
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Customizable book image URL with fallback support
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Flexible title and description with multi-language support
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Primary CTA button with customizable text and href
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Optional secondary link for alternative versions or languages
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Badge with customizable text and icon support
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Full className override for custom styling
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Responsive design that adapts to all screen sizes
            </li>
            <li className="flex gap-3">
              <span className="text-primary">+</span>
              Premium glassmorphic effects and smooth animations
            </li>
          </ul>
        </div>
      </div>

      {/* Main Component Display */}
      <BookPromo
        bookImageUrl="/images/book-promo-cover.webp"
        title="Kosmische Codes"
        description="Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt."
        buttonText="Auf Amazon Bestellen"
        buttonHref="https://www.amazon.de/dp/B0DCJJCGY6"
        secondaryLinkText="Englische Version bestellen"
        secondaryLinkHref="https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6"
        badgeText="Alles, was du nie wissen solltest"
      />
    </div>
  ),
}
