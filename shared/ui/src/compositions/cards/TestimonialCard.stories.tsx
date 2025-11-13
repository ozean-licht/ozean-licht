import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCard } from './TestimonialCard';

/**
 * TestimonialCard displays user testimonials with avatar, quote, and author info.
 * Ideal for social proof sections, reviews pages, and landing pages.
 *
 * ## Features
 * - Avatar display with automatic initials fallback
 * - 5-star rating system
 * - Optional location and date display
 * - Glass morphism card with hover effects
 * - Turquoise accent colors (#0ec2bc)
 * - Responsive layout
 *
 * ## Usage
 * ```tsx
 * import { TestimonialCard } from '@ozean-licht/shared-ui/compositions'
 *
 * <TestimonialCard
 *   testimonial={{
 *     name: 'Maria Schmidt',
 *     location: 'Vienna, Austria',
 *     testimonial: 'This transformed my spiritual practice...',
 *     rating: 5
 *   }}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/TestimonialCard',
  component: TestimonialCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A composition component for displaying customer testimonials with avatars, ratings, and quotes. Features glass morphism design and Ozean Licht branding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    testimonial: {
      description: 'Testimonial data object containing name, quote, and optional fields',
      control: 'object',
    },
    showAvatar: {
      description: 'Display user avatar or initials',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showRating: {
      description: 'Display star rating',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      description: 'Additional CSS classes for styling',
      control: 'text',
    },
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default testimonial card with all features enabled
 */
export const Default: Story = {
  args: {
    testimonial: {
      name: 'Maria Schmidt',
      location: 'Vienna, Austria',
      testimonial: 'This platform has transformed my spiritual practice. The courses are well-structured and the community is incredibly supportive.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=47',
      date: '2025-01-15',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial without avatar image (shows initials fallback)
 */
export const WithInitials: Story = {
  args: {
    testimonial: {
      name: 'Johann Weber',
      location: 'Salzburg, Austria',
      testimonial: 'The meditation courses have helped me find inner peace. I highly recommend Ozean Licht to anyone on a spiritual journey.',
      rating: 5,
      date: '2025-01-10',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial without avatar display
 */
export const NoAvatar: Story = {
  args: {
    testimonial: {
      name: 'Sophie Gruber',
      location: 'Graz, Austria',
      testimonial: 'Outstanding educational content. The teachers are knowledgeable and the platform is easy to navigate.',
      rating: 5,
      date: '2025-01-08',
    },
    showAvatar: false,
    showRating: true,
  },
};

/**
 * Testimonial without rating
 */
export const NoRating: Story = {
  args: {
    testimonial: {
      name: 'Lukas Müller',
      location: 'Innsbruck, Austria',
      testimonial: 'A wonderful platform for spiritual growth. The variety of courses and workshops is impressive.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      date: '2025-01-05',
    },
    showAvatar: true,
    showRating: false,
  },
};

/**
 * Minimal testimonial (no location, no date, no rating)
 */
export const Minimal: Story = {
  args: {
    testimonial: {
      name: 'Anna Bauer',
      testimonial: 'Life-changing experience. Thank you Ozean Licht!',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    showAvatar: true,
    showRating: false,
  },
};

/**
 * Testimonial with 4-star rating
 */
export const FourStars: Story = {
  args: {
    testimonial: {
      name: 'Michael Berger',
      location: 'Linz, Austria',
      testimonial: 'Great platform with excellent courses. Looking forward to more advanced content in the future.',
      rating: 4,
      avatar: 'https://i.pravatar.cc/150?img=68',
      date: '2024-12-20',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial with short quote
 */
export const ShortQuote: Story = {
  args: {
    testimonial: {
      name: 'Elena Wagner',
      location: 'Wels, Austria',
      testimonial: 'Simply amazing!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial with long quote
 */
export const LongQuote: Story = {
  args: {
    testimonial: {
      name: 'Franz Steiner',
      location: 'Klagenfurt, Austria',
      testimonial: 'I have been on a spiritual journey for many years, trying different platforms and courses. Ozean Licht stands out as one of the best platforms I have encountered. The quality of teaching is exceptional, the community is warm and welcoming, and the variety of courses allows for comprehensive spiritual development. I particularly appreciate the attention to detail in course structure and the integration of modern technology with ancient wisdom. This platform has truly helped me deepen my practice and connect with like-minded individuals from across Austria and beyond.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=52',
      date: '2024-11-30',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial with single name
 */
export const SingleName: Story = {
  args: {
    testimonial: {
      name: 'Christina',
      location: 'Bregenz, Austria',
      testimonial: 'The Kids Ascension program has been wonderful for my children. They love the interactive lessons!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=23',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial without location
 */
export const NoLocation: Story = {
  args: {
    testimonial: {
      name: 'Thomas Huber',
      testimonial: 'Excellent platform for personal and spiritual growth. The courses are professionally produced and deeply meaningful.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=15',
      date: '2025-01-12',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Testimonial without date
 */
export const NoDate: Story = {
  args: {
    testimonial: {
      name: 'Sarah Fischer',
      location: 'Villach, Austria',
      testimonial: 'Wonderful content and amazing instructors. Highly recommended for anyone seeking spiritual development.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=28',
    },
    showAvatar: true,
    showRating: true,
  },
};

/**
 * Multiple testimonials in a grid layout
 */
export const MultipleTestimonials: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-7xl">
      <TestimonialCard
        testimonial={{
          name: 'Maria Schmidt',
          location: 'Vienna, Austria',
          testimonial: 'This platform has transformed my spiritual practice completely.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=47',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Johann Weber',
          location: 'Salzburg, Austria',
          testimonial: 'The meditation courses have helped me find inner peace and balance.',
          rating: 5,
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Sophie Gruber',
          location: 'Graz, Austria',
          testimonial: 'Outstanding educational content with knowledgeable teachers.',
          rating: 4,
          avatar: 'https://i.pravatar.cc/150?img=32',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Lukas Müller',
          location: 'Innsbruck, Austria',
          testimonial: 'A wonderful platform for spiritual growth and learning.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=68',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Anna Bauer',
          location: 'Linz, Austria',
          testimonial: 'Life-changing experience. Thank you Ozean Licht!',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=23',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Michael Berger',
          testimonial: 'Great platform with excellent courses and community support.',
          rating: 4,
        }}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Testimonials with different rating levels
 */
export const DifferentRatings: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-5xl">
      <TestimonialCard
        testimonial={{
          name: 'Perfect Experience',
          testimonial: 'Everything was absolutely perfect. Five stars!',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=1',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Very Good',
          testimonial: 'Really good platform, just some minor areas for improvement.',
          rating: 4,
          avatar: 'https://i.pravatar.cc/150?img=2',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'Good Overall',
          testimonial: 'Good experience with room for growth.',
          rating: 3,
          avatar: 'https://i.pravatar.cc/150?img=3',
        }}
      />
      <TestimonialCard
        testimonial={{
          name: 'No Rating',
          testimonial: 'Great platform, just wanted to share my thoughts without rating.',
        }}
        showRating={false}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Custom styled testimonial
 */
export const CustomStyling: Story = {
  args: {
    testimonial: {
      name: 'Elena Wagner',
      location: 'Wels, Austria',
      testimonial: 'This testimonial card has custom styling applied to demonstrate the className prop.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    showAvatar: true,
    showRating: true,
    className: 'border-2 border-primary shadow-[0_0_20px_rgba(14,194,188,0.3)]',
  },
};

/**
 * All configuration options showcase
 */
export const AllOptions: Story = {
  render: () => (
    <div className="space-y-8 p-8 max-w-5xl">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Full Featured</h3>
        <TestimonialCard
          testimonial={{
            name: 'Maria Schmidt',
            location: 'Vienna, Austria',
            testimonial: 'Complete testimonial with all features enabled.',
            rating: 5,
            avatar: 'https://i.pravatar.cc/150?img=47',
            date: '2025-01-15',
          }}
          showAvatar={true}
          showRating={true}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Initials Fallback</h3>
        <TestimonialCard
          testimonial={{
            name: 'Johann Weber',
            location: 'Salzburg, Austria',
            testimonial: 'No avatar image, showing initials fallback.',
            rating: 5,
          }}
          showAvatar={true}
          showRating={true}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">No Avatar</h3>
        <TestimonialCard
          testimonial={{
            name: 'Sophie Gruber',
            location: 'Graz, Austria',
            testimonial: 'Avatar display disabled.',
            rating: 5,
          }}
          showAvatar={false}
          showRating={true}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">No Rating</h3>
        <TestimonialCard
          testimonial={{
            name: 'Lukas Müller',
            location: 'Innsbruck, Austria',
            testimonial: 'Rating display disabled.',
            avatar: 'https://i.pravatar.cc/150?img=68',
          }}
          showAvatar={true}
          showRating={false}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Minimal</h3>
        <TestimonialCard
          testimonial={{
            name: 'Anna Bauer',
            testimonial: 'Only name and quote, nothing else.',
          }}
          showAvatar={false}
          showRating={false}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
