import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { SettingsClient } from './client';
import { fetchSiteSettings } from '@/lib/resources/publicContent';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await fetchSiteSettings();
  return (
    <AdminShell
      title="Site Settings"
      subtitle="Organization details, navigation, social links, and footer content shared across the site."
    >
      <SettingsClient initial={settings} />
    </AdminShell>
  );
}
