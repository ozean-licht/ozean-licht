/**
 * CategoryManager Component - Support Management System
 *
 * Sidebar component for managing and filtering knowledge base articles by category.
 * Displays a vertical list of categories with article counts and selection states.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Folder, ChevronRight, Loader2, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_ARTICLE_CATEGORIES } from '@/lib/constants/support';

/**
 * Category data structure with optional article count
 */
interface Category {
  name: string;
  count?: number;
}

/**
 * CategoryManager component props
 */
interface CategoryManagerProps {
  /** Currently selected category (null for "All Articles") */
  selectedCategory: string | null;
  /** Callback when a category is selected */
  onCategorySelect: (category: string | null) => void;
  /** Optional callback when a new category is created */
  onCategoryCreate?: (category: string) => void;
}

/**
 * CategoryManager displays a sidebar of article categories for filtering
 *
 * Features:
 * - Fetch categories from API on mount
 * - "All Articles" option to clear filter
 * - Selected category highlighted with primary color
 * - Hover effects with glass-hover styling
 * - Loading state while fetching
 * - Empty state if no categories exist
 * - Optional inline category creation (admin feature)
 *
 * @example
 * ```tsx
 * <CategoryManager
 *   selectedCategory={selectedCategory}
 *   onCategorySelect={(category) => setSelectedCategory(category)}
 *   onCategoryCreate={(category) => handleNewCategory(category)}
 * />
 * ```
 */
export default function CategoryManager({
  selectedCategory,
  onCategorySelect,
  onCategoryCreate,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/support/knowledge/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        const fetchedCategories: Category[] = (data.categories || []).map((name: string) => ({
          name,
          count: undefined, // Article counts can be added later if needed
        }));

        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreating(true);
    try {
      // Check if category already exists
      if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        alert('Category already exists');
        return;
      }

      // Add category to local state
      const newCategory: Category = {
        name: newCategoryName.trim(),
        count: 0,
      };
      setCategories(prev => [...prev, newCategory]);

      // Call optional callback
      if (onCategoryCreate) {
        onCategoryCreate(newCategoryName.trim());
      }

      // Reset form
      setNewCategoryName('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryName: string | null) => {
    onCategorySelect(categoryName);
  };

  // Loading state
  if (loading) {
    return (
      <div className="glass-card rounded-lg p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="glass-card rounded-lg p-4">
        <div className="text-center py-4">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-sans font-medium text-white text-sm">Categories</h3>
      </div>

      {/* Categories List */}
      <div className="p-2">
        {/* All Articles Option */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group ${
            selectedCategory === null
              ? 'bg-primary/20 border border-primary/40 text-primary'
              : 'text-[#C4C8D4] hover:bg-card/50 hover:border hover:border-primary/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderOpen className={`h-4 w-4 ${
              selectedCategory === null ? 'text-primary' : 'text-[#C4C8D4] group-hover:text-primary'
            }`} />
            <span className="text-sm font-sans font-medium">All Articles</span>
          </div>
          <ChevronRight className={`h-4 w-4 ${
            selectedCategory === null ? 'text-primary' : 'text-[#C4C8D4] group-hover:text-primary'
          }`} />
        </button>

        {/* Category List */}
        {categories.length > 0 ? (
          <div className="mt-1 space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group ${
                  selectedCategory === category.name
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'text-[#C4C8D4] hover:bg-card/50 hover:border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className={`h-4 w-4 ${
                    selectedCategory === category.name ? 'text-primary' : 'text-[#C4C8D4] group-hover:text-primary'
                  }`} />
                  <span className="text-sm font-sans font-medium truncate">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {category.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedCategory === category.name
                        ? 'bg-primary/30 text-primary'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {category.count}
                    </span>
                  )}
                  <ChevronRight className={`h-4 w-4 ${
                    selectedCategory === category.name ? 'text-primary' : 'text-[#C4C8D4] group-hover:text-primary'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-6 px-4">
            <Folder className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">
              No categories yet
            </p>
          </div>
        )}

        {/* Add Category Section (Optional for admins) */}
        {onCategoryCreate && (
          <div className="mt-2 pt-2 border-t border-border">
            {!showAddForm ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="w-full justify-start text-[#C4C8D4] hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateCategory();
                    if (e.key === 'Escape') {
                      setShowAddForm(false);
                      setNewCategoryName('');
                    }
                  }}
                  className="h-8 text-sm"
                  autoFocus
                  disabled={creating}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateCategory}
                    disabled={creating || !newCategoryName.trim()}
                    className="flex-1 h-7 text-xs"
                  >
                    {creating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategoryName('');
                    }}
                    disabled={creating}
                    className="flex-1 h-7 text-xs"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Suggested Categories */}
                {newCategoryName.length === 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1.5">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {DEFAULT_ARTICLE_CATEGORIES
                        .filter(cat => !categories.some(c => c.name === cat))
                        .slice(0, 3)
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setNewCategoryName(suggestion)}
                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
