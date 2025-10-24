import Link from 'next/link'
import LogoutButton from '../auth/LogoutButton'

interface HeaderProps {
  user: {
    email: string
    adminRole: string
    entityScope: string | null
  }
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </Link>
            <nav className="hidden md:flex space-x-4 ml-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/dashboard/settings/2fa"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">
                {user.adminRole}
                {user.entityScope && (
                  <span className="ml-2 text-gray-400">
                    ({user.entityScope})
                  </span>
                )}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
