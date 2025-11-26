import { Skeleton, Card, CardContent, CardHeader } from '@/lib/ui';

interface CardSkeletonProps {
  /** Number of cards to display (default: 3) */
  count?: number;
}

/**
 * Card Grid Skeleton Component
 *
 * Loading skeleton for card grid layouts.
 * Displays a responsive grid of skeleton cards while data is loading.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <CardSkeleton count={6} />
 * ) : (
 *   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 *     {items.map(item => <ItemCard key={item.id} item={item} />)}
 *   </div>
 * )}
 * ```
 */
export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
