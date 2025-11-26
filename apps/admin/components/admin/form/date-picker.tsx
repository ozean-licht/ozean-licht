'use client';

import { Calendar } from '@/components/ui/calendar';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/lib/ui';
import { FormFieldWrapper } from './form-field-wrapper';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  /** Unique ID for the field */
  id: string;
  /** Field label */
  label: string;
  /** Current value */
  value: Date | undefined;
  /** Called when value changes */
  onChange: (date: Date | undefined) => void;
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
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Date Picker Component
 *
 * Calendar-based date picker with label, validation, and accessibility support.
 *
 * Features:
 * - Calendar popover with month/year navigation
 * - Date range restrictions (min/max dates)
 * - Formatted date display
 * - Keyboard accessible
 * - Error state styling
 *
 * @example
 * ```tsx
 * <DatePicker
 *   id="birthdate"
 *   label="Birth Date"
 *   value={birthdate}
 *   onChange={setBirthdate}
 *   maxDate={new Date()}
 *   required
 *   error={errors.birthdate}
 * />
 * ```
 */
export function DatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = 'Pick a date',
  error,
  hint,
  required,
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => {
              if (disabled) return true;
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  );
}
