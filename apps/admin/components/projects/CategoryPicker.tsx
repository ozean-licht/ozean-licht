'use client';

/**
 * Category Picker Component
 *
 * Hierarchical tree selector for content categories.
 * Part of Project Management MVP - Content Production Focus
 */

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
  parent_id: string | null;
  children: Category[];
}

interface CategoryPickerProps {
  value?: string;
  onChange: (categoryId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
  showTree?: boolean;
}

export default function CategoryPicker({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select category...',
  showTree = true,
}: CategoryPickerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch('/api/categories?tree=true');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.tree || []);

          // Flatten tree for easier searching
          const flatten = (cats: Category[]): Category[] => {
            return cats.flatMap(cat => [cat, ...flatten(cat.children || [])]);
          };
          setFlatCategories(flatten(data.tree || []));
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Type-safe icon lookup from Lucide
  const getIcon = (iconName: string | null): React.ComponentType<{ className?: string }> => {
    if (!iconName) return Folder;
    // Convert icon name to PascalCase for Lucide component lookup
    const pascalName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }> | undefined>;
    return icons[pascalName] || icons[iconName] || Folder;
  };

  // Max depth to prevent stack overflow from circular references
  const MAX_DEPTH = 10;

  const renderTreeNode = (category: Category, depth: number = 0) => {
    // Prevent unbounded recursion
    if (depth > MAX_DEPTH) return null;

    const Icon = getIcon(category.icon);
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const matchesSearch = searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch && searchQuery !== '') return null;

    return (
      <div key={category.id}>
        <SelectItem
          value={category.id}
          className="cursor-pointer"
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          <span className="flex items-center gap-2 w-full">
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(category.id);
                }}
                className="hover:bg-primary/10 rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-[#C4C8D4]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#C4C8D4]" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <Icon className="w-4 h-4 text-[#C4C8D4]" />
            <span className="text-[#FFFFFF]">{category.name}</span>
          </span>
        </SelectItem>
        {hasChildren && isExpanded && category.children.map(child =>
          renderTreeNode(child, depth + 1)
        )}
      </div>
    );
  };

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  const handleValueChange = (val: string) => {
    if (val === '__clear__') {
      onChange(null);
    } else {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      {showTree && flatCategories.length > 5 && (
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 bg-card/50 border-primary/20"
        />
      )}
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-card/50 border-primary/20">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="__clear__" className="text-[#C4C8D4] italic">
            Clear selection
          </SelectItem>
          {showTree ? (
            categories.map(cat => renderTreeNode(cat))
          ) : (
            flatCategories
              .filter(cat =>
                searchQuery === '' ||
                cat.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(cat => {
                const Icon = getIcon(cat.icon);
                return (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <Icon className="w-4 h-4 text-[#C4C8D4]" />
                      <span className="text-[#FFFFFF]">{cat.name}</span>
                    </span>
                  </SelectItem>
                );
              })
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
