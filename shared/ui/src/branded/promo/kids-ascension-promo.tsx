'use client'

import Link from 'next/link'
import { SpanBadge } from '../span-badge'
import { CtaButton } from '../cta-button'

export interface KidsAscensionPromoProps {
  /**
   * Section title
   */
  title?: string
  /**
   * Description text
   */
  description?: string
  /**
   * Button text
   */
  buttonText?: string
  /**
   * Button link href
   */
  buttonHref?: string
  /**
   * Feature badges
   */
  badges?: Array<{ icon: string; text: string }>
  /**
   * Images for the upper row (gallery)
   */
  upperImages?: string[]
  /**
   * Images for the lower row (gallery)
   */
  lowerImages?: string[]
  /**
   * Custom className for the section
   */
  className?: string
}

export function KidsAscensionPromo({
  title = 'Kids AscensioN',
  description = 'Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum Leuchten zu bringen.',
  buttonText = 'Zu Kids Ascension →',
  buttonHref = 'https://kids-ascension.org',
  badges = [
    { icon: 'star', text: 'Ganzheitliche Entwicklung' },
    { icon: 'magicwand', text: 'Spirituelle & Magische Schule' },
    { icon: 'lightbulb', text: 'Kreative Entfaltung' },
  ],
  upperImages = [
    '/images/kids-ascension/promo-1.webp',
    '/images/kids-ascension/promo-2.webp',
    '/images/kids-ascension/promo-5.webp',
  ],
  lowerImages = [
    '/images/kids-ascension/promo-3.webp',
    '/images/kids-ascension/promo-4.webp',
    '/images/kids-ascension/promo-6.webp',
  ],
  className = '',
}: KidsAscensionPromoProps) {
  return (
    <section className={`w-full py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel-decorative text-white text-balance">
              {title}
            </h2>

            <p className="text-white/70 font-montserrat-alt text-lg">{description}</p>

            <div className="flex flex-wrap gap-3 flex-col items-start">
              {badges.map((badge, index) => (
                <SpanBadge key={index} icon={badge.icon} text={badge.text} />
              ))}
            </div>

            <div className="pt-4">
              <Link href={buttonHref} target="_blank" rel="noopener noreferrer">
                <CtaButton>{buttonText}</CtaButton>
              </Link>
            </div>
          </div>

          {/* Right side - Image Gallery (simplified, no ticker for now) */}
          <div className="w-full">
            <div
              className="w-full overflow-hidden space-y-2 rounded-[10%] border border-[#0E282E] border-border"
              style={{ backgroundColor: '#00151A', padding: '16px' }}
            >
              {/* Upper row */}
              <div className="grid grid-cols-3 gap-2">
                {upperImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Kids Ascension ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>

              {/* Lower row */}
              <div className="grid grid-cols-3 gap-2">
                {lowerImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Kids Ascension ${index + 4}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Note: Ticker component removed - replace with image carousel/ticker if needed */}
          </div>
        </div>
      </div>
    </section>
  )
}
