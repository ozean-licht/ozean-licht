/** @type {import('tailwindcss').Config} */
export default {
  // Scan for classes in Storybook files and shared/ui components
  content: [
    './.storybook/**/*.{js,jsx,ts,tsx}',
    '../../shared/ui/src/**/*.{js,jsx,ts,tsx}',
  ],

  darkMode: ['class'],

  // Use the same theme as shared/ui
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // shadcn/ui CSS variables (HSL format)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Additional Ozean Licht colors
        // Ozean Licht color palette
        background: '#00070F',           // Deep ocean dark
        secondaryBackground: '#000F1F',  // Badges, spans
        card: '#00111A',                 // Card background
        border: '#0E282E',               // Borders
        mutedAccent: '#055D75',          // Buttons, secondary

        primary: {
          DEFAULT: '#0EA6C1',  // Oceanic cyan
          50: '#E6F7FA',
          100: '#CCF0F5',
          200: '#99E1EB',
          300: '#66D1E1',
          400: '#33C2D7',
          500: '#0EA6C1',
          600: '#0B859A',
          700: '#086473',
          800: '#055D75',
          900: '#033B4D',
          foreground: '#FFFFFF',
        },

        // Semantic colors
        destructive: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',

        // Text colors
        heading: '#FFFFFF',
        paragraph: '#C4C8D4',
      },

      fontFamily: {
        decorative: ['Cinzel Decorative', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        alt: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 166, 193, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 166, 193, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },

      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 2s linear infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};
