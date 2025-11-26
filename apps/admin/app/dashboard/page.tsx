import { requireAuth } from '@/lib/auth-utils'
import { RoleBadge } from '@/components/rbac/RoleBadge'
import { SpanBadge } from '@/lib/ui'
import type { AdminRole } from '@/types/admin'
import { ActivityChart, GrowthIndexCharts } from './DashboardCharts'
import { TrendingUp, Users as UsersIcon, Activity, Shield, Crown } from 'lucide-react'

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
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
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
        <p className="text-lg font-sans text-[#C4C8D4] flex items-center gap-3">
          <span>Logged in as</span>
          <span className="text-primary">{user.email}</span>
        </p>
        <div className="mt-4">
          <SpanBadge icon="star" text={user.adminRole} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Total Users
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                1,543
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Active Sessions
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                234
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Your Role
              </dt>
              <dd className="mt-2">
                <RoleBadge role={user.adminRole as AdminRole} />
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Permissions
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                {user.permissions.length}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <ActivityChart />

      {/* Growth Index - SuperAdmin Only */}
      {user.adminRole === 'super_admin' && (
        <div className="mb-10">
          {/* Header with SuperAdmin badge */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-decorative text-white">Growth Index</h2>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-sans font-medium text-primary">SuperAdmin Only</span>
            </div>
          </div>

          {/* Charts Grid */}
          <GrowthIndexCharts />
        </div>
      )}

      {/* Permissions List */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-6 border-b border-primary/20">
          <h2 className="text-2xl font-decorative text-white">Your Permissions</h2>
          <p className="mt-2 text-sm font-sans text-[#C4C8D4]">
            These permissions control what actions you can perform in the admin dashboard
          </p>
        </div>
        <ul className="divide-y divide-primary/10">
          {user.permissions.slice(0, 10).map((perm, index) => (
            <li
              key={index}
              className="px-6 py-5 hover:bg-primary/5 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
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
                  <code className="text-sm font-mono text-primary">{perm}</code>
                  {perm === '*' && (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-primary/20 text-primary border border-primary/30">
                      Super Admin
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
          {user.permissions.length > 10 && (
            <li className="px-6 py-4 text-center text-sm text-[#C4C8D4]">
              +{user.permissions.length - 10} more permissions
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
