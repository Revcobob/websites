import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { SubscribersClient } from './client';

export const dynamic = 'force-dynamic';

export default async function SubscribersPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Email Subscribers"
      subtitle="Everyone who has signed up for updates from the public site."
    >
      <SubscribersClient />
    </AdminShell>
  );
}
