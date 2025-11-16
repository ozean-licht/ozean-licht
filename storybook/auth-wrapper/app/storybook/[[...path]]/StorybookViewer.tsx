'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

interface StorybookViewerProps {
  path?: string[]
  session: Session
}

export default function StorybookViewer({ path, session }: StorybookViewerProps) {
  const [iframeUrl, setIframeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Construct Storybook URL
    const isDev = process.env.NODE_ENV === 'development'
    const baseUrl = isDev
      ? (process.env.NEXT_PUBLIC_STORYBOOK_DEV_URL || 'http://localhost:6006')
      : '/storybook-static'

    const pathSegment = path ? `/${path.join('/')}` : ''
    const url = `${baseUrl}${pathSegment}`

    setIframeUrl(url)
    setLoading(false)
  }, [path])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="h-screen flex flex-col bg-[#00070F]">
      {/* Top bar with logout button */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#00111A] border-b border-[#0E282E]">
        <div className="flex items-center space-x-4">
          <img
            src="/ol-sidebar-logo.webp"
            alt="Ozean Licht"
            className="h-8 w-auto object-contain"
          />
          <div className="border-l border-white/20 h-8"></div>
          <div>
            <h1 className="text-white font-semibold text-sm">Component Library</h1>
            <p className="text-white/50 text-xs">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-[#001A2C]/50 hover:bg-[#001A2C] border border-[#0E282E] rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      {/* Storybook iframe */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00070F]">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-[#0ec2bc] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-white/60">Loading Storybook...</p>
            </div>
          </div>
        ) : (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="Storybook Documentation"
            allow="clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        )}
      </div>
    </div>
  )
}
