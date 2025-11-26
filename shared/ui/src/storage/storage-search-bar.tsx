/**
 * Storage Search Bar Component
 * Advanced search and filtering for files
 */

import * as React from 'react'
import { Search, X, Filter, Calendar, HardDrive, FileType } from 'lucide-react'
import { cn } from '../utils/cn'
import { Input } from '../cossui/input'
import { Button } from '../cossui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '../cossui/popover'
import { Select, SelectPopup, SelectItem, SelectTrigger, SelectValue } from '../cossui/select'
import { Badge } from '../cossui/badge'
import { Calendar as CalendarComponent } from '../ui/calendar'
import type { FileFilter } from './types'

export interface StorageSearchBarProps {
  value: string
  onChange: (value: string) => void
  filters: FileFilter
  onFiltersChange: (filters: FileFilter) => void
  placeholder?: string
  className?: string
  showFilterButton?: boolean
  fileTypeOptions?: Array<{ label: string; value: string }>
}

const defaultFileTypes = [
  { label: 'All Types', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
  { label: 'Archives', value: 'archive' },
  { label: 'Audio', value: 'audio' },
  { label: 'Code', value: 'code' },
]

const sizeRanges = [
  { label: 'Any Size', value: '' },
  { label: 'Small (< 1 MB)', value: 'small', min: 0, max: 1048576 },
  { label: 'Medium (1-10 MB)', value: 'medium', min: 1048576, max: 10485760 },
  { label: 'Large (10-100 MB)', value: 'large', min: 10485760, max: 104857600 },
  { label: 'Very Large (> 100 MB)', value: 'xlarge', min: 104857600, max: Infinity },
]

export function StorageSearchBar({
  value,
  onChange,
  filters,
  onFiltersChange,
  placeholder = 'Search files...',
  className,
  showFilterButton = true,
  fileTypeOptions = defaultFileTypes,
}: StorageSearchBarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [localFilters, setLocalFilters] = React.useState(filters)
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(debouncedValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedValue, onChange])

  // CMD+K to focus
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Update local filters when prop changes
  React.useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleClearSearch = () => {
    setDebouncedValue('')
    inputRef.current?.focus()
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    const emptyFilters: FileFilter = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    setIsOpen(false)
  }

  const handleFileTypeChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      fileType: value || undefined,
    }))
  }

  const handleSizeRangeChange = (value: string) => {
    const range = sizeRanges.find((r) => r.value === value)
    if (!range || !range.value) {
      setLocalFilters((prev) => {
        const { sizeRange, ...rest } = prev
        return rest
      })
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        sizeRange: { min: range.min, max: range.max },
      }))
    }
  }

  const handleDateRangeChange = (type: 'from' | 'to', date: Date | undefined) => {
    setLocalFilters((prev) => {
      if (!date) {
        if (type === 'from' && !prev.dateRange?.to) {
          const { dateRange, ...rest } = prev
          return rest
        }
        if (type === 'to' && !prev.dateRange?.from) {
          const { dateRange, ...rest } = prev
          return rest
        }
      }

      return {
        ...prev,
        dateRange: {
          from: type === 'from' ? date : prev.dateRange?.from,
          to: type === 'to' ? date : prev.dateRange?.to,
        } as { from: Date; to: Date },
      }
    })
  }

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.fileType) count++
    if (filters.dateRange) count++
    if (filters.sizeRange) count++
    return count
  }, [filters])

  // Get current size range value
  const currentSizeRange = React.useMemo(() => {
    if (!filters.sizeRange) return ''
    const range = sizeRanges.find(
      (r) => r.min === filters.sizeRange?.min && r.max === filters.sizeRange?.max
    )
    return range?.value || ''
  }, [filters.sizeRange])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4C8D4]" />
        <Input
          ref={inputRef}
          type="text"
          value={debouncedValue}
          onChange={(e) => setDebouncedValue(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9 glass-card border-primary/30 focus:border-primary"
        />
        {debouncedValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-[#C4C8D4] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-[#0E282E] bg-card px-1.5 font-mono text-[10px] font-medium text-[#C4C8D4] opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Advanced Filters Button */}
      {showFilterButton && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative glass-card border-primary/30 hover:bg-primary/10 text-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverPopup className="w-80 glass-card-strong border-primary/30 p-4" align="end">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-sm text-white">Filter Files</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto p-0 text-xs text-[#C4C8D4] hover:text-primary"
                >
                  Clear all
                </Button>
              </div>

              {/* File Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  <FileType className="h-3 w-3" />
                  File Type
                </label>
                <Select value={localFilters.fileType || ''} onValueChange={handleFileTypeChange}>
                  <SelectTrigger className="glass-card border-primary/30">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectPopup className="glass-card-strong border-primary/30">
                    {fileTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </div>

              {/* Size Range Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  <HardDrive className="h-3 w-3" />
                  File Size
                </label>
                <Select value={currentSizeRange} onValueChange={handleSizeRangeChange}>
                  <SelectTrigger className="glass-card border-primary/30">
                    <SelectValue placeholder="Any size" />
                  </SelectTrigger>
                  <SelectPopup className="glass-card-strong border-primary/30">
                    {sizeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  <Calendar className="h-3 w-3" />
                  Upload Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="glass-card border-primary/30 justify-start text-left font-normal"
                      >
                        {localFilters.dateRange?.from ? (
                          <span className="text-xs">
                            {localFilters.dateRange.from.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-[#C4C8D4]">From</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverPopup className="w-auto p-0 glass-card-strong border-primary/30">
                      <CalendarComponent
                        mode="single"
                        selected={localFilters.dateRange?.from}
                        onSelect={(date) => handleDateRangeChange('from', date)}
                        initialFocus
                      />
                    </PopoverPopup>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="glass-card border-primary/30 justify-start text-left font-normal"
                      >
                        {localFilters.dateRange?.to ? (
                          <span className="text-xs">
                            {localFilters.dateRange.to.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-[#C4C8D4]">To</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverPopup className="w-auto p-0 glass-card-strong border-primary/30">
                      <CalendarComponent
                        mode="single"
                        selected={localFilters.dateRange?.to}
                        onSelect={(date) => handleDateRangeChange('to', date)}
                        initialFocus
                      />
                    </PopoverPopup>
                  </Popover>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                onClick={handleApplyFilters}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </PopoverPopup>
        </Popover>
      )}

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.fileType && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/30"
            >
              Type: {fileTypeOptions.find((o) => o.value === filters.fileType)?.label}
              <button
                onClick={() => onFiltersChange({ ...filters, fileType: undefined })}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.sizeRange && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/30"
            >
              Size: {sizeRanges.find((r) => r.min === filters.sizeRange?.min)?.label}
              <button
                onClick={() => {
                  const { sizeRange, ...rest } = filters
                  onFiltersChange(rest)
                }}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/30"
            >
              Date Range
              <button
                onClick={() => {
                  const { dateRange, ...rest } = filters
                  onFiltersChange(rest)
                }}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
