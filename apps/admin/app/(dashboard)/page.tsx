import { requireAuth } from '@/lib/auth-utils'

export const metadata = {
  title: 'Dashboard - Admin Dashboard',
  description: 'Admin dashboard home',
}

export default async function DashboardPage() {
  const session = await requireAuth()
  const { user } = session

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.email}
        </h1>
        <p className="mt-2 text-gray-600">
          You are logged in as <span className="font-semibold">{user.adminRole}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Admin Role
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
              {user.adminRole}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Entity Scope
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
              {user.entityScope || 'All Platforms'}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Permissions
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
              {user.permissions.length}
            </dd>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Permissions</h2>
          <p className="mt-1 text-sm text-gray-600">
            These permissions control what actions you can perform in the admin dashboard
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {user.permissions.map((perm, index) => (
            <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <code className="text-sm font-mono text-gray-900">{perm}</code>
                  {perm === '*' && (
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
