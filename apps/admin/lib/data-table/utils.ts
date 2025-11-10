import { Table } from '@tanstack/react-table';
import Papa from 'papaparse';

export function exportToCSV<TData>(
  table: Table<TData>,
  filename: string = 'data'
): void {
  // Get visible columns
  const visibleColumns = table.getVisibleLeafColumns();

  // Get rows (filtered and sorted)
  const rows = table.getFilteredRowModel().rows;

  // Build CSV data
  const headers = visibleColumns
    .filter(col => col.id !== 'select' && col.id !== 'actions')
    .map(col => col.id);

  const data = rows.map(row => {
    const rowData: Record<string, any> = {};
    visibleColumns
      .filter(col => col.id !== 'select' && col.id !== 'actions')
      .forEach(col => {
        rowData[col.id] = row.getValue(col.id);
      });
    return rowData;
  });

  // Convert to CSV using Papa Parse
  const csv = Papa.unparse({
    fields: headers,
    data: data,
  });

  // Download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatTableDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTableTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTableDateTime(date: Date | string): string {
  return `${formatTableDate(date)} ${formatTableTime(date)}`;
}
