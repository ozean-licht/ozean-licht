/**
 * RoleSelect Component
 *
 * Dropdown selector for assigning admin roles.
 */

'use client';

import { AdminRole } from '@/types/admin';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RoleSelectProps {
  value: AdminRole;
  onChange: (value: AdminRole) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({ value, onChange, disabled, className }: RoleSelectProps) {
  const roles: AdminRole[] = ['super_admin', 'ka_admin', 'ol_admin', 'support'];

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AdminRole)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => {
          const config = ROLE_CONFIG[role];
          const IconComponent = Icons[config.icon as keyof typeof Icons] as LucideIcon;

          return (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <div>
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
