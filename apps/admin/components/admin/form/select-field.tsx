import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from './form-field-wrapper';
import { SelectOption } from '@/types/admin-components';

interface SelectFieldProps {
  /** Unique ID for the field */
  id: string;
  /** Field label */
  label: string;
  /** Current value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Select options */
  options: SelectOption[];
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
  /** Additional CSS classes */
  className?: string;
}

/**
 * Select Field Component
 *
 * Dropdown select field with label, validation, and accessibility support.
 *
 * Features:
 * - Keyboard navigation
 * - Search filtering (via shadcn/ui Select)
 * - Error state styling
 * - Required field indicator
 * - ARIA attributes for accessibility
 *
 * @example
 * ```tsx
 * <SelectField
 *   id="role"
 *   label="User Role"
 *   value={role}
 *   onChange={setRole}
 *   options={[
 *     { value: 'admin', label: 'Administrator' },
 *     { value: 'user', label: 'User' }
 *   ]}
 *   required
 *   error={errors.role}
 * />
 * ```
 */
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  hint,
  required,
  disabled,
  className,
}: SelectFieldProps) {
  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
}
