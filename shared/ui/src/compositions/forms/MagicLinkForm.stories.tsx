import type { Meta, StoryObj } from '@storybook/react';
import { MagicLinkForm } from './MagicLinkForm';
import { fn } from '@storybook/test';

/**
 * MagicLinkForm provides a passwordless authentication interface that sends
 * a secure login link to the user's email. Features Ozean Licht branding
 * with glass morphism card design and smooth state transitions.
 *
 * ## Features
 * - React Hook Form with Zod validation
 * - Email validation (valid email format required)
 * - Passwordless authentication (magic link via email)
 * - Loading state during magic link generation
 * - Success state with confirmation message
 * - Error state with Alert component
 * - Optional link to password-based login
 * - Glass morphism card design
 * - Responsive layout with max-width constraint
 * - Accessible form labels and ARIA attributes
 *
 * ## Usage
 * ```tsx
 * <MagicLinkForm
 *   onSuccess={() => console.log('Magic link sent successfully')}
 *   onError={(error) => console.error('Failed to send magic link:', error)}
 *   redirectUrl="/check-email"
 * />
 * ```
 *
 * ## Validation Rules
 * - Email: Must be a valid email address
 *
 * ## Callbacks
 * - `onSuccess`: Called when magic link is sent successfully
 * - `onError`: Called when magic link sending fails (receives Error object)
 *
 * ## Workflow
 * 1. User enters their email address
 * 2. Clicks "Magic Link Senden" button
 * 3. System validates email format
 * 4. Sends magic link to email address (simulated 1s delay)
 * 5. Shows success message or error alert
 * 6. User checks email and clicks magic link to authenticate
 */
const meta = {
  title: 'Tier 3: Compositions/Forms/MagicLinkForm',
  component: MagicLinkForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Passwordless authentication form that sends a secure magic link to the user\'s email. Features Ozean Licht branding with glass morphism card design and turquoise accents. Provides a smooth user experience with clear state feedback.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: {
      description: 'Callback function called when magic link is sent successfully',
      control: false,
      action: 'magic-link-success',
    },
    onError: {
      description: 'Callback function called when magic link sending fails',
      control: false,
      action: 'magic-link-error',
    },
    redirectUrl: {
      description: 'URL to redirect to after successful magic link sending (optional)',
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
} satisfies Meta<typeof MagicLinkForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default magic link form with standard configuration
 */
export const Default: Story = {
  args: {},
};

/**
 * Magic link form with redirect URL
 */
export const WithRedirect: Story = {
  args: {
    redirectUrl: '/check-email',
  },
  parameters: {
    docs: {
      description: {
        story: 'Magic link form configured to redirect to a confirmation page after sending the link.',
      },
    },
  },
};

/**
 * Magic link form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Magic link form with custom className applied for enhanced border and shadow effects.',
      },
    },
  },
};

/**
 * Magic link form with success handling demo
 */
export const WithSuccessHandling: Story = {
  args: {
    onSuccess: () => {
      console.log('Magic link sent successfully');
      alert('Magic link has been sent to your email! Check your inbox.');
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
 * Magic link form with error handling demo
 */
export const WithErrorHandling: Story = {
  args: {
    onError: (error: Error) => {
      console.error('Magic link error:', error);
      alert(`Failed to send magic link: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling callback. The form shows inline errors for validation and server errors in an Alert component.',
      },
    },
  },
};

/**
 * Magic link form on cosmic dark background
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
        story: 'Magic link form displayed on cosmic dark background showcasing glass morphism effect and turquoise accents.',
      },
    },
  },
};

/**
 * Magic link form in narrow mobile container
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
        story: 'Magic link form optimized for mobile viewports with responsive layout.',
      },
    },
  },
};

/**
 * Magic link form with wide container
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
        story: 'Magic link form in a wider container. The form maintains its max-width constraint.',
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
      <MagicLinkForm
        onSuccess={() => console.log('Magic link sent')}
        onError={(error) => console.error('Error:', error)}
      />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Invalid email: "test@" (shows "Invalid email address")</li>
          <li>Invalid email: "@example.com" (shows "Invalid email address")</li>
          <li>Valid email: "test@example.com" (submits successfully)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates form validation with Zod schema. Try submitting with invalid email formats to see error messages.',
      },
    },
  },
};

/**
 * Complete passwordless authentication flow showcase
 */
export const PasswordlessAuthFlow: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Sicher & Einfach</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Melde dich ohne Passwort an. Wir senden dir einen sicheren Link per E-Mail,
            mit dem du dich sofort anmelden kannst.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Kein Passwort merken - einfach E-Mail eingeben</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Höhere Sicherheit durch zeitlich begrenzte Links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Funktioniert auf allen deinen Geräten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Keine Sorgen über vergessene Passwörter</span>
            </li>
          </ul>
          <div className="p-4 bg-[var(--card)]/50 rounded-lg border border-[var(--border)]">
            <h3 className="font-semibold mb-2 text-sm">So funktioniert's:</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--muted-foreground)]">
              <li>E-Mail-Adresse eingeben</li>
              <li>Magic Link anfordern</li>
              <li>E-Mail in deinem Postfach öffnen</li>
              <li>Auf den Link klicken und automatisch anmelden</li>
            </ol>
          </div>
        </div>
        <div>
          <MagicLinkForm
            onSuccess={() => console.log('Magic link sent')}
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
        story:
          'Complete passwordless authentication page layout with marketing copy and magic link form, showcasing real-world usage.',
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
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Initial)</h3>
        <div className="max-w-md">
          <MagicLinkForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Custom Styling</h3>
        <div className="max-w-md">
          <MagicLinkForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Redirect Configuration
        </h3>
        <div className="max-w-md">
          <MagicLinkForm redirectUrl="/check-email" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations.',
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
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">MagicLinkForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Initial State</h3>
          <p className="text-[var(--muted-foreground)]">
            Form shows with title "Magic Link Anmeldung", description explaining passwordless auth,
            email input field, submit button, and a link to password-based login at the bottom.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During magic link generation (simulated 1s delay), the submit button shows "Wird gesendet..."
            and is disabled to prevent duplicate submissions. All form interactions are blocked.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form is replaced with a green success Alert showing the message:
            "Ein Magic Link wurde an deine E-Mail-Adresse gesendet. Überprüfe dein Postfach."
            The login link remains visible at the bottom.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below the email field with red text. Server errors appear
            in a destructive Alert component above the submit button, with clear error message.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Email Validation</h3>
          <p className="text-[var(--muted-foreground)]">
            Uses Zod schema validation to ensure email format is correct before submission.
            Invalid formats trigger inline error message: "Invalid email address".
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Alternative Login</h3>
          <p className="text-[var(--muted-foreground)]">
            At the bottom of the form, users can find a link "Mit Passwort anmelden" to switch
            to traditional password-based authentication if preferred.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            Email field has proper label with htmlFor attribute. Error messages are associated
            with the field using ARIA attributes. All interactive elements are keyboard accessible.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Callbacks</h3>
          <p className="text-[var(--muted-foreground)]">
            <strong>onSuccess</strong>: Called after magic link is sent successfully. Use this to track
            analytics, show additional UI, or perform redirects.<br />
            <strong>onError</strong>: Called when magic link sending fails. Receives Error object with
            details about the failure.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <MagicLinkForm
          onSuccess={() => alert('Magic link sent! Check your email.')}
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
 * Security & UX best practices showcase
 */
export const SecurityAndUX: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
          Security & UX Best Practices
        </h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <h3 className="font-semibold mb-2 text-green-400">Security Benefits</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>No password storage or transmission</li>
            <li>Time-limited authentication tokens</li>
            <li>Single-use links prevent replay attacks</li>
            <li>Email verification built into authentication</li>
            <li>Reduced risk of credential stuffing</li>
            <li>No password reset flows needed</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h3 className="font-semibold mb-2 text-blue-400">User Experience Benefits</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Faster login process (no password typing)</li>
            <li>Works across all devices seamlessly</li>
            <li>No password memory burden</li>
            <li>Reduced login friction</li>
            <li>Clear success feedback</li>
            <li>Graceful error handling</li>
          </ul>
        </div>

        <div className="p-4 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/30">
          <h3 className="font-semibold mb-2 text-[var(--primary)]">Implementation Best Practices</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Validate email format before submission</li>
            <li>Show clear loading states during API calls</li>
            <li>Display success message after link is sent</li>
            <li>Provide fallback to password login</li>
            <li>Rate limit requests to prevent abuse</li>
            <li>Set appropriate token expiration (15-30 minutes)</li>
            <li>Log authentication events for security monitoring</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <h3 className="font-semibold mb-2 text-yellow-400">Potential Issues to Consider</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Users must have access to their email</li>
            <li>Email delivery can be delayed</li>
            <li>Links may be marked as spam</li>
            <li>Mobile email clients may have poor UX</li>
            <li>Requires fallback for email access issues</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          Recommended Email Template
        </h3>
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] font-mono text-xs">
          <div className="space-y-2">
            <p className="text-[var(--foreground)]">Subject: Dein Anmelde-Link für Ozean Licht</p>
            <div className="border-t border-[var(--border)] pt-2 mt-2 space-y-2 text-[var(--muted-foreground)]">
              <p>Hallo,</p>
              <p>Du hast einen Magic Link für die Anmeldung bei Ozean Licht angefordert.</p>
              <p>Klicke auf den folgenden Link, um dich anzumelden:</p>
              <p className="text-[var(--primary)]">[MAGIC LINK BUTTON]</p>
              <p>Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden.</p>
              <p>Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
              <p>Viele Grüße,<br />Dein Ozean Licht Team</p>
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
          'Comprehensive guide to security considerations, UX benefits, and implementation best practices for magic link authentication.',
      },
    },
  },
};

/**
 * Integration example with routing
 */
export const IntegrationExample: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Integration Example</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Example showing how to integrate MagicLinkForm with Next.js routing and API
        </p>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          1. API Route Handler (app/api/auth/magic-link/route.ts)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{`import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate and send magic link
    await sendMagicLink(email);

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}`}</code>
        </pre>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          2. Page Component (app/auth/magic-link/page.tsx)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{`'use client';
import { useRouter } from 'next/navigation';
import { MagicLinkForm } from '@shared/ui';

export default function MagicLinkPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MagicLinkForm
        onSuccess={() => {
          router.push('/auth/check-email');
        }}
        onError={(error) => {
          console.error('Magic link error:', error);
          // Show toast notification
        }}
      />
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          3. Email Verification Page (app/auth/check-email/page.tsx)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{`export default function CheckEmailPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-light">Check Your Email</h1>
      <p>We've sent you a magic link.</p>
      <p>Click the link in your email to sign in.</p>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try the form:</h3>
        <MagicLinkForm
          onSuccess={() => alert('Redirecting to /auth/check-email...')}
          onError={(error) => alert(`Error: ${error.message}`)}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete integration example showing API routes, page components, and form usage.',
      },
    },
  },
};
