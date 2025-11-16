import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import StorybookViewer from './StorybookViewer'

/**
 * Protected Storybook route
 *
 * Requires authentication to access. In development, proxies to Storybook dev server.
 * In production, serves static Storybook build.
 */
export default async function StorybookPage({
  params,
}: {
  params: { path?: string[] }
}) {
  // Check authentication
  const session = await auth()

  if (!session) {
    // Preserve the intended path for after login
    const intendedPath = params.path ? `/storybook/${params.path.join('/')}` : '/storybook'
    redirect(`/login?callbackUrl=${encodeURIComponent(intendedPath)}`)
  }

  // Render Storybook viewer (client component handles iframe/proxy logic)
  return <StorybookViewer path={params.path} session={session} />
}
