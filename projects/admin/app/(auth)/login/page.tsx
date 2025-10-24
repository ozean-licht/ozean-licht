import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login - Admin Dashboard',
  description: 'Sign in to the admin dashboard',
}

export default async function LoginPage() {
  const session = await auth()

  // Redirect if already authenticated
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ozean Licht Ecosystem
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Kids Ascension & Ozean Licht
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure authentication powered by NextAuth
          </p>
        </div>
      </div>
    </div>
  )
}
