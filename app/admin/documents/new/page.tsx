import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { DocumentEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function NewDocumentPage() {
  await requireAdmin();
  return (
    <AdminShell title="New Document">
      <DocumentEditor mode="new" />
    </AdminShell>
  );
}
