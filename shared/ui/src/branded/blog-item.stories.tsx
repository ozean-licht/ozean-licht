import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BlogItem } from './blog-item';

/**
 * BlogItem - Blog article card component.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Aspect Ratio Image**: 16:9 aspect ratio for thumbnails
 * - **Hover Effects**: Scale image and color change on hover
 * - **Category Badge**: Uses SpanBadge component
 * - **Author Info**: Shows author avatar and name
 * - **Read Time**: Displays estimated reading time
 * - **Link Integration**: Wraps in Next.js Link component
 *
 * ## Blog Object Structure
 * - slug: string - URL slug for blog post
 * - title: string - Blog post title
 * - category: string - Blog category
 * - published_at: string - Publication date (ISO format)
 * - read_time_minutes: number - Estimated read time
 * - thumbnail_url_desktop?: string - Desktop thumbnail
 * - thumbnail_url_mobile?: string - Mobile thumbnail
 * - description?: string - Post excerpt
 * - author?: string - Author name (defaults to "Lia Lohmann")
 * - author_image_url?: string - Author avatar URL
 *
 * ## Usage
 * Use for displaying blog posts in magazine sections or blog listings.
 */
const meta = {
  title: 'Tier 2: Branded/BlogItem',
  component: BlogItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A blog article card with thumbnail, category, author info, and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BlogItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBlog = {
  slug: 'sample-blog-post',
  title: 'Die Kraft der Meditation im Alltag',
  category: 'Spiritualität',
  published_at: '2024-01-15T10:00:00Z',
  read_time_minutes: 5,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
  description: 'Entdecke wie du Meditation in deinen Alltag integrieren kannst um mehr Ruhe und Klarheit zu finden.',
  author: 'Lia Lohmann',
  author_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
};

/**
 * Default blog item.
 */
export const Default: Story = {
  args: {
    blog: mockBlog,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Blog without thumbnail.
 */
export const WithoutThumbnail: Story = {
  args: {
    blog: {
      ...mockBlog,
      thumbnail_url_desktop: undefined,
      thumbnail_url_mobile: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Blog without author image.
 */
export const WithoutAuthorImage: Story = {
  args: {
    blog: {
      ...mockBlog,
      author_image_url: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Blog with default author (no author specified).
 */
export const DefaultAuthor: Story = {
  args: {
    blog: {
      ...mockBlog,
      author: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long read time.
 */
export const LongRead: Story = {
  args: {
    blog: {
      ...mockBlog,
      title: 'Tiefgehende Analyse spiritueller Praktiken',
      read_time_minutes: 25,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Short read time.
 */
export const QuickRead: Story = {
  args: {
    blog: {
      ...mockBlog,
      title: 'Schnelle Meditation für Zwischendurch',
      read_time_minutes: 2,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long title.
 */
export const LongTitle: Story = {
  args: {
    blog: {
      ...mockBlog,
      title: 'Ein sehr langer Blogtitel der über mehrere Zeilen gehen könnte und zeigt wie die Karte damit umgeht',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long description.
 */
export const LongDescription: Story = {
  args: {
    blog: {
      ...mockBlog,
      description: 'Eine sehr ausführliche Beschreibung die deutlich mehr als zwei Zeilen Text enthält und demonstriert wie der line-clamp-2 Mechanismus funktioniert um den Text auf genau zwei Zeilen zu begrenzen und den Rest abzuschneiden.',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Different categories.
 */
export const Categories: Story = {
  render: () => (
    <div className="space-y-6 max-w-[400px]">
      <BlogItem blog={{ ...mockBlog, category: 'Spiritualität' }} />
      <BlogItem blog={{ ...mockBlog, category: 'Meditation', title: 'Achtsamkeit im Alltag' }} />
      <BlogItem blog={{ ...mockBlog, category: 'Channeling', title: 'Verbindung mit höheren Ebenen' }} />
      <BlogItem blog={{ ...mockBlog, category: 'Persönlichkeit', title: 'Selbstentwicklung' }} />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Blog grid layout.
 */
export const BlogGrid: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-8 py-12">
      <BlogItem blog={{ ...mockBlog, title: 'Meditation Basics', read_time_minutes: 5 }} />
      <BlogItem blog={{ ...mockBlog, title: 'Advanced Channeling', category: 'Channeling', read_time_minutes: 12 }} />
      <BlogItem blog={{ ...mockBlog, title: 'Selbstheilung', category: 'Heilung', read_time_minutes: 8 }} />
      <BlogItem blog={{ ...mockBlog, title: 'Energiearbeit', category: 'Energie', read_time_minutes: 15 }} />
      <BlogItem blog={{ ...mockBlog, title: 'Spirituelle Praxis', category: 'Spiritualität', read_time_minutes: 10 }} />
      <BlogItem blog={{ ...mockBlog, title: 'Achtsamkeit', category: 'Meditation', read_time_minutes: 6 }} />
    </div>
  ),
};
