/**
 * Ozean Licht Color Tokens
 *
 * SOURCE OF TRUTH: /apps/ozean-licht/tailwind.config.js
 * These are the ACTUAL production colors from the live Ozean Licht app.
 *
 * Primary: Turquoise (#0ec2bc) - Spiritual awakening, clarity, transformation
 * Background: Cosmic Dark (#0A0F1A) - Mystery, depth, infinite possibility
 *
 * @package @ozean-licht/shared-ui
 */

export const ozeanLichtColors = {
  /**
   * Primary - Turquoise/Teal
   * The signature color of Ozean Licht
   */
  primary: {
    50: '#E6F8F7',
    100: '#CCF1F0',
    200: '#99E3E1',
    300: '#66D5D2',
    400: '#33C7C3',
    500: '#0ec2bc',  // DEFAULT
    600: '#0BA09A',
    700: '#087E78',
    800: '#065C56',
    900: '#033A34',
    DEFAULT: '#0ec2bc',
    foreground: '#FFFFFF',
  },

  /**
   * Background - Cosmic Dark
   * Deep space background for the entire application
   */
  background: {
    DEFAULT: '#0A0F1A',
    foreground: '#FFFFFF',
  },

  /**
   * Foreground - Text Color
   * Primary text color
   */
  foreground: {
    DEFAULT: '#FFFFFF',
  },

  /**
   * Card - Elevated Surfaces
   * Card backgrounds and elevated UI elements
   */
  card: {
    DEFAULT: '#1A1F2E',
    foreground: '#FFFFFF',
  },

  /**
   * Popover - Floating Elements
   * Dropdowns, tooltips, popovers
   */
  popover: {
    DEFAULT: '#1A1F2E',
    foreground: '#FFFFFF',
  },

  /**
   * Muted - Secondary Text
   * Less prominent text and UI elements
   */
  muted: {
    DEFAULT: '#64748B',
    foreground: '#94A3B8',
  },

  /**
   * Border - UI Borders
   * Default border color for inputs, cards, separators
   */
  border: {
    DEFAULT: '#2A2F3E',
  },

  /**
   * Input - Form Elements
   * Input border and focus states
   */
  input: {
    DEFAULT: '#2A2F3E',
  },

  /**
   * Ring - Focus Indicators
   * Focus ring color for accessibility
   */
  ring: {
    DEFAULT: '#0ec2bc',
  },

  /**
   * Semantic Colors - Status & Feedback
   */
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

  /**
   * Glass Card Colors
   * Used for glass morphism effects in globals.css
   */
  glass: {
    background: 'rgba(10, 26, 26, 0.7)',      // Standard glass card
    backgroundStrong: 'rgba(10, 26, 26, 0.8)', // Important cards
    backgroundSubtle: 'rgba(10, 26, 26, 0.5)', // Background cards
    border: 'rgba(24, 134, 137, 0.25)',        // Glass border
    borderHover: 'rgba(24, 134, 137, 0.4)',    // Hover border
  },
} as const;

export type OzeanLichtColors = typeof ozeanLichtColors;
