'use client'

import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { cn } from '../../utils/cn'
import type { CTASectionProps } from '../types'

export function CTASection({
  title,
  subtitle,
  tags,
  ctaText = 'Get Started',
  ctaHref,
  onCTAClick,
  videoSources,
  socialLinks,
  className,
}: CTASectionProps) {
  return (
    <section className={cn('relative h-auto flex items-center justify-center overflow-hidden max-w-[1000px] mx-auto rounded-[40px] border border-[var(--border)]', className)}>
      {videoSources && (
        <>
          {videoSources.desktop && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 hidden lg:block rounded-[40px]">
              <source src={videoSources.desktop} type="video/mp4" />
            </video>
          )}
          {videoSources.tablet && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block lg:hidden rounded-[40px]">
              <source src={videoSources.tablet} type="video/mp4" />
            </video>
          )}
          {videoSources.mobile && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 block md:hidden rounded-[40px]">
              <source src={videoSources.mobile} type="video/mp4" />
            </video>
          )}
        </>
      )}
      
      <div className="absolute inset-0 bg-[var(--background)] opacity-80 z-10 rounded-[40px]" />
      
      <div className="relative z-20 w-full py-20 px-6 text-center">
        {subtitle && (
          <div className="mb-8">
            <Badge variant="default">{subtitle}</Badge>
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-decorative text-white mb-12 text-balance"
            style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.42)' }}>
          {title}
        </h2>
        
        {tags && tags.length > 0 && (
          <div className="mb-12 space-y-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {tags.map((tag, idx) => (
                <div key={idx} className="glass-card-strong rounded-full px-6 py-3">
                  <span className="text-white font-alt text-sm md:text-base">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-16">
          {ctaHref ? (
            <a href={ctaHref}>
              <Button variant="cta" size="lg" className="text-xl px-12 py-6">{ctaText}</Button>
            </a>
          ) : (
            <Button variant="cta" size="lg" onClick={onCTAClick} className="text-xl px-12 py-6">{ctaText}</Button>
          )}
        </div>
        
        {socialLinks && socialLinks.length > 0 && (
          <div className="relative w-full overflow-visible flex flex-col items-center space-y-6">
            <p className="text-white/80 font-alt text-lg">Du findest uns auch auf</p>
            <div className="flex items-center space-x-8">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
                >
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', link.iconBg || 'bg-primary')}>
                    {link.icon}
                  </div>
                  <span className="font-alt">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

CTASection.displayName = 'CTASection'
