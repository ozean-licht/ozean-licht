import type { Meta, StoryObj } from '@storybook/react';
import { CourseCard } from './CourseCard';
import type { Course } from '../types';

/**
 * CourseCard displays course information in a card format with glass morphism effects.
 * Features intelligent image loading with fallback generation, price badge, and CTA button.
 * Extracted from ozean-licht app and refactored to use Tier 2 components.
 *
 * ## Features
 * - ReliableImage component with automatic fallback SVG generation
 * - Glass morphism card variant with hover effects
 * - Price badge with gradient and glow effects
 * - Meta information (availability, duration)
 * - Responsive 16:9 image aspect ratio
 * - Text truncation for title (2 lines) and description (3 lines)
 * - Integrated with Next.js Link for navigation
 * - Supports custom href override
 *
 * ## Usage
 * ```tsx
 * <CourseCard
 *   course={{
 *     id: '1',
 *     slug: 'intro-meditation',
 *     title: 'Introduction to Meditation',
 *     description: 'Learn the basics of meditation...',
 *     price: 49.99,
 *     thumbnail_url_desktop: '/images/course.jpg',
 *     is_available: true,
 *     duration: '8 hours'
 *   }}
 *   hover
 *   glow
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Course card composition showcasing course offerings with image, title, description, price badge, and CTA. Features Ozean Licht branding with glass morphism and cosmic dark theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    course: {
      description: 'Course data object with id, slug, title, description, price, and thumbnail URLs',
      control: 'object',
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
    hover: {
      description: 'Enable hover effects on the card',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    glow: {
      description: 'Enable turquoise glow effect around the card',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    href: {
      description: 'Custom link href (overrides default /courses/[slug])',
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
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample course data
const sampleCourse: Course = {
  id: '1',
  slug: 'intro-meditation',
  title: 'Introduction to Meditation',
  description:
    'Learn the basics of meditation and mindfulness. This comprehensive course covers breathing techniques, body awareness, and mental clarity practices for beginners.',
  price: 49.99,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
  is_available: true,
  duration: '8 Stunden',
};

const advancedCourse: Course = {
  id: '2',
  slug: 'advanced-chakra',
  title: 'Advanced Chakra Healing & Energy Work',
  description:
    'Deep dive into chakra systems, energy healing techniques, and spiritual awakening. Learn to balance your energy centers and unlock your full spiritual potential through guided practices and ancient wisdom.',
  price: 129.99,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop',
  is_available: true,
  duration: '12 Stunden',
  instructor: 'Maria Schneider',
};

const comingSoonCourse: Course = {
  id: '3',
  slug: 'crystal-healing',
  title: 'Crystal Healing Masterclass',
  description:
    'Discover the power of crystals and how to use them for healing, protection, and manifestation. This course covers crystal properties, grid layouts, and practical applications.',
  price: 79.99,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=800&h=450&fit=crop',
  is_available: false,
  duration: '10 Stunden',
};

const noCourse: Course = {
  id: '4',
  slug: 'no-image-course',
  title: 'Spirituelle Transformation durch Achtsamkeit',
  description:
    'Ein umfassender Kurs über Achtsamkeit und ihre transformative Kraft im täglichen Leben.',
  price: 39.99,
  is_available: true,
  duration: 'Lebenslang',
};

const shortTitleCourse: Course = {
  id: '5',
  slug: 'yoga-basics',
  title: 'Yoga Basics',
  description: 'Quick intro to yoga.',
  price: 29.99,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
  is_available: true,
};

const longTitleCourse: Course = {
  id: '6',
  slug: 'comprehensive-spiritual-journey',
  title:
    'Comprehensive Spiritual Journey: Awakening Your Inner Light Through Ancient Practices and Modern Wisdom',
  description:
    'This extensive course combines ancient spiritual practices with modern psychological insights to create a transformative journey of self-discovery. Over the course of several months, you will explore meditation, breathwork, energy healing, mindfulness practices, and consciousness expansion techniques. Perfect for both beginners and advanced practitioners seeking deep spiritual growth and personal transformation.',
  price: 299.99,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&h=450&fit=crop',
  is_available: true,
  duration: '40 Stunden',
  instructor: 'Dr. Andreas Lichtenberg',
};

/**
 * Default course card with all standard features
 */
export const Default: Story = {
  args: {
    course: sampleCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Course card with glow effect for emphasis
 */
export const WithGlow: Story = {
  args: {
    course: sampleCourse,
    hover: true,
    glow: true,
  },
};

/**
 * Advanced course with higher price point
 */
export const AdvancedCourse: Story = {
  args: {
    course: advancedCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Coming soon course (not available)
 */
export const ComingSoon: Story = {
  args: {
    course: comingSoonCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Course without image - shows fallback SVG generation
 */
export const NoImage: Story = {
  args: {
    course: noCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Course with short title and description
 */
export const ShortContent: Story = {
  args: {
    course: shortTitleCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Course with very long title and description (shows truncation)
 */
export const LongContent: Story = {
  args: {
    course: longTitleCourse,
    hover: true,
    glow: false,
  },
};

/**
 * Course card without hover effects
 */
export const NoHover: Story = {
  args: {
    course: sampleCourse,
    hover: false,
    glow: false,
  },
};

/**
 * Course card with custom href
 */
export const CustomHref: Story = {
  args: {
    course: sampleCourse,
    hover: true,
    glow: false,
    href: '/custom-path/meditation-course',
  },
  parameters: {
    docs: {
      description: {
        story: 'Override the default /courses/[slug] link with a custom href.',
      },
    },
  },
};

/**
 * Premium course with glow effect
 */
export const PremiumCourse: Story = {
  args: {
    course: {
      id: '7',
      slug: 'spiritual-mastery',
      title: 'Spiritual Mastery Program',
      description:
        'The ultimate spiritual transformation program. A year-long journey into consciousness, energy work, and enlightenment. Includes personal mentorship and lifetime access to all materials.',
      price: 999.99,
      thumbnail_url_desktop: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=450&fit=crop',
      is_available: true,
      duration: '365 Tage',
      instructor: 'Master Li Wei',
    },
    hover: true,
    glow: true,
  },
};

/**
 * Free course (price = 0)
 */
export const FreeCourse: Story = {
  args: {
    course: {
      id: '8',
      slug: 'meditation-intro-free',
      title: 'Free Meditation Introduction',
      description: 'Start your meditation journey with this free introductory course. No credit card required.',
      price: 0,
      thumbnail_url_desktop: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop',
      is_available: true,
      duration: '2 Stunden',
    },
    hover: true,
    glow: false,
  },
};

/**
 * Grid layout showing multiple cards
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl">
      <CourseCard course={sampleCourse} hover glow={false} />
      <CourseCard course={advancedCourse} hover glow />
      <CourseCard course={comingSoonCourse} hover glow={false} />
      <CourseCard course={noCourse} hover glow={false} />
      <CourseCard course={shortTitleCourse} hover glow={false} />
      <CourseCard course={longTitleCourse} hover glow />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Multiple course cards in a responsive grid layout.',
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
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Available Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={sampleCourse} hover glow={false} />
          <CourseCard course={advancedCourse} hover glow />
          <CourseCard course={shortTitleCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Coming Soon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={comingSoonCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Images (Fallback)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={noCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Edge Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={longTitleCourse} hover glow />
          <CourseCard
            course={{
              id: '9',
              slug: 'test',
              title: 'Test',
              price: 0,
              is_available: true,
            }}
            hover
            glow={false}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all course card states and variations.',
      },
    },
  },
};

/**
 * Loading state (image loading simulation)
 */
export const LoadingState: Story = {
  args: {
    course: {
      ...sampleCourse,
      thumbnail_url_desktop: 'https://example.com/very-slow-loading-image.jpg', // Intentionally slow/broken
    },
    hover: true,
    glow: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates loading state with spinner while image loads. Will fallback to generated SVG if image fails to load.',
      },
    },
  },
};

/**
 * Mobile view (narrow container)
 */
export const MobileView: Story = {
  args: {
    course: sampleCourse,
    hover: true,
    glow: false,
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
        story: 'Course card optimized for mobile viewports.',
      },
    },
  },
};

/**
 * Dark cosmic theme showcase
 */
export const CosmicTheme: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <CourseCard course={sampleCourse} hover glow />
        <CourseCard course={advancedCourse} hover glow />
        <CourseCard course={longTitleCourse} hover glow />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Course cards displayed on cosmic dark background with glow effects.',
      },
    },
  },
};
