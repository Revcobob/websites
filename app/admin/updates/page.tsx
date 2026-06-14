import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { UpdatesListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function UpdatesPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Project Updates"
      subtitle="Foundation-authored news and updates."
      actions={<Link href="/admin/updates/new" className="btn-primary">New update</Link>}
    >
      <UpdatesListClient />
    </AdminShell>
  );
}
