'use client';

/**
 * Approval Gate Component
 *
 * Display approval status and allow approve/reject actions.
 * Part of Project Management MVP Phase 2 - Content Production
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, XCircle, MinusCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ApprovalGateProps {
  entityId: string;
  entityType: 'task' | 'content_item';
  gateId?: string;
  currentUserId?: string;
  onApprovalChange?: () => void;
  compact?: boolean;
}

interface Approval {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  gate_name: string;
  gate_description?: string;
  gate_is_required?: boolean;
  approved_by_name?: string;
  decided_at?: string;
  comments?: string;
  gate_id: string;
}

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  approved: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
  rejected: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  skipped: { icon: MinusCircle, color: 'text-gray-500', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
};

function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ApprovalGate({
  entityId,
  entityType,
  gateId,
  currentUserId,
  onApprovalChange,
  compact = false,
}: ApprovalGateProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [canApproveMap, setCanApproveMap] = useState<Record<string, boolean>>({});

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/approvals/entity?entityId=${entityId}&entityType=${entityType}`);
      if (!res.ok) throw new Error('Failed to fetch approvals');

      const data = await res.json();
      const filtered = gateId ? data.approvals.filter((a: Approval) => a.gate_id === gateId) : data.approvals;
      setApprovals(filtered);

      if (currentUserId && filtered.length > 0) {
        const permMap: Record<string, boolean> = {};
        await Promise.all(
          filtered.map(async (approval: Approval) => {
            if (approval.status === 'pending') {
              const permRes = await fetch(`/api/approvals/check?userId=${currentUserId}&gateId=${approval.gate_id}`);
              const permData = await permRes.json();
              permMap[approval.id] = permData.canApprove;
            }
          })
        );
        setCanApproveMap(permMap);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load approvals', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [entityId, entityType, gateId]);

  const handleDecision = async (approvalId: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status === 'approved' ? 'approve' : 'reject'}?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comments: comment || undefined }),
      });
      if (!res.ok) throw new Error('Failed to update approval');

      toast({ title: 'Success', description: `Approval ${status}` });
      setSelectedId(null);
      setComment('');
      fetchApprovals();
      onApprovalChange?.();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update approval', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  if (loading) return <div className="flex items-center justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
  if (approvals.length === 0) return compact ? null : <p className="text-sm text-[#C4C8D4]">No approvals required</p>;

  return (
    <div className="space-y-3">
      {approvals.map((approval) => {
        const { icon: StatusIcon, color, bgColor, borderColor } = STATUS_CONFIG[approval.status];
        const isExpanded = expandedIds.has(approval.id);
        const canApprove = canApproveMap[approval.id] ?? false;

        if (compact) {
          return (
            <div key={approval.id} className={cn('flex items-center gap-2 p-2 rounded-lg border', bgColor, borderColor)}>
              <StatusIcon className={cn('w-4 h-4', color)} />
              <span className="text-sm text-white flex-1">{approval.gate_name}</span>
              <Badge variant="outline" className={cn('text-xs', color, borderColor)}>{approval.status}</Badge>
            </div>
          );
        }

        return (
          <Card key={approval.id} className={cn('bg-card/50 border-primary/20', borderColor)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <StatusIcon className={cn('w-5 h-5', color)} />
                    {approval.gate_name}
                    {approval.gate_is_required && <Badge variant="outline" className="text-xs">Required</Badge>}
                  </CardTitle>
                  {approval.gate_description && <CardDescription className="mt-1">{approval.gate_description}</CardDescription>}
                </div>
                <Badge variant="outline" className={cn('text-xs capitalize', color, borderColor)}>{approval.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {approval.decided_at && (
                <div className="text-xs text-[#C4C8D4]">
                  {approval.approved_by_name && <span>By {approval.approved_by_name} </span>}on {formatDateTime(approval.decided_at)}
                </div>
              )}
              {approval.comments && <div className="p-2 rounded bg-background/50 border border-primary/10 text-sm text-[#C4C8D4]">{approval.comments}</div>}

              {approval.status === 'pending' && canApprove && (
                <>
                  <button
                    onClick={() => toggleExpanded(approval.id)}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Add comment or decide
                  </button>

                  {isExpanded && (
                    <div className="space-y-2 pt-2 border-t border-primary/10">
                      <Textarea
                        placeholder="Optional comment..."
                        value={selectedId === approval.id ? comment : ''}
                        onChange={(e) => {
                          setSelectedId(approval.id);
                          setComment(e.target.value);
                        }}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleDecision(approval.id, 'approved')} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
                          {actionLoading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDecision(approval.id, 'rejected')} disabled={actionLoading}>
                          {actionLoading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
