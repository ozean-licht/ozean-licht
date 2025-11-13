import type { Meta, StoryObj } from '@storybook/react';
import { BlogCard } from './BlogCard';
import type { BlogPost } from '../types';

/**
 * BlogCard displays blog post previews with optional thumbnail, category badge,
 * author info, and read time. Designed for magazine sections, blog listings,
 * and content discovery pages.
 *
 * ## Features
 * - Optional responsive thumbnail image with hover scale effect
 * - Category badge with turquoise accent
 * - Title with hover color transition to primary
 * - 2-line excerpt truncation
 * - Author avatar with automatic initials fallback
 * - Read time estimation display
 * - Glass morphism card with hover effects
 * - Next.js Link integration for navigation
 * - Responsive layout (16:9 aspect ratio for images)
 *
 * ## Usage
 * ```tsx
 * import { BlogCard } from '@ozean-licht/shared-ui/compositions'
 *
 * <BlogCard
 *   post={{
 *     id: '1',
 *     slug: 'spiritual-awakening',
 *     title: 'The Path to Spiritual Awakening',
 *     excerpt: 'Discover ancient wisdom and modern practices...',
 *     image: '/images/blog/awakening.jpg',
 *     author: 'Maria Schmidt',
 *     date: '2025-01-15',
 *     category: 'Meditation',
 *     readTime: '5 min read'
 *   }}
 *   showAuthor={true}
 *   showReadTime={true}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/BlogCard',
  component: BlogCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Blog card composition for displaying article previews with thumbnail, category, excerpt, and metadata. Features Ozean Licht branding with glass morphism and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    post: {
      description: 'Blog post data object with title, excerpt, image, author, and metadata',
      control: 'object',
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
    showAuthor: {
      description: 'Display author info with avatar',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showReadTime: {
      description: 'Display estimated read time',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
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
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample blog post data
const samplePost: BlogPost = {
  id: '1',
  slug: 'spiritual-awakening-guide',
  title: 'The Complete Guide to Spiritual Awakening',
  excerpt:
    'Discover the transformative journey of spiritual awakening through ancient wisdom and modern practices. Learn the signs, stages, and tools for your personal evolution.',
  image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
  author: 'Maria Schmidt',
  date: '2025-01-15',
  category: 'Meditation',
  readTime: '8 min read',
};

const chakraPost: BlogPost = {
  id: '2',
  slug: 'chakra-healing-basics',
  title: 'Chakra Healing: Understanding Your Energy Centers',
  excerpt:
    'Explore the seven chakras and learn how to balance your energy system through meditation, crystals, and intentional practices for holistic well-being.',
  image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop',
  author: 'Johann Weber',
  date: '2025-01-12',
  category: 'Energy Work',
  readTime: '10 min read',
};

const mindfulnessPost: BlogPost = {
  id: '3',
  slug: 'mindfulness-daily-practice',
  title: 'Integrating Mindfulness into Daily Life',
  excerpt:
    'Simple yet powerful techniques to bring mindfulness into your everyday routines. Transform mundane moments into opportunities for presence and peace.',
  image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop',
  author: 'Sophie Gruber',
  date: '2025-01-10',
  category: 'Mindfulness',
  readTime: '6 min read',
};

const crystalPost: BlogPost = {
  id: '4',
  slug: 'crystal-energy-healing',
  title: 'Crystal Healing: Harnessing Earth\'s Energy',
  excerpt:
    'Learn about crystal properties, selection, cleansing, and programming. Discover how to use crystals for healing, protection, and manifestation.',
  image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=800&h=450&fit=crop',
  author: 'Lukas Müller',
  date: '2025-01-08',
  category: 'Crystals',
  readTime: '7 min read',
};

const noImagePost: BlogPost = {
  id: '5',
  slug: 'inner-peace-journey',
  title: 'Finding Inner Peace in a Chaotic World',
  excerpt:
    'Practical strategies for maintaining emotional balance and mental clarity amidst life\'s challenges and distractions.',
  author: 'Anna Bauer',
  date: '2025-01-05',
  category: 'Wellness',
  readTime: '5 min read',
};

const noCategoryPost: BlogPost = {
  id: '6',
  slug: 'meditation-for-beginners',
  title: 'Meditation for Absolute Beginners',
  excerpt:
    'Start your meditation practice with confidence. This comprehensive guide covers everything you need to know to begin meditating today.',
  image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&h=450&fit=crop',
  author: 'Thomas Huber',
  date: '2025-01-03',
  readTime: '12 min read',
};

const shortExcerptPost: BlogPost = {
  id: '7',
  slug: 'quick-tips',
  title: 'Quick Spiritual Practice Tips',
  excerpt: 'Fast and effective techniques for busy people.',
  image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
  author: 'Elena Wagner',
  date: '2025-01-02',
  category: 'Tips',
  readTime: '3 min read',
};

const longTitlePost: BlogPost = {
  id: '8',
  slug: 'comprehensive-spiritual-transformation',
  title:
    'The Comprehensive Journey Through Spiritual Transformation: Ancient Wisdom Meets Modern Psychology for Lasting Personal Growth',
  excerpt:
    'This extensive exploration delves deep into the multifaceted nature of spiritual transformation, examining how ancient spiritual practices from various traditions can be integrated with contemporary psychological understanding to create a holistic approach to personal development and consciousness expansion. Through detailed analysis and practical guidance, we explore the intersection of Eastern philosophy, Western psychology, and modern neuroscience to provide a complete roadmap for those seeking profound inner transformation and lasting change.',
  image: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&h=450&fit=crop',
  author: 'Dr. Andreas Lichtenberg',
  date: '2024-12-28',
  category: 'Transformation',
  readTime: '15 min read',
};

const noAuthorPost: BlogPost = {
  id: '9',
  slug: 'community-wisdom',
  title: 'Community Wisdom: Collective Insights',
  excerpt:
    'Shared experiences and insights from our vibrant spiritual community. Learn from the collective wisdom of practitioners worldwide.',
  image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=450&fit=crop',
  date: '2025-01-01',
  category: 'Community',
  readTime: '9 min read',
};

const minimalPost: BlogPost = {
  id: '10',
  slug: 'minimal-post',
  title: 'Essential Mindfulness',
  excerpt: 'The core principles of mindful living.',
  date: '2024-12-30',
};

/**
 * Default blog card with all features enabled
 */
export const Default: Story = {
  args: {
    post: samplePost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card with chakra healing content
 */
export const EnergyWork: Story = {
  args: {
    post: chakraPost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card with mindfulness content
 */
export const Mindfulness: Story = {
  args: {
    post: mindfulnessPost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card with crystal healing content
 */
export const CrystalHealing: Story = {
  args: {
    post: crystalPost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card without thumbnail image
 */
export const NoImage: Story = {
  args: {
    post: noImagePost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card without category badge
 */
export const NoCategory: Story = {
  args: {
    post: noCategoryPost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card with short excerpt
 */
export const ShortContent: Story = {
  args: {
    post: shortExcerptPost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card with very long title and excerpt (shows truncation)
 */
export const LongContent: Story = {
  args: {
    post: longTitlePost,
    showAuthor: true,
    showReadTime: true,
  },
};

/**
 * Blog card without author info
 */
export const NoAuthor: Story = {
  args: {
    post: noAuthorPost,
    showAuthor: false,
    showReadTime: true,
  },
};

/**
 * Blog card without read time
 */
export const NoReadTime: Story = {
  args: {
    post: samplePost,
    showAuthor: true,
    showReadTime: false,
  },
};

/**
 * Blog card without metadata (no author, no read time)
 */
export const NoMetadata: Story = {
  args: {
    post: samplePost,
    showAuthor: false,
    showReadTime: false,
  },
};

/**
 * Minimal blog card with minimal content
 */
export const Minimal: Story = {
  args: {
    post: minimalPost,
    showAuthor: false,
    showReadTime: false,
  },
};

/**
 * Blog card with custom styling
 */
export const CustomStyling: Story = {
  args: {
    post: samplePost,
    showAuthor: true,
    showReadTime: true,
    className: 'border-2 border-primary shadow-[0_0_20px_rgba(14,194,188,0.3)]',
  },
};

/**
 * Grid layout showing multiple blog cards
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl">
      <BlogCard post={samplePost} showAuthor showReadTime />
      <BlogCard post={chakraPost} showAuthor showReadTime />
      <BlogCard post={mindfulnessPost} showAuthor showReadTime />
      <BlogCard post={crystalPost} showAuthor showReadTime />
      <BlogCard post={noImagePost} showAuthor showReadTime />
      <BlogCard post={noCategoryPost} showAuthor showReadTime />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Multiple blog cards in a responsive grid layout.',
      },
    },
  },
};

/**
 * Magazine-style list layout
 */
export const ListLayout: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      <BlogCard post={samplePost} showAuthor showReadTime />
      <BlogCard post={chakraPost} showAuthor showReadTime />
      <BlogCard post={mindfulnessPost} showAuthor showReadTime />
      <BlogCard post={crystalPost} showAuthor showReadTime />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Blog cards in a vertical list layout for magazine-style browsing.',
      },
    },
  },
};

/**
 * Mixed content showcase
 */
export const MixedContent: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl">
      <BlogCard post={samplePost} showAuthor showReadTime />
      <BlogCard post={noImagePost} showAuthor showReadTime />
      <BlogCard post={shortExcerptPost} showAuthor showReadTime />
      <BlogCard post={longTitlePost} showAuthor showReadTime />
      <BlogCard post={noCategoryPost} showAuthor showReadTime />
      <BlogCard post={minimalPost} showAuthor={false} showReadTime={false} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Mixed blog cards showing various content lengths and configurations.',
      },
    },
  },
};

/**
 * All categories showcase
 */
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Meditation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={samplePost} showAuthor showReadTime />
          <BlogCard post={noCategoryPost} showAuthor showReadTime />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Energy Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={chakraPost} showAuthor showReadTime />
          <BlogCard post={crystalPost} showAuthor showReadTime />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Mindfulness & Wellness</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={mindfulnessPost} showAuthor showReadTime />
          <BlogCard post={noImagePost} showAuthor showReadTime />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Transformation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={longTitlePost} showAuthor showReadTime />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Blog cards organized by category.',
      },
    },
  },
};

/**
 * All metadata variations
 */
export const AllMetadataVariations: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Full Metadata</h3>
        <BlogCard post={samplePost} showAuthor={true} showReadTime={true} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Author Only</h3>
        <BlogCard post={samplePost} showAuthor={true} showReadTime={false} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Read Time Only</h3>
        <BlogCard post={samplePost} showAuthor={false} showReadTime={true} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">No Metadata</h3>
        <BlogCard post={samplePost} showAuthor={false} showReadTime={false} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Missing Author Data</h3>
        <BlogCard post={noAuthorPost} showAuthor={true} showReadTime={true} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All metadata display variations.',
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
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={samplePost} showAuthor showReadTime />
          <BlogCard post={chakraPost} showAuthor showReadTime />
          <BlogCard post={mindfulnessPost} showAuthor showReadTime />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={noImagePost} showAuthor showReadTime />
          <BlogCard post={minimalPost} showAuthor={false} showReadTime={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Edge Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={longTitlePost} showAuthor showReadTime />
          <BlogCard post={shortExcerptPost} showAuthor showReadTime />
          <BlogCard post={noCategoryPost} showAuthor showReadTime />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Metadata Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={samplePost} showAuthor showReadTime />
          <BlogCard post={samplePost} showAuthor={false} showReadTime />
          <BlogCard post={samplePost} showAuthor showReadTime={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all blog card states and variations.',
      },
    },
  },
};

/**
 * Mobile view (narrow container)
 */
export const MobileView: Story = {
  args: {
    post: samplePost,
    showAuthor: true,
    showReadTime: true,
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
        story: 'Blog card optimized for mobile viewports.',
      },
    },
  },
};

/**
 * Tablet view (medium container)
 */
export const TabletView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-3xl">
      <BlogCard post={samplePost} showAuthor showReadTime />
      <BlogCard post={chakraPost} showAuthor showReadTime />
      <BlogCard post={mindfulnessPost} showAuthor showReadTime />
      <BlogCard post={crystalPost} showAuthor showReadTime />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Blog cards in a 2-column grid for tablet viewports.',
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ozean Licht Magazine</h2>
          <p className="text-[var(--muted-foreground)] text-lg">
            Explore wisdom, insights, and spiritual guidance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard post={samplePost} showAuthor showReadTime />
          <BlogCard post={chakraPost} showAuthor showReadTime />
          <BlogCard post={mindfulnessPost} showAuthor showReadTime />
          <BlogCard post={crystalPost} showAuthor showReadTime />
          <BlogCard post={longTitlePost} showAuthor showReadTime />
          <BlogCard post={noImagePost} showAuthor showReadTime />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Blog cards displayed on cosmic dark background with Ozean Licht branding.',
      },
    },
  },
};

/**
 * Featured post layout (large card)
 */
export const FeaturedPost: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <BlogCard
            post={longTitlePost}
            showAuthor
            showReadTime
            className="border-2 border-primary shadow-[0_0_30px_rgba(14,194,188,0.4)]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard post={samplePost} showAuthor showReadTime />
        <BlogCard post={chakraPost} showAuthor showReadTime />
        <BlogCard post={mindfulnessPost} showAuthor showReadTime />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Featured blog post with custom styling followed by regular posts.',
      },
    },
  },
};

/**
 * Category-based filtering demo
 */
export const CategoryFiltering: Story = {
  render: () => {
    const categories = ['All', 'Meditation', 'Energy Work', 'Mindfulness', 'Crystals', 'Wellness', 'Transformation'];
    const posts = [samplePost, chakraPost, mindfulnessPost, crystalPost, noImagePost, longTitlePost];

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} showAuthor showReadTime />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Blog cards with category filter buttons (visual demo, non-functional).',
      },
    },
  },
};
