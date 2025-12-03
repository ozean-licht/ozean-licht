'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileText, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  CossUIButton,
  CossUITextarea,
  CossUIInput,
  CossUILabel,
  CossUICollapsibleRoot,
  CossUICollapsibleTrigger,
  CossUICollapsiblePanel,
} from '@shared/ui';
import { TranscriptSegment } from '@/types/content';

interface TranscriptEditorProps {
  /** Plain text transcript */
  transcript: string;
  /** Timestamped transcript segments */
  segments: TranscriptSegment[];
  /** Called when transcript changes */
  onTranscriptChange: (transcript: string) => void;
  /** Called when segments change */
  onSegmentsChange: (segments: TranscriptSegment[]) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Error message for transcript field */
  error?: string;
}

/**
 * Format seconds to mm:ss for display
 */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string (mm:ss or hh:mm:ss) to seconds
 */
function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    const [mins, secs] = parts;
    return (mins || 0) * 60 + (secs || 0);
  }
  if (parts.length === 3) {
    const [hrs, mins, secs] = parts;
    return (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
  }
  return 0;
}

export default function TranscriptEditor({
  transcript,
  segments,
  onTranscriptChange,
  onSegmentsChange,
  disabled = false,
  error,
}: TranscriptEditorProps) {
  const [isSegmentsOpen, setIsSegmentsOpen] = useState(false);
  const [overlappingSegments, setOverlappingSegments] = useState<number[]>([]);

  // Check for segment overlaps
  const checkSegmentOverlaps = useCallback((segmentsToCheck: TranscriptSegment[]): number[] => {
    const overlapping: number[] = [];

    for (let i = 0; i < segmentsToCheck.length; i++) {
      const currentSegment = segmentsToCheck[i];

      // Check if segment is invalid (start >= end)
      if (currentSegment.start >= currentSegment.end) {
        overlapping.push(i);
        continue;
      }

      // Check for overlaps with other segments
      for (let j = i + 1; j < segmentsToCheck.length; j++) {
        const otherSegment = segmentsToCheck[j];

        // Check if segments overlap
        const hasOverlap =
          (currentSegment.start < otherSegment.end && currentSegment.end > otherSegment.start) ||
          (otherSegment.start < currentSegment.end && otherSegment.end > currentSegment.start);

        if (hasOverlap) {
          if (!overlapping.includes(i)) overlapping.push(i);
          if (!overlapping.includes(j)) overlapping.push(j);
        }
      }
    }

    return overlapping;
  }, []);

  // Add a new segment
  const addSegment = useCallback(() => {
    const lastEnd = segments.length > 0 ? segments[segments.length - 1].end : 0;
    const newSegment: TranscriptSegment = {
      start: lastEnd,
      end: lastEnd + 30, // Default 30 second segment
      text: '',
    };
    onSegmentsChange([...segments, newSegment]);
  }, [segments, onSegmentsChange]);

  // Update a segment
  const updateSegment = useCallback((index: number, updates: Partial<TranscriptSegment>) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], ...updates };
    onSegmentsChange(newSegments);
    // Check for overlaps after update
    const overlaps = checkSegmentOverlaps(newSegments);
    setOverlappingSegments(overlaps);
  }, [segments, onSegmentsChange, checkSegmentOverlaps]);

  // Remove a segment
  const removeSegment = useCallback((index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    onSegmentsChange(newSegments);
    // Check for overlaps after removal
    const overlaps = checkSegmentOverlaps(newSegments);
    setOverlappingSegments(overlaps);
  }, [segments, onSegmentsChange, checkSegmentOverlaps]);

  // Generate plain transcript from segments
  const generateFromSegments = useCallback(() => {
    const text = segments
      .map((seg) => seg.text)
      .filter(Boolean)
      .join('\n\n');
    onTranscriptChange(text);
  }, [segments, onTranscriptChange]);

  // Check for overlaps when segments change
  useEffect(() => {
    const overlaps = checkSegmentOverlaps(segments);
    setOverlappingSegments(overlaps);
  }, [segments, checkSegmentOverlaps]);

  return (
    <div className="space-y-4">
      {/* Plain text transcript */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <CossUILabel className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Transcript (Plain Text)
          </CossUILabel>
          <span className="text-xs text-[#C4C8D4]/70">
            For accessibility and search
          </span>
        </div>
        <CossUITextarea
          value={transcript}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onTranscriptChange(e.target.value)}
          placeholder="Enter the full transcript text here...

This text will be searchable and helps with accessibility.
You can also add timestamped segments below for synced highlighting."
          rows={6}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-[#C4C8D4]/70">
          {transcript.length} characters
        </p>
      </div>

      {/* Timestamped segments (collapsible) */}
      <CossUICollapsibleRoot open={isSegmentsOpen} onOpenChange={setIsSegmentsOpen}>
        <CossUICollapsibleTrigger
          className="w-full flex items-center justify-between p-3 bg-[#00070F] rounded-lg
            hover:bg-[#00070F]/80 transition-colors text-left"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {isSegmentsOpen ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm font-medium text-white">
              Timestamped Segments
            </span>
            <span className="text-xs text-[#C4C8D4]/70">
              ({segments.length} segments)
            </span>
          </div>
          <span className="text-xs text-primary">
            {isSegmentsOpen ? 'Hide' : 'Show'}
          </span>
        </CossUICollapsibleTrigger>

        <CossUICollapsiblePanel>
          <div className="mt-3 space-y-3">
            <p className="text-xs text-[#C4C8D4]/70">
              Add timestamped segments to sync transcript with audio playback.
              Segments will highlight as the audio plays.
            </p>

            {/* Overlap warning */}
            {overlappingSegments.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠ Warning: {overlappingSegments.length} segment{overlappingSegments.length > 1 ? 's have' : ' has'} timing issues
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  Segments must have valid time ranges (start &lt; end) and should not overlap with each other.
                </p>
              </div>
            )}

            {/* Segment list */}
            {segments.length > 0 && (
              <div className="space-y-2">
                {segments.map((segment, index) => {
                  const hasOverlap = overlappingSegments.includes(index);
                  const hasInvalidTime = segment.start >= segment.end;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border space-y-2 ${
                        hasOverlap
                          ? 'bg-destructive/5 border-destructive/50'
                          : 'bg-[#00070F] border-[#0E282E]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#C4C8D4] font-medium">
                            Segment {index + 1}
                          </span>
                          {hasOverlap && (
                            <span className="text-xs text-destructive font-medium">
                              {hasInvalidTime ? '⚠ Invalid time range' : '⚠ Overlaps with another segment'}
                            </span>
                          )}
                        </div>
                        <CossUIButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSegment(index)}
                          disabled={disabled}
                          className="text-[#C4C8D4] hover:text-destructive h-6 w-6 p-0"
                          aria-label={`Remove segment ${index + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </CossUIButton>
                      </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <CossUILabel className="text-xs">Start Time</CossUILabel>
                        <CossUIInput
                          value={formatTime(segment.start)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateSegment(index, { start: parseTime(e.target.value) })
                          }
                          placeholder="0:00"
                          disabled={disabled}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <CossUILabel className="text-xs">End Time</CossUILabel>
                        <CossUIInput
                          value={formatTime(segment.end)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateSegment(index, { end: parseTime(e.target.value) })
                          }
                          placeholder="0:30"
                          disabled={disabled}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <CossUILabel className="text-xs">Text</CossUILabel>
                      <CossUITextarea
                        value={segment.text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateSegment(index, { text: e.target.value })
                        }
                        placeholder="Transcript text for this segment..."
                        rows={2}
                        disabled={disabled}
                        className="text-sm"
                      />
                    </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add segment button */}
            <div className="flex items-center gap-2">
              <CossUIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={addSegment}
                disabled={disabled}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Segment
              </CossUIButton>

              {segments.length > 0 && (
                <CossUIButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateFromSegments}
                  disabled={disabled}
                  title="Generate plain transcript from segments"
                >
                  Generate Text
                </CossUIButton>
              )}
            </div>

            {/* Empty state */}
            {segments.length === 0 && (
              <div className="text-center py-4">
                <FileText className="w-8 h-8 text-[#C4C8D4]/30 mx-auto mb-2" />
                <p className="text-xs text-[#C4C8D4]/50">
                  No segments yet. Add segments to sync with audio playback.
                </p>
              </div>
            )}
          </div>
        </CossUICollapsiblePanel>
      </CossUICollapsibleRoot>
    </div>
  );
}
