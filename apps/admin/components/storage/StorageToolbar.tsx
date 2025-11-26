/**
 * Storage Toolbar Component
 *
 * Search, filters, view mode toggle, and bucket selector for the storage page.
 */

'use client';

import React from 'react';
import { Search, X, LayoutList, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BucketInfo } from '@/app/dashboard/tools/cloud/actions';

export type ViewMode = 'list' | 'grid';

export interface StorageToolbarProps {
  /** Current search query */
  searchQuery: string;
  /** Search query change handler */
  onSearchChange: (query: string) => void;
  /** Current view mode */
  viewMode: ViewMode;
  /** View mode change handler */
  onViewModeChange: (mode: ViewMode) => void;
  /** Available buckets */
  buckets: BucketInfo[];
  /** Currently selected bucket */
  currentBucket: string;
  /** Bucket change handler */
  onBucketChange: (bucket: string) => void;
  /** Whether toolbar is disabled (loading) */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StorageToolbar Component
 */
export function StorageToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  buckets,
  currentBucket,
  onBucketChange,
  disabled = false,
  className,
}: StorageToolbarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: CMD+K to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center gap-3', className)}>
      {/* Search Input */}
      <div className="relative flex-1 w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search files..."
          disabled={disabled}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            disabled={disabled}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <kbd className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Bucket Selector */}
      <Select
        value={currentBucket}
        onValueChange={onBucketChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select bucket" />
        </SelectTrigger>
        <SelectContent>
          {buckets.map((bucket) => (
            <SelectItem key={bucket.name} value={bucket.name}>
              {bucket.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange('list')}
          disabled={disabled}
          className={cn(
            'rounded-none h-9 w-9',
            viewMode === 'list'
              ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          aria-label="List view"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange('grid')}
          disabled={disabled}
          className={cn(
            'rounded-none h-9 w-9',
            viewMode === 'grid'
              ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
