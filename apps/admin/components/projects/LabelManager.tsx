'use client';

/**
 * Label Manager Component
 *
 * Manages labels for projects, tasks, and content items.
 * Supports adding, removing, and displaying colored labels with search.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Plus, X, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Label {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface LabelManagerProps {
  entityId: string;
  entityType: 'project' | 'task' | 'content_item';
  onChange?: (labels: Label[]) => void;
  readonly?: boolean;
}

export default function LabelManager({
  entityId,
  entityType,
  onChange,
  readonly = false,
}: LabelManagerProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchLabels() {
      try {
        const [currentRes, availableRes] = await Promise.all([
          fetch(`/api/labels/entity?entityId=${entityId}&entityType=${entityType}`),
          fetch(`/api/labels?entity_type=${entityType}`),
        ]);

        if (currentRes.ok) {
          const data = await currentRes.json();
          setLabels(data.labels || []);
        }

        if (availableRes.ok) {
          const data = await availableRes.json();
          setAvailableLabels(data.labels || []);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load labels. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLabels();
  }, [entityId, entityType]);

  const handleAddLabel = async (labelId: string) => {
    const label = availableLabels.find((l) => l.id === labelId);
    if (!label) return;

    // Optimistic update
    const newLabels = [...labels, label];
    setLabels(newLabels);
    setOpen(false);

    try {
      const res = await fetch('/api/labels/entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, entityType, labelId }),
      });

      if (!res.ok) throw new Error('Failed to add label');

      onChange?.(newLabels);
      toast({
        title: 'Label added',
        description: `"${label.name}" added successfully.`,
      });
    } catch (error) {
      // Revert on error
      setLabels(labels);
      toast({
        title: 'Error',
        description: 'Failed to add label. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveLabel = async (labelId: string) => {
    const label = labels.find((l) => l.id === labelId);
    if (!label) return;

    // Optimistic update
    const newLabels = labels.filter((l) => l.id !== labelId);
    setLabels(newLabels);

    try {
      const res = await fetch('/api/labels/entity', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, entityType, labelId }),
      });

      if (!res.ok) throw new Error('Failed to remove label');

      onChange?.(newLabels);
    } catch (error) {
      // Revert on error
      setLabels(labels);
      toast({
        title: 'Error',
        description: 'Failed to remove label. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter out already-selected labels
  const unselectedLabels = availableLabels.filter(
    (al) => !labels.some((l) => l.id === al.id)
  );

  return (
    <div className="space-y-4">
      {/* Current labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="flex items-center gap-1.5 py-1 px-2.5 border-l-4"
              style={{
                borderLeftColor: label.color,
                borderColor: `${label.color}40`,
                backgroundColor: `${label.color}15`,
              }}
            >
              <Tag className="w-3 h-3" style={{ color: label.color }} />
              <span className="text-white text-xs">{label.name}</span>
              {!readonly && (
                <button
                  type="button"
                  onClick={() => handleRemoveLabel(label.id)}
                  className="ml-1 p-0.5 hover:bg-white/10 rounded"
                  aria-label={`Remove ${label.name}`}
                >
                  <X className="w-3 h-3 text-[#C4C8D4] hover:text-red-400" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Add label picker */}
      {!readonly && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-card/50 border-primary/20 hover:border-primary/40"
              disabled={loading || unselectedLabels.length === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Label
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-card border-primary/20" align="start">
            <Command className="bg-card">
              <CommandInput placeholder="Search labels..." className="text-[#C4C8D4]" />
              <CommandList>
                <CommandEmpty className="text-[#C4C8D4]">No labels found.</CommandEmpty>
                <CommandGroup>
                  {unselectedLabels.map((label) => (
                    <CommandItem
                      key={label.id}
                      value={label.name}
                      onSelect={() => handleAddLabel(label.id)}
                      className="cursor-pointer text-white hover:bg-primary/20"
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2 border border-white/20"
                        style={{ backgroundColor: label.color }}
                      />
                      {label.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {labels.length === 0 && readonly && (
        <p className="text-sm text-[#C4C8D4]">No labels</p>
      )}
    </div>
  );
}
