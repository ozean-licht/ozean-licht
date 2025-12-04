/**
 * useConversationPolling Hook
 *
 * Provides real-time updates for support conversations via polling.
 * Auto-pauses when browser tab is not visible to save resources.
 */

"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Conversation, ConversationListOptions } from '@/types/support';

interface UseConversationPollingOptions extends ConversationListOptions {
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  pollInterval?: number;
  /** Whether polling is enabled (default: true) */
  enabled?: boolean;
}

interface UseConversationPollingResult {
  conversations: Conversation[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useConversationPolling(
  options: UseConversationPollingOptions = {}
): UseConversationPollingResult {
  const {
    pollInterval = 30000,
    enabled = true,
    status,
    team,
    channel,
    assignedAgentId,
    search,
    limit = 50,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  // Build query params
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (team) params.append('team', team);
    if (channel) params.append('channel', channel);
    if (assignedAgentId) params.append('assignedAgentId', assignedAgentId);
    if (search) params.append('search', search);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append('orderBy', orderBy);
    params.append('orderDirection', orderDirection);
    return params.toString();
  }, [status, team, channel, assignedAgentId, search, limit, offset, orderBy, orderDirection]);

  // Fetch conversations
  const fetchConversations = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const queryString = buildQueryParams();
      const response = await fetch(`/api/support/conversations?${queryString}`);

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);
      setTotal(data.total || 0);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchConversations(true);
  }, [fetchConversations]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';

      // If becoming visible, immediately refresh
      if (isVisibleRef.current && enabled) {
        fetchConversations(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, fetchConversations]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial fetch
    fetchConversations(true);

    // Setup polling
    intervalRef.current = setInterval(() => {
      // Only poll if tab is visible
      if (isVisibleRef.current) {
        fetchConversations(false);
      }
    }, pollInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, pollInterval, fetchConversations]);

  // Refetch when filter options change
  useEffect(() => {
    if (enabled) {
      fetchConversations(true);
    }
  }, [status, team, channel, assignedAgentId, search, limit, offset, orderBy, orderDirection, enabled, fetchConversations]);

  return {
    conversations,
    total,
    loading,
    error,
    refresh,
    lastUpdated,
  };
}

export default useConversationPolling;
