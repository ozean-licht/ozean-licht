import { requireAuth } from '@/lib/auth-utils'
import DashboardLayoutClient from './layout-client'
import { EntityScope, UserEntity } from '@/types/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  // Map user data to entity-aware format
  const userEntityScope: EntityScope =
    session.user.entityScope === 'kids_ascension' ? 'kids_ascension' :
    session.user.entityScope === 'ozean_licht' ? 'ozean_licht' :
    'all'

  // Mock available entities (in production, this would come from the database)
  const currentEntity: UserEntity = {
    entityId: session.user.entityScope || 'all',
    entityName:
      session.user.entityScope === 'kids_ascension' ? 'Kids Ascension' :
      session.user.entityScope === 'ozean_licht' ? 'Ozean Licht' :
      'All Entities',
    role: session.user.adminRole,
  }

  // For super admins, show all available entities
  const availableEntities: UserEntity[] =
    userEntityScope === 'all'
      ? [
          {
            entityId: 'kids_ascension',
            entityName: 'Kids Ascension',
            role: session.user.adminRole,
          },
          {
            entityId: 'ozean_licht',
            entityName: 'Ozean Licht',
            role: session.user.adminRole,
          },
        ]
      : [currentEntity]

  return (
    <DashboardLayoutClient
      user={session.user}
      userEntityScope={userEntityScope}
      currentEntity={currentEntity}
      availableEntities={availableEntities}
    >
      {children}
    </DashboardLayoutClient>
  )
}
