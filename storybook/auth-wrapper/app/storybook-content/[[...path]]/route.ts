/**
 * Storybook Content Proxy Route
 * Forwards requests to internal Storybook container
 *
 * Uses /storybook-content/ path to avoid conflicts with Next.js /api/ routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  // Check authentication
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get Storybook URL
  const storybookUrl = process.env.STORYBOOK_INTERNAL_URL || 'http://10.0.1.22:6006'
  const path = params.path?.length ? `/${params.path.join('/')}` : ''
  const targetUrl = `${storybookUrl}${path}`

  try {
    // Fetch from Storybook
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
      },
    })

    // Get content type
    const contentType = response.headers.get('content-type') || 'text/html'

    // For HTML files, rewrite relative paths to fix Storybook asset loading
    if (contentType.includes('text/html')) {
      let html = await response.text()

      // Replace relative paths (./) with absolute proxy paths
      html = html.replace(/\.\//g, '/storybook-content/')

      // Replace specific Storybook paths that might not have ./ prefix
      html = html.replace(/["']iframe\.html([^"']*?)["']/g, '"/storybook-content/iframe.html$1"')
      html = html.replace(/["']index\.json["']/g, '"/storybook-content/index.json"')

      // Replace sb-manager and sb-addons paths
      html = html.replace(/["'](sb-manager\/[^"']+)["']/g, '"/storybook-content/$1"')
      html = html.replace(/["'](sb-addons\/[^"']+)["']/g, '"/storybook-content/$1"')

      return new NextResponse(html, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // For non-HTML files (JS, CSS, images, etc.), pass through as-is
    const data = await response.arrayBuffer()

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
