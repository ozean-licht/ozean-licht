'use client';

import { UserDetail } from '@/types/user';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Calendar, Mail, Key, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserDetailCardProps {
  user: UserDetail;
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Basic account details and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <div className="font-medium">{user.email}</div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Key className="h-4 w-4" />
                User ID
              </Label>
              <div className="font-mono text-sm">{user.id}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Status</Label>
              <div>
                {user.emailVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Registered
              </Label>
              <div className="text-sm">
                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                <span className="text-muted-foreground ml-2">
                  ({user.createdAt.toLocaleDateString()})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Access
          </CardTitle>
          <CardDescription>
            Platforms this user has access to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.entities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No platform access granted
            </p>
          ) : (
            <div className="space-y-3">
              {user.entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <EntityBadge entity={entity.entityId} />
                    <div>
                      <div className="text-sm font-medium">
                        {entity.entityId === 'kids_ascension'
                          ? 'Kids Ascension'
                          : 'Ozean Licht'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Role: {entity.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {formatDistanceToNow(entity.createdAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* OAuth Providers */}
      {user.oauthProviders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              OAuth providers linked to this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.oauthProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="capitalize font-medium">{provider.provider}</div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {provider.providerUserId}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Connected {formatDistanceToNow(provider.createdAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            User activity and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium">
                {user.lastLoginAt
                  ? formatDistanceToNow(user.lastLoginAt, { addSuffix: true })
                  : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Logins</span>
              <span className="text-sm font-medium">{user.loginCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
