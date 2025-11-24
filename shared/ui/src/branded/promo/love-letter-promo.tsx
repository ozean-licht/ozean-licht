'use client'

import Link from 'next/link'
import { SpanBadge } from '../span-badge'
import { CtaButton } from '../cta-button'

export interface LoveLetterPromoProps {
  /**
   * Promo image URL
   */
  imageUrl?: string
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
   * Custom className for the section
   */
  className?: string
}

export function LoveLetterPromo({
  imageUrl = '/images/love-letter-promo.webp',
  title = 'Love Letter',
  description = 'Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen Raum – wie eine Botschaft aus der kosmischen Heimat.',
  buttonText = 'Beitrag einreichen →',
  buttonHref = '/love-letter',
  badges = [
    { icon: 'moon', text: 'Alle 3 Monde' },
    { icon: 'star', text: 'Community Beiträge' },
    { icon: 'heart', text: 'Love to Go' },
  ],
  className = '',
}: LoveLetterPromoProps) {
  return (
    <section className={`w-full py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Static Image */}
          <div>
            <div
              className="p-2 rounded-xl border border-border"
              style={{ backgroundColor: '#00151A' }}
            >
              <img
                src={imageUrl}
                alt={`${title} promo`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right side - Content */}
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
              <Link href={buttonHref}>
                <CtaButton>{buttonText}</CtaButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
