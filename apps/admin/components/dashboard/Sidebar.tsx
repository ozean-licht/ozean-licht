'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
  Video,
  UsersRound,
  Baby,
  CheckCircle2,
  BookOpen,
  FileText,
  Settings,
  Lock,
  Table
} from 'lucide-react';
import { NavigationSection, UserEntity, EntityScope } from '@/types/navigation';
import { canAccessRoute } from '@/lib/rbac/constants';
import type { AdminRole } from '@/types/admin';
import EntitySwitcher from './EntitySwitcher';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEntityScope: EntityScope;
  currentEntity: UserEntity;
  availableEntities: UserEntity[];
  onEntitySwitch: (entityId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userRole?: AdminRole;
}

export default function Sidebar({
  isOpen,
  onClose,
  userEntityScope,
  currentEntity,
  availableEntities,
  onEntitySwitch,
  isCollapsed = false,
  onToggleCollapse,
  userRole,
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
          icon: LayoutDashboard,
        },
        {
          label: 'Users',
          href: '/dashboard/users',
          icon: Users,
        },
        {
          label: 'System Health',
          href: '/health',
          icon: Activity,
        },
        {
          label: 'Analytics',
          href: '/dashboard/analytics',
          icon: BarChart3,
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
          icon: Video,
        },
        {
          label: 'Parents',
          href: '/dashboard/kids-ascension/parents',
          icon: UsersRound,
        },
        {
          label: 'Kids',
          href: '/dashboard/kids-ascension/kids',
          icon: Baby,
        },
        {
          label: 'Moderation',
          href: '/dashboard/kids-ascension/moderation',
          icon: CheckCircle2,
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
          icon: BookOpen,
        },
        {
          label: 'Members',
          href: '/dashboard/ozean-licht/members',
          icon: Users,
        },
        {
          label: 'Content',
          href: '/dashboard/ozean-licht/content',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Account',
          href: '/dashboard/settings/account',
          icon: Settings,
        },
        {
          label: 'Team',
          href: '/dashboard/settings/team',
          icon: Users,
        },
        {
          label: 'Permissions',
          href: '/dashboard/permissions',
          icon: Lock,
        },
      ],
    },
    {
      title: 'Examples',
      items: [
        {
          label: 'Data Table Demo',
          href: '/dashboard/examples/data-table',
          icon: Table,
        },
      ],
    },
  ];

  // Filter sections based on user's entity scope and role
  const visibleSections = navigationSections
    .map((section) => {
      // Filter sections by entity scope first
      if (section.entityScope && userEntityScope !== 'all' && section.entityScope !== userEntityScope) {
        return null;
      }

      // Filter navigation items by role-based access
      if (userRole) {
        const filteredItems = section.items.filter((item) => canAccessRoute(userRole, item.href));
        if (filteredItems.length === 0) {
          return null; // Hide entire section if no items are accessible
        }
        return { ...section, items: filteredItems };
      }

      return section;
    })
    .filter((section): section is NavigationSection => section !== null);

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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/images/ozean-licht-logo.webp"
                alt="Ozean Licht"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />
              {!isCollapsed && (
                <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Admin
                </span>
              )}
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              aria-label="Close sidebar"
              type="button"
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
          <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Primary navigation">
            <div className="space-y-8">
              {visibleSections.map((section) => (
                <div key={section.title}>
                  {!isCollapsed && (
                    <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  )}
                  <div className={`${!isCollapsed ? 'mt-3' : ''} space-y-1`} role="list">
                    {section.items.map((item) => {
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onClose()} // Close mobile sidebar on navigation
                          role="listitem"
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          {item.icon && (
                            <item.icon className={`w-5 h-5 text-gray-400 ${isCollapsed ? '' : 'mr-3'}`} />
                          )}
                          {!isCollapsed && <span>{item.label}</span>}
                          {!isCollapsed && item.badge && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
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

          {/* Collapse toggle button (desktop only) */}
          {onToggleCollapse && (
            <div className="hidden md:flex p-4 border-t border-gray-200 dark:border-gray-700 justify-center">
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          )}

          {/* Entity switcher at bottom */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <EntitySwitcher
                currentEntity={currentEntity}
                availableEntities={availableEntities}
                onEntitySwitch={onEntitySwitch}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
