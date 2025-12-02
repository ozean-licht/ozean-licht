'use client';

/**
 * SubtaskList Component - Phase 8
 *
 * Displays subtasks of a parent task with:
 * - Checkbox list of subtasks
 * - Progress bar (X of Y complete)
 * - Inline "Add subtask" input
 * - Click to expand/view subtask
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DBTask } from '@/lib/db/tasks';

interface SubtaskListProps {
  parentTaskId: string;
  parentProjectId?: string | null;
  subtasks: DBTask[];
  onToggleComplete: (taskId: string, isDone: boolean) => Promise<void>;
  onAddSubtask: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SubtaskList({
  parentTaskId: _parentTaskId, // Reserved for future use
  parentProjectId: _parentProjectId, // Reserved for future use
  subtasks,
  onToggleComplete,
  onAddSubtask,
  isLoading = false,
}: SubtaskListProps) {
  const router = useRouter();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const completed = subtasks.filter(t => t.is_done).length;
  const total = subtasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (taskId: string, currentDone: boolean) => {
    setTogglingId(taskId);
    try {
      await onToggleComplete(taskId, !currentDone);
    } finally {
      setTogglingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  return (
    <Card className="bg-card/70 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            Subtasks
            {total > 0 && (
              <span className="text-sm font-normal text-[#C4C8D4]">
                ({completed}/{total})
              </span>
            )}
          </CardTitle>
        </div>
        {total > 0 && (
          <div className="mt-2">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Subtask list */}
            {subtasks.length > 0 ? (
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={cn(
                      'group flex items-center gap-3 p-2 rounded-lg transition-colors',
                      'hover:bg-primary/5 cursor-pointer'
                    )}
                  >
                    <Checkbox
                      checked={subtask.is_done}
                      disabled={togglingId === subtask.id}
                      onCheckedChange={() => handleToggle(subtask.id, subtask.is_done)}
                      onClick={(e) => e.stopPropagation()}
                      className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => router.push(`/dashboard/tools/tasks/${subtask.id}`)}
                    >
                      <p className={cn(
                        'text-sm truncate',
                        subtask.is_done ? 'text-[#C4C8D4] line-through' : 'text-white'
                      )}>
                        {subtask.name}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-[#C4C8D4] opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => router.push(`/dashboard/tools/tasks/${subtask.id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#C4C8D4] text-center py-4">
                No subtasks yet
              </p>
            )}

            {/* Add subtask input */}
            <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAdding}
                className="flex-1 bg-[#00111A] border-primary/20 text-white placeholder:text-[#C4C8D4] text-sm"
              />
              <Button
                size="sm"
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim() || isAdding}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
