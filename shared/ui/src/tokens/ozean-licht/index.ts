/**
 * Ozean Licht Design Tokens
 *
 * Complete design token system for Ozean Licht brand.
 * Includes colors, typography, effects, and spacing.
 *
 * Usage:
 * ```typescript
 * import { ozeanLichtTokens } from '@/tokens/ozean-licht'
 *
 * const primaryColor = ozeanLichtTokens.colors.primary.DEFAULT
 * const heading = ozeanLichtTokens.typography.scale.h1
 * ```
 *
 * @see /opt/ozean-licht-ecosystem/BRANDING.md for complete brand guidelines
 */

export { ozeanLichtColors } from './colors';
export { ozeanLichtTypography } from './typography';
export { ozeanLichtEffects } from './effects';
export { ozeanLichtSpacing } from './spacing';

import { ozeanLichtColors } from './colors';
import { ozeanLichtTypography } from './typography';
import { ozeanLichtEffects } from './effects';
import { ozeanLichtSpacing } from './spacing';

/**
 * Complete Ozean Licht token system
 */
export const ozeanLichtTokens = {
  colors: ozeanLichtColors,
  typography: ozeanLichtTypography,
  effects: ozeanLichtEffects,
  spacing: ozeanLichtSpacing,
} as const;

export type OzeanLichtTokens = typeof ozeanLichtTokens;

/**
 * Brand metadata
 */
export const ozeanLichtBrand = {
  name: 'Ozean Licht',
  version: '0.1.0',
  description: 'Spiritual content platform and admin dashboard',
  mission: 'Facilitate spiritual awakening and personal transformation',
  values: ['Clarity', 'Depth', 'Transformation', 'Community', 'Authenticity'],
  fonts: {
    display: 'Cinzel Decorative',
    serif: 'Cinzel',
    sans: 'Montserrat',
    alt: 'Montserrat Alternates',
  },
  primaryColor: '#0ec2bc',
  theme: 'dark-cosmic',
} as const;
