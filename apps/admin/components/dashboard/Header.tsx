'use client';

import Link from 'next/link'
import LogoutButton from '../auth/LogoutButton'
import { RoleBadge } from '@/components/rbac/RoleBadge'
import { EntityBadge } from '@/components/rbac/EntityBadge'
import type { AdminRole } from '@/types/admin'

interface HeaderProps {
  user: {
    email: string
    adminRole: string
    entityScope: string | null
  }
  onMenuToggle?: () => void
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Toggle menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <RoleBadge role={user.adminRole as AdminRole} />
                {user.entityScope && (
                  <EntityBadge
                    entity={user.entityScope as 'kids_ascension' | 'ozean_licht'}
                    compact
                  />
                )}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
