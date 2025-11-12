/**
 * DashboardLayout Component
 *
 * A complete dashboard layout using Catalyst SidebarLayout with sidebar navigation,
 * navbar, and main content area. Optimized for admin interfaces.
 *
 * @example
 * import { DashboardLayout } from '@ozean-licht/shared-ui/compositions'
 *
 * <DashboardLayout
 *   sidebar={<YourSidebar />}
 *   navbar={<YourNavbar />}
 * >
 *   <YourContent />
 * </DashboardLayout>
 */

'use client'


import { SidebarLayout } from '../../catalyst/layouts/sidebar-layout'
import { cn } from '../../utils/cn'
import type { DashboardLayoutProps } from '../types'

export function DashboardLayout({
  children,
  sidebar,
  navbar,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-[var(--background)]', className)}>
      <SidebarLayout
        navbar={navbar}
        sidebar={sidebar}
      >
        {children}
      </SidebarLayout>
    </div>
  )
}

DashboardLayout.displayName = 'DashboardLayout'
