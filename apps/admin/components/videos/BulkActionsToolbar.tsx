/**
 * BulkActionsToolbar Component
 *
 * Sticky toolbar for bulk operations on selected videos.
 * Appears at the bottom of the screen when videos are selected.
 *
 * Features:
 * - Archive videos (set status='archived')
 * - Change visibility (public/unlisted/private/paid)
 * - Change pipeline stage
 * - Migrate to Hetzner (batch migration)
 * - Add tags to all selected videos
 * - Clear selection
 */

'use client';

import * as React from 'react';
import { Archive, Eye, Zap, Cloud, Tags, X, Loader2 } from 'lucide-react';
import {
  VideoVisibility,
  VideoPipelineStage,
  PIPELINE_STAGES,
} from '@/types/video';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ================================================================
// Types
// ================================================================

export type BulkAction =
  | { type: 'archive' }
  | { type: 'visibility'; value: VideoVisibility }
  | { type: 'pipelineStage'; value: VideoPipelineStage }
  | { type: 'migrate' }
  | { type: 'addTags'; tags: string[] };

export interface BulkActionsToolbarProps {
  selectedIds: string[];
  onBulkAction: (action: BulkAction) => Promise<void>;
  onClearSelection: () => void;
  isLoading?: boolean;
}

// ================================================================
// Constants
// ================================================================

const VISIBILITY_OPTIONS: { value: VideoVisibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' },
  { value: 'paid', label: 'Paid' },
];

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

// ================================================================
// Component
// ================================================================

export function BulkActionsToolbar({
  selectedIds,
  onBulkAction,
  onClearSelection,
  isLoading = false,
}: BulkActionsToolbarProps) {
  const [tagInput, setTagInput] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(false);

  // Animation: Slide in when selection changes
  React.useEffect(() => {
    if (selectedIds.length > 0) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [selectedIds.length]);

  // Don't render if no selection
  if (selectedIds.length === 0) {
    return null;
  }

  // ============================================================
  // Handlers
  // ============================================================

  const handleArchive = async () => {
    try {
      await onBulkAction({ type: 'archive' });
    } catch (error) {
      console.error('Archive action failed:', error);
    }
  };

  const handleVisibilityChange = async (value: string) => {
    try {
      await onBulkAction({
        type: 'visibility',
        value: value as VideoVisibility,
      });
    } catch (error) {
      console.error('Visibility change failed:', error);
    }
  };

  const handlePipelineStageChange = async (value: string) => {
    try {
      await onBulkAction({
        type: 'pipelineStage',
        value: value as VideoPipelineStage,
      });
    } catch (error) {
      console.error('Pipeline stage change failed:', error);
    }
  };

  const handleMigrate = async () => {
    try {
      await onBulkAction({ type: 'migrate' });
    } catch (error) {
      console.error('Migration action failed:', error);
    }
  };

  const handleAddTags = async () => {
    if (!tagInput.trim()) return;

    // Parse comma-separated tags
    const tags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tags.length > 0) {
      try {
        await onBulkAction({ type: 'addTags', tags });
        setTagInput(''); // Clear input only on success
      } catch (error) {
        console.error('Add tags action failed:', error);
        // Keep tagInput intact so user can retry
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTags();
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div
          className={cn(
            'flex flex-wrap items-center gap-4 p-4 rounded-lg',
            'bg-card/90 backdrop-blur-lg',
            'border border-primary/20',
            'shadow-lg shadow-primary/10'
          )}
        >
          {/* Selection Count */}
          <div className="flex items-center gap-2 mr-auto">
            <Badge variant="primary" className="text-sm font-semibold">
              {selectedIds.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {selectedIds.length === 1 ? 'video' : 'videos'} selected
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Archive Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Archive className="w-4 h-4" />
              )}
              Archive
            </Button>

            {/* Visibility Dropdown */}
            <Select
              onValueChange={handleVisibilityChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px] h-9 gap-2" aria-label="Change video visibility">
                <Eye className="w-4 h-4 shrink-0" />
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pipeline Stage Dropdown */}
            <Select
              onValueChange={handlePipelineStageChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[160px] h-9 gap-2" aria-label="Change pipeline stage">
                <Zap className="w-4 h-4 shrink-0" />
                <SelectValue placeholder="Pipeline" />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          getColorClass(stage.color)
                        )}
                      />
                      <span>{stage.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Migrate Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleMigrate}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              Migrate to Hetzner
            </Button>

            {/* Add Tags Input */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <Tags className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Add tags (comma-separated)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="w-[220px] h-9 pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTags}
                disabled={isLoading || !tagInput.trim()}
                className="h-9"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Clear Selection Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isLoading}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
