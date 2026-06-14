import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { MediaLibraryClient } from './client';

export const dynamic = 'force-dynamic';

export default async function MediaLibraryPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Media Library"
      subtitle="A central place for the images used across the public site. Upload and copy URLs for reuse."
    >
      <MediaLibraryClient />
    </AdminShell>
  );
}
