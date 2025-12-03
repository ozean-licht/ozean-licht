'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUISelectGroup,
  CossUISelectLabel,
  CossUIBadge,
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUISpinner,
} from '@shared/ui';
import { Plus, X, Lock, Eye, CheckCircle } from 'lucide-react';

// Types
export type PrerequisiteType = 'completion' | 'passing_score' | 'viewed';

export interface Prerequisite {
  requiredLessonId: string;
  type: PrerequisiteType;
  minScore?: number;
}

export interface PrerequisiteSelectorProps {
  courseId: string;
  lessonId: string;
  value: Prerequisite[];
  onChange: (prerequisites: Prerequisite[]) => void;
  disabled?: boolean;
}

interface AvailableLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  moduleOrder: number;
}

interface GroupedLessons {
  moduleId: string;
  moduleName: string;
  moduleOrder: number;
  lessons: AvailableLesson[];
}

// Helper function to get icon for prerequisite type
const getTypeIcon = (type: PrerequisiteType) => {
  switch (type) {
    case 'completion':
      return CheckCircle;
    case 'passing_score':
      return Lock;
    case 'viewed':
      return Eye;
  }
};


export default function PrerequisiteSelector({
  courseId,
  lessonId,
  value,
  onChange,
  disabled = false,
}: PrerequisiteSelectorProps) {
  const [availableLessons, setAvailableLessons] = useState<AvailableLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // Fetch available lessons on mount
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    async function fetchAvailableLessons() {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/courses/${courseId}/prerequisites/available?lessonId=${lessonId}`;
        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error('Failed to fetch available lessons');
        }

        const data = await response.json();

        if (isMounted) {
          setAvailableLessons(data || []);
        }
      } catch (err) {
        // Ignore abort errors (component unmounted)
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.error('Failed to fetch available lessons:', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load available lessons');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (courseId && lessonId) {
      fetchAvailableLessons();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [courseId, lessonId]);

  // Group lessons by module
  const groupedLessons = useMemo(() => {
    const groups: Record<string, GroupedLessons> = {};

    availableLessons.forEach((lesson) => {
      if (!groups[lesson.moduleId]) {
        groups[lesson.moduleId] = {
          moduleId: lesson.moduleId,
          moduleName: lesson.moduleName,
          moduleOrder: lesson.moduleOrder,
          lessons: [],
        };
      }
      groups[lesson.moduleId].lessons.push(lesson);
    });

    // Sort groups by module order
    return Object.values(groups).sort((a, b) => a.moduleOrder - b.moduleOrder);
  }, [availableLessons]);

  // Filter out already selected lessons
  const selectableLessons = useMemo(() => {
    const selectedIds = new Set(value.map((p) => p.requiredLessonId));
    return availableLessons.filter((lesson) => !selectedIds.has(lesson.id));
  }, [availableLessons, value]);

  // Get lesson by ID
  const getLessonById = (id: string): AvailableLesson | undefined => {
    return availableLessons.find((lesson) => lesson.id === id);
  };

  // Handle adding a new prerequisite
  const handleAdd = () => {
    if (!selectedLessonId) return;

    const newPrerequisite: Prerequisite = {
      requiredLessonId: selectedLessonId,
      type: 'completion',
      minScore: undefined,
    };

    onChange([...value, newPrerequisite]);
    setSelectedLessonId('');
  };

  // Handle removing a prerequisite
  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  // Handle changing prerequisite type
  const handleTypeChange = (index: number, type: PrerequisiteType) => {
    const newValue = [...value];
    newValue[index] = {
      ...newValue[index],
      type,
      minScore: type === 'passing_score' ? 70 : undefined,
    };
    onChange(newValue);
  };

  // Handle changing minimum score
  const handleMinScoreChange = (index: number, minScore: number) => {
    const newValue = [...value];
    newValue[index] = {
      ...newValue[index],
      minScore: Math.max(0, Math.min(100, minScore)),
    };
    onChange(newValue);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-2">
        <CossUILabel className="text-sm font-medium">Prerequisites</CossUILabel>
        <div className="flex items-center gap-2 p-4 rounded-lg border border-primary/25 bg-card/50">
          <CossUISpinner className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Loading available lessons...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-2">
        <CossUILabel className="text-sm font-medium">Prerequisites</CossUILabel>
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Empty state (no available lessons)
  if (availableLessons.length === 0) {
    return (
      <div className="space-y-2">
        <CossUILabel className="text-sm font-medium">Prerequisites</CossUILabel>
        <div className="p-4 text-sm text-muted-foreground bg-card/50 rounded-lg border border-primary/25">
          No lessons available to set as prerequisites.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <CossUILabel className="text-sm font-medium">Prerequisites</CossUILabel>
        <p className="text-xs text-muted-foreground">
          Select lessons that must be completed before accessing this lesson.
        </p>
      </div>

      {/* Selected Prerequisites List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((prerequisite, index) => {
            const lesson = getLessonById(prerequisite.requiredLessonId);
            if (!lesson) return null;

            const TypeIcon = getTypeIcon(prerequisite.type);

            return (
              <div
                key={`${prerequisite.requiredLessonId}-${index}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-primary/25 bg-card/50"
              >
                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CossUIBadge
                      variant="outline"
                      className="text-xs font-light shrink-0"
                    >
                      {lesson.moduleName}
                    </CossUIBadge>
                    <span className="text-sm font-medium text-foreground truncate">
                      {lesson.title}
                    </span>
                  </div>
                </div>

                {/* Type Selector */}
                <div className="flex items-center gap-2">
                  <CossUISelect
                    value={prerequisite.type}
                    onValueChange={(newType: string) =>
                      handleTypeChange(index, newType as PrerequisiteType)
                    }
                    disabled={disabled}
                  >
                    <CossUISelectTrigger className="w-[160px] h-8 text-xs">
                      <div className="flex items-center gap-1.5">
                        <TypeIcon className="h-3.5 w-3.5" />
                        <CossUISelectValue />
                      </div>
                    </CossUISelectTrigger>
                    <CossUISelectPopup>
                      <CossUISelectItem value="completion">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Complete
                        </div>
                      </CossUISelectItem>
                      <CossUISelectItem value="passing_score">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Pass with score
                        </div>
                      </CossUISelectItem>
                      <CossUISelectItem value="viewed">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </div>
                      </CossUISelectItem>
                    </CossUISelectPopup>
                  </CossUISelect>

                  {/* Min Score Input (only for passing_score type) */}
                  {prerequisite.type === 'passing_score' && (
                    <div className="flex items-center gap-1.5">
                      <CossUIInput
                        type="number"
                        min={0}
                        max={100}
                        value={prerequisite.minScore ?? 70}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            handleMinScoreChange(index, val);
                          }
                        }}
                        className="w-16 h-8 text-xs text-center"
                        disabled={disabled}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <CossUIButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove prerequisite</span>
                </CossUIButton>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Prerequisite */}
      {selectableLessons.length > 0 && (
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <CossUILabel className="text-xs font-medium">Add Prerequisite</CossUILabel>
            <CossUISelect
              value={selectedLessonId}
              onValueChange={setSelectedLessonId}
              disabled={disabled}
            >
              <CossUISelectTrigger>
                <CossUISelectValue placeholder="Select a lesson..." />
              </CossUISelectTrigger>
              <CossUISelectPopup>
                {groupedLessons
                  .filter((group) =>
                    group.lessons.some((lesson) =>
                      selectableLessons.some((sl) => sl.id === lesson.id)
                    )
                  )
                  .map((group) => (
                    <CossUISelectGroup key={group.moduleId}>
                      <CossUISelectLabel>{group.moduleName}</CossUISelectLabel>
                      {group.lessons
                        .filter((lesson) =>
                          selectableLessons.some((sl) => sl.id === lesson.id)
                        )
                        .map((lesson) => (
                          <CossUISelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </CossUISelectItem>
                        ))}
                    </CossUISelectGroup>
                  ))}
              </CossUISelectPopup>
            </CossUISelect>
          </div>

          <CossUIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={disabled || !selectedLessonId}
            className="h-9 px-3"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add
          </CossUIButton>
        </div>
      )}

      {/* Empty state when all lessons are selected */}
      {value.length > 0 && selectableLessons.length === 0 && (
        <div className="p-3 text-xs text-muted-foreground bg-card/50 rounded-lg border border-primary/25">
          All available lessons have been added as prerequisites.
        </div>
      )}
    </div>
  );
}
