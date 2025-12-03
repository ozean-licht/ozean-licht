'use client';

import { useState, useEffect } from 'react';
import {
  CossUICard,
  CossUICardPanel,
  CossUILabel,
  CossUISwitch,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUIInput,
  CossUISpinner,
  CossUIPopover,
  CossUIPopoverTrigger,
  CossUIPopoverPortal,
  CossUIPopoverPositioner,
  CossUIPopoverPopup,
  CossUIButton,
} from '@shared/ui';
import { Calendar } from '@shared/ui';
import { Calendar as CalendarIcon, Clock, Timer, BookOpen, Layers } from 'lucide-react';
import { format } from 'date-fns';

type DripReleaseType =
  | 'immediate'
  | 'fixed_date'
  | 'relative_days'
  | 'relative_hours'
  | 'after_lesson'
  | 'after_module';

export interface DripScheduleValue {
  releaseType: DripReleaseType;
  releaseDate?: string;
  relativeDays?: number;
  relativeHours?: number;
  afterLessonId?: string;
  afterModuleId?: string;
  releaseTime?: string;
  isActive: boolean;
}

interface DripSchedulerProps {
  courseId: string;
  lessonId?: string;
  moduleId?: string;
  value: DripScheduleValue | null;
  onChange: (schedule: DripScheduleValue | null) => void;
  disabled?: boolean;
}

interface Module {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
}

const releaseTypeOptions = [
  { value: 'immediate', label: 'Immediate', icon: Clock, description: 'Available immediately on enrollment' },
  { value: 'fixed_date', label: 'Fixed Date', icon: CalendarIcon, description: 'Available on a specific date' },
  { value: 'relative_days', label: 'Relative Days', icon: Timer, description: 'Available N days after enrollment' },
  { value: 'relative_hours', label: 'Relative Hours', icon: Timer, description: 'Available N hours after enrollment' },
  { value: 'after_lesson', label: 'After Lesson', icon: BookOpen, description: 'Available after completing a lesson' },
  { value: 'after_module', label: 'After Module', icon: Layers, description: 'Available after completing a module' },
];

export default function DripScheduler({
  courseId,
  lessonId,
  moduleId,
  value,
  onChange,
  disabled = false,
}: DripSchedulerProps) {
  // Local state for form fields
  const [isActive, setIsActive] = useState(value?.isActive ?? false);
  const [releaseType, setReleaseType] = useState<DripReleaseType>(value?.releaseType ?? 'immediate');
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(
    value?.releaseDate ? new Date(value.releaseDate) : undefined
  );
  const [relativeDays, setRelativeDays] = useState<number>(value?.relativeDays ?? 1);
  const [relativeHours, setRelativeHours] = useState<number>(value?.relativeHours ?? 24);
  const [afterLessonId, setAfterLessonId] = useState<string | undefined>(value?.afterLessonId);
  const [afterModuleId, setAfterModuleId] = useState<string | undefined>(value?.afterModuleId);
  const [releaseTime, setReleaseTime] = useState<string>(value?.releaseTime ?? '09:00');

  // Data loading state
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Calendar popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Load modules when component mounts or courseId changes
  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;
    const abortController = new AbortController();

    const loadModules = async () => {
      setIsLoadingModules(true);
      setLoadError(null);
      try {
        const response = await fetch(`/api/courses/${courseId}/modules`, {
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error('Failed to load modules');
        const data = await response.json();

        if (isMounted) {
          setModules(data || []);
        }
      } catch (error) {
        // Ignore abort errors (component unmounted)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Error loading modules:', error);

        if (isMounted) {
          setLoadError('Failed to load modules');
          setModules([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingModules(false);
        }
      }
    };

    loadModules();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [courseId]);

  // Load lessons when modules are loaded
  useEffect(() => {
    if (!courseId || modules.length === 0) return;

    let isMounted = true;
    const abortController = new AbortController();

    const loadLessons = async () => {
      setIsLoadingLessons(true);
      setLoadError(null);
      try {
        // Load lessons for all modules
        const lessonPromises = modules.map(async (module) => {
          const response = await fetch(
            `/api/courses/${courseId}/modules/${module.id}/lessons`,
            { signal: abortController.signal }
          );
          if (!response.ok) return [];
          const data = await response.json();
          return data || [];
        });

        const lessonArrays = await Promise.all(lessonPromises);
        const allLessons = lessonArrays.flat();

        // Filter out the current lesson if editing
        const filteredLessons = lessonId
          ? allLessons.filter((lesson: Lesson) => lesson.id !== lessonId)
          : allLessons;

        if (isMounted) {
          setLessons(filteredLessons);
        }
      } catch (error) {
        // Ignore abort errors (component unmounted)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Error loading lessons:', error);

        if (isMounted) {
          setLoadError('Failed to load lessons');
          setLessons([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingLessons(false);
        }
      }
    };

    loadLessons();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [courseId, modules, lessonId]);

  // Update parent when any field changes
  useEffect(() => {
    if (!isActive) {
      onChange(null);
      return;
    }

    const scheduleValue: DripScheduleValue = {
      releaseType,
      isActive,
      releaseDate: releaseDate ? releaseDate.toISOString() : undefined,
      relativeDays: releaseType === 'relative_days' ? relativeDays : undefined,
      relativeHours: releaseType === 'relative_hours' ? relativeHours : undefined,
      afterLessonId: releaseType === 'after_lesson' ? afterLessonId : undefined,
      afterModuleId: releaseType === 'after_module' ? afterModuleId : undefined,
      releaseTime: releaseType === 'relative_days' || releaseType === 'relative_hours' ? releaseTime : undefined,
    };

    onChange(scheduleValue);
  }, [isActive, releaseType, releaseDate, relativeDays, relativeHours, afterLessonId, afterModuleId, releaseTime, onChange]);

  // Handle toggle change
  const handleToggle = (checked: boolean | 'indeterminate') => {
    setIsActive(checked === true);
  };

  // Handle release type change
  const handleReleaseTypeChange = (newType: string) => {
    setReleaseType(newType as DripReleaseType);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setReleaseDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <CossUICard className="border-primary/20">
      <CossUICardPanel className="space-y-6 p-6">
        {/* Header with toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CossUILabel className="text-base font-medium">
              Drip Schedule
            </CossUILabel>
            <p className="text-sm text-muted-foreground">
              Control when this content becomes available to learners
            </p>
          </div>
          <CossUISwitch
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={disabled}
          />
        </div>

        {/* Release type selector - only show if active */}
        {isActive && (
          <>
            <div className="space-y-3">
              <CossUILabel className="text-sm font-medium">
                Release Type
              </CossUILabel>
              <CossUISelect
                value={releaseType}
                onValueChange={handleReleaseTypeChange}
                disabled={disabled}
              >
                <CossUISelectTrigger className="w-full">
                  <CossUISelectValue placeholder="Select release type" />
                </CossUISelectTrigger>
                <CossUISelectPopup>
                  {releaseTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <CossUISelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </div>
                      </CossUISelectItem>
                    );
                  })}
                </CossUISelectPopup>
              </CossUISelect>
            </div>

            {/* Conditional fields based on release type */}
            {releaseType === 'fixed_date' && (
              <div className="space-y-3">
                <CossUILabel className="text-sm font-medium">
                  Release Date
                </CossUILabel>
                <CossUIPopover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <CossUIPopoverTrigger asChild>
                    <CossUIButton
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={disabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {releaseDate ? format(releaseDate, 'PPP') : 'Select date'}
                    </CossUIButton>
                  </CossUIPopoverTrigger>
                  <CossUIPopoverPortal>
                    <CossUIPopoverPositioner>
                      <CossUIPopoverPopup className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={releaseDate}
                          onSelect={handleDateSelect}
                          disabled={disabled ? () => true : { before: new Date() }}
                          initialFocus
                        />
                      </CossUIPopoverPopup>
                    </CossUIPopoverPositioner>
                  </CossUIPopoverPortal>
                </CossUIPopover>
                <p className="text-xs text-muted-foreground">
                  Content will be available starting at midnight on this date
                </p>
              </div>
            )}

            {releaseType === 'relative_days' && (
              <>
                <div className="space-y-3">
                  <CossUILabel className="text-sm font-medium">
                    Number of Days After Enrollment
                  </CossUILabel>
                  <CossUIInput
                    type="number"
                    min={1}
                    max={365}
                    value={relativeDays}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRelativeDays(parseInt(e.target.value, 10) || 1)
                    }
                    disabled={disabled}
                    placeholder="e.g., 7"
                  />
                  <p className="text-xs text-muted-foreground">
                    Content will be available {relativeDays} {relativeDays === 1 ? 'day' : 'days'} after enrollment
                  </p>
                </div>
                <div className="space-y-3">
                  <CossUILabel className="text-sm font-medium">
                    Release Time (Optional)
                  </CossUILabel>
                  <CossUIInput
                    type="time"
                    value={releaseTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setReleaseTime(e.target.value)
                    }
                    disabled={disabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    If not set, content will be available at midnight
                  </p>
                </div>
              </>
            )}

            {releaseType === 'relative_hours' && (
              <>
                <div className="space-y-3">
                  <CossUILabel className="text-sm font-medium">
                    Number of Hours After Enrollment
                  </CossUILabel>
                  <CossUIInput
                    type="number"
                    min={1}
                    max={8760}
                    value={relativeHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRelativeHours(parseInt(e.target.value, 10) || 1)
                    }
                    disabled={disabled}
                    placeholder="e.g., 24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Content will be available {relativeHours} {relativeHours === 1 ? 'hour' : 'hours'} after enrollment
                  </p>
                </div>
              </>
            )}

            {releaseType === 'after_lesson' && (
              <div className="space-y-3">
                <CossUILabel className="text-sm font-medium">
                  After Completing Lesson
                </CossUILabel>
                {isLoadingLessons ? (
                  <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                    <CossUISpinner className="h-4 w-4" />
                    Loading lessons...
                  </div>
                ) : loadError ? (
                  <p className="text-sm text-destructive">{loadError}</p>
                ) : lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No other lessons available</p>
                ) : (
                  <>
                    <CossUISelect
                      value={afterLessonId}
                      onValueChange={setAfterLessonId}
                      disabled={disabled}
                    >
                      <CossUISelectTrigger className="w-full">
                        <CossUISelectValue placeholder="Select a lesson" />
                      </CossUISelectTrigger>
                      <CossUISelectPopup>
                        {lessons.map((lesson) => (
                          <CossUISelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </CossUISelectItem>
                        ))}
                      </CossUISelectPopup>
                    </CossUISelect>
                    <p className="text-xs text-muted-foreground">
                      Content will be available after the selected lesson is completed
                    </p>
                  </>
                )}
              </div>
            )}

            {releaseType === 'after_module' && (
              <div className="space-y-3">
                <CossUILabel className="text-sm font-medium">
                  After Completing Module
                </CossUILabel>
                {isLoadingModules ? (
                  <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                    <CossUISpinner className="h-4 w-4" />
                    Loading modules...
                  </div>
                ) : loadError ? (
                  <p className="text-sm text-destructive">{loadError}</p>
                ) : modules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No modules available</p>
                ) : (
                  <>
                    <CossUISelect
                      value={afterModuleId}
                      onValueChange={setAfterModuleId}
                      disabled={disabled}
                    >
                      <CossUISelectTrigger className="w-full">
                        <CossUISelectValue placeholder="Select a module" />
                      </CossUISelectTrigger>
                      <CossUISelectPopup>
                        {modules
                          .filter((module) => module.id !== moduleId) // Filter out current module if editing
                          .map((module) => (
                            <CossUISelectItem key={module.id} value={module.id}>
                              {module.title}
                            </CossUISelectItem>
                          ))}
                      </CossUISelectPopup>
                    </CossUISelect>
                    <p className="text-xs text-muted-foreground">
                      Content will be available after all lessons in the selected module are completed
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CossUICardPanel>
    </CossUICard>
  );
}
