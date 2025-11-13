import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';

/**
 * HeroSection is a landing page hero composition with headline, subtitle, description, and CTAs.
 * Features Ozean Licht branding with cosmic dark theme and turquoise accents.
 *
 * ## Features
 * - Large headline with responsive typography (text-4xl to text-6xl)
 * - Optional badge subtitle for categorization
 * - Supporting description text
 * - Primary and secondary CTA buttons
 * - Optional background image with overlay
 * - Responsive layout with mobile-first design
 * - Glass morphism and cosmic theming support via parent container
 *
 * ## Usage
 * ```tsx
 * <HeroSection
 *   title="Transform Your Consciousness"
 *   subtitle="New Course"
 *   description="Discover ancient wisdom and modern techniques for spiritual growth."
 *   ctaText="Start Journey"
 *   secondaryCTAText="Learn More"
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section composition for landing pages with responsive layout, CTAs, and optional background imagery.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main headline text (required)',
    },
    subtitle: {
      control: 'text',
      description: 'Badge subtitle shown above title',
    },
    description: {
      control: 'text',
      description: 'Supporting description text below title',
    },
    ctaText: {
      control: 'text',
      description: 'Primary CTA button text',
    },
    ctaHref: {
      control: 'text',
      description: 'Primary CTA link href (alternative to onClick)',
    },
    secondaryCTAText: {
      control: 'text',
      description: 'Secondary CTA button text',
    },
    secondaryCTAHref: {
      control: 'text',
      description: 'Secondary CTA link href (alternative to onClick)',
    },
    backgroundImage: {
      control: 'text',
      description: 'URL for background image (rendered with opacity)',
    },
    onCTAClick: {
      action: 'primary-cta-clicked',
      description: 'Primary CTA click handler',
    },
    onSecondaryCTAClick: {
      action: 'secondary-cta-clicked',
      description: 'Secondary CTA click handler',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default hero section with title only
 */
export const Default: Story = {
  args: {
    title: 'Welcome to Ozean Licht',
  },
};

/**
 * Complete hero with all elements
 */
export const Complete: Story = {
  args: {
    title: 'Transform Your Consciousness',
    subtitle: 'New Course Available',
    description: 'Discover ancient wisdom and modern techniques for spiritual growth and personal transformation. Join thousands of seekers on their journey.',
    ctaText: 'Start Your Journey',
    secondaryCTAText: 'Learn More',
  },
};

/**
 * Hero with badge subtitle
 */
export const WithSubtitle: Story = {
  args: {
    title: 'Kids Ascension Platform',
    subtitle: 'Educational Excellence',
    description: 'Empowering young minds through innovative learning experiences.',
    ctaText: 'Explore Courses',
  },
};

/**
 * Hero with description only (no subtitle)
 */
export const WithDescription: Story = {
  args: {
    title: 'Meditation & Mindfulness',
    description: 'Learn proven techniques to reduce stress, improve focus, and cultivate inner peace through guided meditation practices.',
    ctaText: 'Begin Practice',
    secondaryCTAText: 'View Schedule',
  },
};

/**
 * Hero with single CTA
 */
export const SingleCTA: Story = {
  args: {
    title: 'Join Our Community',
    subtitle: 'Members Worldwide',
    description: 'Connect with like-minded individuals on a path of growth and transformation.',
    ctaText: 'Sign Up Free',
  },
};

/**
 * Hero with dual CTAs
 */
export const DualCTA: Story = {
  args: {
    title: 'Start Your Transformation Today',
    description: 'Access our complete library of courses, workshops, and community resources.',
    ctaText: 'Get Started',
    secondaryCTAText: 'Watch Demo',
  },
};

/**
 * Hero with background image
 */
export const WithBackground: Story = {
  args: {
    title: 'Discover Inner Peace',
    subtitle: 'Meditation Retreat',
    description: 'Immerse yourself in a transformative experience designed to deepen your practice and restore balance.',
    ctaText: 'Register Now',
    secondaryCTAText: 'View Details',
    backgroundImage: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=1920&h=1080&fit=crop',
  },
};

/**
 * Hero with background and cosmic overlay
 * Note: Cosmic effect applied via wrapper className
 */
export const CosmicHero: Story = {
  args: {
    title: 'Unlock Your Potential',
    subtitle: 'Premium Course',
    description: 'Experience breakthrough insights and lasting transformation through our flagship program.',
    ctaText: 'Enroll Now',
    secondaryCTAText: 'Preview Content',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop',
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
 * Hero for course launch
 */
export const CourseLaunch: Story = {
  args: {
    title: 'The Art of Conscious Living',
    subtitle: 'Launching January 2025',
    description: 'A comprehensive 8-week journey into mindfulness, meditation, and intentional living. Limited spots available.',
    ctaText: 'Reserve Your Spot',
    secondaryCTAText: 'Download Syllabus',
  },
};

/**
 * Hero for event promotion
 */
export const EventPromo: Story = {
  args: {
    title: 'Annual Wellness Summit 2025',
    subtitle: 'Vienna, Austria',
    description: 'Join world-renowned teachers for three days of workshops, talks, and transformative experiences.',
    ctaText: 'Get Tickets',
    secondaryCTAText: 'View Speakers',
    backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
  },
};

/**
 * Hero for community page
 */
export const Community: Story = {
  args: {
    title: 'You Are Not Alone',
    subtitle: '10,000+ Members',
    description: 'Join a vibrant community of practitioners, teachers, and seekers supporting each other on the path.',
    ctaText: 'Join Community',
    secondaryCTAText: 'Browse Forums',
  },
};

/**
 * Minimal hero with short title
 */
export const Minimal: Story = {
  args: {
    title: 'Begin',
    description: 'Your journey starts here.',
    ctaText: 'Continue',
  },
};

/**
 * Long-form hero with extensive content
 */
export const LongForm: Story = {
  args: {
    title: 'Comprehensive Teacher Training Certification Program',
    subtitle: '200-Hour Certified',
    description: 'Become a certified meditation and mindfulness instructor through our internationally recognized training program. Learn evidence-based techniques, teaching methodology, and business skills to launch your career helping others.',
    ctaText: 'Apply for Training',
    secondaryCTAText: 'Download Brochure',
  },
};

/**
 * Hero with click handlers (no hrefs)
 */
export const WithClickHandlers: Story = {
  args: {
    title: 'Interactive Hero Demo',
    subtitle: 'Click Testing',
    description: 'This hero uses click handlers instead of href links. Check the Actions panel below.',
    ctaText: 'Primary Action',
    secondaryCTAText: 'Secondary Action',
    onCTAClick: () => console.log('Primary CTA clicked'),
    onSecondaryCTAClick: () => console.log('Secondary CTA clicked'),
  },
};

/**
 * Hero with custom styling
 */
export const CustomStyled: Story = {
  args: {
    title: 'Custom Styled Hero',
    subtitle: 'Extended Padding',
    description: 'This hero demonstrates custom className usage for extended padding and height.',
    ctaText: 'Explore',
    className: 'py-24 md:py-32 min-h-screen flex items-center',
  },
};

/**
 * Showcase all hero variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-px bg-[var(--muted)]">
      <div className="bg-[var(--background)]">
        <HeroSection
          title="Minimal Hero"
          ctaText="Action"
        />
      </div>

      <div className="bg-[var(--background)]">
        <HeroSection
          title="With Subtitle"
          subtitle="Badge Label"
          ctaText="Primary"
        />
      </div>

      <div className="bg-[var(--background)]">
        <HeroSection
          title="Complete Hero"
          subtitle="Full Featured"
          description="This hero includes all possible elements: subtitle badge, description text, and dual CTAs."
          ctaText="Primary Action"
          secondaryCTAText="Secondary"
        />
      </div>

      <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <HeroSection
          title="With Background"
          subtitle="Cosmic Theme"
          description="Background image with cosmic gradient overlay for maximum visual impact."
          ctaText="Get Started"
          secondaryCTAText="Learn More"
          backgroundImage="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop"
        />
      </div>
    </div>
  ),
};

/**
 * Responsive preview showing mobile, tablet, and desktop layouts
 */
export const ResponsiveDemo: Story = {
  args: {
    title: 'Responsive Typography',
    subtitle: 'Mobile First',
    description: 'Notice how the title scales from text-4xl on mobile to text-6xl on large screens, ensuring optimal readability across all devices.',
    ctaText: 'Test Responsive',
    secondaryCTAText: 'Resize Window',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Dark theme variant
 */
export const DarkTheme: Story = {
  args: {
    title: 'Dark Theme Hero',
    subtitle: 'Cosmic Design',
    description: 'Experience the Ozean Licht cosmic dark theme with turquoise accents and glass morphism effects.',
    ctaText: 'Explore',
    secondaryCTAText: 'Details',
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0a0a0a] min-h-screen">
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
    title: 'Light Background Hero',
    subtitle: 'Clean Design',
    description: 'Hero section displayed on a light background for daytime or minimalist aesthetics.',
    ctaText: 'Get Started',
    secondaryCTAText: 'Learn More',
  },
  decorators: [
    (Story) => (
      <div className="bg-white min-h-screen">
        <Story />
      </div>
    ),
  ],
};
