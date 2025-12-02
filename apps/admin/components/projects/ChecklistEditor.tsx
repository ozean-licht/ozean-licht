'use client';

/**
 * Checklist Editor Component
 *
 * Toggle checklist items, add new items, remove items.
 * Part of Project Management MVP Phase 2
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, X, CheckSquare } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  order: number;
}

interface TaskChecklist {
  id: string;
  title?: string | null;
  items: ChecklistItem[];
  progress_percent: number;
}

interface ChecklistEditorProps {
  checklists: TaskChecklist[];
  onToggleItem: (checklistId: string, itemId: string) => void;
  onAddItem: (checklistId: string, title: string) => void;
  onRemoveItem: (checklistId: string, itemId: string) => void;
  disabled?: boolean;
}

export default function ChecklistEditor({
  checklists,
  onToggleItem,
  onAddItem,
  onRemoveItem,
  disabled = false,
}: ChecklistEditorProps) {
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});

  const handleAddItem = (checklistId: string) => {
    const text = newItemText[checklistId]?.trim();
    if (text) {
      onAddItem(checklistId, text);
      setNewItemText((prev) => ({ ...prev, [checklistId]: '' }));
    }
  };

  if (checklists.length === 0) {
    return (
      <div className="text-sm text-[#C4C8D4] flex items-center gap-2">
        <CheckSquare className="w-4 h-4" />
        No checklists
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => {
        const checkedCount = checklist.items.filter((i) => i.checked).length;
        const totalCount = checklist.items.length;
        const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

        return (
          <div
            key={checklist.id}
            className="p-3 rounded-lg bg-card/30 border border-primary/10"
          >
            {/* Header with title and progress */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">
                {checklist.title || 'Checklist'}
              </h4>
              <span className="text-xs text-[#C4C8D4]">
                {checkedCount}/{totalCount}
              </span>
            </div>

            {/* Progress bar */}
            <Progress value={progress} className="h-1.5 mb-3" />

            {/* Items */}
            <div className="space-y-2">
              {checklist.items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 group"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => onToggleItem(checklist.id, item.id)}
                      disabled={disabled}
                      className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.checked
                          ? 'text-[#C4C8D4] line-through'
                          : 'text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(checklist.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity"
                        aria-label="Remove item"
                      >
                        <X className="w-3 h-3 text-[#C4C8D4] hover:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
            </div>

            {/* Add new item */}
            {!disabled && (
              <div className="flex items-center gap-2 mt-3">
                <Input
                  placeholder="Add item..."
                  value={newItemText[checklist.id] || ''}
                  onChange={(e) =>
                    setNewItemText((prev) => ({
                      ...prev,
                      [checklist.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem(checklist.id);
                    }
                  }}
                  className="flex-1 h-8 text-sm bg-card/50 border-primary/20"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddItem(checklist.id)}
                  disabled={!newItemText[checklist.id]?.trim()}
                  className="h-8 px-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
