import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { ContactClient } from './client';

export const dynamic = 'force-dynamic';

export default async function ContactInquiriesPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Contact Inquiries"
      subtitle="Messages sent from the public Contact form."
    >
      <ContactClient />
    </AdminShell>
  );
}
