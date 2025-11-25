'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@shared/ui/branded/layout'
import { Card } from '@shared/ui/cossui'
import { Loader2 } from 'lucide-react'

// DEMO MODE: Simplified auth callback that redirects to dashboard
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // In demo mode, just redirect to dashboard
    console.log('🔐 Auth Callback: Demo mode - redirecting to dashboard')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-32">
        <Card className="max-w-md mx-auto p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg">Authentifizierung läuft...</p>
            <p className="text-sm text-muted-foreground">
              Du wirst weitergeleitet...
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
