import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from '../components/Button';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import * as React from 'react';

/**
 * Form component built on react-hook-form with Zod validation.
 * Provides accessible, composable form primitives with built-in error handling.
 *
 * ## Features
 * - Built on react-hook-form for performance and flexibility
 * - Zod schema validation support via @hookform/resolvers
 * - Automatic error handling and display
 * - Accessible form controls with proper ARIA attributes
 * - Composable sub-components for flexible layouts
 * - Field-level descriptions and error messages
 *
 * ## Components
 * - **Form**: Form provider wrapper (FormProvider)
 * - **FormField**: Controller wrapper for individual fields
 * - **FormItem**: Container for field with label, control, description, and message
 * - **FormLabel**: Label element with error state styling
 * - **FormControl**: Input wrapper with accessibility attributes
 * - **FormDescription**: Helper text for field guidance
 * - **FormMessage**: Error message display
 *
 * ## Usage
 * ```tsx
 * const form = useForm({
 *   resolver: zodResolver(schema),
 *   defaultValues: { ... },
 * });
 *
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={form.control}
 *       name="fieldName"
 *       render={({ field }) => (
 *         <FormItem>
 *           <FormLabel>Label</FormLabel>
 *           <FormControl>
 *             <Input {...field} />
 *           </FormControl>
 *           <FormDescription>Helper text</FormDescription>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *   </form>
 * </Form>
 * ```
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Composable form primitives built on react-hook-form and Radix UI. Provides type-safe forms with Zod validation, automatic error handling, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple login form with email and password fields
 */
export const LoginForm: Story = {
  render: () => {
    const formSchema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Form submitted:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>
    );
  },
};

/**
 * Profile form with multiple field types
 */
export const ProfileForm: Story = {
  render: () => {
    const formSchema = z.object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      bio: z
        .string()
        .max(160, 'Bio must be less than 160 characters')
        .optional(),
      url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
      marketing: z.boolean().default(false),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        bio: '',
        url: '',
        marketing: false,
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Profile updated:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can write a brief bio about yourself. Max 160 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" type="url" {...field} />
                </FormControl>
                <FormDescription>Add a link to your website or portfolio.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing emails</FormLabel>
                  <FormDescription>
                    Receive emails about new products, features, and more.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Update Profile
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  },
};

/**
 * Registration form with password confirmation
 */
export const RegistrationForm: Story = {
  render: () => {
    const formSchema = z
      .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        terms: z.boolean().refine((val) => val === true, {
          message: 'You must accept the terms and conditions',
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Registration:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormDescription>Must be at least 8 characters long</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the{' '}
                    <a href="#" className="text-primary hover:underline">
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="cta">
            Create Account
          </Button>
        </form>
      </Form>
    );
  },
};

/**
 * Form with radio group selection
 */
export const NotificationPreferences: Story = {
  render: () => {
    const formSchema = z.object({
      type: z.enum(['all', 'mentions', 'none'], {
        required_error: 'You need to select a notification type.',
      }),
      mobile: z.boolean().default(false),
      email: z.boolean().default(true),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: 'all',
        mobile: false,
        email: true,
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Preferences saved:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">All new messages</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mentions" />
                      </FormControl>
                      <FormLabel className="font-normal">Direct messages and mentions</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">Nothing</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>Choose how you want to receive notifications</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mobile notifications</FormLabel>
                    <FormDescription>Receive push notifications on your mobile device</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email notifications</FormLabel>
                    <FormDescription>Receive notifications via email</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Save Preferences
          </Button>
        </form>
      </Form>
    );
  },
};

/**
 * Contact form with validation
 */
export const ContactForm: Story = {
  render: () => {
    const formSchema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      subject: z.string().min(5, 'Subject must be at least 5 characters'),
      message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must be less than 500 characters'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Message sent:', values);
      form.reset();
    });

    const messageValue = form.watch('message');

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is this regarding?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>Your message will be reviewed by our team.</FormDescription>
                  <span className="text-sm text-muted-foreground">
                    {messageValue?.length || 0}/500
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" variant="cta">
              Send Message
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Clear
            </Button>
          </div>
        </form>
      </Form>
    );
  },
};

/**
 * Form with custom validation and async submission
 */
export const AsyncSubmission: Story = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const formSchema = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Invalid email address'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: '',
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      setSubmitSuccess(false);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Form submitted:', values);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        form.reset();
      }, 3000);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {submitSuccess && (
            <div
              className="rounded-md bg-green-50 p-4 border border-green-200"
              style={{ borderColor: '#0ec2bc', backgroundColor: 'rgba(14, 194, 188, 0.1)' }}
            >
              <p className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
                ✓ Successfully submitted! Form will reset shortly.
              </p>
            </div>
          )}
          <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    );
  },
};

/**
 * Minimal form example
 */
export const MinimalExample: Story = {
  render: () => {
    const formSchema = z.object({
      email: z.string().email('Invalid email address'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
      },
    });

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Email submitted:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </Form>
    );
  },
};

/**
 * Form with all field states showcased
 */
export const AllFieldStates: Story = {
  render: () => {
    const formSchema = z.object({
      validField: z.string().min(3),
      invalidField: z.string().min(10),
      disabledField: z.string(),
      optionalField: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        validField: 'Valid content',
        invalidField: 'Short',
        disabledField: 'Cannot edit',
        optionalField: '',
      },
    });

    // Trigger validation to show errors
    React.useEffect(() => {
      form.trigger('invalidField');
    }, [form]);

    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Form values:', values);
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="validField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Field</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This field has valid content</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invalidField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invalid Field (Error State)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This field shows an error (min 10 characters)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disabledField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disabled Field</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>This field cannot be edited</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="optionalField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optional Field</FormLabel>
                <FormControl>
                  <Input placeholder="Not required" {...field} />
                </FormControl>
                <FormDescription>This field is optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    );
  },
};
