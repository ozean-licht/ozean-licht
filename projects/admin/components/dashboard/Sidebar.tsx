'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { NavigationSection, UserEntity, EntityScope } from '@/types/navigation';
import EntitySwitcher from './EntitySwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEntityScope: EntityScope;
  currentEntity: UserEntity;
  availableEntities: UserEntity[];
  onEntitySwitch: (entityId: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  userEntityScope,
  currentEntity,
  availableEntities,
  onEntitySwitch,
}: SidebarProps) {
  const pathname = usePathname();

  // Define navigation sections with entity awareness
  const navigationSections: NavigationSection[] = [
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/dashboard',
          icon: '📊',
        },
        {
          label: 'Analytics',
          href: '/dashboard/analytics',
          icon: '📈',
        },
      ],
    },
    {
      title: 'Kids Ascension',
      entityScope: 'kids_ascension',
      items: [
        {
          label: 'Videos',
          href: '/dashboard/kids-ascension/videos',
          icon: '🎥',
        },
        {
          label: 'Parents',
          href: '/dashboard/kids-ascension/parents',
          icon: '👨‍👩‍👧',
        },
        {
          label: 'Kids',
          href: '/dashboard/kids-ascension/kids',
          icon: '👶',
        },
        {
          label: 'Moderation',
          href: '/dashboard/kids-ascension/moderation',
          icon: '✅',
        },
      ],
    },
    {
      title: 'Ozean Licht',
      entityScope: 'ozean_licht',
      items: [
        {
          label: 'Courses',
          href: '/dashboard/ozean-licht/courses',
          icon: '📚',
        },
        {
          label: 'Members',
          href: '/dashboard/ozean-licht/members',
          icon: '👥',
        },
        {
          label: 'Content',
          href: '/dashboard/ozean-licht/content',
          icon: '📝',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Account',
          href: '/dashboard/settings/account',
          icon: '⚙️',
        },
        {
          label: 'Team',
          href: '/dashboard/settings/team',
          icon: '👨‍💼',
        },
      ],
    },
  ];

  // Filter sections based on user's entity scope
  const visibleSections = navigationSections.filter((section) => {
    if (!section.entityScope) return true; // Always show sections without entity scope
    if (userEntityScope === 'all') return true; // Super admin sees all
    return section.entityScope === userEntityScope;
  });

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                OL
              </div>
              <span className="text-xl font-semibold">
                Admin
              </span>
            </Link>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation sections */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-6">
              {visibleSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  {sectionIndex > 0 && <Separator className="my-4" />}
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {section.items.map((item) => {
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onClose()} // Close mobile sidebar on navigation
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.icon && (
                            <span className="mr-3 text-lg">{item.icon}</span>
                          )}
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Entity switcher at bottom */}
          <div className="p-4 border-t">
            <EntitySwitcher
              currentEntity={currentEntity}
              availableEntities={availableEntities}
              onEntitySwitch={onEntitySwitch}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
