import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { BoardMemberEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function EditBoardMemberPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  return (
    <AdminShell title="Edit Board Member">
      <BoardMemberEditor mode="edit" id={params.id} />
    </AdminShell>
  );
}
