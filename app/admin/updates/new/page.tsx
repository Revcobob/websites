import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { UpdateEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function NewUpdatePage() {
  await requireAdmin();
  return (
    <AdminShell title="New Update" subtitle="Publish a foundation news item.">
      <UpdateEditor mode="new" />
    </AdminShell>
  );
}
