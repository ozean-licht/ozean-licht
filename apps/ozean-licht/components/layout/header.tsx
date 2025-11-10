"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Demo mode - no auth state needed
import { NavButton } from "./nav-button"
import { PrimaryButton } from "../primary-button"
import { LanguagePicker } from "./language-picker"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const pathname = usePathname()

  // Demo mode - no authentication
  const user = null
  const loading = false
  const handleSignOut = () => {
    alert('Demo-Modus: Abmelden nicht verfügbar')
  }
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-[30px] px-[6px]">
      <header
        className="w-full max-w-[1200px] mx-auto rounded-full border backdrop-blur-lg bg-[#001212]/60 border-[#0E282E]"
      >
        <div className="flex items-center justify-between px-3 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png"
              alt="Ozean Licht Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-white text-xl tracking-wide font-cinzel-decorative">
              Ozean Licht<span className="text-sm align-super">™</span>
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-0">
            <Link href="/">
              <NavButton active={pathname === "/"}>Home</NavButton>
            </Link>
            <Link href="/about-lia">
              <NavButton active={pathname === "/about-lia"}>Über Lia</NavButton>
            </Link>
            <Link href="/courses">
              <NavButton active={pathname === "/courses"}>Kurse</NavButton>
            </Link>
            <Link href="/contact">
              <NavButton active={pathname === "/contact"}>Kontakt</NavButton>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguagePicker />

            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.email} />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email.split('@')[0]}</p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=account" className="cursor-pointer">
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=bestellungen" className="cursor-pointer">
                      Bestellungen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    className="text-white px-8 py-2 rounded-full font-medium font-montserrat text-base bg-transparent border-none"
                    size="lg"
                  >
                    Registrieren
                  </Button>
                </Link>

                <Link href="/magic-link">
                  <PrimaryButton>Anmelden</PrimaryButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
