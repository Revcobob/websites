import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { TimelineClient } from './client';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Project Timeline"
      subtitle="Milestones shown in the campaign progress section — vision sparked, federal earmark, design, groundbreaking, opening day, and so on."
    >
      <TimelineClient />
    </AdminShell>
  );
}
