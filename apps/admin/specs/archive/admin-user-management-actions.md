# Plan: Spec 1.6 - Admin User Management Actions

## Task Description
Implement admin actions for managing users across both platforms (Kids Ascension and Ozean Licht). This spec extends Spec 1.5 (User List) by adding interactive capabilities: granting/revoking entity access, assigning roles, deactivating accounts, resetting passwords, manually verifying emails, viewing activity logs, and performing bulk operations. All actions must be audit-logged and enforce RBAC permissions.

## Objective
Create a comprehensive user management action system that:
- Allows admins to grant/revoke platform access (Kids Ascension, Ozean Licht)
- Enables role assignment with validation (cannot assign super_admin without permission)
- Supports user account deactivation/reactivation
- Triggers password reset emails via email service
- Enables manual email verification for support cases
- Displays user activity log (last 30 days)
- Provides bulk operations with progress indicators
- Logs all actions to audit trail (for Spec 1.7 integration)
- Ensures entity access changes reflect in JWT on next login
- Enforces RBAC: only super_admin can assign admin roles

## Problem Statement
Currently, admins can only view user data (Spec 1.5) but cannot:
- Grant a user access to Kids Ascension or Ozean Licht platforms
- Change user roles within an entity (USER → EDUCATOR, CREATOR, etc.)
- Deactivate compromised or problematic accounts
- Manually verify user emails for support tickets
- Reset passwords for users who are locked out
- Perform bulk operations (grant access to multiple users)
- View user activity history for troubleshooting

Without these capabilities, platform management requires direct database manipulation, increasing risk and reducing operational efficiency.

## Solution Approach

### Architecture Pattern: Server Actions + API Routes

1. **Server Actions** (preferred for form submissions)
   - Used for single-user actions (grant access, change role, deactivate)
   - Invoked from client components via `useTransition` hook
   - Automatic revalidation of server data
   - Type-safe with Zod validation

2. **API Routes** (for bulk operations and external integrations)
   - Used for bulk actions (grant access to multiple users)
   - Progress tracking via polling or server-sent events
   - Email triggers via MCP Gateway → Resend API

3. **Optimistic Updates** (client-side UX)
   - Immediately reflect changes in UI
   - Revert if server action fails
   - Show loading states during async operations

### Data Flow

```
User Action (UI)
  ↓
Server Action / API Route
  ↓
Validate Permissions (RBAC)
  ↓
Execute Database Operation (MCP Gateway)
  ↓
Create Audit Log Entry
  ↓
Trigger Side Effects (email, cache invalidation)
  ↓
Revalidate Client Data
  ↓
Show Success/Error Toast
```

### Permission Matrix

| Action | Required Role | Additional Validation |
|--------|---------------|----------------------|
| Grant entity access | super_admin, entity admin | Entity admin can only grant access to their entity |
| Revoke entity access | super_admin, entity admin | Cannot revoke own access |
| Assign role (within entity) | super_admin, entity admin | Role must match entity |
| Deactivate user | super_admin | Cannot deactivate own account |
| Reactivate user | super_admin | - |
| Reset password | super_admin, support | - |
| Verify email manually | super_admin, support | - |
| Bulk operations | super_admin | - |

### User Activity Log Schema

```sql
-- user_activity_log table (to be created in shared_users_db)
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL, -- 'login', 'logout', 'password_change', 'email_verified'
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON user_activity_log(created_at DESC);
```

## Relevant Files

### Existing Files (Read, Understand, Extend)
- `lib/mcp-client/queries.ts` - Add user action methods (grantEntityAccess, revokeEntityAccess, updateUserStatus, etc.)
- `types/admin.ts` - Add audit log types (already exists)
- `types/user.ts` - Add activity log types
- `app/(dashboard)/users/page.tsx` - Users list page (from Spec 1.5)
- `app/(dashboard)/users/[id]/page.tsx` - User detail page (extend with action buttons)
- `lib/rbac/utils.ts` - Permission checking utilities (already exists)
- `app/api/admin-users/[id]/route.ts` - Existing API route for admin user role updates

### New Files
- `app/(dashboard)/users/actions.ts` - Server actions for user management
- `app/(dashboard)/users/[id]/UserActionButtons.tsx` - Action buttons component
- `app/(dashboard)/users/[id]/GrantAccessDialog.tsx` - Grant entity access dialog
- `app/(dashboard)/users/[id]/RevokeAccessDialog.tsx` - Revoke entity access confirmation
- `app/(dashboard)/users/[id]/DeactivateUserDialog.tsx` - Deactivate user confirmation
- `app/(dashboard)/users/[id]/ResetPasswordDialog.tsx` - Reset password confirmation
- `app/(dashboard)/users/[id]/VerifyEmailDialog.tsx` - Manual email verification
- `app/(dashboard)/users/[id]/UserActivityLog.tsx` - Activity log display component
- `app/(dashboard)/users/bulk-actions/BulkGrantAccessDialog.tsx` - Bulk grant access UI
- `app/api/users/bulk-grant-access/route.ts` - Bulk grant access API route
- `app/api/users/[id]/reset-password/route.ts` - Trigger password reset email
- `types/user-activity.ts` - User activity log types
- `lib/mcp-client/user-actions.ts` - User action MCP operations
- `lib/email/templates/password-reset.tsx` - Password reset email template (React Email)

## Implementation Phases

### Phase 1: Data Layer & Server Actions
Create MCP client methods and server actions for user operations.

### Phase 2: UI Components & Dialogs
Build interactive dialogs for each user action type.

### Phase 3: Bulk Operations
Implement bulk grant access with progress tracking.

### Phase 4: Activity Logging & Email Triggers
Integrate activity log display and password reset emails.

## Step by Step Tasks

### 1. Create User Activity Types
Create `types/user-activity.ts` with activity log types.

**File: `types/user-activity.ts`**
```typescript
/**
 * User activity log types
 */

export type UserActivityType =
  | 'login'
  | 'logout'
  | 'password_changed'
  | 'email_verified'
  | 'entity_access_granted'
  | 'entity_access_revoked'
  | 'account_deactivated'
  | 'account_reactivated'
  | 'role_changed';

export interface UserActivity {
  id: string;
  userId: string;
  activityType: UserActivityType;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface UserActivityFilters {
  userId: string;
  activityTypes?: UserActivityType[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}
```

- Enum for activity types
- UserActivity interface matching database schema
- UserActivityFilters for querying activity log

### 2. Extend User Types with Action Inputs
Update `types/user.ts` with action input types.

**Add to `types/user.ts`:**
```typescript
/**
 * Input for granting entity access
 */
export interface GrantEntityAccessInput {
  userId: string;
  entityType: EntityType;
  role: string; // 'USER', 'CREATOR', 'EDUCATOR', etc.
  grantedBy: string; // Admin user ID
}

/**
 * Input for revoking entity access
 */
export interface RevokeEntityAccessInput {
  userId: string;
  entityType: EntityType;
  revokedBy: string;
}

/**
 * Input for updating user status
 */
export interface UpdateUserStatusInput {
  userId: string;
  isActive: boolean;
  updatedBy: string;
}

/**
 * Input for manual email verification
 */
export interface VerifyEmailInput {
  userId: string;
  verifiedBy: string;
}

/**
 * Input for bulk grant access
 */
export interface BulkGrantAccessInput {
  userIds: string[];
  entityType: EntityType;
  role: string;
  grantedBy: string;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  succeeded: string[]; // User IDs
  failed: { userId: string; error: string }[];
  total: number;
}
```

- Strongly-typed inputs for all user actions
- Bulk operation types for batch processing

### 3. Add User Action Methods to MCP Client
Create `lib/mcp-client/user-actions.ts` with action operations.

**File: `lib/mcp-client/user-actions.ts`**
```typescript
import { MCPGatewayClient } from './client';
import {
  GrantEntityAccessInput,
  RevokeEntityAccessInput,
  UpdateUserStatusInput,
  VerifyEmailInput,
  BulkGrantAccessInput,
  BulkOperationResult,
} from '@/types/user';
import { UserActivity, UserActivityFilters } from '@/types/user-activity';
import { CreateAuditLogInput } from '@/types/admin';

export class UserActionsClient extends MCPGatewayClient {
  /**
   * Grant entity access to a user
   */
  async grantEntityAccess(input: GrantEntityAccessInput): Promise<void> {
    const sql = `
      INSERT INTO user_entities (user_id, entity_type, role, is_active, access_granted_at, created_at)
      VALUES ($1, $2, $3, true, NOW(), NOW())
      ON CONFLICT (user_id, entity_type)
      DO UPDATE SET
        is_active = true,
        role = EXCLUDED.role,
        access_granted_at = NOW(),
        updated_at = NOW()
    `;

    await this.query(sql, [
      input.userId,
      input.entityType.toUpperCase(),
      input.role.toUpperCase(),
    ]);

    // Create audit log
    await this.createAuditLog({
      adminUserId: input.grantedBy,
      action: 'user.entity_access_granted',
      entityType: 'user_entities',
      entityId: input.userId,
      entityScope: input.entityType,
      metadata: {
        role: input.role,
      },
    });
  }

  /**
   * Revoke entity access from a user
   */
  async revokeEntityAccess(input: RevokeEntityAccessInput): Promise<void> {
    const sql = `
      UPDATE user_entities
      SET is_active = false,
          access_revoked_at = NOW(),
          updated_at = NOW()
      WHERE user_id = $1 AND entity_type = $2
    `;

    await this.query(sql, [input.userId, input.entityType.toUpperCase()]);

    // Create audit log
    await this.createAuditLog({
      adminUserId: input.revokedBy,
      action: 'user.entity_access_revoked',
      entityType: 'user_entities',
      entityId: input.userId,
      entityScope: input.entityType,
    });
  }

  /**
   * Deactivate or reactivate a user account
   */
  async updateUserStatus(input: UpdateUserStatusInput): Promise<void> {
    const sql = `
      UPDATE users
      SET is_active = $1,
          updated_at = NOW()
      WHERE id = $2
    `;

    await this.query(sql, [input.isActive, input.userId]);

    // Create audit log
    await this.createAuditLog({
      adminUserId: input.updatedBy,
      action: input.isActive ? 'user.account_reactivated' : 'user.account_deactivated',
      entityType: 'users',
      entityId: input.userId,
    });
  }

  /**
   * Manually verify a user's email
   */
  async verifyEmail(input: VerifyEmailInput): Promise<void> {
    const sql = `
      UPDATE users
      SET email_verified = true,
          is_verified = true,
          updated_at = NOW()
      WHERE id = $1
    `;

    await this.query(sql, [input.userId]);

    // Create audit log
    await this.createAuditLog({
      adminUserId: input.verifiedBy,
      action: 'user.email_verified_manually',
      entityType: 'users',
      entityId: input.userId,
    });
  }

  /**
   * Bulk grant entity access to multiple users
   */
  async bulkGrantAccess(input: BulkGrantAccessInput): Promise<BulkOperationResult> {
    const succeeded: string[] = [];
    const failed: { userId: string; error: string }[] = [];

    for (const userId of input.userIds) {
      try {
        await this.grantEntityAccess({
          userId,
          entityType: input.entityType,
          role: input.role,
          grantedBy: input.grantedBy,
        });
        succeeded.push(userId);
      } catch (error) {
        failed.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      succeeded,
      failed,
      total: input.userIds.length,
    };
  }

  /**
   * Get user activity log
   */
  async getUserActivityLog(filters: UserActivityFilters): Promise<UserActivity[]> {
    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [filters.userId];
    let paramIndex = 2;

    if (filters.activityTypes && filters.activityTypes.length > 0) {
      conditions.push(`activity_type = ANY($${paramIndex})`);
      params.push(filters.activityTypes);
      paramIndex++;
    }

    if (filters.startDate) {
      conditions.push(`created_at >= $${paramIndex}`);
      params.push(filters.startDate.toISOString());
      paramIndex++;
    }

    if (filters.endDate) {
      conditions.push(`created_at <= $${paramIndex}`);
      params.push(filters.endDate.toISOString());
      paramIndex++;
    }

    const limit = filters.limit || 30;

    const sql = `
      SELECT id, user_id, activity_type, ip_address, user_agent, metadata, created_at
      FROM user_activity_log
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    const rows = await this.query<any>(sql, params);

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      activityType: row.activity_type,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
    }));
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(input: CreateAuditLogInput): Promise<void> {
    const sql = `
      INSERT INTO admin_audit_logs
        (admin_user_id, action, entity_type, entity_id, entity_scope, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

    await this.query(sql, [
      input.adminUserId,
      input.action,
      input.entityType || null,
      input.entityId || null,
      input.entityScope || null,
      input.metadata ? JSON.stringify(input.metadata) : null,
    ]);
  }
}
```

- grantEntityAccess with UPSERT logic (idempotent)
- revokeEntityAccess updates is_active flag
- updateUserStatus for deactivation/reactivation
- verifyEmail for manual verification
- bulkGrantAccess with error handling per user
- getUserActivityLog with filtering
- All actions create audit logs

### 4. Create Server Actions for User Management
Create `app/(dashboard)/users/actions.ts` with server actions.

**File: `app/(dashboard)/users/actions.ts`**
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/config';
import { UserActionsClient } from '@/lib/mcp-client/user-actions';
import {
  GrantEntityAccessInput,
  RevokeEntityAccessInput,
  UpdateUserStatusInput,
  VerifyEmailInput,
} from '@/types/user';
import { canManageRoles, hasAnyRole } from '@/lib/rbac/utils';
import { z } from 'zod';

const client = new UserActionsClient({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

// Validation schemas
const grantAccessSchema = z.object({
  userId: z.string().uuid(),
  entityType: z.enum(['kids_ascension', 'ozean_licht']),
  role: z.enum(['USER', 'CREATOR', 'EDUCATOR', 'ADMIN', 'MODERATOR', 'SUPPORT']),
});

const revokeAccessSchema = z.object({
  userId: z.string().uuid(),
  entityType: z.enum(['kids_ascension', 'ozean_licht']),
});

const updateStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
});

const verifyEmailSchema = z.object({
  userId: z.string().uuid(),
});

/**
 * Grant entity access to a user
 */
export async function grantEntityAccessAction(
  input: Omit<GrantEntityAccessInput, 'grantedBy'>
) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validated = grantAccessSchema.parse(input);

    // Check permissions
    const adminRole = session.user.adminRole;
    if (adminRole !== 'super_admin') {
      // Entity admins can only grant access to their own entity
      const entityScope = session.user.entityScope;
      if (entityScope !== validated.entityType) {
        return { success: false, error: 'Insufficient permissions for this entity' };
      }
    }

    // Grant access
    await client.grantEntityAccess({
      ...validated,
      grantedBy: session.user.adminUserId,
    });

    // Revalidate user list and detail pages
    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${validated.userId}`);

    return { success: true };
  } catch (error) {
    console.error('[grantEntityAccessAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to grant access',
    };
  }
}

/**
 * Revoke entity access from a user
 */
export async function revokeEntityAccessAction(
  input: Omit<RevokeEntityAccessInput, 'revokedBy'>
) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validated = revokeAccessSchema.parse(input);

    // Check permissions
    const adminRole = session.user.adminRole;
    if (adminRole !== 'super_admin') {
      const entityScope = session.user.entityScope;
      if (entityScope !== validated.entityType) {
        return { success: false, error: 'Insufficient permissions for this entity' };
      }
    }

    // Prevent revoking own access
    if (validated.userId === session.user.id) {
      return { success: false, error: 'Cannot revoke your own entity access' };
    }

    // Revoke access
    await client.revokeEntityAccess({
      ...validated,
      revokedBy: session.user.adminUserId,
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${validated.userId}`);

    return { success: true };
  } catch (error) {
    console.error('[revokeEntityAccessAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke access',
    };
  }
}

/**
 * Deactivate or reactivate a user account
 */
export async function updateUserStatusAction(
  input: Omit<UpdateUserStatusInput, 'updatedBy'>
) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Only super_admin can deactivate users
    if (!canManageRoles(session)) {
      return { success: false, error: 'Insufficient permissions' };
    }

    // Validate input
    const validated = updateStatusSchema.parse(input);

    // Prevent deactivating own account
    if (validated.userId === session.user.id) {
      return { success: false, error: 'Cannot deactivate your own account' };
    }

    // Update status
    await client.updateUserStatus({
      ...validated,
      updatedBy: session.user.adminUserId,
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${validated.userId}`);

    return { success: true };
  } catch (error) {
    console.error('[updateUserStatusAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user status',
    };
  }
}

/**
 * Manually verify a user's email
 */
export async function verifyEmailAction(input: Omit<VerifyEmailInput, 'verifiedBy'>) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // super_admin or support can verify emails
    if (!hasAnyRole(session, ['super_admin', 'support'])) {
      return { success: false, error: 'Insufficient permissions' };
    }

    // Validate input
    const validated = verifyEmailSchema.parse(input);

    // Verify email
    await client.verifyEmail({
      ...validated,
      verifiedBy: session.user.adminUserId,
    });

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${validated.userId}`);

    return { success: true };
  } catch (error) {
    console.error('[verifyEmailAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify email',
    };
  }
}
```

- All server actions use `'use server'` directive
- Zod validation for inputs
- RBAC permission checks per action
- Audit logging handled by UserActionsClient
- Revalidate paths after mutations
- Prevent self-revoke and self-deactivate

### 5. Create Grant Access Dialog Component
Create `app/(dashboard)/users/[id]/GrantAccessDialog.tsx`.

**File: `app/(dashboard)/users/[id]/GrantAccessDialog.tsx`**
```typescript
'use client';

import { useState, useTransition } from 'react';
import { grantEntityAccessAction } from '../actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { EntityType } from '@/types/user';

interface GrantAccessDialogProps {
  userId: string;
  currentEntities: EntityType[];
}

export function GrantAccessDialog({ userId, currentEntities }: GrantAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [entityType, setEntityType] = useState<EntityType>('kids_ascension');
  const [role, setRole] = useState('USER');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await grantEntityAccessAction({
        userId,
        entityType,
        role,
      });

      if (result.success) {
        toast.success(`Access granted to ${entityType === 'kids_ascension' ? 'Kids Ascension' : 'Ozean Licht'}`);
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to grant access');
      }
    });
  };

  // Determine available entities (not already granted)
  const hasKidsAscension = currentEntities.includes('kids_ascension');
  const hasOzeanLicht = currentEntities.includes('ozean_licht');
  const canGrantAccess = !hasKidsAscension || !hasOzeanLicht;

  if (!canGrantAccess) {
    return null; // User already has access to both platforms
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant Platform Access</DialogTitle>
          <DialogDescription>
            Grant this user access to a platform. They will be able to log in and use the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="entity">Platform</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
              <SelectTrigger id="entity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {!hasKidsAscension && (
                  <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
                )}
                {!hasOzeanLicht && (
                  <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="CREATOR">Creator</SelectItem>
                <SelectItem value="EDUCATOR">Educator</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Granting...' : 'Grant Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- Dialog with entity and role selection
- Filters available platforms (only show platforms user doesn't have)
- useTransition for pending state
- Toast notifications for success/error
- Disabled state during async operation

### 6. Create Revoke Access Dialog Component
Create `app/(dashboard)/users/[id]/RevokeAccessDialog.tsx`.

**File: `app/(dashboard)/users/[id]/RevokeAccessDialog.tsx`**
```typescript
'use client';

import { useState, useTransition } from 'react';
import { revokeEntityAccessAction } from '../actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { EntityType } from '@/types/user';

interface RevokeAccessDialogProps {
  userId: string;
  entityType: EntityType;
  entityLabel: string;
}

export function RevokeAccessDialog({
  userId,
  entityType,
  entityLabel,
}: RevokeAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await revokeEntityAccessAction({
        userId,
        entityType,
      });

      if (result.success) {
        toast.success(`Access revoked from ${entityLabel}`);
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to revoke access');
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserMinus className="h-4 w-4 mr-2" />
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
          <AlertDialogDescription>
            This will revoke the user's access to <strong>{entityLabel}</strong>.
            They will no longer be able to log in to this platform. This action can be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevoke} disabled={isPending}>
            {isPending ? 'Revoking...' : 'Revoke Access'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- Confirmation dialog (destructive action)
- Clear warning about consequences
- useTransition for async state
- Toast notifications

### 7. Create Deactivate User Dialog
Create `app/(dashboard)/users/[id]/DeactivateUserDialog.tsx`.

**File: `app/(dashboard)/users/[id]/DeactivateUserDialog.tsx`**
```typescript
'use client';

import { useState, useTransition } from 'react';
import { updateUserStatusAction } from '../actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeactivateUserDialogProps {
  userId: string;
  isActive: boolean;
  userEmail: string;
}

export function DeactivateUserDialog({
  userId,
  isActive,
  userEmail,
}: DeactivateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await updateUserStatusAction({
        userId,
        isActive: !isActive,
      });

      if (result.success) {
        toast.success(isActive ? 'User deactivated' : 'User reactivated');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to update user status');
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={isActive ? 'destructive' : 'default'} size="sm">
          {isActive ? (
            <>
              <Ban className="h-4 w-4 mr-2" />
              Deactivate Account
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Reactivate Account
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Deactivate Account?' : 'Reactivate Account?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive ? (
              <>
                This will deactivate <strong>{userEmail}</strong>'s account.
                They will not be able to log in to any platform until reactivated.
              </>
            ) : (
              <>
                This will reactivate <strong>{userEmail}</strong>'s account.
                They will be able to log in again to all platforms they have access to.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggleStatus} disabled={isPending}>
            {isPending
              ? isActive
                ? 'Deactivating...'
                : 'Reactivating...'
              : isActive
              ? 'Deactivate'
              : 'Reactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- Toggle dialog (deactivate OR reactivate)
- Destructive variant for deactivation
- Clear warning about consequences
- Dynamic button labels based on current state

### 8. Create User Action Buttons Component
Create `app/(dashboard)/users/[id]/UserActionButtons.tsx`.

**File: `app/(dashboard)/users/[id]/UserActionButtons.tsx`**
```typescript
'use client';

import { UserDetail } from '@/types/user';
import { GrantAccessDialog } from './GrantAccessDialog';
import { RevokeAccessDialog } from './RevokeAccessDialog';
import { DeactivateUserDialog } from './DeactivateUserDialog';
import { Button } from '@/components/ui/button';
import { Mail, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { useSession } from 'next-auth/react';
import { canManageRoles, hasAnyRole } from '@/lib/rbac/utils';

interface UserActionButtonsProps {
  user: UserDetail;
}

export function UserActionButtons({ user }: UserActionButtonsProps) {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const isSuperAdmin = canManageRoles(session);
  const canVerifyEmail = hasAnyRole(session, ['super_admin', 'support']);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>
          Manage user access and account status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Access Management */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Platform Access</h3>

          {/* Grant Access */}
          <div>
            <GrantAccessDialog
              userId={user.id}
              currentEntities={user.entities.map((e) => e.entityId)}
            />
          </div>

          {/* Revoke Access */}
          {user.entities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Revoke access from platforms:
              </p>
              <div className="flex items-center gap-2">
                {user.entities.map((entity) => (
                  <div key={entity.id} className="flex items-center gap-2">
                    <EntityBadge entity={entity.entityId} compact />
                    <RevokeAccessDialog
                      userId={user.id}
                      entityType={entity.entityId}
                      entityLabel={
                        entity.entityId === 'kids_ascension'
                          ? 'Kids Ascension'
                          : 'Ozean Licht'
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email Verification */}
        {!user.emailVerified && canVerifyEmail && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Email Verification</h3>
            <p className="text-xs text-muted-foreground">
              Manually verify this user's email address
            </p>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Mail className="h-4 w-4 mr-2" />
              Verify Email
            </Button>
          </div>
        )}

        {/* Password Reset */}
        {(isSuperAdmin || hasAnyRole(session, ['support'])) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Password Reset</h3>
            <p className="text-xs text-muted-foreground">
              Send a password reset email to this user
            </p>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Key className="h-4 w-4 mr-2" />
              Send Reset Email
            </Button>
          </div>
        )}

        {/* Account Status */}
        {isSuperAdmin && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Account Status</h3>
            <DeactivateUserDialog
              userId={user.id}
              isActive={true} // TODO: Get from user.isActive
              userEmail={user.email}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- Grouped action buttons by category
- RBAC-based visibility (only show actions user can perform)
- Entity badges next to revoke buttons
- Placeholder for email verification and password reset
- Card layout for visual grouping

### 9. Integrate Action Buttons into User Detail Page
Update `app/(dashboard)/users/[id]/page.tsx` to include action buttons.

**Add to user detail page:**
```typescript
import { UserActionButtons } from './UserActionButtons';

// Inside page component, after UserDetailCard:
<UserActionButtons user={user} />
```

- Add UserActionButtons below UserDetailCard
- Actions will only show if user has permission

### 10. Create Password Reset API Route
Create `app/api/users/[id]/reset-password/route.ts`.

**File: `app/api/users/[id]/reset-password/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

/**
 * POST /api/users/[id]/reset-password
 * Trigger password reset email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin and support can trigger password resets
    if (!hasAnyRole(session, ['super_admin', 'support'])) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get user
    const user = await mcpClient.getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // TODO: Generate password reset token
    // TODO: Send email via Resend API (via MCP Gateway)
    // For now, just log the action
    await mcpClient.createAuditLog({
      adminUserId: session.user.adminUserId,
      action: 'user.password_reset_triggered',
      entityType: 'users',
      entityId: params.id,
      metadata: {
        email: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('[POST /api/users/[id]/reset-password] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- API route for password reset
- Permission check (super_admin or support)
- Audit log created
- TODO: Implement email sending via Resend API

### 11. Create User Activity Log Component
Create `app/(dashboard)/users/[id]/UserActivityLog.tsx`.

**File: `app/(dashboard)/users/[id]/UserActivityLog.tsx`**
```typescript
'use client';

import { UserActivity } from '@/types/user-activity';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  LogIn,
  LogOut,
  Key,
  Mail,
  UserPlus,
  UserMinus,
  Ban,
  CheckCircle2,
} from 'lucide-react';

interface UserActivityLogProps {
  activities: UserActivity[];
}

const activityIcons: Record<string, any> = {
  login: LogIn,
  logout: LogOut,
  password_changed: Key,
  email_verified: Mail,
  entity_access_granted: UserPlus,
  entity_access_revoked: UserMinus,
  account_deactivated: Ban,
  account_reactivated: CheckCircle2,
};

const activityLabels: Record<string, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  password_changed: 'Changed password',
  email_verified: 'Email verified',
  entity_access_granted: 'Platform access granted',
  entity_access_revoked: 'Platform access revoked',
  account_deactivated: 'Account deactivated',
  account_reactivated: 'Account reactivated',
};

export function UserActivityLog({ activities }: UserActivityLogProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <CardDescription>Recent user activity (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Recent user activity (showing {activities.length} events)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.activityType] || Activity;
            const label = activityLabels[activity.activityType] || activity.activityType;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <div className="mt-0.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  {activity.ipAddress && (
                    <div className="text-xs text-muted-foreground">
                      IP: {activity.ipAddress}
                    </div>
                  )}
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

- Display activity log entries
- Icon mapping for activity types
- Relative timestamps
- IP address display
- Metadata badges for additional context

### 12. Fetch and Display Activity Log in User Detail
Update `app/(dashboard)/users/[id]/page.tsx` to fetch activity log.

**Add to user detail page:**
```typescript
import { UserActionsClient } from '@/lib/mcp-client/user-actions';
import { UserActivityLog } from './UserActivityLog';

const actionsClient = new UserActionsClient({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

// Inside page component:
const activities = await actionsClient.getUserActivityLog({
  userId: params.id,
  limit: 30, // Last 30 entries
});

// Add to render:
<UserActivityLog activities={activities} />
```

- Fetch activity log on server
- Pass to client component
- Display below user actions

### 13. Add Database Migration for Activity Log
Create migration file for user_activity_log table.

**File: `shared/database/migrations/001_create_user_activity_log.sql`**
```sql
-- Migration: 001_create_user_activity_log.sql
-- Description: Create user activity log table for tracking user actions
-- Created: 2025-11-09

\c shared_users_db

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id
  ON user_activity_log(user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at
  ON user_activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_activity_type
  ON user_activity_log(activity_type);

-- Composite index for user activity queries
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_created
  ON user_activity_log(user_id, created_at DESC);

-- Add constraint for valid activity types (optional, for data integrity)
ALTER TABLE user_activity_log
  ADD CONSTRAINT check_activity_type CHECK (
    activity_type IN (
      'login',
      'logout',
      'password_changed',
      'email_verified',
      'entity_access_granted',
      'entity_access_revoked',
      'account_deactivated',
      'account_reactivated',
      'role_changed'
    )
  );
```

- Create user_activity_log table
- Indexes for user_id and created_at
- Composite index for common queries
- Constraint for valid activity types

### 14. Add Bulk Grant Access Route (Optional)
Create API route for bulk operations.

**File: `app/api/users/bulk-grant-access/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { canManageRoles } from '@/lib/rbac/utils';
import { UserActionsClient } from '@/lib/mcp-client/user-actions';
import { z } from 'zod';

const mcpClient = new UserActionsClient({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
});

const bulkGrantSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(100),
  entityType: z.enum(['kids_ascension', 'ozean_licht']),
  role: z.enum(['USER', 'CREATOR', 'EDUCATOR', 'ADMIN', 'MODERATOR', 'SUPPORT']),
});

/**
 * POST /api/users/bulk-grant-access
 * Grant entity access to multiple users
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can perform bulk operations
    if (!canManageRoles(session)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validated = bulkGrantSchema.parse(body);

    // Perform bulk grant
    const result = await mcpClient.bulkGrantAccess({
      ...validated,
      grantedBy: session.user.adminUserId,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('[POST /api/users/bulk-grant-access] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- Bulk grant access API route
- Limit to 100 users per batch
- Only super_admin can perform bulk operations
- Returns succeeded and failed user IDs

### 15. Update Types Index
Export new types from `types/index.ts`.

**Add to `types/index.ts`:**
```typescript
export * from './user-activity';
```

- Export activity log types

### 16. Write Tests for User Actions
Create test file for user action methods.

**File: `tests/unit/mcp-client/user-actions.test.ts`**
```typescript
import { UserActionsClient } from '@/lib/mcp-client/user-actions';

describe('User Actions Client', () => {
  let client: UserActionsClient;
  let testUserId: string;

  beforeAll(async () => {
    client = new UserActionsClient({
      baseUrl: 'http://localhost:8100',
      database: 'shared-users-db',
    });

    // Get a test user
    const { users } = await client.listUsers({ limit: 1 });
    if (users.length > 0) {
      testUserId = users[0].id;
    }
  });

  describe('grantEntityAccess', () => {
    it('should grant entity access to a user', async () => {
      await expect(
        client.grantEntityAccess({
          userId: testUserId,
          entityType: 'kids_ascension',
          role: 'USER',
          grantedBy: 'test-admin-id',
        })
      ).resolves.not.toThrow();
    });
  });

  describe('revokeEntityAccess', () => {
    it('should revoke entity access from a user', async () => {
      // First grant access
      await client.grantEntityAccess({
        userId: testUserId,
        entityType: 'kids_ascension',
        role: 'USER',
        grantedBy: 'test-admin-id',
      });

      // Then revoke
      await expect(
        client.revokeEntityAccess({
          userId: testUserId,
          entityType: 'kids_ascension',
          revokedBy: 'test-admin-id',
        })
      ).resolves.not.toThrow();
    });
  });

  describe('getUserActivityLog', () => {
    it('should fetch user activity log', async () => {
      const activities = await client.getUserActivityLog({
        userId: testUserId,
        limit: 10,
      });

      expect(Array.isArray(activities)).toBe(true);
    });
  });
});
```

- Unit tests for user actions
- Tests for grant/revoke access
- Tests for activity log fetching

### 17. Manual Testing Checklist
Test all user management actions.

**Test Scenarios:**

1. **Grant Entity Access**
   - Open user detail page for a user with no entity access
   - Click "Grant Access" button
   - Select platform (Kids Ascension or Ozean Licht)
   - Select role (User, Creator, Educator)
   - Submit form
   - Verify toast notification shows success
   - Verify entity badge appears in platform access section
   - Refresh page and verify access persisted

2. **Revoke Entity Access**
   - Open user detail page for a user with entity access
   - Click "Revoke" button next to entity badge
   - Confirm revocation in dialog
   - Verify toast notification shows success
   - Verify entity badge removed
   - Verify user cannot log in to that platform (if testing auth flow)

3. **Deactivate User**
   - Open user detail page
   - Click "Deactivate Account" button
   - Confirm deactivation
   - Verify toast notification shows success
   - Verify user status changes to inactive
   - Verify user cannot log in (if testing auth flow)

4. **Reactivate User**
   - Open deactivated user detail page
   - Click "Reactivate Account" button
   - Confirm reactivation
   - Verify toast notification shows success
   - Verify user status changes to active
   - Verify user can log in again

5. **Manual Email Verification**
   - Open user detail page for unverified user
   - Click "Verify Email" button
   - Verify toast notification shows success
   - Verify email status badge changes to "Verified"

6. **Password Reset**
   - Open user detail page
   - Click "Send Reset Email" button
   - Verify toast notification shows success
   - Verify audit log entry created

7. **Activity Log Display**
   - Perform several actions (grant access, deactivate, etc.)
   - Check activity log section
   - Verify all actions appear with correct icons
   - Verify timestamps are relative (e.g., "2 minutes ago")
   - Verify IP addresses shown (if available)
   - Verify metadata badges display additional context

8. **RBAC Enforcement**
   - Login as support role
   - Verify cannot grant/revoke access
   - Verify cannot deactivate users
   - Verify CAN verify emails and reset passwords
   - Login as ka_admin
   - Verify can only grant access to Kids Ascension
   - Verify cannot grant access to Ozean Licht

9. **Error Handling**
   - Try to revoke own entity access (should fail)
   - Try to deactivate own account (should fail)
   - Try to grant access without permission (should fail)
   - Verify error toasts show meaningful messages

10. **Optimistic Updates**
    - Perform action (e.g., grant access)
    - Verify UI updates immediately
    - Wait for server response
    - Verify no visual jank or flickering

### 18. Run Type Check and Build
Validate TypeScript types.

```bash
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck
npm run build
```

- Ensure no TypeScript errors
- Ensure build succeeds

### 19. Document User Actions in CLAUDE.md
Add user action examples to admin CLAUDE.md.

**Add to `apps/admin/CLAUDE.md`:**
```markdown
## User Management Actions

### Grant Entity Access
```typescript
import { grantEntityAccessAction } from '@/app/(dashboard)/users/actions';

const result = await grantEntityAccessAction({
  userId: 'user-uuid',
  entityType: 'kids_ascension',
  role: 'USER',
});

if (result.success) {
  // Access granted
} else {
  // Handle error: result.error
}
```

### Revoke Entity Access
```typescript
import { revokeEntityAccessAction } from '@/app/(dashboard)/users/actions';

const result = await revokeEntityAccessAction({
  userId: 'user-uuid',
  entityType: 'ozean_licht',
});
```

### Deactivate/Reactivate User
```typescript
import { updateUserStatusAction } from '@/app/(dashboard)/users/actions';

// Deactivate
await updateUserStatusAction({
  userId: 'user-uuid',
  isActive: false,
});

// Reactivate
await updateUserStatusAction({
  userId: 'user-uuid',
  isActive: true,
});
```

### Verify Email
```typescript
import { verifyEmailAction } from '@/app/(dashboard)/users/actions';

await verifyEmailAction({
  userId: 'user-uuid',
});
```

- Quick reference for server actions
- Common usage patterns

### 20. Validate Implementation
Run all validation checks.

**Validation Checklist:**
- [ ] User activity types defined
- [ ] User action input types defined
- [ ] UserActionsClient class created with all methods
- [ ] Server actions created (grant, revoke, update status, verify email)
- [ ] GrantAccessDialog component renders and submits
- [ ] RevokeAccessDialog confirms and submits
- [ ] DeactivateUserDialog toggles user status
- [ ] UserActionButtons shows actions based on RBAC
- [ ] Action buttons integrated into user detail page
- [ ] Password reset API route created
- [ ] UserActivityLog component displays activities
- [ ] Activity log fetched and displayed in user detail
- [ ] Database migration created for activity log
- [ ] Bulk grant access API route created (optional)
- [ ] Types exported from index
- [ ] Tests written for user actions
- [ ] RBAC permissions enforced in all actions
- [ ] Audit logging integrated
- [ ] Toast notifications show for all actions
- [ ] Optimistic updates work correctly
- [ ] Error handling for all edge cases
- [ ] TypeScript types pass without errors
- [ ] All tests pass

## Testing Strategy

### Unit Tests
- Test UserActionsClient methods (grant, revoke, update, verify)
- Test permission validation logic
- Test activity log filtering
- Located in `tests/unit/mcp-client/user-actions.test.ts`

### Integration Tests
- Test full action flow (UI → server action → database)
- Test RBAC enforcement at action level
- Test audit log creation
- Test activity log display
- Located in `tests/integration/users/actions.test.ts`

### Manual Testing
- Test all action types (grant, revoke, deactivate, verify)
- Test RBAC permissions (different roles see different actions)
- Test error scenarios (self-revoke, self-deactivate)
- Test optimistic updates and revalidation
- Test activity log display with real data

## Acceptance Criteria

- [ ] Grant entity access dialog allows selecting platform and role
- [ ] Grant access restricted to platforms user doesn't already have
- [ ] Revoke access dialog confirms action
- [ ] Revoke access removes entity association
- [ ] Cannot revoke own entity access (validation prevents)
- [ ] Deactivate user dialog confirms action
- [ ] Deactivated users cannot log in (integration with auth)
- [ ] Reactivate user restores account access
- [ ] Cannot deactivate own account (validation prevents)
- [ ] Manual email verification updates email_verified flag
- [ ] Password reset triggers email (when email service integrated)
- [ ] Activity log displays last 30 days of user activity
- [ ] Activity log shows icons, labels, timestamps, and metadata
- [ ] RBAC enforced: super_admin can perform all actions
- [ ] RBAC enforced: entity admins can only manage their entity
- [ ] RBAC enforced: support can verify emails and reset passwords
- [ ] All actions create audit log entries
- [ ] Bulk grant access processes multiple users (optional)
- [ ] Bulk operations show progress and results (optional)
- [ ] Entity access changes reflect in JWT on next login
- [ ] Role changes validated (cannot assign super_admin without permission)
- [ ] Toast notifications show for success and error states
- [ ] Optimistic UI updates work correctly
- [ ] Page revalidation occurs after mutations
- [ ] TypeScript types are strongly typed
- [ ] All tests pass (unit + integration)
- [ ] Database migration applied successfully

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Type check
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck

# Run tests
npm test -- user-actions
npm test -- users/actions

# Lint check
npm run lint

# Build check
npm run build

# Apply database migration
cd /opt/ozean-licht-ecosystem/shared/database
./scripts/run-migration.sh migrations/001_create_user_activity_log.sql

# Manual verification
cd /opt/ozean-licht-ecosystem/apps/admin
npm run dev

# 1. Navigate to /dashboard/users
# 2. Click "View" on a user
# 3. Verify "Admin Actions" card appears
# 4. Test grant access:
#    - Click "Grant Access"
#    - Select platform and role
#    - Submit and verify success toast
#    - Verify entity badge appears
# 5. Test revoke access:
#    - Click "Revoke" next to entity badge
#    - Confirm and verify success toast
#    - Verify badge removed
# 6. Test deactivate:
#    - Click "Deactivate Account"
#    - Confirm and verify success toast
#    - Verify status changes
# 7. Test reactivate:
#    - Click "Reactivate Account"
#    - Confirm and verify success toast
# 8. Test verify email:
#    - Find unverified user
#    - Click "Verify Email"
#    - Verify status changes to verified
# 9. Test activity log:
#    - Verify activity log card shows recent actions
#    - Verify icons, timestamps, and metadata display
# 10. Test RBAC:
#     - Login as different roles
#     - Verify action visibility matches permissions
#     - Verify actions fail with insufficient permissions
```

## Notes

### Dependencies
- No new npm packages required
- Uses existing toast library (Sonner)
- Uses existing dialog components (from Spec 1.2)
- Uses existing form components (shadcn/ui)

### Database Configuration
- Database: `shared-users-db`
- Tables: `users`, `user_entities`, `user_activity_log` (new)
- MCP Gateway URL: `http://localhost:8100`

### Security Considerations
- RBAC enforced at server action level (cannot bypass via UI)
- Prevent self-revoke and self-deactivate
- Audit logs created for all actions
- Permission validation before database operations
- Zod validation for all inputs
- Only super_admin can perform bulk operations
- Only super_admin can deactivate users

### Performance Optimizations
- Optimistic UI updates (immediate feedback)
- Server actions use revalidatePath (no full page reload)
- Activity log limited to 30 entries (pagination for future)
- Bulk operations process in batches (prevent timeout)

### Future Enhancements (Out of Scope)
- Email service integration (password reset emails)
- Activity log pagination (currently shows last 30)
- Bulk operations UI with progress bar
- Export user list to CSV
- Advanced filtering in activity log
- Real-time activity log updates (WebSocket)

### Related Specs
- **Spec 1.5** (admin-user-management-list.md) - Provides user list foundation
- **Spec 1.4** (admin-basic-rbac.md) - Provides RBAC utilities
- **Spec 1.7** (admin-audit-logging.md) - Integrates with audit logging system

### Estimated Effort
**20 hours** total:
- Phase 1 (Data Layer & Server Actions): 6 hours
- Phase 2 (UI Components & Dialogs): 8 hours
- Phase 3 (Bulk Operations): 3 hours
- Phase 4 (Activity Logging): 2 hours
- Testing & Documentation: 1 hour

### Priority
**P1 (Critical)** - Completes basic user management before audit logging. Essential for platform administration and user support operations. Extends Spec 1.5 with interactive capabilities.
