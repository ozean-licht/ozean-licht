import type { Meta, StoryObj } from '@storybook/react';
import { AuthLayout } from './auth-layout';
import { Button } from '../navigation/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Catalyst AuthLayout component for authentication pages.
 *
 * **This is a Tier 1 Primitive** - Headless UI/Catalyst authentication layout component.
 * No Tier 2 branded version exists. This layout is used for login, signup, and other auth pages.
 *
 * ## Key Features
 *
 * **Centered Card Layout:**
 * - Centers authentication content vertically and horizontally
 * - Responsive card with rounded corners and shadow on desktop (lg:)
 * - Full-bleed layout on mobile, elegant card on desktop
 * - Minimum full viewport height (min-h-dvh) for proper centering
 *
 * **Responsive Design:**
 * - Mobile: Full-screen layout with padding (p-2)
 * - Desktop: Centered card with shadow, ring border, and larger padding (lg:p-10)
 * - Dynamic viewport height (dvh) ensures proper mobile rendering
 *
 * **Dark Mode Support:**
 * - Light mode: White background (lg:bg-white), subtle ring (ring-zinc-950/5)
 * - Dark mode: Dark background (dark:lg:bg-zinc-900), white ring (dark:ring-white/10)
 * - Seamless theme switching with Tailwind dark: variants
 *
 * **Layout Structure:**
 * ```tsx
 * <AuthLayout>
 *   {children} // Your auth form content
 * </AuthLayout>
 * ```
 *
 * ## Use Cases
 *
 * - **Login Forms** - User authentication pages
 * - **Signup Forms** - New user registration
 * - **Password Reset** - Forgot password flows
 * - **Two-Factor Authentication** - 2FA/MFA verification
 * - **Email Verification** - Account verification pages
 * - **Onboarding** - First-time user setup
 *
 * ## Design Philosophy
 *
 * The AuthLayout follows Catalyst's design principles:
 * - Simplicity: Minimal structure, maximum flexibility
 * - Accessibility: Semantic HTML with proper ARIA
 * - Responsiveness: Mobile-first with desktop enhancements
 * - Consistency: Matches Catalyst's overall design language
 *
 * ## Styling Details
 *
 * **Card Appearance (Desktop):**
 * - Background: white (light) / zinc-900 (dark)
 * - Border: 1px ring with zinc-950/5 (light) / white/10 (dark)
 * - Shadow: shadow-xs for subtle depth
 * - Padding: p-10 (40px)
 * - Border radius: rounded-lg
 *
 * **Container:**
 * - Full viewport height with grow behavior
 * - Centered content (items-center justify-center)
 * - Padding: p-6 for inner spacing
 *
 * ## Integration Examples
 *
 * ```tsx
 * // Basic Login Page
 * <AuthLayout>
 *   <form className="w-full max-w-sm space-y-6">
 *     <h2>Sign In</h2>
 *     <Input type="email" placeholder="Email" />
 *     <Input type="password" placeholder="Password" />
 *     <Button type="submit">Sign In</Button>
 *   </form>
 * </AuthLayout>
 *
 * // With Ozean Licht Branding
 * <AuthLayout>
 *   <div className="w-full max-w-sm space-y-6" style={cosmicStyles}>
 *     <h2 style={brandColor}>Ocean Light</h2>
 *     // Your form content
 *   </div>
 * </AuthLayout>
 * ```
 *
 * @see /shared/ui/src/catalyst/navigation/button.tsx for Catalyst buttons
 * @see https://catalyst.tailwindui.com/docs for Catalyst documentation
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Authentication page layout with centered card design. Provides consistent structure for login, signup, and other auth pages with responsive behavior and dark mode support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default authentication layout with minimal content.
 *
 * Shows the basic centered card structure with simple text content.
 * Demonstrates the responsive behavior and dark mode support.
 */
export const Default: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Authentication Page
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is the default AuthLayout. Content is centered in a responsive card.
        </p>
      </div>
    </AuthLayout>
  ),
};

/**
 * Login form with email and password.
 *
 * Complete login page implementation with form fields, labels, and action buttons.
 * Includes "Remember me" checkbox and "Forgot password" link.
 */
export const LoginForm: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                defaultValue=""
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" color="indigo" className="w-full justify-center">
            Sign in
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Don't have an account? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign up
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Signup form with name, email, and password.
 *
 * Complete registration page with all necessary fields and password requirements.
 * Includes terms of service agreement and link to login page.
 */
export const SignupForm: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create an account
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get started with your free account today
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Must be at least 8 characters with a mix of letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="terms" className="text-xs font-normal leading-relaxed cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Privacy Policy
              </a>
            </Label>
          </div>

          <Button type="submit" color="green" className="w-full justify-center">
            Create account
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Already have an account? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Password reset request form.
 *
 * Simple form for requesting a password reset link via email.
 * Includes back to login link for easy navigation.
 */
export const PasswordReset: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Reset your password
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" color="blue" className="w-full justify-center">
            Send reset link
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </form>

        <div className="text-center">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Two-factor authentication verification.
 *
 * 2FA verification page with 6-digit code input.
 * Includes option to resend code if not received.
 */
export const TwoFactorAuth: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Two-factor authentication
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp-code" className="sr-only">
              Verification code
            </Label>
            <Input
              id="otp-code"
              type="text"
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
            />
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              The code expires in 30 seconds
            </p>
          </div>

          <Button type="submit" color="green" className="w-full justify-center">
            Verify code
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Didn't receive a code?
            </p>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Resend code
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Login form with illustration/branding.
 *
 * Enhanced login page with logo, tagline, and visual branding elements.
 * Shows how to add brand identity to auth pages.
 */
export const WithIllustration: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome to Platform
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Sign in to access your dashboard and manage your projects
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="illus-email">Email address</Label>
            <Input
              id="illus-email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="illus-password">Password</Label>
            <Input
              id="illus-password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="illus-remember"
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="illus-remember" className="text-sm font-normal cursor-pointer">
                Remember me
              </Label>
            </div>
            <a
              href="#"
              className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" color="blue" className="w-full justify-center">
            Sign in to your account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button outline type="button" className="justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button outline type="button" className="justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">New user? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Create an account
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Ozean Licht themed authentication pages.
 *
 * Demonstrates complete auth pages with Ozean Licht cosmic branding.
 * Includes turquoise accent color (#0ec2bc), cosmic backgrounds, and glass morphism effects.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
      <div className="min-h-screen relative">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
          {/* Animated stars */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0ec2bc]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <AuthLayout>
          <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Glass morphism card */}
            <div
              className="backdrop-blur-xl bg-white/10 dark:bg-zinc-900/40 rounded-2xl p-8 shadow-2xl border border-white/20"
              style={{
                boxShadow: '0 8px 32px 0 rgba(14, 194, 188, 0.1)',
              }}
            >
              {/* Logo and branding */}
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0ec2bc] to-[#0a9b96] shadow-lg shadow-[#0ec2bc]/50">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
                <div>
                  <h2
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: '#0ec2bc' }}
                  >
                    Ozean Licht
                  </h2>
                  <p className="text-sm text-white/70 mt-2">
                    Dive into the cosmic ocean of light
                  </p>
                </div>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 2000);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="ozean-email" className="text-white/90">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input
                      id="ozean-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#0ec2bc] focus:ring-[#0ec2bc]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ozean-password" className="text-white/90">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-xs hover:underline"
                      style={{ color: '#0ec2bc' }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input
                      id="ozean-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#0ec2bc] focus:ring-[#0ec2bc]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ozean-remember"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#0ec2bc] focus:ring-[#0ec2bc]"
                  />
                  <Label
                    htmlFor="ozean-remember"
                    className="text-sm font-normal text-white/80 cursor-pointer"
                  >
                    Keep me signed in
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: '#0ec2bc',
                    color: 'white',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 data-slot="icon" className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Ocean Light
                      <ArrowRight data-slot="icon" className="size-4" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-white/60 bg-transparent">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    outline
                    type="button"
                    className="justify-center border-white/20 text-white/90 hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>
                  <Button
                    outline
                    type="button"
                    className="justify-center border-white/20 text-white/90 hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </Button>
                </div>
              </form>

              <div className="text-center text-sm mt-6">
                <span className="text-white/60">New to Ozean Licht? </span>
                <a
                  href="#"
                  className="font-medium hover:underline"
                  style={{ color: '#0ec2bc' }}
                >
                  Begin your journey
                </a>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-center text-xs text-white/50">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </AuthLayout>
      </div>
    );
  },
  parameters: {
    backgrounds: { disable: true },
  },
};

/**
 * Email verification page.
 *
 * Simple page for email verification after signup.
 * Includes resend verification email option.
 */
export const EmailVerification: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
          <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Check your email
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            john.doe@example.com
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Click the link in the email to verify your account. If you don't see the email,
            check your spam folder.
          </p>

          <Button color="blue" className="w-full justify-center">
            Open email app
          </Button>

          <div className="text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Didn't receive the email? </span>
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Resend
            </button>
          </div>
        </div>

        <div className="pt-6">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Loading state during authentication.
 *
 * Shows a loading spinner while processing authentication.
 * Useful for displaying during OAuth callbacks or session validation.
 */
export const LoadingState: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Signing you in...
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Success confirmation page.
 *
 * Shows a success message after completing an authentication action.
 * Includes automatic redirect countdown.
 */
export const SuccessState: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            All set!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Your account has been successfully verified
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Redirecting you to your dashboard in 3 seconds...
          </p>

          <Button color="green" className="w-full justify-center">
            Go to dashboard
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>
    </AuthLayout>
  ),
};

/**
 * Error state for authentication failures.
 *
 * Displays error messages when authentication fails.
 * Includes options to retry or return to login.
 */
export const ErrorState: Story = {
  render: () => (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Authentication failed
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We couldn't verify your credentials. Please check your email and password and try again.
          </p>
        </div>

        <div className="space-y-3">
          <Button color="blue" className="w-full justify-center">
            Try again
          </Button>

          <a
            href="#"
            className="block text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  ),
};
