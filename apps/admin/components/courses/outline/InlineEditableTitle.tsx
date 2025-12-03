'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';

export interface InlineEditableTitleProps {
  value: string;
  isEditing: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onSave: (newValue: string) => Promise<void>;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

export function InlineEditableTitle({
  value,
  isEditing,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
  placeholder = 'Untitled',
  className,
}: InlineEditableTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Focus and select when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Sync local value when prop changes (after save)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = useCallback(async () => {
    const trimmed = localValue.trim();
    if (trimmed && trimmed !== value) {
      // Sanitize input to prevent XSS attacks
      const sanitized = DOMPurify.sanitize(trimmed, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true,
      });
      await onSave(sanitized);
    }
    onCancel();
  }, [localValue, value, onSave, onCancel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      onCancel();
    }
  };

  const handleBlur = () => {
    // Save if value changed, otherwise just cancel
    const trimmed = localValue.trim();
    if (trimmed && trimmed !== value) {
      handleSave();
    } else {
      setLocalValue(value);
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn('relative flex items-center', className)}>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={isSaving}
          className={cn(
            'w-full bg-transparent border-none outline-none',
            'px-1 -mx-1 py-0.5',
            'focus:ring-2 focus:ring-primary rounded',
            'font-medium text-base',
            isSaving && 'opacity-50 cursor-wait'
          )}
          placeholder={placeholder}
        />
        {isSaving && (
          <Loader2 className="h-4 w-4 ml-2 animate-spin text-muted-foreground flex-shrink-0" />
        )}
      </div>
    );
  }

  return (
    <span
      onClick={onEdit}
      className={cn(
        'cursor-text px-1 -mx-1 py-0.5 rounded',
        'hover:bg-accent/50 transition-colors',
        'font-medium text-base',
        !value && 'italic text-muted-foreground',
        className
      )}
    >
      {value || placeholder}
    </span>
  );
}
