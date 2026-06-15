import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { BoardMembersListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function BoardMembersPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Board & Foundation People"
      subtitle="Officers, board members, and staff/advisors shown on the Foundation page."
      actions={<Link href="/admin/board-members/new" className="btn-primary">Add person</Link>}
    >
      <BoardMembersListClient />
    </AdminShell>
  );
}
