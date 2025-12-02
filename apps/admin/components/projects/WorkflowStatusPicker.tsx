'use client';

/**
 * Workflow Status Picker Component
 *
 * Dropdown showing workflow statuses with color dots.
 * Part of Project Management MVP Phase 2
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
import { toast } from '@/hooks/use-toast';

interface WorkflowStatus {
  id: string;
  name: string;
  slug: string;
  color: string;
  order_index: number;
  is_start_state: boolean;
  is_done_state: boolean;
}

interface WorkflowStatusPickerProps {
  workflowId: string;
  value?: string;
  onChange: (statusId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function WorkflowStatusPicker({
  workflowId,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select status...',
}: WorkflowStatusPickerProps) {
  const [statuses, setStatuses] = useState<WorkflowStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatuses() {
      if (!workflowId) {
        setStatuses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/workflows/${workflowId}/statuses`);
        if (res.ok) {
          const data = await res.json();
          // Sort by order_index
          const sorted = (data.statuses || []).sort(
            (a: WorkflowStatus, b: WorkflowStatus) => a.order_index - b.order_index
          );
          setStatuses(sorted);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workflow statuses. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStatuses();
  }, [workflowId]);

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!workflowId) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full bg-card/50 border-primary/20">
          <SelectValue placeholder="Select workflow first" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-card/50 border-primary/20">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.id} value={status.id}>
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: status.color }}
              />
              <span>{status.name}</span>
              {status.is_start_state && (
                <span className="text-xs text-[#C4C8D4]">(Start)</span>
              )}
              {status.is_done_state && (
                <span className="text-xs text-[#C4C8D4]">(Done)</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
