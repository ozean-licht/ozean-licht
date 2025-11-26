/**
 * File Metadata Panel Component
 * Details sidebar for file information
 */

import * as React from 'react'
import { Copy, ExternalLink, Tag, Hash, Check } from 'lucide-react'
import { cn } from '../utils/cn'
import { Button } from '../cossui/button'
import { Input } from '../cossui/input'
import { Badge } from '../cossui/badge'
import type { StorageFile } from './types'

export interface FileMetadataPanelProps {
  file: StorageFile
  onCopyUrl?: (file: StorageFile) => void
  onOpenInBucket?: (file: StorageFile) => void
  onUpdateTags?: (file: StorageFile, tags: string[]) => void
  className?: string
  compact?: boolean
}

export function FileMetadataPanel({
  file,
  onCopyUrl,
  onOpenInBucket,
  onUpdateTags,
  className,
  compact = false,
}: FileMetadataPanelProps) {
  const [isEditingTags, setIsEditingTags] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')
  const [localTags, setLocalTags] = React.useState(file.tags || [])
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setLocalTags(file.tags || [])
  }, [file.tags])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const handleCopyUrl = async () => {
    if (onCopyUrl) {
      await onCopyUrl(file)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !localTags.includes(tagInput.trim())) {
      const newTags = [...localTags, tagInput.trim()]
      setLocalTags(newTags)
      setTagInput('')
      if (onUpdateTags) {
        onUpdateTags(file, newTags)
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = localTags.filter((t) => t !== tag)
    setLocalTags(newTags)
    if (onUpdateTags) {
      onUpdateTags(file, newTags)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div
      className={cn(
        'glass-card rounded-lg overflow-hidden',
        compact ? 'p-4' : 'p-6',
        className
      )}
    >
      <div className={cn('space-y-4', compact && 'space-y-3')}>
        {/* Header */}
        {!compact && (
          <div>
            <h3 className="font-sans text-base text-white">File Details</h3>
            <p className="text-xs text-[#C4C8D4] mt-1">Complete file information</p>
          </div>
        )}

        {/* File Name */}
        <div>
          <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
            File Name
          </label>
          <p className={cn('text-white mt-1 break-all', compact ? 'text-xs' : 'text-sm')}>
            {file.name}
          </p>
        </div>

        {/* File Path */}
        <div>
          <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
            File Path
          </label>
          <p
            className={cn(
              'text-white mt-1 break-all font-mono',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            {file.path}
          </p>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
              Size
            </label>
            <p className={cn('text-white mt-1', compact ? 'text-xs' : 'text-sm')}>
              {formatBytes(file.size)}
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">Type</label>
            <p
              className={cn(
                'text-white mt-1 truncate',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
            </p>
          </div>
        </div>

        {/* Upload Date */}
        <div>
          <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
            Uploaded
          </label>
          <p className={cn('text-white mt-1', compact ? 'text-xs' : 'text-sm')}>
            {formatDate(file.uploadedAt)}
          </p>
        </div>

        {/* Uploaded By */}
        {file.uploadedBy && (
          <div>
            <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
              Uploaded By
            </label>
            <p className={cn('text-white mt-1', compact ? 'text-xs' : 'text-sm')}>
              {file.uploadedBy}
            </p>
          </div>
        )}

        {/* Bucket */}
        <div>
          <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">Bucket</label>
          <p className={cn('text-white mt-1', compact ? 'text-xs' : 'text-sm')}>
            {file.bucket}
          </p>
        </div>

        {/* MD5 Checksum */}
        {file.md5Hash && (
          <div>
            <label className="flex items-center gap-2 text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
              <Hash className="h-3 w-3" />
              MD5 Checksum
            </label>
            <p className="text-xs text-white mt-1 break-all font-mono bg-card/50 p-2 rounded">
              {file.md5Hash}
            </p>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-xs text-[#C4C8D4] uppercase tracking-wide font-alt mb-2">
            <Tag className="h-3 w-3" />
            Tags
            {onUpdateTags && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTags(!isEditingTags)}
                className="h-auto p-0 ml-auto text-xs text-primary hover:text-primary/90"
              >
                {isEditingTags ? 'Done' : 'Edit'}
              </Button>
            )}
          </label>

          {isEditingTags && onUpdateTags ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tag..."
                  className="h-8 text-sm glass-card border-primary/30"
                />
                <Button
                  size="sm"
                  onClick={handleAddTag}
                  className="h-8 bg-primary hover:bg-primary/90 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/30"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {localTags.length > 0 ? (
                localTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/30"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-[#C4C8D4]">No tags</p>
              )}
            </div>
          )}
        </div>

        {/* Custom Metadata */}
        {file.metadata && Object.keys(file.metadata).length > 0 && (
          <div>
            <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt mb-2 block">
              Metadata
            </label>
            <div className="space-y-1 bg-card/50 p-3 rounded">
              {Object.entries(file.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-[#C4C8D4]">{key}:</span>
                  <span className="text-white font-mono">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#0E282E] space-y-2">
          {onCopyUrl && (
            <Button
              variant="outline"
              className="w-full glass-card border-primary/30 text-primary hover:bg-primary/10"
              onClick={handleCopyUrl}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Public URL
                </>
              )}
            </Button>
          )}

          {onOpenInBucket && (
            <Button
              variant="outline"
              className="w-full glass-card border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => onOpenInBucket(file)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Bucket
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
