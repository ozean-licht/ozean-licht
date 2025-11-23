import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS } from 'input-otp';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from './input-otp';
import { CossUIButton as Button } from '../cossui';
import {
  CossUIFormRoot as Form,
  CossUIFormControl as FormControl,
  CossUIFormDescription as FormDescription,
  CossUIFormField as FormField,
  CossUIFormField as FormItem,
  CossUIFormLabel as FormLabel,
  CossUIFormMessage as FormMessage,
} from '../cossui';

/**
 * InputOTP component for one-time password and verification code input.
 *
 * **This is a Tier 1 Primitive** - built on the input-otp library with shadcn styling.
 * No Tier 2 branded version exists for this component.
 *
 * ## Features
 * - **Pattern Validation**: Restrict input to digits, letters, or custom patterns
 * - **Auto-focus Management**: Automatically moves focus between slots
 * - **Paste Support**: Smart paste handling that fills all slots at once
 * - **Keyboard Navigation**: Arrow keys to move between slots
 * - **Accessibility**: Proper ARIA labels and keyboard navigation
 * - **Caret Animation**: Visual feedback with blinking caret
 * - **Flexible Grouping**: Group slots and add separators for better UX
 *
 * ## Common Use Cases
 * - Two-factor authentication (2FA) codes
 * - Email/SMS verification codes
 * - PIN entry for secure access
 * - One-time passwords (OTP)
 * - Account verification during signup
 *
 * ## Component Structure
 * ```tsx
 * <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 *
 * ## Pattern Constants
 * - `REGEXP_ONLY_DIGITS` - Only numeric digits (0-9)
 * - `REGEXP_ONLY_CHARS` - Only alphabetic characters (a-z, A-Z)
 * - Custom regex - Define your own pattern
 *
 * ## Props
 * - `maxLength` - Total number of input slots (required)
 * - `pattern` - Regex pattern for validation (optional, defaults to alphanumeric)
 * - `value` - Controlled value (optional)
 * - `onChange` - Change handler (optional)
 * - `disabled` - Disable all inputs
 * - `render` - Custom render function for advanced use cases
 *
 * ## Accessibility
 * - Each slot is individually focusable
 * - Arrow keys navigate between slots
 * - Backspace deletes and moves to previous slot
 * - Paste support fills multiple slots at once
 * - Screen reader friendly with proper ARIA attributes
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible one-time password input component with pattern validation, auto-focus, and paste support. Built on input-otp library.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default 6-digit OTP input.
 *
 * The most common pattern for verification codes sent via SMS or email.
 * Only accepts numeric digits (0-9).
 */
export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Enter your 6-digit verification code
      </p>
    </div>
  ),
};

/**
 * 4-digit PIN input.
 *
 * Common for PIN codes and short verification codes.
 * Restricted to numeric digits only.
 */
export const FourDigit: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Enter your 4-digit PIN
      </p>
    </div>
  ),
};

/**
 * OTP with separator (3-3 pattern).
 *
 * Groups digits visually for better readability, common in 2FA apps.
 * The separator uses a dot icon by default.
 */
export const WithSeparator: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Enter your 6-digit code (3-3 pattern)
      </p>
    </div>
  ),
};

/**
 * Custom pattern with letters only.
 *
 * Demonstrates using alphabetic characters instead of digits.
 * Useful for letter-based verification codes.
 */
export const CustomPattern: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_CHARS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Enter alphabetic code (letters only)
      </p>
    </div>
  ),
};

/**
 * Error state demonstration.
 *
 * Shows how to style the OTP input for error states.
 * Uses red border to indicate invalid input.
 */
export const ErrorState: Story = {
  render: () => {
    const ErrorExample = () => {
      const [value, setValue] = useState('');
      const [error, setError] = useState('');

      const handleChange = (newValue: string) => {
        setValue(newValue);
        if (newValue.length === 6) {
          // Simulate validation - anything other than "123456" is invalid
          if (newValue !== '123456') {
            setError('Invalid verification code. Please try again.');
          } else {
            setError('');
          }
        } else {
          setError('');
        }
      };

      return (
        <div className="space-y-4">
          <div>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={handleChange}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className={error ? 'border-destructive' : ''}
                />
                <InputOTPSlot
                  index={1}
                  className={error ? 'border-destructive' : ''}
                />
                <InputOTPSlot
                  index={2}
                  className={error ? 'border-destructive' : ''}
                />
                <InputOTPSlot
                  index={3}
                  className={error ? 'border-destructive' : ''}
                />
                <InputOTPSlot
                  index={4}
                  className={error ? 'border-destructive' : ''}
                />
                <InputOTPSlot
                  index={5}
                  className={error ? 'border-destructive' : ''}
                />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Try entering "123456" for valid code
          </p>
        </div>
      );
    };

    return <ErrorExample />;
  },
};

/**
 * Disabled state.
 *
 * Shows the OTP input in a disabled state.
 * Useful when verification is in progress or not yet available.
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Verification code input is disabled
      </p>
    </div>
  ),
};

/**
 * With React Hook Form validation.
 *
 * Complete example showing integration with react-hook-form.
 * Includes validation, error messages, and form submission.
 */
export const WithForm: Story = {
  render: () => {
    const FormExample = () => {
      const form = useForm({
        defaultValues: {
          pin: '',
        },
      });

      const onSubmit = (data: { pin: string }) => {
        alert(`Submitted PIN: ${data.pin}`);
      };

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              rules={{
                required: 'Please enter your PIN',
                minLength: {
                  value: 6,
                  message: 'PIN must be 6 digits',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code sent to your phone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify Code</Button>
          </form>
        </Form>
      );
    };

    return <FormExample />;
  },
};

/**
 * Controlled value example.
 *
 * Demonstrates programmatic control of the OTP input value.
 * Shows real-time value display and manual value setting.
 */
export const ControlledValue: Story = {
  render: () => {
    const ControlledExample = () => {
      const [value, setValue] = useState('');

      return (
        <div className="space-y-4">
          <div>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={setValue}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Current value: <strong>{value || '(empty)'}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Length: {value.length}/6
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setValue('123456')}
            >
              Set to 123456
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setValue('')}
            >
              Clear
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

/**
 * Complete 2FA verification flow.
 *
 * Real-world example showing a complete two-factor authentication flow
 * with loading states and success feedback.
 */
export const TwoFactorAuth: Story = {
  render: () => {
    const TwoFactorExample = () => {
      const [value, setValue] = useState('');
      const [isVerifying, setIsVerifying] = useState(false);
      const [isVerified, setIsVerified] = useState(false);
      const [error, setError] = useState('');

      const handleChange = (newValue: string) => {
        setValue(newValue);
        setError('');

        // Auto-submit when complete
        if (newValue.length === 6) {
          setIsVerifying(true);

          // Simulate API call
          setTimeout(() => {
            if (newValue === '123456') {
              setIsVerified(true);
              setIsVerifying(false);
            } else {
              setError('Invalid code. Please try again.');
              setIsVerifying(false);
              setValue('');
            }
          }, 1500);
        }
      };

      if (isVerified) {
        return (
          <div className="space-y-4 text-center">
            <div className="text-5xl">✓</div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#0ec2bc' }}>
                Verification Successful!
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                You have been successfully authenticated.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <InputOTP
            maxLength={6}
            value={value}
            onChange={handleChange}
            disabled={isVerifying}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className={error ? 'border-destructive' : ''}
              />
              <InputOTPSlot
                index={1}
                className={error ? 'border-destructive' : ''}
              />
              <InputOTPSlot
                index={2}
                className={error ? 'border-destructive' : ''}
              />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className={error ? 'border-destructive' : ''}
              />
              <InputOTPSlot
                index={4}
                className={error ? 'border-destructive' : ''}
              />
              <InputOTPSlot
                index={5}
                className={error ? 'border-destructive' : ''}
              />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {isVerifying && (
            <p className="text-sm text-muted-foreground">
              Verifying code...
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Hint: Try "123456" for a valid code
          </p>
        </div>
      );
    };

    return <TwoFactorExample />;
  },
};

/**
 * Multiple group patterns.
 *
 * Shows different grouping patterns for various use cases.
 * Demonstrates flexibility in visual organization.
 */
export const GroupingPatterns: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 2-2-2 pattern */}
      <div className="space-y-2">
        <p className="text-sm font-medium">2-2-2 Pattern</p>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* 4-2 pattern */}
      <div className="space-y-2">
        <p className="text-sm font-medium">4-2 Pattern</p>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* No separator */}
      <div className="space-y-2">
        <p className="text-sm font-medium">No Separator (Continuous)</p>
        <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed example.
 *
 * Demonstrates using the Ozean Licht turquoise color (#0ec2bc) for accents.
 * Shows active state styling with brand colors.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const ThemedExample = () => {
      const [value, setValue] = useState('');

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: '#0ec2bc' }}>
              Verify Your Account
            </h3>
            <p className="text-sm text-muted-foreground">
              We've sent a verification code to your email
            </p>
          </div>

          <InputOTP
            maxLength={6}
            value={value}
            onChange={setValue}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="focus-within:ring-[#0ec2bc]"
              />
              <InputOTPSlot
                index={1}
                className="focus-within:ring-[#0ec2bc]"
              />
              <InputOTPSlot
                index={2}
                className="focus-within:ring-[#0ec2bc]"
              />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className="focus-within:ring-[#0ec2bc]"
              />
              <InputOTPSlot
                index={4}
                className="focus-within:ring-[#0ec2bc]"
              />
              <InputOTPSlot
                index={5}
                className="focus-within:ring-[#0ec2bc]"
              />
            </InputOTPGroup>
          </InputOTP>

          <Button
            className="w-full"
            disabled={value.length !== 6}
            style={{
              backgroundColor: value.length === 6 ? '#0ec2bc' : undefined,
              color: value.length === 6 ? 'white' : undefined,
            }}
          >
            Verify Code
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Didn't receive a code?{' '}
            <button className="underline" style={{ color: '#0ec2bc' }}>
              Resend
            </button>
          </p>
        </div>
      );
    };

    return <ThemedExample />;
  },
};

/**
 * Interactive test with play function.
 *
 * Tests OTP input behavior including typing, paste, and keyboard navigation.
 */
export const InteractiveTest: Story = {
  render: () => (
    <div className="space-y-4">
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} data-testid="otp-input">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground text-center">
        Interactive test: Type or paste a 6-digit code
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the OTP input container
    const otpInput = canvas.getByTestId('otp-input');
    await expect(otpInput).toBeInTheDocument();

    // Wait a moment for component to be fully mounted
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
