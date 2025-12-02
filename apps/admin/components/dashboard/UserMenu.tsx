'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RoleBadge } from '@/components/rbac/RoleBadge';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import type { AdminRole } from '@/types/admin';
import { Settings, User, Inbox, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: {
    email: string;
    adminRole: string;
    entityScope: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('[UserMenu] Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Get initials for avatar
  const initials = user.email
    .split('@')[0]
    .split('.')
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="User menu"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-medium">
            {initials}
          </div>

          {/* Email (hidden on small screens) */}
          <span className="hidden sm:block text-sm text-white/90 max-w-[150px] truncate">
            {user.email}
          </span>

          <ChevronDown className="w-4 h-4 text-white/60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-[#00111A] border-primary/20 backdrop-blur-xl"
      >
        {/* User info header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-white">{user.email}</p>
            <div className="flex items-center gap-2">
              <RoleBadge role={user.adminRole as AdminRole} />
              {user.entityScope && (
                <EntityBadge
                  entity={user.entityScope as 'kids_ascension' | 'ozean_licht'}
                  compact
                />
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-primary/20" />

        {/* Menu items */}
        <DropdownMenuItem
          className="cursor-pointer text-white/80 hover:text-white hover:bg-primary/10 focus:bg-primary/10 focus:text-white"
          onClick={() => router.push('/dashboard/account/profile')}
        >
          <User className="w-4 h-4 mr-2 text-primary" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-white/80 hover:text-white hover:bg-primary/10 focus:bg-primary/10 focus:text-white"
          onClick={() => router.push('/dashboard/account/inbox')}
        >
          <Inbox className="w-4 h-4 mr-2 text-primary" />
          Inbox
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-white/80 hover:text-white hover:bg-primary/10 focus:bg-primary/10 focus:text-white"
          onClick={() => router.push('/dashboard/account/settings')}
        >
          <Settings className="w-4 h-4 mr-2 text-primary" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-primary/20" />

        <DropdownMenuItem
          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
