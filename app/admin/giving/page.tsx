import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { GivingEditor } from './editor';
import { fetchDonationContent } from '@/lib/resources/publicContent';

export const dynamic = 'force-dynamic';

export default async function GivingPage() {
  await requireAdmin();
  const content = await fetchDonationContent();
  return (
    <AdminShell
      title="Donation Page"
      subtitle="The Give page copy — suggested amounts, FAQ, EIN, mailing address, and call-to-action."
    >
      <GivingEditor initial={content} />
    </AdminShell>
  );
}
