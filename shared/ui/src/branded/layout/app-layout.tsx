"use client"

import { useState, type ReactNode } from "react"
import { AppHeader, type AppHeaderProps } from "./app-header"
import { AppSidebar, type AppSidebarProps } from "./app-sidebar"
import { cn } from "../../lib/utils"

export interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
  customSidebar?: ReactNode
  showSidebarToggle?: boolean
  /** Custom header props */
  headerProps?: Partial<AppHeaderProps>
  /** Custom sidebar props */
  sidebarProps?: Partial<AppSidebarProps>
  /** Initial sidebar open state */
  initialSidebarOpen?: boolean
}

/**
 * Main application layout component for Ozean Licht platform
 *
 * Combines AppHeader and AppSidebar into a complete layout with:
 * - Fixed header
 * - Collapsible sidebar
 * - Main content area
 * - Responsive spacing
 *
 * @example
 * ```tsx
 * <AppLayout
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Settings' }
 *   ]}
 * >
 *   <YourContent />
 * </AppLayout>
 * ```
 */
export function AppLayout({
  children,
  breadcrumbs,
  className,
  customSidebar,
  showSidebarToggle = true,
  headerProps,
  sidebarProps,
  initialSidebarOpen = true
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen)

  return (
    <div className="min-h-screen text-foreground">
      <AppHeader
        {...headerProps}
        breadcrumbs={breadcrumbs}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={showSidebarToggle}
      />

      <div className="flex pt-[57px]">
        {customSidebar ? (
          customSidebar
        ) : (
          <AppSidebar
            {...sidebarProps}
            isOpen={sidebarOpen}
          />
        )}

        <main className={cn(
          "relative z-10 flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-16",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
