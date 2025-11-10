import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldWrapperProps {
  /** Unique ID for the field (must match input id) */
  id: string;
  /** Field label text */
  label: string;
  /** Error message (displays below input) */
  error?: string;
  /** Hint text (displays below input when no error) */
  hint?: string;
  /** Whether field is required (shows asterisk) */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Child input element */
  children: React.ReactNode;
}

/**
 * Form Field Wrapper Component
 *
 * Reusable wrapper for form fields that provides:
 * - Label with required indicator
 * - Error message display
 * - Hint text display
 * - Consistent spacing and layout
 *
 * @example
 * ```tsx
 * <FormFieldWrapper
 *   id="email"
 *   label="Email Address"
 *   required
 *   error={errors.email}
 *   hint="We'll never share your email"
 * >
 *   <Input id="email" type="email" value={email} onChange={setEmail} />
 * </FormFieldWrapper>
 * ```
 */
export function FormFieldWrapper({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-sm text-muted-foreground" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
