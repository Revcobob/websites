import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { EventsListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Events"
      subtitle="Drafts, upcoming, canceled, and past events for the public Events page."
      actions={<Link href="/admin/events/new" className="btn-primary">New event</Link>}
    >
      <EventsListClient />
    </AdminShell>
  );
}
