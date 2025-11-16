import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'

/**
 * Root page - redirects to Storybook if authenticated, login if not
 */
export default async function RootPage() {
  const session = await auth()

  if (session) {
    redirect('/storybook')
  } else {
    redirect('/login')
  }
}
