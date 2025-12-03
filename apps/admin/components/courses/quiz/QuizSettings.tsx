'use client';

import { useCallback } from 'react';
import {
  CossUICard,
  CossUIInput,
  CossUILabel,
  CossUISwitch,
  CossUISlider,
} from '@shared/ui';
import {
  Target,
  RotateCcw,
  Clock,
  Shuffle,
  Eye,
  MessageSquare,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { QuizSettings as QuizSettingsType, defaultQuizSettings } from '@/types/quiz';

interface QuizSettingsProps {
  value: QuizSettingsType;
  onChange: (value: QuizSettingsType) => void;
  disabled?: boolean;
}

interface SettingRowProps {
  icon: typeof Target;
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon: Icon, label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <CossUILabel className="text-sm font-medium">{label}</CossUILabel>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/**
 * Quiz settings editor
 *
 * Settings:
 * - Passing score (slider)
 * - Max attempts (-1 = unlimited)
 * - Time limit (optional)
 * - Shuffle questions/answers
 * - Show correct answers
 * - Show feedback
 * - Show results immediately
 * - Allow review
 */
export default function QuizSettings({
  value = defaultQuizSettings,
  onChange,
  disabled = false,
}: QuizSettingsProps) {
  const handleChange = useCallback(<K extends keyof QuizSettingsType>(
    field: K,
    fieldValue: QuizSettingsType[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }, [value, onChange]);

  return (
    <CossUICard className="p-4">
      <h3 className="text-lg font-medium mb-4">Quiz Settings</h3>

      {/* Passing Score */}
      <SettingRow
        icon={Target}
        label="Passing Score"
        description="Minimum score percentage required to pass"
      >
        <div className="flex items-center gap-3 w-48">
          <CossUISlider
            value={[value.passingScore]}
            onValueChange={(val) => {
              const values = val as number[];
              if (values.length > 0) {
                handleChange('passingScore', values[0]);
              }
            }}
            min={0}
            max={100}
            step={5}
            disabled={disabled}
            className="flex-1"
          />
          <span className="text-sm font-medium w-12 text-right">
            {value.passingScore}%
          </span>
        </div>
      </SettingRow>

      {/* Max Attempts */}
      <SettingRow
        icon={RotateCcw}
        label="Maximum Attempts"
        description="How many times learners can retake (-1 = unlimited)"
      >
        <CossUIInput
          type="number"
          value={value.maxAttempts}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('maxAttempts', parseInt(e.target.value) || -1)
          }
          min={-1}
          className="w-20"
          disabled={disabled}
        />
      </SettingRow>

      {/* Time Limit */}
      <SettingRow
        icon={Clock}
        label="Time Limit"
        description="Maximum time in minutes (leave empty for no limit)"
      >
        <CossUIInput
          type="number"
          value={value.timeLimitMinutes ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('timeLimitMinutes', e.target.value ? parseInt(e.target.value) : null)
          }
          min={1}
          max={480}
          placeholder="None"
          className="w-20"
          disabled={disabled}
        />
      </SettingRow>

      {/* Shuffle Questions */}
      <SettingRow
        icon={Shuffle}
        label="Shuffle Questions"
        description="Randomize question order for each attempt"
      >
        <CossUISwitch
          checked={value.shuffleQuestions}
          onCheckedChange={(checked: boolean) => handleChange('shuffleQuestions', checked)}
          disabled={disabled}
        />
      </SettingRow>

      {/* Shuffle Answers */}
      <SettingRow
        icon={Shuffle}
        label="Shuffle Answers"
        description="Randomize answer options for multiple choice"
      >
        <CossUISwitch
          checked={value.shuffleAnswers}
          onCheckedChange={(checked: boolean) => handleChange('shuffleAnswers', checked)}
          disabled={disabled}
        />
      </SettingRow>

      {/* Show Correct Answers */}
      <SettingRow
        icon={Eye}
        label="Show Correct Answers"
        description="Reveal correct answers after submission"
      >
        <CossUISwitch
          checked={value.showCorrectAnswers}
          onCheckedChange={(checked: boolean) => handleChange('showCorrectAnswers', checked)}
          disabled={disabled}
        />
      </SettingRow>

      {/* Show Feedback */}
      <SettingRow
        icon={MessageSquare}
        label="Show Feedback"
        description="Display feedback for each question"
      >
        <CossUISwitch
          checked={value.showFeedback}
          onCheckedChange={(checked: boolean) => handleChange('showFeedback', checked)}
          disabled={disabled}
        />
      </SettingRow>

      {/* Show Results Immediately */}
      <SettingRow
        icon={BarChart3}
        label="Show Results Immediately"
        description="Display score immediately after submission"
      >
        <CossUISwitch
          checked={value.showResultsImmediately}
          onCheckedChange={(checked: boolean) => handleChange('showResultsImmediately', checked)}
          disabled={disabled}
        />
      </SettingRow>

      {/* Allow Review */}
      <SettingRow
        icon={BookOpen}
        label="Allow Review"
        description="Let learners review their submitted answers"
      >
        <CossUISwitch
          checked={value.allowReview}
          onCheckedChange={(checked: boolean) => handleChange('allowReview', checked)}
          disabled={disabled}
        />
      </SettingRow>
    </CossUICard>
  );
}
