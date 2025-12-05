/**
 * NewTicketModal Component - Team Chat & Messaging System
 *
 * Modal for creating internal tickets (DEV, TECH, ADMIN types)
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateInternalTicketInput,
  AssignedTeam,
  Priority,
} from '@/types/team-chat';

interface NewTicketModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when ticket is created */
  onCreate: (data: CreateInternalTicketInput) => Promise<void>;
  /** Pre-fill when escalating from support ticket */
  linkedConversationId?: string;
  /** Show reference to linked conversation */
  linkedConversationTitle?: string;
}

/**
 * NewTicketModal provides form for creating internal tickets
 *
 * Features:
 * - Title input (required)
 * - Description textarea (optional)
 * - Assigned team select (required)
 * - Priority select (optional, defaults to 'normal')
 * - Linked conversation reference (for escalation)
 * - Create button with loading state
 * - Form validation and error handling
 *
 * @example
 * ```tsx
 * <NewTicketModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onCreate={async (data) => await createTicket(data)}
 *   linkedConversationId="conv-123"
 *   linkedConversationTitle="Support Ticket #456"
 * />
 * ```
 */
export default function NewTicketModal({
  open,
  onClose,
  onCreate,
  linkedConversationId,
  linkedConversationTitle,
}: NewTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTeam, setAssignedTeam] = useState<AssignedTeam | ''>('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    assignedTeam?: string;
  }>({});

  // Reset form when modal closes
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setAssignedTeam('');
    setPriority('normal');
    setLoading(false);
    setErrors({});
    onClose();
  };

  // Validate and submit
  const handleSubmit = async () => {
    // Validation
    const newErrors: { title?: string; assignedTeam?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!assignedTeam) {
      newErrors.assignedTeam = 'Assigned team is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    setLoading(true);
    try {
      const data: CreateInternalTicketInput = {
        title: title.trim(),
        assignedTeam: assignedTeam as AssignedTeam,
        priority,
      };

      // Add optional description
      if (description.trim()) {
        data.metadata = {
          description: description.trim(),
        };
      }

      // Add linked conversation if provided
      if (linkedConversationId) {
        data.linkedConversationId = linkedConversationId;
      }

      await onCreate(data);
      handleClose();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setLoading(false);
      // Note: Error handling is done by parent component
      // We keep the form open so user can retry
    }
  };

  // Team options
  const teamOptions: { value: AssignedTeam; label: string }[] = [
    { value: 'dev', label: 'Development' },
    { value: 'tech', label: 'Technical' },
    { value: 'admin', label: 'Admin' },
    { value: 'support', label: 'Support' },
    { value: 'spiritual', label: 'Spiritual' },
  ];

  // Priority options
  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans font-medium text-white">
            Create Internal Ticket
          </DialogTitle>
          <DialogDescription className="text-sm font-sans font-light text-[#C4C8D4]">
            Create a new internal ticket for your team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Linked conversation reference */}
          {linkedConversationId && linkedConversationTitle && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-sans font-medium text-primary mb-1">
                    Linked to conversation
                  </p>
                  <p className="text-sm font-sans font-light text-white">
                    {linkedConversationTitle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-sans font-medium text-white mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="Brief description of the issue or task"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`bg-background/50 border ${
                errors.title ? 'border-red-400' : 'border-border'
              } text-white placeholder:text-[#C4C8D4]/50`}
              disabled={loading}
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
            <Textarea
              placeholder="Provide additional details about the ticket..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background/50 border-border text-white placeholder:text-[#C4C8D4]/50"
              disabled={loading}
            />
          </div>

          {/* Assigned Team */}
          <div>
            <label className="block text-sm font-sans font-medium text-white mb-2">
              Assigned Team <span className="text-red-400">*</span>
            </label>
            <Select
              value={assignedTeam}
              onValueChange={(value) => {
                setAssignedTeam(value as AssignedTeam);
                setErrors((prev) => ({ ...prev, assignedTeam: undefined }));
              }}
              disabled={loading}
            >
              <SelectTrigger
                className={`bg-background/50 border ${
                  errors.assignedTeam ? 'border-red-400' : 'border-border'
                } text-white`}
              >
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teamOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedTeam && (
              <p className="mt-1 text-xs font-sans font-light text-red-400">
                {errors.assignedTeam}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-sans font-medium text-white mb-2">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
              disabled={loading}
            >
              <SelectTrigger className="bg-background/50 border-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white"
                  >
                    <div className="flex items-center gap-2">
                      {/* Priority indicator */}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          option.value === 'urgent'
                            ? 'bg-red-500'
                            : option.value === 'high'
                            ? 'bg-orange-500'
                            : option.value === 'normal'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            className="font-sans bg-[#0ec2bc] hover:bg-[#0ec2bc]/90 text-white"
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
