'use client';

/**
 * Bulk Actions Toolbar Component
 * Multi-select operations toolbar with action buttons
 */

import * as React from 'react'
import { Download, Trash2, X, CheckSquare, FolderInput } from 'lucide-react'
import { cn } from '../utils/cn'
import { Button } from '../cossui/button'
import { Separator } from '../cossui/separator'
import type { StorageFile, BulkActionItem } from './types'

export interface BulkActionsToolbarProps {
  selectedFiles: StorageFile[]
  onDownloadAll?: () => void | Promise<void>
  onDeleteSelected?: () => void | Promise<void>
  onMoveSelected?: () => void | Promise<void>
  onClearSelection: () => void
  onSelectAll?: () => void
  customActions?: BulkActionItem[]
  totalFiles?: number
  className?: string
  isLoading?: boolean
}

export function BulkActionsToolbar({
  selectedFiles,
  onDownloadAll,
  onDeleteSelected,
  onMoveSelected,
  onClearSelection,
  onSelectAll,
  customActions = [],
  totalFiles,
  className,
  isLoading = false,
}: BulkActionsToolbarProps) {
  const selectedCount = selectedFiles.length
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  if (selectedCount === 0) return null

  const handleAction = async (
    actionId: string,
    actionFn?: (files: StorageFile[]) => void | Promise<void>
  ) => {
    if (!actionFn) return
    setActionLoading(actionId)
    try {
      await actionFn(selectedFiles)
    } finally {
      setActionLoading(null)
    }
  }

  const defaultActions: BulkActionItem[] = [
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: onDownloadAll ? () => onDownloadAll() : () => {},
      disabled: !onDownloadAll || isLoading,
    },
    {
      id: 'move',
      label: 'Move',
      icon: FolderInput,
      onClick: onMoveSelected ? () => onMoveSelected() : () => {},
      disabled: !onMoveSelected || isLoading,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDeleteSelected ? () => onDeleteSelected() : () => {},
      disabled: !onDeleteSelected || isLoading,
      variant: 'destructive' as const,
    },
  ]

  const visibleActions = [...defaultActions, ...customActions].filter(
    (action) => action.onClick
  )

  return (
    <div
      className={cn(
        'sticky top-0 z-40 animate-in slide-in-from-top-5 duration-300',
        className
      )}
    >
      <div className="glass-card-strong border border-primary/30 shadow-lg shadow-primary/10 rounded-lg p-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="font-sans text-sm font-medium text-white">
                {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>

            {totalFiles && selectedCount < totalFiles && onSelectAll && (
              <>
                <Separator orientation="vertical" className="h-4 bg-[#0E282E]" />
                <button
                  onClick={onSelectAll}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  Select all {totalFiles}
                </button>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {visibleActions.map((action) => {
              const Icon = action.icon
              const isActionLoading = actionLoading === action.id

              return (
                <Button
                  key={action.id}
                  variant={action.variant === 'destructive' ? 'destructive' : 'secondary'}
                  size="icon-sm"
                  onClick={() => handleAction(action.id, action.onClick)}
                  disabled={action.disabled || isActionLoading || !!actionLoading}
                  className={cn(
                    action.variant !== 'destructive' && 'glass-card hover:bg-primary/10'
                  )}
                  aria-label={action.label}
                  title={action.label}
                >
                  {isActionLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    Icon && <Icon className="h-4 w-4" />
                  )}
                </Button>
              )
            })}

            <Separator orientation="vertical" className="h-6 bg-[#0E282E]" />

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClearSelection}
              disabled={isLoading}
              className="text-[#C4C8D4] hover:text-white"
              aria-label="Clear selection"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
