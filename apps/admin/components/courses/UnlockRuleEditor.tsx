'use client';

import { useState, useMemo } from 'react';
import {
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUIInput,
  CossUILabel,
  CossUISlider,
  CossUICard,
} from '@shared/ui';
import { Lock, Unlock, ArrowRight, Hash, Percent } from 'lucide-react';

/**
 * Module Unlock Rule Types
 */
type ModuleUnlockRuleType =
  | 'always_unlocked'
  | 'sequential'
  | 'specific_module'
  | 'lesson_count'
  | 'percentage_complete';

/**
 * Unlock Rule Configuration
 */
interface UnlockRule {
  ruleType: ModuleUnlockRuleType;
  requiredModuleId?: string;
  requiredLessonCount?: number;
  requiredPercentage?: number;
}

/**
 * Available Module for Selection
 */
interface AvailableModule {
  id: string;
  title: string;
  sortOrder: number;
}

/**
 * UnlockRuleEditor Props
 */
interface UnlockRuleEditorProps {
  /** Current module ID (will be filtered from available modules) */
  moduleId: string;
  /** Course ID for context */
  courseId: string;
  /** Current unlock rule value */
  value: UnlockRule | null;
  /** Callback when rule changes */
  onChange: (rule: UnlockRule | null) => void;
  /** Available modules in the course */
  availableModules: AvailableModule[];
  /** Disable all inputs */
  disabled?: boolean;
}

/**
 * Rule Type Labels and Descriptions
 */
const RULE_TYPE_CONFIG: Record<
  ModuleUnlockRuleType,
  { label: string; description: string; icon: typeof Lock }
> = {
  always_unlocked: {
    label: 'Always Unlocked',
    description: 'Module is immediately accessible to all users',
    icon: Unlock,
  },
  sequential: {
    label: 'Sequential',
    description: 'Previous module must be completed first',
    icon: ArrowRight,
  },
  specific_module: {
    label: 'Specific Module',
    description: 'Unlock after completing a selected module',
    icon: Lock,
  },
  lesson_count: {
    label: 'Lesson Count',
    description: 'Complete a minimum number of previous lessons',
    icon: Hash,
  },
  percentage_complete: {
    label: 'Percentage Complete',
    description: 'Complete a percentage of previous content',
    icon: Percent,
  },
};

/**
 * UnlockRuleEditor Component
 *
 * Allows course creators to configure module unlock conditions.
 * Supports multiple unlock strategies with intuitive controls.
 */
export default function UnlockRuleEditor({
  moduleId,
  // courseId is available for future use (e.g., validation)
  courseId: _courseId,
  value,
  onChange,
  availableModules,
  disabled = false,
}: UnlockRuleEditorProps) {
  // Local state for rule configuration
  const [ruleType, setRuleType] = useState<ModuleUnlockRuleType>(
    value?.ruleType || 'always_unlocked'
  );
  const [requiredModuleId, setRequiredModuleId] = useState<string | undefined>(
    value?.requiredModuleId
  );
  const [requiredLessonCount, setRequiredLessonCount] = useState<number>(
    value?.requiredLessonCount || 1
  );
  const [requiredPercentage, setRequiredPercentage] = useState<number>(
    value?.requiredPercentage || 50
  );

  // Filter out current module from available modules
  const selectableModules = useMemo(() => {
    return availableModules
      .filter((m) => m.id !== moduleId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [availableModules, moduleId]);

  // Get previous module for sequential unlock
  const previousModule = useMemo(() => {
    const currentIndex = availableModules.findIndex((m) => m.id === moduleId);
    if (currentIndex <= 0) return null;
    return availableModules[currentIndex - 1];
  }, [availableModules, moduleId]);

  // Handle rule type change
  const handleRuleTypeChange = (newType: string) => {
    const type = newType as ModuleUnlockRuleType;
    setRuleType(type);

    // Build rule based on type
    let newRule: UnlockRule | null = null;

    switch (type) {
      case 'always_unlocked':
        newRule = { ruleType: type };
        break;
      case 'sequential':
        if (previousModule) {
          newRule = {
            ruleType: type,
            requiredModuleId: previousModule.id,
          };
          setRequiredModuleId(previousModule.id);
        } else {
          // No previous module, default to always unlocked
          newRule = { ruleType: 'always_unlocked' };
          setRuleType('always_unlocked');
        }
        break;
      case 'specific_module':
        if (selectableModules.length > 0) {
          const firstModule = selectableModules[0].id;
          setRequiredModuleId(firstModule);
          newRule = {
            ruleType: type,
            requiredModuleId: firstModule,
          };
        } else {
          // No modules available, default to always unlocked
          newRule = { ruleType: 'always_unlocked' };
          setRuleType('always_unlocked');
        }
        break;
      case 'lesson_count':
        newRule = {
          ruleType: type,
          requiredLessonCount,
        };
        break;
      case 'percentage_complete':
        newRule = {
          ruleType: type,
          requiredPercentage,
        };
        break;
    }

    onChange(newRule);
  };

  // Handle specific module selection
  const handleModuleSelect = (moduleId: string) => {
    setRequiredModuleId(moduleId);
    onChange({
      ruleType,
      requiredModuleId: moduleId,
    });
  };

  // Handle lesson count change
  const handleLessonCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setRequiredLessonCount(count);
      onChange({
        ruleType,
        requiredLessonCount: count,
      });
    }
  };

  // Handle percentage change (from slider)
  const handlePercentageChange = (value: number | readonly number[]) => {
    const percentage = Array.isArray(value) ? value[0] : value;
    if (percentage !== undefined) {
      setRequiredPercentage(percentage);
      onChange({
        ruleType,
        requiredPercentage: percentage,
      });
    }
  };

  // Handle percentage input change
  const handlePercentageInputChange = (value: string) => {
    const percentage = parseInt(value, 10);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      setRequiredPercentage(percentage);
      onChange({
        ruleType,
        requiredPercentage: percentage,
      });
    }
  };

  // Get icon for current rule type
  const RuleIcon = RULE_TYPE_CONFIG[ruleType].icon;

  return (
    <CossUICard className="p-4 space-y-4">
      {/* Rule Type Selection */}
      <div className="space-y-2">
        <CossUILabel className="text-sm font-medium flex items-center gap-2">
          <RuleIcon className="h-4 w-4 text-primary" />
          Unlock Condition
        </CossUILabel>
        <CossUISelect
          value={ruleType}
          onValueChange={handleRuleTypeChange}
          disabled={disabled}
        >
          <CossUISelectTrigger className="w-full">
            <CossUISelectValue placeholder="Select unlock condition" />
          </CossUISelectTrigger>
          <CossUISelectPopup>
            {Object.entries(RULE_TYPE_CONFIG).map(([type, config]) => (
              <CossUISelectItem
                key={type}
                value={type}
                disabled={
                  disabled ||
                  (type === 'sequential' && !previousModule) ||
                  (type === 'specific_module' && selectableModules.length === 0)
                }
              >
                <div className="flex items-start gap-2">
                  <config.icon className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                </div>
              </CossUISelectItem>
            ))}
          </CossUISelectPopup>
        </CossUISelect>
        <p className="text-xs text-muted-foreground">
          {RULE_TYPE_CONFIG[ruleType].description}
        </p>
      </div>

      {/* Configuration based on rule type */}
      {ruleType === 'sequential' && previousModule && (
        <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Requires completion of:</span>
            <span className="font-medium">{previousModule.title}</span>
          </div>
        </div>
      )}

      {ruleType === 'specific_module' && selectableModules.length > 0 && (
        <div className="space-y-2">
          <CossUILabel className="text-sm font-medium">
            Required Module
          </CossUILabel>
          <CossUISelect
            value={requiredModuleId || ''}
            onValueChange={(value: string) => handleModuleSelect(value)}
            disabled={disabled}
          >
            <CossUISelectTrigger className="w-full">
              <CossUISelectValue placeholder="Select a module" />
            </CossUISelectTrigger>
            <CossUISelectPopup>
              {selectableModules.map((module) => (
                <CossUISelectItem key={module.id} value={module.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Module {module.sortOrder + 1}:
                    </span>
                    <span>{module.title}</span>
                  </div>
                </CossUISelectItem>
              ))}
            </CossUISelectPopup>
          </CossUISelect>
          <p className="text-xs text-muted-foreground">
            Users must complete all lessons in the selected module
          </p>
        </div>
      )}

      {ruleType === 'lesson_count' && (
        <div className="space-y-2">
          <CossUILabel className="text-sm font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            Required Lessons
          </CossUILabel>
          <CossUIInput
            type="number"
            min={1}
            step={1}
            value={requiredLessonCount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleLessonCountChange(e.target.value)
            }
            disabled={disabled}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Number of lessons from previous modules that must be completed
          </p>
        </div>
      )}

      {ruleType === 'percentage_complete' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <CossUILabel className="text-sm font-medium flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              Completion Percentage
            </CossUILabel>
            <div className="px-2">
              <CossUISlider
                value={[requiredPercentage]}
                onValueChange={handlePercentageChange}
                min={0}
                max={100}
                step={5}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CossUIInput
              type="number"
              min={0}
              max={100}
              step={5}
              value={requiredPercentage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePercentageInputChange(e.target.value)
              }
              disabled={disabled}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">
              % of previous content
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Percentage of all previous module lessons that must be completed
          </p>
        </div>
      )}

      {/* Warning for no available modules */}
      {ruleType === 'specific_module' && selectableModules.length === 0 && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">
            No other modules available. Add more modules to use this unlock condition.
          </p>
        </div>
      )}

      {ruleType === 'sequential' && !previousModule && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">
            This is the first module. Sequential unlock cannot be used.
          </p>
        </div>
      )}
    </CossUICard>
  );
}
