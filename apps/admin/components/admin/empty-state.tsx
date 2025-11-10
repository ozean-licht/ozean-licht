import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyStateProps } from '@/types/admin-components';
import { FileQuestion } from 'lucide-react';

/**
 * Empty State Component
 *
 * Displays a friendly message when there's no data to show.
 * Includes optional icon, description, and call-to-action button.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No users found"
 *   description="Get started by creating your first user"
 *   action={{
 *     label: 'Create User',
 *     onClick: () => navigate('/users/new')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const DefaultIcon = icon || <FileQuestion className="h-12 w-12 text-muted-foreground" />;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="text-muted-foreground mb-4">{DefaultIcon}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} variant="default">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
