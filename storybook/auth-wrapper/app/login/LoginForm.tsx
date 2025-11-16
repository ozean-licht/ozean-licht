'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/storybook'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('[LoginForm] Error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="mb-6">
          <img
            src="/ol-logo.png"
            alt="Ozean Licht"
            className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(14,194,188,0.3)]"
          />
        </div>

        <h1 className="text-center font-semibold text-3xl text-white drop-shadow-[0_0_12px_rgba(14,194,188,0.4)] mb-2">
          Component Library
        </h1>
        <p className="text-center text-sm text-white/60">
          Admin access required
        </p>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4" role="alert">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 bg-[#001A2C]/50 border border-[#0E282E] placeholder-white/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ec2bc] focus:border-transparent transition-all"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 bg-[#001A2C]/50 border border-[#0E282E] placeholder-white/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ec2bc] focus:border-transparent transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#0ec2bc] to-[#055D75] hover:from-[#0ec2bc]/90 hover:to-[#055D75]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ec2bc] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0ec2bc]/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in to Storybook'
            )}
          </button>
        </div>

        <div className="text-xs text-center text-white/50 border-t border-white/10 pt-4">
          <p>
            Requires admin credentials from the shared-user database
          </p>
        </div>
      </form>
    </>
  )
}
