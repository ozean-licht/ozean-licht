'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  CossUIDialog,
  CossUIDialogPopup,
  CossUIDialogHeader,
  CossUIDialogFooter,
  CossUIDialogTitle,
  CossUIDialogDescription,
  CossUIDialogClose,
  CossUIButton,
  CossUIInput,
  CossUITextarea,
  CossUILabel,
  CossUISwitch,
  CossUISpinner,
} from '@shared/ui';
import {
  QuizQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  isValidQuestion,
} from '@/types/quiz';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';
import FillBlankEditor from './FillBlankEditor';
import { sanitizeHtml } from '@/lib/utils/sanitize';

interface QuestionEditorProps {
  question: QuizQuestion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: QuizQuestion) => void;
  disabled?: boolean;
}

interface FormErrors {
  question?: string;
  points?: string;
  options?: string;
  correctAnswer?: string;
  blanks?: string;
}

/**
 * Question editor modal
 *
 * Renders type-specific editor based on question.type:
 * - multiple_choice: MultipleChoiceEditor
 * - true_false: TrueFalseEditor
 * - fill_blank: FillBlankEditor
 */
export default function QuestionEditor({
  question: initialQuestion,
  open,
  onOpenChange,
  onSave,
  disabled = false,
}: QuestionEditorProps) {
  const [question, setQuestion] = useState<QuizQuestion>(initialQuestion);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset when modal opens with new question
  useEffect(() => {
    if (open) {
      setQuestion(initialQuestion);
      setErrors({});
    }
  }, [open, initialQuestion]);

  // Validate the question
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!question.question.trim()) {
      newErrors.question = 'Question text is required';
    }

    if (question.points < 0) {
      newErrors.points = 'Points cannot be negative';
    }

    // Type-specific validation
    switch (question.type) {
      case 'multiple_choice': {
        const mc = question as MultipleChoiceQuestion;
        if (mc.options.length < 2) {
          newErrors.options = 'At least 2 options are required';
        } else if (!mc.options.some(o => o.isCorrect)) {
          newErrors.options = 'At least one option must be correct';
        } else if (mc.options.some(o => !o.text.trim())) {
          newErrors.options = 'All options must have text';
        }
        break;
      }
      case 'fill_blank': {
        const fb = question as FillBlankQuestion;
        if (fb.blanks.length === 0) {
          newErrors.blanks = 'At least one blank is required';
        } else if (fb.blanks.some(b => b.acceptedAnswers.length === 0 || !b.acceptedAnswers[0])) {
          newErrors.blanks = 'Each blank must have at least one accepted answer';
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [question]);

  // Handle field changes
  const handleFieldChange = useCallback(<K extends keyof QuizQuestion>(
    field: K,
    value: QuizQuestion[K]
  ) => {
    setQuestion(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Sanitize text field on blur
  const handleTextBlur = useCallback((field: 'question' | 'explanation' | 'hint') => (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const sanitized = sanitizeHtml(e.target.value);
    if (sanitized !== e.target.value) {
      setQuestion(prev => ({
        ...prev,
        [field]: sanitized,
      }));
    }
  }, []);

  // Handle type-specific changes
  const handleTypeSpecificChange = useCallback((updates: Partial<QuizQuestion>) => {
    setQuestion(prev => ({
      ...prev,
      ...updates,
    } as QuizQuestion));
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      onSave(question);
    } finally {
      setIsSubmitting(false);
    }
  }, [question, validate, onSave]);

  // Get the title based on question type
  const getTitle = (): string => {
    const isNew = !initialQuestion.question;
    const typeLabel = {
      multiple_choice: 'Multiple Choice',
      true_false: 'True/False',
      fill_blank: 'Fill in the Blank',
      matching: 'Matching',
    }[question.type];
    return `${isNew ? 'Add' : 'Edit'} ${typeLabel} Question`;
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      <CossUIDialogPopup className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <CossUIDialogHeader>
          <CossUIDialogTitle>{getTitle()}</CossUIDialogTitle>
          <CossUIDialogDescription>
            Configure the question and its correct answer.
          </CossUIDialogDescription>
        </CossUIDialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Text */}
          <div className="space-y-2">
            <CossUILabel htmlFor="question-text" className="text-sm font-medium">
              Question <span className="text-destructive">*</span>
            </CossUILabel>
            <CossUITextarea
              id="question-text"
              value={question.question}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleFieldChange('question', e.target.value)
              }
              onBlur={handleTextBlur('question')}
              placeholder="Enter your question..."
              rows={3}
              className={errors.question ? 'border-destructive' : ''}
              disabled={disabled || isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.question}
              aria-describedby={errors.question ? 'question-error' : question.type === 'fill_blank' ? 'question-help' : undefined}
            />
            {errors.question && (
              <p id="question-error" className="text-sm text-destructive" role="alert">{errors.question}</p>
            )}
            {question.type === 'fill_blank' && (
              <p id="question-help" className="text-xs text-muted-foreground">
                Use {'{{blank}}'} to indicate where blanks should appear.
              </p>
            )}
          </div>

          {/* Type-specific Editor */}
          {question.type === 'multiple_choice' && (
            <MultipleChoiceEditor
              question={question as MultipleChoiceQuestion}
              onChange={handleTypeSpecificChange}
              error={errors.options}
              disabled={disabled || isSubmitting}
            />
          )}

          {question.type === 'true_false' && (
            <TrueFalseEditor
              question={question as TrueFalseQuestion}
              onChange={handleTypeSpecificChange}
              disabled={disabled || isSubmitting}
            />
          )}

          {question.type === 'fill_blank' && (
            <FillBlankEditor
              question={question as FillBlankQuestion}
              onChange={handleTypeSpecificChange}
              error={errors.blanks}
              disabled={disabled || isSubmitting}
            />
          )}

          {/* Points and Settings Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CossUILabel htmlFor="question-points" className="text-sm font-medium">
                Points
              </CossUILabel>
              <CossUIInput
                id="question-points"
                type="number"
                value={question.points}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange('points', Math.max(0, parseInt(e.target.value) || 0))
                }
                min={0}
                max={100}
                className={errors.points ? 'border-destructive' : ''}
                disabled={disabled || isSubmitting}
                aria-invalid={!!errors.points}
                aria-describedby={errors.points ? 'points-error' : undefined}
              />
              {errors.points && (
                <p id="points-error" className="text-sm text-destructive" role="alert">{errors.points}</p>
              )}
            </div>

            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Required
              </CossUILabel>
              <div className="flex items-center h-10">
                <CossUISwitch
                  checked={question.required}
                  onCheckedChange={(checked: boolean) =>
                    handleFieldChange('required', checked)
                  }
                  disabled={disabled || isSubmitting}
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  {question.required ? 'Must be answered' : 'Optional'}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation (shown after answering) */}
          <div className="space-y-2">
            <CossUILabel htmlFor="question-explanation" className="text-sm font-medium">
              Explanation (optional)
            </CossUILabel>
            <CossUITextarea
              id="question-explanation"
              value={question.explanation || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleFieldChange('explanation', e.target.value)
              }
              onBlur={handleTextBlur('explanation')}
              placeholder="Explain the correct answer (shown after submission)..."
              rows={2}
              disabled={disabled || isSubmitting}
              aria-label="Explanation shown after answering"
            />
          </div>

          {/* Hint (shown before answering) */}
          <div className="space-y-2">
            <CossUILabel htmlFor="question-hint" className="text-sm font-medium">
              Hint (optional)
            </CossUILabel>
            <CossUIInput
              id="question-hint"
              value={question.hint || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFieldChange('hint', e.target.value)
              }
              onBlur={handleTextBlur('hint')}
              placeholder="A helpful hint for learners..."
              disabled={disabled || isSubmitting}
              aria-label="Hint shown before answering"
            />
          </div>
        </div>

        <CossUIDialogFooter className="gap-2">
          <CossUIDialogClose>
            <CossUIButton
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </CossUIButton>
          </CossUIDialogClose>
          <CossUIButton
            type="button"
            onClick={handleSave}
            disabled={disabled || isSubmitting || !isValidQuestion(question)}
          >
            {isSubmitting && <CossUISpinner className="mr-2 h-4 w-4" />}
            Save Question
          </CossUIButton>
        </CossUIDialogFooter>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
