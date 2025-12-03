'use client';

import { useState, useCallback } from 'react';
import {
  CossUICard,
  CossUIButton,
  CossUIBadge,
  CossUICheckbox,
  CossUIInput,
  CossUIProgress,
} from '@shared/ui';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  QuizData,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
} from '@/types/quiz';
import { renderSanitized } from '@/lib/utils/sanitize-quiz';

interface QuizPreviewProps {
  quiz: QuizData;
}

interface QuestionAnswer {
  questionId: string;
  answer: string[] | boolean | Record<string, string>;
}

/**
 * Quiz preview for testing
 *
 * Features:
 * - Navigate through questions
 * - Answer questions (simulated)
 * - See results
 * - Reset and try again
 */
export default function QuizPreview({ quiz }: QuizPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];

  // Calculate score
  const calculateScore = useCallback((): { correct: number; total: number; percentage: number } => {
    let correct = 0;
    const total = questions.length;

    questions.forEach(q => {
      const answer = answers[q.id];
      if (!answer) return;

      switch (q.type) {
        case 'multiple_choice': {
          const mc = q as MultipleChoiceQuestion;
          const selected = answer.answer as string[];
          const correctIds = mc.options.filter(o => o.isCorrect).map(o => o.id);
          if (
            selected.length === correctIds.length &&
            selected.every(id => correctIds.includes(id))
          ) {
            correct++;
          }
          break;
        }
        case 'true_false': {
          const tf = q as TrueFalseQuestion;
          if (answer.answer === tf.correctAnswer) {
            correct++;
          }
          break;
        }
        case 'fill_blank': {
          const fb = q as FillBlankQuestion;
          const userAnswers = answer.answer as Record<string, string>;
          const allCorrect = fb.blanks.every(blank => {
            const userAnswer = userAnswers[blank.id] || '';
            return blank.acceptedAnswers.some(accepted => {
              if (blank.caseSensitive) {
                return userAnswer === accepted;
              }
              return userAnswer.toLowerCase() === accepted.toLowerCase();
            });
          });
          if (allCorrect) correct++;
          break;
        }
      }
    });

    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }, [questions, answers]);

  // Handle answer change
  const handleAnswer = useCallback((questionId: string, answer: QuestionAnswer['answer']) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, answer },
    }));
  }, []);

  // Handle navigation
  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  }, []);

  // Render empty state
  if (questions.length === 0) {
    return (
      <CossUICard className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">
          No questions to preview. Add some questions first.
        </p>
      </CossUICard>
    );
  }

  // Render results
  if (isSubmitted) {
    const score = calculateScore();
    const passed = score.percentage >= quiz.settings.passingScore;

    return (
      <CossUICard className="p-6 space-y-6" role="region" aria-label="Quiz results">
        <div className="text-center" role="status" aria-live="polite">
          {passed ? (
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" aria-hidden="true" />
          )}
          <h3 className="text-2xl font-bold mb-2">
            {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
          </h3>
          <p className="text-4xl font-bold text-primary mb-2" aria-label={`Score: ${score.percentage} percent`}>
            {score.percentage}%
          </p>
          <p className="text-muted-foreground">
            {score.correct} of {score.total} correct
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Passing score: {quiz.settings.passingScore}%
          </p>
        </div>

        <CossUIButton onClick={handleReset} className="w-full" aria-label="Reset quiz and try again">
          Try Again
        </CossUIButton>
      </CossUICard>
    );
  }

  return (
    <CossUICard className="p-6 space-y-6" role="form" aria-label="Quiz">
      {/* Header */}
      <div className="flex items-center justify-between" role="region" aria-label="Quiz progress">
        <div className="flex items-center gap-2">
          <CossUIBadge variant="secondary" aria-label={`Question ${currentIndex + 1} of ${questions.length}`}>
            Question {currentIndex + 1} of {questions.length}
          </CossUIBadge>
          {currentQuestion && (
            <CossUIBadge variant="outline" aria-label={`${currentQuestion.points} points`}>
              {currentQuestion.points} pt{currentQuestion.points !== 1 ? 's' : ''}
            </CossUIBadge>
          )}
        </div>
        {quiz.settings.timeLimitMinutes && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground" aria-label={`Time limit: ${quiz.settings.timeLimitMinutes} minutes`}>
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{quiz.settings.timeLimitMinutes} min</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <CossUIProgress
        value={(Object.keys(answers).length / questions.length) * 100}
        className="h-2"
        aria-label={`Quiz progress: ${Object.keys(answers).length} of ${questions.length} questions answered`}
      />

      {/* Question */}
      {currentQuestion && (
        <div className="space-y-4">
          {/* SECURITY: Content is sanitized via renderSanitized() using DOMPurify before rendering */}
          <p
            className="text-lg font-medium"
            dangerouslySetInnerHTML={{ __html: renderSanitized(currentQuestion.question) }}
          />

          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple_choice' && (
            <MultipleChoicePreview
              question={currentQuestion as MultipleChoiceQuestion}
              answer={answers[currentQuestion.id]?.answer as string[] | undefined}
              onChange={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}

          {/* True/False */}
          {currentQuestion.type === 'true_false' && (
            <TrueFalsePreview
              question={currentQuestion as TrueFalseQuestion}
              answer={answers[currentQuestion.id]?.answer as boolean | undefined}
              onChange={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}

          {/* Fill Blank */}
          {currentQuestion.type === 'fill_blank' && (
            <FillBlankPreview
              question={currentQuestion as FillBlankQuestion}
              answer={answers[currentQuestion.id]?.answer as Record<string, string> | undefined}
              onChange={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}

          {/* Hint */}
          {currentQuestion.hint && (
            <p className="text-sm text-muted-foreground italic">
              {/* SECURITY: Content is sanitized via renderSanitized() using DOMPurify before rendering */}
              Hint: <span dangerouslySetInnerHTML={{ __html: renderSanitized(currentQuestion.hint) }} />
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t" role="navigation" aria-label="Quiz navigation">
        <CossUIButton
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Go to previous question"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Previous
        </CossUIButton>

        {currentIndex === questions.length - 1 ? (
          <CossUIButton onClick={handleSubmit} aria-label="Submit quiz answers">
            Submit Quiz
          </CossUIButton>
        ) : (
          <CossUIButton onClick={goNext} aria-label="Go to next question">
            Next
            <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </CossUIButton>
        )}
      </div>
    </CossUICard>
  );
}

// Multiple Choice Preview
function MultipleChoicePreview({
  question,
  answer = [],
  onChange,
}: {
  question: MultipleChoiceQuestion;
  answer?: string[];
  onChange: (answer: string[]) => void;
}) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (question.allowMultiple) {
      if (checked) {
        onChange([...answer, optionId]);
      } else {
        onChange(answer.filter(id => id !== optionId));
      }
    } else {
      onChange(checked ? [optionId] : []);
    }
  };

  if (question.allowMultiple) {
    return (
      <div className="space-y-2">
        {question.options.map(option => (
          <label
            key={option.id}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
          >
            <CossUICheckbox
              checked={answer.includes(option.id)}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                handleChange(option.id, checked === true)
              }
            />
            {/* SECURITY: Content is sanitized via renderSanitized() using DOMPurify before rendering */}
            <span dangerouslySetInnerHTML={{ __html: renderSanitized(option.text) }} />
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {question.options.map(option => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
            answer[0] === option.id
              ? 'border-primary bg-primary/10'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onChange([option.id])}
        >
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            answer[0] === option.id ? 'border-primary' : 'border-muted-foreground'
          }`}>
            {answer[0] === option.id && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </div>
          {/* SECURITY: Content is sanitized via renderSanitized() using DOMPurify before rendering */}
          <span dangerouslySetInnerHTML={{ __html: renderSanitized(option.text) }} />
        </label>
      ))}
    </div>
  );
}

// True/False Preview
function TrueFalsePreview({
  answer,
  onChange,
}: {
  question: TrueFalseQuestion;
  answer?: boolean;
  onChange: (answer: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <label
        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
          answer === true ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
        }`}
        onClick={() => onChange(true)}
      >
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
          answer === true ? 'border-primary' : 'border-muted-foreground'
        }`}>
          {answer === true && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          )}
        </div>
        <span>True</span>
      </label>
      <label
        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
          answer === false ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
        }`}
        onClick={() => onChange(false)}
      >
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
          answer === false ? 'border-primary' : 'border-muted-foreground'
        }`}>
          {answer === false && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          )}
        </div>
        <span>False</span>
      </label>
    </div>
  );
}

// Fill Blank Preview
function FillBlankPreview({
  question,
  answer = {},
  onChange,
}: {
  question: FillBlankQuestion;
  answer?: Record<string, string>;
  onChange: (answer: Record<string, string>) => void;
}) {
  const handleChange = (blankId: string, value: string) => {
    onChange({
      ...answer,
      [blankId]: value,
    });
  };

  return (
    <div className="space-y-3">
      {question.blanks.map((blank, index) => (
        <div key={blank.id} className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Blank {index + 1}:</span>
          <CossUIInput
            value={answer[blank.id] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(blank.id, e.target.value)
            }
            placeholder="Your answer..."
            className="flex-1"
          />
        </div>
      ))}
    </div>
  );
}
