'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CossUICard,
  CossUIButton,
  CossUIBadge,
} from '@shared/ui';
import {
  GripVertical,
  Pencil,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  TextCursorInput,
  Link2,
} from 'lucide-react';
import { QuizQuestion, QuestionType } from '@/types/quiz';

interface QuestionListItemProps {
  question: QuizQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  disabled?: boolean;
}

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True/False',
  fill_blank: 'Fill Blank',
  matching: 'Matching',
};

const questionTypeIcons: Record<QuestionType, typeof CheckCircle2> = {
  multiple_choice: CheckCircle2,
  true_false: XCircle,
  fill_blank: TextCursorInput,
  matching: Link2,
};

/**
 * Sortable question list item
 *
 * Displays:
 * - Question number and type
 * - Question text (truncated)
 * - Points
 * - Edit/duplicate/delete actions
 */
export default function QuestionListItem({
  question,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  disabled = false,
}: QuestionListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = questionTypeIcons[question.type];

  // Get answer preview based on question type
  const getAnswerPreview = (): string => {
    switch (question.type) {
      case 'multiple_choice': {
        const correct = question.options.filter(o => o.isCorrect);
        if (correct.length === 0) return 'No correct answer';
        return correct.map(o => o.text).join(', ') || 'Correct answer(s) set';
      }
      case 'true_false':
        return question.correctAnswer ? 'True' : 'False';
      case 'fill_blank':
        return `${question.blanks.length} blank(s)`;
      case 'matching':
        return `${question.pairs.length} pairs`;
      default:
        return '';
    }
  };

  return (
    <CossUICard
      ref={setNodeRef}
      style={style}
      className={`p-3 ${isDragging ? 'opacity-50 shadow-lg' : ''} ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground focus:outline-none"
          {...attributes}
          {...listeners}
          disabled={disabled}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">
              Q{index + 1}
            </span>
            <CossUIBadge variant="secondary" className="text-xs flex items-center gap-1">
              <Icon className="h-3 w-3" />
              {questionTypeLabels[question.type]}
            </CossUIBadge>
            <CossUIBadge variant="outline" className="text-xs">
              {question.points} pt{question.points !== 1 ? 's' : ''}
            </CossUIBadge>
            {question.required && (
              <CossUIBadge variant="destructive" className="text-xs">
                Required
              </CossUIBadge>
            )}
          </div>

          <p className="text-sm line-clamp-2 mb-1">
            {question.question || (
              <span className="text-muted-foreground italic">No question text</span>
            )}
          </p>

          <p className="text-xs text-muted-foreground">
            Answer: {getAnswerPreview()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </CossUIButton>
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Duplicate</span>
          </CossUIButton>
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={disabled}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </CossUIButton>
        </div>
      </div>
    </CossUICard>
  );
}
