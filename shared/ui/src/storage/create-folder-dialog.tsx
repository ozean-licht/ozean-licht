'use client';

/**
 * Create Folder Dialog Component
 * Modal dialog for creating new folders
 */

import * as React from 'react'
import { FolderPlus, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../cossui/dialog'
import { Button } from '../cossui/button'
import { Input } from '../cossui/input'
import { Label } from '../cossui/label'
import { cn } from '../utils/cn'

export interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFolder: (folderName: string) => Promise<void> | void
  currentPath?: string
  existingFolders?: string[]
  maxLength?: number
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
  currentPath = '/',
  existingFolders = [],
  maxLength = 255,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setFolderName('')
      setError(null)
      setIsLoading(false)
    }
  }, [open])

  const validateFolderName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Folder name is required'
    }

    if (name.length > maxLength) {
      return `Folder name must be less than ${maxLength} characters`
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/g
    if (invalidChars.test(name)) {
      return 'Folder name contains invalid characters'
    }

    // Check for reserved names
    const reservedNames = ['con', 'prn', 'aux', 'nul', 'com1', 'lpt1', '.', '..']
    if (reservedNames.includes(name.toLowerCase())) {
      return 'This folder name is reserved'
    }

    // Check for duplicate folders
    if (existingFolders.some((folder) => folder.toLowerCase() === name.toLowerCase())) {
      return 'A folder with this name already exists'
    }

    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFolderName(value)

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateFolderName(folderName)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await onCreateFolder(folderName.trim())
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="glass-card-strong border-primary/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-xl text-white">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-[#C4C8D4]">
            Create a new folder in{' '}
            <span className="font-medium text-primary">{currentPath}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name" className="text-white">
                Folder Name
              </Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name"
                value={folderName}
                onChange={handleInputChange}
                disabled={isLoading}
                autoFocus
                className={cn(
                  'glass-card border-[#0E282E] bg-card/50',
                  'focus:border-primary focus:ring-primary',
                  error && 'border-destructive focus:border-destructive focus:ring-destructive'
                )}
                maxLength={maxLength}
              />
              <p className="text-xs text-[#C4C8D4]">
                {folderName.length}/{maxLength} characters
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="rounded-lg bg-card/30 p-3 text-xs text-[#C4C8D4]">
              <p className="font-medium text-white mb-1">Naming rules:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Cannot contain: {'< > : " / \\ | ? *'}</li>
                <li>Cannot be a reserved name (con, prn, aux, etc.)</li>
                <li>Must be unique in this location</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-[#C4C8D4] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !folderName.trim()}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
}
