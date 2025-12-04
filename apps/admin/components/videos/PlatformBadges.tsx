'use client';

import { VideoPlatformRecord, PlatformStatus } from '@/types/video';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlatformBadgesProps {
  platforms: VideoPlatformRecord[];
  className?: string;
}

/**
 * Platform icon/label mapping
 */
const PLATFORM_CONFIG = {
  vimeo: {
    icon: 'V',
    label: 'Vimeo',
  },
  youtube: {
    icon: 'YT',
    label: 'YouTube',
  },
  hetzner: {
    icon: 'H',
    label: 'Hetzner',
  },
} as const;

/**
 * Get badge variant for platform status
 */
function getStatusVariant(status: PlatformStatus): 'success' | 'warning' | 'outline' | 'destructive' | 'secondary' {
  const variantMap: Record<PlatformStatus, 'success' | 'warning' | 'outline' | 'destructive' | 'secondary'> = {
    ready: 'success',
    processing: 'warning',
    pending: 'outline',
    failed: 'destructive',
    archived: 'secondary',
  };
  return variantMap[status] || 'outline';
}

/**
 * Get status indicator icon
 */
function getStatusIndicator(status: PlatformStatus): string {
  switch (status) {
    case 'processing':
      return '⟳';
    case 'failed':
      return '✕';
    case 'ready':
      return '✓';
    case 'archived':
      return '⊘';
    default:
      return '';
  }
}

/**
 * PlatformBadges - Display platform distribution status badges for a video
 *
 * Shows badges for each platform (vimeo, youtube, hetzner) with status indicators:
 * - ready: green/success variant with checkmark
 * - processing: yellow/warning variant with spinning icon
 * - pending: gray/outline variant
 * - failed: red/destructive variant with X
 * - archived: slate/secondary variant with slash
 *
 * @example
 * ```tsx
 * <PlatformBadges platforms={video.platforms} />
 * ```
 */
export default function PlatformBadges({ platforms, className }: PlatformBadgesProps) {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {platforms.map((platform) => {
        const config = PLATFORM_CONFIG[platform.platform];
        const variant = getStatusVariant(platform.status);
        const indicator = getStatusIndicator(platform.status);

        return (
          <Badge
            key={platform.id}
            variant={variant}
            className="gap-1.5 font-medium"
          >
            <span className="font-semibold">{config.icon}</span>
            <span>{config.label}</span>
            {indicator && (
              <span className={cn(
                'text-xs',
                platform.status === 'processing' && 'animate-spin'
              )}>
                {indicator}
              </span>
            )}
          </Badge>
        );
      })}
    </div>
  );
}
