/**
 * Breadcrumb system types for Admin Dashboard
 * Supports automatic route parsing and custom label overrides
 */

/**
 * Represents a single segment in the breadcrumb trail
 */
export interface BreadcrumbSegment {
  /** Display label for this segment */
  label: string;
  /** Navigation href for this segment */
  href: string;
  /** True if this is the current/active page */
  isCurrentPage: boolean;
  /** Optional entity badge (e.g., 'KA', 'OL') */
  entityBadge?: string;
}

/**
 * Configuration options for breadcrumb generation
 */
export interface BreadcrumbConfig {
  /** Custom label overrides for specific paths */
  customLabels?: Record<string, string>;
  /** Maximum number of segments to display (default: unlimited) */
  maxSegments?: number;
  /** Show entity badges in breadcrumb */
  showEntityBadges?: boolean;
  /** Custom separator between segments */
  separator?: 'slash' | 'chevron' | 'arrow';
}

/**
 * Context value for breadcrumb customization
 */
export interface BreadcrumbContextValue {
  /** Custom label mappings for dynamic routes */
  customLabels: Record<string, string>;
  /** Set a custom label for a specific path */
  setCustomLabel: (path: string, label: string) => void;
  /** Clear all custom labels */
  clearCustomLabels: () => void;
  /** Clear a specific custom label */
  clearCustomLabel: (path: string) => void;
}
