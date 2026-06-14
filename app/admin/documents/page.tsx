import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { DocumentsListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Documents & Downloads"
      subtitle="PDFs and downloadable assets featured on the public site."
      actions={<Link href="/admin/documents/new" className="btn-primary">New document</Link>}
    >
      <DocumentsListClient />
    </AdminShell>
  );
}
