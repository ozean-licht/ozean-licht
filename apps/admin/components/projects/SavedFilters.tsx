'use client';

/**
 * SavedFilters Component - Phase 13 Advanced Views
 *
 * Save and load filter presets for task views.
 * Uses localStorage for persistence.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bookmark,
  Plus,
  Trash2,
  Check,
  Star,
} from 'lucide-react';
import type { FilterPreset, FilterState } from '@/types/projects';

const STORAGE_KEY = 'ozean-licht-task-filters';

// Safe ID generation with fallback for Safari < 15.4
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Safe localStorage getter with SSR protection
function getStoredFilters(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Safe localStorage setter with SSR protection
function setStoredFilters(filters: FilterPreset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (e) {
    console.warn('Failed to save filters to localStorage:', e);
  }
}

interface SavedFiltersProps {
  currentFilter: FilterState;
  onLoad: (filter: FilterState) => void;
}

export default function SavedFilters({ currentFilter, onLoad }: SavedFiltersProps) {
  const [filters, setFilters] = useState<FilterPreset[]>([]);
  const [newFilterName, setNewFilterName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Load filters from localStorage
  useEffect(() => {
    setFilters(getStoredFilters());
  }, []);

  // Save filters to localStorage
  const saveToStorage = (newFilters: FilterPreset[]) => {
    setStoredFilters(newFilters);
    setFilters(newFilters);
  };

  // Save current filter as preset
  const handleSave = () => {
    if (!newFilterName.trim()) return;

    const newPreset: FilterPreset = {
      id: generateId(),
      name: newFilterName.trim(),
      filter: currentFilter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveToStorage([...filters, newPreset]);
    setNewFilterName('');
    setShowSaveInput(false);
  };

  // Delete a filter preset
  const handleDelete = (id: string) => {
    saveToStorage(filters.filter((f) => f.id !== id));
  };

  // Set default filter
  const handleSetDefault = (id: string) => {
    const updated = filters.map((f) => ({
      ...f,
      isDefault: f.id === id,
    }));
    saveToStorage(updated);
  };

  // Check if current filter has any active values
  const hasActiveFilter = Object.values(currentFilter).some(
    (v) => v !== undefined && v !== '' && v !== 'active'
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#C4C8D4] hover:text-primary border border-primary/20 hover:border-primary/40"
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Filters
          {filters.length > 0 && (
            <span className="ml-1 text-xs text-primary">({filters.length})</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 bg-card border-primary/20 p-0"
        align="end"
      >
        <div className="p-3 border-b border-primary/10">
          <h4 className="text-sm font-medium text-white">Saved Filters</h4>
        </div>

        {/* Filter list */}
        <div className="max-h-48 overflow-y-auto">
          {filters.length === 0 ? (
            <div className="p-4 text-sm text-[#C4C8D4] text-center">
              No saved filters yet
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filters.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 group"
                >
                  <button
                    onClick={() => {
                      onLoad(preset.filter);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left text-sm text-white hover:text-primary truncate"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => handleSetDefault(preset.id)}
                    className={`p-1 rounded ${
                      preset.isDefault
                        ? 'text-primary'
                        : 'text-[#C4C8D4] opacity-0 group-hover:opacity-100'
                    } hover:text-primary`}
                    title={preset.isDefault ? 'Default filter' : 'Set as default'}
                  >
                    <Star className="w-3 h-3" fill={preset.isDefault ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleDelete(preset.id)}
                    className="p-1 text-[#C4C8D4] opacity-0 group-hover:opacity-100 hover:text-red-400"
                    title="Delete filter"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save new filter */}
        <div className="p-3 border-t border-primary/10">
          {showSaveInput ? (
            <div className="flex gap-2">
              <Input
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="Filter name..."
                className="h-8 text-sm bg-[#00111A] border-primary/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setShowSaveInput(false);
                }}
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!newFilterName.trim()}
                className="h-8 px-2 bg-primary text-white"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveInput(true)}
              disabled={!hasActiveFilter}
              className="w-full text-[#C4C8D4] hover:text-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Save Current Filter
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
