/**
 * Shared UI Compositions Export
 *
 * Tier 3 composition components that combine Tier 1 (shadcn + Catalyst)
 * and Tier 2 (branded components) into ready-to-use patterns.
 *
 * @example
 * import { CourseCard, LoginForm, DashboardLayout } from '@ozean-licht/shared-ui/compositions'
 */

// ==================== Types ====================
export type * from './types'

// ==================== Cards ====================
export { CourseCard } from './cards/CourseCard'
export { TestimonialCard } from './cards/TestimonialCard'
export { PricingCard } from './cards/PricingCard'
export { BlogCard } from './cards/BlogCard'
export { FeatureCard } from './cards/FeatureCard'
export { StatsCard } from './cards/StatsCard'

// ==================== Sections ====================
export { CTASection } from './sections/CTASection'
export { HeroSection } from './sections/HeroSection'
export { FeatureSection } from './sections/FeatureSection'
export { TestimonialsSection } from './sections/TestimonialsSection'
export { PricingSection } from './sections/PricingSection'

// ==================== Forms ====================
export { LoginForm } from './forms/LoginForm'
export { RegisterForm } from './forms/RegisterForm'
export { PasswordResetForm } from './forms/PasswordResetForm'
export { MagicLinkForm } from './forms/MagicLinkForm'
export { ContactForm } from './forms/ContactForm'

// ==================== Layouts ====================
export { DashboardLayout } from './layouts/DashboardLayout'
export { MarketingLayout } from './layouts/MarketingLayout'
export { AuthLayout } from './layouts/AuthLayout'
