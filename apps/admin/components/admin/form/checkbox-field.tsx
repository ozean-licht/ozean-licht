'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxFieldProps {
  /** Unique ID for the field */
  id: string;
  /** Field label */
  label: string;
  /** Current checked state */
  checked: boolean;
  /** Called when checked state changes */
  onChange: (checked: boolean) => void;
  /** Optional description text below label */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Checkbox Field Component
 *
 * Checkbox input with label, description, and accessibility support.
 *
 * Features:
 * - Label click toggles checkbox
 * - Optional description text
 * - Error state styling
 * - ARIA attributes for accessibility
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   id="terms"
 *   label="Accept Terms and Conditions"
 *   description="You must accept the terms to continue"
 *   checked={acceptedTerms}
 *   onChange={setAcceptedTerms}
 *   error={errors.terms}
 * />
 * ```
 */
export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  description,
  error,
  disabled,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        />
        <div className="flex-1 space-y-1">
          <Label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground" id={`${id}-description`}>
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive mt-2" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
