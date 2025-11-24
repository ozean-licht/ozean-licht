"use client"

import { Button } from "../../cossui/button"
import { Menu, MenuTrigger, MenuPopup, MenuItem, MenuSeparator } from "../../cossui/menu"
import { Avatar, AvatarFallback } from "../../cossui/avatar"
import { Logo } from "../logo"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Settings,
  LogOut,
  User,
  BookOpen,
  Bell,
  Search,
  Menu as MenuIcon,
  ChevronRight,
  FileText,
  Crown
} from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  onMenuClick?: () => void
  showSidebarToggle?: boolean
  /** Optional user object - should be provided by parent app */
  user?: {
    id: string
    email: string
    created_at: string
  } | null
  /** Optional sign out handler - should be provided by parent app */
  onSignOut?: () => void | Promise<void>
  /** App name to display next to logo */
  appName?: string
}

/**
 * Application header component for Ozean Licht platform
 *
 * Features:
 * - Sacred geometry Logo with Soul Code Codex
 * - Breadcrumb navigation
 * - Sidebar toggle
 * - Search and notifications (icon buttons)
 * - User menu with CossUI Menu dropdown
 *
 * @example
 * ```tsx
 * <AppHeader
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Settings' }
 *   ]}
 *   onMenuClick={() => setSidebarOpen(!sidebarOpen)}
 *   user={user}
 *   onSignOut={handleSignOut}
 * />
 * ```
 */
export function AppHeader({
  breadcrumbs = [],
  onMenuClick,
  showSidebarToggle = true,
  user: propUser,
  onSignOut: propOnSignOut,
  appName = "Ozean Licht™"
}: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = propUser
  const loading = false

  const handleSignOut = async () => {
    if (propOnSignOut) {
      await propOnSignOut()
    } else {
      console.warn('AppHeader: No onSignOut handler provided')
      router.push('/')
    }
  }

  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname.startsWith('/dashboard')) {
      return [
        { label: 'Dashboard', href: '/dashboard' }
      ]
    }
    if (pathname.startsWith('/courses/') && pathname.includes('/learn')) {
      const courseSlug = pathname.split('/')[2]
      return [
        { label: 'Kurse', href: '/courses' },
        { label: 'Kurs', href: `/courses/${courseSlug}` },
        { label: 'Lernen' }
      ]
    }
    return []
  }

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDefaultBreadcrumbs()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#00111A]/80 backdrop-blur-md border-b border-[#0E282E] w-full">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="text-primary hover:text-[#fff] hover:bg-[#055D75] p-2"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo
              keycode="central-logo"
              size="xs"
              variant="symbol"
              className="w-8 h-8"
            />
            <span className="text-[#fff] font-normal text-lg font-decorative">{appName}</span>
          </Link>

          {/* Breadcrumbs */}
          {displayBreadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              {displayBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-[#C4C8D4]" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-[#C4C8D4] hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-[#C4C8D4] hover:text-primary hover:bg-[#055D75]"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-[#C4C8D4] hover:text-primary hover:bg-[#055D75]"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          {!loading && user && (
            <Menu>
              <MenuTrigger className="p-0 h-auto bg-transparent border-none hover:bg-[#055D75] rounded-full">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </MenuTrigger>

              <MenuPopup className="w-56 bg-[#00111A]/90">
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-3 border-b border-[#0E282E]">
                  <Avatar size="default">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 min-w-0">
                    <p className="text-primary font-normal text-sm truncate">
                      {user.email.split('@')[0]}
                    </p>
                    <p className="text-[#C4C8D4] text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <MenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </MenuItem>

                <MenuItem asChild>
                  <Link href="/bibliothek" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Bibliothek
                  </Link>
                </MenuItem>

                <MenuItem asChild>
                  <Link href="/belege" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Belege
                  </Link>
                </MenuItem>

                <MenuItem asChild>
                  <Link href="/mitgliedschaft" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Mitgliedschaft
                  </Link>
                </MenuItem>

                <MenuSeparator />

                {/* Sign Out */}
                <MenuItem
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 focus:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </MenuItem>
              </MenuPopup>
            </Menu>
          )}
        </div>
      </div>
    </header>
  )
}
