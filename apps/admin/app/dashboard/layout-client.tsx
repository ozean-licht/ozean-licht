'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCloseSidebar = () => {
    setIsMobileMenuOpen(false)
  }

  const handleEntitySwitch = (entityId: string) => {
    // TODO: Implement entity switching logic
    // This will trigger data refresh and update the current entity context
    console.log('Switching to entity:', entityId)
  }

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(!isSidebarCollapsed))
    }
  }

  // Restore sidebar collapsed state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarCollapsed')
      if (stored !== null) {
        setIsSidebarCollapsed(stored === 'true')
      }
    }
  }, [])

  // Set up global keyboard shortcuts
  useKeyboardShortcuts({
    onClose: handleCloseSidebar,
    onGoHome: () => router.push('/dashboard'),
    // onSearch: () => {} // TODO: Implement search when ready
  })

  return (
    <BreadcrumbProvider>
      <div className="min-h-screen bg-[#00070F]">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={isMobileMenuOpen}
            onClose={handleCloseSidebar}
            userEntityScope={userEntityScope}
            currentEntity={currentEntity}
            availableEntities={availableEntities}
            onEntitySwitch={handleEntitySwitch}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
            userRole={user.adminRole as AdminRole}
          />

          {/* Main content area */}
          <div className="flex flex-col flex-1 w-0 overflow-hidden">
            <Header user={user} onMenuToggle={handleMenuToggle} />
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  {/* Breadcrumb navigation */}
                  <Breadcrumb showHomeIcon showEntityBadges />

                  {/* Page content */}
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </BreadcrumbProvider>
  )
}
