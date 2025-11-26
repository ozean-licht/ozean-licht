/**
 * PermissionCheckbox Component
 *
 * Three-state checkbox for permission editing:
 * - inherited (role default, gray, disabled)
 * - granted (custom grant, green, editable)
 * - denied (custom deny, red, editable)
 */

'use client';

import { Checkbox, Label, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/lib/ui';
import { Shield, Check, X } from 'lucide-react';

export type PermissionCheckboxValue = 'inherited' | 'granted' | 'denied';

interface PermissionCheckboxProps {
  permission: string;
  label: string;
  value: PermissionCheckboxValue;
  onChange: (newValue: PermissionCheckboxValue) => void;
  disabled?: boolean;
  roleName?: string;
}

export function PermissionCheckbox({
  permission,
  label,
  value,
  onChange,
  disabled = false,
  roleName,
}: PermissionCheckboxProps) {
  const isInherited = value === 'inherited';
  const isGranted = value === 'granted';
  const isChecked = isInherited || isGranted;

  const handleChange = (checked: boolean) => {
    if (disabled || isInherited) return;

    // Toggle between granted and denied
    onChange(checked ? 'granted' : 'denied');
  };

  const getTooltipContent = () => {
    if (isInherited) {
      return `From role: ${roleName || 'default'}`;
    }
    if (isGranted) {
      return 'Custom grant';
    }
    return 'Custom deny (revoked)';
  };

  const getIcon = () => {
    if (isInherited) return <Shield className="h-3 w-3 text-gray-500" />;
    if (isGranted) return <Check className="h-3 w-3 text-green-600" />;
    return <X className="h-3 w-3 text-red-600" />;
  };

  const getBackgroundClass = () => {
    if (isInherited) return 'bg-gray-50 dark:bg-gray-800';
    if (isGranted) return 'bg-green-50 dark:bg-green-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center space-x-2 rounded p-2 ${getBackgroundClass()}`}
          >
            <Checkbox
              id={permission}
              checked={isChecked}
              onCheckedChange={handleChange}
              disabled={disabled || isInherited}
              className={isInherited ? 'cursor-not-allowed opacity-50' : ''}
            />
            <div className="flex items-center gap-1">
              {getIcon()}
              <Label
                htmlFor={permission}
                className={`cursor-pointer text-sm ${isInherited ? 'text-gray-600' : ''}`}
              >
                {label}
              </Label>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
