'use client';

/**
 * User Filter Component
 * Filters calendar events by user for the Ozean Licht team calendar
 *
 * Features:
 * - Dropdown/popover interface with user selection
 * - Extract unique users from events array
 * - "All Users" option to clear filter
 * - Glass morphism styling consistent with calendar design
 * - German labels for UI text
 *
 * @module UserFilter
 */

import * as React from 'react';
import Image from 'next/image';
import { Users, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { IUser } from './types';

/**
 * Props for UserFilter component
 */
export interface UserFilterProps {
  /** Array of unique users to filter by */
  users: IUser[];
  /** Currently selected user ID, undefined for "All Users" */
  selectedUserId?: string;
  /** Callback when user selection changes */
  onSelect: (userId: string | undefined) => void;
  /** Optional loading state to show skeleton/spinner */
  isLoading?: boolean;
}

/**
 * UserFilter Component
 *
 * Provides a popover-based filter for selecting a specific user or viewing all users.
 * Integrates with CalendarContext through the onSelect callback.
 *
 * Layout:
 * - Trigger button: Shows "Benutzer filtern" or selected user name
 * - Popover content: List of users with checkmark for selected user
 * - "Alle Benutzer" option at the top to clear filter
 *
 * @param props - Component props
 * @returns User filter dropdown component
 *
 * @example
 * ```tsx
 * const { events, setFilters, filters } = useCalendar();
 * const uniqueUsers = getUniqueUsers(events);
 *
 * <UserFilter
 *   users={uniqueUsers}
 *   selectedUserId={filters.userId}
 *   onSelect={(userId) => setFilters({ userId })}
 * />
 * ```
 */
export function UserFilter({ users, selectedUserId, onSelect, isLoading = false }: UserFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());

  // Find the currently selected user for display
  const selectedUser = React.useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [users, selectedUserId]
  );

  /**
   * Handle user selection
   * @param userId - User ID to select, undefined for "All Users"
   */
  const handleSelect = (userId: string | undefined) => {
    onSelect(userId);
    setOpen(false);
  };

  /**
   * Handle image load error
   * @param userId - User ID whose image failed to load
   */
  const handleImageError = (userId: string) => {
    setImageErrors((prev) => new Set(prev).add(userId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="glass-card glass-hover hover:bg-primary/10 font-normal justify-between min-w-[160px]"
          aria-label="Benutzer filtern"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-normal truncate">
              {isLoading ? 'Lädt...' : selectedUser ? selectedUser.name : 'Benutzer filtern'}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              open && 'transform rotate-180'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="glass-card w-64 p-2" align="end">
        <div className="space-y-1">
          {/* "All Users" option */}
          <button
            onClick={() => handleSelect(undefined)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-normal',
              'transition-colors duration-200',
              'hover:bg-primary/10 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              !selectedUserId && 'bg-primary/10 text-primary'
            )}
            aria-label="Alle Benutzer anzeigen"
          >
            <span>Alle Benutzer</span>
            {!selectedUserId && <Check className="w-4 h-4" />}
          </button>

          {/* Divider */}
          {users.length > 0 && (
            <div className="h-px bg-border my-2" />
          )}

          {/* Individual user options */}
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-normal',
                'transition-colors duration-200',
                'hover:bg-primary/10 hover:text-primary',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                selectedUserId === user.id && 'bg-primary/10 text-primary'
              )}
              aria-label={`Benutzer ${user.name} auswählen`}
            >
              <div className="flex items-center gap-2 truncate">
                {user.picturePath && !imageErrors.has(user.id) ? (
                  <Image
                    src={user.picturePath}
                    alt={user.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover"
                    onError={() => handleImageError(user.id)}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="truncate">{user.name}</span>
              </div>
              {selectedUserId === user.id && <Check className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}

          {/* Loading state */}
          {isLoading && (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              Lade Benutzer...
            </div>
          )}

          {/* Empty state when no users and not loading */}
          {!isLoading && users.length === 0 && (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              Keine Benutzer gefunden
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
