'use client';

/**
 * Sprint Selector Component
 *
 * Dropdown to assign a task to a sprint.
 * Part of Project Management MVP Phase 10
 */

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Zap } from 'lucide-react';

interface Sprint {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string | null;
  end_date?: string | null;
}

interface SprintSelectorProps {
  projectId: string;
  value?: string | null;
  onChange: (sprintId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function SprintSelector({
  projectId,
  value,
  onChange,
  disabled = false,
  className = '',
}: SprintSelectorProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setSprints([]);
      return;
    }

    async function fetchSprints() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/sprints`);
        if (res.ok) {
          const data = await res.json();
          setSprints(data.sprints || []);
        }
      } catch (error) {
        console.error('Failed to fetch sprints:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSprints();
  }, [projectId]);

  const getStatusBadge = (status: Sprint['status']) => {
    const badges: Record<Sprint['status'], string> = {
      active: 'text-green-400',
      planning: 'text-blue-400',
      completed: 'text-gray-400',
      cancelled: 'text-red-400',
    };
    return badges[status] || 'text-gray-400';
  };

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return '';
    const startStr = start ? new Date(start).toLocaleDateString() : '?';
    const endStr = end ? new Date(end).toLocaleDateString() : '?';
    return `(${startStr} - ${endStr})`;
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 h-10 px-3 bg-card/50 border border-primary/20 rounded-md ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-[#C4C8D4] text-sm">Loading sprints...</span>
      </div>
    );
  }

  return (
    <Select
      value={value || 'none'}
      onValueChange={(val) => onChange(val === 'none' ? null : val)}
      disabled={disabled || !projectId}
    >
      <SelectTrigger className={`bg-card/50 border-primary/20 ${className}`}>
        <SelectValue placeholder="Select sprint..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-[#C4C8D4]">No Sprint (Backlog)</span>
        </SelectItem>
        {sprints.length === 0 && (
          <SelectItem value="no-sprints" disabled>
            <span className="text-[#C4C8D4] italic">No sprints available</span>
          </SelectItem>
        )}
        {sprints.map((sprint) => (
          <SelectItem key={sprint.id} value={sprint.id}>
            <div className="flex items-center gap-2">
              {sprint.status === 'active' && (
                <Zap className="w-3 h-3 text-green-400" />
              )}
              <span className="text-white">{sprint.name}</span>
              <span className={`text-xs capitalize ${getStatusBadge(sprint.status)}`}>
                {sprint.status}
              </span>
              <span className="text-xs text-[#C4C8D4]">
                {formatDateRange(sprint.start_date, sprint.end_date)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
