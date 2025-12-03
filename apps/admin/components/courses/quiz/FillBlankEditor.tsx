'use client';

import { useCallback } from 'react';
import {
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUISwitch,
} from '@shared/ui';
import { Plus, Trash2, TextCursorInput } from 'lucide-react';
import {
  FillBlankQuestion,
  BlankAnswer,
  generateQuizId,
  QUIZ_LIMITS,
} from '@/types/quiz';
import { sanitizeHtml } from '@/lib/utils/sanitize';

interface FillBlankEditorProps {
  question: FillBlankQuestion;
  onChange: (updates: Partial<FillBlankQuestion>) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Editor for fill-in-the-blank questions
 *
 * Features:
 * - Multiple blanks per question
 * - Multiple accepted answers per blank
 * - Case sensitivity toggle
 */
export default function FillBlankEditor({
  question,
  onChange,
  error,
  disabled = false,
}: FillBlankEditorProps) {
  // Add a new blank
  const handleAddBlank = useCallback(() => {
    const newBlank: BlankAnswer = {
      id: generateQuizId(),
      acceptedAnswers: [''],
      caseSensitive: false,
    };
    onChange({
      blanks: [...question.blanks, newBlank],
    });
  }, [question.blanks, onChange]);

  // Remove a blank
  const handleRemoveBlank = useCallback((blankId: string) => {
    if (question.blanks.length <= QUIZ_LIMITS.MIN_BLANKS) return;
    onChange({
      blanks: question.blanks.filter(b => b.id !== blankId),
    });
  }, [question.blanks, onChange]);

  // Update a blank
  const handleBlankChange = useCallback((
    blankId: string,
    updates: Partial<BlankAnswer>
  ) => {
    onChange({
      blanks: question.blanks.map(b =>
        b.id === blankId ? { ...b, ...updates } : b
      ),
    });
  }, [question.blanks, onChange]);

  // Update accepted answers (comma-separated)
  const handleAnswersChange = useCallback((blankId: string, value: string) => {
    const answers = value.split(',').map(a => a.trim()).filter(Boolean);
    handleBlankChange(blankId, {
      acceptedAnswers: answers.length > 0 ? answers : [''],
    });
  }, [handleBlankChange]);

  // Get display value for answers
  const getAnswersValue = (blank: BlankAnswer): string => {
    return blank.acceptedAnswers.join(', ');
  };

  // Sanitize answer text on blur
  const handleAnswerTextBlur = useCallback((blankId: string) => (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const sanitizedValue = sanitizeHtml(e.target.value);
    if (sanitizedValue !== e.target.value) {
      const answers = sanitizedValue.split(',').map(a => a.trim()).filter(Boolean);
      handleBlankChange(blankId, {
        acceptedAnswers: answers.length > 0 ? answers : [''],
      });
    }
  }, [handleBlankChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CossUILabel className="text-sm font-medium">
          Blank Answers
        </CossUILabel>
        <TextCursorInput className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Blanks List */}
      <div className="space-y-3">
        {question.blanks.map((blank, index) => (
          <div
            key={blank.id}
            className="p-3 border rounded-lg bg-muted/20 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Blank {index + 1}
              </span>
              <CossUIButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveBlank(blank.id)}
                disabled={disabled || question.blanks.length <= QUIZ_LIMITS.MIN_BLANKS}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Remove blank</span>
              </CossUIButton>
            </div>

            {/* Accepted Answers */}
            <div className="space-y-1">
              <CossUILabel className="text-xs text-muted-foreground">
                Accepted answers (comma-separated)
              </CossUILabel>
              <CossUIInput
                value={getAnswersValue(blank)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAnswersChange(blank.id, e.target.value)
                }
                onBlur={handleAnswerTextBlur(blank.id)}
                placeholder="answer1, answer2, answer3"
                disabled={disabled}
              />
            </div>

            {/* Case Sensitivity */}
            <div className="flex items-center gap-2">
              <CossUISwitch
                checked={blank.caseSensitive}
                onCheckedChange={(checked: boolean) =>
                  handleBlankChange(blank.id, { caseSensitive: checked })
                }
                disabled={disabled}
              />
              <span className="text-xs text-muted-foreground">
                Case sensitive
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Add Blank Button */}
      <CossUIButton
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddBlank}
        disabled={disabled || question.blanks.length >= QUIZ_LIMITS.MAX_BLANKS}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Blank
      </CossUIButton>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Use <code className="bg-muted px-1 py-0.5 rounded">{'{{blank}}'}</code> in
          your question text to indicate where blanks appear.
        </p>
        <p>
          Enter multiple accepted answers separated by commas.
          For example: &quot;color, colour&quot; accepts both spellings.
        </p>
      </div>
    </div>
  );
}
