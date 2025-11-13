import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from './PricingCard';
import type { PricingTier } from '../types';

/**
 * PricingCard displays pricing tiers with features, pricing, and call-to-action buttons.
 * Ideal for SaaS pricing pages, subscription offerings, and product tiering.
 *
 * ## Features
 * - Multiple tier variants (basic, pro, enterprise)
 * - Popular badge for recommended plans
 * - Highlighted tier with glow effect
 * - Feature list with included/excluded indicators
 * - Flexible pricing display (price, currency, period)
 * - Glass morphism card with hover effects
 * - Turquoise accent colors (#0ec2bc)
 * - Customizable CTA button
 * - Responsive layout
 *
 * ## Usage
 * ```tsx
 * import { PricingCard } from '@ozean-licht/shared-ui/compositions'
 *
 * <PricingCard
 *   tier={{
 *     name: 'Professional',
 *     description: 'For growing teams',
 *     price: 29,
 *     currency: '€',
 *     period: 'month',
 *     popular: true,
 *     highlighted: true,
 *     features: [
 *       { text: 'All courses', included: true },
 *       { text: 'Priority support', included: true, highlight: true },
 *       { text: '1-on-1 coaching', included: false }
 *     ],
 *     cta: 'Start Free Trial'
 *   }}
 *   onCTAClick={() => console.log('CTA clicked')}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pricing card composition for displaying subscription tiers and product pricing. Features glass morphism design, popular badges, and feature comparison lists. Optimized for Ozean Licht branding with cosmic dark theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tier: {
      description: 'Pricing tier data object with name, price, features, and CTA configuration',
      control: 'object',
    },
    onCTAClick: {
      description: 'Callback function triggered when the CTA button is clicked',
      action: 'cta-clicked',
    },
    className: {
      description: 'Additional CSS classes for custom styling',
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample pricing tiers for Ozean Licht and Kids Ascension

const basicTier: PricingTier = {
  id: '1',
  name: 'Basic',
  description: 'Perfect for getting started',
  price: 9,
  currency: '€',
  period: 'month',
  cta: 'Get Started',
  highlighted: false,
  popular: false,
  features: [
    { text: 'Access to 10 courses', included: true },
    { text: 'Community forum access', included: true },
    { text: 'Basic meditation guides', included: true },
    { text: 'Email support', included: true },
    { text: 'Monthly live sessions', included: false },
    { text: 'Priority support', included: false },
    { text: '1-on-1 coaching', included: false },
    { text: 'Advanced workshops', included: false },
  ],
};

const proTier: PricingTier = {
  id: '2',
  name: 'Professional',
  description: 'Most popular for committed learners',
  price: 29,
  currency: '€',
  period: 'month',
  cta: 'Start Free Trial',
  highlighted: true,
  popular: true,
  features: [
    { text: 'Access to all courses', included: true },
    { text: 'Community forum access', included: true },
    { text: 'All meditation guides', included: true },
    { text: 'Priority email support', included: true, highlight: true },
    { text: 'Weekly live sessions', included: true, highlight: true },
    { text: 'Downloadable resources', included: true },
    { text: 'Advanced workshops', included: true },
    { text: '1-on-1 coaching', included: false },
    { text: 'Custom learning path', included: false },
  ],
};

const enterpriseTier: PricingTier = {
  id: '3',
  name: 'Enterprise',
  description: 'For organizations and schools',
  price: 99,
  currency: '€',
  period: 'month',
  cta: 'Contact Sales',
  highlighted: false,
  popular: false,
  features: [
    { text: 'Everything in Professional', included: true },
    { text: 'Unlimited team members', included: true, highlight: true },
    { text: 'Dedicated account manager', included: true, highlight: true },
    { text: 'Custom branding', included: true },
    { text: 'Advanced analytics', included: true },
    { text: 'SSO integration', included: true },
    { text: 'API access', included: true },
    { text: 'Priority phone support', included: true },
    { text: 'Quarterly training sessions', included: true },
    { text: 'Custom development', included: true },
  ],
};

const lifetimeTier: PricingTier = {
  id: '4',
  name: 'Lifetime',
  description: 'One-time payment, lifetime access',
  price: 499,
  currency: '€',
  cta: 'Get Lifetime Access',
  highlighted: true,
  popular: false,
  features: [
    { text: 'Lifetime access to all courses', included: true, highlight: true },
    { text: 'All future courses included', included: true, highlight: true },
    { text: 'Priority support forever', included: true },
    { text: 'Early access to new features', included: true },
    { text: 'Exclusive lifetime community', included: true },
    { text: 'Annual 1-on-1 coaching session', included: true },
  ],
};

const freeTier: PricingTier = {
  id: '5',
  name: 'Free',
  description: 'Try before you commit',
  price: 0,
  currency: '€',
  period: 'forever',
  cta: 'Start Free',
  highlighted: false,
  popular: false,
  features: [
    { text: 'Access to 3 intro courses', included: true },
    { text: 'Community forum (read-only)', included: true },
    { text: 'Basic meditation guide', included: true },
    { text: 'Email support', included: false },
    { text: 'Live sessions', included: false },
    { text: 'Downloadable resources', included: false },
    { text: 'Advanced content', included: false },
  ],
};

const studentTier: PricingTier = {
  id: '6',
  name: 'Student',
  description: '50% off with valid student ID',
  price: 14.5,
  currency: '€',
  period: 'month',
  cta: 'Verify Student Status',
  highlighted: false,
  popular: false,
  features: [
    { text: 'All Professional features', included: true },
    { text: '50% discount', included: true, highlight: true },
    { text: 'Student community access', included: true },
    { text: 'Career development resources', included: true },
    { text: 'Valid for 4 years', included: true },
    { text: 'Verification required', included: true },
  ],
};

const annualProTier: PricingTier = {
  id: '7',
  name: 'Professional',
  description: 'Save 20% with annual billing',
  price: 279,
  currency: '€',
  period: 'year',
  cta: 'Save 20%',
  highlighted: true,
  popular: true,
  features: [
    { text: 'All Professional features', included: true },
    { text: '2 months free (€69 savings)', included: true, highlight: true },
    { text: 'Annual payment discount', included: true },
    { text: 'Billed once per year', included: true },
  ],
};

const customTier: PricingTier = {
  id: '8',
  name: 'Custom',
  description: 'Tailored to your needs',
  price: 0,
  cta: 'Contact Us',
  highlighted: false,
  popular: false,
  features: [
    { text: 'Custom course curation', included: true },
    { text: 'Flexible pricing model', included: true },
    { text: 'White-label solution', included: true },
    { text: 'Dedicated infrastructure', included: true },
    { text: 'Custom integrations', included: true },
    { text: 'SLA guarantee', included: true },
  ],
};

const kidsBasicTier: PricingTier = {
  id: '9',
  name: 'Kids Basic',
  description: 'For families with 1-2 children',
  price: 12,
  currency: '€',
  period: 'month',
  cta: 'Start Learning',
  highlighted: false,
  popular: false,
  features: [
    { text: 'Up to 2 child profiles', included: true },
    { text: 'Age-appropriate content', included: true },
    { text: 'Interactive exercises', included: true },
    { text: 'Progress tracking', included: true },
    { text: 'Parent dashboard', included: true },
    { text: 'Family workshops', included: false },
    { text: 'Advanced activities', included: false },
  ],
};

const kidsFamilyTier: PricingTier = {
  id: '10',
  name: 'Kids Family',
  description: 'Perfect for growing families',
  price: 24,
  currency: '€',
  period: 'month',
  cta: 'Start Free Trial',
  highlighted: true,
  popular: true,
  features: [
    { text: 'Up to 5 child profiles', included: true, highlight: true },
    { text: 'All age groups (3-16)', included: true },
    { text: 'Interactive exercises', included: true },
    { text: 'Advanced progress tracking', included: true },
    { text: 'Parent dashboard', included: true },
    { text: 'Monthly family workshops', included: true, highlight: true },
    { text: 'Printable activities', included: true },
    { text: 'Priority support', included: true },
  ],
};

/**
 * Default pricing card with basic tier
 */
export const Default: Story = {
  args: {
    tier: basicTier,
  },
};

/**
 * Professional tier marked as popular with highlighted styling
 */
export const Popular: Story = {
  args: {
    tier: proTier,
  },
};

/**
 * Enterprise tier with extensive feature list
 */
export const Enterprise: Story = {
  args: {
    tier: enterpriseTier,
  },
};

/**
 * Free tier showing zero price
 */
export const Free: Story = {
  args: {
    tier: freeTier,
  },
};

/**
 * Lifetime tier with one-time payment (no period)
 */
export const Lifetime: Story = {
  args: {
    tier: lifetimeTier,
  },
};

/**
 * Student tier with discount
 */
export const Student: Story = {
  args: {
    tier: studentTier,
  },
};

/**
 * Annual billing tier showing yearly price
 */
export const AnnualBilling: Story = {
  args: {
    tier: annualProTier,
  },
};

/**
 * Custom tier with "Contact Us" pricing
 */
export const Custom: Story = {
  args: {
    tier: customTier,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom pricing tier for enterprise clients requiring tailored solutions.',
      },
    },
  },
};

/**
 * Kids Ascension basic tier for families
 */
export const KidsBasic: Story = {
  args: {
    tier: kidsBasicTier,
  },
};

/**
 * Kids Ascension family tier (popular)
 */
export const KidsFamily: Story = {
  args: {
    tier: kidsFamilyTier,
  },
};

/**
 * Tier with custom styling
 */
export const CustomStyling: Story = {
  args: {
    tier: proTier,
    className: 'shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing card with custom className for enhanced visual effects.',
      },
    },
  },
};

/**
 * Tier with CTA click handler
 */
export const WithClickHandler: Story = {
  args: {
    tier: proTier,
    onCTAClick: () => {
      alert('Starting Professional trial!');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing card with onClick handler for the CTA button. Click the button to see the alert.',
      },
    },
  },
};

/**
 * Minimal tier with few features
 */
export const Minimal: Story = {
  args: {
    tier: {
      name: 'Starter',
      price: 5,
      currency: '€',
      period: 'month',
      features: [
        { text: 'Basic access', included: true },
        { text: 'Community forum', included: true },
        { text: 'Premium content', included: false },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal pricing tier with just essential information.',
      },
    },
  },
};

/**
 * Tier with very long feature list
 */
export const ExtensiveFeatures: Story = {
  args: {
    tier: {
      name: 'Ultimate',
      description: 'Everything you need and more',
      price: 149,
      currency: '€',
      period: 'month',
      popular: true,
      highlighted: true,
      features: [
        { text: 'Unlimited course access', included: true },
        { text: 'All meditation guides', included: true },
        { text: 'Live sessions (weekly)', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Priority phone support', included: true },
        { text: '1-on-1 coaching (monthly)', included: true, highlight: true },
        { text: 'Custom learning path', included: true, highlight: true },
        { text: 'Advanced workshops', included: true },
        { text: 'Downloadable resources', included: true },
        { text: 'Exclusive community access', included: true },
        { text: 'Early feature access', included: true },
        { text: 'API access', included: true },
        { text: 'White-label options', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Quarterly business reviews', included: true },
        { text: 'Custom reporting', included: true },
        { text: 'SSO integration', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Lifetime access guarantee', included: true },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing tier with extensive feature list demonstrating scrollable content.',
      },
    },
  },
};

/**
 * Different currency (USD)
 */
export const USDCurrency: Story = {
  args: {
    tier: {
      ...proTier,
      price: 32,
      currency: '$',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing tier with USD currency symbol.',
      },
    },
  },
};

/**
 * Three-tier comparison layout
 */
export const ThreeTierComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl">
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Standard three-tier pricing comparison layout (Basic, Pro, Enterprise).',
      },
    },
  },
};

/**
 * Four-tier comparison including free tier
 */
export const FourTierComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <PricingCard tier={freeTier} />
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Four-tier pricing comparison including free tier.',
      },
    },
  },
};

/**
 * Monthly vs Annual billing comparison
 */
export const MonthlyVsAnnual: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-5xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Monthly Billing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Annual Billing (Save 20%)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard
            tier={{
              ...basicTier,
              price: 86,
              period: 'year',
              description: 'Save €22/year',
            }}
          />
          <PricingCard tier={annualProTier} />
          <PricingCard
            tier={{
              ...enterpriseTier,
              price: 950,
              period: 'year',
              description: 'Save €238/year',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comparison between monthly and annual billing options showing savings.',
      },
    },
  },
};

/**
 * Kids Ascension family tiers
 */
export const KidsAscensionTiers: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl">
      <PricingCard tier={kidsBasicTier} />
      <PricingCard tier={kidsFamilyTier} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Kids Ascension pricing tiers for educational platform.',
      },
    },
  },
};

/**
 * All pricing variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Ozean Licht - Spiritual Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard tier={freeTier} />
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard tier={studentTier} />
          <PricingCard tier={lifetimeTier} />
          <PricingCard tier={customTier} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Kids Ascension - Family Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingCard tier={kidsBasicTier} />
          <PricingCard tier={kidsFamilyTier} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all pricing variants for both Ozean Licht and Kids Ascension.',
      },
    },
  },
};

/**
 * Cosmic dark theme showcase
 */
export const CosmicTheme: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-[var(--muted-foreground)] text-lg">
            Start your spiritual journey with Ozean Licht
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Pricing cards displayed on cosmic dark background with Ozean Licht branding.',
      },
    },
  },
};

/**
 * Mobile view (narrow container)
 */
export const MobileView: Story = {
  args: {
    tier: proTier,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[320px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Pricing card optimized for mobile viewports.',
      },
    },
  },
};

/**
 * Stacked layout for mobile comparison
 */
export const MobileComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-[360px]">
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Stacked pricing cards for mobile comparison view.',
      },
    },
  },
};

/**
 * Interactive demo with all states
 */
export const InteractiveDemo: Story = {
  render: () => {
    const handleClick = (tierName: string) => {
      alert(`Selected: ${tierName}`);
    };

    return (
      <div className="space-y-8 p-6 max-w-7xl">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Standard Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard tier={basicTier} onCTAClick={() => handleClick('Basic')} />
            <PricingCard tier={proTier} onCTAClick={() => handleClick('Professional')} />
            <PricingCard tier={enterpriseTier} onCTAClick={() => handleClick('Enterprise')} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Special Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard tier={freeTier} onCTAClick={() => handleClick('Free')} />
            <PricingCard tier={studentTier} onCTAClick={() => handleClick('Student')} />
            <PricingCard tier={lifetimeTier} onCTAClick={() => handleClick('Lifetime')} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Interactive pricing cards with click handlers. Click any CTA button to see the selection.',
      },
    },
  },
};
