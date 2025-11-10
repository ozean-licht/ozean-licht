'use client';

import Image from 'next/image'
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
    <header className="bg-[#00111A] backdrop-blur-xl shadow-lg border-b border-primary/20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 transition-colors"
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

            {/* Logo and Title */}
            <Link href="/dashboard" className="flex items-center space-x-3 group py-2">
              <Image
                src="/images/ozean-licht-logo-horizontal.webp"
                alt="Ozean Licht"
                width={220}
                height={60}
                className="w-auto h-auto transition-all duration-300 group-hover:scale-105"
                style={{ maxWidth: '220px', height: 'auto' }}
                priority
              />
              <h1 className="text-xl md:text-2xl font-decorative text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hidden lg:block">
                Ecosystem Management
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white/90">{user.email}</p>
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
            <LogoutButton className="bg-[#0E282E] hover:bg-[#0E282E]/80 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
