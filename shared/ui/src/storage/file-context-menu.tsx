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
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from '../utils/cn'
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
  className?: string
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
  className,
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

  const visibleDefaultActions = defaultActions.filter((a) => a.show)
  const visibleManagementActions = managementActions.filter((a) => a.show)
  const visibleDestructiveActions = destructiveActions.filter((a) => a.show)

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger className={className} asChild={false}>
        {children}
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          className="z-50 min-w-[12rem] overflow-hidden rounded-lg border border-primary/30 bg-[#00111A]/95 backdrop-blur-xl p-1 shadow-lg shadow-primary/10 animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Default Actions */}
          {visibleDefaultActions.map((action) => (
            <ContextMenuPrimitive.Item
              key={action.id}
              disabled={isDisabled(action.id)}
              onSelect={() => action.onClick?.(file)}
              className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-[#C4C8D4] outline-none transition-colors hover:bg-primary/10 hover:text-white focus:bg-primary/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <action.icon className="mr-3 h-4 w-4 text-primary" />
              <span>{action.label}</span>
            </ContextMenuPrimitive.Item>
          ))}

          {/* Custom Actions */}
          {customActions.length > 0 && visibleDefaultActions.length > 0 && (
            <ContextMenuPrimitive.Separator className="my-1 h-px bg-[#0E282E]" />
          )}
          {customActions.map((action) => (
            <ContextMenuPrimitive.Item
              key={action.id}
              disabled={action.disabled || isDisabled(action.id)}
              onSelect={() => action.onClick(file)}
              className={cn(
                'relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                action.variant === 'destructive'
                  ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10'
                  : 'text-[#C4C8D4] hover:bg-primary/10 hover:text-white focus:bg-primary/10 focus:text-white'
              )}
            >
              {action.icon && <action.icon className="mr-3 h-4 w-4" />}
              <span>{action.label}</span>
            </ContextMenuPrimitive.Item>
          ))}

          {/* Management Actions */}
          {visibleManagementActions.length > 0 && (
            <>
              <ContextMenuPrimitive.Separator className="my-1 h-px bg-[#0E282E]" />
              {visibleManagementActions.map((action) => (
                <ContextMenuPrimitive.Item
                  key={action.id}
                  disabled={isDisabled(action.id)}
                  onSelect={() => action.onClick?.(file)}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-[#C4C8D4] outline-none transition-colors hover:bg-primary/10 hover:text-white focus:bg-primary/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <action.icon className="mr-3 h-4 w-4 text-primary" />
                  <span>{action.label}</span>
                </ContextMenuPrimitive.Item>
              ))}
            </>
          )}

          {/* Destructive Actions */}
          {visibleDestructiveActions.length > 0 && (
            <>
              <ContextMenuPrimitive.Separator className="my-1 h-px bg-[#0E282E]" />
              {visibleDestructiveActions.map((action) => (
                <ContextMenuPrimitive.Item
                  key={action.id}
                  disabled={isDisabled(action.id)}
                  onSelect={() => action.onClick?.(file)}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <action.icon className="mr-3 h-4 w-4" />
                  <span>{action.label}</span>
                </ContextMenuPrimitive.Item>
              ))}
            </>
          )}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  )
}
