import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/admin/Shell';
import { requireAdmin } from '@/lib/clerk';
import { PageEditor } from './editor';
import { supabaseService } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';
import type { PageRow, PageSection } from '@/lib/resources/types';

export const dynamic = 'force-dynamic';

const KNOWN_SLUGS = ['homepage','overview','foundation','events','contributors','letters','resources','contact'];

async function loadPage(slug: string): Promise<{ page: PageRow | null; sections: PageSection[] }> {
  if (!supabaseConfigured()) return { page: null, sections: [] };
  const sb = supabaseService();
  const [p, s] = await Promise.all([
    sb.from('pages').select('*').eq('slug', slug).maybeSingle(),
    sb.from('page_sections').select('*').eq('page_slug', slug).order('order_index')
  ]);
  return { page: (p.data as PageRow | null) ?? null, sections: (s.data as PageSection[]) ?? [] };
}

export default async function EditPagePage({ params }: { params: { slug: string } }) {
  await requireAdmin();
  if (!KNOWN_SLUGS.includes(params.slug)) notFound();
  const { page, sections } = await loadPage(params.slug);
  return (
    <AdminShell
      title={page?.display_name ?? params.slug}
      subtitle="Edit text, images, and links for each section of this page."
    >
      <PageEditor slug={params.slug} initialPage={page} initialSections={sections} />
    </AdminShell>
  );
}
