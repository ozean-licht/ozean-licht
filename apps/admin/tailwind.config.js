/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../shared/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // === OFFICIAL OZEAN LICHT DESIGN SYSTEM ===
        // Source: /design-system.md v2.1.0

        // Primary - Turquoise (Main brand color)
        primary: {
          DEFAULT: '#0ec2bc',
          50: '#E6F9F8',
          100: '#CCF3F1',
          200: '#99E7E3',
          300: '#66DBD5',
          400: '#33CFC7',
          500: '#0ec2bc',
          600: '#0B9B96',
          700: '#087470',
          800: '#055D75',  // Muted accent
          900: '#033B4D',
          foreground: '#FFFFFF',
        },

        // Backgrounds
        background: '#00070F',           // Main background (deep ocean)
        foreground: '#FFFFFF',

        // Secondary background (badges, spans, highlights)
        secondaryBackground: '#001e1f',

        // Card (elevated surfaces)
        card: {
          DEFAULT: '#00111A',
          foreground: '#FFFFFF',
        },

        // Popover
        popover: {
          DEFAULT: '#00111A',
          foreground: '#FFFFFF',
        },

        // Muted colors
        muted: {
          DEFAULT: '#055D75',       // Muted accent (secondary actions)
          foreground: '#C4C8D4',    // Paragraph text
        },

        // Accent (hover states)
        accent: {
          DEFAULT: '#00111A',
          foreground: '#FFFFFF',
        },

        // Border
        border: '#0E282E',              // Card borders, dividers
        input: '#0E282E',
        ring: '#0ec2bc',

        // Semantic colors
        destructive: {
          DEFAULT: '#EF4444',       // Red - errors, delete
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',       // Green - success
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',       // Amber - warnings
          foreground: '#000000',
        },
        info: {
          DEFAULT: '#3B82F6',       // Blue - info
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        decorative: ['Cinzel Decorative', 'Georgia', 'serif'],
        alt: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #00070F 0%, #00111A 50%, #00070F 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 2s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 194, 188, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 194, 188, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
