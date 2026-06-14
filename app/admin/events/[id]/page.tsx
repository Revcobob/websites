import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { EventEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  return (
    <AdminShell title="Edit Event">
      <EventEditor mode="edit" id={params.id} />
    </AdminShell>
  );
}
