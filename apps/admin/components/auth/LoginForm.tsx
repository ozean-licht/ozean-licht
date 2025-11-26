'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  Input,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  Label
} from '@/lib/ui'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

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
      <div className="flex justify-center mb-8">
        <Image
          src="/images/Ozean_Licht_Akademie_480px.webp"
          alt="Ozean Licht Akademie"
          width={240}
          height={70}
          className="object-contain"
          priority
        />
      </div>

      <h1 className="text-center font-decorative text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] mb-8">
        Admin Dashboard
      </h1>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#C4C8D4] font-sans">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="admin@ozean-licht.dev"
              disabled={loading}
              size="lg"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#C4C8D4] font-sans">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              size="lg"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </div>

        <div className="text-sm text-center text-[#C4C8D4]">
          <p className="mt-2">
            Test credentials: <code className="text-xs px-2 py-1 rounded bg-[#00111A] text-primary font-mono">super@ozean-licht.dev</code>
          </p>
        </div>
      </form>
    </>
  )
}
