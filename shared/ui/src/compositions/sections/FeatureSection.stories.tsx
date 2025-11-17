import type { Meta, StoryObj } from '@storybook/react';
import { FeatureSection } from './FeatureSection';

/**
 * FeatureSection is a composition for displaying multiple features in a responsive grid layout.
 * Perfect for showcasing product features, service benefits, or platform capabilities.
 *
 * ## Features
 * - Flexible grid layout (2, 3, or 4 columns)
 * - Optional section title and subtitle
 * - Responsive design with mobile-first approach
 * - Integration with FeatureCard components
 * - Support for custom icons and descriptions
 * - Automatic centering and spacing
 * - Glass morphism and cosmic theming via parent container
 *
 * ## Usage
 * ```tsx
 * <FeatureSection
 *   title="Platform Features"
 *   subtitle="Everything You Need"
 *   features={[
 *     { title: 'Fast', description: 'Lightning-fast performance', icon: <SpeedIcon /> },
 *     { title: 'Secure', description: 'Enterprise-grade security', icon: <LockIcon /> },
 *     { title: 'Scalable', description: 'Grows with your needs', icon: <ChartIcon /> }
 *   ]}
 *   columns={3}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Sections/FeatureSection',
  component: FeatureSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Feature section composition with responsive grid layout for showcasing product features, benefits, and capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main section heading',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle badge displayed above the title',
    },
    features: {
      control: 'object',
      description: 'Array of feature objects with title, description, and optional icon',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of columns in the grid (responsive)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
} satisfies Meta<typeof FeatureSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample icons for stories
const SparkleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const LightningIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
  </svg>
);

const ShieldIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const RocketIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
  </svg>
);

const HeartIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

const UsersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
  </svg>
);

const ChartIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
  </svg>
);

const ClockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

/**
 * Default feature section with 3 columns
 */
export const Default: Story = {
  args: {
    title: 'Platform Features',
    subtitle: 'Why Choose Us',
    features: [
      {
        title: 'Lightning Fast',
        description: 'Optimized performance for instant load times and smooth interactions.',
        icon: LightningIcon,
      },
      {
        title: 'Secure by Default',
        description: 'Enterprise-grade security built into every layer of the platform.',
        icon: ShieldIcon,
      },
      {
        title: 'Scales with You',
        description: 'From startup to enterprise, our platform grows alongside your business.',
        icon: RocketIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section with 2 columns
 */
export const TwoColumns: Story = {
  args: {
    title: 'Core Benefits',
    subtitle: 'What You Get',
    features: [
      {
        title: 'Community Driven',
        description: 'Join a thriving community of practitioners and teachers supporting each other on the path to enlightenment.',
        icon: UsersIcon,
      },
      {
        title: 'Expert Guidance',
        description: 'Learn from certified instructors with decades of experience in meditation and spiritual practices.',
        icon: HeartIcon,
      },
    ],
    columns: 2,
  },
};

/**
 * Feature section with 4 columns
 */
export const FourColumns: Story = {
  args: {
    title: 'Complete Solution',
    subtitle: 'All-in-One Platform',
    features: [
      {
        title: 'Fast Performance',
        description: 'Optimized for speed and efficiency.',
        icon: LightningIcon,
      },
      {
        title: 'Secure Platform',
        description: 'Your data is always protected.',
        icon: ShieldIcon,
      },
      {
        title: 'Easy to Use',
        description: 'Intuitive interface for everyone.',
        icon: SparkleIcon,
      },
      {
        title: 'Great Support',
        description: '24/7 customer support available.',
        icon: HeartIcon,
      },
    ],
    columns: 4,
  },
};

/**
 * Feature section without title or subtitle
 */
export const NoHeader: Story = {
  args: {
    features: [
      {
        title: 'Meditation Library',
        description: 'Access hundreds of guided meditations for every level and intention.',
        icon: SparkleIcon,
      },
      {
        title: 'Live Sessions',
        description: 'Join daily live meditation sessions with experienced teachers.',
        icon: ClockIcon,
      },
      {
        title: 'Progress Tracking',
        description: 'Track your practice journey with detailed insights and statistics.',
        icon: ChartIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section without icons
 */
export const NoIcons: Story = {
  args: {
    title: 'Text-Only Features',
    subtitle: 'Simple & Clean',
    features: [
      {
        title: 'Unlimited Access',
        description: 'Get full access to all courses, workshops, and community resources with a single membership.',
      },
      {
        title: 'Download Content',
        description: 'Download meditations and courses for offline access, perfect for travel or retreats.',
      },
      {
        title: 'Certificate Programs',
        description: 'Complete certification programs to become a qualified instructor and share your knowledge.',
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section with many features (6 items)
 */
export const ManyFeatures: Story = {
  args: {
    title: 'Everything Included',
    subtitle: 'Comprehensive Platform',
    features: [
      {
        title: 'Guided Meditations',
        description: 'Hundreds of guided sessions for all levels.',
        icon: SparkleIcon,
      },
      {
        title: 'Live Classes',
        description: 'Daily live sessions with expert teachers.',
        icon: ClockIcon,
      },
      {
        title: 'Community Forum',
        description: 'Connect with fellow practitioners worldwide.',
        icon: UsersIcon,
      },
      {
        title: 'Progress Tracking',
        description: 'Monitor your meditation journey and milestones.',
        icon: ChartIcon,
      },
      {
        title: 'Personalized Plans',
        description: 'Custom meditation plans based on your goals.',
        icon: HeartIcon,
      },
      {
        title: 'Expert Support',
        description: 'Get guidance from certified instructors.',
        icon: ShieldIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section with few features (2 items, 3 columns)
 */
export const FewFeatures: Story = {
  args: {
    title: 'Key Highlights',
    subtitle: 'What Makes Us Different',
    features: [
      {
        title: 'Austrian Roots',
        description: 'Based in Vienna, we bring European mindfulness traditions to the digital age.',
        icon: SparkleIcon,
      },
      {
        title: 'Holistic Approach',
        description: 'Integrating meditation, yoga, energy work, and spiritual teachings.',
        icon: HeartIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Kids Ascension educational features
 */
export const KidsAscension: Story = {
  args: {
    title: 'Educational Excellence',
    subtitle: 'Kids Ascension Platform',
    features: [
      {
        title: 'Interactive Learning',
        description: 'Engaging lessons designed to make learning fun and effective for young minds.',
        icon: SparkleIcon,
      },
      {
        title: 'Safe Environment',
        description: 'Child-friendly platform with age-appropriate content and parental controls.',
        icon: ShieldIcon,
      },
      {
        title: 'Progress Reports',
        description: 'Detailed analytics help parents track their child\'s learning journey.',
        icon: ChartIcon,
      },
      {
        title: 'Expert Educators',
        description: 'Content created by certified teachers with years of experience.',
        icon: UsersIcon,
      },
    ],
    columns: 4,
  },
};

/**
 * Ozean Licht spiritual features
 */
export const OzeanLicht: Story = {
  args: {
    title: 'Spiritual Transformation',
    subtitle: 'Ozean Licht Experience',
    features: [
      {
        title: 'Ancient Wisdom',
        description: 'Access timeless teachings from various spiritual traditions, adapted for modern seekers.',
        icon: SparkleIcon,
      },
      {
        title: 'Modern Techniques',
        description: 'Evidence-based practices combining traditional wisdom with contemporary science.',
        icon: LightningIcon,
      },
      {
        title: 'Personal Growth',
        description: 'Structured programs designed to support your unique journey of self-discovery.',
        icon: RocketIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section with long descriptions
 */
export const LongDescriptions: Story = {
  args: {
    title: 'In-Depth Features',
    subtitle: 'Detailed Overview',
    features: [
      {
        title: 'Comprehensive Course Library',
        description: 'Our extensive library includes over 500 courses covering meditation, mindfulness, yoga, energy work, and spiritual development. Each course is carefully crafted by expert instructors with decades of experience and designed to provide transformative learning experiences at your own pace.',
        icon: SparkleIcon,
      },
      {
        title: 'Global Community Network',
        description: 'Connect with over 10,000 active members from around the world who share your passion for spiritual growth and personal development. Participate in forums, join study groups, attend virtual meetups, and build lasting friendships with like-minded individuals on the same journey.',
        icon: UsersIcon,
      },
      {
        title: 'Professional Certification',
        description: 'Our internationally recognized certification programs prepare you to become a qualified instructor in meditation, mindfulness, and related practices. Gain the knowledge, skills, and confidence needed to guide others on their spiritual journey while building a meaningful career.',
        icon: ShieldIcon,
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section with cosmic theme
 */
export const CosmicTheme: Story = {
  args: {
    title: 'Cosmic Features',
    subtitle: 'Powered by the Universe',
    features: [
      {
        title: 'Celestial Energy',
        description: 'Harness the power of cosmic energy through guided practices.',
        icon: SparkleIcon,
      },
      {
        title: 'Astral Projection',
        description: 'Learn techniques for exploring consciousness beyond the physical.',
        icon: RocketIcon,
      },
      {
        title: 'Universal Wisdom',
        description: 'Access ancient knowledge passed down through generations.',
        icon: HeartIcon,
      },
    ],
    columns: 3,
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
 * Feature section with glass morphism background
 */
export const GlassMorphism: Story = {
  args: {
    title: 'Modern Design',
    subtitle: 'Glass Effect',
    features: [
      {
        title: 'Beautiful UI',
        description: 'Stunning glass morphism effects throughout the interface.',
        icon: SparkleIcon,
      },
      {
        title: 'Smooth Animations',
        description: 'Delightful micro-interactions enhance the user experience.',
        icon: LightningIcon,
      },
      {
        title: 'Responsive Design',
        description: 'Perfect experience on desktop, tablet, and mobile devices.',
        icon: RocketIcon,
      },
    ],
    columns: 3,
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
 * Feature section with turquoise accent
 */
export const TurquoiseAccent: Story = {
  args: {
    title: 'Ozean Licht Features',
    subtitle: 'Signature Branding',
    features: [
      {
        title: 'Turquoise Theme',
        description: 'Our signature turquoise color represents clarity and spiritual awakening.',
        icon: SparkleIcon,
      },
      {
        title: 'Oceanic Energy',
        description: 'Like the ocean, our platform flows with calming, transformative energy.',
        icon: HeartIcon,
      },
      {
        title: 'Light & Wisdom',
        description: 'Illuminating your path with knowledge, guidance, and support.',
        icon: LightningIcon,
      },
    ],
    columns: 3,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Feature section with custom spacing
 */
export const CustomSpacing: Story = {
  args: {
    title: 'Spacious Layout',
    subtitle: 'Extended Padding',
    features: [
      {
        title: 'Breathing Room',
        description: 'Generous spacing creates a calm, uncluttered experience.',
        icon: SparkleIcon,
      },
      {
        title: 'Visual Hierarchy',
        description: 'Clear structure helps users focus on what matters most.',
        icon: ChartIcon,
      },
      {
        title: 'Reduced Cognitive Load',
        description: 'Less visual noise means better comprehension and retention.',
        icon: HeartIcon,
      },
    ],
    columns: 3,
    className: 'py-24',
  },
};

/**
 * Feature section for pricing comparison
 */
export const PricingFeatures: Story = {
  args: {
    title: 'What You Get',
    subtitle: 'Premium Membership',
    features: [
      {
        title: 'Unlimited Access',
        description: 'Full access to all courses, meditations, and workshops.',
      },
      {
        title: 'Ad-Free Experience',
        description: 'Enjoy uninterrupted practice without any advertisements.',
      },
      {
        title: 'Priority Support',
        description: 'Get fast responses from our dedicated support team.',
      },
      {
        title: 'Exclusive Content',
        description: 'Access members-only courses and advanced teachings.',
      },
      {
        title: 'Offline Downloads',
        description: 'Download content for practice anywhere, anytime.',
      },
      {
        title: 'Community Access',
        description: 'Join private forums and connect with fellow members.',
      },
    ],
    columns: 3,
  },
};

/**
 * Feature section mobile preview
 */
export const MobileView: Story = {
  args: {
    title: 'Mobile Optimized',
    subtitle: 'Practice Anywhere',
    features: [
      {
        title: 'Touch Friendly',
        description: 'Designed for seamless touch interactions on mobile devices.',
        icon: SparkleIcon,
      },
      {
        title: 'Offline Mode',
        description: 'Continue your practice even without internet connection.',
        icon: ShieldIcon,
      },
      {
        title: 'Battery Optimized',
        description: 'Efficient design ensures long battery life during sessions.',
        icon: LightningIcon,
      },
    ],
    columns: 3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Showcase all column variants
 */
export const AllColumnVariants: Story = {
  args: {
    features: [], // Overridden by render function
  },
  render: () => (
    <div className="space-y-16 py-8 bg-[var(--background)]">
      <FeatureSection
        title="2 Column Layout"
        subtitle="Wide Format"
        features={[
          {
            title: 'Feature One',
            description: 'Description for the first feature in two-column layout.',
            icon: SparkleIcon,
          },
          {
            title: 'Feature Two',
            description: 'Description for the second feature in two-column layout.',
            icon: LightningIcon,
          },
        ]}
        columns={2}
      />

      <div className="border-t border-[var(--border)] my-8" />

      <FeatureSection
        title="3 Column Layout"
        subtitle="Standard Format"
        features={[
          {
            title: 'Feature One',
            description: 'Description for the first feature in three-column layout.',
            icon: SparkleIcon,
          },
          {
            title: 'Feature Two',
            description: 'Description for the second feature in three-column layout.',
            icon: LightningIcon,
          },
          {
            title: 'Feature Three',
            description: 'Description for the third feature in three-column layout.',
            icon: ShieldIcon,
          },
        ]}
        columns={3}
      />

      <div className="border-t border-[var(--border)] my-8" />

      <FeatureSection
        title="4 Column Layout"
        subtitle="Compact Format"
        features={[
          {
            title: 'Feature One',
            description: 'First feature description.',
            icon: SparkleIcon,
          },
          {
            title: 'Feature Two',
            description: 'Second feature description.',
            icon: LightningIcon,
          },
          {
            title: 'Feature Three',
            description: 'Third feature description.',
            icon: ShieldIcon,
          },
          {
            title: 'Feature Four',
            description: 'Fourth feature description.',
            icon: RocketIcon,
          },
        ]}
        columns={4}
      />
    </div>
  ),
};

/**
 * Complete example with all options
 */
export const CompleteExample: Story = {
  args: {
    title: 'Transform Your Life with Ozean Licht',
    subtitle: 'Everything You Need to Grow',
    features: [
      {
        title: 'Guided Meditation',
        description: 'Access a comprehensive library of guided meditations for every skill level, intention, and time commitment.',
        icon: SparkleIcon,
      },
      {
        title: 'Live Sessions',
        description: 'Join daily live meditation and teaching sessions with experienced instructors from around the world.',
        icon: ClockIcon,
      },
      {
        title: 'Community Support',
        description: 'Connect with thousands of practitioners on the same journey through forums, groups, and events.',
        icon: UsersIcon,
      },
      {
        title: 'Personal Growth',
        description: 'Track your progress with detailed analytics and insights into your meditation practice and development.',
        icon: ChartIcon,
      },
      {
        title: 'Expert Guidance',
        description: 'Learn from certified teachers with decades of experience in various spiritual traditions and practices.',
        icon: HeartIcon,
      },
      {
        title: 'Secure Platform',
        description: 'Your data and privacy are protected with enterprise-grade security and encryption standards.',
        icon: ShieldIcon,
      },
    ],
    columns: 3,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>
    ),
  ],
};
