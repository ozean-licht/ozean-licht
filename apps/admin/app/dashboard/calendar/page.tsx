import { requireAnyRole } from '@/lib/rbac/utils';
import { CalendarContainer } from '@/components/calendar';

export default async function CalendarPage() {
  // Auth check - require any admin role
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_editor', 'ol_content', 'ol_commerce', 'support']);

  return (
    <div className="h-full p-4 md:p-6">
      <CalendarContainer initialView="week" />
    </div>
  );
}
