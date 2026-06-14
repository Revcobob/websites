import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { MediaCoverageClient } from './client';

export const dynamic = 'force-dynamic';

export default async function MediaCoveragePage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Media Coverage"
      subtitle="External press and media coverage to feature on the public site."
    >
      <MediaCoverageClient />
    </AdminShell>
  );
}
