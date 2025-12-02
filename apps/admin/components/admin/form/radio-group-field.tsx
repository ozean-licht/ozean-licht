'use client';

import { RadioGroup, RadioGroupItem, Label } from '@/lib/ui';
import { FormFieldWrapper } from './form-field-wrapper';
import { RadioOption } from '@/types/admin-components';

interface RadioGroupFieldProps {
  /** Unique ID for the field */
  id: string;
  /** Field label */
  label: string;
  /** Current selected value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Radio options */
  options: RadioOption[];
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Radio Group Field Component
 *
 * Radio button group with label, descriptions, and accessibility support.
 *
 * Features:
 * - Multiple radio options
 * - Optional description per option
 * - Error state styling
 * - Required field indicator
 * - ARIA attributes for accessibility
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * <RadioGroupField
 *   id="notification-preference"
 *   label="Notification Preference"
 *   value={preference}
 *   onChange={setPreference}
 *   options={[
 *     {
 *       value: 'email',
 *       label: 'Email',
 *       description: 'Receive notifications via email'
 *     },
 *     {
 *       value: 'sms',
 *       label: 'SMS',
 *       description: 'Receive notifications via text message'
 *     }
 *   ]}
 *   required
 * />
 * ```
 */
export function RadioGroupField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  hint,
  required,
  disabled,
  className,
}: RadioGroupFieldProps) {
  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={(val) => val && onChange(val as string)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      >
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${id}-${option.value}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FormFieldWrapper>
  );
}
