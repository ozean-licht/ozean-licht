/**
 * UnreadBadge Component - Team Chat & Messaging System
 *
 * Badge showing unread message count
 */

'use client';

import React from 'react';

interface UnreadBadgeProps {
  /** Number of unread messages */
  count: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UnreadBadge displays unread message count
 *
 * Features:
 * - Shows exact count up to 99
 * - Displays "99+" for counts over 99
 * - Primary color background
 * - Small, circular badge
 *
 * @example
 * ```tsx
 * <UnreadBadge count={5} />
 * <UnreadBadge count={150} /> // Shows "99+"
 * ```
 */
export default function UnreadBadge({
  count,
  className = '',
}: UnreadBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-xs font-sans font-medium ${className}`}
      aria-label={`${count} unread messages`}
    >
      {displayCount}
    </div>
  );
}
