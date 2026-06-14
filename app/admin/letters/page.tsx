import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { LettersListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function LettersPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Letters of Support"
      subtitle="Public letters of support from officials, partners, and community."
      actions={<Link href="/admin/letters/new" className="btn-primary">New letter</Link>}
    >
      <LettersListClient />
    </AdminShell>
  );
}
