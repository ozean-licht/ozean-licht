/**
 * Permissions Page - First Impression UI
 *
 * Visual-first permissions interface using shared-ui components
 * Non-functional - focuses on UX and design system showcase
 */

'use client'

import { Shield, Users, FileText, Settings, Eye, Pencil, Trash2, Plus } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Switch,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Separator,
} from '@/lib/ui'

// Static permission data for UI showcase
const roles = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access',
    color: 'outline' as const,
    userCount: 2,
  },
  {
    id: 'ol_admin',
    name: 'OL Admin',
    description: 'Ozean Licht platform',
    color: 'info' as const,
    userCount: 3,
  },
  {
    id: 'ol_editor',
    name: 'Editor',
    description: 'Content management',
    color: 'outline' as const,
    userCount: 8,
  },
  {
    id: 'support',
    name: 'Support',
    description: 'User assistance',
    color: 'secondary' as const,
    userCount: 5,
  },
]

const permissionCategories = [
  {
    id: 'users',
    name: 'Users',
    icon: Users,
    permissions: [
      { key: 'view', label: 'View users', grants: [true, true, false, true] },
      { key: 'create', label: 'Create users', grants: [true, true, false, false] },
      { key: 'edit', label: 'Edit users', grants: [true, true, false, false] },
      { key: 'delete', label: 'Delete users', grants: [true, false, false, false] },
    ],
  },
  {
    id: 'content',
    name: 'Content',
    icon: FileText,
    permissions: [
      { key: 'view', label: 'View content', grants: [true, true, true, true] },
      { key: 'create', label: 'Create content', grants: [true, true, true, false] },
      { key: 'edit', label: 'Edit content', grants: [true, true, true, false] },
      { key: 'publish', label: 'Publish content', grants: [true, true, false, false] },
      { key: 'delete', label: 'Delete content', grants: [true, true, false, false] },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    permissions: [
      { key: 'view', label: 'View settings', grants: [true, true, false, false] },
      { key: 'edit', label: 'Edit settings', grants: [true, false, false, false] },
    ],
  },
]

function PermissionIcon({ type }: { type: string }) {
  const icons: Record<string, typeof Eye> = {
    view: Eye,
    create: Plus,
    edit: Pencil,
    delete: Trash2,
    publish: FileText,
  }
  const Icon = icons[type] || Eye
  return <Icon className="h-4 w-4 text-primary/60" />
}

export default function PermissionsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-decorative font-normal tracking-tight text-white">Permissions</h1>
          <p className="text-[#C4C8D4] font-light">
            Configure what each role can access across the platform
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          {roles.length} Roles
        </Badge>
      </div>

      {/* Role Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="glass-card glass-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={role.color}>{role.name}</Badge>
                <span className="text-xs text-[#C4C8D4]">{role.userCount} users</span>
              </div>
              <p className="text-sm text-[#C4C8D4] font-light">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-border/50" />

      {/* Permission Matrix */}
      <Tabs defaultValue="users">
        <TabsList className="glass-subtle rounded-lg p-1 gap-1">
          {permissionCategories.map((cat) => (
            <TabsTab
              key={cat.id}
              value={cat.id}
              className="data-[selected]:bg-primary/20 data-[selected]:text-primary rounded-md px-4 py-2 text-sm font-light transition-colors"
            >
              <cat.icon className="h-4 w-4 mr-2 inline-block" />
              {cat.name}
            </TabsTab>
          ))}
        </TabsList>

        {permissionCategories.map((category) => (
          <TabsPanel key={category.id} value={category.id} className="mt-6">
            <Card className="glass-card overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name} Permissions</CardTitle>
                    <CardDescription>
                      {category.permissions.length} permissions in this category
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-border/30 bg-card/30">
                  <div className="text-sm font-medium text-[#C4C8D4]">Permission</div>
                  {roles.map((role) => (
                    <div key={role.id} className="text-sm font-medium text-center text-[#C4C8D4]">
                      {role.name}
                    </div>
                  ))}
                </div>

                {/* Permission Rows */}
                {category.permissions.map((permission, idx) => (
                  <div
                    key={permission.key}
                    className={`grid grid-cols-5 gap-4 px-6 py-4 items-center ${
                      idx !== category.permissions.length - 1 ? 'border-b border-border/20' : ''
                    } hover:bg-primary/5 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <PermissionIcon type={permission.key} />
                      <span className="text-sm text-white font-light">{permission.label}</span>
                    </div>
                    {permission.grants.map((granted, roleIdx) => (
                      <div key={roleIdx} className="flex justify-center">
                        <Switch defaultChecked={granted} />
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsPanel>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-subtle">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-medium text-white">18</p>
              <p className="text-sm text-[#C4C8D4] font-light">Total Permissions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-subtle">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-medium text-white">18</p>
              <p className="text-sm text-[#C4C8D4] font-light">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-subtle">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-medium text-white">3</p>
              <p className="text-sm text-[#C4C8D4] font-light">Categories</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
