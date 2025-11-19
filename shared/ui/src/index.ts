/**
 * @ozean-licht/shared-ui
 *
 * Four-tier component system:
 * - Tier 0: Custom Primitives - Custom minimal building blocks
 * - Tier 1: Primitives - ShadCN, MagicUI & CossUI base components
 * - Tier 2: Branded - Ozean Licht branded components
 * - Tier 3: Compositions - Complex sections combining multiple components
 */

// Tier 0: Export custom primitives
export * from './primitives'

// Tier 1: Export primitive libraries (ShadCN + MagicUI + CossUI)
export * from './ui'
export * from './magicui'
export * from './cossui'

// Tier 2: Export branded Ozean Licht components
export * from './branded'

// Tier 3: Export compositions (complex sections)
// TEMPORARILY DISABLED - compositions have import errors that need fixing
// export * from './compositions'

// Export utilities
export * from './utils'

// Export hooks
export * from './hooks'