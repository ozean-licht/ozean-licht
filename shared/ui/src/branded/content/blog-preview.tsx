'use client'

import Link from 'next/link'
import { SpanDesign } from '../span-design'
import { BlogItem } from '../blog-item'
import { CtaButton } from '../cta-button'

export interface BlogPost {
  slug: string
  title: string
  category: string
  published_at: string
  read_time_minutes: number
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  excerpt: string
}

export interface BlogPreviewProps {
  /**
   * Array of blog posts to display (max 5 recommended)
   */
  blogPosts?: BlogPost[]
  /**
   * Title for the section
   */
  title?: string
  /**
   * Description text below the title
   */
  description?: string
  /**
   * Text for the "view all" button
   */
  viewAllText?: string
  /**
   * URL for the "view all" button link
   */
  viewAllHref?: string
  /**
   * Message when no blogs are available
   */
  emptyMessage?: string
  /**
   * Custom className for the section
   */
  className?: string
}

export function BlogPreview({
  blogPosts = [],
  title = 'Unser Magazin',
  description = 'Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.',
  viewAllText = 'Alle Artikel ansehen →',
  viewAllHref = '/magazine',
  emptyMessage = 'Aktuell sind keine Artikel verfügbar. Schau bald wieder vorbei!',
  className = '',
}: BlogPreviewProps) {
  return (
    <section className={`py-20 px-4 max-w-7xl mx-auto ${className}`}>
      {/* Header with decorative elements */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <SpanDesign>Artikel zum Lesen</SpanDesign>
        </div>

        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide lg:text-5xl">
          {title}
        </h2>

        <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
          {description}
        </p>
      </div>

      {/* Blog posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => <BlogItem key={post.slug} blog={post} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="text-white/70 text-lg">{emptyMessage}</div>
          </div>
        )}
      </div>

      {/* View all link */}
      {blogPosts.length > 0 && (
        <div className="text-center mt-12">
          <Link href={viewAllHref}>
            <CtaButton>{viewAllText}</CtaButton>
          </Link>
        </div>
      )}
    </section>
  )
}
