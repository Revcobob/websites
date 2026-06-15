import { supabaseAnon } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';
import type {
  PageRow, PageSection, EventItem, NewsPost, HonorRollEntry, LetterOfSupport,
  DocumentItem, TimelineMilestone, MediaCoverageItem, SiteSettings, DonationContent
} from './types';
import type { CmsPagePayload } from '@/lib/injectCmsContent';
import { renderEventsList, renderNewsList, renderHonorRoll, renderLetters, renderDocuments, renderTimeline, renderMediaCoverage, renderOfficers, renderBoardMembers, renderStaffAdvisors } from './render';

// Pages whose HTML file slug we recognise; anything else is bypassed.
export const PUBLIC_PAGES: Record<string, string> = {
  '/mhlc-homepage.html':           'homepage',
  '/mhlc-overview.html':           'overview',
  '/mhlc-foundation.html':         'foundation',
  '/mhlc-give.html':               'give',
  '/mhlc-events.html':             'events',
  '/mhlc-contributors.html':       'contributors',
  '/mhlc-letters-of-support.html': 'letters',
  '/mhlc-resources.html':          'resources',
  '/mhlc-contact.html':            'contact'
};

export function pageSlugFromPath(pathname: string): string | null {
  return PUBLIC_PAGES[pathname] ?? (pathname === '/' ? 'homepage' : null);
}

interface BuildArgs {
  slug: string;
}

// Build the full CMS payload (sections + SEO + list slots) for one page.
// Returns null if Supabase isn't configured or the page row is missing —
// the middleware then ships the original HTML untouched.
export async function buildPageContent({ slug }: BuildArgs): Promise<CmsPagePayload | null> {
  if (!supabaseConfigured()) return null;
  const sb = supabaseAnon();

  const [pageRes, sectionsRes] = await Promise.all([
    sb.from('pages').select('*').eq('slug', slug).maybeSingle(),
    sb.from('page_sections').select('*').eq('page_slug', slug).order('order_index', { ascending: true })
  ]);

  const page = (pageRes.data as PageRow | null) ?? null;
  const sections = (sectionsRes.data as PageSection[] | null) ?? [];
  if (!page && sections.length === 0) return null;

  const listSlots = await buildListSlots(slug);
  return {
    slug,
    sections: sections.map(s => ({
      section_key: s.section_key,
      eyebrow: s.eyebrow,
      heading: s.heading,
      body: s.body,
      image_url: s.image_url,
      image_alt: s.image_alt,
      cta_label: s.cta_label,
      cta_href: s.cta_href
    })),
    listSlots,
    seo: {
      title:         page?.seo_title || undefined,
      description:   page?.seo_description || undefined,
      ogTitle:       page?.og_title || undefined,
      ogDescription: page?.og_description || undefined,
      ogImage:       page?.og_image || undefined,
      canonical:     page?.canonical_path || undefined
    }
  };
}

async function buildListSlots(slug: string): Promise<{ key: string; html: string }[]> {
  const sb = supabaseAnon();
  const slots: { key: string; html: string }[] = [];

  switch (slug) {
    case 'homepage': {
      const [news, timeline, milestones] = await Promise.all([
        sb.from('news_posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
        sb.from('events').select('*').eq('status', 'published').order('event_date', { ascending: true }).limit(3),
        sb.from('timeline_milestones').select('*').order('order_index', { ascending: true })
      ]);
      slots.push({ key: 'news',     html: renderNewsList((news.data as NewsPost[]) ?? []) });
      slots.push({ key: 'events',   html: renderEventsList((timeline.data as EventItem[]) ?? []) });
      slots.push({ key: 'timeline', html: renderTimeline((milestones.data as TimelineMilestone[]) ?? []) });
      break;
    }
    case 'events': {
      const upcoming = await sb.from('events').select('*').in('status', ['published']).order('event_date', { ascending: true });
      const past = await sb.from('events').select('*').eq('status', 'past').order('event_date', { ascending: false }).limit(12);
      slots.push({ key: 'events_upcoming', html: renderEventsList((upcoming.data as EventItem[]) ?? []) });
      slots.push({ key: 'events_past',     html: renderEventsList((past.data as EventItem[]) ?? [], { variant: 'past' }) });
      break;
    }
    case 'contributors': {
      const honor = await sb.from('honor_roll').select('*').eq('published', true).order('order_index', { ascending: true });
      slots.push({ key: 'honor_roll', html: renderHonorRoll((honor.data as HonorRollEntry[]) ?? []) });
      break;
    }
    case 'letters': {
      const letters = await sb.from('letters_of_support').select('*').eq('status', 'published').order('order_index', { ascending: true });
      slots.push({ key: 'letters', html: renderLetters((letters.data as LetterOfSupport[]) ?? []) });
      break;
    }
    case 'resources':
    case 'overview': {
      const docs = await sb.from('documents').select('*').eq('status', 'published').order('order_index', { ascending: true });
      slots.push({ key: 'documents', html: renderDocuments((docs.data as DocumentItem[]) ?? []) });
      break;
    }
    case 'foundation': {
      const [press, people] = await Promise.all([
        sb.from('media_coverage').select('*').order('order_index', { ascending: true }),
        sb.from('board_members').select('*').eq('published', true).order('order_index', { ascending: true })
      ]);
      slots.push({ key: 'media_coverage', html: renderMediaCoverage((press.data as MediaCoverageItem[]) ?? []) });
      const everyone = (people.data ?? []) as import('./types').BoardMember[];
      slots.push({ key: 'officers',  html: renderOfficers(everyone.filter(p => p.category === 'officers')) });
      slots.push({ key: 'board_members', html: renderBoardMembers(everyone.filter(p => p.category === 'board')) });
      slots.push({ key: 'staff_advisors', html: renderStaffAdvisors(everyone.filter(p => p.category === 'staff')) });
      break;
    }
  }
  return slots;
}

// Lightweight singletons used by the admin overview, etc.
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!supabaseConfigured()) return null;
  const sb = supabaseAnon();
  const { data } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
  return (data as SiteSettings) ?? null;
}

export async function fetchDonationContent(): Promise<DonationContent | null> {
  if (!supabaseConfigured()) return null;
  const sb = supabaseAnon();
  const { data } = await sb.from('donation_content').select('*').eq('id', 1).maybeSingle();
  return (data as DonationContent) ?? null;
}
