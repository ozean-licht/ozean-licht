/**
 * File Context Menu Component
 * Right-click context menu for file operations
 */

import * as React from 'react'
import {
  Download,
  Trash2,
  Edit,
  Share2,
  Info,
  Copy,
  Eye,
  FolderOpen,
} from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu'
import type { StorageFile, FileAction } from './types'

export interface FileContextMenuProps {
  file: StorageFile
  children: React.ReactNode
  onDownload?: (file: StorageFile) => void
  onDelete?: (file: StorageFile) => void
  onRename?: (file: StorageFile) => void
  onShare?: (file: StorageFile) => void
  onViewDetails?: (file: StorageFile) => void
  onCopyUrl?: (file: StorageFile) => void
  onPreview?: (file: StorageFile) => void
  onOpenInBucket?: (file: StorageFile) => void
  customActions?: FileAction[]
  disabledActions?: string[]
}

export function FileContextMenu({
  file,
  children,
  onDownload,
  onDelete,
  onRename,
  onShare,
  onViewDetails,
  onCopyUrl,
  onPreview,
  onOpenInBucket,
  customActions = [],
  disabledActions = [],
}: FileContextMenuProps) {
  const isDisabled = (actionId: string) => disabledActions.includes(actionId)

  const defaultActions = [
    {
      id: 'preview',
      label: 'Preview',
      icon: Eye,
      onClick: onPreview,
      show: !!onPreview && !file.isFolder,
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: onDownload,
      show: !!onDownload,
    },
    {
      id: 'copyUrl',
      label: 'Copy URL',
      icon: Copy,
      onClick: onCopyUrl,
      show: !!onCopyUrl,
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: onShare,
      show: !!onShare,
    },
  ]

  const managementActions = [
    {
      id: 'rename',
      label: 'Rename',
      icon: Edit,
      onClick: onRename,
      show: !!onRename,
    },
    {
      id: 'openInBucket',
      label: 'Open in Bucket',
      icon: FolderOpen,
      onClick: onOpenInBucket,
      show: !!onOpenInBucket && file.isFolder,
    },
    {
      id: 'viewDetails',
      label: 'View Details',
      icon: Info,
      onClick: onViewDetails,
      show: !!onViewDetails,
    },
  ]

  const destructiveActions = [
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      show: !!onDelete,
      variant: 'destructive' as const,
    },
  ]

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 glass-card-strong border-primary/30">
        {/* Default Actions */}
        {defaultActions
          .filter((action) => action.show)
          .map((action) => (
            <ContextMenuItem
              key={action.id}
              disabled={isDisabled(action.id)}
              onClick={() => action.onClick?.(file)}
              className="cursor-pointer focus:bg-primary/10 focus:text-primary"
            >
              <action.icon className="mr-2 h-4 w-4 text-primary" />
              <span>{action.label}</span>
            </ContextMenuItem>
          ))}

        {/* Custom Actions */}
        {customActions.length > 0 &&
          defaultActions.some((a) => a.show) && (
            <ContextMenuSeparator className="bg-[#0E282E]" />
          )}
        {customActions.map((action) => (
          <ContextMenuItem
            key={action.id}
            disabled={action.disabled || isDisabled(action.id)}
            onClick={() => action.onClick(file)}
            className={action.variant === 'destructive'
              ? 'cursor-pointer focus:bg-destructive/10 focus:text-destructive'
              : 'cursor-pointer focus:bg-primary/10 focus:text-primary'
            }
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            <span>{action.label}</span>
          </ContextMenuItem>
        ))}

        {/* Management Actions */}
        {managementActions.some((a) => a.show) && (
          <>
            <ContextMenuSeparator className="bg-[#0E282E]" />
            {managementActions
              .filter((action) => action.show)
              .map((action) => (
                <ContextMenuItem
                  key={action.id}
                  disabled={isDisabled(action.id)}
                  onClick={() => action.onClick?.(file)}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  <action.icon className="mr-2 h-4 w-4 text-primary" />
                  <span>{action.label}</span>
                </ContextMenuItem>
              ))}
          </>
        )}

        {/* Destructive Actions */}
        {destructiveActions.some((a) => a.show) && (
          <>
            <ContextMenuSeparator className="bg-[#0E282E]" />
            {destructiveActions
              .filter((action) => action.show)
              .map((action) => (
                <ContextMenuItem
                  key={action.id}
                  disabled={isDisabled(action.id)}
                  onClick={() => action.onClick?.(file)}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  <span>{action.label}</span>
                </ContextMenuItem>
              ))}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
