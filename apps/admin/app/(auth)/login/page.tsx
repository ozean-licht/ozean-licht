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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#00070F]">
      <div className="max-w-md w-full space-y-8">
        <div className="glass-card-strong rounded-2xl py-8 px-4 sm:px-10 bg-[#00111A] border border-[#0E282E]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
