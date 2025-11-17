/**
 * Ozean Licht Spacing Tokens
 *
 * Consistent spacing scale for Ozean Licht components.
 * Based on 8px base unit for mathematical harmony.
 *
 * @see /opt/ozean-licht-ecosystem/BRANDING.md for complete brand guidelines
 */

export const ozeanLichtSpacing = {
  // Base spacing scale (8px base unit)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem',    // 256px
  },

  // Component-specific spacing
  component: {
    // Padding
    padding: {
      button: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      card: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
      input: {
        sm: '0.5rem 0.75rem',
        md: '0.625rem 1rem',
        lg: '0.75rem 1.25rem',
      },
    },

    // Margin
    margin: {
      section: {
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
        xl: '6rem',
      },
      element: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
      },
    },

    // Gap (for flex/grid)
    gap: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },

  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Max widths
  maxWidth: {
    xs: '20rem',    // 320px
    sm: '24rem',    // 384px
    md: '28rem',    // 448px
    lg: '32rem',    // 512px
    xl: '36rem',    // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
    full: '100%',
  },

  // Heights
  height: {
    header: '4rem',    // 64px
    footer: '6rem',    // 96px
    hero: '32rem',     // 512px
    section: '40rem',  // 640px
  },
} as const;

export type OzeanLichtSpacing = typeof ozeanLichtSpacing;
