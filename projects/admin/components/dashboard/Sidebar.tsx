'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavigationSection, UserEntity, EntityScope } from '@/types/navigation';
import EntitySwitcher from './EntitySwitcher';

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
          label: 'System Health',
          href: '/health',
          icon: '💓',
        },
        {
          label: 'Storage',
          href: '/storage',
          icon: '💾',
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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                OL
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Admin
              </span>
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
              aria-label="Close sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation sections */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">
              {visibleSections.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {item.icon && (
                            <span className="mr-3 text-lg">{item.icon}</span>
                          )}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                              {item.badge}
                            </span>
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
          <div className="p-4 border-t border-gray-200">
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
