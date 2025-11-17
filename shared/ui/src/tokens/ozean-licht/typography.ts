/**
 * Ozean Licht Typography Tokens
 *
 * Font families and typography scale for Ozean Licht brand.
 *
 * Fonts:
 * - Cinzel Decorative: Display headings (H1, H2)
 * - Cinzel: Serif headings (H4)
 * - Montserrat: Body text and UI
 * - Montserrat Alternates: Subheadings (H5, H6)
 *
 * @see /opt/ozean-licht-ecosystem/BRANDING.md for complete brand guidelines
 */

export const ozeanLichtTypography = {
  // Font families
  fontFamily: {
    sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
    serif: ['Cinzel', 'Georgia', 'serif'],
    decorative: ['Cinzel Decorative', 'Georgia', 'serif'],
    alt: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
    mono: ['Fira Code', 'Courier New', 'monospace'],
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Typography scale (semantic)
  // SOURCE: /apps/ozean-licht/app/globals.css
  scale: {
    h1: {
      fontSize: '3rem',       // 48px (can go to 4rem for heroes)
      fontWeight: '700',      // Bold
      lineHeight: '1.2',
      fontFamily: 'decorative',
      letterSpacing: '-0.02em',
      textShadow: '0 0 8px rgba(255, 255, 255, 0.60)',  // Ethereal glow
    },
    h2: {
      fontSize: '2.25rem',    // 36px (can go to 3rem)
      fontWeight: '700',      // Bold
      lineHeight: '1.2',
      fontFamily: 'decorative',
      letterSpacing: '-0.01em',
      textShadow: '0 0 8px rgba(255, 255, 255, 0.42)',  // Subtle glow
    },
    h3: {
      fontSize: '1.875rem',   // 30px (can go to 2.25rem)
      fontWeight: '400',      // Regular
      lineHeight: '1.3',
      fontFamily: 'decorative',
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.5rem',     // 24px (can go to 1.875rem)
      fontWeight: '600',      // Semi-bold
      lineHeight: '1.4',
      fontFamily: 'serif',    // Cinzel (not decorative)
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1.25rem',    // 20px (can go to 1.5rem)
      fontWeight: '600',      // Semi-bold
      lineHeight: '1.4',
      fontFamily: 'alt',      // Montserrat Alternates
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1rem',       // 16px (can go to 1.25rem)
      fontWeight: '600',      // Semi-bold
      lineHeight: '1.5',
      fontFamily: 'alt',      // Montserrat Alternates
      letterSpacing: '0',
    },
    bodyL: {
      fontSize: '1.125rem',   // 18px
      fontWeight: '400',      // Regular
      lineHeight: '1.6',
      fontFamily: 'sans',
      letterSpacing: '0',
    },
    bodyM: {
      fontSize: '1rem',       // 16px
      fontWeight: '400',      // Regular
      lineHeight: '1.6',
      fontFamily: 'sans',
      letterSpacing: '0',
    },
    bodyS: {
      fontSize: '0.875rem',   // 14px
      fontWeight: '400',      // Regular
      lineHeight: '1.5',
      fontFamily: 'sans',
      letterSpacing: '0',
    },
    paragraph: {
      fontSize: '1rem',       // 16px
      fontWeight: '300',      // Light (from globals.css)
      lineHeight: '1.7',
      fontFamily: 'sans',
      letterSpacing: '0',
    },
  },
} as const;

export type OzeanLichtTypography = typeof ozeanLichtTypography;
