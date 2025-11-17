import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';
import type { Feature } from '../types';
import { Sparkles, Zap, Shield, Heart, Star, Rocket, Eye, Compass, Moon, Sun } from 'lucide-react';

/**
 * FeatureCard displays feature highlights with optional icons and descriptions.
 * Ideal for showcasing product features, service offerings, and value propositions
 * in landing pages and marketing sections.
 *
 * ## Features
 * - Optional icon display with pulsing animation
 * - Flexible alignment (left or center)
 * - Glass morphism card with hover effects
 * - Turquoise accent colors (#0ec2bc)
 * - Clean typography with font-alt for headings
 * - Full height responsive layout
 * - Muted foreground text for descriptions
 * - Integrated with Card component
 *
 * ## Usage
 * ```tsx
 * import { FeatureCard } from '@ozean-licht/shared-ui/compositions'
 * import { Sparkles } from 'lucide-react'
 *
 * <FeatureCard
 *   feature={{
 *     title: 'Guided Meditation',
 *     description: 'Access hundreds of guided meditation sessions...',
 *     icon: <Sparkles className="w-6 h-6" />
 *   }}
 *   align="center"
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Feature card composition for displaying product features and value propositions. Features glass morphism design with optional icons and flexible alignment. Optimized for Ozean Licht branding with cosmic dark theme and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    feature: {
      description: 'Feature data object with title, description, and optional icon',
      control: 'object',
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
    align: {
      description: 'Content alignment (left or center)',
      control: 'radio',
      options: ['left', 'center'],
      table: {
        defaultValue: { summary: 'center' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample feature data for Ozean Licht and Kids Ascension

const guidedMeditationFeature: Feature = {
  id: '1',
  title: 'Guided Meditation',
  description:
    'Access hundreds of guided meditation sessions led by experienced teachers. From beginner-friendly practices to advanced techniques for deepening your spiritual journey.',
  icon: <Sparkles className="w-6 h-6" />,
};

const energyWorkFeature: Feature = {
  id: '2',
  title: 'Energy Healing',
  description:
    'Learn powerful energy healing techniques including chakra balancing, Reiki, and crystal therapy. Transform your life through the mastery of subtle energy.',
  icon: <Zap className="w-6 h-6" />,
};

const communityFeature: Feature = {
  id: '3',
  title: 'Community Support',
  description:
    'Join a vibrant community of spiritual seekers from around the world. Share experiences, ask questions, and grow together on your path to enlightenment.',
  icon: <Heart className="w-6 h-6" />,
};

const expertGuidanceFeature: Feature = {
  id: '4',
  title: 'Expert Guidance',
  description:
    'Learn from certified spiritual teachers and energy healers with decades of experience. Get personalized feedback and guidance on your spiritual development.',
  icon: <Star className="w-6 h-6" />,
};

const progressTrackingFeature: Feature = {
  id: '5',
  title: 'Progress Tracking',
  description:
    'Monitor your spiritual growth with detailed analytics and milestone tracking. Visualize your journey and celebrate your achievements along the way.',
  icon: <Rocket className="w-6 h-6" />,
};

const securePrivateFeature: Feature = {
  id: '6',
  title: 'Secure & Private',
  description:
    'Your spiritual journey is personal. We use bank-level encryption to protect your data and never share your information with third parties.',
  icon: <Shield className="w-6 h-6" />,
};

const intuitionFeature: Feature = {
  id: '7',
  title: 'Develop Intuition',
  description:
    'Strengthen your inner wisdom and intuitive abilities through specialized exercises and practices designed to activate your third eye.',
  icon: <Eye className="w-6 h-6" />,
};

const personalPathFeature: Feature = {
  id: '8',
  title: 'Personalized Path',
  description:
    'Receive custom learning recommendations based on your goals, experience level, and areas of interest. Your journey is unique to you.',
  icon: <Compass className="w-6 h-6" />,
};

const noIconFeature: Feature = {
  id: '9',
  title: 'Text-Only Feature',
  description:
    'Sometimes simplicity speaks volumes. This feature card demonstrates how content stands on its own without visual icons.',
};

const shortDescriptionFeature: Feature = {
  id: '10',
  title: 'Quick Start',
  description: 'Begin your journey in minutes with our simple onboarding process.',
  icon: <Rocket className="w-6 h-6" />,
};

const longTitleFeature: Feature = {
  id: '11',
  title: 'Comprehensive Spiritual Transformation Through Ancient Wisdom and Modern Practices',
  description:
    'Embark on a profound journey of self-discovery that integrates time-tested spiritual practices from various traditions around the world with cutting-edge insights from modern psychology and neuroscience. This holistic approach ensures that your transformation is both deeply rooted in ancient wisdom and aligned with contemporary understanding of human consciousness and personal development.',
  icon: <Moon className="w-6 h-6" />,
};

const minimalFeature: Feature = {
  id: '12',
  title: 'Essential',
  description: 'Core functionality.',
};

const kidsLearningFeature: Feature = {
  id: '13',
  title: 'Age-Appropriate Learning',
  description:
    'Educational content tailored to your child\'s developmental stage. From toddlers to teens, every lesson is designed to engage and inspire at the right level.',
  icon: <Sun className="w-6 h-6" />,
};

const kidsInteractiveFeature: Feature = {
  id: '14',
  title: 'Interactive Activities',
  description:
    'Keep children engaged with games, quizzes, and hands-on exercises. Learning becomes an adventure with our interactive approach to education.',
  icon: <Star className="w-6 h-6" />,
};

const kidsProgressFeature: Feature = {
  id: '15',
  title: 'Parent Dashboard',
  description:
    'Monitor your child\'s progress, achievements, and learning patterns. Stay connected to their educational journey with detailed insights and reports.',
  icon: <Eye className="w-6 h-6" />,
};

const kidsSafetyFeature: Feature = {
  id: '16',
  title: 'Child-Safe Environment',
  description:
    'A completely safe, ad-free learning space designed specifically for children. Parental controls and privacy protection are built in from the ground up.',
  icon: <Shield className="w-6 h-6" />,
};

/**
 * Default feature card with centered alignment and icon
 */
export const Default: Story = {
  args: {
    feature: guidedMeditationFeature,
    align: 'center',
  },
};

/**
 * Feature card with left alignment
 */
export const LeftAligned: Story = {
  args: {
    feature: guidedMeditationFeature,
    align: 'left',
  },
};

/**
 * Feature card without icon
 */
export const NoIcon: Story = {
  args: {
    feature: noIconFeature,
    align: 'center',
  },
};

/**
 * Feature card with short description
 */
export const ShortContent: Story = {
  args: {
    feature: shortDescriptionFeature,
    align: 'center',
  },
};

/**
 * Feature card with very long title and description
 */
export const LongContent: Story = {
  args: {
    feature: longTitleFeature,
    align: 'center',
  },
};

/**
 * Minimal feature card with minimal content
 */
export const Minimal: Story = {
  args: {
    feature: minimalFeature,
    align: 'center',
  },
};

/**
 * Energy work feature
 */
export const EnergyWork: Story = {
  args: {
    feature: energyWorkFeature,
    align: 'center',
  },
};

/**
 * Community support feature
 */
export const Community: Story = {
  args: {
    feature: communityFeature,
    align: 'center',
  },
};

/**
 * Expert guidance feature
 */
export const ExpertGuidance: Story = {
  args: {
    feature: expertGuidanceFeature,
    align: 'center',
  },
};

/**
 * Progress tracking feature
 */
export const ProgressTracking: Story = {
  args: {
    feature: progressTrackingFeature,
    align: 'center',
  },
};

/**
 * Security and privacy feature
 */
export const Security: Story = {
  args: {
    feature: securePrivateFeature,
    align: 'center',
  },
};

/**
 * Intuition development feature
 */
export const Intuition: Story = {
  args: {
    feature: intuitionFeature,
    align: 'center',
  },
};

/**
 * Personalized path feature
 */
export const PersonalizedPath: Story = {
  args: {
    feature: personalPathFeature,
    align: 'center',
  },
};

/**
 * Feature card with custom styling
 */
export const CustomStyling: Story = {
  args: {
    feature: guidedMeditationFeature,
    align: 'center',
    className: 'border-2 border-primary shadow-[0_0_25px_rgba(14,194,188,0.35)]',
  },
};

/**
 * Kids Ascension learning feature
 */
export const KidsLearning: Story = {
  args: {
    feature: kidsLearningFeature,
    align: 'center',
  },
};

/**
 * Kids Ascension interactive feature
 */
export const KidsInteractive: Story = {
  args: {
    feature: kidsInteractiveFeature,
    align: 'center',
  },
};

/**
 * Kids Ascension parent dashboard feature
 */
export const KidsProgress: Story = {
  args: {
    feature: kidsProgressFeature,
    align: 'center',
  },
};

/**
 * Kids Ascension safety feature
 */
export const KidsSafety: Story = {
  args: {
    feature: kidsSafetyFeature,
    align: 'center',
  },
};

/**
 * Three-column feature grid layout
 */
export const ThreeColumnGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl">
      <FeatureCard feature={guidedMeditationFeature} align="center" />
      <FeatureCard feature={energyWorkFeature} align="center" />
      <FeatureCard feature={communityFeature} align="center" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Standard three-column feature grid layout for landing pages.',
      },
    },
  },
};

/**
 * Four-column feature grid layout
 */
export const FourColumnGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <FeatureCard feature={guidedMeditationFeature} align="center" />
      <FeatureCard feature={energyWorkFeature} align="center" />
      <FeatureCard feature={communityFeature} align="center" />
      <FeatureCard feature={expertGuidanceFeature} align="center" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Four-column feature grid for comprehensive feature showcases.',
      },
    },
  },
};

/**
 * Two-column layout with left alignment
 */
export const TwoColumnLeftAligned: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl">
      <FeatureCard feature={guidedMeditationFeature} align="left" />
      <FeatureCard feature={energyWorkFeature} align="left" />
      <FeatureCard feature={communityFeature} align="left" />
      <FeatureCard feature={expertGuidanceFeature} align="left" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Two-column grid with left-aligned text for more traditional layouts.',
      },
    },
  },
};

/**
 * Mixed alignment showcase
 */
export const MixedAlignment: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Center Aligned</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Left Aligned</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="left" />
          <FeatureCard feature={energyWorkFeature} align="left" />
          <FeatureCard feature={communityFeature} align="left" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comparison of center-aligned vs left-aligned feature cards.',
      },
    },
  },
};

/**
 * Features with and without icons
 */
export const IconVariations: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">With Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Without Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={noIconFeature} align="center" />
          <FeatureCard feature={{ ...guidedMeditationFeature, icon: undefined }} align="center" />
          <FeatureCard feature={{ ...energyWorkFeature, icon: undefined }} align="center" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Showcase of feature cards with and without icons.',
      },
    },
  },
};

/**
 * All Ozean Licht features showcase
 */
export const OzeanLichtFeatures: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <FeatureCard feature={guidedMeditationFeature} align="center" />
      <FeatureCard feature={energyWorkFeature} align="center" />
      <FeatureCard feature={communityFeature} align="center" />
      <FeatureCard feature={expertGuidanceFeature} align="center" />
      <FeatureCard feature={progressTrackingFeature} align="center" />
      <FeatureCard feature={securePrivateFeature} align="center" />
      <FeatureCard feature={intuitionFeature} align="center" />
      <FeatureCard feature={personalPathFeature} align="center" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete feature set for Ozean Licht spiritual learning platform.',
      },
    },
  },
};

/**
 * Kids Ascension features showcase
 */
export const KidsAscensionFeatures: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <FeatureCard feature={kidsLearningFeature} align="center" />
      <FeatureCard feature={kidsInteractiveFeature} align="center" />
      <FeatureCard feature={kidsProgressFeature} align="center" />
      <FeatureCard feature={kidsSafetyFeature} align="center" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Feature set for Kids Ascension educational platform.',
      },
    },
  },
};

/**
 * Content length variations
 */
export const ContentVariations: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Standard Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Short Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard feature={shortDescriptionFeature} align="center" />
          <FeatureCard feature={minimalFeature} align="center" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Long Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard feature={longTitleFeature} align="center" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Feature cards with varying content lengths.',
      },
    },
  },
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Icons - Center Aligned</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
          <FeatureCard feature={expertGuidanceFeature} align="center" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Icons - Left Aligned</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard feature={guidedMeditationFeature} align="left" />
          <FeatureCard feature={energyWorkFeature} align="left" />
          <FeatureCard feature={communityFeature} align="left" />
          <FeatureCard feature={expertGuidanceFeature} align="left" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard feature={noIconFeature} align="center" />
          <FeatureCard feature={{ ...communityFeature, icon: undefined }} align="center" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Content Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard feature={shortDescriptionFeature} align="center" />
          <FeatureCard feature={minimalFeature} align="center" />
          <FeatureCard feature={longTitleFeature} align="center" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Kids Ascension Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard feature={kidsLearningFeature} align="center" />
          <FeatureCard feature={kidsInteractiveFeature} align="center" />
          <FeatureCard feature={kidsProgressFeature} align="center" />
          <FeatureCard feature={kidsSafetyFeature} align="center" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all feature card states and variations.',
      },
    },
  },
};

/**
 * Mobile view (narrow container)
 */
export const MobileView: Story = {
  args: {
    feature: guidedMeditationFeature,
    align: 'center',
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
        story: 'Feature card optimized for mobile viewports.',
      },
    },
  },
};

/**
 * Mobile stacked layout
 */
export const MobileStacked: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-[360px]">
      <FeatureCard feature={guidedMeditationFeature} align="center" />
      <FeatureCard feature={energyWorkFeature} align="center" />
      <FeatureCard feature={communityFeature} align="center" />
      <FeatureCard feature={expertGuidanceFeature} align="center" />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Stacked feature cards for mobile display.',
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
          <h1 className="text-4xl font-bold text-white mb-4">Ozean Licht Features</h1>
          <p className="text-[var(--muted-foreground)] text-lg">
            Transform your spiritual journey with powerful tools and guidance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
          <FeatureCard feature={expertGuidanceFeature} align="center" />
          <FeatureCard feature={progressTrackingFeature} align="center" />
          <FeatureCard feature={securePrivateFeature} align="center" />
          <FeatureCard feature={intuitionFeature} align="center" />
          <FeatureCard feature={personalPathFeature} align="center" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Feature cards displayed on cosmic dark background with Ozean Licht branding.',
      },
    },
  },
};

/**
 * Landing page hero section layout
 */
export const LandingPageHero: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your Spiritual Practice
          </h1>
          <p className="text-[var(--muted-foreground)] text-xl max-w-3xl mx-auto">
            Join thousands of seekers on their journey to enlightenment with our comprehensive
            platform for spiritual growth and personal transformation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard feature={guidedMeditationFeature} align="center" />
          <FeatureCard feature={energyWorkFeature} align="center" />
          <FeatureCard feature={communityFeature} align="center" />
          <FeatureCard feature={expertGuidanceFeature} align="center" />
          <FeatureCard feature={progressTrackingFeature} align="center" />
          <FeatureCard feature={securePrivateFeature} align="center" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete landing page hero section with feature cards.',
      },
    },
  },
};

/**
 * Alternate icons showcase
 */
export const AlternateIcons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl">
      <FeatureCard
        feature={{
          title: 'Quick Setup',
          description: 'Get started in minutes with our streamlined onboarding process.',
          icon: <Rocket className="w-6 h-6" />,
        }}
        align="center"
      />
      <FeatureCard
        feature={{
          title: 'Night Mode',
          description: 'Practice meditation at night with our special dark mode interface.',
          icon: <Moon className="w-6 h-6" />,
        }}
        align="center"
      />
      <FeatureCard
        feature={{
          title: 'Morning Rituals',
          description: 'Start your day right with energizing morning meditation routines.',
          icon: <Sun className="w-6 h-6" />,
        }}
        align="center"
      />
      <FeatureCard
        feature={{
          title: 'Visualization',
          description: 'Master the art of creative visualization for manifestation.',
          icon: <Eye className="w-6 h-6" />,
        }}
        align="center"
      />
      <FeatureCard
        feature={{
          title: 'Inner Compass',
          description: 'Navigate your spiritual journey with confidence and clarity.',
          icon: <Compass className="w-6 h-6" />,
        }}
        align="center"
      />
      <FeatureCard
        feature={{
          title: 'Premium Quality',
          description: 'Award-winning content from world-renowned spiritual teachers.',
          icon: <Star className="w-6 h-6" />,
        }}
        align="center"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Feature cards with various icon options from lucide-react.',
      },
    },
  },
};

/**
 * Hover effects demonstration
 */
export const HoverEffects: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Hover Over Cards</h2>
        <p className="text-[var(--muted-foreground)]">
          Move your cursor over the cards to see the hover effects in action
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard feature={guidedMeditationFeature} align="center" />
        <FeatureCard feature={energyWorkFeature} align="center" />
        <FeatureCard feature={communityFeature} align="center" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Demonstration of hover effects on feature cards. Hover to see scale and shadow transitions.',
      },
    },
  },
};
