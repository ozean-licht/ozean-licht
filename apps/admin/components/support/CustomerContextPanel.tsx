/**
 * CustomerContextPanel Component - Support Management System
 *
 * Right sidebar displaying customer context including user info,
 * course enrollments, payment history, and previous conversations.
 */

'use client';

import React from 'react';
import { CustomerContext } from '@/types/support';
import { getRelativeTime } from '@/types/support';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerContextPanelProps {
  /** Customer context data */
  context: CustomerContext;
  /** Loading state */
  loading?: boolean;
}

/**
 * CustomerContextPanel displays enriched customer information
 *
 * Sections:
 * - User Information (name, email, member since)
 * - Course Enrollments (with progress bars)
 * - Payment History (recent transactions)
 * - Previous Conversations (support history)
 *
 * @example
 * ```tsx
 * <CustomerContextPanel
 *   context={customerContext}
 *   loading={isLoading}
 * />
 * ```
 */
export default function CustomerContextPanel({
  context,
  loading = false,
}: CustomerContextPanelProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // No customer data
  if (!context.user) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <svg
            className="w-12 h-12 text-primary mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-sans font-medium text-white mb-2">
            No customer data
          </h3>
          <p className="text-sm font-sans font-light text-[#C4C8D4]">
            This contact is not linked to a user account
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Information */}
      <Card className="bg-card/70 backdrop-blur-sm border border-border hover:border-primary/20 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-medium text-white">
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-xs font-sans font-medium text-[#C4C8D4]">
              Name
            </span>
            <p className="text-sm font-sans font-light text-white mt-1">
              {context.user.name}
            </p>
          </div>
          <div>
            <span className="text-xs font-sans font-medium text-[#C4C8D4]">
              Email
            </span>
            <p className="text-sm font-sans font-light text-white mt-1">
              {context.user.email}
            </p>
          </div>
          {context.memberSince && (
            <div>
              <span className="text-xs font-sans font-medium text-[#C4C8D4]">
                Member Since
              </span>
              <p className="text-sm font-sans font-light text-white mt-1">
                {new Date(context.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
          <div>
            <span className="text-xs font-sans font-medium text-[#C4C8D4]">
              Total Purchases
            </span>
            <p className="text-sm font-sans font-light text-white mt-1">
              ${context.totalPurchases.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Course Enrollments */}
      {context.courseEnrollments.length > 0 && (
        <Card className="bg-card/70 backdrop-blur-sm border border-border hover:border-primary/20 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-medium text-white">
              Course Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {context.courseEnrollments.map((enrollment) => (
              <div key={enrollment.courseId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans font-medium text-white">
                    {enrollment.courseName}
                  </span>
                  <span className="text-xs font-sans font-medium text-primary">
                    {Math.round(enrollment.progress)}%
                  </span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
                <span className="text-xs font-sans font-light text-[#C4C8D4]">
                  Enrolled {getRelativeTime(enrollment.enrolledAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {context.recentPayments.length > 0 && (
        <Card className="bg-card/70 backdrop-blur-sm border border-border hover:border-primary/20 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-medium text-white">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {context.recentPayments.map((payment, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-sans font-medium text-white">
                    {payment.description}
                  </p>
                  <p className="text-xs font-sans font-light text-[#C4C8D4] mt-1">
                    {getRelativeTime(payment.date)}
                  </p>
                </div>
                <span className="text-sm font-sans font-medium text-primary">
                  {payment.currency} {payment.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Previous Conversations */}
      {context.previousConversations.length > 0 && (
        <Card className="bg-card/70 backdrop-blur-sm border border-border hover:border-primary/20 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-medium text-white">
              Previous Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {context.previousConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <Badge
                    variant={
                      conversation.status === 'resolved' ? 'info' : 'default'
                    }
                  >
                    {conversation.status}
                  </Badge>
                  <p className="text-xs font-sans font-light text-[#C4C8D4] mt-1">
                    {getRelativeTime(conversation.createdAt)}
                  </p>
                </div>
                {conversation.resolvedAt && (
                  <span className="text-xs font-sans font-light text-[#C4C8D4]">
                    Resolved {getRelativeTime(conversation.resolvedAt)}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
