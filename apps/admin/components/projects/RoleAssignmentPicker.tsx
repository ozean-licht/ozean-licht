'use client';

/**
 * Role Assignment Picker Component
 *
 * Add/remove user+role assignments for a task.
 * Part of Project Management MVP Phase 2
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProjectRole {
  id: string;
  name: string;
  color: string;
}

interface TaskAssignment {
  id: string;
  user_id: string;
  role_id: string;
  user_name?: string;
  user_email?: string;
  role_name?: string;
  role_color?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface RoleAssignmentPickerProps {
  assignments: TaskAssignment[];
  onAdd: (userId: string, roleId: string) => void;
  onRemove: (assignmentId: string) => void;
  disabled?: boolean;
}

export default function RoleAssignmentPicker({
  assignments,
  onAdd,
  onRemove,
  disabled = false,
}: RoleAssignmentPickerProps) {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          fetch('/api/roles'),
          fetch('/api/admin-users'),
        ]);

        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData.roles || []);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load roles and users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAdd = () => {
    if (selectedUser && selectedRole) {
      onAdd(selectedUser, selectedRole);
      setSelectedUser('');
      setSelectedRole('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing assignments */}
      {assignments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assignments.map((assignment) => (
            <Badge
              key={assignment.id}
              variant="outline"
              className="flex items-center gap-1.5 py-1 px-2"
              style={{
                borderColor: assignment.role_color ? `${assignment.role_color}60` : undefined,
              }}
            >
              <User className="w-3 h-3 text-[#C4C8D4]" />
              <span className="text-white">{assignment.user_name || 'Unknown'}</span>
              <span className="text-[#C4C8D4]">as</span>
              <span style={{ color: assignment.role_color || '#0ec2bc' }}>
                {assignment.role_name || 'Unknown'}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(assignment.id)}
                  className="ml-1 p-0.5 hover:bg-white/10 rounded"
                  aria-label="Remove assignment"
                >
                  <X className="w-3 h-3 text-[#C4C8D4] hover:text-red-400" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Add new assignment */}
      {!disabled && (
        <div className="flex items-center gap-2">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="flex-1 bg-card/50 border-primary/20">
              <SelectValue placeholder="Select user..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="flex-1 bg-card/50 border-primary/20">
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    {role.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!selectedUser || !selectedRole}
            className="flex-shrink-0"
            aria-label="Add assignment"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {assignments.length === 0 && disabled && (
        <p className="text-sm text-[#C4C8D4]">No assignments</p>
      )}
    </div>
  );
}
