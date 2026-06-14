import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { LetterEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function EditLetterPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  return (
    <AdminShell title="Edit Letter of Support">
      <LetterEditor mode="edit" id={params.id} />
    </AdminShell>
  );
}
