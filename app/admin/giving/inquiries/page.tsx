import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { DonationInquiriesClient } from './client';

export const dynamic = 'force-dynamic';

export default async function DonationInquiriesPage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Donation Inquiries"
      subtitle="Donor information collected from the public donation form. No payment details are ever stored."
    >
      <DonationInquiriesClient />
    </AdminShell>
  );
}
