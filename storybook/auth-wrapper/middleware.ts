/**
 * Next.js Middleware for Route Protection
 *
 * Protects /storybook routes and redirects unauthenticated users to login.
 * Allows public access to /login and /api/auth routes.
 *
 * Note: Uses Edge-compatible auth check (JWT-based, no database)
 */

import { getMiddlewareSession } from '@/lib/auth/middleware-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public access to login and auth routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const session = await getMiddlewareSession(request)

  if (!session && pathname.startsWith('/storybook')) {
    // Redirect to login with callback URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from root
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/storybook', request.url))
  }

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
