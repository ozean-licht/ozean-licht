'use client'

import { SpanBadge } from '../span-badge'
import { CtaButton } from '../cta-button'

export interface BookPromoProps {
  /**
   * Book cover image URL
   */
  bookImageUrl?: string
  /**
   * Book title
   */
  title?: string
  /**
   * Book description
   */
  description?: string
  /**
   * Primary button text
   */
  buttonText?: string
  /**
   * Primary button URL or onClick handler
   */
  buttonHref?: string
  /**
   * Secondary link text (e.g., "English version")
   */
  secondaryLinkText?: string
  /**
   * Secondary link URL
   */
  secondaryLinkHref?: string
  /**
   * Badge text
   */
  badgeText?: string
  /**
   * Custom className for the section
   */
  className?: string
}

export function BookPromo({
  bookImageUrl = '/images/book-promo-cover.webp',
  title = 'Kosmische Codes',
  description = 'Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem Tiefschlaf erweckt und dir deine Kraft zurückgibt.',
  buttonText = 'Auf Amazon Bestellen',
  buttonHref = 'https://www.amazon.de/dp/B0DCJJCGY6',
  secondaryLinkText = 'Englische Version bestellen',
  secondaryLinkHref = 'https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6',
  badgeText = 'Alles, was du nie wissen solltest',
  className = '',
}: BookPromoProps) {
  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Book Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
              <img
                src={bookImageUrl}
                alt={`${title} book cover`}
                className="w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <SpanBadge icon="sparkle" text={badgeText} />

            <h2 className="font-cinzel-decorative text-4xl md:text-5xl text-white leading-tight">
              {title}
            </h2>

            <p className="text-gray-300 font-montserrat-alt text-lg leading-relaxed">
              {description}
            </p>

            <div className="space-y-4">
              <a href={buttonHref} target="_blank" rel="noopener noreferrer">
                <CtaButton>{buttonText}</CtaButton>
              </a>
              {secondaryLinkText && secondaryLinkHref && (
                <p className="text-gray-400 font-montserrat-alt text-sm">
                  Oder{' '}
                  <a
                    href={secondaryLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    {secondaryLinkText}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
