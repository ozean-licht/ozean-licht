/**
 * Proxy API Route for Storybook
 * Forwards requests to internal Storybook container
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Check authentication
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get Storybook URL
  const storybookUrl = process.env.STORYBOOK_INTERNAL_URL || 'http://10.0.1.22:6006'
  const path = params.path ? `/${params.path.join('/')}` : ''
  const targetUrl = `${storybookUrl}${path}`

  try {
    // Fetch from Storybook
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
      },
    })

    // Get response data
    const data = await response.arrayBuffer()

    // Forward response with appropriate headers
    const contentType = response.headers.get('content-type') || 'text/html'

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Storybook proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Storybook' },
      { status: 500 }
    )
  }
}
