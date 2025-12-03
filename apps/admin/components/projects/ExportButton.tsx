'use client';

/**
 * ExportButton Component - Phase 13 Advanced Views
 *
 * Export tasks/projects to CSV or JSON.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileJson, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Task, Project, ExportFormat } from '@/types/projects';

interface ExportButtonProps {
  data: Task[] | Project[];
  filename: string;
  type: 'tasks' | 'projects';
}

// Task fields to export
const TASK_FIELDS = [
  'title',
  'status',
  'priority',
  'taskType',
  'dueDate',
  'startDate',
  'estimatedHours',
  'actualHours',
  'storyPoints',
  'createdAt',
  'updatedAt',
] as const;

// Project fields to export
const PROJECT_FIELDS = [
  'name',
  'status',
  'priority',
  'startDate',
  'dueDate',
  'progressPercent',
  'createdAt',
  'updatedAt',
] as const;

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  // Prevent CSV injection - prefix formula characters with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

const MAX_EXPORT_ITEMS = 5000;

export default function ExportButton({ data, filename, type }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fields = type === 'tasks' ? TASK_FIELDS : PROJECT_FIELDS;

  const exportData = (format: ExportFormat) => {
    // Check export size limit
    if (data.length > MAX_EXPORT_ITEMS) {
      toast({
        title: 'Export too large',
        description: `Cannot export more than ${MAX_EXPORT_ITEMS} items. Please filter your data.`,
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'csv') {
        // Create CSV header
        const header = fields.join(',');

        // Create CSV rows
        const rows = data.map((item) =>
          fields.map((field) => escapeCSV(formatValue((item as Record<string, unknown>)[field]))).join(',')
        );

        content = [header, ...rows].join('\n');
        mimeType = 'text/csv;charset=utf-8;';
        extension = 'csv';
      } else {
        // JSON export with formatted output
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json;charset=utf-8;';
        extension = 'json';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'Unable to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isExporting || data.length === 0}
          className="text-[#C4C8D4] hover:text-primary border border-primary/20 hover:border-primary/40"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-card border-primary/20"
        align="end"
      >
        <DropdownMenuItem
          onClick={() => exportData('csv')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportData('json')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileJson className="w-4 h-4 mr-2 text-blue-400" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
