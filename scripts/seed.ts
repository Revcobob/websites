/*
 * Seed the Supabase database with the real public-site content. The page
 * sections are populated from cms-pages/_extracted.json, which is
 * produced by scripts/annotate-pages.js — that script also adds the
 * matching data-cms attributes to the HTML so admin edits actually
 * appear on the public page.
 *
 * Idempotent — safe to re-run.
 * Usage: npm run seed
 */
import './loadEnv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

// Decode the few HTML entities the extractor leaves in.
function decode(s: string | null | undefined): string | null {
  if (!s) return s ?? null;
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface ExtractedSection {
  label: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
}

type Extracted = Record<string, Record<string, ExtractedSection>>;

const extractedPath = resolve(__dirname, '..', 'cms-pages', '_extracted.json');
const extracted: Extracted = JSON.parse(readFileSync(extractedPath, 'utf8'));

const PAGES_META: Record<string, { display_name: string; seo_title: string; seo_description: string }> = {
  homepage:     { display_name: 'Homepage',                seo_title: 'Memory Health Life Center · Quitman, Texas',           seo_description: 'A 54-bed, Hogeweyk-inspired memory care campus for East Texas, built by the Wood County Health Care Foundation in Quitman, Texas.' },
  overview:     { display_name: 'Project Overview',        seo_title: 'Project Overview · Memory Health Life Center',         seo_description: 'A 29-acre brain-health village in Quitman, Texas — mission, site, care model, downloads.' },
  foundation:   { display_name: 'About the Foundation',    seo_title: 'Wood County Health Care Foundation',                   seo_description: 'A 501(c)(3) nonprofit stewarding health care in Wood County since 1989.' },
  give:         { display_name: 'Give',                    seo_title: 'Support the Campaign · Memory Health Life Center',     seo_description: 'Every gift moves the Memory Health Life Center closer to opening day.' },
  events:       { display_name: 'Events',                  seo_title: 'Events · Memory Health Life Center',                   seo_description: 'Caregiver workshops, community gatherings, and foundation briefings.' },
  contributors: { display_name: 'Honor Roll',              seo_title: 'Honor Roll · Memory Health Life Center',               seo_description: 'The founding contributors who built this campaign — gift by gift.' },
  letters:      { display_name: 'Letters of Support',      seo_title: 'Letters of Support · Memory Health Life Center',       seo_description: 'Letters from federal, state, academic, medical, and community leaders.' },
  resources:    { display_name: 'Resources for Families',  seo_title: 'Resources for Families · Memory Health Life Center',   seo_description: 'Curated resources for dementia caregivers and East Texas families: helplines, support, education.' },
  contact:      { display_name: 'Contact',                 seo_title: 'Contact · Memory Health Life Center',                  seo_description: 'Talk to a real person at the Wood County Health Care Foundation.' }
};

async function upsertPage(slug: string) {
  const meta = PAGES_META[slug];
  if (!meta) return;
  const { error } = await sb.from('pages').upsert(
    { slug, display_name: meta.display_name, seo_title: meta.seo_title, seo_description: meta.seo_description },
    { onConflict: 'slug' }
  );
  if (error) throw error;
}

async function upsertSection(slug: string, section_key: string, idx: number, s: ExtractedSection) {
  const { error } = await sb.from('page_sections').upsert({
    page_slug: slug,
    section_key,
    display_label: s.label,
    eyebrow: decode(s.eyebrow),
    heading: decode(s.heading),
    body: decode(s.body),
    cta_label: decode(s.cta_label),
    cta_href: s.cta_href,
    order_index: idx
  }, { onConflict: 'page_slug,section_key' });
  if (error) throw error;
}

async function seedSettings() {
  const { error } = await sb.from('site_settings').upsert({
    id: 1,
    organization_name: 'Wood County Health Care Foundation',
    project_name: 'Memory Health Life Center',
    foundation_name: 'Wood County Health Care Foundation',
    ein: null,
    primary_email: null,
    primary_phone: '(903) 760-9224',
    mailing_address: '405 East Lipscomb St.\nQuitman, TX 75783',
    donate_url: '',
    default_cta_label: 'Donate',
    default_cta_href: '/mhlc-give.html',
    main_nav: [
      { label: 'The Project', href: '/mhlc-overview.html' },
      { label: 'The Need',    href: '/mhlc-homepage.html#need' },
      { label: 'Progress',    href: '/mhlc-homepage.html#progress' },
      { label: 'Families',    href: '/mhlc-resources.html' },
      { label: 'Partners',    href: '/mhlc-letters-of-support.html' },
      { label: 'Contact',     href: '/mhlc-contact.html' }
    ],
    footer_nav: [],
    footer_org_description: 'A 501(c)(3) nonprofit stewarding health care in Wood County since 1989.',
    footer_subscribe_text: 'Get monthly updates as the center is built.',
    social_links: [],
    default_seo_image: ''
  }, { onConflict: 'id' });
  if (error) throw error;
}

async function seedDonation() {
  const give = extracted.give ?? {};
  const heroBody = decode(give.hero?.body) ?? '';
  const heroEyebrow = decode(give.hero?.eyebrow) ?? 'Support the Campaign';
  const heroTitle = decode(give.hero?.heading) ?? 'Help build it.';
  const { error } = await sb.from('donation_content').upsert({
    id: 1,
    hero_eyebrow: heroEyebrow,
    hero_title: heroTitle,
    hero_body: heroBody,
    suggested_amounts_cents: [5000, 10000, 25000, 50000, 100000, 500000],
    frequency_labels: [
      { value: 'one-time', label: 'One-time' },
      { value: 'monthly',  label: 'Monthly' }
    ],
    other_ways_cards: [],
    mailing_address: 'Wood County Health Care Foundation\n405 East Lipscomb St.\nQuitman, TX 75783',
    major_gift_text: 'Major gifts and naming opportunities are available. Contact the foundation to discuss.',
    planned_giving_text: 'Include the foundation in your estate plans through a bequest, IRA, DAF, or stock gift.',
    corporate_text: 'Corporate sponsorship opportunities support the campaign and the region.',
    ein_text: 'EIN pending',
    tax_deductibility_text: 'The Wood County Health Care Foundation is a 501(c)(3) nonprofit. Contributions are tax-deductible to the fullest extent allowed by law.',
    faq: [
      { question: 'Is my gift tax-deductible?', answer: 'Yes. The foundation is a 501(c)(3) and gifts are tax-deductible to the fullest extent allowed.' },
      { question: 'Can I give by check?', answer: 'Yes. Mail checks to the foundation’s mailing address on this page.' }
    ],
    donate_url: '',
    donate_button_label: 'Give Now',
    contact_link: '/mhlc-contact.html'
  }, { onConflict: 'id' });
  if (error) throw error;
}

(async () => {
  console.log('Seeding pages from cms-pages/_extracted.json …');
  for (const slug of Object.keys(PAGES_META)) {
    await upsertPage(slug);
    const sections = extracted[slug] ?? {};
    const keys = Object.keys(sections);
    let i = 0;
    for (const sectionKey of keys) {
      await upsertSection(slug, sectionKey, i++, sections[sectionKey]!);
    }
    console.log(`  ✓ ${slug} (${keys.length} sections)`);
  }
  console.log('Seeding site settings…');
  await seedSettings();
  console.log('Seeding donation content…');
  await seedDonation();
  console.log('Done.');
})().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
