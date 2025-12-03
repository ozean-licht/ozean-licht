'use client';

import { useCallback } from 'react';
import {
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUICheckbox,
  CossUISwitch,
} from '@shared/ui';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  MultipleChoiceQuestion,
  QuizOption,
  generateQuizId,
} from '@/types/quiz';

interface MultipleChoiceEditorProps {
  question: MultipleChoiceQuestion;
  onChange: (updates: Partial<MultipleChoiceQuestion>) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Editor for multiple choice questions
 *
 * Features:
 * - Add/remove options
 * - Mark correct answer(s)
 * - Support single or multiple correct answers
 * - Per-option feedback
 */
export default function MultipleChoiceEditor({
  question,
  onChange,
  error,
  disabled = false,
}: MultipleChoiceEditorProps) {
  // Add a new option
  const handleAddOption = useCallback(() => {
    const newOption: QuizOption = {
      id: generateQuizId(),
      text: '',
      isCorrect: false,
    };
    onChange({
      options: [...question.options, newOption],
    });
  }, [question.options, onChange]);

  // Remove an option
  const handleRemoveOption = useCallback((optionId: string) => {
    if (question.options.length <= 2) return; // Minimum 2 options
    onChange({
      options: question.options.filter(o => o.id !== optionId),
    });
  }, [question.options, onChange]);

  // Update an option
  const handleOptionChange = useCallback((
    optionId: string,
    updates: Partial<QuizOption>
  ) => {
    onChange({
      options: question.options.map(o =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    });
  }, [question.options, onChange]);

  // Toggle correct answer (single select mode)
  const handleToggleCorrect = useCallback((optionId: string, isCorrect: boolean) => {
    if (question.allowMultiple) {
      // Multi-select: toggle the specific option
      handleOptionChange(optionId, { isCorrect });
    } else {
      // Single select: make this the only correct answer
      onChange({
        options: question.options.map(o => ({
          ...o,
          isCorrect: o.id === optionId ? isCorrect : false,
        })),
      });
    }
  }, [question.allowMultiple, question.options, onChange, handleOptionChange]);

  // Toggle allow multiple
  const handleAllowMultipleChange = useCallback((allowMultiple: boolean) => {
    if (!allowMultiple) {
      // Switching to single select: keep only first correct answer
      const firstCorrectIndex = question.options.findIndex(o => o.isCorrect);
      onChange({
        allowMultiple,
        options: question.options.map((o, i) => ({
          ...o,
          isCorrect: i === firstCorrectIndex,
        })),
      });
    } else {
      onChange({ allowMultiple });
    }
  }, [question.options, onChange]);

  return (
    <div className="space-y-4">
      {/* Allow Multiple Toggle */}
      <div className="flex items-center justify-between">
        <CossUILabel className="text-sm font-medium">
          Answer Options
        </CossUILabel>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Allow multiple correct
          </span>
          <CossUISwitch
            checked={question.allowMultiple}
            onCheckedChange={handleAllowMultipleChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div
            key={option.id}
            className="flex items-start gap-2 p-2 border rounded-lg bg-muted/20"
          >
            {/* Drag Handle (placeholder for future DnD) */}
            <div className="mt-2.5 text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Correct Checkbox */}
            <div className="mt-2.5">
              <CossUICheckbox
                checked={option.isCorrect}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  handleToggleCorrect(option.id, checked === true)
                }
                disabled={disabled}
              />
            </div>

            {/* Option Text */}
            <div className="flex-1 space-y-1">
              <CossUIInput
                value={option.text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleOptionChange(option.id, { text: e.target.value })
                }
                placeholder={`Option ${index + 1}`}
                disabled={disabled}
              />
              {/* Optional feedback input */}
              <CossUIInput
                value={option.feedback || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleOptionChange(option.id, { feedback: e.target.value })
                }
                placeholder="Feedback for this option (optional)"
                className="text-xs"
                disabled={disabled}
              />
            </div>

            {/* Remove Button */}
            <CossUIButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveOption(option.id)}
              disabled={disabled || question.options.length <= 2}
              className="mt-1.5 h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove option</span>
            </CossUIButton>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Add Option Button */}
      <CossUIButton
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddOption}
        disabled={disabled || question.options.length >= 10}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Option
      </CossUIButton>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Check the box next to the correct answer{question.allowMultiple ? '(s)' : ''}.
        Minimum 2 options, maximum 10.
      </p>
    </div>
  );
}
