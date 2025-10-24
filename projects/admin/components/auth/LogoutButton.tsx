'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('[LogoutButton] Error:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        'Sign out'
      )}
    </Button>
  )
}
