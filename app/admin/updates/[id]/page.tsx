import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { UpdateEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function EditUpdatePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  return (
    <AdminShell title="Edit Update">
      <UpdateEditor mode="edit" id={params.id} />
    </AdminShell>
  );
}
