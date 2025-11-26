/**
 * Bucket Selector Component
 * Bucket/folder picker for storage navigation
 */

import * as React from 'react'
import { Folder, ChevronDown, Check } from 'lucide-react'
import { cn } from '../utils/cn'
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../cossui/select'

export interface Bucket {
  id: string
  name: string
  displayName: string
  fileCount?: number
  usedBytes?: number
  entityScope?: string
}

export interface BucketSelectorProps {
  buckets: Bucket[]
  selectedBucket: string
  onSelectBucket: (bucketId: string) => void
  className?: string
  showFileCount?: boolean
  showUsage?: boolean
}

export function BucketSelector({
  buckets,
  selectedBucket,
  onSelectBucket,
  className,
  showFileCount = true,
  showUsage = false,
}: BucketSelectorProps) {
  const selectedBucketData = buckets.find((b) => b.id === selectedBucket)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Select value={selectedBucket} onValueChange={onSelectBucket}>
      <SelectTrigger className={cn('glass-card border-primary/30 w-full', className)}>
        <div className="flex items-center gap-3 flex-1">
          <Folder className="h-4 w-4 text-primary shrink-0" />
          <SelectValue>
            <span className="text-white">{selectedBucketData?.displayName || 'Select bucket'}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectPopup className="glass-card-strong border-primary/30">
        {buckets.map((bucket) => (
          <SelectItem
            key={bucket.id}
            value={bucket.id}
            className="cursor-pointer focus:bg-primary/10 focus:text-primary"
          >
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Folder className="h-4 w-4 text-primary" />
                <span>{bucket.displayName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
                {showFileCount && bucket.fileCount !== undefined && (
                  <span>{bucket.fileCount} files</span>
                )}
                {showUsage && bucket.usedBytes !== undefined && (
                  <span>• {formatBytes(bucket.usedBytes)}</span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}
