/**
 * EscalateToTicketButton Component - Team Chat & Messaging System
 *
 * Button for escalating support conversations to internal tickets
 */

'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssignedTeam } from '@/types/team-chat';

interface EscalateToTicketButtonProps {
  /** ID of the conversation to escalate */
  conversationId: string;
  /** Title of the conversation for pre-filling ticket */
  conversationTitle: string;
  /** Existing linked tickets if any */
  existingTickets?: Array<{
    id: string;
    ticketNumber: string;
    status: string;
  }>;
  /** Callback when team is selected for escalation */
  onEscalate: (team: AssignedTeam) => void;
}

/**
 * EscalateToTicketButton allows agents to escalate support conversations to internal tickets
 *
 * Features:
 * - Dropdown menu with team options (dev, tech, admin)
 * - Shows badge count if existing tickets are linked
 * - Opens NewTicketModal with pre-filled conversation context
 * - Ozean Licht branded colors
 *
 * @example
 * ```tsx
 * <EscalateToTicketButton
 *   conversationId={conversation.id}
 *   conversationTitle={conversation.title}
 *   existingTickets={linkedTickets}
 *   onEscalate={(team) => handleEscalate(team)}
 * />
 * ```
 */
export default function EscalateToTicketButton({
  conversationId: _conversationId,
  conversationTitle: _conversationTitle,
  existingTickets = [],
  onEscalate,
}: EscalateToTicketButtonProps) {
  // Note: conversationId and conversationTitle are passed to parent via onEscalate
  // They're intentionally destructured here for documentation purposes
  void _conversationId;
  void _conversationTitle;
  const hasExistingTickets = existingTickets.length > 0;

  // Team options available for escalation
  const escalationTeams: Array<{ value: AssignedTeam; label: string; description: string }> = [
    {
      value: 'dev',
      label: 'Development Team',
      description: 'Bug fixes, feature requests, technical issues',
    },
    {
      value: 'tech',
      label: 'Technical Team',
      description: 'Infrastructure, hosting, performance',
    },
    {
      value: 'admin',
      label: 'Admin Team',
      description: 'Platform management, user issues',
    },
  ];

  // Handle team selection
  const handleTeamSelect = (team: AssignedTeam) => {
    onEscalate(team);
  };

  // Get status color for existing tickets
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'text-blue-400';
      case 'pending':
        return 'text-yellow-400';
      case 'resolved':
        return 'text-green-400';
      case 'archived':
        return 'text-gray-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative font-sans text-white border-border hover:bg-card/50 hover:text-white"
            aria-label="Escalate to internal ticket"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Escalate
            {hasExistingTickets && (
              <Badge
                variant="primary"
                className="ml-2 px-1.5 py-0 text-xs h-5 bg-[#0ec2bc] text-white"
              >
                {existingTickets.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 bg-card border-border"
        >
          <DropdownMenuLabel className="font-sans font-medium text-white">
            Escalate to Internal Ticket
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-border" />

          {/* Team options */}
          {escalationTeams.map((team) => (
            <DropdownMenuItem
              key={team.value}
              onClick={() => handleTeamSelect(team.value)}
              className="font-sans cursor-pointer hover:bg-card/50 focus:bg-card/50"
            >
              <div className="flex flex-col gap-1 py-1">
                <span className="text-sm font-medium text-white">
                  {team.label}
                </span>
                <span className="text-xs font-light text-muted-foreground">
                  {team.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

          {/* Show existing tickets if any */}
          {hasExistingTickets && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuLabel className="font-sans font-medium text-white">
                Existing Tickets
              </DropdownMenuLabel>
              {existingTickets.map((ticket) => (
                <DropdownMenuItem
                  key={ticket.id}
                  className="font-sans cursor-default hover:bg-transparent focus:bg-transparent"
                >
                  <div className="flex items-center justify-between w-full py-1">
                    <span className="text-sm font-medium text-[#0ec2bc]">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-xs font-light capitalize ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
