/**
 * PermissionBadge Component
 *
 * Visual indicator for permission state (inherited, granted, denied, wildcard)
 */

import { Badge } from '@/components/ui/badge';
import { Check, X, Asterisk, Shield } from 'lucide-react';

export type PermissionBadgeState = 'inherited' | 'granted' | 'denied' | 'wildcard';

interface PermissionBadgeProps {
  state: PermissionBadgeState;
  className?: string;
}

export function PermissionBadge({ state, className }: PermissionBadgeProps) {
  const configs = {
    inherited: {
      label: 'Role Default',
      icon: Shield,
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    granted: {
      label: 'Custom Grant',
      icon: Check,
      variant: 'default' as const,
      className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    },
    denied: {
      label: 'Denied',
      icon: X,
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    },
    wildcard: {
      label: 'Wildcard (*)',
      icon: Asterisk,
      variant: 'outline' as const,
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    },
  };

  const config = configs[state];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ''}`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
