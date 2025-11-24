"use client"

import { Button } from "../../cossui/button"
import { Menu, MenuTrigger, MenuPopup, MenuItem, MenuSeparator } from "../../cossui/menu"
import { Avatar, AvatarFallback } from "../../cossui/avatar"
import { Logo } from "../logo"
import { NavButton } from "../nav-button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface HeaderProps {
  /** Optional user object */
  user?: {
    id: string
    email: string
    created_at: string
  } | null
  /** Optional sign out handler */
  onSignOut?: () => void | Promise<void>
  /** App name */
  appName?: string
  /** Navigation items */
  navigationItems?: Array<{
    label: string
    href: string
  }>
  /** Show language picker */
  showLanguagePicker?: boolean
}

const defaultNavigationItems = [
  { label: "Home", href: "/" },
  { label: "Über Lia", href: "/about-lia" },
  { label: "Kurse", href: "/courses" },
  { label: "Kontakt", href: "/contact" }
]

/**
 * Public header component for Ozean Licht platform
 *
 * Features:
 * - Sacred geometry Logo with Soul Code Codex
 * - Navigation menu with active state styling
 * - User authentication state
 * - Rounded pill design with glassmorphism
 * - Fixed positioning at top of viewport
 *
 * @example
 * ```tsx
 * <Header
 *   appName="Ozean Licht™"
 *   navigationItems={[
 *     { label: "Home", href: "/" },
 *     { label: "About", href: "/about" }
 *   ]}
 *   user={user}
 *   onSignOut={handleSignOut}
 * />
 * ```
 */
export function Header({
  user: propUser,
  onSignOut: propOnSignOut,
  appName = "Ozean Licht™",
  navigationItems = defaultNavigationItems,
  showLanguagePicker = false
}: HeaderProps) {
  const pathname = usePathname()
  const user = propUser
  const loading = false

  const handleSignOut = async () => {
    if (propOnSignOut) {
      await propOnSignOut()
    } else {
      console.warn('Header: No onSignOut handler provided')
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-[30px] px-[6px]">
      <header className="w-full max-w-[1200px] mx-auto rounded-full border backdrop-blur-lg bg-[#00111A]/60 border-[#0E282E]">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo
              keycode="central-logo"
              size="xs"
              variant="symbol"
              className="w-10 h-10"
            />
            <h1 className="text-[#fff] text-xl tracking-wide font-decorative">
              {appName}
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-0">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <NavButton active={pathname === item.href}>
                  {item.label}
                </NavButton>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!loading && user ? (
              <Menu>
                <MenuTrigger className="p-0 h-auto bg-transparent border-none hover:bg-[#055D75] rounded-full">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </MenuTrigger>

                <MenuPopup className="w-56 bg-[#00111A]/90">
                  {/* User Info */}
                  <div className="flex items-center justify-start gap-2 p-2 border-b border-[#0E282E]">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-[#fff]">
                        {user.email.split('@')[0]}
                      </p>
                      <p className="w-[200px] truncate text-xs text-[#C4C8D4]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <MenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Dashboard
                    </Link>
                  </MenuItem>

                  <MenuItem asChild>
                    <Link href="/dashboard?tab=account" className="flex items-center gap-2">
                      Profil
                    </Link>
                  </MenuItem>

                  <MenuItem asChild>
                    <Link href="/dashboard?tab=bestellungen" className="flex items-center gap-2">
                      Bestellungen
                    </Link>
                  </MenuItem>

                  <MenuSeparator />

                  <MenuItem
                    onClick={handleSignOut}
                    className="text-[#EF4444] hover:text-[#EF4444]/90 focus:text-[#EF4444]/90"
                  >
                    Abmelden
                  </MenuItem>
                </MenuPopup>
              </Menu>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Registrieren
                  </Button>
                </Link>

                <Link href="/magic-link">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Anmelden
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
