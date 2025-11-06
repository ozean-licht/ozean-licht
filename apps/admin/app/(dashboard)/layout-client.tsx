'use client';

import { useState } from 'react'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import { EntityScope, UserEntity } from '@/types/navigation'

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={handleCloseSidebar}
          userEntityScope={userEntityScope}
          currentEntity={currentEntity}
          availableEntities={availableEntities}
          onEntitySwitch={handleEntitySwitch}
        />

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Header user={user} onMenuToggle={handleMenuToggle} />
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
