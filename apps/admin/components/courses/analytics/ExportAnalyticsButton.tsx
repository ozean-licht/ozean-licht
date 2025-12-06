'use client';

/**
 * ExportAnalyticsButton - Export analytics data to CSV/JSON
 *
 * Provides download functionality for course analytics data.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportAnalyticsButtonProps {
  courseId: string;
  courseTitle?: string;
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
  onExportError?: (error: Error) => void;
  disabled?: boolean;
}

type ExportFormat = 'csv' | 'json';
type ExportType = 'events' | 'progress' | 'enrollments';

/**
 * ExportAnalyticsButton component
 */
export function ExportAnalyticsButton({
  courseId,
  courseTitle = 'Course',
  onExportStart,
  onExportComplete,
  onExportError,
  disabled = false,
}: ExportAnalyticsButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Generate filename for export
   */
  const generateFilename = (type: ExportType, format: ExportFormat): string => {
    const sanitizedTitle = courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const date = new Date().toISOString().split('T')[0];
    return `${sanitizedTitle}-${type}-${date}.${format}`;
  };

  /**
   * Handle export
   */
  const handleExport = async (type: ExportType, format: ExportFormat) => {
    setIsExporting(true);
    onExportStart?.();

    try {
      let url: string;
      const fetchOptions: RequestInit = {};

      switch (type) {
        case 'events':
          url = `/api/analytics/courses/${courseId}?view=export&format=${format}`;
          break;
        case 'enrollments':
          url = `/api/analytics/courses/${courseId}?view=users&limit=10000`;
          break;
        case 'progress':
          url = `/api/analytics/courses/${courseId}?view=overview`;
          break;
        default:
          throw new Error('Invalid export type');
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      let blob: Blob;
      const filename = generateFilename(type, format);

      if (format === 'csv' && type === 'events') {
        // CSV is returned directly from the API
        blob = await response.blob();
      } else {
        // Convert JSON response to the requested format
        const data = await response.json();
        const exportData = type === 'enrollments' ? data.enrollments : data;

        if (format === 'csv') {
          const csvContent = convertToCSV(exportData, type);
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        } else {
          blob = new Blob(
            [JSON.stringify(exportData, null, 2)],
            { type: 'application/json' }
          );
        }
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      onExportComplete?.(format);
    } catch (error) {
      console.error('Export error:', error);
      onExportError?.(error instanceof Error ? error : new Error('Export failed'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-[#0E282E] text-[#C4C8D4] hover:bg-primary/10 hover:text-primary"
          disabled={disabled || isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#00111A] border-[#0E282E] w-56"
      >
        <DropdownMenuLabel className="text-[#C4C8D4]">Export Data</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#0E282E]" />

        {/* Events Export */}
        <DropdownMenuItem
          onClick={() => handleExport('events', 'csv')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
          Events (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('events', 'json')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileJson className="h-4 w-4 mr-2 text-blue-500" />
          Events (JSON)
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#0E282E]" />

        {/* Enrollments Export */}
        <DropdownMenuItem
          onClick={() => handleExport('enrollments', 'csv')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
          Enrollments (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('enrollments', 'json')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileJson className="h-4 w-4 mr-2 text-blue-500" />
          Enrollments (JSON)
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#0E282E]" />

        {/* Summary Export */}
        <DropdownMenuItem
          onClick={() => handleExport('progress', 'json')}
          className="text-white hover:bg-primary/10 cursor-pointer"
        >
          <FileJson className="h-4 w-4 mr-2 text-blue-500" />
          Analytics Summary (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Convert data array to CSV string
 */
function convertToCSV(data: any, type: ExportType): string {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return '';
  }

  // Handle array of objects
  const items = Array.isArray(data) ? data : [data];

  // Get headers based on export type
  let headers: string[];
  let rowFormatter: (item: any) => string[];

  switch (type) {
    case 'enrollments':
      headers = [
        'User ID', 'User Name', 'User Email', 'Status',
        'Progress %', 'Lessons Completed', 'Time Spent (seconds)',
        'Enrolled At', 'Started At', 'Completed At', 'Last Accessed'
      ];
      rowFormatter = (item) => [
        item.userId || '',
        item.userName || '',
        item.userEmail || '',
        item.status || '',
        String(item.progressPercent || 0),
        String(item.lessonsCompleted || 0),
        String(item.totalTimeSeconds || 0),
        item.enrolledAt || '',
        item.startedAt || '',
        item.completedAt || '',
        item.lastAccessedAt || ''
      ];
      break;

    case 'events':
      headers = [
        'ID', 'User ID', 'Event Type', 'Event Category',
        'Course ID', 'Lesson ID', 'Created At'
      ];
      rowFormatter = (item) => [
        item.id || '',
        item.userId || '',
        item.eventType || '',
        item.eventCategory || '',
        item.courseId || '',
        item.lessonId || '',
        item.createdAt || ''
      ];
      break;

    case 'progress':
    default: {
      // For summary, flatten the object
      const allKeys = Object.keys(items[0] || {});
      headers = allKeys;
      rowFormatter = (item) => allKeys.map(key => {
        const value = item[key];
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value ?? '');
      });
    }
  }

  // Build CSV with formula injection protection
  const escapeCSV = (str: string): string => {
    // Prevent CSV formula injection by prefixing dangerous characters with a single quote
    const dangerousStarters = ['=', '+', '-', '@', '\t', '\r'];
    let escapedStr = str;

    if (dangerousStarters.some(char => str.startsWith(char))) {
      escapedStr = "'" + str;
    }

    // Standard CSV escaping for quotes, commas, and newlines
    if (escapedStr.includes('"') || escapedStr.includes(',') || escapedStr.includes('\n')) {
      return `"${escapedStr.replace(/"/g, '""')}"`;
    }
    return escapedStr;
  };

  const headerRow = headers.map(escapeCSV).join(',');
  const dataRows = items.map(item => rowFormatter(item).map(escapeCSV).join(','));

  return [headerRow, ...dataRows].join('\n');
}

export default ExportAnalyticsButton;
