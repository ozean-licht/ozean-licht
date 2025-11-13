const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    // Storybook files
    path.join(__dirname, './config/**/*.{js,ts,jsx,tsx}'),
    // Apps components (from root)
    path.join(__dirname, '../apps/admin/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '../apps/ozean-licht/**/*.{js,ts,jsx,tsx}'),
    // Shared UI components (primary source)
    path.join(__dirname, '../shared/ui/src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        // Ozean Licht Primary (Turquoise/Teal)
        primary: {
          DEFAULT: '#0ec2bc',
          50: '#E6F8F7',
          100: '#CCF1F0',
          200: '#99E3E1',
          300: '#66D5D2',
          400: '#33C7C3',
          500: '#0ec2bc',
          600: '#0BA09A',
          700: '#087E78',
          800: '#065C56',
          900: '#033A34',
          foreground: '#FFFFFF',
        },
        // Cosmic background
        background: '#0A0F1A',
        foreground: '#FFFFFF',
        // Muted colors
        muted: {
          DEFAULT: '#64748B',
          foreground: '#94A3B8',
        },
        // Card colors
        card: {
          DEFAULT: '#1A1F2E',
          foreground: '#FFFFFF',
        },
        // Popover
        popover: {
          DEFAULT: '#1A1F2E',
          foreground: '#FFFFFF',
        },
        // Border
        border: '#2A2F3E',
        input: '#2A2F3E',
        ring: '#0ec2bc',
        // Semantic colors
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#000000',
        },
        info: {
          DEFAULT: '#3B82F6',
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
        'cosmic-gradient': 'linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)',
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
