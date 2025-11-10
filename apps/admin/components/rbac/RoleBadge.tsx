/**
 * RoleBadge Component
 *
 * Displays an admin user's role with semantic colors and icons.
 */

import { Badge } from '@/components/ui/badge';
import { AdminRole } from '@/types/admin';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface RoleBadgeProps {
  role: AdminRole;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  showIcon = true,
  showLabel = true,
  className
}: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as LucideIcon;

  return (
    <Badge
      variant={config.color as 'default' | 'destructive' | 'outline' | 'secondary'}
      className={cn('inline-flex items-center gap-1.5', className)}
    >
      {showIcon && IconComponent && (
        <IconComponent className="h-3 w-3" />
      )}
      {showLabel && config.label}
    </Badge>
  );
}

/**
 * Compact role badge (icon only with tooltip)
 */
export function CompactRoleBadge({ role }: { role: AdminRole }) {
  const config = ROLE_CONFIG[role];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as LucideIcon;

  return (
    <div
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted"
      title={config.label}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
    </div>
  );
}
