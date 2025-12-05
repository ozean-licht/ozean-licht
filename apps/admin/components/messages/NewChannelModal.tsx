/**
 * NewChannelModal Component - Team Chat & Messaging System
 *
 * Modal for creating a new team channel
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

interface NewChannelModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when channel is created */
  onCreate: (data: {
    title: string;
    description: string;
    isPrivate: boolean;
    initialMemberIds: string[];
  }) => void;
  /** Available users for initial members */
  availableUsers?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  /** Loading state during creation */
  loading?: boolean;
}

/**
 * NewChannelModal provides form for creating team channels
 *
 * Features:
 * - Title input (required)
 * - Description textarea
 * - Private channel toggle
 * - Initial members multi-select
 * - Create button
 * - Validation
 *
 * @example
 * ```tsx
 * <NewChannelModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onCreate={(data) => createChannel(data)}
 *   availableUsers={users}
 *   loading={isCreating}
 * />
 * ```
 */
export default function NewChannelModal({
  open,
  onClose,
  onCreate,
  availableUsers = [],
  loading = false,
}: NewChannelModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Reset form when modal closes
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsPrivate(false);
    setSelectedUserIds([]);
    setErrors({});
    onClose();
  };

  // Validate and submit
  const handleSubmit = () => {
    // Validation
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Channel name is required';
    } else if (title.length < 3) {
      newErrors.title = 'Channel name must be at least 3 characters';
    } else if (title.length > 50) {
      newErrors.title = 'Channel name must be less than 50 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    onCreate({
      title: title.trim(),
      description: description.trim(),
      isPrivate,
      initialMemberIds: selectedUserIds,
    });
  };

  // Toggle user selection
  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans font-medium text-white">
            Create New Channel
          </DialogTitle>
          <DialogDescription className="text-sm font-sans font-light text-[#C4C8D4]">
            Create a new team channel for collaboration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-sans font-medium text-white mb-2">
              Channel Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., general, dev-team, announcements"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`bg-background/50 border ${
                errors.title ? 'border-red-400' : 'border-border'
              } text-white placeholder:text-[#C4C8D4]/50`}
            />
            {errors.title && (
              <p className="mt-1 text-xs font-sans font-light text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-sans font-medium text-white mb-2">
              Description
            </label>
            <textarea
              placeholder="What's this channel about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none bg-background/50 border border-border rounded-lg px-3 py-2 text-sm font-sans font-light text-white placeholder:text-[#C4C8D4]/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          {/* Private channel toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background/50 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm font-sans font-light text-white">
                Private channel
              </span>
            </label>
          </div>
          {isPrivate && (
            <p className="text-xs font-sans font-light text-[#C4C8D4] mt-1">
              Only invited members can see and access this channel
            </p>
          )}

          {/* Initial members */}
          {availableUsers.length > 0 && (
            <div>
              <label className="block text-sm font-sans font-medium text-white mb-2">
                Add Members
              </label>
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-background/50">
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-card/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="w-4 h-4 rounded border-border bg-background/50 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs font-sans font-light text-[#C4C8D4] truncate">
                        {user.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {selectedUserIds.length > 0 && (
                <p className="text-xs font-sans font-light text-[#C4C8D4] mt-2">
                  {selectedUserIds.length} member{selectedUserIds.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
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
            disabled={loading}
            className="font-sans"
          >
            {loading ? 'Creating...' : 'Create Channel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
