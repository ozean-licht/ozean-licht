'use client';

import Link from 'next/link'
import { Menu } from 'lucide-react'
import LogoutButton from '../auth/LogoutButton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  user: {
    email: string
    adminRole: string
    entityScope: string | null
  }
  onMenuToggle?: () => void
}

function getUserInitials(email: string): string {
  const name = email.split('@')[0]
  const parts = name.split(/[._-]/).filter(Boolean)

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  const initials = getUserInitials(user.email)

  return (
    <header className="bg-background border-b">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.adminRole}
                  {user.entityScope && (
                    <span className="ml-2">
                      ({user.entityScope})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
