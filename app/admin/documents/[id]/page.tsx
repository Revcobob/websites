import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { DocumentEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  return (
    <AdminShell title="Edit Document">
      <DocumentEditor mode="edit" id={params.id} />
    </AdminShell>
  );
}
