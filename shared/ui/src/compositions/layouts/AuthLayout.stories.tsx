import type { Meta, StoryObj } from '@storybook/react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import React from 'react';

/**
 * AuthLayout provides a centered authentication layout wrapper for login, registration,
 * password reset, and magic link pages. Features optional logo, title, description,
 * and background image with cosmic dark theme and glass morphism.
 *
 * ## Features
 * - Centered content container (max-width: 28rem)
 * - Optional logo display (20rem height)
 * - Optional title with decorative font (3xl/4xl responsive)
 * - Optional description with muted foreground
 * - Optional background image with opacity overlay
 * - Gradient overlay for better readability
 * - Responsive padding (p-4)
 * - Full viewport height (min-h-screen)
 * - Z-index layering for proper stacking
 * - Accessible semantic structure
 *
 * ## Usage
 * ```tsx
 * <AuthLayout
 *   title="Welcome Back"
 *   description="Sign in to your account"
 *   logoSrc="/logo.png"
 *   backgroundImage="/auth-bg.jpg"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 *
 * ## Layout Structure
 * - Background layer (z-0): Optional background image with overlay
 * - Content layer (z-10): Centered container with logo, title, description, and children
 * - Responsive breakpoints: md (768px) for title font size
 *
 * ## Design Tokens
 * - Background: var(--background)
 * - Title: font-decorative, text-white
 * - Description: var(--muted-foreground)
 * - Image opacity: 0.1 (subtle background)
 * - Gradient overlay: from-[var(--background)]/50 to-[var(--background)]
 */
const meta = {
  title: 'Tier 3: Compositions/Layouts/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Centered authentication layout wrapper for login, registration, and password reset pages. Features optional logo, title, description, and background image with Ozean Licht cosmic dark theme and glass morphism.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Authentication form or content to display',
      control: false,
    },
    title: {
      description: 'Page title (displayed with decorative font)',
      control: 'text',
    },
    description: {
      description: 'Page description (displayed below title)',
      control: 'text',
    },
    logoSrc: {
      description: 'Logo image URL (displayed at h-20)',
      control: 'text',
    },
    backgroundImage: {
      description: 'Background image URL (displayed at 10% opacity with gradient overlay)',
      control: 'text',
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default authentication layout with login form
 */
export const Default: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue your journey',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
};

/**
 * Login page with all layout features enabled
 */
export const LoginPage: Story = {
  args: {
    title: 'Willkommen zurück',
    description: 'Melde dich an, um auf dein Dashboard zuzugreifen',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete login page with logo, title, description, background image, and login form.',
      },
    },
  },
};

/**
 * Registration page with all layout features
 */
export const RegisterPage: Story = {
  args: {
    title: 'Join Our Community',
    description: 'Create your account to start your spiritual journey',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
    children: React.createElement(RegisterForm, {
      redirectUrl: '/dashboard',
      showLoginLink: true,
      requireTerms: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete registration page with logo, title, description, background image, and register form.',
      },
    },
  },
};

/**
 * Password reset page
 */
export const PasswordResetPage: Story = {
  args: {
    title: 'Reset Password',
    description: 'Enter your email to receive a password reset link',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    children: React.createElement('div', {
      className: 'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg',
      children: React.createElement('form', {
        className: 'space-y-4',
        children: [
          React.createElement('div', { key: 'email-field' }, [
            React.createElement('label', {
              key: 'label',
              htmlFor: 'email',
              className: 'block text-sm font-medium text-[var(--foreground)] mb-2',
              children: 'Email',
            }),
            React.createElement('input', {
              key: 'input',
              type: 'email',
              id: 'email',
              className:
                'w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
              placeholder: 'your@email.com',
            }),
          ]),
          React.createElement('button', {
            key: 'submit',
            type: 'submit',
            className:
              'w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors',
            children: 'Send Reset Link',
          }),
          React.createElement('div', {
            key: 'links',
            className: 'text-center text-sm text-[var(--muted-foreground)]',
            children: [
              React.createElement('a', {
                key: 'login',
                href: '/login',
                className: 'text-[var(--primary)] hover:underline',
                children: 'Back to login',
              }),
            ],
          }),
        ],
      }),
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset page with email input form. Demonstrates layout with custom form content.',
      },
    },
  },
};

/**
 * Magic link authentication page
 */
export const MagicLinkPage: Story = {
  args: {
    title: 'Sign in with Magic Link',
    description: 'Enter your email and we\'ll send you a secure login link',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    children: React.createElement('div', {
      className: 'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg',
      children: React.createElement('form', {
        className: 'space-y-6',
        children: [
          React.createElement('div', { key: 'email-field' }, [
            React.createElement('label', {
              key: 'label',
              htmlFor: 'magic-email',
              className: 'block text-sm font-medium text-[var(--foreground)] mb-2',
              children: 'Email Address',
            }),
            React.createElement('input', {
              key: 'input',
              type: 'email',
              id: 'magic-email',
              className:
                'w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
              placeholder: 'your@email.com',
            }),
          ]),
          React.createElement('div', {
            key: 'info',
            className: 'text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20 p-3 rounded',
            children: '✨ No password required. We\'ll send a secure link to your email.',
          }),
          React.createElement('button', {
            key: 'submit',
            type: 'submit',
            className:
              'w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors',
            children: 'Send Magic Link',
          }),
          React.createElement('div', {
            key: 'divider',
            className: 'relative my-6',
            children: [
              React.createElement('div', {
                key: 'line',
                className: 'absolute inset-0 flex items-center',
                children: React.createElement('div', { className: 'w-full border-t border-[var(--border)]' }),
              }),
              React.createElement('div', {
                key: 'text',
                className: 'relative flex justify-center text-xs uppercase',
                children: React.createElement('span', {
                  className: 'bg-[var(--background)] px-2 text-[var(--muted-foreground)]',
                  children: 'or',
                }),
              }),
            ],
          }),
          React.createElement('div', {
            key: 'links',
            className: 'text-center text-sm text-[var(--muted-foreground)]',
            children: [
              React.createElement('a', {
                key: 'password',
                href: '/login',
                className: 'text-[var(--primary)] hover:underline',
                children: 'Sign in with password',
              }),
            ],
          }),
        ],
      }),
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Magic link authentication page with passwordless login flow. Shows email input with informational message.',
      },
    },
  },
};

/**
 * Layout without logo (title and description only)
 */
export const WithoutLogo: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout without logo. Title and description are still displayed.',
      },
    },
  },
};

/**
 * Layout without title and description (logo only)
 */
export const LogoOnly: Story = {
  args: {
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout with only logo (no title or description).',
      },
    },
  },
};

/**
 * Minimal layout (no logo, title, or description)
 */
export const MinimalLayout: Story = {
  args: {
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal authentication layout with only form content and background image.',
      },
    },
  },
};

/**
 * Layout without background image
 */
export const NoBackgroundImage: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout without background image. Uses solid background color.',
      },
    },
  },
};

/**
 * Layout with custom styling
 */
export const CustomStyling: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    className: 'bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout with custom className applied for gradient background.',
      },
    },
  },
};

/**
 * Cosmic dark theme showcase
 */
export const CosmicTheme: Story = {
  args: {
    title: 'Ozean Licht',
    description: 'Deine Reise beginnt hier',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
    backgroundImage:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&fit=crop&auto=format',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Full cosmic dark theme with glass morphism, turquoise accents (#0ec2bc), and atmospheric background.',
      },
    },
  },
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  args: {
    title: 'Welcome',
    description: 'Sign in',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Authentication layout optimized for mobile devices with responsive padding and font sizes.',
      },
    },
  },
};

/**
 * Tablet responsive view
 */
export const TabletView: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue your journey',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Authentication layout on tablet viewport (md breakpoint active for title font size).',
      },
    },
  },
};

/**
 * Side-by-side comparison of all variants
 */
export const AllVariants: Story = {
  render: () =>
    React.createElement('div', {
      className: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
      children: [
        React.createElement('div', {
          key: 'full',
          className: 'border border-[var(--border)] rounded-lg overflow-hidden',
          children: React.createElement('div', {
            className: 'h-[600px]',
            children: React.createElement(AuthLayout, {
              title: 'Full Featured',
              description: 'With logo, title, description, and background',
              logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
              backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
              children: React.createElement('div', {
                className:
                  'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
                children: React.createElement('p', {
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Login form content',
                }),
              }),
            }),
          }),
        }),
        React.createElement('div', {
          key: 'no-logo',
          className: 'border border-[var(--border)] rounded-lg overflow-hidden',
          children: React.createElement('div', {
            className: 'h-[600px]',
            children: React.createElement(AuthLayout, {
              title: 'Without Logo',
              description: 'Title and description only',
              backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
              children: React.createElement('div', {
                className:
                  'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
                children: React.createElement('p', {
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Login form content',
                }),
              }),
            }),
          }),
        }),
        React.createElement('div', {
          key: 'logo-only',
          className: 'border border-[var(--border)] rounded-lg overflow-hidden',
          children: React.createElement('div', {
            className: 'h-[600px]',
            children: React.createElement(AuthLayout, {
              logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
              backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
              children: React.createElement('div', {
                className:
                  'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
                children: React.createElement('p', {
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Login form content',
                }),
              }),
            }),
          }),
        }),
        React.createElement('div', {
          key: 'minimal',
          className: 'border border-[var(--border)] rounded-lg overflow-hidden',
          children: React.createElement('div', {
            className: 'h-[600px]',
            children: React.createElement(AuthLayout, {
              backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
              children: React.createElement('div', {
                className:
                  'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
                children: React.createElement('p', {
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Login form content',
                }),
              }),
            }),
          }),
        }),
      ],
    }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of all major layout variants in a grid.',
      },
    },
  },
};

/**
 * Complete authentication flow showcase with German content
 */
export const AuthenticationFlow: Story = {
  render: () =>
    React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]',
      children: React.createElement('div', {
        className: 'container mx-auto px-4 py-12',
        children: React.createElement('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto',
          children: [
            React.createElement('div', {
              key: 'marketing',
              className: 'space-y-8 text-[var(--foreground)] order-2 lg:order-1',
              children: [
                React.createElement('div', {
                  key: 'header',
                  className: 'space-y-4',
                  children: [
                    React.createElement('h1', {
                      key: 'title',
                      className: 'text-5xl font-light leading-tight',
                      children: 'Willkommen bei Ozean Licht',
                    }),
                    React.createElement('p', {
                      key: 'subtitle',
                      className: 'text-xl text-[var(--muted-foreground)]',
                      children:
                        'Deine Plattform für spirituelles Wachstum und persönliche Transformation.',
                    }),
                  ],
                }),
                React.createElement('div', {
                  key: 'features',
                  className: 'space-y-4',
                  children: [
                    React.createElement('div', {
                      key: 'f1',
                      className: 'flex items-start gap-3',
                      children: [
                        React.createElement('div', {
                          key: 'icon',
                          className: 'mt-1 text-[var(--primary)] text-xl',
                          children: '✓',
                        }),
                        React.createElement('div', {
                          key: 'text',
                          children: [
                            React.createElement('h3', {
                              key: 'h',
                              className: 'font-medium',
                              children: 'Umfassende Kurse',
                            }),
                            React.createElement('p', {
                              key: 'p',
                              className: 'text-sm text-[var(--muted-foreground)]',
                              children: 'Zugriff auf alle Kurse, Meditationen und Lehrmaterialien',
                            }),
                          ],
                        }),
                      ],
                    }),
                    React.createElement('div', {
                      key: 'f2',
                      className: 'flex items-start gap-3',
                      children: [
                        React.createElement('div', {
                          key: 'icon',
                          className: 'mt-1 text-[var(--primary)] text-xl',
                          children: '✓',
                        }),
                        React.createElement('div', {
                          key: 'text',
                          children: [
                            React.createElement('h3', {
                              key: 'h',
                              className: 'font-medium',
                              children: 'Persönlicher Fortschritt',
                            }),
                            React.createElement('p', {
                              key: 'p',
                              className: 'text-sm text-[var(--muted-foreground)]',
                              children: 'Verfolge deine Entwicklung und setze individuelle Ziele',
                            }),
                          ],
                        }),
                      ],
                    }),
                    React.createElement('div', {
                      key: 'f3',
                      className: 'flex items-start gap-3',
                      children: [
                        React.createElement('div', {
                          key: 'icon',
                          className: 'mt-1 text-[var(--primary)] text-xl',
                          children: '✓',
                        }),
                        React.createElement('div', {
                          key: 'text',
                          children: [
                            React.createElement('h3', {
                              key: 'h',
                              className: 'font-medium',
                              children: 'Community Zugang',
                            }),
                            React.createElement('p', {
                              key: 'p',
                              className: 'text-sm text-[var(--muted-foreground)]',
                              children: 'Verbinde dich mit Gleichgesinnten auf deinem Weg',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                React.createElement('div', {
                  key: 'testimonial',
                  className:
                    'bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-lg p-6',
                  children: [
                    React.createElement('p', {
                      key: 'quote',
                      className: 'text-sm italic text-[var(--muted-foreground)] mb-4',
                      children:
                        '"Ozean Licht hat mein Leben verändert. Die Kurse sind tiefgründig und die Community ist inspirierend."',
                    }),
                    React.createElement('div', {
                      key: 'author',
                      className: 'flex items-center gap-3',
                      children: [
                        React.createElement('div', {
                          key: 'avatar',
                          className:
                            'w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-medium',
                          children: 'MK',
                        }),
                        React.createElement('div', {
                          key: 'info',
                          children: [
                            React.createElement('p', {
                              key: 'name',
                              className: 'text-sm font-medium',
                              children: 'Maria K.',
                            }),
                            React.createElement('p', {
                              key: 'role',
                              className: 'text-xs text-[var(--muted-foreground)]',
                              children: 'Mitglied seit 2023',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'form',
              className: 'order-1 lg:order-2',
              children: React.createElement(AuthLayout, {
                title: 'Anmelden',
                description: 'Setze deine Reise fort',
                logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
                children: React.createElement(LoginForm, {
                  redirectUrl: '/dashboard',
                  showPasswordReset: true,
                  showRegisterLink: true,
                }),
              }),
            }),
          ],
        }),
      }),
    }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Complete authentication page with marketing content, features list, testimonial, and AuthLayout component. Demonstrates real-world usage with German content.',
      },
    },
  },
};

/**
 * Layout structure documentation
 */
export const LayoutStructure: Story = {
  render: () =>
    React.createElement('div', {
      className: 'p-8 space-y-8 max-w-6xl mx-auto',
      children: [
        React.createElement('div', {
          key: 'header',
          children: React.createElement('h2', {
            className: 'text-3xl font-semibold text-[var(--foreground)] mb-4',
            children: 'AuthLayout Structure',
          }),
        }),
        React.createElement('div', {
          key: 'structure',
          className: 'space-y-6',
          children: [
            React.createElement('div', {
              key: 'layer1',
              className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
                  children: '1. Background Layer (z-0)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
                  children: [
                    React.createElement('li', {
                      key: 'i1',
                      children: 'Optional background image at 10% opacity',
                    }),
                    React.createElement('li', {
                      key: 'i2',
                      children: 'Gradient overlay from background/50 to solid background',
                    }),
                    React.createElement('li', {
                      key: 'i3',
                      children: 'Full viewport coverage (absolute inset-0)',
                    }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'layer2',
              className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
                  children: '2. Content Container (z-10)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
                  children: [
                    React.createElement('li', {
                      key: 'i1',
                      children: 'Max-width: 28rem (448px)',
                    }),
                    React.createElement('li', {
                      key: 'i2',
                      children: 'Centered with flexbox (items-center justify-center)',
                    }),
                    React.createElement('li', {
                      key: 'i3',
                      children: 'Padding: 1rem (16px)',
                    }),
                    React.createElement('li', {
                      key: 'i4',
                      children: 'Space between sections: 2rem (32px)',
                    }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'layer3',
              className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
                  children: '3. Header Section (Logo, Title, Description)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
                  children: [
                    React.createElement('li', {
                      key: 'i1',
                      children: 'Logo: h-20 (80px height), auto width',
                    }),
                    React.createElement('li', {
                      key: 'i2',
                      children: 'Title: 3xl (1.875rem) on mobile, 4xl (2.25rem) on md+',
                    }),
                    React.createElement('li', {
                      key: 'i3',
                      children: 'Description: muted foreground color',
                    }),
                    React.createElement('li', {
                      key: 'i4',
                      children: 'Text alignment: center',
                    }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'layer4',
              className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
                  children: '4. Form Content Area',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
                  children: [
                    React.createElement('li', {
                      key: 'i1',
                      children: 'Renders children prop (LoginForm, RegisterForm, etc.)',
                    }),
                    React.createElement('li', {
                      key: 'i2',
                      children: 'No constraints on child content structure',
                    }),
                    React.createElement('li', {
                      key: 'i3',
                      children: 'Inherits spacing from parent container',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        React.createElement('div', {
          key: 'demo',
          className: 'mt-8',
          children: [
            React.createElement('h3', {
              key: 'title',
              className: 'text-xl font-semibold text-[var(--foreground)] mb-4',
              children: 'Visual Example:',
            }),
            React.createElement('div', {
              key: 'example',
              className: 'border-2 border-[var(--border)] rounded-lg overflow-hidden',
              style: { height: '600px' },
              children: React.createElement(AuthLayout, {
                title: 'Example Layout',
                description: 'Showcasing the layer structure',
                logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Logo',
                backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
                children: React.createElement('div', {
                  className:
                    'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border-2 border-[var(--primary)] shadow-xl',
                  children: React.createElement('p', {
                    className: 'text-center text-[var(--muted-foreground)]',
                    children: 'This is the children prop area where forms are rendered',
                  }),
                }),
              }),
            }),
          ],
        }),
      ],
    }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Detailed documentation of the AuthLayout component structure, layers, and spacing system.',
      },
    },
  },
};

/**
 * Responsive behavior demonstration
 */
export const ResponsiveBehavior: Story = {
  render: () =>
    React.createElement('div', {
      className: 'space-y-8 p-6',
      children: [
        React.createElement('div', {
          key: 'header',
          children: [
            React.createElement('h2', {
              key: 'title',
              className: 'text-2xl font-semibold text-[var(--foreground)] mb-2',
              children: 'Responsive Breakpoints',
            }),
            React.createElement('p', {
              key: 'desc',
              className: 'text-[var(--muted-foreground)]',
              children: 'AuthLayout adapts to different screen sizes:',
            }),
          ],
        }),
        React.createElement('div', {
          key: 'breakpoints',
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          children: [
            React.createElement('div', {
              key: 'mobile',
              className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'font-semibold text-[var(--foreground)] mb-3',
                  children: 'Mobile (< 768px)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'text-sm text-[var(--muted-foreground)] space-y-2',
                  children: [
                    React.createElement('li', { key: 'i1', children: '• Title: text-3xl (1.875rem)' }),
                    React.createElement('li', { key: 'i2', children: '• Padding: p-4 (1rem)' }),
                    React.createElement('li', { key: 'i3', children: '• Full-width container' }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'tablet',
              className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'font-semibold text-[var(--foreground)] mb-3',
                  children: 'Tablet (≥ 768px)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'text-sm text-[var(--muted-foreground)] space-y-2',
                  children: [
                    React.createElement('li', { key: 'i1', children: '• Title: text-4xl (2.25rem)' }),
                    React.createElement('li', { key: 'i2', children: '• Padding: p-4 (1rem)' }),
                    React.createElement('li', { key: 'i3', children: '• Max-width: 28rem' }),
                  ],
                }),
              ],
            }),
            React.createElement('div', {
              key: 'desktop',
              className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
              children: [
                React.createElement('h3', {
                  key: 'title',
                  className: 'font-semibold text-[var(--foreground)] mb-3',
                  children: 'Desktop (≥ 1024px)',
                }),
                React.createElement('ul', {
                  key: 'list',
                  className: 'text-sm text-[var(--muted-foreground)] space-y-2',
                  children: [
                    React.createElement('li', { key: 'i1', children: '• Title: text-4xl (2.25rem)' }),
                    React.createElement('li', { key: 'i2', children: '• Padding: p-4 (1rem)' }),
                    React.createElement('li', { key: 'i3', children: '• Max-width: 28rem' }),
                  ],
                }),
              ],
            }),
          ],
        }),
        React.createElement('div', {
          key: 'demo',
          className: 'mt-4',
          children: [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-semibold text-[var(--foreground)] mb-4',
              children: 'Try resizing your browser:',
            }),
            React.createElement('div', {
              key: 'example',
              className: 'border border-[var(--border)] rounded-lg overflow-hidden',
              style: { height: '500px' },
              children: React.createElement(AuthLayout, {
                title: 'Responsive Title',
                description: 'Watch the title size change at md breakpoint (768px)',
                logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=R',
                backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
                children: React.createElement('div', {
                  className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)]',
                  children: React.createElement('p', {
                    className: 'text-sm text-[var(--muted-foreground)] text-center',
                    children: 'Form content scales with container',
                  }),
                }),
              }),
            }),
          ],
        }),
      ],
    }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Demonstrates responsive behavior across different screen sizes with detailed breakpoint information.',
      },
    },
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true,
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to experiment with all AuthLayout props. Use the controls panel to modify props dynamically.',
      },
    },
  },
};
