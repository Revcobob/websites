import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { BoardMemberEditor } from '../editor';

export const dynamic = 'force-dynamic';

export default async function NewBoardMemberPage() {
  await requireAdmin();
  return (
    <AdminShell title="Add Board Member" subtitle="Add an officer, board member, or staff/advisor.">
      <BoardMemberEditor mode="new" />
    </AdminShell>
  );
}
