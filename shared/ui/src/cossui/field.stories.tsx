import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldError,
  FieldHelper,
  FieldDescription,
} from './field'
import { Input } from './input'
import { Textarea } from './textarea'
import { Checkbox, CheckboxIndicator } from './checkbox'

const meta: Meta<typeof FieldRoot> = {
  title: 'Tier 1: Primitives/CossUI/Field',
  component: FieldRoot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Field component from Coss UI adapted for Ozean Licht design system. Form field wrapper with label, validation states, error messages, and helper text. Built on Base UI with full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'full'],
      description: 'Size variant of the field container',
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldRoot>

// ============================================================================
// BASIC FIELD STORIES
// ============================================================================

/**
 * Basic field with label and input
 */
export const Default: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="name">Full Name</FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="name" placeholder="Enter your name" />
        )}
      />
    </FieldRoot>
  ),
}

/**
 * Field with required indicator
 */
export const Required: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="email" required>
        Email Address
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="email" type="email" placeholder="you@example.com" />
        )}
      />
    </FieldRoot>
  ),
}

/**
 * Field with optional indicator
 */
export const Optional: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="phone" optional>
        Phone Number
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="phone" type="tel" placeholder="+1 (555) 000-0000" />
        )}
      />
    </FieldRoot>
  ),
}

/**
 * Field with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="username" placeholder="johndoe" />
        )}
      />
      <FieldHelper>Choose a unique username for your account</FieldHelper>
    </FieldRoot>
  ),
}

/**
 * Field with description
 */
export const WithDescription: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="bio">Biography</FieldLabel>
      <FieldDescription>
        Tell us a bit about yourself. This will be displayed on your profile.
      </FieldDescription>
      <FieldControl
        render={(props) => (
          <Textarea {...props} id="bio" placeholder="I am a..." rows={4} />
        )}
      />
    </FieldRoot>
  ),
}

// ============================================================================
// VALIDATION STATE STORIES
// ============================================================================

/**
 * Field with error message
 */
export const WithError: Story = {
  render: () => (
    <FieldRoot invalid>
      <FieldLabel htmlFor="email-error" required>
        Email Address
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input
            {...props}
            id="email-error"
            type="email"
            defaultValue="invalid-email"
            className="border-red-500/50 focus-visible:ring-red-500"
          />
        )}
      />
      <FieldError>Please enter a valid email address</FieldError>
    </FieldRoot>
  ),
}

/**
 * Field with success message
 */
export const WithSuccess: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="email-success" required>
        Email Address
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input
            {...props}
            id="email-success"
            type="email"
            defaultValue="user@example.com"
            className="border-green-500/50 focus-visible:ring-green-500"
          />
        )}
      />
      <FieldHelper state="success" showIcon>
        Email is valid
      </FieldHelper>
    </FieldRoot>
  ),
}

/**
 * Field with warning message
 */
export const WithWarning: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="password-warning" required>
        Password
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input
            {...props}
            id="password-warning"
            type="password"
            defaultValue="weak123"
            className="border-yellow-500/50 focus-visible:ring-yellow-500"
          />
        )}
      />
      <FieldHelper state="warning" showIcon>
        Password is weak. Use uppercase, numbers, and symbols for better security.
      </FieldHelper>
    </FieldRoot>
  ),
}

/**
 * Field with multiple error messages
 */
export const MultipleErrors: Story = {
  render: () => (
    <FieldRoot invalid>
      <FieldLabel htmlFor="password-multi" required>
        Password
      </FieldLabel>
      <FieldControl
        render={(props) => (
          <Input
            {...props}
            id="password-multi"
            type="password"
            defaultValue="abc"
            className="border-red-500/50 focus-visible:ring-red-500"
          />
        )}
      />
      <div className="flex flex-col gap-1">
        <FieldError showIcon={false}>Password must be at least 8 characters</FieldError>
        <FieldError showIcon={false}>Password must contain at least one uppercase letter</FieldError>
        <FieldError showIcon={false}>Password must contain at least one number</FieldError>
      </div>
    </FieldRoot>
  ),
}

// ============================================================================
// INPUT TYPE STORIES
// ============================================================================

/**
 * Email field with validation
 */
export const EmailField: Story = {
  render: () => {
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState('')

    const validateEmail = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        setError('Email is required')
        return false
      }
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address')
        return false
      }
      setError('')
      return true
    }

    return (
      <FieldRoot invalid={!!error}>
        <FieldLabel htmlFor="email-validate" required>
          Email Address
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="email-validate"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              placeholder="you@example.com"
              className={error ? 'border-red-500/50 focus-visible:ring-red-500' : ''}
            />
          )}
        />
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldHelper>We'll never share your email with anyone else</FieldHelper>
        )}
      </FieldRoot>
    )
  },
}

/**
 * Password field with requirements
 */
export const PasswordField: Story = {
  render: () => {
    const [password, setPassword] = React.useState('')

    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /\d/.test(password) },
      { label: 'Contains special character', met: /[!@#$%^&*]/.test(password) },
    ]

    const allMet = requirements.every((r) => r.met)

    return (
      <FieldRoot>
        <FieldLabel htmlFor="password-req" required>
          Password
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="password-req"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className={
                password
                  ? allMet
                    ? 'border-green-500/50 focus-visible:ring-green-500'
                    : 'border-yellow-500/50 focus-visible:ring-yellow-500'
                  : ''
              }
            />
          )}
        />
        <div className="flex flex-col gap-1">
          {requirements.map((req, i) => (
            <p
              key={i}
              className={`text-xs flex items-center gap-1.5 ${req.met ? 'text-green-400' : 'text-muted-foreground'}`}
            >
              <span>{req.met ? '✓' : '○'}</span>
              <span>{req.label}</span>
            </p>
          ))}
        </div>
      </FieldRoot>
    )
  },
}

/**
 * Text input with character count
 */
export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const maxLength = 50

    return (
      <FieldRoot>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="title"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={maxLength}
              placeholder="Enter a title"
            />
          )}
        />
        <div className="flex justify-between items-center">
          <FieldHelper>Keep it short and descriptive</FieldHelper>
          <p
            className={`text-xs ${value.length === maxLength ? 'text-yellow-400' : 'text-muted-foreground'}`}
          >
            {value.length}/{maxLength}
          </p>
        </div>
      </FieldRoot>
    )
  },
}

/**
 * Textarea field with description
 */
export const TextareaField: Story = {
  render: () => (
    <FieldRoot size="lg">
      <FieldLabel htmlFor="message">Message</FieldLabel>
      <FieldDescription>
        Write your message here. You can use markdown formatting.
      </FieldDescription>
      <FieldControl
        render={(props) => (
          <Textarea {...props} id="message" placeholder="Type your message..." rows={6} />
        )}
      />
      <FieldHelper>Maximum 500 characters</FieldHelper>
    </FieldRoot>
  ),
}

// ============================================================================
// DISABLED & READONLY STORIES
// ============================================================================

/**
 * Disabled field
 */
export const Disabled: Story = {
  render: () => (
    <FieldRoot disabled>
      <FieldLabel htmlFor="disabled-field">Username</FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="disabled-field" defaultValue="johndoe" disabled />
        )}
      />
      <FieldHelper>This field cannot be edited</FieldHelper>
    </FieldRoot>
  ),
}

/**
 * Read-only field
 */
export const ReadOnly: Story = {
  render: () => (
    <FieldRoot>
      <FieldLabel htmlFor="readonly-field">User ID</FieldLabel>
      <FieldControl
        render={(props) => (
          <Input {...props} id="readonly-field" defaultValue="usr_1234567890" readOnly />
        )}
      />
      <FieldHelper>This field is read-only</FieldHelper>
    </FieldRoot>
  ),
}

// ============================================================================
// SIZE VARIANTS
// ============================================================================

/**
 * All size variants
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <FieldRoot size="sm">
        <FieldLabel htmlFor="size-sm">Small Field</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="size-sm" placeholder="Small (max-width: 360px)" />
          )}
        />
      </FieldRoot>

      <FieldRoot size="default">
        <FieldLabel htmlFor="size-default">Default Field</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="size-default" placeholder="Default (max-width: 480px)" />
          )}
        />
      </FieldRoot>

      <FieldRoot size="lg">
        <FieldLabel htmlFor="size-lg">Large Field</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="size-lg" placeholder="Large (max-width: 640px)" />
          )}
        />
      </FieldRoot>

      <FieldRoot size="full">
        <FieldLabel htmlFor="size-full">Full Width Field</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="size-full" placeholder="Full width (max-width: 100%)" />
          )}
        />
      </FieldRoot>
    </div>
  ),
}

// ============================================================================
// COMPLEX VALIDATION STORIES
// ============================================================================

/**
 * Async validation example
 */
export const AsyncValidation: Story = {
  render: () => {
    const [username, setUsername] = React.useState('')
    const [validating, setValidating] = React.useState(false)
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState(false)

    const checkUsername = async (value: string) => {
      if (!value) {
        setError('')
        setSuccess(false)
        return
      }

      setValidating(true)
      setError('')
      setSuccess(false)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate username check (check if 'admin' is taken)
      if (value.toLowerCase() === 'admin') {
        setError('This username is already taken')
        setSuccess(false)
      } else {
        setError('')
        setSuccess(true)
      }
      setValidating(false)
    }

    return (
      <FieldRoot invalid={!!error}>
        <FieldLabel htmlFor="username-async" required>
          Username
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="username-async"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              onBlur={(e) => checkUsername(e.target.value)}
              placeholder="Choose a username"
              className={
                error
                  ? 'border-red-500/50 focus-visible:ring-red-500'
                  : success
                    ? 'border-green-500/50 focus-visible:ring-green-500'
                    : ''
              }
            />
          )}
        />
        {validating ? (
          <FieldHelper>Checking availability...</FieldHelper>
        ) : error ? (
          <FieldError>{error}</FieldError>
        ) : success ? (
          <FieldHelper state="success" showIcon>
            Username is available
          </FieldHelper>
        ) : (
          <FieldHelper>Try 'admin' to see error state</FieldHelper>
        )}
      </FieldRoot>
    )
  },
}

/**
 * Inline error display
 */
export const InlineError: Story = {
  render: () => (
    <FieldRoot invalid>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="inline-error" required>
          Credit Card Number
        </FieldLabel>
        <FieldError showIcon={false}>Invalid card number</FieldError>
      </div>
      <FieldControl
        render={(props) => (
          <Input
            {...props}
            id="inline-error"
            type="text"
            defaultValue="1234 5678"
            placeholder="1234 5678 9012 3456"
            className="border-red-500/50 focus-visible:ring-red-500"
          />
        )}
      />
    </FieldRoot>
  ),
}

// ============================================================================
// FORM EXAMPLES
// ============================================================================

/**
 * Form with multiple fields
 */
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Contact Form</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill out the form below to get in touch
        </p>
      </div>

      <FieldRoot>
        <FieldLabel htmlFor="form-name" required>
          Full Name
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="form-name" placeholder="John Doe" />
          )}
        />
      </FieldRoot>

      <FieldRoot>
        <FieldLabel htmlFor="form-email" required>
          Email Address
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="form-email" type="email" placeholder="john@example.com" />
          )}
        />
        <FieldHelper>We'll respond within 24 hours</FieldHelper>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel htmlFor="form-phone" optional>
          Phone Number
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input {...props} id="form-phone" type="tel" placeholder="+1 (555) 000-0000" />
          )}
        />
      </FieldRoot>

      <FieldRoot size="lg">
        <FieldLabel htmlFor="form-message" required>
          Message
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Textarea
              {...props}
              id="form-message"
              placeholder="Tell us how we can help..."
              rows={4}
            />
          )}
        />
      </FieldRoot>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Send Message
      </button>
    </div>
  ),
}

/**
 * Sign up form with validation
 */
export const SignUpForm: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const validateForm = () => {
      const newErrors: Record<string, string> = {}

      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    return (
      <div className="flex flex-col gap-6 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to get started
          </p>
        </div>

        <FieldRoot invalid={!!errors.email}>
          <FieldLabel htmlFor="signup-email" required>
            Email Address
          </FieldLabel>
          <FieldControl
            render={(props) => (
              <Input
                {...props}
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className={errors.email ? 'border-red-500/50 focus-visible:ring-red-500' : ''}
              />
            )}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </FieldRoot>

        <FieldRoot invalid={!!errors.password}>
          <FieldLabel htmlFor="signup-password" required>
            Password
          </FieldLabel>
          <FieldControl
            render={(props) => (
              <Input
                {...props}
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create a strong password"
                className={errors.password ? 'border-red-500/50 focus-visible:ring-red-500' : ''}
              />
            )}
          />
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : (
            <FieldHelper>Must be at least 8 characters</FieldHelper>
          )}
        </FieldRoot>

        <FieldRoot invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="signup-confirm" required>
            Confirm Password
          </FieldLabel>
          <FieldControl
            render={(props) => (
              <Input
                {...props}
                id="signup-confirm"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
                className={
                  errors.confirmPassword ? 'border-red-500/50 focus-visible:ring-red-500' : ''
                }
              />
            )}
          />
          {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
        </FieldRoot>

        <div className="flex items-start gap-2">
          <Checkbox
            id="signup-terms"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData({ ...formData, acceptTerms: (e.target as HTMLInputElement).checked })
            }
          >
            <CheckboxIndicator />
          </Checkbox>
          <FieldLabel htmlFor="signup-terms" className="cursor-pointer">
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </FieldLabel>
        </div>
        {errors.acceptTerms && (
          <FieldError className="mt-[-0.5rem]">{errors.acceptTerms}</FieldError>
        )}

        <button
          onClick={validateForm}
          className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Create Account
        </button>
      </div>
    )
  },
}

// ============================================================================
// ACCESSIBILITY EXAMPLES
// ============================================================================

/**
 * Accessibility example with ARIA attributes
 */
export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          These fields include proper ARIA attributes for screen readers
        </p>
      </div>

      <FieldRoot invalid>
        <FieldLabel htmlFor="a11y-email" required>
          Email Address
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="a11y-email"
              type="email"
              defaultValue="invalid"
              className="border-red-500/50 focus-visible:ring-red-500"
              aria-describedby="a11y-email-error"
            />
          )}
        />
        <FieldError id="a11y-email-error">Please enter a valid email address</FieldError>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel htmlFor="a11y-password" required>
          Password
        </FieldLabel>
        <FieldDescription id="a11y-password-desc">
          Must be at least 8 characters with uppercase, lowercase, and numbers
        </FieldDescription>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="a11y-password"
              type="password"
              placeholder="Enter password"
              aria-describedby="a11y-password-desc"
            />
          )}
        />
      </FieldRoot>
    </div>
  ),
}

// ============================================================================
// GLASS EFFECT VARIANTS
// ============================================================================

/**
 * Fields with glass effect background
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6">
      <FieldRoot>
        <FieldLabel htmlFor="glass-1">Username</FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="glass-1"
              placeholder="Enter username"
              className="glass-card"
            />
          )}
        />
        <FieldHelper>Choose a unique username</FieldHelper>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel htmlFor="glass-2" required>
          Email Address
        </FieldLabel>
        <FieldControl
          render={(props) => (
            <Input
              {...props}
              id="glass-2"
              type="email"
              placeholder="you@example.com"
              className="glass-card-strong"
            />
          )}
        />
      </FieldRoot>

      <FieldRoot size="lg">
        <FieldLabel htmlFor="glass-3">Message</FieldLabel>
        <FieldControl
          render={(props) => (
            <Textarea
              {...props}
              id="glass-3"
              placeholder="Type your message..."
              rows={4}
              className="glass-subtle"
            />
          )}
        />
      </FieldRoot>
    </div>
  ),
}
