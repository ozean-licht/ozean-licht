'use client';

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LightRays, Button, cn } from '@/lib/ui'
import Link from 'next/link'
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
} from 'lucide-react'
import { Breadcrumb } from '@/components/dashboard/Breadcrumb'
import { BreadcrumbProvider } from '@/lib/contexts/BreadcrumbContext'
import { useKeyboardShortcuts } from '@/lib/navigation/keyboard-shortcuts'
import { EntityScope, UserEntity } from '@/types/navigation'
import type { AdminRole } from '@/types/admin'

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
  userEntityScope,
  currentEntity,
  availableEntities,
}: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define admin navigation items
  const adminNavigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Übersicht & Statistik"
    },
    {
      label: "Users",
      href: "/dashboard/access/users",
      icon: Users,
      description: "Benutzerverwaltung"
    },
    {
      label: "Permissions",
      href: "/dashboard/access/permissions",
      icon: Lock,
      description: "Berechtigungen"
    },
    {
      label: "System Health",
      href: "/dashboard/system/health",
      icon: Activity,
      description: "Systemstatus"
    },
    {
      label: "Projects",
      href: "/dashboard/tools/projects",
      icon: FolderKanban,
      description: "Projektmanagement"
    },
    {
      label: "Cloud Storage",
      href: "/dashboard/tools/cloud",
      icon: Cloud,
      description: "Ozean Cloud"
    },
    {
      label: "Components",
      href: "/dashboard/tools/components",
      icon: Blocks,
      description: "UI Komponenten"
    },
    {
      label: "Documentation",
      href: "/dashboard/tools/docs",
      icon: BookOpen,
      description: "Dokumentation"
    }
  ]

  // Set up global keyboard shortcuts
  useKeyboardShortcuts({
    onClose: () => {},
    onGoHome: () => router.push('/dashboard'),
  })

  return (
    <BreadcrumbProvider>
      <div className="relative min-h-screen bg-[#00070F]">
        {/* LightRays Background - Fullscreen Widespread Variant */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#0ec2bc"
            raysSpeed={1}
            lightSpread={3}
            rayLength={2.5}
            pulsating={false}
            fadeDistance={1.5}
            saturation={1.0}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.0}
            distortion={0.0}
            className="opacity-30"
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
              {isSidebarOpen ? (
                <h1 className="text-xl font-decorative text-primary">Ozean Licht</h1>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">OL</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {adminNavigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3 px-3 text-left transition-all duration-300 rounded-xl",
                        "hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30"
                          : "border border-transparent",
                        !isSidebarOpen && "justify-center"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-primary/20 shadow-lg shadow-primary/20"
                          : "bg-[#0E282E]/50"
                      )}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                      </div>
                      {isSidebarOpen && (
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className={cn(
                            "text-sm font-light truncate transition-all duration-300",
                            isActive && "font-normal"
                          )}>
                            {item.label}
                          </span>
                          <span className={cn(
                            "text-xs font-light truncate transition-all duration-300",
                            isActive ? "text-primary/70" : "text-muted-foreground"
                          )}>
                            {item.description}
                          </span>
                        </div>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>

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
                  <h1 className="text-xl font-decorative text-primary">Ozean Licht</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                  {adminNavigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-auto py-3 px-3 text-left transition-all duration-300 rounded-xl",
                            "hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary",
                            isActive
                              ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30"
                              : "border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg transition-all duration-300",
                            isActive
                              ? "bg-primary/20 shadow-lg shadow-primary/20"
                              : "bg-[#0E282E]/50"
                          )}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="text-sm font-light truncate">{item.label}</span>
                            <span className="text-xs font-light truncate text-muted-foreground">{item.description}</span>
                          </div>
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
