import { requireAuth } from '@/lib/auth-utils'
import { RoleBadge } from '@/components/rbac/RoleBadge'
import SpanBadge from '@/components/ui/span-badge'
import type { AdminRole } from '@/types/admin'

export const metadata = {
  title: 'Dashboard - Admin Dashboard',
  description: 'Admin dashboard home',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await requireAuth()
  const { user } = session

  return (
    <div className="min-h-screen bg-[#00070F] px-4 py-6 sm:px-6 lg:px-8">
      {/* Error Messages */}
      {searchParams.error === 'route_not_allowed' && (
        <div className="glass-card border-destructive/40 bg-destructive/10 p-6 mb-8 rounded-2xl">
          <h3 className="text-base font-sans font-medium text-destructive">Access Denied</h3>
          <p className="text-sm font-sans text-destructive/80 mt-2">
            You do not have permission to access that page. Your role is{' '}
            <RoleBadge role={user.adminRole as AdminRole} className="ml-1" />
          </p>
        </div>
      )}

      {searchParams.error === 'insufficient_role' && (
        <div className="glass-card border-destructive/40 bg-destructive/10 p-6 mb-8 rounded-2xl">
          <h3 className="text-base font-sans font-medium text-destructive">Insufficient Permissions</h3>
          <p className="text-sm font-sans text-destructive/80 mt-2">
            Your current role does not have sufficient permissions for that action.
          </p>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-decorative text-white mb-3">
          Welcome to Ozean Licht
        </h1>
        <p className="text-lg font-sans text-white/90 flex items-center gap-3">
          <span className="text-white/90">Logged in as</span>
          <span className="text-primary-400">{user.email}</span>
        </p>
        <div className="mt-4">
          <SpanBadge icon="star" text={user.adminRole} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className="glass-card glass-hover overflow-hidden rounded-2xl">
          <div className="px-6 py-6">
            <dt className="text-sm font-sans font-medium text-white/90 mb-3">
              Admin Role
            </dt>
            <dd className="mt-2">
              <RoleBadge role={user.adminRole as AdminRole} />
            </dd>
          </div>
        </div>

        <div className="glass-card glass-hover overflow-hidden rounded-2xl">
          <div className="px-6 py-6">
            <dt className="text-sm font-sans font-medium text-white/90 mb-3">
              Entity Scope
            </dt>
            <dd className="mt-2 text-3xl font-sans font-semibold text-primary-400">
              {user.entityScope || 'All Platforms'}
            </dd>
          </div>
        </div>

        <div className="glass-card glass-hover overflow-hidden rounded-2xl">
          <div className="px-6 py-6">
            <dt className="text-sm font-sans font-medium text-white/90 mb-3">
              Permissions
            </dt>
            <dd className="mt-2 text-3xl font-sans font-semibold text-primary-400">
              {user.permissions.length}
            </dd>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-6 border-b border-primary/20">
          <h2 className="text-2xl font-decorative text-white">Your Permissions</h2>
          <p className="mt-2 text-sm font-sans text-white/90">
            These permissions control what actions you can perform in the admin dashboard
          </p>
        </div>
        <ul className="divide-y divide-primary/10">
          {user.permissions.map((perm, index) => (
            <li
              key={index}
              className="px-6 py-5 bg-[#00111A] border border-[#0E282E] hover:bg-primary/5 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <code className="text-sm font-mono text-primary-300">{perm}</code>
                  {perm === '*' && (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-primary-500/20 text-primary-300 border border-primary-400/30">
                      Super Admin
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
