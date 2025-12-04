/**
 * PipelineStageSelect Component
 *
 * Dropdown selector for video pipeline stages with color indicators.
 */

'use client';

import { VideoPipelineStage, PIPELINE_STAGES } from '@/types/video';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PipelineStageSelectProps {
  value: VideoPipelineStage;
  onChange: (value: VideoPipelineStage) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Map color names to Tailwind background classes
 */
const COLOR_MAP: Record<string, string> = {
  gray: 'bg-gray-400',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  cyan: 'bg-cyan-400',
  green: 'bg-green-400',
  slate: 'bg-slate-400',
};

/**
 * Get the background class for a given color
 */
function getColorClass(color: string): string {
  return COLOR_MAP[color] || 'bg-gray-400';
}

export function PipelineStageSelect({ value, onChange, disabled, className }: PipelineStageSelectProps) {
  // Find the current stage config for display
  const currentStage = PIPELINE_STAGES.find(stage => stage.value === value);

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as VideoPipelineStage)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue>
          {currentStage && (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getColorClass(currentStage.color)}`} />
              <span>{currentStage.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PIPELINE_STAGES.map((stage) => (
          <SelectItem key={stage.value} value={stage.value}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getColorClass(stage.color)}`} />
              <div>
                <div className="font-medium">{stage.label}</div>
                <div className="text-xs text-muted-foreground">
                  {stage.description}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
