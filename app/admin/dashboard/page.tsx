import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { Card, EmptyState } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface OverviewCounts {
  subscribersTotal: number;
  subscribersRecent: number;
  contactRecent: number;
  donationRecent: number;
  eventsUpcoming: number;
  updatesDraft: number;
  documentsRecent: { id: string; title: string | null; created_at: string }[];
}

async function loadOverview(): Promise<OverviewCounts | null> {
  if (!supabaseConfigured()) return null;
  const sb = supabaseService();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [subTotal, subRecent, contactRecent, donationRecent, eventsUpcoming, updatesDraft, docs] = await Promise.all([
    sb.from('subscribers').select('*', { head: true, count: 'exact' }),
    sb.from('subscribers').select('*', { head: true, count: 'exact' }).gte('created_at', since),
    sb.from('contact_inquiries').select('*', { head: true, count: 'exact' }).gte('created_at', since),
    sb.from('donation_inquiries').select('*', { head: true, count: 'exact' }).gte('created_at', since),
    sb.from('events').select('*', { head: true, count: 'exact' }).eq('status', 'published'),
    sb.from('news_posts').select('*', { head: true, count: 'exact' }).eq('status', 'draft'),
    sb.from('documents').select('id,title,created_at').order('created_at', { ascending: false }).limit(5)
  ]);
  return {
    subscribersTotal: subTotal.count ?? 0,
    subscribersRecent: subRecent.count ?? 0,
    contactRecent: contactRecent.count ?? 0,
    donationRecent: donationRecent.count ?? 0,
    eventsUpcoming: eventsUpcoming.count ?? 0,
    updatesDraft: updatesDraft.count ?? 0,
    documentsRecent: (docs.data ?? []) as OverviewCounts['documentsRecent']
  };
}

export default async function DashboardPage() {
  const { email } = await requireAdmin();
  const data = await loadOverview();

  return (
    <AdminShell title="Welcome back" subtitle={email}>
      {!data ? (
        <EmptyState
          title="Connect Supabase to see live numbers"
          body="Once NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in the environment, this dashboard will show subscriber counts, recent inquiries, and upcoming events."
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Total subscribers" value={data.subscribersTotal} />
            <Stat label="New subscribers (7d)" value={data.subscribersRecent} />
            <Stat label="Contact inquiries (7d)" value={data.contactRecent} />
            <Stat label="Donation inquiries (7d)" value={data.donationRecent} />
            <Stat label="Upcoming events" value={data.eventsUpcoming} />
            <Stat label="Drafts pending" value={data.updatesDraft} />
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-serif text-xl text-ink font-semibold">Quick edits</h2>
              <p className="text-sm text-ink-mute mt-1">Jump straight to the pages most people update.</p>
              <ul className="mt-4 space-y-2">
                <QuickLink href="/admin/pages/homepage" label="Edit the homepage" />
                <QuickLink href="/admin/giving" label="Edit the donation page copy" />
                <QuickLink href="/admin/events" label="Manage events" />
                <QuickLink href="/admin/letters" label="Manage letters of support" />
                <QuickLink href="/admin/updates" label="Post a project update" />
              </ul>
            </Card>
            <Card>
              <h2 className="font-serif text-xl text-ink font-semibold">Recent uploads</h2>
              <p className="text-sm text-ink-mute mt-1">The latest files added to the document library.</p>
              {data.documentsRecent.length === 0 ? (
                <p className="mt-4 text-sm text-ink-mute italic">No documents yet — start by uploading the project overview PDF.</p>
              ) : (
                <ul className="mt-4 divide-y divide-sand-deep">
                  {data.documentsRecent.map(d => (
                    <li key={d.id} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="text-ink">{d.title ?? 'Untitled'}</span>
                      <span className="text-ink-mute text-xs">{new Date(d.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-ink-mute font-semibold">{label}</p>
      <p className="mt-2 font-serif text-3xl text-teal font-semibold">{value.toLocaleString()}</p>
    </Card>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink hover:bg-sand transition-colors">
        <span>{label}</span>
        <span aria-hidden="true" className="text-teal">→</span>
      </Link>
    </li>
  );
}
