/**
 * @ozean-licht/shared-ui
 *
 * Shared UI components and design system for the Ozean Licht ecosystem.
 *
 * Three-Tier Architecture:
 * - Tier 1 (Base): shadcn/ui primitives - import from '@ozean-licht/shared-ui/ui'
 * - Tier 2 (Brand): Ozean Licht branded components - import from '@ozean-licht/shared-ui' (default)
 * - Tier 3 (Compositions): Pre-built patterns - import from '@ozean-licht/shared-ui/compositions'
 *
 * Usage:
 * ```typescript
 * // Tier 2: Branded components (default export)
 * import { Button, Card, Badge } from '@ozean-licht/shared-ui';
 *
 * // Tier 1: Base primitives
 * import { Button, Card } from '@ozean-licht/shared-ui/ui';
 *
 * // Design tokens
 * import { ozeanLichtTokens } from '@ozean-licht/shared-ui/tokens';
 *
 * // Styles
 * import '@ozean-licht/shared-ui/styles';
 * ```
 *
 * @version 0.1.0
 * @see /opt/ozean-licht-ecosystem/shared/ui-components/UPGRADE_PLAN.md
 */

// Export Tier 2: Branded components (default)
export * from './components'

// Export utilities
export * from './utils'

// Export design tokens (legacy structure for backward compatibility)
export * as tokens from './tokens'

// Re-export commonly used items
export { cn } from './utils/cn'

/**
 * Package version
 */
export const VERSION = '0.1.0'
