import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from './form-field-wrapper';

interface TextFieldProps {
  /** Unique ID for the field */
  id: string;
  /** Field label */
  label: string;
  /** Current value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Text Field Component
 *
 * Fully-featured text input field with label, validation, and accessibility support.
 *
 * Features:
 * - Multiple input types (text, email, password, etc.)
 * - Error state styling
 * - Required field indicator
 * - ARIA attributes for accessibility
 * - Hint text support
 *
 * @example
 * ```tsx
 * <TextField
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   placeholder="you@example.com"
 *   required
 *   error={errors.email}
 * />
 * ```
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required,
  disabled,
  type = 'text',
  className,
}: TextFieldProps) {
  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={required}
      />
    </FormFieldWrapper>
  );
}
