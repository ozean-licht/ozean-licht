import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './RegisterForm';
import { fn } from '@storybook/test';

/**
 * RegisterForm provides a complete registration interface with name, email, password,
 * password confirmation, and terms acceptance. Features Ozean Licht branding with
 * glass morphism card design.
 *
 * ## Features
 * - React Hook Form with Zod validation
 * - Name validation (minimum 2 characters)
 * - Email validation (valid email format required)
 * - Password validation (minimum 8 characters)
 * - Password confirmation matching
 * - Password visibility toggle with Eye/EyeOff icons
 * - Terms and conditions acceptance checkbox
 * - Loading state during registration
 * - Error state with Alert component
 * - Optional login link for existing users
 * - Glass morphism card design
 * - Responsive layout with max-width constraint
 * - Accessible form labels and ARIA attributes
 *
 * ## Usage
 * ```tsx
 * <RegisterForm
 *   onSuccess={(user) => console.log('Registration successful:', user)}
 *   onError={(error) => console.error('Registration failed:', error)}
 *   redirectUrl="/dashboard"
 *   showLoginLink
 *   requireTerms
 * />
 * ```
 *
 * ## Validation Rules
 * - Name: Minimum 2 characters
 * - Email: Must be a valid email address
 * - Password: Minimum 8 characters
 * - Confirm Password: Must match password field
 * - Terms: Must be accepted when requireTerms is true
 *
 * ## Callbacks
 * - `onSuccess`: Called when registration succeeds (receives user data)
 * - `onError`: Called when registration fails (receives Error object)
 */
const meta = {
  title: 'Tier 3: Compositions/Forms/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete registration form composition with validation, password matching, terms acceptance, and error handling. Features Ozean Licht branding with glass morphism card design and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: {
      description: 'Callback function called when registration succeeds',
      control: false,
      action: 'register-success',
    },
    onError: {
      description: 'Callback function called when registration fails',
      control: false,
      action: 'register-error',
    },
    redirectUrl: {
      description: 'URL to redirect to after successful registration',
      control: 'text',
      table: {
        defaultValue: { summary: '/dashboard' },
      },
    },
    showLoginLink: {
      description: 'Show "Already have an account?" login link',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    requireTerms: {
      description: 'Require terms and conditions acceptance',
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
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default registration form with all features enabled
 */
export const Default: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
  },
};

/**
 * Registration form without login link
 */
export const NoLoginLink: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: false,
    requireTerms: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form with login link hidden.',
      },
    },
  },
};

/**
 * Registration form without terms requirement
 */
export const NoTermsRequired: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form without terms and conditions checkbox.',
      },
    },
  },
};

/**
 * Minimal registration form (no extra features)
 */
export const MinimalForm: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: false,
    requireTerms: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal registration form with only required fields: name, email, password, and confirm password.',
      },
    },
  },
};

/**
 * Registration form with custom redirect URL
 */
export const CustomRedirect: Story = {
  args: {
    redirectUrl: '/onboarding',
    showLoginLink: true,
    requireTerms: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form redirecting to a custom onboarding URL after successful registration.',
      },
    },
  },
};

/**
 * Registration form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    className: 'shadow-2xl border-2 border-[var(--primary)]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form with custom className applied for enhanced border and shadow.',
      },
    },
  },
};

/**
 * Registration form with error handling demo
 */
export const WithErrorHandling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    onError: (error: Error) => {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling callback. Try submitting with valid data to see the error handler in action.',
      },
    },
  },
};

/**
 * Registration form with success handling demo
 */
export const WithSuccessHandling: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    onSuccess: (user: any) => {
      console.log('Registration successful:', user);
      alert(`Welcome ${user.name}! Account created for ${user.email}`);
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
 * Registration form on cosmic dark background
 */
export const CosmicTheme: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
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
        story: 'Registration form displayed on cosmic dark background showcasing glass morphism effect.',
      },
    },
  },
};

/**
 * Registration form in narrow mobile container
 */
export const MobileView: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
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
        story: 'Registration form optimized for mobile viewports with responsive layout.',
      },
    },
  },
};

/**
 * Registration form with wide container
 */
export const WideContainer: Story = {
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
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
        story: 'Registration form in a wider container. The form maintains its max-width constraint.',
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
    showLoginLink: true,
    requireTerms: true,
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
          <li>Name: Minimum 2 characters</li>
          <li>Email: Must be a valid email address</li>
          <li>Password: Minimum 8 characters</li>
          <li>Confirm Password: Must match password field</li>
          <li>Terms: Must be accepted</li>
        </ul>
      </div>
      <RegisterForm
        redirectUrl="/dashboard"
        showLoginLink
        requireTerms
        onSuccess={(user) => console.log('Success:', user)}
        onError={(error) => console.error('Error:', error)}
      />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Short name: "A" (shows "Name must be at least 2 characters")</li>
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short password: "pass" (shows "Password must be at least 8 characters")</li>
          <li>Mismatched passwords: Different values in password fields (shows "Passwords don't match")</li>
          <li>Missing terms: Submit without checking terms (shows "You must accept the terms")</li>
          <li>Valid data: "John Doe" + "test@example.com" + "password123" (matching) + terms checked</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates form validation with Zod schema including password matching. Try submitting with invalid data to see error messages.',
      },
    },
  },
};

/**
 * Complete registration flow showcase
 */
export const RegistrationFlow: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Beginne deine Reise</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Erstelle dein Konto und tauche ein in die Welt der spirituellen Entwicklung und persönlichen Transformation.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Zugang zu exklusiven Kursen und Workshops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Personalisierte Lernpfade und Empfehlungen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Community-Zugang und regelmäßige Updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Fortschrittsverfolgung und Zertifikate</span>
            </li>
          </ul>
        </div>
        <div>
          <RegisterForm
            redirectUrl="/dashboard"
            showLoginLink
            requireTerms
            onSuccess={(user) => console.log('Registration successful:', user)}
            onError={(error) => console.error('Registration failed:', error)}
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
          'Complete registration page layout with marketing copy and registration form, showcasing real-world usage.',
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
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Full Features)</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Extra Features)</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink={false} requireTerms={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Terms, No Login Link</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink={false} requireTerms />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-md">
          <RegisterForm
            redirectUrl="/dashboard"
            showLoginLink
            requireTerms
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
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">RegisterForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Visibility Toggle</h3>
          <p className="text-[var(--muted-foreground)]">
            Click the eye icon in the password field to toggle password visibility. The icon changes from Eye to
            EyeOff when password is visible. Note: Confirm password field remains hidden for security.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Matching Validation</h3>
          <p className="text-[var(--muted-foreground)]">
            The form validates that password and confirm password fields match. If they don't match, an error message
            "Passwords don't match" appears below the confirm password field.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Terms Acceptance</h3>
          <p className="text-[var(--muted-foreground)]">
            When requireTerms is true, users must check the terms acceptance checkbox before submitting. The checkbox
            includes a link to the terms page. Submitting without acceptance shows "You must accept the terms" error.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During registration (simulated 1s delay), the submit button shows "Wird erstellt..." and is disabled to
            prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field. Server errors appear in a destructive Alert component
            above the submit button.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Redirect Behavior</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful registration, if redirectUrl is provided, the form automatically redirects using
            window.location.href. If onSuccess callback is provided, it's called before redirect.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Login Link</h3>
          <p className="text-[var(--muted-foreground)]">
            When showLoginLink is true, a "Bereits ein Konto?" link appears below the form, directing existing users
            to the login page.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label. Error
            messages are associated with fields using ARIA attributes. Checkbox is keyboard accessible.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <RegisterForm
          redirectUrl="/dashboard"
          showLoginLink
          requireTerms
          onSuccess={(user) => alert(`Success! Account created for ${user.name} (${user.email})`)}
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
 * Password strength and security guidance
 */
export const PasswordSecurity: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 text-[var(--foreground)]">
          <h2 className="text-3xl font-light">Sichere Passwörter</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Mindestanforderungen</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Mindestens 8 Zeichen lang</li>
                <li>Verwendung von Buchstaben und Zahlen</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Empfohlene Best Practices</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Verwendung von Groß- und Kleinbuchstaben</li>
                <li>Einbeziehung von Sonderzeichen (!@#$%^&*)</li>
                <li>Vermeidung persönlicher Informationen</li>
                <li>Keine Wiederverwendung alter Passwörter</li>
                <li>Verwendung eines Passwort-Managers</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Beispiele für starke Passwörter</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Tr0p!calP@radise2024</li>
                <li>M00nL!ght&Stars99</li>
                <li>C0sm!cJ0urney#2024</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <RegisterForm
            redirectUrl="/dashboard"
            showLoginLink
            requireTerms
            onSuccess={(user) => console.log('Registration successful:', user)}
            onError={(error) => console.error('Registration failed:', error)}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Registration form with password security guidance and best practices display.',
      },
    },
  },
};

/**
 * Multi-step registration preview
 */
export const MultiStepContext: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="text-[var(--foreground)] font-medium">Konto</span>
          </div>
          <div className="w-16 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-[var(--muted-foreground)]">Profil</span>
          </div>
          <div className="w-16 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-[var(--muted-foreground)]">Bestätigung</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex justify-center">
          <RegisterForm
            redirectUrl="/onboarding/profile"
            showLoginLink
            requireTerms
            onSuccess={(user) => console.log('Step 1 complete:', user)}
            onError={(error) => console.error('Registration failed:', error)}
          />
        </div>

        {/* Help text */}
        <div className="text-center text-sm text-[var(--muted-foreground)]">
          <p>Schritt 1 von 3: Erstelle dein Konto mit den Basis-Informationen</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Registration form in a multi-step onboarding context with progress indicator, showing how it fits into a larger registration flow.',
      },
    },
  },
};
