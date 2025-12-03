'use client';

import { useState, useCallback } from 'react';
import {
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUIInput,
  CossUITextarea,
  CossUILabel,
  CossUISlider,
  CossUISwitch,
  CossUICard,
} from '@shared/ui';
import { CheckCircle, Award, Percent, GraduationCap, AlertCircle } from 'lucide-react';

type CourseCompletionRuleType =
  | 'all_lessons'
  | 'required_lessons'
  | 'percentage'
  | 'quiz_average';

interface CompletionRule {
  ruleType: CourseCompletionRuleType;
  requiredPercentage?: number;
  minQuizScore?: number;
  issueCertificate: boolean;
  completionMessage?: string;
}

interface CompletionRulesEditorProps {
  courseId: string;
  value: CompletionRule | null;
  onChange: (rules: CompletionRule | null) => void;
  disabled?: boolean;
}

interface RuleOption {
  value: CourseCompletionRuleType;
  label: string;
  description: string;
  icon: typeof CheckCircle;
}

const RULE_OPTIONS: RuleOption[] = [
  {
    value: 'all_lessons',
    label: 'All Lessons',
    description: 'Complete all lessons in the course',
    icon: CheckCircle,
  },
  {
    value: 'required_lessons',
    label: 'Required Lessons Only',
    description: 'Complete only lessons marked as required',
    icon: CheckCircle,
  },
  {
    value: 'percentage',
    label: 'Percentage Based',
    description: 'Complete a specific percentage of lessons',
    icon: Percent,
  },
  {
    value: 'quiz_average',
    label: 'Quiz Average',
    description: 'Achieve minimum average quiz score',
    icon: GraduationCap,
  },
];

interface SettingRowProps {
  icon: typeof CheckCircle;
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
 * Completion Rules Editor Component
 *
 * Allows course creators to define what constitutes course completion.
 *
 * Features:
 * - Select completion rule type
 * - Configure rule-specific settings
 * - Toggle certificate issuance
 * - Custom completion message
 * - Preview of completion criteria
 */
export default function CompletionRulesEditor({
  value,
  onChange,
  disabled = false,
}: CompletionRulesEditorProps) {
  const [localValue, setLocalValue] = useState<CompletionRule>(
    value ?? {
      ruleType: 'all_lessons',
      issueCertificate: false,
    }
  );

  // Handle changes to the rule
  const handleChange = useCallback(
    <K extends keyof CompletionRule>(field: K, fieldValue: CompletionRule[K]) => {
      const newValue = {
        ...localValue,
        [field]: fieldValue,
      };

      // Clean up fields that don't apply to the current rule type
      if (field === 'ruleType') {
        if (fieldValue !== 'percentage') {
          delete newValue.requiredPercentage;
        }
        if (fieldValue !== 'quiz_average') {
          delete newValue.minQuizScore;
        }
      }

      setLocalValue(newValue);
      onChange(newValue);
    },
    [localValue, onChange]
  );

  // Generate preview text
  const getPreviewText = (): string => {
    switch (localValue.ruleType) {
      case 'all_lessons':
        return 'Learners must complete all lessons in the course.';
      case 'required_lessons':
        return 'Learners must complete all lessons marked as required.';
      case 'percentage':
        return `Learners must complete at least ${localValue.requiredPercentage ?? 80}% of all lessons.`;
      case 'quiz_average':
        return `Learners must achieve an average quiz score of at least ${localValue.minQuizScore ?? 70}%.`;
      default:
        return 'No completion rule defined.';
    }
  };

  return (
    <div className="space-y-4">
      <CossUICard className="p-4">
        <h3 className="text-lg font-medium mb-4">Completion Rules</h3>

        {/* Rule Type Selection */}
        <div className="space-y-2 mb-6">
          <CossUILabel htmlFor="rule-type">Completion Rule Type</CossUILabel>
          <CossUISelect
            value={localValue.ruleType}
            onValueChange={(val) => handleChange('ruleType', val as CourseCompletionRuleType)}
            disabled={disabled}
          >
            <CossUISelectTrigger id="rule-type" className="w-full">
              <CossUISelectValue placeholder="Select completion rule" />
            </CossUISelectTrigger>
            <CossUISelectPopup>
              {RULE_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <CossUISelectItem key={option.value} value={option.value}>
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </CossUISelectItem>
                );
              })}
            </CossUISelectPopup>
          </CossUISelect>
        </div>

        {/* Rule-Specific Configuration */}
        {localValue.ruleType === 'percentage' && (
          <SettingRow
            icon={Percent}
            label="Required Percentage"
            description="Minimum percentage of lessons to complete"
          >
            <div className="flex items-center gap-3 w-48">
              <CossUISlider
                value={[localValue.requiredPercentage ?? 80]}
                onValueChange={(val: number | readonly number[]) => {
                  const values = Array.isArray(val) ? val : [val];
                  if (values.length > 0) {
                    handleChange('requiredPercentage', values[0]);
                  }
                }}
                min={1}
                max={100}
                step={5}
                disabled={disabled}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {localValue.requiredPercentage ?? 80}%
              </span>
            </div>
          </SettingRow>
        )}

        {localValue.ruleType === 'quiz_average' && (
          <SettingRow
            icon={GraduationCap}
            label="Minimum Quiz Score"
            description="Minimum average quiz score percentage"
          >
            <div className="flex items-center gap-2">
              <CossUIInput
                type="number"
                value={localValue.minQuizScore ?? 70}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 0 && val <= 100) {
                    handleChange('minQuizScore', val);
                  }
                }}
                min={0}
                max={100}
                className="w-20"
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </SettingRow>
        )}

        {/* Certificate Issuance */}
        <SettingRow
          icon={Award}
          label="Issue Certificate"
          description="Automatically issue a certificate upon completion"
        >
          <CossUISwitch
            checked={localValue.issueCertificate}
            onCheckedChange={(checked: boolean) => handleChange('issueCertificate', checked)}
            disabled={disabled}
          />
        </SettingRow>

        {/* Custom Completion Message */}
        <div className="space-y-2 pt-4">
          <CossUILabel htmlFor="completion-message">
            Completion Message (Optional)
          </CossUILabel>
          <CossUITextarea
            id="completion-message"
            value={localValue.completionMessage ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange('completionMessage', e.target.value || undefined)
            }
            placeholder="Enter a custom message to display when the course is completed..."
            rows={3}
            disabled={disabled}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This message will be shown to learners when they complete the course.
          </p>
        </div>
      </CossUICard>

      {/* Preview */}
      <CossUICard className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-medium mb-1">Completion Criteria</h4>
            <p className="text-sm text-muted-foreground">{getPreviewText()}</p>
            {localValue.issueCertificate && (
              <p className="text-sm text-primary mt-2 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Certificate will be issued upon completion
              </p>
            )}
            {localValue.completionMessage && (
              <div className="mt-3 p-3 bg-card/50 rounded-md border border-primary/20">
                <p className="text-xs font-medium text-primary/70 mb-1">
                  Completion Message:
                </p>
                <p className="text-sm">{localValue.completionMessage}</p>
              </div>
            )}
          </div>
        </div>
      </CossUICard>
    </div>
  );
}
