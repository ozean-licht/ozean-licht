import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetForm } from './PasswordResetForm';
import { fn } from '@storybook/test';

/**
 * PasswordResetForm provides a secure password reset interface with email input,
 * validation, success confirmation, and error handling. Features Ozean Licht
 * branding with glass morphism card design.
 *
 * ## Features
 * - React Hook Form with Zod validation
 * - Email validation (valid email format required)
 * - Loading state during password reset request
 * - Success state with confirmation message
 * - Error state with Alert component
 * - Back to login link for easy navigation
 * - Glass morphism card design
 * - Responsive layout with max-width constraint
 * - Accessible form labels and ARIA attributes
 * - German language interface
 *
 * ## Usage
 * ```tsx
 * <PasswordResetForm
 *   onSuccess={() => console.log('Reset email sent')}
 *   onError={(error) => console.error('Reset failed:', error)}
 *   redirectUrl="/login"
 * />
 * ```
 *
 * ## Validation Rules
 * - Email: Must be a valid email address
 *
 * ## Workflow
 * 1. User enters email address
 * 2. Form validates email format
 * 3. Loading state shows "Wird gesendet..." (Sending...)
 * 4. Success state displays confirmation message
 * 5. User can click "Zurück zur Anmeldung" (Back to Login)
 *
 * ## Callbacks
 * - `onSuccess`: Called when password reset email is sent successfully
 * - `onError`: Called when password reset request fails (receives Error object)
 */
const meta = {
  title: 'Tier 3: Compositions/Forms/PasswordResetForm',
  component: PasswordResetForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete password reset form composition with email validation, success confirmation, and error handling. Features Ozean Licht branding with glass morphism card design and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: {
      description: 'Callback function called when reset email is sent successfully',
      control: false,
      action: 'reset-success',
    },
    onError: {
      description: 'Callback function called when reset request fails',
      control: false,
      action: 'reset-error',
    },
    redirectUrl: {
      description: 'URL to redirect to after successful password reset (optional)',
      control: 'text',
      table: {
        defaultValue: { summary: 'undefined' },
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
} satisfies Meta<typeof PasswordResetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default password reset form with all features
 */
export const Default: Story = {
  args: {},
};

/**
 * Password reset form with redirect URL
 */
export const WithRedirect: Story = {
  args: {
    redirectUrl: '/login',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with optional redirect URL for navigation after success.',
      },
    },
  },
};

/**
 * Password reset form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with custom className applied for enhanced border and shadow.',
      },
    },
  },
};

/**
 * Password reset form with success callback demo
 */
export const WithSuccessHandling: Story = {
  args: {
    onSuccess: () => {
      console.log('Reset email sent successfully');
      alert('Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet!');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates success handling callback. Submit with a valid email to see the success handler in action (simulates 1s API call).',
      },
    },
  },
};

/**
 * Password reset form with error callback demo
 */
export const WithErrorHandling: Story = {
  args: {
    onError: (error: Error) => {
      console.error('Reset error:', error);
      alert(`Password reset failed: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling callback. The form includes built-in error display with Alert component.',
      },
    },
  },
};

/**
 * Password reset form on cosmic dark background
 */
export const CosmicTheme: Story = {
  args: {},
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
        story: 'Password reset form displayed on cosmic dark background showcasing glass morphism effect.',
      },
    },
  },
};

/**
 * Password reset form in narrow mobile container
 */
export const MobileView: Story = {
  args: {},
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
        story: 'Password reset form optimized for mobile viewports with responsive layout.',
      },
    },
  },
};

/**
 * Password reset form with wide container
 */
export const WideContainer: Story = {
  args: {},
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
        story: 'Password reset form in a wider container. The form maintains its max-width constraint.',
      },
    },
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  args: {},
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
        </ul>
      </div>
      <PasswordResetForm
        onSuccess={() => console.log('Reset successful')}
        onError={(error) => console.error('Reset error:', error)}
      />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Invalid email: "test@" (shows "Invalid email address")</li>
          <li>Valid email: "test@example.com" (shows success message)</li>
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
 * Complete password reset flow showcase
 */
export const PasswordResetFlow: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Passwort vergessen?</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Kein Problem! Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen
            deines Passworts.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Sicherer Reset-Link wird per E-Mail gesendet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Link ist nur für kurze Zeit gültig</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Deine Daten bleiben sicher und verschlüsselt</span>
            </li>
          </ul>
        </div>
        <div>
          <PasswordResetForm
            onSuccess={() => console.log('Reset email sent')}
            onError={(error) => console.error('Reset failed:', error)}
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
          'Complete password reset page layout with informational copy and reset form, showcasing real-world usage.',
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
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Email Input)</h3>
        <div className="max-w-md">
          <PasswordResetForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Custom Styling (Enhanced Border)</h3>
        <div className="max-w-md">
          <PasswordResetForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Redirect URL</h3>
        <div className="max-w-md">
          <PasswordResetForm redirectUrl="/login" />
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
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">PasswordResetForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Email Input Step</h3>
          <p className="text-[var(--muted-foreground)]">
            User enters their email address. The form validates that the email is in a valid format before
            submission.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During the reset request (simulated 1s delay), the submit button shows "Wird gesendet..." (Sending...) and
            is disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form replaces the input with a green success Alert displaying: "Eine
            E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach." (An email to
            reset your password has been sent. Please check your inbox.)
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below the email field. Server errors appear in a destructive Alert
            component above the submit button. Errors are cleared when user resubmits the form.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Navigation</h3>
          <p className="text-[var(--muted-foreground)]">
            The form includes a "Zurück zur Anmeldung" (Back to Login) link at the bottom for easy navigation back to
            the login page at /login.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            Form field has proper label with htmlFor attribute. Error messages are associated with fields using ARIA
            attributes. Success alert uses semantic HTML for screen readers.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Internationalization</h3>
          <p className="text-[var(--muted-foreground)]">
            All UI text is in German (Austrian German context). Titles: "Passwort Zurücksetzen". Buttons: "Link
            Senden", "Wird gesendet...". Messages and descriptions are fully localized.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <PasswordResetForm
          onSuccess={() => alert('Reset email sent successfully!')}
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

/**
 * State transitions demo - showing the workflow
 */
export const StateTransitions: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Password Reset State Flow</h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          The form progresses through three main states: Initial (email input), Loading (sending request), and Success
          (confirmation message).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Initial State</h3>
          </div>
          <div className="max-w-md">
            <PasswordResetForm />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            User enters email address and clicks "Link Senden" button
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Loading State</h3>
          </div>
          <div className="text-center p-8 border border-dashed border-[var(--border)] rounded-lg bg-[var(--card)]">
            <p className="text-[var(--muted-foreground)] mb-2">Button shows:</p>
            <p className="font-semibold text-[var(--foreground)]">"Wird gesendet..."</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-4">Button is disabled</p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Request is being processed (simulated 1s API call)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Success State</h3>
          </div>
          <div className="text-center p-8 border border-dashed border-green-500 rounded-lg bg-green-500/10">
            <p className="text-green-400 text-sm">
              "Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach."
            </p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Form input replaced with success message
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Complete Flow Example</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Try the complete workflow in this live example. Enter a valid email and watch the state transitions:
        </p>
        <div className="max-w-md mx-auto">
          <PasswordResetForm
            onSuccess={() => console.log('Password reset email sent')}
            onError={(error) => console.error('Error:', error)}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Visual demonstration of the three main states: Initial (email input), Loading, and Success.',
      },
    },
  },
};

/**
 * Integration example with full authentication pages
 */
export const AuthenticationPages: Story = {
  render: () => (
    <div className="space-y-12 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
          Integration with Authentication Flow
        </h2>
        <p className="text-[var(--muted-foreground)]">
          The PasswordResetForm integrates seamlessly with other authentication forms like LoginForm and
          RegisterForm. Below are common page layouts using the component.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Simple Reset Page</h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[500px] flex items-center justify-center">
            <PasswordResetForm />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Reset Page with Branding</h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px] flex items-center justify-center">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center space-y-2">
                <div className="text-[var(--primary)] text-5xl font-light mb-4">Ozean Licht</div>
                <p className="text-sm text-[var(--muted-foreground)]">Dein spiritueller Begleiter</p>
              </div>
              <PasswordResetForm />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
            Side-by-Side Layout (Desktop)
          </h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6 text-[var(--foreground)]">
                <h1 className="text-4xl font-light">Passwort zurücksetzen</h1>
                <p className="text-lg text-[var(--muted-foreground)]">
                  Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen deines
                  Passworts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Schneller und sicherer Prozess</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Link ist zeitlich begrenzt gültig</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Deine Daten bleiben geschützt</span>
                  </li>
                </ul>
              </div>
              <div>
                <PasswordResetForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Examples of how to integrate PasswordResetForm into complete authentication pages with various layouts and branding.',
      },
    },
  },
};
