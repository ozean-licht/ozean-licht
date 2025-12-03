'use client';

import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import {
  CossUIButton,
  CossUITooltip,
  CossUITooltipTrigger,
  CossUITooltipContent,
} from '@shared/ui';
import { cn } from '@/lib/utils';

interface OutlineItemActionsProps {
  itemType: 'module' | 'lesson';
  onAddChild?: () => void; // Only for modules (add lesson)
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void; // Optional future feature
  className?: string;
}

/**
 * OutlineItemActions Component
 *
 * Displays action buttons that appear on hover for outline items (modules and lessons).
 * Provides quick access to common actions like adding lessons, editing, and deleting.
 *
 * @param itemType - Type of item ('module' or 'lesson')
 * @param onAddChild - Callback for adding a child (lesson to module)
 * @param onEdit - Callback for editing the item
 * @param onDelete - Callback for deleting the item
 * @param onDuplicate - Optional callback for duplicating the item
 * @param className - Additional CSS classes
 */
export function OutlineItemActions({
  itemType,
  onAddChild,
  onEdit,
  onDelete,
  onDuplicate,
  className,
}: OutlineItemActionsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {/* Add Lesson button - only for modules */}
      {itemType === 'module' && onAddChild && (
        <CossUITooltip>
          <CossUITooltipTrigger asChild>
            <CossUIButton
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild();
              }}
            >
              <Plus className="h-4 w-4" />
            </CossUIButton>
          </CossUITooltipTrigger>
          <CossUITooltipContent>Add Lesson</CossUITooltipContent>
        </CossUITooltip>
      )}

      {/* Edit button */}
      <CossUITooltip>
        <CossUITooltipTrigger asChild>
          <CossUIButton
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </CossUIButton>
        </CossUITooltipTrigger>
        <CossUITooltipContent>Edit</CossUITooltipContent>
      </CossUITooltip>

      {/* Duplicate button - optional future feature */}
      {onDuplicate && (
        <CossUITooltip>
          <CossUITooltipTrigger asChild>
            <CossUIButton
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy className="h-4 w-4" />
            </CossUIButton>
          </CossUITooltipTrigger>
          <CossUITooltipContent>Duplicate</CossUITooltipContent>
        </CossUITooltip>
      )}

      {/* Delete button */}
      <CossUITooltip>
        <CossUITooltipTrigger asChild>
          <CossUIButton
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </CossUIButton>
        </CossUITooltipTrigger>
        <CossUITooltipContent>Delete</CossUITooltipContent>
      </CossUITooltip>
    </div>
  );
}
