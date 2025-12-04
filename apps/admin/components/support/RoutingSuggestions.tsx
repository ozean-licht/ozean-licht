/**
 * RoutingSuggestions Component - Support Management System
 *
 * Displays AI-powered routing recommendations based on keyword detection
 * in support conversations. Suggests appropriate team assignments and
 * priority levels with confidence scoring.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Team,
  ConversationPriority,
  RoutingSuggestion,
  getTeamLabel,
  getTeamColor,
  getPriorityColor,
} from '@/types/support';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoutingSuggestionsProps {
  /** Message content to analyze */
  messageContent: string;
  /** Callback when user accepts a suggestion */
  onAcceptSuggestion: (suggestion: RoutingSuggestion) => void;
  /** Whether in loading state */
  loading?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * Keyword-based routing analysis configuration
 */
const ROUTING_KEYWORDS = {
  tech: [
    'error',
    'fehler',
    'bug',
    'problem',
    'nicht funktioniert',
    "doesn't work",
    'crash',
    'login',
    'password',
    'passwort',
    'download',
    'upload',
    'technical',
    'technisch',
    'broken',
    'kaputt',
    'issue',
  ],
  sales: [
    'payment',
    'zahlung',
    'preis',
    'price',
    'discount',
    'rabatt',
    'refund',
    'erstattung',
    'subscription',
    'abo',
    'purchase',
    'kauf',
    'invoice',
    'rechnung',
    'billing',
    'upgrade',
  ],
  spiritual: [
    'meditation',
    'spiritual',
    'spirituell',
    'energy',
    'energie',
    'healing',
    'heilung',
    'guidance',
    'führung',
    'practice',
    'praxis',
    'chakra',
    'consciousness',
    'bewusstsein',
  ],
  priority: [
    'urgent',
    'dringend',
    'asap',
    'sofort',
    'immediately',
    'wichtig',
    'important',
    'help',
    'hilfe',
    'emergency',
    'notfall',
    'critical',
  ],
} as const;

/**
 * Analyze message content and generate routing suggestions
 */
function analyzeContent(content: string): RoutingSuggestion[] {
  const suggestions: RoutingSuggestion[] = [];
  const normalizedContent = content.toLowerCase();

  // Count keyword matches for each team
  const teamMatches = {
    tech: 0,
    sales: 0,
    spiritual: 0,
  };

  // Count team-specific keyword matches
  (Object.keys(teamMatches) as Array<keyof typeof teamMatches>).forEach((team) => {
    ROUTING_KEYWORDS[team].forEach((keyword) => {
      if (normalizedContent.includes(keyword.toLowerCase())) {
        teamMatches[team]++;
      }
    });
  });

  // Count priority keyword matches
  let priorityMatches = 0;
  ROUTING_KEYWORDS.priority.forEach((keyword) => {
    if (normalizedContent.includes(keyword.toLowerCase())) {
      priorityMatches++;
    }
  });

  // Generate team suggestions (only if there are matches)
  const teamEntries = Object.entries(teamMatches) as Array<
    [keyof typeof teamMatches, number]
  >;
  const sortedTeams = teamEntries.sort((a, b) => b[1] - a[1]);

  // Add top team suggestion if there are matches
  if (sortedTeams[0][1] > 0) {
    const [topTeam, topMatches] = sortedTeams[0];
    const confidence = Math.min(0.5 + topMatches * 0.15, 0.95);

    suggestions.push({
      team: topTeam as Team,
      confidence,
      reason: `Detected ${topMatches} ${topTeam}-related keyword${
        topMatches > 1 ? 's' : ''
      } in message`,
    });
  }

  // Add second team suggestion if significantly different and has matches
  if (
    sortedTeams.length > 1 &&
    sortedTeams[1][1] > 0 &&
    sortedTeams[1][1] >= sortedTeams[0][1] * 0.5
  ) {
    const [secondTeam, secondMatches] = sortedTeams[1];
    const confidence = Math.min(0.4 + secondMatches * 0.12, 0.85);

    suggestions.push({
      team: secondTeam as Team,
      confidence,
      reason: `Also detected ${secondMatches} ${secondTeam}-related keyword${
        secondMatches > 1 ? 's' : ''
      }`,
    });
  }

  // Add priority suggestion if urgent keywords detected
  if (priorityMatches > 0) {
    const priority: ConversationPriority = priorityMatches >= 2 ? 'urgent' : 'high';
    const confidence = Math.min(0.6 + priorityMatches * 0.15, 0.95);

    // If we have a team suggestion, combine with priority
    if (suggestions.length > 0) {
      suggestions[0] = {
        ...suggestions[0],
        priority,
        reason: `${suggestions[0].reason}. Priority escalation: ${priorityMatches} urgency indicator${
          priorityMatches > 1 ? 's' : ''
        } found`,
        confidence: Math.max(suggestions[0].confidence, confidence),
      };
    } else {
      // Priority-only suggestion
      suggestions.push({
        priority,
        confidence,
        reason: `Detected ${priorityMatches} urgency indicator${
          priorityMatches > 1 ? 's' : ''
        } - escalating priority`,
      });
    }
  }

  return suggestions.slice(0, 2); // Return top 2 suggestions
}

/**
 * Map team color to badge variant
 */
function getTeamBadgeVariant(
  color: string
): 'info' | 'success' | 'secondary' | 'default' {
  const colorMap: Record<string, 'info' | 'success' | 'secondary' | 'default'> = {
    blue: 'info',
    green: 'success',
    purple: 'secondary',
    gray: 'default',
  };
  return colorMap[color] || 'default';
}

/**
 * Map priority color to badge variant
 */
function getPriorityBadgeVariant(
  color: string
): 'default' | 'info' | 'warning' | 'destructive' {
  const colorMap: Record<string, 'default' | 'info' | 'warning' | 'destructive'> = {
    gray: 'default',
    blue: 'info',
    orange: 'warning',
    red: 'destructive',
  };
  return colorMap[color] || 'default';
}

/**
 * RoutingSuggestions displays AI-powered routing recommendations
 *
 * Features:
 * - Keyword-based content analysis
 * - Team and priority suggestions
 * - Confidence scoring (0-1 scale)
 * - Clickable suggestion cards
 * - Animated entrance effects
 * - Glass morphism styling
 *
 * @example
 * ```tsx
 * <RoutingSuggestions
 *   messageContent="Error when trying to login"
 *   onAcceptSuggestion={(suggestion) => {
 *     updateConversation({
 *       team: suggestion.team,
 *       priority: suggestion.priority
 *     });
 *   }}
 * />
 * ```
 */
export default function RoutingSuggestions({
  messageContent,
  onAcceptSuggestion,
  loading = false,
  className,
}: RoutingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<RoutingSuggestion[]>([]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  // Analyze message content when it changes
  useEffect(() => {
    if (!messageContent || loading) {
      setSuggestions([]);
      return;
    }

    const analyzedSuggestions = analyzeContent(messageContent);
    setSuggestions(analyzedSuggestions);
    setAppliedIndex(null);
  }, [messageContent, loading]);

  // Handle applying a suggestion
  const handleApplySuggestion = (suggestion: RoutingSuggestion, index: number) => {
    setAppliedIndex(index);
    onAcceptSuggestion(suggestion);

    // Reset applied state after animation
    setTimeout(() => {
      setAppliedIndex(null);
    }, 2000);
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#0ec2bc]" />
            Routing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-8 h-8 border-2 border-[#0ec2bc] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm font-sans font-light text-[#C4C8D4]">
              Analyzing message...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No suggestions state
  if (suggestions.length === 0) {
    return (
      <Card className={cn('glass-subtle', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#0ec2bc]" />
            Routing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lightbulb className="w-8 h-8 text-[#C4C8D4]/50 mx-auto mb-2" />
            <p className="text-sm font-sans font-light text-[#C4C8D4]">
              No routing suggestions available
            </p>
            <p className="text-xs font-sans font-light text-[#C4C8D4]/70 mt-1">
              Add message content to get AI-powered recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-subtle', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-sans font-medium text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#0ec2bc]" />
          Routing Suggestions
          <span className="ml-auto text-xs font-sans font-light text-[#C4C8D4]">
            {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const isApplied = appliedIndex === index;
          const confidencePercent = Math.round(suggestion.confidence * 100);

          return (
            <div
              key={index}
              className={cn(
                'rounded-lg border bg-card/30 backdrop-blur-sm p-4 space-y-3 transition-all duration-300 animate-in slide-in-from-bottom-4',
                isApplied
                  ? 'border-[#0ec2bc] bg-[#0ec2bc]/10'
                  : 'border-primary/10 hover:border-primary/20 hover:bg-card/40'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Suggestion Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {/* Team Badge */}
                  {suggestion.team && (
                    <Badge
                      variant={getTeamBadgeVariant(getTeamColor(suggestion.team))}
                      className="text-xs"
                    >
                      {getTeamLabel(suggestion.team)}
                    </Badge>
                  )}

                  {/* Priority Badge */}
                  {suggestion.priority && (
                    <Badge
                      variant={getPriorityBadgeVariant(
                        getPriorityColor(suggestion.priority)
                      )}
                      className="text-xs"
                    >
                      {suggestion.priority.toUpperCase()}
                    </Badge>
                  )}
                </div>

                {/* Confidence Indicator */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0ec2bc]" />
                  <span className="text-xs font-sans font-medium text-[#0ec2bc]">
                    {confidencePercent}%
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="relative h-1.5 bg-[#000F1F] rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0ec2bc] to-[#0ec2bc]/70 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${confidencePercent}%`,
                    animationDelay: `${index * 100 + 200}ms`,
                  }}
                />
              </div>

              {/* Reason */}
              <p className="text-sm font-sans font-light text-[#C4C8D4] leading-relaxed">
                {suggestion.reason}
              </p>

              {/* Apply Button */}
              <Button
                onClick={() => handleApplySuggestion(suggestion, index)}
                disabled={isApplied}
                className={cn(
                  'w-full h-9 transition-all',
                  isApplied
                    ? 'bg-emerald-500 hover:bg-emerald-500'
                    : 'bg-[#0ec2bc] hover:bg-[#0ec2bc]/90'
                )}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Applied
                  </>
                ) : (
                  'Apply Suggestion'
                )}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
