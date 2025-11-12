/**
 * MarketingLayout Component
 *
 * A marketing site layout with header, footer slots, and flexible content area.
 * Ideal for landing pages, marketing sites, and public-facing pages.
 *
 * @example
 * import { MarketingLayout } from '@ozean-licht/shared-ui/compositions'
 *
 * <MarketingLayout
 *   header={<YourHeader />}
 *   footer={<YourFooter />}
 * >
 *   <YourContent />
 * </MarketingLayout>
 */

'use client'


import { cn } from '../../utils/cn'
import type { MarketingLayoutProps } from '../types'

export function MarketingLayout({
  children,
  header,
  footer,
  className,
}: MarketingLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-[var(--background)] flex flex-col', className)}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 w-full glass-card-strong border-b border-[var(--border)]">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="w-full glass-card border-t border-[var(--border)] mt-auto">
          {footer}
        </footer>
      )}
    </div>
  )
}

MarketingLayout.displayName = 'MarketingLayout'
