'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { parsePathToBreadcrumbs, truncateLabel } from '@/lib/navigation/breadcrumb-utils';
import { useBreadcrumb } from '@/lib/contexts/BreadcrumbContext';
import { BreadcrumbConfig } from '@/types/breadcrumb';

/**
 * Props for Breadcrumb component
 */
interface BreadcrumbProps {
  /** Configuration options for breadcrumb generation */
  config?: BreadcrumbConfig;
  /** Show home icon for first segment */
  showHomeIcon?: boolean;
  /** Maximum label length before truncation */
  maxLabelLength?: number;
  /** Show entity badges (e.g., KA, OL) */
  showEntityBadges?: boolean;
}

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumb trail based on current route
 *
 * Features:
 * - Automatic route parsing with intelligent label formatting
 * - Custom label support via BreadcrumbContext
 * - Entity badges for Kids Ascension and Ozean Licht sections
 * - Responsive design (truncates on mobile)
 * - Full accessibility (ARIA labels, semantic HTML)
 * - Keyboard navigation support
 *
 * @example
 * // Basic usage
 * <Breadcrumb />
 *
 * @example
 * // With custom configuration
 * <Breadcrumb
 *   showHomeIcon
 *   maxLabelLength={25}
 *   showEntityBadges
 * />
 *
 * @example
 * // Setting custom labels from a page
 * const { setCustomLabel } = useBreadcrumb();
 * useEffect(() => {
 *   if (userData) {
 *     setCustomLabel(`/dashboard/users/${userId}`, userData.name);
 *   }
 * }, [userData]);
 */
export function Breadcrumb({
  config,
  showHomeIcon = true,
  maxLabelLength = 30,
  showEntityBadges = true,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const { customLabels } = useBreadcrumb();

  // Memoize breadcrumb segments to avoid re-parsing on every render
  const segments = useMemo(() => {
    return parsePathToBreadcrumbs(pathname, {
      ...config,
      customLabels,
      showEntityBadges,
    });
  }, [pathname, customLabels, config, showEntityBadges]);

  // Don't render breadcrumb on root dashboard page
  if (pathname === '/dashboard' || segments.length === 0) {
    return null;
  }

  // On mobile, only show last 2 segments
  const visibleSegments = segments.length > 2
    ? [...segments.slice(0, 1), ...segments.slice(-2)]
    : segments;

  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex flex-wrap items-center space-x-2 text-sm">
        {visibleSegments.map((segment, index) => {
          const isLast = segment.isCurrentPage;
          const showEllipsis = index === 1 && segments.length > 3;
          const truncatedLabel = truncateLabel(segment.label, maxLabelLength);

          return (
            <React.Fragment key={segment.href}>
              {/* Ellipsis for hidden segments on mobile */}
              {showEllipsis && (
                <>
                  <li className="md:hidden">
                    <span className="text-muted-foreground">...</span>
                  </li>
                  <li className="md:hidden" aria-hidden="true">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </li>
                </>
              )}

              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="flex items-center gap-2 font-medium text-foreground dark:text-gray-100"
                    aria-current="page"
                  >
                    {/* Entity badge */}
                    {segment.entityBadge && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-primary-500 text-white">
                        {segment.entityBadge}
                      </span>
                    )}

                    {/* Home icon for first segment */}
                    {index === 0 && showHomeIcon ? (
                      <Home className="w-4 h-4" aria-label="Home" />
                    ) : (
                      truncatedLabel
                    )}
                  </span>
                ) : (
                  <Link
                    href={segment.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-1"
                  >
                    {/* Entity badge */}
                    {segment.entityBadge && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-primary-500/80 text-white">
                        {segment.entityBadge}
                      </span>
                    )}

                    {/* Home icon for first segment */}
                    {index === 0 && showHomeIcon ? (
                      <Home className="w-4 h-4" aria-label="Home" />
                    ) : (
                      truncatedLabel
                    )}
                  </Link>
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li aria-hidden="true">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
