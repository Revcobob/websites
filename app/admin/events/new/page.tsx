import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { EventEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <AdminShell title="New Event" subtitle="Add an event to the public Events page.">
      <EventEditor mode="new" />
    </AdminShell>
  );
}
