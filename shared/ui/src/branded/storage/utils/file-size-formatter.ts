/**
 * File Size Formatter
 *
 * Utility functions for formatting file sizes in human-readable format
 */

/**
 * Format options for file size
 */
export interface FormatSizeOptions {
  /** Number of decimal places (default: 1) */
  decimals?: number
  /** Use binary units (1024) instead of decimal (1000) (default: true) */
  binary?: boolean
  /** Locale for number formatting (default: 'en-US') */
  locale?: string
}

/**
 * Size unit definitions
 */
const UNITS = {
  binary: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'],
  decimal: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
}

/**
 * Format bytes to human-readable size
 *
 * @param bytes - File size in bytes
 * @param options - Formatting options
 * @returns Formatted size string (e.g., "10.5 MB")
 *
 * @example
 * formatFileSize(1024) // "1.0 KiB"
 * formatFileSize(1000, { binary: false }) // "1.0 KB"
 * formatFileSize(1536, { decimals: 2 }) // "1.50 KiB"
 */
export function formatFileSize(
  bytes: number,
  options: FormatSizeOptions = {}
): string {
  const {
    decimals = 1,
    binary = true,
    locale = 'en-US',
  } = options

  // Handle zero and negative values
  if (bytes === 0) return '0 B'
  if (bytes < 0) return 'Invalid size'

  const base = binary ? 1024 : 1000
  const units = binary ? UNITS.binary : UNITS.decimal

  // Calculate the unit index
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base))
  const clampedIndex = Math.min(unitIndex, units.length - 1)

  // Calculate the value
  const value = bytes / Math.pow(base, clampedIndex)

  // Format the number with locale support
  const formattedValue = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${formattedValue} ${units[clampedIndex]}`
}

/**
 * Format bytes to compact size (no space between number and unit)
 *
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 1)
 * @returns Compact formatted size string (e.g., "10.5MB")
 *
 * @example
 * formatFileSizeCompact(1024) // "1.0KiB"
 * formatFileSizeCompact(1536, 2) // "1.50KiB"
 */
export function formatFileSizeCompact(
  bytes: number,
  decimals: number = 1
): string {
  return formatFileSize(bytes, { decimals }).replace(' ', '')
}

/**
 * Parse formatted size string to bytes
 *
 * @param sizeString - Formatted size string (e.g., "10.5 MB")
 * @returns Size in bytes, or null if invalid
 *
 * @example
 * parseFileSize("10 MB") // 10485760
 * parseFileSize("1.5 GiB") // 1610612736
 * parseFileSize("invalid") // null
 */
export function parseFileSize(sizeString: string): number | null {
  const match = sizeString.match(/^([\d.]+)\s*([A-Za-z]+)$/)
  if (!match) return null

  const [, valueStr, unit] = match
  const value = parseFloat(valueStr)
  if (isNaN(value)) return null

  // Determine if binary or decimal
  const isBinary = unit.toLowerCase().includes('i')
  const base = isBinary ? 1024 : 1000
  const units = isBinary ? UNITS.binary : UNITS.decimal

  // Find unit index
  const unitIndex = units.findIndex(
    (u) => u.toLowerCase() === unit.toLowerCase()
  )
  if (unitIndex === -1) return null

  // Calculate bytes
  return Math.floor(value * Math.pow(base, unitIndex))
}

/**
 * Get size category for styling/display purposes
 *
 * @param bytes - File size in bytes
 * @returns Size category
 *
 * @example
 * getSizeCategory(100) // "tiny"
 * getSizeCategory(5 * 1024 * 1024) // "medium"
 * getSizeCategory(100 * 1024 * 1024) // "huge"
 */
export function getSizeCategory(
  bytes: number
): 'tiny' | 'small' | 'medium' | 'large' | 'huge' {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  if (bytes < 100 * KB) return 'tiny' // < 100 KB
  if (bytes < 10 * MB) return 'small' // < 10 MB
  if (bytes < 100 * MB) return 'medium' // < 100 MB
  if (bytes < GB) return 'large' // < 1 GB
  return 'huge' // >= 1 GB
}

/**
 * Calculate percentage of quota used
 *
 * @param used - Bytes used
 * @param total - Total quota in bytes
 * @returns Percentage (0-100)
 *
 * @example
 * calculateQuotaPercentage(50 * 1024 * 1024, 100 * 1024 * 1024) // 50
 */
export function calculateQuotaPercentage(used: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((used / total) * 100), 100)
}

/**
 * Get quota status based on usage percentage
 *
 * @param percentage - Usage percentage (0-100)
 * @returns Status level
 *
 * @example
 * getQuotaStatus(50) // "ok"
 * getQuotaStatus(75) // "warning"
 * getQuotaStatus(95) // "critical"
 */
export function getQuotaStatus(
  percentage: number
): 'ok' | 'warning' | 'critical' {
  if (percentage >= 90) return 'critical'
  if (percentage >= 70) return 'warning'
  return 'ok'
}

/**
 * Format upload/download speed
 *
 * @param bytesPerSecond - Transfer speed in bytes per second
 * @returns Formatted speed string (e.g., "10.5 MB/s")
 *
 * @example
 * formatTransferSpeed(1048576) // "1.0 MiB/s"
 */
export function formatTransferSpeed(bytesPerSecond: number): string {
  return `${formatFileSize(bytesPerSecond)}/s`
}

/**
 * Calculate estimated time remaining
 *
 * @param remainingBytes - Bytes remaining to transfer
 * @param bytesPerSecond - Transfer speed in bytes per second
 * @returns Time remaining in seconds
 *
 * @example
 * calculateTimeRemaining(10 * 1024 * 1024, 1024 * 1024) // 10
 */
export function calculateTimeRemaining(
  remainingBytes: number,
  bytesPerSecond: number
): number {
  if (bytesPerSecond === 0) return Infinity
  return Math.ceil(remainingBytes / bytesPerSecond)
}

/**
 * Format time duration in human-readable format
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "2m 30s", "1h 15m")
 *
 * @example
 * formatDuration(90) // "1m 30s"
 * formatDuration(3665) // "1h 1m"
 */
export function formatDuration(seconds: number): string {
  if (seconds === Infinity) return '∞'
  if (seconds === 0) return '0s'
  if (seconds < 0) return 'Invalid'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 && hours === 0) parts.push(`${secs}s`)

  return parts.join(' ') || '0s'
}
