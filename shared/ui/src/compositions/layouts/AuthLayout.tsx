/**
 * AuthLayout Component
 *
 * A centered authentication layout for login, registration, and password reset pages.
 * Features optional logo, title, description, and background image.
 *
 * @example
 * import { AuthLayout } from '@ozean-licht/shared-ui/compositions'
 *
 * <AuthLayout
 *   title="Welcome Back"
 *   description="Sign in to your account"
 *   logoSrc="/logo.png"
 * >
 *   <LoginForm />
 * </AuthLayout>
 */

'use client'


import { cn } from '../../utils/cn'
import type { AuthLayoutProps } from '../types'

export function AuthLayout({
  children,
  title,
  description,
  logoSrc,
  backgroundImage,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-[var(--background)] flex items-center justify-center p-4', className)}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 to-[var(--background)]" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo and Title */}
        {(logoSrc || title || description) && (
          <div className="text-center space-y-4">
            {logoSrc && (
              <div className="flex justify-center mb-6">
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="h-20 w-auto"
                />
              </div>
            )}

            {title && (
              <h1 className="text-3xl md:text-4xl font-decorative text-white">
                {title}
              </h1>
            )}

            {description && (
              <p className="text-[var(--muted-foreground)]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Form Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

AuthLayout.displayName = 'AuthLayout'
