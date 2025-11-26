/**
 * EntityBadge Component
 *
 * Displays the entity scope (Kids Ascension or Ozean Licht) for an admin user.
 */

import { Badge } from '@/lib/ui';
import { ENTITY_CONFIG } from '@/lib/rbac/constants';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EntityBadgeProps {
  entity: 'kids_ascension' | 'ozean_licht';
  compact?: boolean;
  className?: string;
}

export function EntityBadge({ entity, compact = false, className }: EntityBadgeProps) {
  const config = ENTITY_CONFIG[entity];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as LucideIcon;
  const label = compact ? config.shortLabel : config.label;

  return (
    <Badge
      variant={config.color as 'default' | 'destructive' | 'outline' | 'secondary'}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {IconComponent && <IconComponent className="h-3 w-3" />}
      {label}
    </Badge>
  );
}
