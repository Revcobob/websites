import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { HonorRollClient } from './client';

export const dynamic = 'force-dynamic';

export default async function HonorRollPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Honor Roll"
      subtitle="Donors and honorees recognized publicly. Amounts are never shown — only optional level labels."
    >
      <HonorRollClient />
    </AdminShell>
  );
}
