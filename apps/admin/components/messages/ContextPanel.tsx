/**
 * ContextPanel Component - Unified Messaging System
 *
 * Displays contextual information in the right panel based on conversation type:
 * - Support Tickets: Customer info, channel, priority, agent, labels, CSAT
 * - Team Channels: Description, member list, settings, pinned messages
 * - Direct Messages: Participant list with online status
 * - Internal Tickets: Ticket number, requester, linked conversation, priority, team, status
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UnifiedConversation,
  Priority,
  AssignedTeam,
  ConversationStatus,
  getChannelLabel,
  getRelativeTime,
} from '@/types/team-chat';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OnlineIndicator from './OnlineIndicator';
import ParticipantList from './ParticipantList';
import { Loader2 } from 'lucide-react';

interface ContextPanelProps {
  /** Current conversation */
  conversation: UnifiedConversation;
  /** Callback when conversation is updated */
  onUpdate: (updates: Partial<UnifiedConversation>) => Promise<void>;
  /** Available agents for assignment (optional) */
  availableAgents?: Array<{ id: string; name: string; email: string }>;
  /** Whether current user can edit conversation */
  canEdit?: boolean;
}

/**
 * ContextPanel displays contextual information based on conversation type
 *
 * Features:
 * - Support tickets: Customer info, priority, agent assignment, labels
 * - Team channels: Description, member list, channel settings
 * - Direct messages: Participant list with online indicators
 * - Internal tickets: Ticket number, requester, priority, team, status
 *
 * @example
 * ```tsx
 * <ContextPanel
 *   conversation={conversation}
 *   onUpdate={(updates) => updateConversation(updates)}
 *   availableAgents={agents}
 *   canEdit={true}
 * />
 * ```
 */
export default function ContextPanel({
  conversation,
  onUpdate,
  availableAgents = [],
  canEdit = false,
}: ContextPanelProps) {
  const router = useRouter();
  const [newLabel, setNewLabel] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Handle priority change
   */
  const handlePriorityChange = async (priority: Priority) => {
    setIsUpdating(true);
    try {
      await onUpdate({ priority });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle assigned agent change
   */
  const handleAgentChange = async (agentId: string) => {
    setIsUpdating(true);
    try {
      await onUpdate({ assignedAgentId: agentId });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle assigned team change
   */
  const handleTeamChange = async (team: AssignedTeam) => {
    setIsUpdating(true);
    try {
      await onUpdate({ assignedTeam: team });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle status change
   */
  const handleStatusChange = async (status: ConversationStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate({ status });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Add a new label
   */
  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;
    const currentLabels = conversation.labels || [];
    if (!currentLabels.includes(newLabel.trim())) {
      setIsUpdating(true);
      try {
        await onUpdate({ labels: [...currentLabels, newLabel.trim()] });
        setNewLabel('');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  /**
   * Remove a label
   */
  const handleRemoveLabel = async (label: string) => {
    const currentLabels = conversation.labels || [];
    setIsUpdating(true);
    try {
      await onUpdate({ labels: currentLabels.filter((l) => l !== label) });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Navigate to linked conversation
   */
  const handleNavigateToLinkedConversation = () => {
    if (conversation.linkedConversationId) {
      router.push(`/dashboard/messages?conversation=${conversation.linkedConversationId}`);
    }
  };

  /**
   * Render support ticket context
   */
  const renderSupportContext = () => {
    const contact = conversation.contact;
    const previousConversations = 0; // This would come from an API call

    return (
      <div className="space-y-6">
        {/* Customer Information */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Customer
          </h3>
          <div className="space-y-3">
            {contact && (
              <>
                {/* Avatar and name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-sans font-medium text-primary">
                      {contact.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-sans font-medium text-white">
                      {contact.name || 'Unknown'}
                    </p>
                    {contact.email && (
                      <p className="text-xs font-sans font-light text-muted-foreground">
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact details */}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="font-sans font-light text-muted-foreground">
                      {contact.phone}
                    </span>
                  </div>
                )}

                {/* Previous conversations */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-sans font-light text-muted-foreground">
                    Previous conversations
                  </span>
                  <span className="font-sans font-medium text-white">
                    {previousConversations}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Channel */}
        {conversation.channel && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Channel
            </h3>
            <Badge variant="info">
              {getChannelLabel(conversation.channel)}
            </Badge>
          </section>
        )}

        {/* Priority */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Priority
          </h3>
          <Select
            value={conversation.priority || 'normal'}
            onValueChange={(value) => handlePriorityChange(value as Priority)}
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Low
                </span>
              </SelectItem>
              <SelectItem value="normal">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Normal
                </span>
              </SelectItem>
              <SelectItem value="high">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  High
                </span>
              </SelectItem>
              <SelectItem value="urgent">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Urgent
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Assigned Agent */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Assigned Agent
          </h3>
          <Select
            value={conversation.assignedAgentId || 'unassigned'}
            onValueChange={handleAgentChange}
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {availableAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Labels */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Labels
          </h3>
          <div className="space-y-2">
            {/* Existing labels */}
            <div className="flex flex-wrap gap-2">
              {conversation.labels?.map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {label}
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 hover:text-red-400"
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
                  )}
                </Badge>
              ))}
            </div>

            {/* Add label input */}
            {canEdit && (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add label..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddLabel();
                    }
                  }}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddLabel}
                  disabled={!newLabel.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CSAT Rating */}
        {conversation.csatRating && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Customer Satisfaction
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (conversation.csatRating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-sans font-medium text-white">
                {conversation.csatRating}/5
              </span>
            </div>
          </section>
        )}

        {/* Timestamps */}
        <section className="pt-4 border-t border-border/50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-sans font-light text-muted-foreground">
                Created
              </span>
              <span className="font-sans font-medium text-white">
                {getRelativeTime(conversation.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans font-light text-muted-foreground">
                Updated
              </span>
              <span className="font-sans font-medium text-white">
                {getRelativeTime(conversation.updatedAt)}
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  };

  /**
   * Render team channel context
   */
  const renderTeamChannelContext = () => {
    return (
      <div className="space-y-6">
        {/* Channel Description */}
        {conversation.description && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Description
            </h3>
            <p className="text-sm font-sans font-light text-white">
              {conversation.description}
            </p>
          </section>
        )}

        {/* Channel Settings */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Settings
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans font-light text-muted-foreground">
                Visibility
              </span>
              <Badge variant={conversation.isPrivate ? 'warning' : 'success'}>
                {conversation.isPrivate ? 'Private' : 'Public'}
              </Badge>
            </div>
          </div>
        </section>

        {/* Member List */}
        {conversation.participants && conversation.participants.length > 0 && (
          <section>
            <ParticipantList
              participants={conversation.participants}
              canManage={canEdit}
            />
          </section>
        )}

        {/* Pinned Messages (Placeholder) */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Pinned Messages
          </h3>
          <p className="text-sm font-sans font-light text-muted-foreground italic">
            No pinned messages
          </p>
        </section>

        {/* Created At */}
        <section className="pt-4 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="font-sans font-light text-muted-foreground">Created</span>
            <span className="font-sans font-medium text-white">
              {getRelativeTime(conversation.createdAt)}
            </span>
          </div>
        </section>
      </div>
    );
  };

  /**
   * Render direct message context
   */
  const renderDirectMessageContext = () => {
    return (
      <div className="space-y-6">
        {/* Participant List */}
        {conversation.participants && conversation.participants.length > 0 && (
          <section>
            <div className="space-y-3">
              {conversation.participants.map((participant) => {
                const user = participant.user;
                return (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-card/30"
                  >
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-sans font-medium text-primary">
                          {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background flex items-center justify-center">
                        <OnlineIndicator status="online" />
                      </div>
                    </div>

                    {/* Name and email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-white truncate">
                        {user?.name || 'Unknown'}
                      </p>
                      {user?.email && (
                        <p className="text-xs font-sans font-light text-muted-foreground truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  };

  /**
   * Render internal ticket context
   */
  const renderInternalTicketContext = () => {
    return (
      <div className="space-y-6">
        {/* Ticket Number */}
        {conversation.ticketNumber && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Ticket Number
            </h3>
            <Badge variant="primary" className="text-base font-mono">
              {conversation.ticketNumber}
            </Badge>
          </section>
        )}

        {/* Requester */}
        {conversation.requester && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Requester
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-sans font-medium text-primary">
                  {conversation.requester.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-sans font-medium text-white">
                  {conversation.requester.name}
                </p>
                <p className="text-xs font-sans font-light text-muted-foreground">
                  {conversation.requester.email}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Linked Support Conversation */}
        {conversation.linkedConversationId && (
          <section>
            <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Linked Conversation
            </h3>
            <button
              onClick={handleNavigateToLinkedConversation}
              className="text-sm font-sans font-medium text-primary hover:text-primary/80 transition-colors underline"
            >
              View Support Conversation
            </button>
          </section>
        )}

        {/* Status */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Status
          </h3>
          <Select
            value={conversation.status}
            onValueChange={(value) =>
              handleStatusChange(value as ConversationStatus)
            }
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Priority */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Priority
          </h3>
          <Select
            value={conversation.priority || 'normal'}
            onValueChange={(value) => handlePriorityChange(value as Priority)}
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Low
                </span>
              </SelectItem>
              <SelectItem value="normal">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Normal
                </span>
              </SelectItem>
              <SelectItem value="high">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  High
                </span>
              </SelectItem>
              <SelectItem value="urgent">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Urgent
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Assigned Team */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Assigned Team
          </h3>
          <Select
            value={conversation.assignedTeam || 'dev'}
            onValueChange={(value) => handleTeamChange(value as AssignedTeam)}
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="dev">Development</SelectItem>
              <SelectItem value="tech">Technical</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="spiritual">Spiritual</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Assigned Agent */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Assigned To
          </h3>
          <Select
            value={conversation.assignedAgentId || 'unassigned'}
            onValueChange={handleAgentChange}
            disabled={!canEdit || isUpdating}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {availableAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Labels */}
        <section>
          <h3 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Labels
          </h3>
          <div className="space-y-2">
            {/* Existing labels */}
            <div className="flex flex-wrap gap-2">
              {conversation.labels?.map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {label}
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 hover:text-red-400"
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
                  )}
                </Badge>
              ))}
            </div>

            {/* Add label input */}
            {canEdit && (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add label..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddLabel();
                    }
                  }}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddLabel}
                  disabled={!newLabel.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Timestamps */}
        <section className="pt-4 border-t border-border/50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-sans font-light text-muted-foreground">
                Created
              </span>
              <span className="font-sans font-medium text-white">
                {getRelativeTime(conversation.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans font-light text-muted-foreground">
                Updated
              </span>
              <span className="font-sans font-medium text-white">
                {getRelativeTime(conversation.updatedAt)}
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  };

  /**
   * Render appropriate context based on conversation type
   */
  const renderContext = () => {
    switch (conversation.type) {
      case 'support':
        return renderSupportContext();
      case 'team_channel':
        return renderTeamChannelContext();
      case 'direct_message':
        return renderDirectMessageContext();
      case 'internal_ticket':
        return renderInternalTicketContext();
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#00111A]/70 backdrop-blur-sm border-l border-border relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}
      <div className="p-6">{renderContext()}</div>
    </div>
  );
}
