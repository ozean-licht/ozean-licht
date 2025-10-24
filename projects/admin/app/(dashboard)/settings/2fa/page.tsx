import { requireAuth } from '@/lib/auth-utils'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Two-Factor Authentication - Admin Dashboard',
  description: 'Set up two-factor authentication',
}

export default async function TwoFactorAuthPage() {
  const session = await requireAuth()

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your admin account by enabling two-factor authentication.
            When enabled, you'll need to provide a verification code in addition to your password when signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="border-yellow-200 bg-yellow-50 text-yellow-900">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription>
              <h3 className="font-medium mb-2">Feature Coming Soon</h3>
              <p className="text-sm">
                Two-factor authentication setup will be available in a future update.
                This page serves as a placeholder for the upcoming feature.
              </p>
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="text-sm font-medium mb-3">Planned Features:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="ml-3 text-sm text-muted-foreground">
                  Time-based One-Time Password (TOTP) support via authenticator apps
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="ml-3 text-sm text-muted-foreground">
                  QR code generation for easy authenticator app setup
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="ml-3 text-sm text-muted-foreground">
                  Backup recovery codes for account access if device is lost
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="ml-3 text-sm text-muted-foreground">
                  SMS-based 2FA as an alternative verification method
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="ml-3 text-sm text-muted-foreground">
                  Enforce 2FA for specific admin roles (e.g., super_admin)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <Button variant="secondary" disabled>
              Enable 2FA (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <dt className="text-sm font-medium text-muted-foreground truncate">
                  2FA Status
                </dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-semibold text-destructive">Disabled</span>
                  <Badge variant="destructive">Not Active</Badge>
                </dd>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <dt className="text-sm font-medium text-muted-foreground truncate">
                  Account Type
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-primary">
                  {session.user.adminRole}
                </dd>
              </CardContent>
            </Card>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
