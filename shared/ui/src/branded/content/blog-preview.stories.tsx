import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BlogPreview } from './blog-preview'
import type { BlogPost } from './blog-preview'

/**
 * BlogPreview - Magazine section component displaying blog articles.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Responsive Grid**: Adapts from 1 column (mobile) to 3 columns (desktop)
 * - **Decorative Header**: Uses SpanDesign component with section title and description
 * - **Blog Grid**: Displays BlogItem cards in responsive grid layout
 * - **Empty State**: Shows custom message when no blogs are available
 * - **View All Button**: Prominent CTA button to link to full magazine
 * - **Customizable Content**: All text, links, and blog posts are configurable
 *
 * ## Blog Post Structure
 * - slug: string - URL slug for blog post
 * - title: string - Blog post title
 * - category: string - Blog category (Spiritualität, Meditation, etc.)
 * - published_at: string - Publication date (ISO format)
 * - read_time_minutes: number - Estimated read time in minutes
 * - thumbnail_url_desktop?: string - Desktop thumbnail image URL
 * - thumbnail_url_mobile?: string - Mobile thumbnail image URL
 * - excerpt: string - Short preview text of the blog post
 *
 * ## Usage
 * Use for displaying blog articles on landing pages, magazines, or content sections.
 * Customize title, description, and viewAllHref to match page context.
 */
const meta = {
  title: 'Tier 2: Branded/BlogPreview',
  component: BlogPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A magazine section component with responsive grid of blog articles, decorative header, and call-to-action.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title',
      table: {
        defaultValue: { summary: 'Unser Magazin' },
      },
    },
    description: {
      control: 'text',
      description: 'Section description text',
      table: {
        defaultValue: {
          summary:
            'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise...',
        },
      },
    },
    viewAllText: {
      control: 'text',
      description: 'Text for view all button',
      table: {
        defaultValue: { summary: 'Alle Artikel ansehen →' },
      },
    },
    viewAllHref: {
      control: 'text',
      description: 'URL for view all button',
      table: {
        defaultValue: { summary: '/magazine' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message when no blogs available',
      table: {
        defaultValue: { summary: 'Aktuell sind keine Artikel verfügbar. Schau bald wieder vorbei!' },
      },
    },
  },
} satisfies Meta<typeof BlogPreview>

export default meta
type Story = StoryObj<typeof meta>

// Comprehensive mock blog posts with German content and spiritual themes
const mockBlogPosts: BlogPost[] = [
  {
    slug: 'das-kosmische-erwachen',
    title: 'Das kosmische Erwachen: Die Reise zu deinem höheren Selbst',
    category: 'Spiritualität',
    published_at: '2024-11-15T10:30:00Z',
    read_time_minutes: 8,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    excerpt:
      'Entdecke die tiefsten Schichten deines Bewusstseins und verbinde dich mit der universellen Energie. Eine transformative Reise beginnt mit einem einzigen Atemzug.',
  },
  {
    slug: 'meditation-fuer-anfaenger',
    title: 'Meditation für Anfänger: Dein Einstieg ins Hier und Jetzt',
    category: 'Meditation',
    published_at: '2024-11-10T14:45:00Z',
    read_time_minutes: 5,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1493514789a6586cb146fe48f1225e94aebb7e8c?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1493514789a6586cb146fe48f1225e94aebb7e8c?w=400&h=300&fit=crop',
    excerpt:
      'Lerne bewährte Meditationstechniken, die dir helfen, inneren Frieden zu finden und deinen Geist zu klären. Perfekt für Anfänger und alle, die ihre Praxis vertiefen möchten.',
  },
  {
    slug: 'channeling-intuitive-verbindung',
    title: 'Channeling: Die intuitive Verbindung mit höheren Dimensionen',
    category: 'Channeling',
    published_at: '2024-11-05T09:15:00Z',
    read_time_minutes: 12,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1559488789-c4e78e27f476?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1559488789-c4e78e27f476?w=400&h=300&fit=crop',
    excerpt:
      'Erfahre, wie du deine intuitiven Fähigkeiten entwickelst und mit Energien jenseits der physischen Realität kommunizierst. Eine praktische Anleitung zur Aktivierung deiner inneren Gaben.',
  },
  {
    slug: 'heilungsenergie-selbstheilung',
    title: 'Heilungsenergie: Der Weg zur Selbstheilung und inneren Harmonie',
    category: 'Heilung',
    published_at: '2024-10-28T16:20:00Z',
    read_time_minutes: 10,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    excerpt:
      'Tauche ein in die transformative Kraft der Heilungsenergie. Entdecke, wie du körperliche, emotionale und spirituelle Wunden heilen kannst durch bewusstes Energiemanagement.',
  },
  {
    slug: 'bewusstsein-quantenphysik',
    title: 'Bewusstsein trifft Quantenphysik: Die Wissenschaft des Spirituellen',
    category: 'Wissenschaft',
    published_at: '2024-10-20T11:00:00Z',
    read_time_minutes: 15,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    excerpt:
      'Erkunde die faszinierende Schnittstelle zwischen modernem wissenschaftlichen Verständnis und altem spirituellem Wissen. Wie prägt Bewusstsein unsere Realität?',
  },
  {
    slug: 'persoenliche-transformation',
    title: 'Persönliche Transformation: Deine Chance auf Neuanfang',
    category: 'Persönlichkeit',
    published_at: '2024-10-12T13:30:00Z',
    read_time_minutes: 7,
    thumbnail_url_desktop:
      'https://images.unsplash.com/photo-1522316344370-495c06223717?w=800&h=450&fit=crop',
    thumbnail_url_mobile:
      'https://images.unsplash.com/photo-1522316344370-495c06223717?w=400&h=300&fit=crop',
    excerpt:
      'Veränderung beginnt im Inneren. Lerne praktische Strategien für deine persönliche Transformation und erkenne dein volles Potenzial als spirituelles Wesen.',
  },
]

/**
 * Default story with 3 blog posts.
 */
export const Default: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 3),
    title: 'Unser Magazin',
    description:
      'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
    viewAllText: 'Alle Artikel ansehen →',
    viewAllHref: '/magazine',
  },
}

/**
 * Empty state with no blog posts.
 */
export const EmptyState: Story = {
  args: {
    blogPosts: [],
    title: 'Unser Magazin',
    description:
      'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
    emptyMessage: 'Aktuell sind keine Artikel verfügbar. Schau bald wieder vorbei!',
  },
}

/**
 * Single blog post.
 */
export const SinglePost: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 1),
    title: 'Aktueller Artikel',
    description: 'Lies unseren neuesten Beitrag zur spirituellen Entwicklung.',
    viewAllText: 'Zu allen Artikeln →',
  },
}

/**
 * Full grid with 6 blog posts.
 */
export const FullGrid: Story = {
  args: {
    blogPosts: mockBlogPosts,
    title: 'Unser Magazin',
    description:
      'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
    viewAllText: 'Alle Artikel ansehen →',
    viewAllHref: '/magazine',
  },
}

/**
 * Custom title and description.
 */
export const CustomContent: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 4),
    title: 'Spirituelle Erkenntnisse',
    description:
      'Sammlung unserer tiefsten Einsichten in die Natur des Bewusstseins und der energetischen Realität. Jeder Artikel ist ein Schritt auf deinem Weg zur Erleuchtung.',
    viewAllText: 'Zum kompletten Archiv →',
    viewAllHref: '/insights/all',
  },
}

/**
 * Different viewAllHref value.
 */
export const CustomLink: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 3),
    title: 'Unser Magazin',
    description:
      'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
    viewAllText: 'Zum Blog →',
    viewAllHref: '/blog',
  },
}

/**
 * Posts filtered by category - Spirituality focus.
 */
export const SpiritualityFocus: Story = {
  args: {
    blogPosts: mockBlogPosts.filter(
      (post) => post.category === 'Spiritualität' || post.category === 'Meditation'
    ),
    title: 'Spirituelle Praxis',
    description:
      'Praktische Anleitungen und tiefe Einsichten für deine tägliche spirituelle Praxis. Entdecke Methoden, die dein Bewusstsein erweitern.',
    viewAllHref: '/magazine?category=spirituality',
  },
}

/**
 * Posts filtered by category - Advanced topics.
 */
export const AdvancedTopics: Story = {
  args: {
    blogPosts: mockBlogPosts.filter(
      (post) =>
        post.category === 'Channeling' ||
        post.category === 'Heilung' ||
        post.category === 'Wissenschaft'
    ),
    title: 'Fortgeschrittene Themen',
    description:
      'Tiefgehende Erkundung erwiterter spiritueller Konzepte und ihrer Verbindung zur modernen Wissenschaft.',
    viewAllText: 'Alle fortgeschrittenen Artikel →',
    viewAllHref: '/magazine?level=advanced',
  },
}

/**
 * Custom empty message.
 */
export const CustomEmptyMessage: Story = {
  args: {
    blogPosts: [],
    title: 'Kommende Artikel',
    description:
      'Wir arbeiten an neuen und inspirierenden Inhalten für deine spirituelle Reise. Bleib dran!',
    emptyMessage:
      'Neue Artikel werden sehr bald verfügbar sein. Melde dich zu unserem Newsletter an, um keine Aktualisierung zu verpassen!',
  },
}

/**
 * Minimal styling with custom class.
 */
export const MinimalStyle: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 3),
    title: 'Artikel',
    description: 'Lese unsere neuesten spirituellen Beiträge.',
    viewAllText: 'Mehr →',
    className: 'py-12 px-2',
  },
}

/**
 * Large grid showing all categories.
 */
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-24 bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950">
      <BlogPreview
        blogPosts={mockBlogPosts.filter(
          (post) => post.category === 'Spiritualität' || post.category === 'Meditation'
        )}
        title="Grundlagen der Spiritualität"
        description="Starten Sie Ihre spirituelle Reise mit diesen Grundlagenbeiträgen."
        viewAllHref="/magazine?category=spirituality"
      />

      <BlogPreview
        blogPosts={mockBlogPosts.filter(
          (post) =>
            post.category === 'Channeling' ||
            post.category === 'Heilung' ||
            post.category === 'Wissenschaft'
        )}
        title="Fortgeschrittene Praktiken"
        description="Entdecke tiefere Ebenen des spirituellen Verständnisses."
        viewAllHref="/magazine?level=advanced"
      />

      <BlogPreview
        blogPosts={mockBlogPosts}
        title="Alle Artikel"
        description="Das komplette Archiv unserer spirituellen Beiträge."
        viewAllText="Zum vollständigen Magazin →"
        viewAllHref="/magazine"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Interactive controls for all props.
 */
export const Interactive: Story = {
  args: {
    blogPosts: mockBlogPosts.slice(0, 3),
    title: 'Unser Magazin',
    description:
      'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
    viewAllText: 'Alle Artikel ansehen →',
    viewAllHref: '/magazine',
    emptyMessage: 'Keine Artikel verfügbar.',
  },
  argTypes: {
    blogPosts: {
      control: 'object',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    viewAllText: {
      control: 'text',
    },
    viewAllHref: {
      control: 'text',
    },
    emptyMessage: {
      control: 'text',
    },
  },
}
