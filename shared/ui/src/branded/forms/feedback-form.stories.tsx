'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import React from 'react'
import { FeedbackForm, type FeedbackFormData } from './feedback-form'

/**
 * FeedbackForm - Comprehensive feedback collection form for Ozean Licht community.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan dark theme.
 *
 * ## Features
 * - **Dark Oceanic Design**: bg-[#00151a] container with [#052a2a] borders
 * - **Text Input Fields**: First name, last name, email with Montserrat Alt font
 * - **Large Textarea**: 6-row feedback textarea for detailed input
 * - **Compliance Checkboxes**: Terms and Privacy agreement checkboxes
 * - **Send Icon CTA**: Uses CtaButton with Send icon from lucide-react
 * - **Configurable Text**: All labels, title, description, and button text customizable
 * - **Form Submission**: onSubmit callback with full FeedbackFormData object
 * - **Success Message**: Customizable success message on submission
 * - **Responsive Layout**: Grid layout for name fields (2 cols on desktop, 1 on mobile)
 *
 * ## Data Structure
 * ```typescript
 * interface FeedbackFormData {
 *   firstName: string
 *   lastName: string
 *   email: string
 *   feedback: string
 *   agreeTerms: boolean
 *   agreePrivacy: boolean
 * }
 * ```
 *
 * ## Austrian Context
 * Default content is in German (Austrian context):
 * - Title: "Dein Feedback Ist Uns Wichtig"
 * - Description: Detailed text about contributing to Ozean Licht
 * - Checkbox labels: German terms and privacy agreements
 * - Button: "Feedback Senden"
 * - Success: "Vielen Dank für dein Feedback! Wir melden uns bald bei dir."
 *
 * ## Usage
 * Use for collecting feedback from users about platform improvements,
 * feature requests, bug reports, and general user experience.
 */
const meta = {
  title: 'Tier 2: Branded/Forms/FeedbackForm',
  component: FeedbackForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive feedback form styled with Ozean Licht dark oceanic theme. Collects user feedback with email contact information and compliance agreements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Form heading title',
      table: {
        defaultValue: { summary: 'Dein Feedback Ist Uns Wichtig' },
      },
    },
    description: {
      control: 'text',
      description: 'Form description text (supports multiline with \\n)',
      table: {
        type: { summary: 'string' },
      },
    },
    submitButtonText: {
      control: 'text',
      description: 'Submit button label',
      table: {
        defaultValue: { summary: 'Feedback Senden' },
      },
    },
    successMessage: {
      control: 'text',
      description: 'Message shown after successful submission',
      table: {
        defaultValue: { summary: 'Vielen Dank für dein Feedback! Wir melden uns bald bei dir.' },
      },
    },
    termsLabel: {
      control: 'text',
      description: 'Label for terms agreement checkbox',
      table: {
        defaultValue: { summary: '*Ich erkläre mich bereit, mein Feedback veröffentlichen zu lassen.' },
      },
    },
    privacyLabel: {
      control: 'text',
      description: 'Label for privacy agreement checkbox',
      table: {
        defaultValue: { summary: '*Ich habe die Datenschutzerklärung gelesen und erkläre mich damit einverstanden.' },
      },
    },
    onSubmit: {
      description: 'Callback fired when form is submitted with FeedbackFormData',
      action: 'submitted',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the form container',
    },
  },
  args: {
    onSubmit: fn((data: FeedbackFormData) => {
      console.log('Feedback submitted:', data)
    }),
  },
} satisfies Meta<typeof FeedbackForm>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default feedback form with German content (Austrian context).
 * All fields and labels in German as per project defaults.
 */
export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form with custom title and description.
 * Demonstrates how to customize the form heading and introductory text.
 */
export const CustomTitleAndDescription: Story = {
  args: {
    title: 'Wir Möchten Von Dir Hören',
    description: 'Deine Meinung ist wertvoll für uns. Teile deine Gedanken und Ideen mit unserem Team.',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form with custom agreement labels.
 * Shows how to customize the checkbox labels for terms and privacy.
 */
export const CustomAgreementLabels: Story = {
  args: {
    termsLabel: '*Ich möchte, dass mein Feedback öffentlich sichtbar ist.',
    privacyLabel: '*Ich habe die Datenschutzbestimmungen akzeptiert.',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form with long description text.
 * Demonstrates how the form handles extensive descriptive text.
 */
export const LongDescription: Story = {
  args: {
    description:
      'Willkommen in unserem Feedback-Portal!\n\nHilf uns, Ozean Licht weiterzuentwickeln und noch besser auf die Bedürfnisse unserer Community einzugehen. Deine ehrliche und konstruktive Rückmeldung ist wertvoll für uns.\n\nOb du Verbesserungsvorschläge für unsere Systeme hast, dir etwas Besonderes aufgefallen ist oder du einfach deine Erfahrung mit uns teilen möchtest – dieser Raum ist für deine Worte geschaffen. 💫\n\nWir lesen und bewerten jeden Beitrag und kontaktieren dich bei Rückfragen gerne.',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form with submission handling and state display.
 * Shows how to capture form data and display it in the component.
 */
export const WithSubmissionHandling: Story = {
  render: function WithSubmissionExample() {
    const [submittedData, setSubmittedData] = React.useState<FeedbackFormData | null>(null)
    const [showData, setShowData] = React.useState(false)

    const handleSubmit = (data: FeedbackFormData) => {
      console.log('Form submitted with data:', data)
      setSubmittedData(data)
      setShowData(true)
    }

    return (
      <div className="bg-background p-8 rounded-lg max-w-2xl space-y-6">
        <FeedbackForm onSubmit={handleSubmit} />

        {showData && submittedData && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 space-y-2">
            <h3 className="text-green-400 font-cinzel-decorative text-lg">Feedback erhalten:</h3>
            <dl className="text-white/80 text-sm space-y-1">
              <dt className="font-montserrat-alt font-semibold text-green-300">Name:</dt>
              <dd className="ml-4">
                {submittedData.firstName} {submittedData.lastName}
              </dd>
              <dt className="font-montserrat-alt font-semibold text-green-300 mt-2">Email:</dt>
              <dd className="ml-4">{submittedData.email}</dd>
              <dt className="font-montserrat-alt font-semibold text-green-300 mt-2">Feedback:</dt>
              <dd className="ml-4">{submittedData.feedback}</dd>
              <dt className="font-montserrat-alt font-semibold text-green-300 mt-2">Vereinbarungen:</dt>
              <dd className="ml-4">
                Bedingungen: {submittedData.agreeTerms ? '✓ Ja' : '✗ Nein'} | Datenschutz:{' '}
                {submittedData.agreePrivacy ? '✓ Ja' : '✗ Nein'}
              </dd>
            </dl>
          </div>
        )}
      </div>
    )
  },
}

/**
 * English version of the form.
 * Demonstrates how to use the form with English content.
 */
export const EnglishVersion: Story = {
  args: {
    title: 'We Value Your Feedback',
    description:
      'Help us improve Ozean Licht and better serve our community.\n\nWhether you have suggestions for our systems, noticed something special, or simply want to share your experience with us – this space is created for your words. 💫',
    submitButtonText: 'Send Feedback',
    successMessage: 'Thank you for your feedback! We will get back to you soon.',
    termsLabel: '*I agree to have my feedback published.',
    privacyLabel: '*I have read the privacy policy and agree to it.',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Multiple feedback forms in a comparison layout.
 * Shows German and English versions side by side.
 */
export const LanguageComparison: Story = {
  render: function LanguageComparisonExample() {
    const handleSubmitDE = fn((data: FeedbackFormData) => {
      console.log('German form submitted:', data)
    })

    const handleSubmitEN = fn((data: FeedbackFormData) => {
      console.log('English form submitted:', data)
    })

    return (
      <div className="bg-background rounded-lg space-y-8">
        <div>
          <h3 className="text-white font-cinzel-decorative text-lg mb-4">Deutsch (Österreich)</h3>
          <FeedbackForm onSubmit={handleSubmitDE} />
        </div>
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white font-cinzel-decorative text-lg mb-4">English</h3>
          <FeedbackForm
            onSubmit={handleSubmitEN}
            title="We Value Your Feedback"
            description="Help us improve Ozean Licht and better serve our community.\n\nWhether you have suggestions for our systems, noticed something special, or simply want to share your experience with us – this space is created for your words. 💫"
            submitButtonText="Send Feedback"
            successMessage="Thank you for your feedback! We will get back to you soon."
            termsLabel="*I agree to have my feedback published."
            privacyLabel="*I have read the privacy policy and agree to it."
          />
        </div>
      </div>
    )
  },
}

/**
 * Form in full-width container.
 * Demonstrates responsive behavior in a wider layout.
 */
export const FullWidth: Story = {
  render: (args) => (
    <div className="bg-background p-8 min-h-screen">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form with custom button text.
 * Shows how to change the CTA button text for different contexts.
 */
export const CustomButtonText: Story = {
  args: {
    submitButtonText: 'Jetzt Absenden',
    successMessage: 'Danke! Dein Feedback wurde erfolgreich übermittelt.',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}

/**
 * Form in a page section with surrounding content.
 * Shows how the form integrates into a full page layout.
 */
export const InPageSection: Story = {
  render: (args) => (
    <div className="bg-background min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-white font-cinzel-decorative text-4xl mb-4">Feedback & Support</h1>
          <p className="text-white/70 text-lg">
            Wir möchten von dir hören! Dein Feedback hilft uns, Ozean Licht ständig zu verbessern.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeedbackForm {...args} />
          </div>

          <div className="space-y-6">
            <div className="bg-[#00151a] border border-[#052a2a] rounded-xl p-6">
              <h3 className="text-white font-cinzel-decorative text-lg mb-3">Kontakt</h3>
              <p className="text-white/70 text-sm mb-2">
                <span className="font-montserrat-alt font-semibold text-white">Email:</span>
                <br />
                contact@ozean-licht.dev
              </p>
            </div>

            <div className="bg-[#00151a] border border-[#052a2a] rounded-xl p-6">
              <h3 className="text-white font-cinzel-decorative text-lg mb-3">FAQ</h3>
              <p className="text-white/70 text-sm">
                Häufig gestellte Fragen und Antworten findest du in unserem Help Center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Form with minimal styling override.
 * Demonstrates how className prop can be used for custom styling.
 */
export const CustomStyling: Story = {
  args: {
    className: 'border-2 border-primary shadow-lg shadow-primary/20',
  },
  render: (args) => (
    <div className="bg-background p-8 rounded-lg max-w-2xl">
      <FeedbackForm {...args} />
    </div>
  ),
}
