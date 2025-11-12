/**
 * Ozean Licht Visual Effects Tokens
 *
 * SOURCE OF TRUTH: /apps/ozean-licht/tailwind.config.js + globals.css
 * Glass morphism, animations, gradients from the ACTUAL production app.
 *
 * @package @ozean-licht/shared-ui
 */

export const ozeanLichtEffects = {
  // Glass morphism effects
  // SOURCE: /apps/ozean-licht/app/globals.css .glass-card utilities
  glass: {
    /**
     * Standard Glass Card (.glass-card)
     */
    card: {
      background: 'rgba(10, 26, 26, 0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(24, 134, 137, 0.25)',
    },
    /**
     * Strong Glass Card (.glass-card-strong)
     */
    cardStrong: {
      background: 'rgba(10, 26, 26, 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(24, 134, 137, 0.3)',
    },
    /**
     * Subtle Glass Card (.glass-subtle)
     */
    cardSubtle: {
      background: 'rgba(10, 26, 26, 0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(24, 134, 137, 0.15)',
    },
    /**
     * Glass Hover Effect (.glass-hover)
     */
    hover: {
      transition: 'all 0.3s ease',
      borderColor: 'rgba(24, 134, 137, 0.4)',
      boxShadow: '0 0 20px rgba(24, 134, 137, 0.15)',
    },
  },

  // Shadow effects
  shadows: {
    /**
     * Glow Effect - Turquoise glow for primary elements
     */
    glow: {
      small: '0 0 10px rgba(14, 194, 188, 0.3)',
      medium: '0 0 20px rgba(14, 194, 188, 0.3)',
      large: '0 0 30px rgba(14, 194, 188, 0.6)',
    },
    /**
     * Text Shadow - Ethereal text glow (used on h1, h2)
     */
    text: {
      h1: '0 0 8px rgba(255, 255, 255, 0.60)',
      h2: '0 0 8px rgba(255, 255, 255, 0.42)',
    },
  },

  // Background Gradients
  // SOURCE: /apps/ozean-licht/tailwind.config.js
  gradients: {
    /**
     * Cosmic Gradient - Main background gradient
     */
    cosmic: 'linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)',
    /**
     * Radial Gradient - For spotlights and focal points
     */
    radial: 'radial-gradient(var(--tw-gradient-stops))',
    /**
     * Conic Gradient - For circular effects
     */
    conic: 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  },

  // Animations
  // SOURCE: /apps/ozean-licht/tailwind.config.js + globals.css
  animations: {
    /**
     * Glow Animation - Pulsing glow effect (2s duration)
     */
    glow: {
      name: 'glow',
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      direction: 'alternate',
      keyframes: {
        '0%': { boxShadow: '0 0 20px rgba(14, 194, 188, 0.3)' },
        '100%': { boxShadow: '0 0 30px rgba(14, 194, 188, 0.6)' },
      },
    },
    /**
     * Float Animation - Gentle floating motion (6s duration)
     */
    float: {
      name: 'float',
      duration: '6s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
      },
    },
    /**
     * Shine Animation - Shimmer effect (2s duration)
     */
    shine: {
      name: 'shine',
      duration: '2s',
      timing: 'linear',
      iteration: 'infinite',
      keyframes: {
        '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
        '100%': { transform: 'translateX(200%) skewX(-12deg)' },
      },
    },
    /**
     * Accordion Animations - For collapsible content
     */
    accordionDown: {
      name: 'accordion-down',
      duration: '0.2s',
      timing: 'ease-out',
      keyframes: {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
    },
    accordionUp: {
      name: 'accordion-up',
      duration: '0.2s',
      timing: 'ease-out',
      keyframes: {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    /**
     * Ticker Scroll Animations - From globals.css for scrolling content
     */
    scrollLeft: {
      name: 'scroll-left',
      keyframes: {
        '0%': { transform: 'translateX(0%)' },
        '100%': { transform: 'translateX(-100%)' },
      },
    },
    scrollRight: {
      name: 'scroll-right',
      keyframes: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0%)' },
      },
    },
    /**
     * Spin Animation - From globals.css for loading spinners
     */
    spin: {
      name: 'spin',
      keyframes: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
    },
  },

  // Border Radius
  // SOURCE: /apps/ozean-licht/tailwind.config.js
  radius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',  // Fully rounded
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
    glass: 'all 0.3s ease',  // For glass hover effects
  },
} as const;

export type OzeanLichtEffects = typeof ozeanLichtEffects;
