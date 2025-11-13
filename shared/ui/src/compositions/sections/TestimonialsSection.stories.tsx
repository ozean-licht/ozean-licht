import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialsSection } from './TestimonialsSection';

/**
 * TestimonialsSection is a testimonials showcase composition displaying customer feedback and reviews.
 * Features responsive grid layouts, star ratings, avatars, and supports multiple columns.
 *
 * ## Features
 * - Optional section title and subtitle with responsive typography
 * - Grid layout with 2 or 3 column support
 * - Responsive design (mobile-first, stacks on small screens)
 * - Integrates with TestimonialCard for consistent styling
 * - Star rating display for each testimonial
 * - Avatar images with automatic fallback initials
 * - Location badges for geographic context
 * - Glass morphism cards with hover effects
 * - Optional date stamps for temporal context
 * - Ozean Licht cosmic dark theme integration
 *
 * ## Usage
 * ```tsx
 * <TestimonialsSection
 *   title="What Our Community Says"
 *   subtitle="Testimonials"
 *   testimonials={[
 *     {
 *       name: 'Maria Schmidt',
 *       location: 'Vienna, Austria',
 *       testimonial: 'This course transformed my spiritual practice.',
 *       rating: 5
 *     }
 *   ]}
 *   layout="grid"
 *   columns={3}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Sections/TestimonialsSection',
  component: TestimonialsSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Testimonials section composition for displaying customer reviews with responsive grid layouts, ratings, and avatars.',
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
      description: 'Badge subtitle shown above title in primary color',
    },
    testimonials: {
      control: 'object',
      description: 'Array of testimonial objects with name, location, quote, rating, and avatar',
    },
    layout: {
      control: 'select',
      options: ['grid', 'carousel'],
      description: 'Layout style (currently only grid is implemented)',
    },
    columns: {
      control: 'select',
      options: [2, 3],
      description: 'Number of columns in grid layout (2 or 3)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
} satisfies Meta<typeof TestimonialsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample testimonial data
const sampleTestimonials = [
  {
    id: '1',
    name: 'Maria Schmidt',
    location: 'Vienna, Austria',
    testimonial: 'The meditation courses have completely transformed my daily practice. I feel more centered and at peace than ever before.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Hans Mueller',
    location: 'Salzburg, Austria',
    testimonial: 'An incredible journey of self-discovery. The teachers are authentic and the community is truly supportive.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    date: '2024-01-10',
  },
  {
    id: '3',
    name: 'Sophie Weber',
    location: 'Innsbruck, Austria',
    testimonial: 'I was skeptical at first, but the practical techniques and clear guidance made all the difference. Highly recommend!',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    date: '2024-01-05',
  },
];

const extendedTestimonials = [
  ...sampleTestimonials,
  {
    id: '4',
    name: 'Thomas Bauer',
    location: 'Graz, Austria',
    testimonial: 'The Kids Ascension platform has been a game-changer for my children. They are learning and growing in ways I never imagined.',
    avatar: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    date: '2023-12-20',
  },
  {
    id: '5',
    name: 'Anna Friedl',
    location: 'Linz, Austria',
    testimonial: 'Beautiful content, thoughtful design, and a truly transformative experience. Worth every moment invested.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    date: '2023-12-15',
  },
  {
    id: '6',
    name: 'Michael Gruber',
    location: 'Klagenfurt, Austria',
    testimonial: 'The community support and expert guidance have helped me overcome challenges I struggled with for years.',
    avatar: 'https://i.pravatar.cc/150?img=14',
    rating: 4,
    date: '2023-12-10',
  },
];

const testimonialsNoAvatar = [
  {
    id: '1',
    name: 'Lisa Hofmann',
    location: 'Bregenz, Austria',
    testimonial: 'Simple yet profound teachings that have enriched my spiritual journey beyond measure.',
    rating: 5,
  },
  {
    id: '2',
    name: 'David Steiner',
    location: 'Villach, Austria',
    testimonial: 'Clear, practical, and life-changing. These courses deliver exactly what they promise.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Julia Moser',
    location: 'Wels, Austria',
    testimonial: 'I appreciate the authentic approach and the genuine care for student progress. Excellent platform!',
    rating: 4,
  },
];

const longTestimonials = [
  {
    id: '1',
    name: 'Elisabeth Wagner',
    location: 'Vienna, Austria',
    testimonial: 'After years of searching for the right spiritual guidance, I finally found Ozean Licht. The comprehensive curriculum, experienced teachers, and supportive community have helped me develop a consistent meditation practice that has truly transformed my life. I am more present with my family, more focused at work, and more at peace with myself. I cannot recommend this platform highly enough to anyone serious about their spiritual growth and personal development.',
    avatar: 'https://i.pravatar.cc/150?img=10',
    rating: 5,
    date: '2024-02-01',
  },
  {
    id: '2',
    name: 'Martin Berger',
    location: 'Salzburg, Austria',
    testimonial: 'As a busy professional, I was struggling to find time for self-care and spiritual practice. The flexible course structure and accessible teachings have made it possible for me to integrate mindfulness into my daily routine. The results have been remarkable - better sleep, reduced stress, improved relationships, and a deeper sense of purpose. This is not just a course, it is a complete life transformation toolkit.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 5,
    date: '2024-01-28',
  },
];

/**
 * Default testimonials section with 3 testimonials in a grid
 */
export const Default: Story = {
  args: {
    title: 'What Our Community Says',
    subtitle: 'Testimonials',
    testimonials: sampleTestimonials,
    layout: 'grid',
    columns: 3,
  },
};

/**
 * Testimonials section with title only (no subtitle)
 */
export const TitleOnly: Story = {
  args: {
    title: 'Trusted by Thousands',
    testimonials: sampleTestimonials,
    columns: 3,
  },
};

/**
 * Testimonials section without header (testimonials only)
 */
export const NoHeader: Story = {
  args: {
    testimonials: sampleTestimonials,
    columns: 3,
  },
};

/**
 * Two-column grid layout
 */
export const TwoColumns: Story = {
  args: {
    title: 'Student Success Stories',
    subtitle: 'Reviews',
    testimonials: sampleTestimonials.slice(0, 2),
    columns: 2,
  },
};

/**
 * Three-column grid layout (default)
 */
export const ThreeColumns: Story = {
  args: {
    title: 'Transformative Experiences',
    subtitle: 'What Members Say',
    testimonials: sampleTestimonials,
    columns: 3,
  },
};

/**
 * Six testimonials in a 3-column grid
 */
export const SixTestimonials: Story = {
  args: {
    title: 'Join Our Growing Community',
    subtitle: 'Member Feedback',
    testimonials: extendedTestimonials,
    columns: 3,
  },
};

/**
 * Four testimonials in a 2-column grid
 */
export const FourTestimonials: Story = {
  args: {
    title: 'Real Results from Real People',
    subtitle: 'Success Stories',
    testimonials: extendedTestimonials.slice(0, 4),
    columns: 2,
  },
};

/**
 * Single testimonial (useful for highlighting a featured review)
 */
export const SingleTestimonial: Story = {
  args: {
    title: 'Featured Review',
    subtitle: 'Member Spotlight',
    testimonials: [sampleTestimonials[0]],
    columns: 3,
  },
};

/**
 * Testimonials without avatars (initials fallback)
 */
export const WithoutAvatars: Story = {
  args: {
    title: 'Community Feedback',
    subtitle: 'Recent Reviews',
    testimonials: testimonialsNoAvatar,
    columns: 3,
  },
};

/**
 * Mixed ratings (showing 4 and 5 star reviews)
 */
export const MixedRatings: Story = {
  args: {
    title: 'Honest Reviews',
    subtitle: 'What Students Say',
    testimonials: [
      {
        id: '1',
        name: 'Clara Richter',
        location: 'Vienna, Austria',
        testimonial: 'Excellent courses with practical applications. The only thing I wish is that there were more advanced-level content.',
        avatar: 'https://i.pravatar.cc/150?img=20',
        rating: 4,
      },
      {
        id: '2',
        name: 'Stefan Koch',
        location: 'Salzburg, Austria',
        testimonial: 'Absolutely perfect. Everything I was looking for in a spiritual education platform.',
        avatar: 'https://i.pravatar.cc/150?img=33',
        rating: 5,
      },
      {
        id: '3',
        name: 'Nina Huber',
        location: 'Innsbruck, Austria',
        testimonial: 'Very good overall. The community is wonderful and the teachers are knowledgeable. Would recommend!',
        avatar: 'https://i.pravatar.cc/150?img=25',
        rating: 4,
      },
    ],
    columns: 3,
  },
};

/**
 * All 5-star testimonials
 */
export const AllFiveStars: Story = {
  args: {
    title: 'Excellence in Every Experience',
    subtitle: 'Top Rated',
    testimonials: sampleTestimonials.map(t => ({ ...t, rating: 5 })),
    columns: 3,
  },
};

/**
 * Long-form testimonials with extended text
 */
export const LongForm: Story = {
  args: {
    title: 'Deep Dive Reviews',
    subtitle: 'Detailed Feedback',
    testimonials: longTestimonials,
    columns: 2,
  },
};

/**
 * Testimonials without ratings (quote-focused)
 */
export const WithoutRatings: Story = {
  args: {
    title: 'Words from Our Community',
    subtitle: 'Member Voices',
    testimonials: sampleTestimonials.map(({ rating, ...t }) => t),
    columns: 3,
  },
};

/**
 * Testimonials without location
 */
export const WithoutLocation: Story = {
  args: {
    title: 'Global Community',
    subtitle: 'Member Reviews',
    testimonials: sampleTestimonials.map(({ location, ...t }) => t),
    columns: 3,
  },
};

/**
 * Testimonials without dates
 */
export const WithoutDates: Story = {
  args: {
    title: 'Timeless Wisdom',
    subtitle: 'Community Praise',
    testimonials: sampleTestimonials.map(({ date, ...t }) => t),
    columns: 3,
  },
};

/**
 * Course-specific testimonials
 */
export const CourseReviews: Story = {
  args: {
    title: 'Advanced Meditation Course Reviews',
    subtitle: 'Student Feedback',
    testimonials: [
      {
        id: '1',
        name: 'Alexandra Wimmer',
        location: 'Vienna, Austria',
        testimonial: 'This advanced course took my practice to an entirely new level. The techniques are powerful yet accessible.',
        avatar: 'https://i.pravatar.cc/150?img=30',
        rating: 5,
        date: '2024-02-10',
      },
      {
        id: '2',
        name: 'Robert Maier',
        location: 'Graz, Austria',
        testimonial: 'Challenging in the best way. I feel like I have the tools to continue deepening my practice for years to come.',
        avatar: 'https://i.pravatar.cc/150?img=31',
        rating: 5,
        date: '2024-02-08',
      },
      {
        id: '3',
        name: 'Katharina Lang',
        location: 'Linz, Austria',
        testimonial: 'The progression from beginner to advanced was seamless. Highly structured and incredibly effective.',
        avatar: 'https://i.pravatar.cc/150?img=32',
        rating: 4,
        date: '2024-02-05',
      },
    ],
    columns: 3,
  },
};

/**
 * Kids Ascension platform testimonials
 */
export const KidsAscension: Story = {
  args: {
    title: 'Parents Love Kids Ascension',
    subtitle: 'Parent Testimonials',
    testimonials: [
      {
        id: '1',
        name: 'Sabine Leitner',
        location: 'Vienna, Austria',
        testimonial: 'My children are thriving! The educational content is engaging, age-appropriate, and truly transformative.',
        avatar: 'https://i.pravatar.cc/150?img=40',
        rating: 5,
      },
      {
        id: '2',
        name: 'Andreas Pichler',
        location: 'Salzburg, Austria',
        testimonial: 'As a parent and educator, I am impressed by the quality and depth of the Kids Ascension curriculum.',
        avatar: 'https://i.pravatar.cc/150?img=41',
        rating: 5,
      },
      {
        id: '3',
        name: 'Martina Schuster',
        location: 'Innsbruck, Austria',
        testimonial: 'Safe, enriching, and beautifully designed. My kids actually ask to do their lessons!',
        avatar: 'https://i.pravatar.cc/150?img=42',
        rating: 5,
      },
    ],
    columns: 3,
  },
};

/**
 * Custom styled with extended padding
 */
export const CustomStyled: Story = {
  args: {
    title: 'Custom Padding Example',
    subtitle: 'Extended Spacing',
    testimonials: sampleTestimonials,
    columns: 3,
    className: 'py-20',
  },
};

/**
 * Cosmic dark theme showcase
 */
export const CosmicTheme: Story = {
  args: {
    title: 'Cosmic Testimonials',
    subtitle: 'Community Reviews',
    testimonials: sampleTestimonials,
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
 * Light background variant
 */
export const LightBackground: Story = {
  args: {
    title: 'Clean & Minimal',
    subtitle: 'Reviews',
    testimonials: sampleTestimonials,
    columns: 3,
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
 * Turquoise accent showcase (Ozean Licht branding)
 */
export const TurquoiseAccent: Story = {
  args: {
    title: 'Ozean Licht Reviews',
    subtitle: 'Transformative Experiences',
    testimonials: sampleTestimonials,
    columns: 3,
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/5 via-transparent to-[#0ec2bc]/5 pointer-events-none" />
        <Story />
      </div>
    ),
  ],
};

/**
 * Responsive preview showing mobile layout
 */
export const ResponsiveDemo: Story = {
  args: {
    title: 'Responsive Grid',
    subtitle: 'Mobile First Design',
    testimonials: sampleTestimonials,
    columns: 3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Large collection (9 testimonials)
 */
export const LargeCollection: Story = {
  args: {
    title: 'Community Voices',
    subtitle: 'What Our Members Say',
    testimonials: [
      ...extendedTestimonials,
      {
        id: '7',
        name: 'Eva Brunner',
        location: 'Vienna, Austria',
        testimonial: 'Life-changing content and wonderful community. So grateful I found this platform!',
        avatar: 'https://i.pravatar.cc/150?img=21',
        rating: 5,
      },
      {
        id: '8',
        name: 'Florian Ebner',
        location: 'Graz, Austria',
        testimonial: 'The quality of instruction is unmatched. Highly professional and deeply authentic.',
        avatar: 'https://i.pravatar.cc/150?img=22',
        rating: 5,
      },
      {
        id: '9',
        name: 'Sandra Eder',
        location: 'Salzburg, Austria',
        testimonial: 'From the first lesson, I knew I had found something special. Absolutely transformative!',
        avatar: 'https://i.pravatar.cc/150?img=23',
        rating: 4,
      },
    ],
    columns: 3,
  },
};

/**
 * Minimal single column on small screens
 */
export const MinimalMobile: Story = {
  args: {
    title: 'Featured',
    testimonials: [sampleTestimonials[0]],
    columns: 3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Showcase all layout variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-16 bg-[var(--background)] py-8">
      <TestimonialsSection
        title="Three Columns Default"
        subtitle="Standard Layout"
        testimonials={sampleTestimonials}
        columns={3}
      />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection
        title="Two Columns Wide"
        subtitle="Alternative Layout"
        testimonials={sampleTestimonials.slice(0, 2)}
        columns={2}
      />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection
        title="No Header Style"
        testimonials={sampleTestimonials}
        columns={3}
      />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection
        subtitle="Subtitle Only"
        testimonials={sampleTestimonials.slice(0, 2)}
        columns={2}
      />
    </div>
  ),
};

/**
 * Real-world example: Course landing page
 */
export const CourseLandingPage: Story = {
  args: {
    title: 'What Students Are Saying',
    subtitle: 'Course Reviews',
    testimonials: [
      {
        id: '1',
        name: 'Maria Schmidt',
        location: 'Vienna, Austria',
        testimonial: 'This course exceeded all my expectations. The structured approach and expert guidance helped me establish a consistent meditation practice.',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        date: '2024-02-15',
      },
      {
        id: '2',
        name: 'Hans Mueller',
        location: 'Salzburg, Austria',
        testimonial: 'Practical, accessible, and deeply transformative. I recommend this to everyone interested in mindfulness.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        date: '2024-02-12',
      },
      {
        id: '3',
        name: 'Sophie Weber',
        location: 'Innsbruck, Austria',
        testimonial: 'The community support and clear instruction made learning meditation easier than I ever imagined.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 4,
        date: '2024-02-10',
      },
    ],
    columns: 3,
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
 * Real-world example: Homepage social proof
 */
export const HomepageSocialProof: Story = {
  args: {
    title: 'Trusted by Thousands',
    subtitle: 'Join Our Community',
    testimonials: extendedTestimonials.slice(0, 3),
    columns: 3,
  },
};

/**
 * Real-world example: Pricing page testimonials
 */
export const PricingPageTestimonials: Story = {
  args: {
    title: 'Why Members Choose Us',
    subtitle: 'Member Success',
    testimonials: [
      {
        id: '1',
        name: 'Elisabeth Wagner',
        location: 'Vienna, Austria',
        testimonial: 'Best investment in myself I have ever made. The value far exceeds the price.',
        avatar: 'https://i.pravatar.cc/150?img=10',
        rating: 5,
      },
      {
        id: '2',
        name: 'Martin Berger',
        location: 'Salzburg, Austria',
        testimonial: 'Worth every cent. The quality of content and community support is unparalleled.',
        avatar: 'https://i.pravatar.cc/150?img=15',
        rating: 5,
      },
    ],
    columns: 2,
  },
};
