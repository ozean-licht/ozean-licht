/**
 * Shared TypeScript interfaces for Tier 3 composition components
 *
 * These types define the data structures used across card, section,
 * form, and layout compositions in the shared UI library.
 */

import type { ReactNode } from 'react'

// ==================== Course Types ====================

export interface Course {
  id: string
  slug: string
  title: string
  description?: string | null
  price: number
  thumbnail_url_desktop?: string | null
  thumbnail_url_mobile?: string | null
  is_available?: boolean
  duration?: string | null
  instructor?: string | null
  created_at?: string
  updated_at?: string
}

export interface CourseCardProps {
  course: Course
  /** Custom className for styling */
  className?: string
  /** Show hover effects */
  hover?: boolean
  /** Show glow effect */
  glow?: boolean
  /** Custom link href (overrides default /courses/[slug]) */
  href?: string
}

// ==================== Testimonial Types ====================

export interface Testimonial {
  id?: string
  name: string
  location?: string
  testimonial: string
  avatar?: string | null
  rating?: number
  date?: string
}

export interface TestimonialCardProps {
  testimonial: Testimonial
  /** Show avatar image */
  showAvatar?: boolean
  /** Show rating stars */
  showRating?: boolean
  /** Custom className for styling */
  className?: string
}

// ==================== Pricing Types ====================

export interface PricingFeature {
  text: string
  included: boolean
  highlight?: boolean
}

export interface PricingTier {
  id?: string
  name: string
  description?: string
  price: number
  currency?: string
  period?: string
  features: PricingFeature[]
  cta?: string
  highlighted?: boolean
  popular?: boolean
}

export interface PricingCardProps {
  tier: PricingTier
  /** Callback when CTA is clicked */
  onCTAClick?: () => void
  /** Custom className for styling */
  className?: string
}

// ==================== Blog Types ====================

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image?: string | null
  author?: string
  date: string
  category?: string
  readTime?: string
}

export interface BlogCardProps {
  post: BlogPost
  /** Custom className for styling */
  className?: string
  /** Show author info */
  showAuthor?: boolean
  /** Show read time */
  showReadTime?: boolean
}

// ==================== Feature Types ====================

export interface Feature {
  id?: string
  title: string
  description: string
  icon?: ReactNode
  iconName?: string
}

export interface FeatureCardProps {
  feature: Feature
  /** Custom className for styling */
  className?: string
  /** Alignment of content */
  align?: 'left' | 'center'
}

// ==================== Stats Types ====================

export interface Stat {
  id?: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
}

export interface StatsCardProps {
  stat: Stat
  /** Custom className for styling */
  className?: string
  /** Show trend indicator */
  showTrend?: boolean
}

// ==================== Section Types ====================

export interface CTASectionProps {
  title: string
  subtitle?: string
  tags?: string[]
  ctaText?: string
  ctaHref?: string
  onCTAClick?: () => void
  /** Video sources for responsive backgrounds */
  videoSources?: {
    desktop?: string
    tablet?: string
    mobile?: string
  }
  /** Social media links */
  socialLinks?: Array<{
    name: string
    url: string
    icon: ReactNode
    iconBg?: string
  }>
  className?: string
}

export interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCTAText?: string
  secondaryCTAHref?: string
  onCTAClick?: () => void
  onSecondaryCTAClick?: () => void
  backgroundImage?: string
  className?: string
}

export interface FeatureSectionProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

export interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  layout?: 'grid' | 'carousel'
  columns?: 2 | 3
  className?: string
}

export interface PricingSectionProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
  onTierSelect?: (tier: PricingTier) => void
  className?: string
}

// ==================== Form Types ====================

export interface LoginFormProps {
  onSuccess?: (user: any) => void
  onError?: (error: Error) => void
  redirectUrl?: string
  showPasswordReset?: boolean
  showRegisterLink?: boolean
  className?: string
}

export interface RegisterFormProps {
  onSuccess?: (user: any) => void
  onError?: (error: Error) => void
  redirectUrl?: string
  showLoginLink?: boolean
  requireTerms?: boolean
  className?: string
}

export interface PasswordResetFormProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectUrl?: string
  className?: string
}

export interface MagicLinkFormProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectUrl?: string
  className?: string
}

export interface ContactFormProps {
  onSuccess?: (data: ContactFormData) => void
  onError?: (error: Error) => void
  className?: string
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

// ==================== Layout Types ====================

export interface DashboardLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  navbar?: ReactNode
  className?: string
}

export interface MarketingLayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export interface AuthLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  logoSrc?: string
  backgroundImage?: string
  className?: string
}
