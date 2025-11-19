import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog'
import { Button } from './button'

const meta: Meta<typeof Dialog> = {
  title: 'CossUI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialog component from Coss UI with glass morphism effects for Ozean Licht. Uses `DialogPopup` instead of `DialogContent` (Coss UI convention). Provides fully composable modal experience with backdrop blur and smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

/**
 * Default Dialog
 * A simple dialog with trigger button, title, description, and action buttons.
 * Demonstrates the basic dialog pattern with all common elements.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a basic dialog component. Click the close button or the backdrop to dismiss.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Confirmation Dialog
 * A dialog designed for confirming important user actions.
 * Typically used for destructive or irreversible operations.
 */
export const ConfirmationDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Delete Account</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all
              associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="destructive">Delete Account</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Form Dialog
 * A dialog containing a form with multiple input fields.
 * Perfect for collecting user information in a modal context.
 */
export const FormDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Create New User</DialogTrigger>
        <DialogPopup className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="primary">Create User</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Dialog with Long Content
 * Demonstrates dialog behavior with scrollable content that exceeds viewport height.
 * Content automatically scrolls within the dialog while maintaining header and footer visibility.
 */
export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>View Terms & Conditions</DialogTrigger>
        <DialogPopup className="w-full max-w-2xl max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>
              Please read our terms and conditions carefully before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">Section 1: Overview</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">Section 2: Rights and Obligations</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">Section 3: Limitation of Liability</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">Section 4: Indemnification</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
              magnam aliquam quaerat voluptatem.
            </p>
            <h3 className="text-lg font-medium text-white mb-2">Section 5: Governing Law</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut quid ex ea commodi consequatur.
            </p>
          </div>
          <DialogFooter>
            <DialogClose>Decline</DialogClose>
            <Button variant="primary">Accept & Continue</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Success Dialog
 * A dialog with positive confirmation messaging, typically used after successful operations.
 * Includes a success-themed title and encouraging description.
 */
export const SuccessDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Complete Purchase</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle className="text-green-400">Payment Successful</DialogTitle>
            <DialogDescription>
              Your order has been confirmed. You will receive an email confirmation shortly with
              tracking details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6 bg-green-500/10 border border-green-500/20 rounded-lg my-4">
            <p className="text-sm text-green-300">Order ID: #ORD-2024-87543</p>
            <p className="text-sm text-green-300 mt-1">Total: $1,234.56</p>
          </div>
          <DialogFooter>
            <Button variant="primary">Back to Home</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Warning Dialog
 * A dialog designed to alert users about important warnings or cautionary information.
 * Uses warning color styling to draw attention to critical information.
 */
export const WarningDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Disable Two-Factor Auth</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle className="text-amber-400">Security Warning</DialogTitle>
            <DialogDescription>
              Disabling two-factor authentication will make your account less secure. Are you sure
              you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6 bg-amber-500/10 border border-amber-500/20 rounded-lg my-4">
            <p className="text-sm text-amber-300">
              Without 2FA, your account will be vulnerable to unauthorized access. We strongly
              recommend keeping this security feature enabled.
            </p>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="destructive">Disable 2FA</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Info Dialog
 * An informational dialog providing helpful context or explanations to users.
 * Uses info-themed styling with a calm color palette.
 */
export const InfoDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Learn More</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle className="text-blue-400">How to Use Filters</DialogTitle>
            <DialogDescription>
              Learn how to efficiently filter and search your data using our advanced filtering
              system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-6">
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Basic Filtering</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Click the filter icon to open filter options. Select criteria and click apply.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Advanced Search</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Use the search box with operators like "is:", "contains:", and "created:date" for
                precise results.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Saving Filters</h4>
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                Click the save icon to store your current filter setup for future use.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button variant="secondary" size="sm">
              View Full Guide
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Minimal Dialog
 * A dialog with only essential elements - title and action buttons.
 * Useful for quick confirmations without extensive descriptions.
 */
export const MinimalDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Sign Out</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Sign Out?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="primary">Sign Out</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Dialog without Description
 * A dialog with title and content but no separate description section.
 * Demonstrates alternative structure when description is not needed.
 */
export const WithoutDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Network Settings</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Network Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 px-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Endpoint</label>
              <input
                type="text"
                defaultValue="https://api.example.com"
                className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeout (seconds)</label>
              <input
                type="number"
                defaultValue="30"
                className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="primary">Save Settings</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Dialog with Custom Trigger
 * Demonstrates using a custom button as the trigger instead of the default styled button.
 * Uses the `render` prop to provide a custom trigger element.
 */
export const CustomTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="outline" size="sm">Settings</Button>}
        />
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Application Settings</DialogTitle>
            <DialogDescription>
              Customize your application preferences and behavior.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Dark Mode</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Notifications</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-save</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button variant="primary">Save Changes</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Destructive Action Dialog
 * A dialog specifically designed for destructive operations like deletion, reset, or removal.
 * Uses prominent destructive styling to communicate the severity of the action.
 */
export const DestructiveActionDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger variant="destructive">Reset All Data</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle className="text-red-400">Reset All Data?</DialogTitle>
            <DialogDescription>
              This will permanently delete all your data and cannot be undone. This includes all
              projects, configurations, and saved preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-lg my-4">
            <p className="text-sm text-red-300 font-medium">
              Warning: This action is irreversible. Please make sure you have a backup before
              proceeding.
            </p>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button variant="destructive">Reset Data</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Dialog with Glass Effect
 * Showcases the dialog with enhanced glass morphism effects.
 * The dialog uses backdrop blur and semi-transparent styling for a modern appearance.
 */
export const WithGlassEffect: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Open Glass Dialog</DialogTrigger>
          <DialogPopup className="glass-card-strong">
            <DialogHeader>
              <DialogTitle>Enhanced Glass Effect</DialogTitle>
              <DialogDescription>
                This dialog demonstrates the glass morphism effect with increased backdrop blur
                and semi-transparent background for a modern, layered appearance.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 px-6">
              <p className="text-sm text-[#C4C8D4] font-sans font-light">
                The glass effect creates visual depth and elegance, making the dialog feel like it's
                floating above the content.
              </p>
            </div>
            <DialogFooter>
              <DialogClose>Dismiss</DialogClose>
              <Button variant="primary">Continue</Button>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      </div>
    )
  },
}

/**
 * Multi-step Dialog
 * A dialog that guides users through a multi-step process.
 * Demonstrates how dialogs can be used for wizards or complex workflows.
 */
export const MultiStepDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)

    const handleNext = () => {
      if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
      if (step > 1) setStep(step - 1)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Start Onboarding</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>
              {step === 1 && 'Welcome to Our Platform'}
              {step === 2 && 'Create Your Profile'}
              {step === 3 && 'Connect Your Accounts'}
            </DialogTitle>
            <DialogDescription>
              {step === 1 &&
                'This is the first step of the onboarding process. Learn about our key features.'}
              {step === 2 &&
                'Tell us about yourself so we can personalize your experience.'}
              {step === 3 && 'Connect your existing accounts to unlock full functionality.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 px-6">
            {step === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-[#C4C8D4]">
                  Our platform offers:
                </p>
                <ul className="text-sm text-[#C4C8D4] space-y-1 ml-4">
                  <li>• Real-time collaboration</li>
                  <li>• Advanced analytics</li>
                  <li>• Secure data storage</li>
                </ul>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-9 px-3 rounded-md border border-border bg-card/50 backdrop-blur-8 text-sm text-foreground"
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-center">
                  Connect GitHub
                </Button>
                <Button variant="outline" className="w-full justify-center">
                  Connect Google
                </Button>
                <Button variant="outline" className="w-full justify-center">
                  Connect Slack
                </Button>
              </div>
            )}
          </div>

          <div className="py-2 px-6 text-xs text-[#C4C8D4]">
            Step {step} of 3
          </div>

          <DialogFooter>
            {step > 1 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setOpen(false)}>
                Complete
              </Button>
            )}
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Large Dialog
 * A larger dialog layout suitable for content-rich interfaces.
 * Demonstrates different sizing options for dialogs.
 */
export const LargeDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>View Details</DialogTrigger>
        <DialogPopup className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Project Dashboard</DialogTitle>
            <DialogDescription>
              Comprehensive overview of your project metrics and performance indicators.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tasks', value: '124' },
                { label: 'Completed', value: '89' },
                { label: 'Team Members', value: '12' },
                { label: 'Progress', value: '72%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card/50 border border-border rounded-lg p-4">
                  <p className="text-xs text-[#C4C8D4] uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-decorative text-primary mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button variant="primary">Export Report</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Compact Dialog
 * A compact dialog suitable for simple, focused interactions.
 * Demonstrates minimal dialog layout for quick actions.
 */
export const CompactDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger size="sm">Pin to Favorites</DialogTrigger>
        <DialogPopup className="w-full max-w-xs">
          <DialogHeader>
            <DialogTitle>Add to Favorites</DialogTitle>
          </DialogHeader>
          <div className="py-2 px-6">
            <p className="text-xs text-[#C4C8D4]">
              This item will be pinned to your favorites list for quick access.
            </p>
          </div>
          <DialogFooter className="gap-1">
            <DialogClose size="sm">Cancel</DialogClose>
            <Button variant="primary" size="sm">
              Confirm
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Dialog with Tabs
 * A dialog containing tabbed content sections.
 * Demonstrates how dialogs can organize complex content into tabs.
 */
export const DialogWithTabs: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('general')

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Account Preferences</DialogTrigger>
        <DialogPopup className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 px-6">
            <div className="flex gap-2 border-b border-border mb-4">
              {[
                { id: 'general', label: 'General' },
                { id: 'privacy', label: 'Privacy' },
                { id: 'notifications', label: 'Notifications' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-[#C4C8D4] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeTab === 'general' && (
                <>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Language</label>
                    <select className="h-8 px-2 rounded-md border border-border bg-card/50 text-sm">
                      <option>English</option>
                      <option>German</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Theme</label>
                    <select className="h-8 px-2 rounded-md border border-border bg-card/50 text-sm">
                      <option>Dark</option>
                      <option>Light</option>
                    </select>
                  </div>
                </>
              )}
              {activeTab === 'privacy' && (
                <>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Profile Visibility</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Online Status</label>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </>
              )}
              {activeTab === 'notifications' && (
                <>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Push Notifications</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button variant="primary">Save Preferences</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}

/**
 * Multiple Dialogs
 * Demonstrates multiple different dialog triggers and their independent states.
 * Shows how dialogs can coexist and be triggered separately.
 */
export const MultipleDialogs: Story = {
  render: () => {
    const [dialog1Open, setDialog1Open] = useState(false)
    const [dialog2Open, setDialog2Open] = useState(false)
    const [dialog3Open, setDialog3Open] = useState(false)

    return (
      <div className="flex gap-3 flex-wrap justify-center">
        <Dialog open={dialog1Open} onOpenChange={setDialog1Open}>
          <DialogTrigger>Information</DialogTrigger>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Information Dialog</DialogTitle>
              <DialogDescription>
                This is an information dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogPopup>
        </Dialog>

        <Dialog open={dialog2Open} onOpenChange={setDialog2Open}>
          <DialogTrigger>Warning</DialogTrigger>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle className="text-amber-400">Warning Dialog</DialogTitle>
              <DialogDescription>
                This is a warning dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogPopup>
        </Dialog>

        <Dialog open={dialog3Open} onOpenChange={setDialog3Open}>
          <DialogTrigger variant="destructive">Error</DialogTrigger>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle className="text-red-400">Error Dialog</DialogTitle>
              <DialogDescription>
                This is an error dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      </div>
    )
  },
}

/**
 * Dialog with Custom Styling
 * Demonstrates how dialogs can be customized with additional CSS classes.
 * Shows the flexibility of the component for different visual presentations.
 */
export const CustomStyling: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Custom Styled Dialog</DialogTrigger>
        <DialogPopup className="border-2 border-primary shadow-lg shadow-primary/25">
          <DialogHeader className="bg-gradient-to-r from-primary/20 to-transparent pb-4 -m-6 mb-0 px-6 py-4">
            <DialogTitle className="text-primary text-3xl">Featured Dialog</DialogTitle>
            <DialogDescription>
              This dialog has custom styling with a gradient background header.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 px-6">
            <p className="text-sm text-[#C4C8D4] font-sans font-light mb-4">
              Custom styling allows you to create branded dialogs that match your design system
              perfectly.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-primary font-medium">Highlighted content area</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Dismiss</DialogClose>
            <Button variant="primary">Proceed</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    )
  },
}
