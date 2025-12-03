'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CossUIButton,
  CossUICard,
  CossUITabs,
  CossUITabsList,
  CossUITabsTab,
  CossUITabsPanel,
  CossUIBadge,
} from '@shared/ui';
import {
  Plus,
  Settings,
  Eye,
  ListChecks,
  AlertCircle,
} from 'lucide-react';
import {
  QuizData,
  QuizQuestion,
  QuestionType,
  emptyQuizData,
  generateQuizId,
  calculateQuizSummary,
} from '@/types/quiz';
import QuestionEditor from './QuestionEditor';
import QuestionListItem from './QuestionListItem';
import QuizSettings from './QuizSettings';
import QuizPreview from './QuizPreview';

interface QuizBuilderProps {
  value: QuizData;
  onChange: (value: QuizData) => void;
  disabled?: boolean;
}

type TabValue = 'questions' | 'settings' | 'preview';

/**
 * Main quiz authoring interface
 *
 * Features:
 * - Add/edit/delete questions
 * - Drag-drop reordering
 * - Quiz settings (passing score, retakes, etc.)
 * - Live preview
 */
export default function QuizBuilder({
  value = emptyQuizData,
  onChange,
  disabled = false,
}: QuizBuilderProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('questions');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Quiz summary for display
  const summary = calculateQuizSummary(value);

  // Handle adding a new question
  const handleAddQuestion = useCallback((type: QuestionType) => {
    const newQuestion = createEmptyQuestion(type);
    setEditingQuestion(newQuestion);
    setIsEditorOpen(true);
  }, []);

  // Handle editing an existing question
  const handleEditQuestion = useCallback((question: QuizQuestion) => {
    setEditingQuestion({ ...question });
    setIsEditorOpen(true);
  }, []);

  // Handle saving a question (new or edited)
  const handleSaveQuestion = useCallback((question: QuizQuestion) => {
    const existingIndex = value.questions.findIndex(q => q.id === question.id);

    let newQuestions: QuizQuestion[];
    if (existingIndex >= 0) {
      // Update existing
      newQuestions = [...value.questions];
      newQuestions[existingIndex] = question;
    } else {
      // Add new
      newQuestions = [...value.questions, question];
    }

    onChange({
      ...value,
      questions: newQuestions,
    });

    setIsEditorOpen(false);
    setEditingQuestion(null);
  }, [value, onChange]);

  // Handle deleting a question
  const handleDeleteQuestion = useCallback((questionId: string) => {
    onChange({
      ...value,
      questions: value.questions.filter(q => q.id !== questionId),
    });
  }, [value, onChange]);

  // Handle duplicating a question
  const handleDuplicateQuestion = useCallback((question: QuizQuestion) => {
    const duplicated = {
      ...question,
      id: generateQuizId(),
    };
    onChange({
      ...value,
      questions: [...value.questions, duplicated],
    });
  }, [value, onChange]);

  // Handle drag-drop reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.questions.findIndex(q => q.id === active.id);
      const newIndex = value.questions.findIndex(q => q.id === over.id);

      onChange({
        ...value,
        questions: arrayMove(value.questions, oldIndex, newIndex),
      });
    }
  }, [value, onChange]);

  // Handle settings change
  const handleSettingsChange = useCallback((settings: QuizData['settings']) => {
    onChange({
      ...value,
      settings,
    });
  }, [value, onChange]);

  // Close editor
  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-primary" />
            <span>{summary.totalQuestions} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{summary.totalPoints} points</span>
          </div>
          {summary.hasTimeLimit && (
            <CossUIBadge variant="secondary" className="text-xs">
              Timed
            </CossUIBadge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Pass: {value.settings.passingScore}%
        </div>
      </div>

      {/* Tabs */}
      <CossUITabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <CossUITabsList className="grid w-full grid-cols-3">
          <CossUITabsTab value="questions" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Questions</span>
          </CossUITabsTab>
          <CossUITabsTab value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </CossUITabsTab>
          <CossUITabsTab value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </CossUITabsTab>
        </CossUITabsList>

        {/* Questions Tab */}
        <CossUITabsPanel value="questions" className="pt-4">
          <div className="space-y-4">
            {/* Add Question Buttons */}
            <div className="flex flex-wrap gap-2">
              <CossUIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('multiple_choice')}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-1" />
                Multiple Choice
              </CossUIButton>
              <CossUIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('true_false')}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-1" />
                True/False
              </CossUIButton>
              <CossUIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('fill_blank')}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-1" />
                Fill Blank
              </CossUIButton>
            </div>

            {/* Question List */}
            {value.questions.length === 0 ? (
              <CossUICard className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No questions yet. Add your first question above.
                </p>
              </CossUICard>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={value.questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {value.questions.map((question, index) => (
                      <QuestionListItem
                        key={question.id}
                        question={question}
                        index={index}
                        onEdit={() => handleEditQuestion(question)}
                        onDelete={() => handleDeleteQuestion(question.id)}
                        onDuplicate={() => handleDuplicateQuestion(question)}
                        disabled={disabled}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </CossUITabsPanel>

        {/* Settings Tab */}
        <CossUITabsPanel value="settings" className="pt-4">
          <QuizSettings
            value={value.settings}
            onChange={handleSettingsChange}
            disabled={disabled}
          />
        </CossUITabsPanel>

        {/* Preview Tab */}
        <CossUITabsPanel value="preview" className="pt-4">
          <QuizPreview quiz={value} />
        </CossUITabsPanel>
      </CossUITabs>

      {/* Question Editor Modal */}
      {isEditorOpen && editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          open={isEditorOpen}
          onOpenChange={(open) => !open && handleCloseEditor()}
          onSave={handleSaveQuestion}
          disabled={disabled}
        />
      )}
    </div>
  );
}

/**
 * Create an empty question of the given type
 */
function createEmptyQuestion(type: QuestionType): QuizQuestion {
  const baseQuestion = {
    id: generateQuizId(),
    question: '',
    points: 1,
    required: true,
    explanation: '',
  };

  switch (type) {
    case 'multiple_choice':
      return {
        ...baseQuestion,
        type: 'multiple_choice',
        options: [
          { id: generateQuizId(), text: '', isCorrect: true },
          { id: generateQuizId(), text: '', isCorrect: false },
        ],
        allowMultiple: false,
      };
    case 'true_false':
      return {
        ...baseQuestion,
        type: 'true_false',
        correctAnswer: true,
      };
    case 'fill_blank':
      return {
        ...baseQuestion,
        type: 'fill_blank',
        blanks: [
          { id: generateQuizId(), acceptedAnswers: [''], caseSensitive: false },
        ],
      };
    case 'matching':
      return {
        ...baseQuestion,
        type: 'matching',
        pairs: [
          { id: generateQuizId(), left: '', right: '' },
          { id: generateQuizId(), left: '', right: '' },
        ],
      };
  }
}
