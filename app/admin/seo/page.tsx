import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { SeoClient } from './client';
import { supabaseService } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';
import type { PageRow } from '@/lib/resources/types';

export const dynamic = 'force-dynamic';

const PAGES = [
  { slug: 'homepage',     label: 'Homepage' },
  { slug: 'overview',     label: 'Project Overview' },
  { slug: 'foundation',   label: 'About the Foundation' },
  { slug: 'give',         label: 'Give' },
  { slug: 'events',       label: 'Events' },
  { slug: 'contributors', label: 'Honor Roll' },
  { slug: 'letters',      label: 'Letters of Support' },
  { slug: 'resources',    label: 'Resources' },
  { slug: 'contact',      label: 'Contact' }
];

async function loadAll(): Promise<PageRow[]> {
  if (!supabaseConfigured()) return [];
  const sb = supabaseService();
  const { data } = await sb.from('pages').select('*');
  return (data as PageRow[]) ?? [];
}

export default async function SeoPage() {
  await requireAdmin();
  const rows = await loadAll();
  const map = new Map(rows.map(r => [r.slug, r]));
  const merged = PAGES.map(p => ({
    page: map.get(p.slug) ?? ({
      slug: p.slug,
      display_name: p.label,
      seo_title: null, seo_description: null,
      og_title: null, og_description: null, og_image: null, canonical_path: null,
      updated_at: new Date().toISOString()
    } as PageRow),
    label: p.label
  }));
  return (
    <AdminShell
      title="SEO Settings"
      subtitle="How each page appears in search results and on social media. Leave blank to fall back to the page's default content."
    >
      <SeoClient initial={merged} />
    </AdminShell>
  );
}
