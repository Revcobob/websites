import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { LetterEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function NewLetterPage() {
  await requireAdmin();
  return (
    <AdminShell title="New Letter of Support">
      <LetterEditor mode="new" />
    </AdminShell>
  );
}
