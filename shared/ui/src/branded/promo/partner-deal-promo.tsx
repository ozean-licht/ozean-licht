'use client'

import Link from 'next/link'
import { CtaButton } from '../cta-button'
import { SpanBadge } from '../span-badge'
import { SpanDesign } from '../span-design'

export interface PartnerDealPromoProps {
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
   * Top decorative badge text
   */
  topBadgeText?: string
  /**
   * Feature badges
   */
  badges?: Array<{ icon: string; text: string }>
  /**
   * Custom className for the section
   */
  className?: string
}

export function PartnerDealPromo({
  imageUrl = '/images/partner-deal-cover.webp',
  title = 'Partner Special Deal',
  description = 'Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?\nDieses Angebot ist für euch!',
  buttonText = 'Zum Partner Deal →',
  buttonHref = '/partner-deal',
  topBadgeText = 'Für deinen Seelenpartner',
  badges = [
    { icon: 'heart', text: 'Gemeinsam Wachsen' },
    { icon: 'users', text: 'Für Paare' },
    { icon: 'sparkles', text: 'Sonderpreis' },
  ],
  className = '',
}: PartnerDealPromoProps) {
  return (
    <section className={`w-full py-20 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <SpanDesign>{topBadgeText}</SpanDesign>
        </div>

        <h2 className="font-cinzel-decorative text-4xl md:text-5xl text-white mb-6">{title}</h2>

        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {badges.map((badge, index) => (
            <SpanBadge key={index} icon={badge.icon} text={badge.text} />
          ))}
        </div>

        <div className="mb-8">
          <div
            className="inline-block p-2 rounded-3xl border-2"
            style={{ backgroundColor: '#00151A', borderColor: '#052a2a' }}
          >
            <img
              src={imageUrl}
              alt={`${title} - Happy couple`}
              className="w-full max-w-[600px] h-auto rounded-2xl object-cover"
            />
          </div>
        </div>

        <Link href={buttonHref}>
          <CtaButton>{buttonText}</CtaButton>
        </Link>
      </div>
    </section>
  )
}
