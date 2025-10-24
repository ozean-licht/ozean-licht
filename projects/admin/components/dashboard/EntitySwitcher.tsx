'use client';

import { Check } from 'lucide-react';
import { UserEntity } from '@/types/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EntitySwitcherProps {
  currentEntity: UserEntity;
  availableEntities: UserEntity[];
  onEntitySwitch: (entityId: string) => void;
}

export default function EntitySwitcher({
  currentEntity,
  availableEntities,
  onEntitySwitch,
}: EntitySwitcherProps) {
  if (availableEntities.length <= 1) {
    return null; // Don't show switcher if user only has access to one entity
  }

  return (
    <Select
      value={currentEntity.entityId}
      onValueChange={onEntitySwitch}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {currentEntity.logo && (
              <AvatarImage src={currentEntity.logo} alt={currentEntity.entityName} />
            )}
            <AvatarFallback>{currentEntity.entityName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{currentEntity.entityName}</span>
            <span className="text-xs text-muted-foreground capitalize">{currentEntity.role}</span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {availableEntities.map((entity) => (
          <SelectItem key={entity.entityId} value={entity.entityId}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {entity.logo && (
                  <AvatarImage src={entity.logo} alt={entity.entityName} />
                )}
                <AvatarFallback>{entity.entityName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{entity.entityName}</span>
                <span className="text-xs text-muted-foreground capitalize">{entity.role}</span>
              </div>
              {entity.entityId === currentEntity.entityId && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
