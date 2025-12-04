/**
 * Formatting Utilities
 *
 * Common formatting functions for numbers, durations, dates, etc.
 */

/**
 * Format a number with abbreviated units (K, M, B)
 *
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.2K", "45.3M")
 *
 * @example
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567) // "1.2M"
 * formatNumber(1234567890) // "1.2B"
 * formatNumber(123) // "123"
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1000000000) {
    return sign + (absNum / 1000000000).toFixed(decimals) + 'B';
  }
  if (absNum >= 1000000) {
    return sign + (absNum / 1000000).toFixed(decimals) + 'M';
  }
  if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(decimals) + 'K';
  }
  return sign + absNum.toString();
}

/**
 * Format minutes to human-readable duration
 *
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "45.3h", "5.2m")
 *
 * @example
 * formatMinutesToHours(123) // "2.1h"
 * formatMinutesToHours(45) // "45m"
 */
export function formatMinutesToHours(minutes: number): string {
  if (minutes === 0) return '0m';

  if (minutes >= 60) {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  }

  return `${Math.round(minutes)}m`;
}

/**
 * Format seconds to human-readable duration
 *
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1h 23m", "45m", "30s")
 *
 * @example
 * formatDuration(3665) // "1h 1m"
 * formatDuration(120) // "2m"
 * formatDuration(30) // "30s"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 && hours === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(' ') || '0s';
}

/**
 * Format percentage with precision
 *
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "45.3%")
 *
 * @example
 * formatPercentage(45.678) // "45.7%"
 * formatPercentage(100) // "100.0%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date range for display
 *
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Formatted string (e.g., "Jan 1 - Jan 31, 2025")
 *
 * @example
 * formatDateRange('2025-01-01', '2025-01-31') // "Jan 1 - Jan 31, 2025"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Format short date for charts
 *
 * @param dateStr - Date string (ISO format)
 * @returns Formatted string (e.g., "Jan 1")
 *
 * @example
 * formatShortDate('2025-01-01') // "Jan 1"
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
