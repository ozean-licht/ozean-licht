import type { Meta, StoryObj } from '@storybook/react';
import { ContactForm } from './ContactForm';
import { fn } from '@storybook/test';

/**
 * ContactForm provides a complete contact interface with name, email, optional subject,
 * and message fields. Features Ozean Licht branding with glass morphism card design,
 * comprehensive validation, and responsive layout.
 *
 * ## Features
 * - React Hook Form with Zod validation
 * - Name validation (minimum 2 characters)
 * - Email validation (valid email format required)
 * - Optional subject field for categorization
 * - Message validation (minimum 10 characters)
 * - Loading state during submission
 * - Success state with automatic dismissal
 * - Error state with Alert component
 * - Responsive grid layout (2 columns on desktop, 1 on mobile)
 * - Glass morphism card design with shadow
 * - Accessible form labels and ARIA attributes
 * - Auto-reset form after successful submission
 *
 * ## Usage
 * ```tsx
 * <ContactForm
 *   onSuccess={(data) => console.log('Message sent:', data)}
 *   onError={(error) => console.error('Send failed:', error)}
 * />
 * ```
 *
 * ## Validation Rules
 * - Name: Minimum 2 characters
 * - Email: Must be a valid email address
 * - Subject: Optional field, no validation
 * - Message: Minimum 10 characters
 *
 * ## Callbacks
 * - `onSuccess`: Called when message is sent successfully (receives ContactFormData)
 * - `onError`: Called when submission fails (receives Error object)
 */
const meta = {
  title: 'Tier 3: Compositions/Forms/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete contact form composition with validation, error handling, and success feedback. Features Ozean Licht branding with glass morphism card design and turquoise accents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: {
      description: 'Callback function called when message is sent successfully',
      control: false,
      action: 'contact-success',
    },
    onError: {
      description: 'Callback function called when submission fails',
      control: false,
      action: 'contact-error',
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
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default contact form with all features enabled
 */
export const Default: Story = {
  args: {},
};

/**
 * Contact form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Contact form with custom className applied for enhanced border and shadow.',
      },
    },
  },
};

/**
 * Contact form with success handling demo
 */
export const WithSuccessHandling: Story = {
  args: {
    onSuccess: (data) => {
      console.log('Message sent:', data);
      alert(`Thank you ${data.name}! Your message has been sent.\n\nEmail: ${data.email}\nSubject: ${data.subject || 'No subject'}\nMessage: ${data.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates success handling callback. Fill out and submit the form to see the success handler in action (simulates 1s API call).',
      },
    },
  },
};

/**
 * Contact form with error handling demo
 */
export const WithErrorHandling: Story = {
  args: {
    onError: (error: Error) => {
      console.error('Send error:', error);
      alert(`Failed to send message: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling callback. The form will show internal error state plus call the onError callback.',
      },
    },
  },
};

/**
 * Contact form on cosmic dark background
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
        story: 'Contact form displayed on cosmic dark background showcasing glass morphism effect.',
      },
    },
  },
};

/**
 * Contact form in narrow mobile container
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
        story: 'Contact form optimized for mobile viewports. The grid layout automatically switches to single column on small screens.',
      },
    },
  },
};

/**
 * Contact form with wide container
 */
export const WideContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Contact form in a wider container. The form maintains its max-width constraint (max-w-2xl).',
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
          <li>Name: Minimum 2 characters</li>
          <li>Email: Must be a valid email address</li>
          <li>Subject: Optional field (no validation)</li>
          <li>Message: Minimum 10 characters</li>
        </ul>
      </div>
      <ContactForm
        onSuccess={(data) => console.log('Success:', data)}
        onError={(error) => console.error('Error:', error)}
      />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Short name: "A" (shows "Name must be at least 2 characters")</li>
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short message: "Hello" (shows "Message must be at least 10 characters")</li>
          <li>Valid data: Name "John Doe", Email "john@example.com", Message "This is a test message with more than 10 characters."</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages appear below each field.',
      },
    },
  },
};

/**
 * Complete contact page showcase
 */
export const ContactPageLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Kontaktiere Uns</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Hast du Fragen zu unseren Kursen oder Angeboten? Wir sind hier, um dir zu helfen.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Wir antworten normalerweise innerhalb von 24 Stunden
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Tritt unserer Community bei für schnellere Antworten
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Telefon Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Mo-Fr: 9:00 - 17:00 Uhr
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ContactForm
            onSuccess={(data) => console.log('Message sent:', data)}
            onError={(error) => console.error('Send failed:', error)}
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
          'Complete contact page layout with information sidebar and contact form, showcasing real-world usage.',
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
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-2xl">
          <ContactForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          In Narrow Container (Mobile-like)
        </h3>
        <div className="max-w-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations and container widths.',
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
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">ContactForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Responsive Layout</h3>
          <p className="text-[var(--muted-foreground)]">
            The form uses a responsive grid layout. Name and Email fields are side-by-side on desktop
            (md:grid-cols-2) and stack vertically on mobile. Subject and Message fields always span full width.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During submission (simulated 1s delay), the submit button shows "Wird gesendet..." and is
            disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            On successful submission, a green success Alert appears with the message "Vielen Dank! Deine Nachricht
            wurde erfolgreich gesendet." The form is automatically reset and the success message disappears after 5
            seconds.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field with red styling. Server errors appear in a destructive
            Alert component above the submit button. Both onSuccess and onError callbacks are called with appropriate
            data.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Form Reset</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form is automatically reset using React Hook Form's reset() function,
            clearing all field values and validation states.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. The Textarea has configurable rows (default: 6).
            Error messages are associated with fields using ARIA attributes from the Input and Textarea components.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Glass Morphism Design</h3>
          <p className="text-[var(--muted-foreground)]">
            The form uses a Card component with default variant, featuring glass morphism effect with subtle backdrop
            blur. The card has shadow-lg for depth and max-w-2xl constraint. The title "Kontaktiere Uns" uses text-2xl
            font-light for elegant typography.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <ContactForm
          onSuccess={(data) => alert(`Success! Message from ${data.name} (${data.email})`)}
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
 * Loading state demonstration
 */
export const LoadingState: Story = {
  render: () => {
    // Note: This is a visual demo. In real usage, loading state is managed internally
    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Loading State Demo</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Submit the form below to see the loading state in action. The button text changes to "Wird gesendet..." and
            becomes disabled during the simulated 1-second API call.
          </p>
        </div>
        <ContactForm
          onSuccess={(data) => console.log('Message sent:', data)}
          onError={(error) => console.error('Send failed:', error)}
        />
      </div>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates the loading state during form submission. Fill out and submit the form to see the button change to "Wird gesendet..." state.',
      },
    },
  },
};

/**
 * Success feedback demonstration
 */
export const SuccessFeedback: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Success Feedback Demo</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Submit the form below to see the success feedback. A green Alert appears with a success message, the form
          resets automatically, and the success message disappears after 5 seconds.
        </p>
      </div>
      <ContactForm
        onSuccess={(data) => console.log('Message sent:', data)}
        onError={(error) => console.error('Send failed:', error)}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates the success feedback flow. Submit the form to see the green success Alert, automatic form reset, and auto-dismissal after 5 seconds.',
      },
    },
  },
};

/**
 * Subject field usage showcase
 */
export const SubjectFieldShowcase: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Subject Field (Optional)</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          The subject field is optional and can be used to categorize messages. It appears between the name/email row
          and the message textarea. Try submitting with and without a subject to see how both cases are handled.
        </p>
      </div>
      <ContactForm
        onSuccess={(data) => {
          console.log('Message sent:', data);
          alert(
            `Message received!\n\nFrom: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject || '(No subject)'}\n\nMessage:\n${data.message}`
          );
        }}
        onError={(error) => console.error('Send failed:', error)}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Showcases the optional subject field. Submit the form with and without a subject to see how ContactFormData includes or omits the subject field.',
      },
    },
  },
};
