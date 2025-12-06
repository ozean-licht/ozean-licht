import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getMiddlewareSession } from './lib/auth/middleware-auth'
import { canAccessRoute } from './lib/rbac/constants'
import type { AdminRole } from './types/admin'

/**
 * Next.js middleware for route protection
 * Protects dashboard routes and enforces role-based access control
 *
 * Note: Uses Edge-compatible auth check (JWT-based, no database)
 */
export async function middleware(request: NextRequest) {
  const session = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl

  // Debug logging
  console.log('[Middleware]', {
    pathname,
    hasSession: !!session,
    sessionUser: session?.user?.email,
  })

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('[Middleware] No session, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based route access control
    const userRole = session.user?.adminRole as AdminRole

    if (userRole && !canAccessRoute(userRole, pathname)) {
      // Redirect to dashboard with error message
      console.log('[Middleware] Route not allowed for role:', userRole)
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('error', 'route_not_allowed')
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Redirect authenticated users away from login
  if (pathname === '/login') {
    if (session) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard'
      console.log('[Middleware] Session exists on login page, redirecting to:', callbackUrl)
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
  }

  // Allow request to continue
  return NextResponse.next()
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth endpoints)
     * - api/public (Public API endpoints - no auth)
     * - api/widget (Widget API endpoints - no auth)
     * - hilfe (Public help center pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|api/public|api/widget|hilfe|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
