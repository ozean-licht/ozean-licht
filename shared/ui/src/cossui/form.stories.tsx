/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Meta, type StoryObj } from '@storybook/react'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormRoot,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormSubmit,
  useForm,
} from './form'
import { Input } from './input'
import { Textarea } from './textarea'
import { Checkbox, CheckboxIndicator } from './checkbox'
import { Label } from './label'

const meta: Meta = {
  title: 'Tier 1: Primitives/CossUI/Form',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete form implementation based on react-hook-form with Zod validation. Features client-side validation, async validation, error aggregation, loading states, and full ARIA support. Adapted for Ozean Licht design system with glass morphism effects.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// ============================================================================
// Story 1: Basic Form with Validation
// ============================================================================

const basicFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export const BasicForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(basicFormSchema),
      defaultValues: {
        name: '',
        email: '',
      },
    })

    const onSubmit = (data: z.infer<typeof basicFormSchema>) => {
      console.log('Form submitted:', data)
      alert('Form submitted! Check console for data.')
    }

    return (
      <div className="w-[400px]">
        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="name">
            <FormLabel required>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit>Submit</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 2: Login Form
// ============================================================================

const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const LoginForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    })

    const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
      console.log('Login:', data)
      alert('Login successful!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Sign In</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to continue
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="email">
            <FormLabel required>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="password">
            <FormLabel required>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter your password" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Sign In</FormSubmit>
        </FormRoot>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Don't have an account?{' '}
          <a href="#" className="text-[#0ec2bc] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    )
  },
}

// ============================================================================
// Story 3: Registration Form
// ============================================================================

const registrationFormSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const RegistrationForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(registrationFormSchema),
      defaultValues: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      },
    })

    const onSubmit = (data: z.infer<typeof registrationFormSchema>) => {
      console.log('Registration:', data)
      alert('Registration successful!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Join us to get started
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="fullName">
            <FormLabel required>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="email">
            <FormLabel required>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="password">
            <FormLabel required>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Create a strong password" />
            </FormControl>
            <FormDescription>
              Must be at least 8 characters long
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormField name="confirmPassword">
            <FormLabel required>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Confirm your password" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="terms">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox className="mt-1">
                  <CheckboxIndicator />
                </Checkbox>
              </FormControl>
              <div className="flex-1">
                <FormLabel className="font-normal cursor-pointer">
                  I accept the terms and conditions
                </FormLabel>
                <FormMessage />
              </div>
            </div>
          </FormField>

          <FormSubmit className="w-full">Create Account</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 4: Contact Form
// ============================================================================

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const ContactForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(contactFormSchema),
      defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
    })

    const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
      console.log('Contact form:', data)
      alert('Message sent!')
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Contact Us</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Send us a message and we'll get back to you
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="name">
            <FormLabel required>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="your@email.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="subject">
            <FormLabel required>Subject</FormLabel>
            <FormControl>
              <Input placeholder="What's this about?" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="message">
            <FormLabel required>Message</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us more..." rows={5} />
            </FormControl>
            <FormDescription>
              Minimum 10 characters
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Send Message</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 5: Profile Update Form
// ============================================================================

const profileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const ProfileUpdateForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        username: 'johndoe',
        email: 'john@example.com',
        bio: '',
        website: '',
      },
    })

    const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
      console.log('Profile updated:', data)
      alert('Profile updated!')
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Edit Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update your profile information
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="username">
            <FormLabel required>Username</FormLabel>
            <FormControl>
              <Input placeholder="johndoe" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="bio">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about yourself" rows={3} />
            </FormControl>
            <FormDescription>
              Optional. Maximum 200 characters.
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormField name="website">
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com" />
            </FormControl>
            <FormDescription>
              Optional. Must be a valid URL.
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Save Changes</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 6: Payment Form
// ============================================================================

const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(2, 'Name on card is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
})

export const PaymentForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(paymentFormSchema),
      defaultValues: {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      },
    })

    const onSubmit = (data: z.infer<typeof paymentFormSchema>) => {
      console.log('Payment:', data)
      alert('Payment processed!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Payment Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your card information
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="cardNumber">
            <FormLabel required>Card Number</FormLabel>
            <FormControl>
              <Input placeholder="1234567890123456" maxLength={16} />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="cardName">
            <FormLabel required>Name on Card</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="expiryDate">
              <FormLabel required>Expiry</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" maxLength={5} />
              </FormControl>
              <FormMessage />
            </FormField>

            <FormField name="cvv">
              <FormLabel required>CVV</FormLabel>
              <FormControl>
                <Input type="password" placeholder="123" maxLength={4} />
              </FormControl>
              <FormMessage />
            </FormField>
          </div>

          <FormSubmit className="w-full">Pay Now</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 7: Address Form
// ============================================================================

const addressFormSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country is required'),
})

export const AddressForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(addressFormSchema),
      defaultValues: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    })

    const onSubmit = (data: z.infer<typeof addressFormSchema>) => {
      console.log('Address:', data)
      alert('Address saved!')
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Shipping Address</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Where should we deliver your order?
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="street">
            <FormLabel required>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" />
            </FormControl>
            <FormMessage />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="city">
              <FormLabel required>City</FormLabel>
              <FormControl>
                <Input placeholder="New York" />
              </FormControl>
              <FormMessage />
            </FormField>

            <FormField name="state">
              <FormLabel required>State</FormLabel>
              <FormControl>
                <Input placeholder="NY" />
              </FormControl>
              <FormMessage />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="zipCode">
              <FormLabel required>ZIP Code</FormLabel>
              <FormControl>
                <Input placeholder="12345" />
              </FormControl>
              <FormMessage />
            </FormField>

            <FormField name="country">
              <FormLabel required>Country</FormLabel>
              <FormControl>
                <Input placeholder="USA" />
              </FormControl>
              <FormMessage />
            </FormField>
          </div>

          <FormSubmit className="w-full">Save Address</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 8: Search Form
// ============================================================================

const searchFormSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
})

export const SearchForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(searchFormSchema),
      defaultValues: {
        query: '',
      },
    })

    const onSubmit = (data: z.infer<typeof searchFormSchema>) => {
      console.log('Search:', data)
      alert(`Searching for: ${data.query}`)
    }

    return (
      <div className="w-[500px]">
        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="query">
            <FormLabel>Search</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input type="search" placeholder="Search for anything..." size="lg" />
              </FormControl>
              <FormSubmit>Search</FormSubmit>
            </div>
            <FormMessage />
          </FormField>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 9: Newsletter Signup
// ============================================================================

const newsletterFormSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const NewsletterSignup: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(newsletterFormSchema),
      defaultValues: {
        email: '',
      },
    })

    const onSubmit = (data: z.infer<typeof newsletterFormSchema>) => {
      console.log('Newsletter signup:', data)
      alert('Successfully subscribed!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Subscribe to Newsletter</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get the latest updates delivered to your inbox
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="email">
            <FormLabel required>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="your@email.com" />
            </FormControl>
            <FormDescription>
              We'll never share your email with anyone else.
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Subscribe</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 10: Feedback Form
// ============================================================================

const feedbackFormSchema = z.object({
  rating: z.string().min(1, 'Please select a rating'),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
})

export const FeedbackForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(feedbackFormSchema),
      defaultValues: {
        rating: '',
        feedback: '',
      },
    })

    const onSubmit = (data: z.infer<typeof feedbackFormSchema>) => {
      console.log('Feedback:', data)
      alert('Thank you for your feedback!')
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">Send Feedback</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We'd love to hear your thoughts
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="rating">
            <FormLabel required>Rating</FormLabel>
            <FormControl>
              <Input placeholder="1-5" type="number" min="1" max="5" />
            </FormControl>
            <FormDescription>
              Rate your experience from 1 to 5
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormField name="feedback">
            <FormLabel required>Your Feedback</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us what you think..." rows={5} />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Send Feedback</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 11: Multi-Step Form (Wizard)
// ============================================================================

const multiStepSchema = z.object({
  // Step 1
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  // Step 2
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  // Step 3
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
})

export const MultiStepForm: Story = {
  render: () => {
    const [step, setStep] = useState(1)
    const form = useForm({
      resolver: zodResolver(multiStepSchema),
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
      },
    })

    const onSubmit = (data: z.infer<typeof multiStepSchema>) => {
      console.log('Multi-step form:', data)
      alert('Form completed!')
    }

    const nextStep = async () => {
      let fieldsToValidate: any[] = []
      if (step === 1) fieldsToValidate = ['firstName', 'lastName']
      if (step === 2) fieldsToValidate = ['email', 'phone']

      const isValid = await form.trigger(fieldsToValidate as any)
      if (isValid) setStep(step + 1)
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Registration Wizard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step {step} of 3
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  s <= step ? 'bg-[#0ec2bc]' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          {step === 1 && (
            <>
              <FormField name="firstName">
                <FormLabel required>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" />
                </FormControl>
                <FormMessage />
              </FormField>

              <FormField name="lastName">
                <FormLabel required>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <FormField name="email">
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" />
                </FormControl>
                <FormMessage />
              </FormField>

              <FormField name="phone">
                <FormLabel required>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 000-0000" />
                </FormControl>
                <FormMessage />
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <FormField name="address">
                <FormLabel required>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" />
                </FormControl>
                <FormMessage />
              </FormField>

              <FormField name="city">
                <FormLabel required>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" />
                </FormControl>
                <FormMessage />
              </FormField>
            </>
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card/50 hover:bg-accent"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-[#0ec2bc] text-white hover:bg-[#0ec2bc]/90"
              >
                Next
              </button>
            ) : (
              <FormSubmit className="flex-1">Complete</FormSubmit>
            )}
          </div>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 12: Form with Async Validation
// ============================================================================

const asyncFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

export const AsyncValidationForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(asyncFormSchema),
      defaultValues: {
        username: '',
      },
    })

    const checkUsername = async (username: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return username !== 'taken'
    }

    const onSubmit = async (data: z.infer<typeof asyncFormSchema>) => {
      const isAvailable = await checkUsername(data.username)
      if (!isAvailable) {
        form.setError('username', {
          message: 'Username is already taken',
        })
        return
      }
      console.log('Username available:', data)
      alert('Username is available!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Async Validation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Try typing "taken" to see validation error
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="username">
            <FormLabel required>Username</FormLabel>
            <FormControl>
              <Input placeholder="johndoe" />
            </FormControl>
            <FormDescription>
              We'll check if this username is available
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Check Availability</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 13: Form with Server Errors
// ============================================================================

const serverErrorFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const ServerErrorsForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(serverErrorFormSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    })

    const onSubmit = async (data: z.infer<typeof serverErrorFormSchema>) => {
      // Simulate server error
      await new Promise((resolve) => setTimeout(resolve, 1000))
      form.setError('email', {
        message: 'This email is already registered',
      })
      form.setError('root', {
        message: 'Server error: Unable to process request',
      })
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Server Validation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit to see server errors
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          {form.formState.errors.root && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30">
              <p className="text-sm text-red-400">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="password">
            <FormLabel required>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter password" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Submit</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 14: Form with Loading State
// ============================================================================

const loadingFormSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const LoadingStateForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(loadingFormSchema),
      defaultValues: {
        email: '',
      },
    })

    const onSubmit = async (data: z.infer<typeof loadingFormSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Submitted:', data)
      alert('Submitted successfully!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Loading State
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit to see loading animation
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="john@example.com"
                disabled={form.formState.isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full" loadingText="Processing...">
            Submit
          </FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 15: Form with Success State
// ============================================================================

const successFormSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const SuccessStateForm: Story = {
  render: () => {
    const [isSuccess, setIsSuccess] = useState(false)
    const form = useForm({
      resolver: zodResolver(successFormSchema),
      defaultValues: {
        email: '',
      },
    })

    const onSubmit = async (data: z.infer<typeof successFormSchema>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      form.reset()
      setTimeout(() => setIsSuccess(false), 3000)
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Success State
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit to see success message
          </p>
        </div>

        {isSuccess && (
          <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-400/30">
            <p className="text-sm text-green-400">Successfully subscribed!</p>
          </div>
        )}

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Subscribe</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 16: Disabled Form
// ============================================================================

const disabledFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export const DisabledForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(disabledFormSchema),
      defaultValues: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    })

    const onSubmit = (data: z.infer<typeof disabledFormSchema>) => {
      console.log(data)
    }

    return (
      <div className="w-[400px]">
        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="name">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input disabled />
            </FormControl>
          </FormField>

          <FormField name="email">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" disabled />
            </FormControl>
          </FormField>

          <FormSubmit disabled className="w-full">
            Submit
          </FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 17: Read-Only Form
// ============================================================================

const readOnlyFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string(),
})

export const ReadOnlyForm: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(readOnlyFormSchema),
      defaultValues: {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Software developer and open source enthusiast.',
      },
    })

    const onSubmit = (data: z.infer<typeof readOnlyFormSchema>) => {
      console.log(data)
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">User Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">View only</p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="name">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input readOnly />
            </FormControl>
          </FormField>

          <FormField name="email">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" readOnly />
            </FormControl>
          </FormField>

          <FormField name="bio">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea readOnly rows={3} />
            </FormControl>
          </FormField>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 18: Form with File Upload
// ============================================================================

const fileUploadFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
})

export const FileUploadForm: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null)
    const form = useForm({
      resolver: zodResolver(fileUploadFormSchema),
      defaultValues: {
        title: '',
        description: '',
      },
    })

    const onSubmit = (data: z.infer<typeof fileUploadFormSchema>) => {
      console.log('Form data:', data)
      console.log('File:', file)
      alert('File uploaded!')
    }

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Upload Document
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Share your document with us
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="title">
            <FormLabel required>Title</FormLabel>
            <FormControl>
              <Input placeholder="Document title" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="description">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Optional description" rows={3} />
            </FormControl>
            <FormMessage />
          </FormField>

          <div className="space-y-2">
            <Label>File</Label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card/50 backdrop-blur-8 file:mr-4 file:px-3 file:py-1 file:rounded file:border-0 file:bg-[#0ec2bc] file:text-white file:font-medium hover:file:bg-[#0ec2bc]/90"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          <FormSubmit className="w-full">Upload</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 19: Complex Validation (Password Match)
// ============================================================================

const complexValidationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/[0-9]/, 'Password must contain number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const ComplexValidation: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(complexValidationSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    })

    const onSubmit = (data: z.infer<typeof complexValidationSchema>) => {
      console.log('Password validation passed:', data)
      alert('Password is valid!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Complex Validation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Password must meet all requirements
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit}>
          <FormField name="email">
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="password">
            <FormLabel required>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Create password" />
            </FormControl>
            <FormDescription>
              Must contain: uppercase, lowercase, number, special character
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormField name="confirmPassword">
            <FormLabel required>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Confirm password" />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full">Create Account</FormSubmit>
        </FormRoot>
      </div>
    )
  },
}

// ============================================================================
// Story 20: Glass Effect Variants
// ============================================================================

const glassFormSchema = z.object({
  username: z.string().min(3, 'Username required'),
  email: z.string().email('Invalid email'),
})

export const GlassEffectVariants: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(glassFormSchema),
      defaultValues: {
        username: '',
        email: '',
      },
    })

    const onSubmit = (data: z.infer<typeof glassFormSchema>) => {
      console.log(data)
      alert('Form submitted!')
    }

    return (
      <div className="p-8 bg-gradient-to-br from-background via-card to-[#0ec2bc]/20 rounded-lg">
        <div className="w-[400px] p-6 bg-card/30 backdrop-blur-xl rounded-lg border border-border/50">
          <div className="mb-6">
            <h2 className="text-lg font-alt font-medium text-foreground">
              Glass Morphism Form
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              With enhanced glass effects
            </p>
          </div>

          <FormRoot form={form} onSubmit={onSubmit}>
            <FormField name="username">
              <FormLabel required>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" className="backdrop-blur-lg" />
              </FormControl>
              <FormMessage />
            </FormField>

            <FormField name="email">
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="backdrop-blur-lg"
                />
              </FormControl>
              <FormMessage />
            </FormField>

            <FormSubmit className="w-full">Submit</FormSubmit>
          </FormRoot>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Story 21: Accessibility Example
// ============================================================================

const accessibilityFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.string().regex(/^\d+$/, 'Age must be a number'),
})

export const AccessibilityExample: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(accessibilityFormSchema),
      defaultValues: {
        name: '',
        email: '',
        age: '',
      },
    })

    const onSubmit = (data: z.infer<typeof accessibilityFormSchema>) => {
      console.log('Accessible form:', data)
      alert('Form submitted with full accessibility support!')
    }

    return (
      <div className="w-[400px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-alt font-medium text-foreground">
            Accessible Form
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Full ARIA support and keyboard navigation
          </p>
        </div>

        <FormRoot form={form} onSubmit={onSubmit} aria-label="User registration form">
          <FormField name="name">
            <FormLabel required>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" aria-label="Full name input" />
            </FormControl>
            <FormDescription id="name-description">
              Enter your first and last name
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormField name="email">
            <FormLabel required>Email Address</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="john@example.com"
                aria-label="Email address input"
              />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="age">
            <FormLabel required>Age</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="25"
                aria-label="Age input"
                inputMode="numeric"
              />
            </FormControl>
            <FormDescription>
              You must be 18 or older
            </FormDescription>
            <FormMessage />
          </FormField>

          <FormSubmit className="w-full" aria-label="Submit registration form">
            Submit
          </FormSubmit>
        </FormRoot>
      </div>
    )
  },
}
