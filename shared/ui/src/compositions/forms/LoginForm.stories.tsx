import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { fn } from '@storybook/test';

/**
 * LoginForm provides a complete authentication interface with email/password fields,
 * password visibility toggle, validation, and error handling. Features Ozean Licht
 * branding with glass morphism card design.
 *
 * ## Features
 * - React Hook Form with Zod validation
 * - Email validation (valid email format required)
 * - Password validation (minimum 8 characters)
 * - Password visibility toggle with Eye/EyeOff icons
 * - Loading state during authentication
 * - Error state with Alert component
 * - Optional password reset link
 * - Optional register link
 * - Glass morphism card design
 * - Responsive layout with max-width constraint
 * - Accessible form labels and ARIA attributes
 *
 * ## Usage
 * ```tsx
 * <LoginForm
 *   onSuccess={(user) => console.log('Login successful:', user)}
 *   onError={(error) => console.error('Login failed:', error)}
 *   redirectUrl="/dashboard"
 *   showPasswordReset
 *   showRegisterLink
 * />
 * ```
 *
 * ## Validation Rules
 * - Email: Must be a valid email address
 * - Password: Minimum 8 characters
 *
 * ## Callbacks
 * - `onSuccess`: Called when authentication succeeds (receives user data)
 * - `onError`: Called when authentication fails (receives Error object)
 */
const meta = {
  title: 'Tier 3: Compositions/Forms/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete login form composition with validation, error handling, and password visibility toggle. Features Ozean Licht branding with glass morphism card design and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: {
      description: 'Callback function called when login succeeds',
      control: false,
      action: 'login-success',
    },
    onError: {
      description: 'Callback function called when login fails',
      control: false,
      action: 'login-error',
    },
    redirectUrl: {
      description: 'URL to redirect to after successful login',
      control: 'text',
      table: {
        defaultValue: { summary: '/dashboard' },
      },
    },
    showPasswordReset: {
      description: 'Show "Forgot password?" link',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showRegisterLink: {
      description: 'Show "Create account" link',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default login form with all features enabled
 */
export const Default: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
};

/**
 * Login form without password reset link
 */
export const NoPasswordReset: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: false,
    showRegisterLink: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with password reset link hidden.',
      },
    },
  },
};

/**
 * Login form without register link
 */
export const NoRegisterLink: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with register link hidden.',
      },
    },
  },
};

/**
 * Minimal login form (no extra links)
 */
export const MinimalForm: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: false,
    showRegisterLink: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal login form with only email, password, and submit button.',
      },
    },
  },
};

/**
 * Login form with custom redirect URL
 */
export const CustomRedirect: Story = {
  args: {
    redirectUrl: '/admin/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form redirecting to a custom URL after successful authentication.',
      },
    },
  },
};

/**
 * Login form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    className: 'shadow-2xl border-2 border-[var(--primary)]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with custom className applied for enhanced border and shadow.',
      },
    },
  },
};

/**
 * Login form with error handling demo
 */
export const WithErrorHandling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    onError: (error: Error) => {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling callback. Try submitting with valid credentials to see the error handler in action.',
      },
    },
  },
};

/**
 * Login form with success handling demo
 */
export const WithSuccessHandling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    onSuccess: (user: any) => {
      console.log('Login successful:', user);
      alert(`Welcome! Logged in as ${user.email}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call).',
      },
    },
  },
};

/**
 * Login form on cosmic dark background
 */
export const CosmicTheme: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Login form displayed on cosmic dark background showcasing glass morphism effect.',
      },
    },
  },
};

/**
 * Login form in narrow mobile container
 */
export const MobileView: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[320px] p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Login form optimized for mobile viewports with responsive layout.',
      },
    },
  },
};

/**
 * Login form with wide container
 */
export const WideContainer: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Login form in a wider container. The form maintains its max-width constraint.',
      },
    },
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.',
      },
    },
  },
};

/**
 * Validation demo - shows inline validation errors
 */
export const ValidationDemo: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Email: Must be a valid email address</li>
          <li>Password: Minimum 8 characters</li>
        </ul>
      </div>
      <LoginForm
        redirectUrl="/dashboard"
        showPasswordReset
        showRegisterLink
        onSuccess={(user) => console.log('Success:', user)}
        onError={(error) => console.error('Error:', error)}
      />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short password: "pass" (shows "Password must be at least 8 characters")</li>
          <li>Valid credentials: "test@example.com" + "password123"</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages.',
      },
    },
  },
};

/**
 * Complete authentication flow showcase
 */
export const AuthenticationFlow: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Willkommen zurück</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Melde dich an, um auf dein Dashboard zuzugreifen und deine spirituelle Reise fortzusetzen.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Zugriff auf alle deine Kurse und Materialien</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Fortschritt synchronisiert auf allen Geräten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Personalisierte Empfehlungen und Insights</span>
            </li>
          </ul>
        </div>
        <div>
          <LoginForm
            redirectUrl="/dashboard"
            showPasswordReset
            showRegisterLink
            onSuccess={(user) => console.log('Login successful:', user)}
            onError={(error) => console.error('Login failed:', error)}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Complete authentication page layout with marketing copy and login form, showcasing real-world usage.',
      },
    },
  },
};

/**
 * All form states comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State</h3>
        <div className="max-w-md">
          <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Extra Links)</h3>
        <div className="max-w-md">
          <LoginForm redirectUrl="/dashboard" showPasswordReset={false} showRegisterLink={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-md">
          <LoginForm
            redirectUrl="/dashboard"
            showPasswordReset
            showRegisterLink
            className="border-2 border-[var(--primary)] shadow-2xl"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations and states.',
      },
    },
  },
};

/**
 * Form behavior documentation
 */
export const BehaviorDocumentation: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">LoginForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Visibility Toggle</h3>
          <p className="text-[var(--muted-foreground)]">
            Click the eye icon to toggle password visibility. The icon changes from Eye to EyeOff when password
            is visible.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During authentication (simulated 1s delay), the submit button shows "Wird angemeldet..." and is
            disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field. Server errors appear in a destructive Alert
            component above the submit button.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Redirect Behavior</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful authentication, if redirectUrl is provided, the form automatically redirects using
            window.location.href. If onSuccess callback is provided, it's called before redirect.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label.
            Error messages are associated with fields using ARIA attributes.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <LoginForm
          redirectUrl="/dashboard"
          showPasswordReset
          showRegisterLink
          onSuccess={(user) => alert(`Success! Email: ${user.email}`)}
          onError={(error) => alert(`Error: ${error.message}`)}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive documentation of form behavior, states, and user interactions.',
      },
    },
  },
};
