import Link from 'next/link';
import { AdminShell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

const FRIENDLY: Record<string, { title: string; sub: string; href: string }> = {
  homepage:     { title: 'Homepage',                       sub: 'Hero, vision, the need, services, partners, families, updates.', href: '/admin/pages/homepage' },
  overview:     { title: 'Project Overview',               sub: 'The Project page — vision, care model, campus, downloads.',     href: '/admin/pages/overview' },
  foundation:   { title: 'About the Foundation',           sub: 'Board, financials, press coverage.',                            href: '/admin/pages/foundation' },
  give:         { title: 'Give / Donation Page',           sub: 'Hero copy, suggested amounts, FAQ, mailing address.',           href: '/admin/giving' },
  events:       { title: 'Events',                         sub: 'Page hero + upcoming/past event sections.',                      href: '/admin/pages/events' },
  contributors: { title: 'Honor Roll',                     sub: 'Hero copy and recognition language.',                            href: '/admin/pages/contributors' },
  letters:      { title: 'Letters of Support',             sub: 'Page hero and category copy.',                                   href: '/admin/pages/letters' },
  resources:    { title: 'Resources for Families',         sub: 'Family resources, downloads, helpline information.',             href: '/admin/pages/resources' },
  contact:      { title: 'Contact',                        sub: 'Phone, email, office hours, and supporting copy.',               href: '/admin/pages/contact' }
};

async function fetchPageList(): Promise<{ slug: string; updated_at: string | null }[]> {
  if (!supabaseConfigured()) return [];
  const sb = supabaseService();
  const { data } = await sb.from('pages').select('slug, updated_at').order('slug');
  return (data as any[]) ?? [];
}

export default async function PageContentList() {
  await requireAdmin();
  const rows = await fetchPageList();
  const byslug = new Map(rows.map(r => [r.slug, r]));

  return (
    <AdminShell
      title="Page Content"
      subtitle="Edit the text, images, and calls-to-action on each public page."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(FRIENDLY).map(([slug, info]) => {
          const seen = byslug.get(slug);
          return (
            <Card key={slug}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-ink font-semibold">{info.title}</h3>
                  <p className="text-sm text-ink-mute mt-1">{info.sub}</p>
                </div>
                <Link href={info.href} className="btn-secondary shrink-0">Edit →</Link>
              </div>
              {seen?.updated_at && (
                <p className="text-xs text-ink-mute mt-3">Last updated {new Date(seen.updated_at).toLocaleString()}</p>
              )}
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
