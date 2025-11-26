/**
 * CategoryFilter Component
 *
 * Dropdown filter for permission categories
 */

'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui';
import { CATEGORY_METADATA } from '@/lib/rbac/permission-categories';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  permissionCounts?: Record<string, number>;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  permissionCounts = {},
}: CategoryFilterProps) {
  return (
    <Select
      value={selected || 'all'}
      onValueChange={(value) => onSelect(value === 'all' ? null : value)}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All Categories ({Object.values(permissionCounts).reduce((sum, count) => sum + count, 0)})
        </SelectItem>
        {categories.map((category) => {
          const metadata = CATEGORY_METADATA[category];
          const count = permissionCounts[category] || 0;

          return (
            <SelectItem key={category} value={category}>
              {metadata?.label || category} ({count})
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
