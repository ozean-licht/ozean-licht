/**
 * Design Tokens
 *
 * SOURCE OF TRUTH: /apps/ozean-licht/tailwind.config.js + globals.css
 *
 * Complete design token system for both brands:
 * - Ozean Licht: Production-ready, validated design key (REAL branding from production app)
 * - Kids Ascension: Experimental placeholder only
 *
 * Usage:
 * ```typescript
 * // Ozean Licht tokens (RECOMMENDED)
 * import { ozeanLichtTokens, ozeanLichtColors, ozeanLichtTypography } from '@ozean-licht/shared-ui/tokens'
 *
 * // Kids Ascension tokens (EXPERIMENTAL - DO NOT USE IN PRODUCTION)
 * import { kidsAscensionTokens } from '@ozean-licht/shared-ui/tokens'
 * ```
 *
 * @package @ozean-licht/shared-ui
 */

// ===================================================================
// Ozean Licht Tokens (PRODUCTION READY)
// SOURCE: /apps/ozean-licht/ (actual production app)
// ===================================================================
export * from './ozean-licht';

// ===================================================================
// Kids Ascension Tokens (EXPERIMENTAL - NOT PRODUCTION READY)
// ===================================================================
export * from './kids-ascension';

/**
 * Design system version
 */
export const VERSION = '0.2.0'  // Updated to reflect real OL branding integration

/**
 * Default export: Ozean Licht tokens (production-ready)
 */
import { ozeanLichtColors } from './ozean-licht/colors';
import { ozeanLichtTypography } from './ozean-licht/typography';
import { ozeanLichtEffects } from './ozean-licht/effects';
import { ozeanLichtSpacing } from './ozean-licht/spacing';

export const tokens = {
  colors: ozeanLichtColors,
  typography: ozeanLichtTypography,
  effects: ozeanLichtEffects,
  spacing: ozeanLichtSpacing,
} as const
