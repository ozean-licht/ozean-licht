'use client';

/**
 * ColumnCustomizer Component - Phase 13 Advanced Views
 *
 * Toggle visible columns in list views.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings2 } from 'lucide-react';
import type { ColumnDefinition } from '@/types/projects';

interface ColumnCustomizerProps {
  columns: ColumnDefinition[];
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

export default function ColumnCustomizer({
  columns,
  visibleColumns,
  onChange,
}: ColumnCustomizerProps) {
  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      // Ensure at least one column remains visible
      if (visibleColumns.length > 1) {
        onChange(visibleColumns.filter((id) => id !== columnId));
      }
    } else {
      onChange([...visibleColumns, columnId]);
    }
  };

  const resetToDefault = () => {
    const defaultVisible = columns
      .filter((col) => col.visible !== false)
      .map((col) => col.id);
    onChange(defaultVisible);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#C4C8D4] hover:text-primary border border-primary/20 hover:border-primary/40"
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 bg-card border-primary/20 p-0"
        align="end"
      >
        <div className="p-3 border-b border-primary/10 flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">Toggle Columns</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="h-6 text-xs text-[#C4C8D4] hover:text-primary px-2"
          >
            Reset
          </Button>
        </div>

        <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
          {columns.map((column) => {
            const isVisible = visibleColumns.includes(column.id);
            const isOnlyVisible = isVisible && visibleColumns.length === 1;

            return (
              <label
                key={column.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-primary/10 ${
                  isOnlyVisible ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Checkbox
                  checked={isVisible}
                  onCheckedChange={() => toggleColumn(column.id)}
                  disabled={isOnlyVisible}
                  className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm text-white">{column.label}</span>
              </label>
            );
          })}
        </div>

        <div className="p-3 border-t border-primary/10">
          <p className="text-xs text-[#C4C8D4]">
            {visibleColumns.length} of {columns.length} columns visible
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
