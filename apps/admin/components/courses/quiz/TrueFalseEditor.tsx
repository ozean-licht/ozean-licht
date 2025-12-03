'use client';

import { useCallback } from 'react';
import {
  CossUILabel,
} from '@shared/ui';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TrueFalseQuestion } from '@/types/quiz';

interface TrueFalseEditorProps {
  question: TrueFalseQuestion;
  onChange: (updates: Partial<TrueFalseQuestion>) => void;
  disabled?: boolean;
}

/**
 * Editor for true/false questions
 *
 * Simple selection for correct answer
 */
export default function TrueFalseEditor({
  question,
  onChange,
  disabled = false,
}: TrueFalseEditorProps) {
  const handleSelect = useCallback((value: boolean) => {
    if (disabled) return;
    onChange({
      correctAnswer: value,
    });
  }, [onChange, disabled]);

  return (
    <div className="space-y-4">
      <CossUILabel className="text-sm font-medium">
        Correct Answer
      </CossUILabel>

      <div className="grid grid-cols-2 gap-4">
        {/* True Option */}
        <button
          type="button"
          onClick={() => handleSelect(true)}
          disabled={disabled}
          className={`
            flex items-center gap-3 p-4 border rounded-lg cursor-pointer
            transition-colors text-left
            ${question.correctAnswer
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            question.correctAnswer ? 'border-primary' : 'border-muted-foreground'
          }`}>
            {question.correctAnswer && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-5 w-5 ${
              question.correctAnswer ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className={`font-medium ${
              question.correctAnswer ? 'text-primary' : ''
            }`}>
              True
            </span>
          </div>
        </button>

        {/* False Option */}
        <button
          type="button"
          onClick={() => handleSelect(false)}
          disabled={disabled}
          className={`
            flex items-center gap-3 p-4 border rounded-lg cursor-pointer
            transition-colors text-left
            ${!question.correctAnswer
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            !question.correctAnswer ? 'border-primary' : 'border-muted-foreground'
          }`}>
            {!question.correctAnswer && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <XCircle className={`h-5 w-5 ${
              !question.correctAnswer ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className={`font-medium ${
              !question.correctAnswer ? 'text-primary' : ''
            }`}>
              False
            </span>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Select the correct answer for this true/false question.
      </p>
    </div>
  );
}
