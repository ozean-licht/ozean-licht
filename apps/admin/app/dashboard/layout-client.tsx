'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LightRays, Button, cn } from '@/lib/ui'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  Activity,
  Lock,
  FolderKanban,
  Cloud,
  Blocks,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Heart,
  Share2,
  PenTool,
  GraduationCap,
  CreditCard,
  HelpCircle,
  TicketCheck,
  Video,
} from 'lucide-react'
import { Breadcrumb } from '@/components/dashboard/Breadcrumb'
import { BreadcrumbProvider } from '@/lib/contexts/BreadcrumbContext'
import { useKeyboardShortcuts } from '@/lib/navigation/keyboard-shortcuts'
import { EntityScope, UserEntity } from '@/types/navigation'
// AdminRole type available from @/types/admin if needed

interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: {
    email: string
    adminRole: string
    entityScope: string | null
  }
  userEntityScope: EntityScope
  currentEntity: UserEntity
  availableEntities: UserEntity[]
}

export default function DashboardLayoutClient({
  children,
  user,
  userEntityScope: _userEntityScope,
  currentEntity: _currentEntity,
  availableEntities: _availableEntities,
}: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [bgVariant, setBgVariant] = useState<'widespread' | 'default' | 'subtle'>('default')

  // LightRays background variants
  const bgVariants = {
    widespread: {
      lightSpread: 3,
      rayLength: 2.5,
      fadeDistance: 1.5,
      opacity: 'opacity-30',
    },
    default: {
      lightSpread: 2,
      rayLength: 1.8,
      fadeDistance: 1.2,
      opacity: 'opacity-25',
    },
    subtle: {
      lightSpread: 1,
      rayLength: 1.2,
      fadeDistance: 0.8,
      opacity: 'opacity-15',
    },
  }

  // Define admin navigation items
  const adminNavigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/dashboard/access/users",
      icon: Users,
    },
    {
      label: "Permissions",
      href: "/dashboard/access/permissions",
      icon: Lock,
    },
    {
      label: "System Health",
      href: "/dashboard/system/health",
      icon: Activity,
    },
    {
      label: "Projects",
      href: "/dashboard/tools/projects",
      icon: FolderKanban,
    },
    {
      label: "Ozean Cloud",
      href: "/dashboard/tools/cloud",
      icon: Cloud,
    },
    {
      label: "Courses",
      href: "/dashboard/courses",
      icon: GraduationCap,
    },
    {
      label: "Videos",
      href: "/dashboard/content/videos",
      icon: Video,
    },
    {
      label: "Blog Writer",
      href: "/dashboard/blog",
      icon: PenTool,
    },
    {
      label: "Social Media",
      href: "/dashboard/social",
      icon: Share2,
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      label: "Support",
      href: "/dashboard/support",
      icon: Heart,
    },
    {
      label: "Help Center",
      href: "/dashboard/help",
      icon: HelpCircle,
    },
    {
      label: "App Tickets",
      href: "/dashboard/tickets",
      icon: TicketCheck,
    },
    {
      label: "Components",
      href: "/dashboard/tools/components",
      icon: Blocks,
    },
    {
      label: "Documentation",
      href: "/dashboard/tools/docs",
      icon: BookOpen,
    },
  ]

  // Set up global keyboard shortcuts
  useKeyboardShortcuts({
    onClose: () => {},
    onGoHome: () => router.push('/dashboard'),
  })

  return (
    <BreadcrumbProvider>
      <div className="relative min-h-screen bg-[#00070F]">
        {/* LightRays Background - Dynamic Variant */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#0ec2bc"
            raysSpeed={1}
            lightSpread={bgVariants[bgVariant].lightSpread}
            rayLength={bgVariants[bgVariant].rayLength}
            pulsating={false}
            fadeDistance={bgVariants[bgVariant].fadeDistance}
            saturation={1.0}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.0}
            distortion={0.0}
            className={bgVariants[bgVariant].opacity}
          />
        </div>

        {/* Main Layout */}
        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className={cn(
            "hidden md:flex fixed left-0 top-0 bottom-0 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex-col transition-all duration-300 z-40",
            isSidebarOpen ? "w-64" : "w-16"
          )}>
            {/* Logo */}
            <div className="p-4 border-b border-[#0E282E]">
              <Link href="/dashboard" className="block">
                {isSidebarOpen ? (
                  <Image
                    src="/images/Ozean_Licht_Akadmie_Sidebar_1530px.webp"
                    alt="Ozean Licht"
                    width={220}
                    height={60}
                    className="w-full h-auto object-contain"
                    priority
                  />
                ) : (
                  <Image
                    src="/images/masterkey-icon.png"
                    alt="OL"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
              {adminNavigationItems.map((item) => {
                const Icon = item.icon
                // Dashboard only active on exact match, others use startsWith
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-9 px-3 text-left transition-all duration-300 rounded-lg",
                        "hover:bg-[#0E282E] hover:text-primary",
                        isActive
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "border border-transparent text-white/70",
                        !isSidebarOpen && "justify-center"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-white/50"
                      )} />
                      {isSidebarOpen && (
                        <span className={cn(
                          "text-sm truncate",
                          isActive ? "font-medium" : "font-light"
                        )}>
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Background Switcher - Only visible when expanded */}
            {isSidebarOpen && (
              <div className="p-3 border-t border-[#0E282E]">
                <p className="text-xs text-white/40 mb-2 px-1">Background</p>
                <div className="flex gap-1 rounded-xl bg-[#0A1A1A] p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-1px_-1px_2px_rgba(14,194,188,0.05)]">
                  <button
                    onClick={() => setBgVariant('widespread')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs transition-all duration-300",
                      bgVariant === 'widespread'
                        ? "bg-[#0E282E] text-primary shadow-[2px_2px_4px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(14,194,188,0.1)]"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    Wide
                  </button>
                  <button
                    onClick={() => setBgVariant('default')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs transition-all duration-300",
                      bgVariant === 'default'
                        ? "bg-[#0E282E] text-primary shadow-[2px_2px_4px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(14,194,188,0.1)]"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setBgVariant('subtle')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs transition-all duration-300",
                      bgVariant === 'subtle'
                        ? "bg-[#0E282E] text-primary shadow-[2px_2px_4px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(14,194,188,0.1)]"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    Subtle
                  </button>
                </div>
              </div>
            )}

            {/* Collapse Toggle */}
            <div className="p-2 border-t border-[#0E282E]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full"
              >
                {isSidebarOpen ? (
                  <>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#0A1A1A]/95 backdrop-blur-md border-r border-[#0E282E] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Mobile Header */}
                <div className="p-4 border-b border-[#0E282E] flex items-center justify-between">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image
                      src="/images/Ozean_Licht_Akadmie_Sidebar_1530px.webp"
                      alt="Ozean Licht"
                      width={160}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                  {adminNavigationItems.map((item) => {
                    const Icon = item.icon
                    // Dashboard only active on exact match, others use startsWith
                    const isActive = item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-9 px-3 text-left transition-all duration-300 rounded-lg",
                            "hover:bg-[#0E282E] hover:text-primary",
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "border border-transparent text-white/70"
                          )}
                        >
                          <Icon className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-white/50"
                          )} />
                          <span className={cn(
                            "text-sm truncate",
                            isActive ? "font-medium" : "font-light"
                          )}>
                            {item.label}
                          </span>
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-300",
            isSidebarOpen ? "md:ml-64" : "md:ml-16"
          )}>
            {/* Header */}
            <header className="bg-[#0A1A1A]/80 backdrop-blur-md border-b border-[#0E282E] px-4 py-3 flex items-center justify-between z-30">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <span className="text-sm text-[#C4C8D4]">{user.email}</span>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  {/* Breadcrumb navigation */}
                  <Breadcrumb showHomeIcon showEntityBadges />

                  {/* Page content */}
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  )
}
