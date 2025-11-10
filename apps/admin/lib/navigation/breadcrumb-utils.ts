import { BreadcrumbSegment, BreadcrumbConfig } from '@/types/breadcrumb';

/**
 * Route label mappings for entity-specific routes
 * Maps URL segments to human-readable labels
 */
export const ROUTE_LABELS: Record<string, string> = {
  'dashboard': 'Dashboard',
  'kids-ascension': 'Kids Ascension',
  'ozean-licht': 'Ozean Licht',
  'health': 'System Health',
  'storage': 'Storage',
  'users': 'Users',
  'videos': 'Videos',
  'courses': 'Courses',
  'members': 'Members',
  'parents': 'Parents',
  'kids': 'Kids',
  'moderation': 'Moderation',
  'content': 'Content',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'account': 'Account',
  'team': 'Team',
};

/**
 * Entity badge mappings for entity-specific sections
 */
export const ENTITY_BADGES: Record<string, string> = {
  'kids-ascension': 'KA',
  'ozean-licht': 'OL',
};

/**
 * Format a URL segment into a human-readable label
 * Handles kebab-case, snake_case, and special characters
 *
 * @param segment - URL segment to format
 * @returns Formatted label
 *
 * @example
 * formatSegmentLabel('kids-ascension') // "Kids Ascension"
 * formatSegmentLabel('system_health') // "System Health"
 * formatSegmentLabel('123') // "123" (IDs remain unchanged)
 */
export function formatSegmentLabel(segment: string): string {
  // Check if we have a predefined label
  if (ROUTE_LABELS[segment]) {
    return ROUTE_LABELS[segment];
  }

  // If it looks like an ID (all digits or UUID), return as-is
  if (/^\d+$/.test(segment) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return segment;
  }

  // Convert kebab-case or snake_case to title case
  return segment
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Build the href for a breadcrumb segment based on its position
 *
 * @param segments - Array of path segments
 * @param index - Index of the current segment
 * @returns Full href path for the segment
 *
 * @example
 * getBreadcrumbHref(['dashboard', 'kids-ascension', 'videos'], 1)
 * // Returns: '/dashboard/kids-ascension'
 */
export function getBreadcrumbHref(segments: string[], index: number): string {
  return '/' + segments.slice(0, index + 1).join('/');
}

/**
 * Get entity badge for a given segment if applicable
 *
 * @param segment - URL segment to check
 * @returns Entity badge or undefined
 */
export function getEntityBadge(segment: string): string | undefined {
  return ENTITY_BADGES[segment];
}

/**
 * Parse pathname into breadcrumb segments
 * Automatically generates labels, hrefs, and detects current page
 *
 * @param pathname - Current pathname from usePathname()
 * @param config - Optional configuration for customization
 * @returns Array of breadcrumb segments
 *
 * @example
 * parsePathToBreadcrumbs('/dashboard/kids-ascension/videos')
 * // Returns:
 * // [
 * //   { label: 'Dashboard', href: '/dashboard', isCurrentPage: false },
 * //   { label: 'Kids Ascension', href: '/dashboard/kids-ascension', isCurrentPage: false, entityBadge: 'KA' },
 * //   { label: 'Videos', href: '/dashboard/kids-ascension/videos', isCurrentPage: true }
 * // ]
 */
export function parsePathToBreadcrumbs(
  pathname: string,
  config: BreadcrumbConfig = {}
): BreadcrumbSegment[] {
  const { customLabels = {}, maxSegments, showEntityBadges = true } = config;

  // Remove leading/trailing slashes and split
  const segments = pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  // Generate breadcrumb segments
  const breadcrumbs: BreadcrumbSegment[] = segments.map((segment, index) => {
    const href = getBreadcrumbHref(segments, index);
    const isCurrentPage = index === segments.length - 1;

    // Check for custom label first, then use formatted label
    const label = customLabels[href] || formatSegmentLabel(segment);

    // Get entity badge if enabled
    const entityBadge = showEntityBadges ? getEntityBadge(segment) : undefined;

    return {
      label,
      href,
      isCurrentPage,
      entityBadge,
    };
  });

  // Apply max segments limit if specified
  if (maxSegments && breadcrumbs.length > maxSegments) {
    // Keep first and last segments, show ellipsis in between
    const firstSegment = breadcrumbs[0];
    const lastSegments = breadcrumbs.slice(-maxSegments + 1);
    return [firstSegment, ...lastSegments];
  }

  return breadcrumbs;
}

/**
 * Truncate a label to a maximum length with ellipsis
 *
 * @param label - Label to truncate
 * @param maxLength - Maximum length (default: 30)
 * @returns Truncated label
 */
export function truncateLabel(label: string, maxLength: number = 30): string {
  if (label.length <= maxLength) {
    return label;
  }
  return label.slice(0, maxLength - 3) + '...';
}
