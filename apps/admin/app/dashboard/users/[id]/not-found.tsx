import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">
          The user you're looking for doesn't exist or has been deleted.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/users">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users List
        </Link>
      </Button>
    </div>
  );
}
