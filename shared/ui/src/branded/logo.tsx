import * as React from 'react'
import { cn } from '../utils'

/**
 * KeyCode variants based on the Soul Code Codex system.
 * Each code carries a specific energetic signature for transformation and spiritual growth.
 */
export type LogoKeyCode = 'master-key' | 'sovereign-key' | 'protection-key' | 'central-logo'

/**
 * Logo size variants aligned with available resolution presets.
 */
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Logo variant determines whether to show the symbol only or include text.
 */
export type LogoVariant = 'symbol' | 'with-text' | 'sidebar'

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * KeyCode variant - each represents different consciousness levels.
   * - **master-key**: Highest detail, main headers, large banners (🔑)
   * - **sovereign-key**: Inner authority, documents, certificates (👑)
   * - **protection-key**: Energetic protection, app icons, social media (🛡️)
   * - **central-logo**: Simplified essence, favicons, small icons (⭕)
   */
  keycode?: LogoKeyCode

  /**
   * Logo size based on use case.
   * - **xs**: 180px - Thumbnails, small icons
   * - **sm**: 360px - Social media profiles
   * - **md**: 720px - Web standard (default)
   * - **lg**: 1280px - HD displays
   * - **xl**: 1920px - Full HD, large banners
   */
  size?: LogoSize

  /**
   * Variant determines logo appearance.
   * - **symbol**: KeyCode symbol only
   * - **with-text**: KeyCode with "Ozean Licht Akademie" text
   * - **sidebar**: Optimized horizontal layout for sidebars
   */
  variant?: LogoVariant

  /**
   * Alt text for accessibility.
   */
  alt?: string

  /**
   * Whether to add glow effect (only applicable to central-logo).
   */
  glow?: boolean
}

const sizeMap: Record<LogoSize, number> = {
  xs: 180,
  sm: 360,
  md: 720,
  lg: 1280,
  xl: 1920,
}

/**
 * Get the logo file path based on props.
 */
function getLogoPath({ keycode = 'central-logo', size = 'md', variant = 'symbol', glow = false }: Pick<LogoProps, 'keycode' | 'size' | 'variant' | 'glow'>): string {
  const pixelSize = sizeMap[size]

  // Sidebar variant uses specific file
  if (variant === 'sidebar') {
    return '/logos/00_With_Text/Ozean_Licht_Akadmie_Sidebar_1530px.webp'
  }

  // With text variant
  if (variant === 'with-text') {
    // For now, use the 720px version as base
    if (pixelSize <= 360) {
      return '/logos/00_With_Text/PNG/Ozean_Licht_Akadmie_360px.png'
    } else if (pixelSize <= 720) {
      return '/logos/00_With_Text/PNG/Ozean_Licht_Akadmie_720px.png'
    } else if (pixelSize <= 1280) {
      return '/logos/00_With_Text/PNG/Ozean_Licht_Akadmie_1280px.png'
    } else {
      return '/logos/00_With_Text/PNG/Ozean_Licht_Akadmie_1920px.png'
    }
  }

  // Symbol-only variants
  switch (keycode) {
    case 'central-logo':
      const glowSuffix = glow ? '_Glow' : ''
      return `/logos/04_Central_Logo/PNG/Central_Logo${glowSuffix}_${pixelSize}px.png`

    case 'master-key':
      return `/logos/01_Master_Key/PNG/Master_Key_${pixelSize}px.png`

    case 'sovereign-key':
      return `/logos/02_Sovereign_Key/PNG/Sovereign_Key_${pixelSize}px.png`

    case 'protection-key':
      return `/logos/03_Protection_Key/PNG/Protection_Key_${pixelSize}px.png`

    default:
      return `/logos/04_Central_Logo/PNG/Central_Logo_720px.png`
  }
}

/**
 * Get responsive dimensions for the logo based on size and variant.
 */
function getLogoDimensions({ size = 'md', variant = 'symbol' }: Pick<LogoProps, 'size' | 'variant'>): { width: number; height: number } {
  const pixelSize = sizeMap[size]

  if (variant === 'sidebar') {
    // Sidebar logos are wider
    const baseHeight = pixelSize / 3
    return { width: pixelSize * 1.2, height: baseHeight }
  }

  if (variant === 'with-text') {
    // With text logos have different aspect ratios
    return { width: pixelSize, height: pixelSize * 0.4 }
  }

  // Symbol-only logos are square
  return { width: pixelSize, height: pixelSize }
}

/**
 * Ozean Licht Logo Component
 *
 * Displays the sacred geometry KeyCode logos from the Soul Code Codex system.
 * Each KeyCode represents different consciousness levels and vibrational frequencies,
 * carrying specific energetic signatures for transformation and spiritual growth.
 *
 * @example
 * ```tsx
 * // Central logo (default)
 * <Logo />
 *
 * // Master Key with text
 * <Logo keycode="master-key" variant="with-text" size="lg" />
 *
 * // Protection Key with glow
 * <Logo keycode="central-logo" glow size="md" />
 *
 * // Sidebar variant
 * <Logo variant="sidebar" size="sm" />
 * ```
 */
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ keycode = 'central-logo', size = 'md', variant = 'symbol', alt, glow = false, className, ...props }, ref) => {
    const logoPath = getLogoPath({ keycode, size, variant, glow })
    const { width, height } = getLogoDimensions({ size, variant })

    const defaultAlt = variant === 'with-text' || variant === 'sidebar'
      ? 'Ozean Licht Akademie Logo'
      : `Ozean Licht ${keycode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <img
          src={logoPath}
          alt={alt || defaultAlt}
          width={width}
          height={height}
          className={cn(
            'object-contain',
            glow && 'drop-shadow-[0_0_20px_rgba(14,194,188,0.5)]'
          )}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    )
  }
)

Logo.displayName = 'Logo'
