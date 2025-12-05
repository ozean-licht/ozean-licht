/**
 * ParticipantList Component - Team Chat & Messaging System
 *
 * List of conversation participants with roles and online status
 */

'use client';

import React from 'react';
import { ConversationParticipant, ParticipantRole } from '@/types/team-chat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OnlineIndicator from './OnlineIndicator';

interface ParticipantListProps {
  /** List of participants */
  participants: ConversationParticipant[];
  /** Current user ID for permission checks */
  currentUserId?: string;
  /** Whether current user can manage participants */
  canManage?: boolean;
  /** Callback when adding a participant */
  onAddParticipant?: () => void;
  /** Callback when removing a participant */
  onRemoveParticipant?: (participantId: string) => void;
}

/**
 * ParticipantList displays conversation participants
 *
 * Features:
 * - Avatar with first letter of name
 * - Name and role badge
 * - Online status indicator
 * - Add/remove participant controls (for admins)
 * - Owner/Admin/Member labels
 *
 * @example
 * ```tsx
 * <ParticipantList
 *   participants={participants}
 *   currentUserId={userId}
 *   canManage={true}
 *   onAddParticipant={() => openAddModal()}
 *   onRemoveParticipant={(id) => removeParticipant(id)}
 * />
 * ```
 */
export default function ParticipantList({
  participants,
  currentUserId,
  canManage = false,
  onAddParticipant,
  onRemoveParticipant,
}: ParticipantListProps) {
  const getRoleBadgeVariant = (
    role: ParticipantRole
  ): 'default' | 'primary' | 'info' => {
    switch (role) {
      case 'owner':
        return 'primary';
      case 'admin':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with add button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-sans font-medium text-white uppercase tracking-wide">
          Participants ({participants.length})
        </h3>
        {canManage && onAddParticipant && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddParticipant}
            className="h-7 text-primary hover:text-primary hover:bg-primary/10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add
          </Button>
        )}
      </div>

      {/* Participant list */}
      <div className="space-y-2">
        {participants.map((participant) => {
          const user = participant.user;
          const isCurrentUser = currentUserId === user?.id;
          const canRemove =
            canManage && !isCurrentUser && participant.role !== 'owner';

          return (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with online indicator */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-sans font-medium text-primary">
                      {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background flex items-center justify-center">
                    <OnlineIndicator status="online" />
                  </div>
                </div>

                {/* Name and role */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-sans font-medium text-white">
                      {user?.name || 'Unknown'}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs text-[#C4C8D4]">(you)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getRoleBadgeVariant(participant.role)}
                      className="text-xs"
                    >
                      {participant.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              {canRemove && onRemoveParticipant && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <svg
                    className="w-4 h-4"
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
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
