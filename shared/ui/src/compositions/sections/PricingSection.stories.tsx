import type { Meta, StoryObj } from '@storybook/react';
import { PricingSection } from './PricingSection';

/**
 * PricingSection is a pricing table composition displaying multiple pricing tiers in a responsive grid.
 * Perfect for SaaS pricing pages, subscription plans, membership tiers, and product comparisons.
 *
 * ## Features
 * - Responsive grid layout (2, 3, or 4 tier configurations)
 * - Optional section title and subtitle with responsive typography
 * - Integration with PricingCard components for consistent styling
 * - Support for featured/highlighted tiers with glow effects
 * - "Most Popular" badge positioning for featured tiers
 * - Pricing features with check/X icons and optional highlights
 * - Flexible pricing display (currency, amount, period)
 * - CTA button customization per tier
 * - Glass morphism cards with hover effects
 * - Mobile-first responsive design (stacks on small screens)
 * - Ozean Licht cosmic dark theme integration
 * - Automatic grid adjustment based on tier count
 *
 * ## Usage
 * ```tsx
 * <PricingSection
 *   title="Choose Your Plan"
 *   subtitle="Flexible Pricing"
 *   tiers={[
 *     {
 *       name: 'Basic',
 *       price: 9,
 *       period: 'month',
 *       features: [
 *         { text: 'Access to basic content', included: true },
 *         { text: 'Community support', included: true },
 *         { text: 'Advanced features', included: false }
 *       ],
 *       cta: 'Get Started'
 *     }
 *   ]}
 *   onTierSelect={(tier) => console.log('Selected:', tier.name)}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Sections/PricingSection',
  component: PricingSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pricing section composition for displaying subscription tiers and pricing plans with responsive grid layouts and feature comparisons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main section heading (optional)',
    },
    subtitle: {
      control: 'text',
      description: 'Badge subtitle shown above title in primary turquoise color',
    },
    tiers: {
      control: 'object',
      description: 'Array of pricing tier objects with name, price, features, and CTA',
    },
    onTierSelect: {
      action: 'tier-selected',
      description: 'Callback when a tier CTA is clicked, receives the selected tier object',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
} satisfies Meta<typeof PricingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pricing section with 3 tiers
 */
export const Default: Story = {
  args: {
    title: 'Choose Your Plan',
    subtitle: 'Flexible Pricing',
    tiers: [
      {
        id: '1',
        name: 'Basic',
        description: 'Perfect for getting started',
        price: 9,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Access to 50+ guided meditations', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Monthly live sessions', included: true },
          { text: 'Downloadable content', included: false },
          { text: 'Priority support', included: false },
          { text: 'Advanced courses', included: false },
        ],
        cta: 'Get Started',
      },
      {
        id: '2',
        name: 'Pro',
        description: 'Most popular choice',
        price: 19,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Access to all 500+ meditations', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Weekly live sessions', included: true },
          { text: 'Unlimited downloads', included: true },
          { text: 'Priority email support', included: true },
          { text: 'Advanced courses', included: false },
        ],
        cta: 'Start Free Trial',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Premium',
        description: 'For serious practitioners',
        price: 39,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Pro', included: true, highlight: true },
          { text: 'Daily live sessions', included: true },
          { text: 'All advanced courses', included: true },
          { text: '1-on-1 coaching sessions', included: true },
          { text: 'Certification programs', included: true },
          { text: 'Lifetime access to content', included: true },
        ],
        cta: 'Go Premium',
      },
    ],
  },
};

/**
 * Two-tier pricing (comparison layout)
 */
export const TwoTiers: Story = {
  args: {
    title: 'Simple Pricing',
    subtitle: 'Choose What Works for You',
    tiers: [
      {
        id: '1',
        name: 'Free',
        description: 'Try before you commit',
        price: 0,
        currency: '€',
        period: 'forever',
        features: [
          { text: '10 guided meditations', included: true },
          { text: 'Basic breathing exercises', included: true },
          { text: 'Community forum (read-only)', included: true },
          { text: 'Full content library', included: false },
          { text: 'Live sessions', included: false },
          { text: 'Downloads', included: false },
        ],
        cta: 'Start Free',
      },
      {
        id: '2',
        name: 'Unlimited',
        description: 'Everything you need',
        price: 15,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Unlimited meditations', included: true },
          { text: 'All breathing exercises', included: true },
          { text: 'Community forum (full access)', included: true },
          { text: 'Full content library', included: true },
          { text: 'Weekly live sessions', included: true },
          { text: 'Unlimited downloads', included: true },
        ],
        cta: 'Upgrade Now',
        highlighted: true,
        popular: true,
      },
    ],
  },
};

/**
 * Four-tier pricing (enterprise layout)
 */
export const FourTiers: Story = {
  args: {
    title: 'Plans for Everyone',
    subtitle: 'From Individual to Enterprise',
    tiers: [
      {
        id: '1',
        name: 'Starter',
        description: 'Individual practice',
        price: 5,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Basic meditation library', included: true },
          { text: 'Community access', included: true },
          { text: 'Mobile app', included: true },
          { text: 'Live sessions', included: false },
        ],
        cta: 'Start',
      },
      {
        id: '2',
        name: 'Personal',
        description: 'Dedicated practitioners',
        price: 15,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Full meditation library', included: true },
          { text: 'Community access', included: true },
          { text: 'Mobile app', included: true },
          { text: 'Weekly live sessions', included: true },
        ],
        cta: 'Choose Personal',
        popular: true,
      },
      {
        id: '3',
        name: 'Professional',
        description: 'Teachers & coaches',
        price: 29,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Personal', included: true },
          { text: 'Certification access', included: true },
          { text: 'Teaching resources', included: true },
          { text: 'Daily live sessions', included: true },
        ],
        cta: 'Go Pro',
        highlighted: true,
      },
      {
        id: '4',
        name: 'Enterprise',
        description: 'Organizations',
        price: 99,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Professional', included: true },
          { text: 'Unlimited team members', included: true },
          { text: 'Custom branding', included: true },
          { text: 'Dedicated support', included: true },
        ],
        cta: 'Contact Sales',
      },
    ],
  },
};

/**
 * Annual billing pricing (discounted)
 */
export const AnnualBilling: Story = {
  args: {
    title: 'Save with Annual Plans',
    subtitle: '2 Months Free',
    tiers: [
      {
        id: '1',
        name: 'Basic',
        description: 'Save €18 per year',
        price: 90,
        currency: '€',
        period: 'year',
        features: [
          { text: '50+ guided meditations', included: true },
          { text: 'Community forum', included: true },
          { text: 'Monthly live sessions', included: true },
          { text: 'Priority support', included: false },
        ],
        cta: 'Get Started',
      },
      {
        id: '2',
        name: 'Pro',
        description: 'Save €38 per year',
        price: 190,
        currency: '€',
        period: 'year',
        features: [
          { text: '500+ guided meditations', included: true },
          { text: 'Community forum', included: true },
          { text: 'Weekly live sessions', included: true },
          { text: 'Priority support', included: true },
        ],
        cta: 'Start Trial',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Premium',
        description: 'Save €78 per year',
        price: 390,
        currency: '€',
        period: 'year',
        features: [
          { text: 'All Pro features', included: true, highlight: true },
          { text: 'Daily live sessions', included: true },
          { text: '1-on-1 coaching', included: true },
          { text: 'Certification programs', included: true },
        ],
        cta: 'Go Premium',
      },
    ],
  },
};

/**
 * No header (just pricing cards)
 */
export const NoHeader: Story = {
  args: {
    tiers: [
      {
        id: '1',
        name: 'Monthly',
        price: 15,
        period: 'month',
        features: [
          { text: 'All features included', included: true },
          { text: 'Cancel anytime', included: true },
          { text: 'Monthly billing', included: true },
        ],
        cta: 'Subscribe Monthly',
      },
      {
        id: '2',
        name: 'Annual',
        price: 150,
        period: 'year',
        features: [
          { text: 'All features included', included: true },
          { text: 'Save 2 months', included: true, highlight: true },
          { text: 'Annual billing', included: true },
        ],
        cta: 'Subscribe Annually',
        highlighted: true,
        popular: true,
      },
    ],
  },
};

/**
 * Title only (no subtitle)
 */
export const TitleOnly: Story = {
  args: {
    title: 'Membership Plans',
    tiers: [
      {
        name: 'Individual',
        price: 12,
        period: 'month',
        features: [
          { text: 'Personal account', included: true },
          { text: 'Full library access', included: true },
        ],
        cta: 'Join',
      },
      {
        name: 'Family',
        price: 25,
        period: 'month',
        features: [
          { text: 'Up to 5 accounts', included: true },
          { text: 'Full library access', included: true },
        ],
        cta: 'Join',
        popular: true,
      },
      {
        name: 'Studio',
        price: 99,
        period: 'month',
        features: [
          { text: 'Unlimited accounts', included: true },
          { text: 'Commercial license', included: true },
        ],
        cta: 'Contact Us',
      },
    ],
  },
};

/**
 * Kids Ascension educational pricing
 */
export const KidsAscension: Story = {
  args: {
    title: 'Learning Plans for Every Child',
    subtitle: 'Kids Ascension',
    tiers: [
      {
        id: '1',
        name: 'Explorer',
        description: 'Ages 4-7',
        price: 8,
        currency: '€',
        period: 'month',
        features: [
          { text: '50+ age-appropriate lessons', included: true },
          { text: 'Interactive games', included: true },
          { text: 'Progress tracking', included: true },
          { text: 'Parental controls', included: true },
          { text: 'Advanced courses', included: false },
          { text: 'Live tutoring', included: false },
        ],
        cta: 'Start Learning',
      },
      {
        id: '2',
        name: 'Scholar',
        description: 'Ages 8-12',
        price: 12,
        currency: '€',
        period: 'month',
        features: [
          { text: '200+ comprehensive lessons', included: true },
          { text: 'Interactive projects', included: true },
          { text: 'Detailed analytics', included: true },
          { text: 'Parental dashboard', included: true },
          { text: 'Advanced STEM courses', included: true },
          { text: 'Monthly group sessions', included: true },
        ],
        cta: 'Enroll Now',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Academy',
        description: 'Ages 13+',
        price: 18,
        currency: '€',
        period: 'month',
        features: [
          { text: 'All Scholar features', included: true, highlight: true },
          { text: 'University prep courses', included: true },
          { text: 'Career guidance', included: true },
          { text: 'Weekly live tutoring', included: true },
          { text: 'Certificate programs', included: true },
          { text: 'College application support', included: true },
        ],
        cta: 'Get Started',
      },
    ],
  },
};

/**
 * Ozean Licht spiritual courses pricing
 */
export const OzeanLicht: Story = {
  args: {
    title: 'Transform Your Consciousness',
    subtitle: 'Spiritual Growth Memberships',
    tiers: [
      {
        id: '1',
        name: 'Seeker',
        description: 'Begin your journey',
        price: 10,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Foundational courses', included: true },
          { text: 'Guided meditations', included: true },
          { text: 'Community forums', included: true },
          { text: 'Monthly workshops', included: true },
          { text: 'Advanced teachings', included: false },
          { text: 'Personal mentoring', included: false },
        ],
        cta: 'Begin Journey',
      },
      {
        id: '2',
        name: 'Practitioner',
        description: 'Deepen your practice',
        price: 25,
        currency: '€',
        period: 'month',
        features: [
          { text: 'All Seeker features', included: true },
          { text: 'Advanced courses', included: true },
          { text: 'Weekly live sessions', included: true },
          { text: 'Energy work training', included: true },
          { text: 'Retreat discounts', included: true },
          { text: 'Personal mentoring', included: false },
        ],
        cta: 'Level Up',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Master',
        description: 'Complete transformation',
        price: 50,
        currency: '€',
        period: 'month',
        features: [
          { text: 'All Practitioner features', included: true, highlight: true },
          { text: 'Teacher certification path', included: true },
          { text: 'Private mentoring sessions', included: true },
          { text: 'Exclusive master classes', included: true },
          { text: 'Free retreat attendance', included: true },
          { text: 'Lifetime community access', included: true },
        ],
        cta: 'Ascend Now',
      },
    ],
  },
};

/**
 * Highlighted featured tier (middle tier emphasized)
 */
export const FeaturedTier: Story = {
  args: {
    title: 'Most Choose Pro',
    subtitle: 'Recommended',
    tiers: [
      {
        name: 'Basic',
        price: 9,
        period: 'month',
        features: [
          { text: 'Essential features', included: true },
          { text: 'Email support', included: true },
          { text: 'Advanced tools', included: false },
        ],
        cta: 'Get Basic',
      },
      {
        name: 'Pro',
        description: 'Best value for most users',
        price: 19,
        period: 'month',
        features: [
          { text: 'All Basic features', included: true, highlight: true },
          { text: 'Priority support', included: true },
          { text: 'Advanced tools', included: true },
        ],
        cta: 'Get Pro',
        highlighted: true,
        popular: true,
      },
      {
        name: 'Enterprise',
        price: 49,
        period: 'month',
        features: [
          { text: 'All Pro features', included: true },
          { text: 'Dedicated support', included: true },
          { text: 'Custom integrations', included: true },
        ],
        cta: 'Contact Sales',
      },
    ],
  },
};

/**
 * Different currencies (USD example)
 */
export const USDPricing: Story = {
  args: {
    title: 'Global Pricing',
    subtitle: 'USD Rates',
    tiers: [
      {
        name: 'Basic',
        price: 10,
        currency: '$',
        period: 'month',
        features: [
          { text: 'Core features', included: true },
          { text: 'Community support', included: true },
        ],
        cta: 'Subscribe',
      },
      {
        name: 'Pro',
        price: 20,
        currency: '$',
        period: 'month',
        features: [
          { text: 'All features', included: true },
          { text: 'Priority support', included: true },
        ],
        cta: 'Subscribe',
        popular: true,
      },
      {
        name: 'Team',
        price: 50,
        currency: '$',
        period: 'month',
        features: [
          { text: 'Everything in Pro', included: true },
          { text: 'Team management', included: true },
        ],
        cta: 'Subscribe',
      },
    ],
  },
};

/**
 * Custom CTA text per tier
 */
export const CustomCTAs: Story = {
  args: {
    title: 'Flexible Options',
    subtitle: 'Your Choice',
    tiers: [
      {
        name: 'Free Trial',
        price: 0,
        period: '14 days',
        features: [
          { text: 'Full access trial', included: true },
          { text: 'No credit card required', included: true },
        ],
        cta: 'Start Free Trial',
      },
      {
        name: 'Monthly',
        price: 15,
        period: 'month',
        features: [
          { text: 'All features', included: true },
          { text: 'Cancel anytime', included: true },
        ],
        cta: 'Subscribe Now',
        popular: true,
      },
      {
        name: 'Lifetime',
        price: 299,
        period: 'one-time',
        features: [
          { text: 'All features forever', included: true },
          { text: 'Free updates', included: true },
        ],
        cta: 'Buy Lifetime Access',
      },
    ],
  },
};

/**
 * Feature highlights (emphasized features)
 */
export const FeatureHighlights: Story = {
  args: {
    title: 'Compare Features',
    subtitle: 'Find Your Perfect Fit',
    tiers: [
      {
        name: 'Starter',
        price: 10,
        period: 'month',
        features: [
          { text: 'Basic meditations', included: true },
          { text: 'Community access', included: true },
          { text: 'Live sessions', included: false },
          { text: 'Downloads', included: false },
          { text: 'Coaching', included: false },
        ],
        cta: 'Get Started',
      },
      {
        name: 'Growth',
        price: 20,
        period: 'month',
        features: [
          { text: 'All meditations', included: true },
          { text: 'Community access', included: true },
          { text: '4 live sessions/month', included: true, highlight: true },
          { text: 'Unlimited downloads', included: true, highlight: true },
          { text: 'Coaching', included: false },
        ],
        cta: 'Choose Growth',
        popular: true,
      },
      {
        name: 'Transformation',
        price: 40,
        period: 'month',
        features: [
          { text: 'Everything in Growth', included: true },
          { text: 'Premium community', included: true },
          { text: 'Unlimited live sessions', included: true, highlight: true },
          { text: 'Priority downloads', included: true },
          { text: 'Monthly 1-on-1 coaching', included: true, highlight: true },
        ],
        cta: 'Transform Now',
        highlighted: true,
      },
    ],
  },
};

/**
 * Minimal features (short feature lists)
 */
export const MinimalFeatures: Story = {
  args: {
    title: 'Simple & Clear',
    subtitle: 'No Hidden Fees',
    tiers: [
      {
        name: 'Personal',
        price: 12,
        period: 'month',
        features: [
          { text: 'Full content access', included: true },
          { text: '24/7 support', included: true },
        ],
        cta: 'Get Personal',
      },
      {
        name: 'Team',
        price: 35,
        period: 'month',
        features: [
          { text: 'Everything in Personal', included: true },
          { text: 'Team collaboration', included: true },
        ],
        cta: 'Get Team',
        popular: true,
      },
    ],
  },
};

/**
 * Extensive features (long feature lists)
 */
export const ExtensiveFeatures: Story = {
  args: {
    title: 'Comprehensive Plans',
    subtitle: 'Everything You Need',
    tiers: [
      {
        name: 'Complete',
        price: 29,
        period: 'month',
        features: [
          { text: 'Unlimited guided meditations', included: true },
          { text: 'All breathing exercises', included: true },
          { text: 'Full course library', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Weekly live sessions', included: true },
          { text: 'Unlimited downloads', included: true },
          { text: 'Mobile & desktop apps', included: true },
          { text: 'Progress tracking', included: true },
          { text: 'Email support', included: true },
          { text: 'Monthly challenges', included: true },
        ],
        cta: 'Get Everything',
        popular: true,
      },
    ],
  },
};

/**
 * Contact sales tier (enterprise)
 */
export const ContactSales: Story = {
  args: {
    title: 'Enterprise Solutions',
    subtitle: 'Custom Pricing',
    tiers: [
      {
        name: 'Pro',
        price: 25,
        period: 'month',
        features: [
          { text: 'All premium features', included: true },
          { text: 'Up to 10 users', included: true },
          { text: 'Priority support', included: true },
        ],
        cta: 'Get Pro',
      },
      {
        name: 'Enterprise',
        description: 'Custom solutions for large teams',
        price: 0,
        currency: '',
        period: 'custom',
        features: [
          { text: 'Everything in Pro', included: true },
          { text: 'Unlimited users', included: true },
          { text: 'Custom integrations', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'SLA guarantee', included: true },
          { text: 'Custom branding', included: true },
        ],
        cta: 'Contact Sales',
        highlighted: true,
      },
    ],
  },
};

/**
 * Single tier (one option only)
 */
export const SingleTier: Story = {
  args: {
    title: 'One Simple Plan',
    subtitle: 'All-Inclusive',
    tiers: [
      {
        name: 'All Access',
        description: 'Everything included',
        price: 19,
        period: 'month',
        features: [
          { text: 'Unlimited content access', included: true },
          { text: 'All courses & workshops', included: true },
          { text: 'Live sessions', included: true },
          { text: 'Community access', included: true },
          { text: 'Priority support', included: true },
          { text: 'Mobile apps', included: true },
        ],
        cta: 'Get Started',
        highlighted: true,
      },
    ],
  },
};

/**
 * Custom styling with extended padding
 */
export const CustomStyled: Story = {
  args: {
    title: 'Custom Layout',
    subtitle: 'Extended Spacing',
    tiers: [
      {
        name: 'Standard',
        price: 15,
        period: 'month',
        features: [
          { text: 'All features', included: true },
        ],
        cta: 'Subscribe',
      },
      {
        name: 'Premium',
        price: 30,
        period: 'month',
        features: [
          { text: 'Everything + extras', included: true },
        ],
        cta: 'Upgrade',
        popular: true,
      },
    ],
    className: 'py-20',
  },
};

/**
 * Cosmic dark theme showcase
 */
export const CosmicTheme: Story = {
  args: {
    title: 'Cosmic Pricing',
    subtitle: 'Choose Your Path',
    tiers: [
      {
        name: 'Novice',
        description: 'Start your cosmic journey',
        price: 12,
        period: 'month',
        features: [
          { text: 'Basic cosmic teachings', included: true },
          { text: 'Meditation library', included: true },
          { text: 'Community forums', included: true },
        ],
        cta: 'Begin',
      },
      {
        name: 'Adept',
        description: 'Deepen your practice',
        price: 24,
        period: 'month',
        features: [
          { text: 'Advanced cosmic wisdom', included: true },
          { text: 'Full meditation access', included: true },
          { text: 'Live sessions', included: true },
        ],
        cta: 'Ascend',
        highlighted: true,
        popular: true,
      },
      {
        name: 'Master',
        description: 'Achieve enlightenment',
        price: 48,
        period: 'month',
        features: [
          { text: 'All cosmic knowledge', included: true },
          { text: 'Personal guidance', included: true },
          { text: 'Exclusive teachings', included: true },
        ],
        cta: 'Transcend',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Glass morphism effect
 */
export const GlassMorphism: Story = {
  args: {
    title: 'Modern Design',
    subtitle: 'Glass Effect',
    tiers: [
      {
        name: 'Essential',
        price: 10,
        period: 'month',
        features: [
          { text: 'Core features', included: true },
          { text: 'Standard support', included: true },
        ],
        cta: 'Get Essential',
      },
      {
        name: 'Professional',
        price: 25,
        period: 'month',
        features: [
          { text: 'All features', included: true },
          { text: 'Priority support', included: true },
        ],
        cta: 'Go Pro',
        popular: true,
      },
      {
        name: 'Ultimate',
        price: 50,
        period: 'month',
        features: [
          { text: 'Everything', included: true },
          { text: 'White-glove support', included: true },
        ],
        cta: 'Get Ultimate',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628] p-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Turquoise accent (Ozean Licht branding)
 */
export const TurquoiseAccent: Story = {
  args: {
    title: 'Ozean Licht Memberships',
    subtitle: 'Signature Branding',
    tiers: [
      {
        name: 'Wave',
        description: 'Ride the gentle waves',
        price: 15,
        period: 'month',
        features: [
          { text: 'Foundational teachings', included: true },
          { text: 'Calm & clarity', included: true },
        ],
        cta: 'Ride Wave',
      },
      {
        name: 'Ocean',
        description: 'Dive into depths',
        price: 30,
        period: 'month',
        features: [
          { text: 'Deep teachings', included: true },
          { text: 'Transformation', included: true },
        ],
        cta: 'Dive Deep',
        highlighted: true,
        popular: true,
      },
      {
        name: 'Light',
        description: 'Illuminate your path',
        price: 60,
        period: 'month',
        features: [
          { text: 'Complete wisdom', included: true },
          { text: 'Full enlightenment', included: true },
        ],
        cta: 'Find Light',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/10 pointer-events-none" />
        <Story />
      </div>
    ),
  ],
};

/**
 * Light background variant
 */
export const LightBackground: Story = {
  args: {
    title: 'Clean Pricing',
    subtitle: 'Simple & Clear',
    tiers: [
      {
        name: 'Basic',
        price: 9,
        period: 'month',
        features: [
          { text: 'Essential tools', included: true },
        ],
        cta: 'Get Basic',
      },
      {
        name: 'Pro',
        price: 19,
        period: 'month',
        features: [
          { text: 'All tools', included: true },
        ],
        cta: 'Get Pro',
        popular: true,
      },
      {
        name: 'Team',
        price: 39,
        period: 'month',
        features: [
          { text: 'Unlimited access', included: true },
        ],
        cta: 'Get Team',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-white min-h-screen">
        <Story />
      </div>
    ),
  ],
};

/**
 * Responsive mobile view
 */
export const ResponsiveDemo: Story = {
  args: {
    title: 'Mobile Optimized',
    subtitle: 'Responsive Pricing',
    tiers: [
      {
        name: 'Mobile',
        price: 5,
        period: 'month',
        features: [
          { text: 'Mobile app access', included: true },
          { text: 'Offline mode', included: true },
        ],
        cta: 'Subscribe',
      },
      {
        name: 'Multi-Device',
        price: 10,
        period: 'month',
        features: [
          { text: 'All devices', included: true },
          { text: 'Cloud sync', included: true },
        ],
        cta: 'Subscribe',
        popular: true,
      },
      {
        name: 'Family',
        price: 20,
        period: 'month',
        features: [
          { text: 'Up to 5 devices', included: true },
          { text: 'Shared library', included: true },
        ],
        cta: 'Subscribe',
      },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Showcase all tier configurations
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-16 py-8 bg-[var(--background)]">
      <PricingSection
        title="Two Tiers"
        subtitle="Comparison Layout"
        tiers={[
          {
            name: 'Basic',
            price: 10,
            period: 'month',
            features: [
              { text: 'Core features', included: true },
              { text: 'Email support', included: true },
            ],
            cta: 'Get Basic',
          },
          {
            name: 'Pro',
            price: 20,
            period: 'month',
            features: [
              { text: 'All features', included: true },
              { text: 'Priority support', included: true },
            ],
            cta: 'Get Pro',
            popular: true,
          },
        ]}
      />

      <div className="border-t border-[var(--border)]" />

      <PricingSection
        title="Three Tiers"
        subtitle="Standard Layout"
        tiers={[
          {
            name: 'Basic',
            price: 10,
            period: 'month',
            features: [{ text: 'Basic features', included: true }],
            cta: 'Start',
          },
          {
            name: 'Pro',
            price: 20,
            period: 'month',
            features: [{ text: 'Pro features', included: true }],
            cta: 'Upgrade',
            popular: true,
          },
          {
            name: 'Enterprise',
            price: 50,
            period: 'month',
            features: [{ text: 'All features', included: true }],
            cta: 'Contact',
          },
        ]}
      />

      <div className="border-t border-[var(--border)]" />

      <PricingSection
        title="Four Tiers"
        subtitle="Extended Layout"
        tiers={[
          {
            name: 'Free',
            price: 0,
            period: 'forever',
            features: [{ text: 'Limited', included: true }],
            cta: 'Start Free',
          },
          {
            name: 'Basic',
            price: 10,
            period: 'month',
            features: [{ text: 'Standard', included: true }],
            cta: 'Subscribe',
          },
          {
            name: 'Pro',
            price: 20,
            period: 'month',
            features: [{ text: 'Advanced', included: true }],
            cta: 'Subscribe',
            popular: true,
          },
          {
            name: 'Team',
            price: 50,
            period: 'month',
            features: [{ text: 'Unlimited', included: true }],
            cta: 'Subscribe',
          },
        ]}
      />
    </div>
  ),
};

/**
 * Real-world example: SaaS pricing page
 */
export const SaaSPricingPage: Story = {
  args: {
    title: 'Pricing Plans',
    subtitle: 'Choose the Right Plan for Your Team',
    tiers: [
      {
        id: '1',
        name: 'Starter',
        description: 'Perfect for individuals',
        price: 12,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Up to 3 projects', included: true },
          { text: '5GB storage', included: true },
          { text: 'Basic analytics', included: true },
          { text: 'Email support', included: true },
          { text: 'Advanced features', included: false },
          { text: 'Priority support', included: false },
        ],
        cta: 'Get Started',
      },
      {
        id: '2',
        name: 'Business',
        description: 'For growing teams',
        price: 49,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Unlimited projects', included: true },
          { text: '100GB storage', included: true },
          { text: 'Advanced analytics', included: true },
          { text: 'Priority email support', included: true },
          { text: 'Advanced automation', included: true },
          { text: 'Team collaboration', included: true },
        ],
        cta: 'Start Free Trial',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 199,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Business', included: true, highlight: true },
          { text: 'Unlimited storage', included: true },
          { text: 'Custom integrations', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'SLA guarantee', included: true },
          { text: '24/7 phone support', included: true },
        ],
        cta: 'Contact Sales',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-b from-[#0a1628] to-[#0a0a0a] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

/**
 * Complete example with all features
 */
export const CompleteExample: Story = {
  args: {
    title: 'Unlock Your Spiritual Potential',
    subtitle: 'Membership Options',
    tiers: [
      {
        id: '1',
        name: 'Journey Starter',
        description: 'Perfect for beginners exploring meditation',
        price: 12,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Access to 100+ guided meditations', included: true },
          { text: 'Beginner courses & workshops', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Monthly live Q&A sessions', included: true },
          { text: 'Mobile app access', included: true },
          { text: 'Advanced courses', included: false },
          { text: 'Download for offline use', included: false },
          { text: 'Personal coaching', included: false },
        ],
        cta: 'Start Journey',
      },
      {
        id: '2',
        name: 'Spiritual Seeker',
        description: 'For dedicated practitioners deepening their practice',
        price: 25,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Journey Starter', included: true, highlight: true },
          { text: 'Access to all 500+ meditations', included: true },
          { text: 'All advanced courses', included: true },
          { text: 'Weekly live meditation sessions', included: true },
          { text: 'Unlimited offline downloads', included: true },
          { text: 'Exclusive community groups', included: true },
          { text: 'Priority email support', included: true },
          { text: 'Monthly 1-on-1 coaching', included: false },
        ],
        cta: 'Deepen Practice',
        highlighted: true,
        popular: true,
      },
      {
        id: '3',
        name: 'Enlightened Master',
        description: 'Complete transformation with personal guidance',
        price: 50,
        currency: '€',
        period: 'month',
        features: [
          { text: 'Everything in Spiritual Seeker', included: true, highlight: true },
          { text: 'Teacher certification programs', included: true },
          { text: 'Monthly 1-on-1 coaching sessions', included: true },
          { text: 'Exclusive master classes', included: true },
          { text: 'Private mentoring group', included: true },
          { text: 'Free retreat attendance', included: true },
          { text: 'Lifetime community access', included: true },
          { text: 'Commercial teaching license', included: true },
        ],
        cta: 'Achieve Mastery',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>
    ),
  ],
};
