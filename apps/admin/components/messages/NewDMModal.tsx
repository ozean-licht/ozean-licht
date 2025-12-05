/**
 * NewDMModal Component - Team Chat & Messaging System
 *
 * Modal for starting a direct message conversation
 */

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewDMModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when DM is created */
  onCreate: (userIds: string[]) => void;
  /** Available users for DM */
  availableUsers?: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
  /** Loading state during creation */
  loading?: boolean;
}

/**
 * NewDMModal provides user selection for starting DMs
 *
 * Features:
 * - User search/filter
 * - User selection (single or multi for group DM)
 * - Shows user avatars and names
 * - Start conversation button
 * - Validation
 *
 * @example
 * ```tsx
 * <NewDMModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onCreate={(userIds) => startDM(userIds)}
 *   availableUsers={users}
 *   loading={isCreating}
 * />
 * ```
 */
export default function NewDMModal({
  open,
  onClose,
  onCreate,
  availableUsers = [],
  loading = false,
}: NewDMModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Reset form when modal closes
  const handleClose = () => {
    setSearchQuery('');
    setSelectedUserIds([]);
    onClose();
  };

  // Filter users by search query
  const filteredUsers = availableUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Toggle user selection
  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Submit
  const handleSubmit = () => {
    if (selectedUserIds.length === 0) return;
    onCreate(selectedUserIds);
  };

  // Get selected users
  const selectedUsers = availableUsers.filter((user) =>
    selectedUserIds.includes(user.id)
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans font-medium text-white">
            New Direct Message
          </DialogTitle>
          <DialogDescription className="text-sm font-sans font-light text-[#C4C8D4]">
            Start a conversation with one or more team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div>
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-border text-white placeholder:text-[#C4C8D4]/50"
            />
          </div>

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background/50 border border-border">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/20 border border-primary/30"
                >
                  {/* Avatar */}
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                    <span className="text-xs font-sans font-medium text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Name */}
                  <span className="text-sm font-sans font-light text-white">
                    {user.name}
                  </span>
                  {/* Remove button */}
                  <button
                    onClick={() => toggleUser(user.id)}
                    className="ml-1 text-[#C4C8D4] hover:text-red-400 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* User list */}
          <div className="max-h-[300px] overflow-y-auto border border-border rounded-lg bg-background/50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);

                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : 'hover:bg-card/50 border-l-2 border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-sans font-medium text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs font-sans font-light text-[#C4C8D4] truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Checkbox indicator */}
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-sans font-light text-[#C4C8D4]">
                  {searchQuery ? 'No users found' : 'No users available'}
                </p>
              </div>
            )}
          </div>

          {/* Helper text */}
          {selectedUserIds.length > 1 && (
            <p className="text-xs font-sans font-light text-[#C4C8D4]">
              This will create a group direct message with {selectedUserIds.length} members
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="font-sans"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedUserIds.length === 0}
            className="font-sans"
          >
            {loading
              ? 'Starting...'
              : selectedUserIds.length > 1
              ? 'Start Group DM'
              : 'Start Conversation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
