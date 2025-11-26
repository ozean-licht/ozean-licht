import { Skeleton } from '@/lib/ui';

interface ListSkeletonProps {
  /** Number of list items to display (default: 5) */
  items?: number;
}

/**
 * List Skeleton Component
 *
 * Loading skeleton for list layouts with avatar, text, and action button.
 * Ideal for user lists, notification lists, or activity feeds.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <ListSkeleton items={10} />
 * ) : (
 *   <ul>
 *     {users.map(user => <UserListItem key={user.id} user={user} />)}
 *   </ul>
 * )}
 * ```
 */
export function ListSkeleton({ items = 5 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
