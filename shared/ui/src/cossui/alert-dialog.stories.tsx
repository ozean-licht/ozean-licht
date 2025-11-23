import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'
import { Button } from './button'

const meta: Meta<typeof AlertDialog> = {
  title: 'CossUI/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AlertDialog component from Coss UI with glass morphism effects for Ozean Licht. A modal dialog that interrupts the user with important content and expects a response. Perfect for confirmations, warnings, and destructive actions. Uses Base UI primitives with Ozean Licht design system.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Alert dialogs should have accessible titles and descriptions
            id: 'dialog-name',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AlertDialog>

/**
 * Default Alert Dialog
 * A simple alert dialog with trigger button, title, description, and action buttons.
 * Demonstrates the basic alert dialog pattern with all common elements.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Show Alert</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Delete Confirmation
 * An alert dialog designed for confirming destructive delete operations.
 * Uses destructive styling to communicate the severity of the action.
 */
export const DeleteConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Delete Item</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item. This action cannot be undone and all
              associated data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 hover:shadow-red-500/20">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Delete Account Confirmation
 * A critical alert dialog for account deletion with strong warning styling.
 * Includes additional warning text to emphasize the severity of the action.
 */
export const DeleteAccount: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="bg-red-500 hover:bg-red-600">
          Delete Account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Your Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible and will permanently delete your account along with
              all your data, settings, and associated content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-lg my-4">
            <p className="text-sm text-red-300 font-medium">
              Warning: All your projects, files, and personal settings will be lost forever.
              Please make sure you have backed up any important data before proceeding.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Account</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 hover:shadow-red-500/20">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Form Submission Confirmation
 * Alert dialog for confirming form submissions before processing.
 * Shows a summary of what will be submitted.
 */
export const FormSubmissionConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Submit Form</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your information before submitting. Once submitted, you won't be
              able to edit this form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6 bg-card/50 border border-border rounded-lg my-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#C4C8D4]">Name:</span>
              <span className="text-white font-medium">John Doe</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#C4C8D4]">Email:</span>
              <span className="text-white font-medium">john@example.com</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#C4C8D4]">Department:</span>
              <span className="text-white font-medium">Engineering</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Async Action Confirmation
 * Alert dialog that simulates an async action with loading state.
 * Demonstrates how to handle asynchronous operations in alert dialogs.
 */
export const AsyncActionConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
      setLoading(true)
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
      setOpen(false)
    }

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Process Payment</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to process a payment of $1,234.56. This action will charge your
              default payment method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirm()
              }}
              disabled={loading}
              className={loading ? 'opacity-50' : ''}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Custom Buttons
 * Alert dialog with custom styled buttons using the render prop.
 * Demonstrates how to use custom button components as triggers and actions.
 */
export const CustomButtons: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          Custom Trigger
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Custom Styled Actions</AlertDialogTitle>
            <AlertDialogDescription>
              This alert dialog uses custom styled buttons for both the trigger and action
              buttons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="ghost" size="sm" />}>
              No Thanks
            </AlertDialogCancel>
            <AlertDialogAction render={<Button variant="primary" size="sm" />}>
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Without Cancel Button
 * Alert dialog with only an action button (no cancel option).
 * Used for non-dismissible confirmations or acknowledgments.
 */
export const WithoutCancelButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Show Acknowledgment</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terms Accepted</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully accepted the terms and conditions. Click continue to
              proceed to your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue to Dashboard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Long Content with Scrolling
 * Alert dialog with long content that requires scrolling.
 * Demonstrates proper handling of overflow content.
 */
export const LongContentWithScrolling: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>View Terms</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[80vh] flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Please read and accept our terms and conditions before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="overflow-y-auto flex-1 px-6 py-4 -mx-6">
            <div className="space-y-4 text-sm text-[#C4C8D4] font-sans font-light">
              <h3 className="text-lg font-medium text-white">1. Introduction</h3>
              <p>
                These Terms and Conditions govern your use of our services. By accessing or
                using our platform, you agree to be bound by these terms.
              </p>
              <h3 className="text-lg font-medium text-white">2. User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur
                under your account.
              </p>
              <h3 className="text-lg font-medium text-white">3. Privacy Policy</h3>
              <p>
                We collect and process your personal data in accordance with our Privacy
                Policy. By using our services, you consent to such processing and you warrant
                that all data provided by you is accurate.
              </p>
              <h3 className="text-lg font-medium text-white">4. Intellectual Property</h3>
              <p>
                All content included on our platform, such as text, graphics, logos, and
                software, is the property of our company or its content suppliers and is
                protected by international copyright laws.
              </p>
              <h3 className="text-lg font-medium text-white">5. Limitation of Liability</h3>
              <p>
                We shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of or inability to use our
                services.
              </p>
              <h3 className="text-lg font-medium text-white">6. Termination</h3>
              <p>
                We may terminate or suspend your account and bar access to the service
                immediately, without prior notice or liability, under our sole discretion, for
                any reason whatsoever.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Decline</AlertDialogCancel>
            <AlertDialogAction>Accept Terms</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Multiple Actions
 * Alert dialog with more than two action buttons.
 * Useful for scenarios requiring multiple choices.
 */
export const MultipleActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Save Changes</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
            <AlertDialogAction className="sm:w-full">Save Changes</AlertDialogAction>
            <AlertDialogAction className="sm:w-full bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/20">
              Save as Draft
            </AlertDialogAction>
            <AlertDialogCancel className="sm:w-full">Discard Changes</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Glass Effect Variant
 * Alert dialog with enhanced glass morphism effect.
 * Showcases the visual depth created by backdrop blur and transparency.
 */
export const GlassEffectVariant: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger>Open Glass Alert</AlertDialogTrigger>
          <AlertDialogContent className="backdrop-blur-24 bg-card/70 border-primary/30">
            <AlertDialogHeader>
              <AlertDialogTitle>Enhanced Glass Effect</AlertDialogTitle>
              <AlertDialogDescription>
                This alert dialog features enhanced glass morphism with stronger backdrop blur
                and semi-transparent background for a modern, floating appearance.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 px-6 bg-primary/10 border border-primary/20 rounded-lg my-4">
              <p className="text-sm text-primary font-medium">
                The glass effect creates visual depth and elegance while maintaining excellent
                readability and accessibility.
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Dismiss</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  },
}

/**
 * Warning Alert
 * Alert dialog with warning styling and icons.
 * Used for important warnings that require user attention.
 */
export const WarningAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="bg-amber-500 hover:bg-amber-600">
          Show Warning
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-400">
              Security Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              Disabling two-factor authentication will make your account less secure. Are you
              sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6 bg-amber-500/10 border border-amber-500/20 rounded-lg my-4">
            <p className="text-sm text-amber-300">
              Without 2FA, your account will be vulnerable to unauthorized access. We strongly
              recommend keeping this security feature enabled.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Enabled</AlertDialogCancel>
            <AlertDialogAction className="bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/20">
              Disable 2FA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Success Confirmation
 * Alert dialog with success styling and positive messaging.
 * Used to confirm successful operations.
 */
export const SuccessConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="bg-green-500 hover:bg-green-600">
          Complete Action
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-400">
              Action Successful
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your changes have been saved successfully. All data has been synchronized with
              the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6 bg-green-500/10 border border-green-500/20 rounded-lg my-4">
            <p className="text-sm text-green-300">
              Transaction ID: #TXN-2024-87543
            </p>
            <p className="text-sm text-green-300 mt-1">
              Timestamp: {new Date().toLocaleString()}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-green-500 hover:bg-green-600 hover:shadow-green-500/20">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Info Alert
 * Alert dialog with informational styling.
 * Used for providing helpful information that requires acknowledgment.
 */
export const InfoAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="bg-blue-500 hover:bg-blue-600">
          Show Info
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-400">
              Important Information
            </AlertDialogTitle>
            <AlertDialogDescription>
              Scheduled maintenance will occur on Sunday, December 15th from 2:00 AM to 6:00
              AM UTC. Some features may be unavailable during this time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6 bg-blue-500/10 border border-blue-500/20 rounded-lg my-4 space-y-2">
            <p className="text-sm text-blue-300 font-medium">What to expect:</p>
            <ul className="text-sm text-blue-300 space-y-1 ml-4">
              <li>• Brief service interruptions</li>
              <li>• Temporary read-only mode</li>
              <li>• Delayed email notifications</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/20">
              Acknowledged
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Compact Alert
 * A smaller, more compact alert dialog for simple confirmations.
 * Useful for quick yes/no decisions.
 */
export const CompactAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button size="sm" />}>Logout</AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel render={<Button variant="ghost" size="sm" />}>No</AlertDialogCancel>
            <AlertDialogAction render={<Button variant="primary" size="sm" />}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Wide Alert
 * A wider alert dialog suitable for content-rich confirmations.
 * Demonstrates responsive sizing options.
 */
export const WideAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>View Details</AlertDialogTrigger>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Export Data Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to export the following data. Please review before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Users', value: '1,234' },
                { label: 'Projects', value: '567' },
                { label: 'Documents', value: '8,901' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card/50 border border-border rounded-lg p-4 text-center"
                >
                  <p className="text-xs text-[#C4C8D4] uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-decorative text-primary mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel Export</AlertDialogCancel>
            <AlertDialogAction>Export All Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Minimal Alert
 * A minimal alert dialog with only essential elements.
 * Perfect for simple confirmations without extra content.
 */
export const MinimalAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Clear Cache</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cache?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Custom Styled Alert
 * Alert dialog with custom styling and borders.
 * Demonstrates the flexibility of the component for branded experiences.
 */
export const CustomStyledAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Premium Feature</AlertDialogTrigger>
        <AlertDialogContent className="border-2 border-primary shadow-xl shadow-primary/25">
          <AlertDialogHeader className="bg-gradient-to-r from-primary/20 to-transparent pb-4 -m-6 mb-0 px-6 py-4 rounded-t-lg">
            <AlertDialogTitle className="text-primary text-3xl">
              Upgrade to Premium
            </AlertDialogTitle>
            <AlertDialogDescription>
              Unlock all premium features and get unlimited access to our platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-6 px-6">
            <div className="space-y-3">
              {[
                'Unlimited projects',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-[#C4C8D4]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction>Upgrade Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Input with Alert
 * Alert dialog that includes an input field for user confirmation.
 * Useful for critical actions requiring explicit user input.
 */
export const InputWithAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const confirmationText = 'DELETE'

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="bg-red-500 hover:bg-red-600">
          Delete Database
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Delete Database?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the entire database. This action is irreversible and
              all data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-6">
            <label className="text-sm font-medium text-[#C4C8D4] block mb-2">
              Type <span className="text-red-400 font-bold">{confirmationText}</span> to
              confirm:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-red-500/50 bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              placeholder={confirmationText}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInputValue('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={inputValue !== confirmationText}
              className="bg-red-500 hover:bg-red-600 hover:shadow-red-500/20 disabled:opacity-30"
            >
              Delete Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

/**
 * Multiple Alerts
 * Demonstrates multiple independent alert dialogs on the same page.
 * Shows how alerts can coexist and be triggered separately.
 */
export const MultipleAlerts: Story = {
  render: () => {
    const [alert1Open, setAlert1Open] = useState(false)
    const [alert2Open, setAlert2Open] = useState(false)
    const [alert3Open, setAlert3Open] = useState(false)

    return (
      <div className="flex gap-3 flex-wrap justify-center">
        <AlertDialog open={alert1Open} onOpenChange={setAlert1Open}>
          <AlertDialogTrigger render={<Button size="sm" />}>Info</AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-blue-400">Information</AlertDialogTitle>
              <AlertDialogDescription>This is an informational alert.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={alert2Open} onOpenChange={setAlert2Open}>
          <AlertDialogTrigger render={<Button size="sm" className="bg-amber-500 hover:bg-amber-600" />}>
            Warning
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-amber-400">Warning</AlertDialogTitle>
              <AlertDialogDescription>This is a warning alert.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-amber-500 hover:bg-amber-600">
                Understood
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={alert3Open} onOpenChange={setAlert3Open}>
          <AlertDialogTrigger render={<Button size="sm" className="bg-red-500 hover:bg-red-600" />}>
            Error
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400">Error</AlertDialogTitle>
              <AlertDialogDescription>This is an error alert.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                Dismiss
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  },
}

/**
 * Programmatic Control
 * Demonstrates programmatic control of alert dialog state.
 * Useful for triggering alerts from external actions or events.
 */
export const ProgrammaticControl: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const triggerAlert = () => {
      setOpen(true)
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={triggerAlert}>Trigger Alert</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close Alert
          </Button>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Programmatically Triggered</AlertDialogTitle>
              <AlertDialogDescription>
                This alert was opened programmatically without a trigger button.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  },
}
