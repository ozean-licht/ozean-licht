import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Login - Storybook Documentation',
  description: 'Sign in to access Storybook component documentation',
}

export default async function LoginPage() {
  const session = await auth()

  // Redirect if already authenticated
  if (session) {
    redirect('/storybook')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#00070F] via-[#00111A] to-[#00070F]">
      <div className="max-w-md w-full space-y-8">
        <div className="glass-card rounded-2xl py-8 px-4 sm:px-10 bg-[#00111A]/80 backdrop-blur-xl border border-[#0E282E]/50 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
